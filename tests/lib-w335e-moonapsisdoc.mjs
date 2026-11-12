// 第335便e(原仮定者の補足(2026-11-12)・統括の検証項目 R332): **正本 tests/out/moonapsis-w335e.json から PHYSICS〔第335便e〕の表を作る文書の lib**
// (QA docs.moonApsis335e が節の表と逐語で照合する —— 表の数は有効数字 4 桁か指数 3 桁)。
export const DOC_VERSION = 'w335e-moonapsisdoc-1';
const fe = (x) => (x === null || x === undefined || !Number.isFinite(x) ? '—' : Number(x).toExponential(3));
const f4 = (x) => (x === null || x === undefined || !Number.isFinite(x) ? '—' : Number(x).toPrecision(4));
const f6 = (x) => (x === null || x === undefined || !Number.isFinite(x) ? '—' : Number(x).toPrecision(6));
const tf = (x) => (x === true ? '真' : x === false ? '偽' : '—');
const LAM = (l) => (l === 1 ? '1(宣言どおり)' : l === 1e3 ? '10³(拡大した対照)' : l === 1e6 ? '10⁶(拡大した対照)' : String(l));
const PART = Object.freeze({ both: '両方', rad: '動径だけ', tan: '接線だけ' });
const SUN = (S) => (S ? '太陽あり' : '太陽なし');
export function tablesOf(J) {
  const T = {}, B = J.base, D = J.diffs, row = (S, lam, part = 'both', axis = 'j2') => D.find((r) => r.S === S && r.lam === lam && r.part === part && r.axis === axis);
  // 表 1 本の値(読んだ宣言)と写しの規則の照合
  const bk = J.books;
  T.books = ['| 量 | 値 | 読み |', '|---|---|---|',
    `| G・c₀(本の単位 10⁸ m・10⁴ s・10²⁷ kg) | ${bk.G}・${bk.c} | 🌦️ の physics |`,
    `| 質量(太陽・地球・月) | ${bk.masses.join('・')} | 🌦️ の bodies |`,
    `| 自転(太陽・地球・月 —— rad/10⁴ s) | ${bk.spins.join('・')} | 観測自転 s(座標変換の角速度に使う) |`,
    `| 地球の J₂・赤道半径・軸 | ${bk.j2.J2}・${bk.j2.req}・傾き ${bk.j2.axis.tiltDeg}°/方位 ${bk.j2.axis.azimuthDeg}° | 引きずりの地球の自転軸もこの軸(宣言) |`,
    `| 刻み(timeRef の pRef ÷ stepsPerOrbit) | ${bk.pRef} ÷ ${bk.spo} | h = ${f6(J.consts.h)}(100 年で ${J.consts.steps100} 刻み) |`,
    `| 在位の本の引きずり | 🌦️ OFF ${tf(bk.dragOff.withSun)}・🌔 OFF ${tf(bk.dragOff.noSun)}・太陽は固定 ${tf(bk.pinnedSun)} | 4 列の D0 は在位の宣言と同じ(引きずりなし) |`,
    `| 写しの規則(🌔 = 🌦️ の emOnly) | 位置 ${tf(bk.copy.pos)}・速度 ${tf(bk.copy.vel)}・質量 ${tf(bk.copy.mass)}・自転 ${tf(bk.copy.spin)}・J₂ ${tf(bk.copy.j2)}・G と c₀ ${tf(bk.copy.physics)} | 太陽なしの列は 🌔 の宣言の値(地球–月の重心を原点・重心の速度 0) |`,
    `| Y_k・自己の重み W_ii(本の単位) | ${fe(J.consts.Yk)}・${fe(J.consts.W)} | W_ii = 1/(C₁Y_k)(質量に依らない) |`,
    `| β の初期の値(地球→月・月→地球・太陽→地球) | ${fe(J.consts.beta.earthOnMoon)}・${fe(J.consts.beta.moonOnEarth)}・${fe(J.consts.beta.sunOnEarth)} | ≈ 10 G m_j/(c₀² r) |`,
    `| 源の座標の回転の速さ(地球の自転 × 地球–月の距離・太陽の自転 × 太陽–地球の距離 —— 10⁴ m/s) | ${f4(J.consts.rotSpeed.earthAtMoon)}・${f4(J.consts.rotSpeed.sunAtEarth)} | 拡大した対照で摂動の範囲を外れる目安 |`].join('\n');
  // 表 2 4 列(100 年窓・宣言の強さ)
  const b0 = B.S0.w100, b1 = B.S1.w100, d0 = row(0, 1).w100, d1 = row(1, 1).w100;
  T.four = ['| 列 | 近点の周期〔年〕 | 近点の率の差〔rad/年〕 | 交点の周期〔年〕 | e の自由の成分の平均 | e の強制の成分(φ の 1 倍) | e の差の傾き〔/年〕 | 自由の成分の傾きの差〔/年〕 | 相対の \\|h\\| の差の傾き〔相対/年〕 | E の差の傾き〔相対/年〕 |', '|---|---|---|---|---|---|---|---|---|---|',
    `| S0D0 太陽なし・引きずりなし | ${f6(b0.apsPeriodYr)} | — | ${f6(-b0.nodePeriodYr)} | ${f6(b0.eFreeMean)} | — | — | — | — | — |`,
    `| S1D0 太陽あり・引きずりなし | ${f6(b1.apsPeriodYr)} | — | ${f6(-b1.nodePeriodYr)} | ${f6(b1.eFreeMean)} | ${f4(b1.eForced[0])} | — | — | — | — |`,
    `| S0D1 太陽なし・引きずりあり | ${f6(b0.apsPeriodYr + d0.apsPeriodShiftYr)} | ${fe(d0.dvarpi)} | ${f6(-(b0.nodePeriodYr + d0.nodePeriodShiftYr))} | ${f6(b0.eFreeMean + d0.eFreeMeanDiff)} | — | ${fe(d0.de)} | ${fe(d0.eFreeSlopeDiff)} | ${fe(d0.dh)} | ${fe(d0.dE)} |`,
    `| S1D1 太陽あり・引きずりあり | ${f6(b1.apsPeriodYr + d1.apsPeriodShiftYr)} | ${fe(d1.dvarpi)} | ${f6(-(b1.nodePeriodYr + d1.nodePeriodShiftYr))} | ${f6(b1.eFreeMean + d1.eFreeMeanDiff)} | ${f4(b1.eForced[0] + d1.eForcedDiff[0])} | ${fe(d1.de)} | ${fe(d1.eFreeSlopeDiff)} | ${fe(d1.dh)} | ${fe(d1.dE)} |`].join('\n');
  // 表 3 引きずりなしの列の窓ごとの値
  T.base = ['| 列 | 窓〔年〕 | 近点の通過の数 | 近点の周期(通過の角の調和の回帰)〔年〕 | 近点の周期(接触の要素の一次)〔年〕 | 調和の振幅(φ の 1〜3 倍)〔rad〕 | 交点の周期〔年〕 | 恒星月〔日〕 | e の平均・最小・最大 |', '|---|---|---|---|---|---|---|---|---|']
    .concat([0, 1].flatMap((S) => J.decl.windowsYr.map((w) => { const q = B['S' + S]['w' + w];
      return `| ${S ? 'S1D0' : 'S0D0'} | ${w} | ${q.nPass} | ${f6(q.apsPeriodYr)} | ${f6(q.apsPeriodOscYr)} | ${q.apsAmp.length ? q.apsAmp.map(f4).join('・') : '—(太陽が無い —— 一次だけ)'} | ${f6(-q.nodePeriodYr)} | ${f6(q.sidDay)} | ${f6(q.eMean)}・${f4(q.eMin)}・${f4(q.eMax)} |`; }))).join('\n');
  // 表 4 引きずりありの全部の列(100 年窓 —— 同じ刻みの D0 との差)
  T.diffs = ['| 太陽 | 成分 | 強さ λ | 地球の軸 | 束縛 | e の差の傾き〔/年〕 | 自由の成分の傾きの差〔/年〕 | 自由の成分の平均の差 | 近点の率の差〔rad/年〕 | 近点の周期のずれ〔年〕 | 交点の率の差〔rad/年〕 | 傾きの差の傾き〔rad/年〕 | E の差の傾き〔相対/年〕 |', '|---|---|---|---|---|---|---|---|---|---|---|---|---|']
    .concat(D.map((r) => { const q = r.w100;
      return `| ${SUN(r.S)} | ${PART[r.part]} | ${LAM(r.lam)} | ${r.axis === 'z' ? '+z(比べる列)' : 'J₂ の軸'} | ${q.bound ? '真' : '偽(' + f4(q.unboundYr) + ' 年で外れる)'} | ${fe(q.de)} | ${fe(q.eFreeSlopeDiff)} | ${fe(q.eFreeMeanDiff)} | ${fe(q.dvarpi)} | ${fe(q.apsPeriodShiftYr)} | ${fe(q.dnode)} | ${fe(q.dinc)} | ${fe(q.dE)} |`; })).join('\n');
  // 表 5 判定(宣言の物差し —— 版 2)
  T.judge = ['| 太陽 | 強さ λ | 窓〔年〕 | 量 | 傾き〔/年〕 | 帯(h と h/2) | 閾 | 帯で読める | 20 年 ÷ 100 年の傾き | 窓で安定 | 束縛 | 永年の減衰 | 時間の尺度〔年〕 | 下限の時間〔年〕 |', '|---|---|---|---|---|---|---|---|---|---|---|---|---|---|']
    .concat(J.judge.rows.map((q) => `| ${SUN(q.S)} | ${LAM(q.lam)} | ${q.w.slice(1)} | ${q.quantity === 'de' ? 'e の差' : '自由の成分の差'} | ${fe(q.slope)} | ${fe(q.band)} | ${fe(q.thr)} | ${tf(q.readable)} | ${f4(q.windowRatio)} | ${tf(q.stable)} | ${tf(q.bound)} | ${tf(q.decay)} | ${fe(q.tauYr)} | ${fe(q.tauBoundYr)} |`))
    .concat([`| 太陽が保つか(宣言の強さ) | — | — | — | — | — | — | — | — | — | — | — | — | ${J.judge.keep} |`, `| 太陽が保つか(拡大した対照) | — | — | — | — | — | — | — | — | — | — | — | — | ${J.judge.keepAmp.join('/')} |`]).join('\n');
  // 表 6 線形性(2 点 —— 100 年窓)
  const KN = { de: 'e の差の傾き', eFreeSlopeDiff: '自由の成分の傾きの差', dvarpi: '近点の率の差', dnode: '交点の率の差' };
  T.lin = ['| 太陽 | λ の組 | 量 | 比 ÷ λ の比 | 線形(±10%) |', '|---|---|---|---|---|']
    .concat(J.judge.lin.map((q) => `| ${SUN(q.S)} | ${q.from} → ${q.to} | ${KN[q.k]} | ${f4(q.ratio)} | ${tf(q.linear)} |`)).join('\n');
  // 表 7 動径と接線の分解(二体の閉じた式と照らす)
  const SP = J.split;
  T.split = ['| 太陽 | 強さ λ | 近点の率の差: 両方 | 動径だけ | 接線だけ | 閉じた式(並進の分 —— 両方 πb/p・動径 −πb/p・接線 +2πb/p を 1 年に) | 動径 + 接線 − 両方 ÷ 両方 | e の差の傾き: 動径だけ | 接線だけ |', '|---|---|---|---|---|---|---|---|---|']
    .concat(SP.rows.map((q) => `| ${SUN(q.S)} | ${LAM(q.lam)} | ${fe(q.both.dvarpi)} | ${fe(q.rad.dvarpi)} | ${fe(q.tan.dvarpi)} | ${fe(q.closed.both)}・${fe(q.closed.rad)}・${fe(q.closed.tan)} | ${fe(q.sumRes)} | ${fe(q.rad.de)} | ${fe(q.tan.de)} |`))
    .concat([`| 二体の係数 | — | b = 10 G(m_地 + m_月)/c₀² = ${fe(SP.b)} | p = ${f6(SP.p)} | 公転 ${f6(SP.nOrbYr)} 回/年 | 初期の接触の e ${f6(SP.eInit)} | — | — | — |`]).join('\n');
  // 表 8 刻みの帯(h/2)
  T.band = ['| 太陽 | 強さ λ | 量の帯(100 年窓) |', '|---|---|---|']
    .concat(J.band.map((q) => q.lam === 0
      ? `| ${SUN(q.S)} | 0(引きずりなし) | 近点の周期 ${fe(q.apsPeriodYr)} 年・交点の周期 ${fe(q.nodePeriodYr)} 年・恒星月 ${fe(q.sidDay)} 日・e の平均 ${fe(q.eMean)} |`
      : `| ${SUN(q.S)} | ${LAM(q.lam)} | e の差の傾き ${fe(q.w100.de)}・自由の成分 ${fe(q.w100.eFreeSlopeDiff)}・近点の率の差 ${fe(q.w100.dvarpi)}・交点の率の差 ${fe(q.w100.dnode)}・E ${fe(q.w100.dE)} |`)).join('\n');
  // 表 9 年ごとの標本(10 年ごと —— 宣言の強さ)
  const Y0 = J.yearly['S0|both|1|j2'], Y1 = J.yearly['S1|both|1|j2'];
  T.yearly = ['| 年 | 太陽なし: e の年の平均 | Δe(年末) | Δϖ(年末)〔rad〕 | 太陽あり: e の年の平均 | Δe(年末) | Δϖ(年末)〔rad〕 |', '|---|---|---|---|---|---|---|']
    .concat([1, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100].map((y) => { const a = Y0[y - 1], b = Y1[y - 1]; return `| ${y} | ${f6(a.eMeanOff)} | ${fe(a.de)} | ${fe(a.dvarpi)} | ${f6(b.eMeanOff)} | ${fe(b.de)} | ${fe(b.dvarpi)} |`; })).join('\n');
  // 表 10 在位の 2 本との照らし
  const C = J.compare;
  T.compare = ['| 量 | この器(S1D0・100 年窓) | 🌦️ の fitRecord の模型の値 | 差 |', '|---|---|---|---|',
    `| 近点の周期〔年〕 | ${f6(C.S1.apsPeriodYr)} | ${f6(C.S1.bookAps)} | ${fe(C.S1.apsPeriodYr - C.S1.bookAps)} |`,
    `| 交点の周期〔年〕 | ${f6(C.S1.nodePeriodYr)} | ${f6(C.S1.bookNode)} | ${fe(C.S1.nodePeriodYr - C.S1.bookNode)} |`,
    `| 恒星月〔日〕 | ${f6(C.S1.sidDay)} | ${f6(C.S1.bookSid)} | ${fe(C.S1.sidDay - C.S1.bookSid)} |`,
    `| 平均離心率 | ${f6(C.S1.eMean)} | ${f6(C.S1.bookE)} | ${fe(C.S1.eMean - C.S1.bookE)} |`,
    `| 太陽なし(S0D0): 近点の周期・恒星月・e | ${f6(C.S0.apsPeriodYr)} 年・${f6(C.S0.sidDay)} 日・${f6(C.S0.eMean)} | 🌔 の記録の引用(説明文の欄 —— 値として読まない): ${J.plan.quote.noSun} | — |`].join('\n');
  // 表 11 供給の読みとの対応(月の側の数だけ)
  const U = J.supply.moon;
  T.supply = ['| 型 | 駆動(供給)の源 | 駆動の周期・振幅 | 供給なしの減衰(宣言の強さ) | 拡大した対照 | 釣り合い |', '|---|---|---|---|---|---|',
    `| 月の近点 | ${U.driver} | 近点 ${f6(U.drivePeriodYr)} 年・e の強制の成分 ${f4(U.forcedAmp)} | 永年の減衰 ${tf(U.decayRead1)}・下限 ${fe(U.tauBoundYr1)} 年 | 10³ 倍の下限 ${fe(U.tauBoundYr1e3)} 年(1 → 10³ の e の傾きの線形 ${tf(U.linear1to1e3)})・10⁶ 倍の永年の減衰 ${tf(U.decayReadAmp)} | ${U.balance} |`,
    `| 自転 | ${J.supply.spin.driver} | — | — | — | — |`].join('\n');
  // 表 12 純関数の場面
  T.pure = ['| 場面 | 門 |', '|---|---|'].concat(Object.entries(J.pure.gates).map(([k, v]) => `| ${k} | ${tf(v)} |`))
    .concat(J.pure.closed.map((q) => `| 二体の閉じた式(${PART[q.part]}) 積分 ${fe(q.got)}・式 ${fe(q.want)} | 相対 ${fe(q.rel)} |`)).join('\n');
  return T;
}
