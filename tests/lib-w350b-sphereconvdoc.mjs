// 第350便b(原仮定者の整理(2026-11-23 —— 第146報)・統括の検証項目 R419):
// **正本 tests/out/sphereconv-350b.json から PHYSICS〔第350便b〕の表を作る文書の lib**
// (QA docs.sphereconv350b が節の表と逐語で照合する —— 表の数は有効数字 3 桁・比は小数 3〜4 桁・角は小数 2 桁)。原文(言葉を変えずに引く)と、読みの式の表もここに持つ。
export const DOC_VERSION = 'w350b-sphereconvdoc-1';
const fe = (x) => (x === null || x === undefined || !Number.isFinite(x) ? '—' : x === 0 ? '0' : Number(x).toExponential(2));
const f4 = (x) => (x === null || x === undefined || !Number.isFinite(x) ? '—' : Number(x).toFixed(4));
const f3 = (x) => (x === null || x === undefined || !Number.isFinite(x) ? '—' : Number(x).toFixed(3));
const f2 = (x) => (x === null || x === undefined || !Number.isFinite(x) ? '—' : Number(x).toFixed(2));
const f8 = (x) => (x === null || x === undefined || !Number.isFinite(x) ? '—' : Number(x).toFixed(8));
const tf = (x) => (x === true ? '真' : x === false ? '偽' : '—');
const vec = (v) => (v ? '(' + v.map((x) => (x === 0 ? '0' : Math.abs(x) >= 1e-3 && Math.abs(x) < 1e3 ? Number(x).toPrecision(4) : Number(x).toExponential(2))).join(', ') + ')' : '—');
const NM = Object.freeze({ Mercury: '水星', Venus: '金星', Earth: '地球', Mars: '火星', Jupiter: '木星', Saturn: '土星', Uranus: '天王星', Neptune: '海王星', Moon: '月', Io: 'イオ', Pluto: '冥王星',
  Sun: '太陽', EarthHi: '地球(傾きの最大の位相)', EarthLo: '地球(傾きの最小の位相)', Charon: 'カロン' });
const pairName = (r) => `${NM[r.id]} | ${NM[r.src]}`;

