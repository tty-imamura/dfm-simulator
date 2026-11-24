// 第352便p(原仮定者の回答(2026-11-24 —— 第148報)「AN1016: (乙)で進める。ただし、「釣り合う」に「安定した歳差運動」を含む」・
//   原仮定者の整理(2026-11-24 —— 第148報)・原仮定者の回答(2026-11-24 —— 第147報)・統括の検証項目 R453):
//   **公転面(輪の法線 n̂)と自転軸 ŝ の共回り —— 輪が背景の回転に応えて回る率 g_輪・一緒に回る枠での止まる向き(2 つの読み)・係数の差の出どころ(応答の係数の比の候補の式)・
//   いまの角を保つ作用と比率 f の上限・輪の法線が経路 ① で寄る角 —— 診断だけ**
//   (器 tests/exp-w352p-coprec.mjs と QA behavior.coprec352p・docs.coprec352p が読む —— html を読まない・ファイルを読まない・状態を持たない。後のラウンドの枝もこの口を import してよい)。
//   アプリの引きずり・自転・ジャイロの步・内蔵の本・受理器・physics の鍵は変えない。
//   既存の lib は呼ぶだけ(本文は変えない): 第352便i(lockPoints・aOf・flowRot・kOf・judgeConst・thAfter・lockGeom)・第352便l(twoAxisStep・closedAxis・dphiFor・axisCoef)・
//   第352便d(rowOf・bgVec・uVenus)・第352便c(refAxes)・第352便e(fixedOffset)・第351便d(r3Coeffs・vec・angDeg)・第347便e(t1Table・geometry)・第337便c(BODY_SRC・GALAXY・G_SI)・
//   第348便c(massOf・radiusOf)・第330便a(DECL.lit.orbitDays —— 公転の日数)。
//
// ■ 語: Ω_bg = 背景の回転(一様 —— 輪の平均は背景そのもの〔第352便l の ringAvg の一様な背景の零試験〕)・W_bg = abs(Ω_bg)・Ω = 受け手の合成(背景 + 局所の (S))・W = abs(Ω)。
//   輪の法線 n̂ と自転軸 ŝ は、どちらも第351便d の (R3) の 2 経路で応える(係数: 比率 f〔(N1)〕・歳差の向きの読み σ〔(g2+) +1・(g2−) −1〕・応答の比 c〔輪 c_n・自転軸 c_s〕)。
// ■ g_輪(T1 の 1): 輪は一様な背景だけに応える(本 lib の置き方)—— dn̂/dt = σ k₂(f_n) c_n (Ω_bg × n̂) + 経路 ① —— 背景の軸 Ω̂_bg のまわりを率 g_輪 = σ k₂(f_n) c_n W_bg で回る。
//   比 ρ = g ÷ (k₂ × c_s × W)(第352便i の lockGeom の ρ —— k₂ は f の値・符号は g の符号)。
// ■ 一緒に回る枠の 2 つの読み(どちらにも寄せない —— 列で並べる):
//   (A) 慣性の枠から写した読み: 一定の Ω_bg のまわりを輪が回るとき、輪と Ω_bg の両方が止まって見える枠は Ω̂_bg のまわりを g_輪 で回る枠。
//       その枠で受け手の合成 Ω(背景 + 輪に結び付いた局所の分)は止まっていて、枠の回転の軸は Ω̂_bg —— 第352便i の「合成の軸が回る形」の回る軸 = Ω̂_bg・傾き I = Ω と Ω̂_bg の角。
//       同じ係数(c_n = c_s・同じ f と σ)なら a = σ k₂ c_s (Ω − Ω_bg) = σ k₂ c_s × 局所の分 —— 背景の歳差は枠で消え、局所の分のまわりの歳差だけが残る。
//   (B) 枝のブリーフの読み: 輪と一緒に回る枠では、背景の向きは公転の法線 n̂ のまわりを傾き I = n̂ と Ω の角で回って見える(回る率 −g_輪)—— 回る軸 = n̂。
//   どちらも第352便i の lockPoints(P = { Om, W, n: 回る軸, g, k1, k2s })で止まる向き ŝ* を出し、傾き = ŝ* と n̂ の角を読む。
// ■ 係数の差の出どころ(T1 の 2 —— 応答の比 c の候補の式。入る量は公開の lib に在る数だけ —— 自転の率 ω・公転の率 n_orb・慣性の係数 C):
//   (P1) 第350便c の (S1) の読み: ω_T = ω_I + ŝ·Ω・ω_L = ω_I + ω_D(ω_D = ŝ·Ω)—— ω_T ÷ ω_L = 1(輪も自転軸も)。差 0。
//   (P2) 第350便c の (S2) の読み: ω_T = 姿勢の相対の回転角 ÷ Δt → √(ω² + abs(Ω⊥)²)(s2Closed)—— c = √(1 + (abs(Ω⊥) ÷ ω)²)。輪は ω を n_orb に。
//        差 c − 1 = x² ÷ (√(1 + x²) + 1)(x = abs(Ω⊥) ÷ ω —— 差で作らず直接に)。
//   (P3) 慣性の形の読み(候補 —— 統括の読みではない): トルクの式の慣性モーメントを一様な球 (2/5) m R²・角運動量を C m R² で数える —— 自転軸の c = 0.4 ÷ C・輪(質点の輪)は 1。
//   半径は (P1)(P2)(P3) のどれでも打ち消す(トルクと角運動量に同じ半径が入る)。
// ■ いまの角を保つ作用(T4): 一定の合成のもとで経路 ① は半頂角 θ を tan(θ/2) = tan(θ₀/2) e^(−k₁ c W t) で縮める。年齢の間に 10% より多く縮まない k₁ の上限 =
//   ln(tan(θ/2) ÷ tan(0.9 θ/2)) ÷ (c W t)。f の上限は (N1) の k₁(f) = f ÷ √((1 − f)² + f²) を逆に。保つ作用 A(一定の向きに押す率)で経路 ① を打ち消すには A = k₁ c W sin θ。
//   第352便e の fixedOffset(A = Ω_p sin θ*)は経路 ② の歳差 Ω_p と押す作用の釣り合いの式 —— 同じ A を Ω_p に対して読む列。
// ■ 言わないこと: 観測の傾き・公転面の由来の答えとは書かない。読み (A)(B)・(P1)〜(P3)・背景の向き・歳差の向き・基準軸のどれも選ばない。この場・この読み・このノブでは、の表。
import * as I from './lib-w352i-stableprec.mjs';
import * as LL from './lib-w352l-suntilt.mjs';
import * as D from './lib-w352d-precsense.mjs';
import * as RC from './lib-w352c-refaxis.mjs';
import * as SR from './lib-w352e-sunrecv.mjs';
import * as R3 from './lib-w351d-r3step.mjs';
import * as E from './lib-w347e-spintorque.mjs';
import * as TL from './lib-w337c-tidelock.mjs';
import * as SC from './lib-w330a-spinclass.mjs';
import * as CB from './lib-w348c-axisbalance.mjs';

