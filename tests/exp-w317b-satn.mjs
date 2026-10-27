// 第317便b(原仮定者の決断事項 AN431「『衛星の三体の永年の効きは、6 衛星とも帯の内で決まらない』について、何が必要なのかを探索する。G_loc が n = 2・1・0 それぞれの
// 場合も対象とする。K1 に決め切らず、K2 も調査する」・統括の検証項目 R251): **衛星の物理の軸の器**(G_loc の n = 2・1・0 × 引きずりの核 K1・K2 —— 段 satn-317b・
// 正本 tests/out/satn-w317b.json)。確認の材料 —— 合わせない・確認の値を在位へ入れない・在位の本の宣言は変えない(写しは第315便d の lib の bookOf の出力を
// tests/lib-w317b-satn.mjs の variantBook で差し替える —— G_loc・relativeDrag・天体の dragCore だけ)。
//
// Node だけ(対象 html の inline script を tests/lib-w280b-emgrid.mjs の loadHtmlMain で読み、validatePreset・coord3d.makeSim・build・step と読み口 inertialDragIsqState を
// そのまま呼ぶ)。走行は子プロセス(W317B_WORKERS —— 既定 2)。種・抽出(通過・接触の離心ベクトル)は第315便d の lib・判定の規則は第316便d の HARM_RULE(閾値 1e-2 は変えない)。
//
// ■ 何をするか(物理の軸 —— 走行の前に宣言して正本の plan に書く・結果を見て変えない)
//   ・G_loc: n = 2 {law:"kappaC2"}・n = 1 {law:"cRatio"}・n = 0 {law:"cLocPow", n:0}(既存の law)。q10 と q11 は同じ n。q00 は G_loc なし・引きずりなし。
//   ・核の行(lib の KERNEL_ROWS): K1-rule(n 3)・K1-Y(n)(n = 1・0 —— 候補 Y_k(n) = (6+2n)G_0/(C_1c_0²) を明示の dragCore で。n = 2 は門の 1 本〔h だけ〕で
//     K1-rule とビット同一か)・K2(i) 同じ半径(n = 2)・K2(ii) α = 10⁴(n = 2)・10⁶(n 3)・K2(iii) R_d = Y_k √(m_☉ m)(n = 2)。外殻と自転の引きずりは第315便d の q11 と同じ。
//   ・測る量 **M0**(共通ブリーフ): HARM_RULE の L 模型(AP.apsisRate —— 慣性速度の接触の離心ベクトルの成分の回帰・位置の角の 1〜3 倍の調和)を、
//     **窓の終端を共通の座標時刻 t₁ = N·P_seed**(P_seed = 本の timeRef.pRef —— q10 と q11 で同じ)で切って q10 と q11 に当てた差。窓は t ≤ N·P_seed + h/2
//     (標本は h ごと —— 窓の中の標本は N·S 個ちょうど〔門 m0Samples〕・終端の標本の丸めの揺れを h/2 の余白で除く)。走行は步の数 N·S·div で止める
//     (通過の窓のために N 回目の通過までは延ばす —— 延ばした步は M0 の窓の外)。**第316便d の通過の窓の値(windowOf の L)も同じ行に並べる**。
//   ・段 ① 二体の格子(6 衛星 × n 3 × 核の行 × q10・q11 × h・h/2・h/4 × 32 公転 —— 窓 8・16・32)→ 判定 J2(M0 と通過の窓 × R1・R2)。
//     段 ② 三体(イオ → トリトンの順 × n × **二体〔同じ衛星・同じ n・同じ核の行〕で M0 が R1 ∧ R2 だった行だけ** × h・h/2・h/4 × 64 公転 —— 窓 8・16・32・64)→ 判定 J3。
//     **二体で帯を外れた組を三体へ流さない**(門 flowOk)。正本の三体は**イオだけ**(正本の段の所要の目安 2 worker で 60 分 —— トリトンの三体は同じ規則の探索で
//     W317B_SATS3=io,triton・W317B_OUT へ)。段 ③(他の衛星の三体 —— 二体と三体のイオで決まった組だけ)も探索で W317B_OUT へ(正本に入れない)。
//   ・X(まとめ): 二体の解析の一次の率と並べた表・Σ = q11 − q00 が K1-Y(n) で n によらずそろうか(規則は plan.align —— 走行の前に宣言)・K2 の効きの大きさ
//     (K1-rule の何分の一か)と α² の伸び・三体で n と核が決まり方を変えるか。
//
// ■ 試走: W317B_QUICK=1(W317B_OUT が要る —— 正本を書かない)。再開: W317B_CACHE=<dir>(走行 1 本ごとの結果を逐次書き、同じ html・同じ器の版・同じ走行の鍵があれば読む)。
//   衛星: W317B_SATS(二体 —— 正本は 6 本)・W317B_SATS3(三体 —— 正本はイオ・トリトンは探索)。W317B_STAGE3=1 は段 ③(W317B_OUT が要る)。
//
// ■ 言わないこと: 「フィットした」「較正した」「収束した」「完全に一致」「法則を確かめた」「検証が完了した」「シュヴァルツシルト半径そのもの」。候補 Y_k(n) を普遍則と書かない。
//   近似要素の種を観測レコードと呼ばない。数値の帯は観測の 3σ ではない。h・h/2・h/4 は刻みの感度診断・窓は抽出の感度診断。決まらなければ「この予算では永年項として
//   決まらない」と書く(法則の否定・効きが無いとは書かない)。回帰で窓の傾きを吸っただけを改善と呼ばない。
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { loadHtmlMain } from './lib-w280b-emgrid.mjs';
import { provenanceMeta } from './lib-w272e-provenance.mjs';
import { scopeStamp as w281aScopeStamp, stableInputs as w281aStableInputs } from './lib-w281a-scope.mjs';
import * as AP from './lib-w304e-apsis.mjs';
import * as L from './lib-w315d-satk1.mjs';
import * as X315 from './exp-w315d-satk1.mjs';
import * as X316 from './exp-w316d-sath.mjs';
import * as B from './lib-w317b-satn.mjs';
// 第281便a の領域 hash の宣言(器と lib から deriveScope で引いた下限 —— 第316便d の器と同じ読み口〔在位の本は .find で引く —— jupiterGalilean・saturnRingReal〕)
const REGEN_SCOPE = {"presets":["jupiterGalilean","saturn","saturnRingReal"],"roots":["$","HP.REL_DRAG_INVSQ_VERSION","HP.allPresets","HP.coord3d","HP.dfmMeshVelocityFieldAt","HP.inertialDragIsqState","HP.sim","HP.validatePreset","T","ch","ctx","cw","pnSource"],"core":true,"consts":[],"complete":true};

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
export const HARNESS_VERSION = 'w317b-satn-1';
const IS_MAIN = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
const clone = (x) => JSON.parse(JSON.stringify(x));
const NOT_CLAIM = ['フィットした', '較正した', '収束した', '完全に一致', '法則を確かめた', '検証が完了した', 'シュヴァルツシルト半径そのもの', '観測レコード', '候補 Y_k(n) を普遍則と書く', '精度の改善(窓の見かけの傾きを吸っただけのとき)'];
export const OUT_SATN = 'tests/out/satn-w317b.json';
export const SATH_OUT = 'tests/out/sath-w316d.json';
export const SATS = X315.SATS;
/** 段 ② の対象(イオ → トリトンの順)と正本の三体(予算 —— イオだけ) */
export const SATS3_STAGE2 = Object.freeze(['io', 'triton']);
export const SATS3 = Object.freeze(['io']);
export const HARM_RULE = X316.HARM_RULE;
const K_ALL = Object.freeze(B.KERNEL_ROWS.map((r) => r.key));
/** 計画(正本 —— 走行の前に宣言)。窓は同じ走行の入れ子(runN 公転の 1 本から最初の N 公転)・刻み h = 恒星周期(種)/ stepsPerOrbit */
export const PLAN = Object.freeze({ stepsPerOrbit: 720, divs: Object.freeze([1, 2, 4]), ns: B.NS, kernels: K_ALL,
  two: Object.freeze({ runN: 32, windows: Object.freeze([8, 16, 32]) }), three: Object.freeze({ runN: 64, windows: Object.freeze([8, 16, 32, 64]) }),
  gateDivs: Object.freeze([1]) });
