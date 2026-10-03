// 第290便e(原仮定者の裁定(第80報)⑤「shapeToyDisk と shapeToyArm を合わせて渦巻き銀河の参照模型/shapeToyDiskCore と
// shapeToyArmCore を合わせて中心天体つき渦巻き銀河の参照模型」・統括の検証項目 R129)—— **渦巻の参照模型の門**の器
// (Node だけ —— 対象 html の inline script を tests/lib-w280b-emgrid.mjs の loadHtmlMain で読む headless)。
//
// ■ 何を測るか(**門は測る前に宣言してある** —— 下の CRIT。未達は未達として正本に残す。許容を広げて通さない)
//   (0) 合成できない理由: JSON の鍵を重ねると最後の shape が勝つ・📀(軸 (0,0,1))と 🧹(軸 (1,0,0))の二次形式の和は
//       定数のヘッセ行列(主軸は直線)・直線の腕(🧵)に同じ回帰を当てるとピッチ角は 90° 付近(渦巻ではない)。
//   ① 成分ごとの数・質量の総和が宣言に一致・重複所属 0(全粒子がちょうど 1 つの成分か pinned)。宣言を崩した写しは止まる。
//   ② 円盤成分の軸比 σ_z/σ_R と腕成分の横断 RMS・厚さ RMS が、単独の本(🥏/🧵・📀/🧹)の同じ窓の値から ±CRIT.shapeRel。
//      腕成分を外した写しが 🥏/📀 とビット同一であること(式と乱数の順序が同じ)。
//   ③ ピッチ角: 腕成分の (ln r, φ−Ω_p t) を腕・時刻ごとに中心化して**直交回帰**(log-polar は等角なので横断のずれは
//      直線に垂直)—— 宣言値との差 ≤ CRIT.pitchDeg。最小二乗(φ を ln r に回帰)も並べて記録する。見た目で判定しない。
//   ④ N/2N/4N・seed 3 つ・刻み h/h2/h4 で形状指標(軸比・横断・厚さ・ピッチ角)の基準からの差と、供給収支(粒子 1 個・単位時間
//      あたりの供給 E)の差。帳簿の恒等式(粒子が受けた E と熱浴の E の和 0・規定運動の成分の運動エネルギーの変化 = 記帳した E)。
//   ⑤ Ω_p=0 でも曲線形状が残る(幾何参照の契約 —— **渦伸長の証拠としない**)。
//   ⑥ G=0/0.8/8 で 600 步の状態が 1 bit 不変(🍭 —— 規定運動の本)。🐌 は G≠0 で円盤成分が centreGravity の門で止まり、
//      腕成分は 1 bit 不変。中心スピン 0 で円盤成分の力が消え(Core 力学の門 —— 📀 と同じ契約)、腕成分は 1 bit 不変。
//      円盤側の宣言(σ)を変えても腕成分は 1 bit 不変(腕の乱数は別の流れ)。
//   ⑦ 宣言の往復(受理 → JSON → 受理で同じ正準形)・⏮(作り直し)で同じ状態・チェックポイント(ckSnapOne/ckRestoreOne)と
//      A/B 複製(cloneSimState)の往復・粒子数別の 1 步の所要(壁時計 —— 揮発値。iPhone の実機は統括が後で)。
//
// ■ しないこと・言わないこと
//   ・観測のピッチ角・軸比を入力しない(宣言値 20°)。許容を広げて門を通さない。
//   ・「渦巻が創発した」「銀河を較正した」「腕が力学的に安定した」「平坦回転曲線」「中心が腕を束ねる」と書かない。
//
// 実行(Node だけ・Chromium 不要): node tests/exp-w290e-spiral.mjs
// 環境変数: W290E_OUT(既定 tests/out/spiral-w290e.json)/ QA_TARGET(既定 beta/index.html)。正本: tests/out/spiral-w290e.json
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { provenanceMeta } from './lib-w272e-provenance.mjs';
import { scopeStamp as w281aScopeStamp, stableInputs as w281aStableInputs } from './lib-w281a-scope.mjs';
const REGEN_SCOPE = {"presets":["shapeToyArm","shapeToyArmCore","shapeToyDisk","shapeToyDiskCore","shapeToySpiral","shapeToySpiralCore"],"roots":["$","DT","HP.allPresets","HP.ckRestoreOne","HP.ckSnapOne","HP.cloneSimStateNow","HP.dfmMeshVelocityFieldAt","HP.loadPreset","HP.shapeToySpiralCentreline","HP.shapeToySpiralState","HP.sim","HP.validatePreset","cw"],"core":true,"consts":[],"complete":true};

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
export const HARNESS_VERSION = 'w290e-spiral-1';
export const IDS = { spiral: 'shapeToySpiral', core: 'shapeToySpiralCore', disk: 'shapeToyDisk', arm: 'shapeToyArm', diskCore: 'shapeToyDiskCore', armCore: 'shapeToyArmCore' };
/** **事前に決めた門**(宣言値。導出ではない —— 門を通すために変えない)。 */
export const CRIT = {
  shapeRel: 0.10,        // ② 単独の本の同じ窓の値からの相対差(軸比・横断 RMS・厚さ RMS)
  pitchDeg: 1.0,         // ③⑤ 直交回帰のピッチ角と宣言値の差(度)
  convRel: 0.10,         // ④ N/2N/4N・seed・刻みで形状指標の基準からの相対差
  convPitchDeg: 1.0,     // ④ 同じくピッチ角の差(度)
  ledgerRel: 1e-9,       // ④ 帳簿の恒等式(ΔK と記帳した E)の相対残差
  tangentUlp: 4,         // 腕成分の接線方向の残差(横断と面外にだけ動く —— s は固定)を**格納精度**で: |残差| ≤ 4·2⁻²⁴·(|x|+|y|)
                         // (エンジンの位置は Float32 に格納される —— 物理の許容ではなく格納の分解能)
};
export const DT = 0.25;
export const T_END = 150;            // 600 步(dt=0.25)
export const SAMPLE_FROM = 50;       // 標本の窓(時刻)
export const SAMPLE_EVERY = 5;
const G_LIST = [0, 0.8, 8];

