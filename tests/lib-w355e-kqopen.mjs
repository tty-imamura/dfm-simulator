// 第355便e(原仮定者の指示(2026-11-25)「この結果を尊重する」・原仮定者の回答(2026-11-25)「推奨。ただし、必ず0.98 倍である必要は無い」・統括の検証項目 R508):
//   **6 組(自転の置き方 3 × k₂/Q の置き方 2)の共通部分が開く k₂/Q を閉じた形で数える lib と、全体の係数(= u ÷ 金星の条件の値)で読む 3 つの題の表・枝 c の端と枝 b の正本の照合**
//   (器 tests/exp-w355e-kqopen.mjs —— 正本 tests/out/kqopen-355e.json)。**診断だけ** —— エンジン・内蔵の本・受理器・既存の lib の本文は変えない。physics の鍵を足さない。
//   主の作り・物差しの半径 = 観測の半径・ある程度ロックをロックの側に(〔第355便b〕の主の読み)。X は k₂/Q に比例する(〔第355便b〕の零試験 ⑬)ので、天体ごとの X(u 1)を k₂/Q 1 あたりの値 a に直し、
//   組 i の天体 p の X(1) = a_i(p) × k_i(p)(k は組の置き方で、共通 = k_c・第337便c の置き方 = 固体 k_s か気体 k_g)と書く。共通部分が開く ⇔ すべての組 i・j と、ロックしない側の p・ロックの側の q で
//   a_i(p) k_i(p) < a_j(q) k_j(q)。比 k_i(p) ÷ k_j(q) の上限 = a_j(q) ÷ a_i(p) —— 3 つの比(k_s/k_c・k_g/k_c・k_s/k_g)の下限と上限が閉じた形(最大と最小)で出る(boundsOf)。
//   潮汐のトルクは「比べる列(DFM の式ではない)」。k₂/Q は仮の値・未照合(照合の依頼に書く候補の数 —— 値を置いたとは書かない)。
//   仮の値の lib(第352便b)は閉包に入る(〔第355便b〕の lib → 第353便zk の lib 経由 —— 本 lib は値を読まない。正本の最上位に provisional: true と鍵の一覧)。
// ■ 言わないこと: 共通部分が空であることを「外れた」と書かない(「この置き方の組では、共通部分は空 —— 開く k₂/Q は…」)。範囲を 1 つの値に置かない。0.98 倍は範囲の内の 1 点。
import * as B from './lib-w355b-bgrange.mjs';

export const LIB_VERSION = 'w355e-kqopen-lib-1';
export const rel = B.rel;
export const DECL = Object.freeze({
  build: 'M', ref: 'obs', partAsLock: true,
  modes: B.DECL.modes, kModes: B.DECL.k2qModes,
  /** いまの k₂/Q(〔第353便zk〕〔第355便b〕の既定 —— 仮・未照合): 共通 k_c・第337便c の置き方の固体 k_s と気体 k_g */
  k0: Object.freeze({ c: 1e-2, s: 3e-3, g: 1e-5 }),
  /** 開いた所の共通部分を並べる倍(開く下限の倍) */
  over: Object.freeze([1.001, 1.01, 1.05, 1.2]),
  uFocus: B.DECL.uFocus, window: B.DECL.window,
  judge: '零試験は相対 1e-9 の床(〔第355便b〕の正本の共通部分・範囲と同じ入力で照合)・表の数は有効数字 3 桁',
});
const SYM = Object.freeze(['c', 's', 'g']);
export const RATIOS = Object.freeze([['s', 'c'], ['g', 'c'], ['s', 'g']]);
const setsOf = () => DECL.modes.flatMap((m) => DECL.kModes.map((q) => ({ mode: m, kMode: q })));
const lockSide = (st, pl) => st === 'lock' || (pl && st === 'part');

