// 第352便d(原仮定者の回答(2026-11-24 —— 第148報)「AN1017: これまでの向き。自転と、主に銀河由来の軸引きずりが順回転なら、歳差運動は逆回転になる」・統括の検証項目 R441):
//   **歳差の回る向きの表 —— 向きの読み (g2+)・(g2−) × 背景の向きの候補 (G−)(G+)(N+)(N−) × 基準の極(合成の軸・自分の公転の北極・太陽系の基準軸の候補・黄道の極)の
//   方位の率と傾きの率(無次元の 6 場面・8 惑星と太陽 —— 主の成分 (S)・(C2)・k 1・背景の大きさ (uV)/比べる列 (MS)・25.4221/経路 ① を足した f 0.5・1)**
//   (段 precsense-352d —— 正本 tests/out/precsense-352d.json・lib tests/lib-w352d-precsense.mjs)。
//   **診断だけ** —— 歳差の向きを選ぶものではない。エンジン・内蔵の本・受理器・前の便の lib の本文は変えない。physics の鍵を足さない。
//
// Node だけ・**html を読まない**(来歴の対象は純関数 tests/lib-w352d-precsense.mjs —— 領域の宣言なし)。入力のファイルは無い(前の便の lib を呼んで作り直す)。
//   1 プロセス。正本は第338便c の settleRun で書く。
//
// ■ 探索の方針: 2 つの向きの読みは同じ重さで並べる(どちらかに寄せない)。背景の向きの候補も 4 つを並べる(主は伺っている —— (N+) と (G−) は同じ重さ)。
// ■ 判定の物差し(零試験 12): (g2+) と第351便d の経路 ② の照合/閉じた形/relSense/経路 ① の傾きの率/平行で null/極の反転/自転の反転/背景の向き/統括の数え直し 1 の数/(g2−) は符号が逆/変異 3/拒否。
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { provenanceMeta } from './lib-w272e-provenance.mjs';
import { settleRun } from './lib-w338c-recheck.mjs';
import * as E from './lib-w347e-spintorque.mjs';
import * as L from './lib-w352d-precsense.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
export const HARNESS_VERSION = 'w352d-precsense-1';
export const OUT_MAIN = 'tests/out/precsense-352d.json';
export const TARGET = 'tests/lib-w352d-precsense.mjs';
/** 版の履歴(結果を見て変えた所 —— 理由つき) */
export const AMEND = Object.freeze([]);
const IS_MAIN = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
export const NOT_CLAIM = Object.freeze([
  '歳差の回る向きの器の符号だけ —— 向きの読み (g2+)・(g2−) のどちらも選んでいない(同じ重さの 2 列)',
  '背景の向きの候補 (G−)(G+)(N+)(N−) のどれも選んでいない —— (N+) の軸は統括の数え直し 1 の等しい重みの平均(定数)',
  '観測の歳差の向き(地球・火星)とは比べていない —— 仮の値が入った後のラウンドの題',
  '背景の大きさ (uV) は金星で太陽由来 (S) と大きさが同じになる倍率(÷ k)—— 比べる数から逆算した既定の値ではない(列の名)',
  '場は geoPN=3 の在位の形(〔第348便h〕の makeField3 の既定の引数)・主の読み (C2)・局所の分母は自分 + 太陽',
  'アプリの引きずり・自転・ジャイロの步と、エンジン・内蔵の本へは入れない']);
/** 器の宣言(表に出す点) */
export const PLAN = Object.freeze({ pure: '零試験 12', ex: '無次元の 6 場面 × 向きの読み 2', main: '受け手 9(8 惑星 + 太陽)× 背景の向き 4 × 向きの読み 2((S)・uV)',
  count: '向きの読み 2 × 背景の向き 6((N±) は基準軸と黄道の極の 2 つ)× 極 4((S)・uV と (MS)・uMS)', ms: '受け手 9 × 背景の向き 4 × 向きの読み 2((MS)・uMS)',
  f: '4 惑星 × 背景の向き 2 × 向きの読み 2 × (f 0・0.5・1(N1)+ 経路 ① だけ)' });
