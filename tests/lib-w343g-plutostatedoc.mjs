// 第343便g(決断事項 AN807・AN822・統括の検証項目 R384): **正本 tests/out/plutostate-343g.json から PHYSICS〔第343便g〕の表を作る文書の lib**
// (QA docs.plutostate343g が節の表と逐語で照合する —— 表の数は有効数字 3 桁の指数か決まった桁の固定小数・丸めで 0 と書いた値は「0」・往復と作り直しの差は「< 1e-x」の形)。
export const DOC_VERSION = 'w343g-plutostatedoc-1';
const fe = (x) => (x === null || x === undefined || !Number.isFinite(x) ? '—' : x === 0 ? '0' : Number(x).toExponential(2));
const fx = (x, d) => (x === null || x === undefined || !Number.isFinite(x) ? '—' : x.toFixed(d));
const lt = (x, t) => (Number.isFinite(x) && Math.abs(x) <= t ? '< ' + t.toExponential(0) : '**' + fe(x) + '**');
const tf = (x) => (x === true ? '真' : x === false ? '偽' : 'null');
const GMJ = Object.freeze({ repo: 'リポジトリの値(主)', csvDerived: 'csv から逆に読んだ値(比べる列)' });
const yn = (x) => (x ? '**大きい**' : '小さい');

