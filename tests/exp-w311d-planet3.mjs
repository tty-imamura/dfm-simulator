// 第311便d(原仮定者の裁定(第110報)AN387「水星の近点移動は G_loc を先に考慮・その後 R_d と m_d がそれぞれノブ・外殻 (m_obs − m_d) の引きずりは残す・
// cap6500km はなるべく尊重」・(第111報)AN391「G_loc の宣言を固定して寄与を差し引く。太陽–水星だけでなく太陽–金星・太陽–火星も利用して各天体の dragCore を探索する」・
// 決断事項 AN392〔ノブの順〕・AN386〔値域と探索の型〕・AN396〔数値の門〕・AN336〔標的 1PN + A1〕・統括の検証項目 R229):
// **3 惑星(水星・金星・火星)の dragCore の探索の器**(探索の材料 —— 探索の値を在位へ入れない・在位の宣言は変えない・フィットではない)。
//
// Node だけ(対象 html の inline script を tests/lib-w280b-emgrid.mjs の loadHtmlMain で読み、本の入口 validatePreset・coord3d.makeSim・build・step と
// 読み口 inertialDragIsqState をそのまま呼ぶ)。エンジンの走行は子プロセス(W311D_WORKERS —— 既定 2・`--planet` で惑星ごとの process にも分けられる)。
// 純関数は tests/lib-w311d-planet3.mjs(標的・4 つの走行の組み立て・残差と交差・門・根の区間と細分・一次の見積り)・一次の見積りの参照の受け手は
// tests/lib-w310d-shell.mjs(エンジンと独立の比の平均 —— 球の K2・M2 は第309便a の参照の lib)。
//
// ■ 写し(器の中で組む —— 在位の本の宣言は変えない)
//   🌡️ mercurySunInertial3d・🌋 venusSunInertial3d・🔴 marsSunInertial3d の第306便a の世代(凍結の写し tests/data-w306a-decl305.json の physics・bodies・scaleExp・timeRef
//   + 在位の gLoc:{law:"kappaC2"})。引きずりは新則 {law:"inertial", invSq:{outerShell:"uniform"}, pairs:"all", history:"positions", dragCoreDefault:"cap6500km",
//   initMotion:"observed", spinDrag:{rot:"surfaceFlip", axial:"on", axialModel:"bevel", initSpin:"observed"}} に置き換える(旧則の Wbg・eps・inertialR2 は外す)。
//   太陽は cap6500km(R_d = 6.5×10⁶ m・m_d = M☉)に固定。惑星は R < 6.5×10⁶ m なので既定で R_d = R・m_d = M(θ₀ —— 惑星に dragCore を宣言しない)。
//   候補 θ は惑星の bodies[1].dragCore = {massFrac: m_d/M, radius: R_d(本の単位)}(m_d < M は外殻 M − m_d を残す —— outerShell uniform)・太陽の m_d < M☉ は
//   bodies[0].dragCore = {massFrac, radius: 6.5×10⁶ m}。G_loc の k・n・λ・GM・初期要素は在位のまま(掃引しない)。
//
// ■ 4 つの走行(同じ窓 8 公転・同じ抽出器・同じ初期要素・同じ刻み): q00(G_loc なし・引きずりなし)・q10(在位の G_loc・引きずりなし)・q01(θ)(G_loc なし・θ の引きずり)・
//   q11(θ)(両方)。ΔqG = q10 − q00・t_D = q⋆ − ΔqG・残差 r(θ) = q11(θ) − q00 − q⋆(= D_G − t_D)・交差 I = q11 − q10 − q01 + q00(代表の点だけ)。
//   **水星の G_loc の分を金星・火星へ流用しない**(各惑星で測る)。主の抽出器は新しい抽出器(第304便e —— 金星は離心率 0.0068 で検出器 B の帯が大きい)・検出器 B は副。
//
// ■ 段(正本 tests/out/planet3-w311d.json —— 段 planet3-311d)。W311D_PARTS=T,S,E,R,G で選ぶ(正本は全段)・W311D_OUT で出力先・W311D_QUICK=1 で縮める
//   T 標的と G_loc の分: 3 本の q⋆(AN336 の生成器)・q00・q10(h と h/2)・ΔqG(実測と解析の一次 gLocPeriAdvance の式)・t_D
//   S 一次の見積り(t = 0 の写し —— エンジンの読み口と参照の受け手): β(惑星 ← 太陽)の R_d の表と比 g = β(rd)/β(1)(β ∝ R_d² からのずれ)・近点への寄与の見積り
//     (第310便d の一次の式)・rd_est = √(t_D/D_G(θ₀))(t_D は解析の ΔqG)・初期の格子・惑星の m_d < M の床の見積り・太陽の m_d の根への効き
//   E エンジンの走行: 各惑星の q11(θ₀)(h と h/2)・水星の R_d の格子の点(既定 R_d/R = 10⁻²・5×10⁻³・3×10⁻³)・水星の代表の点の q01(交差)
//   R 根: 符号の変わる区間・割線(x = (R_d/R)²)・θ₀ に錨を置いた見積り・感度 ∂r/∂ln R_d・R_d/R が 3 惑星でそろうかの表(実測と見積りを分けて)
//   G 数値の門(AN396 の推奨 —— abs(r) ≤ max(3 × 帯, 0.01″/世紀)・3 対を同時に)・探索の値の条件(根が 1 つ ∧ 門)・同定の限界
//
// ■ 2 段目(統合の後に統括 —— 出力は tests/out/planet3-w311d-stage2.json〔W311D_OUT で変える・鎖の正本ではない〕。正本の行は html が同じなら使い回す)
//   node tests/exp-w311d-planet3.mjs --planet venus --rd 1e-1,3e-2,1e-2,5e-3,3e-3,1e-3 [--divs 1,2] [--refine 4] [--h4]
//   node tests/exp-w311d-planet3.mjs --planet mercury --at 5.01e-3 --md 0.99999,0.9999 --sunmd 0.1,1e-3 [--cross 5.01e-3]
//   --coreSpin '{"body":0,"spin":<本の角速度>,"spinAxis":{"tiltDeg":<0〜180>,"azimuthDeg":<−360〜360>}}'(dragCore の自転と軸 —— 第311便a のエンジンの鍵
//   dragCore.spin・spinAxis。body 以外の鍵は CORE_SPIN_KEYS だけ。受理しなければ拒否と記録して走らせない —— 拒否の行があれば門 noRejected は偽)
//
// ■ v2(第312便d —— 決断事項 AN396・原仮定者の裁定(第114報)・統括の検証項目 R233)
//   ・最終の採用の欄(段 G の adopt —— 今の粗い門は残す): rootBracketed・numericResolved(**候補の点そのもの**で abs(r_h − r_h/2)・abs(r_h/2 − r_h/4) ≤ ε_num)・
//     targetReached(候補の点の h/4 の残差 ≤ ε_fit)・declAdmissible。ε は器の宣言の定数 ADOPT_EPS(推奨 ε_fit = 1e-3″/世紀・ε_num = 3e-4″/世紀 —— 裁定で変わる)。
//     `--h4` は `--rd` の点に加えて**候補の点そのもの**(細分の最後の点 —— 無ければ abs(r) の最小の点)を h/4 で測る。
//   ・`--kernel k1`(枝 a の invSq.kernel —— 写しの invSq に kernel:"k1" を入れる。受理しない html では「未接続」と記録して走らせない —— 門 noRejected は偽)。
//     行の鍵に kernel を入れ、段 R・G は走行の kernel の行だけで作る(q00・q10 は引きずりが無いので共通)。
//   ・R_d の口: `--rd`(R_d/R の列 —— 1e-9 の程度も受ける)・`--rdabs`(絶対の R_d [m] の列)・`--rdm`(R_d/m [m/kg] の列 —— K1 の見込み R_d ∝ G m/c² の比較)。
//   ・門 gLocMeasured は計画にある惑星だけで判定(惑星ごとの 2 段目の出力でも真)・`--refine` は使い回した正本の同じ惑星の行も区間に入れる。
//   ・段 S は一次の見積りの係数 C₂(β ≈ C₂(M☉/m)(R_d/r)²)をエンジンの β から測って c2 に書く。
//
// ■ v3(第313便d —— 原仮定者の裁定(第115報)AN399・AN402・決断事項 AN396′・統括の検証項目 R237)
//   ・`--rule kappa0`(`--kernel k1` だけ): 太陽を含む全天体に写しの明示の dragCore(太陽 {massFrac: 1, radius: κ₀M☉/L}・惑星は候補の R_d —— κ₀ = 10G/(C₁c²) を
//     本の G・c と C₁ の閉じた式で固定)。`--kf`(κ/κ₀ の倍率の列 —— 惑星の R_d = kf·κ₀m)。行の鍵に rule を入れ、段 R・G は走行の rule の行だけで作る。
//   ・細分は粗い門で止めない —— 細かい刻みの abs(r) ≤ ε_fit(ADOPT_EPS.fit)まで(決断事項 AN396′)。K1 の細分は x = R_d/R の割線(β ∝ R_d)。
//   ・採用の欄の cap を外す(0 < R_d ≤ 観測半径だけ —— lib の adoptOf)・candidateOf の半径は段 S が無ければ凍結の写しの半径(段 S に依らない —— 第312便の未決 4)。
//   ・既定の計画(鎖の正本)は v2 と同じ(K2 の 26 走行 —— 段 T・S・E・R・G の値は v2 とビット同一の見込み)。版の世代: 正本の版が PREV_VERSIONS なら v2 の世代(鎖で作り直す前)。
//
// ■ 言わないこと: 「フィットした」「較正した」「収束した」「完全に一致」「R_d を決めた」「全ノブが決まった」。届かないものは届かないと数で書く。
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { loadHtmlMain } from './lib-w280b-emgrid.mjs';
import { provenanceMeta } from './lib-w272e-provenance.mjs';
import { scopeStamp as w281aScopeStamp, stableInputs as w281aStableInputs } from './lib-w281a-scope.mjs';
import * as AP from './lib-w304e-apsis.mjs';
import * as PL from './exp-w299c-planets3d.mjs';
import * as P3 from './lib-w299c-planets3d.mjs';
import * as AN from './lib-w306a-an336.mjs';
import * as D from './lib-w310d-shell.mjs';
import * as Q from './lib-w311d-planet3.mjs';
import { pinDecl315c, LEGACY7_DATA_FILE } from './lib-w315c-legacy7.mjs';   // 第315便c(決断事項 AN406・R244): 在位の 7 本を K1 へ移した世代では、この器は移行の前(af2f426)の宣言の写しで測る
// 第281便a の領域 hash の宣言(器と lib から deriveScope で引いた下限 —— tests/lib-w299c-planets3d.mjs が allPresets() を値で読むので presets は "all")
const REGEN_SCOPE = {"presets":"all","roots":["$","DT","FIT_COND_KEYS","FIT_COND_VERSION","FIT_KNOB_KEYS","FIT_NUMERICS_KEYS","FIT_RECORD_KEYS","FIT_RECORD_VERSION","FIT_RECORD_VERSIONS","FIT_RESIDUAL_KEYS","FIT_TARGET_KEYS","FIT_TOL_KEYS","HP.FIT_COND_VERSION","HP.REL_DRAG_INVSQ_VERSION","HP.allPresets","HP.coord3d","HP.dfmMeshVelocityFieldAt","HP.fitCondSig","HP.inertialDragIsqState","HP.inertialDragState","HP.sim","HP.validateFitRecord","HP.validatePreset","T","ab","ch","ctx","cw","fmt","pnSource","validateFitRecord"],"core":true,"consts":[],"complete":true};

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
export const HARNESS_VERSION = 'w313d-planet3-3';   // 第313便d: v3(全天体の規則 --rule kappa0・細分を ε_fit まで・採用の欄の cap を外す・candidateOf を段 S に依らずに)
/** v3: 正本の版の前の世代(鎖で作り直す前の正本 —— QA docs.planet3_311 の世代切替が読む。値の段は v2 とビット同一の見込み) */
export const PREV_VERSIONS = Object.freeze(['w312d-planet3-2']);
export const PREV_LIB_VERSIONS = Object.freeze(['w312d-planet3-lib-2']);
/** 決断事項 AN396 の最終の採用の ε(器の宣言の定数 —— 推奨の値・原仮定者の裁定で変わる) */
export const ADOPT_EPS = Object.freeze({ fit: 1e-3, num: 3e-4, unit: '″/世紀', note: '決断事項 AN396 の推奨(ε_fit = 1e-3″/世紀・ε_num = 3e-4″/世紀 —— 裁定で変わる・観測の 3σ ではない)' });
const IS_MAIN = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
const clone = (x) => JSON.parse(JSON.stringify(x));
const { dot, cross, norm, sub, scale, unit } = D;
const rel = (a, b) => Math.abs(a - b) / Math.max(Math.abs(b), 1e-300);
const r10 = (v) => (typeof v === 'number' && Number.isFinite(v)) ? Number(v.toPrecision(10)) : v;
const NOT_CLAIM = ['フィットした', '較正した', '収束した', '完全に一致', 'R_d を決めた', '全ノブが決まった'];
export const DECL_FILE = 'tests/data-w306a-decl305.json';
export const AN336_OUT = 'tests/out/an336-w306a.json';
export const OUT_MAIN = 'tests/out/planet3-w311d.json';
export const OUT_STAGE2 = 'tests/out/planet3-w311d-stage2.json';
export const PIN = JSON.parse(fs.readFileSync(new URL('./data-w306a-decl305.json', import.meta.url), 'utf8'));
export const N_ORB = 8;                       // 窓(第306便a・第310便d と同じ 8 公転)
export const N_ORB_QUICK = 3;
export const APSIS_K = 3;                     // 新しい抽出器の調和の数(第304便e の既定)
export const MAIN_EX = 'apsNew', SUB_EX = 'detB';
export const PARTS_ALL = Object.freeze(['T', 'S', 'E', 'R', 'G']);
/** 枝のうちの走行(正本 —— 鎖で作り直す軽い部分)。2 段目は CLI */
export const BRANCH_PLAN = Object.freeze({ divs: Object.freeze([1, 2]), grid: Object.freeze({ mercury: Object.freeze([1e-2, 5e-3, 3e-3]) }), cross: Object.freeze({ mercury: Object.freeze([5e-3]) }) });
export const QUICK_PLAN = Object.freeze({ divs: Object.freeze([1]), grid: Object.freeze({ mercury: Object.freeze([5e-3]) }), cross: Object.freeze({}) });
/** dragCore の自転と軸の鍵(第311便a のエンジンの鍵 —— spin〔rad/本の時間〕・spinAxis:{tiltDeg, azimuthDeg?})。値は {body, spin?, spinAxis?} の body 以外を dragCore へ */
export const CORE_SPIN_KEYS = Object.freeze(['spin', 'spinAxis']);
export function checkCoreSpin(cs) {
  if (!cs || typeof cs !== 'object' || Array.isArray(cs)) return '--coreSpin は {body, spin?, spinAxis?:{tiltDeg, azimuthDeg?}}';
  for (const k of Object.keys(cs)) if (k !== 'body' && !CORE_SPIN_KEYS.includes(k)) return '--coreSpin に未知の鍵 ' + k + '(' + CORE_SPIN_KEYS.join('・') + ' だけ —— エンジンの鍵)';
  if (cs.body !== undefined && cs.body !== 0 && cs.body !== 1) return '--coreSpin の body は 0(太陽)か 1(惑星)';
  return null;
}

