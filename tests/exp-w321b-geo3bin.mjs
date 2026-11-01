// 第321便b(原仮定者の予定(第123報)「geoPN=3の予定: 連星サンプル群のgeoPN=3版を用意する」・統括の検証項目 R267 —— 策定の段 S1):
// **連星の geoPN=3 版の S1 の器**(段 geo3bin-321b —— 正本 tests/out/geo3bin-w321b.json)。html・エンジン・在位の本は変えない(器・lib・正本・文書だけ —— 内蔵の本は足さない)。
//
// Node だけ(対象 html の inline script を tests/lib-w280b-emgrid.mjs の loadHtmlMain で読み、validatePreset・geoModeOf・coord3d.makeSim・build・step と読み口
// geoLawOfSim・geoEffectiveMode をそのまま呼ぶ)。走行は子プロセス(W321B_WORKERS —— 既定 2)。写しの宣言は器の中で組む(tests/lib-w321b-geo3bin.mjs の siblingOf)。
//
// ■ 段
//   I 在位の連星の一覧(受理した宣言から —— 連星の 3 族〔calTargetOf の式の写し〕の全本 + 原理の連星の名指し): 宣言の geoPN・kFrame・λ_PN・座標・relativeDrag の law・
//     宣言から解決する法則(geoModeOf)と build した S の法則(geoLawOfSim)・実効番号(geoEffectiveMode)の一致・S.spin の値(宣言と状態)と観測の自転のチャネル
//     (pulse・spinDipole —— 読み取り専用)・三次元で拒否される天体の鍵・質量の由来の表(MASS_BASIS)・較正母集団(SAMPLE_STATUS の calibration の 4 値)。
//   A 受理の表: 兄弟の写し(玩具 4・シリウス・α Cen × 列)の受理と宣言 → 実行の法則・J の列の宣言の可否(f の天体ごと・spinDrag 無し・dragCore と一緒・添字の範囲の外 ——
//     群を前置しない二体の形)・NS の本の三次元の写し(素の写しの拒否の理由と、観測の自転を S.spin へ写したときの値域の飽和・R_d > R の警告)。
//   E 走行(子プロセス): 系 × 列 × 刻み h・h/2・h/4 × 窓 N 公転(遠点から —— 近点を N 回含む)+ 回転の共変(三次元の列を任意の向きへ回した写し・h)+ α Cen の J の列。
//   T 量ごとの表(近点の率〔離心ベクトルの回帰が主・検出器 B が副〕・周期・離心率 —— 差 g1_3d − off・gl − off・tr − gl・tr − off・tr − g1_3d・on − tr・g1_3d − g1_2d と
//     解析の目安との比・刻みの帯)・エネルギーと角運動量の口座・ビットの比較(面への退化・二次元の経路の鍵・無自転の on = tr)・回転の共変。
//   X 既存の器の除外(AN492 —— 新しい連星の本を足したときに「新しい本を無視する除外」に落ちる器・QA と、宣言の条件に当たる器 —— 静的な読み)。
//   N NS の観測の自転の経路の材料(段 I・A から —— 観測の Ω と S.spin の値域・R_d/R・三次元で拒否される鍵)。
//   F 第一陣の順の材料(AN499 —— 系ごとの費用〔段 E の秒〕・門・宣言の要るもの)。
//
// ■ 試走: W321B_QUICK=1(W321B_OUT が要る —— 正本を書かない・窓 3 公転・刻み h・h/2・玩具 2 つ)。W321B_WORKERS(既定 2)。W321B_TARGET(既定 beta/index.html)。
// ■ 言わないこと: 写しの比較を連星の観測との照合と呼ばない・近点の移動の原因を述べない・法則の検証と呼ばない・h・h/2・h/4 を収束の判定に使わない(刻みの感度診断)・
//   ビット同一でない量を同じと呼ばない。周期だけの一致を系全体の合格に広げない(量ごとの表)。解析の目安は二体の 1PN の式と一次の予測で、観測ではない。
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { loadHtmlMain } from './lib-w280b-emgrid.mjs';
import { provenanceMeta } from './lib-w272e-provenance.mjs';
import { scopeStamp as w281aScopeStamp, stableInputs as w281aStableInputs } from './lib-w281a-scope.mjs';
import * as AP from './lib-w304e-apsis.mjs';
import * as L from './lib-w321b-geo3bin.mjs';
import { isRuleBookNoCopy, RULE_BOOKS_WHY } from './lib-w320d-rulebooks.mjs';
// 第281便a の領域 hash の宣言(器と lib から deriveScope で引いた下限 —— 段 I が内蔵の全本から連星を宣言で数え上げるので presets は "all"〔後に入る連星の本は一覧に入る ——
//   除外を置かない〕。calTargetOf は lib の式の写しと同じ名の html の関数 —— 下限に入れて html の分類が変われば作り直す)
const REGEN_SCOPE = {"presets":"all","roots":["$","HP.MASS_BASIS","HP.REL_DRAG_INVSQ_VERSION","HP.allPresets","HP.coord3d","HP.dfmMeshVelocityFieldAt","HP.geoEffectiveMode","HP.geoLawOfSim","HP.geoModeOf","HP.inertialDragLedgerOf","HP.sim","HP.validatePreset","T","calTargetOf","ctx","cw","pnSource"],"core":true,"consts":[],"complete":true};

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
export const HARNESS_VERSION = 'w321b-geo3bin-1';
const IS_MAIN = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
const clone = (x) => JSON.parse(JSON.stringify(x));
export const NOT_CLAIM = Object.freeze(['写しの比較を連星の観測との照合と呼ばない(量ごとの差の表)', '近点の移動の原因を述べない', '法則の検証と呼ばない',
  'h・h/2・h/4 を収束の判定に使わない(刻みの感度診断)', '周期だけの一致を系全体の合格に広げない', '解析の目安を観測と呼ばない(二体の 1PN の式と一次の予測)',
  'NS の経路の案を実装したと書かない(設計の案 —— エンジンは変えない)']);
export const OUT_MAIN = 'tests/out/geo3bin-w321b.json';
export const TPL_ID = 'alphaCenAB';                 // 玩具の物理の宣言の雛形(在位の恒星連星の型)
export const SYSTEMS = Object.freeze([
  Object.freeze({ key: 'sirius', id: 'siriusAB', ja: 'シリウス AB(無自転の対照 —— S.spin = 0 は採用の宣言)', cols: L.MAIN_COLS }),
  Object.freeze({ key: 'acen', id: 'alphaCenAB', ja: 'α Cen AB(両星に非零の spin)', cols: L.MAIN_COLS })]);
