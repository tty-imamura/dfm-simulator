// 第341便g(原仮定者の補足(2026-11-18 —— 第141報)・統括の検証項目 R370): **正本 tests/out/plutocontrol-341g.json から PHYSICS〔第341便g〕の表を作る文書の lib**
// (QA docs.plutocontrol341g が節の表と逐語で照合する —— 表の数は有効数字 3 桁の指数・丸めで 0 と書いた値は「0」・恒等式の残差は「< 1e-x」の形)。
export const DOC_VERSION = 'w341g-plutocontroldoc-1';
const fe = (x) => (x === null || x === undefined || !Number.isFinite(x) ? '—' : x === 0 ? '0' : Number(x).toExponential(2));
const f2 = (x) => (x === null || x === undefined || !Number.isFinite(x) ? '—' : x.toFixed(2));
const f3 = (x) => (x === null || x === undefined || !Number.isFinite(x) ? '—' : x.toFixed(3));
const f4 = (x) => (x === null || x === undefined || !Number.isFinite(x) ? '—' : x.toFixed(4));
const lt = (x, t) => (Number.isFinite(x) && Math.abs(x) <= t ? '< ' + t.toExponential(0) : '**' + fe(x) + '**');
const tf = (x) => (x === true ? '真' : x === false ? '偽' : 'null');
const yn = (x) => (x ? '**大きい**' : '小さい');
export const COL = Object.freeze({ fExt: '(i) 外の取り分(太陽 + 背景)', dExt: '(i) 外の並進引きずりの 2 体の間の差 ÷ n a', mutAxCirc: '(ii) 相互の部位差分(円・系の自転 —— 冥王星–カロンは同期)÷ n',
  mutAxObs: '(ii) 相互の部位差分(系の離心率)÷ n', extAx: '(iii) 外の源の部位差分 ÷ n', gloc: '(v) G_loc の型の残差の近点の率 ÷ n' });
const BJ = Object.freeze({ mercury: '水星', venus: '金星', earth: '地球', mars: '火星', jupiter: '木星', saturn: '土星', uranus: '天王星', neptune: '海王星', pluto: '冥王星' });

