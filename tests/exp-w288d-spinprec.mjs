// 第288便d(原仮定者の裁定(第78報)⑥・統括の検証項目 R116)—— **スピン・歳差の口座便の器**(Node だけ・数秒)。
//
// ■ 何を測るか(純関数 tests/lib-w288d-spinprec.mjs —— **エンジン未接続**・物理は 1 bit も変えない)
//   (A) 無次元指標の単位不変(SI と cgs で同じ値 —— kerr・surface・breakup)。上限はエンジンの柵 ±40 と無関係。
//   (B) 上限の連鎖(スピン → 傾き → 歳差 → スピンへ戻る → 旗)の時系列と閉形式(相対 1e-12)・段の順序・恒等式
//       Δ(E_spin+E_axis+E_prec+Q)=W_drive・旗の負の対照 3 本(歳差の上限の手前で止める・歳差の上限を大きくする・ブレーキが勝つ)。
//   (C) ブレーキつきの連鎖(張り付く前の E_spin は指数の閉形式・到達時刻は閉形式を含む刻み)。
//   (D) W_drive<0(スピン口座から・口座を越える分は拒否して記録)。
//   (E) θ=90° で自転と歳差の項が分かれる(交差項の係数 I_∥cosθ)・剛体式と |J|²/(2I)(球でだけ一致 —— 足さない)。
//   (F) 旧模型の Ω_prec=K a/|S|(|S| に従属)と口座の φ̇(従属しない)の比較。
//   (G) 剛体対照(I_∥=I_⊥ の球): `lib-w275e-powerball` の駆動・ジャイロだけの走行と `lib-w276c-axiswork` の移送を口座で再現。
//   (H) 熱 = ミクロのスピン(ネット J=0 でも Q>0・符号付きスピンで代用しない)。
//   (I) 周波数ロックの小模型: γ=0 の既存 `lockDerivs` との一致・正逆の対照・独立な初期位相からの収束・γ=0 の非収束・
//       K=0 の近い周期の漂い・エネルギー(供給なしで総 E が増えない)・振り子の厳密周期・減衰率・符号の規約(共通/局所)。
//   (J) html の `dfmCoreAxisStep`(φ(t)=az+Ω_p t を外から指定する処理 —— 動的な歳差ではない)と `coreAxisState`・
//       🪩 bhCoreTilt の宣言(tilt 90°・Kcs 0)から J_z/|J|(= cos 90° —— 機械ゼロ)。html のソースを文字列で切り出して評価する
//       (ページは開かない・エンジンは走らせない)。
//
// 環境変数: なし(`QA_TARGET` で対象 html を替えられる —— 既定 beta/index.html)。他の正本は読まない。
// 実行: node tests/exp-w288d-spinprec.mjs → tests/out/spinprec-w288d.json(来歴 w272e-1・領域 hash つき)
// 書かないこと: 歳差の発見・潮汐ロックの成立・腕の渦伸長による生成の主張・「DFM から導出した」「エンジンに実装した」「新発見」。
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import * as L from './lib-w288d-spinprec.mjs';
import * as PB from './lib-w275e-powerball.mjs';
import * as AW from './lib-w276c-axiswork.mjs';
import { provenanceMeta } from './lib-w272e-provenance.mjs';
// 第281便a の規約: **この器が読む html の領域**の宣言(1 行の JSON —— lint.regenScope が読む)。
import { scopeStamp as w281aScopeStamp, stableInputs as w281aStableInputs } from './lib-w281a-scope.mjs';
const REGEN_SCOPE = {"presets":["bhCoreTilt"],"roots":["$","coreAxisState","dfmCoreAxisStep"],"core":false,"consts":[],"complete":true};

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
export const HARNESS_VERSION = 'w288d-spinprec-h1';
/** 閉形式・再導出の比較の相対許容(解析量)。 */
export const REL_TOL = 1e-12;
/** 周波数ロックの数値積分(RK4)の床: 振り子周期の相対 1e-8・減衰率の相対 1e-5(振幅 1e-3 の非線形 ~A²/16 を含む)・
 *  総 E の増加は刻み dt=0.01 で 1e-9(dt/2 で約 1/16 に下がることを並べる —— 4 次)・位相の漂いは |φ| に対する相対 1e-12。 */
export const LOCK_FLOORS = { period: 1e-8, decay: 1e-6, energyUp: 1e-9, phaseRel: 1e-12 };
/** エンジンの数値柵(±40)。**口座の上限と無関係**であることを記録するためだけに置く(どこでも使わない)。 */
export const ENGINE_FENCE_NOT_USED = 40;
const rel = (a, b) => (a === b ? 0 : Math.abs(a - b) / Math.max(1e-300, Math.abs(b)));
const relS = (a, b, s) => Math.abs(a - b) / Math.max(1e-300, s);

/* ── (A) 無次元指標の単位不変 ─────────────────────────────────────────────── */
function indexUnits() {
  // 中性子星の典型値(比較の例 —— 天体の同定ではない)。周期 22.7 ms の自転。
  const si = { G: 6.6743e-11, c: 2.99792458e8, M: 1.338 * 1.98847e30, R: 1.2e4 };
  si.I = 0.4 * si.M * si.R * si.R;
  const cgs = { G: si.G * 1e3, c: si.c * 100, M: si.M * 1e3, R: si.R * 100 };
  cgs.I = 0.4 * cgs.M * cgs.R * cgs.R;
  const omega = 2 * Math.PI / 0.0227;
  const rows = ['kerr', 'surface', 'breakup'].map((def) => {
    const a = L.indexOf(def, si, omega), b = L.indexOf(def, cgs, omega);
    return { def, formula: L.INDEX_DEFS[def].formula, chiSI: a, chiCgs: b, relDiff: rel(b, a) };
  });
  return { omega, rows, ok: rows.every((r) => r.relDiff <= REL_TOL),
    note: '指標はどれも ω に線形(χ=ω/ω_ref)。値は比較の例で、どれを採るかは決断事項候補。エンジンの柵 ±40 は使っていない' };
}

