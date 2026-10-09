// 第297便b(原仮定者の裁定(第87報)「『再現しない』という主張はしない。『再現する努力』を常に優先度の高い目標に掲げる。『再現するために計算を合わせた』と
// 『再現したと主張しない』は両立する」・統括の検証項目 R162)—— **フィット生成器の純関数(第296便b の後継)**(Node だけ・html を読まない・エンジンを走らせない ——
// 器 tests/exp-w297b-fit.mjs と QA が使う)。第296便b の純関数(tests/lib-w296b-fit.mjs —— 格子・挟み・Illinois・感度・CSV・表の行)はそのまま再輸出し、
// 版と記録の形・許容の門・🌤️ の再現作業(初期配置の幾何・抽出器 3 方式・表の行)だけをここに足す。
//
// ■ 足したもの
//   ・fitRecord の版 w297b-1(targets[].tol・cond〔条件の署名 —— 値は html の fitCondSig が作る〕)・許容の宣言 TOLS(出典に σ が無い量は kind:"declared")・
//     status の門 statusOf297(根を挟み、|残差| + 数値誤差 ≤ 許容 のときだけ fitted)。
//   ・🌤️ の初期配置: 親の地球–月の重心(位置・速度)を保ち(丸めの差は 1 ulp)、相対ベクトルだけを (近地点距離 rp, 接触離心率 e0, 太陽方向からの角 φ) で置き直す emIcBodies。
//   ・抽出器 3 方式(同じ走行の事象列から): M1 近点の方位(位置だけ —— 検出器 B の 3 点放物線)の時刻への直線 fit / M2 離心ベクトル(位置の中心差分の座標速度から作る
//     接触離心ベクトルの方位の時刻への直線 fit)/ M3 位相の回帰(近点の時刻の番号への傾き = 近点月、周回の時刻の傾き = 恒星月 → 1/(1/恒星月 − 1/近点月))。
//
// ■ 言わないこと
//   ・「現実を再現した」「月を再現した」「8.85 年を出した」「gain は普遍定数」。届かない量は値をそのまま書き、「この探索範囲では未達 —— 次の見直し」と書く。
export * from './lib-w296b-fit.mjs';
import { ex, fx } from './lib-w296b-fit.mjs';

export const FIT_LIB_VERSION = 'w297b-fit-lib-1';
export const FIT_RECORD_VERSION = 'w297b-1';
export const FIT_RECORD_VERSIONS = Object.freeze(['w296b-1', 'w297b-1']);
export const FIT_COND_VERSION = 'w297b-cond-1';
export const FIT_RECORD_KEYS = Object.freeze(['version', 'parent', 'law', 'targets', 'knobs', 'fixed', 'procedure', 'dt', 'steps', 'residual', 'numerics', 'status', 'notFitted', 'notIdentifiable', 'cond']);
export const FIT_TARGET_KEYS = Object.freeze(['q', 'obs', 'unit', 'source', 'window', 'tol']);
export const FIT_TOL_KEYS = Object.freeze(['value', 'kind', 'note']);
export const FIT_COND_KEYS = Object.freeze(['version', 'sig', 'extractor']);
export const EM_EXTRACTOR_VERSION = 'w297b-emx-1';

/** 観測側の許容(本ごと)。出典に σ の無い量は kind:"declared"(照合許容の宣言 —— σ を作らない)。 */
export const TOLS = Object.freeze({
  mer: Object.freeze({ value: 0.0009, kind: 'declared',
    note: '照合許容の宣言 0.0009″/世紀 —— 標的 43.0″/世紀は照合規約の値で出典の σ を持たない。幅は Park 2017 Table 3 の Gravitoelectric の行(42.9799″/世紀)の 1σ と同じにした' }),
  plu: Object.freeze({ value: 0.02592, kind: 'sigma', note: 'Buie, Tholen & Grundy 2012 の P = 6.3872273(3) 日の 1σ(3×10⁻⁷ 日 = 0.02592 s)' }),
  ems: Object.freeze({ value: 0.005, kind: 'declared',
    note: '照合許容の宣言 0.005 年 —— 8.85 年は表記の末位まで(σ なし)。慣性系の平均の近地点経度の率(Chapront 2002 Table 4・SOL-c34be08a の 40.67616758°/年 → 8.85038 年)はこの幅の中' }),
});
/** status の門(第297便b): 挟めない → unreachable-in-bounds / 挟めて |残差| + h2 ≤ 許容 → fitted / それ以外 → not-identifiable。 */
export function statusOf297(o) {
  if (!o.bracketed) return 'unreachable-in-bounds';
  if (!(Number.isFinite(o.residual) && Number.isFinite(o.h2) && Number.isFinite(o.tol))) return 'not-identifiable';
  return Math.abs(o.residual) + o.h2 <= o.tol ? 'fitted' : 'not-identifiable';
}

