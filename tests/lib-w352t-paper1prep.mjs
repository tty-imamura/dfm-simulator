// 第352便t(原仮定者の指示(2026-11-21 —— 第145報)「論文の改訂案」・原仮定者の回答(2026-11-21 —— 第145報の回答 1)AN925「…構成案に基づいて、それぞれの本文の改訂前に、
//   必要な検証やサンプル作成を行う」・統括の検証項目 R457): **論文1 の本文の改訂の前に要る検証(docs/PAPER_PLAN.md §2 ⑧ の V1-1・V1-4・V1-3)の純関数**
//   (器 tests/exp-w352t-paper1prep.mjs が呼ぶ —— html を読まない・ファイルを読まない・状態を持たない)。
//
// ■ 何を持つか
//   DECL       走らせる本と量・步の数・刻み(器が html の本の宣言の写しで数える —— geoPN だけを 0 → 1 にした写し)
//   relDiff    2 つの値の差と相対の差(差は 2 つの走行の差 —— 打ち消しの床 FLOOR を下回る相対の差は表に「< 1e-12」と床で書く)
//   OBS_REFS   照合の表の観測の値の列(**リポジトリに既に在る数だけ** —— ファイルの名と、その字句を拾う式。数は器がファイルから拾う。足さない)
//   T3_COLS    水星の近点の一次の項の表の列(第344便b の正本の型の名と n_G)
//   表を作る関数(t1Table・t2Table・t3Table)—— PHYSICS〔第352便t〕に逐語で写す
// ■ 言わないこと: geoPN=1 で観測に合った・論文の主張が確かめられた、とは書かない(模型の値と、文献の値・未照合の列を並べるだけ)。
export const LIB_VERSION = 'w352t-paper1prep-lib-1';

/** 宣言(走行の前に置く —— 結果を見て変えない) */
export const DECL = Object.freeze({
  geoPNs: Object.freeze([0, 1]),
  /** 本と量(既存の鍵 grcal.clocks・grcal.rays・behavior.grcal3 が使っている本と量 + 時計の本 ⏱️ gclock) */
  books: Object.freeze([
    Object.freeze({ id: 'grcal', key: 'grcal.clocks・grcal.rays', steps: 1000, dt: 0.016, what: '地上の時計と周回の衛星の τ/t・解析の式との相対の差・光線ファンの宣言' }),
    Object.freeze({ id: 'grcalGps', key: 'behavior.grcal3', steps: 3200, dt: 0.01, what: '3 つの時計の τ/t・重力項 ÷ 運動項' }),
    Object.freeze({ id: 'grcalLight', key: 'behavior.grcal3', steps: 6000, dt: 0.01, what: 'まっすぐ狙った光子の偏向 ÷ 4GM/(c₀²b)' }),
    Object.freeze({ id: 'grcalShapiro', key: 'behavior.grcal3', steps: 6000, dt: 0.01, what: 'x = 300 を通る時刻の X_k 有無の差 ÷ 有限の幾何のシャピロ形' }),
    Object.freeze({ id: 'gclock', key: '(時計の本 —— verify.V12 ほかの本)', steps: 1000, dt: 0.016, what: '4 つの時計の τ/t' }),
  ]),
  FLOOR: 1e-12,
  shapiroX: 300,
});

/** 差と相対の差(相対の差の分母は geoPN=0 の値の大きさ —— 0 のときは差そのもの) */
export function relDiff(a0, a1) {
  if (typeof a0 !== 'number' || typeof a1 !== 'number' || !Number.isFinite(a0) || !Number.isFinite(a1)) return { diff: null, rel: null };
  const diff = a1 - a0, rel = a0 === 0 ? Math.abs(diff) : Math.abs(diff) / Math.abs(a0);
  return { diff, rel };
}
/** 表の相対の差の書き方(床 FLOOR の下は「< 1e-12」・0 は 0) */
export function relText(rel) {
  if (rel === null || rel === undefined) return '——';
  if (rel === 0) return '0';
  if (rel < DECL.FLOOR) return '< 1e-12';
  return rel.toExponential(2);
}
/** 値の書き方(6 桁 —— 走行の量は丸めの桁を書かない) */
export const v6 = (x) => (x === null || x === undefined ? '——' : (typeof x === 'boolean' ? (x ? 'はい' : 'いいえ') : (Number.isInteger(x) ? String(x) : x.toPrecision(6))));

