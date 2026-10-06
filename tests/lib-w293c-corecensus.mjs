// 第293便c(原仮定者の裁定(第83報)「どの処理で何ができるのかを整理し、統合先を見定める」「有効に働いていないサンプルでは撤去を検討」
// 「コア V2 の数が整理された時点で親子コアへの移行を進める」・統括の検証項目 R143)—— **引きずりとコア構造の棚卸しの純関数**。
//
// ■ 何を持つか(html を読まない・エンジンを走らせない —— 器 tests/exp-w293c-corecensus.mjs が HP から集めた値を渡す)
//   ・比べる 8 量 QUANTITIES(x/y/vx/vy/spin/m/mEff/R)と参考の観測層 AUX(T_obs・回転場の源 Q・減光 lSw)。
//   ・コア V2 の宣言のうち**能動の鍵**(ACTIVE_CORE_KEYS —— 回転・熱結合・収縮・放出・内部エネルギー・光の閉じ込め・整列)と
//     **軸の鍵**(AXIS_CORE_KEYS —— 傾き・方位・歳差)を宣言 JSON から引く(`coreActiveKeys`・`coreAxisKeys`)。
//   ・2000 步の比較の累積器(`makeDiffTracker` —— 粒子数が同じ步だけ 8 量の最大差を取り、粒子数の食い違いと最初の差の步を数える)。
//   ・分類の規則(`classifyRow`): (D) 層だけの本 / (B) 8 量・粒子数・事象のどれかが動いた / (C) 差 0 で軸の鍵あり /
//     (A) 差 0 で能動の鍵なし / それ以外(差 0 で能動の鍵あり・軸なし)は B(「2000 步では差 0 だが能動の宣言」)。
//   ・撤去の可否(`removalVerdict`): A ∧ 在位 ∧ 較正の在位でない ∧ 本の宣言・説明・主張がコアを読まない ∧ 観測層の差 0。
//   ・PHYSICS〔第293便c〕の表の行(`docRows` —— QA docs.coreCensus が正本から作り直して照合する)。
//
// ■ 言わないこと
//   ・「変換可能」(coreV2MigrateReport の convertible/naked)・「置換可」(coreV2ReplaceReport の 6 項)・「同等性確認済み」は別の判定である。
//     本器の「コアなし対照で 8 量差 0」は **2000 步の短期一致**であって、光線・描画・帳簿・長期イベントまで不変とは判定しない。
//     層への置換の同等性(近傍重力が変わる)とも別である。
export const CORECENSUS_LIB_VERSION = 'w293c-corecensus-lib-1';
export const QUANTITIES = Object.freeze(['x', 'y', 'vx', 'vy', 'spin', 'm', 'mEff', 'R']);
export const AUX = Object.freeze(['Tobs', 'Q', 'lSw']);
export const RUN = Object.freeze({ steps: 2000, dt: 0.016 });
/** 能動の鍵(宣言されていて 0 でなければ「能動処理あり」)。omega は rigid 以外のときだけ(rigid は Ω_c≡s で独立の回転を持たない)。 */
export const ACTIVE_CORE_KEYS = Object.freeze(['omega', 'Kcs', 'pump', 'contract', 'burst', 'shed', 'rTarget', 'sourceRate', 'internalEnergy',
  'lightTrap', 'Kalign', 'bindLedger', 'bindA']);
/** 軸の鍵(傾き・方位・歳差 —— 第227便のジャイロ歳差・第232便の整列・第275便e の prescribed)。 */
export const AXIS_CORE_KEYS = Object.freeze(['tilt', 'axisMode', 'azimuthDeg', 'precessionRate']);
export const CLASSES = Object.freeze(['A', 'B', 'C', 'D']);
export const CLASS_MEANING = Object.freeze({
  A: '単層等価(2000 步で 8 量差 0・融合/放出の件数も同じ・能動の鍵なし)= 撤去候補',
  B: '力・スピン・放出・融合に効いている(または 2000 步では差 0 だが能動の宣言がある)= 保持(後で層へ)',
  C: '陰性対照の型(傾き・歳差を宣言しても 8 量が変わらない)= 保持・層へ移さない',
  D: '既に層(body.layers)= 移行の見本',
});

