// 第84便A 実験 4-87: 熱の実験室の創発4件へ**創発の標準試験**を展開する
//   🧬emergent(三態の創発)・🧊emergent2(蜂の巣格子)・⛓️chain2(鎖)・♻️chaincycle(温度循環)
//
// 主題: 第83便A が 🥚selfRotor で標準試験化した6試験のハーネス設計を、熱の実験室の創発4件へ
//   そのまま適用して E水準を実測で格付けし直す。第83便A(exp-4-85)が担った③〜⑥を本ハーネスも
//   担い、①②は既存 claim / 既存 QA / 既存 exp のカバー状況を棚卸しして**重複測定を作らない**。
//
// 標準試験(6試験・docs/PHYSICS.md「創発水準(E0〜E3)と標準試験」)と本便での担当:
//   ① ノックアウト対照   : 🧊⛓️♻️=既存(QA phasechange.emergent2/chain2 の angK=0 実測)
//                          🧬=本ハーネスが bondK=0 を新規実測(abQuick 宣言はあるが数値が未測定)
//                          → 本ハーネスは①を「代表3seed の対照」として**多seed版に拡張**だけする
//   ② 用量反応           : 🧬=既存(第83便B exp-4-86 の相図 kRep×g_y — 熱圧の用量反応そのもの)
//                          🧊⛓️♻️=壁温の用量反応が descStruct に既載(♻️ の T2=8 では解けない実測)
//                          → 本ハーネスでは再測定しない(結果 JSON に「既存参照」として記録)
//   ③ 多seed(16)        : 本ハーネス — seed 7〜22 の16本
//   ④ 粒子数スケーリング : 本ハーネス — n=56/112/224(**箱密度・局所詰め方・床壁の隙間を保存**)
//   ⑤ 摂動回復           : 本ハーネス — 温度キック(×3/×12)と速度ノイズ(×2)で崩れ幅を実測してから回復を測る
//   ⑥ 時間窓             : 本ハーネス — ③の各 seed に密なマークを置き、代表 seed は 2倍時間まで延長
//
// 秩序変数(新しい物理量は発明しない — 相変化グラフ量と創発モニタ量の流用):
//   c̄ = 幾何配位数の平均 / frac1,frac2,frac3 = 配位1,2,3 の粒子割合
//   ang120, ang180 = 理想角(120°/180°)からの平均偏差[度]  … 第60便 QA と同一定義
//   nComp / maxComp = 結合の連結成分の個数 / 最大成分の粒子数(maxCompFrac=maxComp/n)
//   churn = 組替率(250步ごとの近傍集合の入替割合)  … 第67便 QA claim.chaincycle と同一定義
//   T̄ = 平均 T_int / nCluster, maxFrac, align, vsig = 創発モニタ HP.emergenceStats の4量
//
// 摂動の注入について(実験操作であってアプリの機能ではない — 第83便A と同じ位置づけ):
//   ハーネスが構造形成後に S.Tint(温度キック)または S.vx/S.vy(速度ノイズ)を直接書き換える。
//   速度ノイズは質量重みつき平均を差し引いて全運動量を保存させる(「外から蹴った」ではなく
//   「内部をかき混ぜた」)。温度キックは壁帳簿を意図的に破る操作なので、注入を含む run では
//   帳簿残差 res を判定に使わない。**崩れ幅を先に実測して(崩れない摂動で空虚に通さない)、
//   実際に崩れた秩序変数の復帰だけを回復として数える**(第83便の設計改訂に従う)。
//
// 実行: QA_TARGET=beta/index.html node tests/exp-4-87.mjs(playwright 必須)
//   4プリセット分の計測は独立なので**ブラウザ4本のタスクプールで並列に走らせる**
//   (フォアグラウンドで完了まで待つ — バックグラウンド実行はしない)。
//   W84A_JOBS で並列数を変えられる(既定4)。
// 出力: tests/out/exp-4-87.json(QA ではない — 合否判定はしない計測スクリプト。
//   ただし末尾で E水準の昇格判定を自動で出す)
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const TARGET = process.env.QA_TARGET || 'beta/index.html';
const INDEX = 'file://' + (TARGET.startsWith('/') ? TARGET : path.join(ROOT, TARGET));
const OUT_DIR = path.join(ROOT, 'tests', 'out');
const JOBS = Math.max(1, parseInt(process.env.W84A_JOBS || '4', 10));
fs.mkdirSync(OUT_DIR, { recursive: true });

async function launch() {
  const exe = process.env.CHROMIUM_PATH || '/opt/pw-browsers/chromium-1194/chrome-linux/chrome';
  try { const { chromium } = await import('playwright'); return await chromium.launch(); } catch {}
  const { chromium } = await import('playwright-core');
  return chromium.launch({ executablePath: exe });
}

// ============================================================================================
// 設定
// ============================================================================================
const SEEDS16 = Array.from({ length: 16 }, (_, i) => 7 + i);   // seed 7(展示 seed)〜22
const SEED3 = [7, 8, 9];                                        // 代表3seed(既存 QA phasechange.multiseed と同じ引き)
const CH = 250;         // 組替率の測定窓(250步 = Δt 4)
const POST = 250;       // 摂動注入から「直後」を測るまでの步数(温度キックは瞬時には構造を壊さない)

// 各マーク M について churn を採るために M-CH も必ずマークに入れる
const withChurn = (keys, extra) => [...new Set([...extra, ...keys, ...keys.map((k) => k - CH)])]
  .filter((v) => v > 0).sort((a, b) => a - b);

// E    = 判定步(この時刻の秩序変数で「現象が立っているか」を判定する)
// msEnd= ③ の run を実際に走らせる終步(E 以降も見たい場合だけ E より大きくする)
// E2   = ③ を追加でもう1点評価する步(遅い焼き鈍しに時間を与えたときの再評価)
const CFG = {
  emergent: {
    emoji: '🧬', name: '三態の創発 — 結合の予算', tag0: 'E2',
    E: 12000,                       // 判定步(t=192)— 実測で c̄ は 6000步 以降ほぼ平坦
    keyMarks: [1500, 6000, 12000],  // 1500=固体状 / 12000=分子ガス
    tail: 36000,                    // ⑥ 時間窓の延長(判定步の3倍)
    ko: { phaseChange: { bondK: 0 } }, koName: 'bondK=0(結合の予算オフ)',
    kickAt: 9000,
    // 🧬 の初期条件は **jitter も vScale も無い完全格子**(mMin=mMax)なので、seed を振っても
    // 粒子の初期状態が 1ビットも変わらない = ③多seed が原理的に空虚になる(第84便A の実測発見)。
    // そこで「乱数の引きが変わっても立つか」を問える形として、**初期条件に微小ノイズを入れた
    // 変種 ③′** を別に立てる(格子間隔 pitch=5 の 6% の位置ゆらぎ+微小な初速)。
    icNoise: { jitter: 0.3, vScale: 0.05 },
  },
  emergent2: {
    emoji: '🧊', name: '格子も分子も — 予算×角度', tag0: 'E2',
    E: 18000,                       // 判定步(t=288)— ⛓️♻️ の凍結末と同じ時刻に揃える
    msEnd: 36000, E2: 36000,        // 焼き鈍しの遅い seed に倍の時間を与えたときの再評価
    keyMarks: [3000, 9000, 18000],
    tail: 60000,                    // QA phasechange.emergent2 の窓(60000步)まで見る
    ko: { phaseChange: { angK: 0 } }, koName: 'angK=0(結合角オフ)',
    kickAt: 15000,
  },
  chain2: {
    emoji: '⛓️', name: '鎖の創発 — 予算2×角度180°', tag0: 'E2',
    E: 18000,                       // 判定步(t=288)= ♻️ の凍結末と同じ時刻
    keyMarks: [3000, 9000, 18000],
    tail: 45000,                    // QA phasechange.chain2 の窓(45000步)まで見る
    ko: { phaseChange: { angK: 0 } }, koName: 'angK=0(結合角オフ)',
    kickAt: 12000,
    // ⛓️ の run は ♻️ の run の**前半と 1ビットも変わらない**(壁スケジュール T2/tSwitch は
    // t≥288 でしか効かない・他の全設定が同一)。③④は ♻️ の run から @18000 を読んで共有し、
    // 同一性そのものを SEED3 で明示的に検査する(下の identity タスク)。
    sharedFrom: 'chaincycle', sharedAt: 18000,
  },
  chaincycle: {
    emoji: '♻️', name: '温度循環 — 鎖の凍結と解離', tag0: 'E1',
    E: 33000,                       // 判定步(t=528)= 既存 claim chaincycle.melt-ncomp と同じ時刻
    keyMarks: [9000, 18000, 33000],
    freeze: 18000,                  // 凍結末(t=288)= 既存 claim chaincycle.freeze-maxcomp の時刻
    tail: 48000,
    ko: { phaseChange: { angK: 0 } }, koName: 'angK=0(結合角オフ)',
    kickAt: null,                   // ⑤は⛓️と同一(凍結期の物理が bit-identical) — 下の judge で参照
  },
};
// ⑤ の回復窓。第84便A の一次測定で「注入後 9000〜12000步 では回復率が 0.1〜0.35 までしか上がらない」
// ことが分かったので、**構造形成にかかった時間(⑥の飽和步 2750〜13500)の 2〜10倍**に当たる
// 30000步を回復窓に取り直した(短い窓で「戻らない」と結論しないための較正 — 統括裁定3)
const REC_WINDOW = 30000;
for (const pid of ['emergent', 'emergent2', 'chain2']) CFG[pid].kickEnd = CFG[pid].kickAt + REC_WINDOW;
for (const pid of Object.keys(CFG)) if (CFG[pid].msEnd === undefined) CFG[pid].msEnd = CFG[pid].E;
// マークの最大値は ③ の終步 msEnd に一致させる(ランナーは最大マークまでしか走らないので、
// msEnd を超えるマークを置くと余計に走ってしまう — 下の filter が上限を保証する)
const setMarks = (pid, extra) => { CFG[pid].marks = withChurn(
  [...CFG[pid].keyMarks, CFG[pid].msEnd, ...(CFG[pid].E2 ? [CFG[pid].E2] : [])], extra)
  .filter((v) => v <= CFG[pid].msEnd); };
