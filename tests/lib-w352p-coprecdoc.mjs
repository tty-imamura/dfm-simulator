// 第352便p(原仮定者の回答(2026-11-24 —— 第148報)・原仮定者の整理(2026-11-24 —— 第148報)・統括の検証項目 R453):
// **正本 tests/out/coprec-352p.json から PHYSICS〔第352便p〕の表を作る文書の lib**
// (QA docs.coprec352p が節の表と逐語で照合する —— 数は有効数字 3 桁・角は小数 2 桁)。原文(言葉を変えずに引く)と読みの表もここに持つ。
export const DOC_VERSION = 'w352p-coprecdoc-1';
const fin = (x) => typeof x === 'number' && Number.isFinite(x);
const fe = (x) => (!fin(x) ? '—' : x === 0 ? '0' : Number(x).toExponential(2));
const f2 = (x) => (!fin(x) ? '—' : Number(x).toFixed(2));
const tf = (x) => (x === true ? '真' : x === false ? '偽' : '—');
const fl9 = (x) => (!fin(x) ? '—' : x === 0 ? '0' : Math.abs(x) < 1e-9 ? '< 1e-9' : Number(x).toExponential(1));
const sg3 = (x) => (!fin(x) ? '—' : (x > 0 ? '+' : '') + Number(x).toPrecision(3));
const list = (a, fn = sg3) => (!a || a.length === 0 ? 'なし' : a.map(fn).join('・'));
const BN = Object.freeze({ Sun: '太陽', Mercury: '水星', Venus: '金星', Earth: '地球', Mars: '火星', Jupiter: '木星', Saturn: '土星', Uranus: '天王星', Neptune: '海王星' });
const MG = Object.freeze({ uV: '(uV)', u1: '倍率 1', uP: '(仮)地球の歳差の率' });
const DN = Object.freeze({ Np: '(N+)', Gm: '(G−)' });
const AXN = Object.freeze({ L: 'L', eq: 'eq' });

/** 原文(言葉を変えずに引く) */
export const ORIGINAL = Object.freeze([
  Object.freeze(['原仮定者の回答(2026-11-24 —— 第148報)', 'AN1016: (乙)で進める。ただし、「釣り合う」に「安定した歳差運動」を含む']),
  Object.freeze(['原仮定者の整理(2026-11-24 —— 第148報)', '太陽系の公転面は、原始太陽系の円盤引きずりに由来する。公転面に薄く集まる事で、惑星の形成を促進した']),
  Object.freeze(['原仮定者の整理(2026-11-24 —— 第148報)', '太陽系の、多くの天体の公転面に垂直かつ、多くの天体の歳差運動の中心軸方向が、太陽系の基準軸方向である']),
  Object.freeze(['原仮定者の整理(2026-11-24 —— 第148報)', '自転速度や、歳差運動の傾きは、天体の構造に左右されるので、先に銀河由来の背景軸引きずりを算出する']),
  Object.freeze(['原仮定者の回答(2026-11-24 —— 第147報)', '…比率は天体の構造などに起因するので、ノブにする']),
]);
/** 統括の読み(原文と分ける)—— [読み, 数えた所] */
export const READINGS = Object.freeze([
  Object.freeze(['安定した歳差 = 一緒に回る枠で止まる向き(f > 0 は乱しても戻る点・f 0 は円錐を保つ中立)を、公転面(輪の法線)が背景に応えて回る場合に数える', '表 2・表 3']),
  Object.freeze(['予想の文。公転面の輪の法線も (R3) の 2 経路で背景に応える軸として、初めの散らばりが年齢の間に寄る角を、輪の比率 f_輪 と背景の大きさの列で数える(由来は数えない)', '表 5']),
  Object.freeze(['基準軸 L(角運動量の重み)と eq(等重み)を同じ重さで。(N+) は背景がその向き —— 輪の法線が回る軸が基準軸の近くになる', '表 3・表 4']),
  Object.freeze(['自転軸の応える比(構造の係数)と輪の応える比の差を、第350便c の自転の速さの読みと慣性の形から候補の式に直す((P1)(P2)(P3) —— どれも選ばない)', '表 1']),
  Object.freeze(['経路の比率 f はノブ。いまの角を年齢の間に保つための f の上限を背景の大きさの列ごとに出す(既定は決めない)', '表 4']),
]);
export function originalTable(readings = READINGS) {
  return ['| # | 出どころ | 原文(言葉を変えずに引く) | 読み(統括の読み —— 原文と分ける) | 数えた所 |', '|---|---|---|---|---|',
    ...ORIGINAL.map(([src, o], k) => `| ${k + 1} | ${src} | 「${o}」 | ${readings[k][0]} | ${readings[k][1]} |`)].join('\n');
}

