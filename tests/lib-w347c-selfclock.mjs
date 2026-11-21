// 第347便c(原仮定者の回答(2026-11-21 —— 第145報)「AN904: 探索のアプローチを変える。粒子が局所光速に達した時も、自分自身の決定力により、わずかに当事者時間が進む。
//   時間が進む半径と、シュバルツシルト半径を比較する。ガンマ線バーストへの影響も調べる」・統括の検証項目 R402): **自分自身の決定力で局所光速でもわずかに進む時計の読みの候補(型 S1〜S3)と対照 S0・
//   「時間が進む半径」の定義 3 つとシュバルツシルト半径の比・ガンマ線バーストの放出の時刻の幅(光の伝わりは今のまま —— 放出する側の時計だけを変えた列)を並べる純関数 —— 診断だけ**
//   (器 tests/exp-w347c-selfclock.mjs と QA behavior.selfclock347c・docs.selfclock347c が読む —— html を読まない・ファイルを読まない・状態を持たない)。
//   アプリの点の時計・表面の時計・光学・積分・内蔵の本・受理器は変えない(候補は器と正本だけ)。第344便c・第342便b の lib は呼ぶだけ。
//
// ■ 記号(〔第342便a〕〔第342便b〕と同じ —— 基準光速 c₀): 決定力の無次元の量 ψ = X_k × W(X_k = G₀/c₀²・W = 質量 ÷ 距離 の和)。静止の点の時計 N = e^(−ψ_ext)(外部の決定力だけ)・
//   局所光速 c_loc = c₀ e^(−2ψ_ext)・x = w ÷ c_loc(場に対する相対の速さを絶対時間で見る —— 原仮定者の回答(2026-11-19 —— 第142報の回答 2)AN839)。
//   自分自身の決定力 ψ_self = G₀ m ÷(r c₀²)(r は測る半径 —— 既定は物の半径 R)。シュバルツシルト半径 r_s = 2G₀m/c₀² の上で ψ_self = ½(静止の時計 e^(−½) = 0.6065)。
//   g = 時計の進み ÷ 静止の点の時計 N(速さによる因子)。今の点の時計は G(x) = √(1 − x²)(局所光速で 0)。
// ■ 型(候補 —— どれもアプリへ入れたものではない。決め打ちしない —— 台帳 AN928)
//   S0p 今の点の時計 g = G(対照 —— 局所光速で止まる)。
//   S0s 今の表面の時計(〔第342便a〕)g = e^(−ψ_self) √(max(0, 1 − e^(4ψ_self) x²))(対照 —— 自己を足すと局所光速が下がり、止まりは早まる: 止まる x = e^(−2ψ_self))。
//   S1  自己が速度の基準に寄与する: 基準の速度 = 外の場(静止)と自己の場(粒子と同じ速度)の重み平均・重み w = ψ_w ÷(ψ_w + ψ_ext)(ψ_w = 測る半径 r_w での自己の決定力)。
//       相対の速さは (1 − w) x → g = √(1 − (1 − w)² x²) = √((1 − x²) + w(2 − w) x²)(後の形で数える —— w が小さいとき丸めで 0 にしない)。局所光速で √(w(2 − w))。
//   S2  滑らかな床: g = ((G^n + φ^n) ÷(1 + φ^n))^(1/n)・床 φ = √(w(2 − w))(S1 と同じ重みで、局所光速の値を S1 にそろえた —— 床の形だけが違う)・鋭さ n がどの速さから効くかのノブ。
//       x = 0 で 1・G について単調・局所光速で φ ÷(1 + φ^n)^(1/n)。
//   S3L 線形の床: g = φ + (1 − φ) G・φ = min(1, a₁ ψ_self)(係数 a₁ がノブ —— 外の決定力に依らない)。局所光速で φ。
//   S3Q 2 乗の床: 同じ形・φ = min(1, a₂ ψ_self²)。
//   (枝の注: S1 と「g² = G² + φ² x²」の形は同じ —— 床を決める量〔重み〕が違う。S2 と S3 は床の入れ方の形が違う)
// ■ 観測量の見込み(〔第344便c〕の作り方を呼ぶ —— 比べる仮定もそのまま): ε の見込み = g ÷ √(1 − x²) − 1(C344.epsOf)。静止の時計の因子は比で消える(S0s の e^(−ψ_self) も消える)。
// ■ ガンマ線バースト(台帳 AN929): 光の伝わりは今のまま固定(局所光速 c_loc で進む・場は静的 —— 続けて出た光は同じ残りの道を通る)。放出する塊の固有の時間幅 Δτ が、
//   絶対時間で Δτ ÷(N g)・到着の時刻の幅で Δτ (1 ∓ x) ÷(N g)× N_obs(進む向きの詰まり 1 ∓ x —— − は観測者へ向かう)。遠くの静止の観測者 N_obs の宣言は表ごとに書く。
// ■ 言わないこと: 型は候補(時計の則ではない)・どの型を採るか、どの定義を「時間が進む半径」と読むかを決めない・文献の値は未照合(採用・棄却に使わない)・
//   アプリの時計と光線には何も入れない・物の質量と半径・外の決定力の 3 点は宣言の入力(桁の型)。
import * as C344 from './lib-w344c-clockmid.mjs';
import * as B342 from './lib-w342b-clockstop.mjs';

