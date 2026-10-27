// 第317便b(原仮定者の決断事項 AN431「G_loc が n = 2・1・0 それぞれの場合も対象とする。K1 に決め切らず、K2 も調査する」・統括の検証項目 R251):
// **衛星の物理の軸(G_loc の n × 引きずりの核)の変種の本の作り手**(純関数 —— html を読まない。器 tests/exp-w317b-satn.mjs が使う)。
//
// ■ 何をするか
//   ・本の写しは第315便d の lib tests/lib-w315d-satk1.mjs の bookOf の出力(同じ本・同じ種・同じ刻み —— lib の関数と版は変えない)を写して、
//     **G_loc と relativeDrag と天体の dragCore だけを差し替える**(variantBook)。n = 2 の K1-rule は bookOf の出力そのまま(第316便d と同じ本)。
//   ・G_loc(既存の law —— 新しい law は足さない): n = 2 {law:"kappaC2"}・n = 1 {law:"cRatio"}・n = 0 {law:"cLocPow", n:0}。q10 と q11 は同じ n。
//   ・核の行(KERNEL_ROWS —— 走行の前に宣言・結果を見て変えない):
//       K1-rule  = 第315便d の q11 そのもの(invSq:{outerShell:"uniform", kernel:"k1", rdRule:"kappaM"} —— 全天体 R_d = Y_k m・Y_k = 10G_0/(C_1c_0²))
//       K1-Y(n)  = K1 の明示の dragCore(各天体 dragCore:{massFrac:1, radius: Y_k(n)·m}・m はエンジンが使う質量)。Y_k(n) = (6+2n)G_0/(C_1c_0²) は
//                  **固定中心・試験粒子・弱場の一次からの候補**(n = 2 で Y_k に戻る —— 二体の器で確かめる候補・普遍則として採らない)。
//                  n = 2 の行は K1-rule の行とビット同一のはず(規則の鍵と明示の dragCore で同じ半径 —— 第313便の照合の型・器の門)。
//       K2(既定の核 —— kernel を書かない。rdRule は K1 の本だけ受理されるので全天体に明示の dragCore):
//         (i)   同じ半径 R_d = Y_k m(α = 1 —— n = 2)
//         (ii)  倍率の掃引 R_d = α·Y_k m(α = 10⁴・10⁶ —— 効きが α² で伸びるか。n による違いは α = 10⁶ で n = 2・1・0。観測半径を超える R_d は受理されて
//               警告が付くだけ〔第314便〕)。点の選び方: K2 の並進の割合は受け手の自己の場の分母が m_i/R_d,i² なので β ∝ R_d,i R_d,j/r²(K1 は m_i/R_d,i で
//               β ∝ R_d,j/r —— K2/K1 ≈ R_d,i/a)。衛星の R_d = Y_k m は 10⁻³ m の桁で a は 10⁸〜10⁹ m なので (i) の効きは K1 の 10⁻¹² の桁 —— α² で伸びれば
//               α = 10⁶ で K1 の桁に届く(試走 4 公転の (iii) の効きの桁 2e-2″/世紀〔イオ〕がこの見積りと同じ桁であることを走行の前に確かめた)
//         (iii) 質量の依存の型 R_d = Y_k √(m_☉ m)(n = 2 —— 規格の点は太陽: 太陽で K1-rule と同じ半径・m_☉ は凍結の写しの太陽のエンジンが使う質量。二体の本にも同じ m_☉)
//       外殻と自転の引きずりは第315便d の q11 と同じ(outerShell:"uniform"・spinDrag あり・initMotion "observed")—— massFrac = 1 なので外殻の質量は 0。
//       **在位の惑星 7 本と同じ並進だけの形は枝 c の変種**(b は足さない)。
//   ・二体の解析の一次の率(refsN): q_1PN = 6πG(M+m)/(c²a(1−e²))/周(第315便d の refsOf と同じ式)・G_loc の一次 −2nπμ_eff/(c²a(1−e²))/周
//     (μ_eff = G(m₁² + m₂²)/(m₁ + m₂) —— n = 2 で第315便d の gLocAnalytic と同じ式)・K1 の引きずりの一次 (C_1c_0²Y/G_0)·πG(M+m)/(c_0²a(1−e²))/周
//     (Y = Y_k で 10π —— 候補の式 Y_k(n) と同じ導き。K2 の解析の一次は置かない)。
//
// ■ 言わないこと: 候補 Y_k(n) を普遍則と書かない・「法則を確かめた」「フィットした」「較正した」と書かない・近似要素の種を観測レコードと呼ばない・観測の 3σ を付けない。
import * as L from './lib-w315d-satk1.mjs';
export const LIB_VERSION = 'w317b-satn-lib-1';
const clone = (x) => JSON.parse(JSON.stringify(x));
/** G_loc の n(既存の law —— 新しい law は足さない) */
export const NS = Object.freeze([2, 1, 0]);
export const GLOC_N = Object.freeze({ 2: Object.freeze({ law: 'kappaC2' }), 1: Object.freeze({ law: 'cRatio' }), 0: Object.freeze({ law: 'cLocPow', n: 0 }) });
export const glocOf = (n) => { const g = GLOC_N[n]; if (!g) throw new Error('G_loc の n は 2・1・0 だけ: ' + n); return clone(g); };
/** 候補 Y_k(n) の係数 6 + 2n(n = 2 で 10 —— Y_k と同じ) */
export const ykCoef = (n) => 6 + 2 * n;
/** Y_k(n) = (6+2n)G_0/(C_1c_0²)(本の単位 —— n = 2 は html の invSqKappa0 と同じ演算の順 (10·G)/(C_1·c·c)) */
export const ykN = (ph, n) => (ykCoef(n) * ph.G) / (L.C1 * ph.cLight * ph.cLight);
/** 核の行(走行の前に宣言 —— 結果を見て変えない)。ns = 走らせる n・gateN2 = n = 2 は門の 1 本(h だけ —— K1-rule とビット同一のはず) */
export const KERNEL_ROWS = Object.freeze([
  Object.freeze({ key: 'k1rule', kernel: 'k1', radius: 'rule', ns: Object.freeze([2, 1, 0]), ja: 'K1-rule(規則の鍵 rdRule:"kappaM" —— 全天体 R_d = Y_k m・Y_k = 10G_0/(C_1c_0²))' }),
  Object.freeze({ key: 'k1y', kernel: 'k1', radius: 'yn', ns: Object.freeze([1, 0]), gateN2: true, ja: 'K1-Y(n)(明示の dragCore —— 全天体 R_d = Y_k(n) m・Y_k(n) = (6+2n)G_0/(C_1c_0²) は候補)' }),
  Object.freeze({ key: 'k2same', kernel: 'k2', radius: 'alpha', alpha: 1, ns: Object.freeze([2]), ja: 'K2(i) 同じ半径(明示の dragCore —— R_d = Y_k m)' }),
  Object.freeze({ key: 'k2a1e4', kernel: 'k2', radius: 'alpha', alpha: 1e4, ns: Object.freeze([2]), ja: 'K2(ii) 倍率 α = 10⁴(R_d = 10⁴ Y_k m)' }),
  Object.freeze({ key: 'k2a1e6', kernel: 'k2', radius: 'alpha', alpha: 1e6, ns: Object.freeze([2, 1, 0]), ja: 'K2(ii) 倍率 α = 10⁶(R_d = 10⁶ Y_k m —— n による違いもこの点で)' }),
  Object.freeze({ key: 'k2sqrt', kernel: 'k2', radius: 'sqrt', ns: Object.freeze([2]), ja: 'K2(iii) 質量の依存の型(R_d = Y_k √(m_☉ m) —— 規格の点は太陽)' })]);
