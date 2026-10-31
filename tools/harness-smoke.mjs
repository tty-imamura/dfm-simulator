#!/usr/bin/env node
// 第303便e(統括の検証項目 R194 —— 第302便の鎖とゲートの教訓 ②)— **鎖の前の器の煙試験**(正本は書かない —— 作業ツリーの写しの中で走らせて捨てる)。
//
// ■ 何をするか
//   基点の html(--base)と今の html の差 —— 変わった最上位の名前(関数・定数)・`window.HP` の口・内蔵プリセットの宣言(生の定義と受理後の定義
//   —— 説明文の欄は除く)・`S._core` —— を引き、再生成表(`tests/lib-w281a-regentable.mjs`)の段のうち**その差を直接読む器**を選ぶ:
//     roots   … 器の領域の宣言 REGEN_SCOPE の roots(宣言の無い器は器のコードから機械で引いた下限 —— `deriveScope`)に、変わった名前・HP の口がある
//     presets … 宣言したプリセットが変わった / all … presets:"all" の器で、どれかのプリセットが変わった / core … S._core が変わった
//     code    … --base-rev から器・lib(正本の meta.code[])が変わった
//     closure … 依存閉包の中だけが変わった(間接 —— --indirect のときだけ走らせる)
//   選んだ段の器を**作業ツリーの写し**(scratch —— .git と node_modules を除いた複製・node_modules は symlink)で並列(--lanes)に走らせ、
//   **受理の例外**(validatePreset の拒否などで器が投げた)・**門の偽**(器が門で rc 1・出力の ok:false・gates の false)・**NaN** だけを報告する。
//   長い器は表 `SMOKE_KNOBS` の窓(QUICK・PART・ONLY・步数の環境変数)を使い、それでも枠(--budget 秒)を越える器は枠で止める
//   (それまでに例外・門の偽・NaN が出なければ「枠で止めた(問題なし)」—— **最初の数段だけを見た**ことを報告に書く)。
//   第302便の型: dragnorm の器が W_bg の本に旧法則 norm:"none" を重ねて受理器が拒否した(鎖の終盤で停止)—— この道具なら統合の直後に例外として出る。
//
// ■ 使い方(統括の手順の 1 行): 統合の直後・鎖の前に
//     node tools/harness-smoke.mjs --base beta/_w30N_base.html --base-rev <基点 sha>   # 例外・門の偽・NaN が 1 つでもあれば rc 1 —— 鎖を起動しない
//   --list(選ぶだけ・走らせない)/ --keys a,b(段を名指し)/ --wide(ハブの名前だけの段も)/ --indirect(閉包だけの段も)/ --lanes 2 / --budget 90 / --max-minutes 30 /
//   --json <file> / --out-dir <dir>(既定 $TMPDIR/harness-smoke-<時刻>)/ --root <dir>(別の木 —— 例: git archive で取り出した過去の状態)/
//   --git-dir <dir>(写しの中の `git -C ROOT show` が読む git —— 既定は --root の git)/ --head-rev <rev>(--base-rev との版どうしの差 —— 取り出した木のとき)/
//   --html <候補 html>(写しの beta/index.html を差し替える)/ --keep(写しを残す)/
//   --self-test(器を走らせない自己試験 —— QA lint.harnessSmoke303 と同じ関数)
//
// ■ 言わないこと
//   ・「煙試験が通ったので鎖が通る」(器の窓は最初の数段だけ —— 値の転記のずれは鎖の後の tools/pregate-transcript.mjs が見る)。
//   ・「選ばれなかった器は壊れない」(閉包だけの差 —— --indirect —— と、宣言の無い器の動的な読みは見ない)。
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawn, execFileSync } from 'node:child_process';
import { fileURLToPath, pathToFileURL } from 'node:url';

// 第304便e: 版 2 —— 判定の直し 3 型(NaN=false・器に渡す基点 html を写しの相対パスに・基点の正本でも ok:false の段を「既知」に)
export const HARNESS_SMOKE_VERSION = 'w304e-harness-smoke-2';
const TOOL_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

/**
 * 器ごとの煙試験の窓(段の key → 環境変数)。器の正本の全段は鎖が回す —— ここは**受理と最初の門**を短く見るための窓だけ。
 * 窓の無い長い器は枠(--budget)で止める(最初の数段)。key は再生成表の段に在ること(自己試験が照合する)。
 */
