// 第324便b(決断事項 AN514・AN515・統括の検証項目 R280 —— geoPN=3 の S3): **天体ごとの観測の自転 obsSpin と源の角運動量 J の本の器**
//   (段 obsspin-324b —— 正本 tests/out/obsspin-w324b.json)。
//
// Node だけ(対象 html の inline script を tests/lib-w280b-emgrid.mjs の loadHtmlMain で読み、validatePreset・presetSig・coord3d.makeSim・build・step と
// 読み口 HP.obsSpin.state・inertialDragIsqState をそのまま呼ぶ —— 1 本の走行は第321便b の器の runBook)。走行は子プロセス(W324B_WORKERS —— 既定 2)。
//
// ■ 段
//   A 受理の表(AN515 の細目): J0737 の本から組んだ 32 の場合(排他・必須の欄・単位・axis:null・二形式・0.4 を補わない・未知の鍵・二次元の本・S.spin へ写す宣言・
//     源の経路 kind "obsSpin" の突き合わせ)の受理・拒否・欠測と理由の文の頭。受理した場合は正準形(axis の単位ベクトル・鍵の順に依らない署名)・Hz と rad/s の同じ ω・
//     J の大きさ + axis と Jvec の同じ J・S.spin が欄の無い本と同じ(初期)・読み口の欠測の印を見る。
//   B 本の宣言: 📟(第321便b の兄弟の写しの列 tr との差は relativeDrag の spinDrag・sourceMoment と天体の obsSpin だけ・axis:null・状態の自転 0・受理の警告は R_d > R の 2 行だけ)・
//     🔸(🔶 との差は relativeDrag の spinDrag・sourceMoment だけ・🔶 は並進だけのまま)。
//   E 走行(子プロセス): 系 × 列 × 刻み × 窓 8 公転(遠点から)。J0737: self・tr・off・g1・JA(A の軸 +z を仮定)・JAm(−z)・JAvec(kind J の Jvec)・JAB(B の軸も仮定)/
//     α Cen: self(🔸)・tr(🔶)・on(🔶 + spinDrag)・off・Jm(自転の符号を反転)。
//   L J の口座(主のプロセス —— 1 公転): 源の J が固定の貯蔵庫であること(読み口の J ベクトル・源の Ω_src が步で変わらない)・状態の自転と軸が変わらない・
//     移送の帳簿(引きずりが軌道へ移した角運動量)。
//   T 量ごとの表: 列の差(近点の率〔離心ベクトルの回帰が主・検出器 B が副〕・周期・離心率)× 刻み h・h/2・h/4(刻みの感度診断)・符号の反転・
//     J0737 の (self − off)/(g1 − off) と 1 + (4/3)η。
//
// ■ 試走: W324B_QUICK=1(W324B_OUT が要る —— 正本を書かない・窓 3 公転・刻み h・h/2・列を減らす)。W324B_WORKERS(既定 2)。W324B_TARGET(既定 beta/index.html)。
// ■ 言わないこと: lib の NOT_CLAIM(観測の J を源の自転を計算したと書かない・f を観測された構造係数と呼ばない・連星の観測との照合ではない・近点の移動の原因を述べない・
//   h・h/2・h/4 を収束の判定に使わない・軸を仮定した列を本の既定と呼ばない)。
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { loadHtmlMain } from './lib-w280b-emgrid.mjs';
import { provenanceMeta } from './lib-w272e-provenance.mjs';
import { scopeStamp as w281aScopeStamp, stableInputs as w281aStableInputs } from './lib-w281a-scope.mjs';
import * as L from './lib-w321b-geo3bin.mjs';
import * as O from './lib-w324b-obsspin.mjs';
import { runBook } from './exp-w321b-geo3bin.mjs';
// 第281便a の領域 hash の宣言(器と lib から deriveScope で引いた下限 —— 本は .find で引く 2 本と元の本・import した器と lib が文字列で名指しする本。
//   HP.obsSpin は object の後に足した口なので下限の機械の読みに出ない —— 読み口と受理・步の関数を roots に名指しで足した〔広めの宣言〕)
const REGEN_SCOPE = {"presets":["alphaCenAB","alphaCenABInertial3d","alphaCenABInertial3dJ","binary","boxBinaryToy","compactForceToy","coord3dKeplerTilt","coord3dSpinPrecess","fig8","gw150914","inertialDragPair","psrB1534","psrDoubleAB","psrDoubleABInertial3d","psrJ1757DFM","psrJ1946DFM","siriusAB","spinDipoleBinary"],"roots":["$","HP.MASS_BASIS","HP.REL_DRAG_INVSQ_VERSION","HP.allPresets","HP.coord3d","HP.dfmMeshVelocityFieldAt","HP.geoEffectiveMode","HP.geoLawOfSim","HP.geoModeOf","HP.inertialDragIsqState","HP.inertialDragLedgerOf","HP.presetSig","HP.sim","HP.validatePreset","OBS_SPIN_FRAMES","OBS_SPIN_F_MAX","OBS_SPIN_KEYS","OBS_SPIN_KINDS","OBS_SPIN_SRC_KIND","OBS_SPIN_UNITS","OBS_SPIN_VERSION","T","calTargetOf","ctx","cw","obsSpinCoreSpin","obsSpinCrossCheck","obsSpinPrepare","obsSpinRowOf","obsSpinSrcOn","obsSpinSrcRadii","obsSpinState","obsSpinUsable","pnSource","validateObsSpinBody"],"core":true,"consts":[],"complete":true};

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
export const HARNESS_VERSION = 'w324b-obsspin-1';
const IS_MAIN = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
const clone = (x) => JSON.parse(JSON.stringify(x));
export const OUT_MAIN = 'tests/out/obsspin-w324b.json';
const J_COLS = Object.freeze({ j0737: Object.freeze([['self', [1, 2, 4]], ['tr', [1]], ['off', [1, 2, 4]], ['g1', [1, 2, 4]], ['JA', [1, 2, 4]], ['JAm', [1]], ['JAvec', [1]], ['JAB', [1, 2]]]),
  acen: Object.freeze([['self', [1, 2, 4]], ['tr', [1, 2, 4]], ['on', [1]], ['off', [1]], ['Jm', [1]]]) });