export function tablesOf(J) {
  const T = {}, S = J.pure.scenes, G = J.pure.gates;
  T.pure = ['| 場面 | 値 | 門 |', '|---|---|---|',
    `| ① 理想の円・相互ロック(冥王星–カロン)で相互の部位差分 ÷ n | ${fe(S.lockZero)} | ${tf(G.lockZero)} |`,
    `| ② 非同期(受け手の自転 1.1 n): 部位差分の閉じた形 ÷ n・並進の回転成分と自転の差 f Δs ÷ n | ${fe(S.async.closed)}・${fe(S.async.rotMismatch)} | ${tf(G.async)} |`,
    `| ③ 離心率 2e-4 → 2e-3 で部位差分が増える比(1 次なら 10) | ${f3(S.ratio)} | ${tf(G.ratio)} |`,
    `| ④ 第334便d の同期の零試験(円・同期で座標変換の d ÷ n a) | ${lt(S.syncZ, 1.2e-16)} | ${tf(G.syncZ)} |`,
    `| ⑤ 二体の RK4(2880 步)と閉じた式の周期の相対の差 | ${lt(S.intRel, 1e-9)} | ${tf(G.intRel)} |`,
    `| ⑥ 定義の差(閉じた式 —— 同じ解の a と GM の周期 − Buie の周期)[s] | ${f4(S.split)} | ${tf(G.split)} |`,
    `| ⑦ 冥王星の軌道の傾き 17.16° を軌道の法線と黄道の極の薄い角で読み戻す [°] | ${f4(S.back)} | ${tf(G.back)} |`,
    `| ⑧ 入力の拒否 | ${S.reject.n}/${S.reject.of} | ${tf(G.reject)} |`].join('\n');

  const R1 = J.t1.rows;
  T.terms = ['| 系 | 相互ロック | 取り分 自己 | 相互 | 太陽 | 背景 W₀ | (i) 2 体の間の差 ÷ n a | (ii) 円 ÷ n | (ii) 系の e ÷ n | e | (iii) 外の部位差分 ÷ n | (v) ÷ n |', '|---|---|---|---|---|---|---|---|---|---|---|---|']
    .concat(R1.map((r) => `| ${r.ja} | ${r.mutualLock ? '互い' : '—'} | ${fe(r.ex.fSelf)} | ${fe(r.ex.fMut)} | ${fe(r.ex.fSun)} | ${fe(r.ex.fBg)} | ${fe(r.idx.dExt)} | ${fe(r.idx.mutAxCirc)} | ${fe(r.idx.mutAxObs)} | ${fe(r.e)} | ${fe(r.idx.extAx)} | ${fe(r.idx.gloc)} |`)).join('\n')
    + '\n\n(取り分は受け手〔伴〕の重みの和 —— 自己 m/R²・相互 m/a²・太陽 m/D²・背景 W₀ —— に対する割合。太陽–惑星と PSR J0737−3039 の外の源は背景だけ〔背景は静止 —— 座標の速度 0 で、背景軸引きずり ω_bg の回転の分だけ〕。'
    + '部位差分は第340便b の col4At の閉じた形〔受け手の半径 → 0〕。**項の大きさの表 —— 「少ない」の判定には使わない**)';

  const rk = J.t1.rank, keys = Object.keys(COL);
  T.rank = ['| 項 | 冥王星–カロンの順位(7 系の小さい方から) | 最小の系 | 最大の系 |', '|---|---|---|---|']
    .concat(keys.map((c) => { const vs = R1.map((r) => [r.ja, r.idx[c]]).sort((a, b) => a[1] - b[1]); return `| ${COL[c]} | ${rk[c].plutoCharon} | ${vs[0][0]}(${fe(vs[0][1])})| ${vs[vs.length - 1][0]}(${fe(vs[vs.length - 1][1])})|`; })).join('\n');

  T.sync = ['| 系 | 座標変換の d ÷ n a(円・同期 —— 第334便d の量)| 同(系の e)| 相互の部位差分 ÷ n(円・同期)| 同(系の e)| 数値(有限の半径の最小二乗)÷ n | 並進の回転成分と自転の差 ÷ n(系の e)|', '|---|---|---|---|---|---|---|']
    .concat(R1.map((r) => `| ${r.ja} | ${fe(r.sync.circ)} | ${fe(r.sync.ecc)} | ${fe(r.idx.mutAxCirc)} | ${fe(r.idx.mutAxObs)} | ${fe(r.mutObs.maxNumOverN)} | ${fe(r.mutObs.maxRotMismatchOverN)} |`)).join('\n')
    + '\n\n(座標変換の d は受け手の中心の並進引きずりの残り・部位差分はその受け手の中の勾配 —— 別の量。数値の 0 は col4At の床より小さい〔PSR J0737−3039 は自転が速く床が大きい〕)';

  const t2 = J.t2;
  T.incl = ['| 天体 | a [AU] | e | 黄道に対する傾き [°] | 太陽の赤道面に対する傾き [°] | 不変面に対する傾き [°] | 平均の abs(z)/r | 帯の外の時間(R_eq)| 帯の外(太陽の半径)| 帯の外(0.1 AU)| 帯の内の時間の解析の目安(R_eq)| 🛟 の型の場が掛かる時間の割合 |', '|---|---|---|---|---|---|---|---|---|---|---|---|']
    .concat(t2.rows.map((r) => `| ${BJ[r.key]} | ${f3(r.aAU)} | ${f4(r.e)} | ${f3(r.iEclDeg)} | ${f3(r.incSunDeg)} | ${f3(r.incInvDeg)} | ${fe(r.meanZoverR)} | ${f4(r.outside.Req)} | ${f4(r.outside.Rsun)} | ${f4(r.outside.au01)} | ${fe(r.insideGuide.Req)} | ${fe(r.fieldTimeFrac)} |`)).join('\n')
    + `\n\n(太陽の R_eq = ${fe(t2.ReqSun)} m〔🛟 の型の帯の半幅 —— 第337便i の rdOf(sun, 'Req')〕・太陽の半径 ${fe(t2.Rsun)} m・λ ${fe(t2.lambda)}〔本の倍率は掛けない〕・時間の標本 ${J.decl.t2N}。`
    + `冥王星は太陽の赤道面に対する傾きが 9 天体で ${t2.plutoIncSunRank} 番目に大きく・平均の abs(z)/r が ${t2.plutoMeanZRank} 番目に大きい。**🛟 の型を冥王星に当てた数は探索用の型での数**)`;

  const s1 = J.t3.st1, s2 = J.t3.st2, s3 = J.t3.st3, s4 = J.t3.st4;
  T.stage12 = ['| 段 | 量 | 値 |', '|---|---|---|',
    `| (1) 理想の円・相互ロック・外部の場なし | 閉じた式の周期(同じ解の a 19595.764 km・GM 975.4 km³/s²)[s] | ${s1.P.toFixed(4)} |`,
    `| (1) | 相互の部位差分 ÷ n・並進の回転成分と自転の差 ÷ n・座標変換の d ÷ n a | ${fe(s1.mutAxOverN)}・${fe(s1.rotMismatchOverN)}・${fe(s1.syncD)} |`,
    `| (2) 観測の入力(e ${fe(s2.e)}・自転軸は公転の軸に揃う —— 傾きのノブ 0)・外部の場なし | 相互の部位差分 ÷ n・座標変換の d ÷ n a | ${fe(s2.mutAxOverN)}・${fe(s2.syncD)} |`,
    `| (2) | 入力の相対の差: 定義の差 ÷ P・σ ÷ P | ${fe(s2.relDef)}・${fe(s2.relSigma)} |`].join('\n');

  const sp = s2.split;
  T.split = ['| 内訳(閉じた式 —— 定義の差として)| 値 [s] |', '|---|---|',
    `| Buie 2012 の a 19573 km と含意の GM の閉じた式 − Buie の周期 | ${lt(sp.closedBuieMinusObs, 1e-6)} |`,
    `| a を同じ解の 400 年平均へ(差 ${f3(sp.aGapKm)} km)| ${f3(sp.aPart)} |`,
    `| GM を同じ解の値へ(差 ${f3(sp.gmGapKm3s2)} km³/s²)| ${f3(sp.gmPart)} |`,
    `| 和(🥶 の記帳の +7.216805 s)| ${f4(sp.total)} |`].join('\n')
    + '\n\n(a の分と GM の分は 2 桁大きい逆向きの 2 つの項の差 —— **引きずりの係数・ノブに吸収しない**〔AN807〕)';

  T.conv = ['| RK4 の步(1 公転)| 円: 周期の相対の差 | e 2e-4: 周期の相対の差 |', '|---|---|---|']
    .concat(s1.conv.map((c, i) => `| ${c.steps} | ${c.relErr === 0 ? '< 1e-12' : fe(c.relErr)} | ${s2.conv[i].relErr === 0 ? '< 1e-12' : fe(s2.conv[i].relErr)} |`)).join('\n');

  T.solar = ['| 位相 | 太陽からの距離 [AU] | 太陽の取り分 | 太陽の並進引きずりの 2 体の間の差 ÷ n a | 太陽の部位差分 ÷ n | 太陽の重力の潮汐 ÷ 相互の重力(対照の物差し)|', '|---|---|---|---|---|---|']
    .concat(s3.rows.map((r) => `| ${r.at} | ${f2(r.DAU)} | ${fe(r.fSun)} | ${fe(r.dExtOverNa)} | ${fe(r.extAxOverN)} | ${fe(r.tideOverMutual)} |`)).join('\n')
    + `\n\n(カロンの公転の軸と冥王星の公転の軸の角 ${f2(s3.mutIncDeg)}°・太陽の重力の潮汐による交点の回りの率 ÷ n ${fe(s3.nodeRateOverN)}〔周期 ${fe(s3.nodePeriodYr)} 年 —— 候補の型の外の対照の物差し〕・🛟 の型の場が掛かる時間の割合 ${fe(s3.rotVertTimeFrac)})`;

  T.galaxy = ['| 段 (4) 銀河の背景(背景が静止)| 値 |', '|---|---|',
    `| 背景の取り分 冥王星・カロン | ${fe(s4.fBgPluto)}・${fe(s4.fBgCharon)} |`,
    `| 2 体に共通の座標変換(背景軸引きずりの回転 × 小さい方の取り分)÷ n | ${fe(s4.commonRotOverN)} |`,
    `| 共通の座標変換の相対の運動への効き | ${fe(s4.commonDetect)} |`,
    `| 取り分の差の分(観測できる応答の候補)÷ n | ${fe(s4.diffRotOverN)} |`].join('\n');

  T.cand = ['| 候補の型の量(冥王星–カロン)| 大きさ ÷ n | 定義の差 ÷ P より | σ ÷ P より |', '|---|---|---|---|']
    .concat(J.t3.cand.map((c) => `| ${c.ja} | ${fe(c.v)} | ${yn(c.overDef)} | ${yn(c.overSigma)} |`)).join('\n')
    + `\n\n(定義の差より大きい量 ${J.t3.nOverDef}・σ より大きい量 ${J.t3.nOverSigma} —— 大きさの指数と入力の相対の差の桁の比べ。周期の予言ではない)`;

  T.coef = ['| 系 | 置き方 | 係数 | 相互の部位差分 ÷ n(系の e)|', '|---|---|---|---|']
    .concat(J.t4.pts.map((p) => `| ${p.key === 'plutoCharon' ? '冥王星–カロン' : '地球–月'} | ${p.put === 'a' ? '(a) 回転率' : '(b) ずれの率'} | ${p.coef} | ${fe(p.omOverN)} |`)).join('\n');

  const g = J.gates;
  T.gates = ['| 門 | 値 |', '|---|---|'].concat(Object.entries(g).map(([k, v]) => `| ${k} | ${tf(v)} |`)).join('\n');
  return T;
}
