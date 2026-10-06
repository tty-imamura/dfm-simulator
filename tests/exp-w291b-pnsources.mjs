// 第291便b(原仮定者の裁定(第81報)⑤「geoPN=1: 軌道計算を精査し、測地線化を GR の 1PN に揃える。観測値をそのまま使えるようにする。
//   現状は半径に関連する項が入っている」・統括の検証項目 R133)—— **kF0 の 1PN の源集合(全質量源)の器**。
//
// ■ 精査の結論(器が機械で示すこと): EIH 型の 1PN 加速度(html の `dfmPN1Delta` + `_core` の試験粒子形・参照実装
//   tests/lib-w285b-gr1pn.mjs の `eihAccel`)の式に天体半径は入っていない。半径が入っていたのは**源の選別**
//   `pnMassMin(p,R)=(RAY_ALPHA_MIN/4)·max(R,ε)·c²/G` だけで、これは光線描画の偏向角の省略基準(RAY_ALPHA_MIN=0.02 rad)である。
//   本便から kF0(geoPN=1 ∧ kFrame=0 と互換入力 geoPN=2 ∧ kFrame=0)の 1PN 源は**全質量源**(`pnOrbitalSource` —— 有限の正の質量 ∧
//   受理された試験粒子でない ∧ `pnSource:false` の明示で除外していない)。`S._core` は 1 命令も変えていない(`S.pnOv` のビット 2 を埋める)。
//
// ■ 何を測るか(Node だけ —— 対象 html と基点 html の inline script を tests/lib-w279b-headless.mjs で読む。物理コードは html の本文そのまま)
//   (A) 源の表: 内蔵全本を基点と現行で build し、kF0 か・粒子数・実効の 1PN 源の数(`pnSource`)を並べる(源が増えた本の列挙)。
//   (B) 前後: 内蔵全本を基点と現行で `SPEC.bitSteps` 步(dt=DT)走らせ、位置・速度・自転・半径・質量・t をビットで比べる。署名(presetSig)も。
//       **差は 1PN の源が増えた本だけ**(G=0・λ_PN=0・kF0 でない本は 1 bit 不変)を数で示す。
//   (C) 参照実装との照合: 全源が有効の同じ状態で、html の Δ(`dfmPN1Delta`)+ 試験粒子形(lib の `testFormSum`)と lib の `eihAccel`
//       (EIH を全体の形で書いた式)の最大絶対残差・相対残差。🥶 の初期状態・宣言の無い軽い 3 体(基点では源 0)・`pnSource:false` の除外・
//       ☄️ の水星に `pnSource:false` を明示した写し(固定源 1 つ → Δ≡0)。
//   (D) 半径だけを変えた回帰(SPEC.radius): G=1・c=100・m=1,2・r=10 の 2 体を R=0.001 と R=1 で組み、1 步(dt=1e−5)後の速度が
//       現行では半径に依らない(ビット一致)こと。基点では半径門で源の集合が変わるので一致しない(記録)。
//   (E) 🥶 の残差の分解: 閉じた式(lib-w280d-charoninput の `definitionMixAudit()` の closedFormPeriod・closedFormResidual)と、
//       初期状態の 1PN 加速度(基点 = 冥王星だけが源・現行 = 両方が源)の差の大きさ |δa|/|a_N| と、その P 倍(周期への寄与の**桁の目安**)。
//       解析の目安 P·GM/(c²a) も並べる。**この差(1PN の源集合の是正)は閉じた式の +7.2168 s を消さない**ことを数で示す(判定はしない)。
//   (F) 「GR 1PN 準拠」の表示条件(`pn1GRConformance`)の内蔵全本の集計(条件内の本・条件外の理由の度数 —— 表示だけ)。
//
// ■ 言わないこと: 「観測一致を達成した」「較正を完了した」「GR 1PN と同等が証明された」「7.22 秒の残差は数値誤差」「7.22 秒の残差を 1PN が消す」
//   「新発見」。質点 1PN を採るのは天体の大きさの効果(J₂・潮汐・スピン結合)を評価して省いたからではない(1.5PN も足さない)。
//
// 環境変数: `W291B_BASE_REV`(基点の版 —— 既定 cf2da0a)/ `W291B_BASE_HTML`(基点 html を既に持っているときのパス・ROOT 相対)/
//   `W291B_OUT`(任意 —— 正本以外へ書く試走)/ `QA_TARGET`(対象 html —— 既定 beta/index.html)。他の正本は読まない。
// 実行: node tests/exp-w291b-pnsources.mjs
// 出力: tests/out/pnsources-w291b.json(来歴 w272e-1・領域 hash つき)
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { loadHtmlHeadless } from './lib-w279b-headless.mjs';
import { provenanceMeta } from './lib-w272e-provenance.mjs';
import * as O from './lib-w285b-gr1pn.mjs';
import { definitionMixAudit } from './lib-w280d-charoninput.mjs';
import { scopeStamp as w281aScopeStamp, stableInputs as w281aStableInputs } from './lib-w281a-scope.mjs';
// 第281便a の規約: この器が読む html の領域(1 行の JSON —— `lint.regenScope` が機械の下限と照合する)
const REGEN_SCOPE = {"presets":"all","roots":["$","DT","GEO_MODE_VERSION","HP.allPresets","HP.dfmRelativeDragStep","HP.loadPreset","HP.relativeDragProbe","HP.sim","HP.validatePreset","LAWS","PN1_CONTRACT","PN1_EIH_VERSION","T","ch","clamp","ctx","dfmPN1Delta","dfmRelativeDragStep","pairCorePN","pn1GRConformance","pnOrbitalKF0","pnOrbitalSource","pnSource","presetSig"],"core":true,"consts":[],"complete":true};

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
export const HARNESS_VERSION = 'w291b-pnsources-3';   // 第293便(統合): 慣性決定力の本(relativeDrag.law:"inertial")は 1PN の源集合の契約の外(合成則の既定が変わると動く)— changedByInertialLaw に記録だけ   // 第292便(統合): 基点に無い本(newInNow)は差・署名の判定から外す(記録だけ)
/** 本器の宣言(前後の步数・半径回帰の系・🥶 の ID)。 */
export const SPEC = Object.freeze({
  bitSteps: 24,
  radius: Object.freeze({ G: 1, cLight: 100, m: [1, 2], r: 10, R: [0.001, 1], dt: 1e-5, softening: 0.01 }),
  charon: 'plutoCharonDiagInput', mercury: 'mercuryReal',
});
export const DO_NOT_WRITE = ['観測一致を達成した', '較正を完了した', 'GR 1PN と同等が証明された', '7.22 秒の残差は数値誤差', '7.22 秒の残差を 1PN が消す',
  '新発見', 'RC を切った'];