/** 原文(言葉を変えずに引く) */
export const ORIGINAL = Object.freeze([
  Object.freeze(['原仮定者の整理(2026-11-23 —— 第146報)', '軸引きずりの回転は、引きずられる側の、源に近い点と遠い点の並進引きずりから、球体に換算して計算する']),
  Object.freeze(['原仮定者の指示(2026-11-22 —— 第145報の補足 1)', '軸引きずりの回転は、引きずられる側の、源に近い点と遠い点の並進引きずりから計算する']),
  Object.freeze(['原仮定者の整理(2026-11-23 —— 第146報)', '下記の案も検証する。対象の組は、慣性決定力のgeoPN=3']),
  Object.freeze(['原仮定者の整理(2026-11-23 —— 第146報)', '並進引きずりは移動と回転を含み、並進引きずりで引きずられる側の、部位差分による回転が軸引きずりである。軸引きずりは、源の回転の赤道面方向で強く現れるが、源が無回転で横を通り過ぎても並進引きずりと共に発生する']),
]);
/** 統括の読み(原文と分ける)—— [読み, 数えた所] */
export const READINGS = Object.freeze([
  Object.freeze(['「球体に換算して」の読みは 3 つ: (C1) 2 点の差分をそのまま球の回転の率に・(C2) 球全体の剛体回転への平均・(C3) 係数 k × (C1)。どれも候補 —— 主の列は伺っている(枝は決めない)', '表 2〜表 8']),
  Object.freeze(['当時の文(消さずに並べる)。2 点の差分の型 (P2) —— (C1) と同じ数', '表 2・表 6 の (C1) の列']),
  Object.freeze(['場は geoPN=3 の在位の形(〔第348便h〕の makeField3 の既定の引数 —— K1 の核・源の回転は球のモーメント・背景 0・自分の重みを分母に・受け手の速度を引く)', '表 3〜表 8']),
  Object.freeze(['「源が無回転で横を通り過ぎても」の場面を共通の点検の場にし、「源の回転の赤道面方向」の場面を回転する源の緯度 3 つに置く', '表 6・表 7']),
]);
export function originalTable(readings = READINGS) {
  return ['| # | 出どころ | 原文(言葉を変えずに引く) | 読み(統括の読み —— 原文と分ける) | 数えた所 |', '|---|---|---|---|---|',
    ...ORIGINAL.map(([src, o], k) => `| ${k + 1} | ${src} | 「${o}」 | ${readings[k][0]} | ${readings[k][1]} |`)].join('\n');
}
/** 表 2 3 つの読みの式(本節の lib の関数) */
export const READ_TABLE = ['| 読み | 式 | 本節の lib の関数 | 一次の場での値 | 1 本の直径で見えないもの |', '|---|---|---|---|---|',
  '| (C1) 2 点の差分(= (P2)) | Ω = ê × [u(p + hê) − u(p − hê)] ÷ (2h)(2 点の速度の差 ÷ 直径) | `c1`(有限の差)・`c1Lim`(〔第348便h〕の `rot3(\'P2\')` —— 腕 ≪ 距離の極限・自分の重みは腕の点の値) | ê × (J ê)(回転とずれの和) | ê のまわりの回転・回転とずれの区別 |',
  '| 6 点の平均(比べる形) | Ω = ½ Σ_k (C1)_k(直交 3 直径 —— 各直径の 2 点の差分の和の ½) | `p6` | ½ ∇×u | —(3 直径) |',
  '| (C2) 球の剛体回転への平均 | Ω = I⁻¹ ∫ρ r × [u(p + r) − u(p)] dV(一様な球・I = (2/3) ∫ρ r² dV の等方) | `c2Quad`(〔第347便h〕の `gaussLegendre` —— 半径 8・cos θ 8・方位 16) | ½ ∇×u(= (W)) | — |',
  '| (C2) の球(天体の表) | Ω = ⟨½ ∇×u(自分の重みを半径 ρ の値 S(ρ) に置く)⟩(重み 5ρ⁴ ÷ R⁵) | `c2Ball`・天体は `equivR`(中心の値が S(ρ) になる半径 R′ = 3R³ ÷ (3R² − ρ²)) | 自分の重みが受け手の中で変わる分だけ (W) と違う | — |',
  '| (W) 中心の渦度の半分(比べる形) | Ω = ½ ∇×u(中心 —— 自分の重みの勾配は中心で 0) | `wHalf`(〔第348便h〕の `rot3(\'W\')`) | ½ ∇×u | — |',
  '| (C3) 係数 k × (C1) | Ω = k × (C1)(k = 1・2/5・1/2 —— ノブ) | `c3` | k ê × (J ê) | (C1) と同じ |'].join('\n');

