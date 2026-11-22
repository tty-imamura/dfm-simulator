// 第347便h(原仮定者の指示(2026-11-22 —— 第145報の補足 1)・統括の検証項目 R407): **正本 tests/out/axisdiff-347h.json から PHYSICS〔第347便h〕の表を作る文書の lib**
// (QA docs.axisdiff347h が節の表と逐語で照合する —— 表の数は有効数字 3 桁の指数・丸めの残りは書かない)。原文の箇条(言葉を変えずに引く)もここに持つ。
export const DOC_VERSION = 'w347h-axisdiffdoc-1';
const fe = (x) => (x === null || x === undefined || !Number.isFinite(x) ? '—' : x === 0 ? '0' : Number(x).toExponential(2));
const f1 = (x) => (x === null || x === undefined || !Number.isFinite(x) ? '—' : Number(x).toFixed(1));
const f2 = (x) => (x === null || x === undefined || !Number.isFinite(x) ? '—' : Number(x).toFixed(2));
const f3 = (x) => (x === null || x === undefined || !Number.isFinite(x) ? '—' : Number(x).toFixed(3));
const tf = (x) => (x === true ? '真' : x === false ? '偽' : '—');
const YR = 365.25 * 86400;
const NM = Object.freeze({ Mercury: '水星', Venus: '金星', Earth: '地球', Mars: '火星', Jupiter: '木星', Saturn: '土星', Uranus: '天王星', Neptune: '海王星', Moon: '月', Io: 'イオ', Pluto: '冥王星',
  Sun: '太陽', EarthHi: '地球(傾きの最大の交点)', EarthLo: '地球(傾きの最小の交点)', Charon: 'カロン' });
const JG = Object.freeze({ up: '順', down: '逆', unresolved: '未解決' });
const JZ = Object.freeze({ up: '正', down: '負', unresolved: '未解決(0)' });
const RD = Object.freeze({ g1: '(g1) 枠に運ばれる', g2p: '(g2+) τ = Ω⊥ × L', g2m: '(g2−) τ = L × Ω⊥', g3: '(g3)' });
const NI = Object.freeze({ yes: '90°(τ ⟂ Ω⊥)', no: '0°(τ ∥ Ω⊥)', mixed: '90° と 0° の和', none: 'トルク無し' });

/** 原文(第145報の補足 1 —— 見出し 2 つ・箇条 9 行。言葉を変えずに引く) */
export const ORIGINAL = Object.freeze([
  '軸引きずりは、円盤引きずりにも影響するので、様々な可能性から最適を探す',
  '並進引きずりは移動と回転を含み、並進引きずりの引きずられる側の部位差分による回転が軸引きずりである。軸引きずりは、源の回転の赤道面方向で強く現れるが、源が無回転で横を通り過ぎても並進引きずりと共に発生する',
  '下記の案も検証する',
  '軸引きずりの回転は、引きずられる側の、源に近い点と遠い点の並進引きずりから計算する',
  '自転速度は、「慣性回転」と「引きずり回転」の合成である',
  '引きずられる側の自転軸と平行な回転成分は、自転の「引きずり回転」に計上する',
  '引きずられる側の自転軸に直交する回転成分を、ジャイロトルクの計算に使用する。「トルク=慣性モーメント*自転速度*直交する回転成分」が、自転方向に90度ズレた力で現れる。結果的に自転軸を軸引きずりの回転軸に向けて起こす力になる。継続した自転軸を起こす力が歳差運動になる',
  '軸が動かなかった分のエネルギーは消えない',
  'エネルギーの行き先は、内部熱か、自転の「慣性回転」。自転速度が増すと、慣性モーメントが増して、トルクが増す',
]);

