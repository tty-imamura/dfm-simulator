// 第300便c(原仮定者の裁定(第90報)④「太陽・全惑星・トリトン以上の 7 大衛星を 1 つにまとめた三次元サンプル —— 特定の日時の観測値で開始」
// 「観測レコードは別途プロンプトで取得する」・統括の検証項目 R177)—— **太陽系 16 体の三次元の本の器**(入力の検査・単位の変換・宣言の生成・刻みの検査)。
//
// ■ 何を持つか(数値の観測レコードは持たない —— 別途取得する。**内蔵の本には入れない**)
//   ・入力の契約 tests/data-w300c-solar16-schema.json(構造)と checkSolar16(意味): 欠測・重複・余分な成員・元期の混在(天体ごとの epochJdTdb)・
//     系の重心と天体中心の混在(NAIF の 1〜9・center≠body・質量の includes≠body)・光行時間補正(correction≠NONE)・単位(文字列と、
//     太陽からの距離・速さ・質量の桁の目安 —— au/m・km/d の取り違えの検出)・原点(16 体の重心と全運動量 —— 太陽中心の座標の検出)・
//     衛星の中心(親天体の Hill 半径の内側に束縛 —— 惑星中心の座標を太陽系重心と書いた取り違えの検出)。
//   ・単位系 UNITS(1 単位 = 10⁹ m / 10⁵ s / 10²⁸ kg —— G=6.674・c₀=29979.2458 は他の実単位の本と同じ数。座標の値域 ±5000 に海王星の遠日点
//     4.54×10¹² m が入る)への変換 toUnits と、16 体の宣言 solar16Decl(全天体 free・入力の 16 体の重心と全運動量を 0 へ置き直す〔量を記録〕・
//     刻みはイオの接触軌道の周期 / 360・自転軸はすべて有効化〔IAU の北極を資料の黄道傾斜角で黄道へ〕・gain 0 の基準)。
//   ・刻みの検査 stepCheck(h・h/2・h/4 —— 同じ時間の終わりの位置の差)。
//   ・人工の入力 syntheticRecord(試験だけ —— **実際の配置ではない**。円軌道・丸めた数・出典は SYNTHETIC)と、不正な入力の変種 badVariants。
//
// ■ 受理器の限界(第300便c で確かめた —— 数は PHYSICS〔第300便c〕)
//   ・半径の下限 0.01 単位 = 10⁴ km は地球型惑星・月・大衛星(1353〜6371 km)より大きい → 本便で physics.radiusFloor(宣言した本だけ 0.001 まで)を足した。
//   ・ソフトニングの下限は physics.softeningFloor(0.001 = 1000 km —— 第277便b の既存の宣言)で足りる(最も近い衛星で力の相対の差 ≈1.5(ε/r)² ≈1.2×10⁻⁵)。
//   ・camera.scale の上限 3000(受理器とズームの両方)は天王星(≈2900 単位)までを短辺に収め、海王星(≈4500)は外 —— 本便は変えない(既存の本 3 本の署名が動く)。
//
// ■ 言わないこと
//   ・人工の入力の結果を「太陽系の配置の検証」と呼ばない。観測レコードの数値を作らない・補わない(不確かさも資料のものだけ)。
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import * as W302A from './lib-w302a-wbg.mjs';   // 第302便a: gain ⇔ W_bg の読み書き(器の側)
export const LIB_VERSION = 'w300c-solar16-lib-1';
export const RESERVED_ID = 'solarSystem16Inertial3d';   // 観測レコードが届いた便で使う本の id(本便では内蔵に入れない —— QA docs.solar16Contract300 が照合)
const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
export const SCHEMA_PATH = 'tests/data-w300c-solar16-schema.json';
export const loadSchema = () => JSON.parse(fs.readFileSync(path.join(ROOT, SCHEMA_PATH), 'utf8'));
export const UNITS = Object.freeze({ L: 9, T: 5, M: 28 });
export const G_UNITS = 6.674, C_UNITS = 29979.2458, KAPPA_T = 7.425826474101849e-9;
export const KM_PER_UNIT = 1e6, KMS_PER_UNIT = 10, KG_PER_UNIT = 1e28, S_PER_UNIT = 1e5;
export const G_SI = 6.674e-11;
export const AU_KM = 1.495978707e8;
export const SOFTENING = 0.001, RADIUS_FLOOR = 0.001;
export const CAMERA_MAX = 3000;
/** 積分器: leapfrog(二次)—— 人工の入力のイオ 1 公転(360 步)で既定の semi(一次 —— h/h4 と h/2/h4 の比 3.0)の終わりの位置の差 8597 km に対し
 *  leapfrog は 251 km(比 5.0)。観測の元期から走らせて暦表と比べる本なので二次を既定にした(三次元で受理される積分器 —— COORD3D_SUPPORTED)。 */
