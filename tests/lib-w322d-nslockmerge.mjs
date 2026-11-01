// 第322便d(決断事項 AN509・統括の検証項目 R273): 器 `tests/exp-w272c-nslock.mjs` の**本ごとの行の再利用**(`--merge`)の門 —— 純関数。
//
// ■ 何をするか
//   nslock の正本 `tests/out/nslock-w272c.json` は系(本)ごとの行 `systems[]` を持ち、行ごとに独立に步を進める(系どうしで状態を共有しない ——
//   第321便d の調べ)。前の正本の行のうち、**門 G1〜G8 をすべて通る行だけ**を写し、残りの行を走らせて 1 本の正本に組む。
//   門(1 つでも外れたら再利用しない):
//     G1 器の版・器と lib の sha(code[] の並びの hash)・ページへ入れる lib の sha(pageLibs)・走行の窓(対象 html の名・dt0・刻み・近点の窓・步の上限・壁時計の上限)・本 lib の版
//     G2 環境(Node・V8・Chromium の版・platform・arch)
//     G3 核の hash(領域の宣言の依存閉包の関数・HP の口・S._core・定数 —— 本を除いた全部。受理器・步の関数を変えた便は必ず全走)
//     G4 行の入力(行ごと): 行が読む本〔自分と台帳の元の本〕の生の定義と受理後の定義の hash・行が読む観測 CSV の行と旧共同根の hash・内蔵の宣言の控え(builtinDeclared)
//     G5 行の集合と順(削除・ID の変更・並べ替え)
//     G6 失敗行(行ごと): error の行・変種の欠け・段の欠け・ok でない段・壁時計で止めた段(resource-limit —— 再走で同じ値にならない)/ 前の走行のページの例外(全体)
//     G7 全体集計: 前の正本の meta.stages = 行の段の数の和(途中で止まった正本は持たない)—— 組んだ正本の集計は行から作り直す
//     G8 --only の範囲: --only の系が器に在る・--variants と併用しない
//   G1・G2・G3・G5・G7・G8 と G6 の全体の項は**正本全体**の門(外れたら全走)。G4・G6 の行の項は**行ごと**の門(外れた行は再利用せずに走らせる)。
//   今の正本(第321便の鎖の走行)は環境・核・本の hash を持たないので、**最初の走行は全走**(G1 本 lib の版・G2・G3 が外れる)。
//
// ■ 言わないこと
//   「門を通った行は物理として正しい」(門は**同じ入力・同じコード・同じ環境なら同じ行**であることだけを見る)。
//   「鎖は --merge で回す」(本便は**影の運用** —— 鎖の段の宣言は全走のまま。全走の走行で門を評価し、再利用できたはずの行と新しい行の一致を印字する)。
import crypto from 'node:crypto';

export const MERGE_VERSION = 'w322d-nslock-merge-1';
/** 全走と --merge の一致の照合で外す欄(実行の時刻・所要・再利用の記録)。 */
export const VOLATILE_META = ['at', 'spentSec', 'merge'];
/** 正本全体の門と行ごとの門。 */
export const GLOBAL_GATES = ['G1', 'G2', 'G3', 'G5', 'G7', 'G8'];
export const ROW_GATES = ['G4', 'G6'];

/** 正準 JSON(鍵を並べ替える —— 配列の順は保つ)。 */
export function canonText(v) {
  if (v === null || typeof v !== 'object') return JSON.stringify(v === undefined ? null : v);
  if (Array.isArray(v)) return '[' + v.map(canonText).join(',') + ']';
  return '{' + Object.keys(v).sort().filter((k) => v[k] !== undefined).map((k) => JSON.stringify(k) + ':' + canonText(v[k])).join(',') + '}';
}
export const sha256Of = (s) => crypto.createHash('sha256').update(String(s)).digest('hex');