/* ───────── 走行(子プロセスの中)───────── */
const hOf = (base) => P3.stepsOf(base.timeRef.pRef).h;   // 器の刻み h(水星 0.016・金星 0.04087・火星 0.1249 —— 第306便a と同じ)
export function measure(HP, q, dt, revMax) {
  const mu = q.physics.G * (q.bodies[0].m + q.bodies[1].m), Tsec = Math.pow(10, q.scaleExp.T), t0 = Date.now();
  let smp = null, S = null;
  const R = AP.captureSim(HP, (s) => { S = s; smp = AP.attachSampler(s, { ci: 0, oi: 1, mu }); }, () => PL.runPl3(HP, q, { dt, revMax }));
  const w = PL.windowOf(R, revMax, Tsec), rev = R.ev.rev, f = rev.length >= revMax ? AP.apsisRate(smp.samples(), { t0: 0, t1: rev[revMax - 1], K: APSIS_K }) : null;
  const st = S ? HP.inertialDragIsqState(S) : null;
  return { detB: w.apsArcsecPerCentury, apsNew: f ? AP.toArcsecPerCentury(f.rate, Tsec) : null, periodDays: w.periodDays, ecc: w.ecc, nPeri: w.nPeri, complete: w.complete,
    steps: R.steps, nan: R.nan, betaMax: st ? st.betaMax : null, isqSteps: st ? st.steps : null, overlap: st ? st.overlapSteps : null, wallSec: (Date.now() - t0) / 1000 };
}
export const specKey = (s) => s.planet + '|' + s.kind + '|' + (Q.KINDS[s.kind].drag ? Q.thetaKey(s.theta) : '-') + '|div=' + s.div + '|N=' + s.N;
/** 1 本の走行(spec = {planet, kind, theta, div, N})—— 受理しなければ {status:'rejected'} */
export function runSpec(HP, spec) {
  const pl = Q.planetOf(spec.planet), base = Q.pinnedBook(HP, PIN, pl.id), q = Q.bookOf(base, spec.kind, spec.theta || Q.THETA0), h = hOf(base);
  const v = HP.validatePreset(clone(q)), wantK1 = Q.KINDS[spec.kind].drag && Q.kernelOf(spec.theta) === 'k1';
  if (!v.ok) { const err = JSON.stringify(v.errors).slice(0, 300);
    return { key: specKey(spec), spec, status: 'rejected', err, unconnected: wantK1 && /kernel/.test(err) ? '未接続(invSq.kernel を受理しない html)' : null }; }
  // v2: K1 を求めたのに受理した写しに kernel:"k1" が残らない html は「未接続」(黙って K2 で走らせない)
  if (wantK1 && !(v.preset && v.preset.physics && v.preset.physics.relativeDrag && v.preset.physics.relativeDrag.invSq && v.preset.physics.relativeDrag.invSq.kernel === 'k1'))
    return { key: specKey(spec), spec, status: 'rejected', err: '受理した写しに invSq.kernel:"k1" が無い', unconnected: '未接続(invSq.kernel を正準形に残さない html)' };
  const r = measure(HP, q, h / spec.div, spec.N);
  return Object.assign({ key: specKey(spec), spec, status: 'run', h, dt: h / spec.div, warnings: (v.warnings || []).length }, r);
}
function makePool(NW, self) {
  let active = 0; const q = [];
  const pump = () => { while (active < NW && q.length) { const { sp, res, rej } = q.shift(); active++;
    const ch = spawn(process.execPath, ['--max-old-space-size=6144', self, '--child', JSON.stringify(sp)], { cwd: ROOT, env: process.env });
    let out = '', err = '';
    ch.stdout.on('data', (d) => { out += d; }); ch.stderr.on('data', (d) => { err += d; });
    ch.on('close', (code) => { active--; pump(); if (code !== 0) return rej(new Error(specKey(sp) + ': ' + err.slice(0, 600)));
      try { res(JSON.parse(out.slice(out.lastIndexOf('\n{') + 1))); } catch (e) { rej(new Error(specKey(sp) + ': 出力が JSON でない ' + out.slice(-200))); } }); } };
  return (sp) => new Promise((res, rej) => { q.push({ sp, res, rej }); pump(); });
}

/* ───────── 段 T(標的と G_loc の分)───────── */
export function targetTable(HP) {
  const books = Q.PLANETS.map((p) => Q.pinnedBook(HP, PIN, p.id)), T = Q.targetsOf(ROOT, books);
  let live = null;
  try { const A = JSON.parse(fs.readFileSync(path.join(ROOT, AN336_OUT), 'utf8')); live = A.transfer.table; } catch (e) { live = null; }
  return T.map((t, i) => {
    const L = live ? live.find((z) => z.id === t.id) : null;
    return Object.assign({}, t, { gLocAnalytic: Q.gLocAnalytic(books[i], 2), h: hOf(books[i]), an336: L ? { value: L.target.value, pn1: L.target.pn1, a1: L.target.a1, recordId: L.target.recordId, h: L.h } : null });
  });
}

