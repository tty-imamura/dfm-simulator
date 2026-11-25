// 第353便zj(原仮定者の回答(2026-11-25 —— 第151報)・原仮定者の回答(2026-11-14 —— 第138報の回答)AN721・統括の検証項目 R499):
// **正本 tests/out/orbitk-353zj.json から PHYSICS〔第353便zj〕の表と数の文を作る文書の lib**
// (QA docs.orbitk353zj が節の表と逐語で照合する —— 表の数は有効数字 3 桁・角は小数 3 桁)。原文(言葉を変えずに引く)と読みの表もここに持つ。
export const DOC_VERSION = 'w353zj-orbitkdoc-1';
const fin = (x) => typeof x === 'number' && Number.isFinite(x);
const fe = (x) => (!fin(x) ? '—' : x === 0 ? '0' : Number(x).toExponential(2));
const fd = (x) => (!fin(x) ? '—' : Number(x).toFixed(3));
const fp = (x) => (!fin(x) ? '—' : Number(x).toPrecision(3));
const tf = (x) => (x === true ? '真' : x === false ? '偽' : '—');
const RN = Object.freeze({ Mercury: '水星', Venus: '金星', Earth: '地球', Mars: '火星' });
const SN = Object.freeze({ w333c: '第333便c(G_loc + K1)', w335c: '第335便c(1PN の率)', w337b: '第337便b(1PN の率)' });
/** 組の名(表の見出し) */
export function comboName(id, cR) {
  if (id === 'k1') return 'k 1(背景だけ)';
  if (id === 'rule') return '規則の半径';
  if (id === 'resp') return '(P-応)';
  return '(P-場) c_R ' + fp(cR);
}
const nd = (x) => (x === null ? '数なし' : fe(x));
const ov = (x) => (x === null ? '数なし' : fe(x) + (fin(x) && x > 1 ? ' ▲' : ''));
const rg = (a, f = fe) => (a === null ? '—' : f(a[0]) + '〜' + f(a[1]));

