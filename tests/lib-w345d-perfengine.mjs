// 第345便d(原仮定者の回答(2026-11-21 —— 第145報)「AN921: 推奨で進める」「AN922: 進める。第345便で環境を揃え、第346便も進める」・統括の検証項目 R395)
// —— **性能の検査を 2 つの版のブラウザで測り直す —— 純関数**(器 tests/exp-w345d-perfengine.mjs が使う・QA behavior.perfengine345d が場面で確かめる)。
//
// ■ この lib がすること(ブラウザを起こさない・ファイルを読まない・時計を読まない)
//   ・`summarizePerfRun(j)`: tests/perf.mjs の結果の JSON 1 回分を、表の 1 行(通過数・落ちた標本・再トス・abJit の 4 行・3 本の素の 1 步)に畳む。
//     **通過数は perf.mjs の要約の行と同じ数え方**(比較の行の数 − fail —— fail は比較の行の FAIL・geo2 の門・abJit の gate の FAIL の和)。
//   ・`spreadOf(xs)`: 回ごとの揺れ(最小・最大・最大 ÷ 最小)。
//   ・`t2Table(runs)`: 版ごとに回を並べ、標本ごとの比の揺れをまとめる。
//   ・`readCut(cut)`: 渦巻銀河の自己対照の遅さの切り分けの読み(3 つ —— 走行の前に下の DECL.cut に書いた物差しで決める)。
//   ・`readUsage(u)`: 普通の使い方(1 ページに sim 1 つ)の 1 步の時間が版で変わるかの読み(DECL.usage の物差し)。
//   ・`tablesOf(J)`: PHYSICS〔第345便d〕に逐語で載せる表(docs.perfengine345d が照合する)。
// ■ 書かないこと: 「アプリが遅くなった」「版が悪い」と断定しない。時間は箱で揺れる —— 門は置かない(読みは「この箱・この回では」)。
export const LIB_VERSION = 'w345d-perfengine-lib-1';

// 走行の前に決めた物差し(**門ではない** —— 読みの言葉を選ぶためだけ。perf.mjs の閾値の写しは記録で、perf.mjs の値は変えない)
export const DECL = Object.freeze({
  browsers: Object.freeze(['default', 'explicit153']),
  expect153: '153.0.8010.12',
  explicitPath: '/opt/pw-browsers/chromium',
  perfCopy: Object.freeze({ thresh: 1.10, selfFail: 4, selfWarn: 3, crossFail: 1.5, geo2: 1.65 }),   // perf.mjs の値の写し(変えない)
  usagePresets: Object.freeze(['galaxyGeo2', 'freebox', 'echo']),
  cutPreset: 'galaxyGeo2',
  warms: Object.freeze([100, 400, 1600]),
  cut: Object.freeze({
    cliff: 4,          // A/B ÷ 素(同じページの 2 sim)がこれを超えたら「遅さが出た」(perf.mjs の自己対照の FAIL の値と同じ)
    sepNear: 1.5,      // 2 つの sim を別のページに置いたときの 1 sim 1 步 ÷ 素 がこれ以下なら「別の文脈では出ない」
    plainJump: 3,      // 素の走行で、warm 400・1600 の 1 步 ÷ warm 100 の 1 步 がこれを超えたら「1 sim でも出る」
  }),
  usage: Object.freeze({ same: 0.10 }),   // 157 ÷ 153 の 1 步の比が 1 ± 0.10 の内なら「同じ桁(差は 10% 以内)」
});

export const LABELS = Object.freeze({
  measure: '測り方(2 sim を同じページに置く対照)に固有',
  app: 'アプリの関数の形に固有(1 sim でも出る)',
  unknown: '分からない',
});

// %GetOptimizationStatus の数の読み(V8 の列挙の bit —— 版で意味が変わり得るので、生の数も必ず並べる)
export const OPT_BITS = Object.freeze([[2, '最適化しない'], [8, 'deopt したかも'], [16, '最適化済み'], [32, 'Maglev'], [64, 'TurboFan'], [128, 'インタプリタ'], [256, '最適化の予約'], [1024, '並行に最適化中'], [16384, 'bit 14(deopt の印)'], [32768, 'Sparkplug']]);
export const decodeOpt = (v) => (Number.isFinite(v) ? `${v}(${OPT_BITS.filter(([m]) => (v & m) === m).map(([, s]) => s).join('・') || '印なし'})` : '取れない');

