// 第275便b(原仮定者の裁定〔第65報〕(2))— **D₀ の背景 D_bg の定義と、源分割不変性の純関数**。
//
// ■ 定義(本便が置く正準形)
//   **D_bg(x*) = Σ_{j ∉ 分解集合} m_j / (r_j² + ε²)^(p/2)**
//   ・「分解集合」= そのサンプルが**天体として置いている**源の集合。
//   ・p=1(`frameWeight:"share"` の重み w=m/√(d²+ε²))では **単位は M/L**。
//     p=2(`frameWeight:"pull"` の重み w=m/(d²+ε²))では **単位は M/L²** ——
//     **同じ 1 つの数を両方の重みに使うことはできない**(エンジンが `D0` と `D0pull` を
//     別鍵で持っているのはこのためである)。本器は両方を別々に計算して並べる。
//   ・x* は「サンプルの基準点」(既定は分解集合の重心。宣言があればその位置)。
//
// ■ 規則(裁定の字義をそのまま落とす)
//   ・太陽を天体として**置く**サンプル … 太陽は背景に含めない("solar-excluded")
//   ・太陽を**置かない**サンプル      … 太陽からの距離で決まる("heliocentric")
//   ・太陽系外のサンプル              … 銀河内位置(銀河の質量分布からの寄与)("galactic")
//   ・銀河サンプル                    … 銀河自身を含めない
//   **規則は「何を足すか」しか決めていない**。「太陽を除いたあと**何が残るか**」(銀河の寄与)は
//   規則の文面からは決まらない —— 本器はそれを `solarExcludedRemainder` として**別に立て**、
//   決断事項として残す(推定で埋めない)。
//
// ■ この器がしないこと
//   ・エンジンへ接続しない(力学は 1 bit も変わらない)。
//   ・「D₀ を較正した」とは言わない —— 本器が出すのは**規則で計算した値と、宣言値との比**だけである。
//   ・観測値を作らない(質量・距離の参考値はすべて `ASSUMPTIONS` に出典つきで列挙し、
//     **仮定であることを値のそばに残す**)。
//
// 版を上げる条件: 定義式・規則・仮定表のどれかを変えたとき。
export const DSPLIT_VERSION = 'w275b-dsplit-1';

// ---------------------------------------------------------------- 仮定(**観測入力ではない**)
// 質量の基準は**アプリ自身が転写している値**を使う(新しい定数を持ち込まない):
//   ☀️ 太陽質量 = 🌇 venusReal / 🌞 solarInner / ☄️ mercuryReal の第 1 天体 1988.5 × 10^27 kg。
// 距離(軌道長半径)と銀河の値だけは外から置く —— **すべて仮定として宣言する**。
export const ASSUMPTIONS = {
  sunMassKg: { value: 1.9885e30, from: 'beta/index.html の 🌇/🌞/☄️ の第 1 天体(1988.5 × 10^27 kg)',
    kind: 'app-transcribed' },
  auMeters: { value: 1.495978707e11, from: 'IAU 2012 天文単位の定義値', kind: 'defined' },
  parsecMeters: { value: 3.0856775814913673e16, from: 'IAU 2015 の pc(au/arcsec)', kind: 'defined' },
  // 軌道長半径(太陽からの距離)—— **1 つの参考値**であって観測入力ではない
  semiMajorAxisAu: { value: {
    mercury: 0.387098, venus: 0.723332, earth: 1.000000, mars: 1.523679,
    jupiter: 5.204267, saturn: 9.582017, uranus: 19.191264, neptune: 30.068963, pluto: 39.482117 },
    from: 'NASA Planetary Fact Sheet(軌道長半径)', kind: 'reference-value' },
  // 銀河: M_enc(R₀)/R₀ を作る 2 つの参考値。**どちらも 1 つの値を選んだだけ**である
  galacticR0Kpc: { value: 8.178, from: 'GRAVITY Collaboration 2019(A&A 625 L10)の R₀=8.178 kpc',
    kind: 'reference-value' },
  galacticMassEnclosedMsun: { value: 1.0e11,
    from: 'Bland-Hawthorn & Gerhard 2016(ARA&A 54, 529)が挙げる M(<R₀) ≈ 1×10¹¹ M☉',
    kind: 'reference-value',
    note: '**1 桁の参考値である**(文献値は 0.8〜1.2×10¹¹ M☉ に散る)。どの値を採るかは決断事項' },
};