const J = (o) => JSON.stringify(o);
const sha = (abs) => crypto.createHash('sha256').update(fs.readFileSync(abs)).digest('hex');

const IS_MAIN = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);

/** 器の中の宇宙(内蔵ではない)。 */
function uni(id, bodies, ph) {
  return { id, name: id, emoji: '🧪', description: '第291便b 器の中の宇宙(内蔵ではない)', sampleClass: 'principle',
    world: { boundary: 'none', size: 0 }, camera: { scale: 20 },
    physics: Object.assign({ G: 1, cLight: 30, softening: 0.05, softeningFloor: 1e-9, kFrame: 0, q: 2, kRep: 0, muF: 0, gammaN: 0, kappaS: 0, etaRad: 0,
      lambdaPN: 1, pnAlpha: 1.5, stateCarry: 'double', frameWeight: 'share', timeScale: 1, massFloor: 1e-9, geoPN: 1 }, ph || {}),
    bodies: bodies.map((b) => Object.assign({ type: 'single', spin: 0, radius: 0.1, pinned: false }, b)) };
}

/** (A)(B)(F): 内蔵全本の源・前後の指紋・表示条件。 */
function bookTable(H, steps) {
  return H.evalExpr(`(()=>{ const out=[];
    const fp=(S)=>{ let a=0x811c9dc5>>>0; const buf=new ArrayBuffer(8), f=new Float64Array(buf), u=new Uint8Array(buf);
      const push=(v)=>{ f[0]=v; for(let b=0;b<8;b++){ a^=u[b]; a=Math.imul(a,0x01000193)>>>0; } };
      for(const k of ['x','y','vx','vy','spin','R','m']){ const A=S[k]; if(!A) continue; for(let i=0;i<S.n;i++) push(A[i]); }
      push(S.t); return a.toString(16); };
    for(const p of HP.allPresets()){
      let row={id:p.id, emoji:p.emoji||'', role:p.familyRole||null, cls:p.sampleClass||null};
      try{
        HP.loadPreset(p.id,false); const S=HP.sim, P=S.params;
        const kf0=(typeof pnOrbitalKF0==='function')? pnOrbitalKF0(P) : (P.geoPN>0 && P.geoPN<3 && !(P.kFrame>0));
        let src=0; for(let i=0;i<S.n;i++) if(pnSource(S,i)) src++;
        const conf=(typeof pn1GRConformance==='function' && kf0)? pn1GRConformance(S) : null;
        row=Object.assign(row,{n:S.n, geoPN:P.geoPN, kFrame:P.kFrame, lambdaPN:(P.lambdaPN===undefined?1:P.lambdaPN), G:P.G, kf0, src, inertial:!!(P.relativeDrag && P.relativeDrag.law==='inertial'),
          sig:presetSig(p), conf:conf? {ok:conf.ok, reasons:conf.reasons} : null});
        for(let k=0;k<${steps};k++) S.step(DT);
        row.fp=fp(S); row.nan=S.hasNaN();
      }catch(e){ row.err=String(e).slice(0,160); }
      out.push(row);
    }
    return out; })()`);
}