/* ── (B) 上限の連鎖(2 進で割り切れる値 —— 閉形式と刻みの和が丸めなしで比べられる) ─── */
export const CHAIN_DECL = { Ipar: 1, Iperp: 0.75, omega0: 1, Ktilt: 1, sigmaSpin: 2, sigmaPrec: 1.5,
  omegaRefSpin: 1, omegaRefPrec: 1, P: 1 / 16, dt: 1 / 64, tEnd: 64, index: 'ratio' };
function chainInit(d, over) {
  const capSpin = L.capOf(d.index, { I: d.Ipar, omegaRef: d.omegaRefSpin }, d.sigmaSpin);
  const capPrec = L.capOf(d.index, { I: d.Iperp, omegaRef: d.omegaRefPrec }, d.sigmaPrec);
  return Object.assign({ Ipar: d.Ipar, Iperp: d.Iperp, omega0: d.omega0, Ktilt: d.Ktilt, capSpin, capPrec }, over || {});
}
function chainRun(id, d, o) {
  const init = chainInit(d, o.init);
  const r = L.runAccounts({ id, init, P: o.P || (() => d.P), gamma: o.gamma || 0, eta: o.eta, dt: d.dt,
    steps: Math.round((o.tEnd || d.tEnd) / d.dt), sampleEvery: o.sampleEvery || 1, omegaRefSpin: d.omegaRefSpin, omegaRefPrec: d.omegaRefPrec });
  return { r, init };
}
function eventRow(ev, tClosed, dt, strict) {
  // 刻み単位の検出: 到達(=)は閉形式の時刻 t* を含む刻み(t_k − dt < t* ≤ t_k)・旗(超過 >)は t* の**後**の最初の刻み(t* < t_k ≤ t* + dt)
  const ok = (ev !== null && Number.isFinite(tClosed))
    ? (strict ? (tClosed < ev && ev <= tClosed + dt) : (ev - dt < tClosed && tClosed <= ev))
    : (ev === null && !Number.isFinite(tClosed));
  return { measured: ev, closed: tClosed, rule: strict ? 't* < t_k ≤ t* + dt(超過)' : 't_k − dt < t* ≤ t_k(到達)', containsClosed: ok };
}
function chainMain() {
  const d = CHAIN_DECL;
  const { r, init } = chainRun('chain', d, {});
  const cf = L.closedForm({ P: d.P, gamma: 0, eta: 1, E0: 0.5 * d.Ipar * d.omega0 * d.omega0, capSpin: init.capSpin, Ktilt: d.Ktilt, capPrec: init.capPrec });
  let worst = { Espin: 0, Eaxis: 0, Eprec: 0, theta: 0, phiDot: 0 };
  const series = r.snaps.map((s) => {
    const e = { Espin: cf.Espin(s.t), Eaxis: cf.Eaxis(s.t), Eprec: cf.Eprec(s.t) };
    const thC = Math.acos(1 - e.Eaxis / d.Ktilt), sC = Math.sin(thC);
    const phC = (e.Eprec > 0) ? Math.sqrt(2 * e.Eprec / (d.Iperp * sC * sC)) : 0;
    const dd = { Espin: relS(s.Espin, e.Espin, Math.max(1, e.Espin)), Eaxis: relS(s.Eaxis, e.Eaxis, Math.max(1, e.Eaxis)),
      Eprec: relS(s.Eprec, e.Eprec, Math.max(1, e.Eprec)), theta: relS(s.thetaDeg * Math.PI / 180, thC, Math.max(1, thC)),
      phiDot: relS(s.phiDot, phC, Math.max(1, phC)) };
    for (const k of Object.keys(worst)) worst[k] = Math.max(worst[k], dd[k]);
    return { t: s.t, Espin: s.Espin, Eaxis: s.Eaxis, Eprec: s.Eprec, Q: s.Q, thetaDeg: s.thetaDeg, phiDot: s.phiDot,
      omega3: s.omega3, chiSpin: s.chiSpin, chiPrec: s.chiPrec, stretchFlag: s.stretchFlag, Eover: s.Eover };
  });
  const ev = r.st.events;
  const events = { spinCap: eventRow(ev.spinCap, cf.tSpinCap, d.dt), axisFull: eventRow(ev.axisFull, cf.tAxisFull, d.dt),
    precCap: eventRow(ev.precCap, cf.tPrecCap, d.dt), stretch: eventRow(ev.stretch, cf.tPrecCap, d.dt, true) };
  const order = ev.spinCap !== null && ev.axisFull !== null && ev.precCap !== null && ev.stretch !== null
    && ev.spinCap < ev.axisFull && ev.axisFull < ev.precCap && ev.precCap <= ev.stretch;
  // 旗が立つ前の刻みでは E_spin ≤ cap_spin(スピンが上限を超えたまま残るのは旗の後だけ)
  const flags = series.filter((s) => s.stretchFlag);
  return { decl: d, caps: { capSpin: init.capSpin, capPrec: init.capPrec, Ktilt: d.Ktilt,
      how: 'cap = ½I(σ ω_ref)²(指標 ratio・ω_ref=1)。θ=90° の傾きの口座の上限は K_tilt' },
    closedTimes: { tSpinCap: cf.tSpinCap, tAxisFull: cf.tAxisFull, tPrecCap: cf.tPrecCap },
    events, order, worstClosedRel: worst, identity: { worstResAbs: r.worstResAbs, worstResRel: r.worstResRel },
    flagBeforePrecCap: r.flagBeforePrecCap, spinAboveCapBeforeFlag: r.spinAboveCapBeforeFlag,
    flows: { spinToAxis: r.st.flowSA, spinToPrec: r.st.flowSP, precToSpin: r.st.flowPS },
    end: { t: r.st.t, Espin: r.st.Espin, Eaxis: r.st.Eaxis, Eprec: r.st.Eprec, Q: r.st.Q, Win: r.st.Win, Eover: r.st.Eover,
      thetaDeg: r.geometry.thetaDeg, phiDot: r.geometry.phiDot, omega3: r.geometry.omega3, psiDot: r.geometry.psiDot, stretchFlag: r.st.stretchFlag },
    firstFlagT: flags.length ? flags[0].t : null, series };
}
/** 旗の負の対照 3 本(旗は歳差の上限を超える前に立たない)。 */
function flagControls() {
  const d = CHAIN_DECL;
  const cf = L.closedForm({ P: d.P, gamma: 0, eta: 1, E0: 0.5, capSpin: chainInit(d).capSpin, Ktilt: d.Ktilt, capPrec: chainInit(d).capPrec });
  const a = chainRun('stopAtPrecCap', d, { tEnd: cf.tPrecCap }).r;
  const b = chainRun('hugePrecCap', d, { init: { capPrec: 1e9 } }).r;
  // ブレーキが勝つ: 平衡 E_∞ = P/(2γ) = 1.25 < cap_spin = 2(スピンの上限にすら届かない)
  const g = 1 / 40;
  const c = chainRun('brakeWins', d, { gamma: g }).r;
  const cfc = L.closedForm({ P: d.P, gamma: g, eta: 1, E0: 0.5, capSpin: chainInit(d).capSpin, Ktilt: d.Ktilt, capPrec: chainInit(d).capPrec });
  let worstC = 0;
  for (const s of c.snaps) worstC = Math.max(worstC, relS(s.Espin, cfc.Espin(s.t), Math.max(1, cfc.Espin(s.t))));
  const row = (x, extra) => Object.assign({ id: x.id, tEnd: x.st.t, stretchFlag: x.st.stretchFlag, events: x.st.events,
    Espin: x.st.Espin, Eaxis: x.st.Eaxis, Eprec: x.st.Eprec, Q: x.st.Q, identityResAbs: x.worstResAbs }, extra || {});
  return [row(a, { note: '歳差が上限に**到達**した刻みで止める(軸は 90°・歳差は上限ちょうど・超過はまだ)' }),
    row(b, { note: '歳差の上限を 1e9 にする(余剰は歳差に溜まり続ける)' }),
    row(c, { gamma: g, Einf: d.P / (2 * g), capSpin: chainInit(d).capSpin, worstClosedRel: worstC, note: 'ブレーキが供給に勝つ(E_∞ < cap_spin)' })];
}

