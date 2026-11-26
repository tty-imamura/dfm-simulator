// 第353便i(統括の検証項目 R473 —— 道具だけ・html は変えない): **事前検査の一時の写しの名の型**を 1 か所に。
//   事前検査の道具 tests/qa-preflight.mjs は、走っている間 tests/.qa-preflight-<pid>.mjs(tests/qa.mjs のブラウザに触れない文の写し)を置き、終わるときに消す。
//   異常終了(SIGKILL・箱の再起動)では写しが残る。tests/ を走査する検査は、この写しを qa.mjs と同じ扱い(読まない)にする —— 名の型はここだけに書く。
//   isQaTempCopy(name)      名が写しの型 /^\.qa-preflight-\d+\.mjs$/ か(道は渡さない —— ファイルの名だけ)
//   qaTempPid(name)         写しの名の pid(写しでなければ null)
//   pidAlive(pid)           その pid の走行が生きているか(process.kill(pid, 0) —— EPERM は生きている側)
//   staleTempCopies(dir, alive = pidAlive, self = process.pid, opts = {})  dir の中の写しのうち、pid が生きていないもの —— または(第356便e)更新の時刻が
//                           opts.maxAgeMs(既定 STALE_AGE_MS = 6 時間)より古いもの —— の名(自分の pid の写しは入れない)
//   第356便e(R517): プロセス番号が使い回されると、生きている別の走行の番号で古い写しが残る → 写しの古さでも数える口を足した。事前検査の道具の一周は
//   約 22.5 分(tests/qa-preflight.mjs の頭の注)なので、走っている事前検査の写しは 6 時間より新しい —— 消さない。opts.maxAgeMs に Infinity か null を渡すと
//   第353便i の選び方(pid だけ)と同じ。opts.now・opts.mtimeOf(名 → ミリ秒)は自己試験のための口。更新の時刻が読めない写しは古さでは数えない。
// 言わないこと: 「この lib で事前検査が速くなった・検査が変わった」(名の型を 1 か所にまとめ、古い写しを消す口を置くだけ)。
import fs from 'node:fs';

export const LIB_VERSION = 'w353i-qatemp-lib-2';   // 第356便e: -1 → -2(写しの古さの口)
export const STALE_AGE_MS = 6 * 3600 * 1000;
export const QA_TEMP_RE = /^\.qa-preflight-(\d+)\.mjs$/;

/** 名(ファイルの名だけ)が事前検査の一時の写しの型か */
export function isQaTempCopy(name) {
  return typeof name === 'string' && QA_TEMP_RE.test(name);
}

/** 写しの名の pid(写しでなければ null) */
export function qaTempPid(name) {
  const m = typeof name === 'string' ? QA_TEMP_RE.exec(name) : null;
  return m ? Number(m[1]) : null;
}

/** pid の走行が生きているか(EPERM = 在るが権限が無い → 生きている側) */
export function pidAlive(pid) {
  if (!(Number.isInteger(pid) && pid > 0)) return false;
  try { process.kill(pid, 0); return true; } catch (e) { return !!(e && e.code === 'EPERM'); }
}

/** dir の中の写しのうち、pid が生きていないもの・または更新の時刻が maxAgeMs より古いものの名(並びは名の順・自分の pid は入れない・dir が読めなければ空) */
export function staleTempCopies(dir, alive = pidAlive, self = process.pid, opts = {}) {
  let L = [];
  try { L = fs.readdirSync(dir); } catch (e) { return []; }
  const o = opts || {};
  const maxAge = o.maxAgeMs === undefined ? STALE_AGE_MS : o.maxAgeMs;
  const useAge = typeof maxAge === 'number' && Number.isFinite(maxAge) && maxAge >= 0;
  const now = Number.isFinite(o.now) ? o.now : Date.now();
  const mtimeOf = typeof o.mtimeOf === 'function' ? o.mtimeOf : (f) => fs.statSync(dir + '/' + f).mtimeMs;
  const old = (f) => { if (!useAge) return false; let t; try { t = mtimeOf(f); } catch (e) { return false; } return Number.isFinite(t) && now - t > maxAge; };
  return L.filter((f) => isQaTempCopy(f)).filter((f) => { const p = qaTempPid(f); return p !== self && (!alive(p) || old(f)); }).sort();
}

