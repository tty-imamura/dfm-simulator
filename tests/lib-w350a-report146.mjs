// 第350便a(原仮定者の整理(2026-11-23 —— 第146報)・原仮定者の回答(2026-11-23 —— 第146報)・統括の検証項目 R418):
// **第146報の文書の lib —— 原文の文と当たり所の表・新しい句 6 つの表・訂正の鎖・用語「背景軸引きずり」「球体に換算」の定義の文と、
// QA docs.report146_350a・lint.bgAxialTerm350a の照合の関数**(純関数 —— ファイルを読まない。QA が文書の文字列を渡す)。
// 原文は言葉を変えずに引く。「統括の読み」の欄は統括の読みで、原文ではない(読みは 1 つに決めない —— 本便のどの枝が数えるか)。
// 器・正本・段は無い(文書の便の枝)。
export const LIB_VERSION = 'w350a-report146-lib-1';

export const SRC_ORG = '原仮定者の整理(2026-11-23 —— 第146報)';
export const SRC_DEC = '原仮定者の回答(2026-11-23 —— 第146報)';
export const SRC = Object.freeze({
  sup1: '原仮定者の指示(2026-11-22 —— 第145報の補足 1)',
  ans8: '原仮定者の回答(2026-11-22 —— 第145報の回答 8)',
  ans9: '原仮定者の回答(2026-11-22 —— 第145報の回答 9)',
  ans10: '原仮定者の回答(2026-11-23 —— 第145報の回答 10)',
  sup138: '原仮定者の補足(2026-11-14 —— 第138報の補足 3)',
});

// ---- 原文(第146報の「過去のまとめの整理」の 5 つの題の箇条 15 行と、決断の 2 行 —— 言葉を変えずに)
const T_DISK = '円盤引きずりについて', T_AXIS = '軸引きずりについて', T_GYRO = 'ジャイロトルクについて', T_PLAN = '軸引きずり案', T_SUPP = '軸引きずりの補足', T_DEC = '決断事項';
const S = Object.freeze({
  d1: '「回転引きずり」の呼び名を「円盤引きずり」に変えた。理由は、並進引きずりや軸引きずりにも回転要素が有り、紛らわしい為。引きずりの形が円盤状に現れる',
  d2: '円盤引きずりの検証結果は、saturnRotVertExplore3d',
  a1: '軸引きずりは、円盤引きずりにも影響するので、様々な可能性から最適を探す',
  a2: '並進引きずりは移動と回転を含み、並進引きずりで引きずられる側の、部位差分による回転が軸引きずりである。軸引きずりは、源の回転の赤道面方向で強く現れるが、源が無回転で横を通り過ぎても並進引きずりと共に発生する',
  g1: '引きずりは、相対的な座標の時間差分に由来する座標変換である。座標変換は熱を生まない。ただし、座標の変化で潮汐力が発生すると、熱や潮汐ロックが生じる。同様に、ジャイロトルクも、熱や自転を生じる経路になる',
  p1: '下記の案も検証する。対象の組は、慣性決定力のgeoPN=3',
  p2: '軸引きずりの回転は、引きずられる側の、源に近い点と遠い点の並進引きずりから、球体に換算して計算する',
  p3: '自転速度は、「慣性回転」と「引きずり回転」の合成である',
  p4: '引きずられる側の自転軸と平行な回転成分は、自転の「引きずり回転」に計上する',
  p5: '引きずられる側の自転軸に直交する回転成分を、ジャイロトルクの計算に使用する。「トルク=慣性モーメント*自転速度*直交する回転成分」が、自転方向に90度ズレた力で現れる。結果的に自転軸を軸引きずりの回転軸に向けて起こす力になる。継続した自転軸を起こす力が歳差運動になる',
  p6: '軸が動かなかった分のエネルギーは消えない。エネルギーの行き先は、内部熱か、自転の「慣性回転」。自転速度が増すと、軸を起こす為のトルクが増して釣り合う。行き先を「引きずり回転」とする比較も行う',
  s1: '軸引きずりのトルクの式の自転速度は、前回ステップの慣性回転と引きずり回転の合成。ただし、引きずり回転は差分由来なので毎回リセットする。これは、並進引きずりの式での、「前回ステップの慣性と引きずりの合成として、その前のステップとの差分を使用し、差分由来の引きずりは毎回リセットする」と同様',
  s2: '太陽系サンプルでは、銀河由来の軸引きずりは、背景軸引きずりとして扱う',
  s3: '安定している天体の運行は、結果として釣り合っている。釣り合う軸の向きは、銀河由来と太陽由来の軸引きずりを重みで合成した方向。その方向と観測の向きが違う場合は、その方向を軸に歳差運動が現れる',
  s4: '天体の構造別に軸引きずりの利き方に差異が予想され、観測半径に対する引きずられ半径の係数がノブの候補。構造別の参考値を用意しつつ、天体の構造を分析する為に、個別にフィットする',
  n1: 'AN987: Aで進める',
  n2: '続けて第350便も進める',
});
export const ORIGINAL146 = S;

