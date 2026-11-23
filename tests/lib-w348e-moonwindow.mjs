// 第348便e(原仮定者の回答(2026-11-21 —— 第145報)「AN902: 推奨で進める。現状も近似として比較可能にする」・推奨で進める項 AN954 → AN980「月の型の長い窓」・統括の検証項目 R413):
//   **月の型(太陽–地球–月の 3 体・実の比)の長い窓 —— (0)「現行の近似」・(α) 主の候補・(β) 比べる列の、月の近地点の率・交点の率・恒星月・離心率の代理を、
//   窓 18.6 年・37.2 年・93 年・186 年(交点の周期の 1・2・5・10 倍)と刻み 2 通り(半分)で並べる純関数 —— 診断だけ**
//   (器 tests/exp-w348e-moonwindow.mjs と QA behavior.moonwindow348e・docs.moonwindow348e が読む —— html を読まない・ファイルを読まない・状態を持たない)。
//   〔第347便b〕の lib(tests/lib-w347b-convbody.mjs)を import して呼ぶ(多体の右辺・(β) の初期の U・系・接触の要素・率の読み)。第341便e の lib の RK4 の 1 步を呼ぶ。どの lib の本文も変えない。
//   アプリの積分・重力の式・時計・内蔵の本(🌘・🌔 —— 本の宣言は読むだけ)・受理器は変えない。本を足さない。
//
// ■ 型・枠・記号は〔第347便b〕と同じ(lib-w347b-convbody.mjs の冒頭): (0) dv/dt = a(指数 2)/(α) dv/dt = q a(指数 1)/(β) dp/dt = q U・dU/dt = q a(指数 1)/(N) ニュートン(物差し)。
//   枠 abs(絶対)・clock(今の点の時計 —— 主の列〔推奨で進める項 AN954〕)・host(主星 —— 比べる列)。
// ■ 窓の取り方(宣言): **1 本の長い走り(186 年)の先頭からの窓**(読み A)—— 窓 W の率は、走りの始め(月は近地点・昇交点 0)から W 年の記録だけで〔第347便b〕と同じ読み
//   (差の時系列 Δy に [1, t, t (y_N′ − 平均)] を最小二乗で当てた t の係数 —— lib-w347b の rateOf をそのまま呼ぶ)。同じ刻みなら窓 6 年・12 年の行は〔第347便b〕の正本の行と同じ記録から作る。
//   **位相の平均(読み B)**: 186 年を長さ W の重ならない部分窓に切り(18.6 年は 10 本・37.2 年は 5 本・93 年は 2 本・186 年は 1 本)、部分窓ごとに
//   [1, τ, (y_N′ − 平均), τ (y_N′ − 平均)](τ は部分窓の中の時刻 —— 始まりの位相のずれの定数の漏れも当てる)の τ の係数を取り、その平均と散らばり(標本の標準偏差)を並べる。
//   年 = この系の地球の公転の周期(恒星年の型)。率は「月の 1 公転あたりの rad」で持ち、表で ″/年 に直す。
// ■ 幅(宣言): 刻みの幅 = 刻み 200/月 と 400/月 の差(同じ窓)/窓の動き = 同じ刻み(400/月)で一つ前の窓(6 → 12 → 18.6 → 37.2 → 93 → 186 年)との差/
//   位相の散らばり = 読み B の部分窓の標準偏差。差 ÷ 幅 の列の幅は max(刻みの幅, 窓の動き)。
// ■ 言わないこと: 月の近点回転を得たとする文・換算の形を選んだとする文・現行の近似の正誤の文は書かない(この窓・この刻み・この枠では、の表)。観測の数は固定の比べる列(合わせない)。
//   この器は診断の 3 体(点の質量・惑星なし・引きずりなし・地球の J₂ なし)で、本 🌘(地球と月の二体・太陽の方向を固定した近似・kFrame=1)・🌔(太陽を外した三次元の二体・地球の J₂)の設定そのものではない。
//   実の比の入力(太陽・地球・月の質量の比と要素)は〔第347便b〕の REAL(文献の値・未照合の比べる列の入力)。光速を候補の採否に使わない。
import * as B from './lib-w347b-convbody.mjs';
import { rk4Step } from './lib-w341e-lightmass.mjs';

export const LIB_VERSION = 'w348e-moonwindow-lib-1';
const fin = (x) => typeof x === 'number' && Number.isFinite(x);
const AS = 180 / Math.PI * 3600;

