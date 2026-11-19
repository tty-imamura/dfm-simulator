// 第344便e(原仮定者の回答(2026-11-19 —— 第143報の回答 3)AN880・統括の検証項目 R389): **正本 tests/out/spincompose-344e.json から PHYSICS〔第344便e〕の表を作る文書の lib**
// (QA docs.spincompose344e が節の表と逐語で照合する —— 表の数は有効数字 3 桁の指数・丸めの残りは書かない)。
export const DOC_VERSION = 'w344e-spincomposedoc-1';
const fe = (x) => (x === null || x === undefined || !Number.isFinite(x) ? '—' : x === 0 ? '0' : Number(x).toExponential(2));
const f3 = (x) => (x === null || x === undefined || !Number.isFinite(x) ? '—' : Number(x).toFixed(3));
const tf = (x) => (x === true ? '真' : x === false ? '偽' : '—');
const NM = Object.freeze({ Io: 'イオ', Venus: '金星', Earth: '地球', Jupiter: '木星', Mars: '火星', Sun: '太陽', galaxy: '銀河' });
const MG = Object.freeze({ m1: '(m1) 軸引きずりの率', m2: '(m2) 源の自転の速さ' });
const JG = Object.freeze({ up: '増す', down: '減る', unresolved: '未解決' });
const DR = Object.freeze({ slower: '遅い側', faster: '速い側', same: '同じ' });
const MP = Object.freeze({ ident: '恒等', rev: '赤道面の逆回転', dbl: '2 倍角の則' });
const PL = Object.freeze({ ecl: '黄道の極', inv: '不変面の極' });
const cap = (x) => (x === null || x === Infinity ? '∞' : String(x));

