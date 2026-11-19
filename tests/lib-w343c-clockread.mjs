// 第343便c(原仮定者の回答(2026-11-19 —— 第142報の回答 2)AN840・原仮定者の補足(2026-11-19 —— 第142報の回答 2 の補足)・原仮定者の回答(2026-11-19 —— 第143報)AN853「Bに変更する」・
//   統括の検証項目 R380): **時計の因子の引数の 2 つの読み(主の列 B = 当事者時間で測った速さ y・比べる列 A = 絶対時間で見た速さ x)・光の経路 = 質量 0 で無限速度の慣性移動の場合・
//   ミューオンの寿命(文献の値・未照合)との並び・〔第342便b〕の連鎖律の文の訂正の表を並べる純関数 —— 診断だけ**
//   (器 tests/exp-w343c-clockread.mjs と QA behavior.clockread343c・docs.clockread343c が読む —— html を読まない・ファイルを読まない・状態を持たない)。
//   エンジン・時計の式・運動の式・光線・内蔵の本・受理器は変えない(読むだけ)。第342便b の lib(時計の型 gOf・曲がりの器 deflectionG・到達の時間 tClosed)と第341便e の lib(光の曲がり・求積)は呼ぶだけ。
//
// ■ 記号(無次元・基準光速 c₀ = 1): 絶対時間 t・静止した局所の時計の進み N = e^(−ψ)・場に対する相対の速さ w(絶対時間で見る —— 回答 2 AN839)・局所光速 c_loc = c₀ e^(−2ψ)。
//   x = w ÷ c_loc(絶対時間で見た速さ)・g = 速さによる時計の因子(当事者時間の進み dτ/dt = N g)・y = w ÷(c_loc × g)= x ÷ g(当事者時間で測った速さ)。
// ■ 2 つの読み(どちらを採るかを本 lib は決めない)
//   主の列 B(AN853 = B): 形 G を y の関数として与える —— g = G(y)・x = y G(y)。「無限速度で当事者時間が止まる」は y → ∞ で g → 0。
//   比べる列 A(第342便b の表): 形 G を x の関数として与える —— g = G(x)。「無限速度」は x → ∞。
//   形の族 G_k(s) = (1 + s²/(2k))^(−k)(k = ½ は 1/√(1 + s²)・k = 1 は 1/(1 + s²/2)・k → ∞ は exp(−s²/2) —— 第342便b の U1・U2・U3)。k はノブ。
// ■ 言わないこと: 形は候補(時計の則ではない)・どの読みとどの形を採るかを決めない・文献の値は未照合(採用・棄却を言い切らない)・アプリの時計と光線には何も入れない。
import * as B342 from './lib-w342b-clockstop.mjs';
import * as L from './lib-w341e-lightmass.mjs';

export const LIB_VERSION = 'w343c-clockread-lib-2';   // 第344便c: lib-1 → lib-2(atX1 の定義域の検査だけ —— 表の数は同じ)
const fin = (x) => typeof x === 'number' && Number.isFinite(x);

