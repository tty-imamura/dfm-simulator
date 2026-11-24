// 第352便j(原仮定者の回答(2026-11-24 —— 第148報)・原仮定者の整理(2026-11-24 —— 第148報)・統括の検証項目 R447):
// **正本 tests/out/maintable-352j.json から PHYSICS〔第352便j〕の表と数の文を作る文書の lib**
// (QA docs.maintable352j が節の表と逐語で照合する —— 率は有効数字 3 桁・角は小数 3 桁〔0.001° より小さい角は有効数字 3 桁〕・cos は小数 3 桁)。原文(言葉を変えずに引く)と読みの表もここに持つ。
export const DOC_VERSION = 'w352j-maintabledoc-1';
const fin = (x) => typeof x === 'number' && Number.isFinite(x);
const fe = (x) => (!fin(x) ? '—' : x === 0 ? '0' : (x > 0 ? '+' : '') + Number(x).toExponential(2));
const fm = (x) => (!fin(x) ? '—' : x === 0 ? '0' : Number(x).toExponential(2));
const f3 = (x) => (!fin(x) ? '—' : Number(x).toFixed(3));
const dg = (x) => (!fin(x) ? '—' : Math.abs(x) < 1e-3 ? (x === 0 ? '0' : Number(x).toExponential(2)) : Number(x).toFixed(3));
const dd = (x) => (!fin(x) ? '—' : (x > 0 ? '+' : x < 0 ? '−' : '') + (Math.abs(x) < 1e-3 ? (x === 0 ? '0' : Math.abs(x).toExponential(1)) : Math.abs(x).toFixed(2)));
const sm = (x) => (!fin(x) ? '—' : Math.abs(x) < 1e-12 ? '< 1e-12' : Number(x).toExponential(2));
const tf = (x) => (x === true ? '真' : x === false ? '偽' : '—');
const pm = (x) => (x === 1 ? '+' : x === -1 ? '−' : x === 0 ? '0' : '—');
const yn = (x) => (x === true ? '同じ' : x === false ? '逆' : '—');
const NM = Object.freeze({ Mercury: '水星', Venus: '金星', Earth: '地球', Mars: '火星', Jupiter: '木星', Saturn: '土星', Uranus: '天王星', Neptune: '海王星', Sun: '太陽',
  Moon: '月', Io: 'イオ', Pluto: '冥王星', Charon: 'カロン' });
const SRC = Object.freeze({ Sun: '太陽', EarthHi: '地球(傾き最大の位相)', EarthLo: '地球(傾き最小の位相)', Jupiter: '木星', Charon: 'カロン', Pluto: '冥王星', '-': '受け手(背景だけ + 惑星由来)' });
export const rowName = (key) => { const [i, s] = key.split('|'); return i === 'Sun' ? '太陽(受け手)' : `${NM[i]}–${SRC[s]}`; };
const BN = Object.freeze({ Np: '(N+)', Gm: '(G−)' });
const SN = Object.freeze({ g2p: '(g2+)', g2m: '(g2−)' });
const UN = Object.freeze({ uV: '(uV)', uMin: '(uMin)', u1: '倍率 1', uP: '(仮)' });
const AXN = Object.freeze({ L: 'L', eq: 'eq' });
const PTN = Object.freeze({ S: '(S)', MS: '(MS)' });
const SWN = Object.freeze({ sense: '歳差の向き (g2−) → (g2+)', bg: '背景の向き (N+) → (G−)', u: '金星の条件 (uV) → (uMin)', axis: '基準軸 L → eq' });