/** 固定の比べる列 —— リポジトリに既に在る候補の行の数だけ(文献の値・未照合 —— 一次資料の数の照合なし・sigma の欄は空)。合わせない */
export const OBS = Object.freeze({
  note: '固定の比べる列: paper/data/pn1-ephemeris-candidates.csv の候補の行の値の写し(文献の値・未照合 —— sigma の欄は空・primary の照合なし)。器はこの数へ何も合わせない',
  file: 'paper/data/pn1-ephemeris-candidates.csv',
  rows: Object.freeze([
    Object.freeze({ key: 'sidereal', name: '恒星月', value: 27.321661554, unit: '日', record: 'OBS-34f53c94', src: 'Chapront J. Chapront-Touze M. Francou G. 2002 A&A 387 700', sigma: null }),
    Object.freeze({ key: 'perigee', name: '月の近点回転の周期(恒星に対する)', value: 8.850391, unit: 'ユリウス年', record: 'OBS-b45eb3c8', src: 'Simon J.L. ほか 1994 A&A 282 663', sigma: null }),
    Object.freeze({ key: 'node', name: '月の交点の周期(恒星に対する)', value: 18.599525, unit: 'ユリウス年', record: 'OBS-56488774', src: 'Simon J.L. ほか 1994 A&A 282 663', sigma: null }),
  ]),
});

const VARIANTS = Object.freeze([{ kind: '0', frame: 'abs' }].concat(['alpha', 'beta'].flatMap((k) => B.DECL.frames.map((fr) => ({ kind: k, frame: fr })))).map((v) => Object.freeze(v)));
export const DECL = Object.freeze({
  system: 'real',
  nodeYears: 18.6,
  windows: Object.freeze([18.6, 37.2, 93, 186]),          // 交点の周期(18.6 年)の 1・2・5・10 倍
  matchWindows: Object.freeze([6, 12]),                    // 〔第347便b〕の窓(照合)
  allWindows: Object.freeze([6, 12, 18.6, 37.2, 93, 186]),
  runYears: 186,
  steps: Object.freeze([200, 400]),                        // 刻み(月の 1 公転あたりの步)—— 400 は半分の刻み
  variants: VARIANTS,
  mainFrame: 'clock',
  sample: B.DECL.sample,
  qty: Object.freeze(['dVarpi', 'dOm', 'dLon', 'dSyn', 'dVarpiE']),
  short: Object.freeze({ years: 6, steps: 200 }),          // QA で走らせ直す部分(〔第347便b〕の正本の実の比 λ = 1 の行と同じ窓と刻み)
  order: Object.freeze({ years: 2, steps: Object.freeze([50, 100, 200]) }),   // 刻みの次数を見る短い走り(ニュートンの率と型の差の率)
  knob: Object.freeze({ fpowZero: 0, fpowMut: 0.5, years: 18.6 }),   // (α) の因子 q のべき(1 = (α)・0 と n_G 2 = (0) —— 零試験)
  readA: '先頭からの窓 —— 差の時系列に [1, t, t (y_N′ − 平均)] を当てた t の係数(lib-w347b の rateOf)',
  readB: '186 年を長さ W の重ならない部分窓に切り、[1, τ, (y_N′ − 平均), τ (y_N′ − 平均)] の τ の係数の平均と標本の標準偏差',
  width: '差 ÷ 幅 の幅 = max(刻み 200/月 と 400/月 の差, 刻み 400/月 で一つ前の窓との差)',
});

/* ───────── 右辺(〔第347便b〕の makeDeriv を呼ぶ —— 因子のべきのノブだけ足す)───────── */
/** opt.fpow が無いか 1 なら lib-w347b の makeDeriv そのもの。それ以外は (α) の右辺の加速度に q^(fpow − 1) を掛ける(fpow = 0・n_G = 2 で (0) と同じ右辺 —— 零試験のノブ) */
export function makeDerivK(S, opt) {
  const f0 = B.makeDeriv(S, opt);
  if (opt.fpow === undefined || opt.fpow === 1) return f0;
  if (opt.kind !== 'alpha' || !fin(opt.fpow)) throw new Error('makeDerivK: 因子のべきのノブは (α) だけ・有限');
  const n = S.m.length;
  const g = (s) => { const out = f0(s), q = f0.info.q; for (let i = 0; i < n; i++) { const k = Math.pow(q[i], opt.fpow - 1); for (let c = 0; c < 3; c++) out[3 * n + 3 * i + c] *= k; } return out; };
  g.info = f0.info;
  return g;
}

