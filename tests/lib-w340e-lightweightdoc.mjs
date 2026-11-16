// 第340便e(原仮定者の指示(2026-11-17 —— 第140報)・統括の検証項目 R360): **正本 tests/out/lightweight-340e.json から PHYSICS〔第340便e〕の表を作る文書の lib**
// (QA docs.lightweight340e が節の表と逐語で照合する —— 表の数は有効数字 3 桁の指数・丸めで 0 と書いた値は「0」・恒等式の残差は「< 1e-x」の形で、数そのものは載せない)。
export const DOC_VERSION = 'w340e-lightweightdoc-1';
const fe = (x) => (x === null || x === undefined || !Number.isFinite(x) ? '—' : x === 0 ? '0' : Number(x).toExponential(2));
const f2 = (x) => (x === null || x === undefined || !Number.isFinite(x) ? '—' : x.toFixed(2));
const lt = (x, t) => (Number.isFinite(x) && Math.abs(x) <= t ? '< ' + t.toExponential(0) : '**' + fe(x) + '**');
const tf = (x) => (x === true ? '真' : x === false ? '偽' : 'null');
const yn = (x) => (x ? '**超える**' : '超えない');
const KIND = Object.freeze({ planet: '惑星', moon: '衛星', starBinary: '恒星の連星', wdBinary: '白色矮星を含む連星', nsWd: '中性子星と白色矮星', nsNs: '二重中性子星' });
export const TYPE = Object.freeze({ rigid: '(i) 剛体', pow1: '(ii) R_d の外 (R_d/r)¹', pow2: '(ii) R_d の外 (R_d/r)²', selfRd: '(iii) 自己の重み R_self = R_d', selfRobs: '(iii) 自己の重み R_self = R_obs',
  pow1selfRd: '(iv) (R_d/r)¹ と自己の重み R_d', pow1selfRobs: '(iv) (R_d/r)¹ と自己の重み R_obs', none: '⑩ なし' });
const BN = Object.freeze({ mercury: '水星', earth: '地球', moon: '月', b1913: 'PSR B1913+16', j0737: 'PSR J0737−3039' });
const SCN = Object.freeze({ static: '静止', uniform: '等速(同じ速度)', circular: '円', eccentric: '離心(離心近点角 90°)' });
const PAIR = Object.freeze({ sunMercury: '太陽と水星', earthMoon: '地球と月', j0737: 'PSR J0737−3039' });

