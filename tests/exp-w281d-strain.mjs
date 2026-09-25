// 第281便d — 渦伸長便(原仮定者の裁定(第71報)「ナビエ・ストークス方程式の渦伸長(Vortex Stretching)が
//   渦巻銀河の腕に似ているので参考にする」・統括の読み R75)。
//
// ■ 何を測るか(**エンジンへは接続しない・粘性項は足さない・NS は解かない・形状門は足さない**)
//   (0) 単体試験: 純関数 tests/lib-w281d-strain.mjs を解析場 5 種(剛体回転・純ずり・純伸長・点渦・
//       平坦回転曲線)と 2D の埋め込み・3D の対照(Burgers 型)・材料線の独立検算で回す。
//   (a) 🎠 galaxyMeshSpiral の**初期場**(build 直後)を 2 つの読み手で読む:
//         表示 = HP.dfmGalaxyMeshField(S,x,y)(プリセットの宣言 disk/affine/bg static・p は frameWeight)
//         共通 API = HP.dfmField(dfmFieldSnapshot(S).bodies, x, y, options)(scalar・全源・static・p=1・D₀=1.5)
//       r 6 段(20/40/80/120/160/240)× 64 方位で ∇u(4 次の中心差分)→ S・ω_z・発散・条件数・
//       **伸び t̂·S·t̂**(t̂ = lib-w276e-galaxyproto の腕形 armShape から作る対数渦巻の接線 —— 後行/先行の 2 向き)
//       と、2D の埋め込みでの渦伸長項 (ω·∇)u(=== 0 の個数)。差分の ∇u は各読み手が返す解析の gradU と突き合わせる。
//   (b) **既存正本を読むだけ**(再走しない): galaxyproto-w276e.json(宣言したコアの流れ・パターン速度・
//       円盤の Ω(r) の行・材料腕のピッチ列・腕の横断幅の時系列)と corefield-w276d.json(🧹 shapeToyArmCore の
//       横断幅の時系列)。宣言された流れ(剛体回転)には lib を当てて S を数で出す。
//   (c) 「伸び(strain)」1 量の**記録欄**(`strainRecord` —— 門ではない)。QA `docs.galaxyProtoCriteria` が表示する。
//
// 実行: node tests/exp-w281d-strain.mjs(Chromium 不要 —— tests/lib-w279b-headless.mjs で html を Node の vm に読む)
//       環境変数: QA_TARGET(既定 beta/index.html)だけ。
// 出力: tests/out/strain-w281d.json(来歴は lib-w272e-provenance の形・target = beta/index.html)
// 読む正本: tests/out/galaxyproto-w276e.json・tests/out/corefield-w276d.json
//   (**この 2 本を走らせ直したら本器も走らせ直す**。html を変えた統合の後も target の sha がずれるので再走する)
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { loadHtmlHeadless } from './lib-w279b-headless.mjs';
import { provenanceMeta } from './lib-w272e-provenance.mjs';
import * as L from './lib-w281d-strain.mjs';
import { ARM_DEFAULT } from './lib-w276e-galaxyproto.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const TARGET = process.env.QA_TARGET || 'beta/index.html';
const OUT = path.join(ROOT, 'tests', 'out', 'strain-w281d.json');
const GP_CANON = 'tests/out/galaxyproto-w276e.json';
const CF_CANON = 'tests/out/corefield-w276d.json';
const t0 = Date.now();
const log = (...a) => console.error('[w281d]', ...a);
const sig = (x, d = 4) => (x === null || x === undefined || !Number.isFinite(x)) ? null : Number(Number(x).toPrecision(d));

// ---------------------------------------------------------------- 宣言(測る前に書く)
const DECL = {
  radii: [20, 40, 80, 120, 160, 240],
  nPhi: 64,
  h: 0.03,             // 差分の刻み(ε=3 の 1%)。収束は 2h と比べて記録する
  hCheck: 0.06,
  arm: { ...ARM_DEFAULT },   // 腕の接線は armShape の s を使う対数渦巻(m=2・β_s=6 → 与えたピッチ 18.43°)
  unitH: 1e-3,
  note: '伸び(strain)= 材料線の伸び率 t̂·S·t̂。**門ではない**(記録欄)。腕の接線の定義(armShape か実測の A2 位相か)は決断事項候補',
};