export const median = (a) => { const s = [...a].filter((x) => Number.isFinite(x)).sort((x, y) => x - y); return s.length ? s[Math.floor(s.length / 2)] : null; };
const r3 = (x) => (Number.isFinite(x) ? +x.toFixed(3) : null);
const r4 = (x) => (Number.isFinite(x) ? +x.toFixed(4) : null);

export function spreadOf(xs) {
  const v = (xs || []).filter((x) => Number.isFinite(x));
  if (!v.length) return { n: 0, min: null, max: null, span: null };
  const mn = Math.min(...v), mx = Math.max(...v);
  return { n: v.length, min: r3(mn), max: r3(mx), span: mn > 0 ? r3(mx / mn) : null };
}

// 1 步の時間(ms)—— perf の行の betaMs は「frames × stepsPerFrame 步」の中央値
export const msPerStepOfRow = (row) => (row && row.frames && row.stepsPerFrameBeta) ? row.betaMs / (row.frames * row.stepsPerFrameBeta) : null;

export function summarizePerfRun(j) {
  if (!j || !Array.isArray(j.results)) throw new Error('perf の結果の形でない');
  const rows = j.results;
  const failedRows = rows.filter((r) => !r.pass).map((r) => r.id);
  const geo2Fail = !!(j.geo2 && j.geo2.gate && j.geo2.gate.pass === false);
  const ab = (j.abJit && Array.isArray(j.abJit.rows)) ? j.abJit.rows : [];
  const abFail = ab.filter((r) => r.judgement === 'gate' && r.failed === true).map((r) => 'abJit.' + (r.arm === 'self-control' ? 'self' : 'cross') + '.' + r.id);
  const nFail = failedRows.length + (geo2Fail ? 1 : 0) + abFail.length;
  const env = j.env || {}, bl = env.browserLaunch || {};
  const ratioOf = (id) => { const r = rows.find((x) => x.id === id); return r ? r.normRatio : null; };
  const stepOf = (id) => { const r = rows.find((x) => x.id === id); return r4(msPerStepOfRow(r)); };
  return {
    chromium: env.chromium || null, jsVersion: bl.jsVersion || null, explicit: bl.explicit === true,
    startedAt: env.startedAt || null, when: j.when || null,
    nRows: rows.length, pass: rows.length - nFail, nFail,
    failed: [...failedRows, ...(geo2Fail ? ['geo2-overhead'] : []), ...abFail],
    retossed: rows.filter((r) => r.retossed).map((r) => ({ id: r.id, first: r.firstNormRatio, final: r.finalRatio, finalPass: r.finalPass })),
    geo2: (j.geo2 && j.geo2.gate) ? j.geo2.gate.ratio : null,
    ratios: Object.fromEntries(rows.map((r) => [r.id, r.normRatio])),
    abJit: ab.map((r) => ({ arm: r.arm, id: r.id, msPerStep: r.msPerStep, baseRef: r.baseRef, ratio: r.ratio, judgement: r.judgement, failed: r.failed === true })),
    usageStep: Object.fromEntries(DECL.usagePresets.map((id) => [id, { betaMsPerStep: stepOf(id), normRatio: ratioOf(id) }])),
  };
}

// 版ごとの表: runs = [{ browser, run, summary }]
export function t2Table(runs) {
  const out = {};
  for (const b of DECL.browsers) {
    const rs = runs.filter((x) => x.browser === b).sort((p, q) => p.run - q.run);
    if (!rs.length) continue;
    const ids = Object.keys(rs[0].summary.ratios);
    const perSample = Object.fromEntries(ids.map((id) => [id, spreadOf(rs.map((x) => x.summary.ratios[id]))]));
    const abKeys = rs[0].summary.abJit.map((r) => r.arm + '/' + r.id);
    const abSpread = Object.fromEntries(abKeys.map((k) => [k, spreadOf(rs.map((x) => (x.summary.abJit.find((r) => r.arm + '/' + r.id === k) || {}).ratio))]));
    const failCount = {};
    for (const x of rs) for (const f of x.summary.failed) failCount[f] = (failCount[f] || 0) + 1;
    out[b] = { chromium: rs[0].summary.chromium, jsVersion: rs[0].summary.jsVersion, runs: rs.length,
      pass: rs.map((x) => x.summary.pass), nRows: rs[0].summary.nRows,
      failCount, perSample, abSpread, geo2: spreadOf(rs.map((x) => x.summary.geo2)),
      worstSample: Object.entries(perSample).sort((p, q) => (q[1].max || 0) - (p[1].max || 0))[0][0] };
  }
  return out;
}

