// 第338便c(原仮定者の指示(2026-11-15 —— 第139報)・統括の検証項目 R351): **「器を走らせ直して正本と同じ」の照合を、量ごとの数値の尺度で行う純関数**
//   (器 tests/exp-w337i-rotring.mjs・exp-w337j-spinorbit.mjs・exp-w337k-gyrodrag.mjs が正本を書くときと、QA behavior.rotring337i・behavior.spinorbit337j・behavior.gyrodrag337k・
//   lint.recheckScale338c が呼ぶ —— html を読まない・ファイルを読まない・状態を持たない)。
//
// ■ 何を直すか
//   第337便の統括の比べ方(葉ごとに相対 1e-6・外れた葉は同じ行の整数でない数の最大の 1e-12 倍の内なら通す)は、同じ行に桁の大きい数(傾きの率 ÷ 傾き —— 1e9 の桁)があると、
//   小さい量の大きな変化を通す(例: 環の行の交点の率を 6.55e-7 → 1e-5 にしても通る —— 同じ行の d ln i/dt が床を決める)。実行系の Math.pow の末尾の 1 bit が Node の版で違い
//   (Node 22 と 24)、薄い環の幾何(高さ ÷ 半径 ≈ 1e-7)と公転の平均の打ち消しで増幅されるので、葉ごとの相対 1e-9 だけでは版が違うと通らない —— が出発点。
// ■ 型(量ごとの尺度 —— 手書きの葉の一覧を持たない)
//   ① 尺度 σ(葉ごと): 同じ器を、Math の関数(pow・sqrt・三角・逆三角・指数・対数・cbrt・hypot ほか ULP_FNS)の戻り値を決まった種から ±1〜2 ulp ずらして(決まった擬似乱数 ——
//      Math.random は使わない)SEEDS の数だけ走らせ直し、葉ごとの差の最大を σ とする(実行系の末尾の bit の違いが、その量の打ち消しと増幅を通ってどれだけ出るかを、その量について測る)。
//      **同じ量・同じ単位の打ち消す前の大きさ**を、和の項を書き直さずに読む方法(式ごとの手書きの伝播を持たない)。
//   ② 正本へ書くとき(settle): |値| ≤ ZERO_FACTOR × σ の葉は 0 と書く(丸めの残り —— 値そのものが版ごとに変わる)。それ以外は値のまま。0 と書いた葉の数と係数は正本の meta.recheck に。
//   ③ 照合(recheckTree): 数でない欄(真偽・文字列・null・構造)は完全一致/正本で 0 と書いた葉は、作り直しの値が ZERO_ACCEPT × σ′ の内(σ′ = 作り直しで測り直した尺度)/
//      それ以外の数は |正本 − 作り直し| ≤ max(REL × max(|正本|, |作り直し|), TOL_FACTOR × σ′)。σ′ は**作り直しの側で測る**(正本の数を変えても許容は広がらない)。
//   ④ 拾えないもの(正直に): 尺度 σ′ が値の 1e-5 ÷ TOL_FACTOR 倍を超える葉(打ち消しで桁を失った量)の相対 1e-5 の変化/0 と書いた葉の相対の変化(0 のまま —— 変異にならない)。
//      変異の試しはこの 2 つを数えて報告する(許容を広げて通さない)。
// ■ 言わないこと: σ は数値の尺度(物理の不確かさではない)。0 と書いた量は「この計算の精度では 0 と区別できない」—— 物理の量が 0 だという主張ではない。
export const LIB_VERSION = 'w338c-recheck-lib-1';
/** 宣言(正本の meta.recheck に写す) */
export const DECL = Object.freeze({
  ULP_FNS: Object.freeze(['pow', 'sqrt', 'cbrt', 'hypot', 'sin', 'cos', 'tan', 'asin', 'acos', 'atan', 'atan2', 'sinh', 'cosh', 'tanh', 'exp', 'expm1', 'log', 'log1p', 'log10', 'log2']),
  SEEDS: Object.freeze([12345, 20261115]),
  REL: 1e-9,
  ZERO_FACTOR: 4,
  ZERO_ACCEPT: 128,
  TOL_FACTOR: 8,
  why: '尺度 σ は Math の関数の戻り値を ±1〜2 ulp ずらした走り直しの差の最大(葉ごと)。0 と書く係数 4(尺度が値の 1/4 を超える —— 有効数字が 1 桁に満たない葉。打ち消しで 0 になる量はこの内に入り、桁を失っても残る量〔尺度が値の数 % の傾き・近点の率〕は値のまま)・0 と書いた葉の受け入れ 128(0 と書いた葉の Node 24 の作り直しの値 ÷ σ′ の最大 15 —— 約 8 倍の余裕)・照合の係数 8(Node 24 の差 ÷ σ′ の最大 1.7 —— 約 4.7 倍の余裕。16 では統括の検証項目の変異〔環の行の交点の率 → 1e-5 —— 尺度の 14 倍〕を通す —— 第338便c の測り)',
});
const EPS = 2.220446049250313e-16;

