// 第348便h(原仮定者の指示(2026-11-23 —— 第145報の補足 2)・統括の検証項目 R416):
// **正本 tests/out/axisgeo3-348h.json から PHYSICS〔第348便h〕の表を作る文書の lib**
// (QA docs.axisgeo3_348h が節の表と逐語で照合する —— 表の数は有効数字 3 桁・角は小数 2 桁)。原文(言葉を変えずに引く)と、場の形の表(アプリの行と公開の節の対応)もここに持つ。
export const DOC_VERSION = 'w348h-axisgeo3doc-1';
const fe = (x) => (x === null || x === undefined || !Number.isFinite(x) ? '—' : x === 0 ? '0' : Number(x).toExponential(2));
const f3 = (x) => (x === null || x === undefined || !Number.isFinite(x) ? '—' : Number(x).toFixed(3));
const f2 = (x) => (x === null || x === undefined || !Number.isFinite(x) ? '—' : Number(x).toFixed(2));
const tf = (x) => (x === true ? '真' : x === false ? '偽' : '—');
const NM = Object.freeze({ Mercury: '水星', Venus: '金星', Earth: '地球', Mars: '火星', Jupiter: '木星', Saturn: '土星', Uranus: '天王星', Neptune: '海王星', Moon: '月', Io: 'イオ', Pluto: '冥王星',
  Sun: '太陽', EarthHi: '地球(傾きの最大の位相)', EarthLo: '地球(傾きの最小の位相)', Charon: 'カロン' });
const CAND = Object.freeze({ W: '(W)', P2: '(P2)' });
const COMBO = Object.freeze({ K1rM: '(g3-1) K1・規則の半径・球のモーメント', K1rQ0: '(g3-2) K1・規則の半径・落ち方なし', K1cM: '(g3-3) K1・観測半径・球のモーメント', K2capM: '(g3-4) K2・既定の半径・球のモーメント' });
const KIND = Object.freeze({ S1E1: '(S1)(E1)', S1E2: '(S1)(E2)', S1E3: '(S1)(E3)', S2pE2: '(S2′)(E2)' });
const DEST = Object.freeze({ inertial: '慣性回転', drag: '引きずり回転' });
const JUDGE = Object.freeze({ grow: '増え続ける', flat: '頭打ち', none: '増えない' });
const ROT = (q) => (q === 'M' ? '球のモーメント' : 'q ' + q);
const pairName = (r) => `${NM[r.id]} | ${NM[r.src]}`;

