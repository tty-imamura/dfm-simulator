// 第331便c(原仮定者の整理(2026-11-09)「水星の近点移動は G_loc を採用」・原仮定者の追記(2026-11-09)「K1 の R_d を使った計算は『太陽–木星』のスケールで有効なのではないか
//   (1PN が『太陽–水星』で有効なのと同様)。『土星の環の厚み』との関連も調べる」・統括の検証項目 R312): **G_loc の基準表(全近点移動の出所)・K1 の R_d のスケールの読みの表・
//   土星の環の厚みとの関連の候補の表の器**(段 k1scale-331c —— 正本 tests/out/k1scale-w331c.json・lib tests/lib-w331c-k1scale.mjs)。**診断だけ** —— エンジン・内蔵の本・受理器・
//   G_loc の符号・n・R_d の規則は変えない(写しの中だけで n と K1 の有無と惑星の質量を変える)。physics の鍵を足さない。
//
// Node だけ(html の inline script を tests/lib-w280b-emgrid.mjs の loadHtmlMain で読み、在位の本の**写し**を validatePreset・coord3d.makeSim・build・step で走らせる ——
//   走行と抽出器は第315便c の器の型〔tests/exp-w311d-planet3.mjs の measure —— 新しい抽出器 apsNew・窓 8 公転・刻み h は第306便a の器の刻み〕)。走行は子プロセス(W331C_WORKERS —— 既定 2)。
//
// ■ 段(正本は全段)
//   P t = 0 の印字(在位の 7 本の質量・R_d の規則・q_1PN・η・G_loc の宣言 / 🟡 saturnSunInertial3d・💍 saturnRingReal の宣言の値 —— 本は変えない)
//   A G_loc の基準表の解析の一次(n ∈ {2, 1, 0, −1, −2, −3}〔symmetric は −6 も〕× 受け手/対称 × K1 の有無 × 7 本)・候補の表(A 今・B n = −3・C symmetric n = −6・D・E)・力の型とポテンシャルの微分の型
//   R 正本 tests/out/inposk1-w315c.json の比 D_G/q_1PN・ΔqG/q_1PN(惑星ごと・刻みごと —— 規則が尺度を持たないことの表)
//   E 走行: G 系(7 本 × G_loc なし・受け手 n 格子・対称 n 格子 + −6 × K1 なし × h・h/2〔外惑星は h/4 も〕)・K 系(🌡️🏀💙 × 受け手 n 格子 × K1 あり × h〔n = 2・−3 は h/2 も〕)・
//     H 系(🌡️ の写しの惑星の質量を木星の 1・10・100 倍 × q00・q10・q01・q11 × h・h/2 —— 有限質量比 η を振る)
//   K 数値の表(G_loc の分 ÷ q_1PN と解析の差・n = 0 と G_loc なしのビット同一・在位の宣言とのビット同一・K1 の分の n による変化〔加法性〕・候補の残差)
//   H η の表 / S スケールの読み((iii) 回る枠の座標回転・(iv) m/r² の座標則・(v) 1PN と K1 の大きさと物差し —— 純粋な積分器の f(e))/ Z 土星の環の候補の表
//   X 補足 1(原仮定者の補足(2026-11-09)「太陽–水星における G_loc と回転引きずりの組み合わせを調査する」—— 今の組〔G_loc n = 2 + K1〕を基準に、K1 の分を回転引きずりとして読む型の
//     一次の分担〔(i) K1 の並進とその接線・動径の分解・(ii) 太陽の自転・(iii) 水星の公転の回る枠・(iv) 太陽–木星の回る枠・(v) 座標則〕と要る長さ)・W 今のエンジンの回転と軸の引きずり
//     (spinDrag)の写しの 1 公転の状態のビットの比べ(🌡️)/ V 補足 2(「K1 の R_d は有効性が認められる場合は使用する。有効な例と有効で無い例をリスト化する」—— 既存の正本と本枝の表から)
// ■ 試走: W331C_QUICK=1(W331C_OUT が要る —— 正本を書かない)。再開: W331C_CACHE=<dir>(走行 1 本ごとの結果を逐次書く)。
// ■ 言わないこと: 水星の近点・K1 のスケール・土星の環について結論の語(PHYSICS〔第331便c〕⑫ と docs.k1Scale331c の書かない語)を使わない —— 宣言した型で表の値になった・残差・候補の表と書く。
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import crypto from 'node:crypto';
import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { loadHtmlMain } from './lib-w280b-emgrid.mjs';
import { provenanceMeta } from './lib-w272e-provenance.mjs';
import { scopeStamp as w281aScopeStamp, stableInputs as w281aStableInputs } from './lib-w281a-scope.mjs';
import * as AN from './lib-w306a-an336.mjs';
import * as P3 from './lib-w299c-planets3d.mjs';
import * as Q from './lib-w311d-planet3.mjs';
import * as PL3 from './exp-w311d-planet3.mjs';
import * as IK from './exp-w315c-inposk1.mjs';
import * as L from './lib-w331c-k1scale.mjs';
// 第281便a の領域 hash の宣言(版 8 —— 器と lib と import の閉包から deriveScope で引いた下限 ∪ 第315便c の器の宣言の本。器が引く本は在位の 7 本と 💍 saturnRingReal〔.find で引く〕。
//   第315便c の器と同じく familyRole を読む lib が閉包にある〔keepProse〕・A/B の語を読む器が閉包にある〔abBody は宣言しない〕・エンジンを走らせる〔core〕)
const REGEN_SCOPE = {"presets":["earthMoonSunInertial3d","earthMoonSunInertialFit","jupiterGalilean","jupiterSunInertial3d","marsMoonsReal","marsSunInertial3d","mercury","mercuryReal","mercurySunInertial3d","mercurySunInertialFit","neptuneReal","neptuneSunInertial3d","saturn","saturnRingReal","saturnSunInertial3d","uranusReal","uranusSunInertial3d","venusReal","venusSunInertial3d"],"roots":["$","DT","FIT_COND_KEYS","FIT_COND_VERSION","FIT_KNOB_KEYS","FIT_NUMERICS_KEYS","FIT_RECORD_KEYS","FIT_RECORD_VERSION","FIT_RECORD_VERSIONS","FIT_RESIDUAL_KEYS","FIT_TARGET_KEYS","FIT_TOL_KEYS","HP.FIT_COND_VERSION","HP.REL_DRAG_INVSQ_VERSION","HP.allPresets","HP.coord3d","HP.dfmMeshVelocityFieldAt","HP.fitCondSig","HP.inertialDragIsqState","HP.inertialDragState","HP.sim","HP.validateFitRecord","HP.validatePreset","IN_POSITION_K1_IDS","IN_POSITION_K1_VERSION","T","ab","ch","ctx","cw","dfmGaussLegendre01","dfmInertialDragStep","dragCoreAngular","dragCoreAvgK","dragCoreLookup","dragCoreTableBuild","fmt","gLocPeriAdvance","inPositionK1Of","inPositionK1State","inertialDragNormApply","invSqEngineMass","invSqKappa0","pnSource","relDragCoefficientOf","validateFitRecord"],"core":true,"consts":[],"complete":true,"keepProse":["familyRole"]};

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
export const HARNESS_VERSION = 'w331c-k1scale-1';
export const OUT_MAIN = 'tests/out/k1scale-w331c.json';
export const INPOS_OUT = IK.OUT_MAIN;   // 正本 tests/out/inposk1-w315c.json(段 R —— 在位の本の分担の比)
/** 補足 2 の一覧が読む正本(段 V —— 鎖の after に連ねる) */
export const VALID_INPUTS = Object.freeze({ k1confirm: 'tests/out/k1confirm-w313d.json', k1outer: 'tests/out/k1outer-w314c.json', k1em: 'tests/out/k1em-w314c.json', satk1: 'tests/out/satk1-w315d.json',
  binbooks: 'tests/out/binbooks-w322b.json', rdexcess: 'tests/out/rdexcess-w314a.json' });
