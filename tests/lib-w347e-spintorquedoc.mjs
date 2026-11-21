// 第347便e(原仮定者の回答(2026-11-21 —— 第145報)「AN910: 推奨で進める」「AN911: 推奨で進める」・統括の検証項目 R404): **正本 tests/out/spintorque-347e.json から PHYSICS〔第347便e〕の表を作る文書の lib**
// (QA docs.spintorque347e が節の表と逐語で照合する —— 表の数は有効数字 3 桁の指数・丸めの残りは書かない)。
export const DOC_VERSION = 'w347e-spintorquedoc-1';
const fe = (x) => (x === null || x === undefined || !Number.isFinite(x) ? '—' : x === 0 ? '0' : Number(x).toExponential(2));
const f2 = (x) => (x === null || x === undefined || !Number.isFinite(x) ? '—' : Number(x).toFixed(2));
const f3 = (x) => (x === null || x === undefined || !Number.isFinite(x) ? '—' : Number(x).toFixed(3));
const tf = (x) => (x === true ? '真' : x === false ? '偽' : '—');
const NM = Object.freeze({ Mercury: '水星', Venus: '金星', Earth: '地球', Mars: '火星', Jupiter: '木星', Saturn: '土星', Uranus: '天王星', Neptune: '海王星', Moon: '月', Io: 'イオ', Pluto: '冥王星',
  Sun: '太陽', EarthHi: '地球(傾きの最大の交点)', EarthLo: '地球(傾きの最小の交点)', Charon: 'カロン' });
const MG = Object.freeze({ m1: '(m1)', m2: '(m2)' });
const JG = Object.freeze({ up: '増す', down: '減る', unresolved: '未解決' });
const SC = Object.freeze({ S0: '(S0) 今', S1: '(S1) 軸引きずりの率', S2: '(S2) トルク固定・天体のノブ' });
const AR = Object.freeze({ lat: '受け手の位置の緯度', ax: '軸どうしの角' });
const PL = Object.freeze({ ecl: '黄道の極', inv: '不変面の極' });
const GD = Object.freeze({ rev: '赤道面の逆回転(−G)', ident: '回転の向き(G)' });
const SR = Object.freeze({ ax: '太陽の軸のまま(第344便e の恒等)', latNode: '緯度の引数・交点(緯度 0)', latMax: '緯度の引数・緯度の最大', latMean: '緯度の引数・1 公転の平均' });
const nm = (id, retro) => NM[id] + (retro ? '(逆行)' : '');