/** 原文(言葉を変えずに引く) */
export const ORIGINAL = Object.freeze([
  Object.freeze(['原仮定者の指示(2026-11-23 —— 第145報の補足 2)', '引きずり近似のkFrameとqは、geoPN=2が対象。検証を進めている軸引きずりや円盤引きずりは、geoPN=3が対象']),
  Object.freeze(['原仮定者の指示(2026-11-23 —— 第145報の補足 2)', '軸引きずりのエネルギーの行き先は、「慣性回転」と「引きずり回転」それぞれの比較を行う']),
  Object.freeze(['原仮定者の指示(2026-11-22 —— 第145報の補足 1)', '並進引きずりは移動と回転を含み、並進引きずりの引きずられる側の部位差分による回転が軸引きずりである。軸引きずりは、源の回転の赤道面方向で強く現れるが、源が無回転で横を通り過ぎても並進引きずりと共に発生する']),
  Object.freeze(['原仮定者の指示(2026-11-22 —— 第145報の補足 1)', '自転速度は、「慣性回転」と「引きずり回転」の合成である']),
  Object.freeze(['原仮定者の指示(2026-11-22 —— 第145報の補足 1)', 'エネルギーの行き先は、内部熱か、自転の「慣性回転」。自転速度が増すと、慣性モーメントが増して、トルクが増す']),
  Object.freeze(['原仮定者の回答(2026-11-22 —— 第145報の回答 9)', 'AN969: ２つのケースを検証する。１つ目は、『エネルギーの行き先は、自転の「引きずり回転」』。２つ目は、『自転速度が増すと、角運動量が増して、トルクが増し、傾きにくくなり釣り合う』']),
  Object.freeze(['原仮定者の回答(2026-11-23 —— 第145報の回答 10)', 'AN975: トルクの式の自転速度は、前回ステップの慣性回転と引きずり回転の合成。ただし、引きずり回転は、毎回リセットする。これは、並進引きずりの式での、「前回ステップの慣性と引きずりの合成として、その前のステップとの差分を使用し、引きずりは毎回リセットする」と同様']),
  Object.freeze(['原仮定者の回答(2026-11-23 —— 第145報の回答 10)', 'AN976: 安定している運行は、結果として釣り合っている。釣り合う向きは、銀河由来と太陽由来の軸引きずりを重みで合成した方向。その方向と観測の向きが違う場合は、ジャイロトルクで釣り合いつつ歳差運動をしている。天体の構造別に軸引きずりの利き方に差異が予想され、観測半径に対する引きずられ半径の係数がノブの候補']),
  Object.freeze(['原仮定者の回答(2026-11-23 —— 第145報の回答 10)', 'AN977: 実装は変えず、kFrameとqの引きずりは、「引きずり近似」として扱う。並進引きずりだけでなく、近距離での効きの違いも含んでいる']),
]);
/** 統括の読み(原文と分ける)—— [読み, 数えた所] */
export const READINGS = Object.freeze([
  Object.freeze(['〔第347便h〕〔第347便i〕〔第348便b〕〔第348便c〕〔第348便d〕の表は、kFrame と q の形の枠の速度の場(重み・D₀・(R/(R + d))^q —— 引きずり近似 = geoPN=2 の形)で数えていた。軸引きずりの検証は geoPN=3(慣性決定力の引きずり)の場で数える', '表 2〜表 12']),
  Object.freeze(['行き先を 1 つに決めず、「慣性回転」に入れた場合と「引きずり回転」に入れた場合を同じ表に並べて比べる(AN975 の步の形 —— 前のステップの合成・引きずり回転は毎ステップリセット —— の上で)', '表 13・表 14']),
  Object.freeze(['当時の文。geoPN=3 の場では分母に自分の重みが入るので、自転しない源の通過でも受け手の部位差分の回転が残る(自分の重みの無い〔第347便h〕の場では D₀ > 0 か第 3 の源が要った)', '表 7 の「通過」の列・表 6 の ⑤']),
  Object.freeze(['当時の文。アプリの〔第301便c〕の「軸回転 = 慣性軸回転 + 引きずり軸回転」に当たる(表 4)', '表 4']),
  Object.freeze(['当時の文(〔第347便h〕表 1 —— 消さずに残す)。行き先「慣性回転」の列', '表 13・表 14 の「慣性回転」の列']),
  Object.freeze(['当時の文。1 つ目の行き先「引きずり回転」の列', '表 13・表 14 の「引きずり回転」の列']),
  Object.freeze(['〔第348便b〕の步の形 (S1)・(S2′) と、リセットの後の行き先 (E1)(E2)(E3)', '表 13・表 14']),
  Object.freeze(['〔第348便c〕の重みの型 (W1)(W2)(W3) と δ・歳差の率・係数 c_R。本節は由来ごとの回転を geoPN=3 の場で作り直して同じ型で合成する', '表 8〜表 12']),
  Object.freeze(['「引きずり近似」は geoPN=2 の呼び名(本便の枝 a)。本節の geoPN=3 の場の列と、〔第348便c〕の q 0・2・3 の列(引きずり近似の形)を並べる', '表 9']),
]);
export function originalTable(readings = READINGS) {
  return ['| # | 出どころ | 原文(言葉を変えずに引く) | 読み(統括の読み —— 原文と分ける) | 数えた所 |', '|---|---|---|---|---|',
    ...ORIGINAL.map(([src, o], k) => `| ${k + 1} | ${src} | 「${o}」 | ${readings[k][0]} | ${readings[k][1]} |`)].join('\n');
}