export const LIB_VERSION = 'w352p-coprec-lib-1';
/** 呼ぶ lib の名前空間(器が同じ口を使う) */
export { I, LL };
const fin = (x) => typeof x === 'number' && Number.isFinite(x);
const D2R = Math.PI / 180;
const { dot, crs, nrm, scl, add, sub, unit } = R3.vec;
const isVec = (a) => Array.isArray(a) && a.length === 3 && a.every(fin);
export const angDeg = R3.angDeg;
export const YR = TL.YR;
export const ASYR = D.ASYR;

/* ───────── 宣言(走らせたノブの格子と判定の物差しの記録 —— 式の形の宣言ではない)───────── */
export const DECL = Object.freeze({
  senses: D.DECL.senses, norm: 'N1',
  bodies: Object.freeze(['Sun', 'Mercury', 'Venus', 'Earth', 'Mars', 'Jupiter', 'Saturn', 'Uranus', 'Neptune']),
  planets: D.DECL.planets,
  /** 背景の向き × 基準軸の列((N+) は L・eq・(G−) も基準軸を太陽の輪の法線に使う) */
  dirs: Object.freeze(['Gm', 'Np']), axes: Object.freeze(['L', 'eq']),
  /** 背景の大きさの列: (uV) 金星で (S) と大きさが同じ・倍率 1・(仮) 地球の歳差の率に届く大きさ(仮・未照合) */
  mags: Object.freeze(['uV', 'u1', 'uP']), uV: 1.19282e-12,
  omegaG: TL.GALAXY.omega, ageYr: LL.DECL.ageYr,
  /** 読み・係数の比の候補 */
  reads: Object.freeze(['A', 'B']), cands: Object.freeze(['P1', 'P2', 'P3']),
  /** 止まる向きの表の f(f 1 は k₂ 0 —— ρ が定まらないので表に置かない)・ρ の走査(片側 1e-3〜1e3・1 桁 20 点) */
  fs: Object.freeze([0, 0.5]), rhoPerDecade: 20,
  /** 太陽の輪(質点の輪 —— 木星の距離 —— 第352便l の DECL.ring と同じ) */
  sunRingAU: LL.DECL.ring.aAU, au: LL.DECL.au,
  /** 保つ作用の表: 縮む割合の上限 10%・受け手 */
  keepFrac: 0.1, keepBodies: Object.freeze(['Earth', 'Mars', 'Sun']),
  /** 輪の寄りの表: 初めの散らばり 30°・f_輪 の格子 */
  spread0Deg: 30, fRing: Object.freeze([1e-12, 1e-9, 1e-6, 1e-3, 0.5, 1]),
  /** 仮の値の鍵(第352便b の器 —— 表に入れる数はこれだけ) */
  provKeys: Object.freeze(['earth.psiA.rate']),
  floor: 1e-12, judge: '丸めの桁の床: 打ち消しで 0 になる量は尺度の 1e-12 倍以下を 0 と書く',
});

/* ───────── 天体の量(公開の lib の数だけ)───────── */
/** 受け手の自転の率 ω(rad/s —— 第347便e の t1Table・太陽は第337便c の BODY_SRC)・公転の率 n_orb(rad/s —— 第330便a の公転の日数・太陽は輪〔木星の距離〕の粒子の率)・
 *  慣性の係数 C(第337便c の BODY_SRC の C —— 無い天体は t1Table の I ÷ (m R²)・m と R は第348便c の massOf・radiusOf)と、その出どころ */
