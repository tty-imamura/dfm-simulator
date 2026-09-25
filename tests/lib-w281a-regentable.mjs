// 第281便a(原仮定者の裁定(第71報)・AN16 採用・統括の検証項目 R71)— **正本の再生成表**(chain の段と正本の対応)。
//
// ■ 何を持つか
//   統括の chain(正本を作り直す一連の走行)の**段**ごとに:
//     key(段の名前)・cmd(実行する器と引数)・env(器が要る環境変数)・outs(書く正本)・
//     sec(**実測の所要秒** —— secSource が出所)・alwaysRun(毎回走らせる常時群)・
//     role('current' | 'history')・after(meta.inputs[] に出ない読み込み —— 例: charon が calaudit を読む)
//   を 1 行に持つ。`tools/regen-plan.mjs` がこの表と正本の meta(inputs[]・code[]・scope)から
//   「再生成 / 再利用(領域一致)/ 履歴 / 常時」を判定し、依存順の実行計画を出す。
//   `lint.regenScope` が「lint.provenanceMeta の CANON がすべてこの表の outs に載っている」「alwaysRun の段は
//   計画で省略されない」「履歴の正本はどの現行の段の入力にもなっていない」を照合する。
//
// ■ 所要秒の出所(**予想ではなく実測**)
//   'w280-chain' … 第280便の統括 chain(4 本並列・同じ容器)の各段の開始〜終了の差(scratch の chain ログ)。
//   'w281a-chain' … 第281便a の再生成(Chromium 1 本 + node 1 本)の各段の差。
//   'w272b-wallSec' … 正本 charon-w272b.json の列ごとの `wallSec`(実測)を、新しい既定列の集合で足した値。
//   'w282c-run' … 第282便c の器の単独走行(正本の elapsedS —— Node だけ・Chromium なし)。
//
// ■ 第282便e(原仮定者の裁定(第72報)・統括の検証項目 R82)
//   ・段ごとに `volatilePaths`({正本: [JSON Pointer…]})—— 安定 hash で除く欄(**実行時刻・壁時計の所要だけ**)。
//     宣言の無い正本は**除外なし**。表の外で作られる JSON 入力は `EXTERNAL_VOLATILE` に置く。
//   ・計画の各段に `cause`(どの入力・式・受理規則で無効化されたか)を 1 列足す。領域の不一致の内訳は、
//     刻印時の html(`meta.targetSha256` と sha が同じ基点 html —— `--base`)があるときだけ引ける。
//   ・領域 hash と安定 hash は**刻印の版で**照合する(旧版の刻印は旧版で引き直す)。
//
// ■ しないこと: 走らせない・判定しない(表と、表を読む計画の純関数だけ)。
import fs from 'node:fs';
import crypto from 'node:crypto';
import { scopeHash, stableMatches } from './lib-w281a-scope.mjs';

export const REGEN_TABLE_VERSION = 'w282e-regentable-2';

// ---- 第282便e: 安定 hash の除外 Pointer(実パスは 8b05232 の正本で確かめた —— `lint.stableHashPaths` が毎回照合)
const META_RUN = ['/meta/generatedAt', '/meta/inputs/*/mtime', '/meta/code/*/mtime'];
const V_CALAUDIT = ['/meta/when', '/fourValues/current/when', '/diagnosticsSplit/carriedOverFrom',
  '/presets/*/run/wallSec', '/presets/*/run/timeBudget/*/wallSec', '/presets/*/run/timeBudget/*/rateStepsPerSec',
  '/presets/*/run/stopRule/wallSec', '/presets/*/run/stopRule/rateStepsPerSec',
  '/presets/*/run/stopRuleStages/*/wallSec', '/presets/*/run/stopRuleStages/*/rateStepsPerSec',
  '/presets/*/run/dtEighth/wallSec'];

const S = (key, cmd, outs, sec, o) => Object.assign({ key, cmd, outs, sec, secSource: 'w280-chain',
  alwaysRun: false, role: 'current', after: [], env: {}, volatilePaths: {} }, o || {});

