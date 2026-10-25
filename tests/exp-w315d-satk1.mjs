// 第315便d(原仮定者の裁定(第117報)・決断事項 AN413〔衛星 6 本の K1 の検証の器〕・AN414〔新記号 —— Y_k・r_d・r_s・G_0・c_0〕・AN410・AN412・統括の検証項目 R245):
// **衛星 6 本(イオ・エウロパ・ガニメデ・カリスト・タイタン・トリトン)の K1 の検証の器**(母惑星との二体と、太陽 + 母惑星 + 衛星の三体 × 引きずりの有無)。
// 確認の材料 —— 合わせない・確認の値を在位へ入れない・在位の本の宣言は変えない(写しは器の中で組む)。
//
// Node だけ(対象 html の inline script を tests/lib-w280b-emgrid.mjs の loadHtmlMain で読み、validatePreset・coord3d.makeSim・build・step と読み口
// inertialDragIsqState をそのまま呼ぶ)。走行は子プロセス(W315D_WORKERS —— 既定 2)。本の写し・近似要素の種・抽出は tests/lib-w315d-satk1.mjs。
//
// ■ 段 satk1-315d(正本 tests/out/satk1-w315d.json)。W315D_PARTS=P,T,E,K,W,B で選ぶ(正本は全段)・W315D_SATS=io,europa,… で衛星を選ぶ(正本は 6 本)
//   P t = 0 の写しの宣言の印字(衛星ごと・二体と三体の q11 の写し —— 本の ID・天体ごとの m・エンジンの質量・観測半径 R・エンジンの r_d・m_d・β と
//     Y_k × エンジンの質量の照合・r_d/R・r_s/R・母惑星と衛星の r_d の和と軌道の長半径の比〔重なりが無いこと〕)と Y_k の閉じた式
//   T 近似要素の種(m・R・a・e・i_eq・自転・恒星周期 —— 出典の語)と二体の参照の列(1PN の近点の率 q_1PN・在位の G_loc の解析の一次 —— 参考・門を付けない)
//   E 走行(6 衛星 × 二体・三体 × q00・q10・q11 × h・h/2・h/4 —— 32 公転の 1 本の走行の入れ子の窓 8・16・32)
//   K 窓 × 刻みごとの差の表(恒星周期・近点の率・交点の率・軸 —— 引きずりの有無の差 q11 − q10 と G_loc の差 q10 − q00・近点の r_1PN = q11 − q00 − q_1PN〔参考〕・刻みの帯)
//   W 主の窓(実測 —— 開始の窓 8 公転から: 近点の q11 − q10 の最も細かい 2 刻みの帯 ≤ 1e-2 × abs(q11 − q10) になる最小の窓・無ければ最長の窓)と窓の感度
//   B 数値の帯の判定(主の窓・最も細かい刻み —— 量 × 差ごとに、h–h/2・h/2–h/4 の帯 ≤ 1e-2 × abs(差)なら「数値の帯の内」・でなければ「帯の外 —— 数値で決まらない」)と
//     二体と三体の差(太陽の効き)。**観測の 3σ を付けない**(衛星の量に観測の σ は無い)・**近点の ε_fit を衛星の合格に流用しない**
//
// ■ 試走: W315D_QUICK=1(W315D_OUT が要る —— 正本を書かない)。再開: W315D_CACHE=<dir>(走行 1 本ごとの結果を逐次書き、同じ html・同じ器の版・同じ走行の鍵があれば読む ——
//   読んだ本数を正本の resumed に記録)。
//
// ■ 言わないこと: 「フィットした」「較正した」「収束した」「完全に一致」「法則を確かめた」「検証が完了した」「シュヴァルツシルト半径そのもの」。
//   近似要素の種を観測レコードと呼ばない。数値の帯は観測の 3σ ではない。h・h/2・h/4 は刻みの感度診断・窓は抽出の感度診断。
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { loadHtmlMain } from './lib-w280b-emgrid.mjs';
import { provenanceMeta } from './lib-w272e-provenance.mjs';
import { scopeStamp as w281aScopeStamp, stableInputs as w281aStableInputs } from './lib-w281a-scope.mjs';
import * as AP from './lib-w304e-apsis.mjs';
import * as L from './lib-w315d-satk1.mjs';
// 第281便a の領域 hash の宣言(器と lib から deriveScope で引いた下限 —— 在位の本は .find で 2 本だけ引く)
const REGEN_SCOPE = {"presets":["jupiterGalilean","saturnRingReal"],"roots":["HP.allPresets","HP.coord3d","HP.inertialDragIsqState","HP.validatePreset"],"core":true,"consts":[],"complete":true};

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
export const HARNESS_VERSION = 'w315d-satk1-1';
const IS_MAIN = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
const clone = (x) => JSON.parse(JSON.stringify(x));
const NOT_CLAIM = ['フィットした', '較正した', '収束した', '完全に一致', '法則を確かめた', '検証が完了した', 'シュヴァルツシルト半径そのもの', '観測レコード'];
export const OUT_SAT = 'tests/out/satk1-w315d.json';
export const PARTS = Object.freeze(['P', 'T', 'E', 'K', 'W', 'B']);
export const SATS = Object.freeze(L.SAT_SEEDS.map((s) => s.key));
/** 計画(正本)。窓は同じ走行の入れ子(runN 公転の 1 本から最初の N 公転)・刻み h = 恒星周期(種)/ stepsPerOrbit */
export const PLAN = Object.freeze({ runN: 32, windows: Object.freeze([8, 16, 32]), startWindow: 8, divs: Object.freeze([1, 2, 4]), stepsPerOrbit: 720, kinds: Object.freeze(['q00', 'q10', 'q11']), systems: Object.freeze(['two', 'three']) });
export const QUICK = Object.freeze({ runN: 4, windows: Object.freeze([2, 4]), startWindow: 2, divs: Object.freeze([1, 2]), stepsPerOrbit: 360, kinds: Object.freeze(['q00', 'q10', 'q11']), systems: Object.freeze(['two', 'three']) });
/** 数値の帯の判定(器の宣言 —— 観測の 3σ ではない・近点の ε_fit を流用しない): 最も細かい 2 刻みの帯と、その前の帯がどちらも 1e-2 × abs(差)以下 */
export const SAT_BAND = Object.freeze({ rel: 1e-2, note: '数値の帯の判定(器の宣言): 主の窓・刻み h–h/2 と h/2–h/4 の帯がどちらも 1e-2 × abs(差)以下なら「数値の帯の内」。観測の 3σ ではない(衛星の量に観測の σ は無い)・近点の ε_fit を衛星の合格に流用しない' });
/** 量(差の単位 —— 恒星周期は秒・率は ″/世紀・軸は ″) */
export const QTY = Object.freeze([
  Object.freeze({ key: 'sid', ja: '恒星周期', unit: 's', of: (w) => (Number.isFinite(w.sidDays) ? w.sidDays * 86400 : null) }),
  Object.freeze({ key: 'aps', ja: '近点の移動の率', unit: '″/世紀', of: (w) => w.aps }),
  Object.freeze({ key: 'node', ja: '交点の移動の率', unit: '″/世紀', of: (w) => w.node }),
  Object.freeze({ key: 'axSat', ja: '衛星の自転軸の角', unit: '″', of: (w) => w.axSat }),
  Object.freeze({ key: 'axPar', ja: '母惑星の自転軸の角', unit: '″', of: (w) => w.axPar })]);
