// 第155便 exp-coreshell-theory.mjs — コア外殻理論便(振幅寄与込み予測式の定式化と回顧的検証)
// ============================================================================================
// 位置づけ: 第135便 tests/exp-coreshell.mjs → 第139便 tests/exp-coreshell2.mjs →
//   第152便 tests/exp-coreshell3.mjs → 第154便 tests/exp-coreshell4.mjs の続き。
//   第154便の YW3(窓なし・記述)で「予測式 q*_eff=(3/2)(1+R/r) は**傾きの釣り合いのみ**を述べる式で、
//   同率縮小に伴う**振幅低下**の寄与を含まない」ことが分離された(第154便 limits.amplitudeCaveat)。
//   本便はその欠けている寄与を閉形式で定式化し、**既存データのみ**で回顧的に検証する。
//
// ★ 本便は解析専用である ★
//   - シミュレーションを一切実行しない(ブラウザを起動しない・エンジンを build しない・積分しない)。
//   - 入力は tests/out/coreshell4-results.json と tests/out/coreshell3-results.json の**既存実測だけ**で、
//     どちらの JSON も 1 bit も書き換えない(読み取り専用。sha256 を本 JSON の provenance に記録する)。
//   - 出力の数値はすべて本スクリプトの計算結果である(手計算値・記憶値は一切書かない)。
//
// ★ 本便は「回顧的(retrospective)」である ★
//   予測式は**対象アームの実測が既に存在する状態で**書かれた。したがって本便の照合は
//   事前登録された hold-out ではなく、**回顧的な当てはまりの点検**である。窓(PASS/FAIL 判定)は
//   一切置かない。既に発行済みの窓(第152便 XW1〜XW4・第154便 YW1〜YW4)の付け替え・再判定も
//   一切しない — 第154便 YW1 の FAIL は FAIL のままである。
//   参考照合値 0.15(第152便・第154便が窓の許容幅に使った数値)に対する内外は**記述として**書くが、
//   これは窓ではなく、本便のどの判定にも使っていない。
//
// ============================== 導出(本スクリプトの実装が正) ==============================
// (T0) 条件式
//   保持喪失を「外殻位置 r での引きずり量 Ω_drag(r;q) が臨界値 Ω_crit を下回る」ことと置く。
//   Ω_drag は核 x<1 のべき x^q の和なので q について単調減少である。したがって保持喪失の中点 q₅₀ は
//        Ω_drag(r; q₅₀) = Ω_crit                                              … (T1)
//   の唯一解として定まる。
//
// (T2) 単一項近似
//   Ω_drag = A·x^q(x = R_eff/(R_eff+r) < 1)と置くと (T1) は A·x^{q₅₀} = Ω_crit。対数をとって
//        q₅₀ = ln(Ω_crit/A) / ln x  =  ln(A/Ω_crit) / ln(1/x)                 … (T2)
//   分子 L ≡ ln(A/Ω_crit) は「振幅の動作域(dynamic range)」であり、**振幅そのものが指数を決める**。
//
// (T3) アンカー式(自由パラメータゼロ)
//   基準アームで (T2) を書くと ln(Ω_crit/A_ref) = q₅₀_ref · ln x_ref。Ω_crit と振幅 A が構成間で共通なら
//        q₅₀' = q₅₀_ref · ln x_ref / ln x_var                                  … (T3)
//   未知定数 Ω_crit・A は基準アームの**実測 q₅₀ ただ1つ**で消去される(較正自由度ではない — 下記 §分類)。
//
// (T4) 振幅寄与込みの一般形
//   振幅が構成間で変わる場合(A_ref ≠ A_var)は Ω_crit だけを消去して
//        q₅₀' = [ q₅₀_ref·ln x_ref + ln(A_ref/A_var) ] / ln x_var              … (T4)
//   これが本便の主題である。A_ref = A_var のとき (T4) は (T3) に一致する。
//
// (T5) 2項複合(エンジン実装の関数形をそのまま使う)
//   ⚫bhCore の外殻位置に届く引きずりは、基底スピン項(核 R)とコア差動項(核 Rc)の和である。
//   tests/exp-coreshell4.mjs の profileOf(= index.html の A8 コア差動+基底スピン項の転記)から:
//        Ω_drag(r; R,Rc,s,q) = s·(R/(R+r))^q + f·(Ω_c − s)·(Rc/(Rc+r))^q       … (T5)
//        (s = 殻スピン・f = コア質量比 coreMassFrac・Ω_c = コア角速度)
//   (T1) を (T5) で解く。閉形式にならないので**決定論的な二分法**(区間・反復回数を固定)で解く。
//   エンジンが実際に掛ける重み係数 w/(D₀+ΣW) は q に依らず、⚫ の全アームで初期配置・質量・r が
//   一致する(第154便の位置指紋一致・プロファイルの wFrac0 一致で実測確認済み)ので、(T1) の両辺で
//   相殺する。したがってアンカーは基準アームの実測 q₅₀ ただ1つで足りる。
//
// (T6)(T7) 旧式 q*_eff=(3/2)(1+R/r) との関係
//   x = R/(R+r) と書くと 1−x = r/(R+r) なので
//        q*_old = (3/2)(1 + R/r) = (3/2)/(1−x)                                  … (T6)
//   u ≡ 1−x として −ln x = u + u²/2 + u³/3 + … だから (T2) は
//        q₅₀ = L/(u + u²/2 + u³/3 + …) = (L/u)·(1 − u/2 − u²/12 + O(u³))       … (T7)
//   すなわち **① 近接極限 u→0(r ≪ R_eff)で両者はともに 1/u で発散し、② 振幅の動作域 L が 3/2 に
//   等しいときに限りその主要項が一致する**。一般には比が
//        q₅₀ / q*_old = (2L/3)·(1 − u/2 − u²/12 + O(u³))                        … (T8)
//   旧式は「Ω_drag の局所対数傾き −q·r/(R+r) を Ω_kepler の −3/2(第135便が同定した遠方漸近の
//   臨界指数)に釣り合わせた」式で、x^q の**水準(振幅)**を一切見ない。(T2)〜(T5) は水準の
//   釣り合いを直接書く式であり、第154便が「予測式に含まれていない」と名指しした寄与がここに入る。
//
// (T9) qLock の q* 式との構造的類似(**モデル内の統一構造の記述にとどめる**)
//   qLock(第123便・第141便)の q* = 3 + ln X / ln((R+a)/R) と (T2) は、どちらも
//        q* = q_∞ + ln(振幅比) / ln((R+r)/R)
//   という同じ**対数比構造**をもつ(qLock は遠方漸近 r⁻³ に対する規約なので q_∞=3、本便は
//   臨界値を r 固定の定数 Ω_crit と置いたので q_∞=0)。これは **DFM モデル内部で式の形が揃うという
//   記述**であり、新しい物理主張でも実在天体についての主張でもない。
//
// 実行:
//   node tests/exp-coreshell-theory.mjs                  … 既定(tests/out/coreshell-theory-results.json)
//   CST_OUT=/path/x.json node tests/exp-coreshell-theory.mjs   … 出力先の変更(決定性の2回実行比較に使う)
//   CST_DET_REF=/path/run1.json node tests/...           … 2回目実行で1回目の JSON と正準化 SHA を照合
// 出力: tests/out/coreshell-theory-results.json
// ============================================================================================
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { buildManifest, NOT_APPLICABLE } from './manifest.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const TARGET = process.env.QA_TARGET || 'index.html';
const OUT_DIR = path.join(ROOT, 'tests', 'out');
fs.mkdirSync(OUT_DIR, { recursive: true });
const OUT_PATH = process.env.CST_OUT ? path.resolve(process.env.CST_OUT)
  : path.join(OUT_DIR, 'coreshell-theory-results.json');

const sha256 = (buf) => crypto.createHash('sha256').update(buf).digest('hex');
const log = (...a) => console.log(...a);
const fmt = (v, d = 4) => (v === null || v === undefined || Number.isNaN(v)) ? '—' : Number(v).toFixed(d);

// ---------------------------- 入力(既存実測 — 読み取り専用)----------------------------------
const INPUT_SPECS = [
  { key: 'coreshell4', file: 'coreshell4-results.json',
    role: '第154便の実測正本(⚫5アーム+🐚×1/×2 を全アーム同一の11点格子で実測)— 本便の主入力' },
  { key: 'coreshell3', file: 'coreshell3-results.json',
    role: '第152便の実測正本(格子非対称の版)— 補足照合(参考)と来歴の突き合わせに使う' },
];
const inputs = {};
const provenanceInputs = [];
for (const spec of INPUT_SPECS) {
  const p = path.join(OUT_DIR, spec.file);
  const bytes = fs.readFileSync(p);
  const j = JSON.parse(bytes.toString('utf8'));
  inputs[spec.key] = j;
  provenanceInputs.push({
    path: `tests/out/${spec.file}`, sha256: sha256(bytes), bytes: bytes.length,
    exp: j.meta ? j.meta.exp : null, wave: j.meta ? j.meta.wave : null,
    targetSha256: j.manifest ? j.manifest.provenance.target.sha256 : null,
    appVersion: j.manifest ? j.manifest.provenance.target.appVersion : null,
    gitCommit: j.manifest ? j.manifest.provenance.git.commit : null,
    role: spec.role, mutated: false,
  });
}
const CS4 = inputs.coreshell4, CS3 = inputs.coreshell3;