/** 段の表(並びは第280便の chain の順 —— 計画は依存で並べ直す)。 */
export const REGEN_STEPS = [
  S('obsintake', 'node tests/exp-w263c-obsintake.mjs', ['tests/out/obsintake-w263c.json'], 0, { after: ['calaudit', 'solarsigma'] }),
  S('recordid', 'node tests/exp-w270b-recordid.mjs', ['tests/out/recordid-w270b.json'], 1),
  S('corrections', 'node tests/exp-w272e-corrections.mjs', ['tests/out/corrections-w272e.json'], 0),
  S('bh90', 'node tests/exp-w269c-bh90.mjs', ['tests/out/bh90-w269c.json'], 20),
  S('j1946adopt', 'node tests/exp-w270c-j1946adopt.mjs', ['tests/out/j1946adopt-w270c.json'], 149, { secSource: 'w281a-chain' }),
  S('nslock', 'node tests/exp-w272c-nslock.mjs', ['tests/out/nslock-w272c.json'], 688, { secSource: 'w281a-chain' }),
  S('plutostates', 'node tests/exp-w277a-plutostates.mjs', ['tests/out/plutostates-w277a.json'], 1),
  // ---- 常時群(calaudit 系と署名の後段): 領域が一致しても**毎回走らせる**
  S('calaudit', 'node tests/exp-w249b-calaudit.mjs', ['tests/out/calaudit-w249.json', 'tests/out/calaudit-w249-diag.json'], 3724, { alwaysRun: true,
    volatilePaths: { 'tests/out/calaudit-w249.json': V_CALAUDIT, 'tests/out/calaudit-w249-diag.json': [] } }),
  S('dt3', 'node tests/exp-w249b-calaudit.mjs --dt3-registry --dt8-registry --merge', [], 1683, { alwaysRun: true, after: ['calaudit'] }),
  S('kf0', 'node tests/exp-w249b-calaudit.mjs --kf0-runs --kf0-only --kf0-dt3 --only jupiterGalilean,venusReal,marsMoonsReal,plutoCharonReal,neptuneReal --merge', ['tests/out/kf0-w259d.json'], 299, { alwaysRun: true, after: ['dt3'] }),
  S('solarsigma', 'node tests/exp-w262d-solarsigma.mjs', ['tests/out/solarsigma-w262d.json'], 0, { alwaysRun: true, after: ['kf0'] }),
  S('stoprule', 'node tests/exp-w270a-stoprule.mjs', ['tests/out/stoprule-w270a.json'], 0, { alwaysRun: true, after: ['kf0'] }),
  S('issues', 'node tests/exp-w272a-issues.mjs', ['tests/out/issues-w272a.json'], 0, { alwaysRun: true, after: ['kf0', 'solarsigma', 'charon-h', 'charon-h2', 'charon-h4', 'nslock'] }),
  S('assessed', 'node tests/exp-w273c-assessedtable.mjs --check', ['tests/out/assessed-w273c.json'], 1, { alwaysRun: true, after: ['kf0'] }),
  S('d0audit', 'node tests/exp-w275b-d0audit.mjs', ['tests/out/d0audit-w275b.json'], 21),
  // ---- ❄️ 対照系列(第281便a: 現行列 C0/C1/C3/C5/C6/S・h4 は C0/C1/C6 だけ・履歴列 C2/C4/C7 は再生成しない)
  S('charon-h', 'node tests/exp-w272b-charon.mjs --stage h', ['tests/out/charon-w272b.json'], 677, { secSource: 'w281a-chain', after: ['kf0'], group: 'charon' }),
  S('charon-h2', 'node tests/exp-w272b-charon.mjs --stage h2', ['tests/out/charon-w272b.json'], 1407, { secSource: 'w272b-wallSec', after: ['charon-h'], group: 'charon' }),
  S('charon-h4', 'node tests/exp-w272b-charon.mjs --stage h4', ['tests/out/charon-w272b.json'], 700, { secSource: 'w272b-wallSec', after: ['charon-h2'], group: 'charon' }),
  S('charon-history', 'node tests/exp-w281a-charonsplit.mjs --rev 53aaa64', ['tests/out/charon-history-w272b.json'], 0, { role: 'history', secSource: 'w281a-chain',
    note: '履歴列は 1 度だけ転記した。**再生成しない**(計画は常に「履歴」)' }),
  // ❄️ D₀ 系列は履歴へ(D₀ の規則が変わるときだけ再走 —— 計画は「履歴」)
  S('charond0', 'node tests/exp-w272b-charon.mjs --stage h --D0 rule && node tests/exp-w272b-charon.mjs --stage h2 --D0 rule && node tests/exp-w272b-charon.mjs --stage h4 --D0 rule',
    ['tests/out/charond0-w275b.json'], 1402, { role: 'history', after: ['kf0'],
      note: 'D₀ の規則(tests/lib-w275b-dsplit.mjs)が変わるときだけ再走する(第281便a)' }),
  S('charonk', 'node tests/exp-w273b-charonk.mjs', ['tests/out/charonk-w273b.json'], 979, { secSource: 'w281a-chain', after: ['kf0'] }),
  // ε 系列は h 段だけ(h2/h4 は領域が同じなら「転記」で残る —— 器の併合規則)
  S('charoneps-h', 'node tests/exp-w272b-charon.mjs --stage h --eps rule', ['tests/out/charoneps-w276b.json'], 212, { secSource: 'w281a-chain', after: ['kf0'],
    volatilePaths: { 'tests/out/charoneps-w276b.json': META_RUN.concat(['/columns/*/h/wallSec', '/columns/*/h2/wallSec', '/columns/*/h4/wallSec']) },
    note: '第281便a: 既定は h 段だけ。領域が変わったときは h2/h4 も走らせる(計画が charoneps-h2/h4 を足す)' }),
  S('charoneps-h2', 'node tests/exp-w272b-charon.mjs --stage h2 --eps rule', ['tests/out/charoneps-w276b.json'], 430, { secSource: 'w272b-wallSec', after: ['charoneps-h'], onlyIfScopeChanged: true }),
  S('charoneps-h4', 'node tests/exp-w272b-charon.mjs --stage h4 --eps rule', ['tests/out/charoneps-w276b.json'], 847, { secSource: 'w272b-wallSec', after: ['charoneps-h2'], onlyIfScopeChanged: true }),
  S('charonfactors', 'node tests/exp-w276b-charonfactors.mjs', ['tests/out/charonfactors-w276b.json'], 308, { secSource: 'w281a-chain', after: ['charoneps-h', 'charoneps-h2', 'charoneps-h4'] }),
  S('charondfm', 'node tests/exp-w277b-charondfm.mjs', ['tests/out/charondfm-w277b.json'], 76, { secSource: 'w281a-chain' }),
  S('charonwin', 'node tests/exp-w278b-charonwin.mjs', ['tests/out/charonwin-w278b.json'], 87, { secSource: 'w281a-chain' }),
  // ---- 第280便の chain2
  S('sparc', 'node tests/exp-w269c-sparc.mjs', ['tests/out/sparc-w269c.json'], 192, { secSource: 'w281a-chain' }),
  S('cluster', 'node tests/exp-w269d-cluster.mjs', ['tests/out/cluster-w269d.json'], 84, { secSource: 'w281a-chain' }),
  S('galaxydiag', 'node tests/exp-w271d-galaxydiag.mjs', ['tests/out/galaxydiag-w271d.json'], 352, { secSource: 'w281a-chain' }),
  S('qsplit', 'node tests/exp-w271c-qsplit.mjs', ['tests/out/qsplit-w271c.json'], 1),
  S('twobody', 'node tests/exp-w272c-twobody.mjs', ['tests/out/twobody-w272c.json'], 8),
  S('rpar', 'node tests/exp-w272c-rpar.mjs', ['tests/out/rpar-w272c.json'], 1),
  S('nslockledger', 'node tests/exp-w273c-nslockledger.mjs', ['tests/out/nslockledger-w273c.json'], 1, { after: ['nslock'] }),
  S('intakeB', 'node tests/exp-w266a-intakeB.mjs', ['tests/out/intakeB-w266a.json'], 0),
  S('confirm2', 'node tests/exp-w267a-confirm2.mjs', ['tests/out/confirm2-w267a.json'], 1, { after: ['kf0', 'solarsigma'] }),
  S('confirm3', 'node tests/exp-w269b-confirm3.mjs', ['tests/out/confirm3-w269b.json'], 0, { after: ['kf0', 'solarsigma'] }),
  S('confirm4', 'node tests/exp-w270b-confirm4.mjs', ['tests/out/confirm4-w270b.json'], 0, { after: ['kf0', 'solarsigma'] }),
  S('declmatch', 'node tests/exp-w271b-declmatch.mjs', [], 0),
  S('solutionid', 'node tests/exp-w271b-solutionid.mjs', [], 0),
  S('derived', 'node tests/exp-w271b-derived.mjs', [], 0),
  S('bhcore', 'node tests/exp-w274e-bhcore.mjs', ['tests/out/bhcore-w274e.json'], 1),
  S('armbar', 'node tests/exp-w274e-armbar.mjs', ['tests/out/armbar-w274e.json'], 0),
  S('sync', 'node tests/exp-w274b-sync.mjs', ['tests/out/sync-w274b.json'], 25),
  S('shapetoy', 'node tests/exp-w274d-shapetoy.mjs', ['tests/out/shapetoy-w274d.json'], 265, { secSource: 'w281a-chain' }),
  S('galaxylite', 'node tests/exp-w274c-galaxylite.mjs', ['tests/out/galaxylite-w274c.json'], 53),
  S('galaxyprof2', 'node tests/exp-w275c-galaxyprof2.mjs', ['tests/out/galaxyprof2-w275c.json'], 22),
  S('meshnod0', 'node tests/exp-w275b-meshnod0.mjs', ['tests/out/meshnod0-w275b.json'], 2),
  S('shapecrit', 'node tests/exp-w275d-shapecrit.mjs', ['tests/out/shapecrit-w275d.json'], 106, { secSource: 'w281a-chain' }),
  S('dyncenter', 'node tests/exp-w275d-dyncenter.mjs', ['tests/out/dyncenter-w275d.json'], 5),
  S('powerball', 'node tests/exp-w275e-powerball.mjs', ['tests/out/powerball-w275e.json'], 3),
  S('kfgate', 'node tests/exp-w275a-kfgate.mjs', ['tests/out/kfgate-w275a.json'], 1),
  S('presetaxes', 'node tests/exp-w275a-presetaxes.mjs', ['tests/out/presetaxes-w275a.json'], 1),
  S('bgfield', 'node tests/exp-w276a-bgfield.mjs', ['tests/out/bgfield-w276a.json'], 1),
  S('d0audit2', 'node tests/exp-w276a-d0audit2.mjs', ['tests/out/d0sites-w276a.json'], 2),
  S('bgpredict', 'node tests/exp-w276a-bgpredict.mjs', ['tests/out/bgpredict-w276a.json'], 1,
    { volatilePaths: { 'tests/out/bgpredict-w276a.json': META_RUN } }),
  S('powerball2', 'node tests/exp-w276c-powerball2.mjs', ['tests/out/powerball2-w276c.json'], 11),
  S('corefield', 'node tests/exp-w276d-corefield.mjs', ['tests/out/corefield-w276d.json'], 187, { secSource: 'w281a-chain' }),
  S('galaxyproto', 'node tests/exp-w276e-galaxyproto.mjs', ['tests/out/galaxyproto-w276e.json'], 467),
  S('nsgrid', 'node tests/exp-w277c-nsgrid.mjs', ['tests/out/nsgrid-w277c.json'], 955),
  S('selfinertia', 'node tests/exp-w277d-selfinertia.mjs', ['tests/out/selfinertia-w277d.json'], 1),
  S('slipaudit', 'node tests/exp-w278c-slipaudit.mjs', ['tests/out/slipaudit-w278c.json'], 0),
  S('nsmode', 'node tests/exp-w278c-nsmode.mjs', ['tests/out/nsmode-w278c.json'], 117),
  S('bgequiv', 'node tests/exp-w278d-bgequiv.mjs', ['tests/out/bgequiv-w278d.json'], 96, { secSource: 'w281a-chain',
    volatilePaths: { 'tests/out/bgequiv-w278d.json': META_RUN.concat(['/elapsedS']) } }),
  S('bgbudget', 'node tests/exp-w277d-bgbudget.mjs', ['tests/out/bgbudget-w277d.json'], 29, { secSource: 'w281a-chain' }),
  S('bgcompose', 'node tests/exp-w279c-bgcompose.mjs', ['tests/out/bgcompose-w279c.json'], 2),
  S('bgbudget2', 'node tests/exp-w279c-bgbudget2.mjs', ['tests/out/bgbudget2-w279c.json'], 77, { secSource: 'w281a-chain',
    volatilePaths: { 'tests/out/bgbudget2-w279c.json': META_RUN.concat(['/elapsedS']) } }),
  S('sphereKernel', 'node tests/exp-w280b-sphereKernel.mjs', ['tests/out/spherekernel-w280b.json'], 2),
  S('galaxyprof', 'node tests/exp-w274c-galaxyprof.mjs $BASE_HTML beta/index.html', ['tests/out/galaxyprof-w274c.json'], 25, { env: { BASE_HTML: '基点 html(引数)' } }),
  S('needmesh', 'node tests/exp-w274c-needmesh.mjs $BASE_HTML beta/index.html', ['tests/out/needmesh-w274c.json'], 2, { env: { BASE_HTML: '基点 html(引数)' } }),
  S('d68', 'node tests/exp-w280e-d68.mjs', ['tests/out/d68-w280e.json'], 153, { secSource: 'w281a-chain' }),
  // QA の確認順・並列化の実測(統括がフル QA の後に --record —— chain の外。所要は QA 本体に含まれる)
  S('qaorder', 'node tests/exp-w279b-qaorder.mjs --record', ['tests/out/qaorder-w279b.json'], 0, { secSource: 'chain の外(フル QA の後)' }),
  S('emgrid', 'node tests/exp-w280b-emgrid.mjs(4 部分 + --merge —— 第280便の chain2c と同じ分割)', ['tests/out/emgrid-w280b.json'], 2295, { secSource: 'w281a-chain', node: true }),
  // ---- 後段(calaudit と署名の後 —— 読む正本が揃ってから)
  S('kf0ledger-old', 'node tests/exp-w274a-kf0ledger.mjs', ['tests/out/kf0ledger-w274a.json'], 0, { alwaysRun: true, after: ['kf0', 'charon-h', 'charon-h2', 'charon-h4', 'nslockledger', 'galaxydiag'] }),
  S('kf0ledger', 'node tests/exp-w275a-kf0ledger.mjs', ['tests/out/kf0ledger-w275a.json'], 0, { alwaysRun: true, after: ['kf0', 'charon-h', 'charon-h2', 'charon-h4', 'nslockledger', 'galaxydiag', 'presetaxes'] }),
  S('charonInput', 'node tests/exp-w280d-charonInput.mjs', ['tests/out/charoninput-w280d.json'], 603, { secSource: 'w281a-chain', after: ['kf0'] }),
  S('geo3', 'node tests/exp-w280c-geo3.mjs', ['tests/out/geo3-w280c.json'], 1016, { secSource: 'w281a-chain', after: ['kf0', 'bgbudget2'],
    env: { W280_BASE: 'beta/_w280_base.html(第280便の基点 d0286cf の beta/index.html —— 項目 g・h の対照)' } }),
  // ---- 第281便 b/c/d の新しい正本(統括が統合時に追記 —— 所要は第281便の統合 chain3 の実測)
  S('galaxychain', 'node tests/exp-w281b-galaxychain.mjs', ['tests/out/galaxychain-w281b.json', 'tests/out/chainledger-w281b.json'], 73, { secSource: 'w281-chain3', node: true,
    note: '第281便b: 場の契約の一覧・🎋 の連鎖・交換模型の帳簿(chainledger は lib 自身が target —— 同じ器が書く)' }),
  S('rotorledger', 'node tests/exp-w281c-rotorledger.mjs', ['tests/out/rotorledger-w281c.json'], 1, { secSource: 'w281-chain3', node: true,
    note: '第281便c: 条件付き質量台帳・η 対照(html だけを読む・他の正本を読まない)' }),
  S('strain', 'node tests/exp-w281d-strain.mjs', ['tests/out/strain-w281d.json'], 26, { secSource: 'w281-chain3', node: true, after: ['galaxyproto', 'corefield'],
    note: '第281便d: 2D の渦伸長 0・ひずみ率の診断(inputs に galaxyproto-w276e・corefield-w276d)' }),
  S('samplestatus', 'node tests/exp-w279a-samplestatus.mjs && node tests/exp-w279a-samplestatus.mjs --check', ['tests/out/samplestatus-w279a.json'], 2, { alwaysRun: true, after: ['kf0', 'charonwin'] }),
  S('mercury', 'node tests/exp-w280a-mercury.mjs', ['tests/out/mercury-w280a.json'], 284, { secSource: 'w281a-chain', alwaysRun: true, after: ['kf0'] }),
  // ---- 第282便c の新しい正本(html だけを読む・他の正本を読まない —— 所要は器の elapsedS の実測)
  S('dragprofile', 'node tests/exp-w282c-dragprofile.mjs', ['tests/out/dragprofile-w282c.json'], 2, { secSource: 'w282c-run', node: true,
    note: '第282便c: kF0 不感の実測(128 歩 × 2 本)・引きずりプロファイルの純関数の単体試験・診断表(html だけを読む・環境変数なし)' }),
];

