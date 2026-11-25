// 第353便zi(原仮定者の回答(2026-11-25 —— 第151報)「向きと幾何」・AN1045・AN1039・統括の検証項目 R498):
// **正本 tests/out/eqthird-353zi.json から PHYSICS〔第353便zi〕の表と数の文を作る文書の lib**
// (QA docs.eqthird353zi が節の表と逐語で照合する —— 表の数は有効数字 3〜5 桁)。原文(言葉を変えずに引く)もここに持つ。
// ファイルを読まない・import しない。
export const DOC_VERSION = 'w353zi-eqthirddoc-1';
const ok = (x) => !(x === null || x === undefined || !Number.isFinite(x));
const fe = (x, k = 2) => (!ok(x) ? '—' : x === 0 ? '0' : Number(x).toExponential(k));
const ff = (x, n) => (!ok(x) ? '—' : Number(x).toFixed(n));
const f3 = (x) => (!ok(x) ? '—' : (Math.abs(x) >= 1e-2 && Math.abs(x) < 1e3 ? Number(x.toPrecision(3)).toString() : fe(x)));
const esc = (s) => String(s).replace(/\|/g, '/');
const yn = (b) => (b ? '内' : '外');
const HN = Object.freeze({ Jupiter: '木星', Saturn: '土星', Earth: '地球', Mars: '火星', Uranus: '天王星', Neptune: '海王星', Pluto: '冥王星', Charon: 'カロン' });
const NN = Object.freeze({ 0: '倍なし', 2: '(1 − f)^(−2/3)', 5: '(1 − f)^(−5/3)' });
const PAIRN = Object.freeze({ 'Jupiter>io': '木星 → イオの道', 'Saturn>satCD': '土星 → カッシーニの間隙', 'Pluto>Charon:sep': '冥王星 → カロンの道(2 天体の距離)', 'Charon>Pluto:bary': 'カロン → 冥王星の道(重心のまわり)',
  'Charon>Pluto:sep': 'カロン → 冥王星(2 天体の距離)', 'Earth>moon': '地球 → 月の道', 'Mars>phobos': '火星 → フォボスの道', 'Mars>deimos': '火星 → ダイモスの道', 'Uranus>uraEps': '天王星 → ε 環', 'Neptune>none': '海王星(衛星と環の半径の行が無い —— 数なし)' });
const BANDN = Object.freeze({ ringD: 'D 環', ringC: 'C 環', ringB: 'B 環', ringCD: 'カッシーニの間隙', ringA: 'A 環', ringF: 'F 環' });
const PLN = Object.freeze({ rule: '規則の半径(主の照合の列)', 'field-1e-3': '(P-場) 全部同じ c_R 1e-3', 'field-0.0128': '(P-場) 全部同じ c_R 0.0128', 'star-0.195': 'c_R★ の 0.195 倍(〔第353便v〕)', 'star-1': 'c_R★ の 1 倍',
  'mass-1': '質量に比例 C0 ÷ Y_k 1(〔第353便zb〕)', 'mass-1e5': '質量に比例 C0 ÷ Y_k 1e5', 'mass-5.99e5': '質量に比例 C0 ÷ Y_k 5.99e5', 'resp-1': '(P-応) c_R 1(場は規則の半径)' });
const SN = Object.freeze({ io: 'イオ', satCD: 'カッシーニの間隙', satA: 'A 環', satB: 'B 環' });

