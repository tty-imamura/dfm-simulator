// 第353便i(統括の検証項目 R473 —— 道具だけ・html は変えない): **事前検査の一時の写しの名の型**を 1 か所に。
//   事前検査の道具 tests/qa-preflight.mjs は、走っている間 tests/.qa-preflight-<pid>.mjs(tests/qa.mjs のブラウザに触れない文の写し)を置き、終わるときに消す。
//   異常終了(SIGKILL・箱の再起動)では写しが残る。tests/ を走査する検査は、この写しを qa.mjs と同じ扱い(読まない)にする —— 名の型はここだけに書く。
//   isQaTempCopy(name)      名が写しの型 /^\.qa-preflight-\d+\.mjs$/ か(道は渡さない —— ファイルの名だけ)
//   qaTempPid(name)         写しの名の pid(写しでなければ null)
//   pidAlive(pid)           その pid の走行が生きているか(process.kill(pid, 0) —— EPERM は生きている側)
//   staleTempCopies(dir, alive = pidAlive, self = process.pid)  dir の中の写しのうち、pid が生きていないものの名(自分の pid の写しは入れない)
// 言わないこと: 「この lib で事前検査が速くなった・検査が変わった」(名の型を 1 か所にまとめ、古い写しを消す口を置くだけ)。
import fs from 'node:fs';

export const LIB_VERSION = 'w353i-qatemp-lib-1';
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

/** dir の中の写しのうち、pid が生きていないものの名(並びは名の順・自分の pid は入れない・dir が読めなければ空) */
export function staleTempCopies(dir, alive = pidAlive, self = process.pid) {
  let L = [];
  try { L = fs.readdirSync(dir); } catch (e) { return []; }
  return L.filter((f) => isQaTempCopy(f)).filter((f) => { const p = qaTempPid(f); return p !== self && !alive(p); }).sort();
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
  }
  return { version: LIB_VERSION, rows, ok: rows.every((r) => r.ok) };
}