const unwrapSeq = (a) => { const o = [a[0]]; for (let i = 1; i < a.length; i++) { let d = a[i] - a[i - 1]; d -= 2 * Math.PI * Math.round(d / (2 * Math.PI)); o.push(o[i - 1] + d); } return o; };
/** 太陽–地球–月の型を 1 本走らせる(lib-w347b の runSEM と同じ步と同じ記録 —— 離心率 e と步の番号 k を足しただけ。先頭の記録は runSEM の同じ刻みの走りと同じ数) */
export function runLong(S, opt, stepsPerMoon, years) {
  if (!(fin(years) && years > 0 && Number.isInteger(stepsPerMoon) && stepsPerMoon > 0)) throw new Error('runLong: 年と刻みは正');
  const f = makeDerivK(S, opt), W0 = B.initW(S, S.P, S.V, opt), h = S.Pmoon / stepsPerMoon, T = years * S.Pearth, nst = Math.round(T / h);
  let s = S.P.flat().concat(W0.flat());
  const ser = { t: [], k: [], varpi: [], Om: [], lon: [], syn: [], varpiE: [], e: [] }, muM = S.m[1] + S.m[2], muE = S.m[0] + S.m[1] + S.m[2];
  const rec = (k) => {
    f(s); const V = f.info.v, P = [0, 1, 2].map((i) => [s[3 * i], s[3 * i + 1], s[3 * i + 2]]);
    const pr = P[2].map((x, c) => x - P[1][c]), vr = V[2].map((x, c) => x - V[1][c]), o = B.oscul(pr, vr, muM);
    const pe = P[1].map((x, c) => x - P[0][c]), ve = V[1].map((x, c) => x - V[0][c]), oE = B.oscul(pe, ve, muE);
    ser.t.push(k * h); ser.k.push(k); ser.varpi.push(o.varpi); ser.Om.push(o.Om); ser.lon.push(o.lon); ser.syn.push(o.lon - Math.atan2(-pe[1], -pe[0])); ser.varpiE.push(oE.varpi); ser.e.push(o.e);
  };
  for (let k = 0; k <= nst; k++) { if (k % DECL.sample === 0) rec(k); if (k < nst) s = rk4Step(f, s, h); }
  for (const key of ['varpi', 'Om', 'lon', 'syn', 'varpiE']) ser[key] = unwrapSeq(ser[key]);
  ser.h = h; ser.nst = nst; ser.sampleStep = DECL.sample;
  return ser;
}
/** 記録を f 個おきに間引いた写し(刻み 400/月の走りを刻み 200/月の記録の時刻にそろえる —— 刻みの誤差と記録の間隔の差を分ける) */
export function subSer(ser, f) {
  if (!(Number.isInteger(f) && f >= 1)) throw new Error('subSer: f は正の整数');
  const o = { h: ser.h, nst: ser.nst, sampleStep: ser.sampleStep * f };
  for (const k of ['t', 'k', 'varpi', 'Om', 'lon', 'syn', 'varpiE', 'e']) o[k] = ser[k].filter((_, i) => i % f === 0);
  return o;
}
/** 窓 W 年の記録の数(runSEM の years = W の走りと同じ最後の步 —— round(W × 地球の周期 ÷ h)) */
export function countOf(S, ser, W) { const nW = Math.round(W * S.Pearth / ser.h); const c = Math.floor(nW / ser.sampleStep) + 1; if (c > ser.t.length) throw new Error('countOf: 窓が走りより長い ' + W); return c; }
const head = (a, c) => a.slice(0, c);