// ---------------------------------------------------------------- (0) 単体試験
const units = L.runStrainUnitTests({ h: DECL.unitH });
log('単体試験', units.allPass, units.rows.map((r) => r.id + ':' + (r.maxErr !== undefined ? r.maxErr.toExponential(2) : r.pass)).join(' '));
if (!units.allPass) log('**単体試験が落ちた** —— 以下の実測は参考値');

// ---------------------------------------------------------------- (a) 🎠 の 2 読み手
const H = loadHtmlHeadless(path.join(ROOT, TARGET));
if (!H.HP) throw new Error('HP が無い');
const HP = H.HP;
const P0 = HP.allPresets().find((q) => q.id === 'galaxyMeshSpiral');
if (!P0) throw new Error('🎠 galaxyMeshSpiral が無い');
const v = HP.validatePreset(JSON.parse(JSON.stringify(P0)));
if (!v.ok) throw new Error('🎠 が受理されない');
HP.sim.build(v.preset);
const S = HP.sim;
const C = H.evalExpr('_smMassCentre(HP.sim)');
const snap = HP.dfmFieldSnapshot(S);
if (!snap || !snap.bodies) throw new Error('dfmFieldSnapshot が止まった: ' + (snap && snap.stop));
// 回転の向き = 粒子の角運動量の符号(中心は質量重心)
let Lz = 0;
for (let i = 0; i < S.n; i++) Lz += S.m[i] * ((S.x[i] - C[0]) * S.vy[i] - (S.y[i] - C[1]) * S.vx[i]);
const rotSign = Lz >= 0 ? 1 : -1;
// 後行腕: 外へ進むと回転と逆向きに θ が進む → t_θ の符号 = −rotSign。armTangent は β_s>0 で t_θ>0。
const trailMirror = (rotSign > 0);

const readers = {
  display: {
    label: '表示 dfmGalaxyMeshField(宣言 disk/affine/bg static)',
    u: (x, y) => { const f = HP.dfmGalaxyMeshField(S, x, y, { need: 'u' }); return f ? f.u : null; },
    full: (x, y) => HP.dfmGalaxyMeshField(S, x, y, { need: 'uB' }),
  },
  api: {
    label: '共通 API dfmField(dfmFieldSnapshot: ' + snap.options.lawVersion + '・全源・static・p=' + snap.options.p + '・D₀=' + snap.options.D0 + ')',
    u: (x, y) => { const f = HP.dfmField(snap.bodies, x, y, snap.options); return (f && f.uQuantity === 'velocity') ? f.u : null; },
    full: (x, y) => HP.dfmField(snap.bodies, x, y, snap.options),
  },
};

function statOf(a) {
  const q = a.filter(Number.isFinite);
  if (!q.length) return { mean: null, min: null, max: null, rms: null };
  const m = q.reduce((s, x) => s + x, 0) / q.length;
  return { mean: m, min: Math.min(...q), max: Math.max(...q), rms: Math.sqrt(q.reduce((s, x) => s + x * x, 0) / q.length) };
}
const median = (a) => { const q = a.filter(Number.isFinite).sort((x, y) => x - y); return q.length ? q[Math.floor(q.length / 2)] : null; };

