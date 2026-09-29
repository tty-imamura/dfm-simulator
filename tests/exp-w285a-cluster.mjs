// 第285便a(原仮定者の裁定(第75報)⑤「球状星団: まずは安定するバランスを見付ける。中心天体の質量を大きくすると拡散しにくくなる。
// 引きずりによる斥力でバランスが取れれば安定する。衝突判定は無いので当たらないが、粒子が大き過ぎる。見易さは粒子表示倍率で調整する。
// ダークローターはコンパクト天体で恒星より小さい。恒星より大きな見た目だと主張に齟齬が出る」・統括の検証項目 R96)—— **💮 の半径と走査**の器。
//
// ■ 門(**第283便f の門をそのまま使う** —— 下げない)・中心の引きずり支配の目標(第284便a の DOMINANCE —— 動かさない)
//   値と判定の関数は器 tests/exp-w283f-cluster.mjs の `GATES`・`gateEval` と tests/exp-w284a-cluster.mjs の `DOMINANCE`・`dominanceEval` を
//   **そのまま読む**(1 字も写さない)。窓 [1, 3] × T_out は**各構成の T_out**(中心質量で v_c が変わる —— 構成ごとに t=0 で測る)。
//
// ■ 測る前に宣言したこと(下の `SCAN`・`DIAG`・`EQTOY_RULE`・`HYPOTHESIS` —— QA が PHYSICS の段落と正本と照合する)
//   ・(a) 半径 bin ごとの重力・メッシュ力・速度分布・エネルギー交換: a_mesh ≡ Δv/dt − a_E4(x₀)(1 步の速度の変化から重力を引いた残り ——
//     トイの力 a=∂ₜū+(∇ū)v−(∇ū)ᵀ(v−ū) と数値の丸め・クランプの和。O(dt) の近似)。bin [0,5)・[5,10)・[10,20)・[20,40)・[40,80)。
//   ・(b) 同じ全力に対する初期分布: (∇ū)v−(∇ū)ᵀ(v−ū) = (J−Jᵀ)v + ∇(½|ū|²)(J=∇ū)—— 前の項は速度に直交(仕事をしない)、後の項は
//     速度に依らない勾配。そこで**実効ポテンシャル Φ_eff = Φ̄_E4 − ½⟨|ū|²⟩_az** の 2D 等方の基準解(html の vMode equilibrium と同じ
//     Plummer の Eddington 逆変換)で速さを作り直す(ū は速度に依るので 3 回の固定点反復・∂ₜū は入れない —— 近似)。
//     **採るかどうかの規則(測る前に宣言)**: 基準構成の t=0 で |ā_mesh,r|/|ā_E4,r| ≥ 0.05 の bin が 1 つでもあれば「含める」。
//     走査は含める/含めないの両方を走らせる(判定の対象は両方 —— 採否は結果の後で変えない)。
//   ・(c) 代表数 N_rep 320(DR 1 体 6.640625)× 乱数種 3 で門を検証する —— 走査(N_rep 40・乱数種 0)の上位 2 構成と宣言どおりの構成。
//   ・中心質量比 M_c/M_DR ∈ {1/8.5(宣言 250), 1, 4}・中心 spin ∈ {12, 3, 0〔対照 —— 支配の候補ではない〕}・R_drag(中心の R)∈ {1.5, 3}。
//     R=1.5・c=30 で中心質量だけ増やすと GM/(Rc²) は 0.148 → 1.26(比 1)→ 5.04(比 4)—— **GR の 1PN の有効域ではない**(トイの規約)。
//   ・仮説「中心質量を増やせば拡散しにくい」は**検証する仮説**(単調でなければそう書く)。
//
// ■ 宣言の照合(A)と E9(B)
//   (A) 💮 の particleRadius(DR = 惑星級 7.1492×10⁷ m / L・恒星 = 太陽半径 6.957×10⁸ m / L —— **表示比較の仮定**)と台帳の radii
//       (L = (G_SI·M_unit/c_SI²)/(G/c²)〔m〕)を G・c・質量単位から作り直して照合する。表示半径(レンダラの式 max(1.2, R·dispMag·z))で
//       **DR < 恒星**・恒星は床 1.2 px より大きい(大小が同じ点に潰れない)を 3 つの画面の大きさで機械検査する。
//   (B) contactMode:"none" で E9 が発火しないこと: DR の particleRadius だけを 8.75 にした写しと 300 步の全状態がビット一致・
//       contactMode を外した(normal)写しでは一致しない(検出力)。第284便a の宣言(凍結写し)と今の宣言の力学がビット一致(半径だけが違う)。
//
// ■ しないこと・言わないこと
//   ・門を動かさない。既存の本の力学に触らない(走査の写しは器の中だけ)。観測値と突き合わせない。
//   ・「形状が安定した」「47 Tuc を再現した」「中心の引きずりが支配的になった」「観測一致を達成した」「新発見」と書かない(門の語は形状達成/未達だけ)。
//
// 実行(Node だけ): node tests/exp-w285a-cluster.mjs   (並列: W285A_WORKERS —— 既定 2。結果は並列数に依らない)
// 読む正本: なし(html と凍結写し tests/fixtures/cluster-w284a-preset.json)。正本: tests/out/cluster-w285a.json
import fs from 'node:fs';
import path from 'node:path';
import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { provenanceMeta } from './lib-w272e-provenance.mjs';
import * as LR from './lib-w281c-rotorledger.mjs';
import * as E283 from './exp-w283f-cluster.mjs';
import * as E284 from './exp-w284a-cluster.mjs';
// 第281便a(AN16・R71): **この器が読む html の領域**の宣言(1 行の JSON —— lint.regenScope が読む)
import { scopeStamp as w281aScopeStamp, stableInputs as w281aStableInputs } from './lib-w281a-scope.mjs';
const REGEN_SCOPE = {"presets":"all","roots":["$","CONTACT_MODE_KEY","DT","HP.allPresets","HP.dfmField","HP.dfmFieldContractOf","HP.dfmFieldSnapshot","HP.dfmMeshVelocityFieldAt","HP.sim","HP.validatePreset","T","ch","contactNoneOf","ctx","cw","dfmField","dfmFieldContract","geoCoreDispatch","lensExcludedRows","rayHeavy","rayMassMin","traceRay"],"core":true,"consts":[],"complete":true};

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
export const HARNESS_VERSION = 'w285a-cluster-1';
export const PRESET = 'clusterAnalogyBH';
export const DT = E283.DT;
export const GATES = E283.GATES;
export const GATE_TEXT = E283.GATE_TEXT;
export const DOMINANCE = E284.DOMINANCE;
export const SEEDS = E284.SEEDS;
export const E9_STEPS = 300;
export const PHYS = Object.freeze({ G_SI: 6.6743e-11, c_SI: 299792458, R_SUN_M: 6.957e8 });
export const DISPLAY = Object.freeze({ floorPx: 1.2, canvasMin: [360, 720, 1080], formula: 'Math.max(1.2,Math.min(sim.R[i]*(sim.params.dispMag||1)*z,rCap))' });

