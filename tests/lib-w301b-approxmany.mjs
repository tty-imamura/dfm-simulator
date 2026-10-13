// 第301便b(原仮定者の裁定(第91報)①③「環や銀河などの近似多粒子のサンプルでは、支配天体は固定する。近似多粒子同士は接触判定を切る。近似多粒子同士は、
// 塵の場合は重力も引きずりも無しで、天体の場合は自転を設定して重力も引きずりも有り」「chainSpreadToy3d を、近似多粒子サンプルのフォーマットに合わせる」・
// 統括の検証項目 R180)—— **近似多粒子の宣言 physics.approxMany の生成器**(純関数 —— エンジンは走らせない)。
//
// ■ 何をするか(手書きの添字を本に置かない —— 群は bodies の行の閉区間で宣言し、受理器が粒子の添字へ展開する)
//   ・🍥 chainSpreadToy3d(三次元の geoPN=4 の原理の本): **天体型**(粒子どうしの重力と引きずりを残す —— 連鎖を見る本なので)。
//     中心(bodies[0] —— pinned のまま)が governor。粒子 n 個(bodies[1..n])に自転の**トイの宣言値**(中心の宣言値 0.5 の写し・中心と同じ向き)・
//     自転軸の明示(円盤の法線 +z —— 自転する源は軸を明示)・回転源が読む**明示半径**(見た目の半径 √m の写し —— 配置の最短距離 ≥ 4 R_p は不変)。
//     配置(環 18〜72・黄金角・重なり 0)・中心の軸 30°・初速の種は変えない(w299d の生成器の出力に足すだけ)。
//   ・🍩 saturnRingInertial3d(土星の輪の三次元): 土星(bodies[0] —— pinned 済み)が governor・衛星 6(bodies[1..6])は**天体**
//     (自転は 💍 の宣言の写し —— タイタン 0.000456・他の 5 つは「宣言した 0」〔群に spinZero:"declared"〕)・C/B/A 帯(bodies[7..9] の 120 粒)は**塵**。
//
// ■ 言わないこと: 自転の宣言値は観測ではない(🍥 はトイ)。塵どうしの重力を切ったことを「現実の環の再現」とは書かない。
export const LIB_VERSION = 'w301b-approxmany-lib-1';
export const DECL_VERSION = 'v1';
/** 🍥 の粒子の自転(トイの宣言値 —— 中心の宣言値 0.5 の写し。観測ではない) */
export const SPREAD_BODY_SPIN = 0.5;
export const SPREAD_AXIS_SRC = '宣言(第301便b の近似多粒子の天体型 —— 円盤の法線 +z・トイ・観測ではない)';
const clone = (x) => JSON.parse(JSON.stringify(x));
const f15 = (x) => Number(x.toPrecision(15));

/** 生成の世代: html の受理器が physics.approxMany を持つか(第301便b 以降)。o.approx が真偽値ならそれに従う(器の対照) */
export function approxOn(HP, o = {}) {
  if (o.approx === true || o.approx === false) return o.approx;
  return !!(HP && typeof HP.validateApproxMany === 'function');
}

/**
 * 🍥 の宣言(w299d の spreadPreset の出力 q)を近似多粒子の天体型へ(q を書き換えて返す)。
 * kind:"body"(既定)/ "dust"(器の対照 —— 粒子どうしの重力と引きずりを切った写し: 自転 0・軸なし)。
 */
export function spreadApprox(q, o = {}) {
  const kind = o.kind || 'body', n = q.bodies.length - 1;
  q.bodies = q.bodies.map((b, k) => {
    if (k === 0) return b;
    const out = { type: 'single', m: b.m, radius: f15(Math.sqrt(b.m)), x: b.x, y: b.y, vx: b.vx, vy: b.vy, spin: 0, pinned: b.pinned === true };
    if (kind === 'body') { out.spin = (typeof o.spin === 'number') ? o.spin : SPREAD_BODY_SPIN; out.spinAxis = { enable: true, tiltDeg: 0, azimuthDeg: 0, source: SPREAD_AXIS_SRC }; }
    return out;
  });
  q.physics = Object.assign({}, q.physics, { approxMany: { version: DECL_VERSION, governor: 0, groups: [{ kind, rows: [1, n] }] } });
  return q;
}

/**
 * 🍩 の宣言(lib-w300c-saturnring3d の ringDecl3 の physics・bodies)へ近似多粒子の宣言を足す(physics を書き換えて返す)。
 * 衛星(single・k≥1)は天体(自転 0 の衛星があれば spinZero:"declared")・群(ring)は塵。o.dust:"off" は器の対照(塵の群も天体にした写し —— マスク前と同じ相互作用)。
 */
export function ringApproxDecl(bodies) {
  let sFrom = -1, sTo = -1, rFrom = -1, rTo = -1, zero = false;
  bodies.forEach((b, k) => {
    if (k === 0) return;
    if (b.type === 'single') { if (sFrom < 0) sFrom = k; sTo = k; if (b.spin === 0) zero = true; }
    else { if (rFrom < 0) rFrom = k; rTo = k; }
  });
  const groups = [];
  if (sFrom > 0) groups.push(Object.assign({ kind: 'body', rows: [sFrom, sTo] }, zero ? { spinZero: 'declared' } : null));
  if (rFrom > 0) groups.push({ kind: 'dust', rows: [rFrom, rTo] });
  return { version: DECL_VERSION, governor: 0, groups };
}

/** 宣言 → 粒子の添字の種類(build と同じ並び: 行の順に single は 1・群は n)。0 = 支配天体・宣言の外 / 1 = 塵 / 2 = 天体 */
export function kindsOf(bodies, am) {
  const rowKind = new Array(bodies.length).fill(0);
  for (const G of am.groups) for (let k = G.rows[0]; k <= G.rows[1]; k++) rowKind[k] = G.kind === 'dust' ? 1 : 2;
  const out = [];
  bodies.forEach((b, k) => { const c = b.type === 'single' ? 1 : (b.n || 0); for (let i = 0; i < c; i++) out.push(rowKind[k]); });
  return out;
}

/** 試しの写し(器・QA): 本の写しを変えずに返す */
export const copyOf = clone;
