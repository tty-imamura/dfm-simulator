// 第315便a(原仮定者の裁定(第117報)・決断事項 AN414・統括の推奨 AN417/AN419/AN420・統括の検証項目 R242): **記号の体系の器**。
//
// ■ 何をするか(html・本の宣言・エンジンの式・保存形式の鍵は 1 bit も変えない —— 読むだけ)
//   T(記号の表 —— 純データ SYMBOLS): 光速定数 c・重力定数 G(基準の定数)/基準光速 c_0・基準重力 G_0(サンプルごとの基準値 —— パラメータ)/
//     局所光速 c_loc・局所重力 G_loc(その場の値)/時空係数 X_k(時計と光 —— ψ = X_k W)/引きずり係数 Y_k(引きずり半径の比例係数)/
//     決定力定数 κ_D = 2G/c²(論文 1 の実効レンズ係数 —— κ の字を使うのはこの記号だけ)/シュヴァルツシルト半径(重力半径)r_s = κ_D m/
//     引きずり半径 r_d = Y_k m/スピン拡散 K_s。鍵の名(kappaT・cLight・G・kappaS・rdRule:"kappaM"・gLoc.law:"kappaC2")は不変 —— 旧記号との対応表 OLD_TO_NEW。
//   F(式の 3 段 —— 純関数 tierA・tierB・tierC): A 定義(現実の参照定数 —— κ_D ≡ 2G/c²・r_s = κ_D m)/B サンプルで計算(Y_k = 10G_0/(C_1c_0²)・
//     r_d = Y_k m・r_s = 2G_0m/c_0²・r_d/r_s = 5/C_1)/C 物理対応ロックの本で追加(X_k = G_0/c_0²・Y_k = (10/C_1)X_k・X_k = κ_D/2・κ_D = 2X_k・
//     r_d = (5/C_1)κ_D m)。**ロック解除中の X_k に κ_D = 2X_k を出さない**(tierC はロックの条件を満たさないとき null を返す)。
//     数値の例: 太陽(凍結の写し tests/data-w306a-decl305.json の 🌡️ mercurySunInertial3d の本の G_0・c_0・scaleExp と太陽の質量)と SI の G・c。
//   L(物理対応ロックの読込時の自動 ON の受理の表): 合成の params の組を html の physLockAutoOnOf と器の独立の実装 autoOnRef に通して照合。
//   P(内蔵の全本の数え —— 条件の数え・較正の合格ではない): 各本を loadPreset(id,false) で開き、フラグ(HP.physLock())・判定(physLockAutoOnOf)・
//     kappaT が別の sim の build の値と bit で同じか(値を書き直さない)を数える。在位/退役(familyRole)に分ける。
//
// ■ 言わないこと: 「法則を確かめた」「フィットした」「較正した」「完全に一致」「確認した」「収束した」。r_s は**重力半径に比例する長さの物差し**で、
//   DFM が地平面を解いたことを意味しない。r_d は引きずりの半径(天体の大きさではない)。自動 ON の数は条件の数えで、較正の合格の数ではない。
//
// ■ 使い方
//   node tests/exp-w315a-symbols.mjs   → 正本 tests/out/symbols-w315a.json(段 symbols-315a)
//   W315A_OUT=<json> で出力先を変える(試走は正本を書かない)・W315A_TARGET=<html>(既定 beta/index.html)・W315A_QUICK=1(段 P を先頭 12 本に縮める —— 煙試験の窓)。
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { loadHtmlMain } from './lib-w280b-emgrid.mjs';
import { provenanceMeta } from './lib-w272e-provenance.mjs';
import { scopeStamp as w281aScopeStamp, stableInputs as w281aStableInputs } from './lib-w281a-scope.mjs';
// 第281便a の領域 hash の宣言(器と lib から deriveScope で引いた下限 —— 段 P が内蔵の全本を開くので presets は "all")
const REGEN_SCOPE = {"presets":"all","roots":["HP.PHYS_LOCK_AUTO_VERSION","HP.allPresets","HP.coord3d","HP.dfmMeshVelocityFieldAt","HP.loadPreset","HP.physLock","HP.physLockAutoOnOf","HP.physLockCalc","HP.sim","HP.validatePreset","PHYS_LOCK_AUTO_REL","PHYS_LOCK_AUTO_VERSION","REL_DRAG_INVSQ_C1","ctx","cw","enforcePhysLock","loadPreset","loadSave","physLockAutoApply","physLockAutoOnOf","physLockSetFlag","updatePhysLockBadge"]};

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
export const HARNESS_VERSION = 'w315a-symbols-1';
const IS_MAIN = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
const clone = (o) => JSON.parse(JSON.stringify(o));
const NOT_CLAIM = ['法則を確かめた', 'フィットした', '較正した', '完全に一致', '確認した', '収束した', '地平面を判定した'];
export const DECL_FILE = 'tests/data-w306a-decl305.json';
const PIN = JSON.parse(fs.readFileSync(new URL('./data-w306a-decl305.json', import.meta.url), 'utf8'));
/** C_1 = 6[(√3/2) ln(2 + √3) − 1](閉じた式 —— 器の中で独立に。html の REL_DRAG_INVSQ_C1 とビットで照合) */
export const C1 = 6 * ((Math.sqrt(3) / 2) * Math.log(2 + Math.sqrt(3)) - 1);
/** SI の参照定数(本の G = 6.674 の写しと同じ桁 —— 光速定数 c は定義値) */
export const G_SI = 6.674e-11;
export const C_SI = 299792458;
/** 照合の参照(DECISIONS の閉じた項・第314便b の正本 —— Y_k の SI は旧記号 κ₀ の値と同じ) */
export const YK_REF = 8.80761886e-27;
/** 物理対応ロックの自動 ON の相対の許容(html の PHYS_LOCK_AUTO_REL と照合) */
export const AUTO_REL = 1e-6;
/** X_k の値域(html の CLAMPS.kappaT —— 器では固定値として持ち、受理の表で html の clamped と照合) */
export const XK_RANGE = Object.freeze([0, 1]);

