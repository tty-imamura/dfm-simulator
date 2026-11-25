// 第353便v(原仮定者の回答(2026-11-25 —— 第151報)AN1045・統括の検証項目 R486):
// **正本 tests/out/recvscale-353v.json から PHYSICS〔第353便v〕の表と数の文を作る文書の lib**
// (QA docs.recvscale353v が節の表と逐語で照合する —— 表の数は有効数字 3 桁)。原文(言葉を変えずに引く)もここに持つ。
// ファイルを読まない・import しない。
export const DOC_VERSION = 'w353v-recvscaledoc-1';
const fe = (x) => (x === null || x === undefined || !Number.isFinite(x) ? '—' : x === 0 ? '0' : Number(x).toExponential(2));
const ff = (x, n) => (x === null || x === undefined || !Number.isFinite(x) ? '—' : Number(x).toFixed(n));
const f3 = (x) => (x === null || x === undefined || !Number.isFinite(x) ? '—' : (Math.abs(x) >= 1e-2 && Math.abs(x) < 1e3 ? Number(x.toPrecision(3)).toString() : fe(x)));
const NM = Object.freeze({ 'Mercury|Sun': '水星 ← 太陽', 'Venus|Sun': '金星 ← 太陽', 'Earth|Sun': '地球 ← 太陽', 'Mars|Sun': '火星 ← 太陽', 'Jupiter|Sun': '木星 ← 太陽', 'Saturn|Sun': '土星 ← 太陽',
  'Uranus|Sun': '天王星 ← 太陽', 'Neptune|Sun': '海王星 ← 太陽', 'Moon|Sun': '月 ← 太陽', 'Io|Sun': 'イオ ← 太陽', 'Pluto|Sun': '冥王星 ← 太陽', 'Moon|EarthHi': '月 ← 地球(傾き最大の位相)',
  'Moon|EarthLo': '月 ← 地球(傾き最小の位相)', 'Io|Jupiter': 'イオ ← 木星', 'Pluto|Charon': '冥王星 ← カロン', 'Charon|Pluto': 'カロン ← 冥王星', 'Sun|Planets': '太陽 ← 惑星の和(受け手の半径の口なし)' });
const BN = Object.freeze({ Mercury: '水星', Venus: '金星', Earth: '地球', Mars: '火星', Jupiter: '木星', Saturn: '土星', Uranus: '天王星', Neptune: '海王星', Moon: '月', Io: 'イオ', Pluto: '冥王星', Charon: 'カロン',
  Sun: '太陽', EarthHi: '地球' });
const rn = (r) => (r === null ? '規則の半径' : 'r ' + r);
const esc = (s) => String(s).replace(/\|/g, '/');

/** 原文(言葉を変えずに引く) */
export const ORIGINAL = Object.freeze([
  Object.freeze(['原仮定者の回答(2026-11-25 —— 第151報)', 'AN1045: 「規則の半径」。土星の環は、円盤引きずりが影響している。計算が合う方式を採用する。想定する基準は、引きずる側は「規則の半径と、扁平率」、引きずられる側は「観測半径と、構造の係数のノブ」']),
  Object.freeze(['原仮定者の回答(2026-11-25 —— 第151報)', 'AN1039: 角運動量の重み。計算が合う方式を採用する']),
  Object.freeze(['原仮定者の回答(2026-11-25 —— 第151報)', '向きと幾何: これを採用『主の成分を太陽の自転の分・背景を太陽系の基準軸の向きに置くと、太陽の 5〜6° の傾きは円錐になり、金星で 1% まで打ち消します。』']),
]);
export const READINGS = Object.freeze([
  '引きずられる側の「構造の係数のノブ」を、全部の受け手に同じ c_R で置く形(〔第353便c〕〔第353便j〕〔第353便p〕)に並べて、受け手ごとに c_R = r × c_R★(c_R★ = 自分の重みが主の源の重みと同じになる値)で置く形を数える。自由度は r の 1 つのまま。r は候補の表の走査(既定に置かない)',
  '「計算が合う方式」の材料として、金星の打ち消しとイオ・月の x(打ち消しの倍率 ÷ 金星の条件の値)を同じ r で並べる(方式を選ばない)',
  '採用の幾何(局所 (S)・背景 (N+)・基準軸 L)のまま、受け手の半径の置き方で金星の残りが 1〜2% の桁に留まる r の範囲を数える',
]);
export function originalTable() {
  return '| # | 出どころ | 原文(言葉を変えずに引く) | 読み(統括の読み —— 原文と分ける) |\n|---|---|---|---|\n'
    + ORIGINAL.map(([src, o], k) => `| ${k + 1} | ${src} | 「${esc(o)}」 | ${esc(READINGS[k])} |`).join('\n');
}