setMarks('emergent', [250, 500, 1000, 2000, 3000, 4000, 8000, 10000]);
setMarks('emergent2', [250, 500, 1000, 1500, 2000, 4000, 6000, 12000, 15000, 24000, 30000]);
setMarks('chain2', [250, 500, 1000, 1500, 2000, 4000, 6000, 12000, 15000]);
setMarks('chaincycle', [250, 500, 1000, 1500, 2000, 3000, 4500, 6000, 12000, 15000, 21000, 24000, 27000, 30000]);
// ④ は判定步 E で読むので、スケーリング用の run は E までで足りる
const scMarks = (pid) => CFG[pid].marks.filter((v) => v <= CFG[pid].E);

// ④ 粒子数スケーリング: n を半分/標準/2倍。**箱密度 n/(2·size)² と局所の詰め方(pitch)と
//    加熱床までの隙間を保存**するため、箱の大きさ size ∝ √n・列数 cols ∝ √n・格子中心 cy を
//    「床からの隙間が一定」になるよう再配置する(第83便A の教訓 = n が総質量と分離できない設計を避ける)。
const NS = [56, 112, 224];

// ⑤ 摂動: 温度キック(全粒子の T_int を amp 倍)と速度ノイズ(質量重みつき平均を引いて全運動量保存)
const KICKS = [   // 本測(代表3seed)
  { key: 'heat4', mode: 'heat', amp: 4 },
  { key: 'heat12', mode: 'heat', amp: 12 },
  { key: 'vel2', mode: 'vel', amp: 2 },
];
const CALIB = [   // 崩れ幅の較正掃引(展示 seed 7 のみ。本測と同じマークで走らせるので回復も採れる)
  { key: 'heat2', mode: 'heat', amp: 2 }, { key: 'heat8', mode: 'heat', amp: 8 },
  { key: 'heat24', mode: 'heat', amp: 24 }, { key: 'vel4', mode: 'vel', amp: 4 },
];
// 秩序変数の向き: +1 = 大きいほど秩序がある / −1 = 大きいほど無秩序(偏差・断片化)。
// 「崩れ幅」は dir·(before−post)/|before| と定義して、**正なら必ず秩序が壊れた**ようにする
const ORDER_DIR = { cMean: +1, frac1: -1, frac2: +1, frac3: +1, ang120: -1, ang180: -1,
  maxCompFrac: +1, nCompFrac: -1, maxFrac: +1 };
// ⑤ の合否を決める主役の秩序変数(プリセットごと・事前登録)。
// 🧊 は角偏差 ang120 が「3配位が消えると未定義になる」ので、常に定義される 3配位率 frac3 を主役に採る
const PB_KEY = { emergent: 'cMean', emergent2: 'frac3', chain2: 'frac2' };
const BROKE = 0.20;   // 「実際に崩れた」とみなす崩れ幅(20%)

// ============================================================================================
// ページ内ランナー(1タスク = 1 run)
// ============================================================================================
const PAGE_RUN = (o) => {
  const HEX = 0.8660254037844386;
  const P0 = HP.allPresets().find((q) => q.id === o.pid);
  const p = JSON.parse(JSON.stringify(P0));
  if (o.seed !== undefined) p.seed = o.seed;
  if (o.ko) for (const k of Object.keys(o.ko)) Object.assign(p[k], o.ko[k]);
  if (o.icNoise) Object.assign(p.bodies[0], o.icNoise);   // ③′ 初期条件ノイズ(jitter/vScale)
  if (o.n !== undefined && o.n !== p.bodies[0].n) {
    // 箱密度保存スケーリング(上のコメント参照)
    const b = p.bodies[0], s = Math.sqrt(o.n / b.n);
    const size0 = p.world.size, cols0 = b.cols, pit = b.pitch;
    const rows0 = Math.ceil(b.n / cols0), H20 = (rows0 - 1) * pit * HEX / 2;
    const gap0 = size0 - (b.cy + H20);                 // 格子の下端と加熱床の隙間
    const size = size0 * s, cols = Math.max(1, Math.round(cols0 * s));
    const rows = Math.ceil(o.n / cols), H2 = (rows - 1) * pit * HEX / 2;
    p.world.size = size; b.n = o.n; b.cols = cols; b.cy = size - gap0 - H2;
  }
  const v = HP.validatePreset(p);
  if (!v.ok) return { err: v.errors };
  HP.sim.build(v.preset);
  const S = HP.sim;
  const N = S.n;
  const step = () => Math.round(S.t / 0.016);

  // ---- 帳簿(参考値。QA runStats の E() から**接触ばねの項を省いた**簡略版なので、
  // ---- QA phasechange.* の res とは直接比べない — 判定にも使わない)---------------------
  const energy = () => {
    let a = 0;
    const maxInv = 1 / Math.max(1e-9, S.params.softening);
    for (let i = 0; i < S.n; i++) {
      a += 0.5 * S.m[i] * (S.vx[i] * S.vx[i] + S.vy[i] * S.vy[i]);
      a += S.params.cHeat * S.m[i] * S.Tint[i];
    }
    return a + HP.phaseEnergy(S) + HP.urepEnergy(S);
  };

  // ---- 秩序変数の測定 ------------------------------------------------------------------
  let prevNbr = null, prevStep = -1;
  const measure = () => {
    const br = S.phase.bondRange;
    const nbr = Array.from({ length: S.n }, () => []);
    for (let i = 0; i < S.n; i++) for (let j = i + 1; j < S.n; j++) {
      const dx = S.x[i] - S.x[j], dy = S.y[i] - S.y[j];
      const th = br * (S.R[i] + S.R[j]);
      if (dx * dx + dy * dy < th * th) { nbr[i].push(j); nbr[j].push(i); }
    }
    let T = 0, cS = 0, c1 = 0, c2 = 0, c3 = 0, a120 = 0, n120 = 0, a180 = 0, n180 = 0;
    for (let i = 0; i < S.n; i++) {
      T += S.Tint[i]; cS += nbr[i].length;
      if (nbr[i].length === 1) c1++;
      if (nbr[i].length === 2) {
        c2++;
        const [j, k] = nbr[i];
        const q1 = Math.atan2(S.y[j] - S.y[i], S.x[j] - S.x[i]);
        const q2 = Math.atan2(S.y[k] - S.y[i], S.x[k] - S.x[i]);
        let da = Math.abs(q1 - q2); if (da > Math.PI) da = 2 * Math.PI - da;
        a180 += Math.abs(Math.PI - da); n180++;
      }
      if (nbr[i].length === 3) {
        c3++;
        const A = nbr[i].map((j) => Math.atan2(S.y[j] - S.y[i], S.x[j] - S.x[i])).sort((x, y) => x - y);
        for (let k = 0; k < 3; k++) { let da = A[(k + 1) % 3] - A[k]; if (k === 2) da += 2 * Math.PI;
          a120 += Math.abs(da - 2 * Math.PI / 3); n120++; }
      }
    }
    const par = Array.from({ length: S.n }, (_, i) => i);
    const find = (a) => { while (par[a] !== a) { par[a] = par[par[a]]; a = par[a]; } return a; };
    for (let i = 0; i < S.n; i++) for (const j of nbr[i]) { const a = find(i), b = find(j); if (a !== b) par[a] = b; }
    const cn = {};
    for (let i = 0; i < S.n; i++) { const r = find(i); cn[r] = (cn[r] || 0) + 1; }
    const sz = Object.values(cn).sort((a, b) => b - a);
    // 組替率(前のマークからの近傍集合の入替割合)。マーク間隔が CH のときだけ意味を持つ
    let churn = null, churnDt = null;
    if (prevNbr) {
      let diff = 0, tot = 0;
      for (let i = 0; i < S.n; i++) {
        const a = new Set(prevNbr[i]), b = new Set(nbr[i]);
        for (const w of a) { tot++; if (!b.has(w)) diff++; }
        for (const w of b) if (!a.has(w)) { tot++; diff++; }
      }
      churn = tot ? diff / tot : 0; churnDt = step() - prevStep;
    }
    prevNbr = nbr.map((a) => a.slice()); prevStep = step();
    const em = HP.emergenceStats(S);
    const f = (x, d) => +x.toFixed(d);
    return { step: step(), n: S.n, T: f(T / S.n, 4), cMean: f(cS / S.n, 4),
      frac1: f(c1 / S.n, 4), frac2: f(c2 / S.n, 4), frac3: f(c3 / S.n, 4),
      // 角偏差は母数が 0(その配位数の粒子が消えた)なら **null**(QA の 999 番兵は統計を汚すので使わない)
      ang120: n120 ? f(a120 / n120 * 180 / Math.PI, 3) : null,
      ang180: n180 ? f(a180 / n180 * 180 / Math.PI, 3) : null,
      n120, n180,   // 角偏差の母数(0 のときは ang が未定義 = null)
      nComp: sz.length, maxComp: sz[0], nCompFrac: f(sz.length / S.n, 4), maxCompFrac: f(sz[0] / S.n, 4),
      churn: churn === null ? null : f(churn, 4), churnDt,
      nCluster: em.nCluster, maxFrac: f(em.maxFrac, 4), align: f(em.align, 4), vsig: f(em.vsig, 3) };
  };

  // ---- 摂動の注入(ハーネス内 LCG — 決定論)-------------------------------------------
  const inject = (k) => {
    let s = (k.rngSeed || 84001) >>> 0;
    const rnd = () => { s = (s * 1664525 + 1013904223) >>> 0; return s / 4294967296; };
    const gauss = () => { const u = Math.max(1e-12, rnd()), w = rnd();
      return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * w); };
    let sigma = 0, tBefore = 0, tAfter = 0;
    for (let i = 0; i < S.n; i++) tBefore += S.Tint[i];
    if (k.mode === 'heat') {
      for (let i = 0; i < S.n; i++) S.Tint[i] *= k.amp;
    } else {
      let sv = 0;
      for (let i = 0; i < S.n; i++) sv += S.vx[i] * S.vx[i] + S.vy[i] * S.vy[i];
      const vRms = S.n ? Math.sqrt(sv / S.n) : 0;
      sigma = k.amp * vRms / Math.SQRT2;
      const dvx = new Float64Array(S.n), dvy = new Float64Array(S.n);
      for (let i = 0; i < S.n; i++) { dvx[i] = sigma * gauss(); dvy[i] = sigma * gauss(); }
      let mT = 0, px = 0, py = 0;
      for (let i = 0; i < S.n; i++) { const a = Math.abs(S.m[i]); mT += a; px += a * dvx[i]; py += a * dvy[i]; }
      if (mT > 1e-12) { px /= mT; py /= mT; }
      for (let i = 0; i < S.n; i++) { S.vx[i] += dvx[i] - px; S.vy[i] += dvy[i] - py; }
    }
    for (let i = 0; i < S.n; i++) tAfter += S.Tint[i];
    return { sigma: +sigma.toFixed(5), Tbefore: +(tBefore / S.n).toFixed(4), Tafter: +(tAfter / S.n).toFixed(4) };
  };

  // ---- 走行 ----------------------------------------------------------------------------
  const E0 = energy();
  const marks = o.marks.slice().sort((a, b) => a - b);
  const kickMarks = o.kick ? [o.kick.at, o.kick.at + o.post] : [];
  const all = [...new Set([...marks, ...kickMarks])].sort((a, b) => a - b);
  const snaps = [];
  let kick = null, before = null, post = null;
  const t0 = performance.now();
  for (const M of all) {
    while (step() < M) S.step(0.016);
    if (o.kick && step() === o.kick.at && !kick) {
      before = measure();
      kick = inject(o.kick);
      snaps.push(Object.assign(measure(), { kickedAt: true }));
      continue;
    }
    const sn = measure();
    if (o.kick && step() === o.kick.at + o.post) { post = sn; sn.isPost = true; }
    snaps.push(sn);
  }
  const flow = S.wallEin - S.wallEout - S.radE - S.wallKE;
  return { id: o.id, pid: o.pid, seed: o.seed, n: N, ms: Math.round(performance.now() - t0),
    snaps, kick: kick ? Object.assign({}, o.kick, kick, { before, post }) : null,
    res: +(Math.abs(energy() - E0 - flow) / Math.max(1, Math.abs(flow))).toExponential(3),
    nan: S.hasNaN(), clampA: S.clampAN, ovf: S.angOvfN,
    world: { size: +S.world.size.toFixed(3) } };
};

