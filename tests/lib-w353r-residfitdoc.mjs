// 第353便r(原仮定者の回答(2026-11-25 —— 第151報)・統括の検証項目 R482):
// **正本 tests/out/residfit-353r.json から PHYSICS〔第353便r〕の表を作る文書の lib**
// (QA docs.residfit353r が節の表と逐語で照合する —— 表の数は有効数字 3 桁)。原文(言葉を変えずに引く)と読みの表もここに持つ。
export const DOC_VERSION = 'w353r-residfitdoc-1';
const fin = (x) => typeof x === 'number' && Number.isFinite(x);
const fe = (x) => (x === Infinity ? '∞' : !fin(x) ? '—' : x === 0 ? '0' : Number(x).toExponential(2));
const fs3 = (x) => (!fin(x) ? '—' : x === 0 ? '0' : (x > 0 ? '+' : '') + Number(x).toPrecision(3));
const fp3 = (x) => (!fin(x) ? '—' : Number(x).toPrecision(3));
const tf = (x) => (x === true ? '真' : x === false ? '偽' : '—');
const yn = (x) => (x === true ? 'はい' : x === false ? 'いいえ' : '—');
const fl9 = (x) => (!fin(x) ? '—' : x === 0 ? '0' : x < 1e-12 ? '< 1e-12' : Number(x).toExponential(1));
const iv = (a, b) => '[' + fs3(a) + ', ' + fs3(b) + ']';
const MOON = Object.freeze({ fixed: 'リポジトリの向き(固定)', ecl: '黄道の面', avg: '18.6 年の平均' });
const EM = Object.freeze({ none: '円', repo: '離心率の倍' });
const PM = Object.freeze({ digit: '最後の桁 + 1σ', all: '最後の桁 + 角 0.01° + 1σ' });
const BODY = Object.freeze({ Earth: '地球', Mars: '火星', Venus: '金星', Mercury: '水星', Jupiter: '木星', Saturn: '土星' });
const PICK = Object.freeze({ lo: '下端', mid: '中', hi: '上端' });
const FK = Object.freeze({ 'Sun|-': '太陽', 'Earth|Sun': '地球', 'Mars|Sun': '火星', 'Jupiter|Sun': '木星' });

/** 原文(言葉を変えずに引く) */
export const ORIGINAL = Object.freeze([
  Object.freeze(['原仮定者の回答(2026-11-25 —— 第151報)', '歳差の率: 潮汐を併用『「重力の側の潮汐のトルク」は、仮の値の 3〜11% の内に並びます。』']),
  Object.freeze(['原仮定者の回答(2026-11-25 —— 第151報)', 'AN1052: イ']),
  Object.freeze(['原仮定者の回答(2026-11-25 —— 第151報)', 'AN1032: 「順回転なら、歳差運動は逆回転になる」。「こまの式」と同じで、自転軸を回転軸に向けようとすると、逆回転で歳差運動する。「これまでの向き」を読み違えていた']),
]);
/** 統括の読み(原文と分ける)—— [読み, 数えた所] */
export const READINGS = Object.freeze([
  Object.freeze(['歳差の率は、重力の側の潮汐のトルクの列(比べる列 —— DFM の式ではない)を基準に置き、軸引きずりを足す形で読む。基準の列の置き方(月の道・離心率の倍)で、軸引きずりに残る余地がどれだけ動くかを本節で数える', '表 2・表 5']),
  Object.freeze(['イ = 重力の側の列を基準に、軸引きずりは残り・向き・円錐・打ち消しを受け持つ小さい項。残りを埋める向きの天体で、要る応答の係数を入力の幅つきの区間にし、地球と火星の区間が重なるかを数える', '表 2・表 3・表 4']),
  Object.freeze(['歳差の式の主の列は (g2−) = −Ω × ŝ。〔第353便m〕で、18.6 年の平均の月の道の列では (g2−) が地球の残りを埋める向きになった —— その列で地球と火星を同じ値で読めるかを数える', '表 2・表 3']),
]);
export function originalTable(readings = READINGS) {
  return ['| # | 出どころ | 原文(言葉を変えずに引く) | 読み(統括の読み —— 原文と分ける) | 数えた所 |', '|---|---|---|---|---|',
    ...ORIGINAL.map(([src, o], k) => `| ${k + 1} | ${src} | 「${o}」 | ${readings[k][0]} | ${readings[k][1]} |`)].join('\n');
}

