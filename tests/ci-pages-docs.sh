#!/usr/bin/env bash
# 第355便h(統括の検証項目 R511・AI_SPEC §403): **公開のサイトが文書のページを配っているかの記録**(情報のみ)。
#
# 何のための器か: AI チャットとの対話の入口(`docs/AI_CHAT.md`)と、それを始めるプロンプトは、公開のサイトの
# `docs/AI_CHAT.md`・`docs/AI_SPEC_CORE.md` を AI に読ませる。いまのアプリの「短縮版」のプロンプトのリンク
# (`AI_SPEC_URL` = `…/docs/AI_SPEC.md`)も同じ形である。ここでは、それらのアドレス(`.md` の形と、描いた `.html` の形)を
# 取りに行き、**HTTP の状態と大きさ(と `.md` は git の中身と同じか)を記録するだけ**にする。
#
# **これは PR ゲートではない・判定もしない。** `tests/ci-pages-collate.sh` と同じ取り決めで、取得の失敗を
# 「配られている」に置き換えない。どの結果でも終了コード 0(夜間の yaml では continue-on-error も付ける)。
# `.md` が 200 で git と同じなら「文のまま配られている」、`.html` だけが 200 なら「描いたページだけ」と読める(読みは人がする)。
#
# 使い方:
#   tests/ci-pages-docs.sh                    … 既定のページ(AI_CHAT・AI_SPEC_CORE・AI_SPEC の .md と .html)
#   tests/ci-pages-docs.sh --base <URL>       … 既定 https://tty-imamura.github.io/dfm-simulator
# 出力: stdout に 1 行 1 ページの JSON(JSON Lines)。終了コード: 常に 0。
set -u
BASE="https://tty-imamura.github.io/dfm-simulator"
while [ $# -gt 0 ]; do
  case "$1" in
    --base) BASE="$2"; shift 2;;
    *) echo "unknown arg: $1" >&2; exit 0;;
  esac
done
REPO_ROOT="$(cd "$(dirname "$0")/.." && pwd)"
TMP="$(mktemp -d)"
trap 'rm -rf "$TMP"' EXIT
for NAME in AI_CHAT AI_SPEC_CORE AI_SPEC; do
  for EXT in md html; do
    REL="docs/$NAME.$EXT"
    URL="$BASE/$REL"
    curl -sS -L --max-time 60 -o "$TMP/body" -w '%{http_code} %{content_type}' "$URL" >"$TMP/meta" 2>"$TMP/err" || true
    HTTP="$(cut -d' ' -f1 < "$TMP/meta" | tr -dc '0-9')"; [ -n "$HTTP" ] || HTTP="000"
    CTYPE="$(cut -d' ' -f2- < "$TMP/meta" | tr -d '"\\')"
    BYTES=0; [ -s "$TMP/body" ] && BYTES=$(wc -c < "$TMP/body" | tr -d ' ')
    SAME="null"
    if [ "$EXT" = "md" ] && [ "$HTTP" = "200" ] && [ -f "$REPO_ROOT/$REL" ]; then
      if cmp -s "$TMP/body" "$REPO_ROOT/$REL"; then SAME="true"; else SAME="false"; fi
    fi
    LOG="$(tail -n 1 "$TMP/err" 2>/dev/null | tr -d '"\\' | tr '\n' ' ')"
    echo "{\"judgement\":\"informational\",\"url\":\"$URL\",\"httpStatus\":\"$HTTP\",\"contentType\":\"$CTYPE\",\"bytes\":$BYTES,\"sameAsGit\":$SAME,\"log\":\"$LOG\"}"
    rm -f "$TMP/body"
  done
done
exit 0