const clone = (x) => JSON.parse(JSON.stringify(x));
const fnv = (arrs, idx) => { let a = 0x811c9dc5; const b = new ArrayBuffer(8), f = new Float64Array(b), u = new Uint8Array(b);
  for (const A of arrs) for (const i of idx) { f[0] = A[i]; for (let j = 0; j < 8; j++) { a ^= u[j]; a = Math.imul(a, 0x01000193) >>> 0; } }
  return a.toString(16).padStart(8, '0'); };
const allIdx = (S) => Array.from({ length: S.n }, (_, i) => i);
const fpAll = (S) => fnv([S.x, S.y, S.vx, S.vy], allIdx(S));
const r6 = (v) => (Number.isFinite(v) ? Number(v.toPrecision(12)) : v);

export function presetOf(HP, id) { return clone(HP.allPresets().find((p) => p.id === id)); }

/**
 * 粒子数の系列(N/2N/4N)—— 腕成分 nA・円盤成分 2nA(質量比 2 を保つ)・bodies の n を同じ数に(粒子 1 個の質量は同じ)。
 * エンジンの粒子総数の上限 600(受理器が縮める)に 4N が中心 1 体込みで収まるよう **N = 144(円盤 96 + 腕 48)**・2N = 288・4N = 576 と置く
 * (内蔵の 2 本は 450 = 円盤 300 + 腕 150 —— 比べる基準)。
 */
export const N_SERIES = [{ label: 'N', nArm: 48 }, { label: '2N', nArm: 96 }, { label: '4N', nArm: 192 }];
export function withCounts(p, nArmParticles) {
  const q = clone(p); const sp = q.physics.shapeToy.spiral;
  sp.nArmParticles = nArmParticles; sp.nDisk = 2 * nArmParticles;
  const free = q.bodies.filter((b) => b.type !== 'single');
  free[0].n = 2 * nArmParticles; free[1].n = nArmParticles;
  return q;
}

/** 1 本を build して走らせる。標本の時刻に sample(S, t) を呼ぶ。 */
export function run(HP, preset, o = {}) {
  const dt = o.dt || DT, tEnd = o.tEnd || T_END;
  const v = HP.validatePreset(preset);
  if (!v.ok) return { ok: false, errors: v.errors };
  const S = HP.sim; S.build(v.preset);
  const nStep = Math.round(tEnd / dt), every = Math.round(SAMPLE_EVERY / dt), from = Math.round(SAMPLE_FROM / dt);
  const hooks = o.sample || null;
  if (o.atBuild) o.atBuild(S);
  let nan = false;
  for (let k = 1; k <= nStep; k++) {
    S.step(dt);
    if (hooks && k >= from && k % every === 0) hooks(S, S.t);
    if (o.each) o.each(S, k);
  }
  for (let i = 0; i < S.n; i++) if (!(Number.isFinite(S.x[i]) && Number.isFinite(S.y[i]))) { nan = true; break; }
  return { ok: true, S, nStep, nan, preset: v.preset };
}

const centreOf = (S, cf) => { if (cf.center === 'pinned') { for (let i = 0; i < S.n; i++) if (S.pinned[i]) return [S.x[i], S.y[i]]; return null; } return [cf.cx, cf.cy]; };

/** 渦巻の標本を貯める集計器(円盤の軸比・腕の横断/厚さ/接線残差・ピッチ角の点)。 */
export function spiralAccumulator(HP) {
  const acc = { nS: 0, dR2: 0, dZ2: 0, nD: 0, aT2: 0, aTs2: 0, aZ2: 0, nA: 0, tanMax: 0, tanUlp: 0, trStateMax: 0, groups: [] };
  acc.sample = (S, t) => {
    const st = HP.shapeToySpiralState(S); const cf = S.params.shapeToy; const sp = cf.spiral;
    const [cx, cy] = centreOf(S, cf); const th = sp.omegaP * t, ct = Math.cos(th), sn = Math.sin(th);
    const byArm = new Map();
    for (let i = 0; i < S.n; i++) {
      const c = st.comp[i];
      if (c === 1) { const dx = S.x[i] - cx, dy = S.y[i] - cy; acc.dR2 += dx * dx + dy * dy; acc.dZ2 += st.z[i] * st.z[i]; acc.nD++; }
      else if (c === 2) {
        const L = HP.shapeToySpiralCentreline(sp, st.arm[i], st.s[i]);
        const ox = S.x[i] - cx - (ct * L.Cx - sn * L.Cy), oy = S.y[i] - cy - (sn * L.Cx + ct * L.Cy);
        const Nx = ct * L.Nx - sn * L.Ny, Ny = sn * L.Nx + ct * L.Ny, Tx = ct * L.Tx - sn * L.Ty, Ty = sn * L.Tx + ct * L.Ty;
        const tr = ox * Nx + oy * Ny, tg = ox * Tx + oy * Ty;
        acc.aT2 += tr * tr; acc.aTs2 += st.transverse[i] * st.transverse[i]; acc.aZ2 += st.z[i] * st.z[i]; acc.nA++;
        if (Math.abs(tg) > acc.tanMax) acc.tanMax = Math.abs(tg);
        const ulp = Math.abs(tg) / (2 ** -24 * (Math.abs(S.x[i]) + Math.abs(S.y[i])));
        if (ulp > acc.tanUlp) acc.tanUlp = ulp;
        if (Math.abs(tr - st.transverse[i]) > acc.trStateMax) acc.trStateMax = Math.abs(tr - st.transverse[i]);
        const dx = S.x[i] - cx, dy = S.y[i] - cy;
        if (!byArm.has(st.arm[i])) byArm.set(st.arm[i], []);
        byArm.get(st.arm[i]).push([Math.hypot(dx, dy), Math.atan2(dy, dx) - th]);
      }
    }
    for (const pts of byArm.values()) acc.groups.push(pts);
    acc.nS++;
  };
  acc.result = () => ({ samples: acc.nS,
    disk: { sigmaR: Math.sqrt(acc.dR2 / (2 * acc.nD)), sigmaZ: Math.sqrt(acc.dZ2 / acc.nD), axisRatio: Math.sqrt(acc.dZ2 / acc.nD) / Math.sqrt(acc.dR2 / (2 * acc.nD)) },
    arm: { transverseRms: Math.sqrt(acc.aT2 / acc.nA), transverseRmsState: Math.sqrt(acc.aTs2 / acc.nA), thicknessRms: Math.sqrt(acc.aZ2 / acc.nA),
      tangentMaxAbs: acc.tanMax, tangentMaxUlpF32: acc.tanUlp, transverseVsStateMaxAbs: acc.trStateMax },
    pitch: pitchFit(acc.groups) });
  return acc;
}