/** 天体ごとの k₂/Q 1 あたりの X(u 1)と、第337便c の置き方での種類(固体 s・気体 g —— X の比から読む) */
export function unitRows(o = {}) {
  const R = {};
  for (const m of DECL.modes) {
    const rc = B.xRowsB(DECL.build, { mode: m, k2q: 'common', u: 1, ref: DECL.ref }, o), r7 = B.xRowsB(DECL.build, { mode: m, k2q: 'c337', u: 1, ref: DECL.ref }, o);
    R[m] = rc.map((r, n) => { const k7 = r7[n].X / r.X * DECL.k0.c; const kind = rel(k7, DECL.k0.s) < 1e-9 ? 's' : rel(k7, DECL.k0.g) < 1e-9 ? 'g' : null;
      return { id: r.id, state: r.state, a: r.X / DECL.k0.c, kind, k337: k7 }; });
  }
  return R;
}
const kOf = (K, kMode, kind) => (kMode === 'common' ? K.c : K[kind]);
const symOf = (kMode, kind) => (kMode === 'common' ? 'c' : kind);
/** k₂/Q の組 K = { c, s, g } での 6 組の範囲と共通部分(u 1 の X が範囲の端 —— X は u に反比例) */
export function commonAt(K, U, pl = DECL.partAsLock) {
  const each = setsOf().map(({ mode, kMode }) => {
    const rows = U[mode].map((r) => ({ ...r, X1: r.a * kOf(K, kMode, r.kind) }));
    const N = rows.filter((r) => !lockSide(r.state, pl)), L = rows.filter((r) => lockSide(r.state, pl));
    const lo = N.reduce((a, r) => (r.X1 > a.X1 ? r : a), N[0]), hi = L.reduce((a, r) => (r.X1 < a.X1 ? r : a), L[0]);
    return { mode, kMode, lo: lo.X1, hi: hi.X1, loBody: lo.id, hiBody: hi.id, open: lo.X1 < hi.X1 };
  });
  const loR = each.reduce((a, r) => (r.lo > a.lo ? r : a), each[0]), hiR = each.reduce((a, r) => (r.hi < a.hi ? r : a), each[0]);
  return { lo: loR.lo, hi: hiR.hi, open: loR.lo < hiR.hi && each.every((r) => r.open), gap: loR.lo / hiR.hi,
    loFrom: { mode: loR.mode, kMode: loR.kMode, body: loR.loBody }, hiFrom: { mode: hiR.mode, kMode: hiR.kMode, body: hiR.hiBody }, each };
}
/**
 * 閉じた形: すべての (組 i, ロックしない p)・(組 j, ロックの側 q) で a_i(p) k_i(p) < a_j(q) k_j(q)。
 * 比 x/y(x = k_i(p) の記号・y = k_j(q) の記号)の上限 = min a_j(q) ÷ a_i(p)。逆向き(y/x の上限)は x/y の下限。同じ記号どうし(x = y)は定数の条件(上限 > 1)。
 * 返す: { ratios: [{ x, y, lo, loFrom, hi, hiFrom }], consts: [{ x, ub, from, ok }] }
 */
export function boundsOf(U, pl = DECL.partAsLock) {
  const ub = {}, from = {};
  const put = (x, y, c, f) => { const k = x + '/' + y; if (!(k in ub) || c < ub[k]) { ub[k] = c; from[k] = f; } };
  for (const si of setsOf()) for (const sj of setsOf()) for (const p of U[si.mode]) for (const q of U[sj.mode]) {
    if (lockSide(p.state, pl) || !lockSide(q.state, pl)) continue;
    put(symOf(si.kMode, p.kind), symOf(sj.kMode, q.kind), q.a / p.a, { lo: { mode: si.mode, kMode: si.kMode, body: p.id }, hi: { mode: sj.mode, kMode: sj.kMode, body: q.id } });
  }
  const ratios = RATIOS.map(([x, y]) => {
    const kU = x + '/' + y, kL = y + '/' + x;
    return { x, y, lo: kL in ub ? 1 / ub[kL] : 0, loFrom: from[kL] || null, hi: kU in ub ? ub[kU] : Infinity, hiFrom: from[kU] || null };
  });
  const consts = SYM.filter((x) => (x + '/' + x) in ub).map((x) => ({ x, ub: ub[x + '/' + x], from: from[x + '/' + x], ok: ub[x + '/' + x] > 1 }));
  return { ratios, consts };
}
const rOf = (Bd, x, y) => Bd.ratios.find((r) => r.x === x && r.y === y);
/** いまの K で、どの比の条件が外れているか */
export function violated(Bd, K = DECL.k0) {
  return Bd.ratios.map((r) => { const v = K[r.x] / K[r.y]; return { ...r, now: v, inside: v > r.lo && v < r.hi, below: v <= r.lo, above: v >= r.hi }; });
}
/** 1 つの値だけを動かして開く区間(ほかの 2 つは K のまま —— 閉じた形)。sym ∈ c・s・g。返す { sym, lo, hi, open, loFrom, hiFrom } */
export function openOne(Bd, sym, K = DECL.k0) {
  let lo = 0, hi = Infinity, loFrom = null, hiFrom = null;
  for (const r of Bd.ratios) {
    if (r.x === sym) { const o = K[r.y]; if (r.lo * o > lo) { lo = r.lo * o; loFrom = r.loFrom; } if (r.hi * o < hi) { hi = r.hi * o; hiFrom = r.hiFrom; } }
    else if (r.y === sym) { const o = K[r.x]; if (r.hi > 0 && o / r.hi > lo) { lo = o / r.hi; loFrom = r.hiFrom; } if (r.lo > 0 && o / r.lo < hi) { hi = o / r.lo; hiFrom = r.loFrom; } }
  }
  return { sym, lo, hi, open: lo < hi, loFrom, hiFrom, now: K[sym], inside: K[sym] > lo && K[sym] < hi };
}
/** 開いた所の共通部分(1 つの値を開く下限の倍に置く) */
export function openedAt(Bd, U, sym, f, K = DECL.k0) {
  const one = openOne(Bd, sym, K), K2 = { ...K, [sym]: sym === 'c' ? one.hi / f : one.lo * f };
  return { sym, f, k: K2[sym], K: K2, part: commonAt(K2, U) };
}

