// 第352便a(原仮定者の回答(2026-11-24 —— 第148報)・原仮定者の整理(2026-11-24 —— 第148報)・統括の検証項目 R438):
// **第148報の文書の lib —— 決断の 5 行と「銀河由来の軸引きずりについて」の 7 文の原文(文に分けた 22 文)と当たり所の表・新しい句 10 の表・
// 伺った 5 項の鎖・歳差の向きの 2 つの読み (g2+)(g2−) の閉じた形の表と純関数・新しい読みの名の定義の文と、
// QA docs.report148_352a・lint.partExplicit352a の照合の関数**(純関数 —— ファイルを読まない。QA が文書の文字列とファイルの中身を渡す)。
// 原文は言葉を変えずに引く(「含まれていてる」も原文のまま)。「統括の読み」の欄は統括の読みで、原文ではない。
// 器・正本・段は無い(文書の枝)。外部の名・private の文書の名は第350便a・第351便a の lib の反転の綴りの表を使う(本文に綴りを置かない)。
import * as A350 from './lib-w350a-report146.mjs';
import * as A351 from './lib-w351a-report147.mjs';

export const LIB_VERSION = 'w352a-report148-lib-1';

export const SRC_DEC = '原仮定者の回答(2026-11-24 —— 第148報)';
export const SRC_ORG = '原仮定者の整理(2026-11-24 —— 第148報)';
export const SRC = Object.freeze(Object.assign({}, A351.SRC, {
  dec147: A351.SRC147,
  org146: A350.SRC_ORG,
  a142_2: '原仮定者の回答(2026-11-19 —— 第142報の回答 2)',
  a145: '原仮定者の回答(2026-11-21 —— 第145報)',
}));

// ---- 原文(第148報の「決断事項」の 5 行と「銀河由来の軸引きずりについて」の 7 行 —— 言葉を変えずに)
const L = Object.freeze({
  d1015: 'AN1015: Bで進める。銀河由来の軸引きずりも、(S)だけを数えると弱いと推測する',
  d1016: 'AN1016: (乙)で進める。ただし、「釣り合う」に「安定した歳差運動」を含む',
  d1017: 'AN1017: これまでの向き。自転と、主に銀河由来の軸引きずりが順回転なら、歳差運動は逆回転になる',
  d1019: 'AN1019: Aで進める。金星の自転の逆回転は、釣り合った状態で地球とも共鳴した結果である',
  d1026: 'AN1026: Aで進める。未照合でも確度の高い数値で仮計算し、後追いで照合する',
  g1: '銀河の並進引きずりの計算が未確定なので、銀河の回転から軸引きずりの計算は出来ない。太陽系に及ぼす影響から逆算する段階',
  g2: '太陽系は、回転する銀河の円盤に含まれていてる。銀河の円盤は、中心からの距離に関わらず、ほぼ同じ速度で回転しているので、並進引きずりの差分も少ないと予想する',
  g3: '太陽系の公転面は、原始太陽系の円盤引きずりに由来する。公転面に薄く集まる事で、惑星の形成を促進した',
  g4: '銀河由来の円盤引きずりで、恒星は銀河の公転面に引き寄せられ、波打つ様に上下する。太陽の自転軸の傾きは、その際に生じる',
  g5: '太陽系の、多くの天体の公転面に垂直かつ、多くの天体の歳差運動の中心軸方向が、太陽系の基準軸方向である',
  g6: '太陽系の基準軸方向に対する、太陽の自転軸の傾きも歳差運動である。そこを手掛かりに、銀河由来の背景軸引きずりを算出する',
  g7: '自転速度や、歳差運動の傾きは、天体の構造に左右されるので、先に銀河由来の背景軸引きずりを算出する',
});
export const LINES148 = L;
export const LINE_KEYS = Object.freeze(['d1015', 'd1016', 'd1017', 'd1019', 'd1026', 'g1', 'g2', 'g3', 'g4', 'g5', 'g6', 'g7']);
/** 行を文に分ける(「。」で継ぐと原文の行に戻る) */
export const sentencesOf = (k) => L[k].split('。');
/** 文の数(数えて固定 —— 12 行で 22 文) */
export const N_SENT = 22;

// ---- 文の種類(3 つ)と受ける所
const K = Object.freeze({ yo: '予想の文', te: '定義の文', ju: '手順の文' });
export const KINDS = K;
const LATER = '後のラウンド';
const RB = '本便の枝 b', RC = '本便の枝 c', RD = '本便の枝 d', RE = '本便の枝 e', RF = '本便の枝 f';