/* ── (C) ブレーキつきの連鎖 ─────────────────────────────────────────────── */
function chainBrake() {
  const d = CHAIN_DECL, g = 1 / 256;
  const { r, init } = chainRun('chainBrake', d, { gamma: g, tEnd: 96 });
  const cf = L.closedForm({ P: d.P, gamma: g, eta: 1, E0: 0.5, capSpin: init.capSpin, Ktilt: d.Ktilt, capPrec: init.capPrec });
  let worstPre = 0, nPre = 0;
  for (const s of r.snaps) if (s.t <= cf.tSpinCap) { nPre++; worstPre = Math.max(worstPre, relS(s.Espin, cf.Espin(s.t), Math.max(1, cf.Espin(s.t)))); }
  const ev = r.st.events;
  return { gamma: g, Einf: d.P / (2 * g), rateAfterCap: cf.rateAfterCap, preCapSamples: nPre, worstPreCapRel: worstPre,
    spinCap: eventRow(ev.spinCap, cf.tSpinCap, d.dt), axisFullT: ev.axisFull, precCapT: ev.precCap, stretchT: ev.stretch,
    order: ev.spinCap !== null && ev.axisFull !== null && ev.precCap !== null && ev.spinCap < ev.axisFull && ev.axisFull < ev.precCap && ev.precCap <= ev.stretch,
    identity: { worstResAbs: r.worstResAbs, worstResRel: r.worstResRel }, flagBeforePrecCap: r.flagBeforePrecCap,
    Q: r.st.Q, Win: r.st.Win,
    note: '張り付いた後は「刻みの指数解 → 連鎖」の分割なので連続の閉形式と O(γ dt) 違う —— 照合は張り付く前の E_spin と到達刻み・順序・恒等式' };
}

/* ── (D) W_drive<0(スピン口座から) ──────────────────────────────────────── */
function negativeDrive() {
  const d = CHAIN_DECL;
  const w0 = 1.5, P = -1 / 16, tEnd = 24;
  const st = L.makeAccounts({ Ipar: d.Ipar, Iperp: d.Iperp, omega0: w0, Ktilt: d.Ktilt, capSpin: 2, capPrec: 0.84375 });
  const E0 = st.Espin;
  let worst = 0, worstRes = 0, omegaMono = true, wPrev = w0;
  const n = Math.round(tEnd / d.dt);
  for (let k = 0; k < n; k++) {
    L.stepAccounts(st, { P, dt: d.dt });
    const closed = Math.max(0, E0 + P * st.t);
    worst = Math.max(worst, relS(st.Espin, closed, Math.max(1, closed)));
    worstRes = Math.max(worstRes, Math.abs(L.totalE(st) - E0 - st.Win));
    const w = L.geometry(st).omega3; if (w > wPrev + 1e-15) omegaMono = false; wPrev = w;
  }
  const tZero = E0 / -P;
  return { omega0: w0, P, tEnd, E0, tZero, EspinEnd: st.Espin, omegaEnd: L.geometry(st).omega3, Win: st.Win,
    refused: st.refused, refusedClosed: -P * (tEnd - tZero), refusedRel: rel(st.refused, -P * (tEnd - tZero)),
    worstClosedRel: worst, identityResAbs: worstRes, omegaMonotoneDown: omegaMono, Q: st.Q,
    note: 'W_drive<0 はスピン口座から(新しい項なし)。口座が 0 になった先は拒否して refused に残す(切り捨てて捨てない・向きの反転は扱わない)' };
}

