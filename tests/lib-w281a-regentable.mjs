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
//   'w282a-branch' … 第282便a の枝で器を 1 回走らせた実測(fmigration は正本の meta.wallSec の前後の和)。
//   'w282c-run' … 第282便c の器の単独走行(正本の elapsedS —— Node だけ・Chromium なし)。
//   'w283a-branch' … 第283便a の枝で器を 1 回走らせた実測(正本の elapsedS —— Node だけ・他の枝と同じ容器で並走)。
//   'w283c-run' … 第283便c の器の単独走行(正本の elapsedSec —— Node の vm + 判定器の --tp-copy〔Chromium〕)。
//   'w284a-branch' … 第284便a の枝で器を走らせた実測(正本の elapsedS —— 1 回目 3808.5・2 回目 3067.7 を採る。Node だけ・子プロセス 3 本・他の枝と同じ容器で並走〔負荷平均 12〜34〕)。
//   'w284e-branch' … 第284便e の枝で器を 1 回走らせた実測(正本の elapsedS —— tpsign は正本が基点の世代で判定器を --only で走らせた値)。
//   'w285a-branch' … 第285便a の枝で器を走らせた実測(正本の elapsedS —— contact285 は判定器なし・clusterScan は子プロセス 2 本・他の枝と同じ容器で並走)。
//   'w285b-branch' … 第285便b の枝で器を 1 回走らせた実測(正本の elapsedS 681.6 —— Node だけ・他の枝と同じ容器で並走〔負荷平均 30 前後〕)。
//
// ■ 第282便e(原仮定者の裁定(第72報)・統括の検証項目 R82)
//   ・段ごとに `volatilePaths`({正本: [JSON Pointer…]})—— 安定 hash で除く欄(**実行時刻・壁時計の所要だけ**)。
//     宣言の無い正本は**除外なし**。表の外で作られる JSON 入力は `EXTERNAL_VOLATILE` に置く。
//   ・計画の各段に `cause`(どの入力・式・受理規則で無効化されたか)を 1 列足す。領域の不一致の内訳は、
//     刻印時の html(`meta.targetSha256` と sha が同じ基点 html —— `--base`)があるときだけ引ける。
//   ・領域 hash と安定 hash は**刻印の版で**照合する(旧版の刻印は旧版で引き直す)。
//
// ■ 第283便e(原仮定者の裁定(第73報)AN29・統括の検証項目 R88)—— **非物理 meta の除外・随伴ファイル・鎖の機械生成**
//   ・calaudit の除外 Pointer に**非物理の同一性 meta**(`V_CALAUDIT_META` —— 対象 html の名前と sha の写し 4 か所・
//     引用した ❄️ 正本の sha・分割先 diag の sha とバイト数・分割前後のバイト数)を足した。実パスは 53aaa64 → 8b05232 の
//     calaudit の実際の再走(既存 140 本 1 bit 不変の便)で**変わった欄の全部**から、実行時刻・所要と同一性 meta だけを取った
//     (物理欄は 1 つも除いていない —— `lint.stableHashPaths` ②)。
//   ・分割先 `calaudit-w249-diag.json` は sha を除いた代わりに**随伴ファイル**(`STABLE_COMPANIONS`)として別の行で
//     安定 hash を刻む(除く Pointer は `/when`・`/carriedOverFrom` だけ —— 中身〔移した診断〕は残る)。
//   ・段が**書く**ファイルを `merges`(`--merge` で正本へ書き戻す段: dt3・kf0 → calaudit の 2 ファイル)まで含めて持つ
//     (`writesOf`)。読む段は**書く段のすべて**の後に置く(`tableDeps`)。第282便の統合で起きた順序の型(d0audit・bgbudget を
//     入力より先・kf0ledger を nslockledger の再走の後に走らせない)は `tableDepsAudit`(表の after の推移閉包が正本の入力の
//     書き手を覆うか)と `checkOrder`(実際に走った列の照合)で検出する。
//   ・`buildChain` / `chainShell`: 計画(regen/always/recheck)と依存の閉包から、依存順の波と並列レーンのシェルを出す
//     (済み印で再開・rc≠0 で止まる・ログ名 `<波>-<段>.log`)。閉包で入った後段は**上流が走った後に自分の判定を引き直す**
//     (`--gate` —— 自分の対象・コード・入力〔安定 hash〕が一致すれば再利用)。`tools/regen-chain.mjs` が CLI。
//
// ■ 第284便f(原仮定者の裁定(第74報)⑥「まだ時間が長いので改善する・並列実行を検討する」・統括の検証項目 R94)—— **並列化の規約**
//   ・**ready queue**: 鎖のランナー(`chainShell`)は波全体の完了を待たない。依存(鎖の中)が済んだ段から、優先度(自分から下流の端までの
//     実測秒の最長路 —— `chainPriority`)の順に空きレーンへ入れる。波の番号はログ名 `<波>-<段>.log` と表示にだけ残す。
//   ・**書込排他**: 書くファイル(`writesOf` = outs + merges)が重なる段は同時に走らせない(ランナーは排他の鍵・表は after の全順序 ——
//     `tableDepsAudit` ②・模擬 `simulateReadyQueue`・実走の時系列 `checkTimeline`)。outs の外を書く段は `touches` に書き、
//     ほぼ全段が読むファイル(beta/index.html —— samplestatus)を書く段は `exclusive:true`(レーンを全部取る = 単独で走る)。
//   ・**共有 worker 予算**: 段の `workers`(既定 1)ぶんのレーンを取る。段の中で並列に走る器(較正走行の分割 tools/calaudit-split.mjs は
//     分割数)は workers に分割数を書く —— 再生成のレーン × 段の中の並列 × QA を重ねない(QA は鎖の外・鎖の後に 1 本)。
//   ・**済み印の契約**(`chainContracts`・版 CHAIN_CONTRACT_VERSION): policy(表の版・段・mode・cmd・env の名前・書くファイル・workers)・
//     code(cmd の器と正本の meta.code[] の現行 sha)・input(計画の対象 html の sha と鎖の中の上流の契約)の sha256。**同じ契約の
//     済み印だけ**を再開で済みと見なす(違う印は .stale へ退けて走らせ直す)。便をまたぐ済み印は契約が違うので自動で無効になる。
//   ・**刻印の Pointer ≠ 今の宣言 → regen**(AN43 —— `planRegen` の入力の照合。`--gate` も同じ判定を引く)。
//   ・**較正走行の分割**: `--shard-*`(tests/exp-w249b-calaudit.mjs)と tools/calaudit-split.mjs。分割した正本が直列と**ビット同一**
//     (安定 hash 一致・除外 Pointer の外の差 0 —— tests/exp-w284f-splitcheck.mjs)であることを実測した段だけ cmd を分割にする
//     (同一でなければ採らない)。cmd には器の名前(`--harness tests/exp-w249b-calaudit.mjs`)を残す(samplestatus・families が cmd の
//     器の名前で段を引く)。
//
// ■ しないこと: 走らせない・判定しない(表と、表を読む計画の純関数だけ)。
import fs from 'node:fs';
import crypto from 'node:crypto';
import { scopeHash, stableMatches, stableInputOk, STABLE_VERSION, stableJsonSha } from './lib-w281a-scope.mjs';

// ■ 第284便c(原仮定者の裁定(第74報)⑥・AN33・AN43・統括の検証項目 R93)
//   ・常時の dt3 段を `--h4-exceptions --merge`(h/4 は例外の登録簿の本だけ)・kf0 段を `--kf0-h4-exceptions`(h/4 は登録簿の kf0 の本だけ)へ。
//     所要秒は第284便c の枝の実測(一時ファイルへ走らせた同じ段 —— secSource 'w284c-run')。
//   ・**AN43**: 計画(`planRegen` —— 鎖の `--gate` も同じ関数)は、入力の**刻印の安定 hash の Pointer 宣言・方式の版が今の宣言と違えば**
//     (入力のバイト sha が刻印と同じでも)その段を regen にする。随伴ファイルの行も同じ(`stampedDeclDrift`)。
//     第283便e の `lint.stableHashPaths` ⑤ は「旧宣言 ⊊ 今の宣言」を**照合の上では**通す(刻印の Pointer で照合するので除きすぎにならない)が、
//     再生成の計画では「今の宣言で刻み直す」ために走らせ直す(`an43Probe` —— QA `lint.regenChain` (g))。
export const REGEN_TABLE_VERSION = 'w284-regentable-5';

// ---- 第282便e: 安定 hash の除外 Pointer(実パスは 8b05232 の正本で確かめた —— `lint.stableHashPaths` が毎回照合)
const META_RUN = ['/meta/generatedAt', '/meta/inputs/*/mtime', '/meta/code/*/mtime'];
const V_CALAUDIT = ['/meta/when', '/fourValues/current/when', '/diagnosticsSplit/carriedOverFrom',
  '/presets/*/run/wallSec', '/presets/*/run/timeBudget/*/wallSec', '/presets/*/run/timeBudget/*/rateStepsPerSec',
  '/presets/*/run/stopRule/wallSec', '/presets/*/run/stopRule/rateStepsPerSec',
  '/presets/*/run/stopRuleStages/*/wallSec', '/presets/*/run/stopRuleStages/*/rateStepsPerSec',
  // 第283便c で dt/8 を常時から外した(明示診断だけ)ので、常時の正本に dtEighth は無い —— Pointer は宣言から外す(統合時)
  ];
/**
 * 第283便e(AN29): calaudit の**非物理の同一性 meta**(`STABLE_META_KEYS` の鍵だけ —— 値の型は QA が照合)。
 * html を 1 字変えて calaudit を走らせ直すと、物理が 1 bit も動かなくても次が変わる(53aaa64 → 8b05232 の実測):
 * 対象 html の sha の写し 4 か所・引用した ❄️ 正本〔charon-w272b〕のファイル sha・分割先 diag の sha(diag の `when` が
 * 変わるため)・分割前後のバイト数(壁時計の桁数で変わる)。`/meta/target` は値が変わらないが、対象の名前は同一性の
 * meta なので同じ群に置く。分割先の中身は随伴ファイルの行で見る(`STABLE_COMPANIONS`)。
 */
export const V_CALAUDIT_META = ['/meta/target', '/meta/targetSha256', '/mergeKey/targetSha256', '/fourValues/current/targetSha256',
  '/kf0Runs/charonCitation/citedTargetSha256', '/kf0Runs/charonCitation/fileSha256',
  '/diagnosticsSplit/sha256', '/diagnosticsSplit/bytes', '/diagnosticsSplit/bytesBeforeSplit', '/diagnosticsSplit/bytesAfterSplit'];
/** 第283便e: 分割先 diag の意味 hash(除くのは生成時刻と持ち越し時刻だけ —— 53aaa64 → 8b05232 の再走で変わった欄の全部)。 */
const V_CALAUDIT_DIAG = ['/when', '/carriedOverFrom'];

/**
 * 第283便e: **随伴ファイル**(ある正本の安定 hash がその sha を除いているとき、中身の変化を別の行で見るファイル)。
 * `stableInputs` が入力の行の次に随伴ファイルの行を足す。
 */
export const STABLE_COMPANIONS = { 'tests/out/calaudit-w249.json': ['tests/out/calaudit-w249-diag.json'] };
export function companionsOf(file) { return (STABLE_COMPANIONS[file] || []).slice(); }

const S = (key, cmd, outs, sec, o) => Object.assign({ key, cmd, outs, sec, secSource: 'w280-chain',
  alwaysRun: false, role: 'current', after: [], env: {}, volatilePaths: {} }, o || {});