/** 腕・時刻ごとの点 [r, φ] → r 順に unwrap → 群ごとに中心化 → 直交回帰(TLS)と最小二乗(OLS)の傾き b → p=atan(1/b)。 */
export function pitchFit(groups) {
  let Suu = 0, Svv = 0, Suv = 0, n = 0;
  for (const g0 of groups) {
    const g = g0.filter((z) => z[0] > 0).sort((a, b) => a[0] - b[0]);
    if (g.length < 3) continue;
    const u = [], v = [];
    let prev = null;
    for (const [r, ph] of g) {
      let a = ph;
      if (prev !== null) { let d = a - prev; while (d > Math.PI) d -= 2 * Math.PI; while (d < -Math.PI) d += 2 * Math.PI; a = prev + d; }
      prev = a; u.push(Math.log(r)); v.push(a);
    }
    const mu = u.reduce((s, z) => s + z, 0) / u.length, mv = v.reduce((s, z) => s + z, 0) / v.length;
    for (let i = 0; i < u.length; i++) { const a = u[i] - mu, b = v[i] - mv; Suu += a * a; Svv += b * b; Suv += a * b; }
    n += u.length;
  }
  if (!(n > 2) || Suv === 0) return { n, tlsDeg: null, olsDeg: null };
  const bT = (Svv - Suu + Math.sqrt((Svv - Suu) ** 2 + 4 * Suv * Suv)) / (2 * Suv);
  const bO = Suv / Suu;
  const deg = (b) => Math.atan(1 / b) * 180 / Math.PI;
  return { n, slopeTls: bT, slopeOls: bO, tlsDeg: deg(bT), olsDeg: deg(bO) };
}

/** 単独の本の同じ窓の値: 🥏/📀 は軸比、🧵/🧹 は腕の軸に垂直な面内の RMS と面外の RMS。 */
export function singleAccumulator(kind) {
  const acc = { nS: 0, r2: 0, z2: 0, n: 0, y2: 0 };
  acc.sample = (S) => {
    const cf = S.params.shapeToy; const [cx, cy] = centreOf(S, cf);
    const core = cf.law === 'coreField';
    for (let i = 0; i < S.n; i++) {
      if (S.pinned[i]) continue;
      const z = core ? S.cfZ[i] : cf.sigmaZ * S.zLat[i];
      const dx = S.x[i] - cx, dy = S.y[i] - cy;
      if (kind === 'disk') acc.r2 += dx * dx + dy * dy; else acc.y2 += dy * dy;   // 腕の軸は x(🧵 の直線・🧹 の軸 (1,0,0))
      acc.z2 += z * z; acc.n++;
    }
    acc.nS++;
  };
  acc.result = () => (kind === 'disk'
    ? { samples: acc.nS, sigmaR: Math.sqrt(acc.r2 / (2 * acc.n)), sigmaZ: Math.sqrt(acc.z2 / acc.n), axisRatio: Math.sqrt(acc.z2 / acc.n) / Math.sqrt(acc.r2 / (2 * acc.n)) }
    : { samples: acc.nS, transverseRms: Math.sqrt(acc.y2 / acc.n), thicknessRms: Math.sqrt(acc.z2 / acc.n) });
  return acc;
}

const rel = (a, b) => Math.abs(a / b - 1);

/** (0) 合成できない理由。 */
export function composeReasons(HP) {
  const stacked = JSON.parse('{"shape":"disk","supply":"external-bath","shape":"arm"}');
  const qf = (cf) => { // Φ のヘッセ行列(ω_m は共通の係数として 1 —— 形だけを見る)= α(I − s sᵀ) + β s sᵀ
    const s = cf.axis, H = [[0, 0, 0], [0, 0, 0], [0, 0, 0]];
    for (let a = 0; a < 3; a++) for (let b = 0; b < 3; b++) H[a][b] = cf.alpha * ((a === b ? 1 : 0) - s[a] * s[b]) + cf.beta * s[a] * s[b];
    return H; };
  const dc = presetOf(HP, IDS.diskCore).physics.shapeToy.coreField, ac = presetOf(HP, IDS.armCore).physics.shapeToy.coreField;
  const H1 = qf(dc), H2 = qf(ac), Hs = H1.map((r, a) => r.map((v, b) => v + H2[a][b]));
  const offDiag = Math.max(Math.abs(Hs[0][1]), Math.abs(Hs[0][2]), Math.abs(Hs[1][2]));
  // 直線の腕(🧵)に同じ回帰: 腕の軸は直線で Ω を持たない(φ が ln r に依らない —— 傾き 0 ならピッチ角 90°)
  const acc = { groups: [] };
  const r = run(HP, presetOf(HP, IDS.arm), { sample: (S) => { const pts = []; for (let i = 0; i < S.n; i++) { const R = Math.hypot(S.x[i], S.y[i]); if (R >= 24) pts.push([R, Math.atan2(S.y[i], S.x[i])]); } acc.groups.push(pts); } });
  const pf = pitchFit(acc.groups);
  return { lastShapeWins: stacked.shape, hessianSum: Hs.map((row) => row.map(r6)), hessianSumOffDiagMax: offDiag,
    hessianConstant: true, straightArmPitch: { tlsDeg: r6(pf.tlsDeg), olsDeg: r6(pf.olsDeg), n: pf.n, ran: r.ok },
    note: '鍵を重ねた JSON は最後の shape だけが残る。二次形式の和のヘッセ行列は定数(対角・主軸は座標軸の直線)で、曲がった腕の中心線を定義しない。'
      + '直線の腕に同じ回帰を当てるとピッチ角は 90° 付近(渦巻ではない)' };
}

