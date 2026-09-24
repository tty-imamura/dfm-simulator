// 第279便b(原仮定者の裁定 第69報「QA が長いので対策を行う・確認順を最適化する」・統括の検証項目 R61):
// QA の**実行順と待ち合わせ**だけを扱う純関数群(判定式・閾値・seed・物理時間・母集団には触らない)。
//
//   ① createW5Pool   … W5c ワーカープールの本体。旧実装はユニットが例外を投げると、そのユニットを
//                      待っている `await` が**永遠に解決しない**(ワーカーの async 関数が落ちて deferred が
//                      放置される)ので、QA がハングするか結果 JSON を書かずに終わった。本実装は
//                      (a) ユニットの例外は**そのユニットの待機者へ reject で届ける**(直列経路 QA_SERIAL=1 と
//                      同じ「その場で例外」になる)、(b) ワーカーの起動失敗が続いて**生きたワーカーが 0 に
//                      なったら、待機中の全ジョブを失敗で終える**、(c) 未着手のジョブは主ページが
//                      **横取り(steal)して自分で実行**できる(主ページが待つだけの時間を作らない)。
//   ② makeRecorder / replayEvents … ワーカーで走らせたブロックの add()/console を**記録し、元の位置で
//                      再生**する。結果 JSON の並び・件数・id・detail は直列実行と同じになる。
//   ③ splitTopLevel / unitIds / classifyUnit … tests/qa.mjs の**最上位の文**を列 0 の書式で切り出す
//                      (tests/exp-w258c-qapart.mjs と同じ前提 — 最上位の文は列 0 から始まり、ブロックは
//                      列 0 の `}` で閉じる)。preflight・前回 FAIL の先行再実行・マニフェストが使う。
//   ④ collectFailedIds … 保存済みの結果 JSON から `pass:false` の id を集める。
// Node の組み込みだけで動く(CI の `npm install` に依存を足さない)。

// ---------------------------------------------------------------------------------------------
// ① ワーカープール
// ---------------------------------------------------------------------------------------------
// openWorker(i) → Promise<page>。closeWorker(page) → Promise。log(msg)。
// submit(key, run, { prio }) → handle { key, promise, steal(): boolean, state() }
//   run(page) → Promise<any>。prio が大きいものから取り出す(同点は投入順)。
// close() → Promise(全ワーカーの終了を待つ。生きたワーカーが無ければ残りのジョブを reject する)
export function createW5Pool({ nw, openWorker, closeWorker = async () => {}, log = () => {} }) {
  const queue = [];
  let seq = 0;
  let closed = false;
  let alive = 0;
  let starting = nw;
  const waiters = new Set();
  const wake = () => { for (const w of [...waiters]) w(); waiters.clear(); };
  const pick = () => {
    if (!queue.length) return null;
    let bi = 0;
    for (let i = 1; i < queue.length; i++) {
      const a = queue[i], b = queue[bi];
      if (a.prio > b.prio || (a.prio === b.prio && a.seq < b.seq)) bi = i;
    }
    return queue.splice(bi, 1)[0];
  };
  const failQueued = (why) => {
    while (queue.length) {
      const j = queue.shift();
      j.st = 'failed';
      j.reject(new Error(`W5c: ジョブ ${j.key} は実行されなかった(${why})`));
    }
  };
  const timings = {};
  async function worker(i) {
    let page = null;
    try { page = await openWorker(i); }
    catch (e) {
      starting--;
      log(`[W5c] ワーカー${i} の起動に失敗: ${String(e && e.message || e).slice(0, 160)}`);
      if (alive === 0 && starting === 0) failQueued('全ワーカーの起動に失敗');
      return;
    }
    starting--; alive++;
    try {
      for (;;) {
        const j = pick();
        if (!j) {
          if (closed) break;
          await new Promise((r) => waiters.add(r));
          continue;
        }
        j.st = 'running';
        const t0 = Date.now();
        try {
          const res = await j.run(page);
          j.st = 'done';
          timings[j.key] = { where: 'worker', worker: i, runMs: Date.now() - t0, startAt: t0 };
          log(`  [W5c] ${j.key} 完了 [${((Date.now() - t0) / 1000).toFixed(1)}s]`);
          j.resolve(res);
        } catch (e) {
          j.st = 'failed';
          timings[j.key] = { where: 'worker', worker: i, runMs: Date.now() - t0, startAt: t0, error: String(e && e.message || e).slice(0, 200) };
          log(`  [W5c] ${j.key} 失敗 [${((Date.now() - t0) / 1000).toFixed(1)}s]: ${String(e && e.message || e).slice(0, 160)}`);
          j.reject(e);
        }
      }
    } finally {
      alive--;
      if (alive === 0 && starting === 0) failQueued('生きたワーカーが 0');
      try { await closeWorker(page); } catch {}
    }
  }
  const workers = Array.from({ length: nw }, (_, i) => worker(i));
  return {
    timings,
    submit(key, run, { prio = 0 } = {}) {
      let resolve, reject;
      const promise = new Promise((a, b) => { resolve = a; reject = b; });
      // 未回収の reject で Node が落ちないよう、待機者が付く前の reject を握っておく(待機者には届く)
      promise.catch(() => {});
      const j = { key, run, prio, seq: seq++, st: 'queued', resolve, reject };
      if (closed || (alive === 0 && starting === 0)) {
        j.st = 'failed';
        reject(new Error(`W5c: ジョブ ${key} は実行されなかった(${closed ? 'プールは閉じている' : '生きたワーカーが 0'})`));
      } else { queue.push(j); wake(); }
      return {
        key, promise,
        state: () => j.st,
        steal() {                       // 未着手なら取り下げて呼び出し側が自分で実行する
          const i = queue.indexOf(j);
          if (i < 0) return false;
          queue.splice(i, 1); j.st = 'stolen';
          return true;
        },
      };
    },
    // seal(): 以後の投入を締め切る。ワーカーは残りを処理し終えたら自分のページを閉じて抜ける
    // (旧実装と同じく、キューが空になったワーカーのページを走行の終わりまで残さない)
    seal() { closed = true; wake(); },
    async close() { closed = true; wake(); await Promise.all(workers); failQueued('プールを閉じた'); },
    stats: () => ({ alive, starting, queued: queue.length }),
  };
}

