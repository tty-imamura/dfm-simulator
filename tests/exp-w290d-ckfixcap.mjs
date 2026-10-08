// 第290便d(原仮定者の裁定(第80報)②「指摘を参考に改善」・統括の検証項目 R128)—— **チェックポイントの保存/復元が固定中心の状態 `S.fixcap` を
// 運ばなかった欠落**の回帰器と、**再開保存(保存 JSON → loadSave)の棚卸し**(表だけ —— 実装はしない)。
//
// ■ 何を測るか(Node だけ —— 対象 html の inline script を tests/lib-w279b-headless.mjs の loadHtmlHeadless で読み、`sim.step(DT)` と
//   `HP.ckSnapOne`/`HP.ckRestoreOne`/`HP.cloneSimStateNow` を直接呼ぶ。UI のボタンは押さない —— 粒子数が変わった後の復元を UI が拒否する契約は
//   ボタンの handler の 1 行のまま〔本器は粒子数が保存時と同じ場面だけを復元する〕)
//   (A) 再現: 🥜 fixedCaptureCopy の中心だけの写し(fixedEject なし)を build → 保存 → 2 步 → 器が R_I を 0.75 に書く → 復元。
//       基点 f03bf5a では stepN が 2 のまま・R_I が 0.75 のまま(保存時 0・1.5)。
//   (B) 超過からの捕獲 + 離散(同じ步で n が −1 +1 —— 粒子数は保存時と同じ): 保存 → 捕獲と離散が起きるまで步 → 復元 → 保存時と比較(t・n・粒子配列・
//       stepN・R_I・口座・ログ長・fixcap 全体のビット一致)→ もう一度同じ步数を走らせ、1 回目の走行とビット一致(再走の決定性)→ 同じ保存を 2 度目に
//       復元しても一致 → 保存側(スナップショットの fixcap)は復元後の走行で 1 bit も変わらない・ログの行を共有しない。
//   (C) 宣言した歩の離散(trigger {atStep:3}): 参照走行(保存しない)と、1 步 → 保存 → 1 步 → 復元 → 走行 の離散の時刻と、その 2 步後の状態を比べる
//       (atStep は stepN を読む —— 基点では復元後の stepN が進んだままで 1 步早く放出する)。
//   (D) 2 回連続の離散(第289便d の器の宣言 REPRO_EJECT → SECOND_EJECT)の後で保存 → 2 步 → 器が R_I を宣言値 1.5 へ書き戻す → 復元 →
//       状態から読む I′=½M′R_I²・E′=½I′Ω² が保存時(= 2 回目のイベントの I1・EsR)とビット一致。
//   (E) A/B(simB): `cloneSimState` の fixcap の写しをチェックポイントと同じ深い写し `cloneFixedCaptureState` へ寄せた —— 旧い浅い写し
//       (`Object.assign` + `log.slice()` —— 器の中で同じ形を作る)と新しい写しで B を走らせ、A・旧 B・新 B が 1 bit も違わないこと(A/B の結果は不変)。
//       B 側でも (B) と同じ保存/復元/再走。B のログの行が A と共有されないこと(基点では行のオブジェクトを共有)。
//   (F) 棚卸し(**実装はしない —— 表だけ**): 保存 JSON の鍵(保存ボタンの handler の `item` を html の本文から機械で読む)・loadSave が読む鍵・
//       状態の鍵の分類(固定中心・🌰 の中心捕獲・相対すべりの引きずり〔rdPrev* を含む〕・コア V2・層・空間メッシュ・形状トイの潜在)ごとに
//       「保存 JSON が運ぶ/チェックポイントが運ぶ/A/B 複製が運ぶ/build で t=0 の値を再構築できる」・器具のプリセットで 2 步 → 保存 → 2 步 → 復元 の
//       往復で保存時と違う鍵(= チェックポイントが運ばない状態)と、復元後の再走が保存しなかった走行とビット一致するか。
//
// ■ しないこと・言わないこと
//   ・走行の物理は変えない(内蔵 147 本の bitsame/sigsame は枝の実測 —— PHYSICS〔第290便d〕)・`S._core` 不変・保存 JSON の形式は変えない
//     (loadSave の実装は変えない)・可変粒子数のチェックポイントにしない。「再開保存を完成した」「可変粒子数のチェックポイント」と書かない。
//
// 実行(Node だけ・Chromium 不要): node tests/exp-w290d-ckfixcap.mjs   [W290D_BASE=beta/_w290_base.html で基点を子プロセスで測り直す]
// 正本: tests/out/ckfixcap-w290d.json(target=beta/index.html・領域 hash REGEN_SCOPE)。他の正本は読まない。
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { provenanceMeta } from './lib-w272e-provenance.mjs';
import { scopeStamp as w281aScopeStamp, stableInputs as w281aStableInputs } from './lib-w281a-scope.mjs';
const REGEN_SCOPE = {"presets":["clusterGrowthCopy","earthMoon","fixedCaptureCopy","layeredCoreDFM","plutoCharonDFM","shapeToyArm","spaceMeshBinaryToy"],"roots":["$","CENTER_CAPTURE_VERSION","CK_ARRS","CK_SC","CONTACT_MODE_KEY","DT","FIXED_CAPTURE_VERSION","HP.allPresets","HP.ckRestoreOne","HP.ckSnapOne","HP.cloneSimStateNow","HP.dfmFixedEject","HP.sim","HP.validatePreset","T","ab","centerCaptureCheck","ch","ckRestoreOne","ckSnapOne","cloneFixedCaptureState","cloneSimState","ctx","currentPreset","dfmCenterCaptureStep","dfmFixedCaptureStep","dfmFixedEject","fixedCaptureCheck","loadPreset","loadSave","loadSaveBgcAccept","physLock","sim","validatePreset"],"core":true,"consts":[],"complete":true};

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
export const HARNESS_VERSION = 'w290d-ckfixcap-1';
export const PRESET = 'fixedCaptureCopy';
/** 第289便d の器(tests/exp-w289d-ejectstate.mjs)の宣言と同じ値(器は import しない —— 再生成表の imported-main の数を増やさない)。 */
export const REPRO_EJECT = Object.freeze({ version: 'w288a-fixcap-1', mass: 1, rInertiaAfter: 0.75, rLaunch: 2, direction: Object.freeze({ posDeg: 0, velDeg: 90 }),
  spinEject: 0, radiusEject: 0.01, omegaAfter: 1, trigger: Object.freeze({ atStep: 9999 }) });
export const SECOND_EJECT = Object.freeze({ version: 'w288a-fixcap-1', mass: 1, rInertiaAfter: 0.5, rLaunch: 2, direction: Object.freeze({ posDeg: 180, velDeg: 270 }),
  spinEject: 0, radiusEject: 0.01, omegaAfter: 0.5, trigger: Object.freeze({ atStep: 9999 }) });
export const OVERFLOW_CASE = Object.freeze({ rInertia: 0.01, rInertiaAfter: 0.005, body: Object.freeze({ type: 'single', m: 0.425, x: -1.4, y: 0, vx: 0, vy: 2, spin: 0, pinned: false, radius: 0.01 }),
  eject: Object.freeze({ version: 'w288a-fixcap-1', mass: 0.2, rInertiaAfter: 0.005, rLaunch: 4, direction: Object.freeze({ posDeg: 90, velDeg: 90 }), spinEject: 0, radiusEject: 0.01, trigger: 'overflow' }) });