// 本便が試験対象として記録する index.html が、入力実測を出した実体と同一かを照合する
// (本ハーネスは index.html を実行しない。同一なら「入力実測の対象と同じ実体を指している」証跡になる)
const TARGET_SHA_NOW = sha256(fs.readFileSync(path.join(ROOT, TARGET)));
const targetConsistency = {
  target: TARGET, sha256Now: TARGET_SHA_NOW,
  inputs: provenanceInputs.map(e => ({ path: e.path, targetSha256: e.targetSha256,
    sameAsNow: e.targetSha256 === TARGET_SHA_NOW })),
  allSame: provenanceInputs.every(e => e.targetSha256 === TARGET_SHA_NOW),
  note: '本ハーネスは index.html を実行しない(解析専用)。ここで照合しているのは、' +
    '入力 JSON の実測を出した対象 HTML の SHA-256 が、いま作業ツリーにある index.html と一致するか' +
    'だけである(一致なら入力実測はこの実体に対する測定である)',
};

// ------------------------- 決定論的な数値解法(乱数・初期値依存なし)---------------------------
// 二分法。区間・反復回数を固定するので、同じ入力なら常に同じ出力(丸めまで再現する)。
const SOLVER = { bracket: [0.05, 8.0], iterations: 200,
  method: '二分法(区間・反復回数を固定した決定論的解法。反復停止条件に時間・乱数を使わない)' };
function solveMonotoneDecreasing(fn, target) {
  let lo = SOLVER.bracket[0], hi = SOLVER.bracket[1];
  const fLo = fn(lo), fHi = fn(hi);
  if (!(fLo >= target && fHi <= target)) {
    return { q: null, bracketed: false, fAtLo: fLo, fAtHi: fHi,
      note: '解が固定区間 [' + SOLVER.bracket.join(',') + '] の外(値を捏造せず null を返す)' };
  }
  for (let i = 0; i < SOLVER.iterations; i++) {
    const m = (lo + hi) / 2;
    if (fn(m) > target) lo = m; else hi = m;
  }
  const q = (lo + hi) / 2;
  return { q, bracketed: true, residual: fn(q) - target, fAtLo: fLo, fAtHi: fHi };
}

// =============================== ⚫bhCore の引きずり関数形 ====================================
// tests/exp-coreshell4.mjs profileOf からの**正確な転記**:
//   omBaseAnalytic = s0 * (R0/(R0+r))^q            … 基底スピン項(核 R)
//   omCoreAnalytic = mf * (Omc - s0) * (Rc/(Rc+r))^q  … コア差動項(核 Rc)
//   omDragAnalytic = omBaseAnalytic + omCoreAnalytic
const omegaDragBH = (p, r, q) =>
  p.s * Math.pow(p.R / (p.R + r), q) + p.f * (p.Omc - p.s) * Math.pow(p.Rc / (p.Rc + r), q);
const kernelBase = (p, r) => p.R / (p.R + r);        // x_b
const kernelCore = (p, r) => p.Rc / (p.Rc + r);      // x_c
const ampBase = (p) => p.s;                          // A_b
const ampCore = (p) => p.f * (p.Omc - p.s);          // A_c
const qEffLegacy = (R, r) => 1.5 * (1 + R / r);      // 旧式(第139便 post-hoc → 第152便 XW2 → 第154便 YW1)

// (T3) 単一項アンカー式 / (T4) 振幅寄与込み一般形
const predSingleTerm = (q50Ref, xRef, xVar) => q50Ref * Math.log(xRef) / Math.log(xVar);
const predSingleTermAmplitude = (q50Ref, xRef, aRef, xVar, aVar) =>
  (q50Ref * Math.log(xRef) + Math.log(aRef / aVar)) / Math.log(xVar);

// ---- ⚫ のアーム定義(構成パラメータは入力 JSON の実測プロファイルから転記)-------------------
const BH_ARM_KEYS = ['base', 'prop_R10Rc5', 'prop_R5Rc2p5', 'ronly_R10', 'ronly_R5'];
const BH_ANCHOR_KEY = 'base';
const bhParamsOf = (key) => {
  const a = CS4.raw.bh.profiles[`${key}_q1.50`].params;
  const b = CS4.raw.bh.profiles[`${key}_q2.00`].params;
  return { R: a.R0, Rc: a.Rc, s: a.s0, f: a.coreMassFrac, Omc: a.coreOmega,
    spinSameAcrossProfileQs: a.s0 === b.s0,   // s は q に依らない(2つのプロファイルで bit 一致)
    coreMassFracSame: a.coreMassFrac === b.coreMassFrac, coreOmegaSame: a.coreOmega === b.coreOmega };
};
const bhQ50Of = (key) => CS4.q50.summary[key].q50;
const bhLabelOf = (key) => CS4.q50.summary[key].label;

// 正準の r(第152便・第154便と同一定義): 恒星帯(外殻200体)の初期平均半径。全アームで同一。
const R_STAR = CS4.raw.bh.geom[BH_ANCHOR_KEY].star.meanR;
const R_GAS = CS4.raw.bh.geom[BH_ANCHOR_KEY].gas.meanR;
const geomIdentical = Object.values(CS4.raw.bh.geom).every(g =>
  g.positionFingerprint === CS4.raw.bh.geom[BH_ANCHOR_KEY].positionFingerprint &&
  g.star.meanR === R_STAR && g.gas.meanR === R_GAS && g.m0 === CS4.raw.bh.geom[BH_ANCHOR_KEY].m0);
// 重み係数が構成間で同一であること(= (T1) の両辺で相殺する根拠)の実測確認
const wFracAtBin = Object.fromEntries(Object.entries(CS4.raw.bh.profiles).map(([k, pr]) => {
  let e = null;
  for (const row of pr.prof) if (e === null || Math.abs(row.r - R_STAR) < Math.abs(e.r - R_STAR)) e = row;
  return [k, { rBin: e.rBin, r: e.r, wFrac0: e.wFrac0 }];
}));
const wFracValues = Object.values(wFracAtBin).map(e => e.wFrac0);
const wFracSpread = Math.max(...wFracValues) - Math.min(...wFracValues);

// ---- ⚫ 予測の組み立て(基準アーム = base の実測 q₅₀ のみをアンカーに使う)--------------------
function buildBhPredictions(r, q50Of, label) {
  const ref = bhParamsOf(BH_ANCHOR_KEY);
  const q50Ref = q50Of(BH_ANCHOR_KEY);
  if (q50Ref === null || q50Ref === undefined) return null;
  const xcRef = kernelCore(ref, r), xbRef = kernelBase(ref, r);
  const omegaCrit = omegaDragBH(ref, r, q50Ref);
  const rows = [];
  for (const key of BH_ARM_KEYS) {
    const p = bhParamsOf(key);
    const meas = q50Of(key);
    const xc = kernelCore(p, r), xb = kernelBase(p, r);
    const legacy = q50Ref + (qEffLegacy(p.R, r) - qEffLegacy(ref.R, r));
    const single = predSingleTerm(q50Ref, xcRef, xc);
    const singleAmp = predSingleTermAmplitude(q50Ref, xcRef, ampCore(ref), xc, ampCore(p));
    const two = solveMonotoneDecreasing((q) => omegaDragBH(p, r, q), omegaCrit);
    const singleBaseKernel = predSingleTerm(q50Ref, xbRef, xb);
    const d = (v) => (v === null || meas === null || meas === undefined) ? null : Math.abs(v - meas);
    rows.push({
      armKey: key, label: bhLabelOf(key), group: CS4.q50.summary[key].group,
      isAnchor: key === BH_ANCHOR_KEY,
      geometry: { R: p.R, Rc: p.Rc, r, xBase: xb, xCore: xc, oneMinusXCore: 1 - xc },
      amplitudes: { base: ampBase(p), core: ampCore(p), coreOverBaseAtQ50:
        meas === null ? null : (p.f * (p.Omc - p.s) * Math.pow(xc, meas)) / (p.s * Math.pow(xb, meas)) },
      measuredQ50: meas,
      predicted: { legacy, singleTerm: single, singleTermAmplitude: singleAmp,
        twoTerm: two.q, singleTermBaseKernel: singleBaseKernel },
      absDiff: { legacy: d(legacy), singleTerm: d(single), singleTermAmplitude: d(singleAmp),
        twoTerm: d(two.q), singleTermBaseKernel: d(singleBaseKernel) },
      twoTermSolve: { bracketed: two.bracketed, residualOmega: two.residual === undefined ? null : two.residual,
        omegaDragAtPrediction: two.q === null ? null : omegaDragBH(p, r, two.q) },
    });
  }
  return { label, r, anchorArm: BH_ANCHOR_KEY, anchorQ50: q50Ref,
    anchorNote: 'アンカーは基準アームの**実測 q₅₀ の転記**である(本ハーネスが当てはめた値ではない)。' +
      '未知の臨界値 Ω_crit を消去するための1点の代入であり、残差を最小化する自由度ではない',
    omegaCrit, refParams: ref, kernels: { xBaseRef: xbRef, xCoreRef: xcRef }, arms: rows };
}

