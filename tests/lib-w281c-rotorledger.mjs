// 第281便c(原仮定者の裁定(第71報)「重力マイクロレンズで見つかる浮遊惑星の質量算出根拠を調べ、DFM のダークローターを
// 恒星質量程度に調整して当てはめる。調整結果を DFM 版銀河の質量に計上する」・統括の検証項目 R74): **条件付き質量台帳**と
// **偏向結合 η の対照**の純関数。
//
// ■ 何をするか
//   (i)  🛞 ngc3198DFM の bodies から質量群(恒星の基準質量 M★・恒星の補正 f★・気体・中心核)を読む(**宣言値から計算** ——
//        エンジンは走らせない)。
//   (ii) **条件付き台帳**: N_DR = n_ratio · M★ / ⟨m★⟩(個数比 n_ratio=20 を観測されたとする**仮定**・⟨m★⟩=0.5 M☉ を宣言)、
//        M_DR = N_DR · ⟨m_DR⟩、M_gal = f★M★ + M_gas + M_core + M_DR を ⟨m_DR⟩ = 0.1 / 1 / 10 M☉ の 3 シナリオで表にする。
//        **ダークローターは f★ に含めない別集団として 1 回だけ足す**(f★ は恒星の見掛け質量の補正で、ダークローターには掛けない)。
//        観測の行(浮遊惑星の総質量 ≈80 M⊕/恒星 —— 地球質量級)を同じ単位で並べる。
//   (iii) **η 対照**: 標準の偏向則 θ_E² = κ M π_rel・t_E = θ_E/μ_rel のもとで、同じ幾何(π_rel・μ_rel)で ⟨m_DR⟩ が地球質量級の
//        観測例と同じ t_E・θ_E を保つのに要る偏向の結合 η = M_lens / M_dyn と、η = 1 のときの t_E・θ_E、
//        η = 1 のまま同じ θ_E を作る π_rel(と視線距離の差)。
//
// ■ この器がしないこと
//   ・合否・一致を言わない。η を測らない(η は**仮説**で、DFM の現行の光線は重力と同じ m を読む —— 器 exp-w281c が実測)。
//   ・「ダークローターが浮遊惑星である」とは言わない。浮遊惑星の観測(地球質量級)と恒星質量の仮定を**別の行**に置く。
//   ・プリセット・エンジンに接続しない(表示専用の宣言 `massLedger` の値をここで作り、QA が html の宣言と照合する)。
//
// 数値の出典(**一次資料は未取得 —— 番号のみ**。値は統括の検証項目 R74 に書かれた値の転記):
//   NASA(2023)Roman の浮遊惑星の記事(個数比「約 20 倍」と Roman の 400 個は検出予測)・
//   arXiv:2303.08279(浮遊惑星の質量関数・0.33〜6660 M⊕・21(+23/−13) 個/恒星・総質量 80(+73/−47) M⊕/恒星)・
//   arXiv:2303.08280(MOA-9y-5919: t_E 0.057±0.016 日・θ_E 0.90±0.14 μas・質量は事前分布により 0.37 / 0.75 M⊕)・
//   arXiv:2507.13794(制約側 —— 内容は転記しない)。

/** 物理定数(IAU 2015 の公称 GM と定義値)。M⊕/M☉ は GM の比。 */
export const CONST = Object.freeze({
  GM_SUN: 1.3271244e20,          // m^3/s^2(IAU 2015 公称 GM☉)
  GM_EARTH: 3.986004e14,         // m^3/s^2(IAU 2015 公称 GM⊕)
  C: 299792458,                  // m/s
  AU: 1.495978707e11,            // m(IAU 2012 定義)
  M_SUN_KG: 1.9885e30,           // kg(アプリ内の換算と同じ値 —— 🥀 の parameterAudit 等)
  MAS_PER_RAD: 180 / Math.PI * 3600 * 1000,
  AU_PER_KPC: 1000 * 648000 / Math.PI,
});

/** M⊕/M☉(GM の比)。 */
export function earthPerSun() { return CONST.GM_EARTH / CONST.GM_SUN; }

