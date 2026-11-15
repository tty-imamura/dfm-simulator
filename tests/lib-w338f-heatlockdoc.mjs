// 第338便f(原仮定者の回答(2026-11-15 —— 第138報の回答 4)・統括の検証項目 R354): **正本 tests/out/heatlock-338f.json から PHYSICS〔第338便f〕の表を作る文書の lib**
// (QA docs.heatlock338f が節の表と逐語で照合する —— 表の数は有効数字 3 桁の指数・比は小数 2〜3 桁・丸めの残りは書かない)。
export const DOC_VERSION = 'w338f-heatlockdoc-1';
const fe = (x) => (x === null || x === undefined || !Number.isFinite(x) ? '—' : x === 0 ? '0' : Number(x).toExponential(2));
const f2 = (x) => (x === null || x === undefined || !Number.isFinite(x) ? '—' : Number(x).toFixed(2));
const f3 = (x) => (x === null || x === undefined || !Number.isFinite(x) ? '—' : Number(x).toFixed(3));
const tf = (x) => (x === true ? '真' : x === false ? '偽' : '—');
const NM = Object.freeze({ Io: 'イオ', Europa: 'エウロパ', Ganymede: 'ガニメデ', Moon: '月', Enceladus: 'エンケラドゥス', Jupiter: '木星', Earth: '地球', Saturn: '土星' });
const RD = Object.freeze({ aligned: '揃える(c = +1)', diff: '差分の読み(c = 1 − α = −1)' });