export const qtyOf = (k) => QTY.find((z) => z.key === k);
export const DIFFS = Object.freeze(['dDG', 'dG']);   // dDG = q11 − q10(引きずりの有無の差)・dG = q10 − q00(G_loc の差)

/* ───────── 走行 ───────── */
export const specKey = (s) => 'sat:' + s.sat + '|' + s.sys + '|' + s.kind + '|' + (L.KINDS[s.kind].drag ? 'rdRule=kappaM|kernel=k1' : '-') + '|S=' + s.S + '|div=' + s.div + '|N=' + s.N;
export function runSpec(HP, sp) {
  const sd = L.seedOf(HP, sp.sat), book = L.bookOf(HP, sp.sat, sp.sys, sp.kind, { seed: sd, stepsPerOrbit: sp.S }), P = L.parentOf(sd.parent);
  const r = L.runBook(HP, book, { div: sp.div, runN: sp.N, wins: sp.wins, pole: P.orbitPole });
  return Object.assign({ key: specKey(sp), spec: sp, h: book.physics.stepDt }, r);
}
function makePool(NW, self) {
  let active = 0; const q = [];
  const pump = () => { q.sort((a, b) => b.pri - a.pri); while (active < NW && q.length) { const { sp, res, rej } = q.shift(); active++;
    const ch = spawn(process.execPath, ['--max-old-space-size=6144', self, '--child', JSON.stringify(sp)], { cwd: ROOT, env: process.env });
    let out = '', err = '';
    ch.stdout.on('data', (d) => { out += d; }); ch.stderr.on('data', (d) => { err += d; });
    ch.on('close', (code) => { active--; pump(); if (code !== 0) return rej(new Error(specKey(sp) + ': ' + err.slice(0, 600)));
      try { res(JSON.parse(out.slice(out.lastIndexOf('\n{') + 1))); } catch (e) { rej(new Error(specKey(sp) + ': 出力が JSON でない ' + out.slice(-200))); } }); } };
  return (sp, pri = 0) => new Promise((res, rej) => { q.push({ sp, res, rej, pri }); pump(); });
}
function cachedRun(run, dir, targetSha256, stat) {
  if (!dir) return run;
  fs.mkdirSync(dir, { recursive: true });
  const fileOf = (sp) => path.join(dir, crypto.createHash('sha256').update(HARNESS_VERSION + '|' + L.LIB_VERSION + '|' + targetSha256 + '|' + specKey(sp)).digest('hex').slice(0, 32) + '.json');
  return (sp, pri) => {
    const f = fileOf(sp);
    try { const c = JSON.parse(fs.readFileSync(f, 'utf8')); if (c.version === HARNESS_VERSION && c.targetSha256 === targetSha256 && c.row && c.row.key === specKey(sp)) { stat.resumed++; return Promise.resolve(c.row); } } catch (e) { /* 無い */ }
    return run(sp, pri).then((r) => { const tmp = f + '.tmp'; fs.writeFileSync(tmp, JSON.stringify({ version: HARNESS_VERSION, targetSha256, row: r })); fs.renameSync(tmp, f); return r; });
  };
}