// ---- ワーカーのレンダラの優先度を下げる(Linux の /proc があるときだけ — 他では何もしない)----
// 主ページには実時間で進むことを見る試験(`ab.sync-advance` 等 — setRunning(true) で待つ)があり、
// ワーカーが CPU を取り合うと主ページのアニメーションが遅れる。ワーカーのページを開いた前後で
// **自分のプロセス木の中の** `--type=renderer` の pid を比べ、増えたものだけ nice を上げる
// (他のプロセス — 同じ機械の別の走行 — には触れない)。判定には関係しない(スケジューリングだけ)。
export function ownRendererPids(fsMod, rootPid) {
  const out = new Set();
  let dirs;
  try { dirs = fsMod.readdirSync('/proc'); } catch { return out; }
  const par = new Map(), isR = new Map();
  for (const d of dirs) {
    if (!/^\d+$/.test(d)) continue;
    try {
      const st = fsMod.readFileSync(`/proc/${d}/stat`, 'utf8');
      par.set(Number(d), Number(st.slice(st.lastIndexOf(')') + 2).split(' ')[1]));
      isR.set(Number(d), fsMod.readFileSync(`/proc/${d}/cmdline`, 'utf8').includes('--type=renderer'));
    } catch {}
  }
  for (const [pid, r] of isR) {
    if (!r) continue;
    let p = pid, hops = 0;
    while (p > 1 && hops++ < 64) { p = par.get(p); if (p === rootPid) { out.add(pid); break; } if (p === undefined) break; }
  }
  return out;
}
export function reniceNew(osMod, before, after, nice) {
  const done = [];
  for (const pid of after) if (!before.has(pid)) { try { osMod.setPriority(pid, nice); done.push(pid); } catch {} }
  return done;
}