export const PLAN = Object.freeze({ N: 8, divs: Object.freeze([1, 2, 4]), toys: Object.freeze(L.TOYS.map((t) => t.key)), rotCols: Object.freeze(['g1_3d', 'tr', 'on']),
  rotDeg: L.ROT_DEG, jDivs: Object.freeze([1, 2, 4]), apsisK: 3, bitCols: Object.freeze(['g1_2dx']) });
export const QUICK = Object.freeze({ N: 3, divs: Object.freeze([1, 2]), toys: Object.freeze(['eq-e', 'r3-e']), rotCols: Object.freeze(['tr']), rotDeg: L.ROT_DEG, jDivs: Object.freeze([1]), apsisK: 3, bitCols: Object.freeze(['g1_2dx']) });

/* ───────── 本の引き方 ───────── */
const findBook = (HP, id) => HP.allPresets().find((p) => p.id === id) || null;
export function baseOf(HP, sys) {
  const t = L.TOYS.find((z) => z.key === sys);
  if (t) return L.toyBook(t, findBook(HP, TPL_ID).physics);
  const s = SYSTEMS.find((z) => z.key === sys);
  return clone(findBook(HP, s.id));
}
export function bookOfSpec(HP, sp) {
  const base = baseOf(HP, sp.sys);
  return L.siblingOf(base, sp.col, { rot: sp.rot ? L.rotZXZ(sp.rot) : null, tag: sp.rot ? 'rot' : null });
}
const hashOf = (arrs) => { const h = crypto.createHash('sha256'); for (const a of arrs) h.update(Buffer.from(new Float64Array(Array.from(a)).buffer)); return h.digest('hex').slice(0, 16); };

