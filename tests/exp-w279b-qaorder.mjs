// 第279便b(原仮定者の裁定 第69報「QA が長いので対策・確認順を最適化する・確認項目を精査する」・
// 統括の検証項目 R61): QA の**マニフェスト**と**削減率の実測の正本**を作る器。
//
//   node tests/exp-w279b-qaorder.mjs --manifest
//     → tests/qa-manifest.json(最上位の試験の文ごとに id・tier・依存・想定時間・html 依存・W5b の key)。
//       想定時間は保存 `tests/out/qa-results-full-beta.json` / `qa-results-full.json` の実測(W5b/W5c は
//       unitTimings の runMs があればそれ、無ければ `ms` の合計)。**判定には使わない**(順序の目安)。
//   node tests/exp-w279b-qaorder.mjs --record <runs.json>
//     → tests/out/qaorder-w279b.json(provenance w272e-1)。<runs.json> は同一コンテナで回した
//       変更前/変更後のフル走行の記録(壁時計・結果 JSON のパス)。**数は実測だけを写す**。
//
// この器がしないこと: 判定を変えない・閾値/seed/物理時間/母集団に触らない・QA を走らせない
// (走行はシェルから — 同時に 2 本のフル QA を回さない)。
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath, pathToFileURL } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const QO = await import(pathToFileURL(path.join(ROOT, 'tests', 'lib-w279b-qaorder.mjs')).href);
const PV = await import(pathToFileURL(path.join(ROOT, 'tests', 'lib-w272e-provenance.mjs')).href);
const sha = (b) => crypto.createHash('sha256').update(b).digest('hex');
const readJ = (p) => { try { return JSON.parse(fs.readFileSync(p, 'utf8')); } catch { return null; } };

// 結果 JSON → 文ごとの所要(ms)。W5b/W5c は unitTimings の runMs を優先
function unitMs(units, res) {
  const out = new Map();
  if (!res) return out;
  const byId = new Map();
  for (const r of res.results || []) byId.set(r.id, (byId.get(r.id) || 0) + (r.ms || 0));
  const ut = res.unitTimings || {};
  for (const u of units) {
    const { ids, prefixes } = QO.unitIds(u.text);
    let ms = 0;
    for (const [id, v] of byId) if (ids.includes(id) || prefixes.some((p) => id.startsWith(p))) ms += v;
    const key = QO.w5bHeadKey(u.text.split('\n')[0]);
    if (key && ut['W5b:' + key] && typeof ut['W5b:' + key].runMs === 'number') ms = ut['W5b:' + key].runMs;
    out.set(u.l0, ms);
  }
  return out;
}

function buildManifest() {
  const src = fs.readFileSync(path.join(ROOT, 'tests', 'qa.mjs'), 'utf8');
  const units = QO.splitTopLevel(src);
  const deps = QO.unitDeps(units);
  const rb = readJ(path.join(ROOT, 'tests', 'out', 'qa-results-full-beta.json'));
  const rr = readJ(path.join(ROOT, 'tests', 'out', 'qa-results-full.json'));
  const mb = unitMs(units, rb), mr = unitMs(units, rr);
  const rows = [];
  units.forEach((u, i) => {
    const key = QO.w5bHeadKey(u.text.split('\n')[0]);
    if (!QO.isTestUnit(u) && !key) return;
    const cls = QO.classifyUnit(u);
    const { ids, prefixes } = QO.unitIds(u.text);
    rows.push({ l0: u.l0, l1: u.l1, kind: u.kind, ids, prefixes, w5b: key,
      tier: key ? 'pooled' : cls.tier, htmlDependent: cls.htmlDependent, deps: deps[i],
      expectedMsBeta: mb.get(u.l0) ?? null, expectedMsRoot: mr.get(u.l0) ?? null });
  });
  const tiers = {};
  for (const r of rows) tiers[r.tier] = (tiers[r.tier] || 0) + 1;
  return {
    schema: 'qa-manifest/w279b-1',
    generatedAt: new Date().toISOString(),
    generator: 'tests/exp-w279b-qaorder.mjs --manifest',
    qaSha256AtGeneration: sha(src),
    expectedFrom: {
      beta: rb ? { file: 'tests/out/qa-results-full-beta.json', commit: rb.commit, date: rb.date, total: rb.total } : null,
      root: rr ? { file: 'tests/out/qa-results-full.json', commit: rr.commit, date: rr.date, total: rr.total } : null,
    },
    order: [
      'preflight: tests/qa-preflight.mjs(tier=lint の文 + 全内蔵の受理/構築/1 歩 — Chromium なし)',
      'replay: QA_REPLAY_FAIL=1 なら前回 FAIL の文を別プロセスで先に(QA_BAIL=1 で FAIL なら停止)',
      'main: qa.mjs の本文順(先頭の lint 群 → ブラウザ)。tier=pooled は W5c/W5b プールで先行し元の位置で再生',
    ],
    note: '想定時間(expectedMs*)は順序の目安で判定に使わない。ms は「直前の add() からの経過」なので並列の待ちを含む'
      + '(W5b は unitTimings.runMs を優先)。qa.mjs が変わったら --manifest で作り直す(古さは lint.qaOrder で FAIL にしない)',
    tiers,
    units: rows,
  };
}

