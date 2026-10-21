// 第311便c(統括の検証項目 R228・決断事項 AN393 (a))— **h/4(dt/4)の転記の型**(版 w311c-h4carry-1)。
// 第312便c(統括の検証項目 R232・決断事項 AN400)—— **既定を「全部測る」へ戻し、影の記録を足した**(版 w312c-h4carry-2)。
//
// ■ 何のためか
//   調べもの・フィットの器(AN393 (a) —— 振り分けの一覧 tests/data-w311c-h4roles.json の役割 a)は、刻みの 2 段の感度診断(h と h/2)に加えて
//   h/4 を測る。h/h2/h4 の費用は 1 + 2 + 4 で h/4 が 4/7。第311便c は「h と h/2 を先に測り、前の正本(書き換える前の tests/out の JSON)の
//   h と h/2 の値と JSON の表現が一致すれば h/4 の値を転記する」型を入れた。
//
// ■ 第312便c(AN400)で既定を変えた理由: **h と h/2 の一致は h/4 の一致を保証しない**。転記の判定はコード・入力・環境の契約を見ず、
//   h と h/2 の値だけを見る。反例: 前の世代 old(h) = 1・新しい世代 new(h) = (h < 0.003 ? 2 : 1) は h = 0.008・h/2 = 0.004 で同じ値を返すが、
//   h/4 = 0.002 で違う —— 転記は古い h/4 を写して変化を見落とす(自己試験 (7) が型で確かめる)。
//   ・**既定 `H4_CARRY` = 0(全部測る)**。`H4_CARRY=1` は比較の実験だけ(第311便c の転記 —— 正本の `h4Carried`)。
//   ・**影の記録**(既定の動作): h/4 を測ったうえで、単位ごとに「前の正本から転記していたら同じだったか」を記録する ——
//     正本の最上位の `h4Carry:{mode:"shadow", wouldCarry, sameAsFresh, units, differ, …}`(`shadowStamp`)。値の鍵は変えない(h/4 は測った値)。
//     wouldCarry = 転記の判定(h と h/2 の値の鍵が前の正本と一致)が真だった単位の数・sameAsFresh = そのうち転記した値が測った値と
//     JSON の表現で一致した単位の数・differ = 一致しなかった単位(転記なら見落とした単位)。前の正本の時刻・sha(`h4Carry.prev`)は
//     再生成表の除外の鍵(volatilePaths)に置く(走らせるたびに変わる)。
//   ・比べ方は **JSON の表現の一致**(`jsonSame` —— 正本の JSON の書き方〔`JSON.stringify` —— 数は最短の往復表現・鍵の順も含む〕で 1 字も
//     違わないこと)。**−0 と 0・NaN と null を区別しない**(どちらも同じ文字列になる)ので「ビット同一」とは書かない(旧名 `bitSame` は同じ関数)。
//
// ■ 型
//   ・比べる単位(行・仕事)ごとに、器が**値の鍵**を宣言する(h と h/2 の値・その単位の条件 —— 時刻・所要・hash・行番号は除く)。
//   ・`canCarry(ctx, key, fresh, prev)` は転記の判定(wouldCarry)を単位に記録し、**転記の実験(H4_CARRY=1)のときだけ**真を返す。
//     影(既定)では偽を返し、器は h/4 を測る。器は測った後に `shadowCompare(ctx, key, 測った値, 転記していたら入った値)` を呼ぶ。
//   ・転記の実験で転記した単位の h/4 は前の正本の値をそのまま写し、正本の最上位に `h4Carried`(来歴 —— 第311便c の形)を足す。
//   ・前の正本が無い・読めない・版が違うときは、影の記録は「前の正本が使えない」(wouldCarry 0)・転記の実験も全部測る。
//
// ■ しないこと: 判定しない・値を作らない(器が測った値と前の正本の値を比べて記録するだけ)。h と h/2 の一致は収束の証明ではない(2 段の感度診断)。
//   3σ の判定の行(AN393 (b) —— calaudit の例外の登録簿)・🟪 の校正の段(AN393 (c) —— charon-h4・charoneps-h4)には使わない。
import fs from 'node:fs';
import crypto from 'node:crypto';