export const INTEGRATOR = 'leapfrog';
/** 成員(並びは本の粒子の並び)。parent: 衛星の親。aAu: 太陽からの距離の桁の目安(単位の取り違えの検出だけ —— 本の数値には使わない)。 */
export const MEMBERS = Object.freeze([
  { key: 'sun', ja: '太陽', en: 'Sun', naif: 10 },
  { key: 'mercury', ja: '水星', en: 'Mercury', naif: 199, aAu: 0.39 },
  { key: 'venus', ja: '金星', en: 'Venus', naif: 299, aAu: 0.72 },
  { key: 'earth', ja: '地球', en: 'Earth', naif: 399, aAu: 1.0 },
  { key: 'moon', ja: '月', en: 'Moon', naif: 301, parent: 'earth' },
  { key: 'mars', ja: '火星', en: 'Mars', naif: 499, aAu: 1.52 },
  { key: 'jupiter', ja: '木星', en: 'Jupiter', naif: 599, aAu: 5.2 },
  { key: 'io', ja: 'イオ', en: 'Io', naif: 501, parent: 'jupiter' },
  { key: 'europa', ja: 'エウロパ', en: 'Europa', naif: 502, parent: 'jupiter' },
  { key: 'ganymede', ja: 'ガニメデ', en: 'Ganymede', naif: 503, parent: 'jupiter' },
  { key: 'callisto', ja: 'カリスト', en: 'Callisto', naif: 504, parent: 'jupiter' },
  { key: 'saturn', ja: '土星', en: 'Saturn', naif: 699, aAu: 9.5 },
  { key: 'titan', ja: 'タイタン', en: 'Titan', naif: 606, parent: 'saturn' },
  { key: 'uranus', ja: '天王星', en: 'Uranus', naif: 799, aAu: 19.2 },
  { key: 'neptune', ja: '海王星', en: 'Neptune', naif: 899, aAu: 30.1 },
  { key: 'triton', ja: 'トリトン', en: 'Triton', naif: 801, parent: 'neptune' }].map((z) => Object.freeze(z)));
export const memberOf = (k) => MEMBERS.find((z) => z.key === k) || null;
export const STEP_BASIS = Object.freeze({ center: 'jupiter', orbiter: 'io', stepsPerOrbit: 360 });
/** 検査の閾値(意味の検査 —— 単位の取り違えや中心の取り違えを捕まえる目安。実データの精度の判定ではない)。 */
export const CHECK_TOL = Object.freeze({
  comKm: 1000,          // 16 体の重心の原点からの距離(太陽系重心の原点なら 1 km 未満 —— 太陽中心の座標なら 10⁵〜10⁶ km)
  comKmS: 1e-4,         // 16 体の全運動量 / 全質量(太陽系重心なら 10⁻⁸ km/s 未満 —— 太陽中心なら 10⁻² km/s の桁)
  distFactor: [0.5, 1.6],   // 太陽からの距離 / aAu
  speedFactor: [0.5, 1.6],  // 太陽に対する速さ / 円軌道の速さ √(GM☉/r)
  massKg: [1e20, 1e31],
  hillFrac: 0.5,        // 衛星は親の Hill 半径の 0.5 倍の内側
  obliquity: [84381, 84382] });
export const ERR = Object.freeze({
  schema: 'schema', missing: 'missing', duplicate: 'duplicate', extra: 'extra', epochMix: 'epochMix', timeScale: 'timeScale', barycenter: 'barycenterMix',
  lightTime: 'lightTime', units: 'units', unitScale: 'unitScale', origin: 'origin', satCenter: 'satelliteCenter', massIncl: 'massIncludes', nonFinite: 'nonFinite',
  frame: 'frame', source: 'source', uncertainty: 'uncertainty' });

