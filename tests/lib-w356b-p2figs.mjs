// 第356便b(統括の検証項目 R514): **論文 2 の仕上げの材料 —— 図の並びの宣言・模式図 2 枚のデータ・図 6 の精度の書き方の純関数**
//   (器 tests/exp-w356b-p2figs.mjs —— 正本 tests/out/p2figs-356b.json・段 p2figs-356b。QA behavior.p2figs356b・docs.p2figs356b が呼ぶ)。
//   **ファイルを読まない・状態を持たない・ほかの lib を import しない** —— 入力は今の図のデータ(paper/figures/p2fig1〜p2fig8.json・p2figs-gates.json)を器が読んで渡す。
//
// ■ 何をするか
//   ① 図の並びの宣言(FIG_PLAN —— 改訂の後の論文 2 に載せる図: 残す図・ほかの論文へ移す図・新しい模式図 2 枚・案のまま作らない図)と、
//      今の 22 ゲート(p2figs-gates.json)を図ごとに数え、残す図の分と移す図の分に分ける(gateCounts)。
//   ② 模式図 2 枚の描く量(座標・層の境・矢印の向き・ラベルの字): 天体が 1 つの箱(schematicA —— 数は今の図 2 のデータから)/
//      膨張の 3 層の比べ(schematicB —— 数は今の図 3・図 4・図 5 のデータから)。**どちらも「模式(数の図ではない)」**(座標は描く位置で、物理の量ではない)。
//   ③ 図 6 の精度の書き方(precisionOf): 図の全体の走査(24 区間 × 較正 3)の最大の相対の誤差と、検証 V29(3 区間)の最大の相対の誤差を、
//      検査の名と区間の数を添えて並べる(走査の誤差は行から作り直す・V29 の誤差は V29 の記録の字から読む)。
//   ④ 検査のログの「同水準」の字の出どころ(phraseHits —— 字の在りかを数えるだけ。直すかどうかは統括が決める)。
// ■ 単位・座標: 模式図の座標は描く枠 [0, 1] × [0, 1](左下が 0・上が y の正)。角は度・反時計回りが正。
// ■ 言わないこと: 模式図は数の図ではない(描く位置は量ではない)。現実の宇宙の主張をしない(今の原稿の言い方の範囲 —— 「類似」)。
//   図の行き先は構成案の ⑥ の行に合わせた案で、決めていない。図そのもの(PDF・SVG)は作らない。

export const LIB_VERSION = 'w356b-p2figs-lib-1';

/** 宣言(結果を見て変えない —— 変えたら版を上げて理由を書く) */
export const DECL = Object.freeze({
  /** 図 6 の許容(図のゲートと V29 で同じ —— 原稿の「事前宣言の許容値」) */
  tol6: 1e-2,
  /** 図 6 の走査の区間(gen-figures2 の NW)・較正の数・V29 の区間 */
  nWin6: 24, nCal6: 3, nWinV29: 3,
  /** 照合の床(作り直した誤差と図のデータの記録) */
  idTol: 1e-15,
  /** 差の型の葉を持つ絶対の桁(小数 12 桁) */
  diffDigits: 12,
  /** 模式図の枠 */
  frame: Object.freeze([0, 1]),
});

/** 図の名の型(今の図)と、新しい模式図の名 */
export const FIGS_NOW = Object.freeze(['p2fig1', 'p2fig2', 'p2fig3', 'p2fig4', 'p2fig5', 'p2fig6', 'p2fig7', 'p2fig8']);
export const KEEP = Object.freeze(['p2fig1', 'p2fig2', 'p2fig3', 'p2fig4', 'p2fig5', 'p2fig6']);
export const MOVE = Object.freeze(['p2fig7', 'p2fig8']);

