#!/usr/bin/env bash
# 第261便d(第53報 W4): **A/B JIT ゲート (b) の凍結基準 html** を、履歴を全部持たずに取り出す試行。
#
# 経緯(〔第260便d〕①): (b)「凍結基準 html 対 候補」は CI で再現できないと書いた —— CI の checkout は
# shallow(fetch-depth 1)で、この履歴は 423 MB(本便の実測 448 MB)あり、`fetch-depth: 0` を
# perf ジョブに足すのは割に合わない、という理由である。**部分 clone なら別である**(同便の決断事項)。
# 本スクリプトは `git clone --filter=blob:none --no-checkout` + `git show <凍結SHA>:beta/index.html` で
# **凍結した 1 ファイルだけ**を取り出し、**所要時間と取得量**を測る。
#
# **CI の yaml は本便でも 1 文字も変えていない**(〔第261便d〕⑤ と同じ —— 第262便d でも足していない)。
#
# 第262便d(第54報 W4・統括が設定した検証仮説 (8))の位置づけ:
#   **これは「夜間/手動ジョブの候補」であって、PR ゲートに入れるものではない。**
#   ・PR ごとに走らせない: clone は**ネットワークと GitHub 側の応答**に依存し、手元の 1.6〜1.8 s が
#     CI ランナーの上限である保証は無い(測っていない)。**PR の赤は再現できる原因だけに使う。**
#   ・**取得に成功したときだけ** (b) を FAIL の基準として読む(perf.mjs の `frozen-file`)。
#   ・**取得に失敗したら root-fallback へ落ちるが、それは「凍結基準で通った」ではない** ——
#     root-fallback の行は `judgement:"informational"` のままで、**fail を増やさない**
#     (perf.mjs の `ABJIT_ROOT_FALLBACK_IS_FROZEN=false`)。
#     **取得失敗を合格に置き換えない**というのがこの取り決めの要点である。
#   ・想定する呼び出し方(**yaml には入れていない** —— 次便の裁定):
#       schedule(夜間)または workflow_dispatch(手動)で
#         tests/ci-frozen-baseline.sh <凍結SHA> tests/perf-baseline/index.html
#         PERF_ABJIT_ONLY=1 node tests/perf.mjs
#       取得が失敗しても**ジョブは続ける**(continue-on-error 相当)。
#
# 使い方:
#   tests/ci-frozen-baseline.sh <凍結SHA> [出力パス] [リポジトリURL]
#   例) tests/ci-frozen-baseline.sh 09899d2 tests/perf-baseline/index.html
# 環境変数:
#   FROZEN_SRC … clone 元(既定 origin の URL。ローカルの .git を指せばネットワーク無しでも測れる)
#   KEEP_TMP=1 … 作業ディレクトリを消さない
# 出力: 取り出した html のパス・バイト数・**経過秒**を stdout の 1 行 JSON で返す(CI が読めるように)。
# 終了コード: 取り出せなければ 1。
set -u
SHA="${1:-}"
OUTP="${2:-tests/perf-baseline/index.html}"
URL="${3:-${FROZEN_SRC:-}}"
if [ -z "$SHA" ]; then echo "usage: $0 <frozen-sha> [out] [url]" >&2; exit 2; fi
if [ -z "$URL" ]; then URL="$(git config --get remote.origin.url || true)"; fi
if [ -z "$URL" ]; then echo "clone 元が決まらない(FROZEN_SRC か引数 3 で渡す)" >&2; exit 2; fi

T0=$(date +%s.%N)
TMP="$(mktemp -d)"
cleanup() { if [ "${KEEP_TMP:-0}" != "1" ]; then rm -rf "$TMP"; fi; }
trap cleanup EXIT

# --filter=blob:none … blob を遅延取得(履歴の**中身**を持ってこない)
# --no-checkout      … 作業ツリーを作らない(3.7 MB の html を 1 度も展開しない)
# --no-tags          … タグの参照も持ってこない
if ! git clone --filter=blob:none --no-checkout --no-tags "$URL" "$TMP/repo" >"$TMP/clone.log" 2>&1; then
  echo "{\"ok\":false,\"stage\":\"clone\",\"log\":\"$(tail -n 2 "$TMP/clone.log" | tr '\n' ' ' | tr -d '"')\"}"
  exit 1
fi
T1=$(date +%s.%N)

mkdir -p "$(dirname "$OUTP")"
if ! git -C "$TMP/repo" show "${SHA}:beta/index.html" > "$OUTP" 2>"$TMP/show.log"; then
  echo "{\"ok\":false,\"stage\":\"show\",\"log\":\"$(tail -n 2 "$TMP/show.log" | tr '\n' ' ' | tr -d '"')\"}"
  rm -f "$OUTP"
  exit 1
fi
T2=$(date +%s.%N)

BYTES=$(wc -c < "$OUTP" | tr -d ' ')
GITSZ=$(du -sk "$TMP/repo/.git" | cut -f1)
CLONE_S=$(awk -v a="$T0" -v b="$T1" 'BEGIN{printf "%.2f", b-a}')
SHOW_S=$(awk -v a="$T1" -v b="$T2" 'BEGIN{printf "%.2f", b-a}')
TOTAL_S=$(awk -v a="$T0" -v b="$T2" 'BEGIN{printf "%.2f", b-a}')
echo "{\"ok\":true,\"sha\":\"$SHA\",\"out\":\"$OUTP\",\"bytes\":$BYTES,\"gitKB\":$GITSZ,\"cloneSec\":$CLONE_S,\"showSec\":$SHOW_S,\"totalSec\":$TOTAL_S}"