/** 走査(測る前に宣言)。 */
export const SCAN = Object.freeze({
  version: 'w285a-scan-1',
  nRep: 40, seed: 0, ratio: 20,
  mcOverMdr: Object.freeze([1 / 8.5, 1, 4]),
  spin: Object.freeze([12, 3, 0]),
  rDrag: Object.freeze([1.5, 3]),
  init: Object.freeze(['eq', 'eqToy']),
  verify: Object.freeze({ nRep: 320, seeds: 3, top: 2, alwaysDeclared: true }),
});
export const DIAG = Object.freeze({ version: 'w285a-diag-1', bins: Object.freeze([[0, 5], [5, 10], [10, 20], [20, 40], [40, 80]]), atOut: Object.freeze([0, 1, 2, 3]) });
export const EQTOY_RULE = Object.freeze({ version: 'w285a-eqtoy-1', iters: 3, K: 64, nAz: 32, includeIfMeshOverGravityAtLeast: 0.05 });
export const HYPOTHESIS = '中心質量を増やせば拡散しにくい(保持率が上がり半質量半径の変化が小さくなる)—— spin 12・R_drag 1.5・宣言の初速で M_c/M_DR 1/8.5 → 1 → 4 の単調性を見る';
export const SCAN_TEXT = [
  `走査(N_rep ${SCAN.nRep}・乱数種 ${SCAN.seed}・個数比 ${SCAN.ratio}): M_c/M_DR ∈ {1/8.5, 1, 4} × 中心 spin ∈ {12, 3, 0(対照)} × R_drag ∈ {1.5, 3} × 初速 ∈ {宣言の平衡初速, 実効ポテンシャルの平衡初速}`,
  `検証: 走査の上位 ${SCAN.verify.top} 構成と宣言どおりの構成を N_rep ${SCAN.verify.nRep} × 乱数種 ${SCAN.verify.seeds} で(門は第283便f のまま・窓は各構成の T_out)`,
  `実効ポテンシャル Φ_eff = Φ̄_E4 − ½⟨|ū|²⟩(${EQTOY_RULE.iters} 回の固定点反復・∂ₜū は入れない)—— 基準構成の t=0 で |ā_mesh,r|/|ā_E4,r| ≥ ${EQTOY_RULE.includeIfMeshOverGravityAtLeast} の bin があれば「含める」`,
  `仮説: ${HYPOTHESIS}`,
];

const clone = (o) => JSON.parse(JSON.stringify(o));
const byId0 = (HP, id) => HP.allPresets().find((q) => q.id === id);
// 第286便a(原仮定者の裁定(第76報)⑤・R101〜R103): 💮 の宣言を星団スケール(w286a)へ書き換えた世代では、この器は第285便a の宣言の
//   **凍結写し** tests/fixtures/cluster-w285a-preset.json を読む(この器と正本 cluster-w285a.json は第285便a の宣言の記録 —— 履歴)
export const FIXTURE_285A = 'tests/fixtures/cluster-w285a-preset.json';
let FX285A = null;
export function sourcePreset(HP) {
  const cur = byId0(HP, PRESET);
  if (cur && cur.massLedger && cur.massLedger.version === 'w285a-1') return cur;
  if (!FX285A) FX285A = JSON.parse(fs.readFileSync(path.join(ROOT, FIXTURE_285A), 'utf8')).preset;
  return FX285A;
}
const byId = (HP, id) => (id === PRESET) ? sourcePreset(HP) : byId0(HP, id);
const rel = E283.rel;
const fmtMc = (x) => (Math.abs(x - 1 / 8.5) < 1e-12 ? '1/8.5' : String(x));
export const cfgKey = (c) => `mc${fmtMc(c.mcOverMdr)}-s${c.spin}-R${c.rDrag}-${c.init}`;