const nz = (v) => v !== undefined && v !== null && v !== false && v !== 0 && v !== '';
/** コア V2 の宣言から能動の鍵を引く(本の physics.coupleSink:"core" は別欄 —— readers の physics)。 */
export function coreActiveKeys(core) {
  const c = core || {}, out = [];
  if (c.mode === 'active' || c.mode === 'cavity') out.push('mode:' + c.mode);
  for (const k of ACTIVE_CORE_KEYS) {
    if (k === 'omega' && c.mode === 'rigid') continue;
    if (nz(c[k])) out.push(k);
  }
  return out;
}
/** コア V2 の宣言から軸の鍵を引く(tilt は 0 でないときだけ)。 */
export function coreAxisKeys(core) {
  const c = core || {}, out = [];
  for (const k of AXIS_CORE_KEYS) if (k === 'tilt' ? nz(Number(c.tilt) || 0) : c[k] !== undefined) out.push(k);
  return out;
}
/** プリセットの中で bodies[i].core 以外の場所にある `core` の鍵の道(massCalibration.history.core など —— build は読まない)。 */
export function strayCorePaths(preset) {
  const out = [];
  const walk = (o, p) => {
    if (!o || typeof o !== 'object') return;
    if (Array.isArray(o)) { o.forEach((v, i) => walk(v, p + '/' + i)); return; }
    for (const k of Object.keys(o)) {
      const q = p + '/' + k;
      if (k === 'core' && !/^\/bodies\/\d+$/.test(p)) out.push(q);
      walk(o[k], q);
    }
  };
  walk(preset, '');
  return out;
}
/** 本の宣言の棚卸し 1 行(単位は body の宣言数 —— 展開後の粒子数ではない)。mig/rep は HP.coreV2MigrateReport/ReplaceReport の返り値。 */
export function censusRow(p, mig, rep, textHits) {
  const bs = Array.isArray(p.bodies) ? p.bodies : [];
  const ph = p.physics || {};
  const cores = bs.filter((b) => b && b.core), lays = bs.filter((b) => b && Array.isArray(b.layers));
  const axis = { tilt: 0, axisMode: 0, azimuthDeg: 0, precessionRate: 0, Kalign: 0 };
  for (const b of cores) { for (const k of coreAxisKeys(b.core)) axis[k]++; if (nz(b.core.Kalign)) axis.Kalign++; }
  let layerAxis = 0, nLayers = 0;
  for (const b of lays) { nLayers += b.layers.length; for (const L of b.layers) if (L && (L.tilt !== undefined || L.azimuthDeg !== undefined || L.precessionRate !== undefined)) layerAxis++; }
  const rd = ph.relativeDrag || null;
  return {
    id: p.id, emoji: p.emoji || '', retired: p.familyRole === 'retired', group: p.group || null, sampleClass: p.sampleClass || null,
    nBodies: bs.length,
    v2: { n: mig.nCore, convertible: mig.counts.convertible, naked: mig.counts.naked, cavity: mig.counts.cavity, needsResolve: mig.counts.needsResolve,
      rejected: mig.counts.rejected, canReplace: rep.counts.canReplace, cannot: rep.counts.cannot },
    coreModes: cores.map((b) => String(b.core.mode || '')),
    coreActive: cores.map((b) => coreActiveKeys(b.core)),
    layers: { n: lays.length, nLayers, axisDecl: layerAxis },
    dragCore: bs.filter((b) => b && b.dragCore).length,
    coreField: !!(ph.shapeToy && ph.shapeToy.coreField),
    relDragLaw: rd ? (rd.law || 'kernel') : null,
    spinAxis: bs.filter((b) => b && b.spinAxis).length,
    coreAxis: axis,
    tide: { book: !!ph.tide, bodies: bs.filter((b) => b && b.tide).length },
    coupleSinkCore: ph.coupleSink === 'core',
    strayCore: strayCorePaths(p),
    textHits: textHits || 0,
  };
}
/** 経路ごとの合計(在位/退役の本の数と body の宣言数)。 */
export function censusTotals(rows) {
  const T = {};
  const add = (k, r, nDecl) => { if (!nDecl) return; const t = T[k] || (T[k] = { books: 0, active: 0, retired: 0, decl: 0, declActive: 0 });
    t.books++; t.decl += nDecl; if (r.retired) t.retired++; else { t.active++; t.declActive += nDecl; } };
  for (const r of rows) {
    add('coreV2', r, r.v2.n); add('layers', r, r.layers.n); add('dragCore', r, r.dragCore); add('coreField', r, r.coreField ? 1 : 0);
    add('relDrag:' + (r.relDragLaw || ''), r, r.relDragLaw ? 1 : 0); add('spinAxis', r, r.spinAxis);
    add('coreAxis:tilt', r, r.coreAxis.tilt); add('coreAxis:axisMode', r, r.coreAxis.axisMode); add('coreAxis:precessionRate', r, r.coreAxis.precessionRate);
    add('coreAxis:Kalign', r, r.coreAxis.Kalign); add('layerAxis', r, r.layers.axisDecl); add('tide:book', r, r.tide.book ? 1 : 0); add('tide:body', r, r.tide.bodies);
    add('coreTextOnly', r, (r.v2.n === 0 && r.textHits > 0) ? 1 : 0);
  }
  for (const k of Object.keys(T)) if (k === 'relDrag:') delete T[k];
  return T;
}