/* ───────── 段 S(一次の見積り —— t = 0 の写し)───────── */
function unitsOf(q) { return { Lm: Math.pow(10, q.scaleExp.L), Tm: Math.pow(10, q.scaleExp.T), Mm: Math.pow(10, q.scaleExp.M) }; }
function simOf(HP, q) {
  const v = HP.validatePreset(clone(q));
  if (!v.ok) return { err: JSON.stringify(v.errors).slice(0, 300) };
  const S = HP.coord3d.makeSim(); S.build(clone(v.preset));
  return { S, preset: v.preset };
}
/** 初期の慣性の接触要素(分解の後の v —— 慣性速度)と軌道の法線(第310便d と同じ) */
function orbitOf(S, U, G) {
  const r = [(S.x[1] - S.x[0]) * U.Lm, (S.y[1] - S.y[0]) * U.Lm, (S.z[1] - S.z[0]) * U.Lm], v = [(S.vx[1] - S.vx[0]) * U.Lm / U.Tm, (S.vy[1] - S.vy[0]) * U.Lm / U.Tm, (S.vz[1] - S.vz[0]) * U.Lm / U.Tm];
  const mu = G * (S.m[0] + S.m[1]) * U.Mm, rn = norm(r), v2 = dot(v, v), a = 1 / (2 / rn - v2 / mu), Lv = cross(r, v), h0 = norm(Lv), p = h0 * h0 / mu, e = Math.sqrt(Math.max(0, 1 - p / a));
  return { mu, r0: rn, a, e, p, h0, P: 2 * Math.PI * Math.sqrt(a ** 3 / mu), nOrb: unit(Lv) };
}
/** 参照の天体(エンジンの配列 —— 引きずりの半径と質量は読み口 receivers の R_d・m_d〔エンジンが使う値〕・外殻は天体の質量 − m_d) */
function refBodies(S, U, st) {
  const b = (i) => ({ x: [S.x[i] * U.Lm, S.y[i] * U.Lm, S.z[i] * U.Lm], m: S.m[i] * U.Mm, Om: S.spin[i] / U.Tm, a: [S.sax[i], S.say[i], S.saz[i]] });
  const RR = [S.radOv[0] * U.Lm, S.radOv[1] * U.Lm], dcR = [0, 1].map((i) => (S.dragCoreD && S.dragCoreD[i] && S.dragCoreD[i].R > 0) ? S.dragCoreD[i].R * U.Lm : RR[i]);
  return [0, 1].map((i) => {
    const B = b(i), rc = st.receivers.find((z) => z.i === i), Rd = rc.Rd * U.Lm, md = rc.md * U.Mm, ms = B.m - md;
    B.parts = [{ kind: 'ball', m: md, R: Rd, role: 'core' }];
    if (ms > 0 && dcR[i] > Rd) B.parts.push({ kind: 'thick', m: ms, Ri: Rd, Ro: dcR[i], role: 'shell' });
    return B;
  });
}
/** 1 つの θ の t = 0 の写し: エンジンの β・参照の β・近点への寄与の見積り(第310便d の一次の式 —— 惑星を受け手) */
export function estimateAt(HP, base, th) {
  const o = simOf(HP, Q.bookOf(base, 'q11', th));
  if (o.err) return { theta: Q.thetaOf(th), err: o.err };
  const S = o.S, U = unitsOf(base), G = base.physics.G * U.Lm ** 3 / (U.Mm * U.Tm * U.Tm), O = orbitOf(S, U, G), st = HP.inertialDragIsqState(S);
  const e1 = st.receivers.find((z) => z.i === 1), e0 = st.receivers.find((z) => z.i === 0);
  const B = refBodies(S, U, st), rM = D.refReceiver(B, 1, { order: 8 }), rS = D.refReceiver(B, 0, { order: 8 });
  const cent = 36525 * 86400, perCent = cent / O.P, AS = 180 / Math.PI * 3600, sun = B[0];
  const OmPar = sun.Om * dot(sun.a, O.nOrb), c = OmPar * norm(rM.rot[0]) * O.r0 ** 3;
  const mDrag = sun.parts.reduce((s, p) => s + p.m, 0), rho2Drag = sun.parts.reduce((s, p) => s + p.m * D.rho2Of(p), 0) / mDrag;
  const beta = rM.beta[0], b0 = beta * O.r0 ** 2 / (1 + rho2Drag / (3 * O.r0 ** 2));
  const dMain = D.dPiTrans(b0, 2, O.p, O.e), dRho2 = D.dPiTrans(b0 * rho2Drag / 3, 4, O.p, O.e), dRot = D.dPiRot(c, O.p, O.h0), dSun = D.dPiTrans(rS.beta[1] * O.r0 ** 2, 2, O.p, O.e);
  const pc = { main: dMain * perCent * AS, rho2: dRho2 * perCent * AS, rot: dRot * perCent * AS, sun: dSun * perCent * AS };
  pc.total = pc.main + pc.rho2 + pc.rot + pc.sun;
  return { theta: Q.thetaOf(th), RdPlanet: e1.Rd * U.Lm, mdPlanet: e1.md * U.Mm, RdSun: e0.Rd * U.Lm, betaE: e1.beta[0], betaR: rM.beta[0], betaSunE: e0.beta[1], betaSunR: rS.beta[1],
    c2: e1.beta[0] * B[1].m * O.r0 * O.r0 / (B[0].m * (e1.Rd * U.Lm) ** 2),   // v2: β/((M☉/m)(R_d/r)²) —— 一次の見積りの係数 C₂ の実測(受け手 = 惑星・源 = 太陽の全質量)
    dBeta: rel(rM.beta[0], e1.beta[0]), dBetaSun: rel(rS.beta[1], e0.beta[1]), shellPlanet: B[1].parts.length > 1, shellSun: B[0].parts.length > 1,
    orbit: { a: O.a, e: O.e, p: O.p, r0: O.r0, P: O.P }, perCentury: pc };
}
export function partS(HP, o = {}) {
  const quick = !!o.quick, T = o.T || targetTable(HP), out = { planets: {}, formula: {
    beta: 'β(惑星 ← 太陽) ≈ C₂(M☉/m)(R_d/r)²・C₂ ≈ 0.45838〔惑星の一様球の自己の場の比の体積平均 —— 自己の場が分母の大半。中心の自己の場 3m/R_d² だけなら 1/3〕→ D_G ∝ R_d²(c2 はエンジンの β から測った値)',
    rdEst: 'rd_est = √(t_D/D_G,est(θ₀))(t_D = q⋆ − ΔqG の解析の一次)・表の補間は x = (R_d/R)² の直線',
    perCentury: '第310便d の一次の式(並進の主項 2π b₀/p²・⟨ρ²⟩ の項・回転 −3π c/(p² h₀)・太陽を受け手 —— 1 周期の値 × 1 世紀/P_K)' } };
  for (const pl of (o.planets || Q.PLANETS.map((p) => p.key)).map(Q.planetOf)) {
    const base = Q.pinnedBook(HP, PIN, pl.id), tg = T.find((z) => z.id === pl.id), tDa = tg.value - tg.gLocAnalytic;
    const grid = quick ? [1, 1e-2, 1e-3] : Q.RD_GRID, rows = grid.map((rd) => estimateAt(HP, base, { rd }));
    const r1 = rows[0];
    for (const r of rows) { r.g = r.betaE / r1.betaE; r.gOverRd2 = r.g / (r.theta.rd * r.theta.rd); r.D = r.perCentury.total; }
    const rdSq = Q.rdEstSquare(r1.D, tDa), rdTab = Q.rdEstTable(rows.map((r) => ({ rd: r.theta.rd, D: r.D })), tDa);
    const rdE = rdTab || rdSq, gridInit = Q.gridAround(rdE);
    // 惑星の m_d < M の床(AN392 ④ —— 根の近く rd_est と その 1/10 で外殻 M − m_d を残す)
    const mdPts = quick ? [1, 1 - 1e-4, 0.5] : Q.MD_POINTS, floor = [];
    if (rdE) for (const md of mdPts) {
      const a = estimateAt(HP, base, { rd: rdE, md }), b = estimateAt(HP, base, { rd: rdE / 10, md });
      floor.push({ md, atEst: a.err ? { err: a.err } : { betaE: a.betaE, betaR: a.betaR, dBeta: a.dBeta, D: a.perCentury.total, shell: a.shellPlanet },
        atTenth: b.err ? { err: b.err } : { betaE: b.betaE, betaR: b.betaR, dBeta: b.dBeta, D: b.perCentury.total, shell: b.shellPlanet },
        rootBelowEst: (!a.err && !b.err) ? (b.perCentury.total < tDa) : null });
    }
    // 太陽の m_d(AN392 ⑤ —— 3 対で共通)が rd_est の D をどれだけ動かすか → 根の ln R_d の移り ≈ −ΔD/(∂D/∂ln R_d)(∂D/∂ln R_d ≈ 2D)
    const sunPts = quick ? [1, 1e-3] : Q.SUN_MD_POINTS, sunRows = [];
    if (rdE) { let D1 = null;
      for (const sm of sunPts) { const a = estimateAt(HP, base, { rd: rdE, sunMd: sm });
        if (a.err) { sunRows.push({ sunMd: sm, err: a.err }); continue; }
        if (sm === 1) D1 = a.perCentury.total;
        sunRows.push({ sunMd: sm, betaE: a.betaE, dBeta: a.dBeta, D: a.perCentury.total, rot: a.perCentury.rot, rho2: a.perCentury.rho2, shellSun: a.shellSun }); }
      for (const s of sunRows) if (Number.isFinite(s.D) && D1 !== null) { s.dD = s.D - D1; s.dLnRd = -s.dD / (2 * D1); }
    }
    const rSmall = rows.filter((r) => !r.err).slice(-1)[0];
    out.planets[pl.key] = { id: pl.id, tDanalytic: tDa, rows, rdEstSquare: rdSq, rdEstTable: rdTab, rdEst: rdE, RdEstKm: rdE ? rdE * r1.RdPlanet / 1e3 : null, Rkm: r1.RdPlanet / 1e3,
      c2: rSmall ? rSmall.c2 : null, c2Rd: rSmall ? rSmall.theta.rd : null,
      gridInit, mdFloor: floor, sunMd: sunRows, maxDBeta: Math.max(...rows.map((r) => r.dBeta)), maxDBetaSun: Math.max(...rows.map((r) => r.dBetaSun)) };
  }
  return out;
}