/* ── (E) θ=90° の分離と、剛体式/|J|²/(2I) ─────────────────────────────── */
function separation() {
  const Ipar = 1, Iperp = 0.75;
  const rows = [0, 30, 60, 89, 90].map((deg) => {
    const th = deg * Math.PI / 180;
    return { thetaDeg: deg, cross: L.crossCoupling(Ipar, th), crossRel: Math.abs(L.crossCoupling(Ipar, th)) / Ipar };
  });
  // 剛体式 = E_spin + E_prec(ψ̇ = ω₃ − φ̇cosθ)—— θ=90° と θ=60° の状態で
  const states = [{ w3: 2, phiDot: 1.5, deg: 90 }, { w3: 2, phiDot: 1.5, deg: 60 }].map((s) => {
    const th = s.deg * Math.PI / 180, psiDot = s.w3 - s.phiDot * Math.cos(th);
    const Espin = 0.5 * Ipar * s.w3 * s.w3, Eprec = 0.5 * Iperp * s.phiDot * s.phiDot * Math.sin(th) * Math.sin(th);
    const Er = L.rigidErot(Ipar, Iperp, psiDot, s.phiDot, th, 0);
    // θ=90° では E_spin は ψ̇ だけ・E_prec は φ̇ だけで書ける(交差なし)
    const sepSpin = 0.5 * Ipar * psiDot * psiDot, sepPrec = 0.5 * Iperp * s.phiDot * s.phiDot;
    return { thetaDeg: s.deg, psiDot, Erigid: Er, EspinPlusEprec: Espin + Eprec, rigidRel: rel(Espin + Eprec, Er),
      separableSum: sepSpin + sepPrec, separableRel: rel(sepSpin + sepPrec, Er) };
  });
  // 球(I_∥=I_⊥)でだけ |J|²/(2I) が剛体式と一致する
  const jcmp = [{ id: 'sphere', Ipar: 1, Iperp: 1 }, { id: 'oblate', Ipar: 1, Iperp: 0.75 }].map((b) => {
    const w3 = 2, ph = 1.5, th = 60 * Math.PI / 180, psi = w3 - ph * Math.cos(th);
    const Er = L.rigidErot(b.Ipar, b.Iperp, psi, ph, th, 0.3);
    const J2 = L.jSquaredOver2I(b.Ipar, b.Iperp, w3, ph, th, 0.3, b.Ipar);
    return { id: b.id, Ipar: b.Ipar, Iperp: b.Iperp, Erigid: Er, J2over2I: J2, relDiff: rel(J2, Er) };
  });
  return { cross: rows, states, jCompare: jcmp,
    decl: '正本は剛体式。|J|²/(2I) は球でだけ一致する比較値で、両方を足さない(二重計上しない)' };
}

/* ── (F) 旧模型の Ω_prec=K a/|S| と口座の φ̇ ───────────────────────────── */
function legacyCompare() {
  const K = 1, a = 0.5, Iperp = 0.75, Eprec = 0.5;
  const phiAcc = Math.sqrt(2 * Eprec / Iperp);   // θ=90°
  return { K, a, Eprec, rows: [1, 2, 4].map((f) => {
    const S = 2 * f;
    return { Smag: S, legacyOmegaPrec: L.legacyPrecRate(K, a, S), accountPhiDot: phiAcc };
  }), note: '旧模型(lib-w275e-powerball の precessionRate —— 変えていない)は |S| が倍になると半分。口座の φ̇ は E_prec だけで決まり |S| に従属しない' };
}

/* ── (G) 剛体対照(球) ──────────────────────────────────────────────────── */
function rigidControls() {
  const I = 1, dt = 1e-3, n = 20000;
  // G1: powerball の駆動(K=0・Q=0・drive=D)—— 刻みごとの W_drv 増分を口座へそのまま渡す
  const D = 0.3, S0 = 2;
  const P1 = { K: 0, Q: 0, I0: I, spinAxisSupply: { drive: D } };
  let y = [S0, 0, 0, 0, 0, 0, 0, 0, 0, 0], t = 0;
  const st = L.makeAccounts({ Ipar: I, Iperp: I, omega0: S0 / I, Ktilt: 1, capSpin: 1e30, capPrec: 1e30 });
  let worst1 = 0, worstPbId = 0;
  const Erot0 = (S0 * S0) / (2 * I);
  for (let k = 0; k < n; k++) {
    const yn = PB.rk4(PB.soloDerivs, P1, t, y, dt);
    const W = yn[7] - y[7];
    L.stepAccounts(st, { W, dt });
    y = yn; t += dt;
    const Smag = Math.hypot(y[0], y[1], y[2]), Erot = (Smag * Smag) / (2 * I);
    worst1 = Math.max(worst1, rel(st.Espin, Erot));
    worstPbId = Math.max(worstPbId, Math.abs((Erot - Erot0) - y[7]) / Math.max(1, Erot));
  }
  const g1 = { D, steps: n, dt, EspinAccount: st.Espin, ErotPowerball: (Math.hypot(y[0], y[1], y[2]) ** 2) / (2 * I), worstRel: worst1,
    powerballIdentityRel: worstPbId, Wdrv: y[7] };
  // G2: ジャイロトルクだけ(K=1.5・Q=0・供給なし)—— τ·ŝ=0 なので powerball の |S| は RK4 の床の範囲でしか動かず、口座は 1 も動かない
  const P2 = { K: 1.5, Q: 0, I0: I };
  const psi0 = 60 * Math.PI / 180;
  let y2 = [S0 * Math.cos(psi0), 0, S0 * Math.sin(psi0), 0, 0, 0, 0, 0, 0, 0], t2 = 0;
  const st2 = L.makeAccounts({ Ipar: I, Iperp: I, omega0: S0 / I, Ktilt: 1, capSpin: 1e30, capPrec: 1e30 });
  let worstS = 0;
  for (let k = 0; k < n; k++) {
    y2 = PB.rk4(PB.soloDerivs, P2, t2, y2, dt); t2 += dt;
    L.stepAccounts(st2, { W: 0, dt });
    worstS = Math.max(worstS, rel(Math.hypot(y2[0], y2[1], y2[2]), S0));
  }
  const tc = PB.orientTorque([S0 * Math.cos(psi0), 0, S0 * Math.sin(psi0)], [1, 0, 0], 1.5).tau;
  const g2 = { K: 1.5, steps: n, powerballSpinRelDrift: worstS, accountEspinChange: st2.Espin - Erot0,
    tauDotShat: PB.v3.dot(tc, PB.v3.unit([S0 * Math.cos(psi0), 0, S0 * Math.sin(psi0)])),
    note: 'ジャイロトルクは供給源ではない(τ·ŝ=0)。powerball の |S| の漂いは RK4 の床' };
  // G3: axiswork の移送(反作用ローター I_a=∞ —— 球の自転だけへ)と口座(W_drive=w・η)
  const eta = 0.75, wStep = 1e-3, m = 5000;
  const ax = AW.makeAxisState({ Smag: S0, I, Ia: Infinity });
  const st3 = L.makeAccounts({ Ipar: I, Iperp: I, omega0: S0 / I, Ktilt: 1, capSpin: 1e30, capPrec: 1e30 });
  let worst3 = 0, worst3q = 0;
  for (let k = 0; k < m; k++) {
    AW.depositWork(ax, wStep); AW.transferFromBank(ax, wStep, eta);
    L.stepAccounts(st3, { W: wStep, eta, dt: 1 });
    worst3 = Math.max(worst3, rel(st3.Espin, AW.spinEnergy(ax)));
    worst3q = Math.max(worst3q, relS(st3.Q, ax.heat, Math.max(1e-300, ax.heat)));
  }
  const g3 = { eta, wStep, steps: m, EspinAccount: st3.Espin, EspinAxiswork: AW.spinEnergy(ax), worstRel: worst3,
    QAccount: st3.Q, heatAxiswork: ax.heat, worstHeatRel: worst3q, axisworkLedgerDrift: Math.abs(AW.ledgerC(ax) - (Erot0 - 0)),
    versions: { powerball: PB.POWERBALL_VERSION, axiswork: AW.AXISWORK_VERSION } };
  return { powerballDrive: g1, powerballGyroOnly: g2, axiswork: g3 };
}