export function tablesOf(J) {
  const T = {}, S = J.pure.scenes, G = J.pure.gates;
  T.pure = ['| 零試験・場面 | 値 | 門 |', '|---|---|---|',
    `| ① 1 公転の平均の閉じた形 −cos i n̂ と位相の点の平均の差(i = ${S.lat.map((r) => r.iDeg + '°').join('・')})・第337便j の lib の平均の内積との差 | ${S.lat.map((r) => fe(r.meanDiff)).join('・')} | ${tf(G.latClosed)} |`,
    `| ② 2 倍角の則の 3 点(赤道・仰角 45°・軸方向 —— 源の軸と作用の軸の角 [deg]) | ${S.three.map(f3).join('・')} | ${tf(G.rule3)} |`,
    `| ③ 軸どうしの角の引数(θ = 0°・30°・90° → 自転の軸と作用の軸の角 [deg]) | ${S.ax.map(f3).join('・')} | ${tf(G.axAngles)} |`,
    `| ④ C2 の初めのトルクの自転の向きの成分 = −k c abs(ΔΩ) sin φ + b c abs(ΔΩ) cos φ | ${tf(S.c2ok)} | ${tf(G.c2Terms)} |`,
    `| ⑤ 3 値の境(第341便c の型 —— 1・−1・丸めの桁・NaN・尺度 ∞) | ${S.j3.map((x) => JG[x]).join('・')} | ${tf(G.judge3)} |`,
    `| ⑥ 120° の残り: 緯度の最大と交点で接線の向きが反転・1 公転の平均で接線の成分 0 | ${tf(S.t4ok)} | ${tf(G.t4Flip)} |`,
    `| ⑦ 入力の拒否 | ${S.rejects.filter(Boolean).length}/${S.rejects.length} | ${tf(G.rejects)} |`].join('\n');
  T.t1 = ['| 天体 | 源 | 読み | 軸どうしの角 [deg] | 公転面と源の赤道面の傾き i [deg] | 傾き(公転面に対する)[deg] | 位相で向きが反転 | abs(ΔΩ) ÷ 今の自転(緯度) | (緯度)定常の速さの増し分の率 | (緯度)向き | (軸どうし)定常の速さの増し分の率 | (軸どうし)向き | 入れ替わる | (緯度)C2 の 4 組の向き(S0) | 〔第344便e〕(C1)・(C3) |',
    '|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|',
    ...J.t1.map((r) => `| ${nm(r.id, r.retro)} | ${NM[r.src]} | ${MG[r.mag]} | ${f2(r.thetaAxDeg)} | ${f2(r.incDeg)} | ${f2(r.oblDeg)} | ${tf(r.phaseFlip)} | ${fe(r.lat.dOverOmega)} | ${fe(r.lat.steadyIncr)} | ${JG[r.lat.judge]} | ${fe(r.ax.steadyIncr)} | ${JG[r.ax.judge]} | ${tf(r.swap)} | ${r.lat.scales.S0.judges.map((x) => JG[x]).join('・')} | ${r.old344 ? JG[r.old344.c1] + '・' + JG[r.old344.c3] : '—'} |`)].join('\n');
  T.steady = ['| 天体 | 源 | 読み | (緯度)定常の傾き [deg] | (緯度)傾きの変化 [deg] | (緯度)自転の軸の回り [deg] | (軸どうし)定常の傾き [deg] | (軸どうし)傾きの変化 [deg] |', '|---|---|---|---|---|---|---|---|',
    ...J.t1.map((r) => `| ${NM[r.id]} | ${NM[r.src]} | ${MG[r.mag]} | ${f3(r.lat.steadyOblDeg)} | ${fe(r.lat.dOblDeg)} | ${fe(r.lat.steadyTurnDeg)} | ${f3(r.ax.steadyOblDeg)} | ${fe(r.ax.dOblDeg)} |`)].join('\n');
  T.t2 = ['| 天体 | 源 | 1% まで届く時間 [年](b = 0.1・緯度)(S0)・(S1)・(S2) | (S0)軸どうし [年] | ÷ 太陽系の年齢 (S1)・(S2) | 初めの速さの変化の率 [1/年]((k, b) = (0, 0.1))(S0)・(S1)・(S2) |', '|---|---|---|---|---|---|',
    ...J.t2.map((r) => `| ${NM[r.id]} | ${NM[r.src]} | ${fe(r.reachS0)}・${fe(r.reachS1)}・${fe(r.reachS2)} | ${fe(r.reachS0ax)} | ${fe(r.reachS1OverAge)}・${fe(r.reachS2OverAge)} | ${fe(r.rateS0)}・${fe(r.rateS1)}・${fe(r.rateS2)} |`)].join('\n');
  T.obs = ['| 天体 | 観測の自転の変化の率 [1/年](固定の比べる列 —— 合わせない) | 相対の不確かさ |', '|---|---|---|',
    ...J.obs.map((o) => `| ${NM[o.id]} | ${fe(o.rateYr)} | ${f2(o.relUnc)} |`)].join('\n');
  T.win = ['| 目標の回転の大きさの読み | 尺度 | 角の引数 | イオの上限 X | 木星に要る下限 X | 下限 ÷ 上限 | 重なる |', '|---|---|---|---|---|---|---|',
    ...J.win.map((w) => `| ${MG[w.mag]} | ${SC[w.scale]} | ${AR[w.arg]} | ${fe(w.capX)} | ${fe(w.needX)} | ${fe(w.needOverCap)} | ${tf(w.open)} |`)].join('\n');
  T.t4 = ['| 極 | 銀河の向ける先 | 太陽の項の向きの読み | 太陽の項の接線の成分 ÷ 太陽の項 | 接平面の寄せる向きのずれ [deg] | (b) 写像の外の位相 [deg] | (a) 第 3 の項 ÷ 太陽の項の接線の成分 | (a) 第 3 の項 ÷ 太陽の項 |', '|---|---|---|---|---|---|---|---|',
    ...J.t4.map((r) => `| ${PL[r.pole]} | ${GD[r.gal]} | ${SR[r.sun]} | ${fe(r.sunTanFrac)} | ${f3(r.sepDeg)} | ${f3(r.phaseNeedDeg)} | ${fe(r.thirdOverSunTan)} | ${fe(r.thirdOverSun)} |`)].join('\n');
  return T;
}
/** 向きが入れ替わる行(読み m1)の名の並び(節の文と照合する) */
export function swapList(J) { return J.t1.filter((r) => r.mag === 'm1' && r.swap).map((r) => NM[r.id] + '・' + NM[r.src]).join('/'); }
