// 第357便d(原仮定者の指示(2026-11-21)「論文2: 主にgeoPN=0を使用。「もしも宇宙に天体が１つだけだったら」の思考実験で始まる。…」・統括の検証項目 R525):
//   **天体が 1 つだけの箱の本 ☝️ boxone の lib**(宣言 DECL・純関数の判定・自己試験)。器 tests/exp-w357d-boxone.mjs が html を読んで測り、この lib の判定で門を作る。
//   html を読まない・エンジンを持たない(数を作るのは器 —— 本の JSON と html の本文の受理器・build・步)。
//
// ■ 門(宣言 —— 走行の前に置く・結果を見て変えない)
//   ① count      箱の中の質量を持つ天体が 1 つ(壁の質点リング 72・試験粒子でない粒のうち壁の外が 1)・見張りの粒は試験粒子(源にならない)10・試験粒子の契約が入場(deny なし)
//   ② trans      全体を並進させた走行(本の宣言のまま)と、並進を引いた写し(全部の速度から 6 を引く)で、600 步の後の
//                天体と見張りの粒の相対の位置(相対の差 ÷ 距離)・相対の速さ(差)・時計の比 τ/t(差)が門の幅 1e-3 の内
//                (幅は 📦 boxtrans の門 box.trans-clocks の「共動の τ/t > 0.999」と同じ桁 —— 写した幅)
//   ③ rerun      600 步の指紋(位置・速度・時計の Float32/Float64 のビットの sha256)が走り直しで同じ(同じプロセスで 2 回)
//   ④ conserve   運動量(Σ m v + リザーバ)とエネルギー(並進 + 自転)の 600 步の変化 ÷ Σ m|v|・Σ ½ m v² の初めの値が 1e-5 の内(2 つの走行とも —— 幅は候補)
//   self         lib の自己試験(門の検出力の変異を含む)
// ■ 読み(門ではない —— 同じ量で今の箱の本と並べる表): 回る壁・膨らむ壁の写しの中心付近のフレームの利得(🌀・📈 の量)を天体あり/なしで・
//   天体の自転だけの写しの利得・天体の位置の決定力(天体の質量を 10 倍にした写しでも同じ —— 自己の項 0)。新しい式は足さない。
export const LIB_VERSION = 'w357d-boxone-lib-1';

export const DECL = Object.freeze({
  bookId: 'boxone',
  steps: 600,
  bulkV: 6,                 // 本の宣言の並進の速度(x 向き)—— 並進を引いた写しは全部の vx から引く
  wall: Object.freeze({ n: 72, m: 20, r: 260 }),
  body: Object.freeze({ m: 200 }),
  nTest: 10,
  transTol: 1e-3,           // ② の幅(📦 の box.trans-clocks の共動の門 1 − 0.999 と同じ桁 —— 写した幅)
  conserveTol: 1e-5,        // ④ の幅(候補 —— 新しく置いた幅)
  rebuildTol: 1e-9,         // QA の作り直しの照合(相対 1e-9 か絶対 1e-9 の床)
  readings: Object.freeze({ rotOmega: 0.15, expH: 0.005, spin: 0.5, massMul: 10, radii: Object.freeze([70, 130]) }),
});

/** 箱の中の天体の数(質量を持ち、試験粒子でなく、壁の質点でない粒)。parts = [{ wall, test, m }] */
export function countBodies(parts) {
  let wall = 0, test = 0, massive = 0;
  for (const p of parts) { if (p.wall) wall++; else if (p.test) test++; else if (p.m > 0) massive++; }
  return { wall, test, massive };
}

