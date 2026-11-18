// 第341便f(原仮定者の補足(2026-11-18 —— 第141報)・統括の検証項目 R369): **正本 tests/out/gyroheat-341f.json から PHYSICS〔第341便f〕の表を作る文書の lib**
// (QA docs.gyroheat341f が節の表と逐語で照合する —— 表の数は有効数字 3 桁の指数・比は小数 2〜3 桁・丸めの残りは書かない)。
export const DOC_VERSION = 'w341f-gyroheatdoc-1';
const fe = (x) => (x === null || x === undefined || !Number.isFinite(x) ? '—' : x === 0 ? '0' : Number(x).toExponential(2));
const f3 = (x) => (x === null || x === undefined || !Number.isFinite(x) ? '—' : Number(x).toFixed(3));
const tf = (x) => (x === true ? '真' : x === false ? '偽' : '—');
const lt = (x, fl) => (x === 0 ? '0' : x < fl ? '< ' + fl.toExponential(0) : fe(x));
const NM = Object.freeze({ Io: 'イオ', Europa: 'エウロパ', Moon: '月', Enceladus: 'エンケラドゥス', Charon: 'カロン', Pluto: '冥王星', Venus: '金星', Earth: '地球', Jupiter: '木星', Saturn: '土星',
  Sun: '太陽', galaxy: '銀河' });
const RUL = Object.freeze({ global: '全球(判定に使う)', total: '総量(判定に使わない)', regional: '南極域(判定に使わない)', scale: '上限の目安(観測ではない)' });