/** ① 成分の割り当て・数・質量・重複所属と、宣言を崩した写しの停止・受理器の拒否。 */
export function gate1(HP) {
  const rows = [];
  for (const id of [IDS.spiral, IDS.core]) {
    const p = presetOf(HP, id); const v = HP.validatePreset(p); const S = HP.sim; S.build(v.preset);
    const st = HP.shapeToySpiralState(S); const sp = v.preset.physics.shapeToy.spiral;
    let nD = 0, nA = 0, nPin = 0, bad = 0, mD = 0, mA = 0;
    for (let i = 0; i < S.n; i++) {
      const c = st.comp[i];
      if (S.pinned[i]) { nPin++; if (c !== 0) bad++; continue; }
      if (c === 1) { nD++; mD += S.mEff[i]; } else if (c === 2) { nA++; mA += S.mEff[i]; } else bad++;
    }
    const perArm = []; for (let k = 0; k < sp.nArm; k++) perArm.push(st.arm.filter((a, i) => st.comp[i] === 2 && a === k).length);
    rows.push({ id, n: S.n, pinned: nPin, nDisk: nD, nArm: nA, declNDisk: sp.nDisk, declNArm: sp.nArmParticles, perArm,
      unassignedOrDuplicate: bad, massDisk: r6(mD), massArm: r6(mA), massRatio: r6(mD / mA), declMassRatio: sp.massRatio,
      massRatioRel: Math.abs((mD / mA) / sp.massRatio - 1), stop: S.spiralStop,
      ok: nD === sp.nDisk && nA === sp.nArmParticles && bad === 0 && perArm.every((z) => z === sp.nArmParticles / sp.nArm)
        && Math.abs((mD / mA) / sp.massRatio - 1) <= 1e-12 && S.spiralStop === null });
  }
  // 宣言を崩した写し(走らせない —— 止まる)
  const stops = [];
  const tryStop = (label, mut) => { const p = presetOf(HP, IDS.spiral); mut(p); const v = HP.validatePreset(p);
    if (!v.ok) { stops.push({ label, accepted: false, error: String(v.errors && v.errors[0]).slice(0, 120) }); return; }
    const S = HP.sim; S.build(v.preset); S.step(DT); stops.push({ label, accepted: true, stop: S.spiralStop, moved: S.spiralN }); };
  tryStop('nDisk を 2 減らす(数の不一致)', (p) => { p.physics.shapeToy.spiral.nDisk -= 2; });
  tryStop('massRatio を 2→2.5(質量の不一致)', (p) => { p.physics.shapeToy.spiral.massRatio = 2.5; });
  tryStop('pitchDeg=0', (p) => { p.physics.shapeToy.spiral.pitchDeg = 0; });
  tryStop('pitchDeg=90', (p) => { p.physics.shapeToy.spiral.pitchDeg = 90; });
  tryStop('rMin=0', (p) => { p.physics.shapeToy.spiral.rMin = 0; });
  tryStop('nArmParticles を nArm の倍数でなく', (p) => { p.physics.shapeToy.spiral.nArmParticles = 151; });
  tryStop('massRatio 欠落', (p) => { delete p.physics.shapeToy.spiral.massRatio; });
  tryStop('coupling:"feedback"', (p) => { p.physics.shapeToy.coupling = 'feedback'; });
  tryStop('tauGrow>0', (p) => { p.physics.shapeToy.tauGrow = 10; p.physics.shapeToy.sigma0 = 30; });
  tryStop('spiral を shape:"disk" に置く', (p) => { p.physics.shapeToy.shape = 'disk'; p.physics.shapeToy.omegaSpin = 0.05; });
  tryStop('spiral の宣言なし', (p) => { delete p.physics.shapeToy.spiral; });
  { const p = presetOf(HP, IDS.core); p.physics.shapeToy.coreField.axis = [1, 0, 0]; const v = HP.validatePreset(p);
    stops.push({ label: '🐌 の coreField の軸を (1,0,0)', accepted: v.ok, error: v.ok ? null : String(v.errors[0]).slice(0, 120) }); }
  const stopsOk = stops.every((z) => (z.accepted ? (z.stop !== null && z.moved === 0) : true))
    && stops.filter((z) => z.label.startsWith('nDisk') || z.label.startsWith('massRatio を')).every((z) => z.accepted && z.stop !== null);
  return { rows, stops, ok: rows.every((z) => z.ok) && stopsOk };
}

/** 規定運動の成分の運動エネルギー(帳簿の恒等式の照合用)。 */
const kinOf = (S, sel) => { let k = 0; for (let i = 0; i < S.n; i++) if (sel(i)) k += 0.5 * S.mEff[i] * (S.vx[i] * S.vx[i] + S.vy[i] * S.vy[i]); return k; };

/** 1 本の渦巻を測る(標本の集計・帳簿・指紋)。 */
export function measureSpiral(HP, preset, o = {}) {
  const acc = spiralAccumulator(HP);
  let K0 = null, sel = null;
  const r = run(HP, preset, { dt: o.dt, sample: acc.sample, atBuild: (S) => {
    const st = HP.shapeToySpiralState(S); const core = S.params.shapeToy.law === 'coreField';
    sel = (i) => st.comp[i] === 2 || (st.comp[i] === 1 && !core);
    K0 = kinOf(S, sel); } });
  if (!r.ok) return { ok: false, errors: r.errors };
  const S = r.S; const K1 = kinOf(S, sel); const tRun = r.nStep * (o.dt || DT);
  const nPresc = S.spiralN;
  const st = HP.shapeToySpiralState(S);
  const armIdx = allIdx(S).filter((i) => st.comp[i] === 2), diskIdx = allIdx(S).filter((i) => st.comp[i] === 1);
  return { ok: true, nan: r.nan, stop: S.spiralStop, coreStop: S.coreFieldStop, nPrescribed: nPresc, nCore: S.spiralCoreN,
    ...acc.result(),
    ledger: { E: S.spiralE, bathE: S.spiralBathE, sumZero: S.spiralE + S.spiralBathE, dK: K1 - K0,
      dKvsBookedRel: Math.abs((K1 - K0) - S.spiralE) / Math.max(1e-300, K1), supE: S.spiralSupE, detE: S.spiralDetE,
      supplyRate: S.spiralSupE / (tRun * Math.max(1, nPresc)), supEArm: S.spiralSupEArm,
      supplyRateArm: S.spiralSupEArm / (tRun * Math.max(1, S.spiralArmN)),
      coreE: S.coreFieldE, coreReacE: S.coreFieldReacE },
    fp: { all: fpAll(S), arm: fnv([S.x, S.y, S.vx, S.vy], armIdx), disk: fnv([S.x, S.y, S.vx, S.vy], diskIdx) } };
}