export const EXDEG = Object.freeze([10, 45, 80, 100, 135, 170]);
export const RECV = Object.freeze([...L.DECL.planets, 'Sun']);
export const FBODIES = Object.freeze(['Mercury', 'Venus', 'Earth', 'Mars']);
export const FCASES = Object.freeze([{ f: 0, norm: 'N1' }, { f: 0.5, norm: 'N1' }, { f: 1, norm: 'N1' }, { f: null, norm: 'N3', kTilt: 1, kPrec: 0 }]);
/** 数える背景の向きの組(name・軸の名) */
export const COUNT_BG = Object.freeze([['Gm', 'ref'], ['Gp', 'ref'], ['Np', 'ref'], ['Nm', 'ref'], ['Np', 'ecl'], ['Nm', 'ecl']]);

const sg = (x) => (x > 0 ? 1 : x < 0 ? -1 : 0);
const D2R = Math.PI / 180;
/** 1 行を ″/年 の表の行に(極ごとの方位の率・傾きの率・相対の回り relP = sign(az) × sign(ŝ·p) —— Ω̂ のまわりでは relSense と同じ) */
function packRow(R) {
  const out = { id: R.id, bg: R.bg, sense: R.sense, cosBg: R.cosBg, cosOm: R.cosOm, spin: R.spin, rel: R.rel, spinBg: sg(R.cosBg), az: {}, inc: {}, relP: {},
    omAsYr: Math.hypot(...R.Om) * L.ASYR, bgAsYr: Math.hypot(...R.bgVec) * L.ASYR };
  for (const p of L.DECL.poles) {
    const q = R.rates[p];
    // 丸めの床: 打ち消しで 0 になる量(経路 ② の Ω̂ に対する傾きの率など)は abs(Ω) の 1e-12 倍以下を 0 と書く(実行系で丸めの残りが違うため)
    const fl = (x) => (Math.abs(x) <= 1e-12 * out.omAsYr ? 0 : x);
    out.az[p] = q === null ? null : fl(q.az * L.ASYR); out.inc[p] = q === null ? null : fl(q.inc * L.ASYR);
    // 打ち消しで 0 になる方位の率(経路 ① だけの Ω̂ のまわり)は abs(Ω) の 1e-9 倍以下を 0 と読む(符号を数えない)
    const azF = q === null ? null : Math.abs(q.az) * L.ASYR <= 1e-9 * out.omAsYr ? 0 : q.az;
    out.relP[p] = azF === null || R.poleDot[p] === null ? null : sg(azF) * sg(R.poleDot[p]);
  }
  if (out.relP.om === 0) out.rel = 0;
  const rp = L.DECL.poles.map((p) => out.relP[p]).filter((x) => x !== null && x !== 0);
  out.poleFlip = rp.some((x) => x !== rp[0]);
  // 文の対象 = 自転と背景が順回転(ŝ·背景 > 0)。文に当たる = 対象で、その極のまわりで逆回り(relP −1)
  out.inScope = out.spinBg > 0;
  return out;
}