/* ───────── 段 R(根)と G(数値の門)———— E の行から(純関数 —— QA が作り直す)───────── */
const qOf = (runs, planet, kind, th, div, ex) => { const k = specKey({ planet, kind, theta: th, div, N: runs.N }); const r = runs.rows[k]; return r && r.status === 'run' ? r[ex] : undefined; };
/** 惑星ごとの θ の行(md・sunMd ごとに分けた R_d の列)と残差 */
export function rowsOf(J, planet, ex = MAIN_EX) {
  const E = J.E, T = J.T, tg = T.targets.find((z) => z.key === planet), divs = E.divs, out = [], kern = J.kernel || 'k2';
  const thetas = new Map();
  // v2: 走行の kernel の行だけ(K1 と K2 の行を 1 つの区間に混ぜない)
  // v3: 走行の rule(全天体の規則)の行だけ —— 太陽の R_d が違う行を 1 つの区間に混ぜない
  for (const r of Object.values(E.rows)) if (r.spec.planet === planet && (r.spec.kind === 'q11' || r.spec.kind === 'q01') && Q.kernelOf(r.spec.theta) === kern && Q.ruleOf(r.spec.theta) === (J.rule || null)) thetas.set(Q.thetaKey(r.spec.theta), r.spec.theta);
  for (const th of thetas.values()) {
    const row = { theta: Q.thetaOf(th), key: Q.thetaKey(th), byDiv: {} };
    for (const dv of divs) {
      const q = { q00: qOf(E, planet, 'q00', null, dv, ex), q10: qOf(E, planet, 'q10', null, dv, ex), q01: qOf(E, planet, 'q01', th, dv, ex), q11: qOf(E, planet, 'q11', th, dv, ex) };
      if (!Number.isFinite(q.q00) || !Number.isFinite(q.q10)) continue;
      row.byDiv[dv] = Object.assign({ q }, Q.residualOf(q, tg.value));
    }
    const ds = divs.filter((d) => row.byDiv[d] && Number.isFinite(row.byDiv[d].r));
    row.fine = ds.length ? ds[ds.length - 1] : null;
    row.r = row.fine ? row.byDiv[row.fine].r : null;
    row.band = ds.length >= 2 ? Q.bandOf(row.byDiv[ds[ds.length - 1]].r, row.byDiv[ds[ds.length - 2]].r) : null;
    row.gate = Q.gateOf(row.r, row.band);
    const dsI = divs.filter((d) => row.byDiv[d] && Number.isFinite(row.byDiv[d].I));
    row.I = dsI.length ? row.byDiv[dsI[dsI.length - 1]].I : null;
    out.push(row);
  }
  return out.sort((a, b) => (b.theta.rd - a.theta.rd) || (b.theta.md - a.theta.md) || (b.theta.sunMd - a.theta.sunMd));
}
export function partR(J, ex = MAIN_EX) {
  const out = { extractor: ex, planets: {} };
  for (const pl of Q.PLANETS) {
    const tg = J.T.targets.find((z) => z.key === pl.key); if (!tg) continue;
    const rows = rowsOf(J, pl.key, ex), divs = J.E.divs, fine = divs[divs.length - 1];
    const t0 = rows.find((r) => Q.isTheta0(r.theta)), tdRow = J.T.planets[pl.key];
    const tD = tdRow ? tdRow.tD[fine] : null;
    const line = rows.filter((r) => r.theta.md === 1 && r.theta.sunMd === 1 && Number.isFinite(r.r));
    const B = Q.bracketsOf(line.map((r) => ({ rd: r.theta.rd, r: r.r })));
    const o = { tD, theta0: t0 ? { r: t0.r, band: t0.band, DG: t0.byDiv[t0.fine] ? t0.byDiv[t0.fine].DG : null, DGh: t0.byDiv[divs[0]] ? t0.byDiv[divs[0]].DG : null } : null,
      rows: rows.map((r) => ({ theta: r.theta, fine: r.fine, r: r.r, band: r.band, gate: r.gate, I: r.I, byDiv: r.byDiv })), bracket: { kind: B.kind, n: B.n, monotone: B.monotone } };
    if (B.kind === 'one') {
      const { lo, hi } = B.brackets[0];
      o.bracket.lo = lo.rd; o.bracket.hi = hi.rd; o.bracket.rLo = lo.r; o.bracket.rHi = hi.r;
      o.secantX = Q.secantX(lo, hi); o.secantLn = Q.secantLn(lo, hi); o.sensLn = Q.sensLn(lo, hi);
    }
    // θ₀ に錨を置いた見積り(測った D_G(θ₀) × 段 S の比 g(rd))
    const SP = J.S && J.S.planets[pl.key];
    if (o.theta0 && Number.isFinite(o.theta0.DG) && Number.isFinite(tD)) {
      o.rdAnchorSquare = Q.rdEstSquare(o.theta0.DG, tD);
      if (SP) o.rdAnchorTable = Q.rdEstTable(SP.rows.map((r) => ({ rd: r.theta.rd, D: o.theta0.DG * r.g })), tD);
    }
    o.next = Q.nextRd(line.map((r) => ({ rd: r.theta.rd, r: r.r })), { lin: (J.kernel || 'k2') === 'k1' });
    const gated = rows.filter((r) => r.gate && r.gate.pass !== null);
    const best = gated.length ? gated.slice().sort((a, b) => Math.abs(a.r) - Math.abs(b.r))[0] : null;
    o.best = best ? { theta: best.theta, r: best.r, band: best.band, gate: best.gate } : null;
    out.planets[pl.key] = o;
  }
  // R_d/R が 3 惑星でそろうか(実測と見積りを分けて —— 共通の比にまとめない)
  const kinds = [['estimate', (k) => J.S && J.S.planets[k] ? J.S.planets[k].rdEst : null], ['anchor', (k) => out.planets[k] ? (out.planets[k].rdAnchorTable || out.planets[k].rdAnchorSquare || null) : null],
    ['secant', (k) => out.planets[k] ? (out.planets[k].secantX || null) : null]];
  out.align = {};
  for (const [kk, f] of kinds) {
    const v = Q.PLANETS.map((p) => ({ key: p.key, rd: f(p.key) })), have = v.filter((z) => Number.isFinite(z.rd));
    out.align[kk] = { rows: v, n: have.length, spread: have.length >= 2 ? Math.max(...have.map((z) => z.rd)) / Math.min(...have.map((z) => z.rd)) : null };
  }
  return out;
}
/** v2(AN396): 採用の候補 = 細分の最後の点(無ければ m_d = M・太陽固定の R_d の列で abs(r) の最小の点)—— 候補の点そのものの h・h/2・h/4 の r と走行の受理 */
export function candidateOf(J, planet) {
  const o = J.R && J.R.planets[planet]; if (!o) return null;
  const line = o.rows.filter((r) => !Q.isTheta0(r.theta) && r.theta.md === 1 && r.theta.sunMd === 1 && Number.isFinite(r.r));
  if (!line.length) return null;
  const tr = J.refine && J.refine[planet] ? J.refine[planet].filter((z) => Number.isFinite(z.rd) && Number.isFinite(z.r)) : [];
  const last = tr.length ? line.find((r) => r.theta.rd === tr[tr.length - 1].rd) : null;
  const c = last || line.slice().sort((a, b) => Math.abs(a.r) - Math.abs(b.r))[0];
  const rByDiv = {}; for (const d of [1, 2, 4]) if (c.byDiv[d] && Number.isFinite(c.byDiv[d].r)) rByDiv[d] = c.byDiv[d].r;
  const kern = J.kernel || 'k2', key = Q.thetaKey(Q.withKernel(c.theta, kern));
  const runs = Object.values(J.E.rows).filter((r) => r.spec.planet === planet && r.spec.kind === 'q11' && Q.thetaKey(r.spec.theta) === key)
    .map((r) => ({ div: r.spec.div, status: r.status, nan: r.status === 'run' ? r.nan : null, betaMax: r.status === 'run' ? r.betaMax : null }));
  // v3: 半径は段 S があればその値(v2 とビット同一)・無ければ凍結の写しの観測半径(段 S に依らない —— 第312便の未決 4)
  const S = J.S && J.S.planets[planet], Rm = S ? S.Rkm * 1e3 : radiusOfPlanet(planet);
  return { theta: c.theta, how: last ? '細分の最後の点' : 'abs(r) の最小の点', rByDiv, R: Rm, runs };
}
/** v3: 凍結の写しの惑星の観測半径 [m](段 S に依らない candidateOf の半径) */
export function radiusOfPlanet(planet) { const pl = Q.planetOf(planet), d = pl && PIN.decl[pl.id]; return d ? d.bodies[1].radius * Math.pow(10, d.scaleExp.L) : null; }
/** v3: 凍結の写しの本の宣言(physics・bodies・scaleExp —— κ₀ の本の単位の R_d の計算に使う) */
export function pinOf(planet) { const d = PIN.decl[Q.planetOf(planet).id]; return { physics: d.physics, bodies: d.bodies, scaleExp: d.scaleExp }; }
export function partG(J) {
  const R = J.R, per = {}, G = Q.GATE;
  for (const pl of Q.PLANETS) {
    const o = R.planets[pl.key]; if (!o) continue;
    const b = o.best, c = candidateOf(J, pl.key);
    per[pl.key] = { gate: b ? b.gate : null, theta: b ? b.theta : null, bracket: o.bracket.kind, pass: !!(b && b.gate && b.gate.pass),
      explorationValue: !!(b && b.gate && b.gate.pass && o.bracket.kind === 'one'),
      adopt: Object.assign({ how: c ? c.how : null }, Q.adoptOf(c, o.bracket, ADOPT_EPS)) };
  }
  const all = Q.PLANETS.every((p) => per[p.key] && per[p.key].pass);
  const adoptAll = Q.PLANETS.every((p) => per[p.key] && per[p.key].adopt.adopted === true);
  return { rule: { bandFactor: G.bandFactor, floor: G.floor, unit: G.unit, kind: G.kind, note: G.note }, planets: per, allPass: all,
    adoptRule: { epsFit: ADOPT_EPS.fit, epsNum: ADOPT_EPS.num, unit: ADOPT_EPS.unit, note: ADOPT_EPS.note, kernel: J.kernel || 'k2',
      fields: ['rootBracketed', 'numericResolved', 'targetReached', 'declAdmissible'] }, adoptAll,
    identification: { knobs: '太陽の R_d(cap6500km に固定)・太陽の m_d・各惑星の R_d と m_d・dragCore の自転と軸(太陽 + 3 惑星で 8 個以上)', targets: 3,
      fixed: ['G_loc の k・n・λ(在位の kappaC2)', 'GM・初期要素(凍結の写し)', '太陽の R_d = 6.5×10⁶ m', '窓 8 公転・抽出器'],
      note: '標的は 3 本・ノブは 8 個以上 —— 全ノブが決まったとは書かない。惑星の R_d だけで 3 本が数値の門を通るなら、太陽の m_d は決まらない(段 S の効きの表)' } };
}

