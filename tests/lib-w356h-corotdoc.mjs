// 第356便h(統括の検証項目 R520): **論文 4 の流れ「空間ごと回転して見えたのは引きずり」の文書の lib** —— 純関数(ファイルを読まない・import しない)。
//   正本 tests/out/corot-356h.json(器 tests/exp-w356h-corot.mjs)から表と数の文を作る。QA docs.corot356h が、PHYSICS〔第356便h〕と構成案の論文 4 の ⑨ がこの出力と逐語かを見る。
//   **量の候補の表・列の候補の表 —— 量も列も 1 つに絞らない・どの引きずりで読むかを書かない。**
export const DOC_VERSION = 'w356h-corotdoc-1';

/** 原仮定者の文(言葉を変えずに引く —— 出どころは日付で指す)。後の 6 つは〔第355便f〕の ② の表の字のまま */
export const ORIGINAL = Object.freeze([
  ['原仮定者の指示(2026-11-26)', '論文4は、思考実験「もしも銀河が空間ごと回転しているなら」から「空間ごと回転して見えたのは引きずり」と言う流れ'],
  ['原仮定者の回答(2026-11-22 —— 回答 5)', 'AN951: 論文4の思考実験は、「もしも銀河が空間ごと回転しているなら」。論文5の思考実験は、「もしも気体の圧力が粒子間の斥力なら」'],
  ['原仮定者の予定(〔第321便c〕に引いた文)', 'geoPN=4の予定: 処理を一新する。銀河の軸引きずりの知見から、銀河の回転引きずりを推定して、銀河のサンプルを作成する'],
  ['原仮定者の指示(2026-11-14)', '銀河を個々の天体でシミュレーションする事は不可能だが、流体とみなせばシミュレーションが出来る。それがgeoPN=4である'],
  ['原仮定者の指示(2026-11-14)', '長期的な安定については、軸引きずりが担う'],
  ['原仮定者の補足(2026-11-14 —— 補足 3)', '銀河では、背景宇宙は銀河の外なので注意'],
  ['原仮定者の回答(2026-11-22 —— 回答 5)', 'AN948:  Bで進める。論文4のgeoPN=4は、最近の検証結果を元に、新たに計算とサンプルを用意する。空間メッシュの表示も整理する'],
  ['原仮定者の回答(2026-11-22 —— 回答 6)', 'AN962〜AN964: 推奨で進める'],
]);
/** 〔第355便f〕の ② の表から引いた行の数(ORIGINAL の後ろの 6 つ) */
export const FROM_355F = 6;
export function originalTable() {
  return ['| 出どころ | 原文 |', '|---|---|', ...ORIGINAL.map(([s, o]) => `| ${s} | 「${o}」 |`)].join('\n');
}
/** 統括の読み(原文と分ける) */
export const READ = Object.freeze([
  '入口の思考実験の文は変えない。',
  '「空間ごと回転」は入口の読み(銀河の円盤が、空間と一緒に回っているように見える)。結びは、その見え方を、引きずりの定義(〔第330便b〕以降 —— 並進引きずり・軸引きずり・円盤引きずり・距離の則)で読む側に置く。',
  '列を選ぶ文ではない(〔第355便f〕の表 5c の列 A・B・C は候補のまま —— どの列を主にするかは、粒の数を上げた表の後に伺う)。ただし、本文の筋の結びは「引きずり」に置く。',
  '「どの引きずりで読むか」は未。',
]);
export function readList() { return READ.map((r, i) => `${i + 1}. ${r}`).join('\n'); }

