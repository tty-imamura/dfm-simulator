// 第352便w(原仮定者の回答(2026-11-24 —— 第148報)・原仮定者の整理(2026-11-24 —— 第148報)・原仮定者の回答(2026-11-24 —— 第147報)・統括の検証項目 R460):
// **正本 tests/out/keepcone-352w.json から PHYSICS〔第352便w〕の表と数の文を作る文書の lib**
// (QA docs.keepcone352w が節の表と逐語で照合する —— 表の数は有効数字 3 桁)。原文(言葉を変えずに引く)もここに持つ。
// ファイルを読まない・import しない。
export const DOC_VERSION = 'w352w-keepconedoc-1';
const fe = (x) => (x === null || x === undefined || !Number.isFinite(x) ? '—' : x === 0 ? '0' : Number(x).toExponential(2));
const f2 = (x) => (x === null || x === undefined || !Number.isFinite(x) ? '—' : Number(x).toFixed(2));
const KN = Object.freeze({ 'Mercury|Sun': '水星', 'Venus|Sun': '金星', 'Earth|Sun': '地球', 'Mars|Sun': '火星', 'Jupiter|Sun': '木星', 'Saturn|Sun': '土星', 'Uranus|Sun': '天王星', 'Neptune|Sun': '海王星',
  'Sun|-': '太陽', 'Moon|EarthHi': '月(傾き最大の位相)', 'Io|Jupiter': 'イオ' });
const IN = Object.freeze({ Mercury: '水星', Venus: '金星', Earth: '地球', Mars: '火星' });
const TN = Object.freeze({ 0: '規則', 1: '観測' });
const BN = Object.freeze({ NpL: '(N+) L', Npeq: '(N+) eq', GmL: '(G−) L', Gmeq: '(G−) eq' });
const SN = Object.freeze({ g2p: '(g2+)', g2m: '(g2−)' });
const yn = (b) => (b ? 'はい' : 'いいえ');
const lim = (k) => (k.noLimit ? '上限なし' : fe(k.fMax));

