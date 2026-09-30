// 第285便d(原仮定者の裁定(第75報)⑦「観測値と実行結果の一致度を分かり易く比較可能なグラフ系の表示を用意する」・
// 統括の検証項目 R100)— **観測対実行のグラフの行**を正本から作る純関数(器 tests/exp-w285d-obscompare.mjs と QA が共有する)。
//
// ■ 何をするか
//   判定器の正本 `tests/out/calaudit-w249.json` の **量ごとの行**(presets[].quantities[] —— 1 行 1 量)を、
//   グラフが読む最小の欄へ**転記**する。数は 1 つも作らない(有効数字 12 桁への丸めだけ —— 桁数は規約 SIG_DIGITS)。
//     id・絵文字・対象・量の名前・kind・観測 obs・実行 gate.assessedValue・単位・判定段 gate.assessedStage・
//     正式判定 gate.status・理由 gate.reason・σ gate.sigma・測った kFrame(measurementContext.kFrame)・
//     kF0 の診断コピーから配った行か(kf0Applied)・必要近点数と実測近点数と充足(run.stopRule)・収束(gate.convergence.ok)・
//     出典(gate.sigmaSource.source)。
//   **欠測は null のまま**(0 に置き換えない)。古い `verdict`(第249便b の 4 値以前の語)は**転記しない**
//   —— 合否は 3σ 門の正式判定 `gate.status` だけである。
//   退役の別は**ページ側**が内蔵の宣言(`familyRole:"retired"`)から引く(同じ事実を 2 か所に持たない)。
//
// ■ 追加の系列(枝 b の診断正本)
//   `tests/out/pn1-w285b.json` が**あり**、かつ `lambda0Rows`(第288便f までの鍵名 obsCompareRows —— 本 lib の `EXTRA_ROW_KEYS` の欄を持つ行の配列)を
//   持つときだけ、その行を系列 "pn0"(λ_PN=0 の対照 —— 診断)として足す。**無ければ何も描かない**(仮の数を置かない)。
//
// ■ しないこと: 走らせない・判定しない・html を書かない(書くのは器)。「合った」「判定が増えた」とは言わない。
import crypto from 'node:crypto';

export const OBSCMP_VERSION = 'w285d-1';
export const REGION = 'obs-compare';
export const BEGIN = '// >>> w275a-generated: ' + REGION;
export const END = '// <<< w275a-generated: ' + REGION;
export const SIG_DIGITS = 12;
/** 正式判定(3σ 門)の語 —— 正本 gate.status の語彙そのもの(第268便a)。 */
export const GATE_WORDS = ['合(3σ)', '否(3σ)', '数値未解決', 'mapping-unresolved', 'condition-mismatch', '未判定'];
export const CAL_FILE = 'tests/out/calaudit-w249.json';
export const EXTRA_FILE = 'tests/out/pn1-w285b.json';
/** 枝 b の正本が `lambda0Rows`(第288便f までの鍵名 obsCompareRows)に持つべき欄(無い欄は null のまま)。 */
export const EXTRA_ROW_KEYS = ['id', 'target', 'name', 'kind', 'obs', 'value', 'unit', 'sigma', 'status', 'stage', 'lambdaPN', 'note'];

const num = (x) => (typeof x === 'number' && Number.isFinite(x) ? Number(x.toPrecision(SIG_DIGITS)) : null);
const str = (x) => (typeof x === 'string' && x ? x : null);

/**
 * 正本 → グラフの行。
 * @param {object} cal calaudit-w249.json
 * @param {object|null} extra pn1-w285b.json(無ければ null)
 * @returns {{rows:object[], reasons:string[], sources:string[], counts:object, extra:object, errors:string[]}}
 */