// ============================================================================================
// タスクの組み立て
// ============================================================================================
const tasks = [];
const push = (t) => { tasks.push(t); return t.id; };

// ③⑥ 多seed16(密なマーク付き = 時間窓を兼ねる)。⛓️ は ♻️ の run から @18000 を読んで共有する
for (const pid of ['emergent', 'emergent2', 'chaincycle']) {
  const C = CFG[pid];
  for (const sd of SEEDS16) push({ id: `ms:${pid}:${sd}`, pid, seed: sd, marks: C.marks, post: POST });
}
// ⛓️≡♻️(前半)の同一性検査 — 代表3seed で @18000 の全秩序変数が一致することを実測で示す
for (const sd of SEED3) push({ id: `idc:chain2:${sd}`, pid: 'chain2', seed: sd, marks: CFG.chain2.marks, post: POST });

// ③′ 🧬 だけの追加試験: 初期条件に微小ノイズを入れて「乱数の引き」を実際に効かせた多seed16。
//     素の 🧬 は完全格子(jitter/vScale なし・mMin=mMax)なので seed が物理に一切効かない
for (const sd of SEEDS16) push({ id: `icn:emergent:${sd}`, pid: 'emergent', seed: sd,
  icNoise: CFG.emergent.icNoise, marks: CFG.emergent.marks, post: POST });

// ⑥ 時間窓の延長(展示 seed 7 のみ・判定步の 2〜3倍まで)。⛓️ は ♻️ の run では代用できない
// (t≥288 で壁温が切り替わってしまう)ので単独で走らせる
for (const pid of ['emergent', 'emergent2', 'chain2', 'chaincycle']) {
  const C = CFG[pid];
  const tm = withChurn([C.E, C.tail], [...C.marks, Math.round((C.E + C.tail) / 2)]).filter((v) => v <= C.tail);
  push({ id: `tail:${pid}`, pid, seed: 7, marks: tm, post: POST });
}

// ① ノックアウト対照の多seed版(代表3seed)
for (const pid of ['emergent', 'emergent2', 'chaincycle']) {
  const C = CFG[pid];
  for (const sd of SEED3) push({ id: `ko:${pid}:${sd}`, pid, seed: sd, ko: C.ko, marks: C.marks, post: POST });
}

// ④ 粒子数スケーリング(n=56/224 — n=112 は ③ の run をそのまま使う)
for (const pid of ['emergent', 'emergent2', 'chaincycle']) {
  const C = CFG[pid];
  for (const n of NS) if (n !== 112) for (const sd of SEED3)
    push({ id: `sc:${pid}:${n}:${sd}`, pid, seed: sd, n, marks: scMarks(pid), post: POST });
}

// ⑤ 摂動回復(♻️ は凍結期が ⛓️ と bit-identical なので ⛓️ の測定を正本とする)
const recMarksOf = {};
for (const pid of ['emergent', 'emergent2', 'chain2']) {
  const C = CFG[pid];
  const rm = withChurn([C.kickAt, C.kickEnd], [C.kickAt + POST, C.kickAt + 500, C.kickAt + 1000,
    C.kickAt + 2000, C.kickAt + 3000, C.kickAt + 4500, C.kickAt + 6000, C.kickAt + 9000,
    C.kickAt + 12000, C.kickAt + 18000, C.kickAt + 24000, C.kickEnd]).filter((v) => v <= C.kickEnd);
  recMarksOf[pid] = rm;
  for (const sd of SEED3) {
    push({ id: `pb:${pid}:ref:${sd}`, pid, seed: sd, marks: rm, post: POST });
    for (const k of KICKS) push({ id: `pb:${pid}:${k.key}:${sd}`, pid, seed: sd, marks: rm, post: POST,
      kick: { at: C.kickAt, mode: k.mode, amp: k.amp, rngSeed: 84000 + C.kickAt } });
  }
  // 崩れ幅の較正掃引(seed 7)。**崩れ幅は注入+POST 步で決まるので長い回復窓は要らない** —
  // ここは掃引の本数を稼ぐために注入+2000步で打ち切る(回復まで追うのは KICKS の3種)
  const cm = rm.filter((v) => v <= C.kickAt + 2000);
  for (const k of CALIB) push({ id: `cal:${pid}:${k.key}`, pid, seed: 7, marks: cm, post: POST,
    kick: { at: C.kickAt, mode: k.mode, amp: k.amp, rngSeed: 84000 + C.kickAt } });
}

