// 第352便n(原仮定者の回答(2026-11-24 —— 第148報)・統括の検証項目 R451):
// **正本 tests/out/venuslong-352n.json から PHYSICS〔第352便n〕の表と数の文を作る文書の lib**
// (QA docs.venuslong352n が節の表と逐語で照合する —— 角は小数 2〜3 桁・比と時間は有効数字 3 桁)。原文(言葉を変えずに引く)と読みの表もここに持つ。
export const DOC_VERSION = 'w352n-venuslongdoc-1';
const fin = (x) => typeof x === 'number' && Number.isFinite(x);
const fe = (x) => (!fin(x) ? '—' : x === 0 ? '0' : Number(x).toExponential(2));
const f2 = (x) => (!fin(x) ? '—' : Number(x).toFixed(2));
const f3 = (x) => (!fin(x) ? '—' : Number(x).toFixed(3));
const f5 = (x) => (!fin(x) ? '—' : Number(x).toFixed(5));
const pc = (x) => (!fin(x) ? '—' : (100 * x).toFixed(2) + '%');
const tf = (x) => (x === true ? '真' : x === false ? '偽' : '—');
const NM = Object.freeze({ Mercury: '水星', Venus: '金星', Earth: '地球', Mars: '火星' });
const BG = (dir, axis) => (dir === 'Np' ? '(N+) ' + axis : '(G−)');
const RN = Object.freeze({ alpha: '(α)', beta: '(β)' });
const SIDE = Object.freeze({ pro: '順行の側', retro: '逆行の側', side: '横倒し', both: '90° を挟む' });
const fin1 = (F) => (F.kind === 'point' ? `点 ${f2(F.epsDeg)}°` : `${F.kind === 'cone' ? '円錐' : '大円'} ${f2(F.epsMin)}〜${f2(F.epsMax)}°`);

/** 原文(言葉を変えずに引く) */
export const ORIGINAL = Object.freeze([
  Object.freeze(['原仮定者の回答(2026-11-24 —— 第148報)', 'AN1019: Aで進める。金星の自転の逆回転は、釣り合った状態で地球とも共鳴した結果である']),
  Object.freeze(['原仮定者の回答(2026-11-24 —— 第148報)', 'AN1016: (乙)で進める。ただし、「釣り合う」に「安定した歳差運動」を含む']),
  Object.freeze(['原仮定者の回答(2026-11-15 —— AN720)', '「金星で釣り合う比」は、今後軸引きずりの計算を見直しても尊重する']),
]);
/** 統括の読み(原文と分ける)—— [読み, 数えた所] */
export const READINGS = Object.freeze([
  Object.freeze(['前半(「A」)= 背景の大きさの主の列 (uV)。後半は予想の文 —— 本節は、打ち消しの残りの回転の下で自転軸が行き着く向きと、要る時間の表(共鳴は数えていない)', '表 2〜表 6']),
  Object.freeze(['合成の向きのまわりを円錐の半頂角を保って回る状態も「釣り合い」に含める。判定の量 3 つ(第352便i)を金星のいまの向きに当てる', '表 2・表 7']),
  Object.freeze(['恒久の条件。本節は (uV) を固定して、倍率の前後(表 5)と公転面の向き(表 6)で残りがどう動くかを並べる', '表 5・表 6']),
]);
export function originalTable(readings = READINGS) {
  return ['| # | 出どころ | 原文(言葉を変えずに引く) | 読み(統括の読み —— 原文と分ける) | 数えた所 |', '|---|---|---|---|---|',
    ...ORIGINAL.map(([src, o], k) => `| ${k + 1} | ${src} | 「${o}」 | ${readings[k][0]} | ${readings[k][1]} |`)].join('\n');
}

