// 第342便e(原仮定者の回答(2026-11-18 —— 第141報の回答 AN803)「軸引きずりも含めてゼロ。ただし、軸引きずりの回転軸に自転軸を向ける力により、ジャイロトルクが発生して
//   継続的な歳差運動に繋がる。ジャイロトルクで動かなかった分のエネルギーは消えない。熱になるか、自転速度を増す。自転速度を増す経路が「パワーボール効果」」・統括の検証項目 R376):
//   **動かなかった分の出口を 2 つ(熱・自転の速さの増加)に分ける帳簿と、向ける先の軸が複数(太陽・銀河)の場合の探索の純関数**
//   (器 tests/exp-w342e-powerball.mjs と QA behavior.powerball342e・docs.powerball342e が読む —— html を読まない・状態を持たない)。
//   **全部「診断」**(エンジン・内蔵の本・受理器・`S._core` へ足す操作ではない)。第341便f・第341便b・第337便c・第330便a の lib は呼ぶだけ(本文は変えない)。
//
// ■ 帳簿(第341便f の 4 段の続き —— 式の形は走行の前に決め打ちしない。どれもノブ。何を測ったかの記録)
//   保つ仕事率 P_hold = Σ_j N_j²/(I abs(ω))(第341便f の型 (α) —— 源ごとに足す・打ち消さない)。動いた分(歳差の取り分)= μ P_hold・動かなかった分 P_un = (1 − μ) P_hold。
//   **出口**: 熱 = (1 − η) P_un・自転の運動エネルギーの増し分 = η P_un。残り = P_hold − 動いた分 − 熱 − 増し分(この型では定義から 0 —— 恒等式の検査として数える)。
//   **分け方 η の型を 3 つ並べる(1 つに決めない)**:
//     (s1) 一定の割合 η(0〜1)。
//     (s2) 駆動の周期と自転の周期の比で決まる型: r = g Ω_p/abs(ω)(Ω_p = 歳差の角速度 = N⊥/(I abs(ω))・g = 接触の幾何の比のノブ)・η = r/(1 + r)
//          (おもちゃのパワーボールの「駆動の回転が速いほど自転へ渡る」の置き方 —— 候補。r < 1 は「自転が駆動より速い」側)。
//     (s3) 位相の遅れで決まる型: 内部の応答が遅れの角 δ だけ自転の軸の側へ傾いて受け持つ —— η = sin²δ(候補)。
//   **角運動量の帳簿**: 自転の運動エネルギーが η P_un で増すなら、自転の向きの角運動量の率 τ∥ = η P_un/abs(ω) が要る。向ける力(自転の軸に垂直)の
//   自転の向きの成分は 0 なので、向ける力だけでは τ∥ は来ない —— 残り = τ∥(符号つき・0 に丸めない)。出どころの候補の列: 源の自転・軌道・外(背景 —— 量の上限を置かない)。
//   各列は「その角運動量を使い切るまでの時間」で並べる(どれから来るかは決めない)。軸引きずりの軸に平行の分(第341便f の Nalong —— 供給の側)を比べる列に置く。
//   **向ける力の大きさの則(T2 —— 3 つ)**: N_j = s × I β_j abs(1 − α) abs(ω_j) × f(θ_j)・s = Γ₀ × k_tilt × C_b(結びつきの係数 × 天体の特性の係数)。
//     f = abs(sin θ)(sin の型 —— 第341便f と同じ)・abs(sin 2θ)(2 倍角の形)・1 − cos θ(角の差の型 —— 反対向きで最大)。
//   **向ける先の軸が複数(T4)**: 太陽だけ・銀河だけ・両方。トルクのベクトル N = Σ_j N_j (ŝ × t̂_j)/abs(ŝ × t̂_j)。向ける先の軸の向き t̂ は源の自転の軸に
//   符号のノブ(rev = 赤道面の軸引きずりの逆回転の軸 −ŝ_src・fwd = ŝ_src)を掛ける。sin の型では Σ a_j (ŝ × t̂_j) = ŝ × A(A = Σ a_j t̂_j)なので 2 つの軸は 1 つの実効の軸に合わさる。
// ■ 言わないこと: 自転の由来の答え・金星と木星の内部熱の答え・拮抗の機構の答え・熱の出口の確定、とは書かない。理想の直交するトルクだけでは
//   散逸にならない(仕事率 = トルク・角速度 —— 零試験)。P_hold は第341便f の型 (α) の置き方(ノブ)。負の残りは 0 や絶対値にしない。天体の特性の係数を 1 に置いた結果を「合った」と書かない。
//   文献の値は一次資料に当たっていない(未照合)。
import * as F from './lib-w341f-gyroheat.mjs';
import * as TL from './lib-w337c-tidelock.mjs';
import * as B341 from './lib-w341b-bodycoef.mjs';
import * as S330 from './lib-w330a-spinclass.mjs';

