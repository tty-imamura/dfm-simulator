// 第292便a(原仮定者の裁定(第82報)④「『現実較正』サンプルを『較正 合』にしていくために、GR の 1PN との差を精査する。
// できない場合はその理由を分析する」・統括の検証項目 R137)— **現実較正 20 本の量ごとの主因分類**の純関数。
//
// ■ 何をするか(正本を**読むだけ** —— エンジンを 1 步も走らせない・html を読まない)
//   較正母集団 20 本(判定器の正本 calaudit-w249.json の presets —— `sampleClass:"calibration"` ∧ 退役でない)の
//   **判定行**(門が扱う量の種類 period/ecc/precession/spin の行を、判定器の鍵 gate.key ごとに 1 行へまとめたもの)ごとに:
//     ① 1PN の大きさの見積り —— 近点: 二体 1PN の Δϖ=6πGM/(c²a(1−e²))〔rad/公転〕・周期と離心率: O(GM/(c²a))(相対)。
//        GM/(c²a)・e・a/R は正本の `correlates`(主対象の宣言から判定器が作った値)。主対象でない対象は**同じ主星のまわりの
//        ケプラー則** a ∝ P^{2/3} で観測周期から写す(GM/(c²a) ∝ P^{−2/3}・a/R ∝ P^{2/3} —— 写したことを行に残す)。
//     ② 現行の残差(正本の residualPct・gate.nSigma)と並べ、「1PN の是正で動く桁か」(pn1Movable)を真偽で出す。
//     ③ 主因の分類(重複可)を**規則表 RULES** で付ける(名前では付けない —— 各規則は正本の欄だけを読み、根拠の欄を行に残す)。
//     ④ 合へ進みうる量(主因が「いま走っている法則の中」にある量 —— CANDIDATE_RULES)と、合にできない量とその理由。
//
// ■ この器がしないこと: 判定しない(4 値・5 区分は判定器の転記)・観測値を選ばない・σ を丸め桁から作らない・
//   「合になる」と書かない・EIH の係数・源集合・`_core` に触らない(主因が 1PN でない量を 1PN の是正で合にしない)。
import crypto from 'node:crypto';