/** 表 1 —— [番号, 行の鍵, 文の番号(0 起点), 出どころ, 種類, 統括の読み, 受ける所] —— 原文は L から文に分けて取る */
export const TABLE1 = Object.freeze([
  ['決 1-1', 'd1015', 0, SRC_DEC, K.ju, '局所の軸引きずりの主の成分 = (S) 源の自転の分。相対の公転の分 (M) と両方 (MS)・経路を分ける型は比べる列(消さない)—— (M) は「並進引きずりの回転の成分」の側の帳簿に残す。換算の係数 k は (S) に掛かる(既定 1)', RC + '・' + RD + '・' + RE],
  ['決 1-2', 'd1015', 1, SRC_DEC, K.yo, '予想の文として表に置く(結果の語にしない)。(S) の小さい桁を係数を 1e15 倍にして埋めた列は主にしない(診断の列としては出してよい)', RF + '・' + LATER],
  ['決 2-1', 'd1016', 0, SRC_DEC, K.ju, '釣り合う向き = 合成のベクトルの向き(伺いの (乙))。(甲) 公転の北極を基準の起こす率の和が 0 は比べる列', RC + '・' + RE + '・' + LATER],
  ['決 2-2', 'd1016', 1, SRC_DEC, K.te, '自転軸が合成の向きのまわりを、円錐の半頂角を保って回り続ける状態(安定した歳差)も「釣り合い」に含める。歳差の判定(半頂角が保たれるか)は数える量として置く', RE + '・' + LATER],
  ['決 3-1', 'd1017', 0, SRC_DEC, K.ju, '記号「これまでの向き」= (g2+) dŝ/dt ∝ +Ω × ŝ(第350便c の正の歳差・第351便d の経路 ② の式の向き)。伺いの「規則どおり」= (g2−) は並べる列(主は表 4 の後の段で伺っている)', RD],
  ['決 3-2', 'd1017', 1, SRC_DEC, K.te, '添えられた文(向きの規則)。統括の数え直し: ŝ·Ω > 0(順回転)のとき、(g2+) は合成の軸のまわりを自転と同じ回りに歳差し、(g2−) は逆回り —— 合成の軸のまわりで文に当たるのは (g2−)。「逆回転」を測る基準の極(合成の軸・自分の公転の北極・太陽系の基準軸・黄道の極)を列で分ける(表 4)', RD],
  ['決 4-1', 'd1019', 0, SRC_DEC, K.ju, '背景の大きさの主の列 = 金星で、太陽由来 (S) と背景の大きさが同じになる値 (uV)(k 1 で銀河の公転の角速度の 1.19282e-12 倍 —— この条件が置くのは「倍率 ÷ k」)。(MS) の値 25.4 は比べる列', RB + '・' + RE + '・' + LATER],
  ['決 4-2', 'd1019', 1, SRC_DEC, K.yo, '予想の文として表に置く(結果の語にしない)。釣り合いの点(外からの軸の拘束が小さい点)と、地球との共鳴は別の列で数える', LATER],
  ['決 5-1', 'd1026', 0, SRC_DEC, K.ju, '経路の比率を分ける比べる数(傾きの変化の率・歳差の回る向き)を照合の手順に載せる(伺いの A)', RB],
  ['決 5-2', 'd1026', 1, SRC_DEC, K.ju, '仮の値は枝 b の器に載っている数だけを使う。仮の値を使った列は「仮・未照合」の印つき —— 較正の合否・サンプルの状況・ノブの採否に入れない', RB],
  ['銀 1-1', 'g1', 0, SRC_ORG, K.ju, '背景は銀河の回転からは作らない段階(銀河の並進引きずりの計算は伺いの外 —— 今の積分は変えない)', RE + '・' + RF],
  ['銀 1-2', 'g1', 1, SRC_ORG, K.ju, '背景の向きと円錐を、太陽系の天体の向き(公転の法線・自転軸・歳差の中心軸)から逆に置く', RC + '・' + RE],
  ['銀 2-1', 'g2', 0, SRC_ORG, K.te, '前提の文(太陽系は銀河の円盤の中に在る)。原文の「含まれていてる」はそのまま引いた', RF],
  ['銀 2-2', 'g2', 1, SRC_ORG, K.yo, '予想の文として表に置く。円盤の中の回転の差分(速さの差分と向きの変化)を (M) 型と (S) 型で数えて比べる列を置く', RF],
  ['銀 3-1', 'g3', 0, SRC_ORG, K.yo, '形成の文 —— 予想の文として表に置く(今の積分に入れない)', LATER],
  ['銀 3-2', 'g3', 1, SRC_ORG, K.yo, '形成の文 —— 予想の文として表に置く(今の積分に入れない)', LATER],
  ['銀 4-1', 'g4', 0, SRC_ORG, K.yo, '形成の文 —— 予想の文として表に置く(銀河由来の円盤引きずりの上下の運動は、今の積分に入れない)', LATER],
  ['銀 4-2', 'g4', 1, SRC_ORG, K.yo, '予想の文として表に置く(太陽の自転軸の傾きの出どころ —— 結果の語にしない)', LATER],
  ['銀 5', 'g5', 0, SRC_ORG, K.te, '太陽系の基準軸 = 多くの天体の公転面の法線で、かつ多くの天体の歳差の中心軸。候補は列で: 8 惑星の公転の法線の等しい重みの平均・質量 × √a の重みの平均・黄道の極。背景が主なら合成の向き ≈ 背景の向き —— 背景の向きの候補 (N+)(統括の読み)', RC],
  ['銀 6-1', 'g6', 0, SRC_ORG, K.te, '太陽を受け手に置き、太陽の自転軸が基準軸のまわりを円錐の半頂角(候補の軸で 5.230〜7.252°)を保って歳差する、という読み', RC + '・' + RE],
  ['銀 6-2', 'g6', 1, SRC_ORG, K.ju, '先に置けるのは背景の向きと円錐の半頂角。大きさは、太陽の歳差の率の観測が無いので 1 つに決めない —— 列で持つ(金星の条件・時間の物差し〔仮〕・観測の弧の上限〔仮〕)', RB + '・' + RC + '・' + RE],
  ['銀 7', 'g7', 0, SRC_ORG, K.ju, '構造のノブ(換算の係数 k・構造の係数 c_R・経路の比率 f)は、背景の向きと円錐を置いた後に振る(同時に当てはめない)', RB + '・' + RE + '・' + LATER],
].map((r) => Object.freeze(r)));
export const sentOf = (r) => sentencesOf(r[1])[r[2]];

// ---- これまでの文(公開の節に在る原文 —— 言葉を変えずに。[出どころ, 原文, 原文が在る節の見出しの頭])
const O146 = A350.ORIGINAL146, E147 = A351.EARLIER147, L147 = A351.LINES147;
const E = Object.freeze({
  s3_146: [SRC.org146, O146.s3, '〔第350便a — '],
  prec146: E147.prec146,
  an803: E147.an803,
  venus138: E147.venus138,
  venus720: E147.venus720,
  an903: [SRC.a145, '推奨で進める。別途、照合方法をまとめる', '〔第345便a — '],
  s2_146: [SRC.org146, O146.s2, '〔第350便a — '],
  bg138: E147.bg138,
  inert138: E147.inert138,
  d1009: [SRC.dec147, L147.d1009, '〔第351便a — '],
  d1_146: [SRC.org146, O146.d1, '〔第350便a — '],
  an844: [SRC.a142_2, '銀河由来の軸引きずりに対する、太陽の軸は、112.8°。銀河由来の軸引きずりと、太陽由来の軸引きずりの釣り合いが、太陽系の軸の120°', '〔第343便e — '],
  bal146: E147.bal146,
  s4_146: [SRC.org146, O146.s4, '〔第350便a — '],
  d1000: [SRC.dec147, L147.d1000, '〔第351便a — '],
});
export const EARLIER148 = E;