/** 今のエンジンの回転と軸の引きずり(第311便d の NEW_DRAG の spinDrag —— 第313便d の確認の系の q11 と同じ宣言)を在位の写しに足す */
export const SPIN_DRAG = Object.freeze({ rot: 'surfaceFlip', axial: 'on', axialModel: 'bevel', initSpin: 'observed' });
const IS_MAIN = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
const clone = (x) => JSON.parse(JSON.stringify(x));
const ARCSEC = 180 / Math.PI * 3600;
export const NOT_CLAIM = Object.freeze(['G_loc だけで水星の近点の値になる宣言は一次の候補の表(n と K1 の分の扱いは次の報の決断 —— 在位は変えない)', '在位の水星の近点は G_loc(逆行)と K1 の引きずり(順行)の和',
  'K1 の R_d のスケールの読みは複数を並べた表(どれかを採らない)', '土星の環の厚みとの関連は候補の表(偶然の一致の可能性を同じ表に)', '文献の値は一次資料に当たっていない',
  'ポテンシャルの微分の型・m/r² の座標則・回る枠の座標回転は宣言(未接続 —— 今のエンジンに無い型)', '数値の帯は刻みの感度で、観測の 3σ ではない']);
/** 器の宣言(走行の前に置く —— 結果を見て変えない) */
export const PLAN = Object.freeze({
  N: 8, divs: Object.freeze([1, 2]), outerDivs: Object.freeze([1, 2, 4]),
  gBooks: Object.freeze(IK.BOOKS.map((b) => b.key)),
  kBooks: Object.freeze(['mercury', 'jupiter', 'neptune']), kNFine: Object.freeze([2, -3]),
  etaBook: 'mercury', etaScales: Object.freeze([1, 10, 100]), etaKinds: Object.freeze(['q00', 'q10', 'q01', 'q11']), etaDivs: Object.freeze([1, 2]),
  spinBook: 'mercury', spinOrbits: 1,
});
export const QUICK_PLAN = Object.freeze({
  N: 1, divs: Object.freeze([1]), outerDivs: Object.freeze([1]), gBooks: Object.freeze(['mercury']), kBooks: Object.freeze(['mercury']), kNFine: Object.freeze([]),
  etaBook: 'mercury', etaScales: Object.freeze([10]), etaKinds: Object.freeze(['q00', 'q10', 'q01', 'q11']), etaDivs: Object.freeze([1]),
  spinBook: 'mercury', spinOrbits: 1,
});
/** G_loc の宣言の列(null = G_loc なし) */
export function glList() {
  const out = [null];
  for (const n of L.DECL.nGrid) out.push({ n, pair: 'receiver' });
  for (const n of L.DECL.nGrid.concat(L.DECL.nSymExtra)) out.push({ n, pair: 'symmetric' });
  return out;
}
export const glKey = (g) => (g ? g.pair[0] + String(g.n) : 'none');
export const specKey = (s) => s.set === 'W' ? ['W', s.book, s.variant, 'orbits=' + s.orbits].join('|') : s.set === 'H' ? ['H', s.book, 'x' + s.scale, s.kind, 'div=' + s.div, 'N=' + s.N].join('|') : [s.set, s.book, glKey(s.gl), s.k1 ? 'K1' : 'noK1', 'div=' + s.div, 'N=' + s.N].join('|');
const divsOf = (k, P) => (IK.OUTER_KEYS.includes(k) ? P.outerDivs : P.divs);