/** fn を、Math の関数の戻り値を決まった種から ±1〜2 ulp ずらして走らせる(同期の関数だけ —— 終われば元に戻す) */
export function withUlpNoise(seed, fn, fns = DECL.ULP_FNS) {
  let s = seed >>> 0;
  const orig = fns.map((n) => [n, Math[n]]);
  for (const [n, o] of orig) {
    Math[n] = function () { const y = o.apply(Math, arguments); s = (Math.imul(s, 1664525) + 1013904223) >>> 0; const r = (s >>> 30) % 3 - 1; return r === 0 ? y : y * (1 + r * EPS); };
  }
  try { return fn(); } finally { for (const [n, o] of orig) Math[n] = o; }
}
const plain = (x) => JSON.parse(JSON.stringify(x));
/** 尺度の木: run() を元のまま 1 回と SEEDS の数だけずらして走らせ、葉ごとの差の最大(数の葉だけ —— ほかは null)。構造が違う見本(判定が反転した枝)はその葉の推定から外し unstable に数える */
export function sigmaOf(run, { seeds = DECL.SEEDS, fns = DECL.ULP_FNS } = {}) {
  const base = plain(run()), samples = seeds.map((sd) => plain(withUlpNoise(sd, run, fns)));
  const unstable = [];
  const w = (b, ps, pth) => {
    if (typeof b === 'number') { let m = 0; for (const q of ps) { if (typeof q === 'number') m = Math.max(m, Math.abs(q - b)); else unstable.push(pth); } return m; }
    if (b && typeof b === 'object') {
      const out = Array.isArray(b) ? [] : {};
      for (const k of Object.keys(b)) out[k] = w(b[k], ps.map((q) => (q && typeof q === 'object' ? q[k] : undefined)), pth + '/' + k);
      return out;
    }
    for (const q of ps) if (q !== b && !(q && typeof q === 'object')) unstable.push(pth);
    return null;
  };
  const sigma = w(base, samples, '');
  return { base, sigma, unstable: [...new Set(unstable)] };
}
/** 正本へ書く形: |値| ≤ ZERO_FACTOR × σ の葉を 0 に(-0 も 0)。戻り値 { value, zeroed, kept, zeroPaths(先頭 20)} */
export function settle(base, sigma, { zeroFactor = DECL.ZERO_FACTOR } = {}) {
  let zeroed = 0, kept = 0; const zeroPaths = [];
  const w = (b, sg, pth) => {
    if (typeof b === 'number') {
      if (b === 0) return 0;
      const s = typeof sg === 'number' ? sg : 0;
      if (Number.isFinite(b) && Math.abs(b) <= zeroFactor * s) { zeroed++; if (zeroPaths.length < 20) zeroPaths.push(pth); return 0; }
      kept++; return b;
    }
    if (b && typeof b === 'object') { const out = Array.isArray(b) ? [] : {}; for (const k of Object.keys(b)) out[k] = w(b[k], sg && typeof sg === 'object' ? sg[k] : null, pth + '/' + k); return out; }
    return b;
  };
  return { value: w(base, sigma, ''), zeroed, kept, zeroPaths };
}
/** 照合: fresh = 作り直しの値(0 にしない生の値)・sigma = 作り直しで測った尺度・canon = 正本の値。戻り値 { n, worst, first, hits(先頭 20 —— [道, 正本, 作り直し, 理由]), nLeaves, nZero } */
export function recheckTree(fresh, sigma, canon, { rel = DECL.REL, tolFactor = DECL.TOL_FACTOR, zeroAccept = DECL.ZERO_ACCEPT } = {}) {
  const out = { n: 0, worst: 0, first: null, hits: [], nLeaves: 0, nZero: 0 };
  const hit = (pth, a, b, why, r) => { out.n++; out.worst = Math.max(out.worst, r); if (out.first === null) out.first = pth; if (out.hits.length < 20) out.hits.push([pth, a, b, why]); };
  const w = (x, sg, y, pth) => {
    if (typeof x === 'number' || typeof y === 'number') {
      out.nLeaves++;
      if (typeof x !== 'number' || typeof y !== 'number') { hit(pth, y, x, '型', Infinity); return; }
      if (x === y) { if (y === 0) out.nZero++; return; }
      if (!Number.isFinite(x) || !Number.isFinite(y)) { hit(pth, y, x, '有限でない', Infinity); return; }
      const s = typeof sg === 'number' ? sg : 0, d = Math.abs(x - y);
      if (y === 0) { out.nZero++; if (Math.abs(x) <= zeroAccept * s) return; hit(pth, y, x, '0 と書いた葉が尺度の外', s > 0 ? Math.abs(x) / s : Infinity); return; }
      const lim = Math.max(rel * Math.max(Math.abs(x), Math.abs(y)), tolFactor * s);
      if (d <= lim) return;
      hit(pth, y, x, '尺度の外', d / Math.max(Math.abs(x), Math.abs(y))); return;
    }
    if (x === null || y === null || typeof x !== 'object' || typeof y !== 'object') { if (x !== y) hit(pth, y, x, '数でない欄', Infinity); return; }
    if (Array.isArray(x) !== Array.isArray(y)) { hit(pth, '[構造]', '[構造]', '構造', Infinity); return; }
    for (const k of new Set([...Object.keys(x), ...Object.keys(y)])) {
      if (!(k in x) || !(k in y)) { hit(pth + '/' + k, k in y ? '(あり)' : '(なし)', k in x ? '(あり)' : '(なし)', '鍵', Infinity); continue; }
      w(x[k], sg && typeof sg === 'object' ? sg[k] : null, y[k], pth + '/' + k);
    }
  };
  w(fresh, sigma, canon, '');
  return out;
}
/** 器の照合の一式: run() で作り直し(と尺度)・正本 canon の部 parts を比べる。戻り値 { diffs: {部: recheckTree の戻り}, unstable, nLeaves, nZero } */
export function recheckRun(run, canon, parts, opts = {}) {
  const { base, sigma, unstable } = sigmaOf(run, opts);
  const diffs = {}; let nLeaves = 0, nZero = 0;
  for (const k of parts) { diffs[k] = recheckTree(base[k], sigma[k], canon[k], opts); nLeaves += diffs[k].nLeaves; nZero += diffs[k].nZero; }
  return { diffs, unstable, nLeaves, nZero, base, sigma };
}
/** 器が正本を書くときの一式: run() の生の値・尺度・0 と書いた形と meta.recheck */
export function settleRun(run, opts = {}) {
  const { base, sigma, unstable } = sigmaOf(run, opts), S = settle(base, sigma, opts);
  return { value: S.value, meta: { version: LIB_VERSION, decl: DECL, zeroed: S.zeroed, kept: S.kept, zeroPathsHead: S.zeroPaths, unstable: unstable.length, unstableHead: unstable.slice(0, 20) } };
}

