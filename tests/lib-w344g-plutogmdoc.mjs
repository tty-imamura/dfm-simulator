// 第344便g(決断事項 AN807・AN822・AN885・統括の検証項目 R391): **正本 tests/out/plutogm-344g.json から PHYSICS〔第344便g〕の表を作る文書の lib**
// (QA docs.plutogm344g が節の表と逐語で照合する —— 表の数は有効数字の指数か決まった桁の固定小数・丸めで 0 と書いた値は「0」・往復の差は「< 1e-x」の形)。
export const DOC_VERSION = 'w344g-plutogmdoc-1';
const fe = (x, d = 3) => (x === null || x === undefined || !Number.isFinite(x) ? '—' : x === 0 ? '0' : Number(x).toExponential(d));
const fx = (x, d) => (x === null || x === undefined || !Number.isFinite(x) ? '—' : x.toFixed(d));
const sg = (x, d) => (!Number.isFinite(x) ? '—' : (x > 0 ? '+' : x < 0 ? '−' : '') + Math.abs(x).toFixed(d));
const lt = (x, t) => (Number.isFinite(x) && Math.abs(x) <= t ? '< ' + t.toExponential(0) : '**' + fe(x, 2) + '**');
const tf = (x) => (x === true ? '真' : x === false ? '偽' : 'null');
export const GMJ = Object.freeze({ repo: '(1) リポジトリの値', csvDerived: '(2) 表から逆に読んだ値', kernelSum: '(3) 個別の重力定数の和', kernelSystem: '(4) 系の全体の値(対照)' });
const epJ = (k) => k === 'w341g' ? '第341便g の入力' : k.replace(/^ep(\d+)_(\w+)$/, (m, e, g) => 'JD ' + e + '.5・' + GMJ[g]);