/** 表 2 —— 新しい句 10: [句, 新しい語, 第148報の行の鍵, これまでの文(E の鍵の列), 関係(継ぐ・足す・読み直す), 統括の読み, 受ける所] */
export const REL = Object.freeze(['継ぐ', '足す', '読み直す']);
export const TABLE2 = Object.freeze([
  ['句 1', '安定した歳差運動', 'd1016', ['s3_146', 'prec146', 'an803'], '足す', '第146報は、合成の方向と観測の向きが違うとき「その方向を軸に歳差運動が現れる」と書いた。第148報は、その状態(円錐の半頂角を保つ歳差)を「釣り合う」に含めた —— 釣り合いの読み (乙) に、半頂角が保たれるかの判定が足される', RE + '・' + LATER],
  ['句 2', '地球とも共鳴', 'd1019', ['venus138', 'venus720'], '足す', '第138報の補足 2 の「さらに地球が影響を与えている」に、「共鳴」の語と「金星の自転の逆回転」の出どころの予想が付いた。金星で大きさが同じになる条件(AN720 の比)は継ぐ。共鳴は釣り合いの点と別の列で数える(予想の文)', LATER],
  ['句 3', '未照合でも確度の高い数値で仮計算', 'd1026', ['an903'], '読み直す', 'これまで文献の値・未照合の数は比べる列だけに置いた。第148報は、確度の高い数値なら未照合でも仮計算に使い、後で照合する —— 仮の値の列は「仮・未照合」の印つきで、較正の合否・サンプルの状況・ノブの採否に入れない(統括の読み)', RB],
  ['句 4', '太陽系に及ぼす影響から逆算する段階', 'g1', ['s2_146', 'bg138'], '継ぐ', '「背景軸引きずりとして扱う」(第146報)を継ぎ、その量を銀河の回転から作らず、太陽系の天体の向きから逆に置く段階と書いた', RC + '・' + RE],
  ['句 5', 'ほぼ同じ速度で回転している', 'g2', ['inert138', 'd1009'], '足す', '並進の背景は慣性系の取り方に織り込み済み(第138報の補足 3・第147報)に、銀河の円盤の中で回転の速さがほぼ同じ —— 差分が少ない、という予想が足された。速さの差分と向きの変化を分けて数える', RF],
  ['句 6', '原始太陽系の円盤引きずり', 'g3', ['d1_146'], '足す', '呼び名「円盤引きずり」(第146報)を、原始太陽系の円盤の形成の予想に使った文。今の積分に入れない', LATER],
  ['句 7', '波打つ様に上下する', 'g4', ['an844'], '足す', '太陽の自転軸の傾き(第142報の回答 2 の「太陽の軸は、112.8°」の量)の出どころの予想が足された。今の積分に入れない', LATER],
  ['句 8', '太陽系の基準軸方向', 'g5', ['an844', 'bal146'], '読み直す', '第142報の回答 2 の「太陽系の軸」に、定義(多くの天体の公転面に垂直・多くの天体の歳差運動の中心軸)が付いた。候補は 3 つの列(等しい重み・質量 × √a の重み・黄道の極)で、1 つに置かない', RC],
  ['句 9', '太陽の自転軸の傾きも歳差運動', 'g6', ['s3_146', 'an844'], '足す', '受け手を太陽に置いた読みが足された(これまでは惑星と衛星)。太陽の自転軸の基準軸に対する角は、円錐の半頂角として置く', RC + '・' + RE],
  ['句 10', '先に銀河由来の背景軸引きずりを算出する', 'g7', ['s4_146', 'd1000'], '足す', '構造別のノブ(第146報の構造の係数・第147報の換算の係数)に、順序が足された —— 背景の向きと円錐を先に置き、構造のノブは後に振る(同時に当てはめない)', RB + '・' + RE],
].map((r) => Object.freeze(r)));

/** 表 3 —— 伺った 5 項の鎖: [項, 題, 伺った読み, 当時の推奨(統括), 当時の文が残る節と字 [[見出しの頭, 字]], 推奨と同じか, 今の扱い, 主の列の替わり方(数), 受ける所] —— お答えの原文は L から */
const H351T = '〔第351便 — ';
export const CHAIN = Object.freeze([
  ['AN1015', '「太陽由来の軸引きずり」に相対の公転の分を数えるか', 'A (M) + (S) を数える・B (S) だけ・C 経路を分ける', 'A(数える —— 今の場の式のまま)', [[H351T, '「太陽由来の軸引きずり」に相対の公転の分 (M) を数えるか'], [H351T, '(M) 0・(S) 5・(MS) 0']], '推奨と違う(B)', '主の成分 = (S)・比べる列 = (M)・(MS)・経路を分ける型', '主の成分 (MS) → (S)。地球の太陽由来の率((C2)): (M) 6.69e-2″/年 → (S) 2.66e-15″/年(第351便の統括の節 ③ の数)。第147報の文に当たる惑星の数: (MS) 0 → (S) 5', RC + '・' + RD + '・' + RE],
  ['AN1016', '「釣り合う」は何が 0 になることか', '(甲) 起こす率の和が 0・(乙) 自転軸が合成の向きにそろう・両方', '(乙)', [[H351T, '自転軸が合成の向きにそろうことを指すのか']], '推奨と同じ + 文', '主 = (乙)(安定した歳差を含む)・比べる列 = (甲)', '主の列は替わらない。「そろう」点に届かない惑星も、円錐の半頂角を保つなら釣り合いの列に入る(判定は数える量)', RE + '・' + LATER],
  ['AN1017', '経路 ②(歳差)の回る向き', '規則どおり(経路 ① と同じ 90° の規則)・これまでの向き', '規則どおり', [[H351T, '経路 ② の回る向き']], '推奨と違う(記号)+ 文', '(g2+) と (g2−) の 2 列を並べる(主は伺っている —— 統括の推奨は文の向き (g2−)・次点は記号 (g2+))', '記号「これまでの向き」= (g2+)。添えられた文に合成の軸のまわりで当たるのは (g2−)(ŝ·Ω > 0 のとき —— 表 4)', RD],
  ['AN1019', '背景の大きさを「金星で釣り合う」から置くか', 'A 置く・B 起こす率の和が 0 で置く・C 置かない', 'A(倍率 25.4 —— AN1015 が A なら)', [[H351T, '(丙) は (MS) で 25.4・(S) で 1.19e-12']], '推奨と同じ(読みは AN1015 で替わる)+ 文', '主 = (uV)(金星で (S) と背景の大きさが同じ)・比べる列 = 25.4((MS) の値)・格子', '背景の倍率の主 25.4 → 1.19282e-12 ÷ k(k 1 —— 背景の大きさ 1.08427e-27 rad/s = 7.05776e-15″/年 —— 統括の数え直し)', RB + '・' + RE],
  ['AN1026', '経路の比率を分ける比べる数を照合の手順に載せるか', 'A 載せる・B 載せない', 'A(載せる)', [[H351T, '傾きの変化の率の比べる数は、リポジトリに無い']], '推奨と同じ + 文', '照合の手順に載せる・仮の値(枝 b の器の数だけ)で先に数える列を足す', '比率の列(0・0.5・1)は残す。仮の値の列は「仮・未照合」の印つき', RB],
].map((r) => Object.freeze(r)));
export const ANSWER_OF = Object.freeze({ AN1015: L.d1015, AN1016: L.d1016, AN1017: L.d1017, AN1019: L.d1019, AN1026: L.d1026 });

