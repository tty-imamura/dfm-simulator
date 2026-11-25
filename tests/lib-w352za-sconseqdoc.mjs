// 第352便za(原仮定者の回答(2026-11-24 —— 第148報)・統括の検証項目 R463):
// **正本 tests/out/sconseq-352za.json から PHYSICS〔第352便za〕の表を作る文書の lib**
// (QA docs.sconseq352za が節の表と逐語で照合する —— 表の数は有効数字 3 桁)。原文(言葉を変えずに引く)と読みの表もここに持つ。
export const DOC_VERSION = 'w352za-sconseqdoc-1';
const fin = (x) => typeof x === 'number' && Number.isFinite(x);
const fe = (x) => (!fin(x) ? '—' : x === 0 ? '0' : Number(x).toExponential(2));
const tf = (x) => (x === true ? '真' : x === false ? '偽' : '—');
const fl9 = (x) => (!fin(x) ? '—' : x === 0 ? '0' : x < 1e-9 ? '< 1e-9' : Number(x).toExponential(1));
const fl12 = (x) => (!fin(x) ? '—' : x === 0 ? '0' : x < 1e-12 ? '< 1e-12' : Number(x).toExponential(1));
const COLN = Object.freeze({ MS: '(MS)(第351便の列)', Srule: '(S) 規則の半径', Sobs: '(S) 観測の半径' });
const KEYN = Object.freeze({ 'Io|Jupiter': 'イオ', 'Venus|Sun': '金星', 'Jupiter|Sun': '木星', 'Earth|Sun': '地球', 'Mercury|Sun': '水星' });
const BGN = Object.freeze({ NpL: '(N+) L', NpEq: '(N+) eq', Gm: '(G−)', null: '背景なし' });
const MAGN = Object.freeze({ uV: '(uV)', u1: '倍率 1', null: '—' });
const star = (r) => fe(r.v) + (r.band ? ' ★' : '');

/** 原文(言葉を変えずに引く) */
export const ORIGINAL = Object.freeze([
  Object.freeze(['原仮定者の回答(2026-11-24 —— 第148報)', 'AN1015: Bで進める。銀河由来の軸引きずりも、(S)だけを数えると弱いと推測する']),
  Object.freeze(['原仮定者の回答(2026-11-15 —— 第138報の回答 4)', 'イオは潮汐ロックしているので、内部熱の検証用']),
  Object.freeze(['原仮定者の整理(2026-11-23 —— 第146報)', '軸が動かなかった分のエネルギーは消えない。エネルギーの行き先は、内部熱か、自転の「慣性回転」。自転速度が増すと、軸を起こす為のトルクが増して釣り合う。行き先を「引きずり回転」とする比較も行う']),
  Object.freeze(['原仮定者の整理(2026-11-23 —— 第146報)', '引きずりは、相対的な座標の時間差分に由来する座標変換である。座標変換は熱を生まない。ただし、座標の変化で潮汐力が発生すると、熱や潮汐ロックが生じる。同様に、ジャイロトルクも、熱や自転を生じる経路になる']),
]);
/** 統括の読み(原文と分ける)—— [読み, 数えた所] */
export const READINGS = Object.freeze([
  Object.freeze(['局所の軸引きずりの主の成分 = (S)(源の自転の分)。これまでの題の数(第350便・第351便 —— 成分 (MS))を、成分を明示する新しい列で数え直す。「(S)だけなら弱い」は予想の文', '表 3・表 4']),
  Object.freeze(['イオの内部熱を物差しに置く題(恒久の文)。供給を全部熱に入れた最大を、成分と背景の列で並べる', '表 2・表 4']),
  Object.freeze(['供給の行き先の 2 つ(内部熱・慣性回転)。慣性回転の側は、自転の率が年齢の間に変わり得る割合で読む(供給の則は仮定の列 (P1)・対照 (P0))', '表 2・表 3']),
  Object.freeze(['供給の則の出どころは決まっていない(経路 ①・② のトルクの自転への仕事率は 0 —— 〔第351便g〕)。表の熱は仮定の則の最大', '表 2']),
]);
export function originalTable(readings = READINGS) {
  return ['| # | 出どころ | 原文(言葉を変えずに引く) | 読み(統括の読み —— 原文と分ける) | 数えた所 |', '|---|---|---|---|---|',
    ...ORIGINAL.map(([src, o], k) => `| ${k + 1} | ${src} | 「${o}」 | ${readings[k][0]} | ${readings[k][1]} |`)].join('\n');
}