/** 核の hash(領域 hash の内訳 parts から本を除いた全部)。 */
export function coreShaOf(parts, scopeVersion) {
  const p = parts || {};
  return sha256Of(canonText({ v: MERGE_VERSION, scope: scopeVersion || null, closure: p.closure || null, hp: p.hp || null, core: p.core === undefined ? null : p.core, consts: p.consts || null }));
}
/** 本の hash(生の定義・受理後の定義 —— 説明文の欄を除いた正準形の sha)。 */
export function bookShaOf(parts, ids) {
  const p = parts || {};
  return Object.fromEntries((ids || []).map((id) => [id, { raw: (p.presetsRaw || {})[id] || null, accepted: (p.presetsAccepted || {})[id] || null }]));
}
/** 行の入力の hash(行が読む観測 CSV の行〔ファイルの順〕と旧共同根)。 */
export function rowInputSha(o) { return sha256Of(canonText(o || null)); }
/** 行の段の数の和(全体集計を行から作る)。 */
export function stagesOfRows(systems) {
  return (systems || []).reduce((a, s) => a + ((s && s.variants) || []).reduce((q, v) => q + ((v && v.stages) || []).length, 0), 0);
}
/** 行が持つはずの変種の並び(旧共同根が無い系は root の列を持たない)。 */
export function expectedTags(row) {
  return ['builtin', 'lock'].concat(row && row.savedRoot ? ['root'] : []).concat(['kf0Ledger', 'corr', 'newton']);
}
/** 失敗行の理由(無ければ null)。nDivs = 刻みの段の数。 */
export function rowFailure(row, nDivs) {
  if (!row || typeof row !== 'object') return '行が無い';
  if (row.error) return 'error の行(' + String(row.error).slice(0, 40) + ')';
  const tags = (row.variants || []).map((v) => v && v.tag);
  const want = expectedTags(row);
  if (tags.join(',') !== want.join(',')) return '変種の並びが ' + tags.join('/') + '(期待 ' + want.join('/') + ')';
  for (const v of row.variants) {
    const st = v.stages || [];
    if (st.length !== nDivs) return v.tag + ' の段が ' + st.length + '(期待 ' + nDivs + ')';
    for (const s of st) {
      if (!s || !s.ok) return v.tag + ' の段 div ' + (s && s.div) + ' が ok でない';
      if (s.stopped === 'resource-limit') return v.tag + ' の段 div ' + s.div + ' は壁時計で止めた(再走で同じ値にならない)';
    }
  }
  return null;
}
const same = (a, b) => canonText(a) === canonText(b);

/**
 * 再利用の門。
 * @param {{prev:object|null, cur:object, only:string[], variants:string[]|null}} o
 *   cur = { harness, codeSha256, pageLibs, params:{target,dt0,divs,periWindow,maxSteps,wallMs}, env, coreSha256,
 *           books:{id:{raw,accepted}}, rowInputs:{id:sha}, systems:[id…](器の順), deps:{id:[本…]}, builtin:[builtinDeclared の行…] }
 * @returns {{mode:'merge'|'full', why:string[], reuse:string[], run:string[], rerun:{id:string,why:string[]}[]}}
 */
