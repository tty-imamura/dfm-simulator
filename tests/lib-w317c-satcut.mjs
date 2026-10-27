// 第317便c(原仮定者の裁定(第119報)・同 補足 1・決断事項 AN431・統括の検証項目 R252): **衛星の三体の切る変種の本の作り手と共通の測る量 M0 の純関数**
// (html を読まない —— 在位の本の値は HP を引数で受ける。器 tests/exp-w317c-satcut.mjs が使う)。
//
// ■ 何をするか
//   n = 2(G_loc の在位の宣言 kappaC2)・K1(全天体 R_d = Y_k m —— 規則の鍵 rdRule:"kappaM")のまま、第316便d の三体の永年の効き(近点の率の差 q11 − q10)が決まらない
//   原因を変種で切る。本の写しは第315便d の lib tests/lib-w315d-satk1.mjs の bookOf の出力をそのまま受け、**変種は写しの外から足す**(lib の既存の関数と版は変えない)。
//   変種は走行の前に宣言した(VARIANTS —— 結果を見て変えない):
//     V0  基線(第316便d の三体と二体の q10・q11 —— bookOf のまま)
//     V2  宣言の形: 在位の惑星 7 本の K1 の宣言(第315便c —— 並進だけ・外殻なし・spinDrag なし)と同じ relativeDrag を q11 に置く
//         (軸引きずりが近点の差に届くかの基準 —— 軸の経路は spinDrag の中にしか無い)
//     V6b 軸引きずりの分解(補足 1 の読み (b)): 太陽と母惑星の二体(衛星なし)の母惑星の軸の ω の和を保ったまま、太陽由来を割合 f(spinDrag.axialGain)へ下げ、
//         残り (1 − f) を銀河由来の一様軸引きずり galaxyAxial で置く(f = 0.5・0 —— f = 1 は V0)。axialGain は全源に掛かる(源ごとの係数は無い)
//     V6a 軸引きずりの分解(補足 1 の読み (a)): 太陽由来はそのまま、銀河由来 ω_G を足す(ω_G = r × abs(ω☉,P) × ĝ —— ĝ = 南銀極の向き・r = 0.1・1・10)
//     V1a 太陽の引きずりだけを切る(重力は残す): relativeDrag.pairs = [[1,2]](三体の並び [太陽 0, 母惑星 1, 衛星 2])
//     V1b 太陽 ↔ 衛星の対だけを外す: pairs = [[0,1],[1,2]]
//     V3  座標: 三体の初期状態を母惑星中心へ(母惑星の位置と速度を全天体から引く —— ガリレイ変換)。q10 と q11 の両方
//   銀河由来の分は既存の鍵 physics.relativeDrag.galaxyAxial:{wx, wy, wz, rdPow:1, refRadius, massPow:-1, refMass}(〔第311便b〕〔第312便b〕〔第313便b〕—— 新しい鍵は足さない)。
//   K1 では R_d,i = Y_k m_i なので係数 (R_d,i/R_ref)(m_ref/m_i) は全天体に共通の Y_k m_ref/R_ref —— 器は m_ref = 母惑星のエンジンの質量・R_ref = Y_k m_ref と置き、
//   母惑星の係数がちょうど 1(他の天体は丸めの内で 1 —— 読み口 inertialDragGalaxyAxialState の responseFactor で確かめる)。
//
// ■ 共通の測る量 M0(枝 a・b・c が同じ式 —— 第317便の共通の契約): HARM_RULE の L 模型(tests/lib-w304e-apsis.mjs の apsisRate —— 慣性速度の接触の離心ベクトルの成分の回帰・
//   位置の角の 1〜3 倍の調和)を、窓の終端を共通の座標時刻 t₁ = N·P_seed(P_seed = 本の timeRef.pRef —— q10 と q11 で同じ)で切って q10 と q11 に当てた差。
//   標本は h ごと(刻みに依らず同じ時刻 t_k = k h)なので、切りは t_k ≤ N·P_seed + h/2(標本の時刻の丸めで最後の標本が出入りしない —— 標本の集合は k ≤ N·S と同じ)。
//   走行は步の数で止める(runN·S·div 步 —— q10 と q11 で同じ終端。通過の窓〔第316便d の値と同じ式〕も同じ行に並べるため、runN 回目の通過まで延ばす)。
//
// ■ 言わないこと: 「フィットした」「較正した」「収束した」「完全に一致」「法則を確かめた」「検証が完了した」「シュヴァルツシルト半径そのもの」。近似要素の種を観測レコードと呼ばない。
//   銀河の軸引きずりの大きさを決めたと書かない(ω_G は変種の値 —— 銀河の模型からの数ではない)。数値の帯は観測の 3σ ではない。エンジンの誤りと断定しない。
import * as AP from './lib-w304e-apsis.mjs';
import * as L from './lib-w315d-satk1.mjs';
export const LIB_VERSION = 'w317c-satcut-lib-1';
const clone = (x) => JSON.parse(JSON.stringify(x));
const dot = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
const cross = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
const nrm = (a) => Math.hypot(a[0], a[1], a[2]);
const unit = (a) => { const n = nrm(a); return [a[0] / n, a[1] / n, a[2] / n]; };
const D2R = Math.PI / 180;

