// 第350便c(原仮定者の整理(2026-11-23 —— 第146報)・統括の検証項目 R420):
// **正本 tests/out/gyrostep-350c.json から PHYSICS〔第350便c〕の表を作る文書の lib**
// (QA docs.gyrostep350c が節の表と逐語で照合する —— 表の数は有効数字 3 桁・角は小数 3 桁・丸めの床の量は「< 1e-12」)。原文(言葉を変えずに引く)と、1 ステップの順の表もここに持つ。
export const DOC_VERSION = 'w350c-gyrostepdoc-1';
const fe = (x) => (x === null || x === undefined || !Number.isFinite(x) ? '—' : x === 0 ? '0' : Number(x).toExponential(2));
const fz = (x) => (x === null || x === undefined || !Number.isFinite(x) ? '—' : x === 0 ? '< 1e-12' : Number(x).toExponential(2));
const f3 = (x) => (x === null || x === undefined || !Number.isFinite(x) ? '—' : Number(x).toFixed(3));
const f4 = (x) => (x === null || x === undefined || !Number.isFinite(x) ? '—' : Number(x).toFixed(4));
const f2 = (x) => (x === null || x === undefined || !Number.isFinite(x) ? '—' : Number(x).toFixed(2));
const tf = (x) => (x === true ? '真' : x === false ? '偽' : '—');
const NM = Object.freeze({ Earth: '地球', Venus: '金星', Io: 'イオ', Pluto: '冥王星', Sun: '太陽', Jupiter: '木星', Charon: 'カロン' });
const READ = Object.freeze({ g1: '(g1) 枠に運ばれる', g2p: '(g2+) τ = Ω⊥ × L', g2m: '(g2−) τ = L × Ω⊥', g3a: '(g3) k_g 0・k_d 1', g3b: '(g3) k_g 1・k_d 0.1', fixed: '軸を固定' });
const WREAD = Object.freeze({ S1: '(S1)', S1e: '(S1e)', S2: '(S2)', S2p: '(S2′)' });
const EX = Object.freeze({ const: 'Ω 一定', cone: 'Ω の向きが回る' });
const INTEG = Object.freeze({ rot: '回転 1 回(Θ をステップの始めで)', mid: '中点(Θ の向きを半ステップで作り直す)' });
const KIND = Object.freeze({ precess: '歳差だけ(角を保つ)', raise: '起こす応答つき(角が減る)' });
const NINETY = Object.freeze({ none: 'トルク無し', yes: '90°(τ ⟂ Ω⊥)', no: '0°(τ ∥ Ω⊥)', mixed: '90° と 0° の和' });