/** 本器の宣言(再現の步数・器が書く R_I・宣言した歩・往復の步数)。 */
export const SPEC = Object.freeze({ reproSteps: 2, reproTamperRI: 0.75, atStep: 3, afterEjectSteps: 2, maxSteps: 20, twiceSteps: 2, abSteps: 3,
  roundTrip: Object.freeze({ before: 2, between: 2 }) });
/** 棚卸しの器具(分類ごとに 1 本 —— 宣言した本の状態の鍵を数え、チェックポイントの往復に掛ける)。 */
export const INVENTORY_FIXTURES = Object.freeze([
  Object.freeze({ cat: 'fixcap', id: 'fixedCaptureCopy', copy: 'overflow', flag: 'hasFixedCapture' }),
  Object.freeze({ cat: 'capture', id: 'clusterGrowthCopy', flag: 'hasCenterCapture' }),
  Object.freeze({ cat: 'relDrag', id: 'plutoCharonDFM', flag: 'hasRelativeDrag' }),
  Object.freeze({ cat: 'coreV2', id: 'earthMoon', flag: 'hasCoreV2' }),
  Object.freeze({ cat: 'layers', id: 'layeredCoreDFM', flag: 'hasBodyLayers' }),
  Object.freeze({ cat: 'spaceMesh', id: 'spaceMeshBinaryToy', flag: 'hasSpaceMesh' }),
  Object.freeze({ cat: 'shapeToy', id: 'shapeToyArm', flag: 'hasShapeToy' }),
]);
/** 状態の鍵の分類(sim の自前の鍵の名前で引く —— 相対すべりの引きずりの履歴 rdPrev* は名前の型で拾う)。 */
export const STATE_CATS = Object.freeze([
  ['fixcap', '固定中心(🥜 の状態一式 —— R_I・stepN・捕獲/離散の回数・口座・ログ)', /^(fixcap|hasFixedCapture|_fixInto)$/],
  ['capture', '🌰 の中心捕獲の状態と帳簿', /^(capture|hasCenterCapture)$/],
  ['relDrag', '相対すべりの引きずり(帳簿と履歴 rdPrev*)', /^(relDrag|hasRelativeDrag|rdPrev|_rd)/],
  ['coreV2', 'コア V2(配列と帳簿)', /^(core(?!Field)[A-Z]|hasCore|RcV$|dragQ|coreWork$|coreSrcE$)/],
  ['layers', '層(親子コアの同心層)', /^(lay[A-Z]|hasBodyLayers$|_layer)/],
  ['spaceMesh', '空間メッシュ(帳簿と錨)', /^(spaceMesh|hasSpaceMesh$|hasPairWeave$|hasMeshReservoir$|hasCoordInertia$|_smAnc|meshRotor|meshCoord|_mc[A-Z]|_pw$)/],
  ['shapeToy', '形状トイ(潜在と帳簿)', /^(shapeToy|hasShapeToy$|[yzuw]Lat$|wzLat$|_stRng$)/],
]);
/** 棚卸しの表の行(PHYSICS〔第290便d〕—— 分類と、固定中心の中の 2 つの欄〔動的 R_I・口座〕)。 */
export const INVENTORY_ROWS = Object.freeze([
  ['fixcap', '固定中心の状態一式(stepN・捕獲/離散の回数・ログ)'], ['fixcap.rInertia', '動的 R_I(離散の後の慣性半径)'],
  ['fixcap.accounts', '口座(E_self・Q・Q_over・E_prec・E_pend・J_pin・P_pin・eE・eM)'], ['relDrag', '相対すべりの引きずりの帳簿と履歴(rdPrev*)'],
  ['coreV2', 'コア V2'], ['layers', '層'], ['spaceMesh', '空間メッシュ'], ['shapeToy', '形状トイの潜在'], ['capture', '🌰 の中心捕獲'],
]);
const ACCOUNT_KEYS = ['M', 'Eself', 'Q', 'Qover', 'Eprec', 'Epend', 'dU3', 'Jpin', 'PpinX', 'PpinY', 'Wcon', 'eM', 'eE'];
const COUNT_KEYS = ['stepN', 'nCand', 'nRefBound', 'nRefEnergy', 'nRefOverflow', 'nCap', 'nHeatAll', 'nOverflow', 'nEject', 'nRefEject'];
const ARR = ['m', 'x', 'y', 'vx', 'vy', 'spin', 'R', 'mEff', 'pinned'];

/** 基点 f03bf5a の保存/読込の実装の指紋(loadSave・受理 loadSaveBgcAccept の本文と保存ボタンの handler の sha256 —— 本便は変えない)。 */
export const SAVE_CODE_F03 = Object.freeze({ loadSave: "a216f717fcfcf4821e339cc0e9e62753c551a1c48be163d1f4bdc881cde91769", loadSaveBgcAccept: "215e55b1b2a670297c1e52fc55e93a82e59c105053e7b8b556d849d5e2f07a45",
  saveHandler: "b60176edcf47be88ce3ef24dca634a8573013e102ca93d5c2ae2f59ddd7e222d" });
/** 統合後(第290便c の受理 loadSaveInertialAccept を loadSave と保存ボタンの handler が呼ぶ —— 第290便d はこれを変えていない)の指紋。基点と同じか、
 *  html に loadSaveInertialAccept があってこの指紋と同じなら「保存/読込の実装は本便(d)で変えていない」と読む。 */
export const SAVE_CODE_W290C = Object.freeze({ loadSave: "42505ad0de1472508f9c8764c2cc76245a66aae7fa4d5c9a340d8b5fd18cbfe4", loadSaveBgcAccept: "215e55b1b2a670297c1e52fc55e93a82e59c105053e7b8b556d849d5e2f07a45", saveHandler: "b60176edcf47be88ce3ef24dca634a8573013e102ca93d5c2ae2f59ddd7e222d" });
/** 第291便c(原仮定者の裁定(第81報)⑥・R134): 保存の版 modePolicy:"w291c-1" と解決した法則 lawResolved を書き、旧セーブの kFrame の読み替えを版で分けた後の指紋
 *  (保存するのは設定の鍵 2 つだけ —— 走行の状態は運ばない。html に `function modeSaveWarnings(` があるときだけこの指紋を許す) */
export const SAVE_CODE_W291C = Object.freeze({ loadSave: "bf4a15590443f757cf6517ec4de90b9d07ff36d592f386f10fc06daa026bdab2", loadSaveBgcAccept: "215e55b1b2a670297c1e52fc55e93a82e59c105053e7b8b556d849d5e2f07a45", saveHandler: "0622c8087631a8ec197581008118d31ab9466551ebebcfc667362550ad8ae0c9" });
/** 第293便a(原仮定者の裁定(第83報)・R141): 保存の版を w293a-1 へ(読込は w291c-1 も値を保持)・#btnSave がセーブ時の警告へ実行中プリセットの宣言 kFrameApprox を写す
 *  (保存の鍵は不変 —— 走行の状態は運ばない。html の MODE_SAVE_WARN_CODES に `"kFrameFraction"` があるときだけこの指紋を許す) */