export function tablesOf(J) {
  const T = {}, S = J.pure.scenes, G = J.pure.gates;
  T.pure = ['| 場面 | 値 | 門 |', '|---|---|---|',
    `| ① 重みつきの平均は入力の最大を超えない —— 入力 10c・重み 100 と 1 の平均 ÷ c | ${S.mean10c.toFixed(4)} | ${tf(G.mean10c)} |`,
    `| ② 速さの最大(剛体・(R_d/r)¹)が第338便e の secularF の場の速さと同じ(水星・256 点) | ${lt(S.speedSame, 1e-12)} | ${tf(G.speedSame)} |`,
    `| ③ 一般の場の ȧ が第338便e の secularF の ȧ と同じ(J0737・両方・剛体と (R_d/r)¹・L1 と S0) | ${lt(S.adotSame, 1e-12)} | ${tf(G.adotSame)} |`,
    `| ④ 自己の重みの型の時間の変化 dU と中心差分(差の桁の上限) | ≤ 1e${S.dUfd} | ${tf(G.dUfd)} |`,
    `| ⑤ 取り分: 自己の重み 0 で f = 1・自己の重み = 源の重みで f = ½ | ${tf(S.shareOne)}・${tf(S.shareHalf)} | ${tf(G.share)} |`,
    `| ⑥ 零試験 (a)(剛体の場の歪み 0・試験点の相対 0・熱 0・対照の熱が系に依らない) | ${tf(S.single)} | ${tf(G.single)} |`,
    `| ⑦ 零試験 (b)(静止で時間差分 0・引きずり 0・重力 1/円で動径の引きずり 0) | ${tf(S.staticPair)} | ${tf(G.staticPair)} |`,
    `| ⑧ 入力の拒否 | ${S.reject.n}/${S.reject.of} | ${tf(G.reject)} |`].join('\n');

  const R1 = J.t1.rows;
  T.speed = ['| 系 | 種類 | Ω a ÷ c | 取り分 f(R_d)| 取り分 f(R_obs)| (i) 剛体 | (ii) (R_d/r)¹ | (iii) R_d | (iii) R_obs | (iv) R_d | (iv) R_obs | (i) → (iii) R_obs で下がる桁 |', '|---|---|---|---|---|---|---|---|---|---|---|---|']
    .concat(R1.map((r) => { const m = r.maxOverC;
      return `| ${r.name}${r.dir === 'back' ? '(逆の向き)' : ''} | ${KIND[r.kind]} | ${fe(r.omegaAOverC)} | ${fe(r.fRd)} | ${fe(r.fRobs)} | ${fe(m.rigid)} | ${fe(m.pow1)} | ${fe(m.selfRd)} | ${fe(m.selfRobs)} | ${fe(m.pow1selfRd)} | ${fe(m.pow1selfRobs)} | ${f2(r.dropFromRigid.selfRobs)} |`; })).join('\n')
    + '\n\n(速さは受け手の位置で源の自転が座標を運ぶ速さの軌道の上の最大 ÷ c —— 物体の速さでも赤道の速さでもない。**光速との比は表に残すだけ —— 判定には使わない**)';

  const sm = J.t1.summary, dr = J.t1.drops;
  T.over = ['| 速さの型 | 25 系の最小 ÷ c | 最大 ÷ c | 光速を超える系の数 | 超える系 | (i) から下がる桁(最小〜最大) |', '|---|---|---|---|---|---|']
    .concat(J.decl.speedTypes.map((t) => `| ${TYPE[t]} | ${fe(sm[t].min)} | ${fe(sm[t].max)} | ${sm[t].nOver} | ${sm[t].over.map((k) => R1.find((r) => r.key === k).name).join('・') || 'なし'} | ${t === 'rigid' ? '—' : f2(dr[t].min) + '〜' + f2(dr[t].max)} |`)).join('\n');

  const pl = J.t1.plane;
  T.plane = ['| 平面(log10 f と log10(Ω a/c))| 値 |', '|---|---|',
    `| 境目 | log10 f + log10(Ω a/c) = 0(f Ω a = c) |`,
    `| Ω a > c の系(剛体の入力が光速を超える) | ${pl.rigidAbove.map((k) => R1.find((r) => r.key === k).name).join('・')} |`,
    `| 境目より上(R_self = R_d) | ${pl.aboveRd.length ? pl.aboveRd.map((k) => R1.find((r) => r.key === k).name).join('・') : 'なし'}(log10 f Ω a/c の最大 ${f2(pl.maxMarginRd)}) |`,
    `| 境目より上(R_self = R_obs) | ${pl.aboveRobs.length ? pl.aboveRobs.map((k) => R1.find((r) => r.key === k).name).join('・') : 'なし'}(最大 ${f2(pl.maxMarginRobs)}) |`].join('\n');

  T.eff = ['| 系 | 列 | ȧ(⑩ なし・ノブ 1)| 比 ÷ ⑩ なし: (i) 剛体 | (ii) (R_d/r)¹ | (ii) (R_d/r)² | (iii) R_d | (iii) R_obs | (iv) R_obs |', '|---|---|---|---|---|---|---|---|---|']
    .concat(J.eff.rows.flatMap((r) => J.decl.effCols.map((c) => { const q = r.cols[c], x = q.ratio;
      return `| ${BN[r.key]} | ${c} | ${fe(q.none)} | ${fe(x.rigid)} | ${fe(x.pow1)} | ${fe(x.pow2)} | ${fe(x.selfRd)} | ${fe(x.selfRobs)} | ${fe(x.pow1selfRobs)} |`; }))).join('\n');
  const ef = J.eff.eff;
  T.effSum = ['| 列 | 場の型 | 効き \\|比 − 1\\| の最小 | 最大 |', '|---|---|---|---|']
    .concat(J.decl.effCols.flatMap((c) => J.decl.effFields.filter((t) => t !== 'none').map((t) => `| ${c} | ${TYPE[t]} | ${fe(ef[c + '|' + t].min)} | ${fe(ef[c + '|' + t].max)} |`))).join('\n');

  T.scan = ['| 列 | 場の型 | j = 0 の最良の k | そのときの広がり | k と j の最良(k・j) | そのときの広がり | 決める系(緩い・きつい) | 物差し ≤ 10 の内か | 第338便e の k* −1.185(j = 0)の広がり |', '|---|---|---|---|---|---|---|---|---|']
    .concat(J.scan.map((s) => `| ${s.col} | ${TYPE[s.field]} | ${s.bestJ0.k} | ${fe(s.bestJ0.spread)} | ${s.best.k}・${s.best.j} | ${fe(s.best.spread)} | ${BN[s.best.loosest]}・${BN[s.best.tightest]} | ${s.reach ? '**内**' : '外'} | ${fe(Math.pow(10, s.atKstar338e))} |`)).join('\n');

  const z = J.t2.single;
  T.single = ['| 場の型(源 1 つ・試験点の重み 0・背景なし)| 場の歪み ÷ 回り(5 点の最大)| 天体が 1 つのとき剛体の座標変換か |', '|---|---|---|']
    .concat(['rigid', 'selfZero', 'pow1', 'pow2'].map((t) => `| ${t === 'selfZero' ? '(iii) 自己の重みの型(試験点の重み 0 なので f = 1)' : TYPE[t]} | ${fe(z.strainMax[t])} | ${z.strainMax[t] === 0 ? 'なる' : '**ならない**'} |`))
    .concat([`| 試験点の相対の速さ(場と一緒に動く) | ${fe(z.relSpeed)} | — |`, `| 熱の口(静止系・源と一緒に回る系) | ${fe(z.heatRest)}・${fe(z.heatRot)} | — |`,
      `| 対照: 回らない試験点の熱(静止系・一緒に回る系 —— 差の比) | ${fe(z.ctlHeatRest)}・${fe(z.ctlHeatRot)}(${fe(z.ctlHeatRel)}) | — |`, `| 並進だけの場の一様さ | ${fe(z.transOnly)} | — |`]).join('\n');

  T.pair = ['| 系 | 場面 | d/dt(m/r) ÷ (D n) | 引きずり \\|d\\| ÷ v(R_d)| 引きずり ÷ v(R_obs)| 引きずりの動径の割合 | 重力 G₀ m/r² [m/s²] |', '|---|---|---|---|---|---|---|']
    .concat(J.t2.pairs.flatMap((p) => p.rows.map((r) => `| ${PAIR[p.key]} | ${SCN[r.scene]} | ${fe(r.dDdtOverDn)} | ${fe(r.dragRd)} | ${fe(r.dragRobs)} | ${fe(r.dragRadialShare)} | ${fe(r.gAcc)} |`))).join('\n');

  const cv = (x) => (x === null ? '式が立たない' : String(x));
  T.read = ['| 読みの候補 | 静止 | 等速 | 円 | 離心 | 注 |', '|---|---|---|---|---|---|']
    .concat(J.t2.readings.map((q) => `| ${q.name} | ${cv(q.central.static)} | ${cv(q.central.uniform)} | ${cv(q.central.circular)} | ${cv(q.central.eccentric)} | ${q.note} |`)).join('\n')
    + '\n\n(数は受け手に働く中心向きの加速度 ÷ G₀ m/r²。**どれが正しいとは書かない** —— 決断事項の候補)';

  const d = J.t2.double;
  T.double = ['| 系 | 二重に足した場合 | 足す前 | 足した後 | 比 |', '|---|---|---|---|---|']
    .concat(['mercury', 'moon'].flatMap((k) => { const q = d[k], nm = k === 'mercury' ? '水星' : '月';
      return [`| ${nm} | 重力をもう 1 度(GM → 2GM)—— 公転の周期 [s](同じ a) | ${fe(q.periodS)} | ${fe(q.periodS2)} | ${q.periodRatio.toFixed(4)} |`,
        `| ${nm} | 同上 —— 1PN の近点の回り [″/世紀] | ${fe(q.pn1Cy)} | ${fe(q.pn1Cy2)} | ${q.pnRatio.toFixed(4)} |`,
        `| ${nm} | 並進引きずりをもう 1 度(近点の回り π b/p × 2)[″/世紀] | ${fe(q.dragCy)} | ${fe(q.dragCy2)} | 2(足した分 ÷ 1PN ${q.dragExtraOverPN.toFixed(4)}) |`]; })).join('\n');

  T.dims = ['| 量 | 単位 | 今のコードでの役 | 速度・角速度・加速度へ写す係数 |', '|---|---|---|---|']
    .concat(J.t2.dims.map((q) => `| ${q.q} | ${q.unit} | ${q.code} | ${q.map} |`)).join('\n');
  return T;
}