// 見積コスト(step 数 × (n/112)² — 力の対走査が O(N²) なので)で降順に並べ替えてから流す。
// 重いタスクを先に配ると、プールの終わり際に大物が残らない(makespan が縮む)
for (const t of tasks) t.cost = Math.max(...t.marks) * Math.pow((t.n || 112) / 112, 2);
tasks.sort((a, b) => b.cost - a.cost);
const totalCost = Math.round(tasks.reduce((s, t) => s + t.cost, 0));
console.log(`第84便A 実験4-87: ${tasks.length} タスク / 並列 ${JOBS} ブラウザ / ` +
  `見積 ${(totalCost / 1000).toFixed(0)}k 步(n=112換算・実測 0.79ms/步 ≒ ${(totalCost * 0.000788 / 60).toFixed(1)} コア分)`);

// ============================================================================================
// タスクプール実行(フォアグラウンドで完了まで待つ)
// ============================================================================================
const t00 = Date.now();
const results = {};
let cursor = 0, done = 0;
const worker = async (wi) => {
  const browser = await launch();
  const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
  page.on('pageerror', (e) => console.log('PAGEERROR:', e.message));
  await page.goto(INDEX);
  await page.waitForFunction(() => window.HP && HP.sim);
  const ok = await page.evaluate(() => ['emergent', 'emergent2', 'chain2', 'chaincycle']
    .every((id) => HP.allPresets().some((p) => p.id === id)));
  if (!ok) { await browser.close(); throw new Error('SKIP: 対象に熱の実験室の創発4件が揃っていません'); }
  for (;;) {
    const i = cursor++;
    if (i >= tasks.length) break;
    const t = tasks[i];
    const r = await page.evaluate(PAGE_RUN, t);
    if (r.err) { console.log(`  !! ${t.id}: ${JSON.stringify(r.err)}`); }
    results[t.id] = r;
    done++;
    if (done % 10 === 0 || done === tasks.length)
      console.log(`  [${String(done).padStart(3)}/${tasks.length}] ${((Date.now() - t00) / 1000).toFixed(0)}s 経過 (w${wi} ${t.id})`);
  }
  await browser.close();
};
await Promise.all(Array.from({ length: JOBS }, (_, i) => worker(i)));
console.log(`全タスク完了: ${((Date.now() - t00) / 1000).toFixed(1)}s`);

// ============================================================================================
// 集計
// ============================================================================================
const at = (r, step) => (r && r.snaps) ? (r.snaps.find((s) => s.step === step) || r.snaps[r.snaps.length - 1]) : null;
// 統計。null(角偏差の母数0 等)は落として n で本数を記録する — 番兵で平均を汚さない
const q = (a0) => {
  const a = a0.filter((v) => typeof v === 'number' && Number.isFinite(v));
  if (!a.length) return { n: 0, nNull: a0.length, min: null, median: null, max: null, mean: null, vals: a0 };
  const b = [...a].sort((x, y) => x - y);
  const md = b.length % 2 ? b[(b.length - 1) / 2] : 0.5 * (b[b.length / 2 - 1] + b[b.length / 2]);
  return { n: a.length, nNull: a0.length - a.length, min: +b[0].toFixed(4), median: +md.toFixed(4),
    max: +b[b.length - 1].toFixed(4), mean: +(b.reduce((s, v) => s + v, 0) / b.length).toFixed(4),
    vals: a0.map((v) => (typeof v === 'number' ? +v.toFixed(3) : null)) }; };
const sv = (st, k) => (st && st[k]) ? st[k] : { n: 0, nNull: 0, min: null, median: null, max: null, mean: null, vals: [] };

// ⛓️ の @18000 は ♻️ の run から読む(下で同一性を検査する)
const msRun = (pid, sd) => pid === 'chain2' ? results[`ms:chaincycle:${sd}`] : results[`ms:${pid}:${sd}`];
const scRun = (pid, n, sd) => n === 112 ? msRun(pid, sd)
  : results[`sc:${pid === 'chain2' ? 'chaincycle' : pid}:${n}:${sd}`];
const koRun = (pid, sd) => results[`ko:${pid === 'chain2' ? 'chaincycle' : pid}:${sd}`];

const KEYS = ['T', 'cMean', 'frac1', 'frac2', 'frac3', 'ang120', 'ang180', 'nComp', 'maxComp',
  'nCompFrac', 'maxCompFrac', 'churn', 'nCluster', 'maxFrac', 'align', 'vsig'];

const out = { meta: { exp: '4-87', wave: 84, track: 'A', target: TARGET,
  date: new Date().toISOString().slice(0, 10), jobs: JOBS, tasks: tasks.length,
  note: '熱の実験室の創発4件(🧬🧊⛓️♻️)への創発標準試験の展開 — 多seed16/粒子数スケーリング/摂動回復/時間窓(QA ではない計測)',
  seeds16: SEEDS16, seed3: SEED3, ns: NS, churnWindow: CH, postDelay: POST } };

// ---- ⛓️≡♻️(前半)の同一性 ----------------------------------------------------------------
{
  const rows = SEED3.map((sd) => {
    const a = at(results[`idc:chain2:${sd}`], 18000), b = at(results[`ms:chaincycle:${sd}`], 18000);
    const diff = KEYS.filter((k) => JSON.stringify(a[k]) !== JSON.stringify(b[k]));
    return { seed: sd, same: diff.length === 0, diff, chain2: a, chaincycle: b };
  });
  out.identity = { note: '⛓️chain2 と ♻️chaincycle は壁スケジュール(T2/tSwitch, t≥288 でのみ発動)以外が同一設定なので、t=288(18000步)までの軌道は一致するはず。③④の run を共有した根拠', rows,
    allSame: rows.every((r) => r.same) };
  console.log('=== ⛓️≡♻️(t≤288)同一性 ===',
    rows.map((r) => `seed${r.seed}:${r.same ? '一致' : '差=' + r.diff.join(',')}`).join(' / '));
}

// ---- ① ノックアウト対照/② 用量反応 の棚卸し ---------------------------------------------
out.inventory = {
  note: '既存 claims / QA / exp のカバー状況(重複測定を作らないための棚卸し)',
  knockout: {
    emergent: { existing: 'abQuick bondK=0 の宣言のみ(数値は未測定)', action: '本ハーネスが代表3seed で新規実測' },
    emergent2: { existing: 'QA phasechange.emergent2 のコメントに angK=0 対照の実測 角偏差79.2°・c̄4.09(固定seed)', action: '本ハーネスが同じ対照を代表3seed へ拡張' },
    chain2: { existing: 'QA phasechange.chain2 のコメントに angK=0 対照の実測 180°偏差94.5°・c̄3.0(固定seed)', action: '本ハーネスが同じ対照を代表3seed へ拡張(♻️ の run と共有)' },
    chaincycle: { existing: 'descStruct control「angK=0 にすると前半の鎖が液滴に崩れる」', action: '本ハーネスが代表3seed で実測' },
  },
  doseResponse: {
    emergent: { existing: '第83便B exp-4-86(相図ランナー): 熱圧 kRep 0〜20 × 一様重力 g_y 0〜0.5 の6×6掃引で最大塊の質量比 0.107〜1.000(相境界 kRep≈11.4→6.8)= 熱圧の用量反応そのもの', action: '再測定しない' },
    emergent2: { existing: 'descStruct control「T_wall を5へ上げると分子ガスへ解離・kRep を12へ上げると分子がより細かくなる」(壁温・熱圧の用量反応・定性)', action: '再測定しない(本便の対象外)' },
    chain2: { existing: 'descStruct control「bondN を 3→網 / 6→等方の塊」= 予算ノブの用量反応(定性)', action: '再測定しない(本便の対象外)' },
    chaincycle: { existing: '第67便 67A の実測「壁温 T2=8 では解けない(T̄6 でも断片化止まり)/ T2=20 で解離」= 壁温の用量反応(閾値の存在)', action: '再測定しない' },
  },
};