export function mergeGate(o) {
  const prev = o && o.prev, cur = o.cur, only = (o && o.only) || [];
  const why = [];
  if (!prev || typeof prev !== 'object' || !prev.meta) {
    why.push('前の正本が無い(全走)');
    return { mode: 'full', why, reuse: [], run: cur.systems.slice(), rerun: [] };
  }
  const pm = prev.meta;
  // G1
  if (!pm.merge || pm.merge.version !== MERGE_VERSION) why.push('G1 再利用の門の版が無いか違う(' + ((pm.merge && pm.merge.version) || '旧形式') + ')—— 初回は全走');
  if (pm.harness !== cur.harness) why.push('G1 器の版(' + pm.harness + ' → ' + cur.harness + ')');
  if (pm.codeSha256 !== cur.codeSha256) why.push('G1 器と lib の sha(codeSha256)');
  if (!same(pm.pageLibs || null, cur.pageLibs)) why.push('G1 ページへ入れる lib の sha(pageLibs)');
  for (const k of ['target', 'dt0', 'divs', 'periWindow', 'maxSteps', 'wallMs']) if (!same(pm[k], cur.params[k])) why.push('G1 走行の窓 ' + k + '(' + canonText(pm[k]) + ' → ' + canonText(cur.params[k]) + ')');
  // G2
  if (!pm.env) why.push('G2 環境の記録が無い(初回は全走)');
  else if (!same(pm.env, cur.env)) why.push('G2 環境(' + Object.keys(cur.env).filter((k) => !same(pm.env[k], cur.env[k])).join('・') + ')');
  // G3
  if (!pm.coreSha256) why.push('G3 核の hash が無い');
  else if (pm.coreSha256 !== cur.coreSha256) why.push('G3 核(依存閉包の関数・HP の口・S._core・定数)が違う');
  // G5
  const ids = (prev.systems || []).map((s) => s && s.id);
  if (ids.join(',') !== cur.systems.join(',')) why.push('G5 行の集合と順(前 ' + ids.join(',').slice(0, 90) + ')');
  // G6(全体)
  if ((prev.pageErrors || []).length) why.push('G6 前の走行にページの例外 ' + prev.pageErrors.length + ' 件(行に帰せない)');
  // G7
  if (!(Number.isInteger(pm.stages) && pm.stages === stagesOfRows(prev.systems))) why.push('G7 全体集計 meta.stages(' + pm.stages + ')が行の段の数の和(' + stagesOfRows(prev.systems) + ')と違う');
  // G8
  for (const x of only) if (!cur.systems.includes(x)) why.push('G8 --only の系が器に無い: ' + x);
  if (o.variants && o.variants.length) why.push('G8 --variants と --merge は併用しない(行が欠ける)');
  if (why.length) return { mode: 'full', why, reuse: [], run: cur.systems.slice(), rerun: [] };
  // 行ごと(G4・G6)
  const nDivs = Array.isArray(cur.params.divs) ? cur.params.divs.length : 0;
  const reuse = [], rerun = [];
  const bi = (list, id) => (list || []).find((z) => z && z.id === id) || null;
  for (const id of cur.systems) {
    if (only.includes(id)) continue;
    const r = prev.systems.find((s) => s.id === id);
    const w = [];
    const f = rowFailure(r, nDivs);
    if (f) w.push('G6 ' + f);
    for (const b of (cur.deps[id] || [id])) {
      const hp = (pm.books || {})[b], hc = (cur.books || {})[b];
      if (!hp || !hc || !hp.raw || !hp.accepted) w.push('G4 本の hash が無い: ' + b);
      else if (hp.raw !== hc.raw || hp.accepted !== hc.accepted) w.push('G4 本の定義が変わった: ' + b + (hp.raw !== hc.raw ? '(生の定義)' : '(受理後の定義)'));
      if (!same(bi(prev.builtinDeclared, b), bi(cur.builtin, b))) w.push('G4 内蔵の宣言の控えが違う: ' + b);
    }
    if (!(pm.rowInputs && pm.rowInputs[id])) w.push('G4 行の入力の hash が無い');
    else if (pm.rowInputs[id] !== (cur.rowInputs || {})[id]) w.push('G4 行の入力(観測 CSV の行・旧共同根)が違う');
    if (w.length) rerun.push({ id, why: w }); else reuse.push(id);
  }
  const run = cur.systems.filter((id) => !reuse.includes(id));
  return { mode: 'merge', why: [], reuse, run, rerun };
}

