// 第327便e(原仮定者の指示(2026-11-05)「軸引きずりについて」—— 「引きずる側の回転引きずりによる、引きずられる側の近い位置と遠い方位置の差分が、軸引きずりである。
//   密度差を考慮して、引きずり半径R_dを使用している」「十分に離れていたり、密度が低い場合は、軸引きずりを観測半径が影響しない勾配とみなせたので、K1が適用出来た」
//   「金星では、銀河の軸引きずりは勾配とみなせるが、太陽の軸引きずりは観測半径を無視出来ない。つまり、銀河に対してはK1だが、太陽に対しては「別の半径」でフィットする」
//   「固体惑星のフィットについては、「太陽ー金星」「太陽ー火星」「太陽ー地球ー月」の順に検証する」・統括の検証項目 R299):
//   **軸引きずりを「近い位置と遠い位置の差分」として読む型の純関数**(器 tests/exp-w327e-axialdiff.mjs と QA lint.axialDiff327e が読む —— html を読まない・状態を持たない・
//   エンジンの式を写さない。回転引きずりの場 g はエンジンの点の読み口 inertialDragIsqPointAt の rotC を器が渡す)。
//
// ■ 型(宣言 —— 走行の前に置く。今の DFM の式から導いた法則ではない)
//   引きずる側 j の回転引きずりの場(エンジンの K1 の宣言の形): 点 x の回転引きずりの速度 u_j(x) = Ω_j â_j × n̂_j g_j(x)・g_j = m_d,j M1_j(r)/W(x)〔長さ —— W は受け手の自己の場を含む全部の場〕。
//   受け手 i の中心 x_i・源から受け手への向き n̂(d = 源と受け手の距離)。近い位置 x_i − R n̂(距離 d − R)・遠い位置 x_i + R n̂(距離 d + R)。
//   (i) 勾配の型 grad(今のエンジンの K1): 軸の角速度の大きさ = −n̂·∇g(受け手の R_d の球の体積平均 —— 観測半径 R_obs は入らない)。差分 g(d − R) − g(d + R) ≈ 2R(−∂g/∂r)。
//   (ii) 有限の半径の差分の型(R = 別の半径 R_alt —— 受け手の近い位置と遠い位置の距離の半分):
//     diffStencil: D(R) = [g(d − R) − g(d + R)]/(2R)(剛体の回転に直す —— 2R で割る。R → 0 で中心の勾配 −∂g/∂r に戻る)
//     diffK1:      D_K1(R) = [g(d − R) − g(d + R)]/(2 R_d^K1)(差分そのもの —— K1 の直径で割る。R = R_d^K1 で diffStencil と同じ・勾配の領域では (R/R_d^K1)·勾配)
//   軸の角速度のベクトル(源の単位の自転あたりの伝達 t —— 第326便d の口の ν = s_j t): t = A_gain·sinθ·(2n̂(n̂·â_j) − â_j)·(D または D_K1)
//     (鏡映 × sinθ はエンジンの K1 の宣言の幾何の因子 —— 器は中心の点の amp との照合を記録する)。
//   密度差: 受け手の自己の場は K1 の R_d(R_d = Y_k m —— 密度差の扱いのまま)で、差分の点は R_d の球の外(自己の場 m/R)。
// ■ 規則の固定(金星の根を決めてから火星・地球–月へ当てる —— 走行の前の宣言・合わせない)
//   obsRatio: R_alt = (R_alt,♀/R_obs,♀)·R_obs,i / rdRatio: R_alt = (R_alt,♀/R_d,♀)·R_d,i(= 同じ倍率の Y_k m)/ absolute: R_alt = R_alt,♀(同じ長さ)
// ■ 言わないこと: 金星の逆回転・内部熱の説明ではない・解いた半径は条件と残差つきの記録(この型・この規則の下で —— 採らない)・負の係数を 0 に丸めない。
import * as LS from './lib-w327a-axialsum.mjs';
import * as E from './lib-w326d-axialheat.mjs';
export const LIB_VERSION = 'w327e-axialdiff-lib-1';
const { dot, sub, scale, norm, cross, relD } = E;
const vec3 = (a) => Array.isArray(a) && a.length === 3 && a.every(Number.isFinite);