/* ───────── 1 本の走行(子プロセスの中) ───────── */
export function runBook(HP, book, o) {
  const t0 = Date.now();
  const v = HP.validatePreset(clone(book));
  if (!v.ok) return { status: 'rejected', errors: (v.errors || []).slice(0, 6).map((z) => String(z).slice(0, 240)) };
  const gm = HP.geoModeOf(v.preset.physics);
  const S = HP.coord3d.makeSim(); S.build(clone(v.preset));
  const lawSim0 = HP.geoLawOfSim(S), ge = HP.geoEffectiveMode(S), c3 = S.coord3d === true, ci = 0, oi = 1, dt = o.dt, N = o.N;
  const zz = (i) => (c3 ? S.z[i] : 0), vzz = (i) => (c3 ? S.vz[i] : 0);
  const rel = () => [S.x[oi] - S.x[ci], S.y[oi] - S.y[ci], zz(oi) - zz(ci)];
  const relV = () => [S.vx[oi] - S.vx[ci], S.vy[oi] - S.vy[ci], vzz(oi) - vzz(ci)];
  const G = S.params.G, eps = S.params.softening || 0, mu = G * (S.m[ci] + S.m[oi]);
  const energy = () => { let k = 0, u = 0; for (let i = 0; i < S.n; i++) k += 0.5 * S.m[i] * (S.vx[i] ** 2 + S.vy[i] ** 2 + vzz(i) ** 2);
    for (let i = 0; i < S.n; i++) for (let j = i + 1; j < S.n; j++) { const dx = S.x[j] - S.x[i], dy = S.y[j] - S.y[i], dz = zz(j) - zz(i); u -= G * S.m[i] * S.m[j] / Math.sqrt(dx * dx + dy * dy + dz * dz + eps * eps); } return k + u; };
  const momentum = () => { const P = [0, 0, 0], Lz = [0, 0, 0]; for (let i = 0; i < S.n; i++) { const m = S.m[i], r = [S.x[i], S.y[i], zz(i)], w = [S.vx[i], S.vy[i], vzz(i)]; P[0] += m * w[0]; P[1] += m * w[1]; P[2] += m * w[2]; const c = L.cross(r, w); Lz[0] += m * c[0]; Lz[1] += m * c[1]; Lz[2] += m * c[2]; } return { P, L: Lz }; };
  const r0 = rel(), v0 = relV(), W = L.unit(L.cross(r0, v0)), Pu = L.unit(r0), Qu = L.cross(W, Pu);
  const angOf = (d) => Math.atan2(L.dot(d, Qu), L.dot(d, Pu));
  const E0 = energy(), M0 = momentum(), h0 = L.nrm(L.cross(r0, v0)), spin0 = Array.from(S.spin);
  const TS = [], EP = [], EQ = [], TH = [], rev = [], peri = [], apo = [];
  let angPrev = angOf(r0), angAcc = 0, thAcc = angPrev, r1 = L.nrm(r0), r2 = r1, P1 = r0, P2 = r0, k = 0, nan = false, dEmax = 0, t = 0, spinDmax = 0;
  const maxSteps = Math.ceil(1.6 * N * (o.P0 / dt)) + 16;
  for (; k < maxSteps; k++) {
    S.step(dt); t += dt;
    const d = rel(), rr = L.nrm(d);
    if (!Number.isFinite(rr) || S.coord3dHalt) { nan = true; break; }
    const th = angOf(d);
    let dd = th - angPrev; while (dd > Math.PI) dd -= 2 * Math.PI; while (dd < -Math.PI) dd += 2 * Math.PI;
    const prevAcc = angAcc; angAcc += dd; angPrev = th; thAcc += dd;
    const e = AP.eccVector(d, relV(), mu); TS.push(t); EP.push(L.dot(e, Pu)); EQ.push(L.dot(e, Qu)); TH.push(thAcc);
    const nP = Math.floor(Math.abs(prevAcc) / (2 * Math.PI)), nN = Math.floor(Math.abs(angAcc) / (2 * Math.PI));
    if (nN > nP) { const tg = Math.sign(angAcc) * nN * 2 * Math.PI, fr = (tg - prevAcc) / (angAcc - prevAcc); rev.push((k + fr) * dt); }
    if (k >= 2 && ((r1 < r2 && r1 < rr) || (r1 > r2 && r1 > rr))) {
      const den = (r2 - 2 * r1 + rr), fr = (den !== 0) ? 0.5 * (r2 - rr) / den : 0;
      let a1 = angOf(P2), a2 = angOf(P1), a3 = th;
      while (a2 - a1 > Math.PI) a2 -= 2 * Math.PI; while (a2 - a1 < -Math.PI) a2 += 2 * Math.PI;
      while (a3 - a2 > Math.PI) a3 -= 2 * Math.PI; while (a3 - a2 < -Math.PI) a3 += 2 * Math.PI;
      const ang = a2 + 0.5 * fr * (a3 - a1) + 0.5 * fr * fr * (a3 - 2 * a2 + a1), rv = (den !== 0) ? r1 - (r2 - rr) * (r2 - rr) / (8 * den) : r1;
      (r1 < r2 ? peri : apo).push({ t: (k + fr) * dt, ang, r: rv });
    }
    P2 = P1; P1 = d; r2 = r1; r1 = rr;
    const dE = Math.abs(energy() - E0); if (dE > dEmax) dEmax = dE;
    for (let i = 0; i < S.n; i++) { const z = Math.abs(S.spin[i] - spin0[i]); if (z > spinDmax) spinDmax = z; }
    if (rev.length >= N) { k++; break; }
  }
  const out = { status: 'run', coord3d: c3, lawDecl: gm.law, lawSim0, lawSim: HP.geoLawOfSim(S), ge, geodesic: gm.geodesic === true, warnings: (v.warnings || []).length,
    steps: k, dt, nan: nan || (typeof S.hasNaN === 'function' && S.hasNaN()), revN: rev.length, complete: rev.length >= N, wallSec: 0 };
  if (out.complete) {
    const t1 = rev[N - 1], pe = peri.filter((z) => z.t <= t1), ap = apo.filter((z) => z.t <= t1);
    const P = (rev[N - 1] - rev[0]) / (N - 1), f = AP.apsisRate({ t: TS, eP: EP, eQ: EQ, th: TH }, { t0: 0, t1, K: o.K || 3 });
    out.P = P; out.nPeri = pe.length;
    out.rate = f ? f.rate * P : null; out.e = f ? f.e : null; out.fitRms = f ? Math.max(f.rms[0], f.rms[1]) : null;
    if (pe.length >= 3) { const un = L.unwrap(pe.map((z) => z.ang)), fit = L.linfit(pe.map((z) => z.t), un); out.rateB = fit.slope * P; out.periRms = fit.rms; } else out.rateB = null;
    if (pe.length && ap.length) { const rp = pe.reduce((s, z) => s + z.r, 0) / pe.length, ra = ap.reduce((s, z) => s + z.r, 0) / ap.length; out.eB = (ra - rp) / (ra + rp); }
    // 近点から近点の周期(検出器 B の近点の時刻の直線 —— 離心率 0.01 未満の円の軌道では近点が定まらないので null)
    out.Pa = (pe.length >= 3 && out.e !== null && out.e >= 0.01) ? L.linfit(pe.map((z, i) => i), pe.map((z) => z.t)).slope : null;
  }
  const E1 = energy(), M1 = momentum(), h1 = L.nrm(L.cross(rel(), relV())), Ls = L.nrm(M0.L) || 1, Ps = Math.abs(S.m[oi] * L.nrm(v0)) || 1;
  const wD = Number.isFinite(S.inertialDragWork) ? S.inertialDragWork : 0, wG = Number.isFinite(S.gLocWork) ? S.gLocWork : 0;
  // エンジンの引きずりの口座(inertialDragLedgerOf —— semic の帳簿 W = −h Σ m a_N(x₀)·u と G_loc の仕事を引いた残り R_E)。宣言の無い本(geo1)は器の E_N の差だけ
  const LG = S.hasRelativeDrag ? HP.inertialDragLedgerOf(S) : null, E0e = (LG && Number.isFinite(LG.E0)) ? LG.E0 : E0;
  out.acct = { E0, dE: (E1 - E0) / Math.abs(E0), dEmax: dEmax / Math.abs(E0), wDrag: wD / Math.abs(E0), wGLoc: wG / Math.abs(E0), closeE: (E1 - E0 - wD - wG) / Math.abs(E0),
    ledger: LG ? { stepOrder: LG.stepOrder, RE: (LG.RE === null || LG.RE === undefined) ? null : LG.RE / Math.abs(E0e), W: LG.work / Math.abs(E0e), gLocWork: (LG.gLocWork === undefined) ? null : LG.gLocWork / Math.abs(E0e), semicMiss: LG.semicMiss } : null,
    dh: (h1 - h0) / h0, dLz: (M1.L[2] - M0.L[2]) / Ls, lDrag: (Number.isFinite(S.inertialDragDL) ? S.inertialDragDL : 0) / Ls,
    dP: [M1.P[0] - M0.P[0], M1.P[1] - M0.P[1], M1.P[2] - M0.P[2]].map((z) => z / Ps), pGLoc: S._gLoc ? [S.gLocPx, S.gLocPy, S.gLocPz].map((z) => z / Ps) : null, spinDmax };
  out.drag = S.hasRelativeDrag ? { enabled: !(S.relDrag && S.relDrag.enabled === false), steps: S.inertialDragN || 0, noHist: S.inertialDragNoHist || 0, reject: S.inertialDragReject || 0,
    over: S.inertialDragOver || 0, boundMax: S.inertialDragBoundMax || 0, initObs: S.inertialDragInitObs ? { ok: S.inertialDragInitObs.ok !== false, why: S.inertialDragInitObs.why || null } : null } : null;
  out.gLoc = S._gLoc ? { psiMax: S.gLocPsiMax, dGMax: S.gLocDGMax, evals: S.gLocN } : null;
  const z0 = new Array(S.n).fill(0);
  out.hashXY = hashOf([S.x, S.y, S.vx, S.vy]); out.hashAll = hashOf([S.x, S.y, c3 ? S.z : z0, S.vx, S.vy, c3 ? S.vz : z0, S.spin]);
  out.wallSec = (Date.now() - t0) / 1000;
  return out;
}
export const specKey = (s) => s.sys + '|' + s.col + '|div=' + s.div + '|N=' + s.N + (s.rot ? '|rot=' + s.rot.join(',') : '');
export function runSpec(HP, sp) {
  const book = bookOfSpec(HP, sp), base = baseOf(HP, sp.sys), h = base.physics.stepDt, P0 = L.osc0Of(base).P;
  const r = runBook(HP, book, { dt: h / sp.div, N: sp.N, K: sp.K, P0 });
  return Object.assign({ key: specKey(sp), spec: sp, h }, r);
}