export const LIB_VERSION = 'w342e-powerball-lib-1';
const fin = (x) => typeof x === 'number' && Number.isFinite(x);
const G = TL.G_SI, C0 = TL.C_SI, YR = TL.YR, D2R = Math.PI / 180;
const val = (id, k) => TL.BODY_SRC[id][k][0];

/* ───────── 宣言(走らせるノブの格子と判定の物差し —— 式の形の宣言ではなく、何を測ったかの記録)───────── */
export const DECL = Object.freeze({
  /** 分け方の型とノブ */
  splits: Object.freeze({ const: Object.freeze([0, 0.1, 0.5, 0.9, 1]), ratio: Object.freeze([1, 1e3, 1e6]), lag: Object.freeze([0, 1e-3, 1e-2, 0.1, 0.7853981633974483]) }),
  /** 可動度 μ(第341便f と同じ意味 —— 1 は理想のジャイロ: 零試験) */
  mu: Object.freeze([0, 0.5, 0.9]),
  /** 向ける力の大きさの則・天体の特性の係数の読み(1・第341便b の釣り合いの読み・速さの一致の読み)・結びつきの係数の選び(1・第341便f の下限・上限) */
  laws: Object.freeze(['sin', 'sin2', 'oneMinusCos']),
  cbReadings: Object.freeze(['one', 'bal', 'spd']),
  kPicks: Object.freeze(['one', 'kLo', 'kHi']),
  /** 向ける先の軸の符号(rev = 赤道面の逆回転の軸・fwd = 源の自転の軸)・向ける先の組 */
  targetSigns: Object.freeze(['rev', 'fwd']),
  targetSets: Object.freeze(['sun', 'galaxy', 'both']),
  /** 天体の表 */
  bodies: Object.freeze(['Venus', 'Jupiter', 'Earth', 'Mars', 'Io', 'Pluto', 'Charon']),
  t4Bodies: Object.freeze(['Jupiter', 'Venus']),
  /** 判定: 木星の「高い内部熱」(物差しの 0.1 倍以上)・イオの熱 ≤ 観測・分類の帯(第337便c)。金星は並べる列 */
  judge: 'Jupiter', cmp: 'Venus', io: 'Io', highFrac: 0.1, ageYr: 4.57e9,
  /** 基準の組(表の基準 —— 第341便f の結びつきの係数の試しと同じ: sin の型・C_b 1・k_tilt 下限・μ 0・Γ₀ = 帯の上端) */
  ref: Object.freeze({ law: 'sin', cb: 'one', k: 'kLo', mu: 0, split: 'const', knob: 0.5 }),
  alpha: 2,
  bisect: Object.freeze({ lo: -60, hi: 200, iter: 200 }),
});

/** 文献の値(本環境では一次資料に当たっていない —— 文献の値・未照合・確かさの程度)。リポジトリの中の値を先に呼ぶ */
export const LIT = Object.freeze({
  note: '文献の値・未照合(この環境から一次資料のサイトに届かない —— 出典の名と値は記憶とリポジトリの中の値の写し)',
  marsObl: 25.19, marsOblSrc: '火星の自転軸の傾き 25.19° —— 文献の値・未照合・確かさ 中',
  marsK2q: S330.DECL.lit.k2Q.mars, marsK2qSrc: '第330便a の lib の k₂/Q',
  /** 自転の軸の向き(赤道座標の赤経・赤緯 [deg] —— IAU の北極の向き。逆行の天体は自転のベクトルを北極の逆に置く)。文献の値・未照合・確かさ 中 */
  pole: Object.freeze({ Sun: Object.freeze([286.13, 63.87, 1]), Venus: Object.freeze([272.76, 67.16, -1]), Jupiter: Object.freeze([268.056595, 64.495303, 1]) }),
  poleSrc: '太陽(赤経 286.13°・赤緯 63.87°)・金星(272.76°・67.16° —— 逆行なので自転のベクトルは逆)・木星(268.0566°・64.4953°)の北極の向き —— 文献の値・未照合・確かさ 中',
  /** 銀河の北極(赤経・赤緯 [deg])。銀河の回転のベクトルは南極の側(北極から見て時計回り)。黄道の傾き [deg] */
  ngp: Object.freeze([192.85948, 27.12825]), ngpSrc: '銀河の北極 赤経 192.859°・赤緯 27.128°(銀河の回転のベクトルは南極の側)—— 文献の値・未照合・確かさ 中',
  eps: 23.4392911,
  earthPrecYr: 25772, earthPrecSrc: '地球の歳差の周期 約 25,772 年 —— 文献の値・未照合・確かさ 中(月と太陽の潮汐のトルク —— 本表の向ける力とは別の力)',
});