/** 原文(言葉を変えずに引く) */
export const ORIGINAL = Object.freeze([
  Object.freeze(['原仮定者の回答(2026-11-25 —— 第151報)', '向きと幾何: これを採用『主の成分を太陽の自転の分・背景を太陽系の基準軸の向きに置くと、太陽の 5〜6° の傾きは円錐になり、金星で 1% まで打ち消します。』']),
  Object.freeze(['原仮定者の回答(2026-11-25 —— 第151報)', 'AN1045: 「規則の半径」。土星の環は、円盤引きずりが影響している。計算が合う方式を採用する。想定する基準は、引きずる側は「規則の半径と、扁平率」、引きずられる側は「観測半径と、構造の係数のノブ」']),
  Object.freeze(['原仮定者の回答(2026-11-25 —— 第151報)', 'AN1039: 角運動量の重み。計算が合う方式を採用する']),
]);
export const READINGS = Object.freeze([
  '主の列は局所 = 源の自転の分 (S)・背景 = (N+)。金星の局所の項の大きさを 1 つの物差しに置き、局所の項が同じ大きさになる半径 a★(等大の半径 ——〔第353便zg〕)を、3 組目の母天体と、受け手の置き方を替えて数える',
  '引きずる側は規則の半径と扁平率(扁平の倍の入れ方は候補のまま 3 通り —— 冥王星・カロンは扁平率がリポジトリに無いので倍なし)。引きずられる側は観測半径 × 構造の係数のノブ —— 本節の表 3 で置き方 9 を並べる(主の照合の列は〔第353便zg〕と同じ規則の半径)。土星の環は円盤引きずりの題 —— 本節の環の行は軸引きずりの a★ を環の区分の半径で読んだ照合の表',
  '基準軸は角運動量の重み L(主の列)。a★ は大きさの比で決まり、基準軸と背景の向きに依らない',
]);
export function originalTable() {
  return '| # | 出どころ | 原文(言葉を変えずに引く) | 読み(統括の読み —— 原文と分ける) |\n|---|---|---|---|\n'
    + ORIGINAL.map(([src, o], k) => `| ${k + 1} | ${src} | 「${o}」 | ${esc(READINGS[k])} |`).join('\n');
}