/* ───────── 子プロセスの池(W321B_WORKERS —— 既定 2・1 つの子が束を順に走らせる) ───────── */
function poolRun(specs, NW, self, target) {
  const chunks = []; const nChunk = Math.max(NW, Math.min(specs.length, NW * 4));
  for (let i = 0; i < nChunk; i++) chunks.push([]);
  specs.forEach((s, i) => chunks[i % nChunk].push(s));
  const todo = chunks.filter((c) => c.length), res = [];
  return new Promise((resolve, reject) => {
    let active = 0, done = 0, failed = null;
    const pump = () => {
      while (!failed && active < NW && todo.length) {
        const c = todo.shift(); active++;
        const proc = spawn(process.execPath, ['--max-old-space-size=6144', self, '--child', JSON.stringify({ target, specs: c })], { cwd: ROOT, env: process.env });
        let so = '', se = '';
        proc.stdout.on('data', (d) => { so += d; }); proc.stderr.on('data', (d) => { se += d; });
        proc.on('close', (code) => {
          active--;
          if (code !== 0) { failed = new Error('子プロセス rc ' + code + ': ' + se.slice(-600)); return reject(failed); }
          try { const J = JSON.parse(so.slice(so.lastIndexOf('\n{') + 1)); res.push(...J.rows); } catch (e) { failed = new Error('子の出力が JSON でない: ' + so.slice(-300)); return reject(failed); }
          done++; if (!todo.length && active === 0) resolve(res); else pump();
        });
      }
    };
    if (!todo.length) resolve(res); else pump();
  });
}

/* ───────── 段 I 在位の連星の一覧 ───────── */
export function partI(HP) {
  const all = HP.allPresets(), rows = [];
  const pick = all.filter((p) => L.BIN_TARGETS.includes(L.calTargetOf(p)) || L.PRINCIPLE_BINARIES.some((z) => z.id === p.id));
  for (const p of pick) {
    const v = HP.validatePreset(clone(p)), ph = (v.ok ? v.preset : p).physics || {}, rd = ph.relativeDrag || null;
    const gm = HP.geoModeOf(ph);
    let lawSim = null, ge = null, spinState = null;
    if (v.ok) { const S = HP.coord3d.makeSim(); S.build(clone(v.preset)); lawSim = HP.geoLawOfSim(S); ge = HP.geoEffectiveMode(S); spinState = Array.from(S.spin); }
    const bodies = (p.bodies || []).map((b) => ({ type: b.type, m: b.m === undefined ? null : b.m, radius: b.radius === undefined ? null : b.radius, spin: b.spin === undefined ? null : b.spin,
      pulse: b.pulse ? { omega: b.pulse.omega, source: b.pulse.source || null } : null, spinDipole: b.spinDipole ? { omega: b.spinDipole.omega, source: b.spinDipole.source || null } : null,
      spinAxis: b.spinAxis ? { enable: b.spinAxis.enable === true, tiltDeg: b.spinAxis.tiltDeg === undefined ? null : b.spinAxis.tiltDeg } : null,
      deny3d: L.BODY_DENY3D.filter((k) => b[k] !== undefined), dragCore: !!b.dragCore }));
    const mb = (HP.MASS_BASIS || {})[p.id] || null, st = p.status || null;
    rows.push({ id: p.id, emoji: p.emoji || '', familyId: p.familyId || null, familyRole: p.familyRole || 'primary', sampleClass: p.sampleClass || null, target: L.calTargetOf(p),
      principle: L.PRINCIPLE_BINARIES.find((z) => z.id === p.id) ? L.PRINCIPLE_BINARIES.find((z) => z.id === p.id).why : null,
      accepted: v.ok === true, coord: ph.coord === '3d' ? '3d' : '2d', geoPN: ph.geoPN === undefined ? 0 : ph.geoPN, kFrame: ph.kFrame === undefined ? null : ph.kFrame,
      lambdaPN: ph.lambdaPN === undefined ? null : ph.lambdaPN, relDragLaw: rd ? (rd.law || null) : null, gLoc: ph.gLoc ? ph.gLoc.law : null,
      lawDecl: gm.law, lawSim, ge, consistent: v.ok ? gm.law === lawSim : null, nBodies: bodies.length, nSingle: bodies.filter((b) => b.type === 'single').length,
      spinDecl: bodies.map((b) => b.spin), spinState, obsSpin: bodies.map((b) => (b.pulse || b.spinDipole) ? { pulse: b.pulse ? b.pulse.omega : null, spinDipole: b.spinDipole ? b.spinDipole.omega : null, source: (b.pulse || b.spinDipole).source } : null),
      spinAxis2d: bodies.map((b) => b.spinAxis && !b.spinAxis.enable ? b.spinAxis.tiltDeg : null), deny3d: [...new Set(bodies.flatMap((b) => b.deny3d))],
      massBasis: mb ? { kind: mb.kind, inferenceModel: mb.inferenceModel || null, records: (mb.records || []).slice() } : null,
      observedInputs: (p.parameterAudit && Array.isArray(p.parameterAudit.observedInputs)) ? p.parameterAudit.observedInputs.length : 0,
      calibration: st ? st.calibration : null, inPopulation: !!(st && L.POP_VALUES.includes(st.calibration)), scaleExp: p.scaleExp ? clone(p.scaleExp) : null });
  }
  const count = (f) => rows.filter(f).length;
  return { rows, n: rows.length, byTarget: Object.fromEntries(L.BIN_TARGETS.concat(['solar-system']).map((k) => [k, count((r) => r.target === k && !r.principle)])),
    nPrinciple: count((r) => !!r.principle), nRetired: count((r) => r.familyRole === 'retired'), nInPop: count((r) => r.inPopulation), nMismatch: count((r) => r.consistent === false),
    nObsSpin: count((r) => r.obsSpin.some(Boolean)), nSpinZeroState: count((r) => r.spinState && r.spinState.every((s) => s === 0)), nDeny3d: count((r) => r.deny3d.length > 0),
    geoPNs: [...new Set(rows.map((r) => r.geoPN))].sort() };
}