export const H4_CARRY_VERSION = 'w312c-h4carry-2';
export const H4_CARRY_ENV = 'H4_CARRY';
/** 版の履歴(正本の h4Carried / h4Carry の version はこのどれか —— QA lint.h4Carry311 が世代を版で判る)。 */
export const H4_CARRY_HISTORY = [
  { version: 'w311c-h4carry-1', since: '第311便c(AN393 (a))', note: '既定は転記(H4_CARRY=0 で全部測る)・転記した正本に h4Carried' },
  { version: 'w312c-h4carry-2', since: '第312便c(AN400・R232)', note: '既定は全部測る(H4_CARRY=1 は比較の実験だけ)・影の記録 h4Carry(mode shadow)・比べ方は JSON の表現の一致' },
];

/** 走らせ方: 'shadow'(既定 —— 全部測って影を記録)か 'carry'(H4_CARRY=1 —— 比較の実験だけ)。 */
export function carryMode(env) { return String((env || process.env)[H4_CARRY_ENV] ?? '0') === '1' ? 'carry' : 'shadow'; }
/** 転記を使うか(第312便c から既定は使わない —— H4_CARRY=1 のときだけ)。 */
export function carryEnabled(env) { return carryMode(env) === 'carry'; }

/**
 * 正本の JSON の書き方で同じか(**JSON の表現の一致** —— 数は最短の往復表現・鍵の順も含む)。
 * −0 と 0・NaN と null(と ±Infinity)は同じ文字列になるので区別しない(ビット同一ではない)。
 */
export function jsonSame(a, b) { return JSON.stringify(a) === JSON.stringify(b); }
/** 旧名(第311便c)—— jsonSame と同じ関数(「ビット同一」ではなく JSON の表現の一致)。 */
export const bitSame = jsonSame;

/** 浅い写しから鍵を除く(`drop(o, ['wallSec'])`)。 */
export function omit(o, keys) {
  if (!o || typeof o !== 'object') return o;
  const r = Array.isArray(o) ? o.slice() : Object.assign({}, o);
  for (const k of keys || []) delete r[k];
  return r;
}

/**
 * 前の正本を開く(書き換える**前**に呼ぶ)。影(既定)も転記の実験も前の正本を読む。
 * @param {string} file 前の正本(絶対パス)
 * @param {{mode?:'shadow'|'carry', enabled?:boolean, harnessVersion?:string}} [o] mode の既定は H4_CARRY(enabled は旧の口 —— true = carry・false = shadow)。
 *   harnessVersion を渡すと、前の正本の meta.harnessVersion が違えば前の正本を使わない
 * @returns {{mode:string, enabled:boolean, prev:object|null, why:string, origin:object|null, prevId:object|null, carried:string[], measured:string[], note:object, units:object}}
 *   enabled = 前の正本が使えるか(転記の判定ができるか)
 */
export function openCarry(file, o) {
  const opt = o || {};
  const mode = opt.mode ? (opt.mode === 'carry' ? 'carry' : 'shadow') : (opt.enabled !== undefined ? (opt.enabled ? 'carry' : 'shadow') : carryMode());
  const ctx = { mode, enabled: false, prev: null, why: '', origin: null, prevId: null, carried: [], measured: [], note: {}, units: {} };
  let text = null;
  try { text = fs.readFileSync(file, 'utf8'); } catch { ctx.why = '前の正本が無い'; return ctx; }
  let J = null;
  try { J = JSON.parse(text); } catch { ctx.why = '前の正本が読めない'; return ctx; }
  const m = J.meta || {};
  if (opt.harnessVersion && m.harnessVersion && m.harnessVersion !== opt.harnessVersion) { ctx.why = '前の正本の器の版が違う(' + m.harnessVersion + ')'; return ctx; }
  ctx.enabled = true;
  ctx.prev = J;
  const fileSha = crypto.createHash('sha256').update(text).digest('hex');
  // 元の測定: 前の正本が転記していれば、その元を引き継ぐ(転記が続いても来歴は同じ)
  const po = J.h4Carried && J.h4Carried.origin;
  ctx.origin = po ? Object.assign({}, po) : { fromTargetSha256: m.targetSha256 || null, fromDate: m.generatedAt || m.when || null, fromWave: m.wave || null, fromFileSha256: fileSha };
  // 影の記録の比べた相手(前の正本そのもの —— 時刻と sha は再生成表の除外の鍵)
  ctx.prevId = { generatedAt: m.generatedAt || m.when || null, targetSha256: m.targetSha256 || null, fileSha256: fileSha };
  ctx.why = '前の正本 ' + (m.generatedAt || '?');
  return ctx;
}