// ===================================== 🐚nebulaShell =========================================
// tests/exp-coreshell4.mjs nebDragProbe からの**正確な転記**(エンベロープ粒子 i について):
//   Ω_drag,i(q) = [ Σ_j w_ij ( s_j·(R_j/(R_j+d_ij))^q
//                    + [コア持ち] f_j(Ω_cj − s_j)·(Rc_j/(Rc_j+d_ij))^q ) の接線成分 ] / (D₀ + Σ_j w_ij)
//   核 x_ij は粒子対ごとに異なるので、⚫ のような閉じた2項形にならない。そこで**平均場の単一項**
//     Ω̄_drag(q) = C · x̄^q,  x̄ = R̄/(R̄ + r̄)
//   を置く(R̄ = クランプ54体の粒子半径平均 RbarClump・r̄ = エンベロープ平均半径 envMeanR。
//    第152便 XW2・第154便 YW2 の R/r 対応と同一)。C は q に依らないが、エンベロープ半径を変えると
//   重み w_ij と正規化 D₀+ΣW が変わるので**構成間で等しくない** — ここが 🐚 における「振幅寄与」である。
//   C は引きずりプローブの実測から C = Ω̄_drag(q_probe) / x̄^{q_probe} と**転記**できる。
const nebMeanDrag = (probe) => probe.rows.reduce((a, e) => a + e.omDragAnalytic, 0) / probe.rows.length;
const nebMedianDrag = (probe) => {
  const s = probe.rows.map(e => e.omDragAnalytic).sort((a, b) => a - b);
  return s[Math.floor(s.length / 2)];
};
const nebMeanDragOverKepler = (probe) =>
  probe.rows.reduce((a, e) => a + e.dragOverKepler, 0) / probe.rows.length;

function nebConfig(probe, kernelRadius, dragStat) {
  const rBar = probe.envMeanR;
  const x = kernelRadius / (kernelRadius + rBar);
  const om = dragStat(probe);
  return { envScale: probe.envScale, RbarClump: probe.RbarClump, kernelRadius, rBar, x,
    qProbe: probe.q, omegaDragAtProbeQ: om, amplitudeC: om / Math.pow(x, probe.q), nEnv: probe.nEnv };
}

function buildNebPrediction(probeRef, probeVar, q50Ref, q50Var, kernelRadius, dragStat, label) {
  const cRef = nebConfig(probeRef, kernelRadius, dragStat);
  const cVar = nebConfig(probeVar, kernelRadius, dragStat);
  const legacy = q50Ref + (qEffLegacy(probeVar.RbarClump, probeVar.envMeanR)
    - qEffLegacy(probeRef.RbarClump, probeRef.envMeanR));
  const single = predSingleTerm(q50Ref, cRef.x, cVar.x);
  const singleAmp = predSingleTermAmplitude(q50Ref, cRef.x, cRef.amplitudeC, cVar.x, cVar.amplitudeC);
  const d = (v) => (v === null || q50Var === null) ? null : Math.abs(v - q50Var);
  return { label, kernelRadius, dragStatistic: dragStat.name || 'stat',
    reference: cRef, variant: cVar,
    amplitudeRatio: cVar.amplitudeC / cRef.amplitudeC,
    omegaCrit: cRef.amplitudeC * Math.pow(cRef.x, q50Ref),
    anchorQ50: q50Ref, measuredQ50: q50Var,
    predicted: { legacy, singleTerm: single, singleTermAmplitude: singleAmp, twoTerm: null },
    absDiff: { legacy: d(legacy), singleTerm: d(single), singleTermAmplitude: d(singleAmp), twoTerm: null } };
}

const NEB_TWO_TERM_NOTE =
  '🐚 の2項複合は**本便の入力 JSON からは評価できない**。エンジンの引きずりは粒子対ごとの距離 d_ij に' +
  '依存する多項和で、対ごとの d_ij・各クランプ粒子のスピン s_j・コア質量比 f_j は入力 JSON に記録されて' +
  'いない。引きずりプローブは 1 つの q(q_probe)でしか回っておらず、記録済みの集約量から2つの振幅を' +
  '分離することもできない(未知2個に対し方程式1本)。分離には **q を2点以上に振ったプローブの再実測**が' +
  '必要で、再実測を行わない本便(回顧的検証)の範囲外である。代わりに、核の取り方の違い' +
  '(R̄ と クランプのコア半径 Rc)を感度として両方収載し、真の多スケール複合がその間に位置することを示す';

// ================================ 帯別 q₅₀ の再当てはめ(感度)================================
// 第152便・第154便と**同一の当てはめ関数**(loss(q) = B + (A−B)/(1+exp((q−q₅₀)/w))・同一格子・
// 同一 INCONCLUSIVE 規則)を、⚫ の損失率の**帯別内訳**(ガス帯 r≈81.77 / 恒星帯 r≈178.26)へ適用する。
// 主指標(帯を合算した損失率での q₅₀)は入力 JSON の値をそのまま使い、本再当てはめは感度専用である。
const Q50_GRID = { qLo: 0.30, qHi: 3.00, qStep: 0.0025, wLo: 0.004, wHi: 0.80, wN: 80 };
const W_GRID = (() => { const a = []; for (let i = 0; i < Q50_GRID.wN; i++)
  a.push(Q50_GRID.wLo * Math.pow(Q50_GRID.wHi / Q50_GRID.wLo, i / (Q50_GRID.wN - 1))); return a; })();
function fitLogisticQ50(rows) {
  const xs = rows.map(r => r.q), ys = rows.map(r => r.loss), n = xs.length;
  const qMin = Math.min(...xs), qMax = Math.max(...xs);
  if (n < 4) return { q50: null, result: 'INCONCLUSIVE', note: '点数不足(4点未満)', nPoints: n };
  const sig = (z) => (z > 40 ? 0 : z < -40 ? 1 : 1 / (1 + Math.exp(z)));
  let best = null;
  const nq = Math.round((Q50_GRID.qHi - Q50_GRID.qLo) / Q50_GRID.qStep);
  for (let qi = 0; qi <= nq; qi++) {
    const q50 = Q50_GRID.qLo + qi * Q50_GRID.qStep;
    for (const w of W_GRID) {
      let s11 = 0, s12 = 0, s22 = 0, b1 = 0, b2 = 0;
      const S = new Array(n);
      for (let k = 0; k < n; k++) {
        const s = sig((xs[k] - q50) / w), t = 1 - s;
        S[k] = s;
        s11 += s * s; s12 += s * t; s22 += t * t; b1 += s * ys[k]; b2 += t * ys[k];
      }
      const det = s11 * s22 - s12 * s12;
      if (!(Math.abs(det) > 1e-13)) continue;
      let A = (b1 * s22 - b2 * s12) / det;
      let B = (b2 * s11 - b1 * s12) / det;
      const aOut = (A < 0 || A > 1), bOut = (B < 0 || B > 1);
      if (aOut || bOut) {
        A = Math.min(1, Math.max(0, A)); B = Math.min(1, Math.max(0, B));
        if (aOut && !bOut && s22 > 1e-13) B = (b2 - s12 * A) / s22;
        else if (bOut && !aOut && s11 > 1e-13) A = (b1 - s12 * B) / s11;
        A = Math.min(1, Math.max(0, A)); B = Math.min(1, Math.max(0, B));
      }
      let sse = 0;
      for (let k = 0; k < n; k++) { const e = (B + (A - B) * S[k]) - ys[k]; sse += e * e; }
      if (best === null || sse < best.sse - 1e-15) best = { q50, w, A, B, sse };
    }
  }
  if (!best) return { q50: null, result: 'INCONCLUSIVE', note: '当てはめ不能', nPoints: n };
  const amp = best.A - best.B;
  const inRange = (best.q50 >= qMin - 0.25 && best.q50 <= qMax + 0.25);
  const ok = (amp >= 0.20) && inRange;
  return { q50: ok ? best.q50 : null, q50Raw: best.q50, width: best.w,
    plateauLowQ: best.A, plateauHighQ: best.B, amplitude: amp,
    sse: best.sse, rmse: Math.sqrt(best.sse / n), nPoints: n, qRange: [qMin, qMax],
    result: ok ? 'OK' : 'INCONCLUSIVE',
    model: 'loss(q) = B + (A − B)/(1 + exp((q − q50)/w))(第152便・第154便と同一)' };
}
const bandTable = (runs, pick) => Object.values(runs)
  .map(r => ({ q: r.cfg.q, loss: pick(r.final) })).sort((a, b) => a.q - b.q);