export function tablesOf(J) {
  const T = {}, S = J.pure.scenes, G = J.pure.gates;
  T.pure = ['| 場面 | 値 | 門 |', '|---|---|---|',
    `| ① 要素 → 状態 → 要素の往復(傾き 96°・e 1e-3 —— 角と相対の差の最大)| ${lt(S.roundTrip, 1e-10)} | ${tf(G.roundTrip)} |`,
    `| ② 円(e = 0)の状態から読む e | ${lt(S.circE, 1e-13)} | ${tf(G.circE)} |`,
    `| ③ 円で平均近点角を π 進めると反対の位置(差 ÷ a)| ${lt(S.halfOpp, 1e-12)} | ${tf(G.halfOpp)} |`,
    `| ④ 桁の幅(印字の最後の桁の半分): 1.370860133507983e+03・-8.639354888307112e-03・17464.1723744826 | ${S.digit.map(fe).join('・')} | ${tf(G.digit)} |`,
    `| ⑤ 第341便g の入力を入れると第341便g の関数の値のまま | ${tf(S.same341g)} | ${tf(G.same341g)} |`,
    `| ⑥ 入力の拒否(GM 0・数でない印字)| ${S.reject.n}/${S.reject.of} | ${tf(G.reject)} |`].join('\n');

  const I = J.t1.inventory;
  T.inventory = ['| 項目 | 値 |', '|---|---|',
    `| 行の数(状態・要素・その他)| ${I.nRows}(${I.nState}・${I.nElem}・${I.nOther})|`,
    `| 天体(状態の行の数)| ${Object.entries(I.perBody).map(([b, n]) => b + ' ' + n).join('・')} |`,
    `| 状態の元期 | ${I.epochsState.join('・')} |`,
    `| 解の名(ephemeris の列)| ${I.ephemeris.join('・')} |`,
    `| 要素の行の天体と中心 | ${I.elemBodies.join('・')}(${I.elemCenter.join('・')})|`,
    `| 単位 | ${I.units.join('・')} |`,
    `| GM・質量の行 | ${I.gmRows} |`,
    `| sigma の列が空でない行 | ${I.sigmaNonEmpty}(sigma_kind: ${I.sigmaKinds.join('・')} —— 桁の幅と同じ値の 2 回の印字の幅で、1σ ではない)|`].join('\n');

  T.rel = ['| 元期 | カロン − 冥王星 の位置 [km] | 速度 [km/s] | 距離 [km] | 速さ [km/s] | 冥王星 ÷ カロン の重心からの距離の比 q(位置・速度)|', '|---|---|---|---|---|---|']
    .concat(J.t1.rel.map((r, i) => { const e = J.t2.epochs[i]; return `| ${r.epoch} | (${r.r.map((x) => fx(x, 3)).join(', ')}) | (${r.v.map((x) => fx(x, 8)).join(', ')}) | ${fx(e.relRKm, 3)} | ${fx(e.relVKms, 8)} | ${fx(r.qPos, 8)}・${fx(r.qVel, 8)} |`; })).join('\n');

  T.gm = ['| 元期 | 重心のまわりのカロンの要素の μ = n² a³ [km³/s²] | q(位置)| GM = μ (1 + q)³ [km³/s²] | 同(q を速度で)| リポジトリの値 [km³/s²] | リポジトリの値の q(869.3 と 106.1)|', '|---|---|---|---|---|---|---|']
    .concat(J.t2.epochs.map((r) => `| ${r.epoch} | ${fx(r.gm.muBary, 9)} | ${fx(r.gm.qPos, 8)} | ${fx(r.gm.csvDerived, 4)} | ${fx(r.gm.csvDerivedVel, 4)} | ${fx(r.gm.repo, 1)} | ${fx(r.gm.qRepo, 8)} |`)).join('\n');

  T.elements = ['| 元期 | GM の出どころ | a [km] | e | 桁の幅から来る e の幅 | 傾き [°] | 昇交点 [°] | 近点の引数 [°] | 平均の運動 [°/日] | 周期 [s] |', '|---|---|---|---|---|---|---|---|---|---|']
    .concat(J.t2.epochs.flatMap((r) => Object.keys(GMJ).map((k) => { const b = r.byGM[k]; return `| ${r.epoch} | ${GMJ[k]} | ${fx(b.aKm, 4)} | ${fe(b.e)} | ${fe(b.eWidth)} | ${fx(b.incDeg, 6)} | ${fx(b.nodeDeg, 6)} | ${fx(b.periDeg, 3)} | ${fx(b.nDegDay, 8)} | ${fx(b.P, 3)} |`; }))).join('\n')
    + '\n\n(同じ中心〔冥王星〕・同じ GM の相対の接触の要素 —— ICRF/J2000 赤道。桁の幅は印字の最後の桁の半分を線形に足した幅〔1σ ではない〕)';

  T.remake = ['| 元期 | a の相対の差 | e の相対の差 | 傾きの差 [°] | 昇交点の差 [°] | 近点の引数の差 [°] | 平均近点角の差 [°] | 周期の相対の差 | 往復の差(位置・速度の相対 —— GM 2 つの最大)|', '|---|---|---|---|---|---|---|---|---|']
    .concat(J.t2.epochs.map((r) => { const m = r.remakeBary, rt = Math.max(...Object.values(r.byGM).flatMap((b) => [b.roundTrip.r, b.roundTrip.v]));
      return `| ${r.epoch} | ${lt(m.aRel, 1e-9)} | ${lt(m.eRel, 1e-9)} | ${lt(m.incDeg, 1e-9)} | ${lt(m.nodeDeg, 1e-9)} | ${fe(m.periDeg)} | ${fe(m.MDeg)} | ${lt(m.PRel, 1e-9)} | ${lt(rt, 1e-12)} |`; })).join('\n')
    + '\n\n(csv の要素の行〔重心のまわりのカロン〕を、同じ元期のカロンの状態と μ = n² a³ から同じ定義で作り直した差。近点の引数と平均近点角は e が 1.6e-4 の桁なので向きの桁が少ない —— 2 つの差は打ち消し合う)';

  const bw = J.t2.between;
  T.between = [`| GM の出どころ | a の差 [km] | e の差 | 傾きの差 [°] | 昇交点の差 [°] | 軌道の法線の動き [°] | 近点の引数の差 [°] | 接触の周期の差 [s] | 公転の数 | 平均の経度の進みから読む平均の周期 [s] |`, '|---|---|---|---|---|---|---|---|---|---|']
    .concat(Object.keys(GMJ).map((k) => { const b = bw.byGM[k]; return `| ${GMJ[k]} | ${fx(b.dAKm, 4)} | ${fe(b.dE)} | ${fx(b.dIncDeg, 6)} | ${fx(b.dNodeDeg, 6)} | ${fx(b.normalMoveDeg, 6)} | ${fx(b.dPeriDeg, 3)} | ${fx(b.dP, 3)} | ${b.nCycles} | ${fx(b.PBar, 3)} |`; })).join('\n')
    + `\n\n(元期 B − 元期 A —— ${fx(bw.dtDay, 0)} 日・${fx(bw.dtYr, 3)} 年。平均の周期は Δt ÷(平均の経度の差 ÷ 2π + 公転の数)—— GM の出どころに依らない)`;

  const A3 = J.t3;
  T.axis = ['| 元期 | 軌道の法線の赤経 [°] | 赤緯 [°] | 冥王星の極(赤経 ' + fx(A3.poleRaDeg, 3) + '°・赤緯 ' + fx(A3.poleDecDeg, 3) + '° —— 文献の値・未照合)と法線のなす角 [°] |', '|---|---|---|---|']
    .concat(A3.rows.map((r) => `| ${r.epoch} | ${fx(r.normalRaDeg, 4)} | ${fx(r.normalDecDeg, 4)} | ${fx(r.poleVsNormalDeg, 4)} |`)).join('\n')
    + '\n\n(自転の軸は csv の入力に無い。相互ロックなら自転の軸 ≈ 軌道の法線、は仮定 —— 極の値はリポジトリの中の文献の値〔第337便j の LIT〕)';

  T.four = ['| 入力 | a [km] | e | 周期 [s] | (ii) 相互の部位差分 ÷ n | 座標変換の d ÷ n a(系の e)| (i) 外の取り分 | (i) 外の 2 体の間の差 ÷ n a | (iii) 外の部位差分 ÷ n | (v) G_loc の型の残差 ÷ n | 近日点の 2 体の間の差 ÷ n a |', '|---|---|---|---|---|---|---|---|---|---|---|']
    .concat(J.t4.rows.map((r) => `| ${r.ja} | ${fx(r.aKm, 3)} | ${fe(r.e)} | ${fx(r.P, 3)} | ${fe(r.mutAxObs)} | ${fe(r.syncEcc)} | ${fe(r.fExt)} | ${fe(r.dExt)} | ${fe(r.extAx)} | ${fe(r.gloc)} | ${fe(r.dExtPeri)} |`)).join('\n')
    + '\n\n(第341便g の関数〔mutualRow・syncRow・externalRow・glocRow〕をそのまま呼ぶ。同じ解の列の自転は入れた周期の n〔相互ロックの仮定〕・質量と半径は第341便g と同じ)';

  T.split = ['| 入力 | a [km] | GM [km³/s²] | 周期 [s] | 周期 − Buie の周期 [s] | a の分 [s] | GM の分 [s] | a − 19573 km [km] | GM − Buie の含意の GM [km³/s²] |', '|---|---|---|---|---|---|---|---|---|']
    .concat(J.t4.split.map((s) => `| ${s.ja} | ${fx(s.aKm, 3)} | ${fx(s.GM, 4)} | ${fx(s.P, 3)} | ${fx(s.total, 3)} | ${fx(s.aPart, 3)} | ${fx(s.gmPart, 3)} | ${fx(s.aGapKm, 3)} | ${fx(s.gmGap, 4)} |`)).join('\n')
    + `\n\n(Buie の周期 ${fx(J.t4.pBuie, 5)} s・表の σ ${fx(J.t4.sigmaS, 5)} s。a の分 = P(a, GM_Buie) − P(19573 km, GM_Buie)・GM の分 = P(a, GM) − P(a, GM_Buie)。**ノブに吸収しない** —— 残る差を数で並べる)`;

  T.resid = ['| 種類 | 量 | 大きさ(÷ n・周期は ΔP ÷ P)| 定義の差 ÷ P より | Buie の表の σ ÷ P より |', '|---|---|---|---|---|']
    .concat(J.resid.rows.map((r) => `| ${r.kind} | ${r.ja} | ${fe(r.v)} | ${yn(r.overDef)} | ${yn(r.overSigma)} |`)).join('\n')
    + '\n\n(大きさの桁の比べ —— 周期の予言ではない・桁の幅を σ と読まない。(4) と交点の回りの率は第341便g の値)';

  T.t5 = ['| GM の出どころ | 公転の数 | 位置の差 [km] | 動径 [km] | 進む向き [km] | 法線 [km] | 角 [°] |', '|---|---|---|---|---|---|---|']
    .concat(Object.keys(GMJ).map((k) => { const b = J.t5.byGM[k]; return `| ${GMJ[k]} | ${fx(b.nOrbits, 3)} | ${fx(b.posDiffKm, 1)} | ${fx(b.radialKm, 1)} | ${fx(b.alongKm, 1)} | ${fx(b.normalKm, 3)} | ${fx(b.angleDeg, 3)} |`; })).join('\n')
    + '\n\n(元期 A の相対の状態を 2 体のケプラーで元期 B へ進めた位置 − 表の元期 B の位置。小さい衛星・太陽の摂動・歳差を入れていない —— 差の内訳はこの入力からは分けられない)';
  return T;
}