// ---- 表 4: 歳差の向きの 2 つの読み(純関数)
const dot = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
const crs = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
const nrm = (a) => Math.hypot(a[0], a[1], a[2]);
const scl = (a, s) => [a[0] * s, a[1] * s, a[2] * s];
/** 経路 ② の dŝ/dt(sign +1 = (g2+)・−1 = (g2−)) */
export function precDs(sign, sHat, Om, { k2 = 1, ratio = 1 } = {}) {
  if (!(sign === 1 || sign === -1)) throw new RangeError('precDs: sign は +1 か −1');
  return scl(crs(Om, sHat), sign * k2 * ratio);
}
/** 極 p に対する傾きの率と方位の率(rad/s —— az は p のまわりを右ねじで正・inc は p に対する傾き acos(p·ŝ) が増える向きを正) */
export function poleRates(pole, sHat, ds) {
  const p = scl(pole, 1 / nrm(pole)), ps = crs(p, sHat), q = dot(ps, ps);
  if (!(q > 1e-24)) return { inc: null, az: null };
  return { inc: -dot(p, ds) / Math.sqrt(q), az: dot(ps, ds) / q };
}
/** 閉じた形: 合成の軸 Ω̂ のまわりの方位の率 = sign × k₂ × 比 × abs(Ω)(傾きの率 0) */
export const closedAz = (sign, Om, { k2 = 1, ratio = 1 } = {}) => sign * k2 * ratio * nrm(Om);
/** 自転の回り(Ω̂ のまわり): ŝ·Ω̂ の符号 */
export const spinSense = (sHat, Om) => Math.sign(dot(sHat, Om));
export const PREC_DECL = Object.freeze({ Om: [0, 0, 3], k2: 0.5, ratio: 2, tiltsDeg: [10, 45, 80, 120] });
const fmt = (x) => (x === 0 ? '0' : Number(x.toPrecision(6)).toString());
const flo = (x) => (Math.abs(x) < 1e-12 ? '< 1e-12' : x.toExponential(2));
/** 表 4 の行: 傾き θ(ŝ と Ω̂ のなす角)ごと */
export function precRows(decl = PREC_DECL) {
  const { Om, k2, ratio } = decl, oh = scl(Om, 1 / nrm(Om));
  return decl.tiltsDeg.map((th) => {
    const t = th * Math.PI / 180, s = [Math.sin(t), 0, Math.cos(t)];
    const rp = poleRates(oh, s, precDs(1, s, Om, { k2, ratio })), rm = poleRates(oh, s, precDs(-1, s, Om, { k2, ratio }));
    const cp = closedAz(1, Om, { k2, ratio }), cm = closedAz(-1, Om, { k2, ratio }), ss = spinSense(s, Om);
    return { th, cos: dot(s, oh), azP: rp.az, azM: rm.az, incP: rp.inc, incM: rm.inc, closedP: cp, closedM: cm,
      dP: Math.abs(rp.az - cp), dM: Math.abs(rm.az - cm), sense: ss,
      relP: Math.sign(rp.az) === ss ? '同じ回り' : '逆回り', relM: Math.sign(rm.az) === ss ? '同じ回り' : '逆回り' };
  });
}
/** 純関数の零試験(QA が呼ぶ) */
export function precGates() {
  const bad = [], R = precRows();
  for (const r of R) {
    if (!(r.dP < 1e-12 && r.dM < 1e-12)) bad.push('閉じた形との差 θ ' + r.th);
    if (!(Math.abs(r.incP) < 1e-12 && Math.abs(r.incM) < 1e-12)) bad.push('傾きの率が 0 でない θ ' + r.th);
    const exP = r.cos > 0 ? '同じ回り' : '逆回り', exM = r.cos > 0 ? '逆回り' : '同じ回り';
    if (r.relP !== exP || r.relM !== exM) bad.push('回りの読み θ ' + r.th);
  }
  if (R.filter((r) => r.cos > 0).length !== 3) bad.push('ŝ·Ω > 0 の傾きが 3 つでない');
  // 極が合成の軸でないとき、方位の率は閉じた形と別の数(極の選び方で値が替わる —— 0 でない差)
  const s = [Math.sin(0.4), 0, Math.cos(0.4)], Om = [0.3, 0.2, 1], ds = precDs(1, s, Om), a1 = poleRates(Om, s, ds).az, a2 = poleRates([0, 0, 1], s, ds).az;
  if (!(Math.abs(a1 - nrm(Om)) < 1e-12 && Math.abs(a2 - a1) > 1e-3)) bad.push('極の選び方の対照');
  let thr = 0; try { precDs(0, s, Om); } catch (e) { thr = 1; }
  if (!thr) bad.push('sign の拒否');
  return { bad, n: 4 * R.length + 2 };
}
export function table4Md() {
  const R = ['| 傾き θ(ŝ と Ω̂ のなす角)[deg] | ŝ·Ω̂ | (g2+) +Ω × ŝ: 合成の軸のまわりの方位の率 | (g2−) −Ω × ŝ: 同 | 閉じた形 ±k₂ × 比 × abs(Ω) | 閉じた形との差 | 傾きの率(両列) | (g2+) と自転の回り | (g2−) と自転の回り |', '|---|---|---|---|---|---|---|---|---|'];
  for (const r of precRows()) R.push(`| ${r.th} | ${fmt(+r.cos.toFixed(4))} | ${fmt(r.azP)} | ${fmt(r.azM)} | ±${fmt(r.closedP)} | ${flo(Math.max(r.dP, r.dM))} | ${flo(Math.max(Math.abs(r.incP), Math.abs(r.incM)))} | ${r.relP} | ${r.relM} |`);
  return R.join('\n');
}