/** 読み B の率: [1, τ, (d − md), τ (d − md)] の τ の係数(d は y_N の中央の差分 —— lib-w347b の rateOf と同じ差分) */
export function rate4(t, dy, yN, { cols = 4 } = {}) {
  const n = t.length;
  const d = yN.map((y, i) => (i === 0 ? (yN[1] - yN[0]) / (t[1] - t[0]) : i === n - 1 ? (yN[n - 1] - yN[n - 2]) / (t[n - 1] - t[n - 2]) : (yN[i + 1] - yN[i - 1]) / (t[i + 1] - t[i - 1])));
  const md = d.reduce((a, b) => a + b, 0) / n, tm = (t[0] + t[n - 1]) / 2;
  const X = t.map((ti, i) => [1, ti - tm, d[i] - md, (ti - tm) * (d[i] - md)].slice(0, cols)), m = cols;
  const A = [...Array(m)].map(() => new Array(m).fill(0)), b = new Array(m).fill(0);
  for (let i = 0; i < n; i++) for (let r = 0; r < m; r++) { b[r] += X[i][r] * dy[i]; for (let c = 0; c < m; c++) A[r][c] += X[i][r] * X[i][c]; }
  for (let k = 0; k < m; k++) {
    let p = k; for (let r = k + 1; r < m; r++) if (Math.abs(A[r][k]) > Math.abs(A[p][k])) p = r;
    if (p !== k) { [A[p], A[k]] = [A[k], A[p]]; [b[p], b[k]] = [b[k], b[p]]; }
    for (let r = k + 1; r < m; r++) { const f = A[r][k] / A[k][k]; for (let c = k; c < m; c++) A[r][c] -= f * A[k][c]; b[r] -= f * b[k]; }
  }
  const x = new Array(m).fill(0); for (let k = m - 1; k >= 0; k--) { let s = b[k]; for (let c = k + 1; c < m; c++) s -= A[k][c] * x[c]; x[k] = s / A[k][k]; }
  return x[1];
}
const KEYQ = Object.freeze({ dVarpi: 'varpi', dOm: 'Om', dLon: 'lon', dSyn: 'syn', dVarpiE: 'varpiE' });
/** 読み A: 先頭 c 個の記録の率(lib-w347b の rateOf)× 月の周期(月の 1 公転あたりの rad)と、離心率の差の平均 */
function readA(serM, serN, c, Pm) {
  const t = head(serN.t, c), o = {};
  for (const q of DECL.qty) { const k = KEYQ[q], yN = head(serN[k], c); o[q] = B.rateOf(t, yN.map((y, i) => serM[k][i] - y), yN) * Pm; }
  let de = 0; for (let i = 0; i < c; i++) de += serM.e[i] - serN.e[i]; o.dE = de / c;
  return o;
}
/** 読み B: 部分窓の率の平均と標本の標準偏差(月の 1 公転あたりの rad)・離心率の差の部分窓の平均の散らばり */
function readB(S, serM, serN, W, Pm) {
  const nRun = Math.round(DECL.runYears * S.Pearth / serN.h), m = Math.floor(DECL.runYears / W + 1e-9), out = { n: m };
  const bounds = [...Array(m)].map((_, j) => [Math.round(j * W * S.Pearth / serN.h), Math.min(nRun, Math.round((j + 1) * W * S.Pearth / serN.h))]);
  for (const q of ['dVarpi', 'dOm', 'dLon', 'dE']) {
    const vals = bounds.map(([k0, k1]) => {
      const i0 = Math.ceil(k0 / DECL.sample), i1 = Math.floor(k1 / DECL.sample);
      if (q === 'dE') { let s = 0; for (let i = i0; i <= i1; i++) s += serM.e[i] - serN.e[i]; return s / (i1 - i0 + 1); }
      const key = KEYQ[q], t = serN.t.slice(i0, i1 + 1), yN = serN[key].slice(i0, i1 + 1), dy = yN.map((y, i) => serM[key][i0 + i] - y);
      return rate4(t, dy, yN) * Pm;
    });
    const mean = vals.reduce((a, b) => a + b, 0) / m, sd = m > 1 ? Math.sqrt(vals.reduce((a, v) => a + (v - mean) ** 2, 0) / (m - 1)) : null;
    out[q] = { mean, sd };
  }
  return out;
}

/* ───────── T1 長い窓 ───────── */
/** 刻み 1 つで: ニュートンの走り + 型 7 本(186 年)。窓ごとの読み A・読み B・ニュートンの率と離心率の平均 */
export function longCase(stepsPerMoon, { years = DECL.runYears, windows = DECL.allWindows, readBWindows = DECL.windows } = {}) {
  const S = B.semSystem(DECL.system), eps = B.epsReal(), Pm = S.Pmoon, f = stepsPerMoon / DECL.steps[0];
  const align = Number.isInteger(f) && f > 1 ? f : 0;   // 刻み 400/月: 記録を 2 個おきに間引いた読み(刻み 200/月と同じ記録の時刻)も持つ
  const serN = runLong(S, { kind: 'N', eps }, stepsPerMoon, years), serNa = align ? subSer(serN, align) : null;
  const cnt = windows.map((W) => countOf(S, serN, W)), cntA = align ? windows.map((W) => countOf(S, serNa, W)) : null;
  const newton = windows.map((W, wi) => { const c = cnt[wi], t = head(serN.t, c); return { W, varpi: B.slope(t, head(serN.varpi, c)) * Pm, Om: B.slope(t, head(serN.Om, c)) * Pm, lon: B.slope(t, head(serN.lon, c)) * Pm, eMean: head(serN.e, c).reduce((a, b) => a + b, 0) / c }; });
  const rows = DECL.variants.map((vv) => {
    const serM = runLong(S, Object.assign({ eps }, vv), stepsPerMoon, years), serMa = align ? subSer(serM, align) : null;
    const o = Object.assign({}, vv, { A: windows.map((W, wi) => Object.assign({ W }, readA(serM, serN, cnt[wi], Pm))), B: years >= DECL.runYears ? readBWindows.map((W) => Object.assign({ W }, readB(S, serM, serN, W, Pm))) : [] });
    if (align) o.Aal = windows.map((W, wi) => Object.assign({ W }, readA(serMa, serNa, cntA[wi], Pm)));
    return o;
  });
  return { stepsPerMoon, years, h: serN.h, nst: serN.nst, align, Pmoon: Pm, Pearth: S.Pearth, eps, windows: windows.slice(), newton, rows };
}