/** 走査と検証の走行の一覧。verify は走査の結果で決まる(上位 2 + 宣言)。 */
export function scanSpecs() {
  const out = [];
  for (const mcOverMdr of SCAN.mcOverMdr) for (const spin of SCAN.spin) for (const rDrag of SCAN.rDrag) for (const init of SCAN.init) {
    const c = { mcOverMdr, spin, rDrag, init };
    out.push(Object.assign({ key: cfgKey(c) + '-n' + SCAN.nRep + '-s0', cfg: cfgKey(c), nRep: SCAN.nRep, seed: SCAN.seed, phase: 'scan' }, c));
  }
  return out;
}
export const DECLARED_CFG = Object.freeze({ mcOverMdr: 1 / 8.5, spin: 12, rDrag: 1.5, init: 'eq' });

/** 写し(器の中だけ)。中心質量 = mcOverMdr·M_DR(M_DR は台帳の 2125)。 */
export function variantPreset(HP, spec) {
  const p = clone(byId(HP, PRESET));
  const k = p.bodies.findIndex((b) => b.type === 'disk' && b.lightSweep === 1);
  p.seed = SEEDS[spec.seed || 0];
  const ml = p.massLedger, Mdr = ml.darkRotor.totalUnit;
  const mc = (Math.abs(spec.mcOverMdr - 1 / 8.5) < 1e-12) ? ml.core : spec.mcOverMdr * Mdr;   // 宣言の 250 は 2125/8.5 そのもの
  p.bodies[0].m = mc; p.bodies[0].spin = spec.spin; p.bodies[0].radius = spec.rDrag;
  // 宣言どおりの代表数・中心質量なら台帳と DR の質量を作り直さない(作り直すと 1 体の質量が 53.125 → 53.12499999999999 に丸めで動く)
  if (spec.nRep !== ml.darkRotor.nRep || mc !== ml.core) {
    const radii0 = clone(ml.darkRotor.radii);
    ml.core = mc;
    const nl = E284.ledgerFor(ml, spec.nRep, SCAN.ratio);
    nl.darkRotor.radii = radii0;
    p.massLedger = nl;
    const m = nl.darkRotor.mPerRepUnit;
    p.bodies[k].n = spec.nRep; p.bodies[k].mMin = m; p.bodies[k].mMax = m;
  }
  p.massLedger.darkRotor.radii.drag = spec.rDrag;
  if (spec.variant === 'bigDR') p.bodies[k].particleRadius = 8.75;
  if (spec.variant === 'normal') delete p.physics.contactMode;
  if (spec.variant === 'normalBigDR') { delete p.physics.contactMode; p.bodies[k].particleRadius = 8.75; }
  return p;
}