// 切り分け(cut = 器の T3 の 1 版分): { plain:{w100,w400,w1600}, ab:{w100,...}, sep:{perSim}, abSelf? }
//   abSelf = ab.w100 ÷ plain.w100(perf.mjs の自己対照と同じ作り)・sepSelf = sep.perSim ÷ plain.w100
//   plainJump = max(plain.w400, plain.w1600) ÷ plain.w100
export function readCut(cut) {
  const C = DECL.cut;
  const p = cut && cut.plain, a = cut && cut.ab, s = cut && cut.sep;
  if (!p || !a || !Number.isFinite(p.w100) || !Number.isFinite(a.w100)) return { label: LABELS.unknown, key: 'unknown', why: '素か A/B の 1 步が測れていない' };
  const abSelf = a.w100 / p.w100;
  const plainJump = Math.max(p.w400 || 0, p.w1600 || 0) / p.w100;
  const sepSelf = (s && Number.isFinite(s.perSim)) ? s.perSim / p.w100 : null;
  const nums = { abSelf: r3(abSelf), plainJump: r3(plainJump), sepSelf: r3(sepSelf) };
  if (plainJump > C.plainJump) return { label: LABELS.app, key: 'app', why: `素の走行(1 sim)でも warm を延ばすと 1 步が ${r3(plainJump)} 倍(> ${C.plainJump})`, ...nums };
  if (abSelf > C.cliff && sepSelf !== null && sepSelf <= C.sepNear) return { label: LABELS.measure, key: 'measure', why: `同じページの 2 sim で ${r3(abSelf)} 倍(> ${C.cliff})・別のページに置くと ${r3(sepSelf)} 倍(≤ ${C.sepNear})・素は warm を延ばしても ${r3(plainJump)} 倍`, ...nums };
  if (abSelf <= C.cliff) return { label: LABELS.unknown, key: 'unknown', why: `この回は同じページの 2 sim でも ${r3(abSelf)} 倍(≤ ${C.cliff})—— 遅さが出ていない`, ...nums };
  return { label: LABELS.unknown, key: 'unknown', why: `同じページの 2 sim で ${r3(abSelf)} 倍だが、別のページの対照が ${sepSelf === null ? '測れていない' : r3(sepSelf) + ' 倍(> ' + C.sepNear + ')'}`, ...nums };
}

// 普通の使い方: u = { default:{galaxyGeo2,freebox,echo}, explicit153:{…} }(素の 1 步 ms —— 同じ箱)・old = 141 の版の perf の行から出した 1 步(別の箱 —— 比だけ)
export function readUsage(u, old) {
  const rows = [];
  for (const id of DECL.usagePresets) {
    const a = u && u.default && u.default[id], b = u && u.explicit153 && u.explicit153[id];
    const ratio = (Number.isFinite(a) && Number.isFinite(b) && b > 0) ? a / b : null;
    const same = ratio !== null && Math.abs(ratio - 1) <= DECL.usage.same;
    rows.push({ id, ms157: r4(a), ms153: r4(b), ratio157over153: r3(ratio), sameBand: ratio === null ? null : same });
  }
  // 版の中の比(freebox を 1 とする)—— 箱が違う 141 とは、この比だけを並べる
  const relOf = (m) => (m && Number.isFinite(m.freebox) && m.freebox > 0) ? Object.fromEntries(DECL.usagePresets.map((id) => [id, r3(m[id] / m.freebox)])) : null;
  const rel = { v157: relOf(u && u.default), v153: relOf(u && u.explicit153), v141: relOf(old) };
  const allSame = rows.every((r) => r.sameBand === true);
  return { rows, rel, allSame, band: DECL.usage.same,
    reading: rows.some((r) => r.sameBand === null) ? '測れていない標本がある' : allSame ? `3 本とも 157 ÷ 153 が 1 ± ${DECL.usage.same} の内(この箱・この回では、普通の使い方の 1 步は版で変わらない)` : '版で 1 步が 10% を超えて違う標本がある(この箱・この回では)' };
}

