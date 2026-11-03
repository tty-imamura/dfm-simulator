// 第325便f(原仮定者の指示(2026-11-03)「「物理対応ロック Xₖ = G₀/c₀²」を常に有効にした場合の影響を調べる。サンプルの用途を調べ、
//   「Xₖ = G₀/c₀²」「Xₖ を維持してG₀を合わせる」「Xₖ を維持してc₀を合わせる」に分類する」・統括の検証項目 R289):
//   物理対応ロックを常に有効にした場合の影響の調べ(**作業物 —— 再生成の鎖の段ではない**・html・本の宣言・器の本文・正本は 1 byte も変えない)。
//
//   ① 棚卸し(内蔵の全部の本): 受理の後(既定値のマージの後)の G_0・c_0・X_k(鍵 G・cLight・kappaT)・html の判定関数 physLockAutoOnOf の結果
//      (満たすか・理由 within/zeroExact/mismatch/gZeroXNonZero・導出値・相対の差)・build の後の値が宣言と同じか・読み込みの後のロックのフラグ・
//      用途の材料(群・分類・段・claims・obsCard・観測の写しの宣言・目的と較正の 4 値 —— tests/out/samplestatus-w279a.json から)。
//   ② 影響の測り(在位の本で満たさない本だけ —— 退役は棚卸しだけ): 3 つの写像を **headless の写しの中だけで**本の宣言に当てる
//        (i)   X_k := G_0/c_0²(今のロックの導出値 —— physLockCalc と同じ値域のクランプ)
//        (ii)  X_k を維持して G_0 := X_k c_0²
//        (iii) X_k を維持して c_0 := √(G_0/X_k)(G_0 = 0 か X_k = 0 の本は定義できない —— 「未定義」と書く)
//      写しごとに 受理(validatePreset)・読み込み(loadPreset —— 読み込みの時のロックの自動 ON の判定)・短い窓(既定 600 步・本ごとの既定の刻み appStepDt)を走らせ、
//      今の宣言の走行と比べる(状態の指紋・位置と速度の最大の差・時計の遅れ 1 − τ/t・並進の運動エネルギー・角運動量の保存・光線の向き・NaN・クランプの数)。
//   ③ 3 分類(在位の本ごと —— 用途から): 下の CLASS_325F(理由の 1 文・決まらない本は undecided)。データの書き出しで ①② と合わせる。
//
//   使い方(作業の場所は worktree の根):
//     node tests/exp-w325f-xklock.mjs --measure --shard 0/2 --out <scratch>/part0.json   (子プロセスは 1 枝 2 本まで —— nice -n 19)
//     node tests/exp-w325f-xklock.mjs --merge <part0.json> <part1.json> [--write]          (tests/data-w325f-xklock.json を書く —— --write なしは差の要約だけ)
//     node tests/exp-w325f-xklock.mjs --classify [--write]                                  (測りは既存のデータから引き継ぎ、棚卸しと分類だけ作り直す)
//   既定の html は beta/index.html(--html で変える)。
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';

export const XKLOCK_VERSION_325F = 'w325f-xklock-1';
export const XKLOCK_DATA_325F = 'tests/data-w325f-xklock.json';
export const XKLOCK_CLASSES_325F = ['X_k = G_0/c_0²', 'X_k を維持して G_0 を合わせる', 'X_k を維持して c_0 を合わせる'];
export const XKLOCK_STEPS_325F = 600;
const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

// ---- 写像(merged physics の G・cLight・kappaT から)----
export const CLAMP_325F = { G: [0, 1e6], cLight: [1, 1e6], kappaT: [0, 1] };
const clampV = (v, a) => Math.min(a[1], Math.max(a[0], v));
/**
 * 3 つの写像の 1 つを、受理の後の物理の値に当てる(写しの宣言に書く値を返す)。
 * @returns {{defined:boolean, why?:string, set?:object, raw?:object, clamped?:string[]}}
 */
export function mapPhysics325f(ph, mode) {
  const G = ph.G, c = ph.cLight, X = ph.kappaT;
  if (mode === 'i') {
    const tgt = G > 0 ? G / (c * c) : 0, v = clampV(tgt, CLAMP_325F.kappaT);
    return { defined: true, set: { kappaT: v }, raw: { kappaT: tgt }, clamped: v !== tgt ? ['kappaT'] : [] };
  }
  if (mode === 'ii') {
    const tgt = X * c * c, v = clampV(tgt, CLAMP_325F.G);
    return { defined: true, set: { G: v }, raw: { G: tgt }, clamped: v !== tgt ? ['G'] : [] };
  }
  if (mode === 'iii') {
    if (!(G > 0)) return { defined: false, why: 'G_0 = 0 —— X_k > 0 を c_0 だけでは保てない(c_0 → ∞ でも X_k = 0 にならず、G_0/c_0² = 0)' };
    if (!(X > 0)) return { defined: false, why: 'X_k = 0 —— c_0 → ∞ が要る(値域の上限 10⁶ で止まる)' };
    const tgt = Math.sqrt(G / X), v = clampV(tgt, CLAMP_325F.cLight);
    return { defined: true, set: { cLight: v }, raw: { cLight: tgt }, clamped: v !== tgt ? ['cLight'] : [] };
  }
  throw new Error('写像の名が違う: ' + mode);
}