const field = {};
for (const [key, R] of Object.entries(readers)) {
  const rows = [];
  let fdVsAn = 0, hConv = 0, nNull = 0, nStretchZero = 0, nStretchPts = 0, nInPlane = 0, maxStretch3 = 0;
  let nUnValid = 0, fitCondMin = Infinity;
  for (const r of DECL.radii) {
    const acc = { Srr: [], Srt: [], Stt: [], omegaZ: [], div: [], stretchT: [], stretchL: [], compressT: [],
      cond: [], uTheta: [], chi: [], shearMag: [] };
    let pitch = null;
    for (let k = 0; k < DECL.nPhi; k++) {
      const ph = 2 * Math.PI * k / DECL.nPhi;
      const x = C[0] + r * Math.cos(ph), y = C[1] + r * Math.sin(ph);
      const tT = L.armTangent(x, y, { cx: C[0], cy: C[1], p: DECL.arm, mirror: trailMirror });
      const tL = L.armTangent(x, y, { cx: C[0], cy: C[1], p: DECL.arm, mirror: !trailMirror });
      pitch = tT.pitchDeg;
      const sT = L.strainAt(R.u, x, y, { h: DECL.h, tangent: tT.t });
      if (!sT) { nNull++; continue; }
      const sL = L.strainOfGrad(sT.gradU, tL.t);
      const G2 = L.gradAt(R.u, x, y, { h: DECL.hCheck });
      const F = R.full(x, y);
      const Gan = F && F.gradU;
      const scale = Math.max(...sT.gradU.map(Math.abs), 1e-300);
      if (Gan) fdVsAn = Math.max(fdVsAn, Math.max(...Gan.map((g, i) => Math.abs(g - sT.gradU[i]))) / scale);
      if (G2) hConv = Math.max(hConv, Math.max(...G2.map((g, i) => Math.abs(g - sT.gradU[i]))) / scale);
      if (key === 'display' && F) { if (F.unValid === false) nUnValid++; if (Number.isFinite(F.fitCond)) fitCondMin = Math.min(fitCondMin, F.fitCond); }
      const P = L.polarStrain(sT.S, x, y, C[0], C[1]);
      const uu = R.u(x, y);
      const cs = Math.cos(ph), sn = Math.sin(ph);
      acc.Srr.push(P.Srr); acc.Srt.push(P.Srt); acc.Stt.push(P.Stt);
      acc.omegaZ.push(sT.omegaZ); acc.div.push(sT.div); acc.shearMag.push(sT.shearMag);
      acc.stretchT.push(sT.stretch); acc.compressT.push(sT.compress); acc.stretchL.push(sL.stretch);
      acc.cond.push(sT.cond); acc.uTheta.push(-uu[0] * sn + uu[1] * cs);
      if (F && Number.isFinite(F.chi)) acc.chi.push(F.chi);
      // 2D の埋め込みでの渦伸長項
      const vs = L.vortexStretch2D(R.u, x, y, { h: DECL.h });
      if (vs) { nStretchPts++; if (vs.exactZero) nStretchZero++; if (vs.inPlaneOmegaZero) nInPlane++;
        maxStretch3 = Math.max(maxStretch3, ...vs.stretch.map(Math.abs)); }
    }
    const st = (a) => statOf(a);
    const row = { r, pitchDeg: sig(pitch, 6), n: acc.Srr.length };
    for (const k of ['Srr', 'Srt', 'Stt', 'omegaZ', 'div', 'stretchT', 'stretchL', 'compressT', 'uTheta', 'chi', 'shearMag']) {
      const s = st(acc[k]);
      row[k] = { mean: sig(s.mean), min: sig(s.min), max: sig(s.max), rms: sig(s.rms) };
    }
    row.condMedian = sig(median(acc.cond));
    row.condMax = sig(Math.max(...acc.cond.filter(Number.isFinite)));
    // 円運動なら ⟨t̂·S·t̂⟩ = 2⟨S_rθ⟩ t_r t_θ —— 環平均の S_rθ から作った値との比(非円運動の寄与の目安)
    const i = pitch * Math.PI / 180;
    row.stretchCircularFromSrt = sig(2 * st(acc.Srt).mean * Math.sin(i) * Math.cos(i) * (-rotSign));
    rows.push(row);
  }
  field[key] = { label: R.label, rows, nNull, fdVsAnalyticRelMax: sig(fdVsAn, 3), hConvergenceRelMax: sig(hConv, 3),
    vortexStretch2D: { points: nStretchPts, exactZero: nStretchZero, inPlaneOmegaZero: nInPlane, maxAbs: maxStretch3 },
    ...(key === 'display' ? { unValidFalse: nUnValid, fitCondMin: sig(fitCondMin) } : {}) };
  log(key, 'FD↔解析 ∇u 相対', fdVsAn.toExponential(2), 'h 収束', hConv.toExponential(2), '渦伸長 === 0:', nStretchZero + '/' + nStretchPts);
}