/** 仮定の一覧を「値・出典・種別」の行にして返す(JSON へそのまま載せる)。 */
export function assumptionRows() {
  return Object.entries(ASSUMPTIONS).map(([k, v]) => ({ key: k, value: v.value,
    from: v.from, kind: v.kind, note: v.note === undefined ? null : v.note }));
}

// ---------------------------------------------------------------- 決定力の総和
/**
 * **D(x*) = Σ m_j/(r_j²+ε²)^(p/2)**。
 * 源は `{m,x,y}` の配列。**m>0 でない源・非有限は null**(0 で埋めない)。
 * @returns {{D:number, n:number, terms:number[]}|null}
 */
export function determinacySum(sources, px, py, opts) {
  const o = opts || {};
  const eps = (o.eps === undefined) ? 0 : Number(o.eps);
  const p = (o.p === undefined) ? 1 : Number(o.p);
  if (!Array.isArray(sources)) return null;
  if (!Number.isFinite(eps) || !(eps >= 0) || !Number.isFinite(p) || !(p >= 0)) return null;
  if (!Number.isFinite(px) || !Number.isFinite(py)) return null;
  const e2 = eps * eps;
  const terms = [];
  let D = 0;
  for (const b of sources) {
    if (!b) return null;
    const m = Number(b.m), bx = Number(b.x), by = Number(b.y);
    if (!(Number.isFinite(m) && Number.isFinite(bx) && Number.isFinite(by))) return null;
    if (!(m > 0)) return null;
    const dx = px - bx, dy = py - by, s = dx * dx + dy * dy + e2;
    if (!(s > 0) || !Number.isFinite(s)) return null;
    const t = (p === 0) ? m : m * Math.pow(s, -p / 2);
    terms.push(t); D += t;
  }
  if (!Number.isFinite(D)) return null;
  return { D, n: sources.length, terms };
}

/** 距離 r・質量 m の 1 源だけの決定力(規則の値を作るときの最小形)。 */
export function determinacyOfOne(m, r, opts) {
  return determinacySum([{ m, x: r, y: 0 }], 0, 0, opts);
}

// ---------------------------------------------------------------- 源分割
/**
 * **源分割不変性**: 同じ物理配置を「分解して置く源」と「背景 D₀ に畳む源」に分ける分け方を
 * 変えても、基準点での **D 総和 = D₀ + Σ_{置いた源} m/(r²+ε²)^(p/2)** が一致するか。
 *
 * @param {object} o
 * @param {Array}  o.sources  すべての源 `{id,m,x,y}`
 * @param {number} o.px,o.py  基準点
 * @param {Array<string[]>} o.partitions 「置く源の id」の並び(残りは背景へ畳む)
 * @returns {{rows:Array, maxRelResid:number, exactAtEpsZero:boolean}|null}
 */