export const CALCAUSE_VERSION = 'w292a-calcause-1';
export const INPUTS = {
  cal: 'tests/out/calaudit-w249.json',
  solar: 'tests/out/solarsigma-w262d.json',
  charon: 'tests/out/charoninput-w280d.json',
  mercury: 'tests/out/mercury-w280a.json',
  pnsrc: 'tests/out/pnsources-w291b.json',
};
/** 判定行に数える量の種類(判定器の門が扱う種類 —— other は門の外 = solarsigma の kind-not-gated)。 */
export const GATED_KINDS = ['period', 'ecc', 'precession', 'spin'];
/** ユリウス年(solarsigma の換算と同じ —— deg/yr ↔ rad/公転)。 */
export const YEAR_SEC = 31557600;
/** 閾値(**宣言** —— 結果を見て動かさない)。 */
export const TH = {
  strongGMac2: 1e-2,     // GM/(c²a) ≥ 10⁻²: 2PN が相対 10⁻⁴ を超え、放射反作用も効く —— 保守的な 1PN の範囲外
  pn1Lo: 0.1, pn1Hi: 10, // 残差が 1PN の桁: 0.1 ≤ |残差|/1PN ≤ 10
  moveFloor: 0.1,        // 1PN の是正で動く桁: 1PN ≥ 0.1 × |残差|
  outsideLaw: 0.1,       // 近点の観測値に 1PN が占める割合 < 0.1 → 観測の近点は二体の 1PN の外の源が作る
  reproduce: 0.1,        // 第三体を含む本の走行値が観測の近点に 10% 以内 → 法則の中の第三体が作る
  aOverRZonal: 30,       // a/R ≤ 30: 主星の帯状重力の (R/a)² が効く距離(衛星・環)
  grossRel: 0.5,         // |残差| ≥ 50%: 初期状態が比較量を表していない(入力の写像)
  nSigmaMap: 3,          // σ のある周期の行で |残差| > 3σ: 解・元期・定義の写像が先
  smallRel: 1e-4,        // σ 未接続の周期で残差が既に小さい(相対 10⁻⁴ 以下)
  decompShare: 0.9,      // 数値の分解で刻み+軟化が不足の 90% 以上
};
/** 分類の語彙(層・意味・次に解くこと)。 */
export const CLASSES = {
  'pn1': { layer: '加速度式', ja: '1PN が主因で残差が 1PN の桁',
    next: '1PN 一貫の初期状態(ニュートンの a・e から 1PN 軌道へ)の写像で残差の 1PN 部分を分ける —— EIH の式・源集合は変えない' },
  'strong-field': { layer: '加速度式', ja: '強場(GW 系 —— 保守的な 1PN の範囲外)',
    next: 'GM/(c²a) ≥ 10⁻² の系は 1PN の照合の対象にしない(2PN・放射反作用の宣言が先)' },
  'numerics': { layer: '数値積分', ja: '軟化と刻み(数値未解決)',
    next: '刻み 3 段(h/h2/h4)と正の実測次数で収束を示し、軟化を宣言誤差として分ける' },
  'mapping': { layer: '観測への写像', ja: '入力と比較量の写像',
    next: '同一解・同一元期の状態ベクトル(または軌道要素)と GM・共分散・座標時を揃え、比較量の定義(e↔eProxy・e_T・Pb)を宣言する' },
  'sigma-unconnected': { layer: '観測への写像', ja: 'σ 未接続',
    next: '観測 σ を観測表に宣言し σ 接続器へ入れる(判定が出るまで —— 合否は約束しない)' },
  'third-body': { layer: '宇宙モデル', ja: '第三体・太陽摂動',
    next: '第三体の摂動は二体の 1PN では出ない —— 第三体を含む本と理想化の床(2D・円軌道・傾斜なし)を宣言して比べる' },
  'oblateness': { layer: '宇宙モデル', ja: '帯状重力(J2 など)',
    next: '帯状重力は質点 1PN では出ない —— J2/J4 と幾何を宣言して比べる' },
  'pinned': { layer: '宇宙モデル', ja: '固定源の近似',
    next: '外部支持で運動を置いた源の近似 —— 自由な源の写しと比べて桁を測る(正本に桁が無いので主因の首位に置かない)' },
};
export const CLASS_KEYS = Object.keys(CLASSES);
export const LAYERS = ['加速度式', '数値積分', '観測への写像', '宇宙モデル'];
/** 主因(首位)を選ぶ順。 */
export const PRIMARY_ORDER = ['mapping', 'numerics', 'strong-field', 'third-body', 'oblateness', 'pn1', 'sigma-unconnected', 'pinned'];
/** 規則表(**正本の欄だけ**を読む —— 名前・絵文字・id では付けない)。evidence は行に残す根拠の欄。 */
export const RULES = [
  { id: 'R1', cls: 'strong-field', test: 'GM/(c²a) ≥ TH.strongGMac2', evidence: 'calaudit /presets/*/correlates/GMac2(主対象でなければケプラー則で写した値)' },
  { id: 'R2', cls: 'numerics', test: "gate.status === '数値未解決'", evidence: 'calaudit /presets/*/quantities/*/gate/status・reason' },
  { id: 'R3', cls: 'mapping', test: "gate.status === 'mapping-unresolved'", evidence: 'calaudit /presets/*/quantities/*/gate/status' },
  { id: 'R4', cls: 'mapping', test: '行が判定器の写像未確定の宣言(mappingDeclarations.rows)に載る', evidence: 'calaudit /mappingDeclarations/rows' },
  { id: 'R5', cls: 'mapping', test: '閉じた式(宣言の GM・a のニュートン二体周期)の比較値との差が 3σ を超え、その比較値が行の観測値と同じ', evidence: 'charoninput /audit/closedFormPeriod・closedFormResidual' },
  { id: 'R6', cls: 'mapping', test: '周期の行で σ があり |残差| > TH.nSigmaMap σ', evidence: 'calaudit gate.sigma・gate.nSigma' },
  { id: 'R7', cls: 'mapping', test: '|残差| ≥ TH.grossRel(相対)', evidence: 'calaudit residualPct' },
  { id: 'R8', cls: 'sigma-unconnected', test: 'gate.sigma が null', evidence: 'calaudit gate.sigma・solarsigma /rows/*/cut' },
  { id: 'R9', cls: 'pn1', test: 'TH.pn1Lo ≤ |残差|/1PN ≤ TH.pn1Hi', evidence: 'calaudit residualPct・correlates(1PN の見積り)' },
  { id: 'R10', cls: 'oblateness', test: '近点の行で 1PN/観測 < TH.outsideLaw ∧ 本が帯状重力を宣言(pnsources の conf.reasons に zonal)', evidence: 'pnsources /rows/*/conf/reasons・solarsigma /rows/*/csvRow' },
  { id: 'R11', cls: 'third-body', test: '近点の行で 1PN/観測 < TH.outsideLaw ∧ 源 ≥ 3 ∧ 走行値が観測に TH.reproduce 以内', evidence: 'pnsources /rows/*/srcNow・calaudit meas' },
  { id: 'R12', cls: 'oblateness', test: '近点の行で 1PN/観測 < TH.outsideLaw ∧ R10/R11 に当たらない ∧ a/R ≤ TH.aOverRZonal', evidence: 'calaudit /presets/*/correlates/aOverR' },
  { id: 'R13', cls: 'third-body', test: '近点の行で 1PN/観測 < TH.outsideLaw ∧ R10/R11 に当たらない ∧ a/R > TH.aOverRZonal', evidence: 'calaudit /presets/*/correlates/aOverR' },
  { id: 'R14', cls: 'pinned', test: '本が固定源を持つ(pnsources の conf.reasons に pinned)∧ 軌道の量(spin 以外)', evidence: 'pnsources /rows/*/conf/reasons' },
];
/** 合へ進みうる量の規則(主因が「いま走っている法則の中」にある量だけ)。 */
export const CANDIDATE_RULES = [
  { id: 'C1', test: "周期の行 ∧ 主因 sigma-unconnected ∧ 分類 ⊆ {sigma-unconnected, pinned} ∧ |残差| ≤ TH.smallRel", next: 'σ を繋いで判定に入れる(合否は σ 次第 —— 約束しない)' },
  { id: 'C2', test: "本の 4 値が量限定合 ∧ gate.status === 'mapping-unresolved' ∧ gate.nSigma ≤ 3", next: '比較量の写像(e ↔ eProxy)を宣言して門に入れる' },
  { id: 'C3', test: '分類に numerics ∧ 数値の分解(mercury の正本)で刻み+軟化が不足の TH.decompShare 以上', next: '軟化を宣言誤差として分離し、刻みの収束を示してから門に入れる' },
];

