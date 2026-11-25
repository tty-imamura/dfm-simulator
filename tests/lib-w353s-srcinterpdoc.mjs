// 第353便s(原仮定者の回答(2026-11-25 —— 第151報)AN1045・統括の検証項目 R483):
// **正本 tests/out/srcinterp-353s.json から PHYSICS〔第353便s〕の表と数の文を作る文書の lib**
// (QA docs.srcinterp353s が節の表と逐語で照合する —— 表の数は有効数字 3 桁)。原文(言葉を変えずに引く)もここに持つ。
// ファイルを読まない・import しない。
export const DOC_VERSION = 'w353s-srcinterpdoc-1';
const ok = (x) => x !== null && x !== undefined && Number.isFinite(x);
const fe = (x) => (!ok(x) ? '—' : x === 0 ? '0' : Number(x).toExponential(2));
const ff = (x, n) => (!ok(x) ? '—' : Number(x).toFixed(n));
const f3 = (x) => (!ok(x) ? '—' : (Math.abs(x) >= 1e-2 && Math.abs(x) < 1e3 ? Number(x.toPrecision(3)).toString() : fe(x)));
const fl = (x, floor) => (!ok(x) ? '—' : x < floor ? '< ' + Number(floor).toExponential(0) : fe(x));
const ft = (t) => (!ok(t) ? '—' : Math.abs(t) >= 0.1 ? Number(t).toFixed(3) : Number(t).toPrecision(3));
const esc = (s) => String(s).replace(/\|/g, '/');
const SRC = Object.freeze({ Sun: '太陽', Jupiter: '木星', Saturn: '土星', Earth: '地球' });
const RN = Object.freeze({ 'ring-ringD': '(i) 土星の環 D', 'ring-ringC': '(i) 土星の環 C', 'ring-ringB': '(i) 土星の環 B', 'ring-ringA': '(i) 土星の環 A', 'ring-ringF': '(i) 土星の環 F',
  'venus-rule': '(ii) 0.98 の金星(受け手 規則の半径)', 'io-same': '(iii) イオの x(太陽と木星に同じ t)', 'earth-same': '(iv) 地球の項 ÷ 金星の残り(地球と太陽に同じ t)',
  'venus-cR0.0128': '(ii) 0.98 の金星(受け手 c_R 0.0128)〔比べる行〕', 'venus-cR1': '(ii) 0.98 の金星(受け手 c_R 1)〔比べる行〕', 'io-J': '(iii) イオの x(木星だけ t・太陽は規則の半径)〔比べる行〕',
  'io-S': '(iii) イオの x(太陽だけ t・木星は規則の半径)〔比べる行〕', 'earth-E': '(iv) 地球の項 ÷ 金星の残り(地球だけ t・太陽は規則の半径)〔比べる行〕', 'earth-S': '(iv) 地球の項 ÷ 金星の残り(太陽だけ t・地球は規則の半径)〔比べる行〕' });
const KN = Object.freeze({ inside: '格子の内(二分)', extrap: '外挿(t > 1 —— 数えた値ではない)', below: '外挿(t < 0)', none: '届かない(t で下がる)' });
const cRn = (c) => (c === null ? '規則の半径' : 'c_R ' + c);
const vary = (v) => v.split('・').map((s) => SRC[s]).join('・');

/** 原文(言葉を変えずに引く) */
export const ORIGINAL = Object.freeze([
  Object.freeze(['原仮定者の回答(2026-11-25 —— 第151報)', 'AN1045: 「規則の半径」。土星の環は、円盤引きずりが影響している。計算が合う方式を採用する。想定する基準は、引きずる側は「規則の半径と、扁平率」、引きずられる側は「観測半径と、構造の係数のノブ」']),
]);
export const READINGS = Object.freeze([
  '引きずる側の半径を〔第352便k〕の幾何の補間 R_源 = R_規則^(1 − t) × R_観測^t で振り(t 0 = 規則の半径 = 回答の基準・t 1 = 観測の半径 = 比べる列)、「計算が合う方式」の材料として、4 つの題の量が 1 になる t を並べる。題ごとの t がそろえば「源の半径の読み」の 1 つの候補・そろわなければ源ごとに違う半径が要る、という読み分けの表(どちらを採るかは決めない)',
]);
export function originalTable() {
  return '| # | 出どころ | 原文(言葉を変えずに引く) | 読み(統括の読み —— 原文と分ける) |\n|---|---|---|---|\n'
    + ORIGINAL.map(([src, o], k) => `| ${k + 1} | ${src} | 「${o}」 | ${esc(READINGS[k])} |`).join('\n');
}

