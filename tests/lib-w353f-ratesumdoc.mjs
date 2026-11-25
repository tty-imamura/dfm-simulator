// 第353便f(原仮定者の回答(2026-11-25 —— 第151報)・統括の検証項目 R470):
// **正本 tests/out/ratesum-353f.json から PHYSICS〔第353便f〕の表を作る文書の lib**
// (QA docs.ratesum353f が節の表と逐語で照合する —— 表の数は有効数字 3 桁)。原文(言葉を変えずに引く)と読みの表もここに持つ。
export const DOC_VERSION = 'w353f-ratesumdoc-1';
const fin = (x) => typeof x === 'number' && Number.isFinite(x);
const fe = (x) => (x === Infinity ? '∞' : !fin(x) ? '—' : x === 0 ? '0' : Number(x).toExponential(2));
const fs3 = (x) => (!fin(x) ? '—' : x === 0 ? '0' : (x > 0 ? '+' : '') + Number(x).toPrecision(3));
const tf = (x) => (x === true ? '真' : x === false ? '偽' : '—');
const yn = (x) => (x === true ? 'はい' : x === false ? 'いいえ' : '—');
const fl12 = (x) => (!fin(x) ? '—' : x === 0 ? '0' : x < 1e-12 ? '< 1e-12' : Number(x).toExponential(1));
const BODY = Object.freeze({ Earth: '地球', Mars: '火星', Venus: '金星', Mercury: '水星', Jupiter: '木星', Saturn: '土星' });
const POLE = Object.freeze({ ecl: '黄道の極', orb: '自分の公転の北極', L: '基準軸 L', eq: '基準軸 eq', om: '合成の軸' });
const SENSE = Object.freeze({ g2m: '(g2−) 主', g2p: '(g2+) 比べる列' });
const VS = Object.freeze({ tide: '重力の列と同じ回り(仮定)', anti: '逆の回り(仮定)' });
const bodyOf = (r) => BODY[r.id] + (r.id === 'Venus' ? '(' + VS[r.venusSense] + ')' : '');

/** 原文(言葉を変えずに引く) */
export const ORIGINAL = Object.freeze([
  Object.freeze(['原仮定者の回答(2026-11-25 —— 第151報)', '歳差の率: 潮汐を併用『「重力の側の潮汐のトルク」は、仮の値の 3〜11% の内に並びます。』']),
  Object.freeze(['原仮定者の回答(2026-11-25 —— 第151報)', 'AN1052: イ']),
  Object.freeze(['原仮定者の回答(2026-11-25 —— 第151報)', 'AN1032: 「順回転なら、歳差運動は逆回転になる」。「こまの式」と同じで、自転軸を回転軸に向けようとすると、逆回転で歳差運動する。「これまでの向き」を読み違えていた']),
  Object.freeze(['原仮定者の回答(2026-11-25 —— 第151報)', 'AN1033: 「太陽系の基準軸の向き」。「観測値は釣り合った結果」なので、観測値に沿った方式を採用する']),
]);
/** 統括の読み(原文と分ける)—— [読み, 数えた所] */
export const READINGS = Object.freeze([
  Object.freeze(['歳差の率は、重力の側の潮汐のトルクの列(比べる列 —— DFM の式ではない)を基準に置き、軸引きずりを足す形で読む。本節は 2 つを符号つきの方位の率として同じ極に投影して足す', '表 3・表 4']),
  Object.freeze(['イ = 重力の側の列を基準に、軸引きずりは残り・向き・円錐・打ち消しを受け持つ小さい項。本節は残り(仮の値 − 重力の列)に軸引きずりが入る余地を、符号つきで数える', '表 3・表 4']),
  Object.freeze(['歳差の式の主の列は (g2−) = −Ω × ŝ(合成の軸のまわりで自転と逆の回り)。(g2+) は比べる列として並べる', '表 3・表 5']),
  Object.freeze(['背景の向きの主の列は (N+) 太陽系の基準軸の向き(基準軸は L)。足すときの「同じ極」の候補に、基準軸 L と合成の軸を入れる', '表 5']),
]);
export function originalTable(readings = READINGS) {
  return ['| # | 出どころ | 原文(言葉を変えずに引く) | 読み(統括の読み —— 原文と分ける) | 数えた所 |', '|---|---|---|---|---|',
    ...ORIGINAL.map(([src, o], k) => `| ${k + 1} | ${src} | 「${o}」 | ${readings[k][0]} | ${readings[k][1]} |`)].join('\n');
}