/* ───────── 段 P(t = 0 の写し)───────── */
export function probeOf(HP, sats, S) {
  const out = { C1: L.C1, systems: {} };
  for (const k of sats) {
    const sd = L.seedOf(HP, k), row = {};
    for (const sys of L.SYSTEMS) {
      const q = L.bookOf(HP, k, sys, 'q11', { seed: sd, stepsPerOrbit: S }), v = HP.validatePreset(clone(q));
      if (!v.ok) { row[sys] = { err: JSON.stringify(v.errors).slice(0, 300) }; continue; }
      const Sm = HP.coord3d.makeSim(); Sm.build(clone(v.preset));
      const st = HP.inertialDragIsqState(Sm), Lm = Math.pow(10, q.scaleExp.L), Mk = Math.pow(10, q.scaleExp.M), Yk = L.YkBook(q), c2 = q.physics.cLight * q.physics.cLight;
      const names = sys === 'three' ? ['太陽', L.PARENTS[sd.parent].ja, sd.ja] : [L.PARENTS[sd.parent].ja, sd.ja];
      const bodies = q.bodies.map((b, i) => { const rc = (st.receivers || []).find((z) => z.i === i), mE = L.engineMassOf(b.m, q.physics), rd = Yk * mE, rs = 2 * q.physics.G * mE / c2;
        return { name: names[i], m: b.m * Mk, mEngine: mE * Mk, R: b.radius * Lm, receiver: !!rc, rdRule: rd * Lm, rdEngine: rc ? rc.Rd * Lm : null, mdEngine: rc ? rc.md * Mk : null, beta: rc ? rc.beta.slice() : null,
          rdSame: rc ? Object.is(rc.Rd, rd) : false, mdSame: rc ? Object.is(rc.md, mE) : false, sEngineMass: Object.is(Sm.m[i], mE), rdOverR: rd / b.radius, rsOverR: rs / b.radius, rdOverRs: rd / rs }; });
      const ip = q.timeRef.pair[0], is = q.timeRef.pair[1];
      row[sys] = { id: q.id, kernel: v.preset.physics.relativeDrag.invSq.kernel || null, rdRule: v.preset.physics.relativeDrag.invSq.rdRule || null, warnings: (v.warnings || []).length,
        bodies, betaMax: st.betaMax, rdSumOverA: (bodies[ip].rdRule + bodies[is].rdRule) / (sd.a * Lm), YkBook: Yk, Yk: Yk * Lm / Mk };
    }
    out.systems[k] = row;
  }
  return out;
}

