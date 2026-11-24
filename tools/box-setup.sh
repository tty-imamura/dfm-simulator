#!/usr/bin/env bash
# 第352便g(統括の検証項目 R444): **作業の箱を取り直した後の立て直し**(公開できる部分だけ)を 1 本で見る・行う。
#   (i)   node_modules の symlink —— 行き先は --node-modules <dir> か環境変数 BOX_NODE_MODULES(既に在れば何もしない —— 置き換えない)
#   (ii)  .git/info/exclude に `node_modules` と `beta/_w*_base.html`(無い行だけ末尾に足す —— 既存の行は変えない)
#   (iii) 浅い複製なら `git fetch --unshallow origin main`
#   (iv)  実行系の検査 `node tools/engine-check.mjs`(ブラウザを起こす —— --no-engine で飛ばす)と箱のブラウザの版の表示
#   (v)   鎖の計画が正本の刻印の html を引けるかの点検(tests/lib-w325a-htmlphys.mjs の findHtmlBySha —— 候補のファイル〔今の beta/index.html と beta/_w*_base.html〕と
#         git の履歴〔beta/index.html の直近 200 版〕)。引けない刻印が在れば、直し方を 1 行で案内する(**この道具は履歴を書き換えない**)。--no-stamps で飛ばす
# 使い方:
#   tools/box-setup.sh [--check] [--repo <木>] [--node-modules <dir>] [--no-engine] [--no-stamps]   … 読むだけ(既定)
#   tools/box-setup.sh --apply [同じ引数]                                                       … (i)(ii)(iii) だけを行う((iv)(v) は見るだけ)
# 書くもの: --apply のときだけ —— (i) 無いときの symlink 1 つ・(ii) exclude の末尾に無い行・(iii) git の取り寄せ。**上書き・削除・履歴の書き換えをしない。**
# 終了コード: 0 = 全部そろっている(--apply では行った後に)/ 1 = 足りない所が在る(行を読む)/ 2 = 使い方の誤り
set -u
MODE=check; REPO=""; NM="${BOX_NODE_MODULES:-}"; NOENG=0; NOSTAMP=0
while [ $# -gt 0 ]; do
  case "$1" in
    --check) MODE=check; shift ;;
    --apply) MODE=apply; shift ;;
    --repo) REPO="${2:-}"; shift 2 ;;
    --node-modules) NM="${2:-}"; shift 2 ;;
    --no-engine) NOENG=1; shift ;;
    --no-stamps) NOSTAMP=1; shift ;;
    -h|--help) sed -n '2,15p' "$0"; exit 0 ;;
    *) echo "box-setup: 知らない引数 $1" >&2; exit 2 ;;
  esac
done
HERE="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
[ -n "$REPO" ] || REPO="$HERE"
REPO="$(cd "$REPO" 2>/dev/null && pwd)" || { echo "box-setup: --repo が無い" >&2; exit 2; }
git -C "$REPO" rev-parse --git-dir >/dev/null 2>&1 || { echo "box-setup: $REPO は git の木でない" >&2; exit 2; }
need=0; out=()
say() { echo "[box-setup] $*"; }

# (i) node_modules
if [ -e "$REPO/node_modules" ] || [ -L "$REPO/node_modules" ]; then
  S1="(i) node_modules は在る($( [ -L "$REPO/node_modules" ] && echo "symlink → $(readlink "$REPO/node_modules")" || echo "ディレクトリ")—— 何もしない)"
elif [ -z "$NM" ]; then
  S1="(i) node_modules が無い —— 行き先を --node-modules <dir> か BOX_NODE_MODULES で渡す"; need=1
elif [ ! -d "$NM" ]; then
  S1="(i) node_modules が無い・行き先 $NM がディレクトリでない"; need=1
elif [ "$MODE" = apply ]; then
  if ln -s "$NM" "$REPO/node_modules"; then S1="(i) node_modules → $NM を作った"; else S1="(i) symlink を作れない"; need=1; fi
else S1="(i) node_modules が無い(--apply で $NM への symlink を作る)"; need=1
fi
out+=("$S1")