/* ───────── T: 記号の表(純データ)───────── */
export const SYMBOLS = Object.freeze([
  { id: 'c', sym: 'c', ja: '光速定数', en: 'light-speed constant', layer: 'constant', key: null, note: '基準の定数(SI の 299792458 m/s)' },
  { id: 'G', sym: 'G', ja: '重力定数(万有引力定数)', en: 'gravitational constant', layer: 'constant', key: null, note: '基準の定数(SI の 6.674×10⁻¹¹ —— 本の写しと同じ桁)' },
  { id: 'c0', sym: 'c_0', ja: '基準光速', en: 'reference light speed', layer: 'sample', key: 'physics.cLight', note: 'サンプルごとの基準値(パラメータ)' },
  { id: 'G0', sym: 'G_0', ja: '基準重力', en: 'reference gravity', layer: 'sample', key: 'physics.G', note: 'サンプルごとの基準値(パラメータ)' },
  { id: 'cloc', sym: 'c_loc', ja: '局所光速', en: 'local light speed', layer: 'local', key: null, note: 'その場の値(c_loc = c_0·e^(−2ψ))' },
  { id: 'Gloc', sym: 'G_loc', ja: '局所重力', en: 'local gravity', layer: 'local', key: 'physics.gLoc', note: 'その場の値(gLoc.law:"kappaC2" は X_k·c_loc²)' },
  { id: 'Xk', sym: 'X_k', ja: '時空係数', en: 'spacetime coefficient', layer: 'coefficient', key: 'physics.kappaT', note: '時計と光(ψ = X_k W)。物理対応ロックの本で X_k = G_0/c_0²' },
  { id: 'Yk', sym: 'Y_k', ja: '引きずり係数', en: 'drag coefficient', layer: 'coefficient', key: 'physics.relativeDrag.invSq.rdRule:"kappaM"', note: '引きずり半径の比例係数 Y_k = 10G_0/(C_1c_0²)' },
  { id: 'kD', sym: 'κ_D', ja: '決定力定数', en: 'determinacy constant', layer: 'definition', key: null, note: 'κ_D ≡ 2G/c²(論文 1 の実効レンズ係数 —— κ の字を使うのはこの記号だけ)' },
  { id: 'rs', sym: 'r_s', ja: 'シュヴァルツシルト半径(重力半径)', en: 'Schwarzschild (gravitational) radius', layer: 'length', key: null, note: 'r_s = 2Gm/c² = κ_D m(長さの物差し)' },
  { id: 'rd', sym: 'r_d', ja: '引きずり半径', en: 'drag radius', layer: 'length', key: 'dragCore.radius', note: 'r_d = Y_k m(天体の大きさではない —— 旧表記 R_d・Rd)' },
  { id: 'Ks', sym: 'K_s', ja: 'スピン拡散', en: 'spin diffusion', layer: 'coefficient', key: 'physics.kappaS', note: '熱の拡散(時空の量ではない)' }].map((o) => Object.freeze(o)));