/* ───────── 段 T(種と参照の列)───────── */
const CENTURY = 36525 * 86400, RAD2AS = 180 / Math.PI * 3600;
/** 二体の参照: 1PN の近点の率 q_1PN = 6πG(M+m)/(c² a(1−e²)) / 周 と、在位の G_loc の解析の一次(μ_eff = G(m₁² + m₂²)/(m₁ + m₂)・n = 2 —— tests/lib-w311d-planet3.mjs の gLocAnalytic と同じ式) */
export function refsOf(sd, P) {
  const G = P.physics.G, c = P.physics.cLight, M = P.planet.m, m = sd.m, Tsec = Math.pow(10, L.UNITS.T), per = CENTURY / Tsec / sd.P;
  const q1pn = 6 * Math.PI * G * (M + m) / (c * c * sd.a * (1 - sd.e * sd.e)) * per * RAD2AS;
  const muEff = G * (M * M + m * m) / (M + m), gLoc = -2 * 2 * Math.PI * muEff / (c * c * sd.a * (1 - sd.e * sd.e)) * per * RAD2AS;
  return { q1pn, gLocAnalytic: gLoc, dDGRef: q1pn - gLoc };
}
export function targetsOf(HP, sats) {
  const out = {};
  for (const k of sats) {
    const sd = L.seedOf(HP, k), P = L.parentOf(sd.parent), Lm = Math.pow(10, L.UNITS.L), Mk = Math.pow(10, L.UNITS.M);
    out[k] = Object.assign({ key: k, ja: sd.ja, parent: sd.parent, parentId: P.id, parentEmoji: P.emoji, m: sd.m * Mk, R: sd.R * Lm, a: sd.a * Lm, e: sd.e, iEqDeg: sd.iEqDeg, retro: sd.retro,
      spin: sd.spin, PDays: sd.P * Math.pow(10, L.UNITS.T) / 86400, src: sd.src, parentM: P.planet.m * Mk, parentR: P.planet.radius * Lm,
      oblDeg: Math.acos(Math.max(-1, Math.min(1, P.orbitPole[0] * P.spinPole[0] + P.orbitPole[1] * P.spinPole[1] + P.orbitPole[2] * P.spinPole[2]))) * 180 / Math.PI }, refsOf(sd, P));
  }
  return out;
}

