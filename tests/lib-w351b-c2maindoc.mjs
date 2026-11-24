// 第351便b(原仮定者の回答(2026-11-24 —— 第147報)AN1000・統括の検証項目 R428):
// **正本 tests/out/c2main-351b.json から PHYSICS〔第351便b〕の表を作る文書の lib**
// (QA docs.c2main351b が節の表と逐語で照合する —— 表の数は有効数字 3 桁・比は小数 4 桁・角は指数の 3 桁)。原文(言葉を変えずに引く)と、読みの名の表もここに持つ。
export const DOC_VERSION = 'w351b-c2maindoc-1';
const fe = (x) => (x === null || x === undefined || !Number.isFinite(x) ? '—' : x === 0 ? '0' : Number(x).toExponential(2));
const f4 = (x) => (x === null || x === undefined || !Number.isFinite(x) ? '—' : Number(x).toFixed(4));
const f3 = (x) => (x === null || x === undefined || !Number.isFinite(x) ? '—' : Number(x).toFixed(3));
const f2 = (x) => (x === null || x === undefined || !Number.isFinite(x) ? '—' : Number(x).toFixed(2));
const f8 = (x) => (x === null || x === undefined || !Number.isFinite(x) ? '—' : Number(x).toFixed(8));
const ang = (x) => (x === null || x === undefined || !Number.isFinite(x) ? '—' : x === 0 ? '0' : x < 1e-3 ? '< 1e-3' : Number(x).toPrecision(3));
const tf = (x) => (x === true ? '真' : x === false ? '偽' : '—');
const qs = (q) => (q >= 1000 ? Number(q).toExponential(0) : String(q));
const NM = Object.freeze({ Mercury: '水星', Venus: '金星', Earth: '地球', Mars: '火星', Jupiter: '木星', Saturn: '土星', Uranus: '天王星', Neptune: '海王星', Moon: '月', Io: 'イオ', Pluto: '冥王星',
  Sun: '太陽', EarthHi: '地球(傾きの最大の位相)', EarthLo: '地球(傾きの最小の位相)', Charon: 'カロン' });
const pairName = (r) => `${NM[r.id]} | ${NM[r.src]}`;

/** 原文(言葉を変えずに引く) */
export const ORIGINAL = Object.freeze([
  Object.freeze(['原仮定者の回答(2026-11-24 —— 第147報)', 'AN1000: C2で進める。係数はノブにする']),
  Object.freeze(['原仮定者の整理(2026-11-23 —— 第146報)', '軸引きずりの回転は、引きずられる側の、源に近い点と遠い点の並進引きずりから、球体に換算して計算する']),
  Object.freeze(['原仮定者の回答(2026-11-18 —— 第141報 AN790)', '天体の特性を表す係数のノブにする']),
]);
/** 統括の読み(原文と分ける)—— [読み, 数えた所] */
export const READINGS = Object.freeze([
  Object.freeze(['主の列 = (C2) 球全体の剛体回転への平均(天体の表は球の半径の平均)。(C1)・(W)・(C3) は比べる列として残す。「係数」= 換算の係数 k(既定 1)—— 局所の球体換算(太陽・母天体由来の項)にだけ掛け、宣言した背景の角速度には掛けない。k の値は選ばない', '表 2〜表 6']),
  Object.freeze(['「球体に換算」の読みの 1 つ (C2) が主の列になった(第350便b の 3 つの読みの表は当時の列として残す —— 第350便b の lib と表が「(C2)」と書いている列は、本節では中心の渦度の半分 (W) と書き分ける)', '表 2・表 3']),
  Object.freeze(['天体の特性の係数 C_b(〔第341便b〕—— ずれの率に掛ける)と本節の換算の係数 k が同じノブか別のノブかは決めない(対応の列を 1 つ置く)', '表 5・ノブの表']),
]);
export function originalTable(readings = READINGS) {
  return ['| # | 出どころ | 原文(言葉を変えずに引く) | 読み(統括の読み —— 原文と分ける) | 数えた所 |', '|---|---|---|---|---|',
    ...ORIGINAL.map(([src, o], k) => `| ${k + 1} | ${src} | 「${o}」 | ${readings[k][0]} | ${readings[k][1]} |`)].join('\n');
}
/** 読みの名の書き分け(本節) */
export const NAME_TABLE = ['| 本節の名 | 中身 | 第350便b の lib・表での名 | 本節の役 |', '|---|---|---|---|',
  '| (C2) | 球全体の剛体回転への平均(一般の場は `c2Quad`・天体の表は球の半径の平均 —— 自分の重みを半径 ρ の値に置いた ½ ∇×u の重み 5ρ⁴ ÷ R⁵ の平均) | 「(C2) の球」(`C2ball`) | **主の列** |',
  '| (W) | 中心の渦度の半分(自分の重みは中心の値) | 「(C2)」(`C2` —— 一次の場の値) | 比べる列 |',
  '| (C1) | 2 点の差分(= (P2) —— 自分の重みは腕の点の値) | 「(C1)」 | 比べる列 |',
  '| (C3) | 係数 2/5 × (C1) | 「(C3) k 2/5」 | 比べる列(本節の換算の係数 k とは別 —— k 2/5 の列は (C2) に掛ける) |'].join('\n');

