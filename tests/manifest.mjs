// 第145便 tests/manifest.mjs — 実験マニフェスト(計測 JSON の生成来歴メタデータ)共通ヘルパ
// ============================================================================================
// 目的: 「実測数値は git 管理下スクリプトの出力からのみ」という規律を**機械化**する。
//   第131便の事故(説明文に載っていた旧数値 0.06% / 2.2% が、どのスクリプトのどの実行から出た
//   ものか誰にも辿れず再現不能だった)と同根の再発を、計測 JSON 側の必須メタで防ぐ。
//   計測 JSON を見れば「どのコミットの・どの HTML を・どの seed/dt/步数/窓で回した出力か」
//   「どの数値が入力で・どれが当てはめで・どれが導出で・どれが hold-out か」
//   「NaN・クランプ・保存量残差がどうだったか(測っていないものは測っていないと)」が判る。
//
// 設計の原則(第145便):
//   ① **測定ロジック・数値は一切変更しない**。各ハーネスは結果オブジェクトへ `manifest` キーを
//      1本足すだけ(additive)。既存の測定ペイロード(manifest 以外の全キー)は bit 不変である。
//   ② 判定の実体(エンジン実測・外部解析値・残差・許容窓)は**既にある構造をそのまま参照**する。
//      manifest は重複コピーを持たず、`judgement.pointers` に JSON 内の位置ポインタだけを置く。
//   ③ 取得できない健全性指標は捏造せず `not-instrumented`(未計装)と正直に書く。該当しない
//      数値環境は `not-applicable`(該当なし)と明示値で書く。**空欄・null を残さない**。
//   ④ manifest 自体は実行のたびに変わる(日時・環境)。再生成時のペイロード照合では
//      `manifest` キーを除外して比較する(regeneration.canonicalization に宣言する)。
//
// 検査: tests/qa.mjs の `manifest.coverage` ゲートが、対象 JSON について必須フィールドの
//   存在と形式を機械検査する(歴史的 JSON は対象外 — ゲートの説明文を参照)。
//
// 使い方(各ハーネスの writeFileSync 直前):
//   import { buildManifest, NOT_APPLICABLE, NOT_INSTRUMENTED } from './manifest.mjs';
//   out.manifest = await buildManifest({ root: ROOT, scriptUrl: import.meta.url, page, browser,
//     experiment: { id: 'kf1', wave: 119, title: '…' },
//     target: TARGET,
//     presets: { mode: 'dynamic', declaredIn: 'tests.*.cfg', configs: { … } },
//     numerics: { seed: 1, dt: 0.016, timeScale: 1, substeps: NOT_APPLICABLE, steps: …,
//                 window: …, warmup: NOT_APPLICABLE },
//     classification: { input: [...], fit: [...], derived: [...], holdOut: [...], note: '…' },
//     judgement: { pointers: ['tests.analog.…'], note: '…' },
//     health: { conservation: { … } },
//     payload: out });
// ============================================================================================
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { execSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

export const MANIFEST_SCHEMA = 'dfm-experiment-manifest';
export const MANIFEST_SCHEMA_VERSION = '1.0';

// 明示値のセンチネル(空欄・null を残さないための語彙。qa.mjs の manifest.coverage が語彙を固定する)
export const NOT_APPLICABLE = 'not-applicable';        // その概念がこのハーネスに存在しない
export const NOT_INSTRUMENTED = 'not-instrumented';    // 概念はあるが計装していない(測っていない)
export const UNAVAILABLE = 'unavailable';              // 取得を試みたが取れなかった(理由を併記)
export const SENTINELS = [NOT_APPLICABLE, NOT_INSTRUMENTED, UNAVAILABLE];

const sha256 = (buf) => crypto.createHash('sha256').update(buf).digest('hex');

// ---- 来歴: git ---------------------------------------------------------------------------
function gitInfo(root) {
  const run = (cmd) => execSync(cmd, { cwd: root, stdio: 'pipe' }).toString().trim();
  const info = { commit: UNAVAILABLE, describe: UNAVAILABLE, dirty: UNAVAILABLE, dirtyFiles: UNAVAILABLE };
  try { info.commit = run('git rev-parse HEAD'); } catch { /* git 外での実行 */ }
  try { info.describe = run('git describe --tags --always --dirty'); } catch {}
  try {
    const st = run('git status --porcelain');
    const files = st ? st.split('\n').filter(Boolean) : [];
    info.dirty = files.length > 0;
    // ファイル名の全列挙はしない(manifest を肥大させない)。件数と先頭数件だけ証跡に残す
    info.dirtyFiles = { count: files.length, sample: files.slice(0, 8).map((l) => l.replace(/^\s*\S+\s+/, '')) };
  } catch {}
  return info;
}

// ---- 来歴: 対象 HTML(実際に試験した実体を SHA で追跡 — qa.mjs 第28便と同方針)-------------
function targetInfo(root, target) {
  const rec = { path: target, sha256: UNAVAILABLE, bytes: UNAVAILABLE, appVersion: UNAVAILABLE };
  try {
    const bytes = fs.readFileSync(path.join(root, target));
    rec.sha256 = sha256(bytes);
    rec.bytes = bytes.length;
    rec.appVersion = (bytes.toString('utf8').match(/const APP_VERSION = "([^"]+)"/) || [])[1] || UNAVAILABLE;
  } catch (e) { rec.error = String(e && e.message || e); }
  return rec;
}

// ---- 来歴: プリセット ----------------------------------------------------------------------
// mode:'builtin'  … 内蔵プリセットを使う。ids を渡すと各 preset の正規化 JSON の SHA-256 を採る
// mode:'dynamic'  … ハーネスが構成を動的に組み立てる(内蔵プリセットを読まない)。
//                   configs(宣言済みの物理キー等)の SHA-256 を採り「動的構成」を明示宣言する
// mode:'mixed'    … 両方(節ごとに内蔵プリセットと動的構成を使い分けるハーネス)
async function presetInfo(spec, page) {
  const s = spec || {};
  const mode = s.mode || 'dynamic';
  const rec = { mode, note: s.note || null };
  if (mode === 'builtin' || mode === 'mixed') {
    rec.ids = s.ids || [];
    rec.hashes = {};
    if (page && rec.ids.length) {
      try {
        const jsons = await page.evaluate((ids) => ids.map((id) => {
          const p = HP.allPresets().find((q) => q.id === id);
          if (!p) return null;
          // キー順に依存しない正規化(再帰キー整列)
          const canon = (o) => {
            if (Array.isArray(o)) return o.map(canon);
            if (o && typeof o === 'object') { const r = {}; for (const k of Object.keys(o).sort()) r[k] = canon(o[k]); return r; }
            return o;
          };
          return JSON.stringify(canon(p));
        }), rec.ids);
        rec.ids.forEach((id, i) => { rec.hashes[id] = jsons[i] === null ? UNAVAILABLE : sha256(jsons[i]); });
        rec.canonicalization = 'HP.allPresets() の当該プリセットを再帰キー整列した JSON の SHA-256';
      } catch (e) { rec.hashes = UNAVAILABLE; rec.error = String(e && e.message || e); }
    }
    if (s.modifiedAtRuntime) rec.modifiedAtRuntime = s.modifiedAtRuntime;
  }
  if (mode === 'dynamic' || mode === 'mixed') {
    rec.declaration = s.declaration || '動的構成(内蔵プリセットを読まず、ハーネス内の宣言値から build する)';
    rec.declaredIn = s.declaredIn || null;
    if (s.configs !== undefined) {
      const canon = (o) => {
        if (Array.isArray(o)) return o.map(canon);
        if (o && typeof o === 'object') { const r = {}; for (const k of Object.keys(o).sort()) r[k] = canon(o[k]); return r; }
        return o;
      };
      rec.configSha256 = sha256(JSON.stringify(canon(s.configs)));
      rec.configCanonicalization = '宣言済み構成(configs)を再帰キー整列した JSON の SHA-256';
    } else {
      rec.configSha256 = NOT_APPLICABLE;
    }
  }
  return rec;
}

// ---- 実行環境 -------------------------------------------------------------------------------
async function envInfo(root, browser) {
  const rec = { node: process.version, platform: `${process.platform}/${process.arch}`,
    playwright: UNAVAILABLE, browser: UNAVAILABLE, date: new Date().toISOString(),
    tz: Intl.DateTimeFormat().resolvedOptions().timeZone || UNAVAILABLE };
  for (const pkg of ['playwright', 'playwright-core']) {
    try { rec.playwright = `${pkg}@${JSON.parse(fs.readFileSync(path.join(root, 'node_modules', pkg, 'package.json'), 'utf8')).version}`; break; } catch {}
  }
  if (browser) {
    try { rec.browser = `Playwright Chromium ${await browser.version()}`; } catch (e) { rec.browser = UNAVAILABLE; }
  } else {
    rec.browser = NOT_APPLICABLE;
  }
  return rec;
}

// ---- 健全性: NaN(既存ペイロードから導出 — 新規の測定は行わない)--------------------------
// 各ハーネスは既に nan / hasNaN 相当のキーを結果へ記録している。manifest はそれを**再測定せず**
// 走査して集計するだけ(= 数値は一切増えない・変わらない)。1件も無ければ未計装と正直に書く。
function scanNan(payload) {
  const hits = [];
  const NAN_KEYS = new Set(['nan', 'hasNaN', 'isNaN', 'anyNaN']);
  let numericNaN = 0;
  const walk = (o, p) => {
    if (hits.length > 4000) return;
    if (Array.isArray(o)) { o.forEach((v, i) => walk(v, `${p}[${i}]`)); return; }
    if (o && typeof o === 'object') {
      for (const k of Object.keys(o)) {
        const v = o[k];
        if (NAN_KEYS.has(k) && (typeof v === 'boolean' || v === null)) hits.push({ path: p ? `${p}.${k}` : k, value: v });
        else if (NAN_KEYS.has(k) && v && typeof v === 'object') {
          for (const k2 of Object.keys(v)) if (typeof v[k2] === 'boolean') hits.push({ path: `${p ? p + '.' : ''}${k}.${k2}`, value: v[k2] });
        }
        if (typeof v === 'number' && Number.isNaN(v)) numericNaN++;
        walk(v, p ? `${p}.${k}` : k);
      }
    }
  };
  walk(payload, '');
  const trueHits = hits.filter((h) => h.value === true);
  if (!hits.length) {
    return { instrumented: false, detail: NOT_INSTRUMENTED,
      note: 'このハーネスの結果ペイロードに nan/hasNaN 相当のフラグが無い(エンジンの NaN 監視を記録していない)',
      numericNaNInPayload: numericNaN };
  }
  return { instrumented: true, flagsFound: hits.length, anyTrue: trueHits.length > 0,
    truePaths: trueHits.slice(0, 16).map((h) => h.path),
    numericNaNInPayload: numericNaN,
    note: '結果ペイロード内の nan/hasNaN フラグを走査して集計した値(再測定はしていない)。' +
      'numericNaNInPayload は JSON 化後に NaN として残った数値の件数(JSON.stringify では null になるため通常 0)' };
}

// ---- 健全性: クランプ計数(エンジンの安全クランプ発動回数)-----------------------------------
// 注意: エンジンのクランプ計数は sim.build() ごとに 0 へリセットされる。ハーネスは 1 実行で
//   多数の構成を build するので、ここで読めるのは**最後に build した構成の計数**だけである。
//   全構成を横断した集計は行っていない(= aggregate は未計装)。この限定を明示して記録する。
async function clampInfo(page) {
  if (!page) return { aggregate: NOT_INSTRUMENTED, note: 'ページ非保持のハーネス(クランプ計数を読めない)' };
  try {
    const c = await page.evaluate(() => {
      const S = window.HP && HP.sim; if (!S) return null;
      return { clampVN: S.clampVN, clampSN: S.clampSN, clampHN: S.clampHN,
        clampAN: S.clampAN, clampRN: S.clampRN, angOvfN: S.angOvfN, n: S.n };
    });
    if (!c) return { aggregate: NOT_INSTRUMENTED, lastBuild: UNAVAILABLE, note: 'HP.sim を取得できなかった' };
    const total = ['clampVN', 'clampSN', 'clampHN', 'clampAN', 'clampRN', 'angOvfN']
      .reduce((a, k) => a + (Number(c[k]) || 0), 0);
    return { aggregate: NOT_INSTRUMENTED, lastBuild: c, lastBuildTotal: total,
      note: 'エンジンのクランプ計数は sim.build() ごとに 0 へリセットされるため、ここに記録できるのは' +
        '**この実行で最後に build した構成**の計数だけである(全構成を横断した集計は未計装)。' +
        'lastBuildTotal>0 なら少なくとも最終構成で安全クランプが発動している(保存則主張の域外)' };
  } catch (e) {
    return { aggregate: NOT_INSTRUMENTED, lastBuild: UNAVAILABLE, error: String(e && e.message || e) };
  }
}

// ---- 数値環境の必須キー(欠けたら明示値を強制する)-------------------------------------------
const NUMERICS_REQUIRED = ['seed', 'dt', 'timeScale', 'substeps', 'steps', 'window', 'warmup'];
const CLASS_REQUIRED = ['input', 'fit', 'derived', 'holdOut'];

/**
 * 実験マニフェストを組み立てて返す(結果 JSON の `manifest` キーへそのまま入れる)。
 * 測定は一切行わない — 既存ペイロードの走査と、来歴・環境の読み取りだけである。
 */
export async function buildManifest(spec) {
  const s = spec || {};
  const root = s.root || process.cwd();
  const scriptPath = s.scriptUrl ? fileURLToPath(s.scriptUrl) : (s.scriptPath || null);
  const exp = s.experiment || {};

  const script = { path: scriptPath ? path.relative(root, scriptPath) : UNAVAILABLE,
    sha256: UNAVAILABLE, bytes: UNAVAILABLE };
  if (scriptPath) {
    try { const b = fs.readFileSync(scriptPath); script.sha256 = sha256(b); script.bytes = b.length; }
    catch (e) { script.error = String(e && e.message || e); }
  }
  // 共通ヘルパ自身の SHA も残す(manifest 生成器が差し替わったことを追跡できるように)
  let helperSha = UNAVAILABLE;
  try { helperSha = sha256(fs.readFileSync(fileURLToPath(import.meta.url))); } catch {}

  const numerics = {};
  for (const k of NUMERICS_REQUIRED) {
    const v = (s.numerics || {})[k];
    numerics[k] = (v === undefined || v === null || v === '') ? NOT_INSTRUMENTED : v;
  }
  for (const [k, v] of Object.entries(s.numerics || {})) if (!(k in numerics)) numerics[k] = v;

  const cls = { note: (s.classification || {}).note || null };
  for (const k of CLASS_REQUIRED) {
    const v = (s.classification || {})[k];
    cls[k] = Array.isArray(v) ? v : [];
  }
  for (const [k, v] of Object.entries(s.classification || {})) if (!(k in cls)) cls[k] = v;

  const health = {
    nan: (s.health || {}).nan || scanNan(s.payload === undefined ? {} : s.payload),
    clamps: (s.health || {}).clamps || await clampInfo(s.page),
    conservation: (s.health || {}).conservation !== undefined ? (s.health || {}).conservation
      : { status: NOT_INSTRUMENTED, note: 'このハーネスは保存量(運動量・角運動量・エネルギー)の残差を記録していない' },
  };
  for (const [k, v] of Object.entries(s.health || {})) if (!(k in health)) health[k] = v;

  return {
    schema: MANIFEST_SCHEMA,
    schemaVersion: MANIFEST_SCHEMA_VERSION,
    generatedAt: new Date().toISOString(),
    experiment: {
      id: exp.id || UNAVAILABLE,
      wave: exp.wave === undefined ? NOT_APPLICABLE : exp.wave,
      title: exp.title || null,
      script: script.path,
      scriptSha256: script.sha256,
      scriptBytes: script.bytes,
      helperSha256: helperSha,
      command: exp.command || null,
    },
    provenance: {
      git: gitInfo(root),
      target: targetInfo(root, s.target || 'index.html'),
      presets: await presetInfo(s.presets, s.page),
    },
    numerics,
    environment: await envInfo(root, s.browser),
    classification: cls,
    judgement: {
      pointers: Array.isArray((s.judgement || {}).pointers) ? s.judgement.pointers : [],
      note: (s.judgement || {}).note ||
        '判定の実体(エンジン実測・外部解析値・残差・許容窓)は本 JSON 内の上記位置にある。' +
        'manifest は重複コピーを持たず位置ポインタだけを置く(第145便の規約)',
      externalReferences: (s.judgement || {}).externalReferences || NOT_APPLICABLE,
    },
    health,
    regeneration: {
      canonicalization: '再生成時のペイロード照合は `manifest` キーを除外して行う(manifest は実行ごとに' +
        '日時・環境・git 状態が変わる非測定メタである)。除外後の全キーは同一スクリプト・同一対象・' +
        '同一 seed/步数で bit 一致することを要求する',
      payloadKeysExcluded: ['manifest', ...(s.excludeKeys || [])],
      note: s.regenerationNote || null,
    },
  };
}

export default buildManifest;
