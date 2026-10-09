// 第297便c(原仮定者の裁定(第87報)「時間経過倍率 1 倍で、1 公転 360 ステップ程度を標準として、時間スケールを見直す」・統括の検証項目 R163)
// — **時間の標準の移行表と安定性の実測**の器(純 Node・ブラウザ不要 —— tests/lib-w280b-emgrid.mjs の loadHtmlMain で html の本文をそのまま走らせる)。
//
// ■ 何を測るか(本ごと —— 宣言 timeRef・physics.stepDt・physics.timeScale を**読むだけ**。値は 1 つも決めない)
//   ・公転の本(timeRef.basis "orbit"): 画面の刻み stepDt で **8 公転**(pRef×8)走らせ、同じ時間を刻み stepDt/2 でも走らせる(収束の参照)。
//       宣言の対 pair=[c,o](組み上げた粒子の番号)の初期接触軌道(a0・e0・P0)・終端の a・e(dt と dt/2 の差 dA・dE)・
//       対の比エネルギー/比角運動量の相対ずれの最大(dt の走行)・最接近 rMin(dt/2 との比)・同方向の公転数から数えた周期 pMeas
//       (pRef との残差 —— **正規化しない**・記録だけ)・NaN・クランプ・連鎖の解法の未収束・対の外の束縛粒子の最少步/公転と
//       終端半径が dt/2 と 10% 超ずれた粒子の割合(環の保持)・光線の步長 c·dt / camera.scale。
//   ・観察の本(basis "observe"): 600 步(刻み stepDt)で NaN・クランプ・最大半径(stepDt≠DT の本だけ dt/2 の参照も走らせて比べる)。
//   ・判定(崩れ): NaN・未収束・dA>0.02・dE>0.02・rMin の比が 10% 超・環の 5% 超が 10% 超ずれる(公転)/ NaN・最大半径の比 10% 超・クランプの増加・
//     3 粒子以下は質量・半径・自転の相対差 2% 超(観察 —— 刻みを変えた本だけ 1/2 の参照と比べる)。
//     判定は**表示の刻みの妥当性**の物差しであって物理の合否ではない(DFM の引きずり・潮汐でエネルギーは物理として動く —— ずれは記録するだけ)。
// ■ 環境変数
//   W297C_OUT   出力(既定 tests/out/timestd-w297c.json)
//   W297C_HTML  対象 html(既定 beta/index.html)
//   W297C_PLAN  移行案の上書き JSON({id:{timeScale, stepDt, timeRef}} —— 移行前の器の試走用。正本の生成では使わない)
//   W297C_IDS   本の部分集合(カンマ区切り)/ W297C_ORBITS(既定 8)/ W297C_OBS_STEPS(既定 600)
//   W297C_BASE  旧 html(在れば旧 timeScale を表に写す —— 無くても正本は作れる)
// 使い方: node tests/exp-w297c-timestd.mjs
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { loadHtmlMain } from './lib-w280b-emgrid.mjs';
import { provenanceMeta } from './lib-w272e-provenance.mjs';
import { scopeStamp as w281aScopeStamp, stableInputs as w281aStableInputs } from './lib-w281a-scope.mjs';
const REGEN_SCOPE = {"presets":"all","roots":["HP.allPresets","HP.sim","HP.timeStd","HP.validatePreset"],"core":true,"consts":[],"complete":true};

export const TIMESTD_VERSION = 'w297c-timestd-1';
const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const HTML = path.resolve(ROOT, process.env.W297C_HTML || 'beta/index.html');
const OUT = path.resolve(ROOT, process.env.W297C_OUT || 'tests/out/timestd-w297c.json');
const PLAN = process.env.W297C_PLAN ? JSON.parse(fs.readFileSync(process.env.W297C_PLAN, 'utf8')) : null;
const IDS = process.env.W297C_IDS ? process.env.W297C_IDS.split(',').filter(Boolean) : null;
const ORBITS = Number(process.env.W297C_ORBITS || 8);
const OBS_STEPS = Number(process.env.W297C_OBS_STEPS || 600);
const BASE = process.env.W297C_BASE ? path.resolve(ROOT, process.env.W297C_BASE) : null;
export const GATE = { dA: 0.02, dE: 0.02, rMin: 0.10, ringFrac: 0.05, ringRel: 0.10, obsR: 0.10, obsState: 0.02 };