/**
 * 単位(行・仕事)の転記の判定: 器が宣言した値の鍵(h と h/2 の値・条件)が前の正本の同じ単位と JSON の表現で一致するか(wouldCarry)を記録し、
 * **転記の実験(mode 'carry')のときだけ**その真偽を返す(影 —— 既定 —— では常に false: 器は h/4 を測る)。
 * @param {object} ctx openCarry の戻り
 * @param {string} key 単位の鍵(記録用)
 * @param {*} fresh いま測った h と h/2 の値の鍵(器が組む)
 * @param {*} prev 前の正本の同じ単位の値の鍵(器が同じ形で組む —— 前の正本に単位が無ければ undefined)
 */
export function canCarry(ctx, key, fresh, prev) {
  const would = !!(ctx && ctx.enabled && prev !== undefined && prev !== null && jsonSame(fresh, prev));
  if (ctx) {
    ctx.units[key] = { wouldCarry: would };
    if (!would) ctx.note[key] = !ctx.enabled ? ctx.why : (prev === undefined || prev === null ? '前の正本に単位が無い' : 'h か h/2 の値が前の正本と違う');
  }
  return would && !!ctx && ctx.mode === 'carry';
}
/** 転記した/測り直した単位を記録する(判定を通らずに測った単位は wouldCarry false で記録する)。 */
export function markCarried(ctx, key) { if (ctx) ctx.carried.push(key); }
export function markMeasured(ctx, key) {
  if (!ctx) return;
  ctx.measured.push(key);
  if (!(key in ctx.units)) { ctx.units[key] = { wouldCarry: false }; if (!ctx.note[key]) ctx.note[key] = ctx.enabled ? '前の正本に単位が無い(形が違う)' : ctx.why; }
}
/**
 * 影の記録: 測った h/4 の値(器が組む —— 正本に入る形)と、転記していたら入った値(前の正本の h/4 —— 同じ形)を JSON の表現で比べる。
 * 転記の判定が真だった単位だけを比べる(偽の単位は null —— 転記しなかった)。
 * @returns {boolean|null}
 */
export function shadowCompare(ctx, key, measured, carried) {
  if (!ctx || !ctx.units[key] || !ctx.units[key].wouldCarry) return null;
  const same = jsonSame(measured, carried);
  ctx.units[key].sameAsFresh = same;
  if (!same) ctx.units[key].firstDiff = compareValueKeys({ v: measured }, { v: carried }, { ignore: /(?!)/ }).diffs.slice(0, 3);
  return same;
}

/**
 * 転記の実験(mode 'carry')の正本の最上位に置く来歴(1 つも転記しなければ null —— 書かない)。影(既定)では null。
 * @param {object} ctx
 * @param {{valueKeys:string, unit:string}} decl 器の宣言(値の鍵の説明・単位の説明)
 */
export function carryStamp(ctx, decl) {
  if (!ctx || ctx.mode !== 'carry' || !ctx.carried.length) return null;
  return { version: H4_CARRY_VERSION, rule: 'h と h/2 を先に測り、前の正本の h と h/2 の値の鍵と JSON の表現が一致した単位だけ h/4(より細かい刻みを含む)を転記した(違う単位は測り直した)—— 比較の実験(H4_CARRY=1)',
    unit: decl.unit, valueKeys: decl.valueKeys, origin: ctx.origin, carried: ctx.carried.slice(), measured: ctx.measured.slice(),
    wallSec: '転記した単位の所要は元の測定の所要(転記)', env: H4_CARRY_ENV + '=1 は比較の実験だけ(既定は全部測る)' };
}

/** 影の記録の除外の鍵(再生成表の volatilePaths —— 前の正本の時刻と sha)。 */
export const SHADOW_VOLATILE = ['/h4Carry/prev/generatedAt', '/h4Carry/prev/targetSha256', '/h4Carry/prev/fileSha256'];
/**
 * 影の記録(既定の動作 —— 正本の最上位の `h4Carry`)。転記の実験(mode 'carry')では null。
 * @param {object} ctx
 * @param {{valueKeys:string, unit:string}} decl 器の宣言(値の鍵の説明・単位の説明)
 */