/** (C): html の Δ + 試験粒子形 と 参照 EIH の照合。build した状態から読む。 */
function oracleCase(H, label, preset, mutate) {
  const st = H.evalExpr(`(()=>{ let p=${J(preset)};
    if(typeof p==='string'){ p=JSON.parse(JSON.stringify(HP.allPresets().find((q)=>q.id===p))); }
    ${mutate || ''}
    const v=HP.validatePreset(p); if(!v.ok) return {err:JSON.stringify(v.errors)};
    HP.sim.build(v.preset); const S=HP.sim, n=S.n, DX=new Float64Array(n), DY=new Float64Array(n);
    const nAny=dfmPN1Delta(S,DX,DY);
    const conf=(typeof pn1GRConformance==='function')? pn1GRConformance(S) : null;
    return { n, nAny, DX:Array.from(DX), DY:Array.from(DY), m:Array.from(S.mEff.subarray(0,n)), x:Array.from(S.x.subarray(0,n)), y:Array.from(S.y.subarray(0,n)),
      vx:Array.from(S.vx.subarray(0,n)), vy:Array.from(S.vy.subarray(0,n)), pin:Array.from(S.pinned.subarray(0,n)).map(Boolean),
      src:[...Array(n).keys()].map((i)=>pnSource(S,i)), eps:S.params.softening, c:S.params.cLight, G:S.params.G,
      lam:(S.params.lambdaPN===undefined?1:S.params.lambdaPN), alpha:(S.params.pnAlpha===undefined?1.5:S.params.pnAlpha),
      conf:conf? {ok:conf.ok, reasons:conf.reasons, nMass:conf.nMass, nSources:conf.nSources} : null }; })()`);
  if (st.err) return { label, err: st.err };
  const bodies = st.m.map((m, i) => ({ m, x: st.x[i], y: st.y[i], vx: st.vx[i], vy: st.vy[i], source: st.src[i], pinned: st.pin[i] }));
  const o = { G: st.G, c: st.c, lambda: st.lam, gamma: st.alpha - 0.5, eps: st.eps };
  const full = O.eihAccel(bodies, o), tf = O.testFormSum(bodies, o);
  let maxAbs = 0, maxPn = 0;
  for (let i = 0; i < st.n; i++) {
    maxAbs = Math.max(maxAbs, Math.hypot(tf[i].ax + st.DX[i] - full[i].pnx, tf[i].ay + st.DY[i] - full[i].pny));
    maxPn = Math.max(maxPn, Math.hypot(full[i].pnx, full[i].pny));
  }
  return { label, n: st.n, sources: st.src.filter(Boolean).length, srcFlags: st.src, nAny: st.nAny,
    deltaZero: st.DX.every((v) => v === 0) && st.DY.every((v) => v === 0), maxAbs, maxPn, rel: maxPn > 0 ? maxAbs / maxPn : 0, conf: st.conf };
}