/* ───────── 段 A 受理の表 ───────── */
function acceptRow(HP, key, book) {
  const v = HP.validatePreset(clone(book));
  if (!v.ok) return { key, ok: false, errors: (v.errors || []).slice(0, 6).map((z) => String(z).slice(0, 200)) };
  const gm = HP.geoModeOf(v.preset.physics), S = HP.coord3d.makeSim(); S.build(clone(v.preset));
  const sm = v.preset.physics.relativeDrag && v.preset.physics.relativeDrag.invSq && v.preset.physics.relativeDrag.invSq.sourceMoment;
  return { key, ok: true, lawDecl: gm.law, lawSim: HP.geoLawOfSim(S), ge: HP.geoEffectiveMode(S), coord3d: S.coord3d === true, warnings: (v.warnings || []).map((z) => String(z).slice(0, 200)),
    spin: v.preset.bodies.map((b) => b.spin), sourceMoment: sm ? clone(sm) : null };
}
export function partA(HP, I) {
  const sib = [];
  for (const sys of L.TOYS.map((t) => t.key).concat(SYSTEMS.map((s) => s.key))) {
    const base = baseOf(HP, sys);
    for (const col of Object.keys(L.COLS)) { if (col === 'J' && sys !== 'acen') continue; const r = acceptRow(HP, sys + '|' + col, L.siblingOf(base, col)); r.expectLaw = L.COLS[col].law; r.expectGe = L.COLS[col].ge; sib.push(r); }
  }
  // J の列の宣言の可否(α Cen の on の写しから —— 群を前置しない二体の形)
  const on = L.siblingOf(baseOf(HP, 'acen'), 'on'), jv = [];
  const withSM = (sm, mut) => { const c = clone(on); c.physics.relativeDrag.invSq.sourceMoment = sm; if (mut) mut(c); return c; };
  const cases = [
    ['J-f-both', withSM({ kind: 'J', f: { 0: L.F_J.value, 1: L.F_J.value } }), true, '両星に f(天体ごと)'],
    ['J-f-A', withSM({ kind: 'J', f: { 0: L.F_J.value } }), true, 'A だけ f(B は R_d のまま)'],
    ['J-no-f', withSM({ kind: 'J' }), false, 'f が無い(既定の f は置かない)'],
    ['J-f-big', withSM({ kind: 'J', f: { 0: 0.7 } }), false, 'f > 2/3'],
    ['J-f-out', withSM({ kind: 'J', f: { 2: 0.07 } }), false, '添字の範囲の外'],
    ['J-no-spinDrag', withSM({ kind: 'J', f: { 0: 0.07, 1: 0.07 } }, (c) => { delete c.physics.relativeDrag.spinDrag; }), false, 'spinDrag が無い'],
    ['J-dragCore', withSM({ kind: 'J', f: { 0: 0.07, 1: 0.07 } }, (c) => { c.bodies[0].dragCore = { massFrac: 1, radius: c.bodies[0].radius * 0.5 }; }), false, 'dragCore を宣言した天体に f'],
    ['J-k2', withSM({ kind: 'J', f: { 0: 0.07 } }, (c) => { c.physics.relativeDrag.invSq = { sourceMoment: { kind: 'J', f: { 0: 0.07 } } }; }), false, 'K1 の規則の本でない(K2)'],
    ['obs', withSM({ kind: 'obs' }), true, 'R_src = R_obs(比較の列)'],
    ['J-sirius', (() => { const c = L.siblingOf(baseOf(HP, 'sirius'), 'on'); c.physics.relativeDrag.invSq.sourceMoment = { kind: 'J', f: { 0: 0.07, 1: 0.07 } }; return c; })(), true, 'シリウス(S.spin = 0 —— 宣言は通るが Ω = 0)']];
  for (const [key, book, expect, ja] of cases) { const r = acceptRow(HP, key, book); r.expect = expect; r.ja = ja; jv.push(r); }
  // NS の本の三次元の写し(素の写し —— 拒否の理由 / 観測の Ω を S.spin へ写した写し —— 値域の飽和と R_d > R)
  const ns = [];
  for (const row of I.rows.filter((r) => r.target === 'ns-binary' && r.familyRole !== 'retired')) {
    const p = clone(findBook(HP, row.id));
    const naive = (() => { const c = L.siblingOf(p, 'tr'); c.bodies = c.bodies.map((b, i) => Object.assign(b, ...L.BODY_DENY3D.filter((k) => p.bodies[i][k] !== undefined).map((k) => ({ [k]: clone(p.bodies[i][k]) })))); return c; })();
    const strip = (copySpin) => { const c = L.siblingOf(p, 'on'); c.bodies = c.bodies.map((b, i) => { for (const k of L.BODY_DENY3D) delete b[k]; const ob = p.bodies[i].pulse || p.bodies[i].spinDipole; if (copySpin && ob) b.spin = ob.omega; return b; }); return c; };
    const a0 = acceptRow(HP, row.id + '|naive', naive), a1 = acceptRow(HP, row.id + '|strip', strip(false)), a2 = acceptRow(HP, row.id + '|spinCopy', strip(true));
    const omegas = p.bodies.map((b) => (b.pulse || b.spinDipole) ? (b.pulse || b.spinDipole).omega : null);
    const Yk = 10 * p.physics.G / (L.C1_CLOSED * p.physics.cLight ** 2);
    ns.push({ id: row.id, deny3d: row.deny3d.slice(), spinAxis2d: row.spinAxis2d.slice(), naiveOk: a0.ok, naiveErrors: a0.errors || [], stripOk: a1.ok, stripWarnRd: a1.ok ? a1.warnings.filter((w) => /R_d/.test(w)).length : null,
      omegaObs: omegas, spinAfterCopy: a2.ok ? a2.spin : null, spinClamped: a2.ok ? a2.warnings.some((w) => /spin を値域に修正/.test(w)) : null,
      rdOverR: p.bodies.map((b) => (b.radius > 0) ? Yk * b.m / b.radius : null), Tunit: p.scaleExp ? p.scaleExp.T : null, massBasis: row.massBasis });
  }
  return { sib, jDecl: jv, ns, spinRange: [-20, 20] };
}