// ---- ③ 多seed16 + ① 対照 -----------------------------------------------------------------
console.log('\n=== ③ 多seed16(seed 7〜22)===');
out.multiSeed = {};
for (const pid of ['emergent', 'emergent2', 'chain2', 'chaincycle']) {
  const C = CFG[pid];
  const rows = SEEDS16.map((sd) => ({ seed: sd, snap: at(msRun(pid, sd), C.E),
    rise: at(msRun(pid, sd), C.keyMarks[0]),
    freeze: C.freeze ? at(msRun(pid, sd), C.freeze) : null }));
  const koRows = SEED3.map((sd) => ({ seed: sd, snap: at(koRun(pid, sd), C.E) }));
  const agg = (list, field) => { const o = {};
    for (const k of KEYS) o[k] = q(list.map((r) => r[field][k])); return o; };
  const st = agg(rows, 'snap'), stRise = agg(rows, 'rise'), stKo = agg(koRows, 'snap');
  const stFz = C.freeze ? agg(rows, 'freeze') : null;
  const rowsE2 = C.E2 ? SEEDS16.map((sd) => ({ seed: sd, snap: at(msRun(pid, sd), C.E2),
    rise: at(msRun(pid, sd), C.keyMarks[0]), freeze: C.freeze ? at(msRun(pid, sd), C.freeze) : null })) : null;
  out.multiSeed[pid] = { E: C.E, E2: C.E2 || null, riseStep: C.keyMarks[0], freezeStep: C.freeze || null,
    rows, rowsE2, koRows, stats: st, statsE2: rowsE2 ? agg(rowsE2, 'snap') : null,
    statsRise: stRise, statsFreeze: stFz, statsKnockout: stKo,
    // 素の seed 振りが物理に効いているか(効いていなければ ③ は原理的に空虚)
    seedSensitive: !SEEDS16.every((sd) => JSON.stringify(at(msRun(pid, sd), C.E))
      === JSON.stringify(at(msRun(pid, SEEDS16[0]), C.E))),
    nan: SEEDS16.filter((sd) => msRun(pid, sd).nan),
    clampA: SEEDS16.filter((sd) => msRun(pid, sd).clampA),
    ovf: SEEDS16.filter((sd) => msRun(pid, sd).ovf),
    resMax: Math.max(...SEEDS16.map((sd) => parseFloat(msRun(pid, sd).res))) };
  const s = out.multiSeed[pid].stats;
  const R = (o, u) => o.n ? `${o.min}〜${o.max}${u || ''}` + (o.nNull ? `(未定義${o.nNull}本)` : '') : '(全て未定義)';
  console.log(`${C.emoji}${pid} @${C.E}步 (16seed)`);
  console.log(`  c̄ ${R(s.cMean)}(中央${s.cMean.median}) / frac1 ${R(s.frac1)}` +
    ` / frac2 ${R(s.frac2)} / frac3 ${R(s.frac3)}`);
  console.log(`  ang120 ${R(s.ang120, '°')} / ang180 ${R(s.ang180, '°')}` +
    ` / nComp ${R(s.nComp)} / maxComp ${R(s.maxComp)} / churn ${R(s.churn)} / T̄ ${R(s.T)}`);
  console.log(`  対照(${C.koName}・3seed): c̄ ${R(stKo.cMean)}` +
    ` / ang120 ${R(stKo.ang120, '°')} / ang180 ${R(stKo.ang180, '°')}` +
    ` / frac2 ${R(stKo.frac2)} / frac3 ${R(stKo.frac3)} / maxComp ${R(stKo.maxComp)} / nComp ${R(stKo.nComp)}`);
  console.log(`  NaN ${out.multiSeed[pid].nan.length} / clampA ${out.multiSeed[pid].clampA.length}` +
    ` / 角あふれ ${out.multiSeed[pid].ovf.length} / 帳簿残差 最大 ${out.multiSeed[pid].resMax.toExponential(2)}` +
    ` / seed が物理に効く=${out.multiSeed[pid].seedSensitive}`);
  if (C.E2) { const s2 = out.multiSeed[pid].statsE2;
    console.log(`  【@${C.E2}步(焼き鈍しに倍の時間)】c̄ ${R(s2.cMean)} / frac3 ${R(s2.frac3)}` +
      ` / ang120 ${R(s2.ang120, '°')} / nComp ${R(s2.nComp)} / maxComp ${R(s2.maxComp)} / T̄ ${R(s2.T)}`); }
}

// ---- ③′ 🧬 の初期条件ノイズ版(素の 🧬 は seed が効かないため)-----------------------------
{
  const C = CFG.emergent;
  const rows = SEEDS16.map((sd) => ({ seed: sd, snap: at(results[`icn:emergent:${sd}`], C.E),
    rise: at(results[`icn:emergent:${sd}`], C.keyMarks[0]) }));
  const agg = (f) => { const o = {}; for (const k of KEYS) o[k] = q(rows.map((r) => r[f][k])); return o; };
  const st = agg('snap'), stRise = agg('rise');
  out.icNoise = { pid: 'emergent', patch: C.icNoise, E: C.E, rows, stats: st, statsRise: stRise,
    seedSensitive: !SEEDS16.every((sd) => JSON.stringify(rows[0].snap) === JSON.stringify(rows.find((r) => r.seed === sd).snap)),
    note: '素の 🧬emergent は grid の jitter/vScale がゼロ・mMin=mMax なので seed を振っても粒子の初期状態が 1ビットも変わらない(= ③多seed が原理的に空虚)。ここでは格子間隔 pitch=5 の 6% の位置ゆらぎ+微小初速を入れて「乱数の引き」を実際に効かせた 16seed を測る' };
  const R = (o, u) => o.n ? `${o.min}〜${o.max}${u || ''}` : '(全て未定義)';
  console.log(`\n=== ③′ 🧬emergent 初期条件ノイズ版(jitter ${C.icNoise.jitter}・vScale ${C.icNoise.vScale}・16seed)===`);
  console.log(`  seed が物理に効く=${out.icNoise.seedSensitive} / @${C.keyMarks[0]}步 c̄ ${R(stRise.cMean)} maxComp ${R(stRise.maxComp)}`);
  console.log(`  @${C.E}步 c̄ ${R(st.cMean)}(中央${st.cMean.median}) / frac2 ${R(st.frac2)} / frac3 ${R(st.frac3)}` +
    ` / nComp ${R(st.nComp)} / maxComp ${R(st.maxComp)} / T̄ ${R(st.T)}`);
}

// ---- ④ 粒子数スケーリング -----------------------------------------------------------------
console.log('\n=== ④ 粒子数スケーリング(n=56/112/224・箱密度保存・代表3seed)===');
out.scaling = {};
for (const pid of ['emergent', 'emergent2', 'chain2', 'chaincycle']) {
  const C = CFG[pid];
  const byN = {};
  for (const n of NS) {
    const rows = SEED3.map((sd) => ({ seed: sd, snap: at(scRun(pid, n, sd), C.E),
      freeze: C.freeze ? at(scRun(pid, n, sd), C.freeze) : null,
      nBuilt: scRun(pid, n, sd).n, size: scRun(pid, n, sd).world.size }));
    const agg = (field) => { const o = {};
      for (const k of KEYS) o[k] = q(rows.map((r) => r[field][k])); return o; };
    const st = agg('snap'), stFz = C.freeze ? agg('freeze') : null;
    byN['n' + n] = { rows, stats: st, statsFreeze: stFz,
      size: rows[0].size, density: +(rows[0].nBuilt / (4 * rows[0].size * rows[0].size) * 1e4).toFixed(3) };
    const R = (o, u) => o.n ? `${o.min}〜${o.max}${u || ''}` + (o.nNull ? `(未定義${o.nNull})` : '') : '(全て未定義)';
    console.log(`${C.emoji}${pid} n=${n}(箱±${rows[0].size}・密度${byN['n' + n].density}/1e4)` +
      ` c̄ ${R(st.cMean)} / frac2 ${R(st.frac2)}` +
      ` / frac3 ${R(st.frac3)} / ang120 中央${sv(st, 'ang120').median}° / ang180 中央${sv(st, 'ang180').median}°` +
      ` / maxComp/n ${R(st.maxCompFrac)} / nComp/n ${R(st.nCompFrac)}`);
  }
  out.scaling[pid] = byN;
}

// ---- ⑤ 摂動回復 -------------------------------------------------------------------------
console.log('\n=== ⑤ 摂動回復(崩れ幅を先に実測 → 実際に崩れた秩序変数の復帰だけを数える)===');
const RKEYS = ['cMean', 'frac1', 'frac2', 'frac3', 'ang120', 'ang180', 'maxCompFrac', 'nCompFrac', 'maxFrac', 'T'];
out.perturb = {};
// 1本の摂動 run を無摂動の双子と突き合わせて {崩れ幅, 回復} を作る。
//   崩れ幅 drop = dir·(before − post)/|before|(正 = 秩序が壊れた・向きは ORDER_DIR)
//   回復   rec(T) = (X_摂動(T) − X_直後)/(X_無摂動(T) − X_直後)。rec≥0.9 の最初の步が回復步
//   before/post のどちらかが null(角偏差の母数0)なら測定不能として null を返す
const analyseKick = (r, ref, kickAt, RS, RKEYS) => {
  const b = r.kick.before, p = at(r, kickAt + POST);
  const o = { mode: r.kick.mode, amp: r.kick.amp, Tbefore: r.kick.Tbefore, Tafter: r.kick.Tafter,
    sigma: r.kick.sigma, disturbed: {}, recovery: {} };
  for (const kk of RKEYS) {
    const dir = ORDER_DIR[kk] === undefined ? +1 : ORDER_DIR[kk];
    const bv = b[kk], pv = p[kk];
    if (typeof bv !== 'number' || typeof pv !== 'number') {
      o.disturbed[kk] = { before: bv, post: pv, drop: null, recoverSteps: null, recoverDt: null,
        note: '母数0で未定義' };
      o.recovery[kk] = []; continue;
    }
    const drop = +(Math.abs(bv) < 1e-12 ? 0 : dir * (bv - pv) / Math.abs(bv)).toFixed(4);
    const rows = RS.map((T) => { const xr = at(ref, T)[kk], xp = at(r, T)[kk];
      if (typeof xr !== 'number' || typeof xp !== 'number') return { step: T, ref: xr, pert: xp, rec: null };
      const den = xr - pv;
      return { step: T, ref: xr, pert: xp,
        rec: Math.abs(den) < 1e-9 ? (Math.abs(xp - xr) < 1e-9 ? 1 : 0) : +((xp - pv) / den).toFixed(3) }; });
    const hit = rows.find((v) => v.rec !== null && v.rec >= 0.9);
    o.disturbed[kk] = { before: bv, post: pv, drop,
      recoverSteps: hit ? hit.step - kickAt : null,
      recoverDt: hit ? +((hit.step - kickAt) * 0.016).toFixed(2) : null };
    o.recovery[kk] = rows;
  }
  return o;
};
const fmtDist = (o, keys) => keys.map((kk) => { const d = o.disturbed[kk];
  if (d.drop === null) return `${kk} —`;
  return `${kk} ${(d.drop * 100).toFixed(0)}%` +
    (d.drop < BROKE ? '[崩れず]' : d.recoverSteps !== null ? `→+${d.recoverSteps}步` : '→未回復'); }).join(' ');