export const SAVE_CODE_W293A = Object.freeze({ loadSave: "d79b4a074ed19bbd6aee7afad165c4b6fa734480c8e3a34fd2192381cf824d14", loadSaveBgcAccept: "215e55b1b2a670297c1e52fc55e93a82e59c105053e7b8b556d849d5e2f07a45", saveHandler: "e3e5df644990dc54dee28cd458b8e58c0350ee9d4be948fea3123f6cb9bf2974" });
/** 第294便a(原仮定者の裁定(第84報)・R148): 読込 loadSave に旧 JSON の合成則の通知 1 行(loadSaveComposeLegacyOf —— modePolicy なし/w291c-1 の慣性の compose 未宣言)を足し、
 *  保存の版を w294a-1 へ(保存の鍵・保存ボタンの handler は不変 —— 走行の状態は運ばない。html の MODE_SAVE_WARN_CODES に `"inertialPlusGeodesic"` があるときだけこの指紋を許す) */
export const SAVE_CODE_W294A = Object.freeze({ loadSave: "da28ee83d5022a7ba77199a229a4a0dbcca31efc39fde4f2684968e23388e541", loadSaveBgcAccept: "215e55b1b2a670297c1e52fc55e93a82e59c105053e7b8b556d849d5e2f07a45", saveHandler: "e3e5df644990dc54dee28cd458b8e58c0350ee9d4be948fea3123f6cb9bf2974" });
/** 第295便a(原仮定者の裁定(第85報)・R153): 読込 loadSave の通知に目的の組の逸脱(modeSettingIssues —— 読込用の頭文)・#btnSave の警告の入力を modeIssueSrcOfSim に
 *  (保存の鍵・保存の版の書き方は不変 —— 走行の状態は運ばない。html に `function modeSettingIssues(` があるときだけこの指紋を許す) */
export const SAVE_CODE_W295A = Object.freeze({ loadSave: "8494497bed7bff6dc08b08b473405767cbdc46810d154bbc9fd818a071f20cf5", loadSaveBgcAccept: "215e55b1b2a670297c1e52fc55e93a82e59c105053e7b8b556d849d5e2f07a45", saveHandler: "a1492a16e71c38a175329af253ee33bb35fad44c3158f464498b187b3e12c6f9" });
/** 第296便a(原仮定者の裁定(第86報)・R157): 判定に本の fitRecord を渡す(loadSave の通知・#btnSave の警告の第 2 引数 modeIssueOptsOfSim —— 17 本目 geo1Fitted)
 *  (保存の鍵・保存の版の書き方は不変 —— 走行の状態は運ばない。html の MODE_SAVE_WARN_CODES に `"geo1Fitted"` があるときだけこの指紋を許す) */
export const SAVE_CODE_W296A = Object.freeze({ loadSave: "8578ce020421ad48d94f174ab80d82d22f3b5290d15819fb8616a41088c6c4d8", loadSaveBgcAccept: "215e55b1b2a670297c1e52fc55e93a82e59c105053e7b8b556d849d5e2f07a45", saveHandler: "5e6da5b9a838d7e8dbb52d438a49087bb6048c03838b8692ab5c3ecbdbbcc9d6" });
/** 基点 f03bf5a の値(枝の実測 —— 同じ器の probe を基点の beta/index.html で子プロセスで走らせ summaryOf で要約した値。基点 html は CI に無いので宣言値で持つ)。 */
export const BEFORE_F03 = Object.freeze({ rev: 'f03bf5a', how: '枝の実測(W290D_BASE=beta/_w290_base.html で本器の probe を子プロセスで走らせ summaryOf で要約した値)',
  summary: {"repro":{"savedStepN":0,"afterStepsStepN":2,"restoredStepN":2,"savedRI":1.5,"restoredRI":0.75,"tRestored":true},"overflow":{"steps":1,"nSame":true,"restoredBitSame":false,"rerunBitSame":false,"twiceBitSame":false,"restoredNCap":1,"restoredNEject":1,"restoredRI":0.005,"restoredLog":1,"restoredEjLog":1,"restoredEself":-14.689627726449768,"savedEself":0,"snapHasFixcap":false,"rerunNDiff":14},"atStep":{"tRef":0.048,"tTest":0.032,"restoredStepN":2,"savedStepN":1,"sameEjectTime":false,"stateBitSame":false},"twice":{"savedI":2.875,"savedE":0.359375,"restoredI":25.875,"restoredE":3.234375,"restoredRI":1.5,"restoredBitSame":false},"ab":{"abPrint":"4fa0a6889654c57265b0972339f6a6acd2cb34f1d34909b1097f8bcf98113c75","aEqualsNewB":true,"legacyBEqualsNewB":true,"logRowShared":true,"ckRestoredBitSame":false,"ckRerunBitSame":false},"inventory":[["fixcap","運ばない","動いた 1 鍵のうち 1 鍵が戻らない",false],["fixcap.rInertia","運ばない","動いた 1 鍵のうち 1 鍵が戻らない",false],["fixcap.accounts","運ばない","動いた 1 鍵のうち 1 鍵が戻らない",false],["relDrag","運ばない","動いた 2 鍵のうち 2 鍵が戻らない",false],["coreV2","一部","窓の中で動かない",true],["layers","一部","窓の中で動かない",true],["spaceMesh","運ばない","動いた 4 鍵のうち 4 鍵が戻らない",false],["shapeToy","運ばない","動いた 15 鍵のうち 15 鍵が戻らない",false],["capture","運ばない","窓の中で動かない",false]]} });

const clone = (o) => JSON.parse(JSON.stringify(o));
const byId = (HP, id) => HP.allPresets().find((q) => q.id === id);

/** 🥜 の写し(中心だけ + 追加の body・fixedCapture の上書き・fixedEject の宣言)—— 第289便d の器の copyOf と同じ形。 */
export function copyOf(HP, { extra = [], fc = {}, fe = REPRO_EJECT } = {}) {
  const p = clone(byId(HP, PRESET));
  p.bodies = [p.bodies[0]].concat(extra.map((b) => clone(b)));
  Object.assign(p.fixedCapture, fc);
  if (fe) p.fixedEject = clone(fe); else delete p.fixedEject;
  const v = HP.validatePreset(p);
  if (!v.ok) throw new Error('validatePreset: ' + (v.errors || []).join(' / '));
  return v.preset;
}
export const overflowCopy = (HP) => copyOf(HP, { extra: [OVERFLOW_CASE.body], fc: { rInertia: OVERFLOW_CASE.rInertia, overflowTo: 'eject' }, fe: OVERFLOW_CASE.eject });