/* ───────── 短い部分(QA で走らせ直す —— 窓 6 年・刻み 200/月・〔第347便b〕の正本の行と同じ形)───────── */
export function shortPart() {
  const S = B.semSystem(DECL.system), eps = B.epsReal(), D = DECL.short, Pm = S.Pmoon;
  const serN = runLong(S, { kind: 'N', eps }, D.steps, D.years), c = countOf(S, serN, D.years);
  const rows = DECL.variants.map((vv) => { const serM = runLong(S, Object.assign({ eps }, vv), D.steps, D.years), a = readA(serM, serN, c, Pm); return { kind: vv.kind, frame: vv.frame, dVarpi: a.dVarpi, dOm: a.dOm, dLon: a.dLon, dSyn: a.dSyn, dVarpiE: a.dVarpiE, dE: a.dE }; });
  // 刻みの次数(短い走り): 刻み 3 つの走りを、いちばん粗い刻みの記録の時刻に間引いてそろえ(記録の間隔の差を除く)、ニュートンの近地点・交点の率と (0)・(α) 時計の枠の差の率を
  const O = DECL.order, ord = O.steps.map((st) => {
    const ff = st / O.steps[0], sN = subSer(runLong(S, { kind: 'N', eps }, st, O.years), ff), cc = countOf(S, sN, O.years), t = head(sN.t, cc);
    const s0 = subSer(runLong(S, { kind: '0', eps }, st, O.years), ff), sA = subSer(runLong(S, { kind: 'alpha', frame: 'clock', eps }, st, O.years), ff);
    const a0 = readA(s0, sN, cc, Pm), aA = readA(sA, sN, cc, Pm);
    return { steps: st, n: cc, nVarpi: B.slope(t, head(sN.varpi, cc)) * Pm, nOm: B.slope(t, head(sN.Om, cc)) * Pm, d0Varpi: a0.dVarpi, dAVarpi: aA.dVarpi, d0Om: a0.dOm, dAOm: aA.dOm };
  });
  const ratio = (k) => { const v = ord.map((r) => r[k]); const den = v[1] - v[2]; return den === 0 ? null : (v[0] - v[1]) / den; };
  return { rows, order: { rows: ord, ratioNVarpi: ratio('nVarpi'), ratioNOm: ratio('nOm'), ratio0Varpi: ratio('d0Varpi'), ratioAVarpi: ratio('dAVarpi') } };
}

/* ───────── 零試験のノブ: (α) の因子のべき 0・n_G 2 の走り(窓 18.6 年)———— (0) の行と比べる ───────── */
export function knobRun(fpow, nG, years = DECL.knob.years, steps = DECL.steps[0]) {
  const S = B.semSystem(DECL.system), eps = B.epsReal(), Pm = S.Pmoon;
  const serN = runLong(S, { kind: 'N', eps }, steps, years), c = countOf(S, serN, years);
  const serK = runLong(S, { kind: 'alpha', frame: 'abs', nG, fpow, eps }, steps, years), ser0 = runLong(S, { kind: '0', eps }, steps, years);
  const k = readA(serK, serN, c, Pm), z = readA(ser0, serN, c, Pm);
  const rel = Math.max(...['dVarpi', 'dOm', 'dLon'].map((q) => Math.abs(k[q] - z[q]) / Math.abs(z[q])));
  return { fpow, nG, years, steps, knob: k, zero: z, maxRel: rel };
}