/* ── 🌤️ の初期配置 ─────────────────────────────────────────── */
/**
 * 親の bodies(0=太陽 pinned・1=地球・2=月)から、地球–月の重心の位置・速度をそのまま保ち、相対ベクトル(地球→月)だけを置き直した写しを返す。
 * 近地点距離 rp・接触離心率 e0(二体ケプラーの μ = G(m地+m月))で近地点に置き、向きは太陽の反対方向(+x)から反時計回りに φ 度。
 */
export function emIcBodies(bodies, G, o) {
  const B = JSON.parse(JSON.stringify(bodies));
  const E = B[1], M = B[2], mt = E.m + M.m, fM = M.m / mt, mu = G * mt;
  const bx = (E.m * E.x + M.m * M.x) / mt, by = (E.m * E.y + M.m * M.y) / mt, bvx = (E.m * E.vx + M.m * M.vx) / mt, bvy = (E.m * E.vy + M.m * M.vy) / mt;
  const ph = (o.phi || 0) * Math.PI / 180, vp = Math.sqrt(mu * (1 + o.e0) / o.rp);
  const rx = o.rp * Math.cos(ph), ry = o.rp * Math.sin(ph), vx = -vp * Math.sin(ph), vy = vp * Math.cos(ph);
  E.x = bx - fM * rx; E.y = by - fM * ry; E.vx = bvx - fM * vx; E.vy = bvy - fM * vy;
  M.x = bx + (1 - fM) * rx; M.y = by + (1 - fM) * ry; M.vx = bvx + (1 - fM) * vx; M.vy = bvy + (1 - fM) * vy;
  return B;
}
/** 宣言の bodies から二体の接触要素(地球–月)と重心の量を読む(点検の表)。 */
export function emIcAudit(bodies, G) {
  const S = bodies[0], E = bodies[1], M = bodies[2], mt = E.m + M.m, mu = G * mt;
  const dx = M.x - E.x, dy = M.y - E.y, dvx = M.vx - E.vx, dvy = M.vy - E.vy, r = Math.hypot(dx, dy), v2 = dvx * dvx + dvy * dvy;
  const a = 1 / (2 / r - v2 / mu), h = dx * dvy - dy * dvx, exv = (dvy * h) / mu - dx / r, eyv = (-dvx * h) / mu - dy / r;
  const bx = (E.m * E.x + M.m * M.x) / mt, by = (E.m * E.y + M.m * M.y) / mt, bvx = (E.m * E.vx + M.m * M.vx) / mt, bvy = (E.m * E.vy + M.m * M.vy) / mt;
  const R = Math.hypot(bx - S.x, by - S.y), V = Math.hypot(bvx, bvy), vc = Math.sqrt(G * S.m / R);
  const ang = (Math.atan2(dy, dx) - Math.atan2(by - S.y, bx - S.x)) * 180 / Math.PI;
  return { rp: r, vRel: Math.sqrt(v2), mu, aOsc: a, eOsc: Math.hypot(exv, eyv), POsc: 2 * Math.PI * Math.sqrt(a * a * a / mu), fM: M.m / mt,
    R, V, vCirc: vc, vRatio: V / vc, phiDeg: ((ang % 360) + 360) % 360, radial: (dx * dvx + dy * dvy) / r };
}

/* ── 抽出器 3 方式(事象列から —— 純関数)── */
export function linfit(xs, ys) {
  const n = xs.length; if (n < 3) return null;
  const mx = xs.reduce((s, x) => s + x, 0) / n, my = ys.reduce((s, y) => s + y, 0) / n;
  let sxy = 0, sxx = 0; for (let i = 0; i < n; i++) { sxy += (xs[i] - mx) * (ys[i] - my); sxx += (xs[i] - mx) * (xs[i] - mx); }
  const sl = sxy / sxx; let ss = 0; for (let i = 0; i < n; i++) { const e = ys[i] - my - sl * (xs[i] - mx); ss += e * e; }
  return { slope: sl, rms: Math.sqrt(ss / n), n };
}
export function unwrap(a) {
  const o = [];
  for (let i = 0; i < a.length; i++) { let x = a[i]; if (i) { let z = x - o[i - 1]; while (z > Math.PI) z -= 2 * Math.PI; while (z < -Math.PI) z += 2 * Math.PI; x = o[i - 1] + z; } o.push(x); }
  return o;
}
/**
 * 窓 [0,N] 公転の 3 方式。ev = {rev:[t…], peri:[{t,ang,r}…], apo:[{t,ang,r}…], ecc:[[t,ang,e,a]…]}・U = {year, day}(本の時間単位)。
 * 返す: T1/T2/T3 [年]・rms1/rms2 [°]・恒星月・近点月 [日]・接触離心率の時間平均 eOsc・近点と次の遠点の (r遠−r近)/(r遠+r近) の平均 ePA・接触の長半径の平均 aOsc。
 */
