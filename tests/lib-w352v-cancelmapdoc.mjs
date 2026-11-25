// 第352便v(原仮定者の回答(2026-11-24 —— 第148報)・統括の検証項目 R459):
// **正本 tests/out/cancelmap-352v.json から PHYSICS〔第352便v〕の表と数の文を作る文書の lib**
// (QA docs.cancelmap352v が節の表と逐語で照合する —— 表の数は有効数字 3 桁・丸めの床の量は「—」の印)。原文(言葉を変えずに引く)もここに持つ。
// ファイルを読まない・import しない。
export const DOC_VERSION = 'w352v-cancelmapdoc-1';
const fe = (x) => (x === null || x === undefined || !Number.isFinite(x) ? '—' : x === 0 ? '0' : Number(x).toExponential(2));
const f3 = (x) => (x === null || x === undefined || !Number.isFinite(x) ? '—' : Number(x).toFixed(3));
const f2 = (x) => (x === null || x === undefined || !Number.isFinite(x) ? '—' : Number(x).toFixed(2));
const f1 = (x) => (x === null || x === undefined || !Number.isFinite(x) ? '—' : Number(x).toFixed(1));
export const KN = Object.freeze({ 'Mercury|Sun': '水星 ← 太陽', 'Venus|Sun': '金星 ← 太陽', 'Earth|Sun': '地球 ← 太陽', 'Mars|Sun': '火星 ← 太陽', 'Jupiter|Sun': '木星 ← 太陽', 'Saturn|Sun': '土星 ← 太陽',
  'Uranus|Sun': '天王星 ← 太陽', 'Neptune|Sun': '海王星 ← 太陽', 'Moon|Sun': '月 ← 太陽(太陽だけ)', 'Io|Sun': 'イオ ← 太陽(太陽だけ)', 'Pluto|Sun': '冥王星 ← 太陽(太陽だけ)',
  'Moon|EarthHi': '月 ← 地球 + 太陽(傾き最大の位相)', 'Moon|EarthLo': '月 ← 地球 + 太陽(傾き最小の位相)', 'Io|Jupiter': 'イオ ← 木星 + 太陽', 'Pluto|Charon': '冥王星 ← カロン + 太陽', 'Charon|Pluto': 'カロン ← 冥王星 + 太陽',
  'Sun|Planets': '太陽 ← 惑星 8 つの和' });
const SN = Object.freeze({ Sun: '太陽', Mercury: '水星', Venus: '金星', Earth: '地球', Mars: '火星', Jupiter: '木星', Saturn: '土星', Uranus: '天王星', Neptune: '海王星', EarthHi: '地球', EarthLo: '地球', Charon: 'カロン', Pluto: '冥王星', Moon: '月', Io: 'イオ' });
const IN = Object.freeze({ Moon: '月', Io: 'イオ', Pluto: '冥王星', Charon: 'カロン' });
const TN = Object.freeze({ 0: '規則', 1: '観測' });
const BN = Object.freeze({ NpL: '(N+) L', Npeq: '(N+) eq', GmL: '(G−) L', Gmeq: '(G−) eq' });
const MN = Object.freeze({ cancel: '打ち消す', add: '足し合う' });