// 純関数の場面(QA が確かめる)
export function pureScenes() {
  const mk = (pass, extra = {}) => ({ id: 'x', pass, normRatio: pass ? 1.0 : 1.2, betaMs: 100, frames: 10, stepsPerFrameBeta: 2, ...extra });
  const j = { env: { chromium: '1.2.3', browserLaunch: { explicit: true, jsVersion: '9.9' } },
    results: [mk(true, { id: 'a' }), mk(false, { id: 'b', retossed: true, firstNormRatio: 1.3, finalRatio: 1.2, finalPass: false }), mk(true, { id: 'galaxyGeo2' })],
    geo2: { gate: { ratio: 1.4, pass: true } },
    abJit: { rows: [{ arm: 'self-control', id: 'g', msPerStep: 40, baseRef: 5, ratio: 8, judgement: 'gate', failed: true },
      { arm: 'cross-html', id: 'g', msPerStep: 40, baseRef: 41, ratio: 0.98, judgement: 'informational', failed: false }] } };
  const s = summarizePerfRun(j);
  return {
    summary: s,
    cutMeasure: readCut({ plain: { w100: 5, w400: 5.2, w1600: 4.9 }, ab: { w100: 40 }, sep: { perSim: 5.5 } }),
    cutApp: readCut({ plain: { w100: 5, w400: 20, w1600: 21 }, ab: { w100: 40 }, sep: { perSim: 5 } }),
    cutNone: readCut({ plain: { w100: 5, w400: 5, w1600: 5 }, ab: { w100: 6 }, sep: { perSim: 5 } }),
    cutNoSep: readCut({ plain: { w100: 5, w400: 5, w1600: 5 }, ab: { w100: 40 }, sep: null }),
    spread: spreadOf([1.1, 0.9, 1.0, NaN]),
    usage: readUsage({ default: { galaxyGeo2: 4.6, freebox: 0.3, echo: 0.03 }, explicit153: { galaxyGeo2: 4.5, freebox: 0.36, echo: 0.03 } }, { galaxyGeo2: 9, freebox: 0.6, echo: 0.06 }),
  };
}
export function pureGates(P) {
  const s = P.summary;
  return {
    count: s.nRows === 3 && s.nFail === 2 && s.pass === 1 && s.failed.join(',') === 'b,abJit.self.g',
    retoss: s.retossed.length === 1 && s.retossed[0].id === 'b' && s.retossed[0].finalPass === false,
    step: s.usageStep.galaxyGeo2.betaMsPerStep === 5 && s.explicit === true && s.jsVersion === '9.9',
    cut: P.cutMeasure.key === 'measure' && P.cutApp.key === 'app' && P.cutNone.key === 'unknown' && P.cutNoSep.key === 'unknown',
    spread: P.spread.n === 3 && P.spread.min === 0.9 && P.spread.max === 1.1 && P.spread.span === 1.222,
    usage: P.usage.rows[0].sameBand === true && P.usage.rows[1].sameBand === false && P.usage.allSame === false && P.usage.rel.v141.galaxyGeo2 === 15,
  };
}

