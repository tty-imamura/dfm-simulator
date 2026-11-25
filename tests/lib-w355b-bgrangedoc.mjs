// 第355便b(原仮定者の指示(2026-11-25)・原仮定者の回答(2026-11-25)・統括の検証項目 R505):
// **正本 tests/out/bgrange-355b.json から PHYSICS〔第355便b〕の表と数の文を作る文書の lib**
// (QA docs.bgrange355b が節の表と逐語で照合する —— 表の数は有効数字 3 桁)。原文(言葉を変えずに引く)と読みの表もここに持つ。import しない・ファイルを読まない。
export const DOC_VERSION = 'w355b-bgrangedoc-1';
const fin = (x) => typeof x === 'number' && Number.isFinite(x);
const fp = (x) => (!fin(x) ? '—' : Math.abs(x) >= 1e4 || (Math.abs(x) < 1e-3 && x !== 0) ? Number(x).toExponential(2) : Number(x).toPrecision(3));
const tf = (x) => (x === true ? '真' : x === false ? '偽' : '—');
export const BN = Object.freeze({ Mercury: '水星', Venus: '金星', Earth: '地球', Mars: '火星', Jupiter: '木星', Saturn: '土星', Uranus: '天王星', Neptune: '海王星', Moon: '月', Io: 'イオ' });
export const MN = Object.freeze({ obs: '観測の自転', sync: '同期の自転', syncAbs: '同期の自転・abs(Ω)' });
export const KN = Object.freeze({ common: '共通 1e-2', c337: '固体 3e-3・気体 1e-5' });
export const WN = Object.freeze({ in: '全部内', part: '一部', out: '外' });
export const BLN = Object.freeze({ R: '規則の球(〔第353便zk〕の (イ))', O: '(O2b) だけ', P: '(P-応) だけ', M: '主の作り((O2b) と (P-応))' });
const RN = (ref) => (ref === 'obs' ? '観測の半径' : ref === 'rule' ? '規則の半径' : '—');
const SETN = Object.freeze({ six: '6 組(置き方 3 × k₂/Q 2)', common: 'k₂/Q 共通 1e-2 の 3 組', c337: 'k₂/Q 固体 3e-3・気体 1e-5 の 3 組' });
const rng = (lo, hi, open) => (open ? fp(lo) + '〜' + fp(hi) : '空(下端 ' + fp(lo) + ' ≥ 上端 ' + fp(hi) + ')');