export function tablesOf(J) {
  const T = {}, S = J.pure.scenes, G = J.pure.gates, T3 = J.t3;
  T.pure = ['| 零試験・場面 | 値 | 門 |', '|---|---|---|',
    `| ① 駆動 0・静止から: 熱・仕事・収支の残り | ${S.z1.Q}・${S.z1.W}・${S.z1.resid} | ${tf(G.zeroDrive)} |`,
    `| ② ジャイロだけ(Γ = 0・周期の駆動): 熱・収支の残り ÷ 尺度 | ${S.z2.Q}・${lt(S.z2.residRel, 1e-8)} | ${tf(G.gyroOnly)} |`,
    `| ③ 座標変換(天体が 1 つ・源の座標と一緒に動く受け手): 部位のトルク ÷ 尺度 | ${lt(S.z3.oneRel, 1e-12)}・${lt(S.z3.coRel, 1e-12)} | ${tf(G.coordZero)} |`,
    `| ④ 一定のトルクで静かな変形: 熱の総量(解析 N²/(2K) = 0.5)・最後の熱の率 ÷ 最大 | ${f3(S.z4.Q)}・${lt(S.z4.rateEndOverPeak, 1e-6)} | ${tf(G.constRelax)} |`,
    `| ⑤ 周期の駆動 + 散逸: 熱の率(刻み h・h/2)・刻みの差・定常の式との差・収支の残り ÷ 尺度 | ${fe(S.z5.rateA)}・${fe(S.z5.rateB)}・${lt(S.z5.halfRel, 1e-6)}・${lt(S.z5.steadyRel, 1e-3)}・${lt(Math.max(S.z5.residA, S.z5.residB), 1e-8)} | ${tf(G.periodic)} |`,
    `| ⑥ 型 (α) の端: μ = 1 で熱・μ = 0 で保つ仕事率・回っていない天体 | ${S.alpha.mu1}・${f3(S.alpha.mu0)}・${S.alpha.noSpin === null ? '型の外' : S.alpha.noSpin} | ${tf(G.alphaEnds)} |`,
    `| ⑦ 型 (β) を (α) と同じ形に(x = 1・r = 0・χ = 1)の係数・x を振った最大 | ${f3(S.betaAsAlpha.F)}・${f3(S.betaAsAlpha.peak)} | ${tf(G.betaAsAlpha)} |`,
    `| ⑧ 入力の拒否 | ${S.rejects.filter(Boolean).length}/${S.rejects.length} | ${tf(G.rejects)} |`].join('\n');
  T.t2 = ['| c_g | τ | ω | トルクの向き | 駆動の周期 | ジャイロの周期 | 緩和の時間 | 始め | 熱の率(最後の窓) | 定常の式 | 熱は続くか |', '|---|---|---|---|---|---|---|---|---|---|---|',
    ...J.t2.map((r) => `| ${r.cg} | ${r.tau} | ${r.omega} | ${r.coRot ? '天体と一緒に回る' : '遠方に固定'} | ${fe(r.drivePeriod)} | ${fe(r.gyroPeriod)} | ${fe(r.relaxTime)} | ${r.start === 'rest' ? '静止' : '定常'} | `
      + `${r.start === 'rest' ? '最大の ' + lt(r.endOverPeak, 1e-6) + ' 倍' : fe(r.rateEnd)} | ${fe(r.steady)} | ${r.persists ? '続く' : '止まる'} |`)].join('\n');
  T.ledger = ['| 天体 | 主星 | 潮汐の熱 [W](k₂/Q) | 傾ける力の源ごと N/Γ₀ [N·m·s](主星・太陽・銀河) | 保つ仕事率 ÷ Γ₀² [W·s²] | 従来の型 ÷ Γ₀(差分の読み)[W·s] | 銀河の取り分(従来) | 銀河の取り分(新しい帳簿) | 銀河のトルクの比(新 ÷ 従来) |',
    '|---|---|---|---|---|---|---|---|---|',
    ...T3.ledger.map((r) => `| ${NM[r.id]} | ${NM[r.host] || r.host} | ${fe(r.tide.heat)}(${fe(r.tide.k2q)}) | ${r.tilt.map((q) => fe(q.N)).join('・')} | ${fe(r.uHold)} | ${fe(r.uGammaDiff)} | ${f3(r.galShareOld)} | ${fe(r.galShareNew)} | ${fe(r.galNewOverOldTorque)} |`)].join('\n');
  const A = T3.alpha;
  T.windows = ['| 列・型 | 熱の係数 | イオの熱の残りの上限 | 金星と木星に要る下限 | 決める天体 | 分類の帯(係数の側) | 3 つが重なるか |', '|---|---|---|---|---|---|---|',
    `| 列 A・(α) 可動度 μ | (1 − μ) Γ₀² | ${fe(A.cap)} | ${fe(A.needMax)} | ${NM[A.need.reduce((a, q) => (q.need > a.need ? q : a), A.need[0]).id]} | 0〜${fe(A.bandP[1])} | ${tf(A.overlapMu)} |`,
    ...T3.betaAbs.map((b) => `| 列 A・(β) 絶対の緩和 τ ${fe(b.tau)} s | F Γ₀²(天体ごと) | ${fe(b.cap)} | ${fe(b.needMax)} | — | ${fe(A.bandP[0])}〜${fe(A.bandP[1])} | ${tf(b.overlapFixed)} |`),
    ...T3.gamma.map((g) => `| 従来の型 (γ)・${g.reading === 'diff' ? '差分の読み' : '揃える読み'} | Γ₀ | ${fe(g.cap)} | ${fe(g.needMax)} | — | ${fe(T3.band.lo)}〜${fe(T3.band.hi)} | ${tf(g.overlapFixed)} |`),
    `| 列 B(軸引きずりも熱 0) | — | — | 金星 ${f3(T3.hotB[0].ratio * 1000)}‰・木星 ${f3(T3.hotB[1].ratio * 1000)}‰(潮汐 ÷ 物差し) | — | — | ${tf(T3.hotB.every((h) => h.high))} |`].join('\n');
  T.betaRel = ['| χ | r = ω_K/ω | x = ω τ | F(熱 = F × 保つ仕事率)| μ = 0 の極限を超える | 帯の上端でのイオの熱 [W] | 3 つが重なるか |', '|---|---|---|---|---|---|---|',
    ...T3.betaRel.map((b) => `| ${b.chi} | ${b.r} | ${b.x} | ${fe(b.F)} | ${tf(b.beyondMu0)} | ${fe(b.hiHeatIo)} | ${tf(b.overlapFixed)} |`)].join('\n');
  const K = T3.kTilt;
  T.kTilt = ['| 天体 | 物差しの領域 | 熱 [W](Γ₀ = 帯の上端・μ = 0・k_tilt = 下限) | ÷ 物差し |', '|---|---|---|---|',
    ...K.atLo.map((q) => `| ${NM[q.id]} | ${q.ruler ? RUL[q.ruler] : '—'} | ${fe(q.heat)} | ${q.overObs === null ? '—' : f3(q.overObs)} |`),
    `| k_tilt の範囲 | — | ${fe(K.kLo)}〜${fe(K.kHi)} | 開く ${tf(K.open)} |`].join('\n');
  T.t4 = ['| 天体 | 源ごとに足す(主 —— 打ち消さない)÷ Γ₀² | 正味(揃う上限)÷ 源ごと | 正味(打ち消す下限)÷ 源ごと | 一番大きい源 |', '|---|---|---|---|---|',
    ...T3.t4.map((t) => `| ${NM[t.id]} | ${fe(t.sep)} | ${f3(t.netMaxOverSep)} | ${f3(t.netMinOverSep)} | ${NM[t.dominant]} |`)].join('\n');
  T.t5 = ['| 天体 | 同期 | 潮汐のトルク ÷ 傾ける力(Γ₀ = 1) |', '|---|---|---|',
    ...T3.t5.map((q) => `| ${NM[q.id]} | ${q.sync ? '同期' : '同期でない'} | ${fe(q.Xtilt)} |`),
    `| 1 本で分けられるか | — | ${tf(T3.t5sep.separable)}(${fe(T3.t5sep.lo)}〔${NM[T3.t5sep.loBy]}〕〜${fe(T3.t5sep.hi)}〔${NM[T3.t5sep.hiBy]}〕) |`].join('\n');
  return T;
}