const isNum = (v) => typeof v === 'number' && Number.isFinite(v);
const deg2rad = Math.PI / 180;

/** 近点の値を rad/公転 へ(unit: deg/orbit・deg/yr・s〔近点回転の周期〕)。P は対象の公転周期 [s]。 */
export function precToRadPerOrbit(v, unit, P) {
  if (!isNum(v)) return null;
  if (unit === 'deg/orbit') return v * deg2rad;
  if (unit === 'deg/yr') return isNum(P) ? v * deg2rad * P / YEAR_SEC : null;
  if (unit === 's') return isNum(P) && v !== 0 ? 2 * Math.PI * P / v : null;
  return null;
}

/**
 * 正本 → 主因分類。
 * @param {{cal:object, solar:object, charon:object, mercury:object, pnsrc:object}} J 読んだ正本
 */
export function buildCalCause(J) {
  const cal = J.cal, solar = J.solar, charon = J.charon, mercury = J.mercury, pnsrc = J.pnsrc;
  const errors = [];
  const presets = cal.presets || [];
  const ledger = new Map(((cal.verdictLedger || {}).rows || []).map((r) => [r.id, r]));
  if (presets.length !== 20) errors.push(`較正母集団が 20 本でない(${presets.length})`);
  const srcRows = new Map(((pnsrc || {}).rows || []).map((r) => [r.id, r]));
  const solarRows = (solar || {}).rows || [];
  const mapDecl = new Set((((cal.mappingDeclarations || {}).rows) || []).map((r) => r.id + '|' + r.name));
  const cf = ((charon || {}).audit) || {};
  const cfCompared = isNum(cf.closedFormPeriod) && cf.closedFormResidual && isNum(cf.closedFormResidual.sec)
    ? cf.closedFormPeriod - cf.closedFormResidual.sec : null;
  const mObs = (((mercury || {}).observed || {}).kF0Row || {}).value;
  const mDec = ((((mercury || {}).decomposition || {}).coarse || {}).obsKF0) || null;
  const mLam = (((mercury || {}).operator || {}).lambdaDiffFormalCell) || {};

  const solarOf = (id, q) => solarRows.find((r) => r.id === id && r.name === q.name && r.kind === q.kind && r.target === q.target)
    || solarRows.find((r) => r.id === id && r.kind === q.kind && r.target === q.target) || null;
  const csvVal = (s) => (s && s.csvRow && isNum(s.csvRow.value) && s.csvRow.value !== 0) ? { v: s.csvRow.value, unit: s.csvRow.unit } : null;

  const rows = [];
  const books = [];
  for (let pi = 0; pi < presets.length; pi++) {
    const p = presets[pi];
    const co = p.correlates || {};
    const src = srcRows.get(p.id) || null;
    const reasons = (src && src.conf && Array.isArray(src.conf.reasons)) ? src.conf.reasons : [];
    const srcN = src && isNum(src.srcNow) ? src.srcNow : null;
    const qs = p.quantities || [];
    // 対象の公転周期(観測 → CSV → 走行値の順)
    const periodOf = (t) => {
      for (const q of qs) if (q.kind === 'period' && q.target === t && isNum(q.obs)) return { P: q.obs, from: 'obs' };
      for (const q of qs) if (q.kind === 'period' && q.target === t) { const c = csvVal(solarOf(p.id, q)); if (c && c.unit === 's') return { P: c.v, from: 'csv' }; }
      for (const q of qs) if (q.kind === 'period' && q.target === t && isNum(q.meas)) return { P: q.meas, from: 'meas' };
      return { P: null, from: null };
    };
    const main = co.mainTarget;
    const Pm = periodOf(main);
    const eOf = (t) => {
      if (t === main && isNum(co.e)) return { e: co.e, from: 'correlates' };
      for (const q of qs) if (q.kind === 'ecc' && q.target === t && isNum(q.obs)) return { e: q.obs, from: 'obs' };
      for (const q of qs) if (q.kind === 'ecc' && q.target === t) { const c = csvVal(solarOf(p.id, q)); if (c) return { e: c.v, from: 'csv' }; }
      for (const q of qs) if (q.kind === 'ecc' && q.target === t && isNum(q.meas)) return { e: q.meas, from: 'meas' };
      return { e: 0, from: 'none(0)' };
    };
    // 判定行(gate.key ごとに 1 行)
    const groups = new Map();
    qs.forEach((q, qi) => {
      if (GATED_KINDS.indexOf(q.kind) < 0) return;
      const key = (q.gate || {}).key || (p.id + '|' + q.target + '|' + q.kind);
      if (!groups.has(key)) groups.set(key, []);
      groups.get(key).push({ q, qi });
    });
    const bookRows = [];
    for (const [key, list] of groups) {
      const rep = list.find((z) => z.q.verdict !== '転' && (z.q.gate || {}).sigma != null)
        || list.find((z) => z.q.verdict !== '転') || list[0];
      const q = rep.q, g = q.gate || {};
      const t = q.target;
      const Pt = periodOf(t);
      let GMac2 = null, aOverR = null, scaled = false;
      if (t === main) { GMac2 = isNum(co.GMac2) ? co.GMac2 : null; aOverR = isNum(co.aOverR) ? co.aOverR : null; }
      else if (isNum(co.GMac2) && isNum(Pm.P) && isNum(Pt.P)) {
        const r = Pm.P / Pt.P;
        GMac2 = co.GMac2 * Math.pow(r, 2 / 3); aOverR = isNum(co.aOverR) ? co.aOverR * Math.pow(1 / r, 2 / 3) : null; scaled = true;
      }
      const et = eOf(t);
      const pnPrecRad = isNum(GMac2) ? 6 * Math.PI * GMac2 / (1 - et.e * et.e) : null;
      const s = solarOf(p.id, q);
      const csv = csvVal(s);
      const res = isNum(q.residualPct) ? q.residualPct / 100 : null;
      // 近点の観測値(rad/公転)
      let obsPrecRad = null, obsPrecFrom = null, measPrecRad = null;
      if (q.kind === 'precession') {
        if (isNum(q.obs)) { obsPrecRad = precToRadPerOrbit(q.obs, q.unit, Pt.P); obsPrecFrom = 'calaudit obs'; }
        if (obsPrecRad === null && csv) { obsPrecRad = precToRadPerOrbit(csv.v, csv.unit, Pt.P); obsPrecFrom = obsPrecRad === null ? null : 'solarsigma csvRow'; }
        measPrecRad = precToRadPerOrbit(q.meas, q.unit, Pt.P);
      }
      // 1PN の見積り(相対)
      let pnRel = null, pnBasis = null;
      if (q.kind === 'period' || q.kind === 'ecc') { pnRel = GMac2; pnBasis = 'O(GM/(c²a))'; }
      else if (q.kind === 'precession') { pnBasis = 'Δϖ_1PN/|ϖ_obs|'; pnRel = (isNum(pnPrecRad) && isNum(obsPrecRad) && obsPrecRad !== 0) ? pnPrecRad / Math.abs(obsPrecRad) : null; }
      else pnBasis = 'spin: kF0 は非自転の質点 EIH(式に自転の項が無い)';
      const ratio = (isNum(res) && isNum(pnRel) && pnRel > 0) ? Math.abs(res) / pnRel : null;
      const pn1Movable = (isNum(res) && isNum(pnRel)) ? (pnRel >= TH.moveFloor * Math.abs(res)) : null;
      bookRows.push({ pi, qi: rep.qi, p, q, g, key, list, t, Pt, GMac2, aOverR, scaled, et, pnPrecRad, s, csv, res,
        obsPrecRad, obsPrecFrom, measPrecRad, pnRel, pnBasis, ratio, pn1Movable, reasons, srcN });
    }
    books.push({ p, bookRows });
  }
  // 近点の観測値の共有(同じ天体の観測値を別の本の行から —— solarsigma の csvBody で引く。名前では引かない)
  const precByBody = new Map();
  for (const b of books) for (const r of b.bookRows) {
    if (r.q.kind !== 'precession' || r.obsPrecFrom !== 'calaudit obs' || !r.s || !r.s.csvBody) continue;
    if (!precByBody.has(r.s.csvBody)) precByBody.set(r.s.csvBody, { rad: r.obsPrecRad, from: r.p.id + ' の「' + r.q.name + '」' });
  }
  for (const b of books) for (const r of b.bookRows) {
    if (r.q.kind !== 'precession' || r.obsPrecRad !== null || !r.s || !r.s.csvBody) continue;
    const z = precByBody.get(r.s.csvBody);
    if (z) { r.obsPrecRad = z.rad; r.obsPrecFrom = '同じ天体の別の行(' + z.from + ')'; r.pnRel = isNum(r.pnPrecRad) && z.rad !== 0 ? r.pnPrecRad / Math.abs(z.rad) : null; }
  }
  // 分類
  const out = [];
  for (const b of books) {
    const p = b.p;
    const lr = ledger.get(p.id) || {};
    const rowsOut = [];
    for (const r of b.bookRows) {
      const q = r.q, g = r.g;
      const cls = [], hit = [];
      const tag = (rid, c, ev) => { if (cls.indexOf(c) < 0) cls.push(c); hit.push({ rule: rid, cls: c, evidence: ev }); };
      if (isNum(r.GMac2) && r.GMac2 >= TH.strongGMac2) tag('R1', 'strong-field', `GM/(c²a)=${sig(r.GMac2)}`);
      if (g.status === '数値未解決') tag('R2', 'numerics', `gate.status=数値未解決(${g.reason || ''})`);
      if (g.status === 'mapping-unresolved') tag('R3', 'mapping', `gate.status=mapping-unresolved(${g.reason || ''})`);
      if (r.list.some((z) => mapDecl.has(p.id + '|' + z.q.name))) tag('R4', 'mapping', 'mappingDeclarations.rows に載る');
      if (q.kind === 'period' && isNum(cfCompared) && isNum(q.obs) && Math.abs(q.obs - cfCompared) <= 1e-9 * Math.abs(q.obs)
        && isNum(cf.closedFormResidual.sigma) && Math.abs(cf.closedFormResidual.sigma) > 3)
        tag('R5', 'mapping', `閉じた式 ${cf.closedFormPeriod} s − 比較値 = ${sig(cf.closedFormResidual.sec)} s(${sig(cf.closedFormResidual.sigma)}σ)`);
      if (q.kind === 'period' && g.sigma != null && isNum(g.nSigma) && g.nSigma > TH.nSigmaMap) tag('R6', 'mapping', `σ=${sig(g.sigma)}・|残差|=${sig(g.nSigma)}σ`);
      if (isNum(r.res) && Math.abs(r.res) >= TH.grossRel) tag('R7', 'mapping', `残差 ${sig(q.residualPct)}%`);
      if (g.sigma == null) tag('R8', 'sigma-unconnected', 'gate.sigma=null' + (r.s ? `・solarsigma cut=${r.s.cut}` : ''));
      if (isNum(r.ratio) && r.ratio >= TH.pn1Lo && r.ratio <= TH.pn1Hi) tag('R9', 'pn1', `|残差|/1PN=${sig(r.ratio)}`);
      if (q.kind === 'precession' && isNum(r.obsPrecRad) && isNum(r.pnPrecRad) && r.obsPrecRad !== 0 && r.pnPrecRad / Math.abs(r.obsPrecRad) < TH.outsideLaw) {
        const fracTxt = `1PN/観測=${sig(r.pnPrecRad / Math.abs(r.obsPrecRad))}(観測 ${r.obsPrecFrom})`;
        const repro = isNum(r.measPrecRad) ? Math.abs(r.measPrecRad / r.obsPrecRad - 1) : null;
        if (r.reasons.indexOf('zonal') >= 0) tag('R10', 'oblateness', fracTxt + '・conf.reasons に zonal');
        else if (isNum(r.srcN) && r.srcN >= 3 && isNum(repro) && repro <= TH.reproduce) tag('R11', 'third-body', fracTxt + `・源 ${r.srcN}・走行/観測−1=${sig(repro)}`);
        else if (isNum(r.aOverR) && r.aOverR <= TH.aOverRZonal) tag('R12', 'oblateness', fracTxt + `・a/R=${sig(r.aOverR)}`);
        else if (isNum(r.aOverR)) tag('R13', 'third-body', fracTxt + `・a/R=${sig(r.aOverR)}`);
      }
      if (r.reasons.indexOf('pinned') >= 0 && q.kind !== 'spin') tag('R14', 'pinned', 'conf.reasons に pinned');
      const primary = PRIMARY_ORDER.find((c) => cls.indexOf(c) >= 0) || null;
      // 合へ進みうるか
      let cand = null;
      if (q.kind === 'period' && primary === 'sigma-unconnected' && cls.every((c) => c === 'sigma-unconnected' || c === 'pinned')
        && isNum(r.res) && Math.abs(r.res) <= TH.smallRel) cand = 'C1';
      else if (lr.verdict4 === '量限定合' && g.status === 'mapping-unresolved' && isNum(g.nSigma) && g.nSigma <= 3) cand = 'C2';
      let decomp = null;
      if (cls.indexOf('numerics') >= 0 && q.kind === 'precession' && isNum(mObs) && q.obs === mObs && mDec && mDec.share) {
        decomp = { epsFormal: (((mercury || {}).decomposition || {}).coarse || {}).epsFormal ?? null, share: mDec.share, parts: mDec.parts,
          lambdaDiffRatioToAnalytic: isNum(mLam.ratioToAnalytic) ? mLam.ratioToAnalytic : null, from: INPUTS.mercury + ' /decomposition/coarse/obsKF0' };
        if (!cand && isNum(mDec.share.step) && isNum(mDec.share.softening) && mDec.share.step + mDec.share.softening >= TH.decompShare) cand = 'C3';
      }
      const closedForm = hit.some((h) => h.rule === 'R5') ? { periodSec: cf.closedFormPeriod, residualSec: cf.closedFormResidual.sec,
        residualSigma: cf.closedFormResidual.sigma, runResidualSec: isNum(q.meas) && isNum(q.obs) ? q.meas - q.obs : null, from: INPUTS.charon + ' /audit' } : null;
      rowsOut.push({
        id: p.id, emoji: p.emoji, key: r.key, kind: q.kind, target: r.t, name: q.name, unit: q.unit ?? null,
        verdict5: q.verdict, verdicts: r.list.map((z) => z.q.verdict), nRows: r.list.length,
        gateStatus: g.status ?? null, sigma: g.sigma ?? null, nSigma: isNum(g.nSigma) ? g.nSigma : null,
        obs: isNum(q.obs) ? q.obs : null, meas: isNum(q.meas) ? q.meas : null, residualPct: isNum(q.residualPct) ? q.residualPct : null,
        solarCut: r.s ? (r.s.cut ?? null) : null, csvBody: r.s ? (r.s.csvBody ?? null) : null,
        pn1: { GMac2: r.GMac2, aOverR: r.aOverR, e: r.et.e, eFrom: r.et.from, scaledByKepler: r.scaled, periodSec: r.Pt.P, periodFrom: r.Pt.from,
          pnPrecRadPerOrbit: r.pnPrecRad, obsPrecRadPerOrbit: r.obsPrecRad, obsPrecFrom: r.obsPrecFrom, measPrecRadPerOrbit: r.measPrecRad,
          rel: r.pnRel, basis: r.pnBasis, residualOverPn1: r.ratio, movable: r.pn1Movable },
        classes: cls, primary, rules: hit, candidate: cand,
        next: primary ? CLASSES[primary].next : '門の中(主因の分類なし —— 判定器の合否のまま)',
        notByPn1: r.pn1Movable === false || (primary !== null && primary !== 'pn1' && r.pn1Movable !== true),
        decomposition: decomp, closedForm,
        src: { calaudit: `/presets/${r.pi}/quantities/${r.qi}`, correlates: `/presets/${r.pi}/correlates`, pnsources: r.srcN === null ? null : `/rows[id=${p.id}]` },
      });
    }
    const tally = Object.fromEntries(CLASS_KEYS.map((c) => [c, rowsOut.filter((z) => z.classes.indexOf(c) >= 0).length]));
    const prim = Object.fromEntries(CLASS_KEYS.map((c) => [c, rowsOut.filter((z) => z.primary === c).length]).filter(([, n]) => n > 0));
    books_push(out, { id: p.id, emoji: p.emoji, verdict4: lr.verdict4 ?? null, missing: lr.missing || [], nRows: rowsOut.length,
      classes: CLASS_KEYS.filter((c) => tally[c] > 0), primaries: prim, candidates: rowsOut.filter((z) => z.candidate).length,
      pinned: b.bookRows.length ? b.bookRows[0].reasons.indexOf('pinned') >= 0 : false, srcN: b.bookRows.length ? b.bookRows[0].srcN : null }, rowsOut);
  }
  const allRows = out.flatMap((z) => z.rows);
  const bookList = out.map((z) => z.book);
  const tallyRows = Object.fromEntries(CLASS_KEYS.map((c) => [c, allRows.filter((z) => z.classes.indexOf(c) >= 0).length]));
  const tallyPrimary = Object.fromEntries(CLASS_KEYS.map((c) => [c, allRows.filter((z) => z.primary === c).length]));
  const byLayer = Object.fromEntries(LAYERS.map((L) => [L, allRows.filter((z) => z.primary && CLASSES[z.primary].layer === L).length]));
  const candidates = allRows.filter((z) => z.candidate).map((z) => ({ id: z.id, emoji: z.emoji, key: z.key, rule: z.candidate,
    next: CANDIDATE_RULES.find((c) => c.id === z.candidate).next, residualPct: z.residualPct, classes: z.classes }));
  const cannot = allRows.filter((z) => !z.candidate && z.primary).map((z) => ({ id: z.id, emoji: z.emoji, key: z.key, primary: z.primary,
    classes: z.classes, reason: CLASSES[z.primary].ja, notByPn1: z.notByPn1 }));
  const inGate = allRows.filter((z) => !z.primary).map((z) => ({ id: z.id, emoji: z.emoji, key: z.key, gateStatus: z.gateStatus }));
  for (const b of bookList) if (!b.classes.length) errors.push(`${b.id}: 分類が 1 つも無い`);
  for (const z of allRows) for (const c of z.classes) if (CLASS_KEYS.indexOf(c) < 0) errors.push(`${z.key}: 語彙の外の分類 ${c}`);
  return { errors, books: bookList, rows: allRows,
    tally: { books: bookList.length, rows: allRows.length, classesByRow: tallyRows, primary: tallyPrimary, byLayer,
      candidates: candidates.length, cannot: cannot.length, inGate: inGate.length,
      pn1Movable: { true: allRows.filter((z) => z.pn1.movable === true).length, false: allRows.filter((z) => z.pn1.movable === false).length,
        unknown: allRows.filter((z) => z.pn1.movable === null).length } },
    candidates, cannot, inGate };
}
function books_push(out, book, rows) { out.push({ book, rows }); }

