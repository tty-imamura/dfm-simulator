// 第264便d(第56報 W4・統括の裁定 X6): **`sigma_primary` の印の厳密読み**(純関数・fs もブラウザも要らない)。
//
// ■ 直している欠陥(第263便c ⑤′ が**測って残した**もの — 本便で直す)
//   `paper/data/solar-observations.csv` の note に書く機械可読な印 `sigma_primary=verified|unverified` を、
//   門(`tests/exp-w249b-calaudit.mjs`)も σ 接続器(`tests/exp-w262d-solarsigma.mjs`)も会計器
//   (`tests/exp-w263c-obsintake.mjs`)も **`/sigma_primary=verified/` の部分一致**で読んでいた。
//   ところが第251便c が足した**凡例の文**そのものが
//     「… sigma_primary=verified means the number is … ; sigma_primary=unverified means it was derived …」
//   という語を含むので、**凡例を持つ行は、その行自身の印が unverified でも verified と読まれていた**。
//   第263便c の実測では該当 3 行(うち門へ繋がっている 1 行)。
//
// ■ 読み方(**宣言**であって推測ではない)
//   ① `sigma_primary=<語>` の出現を**語境界つき**で全部拾う(`xsigma_primary=` のような部分語は拾わない)。
//   ② 直後が `means` で始まる出現は**凡例**である(行の印ではない)。凡例は数えるが**印にしない**。
//   ③ **行の印は、凡例でない最初の出現**である(=「先頭一致」)。
//   ④ 凡例でない出現が 1 つも無ければ **印は無い**(`null`)。**無印は verified ではない**。
//   ⑤ `verified` と読むのは印が**ちょうど `verified`** のときだけである(それ以外は verified ではない)。
//
// ■ **なぜ「`;` の直後」に限定しないのか**(実測して決めた)
//   本便で 353 行を数えたところ、行の印は `…converted to m. sigma_primary=unverified; …` のように
//   **`.`(ピリオド)の直後**に置かれている行が多数派で、`/(^|;\s*)sigma_primary=/` に限ると
//   **19 行のうち 16 行が「印なし」へ落ちる**(= 門の σ の出所が一斉に落ちる)。
//   それは印の読み違いを直すのではなく**別の読み違いを入れる**ので採らない。
//   採ったのは ①〜⑤ の「語境界 + 凡例除外 + 先頭一致」である。
//
// ■ この器がしないこと
//   ・**印を上げ下げしない**(`verified` にするのは原仮定者の照合であって、読み手ではない)。
//   ・CSV を書かない・σ を作らない。

// 語境界つきの出現(`g` 付きなので lastIndex を毎回戻す)
const MARK_RE = /(?:^|[^A-Za-z0-9_])sigma_primary=([A-Za-z0-9_]+)/g;
// 直後が `means` で始まる出現は第251便c の**凡例**である(行の印ではない)
const LEGEND_RE = /^\s+means\b/;

/**
 * note 文字列から `sigma_primary` の印を厳密に読む。
 * @param {string} note CSV の note 列
 * @returns {{mark:(string|null), verified:boolean, own:string[], legend:string[], all:string[], index:number}}
 */
export function readSigmaMark(note) {
  const s = (typeof note === 'string') ? note : '';
  const all = [], own = [], legend = [];
  let mark = null, index = -1;
  MARK_RE.lastIndex = 0;
  let m;
  while ((m = MARK_RE.exec(s)) !== null) {
    const word = m[1];
    const at = m.index + m[0].length - ('sigma_primary='.length + word.length);
    const rest = s.slice(m.index + m[0].length);
    all.push(word);
    if (LEGEND_RE.test(rest)) { legend.push(word); continue; }
    own.push(word);
    if (mark === null) { mark = word; index = at; }
  }
  return { mark, verified: (mark === 'verified'), own, legend, all, index };
}

/** 門・器が使う 1 行版(第263便c までの `/sigma_primary=verified/` の置き換え) */
export function isSigmaPrimaryVerified(note) {
  return readSigmaMark(note).verified;
}