/* ───────── 枝 c の端と枝 b の正本の照合(2 つの正本を読んで比べる —— lib どうしは import しない)───────── */
const fin = (x) => typeof x === 'number' && Number.isFinite(x);
export const fp3 = (x) => (!fin(x) ? '—' : Math.abs(x) >= 1e4 || (Math.abs(x) < 1e-3 && x !== 0) ? Number(x).toExponential(2) : Number(x).toPrecision(3));
/** 枝 b の正本の主の行(decl の主の作り・物差しの半径・置き方・k₂/Q・読み) */
export function mainRowOf(Jb) {
  const d = Jb && Jb.decl; if (!d || !Jb.t3) return null;
  return Jb.t3.rows.find((r) => r.build === d.mainBuild && r.ref === d.refMain && r.mode === d.modeMain && r.k2q === d.k2qMain && r.partAsLock === d.partAsLockMain) || null;
}
/** 枝 c の端(ノブ)= 枝 b の正本の主の行の端を 3 桁に丸めた数 か */
export function seamC(Jb, Jc) {
  const bad = [], m = mainRowOf(Jb), e = Jc && Jc.ends;
  if (!m) bad.push('枝 b の正本に主の行が無い');
  if (!e || !fin(e.lo) || !fin(e.hi)) bad.push('枝 c の正本に端(ends)が無い');
  if (bad.length) return { bad, rows: [] };
  const rows = [['lo', m.lo, e.lo], ['hi', m.hi, e.hi]].map(([k, b, c]) => ({ end: k, b, b3: Number(fp3(b)), c, same: Number(fp3(b)) === c }));
  for (const r of rows) if (!r.same) bad.push('枝 c の端 ' + r.end + ' ' + r.c + ' が枝 b の正本の主の行の端の 3 桁 ' + fp3(r.b) + ' と違う');
  if (!(Jc.decl && Jc.decl.ends && Jc.decl.ends.lo === e.lo && Jc.decl.ends.hi === e.hi)) bad.push('枝 c の正本の ends と decl.ends が違う(端を置き直して走らせた正本)');
  return { bad, rows };
}