/** ② 単独の本と比べる・腕成分を外した写しのビット同一。 */
export function gate2(HP, base) {
  const single = (id, kind) => { const acc = singleAccumulator(kind); const r = run(HP, presetOf(HP, id), { sample: acc.sample }); return { ...acc.result(), nan: r.nan, fp: fpAll(r.S) }; };
  const ref = { disk: single(IDS.disk, 'disk'), arm: single(IDS.arm, 'arm'), diskCore: single(IDS.diskCore, 'disk'), armCore: single(IDS.armCore, 'arm') };
  const cmp = (label, a, b) => ({ label, spiral: r6(a), single: r6(b), rel: r6(rel(a, b)), ok: rel(a, b) <= CRIT.shapeRel });
  const rows = [
    cmp('🍭 円盤の軸比 σ_z/σ_R ↔ 🥏', base.spiral.disk.axisRatio, ref.disk.axisRatio),
    cmp('🍭 腕の横断 RMS ↔ 🧵 の軸に垂直な面内 RMS', base.spiral.arm.transverseRms, ref.arm.transverseRms),
    cmp('🍭 腕の厚さ RMS ↔ 🧵 の面外 RMS', base.spiral.arm.thicknessRms, ref.arm.thicknessRms),
    cmp('🐌 円盤の軸比 σ_z/σ_R ↔ 📀', base.core.disk.axisRatio, ref.diskCore.axisRatio),
    cmp('🐌 腕の横断 RMS ↔ 🧹 の軸に垂直な面内 RMS', base.core.arm.transverseRms, ref.armCore.transverseRms),
    cmp('🐌 腕の厚さ RMS ↔ 🧹 の面外 RMS', base.core.arm.thicknessRms, ref.armCore.thicknessRms)];
  // 腕成分を外した写し(腕の bodies を除き nArmParticles=0・massRatio なし)と 🥏/📀 の 600 步の指紋
  const diskOnly = (id, refId) => { const p = presetOf(HP, id); p.bodies = p.bodies.slice(0, p.bodies.length - 1);
    p.physics.shapeToy.spiral.nArmParticles = 0; delete p.physics.shapeToy.spiral.massRatio;
    const a = run(HP, p); const fa = a.ok ? fpAll(a.S) : 'invalid'; const b = run(HP, presetOf(HP, refId)); const fb = fpAll(b.S);
    return { id, ref: refId, fpCopy: fa, fpRef: fb, same: fa === fb }; };
  const bit = [diskOnly(IDS.spiral, IDS.disk), diskOnly(IDS.core, IDS.diskCore)];
  // 🍭 の円盤成分の指紋と 🥏 の指紋(腕成分があっても円盤成分は 🥏 と同じ乱数の順序で走る)
  const diskSame = base.spiral.fp.disk === ref.disk.fp;
  return { ref: Object.fromEntries(Object.entries(ref).map(([k, v]) => [k, Object.fromEntries(Object.entries(v).map(([a, b]) => [a, typeof b === 'number' ? r6(b) : b]))])),
    rows, diskOnlyBitSame: bit, spiralDiskComponentBitSameAsDisk: diskSame,
    ok: rows.every((z) => z.ok) && bit.every((z) => z.same) && diskSame };
}

/** ③ ピッチ角(基準の走行の直交回帰)。 */
export function gate3(base) {
  const rows = [];
  for (const [k, m] of [['🍭', base.spiral], ['🐌', base.core]]) {
    rows.push({ label: k, declDeg: m.declPitch, tlsDeg: r6(m.pitch.tlsDeg), olsDeg: r6(m.pitch.olsDeg), n: m.pitch.n,
      diffDeg: r6(Math.abs(m.pitch.tlsDeg - m.declPitch)), ok: Math.abs(m.pitch.tlsDeg - m.declPitch) <= CRIT.pitchDeg,
      tangentMaxAbs: m.arm.tangentMaxAbs, tangentMaxUlpF32: r6(m.arm.tangentMaxUlpF32), tangentOk: m.arm.tangentMaxUlpF32 <= CRIT.tangentUlp });
  }
  return { rows, ok: rows.every((z) => z.ok && z.tangentOk) };
}

const shapeIdx = (m) => ({ axisRatio: m.disk.axisRatio, transverseRms: m.arm.transverseRms, thicknessRms: m.arm.thicknessRms, pitchTlsDeg: m.pitch.tlsDeg,
  supplyRate: m.ledger.supplyRate, supplyRateArm: m.ledger.supplyRateArm });