// ---------------------------------------------------------------- (b) 既存正本を読むだけ
const GPJ = JSON.parse(fs.readFileSync(path.join(ROOT, GP_CANON), 'utf8'));
const CFJ = JSON.parse(fs.readFileSync(path.join(ROOT, CF_CANON), 'utf8'));
const cross = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
// 宣言した剛体回転 u = Ω×x の 3D の S と (ω·∇)u(局所模型の内側の点)
function rigid3(Om, rMax) {
  const U = (x, y, z) => cross(Om, [x, y, z]);
  const pts = [];
  for (let k = 0; k < 12; k++) { const a = 0.37 + k * 0.91, rr = rMax * (0.2 + 0.8 * k / 11);
    pts.push([rr * Math.cos(a), rr * Math.sin(a), 0.3 * rr * Math.sin(2 * a)]); }
  let sMax = 0, stMax = 0, wErr = 0;
  for (const [x, y, z] of pts) {
    const r = L.vortexStretch3(U, x, y, z, { h: 1e-3 });
    for (let i = 0; i < 3; i++) for (let j = 0; j < 3; j++) sMax = Math.max(sMax, Math.abs(0.5 * (r.J[i][j] + r.J[j][i])));
    stMax = Math.max(stMax, ...r.stretch.map(Math.abs));
    wErr = Math.max(wErr, ...r.omega.map((w, i) => Math.abs(w - 2 * Om[i])));
  }
  return { Omega: Om.map((q) => sig(q, 6)), points: pts.length, SmaxAbs: sMax, stretchMaxAbs: stMax, omegaMinus2OmegaMax: wErr };
}
const imposedPitch = GPJ.stageIII.imposedPitchDeg;
const iRad = imposedPitch * Math.PI / 180, sc = Math.sin(iRad) * Math.cos(iRad);
const gpCores = GPJ.declarations.cores.map((c) => ({ label: c.label, omega_m: c.omega_m, axis: c.axis,
  ...rigid3(c.axis.map((a) => a * c.omega_m), 12) }));