export function bodyNums(id) {
  const B = TL.BODY_SRC[id];
  if (id === 'Sun') {
    const a = DECL.sunRingAU * DECL.au;
    return { id, w: 2 * Math.PI / B.spin[0], C: B.C[0], cSrc: 'BODY_SRC', nOrb: Math.sqrt(TL.G_SI * B.M[0] / (a * a * a)) };
  }
  const r = E.t1Table().find((x) => x.id === id && x.src === 'Sun' && x.mag === 'm2'), days = SC.DECL.lit.orbitDays[id.toLowerCase()];
  if (!r || !fin(days)) throw new RangeError('bodyNums: 天体 ' + id);
  const hasC = !!(B && B.C), C = hasC ? B.C[0] : r.I / (CB.massOf(id) * CB.radiusOf(id) ** 2);
  return { id, w: Math.abs(r.omega), C, cSrc: hasC ? 'BODY_SRC' : 'I/(mR²)', nOrb: 2 * Math.PI / (days * 86400) };
}
/** √(1 + x²) − 1 を差で作らずに */
export const s2Excess = (x) => (x * x) / (Math.sqrt(1 + x * x) + 1);
/**
 * 応答の比の候補(T1 の 2)。perpS・perpN = 自転軸・輪の法線に直交する合成の大きさ(rad/s)。
 * 返す { cs, cn, dSpin(c_s − 1), dRing(c_n − 1), ratio(c_n ÷ c_s), rel(c_s ÷ c_n − 1 —— 係数の差) }
 */
export function coefCand(cand, { w, nOrb, C, perpS = 0, perpN = 0 }) {
  if (!DECL.cands.includes(cand)) throw new RangeError('coefCand: 候補は P1・P2・P3');
  if (cand === 'P1') return { cand, cs: 1, cn: 1, dSpin: 0, dRing: 0, ratio: 1, rel: 0 };
  if (cand === 'P2') {
    if (!(fin(w) && w > 0 && fin(nOrb) && nOrb > 0 && fin(perpS) && perpS >= 0 && fin(perpN) && perpN >= 0)) throw new RangeError('coefCand P2: ω > 0・n_orb > 0・abs(Ω⊥) ≥ 0');
    const ds = s2Excess(perpS / w), dn = s2Excess(perpN / nOrb);
    // c_s ÷ c_n − 1 = (ds − dn) ÷ (1 + dn)(差の 2 つはどちらも直接に数えた小さい数)
    return { cand, cs: 1 + ds, cn: 1 + dn, dSpin: ds, dRing: dn, ratio: (1 + dn) / (1 + ds), rel: (ds - dn) / (1 + dn) };
  }
  if (!(fin(C) && C > 0)) throw new RangeError('coefCand P3: C > 0');
  const cs = 0.4 / C;
  return { cand, cs, cn: 1, dSpin: cs - 1, dRing: 0, ratio: 1 / cs, rel: cs - 1 };
}

/* ───────── g_輪 と ρ(T1 の 1)───────── */
/** 輪の回る率(右ねじで Ω̂_bg のまわりに正 —— rad/s) */
export function gRing({ Wbg, fRing = 0, sense, cn = 1 }) {
  if (!(fin(Wbg) && Wbg >= 0 && fin(cn) && cn >= 0)) throw new RangeError('gRing: W_bg ≥ 0・c_n ≥ 0');
  const k = I.kOf(fRing, sense);
  return k.k2s * cn * Wbg;
}
/** 比 ρ = g ÷ (k₂ c_s W)(k₂ 0 なら g ÷ (c_s W)) */
export function rhoOf({ g, W, f, sense, cs = 1 }) {
  const k = I.kOf(f, sense), d = (k.k2 > 0 ? k.k2 : 1) * cs * W;
  if (!(d > 0)) throw new RangeError('rhoOf: k₂ c_s W > 0');
  return g / d;
}
/**
 * 止まる向き(読み A・B 共通の口): Om = 受け手の合成(rad/s か無次元)・nRot = 枠の回る軸・nRing = 輪の法線・rho・f・σ・c_s。
 * 引き込む点(f > 0 —— λ > 0 の枝)か中立の点(f 0 —— 第352便i の lockPoints の 'n+' = Ω̂ の側の ± â)の { s, oblDeg(ŝ* と n̂ の角), halfDeg(ŝ* と回る軸の角), lagDeg(ŝ* と Ω̂ の角), lam, resid }
 */
