// 第303便e(決断事項 AN312 の周辺・統括の検証項目 R194)— **フィットの探索の停止幅**の共通の小さなライブラリ(純関数 —— html も正本も読まない)。
//
// ■ 何を決めるか
//   ・**根の停止幅 = 宣言の許容の 1/10**(`rootTolOf(tol)` —— `ROOT_TOL_FRACTION` = 0.1)。根は宣言の許容より十分細かく詰めるが、
//     許容の数千分の 1 までは詰めない(第302便c の 🌡️ の W_bg の割線は |f| ≤ 2e-7″/世紀 —— 許容 0.0009 の 1/4500 —— で、目的量の評価が多かった)。
//     残りの 9/10 は「h と h/2 の差」と「最終値の丸め」の余白に残す。
//   ・**最後の h/h2 の門を必ず残す**(`finalGate`): 丸めた最終値で刻み h と h/2 を**測り直し**、|残差| + |h − h/2| ≤ 許容 のときだけ fitted
//     (第297便b の statusOf297 と同じ規則 —— 根の停止は門の代わりにならない。停止幅を緩めても、門を外す道はこのライブラリに無い)。
//   ・根の詰め方は 2 つ: 割線(`secant` —— 2 点から・挟まない)と Illinois 変形のはさみうち(`illinois` —— 挟んだ区間から。挟めなければ
//     `unreachable-in-bounds` を成果として記録し、門は回さない —— 成功を捏造しない)。
//   ・同期(器の中で 1 回ずつ測る —— 第302便c の fitMercury の型)と非同期(子プロセスの走行 —— 第297便b の型)を、**同じ生成器**(実装は 1 か所)で回す。
//
// ■ 使い方(新しい器 —— 枝 a・b・c の探索。**歴史の器の中は書き換えない**: 第302便c までの器は記録した便の停止幅のまま)
//   import * as FS from './lib-w303e-fitstop.mjs';
//   const r = FS.fitStopSync({ yH: (x) => 測る(x, h), yH2: (x) => 測る(x, h / 2), target: 43.0, tol: 0.0009,
//     method: 'secant', x0, x1, round: (x) => Number(x.toPrecision(7)) });
//   // r.status: 'fitted' | 'not-identifiable' | 'unreachable-in-bounds' / r.x(丸めた最終値)/ r.final(h と h/2 の測り直しと門)/ r.evals(目的量の評価の回数)
//   非同期: `await FS.fitStop({ yH: async (x) => …, yH2: async (x) => …, … })`。挟んだ区間: `method:'illinois', bracket:{ lo, hi }`
//   (端の値をライブラリが測る)か `bracket:{ a, fa, b, fb }`(格子で測った f = y − target を渡す —— `lib-w296b-fit.mjs` の bracketOf の型)。
//   yH が目的量を測る関数(f = yH − target を根にする)。目的量が複数の走行の差(本 − 対照)なら、その差を返す関数を渡す。
//
// ■ 言わないこと
//   ・「停止幅を緩めたので速くなった」を一般化しない(評価の回数は問題ごと —— 自己試験の合成の問題での回数だけを記録する)。
//   ・停止幅で fitted を決めない(fitted は最後の h/h2 の門だけが決める)。
export const FITSTOP_VERSION = 'w303e-fitstop-1';
/** 根の停止幅の比(宣言の許容に掛ける)。 */
export const ROOT_TOL_FRACTION = 0.1;
/** 既定の反復の上限(評価の回数の上限 —— 割線は初期 2 点 + この回数)。 */
export const MAX_ITER_DEFAULT = 40;

/** 根の停止幅(宣言の許容 tol × frac)。tol は正の有限の数でなければ投げる(許容の宣言なしに探索しない)。 */
export function rootTolOf(tol, frac = ROOT_TOL_FRACTION) {
  if (!(typeof tol === 'number' && Number.isFinite(tol) && tol > 0)) throw new Error('fitstop: 宣言の許容 tol が正の有限の数でない: ' + tol);
  if (!(typeof frac === 'number' && Number.isFinite(frac) && frac > 0 && frac <= 1)) throw new Error('fitstop: 停止幅の比 frac が (0, 1] にない: ' + frac);
  return tol * frac;
}