/* ───────── 段 X 既存の器の除外(AN492 —— 宣言の述語の写しと煙試験の対象の一覧) ───────── */
// 器と QA の本文の名指しの除外(LATER_BOOKS_* と QA の世代定数の否定)の一覧は、器の正本に入れない(他の器・QA の本文に依る —— QA docs.geo3Bin321b が
// その場で読み、PHYSICS〔第321便b〕の表と照合する)。ここは純関数の部分だけ: 第320便d の表 1 の 4 段の数え上げの述語の写しと、第320便d の宣言の条件
// isRuleBookNoCopy を、写しの geo3 の連星の本(並進だけ)に当てる。
/** 表 1 の 4 段の数え上げの述語の写し(器の本文の式の写し —— 器を走らせていない) */
export const ENUM_PRED_COPIES = Object.freeze([
  Object.freeze({ stage: 'wbglaw-301g', pred: 'law "inertial" の本を第302便c の前の宣言の写しで分類', f: (p) => ((p.physics || {}).relativeDrag || {}).law === 'inertial' }),
  Object.freeze({ stage: 'wbgest-302c', pred: 'gLocBooks(退役でない ∧ physics.gLoc)・partE(退役でない ∧ scaleExp ∧ law "inertial")', f: (p) => p.familyRole !== 'retired' && !!(p.physics && (p.physics.gLoc || (p.scaleExp && p.physics.relativeDrag && p.physics.relativeDrag.law === 'inertial'))) }),
  Object.freeze({ stage: 'semic-302d', pred: '内蔵の全本 → law "inertial" で分類', f: (p) => !!(p.physics && p.physics.relativeDrag && p.physics.relativeDrag.law === 'inertial') }),
  Object.freeze({ stage: 'refit-303a', pred: 'gLocBooks(G_loc の在位の本が惑星の表と同じ集合の門)', f: (p) => p.familyRole !== 'retired' && !!(p.physics && p.physics.gLoc) })]);
export function partX(hypo) {
  const hy = hypo.map((h) => ({ key: h.key, id: h.book.id, ruleBook: isRuleBookNoCopy(h.book), preds: ENUM_PRED_COPIES.map((e) => ({ stage: e.stage, pred: e.pred, hit: e.f(h.book) })) }));
  return { hypo: hy, ruleBooksWhy: RULE_BOOKS_WHY };
}

/* ───────── 段 TB 量ごとの表・口座・ビット・回転の共変 ───────── */
export function partT(rows, plan, anaOf) {
  const R = {};
  for (const r of rows) { if (r.spec.rot) continue; ((R[r.spec.sys] = R[r.spec.sys] || {})[r.spec.col] = R[r.spec.sys][r.spec.col] || {})[r.spec.div] = r; }
  const sysList = plan.toys.concat(SYSTEMS.map((s) => s.key));
  const diffs = L.diffTable(R, sysList, plan.divs, anaOf);
  const finest = plan.divs[plan.divs.length - 1];
  const bits = [];
  for (const sys of sysList) {
    const d1 = plan.divs[0], a = L.rowOf(R, sys, 'g1_2d', d1), b = L.rowOf(R, sys, 'g1_3d', d1), x = L.rowOf(R, sys, 'g1_2dx', d1), tr = L.rowOf(R, sys, 'tr', d1), on = L.rowOf(R, sys, 'on', d1);
    bits.push({ sys, plane: (a && b) ? a.hashXY === b.hashXY : null, keys2d: (a && x) ? a.hashAll === x.hashAll : null, onEqTr: (tr && on) ? tr.hashAll === on.hashAll : null,
      planeRate: (a && b && a.rate !== null) ? L.relDiff(a.rate, b.rate) : null });
  }
  const rot = [];
  for (const r of rows.filter((z) => z.spec.rot)) {
    const u = L.rowOf(R, r.spec.sys, r.spec.col, r.spec.div); if (!u || u.status !== 'run' || r.status !== 'run') { rot.push({ sys: r.spec.sys, col: r.spec.col, ok: false }); continue; }
    const offU = L.rowOf(R, r.spec.sys, 'off', r.spec.div);
    rot.push({ sys: r.spec.sys, col: r.spec.col, ok: true, dRate: offU ? Math.abs(r.rate - u.rate) / Math.max(1e-300, Math.abs(u.rate - offU.rate)) : null, dRateAbs: Math.abs(r.rate - u.rate), dP: L.relDiff(r.P, u.P), de: Math.abs(r.e - u.e), law: r.lawSim });
  }
  const acct = rows.filter((r) => !r.spec.rot && r.status === 'run' && r.spec.div === finest).map((r) => ({ sys: r.spec.sys, col: r.spec.col, dE: r.acct.dE, dEmax: r.acct.dEmax, wDrag: r.acct.wDrag, wGLoc: r.acct.wGLoc,
    closeE: r.acct.closeE, RE: r.acct.ledger ? r.acct.ledger.RE : null, Wl: r.acct.ledger ? r.acct.ledger.W : null, dh: r.acct.dh, dLz: r.acct.dLz, lDrag: r.acct.lDrag, dPn: L.nrm(r.acct.dP), pGLocN: r.acct.pGLoc ? L.nrm(r.acct.pGLoc) : null,
    pClose: r.acct.pGLoc ? L.nrm([r.acct.dP[0] - r.acct.pGLoc[0], r.acct.dP[1] - r.acct.pGLoc[1], r.acct.dP[2] - r.acct.pGLoc[2]]) : null, spinDmax: r.acct.spinDmax }));
  const law = rows.map((r) => ({ key: r.key, ok: r.status === 'run' && r.lawDecl === r.lawSim && r.lawSim0 === r.lawSim && r.lawSim === L.COLS[r.spec.col].law && r.ge === L.COLS[r.spec.col].ge }));
  return { diffs, bits, rot, acct, law, finest, R };
}
/** 系ごとの量の表(最も細かい刻みの 4 量 × 列)と α Cen の J の列(別の表) */
export function qtyTable(TB, sysList, divs) {
  const out = [];
  for (const sys of sysList) for (const col of Object.keys(L.COLS)) {
    const v = divs.map((d) => L.rowOf(TB.R, sys, col, d)); if (v.every((z) => !z)) continue;
    const f = v[v.length - 1];
    out.push({ sys, col, P: f && f.P, Pa: f && f.Pa, e: f && f.e, rate: f && f.rate, rateB: f && f.rateB, nPeri: f && f.nPeri, steps: f && f.steps, wallSec: v.reduce((s, z) => s + (z ? z.wallSec : 0), 0),
      bandRate: (v.length >= 2 && v[v.length - 1] && v[v.length - 2]) ? Math.abs(v[v.length - 1].rate - v[v.length - 2].rate) : null });
  }
  return out;
}