const gpTwo = { id: GPJ.stageII.twoAxis.id, ...rigid3(GPJ.stageII.twoAxis.OmegaTot, 12) };
// パターン腕: φ_c(t) の剛体回転 Ω_p ẑ×x に乗る → 腕形の接線で伸び 0
const pattern = GPJ.stageIII.rows.map((r) => {
  const Op = r.OmegaPattern1;
  const u = (x, y) => [-Op * y, Op * x];
  let m = 0;
  for (const b of GPJ.declarations.run.bins) for (let k = 0; k < 16; k++) {
    const rr = 0.5 * (b.lo + b.hi), a = 2 * Math.PI * k / 16;
    const t = L.armTangent(rr * Math.cos(a), rr * Math.sin(a), { p: ARM_DEFAULT });
    const s = L.strainAt(u, rr * Math.cos(a), rr * Math.sin(a), { h: 1e-3, tangent: t.t });
    m = Math.max(m, Math.abs(s.stretch));
  }
  return { id: r.id, OmegaPattern0: r.OmegaPattern0, OmegaPattern1: r.OmegaPattern1, stretchMaxAbs: m,
    shearMax: r.shearMax, stretchBound: sig(r.shearMax * sc), pitchWindow: r.pitchWindow };
});
// 円盤の Ω(r) の行(粒子の角運動量から作った Ω)→ 隣り合うビンの r dΩ/dr → 与えたピッチの後行腕の伸び
const disks = GPJ.stageII.rows.map((r) => {
  const w = r.omegaRows, pairs = [];
  for (let b = 1; b < w.length; b++) {
    const rdO = (w[b].omega - w[b - 1].omega) / (Math.log(w[b].r) - Math.log(w[b - 1].r));
    const rotS = Math.sign(0.5 * (w[b].omega + w[b - 1].omega)) || 1;
    pairs.push({ r: sig(Math.sqrt(w[b].r * w[b - 1].r)), rdOmega: sig(rdO), stretchTrail: sig(rdO * sc * (-rotS)) });
  }
  const st = statOf(pairs.map((p) => p.stretchTrail));
  return { id: r.id, shearMax: r.shearMax, pairs, stretchTrailMin: sig(st.min), stretchTrailMax: sig(st.max),
    stretchTrailMean: sig(st.mean) };
});
// 材料腕: 調和コア(剪断 0)と宣言した剪断場(平坦回転曲線 —— 宣言値を読んで lib を当てる)
const mats = GPJ.stageIII.material.map((m) => {
  const out = { id: m.id, shearMax: m.shearMax, pitch0: m.pitch0,
    pitchSeries: m.rows.map((q) => [q.t, q.pitchDeg]) };
  if (m.declared) {
    const { vc, rh } = m.declared;
    const u = (x, y) => { const Om = vc / Math.sqrt(x * x + y * y + rh * rh); return [-Om * y, Om * x]; };
    // 器(exp-w276e)の材料線は θ=(β_s/m)ln(r/r₀)(r_min なし)なので、接線も r_min=0 の腕形で作る
    const pLine = { ...ARM_DEFAULT, rmin: 0 };
    const rowsS = [];
    for (const rr of [3, 4.5, 6, 7.5, 9, 10.5, 12]) {
      const th = (pLine.beta_s / pLine.m) * Math.log(rr / pLine.r0), x = rr * Math.cos(th), y = rr * Math.sin(th);
      const t = L.armTangent(x, y, { p: pLine });
      const s = L.strainAt(u, x, y, { h: 1e-3, tangent: t.t });
      rowsS.push({ r: rr, pitchDeg: sig(t.pitchDeg, 6), stretch0: sig(s.stretch), compress0: sig(s.compress), omegaZ: sig(s.omegaZ) });
    }
    out.declaredField = m.declared;
    out.lineSense = 'β_s>0・回転 v>0 → **先行**(外へ進むと回転の向きへ θ が進む)';
    out.stretchAtT0 = rowsS;
    out.pitchMax = Math.max(...m.rows.map((q) => q.pitchDeg));
  } else {
    out.stretchAtT0 = 'shearMax=0(円軌道の角速度が r に依らない)→ 伸び 0';
  }
  return out;
});
// 横断幅の時系列(読むだけ)—— d ln w/dt の直線あてはめ
function lnSlope(ser) {
  const q = ser.filter((p) => Number.isFinite(p[0]) && p[1] > 0);
  const n = q.length, mx = q.reduce((s, p) => s + p[0], 0) / n, my = q.reduce((s, p) => s + Math.log(p[1]), 0) / n;
  let sxy = 0, sxx = 0, syy = 0;
  for (const p of q) { sxy += (p[0] - mx) * (Math.log(p[1]) - my); sxx += (p[0] - mx) ** 2; syy += (Math.log(p[1]) - my) ** 2; }
  const b = sxy / sxx, res = Math.sqrt(Math.max(0, (syy - b * sxy) / Math.max(1, n - 2)));
  const se = res / Math.sqrt(sxx);
  const w = q.map((p) => p[1]), wm = w.reduce((s, x) => s + x, 0) / n;
  return { n, t0: q[0][0], t1: q[n - 1][0], w0: q[0][1], w1: q[n - 1][1], wMean: sig(wm, 6),
    wSd: sig(Math.sqrt(w.reduce((s, x) => s + (x - wm) ** 2, 0) / Math.max(1, n - 1)), 4),
    dlnwdt: sig(b, 4), dlnwdtSe: sig(se, 3), relChange: sig(q[n - 1][1] / q[0][1] - 1, 4) };
}
const widthGP = GPJ.stageI.rows.map((r) => ({ id: r.id, ...lnSlope(r.series.map((s) => [s.t, s.transWidth])) }));
const arm = CFJ.builtins.find((b) => b.id === 'shapeToyArmCore');
const cfDecl = arm.decl.coreField;
const widthCF = { id: arm.id, emoji: '🧹', axis: cfDecl.axis, omegaM: arm.omegaM,
  width0: sig(arm.width0, 6), widthEnd: sig(arm.widthEnd, 6), widthRelMean: sig(arm.widthRelMean, 4),
  stat: lnSlope(arm.statSeries.map((s) => [s.t, s.width])),
  declaredFlow: rigid3(cfDecl.axis.map((a) => a * arm.omegaM), arm.rMaxOverRc * cfDecl.coreRc) };