/** 在位の惑星 7 本(第315便c の K1 の移行 —— 🌦️ earthMoonSunInertial3d は含まない〔AN418〕)の id と、その relativeDrag の宣言(並進だけ・外殻なし・spinDrag なし) */
export const IN_POS_BOOKS = Object.freeze(['mercurySunInertial3d', 'venusSunInertial3d', 'marsSunInertial3d', 'jupiterSunInertial3d', 'saturnSunInertial3d', 'uranusSunInertial3d', 'neptuneSunInertial3d']);
export const IN_POS_K1_DRAG = Object.freeze({ law: 'inertial', invSq: Object.freeze({ kernel: 'k1', rdRule: 'kappaM' }), pairs: 'all', history: 'positions', initMotion: 'observed' });

/* ───────── 銀河の向き(〔第311便b〕⑥ と同じ定数と同じ式 —— 凍結の写しの基底は J2000 の黄道)───────── */
/** J2000 の黄道傾斜角 ε0(IAU 2006 —— tests/lib-w299c-planets3d.mjs の OBLIQUITY_ARCSEC と同じ値) */
export const OBLIQUITY_ARCSEC = 84381.406;
/** 銀河座標の定義(ICRS —— tests/exp-w311b-galaxial.mjs の GAL と同じ値)と尺度 Ω_ref = V₀/R₀ の値(尺度だけ —— ω_G の大きさは未定) */
export const GAL = Object.freeze({ ngpRaDeg: 192.85948, ngpDecDeg: 27.12825, gcRaDeg: 266.40499, gcDecDeg: -28.93617, V0kms: 230, R0kpc: 8.2, pcMeters: 3.0856775814913673e16 });
/** ICRS の向き (α, δ) → J2000 の黄道の単位ベクトル(tests/lib-w299c-planets3d.mjs の poleEcliptic と同じ式・同じ演算の順) */
export function eclipticOf(ra, dec) {
  const e = OBLIQUITY_ARCSEC / 3600 * D2R, a = ra * D2R, d = dec * D2R;
  const x = Math.cos(d) * Math.cos(a), y = Math.cos(d) * Math.sin(a), z = Math.sin(d);
  return [x, Math.cos(e) * y + Math.sin(e) * z, -Math.sin(e) * y + Math.cos(e) * z];
}
/** 銀河の角運動量の向き ĝ(南銀極 —— 〔第311便b〕⑥ の geometry と同じ式)と黄道座標・尺度 Ω_ref [rad/s] */
export function galaxyAxis() {
  const ngp = eclipticOf(GAL.ngpRaDeg, GAL.ngpDecDeg), gc = eclipticOf(GAL.gcRaDeg, GAL.gcDecDeg);
  const l90 = cross(ngp, gc), g = unit(cross(gc.map((q) => -q), l90));
  const lb = (u) => { let l = Math.atan2(u[1], u[0]) / D2R; if (l < 0) l += 360; return { lambdaDeg: l, betaDeg: Math.asin(Math.max(-1, Math.min(1, u[2]))) / D2R }; };
  return { g, ecl: lb(g), ngpEcl: lb(ngp), dotNgp: dot(g, ngp), OmRefSI: GAL.V0kms * 1e3 / (GAL.R0kpc * 1e3 * GAL.pcMeters) };
}