export function tablesOf(J) {
  const T = {}, S = J.pure.scenes, G = J.pure.gates;
  T.pure = ['| 零試験・場面 | 値 | 門 |', '|---|---|---|',
    `| ① 重力の列(家の極)= 第352便u の rateOf の (T-g)(相対差の最大)・地球〔太陽 + 月〕・火星・金星 | ${fl12(Math.max(...Object.values(S.gravErr)))}・${fs3(S.grav.Earth)}・${fs3(S.grav.Mars)}・${fs3(S.grav.Venus)} ″/年 | ${tf(G.gravIsU)} |`,
    `| ② 符号つきの残り = sign(重力の列) × 第352便y の残り(相対差の最大) | ${fl12(Math.max(...Object.values(S.residErr)))} | ${tf(G.residIsY)} |`,
    `| ③ 軸引きずり (g2+)・c 1・(N+) L・u 1 の方位の率 = 第352便q の unitRate | ${fl12(S.unitErr)} | ${tf(G.unitIsQ)} |`,
    `| ④ 局所の (S)(規則の半径・k 1)= 第352便q の localS | ${fl12(S.locErr)} | ${tf(G.localIsQ)} |`,
    `| ⑤ 合成の軸のまわりの方位の率 = ∓ c abs(Ω)・相対の回り (g2−) −1・(g2+) +1 | ${fl12(Math.max(...S.closed))}・${S.relM}・${S.relP} | ${tf(G.closedForm)} |`,
    `| ⑥ (g2−) = −(g2+)・c に比例・u に比例(局所を外した列) | ${fl12(Math.max(S.flipErr, S.cLin, S.uLin))} | ${tf(G.flipLinear)} |`,
    `| ⑦ 統括の数え直し 3: 基準軸 L の成分の差の最大・ω_G・金星の φ(規則の半径) | ${fe(S.Lerr)}・${fe(S.omegaG)} rad/s・${Number(S.phiV).toFixed(4)}° | ${tf(G.anchor3)} |`,
    `| ⑧ 和の算術(和 = 重力 + 軸引きずり・足した後の差・要る c × c 1 の率 = 残り) | ${fl12(Math.max(S.sumErr, S.afterErr, S.needErr))} | ${tf(G.sumArith)} |`,
    `| ⑨ 仮の値の符号(地球 −ψ_A の率・火星・金星の 2 つの置き方) | ${S.provSign.map(fs3).join('・')} | ${tf(G.provSign)} |`,
    `| ⑩ 上限の算術 | ${S.cu.map(fe).join('・')} | ${tf(G.cUpper)} |`,
    `| ⑪ 拒否 | ${S.rejects.filter(Boolean).length}/${S.rejects.length} | ${tf(G.rejects)} |`].join('\n');
  // 表 3: 符号つきの率
  T.sign = ['| 受け手(仮の値の向き) | 歳差の式 | u | 極 | 仮の値 [″/年](仮・未照合) | 重力の列 [″/年](比べる列) | 残り = 仮 − 重力 | 軸引きずり c 1 [″/年] | 重力の列と同じ回りか | 合成の軸のまわりの相対の回り | 残りを埋める向きか | 要る c(符号つき) |', '|---|---|---|---|---|---|---|---|---|---|---|---|',
    ...J.t1.rows.map((r) => `| ${bodyOf(r)} | ${SENSE[r.sense]} | ${r.u} | ${POLE[r.pole]} | ${fs3(r.prov)} | ${fs3(r.tide)} | ${fs3(r.resid)} | ${fs3(r.drag1)} | ${yn(r.sameAsTide)} | ${r.rel > 0 ? '同じ' : r.rel < 0 ? '逆' : '—'} | ${yn(r.fillSense)} | ${fs3(r.cNeed)} |`)].join('\n');
  // 表 4: 上限
  T.upper = ['| 受け手(仮の値の向き) | 歳差の式 | u | abs(残り) [″/年] | 入力の桁の幅 [″/年](第352便y の振れの和) | 仮の値の幅 [″/年] | c の上限(abs(残り) ÷ abs(c 1 の率)) | 幅の下端・上端で | 残りが幅の内(0 と区別できない) |', '|---|---|---|---|---|---|---|---|---|',
    ...J.t2.rows.map((r) => `| ${bodyOf(r)} | ${SENSE[r.sense]} | ${r.u} | ${fe(r.residAbs)} | ${fe(r.swing)} | ${r.sigmaKind === 'none' ? '—' : fe(r.sigma)} | ${fe(r.cMax)} | ${fe(r.cLo)}・${fe(r.cHi)} | ${yn(r.residZeroIn)} |`)].join('\n');
  T.ratio = ['| 受け手(仮の値の向き) | 歳差の式 | u | 第352便q の要る係数の比(地球 1 —— 仮の値の全部を一様な背景で) | 本表の要る c の比(地球 1 —— 残りだけを軸引きずりで) |', '|---|---|---|---|---|',
    ...J.t2.ratio.map((r) => `| ${bodyOf(r)} | ${SENSE[r.sense]} | ${r.u} | ${r.needQ} | ${fe(r.cRatio)} |`)].join('\n');
  // 表 5: 極の取り方
  T.pole = ['| 受け手 | 極 | 重力の列 [″/年] | 軸引きずり(主の列・u 0.98・c 1)[″/年] | 軸引きずり ÷ 重力の列 | 同じ回りか | abs(極 × ŝ)(小さいと方位の率が大きく出る) |', '|---|---|---|---|---|---|---|',
    ...J.t3.rows.map((r) => `| ${BODY[r.id]} | ${POLE[r.pole]} | ${fs3(r.tide)} | ${fs3(r.drag)} | ${fs3(r.ratio)} | ${yn(r.same)} | ${fe(r.sinPole)} |`)].join('\n');
  // 表 6: 予告
  T.preview = ['| 受け手 | 極 | 重力の列 [″/年](比べる列) | abs(dŝ/dt) [″/年] | 軸引きずり (g2−) c 1: u 0.0487・0.835・0.98 [″/年] | 軸引きずり ÷ 重力の列(u 0.98) | abs(極 × ŝ) |', '|---|---|---|---|---|---|---|',
    ...J.t4.rows.map((r) => `| ${BODY[r.id]} | ${POLE[r.pole]} | ${fs3(r.tide)} | ${fe(r.tideMag)} | ${r.drag.map(fs3).join('・')} | ${r.dragOverTide ? fs3(r.dragOverTide[2]) : '—'} | ${fe(r.sinPole)} |`)].join('\n');
  return T;
}
/** 数の文(正本から作る —— 節に逐語) */
export function factsOf(J) {
  const F = {}, r1 = (id, vs, sense, u) => J.t1.rows.find((r) => r.id === id && (r.venusSense || 'tide') === vs && r.sense === sense && r.u === u);
  const e = r1('Earth', 'tide', 'g2m', 0.98), m = r1('Mars', 'tide', 'g2m', 0.98), v = r1('Venus', 'tide', 'g2m', 0.98), va = r1('Venus', 'anti', 'g2m', 0.98);
  F.sign = `- 家の極で、符号つきの残り(仮 − 重力)は 地球 ${fs3(e.resid)}・火星 ${fs3(m.resid)}・金星 ${fs3(v.resid)}(金星を逆の回りに置くと ${fs3(va.resid)})″/年。主の列 (g2−)・u 0.98・c 1 の軸引きずりは 地球 ${fs3(e.drag1)}・火星 ${fs3(m.drag1)}・金星 ${fs3(v.drag1)} ″/年 —— 地球と火星では重力の列と同じ回り、金星では逆の回り(金星の自転軸は (N+) の背景とほぼ逆向き)。`
    + ` (g2−) で c > 0 のとき残りを埋める向きになるのは 火星 ${yn(m.fillSense)}・金星 ${yn(v.fillSense)}・地球 ${yn(e.fillSense)}(地球は重力の列の方が大きく、同じ回りの率を足すと差が広がる —— 埋める向きは (g2+) か c < 0)。`;
  const up = (id, vs, sense, u) => J.t2.rows.find((r) => r.id === id && (r.venusSense || 'tide') === vs && r.sense === sense && r.u === u);
  const ue = up('Earth', 'tide', 'g2m', 0.98), um = up('Mars', 'tide', 'g2m', 0.98), uv = up('Venus', 'tide', 'g2m', 0.98), ue0 = up('Earth', 'tide', 'g2m', 0.0487), um0 = up('Mars', 'tide', 'g2m', 0.0487), uv0 = up('Venus', 'tide', 'g2m', 0.0487);
  F.upper = `- 「軸引きずりの方位の率 ≤ abs(残り)」の c の上限は、u 0.98 で 地球 ${fe(ue.cMax)}・火星 ${fe(um.cMax)}・金星 ${fe(uv.cMax)}、u 0.0487 で ${fe(ue0.cMax)}・${fe(um0.cMax)}・${fe(uv0.cMax)}(どれも単位の応答 1 の倍)。`
    + ` 金星の残り ${fe(uv.residAbs)} ″/年は、入力の桁の幅 ${fe(uv.swing)} と仮の値の幅 ${fe(uv.sigma)} の和の内(0 と区別できない —— 上限だけ)。地球・火星の残りは幅の外。要る c の比(地球 1)は 火星 ${fe(J.t2.ratio.find((r) => r.id === 'Mars' && r.sense === 'g2m' && r.u === 0.98).cRatio)}・金星 ${fe(J.t2.ratio.find((r) => r.id === 'Venus' && r.venusSense === 'tide' && r.sense === 'g2m' && r.u === 0.98).cRatio)}(第352便q の 0.151・0.885 とはそろわない)。`;
  const pr = (id) => J.t3.rows.filter((r) => r.id === id), sameAll = (id) => (pr(id).every((r) => r.same === true) ? '5 つの極で同じ回り' : pr(id).every((r) => r.same === false) ? '5 つの極で逆の回り' : '極で回りが替わる'), rng = (xs) => { const a = xs.filter(fin).map(Math.abs); return fe(Math.min(...a)) + '〜' + fe(Math.max(...a)); };
  F.pole = `- 極を替えたときの「軸引きずり ÷ 重力の列」は、地球 ${rng(pr('Earth').map((r) => r.ratio))}・火星 ${rng(pr('Mars').map((r) => r.ratio))}(地球 ${sameAll('Earth')}・火星 ${sameAll('Mars')})・金星 ${rng(pr('Venus').map((r) => r.ratio))}(${sameAll('Venus')})。`
    + ` 金星の重力の列は、黄道の極で ${fs3(pr('Venus').find((r) => r.pole === 'ecl').tide)}・公転の北極で ${fs3(pr('Venus').find((r) => r.pole === 'orb').tide)}・基準軸 L で ${fs3(pr('Venus').find((r) => r.pole === 'L').tide)} ″/年(自転軸が極の近くに在り abs(極 × ŝ) が ${rng(pr('Venus').map((r) => r.sinPole))} —— 方位の率の符号と大きさが極で替わる)。`;
  const pv = (id, p) => J.t4.rows.find((r) => r.id === id && r.pole === p);
  F.preview = `- 予告(仮の値なし —— 比べる数を置かない): 黄道の極で、重力の列 水星 ${fs3(pv('Mercury', 'ecl').tide)}・木星 ${fs3(pv('Jupiter', 'ecl').tide)}・土星 ${fs3(pv('Saturn', 'ecl').tide)} ″/年、軸引きずり (g2−) u 0.98 c 1 は ${fs3(pv('Mercury', 'ecl').drag[2])}・${fs3(pv('Jupiter', 'ecl').drag[2])}・${fs3(pv('Saturn', 'ecl').drag[2])} ″/年(比 ${fe(Math.abs(pv('Mercury', 'ecl').dragOverTide[2]))}・${fe(Math.abs(pv('Jupiter', 'ecl').dragOverTide[2]))}・${fe(Math.abs(pv('Saturn', 'ecl').dragOverTide[2]))})。水星の公転の北極は自転軸に近く(abs(極 × ŝ) ${fe(pv('Mercury', 'orb').sinPole)})、方位の率が ${fs3(pv('Mercury', 'orb').tide)} ″/年と大きく出る。木星・土星の重力の列は太陽だけ(衛星の分は入れていない)。`;
  return F;
}