// ---- 3 分類(在位の本ごと —— 用途から。理由の 1 文。basis: satisfied = 既に満たす / derive = X_k を導出値へ寄せても用途が保たれる)----
//   undecided: true の本は原仮定者に上げる(class は用途から見た仮の置き場 —— alt に別の候補)
//   数の出どころ: 下の --measure の 600 步(本ごとの既定の刻み)と、B の本・殻の放出の本・箱の本の 6000 步の追試(第325便f の作業 —— データの impact は 600 步)
const A = XKLOCK_CLASSES_325F[0], B = XKLOCK_CLASSES_325F[1], C = XKLOCK_CLASSES_325F[2];
const dA = (reason) => ({ cls: A, basis: 'derive', reason }), kB = (reason) => ({ cls: B, basis: 'keepX', reason }), kC = (reason) => ({ cls: C, basis: 'keepX', reason });
const und = (cls, alt, reason) => ({ cls, alt, basis: cls === A ? 'derive' : 'keepX', undecided: true, reason });
const THERMAL = '温度・熱・相の用途で重力は使わない(G_0 = 0)—— X_k は時計にしか効かず (i) X_k := 0 で力学は 1 bit も変わらない・(ii) は G_0 := X_k c_0² = 15 の自己重力を入れて用途を壊す・(iii) は定義できない';
const SHAPE = '宣言の形の参照模型(G_0 = 0)—— X_k は時計にしか効かず (i) で状態は 1 bit も変わらない・(ii) は G_0 = 15 を入れる(規定運動の本は不変だが Core 力学の本は中心重力が二重になる)・(iii) は定義できない';
const GALAXY = '回転の増強・棒・腕(G_0 と引きずり)が用途 —— X_k は時計と光にしか効かず (i) で力学は 1 bit も変わらない・(ii) は G_0 を 0.8 → 18 にして軌道を変える(速度のクランプも出る本がある)・(iii) は c_0 を 30 → 6.3 にして c_0 の規約を外れる';
export const CLASS_325F = {
  // ---- X_k = G_0/c_0²(X_k を導出値へ —— 用途が保たれる)
  projectile: dA('一様重力 gravityY の自由落下と放物運動が用途(G_0 = 0)—— X_k は時計にしか効かず (i) X_k := 0 で力学は 1 bit も変わらない・(ii) は粒子どうしの重力 G_0 = 15 を入れて軌道を変える'),
  echo: dA('保存系の巻き戻り(G_0 の力学と散逸)が用途 —— (i) X_k := 1/450 で力学は 1 bit も変わらない・(ii) は G_0 を 2 → 15 にして軌道を変える・(iii) は c_0 の規約を外れる'),
  boxtrans: dA('比べる時計の遅れは運動の項(|v − u|/c_0 —— u は決定力 W が決める)で、X_k は壁の重力の項だけ(遅れの約 7%)—— (i) X_k := 0 で力学は不変・(ii) G_0 = 0.09 は自由な壁の輪に自己重力を入れる(6000 步で位置の差 1%)'),
  boxrot: dA('回る壁の支え(k_F)が用途(G_0 = 0)—— (i) で力学は不変・(ii) は壁と粒子に自己重力を入れる'),
  boxexpand: dA('膨張させた壁への内側の追随の率が用途(G_0 = 0)—— (i) で力学は不変・(ii) は自己重力を入れる'),
  boxbound: dA('膨張の中の連星の束縛(G_0 の力学)が用途 —— (i) X_k 1e-4 → 1/900 で力学は不変(時計と光の量だけ動く)・(ii) は G_0 を 1 → 0.09 に下げて束縛を弱める'),
  boxbreath: dA('目的の量は 1 周期の後の変位(G_0 = 0)—— (i) X_k := 0 で変位は 1 bit も変わらない(説明の「時計が速く・遅く」は消える)・(ii) G_0 = 3 は 6000 步で位置の差 0.18 の自己重力を入れる'),
  freebox: dA('自由な壁の膨張の原因(自己重力 G_0 と圧力)が用途 —— (i) で力学は不変・(ii) は G_0 を 1 → 0.09 に下げて膨張の釣り合いを変える'),
  cosmicweb: dA('膨張と自己重力 G_0 の綱引きで疎密を作るのが用途 —— (i) で力学は不変・(ii) は G_0 を 10 → 3 に下げて構造の育ちを変える'),
  galaxy: dA(GALAXY + '(光線の捕捉は副の見せ場で (i) で弱まる)'),
  galaxyStd: dA(GALAXY), galaxyGeo2: dA(GALAXY), galaxyGeo2Flat3d: dA(GALAXY), galaxyGeo2Thick3d: dA(GALAXY), galaxyGeo2ThickTilt3d: dA(GALAXY),
  galaxyDB: dA(GALAXY), galaxyMeshSpiral: dA(GALAXY), axisBarStill: dA(GALAXY), axisBarArms: dA(GALAXY), axisBarReach: dA(GALAXY),
  collapse: dA('自己重力の崩壊と放射冷却(G_0)が用途 —— (i) で力学は不変・(ii) は G_0 を 2.2 → 12.9 にして崩壊を変える'),
  shapeToyCluster: dA(SHAPE), shapeToyDisk: dA(SHAPE), shapeToyArm: dA(SHAPE), shapeToySpiral: dA(SHAPE),
  shapeToyClusterCore: dA(SHAPE), shapeToyDiskCore: dA(SHAPE), shapeToyArmCore: dA(SHAPE), shapeToySpiralCore: dA(SHAPE),
  reddening: dA('赤化は体積吸収 kAbs が作る(観測層)—— X_k は時計と光線の色の重力の上乗せだけで (i) で力学と光線の向きは不変・(ii) は G_0 を 0.05 → 2.25 にして雲を動かす'),
  grcal: dA('主張は SI の式の出力(X_k = G/c² の 1 本)で画面はアナログ —— 兄弟の 🕰️🌟⏲️ と同じ X_k = G_0/c_0² = 1/3600 へ寄せれば筋が通る(画面の τ/t の数は変わる —— 説明の数の書き直しが要る)・(ii) は衛星の円軌道の速度と合わなくなる'),
  gas: dA(THERMAL), pressure: dA(THERMAL), conduction: dA(THERMAL), frictionHeat: dA(THERMAL),
  coolrace: dA('放射冷却だけの統制実験で力は全部切ってある(G_0 = 0)—— X_k は時計にしか効かず (i) X_k := 0 で状態は不変・(ii) G_0 := 0.09 は静止の 3 粒子に重力を入れる(600 步で位置の差 2.5×10⁻⁵)・(iii) は定義できない'),
  convection: dA(THERMAL), buoyancy: dA(THERMAL), cooling: dA(THERMAL), emergent: dA(THERMAL), emergent2: dA(THERMAL), chain2: dA(THERMAL), chaincycle: dA(THERMAL),
  mercury: dA('近日点の前進は測地線 1PN(E12)が作り、その係数は G_0/c_0²(pnKappaGR)—— X_k は軌道に入らず (i) で軌道は 1 bit も変わらない(説明の「ψ = W·X_k が軌道の形も決める」がロックで字義どおりになる)・(ii)(iii) は誇張の 1PN を変える'),
  binary: dA('連星の間隔の保持は測地線 1PN(係数 G_0/c_0²)が作る —— X_k は軌道に入らず (i) で力学は 1 bit も変わらない・(ii) は G_0 を 1 → 0.09 に下げる'),
  inertialDragPair: dA('並進の引きずりの近点移動(G_0 と W_bg)が用途 —— (i) で力学は不変・(ii) は G_0 を 1 → 0.09 に下げる'),
  coord3dKeplerTilt: dA('三次元の傾いた楕円の周期と軌道面(G_0)が用途 —— (i) で力学は不変・(ii) は G_0 を 1 → 0.09 に下げる'),
  coord3dSpinPrecess: dA('宣言の歳差の表示(G_0 の公転の上)が用途 —— (i) で力学は不変・(ii) は G_0 を下げる'),
  fig8: dA('等質量三体の 8 の字(G_0 の初期値の感度)が用途 —— (i) で力学は不変・(ii) は周期軌道を壊す'),
  counterring: dA('逆向きの環の摩擦の加熱(G_0 の公転)が用途 —— (i) で力学は不変・(ii) は公転を変える'),
  spinup: dA('閉じた系の収縮とスピンの増幅(G_0)が用途 —— (i) で力学は不変・(ii) は G_0 を 4 → 15 にする'),
  supernovaCore: dA('殻の放出と残骸の時計(位相の時計 ω·t —— ψ の時計ではない)が用途 —— (i) で力学は不変・(ii) は G_0 を 4 → 15 にして放出の束縛を変える(6000 步で位置の差 0.8)'),
  whiteDwarfDFM: dA('殻の反復の剥がれ(G_0 の束縛)が用途 —— (i) で力学は不変・(ii) は 6000 步で位置の差 5×10⁻²'),
  whiteDwarfBareDFM: dA('裸のコアの終端(G_0 の束縛)が用途 —— (i) で力学は不変・(ii) は 6000 步で位置の差 9×10⁻²'),
  envelopeShedDFM: dA('限界回転のコアの殻の放出(G_0 の束縛)が用途 —— (i) で力学は不変・(ii) は 6000 步で位置の差 7×10⁻²'),
  lfbotTrap: dA('減光で溜めた光の放出が用途 —— 減光は飽和側で (i) X_k 1/60 → 1/225 でも 6000 步で減光の差 10⁻³・熱の差 2×10⁻⁵(力学は不変)・(ii) は G_0 を 4 → 15 にして崩壊を変える'),
  layeredCoreDFM: dA('二層天体の重力(E4 だけ —— G_0)が用途 —— (i) で力学は不変・(ii) は G_0 を 1 → 15 にする'),
  spinDipoleBinary: dA('スピン双極子の力(係数 λ G_0/c_0²)の近点の逆行が用途で X_k = 0 —— (i) X_k := 1/900 は時計と光を足すだけで力学は不変・(ii) は G_0 := 0 で重力と双極子の力を消す・(iii) は定義できない'),
  // ---- X_k を維持して G_0 を合わせる(時計・光が用途で、G_0 は力学に効かない —— 固定や規定運動の源)
  gclock: kB('時計の重力の遅れ(X_k が主役のノブ)が用途で物体は固定 —— (ii) G_0 := X_k c_0² = 3 で状態は 6000 步まで 1 bit も変わらない・(i) は X_k := 0 で遅れが消える'),
  lensing: kB('光線の屈折と捕捉(X_k)が用途で源は固定 —— (ii) G_0 := 6 で状態と光線は 6000 步まで 1 bit も変わらない・(i) は偏向を 1/24 にする'),
  blens: kB('連星レンズの光線束(X_k が主役のノブ)が用途で源は固定 —— (ii) G_0 := 8.2 で 6000 步まで 1 bit も変わらない・(i) は X_k := 0 で曲がらない'),
  spinlens: kB('回る星の非対称な湾曲(X_k と引きずり)が用途で星は 1 体 —— (ii) G_0 := 4.5 で 6000 步まで 1 bit も変わらない・(i) は偏向を 1/8 にする・(iii) は光の随伴を変える'),
  mmPhaseToy: kB('往復の光の位相差(光を運ぶ u —— 重い源の判定に X_k が入る)が用途で装置はレール —— (ii) G_0 := 18 で 6000 步まで 1 bit も変わらない・(i) は X_k := 0 で u が消える(対照の値になる)'),
  probeH: kB('2 つの H 推定器の比 H_w/H_geo = 2(D·X_k)/a が用途(X_k は較正の量)—— (ii) G_0 := 3 で 6000 步の位置の差 1.1×10⁻³・(i) は X_k := 0 で比が消える'),
  boxredshift: kB('共動する 3 点の間の光の状態(波長)が用途 —— (ii) G_0 := 0.09 で 6000 步の位置の差 6.5×10⁻⁶・(i) は光子の状態を変える'),
  // ---- X_k を維持して c_0 を合わせる
  massLadder: kC('力学質量(G_0)と減光で光度質量が 0 になること(X_k の井戸)の両方が用途 —— (iii) c_0 := 6.3 で力学は 1 bit も変わらず減光も同じ(飽和側)・(i) は減光を 0.66 動かす・(ii) は軌道を変える —— c_0 = 30 の規約の例外が要る'),
  // ---- 未決(原仮定者に上げる —— cls は用途から見た仮の置き場・alt は別の候補)
  boxcomoving: und(A, B, '用途が「完全共動」(G_0 = 0)と「膨張の時計」(X_k)の両方 —— (i) は力学を保つが時計の効果を消す・(ii) G_0 = 3 は時計を保つが 6000 步で位置の差 0.17 の自己重力を入れる・(iii) は定義できない'),
  selfRotor: und(A, C, '用途が雲の成長(G_0)と中心の暗さ(X_k の井戸と c_0 の表面の光速)の両方 —— (i) は成長を保つが暗さを 0.27 動かす・(iii) は成長を保つが暗さを 0.61 動かす(c_0 の規約も外れる)・(ii) は G_0 を 8 → 64 にして成長を変える'),
  rotorSolo: und(B, C, '用途が減光と外来光線の掃き出し(X_k)と、周回のテスト粒子(G_0)の両方 —— (ii) は減光と光線を保つが G_0 を 0.25 → 15 にして周回を壊す・(iii) は周回と減光を保つが光の随伴(c_0)で光線を変える・(i) は X_k を 1/60 → 1/3600 に下げて光線の掃き出しを消す'),
};
/** 既に満たす本の理由(棚卸しから —— 1 文)。 */
export function satisfiedReason325f(r) {
  if (r.lock.reason === 'zeroExact') return 'G_0 = 0・X_k = 0(時空効果なし)で導出値そのもの —— 既に満たす(読み込みで自動 ON・値は 1 bit も変わらない)';
  if (r.realUnits) return '実単位の写し(G・c の標準参照値の段の換算)で X_k = G_0/c_0² —— 既に満たす(読み込みで自動 ON・値は 1 bit も変わらない)';
  return '画面のアナログの宣言が X_k = G_0/c_0² —— 既に満たす(読み込みで自動 ON・値は 1 bit も変わらない)';
}