const J_COLS_QUICK = Object.freeze({ j0737: Object.freeze([['self', [1, 2]], ['tr', [1]], ['JA', [1, 2]], ['JAm', [1]]]), acen: Object.freeze([['self', [1, 2]], ['tr', [1, 2]], ['Jm', [1]]]) });
export const PLAN = Object.freeze({ N: 8, apsisK: 3, cols: J_COLS, ledgerOrbits: 1 });
export const QUICK = Object.freeze({ N: 3, apsisK: 3, cols: J_COLS_QUICK, ledgerOrbits: 1 });

/* ───────── 本の引き方 ───────── */
const finderOf = (HP) => (id) => HP.allPresets().find((p) => p.id === id) || null;
export const specKey = (s) => s.sys + '|' + s.col + '|div=' + s.div + '|N=' + s.N;
export function runSpec(HP, sp) {
  const find = finderOf(HP), base = find(O.BASE_OF[sp.sys]), h = base.physics.stepDt, P0 = L.osc0Of(base).P;
  const r = runBook(HP, O.colBook(sp.sys, sp.col, find), { dt: h / sp.div, N: sp.N, K: sp.K, P0 });
  return Object.assign({ key: specKey(sp), spec: sp, h }, r);
}
const rel = (a, b) => (a === b) ? 0 : Math.abs(a - b) / Math.max(Math.abs(a), Math.abs(b));

