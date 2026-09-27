// 第284便f(原仮定者の裁定(第74報)⑥「まだ時間が長いので改善する・並列実行を検討する」・統括の検証項目 R94)——
// **較正走行(tests/exp-w249b-calaudit.mjs)のプリセット分割**の純関数。
//
// ■ 何をするか
//   calaudit の走行は「プリセット(job)ごとに独立な走行 → 全 job を集めた後の判定・併合・書き出し」の 2 相である。
//   分割は**前半(job の走行)だけ**を k 個のプロセスに分け、後半は 1 プロセスで直列と**同じコード経路**を通す:
//     ① 分割: 同じ引数 + `--shard-jobs <鍵,…> --shard-dump <file>` —— 指定した job だけを走らせ、job ごとの産物
//        (out.presets の 1 行・次の走行の dt/4 転記元 H4_NEW・その job の間のページエラー)を **v8 の構造化複製**
//        (NaN・±Infinity・-0・undefined を保つ —— JSON にすると null になり後段の判定が変わりうる)で書いて終わる。
//        **正本(tests/out/calaudit-w249*.json)へは書かない**(読むだけ —— 共有 JSON への同時書きは起きない)。
//     ② 合流: 同じ引数 + `--shard-load <file,…>` —— job の走行の代わりに、直列と同じ job の順で産物を取り出して
//        積む。それ以外(ページの読み込み・宣言・Float32 質量の記録・判定・--merge・診断の分離・書き出し)は直列と
//        1 行も変わらない。
//   job の鍵は `id`(既定経路)/ `id:kf0`(kFrame=0 の診断コピー)—— 本器の h4 の鍵と同じ形。
//
// ■ 受理しない(器を止める)
//   ・分割の引数(`--shard-*` を除いた argv)・対象 html の sha・測定コードの sha が合流と違う産物
//   ・同じ job が 2 つの産物にある / 合流が要る job がどの産物にも無い / 合流の job に無い job がある
//   ・既定経路の job の宣言(decl)・CFG が合流のページの宣言と構造化複製のバイト列で一致しない
//
// ■ しないこと: 走らせない・判定しない(引数の読み取り・産物の組み立てと照合・分割の割り付けだけ)。
import v8 from 'node:v8';
import fs from 'node:fs';

export const SHARD_VERSION = 'w284f-calshard-2';   // -2: 産物に h2(dt/2 の転記元)と h2keep を載せる(統括・第284便 統合)
const FLAGS_WITH_VALUE = ['--shard-jobs', '--shard-dump', '--shard-load'];
const FLAGS_BARE = ['--shard-plan'];

/** job の鍵(既定経路は id・kF0 診断コピーは id:kf0)。 */
export const jobKey = (job) => job.id + (job.kf0 ? ':kf0' : '');

/** argv から分割の引数を読む。値の無い `--shard-*` は例外。 */
export function parseShardArgs(argv) {
  const get = (k) => {
    const i = argv.indexOf(k);
    if (i < 0) return null;
    const v = argv[i + 1];
    if (!v || v.startsWith('--')) throw new Error('[w284f] ' + k + ' に値が無い');
    return v;
  };
  const jobs = get('--shard-jobs'), dump = get('--shard-dump'), load = get('--shard-load');
  const plan = argv.includes('--shard-plan');
  if (load && (jobs || dump || plan)) throw new Error('[w284f] --shard-load は --shard-jobs / --shard-dump / --shard-plan と併用しない');
  if (dump && !jobs) throw new Error('[w284f] --shard-dump には --shard-jobs が要る');
  return { jobs: jobs ? new Set(jobs.split(',').filter(Boolean)) : null, dump, load: load ? load.split(',').filter(Boolean) : null,
    plan, on: !!(jobs || dump || load || plan) };
}

/** 分割の引数を除いた argv(産物と合流の同一性の照合に使う —— 順序も含めて同じであること)。 */
export function baseArgv(argv) {
  const out = [];
  for (let i = 0; i < argv.length; i++) {
    if (FLAGS_WITH_VALUE.includes(argv[i])) { i++; continue; }
    if (FLAGS_BARE.includes(argv[i])) continue;
    out.push(argv[i]);
  }
  return out;
}

/**
 * 構造の同一(鍵の順序・配列の長さ・値〔Object.is —— NaN どうしは同じ・0 と -0 は違う〕・undefined の鍵まで)。
 * v8 の直列化のバイト列は同一性に使えない(複製した配列は疎配列として書かれ、元の密配列とバイト列が違う —— 第284便f で実測)。
 */