// ---- 走行(html を Node で読む —— 子プロセスごとに 1 回)----
function fnv(acc, v, buf) { buf.f[0] = v; for (let b = 0; b < 8; b++) { acc ^= buf.u[b]; acc = Math.imul(acc, 0x01000193) >>> 0; } return acc; }
function snapOf(S) {
  const ab = new ArrayBuffer(8), buf = { f: new Float64Array(ab), u: new Uint8Array(ab) };
  let h = 0x811c9dc5, hd = 0x811c9dc5;
  const n = S.n, arr = {};
  // 力学の指紋 hd(位置・速度・自転・半径・質量・内部の温度)と全体の指紋 h(+ 時計 τ・光子)
  for (const k of ['x', 'y', 'z', 'vx', 'vy', 'vz', 'spin', 'R', 'm', 'Tint', 'tau']) {
    const A0 = S[k]; if (!A0 || typeof A0.length !== 'number') continue;
    arr[k] = Array.from(A0.subarray ? A0.subarray(0, n) : A0.slice(0, n));
    for (let i = 0; i < n; i++) { h = fnv(h, A0[i], buf); if (k !== 'tau') hd = fnv(hd, A0[i], buf); }
  }
  h = fnv(h, S.t, buf); hd = fnv(hd, S.t, buf);
  const ph = [];
  for (const o of (S.photons || [])) { const v = []; for (const k of Object.keys(o)) if (typeof o[k] === 'number') { v.push(o[k]); h = fnv(h, o[k], buf); } ph.push(v); }
  const E = S.energies(), T = S.totals();
  // 観測層の量: 減光 lSw(自光の掻き出し —— 力学の指紋に入れない)・光の決定フレーム(dfmFrameAt —— 最初の 8 体の位置で光を運ぶ u)
  const lSw = S.lSw ? Array.from(S.lSw.subarray ? S.lSw.subarray(0, n) : S.lSw.slice(0, n)) : null;
  const frame = [];
  if (typeof globalThis.dfmFrameAt === 'function') for (let i = 0; i < Math.min(8, n); i++) { const f = globalThis.dfmFrameAt(S.x[i], S.y[i], S); frame.push(f ? [f.ux, f.uy] : null); }
  return { lSw, frame, hash: h.toString(16).padStart(8, '0'), dynHash: hd.toString(16).padStart(8, '0'), n, t: S.t, arr, photons: ph, kin: E.kin, rot: E.rot, heat: E.heat, L: T.L, nan: !!S.hasNaN(), clampVN: S.clampVN || 0, clampSN: S.clampSN || 0 };
}
function raysOf(S, p) {
  if (!p.rays || !(p.rays.n > 0) || typeof globalThis.traceRay !== 'function') return null;
  const cam = p.camera || {}, sc = cam.scale || 300, cx = cam.x || 0, cy = cam.y || 0, dl = sc / 110, out = [];
  for (let r = 0; r < p.rays.n; r++) {
    const px = cx - 2.2 * sc, py = cy + ((r + 0.5) / p.rays.n - 0.5) * 2 * p.rays.spread * sc;
    const e = globalThis.traceRay(S, px, py, 1, 0, dl, 2400, (nx, ny) => !(nx > cx + 2.2 * sc || Math.abs(ny - cy) > 2.2 * sc));
    out.push(Math.atan2(e.cy, e.cx));
  }
  return out;
}
function lockStateOf(S) {
  const on = !!globalThis.HP.physLock();
  if (!on) return 'off';
  const pc = globalThis.physLockCalc(S);
  return pc.clamped ? 'clamped' : (S.params.kappaT === pc.applied ? 'derived' : 'held');
}
function runOne(HP, p, physicsOverride, steps) {
  const orig = p.physics;
  const t0 = Date.now();
  const res = {};
  try {
    if (physicsOverride) { const ph = Object.assign({}, orig, physicsOverride); if ('kappaT' in physicsOverride) delete ph.Kt; p.physics = ph; }
    const v = HP.validatePreset(JSON.parse(JSON.stringify(p)));
    res.accept = !!(v && v.ok);
    res.warnings = ((v && v.warnings) || []).map(String).filter((w) => /G|cLight|kappaT|c₀|G₀|X_k|κ/.test(w)).slice(0, 4);
    if (!res.accept) { res.errors = ((v && v.errors) || []).map(String).slice(0, 3); return res; }
    HP.loadPreset(p.id, false);
    const S = HP.sim;
    res.params = { G: S.params.G, c: S.params.cLight, X: S.params.kappaT, q: S.params.q };
    res.lock = lockStateOf(S);
    res.auto = globalThis.physLockAutoOnOf(S).reason;
    res.rays = raysOf(S, p);
    const L0 = S.totals().L, dt = globalThis.appStepDt(S);
    res.dt = dt;
    for (let k = 0; k < steps; k++) { S.step(dt); if (k % 50 === 49 && S.hasNaN()) break; }
    res.snap = snapOf(S);
    res.L0 = L0;
  } catch (e) { res.error = String(e && e.message || e).slice(0, 200); }
  finally { p.physics = orig; res.ms = Date.now() - t0; }
  return res;
}
const rms = (a) => { if (!a || !a.length) return 0; let s = 0; for (const v of a) s += v * v; return Math.sqrt(s / a.length); };
/** 今の宣言の走行(base)と写しの走行の比べ(数の要約)。 */
export function compareRuns325f(base, run, softening) {
  if (!run || run.error || !run.accept || !run.snap || !base || !base.snap) return null;
  const b = base.snap, r = run.snap, o = { bitSame: b.hash === r.hash, dynSame: b.dynHash === r.dynHash, nSame: b.n === r.n, nan: r.nan, clampVN: r.clampVN, clampSN: r.clampSN };
  if (o.nSame) {
    const n = b.n, has = (k) => b.arr[k] && r.arr[k];
    // 位置: 重心のまわりの RMS の広がりで割る
    let mx = 0, my = 0, mz = 0, M = 0;
    for (let i = 0; i < n; i++) { const m = Math.abs(b.arr.m[i]) || 0; M += m; mx += m * b.arr.x[i]; my += m * b.arr.y[i]; mz += m * (has('z') ? b.arr.z[i] : 0); }
    if (M > 0) { mx /= M; my /= M; mz /= M; }
    let s2 = 0, dP = 0, v2 = 0, dV = 0;
    for (let i = 0; i < n; i++) {
      const dz = has('z') ? (r.arr.z[i] - b.arr.z[i]) : 0, zz = has('z') ? (b.arr.z[i] - mz) : 0;
      s2 += (b.arr.x[i] - mx) ** 2 + (b.arr.y[i] - my) ** 2 + zz * zz;
      dP = Math.max(dP, Math.hypot(r.arr.x[i] - b.arr.x[i], r.arr.y[i] - b.arr.y[i], dz));
      const dvz = has('vz') ? (r.arr.vz[i] - b.arr.vz[i]) : 0, vz = has('vz') ? b.arr.vz[i] : 0;
      v2 += b.arr.vx[i] ** 2 + b.arr.vy[i] ** 2 + vz * vz;
      dV = Math.max(dV, Math.hypot(r.arr.vx[i] - b.arr.vx[i], r.arr.vy[i] - b.arr.vy[i], dvz));
    }
    const Lref = Math.max(Math.sqrt(s2 / Math.max(1, n)), softening || 0, 1e-12), Vref = Math.sqrt(v2 / Math.max(1, n));
    o.dPos = dP / Lref; o.dVel = Vref > 1e-12 ? dV / Vref : dV; o.dVelAbs = !(Vref > 1e-12);
    if (has('tau') && b.t > 0) {
      let dmax = 0, dd = 0;
      for (let i = 0; i < n; i++) { const db = 1 - b.arr.tau[i] / b.t, dr = 1 - r.arr.tau[i] / r.t; dmax = Math.max(dmax, Math.abs(db)); dd = Math.max(dd, Math.abs(dr - db)); }
      o.dilBaseMax = dmax; o.dilDelta = dd; o.dilRel = dmax > 1e-15 ? dd / dmax : (dd > 0 ? Infinity : 0);
    }
  }
  o.dKin = Math.abs(b.kin) > 1e-300 ? Math.abs(r.kin - b.kin) / Math.abs(b.kin) : Math.abs(r.kin - b.kin);
  o.Ldrift = Math.abs(run.L0) > 1e-300 ? Math.abs(r.L - run.L0) / Math.abs(run.L0) : Math.abs(r.L - run.L0);
  o.LdriftBase = Math.abs(base.L0) > 1e-300 ? Math.abs(b.L - base.L0) / Math.abs(base.L0) : Math.abs(b.L - base.L0);
  if (base.rays && run.rays && base.rays.length === run.rays.length) {
    let bm = 0, dm = 0; for (let k = 0; k < base.rays.length; k++) { bm = Math.max(bm, Math.abs(base.rays[k])); dm = Math.max(dm, Math.abs(run.rays[k] - base.rays[k])); }
    o.rayBaseMax = bm; o.rayDelta = dm; o.rayRel = bm > 1e-15 ? dm / bm : (dm > 0 ? Infinity : 0);
  }
  if (b.photons.length || r.photons.length) o.photonsSame = JSON.stringify(b.photons) === JSON.stringify(r.photons);
  if (b.heat !== null && r.heat !== null) o.dHeat = Math.abs(b.heat) > 1e-300 ? Math.abs(r.heat - b.heat) / Math.abs(b.heat) : Math.abs(r.heat - b.heat);
  if (o.nSame && b.lSw && r.lSw) { let bm = 0, dm = 0; for (let i = 0; i < b.lSw.length; i++) { bm = Math.max(bm, Math.abs(b.lSw[i])); dm = Math.max(dm, Math.abs(r.lSw[i] - b.lSw[i])); } o.dimBaseMax = bm; o.dimDelta = dm; }
  if (o.nSame && b.frame.length && b.frame.length === r.frame.length) {
    let um = 0, du = 0;
    for (let i = 0; i < b.frame.length; i++) { const x = b.frame[i], y = r.frame[i]; if (!x || !y) continue;
      um = Math.max(um, Math.hypot(x[0], x[1])); du = Math.max(du, Math.hypot(y[0] - x[0], y[1] - x[1])); }
    o.frameUBaseMax = um; o.frameUDelta = du; o.frameURel = um > 1e-15 ? du / um : (du > 0 ? Infinity : 0);
  }
  return o;
}