/** 原文(言葉を変えずに引く —— 原仮定者の整理(2026-11-23 —— 第146報)) */
export const SRC = '原仮定者の整理(2026-11-23 —— 第146報)';
export const ORIGINAL = Object.freeze([
  '自転速度は、「慣性回転」と「引きずり回転」の合成である',
  '引きずられる側の自転軸と平行な回転成分は、自転の「引きずり回転」に計上する',
  '引きずられる側の自転軸に直交する回転成分を、ジャイロトルクの計算に使用する。「トルク=慣性モーメント*自転速度*直交する回転成分」が、自転方向に90度ズレた力で現れる。結果的に自転軸を軸引きずりの回転軸に向けて起こす力になる。継続した自転軸を起こす力が歳差運動になる',
  '軸引きずりのトルクの式の自転速度は、前回ステップの慣性回転と引きずり回転の合成。ただし、引きずり回転は差分由来なので毎回リセットする。これは、並進引きずりの式での、「前回ステップの慣性と引きずりの合成として、その前のステップとの差分を使用し、差分由来の引きずりは毎回リセットする」と同様',
  '下記の案も検証する。対象の組は、慣性決定力のgeoPN=3',
]);
/** 統括の読み(原文と分ける)—— [読み, 数えた所] */
export const READINGS = Object.freeze([
  Object.freeze(['自転の速さ = ω_I + ω_D(慣性回転 ω_I は状態・引きずり回転 ω_D はステップごとの一時の値)', '表 1・表 1′']),
  Object.freeze(['ω_D = ŝ·Ω(符号つき)。状態に積まない —— 毎ステップ今の場から作り直す(変異「積む」で ω_T が步の数とともに増えることを零試験で見る)', '表 1・零試験']),
  Object.freeze(['トルクの大きさ = I × ω_T × abs(Ω⊥)(純関数 torqueMag)。向きは〔第347便h〕の (g1)〜(g3) の列 —— 1 つに決めない。3 句の当たり方は表 2', '表 2・表 3']),
  Object.freeze(['「前回ステップの合成」の読みを 4 列に: (S1) ステップの始めに作り直した合成・(S1e) 前のステップの終わりに実際に使った合成を保存したもの・(S2) 姿勢の相対の回転角 ÷ 刻み・(S2′)。リセットするのは引きずりの一時の成分だけ(慣性回転と姿勢の履歴は消さない)', '表 1・表 1′']),
  Object.freeze(['場は第348便h の在位の geoPN=3 の形(K1・球のモーメント・背景 0・自分の重みを分母に・受け手の速度を引く)—— 共通の点検の数と天体 4 組', '数の文・表 5']),
]);
export function originalTable(readings = READINGS) {
  return ['| # | 出どころ | 原文(言葉を変えずに引く) | 読み(統括の読み —— 原文と分ける) | 数えた所 |', '|---|---|---|---|---|',
    ...ORIGINAL.map((o, k) => `| ${k + 1} | ${SRC} | 「${o}」 | ${readings[k][0]} | ${readings[k][1]} |`)].join('\n');
}
/** 表 1 1 ステップの順(固定) */
export const STEP_TABLE = ['| 順 | すること | 量 | 消すもの・残すもの |', '|---|---|---|---|',
  '| ① | 前のステップの終わりに保存した合成と、前のステップの姿勢の相対の回転角を読む | W_save(n−1)・φ(n−1) | 残す(履歴) |',
  '| ② | 今のステップの引きずり回転の一時の値を消す | ω_D | 消す(引きずりの一時の成分だけ) |',
  '| ③ | 今の場から平行成分と直交成分を作る | ω_D = Ω∥ = ŝ·Ω・Ω⊥ = Ω − Ω∥ ŝ | 作り直す |',
  '| ④ | ω_T を読みで決め、トルクを数えて姿勢を回す(Rodrigues —— ŝ の長さを保つ) | τ・Θ = ŝ × τ ÷ L・L = I ω_L・ω_L = ω_I + ω_D | 慣性回転 ω_I は残す((S2′) の列だけ ω_I を作り直す) |',
  '| ⑤ | このステップで実際に使った合成(体を回した自転の速さ)を保存 | W_save(n) = ω_I + ω_D | 残す(次のステップの (S1e)) |',
  '| 初回 | 宣言の初期の自転 | W_save(0) = ω_I(0) + ŝ(0)·Ω(0) | — |'].join('\n');
/** 自転速度の読みの表(固定) */
export const WREAD_TABLE = ['| 読み | ω_T(n) | (S1) と違う所 |', '|---|---|---|',
  '| (S1) | ω_I(n−1) + ŝ(n)·Ω(t_n)(ステップの始めに作り直した合成 —— 〔第348便b〕) | — |',
  '| (S1e) | W_save(n−1) = ω_I(n−1) + ŝ(n−1)·Ω(t_(n−1))(R420 の列) | 引きずり回転の瞬時の分(ŝ·Ω)が前後のステップで変わるとき —— Ω の向きが回る・軸が起きる。Ω 一定の歳差だけ((g1) の厳密な回転)では同じ・(g2±) では刻みの残りの角の変化の分だけ違う |',
  '| (S2) | φ(n−1) ÷ Δt(姿勢の相対の回転角 —— 自転の回転と軸の回転の合成の角。角速度どうしの差ではない) | 軸が動くと √(ω² + abs(Θ)²) の分だけ大きい(Δt → 0) |',
  '| (S2′) | (S2) と同じ・加えて ω_I(n) = φ(n−1) ÷ Δt − ŝ(n)·Ω(t_n) | 軸の回転の分が慣性回転へ移る(慣性回転が増える) |'].join('\n');