/** 表 2 場の形(geoPN=2 の引きずり近似と geoPN=3 の慣性決定力の引きずり)—— アプリの行(beta 版の html の関数の名 —— 読むだけ)と公開の節 */
export const FORM_TABLE = ['| 項目 | geoPN=2(引きずり近似 —— E2/E3・kFrame・q・D₀) | geoPN=3(慣性決定力の引きずり —— 在位の新則) | 当たり所 |', '|---|---|---|---|',
  '| 枠の速度の式 | u(x) = Σ w_j c_j ÷ (D₀ + Σ w_j)・c_j = v_j + ω_j(d) × (x − p_j)(〔第347便h〕の場 —— 〔第321便a〕の lib の `frameAtPoint3` はアプリの行の写し) | u_i = Σ_j β_ij (V_j − v_i)・β_ij = ⟨W_j ÷ W⟩(受け手の体積の比の平均)・行 u_i − Σ_j β_ij u_j = s_i(〔第309便a〕の ②・アプリの `inertialDragIsqEvalK1`・`inertialDragIsqNodeK1`) | 形は同じ「重みつきの平均」・速度の取り方が違う |',
  '| 重み | w_j = m_j (d² + ε²)^(−p/2)(p は `frameWeightPow` —— 既定 2・"share" は 1) | W_j = m_j K1(r; R_j)(外部 m/r・内部 m(3R² − r²)/(2R³) —— `inertialDragIsqK1`)。K2(〔第309便a〕—— 遠方 m/r²)は比べる列 | 「重み = 質量 ÷ 距離²」は K2 の形(〔第309便a〕)・在位は K1(〔第312便a〕〔第313便a〕〔第315便c〕) |',
  '| 分母 | D₀ + Σ w_j(自分を含まない —— `dfmFrameAt` の D0・D0pull) | W = W₀ + W_ii + Σ_j W_j(自分を含む —— `inertialDragIsqPointRecvK1` の w1・g1 が自分の場)。原仮定者の裁定(第107報)「自分が分母に入れば良い」(〔第310便c〕) | D₀ ↔ W₀ + W_ii(自分の重みは受け手の中で位置に依る —— 中心で勾配 0) |',
  '| 背景 | D₀(引きずり近似のノブ) | W₀(コードの `Wbg2` —— 今は 0 だけを受理 —— 〔第310便a〕)。旧則の背景(〔第301便a〕〔第302便a〕のコードの `Wbg`)は旧の世代 | 本節は W₀ = 自分の重みの中心の値の 0・1 倍を列に |',
  '| 受け手の速度 | 引かない(絶対の枠の速度 —— 受け手は v + k_F u の型) | 引く(相対速度 V_j − v_i —— 自分の分子は 0) | 本節の零試験 ④(ガリレイの変換で geoPN=3 は不変・geoPN=2 は変わる) |',
  '| 源の回転の分 | ω_j(d) = s_j (R_j ÷ (R_j + d))^q(引きずり減衰 q —— 〔第347便h〕) | Ω_j â_j × ⟨(m_j M1(r) ÷ W) n̂⟩(球の近遠差のモーメント M1 = R²/(5r²) —— `inertialDragIsqM1`・源のモーメントの半径 R_src は `inertialDragIsqM1Src`) | 距離の落ち方: geoPN=2 は q のノブ・geoPN=3 は球のモーメントから (R/r)²/5(R は規則の半径 Y_k m —— 宣言で R_src) |',
  '| 軸引きずり(アプリ) | 当たらない(geoPN=2 の步に軸引きずりの式は無い) | ω_i = A Σ_j ⟨amp sinθ Ω_j (2n̂(n̂·â_j) − â_j)⟩・amp = −n̂·∇(m_j M1 ÷ W)(`inertialDragIsqNodeK1` の OP —— 〔第309便a〕の ②) | 本節の候補 (P2)・(W) は場 u から作る別の型(アプリの軸の式とは別 —— 表 5) |',
  '| リセット | u は毎步作り直す(輸送の項は前の步の u との差 —— `transportDelta3` の写し) | u は毎步解き直す・引きずり軸回転 ω_drag は毎步作り直す(〔第301便c〕・`S.rotADr`) | AN975 の「引きずりは毎回リセット」の形はどちらも同じ |',
  '| 設定の鍵 | `physics.kFrame`・`physics.q`・`physics.D0`・`physics.frameWeight` | `physics.relativeDrag`(law "inertial")の `invSq`(`kernel:"k1"`・`rdRule:"kappaM"`・`Wbg2`)・`spinDrag.rot`・`spinDrag.axial` | 本節はどちらの鍵も変えない |'].join('\n');