export function sameClone(a, b) {
  if (Object.is(a, b)) return true;
  if (typeof a !== 'object' || typeof b !== 'object' || a === null || b === null) return false;
  if (Array.isArray(a) !== Array.isArray(b)) return false;
  if (Array.isArray(a)) { if (a.length !== b.length) return false; for (let i = 0; i < a.length; i++) if (!sameClone(a[i], b[i])) return false; return true; }
  const ka = Object.keys(a), kb = Object.keys(b);
  if (ka.length !== kb.length) return false;
  for (let i = 0; i < ka.length; i++) if (ka[i] !== kb[i] || !sameClone(a[ka[i]], b[kb[i]])) return false;
  return true;
}

/**
 * 分割の産物(1 ファイル)を作る。
 * @param {{argv:string[], targetSha:string, codeSha:string, jobs:string[], entries:Array}} o
 *   entries[] = { key, skipped, preset, h4, errors }(走らせた job の順)
 */
export function makeDump(o) {
  return { version: SHARD_VERSION, argv: baseArgv(o.argv), targetSha256: o.targetSha, measurementCodeSha256: o.codeSha,
    jobsAll: o.jobsAll || null, jobs: o.jobs, entries: o.entries };
}
export function writeDump(file, dump) { fs.writeFileSync(file, v8.serialize(dump)); }
export function readDump(file) { return v8.deserialize(fs.readFileSync(file)); }

/**
 * 合流: 産物を読み、job の鍵 → 産物の 1 行 の表を作る(照合に失敗したら例外)。
 * @param {Array} dumps readDump の戻りの並び
 * @param {{argv:string[], targetSha:string, codeSha:string, jobs:string[]}} want 合流の側の値(jobs は直列の job の順の鍵)
 */
export function collectDumps(dumps, want) {
  const base = JSON.stringify(baseArgv(want.argv));
  const byKey = new Map();
  const errs = [];
  dumps.forEach((d, i) => {
    if (!d || d.version !== SHARD_VERSION) { errs.push(`産物 ${i}: 版が違う(${d && d.version})`); return; }
    if (JSON.stringify(d.argv) !== base) errs.push(`産物 ${i}: 引数が合流と違う(${d.argv.join(' ')} / ${JSON.parse(base).join(' ')})`);
    if (d.targetSha256 !== want.targetSha) errs.push(`産物 ${i}: 対象 html の sha が違う`);
    if (d.measurementCodeSha256 !== want.codeSha) errs.push(`産物 ${i}: 測定コードの sha が違う`);
    if (d.jobsAll && JSON.stringify(d.jobsAll) !== JSON.stringify(want.jobs)) errs.push(`産物 ${i}: job の一覧が合流と違う`);
    for (const e of (d.entries || [])) {
      if (byKey.has(e.key)) errs.push(`job ${e.key} が 2 つの産物にある`);
      else byKey.set(e.key, e);
    }
  });
  const wantSet = new Set(want.jobs);
  for (const k of want.jobs) if (!byKey.has(k)) errs.push(`job ${k} がどの産物にも無い`);
  for (const k of byKey.keys()) if (!wantSet.has(k)) errs.push(`job ${k} は合流の job に無い`);
  if (errs.length) throw new Error('[w284f] 分割の産物を合流できない: ' + errs.slice(0, 8).join(' / '));
  return byKey;
}

/**
 * 分割の割り付け(所要秒の大きい順に、いちばん空いた分割へ —— LPT)。**分割の中は直列の job の順**に戻す
 * (走る順は結果に効かない —— 効くなら合流の同一性で検出される)。
 * @param {string[]} keys 直列の job の順
 * @param {(k:string)=>number} secOf 見積り秒(前回の正本の段の壁時計の和 —— 割り付けだけに使う)
 * @param {number} k 分割数
 */
export function lptShards(keys, secOf, k) {
  const n = Math.max(1, Math.min(k || 1, keys.length));
  const S = Array.from({ length: n }, () => ({ sec: 0, keys: [] }));
  for (const key of keys.slice().sort((a, b) => (secOf(b) - secOf(a)) || (a < b ? -1 : 1))) {
    const t = S.reduce((m, x) => (x.sec < m.sec ? x : m), S[0]);
    t.keys.push(key); t.sec += secOf(key);
  }
  const idx = new Map(keys.map((x, i) => [x, i]));
  for (const s of S) s.keys.sort((a, b) => idx.get(a) - idx.get(b));
  return S.filter((s) => s.keys.length);
}

