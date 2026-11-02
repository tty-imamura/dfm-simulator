// 第323便c(決断事項 AN517・AN518・AN480・統括の検証項目 R277)—— **器の便の記録**(窓の無い大きい 16 段の簡易の窓・synodic-299b の子プロセス 3 本・領域の宣言の無い段の REGEN_SCOPE)。
//
// ■ 何を持つか(QA lint.quickWindows323・docs.w323c と PHYSICS〔第323便c〕の表が読む —— 器・鎖の段の判定は読まない)
//   ・QUICK_WINDOW_KEYS_323C: 窓を足した 16 段(窓そのものは tools/harness-smoke.mjs の SMOKE_KNOBS の第323便c の塊 —— env・args・cmd・out・sec・fullSec・covers)。
//   ・SCOPE_323C / SCOPE_SKIP_323C: REGEN_SCOPE を足した 13 段の器 / 足さない段と理由。
//   ・SYNODIC_323C: synodic-299b の 3 プロセスと 1 プロセスの枝の実測(段ごとの所要・正本の物理の欄の差)。
//   ・表の行の関数(windowRows・scopeRows・synodicRows)—— PHYSICS〔第323便c〕に逐語で載せる(QA が作り直して照合する)。
// ■ しないこと: 走らせない・判定しない(記録と表の純関数だけ)。
export const QUICKWIN_323C_VERSION = 'w323c-quickwin-1';

/** 窓を足した 16 段(第322便の鎖 1 の秒で 600 s 以上・窓の無かった段 —— 秒の大きい順) */
export const QUICK_WINDOW_KEYS_323C = Object.freeze(['shell-304b', 'emgrid', 'inertialr2-303b', 'periodn-306b', 'charon-h2', 'chainburst-301d', 'gfamily-305b', 'dragcore292', 'geo3',
  'charonk', 'nslock', 'emresolve-306c', 'earthmoon-303c', 'charoneps-h4', 'an336-306a', 'baseline-304c']);
/** 窓の秒 / フルの秒 の上限(目安 5〜15% の 2 倍 —— 窓の秒は混む箱〔4 枝の並走〕の実測・フルの秒は鎖の 4 レーンの実測。15% を超える行は理由を covers に書く) */
export const QUICK_RATIO_MAX_323C = 0.3;
/** 目安(表の読みの基準) */
export const QUICK_RATIO_GUIDE_323C = 0.15;

/** REGEN_SCOPE を足した 13 段(器と lib から機械で引いた下限 deriveScope —— bhcore・slipaudit は下限 + HP.sim・HP.validatePreset〔lint.scopeStop ③〕—— 正本の meta に scopeStamp で刻む) */
export const SCOPE_323C = Object.freeze([
  ['twobody', 'tests/exp-w272c-twobody.mjs'], ['meshnod0', 'tests/exp-w275b-meshnod0.mjs'], ['bgcompose', 'tests/exp-w279c-bgcompose.mjs'], ['sphereKernel', 'tests/exp-w280b-sphereKernel.mjs'],
  ['qsplit', 'tests/exp-w271c-qsplit.mjs'], ['rpar', 'tests/exp-w272c-rpar.mjs'], ['nslockledger', 'tests/exp-w273c-nslockledger.mjs'], ['bhcore', 'tests/exp-w274e-bhcore.mjs'],
  ['presetaxes', 'tests/exp-w275a-presetaxes.mjs'], ['bgfield', 'tests/exp-w276a-bgfield.mjs'], ['bgpredict', 'tests/exp-w276a-bgpredict.mjs'], ['rotorledger', 'tests/exp-w281c-rotorledger.mjs'],
  ['slipaudit', 'tests/exp-w278c-slipaudit.mjs']].map(([key, harness]) => Object.freeze({ key, harness })));
/** 足さない段(第322便の計画で「対象 html(領域の宣言なし —— html 全体)」の 23 段のうち 10 段)と理由 */
export const SCOPE_SKIP_323C = Object.freeze([
  ['d0audit2', 'D₀ の読み口の機械監査 —— html 全体の走査が仕事(領域で絞ると監査の意味が無くなる)'],
  ['selfinertia', 'html の行を文字列で探して行番号を記録する機械監査(どこか 1 行の挿入で正本の行番号が動く —— html 全体の読み)'],
  ['galaxyprof2', '器が停止関数 render を名で読む(描画の時間の測定 —— lint.scopeStop ② に当たる)'],
  ['galaxyprof', '基点 html($BASE_HTML —— 便ごとに変わる)と今の html の 2 つを比べる器(領域は今の html の 1 つだけを刻む)'],
  ['needmesh', '基点 html($BASE_HTML)と今の html の 2 つを比べる器'],
  ['bh90', '再生成表の自己試験 lint.regenChain (q8) の見本(html 全体を読む下流の段 —— 集約段 htmlagg の after の欠落を検出する型)。宣言すると見本が無くなる(見本を他の段へ移すのは鎖の関数の側 —— 次便)'],
  ['calaudit', '常時群(鎖の先頭で毎回走る —— 宣言しても秒は変わらない・下流は安定 hash で読む)・分割の道具 tools/calaudit-split.mjs が正本を組む'],
  ['samplestatus', '常時群・html の生成領域を書く段(html 全体の読み手 —— 宣言しても秒は変わらない)'],
  ['kf0ledger-old', '常時群(見積り 0 s —— 宣言しても秒は変わらない・下流は安定 hash で読む)'],
  ['kf0ledger', '常時群(見積り 0 s —— 同上)']].map(([key, why]) => Object.freeze({ key, why })));