export const DECL = Object.freeze({
  /** 形の族の指数 k(Infinity は exp の形 —— 正本には 'inf' と書く)。0.25 は k ≤ ½ の境目の向こうの参考の列 */
  kGrid: Object.freeze([0.25, 0.5, 1, 2, 'inf']),
  /** T1: x(y) を読む y・g を絶対時間の速さで書き直して読む x */
  yGrid: Object.freeze([0.5, 1, 2, 4, 8, 16]),
  xRead: Object.freeze([0.1, 0.3, 0.5]),
  /** T1: 恒等式(k = ½ の B の読み = √(1 − x²))を読む y */
  yIdent: Object.freeze([0, 0.1, 0.5, 1, 2, 4, 8, 16, 29.31, 100]),
  /** T2: シュバルツシルト半径の重力の時計 —— 軟化 ε ÷ r_s と背景の ψ₀ = X_k D₀(ノブの例) */
  epsOverRs: Object.freeze([0, 0.1, 0.5]),
  psi0: Object.freeze([0, 0.05]),
  /** T3: 曲がりの有限の列(y または x)・駆動のべき(0 = 今のアプリの力学〔時計の因子を加速に掛けない〕・1・2 —— 第342便b)・数値の走りの衝突径数 ÷ μ */
  sGrid: Object.freeze([1, 2, 4, 8]),
  nGrid: Object.freeze([0, 1, 2]),
  bNum: 1e5,
  /** T4: ミューオン(文献の値・未照合) */
  muon: Object.freeze({ gamma: 29.33, tau0us: 2.1969803, tauObsUs: 64.419, tauObsSigUs: 0.058,
    srcRest: '正のミューオンの静止の寿命 2.1969803 µs —— MuLan の測定(Phys. Rev. D 87, 052003, 2013)・素粒子の表(PDG)の値(文献の値・未照合 —— この環境では一次資料と照合していない)',
    srcRing: 'CERN のミューオンの蓄積リングの正のミューオンの寿命 64.419 ± 0.058 µs・報告の γ = 29.33(Bailey ほか、Nature 268, 301, 1977)(文献の値・未照合 —— この環境では一次資料と照合していない)' }),
  muonAssume: Object.freeze(['崩壊の数は当事者時間に従う(寿命 = 静止の寿命 ÷ g)', '場の枠 = 実験室(蓄積リングの場に対する速さ = 実験室の速さ)', '静止の時計 N は同じ場所で相殺する(実験室の時計と粒子の時計の比は g だけ)',
    '報告の γ を x = √(1 − γ^−2) と読む(γ は運動量と質量から出した値 —— その読み自体が局所光速で止まる型の関係を使っている)']),
  /** T5: 連鎖律の項を足した読みの表を読む x・到達の時間を読む x・求積の刻み */
  xChain: Object.freeze([0.1, 0.5, 0.9, 0.99]),
  xReach: Object.freeze([0.5, 0.9, 0.99]),
  nQuad: 40000,
});

/* ───────── 形の族 ───────── */
const kVal = (k) => (k === 'inf' ? Infinity : k);
/** G_k(s)(s ≥ 0) */
export function formG(k, s) {
  if (!(fin(s) && s >= 0)) throw new Error('formG: s は有限で非負 ' + s);
  const K = kVal(k);
  if (K === Infinity) return Math.exp(-s * s / 2);
  if (!(fin(K) && K > 0)) throw new Error('formG: k は正 ' + k);
  if (K === 0.5) return 1 / Math.sqrt(1 + s * s);
  if (K === 1) return 1 / (1 + s * s / 2);
  return Math.pow(1 + s * s / (2 * K), -K);
}
/** d ln G / ds = −s ÷ (1 + s²/(2k))(k → ∞ は −s) */
export const dlnG = (k, s) => { const K = kVal(k); return K === Infinity ? -s : -s / (1 + s * s / (2 * K)); };
/** 第342便b の型の名前(k = ½・1・∞ は U1・U2・U3 —— 値は第342便b の gOf と同じ) */
export const typeOfK = (k) => ({ 0.5: 'U1', 1: 'U2', inf: 'U3' })[String(k)] || null;