/* ── 構造の検査(スキーマの部分集合 —— type/const/enum/required/additionalProperties/properties/items/minItems/maxItems/minimum/maximum/exclusiveMinimum/minLength/maxLength/pattern)── */
export function schemaErrors(sch, x, at = '$') {
  const out = [], ty = (v) => (v === null) ? 'null' : Array.isArray(v) ? 'array' : (typeof v === 'number' && Number.isInteger(v)) ? 'integer' : typeof v;
  const go = (s, v, p) => {
    if (!s) return;
    if (s.const !== undefined && v !== s.const) { out.push(p + ' は ' + JSON.stringify(s.const)); return; }
    if (s.enum && s.enum.indexOf(v) < 0) { out.push(p + ' は ' + s.enum.join('/') + ' のどれか'); return; }
    if (s.type) {
      const t = ty(v), okT = (s.type === 'number') ? (t === 'number' || t === 'integer') && Number.isFinite(v) : (t === s.type);
      if (!okT) { out.push(p + ' の型は ' + s.type); return; }
    }
    if (typeof v === 'number') {
      if (s.minimum !== undefined && !(v >= s.minimum)) out.push(p + ' ≥ ' + s.minimum);
      if (s.maximum !== undefined && !(v <= s.maximum)) out.push(p + ' ≤ ' + s.maximum);
      if (s.exclusiveMinimum !== undefined && !(v > s.exclusiveMinimum)) out.push(p + ' > ' + s.exclusiveMinimum);
    }
    if (typeof v === 'string') {
      if (s.minLength !== undefined && v.length < s.minLength) out.push(p + ' の長さ ≥ ' + s.minLength);
      if (s.maxLength !== undefined && v.length > s.maxLength) out.push(p + ' の長さ ≤ ' + s.maxLength);
      if (s.pattern && !(new RegExp(s.pattern)).test(v)) out.push(p + ' の形 ' + s.pattern);
    }
    if (Array.isArray(v)) {
      if (s.minItems !== undefined && v.length < s.minItems) out.push(p + ' の要素数 ≥ ' + s.minItems);
      if (s.maxItems !== undefined && v.length > s.maxItems) out.push(p + ' の要素数 ≤ ' + s.maxItems);
      if (s.items) v.forEach((z, i) => go(s.items, z, p + '[' + i + ']'));
    }
    if (v && typeof v === 'object' && !Array.isArray(v)) {
      for (const k of (s.required || [])) if (v[k] === undefined) out.push(p + '.' + k + ' が無い');
      if (s.additionalProperties === false && s.properties) for (const k of Object.keys(v)) if (!(k in s.properties)) out.push(p + '.' + k + ' は契約に無い鍵');
      if (s.properties) for (const k of Object.keys(s.properties)) if (v[k] !== undefined) go(s.properties[k], v[k], p + '.' + k);
    }
  };
  go(sch, x, at);
  return out;
}

