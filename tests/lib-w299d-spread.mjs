// 第299便d(原仮定者の裁定(第89報)③「geoPN=4 の検証が安定したら、physics.spaceMesh サンプルの移行を進める。現状の chainDiskToy 系は、初期配置が集まりすぎている」・
// 統括の検証項目 R173)—— **広げた円盤の配置の生成器**(純関数 —— html を読まない)。器 tests/exp-w299d-geo4stable.mjs と QA preset.chainSpread299 が同じ関数で
// html の本の bodies を作り直して照合する(手書きの座標の第二の正本を作らない)。
//
// ■ 配置: 面積一様の環 rIn ≤ r ≤ rOut に黄金角で n 個(k 番目は r_k = √(rIn² + (rOut²−rIn²)(k+½)/n)・θ_k = k·φ_g + θ₀)。
//   種 seed=0 は揺らぎなし(θ₀=0)。seed>0 は線形合同で θ₀ を一様に・各粒子の (k+½) を ±jitter/2 だけ・角を ±jitter·φ_g/2 だけ揺らす(配置の依存の測定用)。
//   strict(既定): 揺らした点が既に置いた点と floorRp·R_p(R_p=√m)より近ければ tries 回まで引き直し、尽きたら揺らぎなしの位置に置く(-1 は引き直さない)。
//   面は z=0(群の傾きは置かない —— 三次元は中心の自転軸の傾きで入る)。
// ■ 初速の種(2 つ —— どちらも平衡とは呼ばない):
//   "zero"   —— 零初速(対照)。
//   "radial" —— t=0 の重力の動径成分の釣り合い v_t = √(r·a_r)(a_r は中心と**円盤の自己重力**を全部足した軟化つきの加速度の内向き成分 ——
//               アプリの重力と同じ形 G m_j d/(d²+ε²)^{3/2})。a_r ≤ 0 の粒子は v_t=0 として数える。接線方向の力の残り(離散性)は打ち消さない。
// ■ 単位: 🔗🔩🪛 と同じトイ単位(G=0.005・中心 m=100・半径 6・粒子 m=5・ε_g=0.5)。
export const SPREAD_VERSION = 'w299d-spread-2';   // -2: 種 >0 の揺らぎを、最短距離の床(4 R_p)を割らない引き直しにした(-1 は床を見ず最短 1.53〜2.55 —— 器が strict:false で再現する)
export const GOLDEN = Math.PI * (3 - Math.sqrt(5));
export const SPREAD_DEFAULT = Object.freeze({ n: 80, rIn: 18, rOut: 72, m: 5, mC: 100, RC: 6, spinC: 0.5, G: 0.005, soft: 0.5, seed: 0, jitter: 0.5, floorRp: 4, strict: true, tries: 64 });