/* ───────── 段 A 受理の表 ───────── */
export function partA(HP) {
  const find = finderOf(HP), book = clone(find('psrDoubleABInertial3d')), rows = [], acc = {};
  for (const cs of O.CASES) {
    const c = O.caseOf(book, cs.key, find), v = HP.validatePreset(clone(c)), err = v.ok ? null : String((v.errors || [])[0] || '');
    const row = { key: cs.key, ja: cs.ja, expect: cs.expect, accepted: v.ok === true, err: err ? err.slice(0, 200) : null };
    if (v.ok) {
      const S = HP.coord3d.makeSim(); S.build(clone(v.preset));
      const st = HP.obsSpin.state(S), os0 = v.preset.bodies[0].obsSpin || null;
      row.missingA = st ? st.rows.find((z) => z.i === 0).missing : null;
      row.usedA = st ? st.rows.find((z) => z.i === 0).usedAsSource : null;
      row.canonA = os0;
      row.JSI_A = st ? st.rows.find((z) => z.i === 0).JSI : null;
      row.spin0 = Array.from(S.spin); row.bodiesSpin = v.preset.bodies.map((b) => b.spin);
      row.sig = HP.presetSig(clone(c));
      acc[cs.key] = row;
    }
    const got = !v.ok ? 'reject' : (row.missingA ? 'missing' : 'accept');
    row.got = got;
    row.whyOk = cs.expect === 'reject' ? (!!err && err.indexOf(cs.why) >= 0) : true;
    row.ok = got === cs.expect && row.whyOk;
    rows.push(row);
  }
  // 正準形と同じ値の照合(受理した場合どうし)
  const shuffled = clone(O.caseOf(book, 'axisA', find)); { const a = shuffled.bodies[0].obsSpin, r = {}; for (const k of Object.keys(a).reverse()) r[k] = a[k]; shuffled.bodies[0].obsSpin = r; }
  const X = {
    axisNormUnit: !!(acc.axisNorm && JSON.stringify(acc.axisNorm.canonA.axis) === '[0,0,1]'),
    axisNormSig: !!(acc.axisNorm && acc.axisA && acc.axisNorm.sig === acc.axisA.sig),
    keyOrderSig: !!acc.axisA && HP.presetSig(clone(shuffled)) === acc.axisA.sig,
    hzRadps: !!(acc.radps && acc.axisA && rel(acc.radps.JSI_A, acc.axisA.JSI_A) < 1e-12),
    jForms: !!(acc.Jaxis && acc.Jvec && acc.axisA && rel(acc.Jaxis.JSI_A, acc.axisA.JSI_A) < 1e-12 && rel(acc.Jvec.JSI_A, acc.axisA.JSI_A) < 1e-12),
    spinUntouched: Object.values(acc).every((r) => r.spin0.every((z) => z === 0) && r.bodiesSpin.every((z) => z === 0)),
    usedOnlyWithAxis: !!(acc.book && acc.axisA && acc.metaOnly && acc.book.usedA === false && acc.axisA.usedA === true && acc.metaOnly.usedA === false) };
  return { rows, n: rows.length, nOk: rows.filter((r) => r.ok).length, checks: X };
}