/** (D): 半径だけを変えた回帰(1 步後の速度)。 */
function radiusRun(H) {
  const R = SPEC.radius;
  const mk = (rad) => uni('w291b_rad', [
    { m: R.m[0], x: -R.r * R.m[1] / (R.m[0] + R.m[1]), y: 0, vx: 0, vy: -0.25, radius: rad },
    { m: R.m[1], x: R.r * R.m[0] / (R.m[0] + R.m[1]), y: 0, vx: 0, vy: 0.125, radius: rad }],
  { G: R.G, cLight: R.cLight, softening: R.softening, softeningFloor: R.softening, massFloor: 1e-6 });
  const out = {};
  for (const rad of R.R) {
    out[String(rad)] = H.evalExpr(`(()=>{ const v=HP.validatePreset(${J(mk(rad))}); if(!v.ok) return {err:JSON.stringify(v.errors)};
      HP.sim.build(v.preset); const S=HP.sim; let src=0; for(let i=0;i<S.n;i++) if(pnSource(S,i)) src++;
      const R0=S.R[0]; S.step(${R.dt}); return { vx:[S.vx[0],S.vx[1]], vy:[S.vy[0],S.vy[1]], x:[S.x[0],S.x[1]], src, R:R0, t:S.t }; })()`);
  }
  const a = out[String(R.R[0])], b = out[String(R.R[1])];
  const same = !a.err && !b.err && [0, 1].every((i) => Object.is(a.vx[i], b.vx[i]) && Object.is(a.vy[i], b.vy[i]));
  const dv = (!a.err && !b.err) ? Math.max(...[0, 1].map((i) => Math.hypot(a.vx[i] - b.vx[i], a.vy[i] - b.vy[i]))) : null;
  return { runs: out, velocitiesBitSame: same, maxDv: dv };
}

/** (E): 🥶 の初期状態の 1PN 加速度(実効の源で)。 */
function charonPN(H) {
  return H.evalExpr(`(()=>{ HP.loadPreset(${J(SPEC.charon)},false); const S=HP.sim, n=S.n, DX=new Float64Array(n), DY=new Float64Array(n);
    dfmPN1Delta(S,DX,DY);
    return { DX:Array.from(DX), DY:Array.from(DY), m:Array.from(S.mEff.subarray(0,n)), x:Array.from(S.x.subarray(0,n)), y:Array.from(S.y.subarray(0,n)),
      vx:Array.from(S.vx.subarray(0,n)), vy:Array.from(S.vy.subarray(0,n)), src:[...Array(n).keys()].map((i)=>pnSource(S,i)),
      eps:S.params.softening, c:S.params.cLight, G:S.params.G, T:(HP.allPresets().find((q)=>q.id===${J(SPEC.charon)}).scaleExp||{}).T }; })()`);
}
function pn1Total(st) {
  const bodies = st.m.map((m, i) => ({ m, x: st.x[i], y: st.y[i], vx: st.vx[i], vy: st.vy[i], source: st.src[i], pinned: false }));
  const o = { G: st.G, c: st.c, lambda: 1, gamma: 1, eps: st.eps };
  const tf = O.testFormSum(bodies, o);
  return { a: bodies.map((_, i) => [tf[i].ax + st.DX[i], tf[i].ay + st.DY[i]]), bodies };
}