// 第283便b: 表の外にあった履歴の器(退役 7 本を名指しする —— 再生成しない・実測の所要なし)
const RH = (key, cmd, outs) => S('h283b-' + key, cmd, outs, 0, { role: 'history', secSource: '履歴(第283便b で登録 —— 走らせない)',
  note: '第283便b(第73報④・R84): 退役の本を名指しする過去の器。**再生成しない**(計画は常に「履歴」)' });

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
  // 第284便f(R94): ① 通常走行は**プリセット分割**(2 分割 —— 重い 4 本は 2 本ずつ別の分割へ)。分割した ①・dt3・kf0 の鎖で作った正本が
  //   直列の鎖の正本(2a4af53)と、物理欄を含めて一致することを第284便f で実測(除外 Pointer・測定コードの sha・壁時計から作る未宣言の欄
  //   〔budgetHit・diag の h4Store の壁時計と時刻〕の外の差 0 —— tests/data-w284f-calsplit.json)。静かな容器で ① 1411 s(各本の壁時計の和 2629 s)。
  //   重い本は 1 段 500〜830 s・壁時計の資源上限 900 s —— **容器が他の走行で混んでいるときは分割しても資源上限に当たりうる**(workers = 分割数)
  S('calaudit', 'node tools/calaudit-split.mjs --k 2 --harness tests/exp-w249b-calaudit.mjs --', ['tests/out/calaudit-w249.json', 'tests/out/calaudit-w249-diag.json'], 3724, { alwaysRun: true, workers: 2,
    volatilePaths: { 'tests/out/calaudit-w249.json': V_CALAUDIT.concat(V_CALAUDIT_META), 'tests/out/calaudit-w249-diag.json': V_CALAUDIT_DIAG } }),
  // 第283便c(原仮定者の裁定(第73報)⑤・統括の検証項目 R86 (ii)(iii)): 常時の dt3 段から `--dt8-registry` を外した(h/8 は明示診断の
  //   入口だけ —— `--dt8-registry` 単独)。dt/4 は前回の正本の同じ契約の h4 を転記する(`--no-h4-reuse` で切る)。
  //   **sec は旧値(第280便の chain の実測 —— dt/8 込み)のまま**:再測定するまで書き換えない(dt/8 の段の和は第282便の正本で 544 s)
  // 第283便e: dt3・kf0 は --merge で calaudit の 2 ファイルを書き戻す(merges —— 読む段はこの 2 段の後に置く)
  // 第284便f(R94): dt3・kf0 は**プリセット分割**(2 分割・tools/calaudit-split.mjs)。直列と分割の正本の同一性は第284便f で実測(dt3 472→313 s・kf0 89→60 s・安定 hash 一致・除外 Pointer の外の差 0)。統合時に第284便c の旗(--h4-exceptions / --kf0-h4-exceptions)と合成した
  // 第284便c(原仮定者の裁定(第74報)⑥・AN33・R93): **dt/4 を常時から外した** —— 3 段は例外の登録簿(tests/lib-w283c-calstages.mjs の
  //   H4_EXCEPTIONS)の main の本だけ(`--h4-exceptions`)。登録表の全本の 3 段は明示診断(`--dt4-registry --merge` 単独 —— 鎖に入れない)。
  //   dt/2 は同一便の再走で転記(H2_REUSE_RULE —— ① 通常走行が直前に同じ html で h/2 を置くので、この段の h/2 は転記になる)。
  //   sec は第284便c の枝の実測(一時ファイルへの同じ段 —— 4 コアを他の枝と共有した容器): dt3 112 s(例外 3 本・h/2 は直前の ① から転記・
  //   h/4 は新規〔契約の版を上げたので初回は再取得〕)/ kf0 171 s(5 本の h・h/2 と ❄️ の h/4 をすべて新規 —— --no-h2-reuse --no-h4-reuse。
  //   同一便の再走で h/2 を転記した走行は 139 s)
  S('dt3', 'node tools/calaudit-split.mjs --k 2 --harness tests/exp-w249b-calaudit.mjs -- --h4-exceptions --merge', [], 112, { alwaysRun: true, after: ['calaudit'], secSource: 'w284c-run',
    merges: ['tests/out/calaudit-w249.json', 'tests/out/calaudit-w249-diag.json'], workers: 2,   // 第284便f: プリセット 2 分割(統合時に c の旗と合成)
    note: '第284便c: h/4 は例外の登録簿の本だけ(--h4-exceptions)・同一契約の h4 は転記・h/2 は同一便の再走で転記。旧 --dt3-registry(登録表の全本)は明示診断 --dt4-registry' }),
  S('kf0', 'node tools/calaudit-split.mjs --k 2 --harness tests/exp-w249b-calaudit.mjs -- --kf0-runs --kf0-only --kf0-h4-exceptions --only jupiterGalilean,venusReal,marsMoonsReal,plutoCharonReal,neptuneReal --merge', ['tests/out/kf0-w259d.json'], 171, { alwaysRun: true, after: ['dt3'], secSource: 'w284c-run',
    merges: ['tests/out/calaudit-w249.json', 'tests/out/calaudit-w249-diag.json'], workers: 2,   // 第284便f: プリセット 2 分割(統合時に c の旗と合成)
    note: '第284便c: kF0 の診断コピーの h/4 は例外の登録簿の kf0 の本(plutoCharonReal)だけ(--kf0-h4-exceptions)。5 本すべての h/4 は明示診断 --kf0-dt3' }),
  S('solarsigma', 'node tests/exp-w262d-solarsigma.mjs', ['tests/out/solarsigma-w262d.json'], 0, { alwaysRun: true, after: ['kf0'] }),
  S('stoprule', 'node tests/exp-w270a-stoprule.mjs', ['tests/out/stoprule-w270a.json'], 0, { alwaysRun: true, after: ['kf0'] }),
  S('issues', 'node tests/exp-w272a-issues.mjs', ['tests/out/issues-w272a.json'], 0, { alwaysRun: true, after: ['kf0', 'solarsigma', 'charon-h', 'charon-h2', 'charon-h4', 'nslock'] }),
  S('assessed', 'node tests/exp-w273c-assessedtable.mjs --check', ['tests/out/assessed-w273c.json'], 1, { alwaysRun: true, after: ['kf0'] }),
  // 第283便e: calaudit-w249.json を読む(meta.inputs)—— 書く段(calaudit・dt3・kf0)の最後の kf0 の後
  S('d0audit', 'node tests/exp-w275b-d0audit.mjs', ['tests/out/d0audit-w275b.json'], 21, { after: ['kf0'] }),
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
  S('nsmode', 'node tests/exp-w278c-nsmode.mjs', ['tests/out/nsmode-w278c.json'], 117, { after: ['nsgrid'] }),   // 第283便e: nsgrid-w277c.json を読む
  S('bgequiv', 'node tests/exp-w278d-bgequiv.mjs', ['tests/out/bgequiv-w278d.json'], 96, { secSource: 'w281a-chain', after: ['bgpredict'],   // 第283便e: bgpredict を読む
    volatilePaths: { 'tests/out/bgequiv-w278d.json': META_RUN.concat(['/elapsedS']) } }),
  S('bgbudget', 'node tests/exp-w277d-bgbudget.mjs', ['tests/out/bgbudget-w277d.json'], 29, { secSource: 'w281a-chain', after: ['bgpredict', 'bgequiv'] }),   // 第283便e
  S('bgcompose', 'node tests/exp-w279c-bgcompose.mjs', ['tests/out/bgcompose-w279c.json'], 2),
  S('bgbudget2', 'node tests/exp-w279c-bgbudget2.mjs', ['tests/out/bgbudget2-w279c.json'], 77, { secSource: 'w281a-chain', after: ['bgpredict', 'bgequiv'],   // 第283便e
    volatilePaths: { 'tests/out/bgbudget2-w279c.json': META_RUN.concat(['/elapsedS']) } }),
  S('sphereKernel', 'node tests/exp-w280b-sphereKernel.mjs', ['tests/out/spherekernel-w280b.json'], 2),
  S('galaxyprof', 'node tests/exp-w274c-galaxyprof.mjs $BASE_HTML beta/index.html', ['tests/out/galaxyprof-w274c.json'], 25, { env: { BASE_HTML: '基点 html(引数)' } }),
  S('needmesh', 'node tests/exp-w274c-needmesh.mjs $BASE_HTML beta/index.html', ['tests/out/needmesh-w274c.json'], 2, { env: { BASE_HTML: '基点 html(引数)' } }),
  S('d68', 'node tests/exp-w280e-d68.mjs', ['tests/out/d68-w280e.json'], 153, { secSource: 'w281a-chain' }),
  // QA の確認順・並列化の実測(統括がフル QA の後に --record —— chain の外。所要は QA 本体に含まれる)
  S('qaorder', 'node tests/exp-w279b-qaorder.mjs --record', ['tests/out/qaorder-w279b.json'], 0, { secSource: 'chain の外(フル QA の後)', outside: true }),
  // 第283便e: cmd は 1 行のシェルでない(部分走行 4 本 + --merge)—— 鎖は「手動の段」として止まる(済み印を置けば進む)
  S('emgrid', 'node tests/exp-w280b-emgrid.mjs(4 部分 + --merge —— 第280便の chain2c と同じ分割)', ['tests/out/emgrid-w280b.json'], 2295, { secSource: 'w281a-chain', node: true, manual: true }),
  // ---- 後段(calaudit と署名の後 —— 読む正本が揃ってから)
  S('kf0ledger-old', 'node tests/exp-w274a-kf0ledger.mjs', ['tests/out/kf0ledger-w274a.json'], 0, { alwaysRun: true, after: ['kf0', 'charon-h', 'charon-h2', 'charon-h4', 'nslockledger', 'galaxydiag', 'calcontract'] }),
  S('kf0ledger', 'node tests/exp-w275a-kf0ledger.mjs', ['tests/out/kf0ledger-w275a.json'], 0, { alwaysRun: true, after: ['kf0', 'charon-h', 'charon-h2', 'charon-h4', 'nslockledger', 'galaxydiag', 'presetaxes', 'calcontract'] }),
  S('charonInput', 'node tests/exp-w280d-charonInput.mjs', ['tests/out/charoninput-w280d.json'], 603, { secSource: 'w281a-chain', after: ['kf0'] }),
  S('geo3', 'node tests/exp-w280c-geo3.mjs', ['tests/out/geo3-w280c.json'], 1016, { secSource: 'w281a-chain', after: ['kf0', 'bgbudget2'],
    env: { W280_BASE: 'beta/_w280_base.html(第280便の基点 d0286cf の beta/index.html —— 項目 g・h の対照)' } }),
  // ---- 第281便 b/c/d の新しい正本(統括が統合時に追記 —— 所要は第281便の統合 chain3 の実測)
  S('galaxychain', 'node tests/exp-w281b-galaxychain.mjs', ['tests/out/galaxychain-w281b.json', 'tests/out/chainledger-w281b.json'], 73, { secSource: 'w281-chain3', node: true,
    volatilePaths: { 'tests/out/galaxychain-w281b.json': META_RUN },   // 第282便 統合: analogy(枝 d)が安定 hash で読む —— 実行時刻だけを除く
    note: '第281便b: 場の契約の一覧・🎋 の連鎖・交換模型の帳簿(chainledger は lib 自身が target —— 同じ器が書く)' }),
  S('rotorledger', 'node tests/exp-w281c-rotorledger.mjs', ['tests/out/rotorledger-w281c.json'], 1, { secSource: 'w281-chain3', node: true,
    note: '第281便c: 条件付き質量台帳・η 対照(html だけを読む・他の正本を読まない)' }),
  // ---- 第282便d(原仮定者の裁定(第72報)⑥・R81): アナロジー便の正本(**galaxychain-w281b.json を読む** —— after に置く。
  //   所要は第282便d の枝の実測 148 秒〔Node 1 本・同じ容器で他の枝と並走〕)
  S('analogy', 'node tests/exp-w282d-analogy.mjs', ['tests/out/analogy-w282d.json'], 148, { secSource: 'w282d-branch', node: true, after: ['galaxychain'],
    note: '第282便d: 場の契約の読み手の再現・中心 spin の応答・🌚 の台帳と回転曲線・🛞 の f=1 台帳(inputs に galaxychain-w281b.json)' }),
  S('strain', 'node tests/exp-w281d-strain.mjs', ['tests/out/strain-w281d.json'], 26, { secSource: 'w281-chain3', node: true, after: ['galaxyproto', 'corefield'],
    note: '第281便d: 2D の渦伸長 0・ひずみ率の診断(inputs に galaxyproto-w276e・corefield-w276d)' }),
  // ---- 第282便a(原仮定者の裁定(第72報)・R77/R78): 較正契約の 3 系統と f=1 の棚卸し(calaudit の後 —— 旧 4 値の区分・門・残差を読む)/
  //   恒星連星 2 本の f=1 移行の前後記録(**履歴** —— 移行は 1 度きり。判定器を --only で 2 回・一時ファイルへ)
  S('calcontract', 'node tests/exp-w282a-calcontract.mjs', ['tests/out/calcontract-w282a.json'], 2, { secSource: 'w282a-branch', after: ['calaudit', 'kf0'],
    note: '第282便a: html の CAL_CONTRACT と内蔵 140 本の宣言・calaudit の旧 4 値の区分を読む(判定は変えない)。kf0ledger 旧/新がこの正本の fEffective を読む' }),
  S('fmigration', 'node tests/exp-w282a-fmigration.mjs', ['tests/out/fmigration-w282a.json'], 391, { role: 'history', secSource: 'w282a-branch', env: { W282A_BASE_REV: '基点(既定 8b05232 —— git show で一時ファイルを作り終了後に削除)' },
    note: '第282便a: ✴️💫 の f=1 移行の前後(基点 8b05232 と移行後の html に判定器を --only --dt3 で 2 回)。**再生成しない**(計画は常に「履歴」)' }),
  // 第284便f: samplestatus は beta/index.html の生成領域と docs/SAMPLE_STATUS を**書く**(outs の外)。html はほぼ全段が読むので、
  //   鎖の中では**単独**で走らせる(exclusive —— ready queue はレーンを全部取り、走行中の段が無いときだけ入れる)
  S('samplestatus', 'node tests/exp-w279a-samplestatus.mjs && node tests/exp-w279a-samplestatus.mjs --check', ['tests/out/samplestatus-w279a.json'], 2, { alwaysRun: true, after: ['kf0', 'charonwin'],
    exclusive: true, touches: ['beta/index.html', 'docs/SAMPLE_STATUS_v1.45.md'] }),
  S('mercury', 'node tests/exp-w280a-mercury.mjs', ['tests/out/mercury-w280a.json'], 284, { secSource: 'w281a-chain', alwaysRun: true, after: ['kf0'] }),
  // ---- 第282便c の新しい正本(html だけを読む・他の正本を読まない —— 所要は器の elapsedS の実測)
  S('dragprofile', 'node tests/exp-w282c-dragprofile.mjs', ['tests/out/dragprofile-w282c.json'], 2, { secSource: 'w282c-run', node: true,
    note: '第282便c: kF0 不感の実測(128 歩 × 2 本)・引きずりプロファイルの純関数の単体試験・診断表(html だけを読む・環境変数なし)' }),
  // ---- 第282便b(第72報 ⑤・R79): geoPN=1 の契約の穴と比較表(水星の正式値を calaudit-w249.json から読む —— calaudit の後)
  // ---- 第283便f(原仮定者の裁定(第72報)⑥・第73報 AN27/AN37・R81): 球状星団アナロジー(💮)の形状の門と対照 5 走行・rayHeavy の lens 除外の
  //   光線の比較(基点 html と今の html —— 内蔵の全本)。他の正本を読まない(galaxychain → analogy の後段に置く)。所要は枝の実測
  S('clusterAnalogy', 'W283F_BASE=beta/_w283_base.html node tests/exp-w283f-cluster.mjs', ['tests/out/cluster-w283f.json'], 658, { secSource: 'w283f-branch', node: true,
    after: ['galaxychain', 'analogy'],
    env: { W283F_BASE: '基点 html(第283便の基点 de9e39b の beta/index.html —— git show で一時ファイルを作り終了後に削除。光線の基点比較 (D)。無ければ (D) を SKIP)' },
    volatilePaths: { 'tests/out/cluster-w283f.json': META_RUN.concat(['/elapsedS', '/runs/*/wallSec', '/runs/*/rateStepsPerSec']) },
    note: '第283便f: 💮 の走行(基準・中心 spin 0・DR なし・N_rep 80/160)と門の判定・台帳・軸比の標本の床・光線(🌚 だけが変わる)・47 Tuc の参照行。'
      + '第284便a から 💮 は凍結写し tests/fixtures/cluster-w283f-preset.json を読む(第283便f の宣言の記録)' }),
  // ---- 第284便a(原仮定者の裁定(第74報)④・R89/R90): 球状星団安定化(💮 の新しい宣言 —— 接触ばね 0・代表粒子の半径・平衡初速・台帳の nTrue/radii)。
  //   門は第283便f のまま(器 exp-w283f の GATES を読む)・代表数 40/80/160 × 個数比 20/10 × 乱数種 3 と対照。前後の「前」に cluster-w283f.json を読む
  //   (clusterAnalogy の後)。子プロセスの並列(W284A_WORKERS・既定 3 —— 結果は並列数に依らない)。所要は枝の実測
  S('clusterStable', 'node tests/exp-w284a-cluster.mjs', ['tests/out/cluster-w284a.json'], 3068, { secSource: 'w284a-branch', node: true,
    after: ['clusterAnalogy'],
    volatilePaths: { 'tests/out/cluster-w284a.json': META_RUN.concat(['/elapsedS', '/runs/*/wallSec', '/runs/*/rateStepsPerSec']) },
    note: '第284便a: 💮 の宣言の照合・E9 の不発火(300 步のビット一致と検出力)・平衡初速の t=0 の量・門の走行 27 本(行列 18・対照 9)・D_A(中心の引きずり支配の目標)・軸比の床' }),
  // 第283便a(原仮定者の裁定(第73報)AN23): geoPN=1 が 1PN の反作用を返すようになり、本器の「本体 = 反作用を返さない旧則」の
  //   前提が消えた —— 正本は旧則の記録として**履歴**へ(再生成しない・計画は常に「履歴」)。新しい契約の実測は geomode(下)
  S('geo1', 'node tests/exp-w282b-geo1.mjs', ['tests/out/geo1-w282b.json'], 1033, { role: 'history', secSource: 'w282b-run', after: ['calaudit', 'kf0'],
    env: { PLAYWRIGHT_CORE_DIR: 'Chromium の Playwright(水星の表と比較表 —— W282B_ENGINE=node なら不要・約 6 倍遅い)' },
    note: '第282便b: 1 歩の表・束縛二体・ブースト・固定源・質量比の走査は Node の vm(本体 + 反作用返しの器の中のコピー)。'
      + '第283便a で**履歴**(geoPN=1 の旧則〔反作用を返さない〕の記録 —— 再生成しない)' }),
  // ---- 第283便a(原仮定者の裁定(2026-09-26 追加)・AN23・R83): geoPN の 2 フラグの導出表・共通化の前後(基点 html と 141 本 × 1/128 歩)・
  //   kF0 走行 37 本の geoPN=1 対 geoPN=2∧kFrame=0・⭐ の前後(html と calaudit のページ側ヘルパだけを読む —— Node だけ・他の正本は読まない)
  // 第285便b(原仮定者の裁定(第75報)⑦・統括の検証項目 R97): kF0 の 1PN が EIH 型(有限質量比の N 体 1PN)になり、本器の (d)
  //   「geoPN=1 は試験粒子形 + 対反作用(Σm·vx=0・近点移動比 1−10ν/3)」と (b) の前後の差(⭐ だけ)の前提が消えた —— 正本は第283便a の
  //   記録として**履歴**へ(再生成しない・計画は常に「履歴」)。新しい kF0 の 1PN の実測は pn1(下)
  S('geomode', 'node tests/exp-w283a-geomode.mjs', ['tests/out/geomode-w283a.json'], 1608, { role: 'history', secSource: 'w283a-branch', node: true,
    env: { W283A_BASE_REV: '基点(既定 de9e39b —— git show で一時ファイルを作り終了後に削除)' },
    volatilePaths: { 'tests/out/geomode-w283a.json': META_RUN.concat(['/elapsedS', '/headless/*/wallSec']) },
    note: '第283便a: 導出表(141 本)・受理器の契約・基点との 1/128 歩のビット比較と署名・kF0 走行 37 本 + 診断コピー 7 本・⭐ の前後'
      + '(1 歩の Σm·vx・束縛二体の近点移動比・本体 6000 步)・☿ と V18。第285便b で**履歴**(kF0 の 1PN が EIH 型へ —— 再生成しない)' }),
  // ---- 第285便b(原仮定者の裁定(第75報)⑦・R97/R98): kF0 1PN 対照便の正本(制御二体の近点移動比・加速度の照合・ラグランジアン・保存量・
  //   kF0 主系列の λ=0/1 対照・水星の ε/dt の分解・geoPN 1/2 の本の前後)。**calaudit-w249.json を読む**(観測の近点移動)—— 書く段の
  //   calaudit・dt3・kf0 の後。所要は第285便b の枝の実測(Node 1 本・他の枝と同じ容器で並走)
  S('pn1', 'node tests/exp-w285b-pn1.mjs', ['tests/out/pn1-w285b.json'], 682, { secSource: 'w285b-branch', node: true, after: ['calaudit', 'dt3', 'kf0'],
    env: { W285B_BASE_REV: '基点(既定 b92ffa1 —— git show で一時ファイルを作り終了後に削除)' },
    volatilePaths: { 'tests/out/pn1-w285b.json': META_RUN.concat(['/elapsedS', '/headless/*/wallSec']) },
    note: '第285便b: kF0 の 1PN(EIH 型)—— 制御二体(R97)・html の Δ と参照実装の照合・Euler–Lagrange・保存量・kF0 主系列の λ=0/1・☄️ の ε/dt・前後' }),
  // ---- 第283便b(原仮定者の裁定(第73報)④・統括の検証項目 R85): 同一天体の家族の差分表と統廃合の候補(html・calaudit の較正母集団・
  //   凍結の写し tests/fixtures/retired-w283b.json を読む —— 1 步も走らせない。所要は第283便b の枝の実測〔Node 1 本・壁時計〕)
  S('families', 'node tests/exp-w283b-families.mjs', ['tests/out/families-w283b.json'], 8, { secSource: 'w283b-branch', node: true, after: ['calaudit', 'dt3', 'kf0'],
    volatilePaths: { 'tests/out/families-w283b.json': META_RUN.concat(['/elapsedS']) },
    note: '第283便b: 家族 21・鍵ごとの差・推定の列・候補(畳まない)・退役 7 本の棚卸し。一覧 docs/FAMILIES_v1.45.md も同じ器が書く(QA docs.families が照合)' }),
  // ---- 第283便b(第73報④・R84): 退役 7 本を名指しする**表の外の器**のうち tests/out に出力が残るもの —— **履歴**として登録する
  //   (再生成しない。退役の本を走らせ直す段を現行の計画に入れない)。退役後も走る器(rotorledger・analogy)は凍結の写しを読む。
  //   凍結の写しそのもの(tests/fixtures/retired-w283b.json —— 器 tests/exp-w283b-retiredfx.mjs が基点 de9e39b から 1 度だけ作る)は
  //   正本ではないので表に載せない(現行の正本の入力なので履歴にもしない)。
  RH('exp-4-67', 'node tests/exp-4-67.mjs', ['tests/out/exp-4-67.json']),
  RH('exp-4-72', 'node tests/exp-4-72.mjs', ['tests/out/exp-4-72.json']),
  RH('exp-4-73', 'node tests/exp-4-73.mjs', ['tests/out/exp-4-73.json']),
  RH('exp-4-75', 'node tests/exp-4-75.mjs', ['tests/out/exp-4-75.json']),
  RH('exp-4-88', 'node tests/exp-4-88.mjs', ['tests/out/exp-4-88.json']),
  RH('exp-coreshell', 'node tests/exp-coreshell.mjs', ['tests/out/coreshell-results.json']),
  RH('exp-coreshell2', 'node tests/exp-coreshell2.mjs', ['tests/out/coreshell2-results.json']),
  RH('exp-coreshell3', 'node tests/exp-coreshell3.mjs', ['tests/out/coreshell3-results.json']),
  RH('exp-coreshell4', 'node tests/exp-coreshell4.mjs', ['tests/out/coreshell4-results.json']),
  RH('exp-coreshell5', 'node tests/exp-coreshell5.mjs', ['tests/out/coreshell5-results.json']),
  RH('exp-coreshell6', 'node tests/exp-coreshell6.mjs', ['tests/out/coreshell6-results.json']),
  RH('exp-coreshell7', 'node tests/exp-coreshell7.mjs', ['tests/out/coreshell7-results.json']),
  RH('exp-coreshell8', 'node tests/exp-coreshell8.mjs', ['tests/out/coreshell8-results.json']),
  RH('exp-coreshell9', 'node tests/exp-coreshell9.mjs', ['tests/out/coreshell9-results.json']),
  RH('exp-coreshell-theory', 'node tests/exp-coreshell-theory.mjs', ['tests/out/coreshell-theory-results.json']),
  RH('exp-darkness', 'node tests/exp-darkness.mjs', ['tests/out/darkness-results.json']),
  RH('exp-darkrotor', 'node tests/exp-darkrotor.mjs', ['tests/out/darkrotor-results.json']),
  RH('exp-factors', 'node tests/exp-factors.mjs', ['tests/out/factors-results.json']),
  RH('exp-ureq', 'node tests/exp-ureq.mjs', ['tests/out/ureq-results.json']),
  RH('seeds', 'node tests/seeds.mjs', ['tests/out/seeds-results.json']),
  RH('exp-w262b-migrate', 'node tests/exp-w262b-migrate.mjs', ['tests/out/w262b-migrate.json']),
  RH('exp-w265d-lfbot', 'node tests/exp-w265d-lfbot.mjs', ['tests/out/lfbot-w265d.json']),
  // ---- 第283便c(第73報 ⑤・R86 (iv)): 重い較正 4 本の粒子数・ms/步・試験粒子契約の検査と判定量の前後(calaudit の後 —— 正本の段別の
  //   壁時計と判定量を読み、判定器を --tp-copy で写しに掛ける —— 一時ファイル)
  // 第284便e(原仮定者の裁定(第74報)AN34): 4 本に試験粒子契約を**宣言して署名**したので、本器の前提(「4 本の宣言は群が相互作用粒子」
  //   —— 写しと並べる (B)(D)・内蔵に宣言 0 本の (C④))が消えた —— 正本は署名前の記録として**履歴**へ(再生成しない・計画は常に「履歴」)。
  //   署名の前後の実測は tpsign(下)
  S('heavy', 'node tests/exp-w283c-heavy.mjs', ['tests/out/heavy-w283c.json'], 368, { role: 'history', secSource: 'w283c-run', after: ['calaudit', 'dt3', 'kf0'],
    env: { PLAYWRIGHT_CORE_DIR: 'Chromium の Playwright(判定器を試験粒子の写しに掛ける (D) —— 残りは Node の vm)' },
    volatilePaths: { 'tests/out/heavy-w283c.json': META_RUN },
    note: '第283便c: 重い 4 本の粒子数・対・質量の内訳・ms/步(全粒子/主要天体だけ/試験粒子の写し)・試験粒子契約の機械検査・判定量の前後。'
      + '第284便e で**履歴**(4 本の署名の前の記録 —— 再生成しない)' }),
  // ---- 第284便e(原仮定者の裁定(第74報)AN34・④・統括の検証項目 R91): 試験粒子契約の署名の前後(基点の calaudit 正本〔git show〕と
  //   いまの calaudit 正本の 4 本 54 量 —— 正本がいまの html の世代でなければ判定器を --only で一時ファイルへ走らせる)/
  //   背景複素決定力 W₀・A₀ の算出表と接続の実測(html だけを読む —— Node だけ・他の正本は読まない)
  S('tpsign', 'node tests/exp-w284e-tpsign.mjs', ['tests/out/tpsign-w284e.json'], 153, { secSource: 'w284e-branch', after: ['calaudit', 'dt3', 'kf0'],
    env: { W284E_BASE_REV: '基点(既定 2a4af53 —— git show で基点の calaudit 正本を一時読み)',
      PLAYWRIGHT_CORE_DIR: 'Chromium の Playwright(正本 calaudit がいまの html の世代でないときだけ —— 判定器を --only で一時ファイルへ。鎖の中では読むだけ)' },
    volatilePaths: { 'tests/out/tpsign-w284e.json': META_RUN.concat(['/elapsedS', '/after/when', '/after/wallSec',
      '/table/presets/*/run/before/wallSec', '/table/presets/*/run/after/wallSec']) },
    note: '第284便e: 🌞💠💍💿 の群を testParticle に署名した前後(量ごとの値・絶対/相対差・区分・門・近点数・壁時計〔機種依存 —— 文書に写さない〕)と '
      + '4 値の差し替え集計。sec は枝の実測(正本が基点の世代で判定器を走らせた —— 鎖の中では正本を読むだけで数秒)' }),
  // 統括(第284便 統合): 段の鍵は表で一意でなければならない —— e の段が第276便a の `bgfield`(bgfield-w276a.json)と同じ鍵で、
  //   ready queue の表(連想配列)で先の段が消え bgfield-w276a.json が刻み直されなかった(ゲート 2 で検出)。`bgfield284` に改名し、--audit に重複の検査を足した
  S('bgfield284', 'node tests/exp-w284e-bgfield.mjs', ['tests/out/bgfield-w284e.json'], 6, { secSource: 'w284e-branch', node: true,
    volatilePaths: { 'tests/out/bgfield-w284e.json': META_RUN.concat(['/elapsedS']) },
    note: '第284便e: p=2 の台帳からの W₀・A₀・∇・∂ₜ の算出(html の dfmComplexMomentsOf と照合)・検算 3 件・4 区分の表・'
      + '💮🌚(share 経路)の未接続と 🔁🌒(meshVelocity)の適用中の実測' }),
  // ---- 第285便a(原仮定者の裁定(第75報)④⑤・統括の検証項目 R95/R96)
  //   contact285: 多粒子の契約 contactMode の単体試験(4 経路・ばねエネルギー・受理)・内蔵 142 本の 1 步(基点 html と —— git show の一時ファイル)・
  //     拘束の反作用の記帳・適用表の前後(基点の宣言をいまのエンジンで)・💍💿 の量ごとの前後(calaudit の正本がいまの html の世代なら読むだけ ——
  //     そうでなければ判定器を --only で一時ファイルへ走らせる〔Chromium〕)。所要は枝の実測(判定器を走らせない場合)
  //   clusterScan: 💮 の宣言の照合(particleRadius・長さ単位・表示半径)・E9 の不発火・第284便a の宣言との力学のビット一致・
  //     走査 36 構成(N_rep 40)と検証(上位 2 + 宣言 × N_rep 320 × 乱数種 3)。子プロセスの並列(W285A_WORKERS・既定 2 —— 結果は並列数に依らない)
  S('contact285', 'node tests/exp-w285a-contact.mjs', ['tests/out/contact-w285a.json'], 282, { secSource: 'w285a-branch', after: ['calaudit', 'dt3', 'kf0'],
    env: { W285A_BASE_REV: '基点(既定 b92ffa1 —— git show で基点 html と基点の calaudit 正本を一時読み)',
      PLAYWRIGHT_CORE_DIR: 'Chromium の Playwright(正本 calaudit がいまの html の世代でないときだけ —— 💍💿 の判定器を --only で一時ファイルへ。鎖の中では読むだけ)' },
    volatilePaths: { 'tests/out/contact-w285a.json': META_RUN.concat(['/elapsedS']) },
    note: '第285便a: contactMode:"none" は E9 の 4 経路を止める(単体試験)・未指定 ≡ normal・fusion/phaseChange 併用の拒否・particleRadius・'
      + '1 步の比較(違う本 ⊆ 宣言した本)・pinned の反作用の記帳・適用表 16 本の前後と normal のまま残す本・💍💿 の量ごとの前後' }),
  S('clusterScan', 'node tests/exp-w285a-cluster.mjs', ['tests/out/cluster-w285a.json'], 4645, { secSource: 'w285a-branch', node: true,
    volatilePaths: { 'tests/out/cluster-w285a.json': META_RUN.concat(['/elapsedS', '/runs/*/wallSec']) },
    note: '第285便a: 💮 の半径の分離(DR 惑星級・恒星は表示比較の仮定・dispMag)・E9 の不発火と検出力・第284便a の宣言との力学のビット一致・'
      + '走査 (a) 半径 bin の診断 → (b) 実効ポテンシャル Φ_eff=Φ̄_E4−½⟨|ū|²⟩ の初期分布 → (c) N_rep 320 × 乱数種 3 の門(門は第283便f のまま)' }),
  // ---- 第285便c(原仮定者の裁定(第75報)⑥・統括の検証項目 R99): 背景場の微分の算出可否と宣言の型 bgModel(html の純関数と受理器だけを読む ——
  //   Node だけ・1 步も走らせない・他の正本は読まない)
  S('bgderiv', 'node tests/exp-w285c-bgderiv.mjs', ['tests/out/bgderiv-w285c.json'], 1, { secSource: 'w285c-branch', node: true,
    volatilePaths: { 'tests/out/bgderiv-w285c.json': META_RUN.concat(['/elapsedS']) },
    note: '第285便c: 同じ (W₀,A₀) で微分が違う反例・一様凍結の宣言(微分は宣言による 0)・背景源の台帳からの全項・遠方 1 源の閉じた式の一致・'
      + '単位の指数・無限一様の発散・判定表・受理器の事例' }),
];