const parseArgs = (argv) => { const o = { _: [] }; for (let i = 0; i < argv.length; i++) { const a = argv[i]; if (a.startsWith('--')) { const k = a.slice(2); if (['shard', 'out', 'html', 'steps', 'ids'].includes(k)) o[k] = argv[++i]; else o[k] = true; } else o._.push(a); } return o; };

async function loadHp(htmlRel) {
  const { loadHtmlMain } = await import('./lib-w280b-emgrid.mjs');
  return loadHtmlMain(path.join(ROOT, htmlRel)).HP;
}
const builtinsOf = (HP) => HP.allPresets().filter((p) => !String(p.id).startsWith('custom_'));
const sha256 = (f) => crypto.createHash('sha256').update(fs.readFileSync(path.join(ROOT, f))).digest('hex');

/** ① 棚卸し(html を読んだプロセスの中で)。 */
export function inventory325f(HP, ssRows) {
  const ssBy = new Map((ssRows || []).map((r) => [r.id, r]));
  const rows = [];
  for (const p of builtinsOf(HP)) {
    const v = HP.validatePreset(JSON.parse(JSON.stringify(p)));
    const ph = v && v.ok ? v.preset.physics : {};
    const r = globalThis.physLockAutoOnOf({ params: ph });
    HP.loadPreset(p.id, false);
    const sp = HP.sim.params;
    const st = (ssBy.get(p.id) || {}).status || {};
    const audit = p.parameterAudit ? JSON.stringify(p.parameterAudit.observedInputs || []) : '';
    rows.push({
      id: p.id, emoji: p.emoji || '', group: p.group || null, retired: !!globalThis.retiredOf(p), sampleClass: p.sampleClass || null, scaleTier: p.scaleTier || null,
      realUnits: !!p.scaleExp, G: ph.G, c: ph.cLight, X: ph.kappaT, declared: { G: 'G' in (p.physics || {}), c: 'cLight' in (p.physics || {}), X: ('kappaT' in (p.physics || {})) || ('Kt' in (p.physics || {})) },
      lock: { ok: !!r.ok, reason: r.reason, tgt: r.tgt, rel: r.rel, bitSame: r.bitSame === undefined ? null : r.bitSame },
      builtSame: sp.G === ph.G && sp.cLight === ph.cLight && sp.kappaT === ph.kappaT, lockAfterLoad: !!HP.physLock(),
      uses: { activeParams: (p.activeParams || []).filter((k) => ['G', 'cLight', 'kappaT'].includes(k)), rays: !!p.rays, photonEmit: !!p.photonEmit, qLock: !!p.qLock,
        geoPN: ph.geoPN, claims: (p.claims || []).length, obsCard: Array.isArray(p.obsCard) ? p.obsCard.length : 0, observedGc: /G・c|CODATA/.test(audit) },
      objective: st.objective || null, calibration: st.calibration || null, calibrationPopulation: ['pass', 'pass-limited', 'fail', 'hold'].includes(st.calibration),
    });
  }
  return rows;
}