/** 原文(言葉を変えずに引く) */
export const ORIGINAL = Object.freeze([
  Object.freeze(['原仮定者の回答(2026-11-24 —— 第148報)', 'AN1015: Bで進める。銀河由来の軸引きずりも、(S)だけを数えると弱いと推測する']),
  Object.freeze(['原仮定者の回答(2026-11-24 —— 第148報)', 'AN1016: (乙)で進める。ただし、「釣り合う」に「安定した歳差運動」を含む']),
  Object.freeze(['原仮定者の回答(2026-11-24 —— 第148報)', 'AN1017: これまでの向き。自転と、主に銀河由来の軸引きずりが順回転なら、歳差運動は逆回転になる']),
  Object.freeze(['原仮定者の回答(2026-11-24 —— 第148報)', 'AN1019: Aで進める。金星の自転の逆回転は、釣り合った状態で地球とも共鳴した結果である']),
  Object.freeze(['原仮定者の回答(2026-11-24 —— 第148報)', 'AN1026: Aで進める。未照合でも確度の高い数値で仮計算し、後追いで照合する']),
  Object.freeze(['原仮定者の整理(2026-11-24 —— 第148報)', '太陽系の、多くの天体の公転面に垂直かつ、多くの天体の歳差運動の中心軸方向が、太陽系の基準軸方向である']),
  Object.freeze(['原仮定者の整理(2026-11-24 —— 第148報)', '自転速度や、歳差運動の傾きは、天体の構造に左右されるので、先に銀河由来の背景軸引きずりを算出する']),
  Object.freeze(['原仮定者の回答(2026-11-15 —— AN720)', '「金星で釣り合う比」は、今後軸引きずりの計算を見直しても尊重する']),
]);
/** 統括の読み(原文と分ける)—— [読み, 数えた所] */
export const READINGS = Object.freeze([
  Object.freeze(['主の成分 = 源の自転の分 (S)。(MS) は比べる列。「(S)だけを数えると弱い」は予想の文(結果と書かない)', '表 4〜表 7 の (S)・(MS)']),
  Object.freeze(['「釣り合い」に合成の向きのまわりの安定した歳差を含める —— 本節は円錐の半頂角(合成と ŝ の角)と方位の率を並べるだけ(安定の判定は次のラウンド)', '表 4・表 8']),
  Object.freeze(['記号「これまでの向き」= (g2+)・文「順回転なら逆回転」を合成の軸のまわりで読んだ形 = (g2−)。伺っている —— 推奨 (g2−)・次点 (g2+) を同じ重さで', '表 5・表 6・表 7']),
  Object.freeze(['金星の条件の中身を 2 つの列に: (uV) 金星で太陽由来 (S) と背景の大きさが同じ(推奨)/(uMin) 金星で合成の大きさが最小(次点)。「…共鳴した結果」は予想の文(結果と書かない)', '表 3・表 5・表 6・表 7']),
  Object.freeze(['仮の値は第352便b の器の数だけ。仮の値を使った列は「仮・未照合」の印つき —— 符号と比の表で、合否にしない', '表 7']),
  Object.freeze(['基準軸の定義を 2 つの列に: L(角運動量の重み —— 枝 c の推奨)・eq(等しい重み —— 次点)。背景の向き (N+) = 基準軸の向き(推奨)・(G−) = 銀河の回転と逆向き(次点)', '表 4・表 5・表 6・表 8']),
  Object.freeze(['背景の向きと円錐を先に置く(大きさは列で持つ —— 1 つに決めない)。構造のノブは後(同時に当てはめない)', '表 3・表 7']),
  Object.freeze(['恒久の条件。本節の (uV)・(uMin) は、この比の「中身」の 2 つの読み', '表 3・表 6']),
]);
export function originalTable(readings = READINGS) {
  return ['| # | 出どころ | 原文(言葉を変えずに引く) | 読み(統括の読み —— 原文と分ける) | 数えた所 |', '|---|---|---|---|---|',
    ...ORIGINAL.map(([src, o], k) => `| ${k + 1} | ${src} | 「${o}」 | ${readings[k][0]} | ${readings[k][1]} |`)].join('\n');
}