const lockRow = (R, id, mag, axis = 'L') => {
  const r = (s, f) => R.find((x) => x.id === id && x.mag === mag && x.axis === axis && x.sense === s && x.f === f);
  return { p5: r('g2p', 0.5), m5: r('g2m', 0.5), p0: r('g2p', 0), m0: r('g2m', 0) };
};
const band = (a) => (!a ? '共回り(角は不変)' : a.oblDeg !== undefined ? f2(a.oblDeg) : `${f2(a.oblMinDeg)}〜${f2(a.oblMaxDeg)}`);
function lockTable(R) {
  const rows = [];
  for (const id of ['Sun', 'Mercury', 'Venus', 'Earth', 'Mars', 'Jupiter', 'Saturn', 'Uranus', 'Neptune']) for (const mag of ['uV', 'u1']) {
    const q = lockRow(R, id, mag);
    rows.push(`| ${BN[id]} | ${MG[mag]} | ${f2(q.p5.oblNowDeg)} | ${f2(q.p5.IbgDeg)} | ${band(q.p5.A1)}・${band(q.m5.A1)} | ${band(q.p0.A1)}・${band(q.p0.A3)} | ${q.p5.Aroots.length + q.m5.Aroots.length === 0 ? 'なし' : list(q.p5.Aroots) + '/' + list(q.m5.Aroots)} | ${sg3(q.p5.Brho1)} | ${f2(q.p5.B1)}・${f2(q.p5.B3)} | ${list(q.p5.Broots)}/${list(q.m5.Broots)} | ${list(q.p5.BrootPerP1)} | ${f2(q.p5.BminDeg)}〜${f2(q.p5.BmaxDeg)} |`);
  }
  return ['| 天体 | 大きさ | いまの傾き [°] | 輪の法線と背景の角 [°] | 読み A・f 0.5・(P1)の傾き [°] (g2+)・(g2−) | 読み A・f 0・円錐の傾きの範囲 [°] (P1)・(P3) | 読み A・f 0.5・いまの傾きになる δ (g2+)/(g2−) | 読み B・式の ρ((P1)・(g2+)) | 読み B・f 0.5・傾き [°] (P1)・(P3) | 読み B・f 0.5・いまの傾きになる ρ (g2+)/(g2−) | ρ の根 ÷ 式の ρ((g2+)) | 読み B・f 0.5・ρ を振った傾きの範囲 [°] |',
    '|---|---|---|---|---|---|---|---|---|---|---|---|', ...rows].join('\n');
}

