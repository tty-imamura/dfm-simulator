// 第324便d(決断事項 AN480・AN452・統括の検証項目 R282): **衛星の長い窓の口**(器 tests/exp-w318b-satnext.mjs の --long・--resume-gate・--child-long が**動的 import**で読む lib)。
//
// ■ 何をするか
//   器の既定の経路(--child・試走・探索・正本 —— 段 satnext-318b)は**この lib を読まない**(行・code[]・REGEN_SCOPE は不変)。器は自分の関数(specsOf・specBooks・runKeyOf・
//   analyzeSpec・runSatnext・gatesOf …)を引数 D で渡す(器を import し返さない —— 器の top-level await と輪にならない)。
//   ・runSpecLong: 器の runSpec と**同じ積分**(同じ本・同じ刻み・同じ步の列・同じ止め方)を、tests/lib-w324d-resume.mjs の再開の型で行う。安全な步の境界(S.step の間)で
//     checkpoint(sim の全状態 HP.ckSnapOne・検出器 attachSatSamplerR の累積・步の番号と窓の終わり・済んだ q10 の行と標本・P_母)を原子的に保存し、同じ契約の
//     checkpoint があれば復帰(HP.ckRestoreOne)して続ける。行は器の analyzeSpec で作る(連続の走行と同じ関数)。
//   ・--resume-gate(正本 tests/out/resume-w324d.json): 門 —— (1) lib の自己試験(符号化・拒否・done)/(2) ジョブの門(イオ・エウロパの短い窓):
//     既定の子(--child)の行 = 再開の型の連続(checkpoint を書くだけ)= 2 回止めて別の子プロセスで復帰した続き(q10 の途中と q11 の途中)が、所要の欄の外で**全欄同じビット**・
//     止めた時点と終わりの sim の全欄の digest が連続と同じ・否定対照(復帰の state の sim の速度か検出器の角の繰り越しを 1 ulp 塗ると行が変わる)・
//     違う契約(塩)と書きかけ(末尾を切った写し)の checkpoint は拒否して最初から(行は連続と同じ)・done の再利用(同じ契約で同じ文字列・違う契約で走らせる)/
//     (3) 計画の門(短い窓の 4 ジョブ): 既定の子で組んだ正本 = 再開の型で組んだ正本 = 済みのジョブを全部再利用して組んだ正本(所要の欄の外の差 0)。
//   ・--long(正本 tests/out/satlong-w324d.json —— 段 satlong-324d・履歴〔毎便の鎖に入れない〕): 門 (1)(2) を先に回し(外れたら走らせない)、イオ・エウロパ × V1a・V0 ×
//     h・h/2・h/4 × 1.5 P_母(AN452 —— 正本の段 satnext-318b と同じ契約 CONTRACT・同じ窓 W1/W2・同じ判定 RULE)を再開の型で。完走したジョブは done から再利用・
//     途中のジョブは checkpoint から続ける。置き場は --resume-dir か W324D_RESUME_DIR(既定 tests/out/.satlong-w324d/ —— .gitignore)。
//   ・--long --status: 置き場の済みのジョブと途中の checkpoint(步の番号 / 窓の終わり)を印字するだけ(走らせない)。
//
// ■ 言わないこと: 「フィットした」「較正した」「収束した」「完全に一致」「法則を確かめた」「検証が完了した」。母惑星の公転周期の窓(W1・W2・M0 の窓)の外の量を引用しない。
//   門は「同じ入力・同じコード・同じ環境で、止めて続けても同じビット」を見るだけ(物理として正しいとは言わない)。
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { spawn } from 'node:child_process';
import * as R from './lib-w324d-resume.mjs';

export const SATLONG_VERSION = 'w324d-satlong-1';
export const OUT_SATLONG = 'tests/out/satlong-w324d.json';
export const OUT_GATE = 'tests/out/resume-w324d.json';
export const DEFAULT_DIR = 'tests/out/.satlong-w324d';
export const LIB_FILES = Object.freeze(['tests/lib-w324d-satlong.mjs', 'tests/lib-w324d-resume.mjs', 'tests/lib-w322d-nslockmerge.mjs']);
/** 長い窓の計画(AN452 —— イオ・エウロパ × V1a・V0 × h・h/2・h/4 × 1.5 P_母。窓・模型・判定は段 satnext-318b の CONTRACT と同じ) */
export const LONG_PLAN = Object.freeze({ sats: Object.freeze(['io', 'europa']), variants: Object.freeze(['V1a', 'V0']), divs: Object.freeze([1, 2, 4]), stepsPerOrbit: 720, span: 1.5, pScale: 1,
  m0Wins: Object.freeze([8, 16, 32, 64, 128, 256]), triton: null, ulp: null });
/** 計画の門(短い窓 —— P_母 の 1/512・4 ジョブ) */
export const GATE_PLAN = Object.freeze({ sats: Object.freeze(['io', 'europa']), variants: Object.freeze(['V1a']), divs: Object.freeze([1, 2]), stepsPerOrbit: 720, span: 1.5, pScale: 1 / 512,
  m0Wins: Object.freeze([2, 4, 8]), triton: null, ulp: null });
/** ジョブの門の 2 本(GATE_PLAN の行 —— 止める位置は窓の終わりの割合: q10 の途中と q11 の途中) */
export const GATE_JOBS = Object.freeze([
  Object.freeze({ label: 'io-V1a-div2', sat: 'io', v: 'V1a', div: 2, stops: Object.freeze(['q10:0.37', 'q11:0.61']) }),
  Object.freeze({ label: 'europa-V1a-div1', sat: 'europa', v: 'V1a', div: 1, stops: Object.freeze(['q10:0.53', 'q11:0.29']) })]);
