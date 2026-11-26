// 第356便d(統括の検証項目 R516): 「斥力に見えたのは引きずり」の診断の文書の lib —— 原文・引きずりの口の表・表 7 本・数の文・表 6d を正本から作る(import しない・ファイルを読まない)。
export const DOC_VERSION = 'w356d-drageosdoc-1';

/** 原文(言葉を変えずに引く —— 公開の文書〔docs/PHYSICS.md・docs/PAPER_PLAN.md〕に在る字から写した) */
export const ORIGINAL = Object.freeze([
  Object.freeze(['原仮定者の回答(2026-11-26)', 'AN1145: 次点。「斥力に見えたのは引きずり」と言う流れ']),
  Object.freeze(['原仮定者の回答(2026-11-22)', 'もしも気体の圧力が粒子間の斥力なら']),
  Object.freeze(['原仮定者の整理(2026-11-23)', '引きずりは、相対的な座標の時間差分に由来する座標変換である。座標変換は熱を生まない。ただし、座標の変化で潮汐力が発生すると、熱や潮汐ロックが生じる。同様に、ジャイロトルクも、熱や自転を生じる経路になる']),
]);
export const READINGS = Object.freeze([
  '論文 5 は入口の思考実験から「斥力に見えたのは引きずり」へ進む。「引きずり」をどの項で読むかは決めていない —— 本節は候補の列 (D)(S1)(S2) を器に並べて数える(列は選ばない)',
  '入口の思考実験(文は変えない)。本節の器は斥力の項を 0 にして、引きずりの口だけを足す',
  '引きずりは座標変換として入れる(位置の進み = 慣性の速さ + 引きずりの速さ —— 慣性の速さ・内部の温度・スピンを直接は変えない)。熱を生まないことを門で数える。壁(外の場)の中での座標の変化が並進の運動エネルギーを動かす量は、門とは別に記録する',
]);
export function originalTable() {
  return ['| 出どころ | 原文 | 読み |', '|---|---|---|'].concat(ORIGINAL.map(([s, o], k) => `| ${s} | 「${o}」 | ${READINGS[k]} |`)).join('\n');
}

/** 引きずりの口(式の候補 —— 決め打ちしない) */
export const TERMS = Object.freeze([
  ['(D) 並進引きずり', 'u_i = c_D Σ_j w_ij (v_j − v_i) ÷ (w_ii + Σ_j w_ij)・w_ij = m_j ÷ d_ij^n(自分を含む —— 自分の重み w_ii は〔第337便e〕の B)', 'c_D 1(0.25・0.5)・n 2(1)', '定義のまま(〔第337便e〕の `cellDrag` と同じ式 —— 零試験)'],
  ['(S1) 引きずる側の回転の分', 'u_i = c_S1 Σ_j w_ij (s_j × (p_i − p_j)) ÷ (w_ii + Σ_j w_ij)((D) と同じ重みと分母)', 'c_S1 1(0.5)', 'スピンを逆にすると向きが逆'],
  ['(S2) スピン斥力の式を引きずりの速さに', 'u_i = c_S2 τ_s Σ_j k_rep μ_ij (ω_i² + ω_j²)(p_i − p_j) ÷ m_i・ω_a = abs(s_a) g_a(E5′ の向きと大きさ —— 運動量と熱の台帳には入れない)', 'c_S2 1(0.3)・τ_s = 1 ÷ s₀(1)', 'スピンを逆にしても同じ(ω² の式)'],
  ['読み(主)座標変換', 'x ← x + h (v + u)(慣性の速さ・内部の温度・スピンは変えない)', '—', '本節の表の主の口'],
  ['読み(比べる口)力として効く形', 'v ← v + h u ÷ τ_F(τ_F 1)・失った並進の運動エネルギーは内部の温度へ(熱の口)', '—', 'ノブの表と門の表にだけ'],
]);
export function termsTable() {
  return ['| 口 | 式 | 係数(既定・振った値) | 備考 |', '|---|---|---|---|'].concat(TERMS.map((r) => '| ' + r.join(' | ') + ' |')).join('\n');
}

