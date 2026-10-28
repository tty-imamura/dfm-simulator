// 第318便c(原仮定者の指示(第120報)「支障がなければ、太陽系の１６体サンプルを作成する」・統括の検証項目 R256)——
// **太陽系 16 体の内蔵の本の純関数**(html を読まない —— 在位の本の値は HP を引数で受ける。器 tests/exp-w318c-solar16.mjs と QA が使う)。
//
// ■ 入力(書き換えない・数を作らない・補わない・直さない)
//   tests/data-w318c-solar16-input.json = 原仮定者から受け取った 16 体の本(第120報)の geoPN=3・K1 の側をそのまま(本の単位 10⁹ m / 10⁵ s / 10²⁸ kg ——
//   tests/lib-w300c-solar16.mjs の UNITS と同じ)。記された来歴(本の description・timeRef.source・各天体の spinAxis.source)は J2000.0 TDB(JD 2451545)・SSB・
//   ICRF の J2000 の黄道・幾何の状態・光行時間の補正なし・暦表 DE441 と衛星の暦表 MAR099・JUP365・SAT441・URA184・NEP098・質量は各天体の中心の GM を本の G_0 で kg・
//   極と自転率は同元期の SPICE の姿勢の変換を J2000 で凍結・半径は PCK の参照楕円体の体積相当球・16 体の重心と共通速度を引いた。**本便は一次資料に当たっていない**
//   (この環境から暦表の提供元には届かない —— 暦表との照合はしていない)。並びは tests/lib-w300c-solar16.mjs の MEMBERS(太陽・水星・金星・地球・月・火星・木星・イオ・
//   エウロパ・ガニメデ・カリスト・土星・タイタン・天王星・海王星・トリトン)。
//
// ■ 何をするか
//   ・入力の検査 inputCheck(HP, inp)(**意味の検査** —— 単位・中心・符号の取り違えを捕まえる目安。暦表の精度の判定ではない):
//     重心と全運動量・太陽からの距離と速さ(aAu の桁)・質量(kg = 本の m × 10²⁸ を在位の本の同じ天体の質量と比べる)・G_0 m(km³/s² —— 記録)・
//     衛星は母惑星の Hill 半径の 0.5 倍の内で束縛・接触の軌道要素(惑星は太陽のまわり・衛星は母惑星のまわり: a・e・i —— 在位の本の t = 0 の状態と
//     凍結の写し tests/data-w306a-decl305.json〔第306便a の世代の惑星 7 本〕と衛星の種〔tests/lib-w315d-satk1.mjs の seedOf〕の a・e・i_eq)・
//     自転軸(spinAxis の傾きと方位を在位の本と照合・spinAxis.source に記された極 α0・δ0 から黄道へ写し直して照合)・自転の符号(自転のベクトル sign(spin)·â と
//     公転の極の角 —— 金星・天王星・トリトンは逆行で 90° を越える)・自転の速さ(在位の本と比べる —— 記録)。
//   ・内蔵の本の宣言 builtinDecl(inp, o)(physics・bodies・timeRef・camera・scaleExp・integrator —— 在位の惑星 7 本〔第315便c〕と同じ K1 の短い形)と、
//     1PN の対照の写し controlOf(p)(geoPN 1・λ_PN 1・gLoc と relativeDrag を外す —— 器の写し・内蔵にしない)。
//   ・走行 runOf(HP, p, steps, dt)(終わりの状態・NaN・停止・クランプの数)・刻みの検査 stepTable・K1 − 1PN の差 diffTable。
//   ・衛星の丸めの床 roundingFloor(inp, dt)(SSB の座標の 1 ulp と衛星の軌道の比 —— 記録だけ)・視点の投影 viewFit(inp)(縦長・横長・正方形 × 視点の傾き)。
//
// ■ 言わないこと: 暦表への長期の一致・永年の率・観測の較正・衛星の三体の永年の効きの決定。入力の数を「確かめた」と書かない(意味の検査の目安を通っただけ)。
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import * as S16 from './lib-w300c-solar16.mjs';
import * as SK from './lib-w315d-satk1.mjs';