/* ───────── 小さな道具 ───────── */
const dot = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
const crs = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
const nrm = (a) => Math.hypot(a[0], a[1], a[2]);
const scl = (a, s) => [a[0] * s, a[1] * s, a[2] * s];
const add = (a, b) => [a[0] + b[0], a[1] + b[1], a[2] + b[2]];
/** 薄い角も落とさない角(atan2(abs(外積), 内積)) */
export const angleOf = (a, b) => Math.atan2(nrm(crs(a, b)), dot(a, b));
/** 赤道座標の赤経・赤緯 [deg] → 黄道座標の単位ベクトル */
export function eclUnit(raDeg, decDeg, eps = LIT.eps) {
  const a = raDeg * D2R, d = decDeg * D2R, e = eps * D2R, x = Math.cos(d) * Math.cos(a), y = Math.cos(d) * Math.sin(a), z = Math.sin(d);
  return [x, Math.cos(e) * y + Math.sin(e) * z, -Math.sin(e) * y + Math.cos(e) * z];
}
export const spinUnit = (id) => { const p = LIT.pole[id]; return scl(eclUnit(p[0], p[1]), p[2]); };
export const galUnit = () => scl(eclUnit(LIT.ngp[0], LIT.ngp[1]), -1);

/* ───────── 則と分け方 ───────── */
export function lawFactor(law, theta) {
  if (!fin(theta)) throw new RangeError('lawFactor: θ は有限');
  if (law === 'sin') return Math.abs(Math.sin(theta));
  if (law === 'sin2') return Math.abs(Math.sin(2 * theta));
  if (law === 'oneMinusCos') return 1 - Math.cos(theta);
  throw new RangeError('lawFactor: 則は ' + DECL.laws.join('・'));
}
/** 分け方: 自転へ渡る割合 η と熱へ行く割合 1 − η(打ち消しを避けて別に作る)。ctx = { omega, Op }(ratio の型だけが使う) */
export function etaOf(type, knob, ctx = {}) {
  if (!fin(knob) || knob < 0) throw new RangeError('etaOf: ノブは有限で非負');
  if (type === 'const') { if (knob > 1) throw new RangeError('etaOf: 0 ≤ η ≤ 1'); return { eta: knob, comp: 1 - knob }; }
  if (type === 'ratio') { const { omega, Op } = ctx; if (!(fin(omega) && omega !== 0 && fin(Op) && Op >= 0)) throw new RangeError('etaOf: ω ≠ 0・Ω_p ≥ 0'); const r = knob * Op / Math.abs(omega); return { eta: r / (1 + r), comp: 1 / (1 + r), r }; }
  if (type === 'lag') { const sn = Math.sin(knob), e2 = sn * sn; return { eta: e2, comp: 1 - e2 }; }   // 格子は δ ≤ π/4(η ≤ ½ —— 打ち消しは起きない)
  throw new RangeError('etaOf: 型は const・ratio・lag');
}
/** 動かなかった分 P_un を出口 2 つに分ける(熱・自転の運動エネルギーの増し分)。e = etaOf の戻り値 */
export function splitUnmoved(Pun, e) {
  if (!(fin(Pun) && Pun >= 0 && e && fin(e.eta) && e.eta >= 0 && e.eta <= 1 && fin(e.comp) && e.comp >= 0 && e.comp <= 1)) throw new RangeError('splitUnmoved: P_un ≥ 0・0 ≤ η ≤ 1');
  return { heat: e.comp * Pun, spin: e.eta * Pun };
}