export function tablesOf(J) {
  const T = {}, S = J.pure.scenes, G = J.pure.gates;
  T.pure = ['| 場面 | 値 | 門 |', '|---|---|---|',
    `| ① 冥王星 + カロン の和と 975.4272614547626 の差 | ${lt(S.sumDiff, 1e-12)} | ${tf(G.sum)} |`,
    `| ② 系の全体の値 − 個別の和(小さい衛星の分 —— 文献の値の差)[km³/s²] | ${fe(S.extra)} | ${tf(G.extra)} |`,
    `| ③ (3) の重力定数で要素 → 状態 → 要素の往復 | ${lt(S.roundTrip, 1e-10)} | ${tf(G.roundTrip)} |`,
    `| ④ 重力定数を大きくすると同じ状態の a と周期が小さくなる | ${tf(S.dir)} | ${tf(G.dir)} |`,
    `| ⑤ q ÷ (1 + q) × 和 = カロン の相対の差 | ${lt(S.qSplit, 1e-14)} | ${tf(G.qSplit)} |`,
    `| ⑥ 入力の拒否(重力定数 0・負)| ${S.reject.n}/${S.reject.of} | ${tf(G.reject)} |`].join('\n');

  T.elements = ['| 元期 | 重力定数の出どころ | 重力定数 [km³/s²] | a [km] | e | 近点の引数 [°] | 周期 [s] | 往復の差 |', '|---|---|---|---|---|---|---|---|']
    .concat(J.t1.epochs.flatMap((r) => Object.keys(GMJ).map((k) => { const b = r.byGM[k]; return `| ${r.epoch} | ${GMJ[k]} | ${fx(b.GM, 4)} | ${fx(b.aKm, 4)} | ${fe(b.e, 6)} | ${fx(b.periDeg, 3)} | ${fx(b.P, 3)} | ${lt(b.roundTrip, 1e-12)} |`; }))).join('\n');

  T.ref = ['| 元期 | a [km](この器・参考の試作・差)| e(この器・参考の試作・差)| 周期 [s](この器・参考の試作・差)| 印字の最後の桁の半分の内 |', '|---|---|---|---|---|']
    .concat(J.t1.ref.map((x) => `| ${x.epoch} | ${fx(x.aKm, 4)}・${fx(x.aRef, 3)}・${fe(x.aDiff, 2)} | ${fe(x.e, 6)}・${fe(x.eRef, 5)}・${fe(x.eDiff, 2)} | ${fx(x.P, 4)}・${fx(x.PRef, 3)}・${fe(x.PDiff, 2)} | ${tf(x.within)} |`)).join('\n');

  T.period = ['| 重力定数の出どころ | 接触の周期 元期 A [s] | 元期 B [s] | 平均の周期(平均の経度の進み —— 元期 A → B)[s] | 接触 A − 平均 [s] | 接触 B − 平均 [s] | 接触 B − 接触 A [s] |', '|---|---|---|---|---|---|---|']
    .concat(J.t2.rows.map((r) => `| ${GMJ[r.key]} | ${fx(r.PA, 3)} | ${fx(r.PB, 3)} | ${fx(r.PBar, 3)} | ${sg(r.PAminusPBar, 3)} | ${sg(r.PBminusPBar, 3)} | ${sg(r.PBminusPA, 3)} |`)).join('\n')
    + `\n\n(平均の周期の 4 列の幅 ${fe(J.t2.PBarSpread, 1)} s —— 重力定数に依らない。公転の数 ${J.t2.rows[0].nCycles}・${J.t2.dtDay} 日)`;

  T.ecc = ['| 重力定数の出どころ | e 元期 A | e 元期 B | B − A | (B − A) ÷ A | 近点の引数 A [°] | 近点の引数 B [°] | B − A [°] |', '|---|---|---|---|---|---|---|---|']
    .concat(J.t3.rows.map((r) => `| ${GMJ[r.key]} | ${fe(r.eA, 5)} | ${fe(r.eB, 5)} | ${fe(r.dE, 2)} | ${fe(r.dERel, 2)} | ${fx(r.periA, 3)} | ${fx(r.periB, 3)} | ${sg(r.dPeriDeg, 3)} |`)).join('\n')
    + `\n\n(元期 A の (3) の列のまわりの重力定数に対する e の感度 de/dGM = ${fe(J.t3.dEdGM_A, 3)} (km³/s²)⁻¹。近点の引数の元期の差は年で割らない —— 歳差として読まない)`;

  T.four = ['| 列 | a [km] | e | 相互の部位差分 ÷ n | 座標変換の d(外)÷ n a | 外の取り分 | G_loc の型の残差 ÷ n | 太陽の並進引きずりの 2 体の間の差(近日点)÷ n a |', '|---|---|---|---|---|---|---|---|']
    .concat(J.t4.rows.map((r) => `| ${epJ(r.key)} | ${fx(r.aKm, 3)} | ${fe(r.e, 4)} | ${fe(r.mutAxObs, 4)} | ${fe(r.dExt, 4)} | ${fe(r.fExt, 4)} | ${fe(r.gloc, 4)} | ${fe(r.dExtPeri, 4)} |`)).join('\n');

  T.split = ['| 列 | a [km] | 重力定数 [km³/s²] | 周期 [s] | 周期 − Buie の周期 [s] | a の分 [s] | 重力定数の分 [s] |', '|---|---|---|---|---|---|---|']
    .concat(J.t4.split.map((s) => `| ${epJ(s.key)} | ${fx(s.aKm, 3)} | ${fx(s.GM, 4)} | ${fx(s.P, 3)} | ${sg(s.total, 3)} | ${sg(s.aPart, 3)} | ${sg(s.gmPart, 3)} |`)).join('\n')
    + `\n\n(Buie の周期 ${fx(J.t4.pBuie, 5)} s。a の分 = P(a, GM_Buie) − P(19573 km, GM_Buie)・重力定数の分 = P(a, GM) − P(a, GM_Buie)。**ノブに吸収しない**)`;

  const Q = J.t5;
  T.q = ['| 量 | 値 |', '|---|---|',
    `| q = カロン ÷ 冥王星(個別の重力定数 —— 文献の値・未照合)| ${fx(Q.qGM, 9)} |`,
    `| q(推定の値 106.1 ÷ 869.3 —— 未照合)| ${fx(Q.qEst, 9)} |`]
    .concat(Q.q.map((r) => `| ${r.epoch}: q(重心からの距離の比・速さの比)と個別の重力定数の q の差 | ${fx(r.qPos, 9)}・${fx(r.qVel, 9)}(${fe(r.dPos, 2)}・${fe(r.dVel, 2)})|`)).join('\n');

  T.kep = ['| 重力定数の出どころ | 位置の差 [km] | 動径 [km] | 進む向き [km] | 面の法線 [km] | 公転の数 |', '|---|---|---|---|---|---|']
    .concat(Object.keys(GMJ).map((k) => { const r = Q.kep[k]; return `| ${GMJ[k]} | ${fx(r.posDiffKm, 1)} | ${sg(r.radialKm, 2)} | ${sg(r.alongKm, 1)} | ${sg(r.normalKm, 3)} | ${fx(r.nOrbits, 4)} |`; })).join('\n');
  return T;
}
