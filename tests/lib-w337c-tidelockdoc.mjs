// 第337便c(原仮定者の指示(2026-11-14 —— 第138報)・統括の検証項目 R339): **正本 tests/out/tidelock-337c.json から PHYSICS〔第337便c〕の表を作る文書の lib**
// (QA docs.tidelock337c が節の表と逐語で照合する —— 表の数は有効数字 4 桁か指数 3 桁・丸めの程度の数は「< 1e-13」の形で書き、数そのものは載せない)。
export const DOC_VERSION = 'w337c-tidelockdoc-1';
const fe = (x) => (x === null || x === undefined || !Number.isFinite(x) ? '—' : Number(x).toExponential(3));
const f4 = (x) => (x === null || x === undefined ? '—' : x === Infinity ? '∞' : !Number.isFinite(x) ? '—' : Number(x).toPrecision(4));
const fx = (x) => (x === null || x === undefined ? '—' : x === Infinity ? '∞' : !Number.isFinite(x) ? '—' : x === 0 ? '0' : Math.abs(x) >= 0.01 && Math.abs(x) < 1e5 ? Number(x).toPrecision(4) : Number(x).toExponential(3));
const lt = (x, t) => (x === null || x === undefined ? '—' : Number.isFinite(x) && Math.abs(x) <= t ? '< ' + t.toExponential(0) : fx(x));
const tf = (x) => (x === true ? '真' : x === false ? '偽' : '—');
const MODE = Object.freeze({ circ: '円・相互同期(Ω = n)', instant: '離心・瞬間の同期(Ω = ḟ)', mean: '離心・平均の同期(Ω = n)' });
const ST = Object.freeze({ locked: 'ロック', notLocked: 'ロックしていない', resonance: '共鳴(3:2)', star: '恒星(ロックしていない)' });
const ROLE_JA = Object.freeze({ Sun: '太陽', Mercury: '水星', Venus: '金星', Earth: '地球', Moon: '月', Mars: '火星', Phobos: 'フォボス', Deimos: 'ダイモス', Jupiter: '木星', Io: 'イオ', Europa: 'エウロパ', Ganymede: 'ガニメデ', Callisto: 'カリスト', Pluto: '冥王星', Charon: 'カロン', galaxy: '銀河' });
const DAMP = Object.freeze({ inst: 'Γ (a/r)⁶ (s − ḟ)(瞬間)', mean: 'Γ (s − n)(平均)' });
export function tablesOf(J) {
  const T = {}, D = J.decl, tol = D.frames.tol;
  // 表 1 T1 2 つの座標系
  T.frames = ['| 型 | e | 配置の数 | (A) と (B) の差 ÷ n a | 閉じた式 −ṙ r̂ + r(Ω − ḟ) φ̂ との差 | (A) の動径の最大 | (A) の接線の最大 | (B) の回転の分 ‖s_j × r‖ の最大 | (A) の回転の分 | (B) の並進の分 ‖v_j − v_i‖ の最大 | (A) の並進の分 ‖v_i′‖ の最大 | 背景の角速度 + Ω(遠方 10⁶ a) |', '|---|---|---|---|---|---|---|---|---|---|---|---|']
    .concat(J.frames.summary.map((q) => `| ${MODE[q.mode]} | ${q.e} | ${q.n} | ${lt(q.errFrame, tol)} | ${lt(q.errClosed, tol)} | ${lt(q.maxRadA, tol)} | ${lt(q.maxTanA, tol)} | ${f4(q.maxRotB)} | ${lt(q.maxRotA, tol)} | ${f4(q.maxTransB)} | ${lt(q.maxTransA, tol)} | ${fe(q.omBgDev)} |`)).join('\n');
  // 表 2 背景の重み W₀ の 2 つの読み
  T.w0 = ['| W₀/w | 配置の数 | 共変の読み(背景の静止の場を同じ変換で写す)の差 | 素朴の読み(回る座標系で背景を静止と置く)の差の最大 | その閉じた式 (W₀/W)‖v_j + Ω × r‖ との差 | 円・相互同期の素朴の差の最大 |', '|---|---|---|---|---|---|']
    .concat(J.frames.w0.map((q) => `| ${q.w0Ratio} | ${q.n} | ${lt(q.errCov, tol)} | ${lt(q.maxNaive, tol)} | ${lt(q.errNaiveCf, tol)} | ${lt(q.maxNaiveCirc, tol)} |`)).join('\n');
  // 表 3 エネルギーの対応と第335便d の照らし
  T.energy = ['| 質量比 q | e | 位相 | E | L | E′(回る座標系) | E − Ω·L | 差 | 回る座標系の運動のエネルギー |', '|---|---|---|---|---|---|---|---|---|']
    .concat(J.frames.energy.map((q) => `| ${q.q} | ${q.e} | ${q.phase} | ${f4(q.E)} | ${f4(q.L)} | ${f4(q.Ep)} | ${f4(q.EmOL)} | ${lt(q.err, tol)} | ${lt(q.kinPrime, tol)} |`))
    .concat([`| 第335便d の \`syncTypeCase\` の残る d(${J.frames.sync335d.n} 配置) | — | — | — | — | — | — | ${lt(J.frames.sync335d.maxErr, tol)} | — |`]).join('\n');
  // 表 4 T2 ロックの条件(円)
  const LK = J.lock.rows, cell = (r) => (r.locked ? 'ロック(δ* との差 ' + lt(r.errDstar, 1e-10) + ')' : '走る(⟨s − n⟩ ' + fx(r.meanSlip) + ')');
  T.lock = ['| Γ_t ÷ I n | N_ext/K | 定常の解(\\|N_ext\\| ≤ K) | 初期 δ = 0・s = n | 初期 δ = 0・s = 6 n | 過減衰の極限の閉じた式 ⟨s − n⟩ = √(N² − K²)/Γ_t |', '|---|---|---|---|---|---|']
    .concat(D.lock.gammas.flatMap((G) => D.lock.nOverK.map((N) => { const a = LK.find((r) => r.G === G && r.N === N * D.lock.K && r.s0 === 1), b = LK.find((r) => r.G === G && r.N === N * D.lock.K && r.s0 === 6);
      return `| ${G} | ${N} | ${a.pred ? '有る' : '無い'} | ${cell(a)} | ${cell(b)} | ${a.overdamped === null ? '—' : fx(a.overdamped)} |`; }))).join('\n');
  // 表 5 時定数
  T.tau = ['| Γ_t ÷ I n | N_ext/K | δ* | 型 | 閉じた式の減衰の率 | 測った率 | 相対の差 |', '|---|---|---|---|---|---|---|']
    .concat(J.lock.tau.map((q) => `| ${q.G} | ${q.N} | ${f4(q.dStar)} | ${q.regime} | ${f4(q.rateCf)} | ${f4(q.rate)} | ${fe(q.rel)} |`)).join('\n');
  // 表 6 受動の型
  T.passive = ['| Γ_ax ÷ I n | (ω_ext − n) Γ_ax / K | 定常の解 | 測った結果(初期 δ = 0・s = n・Γ_t = 1) |', '|---|---|---|---|']
    .concat(J.lock.passive.map((r) => `| ${r.gax} | ${f4(r.N / D.lock.K)} | ${r.pred ? '有る' : '無い'} | ${cell(r)} |`)).join('\n');
  // 表 7 離心のロック
  T.ecc = ['| e | 減衰の型 | N_ext/K | 最後の 50 公転の ⟨s⟩/n | δ = θ − f の振れ〔rad〕 | 1:1 のロック |', '|---|---|---|---|---|---|']
    .concat(J.lock.ecc.map((r) => `| ${r.e} | ${DAMP[r.damp]} | ${r.N / D.lock.K} | ${f4(r.meanS)} | ${f4(r.swing)} | ${tf(r.locked11)} |`)).join('\n');
  // 表 8 水星の離心
  T.mercury = ['| Γ_t ÷ I n | 初期の自転 ÷ n | 最後の 100 公転の ⟨s⟩/n | δ の振れ〔rad〕 | 1:1 | 3:2 の ±1e-3 の内 |', '|---|---|---|---|---|---|']
    .concat(J.lock.mercury.map((r) => `| ${r.G} | ${r.s0} | ${f4(r.meanS)} | ${f4(r.swing)} | ${tf(r.locked11)} | ${tf(r.near32)} |`))
    .concat([`| 閉じた式 | e = ${f4(J.lock.mercuryE)} | 近点の ḟ/n = (1 + e)²/(1 − e²)^{3/2} = ${f4(J.lock.fdotPeriMercury)} | 擬似の同期(K = 0)= ${f4(J.lock.pseudoMercury)} | 観測の自転 ÷ n = 1.5(表 9) | — |`]).join('\n');
  // 表 9 実在の天体の表
  const B = J.bodies, srcTxt = (r) => r.ax.map((a) => ROLE_JA[a.src] + ' ' + fe(a.Nax / r.I)).join('・');
  T.bodies = ['| 天体 | 状態 | 固体/気体 | 潮汐の相手 | 自転 ÷ 公転 n | N_tide = Σ G M_p² R⁵/a⁶ [N m] | 外部の軸引きずりの源ごと N_ax/(I Γ₀) = β\\|ω_src − n\\| [s⁻¹] | 比 X = N_tide/Σ N_ax(Γ₀ = 1 s⁻¹) | 主の源 | 主星・太陽・銀河だけの比 | ロックへ入る時間(10 h・k₂/Q 既定)÷ 年齢 |', '|---|---|---|---|---|---|---|---|---|---|---|']
    .concat(B.rows.map((r) => `| ${ROLE_JA[r.id]}${r.mutual ? '(相互)' : ''} | ${ST[r.state]} | ${r.kind === 'gas' ? '気体' : '固体'} | ${r.tide.map((t) => ROLE_JA[t.p]).join('・')} | ${f4(r.spinOverN)} | ${fe(r.Ntide)} | ${srcTxt(r)} | ${fe(r.X)} | ${ROLE_JA[r.dominant]} | ${fx(r.Xhost)}・${fx(r.Xsun)}・${fx(r.Xgal)} | ${fe(r.ageRatio)} |`)).join('\n');
  // 表 10 境目
  const sp = (k, ja) => { const s = B[k]; return `| ${ja} | ${s.separable === null ? '読めない(片方の組が空)' : s.separable ? '分けられる' : '分けられない'} | ${s.separable === null ? '—' : fe(s.band[0]) + ' 〜 ' + fe(s.band[1])} | ${s.overlap === null ? '—' : s.overlap} |`; };
  T.sep = ['| 物差し(ロックしている 9 行 vs していない 5 行 —— 水星は共鳴で別) | 1 本のしきいで | 帯(していない最大 〜 している最小) | 帯の外に出た行 |', '|---|---|---|---|',
    sp('sepX', '比 X(源の全部)'), sp('sepXhost', '主の源だけの比(衛星は主星・惑星は太陽・太陽は木星)'), sp('sepXsun', '太陽だけの比(衛星だけ)'), sp('sepXgal', '銀河だけの比'), sp('sepTide', '潮汐のトルクだけ N_tide(対照)')]
    .concat(B.kq.map((q) => `| 要る k₂/Q(初期の自転 ${q.p0h} h —— 小さいほどロックしやすい・固体と気体を分けない) | ${q.one.separable ? '分けられる' : '分けられない'} | ${fe(q.one.band[0])} 〜 ${fe(q.one.band[1])}(固体だけ ${fe(q.solid.band[0])} 〜 ${fe(q.solid.band[1])}・気体の最小の要る値 ${fe(q.gasMinNeed)}) | ${q.one.overlap} |`)).join('\n');
  // 表 11 k₂/Q の掃引
  T.kq = ['| k₂/Q(全天体に同じ値・初期の自転 10 h・年齢 4.5e9 年) | 「ロックへ入る時間 < 年齢」が状態と合わない行 |', '|---|---|']
    .concat(B.scan.map((q) => `| ${fe(q.kq)} | ${q.wrong.length ? q.wrong.map((x) => ROLE_JA[x]).join('・') : '無し'} |`)).join('\n');
  // 表 12 T3 角運動量の帳簿(円)
  T.ledger = ['| σ = S/L | K ÷ I n² | Γ_t ÷ I n | 軌道へ入る割合(測った) | 閉じた式 1/(1 − 3σ)(ロックの枝) | 自転へ入る割合 | ȧ〔a n —— 模型の単位〕 | 閉じた式の ȧ | 帳簿の残り ÷ 入れたトルク |', '|---|---|---|---|---|---|---|---|---|']
    .concat(J.ledger.rows.map((r) => `| ${r.sigma} | ${r.kTil} | ${r.gTil} | ${f4(r.fOrb)} | ${f4(r.cf.fOrb)} | ${f4(r.fSpin)} | ${fe(r.adot)} | ${fe(r.cf.adot)} | ${lt(r.resRel, 1e-8)} |`)).join('\n');
  // 表 13 対照と離心
  T.ledgerEcc = ['| 列 | e | σ | K | Γ_t | 軌道へ入る割合 | 自転へ入る割合 | ȧ | ė〔/時間〕 | 帳簿の残り ÷ 入れたトルク |', '|---|---|---|---|---|---|---|---|---|---|']
    .concat(J.ledger.control.map((r) => `| 反作用なし(対照) | ${r.e} | ${r.sigma} | ${r.kTil} | ${r.gTil} | ${lt(r.fOrb, 1e-8)} | ${lt(r.fSpin, 1e-8)} | ${lt(r.adot, 1e-12)} | ${lt(r.edot, 1e-12)} | ${f4(r.resRel)} |`))
    .concat(J.ledger.ecc.map((r) => `| 反作用あり(離心) | ${r.e} | ${r.sigma} | ${r.kTil} | ${r.gTil} | ${f4(r.fOrb)} | ${f4(r.fSpin)} | ${fe(r.adot)} | ${fe(r.edot)} | ${lt(r.resRel, 1e-7)} |`)).join('\n');
  // 表 14 層の模型
  T.layers = ['| 層の数 | 結合 c | 外と内の遅れ(測った) | 閉じた式 N(n_L − 1)/(2c) | 時定数(測った) | 閉じた式 1/[2c(1 − cos(π/n_L))] | 内の層の回る率 ÷ (N/ΣI) |', '|---|---|---|---|---|---|---|']
    .concat(J.ledger.layers.map((q) => `| ${q.nL} | ${q.c} | ${fe(q.lag)} | ${fe(q.lagInf)} | ${f4(q.tau)} | ${f4(q.tauCf)} | ${f4(q.innerRateShare)} |`)).join('\n');
  // 表 15 T4 秤動する応答
  T.libr = ['| e | K ÷ I n² | Γ_t ÷ I n | 周期の解 | ⟨s⟩/n(時間の平均) | s の振れ ÷ n | 近点の分担 ÷ q_1PN | 端の間の位置 x(−5/3 → 0・+5/3 → 1) | Δe ÷ ε〔/公転〕 | ΔP/P ÷ ε〔/公転〕 | 面・重心 |', '|---|---|---|---|---|---|---|---|---|---|---|']
    .concat(J.libr.rows.map((r) => `| ${r.e} | ${r.K} | ${r.G} | ${r.ok ? (r.free ? '自由(s = n と置く)' : r.fallback !== null ? '解けた(初期値 ' + f4(r.fallback) + ')' : '解けた') : '解けない'} | ${f4(r.sMean)} | ${f4(r.sSwing)} | ${f4(r.share)} | ${f4(r.x)} | ${lt(r.de, 1e-9)} | ${lt(r.dPoverP, 1e-9)} | 0(平面・対称の模型) |`)).join('\n');
  // 表 16 端の列と照らし
  T.ends = ['| e | 瞬間の同期 s = ḟ(求積) | 第335便d の求積 | 平均の同期 s = n(求積) | 第335便d の求積 |', '|---|---|---|---|---|']
    .concat(J.libr.cross.map((q) => `| ${q.e} | ${f4(q.inst)} | ${f4(q.inst335d)} | ${f4(q.mean)} | ${f4(q.mean335d)} |`))
    .concat(J.libr.pass.map((q) => `| 通過の角の同時発展(e ${q.e}・K ${q.K}・Γ_t ${q.G}・ε 1e-6・${q.nPass} 回) | ${f4(q.sharePass)} | 求積 ${f4(q.shareQuad)} | 差 ${fe(q.d)} | 近点の周期 ΔP/P ÷ ε ${f4(q.dPanom / 1e-6)} |`)).join('\n');
  // 表 19 補足の向き(差分の読み —— 赤道面の軸引きずりの係数 c と実在の天体の境目)
  T.side = ['| 差分の読み f | 係数 c = 1 − α + f α/2(α = 2) | 赤道面の向き | 比 X(源ごとの絶対値の和)で 1 本のしきい | 帯 | 比(符号つきの和の絶対値)で | 帯 |', '|---|---|---|---|---|---|---|']
    .concat(B.sepRead.map((q) => `| ${q.f} | ${q.c} | ${q.c < 0 ? '逆回転' : q.c > 0 ? '同じ向き' : '0(ブレーキだけ)'} | ${q.sep.separable ? '分けられる' : '分けられない'} | ${fe(q.sep.band[0])} 〜 ${fe(q.sep.band[1])} | ${q.sepNet.separable ? '分けられる' : '分けられない'} | ${fe(q.sepNet.band[0])} 〜 ${fe(q.sepNet.band[1])} |`))
    .concat(['| 従来の列(c = 1 —— 向きを揃えた \\|ω_src − n\\|) | 1 | 同じ向き | ' + (B.sepX.separable ? '分けられる' : '分けられない') + ' | ' + fe(B.sepX.band[0]) + ' 〜 ' + fe(B.sepX.band[1]) + ' | — | — |']).join('\n');
  T.sideHost = ['| 天体 | 状態 | 主の源(表 9 の最初の源)のロックへのトルク N/(I Γ₀): 差分の読み f = 0 | 回転率の全部 f = 1 | 比 X: f = 0 | f = 1 | 従来の列 |', '|---|---|---|---|---|---|---|']
    .concat(B.rows.map((r) => `| ${ROLE_JA[r.id]}${r.mutual ? '(相互)' : ''} | ${ST[r.state]} | ${fe(r.hostDiff)} | ${fe(r.hostFull)} | ${fe(r.Xdiff)} | ${fe(r.Xfull)} | ${fe(r.X)} |`)).join('\n');
  // 表 22・23 補足 2 の分類(目標の列)
  const CT = B.classify, CJ = { lock: '潮汐ロック', sun: '太陽が強い', balance: '太陽と銀河の釣り合い', galaxy: '銀河の側' };
  T.classify = ['| α | 釣り合いの幅 tol | ロックのしきい T_g が引ける帯(惑星の最大 〜 衛星の最小) | T_g(帯の幾何平均) | 目標と合う行 | 合わない行 |', '|---|---|---|---|---|---|']
    .concat(CT.out.map((o) => `| ${o.alpha} | ${o.tol} | ${o.sepLock ? fe(o.lockBand[0]) + ' 〜 ' + fe(o.lockBand[1]) : '引けない'} | ${fe(o.Tg)} | ${o.nOk}/${o.n} | ${o.wrong.length ? o.wrong.map((w) => { const [a, b] = w.split('→'); return ROLE_JA[a] + ' → ' + CJ[b]; }).join('・') : '無し'} |`))
    .concat([`| 金星に地球が与える潮汐のトルク(最接近 ${CT.venusEarth.dMinAU} AU)| — | ${fe(CT.venusEarth.NEarth)} N m | 太陽の潮汐 ${fe(CT.venusEarth.NSun)} N m | 比 ${fe(CT.venusEarth.ratio)} | — |`]).join('\n');
  const o2 = CT.out.find((o) => o.alpha === 2 && o.tol === 1.5);
  T.classRows = ['| 天体 | 目標の分類 | 太陽 ÷ 銀河の軸引きずり R(α 2・金星で 1) | 潮汐 N_tide/(I max(1, R)) [s⁻²] | 予測(α 2・tol 1.5) | 合う |', '|---|---|---|---|---|---|']
    .concat(o2.rows.map((q) => `| ${ROLE_JA[q.id]} | ${CJ[q.target]} | ${f4(q.R)} | ${fe(q.score)} | ${CJ[q.pred]} | ${tf(q.ok)} |`)).join('\n');
  // 表 21 逆回転の外部の軸引きずり(T2・T3)
  T.neg = ['| 列 | 設定 | 定常の解 | 結果 | 軌道へ入る割合(閉じた式) | ȧ | 帳簿の残り |', '|---|---|---|---|---|---|---|']
    .concat(J.lock.neg.map((r) => `| T2 円(Γ_t 1・初期 n) | N_ext/K ${r.N / D.lock.K} | ${r.pred ? '有る' : '無い'} | ${cell(r)} | — | — | — |`))
    .concat(J.ledger.neg.map((r) => `| T3 円(反作用あり) | σ ${r.sigma}・K ${r.kTil}・Γ_t ${r.gTil}・ν ${r.nu} | — | — | ${f4(r.fOrb)}(${f4(r.cf.fOrb)}) | ${fe(r.adot)} | ${lt(r.resRel, 1e-8)} |`)).join('\n');
  T.pure = ['| 場面 | 結果 |', '|---|---|'].concat(Object.entries(J.pure.gates).map(([k, v]) => `| ${k} | ${tf(v)} |`)).join('\n');
  T.knobs = knobTable(J);
  return T;
}
/** ノブの表(列: ノブの名・何を満たすために足したか・既定と振った範囲・効いた量・効かなかった量・状態) */
export function knobTable(J) {
  const B = J.bodies, L = J.lock, LG = J.ledger;
  const nLocked = L.rows.filter((r) => r.locked).length, nPred = L.rows.filter((r) => r.pred).length;
  const libOk = J.libr.rows.filter((r) => r.ok && !r.free), shares = libOk.map((r) => r.share);
  const eff = {
    W0: [`素朴の読みの差(最大 ${fx(J.frames.w0[J.frames.w0.length - 1].maxNaive)} ÷ n a —— W₀/w = 1e3)`, '共変の読み(差は丸めの桁)・W₀ = 0 の 2 つの読み'],
    K: [`ロックの定常の解の有無(\\|N_ext\\| ≤ K)・近点の分担(${fx(Math.min(...shares))} 〜 ${fx(Math.max(...shares))})`, '大きい K で近点の分担は −5/3 の側へ(K 100 で −1.683)'],
    Gt: [`ロックへ入るか(定常の解の有る ${nPred} 行のうちロック ${nLocked} 行)・軌道へ入る割合(Γ_t 0 で 0)・e の漂い`, 'K が大きいときの近点の分担(Γ_t を振っても −1.683 の桁)'],
    Next: ['ロックの有無の境目 \\|N_ext\\| = K(K を超えると全部の行で走る)', '—'],
    Gax: ['境目 \\|Γ_ax(ω_ext − n)\\| = K(一定の型と同じ境目)', '—'],
    damp: ['離心でロックの境目が下がる(e 0.3・瞬間の型は N/K 0.5 で走る)', 'e 0.1 の境目(どちらの型も N/K 0.9 でロック)'],
    rexp: ['—(振っていない)', '—'],
    thr: [`比 X で 1 本のしきい ${B.sepX.separable ? '有り' : '無し'}(帯 ${fe(B.sepX.band[0])} 〜 ${fe(B.sepX.band[1])} s⁻¹)`, '潮汐のトルクだけでは分けられない(対照)'],
    k2q: [`要る k₂/Q で 1 本のしきい(10 h —— 帯 ${fe(B.kq[1].one.band[0])} 〜 ${fe(B.kq[1].one.band[1])})`, '気体を分けなくても今の 15 行では分けられた(固体と気体を分けるノブは不用の見込みの候補)'],
    age: ['ロックへ入る時間との比べ(k₂/Q と同じ式に入る —— 独立のノブではない)', '—'],
    p0: [`帯の位置(5 h・10 h・24 h で帯が ${fe(B.kq[0].one.band[1])} → ${fe(B.kq[2].one.band[1])})`, '分けられるかどうか(3 つとも分けられる)'],
    sigma: [`軌道へ入る割合(σ 0.01 → 1.031・0.1 → 1.427・0.5 → 閉じた式 −2 の枝に乗らない)`, '—'],
    react: ['帳簿の残り(反作用なしで 1.000 —— 閉じない)', '—'],
    side: [`主星の項の向き(差分の読みで逆回転 —— ロックしている 9 行の全部で負)・比の帯の下の端(f 0 → 1 で ${fe(B.sepRead[0].sep.band[0])} → ${fe(B.sepRead[B.sepRead.length - 1].sep.band[0])})`, '分けられるかどうか(5 つの f の全部で分けられる —— 銀河の項が主で、その大きさは f にほとんど依らない)'],
    Qsg: [`太陽と銀河の分かれ目(金星で R = 1 と置くと水星 R ${f4(B.classify.out.find((o) => o.alpha === 2).rows.find((q) => q.id === 'Mercury').R)}・地球 ${f4(B.classify.out.find((o) => o.alpha === 2).rows.find((q) => q.id === 'Earth').R)} —— 幅 tol 1.5 で 14/14)`, '金星の釣り合いそのもの(置き方で 1 —— 出力ではない)・地球は幅 tol 2 以上で釣り合いの側に入る(α 2)'],
    Tg: [`衛星と惑星の分かれ目(帯 ${fe(B.classify.out.find((o) => o.alpha === 2).lockBand[0])} 〜 ${fe(B.classify.out.find((o) => o.alpha === 2).lockBand[1])} s⁻²)`, '—'],
    cL: ['全体が回るまでの時間(結合 c に反比例)', '遅れが消えること(定常の遅れ N(n_L − 1)/(2c) が残る)'],
  };
  const head = ['| ノブ | 何を満たすために足したか | 既定と振った範囲 | 効いた量 | 効かなかった量 | 状態 |', '|---|---|---|---|---|---|'];
  return head.concat(J.knobs.map((k) => { const e = eff[k.key] || ['—', '—']; return `| ${k.name} | ${k.why} | ${k.grid} | ${e[0]} | ${e[1]} | ${k.state} |`; })).join('\n');
}