async function measure(o) {
  const HP = await loadHp(o.html);
  const CV = await import('../tools/conventions-check.mjs');
  const ss = JSON.parse(fs.readFileSync(path.join(ROOT, 'tests/out/samplestatus-w279a.json'), 'utf8')).rows;
  const inv = inventory325f(HP, ss);
  let ids = inv.filter((r) => !r.retired && !r.lock.ok).map((r) => r.id);
  if (o.ids) ids = o.ids.split(',');
  if (o.shard) { const [k, n] = o.shard.split('/').map(Number); ids = ids.filter((_, i) => i % n === k); }
  const steps = Number(o.steps || XKLOCK_STEPS_325F);
  const byId = new Map(builtinsOf(HP).map((p) => [p.id, p]));
  const invBy = new Map(inv.map((r) => [r.id, r]));
  const out = {};
  for (const id of ids) {
    const p = byId.get(id), iv = invBy.get(id), ph = { G: iv.G, cLight: iv.c, kappaT: iv.X };
    const t0 = Date.now();
    const base = runOne(HP, p, null, steps), base2 = runOne(HP, p, null, steps);
    const row = { base: { accept: base.accept, lock: base.lock, dt: base.dt, hash: base.snap && base.snap.hash, nan: base.snap && base.snap.nan, kin: base.snap && base.snap.kin, LdriftBase: null, ms: base.ms, rays: base.rays ? base.rays.length : 0 },
      determinism: !!(base.snap && base2.snap && base.snap.hash === base2.snap.hash), maps: {} };
    const soft = (p.physics || {}).softening || 0;
    for (const m of ['i', 'ii', 'iii']) {
      const mp = mapPhysics325f(ph, m);
      if (!mp.defined) { row.maps[m] = { defined: false, why: mp.why }; continue; }
      const run = runOne(HP, p, mp.set, steps);
      // c₀ の規約(light.canonical-builtins —— tools/conventions-check.mjs の cRuleBad: c₀ = 30 か段の実 c)を写しの宣言で判定
      const c0Canonical = !CV.cRuleBad(Object.assign({}, p, { physics: Object.assign({}, p.physics, mp.set) }), HP);
      row.maps[m] = { defined: true, set: mp.set, raw: mp.raw, clampedByMap: mp.clamped, c0Canonical, accept: run.accept, warnings: run.warnings, errors: run.errors || null, error: run.error || null,
        params: run.params || null, lock: run.lock || null, auto: run.auto || null, cmp: compareRuns325f(base, run, soft), ms: run.ms };
    }
    row.ms = Date.now() - t0;
    out[id] = row;
    process.stderr.write(`${id} ${row.ms}ms\n`);
  }
  const res = { version: XKLOCK_VERSION_325F, html: o.html, htmlSha256: sha256(o.html), steps, shard: o.shard || null, ids, rows: out, at: new Date().toISOString() };
  fs.writeFileSync(o.out, JSON.stringify(res));
  console.log(JSON.stringify({ wrote: o.out, n: ids.length }));
}