export const LIB_VERSION = 'w347c-selfclock-lib-1';
const fin = (x) => typeof x === 'number' && Number.isFinite(x);

const G0 = 6.674e-11, C0 = 299792458, MSUN = 1.989e30, AU = 1.496e11;
export const DECL = Object.freeze({
  /** 物理の定数と単位(宣言の入力 —— 標準の桁の値・この器では照合していない) */
  phys: Object.freeze({ G0, c0: C0, Msun: MSUN, AU }),
  /** 物(質量 kg・半径 m —— 宣言の入力。電子・陽子・イオンの半径は桁の型で、測る半径のノブの既定) */
  bodies: Object.freeze([
    Object.freeze({ id: 'e', name: '電子(古典電子半径を半径の型に)', m: 9.109e-31, R: 2.818e-15 }),
    Object.freeze({ id: 'p', name: '陽子(電荷の半径の桁を半径の型に)', m: 1.6726e-27, R: 8.41e-16 }),
    Object.freeze({ id: 'li', name: 'リチウムのイオン ⁷Li⁺(核の半径の桁を半径の型に)', m: 1.165e-26, R: 2.4e-15 }),
    Object.freeze({ id: 'kg', name: '1 kg の球(密度 1000 kg/m³)', m: 1, R: Math.cbrt(3 / (4 * Math.PI * 1000)) }),
    Object.freeze({ id: 'earth', name: '地球', m: 5.972e24, R: 6.371e6 }),
    Object.freeze({ id: 'sun', name: '太陽', m: MSUN, R: 6.957e8 }),
    Object.freeze({ id: 'wd', name: '白色矮星の型(0.6 太陽質量・半径 8.7e6 m)', m: 0.6 * MSUN, R: 8.7e6 }),
    Object.freeze({ id: 'ns', name: '中性子星の型(1.4 太陽質量・半径 12 km)', m: 1.4 * MSUN, R: 1.2e4 }),
    Object.freeze({ id: 'bh1', name: '10 太陽質量を r_s の 1 倍まで縮めた型', m: 10 * MSUN, Rs: 1 }),
    Object.freeze({ id: 'bh2', name: '10 太陽質量を r_s の 2 倍まで縮めた型', m: 10 * MSUN, Rs: 2 }),
    Object.freeze({ id: 'bh3', name: '10 太陽質量を r_s の 3 倍まで縮めた型', m: 10 * MSUN, Rs: 3 }),
  ]),
  /** 外の決定力の 3 点(太陽の近く = 太陽の 1 au の G₀M/(r c₀²)・銀河の中と銀河団は桁の型 —— 一様な背景 D₀ は入れない) */
  exts: Object.freeze([
    Object.freeze({ id: 'sunnear', name: '太陽の近く(1 au)', psi: G0 * MSUN / (AU * C0 * C0) }),
    Object.freeze({ id: 'galaxy', name: '銀河の中(型)', psi: 1e-6 }),
    Object.freeze({ id: 'cluster', name: '銀河団の型', psi: 1e-5 }),
  ]),
  types: Object.freeze(['S0p', 'S0s', 'S1', 'S2', 'S3L', 'S3Q']),
  /** 既定のノブ(T1 の表) —— S1 と S2 の重みは物の半径で測る・S2 の鋭さ・S3 の係数 */
  knob: Object.freeze({ rwOverR: 1, n: 4, a1: 1, a2: 1 }),
  nGrid: Object.freeze([2, 4, 8]),
  /** T1 の速さ(局所光速の倍) */
  xGrid: Object.freeze([0.338, 0.6, 0.9, 0.99, 1]),
  /** T1 の速さの表に載せる代表の物(外は銀河の中) */
  repBodies: Object.freeze(['li', 'sun', 'ns', 'bh1']),
  repExt: 'galaxy',
  /** イオンの測定(〔第344便c〕の DECL.ion を呼ぶ —— 文献の値・未照合)・ノブの範囲の判定の物差しの倍 */
  sigK: Object.freeze([1, 2]),
  /** S1 の測る半径の別の型(イオン半径の桁 —— 宣言) */
  liIonicR: 7.6e-11,
  /** T2: しきい値(参考の値 e^(−½)・½・1e-3)・物理の半径を書く質量(太陽質量の倍) */
  thetas: Object.freeze(['eHalf', 0.5, 1e-3]),
  massesMsun: Object.freeze([1, 10, 1e6, 1e9]),
  /** T3: 標準の読みのローレンツ因子(x = √(1 − 1/Γ²) の点)と 0.99・1・床の高さ φ・固有の時間幅(s) */
  gammaStd: Object.freeze([10, 100, 1000]),
  phiGrid: Object.freeze([1e-6, 1e-3, 1e-1]),
  dtauS: Object.freeze([1, 1e-3]),
  /** T3 の落ち込み: 中心の天体の決定力 ψ_c(r = 3 r_s・1.5 r_s・r_s)・落ち込む速さ・表面の時計の対照の塊の自己 */
  psiC: Object.freeze([1 / 6, 1 / 3, 0.5]),
  xFall: Object.freeze([0.9, 0.99, 1]),
  phiFall: Object.freeze([1e-3, 1e-1]),
  psiSelfBlob: 1e-2,
  /** 比べる列(文献の値・未照合 —— 採用・棄却に使わない) */
  grbSrc: Object.freeze([
    'ガンマ線バーストの継続の時間の 2 つの群の区切り 約 2 s(Kouveliotou ほか、ApJ 413, L101, 1993)(文献の値・未照合)',
    '光度の変動の時間の桁 ミリ秒(Fishman と Meegan、Annu. Rev. Astron. Astrophys. 33, 415, 1995)(文献の値・未照合)',
    '標準の読みの放出する塊のローレンツ因子 100〜1000 の桁(Piran、Rev. Mod. Phys. 76, 1143, 2004)(文献の値・未照合)',
  ]),
});

