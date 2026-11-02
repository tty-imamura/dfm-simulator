// 第323便d(統括の検証項目 R278・原仮定者の指示(2026-11-01)「サンプルの変更だけでは、全行程を再実行しない様にする」): **部分の再検査の補足の記録**(純関数)。
//
// ■ 何のためか
//   保存のフル QA(tests/out/qa-results-full-beta.json ほか)で FAIL が出たとき、直した後にフルを繰り返さず、FAIL の ID だけを部分 QA
//   (tests/exp-w258c-qapart.mjs)で再検査して閉じる便がある。保存のフルの結果は「1349/1350」のまま残るので、「同じ html の上で、FAIL の
//   全部を直した後の再検査で PASS にした」ことを**機械で読める補足**として残す。補足が持つもの:
//     ① 元のフルへの参照(ファイルの sha256・commit・日付・対象 html と sha256・版名・PASS/全体・FAIL の ID)
//     ② 直したファイル(文書・検査のコード)の sha256(直す前 —— フルの commit の版 —— と直した後)と commit
//     ③ 検査のコード(tests/qa.mjs)の sha256(フルの時点・再検査の時点)と、再検査した html の sha256
//     ④ 再検査した ID と結果(PASS・FAIL・SKIP・未実行 —— 部分 QA の印字から読む)
//     ⑤ 結論(フルの FAIL が全部、直した後の再検査で PASS か・同じ html か・再検査に FAIL と未実行が無いか)
//   **補足は保存のフルの結果を書き換えない**(フルの PASS の集合はそのまま —— 状況の判定の根拠 ID も変えない)。来歴の文に出すだけ。
// ■ 形(版 RECHECK_VERSION)—— 1 本の追記型: { version, kind, target, full:{…}, records:[{…}] }。同じフル(sha256)への再検査は records に足す。
import crypto from 'node:crypto';

export const RECHECK_VERSION = 'w323d-recheck-1';
export const RECHECK_KIND = 'qa-partial-recheck';
export const RECHECK_FILE = { 'beta/index.html': 'tests/out/qa-recheck-beta.json', 'index.html': 'tests/out/qa-recheck.json' };
export const FULL_FILE = { 'beta/index.html': 'tests/out/qa-results-full-beta.json', 'index.html': 'tests/out/qa-results-full.json' };
const HEX64 = /^[0-9a-f]{64}$/;

export const sha256 = (buf) => crypto.createHash('sha256').update(buf).digest('hex');

/**
 * 部分 QA(tests/exp-w258c-qapart.mjs)の印字を読む。行の型: `PASS <id>…`・`FAIL <id>…`・`SKIP <id>…`、
 * 要求した鍵: `# 切り出し: a / b  (…行)`・`# 束 k/n: a / b  (…行)`、未実行: 「未実行」を含む行の `:` の後の ID の並び
 * (` / `・`,`・空白で区切る)か、`FAIL <id>  …(did not execute|未実行)`。要求した鍵が印字に無ければ `requested` を引数で渡す。
 * 要求したのに PASS/FAIL/SKIP のどれにも出ない鍵は**未実行**に数える(走らない鍵を成功に数えない)。
 */
