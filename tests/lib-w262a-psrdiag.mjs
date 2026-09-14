// 第262便a(第54報 W1)「NS の釣り合い探索」の**純関数**ライブラリ。
//
// ■ ここにあるもの
//   (1) `psrMassScaled(preset, f, opt)` —— 二重パルサーの**診断コピー**を作る。観測質量(較正の基点)に
//       共通の係数 f を掛け、位置・速度は 1 bit も動かさない。**質量比は観測のまま**である。
//   (2) `psrGeoToyCopy(preset, opt)` —— 同じ幾何の **geoPN=3(トイの測地線モード)診断コピー**を作る。
//   (3) `straightLineEscapeTime(r0, vRel, factor)` —— **相対加速度が厳密に 0** のときに分離が
//       factor·r₀ に達する時刻の解析値 t = r₀√(factor²−1)/|v_rel|(遠点発・ṙ₀=0)。
//   (4) `pullChi(mSource, d, D0p, eps, p)` —— pull 重みの追従比 χ = w/(D₀ᵖ+w)、w=m/(d²+ε²)^{p/2}。
//
// ■ ここに無いもの(意図的に)
//   **観測値が 1 つも無い。** 周期・離心率・近点移動の観測数値は CSV(paper/data/solar-observations.csv)
//   が正本で、器の側が読む。合否の閾値もここには書かない。
//   **力学も無い。** これは JSON を組み立てる関数と算術だけで、エンジンには触れない。
//
// ■ 診断コピーであることの宣言(数字を引用する側が外してはいけない前提)
//   ここで作る JSON は **`sampleClass:"principle"`** で、`massCalibration` 台帳と `claims` を**外す**。
//   較正台帳の f と食い違う質量を較正サンプルの顔のまま走らせないためである。
//   **これらのコピーは較正候補ではない**(docs/RELEASE_NOTES_v1.44.md Negative Claim 27)。

// 観測質量(較正の基点)。massCalibration.baseMass があればそれ、無ければ bodies の m。
export function psrBaseMasses(preset) {
  const mc = preset && preset.massCalibration;
  if (mc && Array.isArray(mc.baseMass) && mc.baseMass.every((z) => Number.isFinite(z) && z > 0)) {
    return mc.baseMass.slice();
  }
  return (preset.bodies || []).map((b) => Number(b.m));
}

// (1) 質量係数 f の診断コピー。opt = { kFrame, id, keepCore, dropClaims }
//   ・**位置と速度は 1 bit も触らない**(f_A=f_B なので重心系の再配分は恒等である —— 第224便の
//     再配分は質量比が動いたときに効く手続きで、共通係数では位置も速度もそのまま)。
//   ・コア v2 を持つ本体(⚡)では **massFrac=(f−1)/f**(第224便: 殻質量=観測質量)を張り直す。
//     **f→1 で massFrac→0 になり、検証器の値域下限 0.01 に当たって黙って切り上がる** ので、
//     `keepCore:false`(既定)では core を外し、**f に対して連続な族**にする(そのぶん
//     coupleSink の受け先が要るので "reservoir" に替える —— 観測版 📻 と同じ宣言)。
export function psrMassScaled(preset, f, opt) {
  const o = opt || {};
  const p = JSON.parse(JSON.stringify(preset));
  const base = psrBaseMasses(preset);
  if (!Number.isFinite(f) || !(f > 0)) return null;
  p.id = o.id || (preset.id + 'Diag');
  p.sampleClass = 'principle';
  delete p.massCalibration;
  delete p.claims;
  delete p.calibrationForecast;
  for (let i = 0; i < p.bodies.length; i++) {
    if (base[i] === undefined) continue;
    p.bodies[i].m = base[i] * f;
    if (p.bodies[i].core) {
      if (o.keepCore) p.bodies[i].core.massFrac = (f - 1) / f;
      else delete p.bodies[i].core;
    }
  }
  if (!o.keepCore && p.physics.coupleSink === 'core') p.physics.coupleSink = 'reservoir';
  if (o.kFrame !== undefined) p.physics.kFrame = o.kFrame;
  return p;
}