/* ───────── 写しの本 ───────── */
const liveOf = (HP, id) => { const p = HP.allPresets().find((q) => q.id === id); if (!p) throw new Error('本が無い: ' + id); return p; };
/** G・K 系の写し: G_loc を {law:"cLocPow", n, pair} にする(null は外す)・K1 なしは引きずりを外す(第311便d の OFF_DRAG)。他は在位の本のまま */
export function copyBook(p, gl, k1) {
  const q = clone(p);
  delete q.fitRecord; delete q.abBody;
  if (gl === null) delete q.physics.gLoc; else q.physics.gLoc = { law: 'cLocPow', n: gl.n, pair: gl.pair };
  if (!k1) q.physics.relativeDrag = clone(Q.OFF_DRAG);
  return q;
}
/** H 系の写し: 🌡️ の惑星の質量を mNew(本の単位)へ —— 相対の速度を √((M+m')/(M+m)) 倍して接触要素を保ち、重心を原点・全運動量 0 に置き直す */
export function etaBook(p, mNew) {
  const q = clone(p);
  delete q.fitRecord; delete q.abBody;
  const S = q.bodies[0], B = q.bodies[1], M = S.m, m0 = B.m, f = Math.sqrt((M + mNew) / (M + m0)), tot = M + mNew;
  const r = ['x', 'y', 'z'].map((k) => (B[k] || 0) - (S[k] || 0)), v = ['vx', 'vy', 'vz'].map((k) => ((B[k] || 0) - (S[k] || 0)) * f);
  ['x', 'y', 'z'].forEach((k, i) => { S[k] = -mNew / tot * r[i]; B[k] = M / tot * r[i]; });
  ['vx', 'vy', 'vz'].forEach((k, i) => { S[k] = -mNew / tot * v[i]; B[k] = M / tot * v[i]; });
  B.m = mNew;
  return q;
}
/** H 系の木星の質量(🌡️ の本の単位 —— 🏀 の本の SI の質量を換算) */
export const mJupiterInMercuryUnits = (HP) => { const pj = liveOf(HP, 'jupiterSunInertial3d'), pm = liveOf(HP, 'mercurySunInertial3d'); return pj.bodies[1].m * Math.pow(10, pj.scaleExp.M - pm.scaleExp.M); };
export function bookOfSpec(HP, sp) {
  const b = IK.bookOf(sp.book), p = liveOf(HP, b.id);
  if (sp.set === 'H') {
    const q = etaBook(p, sp.scale * mJupiterInMercuryUnits(HP)), k = Q.KINDS[sp.kind];
    if (!k.gLoc) delete q.physics.gLoc;
    if (!k.drag) q.physics.relativeDrag = clone(Q.OFF_DRAG);
    return { p, q };
  }
  return { p, q: copyBook(p, sp.gl, sp.k1) };
}
const hOf = (p) => P3.stepsOf(p.timeRef.pRef).h;
/** W 系: 在位の写し(n = 2 の受け手 + K1)に spinDrag を足すか足さないかで 1 公転の状態(位置・速度・自転)を返す */
export function runSpinCheck(HP, sp) {
  const p = liveOf(HP, IK.bookOf(sp.book).id), q = copyBook(p, { n: 2, pair: 'receiver' }, true);
  if (sp.variant === 'spin') q.physics.relativeDrag.spinDrag = clone(SPIN_DRAG);
  const v = HP.validatePreset(clone(q));
  if (!v.ok) return { key: specKey(sp), spec: sp, status: 'rejected', err: JSON.stringify(v.errors).slice(0, 300) };
  const h = hOf(p), steps = Math.round(sp.orbits * p.timeRef.pRef / h), S = HP.coord3d.makeSim(), t0 = Date.now();
  S.build(clone(v.preset));
  for (let k = 0; k < steps; k++) S.step(h);
  const st = []; for (let i = 0; i < 2; i++) st.push(S.x[i], S.y[i], S.z[i], S.vx[i], S.vy[i], S.vz[i]);
  const sp2 = []; for (let i = 0; i < 2; i++) sp2.push(S.spin ? S.spin[i] : null);
  return { key: specKey(sp), spec: sp, status: 'run', h, steps, state: st, spin: sp2, spinDragDecl: !!(v.preset.physics.relativeDrag && v.preset.physics.relativeDrag.spinDrag), complete: true, nan: st.some((x) => !Number.isFinite(x)), apsNew: 0, wallSec: (Date.now() - t0) / 1000 };
}
/** 1 本の走行 */
export function runSpec(HP, sp) {
  if (sp.set === 'W') return runSpinCheck(HP, sp);
  const { p, q } = bookOfSpec(HP, sp), h = hOf(p), v = HP.validatePreset(clone(q));
  if (!v.ok) return { key: specKey(sp), spec: sp, status: 'rejected', err: JSON.stringify(v.errors).slice(0, 300) };
  const r = PL3.measure(HP, q, h / sp.div, sp.N);
  const out = Object.assign({ key: specKey(sp), spec: sp, status: 'run', h, dt: h / sp.div, warnings: (v.warnings || []).length }, r);
  if (sp.set === 'H') { const pn = AN.pn1Of(q); out.q1pn = pn.value; out.eta = L.etaOf(q.bodies[0].m, q.bodies[1].m); }
  return out;
}
function makePool(NW, self) {
  let active = 0; const qu = [];
  const pump = () => { qu.sort((a, b) => b.pri - a.pri); while (active < NW && qu.length) { const { sps, res, rej } = qu.shift(); active++;
    const child = spawn(process.execPath, ['--max-old-space-size=6144', self, '--child', JSON.stringify(sps)], { cwd: ROOT, env: process.env });
    let out = '', err = '';
    child.stdout.on('data', (d) => { out += d; }); child.stderr.on('data', (d) => { err += d; });
    child.on('close', (code) => { active--; pump(); if (code !== 0) return rej(new Error(specKey(sps[0]) + ': ' + err.slice(0, 600)));
      try { res(JSON.parse(out.slice(out.lastIndexOf('\n[') + 1))); } catch (e) { rej(new Error(specKey(sps[0]) + ': 出力が JSON でない ' + out.slice(-200))); } }); } };
  return (sps, pri = 0) => new Promise((res, rej) => { qu.push({ sps, res, rej, pri }); pump(); });
}
function cachedBatch(run, dir, scopeSha256, stat) {
  const fileOf = (sp) => dir ? path.join(dir, crypto.createHash('sha256').update(HARNESS_VERSION + '|' + scopeSha256 + '|' + specKey(sp)).digest('hex').slice(0, 32) + '.json') : null;
  if (dir) fs.mkdirSync(dir, { recursive: true });
  const read = (sp) => { const f = fileOf(sp); if (!f) return null; try { const c = JSON.parse(fs.readFileSync(f, 'utf8')); if (c.version === HARNESS_VERSION && c.scopeSha256 === scopeSha256 && c.row && c.row.key === specKey(sp)) return c.row; } catch (e) { /* 無い */ } return null; };
  const write = (r) => { const f = fileOf(r.spec); if (!f) return; const tmp = f + '.tmp'; fs.writeFileSync(tmp, JSON.stringify({ version: HARNESS_VERSION, scopeSha256, row: r })); fs.renameSync(tmp, f); };
  return async (sps, pri) => {
    const have = sps.map(read), todo = sps.filter((sp, i) => !have[i]);
    stat.resumed += sps.length - todo.length;
    const got = todo.length ? await run(todo, pri) : [];
    got.forEach(write);
    return sps.map((sp, i) => have[i] || got.find((r) => r.key === specKey(sp)));
  };
}