// ---- 失敗注入の自己試験(Chromium なし — 偽のワーカーで 5 場面を走らせる)----
// 旧実装(第35便 W5c の Promise.all + deferred)を同じ偽ワーカーで再現した `legacyPool` も走らせ、
// 「旧はハングし、新は reject で終わる」を並べて記録する。各場面は timeoutMs で打ち切って判定する。
function legacyPool({ nw, openWorker, units }) {
  // 第35便 W5c の構造そのまま(ユニットごとの try/catch が無い・起動失敗で deferred が残る)
  const deferred = {}, res = {};
  for (const k of Object.keys(units)) res[k] = new Promise((r) => { deferred[k] = r; });
  const queue = Object.keys(units);
  const all = Promise.all(Array.from({ length: nw }, async (_, i) => {
    const wp = await openWorker(i);
    while (queue.length) { const k = queue.shift(); deferred[k](await units[k](wp)); }
  }));
  all.catch(() => {});
  return { get: (k) => res[k], all };
}
const settleWithin = (p, ms) => new Promise((resolve) => {
  const t = setTimeout(() => resolve({ state: 'pending(hang)' }), ms);
  p.then((v) => { clearTimeout(t); resolve({ state: 'fulfilled', value: v }); },
    (e) => { clearTimeout(t); resolve({ state: 'rejected', reason: String(e && e.message || e).slice(0, 120) }); });
});
export async function w5PoolSelfTest({ timeoutMs = 1500 } = {}) {
  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
  const okW = async (i) => ({ id: 'w' + i });
  const badW = async () => { throw new Error('起動失敗(注入)'); };
  const rows = [];
  // S1 正常: 3 ユニットが全部返る
  {
    const p = createW5Pool({ nw: 2, openWorker: okW });
    const hs = ['a', 'b', 'c'].map((k) => p.submit(k, async () => { await sleep(5); return k.toUpperCase(); }));
    const got = await Promise.all(hs.map((h) => settleWithin(h.promise, timeoutMs)));
    await p.close();
    rows.push({ scene: 'S1 正常', ok: got.every((g, i) => g.state === 'fulfilled' && g.value === 'ABC'[i]), got: got.map((g) => g.state) });
  }
  // S2 ユニットが例外 → 待機者へ reject(ハングしない)・他のユニットは返る
  {
    const p = createW5Pool({ nw: 2, openWorker: okW });
    const h1 = p.submit('boom', async () => { await sleep(5); throw new Error('ユニット例外(注入)'); });
    const h2 = p.submit('fine', async () => { await sleep(10); return 42; });
    const g1 = await settleWithin(h1.promise, timeoutMs), g2 = await settleWithin(h2.promise, timeoutMs);
    await p.close();
    const L0 = legacyPool({ nw: 2, openWorker: okW, units: { boom: async () => { await sleep(5); throw new Error('x'); }, fine: async () => 42 } });
    const gL = await settleWithin(L0.get('boom'), timeoutMs);
    rows.push({ scene: 'S2 ユニット例外', ok: g1.state === 'rejected' && g2.state === 'fulfilled' && g2.value === 42,
      got: [g1.state, g2.state], legacy: gL.state });
  }
  // S3 全ワーカーの起動失敗 → 待機中の全ジョブが reject
  {
    const p = createW5Pool({ nw: 3, openWorker: badW });
    const hs = ['a', 'b', 'c', 'd'].map((k) => p.submit(k, async () => k));
    const got = await Promise.all(hs.map((h) => settleWithin(h.promise, timeoutMs)));
    await p.close();
    const L0 = legacyPool({ nw: 3, openWorker: badW, units: { a: async () => 1, b: async () => 2 } });
    const gL = await settleWithin(L0.get('a'), timeoutMs);
    rows.push({ scene: 'S3 全ワーカー起動失敗', ok: got.every((g) => g.state === 'rejected'), got: got.map((g) => g.state), legacy: gL.state });
  }
  // S4 一部のワーカーだけ起動失敗 → 残りのワーカーが全ジョブを処理
  {
    const p = createW5Pool({ nw: 3, openWorker: async (i) => { if (i < 2) throw new Error('注入'); return { id: 'w' + i }; } });
    const hs = ['a', 'b', 'c'].map((k) => p.submit(k, async () => { await sleep(3); return k; }));
    const got = await Promise.all(hs.map((h) => settleWithin(h.promise, timeoutMs)));
    await p.close();
    rows.push({ scene: 'S4 一部ワーカー起動失敗', ok: got.every((g) => g.state === 'fulfilled'), got: got.map((g) => g.state) });
  }
  // S5 横取り(steal): 未着手なら true(呼び出し側が実行)・着手済みなら false
  {
    const p = createW5Pool({ nw: 1, openWorker: okW });
    let release; const gate = new Promise((r) => { release = r; });
    const h1 = p.submit('long', async () => { await gate; return 1; }, { prio: 2 });
    const h2 = p.submit('queued', async () => 2, { prio: 1 });
    await sleep(20);
    const s1 = h1.steal(), s2 = h2.steal();
    release();
    const g1 = await settleWithin(h1.promise, timeoutMs);
    await p.close();
    rows.push({ scene: 'S5 横取り', ok: s1 === false && s2 === true && g1.state === 'fulfilled', got: [s1, s2, g1.state] });
  }
  return { ok: rows.every((r) => r.ok), rows };
}