/** 固定中心の要約(stepN・R_I・回数・口座・ログ長)。 */
export function fixView(S) {
  const C = S.fixcap;
  if (!C) return null;
  const o = { i: C.i, rInertia: C.rInertia, log: C.log.length, ejLog: C.ejLog.length };
  for (const k of COUNT_KEYS) o[k] = C[k];
  o.accounts = {};
  for (const k of ACCOUNT_KEYS) o.accounts[k] = C[k];
  return o;
}
/** 状態の指紋(t・n・粒子配列の先頭 n・fixcap の全体 —— JSON の数は往復で厳密)。 */
export function fp(S) {
  const arr = {};
  for (const k of ARR) arr[k] = Array.from(S[k].subarray(0, S.n));
  return { t: S.t, n: S.n, arr, hasFixedCapture: !!S.hasFixedCapture, fixcap: S.fixcap ? clone(S.fixcap) : null };
}
/** ビット比較(数は Object.is・形の違いも数える)—— 違った道を最大 5 つ。 */
export function diffBits(a, b) {
  const out = [];
  let n = 0;
  const walk = (x, y, p) => {
    if (typeof x === 'number' && typeof y === 'number') { if (!Object.is(x, y)) { n++; if (out.length < 5) out.push(p + ' ' + x + '⇔' + y); } return; }
    if (Array.isArray(x) || Array.isArray(y)) {
      if (!Array.isArray(x) || !Array.isArray(y) || x.length !== y.length) { n++; if (out.length < 5) out.push(p + ' 長さ ' + (x && x.length) + '⇔' + (y && y.length)); return; }
      x.forEach((v, i) => walk(v, y[i], p + '/' + i)); return;
    }
    if (x && y && typeof x === 'object' && typeof y === 'object') { for (const k of [...new Set(Object.keys(x).concat(Object.keys(y)))].sort()) walk(x[k], y[k], p + '/' + k); return; }
    if (x !== y) { n++; if (out.length < 5) out.push(p + ' ' + JSON.stringify(x) + '⇔' + JSON.stringify(y)); }
  };
  walk(a, b, '');
  return { same: n === 0, nDiff: n, first: out };
}
/** 系譜 id(ログの行の `id` —— S.linNext が配る記録用の番号)を外した指紋。チェックポイントは系譜(linId・linN・linNext・linLog)を運ばない
 *  (棚卸しの行 —— 本便では直さない)ので、再走の比較は物理・口座・ログの数と、系譜 id の違いを分けて数える。 */
export function stripLineage(F) {
  const G = clone(F);
  if (G.fixcap) for (const L of [G.fixcap.log, G.fixcap.ejLog]) for (const z of L) delete z.id;
  return G;
}
/** 状態から読む中心の量(第289便d の器と同じ —— R_I = S.fixcap.rInertia)。 */
export function stateRead(S) {
  const C = S.fixcap, c = C.i, M = S.m[c], W = S.spin[c], I = 0.5 * M * C.rInertia * C.rInertia;
  return { rInertia: C.rInertia, M, spin: W, I, E: 0.5 * I * W * W };
}
/** 器の文脈(headless の HP・DT・現在のプリセットの差し替え)。 */
function ctxOf(H) {
  const HP = H.HP, DT = H.evalExpr('DT');
  const setCurrent = (p) => { H.ctx.__w290dPreset = clone(p); H.evalExpr('currentPreset=__w290dPreset'); };
  const build = (p) => { setCurrent(p); HP.sim.build(clone(p)); return HP.sim; };
  const step = (S, k) => { for (let i = 0; i < k; i++) S.step(DT); };
  return { HP, DT, setCurrent, build, step };
}
const stepUntil = (X, S, pred, max) => { let k = 0; while (k < max && !pred(S)) { X.step(S, 1); k++; } return k; };

/** (B) の手順(A 側の sim でも B 側の simB でも同じ)—— 保存 → 捕獲と離散 → 復元 → 再走 → 2 度目の復元。 */
function overflowCheckpoint(X, S) {
  const F0 = fp(S), n0 = S.n;
  const snap = X.HP.ckSnapOne(S);
  const snapFix0 = JSON.stringify(snap.fixcap === undefined ? null : snap.fixcap);
  const k = stepUntil(X, S, (z) => z.fixcap.nEject >= 1, SPEC.maxSteps);
  const F1 = fp(S), v1 = fixView(S);
  const nSame = S.n === n0;
  X.HP.ckRestoreOne(S, snap);
  const Fr = fp(S), vr = fixView(S);
  const restored = diffBits(F0, Fr);
  X.step(S, k);
  const F1r = fp(S);
  const rerun = diffBits(stripLineage(F1), stripLineage(F1r));
  const rerunFull = diffBits(F1, F1r);
  const sharesLog = !!(snap.fixcap && (S.fixcap === snap.fixcap || S.fixcap.log === snap.fixcap.log || (S.fixcap.log[0] && S.fixcap.log[0] === snap.fixcap.log[0])));
  const snapUnchanged = JSON.stringify(snap.fixcap === undefined ? null : snap.fixcap) === snapFix0;
  X.HP.ckRestoreOne(S, snap);
  const Frr = fp(S);
  const twice = diffBits(F0, Frr);
  return { steps: k, n0, nAfter: F1.n, nSame, saved: fixView({ fixcap: F0.fixcap }), afterRun: v1, afterRestore: vr,
    restoredBitSame: restored.same, restoredDiff: restored, rerunBitSame: rerun.same, rerunDiff: rerun,
    rerunLineageOnly: rerun.same && !rerunFull.same, rerunLineageDiff: rerunFull, twiceBitSame: twice.same, twiceDiff: twice,
    snapHasFixcap: snap.fixcap !== undefined && snap.fixcap !== null, snapUnchanged, sharesLog };
}