/** 旧読み(部分一致)。**比較のためだけに置く** —— 新しい経路では使わない。 */
export function legacyIsSigmaPrimaryVerified(note) {
  return /sigma_primary=verified/.test(typeof note === 'string' ? note : '');
}

// 第264便d(X7): `verified_by=<確認者> <YYYY-MM-DD>; verified_at=<URL の表/列>; verified_value=<原記載>`。
// **規約であって門ではない** —— `verified` なのに `verified_by` が無い行は**警告**で、拒否はしない
// (既存 19 行はこの規約より前に立った印なので、落とすと門の σ が一斉に消える)。
const VERIFIED_BY_RE = /(?:^|[^A-Za-z0-9_])verified_by=([^;]*)/;
const VERIFIED_AT_RE = /(?:^|[^A-Za-z0-9_])verified_at=([^;]*)/;
const VERIFIED_VALUE_RE = /(?:^|[^A-Za-z0-9_])verified_value=([^;]*)/;

/**
 * X7 の確認者欄を読む。`verified_by=` が空(= 欄だけ置いた)ときは `present:true, who:''` を返す。
 * @returns {{present:boolean, who:string, at:string|null, value:string|null, warn:boolean, why:string}}
 */
export function readVerifiedBy(note) {
  const s = (typeof note === 'string') ? note : '';
  const b = VERIFIED_BY_RE.exec(s), a = VERIFIED_AT_RE.exec(s), v = VERIFIED_VALUE_RE.exec(s);
  const who = b ? String(b[1]).trim() : '';
  const mark = readSigmaMark(s);
  const present = !!b && who !== '';
  const warn = (mark.verified && !present);
  return { present, who, at: a ? String(a[1]).trim() : null, value: v ? String(v[1]).trim() : null, warn,
    why: warn ? '`sigma_primary=verified` だが `verified_by=<確認者> <日付>` が無い(X7 の規約 — **警告であって拒否ではない**)' : '' };
}

// 第264便d(X13/⑥): `sigma_kind` と informational な尺度(**σ ではない**)。
//   `sigma_kind=none`   … 一次資料に 1σ が無い
//   `spread=<数>`       … 同じ量の別転写との隔たり(**σ ではない** — 判定に使わない)
//   `digits=<文字列>`   … 最終桁の丸め幅(**σ ではない**)
//   `older_sigma=<数>`  … 古い版の 1σ(**現行行の σ ではない**)
const KIND_RE = /(?:^|[^A-Za-z0-9_])sigma_kind=([A-Za-z0-9_]+)/;
const SPREAD_RE = /(?:^|[^A-Za-z0-9_])spread=([0-9eE.+-]+)/;
const OLDER_RE = /(?:^|[^A-Za-z0-9_])older_sigma=([0-9eE.+-]+)/;
const DIGITS_RE = /(?:^|[^A-Za-z0-9_])digits=([^;]*)/;

/**
 * informational な尺度を読む。**戻り値の `scale` は σ ではない**(門に入れてはならない)。
 * @returns {{kind:(string|null), spread:(number|null), olderSigma:(number|null), digits:(string|null),
 *            scale:(number|null), scaleKind:(string|null)}}
 */
export function readSigmaKind(note) {
  const s = (typeof note === 'string') ? note : '';
  const k = KIND_RE.exec(s), sp = SPREAD_RE.exec(s), ol = OLDER_RE.exec(s), dg = DIGITS_RE.exec(s);
  const num = (x) => { const n = Number(x); return (Number.isFinite(n) && n > 0) ? n : null; };
  const spread = sp ? num(sp[1]) : null;
  const older = ol ? num(ol[1]) : null;
  const digits = dg ? String(dg[1]).trim() : null;
  // **spread を優先**(別転写との隔たりのほうが「どれだけ揺れているか」に近い)。どちらも無ければ null。
  const scale = (spread !== null) ? spread : older;
  return { kind: k ? k[1] : null, spread, olderSigma: older, digits,
    scale, scaleKind: (spread !== null) ? 'spread' : (older !== null ? 'older_sigma' : null) };
}

export default { readSigmaMark, isSigmaPrimaryVerified, legacyIsSigmaPrimaryVerified,
  readVerifiedBy, readSigmaKind };
