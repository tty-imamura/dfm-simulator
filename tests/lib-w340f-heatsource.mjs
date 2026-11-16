// 第340便f(原仮定者の指示(2026-11-17 —— 第140報)の決断事項 → 台帳の AN760 = A「源ごとの応答の係数を足す(銀河の項と主星の項で係数を分ける)」・
//   AN761 = C「2 つの読みを両方表に残す(並べる順は「内合のたびにほぼ同じ面」の読みを先に)」・統括の検証項目 R361):
//   **熱と共鳴の探索の純関数(第2段)** —— T1 源ごとの応答の係数(銀河の項 Γ_bg と主星の項 Γ_host を分ける)で、第337便c のロックの有無の分類・イオの熱・金星で釣り合う比を同じ平面で読む/
//   T2 金星と地球の共鳴の 2 つの読み(B: ロックの近くを回る状態 —— 先に/A: 秤動の幅の内 —— 狭い列)と第338便b の 3 成分の残りを 1 つの表に
//   (器 tests/exp-w340f-heatsource.mjs と QA behavior.heatsource340f・docs.heatsource340f が読む —— html を読まない・状態を持たない)。
//   **全部「診断」**(エンジン・内蔵の本・受理器・`S._core` へ足す操作ではない)。第338便f・第337便c・第326便d・第338便b の lib は呼ぶだけ(本文は変えない)。
//
// ■ 置き方(探索の入り口 —— 式の形は走行の前に決め打ちしない。どれもノブ。何を測ったかの記録)
//   T1 応答の係数を源ごとに 2 つ: 主星の項(主星と太陽 —— 系の中の源)Γ_host・銀河の項 Γ_bg。比 ρ = Γ_bg/Γ_host。
//     (i) 第337便c の分類: 受け手 i の外部の軸引きずり N_i = Γ_host a_i + Γ_bg g_i(a_i = Σ_系の中の源 I β |ω − n|・g_i = I β_g |ω_g − n| —— 第337便c の bodyRow の Nax を源で分けた値)。
//         ロックしている行は N_i < T_i(T_i = 潮汐の物差し Ntide)・していない行(と太陽)は N_i > T_i —— ρ を決めると Γ_host の窓 [lo(ρ), hi(ρ)] になる(第337便c の帯は ρ = 1 の窓)。
//     (ii) イオの熱: 第338便f の源ごとの口(逆向きは打ち消さない)は Γ について線形 —— Q = Γ_host u_host + Γ_bg u_bg ≤ 観測の熱流(全球の物差し —— イオだけを超過の判定に使う)。
//     (iii) 金星で釣り合う比(恒久の条件 AN720)を同じ物差しの 1 成分で: 金星の観測の自転 s_♀ に対する太陽の項 I β_☉ (c ω_☉ − s_♀) と銀河の項 I β_g (c ω_g cos 120° − s_♀) が
//         打ち消す比 ρ_V(向きが逆のときだけ在る)。釣り合いは**トルクの向き付きの和**(熱は源ごとの非負の和 —— 別の帳簿)。
//     (iv) 3 つの窓が重ならないとき、次に足すノブの試し: 束縛された系の中(主星が太陽でない受け手)で銀河の項が遮られる係数 σ(衛星の ρ = σ ρ_V)。帯そのものは動かさない(AN760)。
//   熱の向きの分け: 口の滑りを受け手の自転の軸に平行の分と垂直の分に分ける(垂直の分のトルクは自転の大きさを変えない —— 歳差だけならそれ自体は熱ではない。熱にするなら散逸の応答を別に置く)。
//   T2 共鳴: 第338便f の共鳴の調和の成分 A_k(k = −10)と永久の変形 (B − A)/C の復元 K = (3/2)((B − A)/C) I G M_⊕ A_k。秤動の振動数 ω_lib = √(2K/I)。
//     読み B(先に): 内合ごとの面のずれ・位相が 1 周する内合の数・滑り ÷ ω_lib(> 1 なら秤動の幅の外を回る —— 捕まる途中か通り過ぎるかは滑りの向きと正味のトルクの向き)・保つ力と入る減衰の 2 つの物差し。
//     読み A(狭い列): 秤動の幅の内 —— 要る (B − A)/C。
//     第338便b の 3 成分の残り(太陽の項に対する比 —— 軸に平行・軸に垂直)を、第338便f の定常の解の式 |N_st ± ε N_ax| ≤ K の ε に入れる(軸に垂直の分を歳差と読む列は ε = 軸に平行の分だけ)。
// ■ 言わないこと: イオの熱の出どころを決めたとは書かない・帯と熱の同時の成否で閉じない(このノブの組では、の表と、次に足すノブ)・共鳴へ捕まる途中か通り過ぎたかは書かない・
//   共鳴の原因が潮汐とは書かない・金星の大気の熱潮汐は扱わない(原仮定者の回答 3)・文献の値は一次資料に当たっていない(未照合)。
import * as HL from './lib-w338f-heatlock.mjs';
import * as TL from './lib-w337c-tidelock.mjs';
import * as AH from './lib-w326d-axialheat.mjs';
import * as BK from './lib-w338b-bevelknob.mjs';