/* ───────── 変種(走行の前に宣言 —— 結果を見て変えない)───────── */
export const V6A_SATS = Object.freeze(['io', 'ganymede', 'callisto']);
export const V3_SATS = Object.freeze(['io', 'triton']);
export const VARIANTS = Object.freeze([
  Object.freeze({ key: 'V0', group: 'V0', ja: '基線(第316便d の q10・q11 —— 同じ本)', systems: Object.freeze(['two', 'three']), sats: null }),
  Object.freeze({ key: 'V2', group: 'V2', ja: '在位の惑星 7 本の K1 の宣言の形(並進だけ・外殻なし・spinDrag なし)', systems: Object.freeze(['two', 'three']), sats: null }),
  Object.freeze({ key: 'V6b_f05', group: 'V6b', f: 0.5, ja: '軸の分解 (b) f = 0.5(axialGain 0.5 + 銀河由来 0.5 ω☉,P)', systems: Object.freeze(['two', 'three']), sats: null }),
  Object.freeze({ key: 'V6b_f0', group: 'V6b', f: 0, ja: '軸の分解 (b) f = 0(axialGain 0 + 銀河由来 ω☉,P)', systems: Object.freeze(['two', 'three']), sats: null }),
  Object.freeze({ key: 'V1a', group: 'V1', pairs: Object.freeze([Object.freeze([1, 2])]), ja: '太陽の引きずりを切る(pairs [[1,2]] —— 重力は残す)', systems: Object.freeze(['three']), sats: null }),
  Object.freeze({ key: 'V6a_r01', group: 'V6a', r: 0.1, ja: '軸の分解 (a) ω_G = 0.1 abs(ω☉,P) ĝ を足す', systems: Object.freeze(['two', 'three']), sats: V6A_SATS }),
  Object.freeze({ key: 'V6a_r1', group: 'V6a', r: 1, ja: '軸の分解 (a) ω_G = abs(ω☉,P) ĝ を足す', systems: Object.freeze(['two', 'three']), sats: V6A_SATS }),
  Object.freeze({ key: 'V6a_r10', group: 'V6a', r: 10, ja: '軸の分解 (a) ω_G = 10 abs(ω☉,P) ĝ を足す', systems: Object.freeze(['two', 'three']), sats: V6A_SATS }),
  Object.freeze({ key: 'V3', group: 'V3', ja: '母惑星中心の座標(母惑星の位置と速度を引いた —— q10 と q11)', systems: Object.freeze(['three']), sats: V3_SATS }),
  Object.freeze({ key: 'V1b', group: 'V1', pairs: Object.freeze([Object.freeze([0, 1]), Object.freeze([1, 2])]), ja: '太陽 ↔ 衛星の対だけ外す(pairs [[0,1],[1,2]])', systems: Object.freeze(['three']), sats: null })]);
export const variantOf = (k) => VARIANTS.find((v) => v.key === k) || null;
/** 変種が走る衛星と系(sats が null は 6 本) */
export const variantCovers = (v, sat, sys) => v.systems.includes(sys) && (!v.sats || v.sats.includes(sat));
/** 変種が q10 を変えるか(V3 だけ —— 他は q11 の relativeDrag だけを変えるので q10 は V0 と同じ本) */
export const changesQ10 = (v) => v.group === 'V3';