const lossGas = (f) => f.gas.escFrac + f.gas.fallFrac;
const lossStar = (f) => f.star.escFrac + f.star.fallFrac;
const lossAll = (f) => (f.gas.n * lossGas(f) + f.star.n * lossStar(f)) / (f.gas.n + f.star.n);

// ======================================== 組み立て ===========================================
const out = {
  meta: {
    exp: 'coreshell-theory', wave: 155, target: TARGET,
    kind: 'analysis-only / retrospective(解析専用・回顧的検証。シミュレーション再実行なし)',
    basedOn: '第154便 tests/exp-coreshell4.mjs(YW3 が分離した「振幅寄与が予測式に無い」問題)' +
      ' / 第152便 tests/exp-coreshell3.mjs / 第139便 exp-coreshell2 / 第135便 exp-coreshell(原型)',
    volatileFields: 'なし(本ペイロードは Date.now / Math.random 由来の値を一切含まない)。' +
      '実行日時・環境は manifest ブロックにのみ入り、再現照合では manifest を除外する',
  },
  scope: {
    retrospective: '**回顧的である**。予測式は対象アームの実測が既に存在する状態で書かれたので、' +
      '本便の照合は事前登録された hold-out ではなく、回顧的な当てはまりの点検である',
    noWindows: '**窓を一切置かない**。本 JSON に PASS/FAIL は存在しない',
    noReassignment: '既発行の窓(第152便 XW1〜XW4・第154便 YW1〜YW4)の付け替え・再判定は一切しない — ' +
      '第154便 YW1 の FAIL は FAIL のままである',
    inputsReadOnly: '入力 JSON(coreshell4-results.json・coreshell3-results.json)は 1 bit も書き換えない',
    noNewMeasurement: 'シミュレーションを実行しない(ブラウザ非起動・エンジン非 build・積分なし)。' +
      '追加実測はゼロである',
    notClaim: '実在天体についての主張ではない。すべて DFM 公理系内部の構成依存の実測と、その解析である',
  },
  provenance: { inputs: provenanceInputs, targetConsistency },
  derivation: {
    T1_condition: 'Ω_drag(r; q₅₀) = Ω_crit — 保持喪失を「外殻位置 r での引きずり量が臨界値を下回る」' +
      'ことと置く。Ω_drag は核 x<1 のべき x^q の和なので q について単調減少であり、解は一意',
    T2_singleTerm: 'Ω_drag = A·x^q(x = R_eff/(R_eff+r) < 1)なら q₅₀ = ln(Ω_crit/A)/ln x = ' +
      'ln(A/Ω_crit)/ln(1/x)。分子 L ≡ ln(A/Ω_crit) は振幅の動作域であり、**振幅そのものが指数を決める**',
    T3_anchor: 'q₅₀\' = q₅₀_ref · ln(x_ref)/ln(x_var) — 基準アームの実測 q₅₀ で Ω_crit/A を消去した形。' +
      '**自由パラメータゼロ**(A と Ω_crit は個別に決めない)',
    T4_amplitude: 'q₅₀\' = [ q₅₀_ref·ln(x_ref) + ln(A_ref/A_var) ] / ln(x_var) — 振幅が構成間で変わる' +
      '場合の一般形。**本便の主題**。A_ref = A_var のとき (T3) に一致する',
    T5_twoTerm: 'Ω_drag(r;R,Rc,s,q) = s·(R/(R+r))^q + f·(Ω_c−s)·(Rc/(Rc+r))^q — ⚫ のエンジン実装' +
      '(index.html の基底スピン項+A8 コア差動項)を tests/exp-coreshell4.mjs profileOf から転記した形。' +
      '予測は「Ω_drag_var(q₅₀\') = Ω_drag_ref(q₅₀_ref)」の数値解(決定論的二分法)で、' +
      'アンカーは同じく基準アームの実測 q₅₀ ただ1つ',
    weightCancellation: 'エンジンが実際に掛ける重み係数 w/(D₀+ΣW) は q に依らず、⚫ の全アームで' +
      '初期配置・質量・r が同一なので (T1) の両辺で相殺する(下記 checks.geometryIdentical / ' +
      'checks.wFracSpread が実測での確認)',
    T6_legacy: 'q*_old = (3/2)(1 + R/r) = (3/2)/(1−x)(x = R/(R+r) と書くと 1−x = r/(R+r))',
    T7_expansion: 'u ≡ 1−x として −ln x = u + u²/2 + u³/3 + … なので (T2) は ' +
      'q₅₀ = (L/u)(1 − u/2 − u²/12 + O(u³))。旧式は (3/2)/u',
    T8_relation: 'q₅₀ / q*_old = (2L/3)(1 − u/2 − u²/12 + O(u³))。すなわち **① 近接極限 u→0(r ≪ R_eff)' +
      'で両者はともに 1/u で発散し、② 振幅の動作域 L が 3/2 のときに限りその主要項が一致する**。' +
      '旧式は Ω_drag の局所対数傾き −q·r/(R+r) を Ω_kepler の −3/2(第135便が同定した遠方漸近の臨界指数)' +
      'に釣り合わせた式で、x^q の**水準(振幅)**を見ない。(T2)〜(T5) は水準の釣り合いを直接書く式であり、' +
      '第154便 limits.amplitudeCaveat が「予測式に含まれていない」と名指しした寄与がここに入る',
    T9_qlockAnalogy: 'qLock(第123便・第141便)の q* = 3 + ln X/ln((R+a)/R) と (T2) は、どちらも ' +
      'q* = q_∞ + ln(振幅比)/ln((R+r)/R) という同じ**対数比構造**をもつ(qLock は遠方漸近 r⁻³ に対する' +
      '規約なので q_∞=3、本便は臨界値を r 固定の定数 Ω_crit と置いたので q_∞=0)。' +
      '**これは DFM モデル内部で式の形が揃うという記述であり、新しい物理主張でも実在天体についての' +
      '主張でもない**',
    ReffChoiceBH: '⚫ の単一項近似では R_eff = **Rc**(コア差動項の核)を採る。理由: 第154便 YW3 の実測' +
      'core/base 引きずり比が正準 r 近傍で 10.2〜85.5 = コア差動項が一桁以上支配的だから。' +
      'R_eff = R(基底スピン項の核)を採った場合は sensitivity.bhKernelChoice に併記する',
    ReffChoiceNeb: '🐚 の単一項近似では R_eff = **R̄**(クランプ54体の粒子半径平均 RbarClump)を採る — ' +
      '第152便 XW2・第154便 YW2 の R 対応と同一。クランプのコア半径 Rc を核に採った場合は ' +
      'sensitivity.nebKernelChoice に併記する',
    solver: SOLVER,
  },
  checks: {
    geometryIdentical: geomIdentical,
    geometryIdenticalNote: '⚫ 全アームで位置指紋・恒星帯/ガス帯の初期平均半径・中心質量が一致する' +
      '(第154便の実測。初期配置は R・Rc に依存しない)。これが「r と重み係数が構成間で共通」の根拠',
    wFracAtCanonicalR: wFracAtBin, wFracSpread,
    wFracNote: '正準 r に最も近いプロファイル bin での w/(D₀+w) の構成間ばらつき。0 に近いほど、' +
      '重み係数が (T1) の両辺で相殺するという扱いが実測で裏づけられる',
    spinConstantAcrossProfileQs: Object.fromEntries(BH_ARM_KEYS.map(k =>
      [k, bhParamsOf(k).spinSameAcrossProfileQs])),
    spinNote: '殻スピン s は q に依らない(各アームの q=1.5 / q=2.0 プロファイルで bit 一致)ので、' +
      '(T5) の s をアームごとの単一値として扱ってよい',
    coreOverBaseFromInput: (() => {
      const vals = Object.values(CS4.yw3.dragDecompositionAtShell)
        .map(e => e.coreOverBase).filter(v => typeof v === 'number');
      return { n: vals.length, min: Math.min(...vals), max: Math.max(...vals),
        source: 'tests/out/coreshell4-results.json の yw3.dragDecompositionAtShell(第154便 YW3 の記述統計)' +
          'からの転記。⚫ の単一項近似で核に Rc(コア差動項)を採る根拠 = コア差動項が一桁以上支配的であること' };
    })(),
  },
};

// ---- ⚫ 主結果(正準 r = 恒星帯平均半径・主指標 q₅₀ = 帯合算の損失率)------------------------
out.bh = buildBhPredictions(R_STAR, bhQ50Of,
  '⚫bhCore — 正準 r(恒星帯の初期平均半径)・主指標 q₅₀(帯合算の損失率。第154便 q50.summary の転記)');
out.bh.canonicalR = '恒星帯(外殻200体)の初期平均半径(第152便・第154便 canonicalr と同一定義)';
out.bh.q50Source = 'tests/out/coreshell4-results.json の q50.summary(第154便が全アーム同一の11点格子で' +
  '当てはめた値の転記。本ハーネスは主指標の q₅₀ を当てはめ直さない)';