export function tablesOf(J) {
  const T = {}, S = J.pure.scenes, G = J.pure.gates;
  T.pure = ['| 零試験・場面 | 値 | 門 |', '|---|---|---|',
    `| ① (MS) を明示する地球の太陽由来 = 第351便c の pairParts(相対差) | ${fl9(S.earthMS)} | ${tf(G.earthMS)} |`,
    `| ② (S) 規則の半径の地球の太陽由来 = 第351便c の pairParts の (S) | ${fl9(S.earthS)} | ${tf(G.earthS)} |`,
    `| ③ (MS) のイオの太陽由来 + 母天体由来 = 第351便c の pairParts | ${fl9(S.ioMS)} | ${tf(G.ioMS)} |`,
    `| ④ イオの (P1)・(MS)・局所だけ = 第351便g の潮汐ロックの表 | ${fl9(S.ioHeatLoc)} | ${tf(G.ioHeatLoc)} |`,
    `| ⑤ イオの (P1)・(MS)・局所 + 背景 = 第351便g の表(2.79 W) | ${fl9(S.ioHeatBg)} | ${tf(G.ioHeatBg)} |`,
    `| ⑥ イオの (P1)・(S)・局所だけ = 第351便g の表 | ${fl9(S.ioHeatS)} | ${tf(G.ioHeatS)} |`,
    `| ⑦ 太陽を受け手にした (S)(規則の半径)= 第352便e の rotOf | ${fl9(S.sunRotS)} | ${tf(G.sunRotS)} |`,
    `| ⑧ 太陽を受け手にした (MS) の 8 惑星の和 = 第352便e の sunLocal | ${fl9(S.sunSumMS)} | ${tf(G.sunSumMS)} |`,
    `| ⑨ 金星の条件の倍率: (S) 規則・(MS)・1 ÷ (S) 観測 | ${fe(S.uVrule)}・${fe(S.uVms)}・${fe(1 / S.uVobs)} | ${tf(G.uV)} |`,
    `| ⑩ 直交成分を局所と背景で分けて作る = 合成から作る(打ち消しの無い組) | ${fl9(S.perpLin)} | ${tf(G.perpLin)} |`,
    `| ⑪ 供給 0 の対照 (P0) | ${fe(S.p0)} | ${tf(G.p0)} |`,
    `| ⑫ (P1) は局所の係数 k の 2 乗(k 2 で 4 倍) | ${fl9(S.k2)} | ${tf(G.k2)} |`,
    `| ⑬ 輪の (M) は法線に沿う(直交成分 ÷ 大きさ —— 土星の環・地球の道の輪) | ${fl12(S.ringMperp)} | ${tf(G.ringM)} |`,
    `| ⑭ 拒否(列の名・背景の名・大きさの名・題の名) | ${S.reject.filter(Boolean).length}/${S.reject.length} | ${tf(G.reject)} |`].join('\n');
  // 表 2: 内部熱と供給
  const h = (key, col, bg, mag) => J.t1.find((r) => r.key === key && r.col === col && r.bg === bg && r.mag === mag);
  T.heat = ['| 受け手 | 成分 | 熱の物差し [W](文献の値・未照合) | 背景なし [W] | 背景なし ÷ 物差し | (N+) L: (uV)・倍率 1(÷ 物差し) | (N+) eq: (uV)・倍率 1 | (G−): (uV)・倍率 1 | (G−) 倍率 1 [W] | (P0) [W] |', '|---|---|---|---|---|---|---|---|---|---|',
    ...J.decl.heatBodies.flatMap((key) => J.decl.cols.map((col) => { const z = h(key, col, null, null), p = (bg) => `${fe(h(key, col, bg, 'uV').overLit)}・${fe(h(key, col, bg, 'u1').overLit)}`;
      return `| ${KEYN[key]} | ${COLN[col]} | ${fe(z.heatRuler)} | ${fe(z.heatW)} | ${fe(z.overLit)} | ${p('NpL')} | ${p('NpEq')} | ${p('Gm')} | ${fe(h(key, col, 'Gm', 'u1').heatW)} | ${fe(z.p0W)} |`; }))].join('\n');
  // 表 3: 慣性回転
  T.spin = ['| 受け手 | 成分 | 背景 | 大きさ | Ω∥ ÷ ω(引きずり回転 ÷ 自転の率) | 年齢の間に自転の率が変わり得る割合((P1) を全部慣性回転に) | 逆になるのに要る時間 ÷ 年齢 |', '|---|---|---|---|---|---|---|',
    ...J.t2.map((r) => `| ${KEYN[r.key]} | ${COLN[r.col]} | ${BGN[r.bg]} | ${MAGN[r.mag]} | ${fe(r.parOverW)} | ${fe(r.fracAge)} | ${fe(r.revOverAge)} |`)].join('\n');
  // 表 4: 題ごとのまとめ
  const s = (t, col, bg, mag) => J.t3.find((r) => r.topic === t && r.col === col && r.bg === bg && r.mag === mag);
  T.sum = ['| 題 | 成分 | (N+) L: (uV) | (N+) L: 倍率 1 | (N+) eq: (uV) | (N+) eq: 倍率 1 | (G−): (uV) | (G−): 倍率 1 | 物差し | 出どころ |', '|---|---|---|---|---|---|---|---|---|---|',
    ...J.topics.flatMap((tp) => J.decl.cols.map((col) => `| ${tp.label} | ${COLN[col]} | ${star(s(tp.id, col, 'NpL', 'uV'))} | ${star(s(tp.id, col, 'NpL', 'u1'))} | ${star(s(tp.id, col, 'NpEq', 'uV'))} | ${star(s(tp.id, col, 'NpEq', 'u1'))} | ${star(s(tp.id, col, 'Gm', 'uV'))} | ${star(s(tp.id, col, 'Gm', 'u1'))} | ${tp.ruler} | ${tp.src} |`))].join('\n');
  // 表 5: k を金星の条件で置いたとき
  const k = (t, col, bg) => J.t4.find((r) => r.topic === t && r.col === col && r.bg === bg), ov = (r) => fe(r.v) + (r.over ? ' ▲' : '') + (r.band ? ' ★' : '');
  T.k = ['| 題 | 成分 | k(局所だけに掛ける) | (N+) L | (N+) eq | (G−) | 局所だけ(背景 0)(N+) L の物差しで | k 1 のとき (N+) L |', '|---|---|---|---|---|---|---|---|',
    ...J.topics.flatMap((tp) => J.decl.cols.map((col) => { const a = k(tp.id, col, 'NpL');
      return `| ${tp.label} | ${COLN[col]} | ${fe(a.k)} | ${ov(a)} | ${ov(k(tp.id, col, 'NpEq'))} | ${ov(k(tp.id, col, 'Gm'))} | ${a.vLoc === null ? '—' : fe(a.vLoc) + (a.locOver ? ' ▲' : '')} | ${fe(a.k1v)} |`; }))].join('\n');
  return T;
}