/**
 * 表の外で作られる JSON 入力の除外 Pointer(第282便e —— 領域を宣言した器が安定 hash を刻む入力のうち、
 * 再生成表の段が書かないもの)。
 */
export const EXTERNAL_VOLATILE = {
  'tests/out/analogy-w265a.json': ['/meta/when', '/meta/inputs/*/mtime', '/meta/spentSec'],
  'tests/out/kjoint2-w265a.json': ['/meta/spentSec'],
  'tests/out/obscal-results.json': ['/manifest/generatedAt'],
};

/** 第282便e: 正本(相対パス)の除外 Pointer —— 書く段の宣言の和 + 表の外の宣言。**宣言が無ければ []**(除外なし)。 */
export function volatilePathsOf(file) {
  const set = new Set();
  for (const st of REGEN_STEPS) for (const p of ((st.volatilePaths || {})[file] || [])) set.add(p);
  for (const p of (EXTERNAL_VOLATILE[file] || [])) set.add(p);
  return [...set].sort();
}

/** 第282便e: その正本に除外 Pointer の宣言(空の [] を含む)があるか。 */
export function volatileDeclared(file) {
  if (Object.prototype.hasOwnProperty.call(EXTERNAL_VOLATILE, file)) return true;
  return REGEN_STEPS.some((st) => Object.prototype.hasOwnProperty.call(st.volatilePaths || {}, file));
}