export const LIB_VERSION = 'w318c-solar16-lib-1';
export const ID = S16.RESERVED_ID;   // solarSystem16Inertial3d(第300便c の予約 id)
const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
export const INPUT_FILE = 'tests/data-w318c-solar16-input.json';
export const loadInput = () => JSON.parse(fs.readFileSync(path.join(ROOT, INPUT_FILE), 'utf8'));
export const MEMBERS = S16.MEMBERS;
export const UNITS = S16.UNITS;
const KM = 1e6, KMS = 10, KG = 1e28, SEC = 1e5;   // 本の単位 → km・km/s・kg・s
const D2R = Math.PI / 180, R2AS = 180 / Math.PI * 3600, CENTURY_S = 36525 * 86400;
/** 逆行の自転(自転のベクトルと公転の極の角が 90° を越える天体 —— IAU の北極と負の自転) */
export const RETRO = Object.freeze(['venus', 'uranus', 'triton']);
/** 在位の本の参照(同じ天体の質量・自転・自転軸・t = 0 の状態)。惑星 7 本(第315便c)・🌦️(地球と月)・🟠(ガリレオ衛星)・💍(タイタン)。
 *  トリトンは在位の本に無い —— 衛星の種(tests/lib-w315d-satk1.mjs の SAT_SEEDS —— 公表の平均要素の近似の GM)と比べる。 */
export const REF_BOOKS = Object.freeze({
  sun: { id: 'mercurySunInertial3d', i: 0 }, mercury: { id: 'mercurySunInertial3d', i: 1 }, venus: { id: 'venusSunInertial3d', i: 1 },
  earth: { id: 'earthMoonSunInertial3d', i: 1 }, moon: { id: 'earthMoonSunInertial3d', i: 2 }, mars: { id: 'marsSunInertial3d', i: 1 },
  jupiter: { id: 'jupiterSunInertial3d', i: 1 }, io: { id: 'jupiterGalilean', i: 1 }, europa: { id: 'jupiterGalilean', i: 2 },
  ganymede: { id: 'jupiterGalilean', i: 3 }, callisto: { id: 'jupiterGalilean', i: 4 }, saturn: { id: 'saturnSunInertial3d', i: 1 },
  titan: { id: 'saturnRingReal', i: 6 }, uranus: { id: 'uranusSunInertial3d', i: 1 }, neptune: { id: 'neptuneSunInertial3d', i: 1 }, triton: null });
/** 凍結の写し tests/data-w306a-decl305.json の惑星 7 本の id(第306便a の世代 —— 衛星の器の母惑星と太陽の種) */
export const PIN_PLANETS = Object.freeze({ mercury: 'mercurySunInertial3d', venus: 'venusSunInertial3d', mars: 'marsSunInertial3d', jupiter: 'jupiterSunInertial3d',
  saturn: 'saturnSunInertial3d', uranus: 'uranusSunInertial3d', neptune: 'neptuneSunInertial3d' });
/** 意味の検査の目安(単位・中心・符号の取り違えを捕まえる —— 暦表の精度の判定ではない) */
export const TOL = Object.freeze({
  comKm: S16.CHECK_TOL.comKm, comKmS: S16.CHECK_TOL.comKmS, distFactor: S16.CHECK_TOL.distFactor, speedFactor: S16.CHECK_TOL.speedFactor, hillFrac: S16.CHECK_TOL.hillFrac,
  massRel: 0.01,        // 在位の本の同じ天体の質量との相対の差(×10 や 10⁻³ の単位の取り違えを捕まえる)
  aRel: 0.05,           // 接触の長半径の相対の差(在位の本の t = 0 の状態・凍結の写し・衛星の種)
  eAbs: 0.02,           // 接触の離心率の差(絶対)
  iDeg: 1.0,            // 傾き(惑星は黄道に対して・衛星は母惑星の赤道に対して)の差 [°]
  axisDeg: 0.5,         // 自転軸の向きの差 [°](在位の本の極は IAU WGCCRE 2009 の一定の近似 —— 入力は同元期の姿勢の変換)
  poleSrcDeg: 1e-6,     // spinAxis.source に記された α0・δ0 を黄道へ写した向きと spinAxis の差 [°](写しの丸めの桁)
  spinRel: 0.05,        // 自転の速さの相対の差(記録 —— 資料の違い〔System III と事実表など〕で 1% の桁は出る)
  satAxisDeg: 10 });    // 衛星の自転のベクトルと公転の極の角(同期の自転 —— 月は 6.7° の桁)