/* ───────── 量 ───────── */
export const rsOf = (m) => 2 * G0 * m / (C0 * C0);
export const radiusOf = (b) => (b.Rs !== undefined ? b.Rs * rsOf(b.m) : b.R);
/** 自己の決定力(半径 r で) */
export const psiSelfAt = (m, r) => G0 * m / (r * C0 * C0);
/** 重み w = ψ_w ÷(ψ_w + ψ_ext) */
export function weightOf(psiW, psiExt) {
  if (!(fin(psiW) && psiW >= 0 && fin(psiExt) && psiExt >= 0)) throw new Error('weightOf: ψ は有限で非負 ' + psiW + ' ' + psiExt);
  const s = psiW + psiExt; return s > 0 ? psiW / s : 0;
}
const ok01 = (v, nm) => { if (!(fin(v) && v >= 0 && v <= 1)) throw new Error(nm + ' は 0〜1 ' + v); };
const chkX = (x) => { if (!(fin(x) && x >= 0 && x <= 1)) throw new Error('x は 0 ≤ x ≤ 1(局所光速まで)' + x); };
/** 今の点の時計の因子(第342便b の型 F を呼ぶ) */
export const Gp = (x) => { chkX(x); return B342.gOf('F', x); };

/* ───────── 型の因子(形の宣言だけ —— 床 φ・重み w・自己 ψ を直に受ける)───────── */
/** S1 の形: g = √(G² + w(2 − w) x²) */
export function gS1w(w, x, G = Gp(x)) { ok01(w, 'w'); return Math.sqrt(G * G + w * (2 - w) * x * x); }
/** 床を φ にそろえた S1 の形(T3 で使う): g = √(G² + φ² x²) */
export function gS1phi(phi, x, G = Gp(x)) { ok01(phi, 'φ'); return Math.sqrt(G * G + phi * phi * x * x); }
/** S2 の形: ((G^n + φ^n) ÷(1 + φ^n))^(1/n)(大きい方で割ってから冪 —— 丸めで 0 に落とさない) */
export function gS2phi(phi, n, x, G = Gp(x)) {
  ok01(phi, 'φ'); if (!(fin(n) && n > 0)) throw new Error('n は正 ' + n);
  const M = Math.max(G, phi); if (M === 0) return 0;
  return M * Math.pow((Math.pow(G / M, n) + Math.pow(phi / M, n)) / (1 + Math.pow(phi, n)), 1 / n);
}
/** S3 の形: φ + (1 − φ) G */
export function gS3phi(phi, x, G = Gp(x)) { ok01(phi, 'φ'); return phi + (1 - phi) * G; }
/** S0s の形(〔第342便a〕の表面の時計を静止の点の時計で割った因子) */
export function gS0s(psiSelf, x) {
  chkX(x); if (!(fin(psiSelf) && psiSelf >= 0)) throw new Error('ψ_self は有限で非負 ' + psiSelf);
  return Math.exp(-psiSelf) * Math.sqrt(Math.max(0, (1 - x * x) - Math.expm1(4 * psiSelf) * x * x));   // 1 − e^(4ψ) x² を (1 − x²) − (e^(4ψ) − 1) x² で数える(ψ が小さいときの丸め)
}
export const phiOfW = (w) => Math.sqrt(w * (2 - w));
export const wOfPhi = (phi) => phi * phi / (1 + Math.sqrt(1 - phi * phi));   // = 1 − √(1 − φ²)(引き算の桁落ちなし)