export function lockObl({ Om, nRot, nRing, rho, f, sense, cs = 1 }) {
  if (!(isVec(Om) && nrm(Om) > 0 && isVec(nRot) && nrm(nRot) > 0 && isVec(nRing) && nrm(nRing) > 0 && fin(rho) && fin(cs) && cs > 0)) throw new RangeError('lockObl: Ω・回る軸・輪の法線・ρ・c_s');
  const k = I.kOf(f, sense), W = nrm(Om), g = rho * (k.k2 > 0 ? k.k2 : 1) * cs * W;
  const P = { Om: unit(Om), W, n: unit(nRot), g, k1: k.k1 * cs, k2s: k.k2s * cs };
  const L = I.lockPoints(P), p = L.pts[0];
  if (!p) return { ok: false, rho, f, sense };
  return { ok: true, neutral: L.neutral, s: p.s, lam: p.lam, oblDeg: angDeg(p.s, nRing), halfDeg: angDeg(p.s, nRot), lagDeg: angDeg(p.s, Om),
    resid: nrm(I.flowRot(p.s, P)) / Math.max(1e-300, nrm(I.aOf(P).a) + I.aOf(P).b), g };
}
/** ρ を片側 1e-3〜1e3 で走らせて傾きが目標になる根(両方の符号)と傾きの最大・最小 */
export function rhoScan({ Om, nRot, nRing, f, sense, cs = 1, targetDeg = null, perDecade = DECL.rhoPerDecade }) {
  const roots = []; let mx = -Infinity, mn = Infinity, rMx = null, rMn = null;
  for (const sg of [1, -1]) {
    const N = 6 * perDecade, xs = Array.from({ length: N + 1 }, (_, i) => -3 + 6 * i / N);
    const F = (lx) => { const r = lockObl({ Om, nRot, nRing, rho: sg * 10 ** lx, f, sense, cs }); return r.ok ? r.oblDeg : NaN; };
    let pa = F(xs[0]);
    for (let i = 0; i < xs.length; i++) {
      const v = i === 0 ? pa : F(xs[i]);
      if (fin(v)) { if (v > mx) { mx = v; rMx = sg * 10 ** xs[i]; } if (v < mn) { mn = v; rMn = sg * 10 ** xs[i]; } }
      if (i > 0 && targetDeg !== null && fin(pa) && fin(v) && (pa - targetDeg) * (v - targetDeg) < 0) {
        let lo = xs[i - 1], hi = xs[i], flo = pa - targetDeg;
        for (let it = 0; it < 60; it++) { const m = (lo + hi) / 2, fm = F(m) - targetDeg; if (flo * fm <= 0) hi = m; else { lo = m; flo = fm; } }
        const rho = sg * 10 ** ((lo + hi) / 2), r = lockObl({ Om, nRot, nRing, rho, f, sense, cs });
        roots.push({ rho, oblDeg: r.oblDeg, lam: r.lam });
      }
      pa = v;
    }
  }
  return { roots, maxDeg: mx, minDeg: mn, rhoAtMax: rMx, rhoAtMin: rMn };
}

/* ───────── 読み A を打ち消しなしで(a を局所の分と係数の差から直接に)───────── */
/**
 * 第352便i の lockPoints と同じ閉じた形を、a・b・Ω̂ を直接に受けて解く(読み A の a = σ k₂ c_s (局所 − δ Ω_bg) は大きい数の差で作らない)。
 * 返す { pts: [{ s, lam, branch }], neutral }(lockPoints と同じ形 —— 零試験で照合)
 */
export function lockFromA(a, b, oh) {
  if (!(isVec(a) && isVec(oh) && nrm(oh) > 0 && fin(b) && b >= 0)) throw new RangeError('lockFromA: a・b ≥ 0・Ω̂');
  const o = unit(oh), aa = dot(a, a), ao = dot(a, o);
  if (b === 0) {
    if (!(aa > 0)) return { pts: [], neutral: true };
    const ah = unit(a), sg = dot(ah, o) >= 0 ? 1 : -1;
    return { pts: [{ s: scl(ah, sg), lam: 0, branch: 'n+' }, { s: scl(ah, -sg), lam: 0, branch: 'n-' }], neutral: true };
  }
  const B = aa - b * b, Cc = b * b * ao * ao, q = Math.sqrt(B * B + 4 * Cc);
  const x = B >= 0 ? (q + B > 0 ? 2 * Cc / (B + q) : 0) : (-B + q) / 2, pts = [];
  for (const sg of [1, -1]) {
    const lam = sg * Math.sqrt(x);
    if (!(Math.abs(lam) > 0)) continue;
    const v = add(add(scl(o, lam * lam), scl(crs(a, o), lam)), scl(a, ao));
    pts.push({ s: unit(scl(v, b / (lam * (lam * lam + aa)))), lam, branch: sg > 0 ? '+' : '-' });
  }
  return { pts, neutral: false };
}
/** 一緒に回る枠の流れ(a・b・Ω̂ を直接に) */
export const flowA = (s, a, b, oh) => { const u = unit(s), o = unit(oh); return add(scl(sub(o, scl(u, dot(u, o))), b), crs(a, u)); };
/**
 * 読み A(回る軸 = Ω̂_bg)の止まる向き —— δ = c_n ÷ c_s − 1(輪の係数の比の差)。a = σ k₂ c_s (局所 − δ Ω_bg)・b = k₁ c_s W・Ω̂ = (Ω_bg + 局所) の向き。
 * f > 0: 引き込む点の傾き。f 0: 中立 —— 自転軸は â のまわりの円錐を保つ: 円錐の半頂角 κ = ŝ と â の角・傾きの範囲 [abs(κ − α), min(κ + α, 360° − κ − α)](α = â と n̂ の角)・
 * 枠の中の歳差の率 abs(a)(rad/s)。
 */