export const SMOKE_KNOBS = Object.freeze({
  'semic-302d': { env: { W302D_PART: 'gates' }, note: '段 gates だけ(約 55 s —— fit・chain は鎖)' },
  'gloc-302b': { env: { W302B_QUICK: '1' }, note: 'QUICK' },
  'axialsign-302e': { env: { W302E_N: '200', W302E_N3: '60' }, note: '步数 200/60(既定 2000/600)' },
  'spinavg-305d': { env: { W305D_QUICK: '1', W305D_N: '40' }, note: 'QUICK・步 40(既定 600 —— 走査を縮める)' },
  'rotframe-306d': { env: { W306D_QUICK: '1', W306D_N: '40' }, note: 'QUICK・步 40(既定 400 —— h/4 と 🍥 を縮める)' },   // 第306便d
  'mdsweep-310d': { env: { W310D_PARTS: 'K,P,E,S,Z' }, note: '段 K・P・E・S・Z だけ(段 R のエンジンの近点は鎖 —— 約 1200 s)' },   // 第310便d
  'planet3-311d': { env: { W311D_PARTS: 'S' }, note: '段 S だけ(約 1 s —— 段 T・E のエンジンの走行は鎖 —— 子プロセス 2 本で約 2000 s)' },   // 第311便d
  'confirm-312d': { env: { W312D_PARTS: 'T,C' }, note: '段 T・C だけ(約 5 s —— 規則の表・受理の目安・t = 0 の β・標的。段 E のエンジンの走行は鎖 —— 子プロセス 2 本で約 900〜1230 s)' },   // 第312便d
  'k1confirm-313d': { env: { W313D_PARTS: 'P,T' }, note: '段 P・T だけ(約 5 s —— 全天体 κ₀m の写しの宣言と t = 0 の β・標的の列。段 E のエンジンの走行は鎖 —— 子プロセス 2 本)' },   // 第313便d
  'synodic-299b': { env: { W299B_PART: 'sun3d' }, note: '段 sun3d だけ(約 30 s)' },
  'refit-298b': { env: { W298B_PART: 'qprobe' }, note: '段 qprobe だけ' },
  'refit-297a': { env: { W297A_PART: 'geotoy' }, note: '段 geotoy だけ' },
  'fit-297b': { env: { W297B_PART: 'mer' }, note: '段 mer だけ(正本を書かない開発用の窓)' },
  'timestd-297c': { env: { W297C_ORBITS: '2', W297C_OBS_STEPS: '60' }, note: '在位の全本・2 公転/60 步' },
  'clone-301f': { env: { W301F_N: '3', W301F_M: '3' }, note: '在位の全本・3 步/3 步' },
  'geo4-295b': { env: { W295B_STEPS: '200' }, note: '200 步' },
  'chain-296c': { env: { W296C_STEPS: '200' }, note: '200 步' },
  'shapetoy': { env: { W274D_SMOKE: '1' }, note: 'SMOKE' },
  'shapecrit': { env: { W275D_SMOKE: '1' }, note: 'SMOKE' },
  'dyncenter': { env: { W275D_SMOKE: '1' }, note: 'SMOKE' },
  'corefield': { env: { W276D_SMOKE: '1' }, note: 'SMOKE' },
  'bgbudget': { env: { W277D_STEPS: '2000' }, note: '2000 步' },
  'bgequiv': { env: { W278D_STEPS: '2000' }, note: '2000 步' },
  'bgbudget2': { env: { W279C_STEPS: '2000' }, note: '2000 步' },
  'pairnorm-305a': { env: { W305A_PARTS: 'Z,K' }, note: '段 Z・K だけ(約 5 s —— 三体の長窓 M は鎖)' },
  // ==== 第311便b の塊(ここから)====
  'galaxial-311b': { env: { W311B_QUICK: '1' }, note: 'QUICK(水星の 1/4 公転 —— 約 35 s・全段 A・B・D)' },
  // ==== 第312便b の塊(ここから)====
  'galaxialrd-312b': { env: { W312B_QUICK: '1' }, note: 'QUICK(水星の 1/4 公転 —— 約 60 s・全段 A・B・N・X)' },
  // ==== 第312便b の塊(ここまで)====
  // ==== 第313便b の塊(ここから)====
  'galaxialrdm-313b': { env: { W313B_QUICK: '1' }, note: 'QUICK(水星の 1/4 公転 —— 約 25 s・全段 A・B・N・X)' },
  // ==== 第313便b の塊(ここまで)====
  // ==== 第314便b の塊(ここから)====
  'rdscale-314b': { env: { W314B_QUICK: '1', W314B_OUT: 'tests/out/_smoke-rdscale-w314b.json' }, note: 'QUICK(段 P は水星の 1 公転 × a = 1・C₁/5 —— 約 30 s・段 K・S・R は全部)' },
  // ==== 第314便b の塊(ここまで)====
  // ==== 第314便c の塊(ここから)====
  'k1outer-314c': { env: { W314C_PARTS: 'P,T' }, note: '段 P・T だけ(約 5 s —— 外惑星 3 本の全天体 κ₀ × エンジンの質量の写しと規則の鍵の写しの照合・t = 0 の β・標的の列。段 E のエンジンの走行は鎖 —— 子プロセス 2 本)' },
  'k1em-314c': { env: { W314C_PARTS: 'T' }, note: '段 T だけ(約 3 s —— 🌦️ の標的の列。段 E のエンジンの走行〔h/4 と月の 354 公転〕は鎖 —— 子プロセス 2 本)' },
  // ==== 第314便c の塊(ここまで)====
  // ==== 第315便c の塊(ここから)====
  'inposk1-315c': { env: { W315C_PARTS: 'P,B,T' }, note: '段 P・B・T だけ(在位の 7 本の K1 + rdRule の宣言の印字・凍結の写し + 変換と移行した本のビット同一〔20000 步 × 7 本〕・標的の列 —— 段 E の走行は鎖)' },
  // ==== 第315便c の塊(ここまで)====
  // ==== 第315便d の塊(ここから)====
  'satk1-315d': { env: { W315D_PARTS: 'P,T', W315D_OUT: 'tests/out/_smoke-satk1-w315d.json' }, note: '段 P・T だけ(約 10 s —— 6 衛星の二体と三体の q11 の写しの全天体 r_d = Y_k × エンジンの質量の照合・t = 0 の β・近似要素の種。段 E のエンジンの走行は鎖 —— 子プロセス 2 本で約 830 s)' },   // 第315便d
  'sath-316d': { env: { W316D_PARTS: 'E,A,C,V', W316D_QUICK: '1', W316D_SATS: 'io,triton', W316D_OUT: 'tests/out/_smoke-sath-w316d.json' }, note: '試走(8 公転・h と h/2・イオとトリトンの二体と三体 —— 約 20 s。正本の 64 公転 × h/4 の走行は鎖 —— 子プロセス 2 本で約 1210 s)' },   // 第316便d
  // ==== 第315便d の塊(ここまで)====
  // ==== 第317便a の塊(ここから)====
  // 第319便(統括の統合): 第319便c で段を履歴へ(role:'history' —— 走らせない)—— 試走の窓を外した(lint.harnessSmoke303 ①)。旧の行: 'satmeas-317a': { env: { W317A_QUICK: '1', W317A_SATS: 'io,europa', W317A_OUT: 'tests/out/_smoke-satmeas-w317a.json' }, note: '試走(480 步/公転・8〜12 公転・h〜h/4 —— イオとエウロパの二体と三体・約 25 s。正本の 64〜128 公転 × h〜h/8 の走行は鎖 —— 子プロセス 2 本)' },   // 第317便a
  // ==== 第317便a の塊(ここまで)====
  // ==== 第317便b の塊(ここから)====
  // 第319便(統括の統合): 第319便c で段を履歴へ(role:'history' —— 走らせない)—— 試走の窓を外した(lint.harnessSmoke303 ①)。旧の行: 'satn-317b': { env: { W317B_QUICK: '1', W317B_SATS: 'io', W317B_SATS3: 'io', W317B_WORKERS: '1', W317B_OUT: 'tests/out/_smoke-satn-w317b.json' }, note: '試走(4 公転・h と h/2・180 → 360 步/公転・イオの二体の全組と三体 —— 約 40 s。正本の 6 衛星 × 32 公転 × h/4 と三体の 64 公転は鎖 —— 子プロセス 2 本)' },   // 第317便b
  // ==== 第317便b の塊(ここまで)====
  // ==== 第317便c の塊(ここから)====
  'satcut-317c': { env: { W317C_QUICK: '1', W317C_SATS: 'io,triton', W317C_WORKERS: '1', W317C_OUT: 'tests/out/_smoke-satcut-w317c.json' }, note: '試走(8 公転・S 360・h と h/2・イオとトリトンの V0・V2・V6b f=0・V1a —— 約 60 s。正本の 64 公転 × h/4 の走行は鎖 —— 子プロセス 2 本)' },   // 第317便c
  // ==== 第317便c の塊(ここまで)====
  // ==== 第318便b の塊(ここから)====
  'satnext-318b': { env: { W318B_QUICK: '1', W318B_WORKERS: '1', W318B_OUT: 'tests/out/_smoke-satnext-w318b.json' }, note: '試走(S 360・h と h/2・窓は P_母 の 1/32 —— カリストの V1a・V0 とトリトンの V3V1a・V1a・1 ulp の列 —— 約 50 s。正本の 1.5 P_母 × h/4 の走行は鎖 —— 子プロセス 2 本)' },   // 第318便b
  // ==== 第318便b の塊(ここまで)====
  // ==== 第318便c の塊(ここから)====
  'solar16-318c': { env: { W318C_QUICK: '1', W318C_WORKERS: '1', W318C_OUT: 'tests/out/_smoke-solar16-w318c.json' }, note: '試走(地球 1 年の窓を 1/32 に・イオ 1 公転の刻みの列はそのまま —— 子プロセス 1 本で約 4 分)' },
  // ==== 第318便c の塊(ここまで)====
  // ==== 第318便d の塊(ここから)====
  'dragest-318d': { env: { W318D_QUICK: '1', W318D_OUT: 'tests/out/_smoke-dragest-w318d.json' }, note: '試走(B の格子を 16×32 だけ・D の走行を 2 公転 —— 約 15 s。正本は 1 プロセスで約 71 s〔並走の秒〕)' },   // 第318便d
  // ==== 第318便d の塊(ここまで)====
  // ==== 第319便a の塊(ここから)====
  // 第320便a: axisheat-319a は履歴(再生成しない —— lint.harnessSmoke303 ①)へ移したので窓の表から外した
  // ==== 第319便a の塊(ここまで)====
  // ==== 第319便b の塊(ここから)====
  'srcradius-319b': { env: { W319B_QUICK: '1', W319B_OUT: 'tests/out/_smoke-srcradius-w319b.json' }, note: '試走(分布した銀河の格子を 1 段・加法性の N を 2 つ —— 約 2 s。正本は 1 プロセスで約 5 s〔並走の秒〕)' },   // 第319便b
  // ==== 第319便b の塊(ここまで)====
  // ==== 第320便a の塊(ここから)====
  'srcheat-320a': { env: { W320A_QUICK: '1', W320A_OUT: 'tests/out/_smoke-srcheat-w320a.json' }, note: '試走(步を 2 に・🗺️ と obs/capObs と −ĝ を外す —— 約 2 s。正本は 1 プロセスで約 6 s〔並走の秒〕)' },   // 第320便a
  // ==== 第320便a の塊(ここまで)====
  // ==== 第320便b の塊(ここから)====
  'jexplore-320b': { env: { W320B_QUICK: '1', W320B_OUT: 'tests/out/_smoke-jexplore-w320b.json' }, note: '試走(求積の格子を 2 段・分割の n を 3 つ —— 約 1.5 s。正本は 1 プロセスで約 2.5 s)' },   // 第320便b
  // ==== 第320便b の塊(ここまで)====
  // ==== 第320便c の塊(ここから)====
  'nbcompose-320c': { env: { W320C_QUICK: '1', W320C_OUT: 'tests/out/_smoke-nbcompose-w320c.json' }, note: '試走(格子 48 と 96・軟化の幅 2 つ・R_cut 3 つ・λ_c 3 つ —— 約 3 s。正本は 1 プロセスで約 43 s〔並走の秒〕)' },   // 第320便c
  // ==== 第320便c の塊(ここまで)====
  // ==== 第321便a の塊(ここから)====
  'geo2v3-321a': { env: { W321A_QUICK: '1', W321A_WORKERS: '1', W321A_OUT: 'tests/out/_smoke-geo2v3-w321a.json' }, note: '試走(base を 600 步・h/2 なし・退化と共変の步を縮める —— 約 10 s〔並走の秒〕。正本は base の 12000 步と h/2 〔子プロセス 1 本〕)' },   // 第321便a
  // ==== 第321便a の塊(ここまで)====
  // ==== 第311便b の塊(ここまで)====
});