/** 物 × 外 × 型 の因子(既定のノブ —— knob で上書き) */
export function ctxOf(body, ext, knob = DECL.knob) {
  const R = radiusOf(body), psiSelf = psiSelfAt(body.m, R), psiW = psiSelfAt(body.m, R * knob.rwOverR), w = weightOf(psiW, ext.psi);
  return { R, psiSelf, psiExt: ext.psi, psiW, w, phi1: phiOfW(w), phiL: Math.min(1, knob.a1 * psiSelf), phiQ: Math.min(1, knob.a2 * psiSelf * psiSelf), n: knob.n };
}
export function gType(type, ctx, x) {
  const G = Gp(x);
  if (type === 'S0p') return G;
  if (type === 'S0s') return gS0s(ctx.psiSelf, x);
  if (type === 'S1') return gS1w(ctx.w, x, G);
  if (type === 'S2') return gS2phi(ctx.phi1, ctx.n, x, G);
  if (type === 'S3L') return gS3phi(ctx.phiL, x, G);
  if (type === 'S3Q') return gS3phi(ctx.phiQ, x, G);
  throw new Error('gType: 型が無い ' + type);
}

/* ───────── T1 局所光速での時計の進みの表 ───────── */
const bodyById = (id) => DECL.bodies.find((b) => b.id === id);
const extById = (id) => DECL.exts.find((e) => e.id === id);
export function t1Rows() {
  const bodies = DECL.bodies.map((b) => { const R = radiusOf(b); return { id: b.id, m: b.m, R, rs: rsOf(b.m), ROverRs: R / rsOf(b.m), psiSelf: psiSelfAt(b.m, R), w: DECL.exts.map((e) => weightOf(psiSelfAt(b.m, R), e.psi)) }; });
  const atC = [];   // 物 × 外: 局所光速での因子(型 6)
  for (const b of DECL.bodies) for (const e of DECL.exts) { const c = ctxOf(b, e); atC.push({ body: b.id, ext: e.id, psiSelf: c.psiSelf, psiExt: c.psiExt, w: c.w, g: DECL.types.map((t) => gType(t, c, 1)) }); }
  const speeds = [];   // 代表の物 × 型 × 速さ(外は銀河の中)
  for (const id of DECL.repBodies) { const c = ctxOf(bodyById(id), extById(DECL.repExt)); for (const t of DECL.types) speeds.push({ body: id, type: t, g: DECL.xGrid.map((x) => gType(t, c, x)) }); }
  // S0s の止まる速さ(物ごと)
  const stopS0s = DECL.bodies.map((b) => ({ body: b.id, xStop: Math.exp(-2 * psiSelfAt(b.m, radiusOf(b))) }));
  return { bodies, atC, speeds, stopS0s };
}

