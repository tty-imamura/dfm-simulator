// 第353便z(原仮定者の回答(2026-11-25 —— 第151報)AN1045・AN1039・統括の検証項目 R490):
// **正本 tests/out/obpower-353z.json から PHYSICS〔第353便z〕の表と数の文を作る文書の lib**
// (QA docs.obpower353z が節の表と逐語で照合する —— 表の数は有効数字 3〜4 桁)。原文(言葉を変えずに引く)もここに持つ。
// ファイルを読まない・import しない。
export const DOC_VERSION = 'w353z-obpowerdoc-1';
const fe = (x) => (x === null || x === undefined || !Number.isFinite(x) ? '—' : x === 0 ? '0' : Number(x).toExponential(2));
const ff = (x, n) => (x === null || x === undefined || !Number.isFinite(x) ? '—' : Number(x).toFixed(n));
const f3 = (x) => (x === null || x === undefined || !Number.isFinite(x) ? '—' : (Math.abs(x) >= 1e-2 && Math.abs(x) < 1e3 ? Number(x.toPrecision(3)).toString() : fe(x)));
const f5 = (x) => (x === null || x === undefined || !Number.isFinite(x) ? '—' : Number(x.toPrecision(5)).toString());
const sg = (x) => (x === null || x === undefined || !Number.isFinite(x) ? '—' : (x >= 0 ? '+' : '−') + Math.abs(x).toFixed(4));
const esc = (s) => String(s).replace(/\|/g, '/');
const MN = Object.freeze({ io: 'イオ ← 木星', europa: 'エウロパ ← 木星', ganymede: 'ガニメデ ← 木星', callisto: 'カリスト ← 木星', titan: 'タイタン ← 土星' });
const RN = Object.freeze({ ringC: 'C 環', ringB: 'B 環', ringA: 'A 環' });
const nName = (n, k) => (k === 2 ? 'n★ ' + ff(n, 3) : 'n ' + n);

/** 原文(言葉を変えずに引く) */
export const ORIGINAL = Object.freeze([
  Object.freeze(['原仮定者の回答(2026-11-25 —— 第151報)', 'AN1045: 「規則の半径」。土星の環は、円盤引きずりが影響している。計算が合う方式を採用する。想定する基準は、引きずる側は「規則の半径と、扁平率」、引きずられる側は「観測半径と、構造の係数のノブ」']),
  Object.freeze(['原仮定者の回答(2026-11-25 —— 第151報)', 'AN1039: 角運動量の重み。計算が合う方式を採用する']),
]);
export const READINGS = Object.freeze([
  '引きずる側の「扁平率」の入れ方は、〔第353便d〕で数に出るのが「距離に依らない倍」だけと分かっている。その倍を (1 − f)^(−n/3) と書き、冪の指数 n を連続に振って、イオ ← 木星の x(打ち消しの倍率 ÷ 金星の条件の値)が 1 になる n(n★)・その入力の幅・n を作る読み替えの候補(いまの式の冪の勘定)を並べる。「計算が合う方式」の材料の表で、どの n を採るかは決めない',
  '基準軸は角運動量の重み L(主の列)。x は打ち消しの倍率の比で、背景の向きと基準軸に依らない —— n★ が基準軸で動かないことを表で示す材料に置く(残りは基準軸で動く)',
]);
export function originalTable() {
  return '| # | 出どころ | 原文(言葉を変えずに引く) | 読み(統括の読み —— 原文と分ける) |\n|---|---|---|---|\n'
    + ORIGINAL.map(([src, o], k) => `| ${k + 1} | ${src} | 「${o}」 | ${esc(READINGS[k])} |`).join('\n');
}