/** ③ の分類と ①② を合わせてデータを作る。 */
export function buildData325f(inv, impacts, meta, longImpacts) {
  const books = [];
  const tally = { builtin: inv.length, retired: 0, live: 0, bySat: {}, byClass: {}, undecided: [], changedIfAlwaysOn: [] };
  for (const r of inv) {
    const key = (r.retired ? 'retired' : 'live') + ':' + (r.lock.ok ? 'ok' : 'ng') + ':' + r.lock.reason;
    tally.bySat[key] = (tally.bySat[key] || 0) + 1;
    tally[r.retired ? 'retired' : 'live']++;
    const row = Object.assign({}, r);
    if (!r.retired) {
      const c = r.lock.ok ? { cls: A, basis: 'satisfied', reason: satisfiedReason325f(r) } : (CLASS_325F[r.id] || null);
      row.class = c ? c.cls : null; row.basis = c ? c.basis : null; row.reason = c ? c.reason : null; row.undecided = !!(c && c.undecided); if (c && c.alt) row.alt = c.alt;
      if (row.class) tally.byClass[row.class] = (tally.byClass[row.class] || 0) + 1;
      if (row.undecided) tally.undecided.push(r.id);
      if (!r.lock.ok) { row.impact = impacts[r.id] || null; if (longImpacts && longImpacts[r.id]) row.impactLong = longImpacts[r.id]; tally.changedIfAlwaysOn.push(r.id); }
    } else { row.class = null; row.reason = '退役 —— 棚卸しだけ(分類しない)'; }
    books.push(row);
  }
  return Object.assign({ version: XKLOCK_VERSION_325F }, meta, { classes: XKLOCK_CLASSES_325F, tally, books });
}