/* ───────── T1′ イオンの測定(文献の値・未照合)の不確かさの内に収まるノブの範囲 ───────── */
const ION = C344.DECL.ion;
export const epsPred = (g, x) => C344.epsOf(g, x);
/** ε の上の限り b = ε_rep + kσ(床の型は ε ≥ 0 —— 下の限り ε_rep − kσ は S0s だけが効く) */
const bisect = (f, lo, hi, it = 200) => { for (let i = 0; i < it; i++) { const m = 0.5 * (lo + hi); if (f(m)) lo = m; else hi = m; } return 0.5 * (lo + hi); };
export function ionRanges() {
  const x = ION.xHigh, G = Gp(x), rows = [];
  for (const k of DECL.sigK) {
    const up = ION.epsRep + k * ION.epsSig, lo = ION.epsRep - k * ION.epsSig;
    // S1: (1 + b)²(1 − x²) = 1 − x² + w(2 − w) x² の閉じた形
    const q = ((1 + up) * (1 + up) - 1) * (1 - x * x) / (x * x), wMax = q / (1 + Math.sqrt(1 - q));
    const phiS1 = phiOfW(wMax);
    // S2: 床 φ の上の限り(対数の二分)
    const s2 = DECL.nGrid.map((n) => { const lphi = bisect((l) => epsPred(gS2phi(Math.exp(l), n, x, G), x) <= up, Math.log(1e-30), 0); const phi = Math.exp(lphi); return { n, phiMax: phi, wMax: wOfPhi(phi), epsAt: epsPred(gS2phi(phi, n, x, G), x) }; });
    // S3: φ ≤ b ÷(1/G − 1)
    const phiS3 = up / (1 / G - 1);
    // S0s: ε = √(1 − e^(4ψ) x²)/√(1 − x²) − 1 ≥ lo → ψ の上の限り
    const psiS0s = 0.25 * Math.log((1 - (1 + lo) * (1 + lo) * (1 - x * x)) / (x * x));
    rows.push({ k, up, lo, S1: { wMax, phiMax: phiS1, epsAt: epsPred(gS1w(wMax, x, G), x) }, S2: s2, S3: { phiMax: phiS3, epsAt: epsPred(gS3phi(phiS3, x, G), x) }, S0s: { psiMax: psiS0s, epsAt: epsPred(gS0s(psiS0s, x), x) } });
  }
  // リチウムのイオンの今の宣言(核の半径・イオン半径)の自己と、ノブの範囲への置き直し
  const li = bodyById('li'), mLi = li.m, psiNuc = psiSelfAt(mLi, li.R), psiIon = psiSelfAt(mLi, DECL.liIonicR), r1 = rows[0];
  const conv = { psiNuc, psiIon, mOverC2: G0 * mLi / (C0 * C0),
    // S1: 測る半径 r_w の下の限り(外の 3 点)—— ψ_w ≤ w ψ_ext ÷(1 − w)
    rwMin: DECL.exts.map((e) => { const psiWMax = r1.S1.wMax * e.psi / (1 - r1.S1.wMax); return { ext: e.id, psiWMax, rwMin: G0 * mLi / (C0 * C0 * psiWMax) }; }),
    // S1 の今の宣言(核の半径で測る)の重みと ε の見込み
    wNow: DECL.exts.map((e) => { const w = weightOf(psiNuc, e.psi); return { ext: e.id, w, eps: epsPred(gS1w(w, ION.xHigh), ION.xHigh) }; }),
    a1Max: r1.S3.phiMax / psiNuc, a2Max: r1.S3.phiMax / (psiNuc * psiNuc),
    a1MaxIonic: r1.S3.phiMax / psiIon, a2MaxIonic: r1.S3.phiMax / (psiIon * psiIon) };
  // 〔第344便c〕の作り方と同じ数(今の点の時計の形の見込みが C344.clockAtX('F') と同じ・式の照合)
  const same344 = { F: Math.abs(epsPred(Gp(x), x) - C344.clockAtX('F', x).eps), formula: Math.abs(epsPred(0.9, 0.3) - (0.9 / Math.sqrt(1 - 0.09) - 1)) };
  return { x, G, epsRep: ION.epsRep, epsSig: ION.epsSig, srcHigh: ION.srcHigh, rows, conv, same344 };
}