/* ───────── 自己試験(lint.recheckScale338c)───────── */
/** 打ち消しの残りを持つ小さな器: 大きな項の差(解析的に 0)・薄い角で割る量(増幅)・ふつうの量・真偽と文字列と一覧 */
export function toyRun() {
  const rows = [];
  for (let j = 1; j <= 6; j++) {
    const a = 1.7e3 * j + 0.3, x = Math.pow(a, 1.5), y = Math.sqrt(a) * a;             // x − y は解析的に 0(丸めの残り)
    const tilt = 1e-3 * j, small = Math.sin(tilt) / tilt - 1;                      // 打ち消しで桁を失うが残る量(−tilt²/6 の桁 —— 同じ行の大きな数の 1e-12 倍より小さい)
    rows.push({ key: 'r' + j, big: x, res: x - y, amp: small, ok: x > 0, n: j });
  }
  return { rows, list: rows.map((r) => r.key), note: 'toy' };
}
export function selfTest() {
  const G = {};
  const S = settleRun(toyRun), J = S.value;
  G.residueZeroed = J.rows.every((r) => r.res === 0) && S.meta.zeroed >= 1;
  G.realKept = J.rows.every((r) => r.big > 0 && r.amp !== 0);
  const same = recheckRun(toyRun, J, ['rows', 'list', 'note']);
  G.sameOk = Object.values(same.diffs).every((d) => d.n === 0);
  const mut = (f) => { const Jm = plain(J); f(Jm); return Object.values(recheckRun(toyRun, Jm, ['rows', 'list', 'note']).diffs).reduce((s, d) => s + d.n, 0) > 0; };
  G.catchBig = mut((Jm) => { Jm.rows[2].big *= 1 + 1e-5; });
  G.catchAmp = mut((Jm) => { Jm.rows[3].amp *= 1 + 1e-5; });
  G.catchResidueToReal = mut((Jm) => { Jm.rows[1].res = 1e-3 * Jm.rows[1].big; });
  G.catchBool = mut((Jm) => { Jm.rows[0].ok = !Jm.rows[0].ok; });
  G.catchStr = mut((Jm) => { Jm.list[1] = 'zz'; });
  G.catchCount = mut((Jm) => { Jm.list.pop(); });
  G.catchInt = mut((Jm) => { Jm.rows[4].n += 1; });
  G.catchKey = mut((Jm) => { delete Jm.note; });
  // 尺度は作り直しの側で測る: 正本の数を変えても許容は広がらない(第337便の比べ方の型の弱さ —— 同じ行の大きな数が床を決める —— を持たない)
  const oldRule = (A, B) => { let bad = 0; const maxNum = (o) => { let m = 0; const ww = (v) => { if (typeof v === 'number') { if (!Number.isInteger(v)) m = Math.max(m, Math.abs(v)); } else if (v && typeof v === 'object') for (const k of Object.keys(v)) ww(v[k]); }; ww(o); return m; };
    A.rows.forEach((r, i) => { for (const k of ['big', 'res', 'amp']) { const x = r[k], y = B.rows[i][k], d = Math.abs(x - y); if (!(x === y || d <= 1e-6 * Math.max(Math.abs(x), Math.abs(y)) || d <= 1e-12 * maxNum(B.rows[i]))) bad++; } }); return bad; };
  { const Jm = plain(J); Jm.rows[3].amp *= 1 + 1e-5; G.oldRuleMissesAmp = oldRule(plain(toyRun()), Jm) === 0; }
  { const p0 = Math.pow, s0 = Math.sin; withUlpNoise(1, () => Math.pow(2, 0.5)); G.noiseRestored = Math.pow === p0 && Math.sin === s0 && Math.pow(2, 0.5) === 1.4142135623730951; }
  return G;
}