/* ───────── 門(器の健全さ —— 探索の結果の門〔partG〕とは別)───────── */
export function liveDeclGate(HP) {
  return Q.PLANETS.map((pl) => {
    const p = HP.allPresets().find((q) => q.id === pl.id), d = PIN.decl[pl.id], rd = p.physics.relativeDrag || {}, i2 = rd.inertialR2 || {};
    return { id: pl.id, bodiesSame: JSON.stringify(p.bodies) === JSON.stringify(d.bodies), scaleSame: JSON.stringify(p.scaleExp) === JSON.stringify(d.scaleExp),
      timeRefSame: JSON.stringify(p.timeRef) === JSON.stringify(d.timeRef), gLoc: p.physics.gLoc || null, oldRule: rd.law === 'inertial' && typeof rd.Wbg === 'number' && !rd.invSq,
      k: i2.lambdaRs === undefined ? null : i2.lambdaRs, noDragCore: !p.bodies.some((b) => b.dragCore), noInvSq: !rd.invSq };
  });
}
export function gatesOf(J) {
  const g = {};
  if (J.T) {
    g.targetsAn336 = J.T.targets.length === 3 && J.T.targets.every((t) => t.an336 && t.an336.value === t.value && t.an336.recordId === t.recordId && t.an336.h === t.h);
    // v2: 計画にある惑星だけで判定(惑星ごとの 2 段目の出力でも真 —— 3 惑星のそろいは --merge の後の段 G で見る)
    g.gLocMeasured = (J.planets || Q.PLANETS.map((p) => p.key)).every((k) => J.T.planets[k] && J.E.divs.every((d) => Number.isFinite(J.T.planets[k].dqG[d])));
  }
  if (J.S) g.estimateEngineVsRef = Object.values(J.S.planets).every((p) => p.maxDBeta <= 1e-9 && p.rows.every((r) => !r.err)) && Object.values(J.S.planets).every((p) => Number.isFinite(p.rdEst));
  if (J.E) g.runsComplete = Object.values(J.E.rows).filter((r) => r.status === 'run').every((r) => r.complete && !r.nan && Number.isFinite(r.detB) && Number.isFinite(r.apsNew) && r.nPeri >= J.E.N - 1);
  if (J.E) g.noRejected = Object.values(J.E.rows).every((r) => r.status === 'run');   // v2: 核の自転・K1 を求めて拒否・未接続の行も偽(拒否の行は E.rows に残る)
  if (J.live) g.inPositionUnchanged = J.live.every((z) => z.bodiesSame && z.scaleSame && z.timeRefSame && z.oldRule && z.noInvSq && z.noDragCore && z.gLoc && z.gLoc.law === 'kappaC2');
  return g;
}

/* ───────── 文書の表(PHYSICS〔第311便d〕の表の行は正本からこの関数で作る —— QA docs.planet3_311 が逐語で照合)───────── */
const { fx, ex } = Q;
const e4 = (x) => ex(x, 4);
const kmOf = (rd, Rkm) => (Number.isFinite(rd) && Number.isFinite(Rkm)) ? fx(rd * Rkm, 2) : '—';
const fmtRd = (x) => Number.isFinite(x) ? ex(x, 3) : '—';
/** 帯・交差は丸めの床(1e-6 ″/世紀 —— 抽出器と刻みの帯より十分小さく、機械の違いの桁より十分大きい)で書く */
const fb = (x) => Q.fmtFloor(x, 1e-6, 2);
export function physicsTables(J) {
  const out = [], fine = J.E ? J.E.divs[J.E.divs.length - 1] : 2, PK = (k) => Q.planetOf(k);
  if (J.T) {
    out.push('| 惑星 | 標的 q⋆ = 1PN + A1 [″/世紀] | ΔqG = q10 − q00(h/' + fine + ')| ΔqG の帯 | ΔqG の解析の一次 | t_D = q⋆ − ΔqG |', '|---|---|---|---|---|---|');
    for (const t of J.T.targets) { const p = J.T.planets[t.key];
      out.push(`| ${PK(t.key).emoji} ${PK(t.key).ja} | ${fx(t.value, 6)} | ${fx(p.dqG[fine], 4)} | ${fb(p.dqGBand)} | ${fx(t.gLocAnalytic, 4)} | ${fx(p.tD[fine], 4)} |`); }
  }
  if (J.S) {
    out.push('', '| 惑星(t = 0・θ₀) | R [km] | β(惑星 ← 太陽) | D_G の見積り(θ₀)[″/世紀] | g(10⁻³)/(10⁻³)² | rd_est = √(t_D/D_G) | 表の補間 | R_d の見積り [km] |', '|---|---|---|---|---|---|---|---|');
    for (const pl of Q.PLANETS) { const s = J.S.planets[pl.key]; if (!s) continue; const r1 = s.rows[0], rlast = s.rows[s.rows.length - 1];
      out.push(`| ${pl.emoji} ${pl.ja} | ${fx(s.Rkm, 1)} | ${ex(r1.betaE, 4)} | ${e4(r1.D)} | ${fx(rlast.gOverRd2, 6)} | ${fmtRd(s.rdEstSquare)} | ${fmtRd(s.rdEstTable)} | ${fx(s.RdEstKm, 2)} |`); }
  }
  if (J.R) {
    out.push('', `| 惑星(θ₀ —— 既定 R_d = R・m_d = M) | D_G = q11 − q10(h) | D_G(h/${fine}) | r(θ₀)(h/${fine}) | 帯 abs(r_h − r_h/${fine}) |`, '|---|---|---|---|---|');
    for (const pl of Q.PLANETS) { const o = J.R.planets[pl.key]; if (!o || !o.theta0) continue;
      out.push(`| ${pl.emoji} ${pl.ja} | ${e4(o.theta0.DGh)} | ${e4(o.theta0.DG)} | ${e4(o.theta0.r)} | ${fb(o.theta0.band)} |`); }
    for (const pl of Q.PLANETS) {
      const o = J.R.planets[pl.key], s = J.S && J.S.planets[pl.key]; if (!o) continue;
      const grid = o.rows.filter((r) => !Q.isTheta0(r.theta) && r.theta.md === 1 && r.theta.sunMd === 1);
      if (!grid.length) continue;
      out.push('', `| ${pl.emoji} ${pl.ja}の R_d/R(m_d = M) | R_d [km] | r(h) [″/世紀] | r(h/${fine}) | 帯 | 門の許容 max(3 × 帯, 0.01) | 数値の門 | 交差 I |`, '|---|---|---|---|---|---|---|---|');
      for (const r of grid) { const b1 = r.byDiv[J.E.divs[0]];
        out.push(`| ${fmtRd(r.theta.rd)} | ${kmOf(r.theta.rd, s ? s.Rkm : null)} | ${fx(b1 ? b1.r : null, 3)} | ${fx(r.r, 3)} | ${fb(r.band)} | ${ex(r.gate.tol, 2)} | ${r.gate.pass === null ? '—' : (r.gate.pass ? '通る' : '通らない')} | ${Number.isFinite(r.I) ? fb(r.I) : '—'} |`); }
    }
    out.push('', '| R_d/R(3 惑星がそろうか —— 共通の比にまとめない) | 🌡️ 水星 | 🌋 金星 | 🔴 火星 | 最大/最小 |', '|---|---|---|---|---|');
    const lab = { estimate: '一次の見積り(段 S —— t_D は解析の ΔqG)', anchor: 'θ₀ の実測 D_G に錨(× 段 S の比 g)', secant: '実測の区間の割線(x = (R_d/R)²)' };
    for (const k of ['estimate', 'anchor', 'secant']) { const A = J.R.align[k];
      out.push(`| ${lab[k]} | ${A.rows.map((z) => fmtRd(z.rd)).join(' | ')} | ${A.spread === null ? '—' : fx(A.spread, 3)} |`); }
  }
  if (J.S) {
    out.push('', '| 惑星の m_d/M(R_d = rd_est —— 一次の見積り) | 🌡️ D_G − t_D [″/世紀] | 🌋 | 🔴 | 🌡️ R_d = rd_est/10 で | 🌋 | 🔴 |', '|---|---|---|---|---|---|---|');
    const mds = (J.S.planets.mercury || Object.values(J.S.planets)[0]).mdFloor.map((z) => z.md);
    for (const md of mds) {
      const cell = (k, w) => { const s = J.S.planets[k]; const z = s && s.mdFloor.find((q) => q.md === md); const v = z && z[w] && Number.isFinite(z[w].D) ? z[w].D - s.tDanalytic : null; return Number.isFinite(v) ? ex(v, 3) : '—'; };
      out.push(`| ${md === 1 ? '1' : (md >= 0.9 ? '1 − ' + ex(1 - md, 0) : fx(md, 2))} | ${cell('mercury', 'atEst')} | ${cell('venus', 'atEst')} | ${cell('mars', 'atEst')} | ${cell('mercury', 'atTenth')} | ${cell('venus', 'atTenth')} | ${cell('mars', 'atTenth')} |`);
    }
    out.push('', '| 太陽の m_d/M☉(R_d = rd_est —— 一次の見積り) | 🌡️ ΔD [″/世紀] | 🌋 | 🔴 | 🌡️ 根の ln R_d の移り | 🌋 | 🔴 |', '|---|---|---|---|---|---|---|');
    const sms = (J.S.planets.mercury || Object.values(J.S.planets)[0]).sunMd.map((z) => z.sunMd).filter((z) => z !== 1);
    for (const sm of sms) {
      const c = (k, w) => { const s = J.S.planets[k]; const z = s && s.sunMd.find((q) => q.sunMd === sm); return z && Number.isFinite(z[w]) ? ex(z[w], 3) : '—'; };
      out.push(`| ${ex(sm, 0)} | ${c('mercury', 'dD')} | ${c('venus', 'dD')} | ${c('mars', 'dD')} | ${c('mercury', 'dLnRd')} | ${c('venus', 'dLnRd')} | ${c('mars', 'dLnRd')} |`);
    }
  }
  return out.join('\n');
}
/** v2(第312便d): PHYSICS〔第312便d〕の表 —— 一次の見積りの係数 C₂ の実測と AN396 の採用の欄(QA docs.planet3_311 の v2 の世代が逐語で照合) */
const yn = (x) => (x === true ? '真' : (x === false ? '偽' : '—(h/4 なし)'));
export function physicsTablesV2(J) {
  const out = [];
  if (J.S) {
    out.push('| 惑星(t = 0・θ₀ の段 S の最小の R_d/R) | R_d/R | C₂ = β/((M☉/m)(R_d/r)²) |', '|---|---|---|');
    for (const pl of Q.PLANETS) { const s = J.S.planets[pl.key]; if (!s) continue; out.push(`| ${pl.emoji} ${pl.ja} | ${fmtRd(s.c2Rd)} | ${fx(s.c2, 5)} |`); }
  }
  if (J.G) {
    out.push('', `| 惑星(AN396 の採用の欄 —— ε_fit ${ex(J.G.adoptRule.epsFit, 0)}・ε_num ${ex(J.G.adoptRule.epsNum, 0)}″/世紀・kernel ${J.G.adoptRule.kernel}) | 候補の R_d/R | 選び方 | rootBracketed | numericResolved | targetReached | declAdmissible | 採用 |`,
      '|---|---|---|---|---|---|---|---|');
    for (const pl of Q.PLANETS) { const g = J.G.planets[pl.key]; if (!g) continue; const a = g.adopt;
      out.push(`| ${pl.emoji} ${pl.ja} | ${a.candidate ? fmtRd(a.candidate.theta.rd) : '—'} | ${a.how || '候補なし'} | ${yn(a.rootBracketed)} | ${yn(a.numericResolved)} | ${yn(a.targetReached)} | ${yn(a.declAdmissible)} | ${a.adopted ? '採る' : '採らない'} |`); }
  }
  return out.join('\n');
}
export function docNumbers(J) {
  const out = [], fine = J.E ? J.E.divs[J.E.divs.length - 1] : 2;
  if (J.R) for (const pl of Q.PLANETS) { const o = J.R.planets[pl.key]; if (o && o.bracket && o.bracket.kind === 'one') out.push(fmtRd(o.bracket.lo), fmtRd(o.bracket.hi), fmtRd(o.secantX)); }
  if (J.S) for (const pl of Q.PLANETS) { const s = J.S.planets[pl.key]; if (s) out.push(fmtRd(s.rdEst)); }
  if (J.T) for (const pl of Q.PLANETS) { const p = J.T.planets[pl.key]; if (p) out.push(fx(p.tD[fine], 4)); }
  return out;
}