/* ───────── 段 B 本の宣言 ───────── */
const omit = (o, ks) => { const c = clone(o); for (const k of ks) delete c[k]; return c; };
export function partB(HP) {
  const find = finderOf(HP), out = {};
  {
    const p = find('psrDoubleABInertial3d'), v = HP.validatePreset(clone(p)), sib = L.siblingOf(clone(find('psrDoubleAB')), 'tr'), E = O.DECL_EXPECT.j0737;
    const rdP = p.physics.relativeDrag, rdS = sib.physics.relativeDrag;
    const physSame = JSON.stringify(omit(p.physics, ['relativeDrag'])) === JSON.stringify(omit(sib.physics, ['relativeDrag']));
    const rdSame = JSON.stringify(omit(rdP, ['spinDrag', 'invSq'])) === JSON.stringify(omit(rdS, ['spinDrag', 'invSq'])) && JSON.stringify(omit(rdP.invSq, ['sourceMoment'])) === JSON.stringify(rdS.invSq);
    const bodiesSame = JSON.stringify(p.bodies.map((b) => omit(b, ['obsSpin']))) === JSON.stringify(sib.bodies);
    const restSame = ['timeRef', 'scaleExp', 'world', 'camera', 'overlays'].every((k) => JSON.stringify(p[k]) === JSON.stringify(sib[k]));
    const S = v.ok ? (() => { const s = HP.coord3d.makeSim(); s.build(clone(v.preset)); return s; })() : null, st = S ? HP.obsSpin.state(S) : null;
    out.j0737 = { id: p.id, emoji: p.emoji, accepted: v.ok === true, warnings: (v.warnings || []).length, warnRdOnly: (v.warnings || []).every((w) => String(w).indexOf('R_d =') >= 0),
      physSame, rdSame, bodiesSame, restSame, srcKind: rdP.invSq.sourceMoment && rdP.invSq.sourceMoment.kind, spinDrag: rdP.spinDrag || null,
      axisNull: p.bodies.every((b) => b.obsSpin && b.obsSpin.axis === null), fSrc: p.bodies.map((b) => b.obsSpin.fSrc), spins: p.bodies.map((b) => b.spin),
      obsState: st ? st.rows.map((z) => ({ i: z.i, missing: z.missing, used: z.usedAsSource, JSI: z.JSI, omegaSI: z.omegaSI, RsrcBook: z.RsrcBook, Jbook: z.Jbook })) : null,
      fLS05: { A: O.fLS05(p.bodies[0].m * 1e27 / O.J0737_SPIN.mSun, O.J0737_SPIN.rObsM / 1e3), B: O.fLS05(p.bodies[1].m * 1e27 / O.J0737_SPIN.mSun, O.J0737_SPIN.rObsM / 1e3) },
      sibling: 'psrDoubleAB → 第321便b の列 tr', familyOk: p.familyId === find('psrDoubleAB').familyId && p.familyRole === 'variant', sampleClass: p.sampleClass };
    out.j0737.declOk = out.j0737.accepted && out.j0737.warnings === E.warnings && out.j0737.warnRdOnly && physSame && rdSame && bodiesSame && restSame && out.j0737.srcKind === E.srcKind
      && JSON.stringify(out.j0737.spinDrag) === JSON.stringify(E.spinDrag) && out.j0737.axisNull && out.j0737.spins.every((z) => z === 0) && out.j0737.familyOk && out.j0737.sampleClass === 'principle'
      && Math.abs(out.j0737.fSrc[0] - out.j0737.fLS05.A) < 5e-4 && Math.abs(out.j0737.fSrc[1] - out.j0737.fLS05.B) < 5e-4;
  }
  {
    const p = find('alphaCenABInertial3dJ'), t = find('alphaCenABInertial3d'), v = HP.validatePreset(clone(p)), E = O.DECL_EXPECT.acen;
    const rdP = p.physics.relativeDrag, rdT = t.physics.relativeDrag;
    const physSame = JSON.stringify(omit(p.physics, ['relativeDrag'])) === JSON.stringify(omit(t.physics, ['relativeDrag']));
    const rdSame = JSON.stringify(omit(rdP, ['spinDrag', 'invSq'])) === JSON.stringify(omit(rdT, ['spinDrag', 'invSq'])) && JSON.stringify(omit(rdP.invSq, ['sourceMoment'])) === JSON.stringify(rdT.invSq);
    const bodiesSame = JSON.stringify(p.bodies) === JSON.stringify(t.bodies);
    const restSame = ['timeRef', 'scaleExp', 'world', 'camera', 'overlays', 'familyId', 'group', 'fidelity', 'sampleClass', 'referenceKind'].every((k) => JSON.stringify(p[k]) === JSON.stringify(t[k]));
    const S = v.ok ? (() => { const s = HP.coord3d.makeSim(); s.build(clone(v.preset)); return s; })() : null;
    const sm = rdP.invSq.sourceMoment || {}, T = S ? HP.inertialDragIsqState(S) : null;
    out.acen = { id: p.id, emoji: p.emoji, accepted: v.ok === true, warnings: (v.warnings || []).length, physSame, rdSame, bodiesSame, restSame, srcKind: sm.kind, f: sm.f || null,
      trNoJ: rdT.spinDrag === undefined && !(rdT.invSq && rdT.invSq.sourceMoment), spinDrag: rdP.spinDrag || null,
      srcMoment: T && T.sourceMoment ? T.sourceMoment.bodies.map((z) => ({ i: z.i, Rd: z.Rd, Robs: z.Robs, f: z.f, Rsrc: z.Rsrc, applied: z.applied, momentFactor: z.momentFactor })) : null,
      JSI: p.bodies.map((b, i) => (sm.f ? sm.f[String(i)] : 0) * (b.m * 1e29) * (b.radius * 1e10) ** 2 * (b.spin / 1e6)) };
    out.acen.declOk = out.acen.accepted && out.acen.warnings === E.warnings && physSame && rdSame && bodiesSame && restSame && out.acen.srcKind === E.srcKind
      && JSON.stringify(out.acen.f) === JSON.stringify(E.f) && JSON.stringify(out.acen.spinDrag) === JSON.stringify(E.spinDrag) && out.acen.trNoJ && !!out.acen.srcMoment && out.acen.srcMoment.every((z) => z.applied);
  }
  return out;
}