function lcg(seed) {
  let s = (seed >>> 0) || 1;
  return () => { s = (Math.imul(s, 1664525) + 1013904223) >>> 0; return s / 4294967296; };
}
/** 円盤 n 個の xy(中心は原点) */
export function spreadXY(o = {}) {
  const q = Object.assign({}, SPREAD_DEFAULT, o);
  const rnd = lcg(q.seed * 2654435761 + 12345);
  const th0 = q.seed ? 2 * Math.PI * rnd() : 0;
  const out = [];
  const floor = q.floorRp * Math.sqrt(q.m);
  const at = (k, du, dth) => { const u = Math.min(1, Math.max(0, (k + 0.5 + du) / q.n)), r = Math.sqrt(q.rIn * q.rIn + (q.rOut * q.rOut - q.rIn * q.rIn) * u), th = k * GOLDEN + th0 + dth;
    return [r * Math.cos(th), r * Math.sin(th)]; };
  const ok = (p) => out.every((o) => Math.hypot(o[0] - p[0], o[1] - p[1]) >= floor);
  for (let k = 0; k < q.n; k++) {
    if (!q.seed) { out.push(at(k, 0, 0)); continue; }
    let p = null;
    for (let t = 0; t < (q.strict ? q.tries : 1); t++) { const c = at(k, (rnd() - 0.5) * q.jitter, (rnd() - 0.5) * q.jitter * GOLDEN); if (!q.strict || ok(c)) { p = c; break; } }
    out.push(p || at(k, 0, 0));
  }
  return out;
}
/** t=0 の加速度(中心+円盤の全体・軟化つき)—— アプリの重力と同じ形 */
export function accelAt(pts, q) {
  const all = [[0, 0, q.mC]].concat(pts.map((p) => [p[0], p[1], q.m])), e2 = q.soft * q.soft;
  return pts.map((p, i) => {
    let ax = 0, ay = 0;
    for (let j = 0; j < all.length; j++) {
      if (j === i + 1) continue;
      const dx = all[j][0] - p[0], dy = all[j][1] - p[1], d2 = dx * dx + dy * dy + e2, f = q.G * all[j][2] / (d2 * Math.sqrt(d2));
      ax += f * dx; ay += f * dy;
    }
    return [ax, ay];
  });
}
/** 速度の種: "zero" | "radial"(v_t=√(r a_r)・向きは +z まわり〔中心の spin>0 と同じ向き〕)。返り値 {v, nNonPos, aT_over_aR_max} */
export function spreadVel(pts, mode, o = {}) {
  const q = Object.assign({}, SPREAD_DEFAULT, o);
  if (mode === 'zero') return { v: pts.map(() => [0, 0]), nNonPos: 0, tanRatioMax: 0 };
  const A = accelAt(pts, q);
  let nNonPos = 0, tanRatioMax = 0;
  const v = pts.map((p, i) => {
    const r = Math.hypot(p[0], p[1]), ex = p[0] / r, ey = p[1] / r, ar = -(A[i][0] * ex + A[i][1] * ey), at = -A[i][0] * ey + A[i][1] * ex;
    if (!(ar > 0)) { nNonPos++; return [0, 0]; }
    tanRatioMax = Math.max(tanRatioMax, Math.abs(at) / ar);
    const vt = Math.sqrt(r * ar);
    return [-vt * ey, vt * ex];
  });
  return { v, nNonPos, tanRatioMax };
}
/** 配置の統計: 中心距離(最小・中央・最大)・最短の粒子間距離・宣言半径の重なり(粒子どうし・中心と粒子) */
export function layoutStats(pts, o = {}) {
  const q = Object.assign({}, SPREAD_DEFAULT, o);
  const Rp = Math.sqrt(q.m), rc = pts.map((p) => Math.hypot(p[0], p[1])).sort((a, b) => a - b);
  let dmin = Infinity, ov = 0, ovC = 0;
  for (let i = 0; i < pts.length; i++) {
    if (rc[0] < q.RC + Rp && Math.hypot(pts[i][0], pts[i][1]) < q.RC + Rp) ovC++;
    for (let j = i + 1; j < pts.length; j++) { const d = Math.hypot(pts[i][0] - pts[j][0], pts[i][1] - pts[j][1]); dmin = Math.min(dmin, d); if (d < 2 * Rp) ov++; }
  }
  return { n: pts.length, rcMin: rc[0], rcMed: rc[rc.length >> 1], rcMax: rc[rc.length - 1], dMin: dmin, overlapPairs: ov, overlapCentre: ovC, Rp };
}
/** 本の bodies(中心 1 + 円盤 n の single —— z=0)。数は toPrecision(15) の 10 進で書く(html に写す値と同じ) */
export function spreadBodies(o = {}, velMode = 'radial', centre = {}) {
  const q = Object.assign({}, SPREAD_DEFAULT, o);
  const pts = spreadXY(q), V = spreadVel(pts, velMode, q).v;
  const f = (x) => Number(x.toPrecision(15));
  const B = [Object.assign({ type: 'single', m: q.mC, radius: q.RC, x: 0, y: 0, vx: 0, vy: 0, spin: q.spinC, pinned: true }, centre)];
  pts.forEach((p, i) => B.push({ type: 'single', m: q.m, x: f(p[0]), y: f(p[1]), vx: f(V[i][0]), vy: f(V[i][1]), spin: 0, pinned: false }));
  return B;
}