export function tablesOf(J) {
  const T = {}, S = J.pure.scenes, G = J.pure.gates;
  T.pure = ['| 零試験・場面 | 値 | 門 |', '|---|---|---|',
    `| ① 静止・無回転の源 → 0(候補 5 つの大きさの最大) | ${fe(S.zStatic)} | ${tf(G.staticZero)} |`,
    `| ② 一様な u(D₀ = 0・源 1 つが無回転で動く)→ 0 | ${fe(S.zUni)} | ${tf(G.uniformZero)} |`,
    `| ③ 剛体回転の場 u = V + Ω₀ × r → Ω₀(P2 は Ω₀ − ê(ê·Ω₀))—— 相対の差 P2・P6・W・G・V・(V の n = 1) | ${['P2', 'P6', 'W', 'G', 'V'].map((c) => fe(S.rig[c])).join('・')}・${fe(S.rigV1)} | ${tf(G.rigid)} |`,
    `| ④ 対称な 2 源(±x に同じ速度・D₀ > 0)→ 中心で 0 | ${fe(S.zSym)} | ${tf(G.symZero)} |`,
    `| ⑤ R_b → 0 で (P6)・(V) → (W)(R_b = ${S.lim.map((r) => r.Rb).join('・')} の相対の差) | P6 ${S.lim.map((r) => fe(r.P6)).join('・')}/V ${S.lim.map((r) => fe(r.V)).join('・')} | ${tf(G.limitW)} |`,
    `| ⑥ 解析の勾配と中心差分の差(最大 ÷ 勾配の最大) | ${fe(S.jerr / S.jscale)} | ${tf(G.gradient)} |`,
    `| ⑦ (P2) は自転する源の軸の上で 0・(W) は 0 でない | ${fe(S.P2axis)}・${fe(S.Waxis)} | ${tf(G.p2axis)} |`,
    `| ⑧ ½∇×(f ŝ × r) = f ŝ + ½ f′ d (ŝ − r̂(r̂·ŝ))(D₀ = 0・源 1 つ —— 相対の差) | ${fe(S.w8diff)} | ${tf(G.curlClosed)} |`,
    `| ⑨ 変異 4 つ(P2 の符号・P6 の ½・W の符号・V の分母)で落ちる | ${Object.values(S.mutFail).filter(Boolean).length}/${Object.keys(S.mutFail).length} | ${tf(G.mutants)} |`,
    `| ⑩ ジャイロの読み: (g1)・(g2±) は角を保つ・(g3)(k_d)は起こす(閉じた形 tan(θ/2) = tan(θ₀/2) e^(−k_d abs(Ω) t) との差)・歳差の率 (g1) と (g2−) | ${tf(S.gyro.keepAngle)}・${tf(S.gyro.raise)}・${fe(S.gyro.raiseClosedDiff)}・${f3(S.gyro.rateG1)}・${f3(S.gyro.rateG2m)} | ${tf(G.gyro)} |`,
    `| ⑪ エネルギーの帳簿(熱 + 回転のエネルギーの増し分 − 仕事)÷ 仕事・R1 の閉じた形との差 | ${S.en.map((r) => fe(r.resid)).join('・')}/${S.en.map((r) => fe(r.closedDiff)).join('・')} | ${tf(G.energy)} |`,
    `| ⑫ 入力の拒否 | ${S.rejects.filter(Boolean).length}/${S.rejects.length} | ${tf(G.rejects)} |`].join('\n');
  // (i) まとめ(赤道の向き・赤道 ÷ 軸)
  const cs = ['P2', 'P6', 'W', 'V'];
  T.spinSum = ['| 重みのべき p | q | D₀ | 距離 d | ' + cs.map((c) => `(${c}) 赤道の向き・赤道 ÷ 軸`).join(' | ') + ' |', '|---|---|---|---|' + cs.map(() => '---|').join(''),
    ...J.spinSum.map((r) => `| ${r.p} | ${r.q} | ${r.D0} | ${r.d} | ` + cs.map((c) => `${JG[r[c].eqJudge]}・${r[c].axisZero ? '軸で 0' : f3(r[c].eqOverAxis)}`).join(' | ') + ' |')].join('\n');
  // (i) 緯度ごと(p = 1・d = 10・D₀ 0 と 0.1)
  const lat = J.spin.filter((r) => r.p === 1 && r.d === 10 && (r.D0 === 0 || r.D0 === 0.1));
  T.spinLat = ['| q | D₀ | 緯度 [deg] | (P2) ∥ŝ・⊥ŝ | (W) ∥ŝ・⊥ŝ | (V) ∥ŝ | (G) ずれの大きさ | 2 倍角の則 â ∥ŝ・⊥ŝ | (P2) と â の角 [deg] | (W) と â の角 [deg] |', '|---|---|---|---|---|---|---|---|---|---|',
    ...lat.map((r) => `| ${r.q} | ${r.D0} | ${r.lat} | ${fe(r.P2.par)}・${fe(r.P2.perp)} | ${fe(r.W.par)}・${fe(r.W.perp)} | ${fe(r.V.par)} | ${fe(r.G.shear)} | ${f3(r.twoAngle.par)}・${f3(r.twoAngle.perp)} | ${f1(r.P2.vsTwoAngleDeg)} | ${f1(r.W.vsTwoAngleDeg)} |`)].join('\n');
  // (ii) 通過
  const fl = J.fly.filter((r) => r.m === 1);
  T.fly = ['| p | D₀ | 衝突径数 b | 速さ v | (P2) 回った角 ∫Ω_z dt | (P6) | (W) | (V) | (W) の率の山 | (W) の向き |', '|---|---|---|---|---|---|---|---|---|---|',
    ...fl.map((r) => `| ${r.p} | ${r.D0} | ${r.b} | ${r.v} | ${fe(r.P2.intZshown)} | ${fe(r.P6.intZshown)} | ${fe(r.W.intZshown)} | ${fe(r.V.intZshown)} | ${r.W.judge === 'unresolved' ? '0' : fe(r.W.peakZ)} | ${JZ[r.W.judge]} |`)].join('\n');
  const dep = [];
  for (const r of J.fly.filter((x) => x.D0 > 0 && x.v === 0.01 && x.m === 1)) {
    const rv = J.fly.find((x) => x.p === r.p && x.D0 === r.D0 && x.b === r.b && x.v === 0.1 && x.m === 1), rm = J.fly.find((x) => x.p === r.p && x.D0 === r.D0 && x.b === r.b && x.v === 0.01 && x.m === 2);
    dep.push(`| ${r.p} | ${r.D0} | ${r.b} | ${f3(rv.W.intZ / r.W.intZ)} | ${f3(rm.W.intZ / r.W.intZ)} | ${f3(r.P2.intZ / r.W.intZ)} |`);
  }
  T.flyDep = ['| p | D₀ | b | (W) の回った角の比: v 0.1 ÷ v 0.01 | 質量 2 ÷ 質量 1 | (P2) ÷ (W) |', '|---|---|---|---|---|---|', ...dep].join('\n');
  // (iii) 公転
  T.orb = ['| q | D₀ | 傾き i [deg] | 質量の割合 μ | 自転の分 ∥ŝ・∥n̂ | 源の動きの分 ∥ŝ・∥n̂ | (P2) 和 ∥ŝ | 和 − (自転の分 + 動きの分) |', '|---|---|---|---|---|---|---|---|',
    ...J.orb.map((r) => `| ${r.q} | ${r.D0} | ${r.inc} | ${r.mu} | ${fe(r.spin.s)}・${fe(r.spin.n)} | ${fe(r.trans.mag > 1e-15 ? r.trans.s : 0)}・${fe(r.trans.mag > 1e-15 ? r.trans.n : 0)} | ${fe(r.P2both.s)} | ${fe(r.sumDiff)} |`)].join('\n');
  // (iv) 天体
  T.body = ['| 天体 | 源 | q | (W) ∥自転 [rad/年] | (W) ⊥自転 [rad/年] | ∥ ÷ 今の自転 | 自転の軸と (W) の角 [deg] | (P2) ∥自転 [rad/年] | (P2) ⊥自転 [rad/年] | ∥ の向き |', '|---|---|---|---|---|---|---|---|---|---|',
    ...J.body.map((r) => `| ${NM[r.id]}${r.retro ? '(逆行)' : ''} | ${NM[r.src]} | ${r.q} | ${fe(r.WparYr)} | ${fe(r.WperpYr)} | ${fe(r.WparOverOmega)} | ${f2(r.angSpinOmegaDeg)} | ${fe(r.P2par * YR)} | ${fe(r.P2perp * YR)} | ${JZ[r.judgePar]} |`)].join('\n');
  T.obs = ['| 天体 | 観測の自転の変化の率 [1/年](固定の比べる列 —— 合わせない) | 相対の不確かさ |', '|---|---|---|', ...J.obs.map((o) => `| ${NM[o.id]} | ${fe(o.rateYr)} | ${f2(o.relUnc)} |`)].join('\n');
  // T3
  const Lf = J.ledger;
  T.ledger = [`| 計上の型 | 時定数 τ ÷ 通過の時間 | 引きずり回転の山 | ∫ ω_引きずり dt | (∫ ω_引きずり − ∫ Ω∥)÷ abs(∫ Ω∥) |`, '|---|---|---|---|---|',
    `| (L1) その時々の値 | — | ${fe(Lf.peakL1)} | ${fe(Lf.intL1)} | 0 |`, ...Lf.rows.map((r) => `| (L2) 時定数で寄る | ${r.tauOverPass} | ${fe(r.peakL2)} | ${fe(r.intL2)} | ${fe(r.intRel)} |`)].join('\n');
  T.ledgerTerms = ['| 項 | 場のどこ | 何を持つか | 注 |', '|---|---|---|---|', ...J.ledgerTerms.map((r) => `| ${r.term} | ${r.field} | ${r.holds} | ${r.note} |`)].join('\n');
  // T4
  T.gyroPh = ['| 向きの読み | k_g | k_d | 初めのトルクと Ω⊥ の角 | 角(ŝ と Ω)の変化 [deg](t = 1・abs(Ω) = 1) | 歳差の率(Ω のまわり) | 「自転方向に90度ズレた力」 | 「自転軸を軸引きずりの回転軸に向けて起こす」 | 「継続した…歳差運動になる」 |', '|---|---|---|---|---|---|---|---|---|',
    ...J.gyroPh.map((r) => `| ${RD[r.read]} | ${r.read === 'g3' ? r.kg : '—'} | ${r.read === 'g3' ? r.kd : '—'} | ${NI[r.ninety]} | ${r.raise ? f3(r.dAng) : '0'} | ${f3(r.precRate)} | ${r.ninety === 'none' ? '成り立たない(トルク無し)' : r.ninety === 'yes' ? '成り立つ(τ ⟂ Ω⊥ の読み)' : r.ninety === 'no' ? '読み次第(τ ∥ Ω⊥ —— 軸を倒す力の対は倒す向きから 90° の所に掛かる読みなら成り立つ)' : 'ノブ次第(k_g の分)'} | ${r.raise ? (r.read === 'g3' && r.kg === 0 ? '成り立つ' : 'ノブ次第(k_d の分)') : '成り立たない(角を保つ)'} | ${r.precess ? (r.read === 'g3' ? 'ノブ次第(k_g の分)' : '成り立つ(Ω のまわり)') : '成り立たない(Ω へ寄るだけ —— Ω の向きが公転で回るなら円錐を描く読みは別)'} |`)].join('\n');
  T.gyroBody = ['| 天体 | 源 | q | abs(Ω) = (g1)・(g2±) の歳差の率 [rad/年] | 自転の軸と Ω の角 [deg] | (g3) k_d 1 の届くまで [年] | (g3) (k_g, k_d) = (1, 0.1) の届くまで [年] | 〔第347便e〕(S1) の 1% まで届く時間 [年] |', '|---|---|---|---|---|---|---|---|',
    ...J.gyroBody.map((r) => `| ${NM[r.id]} | ${NM[r.src]} | ${r.q} | ${fe(r.OmegaYr)} | ${f2(r.angSpinOmegaDeg)} | ${fe(r.g3[1].reachYr)} | ${fe(r.g3[2].reachYr)} | ${fe(r.reachS1e)} |`)].join('\n');
  // T5
  T.energy = ['| 読み | 動いた割合 f | 熱へ h | ε | ω(T) ÷ ω₀ | トルク(T) ÷ トルク(0) | 帳簿の残り ÷ 仕事 | R1 の閉じた形 ω₀ + (1 − h)(1 − f) Ω⊥² T との差 |', '|---|---|---|---|---|---|---|---|',
    ...J.energy.map((r) => `| ${r.read} | ${r.f} | ${r.h} | ${r.eps} | ${f3(r.wRatio)} | ${f3(r.torqueRatio)} | ${fe(r.ledgerResid)} | ${r.closedDiff === null ? '—' : fe(r.closedDiff)} |`)].join('\n');
  T.heat = ['| 天体 | q | 源 | Ω⊥(源の和)[rad/s] | 熱の上の限り(h = 1・f = 0)[W] | 物差しの熱 [W](文献の値・未照合) | 比 |', '|---|---|---|---|---|---|---|',
    ...J.heat.map((r) => `| ${NM[r.id]} | ${r.q} | ${r.srcs.split('+').map((s) => NM[s]).join('+')} | ${fe(r.Wperp)} | ${fe(r.heatUpper)} | ${fe(r.ruler)} | ${fe(r.ratio)} |`)].join('\n');
  return T;
}
/** 原文の表(表 1 —— 原文は言葉を変えずに引く)と、どの箇条が新しいか(節の文と照合) */
/** 統括の読み(箇条ごと —— [読み, 新しい所か]) */
export const READINGS = Object.freeze([
  Object.freeze(['軸引きずりの計算の型を 1 つに決め打ちしない。候補を並べ、候補ごとに円盤引きずりの側の見え方も並べる', '前の指示と同じ向き(探索の方針)']),
  Object.freeze(['前半は第140報の定義と同じ。後半(源が自転していなくても、移動の分の並進引きずりの部位差分で回転が出る)が新しい', '後半が新しい']),
  Object.freeze(['次の箇条の案を候補の列に置く(ほかの候補と並べる)', '前の指示と同じ向き(探索の方針)']),
  Object.freeze(['2 点の差分の型 (P2) —— 第138報の補足「近い面と遠い面の差分」・第141報 AN790「近い面と遠い面の差は近似」と並べる', '型として新しい(2 点)']),
  Object.freeze(['自転 = 慣性回転 + 引きずり回転の帳簿', '新しい分け方']),
  Object.freeze(['軸引きずりの回転のうち自転軸に平行な成分 Ω∥ は引きずり回転の側(計上の型は (L1)・(L2) の列)', '新しい']),
  Object.freeze(['ジャイロトルクの大きさ I ω Ω⊥ の案。向きの読みは 1 つに決めない((g1)〜(g3) の列)', '式の案が新しい(向ける力 → ジャイロトルク → 歳差は第141報の回答と同じ向き)']),
  Object.freeze(['第141報の回答(AN803)と同じ向き', '前の指示と同じ向き']),
  Object.freeze(['行き先の名が「自転の慣性回転」。最後の文の読みは 2 つ —— (R1) 角運動量 I ω が増えてトルクが増す(I は固定)/(R2) I そのものが自転とともに増える(扁平)', '行き先の名と最後の文が新しい']),
]);
export function originalTable(readings = READINGS) {
  return ['| # | 原文(原仮定者の指示(2026-11-22 —— 第145報の補足 1)) | 読み(統括の読み —— 原文と分ける) | 新しい所か |', '|---|---|---|---|',
    ...ORIGINAL.map((o, k) => `| ${k + 1} | 「${o}」 | ${readings[k][0]} | ${readings[k][1]} |`)].join('\n');
}

