// 第353便g(原仮定者の回答(2026-11-25 —— 第151報)・統括の検証項目 R471):
// **正本 tests/out/venuslock-353g.json から PHYSICS〔第353便g〕の表を作る文書の lib**
// (QA docs.venuslock353g が節の表と逐語で照合する —— 表の数は有効数字 3 桁)。原文(言葉を変えずに引く)と読みの表もここに持つ。
export const DOC_VERSION = 'w353g-venuslockdoc-1';
const fin = (x) => typeof x === 'number' && Number.isFinite(x);
const fe = (x) => (!fin(x) ? '—' : x === 0 ? '0' : Number(x).toExponential(2));
const f3 = (x) => (!fin(x) ? '—' : Number(x).toPrecision(3));
const tf = (x) => (x === true ? '真' : x === false ? '偽' : '—');
const fl9 = (x) => (!fin(x) ? '—' : x === 0 ? '0' : x < 1e-9 ? '< 1e-9' : Number(x).toExponential(1));
const AXN = Object.freeze({ L: 'L(角運動量の重み —— 主)', eq: 'eq(等重み —— 比べる列)' });
const MAGN = Object.freeze({ uV: '(uV)〔等大〕', u0835: '0.835〔(N+) の窓の上端〕', u098: '0.98〔注目の列〕' });
const PROV = '(仮)';

/** 原文(言葉を変えずに引く) */
export const ORIGINAL = Object.freeze([
  Object.freeze(['原仮定者の回答(2026-11-25 —— 第151報)', 'AN1034: 「金星で釣り合う」のは、金星の自転がロックした状態。逆回転は地球の影響であり、「金星は、自転に地球の影響が出るほどに釣り合っている」']),
  Object.freeze(['原仮定者の回答(2026-11-24 —— 第148報)', 'AN1019: Aで進める。金星の自転の逆回転は、釣り合った状態で地球とも共鳴した結果である']),
]);
/** 統括の読み(原文と分ける)—— [読み, 数えた所] */
export const READINGS = Object.freeze([
  Object.freeze(['状態の名を「ロックの判定の量」として、何で判定するかの候補を 3 つ並べる((L1) 内合の位相のずれ・(L2) 軸の拘束 = 残り ÷ 背景・(L3) 率の差 ÷ 共鳴の幅)。「地球の影響が出るほどに」を、地球の作用 ÷ 残り の大きさの比べにする', '表 3・表 4・表 5']),
  Object.freeze(['原文の「釣り合い」の状態と「地球との共鳴」を別の列で数える(残りの列と、(E-g) のトルクの共鳴の幅)。「共鳴した結果」は予想の文 —— 逆回転を作る道は数えない(第352便n・za の結果を引く)・保つ道だけを数える', '表 5・表 6・表 7']),
]);
export function originalTable(readings = READINGS) {
  return ['| # | 出どころ | 原文(言葉を変えずに引く) | 読み(統括の読み —— 原文と分ける) | 数えた所 |', '|---|---|---|---|---|',
    ...ORIGINAL.map(([src, o], k) => `| ${k + 1} | ${src} | 「${o}」 | ${readings[k][0]} | ${readings[k][1]} |`)].join('\n');
}