/** 最後の門の判定(純関数): |残差| + h2 ≤ tol。値が有限でなければ偽。 */
export function gateOf(residual, h2, tol) {
  if (!(Number.isFinite(residual) && Number.isFinite(h2) && Number.isFinite(tol))) return false;
  return Math.abs(residual) + h2 <= tol;
}

/** status(第297便b の statusOf297 と同じ規則): 挟めない → unreachable-in-bounds / 門が真 → fitted / それ以外 → not-identifiable。 */
export function statusOf(o) {
  if (o.reachable === false) return 'unreachable-in-bounds';
  return o.gate === true ? 'fitted' : 'not-identifiable';
}

// ---- 根の生成器(x を yield し、f(x) = y(x) − target を受け取る)—— 同期・非同期の両方がこれを回す
function* rootGen(o) {
  const tol = o.tol, rootTol = rootTolOf(tol, o.frac === undefined ? ROOT_TOL_FRACTION : o.frac);
  const maxIter = o.maxIter === undefined ? MAX_ITER_DEFAULT : o.maxIter;
  const iters = [];
  const ev = function* (x) { const y = yield x; const f = y - o.target; iters.push({ x, y, f }); return f; };
  const done = (x, f, stop, extra) => Object.assign({ x, f, stop, iters, evals: iters.length, rootTol, reachable: true }, extra || {});
  const bad = (v) => !Number.isFinite(v);
  if (o.method === 'illinois') {
    const B = o.bracket || {};
    let a, fa, b, fb;
    if (Number.isFinite(B.fa) && Number.isFinite(B.fb)) { a = B.a; fa = B.fa; b = B.b; fb = B.fb; }
    else {
      a = B.lo; b = B.hi;
      if (!(Number.isFinite(a) && Number.isFinite(b))) throw new Error('fitstop: illinois には bracket {lo, hi} か {a, fa, b, fb} が要る');
      fa = yield* ev(a); if (bad(fa)) return done(a, fa, 'non-finite');
      fb = yield* ev(b); if (bad(fb)) return done(b, fb, 'non-finite');
    }
    if (fa === 0) return done(a, fa, 'exact');
    if (fb === 0) return done(b, fb, 'exact');
    if (fa * fb > 0) return done(Math.abs(fa) <= Math.abs(fb) ? a : b, Math.abs(fa) <= Math.abs(fb) ? fa : fb, 'not-bracketed', { reachable: false });
    let side = 0;
    for (let it = 0; it < maxIter; it++) {
      const x = (a * fb - b * fa) / (fb - fa);
      const fx = yield* ev(x);
      if (bad(fx)) return done(x, fx, 'non-finite');
      if (Math.abs(fx) <= rootTol) return done(x, fx, 'root-tol');
      if (fx * fb < 0) { a = b; fa = fb; b = x; fb = fx; side = 0; }
      else { b = x; fb = fx; if (side === -1) fa /= 2; side = -1; }
    }
    const last = iters[iters.length - 1];
    return done(last.x, last.f, 'max-iter');
  }
  if (o.method !== undefined && o.method !== 'secant') throw new Error('fitstop: method は secant か illinois: ' + o.method);
  let x0 = o.x0, x1 = o.x1;
  if (!(Number.isFinite(x0) && Number.isFinite(x1)) || x0 === x1) throw new Error('fitstop: 割線には異なる 2 点 x0・x1 が要る');
  let f0 = yield* ev(x0);
  if (bad(f0)) return done(x0, f0, 'non-finite');
  if (Math.abs(f0) <= rootTol) return done(x0, f0, 'root-tol');
  let f1 = yield* ev(x1);
  if (bad(f1)) return done(x1, f1, 'non-finite');
  for (let it = 0; it < maxIter; it++) {
    if (Math.abs(f1) <= rootTol) return done(x1, f1, 'root-tol');
    if (f1 === f0) return done(x1, f1, 'flat');
    const x2 = x1 - f1 * (x1 - x0) / (f1 - f0);
    if (bad(x2)) return done(x1, f1, 'non-finite');
    x0 = x1; f0 = f1; x1 = x2;
    f1 = yield* ev(x1);
    if (bad(f1)) return done(x1, f1, 'non-finite');
  }
  return done(x1, f1, Math.abs(f1) <= rootTol ? 'root-tol' : 'max-iter');
}