/* ───────── 天体の行(第341便f の bodyRows を呼ぶ —— 火星だけ同じ形で足す)───────── */
export function bodyRows() {
  const base = F.bodyRows(), want = DECL.bodies, out = [];
  for (const id of want) {
    if (id === 'Mars') {
      const M = val('Mars', 'M'), R = val('Mars', 'R'), C = val('Mars', 'C'), a = val('Mars', 'aHel'), n = 2 * Math.PI / val('Mars', 'porb'), w = 2 * Math.PI / val('Mars', 'spin');
      out.push({ id: 'Mars', host: 'Sun', sync: false, M, R, C, I: C * M * R * R, omega: w, n, a, e: null, Mp: val('Sun', 'M'),
        tides: [{ p: 'Sun', kind: 'slip', Mp: val('Sun', 'M'), a, nP: n }],
        tilt: [{ src: 'Sun', beta: G * val('Sun', 'M') / (a * C0 * C0), w: 2 * Math.PI / val('Sun', 'spin'), theta: LIT.marsObl * D2R },
          { src: 'galaxy', beta: TL.GALAXY.beta, w: TL.GALAXY.omega, theta: F.DECL.t3.galTiltDeg * D2R }], k2q: LIT.marsK2q });
    } else { const r = base.find((x) => x.id === id); out.push(Object.assign({}, r, { k2q: F.LIT.k2q[id] })); }
  }
  return out;
}
/** 天体の特性の係数 C_b の読み(第341便b の t3Bodies —— 釣り合いの読み bal・速さの一致の読み spd。値の無い天体は null) */
export function cbOf(id, reading, ctx) {
  if (reading === 'one') return 1;
  if (!DECL.cbReadings.includes(reading)) throw new RangeError('cbOf: 読みは ' + DECL.cbReadings.join('・'));
  const r = (ctx ? ctx.cbT : B341.t3Bodies()).find((q) => q.key === id.toLowerCase());
  if (!r) return null; const v = r[reading]; return fin(v) && v > 0 ? v : null;
}
/** 結びつきの係数の選び(第341便f の t3Tables の kTilt を呼ぶ)と帯 */
export function kAndBand() { const T = F.t3Tables(); return { band: T.band, kLo: T.kTilt.kLo, kHi: T.kTilt.kHi, atLo: T.kTilt.atLo }; }
/** 1 回の走行で使う共通の値(第341便f の帯と結びつきの係数・第341便b の係数の表 —— 走行ごとに作り直す) */
export const makeCtx = () => ({ KB: kAndBand(), cbT: B341.t3Bodies(), FL: F.bodyRows().map(F.ledgerRow) });
const kOf = (pick, KB) => (pick === 'one' ? 1 : pick === 'kLo' ? KB.kLo : pick === 'kHi' ? KB.kHi : (() => { throw new RangeError('kOf'); })());
const rulerOf = (id) => (F.LIT.heat[id] === undefined ? null : F.LIT.heat[id]);
const hostL = (row) => {   // 源の自転の角運動量(主星 —— 惑星は太陽・衛星は主星)と軌道の角運動量
  const sunI = val('Sun', 'C') * val('Sun', 'M') * val('Sun', 'R') ** 2, sunW = 2 * Math.PI / val('Sun', 'spin');
  let Ls;
  if (row.host === 'Sun') Ls = sunI * sunW;
  else if (row.host === 'Jupiter') Ls = val('Jupiter', 'C') * val('Jupiter', 'M') * val('Jupiter', 'R') ** 2 * 2 * Math.PI / val('Jupiter', 'spin');
  else if (row.host === 'Pluto') Ls = val('Pluto', 'C') * val('Pluto', 'M') * val('Pluto', 'R') ** 2 * 2 * Math.PI / val('Pluto', 'spin');
  else if (row.host === 'Charon') Ls = val('Charon', 'C') * val('Charon', 'M') * val('Charon', 'R') ** 2 * 2 * Math.PI / val('Charon', 'porb');   // カロンは同期(自転の周期 = 公転の周期)
  else Ls = null;
  return { Lsrc: Ls, Lorb: row.M * Math.sqrt(G * row.Mp * row.a) };
};