/* ───────── 走行の計画と組み立て ───────── */
/** 走行の一覧(段 T と E)。o = {planets, divs, grid{planet:[rd]}, cross{planet:[rd]}, md[], sunmd[], at{planet:rd}, coreSpin, N} */
export function planOf(o) {
  const specs = [], N = o.N, divs = o.divs, K = (th) => Q.withKernel(o.rule ? Object.assign({}, th, { rule: o.rule }) : th, o.kernel), add = (s) => specs.push(Object.assign({ N }, s, s.theta ? { theta: K(s.theta) } : {}));
  for (const k of o.planets) {
    for (const dv of divs) { add({ planet: k, kind: 'q00', div: dv }); add({ planet: k, kind: 'q10', div: dv }); }
    if (o.theta0 !== false) for (const dv of divs) add({ planet: k, kind: 'q11', theta: Q.thetaOf({}), div: dv });
    for (const rd of (o.grid[k] || [])) for (const dv of (o.gridDivs || divs)) add({ planet: k, kind: 'q11', theta: o.thetaFor ? o.thetaFor(k, rd) : Q.thetaOf({ rd }), div: dv });
    for (const rd of (o.cross[k] || [])) for (const dv of divs) add({ planet: k, kind: 'q01', theta: Q.thetaOf({ rd }), div: dv });
    const at = o.at && o.at[k];
    if (at) {
      for (const md of (o.md || [])) for (const dv of divs) add({ planet: k, kind: 'q11', theta: Q.thetaOf({ rd: at, md }), div: dv });
      for (const sm of (o.sunmd || [])) for (const dv of divs) add({ planet: k, kind: 'q11', theta: Q.thetaOf({ rd: at, sunMd: sm }), div: dv });
      if (o.coreSpin) for (const dv of divs) add({ planet: k, kind: 'q11', theta: Object.assign(Q.thetaOf({ rd: at }), { coreSpin: o.coreSpin }), div: dv });
    }
  }
  const seen = new Set();
  return specs.filter((s) => { const k = specKey(s); if (seen.has(k)) return false; seen.add(k); return true; });
}
const costOf = (s) => (Q.KINDS[s.kind].drag ? 100 : 1) * s.div;
async function runPlan(specs, run, reuse, log) {
  const rows = {}, todo = [];
  for (const s of specs) { const k = specKey(s); if (reuse && reuse[k] && reuse[k].status === 'run') rows[k] = Object.assign({}, reuse[k], { reused: true }); else todo.push(s); }
  todo.sort((a, b) => costOf(b) - costOf(a));
  const res = await Promise.all(todo.map((s) => run(s).then((r) => { log(r); return r; })));
  for (const r of res) rows[r.key] = r;
  return rows;
}
/** 段 T の表(ΔqG・t_D)を E の行から */
export function tTable(J) {
  const out = {};
  for (const pl of Q.PLANETS) {
    const tg = J.T.targets.find((z) => z.key === pl.key), dqG = {}, tD = {}, q00 = {}, q10 = {}, dqGB = {};
    let ok = false;
    for (const dv of J.E.divs) {
      const a = qOf(J.E, pl.key, 'q00', null, dv, MAIN_EX), b = qOf(J.E, pl.key, 'q10', null, dv, MAIN_EX);
      if (!Number.isFinite(a) || !Number.isFinite(b)) continue;
      ok = true; q00[dv] = a; q10[dv] = b; dqG[dv] = b - a; tD[dv] = tg.value - (b - a);
      const aB = qOf(J.E, pl.key, 'q00', null, dv, SUB_EX), bB = qOf(J.E, pl.key, 'q10', null, dv, SUB_EX); dqGB[dv] = bB - aB;
    }
    if (!ok) continue;
    const ds = J.E.divs.filter((d) => Number.isFinite(dqG[d]));
    out[pl.key] = { q00, q10, dqG, tD, dqGDetB: dqGB, dqGBand: ds.length >= 2 ? Math.abs(dqG[ds[ds.length - 1]] - dqG[ds[ds.length - 2]]) : null,
      dqGVsAnalytic: ds.length ? rel(dqG[ds[ds.length - 1]], tg.gLocAnalytic) : null };
  }
  return out;
}