/** 図の並びの宣言(改訂の後の論文 2 の順 —— 構成案 ③ の章立てに沿う)。state: keep 残す/move 移す/new 新しい模式図/plan 案のまま(この枝では作らない) */
export const FIG_PLAN = Object.freeze([
  Object.freeze({ id: 'sA', fig: '新しい模式図 A(天体が 1 つの箱)', chapter: '第 3 章', state: 'new',
    shows: '天体が 1 つの箱の中から、箱の並進・回転・膨張のうち何が読めないか(並進)と、何が引きずられるフレームを通して読めるか(回転・膨張 —— 中心の利得 1/2)',
    src: 'tests/out/p2figs-356b.json の schematicA(数は今の図 2 のデータ paper/figures/p2fig2.json から)', to: '新しい(第 3 章の頭)' }),
  Object.freeze({ id: 'p2fig1', fig: '今の図 1(p2fig1 —— 箱の階層)', chapter: '第 2 章・第 3 章', state: 'keep',
    shows: '規定の箱と自由な箱・内部の物体が読む量と意味論の 6 項目(模式図)', src: 'paper/figures/p2fig1.json(模式図 —— 数値ゲートなし)', to: '残す' }),
  Object.freeze({ id: 'p2fig2', fig: '今の図 2(p2fig2 —— フレームの利得)', chapter: '第 3 章', state: 'keep',
    shows: '質点リングの壁のフレームの利得 g(r) の実測と解析(中心で 1/2)', src: 'paper/figures/p2fig2.json(V23a・V24a と同じ構成の半径の走査)', to: '残す' }),
  Object.freeze({ id: 'sB', fig: '新しい模式図 B(膨張の 3 層の比べ)', chapter: '第 4 章', state: 'new',
    shows: '規定された運動学・波長の意味論・解かれる動力学の 3 層で、何を与え何を読むか(a(t) を与える → 解く)',
    src: 'tests/out/p2figs-356b.json の schematicB(数は今の図 3・図 4・図 5 のデータ paper/figures/p2fig3.json・p2fig4.json・p2fig5.json から)', to: '新しい(第 4 章の頭)' }),
  Object.freeze({ id: 'p2fig3', fig: '今の図 3(p2fig3 —— 第 1 層)', chapter: '第 4 章', state: 'keep',
    shows: '連星の膨張感受率 n_eff が決定力の持ち分 φ_B で決まる(V25 の錨)', src: 'paper/figures/p2fig3.json(V25 の構成の走査)', to: '残す' }),
  Object.freeze({ id: 'p2fig4', fig: '今の図 4(p2fig4 —— 第 2 層)', chapter: '第 4 章', state: 'keep',
    shows: 'A・B の光の波長と赤方偏移・波長保持則の帳簿', src: 'paper/figures/p2fig4.json(boxredshift —— box.photon-abc と同じ構成)', to: '残す' }),
  Object.freeze({ id: 'p2fig5', fig: '今の図 5(p2fig5 —— 第 3 層)', chapter: '第 4 章', state: 'keep',
    shows: '自由な箱の a_eff(圧力あり —— 増える/圧力なし —— 再収縮)・閉じた帳簿', src: 'paper/figures/p2fig5.json(freebox —— freebox.* と同じ構成)', to: '残す' }),
  Object.freeze({ id: 'p2fig6', fig: '今の図 6(p2fig6 —— 2 つの H 推定器)', chapter: '第 5 章', state: 'keep',
    shows: 'H_w/H_geo の実測と解析を較正 3 つで・反比例の対照・較正点(ハッブルテンション類似)', src: 'paper/figures/p2fig6.json(V29 の測定系を a × (D X_k) の走査へ)', to: '残す' }),
  Object.freeze({ id: 'echo', fig: '時間の矢の戻り(図表の案の 1 つ)', chapter: '第 6 章', state: 'plan',
    shows: '可逆な箱の中の時間の矢(戻る・戻らない)', src: '図のデータは無い(検査 echo.leapfrog-return・echo.friction-noreturn・echo.energy は在る)', to: '案のまま(この枝では作らない)' }),
  Object.freeze({ id: 'p2fig7', fig: '今の図 7(p2fig7 —— 外来光線の掃き出し)', chapter: '付録', state: 'move',
    shows: '光学的に暗い重力体: 外来光線の掃き出しと 2 つの光学機構の独立', src: 'paper/figures/p2fig7.json(rotorSolo —— behavior.rotorSolo と同じ光線の条件)',
    to: '移す(論文5 の隠れ質量・暗さの章の候補 —— 構成案 ⑥ の「付録 光学的に暗い重力体」の行)' }),
  Object.freeze({ id: 'p2fig8', fig: '今の図 8(p2fig8 —— 引きずりのブーストの在りか)', chapter: '付録', state: 'move',
    shows: '銀河の本の帯ごとの v/v_bar の増強と外縁ブースト', src: 'paper/figures/p2fig8.json(galaxy・8 種)',
    to: '移す(論文4 —— 構成案 ⑥ の「§検証対応表の外縁ブースト」の行。今は付録の図 —— 付録の行に合わせて論文5 へ移す読みも在る)' }),
]);