/* ───────── 段 P(t = 0 の印字)───────── */
export function probeOf(HP, ev = (x) => vm.runInThisContext(x)) {
  const inPos = ev('inPositionK1Of'), out = { systems: {}, saturn: null };
  for (const b of IK.BOOKS) {
    const p = liveOf(HP, b.id), s = inPos(p), pn = AN.pn1Of(p), Lm = Math.pow(10, p.scaleExp.L), Mm = Math.pow(10, p.scaleExp.M), Tm = Math.pow(10, p.scaleExp.T);
    const M = p.bodies[0].m * Mm, m = p.bodies[1].m * Mm, G = p.physics.G * Lm ** 3 / (Mm * Tm * Tm), c = p.physics.cLight * Lm / Tm;
    out.systems[b.key] = { id: b.id, emoji: b.emoji, ja: b.ja, M, m, G, c, eta: L.etaOf(M, m), q1pn: pn.value, aSI: pn.a * Lm, e: pn.e, PSI: pn.P * Tm, h: hOf(p),
      Rsun: p.bodies[0].radius * Lm, Rplanet: p.bodies[1].radius * Lm, rdSun: s.bodies[0].rd * Lm, rdPlanet: s.bodies[1].rd * Lm, rdRule: s.rdRule, kernel: s.kernel, gLoc: s.gLoc,
      gLocDecl: clone(p.physics.gLoc || null), gLocN: (p.physics.gLoc && p.physics.gLoc.law === 'kappaC2') ? 2 : null, gLocPair: (p.physics.gLoc && p.physics.gLoc.pair) || 'receiver(既定)',
      OmSun: p.bodies[0].spin / Tm, sunTiltDeg: p.bodies[0].spinAxis ? p.bodies[0].spinAxis.tiltDeg : null };
  }
  // 🟡 と 💍 の宣言の値(読むだけ)
  const ps = liveOf(HP, 'saturnSunInertial3d'), pr = liveOf(HP, 'saturnRingReal'), sS = inPos(ps);
  const LS = Math.pow(10, ps.scaleExp.L), MS = Math.pow(10, ps.scaleExp.M), LR = Math.pow(10, pr.scaleExp.L), MR = Math.pow(10, pr.scaleExp.M), TR = Math.pow(10, pr.scaleExp.T);
  const rings = pr.bodies.filter((z) => z.type === 'ring').map((z) => ({ rIn: z.rIn * LR, rOut: z.rOut * LR, n: z.n, m: z.mMin * MR, mMax: z.mMax * MR }));
  const sat0 = pr.bodies[0];
  out.saturn = { sunInertial: { id: ps.id, mSat: ps.bodies[1].m * MS, RSat: ps.bodies[1].radius * LS, rdSat: sS.bodies[1].rd * LS, drag: clone(ps.physics.relativeDrag), gLoc: clone(ps.physics.gLoc || null) },
    ring: { id: pr.id, mSat: sat0.m * MR, RSat: sat0.radius * LR, spin: sat0.spin / TR, pinned: !!sat0.pinned, kFrame: pr.physics.kFrame, coord: pr.physics.coord || '2d', geoPN: pr.physics.geoPN,
      drag: pr.physics.relativeDrag ? clone(pr.physics.relativeDrag) : null, gLoc: pr.physics.gLoc ? clone(pr.physics.gLoc) : null, j2: sat0.j2 ? clone(sat0.j2) : null, rings } };
  return out;
}

/* ───────── 段 A(解析の一次)───────── */
export function partA(P) {
  const sys = IK.BOOKS.map((b) => ({ key: b.key, q1pn: P.systems[b.key].q1pn, eta: P.systems[b.key].eta }));
  const typeRows = [2, 1, 0, -1, -2, -3].map((n) => ({ n, force: L.gLocShare(n), potential: L.gLocSharePotential(n), forceSym: L.gLocShare(n, 'symmetric'), potentialSym: L.gLocSharePotential(n, 'symmetric') }));
  return { table: L.gLocTable(sys), candidates: L.CANDIDATES.map((c) => clone(c)), candidateRows: L.candidateTable(sys), typeRows,
    nForPN: { recNoK1: L.nForPN({ k1: false }), recK1: L.nForPN({ k1: true }), symNoK1: L.nForPN({ pair: 'symmetric', k1: false }), symK1: L.nForPN({ pair: 'symmetric', k1: true }), potRecNoK1: L.nForPN({ k1: false, type: 'potential' }),
      byPlanetRecNoK1: Object.fromEntries(sys.map((s) => [s.key, L.nForPN({ k1: false, eta: s.eta })])) } };
}

/* ───────── 段 R(正本の比 —— 規則が尺度を持たないことの表)───────── */
export function partR(P, root = ROOT) {
  let J = null; try { J = JSON.parse(fs.readFileSync(path.join(root, INPOS_OUT), 'utf8')); } catch (e) { J = null; }
  if (!J || !J.K) return { missing: true };
  const out = { source: INPOS_OUT, sourceVersion: J.version, systems: {} };
  for (const b of IK.BOOKS) {
    const K = J.K.systems[b.key], T = J.T[b.key], eta = T.eta;
    const rows = {};
    for (const [d, z] of Object.entries(K.byDiv)) rows[d] = { DGq: z.DG / T.q1pn, dqGq: z.dqG / T.q1pn, r: z.r1pn, DGdev: z.DG / T.q1pn - L.k1Share(), dqGdev: z.dqG / T.q1pn - L.gLocShare(2, 'receiver', eta), q: clone(z.q) };
    out.systems[b.key] = { q1pn: T.q1pn, eta, fm: T.fm, fine: K.fine, rows, aDG: L.k1Share(), adqG: L.gLocShare(2, 'receiver', eta) };
  }
  return out;
}

/* ───────── 段 E(走行の計画)───────── */
export function specsOf(P) {
  const G = [], K = [], H = [];
  for (const k of P.gBooks) for (const d of divsOf(k, P)) for (const gl of glList()) G.push({ set: 'G', book: k, gl, k1: false, div: d, N: P.N });
  for (const k of P.kBooks) {
    for (const n of L.DECL.nGrid) K.push({ set: 'K', book: k, gl: { n, pair: 'receiver' }, k1: true, div: 1, N: P.N });
    for (const n of P.kNFine) K.push({ set: 'K', book: k, gl: { n, pair: 'receiver' }, k1: true, div: 2, N: P.N });
  }
  for (const s of P.etaScales) for (const kind of P.etaKinds) for (const d of P.etaDivs) H.push({ set: 'H', book: P.etaBook, scale: s, kind, div: d, N: P.N });
  const Wsp = ['nospin', 'spin'].map((variant) => ({ set: 'W', book: P.spinBook, variant, orbits: P.spinOrbits }));
  return { G, K, H, W: Wsp };
}

