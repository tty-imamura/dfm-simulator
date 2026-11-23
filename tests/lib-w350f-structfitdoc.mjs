// 第350便f(原仮定者の整理(2026-11-23 —— 第146報)・統括の検証項目 R423):
// **正本 tests/out/structfit-350f.json から PHYSICS〔第350便f〕の表を作る文書の lib**
// (QA docs.structfit350f が節の表と逐語で照合する —— 表の数は有効数字 3 桁・冪は小数 3 桁)。原文(言葉を変えずに引く)と読み・係数の入り方の表もここに持つ。
export const DOC_VERSION = 'w350f-structfitdoc-1';
const fe = (x) => (x === null || x === undefined || !Number.isFinite(x) ? '—' : x === 0 ? '0' : Number(x).toExponential(2));
const f3 = (x) => (x === null || x === undefined || !Number.isFinite(x) ? '—' : Number(x).toFixed(3));
const tf = (x) => (x === true ? '真' : x === false ? '偽' : '—');
const NM = Object.freeze({ Mercury: '水星', Venus: '金星', Earth: '地球', Mars: '火星', Jupiter: '木星', Saturn: '土星', Uranus: '天王星', Neptune: '海王星', Moon: '月', Io: 'イオ', Pluto: '冥王星',
  Sun: '太陽', EarthHi: '地球(傾きの最大の位相)', Charon: 'カロン' });
const GRP = Object.freeze({ rock: '岩石', gas: 'ガス', ice: '氷', moon: '衛星', all: '全体' });
const CAND = Object.freeze({ W: '(W)', P2: '(P2)' });
const MODE = Object.freeze({ arm: '(i) 腕だけ', self: '(ii) 自分の重みの球の半径も' });
const LEVEL = Object.freeze({ all: '(全)', group: '(組)', body: '(個)' });
const STATUS = Object.freeze({ one: '解 1 つ', none: '解なし', many: '解が複数', flat: '平ら', edge: '範囲の端', nodata: '比べる数が無い', role: '役割が桁(使わない)' });
const ROLE = Object.freeze({ lit: '文献の値', order: '桁' });
const FROM = Object.freeze({ body: '天体ごと', group: '構造の組', all: '全体で 1 つ' });

/** 原文(言葉を変えずに引く) */
export const ORIGINAL = Object.freeze([
  Object.freeze(['原仮定者の整理(2026-11-23 —— 第146報)', '天体の構造別に軸引きずりの利き方に差異が予想され、観測半径に対する引きずられ半径の係数がノブの候補。構造別の参考値を用意しつつ、天体の構造を分析する為に、個別にフィットする']),
  Object.freeze(['原仮定者の回答(2026-11-23 —— 第145報の回答 10)', 'AN976: 安定している運行は、結果として釣り合っている。釣り合う向きは、銀河由来と太陽由来の軸引きずりを重みで合成した方向。その方向と観測の向きが違う場合は、ジャイロトルクで釣り合いつつ歳差運動をしている。天体の構造別に軸引きずりの利き方に差異が予想され、観測半径に対する引きずられ半径の係数がノブの候補']),
  Object.freeze(['原仮定者の整理(2026-11-23 —— 第146報)', '太陽系サンプルでは、銀河由来の軸引きずりは、背景軸引きずりとして扱う']),
  Object.freeze(['原仮定者の整理(2026-11-23 —— 第146報)', '下記の案も検証する。対象の組は、慣性決定力のgeoPN=3']),
]);
/** 統括の読み(原文と分ける)—— [読み, 数えた所] */
export const READINGS = Object.freeze([
  Object.freeze(['新しい句は「構造別の参考値を用意しつつ」と「個別にフィットする」。構造の組(宣言の 4 組: 岩石・ガス・氷・衛星 —— 〔第348便c〕)ごとの参考値と、天体ごとの当てはめの両方を出す。天体ごとの当てはめは構造を見るための診断(較正の合格ではない)。平らで決まらないときは「決まらない」と書く', '表 3〜表 5']),
  Object.freeze(['当時の文(前の文 —— 消さずに並べる)。〔第348便c〕〔第348便h〕の係数 c_R の列(冪の入り方・自分の重みの経路)', '表 1']),
  Object.freeze(['背景軸引きずりの置き方は本便の枝 e。本節は「背景なし」(銀河由来の回転を合成に足さない)と (B1)(第348便h の galRot3 の値をそのまま足す)の 2 列だけ', '表 3 の下の数の文']),
  Object.freeze(['場は第348便h の geoPN=3 の場(在位の形 —— K1・源の回転は球のモーメント・背景 0・自分の重みを分母に・受け手の速度を引く)', '表 1〜表 5']),
]);
export function originalTable(readings = READINGS) {
  return ['| # | 出どころ | 原文(言葉を変えずに引く) | 読み(統括の読み —— 原文と分ける) | 数えた所 |', '|---|---|---|---|---|',
    ...ORIGINAL.map(([src, o], k) => `| ${k + 1} | ${src} | 「${o}」 | ${readings[k][0]} | ${readings[k][1]} |`)].join('\n');
}
/** 係数の入り方の表(場のどこに c_R が入るか) */
export const ENTRY_FORM = ['| 入り方 | 2 点の差分の腕 | 自分の重み(分母) | (W)(中心の渦度の半分) | 第348便h の場の組との対応 |', '|---|---|---|---|---|',
  '| 規則の半径(対照) | 極限(腕 → 0)・腕の点の自分の重みは R_d = Y_k m の球の表面の値 m/R_d | 中心 3m/(2R_d) | c_R を読まない | (g3-1)(無調整) |',
  '| (i) 腕だけ | 有限の腕 c_R R_obs(2 点の差分をそのまま —— 〔第347便h〕の rotOf) | 規則の半径の球の表面の値 m/R_d のまま(分母の定数) | 腕が無い —— c_R に依らない | c_R → 0 で (g3-1) の (P2) |',
  '| (ii) 自分の重みの球の半径も | 極限(腕の点の自分の重みは半径 c_R R_obs の球の表面の値) | 中心 3m/(2 c_R R_obs) | 自分の重みを通して c_R に依る | c_R 1 で (g3-3) |'].join('\n');