/** 否定対照の検出器の塗り(角の繰り越し thAcc に足す rad —— 1 ulp の塗りは後の累積の丸めに吸われうる〔第324便d の枝の門: エウロパで行が変わらなかった〕ので、門は 1e-9 rad) */
export const PAINT_TH = 1e-9;
/** 行の所要の欄(連続と再開の比較で外す —— 壁時計) */
export const ROW_VOLATILE = Object.freeze(['/wallSec', '/runs/q10/wallSec', '/runs/q11/wallSec']);
/** 正本の所要の欄(regentable の volatilePaths と同じ型) */
export const OUT_VOLATILE = Object.freeze(['/elapsedS', '/timing/*/wallSec', '/E/runs/*/wallSec', '/E/runs/*/runs/q10/wallSec', '/E/runs/*/runs/q11/wallSec', '/cost/wallSec', '/cost/byJob/*/wallSec',
  '/cost/rateStepsPerSec', '/resume', '/shared', '/resumed']);
/** 長い窓の正本の判定に使わない(引用しない)量: 窓 W1・W2 と M0 の窓の外 */
export const NOT_CLAIM_LONG = Object.freeze(['母惑星の公転周期の窓(W1・W2・M0 の窓)の外の量', '再開できたので物理として正しい']);
/** 長い窓の正本の領域の宣言(器の REGEN_SCOPE + 復帰の口 —— 履歴の段なので鎖の判定には使わない・刻印だけ) */
export const scopeLongOf = (D) => Object.assign(JSON.parse(JSON.stringify(D.REGEN_SCOPE)), { roots: [...new Set(D.REGEN_SCOPE.roots.concat(['HP.ckRestoreOne', 'HP.ckSnapOne']))].sort() });

const clone = (x) => JSON.parse(JSON.stringify(x));
const argOf = (k) => { const i = process.argv.indexOf(k); return i >= 0 ? process.argv[i + 1] : null; };
const sha256File = (f) => crypto.createHash('sha256').update(fs.readFileSync(f)).digest('hex');
const abs = (D, f) => (path.isAbsolute(f) ? f : path.join(D.ROOT, f));
const stamp = () => new Date().toISOString().slice(11, 19);

/* ───────── 契約(ジョブ 1 本 —— 入力・器・環境・版)───────── */
export function codeLongOf(D) { return D.CODE.concat(LIB_FILES.filter((f) => !D.CODE.includes(f))); }
export function jobContract(D, o) {
  const c = { resumeVersion: R.RESUME_VERSION, satlongVersion: SATLONG_VERSION, harness: D.HARNESS_VERSION,
    libs: { satnext: D.NX.LIB_VERSION, satk1: D.L.LIB_VERSION, satcut: D.C.LIB_VERSION, satmeas: D.M.LIB_VERSION, apsis: D.AP.APSIS_VERSION },
    codeSha256: R.codeShaOf(D.ROOT, codeLongOf(D)).sha256, target: D.TARGET, targetSha256: o.targetSha256, inputSha256: sha256File(abs(D, D.L.DECL_FILE)),
    env: R.envOf(), runKey: o.key, spec: o.sp };
  if (o.salt) c.salt = o.salt;
  return c;
}

/* ───────── 状態の digest(門 —— sim の全欄〔関数を除く自前の鍵〕と検出器)───────── */
export function stateDigest(S, sm) {
  const per = {};
  for (const k of Object.keys(S).filter((q) => typeof S[q] !== 'function').sort()) {
    const v = S[k] instanceof Set ? { $set: Array.from(S[k]) } : (S[k] instanceof Map ? { $map: Array.from(S[k].entries()) } : S[k]);   // digest だけ(checkpoint の符号化は Set・Map を受けない)
    try { const b = [], t = R.encodeTree(v, b), h = crypto.createHash('sha256').update(JSON.stringify(t)); for (const x of b) h.update(x); per[k] = h.digest('hex').slice(0, 16); }
    catch (e) { per[k] = 'unencodable:' + String(e.message).slice(0, 40); }
  }
  const b = [], t = R.encodeTree(sm.state(), b), h = crypto.createHash('sha256').update(JSON.stringify(t)); for (const x of b) h.update(x);
  return { keys: Object.keys(per).length, per, sampler: h.digest('hex').slice(0, 16) };
}
const digestDiff = (a, b) => { if (!a || !b) return ['digest が無い']; const out = []; for (const k of new Set(Object.keys(a.per).concat(Object.keys(b.per)))) if (a.per[k] !== b.per[k]) out.push(k); if (a.sampler !== b.sampler) out.push('(検出器)'); return out; };

/* ───────── 再開の型の積分(器の runSpec と同じ步の列)───────── */
/**
 * @param {object} D 器の関数と lib
 * @param {object} HP html
 * @param {object} sp 走行の仕様(器の specsOf の 1 行 —— job 'main')
 * @param {{ckFile?:string|null, contract:object, ckSec?:number, ckSteps?:number, stopAt?:{kind:string,frac:number}|null, paint?:string|null, digest?:boolean, log?:Function}} o
 * @returns {{row?:object, stopped?:boolean, stats:object}}
 */
