// 第269便a(第59報 W1・統括の読み (G)): **「中心値は旧参照・σ だけ新解」の混在経路**を数で置く器。
//
// ■ 何を測るか
//   第268便a の `applySigma` は、宣言(`paper/data/judgement-sources.json`)が当たると
//   **宣言行の σ を `q.obsSigmaCsv`(門が読む欄)へ入れて**いた。ところが正式 `assessObservation` は
//   `reference: q.obs`(= obsCard の従来の中心値)で判定する。つまり**中心値と σ が別の解から来る**。
//   本器は、通常走行の JSON(`tests/out/calaudit-w249.json`)と CSV と宣言表だけを入力にして、
//   **その混在が起きたときに門が見たはずの数**を再計算する(**エンジンは 1 步も走らせない**)。
//
// ■ この器が言わないこと
//   ・「D68 が合/否」「判定が増えた」。ここで出るのは**混在の大きさ**だけである。
//   ・これは**旧コードを走らせた結果ではなく、旧経路の算術をデータから再現したもの**である
//     (第269便a の走行 JSON は既に診断欄だけになっているので、旧経路そのものは走らない)。
//
// ■ 第272便e(AG12): **凍結した器である**(来歴印 `recordBasis:'legacy-fixedColumns-w269a'`)
//   本器は CSV を**列位置**(`c[0]`〜`c[8]`)で読み、`record_id` 欄を 1 つも見ていない。
//   第270便b(AE2)で読取は**ヘッダ名引き**(`tests/lib-w270b-obscsv.mjs`)に移り、
//   第271便b(R1)で**同定の鍵は `record_id`・宣言内容は一致条件**になった。したがって本器は
//   **現行の採用解では宣言を解決できない**(`pickDeclaredRow` に渡す行が「ファイル順の最初」
//   のままで、宣言が指す行と一致する保証がない)。**過去便の比較点として凍結する** ——
//   数値も手続きも書き換えず、一括置換もしない。**「この器が現行解で再測定済み」とは書かない。**
//   ヘッダ名読みの新器を別名で作るかは**決断事項**である(本便は凍結印だけを足した)。
//
// 実行: node tests/exp-w269a-mixprobe.mjs
// 出力: tests/out/mixprobe-w269a.json(**.gitignore の対象** —— 数は文書側に転記する)
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { loadJudgementSources, pickDeclaredRow } from './lib-w268a-judgement.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const CAL = path.join(ROOT, 'tests', 'out', 'calaudit-w249.json');
const OUT = path.join(ROOT, 'tests', 'out', 'mixprobe-w269a.json');

function parseCsvLine(line) {
  const cols = []; let cur = '', inQ = false;
  for (const ch of line) {
    if (inQ) { if (ch === '"') inQ = false; else cur += ch; }
    else if (ch === '"') inQ = true;
    else if (ch === ',') { cols.push(cur); cur = ''; }
    else cur += ch;
  }
  cols.push(cur); return cols;
}
const ALL = [];
for (const line of fs.readFileSync(path.join(ROOT, 'paper', 'data', 'solar-observations.csv'), 'utf8').split('\n')) {
  if (!line.trim() || line.startsWith('body,')) continue;
  const c = parseCsvLine(line);
  const sg = (c[8] || '').trim() !== '' ? Number(c[8]) : null;
  ALL.push({ body: c[0], quantity: c[1], value: Number(c[2]), unit: c[3], source: c[4],
    valueRaw: (String(c[2]).trim() !== '') ? Number(c[2]) : null,
    sigma: (Number.isFinite(sg) && sg > 0) ? sg : null });
}
const JS = loadJudgementSources(path.join(ROOT, 'paper', 'data', 'judgement-sources.json'));
if (!JS.ok) throw new Error('[w269a-mixprobe] judgement-sources.json が不正: ' + JS.error);
const cal = JSON.parse(fs.readFileSync(CAL, 'utf8'));