// ---- これまでの文(公開の節に在る原文 —— 言葉を変えずに)
const O = Object.freeze({
  bg138: '太陽系に対する銀河の軸引きずりが、『背景軸引きずり』である。『背景慣性決定力』に含まれる',
  sup1_p2: '軸引きずりの回転は、引きずられる側の、源に近い点と遠い点の並進引きずりから計算する',
  sup1_e: 'エネルギーの行き先は、内部熱か、自転の「慣性回転」。自転速度が増すと、慣性モーメントが増して、トルクが増す',
  ans8: 'AN969: R1で進める。「自転速度が増すと、角運動量が増して、トルクが増す」に修正',
  ans9: 'AN969: ２つのケースを検証する。１つ目は、『エネルギーの行き先は、自転の「引きずり回転」』。２つ目は、『自転速度が増すと、角運動量が増して、トルクが増し、傾きにくくなり釣り合う』',
  an975: 'AN975: トルクの式の自転速度は、前回ステップの慣性回転と引きずり回転の合成。ただし、引きずり回転は、毎回リセットする。これは、並進引きずりの式での、「前回ステップの慣性と引きずりの合成として、その前のステップとの差分を使用し、引きずりは毎回リセットする」と同様',
  an976: 'AN976: 安定している運行は、結果として釣り合っている。釣り合う向きは、銀河由来と太陽由来の軸引きずりを重みで合成した方向。その方向と観測の向きが違う場合は、ジャイロトルクで釣り合いつつ歳差運動をしている。天体の構造別に軸引きずりの利き方に差異が予想され、観測半径に対する引きずられ半径の係数がノブの候補',
});
export const EARLIER = O;