/* ───────── T2 「時間が進む半径」の定義とシュバルツシルト半径の比 ───────── */
export const thetaVal = (t) => (t === 'eHalf' ? Math.exp(-0.5) : t);
/** r ÷ r_s = 1 ÷(2 ψ*)(ψ_self(r) = (r_s/r)/2 —— どの定義も質量に依らない比になる) */
const rOverRs = (psiStar) => 1 / (2 * psiStar);
/** 重み w* に届く半径(S1・S2 —— 物の半径で測る既定の宣言) */
const rOfW = (wStar, psiExt) => rOverRs(psiExt * wStar / (1 - wStar));
export function t2Rows() {
  const rows = [];
  for (const e of DECL.exts) {
    // R1: 自己の決定力が外の決定力を上回る半径(w = ½)
    rows.push({ def: 'R1', type: 'S1・S2', ext: e.id, theta: null, ratio: rOfW(0.5, e.psi), closed: 1 / (2 * e.psi) });
    for (const t of DECL.thetas) {
      const th = thetaVal(t);
      // R2: 局所光速での時計の進みが θ に届く半径
      const w1 = 1 - Math.sqrt(1 - th * th);
      rows.push({ def: 'R2', type: 'S1', ext: e.id, theta: t, ratio: rOfW(w1, e.psi), closed: (1 - w1) / (2 * e.psi * w1) });
      const n = DECL.knob.n, phi2 = th / Math.pow(1 - Math.pow(th, n), 1 / n), w2 = phi2 <= 1 ? wOfPhi(phi2) : null;
      rows.push({ def: 'R2', type: 'S2', ext: e.id, theta: t, n, ratio: w2 === null ? null : rOfW(w2, e.psi), closed: w2 === null ? null : (1 - w2) / (2 * e.psi * w2) });
    }
  }
  for (const t of DECL.thetas) {
    const th = thetaVal(t);
    rows.push({ def: 'R2', type: 'S3L', ext: null, theta: t, ratio: rOverRs(th / DECL.knob.a1), closed: DECL.knob.a1 / (2 * th) });
    rows.push({ def: 'R2', type: 'S3Q', ext: null, theta: t, ratio: rOverRs(Math.sqrt(th / DECL.knob.a2)), closed: Math.sqrt(DECL.knob.a2 / th) / 2 });
  }
  // R3: 型ごとに自然に出る長さ
  const r3 = [
    { def: 'R3', type: 'S0s', what: '表面の静止の時計が e^(−½) になる半径(ψ_self = ½)', ratio: rOverRs(0.5), closed: 1, note: 'この半径で S0s の止まる速さ e^(−2ψ_self) = ' + Math.exp(-1).toFixed(4) },
    { def: 'R3', type: 'S3L', what: '床が 1 になる半径(局所光速で遅れが無くなる)', ratio: rOverRs(1 / DECL.knob.a1), closed: DECL.knob.a1 / 2 },
    { def: 'R3', type: 'S3Q', what: '床が 1 になる半径', ratio: rOverRs(Math.sqrt(1 / DECL.knob.a2)), closed: Math.sqrt(DECL.knob.a2) / 2 },
  ];
  // 物理の半径(r_s と R1 —— 質量に比例)
  const phys = DECL.massesMsun.map((k) => { const rs = rsOf(k * MSUN); return { mMsun: k, rs, r1: DECL.exts.map((e) => rs / (2 * e.psi)) }; });
  // 0.6065 の 1 行: DFM の静止の時計は r_s で e^(−ψ_self) = e^(−½)
  const rsLine = { clockAtRs: Math.exp(-psiSelfAt(MSUN, rsOf(MSUN))), psiAtRs: psiSelfAt(MSUN, rsOf(MSUN)) };
  // 測る半径を物の半径でなく決めた長さ r_w に置いたときは質量に依る(1 m の例 —— w = ½ に届く質量)
  const fixedRw = DECL.exts.map((e) => ({ ext: e.id, mHalf: e.psi * 1 * C0 * C0 / G0 }));
  return { rows, r3, phys, rsLine, fixedRw };
}