for (const pid of ['emergent', 'emergent2', 'chain2']) {
  const C = CFG[pid];
  const RS = recMarksOf[pid].filter((s) => s > C.kickAt + POST);
  const rec = {};
  for (const sd of SEED3) {
    rec['s' + sd] = {};
    const ref = results[`pb:${pid}:ref:${sd}`];
    // seed 7 だけは較正掃引の分も同じ解析にかける(⑤a と ⑤b を同じ土俵に載せる)。
    // 較正 run は注入+2000步で打ち切っているので、回復の追跡はその範囲だけ(崩れ幅は同じ土俵)
    for (const k of (sd === 7 ? [...KICKS, ...CALIB] : KICKS)) {
      const r = results[`pb:${pid}:${k.key}:${sd}`] || (sd === 7 ? results[`cal:${pid}:${k.key}`] : null);
      if (!r || !r.kick) continue;
      const rs = RS.filter((T) => r.snaps.some((s) => s.step === T));
      rec['s' + sd][k.key] = analyseKick(r, ref, C.kickAt, rs, RKEYS);
      rec['s' + sd][k.key].recTrackedTo = rs.length ? rs[rs.length - 1] : C.kickAt + POST;
    }
  }
  out.perturb[pid] = { kickAt: C.kickAt, kickEnd: C.kickEnd, postDelay: POST, recSteps: RS,
    primaryKey: PB_KEY[pid], brokeThreshold: BROKE, recovery: rec,
    calibKeys: [...KICKS, ...CALIB].map((k) => k.key) };
  const SHOW = RKEYS.filter((kk) => kk !== 'T');
  console.log(`${C.emoji}${pid} ⑤a 較正掃引(seed7・注入@${C.kickAt}步 → +${POST}步の崩れ幅 / 主役=${PB_KEY[pid]})`);
  for (const k of [...KICKS, ...CALIB].sort((a, b) => a.mode === b.mode ? a.amp - b.amp : (a.mode < b.mode ? -1 : 1))) {
    const o = rec.s7[k.key]; if (!o) continue;
    console.log(`  ${k.key.padEnd(7)} T̄ ${o.Tbefore}→${o.Tafter}${o.sigma ? ` σv=${o.sigma}` : ''}  ${fmtDist(o, SHOW)}`);
  }
  console.log(`${C.emoji}${pid} ⑤b 本測(代表3seed・rec≥0.9 の最初の步)`);
  for (const sd of SEED3) for (const k of KICKS)
    console.log(`  seed${sd} ${k.key.padEnd(7)}`, fmtDist(rec['s' + sd][k.key], SHOW));
}
out.perturb.chaincycle = { note: '♻️ の凍結期(t<288)は ⛓️chain2 と 1ビットも変わらない(上の identity で実測)ため、⑤ の正本は ⛓️ の測定(注入@12000步=t192・凍結期)である。解離期(t>288・壁温20の流体)は秩序変数そのものが無いので摂動回復の問いが立たない',
  refersTo: 'chain2' };

// ---- ⑥ 時間窓 ---------------------------------------------------------------------------
console.log('\n=== ⑥ 時間窓 ===');
out.timeWindow = {};
for (const pid of ['emergent', 'emergent2', 'chain2', 'chaincycle']) {
  const C = CFG[pid];
  // 秩序変数の主役(プリセットごと)
  const KEY = { emergent: 'cMean', emergent2: 'ang120', chain2: 'frac2', chaincycle: 'maxCompFrac' }[pid];
  const rows = SEEDS16.map((sd) => {
    const r = msRun(pid, sd);
    const fin = at(r, C.E)[KEY];
    const seq = r.snaps.filter((s) => s.step <= C.E && typeof s[KEY] === 'number');
    // 立ち上がり: 主役の秩序変数が最終値の 90%(単調減少系は 110%)以内に初めて入る步
    const dec = seq[0][KEY] > fin;
    const hit = seq.find((s) => dec ? s[KEY] <= fin * 1.1 : s[KEY] >= fin * 0.9);
    // 飽和: 以降の全サンプルが最終値の ±10% に収まる最初の步
    let stab = null;
    for (let i = 0; i < seq.length; i++)
      if (seq.slice(i).every((s) => Math.abs(s[KEY] - fin) <= 0.1 * Math.abs(fin))) { stab = seq[i].step; break; }
    return { seed: sd, key: KEY, fin, riseStep: hit ? hit.step : null, stabStep: stab };
  });
  // ⑥ の延長は展示 seed 7。⛓️ の延長は ♻️ の tail では読めない(t≥288 で壁が切り替わるため)
  // ので、⛓️ 単独の延長 run を使う
  const tail = results[`tail:${pid}`];
  const tailStep = CFG[pid].tail;
  const drift = {};
  for (const k of RKEYS) {
    const a = at(tail, C.E)[k], b = at(tail, tailStep)[k];
    drift[k] = { atE: a, atTail: b,
      rel: (typeof a === 'number' && typeof b === 'number' && Math.abs(a) > 1e-12)
        ? +((b - a) / Math.abs(a)).toFixed(4) : null };
  }
  const rs = q(rows.map((r) => r.riseStep === null ? C.E : r.riseStep));
  const ss = q(rows.map((r) => r.stabStep === null ? C.E : r.stabStep));
  out.timeWindow[pid] = { key: KEY, E: C.E, rows, tailStep, riseStats: rs, stabStats: ss, tailDrift: drift,
    // 判定: 主役の飽和が判定步の半分までに来ていて(展示時刻がたまたまではない)、
    //       判定步から延長步までの主役のずれが ±15% 以内(窓の外へ出ても現象が続く)
    stabMedianWithinHalfE: ss.median <= C.E / 2,
    tailDriftPrimary: drift[KEY] ? drift[KEY].rel : null };
  console.log(`${C.emoji}${pid} 主役=${KEY}: 立ち上がり ${rs.min}〜${rs.max}步(中央${rs.median})` +
    ` 飽和 ${ss.min}〜${ss.max}步(中央${ss.median}・判定步${C.E}の${(ss.median / C.E * 100).toFixed(0)}%)`);
  console.log(`   seed7 の判定步${C.E}→延長${tailStep}步 のずれ: ` +
    ['cMean', 'frac2', 'frac3', 'ang120', 'ang180', 'maxCompFrac', 'nCompFrac', 'T']
      .map((k) => `${k} ${drift[k].atE}→${drift[k].atTail}`).join(' / '));
}