/** (A)〜(E) —— エンジンの関数を直接呼ぶ(いまの html でも基点 html でも同じ関数で測る)。 */
export function probe(H) {
  const X = ctxOf(H), HP = X.HP;
  const out = {};
  // (A) 再現
  {
    const S = X.build(copyOf(HP, { fe: null }));
    const v0 = fixView(S), t0 = S.t, n0 = S.n;
    const snap = HP.ckSnapOne(S);
    X.step(S, SPEC.reproSteps);
    const v2 = fixView(S);
    S.fixcap.rInertia = SPEC.reproTamperRI;
    HP.ckRestoreOne(S, snap);
    const v3 = fixView(S);
    out.repro = { saved: { t: t0, n: n0, stepN: v0.stepN, rInertia: v0.rInertia }, afterSteps: { t: v2 && S.t, stepN: v2.stepN },
      restored: { t: S.t, n: S.n, stepN: v3.stepN, rInertia: v3.rInertia, log: v3.log, ejLog: v3.ejLog, accounts: v3.accounts },
      stepNRestored: v3.stepN === v0.stepN, rInertiaRestored: v3.rInertia === v0.rInertia, tRestored: S.t === t0 };
  }
  // (B) 超過からの捕獲 + 離散(粒子数は保存時と同じ)
  {
    const S = X.build(overflowCopy(HP));
    out.overflow = overflowCheckpoint(X, S);
  }
  // (C) 宣言した歩の離散(atStep は stepN を読む)
  {
    const pr = copyOf(HP, { fe: Object.assign(clone(REPRO_EJECT), { trigger: { atStep: SPEC.atStep } }) });
    const R = X.build(pr);
    const kr = stepUntil(X, R, (z) => z.fixcap.nEject >= 1, SPEC.maxSteps);
    const tRef = R.fixcap.ejLog[0] ? R.fixcap.ejLog[0].t : null;
    X.step(R, SPEC.afterEjectSteps);
    const Fref = fp(R);
    const S = X.build(pr);
    X.step(S, 1);
    const snap = HP.ckSnapOne(S);
    const vSave = fixView(S);
    X.step(S, 1);
    HP.ckRestoreOne(S, snap);
    const vRest = fixView(S);
    const kt = stepUntil(X, S, (z) => z.fixcap.nEject >= 1, SPEC.maxSteps);
    const tTest = S.fixcap.ejLog[0] ? S.fixcap.ejLog[0].t : null;
    X.step(S, SPEC.afterEjectSteps);
    const d = diffBits(Fref, fp(S));
    out.atStep = { atStep: SPEC.atStep, refStepsToEject: kr, tRef, savedStepN: vSave.stepN, restoredStepN: vRest.stepN, stepsToEjectAfterRestore: kt, tTest,
      sameEjectTime: tRef !== null && Object.is(tRef, tTest), dtEarly: (tRef !== null && tTest !== null) ? tRef - tTest : null,
      stateBitSame: d.same, stateDiff: d };
  }
  // (D) 2 回連続の離散の後の保存/復元
  {
    const S = X.build(copyOf(HP));
    const g1 = HP.dfmFixedEject(S, 'direct');
    const g2 = HP.dfmFixedEject(S, 'direct', clone(SECOND_EJECT));
    const s1 = stateRead(S), e2 = S.fixcap.ejLog[1];
    const snap = HP.ckSnapOne(S);
    X.step(S, SPEC.twiceSteps);
    S.fixcap.rInertia = REPRO_EJECT.rInertiaAfter * 2;   // 器が宣言値 1.5 へ書き戻す(⏮ の値 —— 復元が上書きすることの確認)
    HP.ckRestoreOne(S, snap);
    const s2 = stateRead(S);
    out.twice = { ejected: [g1, g2], saved: s1, restored: s2, event2: { I1: e2.I1, EsR: e2.EsR },
      savedEqualsEvent: Object.is(s1.I, e2.I1) && Object.is(s1.E, e2.EsR),
      restoredBitSame: Object.is(s2.I, s1.I) && Object.is(s2.E, s1.E) && Object.is(s2.rInertia, s1.rInertia) };
  }
  // (E) A/B(simB)—— cloneSimState の写し(新)と旧い浅い写し(器の中で同じ形を作る)で B を走らせて A と比べる・B 側のチェックポイント
  {
    const pr = overflowCopy(HP);
    const A = X.build(pr);
    const k1 = stepUntil(X, A, (z) => z.fixcap.nEject >= 1, SPEC.maxSteps);   // ログに行がある状態で複製する
    const Bn = HP.cloneSimStateNow();
    const Bl = HP.cloneSimStateNow();
    Bl.fixcap = Object.assign({}, A.fixcap, { log: A.fixcap.log.slice(), ejLog: A.fixcap.ejLog.slice() });   // 第288便a の写しの形(浅い)
    const cloneSame = diffBits(fp(A), fp(Bn));
    const rowShared = !!(Bn.fixcap.log[0] && Bn.fixcap.log[0] === A.fixcap.log[0]);
    const ejRowShared = !!(Bn.fixcap.ejLog[0] && Bn.fixcap.ejLog[0] === A.fixcap.ejLog[0]);
    const declShared = !!(Bn.fixcap.eject && Bn.fixcap.eject === A.fixcap.eject);
    X.step(A, SPEC.abSteps); X.step(Bn, SPEC.abSteps); X.step(Bl, SPEC.abSteps);
    const FA = fp(A), FBn = fp(Bn), FBl = fp(Bl);
    const dAN = diffBits(FA, FBn), dLN = diffBits(FBl, FBn);
    // B 側のチェックポイント(build 直後の写しで (B) と同じ手順)
    X.build(pr);
    const B2 = HP.cloneSimStateNow();
    const ck = overflowCheckpoint(X, B2);
    const abPrint = crypto.createHash('sha256').update(JSON.stringify([stripLineage(FA), stripLineage(FBn)])).digest('hex');   // 基点と今の html で A と B の走行が同じかを並べる指紋
    out.ab = { stepsBeforeClone: k1, abPrint, cloneBitSame: cloneSame.same, logRowShared: rowShared, ejLogRowShared: ejRowShared, ejectDeclShared: declShared,
      afterSteps: SPEC.abSteps, aEqualsNewB: dAN.same, aEqualsNewBDiff: dAN, legacyBEqualsNewB: dLN.same, legacyBEqualsNewBDiff: dLN, checkpointB: ck };
  }
  out.inventory = inventory(H, X);
  return out;
}

/** 保存ボタンの handler の `item` の鍵を html の本文から読む(書き出し)。 */
export function saveKeysOf(htmlText) {
  const i0 = htmlText.indexOf('$("#btnSave").addEventListener("click",()=>{');
  const i1 = htmlText.indexOf('a.unshift(item)', i0);
  if (i0 < 0 || i1 < 0) return null;
  const body = htmlText.slice(i0, i1).replace(/\/\/[^\n]*/g, '');   // 行末の注記を外す(注記の中の括弧と読点で鍵を取り違えない)
  const m = body.match(/const item=\{([\s\S]*?)\};/);
  const keys = new Set();
  if (m) {
    let depth = 0, cur = '';
    const parts = [];
    for (const ch of m[1]) {
      if ('([{'.includes(ch)) depth++;
      else if (')]}'.includes(ch)) depth--;
      if (ch === ',' && depth === 0) { parts.push(cur); cur = ''; } else cur += ch;
    }
    parts.push(cur);
    for (const p of parts) { const k = p.trim().match(/^([A-Za-z_$][\w$]*)\s*(?::|$)/); if (k) keys.add(k[1]); }
  }
  for (const z of body.matchAll(/\bitem\.([A-Za-z_$][\w$]*)\s*=/g)) keys.add(z[1]);
  return [...keys].sort();
}
/** loadSave(と受理 loadSaveBgcAccept)が読む保存 JSON の鍵。 */
export function loadKeysOf(H) {
  const src = H.evalExpr('loadSave.toString()') + '\n' + H.evalExpr('loadSaveBgcAccept.toString()');
  const keys = new Set();
  for (const z of src.matchAll(/\bs\.([A-Za-z_$][\w$]*)/g)) keys.add(z[1]);
  return [...keys].sort();
}
/** sim の自前の鍵の値の指紋(型つき配列はバイト列の sha256・関数は除く・循環は打ち切る)。 */
function keyPrints(S) {
  const out = {};
  let seen = null;
  const ser = (v, d) => {
    if (v === null || v === undefined) return String(v);
    if (v === S) return 'S';   // 自分への参照(他の鍵の中から S を辿って別の鍵を「既出」にしない)
    if (typeof v === 'function') return 'fn';
    if (typeof v === 'number') return Object.is(v, -0) ? '-0' : String(v);
    if (typeof v !== 'object') return JSON.stringify(v);
    if (ArrayBuffer.isView(v)) return 'ta:' + crypto.createHash('sha256').update(Buffer.from(v.buffer, v.byteOffset, v.byteLength)).digest('hex').slice(0, 16) + ':' + v.length;
    if (seen.has(v) || d > 6) return 'ref';
    seen.add(v);
    if (Array.isArray(v)) return '[' + v.map((z) => ser(z, d + 1)).join(',') + ']';
    return '{' + Object.keys(v).sort().map((k) => k + ':' + ser(v[k], d + 1)).join(',') + '}';
  };
  for (const k of Object.keys(S)) { if (typeof S[k] === 'function') continue; seen = new WeakSet(); out[k] = ser(S[k], 0); }
  return out;
}
/** 器具のプリセット(宣言の id だけ —— 他の本へ自動で切り替えない。正本が統合の順序で変わらないように。新しい法則版の引きずりの履歴を
 *  棚卸しに加えるときは INVENTORY_FIXTURES に id を足して器の版を上げる)。分類ごとに宣言した本がいま 1〜2 本しか無いので器具に使う
 *  (器具 = 状態の鍵を数える入力 —— 合否の期待値ではない)。 */
function fixtureOf(HP, F) {
  if (F.copy === 'overflow') return overflowCopy(HP);
  return byId(HP, F.id);
}
const catOf = (k) => { for (const [c, , re] of STATE_CATS) if (re.test(k)) return c; return null; };