/* ───────── 段 K(数値の表)───────── */
const rowOf = (J, sp) => J.E.rows[specKey(sp)];
const qOf = (J, sp) => { const r = rowOf(J, sp); return r && r.status === 'run' ? r.apsNew : null; };
export function partK(J) {
  const P = J.plan, out = { g: {}, k: {}, cand: {}, bits: { n0: { n: 0, same: 0 }, canon: { n: 0, same: 0, rows: [] } } };
  let IKJ = null; try { IKJ = JSON.parse(fs.readFileSync(path.join(ROOT, INPOS_OUT), 'utf8')); } catch (e) { IKJ = null; }
  for (const k of P.gBooks) {
    const S = J.P.systems[k], o = { byDiv: {} };
    for (const d of divsOf(k, P)) {
      const base = { set: 'G', book: k, k1: false, div: d, N: P.N }, q00 = qOf(J, Object.assign({}, base, { gl: null }));
      const rows = {};
      for (const gl of glList()) {
        if (gl === null) continue;
        const q = qOf(J, Object.assign({}, base, { gl })), g = q - q00, a = L.gLocShare(gl.n, gl.pair, S.eta) * S.q1pn;
        rows[glKey(gl)] = { n: gl.n, pair: gl.pair, q, gMeas: g, gShare: g / S.q1pn, gAnalytic: a, dev: g - a, devShare: (g - a) / S.q1pn, resid: q - q00 - S.q1pn };
        if (gl.n === 0) { out.bits.n0.n++; if (Object.is(q, q00)) out.bits.n0.same++; }
        if (gl.n === 2 && gl.pair === 'receiver' && IKJ) {
          const c = IKJ.E.rows[IK.specKey({ book: k, kind: 'q10', div: d, N: P.N })];
          if (c && c.status === 'run') { out.bits.canon.n++; const same = Object.is(c.apsNew, q); if (same) out.bits.canon.same++; out.bits.canon.rows.push({ book: k, kind: 'q10', div: d, same, diff: q - c.apsNew }); }
          const c0 = IKJ.E.rows[IK.specKey({ book: k, kind: 'q00', div: d, N: P.N })];
          if (c0 && c0.status === 'run') { out.bits.canon.n++; const same = Object.is(c0.apsNew, q00); if (same) out.bits.canon.same++; out.bits.canon.rows.push({ book: k, kind: 'q00', div: d, same, diff: q00 - c0.apsNew }); }
        }
      }
      o.byDiv[d] = { q00, rows };
    }
    const ds = Object.keys(o.byDiv).map(Number).sort((a, b) => a - b);
    o.fine = ds[ds.length - 1];
    o.band = {};   // 刻みの帯(最も細かい 2 つの刻みの G_loc の分の差 —— 宣言ごと)
    if (ds.length >= 2) { const f = o.byDiv[ds[ds.length - 1]].rows, c = o.byDiv[ds[ds.length - 2]].rows; for (const key of Object.keys(f)) o.band[key] = Math.abs(f[key].gMeas - c[key].gMeas); }
    out.g[k] = o;
  }
  // K1 の分の n による変化(加法性)—— D_G(n) = q(n, K1) − q(n, K1 なし)(同じ刻み)
  for (const k of P.kBooks) {
    const S = J.P.systems[k], o = { byDiv: {} };
    for (const d of [1, 2]) {
      const rows = {};
      for (const n of L.DECL.nGrid) {
        const gl = { n, pair: 'receiver' }, qk = qOf(J, { set: 'K', book: k, gl, k1: true, div: d, N: P.N }), q0 = qOf(J, { set: 'G', book: k, gl, k1: false, div: d, N: P.N }), q00 = qOf(J, { set: 'G', book: k, gl: null, k1: false, div: d, N: P.N });
        if (!Number.isFinite(qk) || !Number.isFinite(q0)) continue;
        rows['r' + n] = { n, qK1: qk, DG: qk - q0, DGshare: (qk - q0) / S.q1pn, total: qk - q00, totalShare: (qk - q00) / S.q1pn, resid: qk - q00 - S.q1pn };
      }
      if (Object.keys(rows).length) o.byDiv[d] = rows;
    }
    const d1 = o.byDiv[1];
    if (d1 && d1.r2) for (const z of Object.values(d1)) z.dDG = z.DG - d1.r2.DG;   // 加法性: n = 2 の D_G との差
    if (o.byDiv[2] && o.byDiv[2].r2 && d1 && d1.r2) o.bandDG = Math.abs(o.byDiv[2].r2.DG - d1.r2.DG);
    // 在位の正本の q11 とのビット同一(写し cLocPow n = 2 + K1 ↔ 在位の本 kappaC2 + K1)
    if (IKJ) for (const d of [1, 2]) { const z = o.byDiv[d] && o.byDiv[d].r2, c = IKJ.E.rows[IK.specKey({ book: k, kind: 'q11', div: d, N: P.N })];
      if (z && c && c.status === 'run') { out.bits.canon.n++; const same = Object.is(c.apsNew, z.qK1); if (same) out.bits.canon.same++; out.bits.canon.rows.push({ book: k, kind: 'q11', div: d, same, diff: z.qK1 - c.apsNew }); } }
    out.k[k] = o;
  }
  // 候補の残差(数値 —— 最も細かい刻み): A 今(写しの n = 2 + K1)・B 受け手 n = −3 K1 なし・C 対称 n = −6 K1 なし・D 受け手 n = −3 + K1(K 系の本だけ)
  for (const k of P.gBooks) {
    const S = J.P.systems[k], G1 = out.g[k], f = G1.fine, r = G1.byDiv[f].rows, K1 = out.k[k];
    const kd = K1 && K1.byDiv[2] ? 2 : 1, kf = K1 && K1.byDiv[kd];
    out.cand[k] = { fine: f, B: { resid: r['r-3'].resid, analytic: L.fmShare({ n: -3, eta: S.eta }) * S.q1pn, band: G1.band['r-3'] ?? null },
      C: { resid: r['s-6'].resid, analytic: 0, band: G1.band['s-6'] ?? null },
      A: kf && kf.r2 ? { resid: kf.r2.resid, analytic: L.fmShare({ n: 2, eta: S.eta }) * S.q1pn, div: kd } : null,
      D: kf && kf['r-3'] ? { resid: kf['r-3'].resid, analytic: (L.totalShare({ n: -3, eta: S.eta }) - 1) * S.q1pn, div: kd } : null };
  }
  return out;
}

/* ───────── 段 H(η の表)───────── */
export function partH(J) {
  const P = J.plan, out = { rows: [] };
  for (const s of P.etaScales) for (const d of P.etaDivs) {
    const q = {}; let q1pn = null, eta = null;
    for (const kind of P.etaKinds) { const r = rowOf(J, { set: 'H', book: P.etaBook, scale: s, kind, div: d, N: P.N }); q[kind] = r && r.status === 'run' ? r.apsNew : null; if (r) { q1pn = r.q1pn; eta = r.eta; } }
    if (![q.q00, q.q10, q.q01, q.q11].every(Number.isFinite)) continue;
    const g = q.q10 - q.q00, k = q.q01 - q.q00, I = q.q11 - q.q10 - q.q01 + q.q00, r = q.q11 - q.q00 - q1pn;
    out.rows.push({ scale: s, div: d, eta, q1pn, q, gShare: g / q1pn, gShareA: L.gLocShare(2, 'receiver', eta), kShare: k / q1pn, kShareA: L.k1Share(), I, IShare: I / q1pn, r, rShare: r / q1pn, fm: L.fmShare({ n: 2, eta }) * q1pn,
      rAfterFm: r - L.fmShare({ n: 2, eta }) * q1pn, bRecNoK1: (L.fmShare({ n: -3, eta })) * q1pn });
  }
  // 刻みの帯(同じ質量の h と h/2)
  for (const z of out.rows) { const o = out.rows.find((y) => y.scale === z.scale && y.div !== z.div); if (o) { z.bandG = Math.abs(z.gShare - o.gShare) * z.q1pn; z.bandK = Math.abs(z.kShare - o.kShare) * z.q1pn; z.bandR = Math.abs(z.r - o.r); } }
  return out;
}

