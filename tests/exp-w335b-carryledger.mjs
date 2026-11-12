// 第335便b(原仮定者の決断(2026-11-12)「自分自身は分母に入る。分子にも入れた場合と、v として別途加算した場合が、同じになる想定。v を分けた方がシンプル」(AN654)・
//   「引きずりの運動は相殺するが、エネルギーは相殺しない」(AN653)・「座標変換の基準なので観測値」(AN650)・原仮定者の補足(2026-11-12)「太陽や惑星の自転は、銀河の軸引きずりから供給される。
//   供給が無いと減衰するのは想定内」・原仮定者の回答(2026-11-12 —— AN646 = A・AN651 = A・AN652)・統括の検証項目 R329):
//   **定義を揃える器 —— 自己を運ぶ式の太陽系の表(本の時刻)・熱の口の 3 列・供給のある開いた帳簿(銀河の軸引きずり)・T1 の部位の速度の則**
//   (段 carryledger-335b —— 正本 tests/out/carryledger-w335b.json・lib tests/lib-w335b-carryledger.mjs)。**診断だけ** —— エンジン・内蔵の本・受理器・第329〜334便の lib の本文は変えない。
//
// Node だけ(html の inline script を tests/lib-w280b-emgrid.mjs の loadHtmlMain で読み、🗺️ solarSystem16Inertial3d の**写し**〔器の中 —— 本の JSON は 1 bit も変えない —— 第333便b の器の写しと
//   同じ作り方〕を受理器に通して build し、本の時刻の位置・速度・自転を読む —— 步は進めない)。入力の正本: 第333便b tests/out/axialfield-w333b.json(本の時刻の ω_field の照らし)・
//   第334便b tests/out/ledger-w334b.json(押しの損失と冥王星–カロンの同期の 0)・第334便d tests/out/binarylaw-w334d.json(冥王星–カロンの同期の数 —— 読むだけ)。1 プロセス。
//
// ■ 何をするか(宣言は走行の前 —— PLAN と lib の DECL・DECL_TEXT)
//   P 純関数の場面(lib)
//   B 本の時刻の状態(写し)と第333便b の ω_field(自己なし・α = 2)の照らし
//   C 自己を運ぶ式の太陽系の表(16 体 × 自己の 3 列 —— 自己なし・R_d = Y_k m・観測半径): |d|/|v − v_主星|・源の割合 Σw/W・ω′·ŝ/s(第334便b の carryAt)・静止の自己の項の ω·ŝ/s との差・恒等式
//   H 熱の口の 3 列(12 受け手 × 読み 3〔自己なし・自己を運ぶ読み R_d・観測半径〕× 系 2〔受け手の静止系(主)・重心系(比)〕× τ 3): 源ごと(主)・分解ごと(比)・相殺(否定対照)の熱と観測の熱流との比
//   G 銀河の軸引きずりの読み(太陽と惑星 8 × 読み 5〔銀河の回転・場の枠の銀河の口・自己を運ぶ読みの銀河の口・J 等価・J 等価の口〕× 銀河の源 2〔中心の点・半径の内の和〕): 目標の ŝ 成分と符号(供給か減衰か)
//   S 供給のある開いた帳簿(第334便b の押しの損失の 4 源 × 読み): 要る Γ・熱・熱 ÷ 観測の熱流・整列を仮定した比べる列・供給なしの減衰の時間
//   T T1 の部位の速度の則(土星 → 環の粒子 3・木星 → ガリレオ衛星 4・太陽 → 水星): 捩れの率・表面の速さの最大・指標 s z・受け手の自転と ω_field の r̂ 成分
//   X 冥王星–カロンの同期の 0(第334便b・第334便d の正本から読むだけ)
// ■ 言わないこと: 自己を運ぶ式は定義の恒等式(慣性の導出ではない)・熱の比は文献の値との比(機構の同定ではない)・要る Γ は要る値(同定ではない)・「供給で熱が合った」と書かない・
//   ω は回転率(トルクでも熱でもない)・T1 の s z は参照の腕を置いた速さの指標(受け手の中心の並進の速度ではない)・作った配置(環の試験点)は暦表の時刻ではない。
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { loadHtmlMain } from './lib-w280b-emgrid.mjs';
import { provenanceMeta } from './lib-w272e-provenance.mjs';
import { scopeStamp as w281aScopeStamp, stableInputs as w281aStableInputs } from './lib-w281a-scope.mjs';
import * as L from './lib-w335b-carryledger.mjs';
import * as B333 from './lib-w333b-axialfield.mjs';
import * as A333 from './lib-w333a-rotdiff.mjs';
import * as A334 from './lib-w334a-heightlaw.mjs';
import * as S330 from './lib-w330a-spinclass.mjs';
// 第281便a の領域 hash の宣言(版 8 —— 器と lib と import の閉包から deriveScope で引いた下限。器が引く本は 🗺️ solarSystem16Inertial3d〔写しの元 —— .find で引く〕の 1 本。
//   mercury・saturn は import した第334便a の lib の文献の表の鍵の綴りが数えられた分(この器は本として読まない)・roots の T・ch・ctx・cw・HP.sim・HP.dfmMeshVelocityFieldAt は import した
//   tests/lib-w280b-emgrid.mjs・tests/lib-w279b-headless.mjs の綴りが数えられた分。エンジンを読む(core —— 写しの build)。ワンタップ対照 A/B は走らせない〔abBody:false〕・説明文の欄は読まない)
const REGEN_SCOPE = {"presets":["mercury","saturn","solarSystem16Inertial3d"],"roots":["HP.allPresets","HP.coord3d","HP.dfmMeshVelocityFieldAt","HP.sim","HP.validatePreset","T","ch","ctx","cw"],"core":true,"consts":[],"complete":true,"abBody":false};

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
export const HARNESS_VERSION = 'w335b-carryledger-1';
export const OUT_MAIN = 'tests/out/carryledger-w335b.json';
export const BOOK_ID = 'solarSystem16Inertial3d';
export const AXF_JSON = 'tests/out/axialfield-w333b.json';
export const LEDGER_JSON = 'tests/out/ledger-w334b.json';
export const BINARY_JSON = 'tests/out/binarylaw-w334d.json';
const IS_MAIN = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
const clone = (x) => JSON.parse(JSON.stringify(x));
const fin = (x) => typeof x === 'number' && Number.isFinite(x);
const add = (a, b) => [a[0] + b[0], a[1] + b[1], a[2] + b[2]], sub = (a, b) => [a[0] - b[0], a[1] - b[1], a[2] - b[2]], scl = (a, s) => [a[0] * s, a[1] * s, a[2] * s];
const nrm = (a) => Math.hypot(a[0], a[1], a[2]), dot = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2], crs = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
const unit = (a) => scl(a, 1 / nrm(a));
const relD = (a, b) => (a === b ? 0 : Math.abs(a - b) / Math.max(Math.abs(a), Math.abs(b), 1e-300));
const DAY = 86400;
const MER = Object.keys({ mercury: 1 })[0], SAT = Object.keys({ saturn: 1 })[0], EM = Object.keys({ earthMoon: 1 })[0];   // 鍵の文字列を引用符で書かない(領域の下限が同じ綴りの本の id と取り違えない書き方 —— 第333便b の型)
export const NOT_CLAIM = Object.freeze(['自己を運ぶ式は定義の恒等式(慣性の導出ではない —— 読みの対応)', '熱の比は文献の値との比(機構の同定ではない)・Γ と τ は単位の格子',
  '要る Γ は定常で損失を埋めるのに要る値(診断 —— 採用ではない・観測に合わせて選んでいない)', '供給の口は宣言した受動の型の表(「供給で熱が合った」とは書かない)', 'ω は局所の場の回転率(トルクでも熱でもない —— 応答 Γ を介す)',
  'T1 の s z は参照の腕を置いた速さの指標(受け手の中心の並進の速度ではない)・軌道や熱へ作用させる向きは決めない', '作った配置(環の試験点)は暦表の時刻ではない・銀河の源は宣言した 2 つの読み']);