/** 有効数字 4 桁の表示(表と根拠の文 —— 計算には使わない)。 */
export function sig(v) {
  if (!isNum(v)) return '—';
  if (v === 0) return '0';
  const a = Math.abs(v);
  if (a >= 1e-3 && a < 1e5) return String(+v.toPrecision(4));
  const s = v.toExponential(3).replace(/\.?0+e/, 'e');
  const [m, e] = s.split('e');
  return m + '×10' + String(Number(e)).replace(/-/g, '⁻').replace(/\d/g, (d) => '⁰¹²³⁴⁵⁶⁷⁸⁹'[d]);
}

/** 本の行の表(VERDICT の §5.40 に転記する Markdown —— 正本から作る。QA docs.calCause が 1 字違わず照合する)。 */
export function renderVerdictTable(canon) {
  const L = [];
  L.push('| 本 | 判定行(鍵) | 5 区分 | 門 | 残差 | 1PN の桁 | 1PN で動く | 分類(首位を先頭) | 次に解くこと |');
  L.push('|---|---|---|---|---|---|---|---|---|');
  for (const z of canon.rows) {
    const cls = z.primary ? [z.primary].concat(z.classes.filter((c) => c !== z.primary)) : [];
    const res = z.residualPct === null ? '—' : sig(z.residualPct) + '%' + (z.nSigma === null ? '' : `(${sig(z.nSigma)}σ)`);
    const pn = z.pn1.rel === null ? '—' : sig(z.pn1.rel);
    const mv = z.pn1.movable === null ? '—' : (z.pn1.movable ? '真' : '偽');
    const keyTxt = z.target + '(' + z.kind + ')';   // 鍵の区切り | は表の列の区切りと衝突するので対象(種類)で書く
    L.push(`| ${z.emoji} | ${keyTxt}${z.nRows > 1 ? `(${z.nRows} 行)` : ''} | ${[...new Set(z.verdicts)].join('/')} | ${z.gateStatus || '—'} | ${res} | ${pn} | ${mv} | ${cls.length ? cls.join('・') : '(門の中)'} | ${z.candidate ? z.candidate + ': ' : ''}${z.primary ? CLASSES[z.primary].ja : '—'} |`);
  }
  return L.join('\n') + '\n';
}

