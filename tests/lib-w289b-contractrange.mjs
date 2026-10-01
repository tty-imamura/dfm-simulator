// 第289便b(原仮定者の裁定(第79報)③で閉じた AN100・統括の検証項目 R120)—— **契約範囲外の評価器**(純関数)。
//
// ■ 何をするか
//   第288便c(AN86)の旗 —— 背景の時間の契約(physics.backgroundComplex.timeContract)の有効幅 widthT を |t−t₀| が超えた步の数
//   (エンジンの `S.meshVelTimeOutSteps` —— 再展開しない・数えるだけ)—— を、**観測比較の評価器**へ繋ぐ。
//     ・走行ごとの状態: 契約の宣言が無い → 「宣言なし」/ 宣言があり範囲外の步 0 → 「範囲内」/ 1 步でも超えた → 「契約範囲外」。
//     ・観測比較(1 行 1 量)は、その比較に使った走行(段 h・h/2・h/4 …)のどれか 1 本でも「契約範囲外」なら **保留(契約範囲外)** とする。
//   **合否の数字は変えない**: 門(gate.status)・5 区分(合/窓/否/従/転/条)・残差・σ 倍には 1 つも触れない。保留は**別の欄**
//   (`contractRange.held`)であり、5 区分の「条」(条件不一致)とも別である。過去の正本を遡って無効にしない(旗の無い記録は「記録なし」)。
//
// ■ 読み手: 判定器 tests/exp-w249b-calaudit.mjs(行の属性 `contractRange`・集計 `out.contractRange`)・
//   器 tests/exp-w289b-contractrange.mjs(🌒 と geoPN=3 の診断コピーの走行)・生成器 obscompare/assessed(保留の行だけ `cr:1`)・QA。
// ■ しないこと: 走らせない・判定しない・値を作らない。「契約範囲外を除いたら合った」とは言わない。
export const CONTRACT_RANGE_VERSION = 'w289b-cr1';
/** 走行と比較の状態の語(表示と正本で同じ語)。 */
export const CR = Object.freeze({ NONE: '宣言なし', IN: '範囲内', OUT: '契約範囲外', UNKNOWN: '記録なし' });
export const CR_HELD = '保留(契約範囲外)';
export const CR_RULE = '走行ごとに、背景の時間の契約(timeContract)の有効幅 widthT を |t−t₀| が超えた步の数(S.meshVelTimeOutSteps)を読む。'
  + '宣言が無ければ「宣言なし」・宣言があって 0 步なら「範囲内」・1 步でも超えたら「契約範囲外」。観測比較は、使った走行のどれか 1 本でも'
  + '「契約範囲外」なら「保留(契約範囲外)」—— 門の状態・5 区分・残差は変えない(別の欄)。過去の正本は遡って無効にしない。';

/** 背景の時間の契約を宣言しているか(preset の physics から —— 読むだけ)。 */
export function timeContractDeclared(physics) {
  const b = physics && physics.backgroundComplex;
  return !!(b && typeof b === 'object' && b.timeContract && typeof b.timeContract === 'object');
}

/**
 * 1 本の走行の状態。
 * @param {{declared:boolean, timeOutSteps?:number|null}} run
 * @returns {string} CR の語
 */
export function contractRangeOfRun(run) {
  if (!run || run.declared !== true) return (run && run.declared === false) ? CR.NONE : CR.UNKNOWN;
  const n = Number(run.timeOutSteps);
  if (!Number.isFinite(n) || n < 0) return CR.UNKNOWN;
  return n > 0 ? CR.OUT : CR.IN;
}

/**
 * 比較 1 行に使った走行の集合から、比較の状態を作る(純関数)。
 * @param {Array<{tag?:string, declared:boolean, timeOutSteps?:number|null}>} runs
 * @returns {{status:string, held:boolean, timeOutSteps:number|null, runs:Array<{tag:string|null, status:string, timeOutSteps:number|null}>}}
 */
export function evalComparison(runs) {
  const rs = (runs || []).map((r) => ({ tag: (r && r.tag) || null, status: contractRangeOfRun(r),
    timeOutSteps: (r && Number.isFinite(Number(r.timeOutSteps))) ? Number(r.timeOutSteps) : null }));
  let status;
  if (!rs.length) status = CR.UNKNOWN;
  else if (rs.some((r) => r.status === CR.OUT)) status = CR.OUT;
  else if (rs.every((r) => r.status === CR.NONE)) status = CR.NONE;
  else if (rs.every((r) => r.status === CR.IN || r.status === CR.NONE) && rs.some((r) => r.status === CR.IN)) status = CR.IN;
  else status = CR.UNKNOWN;
  const outN = rs.filter((r) => r.timeOutSteps !== null).reduce((a, r) => a + r.timeOutSteps, 0);
  return { status, held: status === CR.OUT, timeOutSteps: rs.some((r) => r.timeOutSteps !== null) ? outN : null, runs: rs };
}

/**
 * 行へ写す小さな形(正本の行の属性)。**門と 5 区分は受け取らない・返さない**(変えないことを形で保証する)。
 */
export function rowAttr(ev) {
  return { status: ev.status, held: ev.held === true, ...(ev.held ? { display: CR_HELD, timeOutSteps: ev.timeOutSteps } : {}) };
}

/** 行の集合の集計(状態ごとの数と保留の鍵)。 */
export function tallyRows(rows) {
  const by = {}; for (const w of Object.values(CR)) by[w] = 0;
  const held = [];
  for (const r of rows || []) {
    const st = (r && r.contractRange && r.contractRange.status) || CR.UNKNOWN;
    by[st] = (by[st] || 0) + 1;
    if (r && r.contractRange && r.contractRange.held === true) held.push(r.key || null);
  }
  return { byStatus: by, nHeld: held.length, held };
}