function assemble(o, root, xFinal, yH, yH2) {
  const out = { version: FITSTOP_VERSION, method: o.method || 'secant', target: o.target, tol: o.tol, frac: o.frac === undefined ? ROOT_TOL_FRACTION : o.frac,
    rootTol: root.rootTol, root, x: null, final: null, evals: root.evals, status: null };
  if (!root.reachable) { out.status = statusOf({ reachable: false }); return out; }
  out.x = xFinal;
  const residual = yH - o.target, h2 = Math.abs(yH - yH2), gate = gateOf(residual, h2, o.tol);
  out.final = { x: xFinal, yH, yH2, residual, h2, sum: Math.abs(residual) + h2, gate, margin: o.tol - (Math.abs(residual) + h2) };
  out.evals = root.evals + 2;
  out.status = statusOf({ reachable: true, gate });
  return out;
}
const roundOf = (o) => (typeof o.round === 'function' ? o.round : (x) => x);

/** 根だけ(同期)。f = yH(x) − target。戻り値 {x, f, stop, iters, evals, rootTol, reachable}。 */
export function findRootSync(o) {
  const g = rootGen(o);
  let r = g.next();
  while (!r.done) r = g.next(o.yH(r.value));
  return r.value;
}
/** 根だけ(非同期)。 */
export async function findRoot(o) {
  const g = rootGen(o);
  let r = g.next();
  while (!r.done) r = g.next(await o.yH(r.value));
  return r.value;
}
/**
 * 根 → 丸め → **最後の h/h2 の門**(同期)。o = { yH, yH2, target, tol, method, x0, x1 | bracket, round, frac, maxIter }。
 * 根を挟めなかった(illinois)ときだけ門を回さず unreachable-in-bounds。それ以外は**必ず** yH(x)・yH2(x) を丸めた x で測り直す。
 */
export function fitStopSync(o) {
  if (typeof o.yH2 !== 'function') throw new Error('fitstop: 最後の門の h/2 の測り yH2 が要る(門は外せない)');
  const root = findRootSync(o);
  if (!root.reachable) return assemble(o, root);
  const x = roundOf(o)(root.x);
  return assemble(o, root, x, o.yH(x), o.yH2(x));
}
/** 根 → 丸め → **最後の h/h2 の門**(非同期 —— h と h/2 の測り直しは並べて待つ)。 */
export async function fitStop(o) {
  if (typeof o.yH2 !== 'function') throw new Error('fitstop: 最後の門の h/2 の測り yH2 が要る(門は外せない)');
  const root = await findRoot(o);
  if (!root.reachable) return assemble(o, root);
  const x = roundOf(o)(root.x);
  const [yH, yH2] = await Promise.all([o.yH(x), o.yH2(x)]);
  return assemble(o, root, x, yH, yH2);
}

/**
 * 自己試験(合成の問題 —— 物理は走らせない。QA lint.harnessSmoke303 が呼ぶ)。
 *   ① 停止幅 = 許容 × 1/10(0.0009 → 9e-5)・許容の宣言なしは投げる
 *   ② 割線: 近点率の模型 y_h(x) = 43·(x/x*)^1.02 + 1e-5(刻み h の誤差)・y_{h/2} は誤差 5e-6 —— 停止幅 1/10 と 2e-7(第302便c の型)の評価の回数・両方 fitted
 *   ③ 門が決める: 根は停止幅に入るが h と h/2 の差 0.002 > 許容 → not-identifiable(停止は門の代わりにならない)
 *   ④ illinois: 挟めない区間 → unreachable-in-bounds(門を回さない・最終値なし)/ 挟めた区間 → fitted
 *   ⑤ 非有限: 目的量が NaN → stop non-finite・not-identifiable
 *   ⑥ 非同期の駆動は同期と同じ反復列(生成器が 1 か所)
 */