const t0 = Date.now();
const TARGET = path.relative(ROOT, HTML);
const W281A_SCOPE = w281aScopeStamp(HTML, REGEN_SCOPE);   // 第281便a: 走行開始時の html の領域
const baseTs = {};
if (BASE && fs.existsSync(BASE)) {
  const src = fs.readFileSync(BASE, 'utf8');
  // 旧 html は読むだけ(id の行から次の id の行までで最初の physics の timeScale)
  // 内蔵の配列の中の**列 0 の** `{ id:"…"` から次の本まで・本の段の `physics:` の行(字下げ 2〜4)の中の最初の timeScale
  const b0 = src.indexOf('const BUILTIN_PRESETS = ['), b1 = src.indexOf('\n];', b0);
  const re = /\n\{ id:"([^"]+)"/g; const hits = []; let m;
  while ((m = re.exec(src))) if (m.index > b0 && m.index < b1) hits.push([m[1], m.index]);
  for (let i = 0; i < hits.length; i++) {
    const seg = src.slice(hits[i][1], i + 1 < hits.length ? hits[i + 1][1] : b1);
    const pm = /\n {2,4}physics:/.exec(seg);
    let ts = 1;
    if (pm) { let d = 0, k = seg.indexOf('{', pm.index), e = k; for (; e < seg.length; e++) { const c = seg[e]; if (c === '{' || c === '(') d++; else if (c === '}' || c === ')') { d--; if (d === 0) break; } }
      const mm = /timeScale:\s*([0-9.eE+-]+)/.exec(seg.slice(k, e)); if (mm) ts = Number(mm[1]); }
    if (!(hits[i][0] in baseTs)) baseTs[hits[i][0]] = ts;
  }
}
const { HP, errors: loadErrors } = loadHtmlMain(HTML);
const TS = HP.timeStd;
if (!TS) throw new Error('HP.timeStd が無い(第297便c 以前の html)');
const DT_APP = TS.appStepDt({ params: {} });   // 未宣言の刻み = html の DT(器は値を持たない)