// ---------------------------------------------------------------------------------------------
// ② ワーカーで走らせるブロックの add()/console の記録と再生
// ---------------------------------------------------------------------------------------------
export function makeRecorder() {
  const events = [];
  const results = [];
  const add = (id, pass, detail) => {
    results.push({ id, pass: !!pass, detail: String(detail ?? '') });
    events.push({ t: 'add', args: [id, pass, detail] });
  };
  const mk = (m) => (...a) => { events.push({ t: 'log', m, args: a }); };
  const con = { log: mk('log'), info: mk('info'), warn: mk('warn'), error: mk('error'), debug: mk('debug') };
  return { add, console: con, results, events };
}
export function replayEvents(events, add, con) {
  for (const e of events) {
    if (e.t === 'add') add(...e.args);
    else (con[e.m] || con.log).apply(con, e.args);
  }
}

// ---------------------------------------------------------------------------------------------
// ③ tests/qa.mjs の最上位の文の切り出し
// ---------------------------------------------------------------------------------------------
// 前提(tests/qa.mjs の書式 — qapart と同じ): 最上位の文は列 0 から始まる。`{` だけの行・`if (…) {` で
// 終わる行・`for (…) {` で終わる行はブロック文で、列 0 の `}` だけの行(`} else {` は続き)で閉じる。
// それ以外(const/let/function/式)は、次に列 0 から始まる文の直前までを 1 文とみなす。
// 戻り値: [{ l0, l1 (1 始まり・両端含む), kind: 'block'|'if'|'for'|'decl'|'fn'|'other', head, text, names }]
export function splitTopLevel(src) {
  const lines = src.split('\n');
  const units = [];
  const isStart = (l) => l.length > 0 && !/^[\s/}\])*.,+:?|&'"`]/.test(l);
  let i = 0;
  while (i < lines.length) {
    const l = lines[i];
    if (!isStart(l)) { i++; continue; }
    const t = l.trimEnd();
    let kind = 'other';
    let end = -1;
    if (t === '{' || (/^(if|for)\b/.test(t) && t.endsWith('{'))) {
      kind = t === '{' ? 'block' : (t.startsWith('if') ? 'if' : 'for');
      let j = i + 1;
      for (; j < lines.length; j++) {
        const x = lines[j].trimEnd();
        if (x === '}') break;
        if (/^} else( if\b.*)? ?\{$/.test(x)) continue;
      }
      end = j;
    } else {
      if (/^(const|let|var)\s/.test(t)) kind = 'decl';
      else if (/^(async\s+)?function\b/.test(t)) kind = 'fn';
      let j = i + 1;
      while (j < lines.length && !isStart(lines[j])) j++;
      end = j - 1;
      // 直後の空行・列 0 コメントは含めない
      while (end > i && (lines[end].trim() === '' || /^\/\//.test(lines[end]))) end--;
    }
    const text = lines.slice(i, end + 1).join('\n');
    const names = [];
    const md = /^(?:export\s+)?(?:const|let|var)\s+([A-Za-z_$][\w$]*)/.exec(t);
    if (md) names.push(md[1]);
    const mf = /^(?:async\s+)?function\s*\*?\s*([A-Za-z_$][\w$]*)/.exec(t);
    if (mf) names.push(mf[1]);
    // W5b の文(`await w5bRun(…); async function W5B_<key>(…) {`)は関数名を持つ
    const mw = /^await w5bRun\([^;]*\);\s*async function ([A-Za-z_$][\w$]*)\(/.exec(t);
    if (mw) names.push(mw[1]);
    units.push({ l0: i + 1, l1: end + 1, kind, head: t.slice(0, 120), text, names });
    i = end + 1;
  }
  return units;
}

// 1 文の中の add() の id(静的リテラル)と接頭辞(`add('preset.' + id` の形)を拾う
export function unitIds(text) {
  const ids = [], prefixes = [];
  for (const m of text.matchAll(/\badd\(\s*'([^'\\]+)'\s*([,+])/g)) {
    if (m[2] === '+') prefixes.push(m[1]); else ids.push(m[1]);
  }
  for (const m of text.matchAll(/\badd\(\s*`([^`$\\]+)\$\{/g)) prefixes.push(m[1]);
  return { ids: [...new Set(ids)], prefixes: [...new Set(prefixes)] };
}

// コメント・文字列・テンプレートの地の文・正規表現リテラルを空白に置き換える(`${…}` の中の式は残す)。
// 簡易字句解析: `/` は直前の意味のある文字が式の終わり(識別子・数・`)`・`]`)でなければ正規表現とみなす。
export function stripLiterals(text) {
  let out = '';
  let i = 0;
  const n = text.length;
  const stack = [];          // テンプレートの `${` の入れ子(括弧の深さを積む)
  let depth = 0;
  let prev = '';             // 直前の意味のある文字(空白・コメント以外)
  let prevWord = '';
  const exprEnd = () => /[\w$)\]]/.test(prev) && !/^(return|typeof|case|do|else|in|of|instanceof|new|delete|void|throw|yield|await)$/.test(prevWord);
  const readTemplate = () => {        // 開始の ` の直後から。`${` に入るか、閉じの ` まで
    while (i < n) {
      const c = text[i];
      if (c === '\\') { out += '  '; i += 2; continue; }
      if (c === '`') { out += '`'; i++; prev = ')'; prevWord = ''; return; }
      if (c === '$' && text[i + 1] === '{') { out += '${'; i += 2; stack.push(depth); depth = 0; prev = '{'; prevWord = ''; return; }
      out += c === '\n' ? '\n' : ' '; i++;
    }
  };
  while (i < n) {
    const c = text[i], d = text[i + 1];
    if (c === '/' && d === '/') { while (i < n && text[i] !== '\n') { out += ' '; i++; } continue; }
    if (c === '/' && d === '*') { out += '  '; i += 2; while (i < n && !(text[i] === '*' && text[i + 1] === '/')) { out += text[i] === '\n' ? '\n' : ' '; i++; } out += '  '; i += 2; continue; }
    if (c === '\'' || c === '"') {
      out += c; i++;
      while (i < n && text[i] !== c && text[i] !== '\n') { if (text[i] === '\\') { out += ' '; i++; } out += ' '; i++; }
      out += c; i++; prev = ')'; prevWord = ''; continue;
    }
    if (c === '`') { out += '`'; i++; readTemplate(); continue; }
    if (c === '/' && !exprEnd()) {
      out += '/'; i++;
      let cls = false;
      while (i < n && text[i] !== '\n') {
        const e = text[i];
        if (e === '\\') { out += '  '; i += 2; continue; }
        if (e === '[') cls = true; else if (e === ']') cls = false;
        else if (e === '/' && !cls) break;
        out += ' '; i++;
      }
      out += '/'; i++;
      while (i < n && /[a-z]/.test(text[i])) { out += text[i]; i++; }
      prev = ')'; prevWord = ''; continue;
    }
    if (c === '{') depth++;
    if (c === '}') {
      if (depth === 0 && stack.length) { depth = stack.pop(); out += '}'; i++; readTemplate(); continue; }
      depth--;
    }
    out += c; i++;
    if (!/\s/.test(c)) {
      prev = c;
      if (/[\w$]/.test(c)) { prevWord = (/[\w$]/.test(text[i - 2] || '') ? prevWord : '') + c; } else prevWord = '';
    }
  }
  return out;
}