// ---- 用語の段の定義の文(docs.report148_352a が逐語で見る)
export const DEF_BGDIR = '**背景の向きの名 (G−)・(G+)・(N+)・(N−)** = 背景軸引きずりの向きの候補 —— (G−) 銀河の回転と逆向き(第351便の主の列 —— 〔第350便e〕の `bgTerm` の向き −1)/(G+) 銀河の回転と同じ向き(比べる列)/(N+) 太陽系の基準軸の向き(' + SRC_ORG + 'の「多くの天体の歳差運動の中心軸方向」を、背景が主なら合成の向き ≈ 背景の向き、と読んだ統括の読み)/(N−) 基準軸と逆向き(比べる列)。主は伺っている(統括の推奨 (N+)・次点 (G−))—— 両方を同じ重さで並べる';
export const DEF_PREC = '**歳差の向きの名 (g2+)・(g2−)** = 経路 ② の式の向き —— (g2+) dŝ/dt ∝ +Ω × ŝ(記号「これまでの向き」—— 〔第350便c〕の正の歳差・〔第351便d〕の経路 ② の式)/(g2−) dŝ/dt ∝ −Ω × ŝ(〔第351便d〕の「規則どおり」の向き)。ŝ·Ω > 0 のとき、(g2+) は合成の軸のまわりを自転と同じ回り・(g2−) は逆回り(表 4)。主は伺っている(統括の推奨は文の向き (g2−)・次点は記号の向き (g2+))';
export const DEF_SIZE = '**背景の大きさの列の名 (uV)・(u格子)・(仮)** = (uV) 金星で太陽由来 (S) と背景の大きさが同じになる倍率(この条件が置くのは「倍率 ÷ k」—— k 1 で銀河の公転の角速度の 1.19282e-12 倍・統括の数え直し)/(u格子) 0・1・10・…(第351便の格子)/(仮) 仮の値から出した列(「仮・未照合」の印つき —— 較正の合否・サンプルの状況・ノブの採否に入れない)';
export const DEF_STAB = '**安定した歳差** = 自転軸 ŝ が合成の向きのまわりを、円錐の半頂角を保って回り続ける状態。' + SRC_DEC + 'の AN1016 で「釣り合う」に含める(読み (乙) の拡張)。「起こす率」(公転の北極の基準)と「回転軸へ寄る率」(ŝ と Ω のなす角)は〔第351便c〕〔第351便d〕の定義のまま(混ぜない)';
export const DEF_REFAX = '**太陽系の基準軸の候補** = ' + SRC_ORG + 'の「太陽系の基準軸方向」の候補 3 つ —— 8 惑星の公転の法線の等しい重みの平均・質量 × √a の重みの平均(角運動量の代わり)・黄道の極。太陽の自転軸とのなす角は 5.230°・5.968°・7.252°(統括の数え直し —— 黄道 J2000 の成分)。1 つに置かない';
export const DEFS = Object.freeze([['背景の向きの名', DEF_BGDIR], ['歳差の向きの名', DEF_PREC], ['背景の大きさの列の名', DEF_SIZE], ['安定した歳差', DEF_STAB], ['太陽系の基準軸の候補', DEF_REFAX]]);

// ---- 書かない語
export const EXT_NAMES = A351.EXT_NAMES;
const rv = (x) => x.split('').reverse().join('');
export const PRIVATE_NAMES = Object.freeze(A351.PRIVATE_NAMES.concat(['253evaw', 'rohcna-253w', '253nommoc'].map(rv)));
export const PRIVATE_RE = A351.PRIVATE_RE;
export const PAST = Object.freeze(A351.PAST.concat(['決めた']));
export const NOT148 = Object.freeze([/主が決まった/, /弱いと分かった/, /共鳴で説明/, /上下の運動で生じた/, /型が決まった/]);
/** 外す行: 第148報の原文の行(公開に引かない —— 進め方の指示) */
export const NOT_QUOTE = Object.freeze(['実機確認: 済み', '参考に改善する', '概ね', '成果のまとめを報告する', '他の予定と並行しつつ', '回答を待たずに推奨と次点を並列で進め', '先の便の作業を前倒しで進める']);

// ---- 文字列の道具
export const cells = A350.cells, tabIn = A350.tabIn, physSecOf = A350.physSecOf, para = A350.para;
export const outsideQuotes = A351.outsideQuotes;
const strip = (t) => outsideQuotes(t).replace(/『[^』]*』/g, '').replace(/[^。\n]*とは書かない[^。\n]*。/g, '').replace(/[^。\n]*とは言わない[^。\n]*。/g, '').replace(/[^。\n]*を結果として書いていない[^。\n]*。/g, '');
const q = (x) => '「' + x + '」';

// ---- 表の markdown(本節の表はこの関数の出力と逐語で同じ)
export function table1Md() {
  const R = ['| # | 出どころ | 原文(言葉を変えずに引く —— 行を「。」で文に分けた) | 文の種類 | 統括の読み(原文と分ける) | 受ける所 |', '|---|---|---|---|---|---|'];
  for (const r of TABLE1) R.push(`| ${r[0]} | ${r[3]} | ${q(sentOf(r))} | ${r[4]} | ${r[5]} | ${r[6]} |`);
  return R.join('\n');
}
export function table2Md() {
  const R = ['| 句 | 新しい語 | 第148報の文 | これまでの文(出どころと原文 —— 公開の節に在る字) | 関係 | 統括の読み(型は決めない) | 受ける所 |', '|---|---|---|---|---|---|---|'];
  for (const r of TABLE2) R.push(`| ${r[0]} | ${q(r[1])} | ${q(L[r[2]])} | ${r[3].map((k) => E[k][0] + ' ' + q(E[k][1])).join(' / ')} | ${r[4]} | ${r[5]} | ${r[6]} |`);
  return R.join('\n');
}
export function table3Md() {
  const R = ['| 項 | 題 | 伺った読み | 当時の推奨(統括 —— 当時の文は消さない) | お答え(' + SRC_DEC + ') | 推奨との関係 | 今の扱い(主・比べる列) | 主の列の替わり方(数) | 受ける所 |', '|---|---|---|---|---|---|---|---|---|'];
  for (const r of CHAIN) R.push(`| ${r[0]} | ${r[1]} | ${r[2]} | ${r[3]} | ${q(ANSWER_OF[r[0]])} | ${r[5]} | ${r[6]} | ${r[7]} | ${r[8]} |`);
  return R.join('\n');
}
export function defsMd() { return DEFS.map(([, d]) => '- ' + d + '。').join('\n'); }