// ============================================================================================
// 判定(E水準)
// ============================================================================================
// プリセットごとの「現象が立っている」述語 — 既存 QA(phasechange.*・claim.chaincycle)の
// 閾値をそのまま使い、n に依存する量だけ割合(maxCompFrac/nCompFrac)へ読み替える
const lt = (x, v) => typeof x === 'number' && x < v;   // null(母数0)は「満たさない」に倒す
const holds = {
  emergent: (s, rise) => rise.cMean > 3.2 && rise.maxCompFrac >= 25 / 112
    && s.cMean < 2.9 && s.nCompFrac >= 20 / 112 && s.maxCompFrac <= 15 / 112 && rise.cMean > s.cMean,
  emergent2: (s) => lt(s.ang120, 25) && s.frac3 > 0.3 && s.cMean > 2.7 && s.cMean < 3.4
    && s.maxCompFrac >= 35 / 112 && s.nCompFrac <= 6 / 112,
  chain2: (s) => s.frac2 > 0.6 && s.cMean > 1.6 && s.cMean < 2.2 && lt(s.ang180, 25)
    && s.maxCompFrac >= 25 / 112 && s.nCompFrac <= 15 / 112,
  // ♻️ の凍結期は ⛓️ と 1ビットも変わらないので、凍結の判定は ⛓️ の鎖の述語そのものを使う。
  // 「最大連結が大きいか」だけでは angK=0 対照(等方の液滴も大きな連結になる)と分離できない
  // ことが第84便A の実測で分かったため(seed7 の対照は t=288 で 50粒の塊を作る)
  chaincycle: (s, rise, fz) => holds.chain2(fz) && lt(fz.churn, 0.05)
    && s.nCompFrac >= 50 / 112 && s.maxCompFrac <= 12 / 112 && s.T > fz.T * 3,
};
// 述語のどの条件が落ちたかを残す(「通らなかった記録」も成果 — 統括裁定2)
const why = {
  emergent: (s, rise) => ({ 'rise.c̄>3.2': rise.cMean > 3.2, 'rise.maxComp/n≥25/112': rise.maxCompFrac >= 25 / 112,
    'c̄<2.9': s.cMean < 2.9, 'nComp/n≥20/112': s.nCompFrac >= 20 / 112,
    'maxComp/n≤15/112': s.maxCompFrac <= 15 / 112, 'c̄ が下がる': rise.cMean > s.cMean }),
  emergent2: (s) => ({ 'ang120<25°': lt(s.ang120, 25), 'frac3>0.3': s.frac3 > 0.3,
    '2.7<c̄<3.4': s.cMean > 2.7 && s.cMean < 3.4, 'maxComp/n≥35/112': s.maxCompFrac >= 35 / 112,
    'nComp/n≤6/112': s.nCompFrac <= 6 / 112 }),
  chain2: (s) => ({ 'frac2>0.6': s.frac2 > 0.6, '1.6<c̄<2.2': s.cMean > 1.6 && s.cMean < 2.2,
    'ang180<25°': lt(s.ang180, 25), 'maxComp/n≥25/112': s.maxCompFrac >= 25 / 112,
    'nComp/n≤15/112': s.nCompFrac <= 15 / 112 }),
  chaincycle: (s, rise, fz) => Object.assign(
    Object.fromEntries(Object.entries(why.chain2(fz)).map(([k, v]) => ['凍結 ' + k, v])),
    { '凍結 churn<0.05': lt(fz.churn, 0.05), '解離 nComp/n≥50/112': s.nCompFrac >= 50 / 112,
      '解離 maxComp/n≤12/112': s.maxCompFrac <= 12 / 112, 'T̄ が3倍超へ': s.T > fz.T * 3 }),
};
// ③a 対照との分離: 第83便A が 🥚 の減光コントラストで採った「本則と対照が多seed を通して
// 一度も重ならない」判定。プリセットごとに**対照(機構ノックアウト)が最も強く動かす秩序変数**を
// 事前登録し、本則16seed の範囲と対照3seed の範囲が重ならないかを見る。
// dir=+1 は「本則の方が大きいはず」・dir=−1 は「本則の方が小さいはず(偏差・断片化の量)」
const SEP = {
  emergent: { key: 'cMean', dir: +1, at: 'snap', label: '配位数 c̄(結合の予算オフで結合が消える)' },
  emergent2: { key: 'ang120', dir: -1, at: 'snap', label: '120°からの角偏差(角度オフで密集充填になる)' },
  chain2: { key: 'ang180', dir: -1, at: 'snap', label: '180°からの角偏差(角度オフで鎖が液滴に崩れる)' },
  chaincycle: { key: 'ang180', dir: -1, at: 'freeze', label: '凍結期の180°角偏差(角度オフで鎖が液滴に崩れる)' },
};
const failedOf = (pid, s, rise, fz) => Object.entries(why[pid](s, rise, fz))
  .filter(([, v]) => !v).map(([k]) => k);
// ④ 用の**示強量だけ**の述語。連結成分の個数・最大成分は n で割っても示強にならない
// (断片の大きさの分布が示強なので、最大断片/n は n に反比例して落ち、成分数/n は平均断片長の逆数)。
// 「特定の粒子数の離散模様ではないか」という④の問いに答えるのは配位数・角度・配位分布の側なので、
// 判定はそちらで行い、成分側の値は落ちた条件として全部記録する(第84便A の実測に基づく方法論の訂正)
const EXTENSIVE = ['maxComp/n', 'nComp/n', 'maxComp', 'nComp'];
const isExtensive = (cond) => EXTENSIVE.some((e) => cond.includes(e));
const failedIntensive = (pid, s, rise, fz) => failedOf(pid, s, rise, fz).filter((c) => !isExtensive(c));
const verdict = {};
for (const pid of ['emergent', 'emergent2', 'chain2', 'chaincycle']) {
  const C = CFG[pid], M = out.multiSeed[pid];
  // ③
  const per = M.rows.map((r) => ({ seed: r.seed, ok: holds[pid](r.snap, r.rise, r.freeze),
    failed: failedOf(pid, r.snap, r.rise, r.freeze) }));
  const perE2 = M.rowsE2 ? M.rowsE2.map((r) => ({ seed: r.seed, ok: holds[pid](r.snap, r.rise, r.freeze),
    failed: failedOf(pid, r.snap, r.rise, r.freeze) })) : null;
  // 素の seed 振りが物理に効かないサンプル(🧬)は、③ を「16本が bit 一致した」だけで通しては
  // ならない(空虚な通過)。その場合は ③′(初期条件ノイズ)の結果を ③ の判定に採る
  const useIcn = !M.seedSensitive && pid === 'emergent';
  const perIcn = useIcn ? out.icNoise.rows.map((r) => ({ seed: r.seed, ok: holds[pid](r.snap, r.rise, null),
    failed: failedOf(pid, r.snap, r.rise, null) })) : null;
  const c3win = useIcn ? perIcn.every((v) => v.ok) : per.every((v) => v.ok);
  // ③a 対照との分離(第83便A 流儀)
  const S = SEP[pid];
  const mainRows = useIcn ? out.icNoise.rows : M.rows;
  const mv = mainRows.map((r) => (S.at === 'freeze' ? r.freeze : r.snap)[S.key]).filter((v) => typeof v === 'number');
  const cv = M.koRows.map((r) => (S.at === 'freeze'
    ? at(koRun(pid, r.seed), C.freeze) : r.snap)[S.key]).filter((v) => typeof v === 'number');
  const sep = { key: S.key, at: S.at, label: S.label, dir: S.dir,
    main: mv.length ? { min: Math.min(...mv), max: Math.max(...mv), n: mv.length } : null,
    control: cv.length ? { min: Math.min(...cv), max: Math.max(...cv), n: cv.length } : null };
  sep.noOverlap = !!(sep.main && sep.control && (S.dir > 0 ? sep.main.min > sep.control.max : sep.main.max < sep.control.min));
  sep.margin = (sep.main && sep.control) ? +(S.dir > 0 ? sep.main.min / Math.max(1e-9, sep.control.max)
    : sep.control.min / Math.max(1e-9, sep.main.max)).toFixed(2) : null;
  const c3 = c3win && sep.noOverlap;
  // ① 対照が現象を消すか(代表3seed)
  const koPer = M.koRows.map((r) => {
    const rise = at(koRun(pid, r.seed), C.keyMarks[0]), fz = C.freeze ? at(koRun(pid, r.seed), C.freeze) : null;
    return { seed: r.seed, ok: !holds[pid](r.snap, rise, fz), broke: failedOf(pid, r.snap, rise, fz) };
  });
  const c1 = koPer.every((v) => v.ok);
  // ④
  const scPer = {};
  for (const n of NS) scPer['n' + n] = out.scaling[pid]['n' + n].rows.map((r) => {
    const rise = at(scRun(pid, n, r.seed), C.keyMarks[0]), fz = C.freeze ? at(scRun(pid, n, r.seed), C.freeze) : null;
    const f = failedOf(pid, r.snap, rise, fz), fi = failedIntensive(pid, r.snap, rise, fz);
    return { seed: r.seed, ok: f.length === 0, okIntensive: fi.length === 0, failed: f, failedIntensive: fi };
  });
  // ④ の判定は**示強量**で行う(上の EXTENSIVE のコメント参照)。全条件版も併記する
  const c4 = Object.values(scPer).every((a) => a.every((v) => v.okIntensive));
  const c4all = Object.values(scPer).every((a) => a.every((v) => v.ok));
  const c4loose = Object.values(scPer).every((a) => a.filter((v) => v.okIntensive).length >= 2);
  // ⑤(♻️ は ⛓️ を参照)。事前登録した選択規則:
  //   主役の秩序変数 PB_KEY について、**展示 seed 7 で崩れ幅 ≥ BROKE を満たす最も弱い摂動**を選び、
  //   その摂動が代表3seed すべてで「崩れて・戻る」ことを要求する(崩れない摂動で空虚に通さない)
  const ppid = pid === 'chaincycle' ? 'chain2' : pid;
  const PB = out.perturb[ppid], PK = PB.primaryKey;
  const strength = (k) => (k.mode === 'heat' ? 0 : 1000) + k.amp;   // 温度キックを弱い順、次に速度ノイズ
  const cands = [...KICKS, ...CALIB].sort((a, b) => strength(a) - strength(b))
    .filter((k) => PB.recovery.s7[k.key] && PB.recovery.s7[k.key].disturbed[PK].drop !== null
      && PB.recovery.s7[k.key].disturbed[PK].drop >= BROKE);
  // 3seed で測ってある摂動(KICKS)のうち、最弱で崩れるものを本測に採る
  const chosen = cands.find((k) => KICKS.some((m) => m.key === k.key)) || cands[0] || null;
  const perKick = chosen ? SEED3.map((sd) => {
    const o = PB.recovery['s' + sd][chosen.key];
    if (!o) return { seed: sd, ok: false, note: 'この摂動は seed 7 でしか測っていない' };
    const d = o.disturbed[PK], rows = o.recovery[PK];
    const last = rows.length ? rows[rows.length - 1] : null;
    return { seed: sd, drop: d.drop, recoverSteps: d.recoverSteps,
      recAtEnd: last ? last.rec : null, trackedTo: last ? last.step - PB.kickAt : null,
      ok: d.drop !== null && d.drop >= BROKE && d.recoverSteps !== null };
  }) : [];
  const c5 = !!chosen && perKick.length > 0 && perKick.every((v) => v.ok);
  // 全摂動 × 全秩序変数の「崩れて戻った/戻らなかった」台帳(正直な記録)
  const ledger = [];
  for (const sd of SEED3) for (const k of KICKS) {
    const o = PB.recovery['s' + sd][k.key]; if (!o) continue;
    for (const kk of RKEYS) { if (kk === 'T') continue;
      const d = o.disturbed[kk];
      if (d.drop !== null && d.drop >= BROKE)
        ledger.push({ seed: sd, kick: k.key, key: kk, drop: d.drop, recoverSteps: d.recoverSteps });
    }
  }
  // ⑥ 主役の飽和が判定步の半分までに来ていて、判定步→延長步のずれが ±15% 以内
  const TW = out.timeWindow[pid];
  const c6 = TW.stabMedianWithinHalfE
    && TW.tailDriftPrimary !== null && Math.abs(TW.tailDriftPrimary) <= 0.15;
  verdict[pid] = {
    emoji: C.emoji, tagBefore: C.tag0,
    t1_knockout: { pass: c1, perSeed: koPer, note: out.inventory.knockout[pid].existing },
    t2_doseResponse: { pass: null, note: out.inventory.doseResponse[pid].existing + '(既存参照 — 本便では再測定しない)' },
    t3_multiSeed16: { pass: c3, passWindow: c3win, passSeparation: sep.noOverlap, separation: sep,
      perSeed: per, nOk: per.filter((v) => v.ok).length,
      seedSensitive: M.seedSensitive,
      judgedOn: useIcn ? '③′ 初期条件ノイズ版(素の seed 振りが物理に効かないため)' : '③ 素の seed 振り',
      perSeedIcNoise: perIcn, nOkIcNoise: perIcn ? perIcn.filter((v) => v.ok).length : null,
      atE2: perE2 ? { step: C.E2, nOk: perE2.filter((v) => v.ok).length, pass: perE2.every((v) => v.ok),
        perSeed: perE2, failedConditions: [...new Set(perE2.flatMap((v) => v.failed))] } : null,
      failedConditions: [...new Set((useIcn ? perIcn : per).flatMap((v) => v.failed))] },
    t4_scaling: { pass: c4, passAllConditions: c4all, passLoose: c4loose, perN: scPer,
      judgedOn: '示強量のみ(配位数・角度・配位分布)— 連結成分の個数/最大成分は n で割っても示強にならないため',
      failedConditions: Object.fromEntries(Object.entries(scPer)
        .map(([n, a]) => [n, [...new Set(a.flatMap((v) => v.failed))]])),
      failedIntensiveConditions: Object.fromEntries(Object.entries(scPer)
        .map(([n, a]) => [n, [...new Set(a.flatMap((v) => v.failedIntensive))]])) },
    t5_perturbRecovery: { pass: c5, source: ppid, primaryKey: PK,
      chosenKick: chosen ? chosen.key : null, perSeed: perKick, brokeAndRecoveredLedger: ledger },
    t6_timeWindow: { pass: c6, riseMedian: TW.riseStats.median, stabMedian: TW.stabStats.median,
      stabWithinHalfE: TW.stabMedianWithinHalfE, tailDriftPrimary: TW.tailDriftPrimary },
  };
  // 統括裁定: E3 昇格は E2(閉鎖系)が前提。♻️ は外部駆動(床壁の温度スケジュール)なので
  // 試験を通っても E1 のまま(頑健性は説明文・PHYSICS の注記で表現する)
  const allPass = c3 && c4 && c5 && c6;
  verdict[pid].tagAfter = (C.tag0 === 'E2' && allPass) ? 'E3' : C.tag0;
  verdict[pid].promote = verdict[pid].tagAfter !== C.tag0;
  verdict[pid].reason = C.tag0 === 'E1'
    ? '外部駆動(床壁の温度スケジュール)= 閉鎖系ではないので E3 の前提を満たさない。試験結果は頑健性の注記として記録する(統括裁定1)'
    : allPass ? '③〜⑥ の全試験を通過(①②は既存カバー)' :
      '未通過: ' + [!c3 && ('③多seed' + (sep.noOverlap ? '(対照分離は通過・固定seed窓に収まらない seed あり)' : '(対照と重なる)')),
        !c4 && '④スケーリング', !c5 && '⑤摂動回復', !c6 && '⑥時間窓'].filter(Boolean).join('・');
}
out.verdict = verdict;
out.verdict.elapsedSec = +((Date.now() - t00) / 1000).toFixed(1);