export const LIB_VERSION = 'w340f-heatsource-lib-1';
const fin = (x) => typeof x === 'number' && Number.isFinite(x);
const G = TL.G_SI, C0 = TL.C_SI, YR = TL.YR, DAY = 86400;
const val = (id, k) => TL.BODY_SRC[id][k][0];

/* ───────── 宣言(走らせるノブの格子と判定の物差し —— 式の形の宣言ではなく、何を測ったかの記録)───────── */
export const DECL = Object.freeze({
  /** T1: ρ = Γ_bg/Γ_host の格子(0 = 銀河の項なし)・Γ_host = 0 の行は別に・窓の端を探す走査の格子と二分の回数・熱の読み・金星の釣り合いの読み・遮りの係数 σ の格子 */
  t1: Object.freeze({ rho: Object.freeze([0, 1e-6, 1e-5, 1e-4, 1e-3, 3e-3, 1e-2, 3e-2, 0.1, 0.3, 1, 3, 10, 100, 1e4]), scan: Object.freeze({ lo: -10, hi: 6, n: 321, bisect: 60 }),
    readings: Object.freeze(['aligned', 'diff']), galTiltDeg: 120, alpha: 2, venusRefs: Object.freeze(['obsSpin', 'lockN']), shieldReading: 'diff', shieldRef: 'obsSpin',
    sigma: Object.freeze([1, 0.3, 0.1, 3e-2, 1e-2, 3e-3, 1e-3, 0]),
    rulers: Object.freeze({ Io: 'global', Moon: 'total', Enceladus: 'regional' }) }),
  /** T2: 永久の変形 (B − A)/C の格子(第338便f と同じ)・太陽の潮汐の k₂/Q の格子・共鳴の調和の求積の点・第337便c の帯の 2 点 */
  t2: Object.freeze({ bac: Object.freeze([1e-7, 1e-6, 1e-5, 1e-4, 1e-3]), k2q: Object.freeze([1e-5, 1e-4, 1e-3, 1e-2]), nQuad: 20000, bandPts: Object.freeze(['lo', 'hi']) }),
});
/** 物差しの領域(統括の検証項目 —— 外の照合の指摘・一次資料はこの環境から届かない: 文献の値・未照合) */
export const RULERS = Object.freeze({
  global: '全球の物差し(イオ —— 全球の熱流の桁 1e14 W)—— 超過の判定に使う',
  regional: '領域の違う物差し(エンケラドゥス —— 南極域の放射の推定 15.8 GW の桁・全球の上限ではなく下限の側)—— 比は並べるだけ(超過の判定に使わない)',
  total: '総量の物差し(月 —— 2 点の熱流の全球への外挿・放射性の熱を含む総量。DFM に割り当てられる残りは別)—— 比は並べるだけ(超過の判定に使わない)',
  note: '物差しの領域の分けは統括の検証項目(外の照合の指摘 —— 文献の値・未照合)。第338便f の節の文は書き換えない(第340便f の注)',
});