export function tablesOf(J) {
  const T = {}, S = J.pure.scenes, G = J.pure.gates;
  T.pure = ['| 零試験・場面 | 値 | 門 |', '|---|---|---|',
    `| ① 要る c(幅なし)= 〔第353便m〕の earthFill(固定・黄道の面・18.6 年の平均・平均 + 離心率の倍)| ${S.cE.fixed}・${S.cE.ecl}・${S.cE.avg}・${S.cE.avgE}(相対差 ${fl9(Math.max(...S.cErr))}) | ${tf(G.cIsM)} |`,
    `| ② 火星・金星の要る c = 〔第353便f〕の sumRow | ${S.cM}・${S.cV}(相対差 ${fl9(Math.max(...S.fErr))}) | ${tf(G.cIsF)} |`,
    `| ③ 幅: 最後の桁 + 角の振れ = 〔第353便m〕の widthParts・質量と距離の振れ = digitSwing(6 つの置き方)| ${S.pert.Earth}・${S.pert.Mars}・${S.pert.Venus} ″/年(相対差 ${fl9(Math.max(...S.wErr, ...S.dErr))}) | ${tf(G.widthIsM)} |`,
    `| ④ 火星・金星の離心率 = 〔第299便c〕の PLANETS・重力の列の比 = (1 − e²)^(−3/2) | ${fl9(Math.max(...S.eErr, ...S.facErr))} | ${tf(G.eccRepo)} |`,
    `| ⑤ 区間の算術(下端 ≤ 中心 ≤ 上端・幅 0 で端が中心・X = c × u・u に反比例)と上限 = 〔第353便f〕の cUpper | ${S.ar.filter(Boolean).length}/${S.ar.length}・${fl9(Math.max(...S.upErr))} | ${tf(G.interval)} |`,
    `| ⑥ 区間の重なり(3 つの場面) | ${JSON.stringify(S.ov).replace(/\|/g, '¦')} | ${tf(G.overlap)} |`,
    `| ⑦ 統括の数え直し 3: 基準軸 L の成分の差の最大・ω_G・金星の φ(規則の半径) | ${fe(S.Lerr)}・${fe(S.omegaG)} rad/s・${Number(S.phiV).toFixed(4)}° | ${tf(G.anchor3)} |`,
    `| ⑧ u 0.98 の傾きを保つ f の上限 = 〔第353便e〕の fMaxAt(太陽・地球・火星・木星) | ${Object.values(S.fA).join('・')} | ${tf(G.fMaxIsE)} |`,
    `| ⑨ 拒否 | ${S.rejects.filter(Boolean).length}/${S.rejects.length} | ${tf(G.rejects)} |`].join('\n');
  T.need = ['| 受け手 | 月の道 | 1 公転の平均の 1/r³ | 幅の置き方 | 残り = 仮 − 重力 [″/年](仮・未照合) | 幅 [″/年] | 内訳: J2 と係数の桁・質量と距離の桁・角・1σ | 要る c(u 0.98) | c の区間 | X = c × u の区間 | 区間が 0 を含むか(上限としてだけ) |', '|---|---|---|---|---|---|---|---|---|---|---|',
    ...J.t1.rows.map((r) => `| ${BODY[r.id]} | ${r.id === 'Earth' ? MOON[r.moon] : '—'} | ${EM[r.ecc]} | ${PM[r.pert]} | ${fs3(r.resid)} | ${fe(r.width)} | ${fe(r.parts.digitY)}・${fe(r.parts.digitMD)}・${fe(r.parts.angle)}・${fe(r.parts.sig)} | ${fs3(r.cNeed)} | ${iv(r.cLo, r.cHi)} | ${iv(r.xLo, r.xHi)} | ${yn(r.inWidth)} |`)].join('\n');
  T.pair = ['| 地球の月の道 | 地球の 1/r³ | 火星の 1/r³ | 幅の置き方 | 地球の X の区間 | 火星の X の区間 | 重なり(共通の X の範囲) | 要る c の比 地球 ÷ 火星(中心) | 比の区間 | 隙間 ÷ 火星の中心 | 同じ置き方の組か |', '|---|---|---|---|---|---|---|---|---|---|---|',
    ...J.t1pair.rows.map((r) => `| ${MOON[r.moon]} | ${EM[r.eccE]} | ${EM[r.eccM]} | ${PM[r.pert]} | ${iv(r.xE[0], r.xE[1])} | ${iv(r.xM[0], r.xM[1])} | ${r.both ? iv(r.both[0], r.both[1]) : 'なし'} | ${fs3(r.ratio)} | ${fin(r.ratioLo) ? iv(r.ratioLo, r.ratioHi) : '—'} | ${fp3(r.gapRel)} | ${yn(r.main)} |`)].join('\n');
  T.common = ['| 組(地球の月の道・1/r³) | X の点 | X = c × u | c 1 のときの背景の倍率 ÷ 窓の上端 0.835 | 傾きを保つ f の上限(太陽・地球・火星・木星) | 太陽の歳差の一周 [年] | 年齢の内の周の数 | u 0.98 のときの要る c | 金星の X の区間に入るか | 予告: 水星・木星・土星の軸引きずり [″/年](÷ 重力の列) |', '|---|---|---|---|---|---|---|---|---|---|',
    ...J.t2.rows.map((r) => `| ${MOON[r.moon]}・${EM[r.eccE]} | ${PICK[r.pick]} | ${fp3(r.X)} | ${fp3(r.overWinTop)} | ${Object.keys(FK).map((k) => fe(r.fMax[k])).join('・')} | ${fe(r.sunPeriodYr)} | ${fp3(r.sunTurnsAge)} | ${fp3(r.cAtU098)} | ${yn(r.venusIn)} | ${['Mercury', 'Jupiter', 'Saturn'].map((id) => fs3(r.prev[id].drag) + '(' + fe(r.prev[id].ratio) + ')').join('・')} |`)].join('\n');
  T.cand = ['| 組(地球の月の道・1/r³) | 構造の量の式の候補 | 地球の値 | 火星の値 | 地球 ÷ 火星 | 要る c の比の区間 | 区間に入るか | 地球の中心の c ÷ 地球の値 |', '|---|---|---|---|---|---|---|---|',
    ...J.t2cand.rows.map((r) => `| ${MOON[r.moon]}・${EM[r.eccE]} | ${r.label} | ${fe(r.vE)} | ${fe(r.vM)} | ${fp3(r.ratio)} | ${fin(r.ratioLo) ? iv(r.ratioLo, r.ratioHi) : '—'} | ${yn(r.inside)} | ${fe(r.scaleE)} |`)].join('\n');
  T.zero = ['| 重力の側の基準の列(月の道・1/r³) | 地球の残り [″/年] | 幅 [″/年] | 0 と区別できるか | 軸引きずりに残る余地 abs(残り) + 幅 [″/年] | (g2−) で埋める向きか | 要る c の上限(u 0.98) |', '|---|---|---|---|---|---|---|',
    ...J.t3.rows.map((r) => `| ${MOON[r.moon]}・${EM[r.ecc]} | ${fs3(r.resid)} | ${fe(r.width)} | ${yn(r.distinct)} | ${fe(r.room)} | ${yn(r.fill)} | ${fp3(r.cUpper)} |`)].join('\n');
  return T;
}
/** 数の文(正本から作る —— 節に逐語) */
export function factsOf(J) {
  const F = {}, n = (id, moon, ecc, pert) => J.t1.rows.find((r) => r.id === id && (id !== 'Earth' || r.moon === moon) && r.ecc === ecc && r.pert === pert);
  const p = (moon, eE, eM, pert) => J.t1pair.rows.find((r) => r.moon === moon && r.eccE === eE && r.eccM === eM && r.pert === pert);
  const eA = n('Earth', 'avg', 'none', 'digit'), mA = n('Mars', null, 'none', 'digit'), eE = n('Earth', 'avg', 'repo', 'digit'), mE = n('Mars', null, 'repo', 'digit'), v = n('Venus', null, 'none', 'digit');
  const p1 = p('avg', 'none', 'none', 'digit'), p2 = p('avg', 'repo', 'repo', 'digit'), pa = p('avg', 'none', 'none', 'all');
  F.need = `- 18.6 年の平均の月の道・円の列で、地球の要る c は ${fs3(eA.cNeed)}(区間 ${iv(eA.cLo, eA.cHi)} —— 幅 ${fe(eA.width)} ″/年のうち質量と距離の最後の桁が ${fe(eA.parts.digitMD)})・火星は ${fs3(mA.cNeed)}(区間 ${iv(mA.cLo, mA.cHi)} —— 幅 ${fe(mA.width)} のうち仮の値の 1σ ${fe(mA.parts.sig)})。`
    + ` 地球の区間は中心の ±${fp3(100 * (eA.cHi - eA.cNeed) / eA.cNeed)}%・火星は ±${fp3(100 * (mA.cHi - mA.cNeed) / mA.cNeed)}%。**地球の区間は火星の区間を中に含む** —— 2 つの数が近い(比 ${fs3(p1.ratio)})ことは、地球の入力の幅では、比の区間 ${iv(p1.ratioLo, p1.ratioHi)} の中の 1 点。`;
  F.pair = `- 共通の値 X = c × u で 2 つの残りを同時に幅の内に入れられる範囲は、同じ置き方の組で 円 ${iv(p1.both[0], p1.both[1])}(角の幅も足すと ${iv(pa.both[0], pa.both[1])})・離心率の倍 ${iv(p2.both[0], p2.both[1])}。`
    + ` **離心率の倍は火星の要る c も ${fs3(mA.cNeed)} → ${fs3(mE.cNeed)} に動かす**(火星の離心率 ${J.decl.ecc.Mars} —— 太陽の項が (1 − e²)^(−3/2) 倍)。地球と火星で置き方をそろえない組(片方だけ離心率の倍)は重ならない。月の道を固定・黄道の面に置く組は、地球の要る c が負(埋めない向き)で重ならない。`
    + ` 金星の X の区間は ${iv(v.xLo, v.xHi)}(残りが幅の内 —— 上限としてだけ)で、どちらの共通の値も内に在る。`;
  const c1 = J.t2.rows.find((r) => r.eccE === 'none' && r.pick === 'mid'), c2 = J.t2.rows.find((r) => r.eccE === 'repo' && r.pick === 'mid');
  F.common = `- 共通の値の中(円 ${fp3(c1.X)}・離心率の倍 ${fp3(c2.X)})を、(i) 応答の係数 1 で背景の倍率に置くと、窓の上端 0.835 の ${fp3(c1.overWinTop)} 倍・${fp3(c2.overWinTop)} 倍(窓の外)・傾きを保つ f の上限は地球で ${fe(c1.fMax['Earth|Sun'])}・${fe(c2.fMax['Earth|Sun'])}(u 0.98 の 8.53e-4 から X に反比例して下がる)・太陽の歳差の一周は ${fe(c1.sunPeriodYr)}・${fe(c2.sunPeriodYr)} 年(年齢の内に ${fp3(c1.sunTurnsAge)}・${fp3(c2.sunTurnsAge)} 周)。`
    + ` (ii) 背景を 0.98 のままに置くと、要る応答の係数は ${fp3(c1.cAtU098)}・${fp3(c2.cAtU098)}。(iii) 同じ X で、予告の軸引きずり(家の極・比べる数なし)は 水星 ${fs3(c1.prev.Mercury.drag)}・木星 ${fs3(c1.prev.Jupiter.drag)}・土星 ${fs3(c1.prev.Saturn.drag)} ″/年(円の組)—— 重力の列(太陽だけ)の ${fe(c1.prev.Mercury.ratio)}・${fe(c1.prev.Jupiter.ratio)}・${fe(c1.prev.Saturn.ratio)} 倍。`;
  const cr = (eccE, cand) => J.t2cand.rows.find((r) => r.eccE === eccE && r.cand === cand), z = J.t3;
  F.cand = `- 構造の量の式の候補で、地球 ÷ 火星の比が要る c の比の区間(円 ${iv(p1.ratioLo, p1.ratioHi)})に入るのは (イ) 1 ÷ ω(${fp3(cr('none', 'i').ratio)})と (P-応) の率の倍(${fp3(cr('none', 'Presp').ratio)})・入らないのは (ウ)(${fp3(cr('none', 'u').ratio)})と (ウ′)(${fp3(cr('none', 'uJ').ratio)})。離心率の倍の組では区間が 0 を跨ぐので (ウ′) も入る。`
    + ` (P-応) の率の倍だけで要る c を作るには、地球で ${fp3(cr('none', 'Presp').scaleE)} 倍(円)・${fp3(cr('repo', 'Presp').scaleE)} 倍(離心率の倍)が別に要る。`
    + ` 表 5: 地球の残りは基準の列の置き方で ${fe(Math.max(...z.rows.map((r) => Math.abs(r.resid))))}〜${fe(Math.min(...z.rows.map((r) => Math.abs(r.resid))))} ″/年(${fp3(z.residSpread)} 倍)・軸引きずりに残る余地(abs(残り) + 幅)は ${fp3(z.roomSpread)} 倍動く。0 と区別できないのは 18.6 年の平均 + 離心率の倍の列だけ。`;
  return F;
}