/**
 * 表の外で作られる JSON 入力の除外 Pointer(第282便e —— 領域を宣言した器が安定 hash を刻む入力のうち、
 * 再生成表の段が書かないもの)。
 */
export const EXTERNAL_VOLATILE = {
  'tests/out/analogy-w265a.json': ['/meta/when', '/meta/inputs/*/mtime', '/meta/spentSec'],
  'tests/out/kjoint2-w265a.json': ['/meta/spentSec'],
  'tests/out/obscal-results.json': ['/manifest/generatedAt'],
  // 第283便b: 退役 7 本の凍結の写し(書き換えない fixture —— 除く欄は無い。現行の正本 rotorledger・analogy・families・samplestatus の入力)
  'tests/fixtures/retired-w283b.json': [],
  // 第284便b(原仮定者の裁定(第74報)⑤・AN35): 退役 6 本と ⚡ の旧則(f≈2)の凍結の写し(書き換えない fixture —— 現行の正本 families・samplestatus の入力)
  'tests/fixtures/retired-w284b.json': [],
  // 第285便a(原仮定者の裁定(第75報)⑤・R96): 第284便a の 💮 の宣言の凍結の写し(書き換えない fixture —— 現行の正本 cluster-w284a・cluster-w285a の入力)
  'tests/fixtures/cluster-w284a-preset.json': [],
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

/**
 * 第284便c(原仮定者の裁定(第74報)AN43): **刻印の安定 hash の宣言が今の宣言と違うか**(入力 `file` の行と、その随伴ファイルの行)。
 * 違いの理由の並びを返す(空 = 一致・刻印の行が無い入力は検査しない —— 安定 hash を刻まない器は sha で縛られている)。
 *   ・方式の版(`stableVersion`)が今の `STABLE_VERSION` でない(版なしの旧方式を含む)
 *   ・刻印の Pointer の並び ≠ 今の宣言(`volatileOf(file)` —— 再生成表の段の volatilePaths ∪ 表の外の宣言)
 *   ・今の宣言が随伴ファイルを持つのに随伴の行が無い / 随伴の行の版・Pointer が今の宣言と違う
 * @param {Array} inputsStable 正本の meta.inputsStable
 * @param {string} file 入力の相対パス
 * @param {(f:string)=>string[]} [volatileOf] 既定は `volatilePathsOf`
 */
export function stampedDeclDrift(inputsStable, file, volatileOf) {
  const volOf = volatileOf || volatilePathsOf;
  const rows = inputsStable || [];
  const st = rows.find((z) => z.file === file && z.companionOf === undefined) || null;
  if (!st) return [];
  const out = [];
  const chk = (row, f, label) => {
    if (row.stableVersion !== STABLE_VERSION) out.push(label + 'の方式の版 ' + String(row.stableVersion) + ' ≠ ' + STABLE_VERSION);
    const got = (row.volatilePaths || []).slice().sort(), cur = volOf(f).slice().sort();
    if (JSON.stringify(got) !== JSON.stringify(cur)) {
      const add = cur.filter((z) => !got.includes(z)), del = got.filter((z) => !cur.includes(z));
      out.push(label + 'の Pointer ≠ 今の宣言(' + (add.length ? '今だけ ' + add.slice(0, 2).join(',') + (add.length > 2 ? ` 他 ${add.length - 2}` : '') : '')
        + (add.length && del.length ? '・' : '') + (del.length ? '刻印だけ ' + del.slice(0, 2).join(',') + (del.length > 2 ? ` 他 ${del.length - 2}` : '') : '') + ')');
    }
  };
  chk(st, file, '刻印');
  for (const c of companionsOf(file)) {
    const r = rows.find((z) => z.file === c) || null;
    if (!r) { out.push('随伴 ' + c + ' の行が無い'); continue; }
    chk(r, c, '随伴 ' + c.replace('tests/out/', '') + ' ');
  }
  return out;
}
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
  // 第284便c: 表と宣言を差し替えられる(AN43 の自己試験 `an43Probe` —— 既定は本表)
  const STEPS = o.steps || REGEN_STEPS;
  const volOf = o.volatileOf || volatilePathsOf;
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
  // 第283便e: 入力の依存は**書く段のすべて**(outs + merges —— dt3・kf0 は calaudit を書き戻す)
  const producer = writersMap(STEPS);
  const rows = new Map();
  for (const st of STEPS) {
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
      for (const inp of (m.inputs || [])) for (const p of (producer.get(inp.file) || [])) if (p !== st.key) deps.add(p);
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
      // 第284便f(原仮定者の裁定(第74報)AN43): **刻印の Pointer ≠ 今の宣言 → regen**(第283便は刻印の Pointer で照合して再利用し、
      //   宣言を足した後も古い Pointer の刻印が残った —— 刻み直すまで「今の宣言で同じ」かは分からない)
      for (const z of (m.inputsStable || [])) {
        if (z.stableVersion !== STABLE_VERSION) continue;
        const got = JSON.stringify((z.volatilePaths || []).slice().sort()), cur = JSON.stringify(volOf(z.file));   // 統括(第284便 統合): 自己試験の差し替え宣言(volOf)を読む
        if (got !== cur) { why.push(out + ': 入力 ' + z.file + ' の刻印の Pointer が今の宣言と違う'); cause('刻印の Pointer ≠ 今の宣言: ' + z.file); }
      }
      // 入力
      for (const inp of (m.inputs || [])) {
        if (inp.missing || !inp.sha256 || inp.file === t) continue;
        // 第284便c(AN43): 刻印の安定 hash の宣言(Pointer・方式の版 —— 随伴の行も)が今の宣言と違えば、**バイト sha が同じでも** regen
        const drift = stampedDeclDrift(m.inputsStable, inp.file, volOf);
        if (drift.length) { why.push(out + ': 入力 ' + inp.file + ' の安定 hash の刻印が今の宣言と違う(' + drift.join(' / ') + ')'); cause('安定 hash の宣言: ' + inp.file + '(' + drift[0] + ')'); continue; }
        if (shaFile(abs(inp.file)) === inp.sha256) continue;
        const st2 = (m.inputsStable || []).find((z) => z.file === inp.file);
        if (st2 && stableInputOk(root, m.inputsStable, inp.file)) continue;   // 第282便e: 刻印の版で照合(第283便e: 随伴の行も)
        why.push(out + ': 入力 ' + inp.file + ' が変わった');
        cause('入力: ' + inp.file + (st2 ? '(安定 hash も違う)' : ''));
      }
      // inputs[] に載らない読み込み(❄️ 対照系列の calaudit・nslock の kjoint2 —— 安定 hash だけを刻んだ入力)
      const listed = new Set((m.inputs || []).map((z) => z.file));
      for (const st2 of (m.inputsStable || [])) {
        if (listed.has(st2.file)) continue;
        for (const p of (producer.get(st2.file) || [])) if (p !== st.key) deps.add(p);
        // 第284便c(AN43): 刻印の宣言 ≠ 今の宣言 → regen(随伴の行は親の行の検査で見る)
        if (st2.companionOf === undefined) {
          const drift = stampedDeclDrift(m.inputsStable, st2.file, volOf);
          if (drift.length) { why.push(out + ': 入力 ' + st2.file + ' の安定 hash の刻印が今の宣言と違う(' + drift.join(' / ') + ')'); cause('安定 hash の宣言: ' + st2.file + '(' + drift[0] + ')'); continue; }
        }
        if (!stableMatches(root, st2)) { why.push(out + ': 入力 ' + st2.file + ' の中身(安定 hash)が変わった'); cause('入力: ' + st2.file + '(安定 hash)'); }
      }
    }
    row.deps = [...deps].filter((d) => STEPS.some((z) => z.key === d));
    if (st.alwaysRun) { row.status = 'always'; row.reasons = ['常時群'].concat(why); }
    else if (why.length) { row.status = 'regen'; row.reasons = why; }
    else row.status = 'reuse';
    // 第283便e: 依存の伝播の前の**自分の判定**(鎖の --gate が上流の走行後に引き直す値)
    row.ownStatus = row.status;
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
  for (const st of STEPS) {
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
  for (const st of STEPS) visit(st.key, new Set());
  const list = order.map((k) => rows.get(k));
  // 第282便e: 「どの入力・式・受理規則で無効化されたか」の 1 列(文字列)
  for (const r of list) {
    if (r.ownStatus === undefined) r.ownStatus = r.status;
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

// ======================================================================================================
// 第283便e(原仮定者の裁定(第73報)⑤・統括の検証項目 R88): **鎖の機械生成**と**順序の照合**(純関数 —— 走らせない)
// ======================================================================================================

/** 段が書くファイル(outs + merges)。 */
export function writesOf(st) { return [...new Set((st.outs || []).concat(st.merges || []))]; }

/** ファイル → 書く段の key の並び(表の順・履歴の段も含む)。 */
export function writersMap(steps) {
  const m = new Map();
  for (const st of (steps || REGEN_STEPS)) for (const f of writesOf(st)) { if (!m.has(f)) m.set(f, []); m.get(f).push(st.key); }
  return m;
}

/** 表の after の推移閉包(key → Set)。 */
export function afterClosure(steps) {
  const S0 = steps || REGEN_STEPS;
  const by = new Map(S0.map((z) => [z.key, z]));
  const memo = new Map();
  const go = (k, stack) => {
    if (memo.has(k)) return memo.get(k);
    const out = new Set();
    if (stack.has(k)) return out;
    stack.add(k);
    for (const d of ((by.get(k) || {}).after || [])) { out.add(d); for (const x of go(d, stack)) out.add(x); }
    stack.delete(k);
    memo.set(k, out);
    return out;
  };
  const res = new Map();
  for (const z of S0) res.set(z.key, go(z.key, new Set()));
  return res;
}

const readMetaAt = (root, f) => { try { return (JSON.parse(fs.readFileSync(root.replace(/\/$/, '') + '/' + f, 'utf8')) || {}).meta || null; } catch { return null; } };

/**
 * 表の依存(key → Set(直接の依存))= after ∪(root を渡したとき)正本の meta.inputs[]・inputsStable[] のファイルを**書く段のすべて**。
 * 履歴の段は依存に入れない(履歴は再生成しない)。
 * @param {{root?:string, steps?:Array, metaOf?:(file)=>object|null}} [o]
 */
export function tableDeps(o) {
  const opt = o || {};
  const steps = opt.steps || REGEN_STEPS;
  const cur = new Set(steps.filter((z) => z.role !== 'history').map((z) => z.key));
  const W = writersMap(steps);
  const metaOf = opt.metaOf || (opt.root ? (f) => readMetaAt(opt.root, f) : null);
  const deps = new Map();
  for (const st of steps) {
    if (st.role === 'history') continue;
    const d = new Set((st.after || []).filter((k) => cur.has(k)));
    if (metaOf) for (const out of (st.outs || [])) {
      const m = metaOf(out);
      if (!m) continue;
      for (const z of [...(m.inputs || []), ...(m.inputsStable || [])]) for (const w of (W.get(z.file) || [])) if (w !== st.key && cur.has(w)) d.add(w);
    }
    deps.set(st.key, d);
  }
  return deps;
}

/**
 * **表の依存の完全性**(第282便の順序不整合を表から検出する):
 *   ① 正本の入力(meta.inputs[]・inputsStable[])を書く現行の段が、読む段の **after の推移閉包**に入っている
 *      (入っていないと、手で書いた鎖が入力より先に走らせても表からは分からない)
 *   ② 同じファイルを書く現行の段どうしが after の推移閉包で**全順序**になっている(並列に書かない)
 *   ③ after に循環が無い・after の名前が表にある
 * @param {{root?:string, steps?:Array, metaOf?:Function}} o
 * @returns {{ok:boolean, missing:Array<{key,file,writer}>, unordered:Array<{file,a,b}>, cycles:string[], unknown:string[]}}
 */
export function tableDepsAudit(o) {
  const opt = o || {};
  const steps = opt.steps || REGEN_STEPS;
  const keys = new Set(steps.map((z) => z.key));
  const cur = new Set(steps.filter((z) => z.role !== 'history').map((z) => z.key));
  const C = afterClosure(steps);
  const W = writersMap(steps);
  const metaOf = opt.metaOf || (opt.root ? (f) => readMetaAt(opt.root, f) : null);
  const missing = [], unordered = [], cycles = [], unknown = [];
  for (const st of steps) {
    for (const a of (st.after || [])) if (!keys.has(a)) unknown.push(st.key + '→' + a);
    if (C.get(st.key).has(st.key)) cycles.push(st.key);
    if (st.role === 'history' || !metaOf) continue;
    const seen = new Set();
    for (const out of (st.outs || [])) {
      const m = metaOf(out);
      if (!m) continue;
      for (const z of [...(m.inputs || []), ...(m.inputsStable || [])]) for (const w of (W.get(z.file) || [])) {
        if (w === st.key || !cur.has(w) || C.get(st.key).has(w) || seen.has(w + '|' + z.file)) continue;
        // 自分も同じファイルを書く段(kf0 が calaudit を読み書きする)は「書く段の順序」②で見る
        if (writesOf(st).includes(z.file)) continue;
        seen.add(w + '|' + z.file);
        missing.push({ key: st.key, file: z.file, writer: w });
      }
    }
  }
  for (const [f, ws] of W) {
    const c = ws.filter((k) => cur.has(k));
    for (let i = 0; i < c.length; i++) for (let j = i + 1; j < c.length; j++) {
      const a = c[i], b = c[j];
      if (!C.get(a).has(b) && !C.get(b).has(a)) unordered.push({ file: f, a, b });
    }
  }
  // 統括(第284便 統合): 段の鍵の重複(後の定義が先の定義を黙って消す —— 第284便e の bgfield)
  const seen = new Set(), dupKeys = [];
  for (const st of steps) { if (seen.has(st.key)) dupKeys.push(st.key); seen.add(st.key); }
  return { ok: !missing.length && !unordered.length && !cycles.length && !unknown.length && !dupKeys.length, missing, unordered, cycles, unknown, dupKeys };
}

/** 依存の推移閉包(key → Set(上流すべて))と逆向き(key → Set(下流すべて))。 */
function closures(deps) {
  const up = new Map();
  const go = (k, stack) => {
    if (up.has(k)) return up.get(k);
    const s = new Set();
    if (stack.has(k)) return s;
    stack.add(k);
    for (const d of (deps.get(k) || [])) { s.add(d); for (const x of go(d, stack)) s.add(x); }
    stack.delete(k);
    up.set(k, s);
    return s;
  };
  for (const k of deps.keys()) go(k, new Set());
  const down = new Map([...deps.keys()].map((k) => [k, new Set()]));
  for (const [k, s] of up) for (const d of s) { if (!down.has(d)) down.set(d, new Set()); down.get(d).add(k); }
  return { up, down };
}

/**
 * **実際に走った列の照合**(第282便の統合で起きた型を検出する)。
 *   order   … 段 s の依存 d(推移)が列にあり、d の最後の走行より後に s が 1 度も無い(s は古い入力で終わった)。
 *             s が列に無いときは downstream に分ける。
 *   downstream … 段 d が走ったのに、その下流 s(推移・現行の段)が列に 1 度も無い(依存の閉包で再判定していない)。
 *   wasted  … s が依存 d より先に走り、d の後にもう 1 度走った(入力より先の走行は無駄になった)。
 * 列の要素は段の key(同じ key が何度出てもよい —— 再判定〔gate〕で再利用と決めた段も「列にある」に数える)。
 * @param {string[]} seq
 * @param {{deps?:Map, root?:string, steps?:Array}} [o]
 */
export function checkOrder(seq, o) {
  const opt = o || {};
  const deps = opt.deps || tableDeps({ root: opt.root, steps: opt.steps });
  const { up, down } = closures(deps);
  const first = new Map(), last = new Map(), all = new Map();
  seq.forEach((k, i) => { if (!first.has(k)) first.set(k, i); last.set(k, i); if (!all.has(k)) all.set(k, []); all.get(k).push(i); });
  const order = [], wasted = [], downstream = [];
  for (const [s, idx] of all) {
    for (const d of (up.get(s) || [])) {
      if (!last.has(d)) continue;
      const ld = last.get(d);
      const after = idx.some((i) => i > ld);
      if (!after) order.push({ step: s, dep: d, stepAt: last.get(s), depAt: ld });
      else if (idx.some((i) => i < ld)) wasted.push({ step: s, dep: d });
    }
  }
  const ran = new Set(seq);
  for (const d of ran) for (const s of (down.get(d) || [])) if (!ran.has(s)) downstream.push({ step: s, dep: d });
  const uniq = (arr, f) => [...new Map(arr.map((z) => [f(z), z])).values()];
  return { ok: !order.length && !downstream.length, order: uniq(order, (z) => z.step + '<' + z.dep),
    wasted: uniq(wasted, (z) => z.step + '<' + z.dep), downstream: uniq(downstream, (z) => z.step), n: seq.length };
}

/**
 * 計画 → **鎖**(依存順の波)。
 *   run    … 計画で regen / always(onlyIfScopeChanged の段は計画の判定のまま)
 *   gate   … 計画で recheck、または依存の閉包(run/gate の下流すべて)で入った段 —— 上流が走った後に**自分の判定**
 *             (`ownStatus`: 対象・コード・入力〔安定 hash〕)を引き直し、reuse なら走らせない
 *   manual … 表の cmd が 1 行のシェルでない段(emgrid)—— 済み印が無ければ鎖はそこで止まる
 *   履歴・chain の外(qaorder)・reuse で閉包にも入らない段は鎖に入れない。
 * 波 = 鎖に入った段どうしの依存の最長路の段数。波の中は互いに独立(並列にしてよい)。
 * @param {object} plan planRegen の戻り(steps[].status・key)
 * @param {{deps?:Map, root?:string, steps?:Array, noGate?:boolean}} [o]
 */
export function buildChain(plan, o) {
  const opt = o || {};
  const steps = opt.steps || REGEN_STEPS;
  const by = new Map(steps.map((z) => [z.key, z]));
  const deps = opt.deps || tableDeps({ root: opt.root, steps });
  const { down } = closures(deps);
  const status = new Map((plan.steps || []).map((r) => [r.key, r.status]));
  const mode = new Map();
  for (const st of steps) {
    if (st.role === 'history' || st.outside) continue;
    const s = status.get(st.key);
    if (s === 'regen' || s === 'always') mode.set(st.key, st.manual ? 'manual' : 'run');
    else if (s === 'recheck') mode.set(st.key, st.manual ? 'manual' : (opt.noGate ? 'run' : 'gate'));
  }
  // 依存の閉包: 鎖に入った段の下流はすべて鎖に入る(上流の後に置いて判定を引き直す)
  for (const k of [...mode.keys()]) for (const d of (down.get(k) || [])) {
    const st = by.get(d);
    if (!st || st.role === 'history' || st.outside || mode.has(d)) continue;
    mode.set(d, st.manual ? 'manual' : (opt.noGate ? 'run' : 'gate'));
  }
  // 第283便 統合: **同じファイルへ段階的に書く段**(charon の h → h2 → h4 —— 上流が同じ outs を書き直す)は、上流が鎖に入ったら
  //   再判定(gate)で再利用してはいけない(上流が書き直したファイルに自分の列が無くなる)。上流が run/gate なら自分も run。
  for (let changed = true; changed;) {
    changed = false;
    for (const [k, m] of mode) {
      if (m !== 'gate') continue;
      const st = by.get(k); const mine = writesOf(st);
      const up = [...(deps.get(k) || [])].filter((d) => mode.get(d) === 'run' && writesOf(by.get(d)).some((f) => mine.includes(f)));
      if (up.length) { mode.set(k, 'run'); changed = true; }
    }
  }
  // 波(依存の最長路)
  const level = new Map();
  const lv = (k, stack) => {
    if (level.has(k)) return level.get(k);
    if (stack.has(k)) throw new Error('依存の循環: ' + [...stack, k].join(' → '));
    stack.add(k);
    let L = 0;
    for (const d of (deps.get(k) || [])) if (mode.has(d)) L = Math.max(L, lv(d, stack) + 1);
    stack.delete(k);
    level.set(k, L);
    return L;
  };
  for (const k of mode.keys()) lv(k, new Set());
  const nW = mode.size ? Math.max(...level.values()) + 1 : 0;
  const tableIdx = new Map(steps.map((z, i) => [z.key, i]));
  const waves = [];
  for (let w = 0; w < nW; w++) waves.push([...mode.keys()].filter((k) => level.get(k) === w).sort((a, b) => tableIdx.get(a) - tableIdx.get(b)));
  const rows = {};
  for (const [k, m] of mode) {
    const st = by.get(k);
    const mine = writesOf(st);
    rows[k] = { key: k, mode: m, wave: level.get(k), cmd: st.cmd, env: st.env || {}, sec: st.sec || 0,
      deps: [...(deps.get(k) || [])].filter((d) => mode.has(d)), plan: status.get(k) || null,
      // 第284便f: 書くファイル(排他の鍵)・worker 数(分割して走る段は分割数)
      writes: mine, workers: st.exclusive ? 'all' : Math.max(1, st.workers || 1),
      // 第283便 統合: 同じファイルを書く上流(鎖の中)—— gate_step は、これが実際に走った(済み印が run)なら再利用せず走る
      sameFileUps: [...(deps.get(k) || [])].filter((d) => mode.has(d) && writesOf(by.get(d)).some((f) => mine.includes(f))) };
  }
  const skipped = steps.filter((z) => !mode.has(z.key)).map((z) => ({ key: z.key,
    why: z.role === 'history' ? '履歴' : z.outside ? 'chain の外' : (status.get(z.key) || '計画に無い') }));
  // 第284便f: 済み印の契約(code/input/policy —— 鎖の生成時に決まる値)と ready queue の優先度(臨界路)
  const ct = chainContracts(rows, { by, root: opt.root || null, htmlSha: plan.htmlSha256 || null });
  for (const k of Object.keys(rows)) rows[k].contract = ct.get(k);
  const priority = chainPriority({ steps: rows }, tableIdx);
  return { version: REGEN_TABLE_VERSION, contractVersion: CHAIN_CONTRACT_VERSION, waves, priority, steps: rows, skipped,
    count: { run: [...mode.values()].filter((m) => m === 'run').length, gate: [...mode.values()].filter((m) => m === 'gate').length,
      manual: [...mode.values()].filter((m) => m === 'manual').length },
    secRun: [...mode].filter(([, m]) => m === 'run').reduce((a, [k]) => a + (rows[k].sec || 0), 0),
    secGate: [...mode].filter(([, m]) => m === 'gate').reduce((a, [k]) => a + (rows[k].sec || 0), 0) };
}

/** 鎖を波の順に平らにした列(checkOrder の自己試験用 —— 波の中は表の順)。 */
export function chainSequence(chain) { return chain.waves.flat(); }

/** 波の中の段をレーンへ(所要秒の大きい順に、いちばん空いたレーンへ —— LPT)。 */
export function laneSplit(keys, secOf, lanes) {
  const n = Math.max(1, Math.min(lanes || 1, keys.length));
  const L = Array.from({ length: n }, () => ({ sec: 0, keys: [] }));
  for (const k of keys.slice().sort((a, b) => (secOf(b) - secOf(a)) || (a < b ? -1 : 1))) {
    const t = L.reduce((m, x) => (x.sec < m.sec ? x : m), L[0]);
    t.keys.push(k); t.sec += secOf(k);
  }
  return L.filter((x) => x.keys.length);
}

const shq = (t) => "'" + String(t).replace(/'/g, "'\\''") + "'";

// ======================================================================================================
// 第284便f(原仮定者の裁定(第74報)⑥「まだ時間が長いので改善する・並列実行を検討する」・統括の検証項目 R94):
//   **ready queue**(波全体の完了を待たず、依存が済んだ段から空きレーンへ)・**書込排他**(書くファイル〔outs + merges〕が
//   重なる段を同時に走らせない)・**共有 worker 予算**(段の `workers` —— 分割して走る段は分割数ぶんのレーンを取る)・
//   **済み印の契約**(`done/<段>.done` に code/input/policy の hash —— 同じ契約の済み印だけを済みと見なす)。
// ======================================================================================================

/** 段の cmd に出る器と、段の正本の meta.code[] のファイル(済み印の契約の code)。 */
export function codeFilesOf(st, root) {
  const set = new Set();
  for (const m of String(st.cmd || '').matchAll(/\b(?:tests|tools)\/[\w.-]+\.mjs\b/g)) set.add(m[0]);
  if (root) for (const out of (st.outs || [])) { const m = readMetaAt(root, out); for (const c of ((m && m.code) || [])) if (c && c.file) set.add(c.file); }
  return [...set].sort();
}
const sha256Hex = (s) => crypto.createHash('sha256').update(s).digest('hex');

/**
 * 済み印の契約(鎖の生成時に決まる値だけ —— 走行中に変わる入力の中身は入れない):
 *   policy … 表の版・段・mode(run/gate/manual)・cmd・env の名前・書くファイル・workers
 *   code   … codeFilesOf の各ファイルの現行 sha256(root が無ければ名前だけ)
 *   input  … 計画の対象 html の sha256 と、**鎖の中の直接の上流の契約**(上流の契約が変われば下流の済み印も無効 —— Merkle)
 * @returns {Map<string,string>} 段 → 64 桁
 */
export function chainContracts(rows, o) {
  const opt = o || {};
  const memo = new Map();
  const go = (k, stack) => {
    if (memo.has(k)) return memo.get(k);
    if (stack.has(k)) throw new Error('依存の循環: ' + k);
    stack.add(k);
    const r = rows[k];
    const st = opt.by ? opt.by.get(k) : null;
    const code = st ? codeFilesOf(st, opt.root).map((f) => [f, opt.root ? shaFile(opt.root.replace(/\/$/, '') + '/' + f) : null]) : [];
    const ups = (r.deps || []).slice().sort().map((d) => [d, go(d, stack)]);
    const c = sha256Hex(JSON.stringify({ v: REGEN_TABLE_VERSION, contract: CHAIN_CONTRACT_VERSION,
      policy: { key: k, mode: r.mode, cmd: r.cmd, env: Object.keys(r.env || {}).sort(), writes: (r.writes || []).slice().sort(), workers: r.workers || 1 },
      code, input: { html: opt.htmlSha || null, ups } }));
    stack.delete(k);
    memo.set(k, c);
    return c;
  };
  for (const k of Object.keys(rows)) go(k, new Set());
  return memo;
}
export const CHAIN_CONTRACT_VERSION = 'w284f-chaincontract-1';

/** 優先度: 自分から下流の端までの実測秒の最長路(臨界路)の長い順 → 表の順。 */
export function chainPriority(chain, tableIdx) {
  const rows = chain.steps;
  const down = new Map(Object.keys(rows).map((k) => [k, []]));
  for (const [k, r] of Object.entries(rows)) for (const d of (r.deps || [])) if (down.has(d)) down.get(d).push(k);
  const memo = new Map();
  const cp = (k) => { if (memo.has(k)) return memo.get(k); const v = (rows[k].sec || 0) + Math.max(0, ...down.get(k).map(cp)); memo.set(k, v); return v; };
  const idx = tableIdx || new Map(Object.keys(rows).map((k, i) => [k, i]));
  return Object.keys(rows).sort((a, b) => (cp(b) - cp(a)) || ((idx.get(a) ?? 0) - (idx.get(b) ?? 0)));
}

/**
 * ready queue の模擬(離散事象 —— 生成するシェルのランナーと同じ規則): 依存(鎖の中)がすべて済み・書くファイルが走行中の段と
 * 重ならない・worker の空き(レーン)がある段を、優先度の順に入れる。所要は表の実測秒(**見積り**・0 秒の段は 0)。
 * @param {object} chain buildChain の戻り
 * @param {{lanes?:number, secOf?:(k)=>number}} [o]
 * @returns {{makespan:number, events:Array<{key,start,end,workers}>, check:object}}
 */
export function simulateReadyQueue(chain, o) {
  const opt = o || {};
  const lanes = opt.lanes || 4;
  const rows = chain.steps;
  const secOf = opt.secOf || ((k) => rows[k].sec || 0);
  const pri = chain.priority || chainPriority(chain);
  const state = new Map(pri.map((k) => [k, 'pending']));
  const running = [];
  const lock = new Map();
  const events = [];
  let t = 0, free = lanes;
  for (let guard = 0; guard < 100000; guard++) {
    for (const k of pri) {
      if (state.get(k) !== 'pending') continue;
      const r = rows[k];
      if (!(r.deps || []).every((d) => state.get(d) === 'ok' || !state.has(d))) continue;
      if ((r.writes || []).some((f) => lock.has(f))) continue;
      const need = r.workers === 'all' ? lanes : Math.min(r.workers || 1, lanes);
      if (need > free) continue;
      free -= need; for (const f of (r.writes || [])) lock.set(f, k);
      state.set(k, 'running');
      const ev = { key: k, start: t, end: t + secOf(k), workers: need };
      running.push(ev); events.push(ev);
    }
    if (!running.length) break;
    running.sort((a, b) => a.end - b.end);
    const ev = running.shift();
    t = ev.end;
    free += ev.workers; for (const f of (rows[ev.key].writes || [])) if (lock.get(f) === ev.key) lock.delete(f);
    state.set(ev.key, 'ok');
  }
  const check = checkTimeline(events, { rows, lanes });
  return { makespan: events.reduce((m, e) => Math.max(m, e.end), 0), events, pending: [...state].filter(([, s]) => s !== 'ok').map(([k]) => k), check };
}

/** 波の型(第283便e —— 波ごとに全段の完了を待つ・波の中は LPT)の見積り: 波ごとの最大レーンの秒の和。 */
export function waveMakespan(chain, lanes, secOf) {
  const so = secOf || ((k) => (chain.steps[k] || {}).sec || 0);
  return chain.waves.reduce((a, keys) => a + Math.max(0, ...laneSplit(keys, so, lanes || 4).map((l) => l.sec)), 0);
}

/**
 * 走行の時系列の照合(模擬と実際の走行の両方): events = [{key, start, end, workers?}](同じ段が複数回あってよい)。
 *   order  … 依存 d(rows[k].deps —— 鎖の中の直接の上流。推移は直接の辺の連鎖で守られる)の**最後の end より前**に k が start した
 *   writes … 書くファイルが重なる 2 段の走行区間が重なった
 *   budget … 同時に走った worker の和がレーンを超えた
 * @param {Array} events
 * @param {{rows:object, lanes:number}} o
 */
export function checkTimeline(events, o) {
  const rows = o.rows || {};
  const order = [], writes = [], budget = [];
  const byKey = new Map();
  for (const e of events) { if (!byKey.has(e.key)) byKey.set(e.key, []); byKey.get(e.key).push(e); }
  for (const e of events) for (const d of ((rows[e.key] || {}).deps || [])) {
    const runs = byKey.get(d) || [];
    if (!runs.length) continue;
    const lastEnd = Math.max(...runs.map((z) => z.end));
    if (e.start < lastEnd - 1e-9) order.push({ step: e.key, dep: d, start: e.start, depEnd: lastEnd });
  }
  for (let i = 0; i < events.length; i++) for (let j = i + 1; j < events.length; j++) {
    const a = events[i], b = events[j];
    if (a.key === b.key) continue;
    const wa = (rows[a.key] || {}).writes || [], wb = (rows[b.key] || {}).writes || [];
    const f = wa.find((x) => wb.includes(x));
    if (f && a.start < b.end - 1e-9 && b.start < a.end - 1e-9) writes.push({ a: a.key, b: b.key, file: f });
  }
  const pts = [...new Set(events.flatMap((e) => [e.start]))];
  for (const t of pts) {
    const wOf = (e) => { const d = (rows[e.key] || {}).workers; return e.workers || (d === 'all' ? (o.lanes || 4) : Math.min(d || 1, o.lanes || 4)); };
    const w = events.filter((e) => e.start <= t + 1e-9 && t < e.end - 1e-9).reduce((s, e) => s + wOf(e), 0);
    if (w > (o.lanes || 4)) budget.push({ t, workers: w });
  }
  return { ok: !order.length && !writes.length && !budget.length, order, writes, budget };
}

/** `$REGEN_LOG/timeline.txt` → events(start/end の対)と lanes。 */
export function parseTimeline(text) {
  const open = new Map(), events = [];
  let lanes = null;
  for (const line of String(text).split(/\r?\n/)) {
    const m = line.match(/^# ready-queue .* lanes=(\d+)/); if (m) { lanes = Number(m[1]); continue; }
    const s = line.split(/\s+/);
    if (s[0] === 'start') open.set(s[1], { key: s[1], start: Number(s[2]), workers: Number(s[3]) || undefined });
    else if (s[0] === 'end' && open.has(s[1])) { const e = open.get(s[1]); open.delete(s[1]); e.rc = Number(s[2]); e.end = Number(s[3]); events.push(e); }
  }
  for (const e of open.values()) { e.end = Infinity; events.push(e); }
  events.sort((a, b) => a.start - b.start);
  return { events, lanes };
}

/**
 * 鎖 → bash(**走らせない** —— 文字列を返す)。第284便f で **ready queue** に替えた(第283便e の波は `wave` の番号とログ名だけに残る)。
 *   ・段は優先度(臨界路の長い順)に並べ、依存(鎖の中)の済んだ段から、書くファイルが走行中の段と重ならず worker の空きがあるものを
 *     空きレーン(≤ REGEN_LANES)へ入れる。1 段でも rc≠0 → 新しい段を入れず、走行中の段の終わりを待って止まる(rc 1)。
 *   ・済み印 `$REGEN_LOG/done/<段>.done` の 2 行目 `contract <64 桁>` が**この鎖の契約と同じとき**だけ済み(再開)。違う印は
 *     `<段>.done.stale` へ退けて走らせ直す。印には走行後の書いたファイルの sha256 を `out <file> <sha>` で残す(監査用)。
 *   ・時系列 `$REGEN_LOG/timeline.txt`(`start <段> <秒> <workers>` / `end <段> <rc> <秒>`)—— `--check-order <timeline>` が照合する。
 *   ・ログ名 `$REGEN_LOG/<波 2 桁>-<段>.log`(gate の判定は `.gate`・失敗の rc は `.rc`)。
 *   ・cmd が `$NAME` で参照する環境変数は冒頭で必須にする(未設定なら走らせる前に止まる)。
 * @param {object} chain buildChain の戻り
 * @param {{lanes?:number, htmlSha?:string}} [o]
 */
export function chainShell(chain, o) {
  const opt = o || {};
  const lanes = opt.lanes || 4;
  const L = [];
  const keys = chain.priority || chainPriority(chain);
  L.push('#!/usr/bin/env bash');
  L.push('# 生成物(手で直さない): node tools/regen-chain.mjs —— 再生成表 ' + chain.version
    + (opt.htmlSha ? '・html ' + String(opt.htmlSha).slice(0, 12) : '')
    + `・段 run ${chain.count.run} / gate ${chain.count.gate} / manual ${chain.count.manual}・ready queue(レーン ≤${lanes}・書込排他・worker 予算)`);
  L.push('# 済み印 $REGEN_LOG/done/<段>.done は契約(code/input/policy の hash)が同じときだけ再開に使う。rc≠0 の段があれば、走行中の段の終わりで止まる(rc 1)。');
  L.push('# gate の段は上流が走った後に `node tools/regen-chain.mjs --gate <段>` で自分の判定を引き直し、再利用なら走らせない。');
  L.push('set -u');
  L.push('ROOT=${REGEN_ROOT:-$(pwd)}');
  L.push('REGEN_HTML=${REGEN_HTML:-beta/index.html}');
  L.push('REGEN_LOG=${REGEN_LOG:-${TMPDIR:-/tmp}/regen-chain' + (opt.htmlSha ? '-' + String(opt.htmlSha).slice(0, 12) : '') + '}');
  L.push(`REGEN_LANES=\${REGEN_LANES:-${lanes}}`);
  L.push('DONE="$REGEN_LOG/done"; ST="$REGEN_LOG/.st"; mkdir -p "$DONE" "$ST" || exit 2; rm -f "$ST"/*.rc');
  L.push('cd "$ROOT" || exit 2');
  const envNeed = new Map();
  for (const r of Object.values(chain.steps)) for (const m of String(r.cmd).matchAll(/\$([A-Z_][A-Z0-9_]*)/g)) {
    if (!envNeed.has(m[1])) envNeed.set(m[1], []);
    envNeed.get(m[1]).push(r.key + (r.env && r.env[m[1]] ? '(' + r.env[m[1]] + ')' : ''));
  }
  for (const [v, who] of envNeed) L.push(`: "\${${v}:?${v} が要る —— ${who.join('・').replace(/["`$\\]/g, '')}}"`);
  L.push('mark_ok() {   # $1=段 $2=契約: 同じ契約の済み印だけを済みと見なす');
  L.push('  [ -f "$DONE/$1.done" ] || return 1');
  L.push('  if grep -qx "contract $2" "$DONE/$1.done"; then return 0; fi');
  L.push('  mv -f "$DONE/$1.done" "$DONE/$1.done.stale"; echo "[旧印] $1: 済み印の契約がこの鎖と違う → 走らせ直す($DONE/$1.done.stale)"; return 1');
  L.push('}');
  L.push('write_mark() {   # $1=段 $2=状態の行 $3=契約 $4=書くファイル');
  L.push('  { echo "$2"; echo "contract $3"; local f; for f in $4; do if [ -f "$f" ]; then echo "out $f $(sha256sum "$f" | cut -c1-64)"; fi; done; } >"$DONE/$1.done"');
  L.push('}');
  L.push('run_step() {   # $1=段 $2=ログ名 $3=cmd $4=契約 $5=書くファイル');
  L.push('  if mark_ok "$1" "$4"; then echo "[済] $1"; return 0; fi');
  L.push('  echo "[走] $1 → $REGEN_LOG/$2.log"; local t0; t0=$(date +%s)');
  L.push('  ( eval "$3" ) >"$REGEN_LOG/$2.log" 2>&1; local rc=$?');
  L.push('  if [ $rc -ne 0 ]; then echo "$rc" >"$REGEN_LOG/$2.rc"; echo "[止] $1 rc=$rc(ログ $REGEN_LOG/$2.log)"; return $rc; fi');
  L.push('  write_mark "$1" "run $(( $(date +%s) - t0 ))s $(date -u +%FT%TZ)" "$4" "$5"');
  L.push('}');
  L.push('gate_step() {  # 上流の後で自分の判定を引き直す(終了コード 10 = 再利用)。$6=同じファイルを書く上流(実際に走っていれば再利用しない)');
  L.push('  if mark_ok "$1" "$4"; then echo "[済] $1"; return 0; fi');
  L.push('  local u; for u in ${6:-}; do if [ -f "$DONE/$u.done" ] && grep -q "^run" "$DONE/$u.done"; then echo "[走・上流 $u が同じファイルを書き直した] $1"; run_step "$1" "$2" "$3" "$4" "$5"; return $?; fi; done');
  L.push('  node tools/regen-chain.mjs --gate "$1" --html "$REGEN_HTML" >"$REGEN_LOG/$2.gate" 2>&1; local g=$?');
  L.push('  if [ $g -eq 10 ]; then write_mark "$1" "reuse $(date -u +%FT%TZ)" "$4" "$5"; echo "[再利用] $1"; return 0; fi');
  L.push('  if [ $g -ne 0 ]; then echo "[止] $1 の再判定が rc=$g"; return $g; fi');
  L.push('  run_step "$1" "$2" "$3" "$4" "$5"');
  L.push('}');
  L.push('manual_step() {  # 1 行のシェルでない段: 同じ契約の済み印が無ければ止まる');
  L.push('  if mark_ok "$1" "$4"; then echo "[済] $1"; return 0; fi');
  L.push('  echo "[手動] $1: $3 —— 走らせた後に printf \'manual\\ncontract %s\\n\' $4 >$DONE/$1.done で再開"; return 3');
  L.push('}');
  // 表(段の属性 —— 書くファイルは排他の鍵 w<番号> に写す)
  const files = [...new Set(keys.flatMap((k) => chain.steps[k].writes || []))].sort();
  const fid = new Map(files.map((f, i) => [f, 'w' + i]));
  L.push('declare -a K=(' + keys.join(' ') + ')');
  const assoc = (name, f) => L.push(`declare -A ${name}=(` + keys.map((k) => `[${k}]=${shq(f(chain.steps[k]))}`).join(' ') + ')');
  assoc('DEP', (r) => (r.deps || []).join(' '));
  assoc('WR', (r) => (r.writes || []).map((f) => fid.get(f)).join(' '));
  assoc('WF', (r) => (r.writes || []).join(' '));
  assoc('NW', (r) => (r.workers === 'all' ? 'all' : String(Math.max(1, r.workers || 1))));
  assoc('FN', (r) => (r.mode === 'gate' ? 'gate_step' : r.mode === 'manual' ? 'manual_step' : 'run_step'));
  assoc('CMD', (r) => r.cmd);
  assoc('CT', (r) => r.contract || '-');
  assoc('UPS', (r) => (r.mode === 'gate' ? (r.sameFileUps || []).join(' ') : ''));
  assoc('LOGN', (r) => String((r.wave || 0) + 1).padStart(2, '0') + '-' + r.key);
  L.push('declare -A STATE=() LOCK=()');
  L.push('for k in "${K[@]}"; do STATE[$k]=pending; done');
  L.push('free=$REGEN_LANES; nrun=0; stop=0');
  L.push('echo "# ready-queue $(date -u +%FT%TZ) lanes=$REGEN_LANES" >>"$REGEN_LOG/timeline.txt"');
  L.push('while :; do');
  L.push('  for k in "${K[@]}"; do   # 終わった段を回収(rc はファイルで受ける)');
  L.push('    [ "${STATE[$k]}" = running ] && [ -f "$ST/$k.rc" ] || continue');
  L.push('    rc=$(cat "$ST/$k.rc"); echo "end $k $rc $(date +%s.%N)" >>"$REGEN_LOG/timeline.txt"');
  L.push('    need=${NW[$k]}; [ "$need" != all ] && [ "$need" -le "$REGEN_LANES" ] || need=$REGEN_LANES; free=$((free + need)); nrun=$((nrun - 1))');
  L.push('    for w in ${WR[$k]}; do unset "LOCK[$w]"; done');
  L.push('    if [ "$rc" -eq 0 ]; then STATE[$k]=ok; else STATE[$k]=fail; stop=1; fi');
  L.push('  done');
  L.push('  if [ $stop -eq 0 ]; then for k in "${K[@]}"; do   # 依存が済み・書込が空き・worker が空いた段を入れる(優先度の順)');
  L.push('    [ "${STATE[$k]}" = pending ] || continue');
  L.push('    ok=1; for d in ${DEP[$k]}; do [ "${STATE[$d]}" = ok ] || { ok=0; break; }; done; [ $ok -eq 1 ] || continue');
  L.push('    for w in ${WR[$k]}; do [ -z "${LOCK[$w]:-}" ] || { ok=0; break; }; done; [ $ok -eq 1 ] || continue');
  L.push('    need=${NW[$k]}; [ "$need" != all ] && [ "$need" -le "$REGEN_LANES" ] || need=$REGEN_LANES; [ "$need" -le "$free" ] || continue');
  L.push('    free=$((free - need)); nrun=$((nrun + 1)); for w in ${WR[$k]}; do LOCK[$w]=$k; done; STATE[$k]=running');
  L.push('    echo "start $k $(date +%s.%N) $need" >>"$REGEN_LOG/timeline.txt"');
  L.push('    ( "${FN[$k]}" "$k" "${LOGN[$k]}" "${CMD[$k]}" "${CT[$k]}" "${WF[$k]}" "${UPS[$k]}"; echo $? >"$ST/$k.rc" ) &');
  L.push('  done; fi');
  L.push('  [ $nrun -gt 0 ] || break');
  L.push('  wait -n 2>/dev/null || true');
  L.push('done');
  L.push('left=""; for k in "${K[@]}"; do [ "${STATE[$k]}" = ok ] || left="$left $k"; done');
  L.push('if [ -n "$left" ]; then echo "[止] 済んでいない段:$left($REGEN_LOG)"; exit 1; fi');
  L.push('echo "[完] 鎖の全段($REGEN_LOG)"');
  return L.join('\n') + '\n';
}

/**
 * 第283便e(AN29)の**自己試験**(一時ディレクトリ —— 正本は書き換えない)。
 * 「html だけ変わる再走」を calaudit の 2 ファイルで模す: 宣言した Pointer(実行時刻・所要・非物理 meta)の値を全部書き換え、
 * diag は `/when`・`/carriedOverFrom` だけ書き換えた写しを一時 root に置く。calaudit を入力にする現行の正本ごとに
 *   old … 今の刻印の行(`inputsStable` —— 刻印時の Pointer)で一時 root と照合
 *   neu … 今の宣言の Pointer で刻み直した行(統合時の付け替えを模す —— 随伴 diag の行も足す)で照合
 *   phys … 物理欄 1 つ(presets の最初の量の値)を変えた写しで neu が**不一致になる**か
 *   diag … diag の中身(移した診断)を 1 つ変えた写しで随伴の行が**不一致になる**か
 * @param {{root:string, tmpDir:string, stableJsonSha:Function, stableMatches:Function, STABLE_VERSION:string}} o
 */
export function an29Probe(o) {
  const root = o.root.replace(/\/$/, '');
  const CAL = 'tests/out/calaudit-w249.json', DIAG = 'tests/out/calaudit-w249-diag.json';
  const J = JSON.parse(fs.readFileSync(root + '/' + CAL, 'utf8'));
  const D = JSON.parse(fs.readFileSync(root + '/' + DIAG, 'utf8'));
  const vpC = volatilePathsOf(CAL), vpD = volatilePathsOf(DIAG);
  const bump = (v) => (typeof v === 'number' ? (Number.isInteger(v) ? v + 7 : v * 1.37 + 0.5)
    : (typeof v === 'string' && /^[0-9a-f]{64}$/.test(v)) ? crypto.createHash('sha256').update(v + '|w283e').digest('hex')
      : (typeof v === 'string' && /^\d{4}-\d\d-\d\dT/.test(v)) ? '2099-01-02T03:04:05.678Z' : v);
  const setAt = (X, ptr, f) => {
    const toks = ptr.slice(1).split('/').map((t) => t.replace(/~1/g, '/').replace(/~0/g, '~'));
    let n = 0;
    const walk = (x, i) => { if (!x || typeof x !== 'object') return;
      const keys = toks[i] === '*' ? Object.keys(x) : (Object.prototype.hasOwnProperty.call(x, toks[i]) ? [toks[i]] : []);
      for (const k of keys) { if (i === toks.length - 1) { x[k] = f(x[k]); n++; } else walk(x[k], i + 1); } };
    walk(X, 0);
    return n;
  };
  const clone = (x) => JSON.parse(JSON.stringify(x));
  const Jh = clone(J), Dh = clone(D);
  let nC = 0, nD = 0;
  for (const p of vpC) nC += setAt(Jh, p, bump);
  for (const p of vpD) nD += setAt(Dh, p, bump);
  const tmp = o.tmpDir.replace(/\/$/, '');
  fs.mkdirSync(tmp + '/tests/out', { recursive: true });
  const put = (a, b) => { fs.writeFileSync(tmp + '/' + CAL, JSON.stringify(a, null, 1)); fs.writeFileSync(tmp + '/' + DIAG, JSON.stringify(b, null, 1)); };
  put(Jh, Dh);
  const newRow = (file) => ({ file, stableSha256: o.stableJsonSha(root + '/' + file, volatilePathsOf(file)), stableVersion: o.STABLE_VERSION, volatilePaths: volatilePathsOf(file) });
  // 今の宣言で刻み直した行(統合時の付け替えを模す —— stableInputs と同じ形: calaudit の行 + 随伴 diag の行)
  const newRows = () => [newRow(CAL), Object.assign(newRow(DIAG), { companionOf: CAL })];
  const rows = [];
  const W = writersMap();
  const seenOut = new Set();
  for (const st of REGEN_STEPS) {
    if (st.role === 'history') continue;
    for (const out of st.outs) {
      if (seenOut.has(out)) continue;
      seenOut.add(out);
      const m = readMetaAt(root, out);
      if (!m) continue;
      const inInputs = (m.inputs || []).some((z) => z.file === CAL);
      const oldRow = (m.inputsStable || []).find((z) => z.file === CAL) || null;
      if (!inInputs && !oldRow) continue;
      rows.push({ step: st.key, out, alwaysRun: !!st.alwaysRun, hasStable: !!oldRow,
        old: oldRow ? o.stableMatches(tmp, oldRow) : false,
        neu: stableInputOk(tmp, newRows(), CAL) });
    }
  }
  // 物理欄 1 つ(presets の最初の本の最初の量の数値)を変える → 不一致
  const Jp = clone(Jh);
  let physPath = null;
  const p0 = (Jp.presets || [])[0];
  if (p0 && Array.isArray(p0.quantities) && p0.quantities.length) {
    const q = p0.quantities[0];
    const k = Object.keys(q).find((z) => typeof q[z] === 'number' && Number.isFinite(q[z]));
    if (k) { q[k] = q[k] * (1 + 1e-12) + 1e-300; physPath = '/presets/0/quantities/0/' + k; }
  }
  put(Jp, Dh);
  const physDetected = !stableInputOk(tmp, newRows(), CAL);
  // diag の中身(移した診断)を 1 つ変える → 随伴の行が不一致
  const Dp = clone(Dh);
  const dk = Object.keys(Dp.presets || {})[0];
  let diagPath = null;
  if (dk) { Dp.presets[dk] = [Dp.presets[dk], 'w283e-probe']; diagPath = '/presets/' + dk; }
  put(Jh, Dp);
  const diagDetected = o.stableMatches(tmp, newRow(CAL)) && !stableInputOk(tmp, newRows(), CAL);
  // 随伴の行が無い刻印(非物理 meta を除いた calaudit の行だけ)は一致としない
  put(Jh, Dh);
  const companionRequired = o.stableMatches(tmp, newRow(CAL)) && !stableInputOk(tmp, [newRow(CAL)], CAL);
  // 物理欄が宣言に入っていない(最後の鍵が実行時刻・所要か非物理 meta)ことは lint.stableHashPaths ② が見る
  return { calPointers: vpC.length, calHits: nC, diagPointers: vpD.length, diagHits: nD, rows,
    downstream: rows.length, withStable: rows.filter((r) => r.hasStable).length,
    reusableOld: rows.filter((r) => r.old).length, reusableNew: rows.filter((r) => r.hasStable && r.neu).length,
    needStamp: rows.filter((r) => !r.hasStable).map((r) => r.step),
    physPath, physDetected, diagPath, diagDetected, companionRequired, writersOfCal: W.get(CAL) || [] };
}

/**
 * 第284便c(原仮定者の裁定(第74報)AN43)の**自己試験**(一時 root —— 正本は書き換えない・走らせない)。
 * 2 段の表(書き手 `cal` が calaudit の 2 ファイル〔随伴つき〕を書き、読み手 `rd` が calaudit を入力にする)と、読み手の正本の刻印を
 * 一時 root に作り、`planRegen`(鎖の `--gate` も同じ関数)の読み手の自分の判定(`ownStatus`)を見る:
 *   same     … 刻印の Pointer = 今の宣言・バイト sha も同じ → reuse
 *   stable   … バイト sha は違うが今の宣言の安定 hash が同じ(実行時刻だけの再走)→ reuse(第282便e の既存の挙動)
 *   ptr      … **バイト sha は同じ**・刻印の Pointer ⊊ 今の宣言(宣言に Pointer を 1 本足した)→ regen(AN43)
 *   version  … バイト sha は同じ・刻印の方式の版が無い(旧方式)→ regen(AN43)
 *   companion… バイト sha は同じ・随伴 diag の行の Pointer が今の宣言と違う → regen(AN43)
 *   noComp   … バイト sha は同じ・随伴 diag の行が無い → regen(AN43)
 * @param {{tmpDir:string}} o
 */
export function an43Probe(o) {
  const tmp = o.tmpDir.replace(/\/$/, '');
  const CAL = 'tests/out/calaudit-w249.json', DIAG = 'tests/out/calaudit-w249-diag.json', RD = 'tests/out/rd-w284c.json';
  fs.mkdirSync(tmp + '/tests/out', { recursive: true });
  const w = (f, x) => fs.writeFileSync(tmp + '/' + f, typeof x === 'string' ? x : JSON.stringify(x, null, 1));
  const sh = (f) => shaFile(tmp + '/' + f);
  w('tests/rd-code.mjs', '// w284c an43 probe\n');
  w('tests/rd-target.txt', 'target\n');
  const cal = { meta: { when: '2026-09-27T00:00:00.000Z', targetSha256: 'a'.repeat(64) }, presets: [{ run: { wallSec: 1.5 }, quantities: [{ meas: 1.25 }] }] };
  const diag = { when: '2026-09-27T00:00:00.000Z', presets: { x: [1, 2] } };
  const P0 = { [CAL]: ['/meta/targetSha256', '/meta/when'], [DIAG]: ['/when'] };
  const P1 = { [CAL]: ['/meta/targetSha256', '/meta/when', '/presets/*/run/wallSec'], [DIAG]: ['/when'] };
  const volOf = (decl) => (f) => (decl[f] || []).slice().sort();
  const steps = [
    { key: 'cal', cmd: 'true', outs: [CAL, DIAG], sec: 0, secSource: 'probe', alwaysRun: false, role: 'current', after: [], env: {}, volatilePaths: {} },
    { key: 'rd', cmd: 'true', outs: [RD], sec: 0, secSource: 'probe', alwaysRun: false, role: 'current', after: ['cal'], env: {}, volatilePaths: {} },
  ];
  const row = (f, decl, extra) => Object.assign({ file: f, stableSha256: stableJsonSha(tmp + '/' + f, (decl[f] || []).slice().sort()),
    stableVersion: STABLE_VERSION, volatilePaths: (decl[f] || []).slice().sort() }, extra || {});
  const stamp = (rows) => w(RD, { meta: { target: 'tests/rd-target.txt', targetSha256: sh('tests/rd-target.txt'),
    code: [{ file: 'tests/rd-code.mjs', sha256: sh('tests/rd-code.mjs') }], inputs: [{ file: CAL, sha256: sh(CAL) }], inputsStable: rows } });
  const own = (decl) => { const pl = planRegen({ root: tmp, steps, volatileOf: volOf(decl) }); const r = pl.steps.find((z) => z.key === 'rd');
    return { status: r.ownStatus, cause: r.causeText }; };
  const res = {};
  // same: 刻印 P0・今 P0・バイト同じ
  w(CAL, cal); w(DIAG, diag);
  stamp([row(CAL, P0), row(DIAG, P0, { companionOf: CAL })]);
  res.same = own(P0);
  // stable: 実行時刻だけ変えた再走(バイト違い・安定 hash 同じ)
  w(CAL, Object.assign({}, cal, { meta: { when: '2026-09-28T00:00:00.000Z', targetSha256: 'b'.repeat(64) } }));
  res.stable = own(P0);
  // ptr: バイト同じ・今の宣言に Pointer を 1 本足した(刻印 P0 ⊊ 今 P1)
  w(CAL, cal); stamp([row(CAL, P0), row(DIAG, P0, { companionOf: CAL })]);
  res.ptr = own(P1);
  // version: バイト同じ・刻印の方式の版が無い(旧方式)
  const legacy = row(CAL, P0); delete legacy.stableVersion;
  stamp([legacy, row(DIAG, P0, { companionOf: CAL })]);
  res.version = own(P0);
  // companion: バイト同じ・随伴 diag の行の Pointer が今の宣言と違う
  stamp([row(CAL, P0), row(DIAG, { [DIAG]: [] }, { companionOf: CAL })]);
  res.companion = own(P0);
  // noComp: バイト同じ・随伴 diag の行が無い
  stamp([row(CAL, P0)]);
  res.noComp = own(P0);
  const ok = res.same.status === 'reuse' && res.stable.status === 'reuse' && res.ptr.status === 'regen' && res.version.status === 'regen'
    && res.companion.status === 'regen' && res.noComp.status === 'regen' && /安定 hash の宣言/.test(res.ptr.cause || '');
  return { ok, cases: res };
}

/** 第282便の統合で起きた順序の型を表で再現した**合成の列**(自己試験の固定入力)。 */
export const W282_ORDER_FIXTURE = ['d0audit', 'nslockledger', 'bgbudget', 'calaudit', 'dt3', 'kf0', 'nslock', 'bgpredict', 'bgequiv',
  'kf0ledger', 'nslockledger'];
/** 第282便の基点の表で after が無かった段(第283便e で足した after —— 自己試験で外して検出を確かめる)。 */
export const W283E_ADDED_AFTER = ['d0audit', 'nsmode', 'bgequiv', 'bgbudget', 'bgbudget2'];

/**
 * 第283便e: **鎖の自己試験**(dry-run —— 正本を書かない・走らせない。(f) だけ一時ディレクトリで stub の鎖を bash で走らせる)。
 *   (a) 今の表: 依存の完全性(入力の書き手 ⊆ after の閉包・同じファイルの書き手が全順序・循環なし)
 *   (b) 第282便の型の表(W283E_ADDED_AFTER の after と merges を外した写し)で、欠けた依存が**検出される**
 *   (c) 第282便の型の列(W282_ORDER_FIXTURE)で、入力より先の走行と後段の再走の欠落が**検出される**
 *   (d) 全段 regen の計画 → 鎖 → 平らにした列が checkOrder を通る(順序違反 0・後段の欠落 0)・表の現行段を全部覆う
 *   (e) 渡された計画(planRegen の実物)→ 鎖 → checkOrder を通る
 *   (f) stub の表(5 段・1 段が 1 回目だけ失敗)で生成したシェルを bash で 2 回走らせる: 1 回目は失敗した波で止まり後段を
 *       走らせない(rc 1)・2 回目は済み印の段を飛ばして再開し完走する・ログ名が規約どおり
 * @param {{root:string, tmpDir?:string, plan?:object}} o
 */
export async function regenChainSelfTest(o) {
  const root = o.root.replace(/\/$/, '');
  const res = { a: null, b: null, c: null, d: null, e: null, f: null, g: null, h: null, i: null };
  const deps = tableDeps({ root });
  // (a)
  const A = tableDepsAudit({ root });
  res.a = { ok: A.ok, missing: A.missing.length, unordered: A.unordered.length, cycles: A.cycles.length, unknown: A.unknown.length };
  // (b)
  const old = REGEN_STEPS.map((z) => Object.assign({}, z, W283E_ADDED_AFTER.includes(z.key) ? { after: [] } : {}, { merges: undefined }));
  const B = tableDepsAudit({ root, steps: old });
  const miss = [...new Set(B.missing.map((z) => z.key))].sort();
  res.b = { detected: miss, n: B.missing.length, ok: JSON.stringify(miss) === JSON.stringify(W283E_ADDED_AFTER.slice().sort()) };
  // (c)
  const C = checkOrder(W282_ORDER_FIXTURE, { deps });
  const ordSteps = [...new Set(C.order.map((z) => z.step))].sort();
  const wasteSteps = [...new Set(C.wasted.map((z) => z.step))].sort();
  res.c = { order: C.order.map((z) => z.step + '<' + z.dep), wasted: C.wasted.map((z) => z.step + '<' + z.dep), downstream: C.downstream.length,
    ok: ['bgbudget', 'd0audit', 'kf0ledger'].every((k) => ordSteps.includes(k)) && wasteSteps.includes('nslockledger')
      && C.order.some((z) => z.step === 'kf0ledger' && z.dep === 'nslockledger') };
  // (d)
  const all = { steps: REGEN_STEPS.map((z) => ({ key: z.key, status: z.role === 'history' ? 'history' : 'regen' })) };
  const D = buildChain(all, { deps });
  const Dc = checkOrder(chainSequence(D), { deps });
  const want = REGEN_STEPS.filter((z) => z.role !== 'history' && !z.outside).map((z) => z.key);
  const have = new Set(Object.keys(D.steps));
  res.d = { waves: D.waves.length, steps: have.size, want: want.length, order: Dc.order.length, downstream: Dc.downstream.length,
    widest: Math.max(...D.waves.map((w) => w.length)), manual: D.count.manual,
    ok: Dc.ok && want.every((k) => have.has(k)) };
  // (e)
  if (o.plan) {
    const E = buildChain(o.plan, { deps });
    const Ec = checkOrder(chainSequence(E), { deps });
    // 計画で走る段の下流は全部鎖にある(依存の閉包)
    const { down } = closures(deps);
    const lost = [];
    for (const k of Object.keys(E.steps)) for (const d of (down.get(k) || [])) {
      const st = REGEN_STEPS.find((z) => z.key === d);
      if (st && st.role !== 'history' && !st.outside && !E.steps[d]) lost.push(d);
    }
    res.e = { run: E.count.run, gate: E.count.gate, manual: E.count.manual, waves: E.waves.length, secRun: E.secRun, secGate: E.secGate,
      order: Ec.order.length, downstream: Ec.downstream.length, lost: [...new Set(lost)], ok: Ec.ok && !lost.length };
  }
  // (f) stub の鎖を bash で
  if (o.tmpDir) {
    const cp = await import('node:child_process');
    const tmp = o.tmpDir.replace(/\/$/, '');
    fs.mkdirSync(tmp + '/marks', { recursive: true });
    const mk = (k, cmd, after) => ({ key: k, cmd, outs: [], after: after || [], role: 'current', sec: 1 });
    const stub = [mk('sa', 'echo a > marks/sa'), mk('sb', 'test -f marks/ok || exit 7; echo b > marks/sb', ['sa']),
      mk('sc', 'echo c > marks/sc', ['sa']), mk('sd', 'echo d > marks/sd', ['sb', 'sc']), mk('se', 'echo "$W283E_STUB" > marks/se', ['sd'])];
    const sdeps = tableDeps({ steps: stub });
    const ch = buildChain({ steps: stub.map((z) => ({ key: z.key, status: 'regen' })) }, { steps: stub, deps: sdeps });
    const sh = chainShell(ch, { lanes: 2 });
    fs.writeFileSync(tmp + '/chain.sh', sh);
    const syn = cp.spawnSync('bash', ['-n', tmp + '/chain.sh'], { encoding: 'utf8' });
    const env = Object.assign({}, process.env, { REGEN_ROOT: tmp, REGEN_LOG: tmp + '/log' });
    delete env.W283E_STUB;
    const r0 = cp.spawnSync('bash', [tmp + '/chain.sh'], { encoding: 'utf8', env, cwd: tmp });   // 環境変数が無い → 走らせる前に止まる
    const noEnv = r0.status !== 0 && !fs.existsSync(tmp + '/marks/sa');
    env.W283E_STUB = 'ok';
    const r1 = cp.spawnSync('bash', [tmp + '/chain.sh'], { encoding: 'utf8', env, cwd: tmp });
    const after1 = ['sa', 'sb', 'sc', 'sd', 'se'].filter((k) => fs.existsSync(tmp + '/marks/' + k));
    const logs1 = fs.existsSync(tmp + '/log') ? fs.readdirSync(tmp + '/log').filter((f) => /\.(log|rc)$/.test(f)).sort() : [];
    fs.writeFileSync(tmp + '/marks/ok', '1');
    fs.writeFileSync(tmp + '/marks/sa', 'stale');   // 済み印の段は走らせ直さない(stale のまま残る)
    const r2 = cp.spawnSync('bash', [tmp + '/chain.sh'], { encoding: 'utf8', env, cwd: tmp });
    const after2 = ['sa', 'sb', 'sc', 'sd', 'se'].filter((k) => fs.existsSync(tmp + '/marks/' + k));
    const saStale = fs.readFileSync(tmp + '/marks/sa', 'utf8') === 'stale';
    res.f = { waves: ch.waves.map((w) => w.join('+')).join(' → '), syntax: syn.status === 0,
      noEnv,
      run1: { rc: r1.status, ran: after1, logs: logs1 }, run2: { rc: r2.status, ran: after2, resumedSkip: saStale },
      ok: syn.status === 0 && noEnv && r1.status === 1 && JSON.stringify(after1) === JSON.stringify(['sa', 'sc'])
        && logs1.includes('01-sa.log') && logs1.includes('02-sb.rc') && r2.status === 0 && after2.length === 5 && saStale };
  }
  // ---- 第284便f(R94): ready queue・書込排他・worker 予算・済み印の契約
  // (g) 全段 regen の鎖を ready queue で模擬(表の実測秒・レーン 4): 順序違反・書込の重なり・予算超過 0・全段が済む・
  //     波の型(第283便e)の見積り以下
  {
    const all = { steps: REGEN_STEPS.map((z) => ({ key: z.key, status: z.role === 'history' ? 'history' : 'regen' })) };
    const G = buildChain(all, { deps });
    const sim = simulateReadyQueue(G, { lanes: 4 });
    const wave = waveMakespan(G, 4);
    // 排他の鍵が効くことを、同じファイルを書く段(charon h/h2/h4・calaudit/dt3/kf0)の区間で確かめる
    const byFile = new Map();
    for (const e of sim.events) for (const f of (G.steps[e.key].writes || [])) { if (!byFile.has(f)) byFile.set(f, []); byFile.get(f).push(e); }
    const shared = [...byFile].filter(([, es]) => es.length > 1).map(([f, es]) => f.replace(/^tests\/out\//, '') + ':' + es.map((z) => z.key).join('→'));
    const excl = Object.keys(G.steps).filter((k) => G.steps[k].workers === 'all');
    const exclAlone = excl.every((k) => { const e = sim.events.find((z) => z.key === k); return e && sim.events.every((z) => z === e || z.end <= e.start + 1e-9 || z.start >= e.end - 1e-9 || z.end === z.start); });
    res.g = { exclusive: excl, exclusiveAlone: exclAlone, steps: sim.events.length, pending: sim.pending.length, makespan: Math.round(sim.makespan), waveMakespan: Math.round(wave),
      order: sim.check.order.length, writes: sim.check.writes.length, budget: sim.check.budget.length, sharedWriters: shared,
      ok: sim.check.ok && !sim.pending.length && sim.events.length === Object.keys(G.steps).length && sim.makespan <= wave + 1e-9 && shared.length >= 2
        && excl.includes('samplestatus') && exclAlone };
    // 模擬の照合器が違反を**検出する**(書込の重なり・入力より先・予算超過を 1 つずつ作る)
    const fx = { rows: { p: { deps: [], writes: ['F'], workers: 1 }, q: { deps: ['p'], writes: ['F'], workers: 1 }, r: { deps: [], writes: ['F'], workers: 2 } }, lanes: 2 };
    const bad = checkTimeline([{ key: 'p', start: 0, end: 5 }, { key: 'q', start: 3, end: 6 }, { key: 'r', start: 1, end: 2, workers: 2 }], fx);
    res.g.detect = { order: bad.order.length, writes: bad.writes.length, budget: bad.budget.length };
    res.g.ok = res.g.ok && bad.order.length === 1 && bad.writes.length >= 2 && bad.budget.length >= 1;
  }
  // (h) stub の鎖を bash で(レーン 3): 同じファイルを書く 2 段は重ならない・worker 2 の段は他と合わせて 3 を超えない・
  //     波の境を待たない(x4 は x3 の後すぐ —— x2 の終わりを待たない)。(i) 済み印の契約: 1 段の cmd を変えた鎖を同じ REGEN_LOG で
  //     走らせると、その段と下流だけが走り直し(旧印は .stale)、他は済みのまま
  if (o.tmpDir) {
    const cp = await import('node:child_process');
    const tmp = o.tmpDir.replace(/\/$/, '') + '/rq';
    fs.mkdirSync(tmp + '/cnt', { recursive: true });
    const mk = (k, cmd, after, extra) => Object.assign({ key: k, cmd, outs: [], after: after || [], role: 'current', sec: 1 }, extra || {});
    const tick = (k) => `echo x >> cnt/${k}`;
    const stubOf = (x2cmd) => [
      mk('x1', tick('x1') + '; sleep 0.6', [], { merges: ['out/F.json'] }),
      mk('x2', (x2cmd || tick('x2')) + '; sleep 0.6', [], { merges: ['out/F.json'] }),
      mk('x3', tick('x3') + '; sleep 0.3', [], { outs: ['out/G.json'] }),
      mk('x4', tick('x4') + '; sleep 0.3', ['x3']),
      mk('x5', tick('x5') + '; sleep 0.3', [], { workers: 2 }),
      mk('x6', tick('x6'), ['x2'])];
    const gen = (stub, name) => {
      const sd = tableDeps({ steps: stub });
      const ch = buildChain({ steps: stub.map((z) => ({ key: z.key, status: 'regen' })) }, { steps: stub, deps: sd });
      fs.writeFileSync(tmp + '/' + name, chainShell(ch, { lanes: 3 }));
      return ch;
    };
    const ch1 = gen(stubOf(null), 'c1.sh');
    const env = Object.assign({}, process.env, { REGEN_ROOT: tmp, REGEN_LOG: tmp + '/log' });
    const r1 = cp.spawnSync('bash', [tmp + '/c1.sh'], { encoding: 'utf8', env, cwd: tmp });
    const tl = parseTimeline(fs.readFileSync(tmp + '/log/timeline.txt', 'utf8'));
    const ev = (k) => tl.events.find((e) => e.key === k);
    const chk = checkTimeline(tl.events, { rows: ch1.steps, lanes: 3 });
    const x12 = [ev('x1'), ev('x2')].sort((a, b) => a.start - b.start);
    const noWave = ev('x4') && ev('x2') && ev('x4').start < Math.max(ev('x1').end, ev('x2').end);
    const cnt = (k) => { try { return fs.readFileSync(tmp + '/cnt/' + k, 'utf8').split('\n').filter(Boolean).length; } catch { return 0; } };
    const marksOk = ['x1', 'x2', 'x3', 'x4', 'x5', 'x6'].every((k) => { try { return fs.readFileSync(tmp + '/log/done/' + k + '.done', 'utf8').split('\n')[1] === 'contract ' + ch1.steps[k].contract; } catch { return false; } });
    res.h = { rc: r1.status, events: tl.events.length, lanes: tl.lanes, order: chk.order.length, writes: chk.writes.length, budget: chk.budget.length,
      serialF: x12[0].end <= x12[1].start + 1e-6, noWaveBarrier: noWave, marksOk,
      ok: r1.status === 0 && tl.events.length === 6 && tl.lanes === 3 && chk.ok && x12[0].end <= x12[1].start + 1e-6 && noWave && marksOk };
    // (i)
    const ch2 = gen(stubOf(tick('x2') + '; true'), 'c2.sh');
    const changed = Object.keys(ch2.steps).filter((k) => ch2.steps[k].contract !== ch1.steps[k].contract).sort();
    const before = Object.fromEntries(['x1', 'x2', 'x3', 'x4', 'x5', 'x6'].map((k) => [k, cnt(k)]));
    const r2 = cp.spawnSync('bash', [tmp + '/c2.sh'], { encoding: 'utf8', env, cwd: tmp });
    const reran = ['x1', 'x2', 'x3', 'x4', 'x5', 'x6'].filter((k) => cnt(k) > before[k]);
    const stale = fs.readdirSync(tmp + '/log/done').filter((f) => f.endsWith('.stale')).sort();
    // 契約の無い済み印(第283便e の形 —— touch)は済みと見なさない
    fs.writeFileSync(tmp + '/log/done/x3.done', 'run 1s\n');
    const r3 = cp.spawnSync('bash', [tmp + '/c2.sh'], { encoding: 'utf8', env, cwd: tmp });
    res.i = { changed, reran, stale, rc2: r2.status, rc3: r3.status, bareMarkRerun: cnt('x3') === before.x3 + 1,
      ok: JSON.stringify(changed) === '["x2","x6"]' && JSON.stringify(reran) === '["x2","x6"]' && JSON.stringify(stale) === '["x2.done.stale","x6.done.stale"]'
        && r2.status === 0 && r3.status === 0 && cnt('x3') === before.x3 + 1 && /\[旧印\] x3/.test(r3.stdout) };
  }
  res.ok = Object.values(res).filter((z) => z && typeof z === 'object').every((z) => z.ok !== false);
  return res;
}

export default { REGEN_TABLE_VERSION, REGEN_STEPS, stampedDeclDrift, an43Probe, EXTERNAL_VOLATILE, V_CALAUDIT_META, STABLE_COMPANIONS, companionsOf,
  volatilePathsOf, volatileDeclared, stepsByOut, alwaysRunOuts, historyOuts, planRegen,
  writesOf, writersMap, afterClosure, tableDeps, tableDepsAudit, checkOrder, buildChain, chainSequence, laneSplit, chainShell, an29Probe,
  codeFilesOf, chainContracts, CHAIN_CONTRACT_VERSION, chainPriority, simulateReadyQueue, waveMakespan, checkTimeline, parseTimeline,
  W282_ORDER_FIXTURE, W283E_ADDED_AFTER, regenChainSelfTest };