/** 段 T の全体(partT + 量の表 + α Cen の J の列 —— QA が正本の走行の行から作り直す) */
export function tablesOf(rows, P, ana) {
  const sysAll = P.toys.concat(SYSTEMS.map((s) => s.key));
  const TB = partT(rows, P, ana);
  TB.qty = qtyTable(TB, sysAll, P.divs);
  TB.jTable = qtyTable(TB, ['acen'], P.jDivs).filter((q) => q.col === 'J' || q.col === 'on');
  TB.jDiff = P.jDivs.map((d) => { const a = L.rowOf(TB.R, 'acen', 'J', d), b = L.rowOf(TB.R, 'acen', 'on', d); return { div: d, rate: (a && b) ? a.rate - b.rate : null, P: (a && b) ? a.P - b.P : null, same: (a && b) ? a.hashAll === b.hashAll : null }; });
  delete TB.R;
  return TB;
}
/* ───────── 段 N・F(設計の材料) ───────── */
export function partN(I, A) {
  return { rows: A.ns.map((z) => ({ id: z.id, omegaObs: z.omegaObs, spinRange: A.spinRange, overRange: z.omegaObs.map((w) => w === null ? null : Math.abs(w) / A.spinRange[1]),
    spinAfterCopy: z.spinAfterCopy, spinClamped: z.spinClamped, rdOverR: z.rdOverR, naiveDeny: z.naiveErrors.length, deny3d: z.deny3d, spinAxis2d: z.spinAxis2d,
    massBasis: z.massBasis ? z.massBasis.inferenceModel : null })),
    order: ['psrDoubleAB', 'psrJ1757DFM', 'psrJ1946DFM', 'psrB1534'], holdOut: 'psrB1534' };
}
export function partF(TB, plan) {
  return [
    { key: 'toy', ja: '玩具(等質量・1:3 × 円・離心)', books: plan.toys.length, sys: plan.toys.slice(), gate: '面への退化(ビット)・回転の共変・1PN の抽出(解析の式との比)・有限質量比の一次の予測との比', needs: '内蔵にしない(器の中の写し —— 原理の比較の物差し)' },
    { key: 'sirius', ja: 'シリウス無自転', books: 1, sys: ['sirius'], gate: 'on = tr のビット同一(無自転)・h/h2/h4 の帯・口座', needs: 'S.spin = 0 は採用の宣言(観測で零ではない)と明記' },
    { key: 'acen', ja: 'α Cen(OFF → 並進 → 回転 → J)', books: 1, sys: ['acen'], gate: '回転の分の符号と大きさ・J の列は別の表(f は模型の宣言)', needs: '両星の spin の軸は軌道の法線(二次元の本の約束 —— 観測の軸ではない)' },
    { key: 'ns', ja: 'NS(J0737 → J1757/J1946 → B1534 hold-out)', books: 4, sys: null, gate: '観測の自転の経路(段 N)が先 —— S.spin の値域の外・pulse/spinDipole/dragQ/core は三次元で拒否', needs: '経路の設計(AN 候補)・PSR の質量は GR を仮定したタイミング解・半径は EOS の代理' },
    { key: 'principle', ja: '原理の本(周連星円盤・8 の字・箱宇宙の連星)', books: 3, sys: null, gate: '周連星円盤は多粒子(K1 の invSq は n ≤ 64)・8 の字は三体・箱宇宙は宇宙の箱(三次元で拒否)', needs: '各々の三次元の受理の門(段 I の deny3d と在位の宣言)' },
    { key: 'gw', ja: 'GW150914(強場 —— 最後)', books: 1, sys: null, gate: 'geo0(強場の類推)・放射反作用と合体は別項目', needs: '弱場の K1 の規則を強場へ広げない' }];
}

/* ───────── 門(器の自己整合 —— 物理の合否ではない) ───────── */
export function gatesOf(J) {
  const G = {};
  const I = J.I, A = J.A, TB = J.T;
  G.iCount = !!(I && I.n >= 20 && I.rows.every((r) => r.accepted));
  G.iLaw = !!(I && I.rows.every((r) => r.consistent === true));
  G.aSib = !!(A && A.sib.every((r) => r.ok && r.lawDecl === r.lawSim && r.lawSim === r.expectLaw && r.ge === r.expectGe));
  G.aJ = !!(A && A.jDecl.every((r) => r.ok === r.expect));
  G.aNs = !!(A && A.ns.length >= 4 && A.ns.every((z) => z.naiveOk === (z.deny3d.length === 0) && z.stripOk === true));
  G.eRun = !!(J.E && J.E.rows.every((r) => r.status === 'run' && r.complete && !r.nan));
  G.eLaw = !!(TB && TB.law.every((z) => z.ok));
  G.ePeri = !!(J.E && J.E.rows.filter((r) => r.status === 'run').every((r) => r.nPeri >= J.plan.N));
  G.tPlane = !!(TB && TB.bits.every((b) => b.plane === true && b.keys2d !== false));
  G.tSirius = !!(TB && (TB.bits.find((b) => b.sys === 'sirius') || {}).onEqTr === true);
  G.tDrag = !!(J.E && J.E.rows.filter((r) => r.status === 'run' && ['tr', 'on', 'J'].includes(r.spec.col)).every((r) => r.drag && r.drag.enabled && r.drag.steps > 0 && r.drag.reject === 0 && r.drag.over === 0)
    && J.E.rows.filter((r) => r.status === 'run' && ['off', 'gl'].includes(r.spec.col)).every((r) => r.drag && !r.drag.enabled));
  G.tPn1 = !!(TB && TB.diffs.filter((d) => d.diff === 'pn' && d.qty === 'rate' && J.plan.toys.includes(d.sys)).every((d) => d.ratio !== null && Math.abs(d.ratio - 1) <= 2e-3));
  G.tRot = !!(TB && TB.rot.length && TB.rot.every((z) => z.ok && z.dP <= 1e-9 && (z.dRate === null || z.dRate <= 1e-3)));
  return G;
}

