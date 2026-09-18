// 第272便a(第62報・AG27): **停止条件の基点抽出を切り直す器**。
//
// ■ なぜ切り直すか
//   `tests/data-w270a-stoprule-base.json` は **f6c19b4(第269便)** の走行から抽出した表で、
//   第270便c(AD9)の採用レコード一組化で 🩺🪀🩹 の導出 a が動き、第271便a(AF2)で ❄️ の
//   步数宣言が入ったので、**基点と今の走行は 9 段で一致しない**。第271便a はそれを
//   `BASE_REPLAY_EXCEPTIONS`(宣言例外)で通していた ——「違ってよい段」の列挙である。
//   例外が積み上がると「宣言の無い差を 1 段でも落とす」という照合の意味が薄れるので、
//   **基点そのものを 743ad9b(第271便・PR #273)へ切り直す**。
//   **旧基点は消さない**(`tests/data-w270a-stoprule-base-f6c19b4.json` へ履歴として残す)。
//
// ■ この器が言わないこと
//   「基点を切り直したので収束した」「差が消えたので正しくなった」。
//   基点は**照合の相手**であって、精度の主張ではない。差が消えるのは、基点が今の宣言で
//   走った記録になったからである(**差が「無かったこと」になるのではない** —— 旧基点との
//   差は `history` 欄と docs に残る)。
//
// 実行: node tests/exp-w272a-stoprulebase.mjs --from <calaudit.json> --commit <sha> [--out <file>]
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import crypto from 'node:crypto';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const argv = process.argv.slice(2);
const arg = (k, dflt = null) => { const i = argv.indexOf(k);
  return (i >= 0 && argv[i + 1] && !argv[i + 1].startsWith('--')) ? argv[i + 1] : dflt; };
const FROM = arg('--from', path.join(ROOT, 'tests', 'out', 'calaudit-w249.json'));
const COMMIT = arg('--commit', null);
const OUT = arg('--out', path.join(ROOT, 'tests', 'data-w270a-stoprule-base.json'));
if (!COMMIT) throw new Error('[w272a] --commit <sha> が要る(どの commit の走行から切ったかを書く)');

const src = fs.readFileSync(FROM);
const cal = JSON.parse(src.toString('utf8'));
const rows = [];
for (const p of (cal.presets || [])) {
  const n = (p.run && p.run.n) || null;
  for (const tb of ((p.run && p.run.timeBudget) || [])) {
    rows.push({ id: p.id, emoji: p.emoji, tag: tb.tag, dt: tb.dt, n,
      maxSteps: tb.maxSteps, stepsRun: tb.stepsRun,
      rateStepsPerSec: tb.rateStepsPerSec, wallSec: tb.wallSec,
      periFoundA: tb.periFoundA, periWindow: tb.periWindow, windowFilledA: tb.windowFilledA });
  }
}
const out = {
  what: '基点 ' + COMMIT + ' の tests/out/calaudit-w249.json から、**走行長に関する欄だけ**を'
    + '機械抽出した表である(手で打った数字は 1 つも無い)。停止条件の宣言(第270便a・AE9 /'
    + '第271便a・AF3)が、基点と**同じ步数・同じ近点数**を再現することを照合するための入力として使う。',
  source: { commit: COMMIT, file: path.relative(ROOT, FROM), usedBy: 'tests/exp-w270a-stoprule.mjs',
    sourceSha256: crypto.createHash('sha256').update(src).digest('hex') },
  note: '`rateStepsPerSec`・`wallSec` は**機種依存の記録**である —— AE9 以降、步数の決定には'
    + 'この 2 つを使わない(壁時計は資源上限にだけ残す)。',
  history: [
    { commit: 'f6c19b4', wave: '第270便a(AE9)で作った初版',
      file: 'tests/data-w270a-stoprule-base-f6c19b4.json',
      why: '第270便c(AD9)の採用レコード一組化で 🩺🪀🩹 の導出 a が動き(60 公転ぶんの步数 '
        + '1,040,661 → 1,040,650 步)、第271便a(AF2)で ❄️ の步数宣言が入ったので、'
        + 'この基点とは 9 段が一致しない。第271便a は `BASE_REPLAY_EXCEPTIONS` の**宣言例外**で'
        + '通していた。**旧基点は履歴として残す**(差が無かったことにはならない)。' },
  ],
  nRows: rows.length,
  rows,
};
fs.writeFileSync(OUT, JSON.stringify(out, null, 1));
console.error('[w272a] 基点抽出: ' + rows.length + ' 段 → ' + path.relative(ROOT, OUT)
  + '(commit ' + COMMIT + ')');