/* ── (H) 熱 = ミクロのスピン ─────────────────────────────────────────────── */
function microHeat() {
  const h = L.microSpinHeat({ N: 1000, I: 1e-3, omegaRms: 3, seed: 288 });
  const dE = 0.37;
  const a = h.addHeat(dE);
  return { N: h.N, Q: h.Q, Jnet: h.Jnet, signedSpinProxy: h.signedSpinProxy, added: dE, Qafter: a.Q, QafterRel: rel(a.Q, h.Q + dE), JnetAfter: a.Jnet,
    note: 'Q はミクロ回転のエネルギーの和(ネット J=0 でも Q>0)。符号付きスピンの和(=0)を Q の代わりにしない' };
}

/* ── (I) 周波数ロックの小模型 ─────────────────────────────────────────── */
export const LOCK_DECL = { Ip: 1, Io: 4, K: 1, gamma: 0.4, dt: 0.01, tEnd: 200 };
function hermiteRoot(t0, t1, f0, f1, d0, d1, fn) {
  // 3 次 Hermite 補間の根(二分法 60 回)。fn は値の補間関数
  let a = 0, b = 1;
  const h = t1 - t0;
  const H = (s) => { const s2 = s * s, s3 = s2 * s;
    return (2 * s3 - 3 * s2 + 1) * f0 + (s3 - 2 * s2 + s) * h * d0 + (-2 * s3 + 3 * s2) * f1 + (s3 - s2) * h * d1; };
  const g = fn || H;
  for (let i = 0; i < 60; i++) { const c = 0.5 * (a + b); if ((g(a) <= 0) === (g(c) <= 0)) a = c; else b = c; }
  return t0 + 0.5 * (a + b) * h;
}
function lockToy() {
  const D = LOCK_DECL, mu = D.Ip * D.Io / (D.Ip + D.Io);
  const steps = Math.round(D.tEnd / D.dt);
  const run = (id, K, gamma, dphi0, detune0, over) => L.runLockToy(Object.assign({ id, Ip: D.Ip, Io: D.Io, K, gamma, dt: D.dt, steps, samples: 40,
    z0: [dphi0, 1 + detune0, 0, 1, 0] }, over || {}));
  // I1: γ=0 で既存の lockDerivs(lib-w276c-axiswork —— 共役運動量の形)と一致
  const n1 = 5000;
  let z = [0.7, 1.2, 0, 1, 0], p = [0.7, 1.2 * D.Ip, 0, 1 * D.Io], t = 0, worst1 = 0;
  const Pm = { Ip: D.Ip, Io: D.Io, K: D.K, gamma: 0 }, Pa = { Ip: D.Ip, Id: D.Io, Klock: D.K };
  for (let k = 0; k < n1; k++) {
    z = PB.rk4(L.lockToyDerivs, Pm, t, z, D.dt); p = AW.rk4v(AW.lockDerivs, Pa, t, p, D.dt); t += D.dt;
    worst1 = Math.max(worst1, relS(z[0], p[0], 1), relS(z[1], p[1] / D.Ip, 1), relS(z[2], p[2], 1), relS(z[3], p[3] / D.Io, 1));
  }
  const i1 = { steps: n1, worstRel: worst1, note: 'γ=0 の本模型は lib-w276c-axiswork の lockDerivs(φ・共役運動量)と同じ軌道(変数が ω か p かだけ)' };
  // I2: 正逆の対照(同じ初期状態・K の符号だけ違う)
  const pos = run('K+', D.K, D.gamma, 0.3, 0.02), neg = run('K−', -D.K, D.gamma, 0.3, 0.02);
  const sign = { pos: { devFinal: pos.devFinal, center: pos.center, detuneFinal: pos.detuneFinal, dphiFinalWrapped: L.wrapPi(pos.last.dphi) },
    neg: { devFinal: neg.devFinal, center: neg.center, detuneFinal: neg.detuneFinal, dphiFinalWrapped: L.wrapPi(neg.last.dphi),
      movedAwayFromZero: Math.abs(L.wrapPi(neg.last.dphi)) > 0.3 } };
  // I3: 独立に変えた初期位相と離調からの収束(γ>0)/ I4: 同じ初期状態で γ=0(収束しない)
  const inits = [[0.3, 0.05], [1.5, -0.08], [2.8, 0.05], [-2.2, -0.08]];
  const conv = inits.map(([d0, w0]) => { const r = run('conv', D.K, D.gamma, d0, w0);
    return { dphi0: d0, detune0: w0, devFinal: r.devFinal, detuneFinal: r.detuneFinal, circulations: r.circulations, maxDev: r.maxDev,
      worstEtotUp: r.worstEtotUp, worstJsumAbs: r.worstJsumAbs, Qend: r.last.Q }; });
  const noDamp = inits.map(([d0, w0]) => { const r = run('γ0', D.K, 0, d0, w0);
    return { dphi0: d0, detune0: w0, firstAmp: r.firstAmp, lastAmp: r.lastAmp, ampRatio: r.lastAmp / r.firstAmp, detuneFinal: r.detuneFinal,
      devFinal: r.devFinal, circulations: r.circulations, worstEtotUp: r.worstEtotUp, Qend: r.last.Q }; });
  // I4′: K=0・近い周期(離調 1e-3)—— Δφ は δω t で漂い続ける(閉形式)
  const K0 = run('K0', 0, 0, 0.3, 1e-3);
  const phScale = Math.max(Math.abs(K0.z[0]), Math.abs(K0.z[2]));
  const k0 = { detune0: 1e-3, tEnd: D.tEnd, dphiEnd: K0.last.dphi, dphiClosed: 0.3 + 1e-3 * K0.t, relToPhase: relS(K0.last.dphi, 0.3 + 1e-3 * K0.t, phScale), phaseScale: phScale,
    note: '周期が近いだけでは自動でロックしない(K=0 なら Δφ は離調×時間で漂う)' };
  // I5: エネルギー(供給なしで総 E が増えない)—— dt と dt/2
  const eA = run('E dt', D.K, D.gamma, 2.8, 0.05), eB = run('E dt/2', D.K, D.gamma, 2.8, 0.05, { dt: D.dt / 2, steps: steps * 2 });
  const energy = { dtWorstEtotUp: eA.worstEtotUp, dtHalfWorstEtotUp: eB.worstEtotUp,
    ratio: eB.worstEtotUp > 0 ? eA.worstEtotUp / eB.worstEtotUp : null, dtWorstEmechStepUp: eA.worstEmechStepUp, floor: LOCK_FLOORS.energyUp,
    EmechStart: eA.first.Emech, EmechEnd: eA.last.Emech, Qend: eA.last.Q, jsumDriftAbs: eA.worstJsumAbs };
  // I6: 閉形式 —— (a) γ=0・振幅 A の振り子の厳密周期 (b) 小振幅の減衰率 γ/(2μ)
  const A = 0.5, Om0 = Math.sqrt(D.K / mu), dtP = 0.005, nP = Math.round(60 / dtP);
  let zz = [A, 1, 0, 1, 0], tt = 0; const Pp = { Ip: D.Ip, Io: D.Io, K: D.K, gamma: 0 };
  const cross = [];
  for (let k = 0; k < nP; k++) {
    const zn = PB.rk4(L.lockToyDerivs, Pp, tt, zz, dtP);
    const f0 = zz[0] - zz[2], f1 = zn[0] - zn[2];
    if (f0 > 0 !== f1 > 0) cross.push(hermiteRoot(tt, tt + dtP, f0, f1, zz[1] - zz[3], zn[1] - zn[3]));
    zz = zn; tt += dtP;
  }
  const Tmeas = 2 * (cross[cross.length - 1] - cross[0]) / (cross.length - 1), Tcl = L.pendulumPeriod(A, Om0);
  const a0 = 1e-3, gs = 0.05, lam = gs / (2 * mu), wd = Math.sqrt(Om0 * Om0 - lam * lam);
  let z3 = [a0, 1, 0, 1, 0], t3 = 0; const Pd = { Ip: D.Ip, Io: D.Io, K: D.K, gamma: gs };
  const peaks = [];
  for (let k = 0; k < Math.round(80 / dtP); k++) {
    const zn = PB.rk4(L.lockToyDerivs, Pd, t3, z3, dtP);
    const d0 = z3[1] - z3[3], d1 = zn[1] - zn[3];
    if (d0 > 0 && d1 <= 0) {   // 極大(離調が + → − へ)—— 離調の Hermite 補間(微分は Δφ̈ = −(K sinΔφ + γΔω)/μ)で時刻、値は Δφ の Hermite
      const acc = (s) => -(D.K * Math.sin(s[0] - s[2]) + gs * (s[1] - s[3])) / mu;
      const tp = hermiteRoot(t3, t3 + dtP, d0, d1, acc(z3), acc(zn));
      const s = (tp - t3) / dtP, h = dtP, f0 = z3[0] - z3[2], f1 = zn[0] - zn[2];
      const s2 = s * s, s3 = s2 * s;
      peaks.push({ t: tp, v: (2 * s3 - 3 * s2 + 1) * f0 + (s3 - 2 * s2 + s) * h * d0 + (-2 * s3 + 3 * s2) * f1 + (s3 - s2) * h * d1 });
    }
    z3 = zn; t3 += dtP;
  }
  const lamMeas = Math.log(peaks[1].v / peaks[peaks.length - 1].v) / (peaks[peaks.length - 1].t - peaks[1].t);
  const closed = { pendulum: { A, Omega0: Om0, Tmeasured: Tmeas, Tclosed: Tcl, rel: rel(Tmeas, Tcl), crossings: cross.length, floor: LOCK_FLOORS.period },
    decay: { amplitude0: a0, gamma: gs, mu, lambdaClosed: lam, lambdaMeasured: lamMeas, rel: rel(lamMeas, lam), peaks: peaks.length,
      periodDampedClosed: 2 * Math.PI / wd, periodDampedMeasured: (peaks[peaks.length - 1].t - peaks[1].t) / (peaks.length - 2), floor: LOCK_FLOORS.decay } };
  // 符号の規約(共通座標 / 互いを向く局所軸)
  const conv3 = [
    { id: '同向(両軸 ẑ)・連結線 x̂', n1: [0, 0, 1], n2: [0, 0, 1], rhat: [1, 0, 0] },
    { id: '互いを向く(n1=x̂・n2=−x̂)', n1: [1, 0, 0], n2: [-1, 0, 0], rhat: [1, 0, 0] },
    { id: '同じ向きで連結線上(n1=n2=x̂)', n1: [1, 0, 0], n2: [1, 0, 0], rhat: [1, 0, 0] },
    { id: '逆向(n1=ẑ・n2=−ẑ)', n1: [0, 0, 1], n2: [0, 0, -1], rhat: [1, 0, 0] },
  ].map((c) => Object.assign({ id: c.id }, L.lockSign(c.n1, c.n2, c.rhat)));
  return { decl: Object.assign({ mu }, D), equivAxiswork: i1, sign, convergence: conv, noDamping: noDamp, K0drift: k0, energy, closed,
    signConvention: { rows: conv3, note: '符号は宣言(共通座標の軸の内積の符号 common か、相手を向く方向への射影の積の符号 local)。軸が連結線に垂直だと local は 0 で決まらない。既存物理が保証する普遍則ではない' } };
}