export function splitInvariance(o) {
  const s = o || {};
  const eps = (s.eps === undefined) ? 0 : Number(s.eps);
  const p = (s.p === undefined) ? 1 : Number(s.p);
  if (!Array.isArray(s.sources) || !Array.isArray(s.partitions)) return null;
  const rows = [];
  for (const keep of s.partitions) {
    const placed = s.sources.filter((b) => keep.indexOf(b.id) >= 0);
    const folded = s.sources.filter((b) => keep.indexOf(b.id) < 0);
    const dPlaced = determinacySum(placed, s.px, s.py, { eps, p });
    // **背景は「畳んだ源の総和」そのもの** —— ここに softening を入れるかは規約の分かれ目である。
    // D₀ は「距離に反比例する決定力の総和」なので、**背景側には softening を入れない**
    // (ε は数値設定であって背景の性質ではない)。差は下の `epsGap` に出す。
    const dFoldedNoEps = determinacySum(folded, s.px, s.py, { eps: 0, p });
    const dFoldedEps = determinacySum(folded, s.px, s.py, { eps, p });
    if ((placed.length && !dPlaced) || !dFoldedNoEps || !dFoldedEps) return null;
    const D0 = dFoldedNoEps.D;
    const total = D0 + (dPlaced ? dPlaced.D : 0);
    const totalIfEpsInBg = dFoldedEps.D + (dPlaced ? dPlaced.D : 0);
    rows.push({ keep: keep.slice(), nPlaced: placed.length, nFolded: folded.length,
      D0, dPlaced: dPlaced ? dPlaced.D : 0, total, totalIfEpsInBg,
      epsGap: total - totalIfEpsInBg });
  }
  const ref = rows.length ? rows[0].total : 0;
  let maxRel = 0;
  for (const r of rows) {
    r.relResidVsFirst = ref !== 0 ? (r.total - ref) / ref : (r.total === 0 ? 0 : Infinity);
    if (Math.abs(r.relResidVsFirst) > maxRel) maxRel = Math.abs(r.relResidVsFirst);
  }
  // ε=0 での厳密一致(**定義の整合そのもの** —— ε>0 では置いた源の側にだけ ε が入るのでずれる)
  let exact = true;
  if (eps !== 0) {
    const z = splitInvariance({ ...s, eps: 0 });
    exact = !!(z && z.maxRelResid <= 4e-16);
  } else {
    exact = maxRel <= 4e-16;
  }
  return { rows, maxRelResid: maxRel, exactAtEpsZero: exact, eps, p };
}

// ---------------------------------------------------------------- 規則の値
/**
 * 裁定の規則で D_bg を作る(SI・**両方の冪で**)。
 * @param {"solar-excluded"|"heliocentric"|"galactic"} rule
 * @param {object} o `{heliocentricDistanceM}`(heliocentric のとき)
 * @returns {{p1:number|null, p2:number|null, formula:string, undeterminedWhy:string|null}}
 */
export function ruleBackgroundSI(rule, o) {
  const s = o || {};
  const Msun = ASSUMPTIONS.sunMassKg.value;
  const R0 = ASSUMPTIONS.galacticR0Kpc.value * 1e3 * ASSUMPTIONS.parsecMeters.value;
  const Mg = ASSUMPTIONS.galacticMassEnclosedMsun.value * Msun;
  const gal = { p1: Mg / R0, p2: Mg / (R0 * R0) };
  if (rule === 'heliocentric') {
    const r = Number(s.heliocentricDistanceM);
    if (!Number.isFinite(r) || !(r > 0))
      return { p1: null, p2: null, formula: 'M☉/r', undeterminedWhy: '太陽からの距離が宣言されていない' };
    // **太陽を置かないサンプルの背景**。銀河の寄与を足すかどうかは規則の文面が決めていない
    return { p1: Msun / r, p2: Msun / (r * r), formula: 'M☉/r(+ 銀河は別欄)',
      galacticRemainder: gal, undeterminedWhy: null };
  }
  if (rule === 'galactic') {
    return { p1: gal.p1, p2: gal.p2, formula: 'M_enc(R₀)/R₀', undeterminedWhy: null };
  }
  if (rule === 'solar-excluded') {
    // **太陽を除いたあとに何が残るかは規則の文面が決めていない** —— 0 と銀河の 2 通りを並べる
    return { p1: null, p2: null, formula: '太陽を除いた残り(規則が決めていない)',
      candidates: { zero: { p1: 0, p2: 0 }, galactic: gal },
      undeterminedWhy: '規則は「太陽を含めない」としか書いていない(残りの銀河寄与を足すかは決断事項)' };
  }
  return { p1: null, p2: null, formula: '—', undeterminedWhy: '未知の規則' };
}

/** サンプルの単位 (scaleExp) から D₀ の SI 換算係数を作る。p=1 は M/L・p=2 は M/L²。 */
export function d0UnitSI(scaleExp, p) {
  if (!scaleExp || !Number.isFinite(Number(scaleExp.M)) || !Number.isFinite(Number(scaleExp.L)))
    return null;
  return Math.pow(10, Number(scaleExp.M) - p * Number(scaleExp.L));
}

export default { DSPLIT_VERSION, ASSUMPTIONS, assumptionRows, determinacySum, determinacyOfOne,
  splitInvariance, ruleBackgroundSI, d0UnitSI };