/* ───────── 軸の分解の値(太陽 + 母惑星の二体の写し —— 衛星なし)───────── */
/** 太陽 + 母惑星の二体(凍結の写しの太陽と惑星 —— 重心 0・全運動量 0)・K1 の q11 の relativeDrag(第315便d の K1_RULE_DRAG)。gain と galaxyAxial は変種の値 */
export function sunPlanetBook(parentKey, o = {}) {
  const P = L.parentOf(parentKey), sun = Object.assign(clone(P.sun), { pinned: false, pnSource: true }), pl = Object.assign(clone(P.planet), { pinned: false, pnSource: true });
  const B = [sun, pl]; let M = 0; const c = [0, 0, 0], p = [0, 0, 0];
  for (const b of B) { M += b.m; c[0] += b.m * b.x; c[1] += b.m * b.y; c[2] += b.m * b.z; p[0] += b.m * b.vx; p[1] += b.m * b.vy; p[2] += b.m * b.vz; }
  for (const b of B) { b.x -= c[0] / M; b.y -= c[1] / M; b.z -= c[2] / M; b.vx -= p[0] / M; b.vy -= p[1] / M; b.vz -= p[2] / M; }
  const physics = clone(P.physics);
  Object.assign(physics, { softening: L.SOFTENING, softeningFloor: L.SOFTENING, radiusFloor: L.RADIUS_FLOOR, stepDt: P.physics.stepDt });
  physics.gLoc = clone(L.GLOC);
  physics.relativeDrag = clone(L.K1_RULE_DRAG);
  if (o.gain !== undefined) physics.relativeDrag.spinDrag.axialGain = o.gain;
  if (o.galaxy) physics.relativeDrag.galaxyAxial = clone(o.galaxy);
  return { id: 'satCut_sunPlanet_' + parentKey, name: '太陽 + ' + P.ja + '(器の写し —— 第317便c)', description: '器の写し(内蔵ではない —— 第317便c)', emoji: '🛰️', sampleClass: 'principle',
    scaleExp: clone(L.UNITS), integrator: L.INTEGRATOR, camera: { scale: 3000 }, world: { boundary: 'none', size: 0 },
    timeRef: { basis: 'orbit', pRef: 1, pair: [0, 1], def: 'revolution', source: '器の写し(走らせない —— t = 0 の読み口だけ)', stepsPerOrbit: 720 },
    physics, bodies: B, overlays: { rotationCurve: false, tempHistogram: false, field: false, trail: true } };
}
/** galaxyAxial の宣言(K1 の型 —— rdPow 1・massPow −1・m_ref = 母惑星のエンジンの質量・R_ref = Y_k m_ref) */
export function galaxyDecl(w, ref) { return { wx: w[0] + 0, wy: w[1] + 0, wz: w[2] + 0, rdPow: 1, refRadius: ref.refRadius, massPow: -1, refMass: ref.refMass }; }
/** 母惑星の参照(m_ref・R_ref) —— 写しの physics(massPrecision)と本の G・c_0 から */
export function refOf(parentKey) {
  const P = L.parentOf(parentKey), mE = L.engineMassOf(P.planet.m, P.physics), Yk = L.YkBook({ physics: P.physics });
  return { refMass: mE, refRadius: Yk * mE, Yk };
}
/**
 * 軸の分解の値(親ごと)。太陽 + 母惑星の二体の写しを build して、読み口 inertialDragIsqState の母惑星の軸の ω(源 = 太陽 —— gain 1)を ω☉,P とする。
 * 返す: omSunP(ω☉,P のベクトル・本の 1/時間単位)・abs・ref・ĝ・V6b の (gain, galaxy) と V6a の galaxy。
 */