const isObj = (o) => o !== null && typeof o === 'object' && !Array.isArray(o);
const need = (c, msg) => { if (!c) throw new Error('w356b: ' + msg); };
const p3 = (x) => Number(x).toPrecision(3);
const rd = (x, d = DECL.diffDigits) => Number(Number(x).toFixed(d));

/** ① 今のゲートを図ごとに数える(G = p2figs-gates.json の中身) */
export function gateCounts(G, { keep = KEEP, move = MOVE } = {}) {
  need(isObj(G) && Array.isArray(G.gates) && G.gates.length > 0, 'ゲートの一覧が無い');
  const byFig = {}, ids = {};
  for (const g of G.gates) {
    need(isObj(g) && typeof g.id === 'string', 'ゲートの id が無い');
    const m = /^(p2fig\d+)\.[A-Za-z0-9_-]+$/.exec(g.id);
    need(m && FIGS_NOW.includes(m[1]), '図の名の型でないゲート ' + g.id);
    need(typeof g.pass === 'boolean', 'ゲートの pass が真偽でない ' + g.id);
    byFig[m[1]] = (byFig[m[1]] || 0) + 1; (ids[m[1]] = ids[m[1]] || []).push(g.id);
  }
  const sum = (L) => L.reduce((p, f) => p + (byFig[f] || 0), 0);
  const schem = G.gates.filter((g) => /\.schematic$/.test(g.id)).map((g) => g.id);
  const keepN = sum(keep), moveN = sum(move);
  return { total: G.gates.length, byFig, ids, keep: keepN, move: moveN, other: G.gates.length - keepN - moveN,
    schematic: schem, keepNumeric: keepN - schem.filter((id) => keep.includes(id.split('.')[0])).length,
    allPass: G.gates.every((g) => g.pass === true), pageErrors: Array.isArray(G.pageErrors) ? G.pageErrors.length : null };
}

/** ② 模式図 A: 天体が 1 つの箱(3 枚の小さな枠 a 並進・b 回転・c 膨張 —— 同じ箱と天体)。F2 = p2fig2.json の中身 */
export function schematicA(F2) {
  need(isObj(F2) && isObj(F2.gainAtR20) && [F2.gainAtR20.rotation, F2.gainAtR20.expansion, F2.gainAtR20.analytic].every(Number.isFinite), '図 2 の g(20) が無い');
  const g = F2.gainAtR20;
  const box = { cx: 0.5, cy: 0.5, half: 0.32 }, body = { x: 0.5, y: 0.5, r: 0.035 };
  const ray = (deg, r0, r1) => { const t = deg * Math.PI / 180, c = Math.cos(t), s = Math.sin(t);
    return { from: [rd(0.5 + r0 * c, 9), rd(0.5 + r0 * s, 9)], to: [rd(0.5 + r1 * c, 9), rd(0.5 + r1 * s, 9)], dir: [rd(c, 9), rd(s, 9)] }; };
  const panels = [
    { id: 'a', name: { ja: '(a) 並進', en: '(a) translation' }, motion: 'translate',
      arrows: [{ kind: 'straight', from: [0.25, 0.9], to: [0.75, 0.9], dir: [1, 0] }],
      readable: false,
      label: { ja: '箱ごと一様に動く —— 中から検知できない', en: 'uniform motion of the whole box: not detectable from inside' } },
    { id: 'b', name: { ja: '(b) 回転', en: '(b) rotation' }, motion: 'rotate',
      arrows: [{ kind: 'arc', center: [0.5, 0.5], radius: 0.42, fromDeg: 30, toDeg: 150, sense: 1 }],
      readable: true, gainMeasured: g.rotation, gainAnalytic: g.analytic,
      label: { ja: '外の全部が回る —— 引きずられるフレームで読める(中心の近く r = 20 の利得 ' + p3(g.rotation) + '・解析 ' + p3(g.analytic) + ')',
        en: 'everything else rotates: readable through the dragged frame (gain near the centre, r = 20: ' + p3(g.rotation) + '; analytic ' + p3(g.analytic) + ')' } },
    { id: 'c', name: { ja: '(c) 膨張', en: '(c) expansion' }, motion: 'expand',
      arrows: [45, 135, 225, 315].map((d) => Object.assign({ kind: 'straight' }, ray(d, 0.3, 0.46))),
      readable: true, gainMeasured: g.expansion, gainAnalytic: g.analytic,
      label: { ja: '外の全部が膨張する —— 引きずられるフレームで読める(r = 20 の利得 ' + p3(g.expansion) + ')',
        en: 'everything else expands: readable through the dragged frame (gain at r = 20: ' + p3(g.expansion) + ')' } },
  ];
  return { kind: '模式(数の図ではない)', schematic: true, frame: [...DECL.frame], box, body,
    bodyLabel: { ja: '天体 1 つ(自分の決定力が自分に効く分は、今の模型では 0 —— 未解決 U2-1)', en: 'a single body (its own determining force on itself is zero in the present model: open item U2-1)' },
    panels, gainSource: 'paper/figures/p2fig2.json#gainAtR20(箱の壁は質点 96 のリング —— 天体が 1 つの本は未)' };
}