/** 器の宣言(走行の前に置く —— 結果を見て変えない) */
export const PLAN = Object.freeze({
  /** 16 体の本の添字の順(第333便b と同じ順)・主星 */
  keys: Object.freeze(['sun', MER, 'venus', 'earth', 'moon', 'mars', 'jupiter', 'io', 'europa', 'ganymede', 'callisto', SAT, 'titan', 'uranus', 'neptune', 'triton']),
  primary: Object.freeze([[MER, 'sun'], ['venus', 'sun'], ['earth', 'sun'], ['mars', 'sun'], ['jupiter', 'sun'], [SAT, 'sun'], ['uranus', 'sun'], ['neptune', 'sun'], ['moon', 'earth'], ['io', 'jupiter'], ['europa', 'jupiter'],
    ['ganymede', 'jupiter'], ['callisto', 'jupiter'], ['titan', SAT], ['triton', 'neptune']].map((q) => Object.freeze(q))),   // 対の配列(本の id と同じ綴りの鍵を持つ容器を正本に置かない —— 名簿の判定)
  /** 写しの宣言(第333便b の器の写しと同じ —— kernel k1・rdRule kappaM・spinDrag の宣言・initMotion・orbitObs・obsCard を外す) */
  copyKernel: 'k1', copyRule: 'kappaM', spinDecl: Object.freeze({ rot: 'surfaceFlip', axial: 'on', axialModel: 'bevel', axialGain: 1 }),
  /** 熱の口の受け手(第333便b の docBodies)と読み(自己なし・自己を運ぶ読み 2) */
  heatBodies: Object.freeze([MER, 'venus', 'earth', 'moon', 'mars', 'jupiter', 'io', SAT, 'titan', 'uranus', 'neptune', 'triton']),
  heatReadings: Object.freeze(['none', 'carry|kappaM', 'carry|robs']),
  /** 熱 ÷ 観測の熱流を文書の表に出す受け手(ブリーフの 5) */
  heatFocus: Object.freeze(['moon', 'jupiter', 'triton', MER, 'venus']),
  /** 銀河の読みの受け手(太陽と惑星 8)・自己を運ぶ読みの自己の列 */
  galRecv: Object.freeze(['sun', MER, 'venus', 'earth', 'mars', 'jupiter', SAT, 'uranus', 'neptune']), galCarrySelf: 'robs',
  /** 供給の帳簿の行(第334便b の押しの帳簿の NF・列 ball・応答率 fixed・傾き 0 —— 環は主な環の質量を B 環の半径に置いた行) */
  supply: Object.freeze([Object.freeze({ key: 'sunJup', src: 'sun', heat: 'lumSun' }), Object.freeze({ key: EM, src: 'earth', heat: 'earth' }), Object.freeze({ key: 'jupIo', src: 'jupiter', heat: 'jupiter' }),
    Object.freeze({ key: 'satRingB', src: SAT, heat: SAT })]),
  /** T1 の行: 土星 → 環の粒子(第334便a の LIT の C・B・A 環の中央の半径・赤道面からの高さ z = 10 m・粒子の半径 1 m の宣言)・木星 → ガリレオ衛星・太陽 → 水星 */
  t1Rings: Object.freeze(['satC', 'satB', 'satA']), t1RingZ: 10, t1Moons: Object.freeze(['io', 'europa', 'ganymede', 'callisto']), t1Planet: MER,
});