/** κ = 4 G M☉ / (c² AU) を mas / M☉ で返す(θ_E² = κ M π_rel の係数)。 */
export function kappaMasPerSun() {
  return 4 * CONST.GM_SUN / (CONST.C * CONST.C * CONST.AU) * CONST.MAS_PER_RAD;
}

/**
 * 第282便d(原仮定者の裁定(第72報)③「f≈2・f≈1+kFrame は廃止・f≈1 も f=1 に」): **台帳の f★ は 1**。
 * bodies に焼き込まれた f(massCalibration.factorUniform —— 旧契約)は `fDynamics` として並べ、恒星の基準質量
 * M★ = (bodies の恒星質量)/fDynamics を作るのにだけ使う。**旧 1147.4 単位(f★≈2)は持ち越さない**。
 */
export const F_LEDGER = 1;

/**
 * 🛞 ngc3198DFM の宣言から質量群を読む(bodies の宣言値 —— エンジンの Float32 化の前の値)。
 * 形の前提(崩れていたら例外): bodies[0] = 恒星の円盤(mMin=mMax・shell なし)・bodies[1] = 気体の円盤(shell:"gas")・
 * bodies[2] = 中心核(single)・massCalibration.factorUniform(f 固定形 law:"f-fixed-1" なら `f`)= f_dyn(1≤f≤3 —— 第282便a/d で 1 を受理)。
 * @param {object} [o]
 * @param {number} [o.fLedger=F_LEDGER] 台帳の f★(第282便d: 既定 1。第281便c の台帳は f★=f_dyn だった —— 履歴は fLedger に f_dyn を渡す)
 */
export function massGroupsFromPreset(p, o = {}) {
  const b = (p && p.bodies) || [];
  const st = b[0], gs = b[1], co = b[2];
  const mc = p.massCalibration || {};
  if (!st || st.type !== 'disk' || st.shell !== undefined || st.mMin !== st.mMax) throw new Error('bodies[0] が恒星の円盤(mMin=mMax)でない');
  if (!gs || gs.type !== 'disk' || gs.shell !== 'gas' || gs.mMin !== gs.mMax) throw new Error('bodies[1] が気体の円盤(shell:"gas")でない');
  if (!co || co.type !== 'single') throw new Error('bodies[2] が中心核(single)でない');
  // 第282便a/d(第72報 ③ f=1): factorUniform(f 固定形なら f)を f_dyn として 1≤f≤3 で読む。二重加算の検査は f★=1 でも同じ式で効く
  const fDyn = (typeof mc.factorUniform === 'number') ? mc.factorUniform : mc.f;
  if (!(typeof fDyn === 'number' && fDyn >= 1 && fDyn <= 3)) throw new Error('massCalibration.factorUniform が無い');
  const f = (o.fLedger === undefined) ? F_LEDGER : o.fLedger;
  if (!(typeof f === 'number' && f >= 1 && f <= 3)) throw new Error('fLedger は 1≤f≤3');
  const se = p.scaleExp || {};
  if (typeof se.M !== 'number') throw new Error('scaleExp.M が無い');
  const starEff = st.n * st.mMin;          // bodies の恒星質量(f_dyn が焼き込まれたまま —— 力学の値)
  const starBase = starEff / fDyn;
  const gas = gs.n * gs.mMin;
  const core = co.m;
  return {
    starN: st.n, starMEach: st.mMin, fStar: f, fDynamics: fDyn, starEff, starBase, starBaseEach: st.mMin / fDyn,
    gasN: gs.n, gasMEach: gs.mMin, gas, core, unitKg: Math.pow(10, se.M),
    totalUnit: starEff + gas + core,        // 力学(bodies)の総質量(f_dyn 込み —— 台帳の合計ではない)
    ledgerTotalUnit: f * starBase + gas + core,
  };
}

/** 単位 → M☉。 */
export function unitToSun(u, unitKg, mSunKg = CONST.M_SUN_KG) { return u * unitKg / mSunKg; }

/**
 * 条件付き台帳。g = massGroupsFromPreset の戻り値。
 * @param {object} [o]
 * @param {number} [o.mStarSun=0.5] 平均恒星質量 ⟨m★⟩(M☉ —— 宣言)
 * @param {number} [o.nRatio=20]    ダークローター数 / 恒星数(個数比 —— 原仮定者の指示の値)
 * @param {number[]} [o.scenarios=[0.1,1,10]] ⟨m_DR⟩(M☉)
 */