/* ───────── T1 天体の行 ───────── */
/** 第337便c の分類の行(水星〔共鳴〕は分類の外 —— 第337便c と同じ)。外部の軸引きずりを系の中の源 a と銀河 g に分ける。bound = 主星が太陽でない受け手(太陽は除く) */
export function classRows() {
  return TL.bodyTable().rows.filter((r) => r.state !== 'resonance').map((r) => {
    const row = TL.BODY_ROWS.find((x) => x.id === r.id), a = r.ax.filter((x) => x.src !== 'galaxy').reduce((s, x) => s + x.Nax, 0), g = r.ax.find((x) => x.src === 'galaxy').Nax;
    return { id: r.id, state: r.state, locked: r.state === 'locked', bound: row.host !== 'Sun' && r.id !== 'Sun', T: r.Ntide, a, g, NaxSum: r.NaxSum };
  });
}
/** 第338便f の源ごとの口(Γ₀ = 1)を主星の項(主星 + 太陽)と銀河の項に分け、受け手の自転の軸(ẑ)に平行の分と垂直の分に分ける。熱は Γ について線形 */
export function heatUnits(row, reading) {
  // 受け手の自転は ẑ(Ω = n ẑ)—— 主星と太陽の目標は ẑ に平行(垂直の分 0)・銀河の目標の垂直の分は |c| ω_g sin 120°(c = ±1)。平行の分は口のトルクの ẑ 成分から
  const sinG = Math.sin(DECL.t1.galTiltDeg * Math.PI / 180), A = HL.axialHeat(row, 1, reading);
  const part = (q) => { const sz = q.Gamma > 0 ? q.torqueAlong / q.Gamma : 0, perpW = q.src === 'galaxy' ? TL.GALAXY.omega * sinG : 0; return { heat: q.heat, along: q.Gamma * sz * sz, perp: q.Gamma * perpW * perpW }; };
  const sum = (xs) => xs.reduce((s, q) => ({ heat: s.heat + q.heat, along: s.along + q.along, perp: s.perp + q.perp }), { heat: 0, along: 0, perp: 0 });
  const host = sum(A.ports.filter((q) => q.src !== 'galaxy').map(part)), bg = part(A.ports.find((q) => q.src === 'galaxy'));
  return { reading, host, bg, uHost: host.heat, uBg: bg.heat };
}
/** ρ を決めたときの Γ_host の窓: 分類(ロックしていない行の下限 lo・ロックしている行の上限 hiCls)と熱(hiHeat = H/(u_host + ρ u_bg)) */
export function windowAt(rho, cls, hu, H, sigma = 1) {
  if (!(rho >= 0) || !(sigma >= 0 && sigma <= 1)) throw new RangeError('windowAt: ρ ≥ 0・0 ≤ σ ≤ 1');
  const rr = (c) => (c.bound ? sigma * rho : rho);
  let lo = 0, loBy = null, hi = Infinity, hiBy = null;
  for (const c of cls) { const v = c.T / (c.a + rr(c) * c.g);
    if (c.locked) { if (v < hi) { hi = v; hiBy = c.id; } } else if (v > lo) { lo = v; loBy = c.id; } }
  const rHeat = sigma * rho, hiHeat = fin(H) && hu ? H / (hu.uHost + rHeat * hu.uBg) : null;
  const top = hiHeat === null ? hi : Math.min(hi, hiHeat);
  return { rho, sigma, lo, loBy, hiCls: hi, hiBy, hiHeat, clsOk: hi > lo, ok: top > lo, width: top > lo ? top / lo : null };
}
/** Γ_host = 0(銀河の項だけ)の窓 —— Γ_bg で */
export function windowHostOff(cls, hu, H) {
  let lo = 0, loBy = null, hi = Infinity, hiBy = null;
  for (const c of cls) { const v = c.T / c.g; if (c.locked) { if (v < hi) { hi = v; hiBy = c.id; } } else if (v > lo) { lo = v; loBy = c.id; } }
  const hiHeat = fin(H) && hu ? H / hu.uBg : null;
  return { lo, loBy, hiCls: hi, hiBy, hiHeat, clsOk: hi > lo, ok: hi > lo && (hiHeat === null || hiHeat > lo) };
}
/** 窓が開く ρ の区間(log ρ の走査 + 端の二分)。key: 'ok'(分類と熱)か 'clsOk'(分類だけ) */
export function rhoIntervals(cls, hu, H, key, sigma = 1, D = DECL.t1.scan) {
  const at = (lr) => windowAt(Math.pow(10, lr), cls, hu, H, sigma)[key];
  const bis = (a, b) => { const fa = at(a); for (let j = 0; j < D.bisect; j++) { const m = 0.5 * (a + b); if (at(m) === fa) a = m; else b = m; } return 0.5 * (a + b); };
  const out = []; let prev = at(D.lo), start = prev ? null : undefined, lrPrev = D.lo;
  const zeroOk = windowAt(0, cls, hu, H, sigma)[key];
  if (prev) start = null;   // 走査の下端で開いている —— 下端より小さい側に続く(ρ = 0 の窓は zeroOk)
  for (let j = 1; j < D.n; j++) {
    const lr = D.lo + (D.hi - D.lo) * j / (D.n - 1), cur = at(lr);
    if (cur !== prev) { const e = bis(lrPrev, lr); if (cur) start = e; else { out.push({ from: start === null ? null : Math.pow(10, start), to: Math.pow(10, e) }); start = undefined; } }
    prev = cur; lrPrev = lr;
  }
  if (prev) out.push({ from: start === null ? null : Math.pow(10, start), to: null });
  return { key, zeroOk, intervals: out, scan: { lo: D.lo, hi: D.hi, n: D.n } };
}
/** 金星で釣り合う比 ρ_V(1 成分 —— 黄道の北の向き。太陽の項と銀河の項のトルク ÷ Γ が逆向きのときだけ)。ref: obsSpin(観測の自転 —— 逆行は負)/lockN(第337便c の物差しの n) */
export function venusBalance(reading, ref) {
  if (!DECL.t1.readings.includes(reading) || !DECL.t1.venusRefs.includes(ref)) throw new RangeError('venusBalance: 読みは ' + DECL.t1.readings.join('・') + '・物差しは ' + DECL.t1.venusRefs.join('・'));
  const c = reading === 'aligned' ? 1 : 1 - DECL.t1.alpha, M = val('Venus', 'M'), R = val('Venus', 'R'), I = val('Venus', 'C') * M * R * R, a = val('Venus', 'aHel');
  const s = ref === 'obsSpin' ? 2 * Math.PI / val('Venus', 'spin') : 2 * Math.PI / val('Venus', 'porb');
  const bS = G * val('Sun', 'M') / (a * C0 * C0), wS = 2 * Math.PI / val('Sun', 'spin'), cosG = Math.cos(DECL.t1.galTiltDeg * Math.PI / 180);
  const nSun = I * bS * (c * wS - s), nGal = I * TL.GALAXY.beta * (c * TL.GALAXY.omega * cosG - s);
  const opp = Math.sign(nSun) * Math.sign(nGal) < 0;
  return { reading, ref, c, s, nSun, nGal, opposite: opp, rhoV: opp ? -nSun / nGal : null };
}
/** 遮りの係数 σ(束縛された系の中の受け手の銀河の項 —— 衛星の ρ = σ ρ_V)の表と、分類と熱が両方開く σ の上限(二分) */
export function shieldTable(cls, hu, H, rhoV, D = DECL.t1) {
  const rows = D.sigma.map((sg) => { const w = windowAt(rhoV, cls, hu, H, sg); return { sigma: sg, lo: w.lo, loBy: w.loBy, hiCls: w.hiCls, hiBy: w.hiBy, hiHeat: w.hiHeat, clsOk: w.clsOk, ok: w.ok }; });
  const okAt = (sg) => windowAt(rhoV, cls, hu, H, sg).ok;
  let sMax = null;
  if (okAt(0) && !okAt(1)) { let a = 0, b = 1; for (let j = 0; j < D.scan.bisect; j++) { const m = 0.5 * (a + b); if (okAt(m)) a = m; else b = m; } sMax = 0.5 * (a + b); } else if (okAt(1)) sMax = 1;
  return { rhoV, rows, sigmaMax: sMax, okAtZero: okAt(0) };
}