/** ④ N/2N/4N・seed 3 つ・刻み h/h2/h4。 */
export function gate4(HP, base) {
  const out = {};
  let ok = true;
  for (const [key, id] of [['spiral', IDS.spiral], ['core', IDS.core]]) {
    const p0 = presetOf(HP, id); const b = shapeIdx(base[key]);
    const vars = [];
    const add = (label, p, dt) => { const m = measureSpiral(HP, p, { dt }); const s = shapeIdx(m);
      const d = { axisRatio: rel(s.axisRatio, b.axisRatio), transverseRms: rel(s.transverseRms, b.transverseRms), thicknessRms: rel(s.thicknessRms, b.thicknessRms),
        pitchDeg: Math.abs(s.pitchTlsDeg - b.pitchTlsDeg), supplyRate: rel(s.supplyRate, b.supplyRate), supplyRateArm: rel(s.supplyRateArm, b.supplyRateArm) };
      const rowOk = d.axisRatio <= CRIT.convRel && d.transverseRms <= CRIT.convRel && d.thicknessRms <= CRIT.convRel && d.pitchDeg <= CRIT.convPitchDeg
        && Math.abs(m.ledger.sumZero) === 0 && m.ledger.dKvsBookedRel <= CRIT.ledgerRel && !m.nan && m.stop === null;
      ok = ok && rowOk;
      vars.push({ label, n: m.nPrescribed + m.nCore, dt: dt || DT, idx: Object.fromEntries(Object.entries(s).map(([a, v]) => [a, r6(v)])),
        diff: Object.fromEntries(Object.entries(d).map(([a, v]) => [a, r6(v)])), ledgerSumZero: m.ledger.sumZero, dKvsBookedRel: r6(m.ledger.dKvsBookedRel), stop: m.stop, ok: rowOk }); };
    for (const z of N_SERIES) add(z.label + '(' + 3 * z.nArm + ' 個)', withCounts(p0, z.nArm));
    for (const ds of [1, 2]) { const p = clone(p0); p.seed = p0.seed + ds; add('seed+' + ds, p); }
    add('h/2', clone(p0), DT / 2); add('h/4', clone(p0), DT / 4);
    out[key] = { base: Object.fromEntries(Object.entries(b).map(([a, v]) => [a, r6(v)])), variants: vars };
  }
  // 参考(門にしない): 単独の本(🥏/📀)自身の粒子数・seed 依存 —— 円盤成分の則は 🥏/📀 と同じなので、同じ窓の軸比のばらつきは
  //   単独の本にもある(円盤の OU は ω₀=0.01 で相関時間 ~100 —— 窓 50〜150 は 1 相関時間・初期配置の σ_R は宣言 44 より小さい)
  const refRun = (id, nDisk, ds) => { const p = presetOf(HP, id); const fb = p.bodies.find((b) => b.type !== 'single'); if (nDisk) fb.n = nDisk; if (ds) p.seed += ds;
    const acc = singleAccumulator('disk'); run(HP, p, { sample: acc.sample }); return acc.result(); };
  out.refDisk = {};
  for (const [key, id] of [['disk', IDS.disk], ['diskCore', IDS.diskCore]]) {
    const b0 = refRun(id);
    out.refDisk[key] = { id, base: { n: 300, axisRatio: r6(b0.axisRatio), sigmaR: r6(b0.sigmaR), sigmaZ: r6(b0.sigmaZ) },
      variants: N_SERIES.map((z) => ({ label: z.label, nDisk: 2 * z.nArm })).concat([{ label: 'seed+1', ds: 1 }, { label: 'seed+2', ds: 2 }]).map((z) => {
        const m = refRun(id, z.nDisk, z.ds); return { label: z.label, nDisk: z.nDisk || 300, axisRatio: r6(m.axisRatio), sigmaR: r6(m.sigmaR), sigmaZ: r6(m.sigmaZ), diff: r6(rel(m.axisRatio, b0.axisRatio)) }; }) };
  }
  out.note = '形状指標(軸比・横断・厚さ・ピッチ角)は門(CRIT.convRel・convPitchDeg)・供給収支(粒子 1 個・単位時間あたりの供給 E)は差を記録するだけ(門にしない)。'
    + '帳簿の恒等式(粒子が受けた E + 熱浴の E = 0・規定運動の成分の ΔK = 記帳した E)は門';
  out.ok = ok;
  return out;
}

/** ⑤ Ω_p=0。 */
export function gate5(HP) {
  const rows = [];
  for (const id of [IDS.spiral, IDS.core]) {
    const p = presetOf(HP, id); p.physics.shapeToy.spiral.omegaP = 0;
    const m = measureSpiral(HP, p); const decl = p.physics.shapeToy.spiral.pitchDeg;
    rows.push({ id, omegaP: 0, tlsDeg: r6(m.pitch.tlsDeg), olsDeg: r6(m.pitch.olsDeg), diffDeg: r6(Math.abs(m.pitch.tlsDeg - decl)),
      ok: Math.abs(m.pitch.tlsDeg - decl) <= CRIT.pitchDeg && m.stop === null });
  }
  return { rows, ok: rows.every((z) => z.ok), note: 'Ω_p=0 でも腕の曲がりは残る —— 幾何の宣言の帰結(渦伸長の証拠ではない)' };
}

/** ⑥ G・中心スピン・円盤側の宣言に対する不変性。 */
export function gate6(HP) {
  const fpRun = (p) => { const r = run(HP, p); const S = r.S; const st = HP.shapeToySpiralState(S);
    const arm = allIdx(S).filter((i) => st.comp[i] === 2), disk = allIdx(S).filter((i) => st.comp[i] === 1);
    return { all: fpAll(S), arm: fnv([S.x, S.y, S.vx, S.vy], arm), disk: fnv([S.x, S.y, S.vx, S.vy], disk), stop: S.spiralStop, coreStop: S.coreFieldStop, coreN: S.coreFieldN, S, disk_i: disk }; };
  const gS = G_LIST.map((G) => { const p = presetOf(HP, IDS.spiral); p.physics.G = G; const f = fpRun(p); return { G, fp: f.all, stop: f.stop }; });
  const gC = G_LIST.map((G) => { const p = presetOf(HP, IDS.core); p.physics.G = G; const f = fpRun(p); return { G, fpArm: f.arm, fpDisk: f.disk, coreStop: f.coreStop }; });
  // 中心スピン 0(🐌): Core 力学の門で円盤成分の力が消える —— 円盤成分の速度は 600 步で変わらない(G=0 の慣性運動)
  const pz = presetOf(HP, IDS.core); pz.bodies[0].spin = 0;
  let v0 = null;
  const rz = run(HP, pz, { atBuild: (S) => { v0 = { vx: Array.from(S.vx), vy: Array.from(S.vy) }; } });
  const Sz = rz.S; const stz = HP.shapeToySpiralState(Sz);
  let dvMax = 0; for (let i = 0; i < Sz.n; i++) if (stz.comp[i] === 1) dvMax = Math.max(dvMax, Math.abs(Sz.vx[i] - v0.vx[i]), Math.abs(Sz.vy[i] - v0.vy[i]));
  const armZ = fnv([Sz.x, Sz.y, Sz.vx, Sz.vy], allIdx(Sz).filter((i) => stz.comp[i] === 2));
  const spinZero = { coreStop: Sz.coreFieldStop, coreN: Sz.coreFieldN, diskVelocityMaxChange: dvMax, fpArm: armZ, fpArmSpin1: gC[0].fpArm, armSame: armZ === gC[0].fpArm };
  // 📀 の同じ契約(中心スピン 0 で門)
  const pd = presetOf(HP, IDS.diskCore); pd.bodies[0].spin = 0; const rd = run(HP, pd); const diskCoreSpinZeroStop = rd.S.coreFieldStop;
  // 円盤側の宣言(σ_R=44→30)を変えても 🍭 の腕成分は 1 bit 不変
  const pa = presetOf(HP, IDS.spiral); const fa0 = fpRun(pa).arm; const pb = presetOf(HP, IDS.spiral); pb.physics.shapeToy.sigma = 30; pb.physics.shapeToy.sigma0 = 30; const fb0 = fpRun(pb).arm;
  const ok = gS.every((z) => z.fp === gS[0].fp && z.stop === null) && gC.every((z) => z.fpArm === gC[0].fpArm)
    && gC.slice(1).every((z) => z.coreStop === 'gravityDouble') && gC[0].coreStop === null
    && spinZero.coreStop !== null && spinZero.coreN === 0 && spinZero.diskVelocityMaxChange === 0 && spinZero.armSame
    && diskCoreSpinZeroStop === spinZero.coreStop && fa0 === fb0;
  return { spiralG: gS, coreG: gC, spinZero, diskCoreSpinZeroStop, armIndependentOfDiskSigma: { fpArmSigma44: fa0, fpArmSigma30: fb0, same: fa0 === fb0 }, ok };
}