export const QUICK = Object.freeze({ stepsPerOrbit: 360, divs: Object.freeze([1, 2]), ns: B.NS, kernels: K_ALL,
  two: Object.freeze({ runN: 4, windows: Object.freeze([2, 4]) }), three: Object.freeze({ runN: 4, windows: Object.freeze([2, 4]) }), gateDivs: Object.freeze([1]) });
/** 宣言の文(正本の plan に写す —— 走行の前に固定) */
export const DECL = Object.freeze({
  gLoc: 'n = 2 {law:"kappaC2"}・n = 1 {law:"cRatio"}・n = 0 {law:"cLocPow", n:0}(既存の law —— 新しい law は足さない)・q10 と q11 は同じ n',
  radiusPolicy: B.RADIUS_POLICY,
  k2Points: 'K2 の半径の方針: (i) 同じ半径 α = 1(n = 2)・(ii) 倍率 α = 10⁴(n = 2)と 10⁶(n = 2・1・0 —— 効きが α² で伸びるか・n による違いもこの点で)・'
    + '(iii) R_d = Y_k √(m_☉ m)(n = 2 —— 規格の点は太陽)。点の選び方: K2 の並進の割合は β ∝ R_d,i R_d,j/r²(受け手の自己の場の分母 m_i/R_d,i²)で K1 の β ∝ R_d,j/r に対して '
    + 'R_d,i/a の比 —— 衛星の R_d = Y_k m は 10⁻³ m の桁・a は 10⁸〜10⁹ m なので (i) は K1 の 10⁻¹² の桁。α² で伸びれば α = 10⁶ で K1 の桁に届く'
    + '(試走 4 公転の (iii) の効きの桁がこの見積りと同じ桁であることを走行の前に確かめた)',
  m0: 'M0 = L 模型(AP.apsisRate K = 3 —— 慣性速度の接触の離心ベクトルの成分の回帰)の近点の率を、窓 t ≤ N·P_seed + h/2(P_seed = timeRef.pRef・標本は h ごとに N·S 個)で q10 と q11 に当てた差。'
    + '走行は N·S·div 步で止める(通過の窓のために N 回目の通過までは延ばす —— 延ばした步は M0 の窓の外)',
  pass: '第316便d の通過の窓(L.windowOf —— N 回目の通過まで・q10 と q11 で終端の時刻が違う)の L の近点の率の差(同じ走行から)',
  verdict: '決まった = R1 ∧ R2(HARM_RULE の L 模型 —— R1 窓の安定〔最長の窓とその前の窓の差 ≤ 両窓の h/2–h/4 の帯の大きい方〕・R2 刻みの帯〔最長の窓の h–h/2・h/2–h/4 ≤ 1e-2 × abs(差)〕)。'
    + '決まらなければ「この予算では永年項として決まらない」(法則の否定・効きが無いとは書かない)',
  flow: '三体の走行 = 二体(同じ衛星・同じ n・同じ核の行)で M0 が R1 ∧ R2 の組だけ(二体で帯を外れた組を三体の合格へ流さない)。K1-Y(n) の n = 2 は K1-rule(門 k1yIdentity)。'
    + '段 ② はイオ → トリトンの順 —— 正本はイオだけ(正本の段の所要の目安 2 worker で 60 分)・トリトンは同じ規則の探索(正本に入れない)',
  align: 'そろえる量 Σ = q11 − q00(M0・最長の窓・最も細かい刻み —— G_loc と引きずりの効きの和)。K1-Y(n) の行(n = 2 は K1-rule)で abs(Σ(n) − Σ(2)) ≤ 1e-2 × abs(Σ(2)) なら「n によらずそろう」。'
    + '参考に Σ − q_1PN(第315便d の r_1PN と同じ量)',
  k2ratio: 'K2 の効きの大きさ = K2 の行の q11 − q10 / K1-rule の q11 − q10(同じ衛星・同じ系・同じ n・M0・最長の窓・最も細かい刻み)。α² の伸び = 比(α = 10⁶)/比(α = 10⁴)/10⁴・'
    + '比(α = 10⁴)/比(α = 1)/10⁸。K1 と同じ大きさになる α の外挿 = 10⁶/√比(α = 10⁶)(α² の伸びを仮定した参考)',
  stage3: '段 ③(他の衛星の三体)は二体と三体のイオで決まった組だけ —— 探索(W317B_OUT —— 正本に入れない)' });