/* ───────── 段 S(K1 のスケールの読み)───────── */
export function partS(J) {
  const P = J.P, out = { rows: [], vortexF: {}, J: null };
  const pj = P.systems.jupiter, OmJ = 2 * Math.PI / pj.PSI;
  const fOf = (e) => L.apsidalNumeric({ e, mode: 'vortex' }).ratio;   // 渦の型の離心率の補正(純粋な積分器)
  const perCent = (s) => 36525 * 86400 / s.PSI * ARCSEC;   // rad/公転 → ″/世紀
  for (const b of IK.BOOKS) {
    const s = P.systems[b.key], p = s.aSI * (1 - s.e * s.e), mu = s.G * (s.M + s.m), b1 = L.k1B(s.M, s.m, s.G, s.c);
    const k1Adv = L.advK1(b1, p) * perCent(s);
    // (iii) 回る枠の座標回転(太陽が木星の周期で重心の周り —— Ω_J × r に重み M/r²・自己の重み W = m/(R² H₂))
    const f = fOf(s.e); out.vortexF[b.key] = f;
    const gamOf = (R) => (s.M / L.selfW2(s.m, R)) * OmJ;
    const vAdv = (Gam) => L.advVortexCirc(Gam, mu, s.aSI) * f * perCent(s);
    // (iv) m/r² の座標則の並進(β = b₂/r²・相対の軌道 —— 両方が受け手)
    const b2Of = (Rp, Rs) => s.M / L.selfW2(s.m, Rp) + s.m / L.selfW2(s.M, Rs);
    const r2Adv = (b2) => L.advR2(b2, p) * perCent(s);
    out.rows.push({ key: b.key, aSI: s.aSI, e: s.e, pSI: p, q1pn: s.q1pn, eta: s.eta, b1, k1Adv, k1Share: k1Adv / s.q1pn,
      eps1pn: L.eps1PN(s.M, s.aSI, s.G, s.c), betaK1: L.betaK1(s.M, s.aSI, s.G, s.c), mutualFrac: s.m / (s.M + s.m), fm: L.fmShare({ n: 2, eta: s.eta }) * s.q1pn,
      gate: Math.min(IK.EPS.fit, 1e-2 * Math.abs(s.q1pn)), k1OverGate: k1Adv / Math.min(IK.EPS.fit, 1e-2 * Math.abs(s.q1pn)),
      vortexF: f, gamRd: gamOf(s.rdPlanet), gamObs: gamOf(s.Rplanet), vAdvRd: vAdv(gamOf(s.rdPlanet)), vAdvObs: vAdv(gamOf(s.Rplanet)),
      b2Rd: b2Of(s.rdPlanet, s.rdSun), b2Obs: b2Of(s.Rplanet, s.Rsun), r2AdvRd: r2Adv(b2Of(s.rdPlanet, s.rdSun)), r2AdvObs: r2Adv(b2Of(s.Rplanet, s.Rsun)) });
  }
  // 木星で合わせる(係数を木星で K1 の分に合わせ、距離の形だけで他へ)
  const rj = out.rows.find((z) => z.key === 'jupiter'), sj = P.systems.jupiter, muJ = sj.G * (sj.M + sj.m);
  const gamMatch = -rj.k1Adv / (L.advVortexCirc(1, muJ, sj.aSI) * rj.vortexF * (36525 * 86400 / sj.PSI * ARCSEC));   // 木星で |渦の分| = K1 の分(Γ < 0 = 公転と逆向きの枠の回転で順行)
  for (const z of out.rows) {
    const s = P.systems[z.key], mu = s.G * (s.M + s.m);
    z.vAdvMatch = L.advVortexCirc(gamMatch, mu, s.aSI) * z.vortexF * (36525 * 86400 / s.PSI * ARCSEC);
    z.vRatioMatch = z.vAdvMatch / z.k1Adv;
    z.r2RatioMatch = rj.pSI / z.pSI;   // b₂/b₁ を木星で合わせた距離の形(2πb₂/p² ÷ πb₁/p ∝ 1/p)
    z.vRatioRd = z.vAdvRd / z.k1Adv; z.vRatioObs = z.vAdvObs / z.k1Adv; z.r2RatioRd = z.r2AdvRd / z.k1Adv; z.r2RatioObs = z.r2AdvObs / z.k1Adv;
  }
  out.J = { OmJ, gamMatch, sunAroundBary: sj.aSI * sj.m / (sj.M + sj.m), vSun: OmJ * sj.aSI * sj.m / (sj.M + sj.m) };
  return out;
}

/* ───────── 段 Z(土星の環の候補)───────── */
export function partZ(J) {
  const Z = J.P.saturn, sr = Z.ring, M = Z.sunInertial.mSat, G = J.P.systems.saturn.G, c = J.P.systems.saturn.c, GM = G * M, J2 = L.LIT.saturnJ2.value, R = L.LIT.saturnJ2.Rref;
  const [Cr, Br, Ar] = sr.rings;
  const pts = [{ label: 'C 内縁', r: Cr.rIn }, { label: 'C/B 境', r: Cr.rOut }, { label: 'B 外縁', r: Br.rOut }, { label: 'A 内縁', r: Ar.rIn }, { label: 'A 外縁', r: Ar.rOut }];
  const Lg = L.ringLengths({ M, G, c }), Rd = Z.sunInertial.rdSat;
  return { lengths: Lg, rdBook: Rd, rdRel: (Rd - Lg.Rd) / Lg.Rd, pts, cand: L.ringCandidates({ pts, Rd, GM, J2, R, spin: sr.spin }), lit: clone(L.LIT), GM, J2, R,
    others: ['jupiter', 'uranus', 'neptune'].map((k) => ({ key: k, rd: J.P.systems[k].rdPlanet })) };
}