/** (F) 棚卸し(保存 JSON・チェックポイント・A/B 複製・build)。 */
export function inventory(H, X) {
  const HP = X.HP;
  const htmlText = H.htmlText;
  const saveKeys = htmlText ? saveKeysOf(htmlText) : null;
  // 保存/読込の実装の指紋(本便 d は変えない —— 基点 f03bf5a の宣言値 SAVE_CODE_F03 か、第290便c の受理を足した統合後の SAVE_CODE_W290C と比べる)
  const sha = (t) => crypto.createHash('sha256').update(String(t)).digest('hex');
  const hs0 = htmlText ? htmlText.indexOf('$("#btnSave").addEventListener("click",()=>{') : -1;
  const code = { loadSave: sha(H.evalExpr('loadSave.toString()')), loadSaveBgcAccept: sha(H.evalExpr('loadSaveBgcAccept.toString()')),
    saveHandler: hs0 >= 0 ? sha(htmlText.slice(hs0, htmlText.indexOf('a.unshift(item)', hs0))) : null };
  const loadKeys = loadKeysOf(H);
  const CK_ARRS = clone(H.evalExpr('CK_ARRS')), CK_SC = clone(H.evalExpr('CK_SC'));
  const ckSrc = H.evalExpr('ckSnapOne.toString()');
  const ckObj = new Set(['params', 'phase', 'twall', 'wallRest', 'phHist', 'fixcap'].filter((k) => new RegExp('\\b' + (k === 'twall' ? 'tw' : k === 'wallRest' ? 'wr' : k) + ':').test(ckSrc)));
  const ckSet = new Set(CK_ARRS.concat(CK_SC).concat([...ckObj]));
  const abSrc = H.evalExpr('cloneSimState.toString()');
  const abHas = (k) => new RegExp('simB\\.' + k.replace(/\$/g, '\\$') + '\\s*=').test(abSrc) || new RegExp('"' + k + '"').test(abSrc);
  const fixtures = [];
  for (const F of INVENTORY_FIXTURES) {
    const p = fixtureOf(HP, F);
    if (!p) { fixtures.push({ cat: F.cat, id: F.id, missing: true }); continue; }
    const S = X.build(p);
    const keys = Object.keys(S).filter((k) => typeof S[k] !== 'function');
    const catKeys = keys.filter((k) => catOf(k) === F.cat).sort();
    // 往復: before 步 → 保存 → between 步 → 復元(粒子数が保存時と違えば UI は拒否 —— 復元しない)→ between 步(再走)と保存しなかった走行の比較
    X.step(S, SPEC.roundTrip.before);
    const n0 = S.n, P0 = keyPrints(S);
    const snap = HP.ckSnapOne(S);
    X.step(S, SPEC.roundTrip.between);
    const Pm = keyPrints(S), Fnoreset = fp(S);
    const nSame = S.n === n0;
    const moved = catKeys.filter((k) => P0[k] !== Pm[k]);
    let diffKeys = null, rerunBitSame = null, notRestored = null;
    if (nSame) {
      HP.ckRestoreOne(S, snap);
      const P1 = keyPrints(S);
      diffKeys = [...new Set(Object.keys(P0).concat(Object.keys(P1)))].filter((k) => P0[k] !== P1[k]).sort();
      notRestored = moved.filter((k) => P0[k] !== P1[k]);
      X.step(S, SPEC.roundTrip.between);
      const d = diffBits(Object.assign(Fnoreset, { fixcap: null }), Object.assign(fp(S), { fixcap: null }));
      rerunBitSame = d.same;
    }
    const rows = catKeys.map((k) => ({ key: k, moved: moved.includes(k), checkpoint: ckSet.has(k), abClone: abHas(k), saveJson: (saveKeys || []).includes(k) }));
    const byCat = {};
    for (const k of diffKeys || []) { const c = catOf(k) || 'other'; (byCat[c] = byCat[c] || []).push(k); }
    fixtures.push({ cat: F.cat, id: p.id || F.id, retiredFixture: p.familyRole === 'retired', flagOn: !!S[F.flag], n: n0, nSame, keys: rows,
      moved, notRestored, diffKeys, diffByCat: byCat, rerunBitSame });
  }
  // 表(分類ごと)—— 名簿の判定は**窓の中で動いた鍵**(動かなければ宣言の鍵と has*/_* を除いた鍵)がすべてチェックポイント/複製の名簿にあれば「運ぶ」・
  //   一部なら「一部」・無ければ「運ばない」。往復の実測は「動いた鍵のうち復元で保存時へ戻らない数」
  const fx = (c) => fixtures.find((f) => f.cat === c);
  const verdict = (rows, k) => rows.length === 0 ? '—' : rows.every((r) => r[k]) ? '運ぶ' : rows.some((r) => r[k]) ? '一部' : '運ばない';
  const table = INVENTORY_ROWS.map(([key, label]) => {
    const cat = key.split('.')[0], f = fx(cat);
    const all = f && f.keys ? f.keys : [];
    const movedRows = all.filter((r) => r.moved && !/^has[A-Z]/.test(r.key));
    const rows = movedRows.length ? movedRows : all.filter((r) => !/^_/.test(r.key) && !/^has[A-Z]/.test(r.key));
    const sub = key.indexOf('.') > 0;
    const fixRow = all.find((r) => r.key === 'fixcap');
    const ck = sub ? (fixRow && fixRow.checkpoint ? '運ぶ' : '運ばない') : verdict(rows, 'checkpoint');
    const ab = sub ? (fixRow && fixRow.abClone ? '運ぶ' : '運ばない') : verdict(rows, 'abClone');
    const save = rows.some((r) => r.saveJson) ? '運ぶ' : '運ばない';
    const roundTrip = !f ? '—' : !f.nSame ? '粒子数が変わった(UI は復元を拒否)'
      : (f.moved.length === 0 ? '窓の中で動かない' : (f.notRestored.length ? '動いた ' + f.moved.length + ' 鍵のうち ' + f.notRestored.length + ' 鍵が戻らない' : '動いた ' + f.moved.length + ' 鍵がすべて戻る'));
    return { key, label, fixture: f ? f.id : null, keys: rows.map((r) => r.key), moved: f ? f.moved : null, notRestored: f ? f.notRestored : null,
      saveJson: save, rebuild: '再構築できる(t=0 の値だけ)', checkpoint: ck, abClone: ab, roundTrip, rerunBitSame: f ? f.rerunBitSame : null };
  });
  return { code, saveCodeSameAsBase: JSON.stringify(code) === JSON.stringify(SAVE_CODE_F03) || (!!htmlText && htmlText.indexOf('function loadSaveInertialAccept(') >= 0 && JSON.stringify(code) === JSON.stringify(SAVE_CODE_W290C))
    || (!!htmlText && htmlText.indexOf('function modeSaveWarnings(') >= 0 && JSON.stringify(code) === JSON.stringify(SAVE_CODE_W291C))
    || (!!htmlText && htmlText.indexOf('"geo3NoInertial","kFrameFraction"]') >= 0 && JSON.stringify(code) === JSON.stringify(SAVE_CODE_W293A))
    || (!!htmlText && htmlText.indexOf('"kFrameFraction","inertialPlusGeodesic"]') >= 0 && JSON.stringify(code) === JSON.stringify(SAVE_CODE_W294A))
    // 第295便a+b(原仮定者の裁定(第85報)・R153/R154): 目的の組の判定 modeSettingIssues ∧ MODE_SAVE_WARN_CODES = a の 13 本+末尾に b の geoPN=4 の 3 本(統合後 16 本)の世代 ——
    //   保存・読込の実装の指紋は第295便a の SAVE_CODE_W295A(b は loadSave・保存ボタンの handler を変えていない)
    || (!!htmlText && htmlText.indexOf('function modeSettingIssues(') >= 0 && htmlText.indexOf('"inertialSolveFrom","geo4NoMesh","geo4Inertial","geo4KFrame"];') >= 0 && JSON.stringify(code) === JSON.stringify(SAVE_CODE_W295A))
    || (!!htmlText && htmlText.indexOf('"geo1Fitted"]') >= 0 && JSON.stringify(code) === JSON.stringify(SAVE_CODE_W296A)), saveKeys, loadKeys, saveCarriesState: !!saveKeys && saveKeys.every((k) => ['name', 'comment', 'savedAt', 'presetId', 'presetName', 'physics', 'cameraScale', 'universeBox',
    'phaseParams', 'twallHeat', 'wallRest', 'graphOverlays', 'scaleExps', 'physLock', 'qLock', 'kappaT', 'modePolicy', 'lawResolved'].includes(k)) ? false : null,   // 第291便c: 保存の版と解決した法則(設定 —— 状態ではない)
  checkpointSets: { arrs: CK_ARRS.length, sc: CK_SC.length, objects: [...ckObj].sort() }, fixtures, table };
}