/* ───────── 段 L J の口座(主のプロセス) ───────── */
export function partL(HP, P) {
  const find = finderOf(HP), rows = [];
  for (const [sys, col] of [['j0737', 'JA'], ['j0737', 'JAB'], ['j0737', 'self'], ['acen', 'self']]) {
    const base = find(O.BASE_OF[sys]), h = base.physics.stepDt, nSteps = Math.round(P.ledgerOrbits * L.osc0Of(base).P / h);
    const v = HP.validatePreset(clone(O.colBook(sys, col, find))), S = HP.coord3d.makeSim(); S.build(clone(v.preset));
    const st0 = HP.obsSpin.state(S), spin0 = Array.from(S.spin), ax0 = [Array.from(S.sax), Array.from(S.say), Array.from(S.saz)];
    let csMaxD = 0, cs0 = null;
    for (let k = 0; k < nSteps; k++) {
      S.step(h);
      const cs = S._rdIsqCs;
      if (cs && cs.cnt > 0) { const s = Array.from(cs.s.subarray(0, S.n)); if (!cs0) cs0 = s; else for (let j = 0; j < s.length; j++) csMaxD = Math.max(csMaxD, Math.abs(s[j] - cs0[j])); }
    }
    const st1 = HP.obsSpin.state(S), T = HP.inertialDragIsqState(S);
    const strip = (st) => st ? JSON.stringify(st.rows.map((z) => [z.i, z.JvecSI, z.Jbook, z.RsrcBook, z.omegaSrcBook, z.missing, z.usedAsSource])) : null;
    rows.push({ sys, col, steps: nSteps, obsSpinRows: st0 ? st0.rows.length : 0, reservoirFixed: strip(st0) === strip(st1), srcOmega: cs0, srcOmegaMaxDrift: csMaxD,
      spinUnchanged: JSON.stringify(spin0) === JSON.stringify(Array.from(S.spin)), axisUnchanged: JSON.stringify(ax0) === JSON.stringify([Array.from(S.sax), Array.from(S.say), Array.from(S.saz)]),
      coreSpinModel: T && T.coreSpin ? T.coreSpin.model : null, usedAsSource: st1 ? st1.rows.filter((z) => z.usedAsSource).map((z) => z.i) : [],
      JvecSI: st1 ? st1.rows.map((z) => z.JvecSI) : null, lDrag: Number.isFinite(S.inertialDragDL) ? S.inertialDragDL : null });
  }
  return { rows };
}

