// 第352便b(原仮定者の回答(2026-11-24 —— 第148報)「AN1026: Aで進める。未照合でも確度の高い数値で仮計算し、後追いで照合する」・統括の検証項目 R439):
// **正本 tests/out/provisional-352b.json から PHYSICS〔第352便b〕の表を作る文書の lib**
// (QA docs.provisional352b が節の表と逐語で照合する —— 表の数は有効数字 3〜4 桁)。原文(言葉を変えずに引く)と読みの表もここに持つ。import しない。
export const DOC_VERSION = 'w352b-provisionaldoc-1';
const fe = (x) => (x === null || x === undefined || !Number.isFinite(x) ? '—' : x === 0 ? '0' : Number(x).toExponential(3));
const f3 = (x) => (x === null || x === undefined || !Number.isFinite(x) ? '—' : Number(x).toFixed(3));
const f4 = (x) => (x === null || x === undefined || !Number.isFinite(x) ? '—' : Number(x).toFixed(4));
const f8 = (x) => (x === null || x === undefined || !Number.isFinite(x) ? '—' : Number(x).toFixed(8));
const tf = (x) => (x === true ? '真' : x === false ? '偽' : '—');
const sg = (x) => (x === null || x === undefined || !Number.isFinite(x) ? '—' : (x > 0 ? '+' : '') + String(x));
const NM = Object.freeze({ Earth: '地球', Mars: '火星', Venus: '金星' });
/** 単位の表記(PHYSICS では km 毎秒の形で書く) */
const UN = Object.freeze({ 'km/s': 'km 毎秒', 'km/s/kpc': 'km 毎秒 毎 kpc', '1': '符号' });
const un = (u) => UN[u] || u;
const val = (v) => (v === null ? 'null(数なし)' : typeof v === 'object' ? `${v.lo}〜${v.hi}(範囲)` : sg(v));
const DIRN = Object.freeze({ 'G-': '(G−)', 'G+': '(G+)', 'N+': '(N+)', 'N-': '(N−)' });

/** 原文(言葉を変えずに引く) */
export const ORIGINAL = Object.freeze([
  Object.freeze(['原仮定者の回答(2026-11-24 —— 第148報)', 'AN1026: Aで進める。未照合でも確度の高い数値で仮計算し、後追いで照合する']),
  Object.freeze(['原仮定者の回答(2026-11-21 —— 第145報)', 'AN903: 推奨で進める。別途、照合方法をまとめる']),
  Object.freeze(['原仮定者の回答(2026-11-24 —— 第147報)', 'つまり、両方の経路が有り、比率は天体の構造などに起因するので、ノブにする']),
]);
/** 統括の読み(原文と分ける)—— [読み, 数えた所] */
export const READINGS = Object.freeze([
  Object.freeze(['仮の値は統括の手元の知識の数(一次の資料に当たっていない)。全部に「仮・未照合」の印(provisional・verified・useForVerdict の 3 つ)を付けて台帳 PROV に置き、使ってよい所を本便より後の診断の lib・器に限る。較正の合否・サンプルの状況・ノブの採否・正式判定値に入れない', '表 2・表 3・表 5']),
  Object.freeze(['これまでの決まり(文献の値は「文献の値・未照合」の固定の比べる列・照合の手順は公開の docs/SOURCE_VERIFICATION.md)は変えない。リポジトリに既に在る文献の値は写さず、鍵で指すだけ', '表 4']),
  Object.freeze(['経路の比率 f は値を選ばない。仮の値を〔第351便k〕の式に入れた数は感度の数(ノブの値ではない —— ノブの台帳に登録しない)', '表 6・表 7']),
]);
export function originalTable(readings = READINGS) {
  return ['| # | 出どころ | 原文(言葉を変えずに引く) | 読み(統括の読み —— 原文と分ける) | 数えた所 |', '|---|---|---|---|---|',
    ...ORIGINAL.map(([src, o], k) => `| ${k + 1} | ${src} | 「${o}」 | ${readings[k][0]} | ${readings[k][1]} |`)].join('\n');
}