export function tablesOf(J) {
  const T = {}, t1 = J.t1, t2 = J.t2, t3 = J.t3;
  { const S = J.pure.scenes, G = J.pure.gates;
    T.pure = '| 零試験・場面 | 値 | 門 |\n|---|---|---|\n' + [
      ['① 統括の数え直し 4 の数(x 0.894142・m★ 1.11875・n★ 5.019・n 5 で 0.99958・n 3 で 0.95598・n 2 で 0.93491・太陽由来 ÷ 母天体由来 3.00e-3・(uV))', `${f5(S.x0)}・${f5(S.ms)}・${ff(S.ns, 3)}`, G.anchor4],
      ['② n 0・2・5 の x が〔第353便d〕の `obCancel`(obPar に (O2b) の仕様・σ_5 をそのまま渡した仕様・球)と同じ', `${f5(S.oc2)}・${f5(S.oc5)}`, G.obCancel353d],
      ['③ 太陽にも σ を掛けた n 2 の x が〔第353便p〕の表 1 の (ii) の列(イオ)と同じ・n 0 が (i) と同じ', `${f5(S.stII)}`, G.stdCancel353p],
      ['④ 入力を振らない内訳(〔第353便p〕の `rotP` で数え直す)が `localStd` の内訳と同じ', S.vsPert === 0 ? '0' : '< 1e-9', G.pertIdentity],
      ['⑤ (S) の冪の中央差が閉じた形(源の外の場 M R² ÷ (5 r³))と同じ(質量 1・半径 2・自転の率 1・規則の半径を質量に従わせて 3)', `${ff(S.Pw.a, 7)}・${ff(S.Pw.b, 7)}・${ff(S.Pw.c, 7)}・${ff(S.Pw.aTie, 7)}`, G.powers],
      ['⑥ 土星の環の率 ÷ 物差しの n 2 が〔第353便k〕の `diskStd` の O2b の列と同じ(B 環)', fe(S.rO2b), G.ring353k],
      ['⑦ 衛星の φ(母天体の赤道の円の道)が〔第353便l〕の表の数と同じ(3 桁)', ['europa', 'ganymede', 'callisto', 'titan'].map((k) => ff(S.phis[k], 2)).join('・'), G.moonPhi353l],
      ['⑧ 0.98 の列のイオの残り(換算の係数 0.98 ÷ uV を局所に掛ける)が金星の条件での残りと同じ(比)', f5(S.r98), G.col098],
      ['⑨ 入力の拒否(f 1・n 非数・母天体の項の無い組・c_R の無い (P-場)・入力の名・幅をほかの組で・衛星の名・扁平率の無い源)', `${S.rejects.filter(Boolean).length}/${S.rejects.length}`, G.rejects],
    ].map(([x, b, g]) => `| ${x} | ${b} | ${g ? '真' : '偽'} |`).join('\n'); }
  T.scan = '| n | σ_n(木星) | x | x − 1 | 金星の条件での残り | 等大の残り | φ ° |\n|---|---|---|---|---|---|---|\n'
    + t1.scan.map((r) => `| ${r.n} | ${ff(r.sigma, 5)} | ${ff(r.x, 5)} | ${sg(r.dx)} | ${ff(r.resAtUV, 4)} | ${ff(r.resEq, 5)} | ${ff(r.phiDeg, 4)} |`).join('\n');
  T.widths = '| 入力(リポジトリの数 —— 文献の値・未照合) | 字 | 最後の桁の 1 つ分(相対) | n★(+1) | n★(−1) | 動き(+1) | 動き(−1) |\n|---|---|---|---|---|---|---|\n'
    + t1.widths.map((w) => `| ${w.name} | ${w.lit} | ${fe(w.relUnit)} | ${ff(w.nPlus, 4)} | ${ff(w.nMinus, 4)} | ${sg(w.dnPlus)} | ${sg(w.dnMinus)} |`).join('\n')
    + `\n| 幅(1 つずつの最小〜最大・二乗和の根・和) | — | — | ${ff(t1.range.min, 4)} | ${ff(t1.range.max, 4)} | ±${ff(t1.range.rss, 4)} | ±${ff(t1.range.lin, 4)} |`;
  T.probes = '| n | 1 つずつの幅の内か | 二乗和の根の幅の内か | 和の幅の内か | (n − n★) ÷ 二乗和の根 |\n|---|---|---|---|---|\n'
    + t1.probes.map((p) => `| ${p.n} | ${p.inOne ? '内' : '外'} | ${p.inRss ? '内' : '外'} | ${p.inLin ? '内' : '外'} | ${ff(p.sigmas, 2)} |`).join('\n');
  T.places = '| 置き方 | n★ | n 5 の x | m★(x = 1 の倍)・その n |\n|---|---|---|---|\n'
    + t1.places.map((p) => `| ${p.name} | ${ff(p.nStar, 4)} | ${ff(p.x5, 5)} | ${p.mStar !== undefined ? `${ff(p.mStar, 4)}・${ff(p.nFromM, 1)}(区間 −20〜40 の外)` : '—'} |`).join('\n');
  { const P = t2.powers;
    T.powers = '| 量 | 中央差(1%) | 閉じた形 |\n|---|---|---|\n' + [
      ['源の質量 M の冪 a(源の半径は固定)', ff(P.a, 7), P.closed.a], ['源の半径 R の冪 b(質量は固定)', ff(P.b, 7), P.closed.b],
      ['源の自転の率 ω の冪 c', ff(P.c, 7), P.closed.c], ['規則の半径 = Y_k × 質量 に従わせたときの質量の冪', ff(P.aTie, 7), P.closed.aTie],
      ['源の重み ÷ 自分の重み(イオ・規則の半径 —— a が 1 から離れる分の大きさ)', fe(P.wSoverA0), '—'],
    ].map(([a, b, c]) => `| ${a} | ${b} | ${c} |`).join('\n'); }
  T.forms = '| 読み替えの候補 | 半径の冪 p・質量の冪 q・自転の率の冪 w(倍 (1 − f)^(−冪/3)) | n(閉じた形の勘定) | n(中央差の冪の勘定) | n(倍を掛けて数えた) | σ(木星) | イオの x |\n|---|---|---|---|---|---|---|\n'
    + t2.forms.map((x) => `| ${esc(x.name)} | ${x.nonPow ? '(1 − f) の冪で書けない(数で)' : `${x.p}・${x.q}・${x.w}${x.tie ? '(規則の半径が質量に従う)' : ''}`} | ${ff(x.nClosed, 3)} | ${ff(x.nCount, 4)} | ${ff(x.nNum, 4)} | ${ff(x.sigma, 5)} | ${ff(x.xIo, 5)} |`).join('\n');
  T.moons = '| 受け手 ← 源(母天体の赤道の円の道) | 母天体の f | 太陽由来 ÷ 母天体由来 | ' + t3.cols.map((n, k) => `x(${nName(n, k)})`).join(' | ') + ' | ' + t3.cols.map((n, k) => `金星の条件での残り(${nName(n, k)})`).join(' | ') + ' | x = 1 の倍 m★ | その n |\n|---|---|---|' + t3.cols.map(() => '---').join('|') + '|' + t3.cols.map(() => '---').join('|') + '|---|---|\n'
    + t3.moons.map((m) => `| ${MN[m.key]} | ${m.f} | ${fe(m.sunOverPar)} | ` + m.cells.map((c) => f3(c.x)).join(' | ') + ' | ' + m.cells.map((c) => f3(c.resAtUV)).join(' | ') + ` | ${f3(m.mStar)} | ${ff(m.nFromM, 1)} |`).join('\n');
  T.others = '| 題 | 量 | ' + t3.cols.map((n, k) => nName(n, k)).join(' | ') + ' |\n|---|---|' + t3.cols.map(() => '---').join('|') + '|\n' + [
    ...t3.rings.map((r) => [`土星の環 ${RN[r.key]}(〔第353便k〕の主の列 —— 球で ${fe(r.yard0)})`, '率 ÷ 物差し(σ_n(土星))', r.cells.map((c) => `${fe(c.yard)}(${ff(c.sigma, 4)})`)]),
    ['公転面の集まり(〔第353便k〕の `planeStd` —— 地球・規則の半径の受け手)', '寄る率の物差しの比(σ_n(太陽))', t3.plane.map((p) => `${fe(p.v)}(${ff(p.sigma, 6)})`)],
    ['金星(太陽由来に σ_n(太陽)・金星の条件の倍率は球のまま)', '金星の条件での残り(動き)', t3.venus.map((v) => `${ff(v.res, 6)}(${fe(v.dRes)})`)],
    ['0.98 の列のイオ(背景の倍率 0.98・換算の係数 0.98 ÷ uV)', '残り(換算の係数)', t3.io098.map((r) => `${ff(r.res, 4)}(${fe(r.k98)})`)],
  ].map(([a, b, c]) => `| ${a} | ${b} | ${c.join(' | ')} |`).join('\n');
  return T;
}
/** 数の文(節に逐語) */
export function factsOf(J) {
  const t1 = J.t1, t2 = J.t2, t3 = J.t3, r = (n) => t1.scan.find((x) => x.n === n), w = (id) => t1.widths.find((x) => x.id === id), fm = (id) => t2.forms.find((x) => x.id === id), m = (k) => t3.moons.find((x) => x.key === k);
  return {
    scan: `イオ ← 木星の x は n 0 で ${ff(r(0).x, 5)}・n 2 で ${ff(r(2).x, 5)}・n 3 で ${ff(r(3).x, 5)}・n 5 で ${ff(r(5).x, 5)}・n 6 で ${ff(r(6).x, 5)}。x = 1 の n★ は ${ff(t1.base.nStar, 4)}(母天体由来の倍 m★ ${ff(t1.base.mStar, 5)})。n★ の近くで x が 1% 動くと n★ は約 ${ff(t1.gain / 100, 2)} 動く(n★ は x の 1 つの数の言い換え)。`,
    width: `入力 7 つを最後の桁 ±1 で 1 つずつ振ると、n★ は ${ff(t1.range.min, 3)}〜${ff(t1.range.max, 3)}(一番大きく動くのは木星の質量の字 ${w('MJ').lit} —— ${sg(w('MJ').dnPlus)}・${sg(w('MJ').dnMinus)}・次はイオの道の半径)。二乗和の根の幅は ±${ff(t1.range.rss, 3)}。n 5 は幅の内(${ff(t1.probes.find((p) => p.n === 5).sigmas, 2)} 幅)・n 4.5 と 5.5 は外(${ff(t1.probes.find((p) => p.n === 4.5).sigmas, 1)}・${ff(t1.probes.find((p) => p.n === 5.5).sigmas, 1)} 幅)。背景の向き・基準軸・(P-応) では n★ は動かず、太陽にも σ を掛けると ${ff(t1.places.find((p) => p.id === 'sun').nStar, 4)}。`,
    forms: `(S) の大きさは源の質量の 1 乗・源の半径の 2 乗・源の自転の率の 1 乗(中央差 ${ff(t2.powers.a, 6)}・${ff(t2.powers.b, 6)}・${ff(t2.powers.c, 6)})。この冪の勘定で n 5 になる読み替えは ${t2.hits5.length} つ(${t2.hits5.map((id) => fm(id).name.split(' ')[0]).join('・')} —— 半径を赤道の半径に、質量を赤道の半径の同じ密度の球の分に読む形と、同じ量を慣性の量で言い換えた形)で、そのときのイオの x は ${ff(fm('ha').xIo, 5)}。(イ) (O2b) は n ${ff(fm('i').nClosed, 0)}・(ホ) 軸の比を 1 つ掛ける形と (ヘ) は n 3・(ロ) は n 6・(ト) は n 9。`,
    others: `同じ n をほかの衛星に掛けても x は 1 に届かない(n 5 でエウロパ ${f3(m('europa').cells[1].x)}・ガニメデ ${f3(m('ganymede').cells[1].x)}・カリスト ${f3(m('callisto').cells[1].x)}・タイタン ${f3(m('titan').cells[1].x)})—— x = 1 に要る n はエウロパ ${ff(m('europa').nFromM, 0)}・タイタン ${ff(m('titan').nFromM, 0)}(タイタン ← 土星は 2 組目の照合にならない)。土星の環の率 ÷ 物差しは n 5 で球の ${ff(t3.rings[1].cells[1].sigma, 4)} 倍(B 環 ${fe(t3.rings[1].cells[1].yard)})・金星の残りの動きは ${fe(t3.venus[1].dRes)}・公転面の集まりは ${ff(t3.plane[1].sigma, 6)} 倍。母天体の赤道の円の道で数えたイオの n★ は ${ff(t3.ioPairVsCirc.circ, 4)}(実在の組 ${ff(t3.ioPairVsCirc.pair, 4)})。`,
  };
}