/* ───────── 段 T 量ごとの表 ───────── */
const rowOf = (rows, sys, col, div) => rows.find((r) => r.spec.sys === sys && r.spec.col === col && r.spec.div === div) || null;
export function tablesOf(rows, P, ana) {
  const g = (sys, col, div, q) => { const r = rowOf(rows, sys, col, div); return (r && r.status === 'run' && Number.isFinite(r[q])) ? r[q] : null; };
  const d = (sys, c1, c2, div, q) => { const x = g(sys, c1, div, q), y = g(sys, c2, div, q); return (x === null || y === null) ? null : x - y; };
  const DIFFS = { j0737: [['JA', 'self'], ['JAm', 'self'], ['JAvec', 'JA'], ['JAB', 'JA'], ['self', 'tr'], ['self', 'off'], ['g1', 'off']], acen: [['self', 'tr'], ['Jm', 'tr'], ['on', 'tr'], ['tr', 'off']] };
  const out = [];
  for (const sys of Object.keys(P.cols)) {
    const divsOf = (col) => (P.cols[sys].find((z) => z[0] === col) || [null, []])[1];
    for (const [c1, c2] of DIFFS[sys]) {
      const divs = divsOf(c1).filter((dv) => divsOf(c2).indexOf(dv) >= 0);
      if (!divs.length) continue;
      const r = { sys, a: c1, b: c2, divs, byQty: {} };
      for (const q of ['rate', 'rateB', 'P', 'e']) r.byQty[q] = divs.map((dv) => d(sys, c1, c2, dv, q));
      r.bits = divs.map((dv) => { const x = rowOf(rows, sys, c1, dv), y = rowOf(rows, sys, c2, dv); return !!(x && y && x.status === 'run' && y.status === 'run' && x.hashAll === y.hashAll && x.steps === y.steps); });
      out.push(r);
    }
  }
  const find = (sys, a, b) => out.find((z) => z.sys === sys && z.a === a && z.b === b) || null;
  const R = { rows: out };
  { const ja = find('j0737', 'JA', 'self'), jm = find('j0737', 'JAm', 'self');
    R.signJ0737 = (ja && jm && ja.byQty.rate[0] !== null && jm.byQty.rate[0] !== null) ? { JA: ja.byQty.rate[0], JAm: jm.byQty.rate[0], sumOverJA: (ja.byQty.rate[0] + jm.byQty.rate[0]) / Math.abs(ja.byQty.rate[0]) } : null; }
  { const s = find('acen', 'self', 'tr'), m = find('acen', 'Jm', 'tr');
    R.signAcen = (s && m && s.byQty.rate[0] !== null && m.byQty.rate[0] !== null) ? { J: s.byQty.rate[0], Jm: m.byQty.rate[0], sumOverJ: (s.byQty.rate[0] + m.byQty.rate[0]) / Math.abs(s.byQty.rate[0]) } : null; }
  { const so = find('j0737', 'self', 'off'), go = find('j0737', 'g1', 'off'), a = ana.j0737;
    if (so && go) { const ratio = so.byQty.rate.map((x, i) => (x !== null && go.byQty.rate[i]) ? x / go.byQty.rate[i] : null), fin = ratio[ratio.length - 1];
      R.eta = { eta: a.eta, f43: a.f43, q1PN: a.q1PN, ratio, ratioOverF: fin === null ? null : fin / a.f43, g1OverQ1: go.byQty.rate[go.byQty.rate.length - 1] / a.q1PN }; } }
  R.law = rows.filter((r) => r.status === 'run').map((r) => ({ key: r.key, lawDecl: r.lawDecl, lawSim: r.lawSim, ge: r.ge,
    ok: r.lawDecl === r.lawSim && (r.spec.col === 'g1' ? (r.lawSim === 'eih-kf0' && r.ge === 1) : (r.lawSim === 'inertial-drag' && r.ge === 0)) }));
  R.spin = rows.filter((r) => r.status === 'run').map((r) => ({ key: r.key, spinDmax: r.acct ? r.acct.spinDmax : null }));
  R.acct = rows.filter((r) => r.status === 'run' && r.spec.div === 1).map((r) => ({ key: r.key, dLz: r.acct.dLz, lDrag: r.acct.lDrag, dE: r.acct.dE, RE: r.acct.ledger ? r.acct.ledger.RE : null }));
  return R;
}

/* ───────── 門 ───────── */
export function gatesOf(J) {
  const G = {}, A = J.A, B = J.B, T = J.T, Lg = J.L;
  G.aCases = !!(A && A.n === O.CASES.length && A.nOk === A.n);
  G.aCanon = !!(A && Object.values(A.checks).every(Boolean));
  G.bJ0737 = !!(B && B.j0737 && B.j0737.declOk);
  G.bAcen = !!(B && B.acen && B.acen.declOk);
  G.eRun = !!(J.E && J.E.rows.length && J.E.rows.every((r) => r.status === 'run' && r.complete && !r.nan));
  G.eLaw = !!(T && T.law.length && T.law.every((z) => z.ok));
  G.eSpin = !!(T && T.spin.length && T.spin.every((z) => z.spinDmax === 0));
  { const st = T && T.rows.find((z) => z.sys === 'j0737' && z.a === 'self' && z.b === 'tr'); G.eAxisNullBits = !!(st && st.bits.every(Boolean)); }   // 軸が欠測の本 = 並進だけ(ビット)
  { const ja = T && T.rows.find((z) => z.sys === 'j0737' && z.a === 'JA' && z.b === 'self'); G.eJAMoves = !!(ja && ja.byQty.rate.every((x) => x !== null && x !== 0) && ja.bits.every((b) => !b)); }
  { const s = T && T.rows.find((z) => z.sys === 'acen' && z.a === 'self' && z.b === 'tr'); G.eAcenMoves = !!(s && s.byQty.rate.every((x) => x !== null && x !== 0)); }
  G.eSign = !!(T && T.signJ0737 && Math.abs(T.signJ0737.sumOverJA) < 0.05 && (!J.plan.cols.acen.some((z) => z[0] === 'Jm') || (T.signAcen && Math.abs(T.signAcen.sumOverJ) < 0.05)));
  G.lReservoir = !!(Lg && Lg.rows.length && Lg.rows.every((r) => r.reservoirFixed && r.srcOmegaMaxDrift === 0 && r.spinUnchanged && r.axisUnchanged));
  G.lUsed = !!(Lg && Lg.rows.every((r) => r.sys !== 'j0737' || (r.col === 'self' ? r.usedAsSource.length === 0 : r.usedAsSource.length >= 1)));
  return G;
}