/** 同じ/変わるの読み(相対の差が床の下なら「同じ」—— 0 → 1 で同じかの数だけ) */
export function sameOf(rel) { return rel === null ? null : rel < DECL.FLOOR; }

/** 照合の表の観測の値の列(リポジトリに既に在る数だけ —— 器が file から pattern で拾う。出典の名は同じ字句の近くに在るもの) */
export const OBS_REFS = Object.freeze([
  Object.freeze({ q: 'gpsNet', file: 'paper/dfm-paper-ja.tex', pattern: '\\$\\\\approx \\+(\\d+\\.\\d+)\\\\ \\\\mu\\$s/日\\(GPS システム設計値~\\\\cite\\{Ashby2003\\}\\)', unit: 'μs/日',
    source: 'Ashby (2003) Living Rev. Relativity 6, 1(論文1 の日本語版の照合の表の「実験的制約」の欄)' }),
  Object.freeze({ q: 'deflectionArcsec', file: 'paper/dfm-paper-ja.tex', pattern: '\\$(\\d+\\.\\d+)\'\'\\$\\(光偏向 VLBI,パーセントレベル\\)', unit: '″',
    source: '光偏向 VLBI(論文1 の日本語版の照合の表の「実験的制約」の欄 —— 出典の文献の名は表に無い)' }),
  Object.freeze({ q: 'shapiroMicros', file: 'paper/dfm-paper-ja.tex', pattern: '\\$\\\\gamma - 1 = \\((\\d+\\.\\d+) \\\\pm (\\d+\\.\\d+)\\)\\\\times10\\^\\{-(\\d+)\\}\\$~\\\\cite\\{Bertotti2003\\}', unit: '(γ − 1 —— 遅延の値ではない)',
    source: 'Bertotti, Iess & Tortora (2003) Nature 425, 374(論文1 の日本語版の照合の表 —— カッシーニの電波のリンクが式の PPN の係数を制約する値。遅延の観測の値はリポジトリに無い)' }),
]);
/** 本の説明文の「観測≈」の字句(🛰️ grcal の説明文 —— 同じく拾うだけ) */
export const DESC_OBS = Object.freeze([
  Object.freeze({ q: 'gpsNet', pattern: '観測≈\\+(\\d+\\.\\d+)' }),
  Object.freeze({ q: 'deflectionArcsec', pattern: '観測≈(\\d+\\.\\d+)″' }),
]);
/** 🛰️ の説明文に固定済みの正典の値の字句(behavior.grcal3 と同じ式) */
export const CANON_RE = Object.freeze({
  gpsNet: '正味進み \\+(\\d+\\.\\d+)μs\\/日', gpsGravity: '重力\\+(\\d+\\.\\d+)', gpsMotion: '運動(?:−|-)(\\d+\\.\\d+)',
  deflectionArcsec: '太陽縁の光偏向 (\\d+\\.\\d+)″', shapiroMicros: 'シャピロ遅延 ≈(\\d+)μs' });
/** grcal.calib-text が見る字句 */
export const CALIB_TEXT = Object.freeze(['38.5', '1.7512', '281']);

/** 字句から数を拾う(見付からなければ null —— 1 つめの群。γ の行は (値, 誤差, 指数) を返す) */
export function pick(text, pattern) {
  const m = String(text || '').match(new RegExp(pattern));
  if (!m) return null;
  return m.slice(1).map((x) => parseFloat(x));
}

/** 第344便b の正本の列(行 = 項・列 = 候補) */
export const T3_COLS = Object.freeze([
  Object.freeze({ col: '現行の近似', kind: '0', nG: 2, name: '(0) 現行(絶対時間)・G_loc の指数 2' }),
  Object.freeze({ col: '主の候補', kind: 'alpha', nG: 1, name: '(α) 速度の増し分(× q)・G_loc の指数 1' }),
  Object.freeze({ col: '比べる列', kind: 'beta', nG: 1, name: '(β) 位置の 2 階(状態 U)・G_loc の指数 1' }),
  Object.freeze({ col: '比べる列', kind: 'beta', nG: 2, name: '(β) 位置の 2 階(状態 U)・G_loc の指数 2' }),
]);
export const T3_E = 0.20563593;
export const T3_PAIR = 'receiver';