/* ───────── B 本の時刻の状態(写し)───────── */
function bookOf(HP, id) { return clone(HP.allPresets().find((p) => p.id === id)); }
/** 写し(器の中 —— 内蔵ではない —— 第333便b の器の写しと同じ作り方)を受理して build し、SI の状態を読む */
export function bookStates(HP) {
  const b = bookOf(HP, BOOK_ID); b.id = BOOK_ID + '_w335b'; b.description = '器の写し(内蔵ではない —— 第335便b)';
  const q = b.physics.relativeDrag.invSq; q.kernel = PLAN.copyKernel; q.rdRule = PLAN.copyRule;
  delete b.physics.relativeDrag.initMotion; delete b.orbitObs; delete b.obsCard;
  b.physics.relativeDrag = Object.assign(clone(b.physics.relativeDrag), { spinDrag: clone(PLAN.spinDecl) });
  const v = HP.validatePreset(b);
  if (!v.ok) return { ok: false, errors: v.errors.slice(0, 3) };
  const S = HP.coord3d.makeSim(); S.build(clone(v.preset));
  const se = v.preset.scaleExp, uL = Math.pow(10, se.L), uT = Math.pow(10, se.T), uM = Math.pow(10, se.M);
  const bodies = Array.from({ length: S.n }, (_, i) => {
    const ax = [S.sax[i], S.say[i], S.saz[i]], sv = scl(ax, S.spin[i] / uT);
    return { key: PLAN.keys[i], p: [S.x[i] * uL, S.y[i] * uL, S.z[i] * uL], v: [S.vx[i] * uL / uT, S.vy[i] * uL / uT, S.vz[i] * uL / uT], s: sv, sObs: nrm(sv), sHat: nrm(sv) > 0 ? unit(sv) : ax, m: S.m[i] * uM, R: v.preset.bodies[i].radius * uL };
  });
  return { ok: true, n: S.n, bodies };
}
const srcOf = (B, i) => B.filter((_, j) => j !== i).map((q) => ({ key: q.key, p: q.p, v: q.v, s: q.s, m: q.m }));
/** 第333便b の ω_field(自己なし・α = 2・重心系)と照らす */
export function checkVsAxf(B, AX) {
  const rows = AX.field.epoch.cols['2|none'];
  let worst = 0, worstM = 0;
  B.forEach((b, i) => { const F = B333.integratedField({ at: b.p, sources: srcOf(B, i), alpha: L.DECL.alpha, rRef: L.DECL.rRef }), q = rows.find((z) => z.key === b.key), axb = AX.field.epoch.bodies.find((z) => z.key === b.key);
    worst = Math.max(worst, relD(dot(F.omega, b.sHat), q.par)); worstM = Math.max(worstM, relD(b.m, axb.m), relD(b.R, axb.Robs), relD(b.sObs, axb.sObs)); });
  return { parRel: worst, bodyRel: worstM };
}