/**
 * synodic-299b の枝の実測(第323便c —— 混む箱〔4 枝の並走・負荷平均 5〜7〕の秒)。3 プロセス(W299B_WORKERS 既定 3)と 1 プロセス(W299B_WORKERS=1)。
 * diff は正本の物理の欄(meta・時刻・所要の欄〔wallSec・elapsedS〕の外)の差の葉の数。sec は親の壁時計(timing.wallSec)。
 */
export const SYNODIC_323C = Object.freeze({
  workers: 3, laneOrder: Object.freeze(['long', 'longh2', 'scan', 'fit', 'aps', 'sun3d']),
  w3: Object.freeze({ sec: 3223, load: '6〜9', parts: Object.freeze({ long: 3217, longh2: 2885, scan: 491, fit: 396, aps: 549, sun3d: 44 }) }),
  w1: Object.freeze({ sec: 4035, load: '4〜5', parts: Object.freeze({ long: 1623, longh2: 1407, scan: 472, fit: 292, aps: 215, sun3d: 24 }) }),
  leaves: 784, diffW3W1: 0, diffW3Canon: 0, diffW1Canon: 0, metaDiffW3W1: Object.freeze(['generatedAt']), canonSec: 4032, canonParts: Object.freeze({ long: 1577, longh2: 1481, scan: 425, fit: 297, aps: 226, sun3d: 23 }),
  note: '正本との差は対象 html の sha(targetSha256 —— 便の開始で beta の版名を変えた)だけ。3 本と 1 本の meta の差は generatedAt だけ' });

const pct = (a, b) => (Number.isFinite(a) && Number.isFinite(b) && b > 0) ? (Math.round(a / b * 1000) / 10).toFixed(1) + '%' : '—';
const envText = (k) => {
  const p = [];
  if (k.cmd) p.push('窓の cmd `' + k.cmd + '`');
  for (const [n, v] of Object.entries(k.env || {})) p.push('`' + n + '=' + v + '`');
  if (Array.isArray(k.args) && k.args.length) p.push('引数 `' + k.args.join(' ') + '`');
  return p.join('・').replace(/\|/g, '\\|');   // 表の区切りと混ぜない(W301D_ONLY の正規表現の |)
};
/** 表 1: 16 段の窓(段・窓の環境変数と引数・窓が走らせる部分・窓の秒・フルの秒・比・フルの値の確かめ方)。knobs = SMOKE_KNOBS */
export function windowRows(knobs) {
  const out = ['| 段 | 窓(環境変数・引数) | 窓が走らせる部分 | 窓の秒 | フルの秒 | 比 | フルの値の確かめ方 |', '|---|---|---|---|---|---|---|'];
  for (const key of QUICK_WINDOW_KEYS_323C) {
    const k = knobs[key];
    if (!k) { out.push(`| ${key} | (窓なし) | — | — | — | — | — |`); continue; }
    const how = key === 'dragcore292' ? '器の本文の差 0(窓は別の器 tests/exp-w323c-dragcorequick.mjs —— 器の関数をそのまま読む)' : '器の本文の差 0(既存の窓の環境変数・引数 —— 既定の経路は 1 文字も変えていない)';
    out.push(`| ${key} | ${envText(k)} | ${k.covers || '—'} | ${k.sec || '—'} | ${k.fullSec || '—'} | ${pct(k.sec, k.fullSec)} | ${how} |`);
  }
  return out.join('\n');
}
/** 表 2: 領域の宣言(足した 13 段と足さない 10 段)。declOf(harness) = 器の REGEN_SCOPE(読めなければ null) */
export function scopeRows(declOf) {
  const out = ['| 段 | 器 | 宣言 | presets | roots の数 |', '|---|---|---|---|---|'];
  for (const z of SCOPE_323C) {
    const d = declOf(z.harness);
    out.push(`| ${z.key} | ${z.harness} | ${d ? (d.complete === true ? '足した(complete)' : '足した(complete でない)') : '無い'} | ${d ? (d.presets === 'all' ? '"all"' : (d.presets || []).length + ' 本') : '—'} | ${d ? (d.roots || []).length : '—'} |`);
  }
  for (const z of SCOPE_SKIP_323C) out.push(`| ${z.key} | — | 足さない —— ${z.why} | — | — |`);
  return out.join('\n');
}
/** 表 3: synodic-299b の 3 プロセスと 1 プロセス(段ごとの所要・壁時計・物理の欄の差) */
export function synodicRows(S = SYNODIC_323C) {
  const out = ['| 走行 | 壁時計(秒) | 段の所要(秒: long・longh2・scan・fit・aps・sun3d) | 正本(第322便の鎖 1)との物理の欄の差 |', '|---|---|---|---|'];
  const parts = (p) => p ? S.laneOrder.map((k) => (p[k] === undefined ? '—' : p[k])).join('・') : '—';
  out.push(`| 子プロセス 3 本(W299B_WORKERS 既定 3 —— 負荷平均 ${S.w3.load || '—'}) | ${S.w3.sec ?? '—'} | ${parts(S.w3.parts)} | ${S.diffW3Canon ?? '—'}(葉 ${S.leaves ?? '—'}) |`);
  out.push(`| 1 プロセス(W299B_WORKERS=1 —— 負荷平均 ${S.w1.load || '—'}) | ${S.w1.sec ?? '—'} | ${parts(S.w1.parts)} | ${S.diffW1Canon ?? '—'}(葉 ${S.leaves ?? '—'}) |`);
  out.push(`| 正本(第322便の鎖 1 —— 1 プロセス・同じ既定の経路) | ${S.canonSec ?? '—'} | ${parts(S.canonParts)} | —(比べる元) |`);
  out.push(`| 3 本 − 1 本 | — | — | ${S.diffW3W1 ?? '—'} |`);
  return out.join('\n');
}