// ---- 🐚 主結果 -------------------------------------------------------------------------------
{
  const p1 = CS4.raw.neb.dragProbes.env1, p2 = CS4.raw.neb.dragProbes.env2;
  const q1 = CS4.q50.summary.neb_env1.q50, q2 = CS4.q50.summary.neb_env2.q50;
  out.neb = {
    label: '🐚nebulaShell — エンベロープ半径 ×1(アンカー)→ ×2(予測対象)',
    canonicalR: 'R̄ = クランプ54体の粒子半径の平均(RbarClump・第154便 引きずりプローブ実測)',
    canonicalr: 'エンベロープの平均半径(envMeanR・構成ごとに実測)',
    dragForm: 'Ω_drag,i(q) = [ Σ_j w_ij ( s_j(R_j/(R_j+d_ij))^q + [コア持ち] f_j(Ω_cj−s_j)(Rc_j/(Rc_j+d_ij))^q )' +
      ' の接線成分 ] / (D₀ + Σ_j w_ij) — tests/exp-coreshell4.mjs nebDragProbe からの転記',
    meanFieldNote: '平均場の単一項 Ω̄_drag(q) = C·x̄^q を置く。C は q に依らないが、エンベロープ半径を' +
      '変えると重み w_ij と正規化 D₀+ΣW が変わるので**構成間で等しくない** — ここが 🐚 における振幅寄与。' +
      'C は引きずりプローブの実測(q_probe での44粒子平均 Ω̄_drag)から C = Ω̄_drag(q_probe)/x̄^{q_probe} と転記する',
    twoTermNote: NEB_TWO_TERM_NOTE,
    labelStatistic: 'エンベロープ44粒子の omDragAnalytic の**平均**を Ω̄_drag に採る(中央値の場合は ' +
      'sensitivity.nebDragStatistic に併記)',
    primary: buildNebPrediction(p1, p2, q1, q2, p1.RbarClump, nebMeanDrag,
      '🐚 ×1 → ×2(核 = R̄・Ω̄_drag = 44粒子平均)'),
  };
}

// ---- 旧式 vs 単一項 vs 2項複合 の比較表(主結果の集約)----------------------------------------
out.comparisonTable = {
  note: '**窓ではない**。3種の予測(いずれも同じ基準アームの実測 q₅₀ 1点だけをアンカーにする)と' +
    '実測 q₅₀ の照合表である。legacy = 旧式 (3/2)(1+R/r) の差分予測(第152便 XW2・第154便 YW1 と同じ形)/ ' +
    'singleTerm = (T3) 単一項アンカー式 / singleTermAmplitude = (T4) 振幅寄与込み / twoTerm = (T5) 2項複合',
  rows: [],
};
for (const a of out.bh.arms) {
  if (a.isAnchor) continue;
  out.comparisonTable.rows.push({ sample: '⚫bhCore', arm: a.armKey, label: a.label,
    group: a.group, measuredQ50: a.measuredQ50,
    predicted: a.predicted, absDiff: a.absDiff });
}
{
  const n = out.neb.primary;
  out.comparisonTable.rows.push({ sample: '🐚nebulaShell', arm: 'neb_env2', label: n.label,
    group: 'nebulaEnvelope', measuredQ50: n.measuredQ50,
    predicted: n.predicted, absDiff: n.absDiff });
}
out.comparisonTable.summary = (() => {
  const keys = ['legacy', 'singleTerm', 'singleTermAmplitude', 'twoTerm'];
  const s = {};
  for (const k of keys) {
    const vals = out.comparisonTable.rows.map(r => r.absDiff[k]).filter(v => v !== null && v !== undefined);
    s[k] = vals.length ? { n: vals.length, max: Math.max(...vals),
      mean: vals.reduce((a, b) => a + b, 0) / vals.length } : { n: 0, max: null, mean: null };
  }
  return s;
})();

// ---- 旧式との関係(数値)-----------------------------------------------------------------------
out.legacyRelation = {
  formulas: { legacy: 'q*_old = (3/2)/(1−x)', new: 'q₅₀ = L/(−ln x),  L = ln(A/Ω_crit)',
    expansion: 'q₅₀ = (L/u)(1 − u/2 − u²/12 + O(u³)),  u = 1−x',
    ratio: 'q₅₀/q*_old = (2L/3)(1 − u/2 − u²/12 + O(u³))',
    agreementCondition: '主要項が一致するのは **u→0(近接極限 r ≪ R_eff)かつ L = 3/2** のときに限る' },
  perArm: out.bh.arms.map(a => {
    const x = a.geometry.xCore, u = 1 - x;
    const L = Math.log(a.amplitudes.core / out.bh.omegaCrit);
    const qNew = L / (-Math.log(x));
    const qOld = 1.5 / u;
    const lead = (L / u) * (1 - u / 2 - u * u / 12);
    return { armKey: a.armKey, xCore: x, u, L, LminusThreeHalves: L - 1.5,
      qFromT2: qNew, qLegacyClosedForm: qOld, ratioNewOverOld: qNew / qOld,
      leadingOrderApprox: lead, leadingOrderRelError: (lead - qNew) / qNew };
  }),
  qFromT2Note: 'qFromT2 は **単一項** (T2) の読みで、振幅に A_core だけを使う一方、Ω_crit は 2項複合 (T5) の' +
    '臨界水準である。したがってアンカーアームでも qFromT2 は実測 q₅₀ を厳密には再現しない — ' +
    'その差が基底スピン項の寄与分である(2項複合 (T5) はこの差を持たない)',
  expansionValidityNote: '(T7) の展開は u ≪ 1 でのみ収束が速い。実測構成の u ≈ 0.96 では ' +
    'leadingOrderRelError が示すとおり主要3項では足りない — (T7)(T8) は**極限での関係を述べる式**であって、' +
    '実測構成での近似計算式ではない',
  reading: '実測構成では u ≈ 0.96(= 近接極限から最も遠い側)・L ≈ 5.4(≠ 3/2)であり、両式は' +
    '**まったく別の領域にいる**。第152便・第154便で旧式の差分予測が桁として近く見えたのは、' +
    '差分をとると両式の主要な r 依存が部分的に相殺したためで、水準そのものが一致していたからではない' +
    '(この読みは post-hoc の解釈である)',
};

// ---- 感度(いずれも判定に使わない・記述のみ)---------------------------------------------------
out.sensitivity = { note: '**すべて記述のみ**。主結果の頑健さを見るための併記であり、窓も判定もない' };

// ① ⚫ 単一項の核の取り方(Rc 対 R)
out.sensitivity.bhKernelChoice = {
  question: '⚫ の単一項近似で核を Rc(コア差動項)に採るか R(基底スピン項)に採るか',
  rows: out.bh.arms.filter(a => !a.isAnchor).map(a => ({ armKey: a.armKey,
    measuredQ50: a.measuredQ50,
    kernelRc: { predicted: a.predicted.singleTerm, absDiff: a.absDiff.singleTerm },
    kernelR: { predicted: a.predicted.singleTermBaseKernel, absDiff: a.absDiff.singleTermBaseKernel } })),
  reading: 'コア差動項の核 Rc を採る側が一貫して小さい残差になる。第154便 YW3 の core/base 比' +
    '(コア差動項が一桁以上支配的)と整合する',
};

// ② ⚫ 帯別(ガス帯 r≈81.8 / 恒星帯 r≈178.3)— 同一の当てはめ関数を帯別損失率へ適用し直す
{
  const perBand = {};
  for (const key of BH_ARM_KEYS) {
    const runs = CS4.raw.bh.arms[key].runs;
    perBand[key] = {
      all: fitLogisticQ50(bandTable(runs, lossAll)),
      gas: fitLogisticQ50(bandTable(runs, lossGas)),
      star: fitLogisticQ50(bandTable(runs, lossStar)),
    };
  }
  const q50Band = (band) => (key) => perBand[key][band].q50;
  const allRefit = perBand[BH_ANCHOR_KEY].all.q50;
  out.sensitivity.bhBandSplit = {
    question: '⚫ の損失率はガス帯(120体・⟨r⟩≈81.8)と恒星帯(200体・⟨r⟩≈178.3)の合算である。' +
      '帯ごとに当てはめ直し、各帯の r で理論を評価するとどうなるか',
    method: '第152便・第154便と**同一の当てはめ関数・同一の当てはめ格子・同一の INCONCLUSIVE 規則**を' +
      '帯別の損失率へ適用する。合算指標(all)も同じ関数で当てはめ直し、入力 JSON の q50.summary と' +
      '一致することを確認する(refitMatchesInput)',
    refitMatchesInput: allRefit === bhQ50Of(BH_ANCHOR_KEY),
    perBandQ50: Object.fromEntries(Object.entries(perBand).map(([k, v]) =>
      [k, { all: v.all.q50, gas: v.gas.q50, star: v.star.q50,
        results: { all: v.all.result, gas: v.gas.result, star: v.star.result } }])),
    gasBand: buildBhPredictions(R_GAS, q50Band('gas'), '⚫ ガス帯のみ(r = ガス帯の初期平均半径)'),
    starBand: buildBhPredictions(R_STAR, q50Band('star'), '⚫ 恒星帯のみ(r = 恒星帯の初期平均半径)'),
  };
}