export function decompOf(HP, parentKey) {
  const ref = refOf(parentKey), ga = galaxyAxis();
  const st0 = stateOf(HP, sunPlanetBook(parentKey));
  const rp = st0.isq.receivers.find((r) => r.i === 1), rs = st0.isq.receivers.find((r) => r.i === 0);
  const om = rp.omega.slice(), ab = nrm(om);
  const v6b = {}, v6a = {};
  for (const v of VARIANTS) {
    if (v.group === 'V6b') v6b[v.key] = { gain: v.f, galaxy: galaxyDecl(om.map((q) => (1 - v.f) * q), ref) };
    if (v.group === 'V6a') v6a[v.key] = { galaxy: galaxyDecl(ga.g.map((q) => v.r * ab * q), ref) };
  }
  return { parent: parentKey, omSunP: om, omSunPAbs: ab, omPSun: rs.omega.slice(), betaPlanet: rp.betaSum, ref, galaxyAxis: ga.g, v6b, v6a };
}
/** 銀河の一様軸引きずりの読み口(HP に無ければ html の最上位の関数 —— loadHtmlMain は本文を主コンテキストで読むので最上位の関数は大域にある) */
export const GALAXY_STATE_NAME = 'inertialDragGalaxyAxialState';
export const galaxyStateFn = (HP) => HP[GALAXY_STATE_NAME] || globalThis[GALAXY_STATE_NAME] || null;
/** t = 0 の読み口(build だけ —— 步は進めない) */
export function stateOf(HP, book) {
  const v = HP.validatePreset(clone(book));
  if (!v.ok) return { ok: false, err: JSON.stringify(v.errors).slice(0, 300) };
  const S = HP.coord3d.makeSim(); S.build(clone(v.preset));
  const gs = galaxyStateFn(HP);
  return { ok: true, S, warnings: (v.warnings || []).length, isq: HP.inertialDragIsqState(S), gal: gs ? gs(S) : null };
}

/* ───────── 変種の本(第315便d の bookOf の出力を写して差し替える純関数)───────── */
/**
 * sat・sys(two|three)・kind(q00|q10|q11)・vkey(VARIANTS の鍵)。o.stepsPerOrbit・o.seed・o.decomp(decompOf の戻り —— V6 の値)。
 * V0 は bookOf の出力そのもの(第316便d の走行と同じ本)。
 */
export function variantBook(HP, sat, sys, kind, vkey, o = {}) {
  const v = variantOf(vkey); if (!v) throw new Error('変種が無い: ' + vkey);
  if (!variantCovers(v, sat, sys)) throw new Error('変種 ' + vkey + ' は ' + sat + '|' + sys + ' を走らない');
  const b = L.bookOf(HP, sat, sys, kind, { seed: o.seed, stepsPerOrbit: o.stepsPerOrbit });
  const drag = L.KINDS[kind].drag;
  if (v.group === 'V0') return b;
  if (v.group === 'V3') {   // 母惑星中心(ガリレイ変換 —— q00・q10・q11 とも)
    const ip = b.timeRef.pair[0], pl = b.bodies[ip], s = [pl.x, pl.y, pl.z, pl.vx, pl.vy, pl.vz];
    for (const q of b.bodies) { q.x -= s[0]; q.y -= s[1]; q.z -= s[2]; q.vx -= s[3]; q.vy -= s[4]; q.vz -= s[5]; }
    return b;
  }
  if (!drag) return b;   // V2・V6・V1 は q11 の relativeDrag だけを変える(q00・q10 は V0 と同じ本)
  const rd = b.physics.relativeDrag;
  if (v.group === 'V2') { b.physics.relativeDrag = clone(IN_POS_K1_DRAG); return b; }
  if (v.group === 'V1') { rd.pairs = clone(v.pairs); return b; }
  const D = o.decomp; if (!D) throw new Error('V6 は軸の分解の値(decompOf)が要る');
  if (v.group === 'V6b') { const z = D.v6b[vkey]; rd.spinDrag.axialGain = z.gain; rd.galaxyAxial = clone(z.galaxy); return b; }
  if (v.group === 'V6a') { const z = D.v6a[vkey]; rd.galaxyAxial = clone(z.galaxy); return b; }
  throw new Error('変種の型が無い: ' + v.group);
}

/* ───────── 共通の測る量 M0 ───────── */
/** 窓 N の M0 の切り(t_k ≤ N·P_seed + h/2 —— h は本の基準の刻み) */
export const m0Cut = (book, N) => N * book.timeRef.pRef + book.physics.stepDt / 2;
/** M0 の近点の率(″/世紀)—— apsisRate の L 模型(K = 3・追加の位相なし) */
export function m0Of(s, book, N) {
  const Tsec = Math.pow(10, book.scaleExp.T), f = AP.apsisRate(s, { t0: 0, t1: m0Cut(book, N), K: 3 });
  return f ? { aps: AP.toArcsecPerCentury(f.rate, Tsec), e: f.e, rms: f.rms, n: f.n } : null;
}