/* ───────── T1 B の読み(主の列)───────── */
/** B の読みの絶対時間の速さ x(y) = y G(y) */
export const xOfY = (k, y) => y * formG(k, y);
/** x(y) の最大(k > ½ —— y*² = 2k/(2k − 1)・k → ∞ は y* = 1)。k ≤ ½ は単調(最大なし) */
export function xMax(k) {
  const K = kVal(k);
  if (K !== Infinity && K <= 0.5) return null;
  const ys = K === Infinity ? 1 : Math.sqrt(2 * K / (2 * K - 1));
  return { yStar: ys, xMax: xOfY(k, ys) };
}
/** y → ∞ の x(解析): k < ½ は ∞('inf')・k = ½ は 1・k > ½ は 0 */
export const xLimit = (k) => { const K = kVal(k); return K < 0.5 ? 'inf' : K === 0.5 ? 1 : 0; };
/** 絶対時間の速さ x の時計 g(B の読みを書き直す)。単調なら 1 価・k > ½ は下の枝(y ≤ y*)と上の枝(y > y*)の 2 つ。届かない x は null */
export function gOfXB(k, x) {
  if (!(fin(x) && x >= 0)) throw new Error('gOfXB: x は有限で非負 ' + x);
  const M = xMax(k), solve = (lo, hi, up) => { for (let i = 0; i < 200; i++) { const m = 0.5 * (lo + hi), v = xOfY(k, m); if ((v < x) === up) lo = m; else hi = m; } return 0.5 * (lo + hi); };
  if (M === null) {
    if (kVal(k) === 0.5) return { lower: x < 1 ? Math.sqrt(1 - x * x) : null, upper: null };   // 恒等式 1/√(1 + y²) = √(1 − x²)
    let hi = 1; while (xOfY(k, hi) < x) hi *= 2;
    const y = solve(0, hi, true); return { lower: formG(k, y), upper: null };
  }
  if (x > M.xMax) return { lower: null, upper: null };
  const yl = solve(0, M.yStar, true);
  let hi = M.yStar * 2; while (xOfY(k, hi) > x) hi *= 2;
  const yu = solve(M.yStar, hi, false);
  return { lower: formG(k, yl), upper: formG(k, yu) };
}
export function t1Rows() {
  const rows = DECL.kGrid.map((k) => {
    const M = xMax(k), lim = xLimit(k);
    const xs = DECL.xRead.map((x) => gOfXB(k, x));
    return { k, type342b: typeOfK(k), monotone: M === null, yStar: M ? M.yStar : null, xMax: M ? M.xMax : null, xLimit: lim, reachesOne: lim === 1 || lim === 'inf',
      xOfY: DECL.yGrid.map((y) => xOfY(k, y)), gAtY1: formG(k, 1), xAtY1: xOfY(k, 1),
      gLowerAtX: xs.map((g) => g.lower), gUpperAtX: xs.map((g) => g.upper),
      sameClockAsF: kVal(k) === 0.5 };
  });
  // 恒等式(零試験): k = ½ の B の読み 1/√(1 + y²) は x = y/√(1 + y²) の √(1 − x²)(局所光速で止まる型 F —— 第342便b の gOf('F', x))
  let idMax = 0; for (const y of DECL.yIdent) { const x = xOfY(0.5, y), a = formG(0.5, y), b = B342.gOf('F', x); idMax = Math.max(idMax, Math.abs(a - b)); }
  // 同じ時計になる型を探す(B の読みの g を、x の関数として F・U1・U2・U3 と比べる —— 下の枝の 3 点)
  const same = DECL.kGrid.map((k) => {
    const hit = ['F', 'U1', 'U2', 'U3'].filter((t) => DECL.xRead.every((x) => { const g = gOfXB(k, x).lower; const h = B342.gOf(t, x); return g !== null && h !== null && Math.abs(g - h) < 1e-12; }));
    return { k, sameAs: hit };
  });
  // 族の値が第342便b の gOf と同じ(k = ½・1・∞ の 3 つ)
  let famMax = 0; for (const k of [0.5, 1, 'inf']) for (const s of [0, 0.3, 1, 3]) famMax = Math.max(famMax, Math.abs(formG(k, s) - B342.gOf(typeOfK(k), s)));
  return { rows, identityMax: idMax, same, famMax };
}

/* ───────── T2 シュバルツシルト半径の重力の時計との並び ───────── */
/** 静止の時計 e^(−ψ)・ψ = X_k (m/√(r² + ε²) + D₀) —— r = r_s = 2G₀m/c₀²(X_k = G₀/c₀²)で ψ = ½ ÷ √(1 + (ε/r_s)²) + ψ₀ */
export function rsClock(epsOverRs, psi0) {
  const psi = 0.5 / Math.sqrt(1 + epsOverRs * epsOverRs) + psi0;
  return { epsOverRs, psi0, psi, clock: Math.exp(-psi), overFar: Math.exp(-(psi - psi0)) };
}
export function t2Rows() {
  const rs = []; for (const e of DECL.epsOverRs) for (const p of DECL.psi0) rs.push(rsClock(e, p));
  const ref = Math.exp(-0.5);
  const forms = DECL.kGrid.map((k) => {
    const t = typeOfK(k);
    const lim = xLimit(k);
    // (a) y = 1 の値(B)/(b) x → 1 の値(B —— k = ½ は 0 に近づく・k > ½ は x = 1 に届かない・k < ½ は x = 1 を有限の y で通る)/A の読みの x = 1 の値
    let bAtX1 = null, bAtX1Note;
    if (kVal(k) === 0.5) { bAtX1 = 0; bAtX1Note = 'limit'; }
    else if (lim === 'inf') { bAtX1 = gOfXB(k, 1).lower; bAtX1Note = 'finite'; }
    else bAtX1Note = 'unreached';
    return { k, type342b: t, aAtY1: formG(k, 1), bAtX1, bAtX1Note, aReadAtX1: formG(k, 1), overRs: formG(k, 1) / ref, escapeSameForm: kVal(k) === Infinity };
  });
  // 「脱出の速さが w になる深さ」の重力の時計: v_esc² = 2 G₀ m/r = 2 ψ c₀²(軟化なし・背景なし)→ ψ = s²/2 → e^(−s²/2)(s は x〔A の読み〕か y〔B の読み〕)
  let escMax = 0; for (const s of [0.1, 0.5, 1, 2]) escMax = Math.max(escMax, Math.abs(Math.exp(-(s * s) / 2) - formG('inf', s)));
  return { rs, ref, forms, escapeIdentityMax: escMax, fRef: B342.gOf('F', 1) };
}