/* ───────── 段 K・W・B(E の行から —— 純関数 —— QA が作り直す)───────── */
const rowOf = (J, sat, sys, kind, div) => { const r = J.E.rows[specKey({ sat, sys, kind, S: J.E.stepsPerOrbit, div, N: J.E.runN })]; return r && r.status === 'run' ? r : null; };
const finiteOr = (x) => (Number.isFinite(x) ? x : null);
export function partK(J) {
  const out = { systems: {} };
  for (const sat of J.E.sats) for (const sys of J.E.systems) {
    const T = J.T.systems[sat], o = { byWin: {} };
    for (const N of J.E.windows) {
      const w = { byDiv: {} };
      for (const d of J.E.divs) {
        const g = (kind) => { const r = rowOf(J, sat, sys, kind, d); return r && r.windows[N] && r.windows[N].complete ? r.windows[N] : null; };
        const W0 = g('q00'), W1 = g('q10'), W2 = g('q11'); if (!W0 || !W1 || !W2) continue;
        const z = { q: {}, dDG: {}, dG: {} };
        for (const Q of QTY) { const a = Q.of(W0), b = Q.of(W1), c = Q.of(W2);
          z.q[Q.key] = { q00: finiteOr(a), q10: finiteOr(b), q11: finiteOr(c) };
          z.dDG[Q.key] = (Number.isFinite(c) && Number.isFinite(b)) ? c - b : null; z.dG[Q.key] = (Number.isFinite(b) && Number.isFinite(a)) ? b - a : null; }
        z.r1pn = (Number.isFinite(W2.aps) && Number.isFinite(W0.aps)) ? W2.aps - W0.aps - T.q1pn : null;
        z.rOverQ = Number.isFinite(z.r1pn) ? z.r1pn / T.q1pn : null;
        z.eMean = finiteOr(W0.eMean); z.incMeanDeg = finiteOr(W0.incMeanDeg);
        w.byDiv[d] = z;
      }
      const ds = Object.keys(w.byDiv).map(Number).sort((a, b) => a - b);
      w.fine = ds.length ? ds[ds.length - 1] : null; w.bands = {};
      for (const df of DIFFS) { w.bands[df] = {}; for (const Q of QTY) { const b = {};
        for (let i = 1; i < ds.length; i++) { const x = w.byDiv[ds[i]][df][Q.key], y = w.byDiv[ds[i - 1]][df][Q.key]; b[ds[i - 1] + '-' + ds[i]] = (Number.isFinite(x) && Number.isFinite(y)) ? Math.abs(x - y) : null; }
        w.bands[df][Q.key] = b; } }
      { const b = {}; for (let i = 1; i < ds.length; i++) { const x = w.byDiv[ds[i]].r1pn, y = w.byDiv[ds[i - 1]].r1pn; b[ds[i - 1] + '-' + ds[i]] = (Number.isFinite(x) && Number.isFinite(y)) ? Math.abs(x - y) : null; } w.bands.r1pn = b; }
      o.byWin[N] = w;
    }
    out.systems[sat + '|' + sys] = o;
  }
  return out;
}
/** 帯の判定(純関数): bands の値がすべて有限・非負で、件数が 2 以上、どれも rel × abs(v) 以下。v が 0 か非有限なら比を作らない(判定しない —— null) */
export function bandVerdict(v, bands, G = SAT_BAND) {
  const b = Object.values(bands || {});
  const okB = b.length >= 2 && b.every((x) => Number.isFinite(x) && x >= 0), vOk = Number.isFinite(v) && v !== 0;
  const tol = vOk ? G.rel * Math.abs(v) : null, inBand = (okB && vOk) ? b.every((x) => x <= tol) : (okB ? null : false);
  return { v: finiteOr(v), bands: b.map(finiteOr), tol, inBand, bandOverV: (okB && vOk) ? Math.max(...b) / Math.abs(v) : null,
    verdict: inBand === true ? '数値の帯の内' : (inBand === null ? '比を作らない(差が 0 か非有限)' : '帯の外 —— 数値で決まらない') };
}
export function partW(J) {
  const out = { rule: '主の窓 = 開始の窓(' + J.E.startWindow + ' 公転)以上で、近点の q11 − q10 の最も細かい 2 刻みの帯 ≤ 1e-2 × abs(q11 − q10) になる最小の窓・無ければ最長の窓', systems: {} };
  for (const id of Object.keys(J.K.systems)) {
    const Kk = J.K.systems[id], ws = J.E.windows.slice().sort((a, b) => a - b), rows = [];
    for (const N of ws) { const w = Kk.byWin[N], ds = Object.keys(w.byDiv).map(Number).sort((a, b) => a - b), last = ds.length >= 2 ? ds[ds.length - 2] + '-' + ds[ds.length - 1] : null;
      const v = w.fine !== null ? w.byDiv[w.fine].dDG.aps : null, bf = last ? w.bands.dDG.aps[last] : null, tol = Number.isFinite(v) ? SAT_BAND.rel * Math.abs(v) : null;
      rows.push({ N, fine: w.fine, dDGaps: finiteOr(v), bandFine: finiteOr(bf), bandFineKey: last, tol, inTol: (Number.isFinite(bf) && Number.isFinite(tol)) ? bf <= tol : null }); }
    const cand = rows.filter((z) => z.N >= J.E.startWindow && z.inTol === true);
    const main = cand.length ? cand[0].N : ws[ws.length - 1];
    const sens = []; for (let i = 1; i < rows.length; i++) if (Number.isFinite(rows[i].dDGaps) && Number.isFinite(rows[i - 1].dDGaps)) sens.push({ from: rows[i - 1].N, to: rows[i].N, d: rows[i].dDGaps - rows[i - 1].dDGaps });
    out.systems[id] = { rows, main, how: cand.length ? '帯の許容の内の最小の窓' : '許容の内の窓なし —— 最長の窓', sens };
  }
  return out;
}
export function partB(J) {
  const out = { rule: clone(SAT_BAND), systems: {}, sun: {} };
  for (const id of Object.keys(J.K.systems)) {
    const N = J.W.systems[id].main, w = J.K.systems[id].byWin[N], z = w.byDiv[w.fine], row = { N, fine: w.fine, q: {} };
    for (const Q of QTY) { row.q[Q.key] = {}; for (const df of DIFFS) row.q[Q.key][df] = bandVerdict(z[df][Q.key], w.bands[df][Q.key]); }
    row.r1pn = Object.assign(bandVerdict(z.r1pn, w.bands.r1pn), { rOverQ: z.rOverQ, note: '参考(門を付けない —— 近点の ε_fit を流用しない)' });
    out.systems[id] = row;
  }
  // 太陽の効き: 同じ衛星の三体と二体の差(主の窓は系ごと —— 同じ窓で比べるため両系の主の窓の大きい方)
  for (const sat of J.E.sats) {
    const a = J.K.systems[sat + '|two'], b = J.K.systems[sat + '|three']; if (!a || !b) continue;
    const N = Math.max(J.W.systems[sat + '|two'].main, J.W.systems[sat + '|three'].main), wa = a.byWin[N], wb = b.byWin[N]; if (!wa || !wb || wa.fine === null || wb.fine === null) continue;
    const za = wa.byDiv[wa.fine], zb = wb.byDiv[wb.fine], o = { N };
    for (const Q of ['sid', 'aps', 'node']) o[Q] = { q00: (Number.isFinite(zb.q[Q].q00) && Number.isFinite(za.q[Q].q00)) ? zb.q[Q].q00 - za.q[Q].q00 : null,
      dDG: (Number.isFinite(zb.dDG[Q]) && Number.isFinite(za.dDG[Q])) ? zb.dDG[Q] - za.dDG[Q] : null, dG: (Number.isFinite(zb.dG[Q]) && Number.isFinite(za.dG[Q])) ? zb.dG[Q] - za.dG[Q] : null };
    out.sun[sat] = o;
  }
  return out;
}
export function costOf(J) {
  const by = {};
  for (const r of Object.values(J.E.rows)) { if (r.status !== 'run') continue;
    const k = r.spec.sys + '|' + (L.KINDS[r.spec.kind].drag ? 'drag' : 'nodrag') + '|h/' + r.spec.div; const w = by[k] || (by[k] = { n: 0, steps: 0, wallSec: 0 }); w.n++; w.steps += r.steps; w.wallSec += r.wallSec; }
  const rate = {}; for (const [k, w] of Object.entries(by)) rate[k] = { rateStepsPerSec: w.wallSec > 0 ? w.steps / w.wallSec : null };
  return { rows: by, rate };
}