/* ───────── C 自己を運ぶ式の太陽系の表 ───────── */
export function partCarry(B) {
  return B.map((b, i) => {
    const pq = PLAN.primary.find((q) => q[0] === b.key), pk = pq ? pq[1] : undefined, P = pk ? B.find((q) => q.key === pk) : null, vRel = P ? nrm(sub(b.v, P.v)) : nrm(b.v), row = { key: b.key, primary: pk || null, vRel, cols: {} };
    for (const sr of L.SELF_RULES) {
      const r = L.carryRow({ at: b.p, v: b.v, s: b.s, m: b.m, R: b.R, sources: srcOf(B, i), selfRule: sr });
      const pc = dot(r.omegaCarry, b.sHat) / b.sObs, ps = dot(r.omegaStatic, b.sHat) / b.sObs;
      row.cols[sr] = { dNorm: r.dNorm, dOverVrel: r.dNorm / vRel, srcShare: r.srcShare, fSelf: r.fSelf, cMax: r.cMax, boundOk: r.boundOk, idStaticRel: r.idStaticRel, idDirectRel: r.idDirectRel,
        carryParOverS: pc, staticParOverS: ps, diffParOverS: pc - ps, carryMinusSRel: nrm(sub(r.omegaCarry, b.s)) / b.sObs };
    }
    return row;
  });
}

/* ───────── H 熱の口の 3 列 ───────── */
export function partHeat(B) {
  const rows = [];
  for (const key of PLAN.heatBodies) {
    const i = PLAN.keys.indexOf(key), b = B[i], f = A333.fObsOf(i), I = f * b.m * b.R * b.R, Pd = S330.DECL.lit.orbitDays[key], hObs = L.LIT.heatFlowW[key] === undefined ? null : L.LIT.heatFlowW[key];
    const row = { key, I, f, orbitDays: Pd, heatObs: hObs, readings: {} };
    for (const rd of PLAN.heatReadings) {
      row.readings[rd] = {};
      for (const fr of L.FRAMES) {
        const carry = rd !== 'none', sr = carry ? rd.split('|')[1] : 'none';
        const fa = carry ? L.carryPartsAt({ at: b.p, vRecv: b.v, sRecv: b.s, sources: srcOf(B, i), selfRule: sr, m: b.m, R: b.R, frame: fr }) : L.partsAt({ at: b.p, vRecv: b.v, sources: srcOf(B, i), selfRule: sr, m: b.m, R: b.R, frame: fr });
        const om = carry ? fa.omegaEff : fa.F.omega, scale = carry ? fa.oneMinus : 1, out = { omegaParOverS: dot(om, b.sHat) / b.sObs, nParts: fa.parts.length, tau: {} };
        for (const tf of L.DECL.tauOrbits) {
          const tau = tf * Pd * DAY, Gam = (I / tau) * scale, H = L.heatColumns({ parts: fa.parts, s: b.s, Gamma: Gam });
          out.tau[tf] = { Gamma: Gam, torquePar: dot(H.merged.torque, b.sHat), bySource: H.bySource.heat, byPart: H.byPart.heat, merged: H.merged.heat, nSource: H.bySource.nPorts, nPart: H.byPart.nPorts,
            torqueSameRel: H.torqueSameRel, identityRel: Math.max(H.bySource.identityRel, H.byPart.identityRel), order: H.order,
            obs: hObs ? { bySource: H.bySource.heat / hObs, byPart: H.byPart.heat / hObs, merged: H.merged.heat / hObs } : null };
        }
        row.readings[rd][fr] = out;
      }
    }
    rows.push(row);
  }
  return { rows };
}