/* ───────── 純関数の場面 ───────── */
/** ビットで同じを見る場面(±ulp の走り直しに入れない —— 器と QA がそのまま 1 回ずつ走らせる) */
export function exactScenes() {
  const S = B.semSystem(DECL.system), eps = B.epsReal(), s = S.P.flat().concat(S.V.flat());
  // ① ノブ fpow = 1 は (α) の右辺そのもの(同じ関数を返す —— 差の最大 0)
  const fa = B.makeDeriv(S, { kind: 'alpha', eps, frame: 'clock' })(s), fk1 = makeDerivK(S, { kind: 'alpha', eps, frame: 'clock', fpow: 1 })(s);
  const knob1 = Math.max(...fa.map((x, i) => Math.abs(x - fk1[i])));
  // ② 先頭の記録は lib-w347b の runSEM と同じ数(同じ刻み —— 1 年の走りと 2 年の走りの先頭)
  const a = B.runSEM(S, { kind: 'alpha', frame: 'clock', eps }, { stepsPerMoon: 50, years: 1 }), b = runLong(S, { kind: 'alpha', frame: 'clock', eps }, 50, 2), c = countOf(S, b, 1);
  const prefixSame = a.t.length === c && ['varpi', 'Om', 'lon', 'syn', 'varpiE'].every((k) => a[k].every((v, i) => v === b[k][i]));
  return { knob1, prefixSame, gates: { knob1: knob1 === 0, prefix: prefixSame === true } };
}
/** ±ulp の走り直しに入れてよい場面(許容つき) */
export function pureScenes() {
  const S = B.semSystem(DECL.system), eps = B.epsReal(), s = S.P.flat().concat(S.V.flat());
  // ① ノブ fpow = 0 と n_G = 2 は (0) の右辺(相対の差の最大 —— q a ÷ q の丸め)
  const f0 = B.makeDeriv(S, { kind: '0', eps })(s), fk0 = makeDerivK(S, { kind: 'alpha', eps, frame: 'abs', nG: 2, fpow: 0 })(s);
  const knob0 = Math.max(...f0.map((x, i) => Math.abs(x - fk0[i]) / (Math.abs(x) + 1e-300)));
  // ② 読み B の当てはめが合成の時系列の傾きを返す(y_N = 直線 + 正弦・Δy = 定数 + 傾き τ + 位相の漏れ 2 項)/3 列に落とすと返さない(変異)
  const t = [...Array(400)].map((_, i) => 10 + i * 0.05), yN = t.map((x) => 3 * x + 0.4 * Math.sin(1.7 * x)), nn = t.length;
  const dd = yN.map((y, i) => (i === 0 ? (yN[1] - yN[0]) / (t[1] - t[0]) : i === nn - 1 ? (yN[nn - 1] - yN[nn - 2]) / (t[nn - 1] - t[nn - 2]) : (yN[i + 1] - yN[i - 1]) / (t[i + 1] - t[i - 1])));
  const md = dd.reduce((x, y) => x + y, 0) / dd.length, tm = (t[0] + t[t.length - 1]) / 2;
  const dy = t.map((x, i) => 0.2 + 2e-3 * (x - tm) + 0.05 * (dd[i] - md) + 0.01 * (x - tm) * (dd[i] - md));
  const r4 = rate4(t, dy, yN), r3 = rate4(t, dy, yN, { cols: 3 });
  // ③ 拒否(窓が走りより長い・ノブを (α) 以外に・年が 0)
  const b = runLong(S, { kind: 'N', eps }, 50, 1);
  let rej = 0; try { countOf(S, b, 3); } catch (e) { rej++; } try { makeDerivK(S, { kind: '0', eps, fpow: 0 }); } catch (e) { rej++; } try { runLong(S, { kind: 'N', eps }, 50, 0); } catch (e) { rej++; }
  return { knob0, rate4Err: Math.abs(r4 - 2e-3), rate3Err: Math.abs(r3 - 2e-3), reject: { n: rej, of: 3 } };
}
export function pureGates(P) { return { knob0: P.knob0 < 1e-13, rate4: P.rate4Err < 1e-12, rate3Mut: P.rate3Err > 1e-6, reject: P.reject.n === P.reject.of }; }

