// 第276便b(第66報 (2)「plutoCharonReal の kF0 版に問題がないか確認し、問題があれば解決する」)—
// **診断コピーの単位系を取り替える純関数**。
//
// ■ なぜ要るのか(第275便b までの器で分かっていたこと)
//   ❄️ の kF0 残差(+7.62 s・+294σ)は **softening ε が支配する**(第272便b の S 系列: ε 0.05 /
//   0.025 / 0.0125 で +294 / −17.8 / −95.8σ)。ところが ❄️ の宣言単位(1 単位 = 10⁶ m)では
//   `CLAMPS.softening` の**受理下限 0.01 が 10 km に当たる**ので、それより小さい ε は
//   **検証器が 0.01 へ丸める**(警告つき)。つまり「ε をさらに下げたら残差がどう動くか」を
//   **いまの単位のままでは検査できない**。長さ単位を 10⁵ m にすれば同じ下限が **1 km** になる。
//
// ■ 何をするか / しないか
//   ・**プリセット JSON(診断コピー)の数値を次元指数で丸ごと書き換える**ための倍率表を作る純関数。
//     `beta/index.html` にも `S._core` にも 1 文字も触らない。**内蔵 ❄️ の値は 1 bit も変えない**。
//   ・次元指数は **html の `SCALE_DIMS` と同じ表**(G[3,-2,-1]・cLight[1,-1,0]・softening[1,0,0]・
//     D0[-1,0,1]・D0pull[-2,0,1]・kappaT[1,0,-1]・gravityX/Y[1,-2,0])を写したものを使う。
//     bodies は x/y/radius[1,0,0]・vx/vy[1,-1,0]・m[0,0,1]・spin[0,-1,0]。
//   ・`q`(qLock 係数)・`kFrame`・`lambdaPN`・`pnAlpha`・`bM`・`pRad`・`etaRad`・`radiusScale` は
//     **無次元**なので触らない。`timeScale`・`dispMag` は**表示専用**で力学に入らない
//     (`camera.scale` だけは見え方をそろえるため長さ倍率で割る —— 表示であることを刻む)。
//   ・**単位を変えても物理は変わらないはず**、というのは主張ではなく**検査対象**である。器は
//     実長さで同じ ε(50 km)を両単位で走らせて差を測り、「単位変更そのものの差」として別に出す。
//
// ■ 規約からの逸脱(宣言)
//   html の `stabScaleExp` は scaleExp に **L−T=4・M+2T−3L=11** を求める(この規約のとき G が
//   6.674 のままになる)。本便の診断単位 **L=5・T=2・M=20** はこれを満たさない —— **時間単位を
//   10² s に据え置いて 3 段(dt 0.016/0.008/0.004・步数)と「秒で読んだ周期」をそのまま比較できる
//   ようにする**ためで、代わりに G=0.06674・c₀=3×10⁵・κ=7.4156×10⁻¹³ へ換算する。
//   規約を満たす別解(L=5・T=1・M=24)は dt と步数の意味が変わるので本便では採らない(決断事項)。
export const UNITS_VERSION = 'w276b-units-1';

/** html の SCALE_DIMS の写し([L,T,M] の指数)。 */
export const PHYS_DIMS = { G: [3, -2, -1], cLight: [1, -1, 0], gravityX: [1, -2, 0],
  gravityY: [1, -2, 0], softening: [1, 0, 0], D0: [-1, 0, 1], D0pull: [-2, 0, 1], kappaT: [1, 0, -1] };
/** bodies 側の次元。 */
export const BODY_DIMS = { x: [1, 0, 0], y: [1, 0, 0], radius: [1, 0, 0],
  vx: [1, -1, 0], vy: [1, -1, 0], m: [0, 0, 1], spin: [0, -1, 0] };
/** 表示専用で力学に入らない鍵(換算しない)。 */
export const DISPLAY_ONLY = ['timeScale', 'dispMag', 'radiusScale'];

/** 値 × factor = 新単位での値。 */
export function unitFactors(from, to) {
  const L = Math.pow(10, from.L - to.L), T = Math.pow(10, from.T - to.T), M = Math.pow(10, from.M - to.M);
  return { L, T, M, of: (d) => Math.pow(L, d[0]) * Math.pow(T, d[1]) * Math.pow(M, d[2]) };
}

/**
 * **ページへそのまま渡せる**単位換算の指示(倍率表)を作る。数はすべてこの純関数が作り、
 * 器もページ側も手で打たない。
 */
export function unitChangeSpec(from, to) {
  const f = unitFactors(from, to);
  const phys = {}, body = {};
  for (const [k, d] of Object.entries(PHYS_DIMS)) phys[k] = f.of(d);
  for (const [k, d] of Object.entries(BODY_DIMS)) body[k] = f.of(d);
  return { version: UNITS_VERSION, from: { ...from }, to: { ...to },
    factors: { L: f.L, T: f.T, M: f.M }, phys, body, cameraDiv: f.L,
    displayOnly: DISPLAY_ONLY.slice(),
    conventionOk: (to.L - to.T === 4) && (to.M + 2 * to.T - 3 * to.L === 11),
    conventionNote: 'html の stabScaleExp が求める L−T=4・M+2T−3L=11 を満たすか(満たさない場合は G/c₀/κ を換算する)',
    secondsPerTimeUnit: Math.pow(10, to.T),
    epsFloorMeters: epsFloorMeters(to.L),
    note: 'scaleExp は表示専用の宣言で、力学に効くのは書き換えた数そのものである' };
}

/** spec を preset(必ず診断コピー)へ当てる。ページ側でも同じ 10 行が走る。 */
export function applyUnitSpec(preset, spec) {
  const ph = preset.physics || {};
  for (const [k, g] of Object.entries(spec.phys)) if (typeof ph[k] === 'number') ph[k] = ph[k] * g;
  for (const b of (preset.bodies || []))
    for (const [k, g] of Object.entries(spec.body)) if (typeof b[k] === 'number') b[k] = b[k] * g;
  if (preset.camera && typeof preset.camera.scale === 'number') preset.camera.scale /= spec.cameraDiv;
  preset.scaleExp = { L: spec.to.L, T: spec.to.T, M: spec.to.M };
  return preset;
}

/**
 * ❄️ の受理下限まわりの事実(器が JSON へそのまま刻む)。**値は html の CLAMPS / validatePreset の
 * 写し**で、器はこの表を主張せず、実測した `cfgApplied` と突き合わせて「要求値 → 適用値」を記録する。
 */
export const ACCEPT_LIMITS = {
  softening: [0.01, 20], massFloorMin: 1e-9, massFloorDefault: 1e-6,
  bodyCoord: [-5000, 5000], bodyVel: [-50, 50], massCap: 20000,
  note: 'html の CLAMPS / validatePreset の写し(器は突き合わせにだけ使う)' };

/** 長さ単位 10^L m のとき、受理下限 ε=0.01 単位が実長さで何 m になるか。 */
export function epsFloorMeters(L) { return ACCEPT_LIMITS.softening[0] * Math.pow(10, L); }

/**
 * **受理できる動的レンジ**: |x| の上限 5000 単位と ε の下限 0.01 単位の比。
 * 太陽を分解した 3 体(太陽までの距離 / 必要な ε)が**どの単位系でも同時に入らない**ことを
 * 示すのに使う(値は ACCEPT_LIMITS から作る — 主張ではなく算術)。
 */
export function acceptedDynamicRange() {
  return ACCEPT_LIMITS.bodyCoord[1] / ACCEPT_LIMITS.softening[0];
}
