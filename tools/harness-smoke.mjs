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
//   --list(選ぶだけ・走らせない)/ --keys a,b(段を名指し)/ --wide(ハブの名前だけの段も)/ --indirect(閉包だけの段も)/ --lanes 2 / --budget 90 / --max-minutes 30(--wide・--indirect の既定は 90 —— 第322便d)/
//   --json <file> / --out-dir <dir>(既定 $TMPDIR/harness-smoke-<時刻>)/ --root <dir>(別の木 —— 例: git archive で取り出した過去の状態)/
//   --git-dir <dir>(写しの中の `git -C ROOT show` が読む git —— 既定は --root の git)/ --head-rev <rev>(--base-rev との版どうしの差 —— 取り出した木のとき)/
//   --html <候補 html>(写しの beta/index.html を差し替える)/ --keep(写しを残す)/
//   --self-test(器を走らせない自己試験 —— QA lint.harnessSmoke303 と同じ関数)/
//   --fingerprint <記録>(第323便b —— 窓の出力の物理の値の指紋を記録へ。--base も --keys も無ければ**窓のある段を全部**〔簡易一致を使わない段は除く〕・
//     既定の枠は 1 段 900 s・全体 150 min〔--budget・--max-minutes で上書き〕—— 窓を最後まで走らせた段だけ指紋を取る)
//
// ■ 言わないこと
//   ・「煙試験が通ったので鎖が通る」(器の窓は最初の数段だけ —— 値の転記のずれは鎖の後の tools/pregate-transcript.mjs が見る)。
//   ・「選ばれなかった器は壊れない」(閉包だけの差 —— --indirect —— と、宣言の無い器の動的な読みは見ない)。
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawn, execFileSync } from 'node:child_process';
import { fileURLToPath, pathToFileURL } from 'node:url';
import v8 from 'node:v8';   // 第325便d: --fingerprint の記録の頭の heap

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
  // 第336便(統括): 'synodic-299b'・'refit-298b' の窓は外した(第336便a で履歴の段へ回した —— 窓の表は現行の段だけ)
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
  // ==== 第321便b の塊(ここから)====
  'geo3bin-321b': { env: { W321B_QUICK: '1', W321B_OUT: 'tests/out/_smoke-geo3bin-w321b.json' }, note: '試走(窓 3 公転・刻み h・h/2・玩具 2 つ —— 約 13 s。正本は子プロセス 2 本で約 80〜110 s〔並走の秒〕)' },   // 第321便b
  // ==== 第321便b の塊(ここまで)====
  // ==== 第321便c の塊(ここから)====
  'galfield-321c': { env: { W321C_QUICK: '1', W321C_WORKERS: '1', W321C_OUT: 'tests/out/_smoke-galfield-w321c.json' }, note: '試走(G0 の窓を 200 步・40 步に・場の表 R 2 × z 3・分割 2 × 2・格子 2 段・復元の点 4 —— 1 プロセスで約 23 s。正本は子プロセス 2 本〔並走の秒〕)' },   // 第321便c
  // ==== 第321便c の塊(ここまで)====
  // ==== 第322便a の塊(ここから)====
  'geo2flat-322a': { env: { W322A_QUICK: '1', W322A_WORKERS: '1', W322A_OUT: 'tests/out/_smoke-geo2flat-w322a.json' }, note: '試走(gate を 600 步・trial を 300 步・退化と照合の步を縮める —— 1 プロセス。正本は gate と trial の 4 行を子プロセス 2 本〔12000 步 × A と B〕)' },   // 第322便a
  // ==== 第322便a の塊(ここまで)====
  // ==== 第322便b の塊(ここから)====
  'binbooks-322b': { env: { W322B_QUICK: '1', W322B_OUT: 'tests/out/_smoke-binbooks-w322b.json' }, note: '試走(窓 3 公転・刻み h・h/2 —— 約 13〜19 s。正本は子プロセス 2 本・8 公転・h・h/2・h/4)' },
  // ==== 第322便b の塊(ここまで)====
  // ==== 第322便c の塊(ここから)====
  'fieldcontract-322c': { env: { W322C_QUICK: '1', W322C_WORKERS: '1', W322C_OUT: 'tests/out/_smoke-fieldcontract-w322c.json' }, note: '試走(走行 1 公転・刻み h と h/2・k_F の列 2 場面・グループの受け手 2 体 × R_cut 2 つ・J だけ —— 1 プロセスで約 20 s〔並走の秒〕。正本は子プロセス 2 本)' },   // 第322便c
  // ==== 第322便c の塊(ここまで)====
  // ==== 第323便c の塊(ここから)====
  // 第323便c(決断事項 AN517・AN518・統括の検証項目 R277): **窓の無い大きい 16 段の簡易の窓**。器の本文は変えない —— 器に元から在る環境変数・引数で窓を開ける
  //   (器のコードを変えると、その段と器を import する段が鎖で走らせ直しになる・nslock は AN516 の影の照合〔門 G1 の器の sha〕を保つ)。欄(lint.quickWindows323):
  //   env(環境変数)・args(cmd の器の後に足す引数 —— 窓を引数でしか開けない器)・cmd(cmd が器 1 本でない段の窓の cmd —— emgrid・dragcore292)・
  //   out(窓の出力 —— **走らせる前に消す**〔器が既存の出力の他の段を残す型のため〕・指紋を取るファイル)・sec(窓の秒の実測 —— 煙試験 --lanes 1 の 2 回〔混む箱〕の大きい方・枠を sec × 2 + 30 まで延ばす)・
  //   fullSec(フルの秒 —— tests/data-w311c-regensec.json の見積り)・covers(窓が走らせる部分)。既定の経路(環境変数・引数なし)は器の本文のまま
  'shell-304b': { env: { W304B_PARTS: 'Z,A', W304B_OUT: 'tests/out/_smoke-shell-w304b.json' }, out: 'tests/out/_smoke-shell-w304b.json', sec: 9, fullSec: 4121,
    covers: '段 Z(殻の核の閉形式・自己項の 1 步の u・包みの素通り —— 水星の本の 2000 步)・A(解析の表)', note: '段 Z・A だけ(水星の根 M・移送 T・地球–月 E・多体 K〔M の根を読む —— M なしでは門 manyBodyReadout が偽〕・P はフル)' },
  // 第325便d(R287): emgrid・charon-h2・dragcore292・charonk・nslock・charoneps-h4 の 6 段は**環境変数の窓**へ(窓の走行は第323便c の行と同じ cmd・同じ環境 ——
  //   器が引数しか読まない段は HS_ARG_* を harness-smoke が引数に写す〔SMOKE_ARG_ENV —— 第325便d の塊〕・段の行の cmd と器の本文は変えない)。第323便c の行は W325D_KNOBS_323C
  'emgrid': { cmd: 'node tests/exp-w280b-emgrid.mjs', env: { HS_ARG_ROWS: 'E0,E1,E2,E3,E4,E5,E6,E7,E8,S0', HS_ARG_DT: '0.016', HS_ARG_SMOKE: '1', HS_ARG_PART: 'tests/out/_smoke-emgrid-w280b.json' },
    out: 'tests/out/_smoke-emgrid-w280b.json', sec: 155, fullSec: 2246,
    covers: '10 行(E0〜E8・S0)を dt 0.016 で 3 公転(器の --smoke —— 窓 2・3 公転)', note: '器の --smoke(10 行 × 3 公転・dt 0.016 —— 手動の段の 4 分割と dt/2 の 3 行はフル)' },
  'inertialr2-303b': { env: { W303B_QUICK: '1', W303B_PARTS: 'Z,M,K', W303B_OUT: 'tests/out/_smoke-inertialr2-w303b.json' }, out: 'tests/out/_smoke-inertialr2-w303b.json', sec: 70, fullSec: 1237,
    covers: '段 Z(零試験と閉形式)・M(水星で変種ごとの λ —— 器の QUICK で刻み h・h/2)・K(多体)', note: 'QUICK(h・h/2)・段 Z・M・K だけ(移送 T・G_loc の表 N・地球–月 E はフル)' },
  'chainburst-301d': { env: { W301D_ONLY: '^(?:B\\.validate|B\\.validate3d|C\\.split\\.1|C\\.semic\\.1|D\\.engine\\.gain0|D\\.engine\\.n40|F\\.engine\\.1|F\\.rk4\\.1|G\\.rk4\\.gain0)$', W301D_PAR: '1',
    W301D_OUT: 'tests/out/_smoke-chainburst-w301d.json' }, out: 'tests/out/_smoke-chainburst-w301d.json', sec: 54, fullSec: 1059,
    covers: '仕事 9 本(受理の確かめ 2・分割と semic の h・エンジンの gain 0 と n 40・二体の h・RK4 の h・殻の RK4 の gain 0)', note: '仕事 9 本だけ(器の W301D_ONLY —— 門と判断は出さない・h/2 より細かい刻みと長い仕事はフル)' },
  'gfamily-305b': { env: { W305B_PARTS: 'Z,D', W305B_OUT: 'tests/out/_smoke-gfamily-w305b.json' }, out: 'tests/out/_smoke-gfamily-w305b.json', sec: 137, fullSec: 1017,
    covers: '段 Z(写しの記録・抽出器の自己試験・G_loc だけの近点)・D(🟫 の二次元と三次元の写し)', note: '段 Z・D だけ(水星の k の根 M・移送 T・周期 P・太陽 S はフル)' },
  'periodn-306b': { env: { W306B_PARTS: 'Z,P', W306B_PLANETS: 'mercurySunInertial3d', W306B_OUT: 'tests/out/_smoke-periodn-w306b.json' }, out: 'tests/out/_smoke-periodn-w306b.json', sec: 74, fullSec: 1135,
    covers: '段 Z(零試験)・P(周期の表 —— 水星の 1 本だけ)', note: '段 Z・P だけ・水星の 1 本(器の W306B_PLANETS —— 6 本の移送・再フィット R・共通の GM G・月 E・時系 T はフル)' },
  'charon-h2': { env: { HS_ARG_STEPS: '4140000', HS_ARG_ONLY: 'C0,C1,C6' }, out: 'tests/out/charon-w272b-probe.json', sec: 32, fullSec: 1062,
    covers: '列 C0・C1・C6 を h/2 で 4140000 步(段の規定步数の 1/10 —— 約 6 公転)', note: '列 C0・C1・C6・步数 1/10(器の --only・--steps —— 規定步数に満たない走行は正本を書かず probe へ)' },
  'dragcore292': { cmd: 'node tests/exp-w323c-dragcorequick.mjs', env: { W323C_DRAGCORE_OUT: 'tests/out/_smoke-dragcore-w292c.json' }, out: 'tests/out/_smoke-dragcore-w292c.json', sec: 49, fullSec: 925,
    covers: '純関数の自己試験・器の門 (b)〜(e)・宣言の gain と dragCore で 8 公転 1 本(器の childTask)', note: '窓の器 tests/exp-w323c-dragcorequick.mjs(器の関数をそのまま —— 27 公転のフィット・118 公転・感度・h/2 はフル)' },
  'geo3': { args: ['--quick'], env: { W280_SP: 'tests/out/_smoke-geo3' }, out: 'tests/out/_smoke-geo3/geo3-w280c.quick.json', sec: 61, fullSec: 894,
    covers: '全項 (a)〜(h) を窓 1/20 で(器の --quick)', note: '器の --quick(窓 1/20 —— 出力は W280_SP の下)' },
  'earthmoon-303c': { env: { W303C_LONG: '118', W303C_PARTS: 'audit', W303C_OUT: 'tests/out/_smoke-earthmoon-w303c.json' }, out: 'tests/out/_smoke-earthmoon-w303c.json', sec: 99, fullSec: 726,
    covers: '段 audit(エンジンの引きずり OFF と宣言・参照積分・平均の要素)を長窓 118 公転で', note: '長窓 118 公転(既定 1062)・段 audit だけ(radius・sunbg・ident はフル)' },
  'charonk': { env: { HS_ARG_STEPS: '2070000', HS_ARG_ITERS: '3' }, out: 'tests/out/charonk-w273b-probe.json', sec: 53, fullSec: 744,
    covers: 'C3 の二分探索 3 回・C2 の 6 点・ε 系列・宣言鍵の同値性を步数 1/10(約 6 公転)で', note: '步数 1/10・二分探索 3 回(器の --steps・--iters —— 規定步数に満たない走行は正本を書かず probe へ・3 段は走らない)' },
  'nslock': { env: { HS_ARG_ONLY: 'psrDoubleABDFM', HS_ARG_VARIANTS: 'builtin,lock', HS_ARG_OUT: 'tests/out/_smoke-nslock-w272c.json' }, out: 'tests/out/_smoke-nslock-w272c.json', sec: 17, fullSec: 733,
    covers: '⚡ psrDoubleABDFM の変種 builtin・lock(h・h/2・h/4 —— 20 近点の窓)', note: '⚡ の 2 変種だけ(器の --only・--variants・--out —— 器の本文は変えない〔AN516 の影の照合の門 G1〕)' },
  'emresolve-306c': { env: { W306C_LONG: '118', W306C_PARTS: 'solve,measure,phase,attrib', W306C_OUT: 'tests/out/_smoke-emresolve-w306c.json' }, out: 'tests/out/_smoke-emresolve-w306c.json', sec: 64, fullSec: 729,
    covers: '段 solve・measure・phase・attrib を長窓 118 公転で(初期配置の解き直し・J₂ あり/なしの測定・起点の位相・寄与の分け)', note: '長窓 118 公転(既定 1062)・段 solve・measure・phase・attrib だけ(ledger・emo・record はフル)' },
  'charoneps-h4': { env: { HS_ARG_STEPS: '4140000', HS_ARG_ONLY: 'E_base_e0.05,E_diag_e0.5' }, out: 'tests/out/charon-w272b-probe.json', sec: 34, fullSec: 721,
    covers: 'ε 列 E_base_e0.05・E_diag_e0.5 を h/4 で 4140000 步(段の規定步数の 1/20 —— 約 3 公転)', note: 'ε 列 2 本・步数 1/20(器の --only・--steps —— 正本を書かず probe へ・charon-h2 の窓と同じ probe —— 同時に走らせない)' },
  'baseline-304c': { env: { W304C_PARTS: 'emo', W304C_OUT: 'tests/out/_smoke-baseline-w304c.json' }, out: 'tests/out/_smoke-baseline-w304c.json', sec: 47, fullSec: 685,
    covers: '段 emo(🌔 の写し・h と h/2・引きずり ON の対照・🌦️ との差)', note: '段 emo だけ(solve・measure・record はフル)' },
  'an336-306a': { env: { W306A_PARTS: 'A,M', W306A_OUT: 'tests/out/_smoke-an336-w306a.json' }, out: 'tests/out/_smoke-an336-w306a.json', sec: 195, fullSec: 721,
    covers: '段 A(1PN + A1 の契約と標的)・M(水星の根 —— 正本の時刻で 87 s・フルの 12%)', note: '段 A・M だけ(移送 T・対ごとの行 R・門 G はフル —— エンジンを走らせる段はどれも M の根を読む)' },
  // ==== 第323便c の塊(ここまで)====
  // ==== 第324便a の塊(ここから)====
  // 第324便a(決断事項 AN513・AN510・統括の検証項目 R279): 器に元から在る環境変数の試走(W324A_QUICK —— 器の本文の既定の経路は変えない)
  'geo2thick-324a': { env: { W324A_QUICK: '1', W324A_WORKERS: '1', W324A_OUT: 'tests/out/_smoke-geo2thick-w324a.json' }, note: '試走(平面の写しの門 600 步・対の本 300 步・h/2 600 步・AN510 の小さい系 12 体 × 60 步・保存と復帰 6 步 —— 1 プロセスで約 40 s。正本は flat と pair の 7 行を子プロセス 2 本〔12000 步・h/2 は 24000 步〕)' },
  // ==== 第324便a の塊(ここまで)====
  // ==== 第324便b の塊(ここから)====
  'obsspin-324b': { env: { W324B_QUICK: '1', W324B_WORKERS: '1', W324B_OUT: 'tests/out/_smoke-obsspin-w324b.json' }, note: '試走(窓 3 公転・刻み h・h/2・列を減らす —— 1 プロセス・約 8〜15 s。正本は子プロセス 2 本・8 公転・h・h/2・h/4)' },
  // ==== 第324便b の塊(ここまで)====
  // ==== 第311便b の塊(ここまで)====
});