/* ───────── T2 金星と地球の共鳴の 2 つの読み ───────── */
/** 共鳴の物差し: 第338便f の周期・金星の物差し・調和の成分 A_k(k = 共鳴の番号) */
export function resonanceBase(D = DECL.t2) {
  const P = HL.venusEarthPeriods(), V = HL.venusScales(), aV = val('Venus', 'aHel'), aE = val('Earth', 'aHel');
  const h = HL.harmonicA({ aV, aE, nV: P.nV, nE: P.nE, k: P.k, nQuad: D.nQuad });
  return { P, V, A: h.A, GM_E: G * val('Earth', 'M') };
}
/** 読み B と A の 1 行((B − A)/C ごと): 復元 K・秤動の振動数・滑り ÷ 秤動の振動数・秤動の周期 */
export function readingRow(B, bac) {
  if (!fin(bac) || bac <= 0) throw new RangeError('readingRow: (B − A)/C は正');
  const K = 1.5 * bac * B.V.I * B.GM_E * B.A, wl = Math.sqrt(2 * K / B.V.I);
  return { bac, K, omegaLib: wl, slipOverLib: Math.abs(B.P.slip) / wl, inside: Math.abs(B.P.slip) < wl, libPeriodYr: 2 * Math.PI / wl / YR };
}
/** 読み B の位相の量: 内合ごとの面のずれ・面が 1 周(360°)と復元の位相が 1 周(180° —— sin 2(θ − φ) の周期)する内合の数と年・太陽の潮汐だけのときの滑りの向き(近づく/離れる)と滑りを渡る時間 */
export function phaseDrift(B, D = DECL.t2) {
  const P = B.P, d = Math.abs(P.driftDegPerConj), TsynYr = P.TsynDay * DAY / YR;
  const tideSign = Math.sign(P.nV - P.sObs);   // 太陽の潮汐は自転を公転の角速度へ寄せる向き(逆行の自転では s を増やす)
  const toward = Math.sign(-P.slip) === tideSign;   // 滑り s − s_res を 0 へ寄せる向きか
  const cross = D.k2q.map((k) => { const Nst = 1.5 * k * B.V.tideUnit; return { k2q: k, Nst, crossYr: B.V.I * Math.abs(P.slip) / Nst / YR }; });
  return { driftDegPerConj: P.driftDegPerConj, conjPerFace: 360 / d, conjPerPhase: 180 / d, yrPerFace: 360 / d * TsynYr, yrPerPhase: 180 / d * TsynYr, tideTowardRes: toward, cross };
}
/** 第338便b の 3 成分の残り(根ごと)を太陽の項に対する比へ: ε_∥(軸に平行)・ε_⊥(軸に垂直)・ε_tot */
//   根は f < 1 − 1e-9 の内の、同じ列で同じ種類の最初の 1 つだけ(第338便b の根の走査は、実行系の末尾の bit により格子の端 f = 1 に見かけの根を拾うことがある —— 尺度の走り直しで
//   列 B′ に f 0.9999999999999999 の根を 1 度見た。背景の項 (1 − f) が 0 になる端で、釣り合いの根ではない)
export function residualEps() {
  const seen = new Set();
  return BK.an747Venus().flatMap((c) => c.roots.filter((r) => { if (!(r.f < 1 - 1e-9)) return false; const k = c.col + '|' + r.kind; if (seen.has(k)) return false; seen.add(k); return true; }).map((r) => { const k = (r.sunMag + r.bgMag) / r.sunMag;
    return { col: c.col, kind: r.kind, f: r.f, alongRel: r.alongSpinRel, perpRel: r.perpSpinRel, epsAlong: r.alongSpinRel * k, epsPerp: r.perpSpinRel * k, epsTot: Math.hypot(r.alongSpinRel, r.perpSpinRel) * k }; }));
}
/** 定常の解の判定(第338便f の式): 同じ向き N_st + ε N_ax ≤ K・逆向き |N_st − ε N_ax| ≤ K */
export const steadyOk = (K, Nst, Nax, eps) => ({ same: Nst + eps * Nax <= K, opp: Math.abs(Nst - eps * Nax) <= K });