/* ───────── 門 ───────── */
export function gatesOf(J) {
  const nS = L.DECL.senses.length, nB = L.DECL.bgNames.length;
  const flipOk = (rows) => rows.filter((r) => r.sense === 'g2p').every((a) => { const b = rows.find((x) => x.id === a.id && x.bg === a.bg && x.sense === 'g2m' && (x.f === undefined || x.f === a.f) && (x.fcase === undefined || x.fcase === a.fcase));
    return b && L.DECL.poles.every((p) => (a.az[p] === null && b.az[p] === null) || Math.abs(a.az[p] + b.az[p]) <= 1e-9 * Math.max(Math.abs(a.az[p]), 1e-300)); });
  return {
    pure: Object.values(J.pure.gates).every(Boolean) && Object.keys(J.pure.gates).length === 12,
    ex: J.ex.length === EXDEG.length * nS && J.ex.every((r) => Math.abs(Math.abs(r.az) - 1) < 1e-12 && Math.abs(r.inc) < 1e-12 && r.rel === (r.sense === 'g2p' ? 1 : -1) * r.spin),
    main: J.main.length === RECV.length * nB * nS && J.main.every((r) => r.az.om !== null && Math.abs(Math.abs(r.az.om) - r.omAsYr) <= 1e-9 * r.omAsYr && (r.inc.om === 0 || Math.abs(r.inc.om) <= 1e-9 * r.omAsYr))
      && J.main.filter((r) => r.id === 'Sun').every((r) => r.az.orb === null) && flipOk(J.main),
    count: J.count.length === nS * COUNT_BG.length * L.DECL.poles.length * 2 && J.count.every((c) => c.hit <= c.scope && c.scope <= c.n && c.hitOm <= c.scopeOm && c.scopeOm <= c.n)
      && J.count.filter((c) => c.pole === 'om').every((c) => c.hitOm === (c.sense === 'g2p' ? 0 : c.scopeOm)),
    ms: J.ms.length === RECV.length * nB * nS && flipOk(J.ms),
    f: J.f.length === FBODIES.length * 2 * nS * FCASES.length && J.f.filter((r) => r.fcase === 3).every((r) => r.az.om === 0 || Math.abs(r.az.om) <= 1e-9 * r.omAsYr),
  };
}
export function runAll() {
  const t0 = Date.now(), tm = {}, mark = (k) => { tm[k] = { wallSec: (Date.now() - t0) / 1000 }; };
  const T1 = E.t1Table(), GEO = E.geometry(), cache = {};
  const PS = L.pureScenes(T1, GEO), pure = { scenes: PS, gates: L.pureGates(PS) }; mark('pure');
  // 表 1: 無次元の例(Ω = +z・abs(Ω) 1・k₂ 1)
  const ex = [];
  for (const deg of EXDEG) for (const sense of L.DECL.senses) {
    const s = [Math.sin(deg * D2R), 0, Math.cos(deg * D2R)], Om = [0, 0, 1], ds = L.precDs(s, Om, { sense }), pr = L.poleRates(Om, s, ds);
    const spin = L.spinSense(s, Om), rel = L.relSense(s, Om, ds);
    ex.push({ deg, sense, az: pr.az, inc: pr.inc, spin, rel, scope: spin > 0 ? 'in' : 'out', hit: spin > 0 && rel === -1 });
  }
  mark('ex');
  const uV = L.uVenus(T1, GEO, { part: 'S' }, cache), uMS = L.uVenus(T1, GEO, { part: 'MS' }, cache);
  const mk = (id, o) => packRow(L.rowOf(T1, GEO, id, o, cache));
  // 表 2: 主の成分 (S)・uV
  const main = [];
  for (const id of RECV) for (const bg of L.DECL.bgNames) for (const sense of L.DECL.senses) main.push(mk(id, { bg, sense, u: uV, part: 'S' }));
  mark('main');
  // 表 3: 比べる列 (MS)・uMS
  const ms = [];
  for (const id of RECV) for (const bg of L.DECL.bgNames) for (const sense of L.DECL.senses) {
    const r = mk(id, { bg, sense, u: uMS, part: 'MS' }), a = main.find((x) => x.id === id && x.bg === bg && x.sense === sense);
    r.flipVsS = L.DECL.poles.filter((p) => r.relP[p] !== null && a.relP[p] !== null && r.relP[p] !== a.relP[p]);
    ms.push(r);
  }
  mark('ms');
  // 数: 文に当たる行(向きの読み × 背景の向き 6 × 極 4 × 成分 2)
  const count = [];
  for (const [part, u] of [['S', uV], ['MS', uMS]]) for (const sense of L.DECL.senses) for (const [bg, ax] of COUNT_BG) {
    const rows = RECV.map((id) => mk(id, { bg, sense, u, part, axis: ax === 'ecl' ? L.DECL.ecl.slice() : null }));
    for (const p of L.DECL.poles) {
      const usable = rows.filter((r) => r.relP[p] !== null);
      count.push({ part, sense, bg, axis: ax, pole: p, n: usable.length, scope: usable.filter((r) => r.inScope).length, hit: usable.filter((r) => r.inScope && r.relP[p] === -1).length,
        scopeOm: usable.filter((r) => r.spin > 0).length, hitOm: usable.filter((r) => r.spin > 0 && r.relP[p] === -1).length,
        flip: rows.filter((r) => r.poleFlip).map((r) => r.id) });
    }
  }
  mark('count');
  // 表 4: 経路 ① を足す(f 0・0.5・1(N1)と、経路 ① だけ(k₁ 1・k₂ 0))
  const f = [];
  for (const id of FBODIES) for (const bg of ['Gm', 'Np']) for (const sense of L.DECL.senses) FCASES.forEach((c, j) => {
    const o = { bg, sense, u: uV, part: 'S' };
    const r = mk(id, c.norm === 'N3' ? { ...o, f: null, norm: 'N3', kTilt: c.kTilt, kPrec: c.kPrec } : { ...o, f: c.f, norm: c.norm });
    r.fcase = j; r.f = c.f; r.norm = c.norm; f.push(r);
  });
  mark('f');
  const J = { pure, ex, uV, uMS, main, count, ms, f, timing: tm };
  J.gates = gatesOf(J); J.ok = Object.values(J.gates).every(Boolean);
  return J;
}