export function lockA({ bg, loc, sHat, nRing, delta = 0, f, sense, cs = 1 }) {
  if (!(isVec(bg) && nrm(bg) > 0 && isVec(loc) && isVec(sHat) && isVec(nRing) && fin(delta) && fin(cs) && cs > 0)) throw new RangeError('lockA: 背景・局所・ŝ・n̂・δ・c_s');
  const k = I.kOf(f, sense), Om = add(bg, loc), W = nrm(Om);
  const a = scl(sub(loc, scl(bg, delta)), k.k2s * cs), b = k.k1 * cs * W, L = lockFromA(a, b, Om), p = L.pts[0];
  const out = { f, sense, delta, aRate: nrm(a), b, neutral: L.neutral, ok: !!p };
  if (!p) return out;
  out.s = p.s; out.lam = p.lam; out.oblDeg = angDeg(p.s, nRing); out.resid = nrm(flowA(p.s, a, b, Om)) / Math.max(1e-300, nrm(a) + b);
  if (L.neutral) {
    const kap = angDeg(sHat, p.s), al = angDeg(p.s, nRing);
    out.coneDeg = kap; out.alphaDeg = al; out.oblMinDeg = Math.abs(kap - al); out.oblMaxDeg = Math.min(kap + al, 360 - kap - al);
  }
  return out;
}
/** 読み A で δ を走らせて(f > 0)引き込む点の傾きが目標になる根(δ の両方の符号・abs(δ) 1e-16〜1e3・1 桁 10 点) */
export function deltaScan({ bg, loc, sHat, nRing, f, sense, targetDeg, perDecade = 10 }) {
  const roots = []; let mx = -Infinity, mn = Infinity;
  const F = (d) => { const r = lockA({ bg, loc, sHat, nRing, delta: d, f, sense }); return r.ok ? r.oblDeg : NaN; };
  const pts = [0];
  for (const sg of [-1, 1]) for (let i = 0; i <= 19 * perDecade; i++) pts.push(sg * 10 ** (-16 + i / perDecade));
  pts.sort((x, y) => x - y);
  let pd = pts[0], pv = F(pd);
  for (let i = 0; i < pts.length; i++) {
    const d = pts[i], v = i === 0 ? pv : F(d);
    if (fin(v)) { mx = Math.max(mx, v); mn = Math.min(mn, v); }
    if (i > 0 && fin(pv) && fin(v) && (pv - targetDeg) * (v - targetDeg) < 0) {
      let lo = pd, hi = d, flo = pv - targetDeg;
      for (let it = 0; it < 80; it++) { const m = (lo + hi) / 2, fm = F(m) - targetDeg; if (flo * fm <= 0) hi = m; else { lo = m; flo = fm; } }
      roots.push({ delta: (lo + hi) / 2, oblDeg: F((lo + hi) / 2) });
    }
    pd = d; pv = v;
  }
  return { roots, maxDeg: mx, minDeg: mn };
}

/* ───────── 天体の状態(合成・輪の法線・背景)───────── */
const aU = (T1, GEO, cache) => (cache && cache.uV) || (cache ? (cache.uV = D.uVenus(T1, GEO, { part: 'S' }, cache)) : D.uVenus(T1, GEO, { part: 'S' }));
/** 背景の倍率(mag 'uV'・'u1'・'uP' —— uP は仮の値 earth.psiA.rate の率に k₂ c 1 で届く倍率: 率 ÷ ω_G) */
export function uOf(mag, T1, GEO, cache = null, provRate = null) {
  if (mag === 'uV') return aU(T1, GEO, cache);
  if (mag === 'u1') return 1;
  if (mag === 'uP') { if (!(fin(provRate) && provRate > 0)) throw new RangeError('uOf uP: 仮の値の率(″/年 > 0)'); return provRate / ASYR / DECL.omegaG; }
  throw new RangeError('uOf: 大きさは uV・u1・uP');
}
/**
 * 受け手 id の状態: 背景 dir(Gm・Np)・基準軸 axis(L・eq)・倍率 u。太陽は背景だけ(局所 0)・輪の法線 = 基準軸。惑星の輪の法線 = 自分の公転の法線。
 */
export function stateOf(T1, GEO, id, { dir, axis, u }, cache = null) {
  const A = RC.refAxes(T1, GEO), ax = A[axis];
  if (!ax) throw new RangeError('stateOf: 基準軸は L・eq');
  const R = D.rowOf(T1, GEO, id, { bg: dir, sense: 'g2p', u, part: 'S', axis: ax }, cache);
  const nRing = id === 'Sun' ? unit(ax) : R.nHat, bg = R.bgVec, Om = R.Om;
  return { id, dir, axis, u, sHat: R.sHat, nRing, bg, Wbg: nrm(bg), Om, W: nrm(Om), local: R.local, locOverBg: nrm(R.local) / nrm(bg),
    oblNowDeg: angDeg(R.sHat, nRing), thNowDeg: angDeg(R.sHat, Om), Ibg: angDeg(nRing, bg), Iom: angDeg(Om, bg) };
}
/** 読み A・B の回る軸と、係数の比 c_n ÷ c_s のときの式の ρ(同じ f・同じ σ —— A: σ (c_n/c_s)(W_bg/W)・B: その符号を逆) */
export function rhoFormula(st, { read, f, sense, ratio = 1 }) {
  if (!DECL.reads.includes(read)) throw new RangeError('rhoFormula: 読みは A・B');
  const g = gRing({ Wbg: st.Wbg, fRing: f, sense, cn: ratio }), rho = rhoOf({ g, W: st.W, f, sense, cs: 1 });
  return { nRot: read === 'A' ? unit(st.bg) : st.nRing, rho: read === 'A' ? rho : -rho };
}