export function tablesOf(J) {
  const T = {}, S = J.pure.scenes, G = J.pure.gates;
  T.pure = ['| 場面 | 値 | 門 |', '|---|---|---|',
    `| ① 離心軌道の潮汐の発熱: e = 0 で 0・e を 2 倍で 4 倍 | ${S.tide.zero}・${f3(S.tide.quad)} | ${tf(G.tideForm)} |`,
    `| ② 第337便c の型の周期の解(e = 0)の秤動の散逸 | ${S.lib0.perUnit} | ${tf(G.libZeroE)} |`,
    `| ③ 逆向きの 2 つの口(第326便d の port): 正味のトルク・熱の和 | ${S.ports.net}・${S.ports.heat} | ${tf(G.portsNoCancel)} |`,
    `| ④ 金星の共鳴の番号 k = 2(s − n_♀)/n_syn(CSV の自転)と整数 | ${f3(S.kObs)}・${S.k} | ${tf(G.resonanceIndex)} |`,
    `| ⑤ 同期の調和の成分の求積と閉じた形 1/a³ の比(月の距離) | ${f3(S.sync.A / S.sync.closed)} | ${tf(G.syncClosed)} |`,
    `| ⑥ 光行差 0 の尾と金星の軌道の最短の距離 = 1 AU 側の差 a_⊕ − a_♀ [m] | ${fe(S.tail.minDist)}(${fe(S.tail.want)}) | ${tf(G.tailAntiSun)} |`,
    `| ⑦ 入力の拒否 | ${S.rejects.filter(Boolean).length}/${S.rejects.length} | ${tf(G.rejects)} |`].join('\n');
  const H = J.heat;
  T.t1Ledger = ['| 天体 | 観測の熱流 [W] | (i) 離心軌道の潮汐 k₂/Q* | (i) ÷ 観測 | (i) 文献の k₂/Q ÷ 観測 | (ii) ÷ (i)((B − A)/C 0 —— 同じ源の 2 つ目の読み) | (iii) 軸引きずり ÷ 観測(揃える・Γ₀ 帯の下〜上) | (iii) ÷ 観測(差分の読み・下〜上) | 熱に合う Γ₀ の上限(源ごと・揃える)[1/s] | (iv) 加減速の差 ÷ 観測(合わせた上限・最大の列) |', '|---|---|---|---|---|---|---|---|---|---|',
    ...H.rows.map((r) => { const al = r.axial.find((a) => a.reading === 'aligned'), df = r.axial.find((a) => a.reading === 'diff'), l0 = r.libr.find((q) => q.bac === 0);
      return `| ${NM[r.key]}(${NM[r.host]}) | ${fe(r.heatW)} | ${fe(r.tideStar.heatW)} | ${f3(r.tideStar.rel)} | ${r.tideLit ? f3(r.tideLit.rel) : '—'} | ${f3(l0.overTide)} | ${fe(al.pts.lo.rel)}〜${fe(al.pts.hi.rel)} | ${fe(df.pts.lo.rel)}〜${fe(df.pts.hi.rel)} | ${fe(al.budget.g0Src)} | ${fe(r.accelMax.rel)}(${r.accelMax.col}) |`; })].join('\n');
  T.t1Tide = ['| 天体 | e | k₂/Q 1e-4 [W] | 1e-3 | 3e-3 | 1.5e-2 | 1e-1 |', '|---|---|---|---|---|---|---|',
    ...H.rows.map((r) => `| ${NM[r.key]} | ${r.e} | ${r.tide.map((q) => fe(q.heatW)).join(' | ')} |`)].join('\n');
  T.t1Libr = ['| 天体 | (B − A)/C | 復元 K ÷ (I n²) | 減衰 Γ ÷ (I n) | 散逸 [W] | ÷ (i)(同じ k₂/Q*) | 小さい e の 2Γe² ÷ 求積 |', '|---|---|---|---|---|---|---|',
    ...H.rows.flatMap((r) => r.libr.map((q) => `| ${NM[r.key]} | ${q.bac === r.bacLit && q.bac !== 0 ? fe(q.bac) + '(文献の値)' : fe(q.bac)} | ${fe(q.K)} | ${fe(q.G)} | ${fe(q.heatW)} | ${f3(q.overTide)} | ${f3(q.smallEOverUnit)} |`))].join('\n');
  T.t1Axial = ['| 天体 | 読み | Γ₀ 帯の中(' + fe(H.band.mid) + ')の熱 [W] | 主星の取り分 | 太陽の取り分 | 銀河の取り分 | 正味のトルク [N·m] | 1 つの口に寄せた Γ₀ の上限(第337便a) | 源ごと ÷ 1 つの口 | 熱の上限の時定数の下限 [年] |', '|---|---|---|---|---|---|---|---|---|---|',
    ...H.rows.flatMap((r) => r.axial.map((a) => { const p = a.pts.mid, sh = (k) => f3(p.bySrc.find((q) => q.src === k).share);
      return `| ${NM[r.key]} | ${RD[a.reading]} | ${fe(p.heatW)} | ${sh('host')} | ${sh('Sun')} | ${sh('galaxy')} | ${fe(p.netTorque)} | ${fe(a.budget.g0One)} | ${f3(a.budget.srcOverOne)} | ${fe(a.budget.tauMinYr)} |`; }))].join('\n');
  T.t1Accel = ['| 天体 | ' + H.rows[0].accel.map((q) => q.col).join(' | ') + ' |', '|---' + '|---'.repeat(H.rows[0].accel.length) + '|',
    `| 合わせた上限のノブ(第337便d) | ${H.rows[0].accel.map((q) => fe(q.kMax)).join(' | ')} |`,
    ...H.rows.map((r) => `| ${NM[r.key]} [W] | ${r.accel.map((q) => fe(q.heatW)).join(' | ')} |`)].join('\n');
  const R = J.res, P = R.periods, V = R.scales;
  T.t2Periods = ['| 量 | 値 |', '|---|---|',
    `| 金星の自転の周期(CSV)・共鳴の周期(k = ${P.k})[日] | ${f3(P.periodObsDay)}・${f3(P.periodResDay)} |`,
    `| 会合の周期・金星の太陽日 [日]・比 | ${f2(P.TsynDay)}・${f2(P.solarDayDay)}・${f3(P.synOverSolar)} |`,
    `| 共鳴からの滑り s − s_res [rad/s]・相対 | ${fe(P.slip)}・${fe(P.slipRel)} |`,
    `| 内合ごとの面のずれ [°] | ${f2(P.driftDegPerConj)} |`,
    `| 地球 ÷ 太陽: 誘起の変形の潮汐(第337便c の物差し)・永久の変形の瞬間の最大・共鳴の調和の成分 ÷ 太陽の同期の復元 | ${fe(V.earthOverSunRaised)}・${fe(V.earthOverSunPermPeak)}・${fe(R.earthResOverSunSync)} |`,
    `| 金星の慣性 I [kg m²]・太陽の潮汐の型 G M_☉² R⁵/a⁶ [N·m] | ${fe(V.I)}・${fe(V.tideUnit)} |`,
    `| 太陽の軸引きずりの 1 Γ₀ あたりのトルク(揃える・差分の読み)・背景軸引きずり(銀河)の 1 Γ₀ あたり [N·m s] | ${fe(V.axSunAligned)}・${fe(V.axSunDiff)}・${fe(V.axGalUnit)} |`,
    `| 今の自転が共鳴の秤動の幅の内に入る復元 I Δs²/2 [N·m]・要る (B − A)/C | ${fe(R.width.Kwidth)}・${fe(R.width.bacNeeded)} |`].join('\n');
  T.t2Harm = ['| 調和 k | A_k [m⁻³] | ÷ 最接近の 1/d³ | 今の自転の共鳴 |', '|---|---|---|---|', ...R.harm.map((h) => `| ${h.k} | ${fe(h.A)} | ${f3(h.overPeak)} | ${h.resonantNow ? '○' : ''} |`)].join('\n');
  T.t2Kres = ['| (B − A)/C | 復元 K [N·m] | 秤動の時間 √(I/K) [年] | 太陽の強制の秤動の振幅 [rad] | K ÷ 太陽の軸引きずり(Γ₀ 帯の下) | K ÷ 同(帯の上) |', '|---|---|---|---|---|---|',
    ...R.kres.map((q) => `| ${fe(q.bac)} | ${fe(q.K)} | ${fe(q.tauLibYr)} | ${fe(q.sunForcedLibRad)} | ${fe(q.overAxSunLo)} | ${fe(q.overAxSunHi)} |`)].join('\n');
  T.t2Steady = ['| (B − A)/C | 太陽の潮汐 k₂/Q | 太陽の潮汐 ÷ K | ε = 0 で定常の解 | 同じ向きの ε の上限(Γ₀ 帯の下) | 同(帯の上) | 逆向きの ε の窓(帯の下) |', '|---|---|---|---|---|---|---|',
    ...R.steady.map((s) => `| ${fe(s.bac)} | ${fe(s.k2q)} | ${fe(s.NstOverK)} | ${tf(s.existsEps0)} | ${fe(s.lo.epsSameMax)} | ${fe(s.hi.epsSameMax)} | ${fe(s.lo.epsOppLo)}〜${fe(s.lo.epsOppHi)} |`)].join('\n');
  T.t2Capture = ['| N/K | Γ′ 0.001 | Γ′ 0.01 | Γ′ 0.1 | Γ′ 1 | 定常の解 |', '|---|---|---|---|---|---|',
    ...J.decl.t2.capture.nOverK.map((N) => `| ${N} | ${J.decl.t2.capture.gammas.map((g) => { const c = R.capture.find((q) => q.N === N && q.G === g); return c.nTrapped + '/' + c.n; }).join(' | ')} | ${tf(N <= 1)} |`)].join('\n');
  T.t2Mapping = ['| (B − A)/C | 太陽の潮汐 k₂/Q | 時間の単位 √(I/K) [年] | Γ′ | N′ = N/K | 今の滑り × 時間の単位 |', '|---|---|---|---|---|---|',
    ...R.mapping.filter((m) => m.k2q === 1e-5 || m.k2q === 1e-3).map((m) => `| ${fe(m.bac)} | ${fe(m.k2q)} | ${fe(m.tauYr)} | ${fe(m.Gprime)} | ${fe(m.Nprime)} | ${fe(m.slipPrimeNow)} |`)].join('\n');
  const mo = R.moon;
  T.t2Moon = ['| 対照(同じ式) | 値 |', '|---|---|',
    `| 月の (B − A)/C(文献の値)・復元 K [N·m]・秤動の時間 [年] | ${fe(mo.bac)}・${fe(mo.K)}・${f3(mo.tauLibYr)} |`,
    `| 月: K ÷ 外部の軸引きずり(第337便c の物差し —— Γ₀ 帯の下・上) | ${fe(mo.overAxLo)}・${fe(mo.overAxHi)} |`,
    `| 金星((B − A)/C 1e-5): K ÷ 太陽の軸引きずり(帯の下・上) | ${fe(R.kres.find((q) => q.bac === 1e-5).overAxSunLo)}・${fe(R.kres.find((q) => q.bac === 1e-5).overAxSunHi)} |`].join('\n');
  const M = J.mag;
  T.t3Geom = ['| 光行差の角 [°] | 尾 200 R⊕ の最短の距離 [AU] | 1000 R⊕ | 6500 R⊕ | 1e5 R⊕ | 届く(尾の半径の内) |', '|---|---|---|---|---|---|',
    ...[...new Set(M.geom.map((g) => g.abDeg))].map((ab) => { const gs = M.geom.filter((g) => g.abDeg === ab); return `| ${f2(ab)} | ${gs.map((g) => f3(g.minDistAU)).join(' | ')} | ${gs.filter((g) => g.reaches).map((g) => g.tailRe).join('・') || '無し'} |`; })].join('\n');
  T.t3Fields = ['| 場 | B [T] | 誘導のトルクの上限 [N·m] | ÷ K((B − A)/C 1e-7・1e-6・1e-5・1e-4・1e-3) |', '|---|---|---|---|',
    ...M.fields.map((f) => `| ${f.note} | ${fe(f.B)} | ${fe(f.Nmax)} | ${f.overK.map((q) => fe(q.ratio)).join('・')} |`)].join('\n');
  T.t4 = ['| (B − A)/C | 太陽の潮汐 k₂/Q | 潮汐の復元 K [N·m] | 太陽の潮汐 ÷ K | 地球磁場(双極子の上限)÷ K | ε = 0 で定常の解 | 同じ向きの ε の上限(Γ₀ 帯の下〜上) | 逆向きの ε の窓(帯の下) | Γ′(捕まる表の軸) |', '|---|---|---|---|---|---|---|---|---|',
    ...J.joint.rows.map((r) => `| ${fe(r.bac)} | ${fe(r.k2q)} | ${fe(r.K)} | ${fe(r.Nst / r.K)} | ${fe(r.magOverK)} | ${tf(r.existsEps0)} | ${fe(r.epsSameMaxLo)}〜${fe(r.epsSameMaxHi)} | ${fe(r.epsOppLo)}〜${fe(r.epsOppHi)} | ${fe(r.Gprime)} |`)].join('\n');
  return T;
}