const sub = (a, b) => [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
const dot = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
const cross = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
const nrm = (a) => Math.hypot(a[0], a[1], a[2]);
const angDeg = (a, b) => Math.atan2(nrm(cross(a, b)), dot(a, b)) / D2R;
const clone = (x) => JSON.parse(JSON.stringify(x));
const posOf = (b) => [b.x, b.y, b.z || 0], velOf = (b) => [b.vx, b.vy, b.vz || 0];
/** 自転軸の宣言 → 単位ベクトル(tests/lib-w315d-satk1.mjs の axisOf) */
export const axisOf = SK.axisOf;
/** 接触の要素(本の単位の r・v・μ)—— a・e・i(黄道に対して)・軌道の極 */
export function elementsOf(r, v, mu) {
  const rn = nrm(r), v2 = dot(v, v), a = 1 / (2 / rn - v2 / mu), h = cross(r, v), e = nrm(SK_ecc(r, v, mu));
  return { a, e, iDeg: Math.acos(Math.max(-1, Math.min(1, h[2] / nrm(h)))) / D2R, pole: h.map((q) => q / nrm(h)), r: rn, v: Math.sqrt(v2) };
}
const SK_ecc = (r, v, mu) => { const rn = nrm(r), v2 = dot(v, v), rv = dot(r, v), c = v2 - mu / rn; return [(c * r[0] - rv * v[0]) / mu, (c * r[1] - rv * v[1]) / mu, (c * r[2] - rv * v[2]) / mu]; };
/** spinAxis.source の「α0 X°・δ0 Y°」を読む(無ければ null) */
export function poleOfSource(src) {
  const m = /α0 ([-\d.]+)°・δ0 ([-\d.]+)°/.exec(String(src || ''));
  return m ? { raDeg: Number(m[1]), decDeg: Number(m[2]) } : null;
}
const OBLIQ_AS = 84381.448;   // spinAxis.source に記された黄道傾斜(ε 84381.448″)
/** 在位の本の天体を本の単位(10⁹ m / 10⁵ s / 10²⁸ kg)へ(fL・fT・fM で換算 —— 自転は 1/T) */
function bookBody(HP, ref) {
  if (!ref) return null;
  const p = HP.allPresets().find((q) => q.id === ref.id);
  if (!p) return null;
  const ex = p.scaleExp, fL = Math.pow(10, ex.L - UNITS.L), fT = Math.pow(10, ex.T - UNITS.T), fM = Math.pow(10, ex.M - UNITS.M);
  const conv = (b) => ({ m: b.m * fM, radius: b.radius * fL, x: b.x * fL, y: b.y * fL, z: (b.z || 0) * fL, vx: b.vx * fL / fT, vy: b.vy * fL / fT, vz: (b.vz || 0) * fL / fT,
    spin: Number.isFinite(b.spin) ? b.spin / fT : null, spinAxis: b.spinAxis ? clone(b.spinAxis) : null });
  return { id: p.id, emoji: p.emoji, G: p.physics.G, center: conv(p.bodies[0]), body: conv(p.bodies[ref.i]), bodies: p.bodies.map(conv) };
}
const byKey = (inp) => Object.fromEntries(MEMBERS.map((m, i) => [m.key, inp.bodies[i]]));

/**
 * 入力の検査(意味の検査 —— 単位・中心・符号の取り違えの目安)。戻り値 {ok, gates, tables, notes}。入力は書き換えない。
 */
export function inputCheck(HP, inp) {
  const B = byKey(inp), G = inp.physics.G, gates = {}, notes = [];
  // ① 構造: 16 体・単位・並び(自転軸の宣言と半径の下限)
  gates.count16 = inp.bodies.length === 16 && MEMBERS.length === 16;
  gates.units = JSON.stringify(inp.scaleExp) === JSON.stringify(UNITS);
  gates.finite = inp.bodies.every((b) => ['m', 'x', 'y', 'z', 'vx', 'vy', 'vz', 'spin', 'radius'].every((k) => Number.isFinite(b[k])));
  // ② 重心と全運動量
  let M = 0; const c = [0, 0, 0], p = [0, 0, 0];
  for (const b of inp.bodies) { M += b.m; for (let q = 0; q < 3; q++) { c[q] += b.m * posOf(b)[q]; p[q] += b.m * velOf(b)[q]; } }
  const com = { comKm: nrm(c) / M * KM, comKmS: nrm(p) / M * KMS, massKg: M * KG };
  gates.com = com.comKm <= TOL.comKm && com.comKmS <= TOL.comKmS;
  // ③ 太陽からの距離と速さ(aAu の桁)
  const sun = B.sun, muSun = (k) => G * (sun.m + B[k].m);
  const planets = MEMBERS.filter((m) => m.aAu).map((m) => {
    const b = B[m.key], rr = sub(posOf(b), posOf(sun)), vv = sub(velOf(b), velOf(sun)), r = nrm(rr), v = nrm(vv);
    const fr = r * KM / (m.aAu * S16.AU_KM), fv = v / Math.sqrt(G * sun.m / r);
    return { key: m.key, ja: m.ja, rAu: r * KM / S16.AU_KM, aAu: m.aAu, distFactor: fr, speedKmS: v * KMS, speedFactor: fv,
      ok: fr >= TOL.distFactor[0] && fr <= TOL.distFactor[1] && fv >= TOL.speedFactor[0] && fv <= TOL.speedFactor[1] };
  });
  gates.distSpeed = planets.every((r) => r.ok);
  // ④ 質量(kg)と在位の本の同じ天体・G_0 m
  const triSeed = SK.satOf('triton');
  const masses = MEMBERS.map((m) => {
    const b = B[m.key], kg = b.m * KG, rb = bookBody(HP, REF_BOOKS[m.key]);
    let refKg = null, ref = null;
    if (rb) { refKg = rb.body.m * KG; ref = rb.emoji + ' ' + rb.id + '[' + REF_BOOKS[m.key].i + ']'; }
    else if (m.key === 'triton') { refKg = triSeed.pub.gmKm3s2 * 1e9 / S16.G0_SI; ref = '衛星の種(tests/lib-w315d-satk1.mjs —— 公表の平均要素の近似の GM ' + triSeed.pub.gmKm3s2 + ' km³/s² を G_0 で kg)'; }
    const rel = refKg ? kg / refKg - 1 : null;
    return { key: m.key, ja: m.ja, kg, gmKm3s2: S16.G0_SI * kg / 1e9, refKg, ref, rel, ok: rel !== null && Math.abs(rel) <= TOL.massRel };
  });
  gates.mass = masses.every((r) => r.ok);
  // ⑤ 衛星: Hill 半径の 0.5 倍の内で束縛
  const sats = MEMBERS.filter((m) => m.parent).map((m) => {
    const b = B[m.key], P = B[m.parent], r = nrm(sub(posOf(b), posOf(P))), v = nrm(sub(velOf(b), velOf(P))), mu = G * (P.m + b.m);
    const rP = nrm(sub(posOf(P), posOf(sun))), hill = rP * Math.cbrt(P.m / (3 * sun.m)), eps = 0.5 * v * v - mu / r;
    return { key: m.key, ja: m.ja, parent: m.parent, rKm: r * KM, hillKm: hill * KM, hillFrac: r / hill, energy: eps, ok: r < TOL.hillFrac * hill && eps < 0 };
  });
  gates.hill = sats.every((r) => r.ok);
  // ⑥ 接触の軌道要素(惑星: 太陽のまわり・衛星: 母惑星のまわり —— μ = G(M + m))と在位の本・凍結の写し・衛星の種
  const elemRows = [];
  for (const m of MEMBERS) {
    if (m.key === 'sun') continue;
    const b = B[m.key], C = m.parent ? B[m.parent] : sun, mu = G * (C.m + b.m);
    const el = elementsOf(sub(posOf(b), posOf(C)), sub(velOf(b), velOf(C)), mu);
    const row = { key: m.key, ja: m.ja, center: m.parent || 'sun', aKm: el.a * KM, aAu: el.a * KM / S16.AU_KM, e: el.e, iDeg: el.iDeg, refs: [] };
    if (m.parent) {   // 衛星: 母惑星の赤道面(入力の母惑星の spinAxis)に対する傾き
      row.iEqDeg = angDeg(el.pole, axisOf(B[m.parent].spinAxis));
    }
    const rb = bookBody(HP, REF_BOOKS[m.key]);
    if (rb && !(m.parent && rb.id === 'jupiterGalilean') && !(m.key === 'titan')) {
      const cc = m.parent ? rb.bodies[REF_BOOKS[m.parent] && REF_BOOKS[m.parent].id === rb.id ? REF_BOOKS[m.parent].i : 0] : rb.center;
      const e2 = elementsOf(sub(posOf(rb.body), posOf(cc)), sub(velOf(rb.body), velOf(cc)), rb.G * (cc.m + rb.body.m));
      row.refs.push({ src: rb.emoji + ' ' + rb.id + '(在位の本の t = 0 の状態)', aKm: e2.a * KM, e: e2.e, iDeg: e2.iDeg });
    }
    if (PIN_PLANETS[m.key]) {
      const d = SK.PIN.decl[PIN_PLANETS[m.key]], s0 = d.bodies[0], p1 = d.bodies[1], kmL = Math.pow(10, d.scaleExp.L) / 1e3;   // 凍結の写しの単位(水星・金星・火星は 10⁸ m)
      const e3 = elementsOf(sub(posOf(p1), posOf(s0)), sub(velOf(p1), velOf(s0)), d.physics.G * (s0.m + p1.m));
      row.refs.push({ src: d.emoji + ' 凍結の写し tests/data-w306a-decl305.json の ' + PIN_PLANETS[m.key], aKm: e3.a * kmL, e: e3.e, iDeg: e3.iDeg });
    }
    if (SK.satOf(m.key)) {
      const sd = SK.seedOf(HP, m.key);
      row.refs.push({ src: '衛星の種(tests/lib-w315d-satk1.mjs の seedOf —— ' + (sd.src.a || '').slice(0, 60) + ')', aKm: sd.a * KM, e: sd.e, iEqDeg: sd.iEqDeg });
    }
    for (const rf of row.refs) {
      rf.aRel = rf.aKm / row.aKm - 1; rf.eDiff = rf.e - row.e;
      rf.iDiff = (rf.iEqDeg !== undefined) ? rf.iEqDeg - row.iEqDeg : (rf.iDeg !== undefined ? rf.iDeg - row.iDeg : null);
      rf.ok = Math.abs(rf.aRel) <= TOL.aRel && Math.abs(rf.eDiff) <= TOL.eAbs && (rf.iDiff === null || Math.abs(rf.iDiff) <= TOL.iDeg);
    }
    row.ok = row.refs.length > 0 && row.refs.every((rf) => rf.ok) && el.e < 1;
    elemRows.push(row);
  }
  gates.elements = elemRows.every((r) => r.ok);
  // ⑦ 自転軸(在位の本・source の α0・δ0)・自転の符号(自転のベクトルと公転の極)・自転の速さ
  const spinRows = MEMBERS.map((m) => {
    const b = B[m.key], ax = axisOf(b.spinAxis), sv = ax.map((q) => q * Math.sign(b.spin));
    const row = { key: m.key, ja: m.ja, tiltDeg: b.spinAxis.tiltDeg, azimuthDeg: b.spinAxis.azimuthDeg, spin: b.spin, spinRadS: b.spin / SEC, periodH: 2 * Math.PI / Math.abs(b.spin) * SEC / 3600, enable: b.spinAxis.enable === true };
    const ps = poleOfSource(b.spinAxis.source);
    if (ps) { const pe = S16.poleToEcliptic(ps.raDeg, ps.decDeg, OBLIQ_AS); row.poleSrc = { raDeg: ps.raDeg, decDeg: ps.decDeg, diffDeg: angDeg(axisOf(pe), ax) }; }
    const rb = bookBody(HP, REF_BOOKS[m.key]);
    if (rb && rb.body.spinAxis && rb.body.spinAxis.tiltDeg !== undefined) row.axisBook = { src: rb.emoji + ' ' + rb.id, diffDeg: angDeg(axisOf(rb.body.spinAxis), ax) };
    if (rb && Number.isFinite(rb.body.spin) && rb.body.spin !== 0) row.spinBook = { src: rb.emoji + ' ' + rb.id, spin: rb.body.spin, rel: b.spin / rb.body.spin - 1 };
    // 自転の符号: 自転のベクトル sign(spin)·â と黄道の北極の角が 90° を越える ⇔ 逆行(IAU の北極〔不変面の北の側〕と負の自転 —— 金星・天王星・トリトン)
    row.eclDeg = angDeg(sv, [0, 0, 1]);
    row.retro = RETRO.includes(m.key);
    row.signOk = row.retro ? (row.eclDeg > 90 && b.spin < 0) : (row.eclDeg < 90 && b.spin > 0);
    if (m.key !== 'sun') {   // 自転のベクトルと公転の極(母惑星か太陽のまわり)の角 —— 惑星は赤道傾斜・衛星は同期の自転(≤ satAxisDeg)
      const C = m.parent ? B[m.parent] : sun, h = cross(sub(posOf(b), posOf(C)), sub(velOf(b), velOf(C)));
      row.obliquityDeg = angDeg(sv, h);
      if (m.parent) row.syncOk = row.obliquityDeg <= TOL.satAxisDeg;
    } else row.obliquityDeg = row.eclDeg;
    row.ok = row.enable && row.signOk && (!row.poleSrc || row.poleSrc.diffDeg <= TOL.poleSrcDeg) && (!row.axisBook || row.axisBook.diffDeg <= TOL.axisDeg) && (row.syncOk !== false);
    return row;
  });
  gates.spinAxis = spinRows.every((r) => r.ok);
  gates.spinSign = spinRows.every((r) => r.signOk);
  // 自転の速さは記録(在位の本と資料が違う —— 目安を越えた天体は notes に)
  for (const r of spinRows) if (r.spinBook && Math.abs(r.spinBook.rel) > TOL.spinRel) notes.push(r.ja + 'の自転の速さが在位の本と ' + (r.spinBook.rel * 100).toFixed(2) + '% 違う(入力の値のまま)');
  const ok = Object.values(gates).every(Boolean);
  return { ok, gates, tables: { com, planets, masses, sats, elements: elemRows, spin: spinRows }, notes, tol: TOL };
}

/* ── 宣言 ── */
/** 在位の惑星 7 本(第315便c)と同じ K1 の短い形(受理器が入力の長い形 invSq:{Wbg2:0, order:8, …}・gLoc:{…, n:2, pair:"receiver", kappa:"lock", ref:"background"} に正規化する) */
export const K1_DRAG = Object.freeze({ law: 'inertial', invSq: Object.freeze({ kernel: 'k1', rdRule: 'kappaM' }), pairs: 'all', history: 'positions', initMotion: 'observed' });
export const GLOC = Object.freeze({ law: 'kappaC2' });
/** 刻みの候補(イオの接触の周期あたりの步数 —— 入力の 1440 と第300便c の lib の既定 360) */
export const STEP_CANDIDATES = Object.freeze([1440, 360]);
/**
 * 刻み = 入力の stepDt × (入力の stepsPerOrbit / spo)。比は 2 の冪だけ(2 進で厳密な倍 —— 入力の数を作り直さない)。
 * 入力の stepDt(0.0010628374544626486)は丸める前の周期 / 1440 で、timeRef.pRef(12 桁に丸めた 1.53048593443)/ 1440 とは 12 桁目で違う —— 入力の stepDt を正とする。
 */
export function stepDtOf(inp, spo) {
  const f = inp.timeRef.stepsPerOrbit / spo;
  if (!(f > 0) || Math.log2(f) !== Math.round(Math.log2(f))) throw new Error('刻みの比 ' + f + ' が 2 の冪でない');
  return inp.physics.stepDt * f;
}
/**
 * 内蔵の本の宣言の物理の部分(入力の physics・bodies・timeRef・camera・scaleExp・integrator —— relativeDrag と gLoc を短い形へ・刻みは o.stepsPerOrbit)。
 * o.form = 'input' は入力の長い形のまま(短い形と同じ走りかの照合)。
 */
export function builtinDecl(inp, o = {}) {
  const spo = o.stepsPerOrbit || inp.timeRef.stepsPerOrbit, ph = clone(inp.physics);
  if (o.form !== 'input') { ph.relativeDrag = clone(K1_DRAG); ph.gLoc = clone(GLOC); }
  ph.stepDt = stepDtOf(inp, spo);
  const tr = clone(inp.timeRef); tr.stepsPerOrbit = spo;
  return { id: ID, scaleExp: clone(inp.scaleExp), integrator: inp.integrator, timeRef: tr, camera: clone(inp.camera), world: clone(inp.world), physics: ph, bodies: clone(inp.bodies) };
}
/** 器の走行の本(宣言 + 名前と説明の欄 —— 受理器に通す形) */
export function presetOf(inp, o = {}) {
  const d = builtinDecl(inp, o);
  return Object.assign({ name: '太陽系 16 体(器の写し)', description: '器の写し(内蔵の本の宣言と同じ物理)', emoji: '🧭', sampleClass: 'principle' }, d,
    { overlays: { rotationCurve: false, tempHistogram: false, field: false, trail: true } });
}
/** 1PN の対照の写し(geoPN 1・λ_PN 1・gLoc と relativeDrag なし —— 原仮定者から受け取ったもう 1 本の物理の宣言の違いと同じ。器の写し・内蔵にしない) */
export function controlOf(p) {
  const q = clone(p); q.physics.geoPN = 1; q.physics.lambdaPN = 1; delete q.physics.gLoc; delete q.physics.relativeDrag;
  q.name = '太陽系 16 体の 1PN の対照(器の写し)'; return q;
}

/* ── 走行 ── */
/** クランプ・停止の数え(エンジンの数え口 —— 走行の終わりに読む) */
export const CLAMP_KEYS = Object.freeze(['clampVN', 'clampSN', 'clampHN', 'clampRN', 'clampTN', 'clampAN', 'inertialDragOver', 'inertialDragIsqOverlap', 'inertialDragIsqLowDen']);
export const STOP_KEYS = Object.freeze(['approxManyStop', 'spaceMeshStop', 'spaceMeshWeaveStop', 'meshRotorStop', 'meshCoordStop', 'geoToyStop', 'bgLawStopWhy', 'coreFieldStop', 'shapeToyStop', 'spiralStop', 'dragWorkStop', 'layerStop', 'coreFieldSupplyStop']);
/**
 * 受理器に通して steps 步(刻み dt)走らせる。o.snap(k, Sm) は步ごとの見張り(任意)。戻り値は終わりの状態(本の単位)・NaN・停止・クランプ。
 */
export function runOf(HP, p, steps, dt, o = {}) {
  const v = HP.validatePreset(clone(p));
  if (!v.ok) return { ok: false, errors: v.errors };
  const Sm = HP.coord3d.makeSim(); Sm.build(clone(v.preset));
  const t0 = Date.now();
  let k = 0, stop = null;
  for (; k < steps; k++) { Sm.step(dt); if (Sm.hasNaN()) { stop = 'nan'; k++; break; } if (o.snap) o.snap(k + 1, Sm); }
  const st = [];
  for (let i = 0; i < Sm.n; i++) st.push([Sm.x[i], Sm.y[i], Sm.z[i], Sm.vx[i], Sm.vy[i], Sm.vz[i]]);
  const clamps = Object.fromEntries(CLAMP_KEYS.map((key) => [key, Number(Sm[key]) || 0]));
  const stops = STOP_KEYS.filter((key) => Sm[key] !== null && Sm[key] !== undefined && Sm[key] !== 0 && Sm[key] !== false).map((key) => key + '=' + String(Sm[key]));
  let isq = null; try { const s = HP.inertialDragIsqState(Sm); if (s) isq = { tooLarge: s.tooLarge, overlapSteps: s.overlapSteps, betaMax: s.betaMax }; } catch (_) { isq = null; }
  return { ok: true, steps: k, dt, stop, nan: Sm.hasNaN(), finite: st.every((r) => r.every(Number.isFinite)), state: st, clamps, clampSum: Object.values(clamps).reduce((a, b) => a + b, 0),
    stops, isq, warnings: (v.warnings || []).length, deny: HP.coord3d.denyOf(v.preset).length, wallSec: (Date.now() - t0) / 1000 };
}
/** 2 つの終わりの状態の差(天体ごとの位置の差 km・衛星は母惑星に対する相対の位置の差 km) */
export function stateDiff(A, B) {
  const rows = MEMBERS.map((m, i) => {
    const d = nrm(sub(A[i], B[i])) * KM;
    let rel = null;
    if (m.parent) { const j = MEMBERS.findIndex((z) => z.key === m.parent); rel = nrm(sub(sub(A[i], A[j]), sub(B[i], B[j]))) * KM; }
    return { key: m.key, ja: m.ja, posKm: d, relKm: rel };
  });
  return { rows, maxKm: Math.max(...rows.map((r) => r.posKm)), maxRelKm: Math.max(...rows.filter((r) => r.relKm !== null).map((r) => r.relKm)) };
}

/* ── 衛星の丸めの床(記録だけ)── */
const ulpOf = (x) => { const a = Math.abs(x); if (a === 0) return Number.MIN_VALUE; return Math.pow(2, Math.floor(Math.log2(a)) - 52); };
/**
 * SSB の大きな座標で、history:"positions"(步ごとの座標の差分)の 1 ulp が衛星の軌道の何倍か。δ = 衛星の座標の成分の 1 ulp の最大(本の単位)。
 * 比: δ/a(長半径)・δ/(v_rel h)(1 步の母惑星に対する変位)・δ/(a e)(離心ベクトルの向きの角 [rad])・同じ角を 1 世紀の公転の数だけ線形に積んだ ″/世紀(上限の型の目安)。
 * 比べる母惑星中心の座標の床: ulp(a)/a。
 */
export function roundingFloor(inp, dt) {
  const B = byKey(inp), G = inp.physics.G;
  return MEMBERS.filter((m) => m.parent).map((m) => {
    const b = B[m.key], P = B[m.parent], rr = sub(posOf(b), posOf(P)), vv = sub(velOf(b), velOf(P)), el = elementsOf(rr, vv, G * (P.m + b.m));
    const dl = Math.max(ulpOf(b.x), ulpOf(b.y), ulpOf(b.z)), step = nrm(vv) * dt, Pn = 2 * Math.PI * Math.sqrt(el.a ** 3 / (G * (P.m + b.m)));
    const angE = dl / (el.a * el.e), perCentury = CENTURY_S / (Pn * SEC);
    return { key: m.key, ja: m.ja, parent: m.parent, ssbUnits: nrm(posOf(b)), ulpM: dl * 1e9, aKm: el.a * KM, e: el.e, periodD: Pn * SEC / 86400,
      ulpOverA: dl / el.a, ulpOverStep: dl / step, angERad: angE, linCenturyAs: angE * perCentury * R2AS, parentCentricOverA: ulpOf(el.a) / el.a, ratioSsbOverPc: dl / ulpOf(el.a) };
  });
}

/* ── 視点(camera.scale の上限 3000 —— 画面の短辺の半分 = scale の単位)── */
export const VIEWS = Object.freeze([{ key: 'portrait', w: 390, h: 700 }, { key: 'landscape', w: 700, h: 390 }, { key: 'square', w: 600, h: 600 }]);
export const TILTS = Object.freeze([-90, -60, -45, -30, 0]);
/**
 * 視点の傾き θ(画面の上向き U = sinθ·y + cosθ·z・横 = x —— html の viewTiltTrig と同じ定義・カメラの中心は原点)で 16 体が画面の内か。
 * 画面の半幅 = scale × w/min(w,h)・半高さ = scale × h/min(w,h)。
 */
export function viewFit(inp, scale) {
  const sc = scale || inp.camera.scale;
  return VIEWS.map((vw) => {
    const mn = Math.min(vw.w, vw.h), hw = sc * vw.w / mn, hh = sc * vw.h / mn;
    const tilts = TILTS.map((t) => {
      const sn = t === -90 ? -1 : t === 0 ? 0 : Math.sin(t * D2R), cs = t === -90 ? 0 : t === 0 ? 1 : Math.cos(t * D2R);
      const out = MEMBERS.filter((m, i) => { const b = inp.bodies[i]; return Math.abs(b.x) > hw || Math.abs(sn * b.y + cs * (b.z || 0)) > hh; }).map((m) => m.key);
      return { tilt: t, out };
    });
    return { view: vw.key, w: vw.w, h: vw.h, halfW: hw, halfH: hh, tilts, inAt: tilts.filter((z) => z.out.length === 0).map((z) => z.tilt) };
  });
}