/** T3 の写し(344b の正本 J344 から —— 数は逐語の写し。計算しない) */
export function t3Copy(J344) {
  const cols = T3_COLS.map((c) => {
    const r = J344.t1.rows.find((x) => x.e === T3_E && x.pair === T3_PAIR && x.nG === c.nG && x.kind === c.kind);
    const a = J344.t1.added.find((x) => x.nG === c.nG && x.kind === c.kind);
    return { col: c.col, kind: c.kind, nG: c.nG, name: c.name, overPN: r ? r.overPN : null, closed: r ? r.closed : null, halfDiff: r ? r.halfDiff : null,
      gLocArcsecCy: a ? a.gLocArcsecCy : null, withK1: a ? a.withK1 : null, withK1ArcsecCy: a ? a.withK1ArcsecCy : null };
  });
  return { e: T3_E, pair: T3_PAIR, pnArcsecCy: J344.t1.pn.arcsecCy, k1Over1PN: J344.decl.k1Over1PN, mu: J344.decl.orbit.mu, cols };
}

/* ───────── 表(PHYSICS〔第352便t〕に逐語で写す) ───────── */
const f6 = (x) => (x === null ? '——' : x.toFixed(6)), f2 = (x) => (x === null ? '——' : x.toFixed(2)), fe = (x) => (x === null ? '——' : x.toExponential(2));
export function t1Table(t1) {
  const head = ['| 本 | 量 | geoPN=0(宣言のまま) | geoPN=1(写し) | 差 | 相対の差 | 0 → 1 で |', '|---|---|---|---|---|---|---|'];
  const rows = t1.rows.map((r) => `| ${r.book} | ${r.q} | ${v6(r.v0)} | ${v6(r.v1)} | ${r.diff === null ? (r.v0 === r.v1 ? '同じ値' : '——') : (r.diff === 0 ? '0' : (r.rel < DECL.FLOOR ? '< 1e-12 の相対' : fe(r.diff)))} | ${relText(r.rel)} | ${r.same === null ? (r.v0 === r.v1 ? '同じ' : '変わる') : (r.same ? '同じ' : '変わる')} |`);
  return head.concat(rows).join('\n');
}
export function t1Books(t1) {
  const head = ['| 本 | geoPN=1 の写しの受理 | 受理の警告 | 走る法則(0 → 1) | kFrame(写し) | 步 × 刻み |', '|---|---|---|---|---|---|'];
  return head.concat(t1.books.map((b) => `| ${b.id} | ${b.ok1 ? 'はい' : 'いいえ'} | ${b.warn1} | ${b.law0} → ${b.law1} | ${b.kFrame1} | ${b.steps} × ${b.dt} |`)).join('\n');
}
export function t2Table(t2) {
  const head = ['| 観測量 | 模型の値(式の出力 HP.grSI) | 🛰️ の説明文の正典 | 式 ÷ 正典 − 1 | 走行の比(本の画面の値 ÷ 弱場一次の式・geoPN=0 / 1) | 換算の規約 | 観測の値(リポジトリに在る数) | 出典 | 状態 |',
    '|---|---|---|---|---|---|---|---|---|'];
  return head.concat(t2.rows.map((r) => `| ${r.label} | ${r.model.toPrecision(6)} ${r.unit} | ${r.canon} ${r.unit} | ${fe(r.modelVsCanon)} | ${r.runRatio0 === null ? '——' : r.runRatio0.toFixed(4) + ' / ' + r.runRatio1.toFixed(4)} | ${r.conv} | ${r.obsText} | ${r.source} | 文献の値・未照合 |`)).join('\n');
}
export function t2Conv(t2) {
  const head = ['| 本 | G_0 | c_0 | X_k(本の宣言) | G_0 ÷ c_0² | X_k ÷ (G_0 ÷ c_0²) − 1 |', '|---|---|---|---|---|---|'];
  return head.concat(t2.conv.map((c) => `| ${c.id} | ${c.G} | ${c.c} | ${c.kappaT.toPrecision(6)} | ${c.derived.toPrecision(6)} | ${c.rel === 0 ? '0' : (c.rel < DECL.FLOOR ? '< 1e-12' : fe(c.rel))} |`)).join('\n');
}
export function t3Table(t3) {
  const head = ['| 項 | ' + t3.cols.map((c) => `${c.col}: ${c.name}`).join(' | ') + ' |', '|---|' + t3.cols.map(() => '---').join('|') + '|'];
  const R = (nm, f) => `| ${nm} | ` + t3.cols.map(f).join(' | ') + ' |';
  return head.concat([
    R('G_loc + 型の近点の一次 ÷ 弱い場の 1PN', (c) => f6(c.overPN)),
    R('見込みの式', (c) => f6(c.closed)),
    R('同 ″/世紀', (c) => f2(c.gLocArcsecCy)),
    R('K1 の +5/3 と足した和', (c) => f6(c.withK1)),
    R('和 ″/世紀', (c) => f2(c.withK1ArcsecCy)),
    R('刻みを半分にした差', (c) => fe(c.halfDiff)),
  ]).join('\n');
}