export function shadowStamp(ctx, decl) {
  if (!ctx || ctx.mode !== 'shadow') return null;
  const keys = Object.keys(ctx.units);
  const would = keys.filter((k) => ctx.units[k].wouldCarry);
  const units = Object.fromEntries(keys.map((k) => { const u = ctx.units[k];
    return [k, Object.assign({ wouldCarry: u.wouldCarry, sameAsFresh: u.wouldCarry ? (u.sameAsFresh === undefined ? null : u.sameAsFresh) : null },
      u.wouldCarry ? {} : { why: ctx.note[k] || null }, u.firstDiff ? { firstDiff: u.firstDiff } : {})]; }));
  return { mode: 'shadow', version: H4_CARRY_VERSION,
    rule: 'h/4 は全部測った(値の鍵は測った値)。単位ごとに、前の正本から転記していたら(h と h/2 の値の鍵が前の正本と JSON の表現で一致すれば h/4 を写す —— 第311便c の型)'
      + '測った値と同じだったかを記録する —— 判定ではなく測定(h と h/2 の一致は h/4 の一致を保証しない)',
    compare: 'JSON の表現の一致(−0 と 0・NaN と null を区別しない)', unit: decl.unit, valueKeys: decl.valueKeys,
    prevUsable: !!ctx.enabled, prevWhy: ctx.enabled ? null : ctx.why,
    nUnits: keys.length, wouldCarry: would.length, sameAsFresh: would.filter((k) => ctx.units[k].sameAsFresh === true).length,
    differ: would.filter((k) => ctx.units[k].sameAsFresh === false), unchecked: would.filter((k) => ctx.units[k].sameAsFresh === undefined),
    units, prev: ctx.prevId ? Object.assign({}, ctx.prevId) : null,
    env: H4_CARRY_ENV + '=1 は比較の実験だけ(既定は全部測る)' };
}

/**
 * 2 つの正本を**値の鍵**で比べる(来歴 meta・壁時計の所要・時刻・`h4Carried`・`h4Carry` を除く)。器の 2 回の走行の照合に使う。比べ方は JSON の表現の一致。
 * @param {object} a
 * @param {object} b
 * @param {{ignore?:RegExp}} [o] 除く鍵の名(既定: meta・h4Carried・h4Carry〔第312便c の影の記録〕・elapsedS・elapsedSec・wallSec・generatedAt・when)
 * @returns {{same:boolean, diffs:string[]}}
 */