/* ───────── 走行 ───────── */
export const specKey = (s) => 'satN:' + s.sat + '|' + s.sys + '|' + s.kind + '|n=' + (s.kind === 'q00' ? '-' : s.n) + '|kr=' + (s.kind === 'q11' ? s.kr : '-') + '|S=' + s.S + '|div=' + s.div + '|N=' + s.N;
const PASS_F = ['sidDays', 'aps', 'node', 'axSat', 'axPar', 'eMean', 'incMeanDeg'];
export function runSpecN(HP, sp) {
  const sd = L.seedOf(HP, sp.sat), kr = sp.kind === 'q11' ? B.kernelRowOf(sp.kr) : null, key = specKey(sp);
  const book = B.variantBook(HP, sp.sat, sp.sys, sp.kind, sp.n, kr, { seed: sd, stepsPerOrbit: sp.S }), P = L.parentOf(sd.parent);
  const v = HP.validatePreset(clone(book));
  if (!v.ok) return { key, spec: sp, status: 'rejected', err: JSON.stringify(v.errors).slice(0, 300) };
  const S = HP.coord3d.makeSim(); S.build(clone(v.preset));
  if (S.coord3d !== true) return { key, spec: sp, status: 'rejected', err: '三次元の本ではない' };
  const ip = book.timeRef.pair[0], is = book.timeRef.pair[1], mu = S.params.G * (S.m[ip] + S.m[is]);
  const h = book.physics.stepDt, dt = h / sp.div, Tsec = Math.pow(10, book.scaleExp.T), t0 = Date.now();
  const smp = L.attachSatSampler(S, { ci: ip, oi: is, mu, every: sp.div, pole: P.orbitPole });
  const nM0 = sp.N * sp.S * sp.div, maxSteps = Math.ceil(1.5 * nM0);
  let k = 0, stop = null;
  for (; ; k++) {   // 第316便d の runSpecH と同じ步の回し方(S.step(dt) の繰り返し —— 止める条件だけ違う)
    if (k >= maxSteps) { stop = 'maxSteps'; break; }
    S.step(dt);
    if (S.coord3dHalt) { stop = 'coord3dHalt'; break; }
    if (S.inertialDragHalt === true) { stop = 'solveHalt'; break; }
    if (S.hasNaN()) { stop = 'nan'; break; }
    if (k + 1 >= nM0 && smp.rev.length >= sp.N) { k++; stop = 'done'; break; }
  }
  const s = smp.samples(), R = { rev: smp.rev.slice(), s }, windows = {};
  for (const N of sp.wins) {
    const w = L.windowOf(R, N, Tsec), pass = { complete: w.complete === true };
    if (w.complete) for (const f of PASS_F) pass[f] = w[f];
    const t1 = N * book.timeRef.pRef + 0.5 * h, ap = AP.apsisRate(s, { t0: 0, t1, K: 3 });
    windows[N] = { m0: ap ? { t1, n: ap.n, aps: AP.toArcsecPerCentury(ap.rate, Tsec), e: ap.e } : { t1, n: 0, aps: null, e: null }, pass };
  }
  const fin = []; for (let i = 0; i < book.bodies.length; i++) fin.push(S.x[i], S.y[i], S.z[i], S.vx[i], S.vy[i], S.vz[i]);
  const st = HP.inertialDragIsqState ? HP.inertialDragIsqState(S) : null;
  smp.detach();
  return { key, spec: sp, h, status: 'run', steps: k, stepsM0: nM0, stop, complete: stop === 'done', nan: S.hasNaN(), unbound: smp.unbound(), dt, warnings: (v.warnings || []).length,
    windows, fin, betaMax: st ? st.betaMax : null, wallSec: (Date.now() - t0) / 1000 };
}

/* ───────── 子プロセスの池と再開の写し(第316便d と同じ型)───────── */
function makePool(NW, self) {
  let active = 0; const q = [];
  const pump = () => { q.sort((a, b) => b.pri - a.pri); while (active < NW && q.length) { const { sp, res, rej } = q.shift(); active++;
    const ch = spawn(process.execPath, ['--max-old-space-size=6144', self, '--child', JSON.stringify(sp)], { cwd: ROOT, env: process.env });
    let out = '', err = '';
    ch.stdout.on('data', (d) => { out += d; }); ch.stderr.on('data', (d) => { err += d; });
    ch.on('close', (code) => { active--; pump(); if (code !== 0) return rej(new Error(specKey(sp) + ': ' + err.slice(0, 600)));
      try { res(JSON.parse(out.slice(out.lastIndexOf('\n{') + 1))); } catch (e) { rej(new Error(specKey(sp) + ': 出力が JSON でない ' + out.slice(-200))); } }); } };
  return (sp, pri = 0) => new Promise((res, rej) => { q.push({ sp, res, rej, pri }); pump(); });
}
function cachedRun(run, dir, targetSha256, stat) {
  if (!dir) return run;
  fs.mkdirSync(dir, { recursive: true });
  const fileOf = (sp) => path.join(dir, crypto.createHash('sha256').update(HARNESS_VERSION + '|' + B.LIB_VERSION + '|' + L.LIB_VERSION + '|' + targetSha256 + '|' + specKey(sp) + '|' + JSON.stringify(sp.wins)).digest('hex').slice(0, 32) + '.json');
  return (sp, pri) => {
    const f = fileOf(sp);
    try { const c = JSON.parse(fs.readFileSync(f, 'utf8')); if (c.version === HARNESS_VERSION && c.targetSha256 === targetSha256 && c.row && c.row.key === specKey(sp)) { stat.resumed++; return Promise.resolve(c.row); } } catch (e) { /* 無い */ }
    return run(sp, pri).then((r) => { const tmp = f + '.tmp'; fs.writeFileSync(tmp, JSON.stringify({ version: HARNESS_VERSION, targetSha256, row: r })); fs.renameSync(tmp, f); return r; });
  };
}