/** ⑦ 往復と所要。 */
export function gate7(HP) {
  const rows = [];
  const canonSame = (id) => { const v1 = HP.validatePreset(presetOf(HP, id)); const v2 = HP.validatePreset(clone(v1.preset));
    return JSON.stringify(v1.preset.physics.shapeToy) === JSON.stringify(v2.preset.physics.shapeToy); };
  const res = {};
  for (const [key, id] of [['spiral', IDS.spiral], ['core', IDS.core], ['disk', IDS.disk]]) {
    const o = { id, canonRoundTrip: id === IDS.disk ? null : canonSame(id) };
    // ⏮(作り直し): 走らせた後に build し直すと初期状態と同じ・600 步も同じ
    HP.loadPreset(id); const S = HP.sim; const f0 = fpAll(S);
    for (let k = 0; k < 300; k++) S.step(DT);
    HP.loadPreset(id); const f0b = fpAll(S);
    for (let k = 0; k < 600; k++) S.step(DT); const fA = fpAll(S);
    HP.loadPreset(id); for (let k = 0; k < 600; k++) S.step(DT); const fB = fpAll(S);
    o.resetSameInit = f0 === f0b; o.resetSameRun = fA === fB;
    // チェックポイント: 200 步 → 保存 → 200 步(指紋 a)→ 復元 → 200 步(指紋 b)
    HP.loadPreset(id); for (let k = 0; k < 200; k++) S.step(DT);
    const snap = HP.ckSnapOne(S); const fSave = fpAll(S);
    for (let k = 0; k < 200; k++) S.step(DT); const fa = fpAll(S);
    HP.ckRestoreOne(S, snap); const fRest = fpAll(S);
    for (let k = 0; k < 200; k++) S.step(DT); const fb = fpAll(S);
    o.checkpoint = { restoredStateSame: fRest === fSave, continuationSame: fa === fb };
    // A/B 複製(t=0 と t=50 で複製して 200 步)
    const abCopy = (k0) => { HP.loadPreset(id); for (let k = 0; k < k0; k++) S.step(DT); const B = HP.cloneSimStateNow(); const same0 = fpAll(B) === fpAll(S);
      for (let k = 0; k < 200; k++) { S.step(DT); B.step(DT); } return { at: k0 * DT, copiedSame: same0, after200Same: fpAll(B) === fpAll(S) }; };
    o.ab = [abCopy(0), abCopy(200)];
    res[key] = o;
  }
  // 粒子数別の 1 步の所要(壁時計 —— 揮発値)
  const timing = [];
  const timeIt = (label, p, steps) => { const v = HP.validatePreset(p); const S = HP.sim; S.build(v.preset); for (let k = 0; k < 20; k++) S.step(DT);
    const t0 = process.hrtime.bigint(); for (let k = 0; k < steps; k++) S.step(DT); const sec = Number(process.hrtime.bigint() - t0) / 1e9;
    timing.push({ label, n: S.n, steps, wallSec: sec, rateStepsPerSec: steps / sec }); };
  for (const z of N_SERIES) timeIt('🍭 ' + z.label, withCounts(presetOf(HP, IDS.spiral), z.nArm), 200);
  timeIt('🍭 内蔵(450)', presetOf(HP, IDS.spiral), 200);
  for (const z of N_SERIES) timeIt('🐌 ' + z.label, withCounts(presetOf(HP, IDS.core), z.nArm), 200);
  timeIt('🐌 内蔵(451)', presetOf(HP, IDS.core), 200);
  timeIt('🥏', presetOf(HP, IDS.disk), 200); timeIt('📀', presetOf(HP, IDS.diskCore), 200);
  const ok = ['spiral', 'core'].every((k) => res[k].canonRoundTrip && res[k].resetSameInit && res[k].resetSameRun && res[k].ab[0].after200Same);
  return { rows: res, timing: { rows: timing, note: 'Node headless の壁時計(揮発値)。iPhone の実機は統括が後で測る' },
    checkpointNote: 'ckSnapOne/ckRestoreOne は形状トイの潜在(🥏 の yLat 等・渦巻の sp*)を運ばない —— 復元後の継続は保存側と一致しない(既存の 🥏 と同じ)。A/B 複製も潜在を写さない(t>0 の複製は B 側が build 時の潜在から続く)。'
      + 'どちらも第290便d の「再開保存の棚卸し」の対象(本便は CK_* と cloneSimState を変えない)',
    ok, okNote: '門 ⑦ の合否は 宣言の往復・⏮ の作り直し・t=0 の A/B 複製 で判定する。チェックポイントと t>0 の A/B は記録(既存の形状トイと同じ制約)' };
}

