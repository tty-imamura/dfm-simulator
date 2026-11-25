// 第353便zk(原仮定者の補足(2026-11-25 —— 第152報)・原仮定者の回答(2026-11-25 —— 第151報)AN1034・原仮定者の指示(2026-11-14 —— 第138報)・統括の検証項目 R501):
// **正本 tests/out/lockdef-353zk.json から PHYSICS〔第353便zk〕の表と数の文を作る文書の lib**
// (QA docs.lockdef353zk が節の表と逐語で照合する —— 表の数は有効数字 3 桁)。原文(言葉を変えずに引く)と読みの表もここに持つ。
export const DOC_VERSION = 'w353zk-lockdefdoc-1';
const fin = (x) => typeof x === 'number' && Number.isFinite(x);
const fe = (x) => (!fin(x) ? '—' : x === 0 ? '0' : Number(x).toExponential(2));
const fp = (x) => (!fin(x) ? '—' : Number(x).toPrecision(3));
const tf = (x) => (x === true ? '真' : x === false ? '偽' : '—');
export const BN = Object.freeze({ Mercury: '水星', Venus: '金星', Earth: '地球', Mars: '火星', Jupiter: '木星', Saturn: '土星', Uranus: '天王星', Neptune: '海王星', Moon: '月', Io: 'イオ' });
export const SN = Object.freeze({ lock: '潮汐ロック', part: 'ある程度ロック', not: 'ロックしない' });
export const CN = Object.freeze({ U: '(ウ)〔主の列〕', A: '(ア)〔0.98 倍・選択肢〕', I: '(イ)〔0.98 倍・選択肢〕' });
export const MN = Object.freeze({ obs: '観測の自転', sync: '同期の自転', syncAbs: '同期の自転・abs(Ω)' });
export const KN = Object.freeze({ common: '共通 1e-2', c337: '固体 3e-3・気体 1e-5' });
const bl = (ids) => (ids.length ? ids.map((id) => BN[id]).join('・') : 'なし');