/** 宣言(走行の前に置く —— 結果を見て変えない) */
export const DECL = Object.freeze({
  forms: Object.freeze([
    Object.freeze({ key: 'grad', ja: '勾配の型(今のエンジンの K1 —— 受け手の R_d の球の体積平均の −n̂·∇g・観測半径は入らない)' }),
    Object.freeze({ key: 'diffStencil', ja: '有限の半径の差分(2R で割る —— 剛体の回転に直す・R → 0 で勾配)' }),
    Object.freeze({ key: 'diffK1', ja: '有限の半径の差分そのもの(K1 の直径 2R_d で割る —— R = R_d で diffStencil・勾配の領域では (R/R_d)·勾配)' }),
  ]),
  formMain: 'diffK1',   // 規則を固定する型(diffStencil は比の型の頭打ちで上界 —— 根が無い)。規則は p ごと・族ごと・源ごとに金星の最も小さい零点で固定(根の無い列は当てない)
  families: Object.freeze(['S', 'E']), familyMain: 'S',
  sources: Object.freeze(['now', 'J']), sourceMain: 'J',
  // 銀河の応答のべき(第327便a の格子 —— f_i = (R_d,i^K1/R_d,☉)^p。銀河は K1 のまま —— 別の半径は太陽の口だけを変える)
  pGrid: LS.DECL.pGrid, pMain: LS.DECL.pMain, pAlso: 0,
  // 金星の別の半径の格子: 1e-2〜1e10.5 m の 1/4 桁ごと + R_d^K1・R_obs + 太陽へ近づく d − δ(δ = 10^4.5〜10^10 の半桁ごと —— 近い位置が太陽の R_d の外)
  venusGrid: Object.freeze({ log10From: -2, log10To: 10.5, step: 0.25, deltaLog10: Object.freeze([4.5, 5, 5.5, 6, 6.5, 7, 7.5, 8, 8.5, 9, 9.5, 10]), rootIter: 60 }),
  rules: Object.freeze([
    Object.freeze({ key: 'obsRatio', ja: '観測半径との比を固定(R_alt = c·R_obs)' }),
    Object.freeze({ key: 'rdRatio', ja: 'K1 の R_d との比を固定(R_alt = c·R_d = c·Y_k m)' }),
    Object.freeze({ key: 'absolute', ja: '同じ長さ(R_alt = 金星の根)' }),
  ]),
  // 地球–月の 3 体の帳簿: 月 → 地球・地球 → 月の口の型(勾配〔K1 のまま〕/同じ規則の別の半径)
  moonPorts: Object.freeze(['grad', 'alt']),
  // 口の接続(第326便d の ports に火星と月を足す —— 潮汐は起潮天体ごと。火星の衛星は本に無い〔太陽の潮汐だけ〕・月は地球の潮汐だけ)
  ports: Object.freeze({
    sun: Object.freeze({ k1: Object.freeze([]), tide: Object.freeze([]) }),
    venus: Object.freeze({ k1: Object.freeze(['sun']), tide: Object.freeze(['sun']) }),
    mars: Object.freeze({ k1: Object.freeze(['sun']), tide: Object.freeze(['sun']) }),
    earth: Object.freeze({ k1: Object.freeze(['sun', 'moon']), tide: Object.freeze(['sun', 'moon']) }),
    moon: Object.freeze({ k1: Object.freeze(['sun', 'earth']), tide: Object.freeze(['earth']) }),
  }),
  order: Object.freeze(['venus', 'mars', 'triEM']),   // 原仮定者の指示の順(太陽–金星 → 太陽–火星 → 太陽–地球–月)
  scaleLambda: 2,
});
/** 受け手の慣性係数の追加(文献の値 —— 本便は一次資料に当たっていない。他は第326便d の MOI) */
export const MOI_ADD = Object.freeze({ mars: 0.3662, moon: 0.3929 });

/* ───────── 差分と幾何 ───────── */
/** 近い位置と遠い位置の g から 2 つの差分(D は 2R で割る・D_K1 は 2R_d で割る) */
export function stencilDiff({ gNear, gFar, R, Rd }) {
  if (![gNear, gFar].every(Number.isFinite) || !(R > 0) || !(Rd > 0)) throw new RangeError('stencilDiff: g は有限・R と R_d は正');
  const diff = gNear - gFar;
  return { diff, D: diff / (2 * R), DK1: diff / (2 * Rd) };
}
/** エンジンの K1 の宣言の幾何の因子(鏡映 × sinθ —— n̂ は源から受け手へ・â は源の軸) */
export function geomFactor(n, aSrc) {
  if (!vec3(n) || !vec3(aSrc)) throw new RangeError('geomFactor: 3 成分');
  const sinTheta = norm(cross(aSrc, n)), mu = dot(n, aSrc), mirror = sub(scale(n, 2 * mu), aSrc);
  return { sinTheta, mu, mirror, vec: scale(mirror, sinTheta) };
}
/** 伝達 t(源の単位の自転あたりの軸の角速度のベクトル): gain·sinθ·鏡映·amp(amp は D・D_K1 か中心の勾配) */
export function transferOf(amp, geo, gain) { return scale(geo.vec, gain * amp); }
/** 型の値(form の鍵 → 差分の量) */
export function ampOf(form, sd) {
  if (form === 'diffStencil') return sd.D;
  if (form === 'diffK1') return sd.DK1;
  throw new RangeError('ampOf: 型 ' + form);
}

