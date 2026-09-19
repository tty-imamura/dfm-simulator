// 第273便b(統括の検証項目 R20)— **カロン系の走行 JSON を「併合してよいか」だけを決める純関数**。
//
// ■ 何を直すのか(R20)
//   第272便b の器は併合の可否を `meta.targetSha256` **だけ**で見ていた。対象 html が同じなら、
//   **測定コード・観測入力・窓・步数が変わった走行でも同じ列へ混ぜてしまう**。3 段(h/h2/h4)の
//   次数はその 3 点が同じ測定であることを前提にしているので、混ざると次数も ε̂ も意味を失う。
//
// ■ 併合鍵に入れる 6 成分(**これが全部一致したときだけ旧段を残す**)
//   ① `target` と `targetSha256` …… 走行対象の html そのもの
//   ② `measureSha256` …………… ページ側の測定コード(`tests/lib-w273b-charonpage.mjs`)
//   ③ `libSha256` ……………… 候補式ライブラリ(`tests/lib-w272b-pairlock.mjs`)
//   ④ `obsSha256` と `obsRow` … 観測入力(`calaudit-w249.json` の hash と、採用行の key/recordId/値/σ)
//   ⑤ `window` ………………… 窓と終了条件(近点窓・ORB_MAX・判定する周回 index)
//   ⑥ `stageSteps` …………… 段ごとの (dt, 步数) —— **物理時間が同じであること**の代理
//   **入らないもの**: 走行時刻・wall 秒・列の集合(列は足していけるのが併合の目的である)。
//
// ■ 旧世代(mergeKey を持たない JSON)の扱い
//   捨てずに、**旧 meta が実際に持っていた成分だけで照合する**(`legacyCompare`)。第272便b の
//   meta は ①③④⑤⑥ を持っているので、**新しく鍵に入ったのは ②(測定コード)だけ**である。
//   ②以外がすべて一致したら `accept:'legacy'` を返し、器が新しい鍵を刻んで書き直す。
//   一致しなければ `accept:false`(旧段は捨てる —— 混ぜるより捨てる方が安全である)。
//
// ■ 短い走行(`--pilot` / `--steps` で段の規定步数より短い走行)は**正本へ書かない**。
//   その判定も 1 箇所に置く(`isCanonicalRun`)。
//
// **この lib は純関数だけで、ページも力学も触らない。**
import crypto from 'node:crypto';

export const MERGEKEY_VERSION = 'w273b-mergekey-1';

const sha = (s) => crypto.createHash('sha256').update(s).digest('hex');

// 鍵の材料を**順序の決まった形**へ落とす(JSON.stringify のキー順に依存しない)
function canonical(parts) {
  const p = parts || {};
  const o = p.obsRow || {};
  const w = p.window || {};
  return JSON.stringify([
    ['version', MERGEKEY_VERSION],
    ['target', String(p.target || '')],
    ['targetSha256', String(p.targetSha256 || '')],
    ['measureSha256', String(p.measureSha256 || '')],
    ['libSha256', String(p.libSha256 || '')],
    ['obsSha256', String(p.obsSha256 || '')],
    ['obsRow', [String(o.key || ''), String(o.recordId || ''), Number(o.value), Number(o.sigma)]],
    ['window', [Number(w.periWindow), Number(w.orbMax), Number(w.judgedRevIndex)]],
    ['stageSteps', Object.keys(p.stageSteps || {}).sort()
      .map((k) => [k, Number(p.stageSteps[k].dt), Number(p.stageSteps[k].steps)])],
  ]);
}

/** 併合鍵(16 進 64 字)と、その材料をそのまま返す(JSON の meta へ両方書く)。 */
export function charonMergeKey(parts) {
  return { version: MERGEKEY_VERSION, key: sha(canonical(parts)), parts };
}

/**
 * 旧 JSON を併合してよいか。
 *   accept:'same'   … mergeKey が一致した(そのまま併合)
 *   accept:'legacy' … 鍵を持たない旧世代だが、旧 meta が持っていた成分はすべて一致した
 *   accept:false    … 混ぜない(理由が reasons に入る)
 */
export function charonMergeDecision(prevMeta, cur) {
  const reasons = [];
  if (!prevMeta) return { accept: false, reasons: ['既存の JSON が無い'] };
  if (prevMeta.mergeKey) {
    if (prevMeta.mergeKey === cur.key) return { accept: 'same', reasons: [] };
    reasons.push('mergeKey が違う(' + String(prevMeta.mergeKey).slice(0, 12) + '… → '
      + String(cur.key).slice(0, 12) + '…)');
    const a = (prevMeta.mergeKeyParts || {}), b = cur.parts || {};
    for (const k of ['target', 'targetSha256', 'measureSha256', 'libSha256', 'obsSha256'])
      if (a[k] !== b[k]) reasons.push('成分 ' + k + ' が違う');
    if (JSON.stringify(a.window) !== JSON.stringify(b.window)) reasons.push('成分 window が違う');
    if (JSON.stringify(a.stageSteps) !== JSON.stringify(b.stageSteps)) reasons.push('成分 stageSteps が違う');
    return { accept: false, reasons };
  }
  // ---- 旧世代(第272便b の meta): 測定コード以外を照合する
  const b = cur.parts || {};
  if (prevMeta.target !== b.target) reasons.push('旧 meta の target が違う');
  if (prevMeta.targetSha256 !== b.targetSha256) reasons.push('旧 meta の targetSha256 が違う');
  if (prevMeta.libSha256 !== b.libSha256) reasons.push('旧 meta の libSha256 が違う');
  const ob = prevMeta.observation || {}, o = b.obsRow || {};
  if (ob.calauditSha256 !== b.obsSha256) reasons.push('旧 meta の観測入力(calaudit)の hash が違う');
  if (ob.key !== o.key || ob.recordId !== o.recordId || ob.value !== o.value || ob.sigma !== o.sigma)
    reasons.push('旧 meta の採用行(key/recordId/値/σ)が違う');
  const ct = prevMeta.contract || {}, w = b.window || {};
  if (ct.periWindow !== w.periWindow || ct.orbMax !== w.orbMax || ct.judgedRevIndex !== w.judgedRevIndex)
    reasons.push('旧 meta の窓(近点窓/ORB_MAX/判定する周回)が違う');
  const st = {};
  for (const k of Object.keys(ct.stages || {})) st[k] = { dt: ct.stages[k].dt, steps: ct.stages[k].steps };
  if (JSON.stringify(canonicalStages(st)) !== JSON.stringify(canonicalStages(b.stageSteps || {})))
    reasons.push('旧 meta の段(dt/步数)が違う');
  return reasons.length ? { accept: false, reasons }
    : { accept: 'legacy', reasons: ['mergeKey を持たない旧世代 —— 測定コード以外の 5 成分が一致したので併合し、新しい鍵を刻む'] };
}

function canonicalStages(s) {
  return Object.keys(s || {}).sort().map((k) => [k, Number(s[k].dt), Number(s[k].steps)]);
}

/**
 * この走行を正本へ書いてよいか。**短い走行(pilot / 段の規定步数に満たない --steps)は書かない**。
 * 書かない走行は別ファイル(器が `probePath` を使う)へ落とす。
 */
export function isCanonicalRun({ pilot, steps, stageSteps }) {
  if (pilot) return { canonical: false, why: '--pilot(検出器の同値確認だけの短い走行)' };
  if (!(Number(steps) === Number(stageSteps))) {
    return { canonical: false, why: `--steps ${steps} が段の規定步数 ${stageSteps} と違う(短い走行は正本へ書かない)` };
  }
  return { canonical: true, why: '' };
}