/** 量の候補の定義(表 —— 式を決め打ちしない) */
export const QDEF = Object.freeze([
  ['(i) 一緒に回る度合い —— 角速度の散り', 'omSpread', '帯(円柱の半径の質量の順の割合 [0.1, 0.3]・[0.3, 0.5]・[0.5, 0.7]・[0.7, 0.9] —— 〔第355便f〕の帯)ごとの Ω_b = ⟨v_φ⟩_b ÷ ⟨R⟩_b から (Ω_max − Ω_min) ÷ |Ω の平均|', '0 なら剛体のように一緒に回る見え方(半径に依らない角速度)・大きいほど差動の回転'],
  ['(i) 一緒に回る度合い —— 回転曲線の log の傾き', 'slope4', '4 つの帯の ln⟨v_φ⟩_b を ln⟨R⟩_b に最小二乗で当てた傾き(帯の ⟨v_φ⟩ が 1 つでも 0 以下なら欄を空ける)', '剛体 +1・平坦 0・ケプラー −1/2(物差し —— 判定に使わない)'],
  ['(ii) 面内の速さの向きの、円運動からのずれ', 'dirDev', '粒ごとの角 θ = atan2(|v_R|, v_φ) の質量の重みの平均(度 —— 重心の枠)', '順回りの円運動 0°・動径の向き 90°・逆回りの円運動 180°'],
  ['(iii) 外縁の速さ', 'outer', '帯 [0.7, 0.9] の ⟨v_φ⟩(〔第355便f〕の量 —— 効果は対照との比 − 1)', '平坦な回転曲線の読みに使う量(〔第355便f〕から続く)'],
]);
export function qdefTable() {
  return ['| 量の候補 | 器の名 | 定義 | 読みの物差し |', '|---|---|---|---|', ...QDEF.map((r) => '| ' + r.join(' | ') + ' |')].join('\n');
}

export const RUN_JA = Object.freeze({
  G0: 'G0 対照(重力だけ)',
  A1: 'A1 中心の 1 つの源(列 A)',
  A2: 'A2 内の和(列 A)',
  B1: 'B1 対の和・全成分(列 B)',
  B2: 'B2 対の和・中心方向(列 B)',
  C1: 'C1 λ × A2 + (1 − λ) × B2(列 C・λ 0.5)',
});
const MJ = { disk: '円盤', ellip: '楕円の型' };
const f3 = (x) => (x === null || x === undefined ? '—' : x === 0 ? '0' : Number(x).toPrecision(3));
const sgn3 = (x) => (x === null || x === undefined ? '—' : x === 0 ? '0' : (x > 0 ? '+' : '−') + Math.abs(x).toPrecision(3));