export function tablesOf(J) {
  const T = {};
  { const S = J.pure.scenes, G = J.pure.gates;
    T.pure = '| 零試験・場面 | 値 | 門 |\n|---|---|---|\n' + [
      ['① 環: t 0・1 が〔第353便k〕の `diskStd`(規則・観測・(O0))と同じ(5 区分)と、t 0 の率 ÷ 物差しの最小・最大', `${fe(Math.min(...S.ring.map((r) => r.y0)))}〜${fe(Math.max(...S.ring.map((r) => r.y0)))}`, G.ring353k],
      ['② 金星: 等大の倍率 ÷ k が〔第352便s〕の `uVt` と同じ(t 0・0.5・1)・0.98 の k が〔第353便j〕の `kFor`(規則の半径・(P-場) c_R 1)と同じ', `k ${fe(S.venus.kR)}`, G.venus352s353j],
      ['③ イオ: 局所が〔第353便d〕の `obSatParts` と同じ・x が `obCancel` と同じ(t 0・0.5・1)', `${f3(S.io[0].x)}・${f3(S.io[1].x)}・${fe(S.io[2].x)}`, G.io353d],
      ['④ 地球: 地球の項 ÷ 金星の残りが〔第353便l〕の `ratioOf` と同じ((地球, 太陽) = (0, 0)・(1, 0)・(1, 1))', `${fe(S.earth[0].r)}・${fe(S.earth[1].r)}・${fe(S.earth[2].r)}`, G.earth353l],
      ['⑤ 共通の点検の数(統括の数え直し 3): 基準軸 L・(uV)・金星の φ(規則の半径・c_R 1)', `${S.L.map((v) => v.toFixed(6)).join(', ')}・${Number(S.uV).toPrecision(6)}・${ff(S.venus.phiR, 4)}°・${ff(S.venus.phi1, 2)}°`, G.common],
      ['⑥ 半径の外挿の式が t ≤ 1 で `srcRadius` と同じ・候補の半径の t の式が逆', '真', G.radius],
      ['⑦ 4 つの題の量は t の格子で増える', '真', G.monotone],
      ['⑧ 二分と外挿(既知の関数で t 0.3 と 1.6)', `${ff(S.sv.t, 6)}・${ff(S.sx.t, 6)}`, G.solver],
      ['⑨ 入力の拒否(題の名・t 1.2・t −0.1・負の c_R・半径の t 1.5・源の名・t 2・NaN)', `${S.rejects.filter(Boolean).length}/${S.rejects.length}`, G.rejects],
    ].map(([x, b, g]) => `| ${x} | ${b} | ${g ? '真' : '偽'} |`).join('\n'); }
  T.t1 = '| 題(主の行を先頭に) | 振る源 | 量(t 0) | 量(t 0.5) | 量(t 1) | 傾き(桁 ÷ t) | 量が 1 になる t | 種類 | その半径 ÷ 規則の半径 | その半径 ÷ 観測の半径 |\n|---|---|---|---|---|---|---|---|---|---|\n'
    + J.t1.rows.map((r) => `| ${RN[r.id]} | ${vary(r.vary)} | ${f3(r.q0)} | ${f3(r.qHalf)} | ${f3(r.q1)} | ${f3(r.slopeMin)}${Math.abs(r.slopeMax - r.slopeMin) > 0.005 * Math.abs(r.slopeMin) ? '〜' + f3(r.slopeMax) : ''} | ${ft(r.tStar)} | ${KN[r.kind]} | ${f3(r.overRule)} | ${f3(r.overObs)} |`).join('\n');
  T.k = '| 受け手 | 0.98 で金星を等大にする k(t 0) | 同(t 1) | k = 1 の t |\n|---|---|---|---|\n'
    + J.t1.rows.filter((r) => r.topic === 'venus').map((r) => `| ${({ 'venus-rule': '規則の半径', 'venus-cR0.0128': 'c_R 0.0128', 'venus-cR1': 'c_R 1' })[r.id]} | ${f3(r.k0)} | ${f3(r.k1)} | ${ft(r.tStar)}(${r.kind === 'inside' ? '格子の内' : '外挿'}) |`).join('\n');
  { const s = J.t1.spread;
    T.spread = '| 量 | 値 |\n|---|---|\n' + [
      ['主の行の数・その内で格子の内に在る行', `${s.nMain}・${s.nInside}`],
      ['主の行の「合う t」の最小・最大(外挿を含む)・最大 ÷ 最小', `${ft(s.tMin)}・${ft(s.tMax)}・${f3(s.ratio)}`],
      ['主の行のうち格子の内の t の最小・最大', `${ft(s.tInMin)}・${ft(s.tInMax)}`],
    ].map(([a, b]) => `| ${a} | ${b} |`).join('\n'); }
  T.t2src = '| 源 | 規則の半径 m | 観測の半径 m | 規則 ÷ 観測 | 扁平率 f(文献の値・未照合) | 質量 kg | 自転の率 rad/s | q = ω² R_観測³ ÷ GM | 同期の半径 m |\n|---|---|---|---|---|---|---|---|---|\n'
    + J.t2.map((s) => `| ${SRC[s.src]} | ${f3(s.Rrule)} | ${fe(s.Robs)} | ${fe(s.ruleOverObs)} | ${f3(s.f)} | ${fe(s.M)} | ${fe(s.w)} | ${f3(s.qRot)} | ${fe(s.rSync)} |`).join('\n');
  T.t2t = '| 源 | 題に要る t(他の源は規則の半径・行) | (A) の t(半径 ÷ 規則) | (B) の t(半径 ÷ 規則) | (C) の t(半径 ÷ 規則) |\n|---|---|---|---|---|\n'
    + J.t2.map((s) => `| ${SRC[s.src]} | ${s.need.map((n) => `${ft(n.tStar)}${n.kind === 'extrap' ? '(外挿)' : ''}〔${RN[n.id].replace(/〔比べる行〕/, '')}〕`).join('・')} | ` + s.cands.map((c) => `${ft(c.t)}(${f3(c.overRule)})`).join(' | ') + ' |').join('\n');
  T.t3v = '| 受け手 | φ(t 0)° | φ の動きの最大(t 0〜1)° | 等大の残り 2 sin(φ/2)(t 0) | 残りの相対の動きの最大 | abs(S) の倍(t 1 ÷ t 0) | 自分の重み ÷ 源の重み |\n|---|---|---|---|---|---|---|\n'
    + J.t3.venus.map((v) => `| ${cRn(v.cR)} | ${ff(v.phi0, 4)} | ${fl(v.dPhiMax, 1e-12)} | ${f3(v.res0)} | ${fl(v.dResRelMax, 1e-12)} | ${fe(v.mag1over0)} | ${f3(v.A0overWS0)} |`).join('\n');
  T.t3io = '| t | イオの φ ° | x | 金星の条件での残り |\n|---|---|---|---|\n' + J.t3.io.filter((r, k) => k % 2 === 0).map((r) => `| ${r.t} | ${ff(r.phiDeg, 3)} | ${f3(r.x)} | ${f3(r.resAtUV)} |`).join('\n');
  return T;
}
/** 数の文(節に逐語) */
export function factsOf(J) {
  const r = (id) => J.t1.rows.find((x) => x.id === id), rings = J.t1.rows.filter((x) => x.topic === 'ring'), s = J.t1.spread, V = J.t3.venus, sun = J.t2.find((x) => x.src === 'Sun');
  const rt = rings.map((x) => x.tStar), ro = rings.map((x) => x.overRule);
  return {
    t1: `題ごとの「合う t」(源に同じ t): 土星の環 ${ff(Math.min(...rt), 3)}〜${ff(Math.max(...rt), 3)}(規則の半径の ${f3(Math.min(...ro))}〜${f3(Math.max(...ro))} 倍)・0.98 の金星(受け手 規則の半径)${ff(r('venus-rule').tStar, 3)}(外挿)・イオ ${ft(r('io-same').tStar)}・地球の項 ${ff(r('earth-same').tStar, 3)}(外挿)。主の行の t は ${ft(s.tMin)}〜${ff(s.tMax, 3)} に散らばり、1 つの t にはそろわない。`,
    k: `0.98 の金星で要る k は、受け手が規則の半径のとき t 0 で ${f3(r('venus-rule').k0)}・t 1 で ${f3(r('venus-rule').k1)}(t 1 でも 1 に届かない)。受け手を c_R × 観測半径に置くと k = 1 の t は ${ff(r('venus-cR0.0128').tStar, 3)}(c_R 0.0128)・${ff(r('venus-cR1').tStar, 3)}(c_R 1)。`,
    src: `源ごとに要る t(他の源は規則の半径): 木星 ${ft(r('io-J').tStar)}(規則の半径の ${f3(r('io-J').overRule)} 倍)・土星 ${ff(Math.min(...rt), 3)}〜${ff(Math.max(...rt), 3)}・地球 ${ff(r('earth-E').tStar, 3)}(${f3(r('earth-E').overRule)} 倍)・太陽 ${ff(r('venus-cR0.0128').tStar, 3)}〜${ff(r('venus-rule').tStar, 3)}(受け手の置き方で替わる)。源の量の式の候補 (A)(B)(C) の t は、太陽で ${sun.cands.map((c) => ff(c.t, 3)).join('・')}。`,
    t3: `金星の φ は t を 0 から 1 に振っても動かない(受け手の 5 列で ${fl(Math.max(...V.map((v) => v.dPhiMax)), 1e-12)}°)—— 源の半径は (S) の大きさだけを ${fe(V[0].mag1over0)} 倍にする(この場の式では源の重みは距離で決まり、源の半径に依らない)。イオの φ は ${ff(J.t3.io[0].phiDeg, 3)}° → ${ff(J.t3.io[J.t3.io.length - 1].phiDeg, 3)}°。`,
  };
}