export function tablesOf(J) {
  const T = {}, S = J.pure.scenes, G = J.pure.gates, Cm = J.decl.common;
  T.pure = ['| 零試験・場面 | 値 | 門 |', '|---|---|---|',
    `| ① 共通の点検の数(x の直径の 2 点の差分・6 点の平均・(W) の z 成分 —— 統括の数え直しの数 ${Cm.p2x}・${Cm.p6}・${Cm.w} と 5e-9 の内・x と y の成分は 0) | ${f8(S.common.p2x)}・${f8(S.common.p6)}・${f8(S.common.w)} | ${tf(G.common)} |`,
    `| ② 通過の向きの反転で符号反転・中心線の向きの通過・相対静止・自分の重みも背景も 0(源 1 つ)で 0・両方に同じ速度 (3,−2,1) を足して不変((C1)・6 点・(W)・(C2) の最大 —— 床 < 1e-12) | ${S.sym.flip < 1e-12 && S.sym.center < 1e-12 && S.sym.rest === 0 && S.sym.noSelf < 1e-12 && S.sym.shift < 1e-12 ? '< 1e-12' : '外'} | ${tf(G.symmetry)} |`,
    `| ③ 剛体回転 u = (1,2,3) × r: x の直径の (C1)・6 点・(C2) | ${vec(S.trial.rigidC1x.map(Math.round))}・${vec(S.trial.rigidP6.map(Math.round))}・${vec(S.trial.rigidC2.map(Math.round))} | ${tf(G.rigid)} |`,
    `| ④ 純粋なずれ u = (y, x, 0): x の直径の (C1) の z・6 点の大きさ・(C2) の大きさ(床 < 1e-12) | ${Math.round(S.trial.shearC1x[2])}・0・0 | ${tf(G.shear)} |`,
    `| ⑤ (C2) の求積と〔第347便h〕の (V)(一様な密度 —— 同じ定義の別の求積)の相対の差(床 < 1e-4)・(C3) は k 倍 | ${S.vsV < 1e-4 ? '< 1e-4' : fe(S.vsV)} | ${tf(G.quadVsV)} |`,
    `| ⑥ 自分の重みの閉じた形 ⟨S(0)/S(ρ)⟩ = −50 + (45√3/2) ln(2 + √3) と GL の数(床 < 1e-12)・(C2) の球の天体の口 R′ | ${f4(S.SF.ball1)} | ${tf(G.selfClosed)} |`,
    `| ⑦ 変異: 6 点の ½ を落とす/直径で割らない/符号/(C2) の 2/3 を落とす → 共通の点検の数から外れる | ${f8(S.mut.nohalf)}/${f8(S.mut.nodiam)}/${f8(S.mut.sign)}/${f8(S.mut.inorm)} | ${tf(G.mutants)} |`,
    `| ⑧ 入力の拒否(腕 0・ê 0・半径 −1・球の半径 0・k 0・回転の長さ 2) | ${S.rejects.filter(Boolean).length}/${S.rejects.length} | ${tf(G.rejects)} |`].join('\n');
  T.order = ['| 球の半径・腕 a | a ÷ 距離 | (C1) の z | (C1) の極限の z | 6 点の z | (C2) の z | (W) の z | (C2) と (W) の相対の差 | その次数 | 6 点と (W) の差の次数 | (C1) の有限と極限の差の次数 | (C2) ÷ (C1) |', '|---|---|---|---|---|---|---|---|---|---|---|---|',
    ...J.order.map((r) => `| ${r.a} | ${r.aOverD} | ${fe(r.C1z)} | ${fe(r.C1limz)} | ${fe(r.P6z)} | ${fe(r.C2z)} | ${fe(r.Wz)} | ${fe(r.dC2W)} | ${f3(r.ordC2W)} | ${f3(r.ordP6W)} | ${f3(r.ordC1lim)} | ${f4(r.c2OverC1)} |`)].join('\n');
  T.ballCheck = ['| 距離 | 受け手の半径 ÷ 距離 | (C2) 球の求積の z | (C2) の球(半径の平均)の z | 相対の差 | その次数 | (C2) の球 ÷ (W) | (C1) の極限 ÷ (W) |', '|---|---|---|---|---|---|---|---|',
    ...J.ballCheck.map((r) => `| ${r.d} | ${r.aOverD} | ${fe(r.quadZ)} | ${fe(r.ballZ)} | ${fe(r.dQB)} | ${f3(r.ord)} | ${f4(r.ballOverW)} | ${f4(r.c1limOverW)} |`)].join('\n');
  const C3k = (r, k) => (r.C3[k] ? vec(r.C3[k]) : '—');
  T.trial = ['| 場面 | (C1) x の直径 | (C1) の極限 | 6 点の平均 | (C2) 球(半径 0.01) | (W) | (C3) k 2/5 | (C3) k 1/2 |', '|---|---|---|---|---|---|---|---|',
    ...J.trial.map((r) => `| ${r.name} | ${vec(r.C1)} | ${vec(r.C1lim)} | ${vec(r.P6)} | ${vec(r.C2)} | ${vec(r.W)} | ${C3k(r, '0.4')} | ${C3k(r, '0.5')} |`)].join('\n');
  T.spin = ['| 緯度 | 距離 | 源の回転の分: (C1) | (C1) の極限 | 6 点 | (C2) | (W) | 移動の分: (C1) | (C2) | (W) | (C2) ÷ (C1): 回転・移動 | (C2) ÷ (W): 回転・移動 |', '|---|---|---|---|---|---|---|---|---|---|---|---|',
    ...J.spinSrc.filter((r) => r.applicable && r.h === 0.1).map((r) => `| ${r.lat} | ${r.d} | ${vec(r.C1.rot)} | ${vec(r.C1lim.rot)} | ${vec(r.P6.rot)} | ${vec(r.C2.rot)} | ${vec(r.W.rot)} | ${vec(r.C1.mov)} | ${vec(r.C2.mov)} | ${vec(r.W.mov)} | ${f3(r.c2OverC1rot)}・${f3(r.c2OverC1mov)} | ${f3(r.c2OverWrot)}・${f3(r.c2OverWmov)} |`)].join('\n');
  T.spinOut = ['| 緯度 | 距離 | 腕 | 適用 | (C2) ÷ (W): 回転・移動 | 2 つの対の分け方の差(最大 —— 床 < 1e-9) |', '|---|---|---|---|---|---|',
    ...J.spinSrc.filter((r) => r.h !== 0.1).map((r) => r.applicable ? `| ${r.lat} | ${r.d} | ${r.h} | 内 | ${f3(r.c2OverWrot)}・${f3(r.c2OverWmov)} | ${['C1', 'C1lim', 'P6', 'C2', 'W'].every((k) => r[k].split < 1e-9) ? '< 1e-9' : '外'} |` : `| ${r.lat} | ${r.d} | ${r.h} | 外(腕の点が源の中) | — | — |`)].join('\n');
  T.body = ['| 天体 | 源 | β_S | 太陽由来 abs(Ω_S) [rad/年]: (C1)・(C2)・(C2) の球 | (C1) ÷ (C2)・(C2) の球 ÷ (C2)(太陽由来) | 同(銀河由来) | W1 の δ: (C1)・(C2)・(C2) の球・(C3) | W1 の歳差の率 [″/年]: (C1)・(C2)・(C2) の球・(C3) k 2/5 | W1 + 母天体の歳差の率: (C1)・(C2) | 比べる列 [″/年](文献の値・未照合) | (C2) の比 |', '|---|---|---|---|---|---|---|---|---|---|---|',
    ...J.body.map((r) => `| ${pairName(r)} | ${fe(r.betaS)} | ${fe(r.C1.SmagYr)}・${fe(r.C2.SmagYr)}・${fe(r.C2ball.SmagYr)} | ${f4(r.c1OverC2S)}・${f4(r.ballOverC2S)} | ${f4(r.c1OverC2G)}・${f4(r.ballOverC2G)} | ${f2(r.C1.W1.deltaDeg)}・${f2(r.C2.W1.deltaDeg)}・${f2(r.C2ball.W1.deltaDeg)}・${f2(r.C3.W1.deltaDeg)} | ${fe(r.C1.W1.precAsYr)}・${fe(r.C2.W1.precAsYr)}・${fe(r.C2ball.W1.precAsYr)}・${fe(r.C3.W1.precAsYr)} | ${r.C1.W1P ? fe(r.C1.W1P.precAsYr) + '・' + fe(r.C2.W1P.precAsYr) : '—'} | ${r.obsAsYr === null ? '—' : r.obsAsYr >= 1000 ? fe(r.obsAsYr) : r.obsAsYr} | ${fe(r.C2.W1.ratio)} |`)].join('\n');
  return T;
}
/** 数の文(節に逐語) */
export function factsOf(J) {
  const F = {}, S = J.pure.scenes, o = J.order, last = o[o.length - 1], SF = J.selfFactors;
  F.common = `共通の点検の場(源 m 1・R 1・速度 (0,1,0)・受け手 m 1・R 1・(4,0,0)・背景 0・在位の形・腕 0.01)で、x の直径の 2 点の差分の z 成分 ${f8(S.common.p2x)}・6 点の平均 ${f8(S.common.p6)}・(W) ${f8(S.common.w)}・(C2) の球の求積(半径 0.01)${f8(S.common.c2)}`;
  F.order = `(C2) と (W) の相対の差は球の半径 ÷ 距離の ${f3(Math.min(...o.slice(1).map((r) => r.ordC2W)))}〜${f3(Math.max(...o.slice(1).map((r) => r.ordC2W)))} 次で小さくなり(a ÷ 距離 ${last.aOverD} で ${fe(last.dC2W)})、(C2) ÷ (C1) は ${f4(o[0].c2OverC1)}(a ÷ 距離 ${o[0].aOverD})から ${f4(last.c2OverC1)}(${last.aOverD})へ寄る`;
  const bc = J.ballCheck[J.ballCheck.length - 1];
  F.self = `自分の重みが支配する極限の閉じた形: 腕の点の値 S(0) ÷ S(R) = ${f4(SF.surface)}・球の平均 ⟨S(0)/S(ρ)⟩ = ${f4(SF.ball1)}・⟨(S(0)/S(ρ))²⟩ = ${f4(SF.ball2)}。腕 ≪ 距離の通過(受け手の半径 ÷ 距離 ${bc.aOverD})で (C2) の球 ÷ (W) = ${f4(bc.ballOverW)}・(C1) の極限 ÷ (W) = ${f4(bc.c1limOverW)}`;
  F.out = `回転する源の配置 ${J.spinSrc.length} のうち、腕の点が源の中に入る ${J.outCount} 配置は適用の外(0 と置いて表に混ぜない)`;
  const eq = J.spinSrc.find((r) => r.applicable && r.lat === 0 && r.d === 10 && r.h === 0.1), mid = J.spinSrc.find((r) => r.applicable && r.lat === 45 && r.d === 10 && r.h === 0.1), po = J.spinSrc.find((r) => r.applicable && r.lat === 90 && r.d === 10 && r.h === 0.1);
  F.spin = `源の回転の分の z 成分(距離 10・腕 0.1): 赤道 (C1) ${fe(eq.C1.rot[2])}・(C2) ${fe(eq.C2.rot[2])}/中緯度 45° (C1) ${fe(mid.C1.rot[2])}・(C2) ${fe(mid.C2.rot[2])}/極 (C1) ${fe(po.C1.rot[2])}・(C2) ${fe(po.C2.rot[2])}`;
  const e = J.body.find((r) => r.id === 'Earth' && r.src === 'Sun');
  F.earth = `地球(太陽由来・主の場の組): (C1) ÷ (C2) = ${f4(e.c1OverC2S)}・(C2) の球 ÷ (C2) = ${f4(e.ballOverC2S)}・W1 の δ はどの読みでも ${f2(e.C2.W1.deltaDeg)}°・歳差の率 (C1) ${fe(e.C1.W1.precAsYr)}・(C2) ${fe(e.C2.W1.precAsYr)}・(C2) の球 ${fe(e.C2ball.W1.precAsYr)}・(C3) k 2/5 ${fe(e.C3.W1.precAsYr)}″/年(比べる列 ${e.obsAsYr}″/年 —— 文献の値・未照合)`;
  const mx = (k) => Math.max(...J.body.map((r) => Math.abs(r[k] - (k === 'c1OverC2S' ? 3 : SF.ball1))));
  F.bodyRatio = `15 組の太陽由来の比は (C1) ÷ (C2) が 3 から最大 ${fe(mx('c1OverC2S'))}・(C2) の球 ÷ (C2) が ⟨S(0)/S(ρ)⟩ から最大 ${fe(mx('ballOverC2S'))} の内・W1 の向きの読みの間の差は最大 ${fe(Math.max(...J.body.map((r) => Math.max(r.dirC1C2, r.dirBallC2))))}°`;
  return F;
}