export async function runAll(HP, o = {}) {
  const parts = o.parts || PARTS_ALL.slice(), quick = !!o.quick, t = {};
  let t0 = Date.now();
  const tick = (k) => { t[k] = { wallSec: (Date.now() - t0) / 1000 }; t0 = Date.now(); };
  const J = { quick, parts, stage2: !!o.stage2, kernel: o.kernel || 'k2', planets: (o.planets || Q.PLANETS.map((p) => p.key)).slice() };
  if (o.rule) J.rule = o.rule;   // v3: 全天体の規則(宣言したときだけ —— 既定の計画の JSON は v2 と同じ形)
  // v3: 候補 θ(全天体の規則なら κ/κ₀ の倍率 kf を 12 桁で鍵にする —— 宣言の半径は kf·10 G m/(C₁ c²))
  const TH = (k, rd) => Q.withKernel(o.rule === 'kappa0' ? Q.thetaOfKf(pinOf(k), Q.kfOfRd(pinOf(k), rd)) : Q.thetaOf({ rd }), o.kernel);
  J.live = liveDeclGate(HP);
  J.book = { ids: Q.PLANETS.map((p) => p.id), newDrag: clone(Q.NEW_DRAG), offDrag: clone(Q.OFF_DRAG), gLoc: clone(Q.GLOC_FIXED), declFile: DECL_FILE, capM: Q.CAP_M, window: o.N, extractor: { main: MAIN_EX, sub: SUB_EX, K: APSIS_K } };
  const targets = targetTable(HP);
  if (parts.includes('S')) { J.S = partS(HP, { quick, T: targets, planets: o.planets }); tick('S'); }
  if (parts.includes('T') || parts.includes('E')) {
    // 段 S の見積りから 2 段目の --at の既定(指定が無い惑星は rd_est)
    const at = Object.assign({}, o.at || {});
    if (J.S) for (const k of o.planets) if (!at[k] && (o.md && o.md.length || o.sunmd && o.sunmd.length || o.coreSpin) && J.S.planets[k]) at[k] = Number(J.S.planets[k].rdEst.toPrecision(4));
    // 第312便(統括): θ₀(R_d = R)は K2 の錨。K1 では β ≈ C₁(M☉/m)(R/r) が 0.1 の程度になり軌道が壊れる(水星の h/2 で配列の長さが尽きた)ので走らせない
    const plan = planOf(Object.assign({}, o, { at, theta0: parts.includes('E') && (o.kernel || 'k2') === 'k2', thetaFor: o.rule ? TH : null }));
    J.plan = { divs: o.divs, N: o.N, grid: o.grid, cross: o.cross, at, md: o.md || [], sunmd: o.sunmd || [], coreSpin: o.coreSpin || null, specs: plan.length };
    if (o.rule) J.plan.rule = o.rule;
    const rows = await runPlan(plan, o.run, o.reuse, o.log || (() => {}));
    // v2: 2 段目は使い回せる正本の同じ惑星・同じ窓・同じ刻みの行も足す(--refine の区間に正本の点を入れる —— html と器の版が同じときだけ o.reuse がある)
    if (o.stage2 && o.reuse) for (const r of Object.values(o.reuse)) {
      if (!(r && r.status === 'run' && r.spec && o.planets.includes(r.spec.planet) && r.spec.N === o.N && o.divs.includes(r.spec.div))) continue;
      if (Q.KINDS[r.spec.kind].drag && (Q.kernelOf(r.spec.theta) !== (o.kernel || 'k2') || Q.ruleOf(r.spec.theta) !== (o.rule || null))) continue;
      if (!rows[r.key]) rows[r.key] = Object.assign({}, r, { reused: true });
    }
    J.E = { N: o.N, divs: o.divs.slice().sort((a, b) => a - b), rows };
    // 細分(2 段目 —— 惑星ごとに割線で次の点を測る)
    if (o.refine > 0) {
      J.refine = {};
      await Promise.all(o.planets.map(async (k) => {
        const tr = []; J.refine[k] = tr;
        for (let it = 0; it < o.refine; it++) {
          const tmp = Object.assign({}, J, { T: { targets }, R: null }); tmp.T.planets = tTable(tmp);
          const line = rowsOf(tmp, k).filter((r) => r.theta.md === 1 && r.theta.sunMd === 1 && Number.isFinite(r.r));
          const nx = Q.nextRd(line.map((r) => ({ rd: r.theta.rd, r: r.r })), { lin: (o.kernel || 'k2') === 'k1' });
          if (!nx.rd) { tr.push({ it, stop: nx.why }); break; }
          // v3: K1 の R_d/R は 1e-9 の程度 —— 全天体の規則の細分は 12 桁(ε_fit の κ の分解能より十分細かい)・それ以外は v2 と同じ 6 桁
          const th = o.rule ? TH(k, nx.rd) : TH(k, Number(nx.rd.toPrecision(6))), rd = th.rd, sp = J.E.divs.map((dv) => ({ planet: k, kind: 'q11', theta: th, div: dv, N: o.N }));
          const rs = await Promise.all(sp.map((s) => o.run(s).then((r) => { (o.log || (() => {}))(r); return r; })));
          for (const r of rs) J.E.rows[r.key] = r;
          const tmp2 = Object.assign({}, J, { T: { targets } }); tmp2.T.planets = tTable(tmp2);
          const row = rowsOf(tmp2, k).find((r) => r.theta.rd === rd && r.theta.md === 1 && r.theta.sunMd === 1);
          tr.push({ it, rd, how: nx.why, r: row ? row.r : null, band: row ? row.band : null, pass: row && row.gate ? row.gate.pass : null });
          // v3(決断事項 AN396′): 粗い門で止めない —— 細かい刻みの abs(r) ≤ ε_fit で止める
          if (row && Number.isFinite(row.r) && Math.abs(row.r) <= ADOPT_EPS.fit) break;
        }
      }));
    }
    if (o.h4) {   // 最終の候補を h/4(AN393 (a)・AN396 —— 鎖では走らせない): --rd の点に加えて**候補の点そのもの**(細分の最後の点 —— 無ければ abs(r) の最小の点)
      const sp = [], tmp = Object.assign({}, J, { T: { targets } }); tmp.T.planets = tTable(tmp);
      for (const k of o.planets) {
        const rds = Array.isArray(o.h4) ? o.h4.slice() : [];
        const tr = J.refine && J.refine[k] ? J.refine[k].filter((z) => Number.isFinite(z.rd)) : [];
        const line = rowsOf(tmp, k).filter((r) => r.theta.md === 1 && r.theta.sunMd === 1 && !Q.isTheta0(r.theta) && Number.isFinite(r.r));
        const cand = tr.length ? tr[tr.length - 1].rd : (line.length ? line.slice().sort((a, b) => Math.abs(a.r) - Math.abs(b.r))[0].theta.rd : null);
        if (Number.isFinite(cand) && !rds.includes(cand)) rds.push(cand);
        for (const rd of rds) sp.push({ planet: k, kind: 'q11', theta: TH(k, rd), div: 4, N: o.N });
        for (const kind of ['q00', 'q10']) sp.push({ planet: k, kind, div: 4, N: o.N });
      }
      const rs = await runPlan(sp, o.run, o.reuse, o.log || (() => {}));
      Object.assign(J.E.rows, rs); if (!J.E.divs.includes(4)) J.E.divs.push(4);
    }
    tick('E');
  }
  if (parts.includes('T')) { J.T = { targets }; if (J.E) J.T.planets = tTable(J); tick('T'); }
  if (parts.includes('R') && J.T && J.E) { J.R = partR(J); J.Rsub = partR(J, SUB_EX); tick('R'); }
  if (parts.includes('G') && J.R) { J.G = partG(J); tick('G'); }
  J.gates = gatesOf(J);
  J.ok = Object.values(J.gates).every(Boolean);
  J.timing = t;
  const runs = J.E ? Object.values(J.E.rows).filter((r) => r.status === 'run' && !r.reused) : [];
  J.stats = { runs: runs.length, steps: runs.reduce((s, r) => s + r.steps, 0), wallByKind: {} };
  for (const r of runs) { const kk = r.spec.planet + '-' + (Q.KINDS[r.spec.kind].drag ? 'drag' : 'nodrag') + '-h' + r.spec.div; const w = J.stats.wallByKind[kk] || (J.stats.wallByKind[kk] = { n: 0, wallSec: 0, steps: 0 }); w.n++; w.wallSec += r.wallSec; w.steps += r.steps; }
  return J;
}

const argOf = (k) => { const i = process.argv.indexOf(k); return i >= 0 ? process.argv[i + 1] : null; };
/**
 * 2 段目の出力をまとめる(`--merge a.json,b.json,…` —— 同じ html〔targetSha256〕・同じ器の版の行だけ)。走行はしない: E の行と段 S の惑星を合わせ、
 * 段 T・R・G をこの器の純関数で作り直して tests/out/planet3-w311d-stage2.json(W311D_OUT で変える)へ。正本(planet3-w311d.json)を入れてもよい
 */