/* ───────── T3 光の経路 = 質量 0・無限速度の慣性移動の場合 ───────── */
/** 弱い場の一次の曲がり ÷ 光(μ/b → 0 を先に・第342便b の閉じた式 2 g^n/x² ÷ 4 —— 加速 × g^n を重力の加速にも当てた宣言) */
export const bendOverLight = (g, x, n) => Math.pow(g, n) / (2 * x * x);
/** B の読み(y を与える): x = y g・曲がり ÷ 光 = g^(n−2)/(2 y²)・飛行の時間 ÷(L ÷ c_loc)= 1/x */
export function rowB(k, n, y) { const g = formG(k, y), x = y * g; return { s: y, x, g, bend: bendOverLight(g, x, n), time: 1 / x }; }
/** A の読み(x を与える): g = G(x)・曲がり ÷ 光 = g^n/(2 x²)・飛行の時間 ÷(L ÷ c_loc)= 1/x */
export function rowA(k, n, x) { const g = formG(k, x); return { s: x, x, g, bend: bendOverLight(g, x, n), time: 1 / x }; }
/** 解析の極限(y → ∞ か x → ∞)。'inf' は発散・数は極限の値 */
export function limitB(k, n) {
  const K = kVal(k);
  // 大きな y で g ≈ (2k)^k y^(−2k)(k 有限)・exp は e^(−y²/2)
  const speed = xLimit(k);
  const time = speed === 'inf' ? 0 : speed === 1 ? 1 : 'inf';
  // 曲がり ÷ 光 = g^(n−2)/(2y²) ~ C y^(−2k(n−2) − 2)
  let bend;
  if (K === Infinity) bend = n < 2 ? 'inf' : 0;
  else { const p = -2 * K * (n - 2) - 2; bend = p < 0 ? 0 : p > 0 ? 'inf' : (2 * K) ** (K * (n - 2)) / 2; }   // ** は Math の関数の揺らぎを受けない(k = ½ で 1・k = 1 で 2 の整数べき —— 丸めなし)
  return { speed, bend, time };
}
export function limitA(k, n) { return { speed: 'inf', bend: 0, time: 0 }; }   // x → ∞: g^n/(2x²) → 0(n ≥ 0)・時間 1/x → 0
export function t3Rows() {
  const rows = [];
  for (const read of ['B', 'A']) for (const k of DECL.kGrid) for (const n of DECL.nGrid) {
    const fin_ = DECL.sGrid.map((s) => (read === 'B' ? rowB(k, n, s) : rowA(k, n, s)));
    const lim = read === 'B' ? limitB(k, n) : limitA(k, n);
    rows.push({ read, k, n, finite: fin_.map((r) => ({ s: r.s, x: r.x, bend: r.bend, time: r.time })), limit: lim,
      sameAsLight: lim.speed === 1 && lim.bend === 1 && lim.time === 1 });
  }
  // 今のアプリの物差し: 局所光速の粒子(n = 0・x = 1)の曲がりは光の 0.5 倍(第341便e)
  const appRatio = bendOverLight(1, 1, 0);
  // 数値の走り(第342便b の deflectionG —— B の読みの k = ½ は型 F と同じ時計なので F の走りで・A の読みの k = ½・1・∞ は U1・U2・U3 の走りで)と弱い場の閉じた式
  const b = DECL.bNum, light = L.deflection('light', b).alpha, num = [];
  for (const n of [1, 2]) {
    for (const y of [1, 2]) { const x = xOfY(0.5, y), d = B342.deflectionG('F', n, b, x); num.push({ read: 'B', k: 0.5, n, s: y, x, ratio: d.alpha / light, closed: rowB(0.5, n, y).bend }); }
    for (const k of [0.5, 1, 'inf']) for (const x of [1, 2]) { const d = B342.deflectionG(typeOfK(k), n, b, x); num.push({ read: 'A', k, n, s: x, x, ratio: d.alpha / light, closed: rowA(k, n, x).bend }); }
  }
  const numRel = Math.max(...num.map((r) => Math.abs(r.ratio / r.closed - 1)));
  return { rows, appRatio, num, numRel, bNum: b };
}