export function tablesOf(J) {
  const T = {}, t1 = J.t1, t2 = J.t2, t3 = J.t3, t4 = J.t4;
  { const S = J.pure.scenes, G = J.pure.gates;
    T.pure = '| 零試験・場面 | 値 | 門 |\n|---|---|---|\n' + [
      ['① 規則の半径の内訳(太陽由来・母天体由来・金星)が〔第353便zg〕の `partsAt` と同じ(木星のイオ・土星のカッシーニの間隙・冥王星 2e7 m)', S.vsZg < 1e-12 ? '< 1e-12' : fe(S.vsZg), G.partsZg],
      ['② a★ が〔第353便zg〕の `aStar` と同じ(木星・土星 倍なし・冥王星 —— 区間を観測の半径の 1e-7 倍まで下へ)', `${fe(S.jup0, 4)}・${fe(S.sat0, 4)}・${fe(S.pl, 4)}`, G.aStarZg],
      ['③ 受け手の質量を 1e3 kg からイオの質量にしても規則の半径の x は同じ・置き方「質量に比例」の C0 ÷ Y_k 1 は規則の半径と同じ a★', ff(S.xm, 6), G.recvMass],
      ['④ c_R★ が〔第353便p〕の `moonWeights`(イオ)・〔第353便c〕の `cRStar`(金星)と同じ', `${fe(S.csIo, 4)}・${fe(S.csV, 4)}`, G.cRStar],
      ['⑤ (P-場) c_R 0.0128 のイオの道の x が〔第353便p〕の `stdCancel` field の x と 5 桁で同じ(他の源の重みを分母に入れる所の作りの差 —— 相対 2e-6)', `${ff(S.fld, 5)}・${ff(S.fldP, 5)}`, G.field353p],
      ['⑥ 冥王星とカロンの距離が〔第351便c〕の `pairInput`(受け手 カロン・源 冥王星)と同じ', fe(S.sep, 5), G.sep351c],
      ['⑦ 入力の拒否(a ≤ 0・m ≤ 0・行の無い源・組の名・帯の名・受け手の名・c_R ≤ 0・置き方の名)', `${S.rejects.filter(Boolean).length}/${S.rejects.length}`, G.rejects],
    ].map(([x, b, g]) => `| ${x} | ${b} | ${g ? '真' : '偽'} |`).join('\n'); }
  T.pairs = '| 組(源 → 照合の半径) | 扁平の倍 | a★(m) | ÷ 源の観測の半径 | 母天体の内か | 照合の半径(m) | 照合の半径 ÷ a★ | x(照合の半径) | ±5% | ±50% |\n|---|---|---|---|---|---|---|---|---|---|\n'
    + t1.rows.map((r) => `| ${PAIRN[r.pair] || r.pair} | ${NN[r.n]} | ${fe(r.aStar, 4)} | ${f3(r.overRo)} | ${r.inside ? '母天体の内' : '外'} | ${fe(r.r, 4)} | ${f3(r.ratio)} | ${f3(r.x)} | ${r.r === null ? '—' : yn(r.in5)} | ${r.r === null ? '—' : yn(r.in50)} |`).join('\n');
  T.inband = '| 扁平の倍 | 木星の a★(m) | イオの道との差 ÷ ガリレオ衛星の道の間隔(イオ〜エウロパ) | 木星の主環の半径 ÷ a★ | 土星の a★(m) | 入る環の区分(〔第338便d〕の内縁〜外縁) | 区分の中の位置(対数 —— 内縁 0・外縁 1) |\n|---|---|---|---|---|---|---|\n'
    + t2.inBand.map((b) => `| ${NN[b.n]} | ${fe(b.aJ, 4)} | ${ff(b.qIo, 4)} | ${ff(b.jupMainRatio, 3)} | ${fe(b.aS, 4)} | ${b.satBand ? BANDN[b.satBand] : 'どの区分にも入らない'} | ${ff(b.satPos, 3)} |`).join('\n');
  T.prob = '| 範囲(観測の半径の倍) | 木星の帯 | 土星の帯 | 木星の見込み | 土星の見込み | 両方(積) | a★ が帯に入るか —— 木星(倍なし・n 2・n 5) | 土星(倍なし・n 2・n 5) |\n|---|---|---|---|---|---|---|---|\n'
    + t2.probs.map((p) => `| ${p.range[0]}〜${p.range[1]} | ${p.jup} | ${p.sat} | ${ff(p.pJ, 4)} | ${ff(p.pS, 4)} | ${ff(p.both, 4)} | ${p.hits.map((h) => yn(h.jup)).join('・')} | ${p.hits.map((h) => yn(h.sat)).join('・')} |`).join('\n');
  T.recv = '| 受け手の半径の置き方(金星も同じ) | 自分の重みが全部の受け手で同じか | イオの c_R | 金星の c_R | イオ ← 木星の a★(m) | イオの道 ÷ a★ | イオの x | 環の粒子 ← 土星の a★(m) | カッシーニの間隙 ÷ a★ | 粒子の x | 2 組が ±5% に残るか |\n|---|---|---|---|---|---|---|---|---|---|---|\n'
    + t3.rows.map((r) => `| ${PLN[r.id]} | ${r.sameSelf ? '同じ' : '替わる'} | ${fe(r.io.cRr)} | ${fe(r.cRv)} | ${fe(r.io.aStar, 4)} | ${ff(r.io.ratio, 3)} | ${f3(r.io.x)} | ${fe(r.ring.aStar, 4)} | ${ff(r.ring.ratio, 3)} | ${f3(r.ring.x)} | ${r.ioIn5 && r.ringIn5 ? '残る' : r.ioIn5 || r.ringIn5 ? '片方' : '残らない'} |`).join('\n');
  T.fac = '| 源 | 金星の道の半径(m) | 質量の比 M ÷ M_太陽 | 自転の率の比の 1/3 乗 | 幾何の因子の 1/3 乗 | 太陽由来の分の因子 | 積(m) | 二分の a★(m) |\n|---|---|---|---|---|---|---|---|\n'
    + t4.fac.map((f) => `| ${HN[f.src]} | ${fe(f.aV, 5)} | ${fe(f.massRatio, 4)} | ${ff(f.spinCbrt, 4)} | ${ff(f.geoCbrt, 6)} | ${ff(f.sunFac, 6)} | ${fe(f.prod, 5)} | ${fe(f.aStar, 5)} |`).join('\n');
  T.need = '| 源 → 構造 | 扁平率 f | 構造の半径 ÷ a★(倍なし) | 構造を a★ に置く冪 n(二分) | 冪の見当 −9 ln(比) ÷ ln(1 − f) |\n|---|---|---|---|---|\n'
    + t4.need.map((q) => `| ${HN[q.src]} → ${SN[q.key]} | ${q.src === 'Jupiter' ? '0.06487' : '0.09796'} | ${ff(q.ratio0, 4)} | ${ff(q.n, 3)} | ${ff(q.nApprox, 3)} |`).join('\n')
    + '\n' + t4.cross.map((c) => `| その n(${ff(c.n, 3)})での${HN[c.other]} → ${SN[c.otherKey]} | — | ${ff(c.otherRatio, 4)}(n ${ff(c.n, 3)} の a★ で) | — | — |`).join('\n');
  return T;
}
/** 数の文(節に逐語) */
export function factsOf(J) {
  const t1 = J.t1, t2 = J.t2, t3 = J.t3, t4 = J.t4, R = (k) => t1.rows.find((r) => r.pair === k), rec = (id) => t3.rows.find((r) => r.id === id);
  const need = (k) => t4.need.find((q) => q.key === k), pr = (w, g0) => t2.probs.find((p) => p.way === w && p.range[0] === 1 && p.range[1] === g0);
  const rr = (id, s) => ff(rec(id)[s].ratio, 3);
  return {
    third: `冥王星を源にした a★ は ${fe(R('Pluto>Charon:sep').aStar, 3)} m(観測の半径の ${fe(R('Pluto>Charon:sep').overRo)} 倍 —— 母天体の内)で、カロンの道 ÷ a★ は ${fe(R('Pluto>Charon:sep').ratio, 3)}。カロンを源にした a★ は ${fe(R('Charon>Pluto:bary').aStar, 3)} m で、冥王星の重心のまわりの道 ÷ a★ は ${fe(R('Charon>Pluto:bary').ratio, 3)}。地球 → 月 ${f3(R('Earth>moon').ratio)}・火星 → フォボス ${f3(R('Mars>phobos').ratio)}・ダイモス ${f3(R('Mars>deimos').ratio)}・天王星 → ε 環 ${f3(R('Uranus>uraEps').ratio)}。木星と土星のほかで ±5% に入る組は ${t1.third}・±50% に入る組は ${t1.third50}(海王星は数なし)—— この表の内に 3 組目は無い。`,
    band: `土星の a★ は、扁平の倍なしと (1 − f)^(−2/3) でカッシーニの間隙の区分の内(対数の位置 ${ff(t2.inBand[0].satPos, 2)}・${ff(t2.inBand[1].satPos, 2)})、(1 − f)^(−5/3) で A 環の区分の内(${ff(t2.inBand[2].satPos, 2)})。木星の a★ とイオの道の差は、ガリレオ衛星の道の間隔(イオ〜エウロパ)の ${t2.inBand.map((b) => ff(b.qIo * 100, 2) + '%').join('・')}。`,
    prob: `見込み(両方 —— 概算)は、置き方 4 と範囲 2 で ${ff(t2.bothMin, 4)}〜${ff(t2.bothMax, 4)}(代表の半径 ±5% で ${ff(pr('rep5', 30).both, 4)}・${ff(pr('rep5', 10).both, 4)}、環の区分のどれか × ガリレオ衛星の道 ± 間隔の 10% で ${ff(pr('bandAny-q10', 30).both, 4)}・${ff(pr('bandAny-q10', 10).both, 4)}、名を決めた帯〔カッシーニの間隙 × イオ ± 間隔の 5%〕で ${ff(pr('bandNamed-q5', 30).both, 4)}・${ff(pr('bandNamed-q5', 10).both, 4)} —— 範囲 1〜30 倍・1〜10 倍)。置き方で 2 桁動く。`,
    recv: `受け手の半径の置き方を替えると、2 組が ±5% に残るのは ${t3.both.map((id) => PLN[id]).join('・')}(自分の重みが全部の受け手で同じ置き方)で、残らないのは ${t3.neither.map((id) => PLN[id]).join('・')}。(P-場) c_R 0.0128 ではイオの道 ÷ a★ ${rr('field-0.0128', 'io')}・カッシーニの間隙 ÷ a★ ${rr('field-0.0128', 'ring')}、c_R★ の 1 倍では ${rr('star-1', 'io')}・${rr('star-1', 'ring')}、質量に比例 C0 ÷ Y_k 5.99e5 では ${rr('mass-5.99e5', 'io')}・${rr('mass-5.99e5', 'ring')}。(P-応) の x は規則の半径と同じで、率の倍の比(イオ ÷ 金星 ——〔第353便c〕の観測の半径の物差し)は ${ff(rec('resp-1').respIo, 3)}(環の粒子は係数が無い —— 数なし)。`,
    need: `構造を a★ に置く扁平の倍の冪は、木星 → イオ ${ff(need('io').n, 3)}・土星 → カッシーニの間隙 ${ff(need('satCD').n, 3)}(A 環 ${ff(need('satA').n, 2)}・B 環 ${ff(need('satB').n, 2)})。冪 ${ff(t4.cross[0].n, 2)} ではカッシーニの間隙 ÷ a★ は ${ff(t4.cross[0].otherRatio, 3)}、冪 ${ff(t4.cross[1].n, 2)} ではイオの道 ÷ a★ は ${ff(t4.cross[1].otherRatio, 3)} —— 同じ冪で 2 組が同時に 1 にはならない。`,
  };
}
