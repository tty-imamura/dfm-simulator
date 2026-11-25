// 第355便f(統括の検証項目 R509): **新しい geoPN=4 の計算の候補の列の表(表 5c)と、低 N の診断の表・伺う文の案の文書の lib** —— 純関数(ファイルを読まない)。
//   正本 tests/out/g4cols-355f.json(器 tests/exp-w355f-g4cols.mjs)から表を作る。QA docs.g4cols355f が、PAPER_PLAN の表 5c と PHYSICS〔第355便f〕の表がこの出力と逐語かを見る。
//   **候補の表 —— 列を 1 つに絞らない・採否を書かない。**
export const DOC_VERSION = 'w355f-g4colsdoc-1';

/** 原仮定者の文(言葉を変えずに引く —— 出どころは日付か、文を引いた公開の節で指す) */
export const ORIGINAL = Object.freeze([
  ['原仮定者の予定(〔第321便c〕に引いた文)', 'geoPN=4の予定: 処理を一新する。銀河の軸引きずりの知見から、銀河の回転引きずりを推定して、銀河のサンプルを作成する'],
  ['原仮定者の指示(2026-11-14)', '銀河を個々の天体でシミュレーションする事は不可能だが、流体とみなせばシミュレーションが出来る。それがgeoPN=4である'],
  ['原仮定者の指示(2026-11-14)', '長期的な安定については、軸引きずりが担う'],
  ['原仮定者の補足(2026-11-14 —— 補足 3)', '銀河では、背景宇宙は銀河の外なので注意'],
  ['原仮定者の回答(2026-11-22 —— 回答 5)', 'AN948:  Bで進める。論文4のgeoPN=4は、最近の検証結果を元に、新たに計算とサンプルを用意する。空間メッシュの表示も整理する'],
  ['原仮定者の回答(2026-11-22 —— 回答 6)', 'AN962〜AN964: 推奨で進める'],
]);
export function originalTable() {
  return ['| 出どころ | 原文 |', '|---|---|', ...ORIGINAL.map(([s, o]) => `| ${s} | 「${o}」 |`)].join('\n');
}

/** 列の名(原仮定者の語 —— 軸引きずり・円盤引きずり・並進引きずり・流体)と、器の列への写し */
export const COL_NAMES = Object.freeze({
  A: '(列 A)場の契約の続き —— 軸引きずりの知見から円盤引きずりを推し量る',
  B: '(列 B)引きずりの定義をそのまま流体に —— 並進引きずり・軸引きずり・距離の則',
  C: '(列 C)両方 —— ノブで切り替え',
});
export const COL_RUN = Object.freeze({ A1: 'A', A2: 'A', B1: 'B', B2: 'B', C1: 'C' });
export const RUN_JA = Object.freeze({
  G0: 'G0 対照(重力だけ)',
  A1: 'A1 中心の 1 つの源(自転 = 系の L_z ÷ Σ m R²)',
  A2: 'A2 内の和(受け手より内の要素 —— 自転 = 内の L_z ÷ Σ m R²)',
  B1: 'B1 対の和・全成分(共通の分母)',
  B2: 'B2 対の和・中心方向(運動量と角運動量を保つ型)',
  C1: 'C1 λ × A2 + (1 − λ) × B2(λ 0.5)',
});
const f3 = (x) => (x === null || x === undefined ? '—' : x === 0 ? '0' : Number(x).toPrecision(3));
const sgn3 = (x) => (x === null || x === undefined ? '—' : x === 0 ? '0' : (x > 0 ? '+' : '−') + Math.abs(x).toPrecision(3));