export function tablesOf(J) {
  const T = {}, G = J.pure.gates;
  T.pure = ['| 零試験 | 門 |', '|---|---|', ...Object.entries(G).map(([k, v]) => `| ${k} | ${tf(v)} |`)].join('\n');
  // 表 2: 金星のいまの自転軸からの長い步(向きの読み 2 つは行き着く向きが同じ —— 位相の回りだけが逆)
  const lv = J.long.filter((r) => r.id === 'Venus' && r.sense === 'g2p');
  T.long = ['| 背景 | f | 読み | 初めの θ(°) | ι(°) | 行き着く向き(傾き ε) | 側 | 要る時間(年) | 太陽系の年齢の倍 | (g2−) の行との差 |', '|---|---:|---|---:|---:|---|---|---:|---:|---|',
    ...lv.map((r) => { const m = J.long.find((q) => q.id === r.id && q.dir === r.dir && q.axis === r.axis && q.f === r.f && q.read === r.read && q.sense === 'g2m');
      const same = m && m.kind === r.kind && m.side === r.side && (r.kind === 'point' ? m.epsDeg === r.epsDeg : m.epsMin === r.epsMin && m.epsMax === r.epsMax);
      return `| ${BG(r.dir, r.axis)} | ${r.f} | ${RN[r.read]} | ${f2(r.th0Deg)} | ${f2(r.iotaDeg)} | ${fin1(r)} | ${SIDE[r.side]} | ${fe(r.tSettleYr)} | ${fe(r.tSettleAge)} | ${same ? '同じ(位相の回りだけ逆)' : '違う'} |`; })].join('\n');
  // 表 2′: 比べる行(地球・火星・水星 —— f 0.5)
  const lo = J.long.filter((r) => r.id !== 'Venus' && r.sense === 'g2p' && r.f === 0.5);
  T.longOther = ['| 天体 | 背景 | 読み | 初めの θ(°) | 傾き ε₀(°) | ι(°) | 行き着く向き | 側 | 要る時間(年) |', '|---|---|---|---:|---:|---:|---|---|---:|',
    ...lo.map((r) => `| ${NM[r.id]} | ${BG(r.dir, r.axis)} | ${RN[r.read]} | ${f2(r.th0Deg)} | ${f2(r.obl0Deg)} | ${f2(r.iotaDeg)} | ${fin1(r)} | ${SIDE[r.side]} | ${fe(r.tSettleYr)} |`)].join('\n');
  // 表 3: 残りの回転の向き
  T.dir = ['| 背景 | 合成 ÷ 背景 | Ω̂ と基準軸(°) | Ω̂ と金星の公転の法線 ι(°) | Ω̂ と自転軸 θ(°) | φ(°) | α_b(°) | α_S(°) | 閉じた形の θ(°) | 二等分の向きと基準軸(°) | 二等分の向きと Ω̂(°) |', '|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|',
    ...J.dir.rows.map((r) => `| ${BG(r.dir, r.axis)} | ${pc(r.resOverBg)} | ${f3(r.angRefDeg)} | ${f3(r.iotaDeg)} | ${f3(r.thDeg)} | ${f3(r.phiDeg)} | ${f3(r.alphaB)} | ${f3(r.alphaS)} | ${f3(r.thClosedDeg)} | ${f3(r.midToRefDeg)} | ${f2(r.midToOmDeg)} |`)].join('\n');
  // 表 4: 初めを順行に置いたとき((g2+) の行 —— (g2−) の行は行き着く向きが全部同じ)
  const st = J.start.filter((r) => r.sense === 'g2p' && r.f !== 0.1);
  T.start = ['| 大きさ | 背景 | 初めの傾き(°) | f | 読み | 初めの θ(°) | 行き着く向きの ε(方位 4 の最小〜最大 °) | 側 | 逆行の側へ届く | 要る時間の最大(年) | 年齢の倍 |', '|---|---|---:|---:|---|---|---|---|---|---:|---:|',
    ...st.map((r) => `| ${r.u === 'uV' ? '(uV)' : '倍率 1'} | ${BG(r.dir, r.axis)} | ${r.obl0} | ${r.f} | ${RN[r.read]} | ${f2(r.th0Min)}〜${f2(r.th0Max)} | ${f2(r.epsLo)}〜${f2(r.epsHi)} | ${r.sides.map((x) => SIDE[x]).join('・')} | ${r.reachRetro ? '在る' : '無い'} | ${fe(r.tSettleYr)} | ${fe(r.tSettleAge)} |`)].join('\n');
  // 表 5: 倍率の振り(金星の全行・水星と地球は 5 つの倍率)
  const pick = new Set([0.5, 0.99, 1, 1.01, 2]);
  const sr = J.scan.rows.filter((r) => r.id === 'Venus' || (r.axis !== 'gal' && pick.has(r.x)));
  T.scan = ['| 天体 | 背景 | 倍率 ÷ (uV) | 合成 ÷ 背景 | Ω̂ と背景の向き(°) | Ω̂ と基準軸(°) | ι(°) | 順行の初め・f 0.5 (α) | 順行の初め・f 0.5 (β) | いまの自転軸・f 0.5 (β) |', '|---|---|---:|---:|---:|---:|---:|---|---|---|',
    ...sr.map((r) => `| ${NM[r.id]} | ${BG(r.dir, r.axis)} | ${r.x} | ${pc(r.resOverBg)} | ${f2(r.angBgDeg)} | ${f2(r.angRefDeg)} | ${f2(r.iotaDeg)} | ${fin1(r.proAlpha)} | ${fin1(r.proBeta)} | ${fin1(r.nowBeta)} |`)].join('\n');
  T.cross = ['| 天体 | 背景 | 大きさが同じ倍率 ÷ (uV) | 入れ替わり(Ω̂ ⊥ 背景)の倍率 ÷ (uV) | 幅(135° → 45°)÷ (uV) | φ(°) |', '|---|---|---:|---:|---:|---:|',
    ...J.scan.cross.map((r) => `| ${NM[r.id]} | ${BG(r.dir, r.axis)} | ${f3(r.uMagOverUV)} | ${f3(r.uCrossOverUV)} | ${f3(r.uWidthOverUV)} | ${f3(r.phiDeg)} |`)].join('\n');
  // 表 6: 公転面の向きを一周
  T.turnSum = ['| 基準軸 | 公転の法線と基準軸(°) | いまの残り | 一周の最小(ψ) | 最小と今の差 ψ(°) | 一周の最大(ψ) | 一周の平均 | 36 点の中の今の順位(小さい方から 0) | 自転軸(固定)と Ω̂ が 90° 超の点 | 自転軸(一緒に回す)が 90° 超の点 |', '|---|---:|---:|---|---:|---|---:|---:|---:|---:|',
    ...['L', 'eq'].map((a) => { const t = J.turn[a]; return `| ${a} | ${f3(t.incDeg)} | ${pc(t.resNow)} | ${pc(t.fineMin.res)}(${f2(t.fineMin.psiDeg)}°) | ${f2(t.psiFromMinDeg)} | ${pc(t.resMax)}(${t.psiMax}°) | ${pc(t.resMean)} | ${t.rankNow} | ${t.beyond90Fixed}/${t.nRows} | ${t.beyond90Co}/${t.nRows} |`; })].join('\n');
  T.turn = ['| 基準軸 | ψ(°) | 残り | φ(°) | Ω̂ と基準軸(°) | Ω̂ の方位(°) | ι(°) | 自転軸(固定)と Ω̂(°) | 自転軸(一緒に回す)と Ω̂(°) |', '|---|---:|---:|---:|---:|---:|---:|---:|---:|',
    ...['L', 'eq'].flatMap((a) => J.turn[a].rows.filter((r) => r.psiDeg % 30 === 0).map((r) => `| ${a} | ${r.psiDeg} | ${pc(r.res)} | ${f3(r.phiDeg)} | ${f2(r.angRefDeg)} | ${f2(r.azRefDeg)} | ${f2(r.iotaDeg)} | ${f2(r.thSpinFixedDeg)} | ${f2(r.thSpinCoDeg)} |`))].join('\n');
  // 表 7: 判定の量と戻る点
  T.judge = ['| 背景 | f | 向きの読み | θ(°) | 1 周の半頂角の変化(°) | 1 周の位相の進み(°) | 戻りの率の符号 | 1 周 T_W(年) | (β) で 90° に着く(年) |', '|---|---:|---|---:|---:|---:|---|---:|---:|',
    ...J.judge.rows.map((r) => `| ${BG(r.dir, r.axis)} | ${r.f} | ${r.sense === 'g2p' ? '(g2+)' : '(g2−)'} | ${f2(r.thDeg)} | ${f2(r.dThPerTurnDeg)} | ${f2(r.phasePerTurnDeg)} | ${r.returnSign > 0 ? '正(戻る)' : r.returnSign < 0 ? '負(離れる)' : '0(中立)'} | ${fe(r.TWyr)} | ${fe(r.tStarYr)} |`)].join('\n');
  T.inv = ['| 背景 | f | 向きの読み | 傾き I(°) | 目標(自転軸と基準軸 °) | 根の数 | 跳び(外した数) | ρ | 遅れ(°) | 戻りの率(÷ W) | 回る周期(年) |', '|---|---:|---|---:|---:|---:|---:|---|---|---|---|',
    ...J.judge.inv.map((r) => `| ${BG(r.dir, r.axis)} | ${r.f} | ${r.sense === 'g2p' ? '(g2+)' : '(g2−)'} | ${f3(r.IDeg)} | ${f3(r.targetDeg)} | ${r.nRoots} | ${r.jumps} | ${r.roots.map((q) => f2(q.rho)).join('・') || '—'} | ${r.roots.map((q) => f2(q.lagDeg)).join('・') || '—'} | ${r.roots.map((q) => f3(q.returnRate)).join('・') || '—'} | ${r.roots.map((q) => fe(q.periodYr)).join('・') || '—'} |`)].join('\n');
  return T;
}
/** 数の文(正本から作る —— 節に逐語) */
export function factsOf(J) {
  const v = (dir, axis) => J.dir.rows.find((r) => r.dir === dir && r.axis === axis), F = {};
  const L = v('Np', 'L'), Q = v('Np', 'eq');
  F.split = `(N+)・(uV) の金星の残りの回転 Ω̂ は、基準軸から L ${f3(L.angRefDeg)}°・eq ${f3(Q.angRefDeg)}°(どちらも基準軸にほぼ直交)で、いまの自転軸との角は L ${f3(L.thDeg)}°・eq ${f3(Q.thDeg)}°。`;
  F.closed = `大きさが同じとき合成は背景の向きと −Ŝ の二等分の向きに直交し(二等分の向きと Ω̂ の角 ${f2(L.midToOmDeg)}°)、cos θ = (cos α_b − cos α_S) ÷ (2 sin(φ/2)) —— α_S ${f3(L.alphaS)}° に対して α_b は L ${f3(L.alphaB)}°・eq ${f3(Q.alphaB)}°(基準軸 L と eq の角 ${f3(J.dir.axesLeqDeg)}°)。`;
  const lr = (axis, f, read) => J.long.find((r) => r.id === 'Venus' && r.dir === 'Np' && r.axis === axis && r.f === f && r.read === read && r.sense === 'g2p');
  F.dest = `いまの自転軸から f 0.5 で: (α) は L ${fin1(lr('L', 0.5, 'alpha'))}・eq ${fin1(lr('eq', 0.5, 'alpha'))}(要る時間 ${fe(lr('L', 0.5, 'alpha').tSettleYr)} 年・${fe(lr('eq', 0.5, 'alpha').tSettleYr)} 年)、(β) は L ${fin1(lr('L', 0.5, 'beta'))}(90° に着くまで ${fe(lr('L', 0.5, 'beta').tSettleYr)} 年)・eq ${fin1(lr('eq', 0.5, 'beta'))}。`;
  const gm = J.long.find((r) => r.id === 'Venus' && r.dir === 'Gm' && r.f === 0.5 && r.read === 'alpha' && r.sense === 'g2p');
  F.gm = `(G−)・(uV) では合成は背景の ${pc(gm.resOverBg)} で、f > 0 の (α) の行き先は傾き ${f2(gm.epsDeg)}°(逆行の側 —— 要る時間 ${fe(gm.tSettleYr)} 年 = 太陽系の年齢の ${fe(gm.tSettleAge)} 倍)。`;
  const cv = (axis) => J.scan.cross.find((r) => r.id === 'Venus' && r.axis === axis);
  F.cross = `倍率を (uV) の前後で振ると、金星の合成の向きは倍率 ${f5(cv('L').uCrossOverUV)}(L)・${f5(cv('eq').uCrossOverUV)}(eq)× (uV) で基準軸の南の側から北の側へ入れ替わり、幅は ${f3(cv('L').uWidthOverUV)}・${f3(cv('eq').uWidthOverUV)} × (uV)(= 2 sin φ)。`;
  const tL = J.turn.L, tE = J.turn.eq;
  F.turn = `金星の公転の法線を基準軸のまわりに一周させると、残りは L ${pc(tL.fineMin.res)}〜${pc(tL.resMax)}(平均 ${pc(tL.resMean)})・eq ${pc(tE.fineMin.res)}〜${pc(tE.resMax)}(平均 ${pc(tE.resMean)})。最小は、いまの向きから ψ = L ${f2(tL.psiFromMinDeg)}°・eq ${f2(tE.psiFromMinDeg)}° 回した所。`;
  const iv = J.judge.inv.filter((r) => r.f > 0 && r.nRoots > 0);
  F.inv = `回る合成の軸(基準軸のまわり)で、金星のいまの向きが f > 0 の戻る点になる組は ${iv.length} 組(${iv.map((r) => r.axis + '・f ' + r.f + '・' + (r.sense === 'g2p' ? '(g2+)' : '(g2−)') + '・ρ ' + f2(r.roots[0].rho)).join('/') || '無し'})。`;
  return F;
}