/* ───────── T3 ガンマ線バースト —— 放出する側の時計だけを変えた列 ───────── */
/** 速さの点: x と 1 − x と G を桁落ちなしに */
export function speedPt(spec) {
  if (spec.gamma !== undefined) { const x = Math.sqrt(1 - 1 / (spec.gamma * spec.gamma)); return { label: 'Γ' + spec.gamma, x, omx: (1 / (spec.gamma * spec.gamma)) / (1 + x), G: 1 / spec.gamma }; }
  const x = spec.x; chkX(x); return { label: String(x), x, omx: 1 - x, G: Gp(x) };
}
const SHAPES = Object.freeze(['S0p', 'S1', 'S2', 'S3']);
function gShape(shape, phi, p, n = DECL.knob.n) {
  if (shape === 'S0p') return p.G;
  if (shape === 'S1') return gS1phi(phi, p.x, p.G);
  if (shape === 'S2') return gS2phi(phi, n, p.x, p.G);
  if (shape === 'S3') return gS3phi(phi, p.x, p.G);
  throw new Error('gShape: 形が無い ' + shape);
}
/** 噴き出す塊(観測者へ向かう —— 外の決定力は放出と観測で同じ —— N は比で消える): 伸び 1/g・到着の比 (1 − x)/g */
export function jetRow(shape, phi, p) {
  const g = gShape(shape, phi, p);
  if (g === 0) return { shape, phi: shape === 'S0p' ? 0 : phi, pt: p.label, g: 0, stretch: null, arrive: null, halt: true };
  return { shape, phi: shape === 'S0p' ? 0 : phi, pt: p.label, g, stretch: 1 / g, arrive: p.omx / g, halt: false };
}
export function t3Rows() {
  const pts = DECL.gammaStd.map((gm) => speedPt({ gamma: gm })).concat([speedPt({ x: 0.99 }), speedPt({ x: 1 })]);
  const jet = [];
  for (const p of pts) { jet.push(jetRow('S0p', 0, p)); for (const s of ['S1', 'S2', 'S3']) for (const phi of DECL.phiGrid) jet.push(jetRow(s, phi, p)); }
  // 標準の読みの S0p の到着の比 √((1 − x)/(1 + x)) との照合(Γ の点)
  const s0chk = Math.max(...pts.filter((p) => p.x < 1).map((p) => { const r = jetRow('S0p', 0, p); return Math.abs(r.arrive / Math.sqrt(p.omx / (1 + p.x)) - 1); }));
  // 落ち込む物質(中心の天体の決定力 ψ_c の中・遠くの静止の観測者 N_obs = 1): 比 (1 ± x) ÷(e^(−ψ_c) g)
  const fall = [];
  for (const psiC of DECL.psiC) for (const xv of DECL.xFall) {
    const p = speedPt({ x: xv }), Nc = Math.exp(-psiC);
    const cell = (g) => (g === 0 ? { g: 0, away: null, toward: null, halt: true } : { g, away: (1 + p.x) / (Nc * g), toward: p.omx / (Nc * g), halt: false });
    fall.push({ psiC, x: xv, shape: 'S0p', phi: 0, ...cell(p.G) });
    fall.push({ psiC, x: xv, shape: 'S0s', psiSelf: DECL.psiSelfBlob, ...cell(gS0s(DECL.psiSelfBlob, xv)) });
    for (const s of ['S1', 'S2', 'S3']) for (const phi of DECL.phiFall) fall.push({ psiC, x: xv, shape: s, phi, ...cell(gShape(s, phi, p)) });
  }
  return { pts: pts.map((p) => ({ label: p.label, x: p.x, omx: p.omx, G: p.G })), jet, s0chk, fall, dtauS: DECL.dtauS, src: DECL.grbSrc };
}