async function merge(o, parts) {
  const HP = await loadHp(o.html);
  const ss = JSON.parse(fs.readFileSync(path.join(ROOT, 'tests/out/samplestatus-w279a.json'), 'utf8')).rows;
  const inv = inventory325f(HP, ss);
  const impacts = {}, longImpacts = {};
  let steps = null, htmlSha = null, longSteps = null;
  if (parts.length) {
    // 窓が XKLOCK_STEPS_325F(600 步)の部分は impact・それより長い窓の追試の部分は impactLong(steps つき)
    for (const f of parts) { const j = JSON.parse(fs.readFileSync(f, 'utf8')); if (j.version !== XKLOCK_VERSION_325F) throw new Error('版が違う: ' + f);
      if (j.steps === XKLOCK_STEPS_325F) { steps = j.steps; htmlSha = j.htmlSha256; Object.assign(impacts, j.rows); }
      else { longSteps = j.steps; for (const [id, r] of Object.entries(j.rows)) longImpacts[id] = Object.assign({ steps: j.steps }, r); } }
  } else {
    const old = JSON.parse(fs.readFileSync(path.join(ROOT, XKLOCK_DATA_325F), 'utf8'));
    steps = old.measure.steps; htmlSha = old.measure.htmlSha256; longSteps = old.measure.longSteps || null;
    for (const b of old.books) { if (b.impact) impacts[b.id] = b.impact; if (b.impactLong) longImpacts[b.id] = b.impactLong; }
  }
  const data = buildData325f(inv, impacts, {
    wave: '第325便f', source: 'tests/exp-w325f-xklock.mjs', html: o.html, htmlSha256: sha256(o.html),
    measure: { steps, longSteps, longIds: Object.keys(longImpacts), htmlSha256: htmlSha, dt: 'appStepDt(本ごとの既定の刻み)', how: 'headless の写しの中で本の宣言の G・cLight・kappaT だけを替え、受理・読み込み・短い窓を走らせて今の宣言の走行と比べる(実物の html は変えない)' },
    rel: 1e-6, lockFn: 'physLockAutoOnOf',
  }, longImpacts);
  const missing = data.books.filter((b) => !b.retired && !b.class).map((b) => b.id);
  const noImpact = data.books.filter((b) => !b.retired && !b.lock.ok && !b.impact).map((b) => b.id);
  console.log(JSON.stringify({ tally: data.tally, missingClass: missing, noImpact }, null, 1));
  if (o.write) { fs.writeFileSync(path.join(ROOT, XKLOCK_DATA_325F), JSON.stringify(data, null, 1) + '\n'); console.log('wrote ' + XKLOCK_DATA_325F); }
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const o = parseArgs(process.argv.slice(2));
  o.html = o.html || 'beta/index.html';
  if (o.measure) await measure(o);
  else if (o.merge) await merge(o, o._);
  else if (o.classify) await merge(o, []);
  else { console.log('使い方: --measure [--shard k/n] --out f | --merge parts… [--write] | --classify [--write]'); process.exit(2); }
}