/** 星団の Plummer の面密度(html の equilibriumRowVelocities と同じ ν)。 */
const nuOf = (a) => (r) => { const z = 1 + r * r / (a * a); return 1 / (z * z); };
function mulberry(seed) { let s = seed >>> 0; return () => { s = (s + 0x6D2B79F5) >>> 0; let t = s; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }

/** 環平均 Φ̄_E4(r)(全粒子を源 —— html の eqSources "all" と同じ核)を 0〜Rt の K+1 点で。 */
function phiE4Grid(S, Rt, K, nAz) {
  const G = S.params.G, eps2 = S.params.softening ** 2, phi = new Float64Array(K + 1);
  for (let k = 0; k <= K; k++) {
    const r = Rt * k / K; let sum = 0;
    for (let q = 0; q < nAz; q++) {
      const th = 2 * Math.PI * q / nAz, x = r * Math.cos(th), y = r * Math.sin(th);
      for (let j = 0; j < S.n; j++) { const dx = x - S.x[j], dy = y - S.y[j]; sum -= G * S.m[j] / Math.sqrt(dx * dx + dy * dy + eps2); }
    }
    phi[k] = sum / nAz;
  }
  return phi;
}
/** 環平均 ½⟨|ū|²⟩(r)(トイの場の契約 dfmFieldContractOf(S,"toy") —— 格子点は粒子ではないので自己除外なし)。 */
function halfU2Grid(HP, S, Rt, K, nAz) {
  const C = Object.assign({}, HP.dfmFieldContractOf(S, 'toy').contract); C.need = 'u';
  const BD = []; for (let i = 0; i < S.n; i++) BD.push({ id: i, m: S.m[i], x: S.x[i], y: S.y[i], vx: S.vx[i], vy: S.vy[i], ax: 0, ay: 0,
    spin: S.spin[i], R: S.R[i], omegaDot: 0, pinned: (S.pinned[i] === 1) });
  const out = new Float64Array(K + 1);
  for (let k = 0; k <= K; k++) {
    const r = Rt * k / K; let s = 0, n = 0;
    for (let q = 0; q < nAz; q++) {
      const th = 2 * Math.PI * (q + 0.5) / nAz, f = globalThis.dfmFieldContract(BD, r * Math.cos(th), r * Math.sin(th), C);
      if (!f || !f.u) continue; s += 0.5 * (f.u[0] ** 2 + f.u[1] ** 2); n++;
    }
    out[k] = n ? s / n : 0;
  }
  return out;
}
/**
 * (b) **実効ポテンシャルの平衡初速**(器の中だけ)。Φ_eff = Φ̄_E4 − ½⟨|ū|²⟩ の 2D 等方の基準解で恒星と DR の速さを作り直す。
 * 分位 u と向き a は器の乱数(種 = 宣言の seed ^ 285)。ū は速度に依るので EQTOY_RULE.iters 回の固定点反復。
 */
export function eqToyInit(HP, S, preset, pop) {
  const rows = preset.bodies.filter((b) => b.type === 'disk');
  const Rt = rows[0].radius, a = rows[0].plummerScale, nu = nuOf(a), nuT = nu(Rt);
  const K = EQTOY_RULE.K, nAz = EQTOY_RULE.nAz;
  const ids = pop.stars.concat(pop.dr);
  const rnd = mulberry(((preset.seed >>> 0) ^ 285) >>> 0);
  const U = new Float64Array(S.n), A = new Float64Array(S.n);
  for (const i of ids) { U[i] = rnd(); A[i] = 2 * Math.PI * rnd(); }
  const phiE4 = phiE4Grid(S, Rt, K, 64);
  const sample = (phi) => {
    for (let k = 1; k <= K; k++) if (!(phi[k] > phi[k - 1])) return { status: 'psiNotMonotone', badRadius: Rt * k / K };
    const at = (r) => { const t = Math.min(Math.max(r, 0), Rt) / Rt * K, k = Math.min(K - 1, Math.floor(t)), f = t - k; return phi[k] * (1 - f) + phi[k + 1] * f; };
    let vMax = 0, nAtom = 0;
    const V = new Float64Array(S.n);
    for (const i of ids) {
      const r = Math.hypot(S.x[i], S.y[i]), ns = U[i] * nu(r);
      let rs; if (ns <= nuT) { rs = Rt; nAtom++; } else { rs = a * Math.sqrt(Math.max(0, Math.sqrt(1 / ns) - 1)); if (rs < r) rs = r; if (rs > Rt) rs = Rt; }
      V[i] = Math.sqrt(Math.max(0, 2 * (at(rs) - at(r)))); if (V[i] > vMax) vMax = V[i];
    }
    return { status: 'ok', V, vMax, nAtom, psiCenter: phi[K] - phi[0] };
  };
  const apply = (V) => { for (const i of ids) { S.vx[i] = V[i] * Math.cos(A[i]); S.vy[i] = V[i] * Math.sin(A[i]); } };
  let cur = sample(phiE4);
  if (cur.status !== 'ok') return { status: cur.status, badRadius: cur.badRadius, iters: [] };
  apply(cur.V);
  const iters = [];
  for (let it = 0; it < EQTOY_RULE.iters; it++) {
    const hu = halfU2Grid(HP, S, Rt, K, nAz);
    const phi = new Float64Array(K + 1); for (let k = 0; k <= K; k++) phi[k] = phiE4[k] - hu[k];
    const nx = sample(phi);
    if (nx.status !== 'ok') { iters.push({ it, status: nx.status, badRadius: nx.badRadius, halfU2Center: hu[0], halfU2Max: Math.max(...hu) }); break; }
    let dmax = 0; for (const i of ids) dmax = Math.max(dmax, Math.abs(nx.V[i] - cur.V[i]));
    apply(nx.V); cur = nx;
    iters.push({ it, status: 'ok', dVmax: dmax, vMax: nx.vMax, psiCenterEff: nx.psiCenter, psiCenterE4: phiE4[K] - phiE4[0], halfU2Center: hu[0], halfU2Max: Math.max(...hu), nAtom: nx.nAtom });
  }
  const last = iters[iters.length - 1];
  return { status: (last && last.status !== 'ok') ? last.status : 'ok', iters, rule: EQTOY_RULE.version };
}

/** 重力 E4 の加速度(軟化した対 —— 全粒子)。 */
function accE4(S) {
  const G = S.params.G, eps2 = S.params.softening ** 2, ax = new Float64Array(S.n), ay = new Float64Array(S.n);
  for (let i = 0; i < S.n; i++) for (let j = i + 1; j < S.n; j++) {
    const dx = S.x[j] - S.x[i], dy = S.y[j] - S.y[i], q = dx * dx + dy * dy + eps2, iq = 1 / (q * Math.sqrt(q));
    ax[i] += G * S.m[j] * dx * iq; ay[i] += G * S.m[j] * dy * iq; ax[j] -= G * S.m[i] * dx * iq; ay[j] -= G * S.m[i] * dy * iq;
  }
  return { ax, ay };
}
/**
 * (a) **半径 bin ごとの診断**(1 步を走らせて測る —— 呼んだ走行の時刻を 1 步進める)。a_mesh ≡ Δv/dt − a_E4(x₀)。
 * 返り値: 集団(stars/dr)× bin の個数・⟨a_E4,r⟩・⟨a_mesh,r⟩・⟨a_mesh,t⟩・⟨v_r⟩・⟨v_t⟩・σ_r・σ_t・質量あたりの仕事率 ⟨a_mesh·v⟩・⟨a_E4·v⟩。
 */
export function diagStep(S, pop) {
  const ic = pop.center[0], cx = S.x[ic], cy = S.y[ic];
  const g = accE4(S);
  const vx0 = Float64Array.from(S.vx), vy0 = Float64Array.from(S.vy), x0 = Float64Array.from(S.x), y0 = Float64Array.from(S.y);
  S.step(DT);
  const out = {};
  for (const [name, ids] of [['stars', pop.stars], ['dr', pop.dr]]) {
    out[name] = DIAG.bins.map(([r0, r1]) => {
      let n = 0, agr = 0, amr = 0, amt = 0, vr = 0, vt = 0, vr2 = 0, vt2 = 0, pm = 0, pg = 0;
      for (const i of ids) {
        const dx = x0[i] - cx, dy = y0[i] - cy, r = Math.hypot(dx, dy);
        if (!(r >= r0 && r < r1) || !(r > 0)) continue;
        const ex = dx / r, ey = dy / r;
        const amx = (S.vx[i] - vx0[i]) / DT - g.ax[i], amy = (S.vy[i] - vy0[i]) / DT - g.ay[i];
        const vR = vx0[i] * ex + vy0[i] * ey, vT = -vx0[i] * ey + vy0[i] * ex;
        n++; agr += g.ax[i] * ex + g.ay[i] * ey; amr += amx * ex + amy * ey; amt += -amx * ey + amy * ex;
        vr += vR; vt += vT; vr2 += vR * vR; vt2 += vT * vT;
        pm += amx * vx0[i] + amy * vy0[i]; pg += g.ax[i] * vx0[i] + g.ay[i] * vy0[i];
      }
      if (!n) return { r0, r1, n: 0 };
      const mvr = vr / n, mvt = vt / n;
      return { r0, r1, n, aE4r: agr / n, aMeshR: amr / n, aMeshT: amt / n, vR: mvr, vT: mvt,
        sigR: Math.sqrt(Math.max(0, vr2 / n - mvr * mvr)), sigT: Math.sqrt(Math.max(0, vt2 / n - mvt * mvt)),
        powMesh: pm / n, powE4: pg / n, meshOverE4: (agr !== 0) ? Math.abs(amr / agr) : null };
    });
  }
  return out;
}

/** 1 走行(0〜3 T_out を 0.25 T_out ごと —— 窓は**自分の** T_out)。診断(a)は 0/1/2/3 T_out で 1 步ずつ(門の標本の直後の步)。 */
export function runOne(HP, spec) {
  const t0 = Date.now();
  const p = variantPreset(HP, spec);
  const v = HP.validatePreset(p);
  if (!v.ok) throw new Error('validatePreset(' + spec.key + '): ' + (v.errors || []).join(' / '));
  HP.sim.build(v.preset);
  const S = HP.sim, preset = v.preset;
  const pop = E283.populations(preset);
  const Rout = preset.bodies.find((b) => b.type === 'disk').radius;
  let eqToy = null;
  if (spec.init === 'eqToy') eqToy = eqToyInit(HP, S, preset, pop);
  const orbit = E283.outerOrbit(HP, S, Rout);
  const Tout = orbit.Tout, Rret = GATES.retentionRadiusOverRout * Rout;
  const nS = Math.round(GATES.window.endOut / GATES.window.sampleEveryOut);
  const stepsPer = Math.round(GATES.window.sampleEveryOut * Tout / DT);
  const samples = [E284.sampleOf(HP, S, pop, Rret)];
  const diag = [];
  const diagAt = new Set(DIAG.atOut.map((x) => Math.round(x / GATES.window.sampleEveryOut)));
  let k = 0;
  if (diagAt.has(0)) { diag.push({ atOut: 0, t: S.t, bins: diagStep(S, pop) }); k++; }
  for (let s = 1; s <= nS; s++) {
    while (k < s * stepsPer) { S.step(DT); k++; }
    samples.push(E284.sampleOf(HP, S, pop, Rret));
    if (diagAt.has(s)) { diag.push({ atOut: s * GATES.window.sampleEveryOut, t: S.t, bins: diagStep(S, pop) }); k++; }
  }
  const Tq = stepsPer * DT / GATES.window.sampleEveryOut;
  const c = preset.bodies[0];
  return { key: spec.key, cfg: spec.cfg, phase: spec.phase, nRep: spec.nRep, seed: SEEDS[spec.seed || 0], seedIdx: spec.seed || 0,
    mcOverMdr: spec.mcOverMdr, spin: spec.spin, rDrag: spec.rDrag, init: spec.init,
    mCenter: c.m, GMoverRc2: preset.physics.G * c.m / (c.radius * preset.physics.cLight ** 2), OmegaRoverC: c.spin * c.radius / preset.physics.cLight,
    n: S.n, nStars: pop.stars.length, nDR: pop.dr.length, mDR: S.m[pop.dr[0]], mStar: S.m[pop.stars[0]],
    eqInit: S.eqInit ? clone(S.eqInit) : null, eqToy, orbit, steps: k, stepsPerSample: stepsPer, ToutEff: Tq, samples, diag,
    gates: E283.gateEval(samples, Tq), dominance: E284.dominanceEval(samples, Tq),
    wallSec: (Date.now() - t0) / 1000 };
}

/** 走査の順位(門を通った数が多い順 → r_h 変化が小さい順 —— 走査が済んでから上位を選ぶ規則。測る前に宣言)。 */
export function scoreOf(r) {
  const nPass = Object.values(r.gates.pass).filter((x) => x === true).length;
  return { nPass, rh: r.gates.worst.rhRelChange };
}
export function pickTop(scanRuns, top = SCAN.verify.top) {
  const rows = scanRuns.map((r) => ({ cfg: r.cfg, r, s: scoreOf(r) }));
  rows.sort((a, b) => (b.s.nPass - a.s.nPass) || (a.s.rh - b.s.rh) || (a.cfg < b.cfg ? -1 : 1));
  return rows.slice(0, top).map((z) => z.r);
}
export function verifySpecs(scanRuns) {
  const cfgs = pickTop(scanRuns).map((r) => ({ mcOverMdr: r.mcOverMdr, spin: r.spin, rDrag: r.rDrag, init: r.init }));
  if (SCAN.verify.alwaysDeclared && !cfgs.some((c) => cfgKey(c) === cfgKey(DECLARED_CFG))) cfgs.push(Object.assign({}, DECLARED_CFG));
  const out = [];
  for (const c of cfgs) for (let s = 0; s < SCAN.verify.seeds; s++)
    out.push(Object.assign({ key: cfgKey(c) + '-n' + SCAN.verify.nRep + '-s' + s, cfg: cfgKey(c), nRep: SCAN.verify.nRep, seed: s, phase: 'verify' }, c));
  return out;
}

/** (b) の採否の規則(測る前に宣言): 基準構成の t=0 の診断で |ā_mesh,r|/|ā_E4,r| ≥ 閾値の bin があるか。 */
export function eqToyDecision(baseRun) {
  const d0 = baseRun.diag.find((z) => z.atOut === 0);
  const ratios = [];
  for (const pop of ['stars', 'dr']) for (const b of d0.bins[pop]) if (b.n && b.meshOverE4 !== null) ratios.push({ pop, r0: b.r0, r1: b.r1, ratio: b.meshOverE4 });
  const hit = ratios.filter((z) => z.ratio >= EQTOY_RULE.includeIfMeshOverGravityAtLeast);
  return { ratios, include: hit.length > 0, hits: hit.map((z) => `${z.pop}[${z.r0},${z.r1})`) };
}

/** 仮説の単調性: spin 12・R 1.5・init eq の 3 質量比で保持率(恒星)と r_h 変化。 */
export function hypothesisCheck(scanRuns) {
  const rows = SCAN.mcOverMdr.map((mc) => scanRuns.find((r) => r.mcOverMdr === mc && r.spin === 12 && r.rDrag === 1.5 && r.init === 'eq'))
    .map((r) => ({ mcOverMdr: r.mcOverMdr, retStars: r.gates.worst.retStars, retDR: r.gates.worst.retDR, rh: r.gates.worst.rhRelChange, verdict: r.gates.verdict }));
  const incRet = rows.every((z, i) => i === 0 || z.retStars >= rows[i - 1].retStars);
  const decRh = rows.every((z, i) => i === 0 || z.rh <= rows[i - 1].rh);
  return { rows, retentionMonotoneUp: incRet, rhMonotoneDown: decRh, word: (incRet && decRh) ? '単調(この 3 点では)' : '単調でない' };
}

/** (A) 宣言の照合: particleRadius・radii・表示半径。 */
export function declarationCheck(HP) {
  const pd = byId(HP, PRESET), v = HP.validatePreset(clone(pd)), P = v.preset;
  const ml = P.massLedger, rr = ml.darkRotor.radii, ph = P.physics;
  const L = (PHYS.G_SI * ml.unitKg / PHYS.c_SI ** 2) / (ph.G / ph.cLight ** 2);
  HP.sim.build(P);
  const S = HP.sim, pop = E283.populations(P);
  const kDR = P.bodies.findIndex((b) => b.type === 'disk' && b.lightSweep === 1), kSt = P.bodies.findIndex((b) => b.type === 'disk' && b.lightSweep !== 1);
  const Rdr = S.R[pop.dr[0]], Rst = S.R[pop.stars[0]], dm = ph.dispMag;
  const cam = P.camera.scale;
  const draw = DISPLAY.canvasMin.map((cmin) => { const z = cmin / 2 / cam; const px = (R) => Math.max(DISPLAY.floorPx, R * dm * z);
    return { canvasMin: cmin, z, drPx: px(Rdr), starPx: px(Rst), centerPx: px(S.R[pop.center[0]]), drBelowStar: px(Rdr) < px(Rst), starAboveFloor: Rst * dm * z > DISPLAY.floorPx }; });
  return { warnings: v.warnings,
    lengthUnitM: { recomputed: L, declared: rr.lengthUnitM, rel: rel(L, rr.lengthUnitM) },
    dr: { physicalM: rr.physicalM, particleRadius: P.bodies[kDR].particleRadius, recomputed: rr.physicalM / L, relDeclared: rel(P.bodies[kDR].particleRadius, rr.physicalM / L),
      built: Rdr, builtVsFround: Rdr === Math.fround(P.bodies[kDR].particleRadius), rMulAbsent: P.bodies[kDR].rMul === undefined },
    star: { assumedM: rr.starAssumedM, assumedClass: rr.starAssumedClass, particleRadius: P.bodies[kSt].particleRadius, recomputed: PHYS.R_SUN_M / L,
      relDeclared: rel(P.bodies[kSt].particleRadius, PHYS.R_SUN_M / L), built: Rst, builtVsFround: Rst === Math.fround(P.bodies[kSt].particleRadius), rMulAbsent: P.bodies[kSt].rMul === undefined },
    ratioStarOverDR: Rst / Rdr, dispMag: dm, draw,
    ledgerRadii: rr, contactMode: ph.contactMode === undefined ? null : ph.contactMode, centerPinned: P.bodies[0].pinned === true,
    physicalToSimNote: 'L = (G_SI·M_unit/c_SI²)/(G/c²) —— G・c・質量単位から作る長さ単位(m)' };
}

/** (B) E9 が発火しないこと + 第284便a の宣言との力学のビット一致。 */
export function contactInert(HP, steps = E9_STEPS) {
  const snap = (S) => { const a = []; for (let i = 0; i < S.n; i++) a.push(S.x[i], S.y[i], S.vx[i], S.vy[i], S.spin[i]); return a; };
  const runP = (p) => { const v = HP.validatePreset(clone(p)); if (!v.ok) throw new Error(v.errors.join('/')); HP.sim.build(v.preset); const S = HP.sim;
    let ov0 = 0; for (let i = 0; i < S.n; i++) for (let j = i + 1; j < S.n; j++) if (Math.hypot(S.x[i] - S.x[j], S.y[i] - S.y[j]) < S.R[i] + S.R[j]) ov0++;
    const R = S.R[S.n - 1];
    for (let k = 0; k < steps; k++) S.step(DT);
    return { st: snap(S), ov0, R, none: S.contactNone === true }; };
  const same = (a, b) => a.st.length === b.st.length && a.st.every((x, i) => Object.is(x, b.st[i]));
  const nd = (a, b) => { let n = 0; for (let i = 0; i < a.st.length; i++) if (!Object.is(a.st[i], b.st[i])) n++; return n; };
  const cfg = Object.assign({ nRep: 40, seed: 0 }, DECLARED_CFG);
  const a = runP(variantPreset(HP, cfg)), b = runP(variantPreset(HP, Object.assign({ variant: 'bigDR' }, cfg)));
  const c = runP(variantPreset(HP, Object.assign({ variant: 'normal' }, cfg))), d = runP(variantPreset(HP, Object.assign({ variant: 'normalBigDR' }, cfg)));
  const fx = JSON.parse(fs.readFileSync(path.join(ROOT, E284.FIXTURE_284A), 'utf8')).preset;
  const e = runP(fx), f = runP(byId(HP, PRESET));
  return { steps, declared: { contactNone: a.none, Rdr: a.R, overlapPairsT0: a.ov0 }, bigR: { Rdr: b.R, overlapPairsT0: b.ov0 }, bitSame: same(a, b),
    sensitivity: { contactNone: c.none, overlapPairsT0: d.ov0, differingValues: nd(c, d), of: c.st.length },
    vs284a: { fixture: E284.FIXTURE_284A, RdrBefore: e.R, RdrNow: f.R, bitSameDynamics: same(e, f), differingValues: nd(e, f) } };
}

const f3 = (x) => (x === null || x === undefined || !Number.isFinite(x) ? '—' : Number(x).toFixed(3));
/** PHYSICS〔第285便a〕の表の行(QA が正本から作り直して探す)。 */
export function docRows(J) {
  const out = { gates: GATE_TEXT.map((t) => '- ' + t), scan: SCAN_TEXT.map((t) => '- ' + t), scanRows: [], verifyRows: [], diagRows: [], hypothesis: [] };
  const line = (r) => {
    const w = r.gates.worst;
    return `| ${r.key} | ${fmtMc(r.mcOverMdr)} | ${r.spin} | ${r.rDrag} | ${r.init} | ${f3(r.GMoverRc2)} | ${f3(r.orbit.Tout)} | ${f3(w.retStars)}/${f3(w.retDR)} | ${f3(w.rhRelChange)} | ${f3(w.axis)} | ${f3(w.vOverSigma)} | ${r.dominance.worst.map(f3).join('/')} | ${r.gates.verdict}${r.gates.failed.length ? '(' + r.gates.failed.join('・') + ')' : ''} |`;
  };
  for (const r of J.runs) (r.phase === 'scan' ? out.scanRows : out.verifyRows).push(line(r));
  const b = J.runs.find((r) => r.key === J.baseKey);
  const d0 = b.diag.find((z) => z.atOut === 0);
  for (const pop of ['stars', 'dr']) for (const z of d0.bins[pop]) if (z.n)
    out.diagRows.push(`| ${pop === 'stars' ? '恒星' : 'DR'} | [${z.r0}, ${z.r1}) | ${z.n} | ${f3(z.aE4r)} | ${f3(z.aMeshR)} | ${f3(z.aMeshT)} | ${f3(z.vT)} | ${f3(z.sigR)}/${f3(z.sigT)} | ${f3(z.powMesh)} | ${f3(z.powE4)} |`);
  for (const z of J.hypothesis.rows) out.hypothesis.push(`| ${fmtMc(z.mcOverMdr)} | ${f3(z.retStars)}/${f3(z.retDR)} | ${f3(z.rh)} | ${z.verdict} |`);
  return out;
}

const IS_MAIN = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
const TARGET = process.env.QA_TARGET || 'beta/index.html';
if (IS_MAIN && process.argv.includes('--child')) {
  const spec = JSON.parse(process.argv[process.argv.indexOf('--child') + 1]);
  const { loadHtmlMain } = await import('./lib-w280b-emgrid.mjs');
  const { HP } = loadHtmlMain(path.join(ROOT, TARGET));
  process.stdout.write(JSON.stringify(runOne(HP, spec)));
} else if (IS_MAIN) {
  const W281A_SCOPE = w281aScopeStamp(path.join(ROOT, TARGET), REGEN_SCOPE);
  const outDir = path.join(ROOT, 'tests', 'out');
  const { loadHtmlMain } = await import('./lib-w280b-emgrid.mjs');
  const t0 = Date.now();
  const { HP, errors } = loadHtmlMain(path.join(ROOT, TARGET));
  const decl = declarationCheck(HP);
  console.log('(A) ' + JSON.stringify({ L: decl.lengthUnitM, dr: decl.dr.built, star: decl.star.built, draw: decl.draw }));
  const e9 = contactInert(HP);
  console.log('(B) ' + JSON.stringify(e9));
  const NW = Math.max(1, Number(process.env.W285A_WORKERS) || 2);
  const self = fileURLToPath(import.meta.url);
  const runAll = async (specs) => {
    const results = new Array(specs.length); let next = 0;
    const runChild = (idx) => new Promise((res, rej) => {
      const ch = spawn(process.execPath, [self, '--child', JSON.stringify(specs[idx])], { cwd: ROOT, env: process.env });
      let out = '', err = '';
      ch.stdout.on('data', (d) => { out += d; }); ch.stderr.on('data', (d) => { err += d; });
      ch.on('close', (code) => { if (code !== 0) return rej(new Error(specs[idx].key + ': ' + err.slice(0, 600)));
        try { results[idx] = JSON.parse(out); } catch (e) { return rej(e); }
        const r = results[idx], w = r.gates.worst;
        console.log(`${r.phase} ${r.key}: ${r.gates.verdict}${r.gates.failed.length ? '(' + r.gates.failed.join(',') + ')' : ''}・T_out ${r.orbit.Tout.toFixed(2)}・保持 ${f3(w.retStars)}/${f3(w.retDR)}・r_h ${f3(w.rhRelChange)}・軸比 ${f3(w.axis)}・D_A ${r.dominance.worst.map(f3).join('/')}・${r.wallSec.toFixed(0)} s`);
        res(); });
    });
    const order = specs.map((_, i) => i).sort((a, b) => (specs[b].nRep - specs[a].nRep) || (a - b));
    const lane = async () => { while (next < order.length) { const i = order[next++]; await runChild(i); } };
    await Promise.all(Array.from({ length: Math.min(NW, specs.length) }, lane));
    return results;
  };
  const ONLY = process.env.W285A_ONLY ? process.env.W285A_ONLY.split(',') : null;   // 開発用(正本を書くときは使わない)
  const scan = await runAll(scanSpecs().filter((z) => !ONLY || ONLY.includes(z.key)));
  const baseKey = cfgKey(DECLARED_CFG) + '-n' + SCAN.nRep + '-s0';
  const base = scan.find((r) => r.key === baseKey);
  const decision = eqToyDecision(base);
  console.log('(b) 採否: ' + JSON.stringify({ include: decision.include, hits: decision.hits }));
  const verify = (ONLY && !process.env.W285A_VERIFY) ? [] : await runAll(verifySpecs(scan));
  const runs = scan.concat(verify);
  const hyp = ONLY ? null : hypothesisCheck(scan);
  const vsum = {};
  for (const r of verify) { const s = vsum[r.cfg] || (vsum[r.cfg] = { cfg: r.cfg, n: 0, nPass: 0, retStarsMin: 1, rhMax: 0, verdicts: [] });
    s.n++; if (r.gates.verdict === '形状達成') s.nPass++; s.retStarsMin = Math.min(s.retStarsMin, r.gates.worst.retStars); s.rhMax = Math.max(s.rhMax, r.gates.worst.rhRelChange); s.verdicts.push(r.gates.verdict); }
  const anyShape = Object.values(vsum).some((s) => s.nPass === s.n && s.n > 0);
  const CODE = ['tests/exp-w285a-cluster.mjs', 'tests/exp-w284a-cluster.mjs', 'tests/exp-w283f-cluster.mjs', 'tests/lib-w281c-rotorledger.mjs', 'tests/lib-w280b-emgrid.mjs',
    'tests/lib-w279b-headless.mjs', 'tests/lib-w272e-provenance.mjs', 'tests/lib-w281a-scope.mjs'];
  const live285 = (() => { const c = byId0(HP, PRESET); return !!(c && c.massLedger && c.massLedger.version === 'w285a-1'); })();
  const meta = Object.assign(provenanceMeta({ root: ROOT, wave: '第285便a', target: TARGET, code: CODE, inputs: [TARGET, E284.FIXTURE_284A].concat(live285 ? [] : [FIXTURE_285A]) }), {
    harnessVersion: HARNESS_VERSION, loadErrors: errors.length,
    ruling: '原仮定者の裁定(第75報)⑤: 球状星団はまず安定するバランスを見付ける。中心天体の質量を大きくすると拡散しにくくなる。引きずりによる斥力でバランスが取れれば安定する。衝突判定は無いので当たらないが粒子が大き過ぎる。見易さは粒子表示倍率で調整する。ダークローターはコンパクト天体で恒星より小さい',
    reading: '統括の検証項目 R96(半径の分離・DR の物理半径の長さ単位換算・恒星は表示比較の仮定・dispMag・中心質量を増やせば単調に安定するとは現行式では言えない・走査 (a)→(b)→(c)・門は下げない)',
    dt: DT, seeds: SEEDS,
    notClaim: ['形状が安定した', '47 Tuc を再現した', '中心の引きずりが支配的になった', '観測一致を達成した', '較正を完了した', '新発見'] });
  const out = { meta,
    gates: Object.assign({}, GATES, { text: GATE_TEXT, declaredBeforeMeasure: true, source: 'tests/exp-w283f-cluster.mjs' }),
    dominance: Object.assign({}, DOMINANCE, { declaredBeforeMeasure: true, source: 'tests/exp-w284a-cluster.mjs' }),
    scan: Object.assign({}, SCAN, { text: SCAN_TEXT, declaredBeforeMeasure: true }), diagSpec: DIAG, eqToyRule: EQTOY_RULE, hypothesisText: HYPOTHESIS,
    preset: PRESET, declaration: decl, contactInert: e9, baseKey, eqToyDecision: decision, runs,
    verifySummary: Object.values(vsum), hypothesis: hyp,
    verdict: anyShape ? '形状達成' : '未達',
    elapsedS: (Date.now() - t0) / 1000 };
  Object.assign(out.meta, W281A_SCOPE, w281aStableInputs(ROOT, out.meta.inputs));
  if (ONLY) { console.log('W285A_ONLY: 正本は書かない'); console.log(JSON.stringify(out.verifySummary)); }
  else {
    fs.mkdirSync(outDir, { recursive: true });
    fs.writeFileSync(path.join(outDir, 'cluster-w285a.json'), JSON.stringify(out, null, 1) + '\n');
    console.log('→ tests/out/cluster-w285a.json(' + out.elapsedS.toFixed(1) + ' s)・判定 ' + out.verdict + '・仮説 ' + (hyp ? hyp.word : '—'));
  }
}