export async function mergeMain(files, TARGET) {
  const Js = files.map((f) => JSON.parse(fs.readFileSync(path.isAbsolute(f) ? f : path.join(ROOT, f), 'utf8')));
  const sha = Js[0].targetSha256, bad = Js.filter((j) => j.targetSha256 !== sha || j.version !== HARNESS_VERSION);
  if (bad.length) throw new Error('--merge: html か器の版が違う出力がある(' + bad.length + ' 本)');
  const N = Js[0].E.N; if (Js.some((j) => j.E.N !== N)) throw new Error('--merge: 窓が違う');
  const kern = Js[0].kernel || 'k2'; if (Js.some((j) => (j.kernel || 'k2') !== kern)) throw new Error('--merge: kernel が違う出力がある(K1 と K2 の行を混ぜない)');
  const rule0 = Js[0].rule || null; if (Js.some((j) => (j.rule || null) !== rule0)) throw new Error('--merge: 全天体の規則が違う出力がある(太陽の R_d の違う行を混ぜない)');
  const planets = Q.PLANETS.map((p) => p.key).filter((k) => Js.some((j) => (j.planets || Q.PLANETS.map((p) => p.key)).includes(k)));
  const J = { quick: false, parts: PARTS_ALL.slice(), stage2: true, kernel: kern, planets, merged: files.map((f) => path.relative(ROOT, path.isAbsolute(f) ? f : path.join(ROOT, f))), live: Js[0].live, book: Js[0].book };
  if (rule0) J.rule = rule0;
  J.S = { planets: {}, formula: Js[0].S ? Js[0].S.formula : null };
  for (const j of Js) if (j.S) Object.assign(J.S.planets, j.S.planets);
  const divs = [...new Set(Js.flatMap((j) => j.E.divs))].sort((a, b) => a - b);
  J.E = { N, divs, rows: Object.assign({}, ...Js.map((j) => j.E.rows)) };
  J.refine = Object.assign({}, ...Js.map((j) => j.refine || {}));
  J.T = { targets: Js[0].T.targets }; J.T.planets = tTable(J);
  J.R = partR(J); J.G = partG(J);
  J.gates = gatesOf(J); J.ok = Object.values(J.gates).every(Boolean);
  const out = Object.assign({ version: HARNESS_VERSION, libVersion: Q.LIB_VERSION, generator: 'tests/exp-w311d-planet3.mjs --merge', target: TARGET, targetSha256: sha }, J);
  const OUT = process.env.W311D_OUT ? (path.isAbsolute(process.env.W311D_OUT) ? process.env.W311D_OUT : path.join(ROOT, process.env.W311D_OUT)) : path.join(ROOT, OUT_STAGE2);
  fs.mkdirSync(path.dirname(OUT), { recursive: true });
  fs.writeFileSync(OUT, JSON.stringify(out, null, 1) + '\n');
  console.log('→', path.relative(ROOT, OUT), 'ok=' + out.ok, '数値の門 3 対同時 ' + J.G.allPass, JSON.stringify(Object.fromEntries(Object.entries(J.G.planets).map(([k, v]) => [k, v.pass]))),
    '採用の欄 ' + JSON.stringify(Object.fromEntries(Object.entries(J.G.planets).map(([k, v]) => [k, v.adopt && v.adopt.adopted]))));
}
const listOf = (k) => (argOf(k) ? argOf(k).split(',').map((s) => s.trim()).filter(Boolean).map(Number) : null);
export async function main() {
  if (process.argv.includes('--child')) {
    const spec = JSON.parse(argOf('--child')), TARGET = process.env.W311D_TARGET || 'beta/index.html';
    const { HP } = loadHtmlMain(path.isAbsolute(TARGET) ? TARGET : path.join(ROOT, TARGET));
    pinDecl315c();   // 第315便c(AN406): 在位の 7 本の宣言を移行の前の写しへ(本ごとの門 —— 基点の html では no-op・正本の欄は足さない)
    process.stdout.write('\n' + JSON.stringify(runSpec(HP, spec)) + '\n');
    return;
  }
  const TARGET = process.env.W311D_TARGET || 'beta/index.html';
  if (argOf('--merge')) return mergeMain(argOf('--merge').split(','), TARGET);
  const quick = process.env.W311D_QUICK === '1';
  const plArg = argOf('--planet'), planets = plArg ? plArg.split(',').map((s) => { const p = Q.planetOf(s.trim()); if (!p) throw new Error('--planet ' + s); return p.key; }) : Q.PLANETS.map((p) => p.key);
  const rdL0 = listOf('--rd'), rdAbsL = listOf('--rdabs'), rdmL = listOf('--rdm'), kfL = listOf('--kf'), mdL = listOf('--md'), smL = listOf('--sunmd'), crL = listOf('--cross'), divL = listOf('--divs'), atL = listOf('--at');
  const refine = Number(argOf('--refine')) || 0, h4 = process.argv.includes('--h4'), coreSpin = argOf('--coreSpin') ? JSON.parse(argOf('--coreSpin')) : null;
  if (coreSpin) { const e = checkCoreSpin(coreSpin); if (e) throw new Error(e); }
  const kernel = argOf('--kernel') || 'k2';
  if (!Q.KERNELS.includes(kernel)) throw new Error('--kernel は ' + Q.KERNELS.join('|'));
  const rule = argOf('--rule') || null;   // v3: 全天体の規則(kappa0 —— K1 だけ)
  if (rule !== null && !Q.RULES.includes(rule)) throw new Error('--rule は ' + Q.RULES.join('|'));
  if (rule === 'kappa0' && kernel !== 'k1') throw new Error('--rule kappa0 は --kernel k1 と一緒にだけ(K1 の写しだけ)');
  if (kfL && rule !== 'kappa0') throw new Error('--kf(κ/κ₀ の倍率)は --rule kappa0 と一緒にだけ');
  if ([rdL0, rdAbsL, rdmL, kfL].filter(Boolean).length > 1) throw new Error('--rd・--rdabs・--rdm・--kf は 1 つだけ');
  if ((rdAbsL || rdmL || kfL) && planets.length !== 1) throw new Error('--rdabs・--rdm・--kf は --planet を 1 つにして使う(惑星の R と m で R_d/R へ換算する)');
  let rdL = rdL0;
  if (kfL) {   // v3: κ/κ₀ の倍率を惑星の R_d/R へ(凍結の写しの本の単位 —— 10 G m/(C₁ c²)/R)。行の鍵は kf(12 桁)
    const pb = pinOf(planets[0]);
    rdL = kfL.map((x) => Q.rdOfKf(pb, x));
    console.log('  κ の口: --kf ' + kfL.join(',') + '(κ₀ = ' + Q.kappa0SI(pb).toExponential(9) + ' m/kg)→ R_d/R ' + rdL.join(','));
  }
  if (rdAbsL || rdmL) {   // v2: 絶対の R_d [m] か R_d/m [m/kg] を惑星の R_d/R へ(凍結の写しの R と m)
    const b = PIN.decl[Q.planetOf(planets[0]).id].bodies[1], ex = PIN.decl[Q.planetOf(planets[0]).id].scaleExp, Rm = b.radius * Math.pow(10, ex.L), mKg = b.m * Math.pow(10, ex.M);
    rdL = rdAbsL ? rdAbsL.map((x) => Q.rdFromAbs(x, Rm)) : rdmL.map((x) => Q.rdFromRdm(x, mKg, Rm));
    console.log('  R_d の口: ' + (rdAbsL ? '--rdabs ' + rdAbsL.join(',') + ' m' : '--rdm ' + rdmL.join(',') + ' m/kg') + ' → R_d/R ' + rdL.join(','));
  }
  for (const x of (rdL || [])) if (!(x > 0 && x <= 1)) throw new Error('R_d/R は 0 < rd ≤ 1(' + x + ')');
  const stage2 = !!(rdL || mdL || smL || crL || refine || h4 || coreSpin || atL || kernel !== 'k2' || rule);
  const plan = quick ? QUICK_PLAN : BRANCH_PLAN;
  const grid = {}, cross = {}, at = {};
  for (const k of planets) {
    grid[k] = rdL ? rdL : (stage2 ? [] : (plan.grid[k] || []).slice());
    cross[k] = crL ? crL : (stage2 ? [] : (plan.cross[k] || []).slice());
    if (atL) at[k] = atL[Math.min(planets.indexOf(k), atL.length - 1)];
  }
  // 2 段目の既定の出力: --planet を指定したら惑星ごとの別名(惑星ごとの process で並走しても書き先が重ならない —— --merge で 1 本にまとめる)
  const out2 = plArg ? OUT_STAGE2.replace('.json', '-' + planets.join('-') + '.json') : OUT_STAGE2;
  const OUT = process.env.W311D_OUT ? (path.isAbsolute(process.env.W311D_OUT) ? process.env.W311D_OUT : path.join(ROOT, process.env.W311D_OUT)) : path.join(ROOT, stage2 ? out2 : OUT_MAIN);
  if (quick && !process.env.W311D_OUT) throw new Error('試走(W311D_QUICK=1)は W311D_OUT を指定する(正本を書かない)');
  if (!stage2 && plArg && !process.env.W311D_OUT) throw new Error('--planet だけの走行は W311D_OUT を指定する(正本は 3 惑星)');
  const parts = process.env.W311D_PARTS ? process.env.W311D_PARTS.split(',') : PARTS_ALL.slice();
  const html = path.isAbsolute(TARGET) ? TARGET : path.join(ROOT, TARGET);
  const t0 = Date.now(), targetSha256 = crypto.createHash('sha256').update(fs.readFileSync(html)).digest('hex');
  const W281A_SCOPE = w281aScopeStamp(html, REGEN_SCOPE);
  const { HP } = loadHtmlMain(html);
  pinDecl315c();   // 第315便c(AN406): 在位の 7 本の宣言を移行の前の写しへ(本ごとの門 —— 基点の html では no-op・正本の欄は足さない)
  // 2 段目は正本の行を使い回す(html が同じ・器の版が同じときだけ)
  let reuse = null, reuseFrom = null;
  if (stage2 && process.env.W311D_FROM !== '0') {
    const f = process.env.W311D_FROM || path.join(ROOT, OUT_MAIN);
    try { const P = JSON.parse(fs.readFileSync(f, 'utf8')); if (P.targetSha256 === targetSha256 && P.version === HARNESS_VERSION && P.E) { reuse = P.E.rows; reuseFrom = path.relative(ROOT, f); } } catch (e) { reuse = null; }
  }
  const NW = Math.max(1, Number(process.env.W311D_WORKERS) || 2), run = makePool(NW, fileURLToPath(import.meta.url));
  const divs = divL || (quick ? QUICK_PLAN.divs.slice() : BRANCH_PLAN.divs.slice());
  const log = (r) => console.log(`  ${r.key}: ${r.status}${r.status === 'run' ? '・新 ' + Number(r.apsNew).toFixed(4) + '・B ' + Number(r.detB).toFixed(4) + '″/世紀・' + r.steps + ' 步・' + r.wallSec.toFixed(1) + ' s' : '・' + (r.unconnected ? r.unconnected + '・' : '') + (r.err || '').slice(0, 120)}`);
  const R = await runAll(HP, { quick, parts, planets, divs, grid, cross, at, md: mdL, sunmd: smL, coreSpin, kernel, rule, refine, h4: h4 ? (rdL || true) : null, N: quick ? N_ORB_QUICK : N_ORB, run, reuse, log, stage2 });
  const out = { version: HARNESS_VERSION, libVersion: Q.LIB_VERSION, shellLibVersion: D.LIB_VERSION, an336LibVersion: AN.LIB_VERSION, apsisVersion: AP.APSIS_VERSION, generator: 'tests/exp-w311d-planet3.mjs', target: TARGET,
    targetSha256, reuseFrom,
    ruling: '原仮定者の裁定(第110報)AN387・(第111報)AN391: G_loc の宣言を固定して寄与を差し引き、太陽–水星・太陽–金星・太陽–火星で各天体の dragCore を探索する ' +
      '—— 決断事項 AN392(ノブの順)・AN386(値域と探索の型)・AN396(数値の門)・AN336(標的 1PN + A1)・統括の検証項目 R229。探索の材料(探索の値を在位へ入れない)。' +
      'v2(第312便d —— 原仮定者の裁定(第114報)・決断事項 AN396 の最終の採用の欄・統括の検証項目 R233): 候補の点そのものの 4 つの欄・--kernel k1 の口・R_d の口・門の直し。' +
      'v3(第313便d —— 原仮定者の裁定(第115報)AN399・AN402・決断事項 AN396′・統括の検証項目 R237): 全天体の規則 --rule kappa0(κ₀ 固定)・細分を ε_fit まで・採用の欄の cap を外す',
    invSqVersion: HP.REL_DRAG_INVSQ_VERSION || null, ...R };
  delete out.Rsub;
  out.Rsub = R.Rsub ? { extractor: R.Rsub.extractor, planets: Object.fromEntries(Object.entries(R.Rsub.planets).map(([k, v]) => [k, { theta0: v.theta0, bracket: v.bracket, secantX: v.secantX || null }])) } : null;
  out.elapsedS = (Date.now() - t0) / 1000;
  const CODE = ['tests/exp-w311d-planet3.mjs', 'tests/lib-w315c-legacy7.mjs', 'tests/lib-w311d-planet3.mjs', 'tests/lib-w310d-shell.mjs', 'tests/lib-w309a-invsq.mjs', 'tests/lib-w307a-sphereaxial.mjs', 'tests/lib-w306a-an336.mjs',
    'tests/lib-w304e-apsis.mjs', 'tests/exp-w299c-planets3d.mjs', 'tests/lib-w299c-planets3d.mjs', 'tests/lib-w280b-emgrid.mjs', 'tests/lib-w272e-provenance.mjs', 'tests/lib-w281a-scope.mjs'];
  out.meta = Object.assign(provenanceMeta({ root: ROOT, wave: '第313便d', target: TARGET, code: CODE,
    inputs: [TARGET, LEGACY7_DATA_FILE, DECL_FILE, AN336_OUT, AN.CANDIDATE_FILE, AN.AUDIT_FILE] }), {
    harnessVersion: HARNESS_VERSION,
    engine: 'Node(tests/lib-w280b-emgrid.mjs の loadHtmlMain —— html の本文をそのまま実行・走行は子プロセス W311D_WORKERS)',
    notClaim: NOT_CLAIM });
  Object.assign(out.meta, W281A_SCOPE, w281aStableInputs(ROOT, out.meta.inputs));
  fs.mkdirSync(path.dirname(OUT), { recursive: true });
  fs.writeFileSync(OUT, JSON.stringify(out, null, 1) + '\n');
  console.log('→', path.relative(ROOT, OUT), 'ok=' + out.ok, JSON.stringify(out.gates), out.elapsedS + ' s', JSON.stringify(out.timing));
}
if (IS_MAIN) await main();