/** 原文(言葉を変えずに引く —— 公開の文書では日付で指す) */
export const ORIGINAL = Object.freeze([
  Object.freeze(['原仮定者の指示(2026-11-25)', 'この結果を尊重する']),
  Object.freeze(['原仮定者の回答(2026-11-25)', '推奨。ただし、必ず0.98 倍である必要は無い']),
]);
/** 統括の読み(原文と分ける)—— [読み, 数えた所] */
export const READINGS = Object.freeze([
  Object.freeze(['引かれた文の要点: 比 1 の線(潮汐力 ÷ 軸引きずり = 1)で惑星が分かれる背景の大きさには範囲が在り、これまでの窓と重なり、注目の 0.98 倍を含む。本節は、その範囲を主の作りで閉じた形で数える(範囲を 1 つの値に置かない)', '表 2・表 3・表 4']),
  Object.freeze(['推奨 = 換算の係数を、太陽の自転の分が金星で背景と等大になる値に取る作り(〔第353便zf〕の列 (イ) の作り)。「必ず0.98 倍である必要は無い」= 背景の大きさを 0.98 倍に固定しない —— 0.98 倍は範囲の内の 1 点', '表 2・表 5']),
]);
export function originalTable(readings = READINGS) {
  return ['| # | 出どころ | 原文(言葉を変えずに引く) | 読み(統括の読み —— 原文と分ける) | 数えた所 |', '|---|---|---|---|---|',
    ...ORIGINAL.map(([src, o], k) => `| ${k + 1} | ${src} | 「${o}」 | ${readings[k][0]} | ${readings[k][1]} |`)].join('\n');
}
const GATE_TEXT = Object.freeze({
  xRsame: '作り R の X = 〔第353便zk〕の xOf(列 (イ)・u 0.98・10 天体 × 置き方 3 × k₂/Q 2)',
  xJson: '同じ X = 〔第353便zk〕の正本の表 1(60 行)',
  t3Json: '閉じた形の範囲 = 〔第353便zk〕の正本の表 3(列 (イ)・6 組 —— 格子の端で切った下端は除く)',
  invU: 'X(u 0.5) ÷ X(u 1) = 2(主の作り・10 天体)',
  uVO2b: '金星の条件の値(規則の球)= 〔第353便zf〕の uVenus・(O2b) ÷ 規則の球 = σ_太陽',
  planetsO2b: '8 惑星の Ω は (O2b) を入れても同じ',
  respRateMult: '(P-応) の倍 = 1 ÷ 〔第353便c〕の rateMult(c は〔第353便zk〕の文献の係数・c_R 1 —— 規則の半径では半径の出どころの比を補正)',
  altCR2: '比べる読みの X は c_R² に比例',
  hostNone: '母天体の倍を外すと〔第353便zk〕の倍なしの列と同じ(月・イオ)',
  omSat: '衛星の Ω(作り R)= 〔第353便zk〕の omOf',
  venusEarthZk: '表 5 の u 0.98 の行 = 〔第353便zk〕の venusEarthRow(列 (イ))× (P-応) の倍',
  bandLive: '閉じた形の範囲 = 〔第353便zk〕の uBand(格子 61 点 + 二分)を走らせ直した範囲(6 組 —— 格子の端で切った端は除く)',
  k2qLinear: '範囲の両端は k₂/Q(共通)に比例(1e-3 → 1e-1 で 100 倍)',
});
export function gateTable(J) {
  const G = J.pure.gates, P = J.pure, circ = '①②③④⑤⑥⑦⑧⑨⑩⑪⑫⑬';
  const v = (k) => (k === 'uVO2b' ? fp(P.uVR) + '・' + fp(P.uVO / P.uVR) : k === 'bandLive' ? P.band.filter((r) => r.grid && r.grid.loClipped).length + ' 組で下端を格子の端で切る' : '—');
  return ['| 零試験 | 値 | 真偽 |', '|---|---|---|', ...Object.keys(GATE_TEXT).map((k, i) => `| ${circ[i]} ${GATE_TEXT[k]} | ${v(k)} | ${tf(G[k])} |`)].join('\n');
}
const pick = (J, b, ref, m, q, pl = true) => J.t3.rows.find((r) => r.build === b && r.ref === ref && r.mode === m && r.k2q === q && r.partAsLock === pl);
/** 表 2: 主の作りの範囲(物差しの半径 = 観測・主の読み —— 置き方 3 × k₂/Q 2。先頭の行が主の行) */
export function mainTable(J) {
  const L = ['| 置き方 | k₂/Q | 範囲(u の下端〜上端) | 端の天体(下・上) | 幅(上端 ÷ 下端) | 0.98 | これまでの窓 0.0487〜0.835 | 金星の条件の値 |', '|---|---|---|---|---:|---|---|---|'];
  for (const m of ['obs', 'sync', 'syncAbs']) for (const q of ['common', 'c337']) { const r = pick(J, 'M', 'obs', m, q);
    L.push(`| ${MN[m]}${m === 'obs' && q === 'common' ? '(主の行)' : ''} | ${KN[q]} | ${rng(r.lo, r.hi, r.open)} | ${BN[r.loBody]}・${BN[r.hiBody]} | ${fp(r.width)} | ${r.in098 ? '内' : '外'} | ${WN[r.window]} | ${r.inUV ? '内' : '外'} |`); }
  return L.join('\n');
}
/** 表 3: 比べる列(観測の自転・共通 1e-2 —— 作り × 物差しの半径 × 読み 2・(ア)・(ウ)) */
export function compareTable(J) {
  const L = ['| 列 | 物差しの半径 | 読み | 範囲(u) | 端の天体(下・上) | 0.98 | これまでの窓 |', '|---|---|---|---|---|---|---|'];
  const C = [['M', 'obs'], ['M', 'rule'], ['P', 'obs'], ['P', 'rule'], ['O', '—'], ['R', '—']];
  for (const [b, ref] of C) for (const pl of [true, false]) { const r = pick(J, b, ref, 'obs', 'common', pl);
    L.push(`| ${BLN[b]} | ${RN(ref)} | ${pl ? '主(ある程度ロックをロックの側に)' : '比べる(ある程度ロックを外す)'} | ${rng(r.lo, r.hi, r.open)} | ${BN[r.loBody]}・${BN[r.hiBody]} | ${r.in098 ? '内' : '外'} | ${WN[r.window]} |`); }
  const a = J.cmp.A.find((r) => r.mode === 'obs' && r.k2q === 'common'), a0 = a.ranges[0];
  L.push(`| (ア)(換算の係数 1 —— 〔第353便zk〕の格子 1e-3〜1e2) | 規則の半径 | 主 | ${fp(a0.lo)}〜${fp(a0.hi)}${a0.hiClipped ? '(上端は格子の端)' : ''} | ${a0.loEdgeBody ? BN[a0.loEdgeBody] : '—'}・${a0.hiEdgeBody ? BN[a0.hiEdgeBody] : '—'} | ${a.focus ? '内' : '外'} | ${WN[a.window]} |`);
  const u = J.cmp.U.find((r) => r.mode === 'obs' && r.k2q === 'common');
  L.push(`| (ウ)(背景 = 金星の条件の大きさ —— u を振る列ではない) | 規則の半径 | 主 | X の帯 ${fp(u.notMax)}(${BN[u.notMaxId]})〜${fp(u.lockMin)}(${BN[u.lockMinId]})—— 線 1 の上に全部 | — | — | — |`);
  return L.join('\n');
}
/** 表 4: 共通部分(作り × 物差しの半径 × 読み × 組) */
export function commonTable(J) {
  const L = ['| 列 | 物差しの半径 | 読み | 組 | 共通部分(u) | 下端を決める組(天体) | 上端を決める組(天体) | 0.98 が内の組 |', '|---|---|---|---|---|---|---|---|'];
  const lab = (f) => MN[f.mode] + '・' + KN[f.k2q] + '(' + BN[f.body] + ')';
  for (const [b, ref] of [['M', 'obs'], ['M', 'rule'], ['R', '—']]) for (const pl of [true, false]) for (const s of ['six', 'common', 'c337']) {
    const r = J.t4.find((q) => q.build === b && q.ref === ref && q.partAsLock === pl && q.sets === s);
    L.push(`| ${BLN[b]} | ${RN(ref)} | ${pl ? '主' : '比べる'} | ${SETN[s]} | ${rng(r.lo, r.hi, r.open)} | ${lab(r.loFrom)} | ${lab(r.hiFrom)} | ${r.n098}/${r.n} |`);
  }
  return L.join('\n');
}
/** 表 5: k₂/Q を共通で振った範囲(主の作り・主の読み —— 物差しの半径 2 × 置き方 3) */
export function k2qTable(J) {
  const sc = J.t3.k2q.find((r) => r.build === 'M').scan.map((s) => s.k2q);
  const L = ['| 物差しの半径・置き方 | ' + sc.map((q) => 'k₂/Q ' + q).join(' | ') + ' |', '|---|' + sc.map(() => '---|').join('')];
  for (const ref of ['obs', 'rule']) for (const m of ['obs', 'sync', 'syncAbs']) { const r = J.t3.k2q.find((x) => x.build === 'M' && x.ref === ref && x.mode === m);
    L.push(`| ${RN(ref)}・${MN[m]} | ` + r.scan.map((s) => rng(s.lo, s.hi, s.open)).join(' | ') + ' |'); }
  return L.join('\n');
}
/** 表 6: (P-応) の倍(X に掛かる) */
export function respTable(J) {
  return ['| 天体 | 物差しの半径 = 観測の半径 | 物差しの半径 = 規則の半径 |', '|---|---:|---:|', ...J.t2.resp.map((r) => `| ${BN[r.id]} | ${fp(r.obs)} | ${fp(r.rule)} |`)].join('\n');
}
/** 表 7: 範囲の内の金星の代表の値(主の作り・観測の半径・観測の自転・共通 1e-2) */
export function repTable(J) {
  const L = ['| u | 換算の係数 | 金星の直交成分 ÷ 背景 | 地球の潮汐(内合)÷ 金星に残るトルク | 同(1 会合の平均) | (E-g) の最大 ÷ 金星に残るトルク | X 金星 | X 地球 | X 水星 |', '|---:|---:|---:|---:|---:|---:|---:|---:|---:|'];
  for (const r of J.t5.rows) L.push(`| ${fp(r.u)} | ${fp(r.k)} | ${fp(r.venusPerpOverBg)} | ${fp(r.earthTideInfOverRes)} | ${fp(r.earthTideMeanOverRes)} | ${fp(r.egMaxOverRes)} | ${fp(r.xVenus)} | ${fp(r.xEarth)} | ${fp(r.xMercury)} |`);
  return L.join('\n');
}
export function tablesOf(J) {
  return { gates: gateTable(J), main: mainTable(J), compare: compareTable(J), common: commonTable(J), k2q: k2qTable(J), resp: respTable(J), rep: repTable(J) };
}
/** 数の文(節に逐語) */
export function factsOf(J) {
  const m = pick(J, 'M', 'obs', 'obs', 'common'), six = J.t4.find((q) => q.build === 'M' && q.ref === 'obs' && q.partAsLock && q.sets === 'six');
  const cm = J.t4.find((q) => q.build === 'M' && q.ref === 'obs' && q.partAsLock && q.sets === 'common');
  const main6 = J.t3.rows.filter((r) => r.build === 'M' && r.ref === 'obs' && r.partAsLock), n098 = main6.filter((r) => r.in098).length, nUV = J.t3.rows.filter((r) => r.inUV).length;
  const mv = (b, ref) => J.t3.move.find((q) => q.build === b && q.ref === ref);
  const mo = mv('M', 'obs'), mr = mv('M', 'rule'), oo = mv('O', '—');
  return {
    main: `主の行(主の作り・物差しの半径 = 観測の半径・観測の自転・k₂/Q 共通 1e-2・ある程度ロックをロックの側に)では、範囲は u = ${fp(m.lo)}〜${fp(m.hi)}(下端は${BN[m.loBody]}・上端は${BN[m.hiBody]}・幅 ${fp(m.width)} 倍)。`,
    focus: `0.98 倍は、主の作りの 6 組(置き方 3 × k₂/Q 2)のうち ${n098} 組で範囲の内。`,
    common: `6 組の共通部分は${six.open ? ' u = ' + fp(six.lo) + '〜' + fp(six.hi) : '空(下端 ' + fp(six.lo) + ' > 上端 ' + fp(six.hi) + ' —— 差は ' + fp(six.gap) + ' 倍)'}。k₂/Q 共通 1e-2 の 3 組の共通部分は u = ${fp(cm.lo)}〜${fp(cm.hi)}。`,
    uv: `金星の条件の値(${fp(J.pure.uVO)})は、72 行のうち ${nUV} 行で範囲の内。`,
    move: `作りを変えたときの端の動き(log10(端 ÷ 規則の球の端)): (O2b) だけ ${oo.minLog10.toFixed(3)}〜${oo.maxLog10.toFixed(3)}・主の作りで観測の半径 ${mo.minLog10.toFixed(3)}〜${mo.maxLog10.toFixed(3)}・規則の半径 ${mr.minLog10.toFixed(3)}〜${mr.maxLog10.toFixed(3)}。`,
  };
}