/** 表 1 —— [番号, 題, 出どころ, 原文, 統括の読み, 当たり所, 当たり所に必ず在る語] */
export const TABLE1 = Object.freeze([
  ['1', T_DISK, SRC_ORG, S.d1, '第145報の回答 3 の文(呼び名を変える・理由・形)を、済んだこととして書いた文。変えたのは呼び名だけ(式・ノブ・既定値・本の宣言の値は変えていない)', '〔第346便b〕(呼び名の変更)・冒頭の用語の段(第346便b)・`lint.diskDragName346b`・`docs.diskDragName346b`', ['〔第346便b〕', 'lint.diskDragName346b']],
  ['2', T_DISK, SRC_ORG, S.d2, '円盤引きずりの側の検証の物差しは 🛟 の本(既定 OFF の探索用の鍵の本・未較正)。本と鍵は変えない(読むだけ)', '🛟 `saturnRotVertExplore3d`(〔第339便a〕・第339便の統括の節・鍵 `physics.rotDragVert`・正本 `tests/out/rotvert-w339a.json`・`behavior.rotvert339a`・`docs.rotvert339a`)・本便の枝 g(傾きの比と並べる)', ['〔第339便a〕', 'physics.rotDragVert', 'rotvert-w339a.json', '本便の枝 g']],
  ['3', T_AXIS, SRC_ORG, S.a1, '補足 1 の 1 行目と同じ字。軸引きずりの型を 1 つに決め打ちせず、円盤引きずりの側の見え方と並べる', '〔第347便h〕表 1 の 1・〔第348便d〕・〔第348便i〕・本便の枝 g', ['〔第347便h〕', '〔第348便i〕', '本便の枝 g']],
  ['4', T_AXIS, SRC_ORG, S.a2, '補足 1 の 2 行目と字が 2 か所違う(「並進引きずりの引きずられる側の部位差分」→「並進引きずりで引きずられる側の、部位差分」)。統括は同じ定義の言い換えと読む', '〔第347便h〕表 1 の 2・〔第348便h〕(geoPN=3 の場の自転しない源の通過)・本便の枝 b(自転しない源の通過・回転する源)', ['〔第347便h〕', '〔第348便h〕', '本便の枝 b']],
  ['5', T_GYRO, SRC_ORG, S.g1, '第141報の補足「引きずり自体は、座標変換なので熱を発生しない」と同じ向き。新しい語は「相対的な座標の時間差分に由来する」・潮汐ロック・「熱や自転を生じる経路」', '〔第341便a〕表 2(第141報の補足)・〔第347便i〕(行き先 3 列)・本便の枝 d(内部熱・慣性回転・供給の仕事を熱と別に記録)', ['〔第341便a〕', '本便の枝 d']],
  ['6', T_PLAN, SRC_ORG, S.p1, '補足 1 の「下記の案も検証する」に、補足 2 の対象(geoPN=3)を付けた文', '〔第348便h〕・〔第348便i〕(geoPN=3 の場 —— `tests/lib-w348h-axisgeo3.mjs` の `makeField3`)・本便の枝 b〜g', ['〔第348便h〕', 'makeField3', '本便の枝 b〜g']],
  ['7', T_PLAN, SRC_ORG, S.p2, '補足 1 の文に「球体に換算して」が付いた(表 2 の句 1)。換算の読みは 3 列 (C1)(C2)(C3)(本節の ②)', '〔第347便h〕の候補 (P2)・〔第348便h〕・本便の枝 b', ['〔第347便h〕', '本便の枝 b']],
  ['8', T_PLAN, SRC_ORG, S.p3, '補足 1 と同じ字。自転 = 慣性回転 + 引きずり回転の帳簿', '〔第347便h〕表 11・〔第348便h〕表 4・本便の枝 c', ['〔第347便h〕', '本便の枝 c']],
  ['9', T_PLAN, SRC_ORG, S.p4, '補足 1 と同じ字。平行成分 Ω∥ = そのステップの引きずり回転(状態に積まない)', '〔第347便h〕・〔第348便b〕・本便の枝 c', ['〔第348便b〕', '本便の枝 c']],
  ['10', T_PLAN, SRC_ORG, S.p5, '補足 1 と同じ字。トルクの大きさの案 = 慣性モーメント × 自転速度 × 直交成分 Ω⊥。向きの読みは 4 列(歳差の向き 2 つ・起こす向き 2 つ)', '〔第347便h〕表 13・本便の枝 c', ['〔第347便h〕', '本便の枝 c']],
  ['11', T_PLAN, SRC_ORG, S.p6, '補足 1 の 8 行目・9 行目と回答 9 の 1 つ目のケースを 1 つにまとめ、最後の文を「軸を起こす為のトルクが増して釣り合う」にした文(表 2 の句 2・表 3 の訂正の鎖)', '〔第347便h〕・〔第347便i〕・〔第348便h〕表 13・表 14・本便の枝 d', ['〔第347便i〕', '本便の枝 d']],
  ['12', T_SUPP, SRC_ORG, S.s1, '回答 10 の AN975 に「軸引きずりの」と、理由の語「差分由来なので」「差分由来の」が付いた(表 2 の句 3)', '〔第348便b〕・本便の枝 c', ['〔第348便b〕', '本便の枝 c']],
  ['13', T_SUPP, SRC_ORG, S.s2, '太陽系の本での扱いの指示(表 2 の句 4)。語「背景軸引きずり」は第138報の補足 3 から在る(当時の定義は「『背景慣性決定力』に含まれる」)', '計算式の一覧の用語「背景軸引きずり」・EQ-17(銀河の一様軸引きずり —— 鍵 `physics.relativeDrag.galaxyAxial`)・〔第317便c〕・〔第337便a〕⑤‴・本節の ②・〔第348便c〕・〔第348便h〕(由来ごとの回転と重みの型)・本便の枝 e', ['EQ-17', 'physics.relativeDrag.galaxyAxial', '〔第337便a〕', '本節の ②', '本便の枝 e']],
  ['14', T_SUPP, SRC_ORG, S.s3, '回答 10 の AN976 の前半の言い換え(「運行」→「天体の運行」・「釣り合う向き」→「釣り合う軸の向き」)と、最後の句の書き直し(表 2 の句 5)', '〔第348便c〕・〔第348便h〕・本便の枝 e', ['〔第348便c〕', '本便の枝 e']],
  ['15', T_SUPP, SRC_ORG, S.s4, '回答 10 の AN976 の最後の文と同じ字に、1 文が付いた(表 2 の句 6)', '〔第348便c〕(係数 c_R)・〔第348便h〕・本便の枝 f', ['〔第348便c〕', '本便の枝 f']],
  ['決 1', T_DEC, SRC_DEC, S.n1, '公開版 v1.47.0 の昇格を進める', '第349便(公開版 v1.47.0 の昇格 —— CHANGELOG の v1.47.0 の節)', ['第349便', 'v1.47.0']],
  ['決 2', T_DEC, SRC_DEC, S.n2, '物理の便(geoPN=3 の軸引きずりの案を診断の器で数える)を続ける', '本便(本節と〔第350便b〕〜〔第350便i〕)', ['本便', '〔第350便b〕']],
].map((r) => Object.freeze(r)));