/* ───────── 規則の固定と適用 ───────── */
/** 金星の根から規則の係数を固定する(body = {R, Rd}) */
export function freezeRule(rule, Ralt, venus) {
  if (!(Ralt > 0)) throw new RangeError('freezeRule: 根は正');
  if (rule === 'obsRatio') return { rule, c: Ralt / venus.R };
  if (rule === 'rdRatio') return { rule, c: Ralt / venus.Rd };
  if (rule === 'absolute') return { rule, c: Ralt };
  throw new RangeError('freezeRule: 規則 ' + rule);
}
/** 固定した規則を天体へ当てる */
export function applyRule(fr, body) {
  if (fr.rule === 'obsRatio') return fr.c * body.R;
  if (fr.rule === 'rdRatio') return fr.c * body.Rd;
  if (fr.rule === 'absolute') return fr.c;
  throw new RangeError('applyRule: 規則 ' + fr.rule);
}

/* ───────── 格子 ───────── */
/** 金星の別の半径の格子(d = 距離・Rd = K1 の R_d・R = 観測半径・Rsrc = 太陽の R_d —— 近い位置が太陽の R_d の外) */
export function radiusGrid(G, { d, Rd, R, RdSun }) {
  const set = new Set();
  for (let e = G.log10From; e <= G.log10To + 1e-9; e += G.step) { const x = Math.pow(10, e); if (x < d - RdSun) set.add(x); }
  set.add(Rd); set.add(R);
  for (const e of G.deltaLog10) { const x = d - Math.pow(10, e); if (x > 0 && Math.pow(10, e) > RdSun) set.add(x); }
  return [...set].sort((a, b) => a - b);
}
/** 根の在る区間 → 二分法(値は呼び手の関数 —— 符号が変わる隣り合う点)。kind: 'zero'(二分法の後の値が区間の始めの値の 1e-6 の内 —— 零点)/
 *  'jump'(値が縮まない —— 発散か跳びの符号の変化で零点ではない) */
export function rootsOnGrid(fn, xs, iter) {
  const vals = xs.map(fn), flips = LS.signChanges(vals), roots = [];
  for (const k of flips) {
    const r = LS.bisectLog(fn, xs[k], xs[k + 1], iter);
    if (!r) continue;
    const v0 = Math.max(Math.abs(vals[k]), Math.abs(vals[k + 1])), v1 = Math.max(Math.abs(r.fLo), Math.abs(r.fHi));
    roots.push(Object.assign(r, { v0, kind: v1 <= 1e-6 * v0 ? 'zero' : 'jump' }));
  }
  return { vals, flips, roots };
}

/* ───────── 系(族 S・族 E —— 第327便a の solve をそのまま使う)───────── */
/** 系の天体(f は銀河の応答 —— K1 の R_d で)と口(k1 の伝達は呼び手が渡す: tOf(recv, src))。tide の n は呼び手の tidesOf(recv, raiser) */
export function systemOf(bodies, keys, p, tOf, tidesOf, ports = DECL.ports) {
  const RdSun = bodies.sun.Rd;
  return keys.map((key) => {
    const b = bodies[key], P = ports[key], pp = [{ kind: 'gal' }];
    for (const src of P.k1) pp.push({ kind: 'k1', src, t: tOf(key, src) });
    for (const raiser of P.tide) pp.push({ kind: 'tide', src: raiser, n: tidesOf(key, raiser), y: 1 });
    return { key, s: b.s, a: b.a, f: key === 'sun' ? 1 : Math.pow(b.Rd / RdSun, p), Rd: b.Rd, ports: pp };
  });
}
export function paramsOf(bodies, family, lam = 1) {
  const gamma0 = Object.fromEntries(Object.values(bodies).filter((b) => b.I).map((b) => [b.key, b.I * lam]));
  return { family, g: bodies.g, gamma0, beta: {}, alloc: LS.DECL.allocations.equal };
}
/** 帳簿の要約(第327便a の口座 —— 口ごとの Q・P・供給・閉じ) */
export function ledgerOf(ev) {
  const ld = ev.ledger;
  return { galaxySupply: ld.galaxySupply, orbitWork: ld.orbitWork, k1Draw: ld.k1Draw, heat: ld.heat, radiation: ld.radiation, spinPower: ld.spinPower, residualRel: ld.residualRel,
    k1TransferRel: relD(ld.k1Transfer.draw, ld.k1Transfer.sourceReactionWork), portCloseMaxRel: ld.portCloseMaxRel, LTotalRel: ld.L.totalRel,
    holdWorkMaxRel: Math.max(...ev.rows.map((q) => Math.abs(q.holdWork) / Math.max(q.ports.reduce((a, z) => a + Math.abs(z.heat), 0), 1e-300))) };
}
export function portTable(ev) {
  return ev.rows.map((R) => ({ key: R.key, s: R.s, heat: R.heat, alongRel: R.alongRel, reaction: R.reaction,
    ports: R.ports.map((q) => ({ kind: q.kind, src: q.src, w: q.w, vAlong: q.vAlong, nuAlong: q.nuAlong, Gamma: q.Gamma, torqueAlong: q.torqueAlong, heat: q.heat, supply: q.supply, negative: q.negative })) }));
}