/* ───────── T4 ミューオンの寿命(文献の値・未照合)───────── */
export function t4Rows() {
  const M = DECL.muon, x = Math.sqrt(1 - 1 / (M.gamma * M.gamma));
  const rows = [];
  for (const read of ['A', 'B']) for (const k of DECL.kGrid) {
    let g = null, y = null, note;
    if (read === 'A') { g = formG(k, x); y = x / g; note = 'ok'; }
    else { const G = gOfXB(k, x); if (G.lower === null) note = 'unreached'; else { g = G.lower; y = x / g; note = 'ok'; } }
    const tau = g === null ? null : M.tau0us / g;
    rows.push({ read, k, x, y, g, tauUs: tau, dUs: tau === null ? null : tau - M.tauObsUs, dSig: tau === null ? null : (tau - M.tauObsUs) / M.tauObsSigUs, note });
  }
  // 局所光速で止まる型 F(A の読み)
  const gF = B342.gOf('F', x), tF = M.tau0us / gF;
  return { x, rows, F: { g: gF, tauUs: tF, dUs: tF - M.tauObsUs, dSig: (tF - M.tauObsUs) / M.tauObsSigUs }, xMaxB: DECL.kGrid.map((k) => ({ k, xMax: xMax(k) ? xMax(k).xMax : null })) };
}

/* ───────── T5 〔第342便b〕の連鎖律の文の訂正 —— 足りない項を入れた読み ───────── */
// 一般の連鎖律: d²p/dt² = (dτ/dt)² d²p/dτ² + (d²τ/dt²)(dp/dτ)。〔第342便b〕のべき 2 の列は第 1 項だけ(dw/dt = a* N² g²)。
// 「d²p/dτ² = a*(一定)」の宣言で第 2 項も入れると、dp/dτ = w/(N g)・d²τ/dt² = N g'(x) dx/dt から dw/dt (1 − x g'/g) = a* N² g² ——
// 無次元で dx/dT = g² f(x)・f = 1/(1 − x g'/g)(T = a* N² t ÷ c_loc —— べき 2 の列と同じ物差し)。型 F では g² f = g⁴ = (1 − x²)²(恒等式)。
// 第 2 項 ÷ 左辺 = x g'/g(負 —— 時計の進みが遅くなる向きの分だけ、べき 2 の列より加速が小さい)。
export const chainFactor = (type, x) => {
  const r = type === 'F' ? -x / (1 - x * x) : type === 'U1' ? dlnG(0.5, x) : type === 'U2' ? dlnG(1, x) : type === 'U3' ? dlnG('inf', x) : NaN;   // g'/g
  if (!fin(r)) throw new Error('chainFactor: 型か x が無い ' + type + ' ' + x);
  return { share: x * r, f: 1 / (1 - x * r) };
};
export function tReachFull(type, x) {
  const integrand = (s) => { const g = B342.gOf(type, s); return 1 / (g * g * chainFactor(type, s).f); };
  return L.simpson(integrand, 0, x, DECL.nQuad);
}
/** 型 F の閉じた形: ∫ dx/(1 − x²)² = x/(2(1 − x²)) + ½ atanh x */
export const tReachFullFClosed = (x) => x / (2 * (1 - x * x)) + 0.5 * Math.atanh(x);
export function t5Rows() {
  const types = ['F', 'U1', 'U2', 'U3'];
  const rows = types.map((type) => ({ type,
    share: DECL.xChain.map((x) => chainFactor(type, x).share), f: DECL.xChain.map((x) => chainFactor(type, x).f),
    tReachN2: DECL.xReach.map((x) => B342.tClosed(type, 2, x)), tReachFull: DECL.xReach.map((x) => tReachFull(type, x)) }));
  // 恒等式(零試験): F の g² f = g⁴・F の到達の時間の閉じた形と Simpson
  let idMax = 0; for (const x of DECL.xChain) { const g = B342.gOf('F', x); idMax = Math.max(idMax, Math.abs(g * g * chainFactor('F', x).f - g ** 4) / (g ** 4)); }
  let qMax = 0; for (const x of DECL.xReach) qMax = Math.max(qMax, Math.abs(tReachFull('F', x) / tReachFullFClosed(x) - 1));
  return { rows, identityMax: idMax, quadRel: qMax };
}