/* ───────── 段 P(t = 0 の写しの R_d —— 核の行ごと・n ごと〔yn だけ n で変わる〕・二体と三体)───────── */
export function probeN(HP, sats, S) {
  const out = { Yk: null, rows: {} };
  for (const k of sats) {
    const sd = L.seedOf(HP, k);
    for (const sys of L.SYSTEMS) for (const kr of B.KERNEL_ROWS) for (const n of (kr.radius === 'yn' ? [2, 1, 0] : [2])) {
      const b = B.variantBook(HP, k, sys, 'q11', n, kr, { seed: sd, stepsPerOrbit: S }), v = HP.validatePreset(clone(b)), id = k + '|' + sys + '|' + kr.key + '|n=' + n;
      if (!v.ok) { out.rows[id] = { err: JSON.stringify(v.errors).slice(0, 300) }; continue; }
      const Sm = HP.coord3d.makeSim(); Sm.build(clone(v.preset));
      const st = HP.inertialDragIsqState(Sm), Lm = Math.pow(10, b.scaleExp.L), Yk = L.YkBook(b);
      out.Yk = Yk * Lm / Math.pow(10, b.scaleExp.M);
      const names = sys === 'three' ? ['太陽', L.PARENTS[sd.parent].ja, sd.ja] : [L.PARENTS[sd.parent].ja, sd.ja];
      const bodies = b.bodies.map((z, i) => { const rc = (st.receivers || []).find((q) => q.i === i), mE = L.engineMassOf(z.m, b.physics), decl = z.dragCore ? z.dragCore.radius : Yk * mE;
        return { name: names[i], rdDecl: decl * Lm, rdEngine: rc ? rc.Rd * Lm : null, rdSame: rc ? Object.is(rc.Rd, decl) : false, mdSame: rc ? Object.is(rc.md, mE) : false, rdOverR: decl / z.radius,
          rdOverRule: decl / (Yk * mE) }; });
      out.rows[id] = { kernel: v.preset.physics.relativeDrag.invSq.kernel || 'k2', rdRule: v.preset.physics.relativeDrag.invSq.rdRule || null, warnings: (v.warnings || []).length, bodies, betaMax: st.betaMax };
    }
  }
  return out;
}

/* ───────── 段 T(種と二体の解析の一次の率 —— n ごと・K1 の行ごと)───────── */
export function targetsN(HP, sats) {
  const base = X315.targetsOf(HP, sats), out = {};
  for (const k of sats) {
    const sd = L.seedOf(HP, k), P = L.parentOf(sd.parent), ph = P.physics, refs = {};
    for (const n of B.NS) refs[n] = { k1rule: B.refsN(sd, P, n, L.YkBook({ physics: ph })), k1y: B.refsN(sd, P, n, B.ykN(ph, n)), g: B.refsN(sd, P, n, NaN) };
    out[k] = Object.assign({}, base[k], { refs });
  }
  return out;
}

/* ───────── 判定(走行の行から —— 純関数 —— QA が作り直す)───────── */
const finiteOr = (x) => (Number.isFinite(x) ? x : null);
const rowOf = (E, sat, sys, kind, n, kr, div) => { const r = E.rows[specKey({ sat, sys, kind, n, kr, S: E.stepsPerOrbit, div, N: E.runN })]; return r && r.status === 'run' ? r : null; };
const valOf = (r, N, meas) => { if (!r || !r.windows[N]) return null; const w = r.windows[N]; return meas === 'm0' ? finiteOr(w.m0.aps) : (w.pass.complete ? finiteOr(w.pass.aps) : null); };
/** 計画の組(系ごと)。q11 の組 = 核の行 × その行の n(K1-Y(n) の n = 2 は門の行で判定しない) */
export const combosOf = (kernels) => { const out = []; for (const kk of kernels) { const kr = B.kernelRowOf(kk); for (const n of kr.ns) out.push({ n, kr: kk }); } return out; };
/**
 * 1 つの組(衛星・系・n・核の行)の判定(M0 と通過の窓)。byWin[N].byDiv[d] = q00・q10・q11・dDG = q11 − q10・dG = q10 − q00・sum = q11 − q00。
 * R1・R2 は第316便d の partA の L 模型と同じ式(HARM_RULE.rel)。
 */
export function verdictOf(E, sat, sys, n, kr, meas) {
  const ws = E.windows.slice().sort((a, b) => a - b), ds = E.divs.slice().sort((a, b) => a - b), fine = ds[ds.length - 1], fine2 = ds.length >= 2 ? ds[ds.length - 2] : null;
  const o = { byWin: {} };
  for (const N of ws) {
    const z = { byDiv: {}, bands: {} };
    for (const d of ds) { const a = valOf(rowOf(E, sat, sys, 'q00', null, null, d), N, meas), b = valOf(rowOf(E, sat, sys, 'q10', n, null, d), N, meas), c = valOf(rowOf(E, sat, sys, 'q11', n, kr, d), N, meas);
      if (a === null || b === null || c === null) continue;
      z.byDiv[d] = { q00: a, q10: b, q11: c, dDG: c - b, dG: b - a, sum: c - a }; }
    for (let i = 1; i < ds.length; i++) { const x = z.byDiv[ds[i]], y = z.byDiv[ds[i - 1]]; z.bands[ds[i - 1] + '-' + ds[i]] = (x && y) ? Math.abs(x.dDG - y.dDG) : null; }
    z.v = z.byDiv[fine] ? z.byDiv[fine].dDG : null; z.bandFine = fine2 !== null ? finiteOr(z.bands[fine2 + '-' + fine]) : null;
    o.byWin[N] = z;
  }
  o.steps = []; for (let i = 1; i < ws.length; i++) { const a = o.byWin[ws[i - 1]], b = o.byWin[ws[i]];
    const d = (Number.isFinite(a.v) && Number.isFinite(b.v)) ? Math.abs(b.v - a.v) : null, band = (Number.isFinite(a.bandFine) && Number.isFinite(b.bandFine)) ? Math.max(a.bandFine, b.bandFine) : null;
    o.steps.push({ from: ws[i - 1], to: ws[i], d, band, overBand: (Number.isFinite(d) && band > 0) ? d / band : null, within: (Number.isFinite(d) && Number.isFinite(band)) ? d <= band : null }); }
  o.longest = ws[ws.length - 1];
  const zl = o.byWin[o.longest], last = o.steps[o.steps.length - 1], bandsL = Object.values(zl.bands), tol = Number.isFinite(zl.v) && zl.v !== 0 ? HARM_RULE.rel * Math.abs(zl.v) : null;
  o.tol = tol;
  o.R2over = (bandsL.length >= 2 && bandsL.every((x) => Number.isFinite(x)) && tol !== null) ? Math.max(...bandsL) / tol : null;
  o.R1 = last ? last.within === true : false;
  o.R2 = (bandsL.length >= 2 && bandsL.every((x) => Number.isFinite(x)) && tol !== null) ? bandsL.every((x) => x <= tol) : false;
  o.determined = o.R1 && o.R2;
  o.verdict = o.determined ? '帯の内で決まった' : 'この予算では永年項として決まらない';
  return o;
}
/** 系の判定(衛星 × 組 × 測る量 M0・通過の窓)と、走らせた組の一覧 */
export function judgeOf(E, sys) {
  const out = { sys, systems: {} };
  for (const sat of E.sats) { const o = {};
    for (const c of E.combos[sat]) o[c.kr + '|n=' + c.n] = { n: c.n, kr: c.kr, m0: verdictOf(E, sat, sys, c.n, c.kr, 'm0'), pass: verdictOf(E, sat, sys, c.n, c.kr, 'pass') };
    out.systems[sat] = o; }
  return out;
}
/** 三体の組(二体で M0 が R1 ∧ R2 の組だけ)。extra = 段 ③ の条件(三体のイオでも決まった組) */
export function flowOf(J2, sat, combos, extra) {
  const s2 = J2.systems[sat]; if (!s2) return [];
  return combos.filter((c) => { const z = s2[c.kr + '|n=' + c.n]; if (!(z && z.m0.determined === true)) return false;
    if (extra) { const zi = extra.systems.io && extra.systems.io[c.kr + '|n=' + c.n]; return !!(zi && zi.m0.determined === true); } return true; });
}