/* ───────── 門(器の健全さ —— 帯の判定〔partB〕は結果で、ここに入れない)───────── */
export function gatesOf(J) {
  const g = {};
  if (J.P) {
    g.ruleAllBodies = Object.values(J.P.systems).every((row) => L.SYSTEMS.every((sys) => { const s = row[sys]; return s && !s.err && s.kernel === 'k1' && s.rdRule === 'kappaM'
      && s.bodies.every((b) => b.receiver && b.rdSame && b.mdSame && b.sEngineMass); }));
    g.noOverlap = Object.values(J.P.systems).every((row) => L.SYSTEMS.every((sys) => row[sys] && Number.isFinite(row[sys].rdSumOverA) && row[sys].rdSumOverA < 1));
    g.YkClosed = Math.abs(J.P.C1 - 0.8431139667085161) <= 1e-12;
  }
  if (J.T) g.seedsFinite = Object.values(J.T.systems).every((t) => [t.m, t.R, t.a, t.e, t.iEqDeg, t.spin, t.PDays, t.q1pn, t.gLocAnalytic].every(Number.isFinite) && t.e >= 0 && t.e < 1 && t.a > 0);
  if (J.E) { const run = Object.values(J.E.rows);
    g.runsComplete = run.filter((r) => r.status === 'run').every((r) => r.complete && !r.nan && !r.unbound && J.E.windows.every((N) => r.windows[N] && r.windows[N].complete
      && Number.isFinite(r.windows[N].sidDays) && Number.isFinite(r.windows[N].aps) && Number.isFinite(r.windows[N].node)));
    g.noRejected = run.every((r) => r.status === 'run');
    g.allRows = Object.keys(J.E.rows).length === J.E.sats.length * J.E.systems.length * J.E.kinds.length * J.E.divs.length; }
  return g;
}