/* ── (J) html: dfmCoreAxisStep と coreAxisState(ソースを切り出して評価)・🪩 の宣言 ───── */
function sliceFunction(html, name) {
  const i = html.indexOf('\nfunction ' + name + '(');
  if (i < 0) return null;
  let j = html.indexOf('{', i), d = 0, k = j;
  for (; k < html.length; k++) { const c = html[k]; if (c === '{') d++; else if (c === '}') { d--; if (d === 0) break; } }
  return html.slice(i + 1, k + 1);
}
export function htmlFacts(html) {
  const s1 = sliceFunction(html, 'dfmCoreAxisStep'), s2 = sliceFunction(html, 'coreAxisState');
  if (!s1 || !s2) return { ok: false, reason: 'dfmCoreAxisStep / coreAxisState が見つからない' };
  const F = new Function(s1 + '\n' + s2 + '\nreturn { dfmCoreAxisStep, coreAxisState };')();
  const mock = (jx, jy, jz, az, om, t) => ({ hasCoreAxis: true, n: 1, t, coreAxM: [1], coreJx: [jx], coreJy: [jy], coreAxAz: [az], coreAxOm: [om],
    coreMF: [0.3], mEff: [2500], RcV: [7.5], coreIS: [1], coreJ: [jz], coreJm: [Math.hypot(jx, jy, jz)], coreMd: [1],
    axPrescLx: 0, axPrescLy: 0, axPrescE: 0, axPrescPx: 0, axPrescPy: 0, axPrescN: 0 });
  const az = 0.4, om = 0.03, t = 123.5, target = L.wrapPi(az + om * t);
  // 同じ宣言(az・Ω_p・t)で、前の方位と |J⊥| だけを変えた 4 つの状態
  const priors = [[3, 0], [0, 3], [-2.1, -2.1], [30, 40]].map(([jx, jy]) => {
    const S = mock(jx, jy, 1.2, az, om, t), r = F.dfmCoreAxisStep(S, 0.016);
    const phiOut = Math.atan2(S.coreJy[0], S.coreJx[0]);
    return { jx0: jx, jy0: jy, phiPriorDeg: Math.atan2(jy, jx) * 180 / Math.PI, phiOutDeg: phiOut * 180 / Math.PI,
      phiResidual: Math.abs(L.wrapPi(phiOut - target)), jPerpRel: rel(Math.hypot(S.coreJx[0], S.coreJy[0]), Math.hypot(jx, jy)),
      dE: r ? r.dE : null, prescribed: r ? r.prescribed : null };
  });
  const phiSpread = Math.max(...priors.map((p) => p.phiOutDeg)) - Math.min(...priors.map((p) => p.phiOutDeg));
  // 🪩 bhCoreTilt の宣言(退役・復活させない —— 宣言を読むだけ)
  const ip = html.indexOf('id:"bhCoreTilt"');
  const seg = ip >= 0 ? html.slice(ip, html.indexOf('\n{ id:', ip + 10) > 0 ? html.indexOf('\n{ id:', ip + 10) : ip + 20000) : '';
  const cm = seg.match(/core:\{([^}]*)\}/);
  const num = (k) => { const m = cm && cm[1].match(new RegExp('\\b' + k + ':\\s*(-?[\\d.]+)')); return m ? Number(m[1]) : null; };
  const retired = /familyRole:"retired"/.test(seg);
  const tilt = num('tilt'), Kcs = num('Kcs');
  let st = null;
  if (tilt !== null) {
    const th = tilt * Math.PI / 180, Jm = 1;
    const S = mock(Jm * Math.sin(th), 0, Jm * Math.cos(th), 0, 0, 0);
    S.coreAxM = [0];
    const a = F.coreAxisState(S, 0);
    st = { tiltDeg: a.tiltDeg, JzOverJ: a.Jz / a.Jmag, projX: a.projX, declared: a.declared, proxyOnly: a.proxyOnly };
  }
  return { ok: true, coreAxisStep: { az, omegaP: om, t, targetDeg: target * 180 / Math.PI, priors, phiSpreadDeg: phiSpread,
      note: 'φ(t)=az+Ω_p·t を外から指定する処理 —— 出力の方位は前の方位と |J⊥| に依らない(動的な歳差ではない)' },
    bhCoreTilt: { found: ip >= 0, retired, tilt, Kcs, state: st,
      note: '宣言を読むだけ(退役のまま・復活させない)。tilt=90° の J_z/|J| = cos 90° は機械ゼロ —— 2D の引きずりは z 射影しか読まない' } };
}