/** ② 模式図 B: 膨張の 3 層の比べ(3 つの列・層の境・各列の「与える → 読む」の矢印・下の横の矢印)。F3・F4・F5 = p2fig3〜p2fig5.json の中身 */
export function schematicB(F3, F4, F5) {
  need(isObj(F3) && isObj(F3.anchors) && isObj(F3.anchors.boxDominated) && isObj(F3.anchors.locallyDominated), '図 3 の錨が無い');
  need(isObj(F4) && Array.isArray(F4.arrivals) && isObj(F4.lambdaTracks) && Number.isFinite(F4.ledgerMaxAbsErr), '図 4 の到着と帳簿が無い');
  need(isObj(F5) && isObj(F5.pressureOn) && isObj(F5.pressureOff), '図 5 の圧力あり・なしが無い');
  const A = F3.anchors.boxDominated, Lc = F3.anchors.locallyDominated;
  const zOf = (k) => { const tr = F4.lambdaTracks[k]; need(isObj(tr) && Number.isFinite(tr.emitT), '図 4 の光 ' + k + ' の放出の時刻が無い');
    const hit = F4.arrivals.filter((r) => r.tE === tr.emitT); need(hit.length === 1, '図 4 の光 ' + k + ' の到着が 1 つでない'); return hit[0]; };
  const zA = zOf('A'), zB = zOf('B'), on = F5.pressureOn, off = F5.pressureOff;
  need([A.phiB, A.n, Lc.phiB, Lc.n, zA.z, zB.z, on.aLast, off.aMax, off.H1, off.H2].every(Number.isFinite), '図 3〜図 5 の数が数でない');
  const bounds = [0, 1 / 3, 2 / 3, 1].map((x) => rd(x, 9));
  const col = (i) => ({ x0: bounds[i], x1: bounds[i + 1], xc: rd((bounds[i] + bounds[i + 1]) / 2, 9) });
  const down = (i) => ({ kind: 'straight', from: [col(i).xc, 0.72], to: [col(i).xc, 0.42], dir: [0, -1] });
  const layers = [
    Object.assign(col(0), { id: 'L1', name: { ja: '第 1 層 規定された運動学', en: 'Layer 1: prescribed kinematics' }, fig: 'p2fig3', gates: ['p2fig3.anchors', 'p2fig3.dial'],
      give: { ja: 'a(t) を外から与える(壁は調律される)', en: 'a(t) is given from outside (the walls are tuned)' },
      read: { ja: '中の連星の膨張感受率 n_eff は決定力の持ち分 φ_B で決まる', en: 'the expansion susceptibility n_eff of an inner binary is set by the share φ_B' },
      nums: { phiBbox: A.phiB, nBox: A.n, phiBloc: Lc.phiB, nLoc: Lc.n },
      numText: { ja: 'φ_B ' + p3(A.phiB) + ' → n_eff ' + p3(A.n) + '・φ_B ' + p3(Lc.phiB) + ' → n_eff ' + Lc.n.toFixed(2), en: 'φ_B ' + p3(A.phiB) + ' → n_eff ' + p3(A.n) + '; φ_B ' + p3(Lc.phiB) + ' → n_eff ' + Lc.n.toFixed(2) },
      arrow: down(0) }),
    Object.assign(col(1), { id: 'L2', name: { ja: '第 2 層 波長の意味論', en: 'Layer 2: wavelength semantics' }, fig: 'p2fig4', gates: ['p2fig4.ledger', 'p2fig4.redshift', 'p2fig4.simultaneous'],
      give: { ja: '放出と観測の時刻の a(a_emit・a_obs)', en: 'a at emission and observation (a_emit, a_obs)' },
      read: { ja: 'λ_obs/λ_emit = a_obs/a_emit(波長保持則の帳簿)', en: 'λ_obs/λ_emit = a_obs/a_emit (wavelength-keeping ledger)' },
      nums: { zA: zA.z, zB: zB.z, ledger: F4.ledgerMaxAbsErr },
      numText: { ja: 'z_A ' + p3(zA.z) + '・z_B ' + p3(zB.z) + '・帳簿のずれ ' + F4.ledgerMaxAbsErr, en: 'z_A ' + p3(zA.z) + ', z_B ' + p3(zB.z) + ', ledger error ' + F4.ledgerMaxAbsErr },
      arrow: down(1) }),
    Object.assign(col(2), { id: 'L3', name: { ja: '第 3 層 解かれる動力学(自由な箱)', en: 'Layer 3: solved dynamics (free box)' }, fig: 'p2fig5', gates: ['p2fig5.aeff', 'p2fig5.closed', 'p2fig5.recollapse'],
      give: { ja: '壁は普通の質点(圧力あり・なし)', en: 'walls are ordinary point masses (with / without pressure)' },
      read: { ja: 'a(t) を解く(与えない)', en: 'a(t) is solved, not given' },
      nums: { aEffOn: on.aLast, aMaxOff: off.aMax, hSignFlip: Math.sign(off.H1) !== Math.sign(off.H2) },
      numText: { ja: '圧力あり a_eff ' + p3(on.aLast) + '・圧力なし 最大 ' + Number(off.aMax).toPrecision(4) + ' → 再収縮', en: 'with pressure a_eff ' + p3(on.aLast) + '; without pressure max ' + Number(off.aMax).toPrecision(4) + ', then recollapse' },
      arrow: down(2) }),
  ];
  return { kind: '模式(数の図ではない)', schematic: true, frame: [...DECL.frame], bounds, layers,
    across: { kind: 'straight', from: [col(0).xc, 0.12], to: [col(2).xc, 0.12], dir: [1, 0], label: { ja: 'a(t) は 与える → 解く', en: 'a(t): given → solved' } },
    numSource: 'paper/figures/p2fig3.json#anchors・p2fig4.json#arrivals・lambdaTracks・ledgerMaxAbsErr・p2fig5.json#pressureOn・pressureOff' };
}