/* ───────── 走行の計画 ───────── */
export async function runSat(HP, o) {
  const parts = o.parts, P = o.plan, sats = o.sats, t = {}; let t0 = Date.now();
  const tick = (k) => { t[k] = { wallSec: (Date.now() - t0) / 1000 }; t0 = Date.now(); };
  const J = { stage: 'satk1', quick: !!o.quick, parts, sats: sats.slice(), kernel: 'k1', rule: 'rdRule:"kappaM"(全天体 r_d = Y_k m)', plan: clone(P), band: clone(SAT_BAND) };
  J.book = { units: clone(L.UNITS), softening: L.SOFTENING, radiusFloor: L.RADIUS_FLOOR, integrator: L.INTEGRATOR, gLoc: clone(L.GLOC), offDrag: clone(L.OFF_DRAG), k1Drag: clone(L.K1_RULE_DRAG),
    declFile: L.DECL_FILE, parents: clone(L.PARENTS), seedBooks: ['jupiterGalilean', 'saturnRingReal'],
    extractor: { sid: '固定の向きの通過の時刻の直線(t = 0 の軌道面の基底)', aps: 'tests/lib-w304e-apsis.mjs apsisRate(K = 3 —— 接触の離心ベクトル)', node: '軌道の極の母惑星の公転面に対する昇交点の経度 Ω の直線 + 位置の角の 1〜3 倍の正弦・余弦', axis: '自転軸の t = 0 からの角(窓の終わり)' },
    notIncluded: ['母惑星の J₂ と潮汐(在位の本 🏀🟡💙・🟠・💍 が持たない —— 入れると基線が在位の本の範囲の外になる。実際の衛星の近点と交点の移動の主は J₂ なので q00 の率は実際の衛星と比べない)',
      '他の衛星(🟠 の 4 衛星の共鳴)と他の惑星(衛星ごとに 1 本 —— 共鳴は在位の 🟠 の範囲)'] };
  if (parts.includes('P')) { J.P = probeOf(HP, sats, P.stepsPerOrbit); tick('P'); }
  J.T = { systems: targetsOf(HP, sats) }; tick('T');
  if (parts.includes('E')) {
    const rows = {}, specs = [];
    for (const sat of sats) for (const sys of P.systems) for (const d of P.divs) for (const kind of P.kinds) specs.push({ sat, sys, kind, S: P.stepsPerOrbit, div: d, N: P.runN, wins: P.windows.slice() });
    await Promise.all(specs.map((sp) => o.run(sp, (L.KINDS[sp.kind].drag ? 100 : 1) * sp.div * (sp.sys === 'three' ? 2 : 1)).then((r) => { rows[r.key] = r; o.log(r); return r; })));
    J.E = { sats: sats.slice(), systems: P.systems.slice(), kinds: P.kinds.slice(), runN: P.runN, windows: P.windows.slice(), startWindow: P.startWindow, divs: P.divs.slice(), stepsPerOrbit: P.stepsPerOrbit, rows };
    tick('E');
  }
  if (J.E && parts.includes('K')) { J.K = partK(J); tick('K'); }
  if (J.K && parts.includes('W')) { J.W = partW(J); tick('W'); }
  if (J.W && parts.includes('B')) { J.B = partB(J); tick('B'); }
  if (J.E) J.cost = costOf(J);
  J.gates = gatesOf(J); J.ok = Object.values(J.gates).every(Boolean); J.timing = t;
  const runs = J.E ? Object.values(J.E.rows).filter((r) => r.status === 'run') : [];
  J.stats = { runs: runs.length, steps: runs.reduce((s, r) => s + r.steps, 0) };
  return J;
}