export function computeModel() {
  return { indexUnits: indexUnits(), chain: chainMain(), flagControls: flagControls(), chainBrake: chainBrake(), negativeDrive: negativeDrive(),
    separation: separation(), legacy: legacyCompare(), rigid: rigidControls(), heat: microHeat(), lock: lockToy() };
}
export function computeAll(html) { return Object.assign(computeModel(), { html: htmlFacts(html) }); }

const IS_MAIN = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (IS_MAIN) {
  const TARGET = process.env.QA_TARGET || 'beta/index.html';
  const OUT = path.join(ROOT, 'tests', 'out', 'spinprec-w288d.json');
  const W281A_SCOPE = w281aScopeStamp(path.join(ROOT, TARGET), REGEN_SCOPE);
  const t0 = Date.now();
  const html = fs.readFileSync(path.join(ROOT, TARGET), 'utf8');
  const R = computeAll(html);
  const CODE = ['tests/exp-w288d-spinprec.mjs', 'tests/lib-w288d-spinprec.mjs', 'tests/lib-w275e-powerball.mjs', 'tests/lib-w276c-axiswork.mjs',
    'tests/lib-w272e-provenance.mjs', 'tests/lib-w281a-scope.mjs'];
  const meta = Object.assign(provenanceMeta({ root: ROOT, wave: '第288便d', target: TARGET, inputs: [TARGET], code: CODE }), {
    harnessVersion: HARNESS_VERSION, libVersion: L.SPINPREC_VERSION,
    ruling: '原仮定者の裁定(第78報)⑥・統括の検証項目 R116',
    engine: 'なし(node 模型 —— html は dfmCoreAxisStep・coreAxisState のソースと 🪩 の宣言を文字列で読むだけ)',
    notClaim: ['歳差の発見', '潮汐ロックの成立', '腕の渦伸長による生成', 'DFM から導出した', 'エンジンに実装した', '新発見'] });
  const out = { meta, premise: L.SPINPREC_PREMISE, tolerances: { rel: REL_TOL, lockFloors: LOCK_FLOORS, engineFenceNotUsed: ENGINE_FENCE_NOT_USED }, ...R,
    elapsedS: null };
  out.elapsedS = (Date.now() - t0) / 1000;
  Object.assign(out.meta, W281A_SCOPE, w281aStableInputs(ROOT, out.meta.inputs));
  fs.mkdirSync(path.dirname(OUT), { recursive: true });
  fs.writeFileSync(OUT, JSON.stringify(out, null, 1) + '\n');
  const e = (x) => (x === null || x === undefined ? '—' : Number(x).toExponential(2));
  const C = R.chain;
  console.log(`[w288d] (A) 指標の単位不変: ${R.indexUnits.rows.map((r) => r.def + ' χ=' + r.chiSI.toPrecision(6) + ' rel ' + e(r.relDiff)).join(' / ')}`);
  console.log(`[w288d] (B) 連鎖: spinCap ${C.events.spinCap.measured}(閉 ${C.closedTimes.tSpinCap})・axisFull ${C.events.axisFull.measured}(閉 ${C.closedTimes.tAxisFull})・precCap ${C.events.precCap.measured}(閉 ${C.closedTimes.tPrecCap})・旗 ${C.events.stretch.measured}・順序 ${C.order}・閉形式 ${JSON.stringify(Object.fromEntries(Object.entries(C.worstClosedRel).map(([k, v]) => [k, e(v)])))}・恒等式 ${e(C.identity.worstResAbs)}・旗前の超過 ${e(C.spinAboveCapBeforeFlag)}`);
  console.log(`[w288d]     旗の負の対照: ${R.flagControls.map((r) => r.id + ' 旗 ' + r.stretchFlag).join(' / ')}`);
  console.log(`[w288d] (C) ブレーキ: 張り付く前 ${e(R.chainBrake.worstPreCapRel)}・順序 ${R.chainBrake.order}・恒等式 ${e(R.chainBrake.identity.worstResAbs)}・到達 ${R.chainBrake.spinCap.measured}(閉 ${R.chainBrake.spinCap.closed.toFixed(6)})`);
  console.log(`[w288d] (D) W<0: ω ${R.negativeDrive.omega0}→${R.negativeDrive.omegaEnd}・拒否 ${R.negativeDrive.refused}(閉 ${R.negativeDrive.refusedClosed})・閉形式 ${e(R.negativeDrive.worstClosedRel)}`);
  console.log(`[w288d] (E) 交差項 ${R.separation.cross.map((r) => r.thetaDeg + '° ' + e(r.crossRel)).join(' / ')}・|J|²/2I ${R.separation.jCompare.map((r) => r.id + ' ' + e(r.relDiff)).join(' / ')}`);
  console.log(`[w288d] (G) 剛体対照: powerball 駆動 ${e(R.rigid.powerballDrive.worstRel)}・ジャイロだけ |S| 漂い ${e(R.rigid.powerballGyroOnly.powerballSpinRelDrift)}(口座 ΔE ${R.rigid.powerballGyroOnly.accountEspinChange})・axiswork ${e(R.rigid.axiswork.worstRel)}/${e(R.rigid.axiswork.worstHeatRel)}`);
  console.log(`[w288d] (H) 熱: Q ${R.heat.Q.toFixed(6)}・J_net ${R.heat.Jnet}・加熱後 rel ${e(R.heat.QafterRel)}`);
  const Lk = R.lock;
  console.log(`[w288d] (I) ロック: 既存と ${e(Lk.equivAxiswork.worstRel)}・K+ dev ${e(Lk.sign.pos.devFinal)}・K− Δφ ${Lk.sign.neg.dphiFinalWrapped.toFixed(6)}・収束 ${Lk.convergence.map((r) => e(r.devFinal)).join('/')}・γ=0 振幅比 ${Lk.noDamping.map((r) => r.ampRatio.toFixed(4)).join('/')}・K=0 ${e(Lk.K0drift.relToPhase)}・E↑ ${e(Lk.energy.dtWorstEtotUp)}/${e(Lk.energy.dtHalfWorstEtotUp)}・周期 ${e(Lk.closed.pendulum.rel)}・減衰 ${e(Lk.closed.decay.rel)}`);
  console.log(`[w288d] (J) html: 方位の広がり ${R.html.coreAxisStep && R.html.coreAxisStep.phiSpreadDeg}°・🪩 tilt ${R.html.bhCoreTilt && R.html.bhCoreTilt.tilt} J_z/|J| ${R.html.bhCoreTilt && R.html.bhCoreTilt.state && e(R.html.bhCoreTilt.state.JzOverJ)}`);
  console.log('→ ' + path.relative(ROOT, OUT) + '(' + out.elapsedS.toFixed(1) + ' s)');
}