/** 2 つの正本の差(JSON Pointer —— meta の VOLATILE_META の欄を外す)。max 件まで。 */
export function canonDiff(a, b, max = 20) {
  const out = [];
  const esc = (k) => String(k).replace(/~/g, '~0').replace(/\//g, '~1');
  const walk = (x, y, p) => {
    if (out.length >= max) return;
    if (p === '/meta') {
      const ks = new Set(Object.keys(x || {}).concat(Object.keys(y || {})));
      for (const k of ks) if (!VOLATILE_META.includes(k)) walk((x || {})[k], (y || {})[k], p + '/' + esc(k));
      return;
    }
    if (x === null || y === null || typeof x !== 'object' || typeof y !== 'object' || Array.isArray(x) !== Array.isArray(y)) {
      if (canonText(x) !== canonText(y)) out.push(p || '/');
      return;
    }
    if (Array.isArray(x)) {
      if (x.length !== y.length) { out.push(p + '(長さ ' + x.length + ' ≠ ' + y.length + ')'); return; }
      for (let i = 0; i < x.length; i++) walk(x[i], y[i], p + '/' + i);
      return;
    }
    const ks = new Set(Object.keys(x).concat(Object.keys(y)));
    for (const k of ks) walk(x[k], y[k], p + '/' + esc(k));
  };
  walk(a, b, '');
  return out;
}

/**
 * 変異の自己試験(器を走らせない —— QA と枝の scratch が呼ぶ)。base = 今の正本(旧形式でもよい —— 新しい形の meta を合成した写しで試す)。
 * @returns {{ok:boolean, rows:Array, cases:string}}
 */
export function gateSelfTest(base) {
  const clone = (x) => JSON.parse(JSON.stringify(x));
  const systems = (base.systems || []).map((s) => s.id);
  const books = [...new Set((base.systems || []).flatMap((s) => [s.id, s.ledgerFrom].filter(Boolean)))];
  const deps = Object.fromEntries((base.systems || []).map((s) => [s.id, [...new Set([s.id, s.ledgerFrom].filter(Boolean))]]));
  const H = (s) => sha256Of('w322d-probe:' + s);
  const env = { node: 'v0', v8: '0', chromium: '0', platform: 'linux', arch: 'x64' };
  const params = { target: base.meta.target, dt0: base.meta.dt0, divs: base.meta.divs, periWindow: base.meta.periWindow, maxSteps: base.meta.maxSteps, wallMs: base.meta.wallMs };
  const pageLibs = [{ file: 'a.mjs', sha256: H('a') }, { file: 'b.mjs', sha256: H('b') }];
  const newPrev = () => {
    const p = clone(base);
    p.pageErrors = [];
    Object.assign(p.meta, { merge: { version: MERGE_VERSION, mode: 'full' }, env: clone(env), coreSha256: H('core'), pageLibs: clone(pageLibs),
      books: Object.fromEntries(books.map((b) => [b, { raw: H(b), accepted: H(b + '/acc') }])),
      rowInputs: Object.fromEntries(systems.map((id) => [id, H('row/' + id)])), stages: stagesOfRows(p.systems) });
    return p;
  };
  const curOf = (p) => ({ harness: p.meta.harness, codeSha256: p.meta.codeSha256, pageLibs: clone(pageLibs), params: clone(params), env: clone(env), coreSha256: H('core'),
    books: Object.fromEntries(books.map((b) => [b, { raw: H(b), accepted: H(b + '/acc') }])), rowInputs: Object.fromEntries(systems.map((id) => [id, H('row/' + id)])),
    systems: systems.slice(), deps, builtin: clone(p.builtinDeclared || []) });
  const S0 = systems[0], S1 = systems[1], S3 = systems[3], SL = systems[systems.length - 1];
  const stel = (base.systems || []).find((s) => s.ledgerFrom && s.ledgerFrom !== s.id);
  // [名前, 変異(prev, cur), --only, --variants, 期待の mode, 期待の走らせる行(merge のとき)]
  const M = [
    ['m0 変異なし(最後の系だけ --only)', () => {}, [SL], null, 'merge', [SL]],
    ['m0′ 変異なし(--only なし —— 全行を再利用)', () => {}, [], null, 'merge', []],
    ['m1 行の削除', (p) => { p.systems.splice(2, 1); p.meta.stages = stagesOfRows(p.systems); }, [SL], null, 'full'],
    ['m2 ID の変更', (p) => { p.systems[1].id = p.systems[1].id + 'X'; }, [SL], null, 'full'],
    ['m3 並べ替え', (p) => { p.systems.reverse(); }, [SL], null, 'full'],
    ['m4 失敗行(段の ok:false)', (p) => { p.systems[0].variants[0].stages[0].ok = false; }, [SL], null, 'merge', [S0, SL]],
    ['m4b 壁時計で止めた段(resource-limit)', (p) => { p.systems[1].variants[1].stages[2].stopped = 'resource-limit'; }, [SL], null, 'merge', [S1, SL]],
    ['m4c 変種の欠け', (p) => { p.systems[3].variants.pop(); p.meta.stages = stagesOfRows(p.systems); }, [SL], null, 'merge', [S3, SL]],
    ['m4d error の行', (p) => { p.systems[0] = { id: S0, error: 'preset が無い' }; p.meta.stages = stagesOfRows(p.systems); }, [SL], null, 'merge', [S0, SL]],
    ['m5 全体集計の改ざん(meta.stages + 1)', (p) => { p.meta.stages += 1; }, [SL], null, 'full'],
    ['m5b 途中で止まった正本(meta.stages なし)', (p) => { delete p.meta.stages; }, [SL], null, 'full'],
    ['m6 器と lib の sha', (p) => { p.meta.codeSha256 = H('x'); }, [SL], null, 'full'],
    ['m6b 器の版', (p) => { p.meta.harness = 'w000-x'; }, [SL], null, 'full'],
    ['m6c ページへ入れる lib の sha', (p) => { p.meta.pageLibs[1].sha256 = H('y'); }, [SL], null, 'full'],
    ['m6d 走行の窓(步の上限)', (p) => { p.meta.maxSteps = 1; }, [SL], null, 'full'],
    ['m6e 再利用の門の版', (p) => { p.meta.merge.version = 'w000-merge-0'; }, [SL], null, 'full'],
    ['m7 環境(Chromium)', (p, c) => { c.env.chromium = '1'; }, [SL], null, 'full'],
    ['m8 核(受理器・步の関数を変えた便)', (p, c) => { c.coreSha256 = H('core2'); }, [SL], null, 'full'],
    ['m9 --only に無い系の台帳の本が変わった', (p, c) => { c.books[stel.ledgerFrom].accepted = H('z'); }, [S0], null, 'merge', [S0, stel.id]],
    ['m9b 入力の差(行の観測 CSV の行)', (p, c) => { c.rowInputs[S1] = H('row2'); }, [SL], null, 'merge', [S1, SL]],
    ['m9c 内蔵の宣言の控えの差(hash は同じ)', (p, c) => { const z = c.builtin.find((q) => q.id === S3); if (z) z.masses = [0, 0]; }, [SL], null, 'merge', [S3, SL]],
    ['m10 旧形式の正本(門の版・環境・核・本の hash が無い)', (p) => { delete p.meta.merge; delete p.meta.env; delete p.meta.coreSha256; delete p.meta.books; delete p.meta.rowInputs; delete p.meta.pageLibs; }, [SL], null, 'full'],
    ['m11 --only が器に無い系', () => {}, ['psrX'], null, 'full'],
    ['m12 --variants と併用', () => {}, [SL], ['lock'], 'full'],
    ['m13 前の正本が無い', null, [SL], null, 'full'],
    ['m14 前の走行のページの例外', (p) => { p.pageErrors = ['x']; }, [SL], null, 'full'],
  ];
  const rows = M.map(([name, mu, only, variants, wantMode, wantRun]) => {
    const p = newPrev(), c = curOf(p);
    if (mu) mu(p, c);
    const g = mergeGate({ prev: mu === null ? null : p, cur: c, only, variants });
    const okMode = g.mode === wantMode;
    const okRun = wantMode === 'full' ? g.run.join(',') === systems.join(',') && !g.reuse.length : g.run.join(',') === wantRun.join(',');
    return { name, only, mode: g.mode, run: g.run, reuse: g.reuse.length, why: g.why.concat(g.rerun.flatMap((z) => z.why.map((w) => z.id + ': ' + w))).slice(0, 3), pass: okMode && okRun };
  });
  // 組み立てと差の関数(再利用した行は前の正本の写し・差は時刻と再利用の記録の外だけ)
  const p0 = newPrev();
  const q0 = clone(p0); q0.meta.at = '2099-01-01T00:00:00.000Z'; q0.meta.spentSec = 1; q0.meta.merge = { version: MERGE_VERSION, mode: 'merge' };
  const q1 = clone(p0); q1.systems[0].variants[0].stages[0].P = 1.5;
  const q2 = clone(p0); q2.meta.coreSha256 = H('q');
  const d0 = canonDiff(p0, q0), d1 = canonDiff(p0, q1), d2 = canonDiff(p0, q2);
  const diffOk = d0.length === 0 && d1.length === 1 && d1[0] === '/systems/0/variants/0/stages/0/P' && d2.length === 1 && d2[0] === '/meta/coreSha256';
  const ok = rows.every((r) => r.pass) && diffOk;
  return { ok, rows, diff: { volatileOnly: d0.length, oneValue: d1, metaHash: d2 }, cases: `変異 ${rows.length} 例が期待どおり ${rows.filter((r) => r.pass).length}/${rows.length}`
    + `(全走 ${rows.filter((r) => r.mode === 'full').length}・merge ${rows.filter((r) => r.mode === 'merge').length})・差の関数(時刻と再利用の記録だけ → 差 ${d0.length}・値 1 つ → ${d1.join(',')}・meta の hash → ${d2.join(',')})` };
}

export default { MERGE_VERSION, VOLATILE_META, GLOBAL_GATES, ROW_GATES, canonText, sha256Of, coreShaOf, bookShaOf, rowInputSha, stagesOfRows, expectedTags, rowFailure, mergeGate, canonDiff, gateSelfTest };