const f3 = (x) => (x === null || x === undefined) ? '—' : (x === 0 ? '0' : x.toFixed(3));
const f4 = (x) => (x === null || x === undefined) ? '—' : x.toFixed(4);
const sc = (x, f) => (x === 0 ? '散る(0 と書いた)' : f(x));   // 0 と書いた葉(settle —— 走り直しで大きく散る量)
const fe = (x) => (x === null || x === undefined) ? '—' : (Math.abs(x) >= 1e4 ? x.toExponential(2) : x.toFixed(2));
const yn = (b) => b ? '内' : '外';
const deg = (t) => (t === null || t === undefined) ? '—' : (t * 180 / Math.PI).toFixed(2) + '°';
const ID_NAME = Object.freeze({ T: '(T)', TD: '(T+D)', 'TS-S1': '(T+S1)', 'TS-S1r': '(T+S1) スピン逆', 'TS-S2': '(T+S2)', 'TDS-S1': '(T+D+S1)', 'TDS-S1r': '(T+D+S1) スピン逆', 'TDS-S2': '(T+D+S2)', 'TD/force': '(T+D) 力として効く形' });
const nm = (id) => ID_NAME[id] || id;

/** 表(正本から) */
export function tablesOf(J) {
  const T = {};
  T.pair = ['| 条件 | 衝突径数 | 最接近の距離 | (T) との差 | 印(距離) | 入る時の座標の相対の速さ | 出る時 | 出る向きの曲がり | 印(曲がり) |', '|---|---|---|---|---|---|---|---|---|']
    .concat(J.pair.rows.filter((r) => r.hf === 1).map((r) => `| ${nm(r.id)} | ${r.b} | ${f4(r.minD)} | ${r.dMinD >= 0 ? '+' : ''}${f4(r.dMinD)} | ${r.markD} | ${f3(r.vIn)} | ${r.escaped ? f3(r.vOut) : '出ない'} | ${r.escaped ? deg(r.theta) : '—'} | ${r.markTheta} |`)).join('\n');
  T.box = ['| 条件 | 圧力(ρ 0.08) | P ÷ (ρ T) | (T) との比 | 密度への冪(箱を振る) | 密度への冪(粒の数を振る) | 温度への冪 | 窓 0.9〜1.1(3 つの冪) |', '|---|---|---|---|---|---|---|---|']
    .concat(J.box.filter((r) => r.hf === 1).map((r) => `| ${nm(r.id)} | ${r.pMid.toPrecision(4)} | ${f3(r.pOverRhoTMid)} | ${f3(r.pRatioT)} | ${f3(r.aBox)} | ${f3(r.aN)} | ${sc(r.aT, f3)} | ${yn(r.inWin)} |`)).join('\n');
  T.big = ['| 条件 | 粒 64 の箱を振る冪 | 粒 216 の箱を振る冪 | 動き(216 − 64) | 粒 216 で窓 0.9〜1.1 |', '|---|---|---|---|---|']
    .concat(J.big.map((r) => `| ${nm(r.id)} | ${f3(r.aBox64)} | ${f3(r.aBox)} | ${r.shift >= 0 ? '+' : ''}${r.shift.toFixed(3)} | ${yn(r.inWin)} |`)).join('\n');
  T.knob = ['| ノブの行 | 圧力(ρ 0.08・粒 64) | P ÷ (ρ T) | (T) との比 | 並進の温度(測った) |', '|---|---|---|---|---|']
    .concat(J.knob.map((r) => `| ${r.id} | ${r.P.toPrecision(4)} | ${f3(r.pOverRhoT)} | ${f3(r.pRatioT)} | ${f3(r.Ttr)} |`)).join('\n');
  T.gate = ['| 走行 | 刻み | 内部の温度の和の増減 | スピンのエネルギーの増減 | 並進の運動エネルギーの増減 | 壁の位置のエネルギーの増減 | 和の増減 | 和の増減 − (T) の和の増減 | 熱の口へ積んだ量 | 出どころなしの増え | 門 |', '|---|---|---|---|---|---|---|---|---|---|---|']
    .concat(J.gate.map((r) => `| ${nm(r.id)} | ${r.hf === 1 ? 'h' : 'h/2'} | ${r.dTint === 0 ? '0' : f3(r.dTint)} | ${r.dEs === 0 ? '0' : f3(r.dEs)} | ${r.scatter && r.dKE === 0 ? '散る(0 と書いた)' : fe(r.dKE)} | ${r.scatter && r.dPE === 0 ? '散る(0 と書いた)' : fe(r.dPE)} | ${r.scatter && r.dE === 0 ? '散る(0 と書いた)' : fe(r.dE)} | ${r.dEoverT === null ? '—' : fe(r.dEoverT)} | ${fe(r.heatIn)} | ${fe(r.gainNoSrc)} | ${/\/force$/.test(r.id) ? '比べる口' : (r.noHeat ? '真' : '偽')} |`)).join('\n');
  T.step = ['| 条件 | 圧力 h ・ h/2 | 箱を振る冪 h ・ h/2 | 粒の数を振る冪 h ・ h/2 | 温度への冪 h ・ h/2 | 最接近の距離の相対の差(最大) | 刻みに依る量(相対の差 > 0.05) |', '|---|---|---|---|---|---|---|']
    .concat(J.step.map((r) => `| ${nm(r.id)} | ${r.pMid[0].toPrecision(4)} ・ ${r.pMid[1].toPrecision(4)} | ${f3(r.aBox[0])} ・ ${f3(r.aBox[1])} | ${f3(r.aN[0])} ・ ${f3(r.aN[1])} | ${sc(r.aT[0], f3)} ・ ${sc(r.aT[1], f3)} | ${r.rel.minD.toFixed(4)} | ${r.stepDep.length ? r.stepDep.join('・') : '—'} |`)).join('\n');
  const c = J.cmp;
  T.cmp = ['| 比べる列(〔第355便i〕の正本から —— 走らせ直さない) | P ÷ (ρ T)(ρ 0.08) | 密度への冪(箱を振る) | 密度への冪(粒の数を振る) | 温度への冪 |', '|---|---|---|---|---|',
    `| いまの形の斥力(強さ 1 倍)+ 並進 —— 全体の圧力(表 A7 の ${c.a7.id}) | ${f3(c.a7.pOverRhoTMid)} | ${f3(c.a7.aBox)} | ${f3(c.a7.aN)} | ${f3(c.a7.aT)} |`,
    `| 同じ組の斥力の分(表 A7 の数) | — | ${f3(c.a7.aBoxRep)} | ${f3(c.a7.aNRep)} | ${f3(c.a7.aTRep)} |`,
    `| 表 B の ${c.b.col} の倍 ${c.b.mult}(〔第355便g〕の列 —— 密度の格子 0.02・0.04・0.08) | ${f3(c.b.pOverRhoT)} | ${f3(c.b.aRho)} | — | — |`].join('\n');
  return T;
}
const P = (J, id, b) => J.pair.rows.find((r) => r.id === id && r.b === b && r.hf === 1);
const B = (J, id) => J.box.find((r) => r.id === id && r.hf === 1);
/** 数の文(正本から) */
export function factsOf(J) {
  const F = {}, ds = J.pair.dStar, bs = [...new Set(J.pair.rows.map((r) => r.b))];
  const capD = bs.filter((b) => !P(J, 'TD', b).escaped), passD = bs.filter((b) => P(J, 'TD', b).escaped);
  F.pairD = `近づく 2 粒(壁なし・相対の速さ 1)で (T+D) は、最接近の距離が (T) の衝突径数と d★ = ${f3(ds)}(2 粒の座標の相対の速さが 0 になる距離 —— 自分の重み w_ii = 1 ÷ d★²)の大きい方になる(衝突径数 ${bs.map((b) => b + ' → ' + f4(P(J, 'TD', b).minD)).join('・')})。衝突径数 ${capD.join('・')} では d★ で止まって出ていかない・${passD.join('・')} では曲がらずに通り過ぎる(曲がり ${passD.map((b) => deg(P(J, 'TD', b).theta)).join('・')})。`;
  const s1 = bs.map((b) => `${b}: ${f3(P(J, 'TS-S1', b).minD)}・${deg(P(J, 'TS-S1', b).theta)}/逆 ${f3(P(J, 'TS-S1r', b).minD)}・${deg(P(J, 'TS-S1r', b).theta)}`);
  F.pairS1 = `(T+S1) は、遠くから 2 粒を互いのまわりに回して進路をずらす —— 衝突径数ごとの最接近の距離と曲がり(スピン ẑ/スピン逆): ${s1.join(' ; ')}。曲がりの向きはスピンの向きで入れ替わる(外へ曲がるか内へ曲がるかはスピンの向きで決まる)。`;
  const capS2 = bs.filter((b) => !P(J, 'TS-S2', b).escaped);
  F.pairS2 = `(T+S2) は、最接近の距離が (T) より大きい(${bs.map((b) => b + ' → ' + f3(P(J, 'TS-S2', b).minD)).join('・')})が、出ていった対の曲がりは ${bs.filter((b) => P(J, 'TS-S2', b).escaped).map((b) => deg(P(J, 'TS-S2', b).theta)).join('・')}(入る向きとほぼ同じ向きへ出る)・衝突径数 ${capS2.join('・') || '—'} では押し返しと慣性の近づきが釣り合う距離で止まって出ていかない(座標変換の口では慣性の速さが変わらない)。`;
  const t = B(J, 'T');
  F.box = `粒 64 の箱(刻み h 0.02)で、(T) は P ÷ (ρ T) ${f3(t.pOverRhoTMid)}・3 つの冪 ${f3(t.aBox)}・${f3(t.aN)}・${f3(t.aT)}。引きずりを足した条件の (T) との圧力の比は ${['TD', 'TS-S1', 'TS-S1r', 'TS-S2', 'TDS-S1', 'TDS-S2'].map((id) => nm(id) + ' ' + f3(B(J, id).pRatioT)).join('・')}。3 つの冪が窓 0.9〜1.1 に入る条件は ${J.summary.boxInWin.map(nm).join('・')}(斥力の項は 0 のまま)。`;
  const gm = J.gate.filter((r) => !/\/(clip|force)$/.test(r.id));
  F.gate = `熱を生まないことの検査: 座標変換の口の走行 ${gm.length} 本(条件 8 × 刻み h・h/2)で、内部の温度の和の増減とスピンのエネルギーの増減は全部 0(門 ${J.summary.noHeatMain ? '真' : '偽'})。並進の運動エネルギーと壁の位置のエネルギーの和は、(T) では ${J.summary.dET.map((x) => x.toFixed(2)).join('・')}(h・h/2 —— 初めの和 ${(gm[0].ke0 + gm[0].pe0).toFixed(1)})に対し、引きずりの走行では (T) との差が ${fe(J.summary.dEminMain)}〜${fe(J.summary.dEmaxMain)}(走り直しで大きく散って 0 と書いた行 ${J.summary.scatter.length ? J.summary.scatter.map((s) => nm(s.split('@')[0]) + (s.endsWith('/2') ? '(h/2)' : '(h)')).join('・') : '無し'})—— 壁(外の場)の中で引きずりが位置を運ぶと、壁の力が並進の運動エネルギーを動かす。壁の中の奥へ向く引きずりを 0 にするノブ(clip)では差が ${J.gate.filter((r) => /\/clip$/.test(r.id)).map((r) => nm(r.id.split('/')[0]) + ' ' + (r.dEoverT === null ? '散る' : fe(r.dEoverT))).join('・')}。力として効く形(比べる口)では内部の温度の和が ${J.summary.noHeatForce.map((r) => nm(r.id.split('/')[0]) + ' +' + f3(r.dTint) + (r.gainNoSrc > 0 ? '(出どころなしの並進の増え ' + fe(r.gainNoSrc) + ')' : '')).join('・')} 増える。`;
  F.step = `刻み h と h/2 の相対の差が 0.05 を越える量: ${J.summary.stepDep.length ? J.summary.stepDep.map((r) => nm(r.id) + '(' + r.what.join('・') + ')').join('・') : '無し'} —— 「刻みに依る」の印。`;
  const c = J.cmp;
  F.cmp = `比べる列(〔第355便i〕の正本から読んだ数): いまの形の斥力(強さ 1 倍)+ 並進の全体の圧力は P ÷ (ρ T) ${f3(c.a7.pOverRhoTMid)}・3 つの冪 ${f3(c.a7.aBox)}・${f3(c.a7.aN)}・${f3(c.a7.aT)}。`;
  return F;
}
/** PAPER_PLAN の論文 5 の節の表 6d(短い表) */
export function table6d(J) {
  const head = ['| 条件(斥力 0・粒 64・刻み 0.02) | 近づく 2 粒: 最接近の距離(衝突径数 0・1) | 曲がり(衝突径数 1) | 箱: (T) との圧力の比 | 3 つの冪(箱・粒の数・温度) | 内部の温度とスピンの増減 |', '|---|---|---|---|---|---|'];
  const rows = ['T', 'TD', 'TS-S1', 'TS-S1r', 'TS-S2', 'TDS-S1'].map((id) => { const p0 = P(J, id, 0), p1 = P(J, id, 1), b = B(J, id), g = J.gate.find((r) => r.id === id && r.hf === 1);
    return `| ${nm(id)} | ${f3(p0.minD)}${p0.escaped ? '' : '(出ない)'}・${f3(p1.minD)} | ${p1.escaped ? deg(p1.theta) : '出ない'} | ${f3(b.pRatioT)} | ${f3(b.aBox)}・${f3(b.aN)}・${sc(b.aT, f3)} | ${g.noHeat ? '0' : '増減あり'} |`; });
  const c = J.cmp;
  rows.push(`| 比べる列: いまの形の斥力(強さ 1 倍)+ 並進(〔第355便i〕) | — | — | — | ${f3(c.a7.aBox)}・${f3(c.a7.aN)}・${f3(c.a7.aT)} | — |`);
  return head.concat(rows).join('\n');
}