// PHYSICS〔第345便d〕に逐語で載せる表
const fmt = (x) => (x === null || x === undefined ? '—' : String(x));
export function tablesOf(J) {
  const T = {};
  const BN = { default: '既定の起動(157)', explicit153: '明示 /opt/pw-browsers/chromium(153)' };
  {
    const L = ['| 版 | 回 | 通過数 | 落ちた標本(最終) | 再トス(初回 → 最終) | 自己対照 galaxyGeo2 | 自己対照 bhCore | 対 html galaxyGeo2 | 対 html bhCore |', '|---|---|---|---|---|---|---|---|---|'];
    for (const x of (J.t2 && J.t2.runs) || []) {
      const s = x.summary, ab = (arm, id) => { const r = s.abJit.find((z) => z.arm === arm && z.id === id); return r ? `${r.ratio}(${r.msPerStep} ÷ ${r.baseRef})` : '—'; };
      L.push(`| ${BN[x.browser]} ${s.chromium} | ${x.run} | ${s.pass}/${s.nRows} | ${s.failed.length ? s.failed.join('・') : 'なし'} | ${s.retossed.length ? s.retossed.map((r) => `${r.id} ${r.first}→${r.final}`).join('・') : 'なし'} | ${ab('self-control', 'galaxyGeo2')} | ${ab('self-control', 'bhCore')} | ${ab('cross-html', 'galaxyGeo2')} | ${ab('cross-html', 'bhCore')} |`);
    }
    T.t2runs = L.join('\n');
  }
  {
    const L = ['| 版 | 通過数(回ごと) | 落ちた回数(標本) | 比の揺れが最も大きい標本(最小〜最大) | geo2 の比(最小〜最大) | 自己対照 galaxyGeo2(最小〜最大) |', '|---|---|---|---|---|---|'];
    for (const [b, v] of Object.entries((J.t2 && J.t2.table) || {})) {
      const w = v.perSample[v.worstSample], g = v.abSpread['self-control/galaxyGeo2'] || {};
      L.push(`| ${BN[b]} ${v.chromium}(V8 ${fmt(v.jsVersion)}) | ${v.pass.join('・')} / ${v.nRows} | ${Object.keys(v.failCount).length ? Object.entries(v.failCount).map(([k, n]) => `${k} ${n} 回`).join('・') : 'なし'} | ${v.worstSample} ${w.min}〜${w.max} | ${v.geo2.min}〜${v.geo2.max} | ${fmt(g.min)}〜${fmt(g.max)} |`);
    }
    T.t2spread = L.join('\n');
  }
  {
    const L = ['| 版 | 素 warm 100 | 素 warm 400 | 素 warm 1600 | A/B warm 100(1 sim 1 步) | A/B warm 400 | A/B warm 1600 | 別のページの 2 sim(1 sim 1 步) | A/B ÷ 素 | 読み |', '|---|---|---|---|---|---|---|---|---|---|'];
    for (const [b, c] of Object.entries((J.t3 && J.t3.cut) || {})) {
      const rd = J.t3.reading[b];
      L.push(`| ${BN[b]} ${c.chromium} | ${fmt(c.plain.w100)} | ${fmt(c.plain.w400)} | ${fmt(c.plain.w1600)} | ${fmt(c.ab.w100)} | ${fmt(c.ab.w400)} | ${fmt(c.ab.w1600)} | ${fmt(c.sep && c.sep.perSim)} | ${fmt(rd.abSelf)} | ${rd.label} |`);
    }
    T.t3cut = L.join('\n');
  }
  {
    const L = ['| 版 | 素の S._core(warm 後) | A/B の A 側の S._core | A/B の B 側の S._core | 素の上位の関数(自己の時間) | A/B の上位の関数(自己の時間) |', '|---|---|---|---|---|---|'];
    for (const [b, d] of Object.entries((J.t3 && J.t3.deopt) || {})) {
      L.push(`| ${BN[b]} ${d.chromium} | ${d.plainCore.decoded} | ${d.abCoreA.decoded} | ${d.abCoreB.decoded} | ${d.plainTop.map((x) => `${x.fn} ${x.pct}%`).join('・')} | ${d.abTop.map((x) => `${x.fn} ${x.pct}%`).join('・')} |`);
    }
    T.t3deopt = L.join('\n');
  }
  {
    const U = J.usage || { rows: [], rel: {} };
    const L = ['| 本 | 157 の素の 1 步(ms) | 153 の素の 1 步(ms) | 157 ÷ 153 | 1 ± 0.10 の内 | 版の中の比(freebox = 1): 157 / 153 / 141(第344便の保存の perf —— 別の箱) |', '|---|---|---|---|---|---|'];
    for (const r of U.rows) L.push(`| ${r.id} | ${fmt(r.ms157)} | ${fmt(r.ms153)} | ${fmt(r.ratio157over153)} | ${r.sameBand === null ? '—' : r.sameBand ? '内' : '外'} | ${fmt(U.rel.v157 && U.rel.v157[r.id])} / ${fmt(U.rel.v153 && U.rel.v153[r.id])} / ${fmt(U.rel.v141 && U.rel.v141[r.id])} |`);
    T.usage = L.join('\n');
  }
  return T;
}