const t1p = (r) => `| ${EX[r.ex]} | ${READ[r.read]} | ${r.wI0} | ${WREAD[r.wRead]} | ${f3(r.thEndDeg)} | ${f4(r.precRate)} | ${f4(r.wTOverWL)} | ${fz(r.dS1S1e)} | ${fz(r.dS2S1)} | ${f3(r.torque0)} | ${f3(r.torqueEnd)} | ${f3(r.wIEnd)} |`;
export function tablesOf(J) {
  const T = {};
  T['1′'] = ['| 場の例 | 向きの読み | ω_I(0) | 自転速度の読み | 終わりの角 [deg](θ₀ 40) | Ω のまわりの率 | ω_T ÷ ω_L の平均 | abs((S1) − (S1e)) の最大 | abs((S2) − (S1)) の最大 | トルクの大きさ(初め) | トルクの大きさ(終わり) | 終わりの ω_I |',
    '|---|---|---|---|---|---|---|---|---|---|---|---|', ...J.step.map(t1p)].join('\n');
  T['2'] = ['| 向きの読み | 初めのトルクと Ω⊥ の角(〔第347便h〕) | 角の変化 [deg](t 10) | Ω のまわりの率 | 分け方 | 自転の反転で ŝ の動きが同じ | 自転の反転でトルクが反転 | Ω の反転: Ω のまわりの率 | Ω の反転: Ω への角の変化 [deg] | 合成の自転 0: 動いた角 [deg] | ŝ ∥ Ω: 動いた角 [deg] |',
    '|---|---|---|---|---|---|---|---|---|---|---|',
    ...J.dir.map((r) => `| ${READ[r.read]} | ${NINETY[r.ninety] ?? '—'} | ${f3(r.dThDeg)} | ${f4(r.precRate)} | ${KIND[r.kind]} | ${tf(r.spinRev.sMovedSame)} | ${r.spinRev.torqueFlip === null ? 'トルク無し' : tf(r.spinRev.torqueFlip)} | ${f4(r.omRev.precRate)} | ${f3(r.omRev.dThDeg)} | ${f3(r.zeroSpin.moved)} | ${f3(r.parallel.moved)} |`)].join('\n');
  T['2′'] = ['| 向きの読み | 「自転方向に90度ズレた力」 | 「自転軸を軸引きずりの回転軸に向けて起こす」 | 「継続した自転軸を起こす力が歳差運動になる」 |', '|---|---|---|---|',
    ...J.dir.map((r) => { const p = r.read === 'g1' ? ['当たらない(トルク無し)', '当たらない(角を保つ)', '歳差は在る(枠の回転 —— 起こす力からではない)']
      : r.read === 'g2p' || r.read === 'g2m' ? ['当たる(τ ⟂ Ω⊥ の読み)', '当たらない(角を保つ —— 刻みの残りだけ)', '歳差は在る(起こす力ではなく 90° の力から)']
        : r.read === 'g3a' ? ['読み次第(τ ∥ Ω⊥)', '当たる', '当たらない(Ω へ寄るだけ)'] : ['ノブ次第(k_g の分)', 'ノブ次第(k_d の分)', 'ノブ次第(k_g の分の歳差と k_d の分の起こす応答が並ぶ)'];
    return `| ${READ[r.read]} | ${p[0]} | ${p[1]} | ${p[2]} |`; })].join('\n');
  T['3'] = ['| 向きの読み | 積分 | 閉じた形の率 | 閉じた形の終わりの角 [deg] | 周期(閉じた形)| 角の誤差 [deg](刻み 1・½・¼・⅛) | 率の誤差(刻み 1・½・¼・⅛) | 次数(続く刻みの比の log₂) |', '|---|---|---|---|---|---|---|---|',
    ...J.conv.map((r) => `| ${READ[r.read]} | ${INTEG[r.integ]} | ${f3(r.cfRate)} | ${f3(r.cfThDeg)} | ${r.periodT === null ? '—' : f3(r.periodT)} | ${r.errs.map((e) => fz(e.eTh)).join('・')} | ${r.errs.map((e) => fz(e.ePr)).join('・')} | ${r.order.map((x) => (x === null ? '—' : f2(x))).join('・')} |`)].join('\n');
  T['4'] = ['| 向きの読み | 自転速度の読み | abs(τ·(ω ŝ)) ÷ 尺度 の最大 | abs(τ·Θ) ÷ 尺度 の最大 | 軸の運動の量 ½ I abs(Θ)² の最大 | L·Ω の増し分(t 10) | 熱・自転の増し分 |', '|---|---|---|---|---|---|---|',
    ...J.work.map((r) => `| ${READ[r.read]} | ${WREAD[r.wRead]} | ${fz(r.tauDotSpin)} | ${fz(r.tauDotTheta)} | ${fe(r.kinAxis)} | ${fe(r.dLOm)} | ${r.dest} |`)].join('\n');
  T['5'] = ['| 組 | 候補 | 合成 | abs(Ω) [rad/年] | (g1)・(g2±) の歳差の率 [″/年] | 周期 2π ÷ abs(Ω) [年] | 自転の軸と Ω の角 [deg] | abs(Ω⊥) ÷ abs(Ω) | Ω と公転の軸の角 [deg] | 引きずり回転 ÷ ω | トルクの大きさ [N m] | 観測の歳差 [″/年](文献の値・未照合 —— 比べる列) | 率の比 |',
    '|---|---|---|---|---|---|---|---|---|---|---|---|---|',
    ...J.body.map((r) => `| ${NM[r.id]} | ${NM[r.src]} | ${r.cand === 'W' ? '(W)' : '(P2)'} | ${r.sum === 'W1P' ? '(W1) + 母天体' : '(W1)'} | ${fe(r.magYr)} | ${fe(r.precAsYr)} | ${fe(r.periodYr)} | ${f3(r.thetaDeg)} | ${fe(r.perpOverMag)} | ${fe(r.omNDeg)} | ${fe(r.dragOverW)} | ${fe(r.torque)} | ${r.obsAsYr === null ? '—' : f2(r.obsAsYr)} | ${fe(r.ratio)} |`)].join('\n');
  return T;
}
export function factsOf(J) {
  const c = J.common, e = J.body.find((r) => r.id === 'Earth' && r.cand === 'W' && r.sum === 'W1'), ep = J.body.find((r) => r.id === 'Earth' && r.cand === 'P2' && r.sum === 'W1');
  const s2 = J.step.find((r) => r.ex === 'const' && r.read === 'g2p' && r.wI0 === 10 && r.wRead === 'S1'), th0 = J.decl.theta0Deg * Math.PI / 180, w10 = 10 + Math.cos(th0), pp = Math.sin(th0);
  return {
    common: `共通の点検の数(本節の lib で出た値 —— 源 m 1・R 1・速度 (0,1,0)/受け手 m 1・R 1・位置 (4,0,0)/背景 0・在位の形・腕 0.01): x の直径の 2 点の差分の z 成分 ${c.diamXz.toFixed(8)}・6 点の平均の z 成分 ${c.sixZ.toFixed(8)}・中心の渦度の半分の z 成分 ${c.curlWz.toFixed(8)}。剛体回転 (1,2,3) × r の 6 点の平均 (${c.rigidSix.map((x) => x.toFixed(3)).join(', ')})・x の直径 (${c.rigidX.map((x) => x.toFixed(3)).join(', ')})・純粋なずれの x の直径 ${c.shearX.toFixed(3)}。`,
    torque: `torqueMag({I 1・ω_T 1・abs(Ω⊥) 1}) = ${J.torqueOne}(枝 d と読み比べる数)。`,
    s2: `(S2) と (S1) の差: Ω 一定・(g2+)・ω_I(0) 10 では abs((S2) − (S1)) の最大が ${fe(s2.dS2S1)}(Δt → 0 の目安 √(ω² + abs(Ω⊥)²) − ω = ${fe(Math.hypot(w10, pp) - w10)} —— 軸の回転の角が姿勢の相対の回転角に入る分)。`,
    earth: `地球(在位の形・背景軸引きずり無し・(W1)): (W) の歳差の率 ${fe(e.precAsYr)}″/年・(P2) の歳差の率 ${fe(ep.precAsYr)}″/年(第348便h の表の数と同じ式 —— 比べる数 50.29″/年〔文献の値・未照合〕の ${fe(e.ratio)} 倍と ${fe(ep.ratio)} 倍)。`,
  };
}
