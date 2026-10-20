// 第311便c(統括の検証項目 R228・決断事項 AN393 (a))— **h/4(dt/4)の転記の型**(版 w311c-h4carry-1)。
//
// ■ 何のためか
//   調べもの・フィットの器(AN393 (a) —— 振り分けの一覧 tests/data-w311c-h4roles.json の役割 a)は、刻みの 2 段の感度診断(h と h/2)に加えて
//   h/4 を測る。h/h2/h4 の費用は 1 + 2 + 4 で h/4 が 4/7。器の契約(依存の閉包の hash)が便ごとに変わって鎖が作り直すたびに、
//   値の変わらない h/4 を測り直していた。本 lib は「**h と h/2 を先に測り、前の正本(書き換える前の tests/out の JSON)の h と h/2 の値と
//   ビット同一なら h/4 の値を転記する・違えば h/4 も測る**」の型を器に与える(古い h/4 と新しい h/h2 を混ぜて次数 p を作らない)。
//
// ■ 型
//   ・比べる単位(行・仕事)ごとに、器が**値の鍵**を宣言する(h と h/2 の値・その単位の条件 —— 時刻・所要・hash・行番号は除く)。
//     比べ方は正本の JSON の書き方(`JSON.stringify` —— 数は最短の往復表現)で 1 字も違わないこと(`bitSame`)。
//   ・転記した単位の h/4 の値は前の正本の値をそのまま写す(所要は前の正本の値 = 元の測定の所要 —— 記録では「転記」)。
//   ・正本の最上位に `h4Carried`(来歴 —— 転記した単位の鍵・測り直した単位の鍵・**元の測定**の正本の targetSha256・generatedAt・wave)を足す。
//     元の測定は前の正本が転記なら前の正本の `h4Carried` の元を引き継ぐ(転記が続いても来歴は同じ —— 読み手の安定 hash を毎回動かさない)。
//     1 つも転記しなければ `h4Carried` を書かない(全部測った正本は今の形とビット同一)。
//   ・環境変数 `H4_CARRY=0` で無効(全部測る)。前の正本が無い・読めない・版が違うときも全部測る。
//
// ■ しないこと: 判定しない・値を作らない(器が測った値と前の正本の値を比べて写すだけ)。h と h/2 の一致は収束の証明ではない(2 段の感度診断)。
//   3σ の判定の行(AN393 (b) —— calaudit の例外の登録簿)・🟪 の校正の段(AN393 (c) —— charon-h4・charoneps-h4)には使わない。
import fs from 'node:fs';
import crypto from 'node:crypto';

export const H4_CARRY_VERSION = 'w311c-h4carry-1';
export const H4_CARRY_ENV = 'H4_CARRY';

/** 転記を使うか(既定は使う —— H4_CARRY=0 で全部測る)。 */
export function carryEnabled(env) { return String((env || process.env)[H4_CARRY_ENV] ?? '1') !== '0'; }

/** 正本の JSON の書き方で同じか(数は最短の往復表現・鍵の順も含む —— 正本のバイトと同じ規則)。 */
export function bitSame(a, b) { return JSON.stringify(a) === JSON.stringify(b); }

/** 浅い写しから鍵を除く(`drop(o, ['wallSec'])`)。 */
export function omit(o, keys) {
  if (!o || typeof o !== 'object') return o;
  const r = Array.isArray(o) ? o.slice() : Object.assign({}, o);
  for (const k of keys || []) delete r[k];
  return r;
}

/**
 * 前の正本を開く(書き換える**前**に呼ぶ)。
 * @param {string} file 前の正本(絶対パス)
 * @param {{enabled?:boolean, harnessVersion?:string}} [o] harnessVersion を渡すと、前の正本の meta.harnessVersion が違えば転記しない
 * @returns {{enabled:boolean, prev:object|null, why:string, origin:object|null, carried:string[], measured:string[], note:object}}
 */