/* ───────── まとめ(X —— 純関数)───────── */
const fineOf = (E) => { const ds = E.divs.slice().sort((a, b) => a - b); return ds[ds.length - 1]; };
const atLongest = (v) => { const z = v.byWin[v.longest]; return z && z.byDiv ? z : null; };
export function synthOf(J) {
  const out = { align: {}, twoRefs: {}, k2: {}, three: {} };
  // 二体: n ごと・核ごとの q11 − q10 と q10 − q00・Σ と解析の一次の率(K1 の行)
  if (J.J2) { const f = fineOf(J.E2);
    for (const sat of J.E2.sats) { const s2 = J.J2.systems[sat], T = J.T.systems[sat], rows = {};
      for (const [id, z] of Object.entries(s2)) { const zl = atLongest(z.m0), q = zl && zl.byDiv[f]; if (!q) continue;
        const ref = z.kr === 'k1rule' ? T.refs[z.n].k1rule : (z.kr === 'k1y' ? T.refs[z.n].k1y : T.refs[z.n].g);
        rows[id] = { n: z.n, kr: z.kr, dDG: q.dDG, dG: q.dG, sum: q.sum, determined: z.m0.determined, q1pn: ref.q1pn, gLocA: ref.gLocA, dragA: finiteOr(ref.dragA), sumA: finiteOr(ref.sumA),
          dDGOverA: Number.isFinite(ref.dragA) ? q.dDG / ref.dragA : null, dGOverA: ref.gLocA !== 0 ? q.dG / ref.gLocA : null, r1pn: q.sum - ref.q1pn, rOverQ: (q.sum - ref.q1pn) / ref.q1pn }; }
      out.twoRefs[sat] = rows;
      // そろえる量 Σ(K1-Y(n) —— n = 2 は K1-rule)
      const s2v = rows['k1rule|n=2'], al = { ref: s2v ? s2v.sum : null, byN: {} };
      for (const n of J.E2.ns) { const r = n === 2 ? s2v : rows['k1y|n=' + n]; if (!r || !s2v) continue;
        const dev = Math.abs(r.sum - s2v.sum), tol = HARM_RULE.rel * Math.abs(s2v.sum);
        al.byN[n] = { sum: r.sum, dev, tol, aligned: dev <= tol, devOverSum: dev / Math.abs(s2v.sum), rOverQ: r.rOverQ, sumRule: rows['k1rule|n=' + n] ? rows['k1rule|n=' + n].sum : null }; }
      al.aligned = Object.keys(al.byN).length === J.E2.ns.length && Object.values(al.byN).every((x) => x.aligned);
      out.align[sat] = al; } }
  // K2 の効きの大きさ(K1-rule の何分の一か)と α² の伸び —— 系ごと
  const k2Of = (E, Jx, sys) => { const f = fineOf(E), res = {};
    for (const sat of E.sats) { const s = Jx.systems[sat]; if (!s) continue; const base = s['k1rule|n=2'], zb = base ? atLongest(base.m0) : null, vb = zb && zb.byDiv[f] ? zb.byDiv[f].dDG : null; const o = { k1: vb, rows: {} };
      for (const [id, z] of Object.entries(s)) { if (!z.kr.startsWith('k2')) continue; const zl = atLongest(z.m0), v = zl && zl.byDiv[f] ? zl.byDiv[f].dDG : null;
        const bz = s['k1rule|n=' + z.n], zk = bz ? atLongest(bz.m0) : null, vk = zk && zk.byDiv[f] ? zk.byDiv[f].dDG : null;
        o.rows[id] = { n: z.n, kr: z.kr, v, k1: vk, ratio: (Number.isFinite(v) && Number.isFinite(vk) && vk !== 0) ? v / vk : null, determined: z.m0.determined, R1: z.m0.R1, R2: z.m0.R2, R2over: z.m0.R2over }; }
      const r = (k) => (o.rows[k] && Number.isFinite(o.rows[k].ratio) ? o.rows[k].ratio : null);
      o.alphaSq = { a1e6over1e4: (r('k2a1e6|n=2') !== null && r('k2a1e4|n=2') !== null) ? r('k2a1e6|n=2') / r('k2a1e4|n=2') / 1e4 : null,
        a1e4over1: (r('k2a1e4|n=2') !== null && r('k2same|n=2') !== null) ? r('k2a1e4|n=2') / r('k2same|n=2') / 1e8 : null,
        alphaEq: (r('k2a1e6|n=2') !== null && r('k2a1e6|n=2') > 0) ? 1e6 / Math.sqrt(r('k2a1e6|n=2')) : null };
      res[sat] = o; }
    return res; };
  if (J.J2) out.k2.two = k2Of(J.E2, J.J2, 'two');
  if (J.J3) out.k2.three = k2Of(J.E3, J.J3, 'three');
  // 三体: 組ごとの決まり方(M0 と通過の窓)と二体の値
  if (J.J3) { const f = fineOf(J.E3), f2 = J.E2 ? fineOf(J.E2) : null;
    for (const sat of J.E3.sats) { const s3 = J.J3.systems[sat], rows = {};
      for (const [id, z] of Object.entries(s3)) { const zl = atLongest(z.m0), q = zl && zl.byDiv[f], last = z.m0.steps[z.m0.steps.length - 1], lp = z.pass.steps[z.pass.steps.length - 1];
        const z2 = J.J2 && J.J2.systems[sat] ? J.J2.systems[sat][id] : null, q2 = z2 ? atLongest(z2.m0) : null;
        rows[id] = { n: z.n, kr: z.kr, dDG: q ? q.dDG : null, dG: q ? q.dG : null, two: q2 && q2.byDiv[f2] ? q2.byDiv[f2].dDG : null, R1: z.m0.R1, R2: z.m0.R2, determined: z.m0.determined,
          r1Over: last ? last.overBand : null, R2over: z.m0.R2over, passR1: z.pass.R1, passR2: z.pass.R2, passDetermined: z.pass.determined, passR1Over: lp ? lp.overBand : null, passR2over: z.pass.R2over }; }
      out.three[sat] = rows; } }
  return out;
}