/** 表 2 —— 新しい句 6 つ: [句, 新しい語, 第146報の文, これまでの文の [出どころ, 原文] の列, 前置き, 統括の読み, 数える枝] */
export const TABLE2 = Object.freeze([
  ['句 1', '球体に換算して', S.p2, [[SRC.sup1, O.sup1_p2]], '', '2 点の差分を球の回転へ換える読みを 3 列 —— (C1) 2 点の差分をそのまま球の回転の率に(= (P2))・(C2) 球全体の剛体回転への平均(一次の場では (W) と同じ数)・(C3) 係数 k ×(P2)(k = 1・2/5・1/2 のノブ)。どれかに決めない', '本便の枝 b'],
  ['句 2', '軸を起こす為のトルクが増して釣り合う', S.p6, [[SRC.sup1, O.sup1_e], [SRC.ans8, O.ans8], [SRC.ans9, O.ans9]], '', '増えるトルクを「軸を起こす為のトルク」と名指した。釣り合いの形(起こすトルクと駆動のトルクの釣り合い・傾きにくくなる形)は 1 つに決めない —— 釣り合い方の 2 列(表 3 の訂正の鎖)', '本便の枝 d'],
  ['句 3', '差分由来なので', S.s1, [[SRC.ans10, O.an975]], '', '引きずり回転を毎ステップ作り直す理由が「差分由来」と書かれた(並進引きずりの毎ステップのリセットと同じ理由)。步の形 (S1) と前回末の保存の列で数える', '本便の枝 c'],
  ['句 4', '太陽系サンプルでは', S.s2, [[SRC.sup138, O.bg138], [SRC.ans10, O.an976]], '語「背景軸引きずり」は当時から在る(新しいのは太陽系の本での扱いの指示): ', '太陽系の本では、銀河由来の軸引きずりを背景の量(背景軸引きずり)として与える。当時の文は「背景慣性決定力」に含まれる、と書く —— 並進の背景(背景の決定力・重み W₀)との関係は (B1) 含まれる・(B2) 別の量の 2 つの読みを並べる(本節の ②)。値・向き・与え方は決めない', '本便の枝 e'],
  ['句 5', 'その方向を軸に歳差運動が現れる', S.s3, [[SRC.ans10, O.an976]], '', '歳差の軸を「釣り合う軸の向き(重みつきの合成の方向)」と名指した。回答 10 の「ジャイロトルクで釣り合いつつ歳差運動をしている」と並べる(当時の文は〔第348便a〕表 1 に残す)', '本便の枝 e'],
  ['句 6', '個別にフィットする', S.s4, [[SRC.ans10, O.an976]], '', '係数 c_R(引きずられ半径 ÷ 観測半径)に、構造別の参考値の列と、天体ごとの当てはめの診断の列を並べる(当てはめの診断は列の名 —— 結果の語ではない)', '本便の枝 f'],
].map((r) => Object.freeze(r)));

/** 表 3 —— 訂正の鎖(自転速度が増すと): [順, 出どころ, 原文, 当時の文の所, 今の扱い, 当時の文が残るはずの節] */
export const CHAIN = Object.freeze([
  ['1', SRC.sup1, '自転速度が増すと、慣性モーメントが増して、トルクが増す', '〔第347便h〕表 1 の 9・〔第347便i〕表 1 の 2', '当時の文として残す(過去の節の文は変えていない)', ['〔第347便h — ', '〔第347便i — ']],
  ['2', SRC.ans8, O.ans8, '〔第347便h〕⑩(訂正と決定)・〔第347便i〕表 1 の 3', '当時の文として残す(過去の節の文は変えていない)', ['〔第347便h — ', '〔第347便i — ']],
  ['3', SRC.ans9, '自転速度が増すと、角運動量が増して、トルクが増し、傾きにくくなり釣り合う', '〔第347便i〕表 1 の 4・〔第348便h〕表 1 の 6', '当時の文として残す(過去の節の文は変えていない)', ['〔第347便i — ', '〔第348便h — ']],
  ['4', SRC_ORG, '自転速度が増すと、軸を起こす為のトルクが増して釣り合う', '本節の表 1 の 11', '今の文(読みは決めない —— 本便の枝 d)', []],
].map((r) => Object.freeze(r)));

// ---- 用語の段の定義の文(lint.bgAxialTerm350a が逐語で見る)
export const DEF_BG = '**背景軸引きずり** = 太陽系に対する銀河の軸引きずり(' + SRC.sup138 + '「' + O.bg138 + '」の語 —— 〔第337便a〕⑤‴・計算式の一覧の用語・EQ-17 の銀河の一様軸引きずり)。' + SRC_ORG + 'で、太陽系の本では銀河由来の軸引きずりをこの量として扱う、と書かれた(「' + S.s2 + '」)';
export const BG_READINGS = '並進の背景(背景の決定力・重み W₀)との関係は 2 つの読みを並べる —— (B1) 背景慣性決定力に含まれる(当時の文のまま —— 〔第337便a〕⑤‴ は補う重みを W₀ そのものとし、各天体に (背景の取り分 1 − f) × ω_bg で及ぶ形に置いた)/(B2) 並進の背景の重み W₀ とは別の量として、回転の向きと率を与える(第350便の統括の読み)。どちらかに決めない'
export const DEF_SPHERE = '**球体に換算** = 受け手の源に近い点と遠い点の並進引きずりの差分(2 点)から、受け手の球全体の回転を作ること(' + SRC_ORG + 'の語)。読みは 3 つ —— (C1) 2 点の差分をそのまま球の回転の率に(= (P2))・(C2) 球全体の剛体回転への平均(一次の場では (W) と同じ数)・(C3) 係数 k ×(P2)(k = 1・2/5・1/2 のノブ)。読みは決めない(本便の枝 b)';
export const EQ_TERM = '**背景軸引きずり**: 太陽系に対する銀河の軸引きずり —— 背景慣性決定力に含まれる';
export const ORIGIN_DISK = '「円盤引きずり」の由来の文「引きずりの形が円盤状に現れる」は、〔第346便b〕の ① の原文(第145報の回答 3)と冒頭の用語の段(第346便b)に在る';
export const ORIGIN_SAT = '「円盤引きずりの検証結果は、saturnRotVertExplore3d」の当たり所は〔第339便a〕の 🛟 の本(既定 OFF の探索用の鍵 `physics.rotDragVert`・正本 `tests/out/rotvert-w339a.json`)と〔第346便b〕の呼び名の節';

