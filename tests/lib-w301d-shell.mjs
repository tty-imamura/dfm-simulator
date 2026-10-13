// 第301便d(原仮定者の裁定(第91報)④・統括の検証項目 R182)—— **殻の配置の生成器**(純関数 —— html を読まない)。
// 探索の写し 💫 chainBurstShell3d の bodies(中心の後の殻の粒子)をこの関数で作り、器 tests/exp-w301d-chainburst.mjs と QA preset.chainBurstShell301 が
// 同じ関数で html の本の bodies を作り直して照合する(手書きの座標の第二の正本を作らない)。
//
// ■ 配置: 半径 rIn ≤ r ≤ rOut の球殻に n 個。k 番目(k = 0…n−1)の方向は黄金角の螺旋(フィボナッチ球): z/r = 1 − 2(k+½)/n・方位 k·φ_g + φ₀、
//   半径は体積一様の低食い違い列: r_k = ∛(rIn³ + (rOut³ − rIn³)·frac(k·g + δ))(g = (√5 − 1)/2)。初速は 0(静止 —— 中心へ落ちる)。
//   種 rot(既定 0)は配置の依存の測定用: φ₀ = rot·φ_g/2・δ = frac(rot·g/2)(rot 0 は φ₀ = δ = 0)。
// ■ 単位: 🔗🔩 と同じトイ単位(G = 0.005・中心 m = 100・半径 6・ε_g = 0.5)。殻の総質量は既定 400(= 中心の 4 倍 —— 🔗 と同じ比)。
export const SHELL_VERSION = 'w301d-shell-1';
export const GOLDEN = Math.PI * (3 - Math.sqrt(5));
export const SHELL_DEFAULT = Object.freeze({ n: 40, rIn: 6, rOut: 12, m: 10, rot: 0 });

/** 殻の n 個(single —— 中心は含めない)。 */
export function shellBodies(o = {}) {
  const q = Object.assign({}, SHELL_DEFAULT, o), g = (Math.sqrt(5) - 1) / 2;
  const phi0 = q.rot ? q.rot * GOLDEN / 2 : 0, del = q.rot ? (q.rot * g / 2) % 1 : 0;
  const out = [];
  for (let k = 0; k < q.n; k++) {
    const zc = 1 - 2 * (k + 0.5) / q.n, s = Math.sqrt(1 - zc * zc), th = k * GOLDEN + phi0, f = (k * g + del) % 1;
    const r = Math.cbrt(q.rIn ** 3 + (q.rOut ** 3 - q.rIn ** 3) * f);
    out.push({ type: 'single', m: q.m, x: r * s * Math.cos(th), y: r * s * Math.sin(th), z: r * zc, vx: 0, vy: 0, vz: 0, spin: 0, pinned: false });
  }
  return out;
}
/** 配置の要約(最短の粒子間距離・中心距離の範囲) */
export function shellStats(bodies) {
  let dMin = Infinity, rMin = Infinity, rMax = 0;
  for (let i = 0; i < bodies.length; i++) { const a = bodies[i], r = Math.hypot(a.x, a.y, a.z); rMin = Math.min(rMin, r); rMax = Math.max(rMax, r);
    for (let j = i + 1; j < bodies.length; j++) { const b = bodies[j]; dMin = Math.min(dMin, Math.hypot(a.x - b.x, a.y - b.y, a.z - b.z)); } }
  return { n: bodies.length, dMin, rMin, rMax };
}