/** 煙試験の全段に渡す既定(子プロセスの並列数を 1 に —— 器の注記どおり結果は並列数に依らない・箱を 2 レーンより多く占めない)。 */
export const SMOKE_ENV_DEFAULTS = Object.freeze(Object.fromEntries(['W284A', 'W285A', 'W286A', 'W287A', 'W288A', 'W292C', 'W293D', 'W293E', 'W295C', 'W296B', 'W297B',
  'W298C', 'W299C', 'W300C'].map((k) => [k + '_WORKERS', '1'])));

const argv0 = process.argv.slice(2);
const getArg = (argv, k, d) => { const i = argv.indexOf(k); return (i >= 0 && argv[i + 1] !== undefined) ? argv[i + 1] : d; };

// ---------------------------------------------------------------------------------------------
// html の事実(最上位の名前の本文・HP の口・プリセットの生と受理後・S._core)と差
// ---------------------------------------------------------------------------------------------
async function libs(root) {
  const SC = await import(pathToFileURL(path.join(root, 'tests', 'lib-w281a-scope.mjs')).href);
  const RT = await import(pathToFileURL(path.join(root, 'tests', 'lib-w281a-regentable.mjs')).href);
  const HL = await import(pathToFileURL(path.join(root, 'tests', 'lib-w279b-headless.mjs')).href);
  return { SC, RT, HL };
}
const scriptOf = (t) => t.slice(t.indexOf('<script>') + 8, t.lastIndexOf('</script>'));

/** html の事実。htmlPath はファイル(headless はファイルを読む)。 */
export async function htmlFacts(L, htmlPath) {
  const { SC, HL } = L;
  const text = fs.readFileSync(htmlPath, 'utf8');
  const parsed = SC.parseTopLevel(scriptOf(text));
  const top = new Map();
  for (const s of parsed.segments) for (const n of s.names) top.set(n, (top.has(n) ? top.get(n) + '\u0000' : '') + s.text);
  const hp = new Map();
  for (const [k, v] of SC.hpProps(parsed).props) hp.set(k, v.exprCode);
  const presetsRaw = new Map(), presetsAcc = new Map();
  let core = null, loadError = null;
  try {
    const H = HL.loadHtmlHeadless(htmlPath);
    for (const p of H.evalExpr('BUILTIN_PRESETS')) {
      presetsRaw.set(p.id, SC.canonJson(SC.stripPresetProse(p, SC.SCOPE_VERSION)));
      let acc;
      try { const v = H.HP.validatePreset(JSON.parse(JSON.stringify(p))); acc = { ok: !!v.ok, preset: v.preset ? SC.stripPresetProse(v.preset, SC.SCOPE_VERSION) : null, errors: v.ok ? undefined : v.errors }; }
      catch (e) { acc = { threw: String(e && e.message || e).slice(0, 200) }; }
      presetsAcc.set(p.id, SC.canonJson(acc));
    }
    try { core = String(H.HP.sim._core); } catch { core = null; }
  } catch (e) { loadError = String(e && e.message || e).slice(0, 200); }
  // 内蔵プリセットの表と文言の表(DATA_REGISTRIES・TEXT_REGISTRIES)は名前の差に数えない —— プリセットは id ごとに見る・文言は説明文
  return { htmlPath, parsed, top, hp, presetsRaw, presetsAcc, core, loadError, selfCheck: parsed.selfCheck.ok,
    registries: SC.DATA_REGISTRIES.concat(SC.TEXT_REGISTRIES) };
}

/** 基点と今の差。names = 本文が変わった(足された・消えた)最上位の名前・hp = 式が変わった HP の口・presets = 生か受理後が変わった id。 */
export function changeSet(base, now) {
  const diffMap = (a, b) => { const out = new Set(); for (const k of new Set([...a.keys(), ...b.keys()])) if (a.get(k) !== b.get(k)) out.add(k); return out; };
  const names = diffMap(base.top, now.top), hp = diffMap(base.hp, now.hp);
  for (const r of (now.registries || [])) names.delete(r);
  const raw = diffMap(base.presetsRaw, now.presetsRaw), acc = diffMap(base.presetsAcc, now.presetsAcc);
  const presets = new Set([...raw, ...acc]);
  return { names, hp, presets, presetsRaw: raw, presetsAccOnly: new Set([...acc].filter((k) => !raw.has(k))),
    core: base.core !== now.core, empty: !names.size && !hp.size && !presets.size && base.core === now.core };
}
const IDENT = /[A-Za-z_$][\w$]*/g;
/** HP の口 `HP.x` が変わったか(口の式そのもの、または式が名指す最上位の名前の本文)。 */
function hpRootChanged(x, cs, now) {
  if (cs.hp.has(x)) return true;
  const e = now.hp.get(x);
  if (e === undefined) return false;
  for (const m of String(e).match(IDENT) || []) if (cs.names.has(m)) return true;
  return false;
}