/* ───────── 段 W・X(補足 1 —— 回転引きずりの型)───────── */
export function partW(J) {
  const P = J.plan, a = rowOf(J, { set: 'W', book: P.spinBook, variant: 'nospin', orbits: P.spinOrbits }), b = rowOf(J, { set: 'W', book: P.spinBook, variant: 'spin', orbits: P.spinOrbits });
  if (!(a && b && a.status === 'run' && b.status === 'run')) return { missing: true };
  const nDiff = a.state.filter((x, i) => !Object.is(x, b.state[i])).length, dMax = Math.max(...a.state.map((x, i) => Math.abs(x - b.state[i])));
  return { book: P.spinBook, orbits: P.spinOrbits, steps: a.steps, nState: a.state.length, nDiff, bitSame: nDiff === 0, dMax, spinDiff: a.spin.map((x, i) => b.spin[i] - x), spinDragDecl: [a.spinDragDecl, b.spinDragDecl], share: nDiff === 0 ? 0 : null };
}
export function partX(J) {
  const P = J.P, OmSun = P.systems.mercury.OmSun, OmJ = 2 * Math.PI / P.systems.jupiter.PSI, cache = new Map(), out = { OmSun, OmJ, systems: {}, scale: {} };
  for (const b of IK.BOOKS) out.systems[b.key] = L.rotCandidates(P.systems[b.key], { OmSun, OmJ, engine: b.key === J.plan.spinBook ? J.W : null, cache });
  // 水星で要る倍率 λ を他の惑星へ(同じ λR_d —— 尺度を持つか)
  const M = out.systems.mercury;
  for (const id of ['v-t', 'v-orb']) {
    const lam = (M.rows.find((z) => z.id === id) || {}).lambda;
    if (!lam) continue;
    out.scale[id] = { lambda: lam, rows: IK.BOOKS.map((b) => { const z = out.systems[b.key].rows.find((y) => y.id === id); return { key: b.key, share: z.shareRd * Math.pow(lam, z.p), factor: z.shareRd * Math.pow(lam, z.p) / L.DECL.k1Share }; }) };
  }
  return out;
}
/* ───────── 段 V(補足 2 —— K1 の R_d の有効な例・有効でない例・まだ判定していない例)───────── */
export function partV(J, root = ROOT) {
  const C = {};
  const rd = (f) => { try { return JSON.parse(fs.readFileSync(path.join(root, f), 'utf8')); } catch (e) { return null; } };
  C.inposk1 = rd(INPOS_OUT);
  for (const [k, f] of Object.entries(VALID_INPUTS)) C[k] = rd(f);
  C.rotMercury = J.X && J.X.systems.mercury; C.ringZ = J.Z;
  const missing = Object.keys(VALID_INPUTS).filter((k) => !C[k]);
  return { inputs: clone(VALID_INPUTS), missing, rows: L.validityRows(C), records: clone(L.VALID_RECORDS), galaxy: clone(L.GALAXY_PROBE) };
}

/* ───────── 門(器の自己点検)───────── */
export function gatesOf(J) {
  const g = {};
  g.pure = !!J.pure && Object.values(J.pure.gates).every(Boolean);
  if (J.P) g.declSame = IK.BOOKS.every((b) => { const s = J.P.systems[b.key]; return s && s.kernel === 'k1' && s.rdRule === 'kappaM' && s.gLoc === 'kappaC2' && s.gLocN === 2; })
    && J.P.saturn.ring.drag === null && J.P.saturn.ring.gLoc === null && J.P.saturn.sunInertial.drag.invSq.rdRule === 'kappaM';
  if (J.E) { const run = Object.values(J.E.rows); g.runsComplete = run.length > 0 && run.every((r) => r && r.status === 'run' && !r.nan && r.complete && Number.isFinite(r.apsNew)); }
  if (J.K) {
    g.n0Bitsame = J.K.bits.n0.n > 0 && J.K.bits.n0.same === J.K.bits.n0.n;
    g.canonBitsame = J.K.bits.canon.n > 0 && J.K.bits.canon.same === J.K.bits.canon.n;
    // G_loc の分 ÷ q_1PN の解析との差: 内側の 4 本は 1e-3 の内(数値の帯は 1e-5 の程度)
    g.gShareInner = ['mercury', 'venus', 'mars', 'jupiter'].filter((k) => J.K.g[k]).every((k) => Object.values(J.K.g[k].byDiv[J.K.g[k].fine].rows).every((z) => Math.abs(z.devShare) < 1e-3));
    // 加法性: K1 の分の n による変化は D_G の 1e-3 の内(水星・木星)
    g.additive = ['mercury', 'jupiter'].filter((k) => J.K.k[k] && J.K.k[k].byDiv[1]).every((k) => Object.values(J.K.k[k].byDiv[1]).every((z) => Math.abs(z.dDG) <= 1e-3 * Math.abs(J.K.k[k].byDiv[1].r2.DG)));
  }
  if (J.H) g.etaRows = J.H.rows.length > 0 && J.H.rows.every((z) => Math.abs(z.kShare - z.kShareA) < 1e-2 && Math.abs(z.gShare - z.gShareA) < 1e-2);
  if (J.S) g.scaleRows = J.S.rows.length === IK.BOOKS.length && J.S.rows.every((z) => Math.abs(z.k1Share - L.k1Share()) < 1e-2);
  if (J.Z) g.ringRows = J.Z.cand.length === 5 && Math.abs(J.Z.rdRel) < 1e-6;
  if (J.W) g.spinRuns = !J.W.missing && J.W.spinDragDecl[0] === false && J.W.spinDragDecl[1] === true;
  if (J.X) { const r = (id) => J.X.systems.mercury.rows.find((z) => z.id === id);
    g.rotK1 = Math.abs(r('i').shareRd - L.DECL.k1Share) < 1e-12 && Math.abs(r('i-tan').eFactor - 2) < 1e-4 && Math.abs(r('i-rad').eFactor + 1) < 1e-4 && Math.abs(r('i-spin').shareRd - L.DECL.k1Share) < 1e-3
      && r('ii').shareObs < 0 && r('iii').shareObs < 0 && r('iv').shareObs < 0 && r('v-t').shareObs > 0; }
  if (J.V) g.validRows = J.V.missing.length === 0 && J.V.rows.length >= 12 && ['valid', 'invalid', 'open'].every((c) => J.V.rows.some((z) => z.cls === c)) && J.V.rows.every((z) => z.yardstick && z.source);
  return g;
}