export function openCarry(file, o) {
  const opt = o || {};
  const ctx = { enabled: opt.enabled !== undefined ? !!opt.enabled : carryEnabled(), prev: null, why: '', origin: null, carried: [], measured: [], note: {} };
  if (!ctx.enabled) { ctx.why = H4_CARRY_ENV + '=0(全部測る)'; return ctx; }
  let text = null;
  try { text = fs.readFileSync(file, 'utf8'); } catch { ctx.why = '前の正本が無い'; ctx.enabled = false; return ctx; }
  let J = null;
  try { J = JSON.parse(text); } catch { ctx.why = '前の正本が読めない'; ctx.enabled = false; return ctx; }
  const m = J.meta || {};
  if (opt.harnessVersion && m.harnessVersion && m.harnessVersion !== opt.harnessVersion) { ctx.why = '前の正本の器の版が違う(' + m.harnessVersion + ')'; ctx.enabled = false; return ctx; }
  ctx.prev = J;
  // 元の測定: 前の正本が転記していれば、その元を引き継ぐ(転記が続いても来歴は同じ)
  const po = J.h4Carried && J.h4Carried.origin;
  ctx.origin = po ? Object.assign({}, po) : { fromTargetSha256: m.targetSha256 || null, fromDate: m.generatedAt || m.when || null, fromWave: m.wave || null,
    fromFileSha256: crypto.createHash('sha256').update(text).digest('hex') };
  ctx.why = '前の正本 ' + (m.generatedAt || '?');
  return ctx;
}

/**
 * 単位(行・仕事)の h/4 を転記できるか: 器が宣言した値の鍵(h と h/2 の値・条件)が前の正本の同じ単位とビット同一なら true。
 * @param {object} ctx openCarry の戻り
 * @param {string} key 単位の鍵(記録用)
 * @param {*} fresh いま測った h と h/2 の値の鍵(器が組む)
 * @param {*} prev 前の正本の同じ単位の値の鍵(器が同じ形で組む —— 前の正本に単位が無ければ undefined)
 */
export function canCarry(ctx, key, fresh, prev) {
  const ok = !!(ctx && ctx.enabled && prev !== undefined && prev !== null && bitSame(fresh, prev));
  if (!ok && ctx) ctx.note[key] = !ctx.enabled ? ctx.why : (prev === undefined || prev === null ? '前の正本に単位が無い' : 'h か h/2 の値が前の正本と違う');
  return ok;
}
/** 転記した/測り直した単位を記録する。 */
export function markCarried(ctx, key) { if (ctx) ctx.carried.push(key); }
export function markMeasured(ctx, key) { if (ctx) ctx.measured.push(key); }

/**
 * 正本の最上位に置く来歴(1 つも転記しなければ null —— 書かない)。
 * @param {object} ctx
 * @param {{valueKeys:string, unit:string}} decl 器の宣言(値の鍵の説明・単位の説明)
 */
export function carryStamp(ctx, decl) {
  if (!ctx || !ctx.carried.length) return null;
  return { version: H4_CARRY_VERSION, rule: 'h と h/2 を先に測り、前の正本の h と h/2 の値の鍵とビット同一の単位だけ h/4(より細かい刻みを含む)を転記した(違う単位は測り直した)',
    unit: decl.unit, valueKeys: decl.valueKeys, origin: ctx.origin, carried: ctx.carried.slice(), measured: ctx.measured.slice(),
    wallSec: '転記した単位の所要は元の測定の所要(転記)', env: H4_CARRY_ENV + '=0 で全部測る' };
}

/**
 * 2 つの正本を**値の鍵**で比べる(来歴 meta・壁時計の所要・時刻・`h4Carried` を除く)。器の 2 回の走行の照合に使う。
 * @param {object} a
 * @param {object} b
 * @param {{ignore?:RegExp}} [o] 除く鍵の名(既定: meta・h4Carried・elapsedS・elapsedSec・wallSec・generatedAt・when)
 * @returns {{same:boolean, diffs:string[]}}
 */
export function compareValueKeys(a, b, o) {
  const ignore = (o && o.ignore) || /^(meta|h4Carried|elapsedS|elapsedSec|wallSec|generatedAt|when)$/;
  const diffs = [];
  const walk = (x, y, p) => {
    if (diffs.length > 20) return;
    if (Array.isArray(x) || Array.isArray(y)) {
      if (!Array.isArray(x) || !Array.isArray(y) || x.length !== y.length) { diffs.push(p + '(配列の長さ)'); return; }
      for (let i = 0; i < x.length; i++) walk(x[i], y[i], p + '/' + i);
      return;
    }
    if (x && y && typeof x === 'object' && typeof y === 'object') {
      const ks = [...new Set(Object.keys(x).concat(Object.keys(y)))].filter((k) => !ignore.test(k));
      for (const k of ks) { if (!(k in x) || !(k in y)) { diffs.push(p + '/' + k + '(鍵の有無)'); continue; } walk(x[k], y[k], p + '/' + k); }
      return;
    }
    if (JSON.stringify(x) !== JSON.stringify(y)) diffs.push(p + ': ' + JSON.stringify(x).slice(0, 40) + ' ≠ ' + JSON.stringify(y).slice(0, 40));
  };
  walk(a, b, '');
  return { same: diffs.length === 0, diffs };
}