/* ───────── 門(器の健全さ —— 判定〔J2・J3・X〕は結果で、ここに入れない)───────── */
const sameRun = (a, b) => !!(a && b && a.fin && b.fin && a.fin.length === b.fin.length && a.fin.every((x, i) => Object.is(x, b.fin[i])) && a.steps === b.steps
  && Object.keys(a.windows).every((N) => b.windows[N] && Object.is(a.windows[N].m0.aps, b.windows[N].m0.aps) && PASS_F.every((f) => Object.is(a.windows[N].pass[f], b.windows[N].pass[f]))));
export function gatesOf(J) {
  const g = {};
  if (J.P) g.rdEngine = Object.values(J.P.rows).every((r) => !r.err && r.bodies.every((b) => b.rdSame && b.mdSame)) && Object.entries(J.P.rows).every(([id, r]) => (id.indexOf('|k1') > 0 ? r.kernel === 'k1' : r.kernel === 'k2') && (id.indexOf('|k1rule|') > 0 ? r.rdRule === 'kappaM' : r.rdRule === null));
  if (J.T) { g.seedsFinite = Object.values(J.T.systems).every((t) => [t.m, t.R, t.a, t.e, t.iEqDeg, t.spin, t.PDays, t.q1pn, t.gLocAnalytic].every(Number.isFinite) && t.e >= 0 && t.e < 1 && t.a > 0);
    g.refsSame315 = Object.values(J.T.systems).every((t) => Object.is(t.refs[2].k1rule.q1pn, t.q1pn) && Object.is(t.refs[2].k1rule.gLocA, t.gLocAnalytic) && Object.is(t.refs[2].k1y.dragA, t.refs[2].k1rule.dragA)); }
  const Es = [J.E2, J.E3].filter(Boolean);
  if (Es.length) {
    const all = Es.flatMap((E) => Object.values(E.rows));
    g.noRejected = all.every((r) => r.status === 'run');
    g.runsComplete = all.filter((r) => r.status === 'run').every((r) => r.complete && !r.nan && !r.unbound && r.spec.wins.every((N) => r.windows[N] && r.windows[N].pass.complete && Number.isFinite(r.windows[N].pass.aps) && Number.isFinite(r.windows[N].m0.aps)));
    g.m0Samples = all.filter((r) => r.status === 'run').every((r) => r.spec.wins.every((N) => r.windows[N] && r.windows[N].m0.n === N * r.spec.S));
    g.allRows = Es.every((E) => Object.keys(E.rows).length === E.planned);
    // K1-Y(n) の n = 2(明示の dragCore で規則と同じ半径)は K1-rule の行とビット同一(終状態・窓の値)
    const idn = Es.flatMap((E) => Object.values(E.rows).filter((r) => r.status === 'run' && r.spec.kind === 'q11' && r.spec.kr === 'k1y' && r.spec.n === 2).map((r) => [r, E.rows[specKey(Object.assign({}, r.spec, { kr: 'k1rule' }))]]));
    g.k1yIdentity = idn.length > 0 && idn.every(([a, b]) => sameRun(a, b));
    // n = 0 の q10(G_loc = G・(c_loc/c_0)⁰)は q00 とビット同一
    const z0 = Es.flatMap((E) => Object.values(E.rows).filter((r) => r.status === 'run' && r.spec.kind === 'q10' && r.spec.n === 0).map((r) => [r, E.rows[specKey(Object.assign({}, r.spec, { kind: 'q00', n: null }))]]));
    g.n0Identity = z0.length > 0 && z0.every(([a, b]) => sameRun(a, b));
    if (J.E3 && J.J2) g.flowOk = J.E3.sats.every((sat) => { const want = flowOf(J.J2, sat, combosOf(J.E2.kernels), SATS3_STAGE2.includes(sat) ? null : J.J3).map((c) => c.kr + '|n=' + c.n).sort(), got = J.E3.combos[sat].map((c) => c.kr + '|n=' + c.n).sort(); return JSON.stringify(want) === JSON.stringify(got); });
    if (J.prefix) g.prefixSame = J.prefix.compared > 0 && J.prefix.same === J.prefix.compared;
  }
  return g;
}

/* ───────── 第316便d の走行との照合(n = 2 の K1-rule・q10・q00 —— 同じ本・同じ步)───────── */
export function prefixOf(J, Jh) {
  const out = { source: SATH_OUT, compared: 0, same: 0, diff: [] };
  if (!Jh || !Jh.E) return Object.assign(out, { note: '第316便d の正本が無い' });
  for (const E of [J.E2, J.E3].filter(Boolean)) for (const r of Object.values(E.rows)) {
    if (r.status !== 'run' || !(r.spec.kind === 'q00' || (r.spec.n === 2 && (r.spec.kind === 'q10' || r.spec.kr === 'k1rule')))) continue;
    const k = X315.specKey({ sat: r.spec.sat, sys: r.spec.sys, kind: r.spec.kind, S: Jh.E.stepsPerOrbit, div: r.spec.div, N: Jh.E.runN }), o = Jh.E.rows[k];
    if (!o || o.status !== 'run' || r.spec.S !== Jh.E.stepsPerOrbit) continue;
    for (const N of r.spec.wins) { if (!o.windows[N] || !r.windows[N] || !r.windows[N].pass.complete) continue; out.compared++;
      if (PASS_F.every((f) => Object.is(r.windows[N].pass[f], o.windows[N][f]))) out.same++; else if (out.diff.length < 8) out.diff.push(r.key + '@' + N); }
  }
  return out;
}

/* ───────── 費用 ───────── */
export function costOf(Es) {
  const by = {};
  for (const E of Es) for (const r of Object.values(E.rows)) { if (r.status !== 'run') continue;
    const fam = r.spec.kind === 'q11' ? (r.spec.kr.startsWith('k1') ? 'k1' : 'k2') : 'nodrag', k = r.spec.sys + '|' + fam + '|h/' + r.spec.div;
    const w = by[k] || (by[k] = { n: 0, steps: 0, wallSec: 0 }); w.n++; w.steps += r.steps; w.wallSec += r.wallSec; }
  const rate = {}; for (const [k, w] of Object.entries(by)) rate[k] = { rateStepsPerSec: w.wallSec > 0 ? w.steps / w.wallSec : null };
  return { rows: by, rate };
}