/** V29 の記録の字(例「…誤差3.9e-4) / …」「比誤差最大=5.3e-4」)から区間ごとの誤差と最大を読む */
export function parseV29(detail) {
  need(typeof detail === 'string', 'V29 の記録の字が無い');
  const per = [...detail.matchAll(/誤差(\d(?:\.\d+)?e-\d+)\)/g)].map((m) => +m[1]);
  const mx = /比誤差最大=(\d(?:\.\d+)?e-\d+)/.exec(detail), wd = /w保存ずれ最大=(\d(?:\.\d+)?e-\d+)/.exec(detail);
  need(mx && wd, 'V29 の記録の字に最大の誤差か w の保存が無い');
  return { per, max: +mx[1], maxText: mx[1], wDrift: +wd[1], wDriftText: wd[1] };
}

/** ③ 図 6 の精度の書き方(F6 = p2fig6.json の中身)—— 走査の誤差は行から作り直す */
export function precisionOf(F6) {
  need(isObj(F6) && Array.isArray(F6.data) && isObj(F6.v29Gate) && Number.isFinite(F6.maxRelErrVsAnalytic), '図 6 のデータが無い');
  const rows = F6.data.flatMap((s) => { need(Array.isArray(s.rows), '図 6 の較正の行が無い'); return s.rows; });
  need(rows.every((r) => Number.isFinite(r.meas) && Number.isFinite(r.ana) && r.ana !== 0), '図 6 の行が数でない');
  const rel = rows.map((r) => Math.abs(r.meas / r.ana - 1));
  const iMax = rel.indexOf(Math.max(...rel)), maxRel = rel[iMax];
  const perCal = F6.data.map((s) => ({ dkt: s.dkt, nWin: s.rows.length, maxRel: rd(Math.max(...s.rows.map((r) => Math.abs(r.meas / r.ana - 1)))) }));
  const v = parseV29(F6.v29Gate.detail);
  const scan = { check: 'p2fig6.analytic', what: '図 6 の走査(図のゲート)', nWin: F6.data[0].rows.length, nCal: F6.data.length, nAll: rows.length,
    maxRel: rd(maxRel), maxRelStored: F6.maxRelErrVsAnalytic, sameAsStored: Math.abs(maxRel - F6.maxRelErrVsAnalytic) <= DECL.idTol,
    atCal: F6.data.find((s) => s.rows.includes(rows[iMax])).dkt, wDrift: F6.maxWDrift, perCal, tol: DECL.tol6, within: maxRel < DECL.tol6 };
  const v29 = { check: 'verify.V29', what: '検証 V29(1 つの走り)', nWin: v.per.length, nCal: 1, dkt: F6.v29Gate.value,
    per: v.per, maxRel: v.max, maxRelText: v.maxText, maxOfPer: Math.max(...v.per), wDrift: v.wDrift, wDriftText: v.wDriftText, tol: DECL.tol6, within: v.max < DECL.tol6, pass: F6.v29Gate.pass === true };
  return { scan, v29, ratio: rd(scan.maxRel / v29.maxRel, 6), bothWithin: scan.within && v29.within };
}