/** 原文(言葉を変えずに引く —— 公開の節に在る文) */
export const ORIGINAL = Object.freeze([
  Object.freeze(['原仮定者の回答(2026-11-24 —— 第148報)', 'AN1019: Aで進める。金星の自転の逆回転は、釣り合った状態で地球とも共鳴した結果である']),
  Object.freeze(['原仮定者の回答(2026-11-24 —— 第148報)', 'AN1015: Bで進める。銀河由来の軸引きずりも、(S)だけを数えると弱いと推測する']),
  Object.freeze(['原仮定者の回答(2026-11-15 —— 第138報の回答 4)', 'イオは潮汐ロックしているので、内部熱の検証用']),
  Object.freeze(['原仮定者の指示(2026-11-14 —— 第138報)', '潮汐ロックしている状態は、外部からの軸引きずりによる回転よりも、潮汐力が上回っている']),
]);
export const READINGS = Object.freeze([
  '背景の大きさの主の列 = 金星で太陽由来の (S) と背景の大きさが同じ値 (uV)。後半は予想の文 —— 本節は、全部の受け手と源の組で同じ形の打ち消しが起きる背景の倍率を (uV) と比べた x の一覧と、その式だけ',
  '局所の軸引きずりの主の成分 = (S) 源の自転の分。衛星では母天体由来の項も (S)。「(S)だけを数えると弱い」は予想の文 —— 本節は (S) の源の半径の置き方(規則/観測)を同じ重さで 2 列に',
  'イオの行は内部熱の検証用の行として残す。本節は、イオで木星の (S) と背景が打ち消す背景の倍率 x と、その近くの判定の量と潮汐のトルクの比だけ(内部熱の出どころは数えない)',
  '恒久の定義。本節は当否を判じない —— 打ち消しの近くの倍率で、潮汐のトルク ÷ 軸引きずりの直交成分のトルクが何倍になるかの数だけ',
]);
const esc = (s) => String(s).replace(/\|/g, '/');
export function originalTable() {
  return '| # | 出どころ | 原文(言葉を変えずに引く) | 読み(統括の読み —— 原文と分ける) |\n|---|---|---|---|\n'
    + ORIGINAL.map(([src, o], k) => `| ${k + 1} | ${src} | 「${o}」 | ${esc(READINGS[k])} |`).join('\n');
}
const ORDER = (J) => [...new Set(J.points.map((r) => r.key))];
const pt = (J, k, t, bg, ax) => J.points.find((r) => r.key === k && r.tSrc === t && r.bg === bg && r.axis === ax);
const band = (J, x) => (x >= J.decl.nearBand[0] && x <= J.decl.nearBand[1] ? '近く' : '');
const lg = (x) => (x > 0 ? f2(Math.log10(x)) : '—');