export function tablesOf(J) {
  const T = {}, S = J.pure.scenes, G = J.pure.gates, Cm = J.decl.common;
  T.pure = ['| 零試験・場面 | 値 | 門 |', '|---|---|---|',
    `| ① 第350便b の門 8 つ(共通の点検の数・対称・剛体回転・ずれ・求積・閉じた形・変異・拒否)を呼ぶ —— 主を (C2) に替えた後も残る | ${Object.values(S.g350).filter(Boolean).length}/${S.g350n} | ${tf(G.gate350b)} |`,
    `| ② 純粋なずれ u = (y, x, 0): (C2) の大きさ(半径 0.01・0.4 —— 床 < 1e-12)・(C1) の大きさ(x の直径) | 0・0・${f3(S.shear.c1)} | ${tf(G.shear)} |`,
    `| ③ 剛体回転 u = (1,2,3) × r: (C2)(半径 0.01・0.4)と Ω₀ の相対の差(床 < 1e-12) | < 1e-12 | ${tf(G.rigid)} |`,
    `| ④ 共通の点検の数(自転しない源の通過 —— x の直径の 2 点の差分・6 点の平均・(W) の z 成分、統括の数え直しの数 ${Cm.p2x}・${Cm.p6}・${Cm.w} と 5e-9 の内)・(C2) の z | ${f8(S.common.p2x)}・${f8(S.common.p6)}・${f8(S.common.w)}・${f8(S.common.c2)} | ${tf(G.common)} |`,
    `| ⑤ 球の求積 \`c2Quad\` と一次の展開 \`c2Ball\` の差の次数(腕 ≪ 距離・受け手の半径 ÷ 距離の次数 —— 下限 2) | ${S.ords.map(f3).join('・')} | ${tf(G.ballOrder)} |`,
    `| ⑥ 換算の係数 k の掛け先: k 2 で局所だけ 2 倍・背景は不変/k 0 で合計 = 背景/k 0・背景 0 で合成の向きが決まらない(第350便e の \`composeBal\`) | 真・真・真 | ${tf(G.kTarget)} |`,
    `| ⑦ 一様な剛体の場 u = Ω₀ × r を局所の入力に入れると (C2) が Ω₀ を返す —— 同じ背景を宣言の項でも足すと合計 2 Ω₀(二度数えの分 ÷ Ω₀) | ${f4(S.twice.excess)} | ${tf(G.twice)} |`,
    `| ⑧ 変異: 背景にも k を掛ける/k を掛けない → ⑥ で落ちる | ${f4(S.mut.kOnBgBg)}/${f4(S.mut.noKDouble)} | ${tf(G.mutants)} |`,
    `| ⑨ 書き直した口の照合: 球の内側の等価な半径は第350便b の \`equivR\` と同じ・境で 1.5 R・外は 1.5 ρ | 0・0・0 | ${tf(G.rewrite)} |`,
    `| ⑩ 入力の拒否(局所の項なし・長さ 2・背景の長さ 2・k −1・k NaN・半径 0・ŝ の長さ 2) | ${S.rejects.filter(Boolean).length}/${S.rejects.length} | ${tf(G.rejects)} |`].join('\n');
  T.switch = ['| 天体 | 源 | β_S | 太陽由来 abs(Ω_S) [rad/年]: (C2)・(W)・(C1) | (W1)(母天体の項がある組は W1 + 母天体)の歳差の率 [″/年]: (C2)・(W)・(C1)・(C3) k 2/5 | (C2) ÷ (C1)・(C2) ÷ (W)・(C2) ÷ (C3) | 合成の向きの差 [°]: (C2) と (C1)・(C2) と (W) | 同じ合成の δ [°] | 比べる列 [″/年](文献の値・未照合) | 比べる列との比: (C2)・(C1) |', '|---|---|---|---|---|---|---|---|---|---|',
    ...J.switch.map((r) => `| ${pairName(r)} | ${fe(r.betaS)} | ${fe(r.SmagYr.C2)}・${fe(r.SmagYr.W)}・${fe(r.SmagYr.C1)} | ${fe(r.prec.C2)}・${fe(r.prec.W)}・${fe(r.prec.C1)}・${fe(r.prec.C3)} | ${f4(r.c2OverC1)}・${f4(r.c2OverW)}・${f4(r.c2OverC3)} | ${ang(r.dirC2C1)}・${ang(r.dirC2W)} | ${f2(r.delta.C2)} | ${r.obsAsYr === null ? '—' : r.obsAsYr >= 1000 ? fe(r.obsAsYr) : r.obsAsYr} | ${fe(r.obsRatioC2)}・${fe(r.obsRatioC1)} |`)].join('\n');
  T.k = ['| 天体 | 背景 (B2) の倍率(銀河の公転の角速度の倍・向き −1) | 換算の係数 k | 局所の項 abs(k Ω_C2) [rad/年] | 背景 abs(Ω_bg) [rad/年] | 合成の向き | 歳差の率 [″/年] | δ [°] | ŝ と Ω の cos | 起こす率 [″/年](経路 ① 係数 1) | 回転軸へ寄る率 [″/年] |', '|---|---|---|---|---|---|---|---|---|---|---|',
    ...J.k.map((r) => `| ${NM[r.id]} | ${r.mult} | ${r.k} | ${fe(r.localYr)} | ${fe(r.bgYr)} | ${r.undetermined ? '決まらない' : '在る'} | ${fe(r.precAsYr)} | ${f2(r.deltaDeg)} | ${f3(r.cos)} | ${fe(r.raiseAsYr)} | ${fe(r.toAxisAsYr)} |`)].join('\n');
  T.degen = ['| 天体 | q(引きずられ半径 ÷ 規則の半径 —— k の列は k = q) | c_R((ii) の引きずられ半径 ÷ 観測半径) | 歳差の率 [″/年] 背景なし: k・(ii)・(i) | (ii) ÷ k・(i) ÷ k | (C2) ÷ (W): k・(ii)・(i) | 歳差の率 [″/年] (B2) 倍率 1: k・(ii) | 合成の向きの差 [°] (ii) と k: (B2)・(B1) | 銀河を源とした項 ÷ 太陽由来: k・(ii) |', '|---|---|---|---|---|---|---|---|---|',
    ...J.degen.map((r) => `| ${NM[r.id]} | ${qs(r.q)} | ${fe(r.cR)} | ${fe(r.k.precNone)}・${fe(r.ii.precNone)}・${fe(r.i.precNone)} | ${f4(r.iiOverK)}・${f4(r.iOverK)} | ${f4(r.k.c2OverW)}・${f4(r.ii.c2OverW)}・${fe(r.i.c2OverW)} | ${fe(r.k.precB2)}・${fe(r.ii.precB2)} | ${fe(r.dirB2iiK)}・${fe(r.dirB1iiK)} | ${fe(r.galOverSunK)}・${fe(r.galOverSunII)} |`)].join('\n');
  T.overlap = ['| 天体 | (ii) ÷ k が 1 から 1% の内の q(格子の内) | (ii) ÷ k の範囲 | (i) ÷ k が 1 から 1% の内の q | (i) ÷ k の範囲 |', '|---|---|---|---|---|',
    ...J.overlap.map((r) => `| ${NM[r.id]} | ${r.iiN ? qs(r.iiQmin) + '〜' + qs(r.iiQmax) + '(' + r.iiN + ' 点)' : '—'} | ${fe(r.iiOverKmin)}〜${f4(r.iiOverKmax)} | ${r.iQ.map(qs).join('・') || '—'} | ${fe(r.iOverKmin)}〜${f4(r.iOverKmax)} |`)].join('\n');
  T.self = ['| 天体 | 源 | 太陽由来 abs(Ω_S) [rad/年]: 中心 (W)・腕の点・球の平均 (C2) | 腕の点 ÷ 中心・球の平均 ÷ 中心 | 向きの差 [°]: 腕の点・球の平均(中心に対して) |', '|---|---|---|---|---|',
    ...J.self.map((r) => `| ${pairName(r)} | ${fe(r.centerYr)}・${fe(r.armYr)}・${fe(r.ballYr)} | ${f4(r.armOverCenter)}・${f4(r.ballOverCenter)} | ${ang(r.armDir)}・${ang(r.ballDir)} |`)].join('\n');
  return T;
}
/** 数の文(節に逐語) */
export function factsOf(J) {
  const F = {}, S = J.pure.scenes, e = J.switch.find((r) => r.id === 'Earth' && r.src === 'Sun');
  F.earth = `地球(太陽由来・在位の形・(W1)): 歳差の率 (C2) ${fe(e.prec.C2)}・(W) ${fe(e.prec.W)}・(C1) ${fe(e.prec.C1)}・(C3) k 2/5 ${fe(e.prec.C3)}″/年 —— (C2) は (C1) の ${f4(e.c2OverC1)} 倍(比べる列 ${e.obsAsYr}″/年との比は (C2) ${fe(e.obsRatioC2)}・(C1) ${fe(e.obsRatioC1)} —— 文献の値・未照合・合わせていない)`;
  const mxd = Math.max(...J.switch.map((r) => Math.max(r.dirC2C1, r.dirC2W)));
  F.switch = `15 組とも (C2) ÷ (C1) = ${f4(Math.min(...J.switch.map((r) => r.c2OverC1)))}〜${f4(Math.max(...J.switch.map((r) => r.c2OverC1)))}・(C2) ÷ (W) = ${f4(Math.min(...J.switch.map((r) => r.c2OverW)))}〜${f4(Math.max(...J.switch.map((r) => r.c2OverW)))}・合成の向きの読みの間の差は最大 ${fe(mxd)}°`;
  const k0 = J.k.find((r) => r.id === 'Earth' && r.mult === 1 && r.k === 0), k1 = J.k.find((r) => r.id === 'Earth' && r.mult === 1 && r.k === 1), k2 = J.k.find((r) => r.id === 'Earth' && r.mult === 1 && r.k === 2);
  F.k = `地球・背景 (B2) 倍率 1: k 0 で歳差の率 ${fe(k0.precAsYr)}″/年(背景だけ —— 起こす率 ${fe(k0.raiseAsYr)}″/年)・k 1 で ${fe(k1.precAsYr)}・k 2 で ${fe(k2.precAsYr)}″/年。k 0 と背景 0 の行は ${J.k.filter((r) => r.undetermined).length} 行とも合成の向きが決まらない`;
  const v0 = J.k.find((r) => r.id === 'Venus' && r.mult === 1 && r.k === 0), v1 = J.k.find((r) => r.id === 'Venus' && r.mult === 1 && r.k === 1), v4 = J.k.find((r) => r.id === 'Venus' && r.mult === 1 && r.k === 0.4);
  F.venus = `金星・背景 (B2) 倍率 1 の起こす率: k 0 で ${fe(v0.raiseAsYr)}・k 2/5 で ${fe(v4.raiseAsYr)}・k 1 で ${fe(v1.raiseAsYr)}″/年(符号が k の格子の内で入れ替わる)`;
  const o = J.overlap.find((r) => r.id === 'Earth'), d1e4 = J.degen.find((r) => r.id === 'Earth' && r.q === 1e4), d1e8 = J.degen.find((r) => r.id === 'Earth' && r.q === 1e8);
  F.degen = `地球: (ii) c_R の列と k の列の歳差の率(背景なし)の比は q ${qs(o.iiQmin)}〜${qs(o.iiQmax)} で 1 から 1% の内(c_R ≤ ${fe(J.degen.find((r) => r.id === 'Earth' && r.q === o.iiQmax).cR)})・q 1e4 で ${f4(d1e4.iiOverK)}・q 1e8 で ${f4(d1e8.iiOverK)}。(i) 腕だけの列の (C2) ÷ (W) は q 1e4 で ${fe(d1e4.i.c2OverW)}(k と (ii) は ${f4(d1e4.k.c2OverW)}・${f4(d1e4.ii.c2OverW)})`;
  F.common = `共通の点検の数(自転しない源の通過): x の直径の 2 点の差分 ${f8(S.common.p2x)}・6 点の平均 ${f8(S.common.p6)}・(W) ${f8(S.common.w)}・(C2)(球の求積・半径 0.01)${f8(S.common.c2)}。球の求積と一次の展開の差の次数 ${S.ords.map(f3).join('・')}`;
  F.self = `自分の重みの置き方(15 組): 腕の点 ÷ 中心 ${f4(Math.min(...J.self.map((r) => r.armOverCenter)))}〜${f4(Math.max(...J.self.map((r) => r.armOverCenter)))}・球の平均 ÷ 中心 ${f4(Math.min(...J.self.map((r) => r.ballOverCenter)))}〜${f4(Math.max(...J.self.map((r) => r.ballOverCenter)))}(閉じた形 1.5・${f4(J.selfFactors.ball1)})`;
  return F;
}