/** 相対の量の比べ(A: 並進あり・B: 並進を引いた写し)。rows = [{ rA:[x,y], rB, vA, vB, tauA, tauB }] */
export function transCompare(rows) {
  let dPos = 0, dVel = 0, dTau = 0;
  for (const r of rows) {
    const dist = Math.hypot(r.rB[0], r.rB[1]);
    dPos = Math.max(dPos, Math.hypot(r.rA[0] - r.rB[0], r.rA[1] - r.rB[1]) / dist);
    dVel = Math.max(dVel, Math.hypot(r.vA[0] - r.vB[0], r.vA[1] - r.vB[1]));
    dTau = Math.max(dTau, Math.abs(r.tauA - r.tauB));
  }
  const fx = (x) => Number(x.toFixed(9));   // 差の型の葉は絶対の桁で持つ(形の判定は丸める前の数で)
  return { n: rows.length, dPos: fx(dPos), dVel: fx(dVel), dTau: fx(dTau), ok: rows.length > 0 && dPos < DECL.transTol && dVel < DECL.transTol && dTau < DECL.transTol };
}

/** 保存の比べ。{ p0:[px,py], p1, res1:[x,y], e0, e1, pScale, eScale } → 相対の変化 */
export function conserveOf(c) {
  const dp = Math.hypot(c.p1[0] + c.res1[0] - c.p0[0], c.p1[1] + c.res1[1] - c.p0[1]) / c.pScale;
  const de = Math.abs(c.e1 - c.e0) / c.eScale;
  const fx = (x) => Number(x.toFixed(9));
  return { dP: fx(dp), dE: fx(de), ok: dp < DECL.conserveTol && de < DECL.conserveTol };
}

/** 門(正本の measure から) */
export function gatesFrom(M) {
  return {
    count: M.count.massive === 1 && M.count.wall === DECL.wall.n && M.count.test === DECL.nTest && M.count.testParticleOn === true && M.count.deny === null,
    trans: M.trans.ok === true && M.trans.n === DECL.nTest && M.trans.steps === DECL.steps,
    rerun: M.rerun.same === true && M.rerun.steps === DECL.steps,
    conserve: M.conserve.A.ok === true && M.conserve.B.ok === true,
    self: M.selfTest.ok === true,
  };
}

/** 自己試験(門の検出力の変異を含む) */
export function selfTest() {
  const bad = []; let cases = 0;
  const chk = (nm, c) => { cases++; if (!c) bad.push(nm); };
  const row = (d) => ({ rA: [70 + d, 0], rB: [70, 0], vA: [0, 0], vB: [0, 0], tauA: 1, tauB: 1 });
  chk('同じ相対の量は門の内', transCompare([row(0)]).ok === true);
  chk('単精度の丸めの桁(1e-5)は門の内', transCompare([row(70 * 1e-5)]).ok === true);
  chk('変異: 相対の位置が 1e-3 ずれたら門の外', transCompare([row(70 * 1.01e-3)]).ok === false);
  chk('変異: 相対の速さが 2e-3 ずれたら門の外', transCompare([{ ...row(0), vA: [2e-3, 0] }]).ok === false);
  chk('変異: 時計の比が 2e-3 ずれたら門の外', transCompare([{ ...row(0), tauA: 1 - 2e-3 }]).ok === false);
  chk('空の行は門の外', transCompare([]).ok === false);
  const cs = (dp, de) => conserveOf({ p0: [100, 0], p1: [100 - dp, 0], res1: [0, 0], e0: 50, e1: 50 + de, pScale: 100, eScale: 50 });
  chk('保存: 変化 0 は門の内', cs(0, 0).ok === true);
  chk('変異: 運動量が 1e-4 ずれたら門の外', cs(1e-2, 0).ok === false);
  chk('変異: エネルギーが 1e-4 ずれたら門の外', cs(0, 5e-3).ok === false);
  chk('保存: リザーバに移った分は戻して数える', conserveOf({ p0: [100, 0], p1: [99, 0], res1: [1, 0], e0: 1, e1: 1, pScale: 100, eScale: 1 }).ok === true);
  const cb = countBodies([{ wall: true, m: 20 }, { wall: true, m: 20 }, { m: 200 }, { test: true, m: 0.05 }]);
  chk('天体の数: 壁と試験粒子を数えない', cb.massive === 1 && cb.wall === 2 && cb.test === 1);
  chk('変異: 試験粒子の印が無い見張りは天体に数えられる', countBodies([{ m: 200 }, { m: 0.05 }]).massive === 2);
  return { ok: bad.length === 0, cases, bad };
}