export function parseQapartLog(text, requested) {
  const lines = String(text || '').split('\n');
  const req = [];
  const addReq = (s) => { for (const id of s.split(/\s+\/\s+/).map((z) => z.trim()).filter(Boolean)) if (!req.includes(id)) req.push(id); };
  const res = new Map();
  const notRunSaid = new Set();
  for (const l of lines) {
    let m = l.match(/^# 切り出し: (.+?)\s{2}\(/) || l.match(/^# 束 \d+\/\d+: (.+?)\s{2}\(/);
    if (m) { addReq(m[1]); continue; }
    m = l.match(/^(PASS|FAIL|SKIP) (\S+)/);
    if (m) {
      const id = m[2];
      if (m[1] === 'FAIL' && /did not execute|未実行/.test(l)) { notRunSaid.add(id); continue; }
      const prev = res.get(id);
      // 同じ ID が複数回出たら FAIL を優先(1 回でも落ちたら落ちた)
      if (!prev || m[1] === 'FAIL' || (prev === 'SKIP' && m[1] === 'PASS')) res.set(id, m[1]);
      continue;
    }
    m = l.match(/未実行[^:：]*[:：]\s*(.+)$/);
    if (m && !/^\s*#?\s*--batch/.test(l)) for (const id of m[1].split(/\s*(?:\/|,|、|\s)\s*/).map((z) => z.trim()).filter((z) => /^[A-Za-z][\w.-]*\.[\w.-]+$/.test(z))) notRunSaid.add(id);
  }
  const requestedIds = (requested && requested.length ? requested.slice() : req.length ? req : [...res.keys()]).filter((v, i, a) => a.indexOf(v) === i);
  const results = requestedIds.filter((id) => res.has(id) && !notRunSaid.has(id)).map((id) => ({ id, status: res.get(id) }));
  const extra = [...res.keys()].filter((id) => !requestedIds.includes(id)).map((id) => ({ id, status: res.get(id) }));
  const notRun = requestedIds.filter((id) => !res.has(id) || notRunSaid.has(id));
  const count = (s) => results.filter((z) => z.status === s).length;
  return { requested: requestedIds, results, extra, notRun,
    summary: { pass: count('PASS'), fail: count('FAIL'), skip: count('SKIP'), notRun: notRun.length, requested: requestedIds.length } };
}

/** 保存のフル QA の参照(ファイルの中身と sha256 から)。 */
export function fullRefOf(fullJson, fileRel, fileSha) {
  const j = fullJson || {};
  const failedIds = (j.results || []).filter((r) => !r.pass).map((r) => r.id);
  const total = Number.isFinite(j.total) ? j.total : (j.results || []).length;
  return { file: fileRel, sha256: fileSha, commit: j.commit || null, date: j.date || null, tier: j.tier || (j.fast === false ? 'full' : 'fast'),
    target: j.target || null, targetSha256: j.targetSha256 || null, betaBuild: j.swCache || null, appVersion: j.appVersion || null,
    total, failed: failedIds.length, passed: total - failedIds.length, failedIds };
}

/**
 * 補足の記録 1 件を作る。
 * @param {{full, fixes:Array<{path,commit?,sha256Before?,sha256After}>, code:Array<{path,sha256AtFull?,sha256AtRecheck}>,
 *          html:{path, sha256}, parsed: ReturnType<parseQapartLog>, log?:{file?, sha256?}, when?, note?}} a
 */
export function buildRecheckEntry(a) {
  const full = a.full, P = a.parsed;
  const passIds = new Set(P.results.filter((z) => z.status === 'PASS').map((z) => z.id));
  const failNow = P.results.filter((z) => z.status === 'FAIL').map((z) => z.id);
  const fixedFailed = full.failedIds.filter((id) => passIds.has(id));
  const stillFailed = full.failedIds.filter((id) => !passIds.has(id));
  const sameHtml = !!(a.html && full.targetSha256 && a.html.sha256 === full.targetSha256);
  const codeSame = (a.code || []).every((c) => !c.sha256AtFull || c.sha256AtFull === c.sha256AtRecheck);
  const closed = stillFailed.length === 0 && failNow.length === 0 && P.notRun.length === 0 && sameHtml;
  return {
    when: a.when || null, note: a.note || null,
    fixes: (a.fixes || []).map((f) => ({ path: f.path, commit: f.commit || null, sha256Before: f.sha256Before || null, sha256After: f.sha256After })),
    code: (a.code || []).map((c) => ({ path: c.path, sha256AtFull: c.sha256AtFull || null, sha256AtRecheck: c.sha256AtRecheck, same: !c.sha256AtFull || c.sha256AtFull === c.sha256AtRecheck })),
    html: { path: a.html ? a.html.path : null, sha256: a.html ? a.html.sha256 : null, sameAsFull: sameHtml },
    recheck: { tool: 'tests/exp-w258c-qapart.mjs', log: a.log || null, requested: P.requested, results: P.results, notRun: P.notRun, summary: P.summary },
    conclusion: {
      fullFailed: full.failedIds.slice(), fixedFailed, stillFailed, newFail: failNow, notRun: P.notRun.slice(),
      sameHtml, qaCodeSame: codeSame, closed,
      effective: { total: full.total, passedFull: full.passed, recheckedPass: fixedFailed.length, passedWithRecheck: full.passed + fixedFailed.length },
      rule: '閉じる = フルの FAIL の全部が再検査で PASS・再検査に FAIL と未実行が無い・再検査がフルと同じ html の上。検査のコードの sha256 はフルの時点と再検査の時点を並べる(違えば同じでないと書く —— 閉じるかどうかは変えない)',
    },
  };
}

/** 追記型の記録(既存の記録 doc が同じフルを指せば records に足す・違えば新しく作る)。 */
export function appendRecheck(doc, full, entry, target) {
  const base = (doc && doc.version === RECHECK_VERSION && doc.full && doc.full.sha256 === full.sha256) ? doc
    : { version: RECHECK_VERSION, kind: RECHECK_KIND, target: target || full.target, full, records: [],
      says: '保存のフル QA の後の部分の再検査の補足。**フルの結果は書き換えない**(フルの PASS の集合はそのまま)。同じフルへの再検査は records に足す' };
  base.full = full;
  base.records = (base.records || []).concat([entry]);
  base.latest = summaryOf(base);
  return base;
}

/** 記録全体の要約(最後の記録の結論と、FAIL の ID ごとの最後の再検査の結果)。 */
export function summaryOf(doc) {
  const recs = (doc && doc.records) || [];
  const last = recs[recs.length - 1] || null;
  const passBy = new Set();
  for (const r of recs) for (const z of ((r.recheck || {}).results || [])) if (z.status === 'PASS') passBy.add(z.id);
  const failed = ((doc && doc.full) || {}).failedIds || [];
  const covered = failed.filter((id) => passBy.has(id));
  return { records: recs.length, closed: !!(last && last.conclusion && last.conclusion.closed) && covered.length === failed.length,
    fullPassed: ((doc && doc.full) || {}).passed ?? null, fullTotal: ((doc && doc.full) || {}).total ?? null,
    recheckedIds: [...new Set(recs.flatMap((r) => ((r.recheck || {}).results || []).map((z) => z.id)))],
    recheckPass: last ? last.recheck.summary.pass : 0, recheckRequested: last ? last.recheck.summary.requested : 0,
    failedCovered: covered.length, failed: failed.length };
}

/** 形の検査(QA lint.qaRecheck323 と道具の --check が同じ 1 本を読む)。返す: 問題の文の配列(空なら可)。 */
export function validateRecheck(doc) {
  const bad = [];
  if (!doc || typeof doc !== 'object') return ['記録が object でない'];
  if (doc.version !== RECHECK_VERSION) bad.push('版が ' + RECHECK_VERSION + ' でない: ' + doc.version);
  if (doc.kind !== RECHECK_KIND) bad.push('kind が ' + RECHECK_KIND + ' でない');
  const F = doc.full || {};
  if (!HEX64.test(String(F.sha256 || ''))) bad.push('full.sha256 が 64 桁の 16 進でない');
  if (F.targetSha256 && !HEX64.test(String(F.targetSha256))) bad.push('full.targetSha256 が 64 桁の 16 進でない');
  if (!Array.isArray(F.failedIds)) bad.push('full.failedIds が配列でない');
  else if (F.failed !== F.failedIds.length) bad.push('full.failed ≠ failedIds の数');
  if (Number.isFinite(F.total) && Number.isFinite(F.passed) && F.passed + (F.failed || 0) !== F.total) bad.push('full.passed + failed ≠ total');
  if (!Array.isArray(doc.records) || !doc.records.length) bad.push('records が空');
  for (const [k, r] of (doc.records || []).entries()) {
    const at = 'records[' + k + ']';
    for (const f of (r.fixes || [])) {
      if (!f.path) bad.push(at + ' の fixes に path が無い');
      if (!HEX64.test(String(f.sha256After || ''))) bad.push(at + ' の fixes ' + f.path + ' の sha256After が 64 桁の 16 進でない');
      if (f.sha256Before && !HEX64.test(String(f.sha256Before))) bad.push(at + ' の fixes ' + f.path + ' の sha256Before が 64 桁の 16 進でない');
      if (f.sha256Before && f.sha256Before === f.sha256After) bad.push(at + ' の fixes ' + f.path + ' が直す前と同じ sha256');
    }
    for (const c of (r.code || [])) if (!HEX64.test(String(c.sha256AtRecheck || ''))) bad.push(at + ' の code ' + c.path + ' の sha256AtRecheck が 64 桁の 16 進でない');
    if (!r.html || !HEX64.test(String(r.html.sha256 || ''))) bad.push(at + ' の html.sha256 が 64 桁の 16 進でない');
    const R = r.recheck || {}, S = R.summary || {};
    const ids = (R.results || []).map((z) => z.id);
    if (new Set(ids).size !== ids.length) bad.push(at + ' の再検査の ID が重なる');
    for (const z of (R.results || [])) if (!['PASS', 'FAIL', 'SKIP'].includes(z.status)) bad.push(at + ' の ' + z.id + ' の状態が PASS/FAIL/SKIP でない');
    const cnt = (s) => (R.results || []).filter((z) => z.status === s).length;
    if (S.pass !== cnt('PASS') || S.fail !== cnt('FAIL') || S.skip !== cnt('SKIP') || S.notRun !== (R.notRun || []).length) bad.push(at + ' の要約の数が結果と合わない');
    if (S.requested !== (R.requested || []).length || (R.requested || []).some((id) => !ids.includes(id) && !(R.notRun || []).includes(id))) bad.push(at + ' の要求した鍵が結果と未実行の和と合わない');
    const C = r.conclusion || {};
    const passIds = new Set((R.results || []).filter((z) => z.status === 'PASS').map((z) => z.id));
    const fixed = (F.failedIds || []).filter((id) => passIds.has(id));
    const still = (F.failedIds || []).filter((id) => !passIds.has(id));
    const sameHtml = !!(F.targetSha256 && r.html && r.html.sha256 === F.targetSha256);
    if (JSON.stringify(C.fixedFailed) !== JSON.stringify(fixed)) bad.push(at + ' の結論 fixedFailed が結果から作った集合と違う');
    if (JSON.stringify(C.stillFailed) !== JSON.stringify(still)) bad.push(at + ' の結論 stillFailed が結果から作った集合と違う');
    if (C.sameHtml !== sameHtml || (r.html && r.html.sameAsFull !== sameHtml)) bad.push(at + ' の結論 sameHtml が sha256 の比較と違う');
    const closed = still.length === 0 && cnt('FAIL') === 0 && (R.notRun || []).length === 0 && sameHtml;
    if (C.closed !== closed) bad.push(at + ' の結論 closed が規則(FAIL の全部が PASS・FAIL と未実行 0・同じ html)と違う');
    if (C.effective && C.effective.passedWithRecheck !== (F.passed || 0) + fixed.length) bad.push(at + ' の effective.passedWithRecheck が合わない');
  }
  if (doc.latest && JSON.stringify(doc.latest) !== JSON.stringify(summaryOf(doc))) bad.push('latest が records から作った要約と違う');
  return bad;
}

/**
 * samplestatus の来歴の文(保存 QA の来歴の行の末尾に足す 1 文)。補足が無い・別のフルを指す・形が通らないなら null(今と同じ文)。
 * @param {object|null} doc  補足の記録
 * @param {string} fullSha   今の保存のフルのファイルの sha256
 */
export function recheckProvenanceOf(doc, fullSha, fileRel) {
  if (!doc) return null;
  if (validateRecheck(doc).length) return { applied: false, why: '補足の記録の形が通らない', file: fileRel };
  if (!doc.full || doc.full.sha256 !== fullSha) return { applied: false, why: '補足の記録が今の保存のフルと違うフルを指す', file: fileRel, fullSha256: doc.full ? doc.full.sha256 : null };
  const S = summaryOf(doc), last = doc.records[doc.records.length - 1];
  const ids = S.recheckedIds;
  const fixes = [...new Set(doc.records.flatMap((r) => (r.fixes || []).map((f) => f.path)))];
  const ja = `保存のフル ${S.fullPassed}/${S.fullTotal} + 部分の再検査 ${S.recheckPass}/${S.recheckRequested}(${ids.map((z) => '`' + z + '`').join('・')}`
    + (fixes.length ? ` —— 直したファイル ${fixes.map((z) => '`' + z + '`').join('・')}` : '')
    + `・${last.html.sameAsFull ? '同じ html' : '**html が違う**'})—— ${S.closed ? 'フルの FAIL の全部を再検査で閉じた' : '**閉じていない**(残る FAIL ' + (S.failed - S.failedCovered) + ')'}(補足の記録 \`${fileRel}\`・${doc.version})`;
  return { applied: true, file: fileRel, version: doc.version, fullSha256: doc.full.sha256, records: S.records, closed: S.closed,
    fullPassed: S.fullPassed, fullTotal: S.fullTotal, recheckPass: S.recheckPass, recheckRequested: S.recheckRequested, recheckedIds: ids, fixes,
    sameHtml: last.html.sameAsFull, text: ja };
}