export function runSpecLong(D, HP, sp, o) {
  const { L, NX, AP, KINDS } = D;
  if (sp.job !== 'main') throw new Error('長い窓の口は job main だけ(トリトンの列は既定の経路)');
  const sd = L.seedOf(HP, sp.sat), P = L.parentOf(sd.parent), books = D.specBooks(HP, sp, sd), runs = {}, smp = {};
  const stats = { resumedFrom: null, refused: null, saves: 0, saveSec: 0, ckBytes: 0, digests: {}, painted: null, stoppedAt: null };
  let ck = null, pp = null, wallBefore = 0;
  if (o.ckFile) { const r = R.readCheckpoint(o.ckFile, o.contract); if (r.ok) ck = r.state; else if (r.code !== 'missing') stats.refused = { code: r.code, why: r.why }; }
  if (ck) {
    stats.resumedFrom = { kind: KINDS[ck.phase], k: ck.k, kEnd: ck.kEnd };
    for (const [kind, d] of Object.entries(ck.done)) { runs[kind] = d.run; smp[kind] = { s: d.s, book: books[kind], unbound: d.unbound }; }
    pp = ck.pp; wallBefore = ck.wallTotal;
    // 否定対照(門だけ): 復帰する状態の 1 欄を塗る(sim の速度は 1 ulp・検出器の角の繰り越しは PAINT_TH rad —— 1 ulp の記録は thAcc1ulp)
    if (o.paint === 'vx') { const is = books[KINDS[ck.phase]].timeRef.pair[1], a = ck.sim.arrs.vx; const was = a[is]; a[is] = R.nextUp(a[is]); stats.painted = { what: 'sim.vx[' + is + ']', was, now: a[is] }; }
    else if (o.paint === 'thAcc') { const z = ck.sampler.z, was = z.thAcc; z.thAcc = z.thAcc + PAINT_TH; stats.painted = { what: '検出器 thAcc + ' + PAINT_TH + ' rad', was, now: z.thAcc }; }
    else if (o.paint === 'thAcc1ulp') { const z = ck.sampler.z, was = z.thAcc; z.thAcc = R.nextUp(z.thAcc); stats.painted = { what: '検出器 thAcc + 1 ulp(記録 —— 累積の丸めに吸われうる)', was, now: z.thAcc }; }
  }
  const t0 = Date.now() - wallBefore * 1000;
  for (let ki = ck ? ck.phase : 0; ki < KINDS.length; ki++) {
    const kind = KINDS[ki], book = books[kind], vr = HP.validatePreset(clone(book));
    if (!vr.ok) return { row: { spec: sp, status: 'rejected', kind, err: JSON.stringify(vr.errors).slice(0, 300) }, stats };
    const S = HP.coord3d.makeSim(); S.build(clone(vr.preset));
    if (S.coord3d !== true) return { row: { spec: sp, status: 'rejected', kind, err: '三次元の本ではない' }, stats };
    const ip = book.timeRef.pair[0], is = book.timeRef.pair[1], mu = S.params.G * (S.m[ip] + S.m[is]), h = book.physics.stepDt, dt = h / sp.div, tk = Date.now();
    const here = !!(ck && ck.phase === ki);
    const sm = R.attachSatSamplerR(S, { ci: ip, oi: is, mu, every: sp.div, pole: P.orbitPole, eccVector: AP.eccVector }, here ? ck.sampler : null);
    if (!pp) pp = NX.parentPeriodOf(sd, sm.basis);
    const tEnd = sp.span * pp.Pparent * sp.pScale;
    const nSamp = Math.max(Math.ceil(tEnd / h) + 1, Math.max(...sp.m0Wins) * book.timeRef.stepsPerOrbit), kEnd = nSamp * sp.div;
    let k = 0, stop = 'done', kWall = 0;
    if (here) { if (ck.kEnd !== kEnd) throw new Error('窓の終わりが保存と違う(' + ck.kEnd + ' ≠ ' + kEnd + ')'); HP.ckRestoreOne(S, ck.sim); k = ck.k; kWall = ck.kindWall; }
    const kStop = o.stopAt && o.stopAt.kind === kind ? Math.max(1, Math.floor(o.stopAt.frac * kEnd)) : -1;
    let kSaved = k, tSaved = Date.now();
    const doneOf = () => Object.fromEntries(KINDS.slice(0, ki).map((q) => [q, { run: runs[q], s: smp[q].s, unbound: smp[q].unbound }]));
    const save = (kk) => {
      const ts = Date.now(), st = { phase: ki, k: kk, kEnd, sim: HP.ckSnapOne(S), sampler: sm.state(), done: doneOf(), pp, kindWall: kWall + (ts - tk) / 1000, wallTotal: (ts - t0) / 1000 };
      const w = R.writeCheckpoint(o.ckFile, o.contract, st, null, { kind, k: kk, kEnd, frac: kk / kEnd, at: new Date().toISOString(), spec: D.rowKey(sp) });
      stats.saves++; stats.ckBytes = w.bytes; stats.saveSec += (Date.now() - ts) / 1000; kSaved = kk; tSaved = Date.now();
      if (o.log) o.log(`[ck] ${D.rowKey(sp)} ${kind} ${kk}/${kEnd}(${(100 * kk / kEnd).toFixed(1)} %)${(w.bytes / 1048576).toFixed(1)} MiB ${((Date.now() - ts) / 1000).toFixed(1)} s`);
    };
    for (; k < kEnd; k++) {   // 器の runSpec と同じ回し方(保存は步の頭 —— S.step の呼び出しの間・状態は読むだけ)
      if (o.ckFile && k !== kSaved) {
        if (k === kStop) { save(k); stats.stoppedAt = { kind, k, kEnd }; if (o.digest) stats.digests[kind + '@stop'] = stateDigest(S, sm); return { stopped: true, stats }; }
        if ((o.ckSteps > 0 && k % o.ckSteps === 0) || ((k & 1023) === 0 && Date.now() - tSaved >= (o.ckSec || 600) * 1000)) save(k);
      }
      S.step(dt);
      if (S.coord3dHalt) { stop = 'coord3dHalt'; k++; break; }
      if (S.inertialDragHalt === true) { stop = 'solveHalt'; k++; break; }
      if (S.hasNaN()) { stop = 'nan'; k++; break; }
    }
    const st = HP.inertialDragIsqState ? HP.inertialDragIsqState(S) : null;
    smp[kind] = { s: sm.samples(), book, unbound: sm.unbound() };
    if (o.digest) stats.digests[kind] = stateDigest(S, sm);
    sm.detach();
    runs[kind] = { steps: k, kEnd, stop, complete: stop === 'done', nan: S.hasNaN(), unbound: smp[kind].unbound, nSamp: smp[kind].s.t.length, tEnd, h, dt, pRef: book.timeRef.pRef,
      warnings: (vr.warnings || []).length, betaMax: st ? st.betaMax : null, isqSteps: st ? st.steps : null, wallSec: kWall + (Date.now() - tk) / 1000 };
  }
  return { row: D.analyzeSpec(sp, runs, smp, pp, t0), stats };
}