/* ───────── 表の数(″/年・周期・差 ÷ 幅)———— 正本の long から作る(純関数)───────── */
/** 率(月の 1 公転あたりの rad)→ ″/年 */
export const toAsYr = (r, L0) => r * (L0.Pearth / L0.Pmoon) * AS;
/** 型 vv の、刻み st の窓 W の読み A の量 q */
export function aOf(long, st, vv, W, q) { const L0 = long.find((x) => x.stepsPerMoon === st), r = L0.rows.find((x) => x.kind === vv.kind && x.frame === vv.frame), wi = L0.windows.indexOf(W); return r.A[wi][q]; }
export function bOf(long, st, vv, W, q) { const L0 = long.find((x) => x.stepsPerMoon === st), r = L0.rows.find((x) => x.kind === vv.kind && x.frame === vv.frame); return r.B.find((x) => x.W === W)[q]; }
/** 窓ごとの量・幅・差 ÷ 幅(T1・T2・T4 の表の元)—— 量 q は 'dVarpi'・'dOm'・'dLon'・'dE'。差は型 − (0)(同じ刻み・同じ窓 —— ニュートンの走りは打ち消す) */
export function windowTable(long, q) {
  const [s1, s2] = DECL.steps, W6 = DECL.allWindows, z = DECL.variants[0];
  const rows = [];
  for (const vv of DECL.variants) for (let wi = 2; wi < W6.length; wi++) {
    const W = W6[wi], Wp = W6[wi - 1];
    const v2 = aOf(long, s2, vv, W, q), v1 = aOf(long, s1, vv, W, q), vp = aOf(long, s2, vv, Wp, q);
    const o = { kind: vv.kind, frame: vv.frame, W, v: v2, stepW: Math.abs(v2 - v1), winMove: Math.abs(v2 - vp), winMoveRel: v2 !== 0 ? Math.abs(v2 - vp) / Math.abs(v2) : null };
    { const bb = bOf(long, s2, vv, W, q); o.bMean = bb.mean; o.bSd = bb.sd; }
    if (vv.kind !== '0') {
      const d2 = v2 - aOf(long, s2, z, W, q), d1 = v1 - aOf(long, s1, z, W, q), dp = vp - aOf(long, s2, z, Wp, q);
      const bd = bOf(long, s2, vv, W, q).mean - bOf(long, s2, z, W, q).mean;
      o.diff = d2; o.diffStepW = Math.abs(d2 - d1); o.diffWinMove = Math.abs(d2 - dp); o.diffWidth = Math.max(o.diffStepW, o.diffWinMove);
      o.diffOverWidth = o.diffWidth > 0 ? Math.abs(d2) / o.diffWidth : null; o.diffRel0 = v2 !== 0 ? Math.abs(d2) / Math.abs(aOf(long, s2, z, W, q)) : null; o.diffB = bd;
    }
    rows.push(o);
  }
  return rows;
}
/** 「窓で約 30% 動く」(〔第347便b〕の 6 年 → 12 年)の続き: 列ごとに、窓を一つ前から延ばしたときの動き ÷ 値(刻み 400/月) */
export function shrinkTable(long, q) {
  const s2 = DECL.steps[1], W6 = DECL.allWindows, s1 = DECL.steps[0];
  return DECL.variants.map((vv) => ({ kind: vv.kind, frame: vv.frame,
    moves: W6.slice(1).map((W, i) => { const a = aOf(long, s2, vv, W, q), b = aOf(long, s2, vv, W6[i], q); return { from: W6[i], to: W, rel: a !== 0 ? Math.abs(a - b) / Math.abs(a) : null }; }),
    move612h200: (() => { const a = aOf(long, s1, vv, 12, q), b = aOf(long, s1, vv, 6, q); return a !== 0 ? Math.abs(a - b) / Math.abs(a) : null; })() }));
}
/** 月の本の表(T3): 窓 186 年・刻み 400/月の値から周期(日・ユリウス年)を作り、固定の比べる列と並べる。(α)・(β) は今の点の時計の枠(主の列 —— 推奨で進める項 AN954)と絶対の枠 */
export function bookTable(long) {
  const st = DECL.steps[1], W = DECL.runYears, L0 = long.find((x) => x.stepsPerMoon === st), wi = L0.windows.indexOf(W), N = L0.newton[wi];
  const tu = Math.sqrt(B.REAL.AU ** 3 / B.REAL.GMsun), dayOf = (orbits) => orbits * L0.Pmoon * tu / 86400, julYr = (orbits) => dayOf(orbits) / 365.25;
  const cols = [{ col: 'N' }].concat([{ kind: '0', frame: 'abs' }, { kind: 'alpha', frame: 'clock' }, { kind: 'beta', frame: 'clock' }, { kind: 'alpha', frame: 'abs' }, { kind: 'beta', frame: 'abs' }].map((v) => Object.assign({ col: v.kind + ':' + v.frame }, v)));
  const val = (c, key) => { if (c.col === 'N') return 0; const r = L0.rows.find((x) => x.kind === c.kind && x.frame === c.frame); return r.A[wi][key]; };
  const out = cols.map((c) => {
    const dl = val(c, 'dLon'), dv = val(c, 'dVarpi'), dom = val(c, 'dOm');
    const sid = dayOf(2 * Math.PI / (N.lon + dl)), per = julYr(2 * Math.PI / (N.varpi + dv)), nod = julYr(2 * Math.PI / Math.abs(N.Om + dom));
    return Object.assign({}, c, { siderealDays: sid, perigeeYr: per, nodeYr: nod, eMean: N.eMean + val(c, 'dE') });
  });
  const base = out[0], zero = out[1];
  for (const r of out) {
    r.dSidS = (r.siderealDays - base.siderealDays) * 86400; r.dPerS = (r.perigeeYr - base.perigeeYr) * 365.25 * 86400; r.dNodS = (r.nodeYr - base.nodeYr) * 365.25 * 86400;
    r.vs0SidS = (r.siderealDays - zero.siderealDays) * 86400; r.vs0PerS = (r.perigeeYr - zero.perigeeYr) * 365.25 * 86400; r.vs0NodS = (r.nodeYr - zero.nodeYr) * 365.25 * 86400;
    r.obsSid = r.siderealDays - OBS.rows[0].value; r.obsPer = r.perigeeYr - OBS.rows[1].value; r.obsNod = r.nodeYr - OBS.rows[2].value;
  }
  return { window: W, steps: st, cols: out, tuS: tu };
}
/** T4: 枠の依り方 —— (α)・(β) の枠ごとの、型 − (0) の差と、絶対の枠との差(窓ごと・刻み 400/月)と幅 */
export function frameTable(long, q) {
  const s2 = DECL.steps[1], s1 = DECL.steps[0], z = DECL.variants[0], out = [];
  for (const k of ['alpha', 'beta']) for (const fr of ['clock', 'host']) for (const W of DECL.windows) {
    const g = (st, w, f) => aOf(long, st, { kind: k, frame: f }, w, q) - aOf(long, st, z, w, q);
    const d = g(s2, W, fr) - g(s2, W, 'abs'), d1 = g(s1, W, fr) - g(s1, W, 'abs'), Wp = DECL.allWindows[DECL.allWindows.indexOf(W) - 1], dp = g(s2, Wp, fr) - g(s2, Wp, 'abs');
    const width = Math.max(Math.abs(d - d1), Math.abs(d - dp));
    out.push({ kind: k, frame: fr, W, diffFrame: g(s2, W, fr), diffAbs: g(s2, W, 'abs'), frameMinusAbs: d, width, overWidth: width > 0 ? Math.abs(d) / width : null });
  }
  return out;
}