// ③ ⚫ 殻スピン s の取り方(プロファイル実測値 対 プリセット宣言値)
{
  const presetSpin = CS4.raw.bh.arms[BH_ANCHOR_KEY].runs['q1.50'].cfg.shellSpinRef;
  const ref = bhParamsOf(BH_ANCHOR_KEY);
  const refP = { ...ref, s: presetSpin };
  const xcRef = kernelCore(refP, R_STAR);
  const omegaCrit = omegaDragBH(refP, R_STAR, bhQ50Of(BH_ANCHOR_KEY));
  out.sensitivity.bhSpinChoice = {
    question: '(T5) の s に、プロファイル実測の s0(1步後)ではなくプリセット宣言値を使うとどうなるか',
    presetSpin, profileSpins: Object.fromEntries(BH_ARM_KEYS.map(k => [k, bhParamsOf(k).s])),
    rows: BH_ARM_KEYS.filter(k => k !== BH_ANCHOR_KEY).map(k => {
      const p = { ...bhParamsOf(k), s: presetSpin };
      const meas = bhQ50Of(k);
      const two = solveMonotoneDecreasing((q) => omegaDragBH(p, R_STAR, q), omegaCrit);
      const single = predSingleTerm(bhQ50Of(BH_ANCHOR_KEY), xcRef, kernelCore(p, R_STAR));
      return { armKey: k, measuredQ50: meas,
        twoTerm: two.q, twoTermAbsDiff: two.q === null ? null : Math.abs(two.q - meas),
        singleTerm: single, singleTermAbsDiff: Math.abs(single - meas) };
    }),
  };
}

// ④ 🐚 核の取り方(R̄ 対 クランプのコア半径 Rc)
{
  const p1 = CS4.raw.neb.dragProbes.env1, p2 = CS4.raw.neb.dragProbes.env2;
  const q1 = CS4.q50.summary.neb_env1.q50, q2 = CS4.q50.summary.neb_env2.q50;
  const rcClump = CS4.raw.neb.arms.env1.runs['q1.00'].cfg.coreRc;
  out.sensitivity.nebKernelChoice = {
    question: '🐚 の平均場単一項で核を R̄(クランプ粒子半径の平均)に採るか、クランプのコア半径 Rc に採るか',
    RbarClump: p1.RbarClump, coreRcClump: rcClump,
    kernelRbar: out.neb.primary,
    kernelCoreRc: buildNebPrediction(p1, p2, q1, q2, rcClump, nebMeanDrag,
      '🐚 ×1 → ×2(核 = クランプのコア半径 Rc・Ω̄_drag = 44粒子平均)'),
    reading: '真の引きずりは R_j と Rc_j の両方を核に含む多スケール複合なので、実際の指数は' +
      '2つの核による予測の**間**に位置すると期待される。どちらか一方を「正しい核」と主張しない',
  };
}

// ⑤ 🐚 引きずり統計量(平均 対 中央値)
{
  const p1 = CS4.raw.neb.dragProbes.env1, p2 = CS4.raw.neb.dragProbes.env2;
  const q1 = CS4.q50.summary.neb_env1.q50, q2 = CS4.q50.summary.neb_env2.q50;
  out.sensitivity.nebDragStatistic = {
    question: '🐚 の Ω̄_drag に 44 粒子の平均を採るか中央値を採るか',
    mean: out.neb.primary,
    median: buildNebPrediction(p1, p2, q1, q2, p1.RbarClump, nebMedianDrag,
      '🐚 ×1 → ×2(核 = R̄・Ω̄_drag = 44粒子中央値)'),
  };
}

// ⑥ 臨界条件の置き方(絶対値 Ω_drag = Ω_crit 対 ケプラー比 Ω_drag/Ω_kepler = 一定)
{
  const p1 = CS4.raw.neb.dragProbes.env1, p2 = CS4.raw.neb.dragProbes.env2;
  const q1 = CS4.q50.summary.neb_env1.q50, q2 = CS4.q50.summary.neb_env2.q50;
  out.sensitivity.criticalConditionForm = {
    question: '臨界条件を「Ω_drag が絶対値 Ω_crit を下回る」ではなく「Ω_drag/Ω_kepler が一定比を下回る」' +
      'と置くとどうなるか(⚫ は全アームで r が同一なので両者は完全に一致する。差が出るのは r を' +
      '振る 🐚 だけである)',
    declaredForm: '本便の条件式 (T1) は**絶対値**の形で宣言した(導出 T0/T1)。以下は別形の併記であり、' +
      '主結果を置き換えるものではない',
    bhIdentical: '⚫ は r が全アームで同一なので Ω_kepler も同一 — 両形の予測は厳密に一致する',
    nebKeplerRatio: buildNebPrediction(p1, p2, q1, q2, p1.RbarClump, nebMeanDragOverKepler,
      '🐚 ×1 → ×2(条件 = Ω_drag/Ω_kepler 一定・核 = R̄)'),
  };
}

// ---- 参考照合値 0.15 に対する内外(**窓ではない・判定に未使用**)-------------------------------
const REFERENCE_TOLERANCE = 0.15;
out.referenceComparison = {
  value: REFERENCE_TOLERANCE,
  whatItIs: '第152便 XW2・第154便 YW1/YW2 が**窓の許容幅**として使った数値。本便では' +
    '**窓ではなく、単なる参考照合値**として内外を記述するだけであり、本 JSON のどの結果にも' +
    '判定として使っていない(本便に PASS/FAIL は存在しない)',
  note: 'ここでの |差| は「Δ(差分)の差」ではなく「予測 q₅₀ と実測 q₅₀ の差」である点に注意' +
    '(第152便・第154便の窓は Δq₅₀ どうしの差を見ていた。本便の予測は q₅₀ そのものを与える)',
  rows: out.comparisonTable.rows.map(r => ({ sample: r.sample, arm: r.arm,
    absDiff: r.absDiff,
    withinReference: Object.fromEntries(Object.entries(r.absDiff).map(([k, v]) =>
      [k, v === null || v === undefined ? null : v <= REFERENCE_TOLERANCE])) })),
};

// ---- 補足: 第152便(格子非対称の版)への同じ式の適用(参考・判定に未使用)-----------------------
{
  const S = CS3.xw1.summary;
  const g = CS3.raw.bhr.geom;
  const r = g.R15.star.meanR;
  const paramsOf = (k) => {
    const a = CS3.raw.bhr.profiles[`${k}_q1.50`].params;
    return { R: a.R0, Rc: a.Rc, s: a.s0, f: a.coreMassFrac, Omc: a.coreOmega };
  };
  const ref = paramsOf('R15'), q50Ref = S.bhCore_kF1_kRepRef.q50;
  const omegaCrit = omegaDragBH(ref, r, q50Ref);
  const xcRef = kernelCore(ref, r);
  const rows = [];
  for (const [k, sumKey] of [['R10', 'bhCore_kF1_kRepRef_R10'], ['R5', 'bhCore_kF1_kRepRef_R5']]) {
    const p = paramsOf(k), meas = S[sumKey].q50;
    const single = predSingleTerm(q50Ref, xcRef, kernelCore(p, r));
    const singleAmp = predSingleTermAmplitude(q50Ref, xcRef, ampCore(ref), kernelCore(p, r), ampCore(p));
    const two = solveMonotoneDecreasing((q) => omegaDragBH(p, r, q), omegaCrit);
    const legacy = q50Ref + (qEffLegacy(p.R, r) - qEffLegacy(ref.R, r));
    const d = (v) => (v === null ? null : Math.abs(v - meas));
    rows.push({ armKey: k, label: S[sumKey].label, R: p.R, Rc: p.Rc, measuredQ50: meas,
      predicted: { legacy, singleTerm: single, singleTermAmplitude: singleAmp, twoTerm: two.q },
      absDiff: { legacy: d(legacy), singleTerm: d(single), singleTermAmplitude: d(singleAmp),
        twoTerm: d(two.q) } });
  }
  const p1 = CS3.raw.neb.dragProbes.env1, p2 = CS3.raw.neb.dragProbes.env2;
  out.supplementaryWave152 = {
    note: '**参考・判定に未使用**。第152便は⚫の基準アームが10点格子・R 変更アームが8点格子という' +
      '格子非対称を抱えており(第154便がその非対称を設計で排した)、q₅₀ の比較可能性が第154便より' +
      '低い。ここでは同じ式を第152便の実測へ当てるとどうなるかだけを記録する',
    anchorQ50: q50Ref, r, omegaCrit, bhArms: rows,
    neb: buildNebPrediction(p1, p2, CS3.xw1.summary.nebulaShell_kF1_kRepRef.q50,
      CS3.xw1.summary.nebulaShell_kF1_kRepRef_env2.q50, p1.RbarClump, nebMeanDrag,
      '🐚(第152便)×1 → ×2(核 = R̄・Ω̄_drag = 44粒子平均)'),
  };
}