/* ───────── 走行の計画 ───────── */
function specsOf(sats, sys, P, Pw, combosBy, gate) {
  const specs = [];
  for (const sat of sats) {
    for (const d of P.divs) {
      specs.push({ sat, sys, kind: 'q00', n: null, kr: null, S: P.stepsPerOrbit, div: d, N: Pw.runN, wins: Pw.windows.slice() });
      for (const n of P.ns) specs.push({ sat, sys, kind: 'q10', n, kr: null, S: P.stepsPerOrbit, div: d, N: Pw.runN, wins: Pw.windows.slice() });
      for (const c of combosBy[sat]) specs.push({ sat, sys, kind: 'q11', n: c.n, kr: c.kr, S: P.stepsPerOrbit, div: d, N: Pw.runN, wins: Pw.windows.slice() });
    }
    if (gate && combosBy[sat].some((c) => c.kr === 'k1rule' && c.n === 2)) for (const d of P.gateDivs) specs.push({ sat, sys, kind: 'q11', n: 2, kr: 'k1y', S: P.stepsPerOrbit, div: d, N: Pw.runN, wins: Pw.windows.slice() });
  }
  return specs;
}
const priOf = (sp) => (sp.kind === 'q11' ? 100 : 1) * sp.div * (sp.sys === 'three' ? 2 : 1);
async function runAll(o, specs) {
  const rows = {};
  await Promise.all(specs.map((sp) => o.run(sp, priOf(sp)).then((r) => { rows[r.key] = r; o.log(r); return r; })));
  return rows;
}
export async function runSatN(HP, o) {
  const P = o.plan, sats = o.sats, sats3 = o.sats3, t = {}; let t0 = Date.now();
  const tick = (k) => { t[k] = { wallSec: (Date.now() - t0) / 1000 }; t0 = Date.now(); };
  const J = { stage: 'satn', quick: !!o.quick, stage3: !!o.stage3, sats: sats.slice(), sats3: sats3.slice(), plan: clone(P), decl: clone(DECL), harmRule: clone(HARM_RULE),
    kernels: clone(B.KERNEL_ROWS), gLoc: { 2: B.glocOf(2), 1: B.glocOf(1), 0: B.glocOf(0) } };
  J.book = { units: clone(L.UNITS), softening: L.SOFTENING, radiusFloor: L.RADIUS_FLOOR, integrator: L.INTEGRATOR, offDrag: clone(L.OFF_DRAG), k1RuleDrag: clone(L.K1_RULE_DRAG),
    drags: Object.fromEntries(B.KERNEL_ROWS.map((kr) => [kr.key, B.dragOf(kr)])), declFile: L.DECL_FILE, parents: clone(L.PARENTS), seedBooks: ['jupiterGalilean', 'saturnRingReal'],
    libFrom: 'tests/lib-w315d-satk1.mjs(bookOf・seedOf・attachSatSampler・windowOf)+ tests/lib-w317b-satn.mjs(variantBook —— G_loc・relativeDrag・dragCore だけ差し替え)',
    notIncluded: ['母惑星の J₂ と潮汐(在位の本が持たない —— 第315便d と同じ)', '他の衛星と他の惑星(衛星ごとに 1 本 —— 第315便d と同じ)', '在位の惑星 7 本と同じ並進だけ・外殻なしの宣言(枝 c の変種)'] };
  J.P = probeN(HP, sats, P.stepsPerOrbit); tick('P');
  J.T = { systems: targetsN(HP, sats) }; tick('T');
  const all = combosOf(P.kernels);
  // ① 二体の格子
  { const combos = Object.fromEntries(sats.map((k) => [k, all])), specs = specsOf(sats, 'two', P, P.two, combos, true);
    const rows = await runAll(o, specs);
    J.E2 = { sats: sats.slice(), ns: P.ns.slice(), kernels: P.kernels.slice(), combos, runN: P.two.runN, windows: P.two.windows.slice(), divs: P.divs.slice(), stepsPerOrbit: P.stepsPerOrbit, planned: specs.length, rows };
    J.J2 = judgeOf(J.E2, 'two'); tick('E2'); }
  // ② 三体(二体で決まった組だけ)
  if (sats3.length) {
    const base3 = sats3.filter((k) => SATS3_STAGE2.includes(k)), extra3 = sats3.filter((k) => !SATS3_STAGE2.includes(k));
    const combos = Object.fromEntries(base3.map((k) => [k, flowOf(J.J2, k, all)]));
    let specs = specsOf(base3, 'three', P, P.three, combos, true), rows = await runAll(o, specs);
    J.E3 = { sats: base3.slice(), ns: P.ns.slice(), kernels: P.kernels.slice(), combos, runN: P.three.runN, windows: P.three.windows.slice(), divs: P.divs.slice(), stepsPerOrbit: P.stepsPerOrbit, planned: specs.length, rows };
    J.J3 = judgeOf(J.E3, 'three');
    if (extra3.length) {   // ③(探索 —— 正本に入れない): 二体と三体のイオで決まった組だけ
      const c3 = Object.fromEntries(extra3.map((k) => [k, flowOf(J.J2, k, all, J.J3)])), sp3 = specsOf(extra3, 'three', P, P.three, c3, false), r3 = await runAll(o, sp3);
      Object.assign(J.E3.rows, r3); Object.assign(J.E3.combos, c3); J.E3.sats = J.E3.sats.concat(extra3); J.E3.planned += sp3.length; J.J3 = judgeOf(J.E3, 'three');
    }
    tick('E3');
  }
  J.prefix = prefixOf(J, o.sath || null);
  J.X = synthOf(J); tick('X');
  J.cost = costOf([J.E2, J.E3].filter(Boolean));
  J.gates = gatesOf(J); J.ok = Object.values(J.gates).every(Boolean); J.timing = t;
  const runs = [J.E2, J.E3].filter(Boolean).flatMap((E) => Object.values(E.rows)).filter((r) => r.status === 'run');
  J.stats = { runs: runs.length, steps: runs.reduce((s, r) => s + r.steps, 0) };
  return J;
}