/** 原文(言葉を変えずに引く) */
export const ORIGINAL = Object.freeze([
  Object.freeze(['原仮定者の回答(2026-11-25 —— 第151報)', '銀河由来の背景軸引きずりの大きさ: これに注目 『銀河の公転の角速度』の『0.98 倍(銀河の回転と逆向き)』。向きと大きさは別々に合わせて良い']),
  Object.freeze(['原仮定者の回答(2026-11-25 —— 第151報)', '向きと幾何: これを採用『主の成分を太陽の自転の分・背景を太陽系の基準軸の向きに置くと、太陽の 5〜6° の傾きは円錐になり、金星で 1% まで打ち消します。』']),
  Object.freeze(['原仮定者の回答(2026-11-25 —— 第151報)', 'AN1033: 「太陽系の基準軸の向き」。「観測値は釣り合った結果」なので、観測値に沿った方式を採用する']),
  Object.freeze(['原仮定者の回答(2026-11-25 —— 第151報)', 'AN1039: 角運動量の重み。計算が合う方式を採用する']),
  Object.freeze(['原仮定者の回答(2026-11-25 —— 第151報)', 'AN1045: 「規則の半径」。土星の環は、円盤引きずりが影響している。計算が合う方式を採用する。想定する基準は、引きずる側は「規則の半径と、扁平率」、引きずられる側は「観測半径と、構造の係数のノブ」']),
  Object.freeze(['原仮定者の回答(2026-11-14 —— 第138報の回答)', '並進引きずりの結果と思われるので、回転引きずりも検証する。回転引きずりは、源の引きずり半径が影響する。土星の環に影響する計算を求めてから、水星での影響を確認する']),
  Object.freeze(['原仮定者の整理(2026-11-24 —— 第148報)', '太陽系の公転面は、原始太陽系の円盤引きずりに由来する。公転面に薄く集まる事で、惑星の形成を促進した']),
]);
/** 統括の読み(原文と分ける)—— [読み, 数えた所] */
export const READINGS = Object.freeze([
  Object.freeze(['注目の列 u = 0.98(向きは (N+))。0.98 のまま金星を打ち消す換算の係数 k(〔第353便j〕の組 8)を全部の受け手に同じに掛けた列(〔第353便q〕・〔第353便u〕)で、公転の道を読む。背景だけでも 0.98 ω_G が全部の惑星に同じに掛かる', '表 3・表 4']),
  Object.freeze(['主の列は局所 = 源の自転の分 (S)・背景 = (N+) 太陽系の基準軸の向き(基準軸 L)。〔第353便za〕までは自転軸だけを数えた —— 本節は同じ合成の回転に、道の面の法線と近点の向きも応えるとしたときの率', '表 3']),
  Object.freeze(['観測値に沿う方式 —— 暦表の追加の近点と交点の歳差の参考の幅(文献の値・未照合・幅は 1σ ではない)を、道が応える割合 c_輪 の上限の物差しに置く(合否にしない)', '表 4・表 6']),
  Object.freeze(['基準軸は L(角運動量の重み)のまま —— 背景の向きは基準軸 L', '表 3']),
  Object.freeze(['源は規則の半径(扁平率は入れない —— 本節は局所の大きさを換算の係数 k で置く列)・受け手は (P-場) の c_R の格子と (P-応)(〔第353便j〕の組)', '表 3・表 4']),
  Object.freeze(['環に効く計算(〔第353便q〕 —— 環の率が物差しの桁に来る k)を先に置き、同じ k・同じ式のまま水星の道を読む。〔第337便i〕の円盤引きずり(源の引きずり半径が効く型)とは別の作用', '表 5']),
  Object.freeze(['公転面が薄く集まる(散らばり 30° → 7° —— 〔第352便w〕の下限の作り)には、道が背景へ寄る分が要る —— その下限の c_輪 と f_輪 を、上の上限と同じ表に並べる', '表 4・表 6']),
]);
export function originalTable(readings = READINGS) {
  return ['| # | 出どころ | 原文(言葉を変えずに引く) | 読み(統括の読み —— 原文と分ける) | 数えた所 |', '|---|---|---|---|---|',
    ...ORIGINAL.map(([src, o], k) => `| ${k + 1} | ${src} | 「${o}」 | ${readings[k][0]} | ${readings[k][1]} |`)].join('\n');
}
const GATE_TEXT = Object.freeze({
  bgRate: 'k 1・c_輪 1 の合成の大きさ = 0.98 × 銀河の公転の角速度(〔第353便b〕の 5.80e-3″/年 = 0.580″/世紀 —— 4 惑星の最大の相対の差)',
  k1Common: 'k 1 の局所 ÷ 背景(4 惑星の最大 —— 差の列は丸めの桁)',
  locU: '局所 ÷ 背景(規則の半径)= 〔第353便u〕の nearState(水星 6.53・地球 0.377・火星 0.107)',
  venusOne: '金星の局所 ÷ 背景 = 1(組 8 —— k の定め・最大の差)',
  precSame: '道の法線の率 = 〔第352便d〕の precDs・黄道の交点と傾きの率 = poleRates(水星・金星・火星 × 組 9 —— 最大の相対の差)',
  linear: '全部 = 共通の分 + 差・c_輪 に比例・(g2+) で符号だけ替わる(最大の相対の差)',
  varpiSplit: '近点の率 = 面内の回り + (1 − cos i) × 交点の率(水星 k 1)',
  litC: '文献の値 = 〔第335便c〕の LIT(火星の近点は訂正の後 −0.000020 ± 0.000037″/世紀)',
  earthNode: '地球の交点は数なし(LIT に値が無い・黄道の交点が定まらない)',
  fRing: '公転面が寄る下限 = 〔第353便e〕の fRingAt(0.98)1.15e-2・〔第353便x〕の ringNeed の c_輪 の下限 1.17e-2',
  kRule: '規則の半径で金星が等大の k(8.22e+11)・ω_G',
  q1Merc: '〔第337便b〕の系の水星の 1PN の面内の近点の率(″/世紀)',
  normals: '道の法線(〔第337便b〕の要素)と〔第353便u〕の法線の角の最大(度)',
  rejects: '拒否(受け手の名・組の名・u ≤ 0・c_輪 < 0・f_輪 > 1・歳差の向き・文献の受け手・ベクトルの長さ —— RangeError)',
});
export function gateTable(J) {
  const S = J.pure.scenes, G = J.pure.gates, v = (k) => {
    if (k === 'bgRate') return fe(S.bgVs) + '(' + fe(S.bgAsYr) + '″/年)';
    if (k === 'k1Common') return fe(S.k1DiffZero);
    if (k === 'locU') return Object.values(S.locRule).join('・');
    if (k === 'venusOne') return fe(S.venusOne);
    if (k === 'precSame') return fe(S.prVs);
    if (k === 'linear') return fe(S.linVs);
    if (k === 'varpiSplit') return fe(S.varpiVs);
    if (k === 'litC') return '同じ';
    if (k === 'earthNode') return '数なし';
    if (k === 'fRing') return fe(S.fRingAt1) + '・' + fe(S.kMin);
    if (k === 'kRule') return fe(S.kr) + '・' + S.omegaG;
    if (k === 'q1Merc') return fp(S.q1);
    if (k === 'normals') return fe(S.nVs);
    if (k === 'rejects') return S.rejects.length + ' 本';
    return '—';
  };
  const circ = '①②③④⑤⑥⑦⑧⑨⑩⑪⑫⑬⑭';
  return ['| 零試験 | 値 | 真偽 |', '|---|---|---|', ...Object.keys(GATE_TEXT).map((k, i) => `| ${circ[i]} ${GATE_TEXT[k]} | ${v(k)} | ${tf(G[k])} |`)].join('\n');
}
const combosOf = (J) => [...new Set(J.t1.map((r) => r.combo))].map((c) => J.t1.find((r) => r.combo === c));
/** 表 3: 率(受け手 4 × 組 9 —— c_輪 1・f_輪 0・(g2−)・″/世紀) */
export function rateTable(J) {
  const C = combosOf(J), head = '| 受け手 | 量(″/世紀) | ' + C.map((r) => comboName(r.combo, r.cR)).join(' | ') + ' |', sep = '|---|---|' + C.map(() => '---:|').join('');
  const L = [head, sep];
  for (const id of Object.keys(RN)) {
    const rs = C.map((c) => J.t1.find((r) => r.id === id && r.combo === c.combo)), nm = RN[id];
    L.push(`| ${nm} | 局所 ÷ 背景 | ` + rs.map((r) => fe(r.locOverBg)).join(' | ') + ' |');
    L.push(`| ${nm} | 合成の大きさ | ` + rs.map((r) => fe(r.omCy)).join(' | ') + ' |');
    L.push(`| ${nm} | 全部: 道の法線の回る率 | ` + rs.map((r) => fe(r.full.Lmag)).join(' | ') + ' |');
    L.push(`| ${nm} | 全部: 黄道の交点の率 | ` + rs.map((r) => nd(r.full.dnode)).join(' | ') + ' |');
    L.push(`| ${nm} | 全部: 傾きの率 | ` + rs.map((r) => fe(r.full.di)).join(' | ') + ' |');
    L.push(`| ${nm} | 全部: 近点の率 | ` + rs.map((r) => fe(r.full.dvarpi)).join(' | ') + ' |');
    L.push(`| ${nm} | 差(k × 局所): 黄道の交点の率 | ` + rs.map((r) => nd(r.diff.dnode)).join(' | ') + ' |');
    L.push(`| ${nm} | 差(k × 局所): 近点の率 | ` + rs.map((r) => fe(r.diff.dvarpi)).join(' | ') + ' |');
  }
  return L.join('\n');
}
/** 表 4: 比(÷ 比べる尺度)・上限の c_輪・寄る下限と窓 */
export function ratioTable(J) {
  const C = combosOf(J), head = '| 受け手(比べる尺度 ″/世紀) | 量 | ' + C.map((r) => comboName(r.combo, r.cR)).join(' | ') + ' |', sep = '|---|---|' + C.map(() => '---:|').join('');
  const L = [head, sep];
  for (const id of Object.keys(RN)) {
    const rs = C.map((c) => J.t2.find((r) => r.id === id && r.combo === c.combo)), lt = J.lit[id];
    const nm = RN[id] + '(近点 ' + fe(lt.scaleVarpi) + '・交点 ' + nd(lt.scaleNode) + ')';
    L.push(`| ${nm} | 全部の比: 近点 | ` + rs.map((r) => ov(r.full.varpi)).join(' | ') + ' |');
    L.push(`| ${nm} | 全部の比: 交点 | ` + rs.map((r) => ov(r.full.node)).join(' | ') + ' |');
    L.push(`| ${nm} | 差の比: 近点 | ` + rs.map((r) => ov(r.diff.varpi)).join(' | ') + ' |');
    L.push(`| ${nm} | 差の比: 交点 | ` + rs.map((r) => ov(r.diff.node)).join(' | ') + ' |');
    L.push(`| ${nm} | 比が 1 になる c_輪(全部) | ` + rs.map((r) => fe(r.cMaxFull)).join(' | ') + ' |');
    L.push(`| ${nm} | 比が 1 になる c_輪(差) | ` + rs.map((r) => (r.cMaxDiff === null ? '—' : fe(r.cMaxDiff))).join(' | ') + ' |');
    L.push(`| ${nm} | 寄る下限(c_輪 1・f_輪 1.15e-2)の比の大きい方 | ` + rs.map((r) => ov(Math.max(r.gather.A.varpi, r.gather.A.node === null ? 0 : r.gather.A.node))).join(' | ') + ' |');
    L.push(`| ${nm} | 寄る下限の線の上の比の最小(f_輪) | ` + rs.map((r) => ov(r.win.best.max) + '(' + fp(r.win.best.fRing) + ')' + (r.win.open ? ' ○' : '')).join(' | ') + ' |');
  }
  return L.join('\n');
}
/** 表 5: 在位の組との並び(水星) */
export function inposTable(J) {
  const C = J.t3.rows, cR = (c) => J.t1.find((r) => r.combo === c).cR;
  const L = ['| 組 | 近点の率(c_輪 1)″/世紀 | ' + Object.keys(SN).map((k) => SN[k] + ' ' + J.t3.inpos[k].value + ' に足した割合(c_輪 1)').join(' | ') + ' | 上限の c_輪 | 上限の c_輪 で足した割合 | ÷ 〔第337便i〕の組 2・組 3 の比 |',
    '|---|---:|' + Object.keys(SN).map(() => '---:|').join('') + '---:|---:|---:|'];
  for (const r of C) L.push(`| ${comboName(r.combo, cR(r.combo))} | ${fe(r.dvarpi)} | ` + r.shift1.map((s) => fe(s.frac)).join(' | ') + ` | ${fe(r.cMaxFull)} | ${fe(r.shiftMax[0].frac)} | ${r.over337i.map(fe).join('・')} |`);
  return L.join('\n');
}
const RD = Object.freeze({ c0: '(i) 応えない(c_輪 0)', c1: '(ii) 自転軸と同じに応える(c_輪 1 —— f_輪 0)', gather: '(iii) 公転面が寄る下限の c_輪(寄る分 c_輪 k₁ = 0.0117 の線の上)' });
/** 表 6: 言えること・言えないこと */
export function sayTable(J) {
  const ids = Object.keys(RN), L = ['| 読み | ' + ids.map((id) => RN[id]).join(' | ') + ' |', '|---|' + ids.map(() => '---|').join('')];
  for (const row of J.t4) {
    const cell = (c) => {
      if (row.reading === 'c0') return '比 0(道は動かない)';
      if (row.reading === 'c1') return `背景だけ ${fe(c.k1)}・k を置いた組: 全部 ${rg(c.full)}・差 ${rg(c.diff)}(c_輪 の上限 ${rg(c.cMaxDiff)})`;
      return `比の最小 ${rg(c.best)}(f_輪 1 で ${rg(c.atF1)})・1 以下の組 ${c.open}/${c.of}` + (c.nodeScale ? '' : '(交点の尺度なし —— 近点だけ)');
    };
    L.push(`| ${RD[row.reading]} | ` + row.cells.map(cell).join(' | ') + ' |');
  }
  return L.join('\n');
}
export function tablesOf(J) {
  return { 2: gateTable(J), 3: rateTable(J), 4: ratioTable(J), 5: inposTable(J), 6: sayTable(J) };
}
export function factsOf(J) {
  const k1 = J.t1.filter((r) => r.combo === 'k1'), kc = J.t1.filter((r) => r.combo !== 'k1'), m = (id) => kc.filter((r) => r.id === id);
  const rng = (xs, f = fe) => { const v = xs.filter(fin); return f(Math.min(...v)) + '〜' + f(Math.max(...v)); };
  const t2k = J.t2.filter((r) => r.combo !== 'k1'), overD = t2k.filter((r) => r.overDiff).length, overF = t2k.filter((r) => r.overFull).length;
  const mr = J.t3.rows.find((r) => r.combo === 'rule'), g = J.t4.find((r) => r.reading === 'gather').cells;
  return {
    common: `背景だけ(k 1)の列では、合成の大きさは 4 惑星とも ${fd(k1[0].omCy)}″/世紀(0.98 × 銀河の公転の角速度)で、近点の率は ${rng(k1.map((r) => r.full.dvarpi), fd)}″/世紀・道の法線の回る率は ${rng(k1.map((r) => r.full.Lmag), fd)}″/世紀 —— 全部の惑星に同じ回転(共通の分)。`,
    diff: `換算の係数を置いた組 8 では、差(k × 局所)の近点の率は 水星 ${rng(m('Mercury').map((r) => r.diff.dvarpi))}・金星 ${rng(m('Venus').map((r) => r.diff.dvarpi))}・地球 ${rng(m('Earth').map((r) => r.diff.dvarpi))}・火星 ${rng(m('Mars').map((r) => r.diff.dvarpi))}″/世紀。水星の合成の大きさは ${rng(m('Mercury').map((r) => r.omCy))}″/世紀(規則の半径の組で ${fe(m('Mercury').find((r) => r.combo === 'rule').omCy)})。`,
    ratio: `参考の幅との比(c_輪 1)は、k を置いた ${t2k.length} 行のうち、差の列で ${overD} 行・全部の列で ${overF} 行が 1 を越える。比が 1 になる c_輪 の上限(差)は 水星 ${rng(t2k.filter((r) => r.id === 'Mercury').map((r) => r.cMaxDiff))}・金星 ${rng(t2k.filter((r) => r.id === 'Venus').map((r) => r.cMaxDiff))}・地球 ${rng(t2k.filter((r) => r.id === 'Earth').map((r) => r.cMaxDiff))}・火星 ${rng(t2k.filter((r) => r.id === 'Mars').map((r) => r.cMaxDiff))}。`,
    gather: `公転面が寄る下限(c_輪 k₁ ≥ ${fe(g[0].kMin)})の線の上で比が最も小さい点は、水星 ${rg(g[0].best)}・金星 ${rg(g[1].best)}・地球 ${rg(g[2].best)}(近点だけ)・火星 ${rg(g[3].best)} —— 1 以下の組は 水星 ${g[0].open}・金星 ${g[1].open}・地球 ${g[2].open}・火星 ${g[3].open}(各 ${g[0].of})。`,
    inpos: `水星の在位の組(1PN の値に当たる組 ${J.t3.inpos.w333c.value}″/世紀)に、規則の半径の組の近点の率(c_輪 1)${fe(mr.dvarpi)}″/世紀を足すと割合 ${fe(mr.shift1[0].frac)}・上限の c_輪 ${fe(mr.cMaxFull)} では ${fe(mr.shiftMax[0].frac)}。〔第337便i〕の環で絞った円盤引きずり(1PN の ${J.t3.inpos.rot337i[1]}・${J.t3.inpos.rot337i[2]} 倍)の ${rng(mr.over337i)} 倍(換算の係数 ${fe(mr.k)} の分)。`,
  };
}