// 最上位の名前(const/let/function)で、文が**識別子として**触れているもの(過大評価 — 局所の同名も数える)
export function unitRefs(text, names) {
  const body = stripLiterals(text);
  const out = [];
  for (const n of names) {
    const re = new RegExp('(^|[^\\w$.])' + n.replace(/\$/g, '\\$') + '(?![\\w$])');
    if (re.test(body)) out.push(n);
  }
  return out;
}

// 1 文が実際に依存しうる最上位の名前: 「その文より前で宣言された const/let」+「関数宣言(巻き上げ — どこでも)」。
// その文より後で宣言される const/let の名前は、qa.mjs の通常の直列実行でも未初期化(TDZ)で読めないので、
// 文の中の同名は局所の変数である(`pass`・`commit` 等の汎用名が末尾で宣言されている)。
export function unitDeps(units) {
  const decl = new Map();
  for (const u of units) for (const n of u.names) if (!decl.has(n)) decl.set(n, { l0: u.l0, hoisted: u.kind === 'fn' || /^await w5bRun\(/.test(u.head) });
  const names = [...decl.keys()];
  return units.map((u) => unitRefs(u.text, names).filter((n) => {
    if (u.names.includes(n)) return false;
    const d = decl.get(n);
    return d.hoisted || d.l0 < u.l0;
  }));
}

// 階層(tier):'lint' = ブラウザ(page/browser/ワーカー)に触れない / 'browser' = 主ページで走る /
// 'pooled' = W5c/W5b(並列プール)に載る。htmlDependent = 対象 html(TARGET/INDEX/page)に依る。
export function classifyUnit(u) {
  const t = stripLiterals(u.text);
  const usesPage = /(^|[^\w$.])(page|browser|INDEX)(?![\w$])/.test(t);
  const pooled = /\bw5cGetUnit\(|\bw5bRun\(|\bfpRun\(/.test(t);
  const htmlDependent = usesPage || /(^|[^\w$.])TARGET(?![\w$])/.test(t);
  return { tier: pooled ? 'pooled' : (usesPage ? 'browser' : 'lint'), htmlDependent };
}

// ---------------------------------------------------------------------------------------------
// ④ 前回の FAIL
// ---------------------------------------------------------------------------------------------
// files: [{ path, json }](json は読み込み済みオブジェクト or null)。target が一致するものだけ採る。
export function collectFailedIds(files, target) {
  const out = new Map();
  for (const f of files) {
    const j = f.json;
    if (!j || !Array.isArray(j.results)) continue;
    if (j.target && target && j.target !== target) continue;
    for (const r of j.results) if (r && r.pass === false && typeof r.id === 'string') {
      if (!out.has(r.id)) out.set(r.id, { id: r.id, from: [] });
      out.get(r.id).from.push(f.path);
    }
  }
  return [...out.values()];
}

// 試験の文(add() を呼ぶ最上位の文)。宣言・関数宣言は試験の文ではない(W5b の文は「呼び出し+関数宣言」)。
export function isTestUnit(u) {
  return !(u.kind === 'decl' || u.kind === 'fn') && /(^|[^\w$.])add\(/.test(stripLiterals(u.text));
}
const W5B_HEAD = /^await w5bRun\('([\w$]+)', [^;]*\); (async function W5B_[\w$]+\(page, add, fpRun, console\) \{)\s*$/;
export function w5bHeadKey(line) { const m = W5B_HEAD.exec(line); return m ? m[1] : null; }
// 前回 FAIL の先行再実行用に、qa.mjs の本文から「選んだ試験の文だけが走る」版を作る(行数は保つ)。
//   ・選ばなかった試験の文は空行にする(宣言・関数・準備・終端の保存処理は残す)。
//   ・W5b の文は関数宣言を残し(表 W5B_JOBS が参照する)、選ばなかったものは呼び出しだけを消す。
export function buildReplaySource(src, units, selected) {
  const lines = src.split('\n');
  const keep = new Set(selected.map((u) => u.l0));
  for (const u of units) {
    if (!isTestUnit(u) || keep.has(u.l0)) continue;
    const m = W5B_HEAD.exec(lines[u.l0 - 1]);
    if (m) { lines[u.l0 - 1] = m[2]; continue; }
    for (let k = u.l0 - 1; k <= u.l1 - 1; k++) lines[k] = '';
  }
  return lines.join('\n');
}

// 失敗 id → それを出す最上位の文(静的 id の完全一致、無ければ接頭辞一致)
export function unitsForIds(units, ids) {
  const hit = new Map();
  const missing = [];
  for (const id of ids) {
    let found = false;
    for (const u of units) {
      const { ids: a, prefixes: p } = u.idsCache || (u.idsCache = unitIds(u.text));
      if (a.includes(id) || p.some((x) => id.startsWith(x))) { hit.set(u.l0, u); found = true; }
    }
    if (!found) missing.push(id);
  }
  return { units: [...hit.values()].sort((a, b) => a.l0 - b.l0), missing };
}