// ==================================================================================================================
// 第311便c(R228 ③・第310便の教訓): **丸めの床の書式** —— 逐語照合する表に丸めの程度の数(1e-15〜1e-17 など)を書かない。
//   |x| < floor なら '< floor'(床の書き方は 1e-12 の形)。それ以外は toPrecision(digits)。大きな数どうしの差は、差の有効桁(|E| × relFloor)
//   より細かい桁を書かない(`fmtDiff`)。**既存の器の表は変えない**(新しい器が使う)。
// ==================================================================================================================
/** 床の文字列('1e-12' の形 —— 1 × 10^k なら仮数を省く)。 */
export function floorText(floor) {
  const e = Math.floor(Math.log10(floor)), m = floor / Math.pow(10, e);
  return (Math.abs(m - 1) < 1e-12 ? '1' : String(Number(m.toPrecision(3)))) + 'e' + (e < 0 ? '-' : '+') + Math.abs(e);
}
/**
 * 丸めの床つきの数の書式。|x| < floor なら '< 1e-12' のように床で書く(符号を書かない —— 丸めの程度の数の符号は意味を持たない)。
 * @param {number} x
 * @param {number} [floor] 既定 1e-12
 * @param {number} [digits] 有効桁(既定 4)
 */
export function fmtFloor(x, floor, digits) {
  const f = floor || 1e-12;
  if (x === null || x === undefined || !Number.isFinite(x)) return String(x);
  if (Math.abs(x) < f) return '< ' + floorText(f);
  const n = digits || 4, ax = Math.abs(x);
  // 小さい数・大きい数は指数で(1.235e-5 —— 0.00001235 と書かない)。末尾の 0 と指数の + を落とす
  const t = (ax < 1e-3 || ax >= 1e6) ? Number(x).toExponential(n - 1) : Number(x).toPrecision(n);
  return t.replace(/(\.\d*?)0+(e|$)/, '$1$2').replace(/\.(e|$)/, '$1').replace('e+', 'e');
}
/**
 * 大きな数 E の差 d の書式: 差の有効桁は |E| × relFloor(既定 1e-10 —— 倍精度の積み重ねの程度)。|d| がそれより小さければ '< …'(床は 10 の冪へ切り上げ)、
 * 大きければ床の桁より細かい桁を書かない。
 */
export function fmtDiff(d, E, relFloor) {
  const raw = Math.abs(E) * (relFloor || 1e-10);
  if (!(raw > 0) || !Number.isFinite(d)) return fmtFloor(d, 1e-12);
  const f = Math.pow(10, Math.ceil(Math.log10(raw)));
  if (Math.abs(d) < f) return '< ' + floorText(f);
  const e = Math.floor(Math.log10(Math.abs(d))), fe = Math.round(Math.log10(f));
  const digits = Math.max(1, Math.min(15, e - fe + 1));
  return Number(d).toPrecision(digits);
}

/**
 * 自己試験(QA `lint.h4Carry311`): 一時ディレクトリに前の正本の写しを置き、開く・比べる・来歴の引き継ぎ・無効の経路・書式を確かめる。
 * @param {string} tmpDir
 */