/** 煙試験の全段に渡す既定(子プロセスの並列数を 1 に —— 器の注記どおり結果は並列数に依らない・箱を 2 レーンより多く占めない)。 */
export const SMOKE_ENV_DEFAULTS = Object.freeze(Object.fromEntries(['W284A', 'W285A', 'W286A', 'W287A', 'W288A', 'W292C', 'W293D', 'W293E', 'W295C', 'W296B', 'W297B',
  'W298C', 'W299C', 'W300C'].map((k) => [k + '_WORKERS', '1'])));

// ==== 第323便c の塊(ここから)====
/** 第323便c(R277): 窓の cmd を持つ段の器(窓の cmd の `node tests/exp-*.mjs`)。窓の cmd が無ければ null。 */
export function w323cKnobHarness(key) {
  const k = SMOKE_KNOBS[key];
  if (!k || typeof k.cmd !== 'string') return null;
  const m = /^(?:[A-Z0-9_]+=\S+\s+)*node (tests\/exp-[\w.-]+\.mjs)(?:\s|$)/.exec(k.cmd);
  return m ? m[1] : null;
}
/** 第323便c(R277): 窓の走行の cmd —— 窓の cmd があればそれ・無ければ段の cmd(最初の器)に窓の引数 args を足す(引数は空白を含まない語だけ)。 */
export function w323cKnobCmd(baseCmd, knob) {
  if (knob && typeof knob.cmd === 'string') return knob.cmd;
  const a = (knob && Array.isArray(knob.args)) ? knob.args : [];
  for (const x of a) if (!/^[\w.,:=\/+-]+$/.test(String(x))) throw new Error('窓の引数に空白か記号がある: ' + x);
  return a.length ? baseCmd + ' ' + a.join(' ') : baseCmd;
}
/** 第323便c(R277): 窓の枠(秒)—— 窓の秒 sec を持つ行は max(--budget, sec × 2 + 30)(窓が終わるまで —— 指紋は完走した窓で取る)・無い行は --budget のまま。 */
export function w323cKnobLimit(knob, budget) {
  return (knob && Number.isFinite(knob.sec) && knob.sec > 0) ? Math.max(budget, knob.sec * 2 + 30) : budget;
}
// ==== 第323便c の塊(ここまで)====

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
  if (!m || /[(（]/.test(st.cmd.split(' && ')[0].replace(/\$BASE_HTML/g, ''))) {
    const w323cKc = w323cKnobHarness(st.key);   // 第323便c: cmd が器 1 本でない段(手動の段 emgrid)は窓の cmd の器で選び・走らせる
    return w323cKc ? { harness: w323cKc } : { skip: '鎖の脚本の段(cmd が器 1 本でない)' };
  }
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
      knob ? w325dKnobEnv(knob) : {}, o.baseRel ? { BASE_HTML: o.baseRel } : {});   // 第325便d: HS_ARG_* は器に渡さない(引数に写す)
    if (!env.PLAYWRIGHT_CORE_DIR && fs.existsSync('/opt/node22/lib/node_modules/playwright')) env.PLAYWRIGHT_CORE_DIR = '/opt/node22/lib/node_modules/playwright';
    const cmd = w325dKnobCmd(row.cmd.split(' && ')[0].replace(/\$BASE_HTML/g, '"$BASE_HTML"'), knob);   // 第323便c: 窓の cmd・引数 / 第325便d: HS_ARG_* を引数に
    w325dClearOut(o.sandbox, knob);   // 第325便d: 窓の出力(out)を写しから消してから走らせる(第323便c の欄の約束 —— 指紋はこの走行の出力だけ)
    const t0 = Date.now();
    const ch = spawn('bash', ['-c', cmd], { cwd: o.sandbox, env, detached: true, stdio: ['ignore', 'pipe', 'pipe'] });
    let stdout = '', stderr = '', killed = false, cutOut = null, cutErr = null;
    const cap = (s, x) => (s.length > 400000 ? s : s + x);
    ch.stdout.on('data', (d) => { stdout = cap(stdout, d.toString()); });
    ch.stderr.on('data', (d) => { stderr = cap(stderr, d.toString()); });
    const kill = () => { killed = true; cutOut = stdout.length; cutErr = stderr.length; try { process.kill(-ch.pid, 'SIGTERM'); } catch { /* 終わっている */ }
      setTimeout(() => { try { process.kill(-ch.pid, 'SIGKILL'); } catch { /* 終わっている */ } }, 3000).unref(); };
    const limit = full ? Math.max(o.budget, Number(row.sec) * 1.5 + 30) : w323cKnobLimit(knob, o.budget);   // 第323便c: 窓の秒(sec)を持つ行は窓が終わるまで
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
      const x = { key: row.key, harness: row.harness, prio: row.prio, mode: knob ? 'knob' : (full ? 'full' : 'cap'), knob: knob ? knob.note : null,
        rc: killed ? null : rc, killed, sec: +sec.toFixed(1), limitSec: Math.round(limit), verdict: j.verdict, why: j.why };
      // 第323便b: --fingerprint —— 窓の出力の物理の値の指紋(fpCapture323)
      if (o.fp) { try { x.fp = fpCapture323(row, x, { o, t0, knob, stdout }); } catch (e) { x.fp = { key: row.key, fingerprint: null, why: '指紋が引けない: ' + String(e && e.message || e).slice(0, 120) }; } }
      resolve(x);
    });
  });
}