export function tablesOf(J) {
  const T = {}, S = J.pure.scenes, G = J.pure.gates;
  T.pure = ['| 零試験・場面 | 値 | 門 |', '|---|---|---|',
    `| ① 共通の点検の数(源 m 1・R 1・(0,0,0)・速度 (0,1,0)/受け手 m 1・R 1・(4,0,0)・背景 0・腕 0.01): x の直径の 2 点の差分・6 点の平均・中心の渦度の半分の z 成分 | ${S.common.p2x.toFixed(8)}・${S.common.p6.toFixed(8)}・${S.common.w.toFixed(8)} | ${tf(G.common)} |`,
    `| ② 通過の向きの反転で符号が反転/中心線の向きの通過・相対静止・自分の重みも背景も 0 で 0/両方に (3,−2,1) を足した相対の変わり | ${fe(S.inv.flip)}/${fe(S.inv.center)}・${fe(S.inv.rest)}・${fe(S.inv.noSelf)}/${fe(S.inv.boost)} | ${tf(G.invariances)} |`,
    `| ③ 剛体回転 (1,2,3) × r: 6 点の平均・x の直径/純粋なずれ (y, x, 0): x の直径・6 点の平均 | (${S.rs.rig6.map(f3).join(', ')})・(${S.rs.rigX.map(f3).join(', ')})/(${S.rs.shX.map(f3).join(', ')})・(${S.rs.sh6.map(f3).join(', ')}) | ${tf(G.rigidShear)} |`,
    `| ④ 第348便h の表との一致((ii) c = 規則の比 → (g3-1)・(ii) c 1 の (B1) → (g3-3)・(i) c 1 の (W) → (g3-1) の相対の差の最大/(i) c 1 の (P2) と (g3-1) の有限の腕の差) | ${fe(S.h4)}/${fe(S.a4)} | ${tf(G.vs348h)} |`,
    `| ⑤ 地球(背景なし): 規則の半径の (W)・(P2)/(i) c 1 の (W)・(P2)/(ii) c 1 の (W) [″/年] | ${fe(S.earth.W)}・${fe(S.earth.P2)}/${fe(S.earth.armW1)}・${fe(S.earth.armP21)}/${fe(S.earth.selfW1)} | ${tf(G.earth348h)} |`,
    `| ⑥ 当てはめの道具の自己試験(平ら → 平ら・2 つの交わり → 解が複数・範囲の外 → 解なし・c² = 4 → c 2・共通の c の最小が端 → 範囲の端) | ${STATUS[S.t5.flat.status]}・${STATUS[S.t5.many.status]}・${STATUS[S.t5.above.status]}・${f3(S.t5.pow.c)}・${STATUS[S.t5.edge.status]} | ${tf(G.solver)} |`,
    `| ⑦ 変異: 地球の比べる数を 2 倍にすると c が動く/比べる数の無い天体に値を作らない/水星の役割 | ${tf(S.mut.moved)}/${tf(S.mut.noData)}/${ROLE[S.mut.mercuryRole]} | ${tf(G.mutants)} |`,
    `| ⑧ 入力の拒否(入り方の名・c 0・c 負・候補の名・背景の名・負の比べる数) | ${S.rejects.filter(Boolean).length}/${S.rejects.length} | ${tf(G.rejects)} |`].join('\n');
  T.entry = ['| 天体 | 組 | 候補 | 規則の半径 ÷ 観測半径 | 規則の半径の率 [″/年] | (i) c_R 1 の率 | (i) c_R 0.1〜10 の動き | (ii) c_R 1 の率(背景なし) | (ii) c_R 1 の率((B1)) | (ii) の格子の最大 | 冪(規則の半径の近く) | 冪(規則 → c_R 0.5) | 冪(c_R 0.5 → 2) | 自分の重みと他の重みが等しくなる c_R |', '|---|---|---|---|---|---|---|---|---|---|---|---|---|---|',
    ...J.entry.map((r) => `| ${NM[r.id]} | ${GRP[r.group]} | ${CAND[r.cand]} | ${fe(r.ruleRatio)} | ${fe(r.rule)} | ${fe(r.arm1)} | ${fe(r.armSpread)} | ${fe(r.self1)} | ${fe(r.self1B)} | ${fe(r.selfMax)} | ${f3(r.slopeRule)} | ${f3(r.slopeTo05)} | ${f3(r.slope1)} | ${fe(r.cStar)} |`)].join('\n');
  T.obs = ['| 天体 | 組 | 歳差の率 [″/年]・役割 | 自転の変化の率 [1/年] | 熱 [W] |', '|---|---|---|---|---|',
    ...J.obs.map((r) => `| ${NM[r.id]} | ${GRP[r.group]} | ${r.prec ? r.prec.asYr + '・' + ROLE[r.prec.role] : '無い'} | ${r.spin ? fe(r.spin.rateYr) : '無い'} | ${r.heat === null ? '無い' : fe(r.heat)} |`)].join('\n');
  T.fit = ['| 入り方 | 候補 | 段 | 組・天体 | 比べる数の数 | 自由度 | 結果 | c_R | 残差 ln(模型 ÷ 比べる数) | 桁違い | 解で 10 倍の c の動きが 1% 未満 | 比べる数が格子の最大より上 |', '|---|---|---|---|---|---|---|---|---|---|---|---|',
    ...J.fit.filter((r) => r.bg === 'none' && !(r.level === 'body' && r.status === 'nodata')).map((r) => `| ${MODE[r.mode]} | ${CAND[r.cand]} | ${LEVEL[r.level]} | ${GRP[r.set] || NM[r.set]} | ${r.n} | ${r.dof === null ? '—' : r.dof} | ${STATUS[r.status]}${r.edge ? '(' + (r.edge === 'hi' ? '上' : '下') + ')' : ''} | ${fe(r.c)} | ${Array.isArray(r.resid) ? r.resid.map(f3).join('・') : '—'} | ${r.status === 'one' ? (r.big ? '10³ 以上' : r.small ? '10⁻³ 以下' : 'いいえ') : '—'} | ${tf(r.flatAt)} | ${tf(r.above)} |`)].join('\n');
  T.ref = ['| 入り方 | 候補 | 組 | 天体の数 | 比べる数の在る天体 | 解の在る天体 | 中央値 | 最小〜最大 | 最大 ÷ 最小 | log10(中央値) |', '|---|---|---|---|---|---|---|---|---|---|',
    ...J.ref.filter((r) => r.bg === 'none').map((r) => `| ${MODE[r.mode]} | ${CAND[r.cand]} | ${GRP[r.group]} | ${r.members} | ${r.nData} | ${r.nSol} | ${fe(r.median)} | ${r.min === null ? '—' : fe(r.min) + '〜' + fe(r.max)} | ${f3(r.spread)} | ${f3(r.log10From1)} |`)].join('\n');
  T.pred = ['| 候補 | 天体 | c_R の出どころ | c_R | 慣性回転へ (S1)(E1) の自転の増え方 [1/年] | 比べる数(自転の変化の率) | 比(大きさ) | 引きずり回転へ (S1)(E3) の熱 [W] | 比べる数(熱) | 比 | 規則の半径の自転の増え方 | 規則の半径の熱 |', '|---|---|---|---|---|---|---|---|---|---|---|---|',
    ...J.pred.filter((r) => r.bg === 'none').map((r) => `| ${CAND[r.cand]} | ${NM[r.id]} | ${r.from ? FROM[r.from] : '—'} | ${fe(r.c)} | ${fe(r.spinRateYr)} | ${fe(r.obsSpinRateYr)} | ${fe(r.spinOverObs)} | ${fe(r.heatW)} | ${fe(r.obsHeatW)} | ${fe(r.heatOverObs)} | ${fe(r.ruleSpinRateYr)} | ${fe(r.ruleHeatW)} |`)].join('\n');
  return T;
}
/** 数の文(節に逐語) */
export function factsOf(J) {
  const F = {}, en = (id, cand) => J.entry.find((r) => r.id === id && r.cand === cand), eW = en('Earth', 'W'), eP = en('Earth', 'P2'), obsE = J.obs.find((r) => r.id === 'Earth').prec.asYr;
  F.earth = `地球(太陽由来・背景なし)の歳差の率は、規則の半径で (W) ${fe(eW.rule)}・(P2) ${fe(eP.rule)}″/年、(i) c_R 1 で (W) ${fe(eW.arm1)}・(P2) ${fe(eP.arm1)}″/年、(ii) c_R 1 で (W) ${fe(eW.self1)}・(P2) ${fe(eP.self1)}″/年(比べる列 ${obsE}″/年との比は (W) で ${fe(eW.rule / obsE)}・${fe(eW.self1 / obsE)})`;
  const sW = J.entry.filter((r) => r.cand === 'W');
  F.slopes = `(ii) の効きの冪((W)・代表の 11 天体)は、規則の半径の近くで ${f3(Math.min(...sW.map((r) => r.slopeRule)))}〜${f3(Math.max(...sW.map((r) => r.slopeRule)))}、規則の半径から c_R 0.5 までの平均で ${f3(Math.min(...sW.map((r) => r.slopeTo05)))}〜${f3(Math.max(...sW.map((r) => r.slopeTo05)))}、c_R 0.5 から 2 までで ${f3(Math.min(...sW.map((r) => r.slope1)))}〜${f3(Math.max(...sW.map((r) => r.slope1)))}`;
  F.arm = `(i) 腕だけでは、c_R を 0.1 から 10 まで動かしても率の動きは (W) で ${fe(Math.max(...sW.map((r) => r.armSpread)))}・(P2) で 冥王星を除いて最大 ${fe(Math.max(...J.entry.filter((r) => r.cand === 'P2' && r.id !== 'Pluto').map((r) => r.armSpread)))}(冥王星 ${fe(J.entry.find((r) => r.cand === 'P2' && r.id === 'Pluto').armSpread)} —— 腕がカロンまでの距離の桁)`;
  const moon = J.entry.find((r) => r.id === 'Moon' && r.cand === 'W'), mObs = J.obs.find((r) => r.id === 'Moon').prec.asYr;
  F.moon = `月の比べる数 ${fe(mObs)}″/年(第330便a の lib では節の 18.613 年の率)は、(ii) の格子の最大 ${fe(moon.selfMax)}″/年((W))より上`;
  const fa = (mode, cand, level, set) => J.fit.find((r) => r.mode === mode && r.cand === cand && r.bg === 'none' && r.level === level && r.set === set);
  const a = fa('self', 'W', 'all', 'all'), g = fa('self', 'W', 'group', 'rock'), aP = fa('self', 'P2', 'all', 'all'), gP = fa('self', 'P2', 'group', 'rock');
  F.fit = `(ii)・背景なしの (全) は (W) で c_R ${fe(a.c)}・残差の二乗和 ${f3(a.sse)}(自由度 ${a.dof})・(P2) で ${fe(aP.c)}・${f3(aP.sse)}、(組) 岩石は (W) で ${fe(g.c)}・${f3(g.sse)}(自由度 ${g.dof})・(P2) で ${fe(gP.c)}・${f3(gP.sse)}`;
  const rr = J.ref.find((r) => r.mode === 'self' && r.cand === 'W' && r.bg === 'none' && r.group === 'rock'), rrP = J.ref.find((r) => r.mode === 'self' && r.cand === 'P2' && r.bg === 'none' && r.group === 'rock');
  F.ref = `岩石の組の天体ごとの c_R の中央値は (W) ${fe(rr.median)}(最大 ÷ 最小 ${f3(rr.spread)})・(P2) ${fe(rrP.median)}(${f3(rrP.spread)})`;
  let mx = 0; for (const x of J.fit.filter((r) => r.bg === 'none' && r.c !== null)) { const y = J.fit.find((r) => r.bg === 'B1' && r.mode === x.mode && r.cand === x.cand && r.level === x.level && r.set === x.set); mx = Math.max(mx, Math.abs(y.c / x.c - 1)); }
  F.bg = `(B1) と背景なしの c_R の相対の差は最大 ${fe(mx)}`;
  F.nodata = `比べる数(歳差の率)の無い天体 ${J.obs.filter((r) => !r.prec).map((r) => NM[r.id]).join('・')} は c_R を作らない・水星は役割が「桁」で当てはめに使わない`;
  return F;
}