export function tablesOf(J) {
  const T = {}, S = J.pure.scenes, G = J.pure.gates;
  T.pure = ['| 零試験・場面 | 値 | 門 |', '|---|---|---|',
    `| ① (C1) 同じ大きさの 2 つを 119°・120°・121° で足した大きさの二乗の差の 3 値 | ${S.c1Zero.map((r) => r.deg + '° ' + JG[r.judge]).join('・')} | ${tf(G.c1Zero)} |`,
    `| ② (C1) 同じ ΔΩ を毎步足す(刻み 200 → 400 で足した量の比)・率で足す(同じ比) | ${f3(S.c1Drive.perStepRatio)}・${f3(S.c1Drive.rateRatio)} | ${tf(G.c1Drive)} |`,
    `| ③ (C2) 角運動量の和と「回転のエネルギー + 積んだ熱」の保存(4 組 × 刻み 2) | ${S.toy.every((r) => r.LconsOk && r.EconsOk) ? '床の内' : '床の外'} | ${tf(G.c2Conserve)} |`,
    `| ④ (C2) 刻み 200 と 400 の差・閉じた形との差(4 組)が 1e-5 の内 | ${S.toy.map((r) => fe(r.diff200_400)).join('・')} | ${tf(G.c2Steps)} |`,
    `| ⑤ (C2) 統括の参考の試作の表と有効数字 3 桁で同じ(4 組) | ${S.toySame.filter(Boolean).length}/${S.toySame.length} | ${tf(G.toyRef)} |`,
    `| ⑥ (C4) 足す分 0 で変わらない(C4a・C4b)・上限 → ∞ で C1(C4a)と源ごとの和(C4b)・上限が今の自転以下なら足さない・Σλ ≤ 1 | ${tf(S.c4.aZero && S.c4.bZero)}・${tf(S.c4.aInf && S.c4.bInf)}・${tf(S.c4.aBelow)}・${tf(S.c4.lambdaSum <= 1 + 1e-15)} | ${tf(G.c4)} |`,
    `| ⑦ 入力の拒否 | ${S.rejects.filter(Boolean).length}/${S.rejects.length} | ${tf(G.rejects)} |`].join('\n');
  T.toy = ['| (k, b) | 受け手の速さの増し分(刻み 400) | 熱(初めの回転のエネルギー = 1) | 残る相対の回転 abs(D) ÷ abs(D₀) | 閉じた形の増し分 | 1% まで届く無次元の時間 |', '|---|---|---|---|---|---|',
    ...S.toy.map((r) => `| (${r.k}, ${r.b}) | ${f3(r.incr)} | ${f3(r.heat)} | ${f3(r.remain)} | ${f3(r.closedIncr)} | ${r.reachT === null ? '届かない' : f3(r.reachT)} |`)].join('\n');
  T.t2 = ['| 天体 | 源 | 目標の回転の大きさの読み | 源の軸との角 [deg] | abs(ΔΩ) ÷ 今の自転 | (C1) 速さの増し分の率 | (C1) | (C3) 速さの増し分の率 | (C3) | (C4a) 上限 1.5・2・10 倍の増し分の率 | (C1) 回転のエネルギーの差 [J] | 源の側の反作用 I abs(ΔΩ) [kg·m²/s] | 〔第343便e〕置き換わる先 |', '|---|---|---|---|---|---|---|---|---|---|---|---|---|',
    ...J.t2.map((r) => `| ${NM[r.id]}${r.retro ? '(逆行)' : ''} | ${NM[r.src]} | ${MG[r.mag]} | ${f3(r.thetaDeg)} | ${fe(r.dOverOmega)} | ${fe(r.c1.incr)} | ${JG[r.c1.judge]} | ${fe(r.c3.incr)} | ${JG[r.c3.judge]} | ${r.c4a.filter((c) => c.cap !== null && c.cap !== Infinity).map((c) => fe(c.incr)).join('・')} | ${fe(r.c1.dEJ)} | ${fe(r.c1.reactL)} | ${r.old343e ? DR[r.old343e.direction] + '・' + fe(r.old343e.reachYr) + ' 年' : '—'} |`)].join('\n');
  T.c2 = ['| 天体 | 源 | 目標の回転の大きさの読み | 初めの速さの変化の率 [1/年](k, b)= (1, 0)・(−1, 0)・(−1, 0.1)・(0, 0.1) | 熱の率 [W](b = 0.1) | ÷ 物差し | 1% まで届く時間 [年](b = 0.1) | ÷ 太陽系の年齢 | ジャイロだけの周期 [年] | 届くまでの熱の和 [J] | 供給の側の仕事の和 [J] |', '|---|---|---|---|---|---|---|---|---|---|---|',
    ...J.t2.map((r) => { const c = r.c2[3], g = r.c2[0];
      return `| ${NM[r.id]} | ${NM[r.src]} | ${MG[r.mag]} | ${r.c2.map((x) => fe(x.spinRateYr)).join('・')} | ${fe(c.heatW)} | ${fe(c.heatOverRuler)} | ${fe(c.reachYr)} | ${fe(c.reachYr === null ? null : c.reachYr / J.decl.ageYr)} | ${fe(g.periodYr)} | ${fe(r.c2HeatTotalJ)} | ${fe(r.c2SupplyTotalJ)} |`; })].join('\n');
  T.c4b = ['| 天体 | 目標の回転の大きさの読み | 飽和 ÷ 今の自転 | λ | 速さの増し分の率 | 判定 |', '|---|---|---|---|---|---|',
    ...J.c4b.map((r) => `| ${NM[r.id]} | ${MG[r.mag]} | ${cap(r.sat)} | ${fe(r.lambda)} | ${fe(r.incr)} | ${JG[r.judge]} |`)].join('\n');
  T.win = ['| 目標の回転の大きさの読み | 木星の熱 ÷ 物差し(X = 1) | イオの熱 ÷ 観測(X = 1) | イオの上限 X | 木星に要る下限 X | 下限 ÷ 上限 | 帯の上端の X | イオと木星(尺度自由) | 帯の上端まで |', '|---|---|---|---|---|---|---|---|---|',
    ...J.win.map((w) => `| ${MG[w.mag]} | ${fe(w.juOverRuler)} | ${fe(w.ioOverObs)} | ${fe(w.capX)} | ${fe(w.needX)} | ${fe(w.needOverCap)} | ${fe(w.bandX)} | ${tf(w.openKfree)} | ${tf(w.openK1)} |`)].join('\n');
  T.t3 = ['| 極 | 銀河の向ける先の写像 | 太陽の向ける先の写像 | 極と銀河の向ける先の角 [deg] | 極と太陽の向ける先の角 [deg] | 接平面の 2 つの寄せる向きのずれ [deg] | 揃えるのに要る位相 [deg] | 比を自由にしたときに残る成分 ÷ 太陽の項(第 3 の項が要る大きさ) |', '|---|---|---|---|---|---|---|---|',
    ...J.t3.map((r) => `| ${PL[r.pole]} | ${MP[r.galMap]} | ${MP[r.sunMap]} | ${f3(r.galPoleDeg)} | ${f3(r.sunPoleDeg)} | ${f3(r.sepDeg)} | ${f3(r.phaseNeedDeg)} | ${fe(r.minResidOverSun)} |`)].join('\n');
  T.bal = ['| 枠 | 銀河の向ける先 | 太陽の軸と銀河の角 [deg] | 合成した先が銀河と 120° になる比 ρ | 正の比 | 合成した先の大きさ ÷ 太陽の項 | 合成した先と黄道の極の角 [deg] | 合成した先と不変面の極の角 [deg] |', '|---|---|---|---|---|---|---|---|',
    ...J.bal.rows.map((r) => `| ${r.frame === 'plane' ? '平面(112.8°)' : '三次元(宣言の極)'} | ${r.place === 'rev' ? '赤道面の逆回転(180°)' : '自転の軸の向き(0°)'} | ${f3(r.sunGalDeg)} | ${fe(r.rho)} | ${tf(r.positive)} | ${f3(r.magRatio)} | ${f3(r.eclDeg)} | ${f3(r.invDeg)} |`)].join('\n');
  const X = J.t3side;
  T.side = ['| 並べる量(〔第343便e〕の値を呼んで読む —— 合わせない) | 値 |', '|---|---|',
    `| 平面の比(単純な角の差 —— 銀河の向ける先 0°・180°)・符号つきの 2 倍角 | ${fe(X.k1g0)}・${fe(X.k1g180)}・${fe(X.k2g0)} |`,
    `| 三次元の寄せる向きのずれ(黄道の極・不変面の極)[deg] | ${f3(X.sepEcl343)}・${f3(X.sepInv343)} |`,
    `| 三次元の残る成分の最小(黄道の極・不変面の極) | ${fe(X.minEcl343)}・${fe(X.minInv343)} |`,
    `| 黄道の極と不変面の極の角 [deg] | ${f3(X.eclInvDeg)} |`,
    `| 同じ大きさの 2 つを 120° で合成した大きさの二乗の差(3 値 —— 第121報の事実の行) | ${JG[J.bal.sameMag120]} |`].join('\n');
  return T;
}