// ---------------------------------------------------------------------------------------------
// 段の選択
// ---------------------------------------------------------------------------------------------
// 優先: 1 = 変わった名前を roots に名指す(多くの器が共有する「ハブ」の名前 —— validatePreset など —— は除く)・S._core・器/lib のコード /
//       2 = 宣言したプリセットが変わった・all の器でプリセットが変わった / 3 = ハブの名前だけ / 4 = 閉包だけ(--indirect)。既定で走らせるのは 1・2(--wide で 3 も)
const PRIO = { roots: 1, core: 1, code: 1, presets: 2, all: 2, hub: 3, closure: 4 };
/** ハブの名前: 選べる器の宣言(下限)の 40% 以上(かつ 10 器以上)が roots に持つ名前(差の有無に依らない —— 表と宣言から機械で数える)。 */
export const HUB_SHARE = 0.4;
/** 段の cmd から器(tests/exp-*.mjs)を取る。鎖の脚本でしか回せない段・html を書く段は煙試験の外。 */
function harnessOf(st) {
  if (st.role === 'history') return { skip: '履歴' };
  if (st.alwaysRun) return { skip: '常時群(鎖の先頭で必ず走る)' };
  if ((st.htmlRegions || []).length && st.htmlWriteMode !== 'check') return { skip: 'html の生成領域を書く段' };
  const m = /^(?:[A-Z0-9_]+=\S+\s+)*node (tests\/exp-[\w.-]+\.mjs)(?:\s|$)/.exec(st.cmd);
  if (!m || /[(（]/.test(st.cmd.split(' && ')[0].replace(/\$BASE_HTML/g, ''))) return { skip: '鎖の脚本の段(cmd が器 1 本でない)' };
  return { harness: m[1] };
}
/**
 * 段を分類する。o = { root, now(htmlFacts), cs(changeSet), codeChanged:Set|null, indirect:boolean, L }。
 * 戻り値 { key, harness, sec, declKind, hits:{roots,presets,all,core,code,closure}, prio(0 = 選ばない), skip }。
 */
export function classifySteps(o) {
  const { SC, RT } = o.L;
  const rows = [];
  for (const st of RT.REGEN_STEPS) {
    const h = harnessOf(st);
    const row = { key: st.key, cmd: st.cmd, sec: st.sec, outs: st.outs || [], harness: h.harness || null, skip: h.skip || null, declKind: null,
      hits: { roots: [], hub: [], presets: [], all: false, core: false, code: [], closure: [] }, prio: 0, roots: [] };
    rows.push(row);
    if (h.skip) continue;
    let text = '';
    try { text = fs.readFileSync(path.join(o.root, h.harness), 'utf8'); } catch { row.skip = '器が無い'; continue; }
    let decl = SC.readDeclaredScope(text);
    let metaCode = [];
    const targets = [];
    for (const out of st.outs || []) { try { const J = JSON.parse(fs.readFileSync(path.join(o.root, out), 'utf8')); for (const c of ((J.meta && J.meta.code) || [])) metaCode.push(c.file); if (J.meta && J.meta.target) targets.push(String(J.meta.target)); } catch { /* 正本なし */ } }
    metaCode = [...new Set(metaCode)];
    // 正本の対象(meta.target)が html でない器(lib・CSV を対象に刻む —— html を走らせない器)は html の差で動かない
    if (targets.length && targets.every((t) => !/\.html$/.test(t))) { row.skip = '対象が html でない器(正本の target ' + targets[0] + ')'; continue; }
    if (decl) row.declKind = 'declared';
    else {
      try { decl = SC.deriveScope(o.now.htmlPath, SC.codeFilesOf(o.root, h.harness, metaCode)); row.declKind = 'derived'; }
      catch (e) { decl = { presets: 'all', roots: [], core: true }; row.declKind = 'none'; }
    }
    const sc = SC.normalizeScope(decl);
    row.roots = sc.roots.slice();
    for (const r of sc.roots) {
      const mm = /^HP\.(.+)$/.exec(r);
      if (mm ? hpRootChanged(mm[1], o.cs, o.now) : o.cs.names.has(r)) row.hits.roots.push(r);
    }
    if (sc.presets === 'all') row.hits.all = o.cs.presets.size > 0;
    else row.hits.presets = sc.presets.filter((id) => o.cs.presets.has(id));
    row.hits.core = (decl.core !== false) && o.cs.core;
    if (o.codeChanged) row.hits.code = [...new Set([h.harness].concat(metaCode))].filter((f) => o.codeChanged.has(f));
    if (o.indirect && !row.hits.roots.length && !row.hits.presets.length && !row.hits.all && !row.hits.core && !row.hits.code.length) {
      try {
        const cl = SC.closureOf(o.now.parsed, sc.roots, undefined, { hardStop: SC.SCOPE_STOP });
        row.hits.closure = cl.functions.filter((n) => o.cs.names.has(n)).concat(cl.hp.map((z) => z.name).filter((n) => o.cs.hp.has(n)).map((n) => 'HP.' + n));
      } catch { /* 閉包が引けない —— 間接は数えない */ }
    }
  }
  // ハブの名前(表と宣言から機械で数える)を roots の当たりから分ける
  const live = rows.filter((r) => !r.skip);
  // `HP.x` と `x` は同じ名前として数える(器は両方の形で名指す)
  const bare = (n) => String(n).replace(/^HP\./, '');
  const freq = new Map();
  for (const r of live) for (const n of new Set(r.roots.map(bare))) freq.set(n, (freq.get(n) || 0) + 1);
  const hubs = new Set([...freq].filter(([, c]) => c >= Math.max(10, HUB_SHARE * live.length)).map(([n]) => n));
  for (const row of live) {
    row.hits.hub = row.hits.roots.filter((n) => hubs.has(bare(n)));
    row.hits.roots = row.hits.roots.filter((n) => !hubs.has(bare(n)));
    if (row.hits.hub.length || row.hits.roots.length || row.hits.presets.length || row.hits.all || row.hits.core || row.hits.code.length) row.hits.closure = [];
    const p = [];
    if (row.hits.roots.length) p.push(PRIO.roots);
    if (row.hits.core) p.push(PRIO.core);
    if (row.hits.code.length) p.push(PRIO.code);
    if (row.hits.presets.length) p.push(PRIO.presets);
    if (row.hits.all) p.push(PRIO.all);
    if (row.hits.hub.length) p.push(PRIO.hub);
    if (row.hits.closure.length) p.push(PRIO.closure);
    row.prio = p.length ? Math.min(...p) : 0;
  }
  rows.hubs = [...hubs].sort();
  return rows;
}

// ---------------------------------------------------------------------------------------------
// 走行と判定
// ---------------------------------------------------------------------------------------------
const NAN_LINE = /(^|[^A-Za-z])NaN([^A-Za-z]|$)/;
// NaN を数えない行: 「NaN なし」の類と、器がわざと入れた非有限の入力を受理器が拒否した対照(拒否・NotFinite・isNaN の行)
// 第304便e: 「NaN=false」(器の行の書式 —— 第303便の sparc)も NaN なしに数える(`:` と `=` の両方)。「NaN=true」は数える
const NAN_OK = /NaN\s*(?:なし|無し|が無い|は無い|0\s*(?:件|本|個|回)?(?:[^\d.]|$))|no NaN|NaN(?:の数|件数)\s*0|["']?nan["']?\s*[:=]\s*(?:false|0)\b|hasNaN\s*[:=]\s*false|anyNaN\s*[:=]\s*false|拒否|reject|NotFinite|not finite|非有限|isNaN/i;
// 門の偽: JSON の行(最初の { から読めるもの)は gates の欄(行の頭が gates のときは全体)の直下の false か、最上位の ok:false だけを数える
// (JSON の中の文字列や対照の ok:false は数えない)。JSON でない行は「ok false」と「門 … 偽」だけ
const GATE_TEXT = /(?:\bok\s+false\b)|(?:門[^"\n{]{0,20}偽)/;
function gateLine(l) {
  const k = l.indexOf('{');
  if (k >= 0) {
    let J = null;
    try { J = JSON.parse(l.slice(k)); } catch { J = null; }
    if (J && typeof J === 'object') {
      const head = l.slice(0, k);
      const falses = (o) => (o && typeof o === 'object' && !Array.isArray(o)) ? Object.values(o).some((v) => v === false) : false;
      if (/\bgates?\b/.test(head) && falses(J)) return true;
      if (J.gates && falses(J.gates)) return true;
      return J.ok === false && /\b(?:gates?|ok)\b|門/.test(head + Object.keys(J).join(' '));
    }
  }
  return GATE_TEXT.test(l);
}
const EXC_LINE = /\b(?:Error|TypeError|RangeError|ReferenceError|SyntaxError|AssertionError)\b[:\s]|UnhandledPromiseRejection/;
// 第304便e: playwright の例外は stack の行の末尾に「 {」(エラーの欄の始まり)が付く(第303便の galaxyprof —— 例外を門の偽と読んでいた)
const STACK_LINE = /^\s+at\s.+:\d+:\d+\)?\s*\{?\s*$/;
const NOISE_LINE = /^\s*(?:\^+|triggerUncaughtException\(|node:internal\/\S+|Node\.js v[\d.]+)?\s*$/;
/** 例外の文: 最初の stack の行の直前の意味のある行(Node の内部の行・^ を除く)。無ければ EXC_LINE の最初の行。 */
function excMessage(err) {
  const ls = String(err || '').split('\n');
  const k = ls.findIndex((l) => STACK_LINE.test(l));
  // playwright の「Call log:」の節(操作の記録)は飛ばして、その直前の行を例外の文に
  let c = -1;
  for (let j = k - 1; j >= 0; j--) if (ls[j].trim() === 'Call log:') { c = j; break; }
  if (k > 0) for (let j = (c > 0 ? c : k) - 1; j >= 0; j--) if (!NOISE_LINE.test(ls[j])) return ls[j];
  return ls.find((l) => EXC_LINE.test(l)) || null;
}
/**
 * 出力の文字列から判定する(純関数 —— 自己試験が缶詰の出力で照合する)。枠で止めた走行(killed)は、止めた時点までの出力
 * (o.cutOut・o.cutErr —— 文字数)だけを見る(止めたことで子の Chromium が閉じた後の例外は数えない)。
 * 第304便e: **既知**(verdict 'known' —— NG に数えない)= 門の偽(rc≠0 で例外なし・出力の門の行・正本の写しの ok:false)のうち、この走行で書いた
 * 正本の写し(o.outOk === false・偽の門 o.outFalse)が**基点の正本でも ok:false**(o.baseOk === false)で、偽の門が基点の偽の門(o.baseFalse)の内に
 * 収まるもの(第303便の spiral290 の g4 —— 基点の正本から ok:false)。偽の門が基点より増えた・基点の正本が ok:true・写しを書かなかった走行は NG のまま。
 */
export function judgeOutput(o) {
  const out = String(o.stdout || '').slice(0, o.killed && Number.isFinite(o.cutOut) ? o.cutOut : undefined);
  const err = String(o.stderr || '').slice(0, o.killed && Number.isFinite(o.cutErr) ? o.cutErr : undefined);
  const lines = (out + '\n' + err).split('\n');
  const nanLines = lines.filter((l) => NAN_LINE.test(l) && !NAN_OK.test(l));
  const gateLines = lines.filter((l) => gateLine(l));
  const excLine = excMessage(err);
  let verdict = 'ok';
  const why = [];
  if (!o.killed && o.rc !== 0 && o.rc !== null) {
    if (excLine) { verdict = 'exception'; why.push(excLine.trim().slice(0, 240)); }
    else { verdict = 'gate'; why.push('rc ' + o.rc + (gateLines[0] ? ' —— ' + gateLines[0].trim().slice(0, 200) : '(器が門で終わった)')); }
  } else if (o.killed && excLine && STACK_LINE.test(err)) { verdict = 'exception'; why.push(excLine.trim().slice(0, 240) + '(枠で止める前)'); }
  if (verdict === 'ok' && o.outOk === false) { verdict = 'gate'; why.push('正本の写しの ok:false'); }
  if (verdict === 'ok' && gateLines.length) { verdict = 'gate'; why.push(gateLines[0].trim().slice(0, 200)); }
  if (verdict === 'ok' && nanLines.length) { verdict = 'nan'; why.push(nanLines[0].trim().slice(0, 200)); }
  if (verdict === 'gate' && o.outOk === false && o.baseOk === false) {
    const nf = Array.isArray(o.outFalse) ? o.outFalse : [], bf = Array.isArray(o.baseFalse) ? o.baseFalse : [];
    const extra = nf.filter((g) => !bf.includes(g));
    if (!extra.length) return { verdict: 'known', why: [`既知 —— 基点の正本でも ok:false(偽の門 ${nf.join(',') || '—'} ⊆ 基点 ${bf.join(',') || '—'})`].concat(why),
      nanLines: nanLines.length, gateLines: gateLines.length };
    why.push(`偽の門が基点より増えた: ${extra.join(',')}`);
  } else if (verdict === 'gate' && o.outOk === false && o.baseOk === true) why.push('基点の正本は ok:true');
  return { verdict, why, nanLines: nanLines.length, gateLines: gateLines.length };
}

/** 作業ツリーの写し(.git・node_modules を除く —— node_modules は symlink)。 */
export function makeSandbox(root, dir, htmlOverride) {
  fs.mkdirSync(dir, { recursive: true });
  execFileSync('bash', ['-c', 'tar -C "$1" --exclude=./.git --exclude=./node_modules -cf - . | tar -C "$2" -xf -', '_', root, dir], { stdio: 'pipe' });
  const nm = path.join(root, 'node_modules');
  if (fs.existsSync(nm)) { try { fs.symlinkSync(fs.realpathSync(nm), path.join(dir, 'node_modules')); } catch { /* 既にある */ } }
  if (htmlOverride) fs.copyFileSync(htmlOverride, path.join(dir, 'beta', 'index.html'));
  return dir;
}

/**
 * 第304便e: 器に渡す基点 html(環境変数 BASE_HTML —— 段の cmd の `$BASE_HTML`)は**写しの根からの相対パス**にする(器は `path.join(ROOT, 引数)` で
 * 開くので、絶対パスを渡すと写しの根と結合して見つからない —— 第303便の galaxyprof)。基点が写しの中に在る(--root の木の中 —— tar で写る)ならその相対パス、
 * 木の外(git archive で取り出した過去の状態に別の木の基点を渡すとき)なら写しの beta/_harness_smoke_base.html へ複写して、その相対パスを返す。
 */
export function baseHtmlForSandbox(root, sandbox, baseHtml) {
  if (!baseHtml) return null;
  const abs = path.resolve(root, baseHtml);
  const r = path.relative(path.resolve(root), abs);
  if (r && !r.startsWith('..') && !path.isAbsolute(r) && fs.existsSync(path.join(sandbox, r))) return r.split(path.sep).join('/');
  const dst = path.join('beta', '_harness_smoke_base.html');
  fs.mkdirSync(path.join(sandbox, 'beta'), { recursive: true });
  fs.copyFileSync(abs, path.join(sandbox, dst));
  return dst.split(path.sep).join('/');
}
/** 正本 JSON の ok と偽の門(gates の欄の false の名前 —— 欄が無ければ空)。読めなければ null。 */
export function canonVerdictOf(J) {
  if (!J || typeof J !== 'object') return null;
  const g = (J.gates && typeof J.gates === 'object' && !Array.isArray(J.gates)) ? Object.keys(J.gates).filter((k) => J.gates[k] === false) : [];
  return { ok: J.ok === undefined ? null : J.ok === true ? true : J.ok === false ? false : null, falseGates: g.sort() };
}
/**
 * 第304便e: **基点の正本**の ok と偽の門(段の outs ごと)。--base-rev があれば `git show <基点>:<正本>`(--git-dir か --root の git)、無ければ --root の木の
 * 正本(鎖の前 —— 写しを作る前の版)。読めない正本は数えない。戻り値 { ok:true|false|null, falseGates, src }(どれかの正本が ok:false なら false)。
 */
export function baseCanonOf(row, o) {
  let ok = null; const falseGates = new Set(); let src = null;
  for (const f of row.outs || []) {
    let J = null;
    if (o.baseRev) {
      try { J = JSON.parse(execFileSync('git', (o.gitDir ? ['--git-dir', o.gitDir] : ['-C', o.root]).concat(['show', o.baseRev + ':' + f]), { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'], maxBuffer: 256 << 20 })); src = 'git ' + o.baseRev; }
      catch { J = null; }
    }
    if (!J && !o.baseRev) { try { J = JSON.parse(fs.readFileSync(path.join(o.root, f), 'utf8')); src = '木の正本'; } catch { J = null; } }
    const v = canonVerdictOf(J);
    if (!v || v.ok === null) continue;
    if (v.ok === false) { ok = false; for (const g of v.falseGates) falseGates.add(g); }
    else if (ok === null) ok = true;
  }
  return { ok, falseGates: [...falseGates].sort(), src };
}

function runOne(row, o) {
  return new Promise((resolve) => {
    const knob = SMOKE_KNOBS[row.key] || null;
    const full = !(knob) && Number(row.sec) <= o.budget;
    const env = Object.assign({}, process.env, SMOKE_ENV_DEFAULTS, { TMPDIR: o.tmpDir, GIT_OPTIONAL_LOCKS: '0', QA_TARGET: 'beta/index.html' }, o.gitDir ? { GIT_DIR: o.gitDir } : {},
      knob ? knob.env : {}, o.baseRel ? { BASE_HTML: o.baseRel } : {});
    if (!env.PLAYWRIGHT_CORE_DIR && fs.existsSync('/opt/node22/lib/node_modules/playwright')) env.PLAYWRIGHT_CORE_DIR = '/opt/node22/lib/node_modules/playwright';
    const cmd = row.cmd.split(' && ')[0].replace(/\$BASE_HTML/g, '"$BASE_HTML"');
    const t0 = Date.now();
    const ch = spawn('bash', ['-c', cmd], { cwd: o.sandbox, env, detached: true, stdio: ['ignore', 'pipe', 'pipe'] });
    let stdout = '', stderr = '', killed = false, cutOut = null, cutErr = null;
    const cap = (s, x) => (s.length > 400000 ? s : s + x);
    ch.stdout.on('data', (d) => { stdout = cap(stdout, d.toString()); });
    ch.stderr.on('data', (d) => { stderr = cap(stderr, d.toString()); });
    const kill = () => { killed = true; cutOut = stdout.length; cutErr = stderr.length; try { process.kill(-ch.pid, 'SIGTERM'); } catch { /* 終わっている */ }
      setTimeout(() => { try { process.kill(-ch.pid, 'SIGKILL'); } catch { /* 終わっている */ } }, 3000).unref(); };
    const limit = full ? Math.max(o.budget, Number(row.sec) * 1.5 + 30) : o.budget;
    const tm = setTimeout(kill, limit * 1000);
    ch.on('close', (rc) => {
      clearTimeout(tm);
      const sec = (Date.now() - t0) / 1000;
      fs.writeFileSync(path.join(o.logDir, row.key + '.out'), stdout);
      fs.writeFileSync(path.join(o.logDir, row.key + '.err'), stderr);
      // 正本の写しは**この走行で書いたもの**だけを見る(第304便e —— 写しには鎖の前の正本が複写されているので、書かない窓〔knob〕で古い ok:false を拾わない)
      let outOk = null; const outFalse = new Set();
      if (!killed) for (const f of row.outs || []) {
        try {
          const fp = path.join(o.sandbox, f);
          if (fs.statSync(fp).mtimeMs < t0 - 1000) continue;
          const v = canonVerdictOf(JSON.parse(fs.readFileSync(fp, 'utf8')));
          if (v && v.ok === false) { outOk = false; for (const g of v.falseGates) outFalse.add(g); }
        } catch { /* 書かない窓 */ }
      }
      const bc = (outOk === false || (!killed && rc !== 0)) ? baseCanonOf(row, o) : { ok: null, falseGates: [] };
      const j = judgeOutput({ stdout, stderr, rc: killed ? null : rc, killed, outOk, outFalse: [...outFalse].sort(), baseOk: bc.ok, baseFalse: bc.falseGates, cutOut, cutErr });
      resolve({ key: row.key, harness: row.harness, prio: row.prio, mode: knob ? 'knob' : (full ? 'full' : 'cap'), knob: knob ? knob.note : null,
        rc: killed ? null : rc, killed, sec: +sec.toFixed(1), limitSec: Math.round(limit), verdict: j.verdict, why: j.why });
    });
  });
}

async function runPool(rows, o, log) {
  const res = [];
  const queue = rows.slice();
  const t0 = Date.now();
  const lane = async () => {
    while (queue.length) {
      if ((Date.now() - t0) / 60000 > o.maxMinutes) { const r = queue.shift(); res.push({ key: r.key, harness: r.harness, prio: r.prio, verdict: 'not-run', why: ['時間の枠(--max-minutes ' + o.maxMinutes + ')の外'] }); continue; }
      const r = queue.shift();
      const x = await runOne(r, o);
      res.push(x);
      log(fmtRow(x));
    }
  };
  await Promise.all(Array.from({ length: Math.max(1, o.lanes) }, lane));
  return res;
}
const TAG = { ok: 'ok  ', known: '既知 ', exception: 'NG  ', gate: 'NG  ', nan: 'NG  ', 'not-run': '--  ' };
const VJA = { exception: '例外', gate: '門の偽', nan: 'NaN', ok: '', known: '既知の門の偽(NG に数えない)', 'not-run': '未実行' };
function fmtRow(x) {
  const how = x.verdict === 'ok' ? (x.killed ? `枠 ${x.limitSec} s で止めた(それまで問題なし)` : '完走') : VJA[x.verdict];
  return `  ${TAG[x.verdict]}${String(x.key).padEnd(20)} ${how}${x.why && x.why.length && x.verdict !== 'ok' ? '  ' + x.why.slice(0, x.verdict === 'known' ? 2 : 1).join(' / ') : ''}`
    + (x.sec !== undefined ? `  (${x.sec} s・${x.mode}${x.knob ? ' ' + x.knob : ''})` : '');
}

// ---------------------------------------------------------------------------------------------
// 自己試験(器を走らせない —— QA lint.harnessSmoke303)
// ---------------------------------------------------------------------------------------------
export async function selfTest(opt) {
  const root = (opt && opt.root) || TOOL_ROOT;
  const L = await libs(root);
  const bad = [], cases = [];
  // ① 窓の表の key は再生成表の段に在る・履歴でない
  const keys = new Set(L.RT.REGEN_STEPS.filter((z) => z.role !== 'history').map((z) => z.key));
  const stale = Object.keys(SMOKE_KNOBS).filter((k) => !keys.has(k));
  if (stale.length) bad.push('① 窓の表に表に無い段: ' + stale.join(','));
  cases.push(`① 窓の表 ${Object.keys(SMOKE_KNOBS).length} 段は再生成表に在る(古い key ${stale.length})`);
  // ② 同じ html の差は空
  const html = path.join(root, 'beta', 'index.html');
  const now = await htmlFacts(L, html);
  if (now.loadError || !now.selfCheck) bad.push('② html の事実が引けない: ' + now.loadError);
  const cs0 = changeSet(now, now);
  if (!cs0.empty) bad.push('② 同じ html で差が空でない');
  cases.push(`② 同じ html の差は空 ${cs0.empty}(最上位の名前 ${now.top.size}・HP の口 ${now.hp.size}・内蔵プリセット ${now.presetsRaw.size})`);
  // ③ 関数の本文に 1 文(既定 relDragStepOrderOf —— 段 dragnorm-301a の宣言の roots から選ぶ。段が無ければ宣言のある最初の段)→ 差はその名前だけ・
  //    roots にその口を持つ器(その段を含む)が roots で選ばれる・持たない器は選ばれない
  const tmp = fs.mkdtempSync(path.join((opt && opt.tmpDir) || os.tmpdir(), 'w303e-smoke-'));
  try {
    const text = fs.readFileSync(html, 'utf8');
    const live = L.RT.REGEN_STEPS.filter((z) => z.role !== 'history' && !z.alwaysRun && /^node tests\/exp-/.test(z.cmd));
    const declOf = (st) => { try { return L.SC.readDeclaredScope(fs.readFileSync(path.join(root, /node (tests\/exp-[\w.-]+\.mjs)/.exec(st.cmd)[1]), 'utf8')); } catch { return null; } };
    const probe = live.find((z) => z.key === 'dragnorm-301a' && declOf(z)) || live.find((z) => declOf(z));
    const cand = probe ? declOf(probe).roots.map((r) => r.replace(/^HP\./, '')) : [];
    const fn = ['relDragStepOrderOf'].concat(cand).find((n) => cand.includes(n) && L.SC.touchFunction(text, n).ok) || 'relDragStepOrderOf';
    const t1 = L.SC.touchFunction(text, fn);
    if (!t1.ok) bad.push('③ ' + fn + ' に 1 文を差し込めない');
    const f1 = path.join(tmp, 'touch.html'); fs.writeFileSync(f1, t1.html);
    const a = await htmlFacts(L, f1);
    const cs1 = changeSet(now, a);
    const names1 = [...cs1.names].sort().join(',');
    if (names1 !== fn || cs1.presets.size || cs1.core) bad.push(`③ 差が ${fn} だけでない: 名前 ${names1}・プリセット ${cs1.presets.size}・core ${cs1.core}`);
    const rows1 = classifySteps({ root, now: a, cs: cs1, codeChanged: null, indirect: false, L });
    const hit1 = rows1.filter((r) => r.prio > 0);
    const dn = probe ? rows1.find((r) => r.key === probe.key) : null;
    if (!dn || dn.prio !== 1 || !(dn.hits.roots.includes('HP.' + fn) || dn.hits.roots.includes(fn))) bad.push(`③ ${probe ? probe.key : '(段なし)'} が roots で選ばれない`);
    const notRoot = hit1.filter((r) => !r.hits.roots.length && !r.hits.hub.length);
    if (notRoot.length) bad.push('③ roots に無い器が選ばれた: ' + notRoot.map((r) => r.key).slice(0, 4).join(','));
    cases.push(`③ ${fn} の本文に 1 文 → 差は名前 1(${names1})・選ぶ段 ${hit1.length}(すべて roots —— ${probe ? probe.key : '—'} を含む)`);
    // ④ ❄️ の質量の最下位桁 → 差はプリセット plutoCharonReal だけ・選ぶ段は ❄️ を宣言した器と all の器だけ
    const pr = L.SC.probeHtmls(text).mass;
    if (!pr.ok) bad.push('④ ❄️ の質量を変えた一時 html が作れない');
    const f2 = path.join(tmp, 'mass.html'); fs.writeFileSync(f2, pr.html);
    const b = await htmlFacts(L, f2);
    const cs2 = changeSet(now, b);
    if ([...cs2.presets].join(',') !== 'plutoCharonReal' || cs2.names.size || cs2.hp.size) bad.push('④ 差が ❄️ だけでない: ' + [...cs2.presets].join(',') + ' 名前 ' + cs2.names.size);
    const rows2 = classifySteps({ root, now: b, cs: cs2, codeChanged: null, indirect: false, L });
    const hit2 = rows2.filter((r) => r.prio > 0);
    const odd = hit2.filter((r) => !(r.hits.presets.includes('plutoCharonReal') || r.hits.all));
    if (odd.length) bad.push('④ ❄️ も all も宣言しない器が選ばれた: ' + odd.map((r) => r.key).slice(0, 4).join(','));
    if (!hit2.some((r) => r.hits.presets.includes('plutoCharonReal'))) bad.push('④ ❄️ を宣言した器が選ばれない');
    cases.push(`④ ❄️ の質量の最下位桁 → 差はプリセット 1・選ぶ段 ${hit2.length}(❄️ を宣言 ${hit2.filter((r) => r.hits.presets.length).length}・all ${hit2.filter((r) => r.hits.all && !r.hits.presets.length).length})`);
  } finally { fs.rmSync(tmp, { recursive: true, force: true }); }
  // ⑤ 判定(缶詰の出力)
  const J = [
    [{ stdout: '① {"zero":true}', stderr: 'Error: validatePreset: [{"path":"relativeDrag.norm"}]\n    at build (file:///x/tests/exp-w301a-dragnorm.mjs:43:73)', rc: 1, killed: false }, 'exception'],
    [{ stdout: 'gates {"a":true,"b":false}\n→ ok false', stderr: '', rc: 1, killed: false }, 'gate'],
    [{ stdout: '64 步 NaN なし・NaN 0 件', stderr: '', rc: 0, killed: false }, 'ok'],
    [{ stdout: 'aps NaN ″/世紀', stderr: '', rc: null, killed: true }, 'nan'],
    [{ stdout: '① {"zero":true}\n② 進行中', stderr: '', rc: null, killed: true }, 'ok'],
    [{ stdout: '', stderr: '', rc: 0, killed: false, outOk: false }, 'gate'],
    // JSON の文字列の「門」と対照の ok:false は門の偽に数えない / 受理器がわざと非有限を拒否した行の NaN は数えない
    [{ stdout: '{"note":"門の上限の内側","acc":{"neg":{"ok":false}}}\n拒否: cfg.Q=NaN ok=false 理由=qNotFinite', stderr: '', rc: 0, killed: false }, 'ok'],
    [{ stdout: '① {"zero":true,"mask":false}', stderr: '', rc: null, killed: true }, 'ok'],
    [{ stdout: 'gates {"zero":true,"mask":false}', stderr: '', rc: null, killed: true }, 'gate'],
    // 枠で止めた後に子の Chromium が閉じて出た例外は数えない(止めた時点までの出力だけを見る)
    [{ stdout: '① ok', stderr: 'node:internal/modules/run_main:123\n    triggerUncaughtException(\n    ^\n\npage.evaluate: Target page, context or browser has been closed\n    at live (file:///x/tests/exp-w294d-timing.mjs:246:23)', rc: null, killed: true, cutOut: 4, cutErr: 0 }, 'ok'],
    // 第304便e(第303便の初回運用の NG 3 型): ⓐ「NaN=false」は NaN なし(sparc)—— 「NaN=true」は数える
    [{ stdout: '', stderr: '  🌃 🌃 ngc3198(NFW 対照・内蔵のまま) dt/1: n=300 NaN=false r_max(HI)=31.79 kpc  [3 s]', rc: null, killed: true }, 'ok'],
    [{ stdout: '', stderr: '  🌃 ngc3198 dt/2: n=300 NaN=true r_max(HI)=—', rc: null, killed: true }, 'nan'],
    // ⓑ 基点の正本でも ok:false の段は既知(spiral290 の g4)—— 偽の門が基点より増えた・基点が ok:true なら NG のまま
    [{ stdout: '→ tests/out/spiral-w290e.json(53.8 s)・ok false {"g1":true,"g4":false}', stderr: '', rc: 0, killed: false, outOk: false, outFalse: ['g4'], baseOk: false, baseFalse: ['g4'] }, 'known'],
    [{ stdout: '→ ok false', stderr: '', rc: 0, killed: false, outOk: false, outFalse: ['g4', 'g5'], baseOk: false, baseFalse: ['g4'] }, 'gate'],
    [{ stdout: '→ ok false', stderr: '', rc: 0, killed: false, outOk: false, outFalse: ['g4'], baseOk: true, baseFalse: [] }, 'gate'],
    // ⓒ 基点 html を絶対パスで渡して器が見つけられなかった(galaxyprof —— 道具の側で写しの相対パスに直す ⑥。判定は例外のまま —— 直す前の型を NG として残す)
    [{ stdout: '', stderr: 'node:internal/modules/run_main:123\n    triggerUncaughtException(\n    ^\n\npage.goto: net::ERR_FILE_NOT_FOUND at file:///s/root/home/user/x/beta/_w303_base.html\nCall log:\n  - navigating to "file:///s/root/home/user/x/beta/_w303_base.html", waiting until "load"\n\n    at /s/root/tests/exp-w274c-galaxyprof.mjs:155:14 {\n  name: \'Error\'\n}', rc: 1, killed: false }, 'exception'],
  ];
  const got = J.map(([o]) => judgeOutput(o).verdict);
  const miss = J.map(([, w], i) => (got[i] === w ? null : i + ':' + got[i] + '≠' + w)).filter(Boolean);
  if (miss.length) bad.push('⑤ 判定が缶詰と違う: ' + miss.join(','));
  // 例外の文は stack の直前の行(Node の内部の行を除く)
  const msg = judgeOutput({ stdout: '', stderr: 'node:internal/modules/run_main:123\n    triggerUncaughtException(\n    ^\n\npage.evaluate: Target closed\n    at live (file:///x/a.mjs:1:2)', rc: 1, killed: false });
  if (msg.verdict !== 'exception' || msg.why[0] !== 'page.evaluate: Target closed') bad.push('⑤ 例外の文の取り出し: ' + msg.why[0]);
  const msg2 = judgeOutput(J[J.length - 1][0]);
  if (!/^page\.goto: net::ERR_FILE_NOT_FOUND/.test(msg2.why[0] || '')) bad.push('⑤ 例外の文の取り出し(Call log の前): ' + msg2.why[0]);
  cases.push(`⑤ 判定の缶詰 ${J.length} 件(例外・門の偽・NaN なし・NaN・枠で止めた・ok:false・枠で止めた後の例外・NaN=false・既知の ok:false・基点 html の不在)が一致 ${J.length - miss.length}/${J.length}・例外の文の取り出し ${msg.why[0] === 'page.evaluate: Target closed'}`);
  // ⑥ 第304便e: 器に渡す基点 html は写しの根からの相対パス(木の中の基点 → その相対・木の外の基点 → 写しへ複写)/ 正本の ok と偽の門の読み
  const t6 = fs.mkdtempSync(path.join((opt && opt.tmpDir) || os.tmpdir(), 'w304e-smoke-'));
  try {
    const rt = path.join(t6, 'root'), sb = path.join(t6, 'sandbox'), out = path.join(t6, 'outside');
    for (const d of [path.join(rt, 'beta'), path.join(sb, 'beta'), out]) fs.mkdirSync(d, { recursive: true });
    fs.writeFileSync(path.join(rt, 'beta', '_w999_base.html'), 'in'); fs.writeFileSync(path.join(sb, 'beta', '_w999_base.html'), 'in');
    fs.writeFileSync(path.join(out, 'base.html'), 'out');
    const r1 = baseHtmlForSandbox(rt, sb, path.join(rt, 'beta', '_w999_base.html'));
    const r2 = baseHtmlForSandbox(rt, sb, path.join(out, 'base.html'));
    const r2ok = r2 && !path.isAbsolute(r2) && fs.readFileSync(path.join(sb, r2), 'utf8') === 'out';
    if (r1 !== 'beta/_w999_base.html' || !r2ok) bad.push(`⑥ 基点 html の相対パス: 木の中 ${r1}・木の外 ${r2}`);
    const v = canonVerdictOf({ ok: false, gates: { g1: true, g4: false } }), v2 = canonVerdictOf({ ok: true });
    if (!v || v.ok !== false || v.falseGates.join(',') !== 'g4' || !v2 || v2.ok !== true || v2.falseGates.length) bad.push('⑥ 正本の ok と偽の門の読み');
    cases.push(`⑥ 器に渡す基点 html: 木の中 → ${r1}・木の外 → ${r2}(複写 ${!!r2ok})・正本の偽の門の読み ${v ? v.falseGates.join(',') : '—'}`);
  } finally { fs.rmSync(t6, { recursive: true, force: true }); }
  return { version: HARNESS_SMOKE_VERSION, ok: bad.length === 0, bad, cases };
}

// ---------------------------------------------------------------------------------------------
// main
// ---------------------------------------------------------------------------------------------
async function main(argv) {
  const root = path.resolve(getArg(argv, '--root', TOOL_ROOT));
  const rel = (p) => (p ? (path.isAbsolute(p) ? p : path.join(root, p)) : null);
  if (argv.includes('--self-test')) {
    const r = await selfTest({ root });
    for (const c of r.cases) console.log('  ' + c);
    console.log(`harness-smoke --self-test: ${r.ok ? 'OK' : 'NG —— ' + r.bad.join(' / ')}`);
    process.exit(r.ok ? 0 : 1);
  }
  const T0 = Date.now();
  const baseHtml = rel(getArg(argv, '--base', null));
  const htmlOverride = rel(getArg(argv, '--html', null));
  const baseRev = getArg(argv, '--base-rev', null);
  const lanes = Number(getArg(argv, '--lanes', 2));
  const budget = Number(getArg(argv, '--budget', 90));
  const maxMinutes = Number(getArg(argv, '--max-minutes', 30));
  const keysArg = getArg(argv, '--keys', null);
  const indirect = argv.includes('--indirect');
  const wide = argv.includes('--wide') || indirect;
  const listOnly = argv.includes('--list');
  if (!baseHtml && !keysArg) { console.error('harness-smoke: --base <基点 html>(か --keys)が要る'); process.exit(2); }
  const outDir = path.resolve(getArg(argv, '--out-dir', path.join(os.tmpdir(), 'harness-smoke-' + new Date().toISOString().replace(/[:.]/g, '').slice(0, 15))));
  const L = await libs(root);
  const nowHtml = htmlOverride || path.join(root, 'beta', 'index.html');
  const now = await htmlFacts(L, nowHtml);
  let cs = { names: new Set(), hp: new Set(), presets: new Set(), presetsAccOnly: new Set(), core: false, empty: true };
  if (baseHtml) cs = changeSet(await htmlFacts(L, baseHtml), now);
  let codeChanged = null;
  const headRev = getArg(argv, '--head-rev', null);
  const gitDirArg = getArg(argv, '--git-dir', null);
  if (baseRev) {
    // 作業ツリーとの差(既定 —— 未コミットの変更も入る)か、--head-rev との版どうしの差(git archive で取り出した木を --root にするとき)
    const args = headRev ? (gitDirArg ? ['--git-dir', gitDirArg] : ['-C', root]).concat(['diff', '--name-only', baseRev, headRev, '--', 'tests'])
      : ['-C', root, 'diff', '--name-only', baseRev, '--', 'tests'];
    try { codeChanged = new Set(execFileSync('git', args, { encoding: 'utf8' }).split('\n').filter(Boolean)); }
    catch (e) { console.error('harness-smoke: --base-rev の差が引けない: ' + String(e.message || e).slice(0, 120)); }
  }
  const rows = classifySteps({ root, now, cs, codeChanged, indirect, L });
  let sel;
  if (keysArg) { const want = keysArg.split(','); sel = rows.filter((r) => want.includes(r.key) && r.harness); for (const r of sel) if (!r.prio) r.prio = 1; }
  else sel = rows.filter((r) => r.prio > 0 && (r.prio <= PRIO.all || (r.prio === PRIO.hub && wide) || (r.prio === PRIO.closure && indirect)));
  sel.sort((a, b) => a.prio - b.prio || (Number(a.sec) || 0) - (Number(b.sec) || 0));
  const cnt = (f) => sel.filter(f).length;
  console.log(`harness-smoke: ${baseHtml ? path.relative(root, baseHtml) : '(基点なし)'} → ${path.relative(root, nowHtml)}`
    + `(差: 名前 ${cs.names.size}・HP の口 ${cs.hp.size}・プリセット ${cs.presets.size}〔受理後だけ ${cs.presetsAccOnly.size}〕・S._core ${cs.core ? '変わった' : '同じ'}`
    + (codeChanged ? `・器/lib ${[...codeChanged].filter((f) => /^tests\/(exp|lib)-/.test(f)).length}` : '') + ')');
  if (cs.names.size) console.log('  変わった名前: ' + [...cs.names].slice(0, 12).join(', ') + (cs.names.size > 12 ? ` 他 ${cs.names.size - 12}` : ''));
  if (cs.presets.size) console.log('  変わったプリセット: ' + [...cs.presets].slice(0, 12).join(', ') + (cs.presets.size > 12 ? ` 他 ${cs.presets.size - 12}` : ''));
  const nHub = rows.filter((r) => r.prio === PRIO.hub).length, nIndirect = rows.filter((r) => r.prio === PRIO.closure).length;
  console.log(`  ハブの名前(宣言の ${HUB_SHARE * 100}% 以上が持つ): ${(rows.hubs || []).join(', ') || 'なし'}`);
  console.log(`  選ぶ段 ${sel.length}(名前/core/コード ${cnt((r) => r.prio === 1)}・プリセット/all ${cnt((r) => r.prio === 2)}`
    + (wide ? `・ハブだけ ${cnt((r) => r.prio === 3)}` : ` / ハブだけ ${nHub} は --wide で`)
    + (indirect ? `・閉包だけ ${cnt((r) => r.prio === 4)}` : ` / 閉包だけ ${indirect ? '' : '(--indirect で数える)'}`) + `)・外した段 ${rows.filter((r) => r.skip).length}(履歴・常時群・html を書く段・鎖の脚本の段)`);
  const plan = { version: HARNESS_SMOKE_VERSION, root, base: baseHtml, html: nowHtml, baseRev, change: { names: [...cs.names], hp: [...cs.hp], presets: [...cs.presets], core: cs.core },
    selected: sel.map((r) => ({ key: r.key, harness: r.harness, prio: r.prio, sec: r.sec, declKind: r.declKind, hits: r.hits, knob: SMOKE_KNOBS[r.key] ? SMOKE_KNOBS[r.key].note : null })) };
  if (listOnly) {
    for (const r of sel) console.log(`  ${String(r.prio)} ${r.key.padEnd(20)} ${String(r.sec).padStart(6)} s ${r.declKind}  ${[r.hits.roots.slice(0, 3).join(' '), r.hits.presets.slice(0, 3).join(' '), r.hits.all ? 'all' : '', r.hits.core ? 'core' : '', r.hits.code.slice(0, 2).join(' '), r.hits.hub.length ? 'ハブ ' + r.hits.hub.slice(0, 2).join(' ') : '', r.hits.closure.slice(0, 2).join(' ')].filter(Boolean).join(' / ')}`);
    const js = getArg(argv, '--json', null); if (js) fs.writeFileSync(path.resolve(js), JSON.stringify(plan, null, 1));
    process.exit(0);
  }
  fs.mkdirSync(outDir, { recursive: true });
  const logDir = path.join(outDir, 'logs'), tmpDir = path.join(outDir, 'tmp');
  fs.mkdirSync(logDir, { recursive: true }); fs.mkdirSync(tmpDir, { recursive: true });
  const sandbox = makeSandbox(root, path.join(outDir, 'root'), htmlOverride);
  let gitDir = gitDirArg;
  if (!gitDir) { try { gitDir = execFileSync('git', ['-C', root, 'rev-parse', '--absolute-git-dir'], { encoding: 'utf8' }).trim(); } catch { gitDir = null; } }
  console.log(`  写し ${sandbox}(git ${gitDir || 'なし'})・レーン ${lanes}・枠 ${budget} s・全体の枠 ${maxMinutes} min`);
  const baseRel = baseHtmlForSandbox(root, sandbox, baseHtml);
  if (baseHtml) console.log(`  器に渡す基点 html(BASE_HTML —— 写しの根からの相対): ${baseRel}`);
  const res = await runPool(sel, { root, sandbox, logDir, tmpDir, gitDir, lanes, budget, maxMinutes, baseRel, baseRev }, console.log);
  const n = (v) => res.filter((x) => x.verdict === v).length;
  const ng = n('exception') + n('gate') + n('nan');
  const summary = `harness-smoke: 走らせた ${res.length - n('not-run')}/${sel.length} 段・例外 ${n('exception')}・門の偽 ${n('gate')}・NaN ${n('nan')}・既知(基点の正本でも ok:false)${n('known')}・`
    + `枠で止めた(問題なし)${res.filter((x) => x.verdict === 'ok' && x.killed).length}・完走 ${res.filter((x) => x.verdict === 'ok' && !x.killed).length}・未実行 ${n('not-run')} —— `
    + `${ng ? 'NG' : 'OK'}(所要 ${((Date.now() - T0) / 60000).toFixed(1)} min・ログ ${logDir})`;
  console.log(summary);
  Object.assign(plan, { results: res, summary, ok: ng === 0, elapsedMin: +((Date.now() - T0) / 60000).toFixed(2) });
  fs.writeFileSync(path.join(outDir, 'smoke.json'), JSON.stringify(plan, null, 1));
  const js = getArg(argv, '--json', null); if (js) fs.writeFileSync(path.resolve(js), JSON.stringify(plan, null, 1));
  if (!argv.includes('--keep')) fs.rmSync(sandbox, { recursive: true, force: true });
  process.exit(ng ? 1 : 0);
}

const IS_MAIN = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (IS_MAIN) await main(argv0);