const MAIN_HEAD = ['| 行(受け手–源) | 合成の率 [″/年] | 合成と基準軸 [°] | 円錐の半頂角 [°] | cos(ŝ, 背景) | 背景と順回転 | 合成と順回転 | 方位の率 [″/年]: 合成の軸・公転の北極・基準軸 | 起こす率 [″/年](f 0.5) |', '|---|---|---|---|---|---|---|---|---|'];
const mainRow = (r) => `| ${rowName(r.key)} | ${fm(r.omAsYr)} | ${dg(r.refDeg)} | ${dg(r.coneDeg)} | ${f3(r.cosBg)} | ${pm(r.spinBg)} | ${pm(r.spin)} | ${fe(r.az.om)}・${fe(r.az.orb)}・${fe(r.az.ref)} | ${fe(r.raise)} |`;
const diffCell = (d) => (d.marked ? '※ ' : '') + (d.flips.length ? '符号 ' + d.flips.map((p) => ({ om: '合', orb: '公', ref: '基', ecl: '黄' })[p]).join('') + '・' : '')
  + `円錐 ${dd(d.dCone)}・基準軸 ${dd(d.dRef)}・率 ×${fin(d.magRatio) ? Number(d.magRatio).toPrecision(3) : '—'}` + (d.raiseFlip ? '・起こす率の符号' : '') + (d.spinFlip ? '・合成と順回転' : '') + (d.spinBgFlip ? '・背景と順回転' : '');