/** 前回の正本から job の見積り秒(段の壁時計の和)を引く表。無ければ 1。 */
export function secTableFrom(calJson) {
  const m = new Map();
  for (const p of ((calJson && calJson.presets) || [])) {
    const st = (p.run && p.run.stopRuleStages) || {};
    const s = Object.values(st).reduce((a, z) => a + (Number(z && z.wallSec) || 0), 0);
    m.set(p.id, s || 1);
  }
  return (key) => m.get(String(key).replace(/:kf0$/, '')) || 1;
}

// ---------------------------------------------------------------- 同一性の照合(直列の正本 対 分割の正本)
const esc = (k) => String(k).replace(/~/g, '~0').replace(/\//g, '~1');
/**
 * 2 つの JSON 値の差の Pointer(配列は添字・object は鍵の和集合 —— 鍵の順序の違いも `order` で出す)。
 * @returns {Array<{ptr:string, a:any, b:any, kind:'value'|'missing'|'order'}>}
 */
export function jsonDiff(a, b, ptr = '', out = [], cap = 5000) {
  if (out.length >= cap) return out;
  const ta = Array.isArray(a) ? 'array' : a === null ? 'null' : typeof a;
  const tb = Array.isArray(b) ? 'array' : b === null ? 'null' : typeof b;
  if (ta !== tb) { out.push({ ptr: ptr || '/', a, b, kind: 'value' }); return out; }
  if (ta === 'array') {
    if (a.length !== b.length) out.push({ ptr: (ptr || '') + '/length', a: a.length, b: b.length, kind: 'value' });
    for (let i = 0; i < Math.min(a.length, b.length); i++) jsonDiff(a[i], b[i], ptr + '/' + i, out, cap);
    return out;
  }
  if (ta === 'object') {
    const ka = Object.keys(a), kb = Object.keys(b);
    const sb = new Set(kb), sa = new Set(ka);
    for (const k of ka) if (!sb.has(k)) out.push({ ptr: ptr + '/' + esc(k), a: a[k], b: undefined, kind: 'missing' });
    for (const k of kb) if (!sa.has(k)) out.push({ ptr: ptr + '/' + esc(k), a: undefined, b: b[k], kind: 'missing' });
    const common = ka.filter((k) => sb.has(k));
    if (JSON.stringify(common) !== JSON.stringify(kb.filter((k) => sa.has(k)))) out.push({ ptr: ptr || '/', a: null, b: null, kind: 'order' });
    for (const k of common) jsonDiff(a[k], b[k], ptr + '/' + esc(k), out, cap);
    return out;
  }
  if (!Object.is(a, b)) out.push({ ptr: ptr || '/', a, b, kind: 'value' });
  return out;
}

/** Pointer(`*` を含む宣言)に具体の Pointer が当たるか。 */
export function pointerMatches(decl, ptr) {
  const d = decl.split('/'), p = ptr.split('/');
  if (d.length !== p.length) return false;
  return d.every((t, i) => t === '*' || t === p[i]);
}

/**
 * 差の分類: declared(除外 Pointer の宣言に当たる)/ code(測定コードの同一性 —— 分割の器を足したので変わる)/
 * other(それ以外 —— 物理欄を含む。**0 件でなければ分割を採らない**)。
 */
export function classifyDiff(diffs, declared, codePtrs) {
  const res = { declared: [], code: [], other: [] };
  for (const z of diffs) {
    if (declared.some((d) => pointerMatches(d, z.ptr))) res.declared.push(z);
    else if ((codePtrs || []).some((d) => pointerMatches(d, z.ptr) || z.ptr.startsWith(d + '/'))) res.code.push(z);
    else res.other.push(z);
  }
  return res;
}

/**
 * 自己試験(QA `lint.regenChain` ⑦ —— ブラウザ無し)。合成の job の産物で:
 *   (a) 引数の読み取り・分割の引数を除いた argv
 *   (b) 構造化複製が NaN・±Infinity・-0・undefined を保つ(JSON なら落ちる)
 *   (c) 合流の照合: 重複・欠け・余り・引数違い・sha 違いを拒否し、正しい 2 分割は直列の順の表を返す
 *   (d) LPT の割り付けが全 job を 1 回ずつ覆い、分割の中は直列の順
 *   (e) jsonDiff / classifyDiff が宣言の Pointer・コードの同一性・その他を分ける
 */
export function calShardSelfTest() {
  const res = {};
  const argv = ['--kf0-runs', '--only', 'a,b', '--merge', '--shard-jobs', 'a,b:kf0', '--shard-dump', '/tmp/x.v8'];
  const pa = parseShardArgs(argv);
  let threw = 0;
  for (const bad of [['--shard-dump', 'f'], ['--shard-load', 'f', '--shard-jobs', 'a'], ['--shard-jobs']]) { try { parseShardArgs(bad); } catch { threw++; } }
  res.a = { ok: pa.jobs.has('a') && pa.jobs.has('b:kf0') && pa.dump === '/tmp/x.v8' && JSON.stringify(baseArgv(argv)) === JSON.stringify(['--kf0-runs', '--only', 'a,b', '--merge']) && threw === 3 };
  const odd = { n: NaN, p: Infinity, m: -Infinity, z: -0, u: undefined, arr: [NaN, undefined] };
  const back = v8.deserialize(v8.serialize(odd));
  const viaJson = JSON.parse(JSON.stringify(odd));
  const lit = [[1, 'イオ'], [2, 'エウロパ']];
  res.b = { ok: sameClone(lit, v8.deserialize(v8.serialize(lit))) && !sameClone({ a: 0 }, { a: -0 }) && sameClone({ a: NaN }, { a: NaN })
    && !sameClone({ a: 1, b: 2 }, { b: 2, a: 1 }) && !sameClone({ a: undefined }, {}) && Number.isNaN(back.n) && back.p === Infinity && back.m === -Infinity && Object.is(back.z, -0) && 'u' in back && back.u === undefined
    && Number.isNaN(back.arr[0]) && viaJson.n === null && !('u' in viaJson) };
  const want = { argv: ['--merge'], targetSha: 't', codeSha: 'c', jobs: ['a', 'b', 'c', 'a:kf0'] };
  const E = (key) => ({ key, skipped: false, preset: { id: key.replace(/:kf0$/, ''), v: NaN }, h4: [], errors: [] });
  const D = (keys, over) => Object.assign(makeDump({ argv: ['--merge', '--shard-jobs', keys.join(','), '--shard-dump', 'f'], targetSha: 't', codeSha: 'c', jobsAll: want.jobs, jobs: keys, entries: keys.map(E) }), over || {});
  const tryC = (dumps) => { try { collectDumps(dumps, want); return true; } catch { return false; } };
  const good = collectDumps([D(['b', 'a:kf0']), D(['a', 'c'])], want);
  res.c = { ok: good.size === 4 && Number.isNaN(good.get('a').preset.v)
    && !tryC([D(['a', 'b']), D(['b', 'c', 'a:kf0'])])            // 重複
    && !tryC([D(['a', 'b']), D(['c'])])                           // 欠け
    && !tryC([D(['a', 'b', 'x']), D(['c', 'a:kf0'])])             // 余り
    && !tryC([D(['a', 'b']), D(['c', 'a:kf0'], { argv: ['--merge', '--dt3'] })])   // 引数違い
    && !tryC([D(['a', 'b']), D(['c', 'a:kf0'], { targetSha256: 'u' })])            // html 違い
    && !tryC([D(['a', 'b']), D(['c', 'a:kf0'], { measurementCodeSha256: 'u' })]) }; // コード違い
  const keys = ['p', 'q', 'r', 's', 't', 'u', 'v'];
  const sec = { p: 830, q: 5, r: 838, s: 40, t: 824, u: 12, v: 830 };
  const sh = lptShards(keys, (k) => sec[k], 2);
  const flat = sh.flatMap((s) => s.keys);
  res.d = { shards: sh.map((s) => s.keys.join('+') + '=' + s.sec), ok: flat.length === keys.length && new Set(flat).size === keys.length
    && sh.every((s) => s.keys.every((k, i) => i === 0 || keys.indexOf(s.keys[i - 1]) < keys.indexOf(k)))
    && Math.max(...sh.map((s) => s.sec)) <= 1720 };
  const A = { meta: { when: '1', measurementCodeSha256: 'x' }, presets: [{ run: { wallSec: 1, v: 2 } }] };
  const B = { meta: { when: '2', measurementCodeSha256: 'y' }, presets: [{ run: { wallSec: 3, v: 2.0000001 } }] };
  const cd = classifyDiff(jsonDiff(A, B), ['/meta/when', '/presets/*/run/wallSec'], ['/meta/measurementCodeSha256']);
  res.e = { ok: cd.declared.length === 2 && cd.code.length === 1 && cd.other.length === 1 && cd.other[0].ptr === '/presets/0/run/v'
    && jsonDiff({ a: 1, b: 2 }, { b: 2, a: 1 }).some((z) => z.kind === 'order') };
  res.ok = Object.values(res).every((z) => z.ok === true);
  return res;
}

export default { SHARD_VERSION, jobKey, parseShardArgs, baseArgv, sameClone, makeDump, writeDump, readDump, collectDumps,
  lptShards, secTableFrom, jsonDiff, pointerMatches, classifyDiff, calShardSelfTest };
