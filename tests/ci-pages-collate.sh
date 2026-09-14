#!/usr/bin/env bash
# 第263便d(第55報 W4): **Pages の HTML と git の HTML を SHA-256 で突き合わせる**手順。
#
# 何のための器か: 昇格しても、原仮定者が実機で触るのは **GitHub Pages が配っている HTML** である。
# 「push した」ことと「配られている」ことは別なので、**配信物の SHA-256 を git の中身と照合する**。
# ローカルの cmp(昇格コミットの `index.html` ← `beta/index.html`)は**リポジトリの中**の話で、
# **配信経路は 1 度も測っていなかった**(第262便d までの位置づけ)。
#
# **これは PR ゲートではない。** Pages は CDN でキャッシュされ、push から反映まで遅れる
# (遅れの長さは測っていない)。したがって:
#   ・**取得できたときだけ**照合を判定に使う(`judgement:"gate"`)。
#   ・**取得に失敗したら `judgement:"informational"` で終了コード 0** —— 取得失敗を
#     「一致した」に置き換えない(`tests/ci-frozen-baseline.sh` と同じ取り決め)。
#   ・**不一致が即「壊れている」ではない**。反映待ちかもしれないので、`--scan N` で
#     直近 N コミットの beta/index.html と総当たりし、**配信中の HTML がどのコミットのものか**を出す。
#   ・**`.github/workflows` は本便でも 1 文字も変えていない**(夜間/手動ジョブの候補にとどめる)。
#
# 使い方:
#   tests/ci-pages-collate.sh                                  … 既定(beta/index.html を照合)
#   tests/ci-pages-collate.sh --path index.html                … ルート配信を照合(昇格後の確認)
#   tests/ci-pages-collate.sh --ref 21134c9 --scan 20          … 参照コミット指定 + 直近 20 件を総当たり
#   tests/ci-pages-collate.sh --strict                         … 取得失敗も終了コード 1 にする
# 引数:
#   --base <URL>   既定 https://tty-imamura.github.io/dfm-simulator
#   --path <rel>   既定 beta/index.html
#   --ref <rev>    既定 HEAD(`git show <ref>:<path>` を正本として比べる)
#   --scan <N>     不一致のとき直近 N コミットを総当たりして一致するコミットを探す(既定 0 = しない)
#   --strict       取得失敗を FAIL 扱いにする
# 出力: stdout の 1 行 JSON。終了コード: 一致 0 / 不一致 1 / 取得失敗 0(--strict なら 1)。
set -u
BASE="https://tty-imamura.github.io/dfm-simulator"
RELPATH="beta/index.html"
REF="HEAD"
SCAN=0
STRICT=0
while [ $# -gt 0 ]; do
  case "$1" in
    --base) BASE="$2"; shift 2;;
    --path) RELPATH="$2"; shift 2;;
    --ref) REF="$2"; shift 2;;
    --scan) SCAN="$2"; shift 2;;
    --strict) STRICT=1; shift;;
    *) echo "unknown arg: $1" >&2; exit 2;;
  esac
done

REPO_ROOT="$(cd "$(dirname "$0")/.." && pwd)"
URL="$BASE/$RELPATH"
TMP="$(mktemp -d)"
cleanup() { rm -rf "$TMP"; }
trap cleanup EXIT

# ---- git 側(正本)----
if ! git -C "$REPO_ROOT" show "$REF:$RELPATH" > "$TMP/git.html" 2>"$TMP/git.err"; then
  echo "{\"ok\":false,\"stage\":\"git\",\"judgement\":\"error\",\"log\":\"$(tail -n 1 "$TMP/git.err" | tr -d '"' | tr '\n' ' ')\"}"
  exit 2
fi
GIT_SHA=$(sha256sum "$TMP/git.html" | cut -d' ' -f1)
GIT_BYTES=$(wc -c < "$TMP/git.html" | tr -d ' ')
GIT_REV=$(git -C "$REPO_ROOT" rev-parse --short "$REF" 2>/dev/null || echo "?")

# ---- Pages 側(配信物)----
T0=$(date +%s.%N)
curl -sS -L --max-time 60 -o "$TMP/pages.html" -w '%{http_code}' "$URL" >"$TMP/code" 2>"$TMP/curl.err" || true
HTTP="$(tr -dc '0-9' < "$TMP/code")"; [ -n "$HTTP" ] || HTTP="000"
T1=$(date +%s.%N)
FETCH_S=$(awk -v a="$T0" -v b="$T1" 'BEGIN{printf "%.2f", b-a}')

if [ "$HTTP" != "200" ] || [ ! -s "$TMP/pages.html" ]; then
  LOG=$(tail -n 1 "$TMP/curl.err" 2>/dev/null | tr -d '"' | tr '\n' ' ')
  echo "{\"ok\":false,\"stage\":\"fetch\",\"judgement\":\"informational\",\"url\":\"$URL\",\"httpStatus\":\"$HTTP\",\"fetchSec\":$FETCH_S,\"gitRev\":\"$GIT_REV\",\"gitSha256\":\"$GIT_SHA\",\"gitBytes\":$GIT_BYTES,\"note\":\"取得できないことを一致に置き換えない\",\"log\":\"$LOG\"}"
  [ "$STRICT" = "1" ] && exit 1
  exit 0
fi
PAGES_SHA=$(sha256sum "$TMP/pages.html" | cut -d' ' -f1)
PAGES_BYTES=$(wc -c < "$TMP/pages.html" | tr -d ' ')

if [ "$PAGES_SHA" = "$GIT_SHA" ]; then
  echo "{\"ok\":true,\"judgement\":\"gate\",\"url\":\"$URL\",\"httpStatus\":$HTTP,\"match\":true,\"sha256\":\"$PAGES_SHA\",\"bytes\":$PAGES_BYTES,\"gitRev\":\"$GIT_REV\",\"fetchSec\":$FETCH_S}"
  exit 0
fi

# ---- 不一致: 反映待ちかどうかを直近コミットの総当たりで切り分ける ----
MATCHED=""
if [ "$SCAN" -gt 0 ]; then
  for C in $(git -C "$REPO_ROOT" rev-list -n "$SCAN" "$REF" 2>/dev/null); do
    if git -C "$REPO_ROOT" show "$C:$RELPATH" 2>/dev/null | sha256sum | cut -d' ' -f1 | grep -q "^$PAGES_SHA$"; then
      MATCHED="$(git -C "$REPO_ROOT" rev-parse --short "$C")"; break
    fi
  done
fi
echo "{\"ok\":false,\"judgement\":\"gate\",\"url\":\"$URL\",\"httpStatus\":$HTTP,\"match\":false,\"pagesSha256\":\"$PAGES_SHA\",\"pagesBytes\":$PAGES_BYTES,\"gitRev\":\"$GIT_REV\",\"gitSha256\":\"$GIT_SHA\",\"gitBytes\":$GIT_BYTES,\"scanned\":$SCAN,\"servedCommit\":\"$MATCHED\",\"fetchSec\":$FETCH_S,\"note\":\"不一致は即異常ではない(Pages の反映待ちがありうる — 遅れの長さは測っていない)\"}"
exit 1