const args = process.argv.slice(2);
if (args[0] === '--manifest') {
  const m = buildManifest();
  fs.writeFileSync(path.join(ROOT, 'tests', 'qa-manifest.json'), JSON.stringify(m, null, 1) + '\n');
  console.log(`tests/qa-manifest.json: ${m.units.length} 文 ${JSON.stringify(m.tiers)}`);
} else if (args[0] === '--record') {
  const spec = readJ(args[1]);
  if (!spec) throw new Error('runs.json が読めない: ' + args[1]);
  // 各走行: { tag, target, codeState, wallMs, exit, results: <結果 JSON の絶対パス>, cpu: {machine, own, others, samples}, note }
  const runs = spec.runs.map((r) => {
    const j = readJ(r.results);
    return { tag: r.tag, target: r.target, codeState: r.codeState, note: r.note || null, wallMs: r.wallMs, exit: r.exit,
      resultsFile: r.results ? path.basename(r.results) : null,   // 走行ごとの結果 JSON(作業領域 — 公開しない。sha256 で同定)
      total: j ? j.total : null, failed: j ? j.failed : null, pass: j ? j.pass : null,
      durationMsSumOfMs: j ? j.durationMs : null, wallDurationMs: j ? (j.wallDurationMs ?? null) : null,
      cacheCached: j && j.cache ? j.cache.cachedCount : null, targetSha256: j ? j.targetSha256 : null,
      resultsSha256: r.results && fs.existsSync(r.results) ? sha(fs.readFileSync(r.results)) : null,
      failedIds: j ? j.results.filter((x) => !x.pass).map((x) => x.id) : null,
      // CPU(コア数の平均・10 秒ごと): machine=機械全体・own=この走行のプロセス木・others=差(他の走行)
      cpu: r.cpu || null,
      w5: j ? (j.w5 || null) : null,
      _res: j };
  });
  // 合否の同一性: 同じ target の before/after で id → pass を突き合わせる
  const pairs = [];
  for (const t of [...new Set(runs.map((r) => r.target))]) {
    const b = runs.find((r) => r.target === t && r.codeState === 'before');
    const a = runs.find((r) => r.target === t && r.codeState === 'after');   // 本便の最終コードの走行(ワーカー nice 付き)
    if (!b || !a || !b._res || !a._res) continue;
    const key = (res) => { const m = new Map(); for (const x of res.results) { const k = x.id; m.set(k, (m.get(k) || []).concat([x.pass])); } return m; };
    const kb = key(b._res), ka = key(a._res);
    const onlyB = [...kb.keys()].filter((k) => !ka.has(k)), onlyA = [...ka.keys()].filter((k) => !kb.has(k));
    const passDiff = [...kb.keys()].filter((k) => ka.has(k) && JSON.stringify(kb.get(k)) !== JSON.stringify(ka.get(k)));
    // detail の一致(時間・日時を含む行は差が出うる — 数を記録するだけ)
    const db = new Map(b._res.results.map((x) => [x.id, x.detail])), da = new Map(a._res.results.map((x) => [x.id, x.detail]));
    const detailDiff = [...db.keys()].filter((k) => da.has(k) && db.get(k) !== da.get(k));
    const orderSame = b._res.results.map((x) => x.id).join('\n') === a._res.results.map((x) => x.id).join('\n');
    pairs.push({ target: t, before: b.tag, after: a.tag, totalBefore: b.total, totalAfter: a.total,
      failedBefore: b.failed, failedAfter: a.failed, idsOnlyBefore: onlyB, idsOnlyAfter: onlyA, passDiff,
      orderSame, detailDiffCount: detailDiff.length, detailDiffIds: detailDiff.slice(0, 80),
      wallBeforeMs: b.wallMs, wallAfterMs: a.wallMs,
      reductionPct: (b.wallMs && a.wallMs) ? +((1 - a.wallMs / b.wallMs) * 100).toFixed(1) : null });
  }
  for (const r of runs) delete r._res;
  const out = {
    meta: PV.provenanceMeta({ root: ROOT, wave: '第279便b', target: 'tests/lib-w279b-qaorder.mjs',
      code: ['tests/exp-w279b-qaorder.mjs', 'tests/lib-w279b-qaorder.mjs', 'tests/lib-w279b-headless.mjs', 'tests/qa-preflight.mjs'],
      inputs: ['tests/lib-w279b-qaorder.mjs'] }),
    what: 'QA の確認順・並列化(W5b)・失敗注入・preflight の実測(判定式・閾値・seed・物理時間・母集団は不変)',
    environment: spec.environment || null,
    runs, pairs,
    preflight: spec.preflight || null,
    w5cFault: { pure: await QO.w5PoolSelfTest({ timeoutMs: 1000 }), integration: spec.faultIntegration || null },
    classification: spec.classification || null,
    notDone: spec.notDone || null,
  };
  fs.writeFileSync(path.join(ROOT, 'tests', 'out', 'qaorder-w279b.json'), JSON.stringify(out, null, 1) + '\n');
  console.log('tests/out/qaorder-w279b.json:', pairs.map((p) => `${p.target} ${p.wallBeforeMs}→${p.wallAfterMs} ms (${p.reductionPct}%) passDiff=${p.passDiff.length}`).join(' / '));
} else {
  console.log('usage: node tests/exp-w279b-qaorder.mjs --manifest | --record <runs.json>');
  process.exit(2);
}