/* ───────── 実行 ───────── */
export async function runAll(HP, o) {
  const P = o.plan, tm = {}; let t0 = Date.now();
  const tick = (k) => { tm[k] = { wallSec: (Date.now() - t0) / 1000 }; t0 = Date.now(); };
  const J = { stage: 'geo3bin', quick: !!o.quick, plan: clone(P), decl: { K1_DRAG: clone(L.K1_DRAG), OFF_DRAG: clone(L.OFF_DRAG), GLOC: clone(L.GLOC), SPIN_ROT: clone(L.SPIN_ROT), F_J: clone(L.F_J),
    TOY_UNITS: clone(L.TOY_UNITS), TOYS: clone(L.TOYS), COLS: clone(L.COLS), DROP_2D_KEYS: clone(L.DROP_2D_KEYS) } };
  J.I = partI(HP); tick('I');
  J.A = partA(HP, J.I); tick('A');
  const sysAll = P.toys.concat(SYSTEMS.map((s) => s.key)), specs = [];
  for (const sys of sysAll) {
    for (const col of L.MAIN_COLS) for (const div of P.divs) specs.push({ sys, col, div, N: P.N, K: P.apsisK });
    for (const col of P.bitCols) specs.push({ sys, col, div: P.divs[0], N: P.N, K: P.apsisK });
    for (const col of P.rotCols) specs.push({ sys, col, div: P.divs[0], N: P.N, K: P.apsisK, rot: P.rotDeg.slice() });
  }
  for (const div of P.jDivs) specs.push({ sys: 'acen', col: 'J', div, N: P.N, K: P.apsisK });
  const rows = o.runner(specs);
  J.E = { n: specs.length, rows: (await rows).sort((a, b) => a.key < b.key ? -1 : a.key > b.key ? 1 : 0) }; tick('E');
  J.ana = Object.fromEntries(sysAll.map((s) => [s, L.analyticOf(baseOf(HP, s))]));
  J.T = tablesOf(J.E.rows, P, J.ana); tick('T');
  const hypo = SYSTEMS.map((s) => ({ key: s.key, book: L.siblingOf(baseOf(HP, s.key), 'tr') })).concat([{ key: 'eq-e', book: L.siblingOf(baseOf(HP, 'eq-e'), 'tr') }]);
  J.X = partX(hypo); tick('X');
  J.N = partN(J.I, J.A); J.F = partF(J.T, P); tick('NF');
  J.gates = gatesOf(J); J.ok = Object.values(J.gates).every(Boolean); J.timing = tm;
  return J;
}

async function child(arg) {
  const { target, specs } = JSON.parse(arg);
  const { HP } = loadHtmlMain(path.isAbsolute(target) ? target : path.join(ROOT, target));
  const rows = specs.map((sp) => runSpec(HP, sp));
  process.stdout.write('\n' + JSON.stringify({ rows }) + '\n');
}
export async function main() {
  const TARGET = process.env.W321B_TARGET || 'beta/index.html', quick = process.env.W321B_QUICK === '1', NW = Math.max(1, Number(process.env.W321B_WORKERS || 2) | 0);
  const OUT = process.env.W321B_OUT ? (path.isAbsolute(process.env.W321B_OUT) ? process.env.W321B_OUT : path.join(ROOT, process.env.W321B_OUT)) : path.join(ROOT, OUT_MAIN);
  if (quick && !process.env.W321B_OUT) throw new Error('試走(W321B_QUICK=1)は W321B_OUT を指定する(正本を書かない)');
  const html = path.isAbsolute(TARGET) ? TARGET : path.join(ROOT, TARGET);
  const t0 = Date.now(), targetSha256 = crypto.createHash('sha256').update(fs.readFileSync(html)).digest('hex');
  const W281A_SCOPE = REGEN_SCOPE ? w281aScopeStamp(html, REGEN_SCOPE) : {};
  const { HP } = loadHtmlMain(html);
  console.log('第321便b geo3bin: ' + (quick ? '試走' : '正本') + '・子プロセス ' + NW);
  const self = fileURLToPath(import.meta.url);
  const R = await runAll(HP, { quick, plan: quick ? QUICK : PLAN, runner: (specs) => poolRun(specs, NW, self, TARGET) });
  const out = { version: HARNESS_VERSION, libVersion: L.LIB_VERSION, generator: 'tests/exp-w321b-geo3bin.mjs', target: TARGET, targetSha256, reuseFrom: null,
    ruling: '原仮定者の予定(第123報)「geoPN=3の予定: 連星サンプル群のgeoPN=3版を用意する」・統括の検証項目 R267(策定の段 S1)。在位の本の宣言・エンジンの式・受理の判定は変えない(器・lib・正本・文書だけ —— 内蔵の本は足さない)',
    invSqVersion: HP.REL_DRAG_INVSQ_VERSION || null, geoModeVersion: HP.geoModeOf({}).version || null, ...R };
  out.elapsedS = (Date.now() - t0) / 1000;
  const CODE = ['tests/exp-w321b-geo3bin.mjs', 'tests/lib-w321b-geo3bin.mjs', 'tests/lib-w304e-apsis.mjs', 'tests/lib-w320d-rulebooks.mjs', 'tests/lib-w315c-legacy7.mjs', 'tests/lib-w280b-emgrid.mjs', 'tests/lib-w279b-headless.mjs', 'tests/lib-w272e-provenance.mjs', 'tests/lib-w281a-scope.mjs'];
  out.meta = Object.assign(provenanceMeta({ root: ROOT, wave: '第321便b', target: TARGET, code: CODE, inputs: [TARGET] }), {
    harnessVersion: HARNESS_VERSION, stage: 'geo3bin',
    engine: 'Node(tests/lib-w280b-emgrid.mjs の loadHtmlMain —— html の本文をそのまま実行・子プロセス ' + NW + ')',
    literature: [L.F_J.why], notClaim: NOT_CLAIM });
  Object.assign(out.meta, W281A_SCOPE, w281aStableInputs(ROOT, out.meta.inputs));
  fs.mkdirSync(path.dirname(OUT), { recursive: true });
  fs.writeFileSync(OUT, JSON.stringify(out, null, 1) + '\n');
  console.log('→', path.relative(ROOT, OUT), 'ok=' + out.ok, JSON.stringify(out.gates), out.elapsedS + ' s');
}
if (IS_MAIN) { if (process.argv[2] === '--child') await child(process.argv[3]); else await main(); }