export function tablesOf(J) {
  const T = {}, S = J.pure.scenes, G = J.pure.gates, A = J.decl.anchor;
  T.pure = ['| 零試験・場面 | 値 | 門 |', '|---|---|---|',
    `| ① 惑星の行は〔第352便d〕の \`rowOf\` と同じ数(Ω・経路 ② の方位の率と傾きの率 —— 8 惑星 × 背景 2 × 向き 2 × 成分 2 × 基準軸 2)の相対の差の最大 | ${sm(S.vsD)} | ${tf(G.sameAsD)} |`,
    `| ② 統括の数え直し 1 の表(等しい重み・(S)・(uV)): cos(ŝ, 背景)・合成と ŝ・合成と基準軸 の 16 行 × 3 が 3 桁で同じ | ${S.anc.filter((r) => r.ok).length}/${S.anc.length} | ${tf(G.anchorTable)} |`,
    `| ③ 地球の方位の率 [″/年]((g2+)): (G−) 基準軸 ${A.earthGmRef}・公転の北極 ${A.earthGmOrb}・(N+) 基準軸 ${A.earthNpRefLo}〜${A.earthNpRefHi}・金星の (N+) の合成 ÷ 背景 ${A.venusNpRatio} | ${fe(S.earth.gmRef)}・${fe(S.earth.gmOrb)}・${fe(S.earth.npRef)}・${S.earth.venusRatio.toFixed(4)} | ${tf(G.anchorEarth)} |`,
    `| ④ (g2−) は全部の極のまわりの方位の率の符号が (g2+) と逆(地球・月・太陽) | ${sm(S.g2Flip)} | ${tf(G.g2mFlip)} |`,
    `| ⑤ 大きさの列: (仮) で地球の合成が仮の率に届く・(uMin) で金星の合成が最小(± 0.1% で大きくなる —— 打ち消さないときは 0) | ${S.uChk.filter((r) => r.minOk && r.reach < 1e-9).length}/${S.uChk.length} | ${tf(G.uCols)} |`,
    `| ⑥ 太陽の行は〔第352便e〕の \`sunTotal\` と同じ Ω | ${sm(S.sunErr)} | ${tf(G.sunRow)} |`,
    `| ⑦ 衛星の行の母天体由来・太陽由来の (S) は〔第351便f〕の \`satTerms\` と同じ・背景の大きさは受け手に依らない | ${sm(S.satErr)}・${sm(S.bgIndep)} | ${tf(G.satRow)} |`,
    `| ⑧ 基準軸 L は〔第352便c〕の値(7 桁) | ${sm(S.refLErr)} | ${tf(G.refL)} |`,
    `| ⑨ 差の表の自己試験: 同じセルの差は印なし・(g2+) に替えると合成の軸のまわりの符号が替わる | ${tf(!S.dSelf.marked)}・${tf(S.dSense.flips.includes('om'))} | ${tf(G.diffSelf)} |`,
    `| ⑩ 変異 2 つ(局所を落とす・基準軸を入れ替える)で落ちる | ${tf(S.muts.noLocal)}・${tf(S.muts.axisSwap)} | ${tf(G.mutants)} |`,
    `| ⑪ 仮の値の並べは印つき・判定の側へ渡すと例外 | ${tf(S.tagged)}・${tf(S.blocked)} | ${tf(G.provMark)} |`,
    `| ⑫ 入力の拒否(背景の向き・基準軸・歳差の向き・倍率 −1・大きさの列の名・並べの天体) | ${S.rejects.filter(Boolean).length}/${S.rejects.length} | ${tf(G.rejects)} |`].join('\n');
  T.u = ['| 背景の向き | 基準軸 | 成分 | (uV) 金星で大きさが同じ | (uMin) 金星で合成が最小 | (仮) 地球の歳差の率に届く(仮・未照合) |', '|---|---|---|---|---|---|',
    ...J.uTab.map((r) => `| ${BN[r.bg]} | ${AXN[r.axis]} | ${PTN[r.part]} | ${Number(r.uV).toPrecision(6)} | ${r.uMin === 0 ? '0' : Number(r.uMin).toPrecision(6)} | ${Number(r.uP).toPrecision(6)} |`)].join('\n');
  T.rec = [...MAIN_HEAD, ...J.rec.map(mainRow)].join('\n');
  for (const s of J.swap) T['swap_' + s.item] = [...MAIN_HEAD, ...s.rows.map(mainRow)].join('\n');
  T.diff = ['| 行(受け手–源) | ' + J.swap.map((s) => SWN[s.item]).join(' | ') + ' |', '|---|' + J.swap.map(() => '---').join('|') + '|',
    ...J.diff.map((d) => `| ${rowName(d.key)} | ${J.swap.map((s) => diffCell(d[s.item])).join(' | ')} |`)].join('\n');
  const pv = (o, id) => J.prov.find((r) => r.id === id && r.bg === o.bg && r.axis === o.axis && r.sense === o.sense && r.uCol === o.uCol && r.part === o.part);
  const sp = (o) => J.spread.find((r) => r.bg === o.bg && r.axis === o.axis && r.sense === o.sense && r.uCol === o.uCol && r.part === o.part);
  const rows4 = [];
  for (const [bg, axis] of [['Np', 'L'], ['Np', 'eq'], ['Gm', 'L'], ['Gm', 'eq']]) for (const sense of ['g2m', 'g2p']) for (const uCol of ['uV', 'u1', 'uP']) {
    const o = { bg, axis, sense, uCol, part: 'S' }, e = pv(o, 'Earth'), m = pv(o, 'Mars'), v = pv(o, 'Venus'), s = sp(o);
    rows4.push(`| ${BN[bg]} | ${AXN[axis]} | ${SN[sense]} | ${UN[uCol]} | ${yn(e.sameSense)}・${yn(m.sameSense)} | ${dg(e.centerDeg)}・${dg(m.centerDeg)}・${dg(v.centerDeg)} | ${fm(e.needOm)}・${fm(m.needOm)}・${fm(v.needOm)} | ${Number(s.spreadOm).toPrecision(3)} |`);
  }
  T.prov = ['| 背景の向き | 基準軸 | 歳差の向き | 大きさ | (i) 回る向き(仮・未照合): 地球(黄道の極)・火星(公転の北極)の符号と | (ii) 合成と自分の公転の法線の角 [°]: 地球・火星・金星 | (iii) 要る倍(仮・未照合 ÷ 合成の率): 地球・火星・金星 | 要る倍の散らばり(最大 ÷ 最小) |', '|---|---|---|---|---|---|---|---|', ...rows4].join('\n');
  const cnt = (part, sense, id) => { const r = J.prov.filter((x) => x.part === part && x.sense === sense && x.id === id); return `${r.filter((x) => x.sameSense === true).length}/${r.length}`; };
  T.provCount = ['| 成分 | 歳差の向き | 地球: 仮・未照合と同じ符号の組 | 火星: 同じ符号の組 |', '|---|---|---|---|',
    ...['S', 'MS'].flatMap((part) => ['g2m', 'g2p'].map((sense) => `| ${PTN[part]} | ${SN[sense]} | ${cnt(part, sense, 'Earth')} | ${cnt(part, sense, 'Mars')} |`))].join('\n');
  const t = J.tilt;
  T.tilt = ['| 天体・傾きの率の定義(仮・未照合) | 傾き [°] | 比 r = 傾きの率 ÷ (sin 傾き × 歳差の率) | f = r ÷ (1 + r) |', '|---|---|---|---|',
    `| 地球・固定の黄道に対する傾きの率 | ${f3(t.earthTiltDeg)} | ${fm(t.earthOmegaA.r)} | ${fm(t.earthOmegaA.f)} |`,
    `| 地球・その日の黄道に対する傾きの率 | ${f3(t.earthTiltDeg)} | ${fm(t.earthEpsA.r)} | ${fm(t.earthEpsA.f)} |`,
    `| 火星 | ${f3(t.marsTiltDeg)} | ${fm(t.mars.r)} | ${fm(t.mars.f)} |`].join('\n');
  T.tilt5 = ['| 惑星 | 基準軸 | 観測の傾き(自分の公転の法線に対して)[°] | 基準軸に対する角 [°] | 合成に対する角 [°]((uV)) | 合成に対する角 [°](倍率 1) | 合成と基準軸 [°]((uV)) |', '|---|---|---|---|---|---|---|',
    ...J.tilt5.map((r) => `| ${NM[r.id]} | ${AXN[r.axis]} | ${dg(r.obsTiltDeg)} | ${dg(r.refConeDeg)} | ${dg(r.omConeDeg)} | ${dg(r.omConeDegU1)} | ${dg(r.omRefDeg)} |`)].join('\n');
  T.sat = ['| 行(受け手–源) | 背景の向き | 成分 | 母天体由来 ÷ 太陽由来 | 母天体由来 ÷ 背景((uV)) | cos(ŝ, 母天体由来) | 合成の率 [″/年] | (ア)(イ)(ウ) の歳差の率 [″/年] | (イ)(ウ) の起こす率 [″/年] |', '|---|---|---|---|---|---|---|---|---|',
    ...J.sat.map((r) => `| ${rowName(r.key)} | ${BN[r.bg]} | ${PTN[r.part]} | ${fm(r.parOverSun)} | ${fm(r.parOverBg)} | ${f3(r.cosParS)} | ${fm(r.omAsYr)} | ${['a', 'i', 'u'].map((c) => fm(r.cols[c].precAsYr)).join('・')} | ${['i', 'u'].map((c) => fe(r.cols[c].raiseAsYr)).join('・')} |`)].join('\n');
  T.diffG = ['| 行(受け手–源) | (G−) で金星の条件 (uV) → (uMin) |', '|---|---|', ...J.diffG.map((d) => `| ${rowName(d.key)} | ${diffCell(d)} |`)].join('\n');
  return T;
}