/* ───────── 開く角の要る大きさ(第352便l の候補 (b) と同じ考え —— 経路 ② だけ)───────── */
/** 初めにそろった輪の法線と自転軸(Ω̂ との角 θ)が、係数の差 rel で年齢の間に γ 開くのに要る背景の大きさ W(rad/s)—— 届かなければ null */
export function wReqOpen({ thDeg, gammaDeg, rel, k2 = 1, ageYr = DECL.ageYr }) {
  const dphi = LL.dphiFor({ thDeg, gammaDeg });
  if (dphi === null || !(Math.abs(rel) > 0)) return null;
  return dphi / (Math.abs(rel) * k2 * ageYr * YR);
}
/** l の deltaReq(要る係数の差)と同じ式: Δφ ÷ (k₂ W t) */
export function deltaReq({ thDeg, gammaDeg, W, k2 = 1, ageYr = DECL.ageYr }) { const dphi = LL.dphiFor({ thDeg, gammaDeg }); return dphi === null ? null : dphi / (k2 * W * ageYr * YR); }
/** (P2) の差は大きさに依る(rel ∝ W²)—— 年齢の間に γ 開く W を対数の二分で(1e-30〜1e0 rad/s)。perp の係数 sS = sin(ŝ, Ω)・sN = sin(n̂, Ω) */
export function wReqP2({ thDeg, gammaDeg, w, nOrb, sS, sN, ageYr = DECL.ageYr }) {
  const dphi = LL.dphiFor({ thDeg, gammaDeg });
  if (dphi === null) return null;
  const F = (W) => Math.abs(coefCand('P2', { w, nOrb, perpS: W * sS, perpN: W * sN }).rel) * W * ageYr * YR - dphi;
  let lo = -30, hi = 0; if (F(10 ** hi) < 0) return null;
  for (let i = 0; i < 200; i++) { const m = (lo + hi) / 2; if (F(10 ** m) < 0) lo = m; else hi = m; }
  return 10 ** ((lo + hi) / 2);
}

/* ───────── 保つ作用と f の上限(T4)───────── */
/** (N1) の k₁(f) を逆に(0 ≤ k₁ ≤ 1) */
export function fOfK1(k1) {
  if (!(fin(k1) && k1 >= 0)) throw new RangeError('fOfK1: k₁ ≥ 0');
  if (k1 >= 1) return 1;
  let lo = 0, hi = 1;
  for (let i = 0; i < 200; i++) { const m = (lo + hi) / 2; if (R3.r3Coeffs(m, 'N1').kTilt < k1) lo = m; else hi = m; }
  return (lo + hi) / 2;
}
/** 年齢の間に半頂角 θ が割合 frac より多く縮まない k₁ の上限と f の上限(c 1) */
export function fMax({ thDeg, W, frac = DECL.keepFrac, ageYr = DECL.ageYr, c = 1 }) {
  if (!(fin(thDeg) && thDeg > 0 && thDeg < 180 && fin(W) && W > 0)) throw new RangeError('fMax: 0 < θ < 180・W > 0');
  const th = thDeg * D2R, x = Math.log(Math.tan(th / 2) / Math.tan((1 - frac) * th / 2)), k1 = x / (c * W * ageYr * YR);
  return { x, k1Max: k1, fMax: fOfK1(k1), Akeep: (f) => R3.r3Coeffs(f, 'N1').kTilt * c * W * Math.sin(th) };
}
/** 経路 ① を打ち消す押す作用 A(rad/s)と、それを第352便e の fixedOffset で歳差 Ω_p に対して読んだ止まる点の角 */
export function keepA({ f, thDeg, W, Op = null }) {
  const A = R3.r3Coeffs(f, 'N1').kTilt * W * Math.sin(thDeg * D2R);
  const fo = Op && A <= Op ? SR.fixedOffset({ A, Op }).thDeg : null;
  return { A, thFixedDeg: fo };
}

/* ───────── 輪の法線が経路 ① で寄る角(T5)───────── */
/** 初めの角 θ₀(輪の法線と合成の軸)が年齢の間に何度になるか(第352便i の thAfter —— (α))・k₁ は f_輪 の値 */
export function ringAfter({ th0Deg = DECL.spread0Deg, W, fRing, ageYr = DECL.ageYr }) {
  const r = I.thAfter({ thDeg: th0Deg, W, f: fRing, sense: 'g2p', tYr: ageYr });
  return { thDeg: r.alpha, dropDeg: r.dropDeg, kwt: r.kwt };
}
/** 年齢の間に θ₀ が目標 θ 以下になる f_輪 の下限(W ごと) */
export function fRingFor({ th0Deg = DECL.spread0Deg, targetDeg, W, ageYr = DECL.ageYr }) {
  if (!(targetDeg > 0 && targetDeg < th0Deg)) throw new RangeError('fRingFor: 0 < 目標 < θ₀');
  const x = Math.log(Math.tan(th0Deg * D2R / 2) / Math.tan(targetDeg * D2R / 2)), k1 = x / (W * ageYr * YR);
  return { k1, f: k1 >= 1 ? null : fOfK1(k1) };
}

