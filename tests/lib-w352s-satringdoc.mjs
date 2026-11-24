// 第352便s(原仮定者の回答(2026-11-24 —— 第148報)・原仮定者の回答(2026-11-24 —— 第147報)・統括の検証項目 R456):
// **正本 tests/out/satring-352s.json から PHYSICS〔第352便s〕の表と数の文を作る文書の lib**
// (QA docs.satring352s が節の表と逐語で照合する —— 表の数は有効数字 3 桁・丸めの床の量は「< 1e-9」の印)。原文(言葉を変えずに引く)もここに持つ。
// ファイルを読まない・import しない。
export const DOC_VERSION = 'w352s-satringdoc-1';
const fe = (x) => (x === null || x === undefined || !Number.isFinite(x) ? '—' : x === 0 ? '0' : Number(x).toExponential(2));
const f3 = (x) => (x === null || x === undefined || !Number.isFinite(x) ? '—' : Number(x).toFixed(3));
const f2 = (x) => (x === null || x === undefined || !Number.isFinite(x) ? '—' : Number(x).toFixed(2));
const KN = Object.freeze({ 'Moon|EarthHi': '月(傾き最大の位相)', 'Moon|EarthLo': '月(傾き最小の位相)', 'Io|Jupiter': 'イオ ← 木星', 'Pluto|Charon': '冥王星 ← カロン', 'Charon|Pluto': 'カロン ← 冥王星', 'Venus|Sun': '金星 ← 太陽' });
const IN = Object.freeze({ Moon: '月', Io: 'イオ', Pluto: '冥王星', Charon: 'カロン' });
const TN = Object.freeze({ 0: '規則', 1: '観測' });
const BN = Object.freeze({ NpL: '(N+) L', Npeq: '(N+) eq', GmL: '(G−) L', Gmeq: '(G−) eq' });
const RN = Object.freeze({ ringD: 'D 環', ringC: 'C 環', ringB: 'B 環', ringA: 'A 環', ringF: 'F 環' });
const NN = Object.freeze({ L: '基準軸 L', eq: '基準軸 eq', ecl: '黄道の極' });
const AT = Object.freeze({ Earth: '地球の道', Saturn: '土星の道' });

/** 原文(言葉を変えずに引く —— 公開の節に在る文) */
export const ORIGINAL = Object.freeze([
  Object.freeze(['原仮定者の回答(2026-11-24 —— 第148報)', 'AN1015: Bで進める。銀河由来の軸引きずりも、(S)だけを数えると弱いと推測する']),
  Object.freeze(['原仮定者の回答(2026-11-24 —— 第147報)', 'AN1001: Aで進める。主要衛星は潮汐ロックしている']),
  Object.freeze(['原仮定者の指示(2026-11-14 —— 第138報)', '潮汐ロックしている状態は、外部からの軸引きずりによる回転よりも、潮汐力が上回っている']),
  Object.freeze(['原仮定者の回答(2026-11-15 —— 第138報の回答 4)', 'イオは潮汐ロックしているので、内部熱の検証用']),
  Object.freeze(['原仮定者の補足(2026-11-12 —— 第136報)', '互いに潮汐ロックしている連星は、『距離の変化による並進引きずり』以外の、相互の引きずりが消える。ただし、遠方宇宙に対する慣性移動は消えないので、互いに周回する']),
  Object.freeze(['原仮定者の回答(2026-11-24 —— 第148報)', 'AN1019: Aで進める。金星の自転の逆回転は、釣り合った状態で地球とも共鳴した結果である']),
]);
export const READINGS = Object.freeze([
  '局所の軸引きずりの主の成分 = (S) 源の自転の分。衛星では母天体由来の項も (S)(母天体の自転の分)が主 —— 第351便f の表(当時の主 (MS))を、成分を明示する新しい列で数え直す。「(S)だけを数えると弱い」は予想の文',
  '衛星には母天体由来の項を入れる(サンプルの中の源の全部)。潮汐ロックは観測の事実として置く(積分でロックを作らない)—— 3 列 (ア)(イ)(ウ) は第351便f のまま',
  '恒久の定義。本節は当否を判じない —— 潮汐のトルクの物差しと、(S) が主のときの軸引きずりの直交成分のトルクの比の数だけ(同じ向きの数か)',
  'イオの行は内部熱の検証用の行として残す。本節はイオで木星の自転の分 (S) と背景が打ち消す度合いの数だけ(内部熱の出どころは数えない)',
  '互いにロックした組で、(S) は相手の自転の分。消える・消えないの判定ではなく、(S) の大きさと向き(自転軸に平行か)を源の回転の形と源の自転の置き方で並べる',
  '背景の大きさの主の列 = 金星で太陽由来の (S) と背景の大きさが同じ値 (uV)。後半は予想の文 —— 本節はイオ・月で同じ形の打ち消しが起きる背景の倍率を、この値と比べる数だけ',
]);
const esc = (s) => String(s).replace(/\|/g, '/');
export function originalTable() {
  return '| # | 出どころ | 原文(言葉を変えずに引く) | 読み(統括の読み —— 原文と分ける) |\n|---|---|---|---|\n'
    + ORIGINAL.map(([src, o], k) => `| ${k + 1} | ${src} | 「${o}」 | ${esc(READINGS[k])} |`).join('\n');
}