/* ───────── G 銀河の軸引きずりの読み ───────── */
/** 受け手 1 つの読み 5 × 源 2 の目標 T(ŝ 成分 ÷ s・大きさ ÷ s・符号) */
export function galaxyTargets(B, i, axes, gal, srcSets) {
  const b = B[i], base = srcOf(B, i), out = {}, rec = (T, extra = {}) => Object.assign({ T, parOverS: dot(T, b.sHat) / b.sObs, magOverS: nrm(T) / b.sObs, raises: dot(sub(T, b.s), b.sHat) > 0 }, extra);
  out.rotation = rec(scl(axes.Lhat, gal.Omega));
  out.jEquiv = rec(scl(axes.Lhat, gal.sd));
  for (const [sk, set] of Object.entries(srcSets)) {
    if (sk === 'jd') { const g = L.galaxyPortAt({ at: b.p, vRecv: b.v, sRecv: b.s, m: b.m, R: b.R, sources: base.concat(set) }); out['jEquivPort|center'] = rec(g.nu, { galParOverS: dot(g.omegaGal, b.sHat) / b.sObs, share: g.share }); continue; }
    const g = L.galaxyPortAt({ at: b.p, vRecv: b.v, sRecv: b.s, m: b.m, R: b.R, sources: base.concat(set) });
    out['fieldPort|' + sk] = rec(g.nu, { galParOverS: dot(g.omegaGal, b.sHat) / b.sObs, share: g.share });
    if (sk === 'center') { const c = L.galaxyPortAt({ at: b.p, vRecv: b.v, sRecv: b.s, m: b.m, R: b.R, sources: base.concat(set), selfRule: PLAN.galCarrySelf, carry: true }); out['carryPort|center'] = rec(c.nu, { galParOverS: dot(c.omegaGal, b.sHat) / b.sObs, share: c.share }); }
  }
  for (const v of Object.values(out)) delete v.T;
  return out;
}
export function partGalaxy(B) {
  const axes = L.galacticAxes(), gal = L.galaxyOf(), sets = { center: L.galaxySources({ variant: 'center', axes, gal }), inner: L.galaxySources({ variant: 'inner', axes, gal }),
    innerAlt: L.galaxySources({ variant: 'inner', axes, gal, NR: L.DECL.galaxy.NRalt, K: L.DECL.galaxy.Kalt }), jd: L.galaxySources({ variant: 'center', spin: 'jd', axes, gal }) };
  const rows = PLAN.galRecv.map((k) => { const i = PLAN.keys.indexOf(k), b = B[i]; return { key: k, s: b.sObs, sHatDotL: dot(b.sHat, axes.Lhat), readings: galaxyTargets(B, i, axes, gal, sets) }; });
  const sunPole = B[0].sHat;
  return { axes: { xg: axes.xg, yg: axes.yg, zg: axes.zg, Lhat: axes.Lhat, gcOffDeg: axes.orthoDeg, sunPoleDotNGP: dot(sunPole, axes.zg) }, gal, rows };
}