console.log('\n=== 判定(E水準)===');
for (const pid of ['emergent', 'emergent2', 'chain2', 'chaincycle']) {
  const v = verdict[pid];
  console.log(`${v.emoji}${pid}: ${v.tagBefore} → ${v.tagAfter}${v.promote ? ' 【昇格】' : ''}`);
  const T3 = v.t3_multiSeed16;
  const n3 = T3.judgedOn.startsWith('③′') ? T3.nOkIcNoise : T3.nOk;
  console.log(`   ①${v.t1_knockout.pass ? '通過' : '未通過'} ②既存参照 ` +
    `③${T3.pass ? '通過' : '未通過'}(窓 ${n3}/${SEEDS16.length}・対照分離 ${T3.passSeparation ? '○' : '×'})[${T3.judgedOn}] ` +
    `④${v.t4_scaling.pass ? '通過' : v.t4_scaling.passLoose ? '部分通過(各n 3seed中2以上)' : '未通過'} ` +
    `⑤${v.t5_perturbRecovery.pass ? `通過(${v.t5_perturbRecovery.chosenKick}→${v.t5_perturbRecovery.primaryKey})` : '未通過'} ` +
    `⑥${v.t6_timeWindow.pass ? '通過' : '未通過'}  — ${v.reason}`);
  const SP = T3.separation;
  console.log(`     ③a 対照との分離[${SP.label}]: 本則 ${SP.main ? SP.main.min + '〜' + SP.main.max : '—'}` +
    ` vs 対照 ${SP.control ? SP.control.min + '〜' + SP.control.max : '—'} → ` +
    `${SP.noOverlap ? `重なりなし(余裕${SP.margin}倍)` : '**重なる**'}`);
  if (T3.atE2) console.log(`     ③@${T3.atE2.step}步(倍の焼き鈍し): ${T3.atE2.nOk}/${SEEDS16.length} ` +
    (T3.atE2.failedConditions.length ? `落ちた条件 ${T3.atE2.failedConditions.join(' / ')}` : ''));
  if (!T3.passWindow) console.log(`     ③b 固定seed窓に収まらない条件: ${T3.failedConditions.join(' / ')}`);
  if (!v.t4_scaling.pass || !v.t4_scaling.passAllConditions) console.log(`     ④ 落ちた条件(全条件 / 示強量のみ): ` +
    Object.entries(v.t4_scaling.failedConditions).filter(([, a]) => a.length).map(([n, a]) => `${n}[${a.join('・')}]`).join(' ') +
    ' || ' + (Object.entries(v.t4_scaling.failedIntensiveConditions).filter(([, a]) => a.length)
      .map(([n, a]) => `${n}[${a.join('・')}]`).join(' ') || '示強量は全n通過'));
  if (!v.t5_perturbRecovery.pass) console.log(`     ⑤ 主役=${v.t5_perturbRecovery.primaryKey} / 選ばれた摂動=${v.t5_perturbRecovery.chosenKick} / ` +
    JSON.stringify(v.t5_perturbRecovery.perSeed));
  if (!v.t6_timeWindow.pass) console.log(`     ⑥ 飽和中央${v.t6_timeWindow.stabMedian}(判定步の半分以内=${v.t6_timeWindow.stabWithinHalfE}) 延長ずれ${v.t6_timeWindow.tailDriftPrimary}`);
}

// 生データ(全 run の秩序変数の時系列)— 本ハーネスが全数の正本なので、QA 縮約版の再較正や
// 後便の読み直しができるよう素の系列をそのまま残す
out.raw = {};
for (const id of Object.keys(results).sort()) {
  const r = results[id];
  out.raw[id] = { pid: r.pid, seed: r.seed, n: r.n, ms: r.ms, res: r.res,
    nan: r.nan, clampA: r.clampA, ovf: r.ovf, world: r.world, snaps: r.snaps,
    kick: r.kick ? { at: r.kick.at, mode: r.kick.mode, amp: r.kick.amp,
      sigma: r.kick.sigma, Tbefore: r.kick.Tbefore, Tafter: r.kick.Tafter, before: r.kick.before } : null };
}
fs.writeFileSync(path.join(OUT_DIR, 'exp-4-87.json'), JSON.stringify(out, null, 1));
console.log(`\nsaved tests/out/exp-4-87.json  (${out.verdict.elapsedSec}s / ${tasks.length} タスク / 並列${JOBS})`);