/** 原文(言葉を変えずに引く —— 公開の節に在る文) */
export const ORIGINAL = Object.freeze([
  Object.freeze(['原仮定者の回答(2026-11-24 —— 第148報)', 'AN1016: (乙)で進める。ただし、「釣り合う」に「安定した歳差運動」を含む']),
  Object.freeze(['原仮定者の整理(2026-11-24 —— 第148報)', '太陽系の公転面は、原始太陽系の円盤引きずりに由来する。公転面に薄く集まる事で、惑星の形成を促進した']),
  Object.freeze(['原仮定者の整理(2026-11-24 —— 第148報)', '自転速度や、歳差運動の傾きは、天体の構造に左右されるので、先に銀河由来の背景軸引きずりを算出する']),
  Object.freeze(['原仮定者の回答(2026-11-24 —— 第147報)', 'AN1008: R3で進める。軸引きずり回転の、自転軸に直交する成分が、自転方向に90度ずれると、軸引きずり回転軸に近付く向きになる。ただし、自転軸が起きるのは、自転と軸引きずり回転が順方向、つまり源の回転が逆方向の場合である。源の回転が順方向では、自転軸を倒す向きになる。よって、大半の惑星は、銀河由来の軸引きずりは起こす向きで、太陽の由来の軸引きずりは倒す向きになり、釣り合う。また、軸引きずりには、自転軸を「自転に軸引きずり回転を合成した後の回転軸」に向ける作用も有り、自転軸を向ける回転が自転方向に90度ずれて歳差運動になる。つまり、両方の経路が有り、比率は天体の構造などに起因するので、ノブにする']),
]);
export const READINGS = Object.freeze([
  '自転軸が合成の向きのまわりを円錐の半頂角を保って回り続ける状態も釣り合いに含める。本節は、いまの傾きを「初めの角が保たれている」と読むときに要る条件(比率 f の上限)と、そのときの観測の傾きの揺れの数だけ。「乱しても戻る点」の読みは〔第352便p〕の表の側',
  '予想の文。本節は、公転面(輪の法線)が年齢の間に散らばり 30° から 7°(比べる列 3°)まで寄るのに要る、公転面の側の比率 f_輪 の下限の数だけ(公転面の由来の答えではない)',
  '構造の量は背景の向きと円錐を置いた後に入れる(同時に当てはめない)。本節の「公転面の側と自転軸の側で比率が違う必要の度合い」(f_輪 ÷ f)は、構造に起因する比率の側の数として並べるだけ',
  '経路 ①(寄る)と経路 ②(歳差)の比率 f はノブ。本節は f の上限・f_輪 の下限を閉じた形で出し、公転面と自転軸で同じ f を使えるかを数える(別のノブとして持つかは決めない)',
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
      ['① 〔第352便p〕の表の数を本 lib の式で作り直す(地球 (N+) L・割合 10%・倍率 1 と仮・公転面 30° → 7°・倍率 1)', `${fe(S.p.u1)}・${fe(S.p.uP)}・${fe(S.p.ring)}`, G.pTable],
      ['② `stateW`(規則の半径)が〔第352便p〕の `stateOf` と同じ合成・自転軸・輪の法線(地球・火星・金星 × 背景の向き 2 × 基準軸 2)', '< 1e-12', G.sameState],
      ['③ 角 1° の物差し: f の上限で年齢の後に 1° 縮む(〔第352便i〕の `thAfter`)・θ ≤ 1° は上限なし', f2(S.d1.drop), G.critDeg],
      ['④ f_輪 の下限で年齢の後に目標の角・その倍率の下限で k₁ = 1', f2(S.ring.th), G.ringMin],
      ['⑤ 円錐の傾きの範囲: 閉じた形 = 自転軸を回して数えた範囲(3 つの向き)', '< 1e-3°', G.coneClosed],
      ['⑥ 位相の平均 = 〔第352便k〕の `spinRot`・〔第351便c〕の `partRot`(規則の半径)・〔第352便o〕の `localS`(観測の半径)', '< 1e-12', G.phaseMean],
      ['⑦ 誇張した場で、位相ごとの步と平均の步の途中の差 = 一次の式・1 公転の後の差 = 二次の式(向き 2)', `${fe(S.ex[0].ampRel)}・${fe(S.ex[0].endRel)}`, G.wobbleOrder],
      ['⑧ Kepler の方程式の残り・離心率 0 で位相が `spinRot` と同じ', '< 1e-14', G.kepler],
      ['⑨ 金星の ψ の格子: ψ 0 が〔第352便n〕の `stateOf` の残り・補間は格子の点で格子の値・ρ 0 の步の行き先が〔第352便n〕の `finalOf`(読み α)', `${f2(S.turn.st0)}・${f2(S.turn.fo)}`, G.turnGrid],
      ['⑩ 入力の拒否(物差し・θ・W・散らばり・背景の向き・大きさ・円錐の軸・離心率)', `${S.rejects.filter(Boolean).length}/${S.rejects.length}`, G.rejects],
    ].map(([x, b, g]) => `| ${x} | ${b} | ${g ? '真' : '偽'} |`).join('\n'); }
  { const pick = (r, k) => r.find((x) => x.mag === k);
    const grp = {};
    for (const r of J.keep) { const g = r.key + '|' + r.dir + r.axis + '|' + r.tSrc; (grp[g] = grp[g] || []).push(r); }
    T.keep = '| 受け手 | 背景 | 源の半径 | θ(倍率 1)° | 観測の傾き ° | f の上限 10% (uV) | 倍率 1 | (仮) | f の上限 1° 倍率 1 | f_輪 の下限 30° → 7° 倍率 1 | f_輪 ÷ f(10%) | f_輪 ÷ f(1°) | 同じ f で両方 |\n|---|---|---|---|---|---|---|---|---|---|---|---|---|\n'
      + Object.values(grp).filter((g) => !(g[0].dir === 'Gm' && g[0].axis === 'eq')).map((g) => { const a = pick(g, 'uV'), b = pick(g, 'u1'), c = pick(g, 'uP');
        return `| ${KN[b.key]} | ${BN[b.dir + b.axis]} | ${TN[b.tSrc]} | ${f2(b.thDeg)} | ${f2(b.oblDeg)} | ${lim(a.keep.q10)} | ${lim(b.keep.q10)} | ${lim(c.keep.q10)} | ${lim(b.keep.d1)} | ${fe(b.ring['30-7'].f)} | ${fe(b.ratio['30-7|q10'])} | ${fe(b.ratio['30-7|d1'])} | ${yn(b.same['30-7|q10'])} |`; }).join('\n'); }
  { const at = (r, e) => r.pts.find((p) => p.e === e);
    T.scan = '| 受け手 | 背景 | 源の半径 | f_輪 が届く最小の倍率の桁 | f_輪 ÷ f: 倍率 0.1 | 1 | 10 | 1e3 | 1e6 | 最小 | 同じ f で両方が成り立つ倍率 |\n|---|---|---|---|---|---|---|---|---|---|---|\n'
      + J.scan.map((r) => `| ${KN[r.key]} | ${r.dir === 'Np' ? '(N+) L' : '(G−) L'} | ${TN[r.tSrc]} | 1e${r.eFirstRing} | ${fe(at(r, -1).ratio)} | ${fe(at(r, 0).ratio)} | ${fe(at(r, 1).ratio)} | ${fe(at(r, 3).ratio)} | ${fe(at(r, 6).ratio)} | ${fe(r.ratioMin)} | ${r.sameAny ? '在る' : '無い(1e-14〜1e6)'} |`).join('\n'); }
  { const grp = {};
    for (const r of J.cone) { const g = r.key + '|' + r.dir + r.axis + '|' + r.tSrc; (grp[g] = grp[g] || []).push(r); }
    T.cone = '| 惑星 | 背景 | 源の半径 | 観測の傾き ° | 合成の軸のまわり: 傾きの範囲 (uV) ° | 周期 (uV) 年 | 倍率 1 の範囲 ° | 周期 倍率 1 年 | 読み A(局所の (S) の軸): 傾きの範囲 ° | 周期 年 |\n|---|---|---|---|---|---|---|---|---|---|\n'
      + Object.values(grp).filter((g) => !(g[0].dir === 'Gm' && g[0].axis === 'eq')).map((g) => { const a = g.find((x) => x.mag === 'uV'), b = g.find((x) => x.mag === 'u1');
        return `| ${KN[a.key]} | ${BN[a.dir + a.axis]} | ${TN[a.tSrc]} | ${f2(a.oblDeg)} | ${f2(a.om.oblMinDeg)}〜${f2(a.om.oblMaxDeg)} | ${fe(a.om.periodYr)} | ${f2(b.om.oblMinDeg)}〜${f2(b.om.oblMaxDeg)} | ${fe(b.om.periodYr)} | ${f2(a.locA.oblMinDeg)}〜${f2(a.locA.oblMaxDeg)} | ${fe(a.locA.periodYr)} |`; }).join('\n'); }
  { const sel = J.phase.filter((r) => r.f === 0 && r.sense === 'g2p'), get = (id, t, e, bg) => sel.find((r) => r.id === id && r.tSrc === t && r.e === e && r.bg === bg);
    const keys = [...new Set(sel.map((r) => r.id + '|' + r.tSrc + '|' + r.e))];
    T.phase = '| 天体 | 源の半径 | 離心率 | 公転の周期 年 | 位相のずれの最大 ÷ 平均(局所だけ) | 揺れの最大 ″ | 1 公転の後の二次の差 ″(局所だけ) | 二次 ÷ 1 公転の回り | 年齢の積み °((N+) L 倍率 1) | 年齢の積み °((G−) L (uV)) | 平均の (S) の離心率 0 からの差(割合) |\n|---|---|---|---|---|---|---|---|---|---|---|\n'
      + keys.map((k) => { const [id, t, e] = k.split('|'), a = get(id, +t, +e, 'none'), b = get(id, +t, +e, 'NpL_u1'), c = get(id, +t, +e, 'GmL_uV');
        return `| ${IN[id]} | ${TN[t]} | ${Number(e) === 0 ? '0' : Number(e).toFixed(4)} | ${f2(a.TYr)} | ${fe(a.varRel)} | ${fe(a.ampAs)} | ${fe(a.m2As)} | ${fe(a.m2OverTurn)} | ${fe(b.m2AgeDeg)} | ${fe(c.m2AgeDeg)} | ${fe(a.dMeanRel)} |`; }).join('\n'); }
  T.turnG = '| 基準軸 | いまの公転面の残り ÷ 背景 | ψ の平均の残り | 残りの最小〜最大 | ψ の平均の合成の大きさ | ψ の平均の合成と基準軸の角 ° | いまの傾き ° | 公転の法線と基準軸の角 ° |\n|---|---|---|---|---|---|---|---|\n'
    + J.turn.grids.map((g) => `| ${g.axis} | ${fe(g.res0)} | ${fe(g.resMean)} | ${fe(g.resMin)}〜${fe(g.resMax)} | ${fe(g.vecMeanMag)} | ${f2(g.vecMeanAngRefDeg)} | ${f2(g.oblNowDeg)} | ${f2(g.nRefDeg)} |`).join('\n');
  T.turn = '| 基準軸 | 輪の回る率 ρ(背景の単位) | 歳差の向き | 終わりの傾き ° | 最後の 1 割の傾きの範囲 ° | 終わりの自転軸と基準軸の角 ° | ψ の平均の合成の軸との角(終わり・最後の 1 割の最大)° | 落ち着く時間 年 | 走らせた時間 年 |\n|---|---|---|---|---|---|---|---|---|\n'
    + J.turn.rows.map((r) => `| ${r.axis} | ${r.rho} | ${SN[r.sense]} | ${f2(r.oblEndDeg)} | ${f2(r.oblLastMinDeg)}〜${f2(r.oblLastMaxDeg)} | ${f2(r.angRefEndDeg)} | ${f2(r.angMeanEndDeg)}・${f2(r.angMeanLastMaxDeg)} | ${fe(r.settleYr)} | ${fe(r.endYr)} |`).join('\n');
  return T;
}
const rng = (xs, f) => { const v = xs.filter((x) => Number.isFinite(x)); const a = Math.min(...v), b = Math.max(...v); return f(a) === f(b) ? f(a) : f(a) + '〜' + f(b); };
export function factsOf(J) {
  const F = {}, K = (key, dir, axis, t, mag) => J.keep.find((r) => r.key === key && r.dir === dir && r.axis === axis && r.tSrc === t && r.mag === mag);
  { const e1 = K('Earth|Sun', 'Np', 'L', 0, 'u1'), eP = K('Earth|Sun', 'Np', 'L', 0, 'uP'), eV1 = K('Earth|Sun', 'Np', 'L', 1, 'uV'), m1 = K('Mars|Sun', 'Np', 'L', 0, 'u1'), s1 = K('Sun|-', 'Np', 'L', 0, 'u1');
    const u1 = J.keep.filter((r) => r.mag === 'u1' && r.key !== 'Venus|Sun'), v1 = J.keep.filter((r) => r.mag === 'u1' && r.key === 'Venus|Sun');
    F.keep = `傾き(自転軸と合成の角)が年齢の間に 10% より多く縮まない f の上限は、(N+) L・規則の半径・倍率 1 で地球 ${fe(e1.keep.q10.fMax)}・火星 ${fe(m1.keep.q10.fMax)}・太陽 ${fe(s1.keep.q10.fMax)}、(仮) では地球 ${fe(eP.keep.q10.fMax)}(1° の物差しでは倍率 1 で地球 ${fe(e1.keep.d1.fMax)})。`
      + `(uV) では規則の半径は上限なし・観測の半径では地球 ${lim(eV1.keep.q10)}。公転面が 30° から 7° に寄る f_輪 の下限は、倍率 1 で ${fe(e1.ring['30-7'].f)}・(仮) で ${fe(eP.ring['30-7'].f)}・(uV) では届かない。`
      + `倍率 1 で、比 f_輪 ÷ f は金星を除く 10 受け手で ${rng(u1.map((r) => r.ratio['30-7|q10']), fe)}(10%)・${rng(u1.map((r) => r.ratio['30-7|d1']), fe)}(1°)—— 同じ f で両方が成り立つのは金星の (N+) の行だけ(金星の比 ${rng(v1.map((r) => r.ratio['30-7|q10']), fe)})。`; }
  { const S = J.scan;
    F.scan = `倍率を 1e-14〜1e6 に振ると、f_輪 が届くのは倍率 ${fe(J.keep[0].ring['30-7'].uMin)} 以上(30° → 7°)で、比 f_輪 ÷ f(10%)の最小は列ごとに ${rng(S.map((r) => r.ratioMin), fe)}・大きい倍率の側の値は ${rng(S.map((r) => r.ratioAtTop), fe)}。`
      + `背景が局所より十分大きい所では比は倍率に依らない(縮みの対数の比 x_輪 ÷ x と同じ)。地球・火星・太陽で、同じ f で両方が成り立つ倍率は ${S.every((r) => !r.sameAny) ? 'どの列にも無い' : '在る列が在る'}。`; }
  { const C = (key, dir, axis, t, mag) => J.cone.find((r) => r.key === key && r.dir === dir && r.axis === axis && r.tSrc === t && r.mag === mag);
    const eN = C('Earth|Sun', 'Np', 'L', 0, 'uV'), eNe = C('Earth|Sun', 'Np', 'eq', 0, 'uV'), eN1 = C('Earth|Sun', 'Np', 'L', 0, 'u1'), eG = C('Earth|Sun', 'Gm', 'L', 0, 'uV'), eG1 = C('Earth|Sun', 'Gm', 'L', 0, 'u1'), mN = C('Mars|Sun', 'Np', 'L', 0, 'uV'), eO = C('Earth|Sun', 'Np', 'L', 1, 'uV');
    F.cone = `f が上限より十分小さいとき、自転軸は円錐の軸のまわりを回り、観測の傾き(公転の法線との角)は 1 周の間に揺れる。地球: (N+) L の合成の軸のまわりで ${f2(eN.om.oblMinDeg)}〜${f2(eN.om.oblMaxDeg)}°((uV)・周期 ${fe(eN.om.periodYr)} 年)・`
      + `(N+) eq で ${f2(eNe.om.oblMinDeg)}〜${f2(eNe.om.oblMaxDeg)}°・倍率 1 で ${f2(eN1.om.oblMinDeg)}〜${f2(eN1.om.oblMaxDeg)}°(周期 ${fe(eN1.om.periodYr)} 年)。(G−) L では ${f2(eG.om.oblMinDeg)}〜${f2(eG.om.oblMaxDeg)}°((uV))・${f2(eG1.om.oblMinDeg)}〜${f2(eG1.om.oblMaxDeg)}°(倍率 1)。`
      + `読み A(局所の (S) の軸)では ${f2(eN.locA.oblMinDeg)}〜${f2(eN.locA.oblMaxDeg)}°(源の半径に依らない —— 周期は規則 ${fe(eN.locA.periodYr)} 年・観測 ${fe(eO.locA.periodYr)} 年)。火星は (N+) L (uV) で ${f2(mN.om.oblMinDeg)}〜${f2(mN.om.oblMaxDeg)}°。`; }
  { const P = J.phase.filter((r) => r.f === 0 && r.sense === 'g2p' && r.bg === 'none'), r0 = P.filter((r) => r.tSrc === 0), r1 = P.filter((r) => r.tSrc === 1), A = J.phase.filter((r) => r.bg === 'NpL_u1');
    const me = J.phase.find((r) => r.id === 'Mercury' && r.e > 0.2 && r.bg === 'none'), e1 = J.phase.find((r) => r.id === 'Earth' && r.e === 0.1 && r.bg === 'none');
    F.phase = `局所の (S) を公転の位相で平均しないとき、位相ごとの値は平均から ${rng(P.filter((r) => r.e === 0).map((r) => r.varRel), fe)}(離心率 0)・${rng(P.filter((r) => r.e > 0).map((r) => r.varRel), fe)}(離心率の列)の割合でずれる。`
      + `章動に当たる揺れの最大は、規則の半径で ${rng(r0.map((r) => r.ampAs), fe)}″・観測の半径で ${rng(r1.map((r) => r.ampAs), fe)}″。1 公転の後の位相ごとの步と平均の步の差は二次で、1 公転の回りの ${rng(P.map((r) => r.m2OverTurn), fe)} 倍・`
      + `年齢の間に積んでも ${rng(A.map((r) => r.m2AgeDeg), fe)}°((N+) L 倍率 1)。平均の步の行き先と円錐は変わらない —— 変わるのは平均の (S) の大きさで、離心率 0.1 で ${fe(e1.dMeanRel)}・水星の離心率で ${fe(me.dMeanRel)} の割合(向きの差は ${fe(me.dMeanAngDeg)}°)。`; }
  { const G = J.turn.grids, R = (axis, rho, s) => J.turn.rows.find((r) => r.axis === axis && r.rho === rho && r.sense === s);
    const gl = G.find((g) => g.axis === 'L'), ge = G.find((g) => g.axis === 'eq');
    F.turn = `金星の公転面が基準軸のまわりを回ると、残り(合成 ÷ 背景)は ψ で L ${fe(gl.resMin)}〜${fe(gl.resMax)}・eq ${fe(ge.resMin)}〜${fe(ge.resMax)} に動き、ψ の平均の合成(ベクトルの平均)の大きさは L ${fe(gl.vecMeanMag)}・eq ${fe(ge.vecMeanMag)}(いまの公転面の ${f2(gl.vecMeanMag / gl.res0)} 倍・${f2(ge.vecMeanMag / ge.res0)} 倍)で、基準軸から ${f2(gl.vecMeanAngRefDeg)}°・${f2(ge.vecMeanAngRefDeg)}°。`
      + `公転面を回さない (ρ 0) の行き先は L ${f2(R('L', 0, 'g2p').oblEndDeg)}°・eq ${f2(R('eq', 0, 'g2p').oblEndDeg)}°(${fe(R('L', 0, 'g2p').settleYr)}・${fe(R('eq', 0, 'g2p').settleYr)} 年)。`
      + `輪が背景と同じ桁の率で回る (ρ 1) と、自転軸は ψ の平均の合成の軸の近くに来て(終わりの角 L ${f2(R('L', 1, 'g2p').angMeanEndDeg)}°・eq ${f2(R('eq', 1, 'g2p').angMeanEndDeg)}°)、傾きは L ${f2(R('L', 1, 'g2p').oblEndDeg)}°・eq ${f2(R('eq', 1, 'g2p').oblEndDeg)}°((g2+))・${f2(R('L', 1, 'g2m').oblEndDeg)}°・${f2(R('eq', 1, 'g2m').oblEndDeg)}°((g2−))。`
      + `ρ 1e-3〜1e-1 では、走らせた時間(L ${fe(R('L', 0.1, 'g2p').endYr)} 年)の間に落ち着かず、最後の 1 割の傾きは ρ 0.1 で ${f2(R('L', 0.1, 'g2p').oblLastMinDeg)}〜${f2(R('L', 0.1, 'g2p').oblLastMaxDeg)}°((g2+) L)に揺れる。`; }
  return F;
}