# (ii) .git/info/exclude(worktree でも共通の exclude —— git rev-parse --git-path)
EXF="$(git -C "$REPO" rev-parse --git-path info/exclude)"; case "$EXF" in /*) ;; *) EXF="$REPO/$EXF" ;; esac
miss=()
for pat in 'node_modules' 'beta/_w*_base.html'; do grep -qxF -- "$pat" "$EXF" 2>/dev/null || miss+=("$pat"); done
if [ ${#miss[@]} -eq 0 ]; then S2="(ii) exclude に 2 行とも在る"
elif [ "$MODE" = apply ]; then
  mkdir -p "$(dirname "$EXF")" && { for pat in "${miss[@]}"; do printf '%s\n' "$pat" >>"$EXF"; done; } && S2="(ii) exclude の末尾に ${#miss[@]} 行を足した(${miss[*]})" || { S2="(ii) exclude に書けない"; need=1; }
else S2="(ii) exclude に無い行 ${#miss[@]}(${miss[*]} —— --apply で末尾に足す)"; need=1
fi
out+=("$S2")

# (iii) 浅い複製
SH="$(git -C "$REPO" rev-parse --is-shallow-repository 2>/dev/null || echo unknown)"
if [ "$SH" = false ]; then S3="(iii) 深い複製(浅くない)"
elif [ "$SH" = true ] && [ "$MODE" = apply ]; then
  if git -C "$REPO" fetch --unshallow origin main >/dev/null 2>&1; then S3="(iii) git fetch --unshallow origin main をした"; else S3="(iii) git fetch --unshallow origin main が通らない"; need=1; fi
elif [ "$SH" = true ]; then S3="(iii) 浅い複製(--apply で git fetch --unshallow origin main)"; need=1
else S3="(iii) 浅さが読めない"; need=1
fi
out+=("$S3")

# (iv) 実行系の検査と箱のブラウザの版
BV=""
for b in "${CHROMIUM_PATH:-}" /opt/pw-browsers/chromium; do [ -n "$b" ] && [ -x "$b" ] && { BV="$("$b" --version 2>/dev/null | head -1)($b)"; break; }; done
[ -n "$BV" ] || BV="箱のブラウザの実行ファイルが見つからない(CHROMIUM_PATH か /opt/pw-browsers/chromium)"
if [ $NOENG -eq 1 ]; then S4="(iv) 実行系の検査は飛ばした(--no-engine)・ブラウザ $BV"
elif [ ! -f "$REPO/tools/engine-check.mjs" ]; then S4="(iv) tools/engine-check.mjs が無い・ブラウザ $BV"; need=1
else
  EC="$(cd "$REPO" && node tools/engine-check.mjs 2>&1)"; rce=$?
  S4="(iv) engine-check rc $rce($( { printf '%s\n' "$EC" | grep -m1 '宣言の指紋' || printf '%s\n' "$EC" | tail -1; } | sed 's/^ *//' | cut -c1-160))・ブラウザ $BV"; [ $rce -eq 0 ] || need=1
fi
out+=("$S4")

# (v) 正本の刻印の html を引けるか(読むだけ)
if [ $NOSTAMP -eq 1 ]; then S5="(v) 刻印の点検は飛ばした(--no-stamps)"
elif [ ! -f "$REPO/tests/lib-w325a-htmlphys.mjs" ] || [ ! -f "$REPO/tests/lib-w281a-regentable.mjs" ]; then S5="(v) 刻印の点検の lib が無い"; need=1
else
  S5="$(node --input-type=module -e '
import fs from "node:fs"; import path from "node:path"; import crypto from "node:crypto"; import { pathToFileURL } from "node:url";
const R = process.argv[1];
const T = await import(pathToFileURL(path.join(R, "tests/lib-w281a-regentable.mjs")).href);
const HP = await import(pathToFileURL(path.join(R, "tests/lib-w325a-htmlphys.mjs")).href);
const now = crypto.createHash("sha256").update(fs.readFileSync(path.join(R, "beta/index.html"))).digest("hex");
const by = new Map(); let n = 0;
for (const st of T.REGEN_STEPS) { if (st.role === "history") continue; for (const f of (st.outs || [])) { let m = null; try { m = JSON.parse(fs.readFileSync(path.join(R, f), "utf8")).meta || {}; } catch { continue; }
  if (m.target === "beta/index.html" && /^[0-9a-f]{64}$/.test(String(m.targetSha256 || ""))) { n++; if (!by.has(m.targetSha256)) by.set(m.targetSha256, 0); by.set(m.targetSha256, by.get(m.targetSha256) + 1); } } }
const base = fs.readdirSync(path.join(R, "beta")).filter((f) => /^_w.*_base\.html$/.test(f)).map((f) => path.join(R, "beta", f));
let file = 0, git = 0, miss = 0, missOut = 0;
for (const [s, c] of by) { const h = HP.findHtmlBySha({ root: R, sha: s, files: [path.join(R, "beta/index.html"), ...base], gitDepth: 200 }); if (!h) { miss++; missOut += c; } else if (h.from.startsWith("git:")) git++; else file++; }
console.log((miss ? "NG" : "OK") + " (v) 正本 " + n + " 本の刻印 " + by.size + " 種(今の html " + (by.has(now) ? "を含む" : "を含まない") + ")→ 候補のファイルで " + file + "・git の履歴で " + git + "・引けない " + miss + " 種(正本 " + missOut + " 本)"
  + (miss ? " —— 直し方: 作業ブランチの履歴に、前の便の途中の html を含む枝(前の作業ブランチ)を「先の親」として置く(git は道を変えない merge では先の親だけを辿る —— この道具は履歴を書き換えない)" : ""));
' "$REPO" 2>&1 | tail -1)"
  case "$S5" in OK*) S5="${S5#OK }" ;; NG*) S5="${S5#NG }"; need=1 ;; *) S5="(v) 刻印の点検が読めない —— $S5"; need=1 ;; esac
fi
out+=("$S5")

for l in "${out[@]}"; do say "$l"; done
echo "box-setup($MODE): $([ $need -eq 0 ] && echo "そろっている" || echo "足りない所が在る")(木 $REPO)"
exit $need