/** 旧記号 → 新記号(鍵の名は不変) */
export const OLD_TO_NEW = Object.freeze([
  { old: '時空係数 κ', now: '時空係数 X_k', key: 'kappaT' },
  { old: 'κ₀(引きずりの比例定数)', now: '引きずり係数 Y_k', key: 'rdRule:"kappaM"' },
  { old: 'R_d・Rd', now: '引きずり半径 r_d', key: 'dragCore.radius' },
  { old: '光速 c₀', now: '基準光速 c_0', key: 'cLight' },
  { old: '重力 G', now: '基準重力 G_0', key: 'G' },
  { old: 'スピン拡散 κs', now: 'スピン拡散 K_s', key: 'kappaS' },
  { old: 'κ_g(gLoc の "lock")', now: 'X_k = G_0/c_0²(物理対応のとき)', key: 'gLoc.kappa:"lock"' },
  { old: 'κ·c_loc²(gLoc.law:"kappaC2")', now: 'X_k·c_loc²', key: 'gLoc.law:"kappaC2"' }].map((o) => Object.freeze(o)));

/* ───────── F: 式の 3 段(純関数 —— QA docs.symbols315 が作り直して照合する)───────── */
/** A 定義(現実の参照定数): κ_D ≡ 2G/c²・r_s = κ_D m */
export function tierA(inp) {
  const kD = (2 * inp.G) / (inp.c * inp.c);
  return { kappaD: kD, rs: kD * inp.m };
}
/** B サンプルで計算: Y_k = 10G_0/(C_1c_0²)・r_d = Y_k m・r_s = 2G_0m/c_0²・r_d/r_s = 5/C_1 */
export function tierB(inp) {
  const c1 = inp.C1 === undefined ? C1 : inp.C1;
  const Yk = (10 * inp.G0) / (c1 * inp.c0 * inp.c0), rs = (2 * inp.G0 * inp.m) / (inp.c0 * inp.c0), rd = Yk * inp.m;
  return { Yk, rd, rs, rdOverRs: rd / rs, fiveOverC1: 5 / c1 };
}
/** ロックの条件(器の独立の実装 —— html の physLockAutoOnOf と照合する)。値域 XK_RANGE の外の導出値はクランプ扱い */
export function autoOnRef(p) {
  const G = p.G, c = p.cLight, x = p.kappaT;
  const fin = (v) => typeof v === 'number' && Number.isFinite(v);
  if (!fin(G) || !fin(c) || !fin(x)) return { ok: false, reason: 'nonFinite' };
  if (!(G >= 0)) return { ok: false, reason: 'gNegative' };
  if (!(c > 0)) return { ok: false, reason: 'cNotPositive' };
  if (!(x >= 0)) return { ok: false, reason: 'xNegative' };
  const tgt = (G > 0) ? G / (c * c) : 0;
  if (tgt < XK_RANGE[0] || tgt > XK_RANGE[1]) return { ok: false, reason: 'clamped' };
  if (G === 0) return { ok: x === 0, reason: x === 0 ? 'zeroExact' : 'gZeroXNonZero' };
  const ok = Math.abs(x - tgt) <= AUTO_REL * Math.max(x, tgt);
  return { ok, reason: ok ? 'within' : 'mismatch' };
}
/** C 物理対応ロックの本で追加: X_k = G_0/c_0²・Y_k = (10/C_1)X_k・κ_D = 2X_k・r_d = (5/C_1)κ_D m。ロックの条件を満たさなければ null(κ_D = 2X_k を出さない) */
export function tierC(inp) {
  const c1 = inp.C1 === undefined ? C1 : inp.C1;
  if (!autoOnRef({ G: inp.G0, cLight: inp.c0, kappaT: inp.Xk }).ok) return null;
  const kD = 2 * inp.Xk;
  return { XkLock: inp.G0 / (inp.c0 * inp.c0), YkFromXk: (10 / c1) * inp.Xk, kappaDFromXk: kD, YkFromKappaD: (5 / c1) * kD, rdFromKappaD: (5 / c1) * kD * inp.m, XkM: inp.Xk * inp.m, rsHalf: (inp.G0 * inp.m) / (inp.c0 * inp.c0) };
}
const unitsOf = (se) => ({ Lm: Math.pow(10, se.L), Tm: Math.pow(10, se.T), Mm: Math.pow(10, se.M) });
/** 本の G_0・c_0・X_k・m(本の単位)を SI へ(長さ L・時間 T・質量 M の 10 の冪) */
export function bookToSI(b) {
  const U = unitsOf(b.scaleExp);
  return { G0: b.G * U.Lm ** 3 / (U.Mm * U.Tm ** 2), c0: b.cLight * U.Lm / U.Tm, Xk: b.kappaT * U.Lm / U.Mm, m: b.m * U.Mm };
}
/** 数値の例(太陽): 本の G_0・c_0 から B・C 段、SI の G・c から A 段 */
export function sunExample(book) {
  const si = bookToSI(book);
  const A = tierA({ G: G_SI, c: C_SI, m: si.m });
  const B = tierB({ G0: si.G0, c0: si.c0, m: si.m });
  const C = tierC({ G0: si.G0, c0: si.c0, Xk: si.Xk, m: si.m });
  const YkSI = (10 * G_SI) / (C1 * C_SI * C_SI);
  return { book: { id: book.id, G: book.G, cLight: book.cLight, kappaT: book.kappaT, scaleExp: book.scaleExp, m: book.m, R: book.R }, si, A, B, C,
    YkSI, kappaDSI: A.kappaD, rsKm: B.rs / 1e3, rdKm: B.rd / 1e3, rsKmSI: A.rs / 1e3, rdOverRs: B.rdOverRs, XkMOverRs: C ? C.XkM / B.rs : null };
}