export function rotorLedger(g, o = {}) {
  const mStarSun = o.mStarSun ?? 0.5, nRatio = o.nRatio ?? 20, sc = o.scenarios ?? [0.1, 1, 10];
  const mSunKg = o.mSunKg ?? CONST.M_SUN_KG;
  const starBaseSun = unitToSun(g.starBase, g.unitKg, mSunKg);
  const nStars = starBaseSun / mStarSun;
  const nRotor = nRatio * nStars;
  const baseTotalUnit = g.fStar * g.starBase + g.gas + g.core;   // = 現状(ダークローター 0)
  const rows = sc.map((mRotorSun) => {
    const mRotorSunTot = nRotor * mRotorSun;
    const mRotorUnit = mRotorSunTot * mSunKg / g.unitKg;
    const totalUnit = baseTotalUnit + mRotorUnit;             // 二重加算しない: f★ は恒星だけに掛かる
    return { mRotorSun, nRotor, mRotorUnit, mRotorSunTot, totalUnit,
      totalSun: unitToSun(totalUnit, g.unitKg, mSunKg), ratioToCurrent: totalUnit / baseTotalUnit,
      rotorOverStarBase: mRotorUnit / g.starBase };
  });
  return {
    mStarSun, nRatio, mSunKg, rotorInFStar: false,
    starBaseSun, nStars, nRotor,
    current: { totalUnit: baseTotalUnit, totalSun: unitToSun(baseTotalUnit, g.unitKg, mSunKg), mRotorUnit: 0 },
    rows,
  };
}

/**
 * 観測の行: 浮遊惑星の総質量(地球質量級)を同じ恒星数に掛けた値。
 * 既定は統括の検証項目 R74 の値(総質量 80(+73/−47) M⊕/恒星・個数 21(+23/−13)/恒星・0.33〜6660 M⊕)。
 */
export function ffpObsRow(g, led, o = {}) {
  const tot = o.totalEarthPerStar ?? 80, up = o.plus ?? 73, dn = o.minus ?? 47;
  const eps = earthPerSun();
  const perStarSun = tot * eps;
  const toUnit = (earthPerStar) => led.nStars * earthPerStar * eps * led.mSunKg / g.unitKg;
  return {
    totalEarthPerStar: tot, plus: up, minus: dn,
    nPerStar: o.nPerStar ?? 21, nPlus: o.nPlus ?? 23, nMinus: o.nMinus ?? 13,
    massRangeEarth: o.massRangeEarth ?? [0.33, 6660],
    fracOfStarMass: perStarSun / led.mStarSun,
    addUnit: toUnit(tot), addUnitLo: toUnit(tot - dn), addUnitHi: toUnit(tot + up),
    totalUnit: led.current.totalUnit + toUnit(tot),
  };
}

/**
 * η 対照。観測例(t_E・θ_E・M_lens)の幾何(π_rel・μ_rel)を固定し、⟨m_DR⟩ ごとに
 *   η = M_lens / m(同じ t_E・θ_E を保つ偏向の結合)・η=1 の t_E と θ_E・η=1 で同じ θ_E を作る π_rel と視線距離の差 を返す。
 */