/* ───────── 零試験 ───────── */
export function pureScenes() {
  const S = {};
  const a = relDiff(2, 2), b = relDiff(0.5, 0.5000001), c = relDiff(0, 1e-3), d = relDiff(1, NaN);
  S.relSame = a.diff === 0 && a.rel === 0;
  S.relSmall = Math.abs(b.rel - 2e-7) < 1e-15 && b.diff > 0;
  S.relZeroBase = c.rel === 1e-3;
  S.relNaN = d.diff === null && d.rel === null;
  S.floor = relText(1e-13) === '< 1e-12' && relText(0) === '0' && relText(2.5e-5) === '2.50e-5' && sameOf(1e-13) === true && sameOf(1e-6) === false;
  S.pick = JSON.stringify(pick('… $\\approx +38.6\\ \\mu$s/日(GPS システム設計値~\\cite{Ashby2003}) …', OBS_REFS[0].pattern)) === '[38.6]'
    && JSON.stringify(pick("x $1.75''$(光偏向 VLBI,パーセントレベル) y", OBS_REFS[1].pattern)) === '[1.75]'
    && JSON.stringify(pick('$\\gamma - 1 = (2.1 \\pm 2.3)\\times10^{-5}$~\\cite{Bertotti2003}', OBS_REFS[2].pattern)) === '[2.1,2.3,5]'
    && pick('なし', OBS_REFS[0].pattern) === null;
  S.canon = JSON.stringify(pick('正味進み +38.5μs/日(重力+45.7・運動−7.2。観測≈+38.6)', CANON_RE.gpsNet)) === '[38.5]'
    && JSON.stringify(pick('観測≈+38.6', DESC_OBS[0].pattern)) === '[38.6]';
  const toy = { decl: { k1Over1PN: 5 / 3, orbit: { mu: 1e-5 } }, t1: { pn: { arcsecCy: 42.98 }, rows: T3_COLS.map((c, j) => ({ e: T3_E, pair: T3_PAIR, nG: c.nG, kind: c.kind, overPN: -0.1 * (j + 1), closed: -0.1 * (j + 1), halfDiff: 1e-8 })),
    added: T3_COLS.map((c, j) => ({ nG: c.nG, kind: c.kind, overPN: -0.1 * (j + 1), gLocArcsecCy: -4.298 * (j + 1), withK1: 5 / 3 - 0.1 * (j + 1), withK1ArcsecCy: 1 })) } };
  const T = t3Copy(toy);
  S.t3Copy = T.cols.length === 4 && T.cols.every((c, j) => c.overPN === toy.t1.rows[j].overPN && c.withK1 === toy.t1.added[j].withK1) && T.pnArcsecCy === 42.98;
  S.t3Missing = t3Copy({ ...toy, t1: { ...toy.t1, rows: [] } }).cols.every((c) => c.overPN === null);
  S.cols = T3_COLS[0].kind === '0' && T3_COLS[0].nG === 2 && T3_COLS[1].kind === 'alpha' && T3_COLS[1].nG === 1;
  return S;
}
export function pureGates(S = pureScenes()) {
  const G = {};
  for (const k of ['relSame', 'relSmall', 'relZeroBase', 'relNaN', 'floor', 'pick', 'canon', 't3Copy', 't3Missing', 'cols']) G[k] = S[k] === true;
  return G;
}