export function compareValueKeys(a, b, o) {
  const ignore = (o && o.ignore) || /^(meta|h4Carried|h4Carry|elapsedS|elapsedSec|wallSec|generatedAt|when)$/;
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
 * 第312便c(AN400): 既定(影)・影の記録・反例(h と h/2 が同じで h/4 が違う)・JSON の表現の一致(−0 と 0)を足した。
 * @param {string} tmpDir
 */
export function h4CarrySelfTest(tmpDir) {
  const r = {};
  const f = String(tmpDir).replace(/\/$/, '') + '/prev.json', f2 = String(tmpDir).replace(/\/$/, '') + '/prev2.json', f3 = String(tmpDir).replace(/\/$/, '') + '/prev3.json';
  const prev = { meta: { targetSha256: 'a'.repeat(64), generatedAt: '2026-10-20T00:00:00.000Z', wave: '第999便x', harnessVersion: 'v1' },
    rows: [{ key: 'r1', h: 0.1 + 0.2, h2: 1, h4: 7 }, { key: 'r2', h: 2, h2: 3, h4: 8 }] };
  fs.writeFileSync(f, JSON.stringify(prev, null, 1));
  // (1) JSON の表現の一致: 0.1 + 0.2 と 0.30000000000000004 は同じ・1 と 1 + 2⁻⁵² は違う・鍵の順も見る
  r.bits = jsonSame(0.1 + 0.2, 0.30000000000000004) && !jsonSame(1, 1 + Math.pow(2, -52)) && !jsonSame({ a: 1, b: 2 }, { b: 2, a: 1 }) && bitSame === jsonSame;
  // (2) 転記の実験(mode carry): 開く・転記できる/できない・来歴
  const c = openCarry(f, { mode: 'carry', harnessVersion: 'v1' });
  const okSame = canCarry(c, 'r1', { h: 0.30000000000000004, h2: 1 }, { h: prev.rows[0].h, h2: prev.rows[0].h2 });
  const okDiff = canCarry(c, 'r2', { h: 2, h2: 3.0000000000000004 }, { h: 2, h2: 3 });
  const okNone = canCarry(c, 'r3', { h: 1 }, undefined);
  markCarried(c, 'r1'); markMeasured(c, 'r2'); markMeasured(c, 'r3');
  const st = carryStamp(c, { unit: '行', valueKeys: 'h と h2' });
  r.carry = c.enabled && c.mode === 'carry' && okSame && !okDiff && !okNone && /違う/.test(c.note.r2) && /無い/.test(c.note.r3)
    && st && st.version === H4_CARRY_VERSION && st.origin.fromTargetSha256 === 'a'.repeat(64) && st.origin.fromDate === prev.meta.generatedAt && st.origin.fromWave === '第999便x'
    && /^[0-9a-f]{64}$/.test(st.origin.fromFileSha256) && JSON.stringify(st.carried) === '["r1"]' && JSON.stringify(st.measured) === '["r2","r3"]'
    && shadowStamp(c, { unit: '', valueKeys: '' }) === null;
  // (3) 転記が続いても元の測定は同じ(前の正本の h4Carried.origin を引き継ぐ)
  fs.writeFileSync(f2, JSON.stringify(Object.assign({}, prev, { meta: Object.assign({}, prev.meta, { generatedAt: '2026-10-21T00:00:00.000Z', targetSha256: 'b'.repeat(64) }), h4Carried: st }), null, 1));
  const c2 = openCarry(f2, { mode: 'carry' });
  r.originKept = JSON.stringify(c2.origin) === JSON.stringify(st.origin);
  // (4) 既定と無効の経路: 既定は影(H4_CARRY 無し・=0 → 全部測る)・=1 だけ転記・前の正本が無い・器の版が違う・1 つも転記しなければ来歴を書かない
  r.off = carryEnabled({ H4_CARRY: '0' }) === false && carryEnabled({}) === false && carryEnabled({ H4_CARRY: '1' }) === true
    && carryMode({}) === 'shadow' && carryMode({ H4_CARRY: '0' }) === 'shadow' && carryMode({ H4_CARRY: '1' }) === 'carry'
    && !openCarry(f + '.none', { mode: 'carry' }).enabled && !openCarry(f, { mode: 'carry', harnessVersion: 'v2' }).enabled
    && openCarry(f, { enabled: false }).mode === 'shadow' && carryStamp(openCarry(f, { mode: 'carry' }), { unit: '', valueKeys: '' }) === null;
  // (5) 値の鍵の照合: meta・h4Carried・h4Carry・wallSec・elapsedS は見ない・値の 1 bit の差は見る
  const a = { meta: { x: 1 }, rows: [{ v: 1, wallSec: 3 }], elapsedS: 5 }, b = { meta: { x: 2 }, h4Carried: {}, h4Carry: { mode: 'shadow' }, rows: [{ v: 1, wallSec: 9 }], elapsedS: 7 };
  r.compare = compareValueKeys(a, b).same && !compareValueKeys(a, { rows: [{ v: 1 + Math.pow(2, -52), wallSec: 3 }] }).same;
  // (6) 丸めの床の書式
  const F = { a: fmtFloor(3e-17), b: fmtFloor(-2e-13, 1e-12), c: fmtFloor(0), d: fmtFloor(1.23456e-5), e: fmtFloor(123.456), f: floorText(5e-10), g: fmtDiff(1.5e-5, 2.85e6), h: fmtDiff(0.0123, 2.85e6), i: fmtDiff(-705.381, 2849158.8) };
  r.format = F;
  r.formatOk = F.a === '< 1e-12' && F.b === '< 1e-12' && F.c === '< 1e-12' && F.d === '1.235e-5' && F.e === '123.5' && F.f === '5e-10' && F.g === '< 1e-3' && F.h === '0.012' && F.i === '-705.381';
  // (7) 第312便c(AN400): **反例** —— 前の世代 old(h) = 1・新しい世代 new(h) = (h < 0.003 ? 2 : 1)。h = 0.008・h/2 = 0.004 は同じ値、h/4 = 0.002 で違う。
  //     影(既定)は h/4 を測り、転記の判定が真(wouldCarry)でも転記していたら違った(differ)と記録する。転記の実験は古い h/4 を写して変化を見落とす
  {
    const oldF = () => 1, newF = (h) => (h < 0.003 ? 2 : 1), H = 0.008;
    fs.writeFileSync(f3, JSON.stringify({ meta: { targetSha256: 'c'.repeat(64), generatedAt: '2026-10-21T01:00:00.000Z', harnessVersion: 'v1' },
      rows: [{ key: 'x', v: [oldF(H), oldF(H / 2), oldF(H / 4)] }] }, null, 1));
    const run = (mode) => {
      const cx = openCarry(f3, { mode, harnessVersion: 'v1' }), pr = cx.prev.rows[0];
      const v = [newF(H), newF(H / 2)];
      if (canCarry(cx, 'x', v, pr.v.slice(0, 2))) { v.push(pr.v[2]); markCarried(cx, 'x'); }
      else { v.push(newF(H / 4)); markMeasured(cx, 'x'); shadowCompare(cx, 'x', v[2], pr.v[2]); }
      return { cx, v };
    };
    const sh = run('shadow'), ca = run('carry');
    const ss = shadowStamp(sh.cx, { unit: '行', valueKeys: 'v[0..1]' });
    r.counter = { shadowH4: sh.v[2], carryH4: ca.v[2], truthH4: newF(H / 4), wouldCarry: ss && ss.wouldCarry, sameAsFresh: ss && ss.sameAsFresh, differ: ss && ss.differ };
    r.counterOk = sh.v[2] === 2 && ca.v[2] === 1 && ss && ss.mode === 'shadow' && ss.version === H4_CARRY_VERSION && ss.nUnits === 1 && ss.wouldCarry === 1 && ss.sameAsFresh === 0
      && JSON.stringify(ss.differ) === '["x"]' && ss.units.x.wouldCarry === true && ss.units.x.sameAsFresh === false && Array.isArray(ss.units.x.firstDiff)
      && ss.prev && ss.prev.generatedAt === '2026-10-21T01:00:00.000Z' && ss.prev.targetSha256 === 'c'.repeat(64) && /^[0-9a-f]{64}$/.test(ss.prev.fileSha256)
      && carryStamp(sh.cx, { unit: '', valueKeys: '' }) === null && ss.prevUsable === true;
  }
  // (8) 影の記録の数え方: 判定が偽の単位(前の正本に無い・h か h/2 が違う)は sameAsFresh null・判定が真で同じなら sameAsFresh に数える・前の正本が無ければ prevUsable false
  {
    const cx = openCarry(f, { harnessVersion: 'v1' });   // 既定(H4_CARRY が無ければ影)
    const m0 = cx.mode;
    cx.mode = 'shadow';
    const t1 = canCarry(cx, 'r1', { h: 0.30000000000000004, h2: 1 }, { h: prev.rows[0].h, h2: prev.rows[0].h2 });
    markMeasured(cx, 'r1'); shadowCompare(cx, 'r1', 7, prev.rows[0].h4);
    canCarry(cx, 'r2', { h: 2, h2: 4 }, { h: 2, h2: 3 }); markMeasured(cx, 'r2'); const s2 = shadowCompare(cx, 'r2', 9, prev.rows[1].h4);
    markMeasured(cx, 'r4');
    const ss = shadowStamp(cx, { unit: '行', valueKeys: 'h と h2' });
    const none = shadowStamp(openCarry(f + '.none', { mode: 'shadow' }), { unit: '', valueKeys: '' });
    r.shadow = { defaultMode: process.env[H4_CARRY_ENV] === undefined ? m0 : '(H4_CARRY=' + process.env[H4_CARRY_ENV] + ')', nUnits: ss.nUnits, wouldCarry: ss.wouldCarry, sameAsFresh: ss.sameAsFresh };
    r.shadowOk = (process.env[H4_CARRY_ENV] !== undefined || m0 === 'shadow') && t1 === false && s2 === null && ss.nUnits === 3 && ss.wouldCarry === 1 && ss.sameAsFresh === 1 && ss.differ.length === 0
      && ss.units.r1.sameAsFresh === true && ss.units.r2.sameAsFresh === null && /違う/.test(ss.units.r2.why) && ss.units.r4.wouldCarry === false && /無い/.test(ss.units.r4.why)
      && none && none.prevUsable === false && /無い/.test(none.prevWhy) && none.prev === null && none.nUnits === 0;
  }
  // (9) JSON の表現の一致は −0 と 0・NaN と null を区別しない(ビット同一ではない —— 「ビット同一」と書かない理由)
  r.jsonRepr = jsonSame(-0, 0) && !Object.is(-0, 0) && jsonSame(NaN, null) && jsonSame({ v: [-0] }, { v: [0] }) && SHADOW_VOLATILE.length === 3;
  r.ok = !!(r.bits && r.carry && r.originKept && r.off && r.compare && r.formatOk && r.counterOk && r.shadowOk && r.jsonRepr);
  return r;
}

export default { H4_CARRY_VERSION, H4_CARRY_ENV, H4_CARRY_HISTORY, carryMode, carryEnabled, jsonSame, bitSame, omit, openCarry, canCarry, markCarried, markMeasured, shadowCompare,
  carryStamp, shadowStamp, SHADOW_VOLATILE, compareValueKeys, floorText, fmtFloor, fmtDiff, h4CarrySelfTest };