export function buildRows(cal, extra) {
  const rows = [], reasons = [], sources = [], errors = [];
  const idx = (arr, s) => { if (s == null) return null; let i = arr.indexOf(s); if (i < 0) { arr.push(s); i = arr.length - 1; } return i; };
  for (const p of (cal && cal.presets) || []) {
    const sr = (p.run && p.run.stopRule) || {};
    for (const q of (p.quantities || [])) {
      const g = q.gate || {};
      const ctx = q.measurementContext || {};
      const src = (g.sigmaSource && g.sigmaSource.source) || (q.sigmaSource && q.sigmaSource.source) || null;
      const cv = g.convergence && typeof g.convergence.ok === 'boolean' ? g.convergence.ok : null;
      const st = str(g.status);
      if (st !== null && GATE_WORDS.indexOf(st) < 0) errors.push('正式判定の語彙の外: ' + p.id + ' ' + st);
      rows.push({
        i: p.id, e: p.emoji || null, t: str(q.target), n: String(q.name || ''), k: str(q.kind),
        o: num(q.obs), v: num(g.assessedValue), u: str(q.unit), st: str(g.assessedStage), g: st,
        r: idx(reasons, str(g.reason)), s: (num(g.sigma) !== null && g.sigma > 0) ? num(g.sigma) : null,
        kf: (ctx.kFrame === 0 || ctx.kFrame === 1) ? ctx.kFrame : null, kc: q.kf0Applied ? 1 : 0,
        np: Number.isFinite(sr.needPeriastra) ? sr.needPeriastra : null,
        mp: Number.isFinite(sr.minPeriastra) ? sr.minPeriastra : null,
        pk: typeof sr.periastraOk === 'boolean' ? sr.periastraOk : null,
        cv, so: idx(sources, str(src)), sr: 'calaudit',
      });
    }
  }
  const ex = { file: EXTRA_FILE, present: !!extra, rows: 0, why: null };
  if (extra) {
    // 第288便f: 枝 b の正本の鍵は lambda0Rows(旧い正本の鍵 obsCompareRows も読む —— 鎖で pn1 が刻み直されるまで)
    const xr = Array.isArray(extra.lambda0Rows) ? extra.lambda0Rows : (Array.isArray(extra.obsCompareRows) ? extra.obsCompareRows : null);
    if (!xr) ex.why = '`lambda0Rows` 欄が無い(描かない —— 仮の数を置かない)';
    else {
      for (const x of xr) {
        const st = str(x.status);
        rows.push({ i: String(x.id || ''), e: null, t: str(x.target), n: String(x.name || ''), k: str(x.kind),
          o: num(x.obs), v: num(x.value), u: str(x.unit), st: str(x.stage), g: st, r: null,
          s: (num(x.sigma) !== null && x.sigma > 0) ? num(x.sigma) : null, kf: 0, kc: 0, np: null, mp: null, pk: null, cv: null,
          so: null, sr: 'pn0', lp: num(x.lambdaPN) });
        ex.rows++;
      }
    }
  } else ex.why = '正本が無い(描かない)';
  const counts = { rows: rows.length, calRows: rows.filter((r) => r.sr === 'calaudit').length,
    presets: new Set(rows.filter((r) => r.sr === 'calaudit').map((r) => r.i)).size,
    both: rows.filter((r) => r.o !== null && r.v !== null).length,
    sigma: rows.filter((r) => r.s !== null).length,
    gate: GATE_WORDS.reduce((a, w) => (a[w] = rows.filter((r) => r.sr === 'calaudit' && r.g === w).length, a), {}) };
  return { rows, reasons, sources, counts, extra: ex, errors };
}

/** 行の並びの安定な hash(時刻を含まない —— 正本の値が変わったときだけ html が動く)。 */
export function rowsSha256(built) {
  return crypto.createHash('sha256').update(JSON.stringify({ v: OBSCMP_VERSION, rows: built.rows, reasons: built.reasons, sources: built.sources })).digest('hex');
}

/** html の生成領域(マーカー行を含む)。 */
export function renderRegion(built) {
  const j = (x) => JSON.stringify(x);
  const lines = [BEGIN];
  lines.push('// 第285便d(R100): 観測対実行のグラフの行 —— **正本 ' + CAL_FILE + ' の転記**(器 tests/exp-w285d-obscompare.mjs が機械生成・手で打った数は無い)。');
  lines.push('// 欠測は null(0 に置き換えない)。合否は g(正式判定 gate.status)だけ。時刻・sha を入れない(値が変わったときだけ動く)。');
  lines.push('const OBS_COMPARE_CANON={file:' + j(CAL_FILE) + ',version:' + j(OBSCMP_VERSION) + ',rows:' + built.counts.rows
    + ',calRows:' + built.counts.calRows + ',presets:' + built.counts.presets + ',rowsSha256:' + j(rowsSha256(built))
    + ',sigDigits:' + SIG_DIGITS + ',extra:' + j({ file: built.extra.file, present: built.extra.present, rows: built.extra.rows }) + '};');
  lines.push('const OBS_COMPARE_REASONS=' + j(built.reasons) + ';');
  lines.push('const OBS_COMPARE_SOURCES=' + j(built.sources) + ';');
  lines.push('const OBS_COMPARE_ROWS=[');
  built.rows.forEach((r, n) => lines.push('  ' + j(r) + (n === built.rows.length - 1 ? '' : ',')));
  lines.push('];');
  lines.push(END);
  return lines.join('\n');
}

/** html の生成領域を差し替える(領域が無ければ null)。 */
export function spliceRegion(html, region) {
  const a = html.indexOf(BEGIN), b = html.indexOf(END);
  if (a < 0 || b < 0 || b < a) return null;
  return html.slice(0, a) + region + html.slice(b + END.length);
}

/**
 * 画面と同じ式の「観測との差」(QA が独立に照合するための写し —— ページ側 `obsCompareDiff` と同じ規則)。
 *   点 d: pct は (v − o)/|o| × 100(o=0 や欠測は null)・sig は (v − o)/σ(σ が無ければ null)。
 *   帯の半幅 band: pct 尺度は 3σ/|o|×100・sig 尺度は 3(σ か観測が無ければ帯なし —— 実行値の有無には依らない)。
 */
export function diffOf(r, scale) {
  // 帯は**観測側**の目盛り(o と σ があれば実行値の有無に依らず描く)・点は o と v の両方があるときだけ
  const sig = scale === 'sigma';
  let band = null, d = null, why = null;
  if (r.o !== null && r.s !== null && (sig || r.o !== 0)) band = sig ? 3 : 3 * r.s / Math.abs(r.o) * 100;
  if (r.o === null) why = 'obs-missing';
  else if (r.v === null) why = 'value-missing';
  else if (sig && r.s === null) why = 'sigma-missing';
  else if (!sig && r.o === 0) why = 'obs-zero';
  else d = sig ? (r.v - r.o) / r.s : (r.v - r.o) / Math.abs(r.o) * 100;
  return { d, band, why };
}