// ---- 書かない語(外部の名・private の文書の名 —— 本文に綴りを置かないよう反転で持つ)
const rv = (x) => x.split('').reverse().join('');
export const EXT_NAMES = Object.freeze(['付添', '信私', '査審', '討検の部外', '討検の外', 'TPGtahC', 'korG', 'inimeG', 'edualC'].map(rv));
export const PRIVATE_NAMES = Object.freeze(['NEPO_SNOISICED', 'ffodnah_pamdaor', 'scisyhPlacitehtopyH', 'etavirp-rotalumis-mfd', 'TSEGID_SNOITAREPO', 'XEDNI_SEVITCERID', 'stnemhcatta', 'MFD_inimeG', 'MFD_korG', 'MFD_TPGtahC'].map(rv));
export const PRIVATE_RE = /REPORT\d+_(?:original|answer|supplement)/;
export const PAST = Object.freeze(['確認した', '確かめた', '示した', '説明した', '説明できた', '解決した', '同定した', '再現した', '収束した', 'フィットした', '較正した', '合った', '導けた', '決まった', '完全に一致', '普遍定数']);
export const NOT146 = Object.freeze([/読みを\s?1\s?つに決めた/, /型が決まった/, /背景軸引きずりの値が決まった/, /球体換算の読みを決めた/]);