/** 2000 步の比較の累積器。a・b は步ごとの {n, q:{x:[..],…}, aux:{…}, ev:string}。 */
export function makeDiffTracker() {
  const st = { steps: 0, nMismatchSteps: 0, evMismatchSteps: 0, firstDiffStep: null, firstNDiffStep: null, max: {}, aux: {} };
  for (const k of QUANTITIES) st.max[k] = 0;
  for (const k of AUX) st.aux[k] = 0;
  const upd = (obj, k, d) => { if (Number.isNaN(d)) obj[k] = NaN; else if (d > obj[k]) obj[k] = d; };
  st.push = (step, a, b) => {
    st.steps++;
    let diff = false;
    if (a.n !== b.n) { st.nMismatchSteps++; diff = true; if (st.firstNDiffStep === null) st.firstNDiffStep = step; }
    if (a.ev !== b.ev) { st.evMismatchSteps++; diff = true; }
    if (a.n === b.n) {
      for (const k of QUANTITIES) { const A = a.q[k], B = b.q[k]; for (let i = 0; i < a.n; i++) { const d = Math.abs(A[i] - B[i]); if (d !== 0) diff = true; upd(st.max, k, d); } }
      for (const k of AUX) { const A = a.aux[k], B = b.aux[k]; for (let i = 0; i < a.n; i++) upd(st.aux, k, Math.abs(A[i] - B[i])); }
    }
    if (diff && st.firstDiffStep === null) st.firstDiffStep = step;
  };
  st.result = () => ({ steps: st.steps, nMismatchSteps: st.nMismatchSteps, evMismatchSteps: st.evMismatchSteps, firstDiffStep: st.firstDiffStep,
    firstNDiffStep: st.firstNDiffStep, maxDiff: Object.assign({}, st.max), auxDiff: Object.assign({}, st.aux) });
  return st;
}
/** 8 量・粒子数・事象がすべて同じか(ビット)。 */
export function bitZero(cmp) {
  return cmp.nMismatchSteps === 0 && cmp.evMismatchSteps === 0 && QUANTITIES.every((k) => Object.is(cmp.maxDiff[k], 0));
}
/** 分類(D は層の本で別に付ける)。row = {active:[…], axis:[…], cmp}。 */
export function classifyRow(row) {
  const zero = bitZero(row.cmp);
  if (!zero) {
    const why = [];
    if (row.cmp.nMismatchSteps) why.push('粒子数(放出・融合)');
    if (row.cmp.evMismatchSteps) why.push('事象の件数');
    if (QUANTITIES.some((k) => !Object.is(row.cmp.maxDiff[k], 0))) why.push('8 量');
    return { cls: 'B', why: why.join('・') + 'が動いた' };
  }
  if (row.axis.length) return { cls: 'C', why: '差 0・軸の鍵(' + row.axis.join(',') + ')' };
  if (!row.active.length) return { cls: 'A', why: '差 0・能動の鍵なし' };
  return { cls: 'B', why: '2000 步では差 0・能動の鍵(' + row.active.join(',') + ')' };
}
/** 撤去の可否(ブリーフ 3 の (i)〜(iii) と、器が見える範囲の「読む者」)。 */
export function removalVerdict(row) {
  const blockers = [];
  if (row.cls !== 'A') blockers.push('分類 ' + row.cls);
  if (row.retired) blockers.push('退役');
  if (row.calibration) blockers.push('較正の在位(本便は比較の数値だけ)');
  if (row.readers.claims.length) blockers.push('主張がコアを読む(' + row.readers.claims.join(',') + ')');
  if (row.readers.desc > 0) blockers.push('説明文がコアに触れる(' + row.readers.desc + ' 箇所)');
  if (row.readers.physics.length) blockers.push('本の宣言がコアを参照(' + row.readers.physics.join(',') + ')');
  const auxNz = AUX.filter((k) => !Object.is(row.cmp.auxDiff[k], 0));
  if (auxNz.length) blockers.push('観測層が変わる(' + auxNz.join(',') + ')');
  return { removable: blockers.length === 0, blockers };
}
/** 説明・主張・本の宣言の中の「コアを読む者」(html の宣言だけ —— QA と samplestatus は器の外で文書に書く)。 */
export function readersOf(p) {
  const claims = (Array.isArray(p.claims) ? p.claims : []).filter((c) => /コア|\bcore/i.test(JSON.stringify(c))).map((c) => String(c.id || '?'));
  const txt = ['description', 'descStruct', 'en', 'obsCard', 'failureFirst', 'notClaim', 'parameterAudit'].map((k) => (p[k] === undefined ? '' : JSON.stringify(p[k]))).join('\n');
  const desc = (txt.match(/コア|\bcore\b/gi) || []).length;
  const physics = [];
  if (p.physics && p.physics.coupleSink === 'core') physics.push('physics.coupleSink:"core"');
  return { claims, desc, physics };
}