export function emMethods(ev, N, U) {
  if (ev.rev.length < N) return { N, complete: false };
  const tB = ev.rev[N - 1];
  const P = ev.peri.filter((z) => z.t <= tB), A = ev.apo.filter((z) => z.t <= tB), E = ev.ecc.filter((z) => z[0] <= tB);
  const m1 = linfit(P.map((z) => z.t), unwrap(P.map((z) => z.ang))), m2 = linfit(E.map((z) => z[0]), unwrap(E.map((z) => z[1])));
  const pa = linfit(P.map((_, i) => i), P.map((z) => z.t)), ps = linfit(ev.rev.slice(0, N).map((_, i) => i), ev.rev.slice(0, N));
  let ePA = 0, nPA = 0; for (const p of P) { const a = A.find((z) => z.t > p.t); if (a) { ePA += (a.r - p.r) / (a.r + p.r); nPA++; } }
  const T = (sl) => (sl && sl.slope) ? 2 * Math.PI / sl.slope / U.year : null;
  return { N, complete: true, nPeri: P.length,
    T1: T(m1), rms1: m1 ? m1.rms * 180 / Math.PI : null, T2: T(m2), rms2: m2 ? m2.rms * 180 / Math.PI : null,
    T3: (pa && ps) ? 1 / (1 / ps.slope - 1 / pa.slope) / U.year : null,
    sid: ps ? ps.slope / U.day : null, anom: pa ? pa.slope / U.day : null,
    eOsc: E.length ? E.reduce((s, z) => s + z[2], 0) / E.length : null, ePA: nPA ? ePA / nPA : null, aOsc: E.length ? E.reduce((s, z) => s + z[3], 0) / E.length : null };
}

/* ── 表示用の行(PHYSICS〔第297便b〕—— QA docs.fit297 が正本から作り直して照合する)── */
/** 抽出器の表: 行 = 条件 × 刻み、列 = 窓ごとの T1/T2/T3。 */
export function extractorRows(J) {
  return J.ems.extractor.rows.map((r) => `| ${r.label} | ${r.dtLabel} | ${r.windows.map((w) => `${fx(w.T1, 3)} / ${fx(w.T2, 3)} / ${fx(w.T3, 3)}`).join(' | ')} |`);
}
/** 初期配置の点検の表(親と直した写し)。 */
export function icRows(J) {
  return J.ems.icAudit.rows.map((r) => `| ${r.label} | ${fx(r.rp, 6)} | ${fx(r.eOsc0, 6)} | ${fx(r.phiDeg, 1)} | ${fx(r.eMean, 5)} | ${fx(r.sid, 5)} | ${fx(r.T1, 4)} | ${fx(r.T2, 4)} | ${fx(r.T3, 4)} |`);
}
/** 3 次元の参照積分器(器の中だけ)の表。 */
export function ref3dRows(J) {
  return J.ems.ref3d.rows.map((r) => `| ${r.label} | ${fx(r.incDeg, 3)} | ${fx(r.T2, 4)} | ${fx(r.sid, 4)} | ${fx(r.eMean, 5)} |`);
}
/** 🌤️ の gain の探索(直した初期配置)。 */
export function emsGainRows(J) {
  return J.ems.search.rows.map((r, i) => `| ${ex(r.g, 6)} | ${fx(r.y, 4)} | ${fx(J.ems.search.rowsH2[i].y, 4)} |`);
}
/** 🌥️ の obsCard(ja/en)に入っているべき数の文字列(QA docs.fit297 が照合する)。 */
export function emsObsNumbers(J) {
  const E = J.ems, f = E.fix, s = E.search, r3 = E.ref3d;
  return [fx(f.rp, 6), fx(f.e0, 6), fx(f.w118.eOsc, 4), fx(f.w118.sid, 4), fx(f.w118.T1, 4), fx(s.rows[0].y, 4), fx(E.parentW118.eOsc, 4), fx(r3.incl.T2, 3), fx(r3.flat.T2, 3)];
}