const IS_MAIN = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (IS_MAIN) {
  const TARGET = process.env.QA_TARGET || 'beta/index.html';
  const OUT_PATH = process.env.W290E_OUT || path.join(ROOT, 'tests', 'out', 'spiral-w290e.json');
  const W281A_SCOPE = w281aScopeStamp(path.join(ROOT, TARGET), REGEN_SCOPE);
  const { loadHtmlMain } = await import('./lib-w280b-emgrid.mjs');
  const t0 = Date.now();
  const { HP, errors } = loadHtmlMain(path.join(ROOT, TARGET));
  const decl = (id) => { const p = presetOf(HP, id); const s = p.physics.shapeToy; return { id, emoji: p.emoji, name: p.name, familyId: p.familyId, familyRole: p.familyRole,
    law: s.law || 'ou', spiral: s.spiral, disk: { sigma: s.sigma, sigmaZ: s.sigmaZ, omega0: s.omega0, gamma: s.gamma }, coreField: s.coreField || null,
    centre: p.bodies[0].type === 'single' ? { m: p.bodies[0].m, radius: p.bodies[0].radius, spin: p.bodies[0].spin, pinned: p.bodies[0].pinned } : null, seed: p.seed }; };
  const R = { declarations: [decl(IDS.spiral), decl(IDS.core)] };
  R.compose = composeReasons(HP); console.log(`(0) 最後の shape: ${R.compose.lastShapeWins}・直線の腕のピッチ角 ${R.compose.straightArmPitch.tlsDeg}°`);
  R.gate1 = gate1(HP); console.log(`① ${R.gate1.ok} ${JSON.stringify(R.gate1.rows.map((z) => [z.id, z.nDisk, z.nArm, z.massRatio, z.unassignedOrDuplicate]))}`);
  const base = {};
  for (const [k, id] of [['spiral', IDS.spiral], ['core', IDS.core]]) { const p = presetOf(HP, id); base[k] = measureSpiral(HP, p); base[k].declPitch = p.physics.shapeToy.spiral.pitchDeg; }
  R.base = Object.fromEntries(Object.entries(base).map(([k, m]) => [k, { disk: m.disk, arm: m.arm, pitch: m.pitch, ledger: m.ledger, stop: m.stop, coreStop: m.coreStop,
    nPrescribed: m.nPrescribed, nCore: m.nCore, nan: m.nan, samples: m.samples, fp: m.fp }]));
  R.gate2 = gate2(HP, base); console.log(`② ${R.gate2.ok} ${R.gate2.rows.map((z) => z.label + ' ' + z.spiral + '/' + z.single + ' ' + z.rel).join(' | ')}`);
  R.gate3 = gate3(base); console.log(`③ ${R.gate3.ok} ${JSON.stringify(R.gate3.rows)}`);
  R.gate4 = gate4(HP, base); console.log(`④ ${R.gate4.ok} ` + ['spiral', 'core'].map((k) => R.gate4[k].variants.map((v) => v.label + ':' + JSON.stringify(v.diff)).join(' ')).join(' || '));
  R.gate5 = gate5(HP); console.log(`⑤ ${R.gate5.ok} ${JSON.stringify(R.gate5.rows)}`);
  R.gate6 = gate6(HP); console.log(`⑥ ${R.gate6.ok} G ${R.gate6.spiralG.map((z) => z.fp).join(',')} / core ${R.gate6.coreG.map((z) => z.fpArm + ':' + z.coreStop).join(',')} / spin0 ${JSON.stringify(R.gate6.spinZero)}`);
  R.gate7 = gate7(HP); console.log(`⑦ ${R.gate7.ok} ${JSON.stringify(R.gate7.rows)}`);
  for (const z of R.gate7.timing.rows) console.log(`   ${z.label} n=${z.n}: ${(1000 / z.rateStepsPerSec).toFixed(3)} ms/步`);
  R.gates = { g1: R.gate1.ok, g2: R.gate2.ok, g3: R.gate3.ok, g4: R.gate4.ok, g5: R.gate5.ok, g6: R.gate6.ok, g7: R.gate7.ok };
  R.criteria = CRIT;
  R.position = {
    spiral: '参照模型 = 宣言した渦巻の形を保つ基準(将来の慣性決定力の連鎖〔第290便c の経路〕と比べる物差し)。腕の幾何は宣言であり、計算から出てきた模様ではない',
    core: '中心つき幾何参照 —— 中心(📀 と同じ)は円盤成分だけを Core 力学で束ね、腕成分は規定運動。腕の中心線への復元 Φ_arm=½k_arm d⊥² の追加構成則は本便では実装していない(「中心が腕を束ねる」とは書かない)',
    kArmImplemented: false };
  const CODE = ['tests/exp-w290e-spiral.mjs', 'tests/lib-w280b-emgrid.mjs', 'tests/lib-w272e-provenance.mjs', 'tests/lib-w281a-scope.mjs'];
  const meta = Object.assign(provenanceMeta({ root: ROOT, wave: '第290便e', target: TARGET, code: CODE, inputs: [TARGET] }), {
    harnessVersion: HARNESS_VERSION, loadErrors: errors.length,
    ruling: '原仮定者の裁定(第80報)⑤ 渦巻銀河の参照模型 2 本(shapeToyDisk+shapeToyArm/shapeToyDiskCore+shapeToyArmCore)',
    reading: '統括の検証項目 R129(新設 2 本だけ —— 既存の本は 1 bit 不変・S._core 不変・既存 3 shape の経路は不変・観測のピッチ角/軸比を入力しない・門は作る前に宣言)',
    engine: 'Node の headless(tests/lib-w280b-emgrid.mjs の loadHtmlMain —— html の本文をそのまま実行)',
    notClaim: ['渦巻が創発した', '銀河を較正した', '腕が力学的に安定した', '平坦回転曲線', '中心が腕を束ねる', '観測一致'] });
  const out = { meta, ...R };
  out.ok = Object.values(R.gates).every(Boolean) && errors.length === 0;
  out.elapsedS = (Date.now() - t0) / 1000;
  Object.assign(out.meta, W281A_SCOPE, w281aStableInputs(ROOT, out.meta.inputs));
  fs.mkdirSync(path.dirname(OUT_PATH), { recursive: true });
  fs.writeFileSync(OUT_PATH, JSON.stringify(out, null, 1) + '\n');
  console.log('→ ' + path.relative(ROOT, OUT_PATH) + '(' + out.elapsedS.toFixed(1) + ' s)・ok ' + out.ok + ' ' + JSON.stringify(R.gates));
}