/* ───────── T4 整合の零試験(純関数の場面)───────── */
export function zeroTests() {
  const xs = []; for (let i = 0; i <= 2000; i++) xs.push(i / 2000);
  // ① 自己 0 の極限: w = 0・φ = 0・ψ_self = 0 で S0p と同じ
  let self0 = 0; for (const x of xs) { const G = Gp(x); self0 = Math.max(self0, Math.abs(gS1w(0, x) - G), Math.abs(gS2phi(0, 4, x) - G), Math.abs(gS3phi(0, x) - G), Math.abs(gS0s(0, x) - G)); }
  // ② 遅い極限: x = 0 で 1・差 g/G − 1 は x² で 0 へ(x = 0.1 と 0.01 の比が 0.01 の近く)
  const phis = [0.1, 0.3, 0.5]; let at0 = 0, qMin = Infinity, qMax = -Infinity;
  for (const phi of phis) {
    at0 = Math.max(at0, Math.abs(gS1phi(phi, 0) - 1), Math.abs(gS3phi(phi, 0) - 1), ...DECL.nGrid.map((n) => Math.abs(gS2phi(phi, n, 0) - 1)));
    const dev = (f, x) => f(x) / Gp(x) - 1;
    const fs = [(x) => gS1phi(phi, x), (x) => gS3phi(phi, x)].concat(DECL.nGrid.map((n) => (x) => gS2phi(phi, n, x)));
    for (const f of fs) { const q = dev(f, 0.01) / dev(f, 0.1); qMin = Math.min(qMin, q); qMax = Math.max(qMax, q); }
  }
  // ③ 0〜1 の内・単調(x の 2001 点 × 床 6 × 鋭さ 3)
  const phiScan = [0, 1e-6, 1e-3, 0.1, 0.5, 0.9]; let inRange = true, mono = true;
  for (const phi of phiScan) {
    const fs = [(x) => gS1phi(phi, x), (x) => gS3phi(phi, x), (x) => gS1w(wOfPhi(phi), x)].concat(DECL.nGrid.map((n) => (x) => gS2phi(phi, n, x)));
    for (const f of fs) { let prev = Infinity; for (const x of xs) { const g = f(x); if (!(g >= 0 && g <= 1 + 1e-15)) inRange = false; if (g > prev + 1e-15) mono = false; prev = g; } }
  }
  for (const psi of [0, 1e-3, 0.1, 0.5]) { let prev = Infinity; for (const x of xs) { const g = gS0s(psi, x); if (!(g >= 0 && g <= 1)) inRange = false; if (g > prev + 1e-15) mono = false; prev = g; } }
  // ④ 局所光速の閉じた形: S1 √(w(2 − w))・S2 φ ÷(1 + φ^n)^(1/n)・S3 φ・S0s 0(ψ > 0)
  let closed = 0;
  for (const phi of [1e-6, 1e-3, 0.1, 0.5]) { const w = wOfPhi(phi); closed = Math.max(closed, Math.abs(gS1w(w, 1) - Math.sqrt(w * (2 - w))) / phi, Math.abs(gS3phi(phi, 1) - phi) / phi, ...DECL.nGrid.map((n) => Math.abs(gS2phi(phi, n, 1) - phi / Math.pow(1 + Math.pow(phi, n), 1 / n)) / phi)); }
  const s0sStop = gS0s(1e-3, 1) === 0 && gS0s(1e-3, Math.exp(-2e-3) * 0.999999) > 0;
  // ⑤ 丸め: 重みが極端に小さい(1e-35)ときも局所光速の S1 は √(2w)(0 に落ちない)
  const tiny = gS1w(1e-35, 1) / Math.sqrt(2e-35) - 1;
  // ⑥ 拒否: x > 1・x < 0・型が無い・φ > 1・n ≤ 0・ψ < 0
  let rej = 0; const tries = [() => Gp(1.01), () => Gp(-0.1), () => gType('S9', ctxOf(DECL.bodies[0], DECL.exts[0]), 0.5), () => gS3phi(1.5, 0.5), () => gS2phi(0.1, 0, 0.5), () => gS0s(-1, 0.5)];
  for (const f of tries) { try { f(); } catch (e) { rej++; } }
  return { self0, at0, qMin, qMax, inRange, mono, closed, s0sStop, tiny, reject: { n: rej, of: tries.length } };
}
export function pureScenes() { return zeroTests(); }
export function pureGates(S) {
  return { self0: S.self0 < 1e-14, slow: S.at0 < 1e-15 && S.qMin > 0.0095 && S.qMax < 0.0102, range: S.inRange === true, mono: S.mono === true,
    closed: S.closed < 1e-12, s0sStop: S.s0sStop === true, tiny: Math.abs(S.tiny) < 1e-12, reject: S.reject.n === S.reject.of };
}