export function tablesOf(J) {
  const T = {};
  { const S = J.pure.scenes, G = J.pure.gates;
    T.pure = '| 零試験・場面 | 値 | 門 |\n|---|---|---|\n' + [
      ['① (uV)(規則の半径)が 1.19282e-12・〔第352便d〕の `uVenus` と同じ・観測の半径の (uV)', `${fe(S.uV0)}・${fe(S.uV1)}`, G.uV],
      ['② 金星の x が 1(源の半径 2 列)・残り (N+) L・eq(〔第352便h〕の 1.3%・1.0%)', `1・${f3(S.venus[2])}・${f3(S.venus[3])}`, G.venusOne],
      ['③ イオの x が〔第352便s〕の数(規則 0.894・観測 1.03e4)・(uV) でのイオの合成 ÷ 背景 0.120', `${f3(S.io[0])}・${fe(S.io[1])}・${f3(S.ioUV)}`, G.io352s],
      ['④ 月の x が〔第352便s〕の数(規則 0.377・観測 0.499)', `${f3(S.moon[0])}・${f3(S.moon[1])}`, G.moon352s],
      ['⑤ 太陽 ← 惑星の (S) の和(規則の半径)が〔第352便e〕の `sunLocal` と同じ(相対の差)', S.vsSun === 0 ? '0' : '< 1e-12', G.sunSum352e],
      ['⑥ x は背景の向きと基準軸に依らない(大きさだけ)・uMin で合成が最小(両隣より小さい)', '< 1e-12', G.xIndep],
      ['⑦ 閉じた形の一次: 規則の半径のイオの母天体の分で (v_c 比)⁶ (ω 比) と同じ式・惑星(太陽が源)で数の x ÷ 一次が ½〜2', '< 1e-12', G.lead],
      ['⑧ 惑星の観測 ÷ 規則の (S) の率 = (太陽の観測の半径 ÷ 規則の半径)² の近く(1e-3 の内)', fe(S.rS * S.rS), G.radiusSq],
      ['⑨ 変異: 背景の向きを (G−) にすると金星は打ち消さない(残り > 0.5)', '真', G.mutantGm],
      ['⑩ 入力の拒否(背景の向き・基準軸・t・衛星でない組・潮汐の天体でない受け手)', `${S.rejects.filter(Boolean).length}/${S.rejects.length}`, G.rejects],
    ].map(([x, b, g]) => `| ${x} | ${b} | ${g ? '真' : '偽'} |`).join('\n'); }
  // 表 1: 打ち消しの点の一覧(x を対数で並べる)
  T.points = '| 組 | x(規則) | log₁₀ x(規則) | x(観測) | log₁₀ x(観測) | 0.1〜10(規則) | 0.1〜10(観測) | (N+) L(規則): 向き・残り | (N+) eq(規則) | (G−) L(規則) | (N+) L(観測): 向き・残り | (G−) L(観測) |\n|---|---|---|---|---|---|---|---|---|---|---|---|\n'
    + ORDER(J).map((k) => { const a = pt(J, k, 0, 'Np', 'L'), b = pt(J, k, 1, 'Np', 'L'), ae = pt(J, k, 0, 'Np', 'eq'), ag = pt(J, k, 0, 'Gm', 'L'), bg = pt(J, k, 1, 'Gm', 'L');
      return `| ${KN[k]} | ${fe(a.x)} | ${lg(a.x)} | ${fe(b.x)} | ${lg(b.x)} | ${band(J, a.x)} | ${band(J, b.x)} | ${MN[a.mode]} ${f3(a.resEq)} | ${MN[ae.mode]} ${f3(ae.resEq)} | ${MN[ag.mode]} ${f3(ag.resEq)} | ${MN[b.mode]} ${f3(b.resEq)} | ${MN[bg.mode]} ${f3(bg.resEq)} |`; }).join('\n');
  // 表 1b: x の閉じた形の一次と要素の比(金星 ← 太陽に対する比)
  T.lead = '| 組 | 源の半径 | 由来 | 数の x(その由来) | 一次の x | 数 ÷ 一次 | 源の質量の比 | 源の半径の比 | 源の自転の率の比 | 距離の比 | (m ÷ r) の比 | (v_c 比)⁶ |\n|---|---|---|---|---|---|---|---|---|---|---|---|\n'
    + J.lead.filter((r) => r.key !== 'Sun|Planets').flatMap((r) => r.parts.map((p, i) => {
      const P = pt(J, r.key, r.tSrc, 'Np', 'L'), num = i === 0 ? (P.xPar !== null ? P.xPar : P.x) : null;
      return `| ${KN[r.key]} | ${TN[r.tSrc]} | ${SN[p.src]} | ${fe(num)} | ${fe(p.x)} | ${num === null ? '—' : f3(num / p.x)} | ${fe(p.mRatio)} | ${fe(p.Rratio)} | ${fe(p.wRatio)} | ${fe(p.rRatio)} | ${fe(p.mOverR)} | ${fe(Math.pow(p.vRatio, 6))} |`; })).join('\n')
    + '\n' + J.lead.filter((r) => r.key === 'Sun|Planets').map((r) => { const P = pt(J, r.key, r.tSrc, 'Np', 'L');
      return `| ${KN[r.key]} | ${TN[r.tSrc]} | 惑星の和(一次は各惑星の和) | ${fe(P.x)} | ${fe(r.sumX)} | ${f3(P.x / r.sumX)} | — | — | — | — | — | — |`; }).join('\n');
  // 表 2: 背景 1 つ((uV)(t))で読む —— 外からの軸の拘束が小さい順((N+) L・規則の合成 ÷ 背景の小さい順)+ 受け手の観測の状態
  { const st = J.state, by = (t) => J.oneBg.filter((r) => r.tSrc === t).slice().sort((a, b) => a.cells.NpL.omOverBg - b.cells.NpL.omOverBg);
    const row = (r) => { const c = r.cells, s = st[r.key];
      return `| ${KN[r.key]} | ${TN[r.tSrc]} | ${f3(c.NpL.omOverBg)} | ${f3(c.Npeq.omOverBg)} | ${f3(c.GmL.omOverBg)} | ${f1(c.NpL.angOmSDeg)} | ${f1(c.GmL.angOmSDeg)} | ${fe(c.NpL.locOverBg)} | ${f1(s.epsDeg)}(${s.epsRef}) | ${s.retro ? '逆行' : '順行'} | ${s.spinOverN === null ? '—' : fe(s.spinOverN)} | ${s.sync ? '同期' : '—'} |`; };
    const head = '| 組 | 源の半径 | 合成 ÷ 背景 (N+) L | (N+) eq | (G−) L | 合成と ŝ の角 (N+) L ° | (G−) L ° | 局所 ÷ 背景 | 受け手の傾き °(基準) | 逆行/順行 | 自転の率 ÷ 公転の率 | 同期(1% の内) |\n|---|---|---|---|---|---|---|---|---|---|---|---|\n';
    T.oneBg0 = head + by(0).map(row).join('\n');
    T.oneBg1 = head + by(1).map(row).join('\n'); }
  // 表 3: 打ち消しの近くの判定の量と潮汐のトルクの比
  T.near = '| 天体 | 源の半径 | 背景 | uEq ÷ (uV) | uMin ÷ (uV) | トルクの比: 局所だけ | (uV) | uEq | uMin | uMin ÷ (uV) の比 | ŝ と Ω の角 °: (uV) | uEq | 1 周の戻り f ½: (uV) | uEq | 円錐が 1/e になる年 f ½: uEq |\n|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|\n'
    + J.near.filter((r) => r.axis === 'L').map((r) => { const c = r.cells, j = (k, s) => c[k].judge['0.5|' + s];
      return `| ${IN[r.id]} | ${TN[r.tSrc]} | ${BN[r.bg + r.axis]} | ${fe(r.uOverUV.uEq)} | ${fe(r.uOverUV.uMin)} | ${fe(c.u0.rTide)} | ${fe(c.uV.rTide)} | ${fe(c.uEq.rTide)} | ${fe(c.uMin.rTide)} | ${fe(r.gainMin)} | ${f1(c.uV.thDeg)} | ${f1(c.uEq.thDeg)} | ${fe(j('uV', 'g2m').returnPerTurn)} | ${fe(j('uEq', 'g2m').returnPerTurn)} | ${fe(j('uEq', 'g2m').tE)} |`; }).join('\n');
  // 表 4: 源の半径の置き方の材料
  { const R = J.radius, P = R.planets, rr = P.map((p) => p.rateRatio), dd = Math.max(...P.map((p) => p.dirDeg)), td = R.tide;
    T.radius = '| 材料 | 規則の半径 | 観測の半径 |\n|---|---|---|\n' + [
      ['(i) 惑星の表(太陽が源): 観測 ÷ 規則の (S) の率・向きの差の最大', '1(基準)', `${rng(rr, fe)} 倍・向きの差の最大 ${fe(dd)}°`],
      ['(ii) 背景を倍率 1 に置いたとき、金星の条件に要る換算の係数(1 ÷ (uV))', fe(R.kNeed[0]), fe(R.kNeed[1])],
      ['(iii) イオの x', f3(R.io[0]), fe(R.io[1])],
      ['(iv) 土星の環: 傾き 1° の輪を土星の (S) だけで起こす率 ÷ 環の物差し(〔第352便s〕表 9 の数)と、源の半径の比の 2 乗', `${R.ring352s.rule} の桁`, `${R.ring352s.obsLo}〜${R.ring352s.obsHi}(半径の比の 2 乗 ${fe(R.saturn.R2)})`],
      ['(v) 月: 潮汐のトルク ÷ 直交成分のトルク((uV) の背景 4 つ)', `${fe(td['Moon|0'].lo)}〜${fe(td['Moon|0'].hi)}`, `${fe(td['Moon|1'].lo)}〜${fe(td['Moon|1'].hi)}`],
      ['(v) カロン: 同', `${fe(td['Charon|0'].lo)}〜${fe(td['Charon|0'].hi)}`, `${fe(td['Charon|1'].lo)}〜${fe(td['Charon|1'].hi)}`],
    ].map(([a, b, c]) => `| ${a} | ${b} | ${c} |`).join('\n'); }
  return T;
}
const rng = (xs, f) => { const v = xs.filter((x) => Number.isFinite(x)); const a = Math.min(...v), b = Math.max(...v); return f(a) === f(b) ? f(a) : f(a) + '〜' + f(b); };
export function factsOf(J) {
  const F = {}, keys = ORDER(J), near = (t) => keys.filter((k) => { const x = pt(J, k, t, 'Np', 'L').x; return x >= J.decl.nearBand[0] && x <= J.decl.nearBand[1]; }).map((k) => KN[k]);
  { const planets = keys.filter((k) => /\|Sun$/.test(k)), pl = planets.map((k) => pt(J, k, 0, 'Np', 'L'));
    F.points = `x(局所の (S) と背景が同じ大きさになる背景の倍率 ÷ 金星の条件の値)が 0.1〜10 に入る組は、規則の半径で ${near(0).join('・')}(${near(0).length} 組)、観測の半径で ${near(1).join('・')}(${near(1).length} 組)。`
      + `太陽が源の組では x は源の半径の置き方に依らない((uV) も同じ半径で決まる —— 水星 ${fe(pt(J, 'Mercury|Sun', 0, 'Np', 'L').x)}・地球 ${fe(pt(J, 'Earth|Sun', 0, 'Np', 'L').x)}・火星 ${fe(pt(J, 'Mars|Sun', 0, 'Np', 'L').x)}・海王星 ${fe(pt(J, 'Neptune|Sun', 0, 'Np', 'L').x)})。`
      + `(N+) では太陽が源の組は全部「打ち消す」向きで、自分の x の倍率での残りは ${rng(pl.map((r) => r.resEq), f3)}(金星が最小 ${f3(pt(J, 'Venus|Sun', 0, 'Np', 'L').resEq)})。(G−) では残りは ${rng(planets.map((k) => pt(J, k, 0, 'Gm', 'L').resEq), f3)}。`
      + `太陽 ← 惑星の和の x は規則の半径で ${fe(pt(J, 'Sun|Planets', 0, 'Np', 'L').x)}・観測の半径で ${fe(pt(J, 'Sun|Planets', 1, 'Np', 'L').x)}。`
      + `観測の半径で (N+) が「足し合う」向きになる組: ${keys.filter((k) => pt(J, k, 1, 'Np', 'L').mode === 'add').map((k) => KN[k]).join('・') || 'なし'}。`; }
  { const io = J.lead.find((r) => r.key === 'Io|Jupiter' && r.tSrc === 0).parts[0], io1 = J.lead.find((r) => r.key === 'Io|Jupiter' && r.tSrc === 1).parts[0];
    F.formula = `x の閉じた形の一次(源の赤道面・静止の源・受け手の自分の重みが源の重みより大きい・距離が源の半径より大きい —— 〔第352便k〕の \`closedS\` の一次 f + r f′/2 = −f/2)は、`
      + `abs Ω_S ≈ m_源 R_源² ω_源 ÷ (10 r³ A)(A = 1.5 ÷ Y_k は受け手に依らない)なので、x ≈ (m R² ω ÷ r³)_組 ÷ (m R² ω ÷ r³)_金星。`
      + `規則の半径 R = Y_k m では x ≈ (m ÷ r)³ の比 × ω の比 = (v_c ÷ v_c,金星)⁶ × (ω_源 ÷ ω_太陽)(v_c = √(G m_源 ÷ r) —— 源のまわりの円の公転の速さ)。`
      + `イオの母天体の分では (v_c 比)⁶ = ${fe(Math.pow(io.vRatio, 6))}・(ω_木星 ÷ ω_太陽) = ${fe(io.wRatio)}・積 ${fe(io.x)}(数の x ${fe(pt(J, 'Io|Jupiter', 0, 'Np', 'L').xPar)})。`
      + `観測の半径では x ≈ (m R² ω)の比 ×(距離の比)⁻³ —— 球のモーメントの形では、源の自転の角運動量 ÷ 距離³ の比(イオ: 質量の比 ${fe(io1.mRatio)}・半径の比 ${fe(io1.Rratio)}・一次の x ${fe(io1.x)})。`
      + `太陽が源の組では x ≈ (r_金星 ÷ r)³(源が同じ)。規則の半径で x が 1 になるのは「源のまわりの円の公転の速さの 6 乗 × 源の自転の率」が金星 ← 太陽と同じになるとき —— イオでは、速さの比の 6 乗の小ささを木星の自転の速さが埋める形。`; }
  { const o0 = J.oneBg.filter((r) => r.tSrc === 0).slice().sort((a, b) => a.cells.NpL.omOverBg - b.cells.NpL.omOverBg), o1 = J.oneBg.filter((r) => r.tSrc === 1).slice().sort((a, b) => a.cells.NpL.omOverBg - b.cells.NpL.omOverBg);
    const top = (o) => o.slice(0, 4).map((r) => `${KN[r.key]} ${f3(r.cells.NpL.omOverBg)}`).join('・');
    F.oneBg = `背景を金星の条件の値 (uV)(その半径の置き方)に置いたとき、(N+) L で合成 ÷ 背景の小さい順は、規則の半径で ${top(o0)}、観測の半径で ${top(o1)}。`
      + `(G−) L では、規則の半径で ${rng(o0.map((r) => r.cells.GmL.omOverBg), f3)}。受け手の観測の状態(リポジトリの数): 金星は傾き ${f1(J.state['Venus|Sun'].epsDeg)}°(逆行)・自転の率 ÷ 公転の率 ${f3(J.state['Venus|Sun'].spinOverN)}、`
      + `イオは同期(${f3(J.state['Io|Jupiter'].spinOverN)})・月は同期(${f3(J.state['Moon|EarthHi'].spinOverN)})—— 残りの数と並べるだけ。`; }
  { const g = (id, t, bg) => J.near.find((r) => r.id === id && r.tSrc === t && r.bg === bg && r.axis === 'L');
    const i0 = g('Io', 0, 'Np'), i1 = g('Io', 1, 'Np'), m0 = g('Moon', 0, 'Np'), m1 = g('Moon', 1, 'Np');
    F.near = `打ち消しの近く(uMin)では、合成の回転は受け手の自転軸にほぼ直交する(イオ: ŝ と Ω の角 ${f1(i0.cells.uEq.thDeg)}°(uEq)・${f1(i0.cells.uMin.thDeg)}°(uMin)—— 規則の半径・(N+) L)。`
      + `そのため直交成分は合成の大きさほどは小さくならず、潮汐のトルク ÷ 直交成分のトルクは、(uV) に対して uMin で イオ ${fe(i0.gainMin)} 倍・月 ${fe(m0.gainMin)} 倍(規則の半径)、`
      + `観測の半径では イオ ${fe(i1.gainMin)} 倍(背景が (uV) の ${fe(i1.uOverUV.uMin)} 倍に大きくなるので比は下がる)・月 ${fe(m1.gainMin)} 倍。`
      + `比そのものは、どの行でも ${rng(J.near.flatMap((r) => Object.values(r.cells).map((c) => c.rTide)), fe)} —— 1 を越える(${J.near.every((r) => Object.values(r.cells).every((c) => c.rTide === null || c.rTide > 1)) ? 'はい' : 'いいえ'})。恒久の文と同じ向きの数というだけ。`; }
  { const R = J.radius;
    F.radius = `源の半径の置き方の材料: (i) 惑星の表は向きが同じで率だけが ${fe(R.planets[0].rateRatio)} 倍、(ii) 倍率 1 の背景で金星の条件に要る換算の係数は ${fe(R.kNeed[0])}(規則)・${fe(R.kNeed[1])}(観測)、(iii) イオの x は ${f3(R.io[0])}・${fe(R.io[1])}、`
      + `(iv) 土星の環を起こす率と物差しの比は ${R.ring352s.rule} の桁・${R.ring352s.obsLo}〜${R.ring352s.obsHi}(〔第352便s〕—— 土星の半径の比の 2 乗 ${fe(R.saturn.R2)} と同じ桁の差)、(v) 月の潮汐の余裕は ${fe(R.tide['Moon|0'].lo)}〜${fe(R.tide['Moon|0'].hi)}・${fe(R.tide['Moon|1'].lo)}〜${fe(R.tide['Moon|1'].hi)}。`; }
  return F;
}