export function tablesOf(J) {
  const T = {}, cols0 = J.t1.cols.filter((c) => c.ob === null);
  { const S = J.pure.scenes, G = J.pure.gates;
    T.pure = '| 零試験・場面 | 値 | 門 |\n|---|---|---|\n' + [
      ['① c_R★ が〔第353便c〕の `cRStar`(二分)と同じ・閉じた形 (3/2)(m/M)(a/R_観測)と同じ・〔第353便c〕表 5 の 10 受け手(3 桁)・イオの円の道(〔第353便p〕の `moonWeights`)と同じ桁', `${S.stars.length} 受け手`, G.cRStar],
      ['② r を置かない列(規則の半径)が〔第353便p〕の `stdCancel`(rule・ob)と同じ(17 組 —— x・等大の残り・金星の条件での残り)', S.vsRule === 0 && S.vsOb === 0 ? '0' : '< 1e-9', G.rule353p],
      ['③ 金星の c_R 0.0128 に当たる r で、等大の残りが〔第353便p〕の `stdCancel`(field)と〔第353便c〕の `cancelOf` の 2 sin(φ/2)と同じ・金星の x 1', ff(J.pure.scenes.k.venusResid, 4), G.venus353c],
      ['④ 組の受け手の c_R が同じ値なら〔第353便p〕の `stdCancel`(field)と同じ倍率・残り(イオ・地球・月)', S.vsSame === 0 ? '0' : '< 1e-9', G.same353p],
      ['⑤ 0.98 の列: 規則の半径の k が〔第353便j〕の 8.22e11・金星の c_R 0.0128 の k が〔第353便j〕表 3 の 2% の端 7.21e5・受け手の行が〔第353便j〕の `sideRow` と同じ', `${fe(S.k.rule)}・${fe(S.k.edge)}`, G.k353j],
      ['⑥ 太陽の受け手は口なし(c_R★・c_R が null)', '真', G.sunNull],
      ['⑦ 小さい r で金星の φ が規則の半径の 0.7606° に近づく・r 10 で離れる', `${ff(S.phi.small, 4)}°・${ff(S.phi.rule, 4)}°・${ff(S.phi.big, 2)}°`, G.limits],
      ['⑧ 入力の拒否(r 0・負の r・受け手の名・扁平の名・u 0・r の型)', `${S.rejects.filter(Boolean).length}/${S.rejects.length}`, G.rejects],
    ].map(([x, b, g]) => `| ${x} | ${b} | ${g ? '真' : '偽'} |`).join('\n'); }
  T.t1x = '| 組(受け手 ← 源) | ' + cols0.map((c) => rn(c.r)).join(' | ') + ' |\n|---|' + cols0.map(() => '---').join('|') + '|\n'
    + Object.keys(cols0[0].x).map((k) => `| ${NM[k]} | ` + cols0.map((c) => f3(c.x[k])).join(' | ') + ' |').join('\n');
  T.t1s = '| σ | r | 金星の c_R | 金星の等大の残り | イオの x | イオの金星の条件での残り | 月 ← 地球の x | x が 0.9〜1.1 の組(金星を除く) | x が 0.5〜2 の組(金星を除く) |\n|---|---|---|---|---|---|---|---|---|\n'
    + J.t1.cols.map((c) => `| ${c.ob === null ? 'なし' : '(O2b)'} | ${rn(c.r)} | ${c.cRV === null ? '—' : f3(c.cRV)} | ${f3(c.venusRes)} | ${f3(c.io.x)} | ${f3(c.io.resAtUV)} | ${f3(c.moonX)} | ${c.bands[0].n}(${c.bands[0].keys.map((k) => NM[k]).join('・') || '—'}) | ${c.bands[1].n}(${c.bands[1].keys.map((k) => NM[k]).join('・') || '—'}) |`).join('\n');
  T.scan = '| σ | 点の数 | 金星 ≤ 2% かつイオの x 0.9〜1.1 の点 | イオの x の最小(r・金星の残り) | 金星の 2% の端の r | 月 ← 地球の x が 0.9〜1.1 の r(そのときの金星の残りの上端) |\n|---|---|---|---|---|---|\n'
    + J.scan.map((s) => `| ${s.ob === null ? 'なし' : '(O2b)'} | ${s.n} | ${s.nBoth} | ${f3(s.ioMin.x)}(r ${f3(s.ioMin.r)}・${f3(s.ioMin.venusRes)}) | ${f3(s.venusEdge2)} | ${s.moonBand ? `${f3(s.moonBand.rLo)}〜${f3(s.moonBand.rHi)}(${f3(s.moonBand.venusResHi)})` : '—'} |`).join('\n');
  T.limit = '| 組 | x(規則の半径) | x(r 1e-8) | 閉じた形 x(規則の半径)× wS_金星 ÷ wS_受け手 | φ の差 ° |\n|---|---|---|---|---|\n'
    + J.limit.map((r) => `| ${NM[r.key]} | ${f3(r.xRule)} | ${f3(r.xSmall)} | ${f3(r.closed)} | ${fe(r.dPhiDeg)} |`).join('\n');
  T.t2 = '| r | k(r) | 金星の残り | ' + J.t2.cols[0].rows.map((x) => BN[x.key] + ' 局所 ÷ 背景・合成と L の角').join(' | ') + ' |\n|---|---|---|' + J.t2.cols[0].rows.map(() => '---').join('|') + '|\n'
    + J.t2.cols.map((c) => `| ${rn(c.r)} | ${fe(c.k)} | ${f3(c.venusResid)} | ` + c.rows.map((x) => `${f3(x.locOverBg)}・${ff(x.omToAxisDeg, 1)}°${x.sameSense ? '' : ' ◆'}`).join(' | ') + ' |').join('\n');
  T.t3 = '| 受け手 ← 主の源 | c_R★ | m/M | a/R_観測 | 慣性モーメントの係数 C/MR²(文献の値・未照合) | (P-応) の率の倍 0.4/c | c_R★ ÷ C/MR² | 順位 c_R★ | 順位 C/MR² |\n|---|---|---|---|---|---|---|---|---|\n'
    + J.t3.rows.map((x) => `| ${BN[x.id]} ← ${BN[x.src]} | ${f3(x.cRStar)} | ${fe(x.mOverM)} | ${fe(x.aOverR)} | ${x.moi === null ? '—' : x.moi} | ${f3(x.rateMult)} | ${f3(x.ratio)} | ${x.rankStar ?? '—'} | ${x.rankMoi ?? '—'} |`).join('\n');
  return T;
}
/** 数の文(節に逐語) */
export function factsOf(J) {
  const c0 = (r) => J.t1.cols.find((c) => c.ob === null && c.r === r), c1 = (r) => J.t1.cols.find((c) => c.ob === 'lit' && c.r === r);
  const ioXs = J.t1.cols.filter((c) => c.ob === null && c.r !== null && c.r <= 1).map((c) => c.io.x), s0 = J.scan[0], s1 = J.scan[1], M = J.merc;
  const lim = (k) => J.limit.find((r) => r.key === k), T3 = J.t3, t2r = (r) => J.t2.cols.find((c) => c.r === r);
  return {
    t1: `r ≤ 1 では、イオ ← 木星の x は ${f3(Math.min(...ioXs))}〜${f3(Math.max(...ioXs))}(σ を置くと r 0.195 で ${f3(c1(0.195).io.x)})で、規則の半径の ${f3(c0(null).io.x)}(σ つき ${f3(c1(null).io.x)})に戻らない。金星の等大の残りは r 0.195 で ${f3(c0(0.195).venusRes)}・r 1 で ${f3(c0(1).venusRes)}・r 10 で ${f3(c0(10).venusRes)}。`,
    scan: `log10 r = −8〜1 の ${s0.n} 点で、金星の残り ≤ 2% とイオの x 0.9〜1.1 が同時に入る点は σ なし ${s0.nBoth}・σ つき ${s1.nBoth}。イオの x の最小は r ${f3(s0.ioMin.r)} の ${f3(s0.ioMin.x)}(σ つき ${f3(s1.ioMin.x)})。月 ← 地球の x は r ${f3(s0.moonBand.rLo)}〜${f3(s0.moonBand.rHi)} で 0.9〜1.1 に入る(金星の残り ${f3(s0.moonBand.venusResHi)} 以下)。`,
    limit: `r → 0 で、向きは規則の半径の列に戻る(φ の差 ${fe(Math.max(...J.limit.filter((r) => !/Moon|Pluto|Charon/.test(r.key)).map((r) => Math.abs(r.dPhiDeg))))}° 以下 —— 月・冥王星・カロンを除く)が、x は戻らない: x(r → 0)= x(規則の半径)× wS_金星 ÷ wS_受け手(イオ ← 木星 ${f3(lim('Io|Jupiter').xRule)} → ${f3(lim('Io|Jupiter').xSmall)}・月 ← 地球 ${f3(lim('Moon|EarthHi').xRule)} → ${f3(lim('Moon|EarthHi').xSmall)}・水星 ${f3(lim('Mercury|Sun').xRule)} → ${f3(lim('Mercury|Sun').xSmall)})。規則の半径では自分の重みが全部の受け手で同じ(3/(2 Y_K))で、r × c_R★ では自分の重み = 主の源の重み ÷ r だから。`,
    t2: `0.98 の列で金星を等大にする k は r 0.195 で ${fe(t2r(0.195).k)}・r 1 で ${fe(t2r(1).k)}。水星の局所 ÷ 背景は ${f3(t2r(0.195).rows.find((x) => x.key === 'Mercury').locOverBg)}・イオは ${f3(t2r(0.195).rows.find((x) => x.key === 'Io').locOverBg)}(r 0.195)で、水星とイオは r 10 まで回る向きが k 1 と替わる(◆)。水星の回る向きが k 1 と替わらない r の下限は ${M.r === null ? '—' : f3(M.r)}(そのときの金星の残り ${M.r === null ? '—' : f3(M.venusResid)})。`,
    t3: `c_R★ の閉じた形は (3/2)(m/M)(a/R_観測)(m 受け手の質量・M 主の源の質量・a 距離)。慣性モーメントの係数の在る ${T3.n} 受け手で、c_R★ は ${ff(T3.spanStarDec, 2)} 桁に広がり、C/MR² は ${ff(T3.spanMoi, 2)} 倍の内 —— 順位の相関 ${ff(T3.rho, 3)}(順位は${T3.sameOrder ? '同じ' : '同じでない'})・比 c_R★ ÷ C/MR² は ${ff(T3.spanRatioDec, 2)} 桁に広がる。`,
  };
}