// ---- post-hoc の読み(**すべて事後解釈である**)-------------------------------------------------
out.postHoc = {
  disclosure: '**以下はすべて post-hoc(事後)の解釈である**。実測前に登録した仮説ではなく、' +
    '本便で新しい測定を行って確かめてもいない。次便以降の実測課題の候補として記録する',
  residuals: out.comparisonTable.rows.map(r => ({ arm: r.arm,
    twoTerm: r.absDiff.twoTerm, singleTerm: r.absDiff.singleTerm, legacy: r.absDiff.legacy })),
  sweepGridStep: 0.1,
  sweepGridNote: '第154便の q 掃引の刻みは 0.1 で、第154便 limits.q50Resolution が「q₅₀ の実質的な' +
    '分解能を決めるのは掃引点の刻み(0.1)と損失率の粒度(1/320・1/44)である」と明記している。' +
    '本便の残差がこの刻みに対してどの大きさかは residualsVsGridStep に収載する',
  residualsVsGridStep: out.comparisonTable.rows.map(r => ({ arm: r.arm,
    twoTermOverGridStep: r.absDiff.twoTerm === null ? null : r.absDiff.twoTerm / 0.1,
    singleTermOverGridStep: r.absDiff.singleTerm === null ? null : r.absDiff.singleTerm / 0.1 })),
  unexplainedCandidates: [
    '① 同率スイープの非引きずり寄与: R と Rc を同率で下げると、コアの慣性 I_c = ½M_c·Rc²' +
    '(= 初期 J_core = I_c·Ω_c)と殻の慣性 ½m·R² も同率²で下がる。τ_cs(K_cs=0.02)による' +
    'コア→殻の角運動量の受け渡しの速さが変わるので、6000步の窓を通した**実効の**引きずりは、' +
    '本便が使った t=0+ の解析値からずれうる。第154便 limits.proportionalSweepCaveat が' +
    '「差分では相殺されない系統」として既に名指ししている量である',
    '② 本便の Ω_drag は 1步後(t=0+)の解析値である。⚫ は窓の間に殻スピンが 0.15→1.33・' +
    'コア Ω_c が 20→4.24 まで動く自走系(第78便・第81便の実測)なので、窓平均の引きずりは' +
    't=0+ の値と同じではない。アームごとに時間発展の速さが違えば、その差が残差に乗る',
    '③ q₅₀ 自体の分解能: 掃引刻み 0.1・損失率の粒度 1/320(⚫)/ 1/44(🐚)。' +
    '残差が 0.1 を下回る領域では、実測 q₅₀ の側の不確かさと同程度である',
    '④ 🐚 の2項複合を評価できていないこと(neb.twoTermNote)。核 R̄ と 核 Rc の予測が' +
    '両側に分かれることは sensitivity.nebKernelChoice に収載してある',
  ],
  nextMeasurementCandidates: [
    '🐚 引きずりプローブを **2 点以上の q** で回す(2つの振幅を分離でき、🐚 でも 2項複合が組める)',
    '窓平均の Ω_drag(t=0+ ではなく窓を通した実効値)を測る計装を足す(候補①②の切り分け)',
    'Rc を固定したまま I_c だけを振る対照(候補① の慣性経路と引きずり核経路の分離)',
    'q 掃引の刻みを 0.05 に落として q₅₀ の分解能を上げる(候補③)',
  ],
};

// ---- 自己点検(非有限値がペイロードに混入していないこと)---------------------------------------
{
  let nonFinite = 0, numbers = 0;
  const walk = (o) => {
    if (Array.isArray(o)) { o.forEach(walk); return; }
    if (o && typeof o === 'object') { for (const k of Object.keys(o)) walk(o[k]); return; }
    if (typeof o === 'number') { numbers++; if (!Number.isFinite(o)) nonFinite++; }
  };
  walk(out);
  out.selfCheck = { numbersInPayload: numbers, nonFiniteNumbers: nonFinite,
    note: '出力ペイロード内の数値の総数と、そのうち非有限(NaN/±Infinity)の件数。' +
      '本ハーネスはエンジンを起動しないので NaN 監視の対象は自分の計算だけである' };
}

// ---- 決定性(正準化 SHA-256。参照 JSON があれば照合)-------------------------------------------
{
  const dropTop = new Set(['manifest', 'determinism']);
  const canonize = (o) => {
    if (Array.isArray(o)) return o.map(canonize);
    if (o && typeof o === 'object') {
      const r = {};
      for (const k of Object.keys(o).sort()) r[k] = canonize(o[k]);
      return r;
    }
    return o;
  };
  const payload = {};
  for (const k of Object.keys(out)) if (!dropTop.has(k)) payload[k] = out[k];
  const mine = JSON.stringify(canonize(payload));
  const rec = {
    canonicalization: 'manifest と determinism を除く全キーを再帰キー整列した JSON の SHA-256。' +
      '本ペイロードは Date.now / Math.random 由来の値を含まないので、除外するのはこの2キーだけでよい',
    sha256: sha256(Buffer.from(mine, 'utf8')), bytes: mine.length, reference: null, identical: null,
  };
  const refPath = process.env.CST_DET_REF;
  if (refPath && fs.existsSync(refPath)) {
    try {
      const other = JSON.parse(fs.readFileSync(refPath, 'utf8'));
      const otherPayload = {};
      for (const k of Object.keys(other)) if (!dropTop.has(k)) otherPayload[k] = other[k];
      const otherJ = JSON.stringify(canonize(otherPayload));
      rec.reference = path.basename(refPath);
      rec.referenceSha256 = sha256(Buffer.from(otherJ, 'utf8'));
      rec.identical = (mine === otherJ);
      rec.note = '2回目は別プロセスで同一スクリプト・同一入力を再実行したもの';
    } catch (e) { rec.reference = path.basename(refPath); rec.error = String(e && e.message); }
  } else if (refPath) {
    rec.reference = path.basename(refPath); rec.note = '参照 JSON が見つからなかった';
  }
  out.determinism = rec;
}