function osc(S, c, o) {
  const dx = S.x[o] - S.x[c], dy = S.y[o] - S.y[c], dvx = S.vx[o] - S.vx[c], dvy = S.vy[o] - S.vy[c];
  const r = Math.hypot(dx, dy), v2 = dvx * dvx + dvy * dvy, mu = S.params.G * (S.m[c] + S.m[o]);
  const E = v2 / 2 - mu / r, h = dx * dvy - dy * dvx, inv = 2 / r - v2 / mu, a = inv !== 0 ? 1 / inv : Infinity;
  const e = Math.sqrt(Math.max(0, 1 - h * h / (mu * a)));
  return { r, E, h, a, e, P: a > 0 ? 2 * Math.PI * Math.sqrt(a * a * a / mu) : null, ang: Math.atan2(dy, dx) };
}
function build(p) {
  const v = HP.validatePreset(JSON.parse(JSON.stringify(p)));
  if (!v.ok) throw new Error('validatePreset: ' + JSON.stringify(v.errors).slice(0, 200));
  HP.sim.build(v.preset); return { S: HP.sim, pv: v.preset };
}
// 公転の本の 1 走行
function runOrbit(p, dt, nSteps, pair) {
  const { S } = build(p);
  const [c, o] = pair;
  if (!(c < S.n && o < S.n)) return { err: 'pair が粒子数の外' };
  const o0 = osc(S, c, o);
  const others = [];
  for (let i = 0; i < S.n; i++) if (i !== c && i !== o) {
    const q = osc(S, c, i); others.push({ i, r0: q.r, P: q.P });
  }
  let maxE = 0, maxL = 0, rMin = Infinity, angAcc = 0, angPrev = o0.ang, rev = 0, tRev1 = null, tRevN = null;
  for (let k = 0; k < nSteps; k++) {
    S.step(dt);
    if ((k & 7) === 7 || k === nSteps - 1) { if (S.hasNaN()) return { nan: true, k }; }
    const q = osc(S, c, o);
    if (q.r < rMin) rMin = q.r;
    const dE = Math.abs(q.E - o0.E) / Math.abs(o0.E), dL = Math.abs(q.h - o0.h) / Math.abs(o0.h);
    if (dE > maxE) maxE = dE; if (dL > maxL) maxL = dL;
    let d = q.ang - angPrev; while (d > Math.PI) d -= 2 * Math.PI; while (d < -Math.PI) d += 2 * Math.PI;
    angAcc += d; angPrev = q.ang;
    const nr = Math.floor(Math.abs(angAcc) / (2 * Math.PI));
    if (nr > rev) { rev = nr; const t = (k + 1) * dt; if (rev === 1) tRev1 = t; tRevN = t; }
  }
  const q1 = osc(S, c, o);
  const rEnd = others.map((z) => Math.hypot(S.x[z.i] - S.x[c], S.y[z.i] - S.y[c]));
  return { nan: S.hasNaN(), osc0: { a: o0.a, e: o0.e, P: o0.P, r: o0.r }, end: { a: q1.a, e: q1.e }, maxE, maxL, rMin, rev,
    pMeas: rev >= 2 ? (tRevN - tRev1) / (rev - 1) : null, clampV: S.clampVN || 0, clampS: S.clampSN || 0,
    solveFail: S.inertialDragSolveFail || 0, others, rEnd, n: S.n, t: S.t };
}
function runObserve(p, dt, nSteps) {
  const { S } = build(p);
  let maxR = 0;
  for (let k = 0; k < nSteps; k++) { S.step(dt); if ((k & 15) === 15 && S.hasNaN()) return { nan: true, k }; }
  for (let i = 0; i < S.n; i++) { const r = Math.hypot(S.x[i], S.y[i]); if (r > maxR) maxR = r; }
  // 3 体以下は粒子ごとの状態(質量・半径・自転)も返す(単一天体の内部の進化は位置が動かない —— 刻みの効きは状態で見る)
  const st = S.n <= 3 ? Array.from({ length: S.n }, (_, i) => [S.m[i], S.R[i], S.spin[i]]) : null;
  return { nan: S.hasNaN(), maxR, st, clampV: S.clampVN || 0, clampS: S.clampSN || 0, solveFail: S.inertialDragSolveFail || 0, n: S.n, t: S.t };
}
const relDiff = (a, b) => { const sc = Math.max(Math.abs(a), Math.abs(b)); return sc > 0 ? Math.abs(a - b) / sc : 0; };
const r6 = (x) => (x === null || x === undefined || !Number.isFinite(x)) ? x : Number(x.toPrecision(6));