/* ───────── 子プロセスの池(W324B_WORKERS —— 既定 2) ───────── */
function poolRun(specs, NW, self, target) {
  const order = specs.slice().sort((a, b) => b.div - a.div);   // 長い走行(細かい刻み)を先に
  const chunks = []; const nChunk = Math.max(NW, Math.min(order.length, NW * 4));
  for (let i = 0; i < nChunk; i++) chunks.push([]);
  order.forEach((s, i) => chunks[i % nChunk].push(s));
  const todo = chunks.filter((c) => c.length), res = [];
  return new Promise((resolve, reject) => {
    let active = 0, failed = null;
    const pump = () => {
      while (!failed && active < NW && todo.length) {
        const c = todo.shift(); active++;
        const proc = spawn(process.execPath, ['--max-old-space-size=6144', self, '--child', JSON.stringify({ target, specs: c })], { cwd: ROOT, env: process.env });
        let so = '', se = '';
        proc.stdout.on('data', (d) => { so += d; }); proc.stderr.on('data', (d) => { se += d; });
        proc.on('close', (code) => {
          active--;
          if (code !== 0) { failed = new Error('子プロセス rc ' + code + ': ' + se.slice(-600)); return reject(failed); }
          try { const J = JSON.parse(so.slice(so.lastIndexOf('\n{') + 1)); res.push(...J.rows); } catch (e) { failed = new Error('子の出力が JSON でない: ' + so.slice(-300)); return reject(failed); }
          if (!todo.length && active === 0) resolve(res); else pump();
        });
      }
    };
    if (!todo.length) resolve(res); else pump();
  });
}

/* ───────── 実行 ───────── */
export async function runAll(HP, o) {
  const P = o.plan, tm = {}; let t0 = Date.now();
  const tick = (k) => { tm[k] = { wallSec: (Date.now() - t0) / 1000 }; t0 = Date.now(); };
  const J = { stage: 'obsspin', quick: !!o.quick, plan: clone(P), decl: { BOOKS: clone(O.BOOKS), CASES: clone(O.CASES), COLS: clone(O.COLS), F_SRC: clone(O.F_SRC), J0737_SPIN: clone(O.J0737_SPIN), DECL_EXPECT: clone(O.DECL_EXPECT),
    obsSpin: { version: HP.obsSpin.version, keys: HP.obsSpin.keys.slice(), kinds: HP.obsSpin.kinds.slice(), units: clone(HP.obsSpin.units), frames: HP.obsSpin.frames.slice(), fMax: HP.obsSpin.fMax, srcKind: HP.obsSpin.srcKind } } };
  J.A = partA(HP); tick('A');
  J.B = partB(HP); tick('B');
  const specs = [];
  for (const sys of Object.keys(P.cols)) for (const [col, divs] of P.cols[sys]) for (const div of divs) specs.push({ sys, col, div, N: P.N, K: P.apsisK });
  const rows = await o.runner(specs);
  J.E = { n: specs.length, rows: rows.sort((a, b) => a.key < b.key ? -1 : a.key > b.key ? 1 : 0) }; tick('E');
  J.L = partL(HP, P); tick('L');
  const find = finderOf(HP), ana = {};
  for (const sys of Object.keys(O.BASE_OF)) { const a = L.analyticOf(find(O.BASE_OF[sys])); ana[sys] = { eta: a.eta, f43: 1 + 4 * a.eta / 3, q1PN: a.q1PN, a: a.a, e: a.e, P: a.P }; }
  J.ana = ana;
  J.T = tablesOf(J.E.rows, P, ana); tick('T');
  J.gates = gatesOf(J); J.ok = Object.values(J.gates).every(Boolean); J.timing = tm;
  return J;
}