/** 節の文に載せる数の文(QA が節に逐語で在ることを照合する) */
export function factsOf(J) {
  const F = {}, SS = J.spinSum, N = SS.length, cnt = (c, f) => SS.filter((r) => f(r[c])).length, cs = ['P2', 'P6', 'W', 'V'];
  F.spinEq = '赤道で逆の組: ' + cs.map((c) => `(${c}) ${cnt(c, (x) => x.eqJudge === 'down')}/${N}`).join('・');
  F.spinAxis = '軸の上で 0 の組: ' + cs.map((c) => `(${c}) ${cnt(c, (x) => x.axisZero)}/${N}`).join('・');
  const wStrong = SS.filter((r) => r.W.eqStronger);
  F.spinStrong = '赤道が軸より強い組(軸で 0 を含む): ' + cs.map((c) => `(${c}) ${cnt(c, (x) => x.eqStronger)}/${N}`).join('・') + '(W の行: ' + wStrong.map((r) => `p ${r.p}・q ${r.q}・D₀ ${r.D0}・距離 ${r.d}`).join('/') + ')';
  const f0 = J.fly.filter((r) => r.D0 === 0), fp = J.fly.filter((r) => r.D0 > 0), C5 = ['P2', 'P6', 'W', 'G', 'V'];
  const vr = [], pr = [];
  for (const r of fp.filter((x) => x.v === 0.01)) { const r2 = J.fly.find((x) => x.p === r.p && x.D0 === r.D0 && x.b === r.b && x.m === r.m && x.v === 0.1); vr.push(Math.abs(r2.W.intZ / r.W.intZ - 1)); }
  for (const r of fp) pr.push(r.P2.intZ / r.W.intZ);
  F.fly = `D₀ = 0 の行で候補が 0(未解決)の数: ${f0.reduce((t, r) => t + C5.filter((c) => r[c].judge === 'unresolved').length, 0)}/${f0.length * C5.length}・D₀ > 0 の行で (W) の向きが負: ${fp.filter((r) => r.W.judge === 'down').length}/${fp.length}・回った角の v 0.1 と v 0.01 の比と 1 の差の最大 ${fe(Math.max(...vr))}・(P2) ÷ (W) の範囲 ${f3(Math.min(...pr))}〜${f3(Math.max(...pr))}`;
  const B3 = J.body.filter((r) => r.q === 3), pos3 = B3.filter((r) => r.judgePar === 'up');
  F.bodySign = `(W) ∥ が負の組(q 3): ${B3.filter((r) => r.judgePar === 'down').length}/${B3.length}(正は ${pos3.map((r) => NM[r.id] + '・' + NM[r.src]).join('/')})`;
  const dif = J.body.filter((r) => Math.sign(r.P2par) !== Math.sign(r.Wpar) && r.Wpar !== 0);
  F.bodyP2 = `(P2) ∥ と (W) ∥ の符号が違う行: ${dif.map((r) => NM[r.id] + '・' + NM[r.src] + '・q ' + r.q).join('/')}`;
  const PLN = ['Mercury', 'Venus', 'Earth', 'Mars', 'Jupiter', 'Saturn', 'Uranus', 'Neptune'], pl = J.body.filter((r) => PLN.includes(r.id)).map((r) => Math.abs(r.WparOverOmega));
  const par = J.body.filter((r) => ['Moon', 'Io', 'Pluto'].includes(r.id) && r.src !== 'Sun').map((r) => Math.abs(r.WparOverOmega));
  F.bodyRatio = `abs((W) ∥ ÷ 今の自転): 水星〜海王星の太陽の項 ${fe(Math.min(...pl))}〜${fe(Math.max(...pl))}・母天体の項(月・イオ・冥王星)${fe(Math.min(...par))}〜${fe(Math.max(...par))}`;
  const gpl = J.gyroBody.filter((r) => PLN.includes(r.id)).map((r) => r.g3[1].reachYr).filter((x) => x !== null), gpa = J.gyroBody.filter((r) => ['Moon', 'Io', 'Pluto'].includes(r.id) && r.src !== 'Sun').map((r) => r.g3[1].reachYr).filter((x) => x !== null);
  F.gyroReach = `(g3) k_d 1 の届くまで: 母天体の項 ${fe(Math.min(...gpa))}〜${fe(Math.max(...gpa))} 年・水星〜海王星の太陽の項 ${fe(Math.min(...gpl))}〜${fe(Math.max(...gpl))} 年・定まらない行 ${J.gyroBody.filter((r) => r.g3[1].reachYr === null).length}`;
  const ju = J.heat.filter((r) => r.id === 'Jupiter').map((r) => r.ratio), io = J.heat.filter((r) => r.id === 'Io').map((r) => r.ratio);
  F.heat = `イオの比の最大 ${fe(Math.max(...io))}・木星の比の最大 ${fe(Math.max(...ju))}・両方を満たす行 ${J.heat.filter((r) => r.id === 'Io' && r.ratio <= 1 && J.heat.some((x) => x.id === 'Jupiter' && x.q === r.q && x.ratio >= 0.1)).length}`;
  return F;
}