export const kernelRowOf = (k) => KERNEL_ROWS.find((r) => r.key === k) || null;
/** 半径の方針(正本の plan に書く文) */
export const RADIUS_POLICY = Object.freeze({
  rule: '規則の鍵 rdRule:"kappaM"(dragCore を宣言しない —— エンジンが R_d = Y_k m を置く)',
  yn: '明示の dragCore:{massFrac:1, radius: Y_k(n)·m}(全天体 —— m はエンジンが使う質量)',
  alpha: '明示の dragCore:{massFrac:1, radius: α·Y_k·m}(全天体 —— α = 1 は (Y_k·m) そのもの・他は α·(Y_k·m))',
  sqrt: '明示の dragCore:{massFrac:1, radius: Y_k·√(m_☉·m)}(全天体 —— m_☉ は凍結の写しの太陽のエンジンが使う質量・二体の本にも同じ m_☉)' });
/** 引きずりの宣言(第315便d の K1_RULE_DRAG と同じ外殻・自転の引きずり —— 核と規則の鍵だけ違う) */
export function dragOf(kr) {
  const d = clone(L.K1_RULE_DRAG);
  if (kr.radius === 'rule') return d;
  const isq = { outerShell: 'uniform' }; if (kr.kernel === 'k1') isq.kernel = 'k1';
  d.invSq = isq; return d;
}
/** 天体 i の明示の R_d(本の単位)。mE = エンジンが使う質量・mSun = 凍結の写しの太陽のエンジンが使う質量 */
export function rdOf(kr, ph, n, mE, mSun) {
  if (kr.radius === 'yn') return ykN(ph, n) * mE;
  const Yk = L.YkBook({ physics: ph });
  if (kr.radius === 'alpha') return kr.alpha === 1 ? Yk * mE : kr.alpha * (Yk * mE);
  if (kr.radius === 'sqrt') return Yk * Math.sqrt(mSun * mE);
  throw new Error('明示の半径の無い行: ' + kr.key);
}
/**
 * 変種の本。kind = q00 | q10 | q11・n = 2|1|0(q00 は読まない)・kr = 核の行(q11 だけ)。基は L.bookOf(同じ種・同じ刻み)の写し。
 * 差し替えるのは physics.gLoc・physics.relativeDrag・bodies[].dragCore だけ(n = 2 の K1-rule は bookOf の出力と同じ本)。
 */