/* ───────── L: 受理の表(合成の params)───────── */
const D7 = 6.674 / (29979.2458 * 29979.2458);
export const LOCK_CASES = Object.freeze([
  { key: 'derivedExact', p: { G: 6.674, cLight: 29979.2458, kappaT: D7 }, why: '導出値そのもの(内蔵の現実の本の型)' },
  { key: 'within5e-7', p: { G: 6.674, cLight: 29979.2458, kappaT: D7 * (1 + 5e-7) }, why: '相対 5×10⁻⁷ —— 許容の内(値は保つ)' },
  { key: 'outside2e-6', p: { G: 6.674, cLight: 29979.2458, kappaT: D7 * (1 + 2e-6) }, why: '相対 2×10⁻⁶ —— 許容の外' },
  { key: 'gZeroXZero', p: { G: 0, cLight: 30, kappaT: 0 }, why: 'G_0 = 0 は X_k = 0 だけ(厳密)' },
  { key: 'gZeroXTiny', p: { G: 0, cLight: 30, kappaT: 1e-19 }, why: 'G_0 = 0 で X_k ≠ 0(旧判定は成立 —— 新判定は不成立)' },
  { key: 'clamped', p: { G: 1e6, cLight: 1, kappaT: 1 }, why: '導出値 10⁶ が値域 [0,1] の外(クランプ)' },
  { key: 'gNegative', p: { G: -1, cLight: 30, kappaT: 0 }, why: 'G_0 < 0' },
  { key: 'cZero', p: { G: 1, cLight: 0, kappaT: 0 }, why: 'c_0 = 0' },
  { key: 'xNegative', p: { G: 1, cLight: 30, kappaT: -1 / 900 }, why: 'X_k < 0' },
  { key: 'nonFinite', p: { G: 1, cLight: 30, kappaT: NaN }, why: '有限でない' },
  { key: 'visualDefault', p: { G: 1, cLight: 30, kappaT: 1 / 60 }, why: '可視化の既定(X_k = 1/60 ≠ G_0/c_0² = 1/900)' },
  { key: 'grcalNatural', p: { G: 0.25, cLight: 30, kappaT: 1 / 300 }, why: '🛰 grcal の素の値(1/300 ≠ 1/3600)' },
  { key: 'grcalLocked', p: { G: 0.25, cLight: 30, kappaT: 0.25 / 900 }, why: '🛰 系の導出値' }].map((o) => Object.freeze(o)));