/** 表 3 geoPN=3 の場の世代(公開の節) */
export const GEN_TABLE = ['| 世代 | 重み | 分母 | 自分 | 背景 | 公開の節 |', '|---|---|---|---|---|---|',
  '| 旧則(点の核) | m r ÷ (r² + ε²)²(遠方 m/r³) | 背景 + Σ w | 含まない | コードの `Wbg`(〔第302便a〕の直接の宣言) | 〔第301便a〕〔第302便a〕〔第302便d〕 |',
  '| 旧則 + 源の慣性決定力 | 同上 | 背景 + Σ m/(λ(r² + ε²)) + Σ w | 宣言で R_i の項 | 同上 | 〔第303便b〕〔第304便a〕 |',
  '| 新則 K2 | 体積平均の 1/r²(遠方 m/r²) | W₀ + W_ii + Σ W_j | 含む(受け手の体積の各点) | W₀(新しい単位・既定 0) | 〔第309便a〕〔第310便a〕〔第310便c〕 |',
  '| 新則 K1(在位) | 体積平均の 1/r(外部 m/r) | W₀ + W_ii + Σ W_j | 含む | W₀ = 0 だけを受理 | 〔第312便a〕〔第313便a〕〔第315便c〕 |'].join('\n');
/** 表 4 〔第301便c〕の分解と補足 1 の合成の対応 */
export const SPLIT_TABLE = ['| 項目 | アプリ(〔第301便c〕—— 原仮定者の裁定(第91報)②) | 補足 1・回答 9・回答 10 | 〔第348便b〕の步の形 |', '|---|---|---|---|',
  '| 慣性の分 | 慣性軸回転 s_i(自転の状態 `S.spin` —— 角は `S.rotAIn`) | 「慣性回転」 | ω_慣性(状態として積む) |',
  '| 引きずりの分 | 引きずり軸回転 ω_drag,i(毎步作り直す —— 角は `S.rotADr`) | 「引きずり回転」 | Ω∥(毎ステップリセット —— AN975) |',
  '| 合成 | Δθ_i = (s_i + ω_drag,i) dt(表示の角 `rotA`) | 「慣性回転」と「引きずり回転」の合成 | トルクの式の自転速度 ω_T((S1) 前の步の合成) |',
  '| 直交する成分 | 軸の向きを回す(歳差を宣言した受け手は数えるだけ) | ジャイロトルク | Ω⊥(軸が動かなかった分の率 P) |',
  '| エネルギーの行き先 | 当たらない(アプリは慣性軸回転 s を引きずりで変えない) | 内部熱か慣性回転(補足 1)・引きずり回転(回答 9)・それぞれの比較(補足 2) | (E1)(E2)(E3) × 行き先 2 列(表 13) |'].join('\n');
/** 表 5 〔第347便h〕の閉じた形のノブと geoPN=3 の量の対応 */
export const KNOB_TABLE = ['| 〔第347便h〕の量(引きずり近似の形) | geoPN=3 の場で当たる量 | 当たらない所 |', '|---|---|---|',
  '| D₀(分母の定数) | A = W₀ + W_ii(中心)+ 他の源の重み(中心で勾配の無い分) | 自分の重みは受け手の中で位置に依る(中心 3m/(2R_i)・表面 m/R_i —— (P2) の腕の点では表面の値) |',
  '| 重みのべき p | 核の次数(K1 は外部 1/r —— p 1 に当たる・K2 は遠方 1/r² —— p 2 に当たる) | 球の内部の形(源と受け手の体積平均) |',
  '| 引きずり減衰 q | 源の回転の分の落ち方(球のモーメント M1 ÷ (r K1) = (R/r)²/5 —— q 2 の遠方の形 (R/r)² の 1/5 倍) | 係数 1/5・半径 R が規則の半径 Y_k m(観測半径ではない) |',
  '| c_j = v_j + ω_j × (x − p_j)(絶対の速度) | V_j − v_i(相対速度) | 受け手の速度を引く(〔第347便h〕の場は引かない) |',
  '| 通過の (W) の閉じた形 Ω_z = ½ h′(d) b v ÷ d・h = w ÷ (D₀ + w) | Ω = ½ A ∇W_j × c ÷ (A + W_j)²(h = W_j ÷ (A + W_j) —— 同じ形で D₀ → A) | A に自分の重みが入るので、源 1 つでも A > 0 |',
  '| 引きずり回転の計上 (L1)・(L2) | 〔第348便b〕の (S1)・(S2′) と同じ帳簿(Ω∥ を毎ステップ作り直す) | — |'].join('\n');