/* ───────── S 供給のある開いた帳簿 ───────── */
export function partSupply(B, LG, GAL) {
  const rows = [];
  for (const sp of PLAN.supply) {
    const r = LG.push.rows.find((q) => q.pair === sp.key && q.col === 'ball' && q.rate === 'fixed' && q.dir === 'NF' && !q.tilted), src = LG.push.sources[sp.src];
    const massScale = r.aux.Lout / nrm(r.N), Nloss = r.N[2] * massScale, i = PLAN.keys.indexOf(sp.src), b = B[i], heatObs = sp.heat === 'lumSun' ? L.LIT.lumSun : L.LIT.heatFlowW[sp.heat];
    const G = GAL.rows.find((q) => q.key === sp.src), axes = GAL.axes, sVec = b.s;
    // 目標 T は G の読みと同じ式を作り直す(本の時刻の自転 s —— 押しの帳簿の源の s とは別の読み口なので比 s_ledger/s_book を記録)
    const set = { center: L.galaxySources({ variant: 'center' }), inner: L.galaxySources({ variant: 'inner' }), jd: L.galaxySources({ variant: 'center', spin: 'jd' }) };
    const base = srcOf(B, i), port = (ss, carry = false) => L.galaxyPortAt({ at: b.p, vRecv: b.v, sRecv: b.s, m: b.m, R: b.R, sources: base.concat(ss), selfRule: carry ? PLAN.galCarrySelf : 'none', carry });
    const P = { 'fieldPort|center': port(set.center), 'fieldPort|inner': port(set.inner), 'carryPort|center': port(set.center, true), 'jEquivPort|center': port(set.jd) };
    const T = { rotation: scl(axes.Lhat, GAL.gal.Omega), 'fieldPort|center': P['fieldPort|center'].nu, 'fieldPort|inner': P['fieldPort|inner'].nu, 'carryPort|center': P['carryPort|center'].nu, jEquiv: scl(axes.Lhat, GAL.gal.sd), 'jEquivPort|center': P['jEquivPort|center'].nu };
    const out = { key: sp.key, src: sp.src, Nloss, lossWork: Math.abs(src.s) * Nloss, J: src.J, sLedgerOverBook: Math.abs(src.s) / b.sObs, heatObs, heatKey: sp.heat, readings: {} };
    for (const [k, t] of Object.entries(T)) {
      const q = L.supplyRow({ sVec, Nloss, T: t, J: src.J, heatObs }); out.readings[k] = q; if (G && G.readings[k]) q.sameAsG = relD(q.targetParOverS, G.readings[k].parOverS);
      // 口の読み: 解いた Γ は銀河の口の係数 Γ_gal(= Γ × 割合)—— 全体の Γ = Γ_gal/割合 で全部の口(源ごと)を同じ Γ で応答させたときの合トルクの ŝ 成分と熱(太陽系の源の口を含む)
      if (P[k]) { q.share = P[k].share; q.omegaTotalParOverS = dot(P[k].omegaTotal, b.sHat) / b.sObs;
        for (const mode of ['passive', 'aligned']) { const z = q[mode]; if (!z.feasible || !(P[k].share > 0)) continue;
          const Gt = z.Gamma / P[k].share, H = L.heatColumns({ parts: P[k].parts, s: sVec, Gamma: Gt });
          z.GammaTotal = Gt; z.netTorquePar = dot(H.merged.torque, b.sHat); z.netHeat = H.bySource.heat; z.netHeatObs = heatObs ? H.bySource.heat / heatObs : null; z.netRaises = z.netTorquePar > 0; } } }
    out.noSupplyYr = Nloss > 0 ? src.J / Nloss / L.DECL.yearS : null;
    rows.push(out);
  }
  return { rows };
}

/* ───────── T T1 の部位の速度の則 ───────── */
export function partT1(B) {
  const rows = [], iS = PLAN.keys.indexOf(SAT), S = B[iS], e1 = unit(crs(S.sHat, Math.abs(S.sHat[2]) < 0.9 ? [0, 0, 1] : [1, 0, 0]));
  for (const rk of PLAN.t1Rings) {
    const rg = A334.LIT334A.rings.find((q) => q.key === rk), r = add(scl(e1, rg.r), scl(S.sHat, PLAN.t1RingZ));
    rows.push(Object.assign({ kind: 'ring', src: SAT, recv: rk, r: nrm(r), z: PLAN.t1RingZ, Rrecv: A334.LIT334A.particle.R }, L.t1Row({ s: S.s, r, R: A334.LIT334A.particle.R })));
  }
  const field = (i) => L.partsAt({ at: B[i].p, vRecv: B[i].v, sources: srcOf(B, i), selfRule: 'none', m: B[i].m, R: B[i].R }).F.omega;
  for (const [sk, list] of [['jupiter', PLAN.t1Moons], ['sun', [PLAN.t1Planet]]]) {
    const iJ = PLAN.keys.indexOf(sk), J = B[iJ];
    for (const mk of list) { const i = PLAN.keys.indexOf(mk), b = B[i], r = sub(b.p, J.p);
      rows.push(Object.assign({ kind: sk === 'sun' ? 'planet' : 'moon', src: sk, recv: mk, r: nrm(r), z: dot(r, J.sHat), Rrecv: b.R, recvS: b.sObs }, L.t1Row({ s: J.s, r, R: b.R, sRecv: b.s, omegaField: field(i) }))); }
  }
  return { rows };
}

/* ───────── X 冥王星–カロンの同期の 0(読むだけ)───────── */
export function partSync(LG, BL) {
  const sy = LG.windows.pc.sync, pick = (sr) => sy.find((q) => q.selfRule === sr).rows.map((q) => ({ key: q.key, omegaMinusSRel: q.omegaMinusSRel, carryMinusSRel: q.carryMinusSRel, oneMinusF: q.oneMinusF }));
  return { ledger: { none: pick('none'), kappaM: pick('kappaM'), robs: pick('robs') }, binary: { syncD: BL.pluto.syncD, syncSlip: BL.pluto.syncSlip, spinOverN: BL.pluto.spinOverN, e: BL.pluto.e } };
}