/* ───────── 実行 ───────── */
const argOf = (k) => { const i = process.argv.indexOf(k); return i >= 0 ? process.argv[i + 1] : null; };
export async function main() {
  const TARGET = process.env.W315D_TARGET || 'beta/index.html';
  if (process.argv.includes('--child')) {
    const spec = JSON.parse(argOf('--child'));
    const { HP } = loadHtmlMain(path.isAbsolute(TARGET) ? TARGET : path.join(ROOT, TARGET));
    process.stdout.write('\n' + JSON.stringify(runSpec(HP, spec)) + '\n');
    return;
  }
  const quick = process.env.W315D_QUICK === '1';
  const OUT = process.env.W315D_OUT ? (path.isAbsolute(process.env.W315D_OUT) ? process.env.W315D_OUT : path.join(ROOT, process.env.W315D_OUT)) : path.join(ROOT, OUT_SAT);
  if (quick && !process.env.W315D_OUT) throw new Error('試走(W315D_QUICK=1)は W315D_OUT を指定する(正本を書かない)');
  const parts = process.env.W315D_PARTS ? process.env.W315D_PARTS.split(',') : PARTS.slice();
  const sats = process.env.W315D_SATS ? process.env.W315D_SATS.split(',') : SATS.slice();
  if (sats.some((k) => !L.satOf(k))) throw new Error('W315D_SATS は ' + SATS.join(',') + ' から');
  if (!process.env.W315D_OUT && (sats.length !== SATS.length || parts.length !== PARTS.length)) throw new Error('正本は全段・6 衛星(一部は W315D_OUT へ)');
  const html = path.isAbsolute(TARGET) ? TARGET : path.join(ROOT, TARGET);
  const t0 = Date.now(), targetSha256 = crypto.createHash('sha256').update(fs.readFileSync(html)).digest('hex');
  const W281A_SCOPE = w281aScopeStamp(html, REGEN_SCOPE);
  const { HP } = loadHtmlMain(html);
  const NW = Math.max(1, Number(process.env.W315D_WORKERS) || 2), cstat = { resumed: 0 };
  const run = cachedRun(makePool(NW, fileURLToPath(import.meta.url)), process.env.W315D_CACHE ? path.resolve(process.env.W315D_CACHE) : null, targetSha256, cstat);
  const log = (r) => { const w = r.windows ? r.windows[r.spec.N] : null;
    console.log(`  ${new Date().toISOString().slice(11, 19)} ${r.key}: ${r.status}${r.status === 'run' ? '・近点 ' + (w && Number.isFinite(w.aps) ? w.aps.toExponential(9) : '—') + '・交点 ' + (w && Number.isFinite(w.node) ? w.node.toExponential(6) : '—')
      + '・' + r.steps + ' 步・' + r.wallSec.toFixed(1) + ' s' : '・' + (r.err || '').slice(0, 160)}`); };
  const plan = quick ? QUICK : PLAN;
  console.log('第315便d satk1: ' + (quick ? '試走' : '正本') + '・workers ' + NW + '・段 ' + parts.join(',') + '・衛星 ' + sats.join(','));
  const R = await runSat(HP, { quick, parts, plan, sats, run, log });
  const out = { version: HARNESS_VERSION, libVersion: L.LIB_VERSION, apsisVersion: AP.APSIS_VERSION, generator: 'tests/exp-w315d-satk1.mjs', target: TARGET, targetSha256, reuseFrom: null,
    ruling: '原仮定者の裁定(第117報)・決断事項 AN413(衛星 6 本 —— 母惑星との二体と太陽込みの三体の両方で、同じ定義・窓・刻みの引きずりの有無の差。観測の σ の無い量に 3σ の合否を付けない)・' +
      'AN414(新記号 —— 引きずり係数 Y_k = 10G_0/(C_1 c_0²)・r_d = Y_k m・r_s = 2G_0 m/c_0²)・統括の検証項目 R245。確認の材料(在位へ入れない —— 近似要素の種は観測レコードではない)',
    invSqVersion: HP.REL_DRAG_INVSQ_VERSION || null, ...R };
  if (cstat.resumed > 0) out.resumed = cstat.resumed;
  out.elapsedS = (Date.now() - t0) / 1000;
  const CODE = ['tests/exp-w315d-satk1.mjs', 'tests/lib-w315d-satk1.mjs', 'tests/lib-w304e-apsis.mjs', 'tests/lib-w280b-emgrid.mjs', 'tests/lib-w272e-provenance.mjs', 'tests/lib-w281a-scope.mjs'];
  out.meta = Object.assign(provenanceMeta({ root: ROOT, wave: '第315便d', target: TARGET, code: CODE, inputs: [TARGET, L.DECL_FILE] }), {
    harnessVersion: HARNESS_VERSION, stage: 'satk1',
    engine: 'Node(tests/lib-w280b-emgrid.mjs の loadHtmlMain —— html の本文をそのまま実行・走行は子プロセス W315D_WORKERS)',
    notClaim: NOT_CLAIM });
  Object.assign(out.meta, W281A_SCOPE, w281aStableInputs(ROOT, out.meta.inputs));
  fs.mkdirSync(path.dirname(OUT), { recursive: true });
  fs.writeFileSync(OUT, JSON.stringify(out, null, 1) + '\n');
  console.log('→', path.relative(ROOT, OUT), 'ok=' + out.ok, JSON.stringify(out.gates), out.elapsedS + ' s', '主の窓 ' + JSON.stringify(out.W ? Object.fromEntries(Object.entries(out.W.systems).map(([k, v]) => [k, v.main])) : null));
}
if (IS_MAIN) await main();