/** probe の要約(前後の比較に使う量だけ)。 */
export function summaryOf(P) {
  return {
    repro: { savedStepN: P.repro.saved.stepN, afterStepsStepN: P.repro.afterSteps.stepN, restoredStepN: P.repro.restored.stepN, savedRI: P.repro.saved.rInertia,
      restoredRI: P.repro.restored.rInertia, tRestored: P.repro.tRestored },
    overflow: { steps: P.overflow.steps, nSame: P.overflow.nSame, restoredBitSame: P.overflow.restoredBitSame, rerunBitSame: P.overflow.rerunBitSame, twiceBitSame: P.overflow.twiceBitSame,
      restoredNCap: P.overflow.afterRestore.nCap, restoredNEject: P.overflow.afterRestore.nEject, restoredRI: P.overflow.afterRestore.rInertia, restoredLog: P.overflow.afterRestore.log,
      restoredEjLog: P.overflow.afterRestore.ejLog, restoredEself: P.overflow.afterRestore.accounts.Eself, savedEself: P.overflow.saved.accounts.Eself,
      snapHasFixcap: P.overflow.snapHasFixcap, rerunNDiff: P.overflow.rerunDiff.nDiff },
    atStep: { tRef: P.atStep.tRef, tTest: P.atStep.tTest, restoredStepN: P.atStep.restoredStepN, savedStepN: P.atStep.savedStepN, sameEjectTime: P.atStep.sameEjectTime, stateBitSame: P.atStep.stateBitSame },
    twice: { savedI: P.twice.saved.I, savedE: P.twice.saved.E, restoredI: P.twice.restored.I, restoredE: P.twice.restored.E, restoredRI: P.twice.restored.rInertia, restoredBitSame: P.twice.restoredBitSame },
    ab: { abPrint: P.ab.abPrint, aEqualsNewB: P.ab.aEqualsNewB, legacyBEqualsNewB: P.ab.legacyBEqualsNewB, logRowShared: P.ab.logRowShared, ckRestoredBitSame: P.ab.checkpointB.restoredBitSame,
      ckRerunBitSame: P.ab.checkpointB.rerunBitSame },
    inventory: P.inventory.table.map((r) => [r.key, r.checkpoint, r.roundTrip, r.rerunBitSame]),
  };
}
/** 判定(宣言の規則 —— 保存/復元が固定中心を運ぶ・A/B は不変)。 */
export function verdictOf(P) {
  const checks = {
    reproRestored: P.repro.stepNRestored && P.repro.rInertiaRestored && P.repro.tRestored,
    overflowNSame: P.overflow.nSame === true,
    overflowRestored: P.overflow.restoredBitSame && P.overflow.snapHasFixcap,
    overflowRerun: P.overflow.rerunBitSame,
    overflowTwice: P.overflow.twiceBitSame && P.overflow.snapUnchanged && !P.overflow.sharesLog,
    atStepTiming: P.atStep.sameEjectTime && P.atStep.stateBitSame && P.atStep.restoredStepN === P.atStep.savedStepN,
    twiceEject: P.twice.savedEqualsEvent && P.twice.restoredBitSame,
    abUnchanged: P.ab.cloneBitSame && P.ab.aEqualsNewB && P.ab.legacyBEqualsNewB,
    abIndependent: !P.ab.logRowShared && !P.ab.ejLogRowShared && !P.ab.ejectDeclShared,
    abCheckpoint: P.ab.checkpointB.nSame && P.ab.checkpointB.restoredBitSame && P.ab.checkpointB.rerunBitSame && P.ab.checkpointB.twiceBitSame && P.ab.checkpointB.snapUnchanged,
    inventoryFixcap: (() => { const f = P.inventory.fixtures.find((z) => z.cat === 'fixcap'); return !!f && f.nSame && !(f.diffByCat.fixcap || []).length && f.rerunBitSame === true; })(),
    saveFormatUnchanged: P.inventory.saveCarriesState === false && P.inventory.saveCodeSameAsBase === true,
  };
  return { checks, ok: Object.values(checks).every((v) => v === true) };
}

const g6 = (x) => (x === null || x === undefined || !Number.isFinite(x) ? '—' : String(Number(x.toPrecision(6))));
/** PHYSICS〔第290便d〕の表の行(QA が正本から作り直して探す)。 */
export function docRows(J) {
  const B = J.before.summary, N = J.summary;
  const yn = (v) => (v === true ? '一致' : v === false ? '不一致' : '—');
  const ba = [
    ['再現: 復元後の stepN(保存時 ' + N.repro.savedStepN + ')', B.repro.restoredStepN, N.repro.restoredStepN],
    ['再現: 復元後の R_I(保存時 ' + g6(N.repro.savedRI) + '・器が 0.75 を書いた後)', B.repro.restoredRI, N.repro.restoredRI],
    ['超過の捕獲 + 離散: 復元後の nCap / nEject', B.overflow.restoredNCap + ' / ' + B.overflow.restoredNEject, N.overflow.restoredNCap + ' / ' + N.overflow.restoredNEject],
    ['超過の捕獲 + 離散: 復元後の R_I', B.overflow.restoredRI, N.overflow.restoredRI],
    ['超過の捕獲 + 離散: 復元後の E_self(保存時 ' + g6(N.overflow.savedEself) + ')', B.overflow.restoredEself, N.overflow.restoredEself],
    ['超過の捕獲 + 離散: 復元後のログ長 log / ejLog', B.overflow.restoredLog + ' / ' + B.overflow.restoredEjLog, N.overflow.restoredLog + ' / ' + N.overflow.restoredEjLog],
    ['超過の捕獲 + 離散: 復元後の再走 = 1 回目の走行', yn(B.overflow.rerunBitSame), yn(N.overflow.rerunBitSame)],
    ['宣言した歩 ' + J.spec.spec.atStep + ' の離散: 放出の時刻(参照 ' + g6(N.atStep.tRef) + ')', B.atStep.tTest, N.atStep.tTest],
    ['A/B: A = 新しい写しの B = 旧い写しの B(' + J.spec.spec.abSteps + ' 步)', yn(B.ab.aEqualsNewB && B.ab.legacyBEqualsNewB), yn(N.ab.aEqualsNewB && N.ab.legacyBEqualsNewB)],
    ['B 側の保存/復元/再走', yn(B.ab.ckRestoredBitSame && B.ab.ckRerunBitSame), yn(N.ab.ckRestoredBitSame && N.ab.ckRerunBitSame)],
  ].map(([q, b, n]) => `| ${q} | ${typeof b === 'number' ? g6(b) : b} | ${typeof n === 'number' ? g6(n) : n} |`);
  const inv = J.probe.inventory.table.map((r) => `| ${r.label} | ${r.saveJson} | ${r.rebuild} | ${r.checkpoint} | ${r.abClone} | ${r.roundTrip} | ${r.rerunBitSame === true ? '一致' : r.rerunBitSame === false ? '不一致' : '—'} |`);
  return { beforeAfter: ba, inventory: inv };
}