export function tablesOf(J) {
  const T = {}, S = J.pure.scenes, G = J.pure.gates;
  T.pure = ['| 零試験・場面 | 値 | 門 |', '|---|---|---|',
    `| ① 静止・自転しない源(相対速度 0)で回転 0(背景・自分の重みの有無 3 通りの (W)・(P2) の最大) | ${fe(S.z1)} | ${tf(G.staticZero)} |`,
    `| ② 源 1 つ・自転しない・背景 0・自分の重み 0 で回転 0(u は一様な相対速度) | ${fe(S.z2)} | ${tf(G.uniformZero)} |`,
    `| ③ 自分の重み 0・W₀ = D₀・点の冪 p・源の回転 (R/(R + d))^q・受け手の速度 0 で〔第347便h〕の場に一致(u・J・(W)・(P2) の相対の差の最大 —— 4 組) | ${fe(S.h3)} | ${tf(G.vsH)} |`,
    `| ④ ガリレイの変換(源と受け手に同じ速度を足す): geoPN=3 の (W) の相対の変わり/〔第347便h〕の場(D₀ 0.2)/変異(受け手の速度を引かない) | ${fe(S.galil.geo3)}/${fe(S.galil.geo2)}/${fe(S.galil.mut)} | ${tf(G.galilei)} |`,
    `| ⑤ 自転しない源の (W) と閉じた形 ½ A ∇W_j × c ÷ (A + W_j)² の相対の差(A 3 通り) | ${fe(S.c5)} | ${tf(G.closedTrans)} |`,
    `| ⑥ (P2) の腕 ≪ 距離の極限(自分の重みは腕の点の値)と有限の腕の相対の差(腕 ÷ 距離 1e-3・1e-4) | ${fe(S.p6[0])}・${fe(S.p6[1])} | ${tf(G.p2limit)} |`,
    `| ⑦ 核の式(K1 の内部・外部・中心 3m/(2R))と R_d ÷ r_s = 5 ÷ C₁ | ${fe(S.k7)} | ${tf(G.kernel)} |`,
    `| ⑧ 行き先を慣性回転だけにすると〔第348便b〕表 4 の行に一致/〔第348便b〕の天体の行を同じ式で作り直した相対の差 | ${fe(S.b8)}/${fe(S.b8b)} | ${tf(G.vsB)} |`,
    `| ⑨ 変異: 源の回転の符号を逆にすると (W) が反転/自分の重みを分母から落とすと変わる | ${tf(S.mut9.rotSign)}/${tf(S.mut9.noSelf)} | ${tf(G.mutants)} |`,
    `| ⑩ 入力の拒否(負の質量・核 α 3・源の回転の形・点の核の球のモーメント・負の W₀・候補の名) | ${S.rejects.filter(Boolean).length}/${S.rejects.length} | ${tf(G.rejects)} |`].join('\n');
  T.dim = ['| 自分の重み A | W₀ | 源の回転の形 | 緯度 | 自転する源 (W) の ∥ | 自転する源 (P2) の ∥ | 通過 (W) の大きさ | 通過 (P2) の大きさ | 重みの割合 W_j ÷ W |', '|---|---|---|---|---|---|---|---|---|',
    ...J.dim.filter((r) => r.d === 10).map((r) => `| ${r.selfA} | ${r.W0} | ${ROT(r.q)} | ${r.lat} | ${fe(r.spinW)} | ${fe(r.spinP2)} | ${fe(r.transW)} | ${fe(r.transP2)} | ${fe(r.beta)} |`)].join('\n');
  T.body = ['| 天体 | 源 | 候補 | β_S | β_G | abs(Ω_S) [rad/年] | Ω_S と公転の軸の角 | abs(Ω_G) [rad/年] | 母天体: β_P・abs(Ω_P) | W1: δ・歳差の率 [″/年] | W2: δ | W1 + 母天体: δ・歳差の率 | 比べる列 [″/年](文献の値・未照合) | 比 |', '|---|---|---|---|---|---|---|---|---|---|---|---|---|---|',
    ...J.body.filter((r) => r.combo === 'K1rM').map((r) => `| ${pairName(r)} | ${CAND[r.cand]} | ${fe(r.betaS)} | ${fe(r.betaG)} | ${fe(r.S.magYr)} | ${f2(r.S.toOrbNDeg)} | ${fe(r.G.magYr)} | ${r.P ? fe(r.betaP) + '・' + fe(r.P.magYr) : '—'} | ${f2(r.W1.deltaDeg)}・${fe(r.W1.precAsYr)} | ${f2(r.W2.deltaDeg)} | ${r.W1P ? f2(r.W1P.deltaDeg) + '・' + fe(r.W1P.precAsYr) : '—'} | ${r.obsAsYr === null ? '—' : r.obsAsYr} | ${fe(r.W1.ratio)} |`)].join('\n');
  T.combo = ['| 場の組 | 天体 | 源 | 候補 | β_S | abs(Ω_S) [rad/年] | Ω_S と公転の軸の角 | W1: δ・歳差の率 [″/年] | W1 + 母天体: 歳差の率 | 比べる列との比 |', '|---|---|---|---|---|---|---|---|---|---|',
    ...J.body.filter((r) => ['Earth', 'Jupiter', 'Moon', 'Io'].includes(r.id) && ['Sun', 'EarthHi', 'Jupiter'].includes(r.src) && !(r.id === 'Io' && r.src === 'Sun') && !(r.id === 'Moon' && r.src === 'Sun')).map((r) =>
      `| ${COMBO[r.combo]} | ${pairName(r)} | ${CAND[r.cand]} | ${fe(r.betaS)} | ${fe(r.S.magYr)} | ${f2(r.S.toOrbNDeg)} | ${f2(r.W1.deltaDeg)}・${fe(r.W1.precAsYr)} | ${r.W1P ? fe(r.W1P.precAsYr) : '—'} | ${fe(r.W1.ratio)} |`)].join('\n');
  T.vsQ = ['| 場の組 | 天体 | 源 | geoPN=3: W1 の大きさ [rad/年]・δ | q 0: 大きさ・δ | q 2: 大きさ・δ | q 3: 大きさ・δ | 大きさで並べた位置(q 2 と q 3 の対数の内挿) | q 0・2・3 のどれよりも小さい |', '|---|---|---|---|---|---|---|---|---|',
    ...J.vsQ.filter((r) => r.cand === 'W').map((r) => `| ${COMBO[r.combo]} | ${pairName(r)} | ${fe(r.geo3.magYr)}・${f2(r.geo3.deltaDeg)} | ${fe(r.q0.magYr)}・${f2(r.q0.deltaDeg)} | ${fe(r.q2.magYr)}・${f2(r.q2.deltaDeg)} | ${fe(r.q3.magYr)}・${f2(r.q3.deltaDeg)} | ${f2(r.qEq)} | ${tf(r.below)} |`)].join('\n');
  T.cR = ['| 天体 | 源 | 候補 | 規則の半径 ÷ 観測半径 | 規則の半径の W1 の大きさ [rad/年] | c_R 0.5・1・2 の大きさ | 局所の冪(規則 → 0.5) | 局所の冪(0.5 → 2) | 自分の重みと他の源の重みが等しくなる c_R |', '|---|---|---|---|---|---|---|---|---|',
    ...J.cR.map((r) => `| ${pairName(r)} | ${CAND[r.cand]} | ${fe(r.ruleRiOverRobs)} | ${fe(r.ruleMagYr)} | ${Object.values(r.swept).map(fe).join('・')} | ${f3(r.slopeRule)} | ${f3(r.slope)} | ${fe(r.cRstar)} |`)].join('\n');
  T.w0 = ['| 天体 | 源 | 候補 | W₀ 1 倍の W1 の大きさ ÷ W₀ 0 | 向きの違い [deg] |', '|---|---|---|---|---|',
    ...J.w0.map((r) => `| ${pairName(r)} | ${CAND[r.cand]} | ${f3(r.ratio)} | ${fe(r.dAngDeg)} |`)].join('\n');
  T.dest = ['| 例 | 型と行き先 | 行き先 | ω(T) ÷ ω_慣性(0) | ω_慣性(T) ÷ ω_慣性(0) | ω_引きずり(T) | トルクの比 | 自転 | 熱 ÷ 仕事 | 場へ返した分 ÷ 仕事 | 場との交換 ÷ 仕事 |', '|---|---|---|---|---|---|---|---|---|---|---|',
    ...J.dest.map((r) => `| ${r.ex} | ${KIND[r.type + r.col]} | ${DEST[r.dest]} | ${f3(r.wRatio)} | ${f3(r.wiRatio)} | ${f3(r.wdEnd)} | ${fe(r.torqueRatio)} | ${JUDGE[r.wJudge]} | ${f3(r.heatOverWork)} | ${f3(r.givenOverWork)} | ${f3(r.fieldXOverWork)} |`)].join('\n');
  T.bodyE = ['| 天体 | 源 | Ω∥ [rad/s] | Ω⊥ [rad/s] | 角 θ | 引きずり回転 ÷ ω | 慣性回転へ: 自転の増え方 [1/年](4 つの型と行き先) | 引きずり回転へ: (S1)(E1)・(S1)(E3) | 引きずり回転へ: (S1)(E2)・(S2′)(E2) | (Tc) の総量 ÷ ω: 慣性回転へ (S1)・(S2′) | (Tc) の総量 ÷ ω: 引きずり回転へ (S1)(E1) | 引きずり回転へ (S1)(E3) の熱 [W] | 物差しの熱 [W] | 観測の自転の変化の率 [1/年] |', '|---|---|---|---|---|---|---|---|---|---|---|---|---|---|',
    ...J.bodyE.map((r) => { const c = r.cols;
      return `| ${NM[r.id]} | ${NM[r.src]} | ${fe(r.Wpar)} | ${fe(r.Wperp)} | ${f2(r.thetaDeg)} | ${fe(r.dragOverW)} | ${fe(c['S1E1|inertial'].rateYr)} | ${fe(c['S1E1|drag'].rateYr)}・${fe(c['S1E3|drag'].rateYr)} | ${fe(c['S1E2|drag'].rateYr)}・${fe(c['S2pE2|drag'].rateYr)} | ${fe(c['S1E1|inertial'].tcTotal)}・${fe(c['S2pE2|inertial'].tcTotal)} | ${fe(c['S1E1|drag'].tcTotal)} | ${fe(c['S1E3|drag'].heatW)} | ${fe(r.heatRuler)} | ${fe(r.obsRateYr)} |`; })].join('\n');
  return T;
}
/** 数の文(節に逐語) */
export function factsOf(J) {
  const F = {}, b = (id, src, cand, combo = 'K1rM') => J.body.find((r) => r.combo === combo && r.id === id && r.src === src && r.cand === cand);
  const e = b('Earth', 'Sun', 'W'), eQ = b('Earth', 'Sun', 'W', 'K1rQ0'), eC = b('Earth', 'Sun', 'W', 'K1cM'), eK = b('Earth', 'Sun', 'W', 'K2capM');
  F.earth = `主の場の組 (g3-1) の地球(太陽由来・(W))は β_S = ${fe(e.betaS)}・abs(Ω_S) = ${fe(e.S.magYr)} rad/年・Ω_S と公転の軸の角 ${f2(e.S.toOrbNDeg)}°・δ ${f2(e.W1.deltaDeg)}°・歳差の率 ${fe(e.W1.precAsYr)}″/年(比べる列との比 ${fe(e.W1.ratio)})`;
  F.combos = `地球の歳差の率の比べる列との比は (g3-2) ${fe(eQ.W1.ratio)}・(g3-3) ${fe(eC.W1.ratio)}・(g3-4) ${fe(eK.W1.ratio)}`;
  const nB = J.vsQ.filter((r) => r.combo === 'K1rM' && r.cand === 'W' && r.below).length, qs = J.vsQ.filter((r) => r.combo === 'K1rM' && r.cand === 'W').map((r) => r.qEq);
  F.vsQ = `主の場の組の (W) の大きさは 15 組のうち ${nB} 組で q 0・2・3 のどれよりも小さく、大きさで並べた位置は q ${f2(Math.min(...qs))}〜${f2(Math.max(...qs))}`;
  const cr = J.cR.filter((r) => r.cand === 'W');
  F.cR = `c_R を自分の重みと腕に通した局所の冪は、規則の半径から c_R 0.5 までで ${f3(Math.min(...cr.map((r) => r.slopeRule)))}〜${f3(Math.max(...cr.map((r) => r.slopeRule)))}、c_R 0.5 から 2 までで ${f3(Math.min(...cr.map((r) => r.slope)))}〜${f3(Math.max(...cr.map((r) => r.slope)))}((W))`;
  F.w0 = `背景 W₀ を自分の重みの中心の値と同じにすると W1 の大きさは (W) で ${f3(J.w0.find((r) => r.cand === 'W').ratio)} 倍・(P2) で ${f3(J.w0.find((r) => r.cand === 'P2').ratio)} 倍(地球)・向きの違いは最大 ${fe(Math.max(...J.w0.map((r) => r.dAngDeg)))}°`;
  F.theta = `例 geo3 の θ₀ = ${f2(J.theta3Deg)}°(主の場の組の地球の行の δ)`;
  F.yk = `Y_k = ${fe(J.yk)} m/kg・銀河の質量の宣言 ${fe(J.galMass)} kg`;
  return F;
}