async function child(arg) {
  const { target, specs } = JSON.parse(arg);
  const { HP } = loadHtmlMain(path.isAbsolute(target) ? target : path.join(ROOT, target));
  const rows = specs.map((sp) => runSpec(HP, sp));
  process.stdout.write('\n' + JSON.stringify({ rows }) + '\n');
}
export async function main() {
  const TARGET = process.env.W324B_TARGET || 'beta/index.html', quick = process.env.W324B_QUICK === '1', NW = Math.max(1, Number(process.env.W324B_WORKERS || 2) | 0);
  const OUT = process.env.W324B_OUT ? (path.isAbsolute(process.env.W324B_OUT) ? process.env.W324B_OUT : path.join(ROOT, process.env.W324B_OUT)) : path.join(ROOT, OUT_MAIN);
  if (quick && !process.env.W324B_OUT) throw new Error('試走(W324B_QUICK=1)は W324B_OUT を指定する(正本を書かない)');
  const html = path.isAbsolute(TARGET) ? TARGET : path.join(ROOT, TARGET);
  const t0 = Date.now(), targetSha256 = crypto.createHash('sha256').update(fs.readFileSync(html)).digest('hex');
  const W281A_SCOPE = REGEN_SCOPE ? w281aScopeStamp(html, REGEN_SCOPE) : {};
  const { HP } = loadHtmlMain(html);
  console.log('第324便b obsspin: ' + (quick ? '試走' : '正本') + '・子プロセス ' + NW);
  const self = fileURLToPath(import.meta.url);
  const R = await runAll(HP, { quick, plan: quick ? QUICK : PLAN, runner: (specs) => poolRun(specs, NW, self, TARGET) });
  const out = { version: HARNESS_VERSION, libVersion: O.LIB_VERSION, lib321bVersion: L.LIB_VERSION, generator: 'tests/exp-w324b-obsspin.mjs', target: TARGET, targetSha256, reuseFrom: null,
    ruling: '決断事項 AN514(α Cen の J の本 —— 新しい ID・f は模型の入力・並進だけの本は残す)・AN515(天体ごとの obsSpin —— 排他・明示の fSrc と rObs・0.4 を補わない・unit・source・epoch・座標系・axis:null は欠測で J の源に使わない・S.spin へ入れない・最初の本は J0737)・統括の検証項目 R280(geoPN=3 の S3)。観測の J は固定の外部の貯蔵庫(源の自転の進化と歳差は扱わない)・連星の観測との照合ではない',
    invSqVersion: HP.REL_DRAG_INVSQ_VERSION || null, obsSpinVersion: HP.obsSpin.version, ...R };
  out.elapsedS = (Date.now() - t0) / 1000;
  const CODE = ['tests/exp-w324b-obsspin.mjs', 'tests/lib-w324b-obsspin.mjs', 'tests/exp-w321b-geo3bin.mjs', 'tests/lib-w321b-geo3bin.mjs', 'tests/lib-w304e-apsis.mjs', 'tests/lib-w320d-rulebooks.mjs', 'tests/lib-w280b-emgrid.mjs', 'tests/lib-w279b-headless.mjs', 'tests/lib-w272e-provenance.mjs', 'tests/lib-w281a-scope.mjs'];
  out.meta = Object.assign(provenanceMeta({ root: ROOT, wave: '第324便b', target: TARGET, code: CODE, inputs: [TARGET] }), {
    harnessVersion: HARNESS_VERSION, stage: 'obsspin',
    engine: 'Node(tests/lib-w280b-emgrid.mjs の loadHtmlMain —— html の本文をそのまま実行・子プロセス ' + NW + ')', notClaim: O.NOT_CLAIM });
  Object.assign(out.meta, W281A_SCOPE, w281aStableInputs(ROOT, out.meta.inputs));
  fs.mkdirSync(path.dirname(OUT), { recursive: true });
  fs.writeFileSync(OUT, JSON.stringify(out, null, 1) + '\n');
  console.log('→', path.relative(ROOT, OUT), 'ok=' + out.ok, JSON.stringify(out.gates), out.elapsedS + ' s');
}
if (IS_MAIN) { if (process.argv[2] === '--child') await child(process.argv[3]); else await main(); }