export function tablesOf(J) {
  const T = {};
  { const S = J.pure.scenes, G = J.pure.gates;
    T.pure = '| 零試験・場面 | 値 | 門 |\n|---|---|---|\n' + [
      ['① 規則の半径で、成分 (S)・(MS) の母天体由来と太陽由来が〔第351便f〕の `satTerms` と同じ(衛星 5 組 —— 相対の差)', S.vsF === 0 ? '0' : '< 1e-12', G.sameAsF],
      ['② 成分 (MS) を明示すると〔第351便f〕の比に戻る(イオ・月の母天体由来 ÷ 太陽由来)', `${S.r351f.io}・${S.r351f.moon}`, G.msBack351f],
      ['③〔第352便j〕の衛星の (S) の表と同じ数(イオ: 母天体 ÷ 太陽・÷ 背景・合成 ÷ 背景 —— (N+)・L・(uV))', `${f2(S.vsJ.io[0])}・${f3(S.vsJ.io[1])}・${f3(S.vsJ.io[2])}`, G.sameAsJ],
      ['④〔第352便j〕の `cellOf` と同じ Ω(衛星 5 組 × 背景の向き 2 × 基準軸 2)', '< 1e-12', G.sameCell],
      ['⑤ (uV)(規則の半径)が 1.19282e-12・〔第352便d〕の `uVenus` と同じ', '1.19282e-12', G.uV],
      ['⑥ 打ち消しの行: 金星の uEq ÷ (uV) が 1・イオの uEq ÷ (uV) が 0.5〜1.5・uMin で合成が最小', `1・${f3(S.ioEq)}`, G.cancel],
      ['⑦ 輪の口 `ringRot` が地球の道の 72 位相で〔第352便k〕の `spinRot` の (S)・(M) と同じ', '< 1e-12', G.ringRot],
      ['⑧ 土星の赤道面の輪で、土星由来の (S)・(M) は輪の法線に平行(直交の割合)', '< 1e-9', G.ringParallel],
      ['⑨ 観測の半径のイオの母天体由来 (S) ÷ 規則の半径 = 木星の半径の比の 2 乗', '< 1e-6', G.radiusSq],
      ['⑩ 変異: 背景の向きを (G−) にするとイオの打ち消しが消える(合成 ÷ 背景 > 0.5)', '真', G.mutantGm],
      ['⑪ 入力の拒否(衛星でない組・背景の向き・基準軸・負の倍率・負の半径・t)', `${S.rejects.filter(Boolean).length}/${S.rejects.length}`, G.rejects],
    ].map(([x, b, g]) => `| ${x} | ${b} | ${g ? '真' : '偽'} |`).join('\n'); }
  T.sat = '| 衛星の組 | 源の半径 | 母天体由来 (S) ″/年 | 太陽由来 (S) ″/年 | 母天体 ÷ 太陽 (S) | 母天体 ÷ 太陽 (MS) | 母天体 ÷ 背景 (uV) | cos(ŝ, 母天体由来) | 合成 ÷ 背景 (N+) L | (N+) eq | (G−) L |\n|---|---|---|---|---|---|---|---|---|---|---|\n'
    + J.sat.map((r) => { const c = r.cells, a = c.NpL;
      return `| ${KN[r.key]} | ${TN[r.tSrc]} | ${fe(a.parAsYr)} | ${fe(a.sunAsYr)} | ${fe(a.parOverSun)} | ${fe(r.msParOverSun)} | ${fe(a.parOverBg)} | ${f3(a.cosParS)} | ${f3(c.NpL.omOverBg)} | ${f3(c.Npeq.omOverBg)} | ${f3(c.GmL.omOverBg)} |`; }).join('\n');
  T.lock = '| 衛星の組 | 源の半径 | 背景 | (ア) 歳差 ″/年 | (イ) 経路 ① ″/年 | (イ) 起こす率 ″/年 | (ウ) Ω∥ ÷ n | 局所の直交 ″/年 | 背景の直交 ″/年 |\n|---|---|---|---|---|---|---|---|---|\n'
    + J.sat.flatMap((r) => ['NpL', 'GmL'].map((b) => { const c = r.cells[b];
      return `| ${KN[r.key]} | ${TN[r.tSrc]} | ${BN[b]} | ${fe(c.cols.a.precAsYr)} | ${fe(c.cols.i.path1AsYr)} | ${fe(c.cols.i.raiseAsYr)} | ${fe(c.cols.u.parOverN)} | ${fe(c.perpLocAsYr)} | ${fe(c.perpBgAsYr)} |`; })).join('\n');
  T.torque = '| 天体 | 源の半径 | 局所だけ (S) | (N+) L | (N+) eq | (G−) L | (G−) eq | 1.5 k₂/Q・(N+) L | 〔第351便f〕(MS)・(G−)・倍率 1 |\n|---|---|---|---|---|---|---|---|---|\n'
    + J.torque.map((r) => `| ${IN[r.id]} | ${TN[r.tSrc]} | ${fe(r.local && r.local.rTide)} | ${fe(r.cells.NpL.rTide)} | ${fe(r.cells.Npeq.rTide)} | ${fe(r.cells.GmL.rTide)} | ${fe(r.cells.Gmeq.rTide)} | ${fe(r.cells.NpL.rTideK)} | ${fe(r.r351f)} |`).join('\n');
  T.cancel = '| 組 | 源の半径 | 背景 | (uV) | uEq ÷ (uV) | uMin ÷ (uV) | 残り(uEq) | 残り(uMin)÷ 局所 | 合成 ÷ 背景(uV) | cos(局所, 背景) |\n|---|---|---|---|---|---|---|---|---|---|\n'
    + J.cancel.filter((r) => !(r.bg === 'Gm' && r.axis === 'eq')).map((r) => `| ${KN[r.key]} | ${TN[r.tSrc]} | ${BN[r.bg + r.axis]} | ${fe(r.uV)} | ${fe(r.eqOverUV)} | ${fe(r.minOverUV)} | ${fe(r.resEq)} | ${fe(r.resMin)} | ${fe(r.resAtUV)} | ${f3(r.cosLocBg)} |`).join('\n');
  { const pickE = [-2, -1, 0, 1, 2, 3, 4, 5];
    T.scan = '| 組 | 源の半径 | ' + pickE.map((e) => `u = (uV) × 1e${e}`).join(' | ') + ' |\n|---|---|' + pickE.map(() => '---|').join('') + '\n'
      + J.cancel.filter((r) => r.bg === 'Np' && r.axis === 'L' && ['Venus|Sun', 'Io|Jupiter', 'Moon|EarthHi'].includes(r.key))
        .map((r) => `| ${KN[r.key]} | ${TN[r.tSrc]} | ` + pickE.map((e) => fe(r.scan.find((s) => s.e === e).res)).join(' | ') + ' |').join('\n'); }
  T.mut = '| 組 | 源の回転の形 | 源の自転 | 相対の速さ | (S) ″/年 | (MS) ″/年 | (S) ÷ (MS) | (S) ÷ 背景 (uV) | (S) の自転軸に平行な成分 ″/年 | 中心の速度の残り |\n|---|---|---|---|---|---|---|---|---|---|\n'
    + J.mut.map((r) => `| ${KN[r.key]} | ${r.rot === 'M' ? '球のモーメント(在位)' : '落ち方なし'} | ${{ decl: '宣言', sync: '平均運動', frame: '源に固定の座標系' }[r.spin]} | ${r.speed === 'src' ? '源の質量だけ' : '2 体の和'} | ${fe(r.SAsYr)} | ${fe(r.MSAsYr)} | ${fe(r.SoverMS)} | ${fe(r.SoverBg)} | ${fe(r.parS)} | ${fe(r.resid)} |`).join('\n');
  T.mutR = '| 組 | 源の半径 | 相手由来 (S) ″/年 | 太陽由来 (S) ″/年 | 相手 ÷ 太陽 | 相手 ÷ 背景 (uV)(その半径) | cos(ŝ, 相手由来) |\n|---|---|---|---|---|---|---|\n'
    + J.mutR.map((r) => `| ${KN[r.key]} | ${TN[r.tSrc]} | ${fe(r.parAsYr)} | ${fe(r.sunAsYr)} | ${fe(r.parOverSun)} | ${fe(r.parOverBg)} | ${f3(r.cosParS)} |`).join('\n');
  T.ring = '| 区分 | 源の半径 | r ÷ 土星の半径 | 土星由来 (S) ″/年 | cos(L̂, S) | (S) ÷ (M) | 土星由来 ÷ 太陽由来 (S) | 土星由来 ÷ 背景 (uV) | 傾き 1° の起こす率 ″/年(土星の (S) だけ) | 同 × 1e7 年 ÷ 傾き | 合成の軸と L̂ の角 (N+) L ° | (G−) L ° |\n|---|---|---|---|---|---|---|---|---|---|---|---|\n'
    + J.ring.map((r) => `| ${RN[r.key]} | ${TN[r.tSrc]} | ${f3(r.rOverRobs)} | ${fe(r.satS.asYr)} | ${f3(r.satS.cosL)} | ${fe(r.SoverM)} | ${fe(r.satSOverSunS)} | ${fe(r.comb.NpL.satSOverBg)} | ${fe(r.tilt1.satS.raiseAsYr)} | ${fe(r.tilt1.satS.yard)} | ${f3(r.comb.NpL.angDeg)} | ${f3(r.comb.GmL.angDeg)} |`).join('\n');
  T.plane = '| 輪の半径 | 輪の法線 | 源の半径 | 太陽由来 (S) ″/年 | cos(太陽の自転軸, S) | (S) ÷ 背景 (uV) | 合成と法線の角 (N+) L ° | (N+) eq ° | (G−) L ° | 寄る率 (N+) L ″/年 | 寄る率 (G−) L ″/年 | 回る率 (N+) L ″/年 |\n|---|---|---|---|---|---|---|---|---|---|---|---|\n'
    + J.plane.map((r) => `| ${AT[r.at]} | ${NN[r.normal]} | ${TN[r.tSrc]} | ${fe(r.SAsYr)} | ${f3(r.cosSunAx)} | ${fe(r.comb.NpL.SOverBg)} | ${f3(r.comb.NpL.angDeg)} | ${f3(r.comb.Npeq.angDeg)} | ${f3(r.comb.GmL.angDeg)} | ${fe(r.comb.NpL.perpAsYr)} | ${fe(r.comb.GmL.perpAsYr)} | ${fe(r.comb.NpL.omAsYr)} |`).join('\n');
  return T;
}
const rng = (xs, f) => { const v = xs.filter((x) => Number.isFinite(x)); const a = Math.min(...v), b = Math.max(...v); return f(a) === f(b) ? f(a) : f(a) + '〜' + f(b); };
export function factsOf(J) {
  const F = {}, sat = (k, t) => J.sat.find((r) => r.key === k && r.tSrc === t), can = (k, t, bg, ax) => J.cancel.find((r) => r.key === k && r.tSrc === t && r.bg === bg && r.axis === ax);
  { const io0 = sat('Io|Jupiter', 0), io1 = sat('Io|Jupiter', 1), mo0 = sat('Moon|EarthHi', 0), mo1 = sat('Moon|EarthHi', 1);
    F.sat = `主の成分を (S) にすると、母天体由来 ÷ 太陽由来は、規則の半径でイオ ${fe(io0.cells.NpL.parOverSun)}・月 ${fe(mo0.cells.NpL.parOverSun)}(当時の (MS) ではイオ ${fe(io0.msParOverSun)}・月 ${fe(mo0.msParOverSun)})、`
      + `観測の半径でイオ ${fe(io1.cells.NpL.parOverSun)}・月 ${fe(mo1.cells.NpL.parOverSun)}。母天体由来の (S) は、どの組でも受け手の自転軸とほぼ逆向き(cos ${rng(J.sat.map((r) => r.cells.NpL.cosParS), f3)})。`
      + `母天体由来 ÷ 背景 (uV) は、規則の半径でイオ ${fe(io0.cells.NpL.parOverBg)}・月 ${fe(mo0.cells.NpL.parOverBg)}、観測の半径でイオ ${fe(io1.cells.NpL.parOverBg)}・月 ${fe(mo1.cells.NpL.parOverBg)}。`; }
  { const tq = J.torque, all = tq.flatMap((r) => Object.values(r.cells).map((c) => c.rTide));
    F.torque = `潮汐のトルク(係数 1)÷ 軸引きずりの直交成分のトルクは、(S) が主のとき、規則の半径で ${rng(tq.filter((r) => r.tSrc === 0).flatMap((r) => Object.values(r.cells).map((c) => c.rTide)), fe)}・観測の半径で ${rng(tq.filter((r) => r.tSrc === 1).flatMap((r) => Object.values(r.cells).map((c) => c.rTide)), fe)}`
      + `(1.5 k₂/Q の係数で ${rng(tq.flatMap((r) => Object.values(r.cells).map((c) => c.rTideK)), fe)})。当時の (MS) の列では ${rng(tq.filter((r) => r.tSrc === 0).map((r) => r.r351f), fe)}。どの組でも 1 を越える(${all.every((x) => x > 1) ? 'はい' : 'いいえ'})—— 恒久の文と同じ向きの数というだけ。`; }
  { const v0 = can('Venus|Sun', 0, 'Np', 'L'), i0 = can('Io|Jupiter', 0, 'Np', 'L'), i0e = can('Io|Jupiter', 0, 'Np', 'eq'), i1 = can('Io|Jupiter', 1, 'Np', 'L'), m0 = can('Moon|EarthHi', 0, 'Np', 'L'), m1 = can('Moon|EarthHi', 1, 'Np', 'L'), g0 = can('Io|Jupiter', 0, 'Gm', 'L');
    F.cancel = `金星と同じ形の打ち消し(局所の (S) と (N+) の背景がほぼ逆向き)は、イオでも起きる(cos(局所, 背景) ${f3(i0.cosLocBg)})。イオで大きさが同じになる背景の倍率は、金星の条件の値 (uV) の ${f3(i0.eqOverUV)} 倍(規則の半径 —— 残り L ${f3(i0.resEq)}・eq ${f3(i0e.resEq)})、`
      + `観測の半径では ${fe(i1.eqOverUV)} 倍。規則の半径では背景 1 つ((uV))で金星(残り ${f3(v0.resAtUV)})とイオ(残り ${f3(i0.resAtUV)})が両方とも打ち消しの近くに来るが、観測の半径ではイオの合成は背景の ${fe(i1.resAtUV)} 倍(木星の (S) が背景を圧する)。`
      + `月は ${f3(m0.eqOverUV)} 倍(規則)・${f3(m1.eqOverUV)} 倍(観測)で、(uV) での残りは ${f3(m0.resAtUV)}・${f3(m1.resAtUV)}。(G−) では打ち消さない(イオの合成 ÷ 背景 ${f3(g0.resAtUV)})。`; }
  { const m = J.mut, g = (k, rot, spin, speed) => m.find((r) => r.key === k && r.rot === rot && r.spin === spin && r.speed === speed), r0 = J.mutR;
    const a = g('Charon|Pluto', 'M', 'decl', 'src'), b = g('Charon|Pluto', 'q0', 'sync', 'src'), c1 = r0.find((r) => r.key === 'Charon|Pluto' && r.tSrc === 1), p1 = r0.find((r) => r.key === 'Pluto|Charon' && r.tSrc === 1);
    F.mut = `互いにロックした冥王星–カロンで、(S)(相手の自転の分)は、在位の形(球のモーメント・規則の半径)ではカロン ← 冥王星 ${fe(a.SAsYr)}″/年 —— (MS) の ${fe(a.SoverMS)} 倍・背景 (uV) の ${fe(a.SoverBg)} 倍で、どの置き方でも自転軸に平行(直交の成分は丸めの床)。`
      + `落ちない形・源の自転を平均運動に置くと (S) ÷ (MS) は ${f3(b.SoverMS)}(背景の ${fe(b.SoverBg)} 倍)。源の半径を観測の半径にすると、相手 ÷ 背景 (uV) はカロン ← 冥王星 ${fe(c1.parOverBg)}・冥王星 ← カロン ${fe(p1.parOverBg)}。源に固定して回る座標系の読みでは 0。`; }
  { const R = J.ring, r0 = R.filter((r) => r.tSrc === 0), r1 = R.filter((r) => r.tSrc === 1);
    F.ring = `土星の環では、土星由来の (S) と (M) はどちらも輪の法線に平行(赤道面の輪)—— (S) は法線と逆向き(cos ${rng(R.map((r) => r.satS.cosL), f3)})。(S) ÷ (M) は規則の半径で ${rng(r0.map((r) => r.SoverM), fe)}・観測の半径で ${rng(r1.map((r) => r.SoverM), fe)}。`
      + `傾き 1° の輪を土星の (S) だけで起こす率は、規則の半径で ${rng(r0.map((r) => r.tilt1.satS.raiseAsYr), fe)}″/年(環の物差し 1e7 年に対して ${rng(r0.map((r) => r.tilt1.satS.yard), fe)} 倍)・観測の半径で ${rng(r1.map((r) => r.tilt1.satS.raiseAsYr), fe)}″/年(${rng(r1.map((r) => r.tilt1.satS.yard), fe)} 倍)。`
      + `合成の軸と輪の法線の角は (N+) L で ${rng(R.map((r) => r.comb.NpL.angDeg), f3)}°・(G−) L で ${rng(R.map((r) => r.comb.GmL.angDeg), f3)}°。`; }
  { const P = J.plane, e = (n, t) => P.find((r) => r.at === 'Earth' && r.normal === n && r.tSrc === t), s = (n, t) => P.find((r) => r.at === 'Saturn' && r.normal === n && r.tSrc === t);
    F.plane = `太陽系の公転面の輪(地球の道の半径)では、太陽由来の (S) の輪の平均は太陽の自転軸とほぼ逆向き(cos ${rng(P.map((r) => r.cosSunAx), f3)})で、背景 (uV) の ${f3(e('L', 0).comb.NpL.SOverBg)} 倍(源の半径に依らない —— (uV) も同じ半径で決まる)。`
      + `(N+) では合成の軸と輪の法線の角は ${rng(P.filter((r) => r.at === 'Earth').map((r) => r.comb.NpL.angDeg), f3)}°(L)、(G−) では ${rng(P.filter((r) => r.at === 'Earth').map((r) => r.comb.GmL.angDeg), f3)}°。土星の道の半径では (S) ÷ 背景は ${fe(s('L', 0).comb.NpL.SOverBg)} で、法線を基準軸 L に置いた輪は (N+) L の合成の軸から ${f3(s('L', 0).comb.NpL.angDeg)}°。`; }
  return F;
}