// ---------------------------------------------------------------- (c) 記録欄「伸び(strain)」
const rowAt = (key, r) => field[key].rows.find((q) => q.r === r);
const strainRecord = {
  quantity: '伸び(strain)', definition: 't̂·S·t̂(材料線の伸び率 d ln|ℓ|/dt・t̂ = armShape の後行腕の接線)',
  gate: false, note: '**記録欄であって門ではない**(docs.galaxyProtoCriteria の表示にだけ出す)',
  galaxyMeshSpiral: DECL.radii.map((r) => ({ r, display: rowAt('display', r).stretchT.mean, api: rowAt('api', r).stretchT.mean })),
  galaxyprotoDeclaredFlow: Math.max(...gpCores.map((c) => c.SmaxAbs), gpTwo.SmaxAbs),
  galaxyprotoPattern: Math.max(...pattern.map((p) => p.stretchMaxAbs)),
  galaxyprotoDiskTrail: disks.map((d) => ({ id: d.id, min: d.stretchTrailMin, max: d.stretchTrailMax })),
  armCoreDeclaredFlow: widthCF.declaredFlow.SmaxAbs,
};

// ---------------------------------------------------------------- 出力
const out = {
  meta: Object.assign(provenanceMeta({ root: ROOT, wave: '第281便d', target: TARGET,
    inputs: [GP_CANON, CF_CANON],
    code: ['tests/exp-w281d-strain.mjs', 'tests/lib-w281d-strain.mjs', 'tests/lib-w276e-galaxyproto.mjs',
      'tests/lib-w274e-armbar.mjs', 'tests/lib-w279b-headless.mjs', 'tests/lib-w272e-provenance.mjs'] }), {
    harness: L.STRAIN_VERSION,
    note: '第281便d — 渦伸長便(原仮定者の裁定(第71報)・統括の読み R75)。**エンジン未接続・粘性項なし・NS ソルバなし・形状門なし**',
    doNotWrite: ['腕が創発した', 'NS を解いた', '腕が力学から出た', '渦伸長で腕を説明した'],
    afterCanon: [GP_CANON, CF_CANON],
    env: { QA_TARGET: TARGET },
  }),
  declarations: DECL,
  identity2D: {
    equation: 'Dω/Dt = (ω·∇)u + ν∇²ω',
    statement: '2D(u=(u_x,u_y,0)・∂_z=0)では ω=(0,0,ω_z) なので (ω·∇)u = ω_z ∂_z u ≡ 0。腕を巻くのは材料線 ℓ̇=(∇u)ℓ の伸び(差動回転)',
    numeric: { display: field.display.vortexStretch2D, api: field.api.vortexStretch2D },
  },
  units,
  galaxyMeshSpiral: { id: 'galaxyMeshSpiral', emoji: '🎠', state: 'build 直後(t=0)', n: S.n,
    centre: C, rotSign, trailingMirror: trailMirror, Lz: sig(Lz, 6), options: snap.options, field },
  galaxyproto: { imposedPitchDeg: imposedPitch, cores: gpCores, twoAxis: gpTwo, pattern, disks, material: mats, widthSeries: widthGP },
  corefield: widthCF,
  strainRecord,
  wallSec: (Date.now() - t0) / 1000,
};
fs.writeFileSync(OUT, JSON.stringify(out, null, 1) + '\n');
log('書いた', path.relative(ROOT, OUT), out.wallSec + ' s');