/* ───────── 純関数の場面(QA lint.axialDiff327e と器の P 段 —— 玩具の場は閉じた式〔エンジンの写しではない〕)───────── */
export function pureScenes() {
  const S = {};
  // 玩具の比の場: g(r; c) = a·M(r)/(a/r + c)(M = s²/(5r²) —— 源の場 a/r と受け手の自己の場 c の比)
  const toyG = (r, a, s, c) => a * (s * s / (5 * r * r)) / (a / r + c);
  // ① 勾配の極限: D(R) → −g′(d)(R → 0)・D_K1(R) = (R/R_d)·D(R)
  { const a = 3, s = 0.2, c = 40, d = 7, Rd = 1e-3, gp = (r) => -(toyG(r * (1 + 1e-6), a, s, c) - toyG(r * (1 - 1e-6), a, s, c)) / (2e-6 * r);
    const R = 1e-4, sd = stencilDiff({ gNear: toyG(d - R, a, s, c), gFar: toyG(d + R, a, s, c), R, Rd }), R2 = 0.5, sd2 = stencilDiff({ gNear: toyG(d - R2, a, s, c), gFar: toyG(d + R2, a, s, c), R: R2, Rd });
    S.gradLimit = { D: sd.D, grad: gp(d), rel: relD(sd.D, gp(d)), DK1overD: sd2.DK1 / sd2.D, RoverRd: R2 / Rd }; }
  // ② 比の頭打ち: 自己の場 c = 0 の比は D(R) = s²/(5(d² − R²))(厳密 —— R に依らない勾配 s²/(5d²) の 1/(1 − R²/d²) 倍)
  { const a = 3, s = 0.2, d = 7, R = 2, sd = stencilDiff({ gNear: toyG(d - R, a, s, 0), gFar: toyG(d + R, a, s, 0), R, Rd: 1 });
    S.saturation = { D: sd.D, exact: s * s / (5 * (d * d - R * R)), rel: relD(sd.D, s * s / (5 * (d * d - R * R))), gradSat: s * s / (5 * d * d) }; }
  // ③ 自己の場が勝つ間(c ≫ a/d)は D ∝ R(自己の場 c = m/R とすると D は R に比例)・源の場が勝つと D は頭打ち(D ≤ s²/(5(d² − R²)))—— D_K1 は R に比例して伸びる
  { const a = 3, s = 0.2, d = 7, m = 1e-3, Rd = 1e-7, Rs = [1e-6, 1e-5, 1e-3, 0.5, 2, 5], rows = Rs.map((R) => { const sd = stencilDiff({ gNear: toyG(d - R, a, s, m / R), gFar: toyG(d + R, a, s, m / R), R, Rd }); return { R, D: sd.D, DK1: sd.DK1, bound: s * s / (5 * (d * d - R * R)) }; });
    S.regimes = { rows, linearRatio: rows[1].D / rows[0].D, boundOk: rows.every((q) => q.D <= q.bound * (1 + 1e-12)), dk1Grows: rows.every((q, k) => k === 0 || q.DK1 > rows[k - 1].DK1), satRel: relD(rows[4].D, rows[4].bound) }; }
  // ④ 規則の固定と適用(金星へ当て直すと根に戻る)
  { const V = { R: 6, Rd: 0.04 }, M = { R: 3, Rd: 0.005 }, Ralt = 123.4;
    S.rules = DECL.rules.map((r) => { const fr = freezeRule(r.key, Ralt, V); return { rule: r.key, back: applyRule(fr, V), mars: applyRule(fr, M) }; }); }
  // ⑤ 幾何の因子: 源の赤道面の受け手(n̂ ⟂ â)は逆向き(鏡映 −â・sinθ 1)・極の受け手は sinθ 0
  { const g1 = geomFactor([1, 0, 0], [0, 0, 1]), g2 = geomFactor([0, 0, 1], [0, 0, 1]); S.geom = { eqVec: g1.vec, eqSin: g1.sinTheta, poleSin: g2.sinTheta, poleVec: g2.vec }; }
  // ⑥ 格子の根(玩具 —— 単調な関数の根を格子と二分法で)
  { const r = rootsOnGrid((x) => Math.log10(x) - 3.3, [1, 10, 100, 1000, 1e4, 1e5], 60), j = rootsOnGrid((x) => 1 / (Math.log10(x) - 3.3), [1, 10, 100, 1000, 1e4, 1e5], 60);
    S.grid = { root: r.roots.length ? r.roots[0].x : null, kind: r.roots.length ? r.roots[0].kind : null, flips: r.flips, jumpKind: j.roots.length ? j.roots[0].kind : null }; }
  // ⑦ 系(2 天体 —— 銀河・差分の K1 の口・潮汐)を族 S・族 E で解く: 帳簿の閉じ(第327便a の evaluate)・尺度 λ
  { const bodies = { sun: { key: 'sun', s: 2, a: [0, 0, 1], Rd: 1, I: 3 }, venus: { key: 'venus', s: -0.25, a: [Math.sin(0.02), 0, Math.cos(0.02)], Rd: 0.01, I: 0.5 }, g: [0.6, 0, -0.8] };
    const tt = transferOf(-0.4, geomFactor([1, 0, 0], [0, 0, 1]), 1), sys = systemOf(bodies, ['sun', 'venus'], 0, () => tt, () => [0, 0, 0.3]);
    const out = {};
    for (const fam of ['S', 'E']) { const r = LS.solve(sys, paramsOf(bodies, fam)), r2 = LS.solve(sys, paramsOf(bodies, fam, 2)); out[fam] = { A: r.A, beta: r.beta.venus, accepted: r.accepted, along: r.alongMaxRel, ledger: ledgerOf(r.ev), heatRatio: r2.ev.ledger.heat / r.ev.ledger.heat, betaRel: relD(r2.beta.venus, r.beta.venus) }; }
    S.system = out; }
  // ⑧ 入力の拒否(非有限の g・正でない R)
  S.reject = [[NaN, 1, 1, 1], [1, 1, 0, 1], [1, 1, 1, -1]].every(([a, b, R, Rd]) => { try { stencilDiff({ gNear: a, gFar: b, R, Rd }); return false; } catch (e) { return true; } });
  return S;
}
export function pureGates(S) {
  const close = (a, b, t = 1e-12) => Math.abs(a - b) <= t * Math.max(1, Math.abs(a), Math.abs(b));
  return {
    gradLimit: S.gradLimit.rel <= 1e-6 && close(S.gradLimit.DK1overD, S.gradLimit.RoverRd),
    saturationExact: S.saturation.rel <= 1e-12 && S.saturation.D > S.saturation.gradSat,
    regimes: Math.abs(S.regimes.linearRatio - 10) <= 0.02 * 10 && S.regimes.boundOk && S.regimes.dk1Grows && S.regimes.satRel <= 0.01,
    rulesRoundTrip: S.rules.every((q) => close(q.back, 123.4)) && close(S.rules.find((q) => q.rule === 'obsRatio').mars, 123.4 * 3 / 6) && close(S.rules.find((q) => q.rule === 'rdRatio').mars, 123.4 * 0.005 / 0.04) && S.rules.find((q) => q.rule === 'absolute').mars === 123.4,
    geomMirror: close(S.geom.eqSin, 1) && close(S.geom.eqVec[2], -1) && S.geom.poleSin === 0 && norm(S.geom.poleVec) === 0,
    gridRoot: S.grid.root !== null && close(S.grid.root, Math.pow(10, 3.3), 1e-12) && JSON.stringify(S.grid.flips) === '[3]' && S.grid.kind === 'zero' && S.grid.jumpKind === 'jump',
    systemLedger: ['S', 'E'].every((f) => S.system[f].along <= 1e-12 && S.system[f].ledger.residualRel <= 1e-12 && S.system[f].ledger.LTotalRel <= 1e-12 && S.system[f].ledger.k1TransferRel <= 1e-12
      && S.system[f].ledger.portCloseMaxRel <= 1e-12 && close(S.system[f].heatRatio, 2) && S.system[f].betaRel <= 1e-12),
    rejectInputs: S.reject === true,
  };
}