/* ───────── 純関数の場面 ───────── */
export function pureScenes() {
  const cls = classRows(), io = HL.satRows()[0], hu = heatUnits(io, 'aligned');
  // ① 天体が 1 つ(座標の回転だけ —— 受け手が源の座標と一緒に回る・滑りなし): 口の熱 0
  const Om = [0, 0, 2.5e-6], one = AH.port(Om, Om, 1e30);
  // ② ρ = 1 の窓が第337便c の帯と同じ
  const w1 = windowAt(1, cls, null, null), band = TL.bodyTable().sepX.band;
  // ③ 熱は Γ について線形: Γ_host = Γ_bg = Γ₀ の和が第338便f の axialHeat(Γ₀)と同じ
  const g0 = 3e-6, lin = (g0 * hu.uHost + g0 * hu.uBg) / HL.axialHeat(io, g0, 'aligned').heat;
  // ④ 逆向きの 2 つの口は熱を打ち消さない(トルクは打ち消す)
  const pa = AH.port([0, 0, 1], [0, 0, 2], 1), pb = AH.port([0, 0, 1], [0, 0, 0], 1);
  // ⑤ 秤動の幅の内の境目: 要る (B − A)/C で滑り ÷ ω_lib = 1
  const B = resonanceBase({ nQuad: 4000 }), bNeed = B.V.I * B.P.slip * B.P.slip / 2 / (1.5 * B.V.I * B.GM_E * B.A), edge = readingRow(B, bNeed).slipOverLib;
  // ⑥ 軸に平行と垂直の分け: 垂直の分は 0 以上・和が熱
  const split = [hu.host, hu.bg].every((q) => Math.abs(q.along + q.perp - q.heat) <= 1e-12 * q.heat) && hu.host.perp === 0 && hu.bg.perp > 0;
  const rej = [() => windowAt(-1, cls, hu, 1), () => windowAt(1, cls, hu, 1, 2), () => venusBalance('x', 'obsSpin'), () => venusBalance('diff', 'x'), () => readingRow(B, -1)]
    .map((f) => { try { f(); return false; } catch (e) { return e instanceof RangeError; } });
  return { oneBody: { heat: one.heat, torque: AH.norm(one.torque) }, band: { lo: w1.lo, hi: w1.hiCls, wantLo: band[0], wantHi: band[1] }, linear: lin,
    ports: { net: pa.torque[2] + pb.torque[2], heat: pa.heat + pb.heat }, libEdge: edge, split, kRes: B.P.k, rejects: rej };
}
export function pureGates(S) {
  return {
    oneBodyZero: S.oneBody.heat === 0 && S.oneBody.torque === 0,
    bandSame: Math.abs(S.band.lo - S.band.wantLo) <= 1e-12 * S.band.wantLo && Math.abs(S.band.hi - S.band.wantHi) <= 1e-12 * S.band.wantHi,
    linear: Math.abs(S.linear - 1) < 1e-12,
    portsNoCancel: S.ports.net === 0 && S.ports.heat === 2,
    libEdge: Math.abs(S.libEdge - 1) < 1e-12,
    split: S.split === true,
    resonanceIndex: S.kRes === -10,
    rejects: S.rejects.every(Boolean),
  };
}