/* ───────── 1 行の帳簿 ───────── */
/** 源ごとのトルク(s = Γ₀ × k_tilt × C_b)。Npar = 軸引きずりの軸に平行の分(符号つき —— 供給の側・比べる列) */
export function torques(row, law, s) {
  const c = Math.abs(1 - DECL.alpha);
  return row.tilt.map((q) => { const a = s * row.I * q.beta * c * Math.abs(q.w); return { src: q.src, a, N: a * lawFactor(law, q.theta), Npar: a * Math.cos(q.theta) }; });
}
/**
 * 帳簿: { law, s, mu, split, knob } → エネルギー(保つ仕事率・動いた分・熱・増し分・残り)と角運動量(要る τ∥・向ける力の自転の向きの成分 0・残り・出どころの列の時間)
 */
export function ledger(row, { law, s, mu, split, knob }) {
  if (!(fin(s) && s >= 0 && fin(mu) && mu >= 0 && mu <= 1)) throw new RangeError('ledger: s ≥ 0・0 ≤ μ ≤ 1');
  const tq = torques(row, law, s), w = Math.abs(row.omega), Nsq = tq.reduce((t, q) => t + q.N * q.N, 0), Nperp = Math.sqrt(Nsq);
  const Ph = Nsq / (row.I * w), prec = mu * Ph, Pun = (1 - mu) * Ph, Op = Nperp / (row.I * w);
  const E = etaOf(split, knob, { omega: row.omega, Op }), eta = E.eta, sp = splitUnmoved(Pun, E);
  const tide = F.tideHeat(row, row.k2q).heat, residE = Ph - prec - sp.heat - sp.spin;
  const tauPar = sp.spin / w, LB = hostL(row), Npar = tq.reduce((t, q) => t + q.Npar, 0);
  return { id: row.id, eta, Ph, prec, Pun, heat: sp.heat, spin: sp.spin, residE, residERel: Ph > 0 ? Math.abs(residE) / Ph : 0, tide, heatTotal: tide + sp.heat,
    Op, precPeriodYr: Op > 0 ? 2 * Math.PI / Op / YR : null, spinRateYr: sp.spin / (row.I * w * w) * YR,
    tauPar, orientPar: 0, residL: tauPar - 0, Npar, tauOverNpar: Npar !== 0 ? tauPar / Math.abs(Npar) : null,
    tSrcYr: tauPar > 0 && LB.Lsrc ? LB.Lsrc / tauPar / YR : null, tOrbYr: tauPar > 0 ? LB.Lorb / tauPar / YR : null, tSelfYr: tauPar > 0 ? row.I * w / tauPar / YR : null };
}