/** 数の文(表の要点 —— 本文に逐語) */
export function factsOf(J) {
  const F = {}, row = (rows, key) => rows.find((r) => r.key === key), sw = (k) => J.swap.find((s) => s.item === k);
  const names = (keys) => keys.map(rowName).join('・') || 'なし';
  F.marks = `表 3 で印(※ —— 方位の率の符号・起こす率の符号・順回転の替わり・角の差 1° 以上・率の比 2 倍以上)が付いた行: 歳差の向き ${J.marks.sense.length}/${J.diff.length}・背景の向き ${J.marks.bg.length}/${J.diff.length}・金星の条件 ${J.marks.u.length}/${J.diff.length}・基準軸 ${J.marks.axis.length}/${J.diff.length}。`;
  const cnt = (part, sense, id) => J.prov.filter((x) => x.part === part && x.sense === sense && x.id === id && x.sameSense === true).length;
  const nP = J.prov.filter((x) => x.part === 'S' && x.sense === 'g2m' && x.id === 'Earth').length;
  F.sense = `歳差の向き: 地球(黄道の極のまわり)と火星(自分の公転の北極のまわり)の回る向きの符号が仮・未照合の値と同じ組は、(S) で (g2−) が地球 ${cnt('S', 'g2m', 'Earth')}/${nP}・火星 ${cnt('S', 'g2m', 'Mars')}/${nP}、(g2+) が地球 ${cnt('S', 'g2p', 'Earth')}/${nP}・火星 ${cnt('S', 'g2p', 'Mars')}/${nP}(背景の向き 2 × 基準軸 2 × 大きさ 4)。`;
  const v = row(J.rec, 'Venus|Sun'), vg = row(sw('bg').rows, 'Venus|Sun');
  F.venus = `金星: 推奨の組((N+)・(uV))で合成の率 ${fm(v.omAsYr)}″/年(背景だけの ${(v.omAsYr / v.bgAsYr).toFixed(4)} 倍)・円錐の半頂角 ${dg(v.coneDeg)}°/(G−) に替えると ${fm(vg.omAsYr)}″/年(×${(vg.omAsYr / v.omAsYr).toPrecision(3)})・円錐 ${dg(vg.coneDeg)}°。`;
  const uN = J.uTab.find((r) => r.bg === 'Np' && r.axis === 'L' && r.part === 'S'), uG = J.uTab.find((r) => r.bg === 'Gm' && r.axis === 'L' && r.part === 'S');
  F.uMin = `金星の条件の 2 つの読みの倍率((S)): (N+) では (uMin) ÷ (uV) = ${(uN.uMin / uN.uV).toFixed(5)}(金星の (S) は (N+) とほぼ逆向き —— 2 つの読みはほぼ同じ)・(G−) では ${(uG.uMin / uG.uV).toFixed(3)}。(MS) では、どの向きでも (uMin) は 0(打ち消さない)。`;
  const s = (bg, axis, uCol) => J.spread.find((r) => r.bg === bg && r.axis === axis && r.sense === 'g2m' && uCol === r.uCol && r.part === 'S');
  F.spread = `要る倍(仮・未照合 ÷ 合成の率)の天体どうしの散らばり((S)・地球・火星・金星): (N+) L で (uV) ${Number(s('Np', 'L', 'uV').spreadOm).toPrecision(3)}・倍率 1 ${Number(s('Np', 'L', 'u1').spreadOm).toPrecision(3)}/(G−) で (uV) ${Number(s('Gm', 'L', 'uV').spreadOm).toPrecision(3)}・倍率 1 ${Number(s('Gm', 'L', 'u1').spreadOm).toPrecision(3)} —— 背景が主の大きさでは、火星の要る倍は地球の ${Number(s('Np', 'L', 'u1').marsOverEarth).toPrecision(3)} 倍・金星は ${Number(s('Np', 'L', 'u1').venusOverEarth).toPrecision(3)} 倍。`;
  const e = row(J.rec, 'Earth|Sun'), eg = row(sw('bg').rows, 'Earth|Sun'), ea = row(sw('axis').rows, 'Earth|Sun');
  F.earth = `地球: 推奨の組で円錐の半頂角 ${dg(e.coneDeg)}°・合成と基準軸 ${dg(e.refDeg)}°/(G−) で ${dg(eg.coneDeg)}°・${dg(eg.refDeg)}°/基準軸 eq で ${dg(ea.coneDeg)}°・${dg(ea.refDeg)}°。`;
  const io = J.sat.find((r) => r.key === 'Io|Jupiter' && r.bg === 'Np' && r.part === 'S'), mo = J.sat.find((r) => r.key === 'Moon|EarthHi' && r.bg === 'Np' && r.part === 'S');
  F.sat = `衛星の (S): 母天体由来 ÷ 太陽由来 は イオ ${fm(io.parOverSun)}・月 ${fm(mo.parOverSun)}。イオの母天体由来 (S) は背景 (uV) の ${fm(io.parOverBg)} 倍で、自転軸とほぼ逆向き(cos ${f3(io.cosParS)})—— (N+) で合成は ${fm(io.omAsYr)}″/年(背景だけの ${(io.omAsYr / io.bgAsYr).toPrecision(3)} 倍)。`;
  const sun = row(J.rec, 'Sun|-'), sung = row(sw('bg').rows, 'Sun|-'), suna = row(sw('axis').rows, 'Sun|-');
  F.sun = `太陽(受け手): 円錐の半頂角は推奨の組で ${dg(sun.coneDeg)}°(基準軸 L)・eq で ${dg(suna.coneDeg)}°・(G−) で ${dg(sung.coneDeg)}°。`;
  const gm = J.diffG.filter((d) => d.marked).map((d) => d.key);
  F.uG = `(G−) の側で金星の条件を (uV) → (uMin) に替えると、印が付く行は ${gm.length}/${J.diffG.length}(${names(gm)})—— 金星の条件の中身の差は (G−) でだけ表に出る。`;
  return F;
}