const sub = (a, b) => [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
const nrm = (a) => Math.hypot(a[0], a[1], a[2]);
const posOf = (b) => [b.state.x, b.state.y, b.state.z], velOf = (b) => [b.state.vx, b.state.vy, b.state.vz];

/**
 * 入力の検査(構造 → 意味)。戻り値 {ok, errors:[{code, msg}], warnings:[…], derived:{…}}。入力は書き換えない。
 */
export function checkSolar16(rec, o = {}) {
  const errors = [], warnings = [], E = (code, msg) => errors.push({ code, msg });
  const sch = o.schema || loadSchema();
  for (const m of schemaErrors(sch, rec)) {
    // 構造の違反のうち意味の符号で読めるものは符号を付ける(元期の時刻系・光行時間・単位・中心・質量の includes・枠)
    const code = /\.epoch\.timeScale/.test(m) ? ERR.timeScale : /\.correction/.test(m) ? ERR.lightTime : /\.units\./.test(m) ? ERR.units
      : /\.center /.test(m) ? ERR.barycenter : /\.mass\.includes/.test(m) ? ERR.massIncl : /\.frame\./.test(m) ? ERR.frame
      : /\.uncertainty/.test(m) ? ERR.uncertainty : /\.source\b/.test(m) ? ERR.source : ERR.schema;
    E(code, m);
  }
  if (!rec || typeof rec !== 'object' || !Array.isArray(rec.bodies)) return { ok: false, errors, warnings, derived: null };
  const B = rec.bodies, seenK = new Map(), seenN = new Map();
  B.forEach((b, i) => {
    if (!b || typeof b !== 'object') return;
    if (seenK.has(b.key)) E(ERR.duplicate, 'bodies[' + i + '] の key ' + b.key + ' が重複(bodies[' + seenK.get(b.key) + '])'); else seenK.set(b.key, i);
    if (seenN.has(b.naifId)) E(ERR.duplicate, 'bodies[' + i + '] の naifId ' + b.naifId + ' が重複'); else seenN.set(b.naifId, i);
    const mb = memberOf(b.key);
    if (!mb) { E(ERR.extra, 'bodies[' + i + '] の key ' + b.key + ' は成員でない'); return; }
    if (typeof b.naifId === 'number' && b.naifId >= 0 && b.naifId <= 9) E(ERR.barycenter, b.key + ' の naifId ' + b.naifId + ' は系の重心(天体中心 ' + mb.naif + ' を使う)');
    else if (b.naifId !== mb.naif) E(ERR.barycenter, b.key + ' の naifId ' + b.naifId + ' は天体中心 ' + mb.naif + ' でない');
    if (b.epochJdTdb !== undefined && rec.epoch && b.epochJdTdb !== rec.epoch.jdTdb) E(ERR.epochMix, b.key + ' の元期 ' + b.epochJdTdb + ' が全体の元期 ' + rec.epoch.jdTdb + ' と違う');
    if (b.state) for (const k of ['x', 'y', 'z', 'vx', 'vy', 'vz']) if (!Number.isFinite(b.state[k])) E(ERR.nonFinite, b.key + '.state.' + k + ' が有限数でない');
  });
  for (const m of MEMBERS) if (!seenK.has(m.key)) E(ERR.missing, m.ja + '(' + m.key + ')が無い');
  if (errors.length) return { ok: false, errors, warnings, derived: null };
  // ---- 意味の検査(数値)
  const by = Object.fromEntries(B.map((b) => [b.key, b]));
  const sun = by.sun, muSunKm = G_SI * sun.mass.kg / 1e9;   // km³/s²
  for (const b of B) if (!(b.mass.kg >= CHECK_TOL.massKg[0] && b.mass.kg <= CHECK_TOL.massKg[1])) E(ERR.unitScale, b.key + ' の質量 ' + b.mass.kg + ' kg が桁の目安 ' + CHECK_TOL.massKg.join('〜') + ' の外(kg 以外の単位の疑い)');
  for (const m of MEMBERS) if (m.aAu) {
    const b = by[m.key], r = nrm(sub(posOf(b), posOf(sun))), v = nrm(sub(velOf(b), velOf(sun))), fr = r / (m.aAu * AU_KM), fv = v / Math.sqrt(muSunKm / r);
    if (!(fr >= CHECK_TOL.distFactor[0] && fr <= CHECK_TOL.distFactor[1])) E(ERR.unitScale, m.key + ' の太陽からの距離 ' + r.toExponential(3) + ' km が目安の ' + fr.toPrecision(3) + ' 倍(km 以外の単位の疑い)');
    else if (!(fv >= CHECK_TOL.speedFactor[0] && fv <= CHECK_TOL.speedFactor[1])) E(ERR.unitScale, m.key + ' の太陽に対する速さ ' + v.toPrecision(4) + ' km/s が円軌道の速さの ' + fv.toPrecision(3) + ' 倍(km/s 以外の単位の疑い)');
  }
  let M = 0; const c = [0, 0, 0], p = [0, 0, 0];
  for (const b of B) { const m = b.mass.kg; M += m; for (let q = 0; q < 3; q++) { c[q] += m * posOf(b)[q]; p[q] += m * velOf(b)[q]; } }
  const comKm = nrm(c) / M, comKmS = nrm(p) / M;
  if (!(comKm <= CHECK_TOL.comKm) || !(comKmS <= CHECK_TOL.comKmS)) E(ERR.origin, '16 体の重心が原点から ' + comKm.toPrecision(3) + ' km・全運動量/全質量 ' + comKmS.toPrecision(3) + ' km/s(目安 ' + CHECK_TOL.comKm + ' km・' + CHECK_TOL.comKmS + ' km/s —— 太陽系重心の原点でない疑い)');
  const sats = {};
  for (const m of MEMBERS) if (m.parent) {
    const b = by[m.key], P = by[m.parent], rr = sub(posOf(b), posOf(P)), vv = sub(velOf(b), velOf(P)), r = nrm(rr), v = nrm(vv);
    const mu = G_SI * (P.mass.kg + b.mass.kg) / 1e9, rP = nrm(sub(posOf(P), posOf(sun))), hill = rP * Math.cbrt(P.mass.kg / (3 * sun.mass.kg)), eps = 0.5 * v * v - mu / r;
    sats[m.key] = { rKm: r, vKmS: v, hillKm: hill, energy: eps };
    if (!(r < CHECK_TOL.hillFrac * hill && eps < 0)) E(ERR.satCenter, m.ja + 'が' + memberOf(m.parent).ja + 'に束縛されていない(距離 ' + r.toExponential(3) + ' km・Hill 半径の ' + (r / hill).toPrecision(3) + ' 倍・比エネルギー ' + eps.toPrecision(3) + ' —— 座標の中心の取り違えの疑い)');
  }
  return { ok: errors.length === 0, errors, warnings, derived: { comKm, comKmS, massKg: M, satellites: sats } };
}

/* ── 単位の変換と宣言 ── */
const D2R = Math.PI / 180;
/** ICRF の赤道座標の極 (α0, δ0) → 黄道座標(傾斜角 ε は資料の値)の spinAxis の傾き(+z から)・方位(+x から)。 */
export function poleToEcliptic(raDeg, decDeg, obliquityArcsec) {
  const e = obliquityArcsec / 3600 * D2R, a = raDeg * D2R, d = decDeg * D2R;
  const x = Math.cos(d) * Math.cos(a), y = Math.cos(d) * Math.sin(a), z = Math.sin(d);
  const ye = Math.cos(e) * y + Math.sin(e) * z, ze = -Math.sin(e) * y + Math.cos(e) * z;
  let az = Math.atan2(ye, x) / D2R; if (az < 0) az += 360;
  return { tiltDeg: Math.acos(Math.max(-1, Math.min(1, ze))) / D2R, azimuthDeg: az, u: [x, ye, ze] };
}
export const r12 = (x) => Number(x.toPrecision(12));
/** 入力(km・km/s・kg・deg/d)→ 本の単位。重心と全運動量を 0 へ置き直す(置き直した量は返す —— 入力の 16 体以外の質量の分)。 */
export function toUnits(rec) {
  const ob = rec.frame.obliquityArcsec;
  const rows = MEMBERS.map((m) => {
    const b = rec.bodies.find((z) => z.key === m.key);
    const pl = poleToEcliptic(b.pole.raDeg, b.pole.decDeg, ob);
    return { key: m.key, m: b.mass.kg / KG_PER_UNIT, radius: b.radius.km / KM_PER_UNIT,
      x: b.state.x / KM_PER_UNIT, y: b.state.y / KM_PER_UNIT, z: b.state.z / KM_PER_UNIT, vx: b.state.vx / KMS_PER_UNIT, vy: b.state.vy / KMS_PER_UNIT, vz: b.state.vz / KMS_PER_UNIT,
      spin: b.spin.rateDegPerDay * D2R / 86400 * S_PER_UNIT, pole: pl, src: { pole: b.pole.source, spin: b.spin.source } };
  });
  let M = 0; const c = [0, 0, 0], p = [0, 0, 0];
  for (const r of rows) { M += r.m; c[0] += r.m * r.x; c[1] += r.m * r.y; c[2] += r.m * r.z; p[0] += r.m * r.vx; p[1] += r.m * r.vy; p[2] += r.m * r.vz; }
  const dc = c.map((q) => q / M), dv = p.map((q) => q / M);
  for (const r of rows) { r.x -= dc[0]; r.y -= dc[1]; r.z -= dc[2]; r.vx -= dv[0]; r.vy -= dv[1]; r.vz -= dv[2]; }
  return { rows, recentre: { posKm: nrm(dc) * KM_PER_UNIT, velKmS: nrm(dv) * KMS_PER_UNIT } };
}
/** 刻みの基準: イオの木星に対する接触軌道の周期(μ = G(m_J + m_Io)・vis-viva の a)。本の単位。 */
export function ioOsculatingPeriod(rows) {
  const J = rows.find((r) => r.key === STEP_BASIS.center), I = rows.find((r) => r.key === STEP_BASIS.orbiter);
  const r = Math.hypot(I.x - J.x, I.y - J.y, I.z - J.z), v2 = (I.vx - J.vx) ** 2 + (I.vy - J.vy) ** 2 + (I.vz - J.vz) ** 2, mu = G_UNITS * (J.m + I.m);
  const a = 1 / (2 / r - v2 / mu);
  return { a, P: 2 * Math.PI * Math.sqrt(a * a * a / mu), r, mu };
}
/**
 * 16 体の本の宣言(physics・bodies・timeRef・camera・scaleExp)。入力は checkSolar16 を通ったもの。gain は 0 の基準(o.gain で器の写しだけ変える)。
 */
export function solar16Decl(rec, o = {}) {
  const { rows, recentre } = toUnits(rec);
  const io = ioOsculatingPeriod(rows), pRef = r12(io.P), stepDt = r12(io.P / STEP_BASIS.stepsPerOrbit);
  const gain = (typeof o.gain === 'number') ? o.gain : 0;
  const physics = { coord: '3d', G: G_UNITS, D0: 0.1, kFrame: 0, q: 3, kRep: 0, muF: 0, gammaN: 0, kappaS: 0, kappaT: KAPPA_T, cLight: C_UNITS, bM: 1, etaRad: 0, pRad: 4,
    gravityX: 0, gravityY: 0, massFloor: 1e-6, geoPN: 3, lambdaPN: 0, pnAlpha: 1.5, radiusScale: 1, softening: SOFTENING, softeningFloor: SOFTENING, radiusFloor: RADIUS_FLOOR,
    timeScale: 1, stepDt, dispMag: 10, stateCarry: 'double', frameWeight: 'share', contactMode: 'none',
    relativeDrag: Object.assign({ law: 'inertial' }, W302A.wbgDeclOf(gain), { eps: SOFTENING, history: 'positions', pairs: 'all' }) };   // 第302便a: 強さは Wbg
  const ep = rec.epoch.jdTdb, eph = rec.source.ephemeris;
  const bodies = rows.map((r) => {
    const m = memberOf(r.key);
    const b = { type: 'single', m: r12(r.m), radius: r12(r.radius), x: r.x, y: r.y, z: r.z, vx: r.vx, vy: r.vy, vz: r.vz, spin: r12(r.spin), pinned: false };
    if (r.key === 'sun') b.pnSource = true;
    b.spinAxis = { enable: true, tiltDeg: r12(r.pole.tiltDeg), azimuthDeg: r12(r.pole.azimuthDeg),
      source: (m.ja + 'の極 α0 ' + r12(rec.bodies.find((z) => z.key === r.key).pole.raDeg) + '°・δ0 ' + r12(rec.bodies.find((z) => z.key === r.key).pole.decDeg) + '° を黄道へ(ε ' + rec.frame.obliquityArcsec + '″・軸は一定の近似)—— ' + r.src.pole).slice(0, 240) };
    return b;
  });
  const iJ = MEMBERS.findIndex((z) => z.key === STEP_BASIS.center), iI = MEMBERS.findIndex((z) => z.key === STEP_BASIS.orbiter);
  const timeRef = { basis: 'orbit', pRef, pair: [iJ, iI], def: 'revolution', source: ('イオの木星に対する接触軌道の周期(入力の元期 JD ' + ep + ' TDB の状態から μ=G(m_J+m_Io)・' + eph + ')').slice(0, 240), stepsPerOrbit: STEP_BASIS.stepsPerOrbit };
  const rMax = Math.max(...rows.map((r) => Math.hypot(r.x, r.y, r.z)));
  const cameraNeeded = 1.1 * rMax;
  const camera = { scale: Math.min(CAMERA_MAX, Number(cameraNeeded.toPrecision(2))) };
  return { id: RESERVED_ID, scaleExp: { L: UNITS.L, T: UNITS.T, M: UNITS.M }, integrator: INTEGRATOR, physics, bodies, timeRef, camera, cameraNeeded, recentre, io };
}
/** 検証前の生の本(器と QA の写し)。 */
export function presetOf(rec, o = {}) {
  const d = solar16Decl(rec, o);
  return { id: d.id, name: '太陽系 16 体(器の写し)', description: '器の写し(内蔵ではない)', emoji: '🧭', sampleClass: 'principle', scaleExp: d.scaleExp, integrator: d.integrator, timeRef: d.timeRef, camera: d.camera,
    world: { boundary: 'none', size: 0 }, physics: d.physics, bodies: d.bodies, overlays: { rotationCurve: false, tempHistogram: false, field: false, trail: true } };
}

/* ── 刻みの検査(h・h/2・h/4 —— 同じ時間の終わりの位置の差)── */
export function stepCheck(HP, preset, o = {}) {
  const clone = (x) => JSON.parse(JSON.stringify(x));
  const v = HP.validatePreset(clone(preset));
  if (!v.ok) return { ok: false, errors: v.errors };
  const dt0 = v.preset.physics.stepDt, steps = o.steps || 360, out = {};
  const finals = [];
  for (const f of [1, 2, 4]) {
    const S = HP.coord3d.makeSim(); S.build(clone(v.preset));
    const E0 = HP.coord3d.totals(S).E;
    for (let k = 0; k < steps * f; k++) S.step(dt0 / f);
    const fin = [];
    for (let i = 0; i < S.n; i++) fin.push([S.x[i], S.y[i], S.z[i]]);
    const fin2 = fin.every((q) => q.every(Number.isFinite)) && !S.hasNaN();
    out['h' + (f === 1 ? '' : f)] = { dt: dt0 / f, steps: steps * f, finite: fin2, dE: (HP.coord3d.totals(S).E - E0) / Math.abs(E0) };
    finals.push(fin);
  }
  const dKm = (a, b) => a.map((q, i) => nrm(sub(q, b[i])) * KM_PER_UNIT);
  const d1 = dKm(finals[0], finals[2]), d2 = dKm(finals[1], finals[2]);
  out.posDiffKm = MEMBERS.map((m, i) => ({ key: m.key, h_h4: d1[i], h2_h4: d2[i] }));
  out.maxKm = { h_h4: Math.max(...d1), h2_h4: Math.max(...d2) };
  out.ok = out.h.finite && out.h2.finite && out.h4.finite;
  return out;
}

/* ── 人工の入力(試験だけ —— **実際の配置ではない**)── */
/**
 * 円軌道・丸めた数の人工の 16 体(太陽系重心の原点・幾何学的・km と km/s・天体中心)。出典は SYNTHETIC。
 * 惑星は太陽のまわりの円軌道(半径は丸めた au・位相と傾きは決まった人工の値)、衛星は親のまわりの円軌道(トリトンは逆行)、最後に 16 体の重心と全運動量を 0 へ。
 */
export function syntheticRecord() {
  const PL = { mercury: [0.4, 3.3e23, 2440, 0], venus: [0.7, 4.9e24, 6050, 50], earth: [1.0, 6.0e24, 6370, 100], mars: [1.5, 6.4e23, 3390, 150],
    jupiter: [5.2, 1.9e27, 69900, 200], saturn: [9.5, 5.7e26, 58200, 250], uranus: [19.2, 8.7e25, 25400, 300], neptune: [30.1, 1.0e26, 24600, 350] };
  const MO = { moon: ['earth', 3.8e5, 7.3e22, 1740, 1], io: ['jupiter', 4.2e5, 8.9e22, 1820, 1], europa: ['jupiter', 6.7e5, 4.8e22, 1560, 1], ganymede: ['jupiter', 1.07e6, 1.5e23, 2630, 1],
    callisto: ['jupiter', 1.88e6, 1.1e23, 2410, 1], titan: ['saturn', 1.22e6, 1.3e23, 2570, 1], triton: ['neptune', 3.5e5, 2.1e22, 1350, -1] };
  const Msun = 2.0e30, mu = (m) => G_SI * m / 1e9;
  const st = {};
  st.sun = { r: [0, 0, 0], v: [0, 0, 0], m: Msun, R: 696000 };
  let k = 0;
  for (const [key, [aAu, m, R, ph]] of Object.entries(PL)) {
    const a = aAu * AU_KM, th = ph * D2R, inc = (1 + (k % 3)) * D2R, vc = Math.sqrt(mu(Msun + m) / a);
    st[key] = { r: [a * Math.cos(th), a * Math.sin(th) * Math.cos(inc), a * Math.sin(th) * Math.sin(inc)], v: [-vc * Math.sin(th), vc * Math.cos(th) * Math.cos(inc), vc * Math.cos(th) * Math.sin(inc)], m, R };
    k++;
  }
  for (const [key, [par, a, m, R, dir]] of Object.entries(MO)) {
    const P = st[par], th = (30 + 20 * k) * D2R, vc = dir * Math.sqrt(mu(P.m + m) / a);
    st[key] = { r: [P.r[0] + a * Math.cos(th), P.r[1] + a * Math.sin(th), P.r[2]], v: [P.v[0] - vc * Math.sin(th), P.v[1] + vc * Math.cos(th), P.v[2]], m, R };
    k++;
  }
  let M = 0; const c = [0, 0, 0], p = [0, 0, 0];
  for (const s of Object.values(st)) { M += s.m; for (let q = 0; q < 3; q++) { c[q] += s.m * s.r[q]; p[q] += s.m * s.v[q]; } }
  for (const s of Object.values(st)) for (let q = 0; q < 3; q++) { s.r[q] -= c[q] / M; s.v[q] -= p[q] / M; }
  const SYN = '人工の入力(SYNTHETIC —— 実際の配置ではない)';
  return { schema: 'w300c-solar16-1', epoch: { jdTdb: 2451545.0, timeScale: 'TDB', calendar: 'SYNTHETIC' },
    frame: { origin: 'SSB', naifOrigin: 0, reference: 'ICRF', plane: 'ecliptic', equinox: 'J2000', obliquityArcsec: 84381.448 },
    units: { position: 'km', velocity: 'km/s', mass: 'kg', radius: 'km', angle: 'deg', spinRate: 'deg/d' }, correction: 'NONE',
    source: { ephemeris: 'SYNTHETIC', provider: 'tests/lib-w300c-solar16.mjs syntheticRecord', retrieved: '2026-10-12', note: SYN },
    bodies: MEMBERS.map((m, i) => { const s = st[m.key];
      return { key: m.key, naifId: m.naif, center: 'body', state: { x: s.r[0], y: s.r[1], z: s.r[2], vx: s.v[0], vy: s.v[1], vz: s.v[2] },
        mass: { kg: s.m, includes: 'body', source: SYN }, radius: { km: s.R, source: SYN },
        pole: { raDeg: 10 * i, decDeg: 60 + (i % 4) * 5, source: SYN }, spin: { rateDegPerDay: (m.key === 'venus' || m.key === 'uranus' || m.key === 'triton') ? -50 - i : 100 + 10 * i, source: SYN } }; }) };
}
/** 不正な入力の変種(どれも拒否されるべき —— code は checkSolar16 の符号)。 */
export function badVariants(rec) {
  const C = (f) => { const r = JSON.parse(JSON.stringify(rec)); f(r); return r; };
  const B = (r, k) => r.bodies.find((b) => b.key === k);
  return [
    { name: '欠測(トリトンが無い)', code: ERR.missing, rec: C((r) => { r.bodies = r.bodies.filter((b) => b.key !== 'triton'); }) },
    { name: '重複(イオが 2 つ)', code: ERR.duplicate, rec: C((r) => { const i = r.bodies.findIndex((b) => b.key === 'triton'); r.bodies[i] = JSON.parse(JSON.stringify(B(r, 'io'))); }) },
    { name: '余分な成員', code: ERR.extra, rec: C((r) => { const i = r.bodies.findIndex((b) => b.key === 'triton'); r.bodies[i].key = 'pluto'; }) },
    { name: '元期の混在', code: ERR.epochMix, rec: C((r) => { B(r, 'mars').epochJdTdb = r.epoch.jdTdb + 1; }) },
    { name: '元期の時刻系 UTC', code: ERR.timeScale, rec: C((r) => { r.epoch.timeScale = 'UTC'; }) },
    { name: '系の重心(木星系の重心 5)と天体中心の混在', code: ERR.barycenter, rec: C((r) => { B(r, 'jupiter').naifId = 5; }) },
    { name: 'center が barycenter', code: ERR.barycenter, rec: C((r) => { B(r, 'saturn').center = 'barycenter'; }) },
    { name: '質量が系の質量', code: ERR.massIncl, rec: C((r) => { B(r, 'jupiter').mass.includes = 'system'; }) },
    { name: '光行時間補正 LT', code: ERR.lightTime, rec: C((r) => { r.correction = 'LT'; }) },
    { name: '単位の宣言 au', code: ERR.units, rec: C((r) => { r.units.position = 'au'; }) },
    { name: '単位の取り違え(位置が au の数)', code: ERR.unitScale, rec: C((r) => { for (const b of r.bodies) { b.state.x /= AU_KM; b.state.y /= AU_KM; b.state.z /= AU_KM; } }) },
    { name: '単位の取り違え(速度が km/d の数)', code: ERR.unitScale, rec: C((r) => { for (const b of r.bodies) { b.state.vx *= 86400; b.state.vy *= 86400; b.state.vz *= 86400; } }) },
    { name: '原点が太陽中心', code: ERR.origin, rec: C((r) => { const s = B(r, 'sun').state, o = [s.x, s.y, s.z, s.vx, s.vy, s.vz]; for (const b of r.bodies) { b.state.x -= o[0]; b.state.y -= o[1]; b.state.z -= o[2]; b.state.vx -= o[3]; b.state.vy -= o[4]; b.state.vz -= o[5]; } }) },
    { name: '衛星を親の中心の座標で書いた', code: ERR.satCenter, rec: C((r) => { const P = B(r, 'saturn').state, b = B(r, 'titan').state; for (const k of ['x', 'y', 'z', 'vx', 'vy', 'vz']) b[k] -= P[k]; }) },
    { name: '有限数でない', code: ERR.schema, rec: C((r) => { B(r, 'venus').state.vx = null; }) },
    { name: '不確かさに出典が無い', code: ERR.uncertainty, rec: C((r) => { B(r, 'earth').uncertainty = { positionKm: 1 }; }) },
    { name: '取得日が無い', code: ERR.source, rec: C((r) => { delete r.source.retrieved; }) }];
}
