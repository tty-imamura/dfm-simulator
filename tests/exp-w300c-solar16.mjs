// 第300便c(原仮定者の裁定(第90報)④・統括の検証項目 R177)—— **太陽系 16 体の三次元の器の実行口**(Node だけ —— 対象 html の inline script を
// tests/lib-w280b-emgrid.mjs の loadHtmlMain で読む)。生成器と検査は tests/lib-w300c-solar16.mjs、入力の契約は tests/data-w300c-solar16-schema.json。
//
// ■ 使い方
//   node tests/exp-w300c-solar16.mjs                     → 人工の入力(SYNTHETIC —— **実際の配置ではない**)で 受理・宣言の受理と三次元の門・360 步の有限値・
//                                                          刻みの検査(h・h/2・h/4)・不正な入力の拒否を試す(結果は標準出力。W300C_SOLAR16_OUT で JSON に書ける)
//   node tests/exp-w300c-solar16.mjs --record <入力.json> [--emit <出力.js>]
//                                                        → 観測レコード(契約の形)を検査し、通れば同じ試験を走らせ、--emit で本の宣言(physics・bodies・
//                                                          timeRef・camera・scaleExp —— html の内蔵へ写す断片)を書く。通らなければ拒否の理由を出して終了コード 1。
//
// ■ しないこと
//   ・観測レコードの数値を作らない・補わない。人工の入力の結果を太陽系の配置の検証と呼ばない。本便は内蔵の本に入れない(id は予約だけ)。
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import * as S16 from './lib-w300c-solar16.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
export const HARNESS_VERSION = 'w300c-solar16-1';
const TARGET = process.env.QA_TARGET || 'beta/index.html';
const clone = (x) => JSON.parse(JSON.stringify(x));
export const RUN_STEPS = 360;

/** 1 つの入力の試験(受理・宣言の受理・三次元の門・360 步・刻みの検査)。 */
export function trialOf(HP, rec, o = {}) {
  const chk = S16.checkSolar16(rec);
  const out = { accepted: chk.ok, errors: chk.errors, derived: chk.derived };
  if (!chk.ok) return out;
  const d = S16.solar16Decl(rec), pre = S16.presetOf(rec);
  const v = HP.validatePreset(clone(pre));
  out.validate = { ok: v.ok, errors: v.errors || [], warnings: v.warnings || [] };
  out.deny = v.ok ? HP.coord3d.denyOf(v.preset) : null;
  out.decl = { stepDt: d.physics.stepDt, pRef: d.timeRef.pRef, ioA: d.io.a, cameraScale: d.camera.scale, cameraNeeded: d.cameraNeeded, recentre: d.recentre,
    radiusMin: Math.min(...d.bodies.map((b) => b.radius)), radiusAccepted: v.ok ? Math.min(...v.preset.bodies.map((b) => b.radius)) : null,
    softening: v.ok ? v.preset.physics.softening : null, coordMax: Math.max(...d.bodies.map((b) => Math.max(Math.abs(b.x), Math.abs(b.y), Math.abs(b.z)))),
    velMax: Math.max(...d.bodies.map((b) => Math.max(Math.abs(b.vx), Math.abs(b.vy), Math.abs(b.vz)))), spinMax: Math.max(...d.bodies.map((b) => Math.abs(b.spin))),
    massMin: Math.min(...d.bodies.map((b) => b.m)) };
  if (v.ok) {
    const S = HP.coord3d.makeSim(); S.build(clone(v.preset));
    for (let k = 0; k < RUN_STEPS; k++) S.step(v.preset.physics.stepDt);
    let fin = !S.hasNaN();
    for (let i = 0; i < S.n; i++) if (![S.x[i], S.y[i], S.z[i], S.vx[i], S.vy[i], S.vz[i]].every(Number.isFinite)) fin = false;
    out.run = { steps: RUN_STEPS, n: S.n, coord3d: S.coord3d === true, finite: fin };
    if (o.stepCheck !== false) out.stepCheck = S16.stepCheck(HP, pre, { steps: RUN_STEPS });
  }
  return out;
}
/** 人工の入力の試験と不正な入力の拒否。 */
export function syntheticSuite(HP) {
  const rec = S16.syntheticRecord();
  const trial = trialOf(HP, rec);
  const bad = S16.badVariants(rec).map((z) => { const c = S16.checkSolar16(z.rec); const codes = [...new Set(c.errors.map((e) => e.code))];
    return { name: z.name, expect: z.code, rejected: !c.ok, codes, hit: codes.indexOf(z.code) >= 0, first: c.errors.length ? c.errors[0].msg : null }; });
  return { note: '人工の入力(SYNTHETIC —— 円軌道・丸めた数 —— 実際の配置の検証ではない)', trial, bad, allRejected: bad.every((z) => z.rejected && z.hit) };
}
/** html の内蔵へ写す断片(本の id は予約 —— 観測レコードが届いた便で説明・観測カードと一緒に入れる)。 */
export function emitDecl(rec) {
  const d = S16.solar16Decl(rec);
  const lit = (x) => JSON.stringify(x).replace(/"([A-Za-z_][A-Za-z0-9_]*)":/g, '$1:');
  return [
    `// ${S16.RESERVED_ID} の宣言の断片(tests/exp-w300c-solar16.mjs --emit —— 元期 JD ${rec.epoch.jdTdb} TDB・${rec.source.ephemeris}・取得 ${rec.source.retrieved})`,
    `  scaleExp:${lit(d.scaleExp)},`, `  camera:${lit(d.camera)}, world:{boundary:"none",size:0},`, `  timeRef:${lit(d.timeRef)},`, `  physics:${lit(d.physics)},`,
    `  bodies:[   // ${S16.MEMBERS.map((m, i) => i + '=' + m.ja).join(' ')}`, d.bodies.map((b) => '    ' + lit(b)).join(',\n'), '  ],'].join('\n') + '\n';
}
const IS_MAIN = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (IS_MAIN) {
  const { loadHtmlMain } = await import('./lib-w280b-emgrid.mjs');
  const { HP } = loadHtmlMain(path.join(ROOT, TARGET));
  const t0 = Date.now();
  let out, code = 0;
  if (process.argv.includes('--record')) {
    const rp = process.argv[process.argv.indexOf('--record') + 1];
    const rec = JSON.parse(fs.readFileSync(rp, 'utf8'));
    out = { version: HARNESS_VERSION, lib: S16.LIB_VERSION, record: rp, trial: trialOf(HP, rec) };
    if (!out.trial.accepted || !(out.trial.validate && out.trial.validate.ok) || (out.trial.deny || []).length || !(out.trial.run && out.trial.run.finite)) code = 1;
    else if (process.argv.includes('--emit')) fs.writeFileSync(process.argv[process.argv.indexOf('--emit') + 1], emitDecl(rec));
  } else {
    out = { version: HARNESS_VERSION, lib: S16.LIB_VERSION, synthetic: syntheticSuite(HP) };
    const t = out.synthetic.trial;
    if (!(t.accepted && t.validate.ok && t.validate.warnings.length === 0 && t.deny.length === 0 && t.run.finite && out.synthetic.allRejected)) code = 1;
  }
  out.elapsedS = (Date.now() - t0) / 1000;
  if (process.env.W300C_SOLAR16_OUT) fs.writeFileSync(process.env.W300C_SOLAR16_OUT, JSON.stringify(out, null, 1) + '\n');
  console.log(JSON.stringify(out, (k, v) => (k === 'posDiffKm' ? undefined : v), 1).slice(0, 6000));
  process.exitCode = code;
}