/* ───────── 純関数の場面(零試験)───────── */
export function pureScenes(ctx = makeCtx()) {
  const rows = bodyRows(), KB = ctx.KB, G0 = KB.band.hi, FL = ctx.FL;
  // ① 駆動 0: 全部 0
  const z1 = rows.map((r) => ledger(r, { law: 'sin', s: 0, mu: 0, split: 'const', knob: 0.5 }));
  // ② 理想のジャイロ(μ = 1 —— 全部動いた分): 熱 0・増し分 0(どの分け方でも)・トルク・角速度 = 0(歳差の向きの軸のまわり)
  const z2 = []; for (const r of rows) for (const sp of Object.keys(DECL.splits)) for (const kn of DECL.splits[sp]) { const q = ledger(r, { law: 'sin', s: G0, mu: 1, split: sp, knob: kn }); z2.push(q.heat === 0 && q.spin === 0); }
  const sh = spinUnit('Jupiter'), At = spinUnit('Sun'), L = 2.5, Wspin = 1.7, N = crs(sh, At), Op = nrm(N) / (L * Wspin) / Math.sin(angleOf(sh, At)), Om = add(scl(sh, Wspin), scl(At, Op));
  const pw = dot(N, Om), pwScale = nrm(N) * nrm(Om);
  // ③ η = 0 で第341便f と同じ(源ごとに足す保つ仕事率 × (1 − μ) × Γ₀²・結びつきの係数の試しの熱)
  const same = [];
  for (const r of rows.filter((x) => x.id !== 'Mars')) { const f = FL.find((x) => x.id === r.id);
    for (const mu of DECL.mu) { const q = ledger(r, { law: 'sin', s: G0, mu, split: 'const', knob: 0 }), want = (1 - mu) * G0 * G0 * f.uHold; same.push(Math.abs(q.heat - want) / want); }
    const k = ledger(r, { law: 'sin', s: G0 * KB.kLo, mu: 0, split: 'const', knob: 0 }), fk = KB.atLo.find((x) => x.id === r.id); same.push(Math.abs(k.heatTotal - fk.heat) / fk.heat); }
  // ④ 恒等式の残り(帳簿の全部の組)
  let resid = 0; for (const r of rows) for (const law of DECL.laws) for (const mu of DECL.mu) for (const sp of Object.keys(DECL.splits)) for (const kn of DECL.splits[sp]) resid = Math.max(resid, ledger(r, { law, s: G0 * KB.kLo, mu, split: sp, knob: kn }).residERel);
  // ⑤ sin の型の 2 つの軸の合成(Σ a_j ŝ × t̂_j = ŝ × A)
  const g = galUnit(), a1 = 3.2, a2 = 0.7, lhs = add(scl(crs(sh, scl(At, -1)), a1), scl(crs(sh, scl(g, -1)), a2)), rhs = crs(sh, add(scl(At, -a1), scl(g, -a2)));
  const comb = nrm(add(lhs, scl(rhs, -1))) / nrm(rhs);
  // ⑥ 入力の拒否
  const rej = [() => etaOf('const', 1.5), () => etaOf('other', 0.1), () => splitUnmoved(-1, { eta: 0.5, comp: 0.5 }), () => lawFactor('other', 1), () => ledger(rows[0], { law: 'sin', s: -1, mu: 0, split: 'const', knob: 0 }),
    () => etaOf('ratio', 1, { omega: 0, Op: 1 }), () => cbOf('Venus', 'other', ctx)].map((f) => { try { f(); return false; } catch (e) { return e instanceof RangeError; } });
  // ⑦ 分け方の端: η = 1 で熱 0・η = 0 で増し分 0・ratio の型の g = 0 に当たる極限(r → 0)は η → 0・lag の δ = π/2 で η = 1
  const ends = { e1: splitUnmoved(2, etaOf('const', 1)).heat, e0: splitUnmoved(2, etaOf('const', 0)).spin, r0: etaOf('ratio', 0, { omega: 1, Op: 3 }).eta, lagHalfPi: etaOf('lag', Math.PI / 2).eta };
  return {
    z1: { allZero: z1.every((q) => q.heat === 0 && q.spin === 0 && q.prec === 0 && q.tauPar === 0 && q.Ph === 0) },
    z2: { n: z2.length, allZero: z2.every(Boolean), powerRel: Math.abs(pw) / pwScale },
    z3: { n: same.length, worst: Math.max(...same) },
    z4: { worstResidRel: resid },
    z5: { combRel: comb },
    rejects: rej, ends,
  };
}
export function pureGates(S) {
  return {
    driveZero: S.z1.allZero === true,
    idealGyro: S.z2.allZero === true && S.z2.n === DECL.bodies.length * 13 && S.z2.powerRel < 1e-12,
    sameAs341f: S.z3.n === 6 * (DECL.mu.length + 1) && S.z3.worst < 1e-12,
    energyIdentity: S.z4.worstResidRel < 1e-12,
    sinCombine: S.z5.combRel < 1e-12,
    rejects: S.rejects.length === 7 && S.rejects.every(Boolean),
    ends: S.ends.e1 === 0 && S.ends.e0 === 0 && S.ends.r0 === 0 && Math.abs(S.ends.lagHalfPi - 1) < 1e-15,
  };
}