export function tablesOf(J) {
  const T = {}, S = J.pure.scenes, G = J.pure.gates;
  T.pure = ['| 零試験・場面 | 値 | 門 |', '|---|---|---|',
    `| ① 基準軸 L(黄道 J2000)= 統括の数え直し 3 | ${S.L.map((x) => x.toFixed(6)).join(', ')} | ${tf(G.anchorL)} |`,
    `| ② (uV) = abs(S) ÷ 銀河の公転の角速度(第352便h の localSun と同じ —— 相対差) | ${fe(S.uV)}(${fl9(S.vsH)}) | ${tf(G.anchorUV)} |`,
    `| ③ φ(−S と L の角)・等大の残り ÷ 背景(L)・(N+) eq の残り | ${S.phiL.toFixed(4)}°・${S.resL.toFixed(6)}・${S.resEq.toFixed(3)} | ${tf(G.anchorRes)} |`,
    `| ④ 残りの閉じた形 2 sin(φ/2) = 和から(相対差)・倍率 0.98 の残り ÷ 背景 − 1 | ${fl9(S.closedVsDirect)}・${fl9(Math.abs(S.r098 - 1))} | ${tf(G.closedRes)} |`,
    `| ⑤ (L1) ${PROV} 内合ごとのずれ・共鳴の周期でのずれ・共鳴の周期・いまとの差 | ${S.shift.toFixed(3)}°・${fl9(Math.abs(S.zero))}・${S.Pres.toFixed(3)} 日・${S.dP.toFixed(3)} 日 | ${tf(G.lonShift)} |`,
    `| ⑥ (E-g) の 1 会合の平均: 刻み 4 倍との差・2ψ の周期性・abs(Z) ≤ ⟨1/d³⟩ ≤ 1/d_inf³ | ${fl9(S.zConv)}・${fl9(S.wrapErr)}・${fe(S.zAbs)} ≤ ${fe(S.zMean)} ≤ ${fe(S.zPeak)} m⁻³ | ${tf(G.zAvg)} |`,
    `| ⑦ 振り子の步: 小振幅の 1/4 周期(步の数 ÷ 2π/Ω_p の 1/4)・捕まる条件との一致 | ${(S.smCross / S.quarter).toFixed(3)}・${tf(S.capAgree)} | ${tf(G.pendulum)} |`,
    `| ⑧ (E-S)(E-M) = 第352便h の otherSrc・(E-潮) = 第352便u の rateOf | ${tf(S.eSame)}・${tf(S.tSame)} | ${tf(G.callsSame)} |`,
    `| ⑨ 変異(トルクの符号を逆に —— 1/4 周期で 0 を横切らない) | ${tf(S.mFlip)} | ${tf(G.mutant)} |`,
    `| ⑩ 拒否(大きさの名・基準軸の名・周期 0・刻み・(B − A)/C 0・Ω_p 0) | ${S.rejects.filter(Boolean).length}/${S.rejects.length} | ${tf(G.rejects)} |`].join('\n');
  T.res = ['| 基準軸 | 背景の大きさ | u(銀河の公転の角速度の倍) | 背景 [rad/s] | 残り [rad/s] | (L2) 残り ÷ 背景 |', '|---|---|---|---|---|---|',
    ...J.t0.map((r) => `| ${AXN[r.axis]} | ${MAGN[r.magId]} | ${fe(r.u)} | ${fe(r.bgMag)} | ${fe(r.res)} | ${r.magId === 'uV' ? r.L2.toFixed(6) : f3(r.L2)} |`)].join('\n');
  const FAM = Object.freeze({ 'E-S': '(E-S) 地球の自転の分の軸引きずり(主の候補)', 'E-M': '(E-M) 地球との相対の運動の分(比べる列)', 'E-g': '(E-g) 地球の重力 × (B − A)/C(比べる列 —— DFM の式ではない)', 'E-潮': '(E-潮) 太陽の重力の潮汐のトルク(比べる列 —— DFM の式ではない)' });
  T.ratio = ['| 候補 | 量 | (B − A)/C(ノブ —— 値は未照合) | 値 | 単位 | ÷ 残り (uV) | ÷ 残り 0.835 | ÷ 残り 0.98 |', '|---|---|---|---|---|---|---|---|',
    ...J.t1.map((r) => `| ${FAM[r.fam]} | ${r.note}${r.kind === 'axis' ? '・軸を動かす率' : '・自転の率の尺度'} | ${r.q === undefined ? '—' : fe(r.q)} | ${fe(r.v)} | ${r.unit} | ${fe(r.over_uV)} | ${fe(r.over_u0835)} | ${fe(r.over_u098)} |`)].join('\n');
  T.width = ['| (B − A)/C(ノブ —— 値は未照合) | Ω_p = 共鳴の幅(自転の率の半幅)[rad/s] | 秤動の周期 [年] | 幅の周期の半幅 [日] | K ÷ (C ω_res) [1/s] | (L3) ' + PROV + ' いまのずれ ÷ 幅 | 幅の内か |', '|---|---|---|---|---|---|---|',
    ...J.t2.map((r) => `| ${fe(r.q)} | ${fe(r.OmP)} | ${fe(r.libYr)} | ${fe(r.dPday)} | ${fe(r.fracRate)} | ${f3(r.L3)} | ${r.inside ? '内' : '外'} |`)].join('\n');
  const NUN = (r) => (r.nuId === 'now' ? 'いまのずれ ' + PROV + '(' + f3(r.nuOverOmP) + ' Ω_p)' : r.nuOverOmP + ' Ω_p');
  T.cap = ['| (B − A)/C | 初めのずれ ν₀ | 初めの位相 x₀ の数 | 拘束される | 回り続ける | 分界の近く(数えない) | 步と捕まる条件の一致 |', '|---|---|---|---|---|---|---|',
    ...J.cap.map((r) => `| ${fe(r.q)} | ${NUN(r)} | ${r.n} | ${r.bound} | ${r.circ} | ${r.near} | ${r.agree}/${r.n - r.near} |`)].join('\n');
  T.off = ['| 基準軸 | 残り (uV) [rad/s] | 残り 0.98 [rad/s] | 0.98 ÷ (uV)(軸の拘束は何倍) | (L2) (uV) | (L2) 0.98 | (E-S) 内合 ÷ 残り (uV) | (E-S) 内合 ÷ 残り 0.98 |', '|---|---|---|---|---|---|---|---|',
    ...J.t3.map((r) => `| ${AXN[r.axis]} | ${fe(r.resUV)} | ${fe(r.res098)} | ${fe(r.gain)} | ${r.L2uV.toFixed(6)} | ${f3(r.L2_098)} | ${fe(r.esUV)} | ${fe(r.es098)} |`)].join('\n');
  return T;
}