const rows = [];
for (const p0 of HP.allPresets()) {
  if (IDS && IDS.indexOf(p0.id) < 0) continue;
  const p = JSON.parse(JSON.stringify(p0));
  const ov = PLAN && PLAN[p.id];
  if (ov) {
    p.physics = Object.assign({}, p.physics || {}, { timeScale: ov.timeScale });
    if (ov.stepDt !== undefined && ov.stepDt !== null) p.physics.stepDt = ov.stepDt; else delete p.physics.stepDt;
    p.timeRef = ov.timeRef;
  }
  const retired = p.familyRole === 'retired';
  const tr = p.timeRef || null;
  const st = HP.timeStd.timeStdOf(HP.validatePreset(JSON.parse(JSON.stringify(p))).preset);
  const ph = p.physics || {};
  const dtApp = (typeof ph.stepDt === 'number' && ph.stepDt > 0) ? ph.stepDt : DT_APP;
  const row = { id: p.id, emoji: p.emoji || '', retired, sampleClass: p.sampleClass || null, fit: !!p.fitRecord,
    timeScale: ph.timeScale === undefined ? 1 : ph.timeScale, tsOld: (p.id in baseTs) ? baseTs[p.id] : null,
    stepDt: (typeof ph.stepDt === 'number') ? ph.stepDt : null, dtApp, timeRef: tr, scaleT: p.scaleExp ? p.scaleExp.T : null };
  const ts0 = Date.now();
  try {
    if (!tr) { row.status = 'no-timeRef'; }
    else if (retired) {
      // 退役の本は移行しない(記録だけ)—— 宣言の stepsPerOrbit が旧刻みの記録と合うかだけを見る
      row.status = 'retired-record';
      if (tr.basis === 'orbit') row.stepsPerOrbit = r6(tr.pRef / dtApp);
    } else if (tr.basis === 'orbit') {
      const n = Math.ceil(ORBITS * tr.pRef / dtApp);
      const A = runOrbit(p, dtApp, n, tr.pair);
      const B = A.nan ? null : runOrbit(p, dtApp / 2, 2 * n, tr.pair);
      row.steps = n; row.stepsPerOrbit = r6(tr.pRef / dtApp); row.stepsPerOrbitOsc = A.osc0 ? r6(A.osc0.P / dtApp) : null;
      if (A.err) { row.status = 'error'; row.err = A.err; }
      else if (A.nan) { row.status = 'nan'; row.nanAt = A.k; }
      else {
        const dA = Math.abs(A.end.a - B.end.a) / Math.abs(A.osc0.a), dE = Math.abs(A.end.e - B.end.e);
        const rMinRatio = A.rMin / B.rMin;
        let ringBad = 0, ringN = 0, minSPO = null;
        for (let j = 0; j < A.others.length; j++) {
          const z = A.others[j];
          if (z.P && z.P > 0) { const spo = z.P / dtApp; if (minSPO === null || spo < minSPO) minSPO = spo;
            ringN++; if (Math.abs(A.rEnd[j] - B.rEnd[j]) / z.r0 > GATE.ringRel) ringBad++; }
        }
        const ringFrac = ringN ? ringBad / ringN : 0;
        Object.assign(row, { osc0: { a: r6(A.osc0.a), e: r6(A.osc0.e), P: r6(A.osc0.P) },
          end: { a: r6(A.end.a), e: r6(A.end.e) }, endHalf: { a: r6(B.end.a), e: r6(B.end.e) },
          dA: r6(dA), dE: r6(dE), maxRelE: r6(A.maxE), maxRelL: r6(A.maxL), rMinRatio: r6(rMinRatio), rev: A.rev,
          pMeas: r6(A.pMeas), pResid: A.pMeas ? r6(A.pMeas / tr.pRef - 1) : null,
          clamp: [A.clampV, A.clampS], clampHalf: [B.clampV, B.clampS], solveFail: A.solveFail, ringN, ringFrac: r6(ringFrac),
          otherMinStepsPerOrbit: r6(minSPO), cdtOverCam: (p.camera && p.camera.scale) ? r6((ph.cLight || 30) * dtApp / p.camera.scale) : null });
        const fails = [];
        if (A.solveFail > 0) fails.push('solveFail');
        if (!(dA <= GATE.dA)) fails.push('dA');
        if (!(dE <= GATE.dE)) fails.push('dE');
        if (!(Math.abs(rMinRatio - 1) <= GATE.rMin)) fails.push('rMin');
        if (ringFrac > GATE.ringFrac) fails.push('ring');
        row.fails = fails; row.status = fails.length ? 'unstable' : 'ok';
      }
    } else {
      const A = runObserve(p, dtApp, OBS_STEPS);
      row.steps = OBS_STEPS; row.tObsSteps = r6(tr.tObs / dtApp);
      if (A.nan) { row.status = 'nan'; row.nanAt = A.k; }
      else {
        Object.assign(row, { maxR: r6(A.maxR), clamp: [A.clampV, A.clampS], solveFail: A.solveFail });
        const fails = [];
        if (dtApp !== DT_APP) {
          const B = runObserve(p, dtApp / 2, 2 * OBS_STEPS);
          row.maxRHalf = r6(B.maxR); row.clampHalf = [B.clampV, B.clampS];
          if (B.nan) fails.push('refNaN');
          else {
            const rr = (A.maxR === 0 && B.maxR === 0) ? 1 : A.maxR / B.maxR;
            if (!(Math.abs(rr - 1) <= GATE.obsR)) fails.push('maxR');
            if (A.clampV + A.clampS > B.clampV + B.clampS) fails.push('clamp');
            if (A.st && B.st) {
              let w = 0; A.st.forEach((q, i) => q.forEach((x, j) => { const d = relDiff(x, B.st[i][j]); if (d > w) w = d; }));
              row.stateRel = r6(w); if (!(w <= GATE.obsState)) fails.push('state');
            }
          }
        }
        if (A.solveFail > 0) fails.push('solveFail');
        row.fails = fails; row.status = fails.length ? 'unstable' : 'ok';
      }
    }
  } catch (e) { row.status = 'error'; row.err = String(e.message || e).slice(0, 200); }
  row.ms = Date.now() - ts0;
  rows.push(row);
  if (process.env.W297C_VERBOSE) console.error(p.id, row.status, row.ms + 'ms');
}
const inSvc = rows.filter((r) => !r.retired);
const CODE = ['tests/exp-w297c-timestd.mjs', 'tests/lib-w280b-emgrid.mjs', 'tests/lib-w279b-headless.mjs', 'tests/lib-w272e-provenance.mjs', 'tests/lib-w281a-scope.mjs'];
const out = {
  meta: Object.assign(provenanceMeta({ root: ROOT, wave: '第297便c', target: TARGET, code: CODE, inputs: [TARGET] }), {
    version: TIMESTD_VERSION, timeStdVersion: TS.version,
    ruling: '原仮定者の裁定(第87報)③ 時間経過倍率 1 倍で、1 公転 360 ステップ程度を標準として、時間スケールを見直す',
    reading: '統括の検証項目 R163(physics.stepDt・timeRef・timeScale=1・全在位本の移行・A/B 停止)',
    rule: '公転の本: timeScale=1・stepDt=pRef/stepsPerOrbit(pRef は観測対象なら採用出典の周期・無ければ初期状態の二体の接触軌道 —— 実測周期で正規化しない)/ 観察の本: timeRef basis observe・timeScale 1〜4 / 退役: physics を変えない記録',
    engine: 'Node の headless(tests/lib-w280b-emgrid.mjs の loadHtmlMain —— html の本文をそのまま実行・1 プロセス)',
    orbits: ORBITS, observeSteps: OBS_STEPS, gate: GATE, orbitStepsStd: TS.orbitSteps, plan: !!PLAN, ids: IDS, base: BASE ? path.relative(ROOT, BASE) : null,
    loadErrors: loadErrors.slice(0, 3), wallSec: Math.round((Date.now() - t0) / 100) / 10,
    notClaim: ['画面の 360 步で 43″ や近点率を測った', '刻みの門は物理の合否', '実測周期で pRef を正規化した'] }),
  summary: {
    n: rows.length, inService: inSvc.length, retired: rows.length - inSvc.length,
    orbit: inSvc.filter((r) => r.timeRef && r.timeRef.basis === 'orbit').length,
    observe: inSvc.filter((r) => r.timeRef && r.timeRef.basis === 'observe').length,
    noTimeRef: rows.filter((r) => r.status === 'no-timeRef').map((r) => r.id),
    ok: inSvc.filter((r) => r.status === 'ok').length,
    notOk: inSvc.filter((r) => r.status !== 'ok').map((r) => r.id + ':' + r.status + (r.fails && r.fails.length ? '(' + r.fails.join(',') + ')' : '')),
    raised: inSvc.filter((r) => r.timeRef && r.timeRef.basis === 'orbit' && r.timeRef.stepsPerOrbit !== TS.orbitSteps).map((r) => r.id + ':' + r.timeRef.stepsPerOrbit),
    timeScaleNot1Orbit: inSvc.filter((r) => r.timeRef && r.timeRef.basis === 'orbit' && r.timeScale !== 1).map((r) => r.id),
    observeTsOut: inSvc.filter((r) => r.timeRef && r.timeRef.basis === 'observe' && !(r.timeScale >= 1 && r.timeScale <= 4)).map((r) => r.id) },
  rows };
Object.assign(out.meta, W281A_SCOPE, w281aStableInputs(ROOT, out.meta.inputs));
fs.mkdirSync(path.dirname(OUT), { recursive: true });
fs.writeFileSync(OUT, JSON.stringify(out, null, 1) + '\n');
console.log(JSON.stringify(out.summary));