/* ───────── 子プロセス ───────── */
function childLong(D) {
  const sp = JSON.parse(argOf('--child-long')), dir = argOf('--ckdir'), html = abs(D, D.TARGET);
  const stopRaw = argOf('--stop-at'), stopAt = stopRaw ? { kind: stopRaw.split(':')[0], frac: Number(stopRaw.split(':')[1]) } : null;
  const { HP } = D.loadHtmlMain(html);
  const key = D.runKeyOf(D.specBooks(HP, sp), sp), contract = jobContract(D, { sp, key, targetSha256: sha256File(html), salt: argOf('--contract-salt') });
  const ckFile = dir ? path.join(dir, 'ck-' + key + '.bin') : null;
  const res = runSpecLong(D, HP, sp, { ckFile, contract, ckSec: Number(argOf('--ck-sec') || process.env.W324D_CK_SEC || 600), ckSteps: Number(argOf('--ck-steps') || 0), stopAt,
    paint: argOf('--paint'), digest: process.argv.includes('--digest'), log: (s) => process.stderr.write(stamp() + ' ' + s + '\n') });
  if (res.stopped) { process.stdout.write('\n#stopped ' + JSON.stringify(res.stats) + '\n'); return; }
  const text = JSON.stringify(res.row);
  if (dir && !process.argv.includes('--no-store')) { R.jobStore(dir).put(key, contract, text); try { fs.unlinkSync(ckFile); } catch (e) { /* 無い */ } }
  process.stdout.write('\n#resume ' + JSON.stringify(res.stats) + '\n' + text + '\n');
}
/** 子を 1 本(--max-old-space-size は器の池と同じ)。stderr の行は印字に流す(checkpoint の進み) */
function spawnChild(D, args, o = {}) {
  return new Promise((res, rej) => {
    const proc = spawn(process.execPath, ['--max-old-space-size=6144', D.self, ...args], { cwd: D.ROOT, env: process.env });
    let sout = '', serr = '';
    proc.stdout.on('data', (d) => { sout += d; });
    proc.stderr.on('data', (d) => { serr += d; if (o.echo) for (const l of String(d).split('\n')) if (l.trim()) console.log('    ' + l); });
    proc.on('close', (code) => {
      if (code !== 0) return rej(new Error(args.slice(0, 2).join(' ').slice(0, 200) + ': rc ' + code + ' ' + serr.slice(-600)));
      const st = /\n#(stopped|resume) ([^\n]*)\n/.exec(sout), stats = st ? JSON.parse(st[2]) : null, i = sout.lastIndexOf('\n{');
      res({ stopped: !!(st && st[1] === 'stopped'), stats, text: i >= 0 ? sout.slice(i + 1).trim() : null });
    });
  });
}
function limiter(n) {
  let active = 0; const q = [];
  const pump = () => { q.sort((a, b) => b.pri - a.pri); while (active < n && q.length) { const z = q.shift(); active++; z.fn().then((v) => { active--; pump(); z.res(v); }, (e) => { active--; pump(); z.rej(e); }); } };
  return (fn, pri = 0) => new Promise((res, rej) => { q.push({ fn, pri, res, rej }); pump(); });
}
const stripRow = (text) => { const r = JSON.parse(text); delete r.wallSec; if (r.runs) for (const k of Object.keys(r.runs)) delete r.runs[k].wallSec; return r; };
const rowSha = (text) => R.sha256Of(R.canonText(stripRow(text)));
/** 正本の比較(所要の欄の外 —— OUT_VOLATILE の路を外す) */
export function outDiff(a, b, max = 20) {
  const pats = OUT_VOLATILE.concat(['/meta']).map((p) => new RegExp('^' + p.replace(/\*/g, '[^/]+') + '(/|$)'));
  const strip = (x, p) => { if (x === null || typeof x !== 'object') return x; if (Array.isArray(x)) return x.map((y, i) => strip(y, p + '/' + i));
    const o = {}; for (const k of Object.keys(x)) { const q = p + '/' + k; if (pats.some((re) => re.test(q))) continue; o[k] = strip(x[k], q); } return o; };
  return R.bitDiff(strip(a, ''), strip(b, ''), max, '', true);   // 鍵の順は見ない(E.runs は子の終わった順に積む —— 既定の経路でも走行ごとに違う)
}