/* ───────── T1 出口 2 つ(基準の組 × 分け方の型とノブ)───────── */
export function t1Table(ctx = makeCtx()) {
  const rows = bodyRows(), KB = ctx.KB, R = DECL.ref, s = KB.band.hi * kOf(R.k, KB);
  const out = [];
  for (const r of rows) for (const sp of Object.keys(DECL.splits)) for (const kn of DECL.splits[sp]) {
    const q = ledger(r, { law: R.law, s, mu: R.mu, split: sp, knob: kn }), ru = rulerOf(r.id);
    out.push({ id: r.id, split: sp, knob: kn, eta: q.eta, heat: q.heatTotal, heatOverRuler: ru ? q.heatTotal / ru : null, spinW: q.spin, spinRateYr: q.spinRateYr, overAge: q.spinRateYr * DECL.ageYr,
      tauPar: q.tauPar, residL: q.residL, residERel: q.residERel });
  }
  return out;
}
/* ───────── T2 向ける力の則 × C_b の読み × 結びつきの係数(μ 0・η 0 —— 熱の上限の列)───────── */
export function t2Table(ctx = makeCtx()) {
  const rows = bodyRows(), KB = ctx.KB, out = [];
  for (const law of DECL.laws) for (const cb of DECL.cbReadings) for (const kp of DECL.kPicks) {
    const per = {};
    for (const id of [DECL.judge, DECL.cmp, DECL.io]) { const r = rows.find((x) => x.id === id), c = cbOf(id, cb, ctx);
      if (c === null) { per[id] = null; continue; }
      const q = ledger(r, { law, s: KB.band.hi * kOf(kp, KB) * c, mu: 0, split: 'const', knob: 0 }), ru = rulerOf(id);
      per[id] = { cb: c, heat: q.heatTotal, overRuler: ru ? q.heatTotal / ru : null, precPeriodYr: q.precPeriodYr }; }
    out.push({ law, cb, k: kp, per });
  }
  return out;
}
/* ───────── T3 天体の表(基準の組 —— 自転の増加の量は η = 1 の値〔η 倍で読む〕)───────── */
export function t3Table(ctx = makeCtx()) {
  const rows = bodyRows(), KB = ctx.KB, R = DECL.ref, s = KB.band.hi * kOf(R.k, KB);
  return rows.map((r) => { const q1 = ledger(r, { law: R.law, s, mu: R.mu, split: 'const', knob: 1 }), q0 = ledger(r, { law: R.law, s, mu: R.mu, split: 'const', knob: 0 }), ru = rulerOf(r.id);
    const etaR = DECL.splits.ratio.map((g) => etaOf('ratio', g, { omega: r.omega, Op: q1.Op }).eta);
    return { id: r.id, host: r.host, omega: r.omega, tide: q0.tide, Pun: q0.Pun, heatMax: q0.heatTotal, ruler: ru, heatMaxOverRuler: ru ? q0.heatTotal / ru : null, precPeriodYr: q1.precPeriodYr,
      etaRatio: etaR, spinRateYrMax: q1.spinRateYr, overAgeMax: q1.spinRateYr * DECL.ageYr, tauParMax: q1.tauPar, residLMax: q1.residL, tauOverNpar: q1.tauOverNpar,
      tSrcYr: q1.tSrcYr, tOrbYr: q1.tOrbYr, tSelfYr: q1.tSelfYr };
  });
}

/* ───────── 窓(イオの熱 ≤ 観測・木星の熱 ≥ 物差しの 0.1 倍・分類の帯)───────── */
/** 熱の係数 X = (Γ₀ k_tilt)² で天体の熱(潮汐 + 動かなかった分の熱 —— μ 0)。ratio の型は Ω_p が X で変わる */
function heatAtX(r, X, law, cb, split, knob) { return ledger(r, { law, s: Math.sqrt(X) * cb, mu: 0, split, knob }).heatTotal; }
/** heat(X) = 目標 の X(log の 2 分 —— 熱は X について増える)。目標が潮汐以下なら 0・届かなければ Infinity */
function solveX(r, target, law, cb, split, knob, D = DECL.bisect) {
  const tide = F.tideHeat(r, r.k2q).heat; if (target <= tide) return 0;
  let lo = D.lo, hi = D.hi; if (heatAtX(r, 10 ** hi, law, cb, split, knob) < target) return Infinity;
  for (let i = 0; i < D.iter; i++) { const m = 0.5 * (lo + hi); if (heatAtX(r, 10 ** m, law, cb, split, knob) < target) lo = m; else hi = m; }
  return 10 ** hi;
}
export function windowTable(ctx = makeCtx()) {
  const rows = bodyRows(), KB = ctx.KB, by = (id) => rows.find((x) => x.id === id), out = [];
  const io = by(DECL.io), ju = by(DECL.judge), ve = by(DECL.cmp), bandHi2 = KB.band.hi * KB.band.hi;
  for (const law of DECL.laws) for (const cbR of DECL.cbReadings) for (const sp of Object.keys(DECL.splits)) for (const kn of DECL.splits[sp]) {
    if (sp === 'const' && kn === 1) { out.push({ law, cb: cbR, split: sp, knob: kn, outside: 'η = 1 は熱 0(窓の外)' }); continue; }
    const cIo = cbOf('Io', cbR, ctx), cJu = cbOf('Jupiter', cbR, ctx), cVe = cbOf('Venus', cbR, ctx);
    if (cIo === null || cJu === null) { out.push({ law, cb: cbR, split: sp, knob: kn, outside: '係数の値が無い' }); continue; }
    const cap = solveX(io, F.LIT.heat.Io, law, cIo, sp, kn), need = solveX(ju, DECL.highFrac * F.LIT.heat.Jupiter, law, cJu, sp, kn);
    const ve0 = cVe === null || !fin(need) ? null : heatAtX(ve, need, law, cVe, sp, kn) / F.LIT.heat.Venus;
    out.push({ law, cb: cbR, split: sp, knob: kn, cap, need, needOverCap: fin(cap) && cap > 0 ? need / cap : null, needOverBand: need / bandHi2,
      openKfree: fin(need) && need <= cap, openK1: fin(need) && need <= Math.min(cap, bandHi2), venusAtNeedOverRuler: ve0 });
  }
  return out;
}