/** 原文(言葉を変えずに引く) */
export const ORIGINAL = Object.freeze([
  Object.freeze(['原仮定者の補足(2026-11-25 —— 第152報)', '金星の自転の補足: 金星の自転は、潮汐力で太陽と地球に同時にロックした状態であり、地球の潮汐力でたまたま逆回転している。地球の軸引きずりが金星を逆回転させている訳では無い。金星に影響する軸引きずりの影響が、潮汐力を下回っている。また、潮汐ロックは、天体の特定の向きが安定する為に起こり、金星は地球と接近した時に特定の面を地球に向ける。月も同じ面を地球に向ける']),
  Object.freeze(['原仮定者の指示(2026-11-14 —— 第138報)', '潮汐ロックしている状態は、外部からの軸引きずりによる回転よりも、潮汐力が上回っている']),
  Object.freeze(['原仮定者の回答(2026-11-25 —— 第151報)', 'AN1034: 「金星で釣り合う」のは、金星の自転がロックした状態。逆回転は地球の影響であり、「金星は、自転に地球の影響が出るほどに釣り合っている」']),
  Object.freeze(['原仮定者の回答(2026-11-25 —— 第151報)', '銀河由来の背景軸引きずりの大きさ: これに注目 『銀河の公転の角速度』の『0.98 倍(銀河の回転と逆向き)』。向きと大きさは別々に合わせて良い']),
  Object.freeze(['原仮定者の回答(2026-11-25 —— 第153報)', 'AN1082: ウ。0.98 倍も選択肢で、計算が合う方式を採用する']),
  Object.freeze(['原仮定者の回答(2026-11-25 —— 第153報)', 'AN1069: 推奨']),
  Object.freeze(['原仮定者の回答(2026-11-25 —— 第153報)', 'AN1077: 推奨']),
]);
/** 統括の読み(原文と分ける)—— [読み, 数えた所] */
export const READINGS = Object.freeze([
  Object.freeze(['3 つ目の文は、潮汐ロックの定義(原文 2)を金星に当てた不等式「軸引きずりの影響 < 潮汐力」と読む。量は比 X = 潮汐のトルク(比べる列 —— DFM の式ではない)÷ 軸引きずりの直交成分のトルク。「地球の潮汐力でたまたま逆回転」は表 4 の地球の潮汐の行・「特定の面を地球に向ける」は表 5 の整数の並び', '表 1・表 2・表 4・表 5']),
  Object.freeze(['定義の不等式を、ロックの側(潮汐ロック・ある程度ロック)とロックしない側が比 1 の 1 本の線で分かれるか、として数える。ロックの状態は観測の事実として置く(積分で作らない)', '表 2・表 3']),
  Object.freeze(['「地球の影響が出るほどに」は、地球の項(潮汐・(B − A)/C の重力)が、金星に残る軸引きずりのトルクに届くか(比 ≥ 1)として数える', '表 4']),
  Object.freeze(['背景の大きさは置かない —— 注目の列 0.98 を (ア)(イ) に置き、u を振って線で分かれる範囲を並べる((ウ) は金星の条件の大きさ)', '表 2・表 3']),
  Object.freeze(['主の列 = (ウ)(換算の係数 1・背景の大きさ = 金星の条件 (uV))。0.98 倍の列 (ア)(イ) は選択肢として残す(比べる列 —— どの列が計算の合う方式かは本節では判じない。3 列とも数を並べる)', '表 1a〜表 6']),
  Object.freeze(['受け手の半径の入れ方は (P-応) 応答の側だけが主 —— 本節の X は規則の半径の列(受け手の半径の入れ方は X の直交成分の向きに出ない読み —— 数えていない)', '①']),
  Object.freeze(['源の扁平率の式は (O2b) 体積を保つ扁平 σ = (1 − f)^(−2/3) が主 —— 衛星の母天体の項(イオ ← 木星・月 ← 地球)に σ を掛けた列を主に・倍なしを比べる列に。惑星 ← 太陽は σ − 1 が 1e-5 以下なので倍を置かない', '表 1d']),
]);
export function originalTable(readings = READINGS) {
  return ['| # | 出どころ | 原文(言葉を変えずに引く) | 読み(統括の読み —— 原文と分ける) | 数えた所 |', '|---|---|---|---|---|',
    ...ORIGINAL.map(([src, o], k) => `| ${k + 1} | ${src} | 「${o}」 | ${readings[k][0]} | ${readings[k][1]} |`)].join('\n');
}
const GATE_TEXT = Object.freeze({
  anchor8: '統括の数え直し 8(水星〜木星 × 列 3 の観測の自転と同期の自転・abs(Ω) の X —— 表示の桁)・地球 → 金星の潮汐 ÷ 太陽 → 金星 2.88e-9',
  earthSunLib: '地球 → 金星の潮汐の比を lib の口から(上と同じ)',
  tide337c: '潮汐のトルク = 〔第337便c〕の bodyRow の tide[].N × 1.5 k₂/Q(7 天体)',
  uV: '(ウ) の背景の倍率 = 〔第353便zf〕の uVenus(1.19282e-12)',
  kI: '(イ) の換算の係数 = 〔第353便j〕の kFor(8.2158e11)',
  omSide: 'Ω と ŝ = 〔第353便j〕の sideRow(8 惑星 × 列 3)',
  gRes: '(ウ) の金星の abs(Ω) = 〔第353便g〕の残り 1.44e-29・(E-S) ÷ 残り 1.10e-12',
  nNow: 'いまの N(1 会合の間の金星の太陽日の数)が −5 の近く',
  k2qLinear: 'X は k₂/Q に比例',
  obO2b: '衛星の母天体の項の扁平の倍 (O2b) —— 倍なしは〔第353便zf〕の localSumAt と同じ・木星の σ = 1.0457・太陽の σ − 1 ≤ 1e-5',
  despin337c: 'ロックへ入る時間 ÷ 年齢 = 〔第337便c〕の bodyRow の ageRatio(地球を別に書いた式で)',
  struct: '土星・天王星・海王星の数の出どころ = 〔第352便q〕の structOf',
});
export function gateTable(J) {
  const S = J.pure.scenes, G = J.pure.gates, worst = (xs) => Math.max(...xs);
  const v = (k) => {
    if (k === 'anchor8') return fe(worst(S.anchor.map((r) => Math.max(Math.abs(r.xObs / r.refObs - 1), Math.abs(r.xAbs / r.refAbs - 1))))) + '・' + fe(S.eos);
    if (k === 'earthSunLib') return fe(S.eosLib);
    if (k === 'tide337c') return S.tide.length + ' 天体';
    if (k === 'uV') return fe(S.uV);
    if (k === 'kI') return fe(S.kI);
    if (k === 'omSide') return S.om.length + ' 行';
    if (k === 'gRes') return fe(S.g.res) + '・' + fe(S.g.esOverRes);
    if (k === 'nNow') return fp(S.nNow.N);
    if (k === 'k2qLinear') return fp(S.lin);
    if (k === 'obO2b') return fp(S.sigJ) + '・' + fe(S.sigSun - 1);
    if (k === 'despin337c') return fe(S.despinE);
    if (k === 'struct') return '同じ';
    return '—';
  };
  const circ = '①②③④⑤⑥⑦⑧⑨⑩⑪⑫';
  return ['| 零試験 | 値 | 真偽 |', '|---|---|---|', ...Object.keys(GATE_TEXT).map((k, i) => `| ${circ[i]} ${GATE_TEXT[k]} | ${v(k)} | ${tf(G[k])} |`)].join('\n');
}
/** 表 1: X(k₂/Q の置き方 1 つ —— 天体 10 × 列 3 × 置き方 3) */
export function xTable(J, k2q) {
  const xs = J.t1.x.filter((r) => r.k2q === k2q), head = '| 天体(状態) | ' + xs.map((r) => CN[r.col] + ' ' + MN[r.mode]).join(' | ') + ' |';
  const L = [head, '|---|' + xs.map(() => '---:|').join('')];
  for (const id of Object.keys(BN)) L.push(`| ${BN[id]}(${SN[J.lockStates[id]]}) | ` + xs.map((r) => { const x = r.rows.find((q) => q.id === id).X; return fe(x) + (x > 1 ? ' ▲' : ''); }).join(' | ') + ' |');
  return L.join('\n');
}
/** 表 1 の続き: X = 1 になる自転周期(日)と公転の周期との比(k₂/Q 共通 1e-2) */
export function pTable(J) {
  const cols = ['U', 'A', 'I'], L = ['| 天体 | 公転の周期(日) | ' + cols.map((c) => CN[c] + ' abs(Ω × ŝ)').join(' | ') + ' | ' + cols.map((c) => CN[c] + ' abs(Ω)').join(' | ') + ' |', '|---|---:|' + cols.map(() => '---:|---:|').join('')];
  for (const id of Object.keys(BN)) {
    const rs = cols.map((c) => J.t1.p.find((r) => r.col === c && r.k2q === 'common' && r.id === id));
    L.push(`| ${BN[id]} | ${fp(rs[0].porbDays)} | ` + rs.map((r) => fe(r.days) + '(' + fe(r.overPorb) + ')').join(' | ') + ' | ' + rs.map((r) => fe(r.daysAbs) + '(' + fe(r.overPorbAbs) + ')').join(' | ') + ' |');
  }
  return L.join('\n');
}
/** 表 1d: 衛星の母天体の扁平の倍 (O2b)(主)と倍なし(比べる列)の X(k₂/Q 共通 1e-2) */
export function obTable(J) {
  const L = ['| 衛星 | σ(母天体) | 列 | 置き方 | X((O2b) —— 主) | X(倍なし —— 比べる列) |', '|---|---:|---|---|---:|---:|'];
  for (const r of J.t1.ob) L.push(`| ${BN[r.id]} | ${fp(r.sigma)} | ${CN[r.col]} | ${MN[r.mode]} | ${fe(r.xO2b)} | ${fe(r.xNone)} |`);
  return L.join('\n');
}
/** 表 2c: ロックへ入る時間 ÷ 年齢と要る k₂/Q(〔第337便c〕の bodyRow —— 比べる列・初めの自転 10 時間・k₂/Q 固体 3e-3・気体 1e-5) */
export function despinTable(J) {
  const D = J.t2.despin, L = ['| 天体 | 本節の状態 | 〔第337便c〕の状態 | ロックへ入る時間(年) | ロックへ入る時間 ÷ 年齢 | 年齢の内に入るのに要る k₂/Q |', '|---|---|---|---:|---:|---:|'];
  const S3 = { locked: 'ロック', notLocked: 'ロックしない', resonance: '共鳴(外す)' };
  for (const r of D.rows) L.push(`| ${BN[r.id]} | ${SN[r.state]} | ${r.state337 === null ? '数なし' : S3[r.state337]} | ${r.tDespinYr === null ? '数なし' : fe(r.tDespinYr)} | ${r.ageRatio === null ? '数なし' : fe(r.ageRatio)} | ${r.kqReq === null ? '数なし' : fe(r.kqReq)} |`);
  L.push('', '| 量 | 読み | ロックの側の最大 | ロックしない側の最小 | 分かれる |', '|---|---|---:|---:|---|');
  const KY = { ageRatio: 'ロックへ入る時間 ÷ 年齢', kqReq: '要る k₂/Q' }, RD = { '337c': '〔第337便c〕の状態(金星はロックしない・水星は外す)', zk: '本節のロックの側(水星・金星をロックの側)' };
  for (const r of D.sep) L.push(`| ${KY[r.key]} | ${RD[r.reading]} | ${fe(r.band[0])}(${BN[r.lockMaxId]}) | ${fe(r.band[1])}(${BN[r.notMinId]}) | ${tf(r.separable)} |`);
  return L.join('\n');
}
/** 表 2: 1 本の線で分かれるか */
export function sepTable(J) {
  const L = ['| 列 | 置き方 | k₂/Q | 「ある程度ロック」 | ロックの側の最小 | ロックしない側の最大 | 帯で分かれる | 線 1 で分かれる | 外れる天体 |', '|---|---|---|---|---:|---:|---|---|---|'];
  for (const r of J.t2.sep) L.push(`| ${CN[r.col]} | ${MN[r.mode]} | ${KN[r.k2q]} | ${r.partAsLock ? 'ロックの側(主)' : '数えない(比べる列)'} | ${fe(r.lockMin)}(${BN[r.lockMinId]}) | ${fe(r.notMax)}(${BN[r.notMaxId]}) | ${tf(r.separable)} | ${tf(r.atOne)} | ${bl(r.outLock.concat(r.outNot))} |`);
  return L.join('\n');
}
/** 表 2 の続き: k₂/Q を共通で振ったとき線 1 で分かれる範囲 */
export function k2qTable(J) {
  const L = ['| 列 | 置き方 | 「ある程度ロック」 | 下端(ロックの側の最小が 1) | 上端(ロックしない側の最大が 1) | 1e-4〜1e-1 の内の範囲 |', '|---|---|---|---:|---:|---|'];
  for (const r of J.t2.k2q) L.push(`| ${CN[r.col]} | ${MN[r.mode]} | ${r.partAsLock ? 'ロックの側(主)' : '数えない(比べる列)'} | ${fe(r.lo)}(${BN[r.lockMinId]}) | ${fe(r.hi)}(${BN[r.notMaxId]}) | ${r.clip ? fe(r.clip[0]) + '〜' + fe(r.clip[1]) : '無い'} |`);
  return L.join('\n');
}
const REL = Object.freeze({ in: '内', part: '一部', out: '外' });
/** 表 3: 背景の大きさ u で分かれる範囲 */
export function uTable(J) {
  const L = ['| 列 | 置き方 | k₂/Q | 線 1 で分かれる u の範囲(境の天体) | これまでの窓 0.0487〜0.835 | 注目の列 0.98 | 金星の条件 (uV) |', '|---|---|---|---|---|---|---|'];
  for (const r of J.t3) {
    const rg = r.ranges.length ? r.ranges.map((q) => fe(q.lo) + (q.loClipped ? '(格子の端)' : '(' + BN[q.loEdgeBody] + ')') + '〜' + fe(q.hi) + (q.hiClipped ? '(格子の端)' : '(' + BN[q.hiEdgeBody] + ')')).join('・') : '無い';
    L.push(`| ${CN[r.col]} | ${MN[r.mode]} | ${KN[r.k2q]} | ${rg} | ${REL[r.window]} | ${r.focus ? '内' : '外'} | ${r.uV ? '内' : '外'}${r.uVBelowGrid ? '(格子の下 —— 1.19e-12)' : ''} |`);
  }
  return L.join('\n');
}
/** 表 4: 金星 —— 地球の影響 */
export function venusTable(J) {
  const R = J.t4.rows, L = ['| 量 | ' + R.map((r) => CN[r.col]).join(' | ') + ' |', '|---|' + R.map(() => '---:|').join('')];
  const row = (nm, f) => L.push(`| ${nm} | ` + R.map(f).join(' | ') + ' |');
  row('残る軸引きずりの直交成分のトルク N m(観測の自転)', (r) => fe(r.Nax));
  row('直交成分 ÷ 背景', (r) => fe(r.perpOverBg));
  row('(i) 地球の潮汐(内合・k₂/Q 1e-2)÷ 残り', (r) => fe(r.rInf));
  row('(i) 地球の潮汐(1 会合の平均)÷ 残り', (r) => fe(r.rMean));
  for (let i = 0; i < R[0].eg.length; i++) row(`(ii) (E-g) の最大((B − A)/C ${fe(R[0].eg[i].q)})÷ 残り`, (r) => fe(r.eg[i].ratio) + (r.eg[i].ratio >= 1 ? ' ▲' : ''));
  row('(iii) 太陽の潮汐(k₂/Q 1e-2)÷ 残り', (r) => fe(r.rSun));
  row('(i) が届くのに要る 直交成分 ÷ 背景(内合・平均)', (r) => fe(r.rNeedInf) + '・' + fe(r.rNeedMean));
  for (let i = 0; i < R[0].rNeedEg.length; i++) row(`(ii) が届くのに要る 直交成分 ÷ 背景((B − A)/C ${fe(R[0].rNeedEg[i].q)})`, (r) => fe(r.rNeedEg[i].r));
  row('(ii) が届くのに要る (B − A)/C', (r) => fe(r.qNeed));
  return L.join('\n');
}
/** 表 5: 同時にロックの整数の並び(算術・仮) */
export function nTable(J) {
  const L = ['| N(1 会合の間の太陽日の数) | 自転周期(日 —— 負は逆行) | 向き |', '|---:|---:|---|'];
  for (const r of J.t5.grid) L.push(`| ${r.N} | ${r.spinDays === null ? '—' : fp(r.spinDays)} | ${r.sense === 'retro' ? '逆行' : r.sense === 'pro' ? '順行' : '—'}${r.N === J.t5.nearestN ? '(いまの近く)' : ''} |`);
  return L.join('\n');
}
/** 表 6: 言えること・言えないこと */
export function sayTable(J) {
  const L = ['| 列 | 線 1 で分かれる組(主 —— 置き方 3 × k₂/Q 2) | 外れる天体 | 金星: 地球の潮汐 ÷ 残り(内合) | 金星: (E-g) の最大 ÷ 残り((B − A)/C 1e-5) | 0.98 が u の範囲の内の組 | 言えないこと |', '|---|---|---|---:|---:|---|---|'];
  for (const r of J.t6) L.push(`| ${CN[r.col]} | ${r.atOne}/${r.of} | ${bl(r.outs)} | ${fe(r.venusEarthInf)} | ${fe(r.venusEgMax)} | ${r.focusIn === null ? '—(背景は金星の条件)' : r.focusIn + '/' + r.nUb} | k₂/Q と (B − A)/C は未照合のノブ —— どの組が現実かは言えない |`);
  return L.join('\n');
}
export function tablesOf(J) {
  return { 0: gateTable(J), '1a': xTable(J, 'common'), '1b': xTable(J, 'c337'), '1c': pTable(J), '1d': obTable(J), 2: sepTable(J), '2b': k2qTable(J), '2c': despinTable(J), 3: uTable(J), 4: venusTable(J), 5: nTable(J), 6: sayTable(J) };
}
export function factsOf(J) {
  const sm = (c) => J.t2.sep.filter((r) => r.col === c && r.partAsLock), cnt = (c) => sm(c).filter((r) => r.atOne).length;
  const xa = (c, m, id) => J.t1.x.find((r) => r.col === c && r.mode === m && r.k2q === 'common').rows.find((q) => q.id === id).X;
  const v = (c) => J.t4.rows.find((r) => r.col === c), g = J.t4.g;
  const kb = (c, m) => J.t2.k2q.find((r) => r.col === c && r.mode === m && r.partAsLock);
  return {
    line: `線 1(比 = 1)で分かれる組(「ある程度ロック」をロックの側に数える読み・置き方 3 × k₂/Q 2): 主の列 (ウ) ${cnt('U')}/6(全部の惑星で X が 1 を越える)・選択肢 (ア) ${cnt('A')}/6・(イ) ${cnt('I')}/6。帯で分かれる組(線の位置を問わない)は (ウ) ${sm('U').filter((r) => r.separable).length}/6・(ア) ${sm('A').filter((r) => r.separable).length}/6・(イ) ${sm('I').filter((r) => r.separable).length}/6。`,
    venus: `金星の X(k₂/Q 1e-2 —— 観測の自転・同期の自転で abs(Ω)): (ウ) ${fe(xa('U', 'obs', 'Venus'))}・${fe(xa('U', 'syncAbs', 'Venus'))}/(ア) ${fe(xa('A', 'obs', 'Venus'))}・${fe(xa('A', 'syncAbs', 'Venus'))}/(イ) ${fe(xa('I', 'obs', 'Venus'))}・${fe(xa('I', 'syncAbs', 'Venus'))}。地球の X: (ウ) ${fe(xa('U', 'obs', 'Earth'))}・${fe(xa('U', 'syncAbs', 'Earth'))}/(ア) ${fe(xa('A', 'obs', 'Earth'))}・${fe(xa('A', 'syncAbs', 'Earth'))}/(イ) ${fe(xa('I', 'obs', 'Earth'))}・${fe(xa('I', 'syncAbs', 'Earth'))}。`,
    k2q: `k₂/Q を共通で振ったとき線 1 で分かれる範囲(「ある程度ロック」をロックの側に): (ウ) 観測の自転 ${fe(kb('U', 'obs').lo)}〜${fe(kb('U', 'obs').hi)}(1e-4〜1e-1 の外)/(ア) ${fe(kb('A', 'obs').lo)}〜${fe(kb('A', 'obs').hi)}・同期の自転・abs(Ω) ${fe(kb('A', 'syncAbs').lo)}〜${fe(kb('A', 'syncAbs').hi)}/(イ) ${fe(kb('I', 'obs').lo)}〜${fe(kb('I', 'obs').hi)}・${fe(kb('I', 'syncAbs').lo)}〜${fe(kb('I', 'syncAbs').hi)}。`,
    earth: `金星に残る軸引きずりのトルクに対して、地球の潮汐(内合・k₂/Q 1e-2)は (ウ) ${fe(v('U').rInf)}・(ア) ${fe(v('A').rInf)}・(イ) ${fe(v('I').rInf)} 倍(1 会合の平均で (ウ) ${fe(v('U').rMean)})。(E-g) の最大((B − A)/C 1e-5)は (ウ) ${fe(v('U').eg[2].ratio)}・(ア) ${fe(v('A').eg[2].ratio)}・(イ) ${fe(v('I').eg[2].ratio)} 倍 —— 届くのに要る (B − A)/C は (ウ) ${fe(v('U').qNeed)}・(ア) ${fe(v('A').qNeed)}・(イ) ${fe(v('I').qNeed)}。〔第353便g〕の地球の (S) ÷ 残り は ${fe(g.esOverRes)}((ウ) の背景・内合)。`,
    despin: (() => { const d = (k, r) => J.t2.despin.sep.find((q) => q.key === k && q.reading === r); const a = d('ageRatio', 'zk'), b = d('ageRatio', '337c'), c = d('kqReq', 'zk');
      return `比べる列(〔第337便c〕のロックへ入る時間 ÷ 年齢 —— 初めの自転 10 時間・k₂/Q 固体 3e-3・気体 1e-5): 本節のロックの側(水星・金星を含む)では ${a.separable ? '分かれる' : '分かれない'}(帯 ${fe(a.band[0])}〔${BN[a.lockMaxId]}〕〜${fe(a.band[1])}〔${BN[a.notMinId]}〕)・〔第337便c〕の状態では ${b.separable ? '分かれる' : '分かれない'}(帯 ${fe(b.band[0])}〜${fe(b.band[1])})。要る k₂/Q では本節のロックの側で ${c.separable ? '分かれる' : '分かれない'}(${BN[c.lockMaxId]} ${fe(c.band[0])} と ${BN[c.notMinId]} ${fe(c.band[1])})。土星・天王星・海王星は〔第337便c〕の表に無い(数なし)。`; })(),
    nseq: `1 会合(${fp(J.t5.now.S)} 日)の間の金星の太陽日の数 N は ${fp(J.t5.now.N)}(仮の自転周期 ${fp(-J.t5.now.spinDays)} 日・逆行)。内合ごとに同じ面を地球に向ける自転は整数の N の並びで、N ≤ ${J.t5.retroMax} が逆行・N ≥ ${J.t5.retroMax + 1} が順行。月の同じ量は 0(同期)。`,
  };
}