/** 再導出の比較(数は相対 1e-12 —— 0 近傍は絶対 1e-12・それ以外は完全一致)。差の Pointer の配列。 */
export function diffDerived(a, b, ptr = '', out = []) {
  if (isNum(a) && isNum(b)) { const d = Math.abs(a - b); if (!(d <= 1e-12 * Math.max(Math.abs(a), Math.abs(b)) || d <= 1e-12)) out.push(ptr); return out; }
  if (Array.isArray(a) && Array.isArray(b)) { if (a.length !== b.length) { out.push(ptr + '(長さ)'); return out; } a.forEach((x, i) => diffDerived(x, b[i], ptr + '/' + i, out)); return out; }
  if (a && b && typeof a === 'object' && typeof b === 'object') {
    const ks = new Set(Object.keys(a).concat(Object.keys(b)));
    for (const k of ks) diffDerived(a[k], b[k], ptr + '/' + k, out);
    return out;
  }
  if (a !== b) out.push(ptr);
  return out;
}

/** 規則表の指紋(規則・閾値・語彙を変えたら変わる)。 */
export function rulesSha256() {
  return crypto.createHash('sha256').update(JSON.stringify({ CALCAUSE_VERSION, GATED_KINDS, TH, CLASSES, PRIMARY_ORDER, RULES, CANDIDATE_RULES })).digest('hex');
}