export function variantBook(HP, key, sys, kind, n, kr, o = {}) {
  const sd = o.seed || L.seedOf(HP, key);
  const b = clone(L.bookOf(HP, key, sys, kind, { seed: sd, stepsPerOrbit: o.stepsPerOrbit || 720 }));
  if (kind === 'q00') return b;
  b.physics.gLoc = glocOf(n);
  if (kind === 'q10') return b;
  if (!kr) throw new Error('q11 は核の行が要る');
  b.physics.relativeDrag = dragOf(kr);
  if (kr.radius !== 'rule') {
    const P = L.parentOf(sd.parent), mSun = L.engineMassOf(P.sun.m, b.physics);
    for (const z of b.bodies) z.dragCore = { massFrac: 1, radius: rdOf(kr, b.physics, n, L.engineMassOf(z.m, b.physics), mSun) };
  }
  return b;
}

/* ───────── 二体の解析の一次の率(参考の列 —— 門を付けない)───────── */
const CENTURY = 36525 * 86400, RAD2AS = 180 / Math.PI * 3600;
/**
 * q1pn・gLocA(n)・dragA(K1 の行 —— Y)。sd = 種・P = 母惑星(L.parentOf)。
 * gLocA は n = 2 で第315便d の refsOf の gLocAnalytic と同じ式・同じ演算の順(-2 · n · π · μ_eff / (c² a (1 − e²)) · 周 · ″)。
 */
export function refsN(sd, P, n, Y) {
  const G = P.physics.G, c = P.physics.cLight, M = P.planet.m, m = sd.m, Tsec = Math.pow(10, L.UNITS.T), per = CENTURY / Tsec / sd.P;
  const q1pn = 6 * Math.PI * G * (M + m) / (c * c * sd.a * (1 - sd.e * sd.e)) * per * RAD2AS;
  const muEff = G * (M * M + m * m) / (M + m), gLocA = -2 * n * Math.PI * muEff / (c * c * sd.a * (1 - sd.e * sd.e)) * per * RAD2AS;
  const out = { n, q1pn, gLocA };
  if (Number.isFinite(Y)) { const coef = L.C1 * c * c * Y / G; out.coefY = coef; out.dragA = coef * Math.PI * G * (M + m) / (c * c * sd.a * (1 - sd.e * sd.e)) * per * RAD2AS; out.sumA = out.dragA + gLocA; }
  return out;
}