/** 自己試験(名の型・pid・古い写しの選び方 —— 作りものの木は呼ぶ側が渡す) */
export function selfTest353i(tmpDir) {
  const rows = [];
  const nm = [['.qa-preflight-12731.mjs', true], ['.qa-preflight-1.mjs', true], ['.qa-preflight-.mjs', false], ['.qa-preflight-12x.mjs', false], ['qa-preflight-1.mjs', false],
    ['.qa-preflight-1.mjs.bak', false], ['qa.mjs', false], ['lib-w353i-qatemp.mjs', false], ['tests/.qa-preflight-1.mjs', false], [null, false]];
  for (const [n, want] of nm) rows.push({ name: '名の型 ' + JSON.stringify(n), ok: isQaTempCopy(n) === want });
  rows.push({ name: 'pid の読み', ok: qaTempPid('.qa-preflight-4242.mjs') === 4242 && qaTempPid('qa.mjs') === null });
  rows.push({ name: '自分の pid は生きている', ok: pidAlive(process.pid) === true && pidAlive(0) === false && pidAlive(-1) === false });
  if (tmpDir) {
    for (const f of ['.qa-preflight-11.mjs', '.qa-preflight-22.mjs', '.qa-preflight-' + process.pid + '.mjs', 'qa.mjs', '.qa-preflight-x.mjs']) fs.writeFileSync(tmpDir + '/' + f, '// w353i\n');
    const alive = (p) => p === 22;
    const got = staleTempCopies(tmpDir, alive);
    rows.push({ name: '古い写しの選び方(生きている 22 と自分は残す)', ok: JSON.stringify(got) === JSON.stringify(['.qa-preflight-11.mjs']), got });
    rows.push({ name: '読めない置き場は空', ok: staleTempCopies(tmpDir + '/無い', alive).length === 0 });
    // 第356便e: 写しの古さの口(pid が使い回されて生きていても、古い写しは古いと数える —— 自分の写しと新しい写しは残す)
    const T = 1.8e12, ages = { '.qa-preflight-11.mjs': T - 1000, '.qa-preflight-22.mjs': T - STALE_AGE_MS - 1, ['.qa-preflight-' + process.pid + '.mjs']: T - 10 * STALE_AGE_MS };
    const mt = (f) => { if (!(f in ages)) throw new Error('無い'); return ages[f]; };
    const g2 = staleTempCopies(tmpDir, alive, process.pid, { now: T, mtimeOf: mt });
    rows.push({ name: '(第356便e)生きている 22 でも 6 時間より古い写しは古い・自分は残す', ok: JSON.stringify(g2) === JSON.stringify(['.qa-preflight-11.mjs', '.qa-preflight-22.mjs']), got: g2 });
    const g3 = staleTempCopies(tmpDir, () => true, process.pid, { now: T, mtimeOf: mt });
    rows.push({ name: '(第356便e)全部生きている: 6 時間より古い写し 22 だけ(新しい 11 は残す)', ok: JSON.stringify(g3) === JSON.stringify(['.qa-preflight-22.mjs']), got: g3 });
    const g4 = staleTempCopies(tmpDir, () => true, process.pid, { now: T, mtimeOf: mt, maxAgeMs: Infinity });
    const g5 = staleTempCopies(tmpDir, () => true, process.pid, { now: T, mtimeOf: mt, maxAgeMs: null });
    rows.push({ name: '(第356便e)maxAgeMs Infinity・null は第353便i の選び方(pid だけ)', ok: g4.length === 0 && g5.length === 0 });
    const g6 = staleTempCopies(tmpDir, () => true, process.pid, { now: T, mtimeOf: () => { throw new Error('読めない'); } });
    rows.push({ name: '(第356便e)更新の時刻が読めない写しは古さでは数えない', ok: g6.length === 0 });
    const g7 = staleTempCopies(tmpDir, alive);
    rows.push({ name: '(第356便e)既定の引数・今書いた写し → 第353便i と同じ選び方', ok: JSON.stringify(g7) === JSON.stringify(['.qa-preflight-11.mjs']), got: g7 });
  }
  return { version: LIB_VERSION, rows, ok: rows.every((r) => r.ok) };
}