/** 数の文(節に逐語) */
export function factsOf(J) {
  const F = {}, c = (id) => J.t1.find((r) => r.id === id), w = (q) => J.t2.find((r) => r.q === q), o = J.t3.find((r) => r.axis === 'L');
  F.ratio = `- 主の列(基準軸 L・(uV))の残りは ${fe(J.t0[0].res)} rad/s(背景の ${J.t0[0].L2.toFixed(4)})。地球の自転の分 (E-S) は、内合の時 ${fe(c('ES_inf').v)} rad/s・1 会合の平均 ${fe(c('ES_mean').v)} rad/s —— 残りの ${fe(c('ES_inf').over_uV)} 倍・${fe(c('ES_mean').over_uV)} 倍。比べる列の (E-M) は内合の時に残りの ${fe(c('EM_inf').over_uV)} 倍・(E-潮) は ${fe(c('Etide').over_uV)} 倍・(E-g) の共鳴の幅は ${fe(c('Eg_OmP_1e-7').over_uV)}〜${fe(c('Eg_OmP_0.00001').over_uV)} 倍(量の種類が違う列 —— 同じ rad/s で並べただけ)。`;
  const need = (q) => q * w(q).L3 * w(q).L3;
  F.width = `- (E-g) の共鳴の幅(自転の率の半幅)は、(B − A)/C = 1e-7・1e-6・1e-5 で ${fe(w(1e-7).OmP)}・${fe(w(1e-6).OmP)}・${fe(w(1e-5).OmP)} rad/s(周期の半幅 ${fe(w(1e-7).dPday)}・${fe(w(1e-6).dPday)}・${fe(w(1e-5).dPday)} 日・秤動の周期 ${fe(w(1e-7).libYr)}・${fe(w(1e-6).libYr)}・${fe(w(1e-5).libYr)} 年)。いまの仮の周期(共鳴の周期から ${Math.abs(J.lock.dP).toFixed(3)} 日)は幅の ${f3(Math.abs(w(1e-7).L3))}・${f3(Math.abs(w(1e-6).L3))}・${f3(Math.abs(w(1e-5).L3))} 倍の外 ${PROV}。幅の内に入るのに要る (B − A)/C は ${fe(need(1e-6))} の桁(この模型では)。`;
  const cp = (q, id) => J.cap.find((r) => r.q === q && r.nuId === id);
  F.cap = `- 振り子の形の步(内合ごとに 1 步)では、初めのずれ 0 で ${cp(1e-6, 'f0').bound}/${cp(1e-6, 'f0').n} が拘束される・0.5 Ω_p で ${cp(1e-6, 'f0.5').bound}・0.9 Ω_p で ${cp(1e-6, 'f0.9').bound}・1.1 Ω_p と 2 Ω_p で ${cp(1e-6, 'f1.1').bound}・${cp(1e-6, 'f2').bound}(初めの位相 ${cp(1e-6, 'f0').n} 点・(B − A)/C の 3 つの格子で${J.decl.qGrid.every((q) => J.decl.nuGrid.every((f) => cp(q, 'f' + f).bound === cp(1e-6, 'f' + f).bound)) ? '同じ数' : '数が違う(表 6)'})。いまのずれ ${PROV} では、(B − A)/C = 1e-5 でも ${cp(1e-5, 'now').circ}/${cp(1e-5, 'now').n} が回り続ける(1e-6 で ${cp(1e-6, 'now').circ}・1e-7 で ${cp(1e-7, 'now').circ})。`;
  F.off = `- 背景を金星の条件から外して u = 0.98 に置くと、残りは ${fe(o.res098)} rad/s —— 軸の拘束は (uV) の ${fe(o.gain)} 倍・(L2) は ${o.L2uV.toFixed(4)} から ${f3(o.L2_098)} に。地球の自転の分 (E-S) ÷ 残りは ${fe(o.esUV)} から ${fe(o.es098)} に下がる。「釣り合っているから地球の影響が出る」の読みを拘束の比で書くと、釣り合い(打ち消し)で拘束が ${fe(o.gain)} 分の 1 になり、(E-S) ÷ 残りが同じ倍だけ上がる —— それでも (E-S) は残りの ${fe(o.esUV)} 倍。`;
  return F;
}