/* ───────── 門 ───────── */
export function gatesOf(J) {
  const C = J.carry, H = J.heat.rows, G = J.galaxy.rows, Sp = J.supply.rows, T = J.t1.rows;
  return {
    pure: Object.values(J.pure.gates).every(Boolean),
    input: J.inputs.axfVersion === 'w333b-axialfield-1' && J.inputs.ledgerVersion === 'w334b-ledger-1' && J.inputs.binaryVersion === 'w334d-binarylaw-1' && J.book.ok === true && J.book.n === 16,
    bookVsAxf: J.book.vsAxf.parRel <= 1e-9 && J.book.vsAxf.bodyRel <= 1e-12,
    carryIdentity: C.length === 16 && C.every((r) => L.SELF_RULES.every((s) => { const q = r.cols[s]; return q.idStaticRel <= 1e-12 && q.idDirectRel <= 1e-12 && q.boundOk && fin(q.carryParOverS); })),
    carryNoneSame: C.every((r) => Math.abs(r.cols.none.diffParOverS) <= 1e-9 * Math.max(1, Math.abs(r.cols.none.staticParOverS))),
    heatComplete: H.length === PLAN.heatBodies.length && H.every((r) => PLAN.heatReadings.every((rd) => L.FRAMES.every((fr) => L.DECL.tauOrbits.every((t) => fin(r.readings[rd][fr].tau[t].bySource))))),
    heatIdentity: H.every((r) => PLAN.heatReadings.every((rd) => L.FRAMES.every((fr) => L.DECL.tauOrbits.every((t) => { const q = r.readings[rd][fr].tau[t]; return q.torqueSameRel <= 1e-9 && q.identityRel <= 1e-9 && q.order; })))),
    galaxyComplete: G.length === PLAN.galRecv.length && G.every((r) => Object.keys(r.readings).length === 7 && Object.values(r.readings).every((q) => fin(q.parOverS) && fin(q.magOverS))),
    supply: Sp.length === PLAN.supply.length && Sp.every((r) => Object.values(r.readings).every((q) => (!q.passive.feasible || (q.passive.identityRel <= 1e-12 && q.passive.Q >= 0)) && (!q.aligned.feasible || (q.aligned.identityRel <= 1e-12 && q.aligned.Q >= 0)))
      && Object.values(r.readings).every((q) => q.sameAsG === undefined || q.sameAsG <= 1e-12)),
    t1: T.length === PLAN.t1Rings.length + PLAN.t1Moons.length + 1 && T.every((r) => r.center === 0 && r.rateDirectOverS <= 1e-15 && relD(r.surfaceAt, r.surfaceMax) <= 1e-12),
    syncRead: J.sync.ledger.none.every((q) => q.omegaMinusSRel <= 1e-12) && ['kappaM', 'robs'].every((k) => J.sync.ledger[k].every((q) => q.carryMinusSRel <= 1e-9)),
  };
}
export function readJson(rel, root = ROOT) { return JSON.parse(fs.readFileSync(path.join(root, rel), 'utf8')); }
export function runFrom(Bk, inputs) {
  const t0 = Date.now(), tm = {}, mark = (k) => { tm[k] = { wallSec: (Date.now() - t0) / 1000 }; };
  const PS = L.pureScenes(), pure = { scenes: PS, gates: L.pureGates(PS) }; mark('pure');
  const B = Bk.bodies, AX = inputs.AX, LG = inputs.LG, BL = inputs.BL;
  const book = { ok: Bk.ok, n: Bk.n, bodies: B, vsAxf: checkVsAxf(B, AX) }; mark('book');
  const carry = partCarry(B); mark('carry');
  const heat = partHeat(B); mark('heat');
  const galaxy = partGalaxy(B); mark('gal');
  const supply = partSupply(B, LG, galaxy); mark('supply');
  const t1 = partT1(B); mark('t1');
  const sync = partSync(LG, BL); mark('sync');
  const J = { inputs: { axf: AXF_JSON, axfVersion: AX.version, ledger: LEDGER_JSON, ledgerVersion: LG.version, binary: BINARY_JSON, binaryVersion: BL.version }, pure, book, carry, heat, galaxy, supply, t1, sync, timing: tm };
  J.gates = gatesOf(J); J.ok = Object.values(J.gates).every(Boolean);
  return J;
}

