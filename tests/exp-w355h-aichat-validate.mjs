// 第355便h(統括の検証項目 R511・AI_SPEC §403 —— 原仮定者の指示(2026-11-25)「AI追加の改善を並行して進める。API方式よりも、LLMチャット前提で、
//   リンク付きのプロンプトを用意して対話式で進めた方が実用的ではないかと考えている。対話式はDFMについてのQ&Aも兼ねる」):
//   **外の AI チャットの返答の文の検査の器**(Node だけ —— html の inline script を vm に読む。ブラウザは使わない)。
// 検査の規則は器に持たない —— アプリの取り込みの関数をそのまま呼ぶ(tests/lib-w355h-aichat-validate.mjs の頭に呼ぶ関数の一覧)。
//   アプリの「検証のみ」ボタンの道(aiPasteRun(false))に通し、受理なら 200 步 試走し、結果と「AI に返す文」を出す。
//
// 使い方:
//   node tests/exp-w355h-aichat-validate.mjs <返答の文のファイル> [--target beta/index.html] [--json] [--no-kepler] [--steps 200]
//   node tests/exp-w355h-aichat-validate.mjs --selftest [--target …] [--json]
//     自己試験 7 本: 受理 2(内蔵のサンプルの書き出し・仕様の例の観測レコード)・拒否 3・読めない 1・括弧の取り違え 1
//     (z7 = コードブロックより前の文に [1] が在り、返答がコードブロックで終わる —— いまのアプリは前の文の括弧を拾って断る〔終了 3〕。
//      入口のページが「コードブロックより前の文に括弧を書かない」と頼む理由。アプリの取り込みを直す便で期待が 0 に替わる)
// 終了コード: 受理 0・拒否 2・形が判別できない(JSON として読めない/プリセットでも観測レコードでもない)3・器の故障 1
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { loadApp, checkText, LIB_VERSION } from './lib-w355h-aichat-validate.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
export const HARNESS_VERSION = 'w355h-aichat-validate-1';

function parseArgs(argv) {
  const a = { file: null, target: 'beta/index.html', json: false, kepler: true, steps: 200, selftest: false };
  for (let i = 0; i < argv.length; i++) {
    const s = argv[i];
    if (s === '--target') a.target = argv[++i];
    else if (s === '--json') a.json = true;
    else if (s === '--no-kepler') a.kepler = false;
    else if (s === '--steps') a.steps = Number(argv[++i]) || 200;
    else if (s === '--selftest') a.selftest = true;
    else if (!a.file) a.file = s;
  }
  return a;
}

function human(res, label) {
  const L = [];
  if (label) L.push('■ ' + label);
  L.push(`① 形: ${res.shape}(JSON の候補 ${res.candidates} 個${res.parse.corrected ? '・記号の補正あり: ' + (res.parse.fixes.join('・') || '-') : ''})`);
  const it = res.intake;
  L.push(`② 取り込み: ${it ? (it.ok ? '受理' : '拒否') + `(kind ${it.kind}・段 ${it.stage || '-'})` : '—'}`);
  for (const b of res.screen.blocks) { L.push('   [画面] ' + b.head); for (const s of b.lines) L.push('          ' + s); }
  for (const s of res.screen.status) L.push(`   [状態の行 ${s.cls}] ${s.msg}`);
  if (it && it.warnings.length) L.push('   警告: ' + it.warnings.join(' / '));
  const r = res.run;
  if (r) L.push(r.ok ? `③ 試走: ${r.steps} 步(dt ${r.dt})・粒子 ${r.n0}→${r.n}・NaN ${r.nan ? 'あり(' + r.nanAt + ' 步目)' : 'なし'}・光子 ${r.photons}・運動エネルギー 1e${r.kineticMag0}→1e${r.kineticMag1}(比 ${r.kineticRatio == null ? '-' : r.kineticRatio.toPrecision(3)})・最遠 ${r.maxR0.toPrecision(4)}→${r.maxR1.toPrecision(4)}`
    : `③ 試走: validatePreset で落ちた — ${r.errors.join(' / ')}`);
  else L.push('③ 試走: (受理されていないので走らせない)');
  L.push('④ AI に返す文:'); for (const s of res.aiReply.split('\n')) L.push('   ' + s);
  L.push(`終了コード ${res.exit}`);
  return L.join('\n');
}