/** 正本ファイル → 段の key の並び。 */
export function stepsByOut() {
  const m = new Map();
  for (const s of REGEN_STEPS) for (const o of s.outs) { if (!m.has(o)) m.set(o, []); m.get(o).push(s.key); }
  return m;
}

/** 常時群の正本(alwaysRun の段が書く正本)。 */
export function alwaysRunOuts() {
  return [...new Set(REGEN_STEPS.filter((s) => s.alwaysRun).flatMap((s) => s.outs))];
}

/** 履歴の正本(role:'history' の段が書く正本)。 */
export function historyOuts() {
  return [...new Set(REGEN_STEPS.filter((s) => s.role === 'history').flatMap((s) => s.outs))];
}

const shaFile = (abs) => { try { return crypto.createHash('sha256').update(fs.readFileSync(abs)).digest('hex'); } catch { return null; } };
const readMeta = (abs) => { try { return (JSON.parse(fs.readFileSync(abs, 'utf8')) || {}).meta || null; } catch { return null; } };

/**
 * 再生成の計画(純関数 —— ファイルを書かない・走らせない)。
 * 判定(段ごと):
 *   history … role:'history'(再生成しない)
 *   always  … alwaysRun(常時群 —— 領域が一致しても走らせる)
 *   regen   … 正本・来歴が無い / 対象(html)の hash も領域 hash も一致しない / 器・lib の刻印が違う /
 *             入力ファイルの sha も安定 hash も違う
 *   recheck … 自分は一致しているが、依存先(after・入力の生成段)が regen/always —— **依存先が走った後に
 *             もう一度計画する**(常時群の正本は中身が同じでも時刻で sha が変わるので、安定 hash で見直す)
 *   reuse   … 対象・領域・コード・入力がすべて一致(再利用)
 * @param {object} o
 * @param {string} o.root リポジトリ root
 * @param {string} [o.html] 候補の html(既定 root/beta/index.html)—— 正本の target が beta/index.html のとき、この html で照合する
 * @param {string} [o.baseHtml] 基点の html(情報: 基点で領域が一致していたか)
 */