/** 文献の値の出力の形(熱流は [鍵, 値] の対の配列 —— 本の id と同じ綴りの鍵を持つ容器を正本に置かない) */
export const litOut = () => ({ note: L.LIT.note, lumSun: L.LIT.lumSun, heatFlowW: Object.entries(L.LIT.heatFlowW) });

/* ───────── 走らせる ───────── */
export async function main() {
  const TARGET = process.env.W335B_TARGET || 'beta/index.html';
  const OUT = process.env.W335B_OUT ? (path.isAbsolute(process.env.W335B_OUT) ? process.env.W335B_OUT : path.join(ROOT, process.env.W335B_OUT)) : path.join(ROOT, OUT_MAIN);
  const html = path.isAbsolute(TARGET) ? TARGET : path.join(ROOT, TARGET);
  const t0 = Date.now(), text = fs.readFileSync(html, 'utf8'), targetSha256 = crypto.createHash('sha256').update(text).digest('hex');
  const W281A_SCOPE = REGEN_SCOPE ? w281aScopeStamp(html, REGEN_SCOPE) : {};
  const { HP } = loadHtmlMain(html);
  console.log('第335便b carryledger(版 ' + HARNESS_VERSION + ')');
  const Bk = bookStates(HP);
  if (!Bk.ok) throw new Error('写しが受理されない: ' + JSON.stringify(Bk.errors));
  const R = runFrom(Bk, { AX: readJson(AXF_JSON), LG: readJson(LEDGER_JSON), BL: readJson(BINARY_JSON) });
  const out = { version: HARNESS_VERSION, libVersion: L.LIB_VERSION, generator: 'tests/exp-w335b-carryledger.mjs', target: TARGET, targetSha256, reuseFrom: null,
    ruling: '原仮定者の決断(2026-11-12)「自分自身は分母に入る。分子にも入れた場合と、v として別途加算した場合が、同じになる想定。v を分けた方がシンプル」(AN654)「引きずりの運動は相殺するが、エネルギーは相殺しない」(AN653)「座標変換の基準なので観測値」(AN650)'
      + '・原仮定者の補足(2026-11-12)「太陽や惑星の自転は、銀河の軸引きずりから供給される。供給が無いと減衰するのは想定内」(作業仮説 —— 診断で検査)・原仮定者の回答(2026-11-12 —— AN646 = A・AN651 = A・AN652)・統括の検証項目 R329',
    declText: L.DECL_TEXT, decl: L.DECL, plan: PLAN, lit: litOut(), notClaim: NOT_CLAIM, ...R };
  out.elapsedS = (Date.now() - t0) / 1000;
  const CODE = ['tests/exp-w335b-carryledger.mjs', 'tests/lib-w335b-carryledger.mjs', 'tests/lib-w334b-ledger.mjs', 'tests/lib-w334a-heightlaw.mjs', 'tests/lib-w333a-rotdiff.mjs', 'tests/lib-w333b-axialfield.mjs', 'tests/lib-w332a-eqband.mjs',
    'tests/lib-w331a-coordtwist.mjs', 'tests/lib-w331b-centrifugal.mjs', 'tests/lib-w330a-spinclass.mjs', 'tests/lib-w330b-dragweight.mjs', 'tests/lib-w326d-axialheat.mjs', 'tests/lib-w280b-emgrid.mjs', 'tests/lib-w279b-headless.mjs',
    'tests/lib-w272e-provenance.mjs', 'tests/lib-w281a-scope.mjs'];
  out.meta = Object.assign(provenanceMeta({ root: ROOT, wave: '第335便b', target: TARGET, code: CODE, inputs: [TARGET, AXF_JSON, LEDGER_JSON, BINARY_JSON] }), {
    harnessVersion: HARNESS_VERSION, stage: 'carryledger', engine: 'Node(tests/lib-w280b-emgrid.mjs の loadHtmlMain —— html の本文をそのまま実行・1 プロセス)・🗺️ solarSystem16Inertial3d の写し(受理器 → build —— 步は進めない)・純関数(lib)', notClaim: NOT_CLAIM });
  Object.assign(out.meta, W281A_SCOPE, w281aStableInputs(ROOT, out.meta.inputs));
  fs.mkdirSync(path.dirname(OUT), { recursive: true });
  fs.writeFileSync(OUT, JSON.stringify(out, null, 1) + '\n');
  console.log('→', path.relative(ROOT, OUT), 'ok=' + out.ok, JSON.stringify(out.gates), out.elapsedS + ' s');
}
if (IS_MAIN) await main();