// ---- 文字列の道具
export const cells = (l) => l.split(' | ').map((c) => c.replace(/^\| ?/, '').replace(/ ?\|$/, ''));
export const tabIn = (text, h) => { const L = String(text || '').split('\n'), k = L.findIndex((x) => x.startsWith(h)); if (k < 0) return []; const out = []; for (let n = k + 1; n < L.length; n++) { if (L[n].startsWith('|')) out.push(L[n]); else if (out.length) break; } return out.slice(2); };
export const physSecOf = (ph, head) => { const i = String(ph || '').indexOf('\n' + head); if (i < 0) return ''; const m = /\n〔第\d+便[a-z]* — |\n〔第\d+便 — |\n## /g; m.lastIndex = i + 2; const z = m.exec(ph); return ph.slice(i + 1, z ? z.index : ph.length); };
export const para = (sec, head) => { const i = sec.indexOf(head); if (i < 0) return ''; const z = sec.indexOf('\n\n', i); return sec.slice(i, z < 0 ? sec.length : z); };
/** 「…」の中を除いた文字列(入れ子の「」も外側ごと除く) */
export const outsideQuotes = (t) => { let d = 0, o = ''; for (const ch of String(t || '')) { if (ch === '「') { d++; continue; } if (ch === '」') { if (d > 0) d--; continue; } if (d === 0) o += ch; } return o; };
const strip = (t) => outsideQuotes(t).replace(/『[^』]*』/g, '').replace(/[^。\n]*とは書かない[^。\n]*。/g, '').replace(/[^。\n]*とは言わない[^。\n]*。/g, '');
const q = (x) => '「' + x + '」';

// ---- 表の markdown(本節の表はこの関数の出力と逐語で同じ)
export function table1Md() {
  const L = ['| # | 題 | 出どころ | 原文(言葉を変えずに引く) | 統括の読み(原文と分ける) | 当たり所(節・鍵・本) |', '|---|---|---|---|---|---|'];
  for (const r of TABLE1) L.push(`| ${r[0]} | ${r[1]} | ${r[2]} | ${q(r[3])} | ${r[4]} | ${r[5]} |`);
  return L.join('\n');
}
export function table2Md() {
  const L = ['| 句 | 新しい語 | 第146報の文(' + SRC_ORG + ') | これまでの文(出どころと原文) | 統括の読み(型は決めない) | 数える枝 |', '|---|---|---|---|---|---|'];
  for (const r of TABLE2) L.push(`| ${r[0]} | ${q(r[1])} | ${q(r[2])} | ${r[4]}${r[3].map(([s, t]) => s + ' ' + q(t)).join(' → ')} | ${r[5]} | ${r[6]} |`);
  return L.join('\n');
}
export function table3Md() {
  const L = ['| 順 | 出どころ | 原文(言葉を変えずに引く) | 当時の文の所 | 今の扱い |', '|---|---|---|---|---|'];
  for (const r of CHAIN) L.push(`| ${r[0]} | ${r[1]} | ${q(r[2])} | ${r[3]} | ${r[4]} |`);
  return L.join('\n');
}

// ---- docs.report146_350a の照合(ph = PHYSICS・as = AI_SPEC・pm = post-merge)
export const HEAD = '〔第350便a — ';
export const SEC_HEADS = Object.freeze(['**① 原文と統括の読み。**', '**表 1 第146報の文の当たり所(', '**表 2 新しい句 6 つ(', '**表 3 訂正の鎖(', '**② 用語(第350便a', '**③ 並べて読む所', '**④ 検査。**', '**⑤ 決断事項の候補。**', '**⑥ 言わないこと。**', 'docs.report146_350a', 'lint.bgAxialTerm350a', 'tests/lib-w350a-report146.mjs']);
export function checkReport146(ph, as, pm) {
  const bad = [], cases = [];
  ph = String(ph || ''); as = String(as || ''); pm = String(pm || '');
  const sec = physSecOf(ph, HEAD), iA = ph.indexOf('\n' + HEAD), iI = ph.indexOf('\n〔第348便i — '), iT = ph.indexOf('\n〔第328便 — 統括');
  // ① 位置・見出し・必須の語
  if (!(iA >= 0 && iI >= 0 && iI < iA && iT > iA && ph.slice(iI + 1, iA).indexOf('\n〔第') < 0)) bad.push('① PHYSICS〔第350便a〕の位置(〔第348便i〕の直後・〔第328便 — 統括〕の前)');
  const h1 = sec.split('\n')[0];
  for (const w of [SRC_ORG, SRC_DEC, 'R418', '文書だけ', 'html は変えていない', '器と段と正本は足していない']) if (h1.indexOf(w) < 0) bad.push('① 見出しに「' + w + '」が無い');
  for (const w of SEC_HEADS) if (sec.indexOf(w) < 0) bad.push('① PHYSICS〔第350便a〕に「' + w + '」が無い');
  cases.push('① 位置・見出し・必須の語');
  // ② 表 1
  { const T = tabIn(sec, '**表 1 ');
    if (T.map((l) => cells(l)[0]).join('|') !== TABLE1.map((r) => r[0]).join('|')) bad.push('② 表 1 の行の並び: ' + T.map((l) => cells(l)[0]).join('・'));
    for (const r of TABLE1) { const l = T.find((x) => x.startsWith('| ' + r[0] + ' |')), c = l ? cells(l) : null;
      if (!c || c.length !== 6) { bad.push('② 表 1 に ' + r[0] + ' の 6 欄の行が無い'); continue; }
      if (c[1] !== r[1]) bad.push('② 表 1 の ' + r[0] + ' の題');
      if (c[2] !== r[2]) bad.push('② 表 1 の ' + r[0] + ' の出どころ');
      if (c[3] !== q(r[3])) bad.push('② 表 1 の ' + r[0] + ' の原文の字が原文と違う');
      if (!c[4] || c[4] === c[3] || c[4].indexOf(r[3]) >= 0) bad.push('② 表 1 の ' + r[0] + ' の読みが空か原文と同じ');
      for (const w of r[6]) if (c[5].indexOf(w) < 0) bad.push('② 表 1 の ' + r[0] + ' の当たり所に「' + w + '」が無い'); }
    if (sec.indexOf('Releaseの説明文') >= 0) bad.push('② 「v1.47.0のReleaseの説明文を提案する」を引いている(公開の文書に当たり所を作らない)'); }
  cases.push(`② 表 1 の ${TABLE1.length} 行(整理 15・決断 2 —— 原文の字・題・出どころ・読みは原文と別の欄・当たり所の語)`);
  // ③ 表 2 —— 新しい句 6 つ・これまでの文が過去の節に在る
  { const T = tabIn(sec, '**表 2 ');
    if (T.length !== TABLE2.length) bad.push('③ 表 2 が ' + T.length + ' 行(' + TABLE2.length + ' のはず)');
    const rest = ph.slice(0, iA < 0 ? ph.length : iA) + (iA < 0 ? '' : ph.slice(iA + 1 + sec.length));
    for (const r of TABLE2) { const l = T.find((x) => x.startsWith('| ' + r[0] + ' |')), c = l ? cells(l) : null;
      if (!c || c.length !== 6) { bad.push('③ 表 2 に ' + r[0] + ' の 6 欄の行が無い'); continue; }
      if (c[1] !== q(r[1]) || r[2].indexOf(r[1]) < 0) bad.push('③ 表 2 の ' + r[0] + ' の新しい語');
      if (c[2] !== q(r[2])) bad.push('③ 表 2 の ' + r[0] + ' の第146報の文の字が原文と違う');
      for (const [s, t] of r[3]) { if (c[3].indexOf(s + ' ' + q(t)) < 0) bad.push('③ 表 2 の ' + r[0] + ' のこれまでの文(' + s.slice(-12) + ')の字');
        if (rest.indexOf(t) < 0) bad.push('③ 表 2 の ' + r[0] + ' のこれまでの文が過去の節に無い(' + t.slice(0, 12) + ')');
        if (t.indexOf(r[1]) >= 0) bad.push('③ 表 2 の ' + r[0] + ' の新しい語がこれまでの文に在る'); }
      if (c[5] !== r[6]) bad.push('③ 表 2 の ' + r[0] + ' の数える枝');
      if (!c[4]) bad.push('③ 表 2 の ' + r[0] + ' の読みが空'); } }
  cases.push(`③ 表 2 の新しい句 ${TABLE2.length} つ(第146報の文・これまでの文の字と出どころ・これまでの文が過去の節に在る・新しい語はこれまでの文に無い)`);
  // ④ 表 3 —— 訂正の鎖・当時の文が過去の節に残る
  { const T = tabIn(sec, '**表 3 ');
    if (T.length !== CHAIN.length) bad.push('④ 表 3 が ' + T.length + ' 行(' + CHAIN.length + ' のはず)');
    for (const r of CHAIN) { const l = T.find((x) => x.startsWith('| ' + r[0] + ' |')), c = l ? cells(l) : null;
      if (!c || c.length !== 5) { bad.push('④ 表 3 に ' + r[0] + ' の 5 欄の行が無い'); continue; }
      if (c[1] !== r[1] || c[2] !== q(r[2])) bad.push('④ 表 3 の ' + r[0] + ' の出どころか原文の字');
      if (c[4] !== r[4]) bad.push('④ 表 3 の ' + r[0] + ' の今の扱い');
      for (const h of r[5]) if (physSecOf(ph, h).indexOf(r[2]) < 0) bad.push('④ 表 3 の ' + r[0] + ' の当時の文が ' + h.replace(' — ', '') + '〕に残っていない'); }
    if (S.p6.indexOf(CHAIN[3][2]) < 0) bad.push('④ 表 3 の 4 が表 1 の 11 の原文の部分でない'); }
  cases.push('④ 表 3 の訂正の鎖 4 文(補足 1 → 回答 8 → 回答 9 → 第146報)・当時の文が〔第347便h〕〔第347便i〕〔第348便h〕に残る');
  // ⑤ AI_SPEC §310・post-merge
  { const a310 = as.search(/\n## 310\. 第350便a/), a309 = as.search(/\n## 309\. 第348便i/);
    let ai = ''; if (a310 >= 0) { const z = as.indexOf('\n## ', a310 + 4); ai = as.slice(a310 + 1, z < 0 ? as.length : z); }
    if (!(a310 >= 0 && a309 >= 0 && a309 < a310 && [SRC_ORG, 'R418', '背景軸引きずり', 'SYSTEM_PROMPT には載せない', 'docs.report146_350a', 'lint.bgAxialTerm350a'].every((w) => ai.indexOf(w) >= 0))) bad.push('⑤ AI_SPEC §310(§309 の後・必須の語)');
    if (!(pm.indexOf('# ==== 第350便a の塊(ここから)====') > pm.indexOf('# ==== 第348便i の塊(ここまで)====') && pm.indexOf('# ==== 第348便i の塊(ここまで)====') >= 0 && /DEFAULT_WAVE_IDS="\$DEFAULT_WAVE_IDS docs\.report146_350a lint\.bgAxialTerm350a"/.test(pm))) bad.push('⑤ post-merge に第350便a の塊(第348便i の塊の後)');
    // ⑥ 禁句と書かない語
    for (const [nm, tx] of [['PHYSICS〔第350便a〕', sec], ['AI_SPEC §310', ai]]) {
      for (const w of EXT_NAMES.concat(PRIVATE_NAMES)) if (tx.indexOf(w) >= 0) bad.push('⑥ ' + nm + ' に禁句(引用も含めて —— ' + w.length + ' 字)');
      if (PRIVATE_RE.test(tx)) bad.push('⑥ ' + nm + ' に private の文書の名の形');
      const s = strip(tx);
      for (const w of PAST) if (s.indexOf(w) >= 0) bad.push('⑥ ' + nm + ' に書かない語「' + w + '」');
      for (const re of NOT146) if (re.test(s)) bad.push('⑥ ' + nm + ' に書かない語 ' + re.source);
      if (outsideQuotes(tx).indexOf('回転引きずり') >= 0) bad.push('⑥ ' + nm + ' に旧称(引用の外)');
      if (/(^|[^_A-Za-z])κ/.test(tx)) bad.push('⑥ ' + nm + ' に裸の係数記号');
    } }
  cases.push(`⑤ AI_SPEC §310(§309 の後)・post-merge の塊 / ⑥ 禁句 ${EXT_NAMES.length + PRIVATE_NAMES.length + 1}(引用も含めて)・書かない語 ${PAST.length + NOT146.length}(引用と「言わないこと」の文の外)・旧称・係数記号`);
  return { bad, cases };
}

// ---- lint.bgAxialTerm350a の照合
// ph = PHYSICS・as = AI_SPEC・cl = CHANGELOG・pub = [[名, 文字列]](公開の文書の全部 —— docs の md・README・paper の md と tex・html)
export function checkBgAxialTerm(ph, as, cl, pub) {
  const bad = [], cases = [];
  ph = String(ph || ''); as = String(as || ''); cl = String(cl || '');
  const sec = physSecOf(ph, HEAD);
  // ① 定義の文
  { const p = para(sec, '**② 用語(第350便a');
    for (const [nm, d] of [['背景軸引きずり', DEF_BG], ['球体に換算', DEF_SPHERE], ['円盤引きずりの由来', ORIGIN_DISK], ['saturnRotVertExplore3d の当たり所', ORIGIN_SAT]]) if (p.indexOf(d) < 0) bad.push('① 〔第350便a〕の用語の段に「' + nm + '」の定義の文が無い'); }
  cases.push('① 〔第350便a〕の用語の段に定義の文 4 つ(背景軸引きずり・球体に換算・円盤引きずりの由来・🛟 の当たり所)');
  // ② 当時の文が残る(第138報の補足 3 の定義 —— 〔第337便a〕と計算式の一覧の用語)・本節に 2 つの読みが在る
  { const p = para(sec, '**② 用語(第350便a');
    if (p.indexOf(BG_READINGS) < 0) bad.push('② 〔第350便a〕の用語の段に背景軸引きずりの 2 つの読み (B1)(B2) の文が無い');
    if (physSecOf(ph, '〔第337便a — ').indexOf('「' + O.bg138 + '」') < 0) bad.push('② 〔第337便a〕に第138報の補足 3 の当時の文が残っていない');
    const eq = ((pub || []).find((x) => x[0] === 'docs/EQUATIONS.md') || [null, ''])[1];
    if (String(eq).indexOf(EQ_TERM) < 0) bad.push('② 計算式の一覧の用語「背景軸引きずり」の当時の文が残っていない'); }
  // ②′ 「背景軸引きずり」の行の数(節ごと —— 記録として出す)
  { const L = ph.split('\n'); let cur = '(冒頭)', nG = 0; const off = [];
    for (const l of L) { const m = /^〔第(\d+)便/.exec(l); if (m) cur = +m[1]; else if (/^## /.test(l)) cur = '(冒頭)';
      if (l.indexOf('背景軸引きずり') < 0) continue; nG++;
      if (typeof cur === 'number' && cur < 350) off.push(cur); }
    if (nG === 0) bad.push('② PHYSICS に「背景軸引きずり」が無い');
    if (off.length === 0) bad.push('② 「背景軸引きずり」の当時の文(第350便より前の節)が無い');
    cases.push(`② 当時の定義(第138報の補足 3 —— 〔第337便a〕・計算式の一覧の用語)が残る・本節に 2 つの読み (B1)(B2) / PHYSICS の「背景軸引きずり」${nG} 行(第350便より前の節 ${off.length} 行 —— 最初は〔第${Math.min(...off)}便〕)`); }
  // ③ private の文書の名が公開の文書の全部に無い
  { let n = 0; const hit = [];
    for (const [nm, tx] of pub || []) { const t = String(tx || ''); let k = 0; for (const w of PRIVATE_NAMES) k += t.split(w).length - 1; if (PRIVATE_RE.test(t)) k++; if (k) { hit.push(nm + '(' + k + ')'); n += k; } }
    if (!(pub && pub.length >= 10)) bad.push('③ 公開の文書の数が少ない(' + (pub ? pub.length : 0) + ')');
    if (hit.length) bad.push('③ 公開の文書に private の文書の名: ' + hit.slice(0, 4).join(', '));
    cases.push(`③ 公開の文書 ${pub ? pub.length : 0} 本に private の文書の名 ${n}(名 ${PRIVATE_NAMES.length} と報の原文の名の形 —— 綴りは反転で持つ)`); }
  // ④ 第350便の節・AI_SPEC の第350便の節・CHANGELOG の第350便の行に外部の名が無い
  { const parts = [];
    const re = /\n〔第350便[a-z]* — |\n〔第350便 — /g; let m; while ((m = re.exec(ph))) parts.push(['PHYSICS' + m[0].trim().slice(0, 8) + '〕', physSecOf(ph, m[0].slice(1))]);
    const ra = /\n## \d+\. 第350便/g; while ((m = ra.exec(as))) { const z = as.indexOf('\n## ', m.index + 4); parts.push(['AI_SPEC ' + m[0].trim().slice(3, 12), as.slice(m.index + 1, z < 0 ? as.length : z)]); }
    cl.split('\n').forEach((l, i) => { if (l.indexOf('第350便') >= 0) parts.push(['CHANGELOG ' + (i + 1) + ' 行', l]); });
    const hit = [];
    for (const [nm, tx] of parts) for (const w of EXT_NAMES) if (tx.indexOf(w) >= 0) hit.push(nm + '(' + w.length + ' 字)');
    if (!parts.some((p) => p[0].startsWith('PHYSICS〔第350便a'))) bad.push('④ PHYSICS〔第350便a〕が見つからない');
    if (hit.length) bad.push('④ 第350便の文に外部の名か書かない語: ' + hit.slice(0, 4).join(', '));
    cases.push(`④ 第350便の文 ${parts.length} か所(PHYSICS の節・AI_SPEC の節・CHANGELOG の行)に外部の名と書かない語 ${EXT_NAMES.length} が 0`); }
  return { bad, cases };
}