/** 表 5c(PAPER_PLAN の表 5b の隣・PHYSICS〔第355便f〕にも同じ字) */
export function table5c(J) {
  const c = J.copied;
  const bVals = `〔第340便g〕乱数の並び・N 256・差動回転・自己の重み B(種 ${c.f340.n} の平均): 自己の分け前 ${f3(c.f340.shareMean)}・外縁の速さの比 ${f3(c.f340.outerRatio)}/〔第337便e〕N 256・B: 自己の分け前 ${f3(c.f337.shareMean)}・半質量半径の変化 ${sgn3(c.f337.effR50)}(正本の写し)`;
  const rows = [
    [COL_NAMES.A, '〔第321便c〕・〔第322便c〕・〔第329便b〕(場の契約の版 2)・〔第311便b〕・〔第327便b〕',
      '要素は場の受け手(場の契約の位置と速度で読む)。自己の重みは〔第337便e〕の B を借りる(低 N の器では時刻 0 の k 近傍の密度で固定)',
      '軸引きずり → 円盤引きずりの推し量り(系の回転を 1 つの源の自転に置く —— 中心の点・内の和)・距離の則(内の和)。ノブ: 押しの係数 γ(0.1・0.3)・源の取り方(中心の点・内の和)。背景(銀河の外)は 0 —— 有限に置く列は未。太陽系から大きさを持ち込むなら「主の列の換算の係数」で引く(数は未 —— 枝 b の後)',
      '外縁の速さの比・回転曲線の形(平坦の判定)・長い走りでの形の保ち(r50・c/a・L_z)・離散化の誤差の幅(効果 ÷ 幅)',
      '未(〔第321便c〕〔第322便c〕〔第329便b〕の数は場の契約の数 —— 流体の要素の上で数えた値は無い)',
      '場の契約の版 2 の受け手を流体の要素にする口(器)・新しい銀河の本・アプリの geoPN=4 の積分(アプリを変える)',
      '器 1〜2 便 + 本 1 便(アプリを変える便は別)'],
    [COL_NAMES.B, '〔第330便b〕(距離の則の重み)・〔第332便b〕(並進引きずり)・〔第333便b〕(軸引きずりの定義)・〔第332便a〕(円盤引きずり)・〔第337便l〕〔第338便b〕〔第347便e〕(2 倍角の則)・〔第337便e〕〔第340便g〕(流体の要素)・〔第334便e〕(離散化の床)',
      '要素の数 N(解像の要素 —— 低 N の器は 96・192)・自己の重み B(体積の内の積分 —— 〔第337便e〕の主の候補)・標本の並び(乱数 —— 〔第340便g〕は準一様とガラスも)・刻み(〔第340便g〕の慣性の項 τ)',
      '並進引きずり(対の和 —— 全成分・中心方向)・距離の則(重み 質量 ÷ 距離²)。軸引きずり(〔第333便b〕の差分)・円盤引きずり・2 倍角の則は流体の要素の口が無い(未)。ノブ: γ(0.1・0.3)・型(全成分・中心方向)。背景(銀河の外)は 0',
      '同じ(外縁の速さの比・平坦の判定・形の保ち・効果 ÷ 幅)',
      bVals,
      '流体の要素への軸引きずり(差分)・円盤引きずり・2 倍角の則の口(器)・新しい銀河の本・アプリの geoPN=4 の積分(アプリを変える)',
      '器 1 便(口を足す)+ 本 1 便(アプリを変える便は別)'],
    [COL_NAMES.C, '列 A と列 B の節の全部',
      '列 A・列 B と同じ(同じ要素の上で 2 つの引きずりを和にする)',
      '列 A の内の和と列 B の中心方向の和を割合 λ で足す(λ 1 で列 A・λ 0 で列 B —— 零試験)。ノブ: λ(低 N の器は 0.5)・γ(0.1・0.3)',
      '同じ + λ を振ったときの量の動き',
      '未',
      '列 A と列 B の口の両方・λ の格子の器・新しい銀河の本・アプリの geoPN=4 の積分(アプリを変える)',
      '列 A と列 B の後に器 1 便 + 本 1 便'],
  ];
  return ['| 列の名 | 元にする節 | 流体の要素の作り | 使う引きずりの項とノブ | 低 N の診断で測れる量 | いま在る器で数えた値 | 足りない器・本 | 見積り |',
    '|---|---|---|---|---|---|---|---|', ...rows.map((r) => '| ' + r.join(' | ') + ' |')].join('\n');
}