// ───────── 自己試験 ─────────
function selftestCases(app) {
  const ev = app.H.evalExpr;
  // 内蔵のサンプル(BUILTIN_PRESETS の先頭)を、カスタム一覧の「JSONコピー」と同じ形(JSON.stringify(c,null,1))で書き出し、前後に説明文とフェンス
  const p0 = JSON.parse(ev('JSON.stringify(BUILTIN_PRESETS[0])'));
  const fence = (o, pre = 'こちらが設定です。', post = '以上です。') => `${pre}\n\n\`\`\`json\n${JSON.stringify(o, null, 1)}\n\`\`\`\n\n${post}`;
  const brokenBodies = JSON.parse(JSON.stringify(p0)); brokenBodies.bodies = 'none';
  const brokenType = JSON.parse(JSON.stringify(p0)); brokenType.bodies = [{ type: 'blob', x: 0, y: 0, m: 1 }];
  const brokenName = JSON.parse(JSON.stringify(p0)); delete brokenName.name; brokenName.physics = Object.assign({}, brokenName.physics, { G: 'strong' });
  // docs/AI_SPEC.md の「## EXAMPLE」節の本文(フェンスなしの配列 —— 見出しの次の行から「# OUTPUT B」の前まで)
  const spec = fs.readFileSync(path.join(ROOT, 'docs/AI_SPEC.md'), 'utf8');
  const i0 = spec.indexOf('## EXAMPLE'), i1 = spec.indexOf('# OUTPUT B', i0);
  const exBody = (i0 >= 0 && i1 > i0) ? spec.slice(spec.indexOf('\n', i0) + 1, i1).trim() : '';
  const ex = exBody ? [null, exBody + '\n'] : null;
  return [
    { id: 'z1-builtin-export', expect: 0, label: `内蔵のサンプル ${p0.emoji || ''}${p0.id} の書き出し(説明文+フェンス)`, text: fence(p0) },
    { id: 'z2-spec-records', expect: 0, label: 'AI_SPEC.md の EXAMPLE の観測レコード', text: ex ? 'Here are the records:\n```json\n' + ex[1] + '```' : '' },
    { id: 'z3-bodies-not-array', expect: 2, label: '壊した JSON ①: bodies が文字列', text: fence(brokenBodies) },
    { id: 'z4-unknown-type', expect: 2, label: '壊した JSON ②: 粒子の type が不明(blob)', text: fence(brokenType) },
    { id: 'z5-no-name-G-string', expect: 2, label: '壊した JSON ③: name 欠け・physics.G が文字列', text: fence(brokenName) },
    { id: 'z6-prose-only', expect: 3, label: '形の判別: JSON の無い文', text: 'すみません、どのような系がよいか教えてください。' },
    { id: 'z7-bracket-before-fence', expect: 3, label: '括弧の取り違え: 前の文に [1]・返答がコードブロックで終わる(いまのアプリの弱い所)', text: fence(p0, '出典[1]を見て作りました。', '').replace(/\n+$/, '') },
  ];
}

// 自己試験(QA behavior.aichatIntake355h も同じ関数を呼ぶ)→ { pass, total, cases[] }
export function runSelftest(target, opts = {}) {
  const app = loadApp(target);
  if (app.missing.length) return { pass: 0, total: 0, missing: app.missing, cases: [] };
  const out = [];
  let pass = 0;
  for (const c of selftestCases(app)) {
    const res = checkText(app, c.text, { kepler: opts.kepler !== false, steps: opts.steps || 200 });
    const ok = res.exit === c.expect && (c.expect !== 2 || (res.intake && res.intake.errors.length > 0 && res.screen.blocks.some((b) => b.lines.some((s) => s.startsWith('× ')))))
      && (c.expect !== 0 || (res.run && res.run.ok && !res.run.nan));
    if (ok) pass++;
    out.push({ id: c.id, label: c.label, expect: c.expect, got: res.exit, pass: ok, res });
  }
  return { pass, total: out.length, missing: [], cases: out };
}

async function main() {
  const a = parseArgs(process.argv.slice(2));
  const target = path.resolve(ROOT, a.target);
  if (a.selftest) {
    const R = runSelftest(target, { kepler: a.kepler, steps: a.steps });
    if (R.missing.length) { console.error('アプリの関数が見つからない: ' + R.missing.join(', ')); process.exit(1); }
    if (a.json) console.log(JSON.stringify({ harness: HARNESS_VERSION, lib: LIB_VERSION, target: a.target, pass: R.pass, total: R.total, cases: R.cases }, null, 1));
    else { for (const o of R.cases) console.log(human(o.res, `${o.id} ${o.label} —— 期待 ${o.expect}・実 ${o.got} ${o.pass ? 'PASS' : 'FAIL'}`) + '\n'); console.log(`自己試験 ${R.pass}/${R.total}`); }
    process.exit(R.pass === R.total ? 0 : 1);
  }
  const app = loadApp(target);
  if (app.missing.length) { console.error('アプリの関数が見つからない: ' + app.missing.join(', ')); process.exit(1); }
  if (!a.file) { console.error('使い方: node tests/exp-w355h-aichat-validate.mjs <返答の文のファイル> [--target beta/index.html] [--json]'); process.exit(1); }
  const text = fs.readFileSync(a.file, 'utf8');
  const res = checkText(app, text, { kepler: a.kepler, steps: a.steps });
  if (a.json) console.log(JSON.stringify(Object.assign({ harness: HARNESS_VERSION, lib: LIB_VERSION, target: a.target, file: a.file }, res), null, 1));
  else console.log(human(res));
  process.exit(res.exit);
}
const isMain = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (isMain) main().catch((e) => { console.error(e && e.stack || e); process.exit(1); });