/* ───────── 門 ───────── */
/** ジョブの門(1 本 —— 既定の子・連続・2 回止めて続き・否定対照 2・拒否 2・done)。dir = この門の置き場 */
export async function jobGate(D, HP, job, dir, run, targetSha256) {
  const sp = D.specsOf(GATE_PLAN).find((z) => z.sat === job.sat && z.v === job.v && z.div === job.div);
  const key = D.runKeyOf(D.specBooks(HP, sp), sp), contract = jobContract(D, { sp, key, targetSha256 }), ckName = 'ck-' + key + '.bin';
  const dd = (nm) => { const p = path.join(dir, nm); fs.rmSync(p, { recursive: true, force: true }); fs.mkdirSync(p, { recursive: true }); return p; };
  const dB = dd('B'), dC = dd('C'), dD1 = dd('D1'), dD2 = dd('D2'), dE1 = dd('E1'), dE2 = dd('E2');
  const L = (args) => ['--child-long', JSON.stringify(sp), ...args];
  const t0 = Date.now();
  const [A, B] = await Promise.all([run(() => spawnChild(D, ['--child', JSON.stringify(sp)])), run(() => spawnChild(D, L(['--ckdir', dB, '--ck-steps', '997', '--digest', '--no-store'])))]);
  const C1 = await run(() => spawnChild(D, L(['--ckdir', dC, '--stop-at', job.stops[0], '--digest'])));
  const ck1 = fs.readFileSync(path.join(dC, ckName));
  for (const d of [dD1, dD2, dE1]) fs.writeFileSync(path.join(d, ckName), ck1);
  fs.writeFileSync(path.join(dE2, ckName), ck1.subarray(0, ck1.length - 13));   // 書きかけの写し(末尾 13 バイトが無い)
  const dD3 = dd('D3'); fs.writeFileSync(path.join(dD3, ckName), ck1);
  const [C2, D1, D2, E1, E2, D3] = await Promise.all([
    run(() => spawnChild(D, L(['--ckdir', dC, '--stop-at', job.stops[1], '--digest']))),
    run(() => spawnChild(D, L(['--ckdir', dD1, '--paint', 'vx', '--no-store']))), run(() => spawnChild(D, L(['--ckdir', dD2, '--paint', 'thAcc', '--no-store']))),
    run(() => spawnChild(D, L(['--ckdir', dE1, '--contract-salt', 'gate-w324d', '--no-store']))), run(() => spawnChild(D, L(['--ckdir', dE2, '--no-store']))),
    run(() => spawnChild(D, L(['--ckdir', dD3, '--paint', 'thAcc1ulp', '--no-store'])))]);
  const C3 = await run(() => spawnChild(D, L(['--ckdir', dC, '--digest'])));
  const store = R.jobStore(dC), hit = store.get(key, contract), miss = store.get(key, Object.assign({}, contract, { salt: 'gate-w324d' }));
  const shaA = rowSha(A.text), d = (x) => R.bitDiff(stripRow(A.text), stripRow(x.text), 6);
  const W1 = (text) => { const r = JSON.parse(text), z = r.win && r.win.W1 && r.win.W1.models.LS; return z ? z.d : null; };
  const g = {
    contB: d(B).length === 0 && B.stats.saves > 0 && !B.stats.resumedFrom,
    resumed2: C1.stopped && C1.stats.stoppedAt.kind === 'q10' && C2.stopped && C2.stats.resumedFrom.kind === 'q10' && C2.stats.stoppedAt.kind === 'q11' && !C3.stopped && C3.stats.resumedFrom.kind === 'q11' && d(C3).length === 0,
    digestStop: digestDiff(B.stats.digests.q10, C2.stats.digests.q10).length === 0 && digestDiff(B.stats.digests.q11, C3.stats.digests.q11).length === 0,
    negVx: !!(D1.stats.resumedFrom && D1.stats.painted) && d(D1).length > 0,
    negThAcc: !!(D2.stats.resumedFrom && D2.stats.painted) && d(D2).length > 0,
    refuseContract: !!(E1.stats.refused && E1.stats.refused.code === 'contract' && !E1.stats.resumedFrom) && d(E1).length === 0,
    refuseTorn: !!(E2.stats.refused && E2.stats.refused.code === 'length' && !E2.stats.resumedFrom) && d(E2).length === 0,
    doneReuse: hit.hit && hit.text === C3.text && !miss.hit && !fs.existsSync(path.join(dC, ckName)) };
  return { label: job.label, spec: D.rowKey(sp), key, stops: job.stops.slice(), wallSec: (Date.now() - t0) / 1000,
    rowSha256: shaA, W1LSd: W1(A.text), same: { B: d(B).length === 0, C: d(C3).length === 0, E1: d(E1).length === 0, E2: d(E2).length === 0 },
    neg: { vx: { painted: D1.stats.painted, diffPaths: d(D1).length, firstDiff: d(D1).slice(0, 3), W1LSd: W1(D1.text) }, thAcc: { painted: D2.stats.painted, diffPaths: d(D2).length, firstDiff: d(D2).slice(0, 3), W1LSd: W1(D2.text) },
      thAcc1ulp: { painted: D3.stats.painted, diffPaths: d(D3).length, firstDiff: d(D3).slice(0, 3), note: '記録(門に使わない)' } },
    resume: { C1: C1.stats.stoppedAt, C2: { from: C2.stats.resumedFrom, stop: C2.stats.stoppedAt }, C3: { from: C3.stats.resumedFrom }, ckBytes: C2.stats.ckBytes, savesB: B.stats.saves },
    digest: { keys: B.stats.digests.q11 ? B.stats.digests.q11.keys : null, q10: digestDiff(B.stats.digests.q10, C2.stats.digests.q10), q11: digestDiff(B.stats.digests.q11, C3.stats.digests.q11),
      unencodable: B.stats.digests.q11 ? Object.entries(B.stats.digests.q11.per).filter(([, v]) => /^unencodable/.test(v)).map(([k]) => k) : [] },
    refused: { contract: E1.stats.refused, torn: E2.stats.refused }, done: { hit: hit.why, miss: miss.why }, gates: g, ok: Object.values(g).every(Boolean) };
}
/** 計画の門(既定の子で組んだ正本 = 再開の型で組んだ正本 = 全ジョブ再利用で組んだ正本) */
export async function planGate(D, HP, dir, NW, targetSha256, satcut) {
  const lim = limiter(NW), sdir = path.join(dir, 'plan-store');
  fs.rmSync(sdir, { recursive: true, force: true });
  const runDefault = (key, sp, pri) => lim(() => spawnChild(D, ['--child', JSON.stringify(sp)]), pri).then((r) => JSON.parse(r.text));
  const stat = { run: 0, reused: 0, resumed: 0 };
  const runLong = longRunner(D, HP, sdir, lim, targetSha256, stat, null);
  const log = () => {};
  const J0 = await D.runSatnext(HP, { quick: false, explore: false, plan: GATE_PLAN, run: runDefault, log, satcut });
  const J1 = await D.runSatnext(HP, { quick: false, explore: false, plan: GATE_PLAN, run: runLong, log, satcut });
  const s1 = Object.assign({}, stat); stat.run = 0; stat.reused = 0; stat.resumed = 0;
  const J2 = await D.runSatnext(HP, { quick: false, explore: false, plan: GATE_PLAN, run: runLong, log, satcut });
  const s2 = Object.assign({}, stat), d01 = outDiff(J0, J1), d12 = outDiff(J1, J2), nJobs = Object.keys(J0.E.runs).length;
  const g = { defaultOk: J0.ok === true, sameDefaultLong: d01.length === 0, sameReuse: d12.length === 0, ranAll: s1.run === nJobs && s1.reused === 0, reusedAll: s2.reused === nJobs && s2.run === 0,
    prefixSame: !!(J0.gates && J0.gates.prefixSame) };
  return { plan: clone(GATE_PLAN), jobs: nJobs, first: s1, second: s2, diff01: d01, diff12: d12, J0gates: J0.gates, prefix: { compared: J0.prefix.compared, same: J0.prefix.same }, gates: g, ok: Object.values(g).every(Boolean) };
}
/** 長い窓の走らせ方(ジョブごと —— done にあれば再利用・無ければ子で〔checkpoint があれば続きから〕) */
function longRunner(D, HP, dir, lim, targetSha256, stat, jobs) {
  fs.mkdirSync(dir, { recursive: true });
  const store = R.jobStore(dir);
  return (key, sp, pri) => {
    const contract = jobContract(D, { sp, key, targetSha256 }), hit = store.get(key, contract);
    if (hit.hit) { stat.reused++; if (jobs) jobs[key] = { spec: D.rowKey(sp), reused: true }; return Promise.resolve(JSON.parse(hit.text)); }
    return lim(() => spawnChild(D, ['--child-long', JSON.stringify(sp), '--ckdir', dir], { echo: !!jobs }), pri).then((r) => {
      stat.run++; if (r.stats && r.stats.resumedFrom) stat.resumed++;
      if (jobs) jobs[key] = { spec: D.rowKey(sp), reused: false, resumedFrom: r.stats ? r.stats.resumedFrom : null, refused: r.stats ? r.stats.refused : null, saves: r.stats ? r.stats.saves : null, ckBytes: r.stats ? r.stats.ckBytes : null };
      return JSON.parse(r.text);
    });
  };
}