const rows = [];
for (const p of (cal.presets || [])) {
  for (const q of (p.quantities || [])) {
    const js = q.judgementSource;
    if (!js) continue;
    const decl = JS.byKey.get(js.key) || null;
    const picked = decl ? pickDeclaredRow(decl, ALL) : { row: null, reason: 'declaration-missing' };
    // **従来行**(ファイル順の最初)= 現行(第269便a)の正式経路が使う行
    const official = ALL.find((r) => (r.body + '|' + r.quantity) === js.key) || null;
    const declaredSigma = picked.row ? picked.row.sigma : null;
    const officialSigma = official ? official.sigma : null;
    const meas = Number.isFinite(q.meas) ? q.meas : null;
    const obs = Number.isFinite(q.obs) ? q.obs : null;
    const resid = (meas !== null && obs !== null) ? Math.abs(meas - obs) : null;
    rows.push({
      preset: p.id, target: q.target, kind: q.kind, unit: q.unit,
      key: js.key,
      // 現行(第269便a): 従来行だけを見る
      current: { obs, sigmaFromOfficialRow: officialSigma,
        obsSigmaCsvInJson: (q.obsSigmaCsv === undefined) ? null : q.obsSigmaCsv,
        gateStatus: q.gate ? q.gate.status : null,
        note: officialSigma === null
          ? '従来行に σ が無い → **門に 1 bit も入らない**(欄そのものが立たない)' : '従来行の σ が門へ入る' },
      // 第268便a の経路(**再現**): 中心値は q.obs のまま・σ だけ宣言行から
      mixedLegacyPath: { obsUsed: obs, sigmaUsed: declaredSigma,
        declaredValue: decl ? decl.value : null,
        residual: resid,
        nSigmaMixed: (resid !== null && declaredSigma) ? resid / declaredSigma : null,
        // 参考: 中心値も σ も宣言行で揃えた場合(AD5 が一度に切り替える形)
        nSigmaConsistent: (meas !== null && decl && declaredSigma)
          ? Math.abs(meas - Number(decl.value)) / declaredSigma : null,
        note: '**中心値は旧参照・σ だけ新解**という混ざり方。AD5 では中心値・σ・単位・解 ID・'
          + 'verified 状態・測定定義を**同時に**切り替えるので、この数は判定に使わない' },
    });
  }
}
const out = { when: new Date().toISOString(), wave: '第269便a(第59報 W1・統括の読み (G))',
  // 第272便e(AG12): 凍結印。**固定列読み・`record_id` 欄を見ない**器であることを出力にも残す。
  recordBasis: 'legacy-fixedColumns-w269a',
  frozen: '第272便e(AG12)で凍結。列位置読み(c[0]〜c[8])のままで `record_id` を見ないため、'
    + '**現行の採用解では宣言を解決できない**。ヘッダ名読みの新器を別名で作るかは決断事項。',
  what: '「中心値は旧参照・σ だけ新解」の混在経路の大きさ(**エンジンは 1 步も走らせていない**)',
  how: '入力は tests/out/calaudit-w249.json と paper/data/solar-observations.csv と '
    + 'paper/data/judgement-sources.json だけ。**旧コードを走らせた結果ではなく、旧経路の算術の再現**である',
  rows,
  doNotWrite: ['D68 が合(3σ)', 'カロンが否(3σ)', '宣言で判定が増えた', '混在を判定に使った'] };
fs.mkdirSync(path.dirname(OUT), { recursive: true });
fs.writeFileSync(OUT, JSON.stringify(out, null, 1));
for (const r of rows) {
  console.log('[w269a-mixprobe] ' + r.preset + '|' + r.target + '|' + r.kind
    + ' 現行: obs=' + r.current.obs + ' σ(従来行)=' + r.current.sigmaFromOfficialRow
    + ' 門=' + r.current.gateStatus
    + ' / 旧経路の再現: σ(宣言行)=' + r.mixedLegacyPath.sigmaUsed
    + ' → 残差 ' + (r.mixedLegacyPath.residual === null ? '—' : r.mixedLegacyPath.residual.toPrecision(9))
    + ' = ' + (r.mixedLegacyPath.nSigmaMixed === null ? '—' : r.mixedLegacyPath.nSigmaMixed.toPrecision(9)) + 'σ'
    + '(中心値も宣言行なら ' + (r.mixedLegacyPath.nSigmaConsistent === null ? '—'
      : r.mixedLegacyPath.nSigmaConsistent.toPrecision(9)) + 'σ)');
}
console.log('→ ' + path.relative(ROOT, OUT));