// (2) geoPN=3 のトイ診断コピー。opt = { lawVersion, toyGain, D0, id, kFrame }
//   トイの入場条件(第259便a): sampleClass≠calibration・lawVersion 宣言・kFrame=0・inertia=false・weave 無し。
//   **D₀ はトイが読む側の鍵に入れる**: frameWeight が pull 系のときエンジンは `D0pull` を先に読むので、
//   `D0pull` を消して physics.D0 を読ませる(本体 📻 の 0.006 が既定)。
export function psrGeoToyCopy(preset, opt) {
  const o = opt || {};
  const p = JSON.parse(JSON.stringify(preset));
  p.id = o.id || (preset.id + 'GeoToy');
  p.sampleClass = 'principle';
  delete p.massCalibration;
  delete p.claims;
  delete p.calibrationForecast;
  p.physics.geoPN = 3;
  p.physics.kFrame = (o.kFrame === undefined) ? 0 : o.kFrame;
  p.physics.spaceMesh = { mode: 'vertex', inertia: false,
    lawVersion: (o.lawVersion === undefined) ? 'local' : o.lawVersion,
    toyGain: (o.toyGain === undefined) ? 1 : o.toyGain };
  delete p.physics.D0pull;
  if (o.D0 !== undefined) p.physics.D0 = o.D0;
  return p;
}

// (3) 相対加速度が厳密に 0 のときの分離(遠点発・ṙ₀=0 なので r(t)²=r₀²+v_rel²t²)。
//     r=factor·r₀ に達する時刻は t=r₀√(factor²−1)/|v_rel|。factor=4 で √15 r₀/|v_rel|。
export function straightLineEscapeTime(r0, vRel, factor) {
  const a = Number(r0), v = Math.abs(Number(vRel)), k = Number(factor);
  if (![a, v, k].every(Number.isFinite) || !(a > 0) || !(v > 0) || !(k >= 1)) return null;
  return a * Math.sqrt(k * k - 1) / v;
}

// (4) pull 重みの追従比。**q は χ に入らない**(第258便a)。
export function pullChi(mSource, d, D0p, eps, p) {
  const m = Number(mSource), dd = Number(d), D0 = Number(D0p);
  const e = (eps === undefined) ? 0 : Number(eps);
  const pw = (p === undefined) ? 2 : Number(p);
  if (![m, dd, D0, e, pw].every(Number.isFinite) || !(m > 0) || !(dd > 0)) return null;
  const w = m / Math.pow(dd * dd + e * e, pw / 2);
  const den = D0 + w;
  return (den > 0) ? (w / den) : null;
}

// (5) 走行の分類。**「測れなかった」と「測ったら 0 だった」を分ける**(第261便c の流儀)。
//   res = { rMax, r0, rMin, nPeri, nan, contact }
export function classifyRun(res, opt) {
  const o = opt || {};
  const escFactor = (o.escapeFactor === undefined) ? 4 : o.escapeFactor;
  const fallFrac = (o.fallFraction === undefined) ? 0.01 : o.fallFraction;
  const periMin = (o.periMin === undefined) ? 6 : o.periMin;
  if (!res) return { kind: 'noRun', label: '未走行' };
  if (res.nan) return { kind: 'nan', label: '発散(NaN)' };
  if (res.rMax !== null && res.r0 > 0 && res.rMax >= escFactor * res.r0) return { kind: 'escape', label: '離脱' };
  if (res.contact || (res.rMin !== null && res.r0 > 0 && res.rMin <= fallFrac * res.r0)) {
    return { kind: 'fall', label: '落下・接触' };
  }
  if (res.nPeri >= periMin) return { kind: 'bound', label: '束縛' };
  return { kind: 'incomplete', label: '未完(近点 ' + res.nPeri + ' 個)' };
}
