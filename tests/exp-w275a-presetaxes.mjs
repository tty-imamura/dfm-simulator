// 第275便a(統括の検証項目 R33 の処置 P1): **対照の「軸」を機械で読める形にする器**。
//
// ■ なぜ要るか
//   第274便a の棚卸し器は、対 `KF_PAIRS` の「**f 固定・k のみの対照**」を **f(massFactor)が
//   同じかどうかだけ**で判定していた(`kOnly: fSame`)。ところが対の 2 本は **D₀・q・frameWeight・
//   bodies** も一緒に動いていることがあり、それでも「k だけの対照」と分類されていた(R33)。
//   正しい判定には **宣言そのもの**が要るが、棚卸し器はブラウザを開かない(正本 JSON しか読まない)。
//   そこでこの器が **内蔵プリセットの宣言から 6 成分の軸だけを抜いて正本にする**。
//
// ■ 6 成分(「k だけの対照」の定義 —— 第275便a で明文化した)
//   k = `physics.kFrame` / f = `massCalibration.factor`(無宣言は 1)/
//   D₀ = `physics.D0pull`(無ければ `physics.D0`)/ q = `physics.q` /
//   frameWeight = `physics.frameWeight`(無宣言は既定 "pull")/ bodies = **宣言配列の SHA-256**。
//   **k を除く 5 成分がすべて同一のときだけ「f 固定・k のみの対照」と呼ぶ。**
//
// ■ この器がしないこと
//   ・1 步も走らせない(宣言を読むだけ)。・判定をしない。・値を作らない。
//
// 実行: PLAYWRIGHT_CORE_DIR=/opt/node22/lib/node_modules/playwright node tests/exp-w275a-presetaxes.mjs
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';
import { provenanceMeta } from './lib-w272e-provenance.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const HTML = path.join(ROOT, 'beta', 'index.html');
const OUT = path.join(ROOT, 'tests', 'out', 'presetaxes-w275a.json');
const CODE = ['tests/exp-w275a-presetaxes.mjs', 'tests/lib-w272e-provenance.mjs'];

export const AXES_VERSION = 'w275a-1';
export const AXIS_KEYS = ['massFactor', 'D0eff', 'q', 'frameWeight', 'bodiesSha256'];

const PW_DIR = process.env.PLAYWRIGHT_CORE_DIR || '/home/user/dfm-simulator';
const req = createRequire(path.join(PW_DIR, 'noop.js'));
const EXE = process.env.CHROMIUM_PATH || '/opt/pw-browsers/chromium-1194/chrome-linux/chrome';
let browser;
try { browser = await req('playwright').chromium.launch(); }
catch { browser = await req('playwright-core').chromium.launch({ executablePath: EXE }); }
const page = await browser.newPage();
const pageErrors = [];
page.on('pageerror', (e) => pageErrors.push(String(e.message || e)));
await page.goto('file://' + HTML, { waitUntil: 'load' });
await page.waitForFunction(() => window.HP && HP.sim && HP.currentPreset());

const R = await page.evaluate(() => {
  const out = [];
  for (const p of HP.allPresets()) {
    if (String(p.id).startsWith('custom_')) continue;
    const ph = p.physics || {};
    out.push({ id: p.id, emoji: p.emoji || null, name: p.name || null,
      sampleClass: p.sampleClass || null,
      kFrame: Number(ph.kFrame),
      kFrameApprox: ph.kFrameApprox === undefined ? null : ph.kFrameApprox,
      massFactor: (p.massCalibration && Number.isFinite(Number(p.massCalibration.factor)))
        ? Number(p.massCalibration.factor) : 1,
      massCalibrationDeclared: !!(p.massCalibration && p.massCalibration.factor !== undefined),
      D0: ph.D0 === undefined ? null : Number(ph.D0),
      D0pull: ph.D0pull === undefined ? null : Number(ph.D0pull),
      D0eff: (ph.D0pull !== undefined) ? Number(ph.D0pull) : Number(ph.D0 || 0),
      q: ph.q === undefined ? null : Number(ph.q),
      frameWeight: ph.frameWeight === undefined ? 'pull' : ph.frameWeight,
      frameWeightDeclared: ph.frameWeight !== undefined,
      softening: ph.softening === undefined ? null : Number(ph.softening),
      geoPN: ph.geoPN === undefined ? null : Number(ph.geoPN),
      bodiesJson: JSON.stringify(p.bodies || []),
      nBodyDecl: (p.bodies || []).length,
      presetSigHash: HP.presetSigHash(p) });
  }
  return out;
});
await page.close();
await browser.close();

const sha = (s) => crypto.createHash('sha256').update(String(s), 'utf8').digest('hex');
const rows = R.map((z) => {
  const o = Object.assign({}, z, { bodiesSha256: sha(z.bodiesJson) });
  delete o.bodiesJson;
  return o;
});
const byId = new Map(rows.map((r) => [r.id, r]));

// 同じ軸(k を除く 5 成分)を持つプリセットの束 —— 「k だけが違う対」はこの中にしかない
const axisKey = (r) => AXIS_KEYS.map((k) => String(r[k])).join('|');
const groups = new Map();
for (const r of rows) {
  const k = axisKey(r);
  if (!groups.has(k)) groups.set(k, []);
  groups.get(k).push(r.id);
}
const kOnlyGroups = [...groups.entries()].filter(([, ids]) => ids.length > 1
  && new Set(ids.map((id) => byId.get(id).kFrame)).size > 1)
  .map(([k, ids]) => ({ axis: k, ids, kFrames: ids.map((id) => byId.get(id).kFrame) }));

const out = {
  meta: Object.assign(provenanceMeta({ root: ROOT, wave: '第275便a(R33 の処置 P1・対照の軸)',
    target: 'beta/index.html', inputs: ['beta/index.html'], code: CODE }),
  { axesVersion: AXES_VERSION, axisKeys: AXIS_KEYS,
    rule: '**「f 固定・k のみの対照」は、k を除く 5 成分(f・D₀・q・frameWeight・bodies)が'
      + 'すべて同一のときだけ**である(第275便a で明文化 —— 第274便a は f だけを見ていた〔R33〕)。'
      + 'bodies は**宣言配列そのものの SHA-256** で、粒子ごとの初期値ではなく宣言(type/n/…)を見る。',
    doNotWrite: ['対照が取れたので合った', '較正した', '判定が増えた'] }),
  nPresets: rows.length,
  kFrameValues: [...new Set(rows.map((r) => r.kFrame))].sort((a, b) => a - b),
  kOnlyGroups,
  rows,
  pageErrors,
};
fs.writeFileSync(OUT, JSON.stringify(out, null, 1));
console.log('[w275a-axes] 内蔵 ' + rows.length + ' 本 / kFrame の値 ' + JSON.stringify(out.kFrameValues)
  + ' / **k だけが違う軸の束** ' + kOnlyGroups.length + ' 組'
  + (kOnlyGroups.length ? ': ' + kOnlyGroups.map((g) => g.ids.join('↔')).join(' , ') : ''));
console.log('[w275a-axes] pageErrors=' + pageErrors.length + ' → ' + OUT);