/* ───────── T6(追記)原仮定者の回答(2026-11-19 —— 第143報の回答)AN866 を受けた列 ───────── */
// 参考の値 e^(−½)(今の式の静止の時計の r_s での値)は「無限速度で当事者時間が止まる場合」の局所光速のときの時計の値として読む。「局所光速の時」の読みは 2 つ:
//   R1 = 当事者時間で測った速さが局所光速(y = 1)/R2 = 絶対時間で見た速さが局所光速(x = 1)に、時計が 0 でないまま届いたとき。どの形を採るかは決めない。
// 2 ノブの族(統括の参考の試作): g(y)^(−2) = 1 + y² + h(y)・h(1) = e − 2(g(1) = e^(−½))・h は小さい y で y⁴ の桁。
//   1 − x² = (1 + h)/(1 + y² + h)・g = √(1 − x²) ÷ √(1 + h)。h の遠くの型 3 つは例(ノブ: 遠くの型・係数 a)。
export const T6 = Object.freeze({ ref: 'e^(−½)', a: 2 * (Math.E - 2), c3: Math.E - 2, kR2: Object.freeze([0.25, 'kstar', 0.4]), hTypes: Object.freeze(['h1', 'h2', 'h3']),
  hName: Object.freeze({ h1: 'h = a y⁴/(1 + y⁴)(遠くで定数 a)', h2: 'h = a y⁴/(1 + y⁶)(遠くで 0)', h3: 'h = (e − 2) y⁴(遠くで y⁴ のまま増す)' }) });