/** 表 1 対照の絶対の値(粒 192・種 3 の平均 ± 種の間の差の最大) */
export function ctrlTable(J) {
  const k4 = ['omSpread', 'slope4', 'dirDev', 'outer'], c = (v) => (!v ? '—' : `${sgn3(v.mean)} ± ${f3(v.spread)}${v.n < 3 ? `(種 ${v.n})` : ''}`);
  const lines = ['| 模型 | 時刻 | (i) 角速度の散り | (i) 回転曲線の log の傾き | (ii) 円運動からの向きのずれ(度) | (iii) 外縁の速さ |', '|---|---|---|---|---|---|'];
  for (const r of J.ctrl) for (const [t, q] of [['0', r.start], [`終わり(T ${J.decl.T})`, r.end]]) lines.push(`| ${MJ[r.model]} | ${t} | ${k4.map((k) => c(q[k])).join(' | ')} |`);
  return lines.join('\n');
}
/** 表 2 列ごとの効果 ± 幅(効果 ÷ 幅・幅の内/幅の外) */
const cell = (w, nSeeds) => (!w ? '—(片方の粒の数で、帯の ⟨v_φ⟩ が 0 以下の走りだけ)' : `${sgn3(w.effect)} ± ${f3(w.width)}(${w.ratio === null ? '幅の床の下' : w.ratio.toFixed(1)} —— ${w.beyond ? '幅の外' : '幅の内'}${w.nHi < nSeeds || w.nLo < nSeeds ? `・欄の在る走り ${w.nLo + w.nHi}/${2 * nSeeds}` : ''})`);
export function diagTable(J) {
  const nS = J.decl.seeds.length;
  const lines = ['| 模型 | 列 | γ | (i) 角速度の散り | (i) 回転曲線の log の傾き | (ii) 円運動からの向きのずれ(度) | (iii) 外縁の速さの比 − 1 |', '|---|---|---|---|---|---|---|'];
  for (const e of J.eff) lines.push(`| ${MJ[e.model]} | ${RUN_JA[e.col]} | ${e.gamma} | ${['omSpread', 'slope4', 'dirDev', 'outerRatio'].map((k) => cell(e.w[k], nS)).join(' | ')} |`);
  return lines.join('\n');
}
/** 表 3 零試験 */
export function pureTable(J) {
  const S = J.pure.scenes, G = J.pure.gates;
  const rows = [
    ['① 押しの係数 0 で、どの列も対照(重力だけ)と同じ量(8 步 —— 量 4 つの相対の差の最大)', Object.entries(S.gamma0).map(([k, v]) => `${k} ${v}`).join('・'), G.gamma0],
    ['② 剛体の回転を置いた作りものの円盤(20 粒・半径の段 6 つ): 角速度の散り・log の傾き・向きのずれ', `${f3(S.rigid.omSpread)}・${f3(S.rigid.slope4)}・${f3(S.rigid.dirDev)}`, G.rigid],
    ['③ ケプラーの円盤の log の傾き(と角速度の散り)・平坦の円盤の log の傾き', `${sgn3(S.kepler.slope4)}(${f3(S.kepler.omSpread)})・${f3(S.flat.slope4)}`, G.kepler],
    ['④ 外縁の速さが〔第355便f〕の measureAt の外縁と同じ(円盤・楕円の型の初期 —— 相対の差)', `${S.outer.disk}・${S.outer.ellip}`, G.outer],
    ['⑤ 向きのずれの物差し(順回りの円運動・動径・逆回りの円運動 —— 度)', `${f3(S.dir.pro)}・${f3(S.dir.rad)}・${f3(S.dir.retro)}`, G.dir],
    ['⑥ 幅の算術が〔第355便f〕の widthOf と同じ(作った効果 —— 相対の差の最大)', String(S.width), G.width],
    ['⑦ 対照どうしの効果(散り・傾き・向き・外縁の比)', `${S.self.omSpread}・${S.self.slope4}・${S.self.dirDev}・${S.self.outerRatio}`, G.self],
    ['⑧ 入力の拒否', `${S.reject.n}/${S.reject.of}`, G.reject],
  ];
  return ['| 零試験 | 値 | 門 |', '|---|---|---|', ...rows.map(([a, b, g]) => `| ${a} | ${b} | ${g ? '真' : '偽'} |`)].join('\n');
}
/** 数の文(表の数から作る —— 節と構成案に逐語) */
export function factsOf(J) {
  const E = J.eff, D = J.decl, nm = { omSpread: '(i) 角速度の散り', slope4: '(i) 回転曲線の log の傾き', dirDev: '(ii) 円運動からの向きのずれ', outerRatio: '(iii) 外縁の速さの比' };
  const per = Object.keys(nm).map((k) => { const has = E.filter((e) => e.w[k]), out = has.filter((e) => e.w[k].beyond);
    return `${nm[k]} ${has.length} 組のうち ${has.length - out.length} 組${out.length ? `(幅の外: ${out.map((e) => `${MJ[e.model]} ${e.col}(γ ${e.gamma})`).join('・')})` : ''}`; });
  const nIn = E.reduce((s, e) => s + Object.keys(nm).filter((k) => e.w[k] && !e.w[k].beyond).length, 0), nAll = E.reduce((s, e) => s + Object.keys(nm).filter((k) => e.w[k]).length, 0);
  const cd = J.ctrl.find((c) => c.model === 'disk'), ce = J.ctrl.find((c) => c.model === 'ellip');
  return {
    inWidth: `この器(粒 ${D.Ns.join('・')}・種 ${D.seeds.length}・押しの係数 ${D.gammas.join('・')})では、効果 ÷ 幅が ${D.effOverWidth} より小さい「幅の内」の欄は ${nAll} のうち ${nIn}: ${per.join('/')}。`,
    ctrl: `対照(重力だけ・粒 ${cd.N}・種 ${D.seeds.length} の平均)の終わりの量: 円盤 —— 角速度の散り ${f3(cd.end.omSpread.mean)}・log の傾き ${sgn3(cd.end.slope4 && cd.end.slope4.mean)}・向きのずれ ${f3(cd.end.dirDev.mean)}°/楕円の型 —— 角速度の散り ${f3(ce.end.omSpread.mean)}・向きのずれ ${f3(ce.end.dirDev.mean)}°(剛体の物差しは散り 0・傾き +1・向きのずれ 0°)。`,
    slope: `回転曲線の log の傾きは、帯の ⟨v_φ⟩ が 1 つでも 0 以下の走りで欄が空く —— 列の欄が在るのは ${E.filter((e) => e.w.slope4).length}/${E.length} 組。`,
  };
}
/** 流れ(構成案の ⑨ と節に同じ字) */
export function flowText(J) {
  const F = factsOf(J);
  return [
    '1. **入口の思考実験**「もしも銀河が空間ごと回転しているなら」(原文のまま —— 変えない)。',
    '2. **「空間ごと回転して見える」とは何を指すか** —— 量の候補を並べる(式を決め打ちしない): (i) 一緒に回る度合い(角速度の散りと回転曲線の log の傾き)・(ii) 面内の速さの向きの、円運動からのずれ・(iii) 外縁の速さ(〔第355便f〕の量)。',
    `3. **候補の列(表 5c)での数** —— 対照・列 A・列 B・列 C を同じ器で並べた(PHYSICS〔第356便h〕の表 2)。${F.inWidth}`,
    '4. **結び「空間ごと回転して見えたのは引きずり」** —— 入口の見え方を、引きずりの定義(並進引きずり・軸引きずり・円盤引きずり・距離の則)で読む側に置く。どの引きずりで読むか・どの列を主にするかは未(粒の数を上げた数え直しの後に伺う)。',
  ].join('\n');
}
/** 未の一覧 */
export const OPEN = Object.freeze([
  'どの引きずりで読むか(並進引きずり・軸引きずり・円盤引きずり・距離の則のどれか、または和)',
  '主の列(表 5c の列 A・B・C —— 候補のまま)',
  '粒の数を上げた数え直し(粒 384 以上 —— いまの粒 96・192 では幅の内の欄が多い)',
  '流体の要素への軸引きずりの口(〔第333便b〕の差分を流体の要素へ入れる器 —— 原仮定者の指示(2026-11-14)の長期的な安定の量に要る)',
  '「空間ごと回転して見える」をどの量で読むか(量の候補 (i)・(ii)・(iii) —— 決断事項の候補)',
  '背景(銀河の外)を有限に置く列(原仮定者の補足 3)',
]);
export function openList() { return OPEN.map((o) => `- 未: ${o}`).join('\n'); }
/** 決断事項の候補(伺う文の案 —— 推奨と次点) */
export function askText(J) {
  const F = factsOf(J);
  return [
    '**伺う文の案 1。** 「論文 4 の「空間ごと回転して見える」は、どの量で読みますか((i) 一緒に回る度合い —— 角速度の散りと回転曲線の log の傾き/(ii) 円運動からの向きのずれ/(iii) 外縁の速さ)」。',
    '- 推奨: (i)(散りが 0・傾きが +1 で「剛体のように一緒に回る」に当たる物差しを持つ —— 入口の文の「空間ごと」の読みに近い)。次点: (iii)(〔第355便f〕から続く量・平坦な回転曲線の読みに使う)。(ii) は形の守り(円運動が崩れていないか)として並べる。推奨は量の定義の性質からで、数からではない。',
    `- 数: ${F.inWidth}`,
    '**伺う文の案 2。** 「「空間ごと回転して見えたのは引きずり」の引きずりは、どの引きずりで読みますか」—— **数が足りないので推奨を出さない**(いまの器の列は並進引きずりの型と、系の回転を源に置く型だけ —— 流体の要素への軸引きずり・円盤引きずりの口が無い)。',
  ].join('\n');
}
/** ノブの表(PHYSICS の節 —— 6 列) */
export function knobTable(J) {
  const nm = { omSpread: '角速度の散り', slope4: 'log の傾き', dirDev: '向きのずれ', outerRatio: '外縁の速さの比' };
  const out = (k) => J.eff.filter((e) => e.w[k] && e.w[k].beyond).map((e) => `${MJ[e.model]} ${e.col} γ ${e.gamma}`);
  const hit = Object.keys(nm).filter((k) => out(k).length).map((k) => `${nm[k]}(${out(k).join('・')} で幅の外)`).join('・') || '—';
  const none = Object.keys(nm).filter((k) => !out(k).length).map((k) => nm[k]).join('・') || '—';
  return ['| ノブの名 | 何を満たすために足したか | 既定と振った範囲 | 効いた量 | 効かなかった量 | 状態 |', '|---|---|---|---|---|---|',
    `| 「空間ごと回転して見える」量の候補(第356便h) | 論文 4 の流れの「見え方」を数える量を並べる | (i) 角速度の散り・回転曲線の log の傾き・(ii) 円運動からの向きのずれ・(iii) 外縁の速さ(列と押しの係数と粒と種は〔第355便f〕の格子のまま) | ${hit} | ${none}(全部の組で幅の内) | 候補 |`].join('\n');
}
export function tablesOf(J) {
  return { orig: originalTable(), qdef: qdefTable(), ctrl: ctrlTable(J), diag: diagTable(J), pure: pureTable(J), flow: flowText(J), ask: askText(J), knob: knobTable(J), open: openList(), read: readList() };
}