/** 表 2: 低 N の診断(本枝の器)—— 模型 × 列 × γ の効果(列 − 対照)± 幅(効果 ÷ 幅)と平坦の判定の数 */
export const EFF_SHOW = Object.freeze([['outerRatio', '外縁の速さの比 − 1'], ['dR50', 'r50 の変化'], ['dCa', 'c/a の変化'], ['dR50late', 'r50 の変化(短い窓から)'], ['dLz', 'L_z の変化']]);
const cell = (w) => (!w ? '—' : `${sgn3(w.effect)} ± ${f3(w.width)}(${w.ratio === null ? '幅の床の下' : w.ratio.toFixed(1)}${w.beyond ? ' —— 幅より大きい' : ''})`);
export function diagTable(J) {
  const head = ['模型', '列', 'γ', ...EFF_SHOW.map(([, j]) => j), `平坦(N ${J.decl.Ns[J.decl.Ns.length - 1]}・種 ${J.decl.seeds.length})`];
  const mj = { disk: '円盤', ellip: '楕円の型' };
  const lines = ['| ' + head.join(' | ') + ' |', '|' + head.map(() => '---').join('|') + '|'];
  for (const c of J.ctrl) lines.push(`| ${mj[c.model]} | ${RUN_JA.G0} | — | ${EFF_SHOW.map(() => '0(対照)').join(' | ')} | ${c.flatN}/${c.of}(傾き ${sgn3(c.slope)}) |`);
  for (const e of J.eff) lines.push(`| ${mj[e.model]} | ${RUN_JA[e.col]} | ${e.gamma} | ${EFF_SHOW.map(([k]) => cell(e.w[k])).join(' | ')} | ${e.flatN}/${e.of} |`);
  return lines.join('\n');
}
/** 表 3: 零試験(正本の pure) */
export function pureTable(J) {
  const S = J.pure.scenes, G = J.pure.gates;
  const rows = [
    ['① 引きずり 0(γ 0)で、どの列も対照(重力だけ)と同じ(8 步)', Object.entries(S.gamma0).map(([k, v]) => `${k} ${v}`).join('・'), G.gamma0],
    ['② 自前の積分(自己の重みなし・B1)と第337便e の integrateFluid(押し・全成分)の差の最大', String(S.vsFluid), G.vsFluid],
    ['③ C1 の λ 1 と A2・λ 0 と B2 の力の差の最大', `${S.mix.l1}・${S.mix.l0}`, G.mix],
    ['④ 対の和の運動量の残り(B1・B2)・B2 の角運動量の残り', `${f3(S.cons.B1.p)}・${f3(S.cons.B2.p)}・${f3(S.cons.B2.lz)}`, G.cons],
    ['⑤ 初期の配置: 円盤の外の帯の v_φ と c/a・楕円の型の c/a', `${f3(S.init.diskOuter)}・${f3(S.init.diskCa)}・${f3(S.init.ellipCa)}`, G.init],
    ['⑥ 回転曲線の測りの試し(剛体回転の傾き・一定の v_φ の傾き)', `${f3(S.curve.rigid)}・${f3(S.curve.flatv)}`, G.curve],
    ['⑦ 幅の算術(作った効果)', `効果 ${f3(S.width.effect)}・W_N ${f3(S.width.wN)}・W_s ${f3(S.width.wS)}・比 ${f3(S.width.ratio)}`, G.width],
    ['⑧ 入力の拒否', `${S.reject.n}/${S.reject.of}`, G.reject],
  ];
  return ['| 零試験 | 値 | 門 |', '|---|---|---|', ...rows.map(([a, b, g]) => `| ${a} | ${b} | ${g ? '真' : '偽'} |`)].join('\n');
}
/** 数の文(表の数から作る —— 節に逐語) */
export function factsOf(J) {
  const E = J.eff, D = J.decl, beyond = (m, k) => E.filter((e) => e.model === m && e.w[k] && e.w[k].beyond).map((e) => `${e.col}(γ ${e.gamma})`);
  const outerBeyond = E.filter((e) => e.w.outerRatio && e.w.outerRatio.beyond).map((e) => `${e.model === 'disk' ? '円盤' : '楕円の型'} ${e.col}(γ ${e.gamma})`);
  const flatMore = E.filter((e) => e.flatN > J.ctrl.find((c) => c.model === e.model).flatN).map((e) => `${e.model === 'disk' ? '円盤' : '楕円の型'} ${e.col}(γ ${e.gamma})`);
  return {
    nOuterIn: E.length - outerBeyond.length,
    outer: `外縁の速さの比 − 1 が幅(N ${D.Ns[0]} → ${D.Ns[1]} の差と種の間の差の大きい方)の ${D.effOverWidth} 倍を越える組は ${E.length} 組のうち ${outerBeyond.length}(${outerBeyond.join('・') || 'なし'})。`,
    flat: `平坦の判定(内の帯と外の帯の log の傾きの大きさ < ${D.flatTol})が対照より多い組は ${flatMore.length}(${flatMore.join('・') || 'なし'})—— 対照は円盤 ${J.ctrl[0].flatN}/${J.ctrl[0].of}・楕円の型 ${J.ctrl[1].flatN}/${J.ctrl[1].of}。`,
    shapeDisk: `円盤で c/a の変化が幅の ${D.effOverWidth} 倍を越える組: ${beyond('disk', 'dCa').join('・') || 'なし'}。L_z の変化が幅の ${D.effOverWidth} 倍を越える組: ${beyond('disk', 'dLz').join('・') || 'なし'}。`,
    shapeEllip: `楕円の型で r50 の変化が幅の ${D.effOverWidth} 倍を越える組: ${beyond('ellip', 'dR50').join('・') || 'なし'}。c/a の変化: ${beyond('ellip', 'dCa').join('・') || 'なし'}。`,
  };
}
/** 伺う文の案(統括が写す —— 推奨は数と条件だけから) */
export function askText(J) {
  const F = factsOf(J);
  return [
    '**伺う文の案。** 「新しい geoPN=4 の計算は、表 5c のどの列を主にしますか(列 A 場の契約の続き —— 軸引きずりの知見から円盤引きずりを推し量る/列 B 引きずりの定義をそのまま流体に/列 C 両方 —— ノブで切り替え)」。',
    `- 列 A —— 得るもの: 原仮定者の予定の文の順(軸引きずりの知見 → 円盤引きずりを推し量る)のまま・場の契約の版 2 の上に載る。失うもの: 低 N の器では、系の回転を 1 つの源の自転に置く型(中心の点・内の和)は角運動量を保たない(L_z の変化の列)・流体の要素の上の既存の数は無い。`,
    `- 列 B —— 得るもの: 既存の流体の要素の数(〔第337便e〕〔第340便g〕)と保存の零試験(中心方向の型は運動量と角運動量を保つ)。失うもの: 軸引きずり(差分)・円盤引きずり・2 倍角の則を流体の要素へ入れる口が無い —— 「長期的な安定は軸引きずりが担う」を測るには口を足す便が要る。`,
    `- 列 C —— 得るもの: 両方を同じ要素の上で比べられる(λ 1・0 で列 A・列 B に戻る)。失うもの: 列 A と列 B の口の両方が要る(便の数が最も多い)。`,
    `- **列の推奨: 数が足りないので推奨を出さない。** ${F.outer}${F.flat}(低 N の小さな系では、外縁の速さの比は ${J.eff.length} 組のうち ${F.nOuterIn} 組で離散化の幅の内・平坦の判定は種 ${J.decl.seeds.length} 本の数で幅の物差しを持たない)。`,
    '- 進め方の推奨(列ではなく次の手): 列 C の形(ノブで切り替え)で器を作り、流体の要素へ軸引きずり(〔第333便b〕の差分)を入れる口を足してから N を上げて数え直す。次点: 列 B の口(軸引きずり・円盤引きずり・2 倍角の則)だけを先に足して、列 A は場の契約の版 2 のまま置く。',
  ].join('\n');
}
/** ノブの表(PHYSICS の節 —— 6 列) */
export function knobTable() {
  return ['| ノブの名 | 何を満たすために足したか | 既定と振った範囲 | 効いた量 | 効かなかった量 | 状態 |', '|---|---|---|---|---|---|',
    '| 列の型(第355便f) | 新しい geoPN=4 の候補の列を同じ器で比べる | G0(対照)・A1・A2・B1・B2・C1 | 楕円の型の r50 と c/a・円盤の L_z(B1)と c/a(A1・A2・C1) | 外縁の速さの比・平坦の判定(幅の内) | 候補 |',
    '| 押しの係数 γ(第355便f) | 引きずりの効き方を振る | 0.1・0.3 | 楕円の型の c/a(A 列で大きく) | 円盤の外縁の速さの比 | 候補 |',
    '| 両方の割合 λ(第355便f) | 列 A と列 B を同じ要素の上で切り替える | 0.5 の 1 点(1 と 0 は零試験で列 A・列 B に戻る —— 格子は振っていない) | —(振っていない) | —(振っていない) | 候補 |',
    '| 低 N の要素の数と種(第355便f) | 離散化の幅を測る | N 96・192・種 1・2・3 | 幅(効果 ÷ 幅の分母) | — | 対照 |'].join('\n');
}
export function tablesOf(J) {
  return { t5c: table5c(J), diag: diagTable(J), pure: pureTable(J), ask: askText(J), knob: knobTable(), orig: originalTable() };
}