/** h(y)(a は係数のノブ —— 既定 2(e − 2)・h3 は既定 e − 2) */
export function hOf(type, y, a) {
  if (type === 'h1') { const A = a === undefined ? T6.a : a; return A * y ** 4 / (1 + y ** 4); }
  if (type === 'h2') { const A = a === undefined ? T6.a : a; return A * y ** 4 / (1 + y ** 6); }
  if (type === 'h3') { const A = a === undefined ? T6.c3 : a; return A * y ** 4; }
  if (type === 'h0') return 0;
  throw new Error('hOf: 型が無い ' + type);
}
export const g2 = (type, y, a) => 1 / Math.sqrt(1 + y * y + hOf(type, y, a));
export const x2 = (type, y, a) => y * g2(type, y, a);
/** 2 ノブの族の x(y) の形(対数の格子 1e-2〜1e3 を 4001 点で走査 —— 最大と単調)と遠くの解析の値 */
export function shape2(type) {
  let prev = 0, mono = true, mx = 0, ym = 0;
  for (let i = 0; i <= 4000; i++) { const y = 10 ** (-2 + i * 5 / 4000), x = x2(type, y); if (x < prev - 1e-15) mono = false; if (x > mx) { mx = x; ym = y; } prev = x; }
  // h3 の最大の閉じた形: x² の最大 = 1/(1 + 2√c)(y² = 1/√c)
  const closed = type === 'h3' ? { xMax: 1 / Math.sqrt(1 + 2 * Math.sqrt(T6.c3)), yStar: Math.pow(T6.c3, -0.25) } : null;
  return { monotone: mono, xMaxScan: mono ? null : mx, yStarScan: mono ? null : ym, closed, xLimit: type === 'h3' ? 0 : 1 };
}
/** x を与えて y を解く(単調な形は 1 価・h3 は下の枝) */
export function yOfX2(type, x) {
  const S = type === 'h3' ? Math.pow(T6.c3, -0.25) : null;
  if (type === 'h3' && x > 1 / Math.sqrt(1 + 2 * Math.sqrt(T6.c3))) return null;
  if (type !== 'h3' && x >= 1) return null;
  let lo = 0, hi = S === null ? 1 : S; if (S === null) while (x2(type, hi) < x) hi *= 2;
  for (let i = 0; i < 200; i++) { const m = 0.5 * (lo + hi); if (x2(type, m) < x) lo = m; else hi = m; }
  return 0.5 * (lo + hi);
}
/** 光の極限(y → ∞)の曲がり ÷ 光 = g^(n−2)/(2y²)(解析): h1・h2 は g ≈ 1/y → n = 0 で ½・n ≥ 1 で 0/h3 は g ≈ y^(−2)/√c → n = 0 で ∞・n = 1 で √c/2・n = 2 で 0 */
export function limit2(type, n) {
  const speed = type === 'h3' ? 0 : 1, time = type === 'h3' ? 'inf' : 1;
  let bend; if (type === 'h3') bend = n === 0 ? 'inf' : n === 1 ? Math.sqrt(T6.c3) / 2 : 0; else bend = n === 0 ? 0.5 : 0;
  return { speed, bend, time };
}
/** k < ½ の 1 ノブの族で x = 1 での時計が e^(−½) になる k*(x = y g = 1 で g = e^(−½) ⇒ y² = e ⇒ k ln(1 + e/(2k)) = ½) */
export function kStar() { let lo = 0.1, hi = 0.5; for (let i = 0; i < 200; i++) { const m = 0.5 * (lo + hi); if (m * Math.log(1 + Math.E / (2 * m)) < 0.5) lo = m; else hi = m; } return 0.5 * (lo + hi); }
/** 1 ノブの族(k < ½)で x = 1 を通る y とそこでの時計 */
// 第344便c(統括の検証項目 R387): 定義域の検査を足した —— 0 < k < ½ の外は例外(k = ½ は有限の y で x = 1 に届かない〔x = y/√(1 + y²) < 1 —— 前の版は丸めで有限の y を返した〕・
//   k > ½ は x の最大が 1 未満・k ≤ 0 と ∞ は族の外)。漸近の値は limitB・xLimit の解析の列で読む。範囲の内の値は前の版と同じ(表の数は変わらない)。
export function atX1(k) { const K = kVal(k); if (!(fin(K) && K > 0 && K < 0.5)) throw new Error('atX1: k は 0 < k < ½ だけ(k = ½ は有限の y で x = 1 に届かない・k > ½ は x の最大が 1 未満)' + k); let lo = 0, hi = 1; while (xOfY(k, hi) < 1) hi *= 2; for (let i = 0; i < 200; i++) { const m = 0.5 * (lo + hi); if (xOfY(k, m) < 1) lo = m; else hi = m; } const y = 0.5 * (lo + hi); return { y, g: formG(k, y) }; }
const muonOf = (g) => { const M = DECL.muon; if (g === null) return null; const tau = M.tau0us / g; return { g, tauUs: tau, dUs: tau - M.tauObsUs, dSig: (tau - M.tauObsUs) / M.tauObsSigUs }; };
export function t6Rows() {
  const ref = Math.exp(-0.5), xm = Math.sqrt(1 - 1 / (DECL.muon.gamma * DECL.muon.gamma)), ks = kStar();
  // T6-a(R1): 1 ノブの族の y = 1 の値
  const oneKnob = [0.5, 1, 2, 'inf'].map((k) => ({ k, gAtY1: formG(k, 1), dRef: formG(k, 1) - ref }));
  // T6-a(R1): 2 ノブの族
  const twoKnob = T6.hTypes.map((type) => {
    const sh = shape2(type), y = yOfX2(type, xm), g = y === null ? null : g2(type, y);
    return { type, gAtY1: g2(type, 1), dRef: g2(type, 1) - ref, h1: hOf(type, 1), y4: 3 / 8 - (type === 'h3' ? T6.c3 : T6.a) / 2, ...sh,
      muon: y === null ? { note: 'unreached' } : { note: 'ok', y, ...muonOf(g), overF: (DECL.muon.tau0us / g) / (DECL.muon.tau0us * DECL.muon.gamma) },
      limit: [0, 1, 2].map((n) => ({ n, ...limit2(type, n) })) };
  });
  // T6-b(R2): k < ½ の行と k*
  const kRows = T6.kR2.map((kk) => { const k = kk === 'kstar' ? ks : kk, A = atX1(k), G = gOfXB(k, xm).lower;
    return { k: kk, kVal: k, yAtX1: A.y, gAtX1: A.g, dRef: A.g - ref, muon: { note: 'ok', y: xm / G, ...muonOf(G) }, limit: [0, 1, 2].map((n) => ({ n, ...limitB(k, n) })) }; });
  // 零試験: h = 0 で k = ½ の形・a = 0 で同じ・h(1) = e − 2 で g(1) = e^(−½)・k* で x = 1 の時計 = e^(−½)
  let z0 = 0, za = 0; for (const y of [0.1, 0.5, 1, 3, 10]) { z0 = Math.max(z0, Math.abs(g2('h0', y) - formG(0.5, y))); for (const t of ['h1', 'h2', 'h3']) za = Math.max(za, Math.abs(g2(t, y, 0) - formG(0.5, y))); }
  const zr = Math.max(...T6.hTypes.map((t) => Math.abs(g2(t, 1) - ref))), zk = Math.abs(atX1(ks).g - ref);
  // 1 − x² = (1 + h)/(1 + y² + h) の恒等式
  let zi = 0; for (const t of T6.hTypes) for (const y of [0.3, 1, 3]) { const x = x2(t, y), h = hOf(t, y); zi = Math.max(zi, Math.abs((1 - x * x) - (1 + h) / (1 + y * y + h))); }
  return { ref, kStar: ks, oneKnob, twoKnob, kRows, zero: { h0: z0, a0: za, ref: zr, kstar: zk, ident: zi } };
}
export const t6Gates = (T) => ({ zero: T.zero.h0 < 1e-15 && T.zero.a0 < 1e-15 && T.zero.ref < 1e-15 && T.zero.kstar < 1e-12 && T.zero.ident < 1e-12 });