/* ───────── 走行の計画 ───────── */
export async function runAll(HP, o) {
  const P = o.plan, t = {}; let t0 = Date.now();
  const tick = (k) => { t[k] = { wallSec: (Date.now() - t0) / 1000 }; t0 = Date.now(); };
  const J = { quick: !!o.quick, plan: clone(P), libVersion: L.LIB_VERSION, decl: clone(L.DECL), glList: glList() };
  J.pure = { scenes: L.pureScenes() }; J.pure.gates = L.pureGates(J.pure.scenes); tick('pure');
  J.P = probeOf(HP); tick('P');
  J.A = partA(J.P); tick('A');
  J.R = partR(J.P); tick('R');
  const sp = specsOf(P), rows = {};
  const jobs = [];
  for (const s of sp.K) jobs.push([[s], 100 * s.div]);
  for (const s of sp.H) jobs.push([[s], (Q.KINDS[s.kind].drag ? 100 : 1) * s.div]);
  for (const s of sp.W) jobs.push([[s], 50]);
  const byBook = {}; for (const s of sp.G) (byBook[s.book + '|' + s.div] = byBook[s.book + '|' + s.div] || []).push(s);
  for (const arr of Object.values(byBook)) jobs.push([arr, 1]);
  await Promise.all(jobs.map(([sps, pri]) => o.run(sps, pri).then((rs) => { for (const r of rs) { rows[r.key] = r; o.log(r); } })));
  const all = sp.G.concat(sp.K, sp.H, sp.W);
  J.E = { N: P.N, rows: Object.fromEntries(all.map((s) => [specKey(s), rows[specKey(s)]])) }; tick('E');
  J.K = partK(J); tick('K');
  J.H = partH(J); tick('H');
  J.S = partS(J); tick('S');
  J.Z = partZ(J); tick('Z');
  J.W = partW(J); tick('W');
  J.X = partX(J); tick('X');
  J.V = partV(J); tick('V');
  J.gates = gatesOf(J); J.ok = Object.values(J.gates).every(Boolean); J.timing = t;
  const runs = Object.values(J.E.rows).filter((r) => r && r.status === 'run' && r.spec.set !== 'W');
  J.stats = { runs: runs.length, steps: runs.reduce((s, r) => s + r.steps, 0), cpuSec: runs.reduce((s, r) => s + (r.wallSec || 0), 0) };
  return J;
}

/* ───────── 実行 ───────── */
const argOf = (k) => { const i = process.argv.indexOf(k); return i >= 0 ? process.argv[i + 1] : null; };
export async function main() {
  const TARGET = process.env.W331C_TARGET || 'beta/index.html';
  if (process.argv.includes('--child')) {
    const sps = JSON.parse(argOf('--child'));
    const { HP } = loadHtmlMain(path.isAbsolute(TARGET) ? TARGET : path.join(ROOT, TARGET));
    process.stdout.write('\n' + JSON.stringify(sps.map((s) => runSpec(HP, s))) + '\n');
    return;
  }
  const quick = process.env.W331C_QUICK === '1';
  const OUT = process.env.W331C_OUT ? (path.isAbsolute(process.env.W331C_OUT) ? process.env.W331C_OUT : path.join(ROOT, process.env.W331C_OUT)) : path.join(ROOT, OUT_MAIN);
  if (quick && !process.env.W331C_OUT) throw new Error('試走(W331C_QUICK=1)は W331C_OUT を指定する(正本を書かない)');
  const html = path.isAbsolute(TARGET) ? TARGET : path.join(ROOT, TARGET);
  const t0 = Date.now(), targetSha256 = crypto.createHash('sha256').update(fs.readFileSync(html)).digest('hex');
  const W281A_SCOPE = w281aScopeStamp(html, REGEN_SCOPE);
  const { HP } = loadHtmlMain(html);
  const NW = Math.max(1, Number(process.env.W331C_WORKERS) || 2), cstat = { resumed: 0 };
  const run = cachedBatch(makePool(NW, fileURLToPath(import.meta.url)), process.env.W331C_CACHE ? path.resolve(process.env.W331C_CACHE) : null, W281A_SCOPE.scopeSha256, cstat);
  const log = (r) => console.log(`  ${new Date().toISOString().slice(11, 19)} ${r.key}: ${r.status}${r.status === 'run' ? '・' + Number(r.apsNew).toExponential(9) + '″/世紀・' + r.steps + ' 步・' + r.wallSec.toFixed(1) + ' s' : '・' + (r.err || '').slice(0, 160)}`);
  const plan = quick ? QUICK_PLAN : PLAN;
  console.log('第331便c k1scale: ' + (quick ? '試走' : '正本') + '・workers ' + NW);
  const R = await runAll(HP, { quick, plan, run, log });
  const out = { version: HARNESS_VERSION, inposk1HarnessVersion: IK.HARNESS_VERSION, planet3LibVersion: Q.LIB_VERSION, an336LibVersion: AN.LIB_VERSION, generator: 'tests/exp-w331c-k1scale.mjs', target: TARGET, targetSha256,
    ruling: '原仮定者の整理(2026-11-09)「水星の近点移動は G_loc を採用」・原仮定者の追記(2026-11-09)「K1 の R_d を使った計算は『太陽–木星』のスケールで有効なのではないか」「『土星の環の厚み』との関連も調べる」・' +
      '原仮定者の補足(2026-11-09)「太陽–水星における G_loc と回転引きずりの組み合わせを調査する」「K1 の R_d は有効性が認められる場合は使用する。有効な例と有効で無い例をリスト化する」・統括の検証項目 R312。診断だけ —— 在位の G_loc の符号・n・R_d の規則は変えない(写しの中だけ)。採るかは次の報の決断', invSqVersion: HP.REL_DRAG_INVSQ_VERSION || null, ...R };
  if (cstat.resumed > 0) out.resumed = cstat.resumed;
  out.elapsedS = (Date.now() - t0) / 1000;
  const CODE = ['tests/exp-w331c-k1scale.mjs', 'tests/lib-w331c-k1scale.mjs', 'tests/lib-w330b-dragweight.mjs', 'tests/exp-w315c-inposk1.mjs', 'tests/exp-w311d-planet3.mjs', 'tests/lib-w311d-planet3.mjs', 'tests/lib-w306a-an336.mjs',
    'tests/lib-w299c-planets3d.mjs', 'tests/lib-w280b-emgrid.mjs', 'tests/lib-w272e-provenance.mjs', 'tests/lib-w281a-scope.mjs'];
  out.meta = Object.assign(provenanceMeta({ root: ROOT, wave: '第331便c', target: TARGET, code: CODE, inputs: [TARGET, INPOS_OUT].concat(Object.values(VALID_INPUTS)) }), {
    harnessVersion: HARNESS_VERSION, stage: 'k1scale', engine: 'Node(tests/lib-w280b-emgrid.mjs の loadHtmlMain —— html の本文をそのまま実行・走行は子プロセス W331C_WORKERS)', notClaim: NOT_CLAIM });
  Object.assign(out.meta, W281A_SCOPE, w281aStableInputs(ROOT, out.meta.inputs));
  fs.mkdirSync(path.dirname(OUT), { recursive: true });
  fs.writeFileSync(OUT, JSON.stringify(out, null, 1) + '\n');
  console.log('→', path.relative(ROOT, OUT), 'ok=' + out.ok, JSON.stringify(out.gates), out.elapsedS + ' s', 'runs ' + out.stats.runs + '・cpu ' + out.stats.cpuSec.toFixed(0) + ' s');
}
if (IS_MAIN) await main();