const IS_MAIN = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
async function loadTarget(abs) {
  const { loadHtmlHeadless } = await import('./lib-w279b-headless.mjs');
  const H = loadHtmlHeadless(abs);
  H.htmlText = fs.readFileSync(abs, 'utf8');
  return H;
}
if (IS_MAIN && process.argv.includes('--probe')) {
  const html = process.argv[process.argv.indexOf('--probe') + 1];
  const H = await loadTarget(path.isAbsolute(html) ? html : path.join(ROOT, html));
  process.stdout.write(JSON.stringify(probe(H)));
} else if (IS_MAIN) {
  const TARGET = process.env.QA_TARGET || 'beta/index.html';
  const OUT_PATH = process.env.W290D_OUT || path.join(ROOT, 'tests', 'out', 'ckfixcap-w290d.json');
  const W281A_SCOPE = w281aScopeStamp(path.join(ROOT, TARGET), REGEN_SCOPE);
  const t0 = Date.now();
  const H = await loadTarget(path.join(ROOT, TARGET));
  const P = probe(H);
  console.log(`(A) 再現: stepN 保存 ${P.repro.saved.stepN} → ${SPEC.reproSteps} 步 ${P.repro.afterSteps.stepN} → 復元 ${P.repro.restored.stepN}・R_I ${P.repro.saved.rInertia} → 器 ${SPEC.reproTamperRI} → 復元 ${P.repro.restored.rInertia}`);
  console.log(`(B) 超過の捕獲 + 離散(${P.overflow.steps} 步・n ${P.overflow.n0} → ${P.overflow.nAfter}): 復元 ${P.overflow.restoredBitSame}・再走 ${P.overflow.rerunBitSame}・2 度目 ${P.overflow.twiceBitSame}・保存側不変 ${P.overflow.snapUnchanged}`);
  console.log(`(C) atStep ${SPEC.atStep}: 参照 t ${P.atStep.tRef} / 復元後 t ${P.atStep.tTest}(stepN 保存 ${P.atStep.savedStepN}・復元 ${P.atStep.restoredStepN})・状態 ${P.atStep.stateBitSame}`);
  console.log(`(D) 2 回連続の離散: I′ ${P.twice.saved.I} → ${P.twice.restored.I}・E′ ${P.twice.saved.E} → ${P.twice.restored.E}・一致 ${P.twice.restoredBitSame}`);
  console.log(`(E) A/B: A=新 B ${P.ab.aEqualsNewB}・旧 B=新 B ${P.ab.legacyBEqualsNewB}・行の共有 ${P.ab.logRowShared}・B 側の保存/復元 ${P.ab.checkpointB.restoredBitSame}/${P.ab.checkpointB.rerunBitSame}`);
  console.log('(F) 保存 JSON の鍵 ' + JSON.stringify(P.inventory.saveKeys));
  for (const r of P.inventory.table) console.log(`    ${r.key}(${r.fixture}): 保存 JSON ${r.saveJson}・チェックポイント ${r.checkpoint}・A/B ${r.abClone}・往復 ${r.roundTrip}・再走 ${r.rerunBitSame}`);
  const V = verdictOf(P);
  console.log('判定 ' + JSON.stringify(V));
  let before = BEFORE_F03;
  if (process.env.W290D_BASE) {
    const txt = execFileSync(process.execPath, [fileURLToPath(import.meta.url), '--probe', process.env.W290D_BASE], { cwd: ROOT, maxBuffer: 1 << 27 }).toString();
    const S0 = summaryOf(JSON.parse(txt));
    if (BEFORE_F03.summary !== null && JSON.stringify(S0) !== JSON.stringify(BEFORE_F03.summary)) { console.error('基点の測り直しが宣言値 BEFORE_F03 と違う —— 宣言を見直すこと'); console.error(JSON.stringify(S0)); process.exit(1); }
    if (BEFORE_F03.summary === null) { console.log('基点の要約(宣言値に写す): ' + JSON.stringify(S0)); before = Object.assign({}, BEFORE_F03, { summary: S0 }); }
    else console.log('基点(子プロセス)= 宣言値 BEFORE_F03');
  }
  const CODE = ['tests/exp-w290d-ckfixcap.mjs', 'tests/lib-w279b-headless.mjs', 'tests/lib-w272e-provenance.mjs', 'tests/lib-w281a-scope.mjs'];
  const meta = Object.assign(provenanceMeta({ root: ROOT, wave: '第290便d', target: TARGET, code: CODE, inputs: [TARGET] }), {
    harnessVersion: HARNESS_VERSION, loadErrors: H.errors.length,
    ruling: '原仮定者の裁定(第80報)②「指摘を参考に改善」で採る不具合修正(チェックポイントが固定中心の状態を運ばない)',
    reading: '統括の検証項目 R128(保存/復元の欠落の修正・回帰器・再開保存の棚卸し —— 保存形式は変えない)',
    engine: 'Node の headless(tests/lib-w279b-headless.mjs の loadHtmlHeadless —— html の本文をそのまま実行・sim.step(DT) と HP の保存/復元/複製の口を直接呼ぶ)',
    baseRev: 'f03bf5a', notClaim: ['再開保存を完成した', '可変粒子数のチェックポイント', '保存 JSON が走行の状態を運ぶ', '新発見'] });
  const out = { meta, spec: { preset: PRESET, reproEject: REPRO_EJECT, secondEject: SECOND_EJECT, overflowCase: OVERFLOW_CASE, spec: SPEC, fixtures: INVENTORY_FIXTURES,
    cats: STATE_CATS.map(([c, label, re]) => [c, label, String(re)]), rows: INVENTORY_ROWS },
  probe: P, summary: summaryOf(P), before, abSameAsBase: before.summary !== null && before.summary.ab.abPrint === P.ab.abPrint, verdict: V, elapsedS: (Date.now() - t0) / 1000 };
  Object.assign(out.meta, W281A_SCOPE, w281aStableInputs(ROOT, out.meta.inputs));
  fs.mkdirSync(path.dirname(OUT_PATH), { recursive: true });
  fs.writeFileSync(OUT_PATH, JSON.stringify(out, null, 1) + '\n');
  console.log('→ ' + path.relative(ROOT, OUT_PATH) + '(' + out.elapsedS.toFixed(1) + ' s)');
}