const e3 = (x) => (x === null || x === undefined) ? '—' : (Number.isNaN(x) ? 'NaN' : (x === 0 ? '0' : Number(x).toExponential(2)));
/** PHYSICS〔第293便c〕の表の行(QA docs.coreCensus が照合する)。 */
export function docRows(J) {
  const out = { totals: [], control: [], layers: [], counts: [] };
  const lab = { coreV2: 'コア V2 `core`', layers: '親子コア `layers`', dragCore: '構造核 `dragCore`', coreField: '形状トイの `shapeToy.coreField`',
    'relDrag:inertial': '慣性引きずり `relativeDrag.law:"inertial"`', 'relDrag:pairSlip': '相対すべり `relativeDrag.law:"pairSlip"`', spinAxis: '点粒子の軸 `spinAxis`(表示専用)',
    'coreAxis:tilt': 'コアの傾き `core.tilt`≠0', 'coreAxis:axisMode': 'コア軸の宣言 `core.axisMode`', 'coreAxis:precessionRate': 'コア軸の歳差 `core.precessionRate`',
    'coreAxis:Kalign': 'コアの整列 `core.Kalign`', layerAxis: '層の軸の宣言(tilt/azimuthDeg/precessionRate)', 'tide:book': '明示潮汐 `physics.tide`', 'tide:body': '天体の潮汐 `tide`',
    coreTextOnly: '本文に `core:{` があるが body に宣言なし(履歴・コメント)' };
  for (const k of Object.keys(lab)) {
    const t = J.census.totals[k];
    if (!t) continue;
    out.totals.push(`| ${lab[k]} | ${t.active} | ${t.retired} | ${t.declActive} | ${t.decl} |`);
  }
  for (const r of J.control.rows) {
    const m = r.cmp.maxDiff, a = r.cmp.auxDiff;
    out.control.push(`| ${r.emoji} ${r.id} | ${r.cls} | ${r.nCoreBodies} | ${r.n0}→${r.nEnd[0]}/${r.nEnd[1]} | ${e3(m.x)} | ${e3(m.y)} | ${e3(m.vx)} | ${e3(m.vy)} | ${e3(m.spin)} | ${e3(m.m)} | ${e3(m.mEff)} | ${e3(m.R)} | `
      + `${r.events[0]} / ${r.events[1]} | ${r.cmp.firstDiffStep === null ? '—' : r.cmp.firstDiffStep} | ${e3(a.Tobs)}・${e3(a.Q)} | ${r.removable ? '撤去' : (r.cls === 'A' ? '候補(外さない)' : '保持')} |`);
  }
  for (const r of J.layerBooks.rows) out.layers.push(`| ${r.emoji} ${r.id} | D | ${r.layerBodies} | ${r.nLayers} | ${r.axisDecl} | ${e3(r.cmp.maxDiff.x)} | ${e3(r.cmp.maxDiff.vx)} | ${r.cmp.nMismatchSteps} |`);
  const c = J.classes.counts;
  out.counts.push(`分類の本数: A ${c.A}・B ${c.B}・C ${c.C}・D ${c.D}(撤去を適用 ${J.removal.applied.length})`);
  return out;
}