// ---- 実験マニフェスト(第145便様式 — 解析専用ハーネスとしての埋め方)---------------------------
out.manifest = await buildManifest({
  root: ROOT, scriptUrl: import.meta.url, page: null, browser: null, payload: out,
  target: TARGET,
  experiment: { id: 'coreshell-theory', wave: 155,
    title: 'コア外殻理論便 — 振幅寄与込み予測式(単一項アンカー式・2項複合)の定式化と、' +
      '既存実測のみによる回顧的検証(窓なし・再実測なし・解析専用)',
    command: 'node tests/exp-coreshell-theory.mjs(出力先 CST_OUT=… / 決定性参照 CST_DET_REF=…)' },
  presets: { mode: 'dynamic',
    declaration: '**本ハーネスは内蔵プリセットを読まない**(シミュレーションを実行しない解析専用ハーネス' +
      'であり、エンジンを build しない)。構成の実体は入力 JSON 側の実測に固定されている',
    declaredIn: 'provenance.inputs / bh.refParams / neb',
    configs: {
      inputs: provenanceInputs.map(e => ({ path: e.path, sha256: e.sha256 })),
      anchors: { bh: { arm: BH_ANCHOR_KEY, q50: bhQ50Of(BH_ANCHOR_KEY) },
        neb: { arm: 'neb_env1', q50: CS4.q50.summary.neb_env1.q50 } },
      modelForm: { bh: 'Ω_drag = s·(R/(R+r))^q + f·(Ω_c−s)·(Rc/(Rc+r))^q',
        neb: '平均場単一項 Ω̄_drag = C·x̄^q(C は引きずりプローブ実測から転記)' },
      solver: SOLVER,
    },
    note: '入力 JSON の来歴(git commit・対象 HTML の SHA-256・プリセットハッシュ)は各入力 JSON の ' +
      'manifest に入っており、本便はそれを書き換えずに参照する' },
  numerics: {
    // 解析専用ハーネス — 積分に関わる数値環境の各欄は「該当なし」が正しい明示値である
    seed: NOT_APPLICABLE, dt: NOT_APPLICABLE, timeScale: NOT_APPLICABLE, substeps: NOT_APPLICABLE,
    steps: NOT_APPLICABLE, window: NOT_APPLICABLE, warmup: NOT_APPLICABLE,
    notApplicableReason: '本ハーネスは時間積分を行わない(シミュレーションを実行せず、既存 JSON の' +
      '実測値に対する解析だけを行う)。seed / dt / timeScale / substeps / steps / window / warmup は' +
      'いずれも本ハーネスに存在しない概念なので "not-applicable" と明示する',
    inputRunNumerics: '入力実測の数値環境(seed ⚫20260805 / 🐚20260804・dt 0.016・步数 6000/3000・' +
      '窓 t=96/48)は入力 JSON 側の manifest.numerics に記録されている — 本便はそれを再宣言しない',
    solver: SOLVER,
    q50RefitGrid: { grid: Q50_GRID,
      note: '感度 sensitivity.bhBandSplit の帯別再当てはめでのみ使う。主指標の q₅₀ は入力 JSON からの転記' },
    arithmetic: 'IEEE754 倍精度。反復解法は区間・回数を固定した二分法のみで、乱数・初期値依存・' +
      '時間依存の停止条件を持たない',
  },
  classification: {
    input: [
      'tests/out/coreshell4-results.json の実測(全アームの q₅₀・幾何・引きずりプローブ・損失率表)' +
      ' — sha256 は provenance.inputs に記録',
      'tests/out/coreshell3-results.json の実測(補足照合と来歴突き合わせ)— 同上',
      '**アンカー = 基準アームの実測 q₅₀**(⚫ base / 🐚 env×1)。これは入力 JSON からの**転記**であり、' +
      '本ハーネスが当てはめた値ではない。未知の臨界値 Ω_crit(と単一項では振幅 A との比)を消去する' +
      'ための1点の代入で、残差を最小化する自由度を一つも導入しない — したがって fit ではなく input に置く',
      '予測式の関数形((T1)〜(T5))と核 R_eff の取り方(⚫: Rc / 🐚: R̄)— 予測の計算前に宣言した' +
      '(ただし対象アームの実測は既に存在していた = 事前登録ではない。scope.retrospective 参照)',
      '参考照合値 0.15(第152便・第154便の窓の許容幅。本便では窓として使わない)',
    ],
    fit: [],
    derived: [
      '予測 q₅₀(legacy / singleTerm / singleTermAmplitude / twoTerm)と実測との |差|(bh・neb・comparisonTable)',
      '振幅 A_b・A_c(⚫)と平均場振幅 C(🐚)— 入力 JSON の実測パラメータからの算術',
      '旧式との関係量 L・u・比(legacyRelation)',
      '感度(核の取り方・帯別・殻スピンの取り方・引きずり統計量・臨界条件の形)',
      '帯別 q₅₀ の再当てはめ(sensitivity.bhBandSplit — 入力 JSON の損失率表に対する記述統計であり、' +
      '物理モデルの較正自由度ではない。当てはめは第152便・第154便と同一の決定論的閉形式+格子探索)',
      '第152便への同式適用(supplementaryWave152 — 参考)', '決定性ハッシュ(determinism)',
    ],
    holdOut: [
      '予測対象アームの実測 q₅₀(⚫ 同率(10,5)・同率(5,2.5)・R単独(10,7.5)・R単独(5,7.5) / 🐚 ×2)— ' +
      '予測の構成には一切使っていない(使うのはアンカー1点だけ)。ただし **事前登録された hold-out では' +
      'ない**: これらの実測は予測式が書かれる前から存在しており、本便は回顧的検証である',
      '旧式 q*_eff=(3/2)(1+R/r) と遠方漸近の臨界指数 3/2(第135便・第139便の外部解析値。本便で' +
      '当てはめ直していない)',
      '第152便・第154便の実測値そのもの(読み取り専用。本便は 1 bit も書き換えない)',
    ],
    note: '**fit は空**である — 本便は新しい較正自由度を一つも導入していない。アンカーは実測値の転記' +
      '1点で、予測式の未知定数を代数的に消去する役割しか持たない(最小二乗も探索も行わない)',
  },
  judgement: {
    pointers: ['scope', 'derivation', 'checks', 'bh.anchorQ50', 'bh.arms', 'neb.primary',
      'comparisonTable', 'legacyRelation', 'sensitivity', 'referenceComparison',
      'supplementaryWave152', 'postHoc', 'selfCheck', 'determinism', 'provenance.inputs'],
    note: '**本便に窓(PASS/FAIL)は存在しない**(scope.noWindows)。導出は derivation、予測と実測の' +
      '照合は bh / neb / comparisonTable、参考照合値 0.15 に対する内外は referenceComparison' +
      '(窓ではなく判定に未使用)、事後解釈は postHoc にある。既発行の窓(第152便 XW1〜XW4・' +
      '第154便 YW1〜YW4)の付け替えは一切していない',
    externalReferences: ['旧式 実効臨界指数 q*_eff=(3/2)(1+R/r)(第139便 post-hoc → 第152便 XW2 → ' +
      '第154便 YW1 が使った解析値)', '遠方漸近の臨界指数 3/2(第135便が同定)',
      'qLock の q*=3+ln X/ln((R+a)/R)(第123便・第141便 — 構造的類似の記述にのみ使う)'],
  },
  health: {
    nan: { status: NOT_APPLICABLE,
      note: '本ハーネスはエンジンを起動しないので、エンジンの NaN 監視という概念が存在しない。' +
        '代わりに自分の計算結果に非有限値が無いことを selfCheck で機械確認している',
      selfCheck: '本 JSON の selfCheck(nonFiniteNumbers)' },
    clamps: { aggregate: NOT_APPLICABLE,
      note: '本ハーネスはエンジンを起動しないので安全クランプの計数という概念が存在しない。' +
        '入力実測のクランプ計数は各入力 JSON の manifest.health に記録されている' },
    conservation: { status: NOT_APPLICABLE,
      note: '本ハーネスは時間積分を行わないので保存量残差という概念が存在しない。' +
        '入力実測側の健全性(kF0×kRep0 対照の bit 一致・共有点 bit 一致・決定性ハッシュ)は' +
        '第152便・第154便の JSON に記録されている' },
  },
  regenerationNote: '本ペイロードは実行日時・経過時間・乱数を一切含まないので、除外すべき非測定メタは ' +
    'manifest(と、参照 JSON 指定時にだけ埋まる determinism.reference/identical/referenceSha256)だけである',
  excludeKeys: ['determinism.reference', 'determinism.identical', 'determinism.referenceSha256',
    'determinism.note', 'determinism.error'],
});

fs.writeFileSync(OUT_PATH, JSON.stringify(out, null, 2));

// ======================================== 標準出力 ===========================================
log('===== 第155便 コア外殻理論便(解析専用・回顧的・窓なし)=====');
log(`入力: ${provenanceInputs.map(e => `${e.path} (sha256 ${e.sha256.slice(0, 12)}…)`).join(' / ')}`);
log(`対象 HTML の一致: ${targetConsistency.allSame}(入力実測の対象と作業ツリーの ${TARGET} が同一実体か)`);
log(`⚫ アンカー: ${BH_ANCHOR_KEY} q₅₀=${fmt(out.bh.anchorQ50)} / 正準 r=${fmt(out.bh.r, 3)} / ` +
  `Ω_crit=${out.bh.omegaCrit.toExponential(6)}`);
log('--- ⚫ 予測 vs 実測(|差| = |予測 q₅₀ − 実測 q₅₀|)---');
for (const a of out.bh.arms) {
  if (a.isAnchor) { log(`  ${a.armKey.padEnd(13)} (アンカー) 実測 q₅₀=${fmt(a.measuredQ50)}`); continue; }
  log(`  ${a.armKey.padEnd(13)} 実測=${fmt(a.measuredQ50)} | 旧式=${fmt(a.predicted.legacy)}` +
    `(|差|${fmt(a.absDiff.legacy)}) | 単一項=${fmt(a.predicted.singleTerm)}(|差|${fmt(a.absDiff.singleTerm)})` +
    ` | 単一項+振幅=${fmt(a.predicted.singleTermAmplitude)}(|差|${fmt(a.absDiff.singleTermAmplitude)})` +
    ` | 2項複合=${fmt(a.predicted.twoTerm)}(|差|${fmt(a.absDiff.twoTerm)})`);
}
{
  const n = out.neb.primary;
  log('--- 🐚 予測 vs 実測 ---');
  log(`  neb_env1(アンカー) 実測 q₅₀=${fmt(n.anchorQ50)} / x̄=${fmt(n.reference.x, 6)} / C=${fmt(n.reference.amplitudeC, 6)}`);
  log(`  neb_env2 実測=${fmt(n.measuredQ50)} | 旧式=${fmt(n.predicted.legacy)}(|差|${fmt(n.absDiff.legacy)})` +
    ` | 単一項=${fmt(n.predicted.singleTerm)}(|差|${fmt(n.absDiff.singleTerm)})` +
    ` | 単一項+振幅=${fmt(n.predicted.singleTermAmplitude)}(|差|${fmt(n.absDiff.singleTermAmplitude)})` +
    ` | 2項複合=未評価(${'入力 JSON から分離できない'})`);
  log(`  🐚 振幅比 C(×2)/C(×1)=${fmt(n.amplitudeRatio, 6)}(= 振幅寄与の実体)`);
}
log('--- 予測方式ごとの |差| の要約(アンカーを除く5アーム)---');
for (const [k, v] of Object.entries(out.comparisonTable.summary))
  log(`  ${k.padEnd(21)} n=${v.n} 最大=${fmt(v.max)} 平均=${fmt(v.mean)}`);
log(`参考照合値 ${REFERENCE_TOLERANCE}(**窓ではない・判定に未使用**)に対する内外は referenceComparison に収載`);
log(`自己点検: 数値 ${out.selfCheck.numbersInPayload} 件・非有限 ${out.selfCheck.nonFiniteNumbers} 件`);
log(`決定性 sha256=${out.determinism.sha256} identical=${out.determinism.identical}`);
log(`saved: ${path.relative(ROOT, OUT_PATH)}`);
