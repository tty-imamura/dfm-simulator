#!/usr/bin/env bash
# 第287便f(原仮定者の裁定(第77報)AN70・統括の検証項目 R112): **統合直後の部分 QA**(常設集合)を 1 本で回す。
#
# 統合(worktree の取り込み)の直後、フル QA・再生成の鎖の前に、壊れやすい所を短く一周する。**フル QA の代わりではない**
# (CI が最終裁定者 —— 手元のゲートは CI の代わりにしない)。順序(先に落ちるものを先に):
#   ① 静的受理   tests/qa-preflight.mjs(QA_TARGET=beta/index.html —— tier lint の文と全内蔵の受理・構築・1 歩。Chromium なし)
#   ② 接続契約   node tools/regen-chain.mjs --audit と --self-test(再生成表の依存・html を書く段・済み印の契約 —— 枝ごとに足した段の接続)
#   ③ 前回失敗項 --failed の id(無ければ tests/out/qa-results-full-beta.json の FAIL の id)を qapart で beta に
#   ④ 常設集合   POST_MERGE_IDS を qapart(tests/exp-w258c-qapart.mjs —— 1 本の Chromium)で beta と root(QA_TARGET=index.html)に。
#                root では beta 線の新設ブロックが SKIP になる(SKIP の数を出す —— PASS に数えない)
#   ⑤ 影響サンプルの短走 --base <基点 html>(リポジトリの中の相対パス —— 例 beta/_w288_base.html)があるとき
#                tests/exp-w258c-bitsame.mjs で全内蔵の 600 步の指紋を比べ、差分 ID を出す(**情報** —— 物理を変える枝は差が出て正しい。
#                予測した差分 ID と照らすのは統括)
# 最後に 1 行で出す: `post-merge-qa: ① … ② … ③ … ④ beta p/n・root p/n(SKIP s)⑤ … 所要 N s → OK|FAIL`。
#
# 使い方:
#   tools/post-merge-qa.sh [--base beta/_wNNN_base.html] [--failed "id id …"] [--no-root] [--no-preflight]
#   環境変数: PLAYWRIGHT_CORE_DIR(既定: /opt/node22/lib/node_modules/playwright があればそれ)・POST_MERGE_LOG(ログの置き場 ——
#             既定 ${TMPDIR:-/tmp}/post-merge-qa-<時刻>)・POST_MERGE_IDS(常設集合を差し替える —— 既定は下の 9 本)
# 終了コード: 0 = ①〜④ がすべて通った / 1 = どれかが FAIL(⑤ は情報 —— 器が落ちたときだけ FAIL)/ 2 = 使い方の誤り
# **書くもの**: ログだけ(tests/out/qa-preflight-beta.json は preflight の既定の保存物 —— .gitignore の対象)。正本・html は書かない。
set -u
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT" || exit 2
DEFAULT_IDS="lint.regenScope behavior.rayLensExcluded ai.stabilize docs.fourValuesHistory docs.preset-table-sync docs.families ui.samplePicker lint.provenanceMeta ui.pickerSeparators"
IDS="${POST_MERGE_IDS:-$DEFAULT_IDS}"
BASE=""; FAILED=""; NOROOT=0; NOPRE=0
while [ $# -gt 0 ]; do
  case "$1" in
    --base) BASE="${2:-}"; shift 2 ;;
    --failed) FAILED="${2:-}"; shift 2 ;;
    --no-root) NOROOT=1; shift ;;
    --no-preflight) NOPRE=1; shift ;;
    -h|--help) sed -n '2,26p' "$0"; exit 0 ;;
    *) echo "post-merge-qa: 知らない引数 $1" >&2; exit 2 ;;
  esac
done
if [ -z "${PLAYWRIGHT_CORE_DIR:-}" ] && [ -d /opt/node22/lib/node_modules/playwright ]; then export PLAYWRIGHT_CORE_DIR=/opt/node22/lib/node_modules/playwright; fi
LOG="${POST_MERGE_LOG:-${TMPDIR:-/tmp}/post-merge-qa-$(date -u +%Y%m%dT%H%M%SZ)}"
mkdir -p "$LOG" || exit 2
T0=$(date +%s); fail=0
count() { grep -c "^$1 " "$2" 2>/dev/null || true; }
say() { echo "[post-merge-qa] $*"; }

# ① 静的受理
S1="skip"
if [ $NOPRE -eq 0 ]; then
  say "① 静的受理(qa-preflight beta)→ $LOG/1-preflight.log"
  QA_TARGET=beta/index.html node tests/qa-preflight.mjs >"$LOG/1-preflight.log" 2>&1; rc=$?
  p=$(count PASS "$LOG/1-preflight.log"); f=$(count FAIL "$LOG/1-preflight.log")
  S1="preflight ${p}/$((p + f))"; [ $rc -eq 0 ] || { S1="$S1 FAIL(rc $rc)"; fail=1; }