export function lensEtaTable(o = {}) {
  const tE = o.tEDays ?? 0.057, thMuas = o.thetaEMuas ?? 0.90, mLensEarth = o.mLensEarth ?? 0.75;
  const dsKpc = o.dsKpc ?? 8, sc = o.scenarios ?? [0.1, 1, 10];
  const kappa = kappaMasPerSun();
  const mLensSun = mLensEarth * earthPerSun();
  const thMas = thMuas * 1e-3;
  const piRelObs = thMas * thMas / (kappa * mLensSun);           // mas
  const muRelMasYr = thMas / tE * 365.25;
  const dLObsKpc = 1 / (1 / dsKpc + piRelObs);
  const rows = sc.map((m) => {
    const eta = mLensSun / m;
    const s = Math.sqrt(m / mLensSun);
    const piNeed = thMas * thMas / (kappa * m);                  // η=1 で同じ θ_E を作る π_rel(mas)
    const gapKpc = dsKpc * dsKpc * piNeed / (1 + dsKpc * piNeed); // D_S − D_L(打ち消しを避けた形)
    return { mRotorSun: m, eta, tEDaysEta1: tE * s, thetaEMuasEta1: thMuas * s,
      piRelMasForSameThetaE: piNeed, losGapAU: gapKpc * CONST.AU_PER_KPC };
  });
  return { tEDays: tE, thetaEMuas: thMuas, mLensEarth, mLensSun, kappaMasPerSun: kappa,
    dsKpc, piRelObsMas: piRelObs, dLObsKpc, muRelMasYr, rows };
}

/** 台帳 1 行の内部整合(QA 用): totalUnit = f★M★ + gas + core + M_DR・nRotor = n_ratio M★/⟨m★⟩・二重加算なし。 */
export function ledgerIdentityError(ml) {
  const base = ml.fStar * ml.starBase + ml.gas + ml.core;
  let worst = 0;
  const rel = (a, b) => Math.abs(a - b) / Math.max(Math.abs(b), 1e-300);
  for (const r of ml.rotorScenarios || []) {
    worst = Math.max(worst, rel(r.totalUnit, base + r.mRotorUnit));
    // f★ を M_DR にも掛けた(二重加算)値とは一致してはいけない —— ここでは誤差だけを返し、判定は呼び出し側
  }
  return worst;
}

/** 相対差(QA の 1e-12 照合に使う)。 */
export function relDiff(a, b) { return Math.abs(a - b) / Math.max(Math.abs(a), Math.abs(b), 1e-300); }

/** 表示の書式(docs/PHYSICS.md〔第281便c〕の表と QA `docs.rotorLedger` が同じ関数で書く): 有効 d+1 桁の「a.bcd×10ⁿ」。 */
export function fmtSci(x, d = 3) {
  const SUP = { '-': '⁻', '0': '⁰', '1': '¹', '2': '²', '3': '³', '4': '⁴', '5': '⁵', '6': '⁶', '7': '⁷', '8': '⁸', '9': '⁹' };
  const [m, e] = Number(x).toExponential(d).split('e');
  const n = String(Number(e));
  return m + '×10' + [...n].map((c) => SUP[c]).join('');
}

/** docs/PHYSICS.md〔第281便c〕の表に必ず現れる文字列(QA が正本 JSON から作り直して探す)。 */
export function docTokens(J) {
  const led = J.ledger, ffp = J.ffpObs, e75 = J.eta.mLens075, e37 = J.eta.mLens037;
  const t = [];
  t.push(led.current.totalUnit.toFixed(3), fmtSci(led.current.totalSun), fmtSci(led.nStars), fmtSci(led.nRotor));
  for (const r of led.rows) {
    t.push(String(Math.round(r.mRotorUnit)), r.totalUnit.toFixed(3), fmtSci(r.totalSun), fmtSci(r.mRotorSunTot), r.ratioToCurrent.toFixed(3));
  }
  t.push((ffp.fracOfStarMass * 100).toFixed(4) + '%', ffp.addUnit.toFixed(4), ffp.addUnitLo.toFixed(4), ffp.addUnitHi.toFixed(4));
  for (let k = 0; k < e75.rows.length; k++) {
    const r = e75.rows[k], q = e37.rows[k];
    t.push(fmtSci(r.eta), fmtSci(q.eta), r.tEDaysEta1.toFixed(2), q.tEDaysEta1.toFixed(2), r.thetaEMuasEta1.toFixed(1),
      fmtSci(r.piRelMasForSameThetaE), r.losGapAU.toFixed(0));
  }
  t.push(e75.kappaMasPerSun.toFixed(4), e75.piRelObsMas.toFixed(5), e75.dLObsKpc.toFixed(3), e75.muRelMasYr.toFixed(3));
  const lm = J.lensMassCoupling;
  t.push(lm.ratio2x.toFixed(3), lm.ratio4x.toFixed(3));
  return t;
}