// ---- docs.report148_352a の照合(ph = PHYSICS・as = AI_SPEC・pm = post-merge)
export const HEAD = '〔第352便a — ';
export const PREV_HEAD = '〔第351便k — ';
export const SEC_HEADS = Object.freeze(['**① 原文と統括の読み。**', '**表 1 第148報の文の当たり所(', '**表 2 新しい句 10(', '**表 3 伺った 5 項の鎖(', '**表 4 歳差の向きの 2 つの読み(', '**② 用語(第352便a', '**③ 並べて読む所', '**④ 検査。**', '**⑤ 決断事項の候補。**', '**⑥ 言わないこと。**', 'docs.report148_352a', 'lint.partExplicit352a', 'tests/lib-w352a-report148.mjs']);
export function checkReport148(ph, as, pm) {
  const bad = [], cases = [];
  ph = String(ph || ''); as = String(as || ''); pm = String(pm || '');
  const sec = physSecOf(ph, HEAD), iA = ph.indexOf('\n' + HEAD), iP = ph.indexOf('\n' + PREV_HEAD), iT = ph.indexOf('\n〔第328便 — 統括');
  // ① 位置・見出し・必須の語
  if (!(iA >= 0 && iP >= 0 && iP < iA && iT > iA && ph.slice(iP + 1, iA).indexOf('\n〔第') < 0)) bad.push('① PHYSICS〔第352便a〕の位置(〔第351便k〕の直後・第328便の統括の節の前)');
  const h1 = sec.split('\n')[0];
  for (const w of [SRC_DEC, SRC_ORG, 'R438', '文書だけ', 'html は変えていない', '器と段と正本は足していない']) if (h1.indexOf(w) < 0) bad.push('① 見出しに「' + w + '」が無い');
  for (const w of SEC_HEADS) if (sec.indexOf(w) < 0) bad.push('① PHYSICS〔第352便a〕に「' + w + '」が無い');
  if (/〔第\d+便 — 統括〕/.test(sec)) bad.push('① 本節に統括の節の見出しの字をそのまま書いている');
  cases.push('① 位置・見出し・必須の語・統括の節の見出しの字を書かない');
  // ② 表 1 —— 12 行を文に分けた 22 文
  { const T = tabIn(sec, '**表 1 ');
    const nS = LINE_KEYS.reduce((a, k) => a + sentencesOf(k).length, 0);
    if (nS !== N_SENT || TABLE1.length !== N_SENT) bad.push('② 文の数が ' + nS + '・表の行が ' + TABLE1.length + '(' + N_SENT + ' のはず)');
    for (const k of LINE_KEYS) { const rows = TABLE1.filter((r) => r[1] === k).sort((a, b) => a[2] - b[2]);
      if (rows.map(sentOf).join('。') !== L[k]) bad.push('② 行 ' + k + ' の文を継いでも原文の行に戻らない'); }
    if (T.map((l) => cells(l)[0]).join('|') !== TABLE1.map((r) => r[0]).join('|')) bad.push('② 表 1 の行の並び: ' + T.map((l) => cells(l)[0]).join('・'));
    for (const r of TABLE1) { const l = T.find((x) => x.startsWith('| ' + r[0] + ' |')), c = l ? cells(l) : null;
      if (!c || c.length !== 6) { bad.push('② 表 1 に ' + r[0] + ' の 6 欄の行が無い'); continue; }
      if (c[1] !== r[3]) bad.push('② 表 1 の ' + r[0] + ' の出どころ');
      if (c[2] !== q(sentOf(r))) bad.push('② 表 1 の ' + r[0] + ' の原文の字が原文と違う');
      if (c[3] !== r[4] || !Object.values(K).includes(c[3])) bad.push('② 表 1 の ' + r[0] + ' の文の種類');
      if (!c[4] || c[4].indexOf(sentOf(r)) >= 0) bad.push('② 表 1 の ' + r[0] + ' の読みが空か原文を含む');
      if (c[5] !== r[6]) bad.push('② 表 1 の ' + r[0] + ' の受ける所');
      if (/〔第352便[b-z]〕/.test(c[5])) bad.push('② 表 1 の ' + r[0] + ' の受ける所にまだ無い節の名'); }
    const yo = TABLE1.filter((r) => r[4] === K.yo).map((r) => r[0]);
    for (const id of ['決 1-2', '決 4-2', '銀 2-2', '銀 3-1', '銀 3-2', '銀 4-1', '銀 4-2']) if (!yo.includes(id)) bad.push('② 表 1 の ' + id + ' が予想の文でない');
    for (const w of NOT_QUOTE) if (sec.indexOf(w) >= 0) bad.push('② 公開に引かない行(' + w.slice(0, 6) + '…)を引いている'); }
  cases.push(`② 表 1 の ${TABLE1.length} 文(12 行を「。」で分けた —— 継ぐと原文の行に戻る・原文の字・出どころ 2 つ・文の種類 3 つ・読みは原文と別の欄・受ける所)・予想の文 7・公開に引かない行 ${NOT_QUOTE.length}`);
  // ③ 表 2 —— 新しい句 10・これまでの文が過去の節に在る
  { const T = tabIn(sec, '**表 2 ');
    if (T.length !== TABLE2.length) bad.push('③ 表 2 が ' + T.length + ' 行(' + TABLE2.length + ' のはず)');
    for (const r of TABLE2) { const l = T.find((x) => x.startsWith('| ' + r[0] + ' |')), c = l ? cells(l) : null;
      if (!c || c.length !== 7) { bad.push('③ 表 2 に ' + r[0] + ' の 7 欄の行が無い'); continue; }
      if (c[1] !== q(r[1]) || L[r[2]].indexOf(r[1]) < 0) bad.push('③ 表 2 の ' + r[0] + ' の新しい語');
      if (c[2] !== q(L[r[2]])) bad.push('③ 表 2 の ' + r[0] + ' の第148報の文の字が原文と違う');
      for (const k of r[3]) { const [s, t, h] = E[k];
        if (c[3].indexOf(s + ' ' + q(t)) < 0) bad.push('③ 表 2 の ' + r[0] + ' のこれまでの文(' + k + ')の字か出どころ');
        if (physSecOf(ph, h).indexOf(t) < 0) bad.push('③ 表 2 の ' + r[0] + ' のこれまでの文(' + k + ')が ' + h.replace(' — ', '') + '〕に無い');
        if (t.indexOf(r[1]) >= 0) bad.push('③ 表 2 の ' + r[0] + ' の新しい語がこれまでの文(' + k + ')に在る'); }
      if (c[4] !== r[4] || !REL.includes(c[4])) bad.push('③ 表 2 の ' + r[0] + ' の関係');
      if (c[6] !== r[6]) bad.push('③ 表 2 の ' + r[0] + ' の受ける所');
      if (!c[5]) bad.push('③ 表 2 の ' + r[0] + ' の読みが空'); } }
  cases.push(`③ 表 2 の新しい句 ${TABLE2.length}(第148報の文・これまでの文 ${Object.keys(E).length} の字と出どころ・これまでの文が当時の節に在る・新しい語はこれまでの文に無い・関係 3 つ)`);
  // ④ 表 3 —— 伺った 5 項の鎖・当時の文が第351便の統括の節に残る
  { const T = tabIn(sec, '**表 3 ');
    if (T.length !== CHAIN.length) bad.push('④ 表 3 が ' + T.length + ' 行(' + CHAIN.length + ' のはず)');
    for (const r of CHAIN) { const l = T.find((x) => x.startsWith('| ' + r[0] + ' |')), c = l ? cells(l) : null;
      if (!c || c.length !== 9) { bad.push('④ 表 3 に ' + r[0] + ' の 9 欄の行が無い'); continue; }
      if (c[4] !== q(ANSWER_OF[r[0]])) bad.push('④ 表 3 の ' + r[0] + ' のお答えの原文の字');
      if (c[3] !== r[3] || c[6] !== r[6] || c[7] !== r[7]) bad.push('④ 表 3 の ' + r[0] + ' の当時の推奨か今の扱いか替わり方');
      for (const [h, t] of r[4]) if (physSecOf(ph, h).indexOf(t) < 0) bad.push('④ 表 3 の ' + r[0] + ' の当時の文が第351便の統括の節に残っていない'); } }
  cases.push(`④ 表 3 の鎖 ${CHAIN.length} 項(伺った読み・当時の推奨・お答え・推奨との関係・今の扱い・主の列の替わり方)・当時の文が第351便の統括の節に残る`);
  // ⑤ 表 4 —— 歳差の向きの 2 つの読み(純関数の出力と逐語)
  { const g = precGates(); for (const b of g.bad) bad.push('⑤ 表 4 の純関数: ' + b);
    const T = tabIn(sec, '**表 4 '), W = table4Md().split('\n').slice(2);
    if (T.join('\n') !== W.join('\n')) bad.push('⑤ 表 4 が lib の出力と違う');
    const p = para(sec, '**表 4 ');
    if (sec.indexOf('ŝ·Ω > 0 のとき') < 0) bad.push('⑤ 表 4 の条件の文が無い'); }
  cases.push(`⑤ 表 4 の ${PREC_DECL.tiltsDeg.length} 行(ŝ·Ω > 0 の傾き 3 つ + 対照 1)・閉じた形との差と傾きの率 < 1e-12・回りの読み・極の選び方の対照・拒否(零試験 ${precGates().n})`);
  // ⑥ 用語の段の定義の文
  { const p = para(sec, '**② 用語(第352便a');
    for (const [nm, d] of DEFS) if (p.indexOf(d) < 0) bad.push('⑥ 〔第352便a〕の用語の段に「' + nm + '」の定義の文が無い'); }
  cases.push(`⑥ 用語の段に定義の文 ${DEFS.length} つ(背景の向きの名・歳差の向きの名・背景の大きさの列の名・安定した歳差・太陽系の基準軸の候補)`);
  // ⑦ AI_SPEC §330・post-merge・禁句
  { const a330 = as.search(/\n## 330\. 第352便a/), a329 = as.search(/\n## 329\. 第351便k/);
    let ai = ''; if (a330 >= 0) { const z = as.indexOf('\n## ', a330 + 4); ai = as.slice(a330 + 1, z < 0 ? as.length : z); }
    if (!(a330 >= 0 && a329 >= 0 && a329 < a330 && [SRC_DEC, SRC_ORG, 'R438', '(g2+)', '(g2−)', 'SYSTEM_PROMPT には載せない', 'docs.report148_352a', 'lint.partExplicit352a'].every((w) => ai.indexOf(w) >= 0))) bad.push('⑦ AI_SPEC §330(§329 の後・必須の語)');
    const e351k = pm.indexOf('# ==== 第351便k の塊(ここまで)====');
    if (!(e351k >= 0 && pm.indexOf('# ==== 第352便a の塊(ここから)====') > e351k && /DEFAULT_WAVE_IDS="\$DEFAULT_WAVE_IDS docs\.report148_352a lint\.partExplicit352a"/.test(pm))) bad.push('⑦ post-merge に第352便a の塊(第351便k の塊の後)');
    for (const [nm, tx] of [['PHYSICS〔第352便a〕', sec], ['AI_SPEC §330', ai]]) {
      for (const w of EXT_NAMES.concat(PRIVATE_NAMES)) if (tx.indexOf(w) >= 0) bad.push('⑧ ' + nm + ' に禁句(引用も含めて —— ' + w.length + ' 字)');
      if (PRIVATE_RE.test(tx)) bad.push('⑧ ' + nm + ' に private の文書の名の形');
      const s = strip(tx);
      for (const w of PAST) if (s.indexOf(w) >= 0) bad.push('⑧ ' + nm + ' に書かない語「' + w + '」');
      for (const re of NOT148) if (re.test(s)) bad.push('⑧ ' + nm + ' に書かない語 ' + re.source);
      if (outsideQuotes(tx).indexOf('回転引きずり') >= 0) bad.push('⑧ ' + nm + ' に旧称(引用の外)');
      if (/(^|[^_A-Za-z])κ/.test(tx)) bad.push('⑧ ' + nm + ' に裸の係数記号');
    } }
  cases.push(`⑦ AI_SPEC §330(§329 の後)・post-merge の塊 / ⑧ 禁句 ${EXT_NAMES.length + PRIVATE_NAMES.length + 1}(引用も含めて)・書かない語 ${PAST.length + NOT148.length}(引用と「言わないこと」の文の外)・旧称・係数記号`);
  return { bad, cases };
}

// ---- lint.partExplicit352a —— 第352便の lib と器の中で、第351便e の totalOm を呼ぶ所は part を明示している
export const PART_LIB = 'lib-w351e-bgbalance.mjs';
export const PART_FILE_RE = /^(?:lib|exp)-w352[a-z]*-[A-Za-z0-9_-]+\.mjs$/;
const reEsc = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
/** 注釈を除く(/* … *\/ と、行頭か空白の後の // —— 文字列の中の // は残す近似) */
export const stripComments = (t) => String(t || '').replace(/\/\*[\s\S]*?\*\//g, ' ').replace(/(^|[\s;{}(),])\/\/[^\n]*/g, '$1');
/** 第351便e の lib に結ばれた呼び名(名前空間 X.totalOm・名指しの import〔別名を含む〕)を拾う */
export function boundCallees(text) {
  const t = stripComments(text), lib = reEsc(PART_LIB), out = [];
  let m; const ns = new RegExp('import\\s+\\*\\s+as\\s+([A-Za-z_$][\\w$]*)\\s+from\\s+[\'"][^\'"]*' + lib + '[\'"]', 'g');
  while ((m = ns.exec(t))) out.push(m[1] + '.totalOm');
  const dy = new RegExp('(?:const|let|var)\\s+([A-Za-z_$][\\w$]*)\\s*=\\s*await\\s+import\\(\\s*[\'"`][^\'"`]*' + lib + '[\'"`]\\s*\\)', 'g');
  while ((m = dy.exec(t))) out.push(m[1] + '.totalOm');
  const nm = new RegExp('import\\s*\\{([^}]*)\\}\\s*from\\s+[\'"][^\'"]*' + lib + '[\'"]', 'g');
  while ((m = nm.exec(t))) for (const part of m[1].split(',')) { const z = part.trim().match(/^totalOm(?:\s+as\s+([A-Za-z_$][\w$]*))?$/); if (z) out.push(z[1] || 'totalOm'); }
  const dd = new RegExp('(?:const|let|var)\\s*\\{([^}]*)\\}\\s*=\\s*await\\s+import\\(\\s*[\'"`][^\'"`]*' + lib + '[\'"`]\\s*\\)', 'g');
  while ((m = dd.exec(t))) for (const part of m[1].split(',')) { const z = part.trim().match(/^totalOm(?:\s*:\s*([A-Za-z_$][\w$]*))?$/); if (z) out.push(z[1] || 'totalOm'); }
  return [...new Set(out)];
}
/** 呼び出しの括弧の中身(入れ子を数える) */
const argsAt = (t, i) => { let d = 0; for (let j = i; j < t.length; j++) { const ch = t[j]; if (ch === '(') d++; else if (ch === ')') { d--; if (d === 0) return t.slice(i + 1, j); } } return null; };
/** 引数の中に part を明示しているか(part: … か、オブジェクトの省略形 { …, part, … }) */
export const hasPart = (a) => /(^|[{,\s])part\s*:/.test(a) || /[{,]\s*part\s*[,}]/.test(a);
/** files = [[名, 中身]] → { bad, cases, calls: [[名, 行, 明示]] } */
export function checkPartExplicit(files) {
  const bad = [], calls = [];
  const F = (files || []).filter(([n]) => PART_FILE_RE.test(String(n).split('/').pop()));
  for (const [n, text] of F) {
    const t = stripComments(text);
    for (const c of boundCallees(text)) {
      const re = new RegExp('(^|[^\\w$.])' + reEsc(c) + '\\s*\\(', 'g'); let m;
      while ((m = re.exec(t))) {
        const i = t.indexOf('(', m.index + m[1].length), a = argsAt(t, i), line = t.slice(0, i).split('\n').length, ok = a !== null && hasPart(a);
        calls.push([n, line, ok]);
        if (!ok) bad.push('① ' + n + ' の ' + line + ' 行の ' + c + '( に part の明示が無い(既定は MS —— 本便の主は S)');
      }
    }
  }
  const cases = [`① 対象 ${F.length} 本(tests/lib-w352*・exp-w352*)・第351便e の totalOm の呼び出し ${calls.length}(明示 ${calls.filter((c) => c[2]).length}・明示なし ${calls.filter((c) => !c[2]).length})`];
  return { bad, cases, calls, nFiles: F.length };
}
/** 変異の自己試験の種(綴りを分けて持つ —— 本 lib 自身が対象のファイルに当たらないように) */
export const partFixtures = () => {
  const imp = (s) => s + " from './lib-w351e-" + 'bgbalance.mjs' + "';\n";
  return Object.freeze({
    okNs: imp('import * as E') + 'const r = E.totalOm(T1, GEO, { id, src, part: \'S\', u });\n',
    okShort: imp('import * as E') + 'const r = E.totalOm(T1, GEO, { id, src, part, u });\n',
    noPartNs: imp('import * as E') + 'const r = E.totalOm(T1, GEO, { id, src, u });\n',
    noPartAlias: imp('import { totalOm as tOm }') + 'const r = tOm(T1, GEO, { id: \'Earth\', src: \'Sun\', u: 1 });\n',
    noPartDyn: "const E2 = await import('./lib-w351e-" + "bgbalance.mjs');\nconst r = E2.totalOm(T1, GEO, opts);\n",
    comment: imp('import * as E') + '// E.totalOm(T1, GEO, { id })\n/* E.totalOm(T1, GEO, {}) */\n',
    localOther: "import * as K from './lib-w351k-knobrank.mjs';\nconst totalOm = (bg, loc, k) => bg;\nK.totalOm(bg, loc, 1); totalOm(a, b, 2);\n",
    partInNested: imp('import * as E') + 'const r = E.totalOm(T1, GEO, { id, src: pick({ part: 1 }), u });\n',
  });
};