/* ───────── 照合(〔第347便b〕の正本の実の比の行)───────── */
/** 正本の T1 の実の比の行(λ = 1)と、こちらの同じ刻み・同じ窓の行の、量ごとの相対の差の最大(tol は許容の関数 —— 既定は相対 1e-9) */
export function crossRows(mine, ref, tol = (a, b) => 1e-9 * Math.max(Math.abs(a), Math.abs(b))) {
  let worst = 0, nBad = 0;
  for (const r of ref.rows) {
    const m = mine.find((x) => x.kind === r.kind && x.frame === r.frame);
    for (const q of DECL.qty) { const a = m[q], b = r[q], d = Math.abs(a - b); worst = Math.max(worst, d / Math.max(Math.abs(b), 1e-300)); if (!(d <= tol(a, b, r, q))) nBad++; }
  }
  return { worst, nBad, n: ref.rows.length * DECL.qty.length };
}
/** 長い走りの刻み st・窓 W の読み A の行を、正本の行と同じ形に */
export function rowsAt(long, st, W) { const L0 = long.find((x) => x.stepsPerMoon === st), wi = L0.windows.indexOf(W); return L0.rows.map((r) => Object.assign({ kind: r.kind, frame: r.frame }, ...DECL.qty.map((q) => ({ [q]: r.A[wi][q] })))); }

/* ───────── 変異(落ちることを見る)───────── */
/** 変異 m2: 窓の記録を 1 個ずらす(先頭からの記録の数 + 1)と〔第347便b〕の正本の行と合わない —— 窓 6 年・刻み 200/月・(0) の行だけ走らせる。戻り値は (0) の行の量ごとの相対の差の最大 */
export function prefixMutant(refRow, shift = 1) {
  const S = B.semSystem(DECL.system), eps = B.epsReal(), D = DECL.short, Pm = S.Pmoon;
  const serN = runLong(S, { kind: 'N', eps }, D.steps, D.years + 1), ser0 = runLong(S, { kind: '0', eps }, D.steps, D.years + 1), c = countOf(S, serN, D.years) + shift;
  const a = readA(ser0, serN, c, Pm);
  return Math.max(...DECL.qty.map((q) => Math.abs(a[q] - refRow[q]) / Math.abs(refRow[q])));
}
/** 変異 m4: 刻み 3 つの走りを間引かずに(記録の間隔が刻みで違うまま)読んだニュートンの近地点の率の比 */
export function unalignedOrderRatio() {
  const S = B.semSystem(DECL.system), eps = B.epsReal(), O = DECL.order, Pm = S.Pmoon;
  const v = O.steps.map((st) => { const sN = runLong(S, { kind: 'N', eps }, st, O.years), c = countOf(S, sN, O.years); return B.slope(head(sN.t, c), head(sN.varpi, c)) * Pm; });
  return (v[0] - v[1]) / (v[1] - v[2]);
}
