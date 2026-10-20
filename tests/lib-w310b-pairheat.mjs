// 第310便b(決断事項 AN370「対の熱の規則 —— 相反の関係をエンジンで測る(規則は裁定待ち)」・AN373「移動の補正の主の指標 abs(u(0))/abs(V_obs,i − V_obs,k)」・
// AN365「間隔が未宣言」・AN371「欄を分ける」・統括の検証項目 R223): **対の熱の相反の測定と帳簿の欄の純関数**(器 tests/exp-w310b-pairheat.mjs が使う)。
//
// ■ 量(維持の型 —— 第309便b の 1 步の量 E_speed = I(Ω_I·ω_D + ½abs(ω_D)²) の 1 次):
//   受け手 i が源 j から受ける引きずり軸回転 ω_ij(エンジンの核が対ごとに作る値 —— 和 Σ_j ω_ij = ω_D,i)から
//   E⁽¹⁾_{i←j} = I_i Ω_I,i·ω_ij = I_i s_i (ω_ij·â_i)(傾きのある受け手)・I_i s_i σ_ij(傾きを持たない受け手 —— 符号つきのスカラー)。
//   ω_ij は源の自転の大きさ s_j に線形(軸は宣言のまま —— bevel・新則の軸は sinθ を通じて源の軸の向きには線形でない)なので
//   係数 c_ij = (ω_ij·â_i)/s_j を置くと E⁽¹⁾_{i←j} = I_i c_ij s_i s_j。両側の 1 次が等しいこと(自転によらず)は **I_i c_ij = I_j c_ji**(相反の関係
//   I_i A_ij = I_j A_ji^T を宣言の軸で読んだもの)と同じ。比 E⁽¹⁾_{i←j}/E⁽¹⁾_{j←i} = I_i c_ij/(I_j c_ji) は自転の大きさによらない。
// ■ 帳簿の流れ(今のエンジン): 受け手ごとに合成場の口座から流入(ΔE = −E_speed)・受け皿(背景)へ流出・熱。源の状態は動かさない。対で共有する予算の口座は無い
//   (受け手の集合を分けた走行の和が全部の受け手の走行に一致するかで確かめる —— 器の段 F)。
// ■ AN373: k = 受け手 i の行で β_ij が最大の源(同率は質量の大きい方 → 番号の小さい方)・指標 abs(u_i(0))/abs(V_obs,i − V_obs,k)・分母 0 は null。
// ■ 言わないこと: 「二重計上を解消した」「規則を決めた」(AN370 は裁定待ち —— 測っただけ)・「帳簿が完全に閉じた」(器の範囲を数で)・「完全に一致」。
export const LIB_VERSION = 'w310b-pairheat-lib-1';
export const dot = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
export const norm = (a) => Math.sqrt(dot(a, a));
export const sub = (a, b) => [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
export const add = (a, b) => [a[0] + b[0], a[1] + b[1], a[2] + b[2]];
export const scale = (a, s) => [a[0] * s, a[1] * s, a[2] * s];
const relDiff = (x, y) => Math.abs(x - y) / Math.max(Math.abs(x), Math.abs(y), 1e-300);

/* ───────── AN370: 1 次の量と相反の破れ ───────── */
/** 受け手の 1 次(傾きのある受け手は ω_ij·â・傾きを持たない受け手は σ_ij)。I・s(符号つきの慣性自転)・a(軸)・flat・omega(ω_ij)・sigma(σ_ij) */
export function firstOrder({ I, s, a, flat, omega, sigma }) {
  const wp = flat ? sigma : dot(omega, a);
  return { wp, E1: I * s * wp };
}
/** 1 次の 2 次の残り: ½I abs(ω_D)²(傾きを持たない受け手は ½I σ²)—— エンジンの E_speed = Σ_j E⁽¹⁾ + これ(丸めの順だけ違う) */
export function secondOrder({ I, flat, omegaD, sigmaD }) { return flat ? 0.5 * I * sigmaD * sigmaD : 0.5 * I * dot(omegaD, omegaD); }
/** 相反の破れ(対の両側の 1 次)。ratio = E_ij/E_ji・asym = (E_ij − E_ji)/max(abs)・sameSign。分母 0 は null */
export function reciprocity(Eij, Eji) {
  const m = Math.max(Math.abs(Eij), Math.abs(Eji));
  return { Eij, Eji, ratio: Eji !== 0 ? Eij / Eji : null, asym: m > 0 ? (Eij - Eji) / m : null, absLogRatio: (Eij !== 0 && Eji !== 0) ? Math.abs(Math.log10(Math.abs(Eij / Eji))) : null,
    sameSign: Math.sign(Eij) === Math.sign(Eji), sum: Eij + Eji };
}
/**
 * 「等しいことを前提にした規則」(慣性モーメントの大きい側を外し、伴天体の側だけを数える)を当てたときに外れる量。
 * kept = 小さい I の側の 1 次・dropped = 大きい I の側の 1 次。等しいなら dropped/kept = 1(同じ交換の重複を外す意味になる)—— そうでなければ別の量を落とす
 */
export function dropLargerSide(Eij, Eji, Ii, Ij) {
  const keepI = Ii <= Ij;   // 小さい I の側を残す
  const kept = keepI ? Eij : Eji, dropped = keepI ? Eji : Eij;
  return { keptSide: keepI ? 'i' : 'j', kept, dropped, droppedOverKept: kept !== 0 ? dropped / kept : null, currentTotal: Eij + Eji, ruleTotal: kept,
    totalChangeRel: (Eij + Eji) !== 0 ? -dropped / (Eij + Eji) : null };
}

/* ───────── AN373: 支配的な源と移動の指標 ───────── */
/** k = 行 i で β_ij が最大の源(j ≠ i・β > 0)。同率は質量の大きい方 → 番号の小さい方。無ければ −1 */
export function dominantSource(beta, mass, i) {
  let k = -1;
  for (let j = 0; j < beta.length; j++) {
    if (j === i || !(beta[j] > 0)) continue;
    if (k < 0 || beta[j] > beta[k] || (beta[j] === beta[k] && (mass[j] > mass[k] || (mass[j] === mass[k] && j < k)))) k = j;
  }
  return k;
}
/** 指標: abs(u(0))/abs(V_obs,i − V_obs,k)(分母 0 か k が無いときは null —— 小さい数を足して隠さない)と絶対量 abs(u(0)) */
export function motionIndex(u, Vi, Vk) {
  const uAbs = norm(u);
  if (!Vk) return { uAbs, denom: null, ratio: null };
  const denom = norm(sub(Vi, Vk));
  return { uAbs, denom, ratio: denom > 0 ? uAbs / denom : null };
}

/* ───────── 帳簿の流れ(受け手の集合を分けた走行の和) ───────── */
/** 帳簿の 1 組(維持の型の読み口)から流れの量を取り出す */
export function flowOf(m) {
  return { fieldE: m.field.E, fieldL: m.field.L.slice(), sinkE: m.sinkAccount.E, sinkL: m.sinkAccount.L.slice(), heat: m.heat.total, supply: m.speed.supply,
    speedSigned: m.speed.signed, axisCost: m.heat.axisCost };
}
/** 全部の受け手の走行 all と受け手を 1 つずつにした走行 parts の和の差(相対)—— 0 なら受け手ごとの局所の記帳(対で共有する予算の口座は無い) */
export function additivity(all, parts) {
  const sum = parts.reduce((s, p) => ({ fieldE: s.fieldE + p.fieldE, sinkE: s.sinkE + p.sinkE, heat: s.heat + p.heat, supply: s.supply + p.supply,
    fieldL: add(s.fieldL, p.fieldL), sinkL: add(s.sinkL, p.sinkL) }), { fieldE: 0, sinkE: 0, heat: 0, supply: 0, fieldL: [0, 0, 0], sinkL: [0, 0, 0] });
  const rv = (a, b) => norm(sub(a, b)) / Math.max(norm(a), norm(b), 1e-300);
  return { fieldE: relDiff(all.fieldE, sum.fieldE), sinkE: relDiff(all.sinkE, sum.sinkE), heat: relDiff(all.heat, sum.heat), supply: (all.supply === 0 && sum.supply === 0) ? 0 : relDiff(all.supply, sum.supply),
    fieldL: rv(all.fieldL, sum.fieldL), sinkL: rv(all.sinkL, sum.sinkL) };
}

/* ───────── 純関数の確かめ(器が正本に記録し、QA が同じ関数で引き直す) ───────── */
export function checksOf() {
  const g = {}, v = {};
  // ① 1 次: 傾きのある受け手(ω·â)と傾きを持たない受け手(σ)・符号は s の符号に従う
  const a = [0, 0, 1], f1 = firstOrder({ I: 2, s: 0.5, a, flat: false, omega: [0.1, 0.2, 0.03] }), f2 = firstOrder({ I: 2, s: -0.5, a, flat: true, sigma: 0.03 });
  v.first = { tilt: f1.E1, flat: f2.E1 };
  g.firstOrder = Math.abs(f1.E1 - 0.03) < 1e-16 && Math.abs(f2.E1 + 0.03) < 1e-16;
  // ② 相反: 等しい 1 次は ratio 1・asym 0・逆符号は sameSign false・分母 0 は null
  const r1 = reciprocity(0.25, 0.25), r2 = reciprocity(2e-5, 1.5e-5), r3 = reciprocity(3, -1), r0 = reciprocity(1, 0);
  v.recip = { equal: r1, unequal: r2, opposite: r3 };
  g.reciprocity = r1.ratio === 1 && r1.asym === 0 && Math.abs(r2.ratio - 2e-5 / 1.5e-5) < 1e-15 && r3.sameSign === false && r0.ratio === null && r0.absLogRatio === null;
  // ③ 大きい側を外す規則: 等しいなら dropped/kept = 1・等しくなければ別の量を落とす
  const d1 = dropLargerSide(0.5, 0.5, 10, 1), d2 = dropLargerSide(2, 0.5, 1, 10);
  v.drop = { equal: d1, unequal: d2 };
  g.dropRule = d1.keptSide === 'j' && d1.droppedOverKept === 1 && d2.keptSide === 'i' && d2.droppedOverKept === 0.25 && Math.abs(d2.totalChangeRel + 0.2) < 1e-15;
  // ④ k の決め方(同率は質量 → 番号)・自分を数えない・β ≤ 0 は数えない
  const k1 = dominantSource([0.5, 0.2, 0.2], [1, 3, 3], 0), k2 = dominantSource([0.1, 0.0, 0.3, 0.3], [5, 1, 2, 7], 1), k3 = dominantSource([0, 0.3, 0.3], [1, 2, 2], 0), k4 = dominantSource([0.9, 0, 0], [1, 1, 1], 0);
  v.dominant = [k1, k2, k3, k4];
  g.dominant = k1 === 1 && k2 === 3 && k3 === 1 && k4 === -1;
  // ⑤ 指標: 分母 0 は null・k が無いのも null・絶対量は並べる
  const m1 = motionIndex([3, 4, 0], [1, 0, 0], [0, 0, 0]), m2 = motionIndex([3, 4, 0], [1, 0, 0], [1, 0, 0]), m3 = motionIndex([3, 4, 0], [1, 0, 0], null);
  v.index = { m1, m2, m3 };
  g.motionIndex = m1.ratio === 5 && m1.uAbs === 5 && m2.ratio === null && m2.uAbs === 5 && m3.ratio === null;
  // ⑥ 帳簿の流れの和
  const fa = { fieldE: -3, sinkE: 1, heat: 2, supply: 0.5, fieldL: [1, 2, 3], sinkL: [-1, -2, -3] };
  const p1 = { fieldE: -1, sinkE: 0.5, heat: 0.5, supply: 0.5, fieldL: [1, 0, 3], sinkL: [-1, 0, -3] }, p2 = { fieldE: -2, sinkE: 0.5, heat: 1.5, supply: 0, fieldL: [0, 2, 0], sinkL: [0, -2, 0] };
  const ad = additivity(fa, [p1, p2]);
  g.additivity = Object.values(ad).every((x) => x === 0) && additivity(fa, [p1]).heat > 0;
  const pass = Object.values(g).every((x) => x === true);
  return { pass, gates: g, values: v, n: Object.keys(g).length };
}