async function runPool(rows, o, log) {
  const res = [];
  const queue = rows.slice();
  const t0 = Date.now();
  const busy = new Set();   // 第325便d: 同じ窓の出力(out)を書く段は同時に走らせない(charon-h2 と charoneps-h4 の probe)
  const lane = async () => {
    while (queue.length) {
      if ((Date.now() - t0) / 60000 > o.maxMinutes) { const r = queue.shift(); res.push({ key: r.key, harness: r.harness, prio: r.prio, verdict: 'not-run', why: ['時間の枠(--max-minutes ' + o.maxMinutes + ')の外'] }); continue; }
      const k = w325dPick(queue, busy);
      if (k < 0) { await new Promise((ok) => setTimeout(ok, 500)); continue; }
      const r = queue.splice(k, 1)[0], ob = w325dOutOf(r.key);
      if (ob) busy.add(ob);
      let x;
      try { x = await runOne(r, o); } finally { if (ob) busy.delete(ob); }
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

// ==== 第322便d の塊(ここから)====
// 第322便d(統括の検証項目 R273 —— 第321便の運用の教訓: `--wide` の 158 段が既定の全体の枠 30 min で 108 段まで —— 未実行 50 段・例外 0 の終わりの行が「OK」)。
//   ① 全体の枠の既定: `--wide`(か `--indirect`)のときは MAX_MINUTES_WIDE(90 min)・それ以外は 30 min のまま。`--max-minutes` を書けばそれが勝つ。
//      90 の根拠(PHYSICS〔第322便d〕): 第321便の --wide の 158 段(2 レーン・枠 90 s)は、走った 108 段が 30.6 min・残りの 50 段は段の表の秒の順で後ろ
//      (枠 90 s か窓の試走)—— 上限の見積り(段ごとに枠の秒・2 レーン)で残り 37.5 min・合わせて約 68 min。90 min はその上に 3 割の余裕。
//   ② 終わりの行: 未実行の段があれば **「未完 —— 未実行 n 段」**(「OK」と並べない —— 例外・門の偽・NaN が 0 でも「走らせた段は問題なし・未実行の段は見ていない」)。
//      未実行の段の key を別の行に並べる(続きは `--keys <未実行の段>` で)。smoke.json に complete・notRun・notRunKeys。終了コードは従来どおり(NG のときだけ 1)。
export const SMOKE_WIDE_VERSION = 'w322d-smoke-wide-1';
export const MAX_MINUTES_DEFAULT = 30;
export const MAX_MINUTES_WIDE = 90;
/** 全体の枠(分): --max-minutes を書けばそれ・--wide か --indirect なら MAX_MINUTES_WIDE・それ以外は MAX_MINUTES_DEFAULT。 */
export function maxMinutesOf(argv) {
  const i = argv.indexOf('--max-minutes');
  if (i >= 0 && argv[i + 1] !== undefined && Number.isFinite(Number(argv[i + 1]))) return Number(argv[i + 1]);
  return (argv.includes('--wide') || argv.includes('--indirect')) ? MAX_MINUTES_WIDE : MAX_MINUTES_DEFAULT;
}
/** 終わりの行(純関数 —— 自己試験が缶詰で照合する)。res = runPool の結果・nSel = 選んだ段の数・o = { elapsedMin, logDir, maxMinutes }。 */
export function smokeSummary(res, nSel, o) {
  const n = (v) => res.filter((x) => x.verdict === v).length;
  const ng = n('exception') + n('gate') + n('nan');
  const notRun = n('not-run');
  const notRunKeys = res.filter((x) => x.verdict === 'not-run').map((x) => x.key);
  const tail = ng ? 'NG' : (notRun ? `未完 —— 未実行 ${notRun} 段(全体の枠 --max-minutes ${o.maxMinutes} の外 —— 走らせた段は問題なし・未実行の段は見ていない)` : 'OK');
  const line = `harness-smoke: 走らせた ${res.length - notRun}/${nSel} 段・例外 ${n('exception')}・門の偽 ${n('gate')}・NaN ${n('nan')}・既知(基点の正本でも ok:false)${n('known')}・`
    + `枠で止めた(問題なし)${res.filter((x) => x.verdict === 'ok' && x.killed).length}・完走 ${res.filter((x) => x.verdict === 'ok' && !x.killed).length}・未実行 ${notRun} —— `
    + `${tail}(所要 ${Number(o.elapsedMin).toFixed(1)} min・ログ ${o.logDir})`;
  const rest = notRun ? `  未実行の段(続きは --keys で): ${notRunKeys.join(',')}` : null;
  return { line, rest, ng, notRun, notRunKeys, complete: notRun === 0 };
}
/** 自己試験(器を走らせない)。 */
export function smokeWideSelfTest() {
  const bad = [];
  const m = [[['--wide'], 90], [['--indirect'], 90], [[], 30], [['--wide', '--max-minutes', '45'], 45], [['--max-minutes', '10'], 10]];
  for (const [a, w] of m) if (maxMinutesOf(a) !== w) bad.push('枠の既定 ' + a.join(' ') + ' → ' + maxMinutesOf(a));
  const R = [{ key: 'a', verdict: 'ok', killed: false }, { key: 'b', verdict: 'ok', killed: true }, { key: 'c', verdict: 'not-run' }, { key: 'd', verdict: 'not-run' }];
  const s1 = smokeSummary(R, 4, { elapsedMin: 90.2, logDir: '/x', maxMinutes: 90 });
  if (/—— OK/.test(s1.line) || !/未完 —— 未実行 2 段/.test(s1.line) || s1.complete || s1.rest !== '  未実行の段(続きは --keys で): c,d') bad.push('未実行の段がある終わりの行: ' + s1.line);
  const s2 = smokeSummary(R.slice(0, 2), 2, { elapsedMin: 3, logDir: '/x', maxMinutes: 30 });
  if (!/—— OK/.test(s2.line) || !s2.complete || s2.rest !== null) bad.push('全部走った終わりの行: ' + s2.line);
  const s3 = smokeSummary(R.concat([{ key: 'e', verdict: 'gate' }]), 5, { elapsedMin: 3, logDir: '/x', maxMinutes: 30 });
  if (!/—— NG/.test(s3.line) || s3.ng !== 1) bad.push('NG の終わりの行: ' + s3.line);
  return { version: SMOKE_WIDE_VERSION, ok: bad.length === 0, bad,
    cases: `枠の既定(--wide・--indirect → ${MAX_MINUTES_WIDE}・なし → ${MAX_MINUTES_DEFAULT}・--max-minutes が勝つ)・終わりの行(未実行 → 「未完 —— 未実行 n 段」と未実行の段の行・全部 → OK・NG → NG)` };
}
// ==== 第322便d の塊(ここまで)====

// ==== 第323便b の塊(ここから)====
// 第323便b(原仮定者の指示(2026-11-01)・決断事項 AN517/AN518・統括の検証項目 R276): **窓の出力の指紋の記録**(`--fingerprint <記録>`)。
//   簡易一致確認(β —— 理由が「領域」だけの段を簡易の窓で走らせ、前回のフルのときに同じ窓で取った指紋と同じなら物理の値はそのまま)の**材料**を、
//   煙試験の写し(scratch —— 正本は書かない)で窓を走らせて取る。段ごとに: 窓の環境(SMOKE_KNOBS の行か段の宣言 quickWindow)・この走行で書いた出力
//   (段の outs と、窓の環境が名指す tests/out/*.json —— 写しの中で走行の後に書かれたものだけ)の物理の値の hash(tests/lib-w323b-quick.mjs の physSha —— meta・
//   除外 Pointer・来歴と時刻・実行時刻と壁時計の欄名を除く)と、それらの指紋・窓の秒・器と lib の sha・html の sha・**その時点の木の正本**の物理の値の hash。
//   指紋は判定が ok(か既知)で枠で止めず出力を書いた走行だけ(それ以外は fingerprint:null と理由)。記録は既にある記録へ段の行を入れる(他の段は残す)。
//   --base も --keys も無ければ、窓のある段(簡易一致を使わない段 —— 常時群・較正の判定・html を書く段・quickVerify:false —— を除く)を全部選ぶ。
async function fpLib323(root) { return import(pathToFileURL(path.join(root, 'tests', 'lib-w323b-quick.mjs')).href); }
/** 窓のある段(簡易一致を使わない段を除く)。 */
async function fpSelect323(rows, root) {
  const Q = await fpLib323(root);
  const L = await libs(root);
  const cal = Q.calibrationSteps({ steps: L.RT.REGEN_STEPS, root });
  return rows.filter((r) => {
    const st = L.RT.REGEN_STEPS.find((z) => z.key === r.key);
    return st && r.harness && Q.stepWindow(st, SMOKE_KNOBS) && !Q.staticExclusion(st, cal);
  });
}
/** 記録の文脈(lib・表・html の sha・便)。 */
async function fpContext323(root, html) {
  const Q = await fpLib323(root);
  const L = await libs(root);
  let rev = null; try { rev = execFileSync('git', ['-C', root, 'rev-parse', '--short', 'HEAD'], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }).trim(); } catch { rev = null; }
  const text = fs.readFileSync(html, 'utf8');
  const wave = Number((text.match(/BETA_BUILD\s*=\s*"v[\d.]+-b(\d+)"/) || [])[1]) || null;
  return { Q, RT: L.RT, root, html, htmlSha: (await import('node:crypto')).createHash('sha256').update(text).digest('hex'), wave, rev, env: w325dProbeEnv(root) };   // 第325便d: 取った箱の環境
}
/** 1 段の走行から記録の行を作る(runOne の後 —— 写しの中で走行の後に書かれた出力だけを読む)。 */
function fpCapture323(row, x, c) {
  const { Q, RT, root } = c.o.fp;
  const st = RT.REGEN_STEPS.find((z) => z.key === row.key);
  const win = st ? Q.stepWindow(st, SMOKE_KNOBS) : null;
  const files = [];
  const fresh = (rel) => { try { return fs.statSync(path.join(c.o.sandbox, rel)).mtimeMs >= c.t0 - 1000; } catch { return false; } };
  const outs = row.outs || [];
  for (const f of outs) if (/\.json$/.test(f) && fresh(f)) files.push({ file: f, as: f, sha: Q.physShaFile(path.join(c.o.sandbox, f), f) });
  for (const v of Object.values((win && win.env) || {})) {
    if (!/^tests\/out\/[\w.-]+\.json$/.test(String(v)) || outs.includes(v) || !fresh(v)) continue;
    const as = outs.length === 1 ? outs[0] : v;   // 窓の出力の名を変える環境変数(*_OUT)—— 段の正本が 1 本ならその名で除外 Pointer を引く
    files.push({ file: v, as, sha: Q.physShaFile(path.join(c.o.sandbox, v), as) });
  }
  // 第325便d: 窓の欄 out(器が決める probe の名など —— 環境変数に名の無い窓の出力)も読む(env の名と同じなら重ねない)
  const ko = w325dFpOut(c.knob, outs, files);
  if (ko && fresh(ko)) { const as = outs.length === 1 ? outs[0] : ko; files.push({ file: ko, as, sha: Q.physShaFile(path.join(c.o.sandbox, ko), as) }); }
  const okRun = (x.verdict === 'ok' || x.verdict === 'known') && !x.killed && x.mode === 'knob';
  const fp = okRun ? Q.windowFingerprint(files) : null;
  const why = fp ? null : (x.mode !== 'knob' ? '窓の表 SMOKE_KNOBS に行が無い(' + x.mode + ' —— 段の宣言の窓は煙試験が使わない)'
    : !okRun ? '判定 ' + x.verdict + (x.killed ? '(枠で止めた)' : '') : (files.length ? '出力が読めない' : '窓が出力のファイルを書かない(標準出力だけ)'));
  const canon = {};
  for (const f of outs) canon[f] = Q.physShaFile(path.join(root, f), f);
  const cs = st ? Q.codeShaOf(st, root) : { sha: null, files: [] };
  return { key: row.key, harness: row.harness, window: win ? { source: win.source, env: win.env, note: win.note } : { source: 'none', env: {}, note: '' }, mode: x.mode,
    sec: x.sec, verdict: x.verdict, killed: !!x.killed, files: files.map((z) => ({ file: z.file, as: z.as, sha: z.sha })), fingerprint: fp, why,
    stdoutNormSha: Q.stdoutNormSha(c.stdout), codeSha: cs.sha, codeFiles: cs.files.length, htmlSha: c.o.fp.htmlSha, canon, node: process.version,
    at: new Date().toISOString(), wave: c.o.fp.wave, rev: c.o.fp.rev };
}
/** 記録を書く(既にある記録へ —— 段の行を置き換える)。 */
function fpWrite323(file, res, ctx) {
  const { Q } = ctx;
  let prev = null; try { prev = JSON.parse(fs.readFileSync(file, 'utf8')); } catch { prev = null; }
  const entries = res.map((r) => r.fp).filter(Boolean);
  const doc = Q.mergeRecord(prev, entries, { wave: ctx.wave, rev: ctx.rev, html: path.relative(ctx.root, ctx.html), htmlSha: ctx.htmlSha, node: process.version, at: new Date().toISOString(),
    env: ctx.env || undefined });   // 第325便d: 記録の頭の env(node・Chromium・platform・heap —— 鎖の env.json と照合する)
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, JSON.stringify(doc, null, 1) + '\n');
  const n = entries.length, nfp = entries.filter((e) => e.fingerprint).length;
  const summary = { file, wrote: n, fingerprinted: nfp, noFingerprint: entries.filter((e) => !e.fingerprint).map((e) => e.key + ':' + e.why), total: Object.keys(doc.steps).length };
  return { summary, line: `harness-smoke --fingerprint: ${n} 段を記録(指紋 ${nfp}・指紋なし ${n - nfp})→ ${file}(記録の段 ${summary.total})` };
}
// ==== 第323便b の塊(ここまで)====

// ==== 第325便d の塊(ここから)====
// 第325便d(統括の検証項目 R287 —— 簡易一致〔AN517/AN518〕の本運用の前の試験): **args/cmd の窓 6 段を環境変数の窓へ**(器の本文と段の行の cmd は変えない)。
//   ① SMOKE_ARG_ENV: 窓の行の環境変数 HS_ARG_*(harness-smoke の名 —— 器は読まない)を、走らせる前に器の引数へ写す(窓の行の env の並びの順)。器が引数しか読まない段
//      (charon-h2・charoneps-h4〔tests/exp-w272b-charon.mjs〕・charonk・nslock・emgrid)の窓を env で書く。HS_ARG_* は器に渡さない・値は空白と記号の無い語だけ。
//      dragcore292 は窓の器 tests/exp-w323c-dragcorequick.mjs に元から在る環境変数 W323C_DRAGCORE_OUT(cmd の前置きから env の欄へ)。
//      → 窓の同一性(tests/lib-w323b-quick.mjs の stepWindow —— 窓の env)が窓の全部を覆い、6 段が影の表と指紋の記録に入れる形になる
//        (第324便c の未決: args/cmd の窓は stepWindow から見えなかった)。**候補になるかは別の規則**(AN518 の手動の段・較正の正本を読む段は外れたまま)。
//   ② 窓の出力 out は走らせる前に写しから消す(第323便c の欄の約束)・**同じ out の段は同時に走らせない**(charon-h2 と charoneps-h4 は同じ probe を書く)・
//      --fingerprint は out も読む(環境変数に名の無い窓の出力 —— charon・charonk の probe。env の名と同じ out は重ねない —— 記録の 59 段の指紋の取り方は変わらない)。
//   ③ --fingerprint の記録の頭に env(取った箱の Node・Chromium・platform・heap —— tools/regen-chain.mjs --env と同じ口。鎖の env.json と照合する ——
//      tests/lib-w325d-quickgate.mjs の quickEnvCheck)。
//   ④ 第323便c の世代の 6 行(W325D_KNOBS_323C —— PHYSICS〔第323便c〕の表 1 と lint.quickWindows323 が読む)。今の行の窓の走行(cmd と器に渡す環境)は
//      第323便c の行と同じ(w325dSelfTest)。
export const SMOKE_ARGENV_VERSION = 'w325d-smoke-argenv-1';
/** 窓の環境変数 → 器の引数(bool は値 '1' で旗だけ)。 */
export const SMOKE_ARG_ENV = Object.freeze({
  HS_ARG_ROWS: Object.freeze({ flag: '--rows' }), HS_ARG_DT: Object.freeze({ flag: '--dt' }), HS_ARG_SMOKE: Object.freeze({ flag: '--smoke', bool: true }), HS_ARG_PART: Object.freeze({ flag: '--part' }),
  HS_ARG_STEPS: Object.freeze({ flag: '--steps' }), HS_ARG_ONLY: Object.freeze({ flag: '--only' }), HS_ARG_ITERS: Object.freeze({ flag: '--iters' }),
  HS_ARG_VARIANTS: Object.freeze({ flag: '--variants' }), HS_ARG_OUT: Object.freeze({ flag: '--out' }),
});
/** env の形へ移した 6 段。 */
export const W325D_ENV_KEYS = Object.freeze(['emgrid', 'charon-h2', 'dragcore292', 'charonk', 'nslock', 'charoneps-h4']);
/** 第323便c の世代の 6 行(窓の欄 env・args・cmd だけ —— out・sec・fullSec・covers・note は今の行と同じ)。 */
export const W325D_KNOBS_323C = Object.freeze({
  'emgrid': Object.freeze({ cmd: 'node tests/exp-w280b-emgrid.mjs --rows E0,E1,E2,E3,E4,E5,E6,E7,E8,S0 --dt 0.016 --smoke --part tests/out/_smoke-emgrid-w280b.json' }),
  'charon-h2': Object.freeze({ args: Object.freeze(['--steps', '4140000', '--only', 'C0,C1,C6']) }),
  'dragcore292': Object.freeze({ cmd: 'W323C_DRAGCORE_OUT=tests/out/_smoke-dragcore-w292c.json node tests/exp-w323c-dragcorequick.mjs' }),
  'charonk': Object.freeze({ args: Object.freeze(['--steps', '2070000', '--iters', '3']) }),
  'nslock': Object.freeze({ args: Object.freeze(['--only', 'psrDoubleABDFM', '--variants', 'builtin,lock', '--out', 'tests/out/_smoke-nslock-w272c.json']) }),
  'charoneps-h4': Object.freeze({ args: Object.freeze(['--steps', '4140000', '--only', 'E_base_e0.05,E_diag_e0.5']) }),
});
/** 第323便c の世代の窓の表(今の表の 6 行を第323便c の欄で —— PHYSICS〔第323便c〕の表 1・lint.quickWindows323 が読む)。 */
export function knobs323cView() {
  const out = {};
  for (const [k, v] of Object.entries(SMOKE_KNOBS)) {
    if (!W325D_KNOBS_323C[k]) { out[k] = v; continue; }
    const z = Object.assign({}, v);
    delete z.env; delete z.cmd; delete z.args;
    out[k] = Object.freeze(Object.assign(z, W325D_KNOBS_323C[k]));
  }
  return Object.freeze(out);
}
const ARGV_WORD = /^[\w.,:=\/+-]+$/;
/** 窓の行の HS_ARG_* を器の引数へ(env の並びの順)。名の無い HS_ARG_* や空白を含む値は例外。 */
export function w325dArgsOf(knob) {
  const out = [];
  for (const [n, v] of Object.entries((knob && knob.env) || {})) {
    if (!/^HS_ARG_/.test(n)) continue;
    const m = SMOKE_ARG_ENV[n];
    if (!m) throw new Error('窓の環境変数 ' + n + ' の写し先(SMOKE_ARG_ENV)が無い');
    if (m.bool) { if (String(v) !== '1') throw new Error('旗 ' + n + ' の値は 1 だけ(' + v + ')'); out.push(m.flag); continue; }
    if (!ARGV_WORD.test(String(v))) throw new Error('窓の引数に空白か記号がある: ' + n + '=' + v);
    out.push(m.flag, String(v));
  }
  return out;
}
/** 器に渡す窓の環境(HS_ARG_* を除く)。 */
export function w325dKnobEnv(knob) { return Object.fromEntries(Object.entries((knob && knob.env) || {}).filter(([n]) => !/^HS_ARG_/.test(n))); }
/** 窓の走行の cmd(第323便c の w323cKnobCmd に HS_ARG_* の引数を足す)。 */
export function w325dKnobCmd(baseCmd, knob) { const c = w323cKnobCmd(baseCmd, knob), a = w325dArgsOf(knob); return a.length ? c + ' ' + a.join(' ') : c; }
/** 窓の出力(out)を写しから消す(写しの中だけ —— tests/out の下の名だけ)。 */
export function w325dClearOut(sandbox, knob) {
  const f = knob && typeof knob.out === 'string' ? knob.out : null;
  if (!sandbox || !f || !/^tests\/out\/[\w.\/-]+$/.test(f) || f.indexOf('..') >= 0) return false;
  try { fs.rmSync(path.join(sandbox, f), { force: true }); return true; } catch { return false; }
}
/** 段の窓の出力(out)。 */
export function w325dOutOf(key) { const k = SMOKE_KNOBS[key]; return k && typeof k.out === 'string' ? k.out : null; }
/** 待ち行列から、走っている段と同じ out を書かない最初の段の位置(無ければ −1)。 */
export function w325dPick(queue, busy) { for (let i = 0; i < queue.length; i++) { const ob = w325dOutOf(queue[i].key); if (!ob || !busy.has(ob)) return i; } return -1; }
/** 指紋に足す窓の出力 out(段の正本・既に読んだ env の名と同じなら null)。 */
export function w325dFpOut(knob, outs, files) {
  const ko = knob && typeof knob.out === 'string' ? knob.out : null;
  if (!ko || !/^tests\/out\/[\w.\/-]+\.json$/.test(ko) || (outs || []).includes(ko) || (files || []).some((z) => z.file === ko)) return null;
  return ko;
}
/** 取った箱の環境(tools/regen-chain.mjs --env と同じ口 —— REGEN_ENV_BROWSER=0 なら Chromium を起こさない)。heap は無ければこの過程の値で補う。 */
export function w325dProbeEnv(root) {
  let j = null, err = null;
  try {
    const t = execFileSync(process.execPath, [path.join(root, 'tools', 'regen-chain.mjs'), '--env'], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'], timeout: 120000 });
    j = JSON.parse(String(t).trim().split('\n').pop());
  } catch (e) { err = String(e && e.message || e).slice(0, 120); }
  const out = j && typeof j === 'object' ? j : { node: process.version, platform: process.platform + '/' + process.arch, chromium: null, chromiumError: err };
  if (!Number.isFinite(out.heapMb)) {
    let lim = NaN; try { lim = v8.getHeapStatistics().heap_size_limit; } catch { lim = NaN; }
    const m = /--max-old-space-size[= ](\d+)/.exec(String(process.env.NODE_OPTIONS || ''));
    out.heapMb = Number.isFinite(lim) ? Math.round(lim / 1048576) : null; out.nodeOptionsHeap = m ? Number(m[1]) : null;
  }
  return { node: out.node || null, platform: out.platform || null, chromium: out.chromium || null, chromiumError: out.chromiumError || undefined, heapMb: out.heapMb, nodeOptionsHeap: out.nodeOptionsHeap === undefined ? null : out.nodeOptionsHeap,
    tool: 'tools/regen-chain.mjs --env', when: out.when || new Date().toISOString() };
}
/**
 * 表(PHYSICS〔第325便d〕の表 2 —— QA docs.w325d が作り直して逐語): 6 段の窓(今の env・窓の走行・第323便c の欄・簡易一致の静的な除外〔AN518〕・影の表と記録)。
 * o = { steps(REGEN_STEPS), Q(tests/lib-w323b-quick.mjs), cal(calibrationSteps の戻り) }
 */
export function w325dWindowRows(o) {
  const out = ['| 段 | 窓の環境変数(今) | 窓の走行(cmd・器に渡す環境) | 第323便c の欄 | 簡易一致の静的な除外(AN518) | 影の表と指紋の記録 |', '|---|---|---|---|---|---|'];
  const esc = (t) => String(t).replace(/\|/g, '\\|');
  for (const key of W325D_ENV_KEYS) {
    const k = SMOKE_KNOBS[key], old = W325D_KNOBS_323C[key], st = o.steps.find((z) => z.key === key);
    if (!k || !st) { out.push(`| ${key} | (行なし) | — | — | — | — |`); continue; }
    const ev = Object.entries(k.env || {}).map(([n, v]) => '`' + n + '=' + v + '`').join('・');
    const e = w325dEffective(st.cmd.split(' && ')[0], k, true);
    const run = '`' + e.cmd + '`' + (Object.keys(e.env).length ? '(' + Object.entries(e.env).map(([n, v]) => '`' + n + '=' + v + '`').join('・') + ')' : '');
    const was = old.cmd ? '窓の cmd' + (/^[A-Z0-9_]+=/.test(old.cmd) ? '(環境変数の前置き)' : '') : '引数 ' + (old.args || []).filter((x) => /^--/.test(x)).join(' ');
    const ex = o.Q.staticExclusion(st, o.cal);
    const fate = ex ? '窓は引ける・**候補にならない**(静的な除外)・指紋は --keys のときだけ' : '窓が引ける・**候補になれる**(指紋の記録の後)・--fingerprint(--keys なし)が取る';
    out.push(`| ${key} | ${esc(ev)} | ${esc(run)} | ${esc(was)} | ${esc(ex || 'なし')} | ${fate} |`);
  }
  return out.join('\n');
}
/** 器と窓の器の本文(env の名と引数の旗が本文に在るか)。 */
function w325dHarnessOfKey(key, steps) {
  const k = SMOKE_KNOBS[key];
  const hk = k && typeof k.cmd === 'string' ? w323cKnobHarness(key) : null;
  if (hk) return hk;
  const st = steps.find((z) => z.key === key);
  return st ? ((/(tests\/exp-[\w.-]+\.mjs)/.exec(st.cmd) || [])[1] || null) : null;
}
/** 第323便c の行の窓の走行(cmd の前置きの環境変数を env へ分けた形)。 */
function w325dEffective(baseCmd, knob, isNew) {
  const cmd = isNew ? w325dKnobCmd(baseCmd, knob) : w323cKnobCmd(baseCmd, knob);
  const env = isNew ? w325dKnobEnv(knob) : Object.assign({}, knob.env || {});
  const m = /^((?:[A-Z0-9_]+=\S+\s+)*)(.*)$/.exec(cmd);
  for (const kv of (m[1] || '').trim().split(/\s+/).filter(Boolean)) { const i = kv.indexOf('='); env[kv.slice(0, i)] = kv.slice(i + 1); }
  return { cmd: m[2], env: Object.fromEntries(Object.keys(env).sort().map((n) => [n, env[n]])) };
}
/**
 * 自己試験(器を走らせない —— QA lint.quickEnvWin325d と --self-test が呼ぶ): ① 6 段は env の形(args・cmd の前置きなし)・HS_ARG_* は表に在る・
 * ② 今の行の窓の走行(cmd と器に渡す環境)が第323便c の行と同じ・③ env の名は器の本文に process.env.名 で在る・HS_ARG_* の旗は器の本文に在る・
 * ④ 窓の同一性(stepWindow)が 6 段で引ける・⑤ 記録の 59 段の指紋の取り方は変わらない(out は env の名か out の無い行)・⑥ 同じ out の段は同時に走らない・
 * ⑦ 第323便c の世代の表(knobs323cView)は 6 行だけが第323便c の欄
 */
export async function w325dSelfTest(opt) {
  const root = (opt && opt.root) || TOOL_ROOT;
  const L = await libs(root);
  const Q = await fpLib323(root);
  const bad = [], cases = [];
  const steps = L.RT.REGEN_STEPS;
  const rd = (f) => { try { return fs.readFileSync(path.join(root, f), 'utf8'); } catch { return ''; } };
  let n = 0;
  const rows = [];
  for (const key of W325D_ENV_KEYS) {
    const k = SMOKE_KNOBS[key], old = W325D_KNOBS_323C[key], st = steps.find((z) => z.key === key);
    if (!k || !old || !st || st.role === 'history') { bad.push('① ' + key + ' の行・第323便c の行・段'); continue; }
    if (k.args || (typeof k.cmd === 'string' && /^[A-Z0-9_]+=/.test(k.cmd)) || !k.env || !Object.keys(k.env).length) bad.push('① ' + key + ' が env の形でない(args か cmd の前置き)');
    for (const nm of Object.keys(k.env || {})) if (/^HS_ARG_/.test(nm) && !SMOKE_ARG_ENV[nm]) bad.push('① ' + key + ' の ' + nm + ' が写しの表に無い');
    const base = st.cmd.split(' && ')[0].replace(/\$BASE_HTML/g, '"$BASE_HTML"');
    let a = null, b = null;
    try { a = w325dEffective(base, k, true); b = w325dEffective(base, old, false); } catch (e) { bad.push('② ' + key + ' の cmd が作れない: ' + String(e.message || e).slice(0, 60)); continue; }
    if (a.cmd !== b.cmd || JSON.stringify(a.env) !== JSON.stringify(b.env)) bad.push('② ' + key + ' の窓の走行が第323便c と違う: ' + a.cmd.slice(0, 60) + ' ≠ ' + b.cmd.slice(0, 60));
    const hk = w325dHarnessOfKey(key, steps), ht = hk ? rd(hk) : '';
    if (!ht) { bad.push('③ ' + key + ' の器が読めない(' + hk + ')'); continue; }
    for (const nm of Object.keys(k.env)) {
      if (/^HS_ARG_/.test(nm)) { const f = SMOKE_ARG_ENV[nm] && SMOKE_ARG_ENV[nm].flag; if (!f || ht.indexOf("'" + f + "'") < 0) bad.push('③ ' + key + ' の器の本文に引数 ' + f + ' が無い'); }
      else if (ht.indexOf('process.env.' + nm) < 0) bad.push('③ ' + key + ' の器の本文に環境変数 ' + nm + ' が無い');
    }
    const w = Q.stepWindow(st, SMOKE_KNOBS);
    if (!w || w.source !== 'smoke' || JSON.stringify(w.env) !== JSON.stringify(k.env)) bad.push('④ ' + key + ' の窓の同一性(stepWindow)が引けない');
    rows.push({ key, cmd: a.cmd, env: a.env, harness: hk });
    n++;
  }
  cases.push(`①〜④ env の形へ移した ${n}/${W325D_ENV_KEYS.length} 段(${SMOKE_ARGENV_VERSION} —— HS_ARG_* ${Object.keys(SMOKE_ARG_ENV).length} 種): 窓の走行(cmd と器に渡す環境)は第323便c の行と同じ・env の名と引数の旗は器の本文に在る・窓の同一性(stepWindow)が引ける`);
  // ⑤ 記録の段の指紋の取り方: 記録の段の窓の行の out は env の値か無い(out を足しても重ならない)
  let rec = null; try { rec = JSON.parse(rd(Q.QUICK_FP_FILE)); } catch { rec = null; }
  const recKeys = rec && rec.steps ? Object.keys(rec.steps) : [];
  const drift = recKeys.filter((key) => { const k = SMOKE_KNOBS[key]; if (!k || typeof k.out !== 'string') return false; const st = steps.find((z) => z.key === key); return !Object.values(k.env || {}).includes(k.out) && !((st && st.outs) || []).includes(k.out); });
  if (drift.length) bad.push('⑤ 記録の段で out が env の名と違う(指紋の取り方が変わる): ' + drift.slice(0, 4).join(','));
  const ko = w325dFpOut({ out: 'tests/out/x.json' }, ['tests/out/y.json'], [{ file: 'tests/out/x.json' }]), ko2 = w325dFpOut({ out: 'tests/out/x.json' }, ['tests/out/y.json'], []);
  if (ko !== null || ko2 !== 'tests/out/x.json') bad.push('⑤ out の重ね: ' + ko + '・' + ko2);
  cases.push(`⑤ 記録の ${recKeys.length} 段の指紋の取り方は変わらない(窓の out は env の名と同じか無い —— 重なる out は足さない)`);
  // ⑥ 同じ out の段は同時に走らない
  const q = [{ key: 'charon-h2' }, { key: 'charoneps-h4' }, { key: 'nslock' }];
  const busy = new Set([w325dOutOf('charon-h2')]);
  const pk = w325dPick(q.slice(1), busy), pk2 = w325dPick([{ key: 'charoneps-h4' }], busy);
  if (w325dOutOf('charon-h2') !== w325dOutOf('charoneps-h4') || pk !== 1 || pk2 !== -1) bad.push('⑥ 同じ out の排他: ' + pk + '・' + pk2);
  const groups = {}; for (const [k, v] of Object.entries(SMOKE_KNOBS)) if (typeof v.out === 'string') (groups[v.out] = groups[v.out] || []).push(k);
  const shared = Object.entries(groups).filter(([, ks]) => ks.length > 1);
  cases.push(`⑥ 同じ out を書く段は同時に走らせない(${shared.map(([f, ks]) => ks.join('・') + ' → ' + f.replace('tests/out/', '')).join(' / ') || 'なし'})・待ち行列は次の段を先に`);
  // ⑦ 第323便c の世代の表
  const v = knobs323cView();
  const diffKeys = Object.keys(v).filter((k) => JSON.stringify(v[k]) !== JSON.stringify(SMOKE_KNOBS[k])).sort();
  if (JSON.stringify(diffKeys) !== JSON.stringify(W325D_ENV_KEYS.slice().sort()) || Object.keys(v).length !== Object.keys(SMOKE_KNOBS).length) bad.push('⑦ 第323便c の世代の表の差: ' + diffKeys.join(','));
  cases.push(`⑦ 第323便c の世代の表(knobs323cView —— PHYSICS〔第323便c〕の表 1)は 6 行だけが第323便c の欄(env → args・cmd)`);
  // ⑧ 写しの例外
  let t1 = false, t2 = false;
  try { w325dArgsOf({ env: { HS_ARG_NOPE: 'x' } }); } catch { t1 = true; }
  try { w325dArgsOf({ env: { HS_ARG_ONLY: 'a b' } }); } catch { t2 = true; }
  if (!t1 || !t2 || JSON.stringify(w325dKnobEnv({ env: { HS_ARG_ONLY: 'a', X_Y: '1' } })) !== '{"X_Y":"1"}') bad.push('⑧ 写しの例外・器に渡す環境');
  cases.push('⑧ 写しの表に無い HS_ARG_*・空白を含む値は例外・HS_ARG_* は器に渡さない');
  return { version: SMOKE_ARGENV_VERSION, ok: bad.length === 0, bad, cases, rows };
}
// ==== 第325便d の塊(ここまで)====

// ---------------------------------------------------------------------------------------------
// main
// ---------------------------------------------------------------------------------------------
async function main(argv) {
  const root = path.resolve(getArg(argv, '--root', TOOL_ROOT));
  const rel = (p) => (p ? (path.isAbsolute(p) ? p : path.join(root, p)) : null);
  if (argv.includes('--self-test')) {
    const r = await selfTest({ root });
    for (const c of r.cases) console.log('  ' + c);
    const r325d = await w325dSelfTest({ root });   // 第325便d: env の形の窓 6 段
    for (const c of r325d.cases) console.log('  ' + c);
    console.log(`harness-smoke --self-test: ${r.ok && r325d.ok ? 'OK' : 'NG —— ' + r.bad.concat(r325d.bad).join(' / ')}`);
    process.exit(r.ok && r325d.ok ? 0 : 1);
  }
  const T0 = Date.now();
  const baseHtml = rel(getArg(argv, '--base', null));
  const htmlOverride = rel(getArg(argv, '--html', null));
  const baseRev = getArg(argv, '--base-rev', null);
  const lanes = Number(getArg(argv, '--lanes', 2));
  // 第323便b: --fingerprint の既定の枠は 1 段 900 s・全体 150 min(窓を最後まで走らせないと指紋が取れない —— 第323便b の試走で 90 s の枠に当たった窓がある)
  const fpMode = argv.includes('--fingerprint');
  if (fpMode && !argv.includes('--max-minutes')) argv = argv.concat(['--max-minutes', '150']);
  const budget = Number(getArg(argv, '--budget', fpMode ? 900 : 90));
  const maxMinutes = maxMinutesOf(argv);   // 第322便d: --wide の既定は 90 min(maxMinutesOf)
  const keysArg = getArg(argv, '--keys', null);
  const indirect = argv.includes('--indirect');
  const wide = argv.includes('--wide') || indirect;
  const listOnly = argv.includes('--list');
  const fpFile = getArg(argv, '--fingerprint', null);   // 第323便b
  if (!baseHtml && !keysArg && !fpFile) { console.error('harness-smoke: --base <基点 html>(か --keys・--fingerprint)が要る'); process.exit(2); }
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
  else if (fpFile && !baseHtml) { sel = await fpSelect323(rows, root); for (const r of sel) if (!r.prio) r.prio = 1; }   // 第323便b: 窓のある段を全部
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
  const fpCtx = fpFile ? await fpContext323(root, nowHtml) : null;   // 第323便b
  const res = await runPool(sel, { root, sandbox, logDir, tmpDir, gitDir, lanes, budget, maxMinutes, baseRel, baseRev, fp: fpCtx }, console.log);
  // 第322便d: 終わりの行(未実行の段があれば「未完」—— smokeSummary)
  const sm = smokeSummary(res, sel.length, { elapsedMin: (Date.now() - T0) / 60000, logDir, maxMinutes });
  const ng = sm.ng, summary = sm.line;
  console.log(summary);
  if (sm.rest) console.log(sm.rest);
  Object.assign(plan, { results: res, summary, ok: ng === 0, complete: sm.complete, notRun: sm.notRun, notRunKeys: sm.notRunKeys, maxMinutes, elapsedMin: +((Date.now() - T0) / 60000).toFixed(2) });
  // 第323便b: 指紋の記録(既にある記録へ段の行を入れる —— 他の段は残す)
  if (fpFile) { const w = fpWrite323(rel(fpFile), res, fpCtx); console.log(w.line); plan.fingerprint = w.summary; }
  fs.writeFileSync(path.join(outDir, 'smoke.json'), JSON.stringify(plan, null, 1));
  const js = getArg(argv, '--json', null); if (js) fs.writeFileSync(path.resolve(js), JSON.stringify(plan, null, 1));
  if (!argv.includes('--keep')) fs.rmSync(sandbox, { recursive: true, force: true });
  process.exit(ng ? 1 : 0);
}

const IS_MAIN = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (IS_MAIN) await main(argv0);