/** 数の文(節に逐語) */
export function factsOf(J) {
  const F = {}, h = (key, col, bg, mag) => J.t1.find((r) => r.key === key && r.col === col && r.bg === bg && r.mag === mag);
  const s = (t, col, bg, mag) => J.t3.find((r) => r.topic === t && r.col === col && r.bg === bg && r.mag === mag), k = (t, col, bg) => J.t4.find((r) => r.topic === t && r.col === col && r.bg === bg);
  const io = (col) => h('Io|Jupiter', col, null, null);
  F.heat = `- イオの (P1) を全部熱に入れた最大は、局所だけで (MS) ${fe(io('MS').heatW)} W・(S) 規則の半径 ${fe(io('Srule').heatW)} W・(S) 観測の半径 ${fe(io('Sobs').heatW)} W(熱の物差しの ${fe(io('MS').overLit)}・${fe(io('Srule').overLit)}・${fe(io('Sobs').overLit)} 倍)。背景 (G−) 倍率 1 を足すと 3 列とも ${fe(h('Io|Jupiter', 'Srule', 'Gm', 'u1').heatW)} W の桁(背景の分が大きい —— 物差しの ${fe(h('Io|Jupiter', 'Srule', 'Gm', 'u1').overLit)} 倍)。4 つの受け手・3 つの列・背景の組の中の最大は ${fe(Math.max(...J.t1.map((r) => r.overLit)))} 倍(${(() => { const m = J.t1.reduce((a, r) => (r.overLit > a.overLit ? r : a)); return KEYN[m.key] + '・' + COLN[m.col] + '・' + BGN[m.bg] + '・' + MAGN[m.mag]; })()})。`;
  const sp = (key, col, bg, mag) => J.t2.find((r) => r.key === key && r.col === col && r.bg === bg && r.mag === mag);
  F.spin = `- 金星の自転の率が年齢の間に変わり得る割合((P1) を全部慣性回転に入れた最大)は、局所だけで (MS) ${fe(sp('Venus|Sun', 'MS', null, null).fracAge)}・(S) 規則の半径 ${fe(sp('Venus|Sun', 'Srule', null, null).fracAge)}・(S) 観測の半径 ${fe(sp('Venus|Sun', 'Sobs', null, null).fracAge)}。逆になるのに要る時間は、背景 (G−) 倍率 1 で年齢の ${fe(sp('Venus|Sun', 'Srule', 'Gm', 'u1').revOverAge)} 倍・(MS) の局所だけで ${fe(sp('Venus|Sun', 'MS', null, null).revOverAge)} 倍。金星の行の最小は ${fe(Math.min(...J.t2.filter((r) => r.key === 'Venus|Sun').map((r) => r.revOverAge)))} 倍(${(() => { const m = J.t2.filter((r) => r.key === 'Venus|Sun').reduce((a, r) => (r.revOverAge < a.revOverAge ? r : a)); return COLN[m.col] + '・' + BGN[m.bg] + '・' + MAGN[m.mag]; })()})。`;
  const n3 = (col, mag) => J.t3.filter((r) => r.col === col && r.mag === mag && r.band).length, n3all = (col, mag) => J.t3.filter((r) => r.col === col && r.mag === mag).length;
  F.band = `- 物差しの 1e-3〜1e3 倍に入る欄(★)は、(uV) で (MS) ${n3('MS', 'uV')}/${n3all('MS', 'uV')}・(S) 規則 ${n3('Srule', 'uV')}/${n3all('Srule', 'uV')}・(S) 観測 ${n3('Sobs', 'uV')}/${n3all('Sobs', 'uV')}、倍率 1 で ${n3('MS', 'u1')}・${n3('Srule', 'u1')}・${n3('Sobs', 'u1')}。(uV) で (S) 規則の半径の列に入るのは金星の打ち消し(定義で 1)だけ。地球の歳差の率は (MS) (uV) で ${fe(s('prec', 'MS', 'NpL', 'uV').v)}・(S) 規則 ${fe(s('prec', 'Srule', 'NpL', 'uV').v)}・(S) 観測 ${fe(s('prec', 'Sobs', 'NpL', 'uV').v)}・倍率 1 で (S) の 2 列とも ${fe(s('prec', 'Srule', 'NpL', 'u1').v)}(背景の分が大きい)。`;
  const ov = (col) => J.t4.filter((r) => r.col === col && r.over).map((r) => r.topic), lo = (col) => J.t4.filter((r) => r.col === col && r.locOver && r.bg === 'NpL').map((r) => r.topic);
  const TL = Object.fromEntries(J.topics.map((t) => [t.id, t.label])), nm = (xs) => [...new Set(xs)].map((x) => TL[x]).join('・') || 'なし';
  F.k = `- k を金星の条件から置くと(背景 倍率 1)、k は (MS) ${fe(k('prec', 'MS', 'NpL').k)}・(S) 規則 ${fe(k('prec', 'Srule', 'NpL').k)}・(S) 観測 ${fe(k('prec', 'Sobs', 'NpL').k)}。局所の項だけで物差しを越える題は、(MS) ${nm(lo('MS'))}/(S) 規則 ${nm(lo('Srule'))}/(S) 観測 ${nm(lo('Sobs'))}((N+) L)。土星の環は (S) 観測で ${fe(k('ring', 'Sobs', 'NpL').v)} 倍・公転面の集まりは (S) 規則で ${fe(k('plane', 'Srule', 'NpL').vLoc)} 倍(局所だけ)。イオの内部熱は ${fe(Math.max(...J.t4.filter((r) => r.topic === 'ioHeat').map((r) => r.v)))} 倍以下・潮汐ロックは ${fe(Math.max(...J.t4.filter((r) => r.topic === 'lock').map((r) => r.v)))} 倍以下(どの列・どの背景でも)。`;
  return F;
}