/* ───────── 全体の係数(= u ÷ 金星の条件の値)で読む 3 つの題 ───────── */
/** (a) 0.98 倍 (b) 線 1 の範囲(主の行)(c) 金星に残るトルクに地球の項が届く u の上端(〔第355便b〕の正本の表 6 —— 比は u に反比例)(d) 共通部分(k₂/Q 共通の 3 組・6 組を開いた所) */
export function coefTopics(Jb, U, Bd, o = {}) {
  const uV = B.uVOf(true, o), m = B.uRange(DECL.build, { mode: 'obs', k2q: 'common', ref: DECL.ref }, o), c = Jb.t6.c;
  const cm3 = B.commonPart(DECL.build, { ref: DECL.ref, partAsLock: DECL.partAsLock, sets: DECL.modes.map((q) => ({ mode: q, k2q: 'common' })) }, o);
  const op = openedAt(Bd, U, 's', DECL.over[1]);
  const T = [
    { id: 'a', name: '0.98 倍', uLo: DECL.uFocus, uHi: DECL.uFocus },
    { id: 'b', name: '線 1 で分かれる範囲(主の行)', uLo: m.lo, uHi: m.hi },
    { id: 'cTideInf', name: '地球の潮汐(内合)が金星に残るトルクに届く', uLo: 0, uHi: c.tideInfUMax },
    { id: 'cTideMean', name: '地球の潮汐(1 会合の平均)が届く', uLo: 0, uHi: c.tideMeanUMax },
    { id: 'cEg', name: '(E-g) の最大((B − A)/C 1e-5)が届く', uLo: 0, uHi: c.egUMax },
    { id: 'dCommon3', name: '共通部分(k₂/Q 共通の 3 組)', uLo: cm3.lo, uHi: cm3.hi },
    { id: 'dSixOpen', name: '共通部分(6 組 —— 固体の k₂/Q を開く下限の ' + DECL.over[1] + ' 倍)', uLo: op.part.lo, uHi: op.part.hi },
  ].map((r) => ({ ...r, coefLo: r.uLo / uV, coefHi: r.uHi / uV }));
  const ov = (A, Bq) => { const lo = Math.max(A.uLo, Bq.uLo), hi = Math.min(A.uHi, Bq.uHi); return lo <= hi ? { lo, hi, coefLo: lo / uV, coefHi: hi / uV } : null; };
  const by = (id) => T.find((r) => r.id === id);
  const pairs = [['a', 'b'], ['b', 'cTideInf'], ['b', 'cTideMean'], ['b', 'cEg'], ['a', 'cEg'], ['b', 'dCommon3'], ['cEg', 'dCommon3'], ['cEg', 'dSixOpen']].map(([x, y]) => ({ x, y, ov: ov(by(x), by(y)) }));
  const abc = ov(by('a'), by('b')) && ov({ uLo: DECL.uFocus, uHi: DECL.uFocus }, by('cEg'));
  return { uV, rows: T, pairs, abc: abc ? { u: DECL.uFocus, coef: DECL.uFocus / uV } : null, openUsed: { sym: 's', f: DECL.over[1], k: op.k } };
}

/* ───────── 零試験(〔第355便b〕の正本と同じ入力で照合)───────── */
export function pureScenes(Jb, o = {}) {
  const U = unitRows(o), Bd = boundsOf(U), cur = commonAt(DECL.k0, U);
  const t4six = Jb.t4.find((q) => q.build === DECL.build && q.ref === DECL.ref && q.partAsLock === DECL.partAsLock && q.sets === 'six');
  const rowsB = Jb.t3.rows.filter((r) => r.build === DECL.build && r.ref === DECL.ref && r.partAsLock === DECL.partAsLock);
  const twice = commonAt({ c: 2 * DECL.k0.c, s: 2 * DECL.k0.s, g: 2 * DECL.k0.g }, U);
  const v = violated(Bd), os = openOne(Bd, 's');
  const atLo = commonAt({ ...DECL.k0, s: os.lo * (1 - 1e-9) }, U), atUp = commonAt({ ...DECL.k0, s: os.lo * (1 + 1e-9) }, U);
  return { U, Bd, cur, t4six, rowsB, twice, v, os, atLo, atUp };
}
export function pureGates(S) {
  const near = (a, b, t = 1e-9) => a === b || rel(a, b) <= t;
  const kinds = Object.values(S.U).flat();
  return {
    kinds: kinds.every((r) => r.kind === 's' || r.kind === 'g'),
    sixJson: near(S.cur.lo, S.t4six.lo) && near(S.cur.hi, S.t4six.hi) && S.cur.open === S.t4six.open && S.cur.loFrom.body === S.t4six.loFrom.body && S.cur.hiFrom.body === S.t4six.hiFrom.body,
    eachJson: S.cur.each.every((e) => { const r = S.rowsB.find((q) => q.mode === e.mode && q.k2q === e.kMode); return r && near(e.lo, r.lo) && near(e.hi, r.hi) && e.loBody === r.loBody && e.hiBody === r.hiBody; }),
    scale: near(S.twice.lo, 2 * S.cur.lo) && near(S.twice.hi, 2 * S.cur.hi),
    constsOk: S.Bd.consts.every((c) => c.ok),
    closedEdge: S.atLo.open === false && S.atUp.open === true,
    nowShut: S.v.some((r) => !r.inside) && S.cur.open === false,
  };
}