/* ───────── 零試験 ───────── */
/** 第352便l の正本の数(表 b の (G−)・倍率 1・f 0 の要る係数の差 —— 4 桁)と第352便i の地球の根(I 30°・f 0.5・(g2+)) */
export const ANCHOR = Object.freeze({ lDeltaReq: Object.freeze({ L: 9.166e-4, eq: 7.999e-4 }), iEarthI30: Object.freeze([2.40, -0.524]) });
export function pureScenes(T1 = E.t1Table(), GEO = E.geometry()) {
  const th = (a, ph = 0) => [Math.sin(a * D2R) * Math.cos(ph), Math.sin(a * D2R) * Math.sin(ph), Math.cos(a * D2R)];
  // ① 輪と自転軸の係数が同じなら共回り(角は不変 —— 第352便l の twoAxisStep・経路 ② だけ・どの初めの向きでも・両方の歳差の向き)
  const Om = [0.2, -0.3, 0.93], n0 = th(25), s0 = th(48, 1.1);
  const corot = D.DECL.senses.map((sense) => { const c = LL.axisCoef(0, { sense, ratio: 1.7 }), r = LL.twoAxisStep({ n0, s0, om: Om, T: 11, steps: 40, ring: c, spin: c, track: true });
    return Math.max(Math.abs(r.gammaMaxDeg - angDeg(n0, s0)), Math.abs(r.gammaMinDeg - angDeg(n0, s0))); });
  // ①′ 同じ係数・読み A で局所 0: a = 0 の向き —— 止まる点は Ω̂(f > 0)・ρ の式は σ(W_bg/W = 1)
  const stA = { bg: [0, 0, 2], Wbg: 2, W: 2, nRing: th(30) };
  const fA = DECL.senses.map((sense) => { const rf = rhoFormula(stA, { read: 'A', f: 0.5, sense }), lo = lockObl({ Om: [0, 0, 2], nRot: rf.nRot, nRing: stA.nRing, rho: rf.rho, f: 0.5, sense });
    return { rho: rf.rho, ax: nrm(sub(lo.s, [0, 0, 1])), obl: Math.abs(lo.oblDeg - 30) }; });
  // ①″ 同じ係数・読み A・局所が在るとき a = σ k₂ (Ω − Ω_bg)(背景の歳差は枠で消える)—— f 0 の中立の点は ± 局所の向き
  const loc = [0.05, 0.02, -0.01], OmL = add([0, 0, 2], loc), stL = { bg: [0, 0, 2], Wbg: 2, W: nrm(OmL), nRing: th(30) };
  const neuL = DECL.senses.map((sense) => { const rf = rhoFormula(stL, { read: 'A', f: 0, sense }), lo = lockObl({ Om: OmL, nRot: rf.nRot, nRing: stL.nRing, rho: rf.rho, f: 0, sense });
    return Math.abs(Math.abs(dot(lo.s, unit(loc))) - 1); });
  // ② g 0 で第352便i の一定の軸の形に戻る: 止まる点 = Ω̂・戻りの率 = k₁ W(judgeConst の θ 0)
  const g0 = DECL.senses.map((sense) => { const lo = lockObl({ Om: [0.3, -0.4, 0.8], nRot: [0, 0, 1], nRing: [0, 0, 1], rho: 0, f: 0.5, sense }), k = I.kOf(0.5, sense), W = nrm([0.3, -0.4, 0.8]);
    return { ax: nrm(sub(lo.s, unit([0.3, -0.4, 0.8]))), lam: Math.abs(lo.lam - I.judgeConst({ thDeg: 0, W, f: 0.5, sense }).returnRate), k1W: Math.abs(lo.lam - k.k1 * W) }; });
  // ②′ 読み B の無次元の形は第352便i の lockGeom と同じ(I 30°・ρ 2.4・f 0.5・(g2+))
  const lgI = I.lockGeom({ IDeg: 30, rho: 2.4, f: 0.5, sense: 'g2p' }), Ib = 30 * D2R;
  const loB = lockObl({ Om: [Math.sin(Ib), 0, Math.cos(Ib)], nRot: [0, 0, 1], nRing: [0, 0, 1], rho: 2.4, f: 0.5, sense: 'g2p' });
  const sameI = Math.abs(loB.oblDeg - lgI.halfDeg) + nrm(sub(loB.s, lgI.s));
  // ③ 第352便l の表の数(係数の差 0.1% の桁で 5.968°): (G−)・倍率 1・基準軸 L・eq・f 0 の要る係数の差を本 lib の式で作り直す
  const A = RC.refAxes(T1, GEO), Gm = D.bgDir('Gm'), W1 = nrm(D.bgVec('Gm', { u: 1 }));
  const lRe = { L: deltaReq({ thDeg: angDeg(A.L, Gm), gammaDeg: 5.968, W: W1 }), eq: deltaReq({ thDeg: angDeg(A.eq, Gm), gammaDeg: 5.230, W: W1 }) };
  // ③′ 要る背景の大きさ wReqOpen は deltaReq を逆に(rel = deltaReq(W) のとき W)
  const wBack = Math.abs(wReqOpen({ thDeg: angDeg(A.L, Gm), gammaDeg: 5.968, rel: lRe.L }) / W1 - 1);
  // ④ (P2) の差を直接に: 小さい x で s2Excess = x²/2 の桁・大きい x で √(1 + x²) − 1 と同じ
  const p2 = { small: Math.abs(s2Excess(1e-12) / 5e-25 - 1), big: Math.abs(s2Excess(3) - (Math.sqrt(10) - 1)), zero: coefCand('P2', { w: 1, nOrb: 1, perpS: 0, perpN: 0 }).rel };
  // ⑤ f の上限: k₁ の上限で年齢の間に縮む割合が 10%(第352便i の thAfter)・fOfK1 は r3Coeffs の逆
  const fm = fMax({ thDeg: 23.44, W: 1e-12 }), ta = I.thAfter({ thDeg: 23.44, W: 1e-12, f: fm.fMax, sense: 'g2p', tYr: DECL.ageYr });
  const fInv = Math.abs(R3.r3Coeffs(fOfK1(0.37), 'N1').kTilt - 0.37);
  // ⑥ 保つ作用 A を押す作用として第352便e の tiltPrecStep で: 経路 ① なしの歳差 Ω_p と A の止まる点の角 = fixedOffset
  const ka = keepA({ f: 0.2, thDeg: 10, W: 1, Op: 3 }), fp = SR.fixedPoint({ p: [0, 0, 1], e: [1, 0, 0], Op: 3, A: ka.A });
  const kaErr = Math.abs(angDeg(fp, [0, 0, 1]) - ka.thFixedDeg);
  // ⑦ 輪の寄り: f_輪 の下限で年齢の後に目標の角
  const rf = fRingFor({ targetDeg: 7, W: 1e-14 }), ra = ringAfter({ W: 1e-14, fRing: rf.f });
  // ⑧ 第352便i の地球の根(I 30°・f 0.5・(g2+)・目標 23.44 —— 読み B の rhoScan で同じ根)
  const sc = rhoScan({ Om: [Math.sin(Ib), 0, Math.cos(Ib)], nRot: [0, 0, 1], nRing: [0, 0, 1], f: 0.5, sense: 'g2p', targetDeg: 23.4392911 });
  // ⑨ lockFromA は第352便i の lockPoints と同じ(打ち消しの無い一般の入力 —— 向きの読み 2 × f 3 × ρ 3)・読み A の lockA は ρ を経た lockObl と同じ(局所が大きい入力)
  let fromErr = 0, aErr = 0;
  for (const sense of DECL.senses) for (const f of [0, 0.4, 0.9]) {
    for (const rho of [-2, 0.3, 4]) { const k = I.kOf(f, sense), P = { Om: [0.3, 0.1, 0.9], W: 1.3, n: [0.2, -0.5, 0.8], g: rho * (k.k2 > 0 ? k.k2 : 1), k1: k.k1, k2s: k.k2s }, Q = I.aOf(P);
      const p1 = I.lockPoints(P).pts, p2 = lockFromA(Q.a, Q.b, P.Om).pts; fromErr = Math.max(fromErr, ...p1.map((p, i) => nrm(sub(p.s, p2[i].s)) + Math.abs(p.lam - p2[i].lam))); }
    if (f > 0) { const bg = [0, 0, 1], lc = [0.3, -0.2, 0.1], dl = 0.25, st = { bg, Wbg: 1, W: nrm(add(bg, lc)), nRing: th(20) }, rf = rhoFormula(st, { read: 'A', f, sense, ratio: 1 + dl });
      const o1 = lockObl({ Om: add(bg, lc), nRot: rf.nRot, nRing: st.nRing, rho: rf.rho, f, sense }), o2 = lockA({ bg, loc: lc, sHat: th(30), nRing: st.nRing, delta: dl, f, sense });
      aErr = Math.max(aErr, nrm(sub(o1.s, o2.s)), Math.abs(o1.oblDeg - o2.oblDeg)); }
  }
  // 拒否
  const rej = [() => coefCand('P4', {}), () => coefCand('P3', { C: 0 }), () => gRing({ Wbg: -1, sense: 'g2p' }), () => lockObl({ Om: [0, 0, 0], nRot: [0, 0, 1], nRing: [0, 0, 1], rho: 1, f: 0.5, sense: 'g2p' }),
    () => rhoFormula(stA, { read: 'C', f: 0, sense: 'g2p' }), () => uOf('uX'), () => fMax({ thDeg: 0, W: 1 }), () => fRingFor({ targetDeg: 40, W: 1 })]
    .map((fn) => { try { fn(); return false; } catch (e) { return e instanceof RangeError; } });
  return { corot, fA, neuL, g0, sameI, lRe, wBack, p2, fm: { fMax: fm.fMax, drop: ta.dropDeg / 23.44 }, fInv, kaErr, ring: { f: rf.f, th: ra.thDeg }, scRoots: sc.roots.map((r) => r.rho), fromErr, aErr, rejects: rej };
}
export function pureGates(S) {
  const near = (a, b, t) => Math.abs(a / b - 1) <= t;
  return {
    corotSame: S.corot.length === 2 && S.corot.every((x) => x < 1e-9),
    readAlocal0: S.fA.length === 2 && S.fA[0].rho > 0 && S.fA[1].rho < 0 && S.fA.every((x) => Math.abs(Math.abs(x.rho) - 1) < 1e-12 && x.ax < 1e-12 && x.obl < 1e-9),
    readAlocalOnly: S.neuL.every((x) => x < 1e-12),
    g0IsConst: S.g0.every((x) => x.ax < 1e-12 && x.lam < 1e-12 && x.k1W < 1e-12),
    readBisLockGeom: S.sameI < 1e-12,
    lTable: near(S.lRe.L, ANCHOR.lDeltaReq.L, 1e-3) && near(S.lRe.eq, ANCHOR.lDeltaReq.eq, 1e-3) && S.wBack < 1e-12,
    p2Direct: S.p2.small < 1e-12 && S.p2.big < 1e-12 && S.p2.zero === 0,
    fMaxDrop: Math.abs(S.fm.drop - 0.1) < 1e-9 && S.fm.fMax > 0 && S.fInv < 1e-12,
    keepFixed: S.kaErr < 1e-9,
    ringFor: Math.abs(S.ring.th - 7) < 1e-9,
    iRoots: S.scRoots.length >= 2 && ANCHOR.iEarthI30.every((r) => S.scRoots.some((x) => near(x, r, 5e-3))),
    lockFromA: S.fromErr < 1e-12 && S.aErr < 1e-9,
    rejects: S.rejects.length === 8 && S.rejects.every(Boolean),
  };
}