/* ───────── 零試験と純関数の場面 ───────── */
export function pureScenes() {
  const T1 = t1Rows(), T2 = t2Rows(), T5 = t5Rows();
  // ① 静止(y = 0 と x = 0)で全部の形の g が 1
  const g0 = DECL.kGrid.every((k) => Math.abs(formG(k, 0) - 1) < 1e-15 && Math.abs(gOfXB(k, 0).lower - 1) < 1e-15);   // 丸めの 1 bit を許す(Math の関数の戻り値)
  // ② 族が第342便b の gOf と同じ(k = ½・1・∞)
  // ③ k = ½ の B の読み = √(1 − x²) の恒等式
  // ④ 最大の x の閉じた形(k = 1 で √2 ÷ 2・k → ∞ で e^(−½))
  const mx = Math.max(Math.abs(xMax(1).xMax - Math.SQRT1_2), Math.abs(xMax('inf').xMax - Math.exp(-0.5)), Math.abs(xMax(2).yStar - Math.sqrt(4 / 3)));
  // ⑤ 書き直した時計の逆が元へ戻る(下の枝と上の枝の y で x(y) を作り直す)
  let inv = 0; for (const k of [1, 2, 'inf']) for (const x of [0.1, 0.3, 0.5]) { const G = gOfXB(k, x); for (const g of [G.lower, G.upper]) { inv = Math.max(inv, Math.abs((x / g) * g - x)); const y = x / g; inv = Math.max(inv, Math.abs(xOfY(k, y) - x)); } }
  // ⑥ 脱出の深さの時計 = exp の形・F の連鎖律の項を入れた読み = g⁴
  // ⑦ 拒否: s が負・k が 0 以下・型が無い
  let rej = 0; try { formG(1, -1); } catch (e) { rej++; } try { formG(0, 1); } catch (e) { rej++; } try { chainFactor('V', 0.5); } catch (e) { rej++; } try { gOfXB(1, -0.1); } catch (e) { rej++; }
  return { g0, famMax: T1.famMax, identityMax: T1.identityMax, xMaxErr: mx, invErr: inv, escapeMax: T2.escapeIdentityMax, chainIdMax: T5.identityMax, chainQuad: T5.quadRel, reject: { n: rej, of: 4 } };
}
export function pureGates(S) {
  return { g0: S.g0 === true, family: S.famMax < 1e-15, identity: S.identityMax < 1e-12, xMax: S.xMaxErr < 1e-12, inverse: S.invErr < 1e-12,
    escape: S.escapeMax < 1e-15, chain: S.chainIdMax < 1e-12 && S.chainQuad < 1e-9, reject: S.reject.n === S.reject.of };
}