/* ───────── 親 ───────── */
function provOf(D, wave, inputs, scope) {
  const html = abs(D, D.TARGET), meta = Object.assign(D.provenanceMeta({ root: D.ROOT, wave, target: D.TARGET, code: codeLongOf(D), inputs }), { harnessVersion: D.HARNESS_VERSION, satlongVersion: SATLONG_VERSION });
  Object.assign(meta, D.w281aScopeStamp(html, scope), D.w281aStableInputs(D.ROOT, meta.inputs));
  return meta;
}
async function gateAll(D, HP, dir, NW, targetSha256, satcut, withPlan) {
  const t0 = Date.now(), lim = limiter(NW), sdir = path.join(dir, 'selftest');
  fs.rmSync(sdir, { recursive: true, force: true });
  const self = R.resumeSelfTest(sdir); fs.rmSync(sdir, { recursive: true, force: true });
  console.log(`  ${stamp()} 自己試験: ${self.cases}`);
  const jobs = [];
  for (const j of GATE_JOBS) { const r = await jobGate(D, HP, j, path.join(dir, 'gate-' + j.label), lim, targetSha256); jobs.push(r);
    console.log(`  ${stamp()} ジョブの門 ${j.label}: ${r.ok ? 'ok' : '**外れ**'} ${JSON.stringify(r.gates)}(${r.wallSec.toFixed(1)} s)`); fs.rmSync(path.join(dir, 'gate-' + j.label), { recursive: true, force: true }); }
  const plan = withPlan ? await planGate(D, HP, dir, NW, targetSha256, satcut) : null;
  if (plan) { console.log(`  ${stamp()} 計画の門: ${plan.ok ? 'ok' : '**外れ**'} ${JSON.stringify(plan.gates)}`); fs.rmSync(path.join(dir, 'plan-store'), { recursive: true, force: true }); }
  const ok = self.ok && jobs.every((z) => z.ok) && (!plan || plan.ok);
  return { selfTest: { ok: self.ok, cases: self.cases, rows: self.rows }, jobs, plan, ok, wallSec: (Date.now() - t0) / 1000 };
}
async function mainGate(D) {
  const t0 = Date.now(), html = abs(D, D.TARGET), targetSha256 = sha256File(html), { HP } = D.loadHtmlMain(html);
  const dir = path.resolve(argOf('--resume-dir') || process.env.W324D_RESUME_DIR || path.join(D.ROOT, DEFAULT_DIR), 'gate');
  const NW = Math.max(1, Number(process.env.W318B_WORKERS) || 2);
  let satcut = null; try { satcut = JSON.parse(fs.readFileSync(abs(D, D.SATCUT_OUT), 'utf8')); } catch (e) { satcut = null; }
  console.log('第324便d 再開の型の門: workers ' + NW + '・置き場 ' + dir);
  const G = await gateAll(D, HP, dir, NW, targetSha256, satcut, true);
  const OUT = process.env.W318B_OUT ? abs(D, process.env.W318B_OUT) : path.join(D.ROOT, OUT_GATE);
  const out = { version: SATLONG_VERSION, resumeVersion: R.RESUME_VERSION, harnessVersion: D.HARNESS_VERSION, generator: 'tests/exp-w318b-satnext.mjs --resume-gate', target: D.TARGET, targetSha256,
    ruling: '決断事項 AN480(長い窓の再開は入力・器・環境の hash と積分器の内部状態を保存し、連続の走行との同一を確かめてから)・AN452(イオ・エウロパの長い窓は再開の型の後・鎖の外で)・統括の検証項目 R282',
    contract: { saved: ['sim の全状態(html の保存の口 HP.ckSnapOne —— CK_ARRS・CK_SC・CK_DEEP・三次元の c3・慣性決定力の rd・参照模型の st・固定中心・params・相・壁)', '検出器の累積(attachSatSamplerR —— 角の繰り越し・前の標本・標本の列・通過の時刻・非束縛の印)と基底',
      '步の番号 k・窓の終わり kEnd・種類(q10/q11)', '済んだ種類の行と標本(q11 の途中では q10 の全部)', '母惑星の公転周期 P_母 の組'],
      hash: ['再開の型と lib の版', '器の版と lib の版', '器と lib の sha256(code[] の並び)', '対象 html の sha256', '凍結の写しの sha256', '環境(Node・V8・platform・arch)', '走行の鍵(本の sha と仕様)と仕様'],
      atomic: '一時ファイル → fsync → rename(→ 置き場の fsync)', refuse: ['形(magic)', '頭の行・頭の JSON(書きかけ)', '本文の長さ(書きかけ・切れた)', '本文の sha256(壊れた)', '頭の契約の hash と中身', '再開の型の版', '違う契約'],
      values: '数は Float64 のビット(16 進)・型つき配列はバイト列・数だけの配列はバイト列(戻すと素の Array)・undefined は印・鍵は元の順' },
    ...G, gates: { selfTest: G.selfTest.ok, jobs: G.jobs.every((z) => z.ok), plan: !!(G.plan && G.plan.ok) }, elapsedS: (Date.now() - t0) / 1000 };
  out.meta = provOf(D, '第324便d', [D.TARGET, D.L.DECL_FILE, D.SATCUT_OUT], scopeLongOf(D));
  Object.assign(out.meta, { stage: 'resume', engine: 'Node(tests/lib-w280b-emgrid.mjs の loadHtmlMain —— html の本文をそのまま実行・走行は子プロセス W318B_WORKERS)', notClaim: D.NOT_CLAIM.concat(NOT_CLAIM_LONG) });
  fs.mkdirSync(path.dirname(OUT), { recursive: true });
  fs.writeFileSync(OUT, D.packJson(out) + '\n');
  console.log('→', path.relative(D.ROOT, OUT), 'ok=' + out.ok, JSON.stringify(out.gates), out.elapsedS.toFixed(1) + ' s');
  if (!out.ok) process.exitCode = 1;
}
function mainStatus(D, dir) {
  const files = fs.existsSync(dir) ? fs.readdirSync(dir) : [];
  const done = files.filter((f) => /^done-.*\.json$/.test(f)).map((f) => { try { const J = JSON.parse(fs.readFileSync(path.join(dir, f), 'utf8')); return D.rowKey(J.contract.spec); } catch (e) { return f + '(読めない)'; } });
  const cks = files.filter((f) => /^ck-.*\.bin$/.test(f)).map((f) => { const h = R.peekCheckpoint(path.join(dir, f)); return h && h.note ? `${h.note.spec} ${h.note.kind} ${h.note.k}/${h.note.kEnd}(${(100 * h.note.frac).toFixed(1)} %・${h.note.at})` : f + '(頭が読めない)'; });
  const torn = files.filter((f) => /\.tmp-\d+$/.test(f));
  console.log(`置き場 ${dir}: 済み ${done.length}・途中 ${cks.length}・一時 ${torn.length}`);
  for (const x of done.sort()) console.log('  済み ' + x);
  for (const x of cks.sort()) console.log('  途中 ' + x);
  for (const x of torn) console.log('  一時(書きかけ —— 読まない)' + x);
}
async function mainSatlong(D) {
  const t0 = Date.now(), html = abs(D, D.TARGET);
  const dir = path.resolve(argOf('--resume-dir') || process.env.W324D_RESUME_DIR || path.join(D.ROOT, DEFAULT_DIR));
  if (process.argv.includes('--status')) return mainStatus(D, dir);
  const targetSha256 = sha256File(html), { HP } = D.loadHtmlMain(html), NW = Math.max(1, Number(process.env.W318B_WORKERS) || 2);
  let satcut = null; try { satcut = JSON.parse(fs.readFileSync(abs(D, D.SATCUT_OUT), 'utf8')); } catch (e) { satcut = null; }
  const OUT = process.env.W318B_OUT ? abs(D, process.env.W318B_OUT) : path.join(D.ROOT, OUT_SATLONG);
  console.log('第324便d 長い窓(AN452): workers ' + NW + '・置き場 ' + dir + '・衛星 ' + LONG_PLAN.sats.join(',') + '・変種 ' + LONG_PLAN.variants.join(',') + '・刻み h/' + LONG_PLAN.divs.join(',h/'));
  // 門(1)(2)を先に —— 外れたら走らせない
  const G = await gateAll(D, HP, path.join(dir, 'gate'), NW, targetSha256, satcut, false);
  if (!G.ok) { console.log('門が外れた —— 長い窓を走らせない'); process.exitCode = 1; return; }
  const lim = limiter(NW), stat = { run: 0, reused: 0, resumed: 0 }, jobs = {};
  const log = (key, r) => { const sp = r.spec, w = r.win && r.win.W1 && r.win.W1.models.LS;
    console.log(`  ${stamp()} ${D.rowKey(sp)}: ${r.status}${r.status === 'run' ? '・W1 LS ' + (w && Number.isFinite(w.d) ? w.d.toExponential(6) : '—') + '・q11 ' + r.runs.q11.steps + ' 步 ' + r.runs.q11.wallSec.toFixed(1) + ' s' : '・' + (r.err || '').slice(0, 160)}${jobs[key] && jobs[key].reused ? '(済みを再利用)' : ''}`); };
  const R0 = await D.runSatnext(HP, { quick: false, explore: false, plan: LONG_PLAN, run: longRunner(D, HP, dir, lim, targetSha256, stat, jobs), log, satcut });
  const out = { version: D.HARNESS_VERSION, satlongVersion: SATLONG_VERSION, resumeVersion: R.RESUME_VERSION, libVersion: D.NX.LIB_VERSION, satk1LibVersion: D.L.LIB_VERSION, satcutLibVersion: D.C.LIB_VERSION,
    satmeasLibVersion: D.M.LIB_VERSION, apsisVersion: D.AP.APSIS_VERSION, generator: 'tests/exp-w318b-satnext.mjs --long', target: D.TARGET, targetSha256, reuseFrom: null,
    ruling: '決断事項 AN452(イオ・エウロパの長い窓 1.5 P_母 —— 再開の型の後・鎖の外で 1 回・satnext-318b の窓は削らない・簡易一致は使わない)・AN480(再開の型 —— 連続の走行との同一を確かめてから)・'
      + '統括の検証項目 R282。契約・窓・模型・判定は段 satnext-318b(第318便b)と同じ(AN436・AN437・AN439・AN442)。確認の材料(在位へ入れない)',
    invSqVersion: HP.REL_DRAG_INVSQ_VERSION || null, ...R0, stage: 'satlong',
    resumeGate: { selfTest: G.selfTest.ok, jobs: G.jobs.map((z) => ({ label: z.label, ok: z.ok, gates: z.gates })), wallSec: G.wallSec },
    resume: { dir: path.relative(D.ROOT, dir), run: stat.run, reused: stat.reused, resumed: stat.resumed, jobs } };
  out.elapsedS = (Date.now() - t0) / 1000;
  out.meta = provOf(D, '第324便d', [D.TARGET, D.L.DECL_FILE, D.SATCUT_OUT], scopeLongOf(D));
  Object.assign(out.meta, { stage: 'satlong', role: 'history', engine: 'Node(tests/lib-w280b-emgrid.mjs の loadHtmlMain —— html の本文をそのまま実行・走行は子プロセス W318B_WORKERS・再開の型 tests/lib-w324d-resume.mjs)',
    notClaim: D.NOT_CLAIM.concat(NOT_CLAIM_LONG) });
  fs.mkdirSync(path.dirname(OUT), { recursive: true });
  fs.writeFileSync(OUT, D.packJson(out) + '\n');
  console.log('→', path.relative(D.ROOT, OUT), 'ok=' + out.ok, JSON.stringify(out.gates), out.elapsedS + ' s', JSON.stringify(out.A.answer), JSON.stringify(out.resume).slice(0, 200));
}
export async function mainLong(D) {
  if (process.argv.includes('--child-long')) return childLong(D);
  if (process.argv.includes('--resume-gate')) return mainGate(D);
  return mainSatlong(D);
}
export default { SATLONG_VERSION, OUT_SATLONG, OUT_GATE, DEFAULT_DIR, LIB_FILES, LONG_PLAN, GATE_PLAN, GATE_JOBS, ROW_VOLATILE, OUT_VOLATILE, NOT_CLAIM_LONG, PAINT_TH, scopeLongOf, codeLongOf, jobContract, stateDigest,
  runSpecLong, outDiff, jobGate, planGate, mainLong };