/** ④ 字の在りか: 文字列の束 { 名: 字 } から語の出る所(前後 24 字)を拾う */
export function phraseHits(texts, word = '同水準', span = 24) {
  need(isObj(texts), '字の束が無い');
  const out = [];
  for (const [where, t] of Object.entries(texts)) {
    if (typeof t !== 'string') continue;
    let i = t.indexOf(word);
    while (i >= 0) { out.push({ where, at: i, ctx: t.slice(Math.max(0, i - span), i + word.length + 4) }); i = t.indexOf(word, i + 1); }
  }
  return out;
}

/* ───────── 零試験 ───────── */
export function pureScenes() {
  const s = {};
  // z1: 図ごとに数える(作った束 —— 2 + 1 + 3)・残す/移す の分け方
  const G1 = { gates: [{ id: 'p2fig1.schematic', pass: true }, { id: 'p2fig2.a', pass: true }, { id: 'p2fig2.b', pass: true }, { id: 'p2fig7.x', pass: true }, { id: 'p2fig7.y', pass: false }, { id: 'p2fig8.z', pass: true }], pageErrors: [] };
  s.z1 = gateCounts(G1);
  // z2: 拒否(図の名の型でない・pass が真偽でない・空・束でない・id が無い)
  const rej = (f) => { try { f(); return false; } catch (e) { return /^w356b: /.test(e.message); } };
  s.z2 = { n: [() => gateCounts({ gates: [{ id: 'p3fig1.a', pass: true }] }), () => gateCounts({ gates: [{ id: 'p2fig1.a', pass: 1 }] }), () => gateCounts({ gates: [] }),
    () => gateCounts(null), () => gateCounts({ gates: [{ pass: true }] }), () => precisionOf({}), () => parseV29('なし'), () => schematicA({})].filter(rej).length };
  // z3: 走査の誤差を行から作り直す(作った行 —— 最大は 2 つ目の較正の 0.02)
  const F6 = { maxRelErrVsAnalytic: 0.02, maxWDrift: 1e-4, data: [{ dkt: 1, rows: [{ meas: 1.01, ana: 1 }, { meas: 0.995, ana: 1 }] }, { dkt: 2, rows: [{ meas: 2.04, ana: 2 }, { meas: 2, ana: 2 }] }],
    v29Gate: { pass: true, value: 0.9, detail: 'a: 誤差1.0e-4) / b: 誤差3.0e-4) — w保存ずれ最大=2.0e-4(<1e-3)・比誤差最大=3.0e-4(<1e-2)' } };
  s.z3 = precisionOf(F6);
  // z4: V29 の字の読み
  s.z4 = parseV29('x: 誤差3.9e-4) / y: 誤差2.6e-4) / z: 誤差5.3e-4) — w保存ずれ最大=4.8e-4(<1e-3)・比誤差最大=5.3e-4(<1e-2)。');
  // z5: 模式図 A —— 数は入力から(g を変えるとラベルが変わる)・天体は箱の内・矢印の向きは単位
  const a1 = schematicA({ gainAtR20: { rotation: 0.5, expansion: 0.5, analytic: 0.5 } }), a2 = schematicA({ gainAtR20: { rotation: 0.4, expansion: 0.45, analytic: 0.5 } });
  s.z5 = { a1, lab2: a2.panels[1].label.ja, lab2e: a2.panels[2].label.ja };
  // z6: 模式図 B —— 層の境は増える・光の z は放出の時刻で引く
  const F3 = { anchors: { boxDominated: { phiB: 0.9, n: 1.5 }, locallyDominated: { phiB: 0.1, n: 0.001 } } };
  const F4 = { arrivals: [{ tE: 5, z: 1 }, { tE: 0, z: 3 }], lambdaTracks: { A: { emitT: 0 }, B: { emitT: 5 } }, ledgerMaxAbsErr: 0 };
  const F5 = { pressureOn: { aLast: 2 }, pressureOff: { aMax: 1.01, H1: 1e-3, H2: -1e-3 } };
  s.z6 = schematicB(F3, F4, F5);
  // z7: 字の在りか
  s.z7 = phraseHits({ x: 'abc 本文 5.3e-4 と同水準 def 同水準', y: 'なし', z: 3 });
  // z8: 決定的(同じ入力で同じ出力 —— 2 回作って同じ字)
  s.z8 = { a: JSON.stringify(schematicB(F3, F4, F5)) === JSON.stringify(schematicB(F3, F4, F5)), b: JSON.stringify(precisionOf(F6)) === JSON.stringify(precisionOf(F6)) };
  return s;
}
const near = (a, b, t) => Math.abs(a - b) <= t * Math.max(1, Math.abs(a), Math.abs(b));
const unit = (d) => Math.abs(Math.hypot(d[0], d[1]) - 1) <= 1e-8;
export function pureGates(s) {
  const a = s.z5.a1, b = s.z6;
  return {
    z1_count: s.z1.total === 6 && s.z1.byFig.p2fig1 === 1 && s.z1.byFig.p2fig2 === 2 && s.z1.byFig.p2fig7 === 2 && s.z1.keep === 3 && s.z1.move === 3 && s.z1.other === 0
      && s.z1.keepNumeric === 2 && s.z1.allPass === false && s.z1.pageErrors === 0,
    z2_reject: s.z2.n === 8,
    z3_scan: near(s.z3.scan.maxRel, 0.02, 1e-12) && s.z3.scan.atCal === 2 && s.z3.scan.nAll === 4 && s.z3.scan.nWin === 2 && s.z3.scan.nCal === 2 && s.z3.scan.sameAsStored === true
      && s.z3.v29.nWin === 2 && s.z3.v29.maxRel === 3e-4 && near(s.z3.ratio, 0.02 / 3e-4, 1e-6) && s.z3.bothWithin === false,
    z4_v29: s.z4.per.join(',') === '0.00039,0.00026,0.00053' && s.z4.max === 5.3e-4 && s.z4.maxText === '5.3e-4' && s.z4.wDrift === 4.8e-4,
    z5_schemA: a.schematic === true && a.kind === '模式(数の図ではない)' && a.panels.length === 3 && Math.abs(a.body.x - a.box.cx) + a.body.r < a.box.half
      && a.panels.every((p) => p.arrows.every((q) => q.kind === 'arc' || unit(q.dir))) && a.panels[0].readable === false && a.panels[1].readable && a.panels[2].readable
      && s.z5.lab2.indexOf('0.400') >= 0 && s.z5.lab2e.indexOf('0.450') >= 0,
    z6_schemB: b.schematic === true && b.bounds.join(',') === '0,0.333333333,0.666666667,1' && b.layers.map((l) => l.id).join(',') === 'L1,L2,L3'
      && b.layers[1].nums.zA === 3 && b.layers[1].nums.zB === 1 && b.layers[2].nums.hSignFlip === true && b.layers.every((l) => l.x0 < l.xc && l.xc < l.x1 && unit(l.arrow.dir)),
    z7_phrase: s.z7.length === 2 && s.z7.every((h) => h.where === 'x') && s.z7[0].ctx.indexOf('5.3e-4 と同水準') >= 0,
    z8_determ: s.z8.a === true && s.z8.b === true,
  };
}