function partL(HP) {
  const rows = LOCK_CASES.map((cs) => {
    const h = HP.physLockAutoOnOf({ params: Object.assign({}, cs.p) }), r = autoOnRef(cs.p), pc = HP.physLockCalc({ params: Object.assign({}, cs.p) });
    return { key: cs.key, why: cs.why, p: { G: cs.p.G, cLight: cs.p.cLight, kappaT: Number.isFinite(cs.p.kappaT) ? cs.p.kappaT : String(cs.p.kappaT) },
      html: { ok: h.ok, reason: h.reason }, ref: { ok: r.ok, reason: r.reason }, clampedHtml: !!pc.clamped, agree: h.ok === r.ok && h.reason === r.reason };
  });
  return { rows, agree: rows.every((r) => r.agree), version: HP.PHYS_LOCK_AUTO_VERSION || null };
}

/* ───────── P: 内蔵の全本の数え ───────── */
function partP(HP, quick) {
  const all = HP.allPresets();
  const list = quick ? all.slice(0, 12) : all;
  const rows = [];
  for (const p of list) {
    HP.loadPreset(p.id, false);
    const S = HP.sim, flag = HP.physLock(), j = HP.physLockAutoOnOf(S);
    const S2 = HP.coord3d.makeSim(); S2.build(clone(p));
    rows.push({ id: p.id, emoji: p.emoji || '', role: p.familyRole || null, on: flag, judge: j.ok, reason: j.reason, kappaT: S.params.kappaT, G: S.params.G, cLight: S.params.cLight,
      bitSame: Object.is(S.params.kappaT, S2.params.kappaT), derivedBitSame: j.ok ? !!j.bitSame : null });
  }
  const on = rows.filter((r) => r.on);
  const byRole = {};
  for (const r of rows) { const k = r.role || 'none'; byRole[k] = byRole[k] || { n: 0, on: 0 }; byRole[k].n++; if (r.on) byRole[k].on++; }
  return { n: rows.length, on: on.length, off: rows.length - on.length, byRole,
    flagEqJudge: rows.every((r) => r.on === r.judge), allBitSame: rows.every((r) => r.bitSame), onDerivedBitSame: on.filter((r) => r.derivedBitSame).length,
    onIds: on.map((r) => r.id), rows };
}

/* ───────── K: html の定数との照合 ───────── */
function partK(HP, html) {
  const src = fs.readFileSync(html, 'utf8');
  const m = /REL_DRAG_INVSQ_C1=([^;]+);/.exec(src);
  const c1Html = m ? Function('return ' + m[1])() : null;
  const relM = /const PHYS_LOCK_AUTO_REL=([^;]+);/.exec(src);
  return { C1, c1Html, c1BitSame: c1Html !== null && Object.is(c1Html, C1), autoRelHtml: relM ? Number(relM[1]) : null, autoRelSame: !!relM && Number(relM[1]) === AUTO_REL,
    version: HP.PHYS_LOCK_AUTO_VERSION || null };
}

export function gatesOf(J) {
  const ex = J.F.sun;
  const rel = (a, b) => Math.abs(a - b) / Math.abs(b);
  return {
    c1: J.K.c1BitSame,
    autoRel: J.K.autoRelSame,
    ykSI: rel(ex.YkSI, YK_REF) <= 1e-8,
    rdOverRs: rel(ex.rdOverRs, 5 / C1) <= 1e-12,
    lockTier: ex.C !== null && rel(ex.C.YkFromXk, ex.B.Yk) <= 1e-12 && rel(ex.C.kappaDFromXk * ex.si.m, ex.B.rs) <= 1e-12,
    lockAgree: J.L.agree,
    flagEqJudge: J.P.flagEqJudge,
    bitSame: J.P.allBitSame,
  };
}

export function runAll(HP, html, o = {}) {
  const t = {};
  let t0 = Date.now();
  const tick = (k) => { t[k] = { wallSec: (Date.now() - t0) / 1000 }; t0 = Date.now(); };
  const K = partK(HP, html); tick('K');
  const d = PIN.decl.mercurySunInertial3d;
  const book = { id: 'mercurySunInertial3d', G: d.physics.G, cLight: d.physics.cLight, kappaT: d.physics.kappaT, scaleExp: d.scaleExp, m: d.bodies[0].m, R: d.bodies[0].radius };
  const F = { symbols: SYMBOLS, oldToNew: OLD_TO_NEW, sun: sunExample(book) }; tick('F');
  const L = partL(HP); tick('L');
  const P = partP(HP, !!o.quick); tick('P');
  const J = { quick: !!o.quick, K, F, L, P };
  J.gates = gatesOf(J);
  J.ok = Object.values(J.gates).every(Boolean);
  J.timing = t;
  return J;
}