/* ───────── 実行 ───────── */
const argOf = (k) => { const i = process.argv.indexOf(k); return i >= 0 ? process.argv[i + 1] : null; };
export async function main() {
  const TARGET = process.env.W317B_TARGET || 'beta/index.html';
  if (process.argv.includes('--child')) {
    const spec = JSON.parse(argOf('--child'));
    const { HP } = loadHtmlMain(path.isAbsolute(TARGET) ? TARGET : path.join(ROOT, TARGET));
    process.stdout.write('\n' + JSON.stringify(runSpecN(HP, spec)) + '\n');
    return;
  }
  const quick = process.env.W317B_QUICK === '1', stage3 = process.env.W317B_STAGE3 === '1';
  const OUT = process.env.W317B_OUT ? (path.isAbsolute(process.env.W317B_OUT) ? process.env.W317B_OUT : path.join(ROOT, process.env.W317B_OUT)) : path.join(ROOT, OUT_SATN);
  if ((quick || stage3) && !process.env.W317B_OUT) throw new Error('試走(W317B_QUICK=1)と段 ③(W317B_STAGE3=1)は W317B_OUT を指定する(正本を書かない)');
  const sats = process.env.W317B_SATS ? process.env.W317B_SATS.split(',') : SATS.slice();
  let sats3 = process.env.W317B_SATS3 !== undefined ? process.env.W317B_SATS3.split(',').filter(Boolean) : SATS3.slice();
  if (stage3) sats3 = SATS3.concat(SATS.filter((k) => !SATS3_STAGE2.includes(k)));
  if (sats.some((k) => !L.satOf(k)) || sats3.some((k) => !sats.includes(k))) throw new Error('W317B_SATS は ' + SATS.join(',') + ' から・W317B_SATS3 は W317B_SATS の内');
  if (!process.env.W317B_OUT && (sats.length !== SATS.length || JSON.stringify(sats3) !== JSON.stringify(SATS3))) throw new Error('正本は 6 衛星の二体とイオの三体(トリトンの三体と段 ③ は W317B_OUT へ)');
  const html = path.isAbsolute(TARGET) ? TARGET : path.join(ROOT, TARGET);
  const t0 = Date.now(), targetSha256 = crypto.createHash('sha256').update(fs.readFileSync(html)).digest('hex');
  const W281A_SCOPE = w281aScopeStamp(html, REGEN_SCOPE);
  const { HP } = loadHtmlMain(html);
  let sath = null; try { sath = JSON.parse(fs.readFileSync(path.join(ROOT, SATH_OUT), 'utf8')); } catch (e) { sath = null; }
  const NW = Math.max(1, Number(process.env.W317B_WORKERS) || 2), cstat = { resumed: 0 };
  const run = cachedRun(makePool(NW, fileURLToPath(import.meta.url)), process.env.W317B_CACHE ? path.resolve(process.env.W317B_CACHE) : null, targetSha256, cstat);
  const log = (r) => { const w = r.windows ? r.windows[r.spec.N] : null;
    console.log(`  ${new Date().toISOString().slice(11, 19)} ${r.key}: ${r.status}${r.status === 'run' ? '・M0 ' + (w && Number.isFinite(w.m0.aps) ? w.m0.aps.toExponential(9) : '—') + '・通過 ' + (w && w.pass.complete ? w.pass.aps.toExponential(9) : '—')
      + '・' + r.steps + ' 步・' + r.wallSec.toFixed(1) + ' s' : '・' + (r.err || '').slice(0, 160)}`); };
  const plan = quick ? QUICK : PLAN;
  console.log('第317便b satn: ' + (quick ? '試走' : (stage3 ? '段 ③(探索)' : '正本')) + '・workers ' + NW + '・二体 ' + sats.join(',') + '・三体 ' + sats3.join(','));
  const R = await runSatN(HP, { quick, stage3, plan, sats, sats3, run, log, sath });
  const out = { version: HARNESS_VERSION, libVersion: B.LIB_VERSION, satk1LibVersion: L.LIB_VERSION, apsisVersion: AP.APSIS_VERSION, sathVersion: X316.HARNESS_VERSION, generator: 'tests/exp-w317b-satn.mjs',
    target: TARGET, targetSha256, reuseFrom: null,
    ruling: '原仮定者の決断事項 AN431(衛星の三体の永年の効きが 6 衛星とも帯の内で決まらないことについて、何が必要かを探索する —— G_loc の n = 2・1・0 と核 K1・K2)・統括の検証項目 R251。'
      + '確認の材料(在位へ入れない —— 近似要素の種は観測レコードではない・候補 Y_k(n) を普遍則として採らない)',
    invSqVersion: HP.REL_DRAG_INVSQ_VERSION || null, ...R };
  if (cstat.resumed > 0) out.resumed = cstat.resumed;
  out.elapsedS = (Date.now() - t0) / 1000;
  const CODE = ['tests/exp-w317b-satn.mjs', 'tests/lib-w317b-satn.mjs', 'tests/exp-w316d-sath.mjs', 'tests/exp-w315d-satk1.mjs', 'tests/lib-w315d-satk1.mjs', 'tests/lib-w304e-apsis.mjs', 'tests/lib-w280b-emgrid.mjs', 'tests/lib-w272e-provenance.mjs', 'tests/lib-w281a-scope.mjs'];
  out.meta = Object.assign(provenanceMeta({ root: ROOT, wave: '第317便b', target: TARGET, code: CODE, inputs: [TARGET, L.DECL_FILE, SATH_OUT] }), {
    harnessVersion: HARNESS_VERSION, stage: 'satn',
    engine: 'Node(tests/lib-w280b-emgrid.mjs の loadHtmlMain —— html の本文をそのまま実行・走行は子プロセス W317B_WORKERS)',
    notClaim: NOT_CLAIM });
  Object.assign(out.meta, W281A_SCOPE, w281aStableInputs(ROOT, out.meta.inputs));
  fs.mkdirSync(path.dirname(OUT), { recursive: true });
  fs.writeFileSync(OUT, X316.packJson(out) + '\n');
  const vs = (Jx) => (Jx ? Object.fromEntries(Object.entries(Jx.systems).map(([k, v]) => [k, Object.values(v).filter((z) => z.m0.determined).length + '/' + Object.keys(v).length])) : null);
  console.log('→', path.relative(ROOT, OUT), 'ok=' + out.ok, JSON.stringify(out.gates), out.elapsedS + ' s', '二体の決まった組 ' + JSON.stringify(vs(out.J2)), '三体 ' + JSON.stringify(vs(out.J3)));
}
if (IS_MAIN) await main();