/** import の閉包(来歴の code の一覧 —— 器から相対の import を辿る) */
export function codeClosure() {
  const seen = new Set(), stack = ['tests/exp-w352d-precsense.mjs'];
  while (stack.length) { const f = stack.pop(); if (seen.has(f)) continue; seen.add(f); const t = fs.readFileSync(path.join(ROOT, f), 'utf8');
    for (const m of t.matchAll(/from '\.\/([^']+)'/g)) stack.push('tests/' + m[1]); }
  return [...seen].sort();
}

/* ───────── 走らせる ───────── */
export async function main() {
  const OUT = process.env.W352D_OUT ? (path.isAbsolute(process.env.W352D_OUT) ? process.env.W352D_OUT : path.join(ROOT, process.env.W352D_OUT)) : path.join(ROOT, OUT_MAIN);
  const t0 = Date.now();
  console.log('第352便d precsense(版 ' + HARNESS_VERSION + ')');
  let tm = null;
  const S = settleRun(() => { const R = runAll(); if (tm === null) tm = R.timing; delete R.timing; return R; });
  const out = { version: HARNESS_VERSION, libVersion: L.LIB_VERSION, generator: 'tests/exp-w352d-precsense.mjs', target: TARGET,
    ruling: '原仮定者の回答(2026-11-24 —— 第148報)・原仮定者の回答(2026-11-24 —— 第147報)・統括の検証項目 R441',
    decl: L.DECL, plan: PLAN, amend: AMEND, notClaim: NOT_CLAIM, ...S.value, timing: tm };
  out.elapsedS = (Date.now() - t0) / 1000;
  out.meta = Object.assign(provenanceMeta({ root: ROOT, wave: '第352便d', target: TARGET, code: codeClosure(), inputs: [] }), {
    harnessVersion: HARNESS_VERSION, stage: 'precsense', engine: 'Node(html を読まない —— 純関数の lib・第351便d・第351便e・第351便c・第347便e の lib を呼ぶ)・1 プロセス', notClaim: NOT_CLAIM, recheck: S.meta });
  fs.mkdirSync(path.dirname(OUT), { recursive: true });
  fs.writeFileSync(OUT, JSON.stringify(out, null, 1) + '\n');
  console.log('→', path.relative(ROOT, OUT), 'ok=' + out.ok, JSON.stringify(out.gates), '0 と書いた葉 ' + S.meta.zeroed + '・不安定 ' + S.meta.unstable, out.elapsedS + ' s');
}
if (IS_MAIN) await main();