fi

# ② 接続契約
say "② 接続契約(regen-chain --audit / --self-test)→ $LOG/2-*.log"
node tools/regen-chain.mjs --audit >"$LOG/2-audit.json" 2>&1; ra=$?
node tools/regen-chain.mjs --self-test >"$LOG/2-selftest.json" 2>&1; rs=$?
S2="audit $([ $ra -eq 0 ] && echo ok || echo FAIL)・self-test $([ $rs -eq 0 ] && echo ok || echo FAIL)"
[ $ra -eq 0 ] && [ $rs -eq 0 ] || fail=1

# ③ 前回失敗項
if [ -z "$FAILED" ] && [ -f tests/out/qa-results-full-beta.json ]; then
  FAILED=$(node -e 'const j=JSON.parse(require("fs").readFileSync("tests/out/qa-results-full-beta.json","utf8"));const src=require("fs").readFileSync("tests/qa.mjs","utf8");console.log([...new Set((j.results||[]).filter(r=>!r.pass).map(r=>r.id))].filter(id=>src.includes("add(\x27"+id+"\x27")).join(" "))' 2>/dev/null || true)
fi
S3="前回失敗 0"
if [ -n "$FAILED" ]; then
  say "③ 前回失敗項 $FAILED → $LOG/3-failed.log"
  # shellcheck disable=SC2086
  node tests/exp-w258c-qapart.mjs $FAILED >"$LOG/3-failed.log" 2>&1; rc=$?
  p=$(count PASS "$LOG/3-failed.log"); f=$(count FAIL "$LOG/3-failed.log")
  S3="前回失敗 ${p}/$((p + f))"; [ $rc -eq 0 ] || { S3="$S3 FAIL"; fail=1; }
fi

# ④ 常設集合(beta と root)
say "④ 常設集合 beta → $LOG/4-beta.log"
# shellcheck disable=SC2086
node tests/exp-w258c-qapart.mjs $IDS >"$LOG/4-beta.log" 2>&1; rb=$?
pb=$(count PASS "$LOG/4-beta.log"); fb=$(count FAIL "$LOG/4-beta.log"); sb=$(count SKIP "$LOG/4-beta.log")
S4="beta ${pb}/$((pb + fb))$([ "$sb" -gt 0 ] && echo "(SKIP $sb)")"
[ $rb -eq 0 ] || { S4="$S4 FAIL"; fail=1; }
if [ $NOROOT -eq 0 ]; then
  say "④ 常設集合 root → $LOG/4-root.log"
  # shellcheck disable=SC2086
  QA_TARGET=index.html node tests/exp-w258c-qapart.mjs $IDS >"$LOG/4-root.log" 2>&1; rr=$?
  pr=$(count PASS "$LOG/4-root.log"); fr=$(count FAIL "$LOG/4-root.log"); sr=$(count SKIP "$LOG/4-root.log")
  S4="$S4・root ${pr}/$((pr + fr))(SKIP $sr)"
  [ $rr -eq 0 ] || { S4="$S4 FAIL"; fail=1; }
fi

# ⑤ 影響サンプルの短走(情報)
S5="bitsame なし(--base 無し)"
if [ -n "$BASE" ]; then
  case "$BASE" in /*) BASE="$(realpath --relative-to="$ROOT" "$BASE")" ;; esac
  if [ ! -f "$BASE" ]; then S5="bitsame FAIL(基点 $BASE が無い)"; fail=1
  else
    say "⑤ bitsame $BASE → beta/index.html → $LOG/5-bitsame.json"
    node tests/exp-w258c-bitsame.mjs "$BASE" beta/index.html >"$LOG/5-bitsame.json" 2>"$LOG/5-bitsame.err"; rc=$?
    if [ $rc -gt 1 ] || ! node -e 'JSON.parse(require("fs").readFileSync(process.argv[1],"utf8"))' "$LOG/5-bitsame.json" 2>/dev/null; then S5="bitsame FAIL(器 rc $rc)"; fail=1
    else S5=$(node -e 'const j=JSON.parse(require("fs").readFileSync(process.argv[1],"utf8"));const ids=j.diff.map(s=>s.split(":")[0]);const pe=(j.pageErrorsBase||[]).length+(j.pageErrorsNow||[]).length;console.log("bitsame "+(j.n-ids.length)+"/"+j.n+(ids.length?"(差分 ID "+ids.slice(0,8).join(",")+(ids.length>8?" 他 "+(ids.length-8):"")+" —— 情報)":"")+(pe?" pageErrors "+pe:""))' "$LOG/5-bitsame.json")
    fi
  fi
fi

T1=$(date +%s)
echo "post-merge-qa: ① $S1 ② $S2 ③ $S3 ④ $S4 ⑤ $S5 所要 $((T1 - T0)) s → $([ $fail -eq 0 ] && echo OK || echo FAIL)(ログ $LOG)"
exit $fail