export function planRegen(o) {
  const root = o.root.replace(/\/$/, '');
  const abs = (f) => root + '/' + f;
  const htmlAbs = o.html || abs('beta/index.html');
  const htmlSha = shaFile(htmlAbs);
  const baseSha = o.baseHtml ? shaFile(o.baseHtml) : null;
  const scopeCache = new Map();
  const scopeFull = (hAbs, sc) => {
    const k = hAbs + '|' + JSON.stringify(sc);
    if (!scopeCache.has(k)) { let r = null; try { r = scopeHash(hAbs, sc); } catch { r = null; } scopeCache.set(k, r); }
    return scopeCache.get(k);
  };
  // 領域 hash は**刻印の版で**引く(sc.version —— scopeHash が読む)
  const scopeOn = (hAbs, sc) => { const r = scopeFull(hAbs, sc); return r && r.scopeComplete ? r.scopeSha256 : null; };
  // 第282便e: 領域の不一致の内訳(刻印時の html = 基点のときだけ)
  const scopeCause = (hA, sc, stampSha) => {
    if (!o.baseHtml || !baseSha || baseSha !== stampSha) return '領域(内訳は刻印時の html が要る —— --base に targetSha256 の html)';
    const a = scopeFull(o.baseHtml, sc), b = scopeFull(hA, sc);
    if (!a || !b) return '領域(引けない)';
    const out = [];
    const diffKeys = (x, y) => [...new Set([...Object.keys(x || {}), ...Object.keys(y || {})])].filter((k) => (x || {})[k] !== (y || {})[k]);
    const raw = diffKeys(a.parts.presetsRaw, b.parts.presetsRaw);
    const acc = diffKeys(a.parts.presetsAccepted, b.parts.presetsAccepted).filter((k) => raw.indexOf(k) < 0);
    const fn = diffKeys(a.parts.closure, b.parts.closure);
    const hp = diffKeys(a.parts.hp, b.parts.hp);
    const cs = diffKeys(a.parts.consts, b.parts.consts);
    if (raw.length) out.push('プリセット: ' + raw.slice(0, 4).join(',') + (raw.length > 4 ? ` 他 ${raw.length - 4}` : ''));
    if (acc.length) out.push('受理規則(受理後だけ変化): ' + acc.slice(0, 4).join(',') + (acc.length > 4 ? ` 他 ${acc.length - 4}` : ''));
    if (fn.length) out.push('式: ' + fn.slice(0, 4).join(',') + (fn.length > 4 ? ` 他 ${fn.length - 4}` : ''));
    if (hp.length) out.push('式(HP): ' + hp.join(','));
    if (a.parts.core !== b.parts.core) out.push('式: S._core');
    if (cs.length) out.push('定数: ' + cs.join(','));
    if (a.scope.version !== b.scope.version) out.push('領域の版');
    return out.length ? out.join(' / ') : '領域(内訳の差なし —— 版・停止集合)';
  };
  const producer = new Map();
  for (const st of REGEN_STEPS) for (const f of st.outs) if (!producer.has(f)) producer.set(f, st.key);
  const rows = new Map();
  for (const st of REGEN_STEPS) {
    const row = { key: st.key, cmd: st.cmd, env: st.env, outs: st.outs, sec: st.sec, secSource: st.secSource,
      alwaysRun: st.alwaysRun, role: st.role, status: null, reasons: [], deps: [], scopeUsed: false, baseScopeSame: null,
      cause: [] };
    const cause = (c) => { if (row.cause.indexOf(c) < 0) row.cause.push(c); };
    const deps = new Set(st.after || []);
    if (st.role === 'history') { row.status = 'history'; row.reasons.push(st.note || '履歴(再生成しない)'); rows.set(st.key, row); continue; }
    const why = [];
    for (const out of st.outs) {
      const m = readMeta(abs(out));
      if (!m) { why.push(out + ': 正本か meta が無い'); cause('正本が無い'); continue; }
      for (const inp of (m.inputs || [])) { const p = producer.get(inp.file); if (p && p !== st.key) deps.add(p); }
      // 対象
      const t = m.target || null;
      if (!t || !m.targetSha256) { why.push(out + ': 対象の刻印が無い'); cause('刻印が無い'); }
      else if (/\.html$/.test(t)) {
        const hA = (t === 'beta/index.html') ? htmlAbs : abs(t);
        const hS = (t === 'beta/index.html') ? htmlSha : shaFile(hA);
        if (m.targetSha256 !== hS) {
          const sNow = (m.scopeComplete === true && m.scope) ? scopeOn(hA, m.scope) : null;
          if (sNow && sNow === m.scopeSha256) {
            row.scopeUsed = true;
            if (o.baseHtml && t === 'beta/index.html') row.baseScopeSame = (scopeOn(o.baseHtml, m.scope) === sNow);
          } else {
            why.push(out + ': 対象 html の hash も領域 hash も一致しない' + (m.scope ? '' : '(領域の宣言なし)'));
            cause(m.scope && m.scopeComplete === true ? scopeCause(hA, m.scope, m.targetSha256) : '対象 html(領域の宣言なし —— html 全体)');
          }
        }
      } else if (shaFile(abs(t)) !== m.targetSha256) { why.push(out + ': 対象 ' + t + ' の hash が違う'); cause('入力(対象): ' + t); }
      // コード
      if (!Array.isArray(m.code) || !m.code.length) { why.push(out + ': 器・lib の刻印が無い'); cause('刻印が無い'); }
      else for (const c of m.code) if (c.sha256 && shaFile(abs(c.file)) !== c.sha256) { why.push(out + ': コード ' + c.file + ' が変わった'); cause('式(器・lib): ' + c.file); }
      // 入力
      for (const inp of (m.inputs || [])) {
        if (inp.missing || !inp.sha256 || inp.file === t) continue;
        if (shaFile(abs(inp.file)) === inp.sha256) continue;
        const st2 = (m.inputsStable || []).find((z) => z.file === inp.file);
        if (st2 && stableMatches(root, st2)) continue;   // 第282便e: 刻印の版で照合
        why.push(out + ': 入力 ' + inp.file + ' が変わった');
        cause('入力: ' + inp.file + (st2 ? '(安定 hash も違う)' : ''));
      }
      // inputs[] に載らない読み込み(❄️ 対照系列の calaudit・nslock の kjoint2 —— 安定 hash だけを刻んだ入力)
      const listed = new Set((m.inputs || []).map((z) => z.file));
      for (const st2 of (m.inputsStable || [])) {
        if (listed.has(st2.file)) continue;
        const p = producer.get(st2.file); if (p && p !== st.key) deps.add(p);
        if (!stableMatches(root, st2)) { why.push(out + ': 入力 ' + st2.file + ' の中身(安定 hash)が変わった'); cause('入力: ' + st2.file + '(安定 hash)'); }
      }
    }
    row.deps = [...deps].filter((d) => REGEN_STEPS.some((z) => z.key === d));
    if (st.alwaysRun) { row.status = 'always'; row.reasons = ['常時群'].concat(why); }
    else if (why.length) { row.status = 'regen'; row.reasons = why; }
    else row.status = 'reuse';
    rows.set(st.key, row);
  }
  // 依存の伝播(regen/always に依存する reuse → recheck)
  let changed = true;
  while (changed) {
    changed = false;
    for (const row of rows.values()) {
      if (row.status !== 'reuse') continue;
      const hit = row.deps.filter((d) => rows.get(d) && ['regen', 'always', 'recheck'].includes(rows.get(d).status));
      if (hit.length) { row.status = 'recheck'; row.reasons.push('依存先が走る: ' + hit.join(', ')); row.cause.push('依存先: ' + hit.join(',')); changed = true; }
    }
  }
  // 領域が変わったときだけの段(ε 系列の h2/h4)
  for (const st of REGEN_STEPS) {
    if (!st.onlyIfScopeChanged) continue;
    const row = rows.get(st.key);
    const htmlWhy = row.reasons.some((r) => r.indexOf('hash も領域 hash も一致しない') >= 0);
    if (row.status === 'regen' && !htmlWhy) { row.status = 'reuse'; row.reasons.push('領域は同じ —— h 段だけ走らせ h2/h4 は器の併合規則で転記'); }
    if (row.status === 'recheck') { row.status = 'reuse'; row.reasons.push('領域は同じ —— h2/h4 は転記'); }
  }
  // 依存順(トポロジカル)
  const order = [];
  const seen = new Set();
  const visit = (k, stack) => {
    if (seen.has(k)) return;
    if (stack.has(k)) return;
    stack.add(k);
    for (const d of (rows.get(k) || { deps: [] }).deps) visit(d, stack);
    stack.delete(k);
    seen.add(k); order.push(k);
  };
  for (const st of REGEN_STEPS) visit(st.key, new Set());
  const list = order.map((k) => rows.get(k));
  // 第282便e: 「どの入力・式・受理規則で無効化されたか」の 1 列(文字列)
  for (const r of list) {
    if (r.status === 'history') r.causeText = '履歴';
    else if (r.status === 'reuse') r.causeText = '';
    else r.causeText = (r.status === 'always' ? ['常時群'] : []).concat(r.cause).join(' / ') || (r.status === 'always' ? '常時群' : '');
  }
  const sum = (f) => list.filter(f).reduce((a, r) => a + (Number(r.sec) || 0), 0);
  const count = {};
  for (const r of list) count[r.status] = (count[r.status] || 0) + 1;
  return {
    version: REGEN_TABLE_VERSION,
    html: htmlAbs.replace(root + '/', ''), htmlSha256: htmlSha,
    baseHtml: o.baseHtml ? o.baseHtml.replace(root + '/', '') : null, baseSha256: baseSha,
    count,
    secLower: sum((r) => r.status === 'regen' || r.status === 'always'),
    secUpper: sum((r) => r.status === 'regen' || r.status === 'always' || r.status === 'recheck'),
    run: list.filter((r) => ['regen', 'always', 'recheck'].includes(r.status)).map((r) => r.key),
    steps: list,
    note: 'secLower = regen+always の実測秒の和(recheck が全部「再利用」に戻った場合)/ secUpper = recheck も走らせた場合。'
      + '所要秒は第280便の chain(4 本並列)と正本の列ごとの wallSec の実測で、見積りである(並列度で変わる)',
  };
}

export default { REGEN_TABLE_VERSION, REGEN_STEPS, EXTERNAL_VOLATILE, volatilePathsOf, volatileDeclared, stepsByOut,
  alwaysRunOuts, historyOuts, planRegen };