/* ───────── T4 向ける先の軸が複数(太陽・銀河)───────── */
export function t4Table(ctx = makeCtx()) {
  const rows = bodyRows(), KB = ctx.KB, s = KB.band.hi * KB.kLo, out = [];
  const sSun = spinUnit('Sun'), gR = galUnit();
  for (const id of DECL.t4Bodies) {
    const r = rows.find((x) => x.id === id), sh = spinUnit(id), w = Math.abs(r.omega), c = Math.abs(1 - DECL.alpha);
    const qSun = r.tilt.find((q) => q.src === 'Sun'), qGal = r.tilt.find((q) => q.src === 'galaxy');
    const aSun = s * r.I * qSun.beta * c * Math.abs(qSun.w), aGal = s * r.I * qGal.beta * c * Math.abs(qGal.w);
    for (const sg of DECL.targetSigns) for (const law of DECL.laws) {
      const sign = sg === 'rev' ? -1 : 1, tSun = scl(sSun, sign), tGal = scl(gR, sign);
      const term = (t, a, at) => { const x = crs(at, t), m = nrm(x), th = angleOf(at, t); return m > 0 ? scl(x, a * lawFactor(law, th) / m) : [0, 0, 0]; };
      const nSun = term(tSun, aSun, sh), nGal = term(tGal, aGal, sh), nBoth = add(nSun, nGal);
      const P = (n) => dot(n, n) / (r.I * w), ru = rulerOf(id);
      const cross = 2 * dot(nSun, nGal) / dot(nSun, nSun), share = dot(nGal, nGal) / dot(nSun, nSun);
      const Aeff = add(scl(tSun, aSun), scl(tGal, aGal));
      // 太陽の軸へ向け切った所(ŝ = t̂_sun)で残る銀河のトルク ÷ 今の太陽のトルク
      const nLeft = term(tGal, aGal, tSun);
      const rowOf = (set) => { const n = set === 'sun' ? nSun : set === 'galaxy' ? nGal : nBoth, Pn = P(n), Op = nrm(n) / (r.I * w);
        return { set, N: nrm(n), heatMax: Pn + F.tideHeat(r, r.k2q).heat, overRuler: ru ? (Pn + F.tideHeat(r, r.k2q).heat) / ru : null, precPeriodYr: Op > 0 ? 2 * Math.PI / Op / YR : null, power: 0 }; };
      out.push({ id, sign: sg, law, thetaSunDeg: angleOf(sh, tSun) / D2R, thetaGalDeg: angleOf(sh, tGal) / D2R, sunGalDeg: angleOf(sSun, gR) / D2R, aRatio: aGal / aSun,
        sets: DECL.targetSets.map(rowOf), crossOverSun: cross, galShare: share, bothOverSunMinus1: cross + share,
        aeffShiftDeg: law === 'sin' ? angleOf(tSun, Aeff) / D2R : null, leftOverSun: nrm(nLeft) / nrm(nSun) });
    }
  }
  return out;
}