if (IS_MAIN) {
  const t0 = Date.now();
  const log = (...a) => console.error('[w291b]', ((Date.now() - t0) / 1000).toFixed(0) + 's', ...a);
  const TARGET = process.env.QA_TARGET || 'beta/index.html';
  const OUT = process.env.W291B_OUT ? path.resolve(ROOT, process.env.W291B_OUT) : path.join(ROOT, 'tests', 'out', 'pnsources-w291b.json');
  const BASE_REV = process.env.W291B_BASE_REV || 'cf2da0a';
  const W281A_SCOPE = w281aScopeStamp(path.join(ROOT, TARGET), REGEN_SCOPE);
  const htmlAbs = path.join(ROOT, TARGET);
  let baseAbs, tmpDir = null;
  if (process.env.W291B_BASE_HTML) baseAbs = path.join(ROOT, process.env.W291B_BASE_HTML);
  else {
    fs.mkdirSync(path.join(ROOT, 'tests', 'out'), { recursive: true });
    tmpDir = fs.mkdtempSync(path.join(ROOT, 'tests', 'out', '.w291b-pnsrc-'));
    baseAbs = path.join(tmpDir, 'base.html');
    fs.writeFileSync(baseAbs, execFileSync('git', ['-C', ROOT, 'show', BASE_REV + ':beta/index.html'], { maxBuffer: 64 << 20 }));
  }
  const baseSha = sha(baseAbs), nowSha = sha(htmlAbs);
  const HN = loadHtmlHeadless(htmlAbs);
  const HB = loadHtmlHeadless(baseAbs);
  if (tmpDir) fs.rmSync(tmpDir, { recursive: true, force: true });
  if (!HN.HP || !HB.HP) throw new Error('HP が無い');

  // ---- (A)(B)(F)
  const TN = bookTable(HN, SPEC.bitSteps), TB = bookTable(HB, SPEC.bitSteps);
  const bm = new Map(TB.map((r) => [r.id, r]));
  const rows = TN.map((r) => {
    const b = bm.get(r.id) || {};
    return { id: r.id, emoji: r.emoji, role: r.role, cls: r.cls, n: r.n, geoPN: r.geoPN, kFrame: r.kFrame, lambdaPN: r.lambdaPN, G: r.G, kf0: r.kf0,
      srcBase: b.src === undefined ? null : b.src, srcNow: r.src, srcIncreased: (b.src !== undefined && r.src > b.src),
      inBase: bm.has(r.id), inertialLaw: !!r.inertial, bitSame: !r.err && !b.err && r.fp === b.fp, sigSame: bm.has(r.id) ? r.sig === b.sig : null, nan: !!r.nan, conf: r.conf, err: r.err || b.err || null };
  });
  // 第292便(統合): 基点の html に無い本(新設の本)は「前後」の判定の外(newInNow に記録だけ・差にも署名の不一致にも数えない)
  const newInNow = rows.filter((r) => !r.inBase).map((r) => r.id);
  // 第293便(統合): 慣性決定力の本は 1PN の源集合とは別の法則(合成則)で動くので「差」に数えず記録だけ(changedByInertialLaw)
  const changedByInertialLaw = rows.filter((r) => r.inBase && !r.bitSame && r.inertialLaw).map((r) => r.id);
  const changed = rows.filter((r) => r.inBase && !r.bitSame && !r.inertialLaw).map((r) => r.id);
  const increased = rows.filter((r) => r.srcIncreased).map((r) => r.id);
  const changedNotIncreased = changed.filter((id) => !increased.includes(id));
  const increasedUnchanged = increased.filter((id) => !changed.includes(id));
  const nullPhysics = rows.filter((r) => r.kf0 && (!(r.G > 0) || !(r.lambdaPN > 0))).map((r) => r.id);
  const confRows = rows.filter((r) => r.conf);
  const reasonTally = {};
  for (const r of confRows) for (const k of r.conf.reasons) reasonTally[k] = (reasonTally[k] || 0) + 1;
  const A = { n: rows.length, kf0Books: rows.filter((r) => r.kf0).length, increased, increasedN: increased.length };
  const B = { steps: SPEC.bitSteps, dt: HN.evalExpr('DT'), bitSame: rows.filter((r) => r.bitSame).length, changed, changedNotIncreased, increasedUnchanged,
    sigSame: rows.filter((r) => r.sigSame === true).length, sigDiff: rows.filter((r) => r.inBase && !r.sigSame).map((r) => r.id), newInNow, changedByInertialLaw, nullPhysicsKF0: nullPhysics,
    errors: rows.filter((r) => r.err && r.inBase).map((r) => r.id + ': ' + r.err), nanNow: rows.filter((r) => r.nan).map((r) => r.id) };
  const F = { conformant: confRows.filter((r) => r.conf.ok).map((r) => r.id), outside: confRows.filter((r) => !r.conf.ok).map((r) => ({ id: r.id, reasons: r.conf.reasons })),
    reasonTally, note: '表示だけ(実行は禁止しない)—— 条件内でも観測一致の主張ではない' };
  log(`(A) 源が増えた本 ${increased.length}: ${increased.join(',')}`);
  log(`(B) ${SPEC.bitSteps} 步 ${B.bitSame}/${rows.length}・差 ${changed.length}(源が増えていない差 ${changedNotIncreased.length})・署名 ${B.sigSame}/${rows.length}`);

  // ---- (C)
  const C = [];
  C.push(oracleCase(HN, '🥶 の初期状態(全源)', SPEC.charon));
  const three = uni('w291b_three', [{ m: 30, x: 0, y: 0, vx: 0.1, vy: -0.2, radius: 10 }, { m: 10, x: 28, y: 3, vx: -0.2, vy: 0.6, radius: 10 },
    { m: 5, x: -25, y: 26, vx: 0.5, vy: 0.3, radius: 10 }]);
  C.push(oracleCase(HN, '宣言の無い 3 体(半径 10 —— 基点では半径門で源 0)', three));
  const threeOff = JSON.parse(J(three)); threeOff.bodies[2].pnSource = false;
  C.push(oracleCase(HN, '同じ 3 体の 3 体目に pnSource:false(除外)', threeOff));
  C.push(oracleCase(HN, '☄️ の水星に pnSource:false(固定源 1 つ → Δ≡0)', SPEC.mercury, 'p.bodies[1].pnSource=false;'));
  const Cb = oracleCase(HB, '基点: 宣言の無い 3 体', three);
  const Cs = { maxRel: Math.max(...C.filter((z) => !z.err && z.maxPn > 0).map((z) => z.rel)), maxAbs: Math.max(...C.filter((z) => !z.err).map((z) => z.maxAbs)),
    mercuryDeltaZero: C[3].deltaZero === true, threeAllSources: C[1].sources === 3, threeOffSources: C[2].sources === 2, baseThreeSources: Cb.sources };
  log(`(C) 照合 最大相対 ${Cs.maxRel.toExponential(2)}・最大絶対 ${Cs.maxAbs.toExponential(2)}・☄️(水星 false)Δ≡0 ${Cs.mercuryDeltaZero}・3 体の源 ${C[1].sources}(基点 ${Cb.sources})`);

  // ---- (D)
  const Dn = radiusRun(HN), Db = radiusRun(HB);
  const D = { spec: SPEC.radius, now: Dn, base: Db, ok: Dn.velocitiesBitSame === true };
  log(`(D) 半径回帰: 現行 ${Dn.velocitiesBitSame}(源 ${Dn.runs['0.001'].src}/${Dn.runs['1'].src})・基点 ${Db.velocitiesBitSame}(源 ${Db.runs['0.001'].src}/${Db.runs['1'].src}・|Δv| ${Db.maxDv})`);

  // ---- (E)
  const audit = definitionMixAudit();
  const cn = charonPN(HN), cb = charonPN(HB);
  const pn = pn1Total(cn), pb = pn1Total(cb);
  const aN = (() => { const dx = cn.x[1] - cn.x[0], dy = cn.y[1] - cn.y[0], r2 = dx * dx + dy * dy + cn.eps * cn.eps; return cn.G * cn.m[0] / r2; })();
  const dA = Math.max(...[0, 1].map((i) => Math.hypot(pn.a[i][0] - pb.a[i][0], pn.a[i][1] - pb.a[i][1])));
  const aPnNow = Math.max(...[0, 1].map((i) => Math.hypot(pn.a[i][0], pn.a[i][1])));
  const Psec = audit.closedFormPeriod, aKm = audit.aPlu060MeanKm, gm = audit.gmPlu060, cKm = cn.c * Math.pow(10, 5 - (cn.T || 1)) / 1e3;   // 精密単位 L=5・T=1 → km/s
  const E = {
    closedFormPeriod: audit.closedFormPeriod, closedFormResidual: audit.closedFormResidual, closedFormGMSigmaReading: audit.closedFormGMSigmaReading,
    sourcesBase: cb.src, sourcesNow: cn.src,
    pn1FracNow: aPnNow / aN, deltaFrac: dA / aN, periodScaleSec: Psec * dA / aN,
    analyticScaleSec: Psec * gm / (cKm * cKm * aKm), cKmPerS: cKm,
    note: '周期への寄与は |δa|/|a_N| × P の**桁の目安**(走行した周期の差ではない)。閉じた式の差 +7.2168 s は GM と a の算術で、1PN の源集合の是正では消えない',
  };
  log(`(E) 🥶 源 ${cb.src.filter(Boolean).length}→${cn.src.filter(Boolean).length}・|δa|/|a_N| ${E.deltaFrac.toExponential(2)}・P 倍 ${E.periodScaleSec.toExponential(2)} s・解析の目安 ${E.analyticScaleSec.toExponential(2)} s・閉じた式 +${audit.closedFormResidual.sec.toFixed(6)} s`);

  const verdict = {
    changedOnlyWhereSourcesIncreased: changedNotIncreased.length === 0,
    // 源が増えても値が動かない本(固定源 + 極小質量の受け手 —— 増えた源の Φ が 1 ulp 未満)は記録だけ(判定ではない)
    increasedButBitSame: increasedUnchanged,
    sigAllSame: B.sigDiff.length === 0,
    oracle1e12: Cs.maxRel <= 1e-12, mercuryDeltaZero: Cs.mercuryDeltaZero, radiusIndependent: D.ok,
    charonIsSource: cn.src.every(Boolean), pn1BelowResidual: E.periodScaleSec < 1e-3 * Math.abs(audit.closedFormResidual.sec),
  };
  const CODE = ['tests/exp-w291b-pnsources.mjs', 'tests/lib-w285b-gr1pn.mjs', 'tests/lib-w282b-geo1.mjs', 'tests/lib-w280d-charoninput.mjs', 'tests/lib-w277b-charondfm.mjs',
    'tests/lib-w279b-headless.mjs', 'tests/lib-w272e-provenance.mjs', 'tests/lib-w281a-scope.mjs'];
  const out = {
    meta: Object.assign(provenanceMeta({ root: ROOT, wave: '第291便b', target: TARGET, code: CODE, inputs: [TARGET] }), {
      harnessVersion: HARNESS_VERSION, loadErrors: HN.errors.length,
      ruling: '原仮定者の裁定(第81報)⑤「geoPN=1: 軌道計算を精査し、測地線化を GR の 1PN に揃える。観測値をそのまま使えるようにする」',
      reading: '統括の検証項目 R133(GR 1PN の源集合 —— 軌道の EIH は全質量源・描画の光線門は不変 —— と 🥶 の残差の分解)',
      engine: 'Node の headless(tests/lib-w279b-headless.mjs —— html の本文をそのまま実行)', baseRev: BASE_REV, notClaim: DO_NOT_WRITE }),
    spec: SPEC, htmlPn1Version: HN.evalExpr('PN1_EIH_VERSION'), contract: HN.evalExpr('JSON.parse(JSON.stringify(PN1_CONTRACT))'),
    base: { rev: BASE_REV, sha256: baseSha, pn1Version: HB.evalExpr('PN1_EIH_VERSION'), note: '基点 html は git show の一時ファイル(終了後に削除)' }, nowSha256: nowSha,
    A, B, C: { cases: C, base: Cb, summary: Cs }, D, E, F, rows, verdict, doNotWrite: DO_NOT_WRITE,
    headless: { now: { wallSec: HN.ms / 1000, errors: HN.errors.length }, base: { wallSec: HB.ms / 1000, errors: HB.errors.length } },
    elapsedS: (Date.now() - t0) / 1000 };
  Object.assign(out.meta, W281A_SCOPE, w281aStableInputs(ROOT, out.meta.inputs));
  fs.mkdirSync(path.dirname(OUT), { recursive: true });
  fs.writeFileSync(OUT, JSON.stringify(out, null, 1) + '\n');
  log('判定 ' + J(verdict));
  log('→ ' + path.relative(ROOT, OUT) + '(' + out.elapsedS.toFixed(1) + ' s)');
}