export async function main() {
  const TARGET = process.env.W315A_TARGET || 'beta/index.html';
  const OUT = process.env.W315A_OUT ? (path.isAbsolute(process.env.W315A_OUT) ? process.env.W315A_OUT : path.join(ROOT, process.env.W315A_OUT)) : path.join(ROOT, 'tests', 'out', 'symbols-w315a.json');
  const quick = process.env.W315A_QUICK === '1';
  if (quick && !process.env.W315A_OUT) throw new Error('試走(W315A_QUICK=1)は W315A_OUT を指定する(正本を書かない)');
  const html = path.isAbsolute(TARGET) ? TARGET : path.join(ROOT, TARGET);
  const t0 = Date.now();
  const W281A_SCOPE = w281aScopeStamp(html, REGEN_SCOPE);
  const { HP } = loadHtmlMain(html);
  const R = runAll(HP, html, { quick });
  const out = { version: HARNESS_VERSION, generator: 'tests/exp-w315a-symbols.mjs', target: TARGET,
    targetSha256: crypto.createHash('sha256').update(fs.readFileSync(html)).digest('hex'),
    ruling: '原仮定者の裁定(第117報)・決断事項 AN414(記号の体系: 時空係数 X_k・引きずり係数 Y_k・決定力定数 κ_D = 2G/c²・r_s = κ_D m・r_d = Y_k m・光速定数 c・重力定数 G・' +
      '基準光速 c_0・基準重力 G_0・局所光速 c_loc・局所重力 G_loc・物理対応ロックの読込時の自動 ON)・統括の推奨 AN417・AN419・AN420・統括の検証項目 R242。' +
      '保存形式の鍵とエンジンの式は変えない(表示の文とロックのフラグだけ)',
    physLockAutoVersion: HP.PHYS_LOCK_AUTO_VERSION || null, ...R };
  out.elapsedS = (Date.now() - t0) / 1000;
  const CODE = ['tests/exp-w315a-symbols.mjs', 'tests/lib-w280b-emgrid.mjs', 'tests/lib-w279b-headless.mjs', 'tests/lib-w272e-provenance.mjs', 'tests/lib-w281a-scope.mjs'];
  out.meta = Object.assign(provenanceMeta({ root: ROOT, wave: '第315便a', target: TARGET, code: CODE, inputs: [TARGET, DECL_FILE] }), {
    harnessVersion: HARNESS_VERSION,
    engine: 'Node(tests/lib-w280b-emgrid.mjs の loadHtmlMain —— html の本文をそのまま実行・1 プロセス)',
    notClaim: NOT_CLAIM });
  Object.assign(out.meta, W281A_SCOPE, w281aStableInputs(ROOT, out.meta.inputs));
  fs.mkdirSync(path.dirname(OUT), { recursive: true });
  fs.writeFileSync(OUT, JSON.stringify(out, null, 1) + '\n');
  const ex = out.F.sun;
  console.log('→', path.relative(ROOT, OUT), 'ok=' + out.ok, JSON.stringify(out.gates), out.elapsedS + ' s', JSON.stringify(out.timing));
  console.log('太陽(本 ' + ex.book.id + ' —— G_0=' + ex.book.G + ' c_0=' + ex.book.cLight + ' X_k=' + ex.book.kappaT + ' m=' + ex.book.m + ' R=' + ex.book.R + ' scaleExp=' + JSON.stringify(ex.book.scaleExp) + ')',
    'r_s=' + ex.rsKm.toFixed(6) + ' km r_d=' + ex.rdKm.toFixed(6) + ' km r_d/r_s=' + ex.rdOverRs + ' Y_k(SI)=' + ex.YkSI + ' κ_D(SI)=' + ex.kappaDSI + ' X_k m/r_s=' + ex.XkMOverRs);
  console.log('L', out.L.rows.map((r) => r.key + ':' + r.html.ok + '/' + r.ref.ok).join(' '));
  console.log('P n=' + out.P.n + ' on=' + out.P.on + ' off=' + out.P.off + ' byRole=' + JSON.stringify(out.P.byRole) + ' flag=judge ' + out.P.flagEqJudge + ' bitSame ' + out.P.allBitSame + ' onDerivedBitSame ' + out.P.onDerivedBitSame);
}
if (IS_MAIN) await main();