export function tablesOf(J) {
  const T = {}, S = J.pure.scenes, G = J.pure.gates, A = J.decl.anchor, Cm = J.decl.common;
  T.pure = ['| 零試験・場面 | 値 | 門 |', '|---|---|---|',
    `| ① 台帳の欄と印(20 件・欄 13・凍結) | 問題 ${S.ledger.length} | ${tf(G.ledger)} |`,
    `| ② 変異: 欄の欠け 3・印の欠け 3・grade・「未照合」の語・sigma の規則(どれも落ちる)+ 鍵の重複 | ${S.mutantCaught.filter(Boolean).length}/${S.mutantCaught.length}・${tf(S.dupCaught)} | ${tf(G.mutants)} |`,
    `| ③ 口: 無い鍵は例外(prov・tagProv)・印の鍵の一覧・assertNoVerdict は印の付いた値(入れ子も)で例外・範囲の値は lo・hi・mid を要る | ${[S.unknownThrows, S.tagUnknownThrows, S.avThrows, S.avNestedThrows, S.avClean, S.rangeThrows].filter(Boolean).length}/6 | ${tf(G.api)} |`,
    `| ④ 向きの符号: ψ_A の右ねじの率・火星の歳差の率・地球の歳差の回る向き(金星の歳差は向きなし) | ${f8(S.sense.psiRH)}・${S.sense.mars}・${S.sense.earthSense}・${S.sense.venus === null ? 'null' : S.sense.venus} | ${tf(G.sense)} |`,
    `| ⑤ 照合の列: 会合周期・共鳴の周期・太陽の傾きの差(< 0.01)・v0 ÷ R0 と宣言の銀河の公転の角速度の相対の差(< 1%) | ${S.cross.length} 行 | ${tf(G.cross)} |`,
    `| ⑥ 使ってよい所の門(合成のファイルの組の変異 4 —— 間接の import・本便より前の名・名の形で守る器)・鍵の漏れ・正本の最上位の印 | ${Object.values(S.scope).filter(Boolean).length}/4・${tf(S.leak.none && S.leak.hit)}・${Object.values(S.outMark).filter(Boolean).length}/3 | ${tf(G.scope)} |`,
    `| ⑦ 統括の数え直し 1 の数(基準軸 ${A.refEq.join(', ')}・太陽の自転軸との角 ${A.sunToRefEqDeg}°・${A.sunToEclDeg}°・金星の倍率 (S) ${A.uS}・(MS) ${A.uMS}・背景の大きさ ${A.bgMagAsYr}″/年・(G−) と基準軸の角 ${A.gDeltaRefDeg}°) | ${S.anc.refEq.map((x) => x.toFixed(7)).join(', ')}・${f3(S.anc.sunToRefEq)}・${f3(S.anc.sunToEcl)}・${S.anc.uS.toExponential(5)}・${S.anc.uMS.toFixed(4)}・${S.anc.bgMag.toExponential(5)}・${f3(S.anc.gDeltaRef)} | ${tf(G.anchor)} |`,
    `| ⑧ 共通の点検の数(自転しない源の通過 —— ${Cm.p2x}・${Cm.p6}・${Cm.w} と 5e-9 の内) | ${f8(S.common.p2x)}・${f8(S.common.p6)}・${f8(S.common.w)} | ${tf(G.common)} |`,
    `| ⑨ 比の式: r 0.5 → f 1/3 → f ÷ (1 − f) = r・dθ/dt < 0 で寄る・sin θ 0 は拒否 | ${f4(S.ratio.r)}・${f4(S.ratio.f)}・${f4(S.ratio.inv)} | ${tf(G.ratio)} |`,
    `| ⑩ 主の列の合成の率: (G−) が第351便e の totalOm(地球・(S)・金星の倍率)と同じ・(N+) の金星の合成 ÷ 背景だけ(統括の数え直し 1 の 1.0%) | 相対の差 ${S.main.gm === S.main.gmRef ? '0' : '≠ 0'}・${f4(S.main.venusN)} | ${tf(G.main)} |`].join('\n');
  T.ledger = ['| 鍵 | 値 | 単位 | 量 | 元期 | 基準面 | 正の向き | 1σ(原典の値だけ) | grade | 出どころの候補 | 印 |', '|---|---|---|---|---|---|---|---|---|---|---|',
    ...J.prov.map((e) => `| \`${e.key}\` | ${val(e.value)} | ${un(e.unit)} | ${e.quantity} | ${e.epoch} | ${e.frame} | ${e.positive} | ${e.sigma === null ? '—' : e.sigma} | ${e.grade} | ${e.sourceHint} | ${e.provisional && !e.verified && !e.useForVerdict ? '仮・未照合' : '印の欠け'} |`)].join('\n');
  T.extra = ['| 鍵 | 欄 | 値 | 扱い |', '|---|---|---|---|',
    ...J.prov.filter((e) => e.alt || e.sigmaGiven !== undefined || e.spinVectorDeg !== undefined).map((e) => e.alt ? `| \`${e.key}\` | 別の解(alt) | ${sg(e.alt.value)}(1σ ${e.alt.sigma}) | ${e.alt.sourceHint} —— 感度の表に別の列で並べる |`
      : e.sigmaGiven !== undefined ? `| \`${e.key}\` | 渡された 1σ(sigmaGiven) | ${e.sigmaGiven} | 出どころの候補に表か式の語が無いので sigma の欄に入れない(照合の後に入れる) |`
        : `| \`${e.key}\` | 自転のベクトルの角(spinVectorDeg) | ${e.spinVectorDeg} | 北極で測る角と有向の角運動量の角を分けて持つ |`)].join('\n');
  T.repo = ['| 鍵(写さない —— 指すだけ) | lib | 道 |', '|---|---|---|', ...J.repoRefs.map((r) => `| \`${r.name}\` | \`${r.lib}\` | ${r.path} |`)].join('\n');
  T.cross = ['| 仮の値の鍵 | 仮の値 | リポジトリの数 | リポジトリの数の出どころ | 差(仮 − リポジトリ) | 相対の差 | 単位 |', '|---|---|---|---|---|---|---|',
    ...J.cross.map((r) => `| ${r.key} | ${r.prov === null ? '—' : (Math.abs(r.prov) < 1e-6 ? fe(r.prov) : f4(r.prov))} | ${Math.abs(r.repo) < 1e-6 ? fe(r.repo) : f4(r.repo)} | ${r.repoFrom} | ${r.diff === null ? '—' : (Math.abs(r.diff) < 1e-6 ? fe(r.diff) : f4(r.diff))} | ${r.rel === undefined ? '—' : fe(r.rel)} | ${un(r.unit)} |`)].join('\n');
  T.t4 = [`前提(この前提は今の候補では成り立っていない —— 合成の軸は公転の北極と違う): ${J.t4Premise.join('・')}。印: 仮・未照合(較正の合否・サンプルの状況・ノブの採否に入れない)。`, '',
    '| 列 | dθ/dt [″/年] | θ [°](出どころ) | dφ/dt [″/年](右ねじ) | r = abs(dθ/dt) ÷ (sin θ × abs(dφ/dt)) | (N1) の k₁ ÷ k₂ | f = r ÷ (1 + r) | 寄る向き(dθ/dt < 0) | 使った仮の値の鍵 |', '|---|---|---|---|---|---|---|---|---|',
    ...J.t4.map((r) => `| ${r.col} | ${sg(r.dThetaDt)} | ${f4(r.thetaDeg)}(${r.thetaFrom}) | ${sg(Number(r.dPhiDt.toPrecision(10)))} | ${fe(r.r)} | ${fe(r.kTiltOverKPrec)} | ${fe(r.fN1)} | ${r.toward ? '寄る' : '離れる'} | ${r.provKeys.map((k) => '`' + k + '`').join('・')}${r.repoRefs.length ? '・リポジトリ ' + r.repoRefs.map((k) => '`' + k + '`').join('・') : ''} |`)].join('\n');
  const dirs = J.decl.bgDirs;
  T.t4main = ['| 列 | 極が動く速さ hypot(dθ/dt, sin θ × dφ/dt) [″/年] | 主の列の合成の率 abs(Ω) [″/年]: ' + dirs.map((d) => DIRN[d]).join('・') + ' | 極が動く速さ ÷ 合成の率: ' + dirs.map((d) => DIRN[d]).join('・') + ' |', '|---|---|---|---|',
    ...J.t4.map((r) => `| ${r.col} | ${f4(r.poleSpeedAsYr)} | ${dirs.map((d) => fe(r.mainRateAsYr[d])).join('・')} | ${dirs.map((d) => fe(r.poleOverMain[d])).join('・')} |`)].join('\n');
  T.scope = ['| 門 | 中身 |', '|---|---|',
    `| (i) import してはならない器と lib(名で固定) | ${J.decl.guarded.map((g) => '`' + g + '`').join('・')} |`,
    `| (i) 名の形で守る器と lib | \`${J.decl.guardedRe}\` |`,
    '| (i) import してよい所 | 名の波の番号が 352 以上の `tests/lib-w…`・`tests/exp-w…`(名の形で守るものを除く)と QA の本体 —— 守る器と lib は import の閉包(間接)も見る |',
    '| (ii) 仮の値を使った正本 | 最上位に `provisional: true` と使った鍵の一覧 `provKeys`(来歴の code に仮の値の lib が在る正本 —— `tests/out/*.json` を全部見る) |',
    `| (iii) 鍵の名が出てはならない文書と表 | ${J.decl.noKeyDocs.map((g) => '`' + g + '`').join('・')} |`].join('\n');
  return T;
}
/** 数の文(節に逐語) */
export function factsOf(J) {
  const F = {}, S = J.pure.scenes;
  const t = (k) => J.t4[k];
  F.ledger = `仮の値の台帳は ${J.prov.length} 件(grade A ${J.prov.filter((e) => e.grade === 'A').length}・B ${J.prov.filter((e) => e.grade === 'B').length}・C ${J.prov.filter((e) => e.grade === 'C').length})・sigma を持つ件は ${J.prov.filter((e) => e.sigma !== null).length}・数の無い件は ${J.prov.filter((e) => e.value === null).length}・範囲の件は ${J.prov.filter((e) => e.value && typeof e.value === 'object').length}`;
  F.t4earth = `地球の r: 固定の黄道 J2000 の傾きの率では ${fe(t(0).r)}(f ${fe(t(0).fN1)})・その日の黄道の傾きの率では ${fe(t(1).r)}(f ${fe(t(1).fN1)})—— 2 つの定義で r は ${fe(t(1).r / t(0).r)} 倍違う`;
  F.t4mars = `火星の r: ${fe(t(3).r)}(f ${fe(t(3).fN1)})・別の解の歳差の率で ${fe(t(4).r)}`;
  F.t4main = `極が動く速さ ÷ 主の列の合成の率((S)・金星の倍率 ${S.anc.uS.toExponential(5)}・(G−)): 地球 ${fe(t(0).poleOverMain['G-'])}・火星 ${fe(t(3).poleOverMain['G-'])}/(N+): 地球 ${fe(t(0).poleOverMain['N+'])}・火星 ${fe(t(3).poleOverMain['N+'])}`;
  const cx = (k) => J.cross.find((r) => r.key === k);
  F.cross = `照合の列: 会合周期の差 ${f4(cx('venusEarth.synodic').diff)} 日・共鳴の周期の候補の差 ${f4(cx('venus.resonance.period').diff)} 日・太陽の傾きの差 ${f4(cx('sun.obliquity.ecl').diff)}°・v0 ÷ R0 と宣言の銀河の公転の角速度の相対の差 ${fe(cx('gal.R0・gal.v0').rel)}・A − B と v0 ÷ R0 の相対の差 ${fe(cx('gal.oort.A・gal.oort.B').rel)}`;
  return F;
}