export function h4CarrySelfTest(tmpDir) {
  const r = {};
  const f = String(tmpDir).replace(/\/$/, '') + '/prev.json', f2 = String(tmpDir).replace(/\/$/, '') + '/prev2.json';
  const prev = { meta: { targetSha256: 'a'.repeat(64), generatedAt: '2026-10-20T00:00:00.000Z', wave: '第999便x', harnessVersion: 'v1' },
    rows: [{ key: 'r1', h: 0.1 + 0.2, h2: 1, h4: 7 }, { key: 'r2', h: 2, h2: 3, h4: 8 }] };
  fs.writeFileSync(f, JSON.stringify(prev, null, 1));
  // (1) ビット同一: 0.1 + 0.2 と 0.30000000000000004 は同じ・1 と 1 + 2⁻⁵² は違う・鍵の順も見る
  r.bits = bitSame(0.1 + 0.2, 0.30000000000000004) && !bitSame(1, 1 + Math.pow(2, -52)) && !bitSame({ a: 1, b: 2 }, { b: 2, a: 1 });
  // (2) 開く・転記できる/できない・来歴
  const c = openCarry(f, { enabled: true, harnessVersion: 'v1' });
  const okSame = canCarry(c, 'r1', { h: 0.30000000000000004, h2: 1 }, { h: prev.rows[0].h, h2: prev.rows[0].h2 });
  const okDiff = canCarry(c, 'r2', { h: 2, h2: 3.0000000000000004 }, { h: 2, h2: 3 });
  const okNone = canCarry(c, 'r3', { h: 1 }, undefined);
  markCarried(c, 'r1'); markMeasured(c, 'r2'); markMeasured(c, 'r3');
  const st = carryStamp(c, { unit: '行', valueKeys: 'h と h2' });
  r.carry = c.enabled && okSame && !okDiff && !okNone && /違う/.test(c.note.r2) && /無い/.test(c.note.r3)
    && st && st.origin.fromTargetSha256 === 'a'.repeat(64) && st.origin.fromDate === prev.meta.generatedAt && st.origin.fromWave === '第999便x'
    && /^[0-9a-f]{64}$/.test(st.origin.fromFileSha256) && JSON.stringify(st.carried) === '["r1"]' && JSON.stringify(st.measured) === '["r2","r3"]';
  // (3) 転記が続いても元の測定は同じ(前の正本の h4Carried.origin を引き継ぐ)
  fs.writeFileSync(f2, JSON.stringify(Object.assign({}, prev, { meta: Object.assign({}, prev.meta, { generatedAt: '2026-10-21T00:00:00.000Z', targetSha256: 'b'.repeat(64) }), h4Carried: st }), null, 1));
  const c2 = openCarry(f2, { enabled: true });
  r.originKept = JSON.stringify(c2.origin) === JSON.stringify(st.origin);
  // (4) 無効の経路: H4_CARRY=0・前の正本が無い・器の版が違う・1 つも転記しなければ来歴を書かない
  r.off = !openCarry(f, { enabled: false }).enabled && !openCarry(f + '.none', { enabled: true }).enabled && !openCarry(f, { enabled: true, harnessVersion: 'v2' }).enabled
    && carryEnabled({ H4_CARRY: '0' }) === false && carryEnabled({}) === true && carryStamp(openCarry(f, { enabled: true }), { unit: '', valueKeys: '' }) === null;
  // (5) 値の鍵の照合: meta・h4Carried・wallSec・elapsedS は見ない・値の 1 bit の差は見る
  const a = { meta: { x: 1 }, rows: [{ v: 1, wallSec: 3 }], elapsedS: 5 }, b = { meta: { x: 2 }, h4Carried: {}, rows: [{ v: 1, wallSec: 9 }], elapsedS: 7 };
  r.compare = compareValueKeys(a, b).same && !compareValueKeys(a, { rows: [{ v: 1 + Math.pow(2, -52), wallSec: 3 }] }).same;
  // (6) 丸めの床の書式
  const F = { a: fmtFloor(3e-17), b: fmtFloor(-2e-13, 1e-12), c: fmtFloor(0), d: fmtFloor(1.23456e-5), e: fmtFloor(123.456), f: floorText(5e-10), g: fmtDiff(1.5e-5, 2.85e6), h: fmtDiff(0.0123, 2.85e6), i: fmtDiff(-705.381, 2849158.8) };
  r.format = F;
  r.formatOk = F.a === '< 1e-12' && F.b === '< 1e-12' && F.c === '< 1e-12' && F.d === '1.235e-5' && F.e === '123.5' && F.f === '5e-10' && F.g === '< 1e-3' && F.h === '0.012' && F.i === '-705.381';
  r.ok = !!(r.bits && r.carry && r.originKept && r.off && r.compare && r.formatOk);
  return r;
}

export default { H4_CARRY_VERSION, H4_CARRY_ENV, carryEnabled, bitSame, omit, openCarry, canCarry, markCarried, markMeasured, carryStamp, compareValueKeys,
  floorText, fmtFloor, fmtDiff, h4CarrySelfTest };