export function tablesOf(J) {
  const T = {}, S = J.pure.scenes, G = J.pure.gates;
  T.pure = ['| 零試験・場面 | 値 | 門 |', '|---|---|---|',
    `| ① 輪と自転軸の係数が同じ(経路 ② だけ・比 1.7)なら共回り —— 一定の Ω で 2 つの軸の角の変わり [°]((g2+)・(g2−)) | ${S.corot.map(fl9).join('・')} | ${tf(G.corotSame)} |`,
    `| ② 読み A・局所 0・同じ係数: 式の ρ = σ・止まる点 = Ω̂・傾き = 輪の法線と背景の角(差 [°]) | ${S.fA.map((x) => sg3(x.rho)).join('・')}・${S.fA.map((x) => fl9(x.obl)).join('・')} | ${tf(G.readAlocal0)} |`,
    `| ③ 読み A・同じ係数・f 0: 中立の点 = ± 局所の分の向き(背景の歳差は枠で消える —— 差) | ${S.neuL.map(fl9).join('・')} | ${tf(G.readAlocalOnly)} |`,
    `| ④ g 0 で第352便i の一定の軸の形: 止まる点 = Ω̂・戻りの率 = k₁ W(judgeConst の θ 0) | ${S.g0.map((x) => fl9(x.ax) + '・' + fl9(x.lam)).join('/')} | ${tf(G.g0IsConst)} |`,
    `| ⑤ 読み B の無次元の形は第352便i の lockGeom と同じ(I 30°・ρ 2.4・f 0.5・(g2+)) | ${fl9(S.sameI)} | ${tf(G.readBisLockGeom)} |`,
    `| ⑥ 第352便l の表の数: (G−)・倍率 1・f 0 の要る係数の差 L・eq と、逆に解いた背景の大きさの往復 | ${fe(S.lRe.L)}・${fe(S.lRe.eq)}・${fl9(S.wBack)} | ${tf(G.lTable)} |`,
    `| ⑦ (P2) の差を直接に: 小さい x で x²/2・大きい x で √(1 + x²) − 1・Ω⊥ 0 で 0 | ${fl9(S.p2.small)}・${fl9(S.p2.big)}・${fl9(S.p2.zero)} | ${tf(G.p2Direct)} |`,
    `| ⑧ f の上限: 年齢の間に縮む割合(23.44°・W 1e-12 rad/s)と (N1) の逆 | ${S.fm.drop.toFixed(6)}・${fl9(S.fInv)} | ${tf(G.fMaxDrop)} |`,
    `| ⑨ 保つ作用 A を第352便e の fixedPoint で(止まる点の角と fixedOffset の差 [°]) | ${fl9(S.kaErr)} | ${tf(G.keepFixed)} |`,
    `| ⑩ 輪の寄り: 7° になる f_輪 の下限で年齢の後の角 [°] | ${f2(S.ring.th)} | ${tf(G.ringFor)} |`,
    `| ⑪ 第352便i の地球の根(I 30°・f 0.5・(g2+))を読み B の走査で | ${S.scRoots.map(sg3).join('・')} | ${tf(G.iRoots)} |`,
    `| ⑫ lockFromA と第352便i の lockPoints(打ち消しの無い入力)・読み A の lockA と ρ を経た lockObl | ${fl9(S.fromErr)}・${fl9(S.aErr)} | ${tf(G.lockFromA)} |`,
    `| ⑬ 入力の拒否(候補の名・C 0・負の W_bg・Ω 0・読みの名・大きさの名・θ 0・目標 > θ₀) | ${S.rejects.filter(Boolean).length}/${S.rejects.length} | ${tf(G.rejects)} |`].join('\n');
  T.coef = ['| 天体 | 大きさ | ω ÷ n_orb | C | (P2) の係数の差 | (P3) の係数の差 | 輪の回る率 g_輪 [″/年](f_輪 0・(g2+)) | 輪の法線と背景の角 [°] | いまの傾き [°] | 経路 ② で届くか | 年齢の間に開くのに要る倍率: (P3)・(P2) | 要る係数の差 |', '|---|---|---|---|---|---|---|---|---|---|---|---|',
    ...J.coef.map((r) => `| ${BN[r.id]} | ${MG[r.mag]} | ${fe(r.wOverN)} | ${r.C.toFixed(4)} | ${fe(r.relP2)} | ${fe(r.relP3)} | ${fe(r.gRingAsYr)} | ${f2(r.IbgDeg)} | ${f2(r.oblNowDeg)} | ${r.reach ? '届く' : '届かない'} | ${fe(r.uReqP3)}・${fe(r.uReqP2)} | ${fe(r.deltaReq)} |`)].join('\n');
  T.lockG = lockTable(J.lockG);
  T.lockN = lockTable(J.lockN);
  T.keep = ['| 天体 | 背景の向き | 基準軸 | 大きさ | 自転軸と合成の角 θ [°] | 合成 W [″/年] | k₁ の上限 | f の上限 | f の上限で経路 ① を打ち消す A [″/年] |', '|---|---|---|---|---|---|---|---|---|',
    ...J.keep.map((r) => `| ${BN[r.id]} | ${DN[r.dir]} | ${AXN[r.axis]} | ${MG[r.mag]}${r.provisional ? '(仮・未照合)' : ''} | ${f2(r.thDeg)} | ${fe(r.WAsYr)} | ${fe(r.k1Max)} | ${r.fMax >= 1 ? '1(上限なし)' : fe(r.fMax)} | ${fe(r.AkeepAsYr)} |`)].join('\n');
  T.ring = ['| 大きさ | f_輪 | 年齢の後の角 [°](初め 30°) | 縮んだ角 [°] | k₁ W t | 7° になる f_輪 の下限 |', '|---|---|---|---|---|---|',
    ...J.ring.map((r) => `| ${MG[r.mag]}${r.provisional ? '(仮・未照合)' : ''} | ${r.fRing === 'need7' ? '—' : fe(r.fRing)} | ${r.fRing === 'need7' ? '—' : f2(r.thDeg)} | ${r.fRing === 'need7' ? '—' : fe(r.dropDeg)} | ${r.fRing === 'need7' ? '—' : fe(r.kwt)} | ${r.fRing === 'need7' ? (r.fNeed === null ? '届かない(f_輪 1 でも)' : fe(r.fNeed)) : '—'} |`)].join('\n');
  return T;
}
/** 数の文(節に逐語) */
export function factsOf(J) {
  const F = {}, c = (id, m) => J.coef.find((r) => r.id === id && r.mag === m), g = (R, id, m, s, f, a = 'L') => R.find((x) => x.id === id && x.mag === m && x.axis === a && x.sense === s && x.f === f);
  const k = (id, d, a, m) => J.keep.find((r) => r.id === id && r.dir === d && r.axis === a && r.mag === m), rg = (m, f) => J.ring.find((r) => r.mag === m && r.fRing === f);
  F.coef = `係数の差の候補: (P1) は 0・(P2) は倍率 1 でも太陽 ${fe(c('Sun', 'u1').relP2)}・地球 ${fe(c('Earth', 'u1').relP2)}・(P3) は太陽 ${fe(c('Sun', 'u1').relP3)}・地球 ${fe(c('Earth', 'u1').relP3)}・木星 ${fe(c('Jupiter', 'u1').relP3)}。(G−) で初めにそろった輪の法線と自転軸が年齢の間にいまの傾きまで開くのに要る背景の倍率は、太陽 (P3) ${fe(c('Sun', 'u1').uReqP3)}・(P2) ${fe(c('Sun', 'u1').uReqP2)}/地球 (P3) ${fe(c('Earth', 'u1').uReqP3)}・(P2) ${fe(c('Earth', 'u1').uReqP2)}(金星のいまの角は経路 ② の上限を超える)`;
  const eA = g(J.lockG, 'Earth', 'uV', 'g2p', 0), eA5 = g(J.lockG, 'Earth', 'u1', 'g2p', 0.5), eB = g(J.lockG, 'Earth', 'uV', 'g2p', 0.5);
  F.lockG = `(G−) の読み A: f 0.5 の止まる向きの傾きは、倍率 1 で輪の法線と背景の角そのもの(地球 ${f2(eA5.A1.oblDeg)}°)。δ を ±1e-16〜1e3 に振っても、いまの傾きになる δ はどの惑星にも無かった。f 0・同じ係数では背景の歳差が枠で消え、自転軸は局所の分の軸のまわりの円錐を保つ —— 地球の傾きは ${f2(eA.A1.oblMinDeg)}〜${f2(eA.A1.oblMaxDeg)}°((uV)・(P1))・${f2(eA.A3.oblMinDeg)}〜${f2(eA.A3.oblMaxDeg)}°((P3))。読み B: 式の ρ(地球 (uV) ${sg3(eB.Brho1)})での傾きは ${f2(eB.B1)}°・いまの傾きになる ρ は ${list(eB.Broots)}(式の ρ の ${list(eB.BrootPerP1)} 倍)`;
  const nE = g(J.lockN, 'Earth', 'uV', 'g2p', 0.5), nE0 = g(J.lockN, 'Earth', 'uV', 'g2p', 0), nM = g(J.lockN, 'Mars', 'uV', 'g2p', 0.5);
  F.lockN = `(N+) の f 0.5 の止まる向きの傾きは、地球 (uV) ${f2(nE.A1.oblDeg)}°(読み A)・${f2(nE.B1)}°(読み B)・ρ を振った読み B の最大 ${f2(nE.BmaxDeg)}°/火星 ${f2(nM.A1.oblDeg)}°・${f2(nM.B1)}°・最大 ${f2(nM.BmaxDeg)}°。観測の 23〜28° は f 0.5 の戻る点としては出ない。f 0 の中立では、ρ ≈ ±1 の近く(地球 ${list(nE0.Broots)})で中立の軸が大きく振れる`;
  F.keep = `(N+)・L で年齢の間に傾きが 10% より多く縮まない f の上限: 地球 (uV) ${k('Earth', 'Np', 'L', 'uV').fMax >= 1 ? '1(上限なし)' : fe(k('Earth', 'Np', 'L', 'uV').fMax)}・倍率 1 ${fe(k('Earth', 'Np', 'L', 'u1').fMax)}・(仮) ${fe(k('Earth', 'Np', 'L', 'uP').fMax)}/太陽 倍率 1 ${fe(k('Sun', 'Np', 'L', 'u1').fMax)}・(仮) ${fe(k('Sun', 'Np', 'L', 'uP').fMax)}`;
  F.ring = `輪の法線の寄り(初め 30°): (uV) では f_輪 1 でも年齢の後に ${f2(rg('uV', 1).thDeg)}°・倍率 1 では 7° になる f_輪 の下限 ${fe(rg('u1', 'need7').fNeed)}・(仮) では ${fe(rg('uP', 'need7').fNeed)}`;
  return F;
}