export async function fitstopSelfTest() {
  const cases = [], bad = [];
  const tol = 0.0009, xs = 221.12, target = 43.0;
  const model = (err) => (x) => 43.0 * Math.pow(x / xs, 1.02) + err;
  // ①
  const rt = rootTolOf(tol);
  if (Math.abs(rt - 9e-5) > 1e-18) bad.push('① 停止幅 ' + rt);
  let threw = false; try { rootTolOf(undefined); } catch { threw = true; }
  if (!threw) bad.push('① 許容の宣言なしで投げない');
  cases.push(`① 停止幅 ${rt.toExponential(3)}(許容 ${tol} の 1/10)・宣言なしは投げる ${threw}`);
  // ②
  const base = { yH: model(1e-5), yH2: model(5e-6), target, tol, method: 'secant', x0: 200, x1: 230, round: (x) => Number(x.toPrecision(7)) };
  const loose = fitStopSync(base);
  const tight = fitStopSync(Object.assign({}, base, { frac: 2e-7 / tol }));
  if (loose.status !== 'fitted' || tight.status !== 'fitted') bad.push('② status ' + loose.status + '/' + tight.status);
  if (!(Math.abs(loose.root.f) <= rt)) bad.push('② 根が停止幅に入らない ' + loose.root.f);
  if (!(loose.root.evals <= tight.root.evals)) bad.push('② 評価の回数 ' + loose.root.evals + ' > ' + tight.root.evals);
  if (!(loose.final && Number.isFinite(loose.final.yH) && Number.isFinite(loose.final.yH2))) bad.push('② 最後の門の測り直しが無い');
  cases.push(`② 割線: 停止幅 1/10 → 根の評価 ${loose.root.evals} 回(+門 2)・|f| ${Math.abs(loose.root.f).toExponential(2)}・|残差|+h2 ${loose.final.sum.toExponential(2)} ≤ ${tol} / `
    + `停止幅 2e-7 → ${tight.root.evals} 回・status ${loose.status}/${tight.status}`);
  // ③
  const wide = fitStopSync(Object.assign({}, base, { yH2: model(1e-5 - 0.002) }));
  if (wide.root.stop !== 'root-tol' || wide.status !== 'not-identifiable') bad.push('③ 門が決めない ' + wide.root.stop + '/' + wide.status);
  cases.push(`③ 根は停止幅に入る(${wide.root.stop})が h と h/2 の差 ${wide.final.h2.toExponential(2)} > 許容 → ${wide.status}`);
  // ④
  const ib = { yH: model(1e-5), yH2: model(5e-6), target, tol, method: 'illinois', round: (x) => Number(x.toPrecision(7)) };
  const unr = fitStopSync(Object.assign({}, ib, { bracket: { lo: 230, hi: 260 } }));
  const brk = fitStopSync(Object.assign({}, ib, { bracket: { lo: 200, hi: 260 } }));
  if (unr.status !== 'unreachable-in-bounds' || unr.final !== null || unr.x !== null) bad.push('④ 挟めない区間 ' + unr.status);
  if (brk.status !== 'fitted') bad.push('④ 挟めた区間 ' + brk.status);
  cases.push(`④ illinois: [230, 260] → ${unr.status}(門なし)/ [200, 260] → ${brk.status}(根の評価 ${brk.root.evals} 回)`);
  // ⑤
  const nan = fitStopSync(Object.assign({}, base, { yH: (x) => (x > 225 ? NaN : model(1e-5)(x)) }));
  if (nan.root.stop !== 'non-finite' || nan.status !== 'not-identifiable') bad.push('⑤ 非有限 ' + nan.root.stop + '/' + nan.status);
  cases.push(`⑤ 目的量が NaN → stop ${nan.root.stop}・${nan.status}`);
  // ⑥
  const asy = await fitStop(Object.assign({}, base, { yH: async (x) => model(1e-5)(x), yH2: async (x) => model(5e-6)(x) }));
  const same = JSON.stringify(asy.root.iters) === JSON.stringify(loose.root.iters) && asy.x === loose.x && asy.status === loose.status;
  if (!same) bad.push('⑥ 非同期の反復列が同期と違う');
  cases.push(`⑥ 非同期 = 同期(反復列・最終値・status)${same}`);
  return { version: FITSTOP_VERSION, ok: bad.length === 0, bad, cases, evals: { loose: loose.root.evals, tight: tight.root.evals } };
}

export default { FITSTOP_VERSION, ROOT_TOL_FRACTION, MAX_ITER_DEFAULT, rootTolOf, gateOf, statusOf, findRootSync, findRoot, fitStopSync, fitStop, fitstopSelfTest };
