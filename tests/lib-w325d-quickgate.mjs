// 第325便d(統括の検証項目 R287 —— 簡易一致〔AN517/AN518〕の本運用の前の試験)—— **短窓の後だけ効く変異の影の試験・環境の整合・暦の債務・本運用の門の関数(休眠)**。
//
// ■ 何をするか(判定と模擬だけ —— 器を走らせない・正本を書かない・鎖は呼ばない)
//   ① **変異の影の試験**(simulateQuickWaves・mutationSelfTest): 合成の段(純関数の器 synthRun —— 調和振動子の leapfrog。実物の html・器・正本は使わない)に
//      **煙試験の窓の步数(200 步)の後でだけ式が変わる変異**(1000 步より後で力に ε·x を足す)を入れ、便の番号を進めて tests/lib-w323b-quick.mjs の
//      quickShadow(輪番 K = 3)・windowFingerprint・physSha・shadowCompare をそのまま回す。順に示す:
//        (a) 変異の入った便で、簡易一致は窓の指紋が記録と**同じ**と判定する(影では候補に残る —— 窓の限界)。影(鎖は全段フル)では同じ便の影の照合が falseSame で落とす。
//        (b) 本運用の模擬(quick の段は窓だけ —— 窓が同じなら正本を残す)では、**輪番のフルが K 便以内にその段を走らせ、正本の差(影の照合の falseSame)として落とす**
//            —— ただし**段の領域がその後の便で変わらない(reuse)と、今の規則では落ちない**(輪番は regen の段の中だけ —— 暦の債務 ③ で K 便以内に戻る)。
//        (c) 長期の名簿(quickVerify:'long')の段は、步の関数・受理器・S._core の変わった便で候補から外れる(変異の入った便でフル —— 1 便目で落ちる)。
//   ② **環境の整合**(quickEnvCheck): 指紋の記録の環境(記録の頭の env —— node・Chromium・platform・heap。古い記録は頭の node だけ)と鎖の環境
//      (tools/regen-chain.mjs --env の env.json)を照合する。node・Chromium・platform のどれかが違うか欠ければ ok:false(quickShadow の o.envCheck —— 全段の候補 0)。
//      heap(NODE_OPTIONS の --max-old-space-size と V8 の上限)は**照合して印字するが既定では門にしない**(浮動小数の値に効かない —— o.strictHeap で門に)。
//   ③ **暦の債務**(calendarDebt —— 提案・休眠): 簡易一致で残した正本(meta.verify.mode quick)は、最初の quick の便(quickSince)から K − 1 便の後に、
//      **regen でも reuse でも**フルへ(AN518「省いた段も K 便に 1 回はフル」の暦の読み)。今の quickShadow は regen の段の中だけで数える(reuse の段は輪番に入らない)。
//   ④ **本運用の門の関数**(quickProductionGate —— 休眠: 鎖も regen-plan の計画も呼ばない。regen-plan --quick-gate が印字するだけ):
//      入力 = 影の照合の結果の列(便ごと)・今の便の計画(planRegen + quickShadow)・環境の照合・root 昇格・変異の試験・暦の債務 →
//      出力 = 「本運用に入れる(enter)/入れない(hold)」と理由の列(と門ごとの表)。
//   ⑤ **枝 a との継ぎ目**: 「理由が領域だけ」は tests/lib-w323b-quick.mjs の QUICK_REGION_KINDS(scope だけ)。枝 a が足す理由の種類(html の物理の部分など)は
//      知らない種類として**候補から外す側**(安全側の既定 —— 自己試験 ⑤ が確かめる)。
//
// ■ 言わないこと: 「変異の試験が通ったので簡易一致は安全」(合成の段 1 種の変異の型だけ —— 窓の後でだけ効く変異は窓では見えない・落とすのは輪番のフルと
//   root 昇格の便の全段フル)・「環境が同じなら値が同じ」(同じ箱・同じ版の前提を確かめるだけ)。
import crypto from 'node:crypto';
import * as Q from './lib-w323b-quick.mjs';

// 第326便e(統括の検証項目 R294 —— 第三者の指摘 P1 を統括が確かめて取り込み・門を厳しくするだけ・休眠のまま): 影の必要便数 1 → 2(G1)・
//   暦の債務の対応を必須(G11 —— 債務 0 でも鎖が債務の段をフルで走らせる実装が無ければ hold。債務 0 は「次の便から reuse の段の古い正本を落とす仕組みがある」ことの
//   証明にならない)。版 w325d-quickgate-1 → w326e-quickgate-2(旧版は QUICKGATE_VERSION_HISTORY)。債務を鎖へ接続する実装は次の便
export const QUICKGATE_325D_VERSION = 'w326e-quickgate-2';
export const QUICKGATE_VERSION_HISTORY = Object.freeze(['w325d-quickgate-1']);
const sha256 = (s) => crypto.createHash('sha256').update(String(s)).digest('hex');

// ---------------------------------------------------------------------------------------------
// ① 合成の段と変異
// ---------------------------------------------------------------------------------------------
/** 合成の器の計画: 窓 200 步・フル 2000 步・変異は 1000 步より後(窓の後)・刻み 0.01・50 步ごとの記録。 */
export const MUT_PLAN_325D = Object.freeze({ window: 200, full: 2000, mutAfter: 1000, mutEps: 1e-3, dt: 0.01, every: 50 });
/** 合成の段(秒は輪番の並びに使う —— すべて 600 s 未満)。L1 は長期の名簿(quickVerify:'long')。 */
export const SYN_STAGES_325D = Object.freeze([
  { key: 'm1', sec: 120, seed: 1 }, { key: 'm2', sec: 150, seed: 2 }, { key: 'm3', sec: 180, seed: 3 }, { key: 'm4', sec: 210, seed: 4 },
  { key: 'm5', sec: 240, seed: 5 }, { key: 'm6', sec: 270, seed: 6 }, { key: 'L1', sec: 300, seed: 7, long: true },
].map((z) => Object.freeze(z)));
const runCache = new Map();
let runCounter = 0;
/**
 * 合成の器(純関数): 調和振動子 x'' = −(1 + 10⁻³·seed)·x を leapfrog で steps 步。mut のとき step > mutAfter で力に mutEps·x を足す(窓の後でだけ効く変異)。
 * 出力は正本の形(meta・時刻と壁時計の欄を持つ —— physSha が除く)。
 */
export function synthRun(o) {
  const P = MUT_PLAN_325D;
  const key = o.seed + '|' + (o.mut ? 1 : 0) + '|' + o.steps;
  let core = runCache.get(key);
  if (!core) {
    const w = 1 + 1e-3 * o.seed;
    let x = 1 + 0.01 * o.seed, v = 0;
    const rows = [];
    for (let k = 1; k <= o.steps; k++) {
      const acc = (xx) => -w * xx + (o.mut && k > P.mutAfter ? P.mutEps * xx : 0);
      v += 0.5 * P.dt * acc(x); x += P.dt * v; v += 0.5 * P.dt * acc(x);
      if (k % P.every === 0) rows.push({ step: k, x, v, energy: 0.5 * (v * v + w * x * x) });
    }
    core = { rows, final: { x, v } };
    runCache.set(key, core);
  }
  runCounter++;
  return { meta: { generatedAt: '2026-11-03T00:00:' + String(runCounter % 60).padStart(2, '0') + 'Z', target: 'synthetic', code: [] },
    steps: o.steps, rows: core.rows.map((r) => Object.assign({}, r)), final: Object.assign({}, core.final), wallSec: runCounter * 0.25, elapsedS: runCounter };
}

/**
 * 便の模擬(段ごとの判定と正本の状態)。
 * @param {{mode?:'shadow'|'production', K?:number, waves?:number, w0?:number, stages?:Array, mutKey:string, introAt:number,
 *          regime?:'every'|'once', debt?:boolean, stepChangeAtIntro?:boolean}} o
 *   mode: shadow = 影(regen の段は全部フル —— 判定は記録だけ)/ production = 本運用の模擬(quick の段は窓だけ —— 窓が記録と同じなら正本を残す)
 *   regime: every = どの段も毎便 領域だけの regen / once = 変異の段は変異の便でだけ領域が変わる(その後は reuse —— 他の段は every)
 *   debt: 暦の債務(③)を入れる・stepChangeAtIntro: 変異の便で步の関数が変わる(長期の名簿の段は外れる)
 * @returns {{waves:Array, caughtWave:number|null, lag:number|null, introDecision:string|null, introWindowSame:boolean|null, compareAtCaught:string|null, compareAtIntro:string|null}}
 */
export function simulateQuickWaves(o) {
  const P = MUT_PLAN_325D;
  const K = Math.max(2, Number(o.K) || Q.QUICK_K_DEFAULT), nW = Number(o.waves) || (o.introAt + K + 3), w0 = Number.isFinite(o.w0) ? o.w0 : 400;
  const mode = o.mode || 'production', regime = o.regime || 'every';
  const stages = o.stages || SYN_STAGES_325D;
  const outOf = (z) => 'tests/out/_x325d-' + z.key + '.json';
  const steps = stages.map((z) => Object.assign({ key: z.key, cmd: 'node tests/exp-x325d-' + z.key + '.mjs', outs: [outOf(z)], sec: z.sec, role: 'current' }, z.long ? { quickVerify: 'long' } : {}));
  const knobs = Object.fromEntries(stages.map((z) => [z.key, { env: { X325D_STEPS: String(P.window) }, note: '窓 ' + P.window + ' 步' }]));
  const CODE = sha256('x325d-code');
  const mutOn = (z, i) => z.key === o.mutKey && i >= o.introAt;
  const physOfJson = (z, J) => Q.physSha(J, outOf(z));
  const winFp = (z, i) => Q.windowFingerprint([{ as: outOf(z), sha: physOfJson(z, synthRun({ steps: P.window, seed: z.seed, mut: mutOn(z, i) })) }]);
  const canon = {};   // key → { json, phys, verify, lastFullWave }
  let record = null;
  const waves = [];
  let caughtWave = null, introDecision = null, introWindowSame = null, compareAtCaught = null, compareAtIntro = null;
  for (let i = 0; i < nW; i++) {
    const W = w0 + i;
    const change = (o.stepChangeAtIntro && i === o.introAt) ? { known: true, core: false, stepFns: ['x325dStep'], acceptor: [] } : { known: true, core: false, stepFns: [], acceptor: [] };
    const regionChanged = (z) => (i === 0 ? true : (regime === 'once' && z.key === o.mutKey) ? i === o.introAt : true);
    const rows = stages.map((z) => (i === 0 ? { key: z.key, status: 'regen', ownStatus: 'regen', causeKinds: ['missing'], sec: z.sec }
      : regionChanged(z) ? { key: z.key, status: 'regen', ownStatus: 'regen', causeKinds: ['scope'], sec: z.sec } : { key: z.key, status: 'reuse', ownStatus: 'reuse', causeKinds: [], sec: z.sec }));
    const byOut = new Map(stages.map((z) => [outOf(z), z]));
    const sh = Q.quickShadow({ steps: rows }, { steps, knobs, record, K, wave: W, change, cal: new Map(), codeOf: () => CODE,
      physOf: (f) => { const z = byOut.get(f); return z && canon[z.key] ? canon[z.key].phys : null; }, verifyOf: (st) => (canon[st.key] ? canon[st.key].verify : null) });
    const debtKeys = new Set(calendarDebt({ rows: stages.map((z) => ({ key: z.key })), verifyOf: (st) => (canon[st.key] ? canon[st.key].verify : null), wave: W, K }).map((d) => d.key));
    const row = {};
    for (const z of stages) {
      const r = rows.find((x) => x.key === z.key), q = r.quick || null, c = canon[z.key] || null;
      const truth = physOfJson(z, synthRun({ steps: P.full, seed: z.seed, mut: mutOn(z, i) }));
      const debt = !!o.debt && debtKeys.has(z.key);
      let act;
      const winSame = (q && q.eligible && record && record.steps[z.key]) ? winFp(z, i) === record.steps[z.key].fingerprint : null;
      if (r.status === 'reuse') act = debt ? 'full-debt' : 'reuse';
      else if (mode === 'shadow') act = 'full';
      else if (debt) act = 'full-debt';
      else if (q && q.eligible && q.decision === 'quick') act = winSame ? 'quick-same' : 'full-window-diff';
      else if (q && q.eligible) act = 'full-rotation';
      else if (q && q.why.some((w) => /K 便以内/.test(w))) act = 'full-K';
      else if (q && q.why.some((w) => /quickVerify:'long'/.test(w))) act = 'full-long';
      else act = 'full';
      const decision = q ? (q.eligible ? q.decision : 'not-eligible') : null;
      if (z.key === o.mutKey && i === o.introAt) { introDecision = decision; introWindowSame = winSame; }
      const wasStale = !!(c && c.phys !== truth);
      if (act === 'quick-same') {
        const prevQ = c.verify && c.verify.mode === 'quick' ? c.verify : null;
        c.verify = Object.assign(Q.quickVerifyMeta({ quickFingerprint: record.steps[z.key].fingerprint, fullWave: '第' + c.lastFullWave + '便', fullSha: 'abcdef0', wavesSinceFull: (prevQ ? prevQ.wavesSinceFull : 0) + 1 }),
          { quickSince: prevQ ? prevQ.quickSince : W });
      } else if (act !== 'reuse') {
        const J = synthRun({ steps: P.full, seed: z.seed, mut: mutOn(z, i) });
        canon[z.key] = { json: J, phys: physOfJson(z, J), verify: { mode: 'full' }, lastFullWave: W };
      }
      const now = canon[z.key];
      const stale = now.phys !== truth;
      if (z.key === o.mutKey && i >= o.introAt && caughtWave === null && !stale) caughtWave = W;
      row[z.key] = { status: r.status, decision, act, winSame, stale, canonChanged: !!(c && c.phys !== now.phys), wasStale, wsf: now.verify && now.verify.mode === 'quick' ? now.verify.wavesSinceFull : 0 };
    }
    // 鎖の後の記録(窓の指紋 —— 今のコードで窓を走らせる・正本は今の正本の物理の値)
    const prev = record;
    record = { version: Q.QUICK_FP_VERSION, wave: W, at: 'W' + W, steps: Object.fromEntries(stages.map((z) => [z.key, { key: z.key, window: { source: 'smoke', env: knobs[z.key].env },
      fingerprint: winFp(z, i), codeSha: CODE, htmlSha: sha256('html' + W), canon: { [outOf(z)]: canon[z.key].phys }, sec: 1, at: 'W' + W, wave: W }])) };
    let cmp = null;
    if (prev) {
      cmp = Q.shadowCompare(prev, record, { physOf: (f) => { const z = byOut.get(f); return z ? canon[z.key].phys : null; }, outsOf: (k) => [outOf({ key: k })] });
      const cr = cmp.rows.find((x) => x.key === o.mutKey);
      if (i === o.introAt) compareAtIntro = cr ? cr.cat : null;
      if (W === caughtWave) compareAtCaught = cr ? cr.cat : null;
    }
    waves.push({ wave: W, i, change: change.stepFns.length ? 'step' : 'none', eligible: sh.count.eligible, quick: sh.quick.slice(), rotationFull: sh.rotationFull.slice(),
      debt: [...debtKeys], rows: row, compare: cmp ? { count: cmp.count, falseSame: cmp.falseSame.slice() } : null });
  }
  const introWave = w0 + o.introAt;
  return { mode, regime, debt: !!o.debt, K, mutKey: o.mutKey, introWave, waves, caughtWave, lag: caughtWave === null ? null : caughtWave - introWave + 1, introDecision, introWindowSame, compareAtCaught, compareAtIntro };
}

/** 変異の模擬の表(PHYSICS の表 —— 便ごとの変異の段の判定)。sim = simulateQuickWaves の戻り。 */
export function mutationWaveRows(sim) {
  const out = ['| 便 | 変異 | 段の状態 | 簡易一致の判定 | 窓の指紋 | 鎖の処置 | 正本 | 影の照合(変異の段) |', '|---|---|---|---|---|---|---|---|'];
  const ACT = { 'quick-same': '窓だけ —— 窓が同じなので正本を残す', 'full-rotation': 'フル(輪番)', 'full-K': 'フル(K 便以内 —— wavesSinceFull ≥ K)', 'full-long': "フル(quickVerify:'long' —— 步の関数が変わった便)",
    'full-debt': 'フル(暦の債務)', 'full-window-diff': 'フル(窓が違う)', full: 'フル', reuse: '走らせない(reuse)' };
  for (const w of sim.waves) {
    const r = w.rows[sim.mutKey];
    const cmp = w.compare ? (w.compare.falseSame.includes(sim.mutKey) ? '**falseSame**' : '—') : '(記録の前)';
    out.push(`| 第${w.wave}便 | ${w.wave < sim.introWave ? 'なし' : w.wave === sim.introWave ? '**入る**' : 'あり'} | ${r.status} | ${r.decision || '—'} | ${r.winSame === null ? '—' : r.winSame ? '記録と同じ' : '記録と違う'} | ${ACT[r.act] || r.act} | ${r.stale ? '**古い(変異が載っていない)**' : r.canonChanged ? '書き直した(差 —— 落ちた)' : '今のまま'} | ${cmp} |`);
  }
  return out.join('\n');
}

/**
 * 変異の影の試験(自己試験 —— QA lint.quickMutation325d と regen-plan --quick-gate が呼ぶ)。
 * (a) 変異の入った便で簡易一致が「同じ」(影では候補に残る)・(b) 本運用の模擬で K 便以内に落ちる(regen が続く段)・reuse の段は今の規則では落ちない → 暦の債務で落ちる・
 * (c) 長期の名簿の段は步の関数の変わった便で外れる(1 便目で落ちる)。
 */
export function mutationSelfTest(o) {
  const K = Math.max(2, Number(o && o.K) || Q.QUICK_K_DEFAULT);
  const bad = [], cases = [];
  // 窓の盲点: 窓の出力は同じ・フルの出力は違う(合成の器の性質)
  const z1 = SYN_STAGES_325D[0];
  const winA = Q.physSha(synthRun({ steps: MUT_PLAN_325D.window, seed: z1.seed, mut: false }), 'x'), winB = Q.physSha(synthRun({ steps: MUT_PLAN_325D.window, seed: z1.seed, mut: true }), 'x');
  const fullA = Q.physSha(synthRun({ steps: MUT_PLAN_325D.full, seed: z1.seed, mut: false }), 'x'), fullB = Q.physSha(synthRun({ steps: MUT_PLAN_325D.full, seed: z1.seed, mut: true }), 'x');
  if (winA !== winB || fullA === fullB) bad.push('⓪ 変異が窓の後でだけ効かない(窓 ' + (winA === winB) + '・フル ' + (fullA !== fullB) + ')');
  // 時刻・壁時計の欄だけ違う 2 回の走行の指紋は同じ
  if (Q.physSha(synthRun({ steps: 400, seed: 3, mut: false }), 'x') !== Q.physSha(synthRun({ steps: 400, seed: 3, mut: false }), 'x')) bad.push('⓪ 時刻だけ違う走行の指紋が違う');
  cases.push(`⓪ 合成の器(窓 ${MUT_PLAN_325D.window} 步・フル ${MUT_PLAN_325D.full} 步・変異は ${MUT_PLAN_325D.mutAfter} 步より後): 窓の物理の値の hash は変異の前後で同じ ${winA === winB}・フルは違う ${fullA !== fullB}`);
  const nonLong = SYN_STAGES_325D.filter((z) => !z.long).map((z) => z.key);
  const intros = Array.from({ length: K }, (_, j) => 2 + j);
  // (a)(b) regen が続く段(every)—— 影と本運用の模擬
  const prod = [], shad = [];
  for (const k of nonLong) for (const ia of intros) {
    prod.push(simulateQuickWaves({ mode: 'production', K, mutKey: k, introAt: ia, regime: 'every' }));
    shad.push(simulateQuickWaves({ mode: 'shadow', K, mutKey: k, introAt: ia, regime: 'every' }));
  }
  const qa = prod.filter((s) => s.introDecision === 'quick');
  if (!qa.length) bad.push('(a) 変異の便で quick と判定された模擬が無い(窓の盲点を示せない)');
  if (qa.some((s) => s.introWindowSame !== true)) bad.push('(a) quick と判定された変異の便で窓の指紋が記録と違う');
  if (shad.some((s) => s.compareAtIntro !== 'falseSame')) bad.push('(a) 影で変異の便の影の照合が falseSame でない: ' + shad.filter((s) => s.compareAtIntro !== 'falseSame').map((s) => s.mutKey + '@' + s.introWave + ':' + s.compareAtIntro).slice(0, 3).join(','));
  cases.push(`(a) 変異の便の簡易一致の判定(本運用の模擬 ${prod.length} 通り —— 段 ${nonLong.length} × 入る便 ${intros.length}): quick ${qa.length}(窓の指紋はすべて記録と同じ —— 窓では見えない)・`
    + `輪番のフル ${prod.filter((s) => s.introDecision === 'full-rotation').length}・候補でない ${prod.filter((s) => s.introDecision === 'not-eligible').length} / 影(鎖は全段フル)では変異の便の影の照合が falseSame ${shad.filter((s) => s.compareAtIntro === 'falseSame').length}/${shad.length}`);
  const lags = prod.map((s) => s.lag);
  if (lags.some((l) => l === null || l > K)) bad.push('(b) K 便以内に落ちない模擬: ' + prod.filter((s) => s.lag === null || s.lag > K).map((s) => s.mutKey + '@' + s.introWave).slice(0, 3).join(','));
  const lateCaught = prod.filter((s) => s.lag > 1);
  if (lateCaught.some((s) => s.compareAtCaught !== 'falseSame')) bad.push('(b) 遅れて落ちた便の影の照合が falseSame でない');
  const hist = {}; for (const l of lags) hist[l] = (hist[l] || 0) + 1;
  cases.push(`(b) 本運用の模擬(領域が毎便変わる段): 落ちた便 —— 変異の便から ${Object.entries(hist).map(([l, n]) => l + ' 便目 ' + n).join('・')}(最大 ${Math.max(...lags.filter((l) => l !== null))} ≤ K ${K})・`
    + `遅れて落ちた ${lateCaught.length} 通りは落ちた便の影の照合がすべて falseSame(正本の差)`);
  // reuse の段(once): 今の規則では落ちない → 暦の債務で落ちる
  const once = [], onceDebt = [];
  for (const k of nonLong) for (const ia of intros) {
    once.push(simulateQuickWaves({ mode: 'production', K, mutKey: k, introAt: ia, regime: 'once', waves: ia + K + 4 }));
    onceDebt.push(simulateQuickWaves({ mode: 'production', K, mutKey: k, introAt: ia, regime: 'once', debt: true, waves: ia + K + 4 }));
  }
  const onceQ = once.filter((s) => s.introDecision === 'quick');
  if (!onceQ.length) bad.push('(b′) reuse の模擬で quick の便が無い');
  if (onceQ.some((s) => s.lag !== null)) bad.push('(b′) reuse の段が今の規則で落ちた(模擬の想定と違う)');
  if (onceDebt.some((s) => s.lag === null || s.lag > K)) bad.push('(b′) 暦の債務で K 便以内に落ちない: ' + onceDebt.filter((s) => s.lag === null || s.lag > K).map((s) => s.mutKey + '@' + s.introWave + ':' + s.lag).slice(0, 3).join(','));
  cases.push(`(b′) 変異の後に段の領域が変わらない(reuse)模擬 ${once.length} 通り: 変異の便で quick ${onceQ.length} 通りは**今の規則では ${once[0].waves.length - once[0].waves.findIndex((w) => w.wave === once[0].introWave)} 便の間 落ちない**(輪番は regen の段の中だけ)/ `
    + `暦の債務(最初の quick から K − 1 便の後に reuse でもフル)を入れると全部 ${Math.max(...onceDebt.map((s) => s.lag))} 便目までに落ちる`);
  // (c) 長期の名簿の段
  const lg = intros.map((ia) => simulateQuickWaves({ mode: 'production', K, mutKey: 'L1', introAt: ia, regime: 'every', stepChangeAtIntro: true }));
  if (lg.some((s) => s.introDecision !== 'not-eligible' || s.lag !== 1)) bad.push('(c) 長期の名簿の段が步の関数の変わった便で外れない: ' + lg.map((s) => s.introDecision + '/' + s.lag).join(','));
  const lgWhy = lg[0].waves.find((w) => w.wave === lg[0].introWave);
  const sh1 = simulateQuickWaves({ mode: 'production', K, mutKey: 'm1', introAt: 2, regime: 'every', stepChangeAtIntro: true });
  const stepEl = sh1.waves.find((w) => w.wave === sh1.introWave).eligible;
  if (!(stepEl > 0 && !sh1.waves.find((w) => w.wave === sh1.introWave).quick.includes('L1') && !sh1.waves.find((w) => w.wave === sh1.introWave).rotationFull.includes('L1'))) bad.push('(c) 步の関数の変わった便の候補の形');
  const ex = (chg) => { const st = [{ key: 'L1', cmd: 'node x.mjs', outs: ['tests/out/_x325d-L1.json'], sec: 300, role: 'current', quickVerify: 'long' }];
    const rec = { version: Q.QUICK_FP_VERSION, steps: { L1: { key: 'L1', window: { env: { X: '1' } }, fingerprint: 'f'.repeat(64), codeSha: 'c'.repeat(64), htmlSha: 'd'.repeat(64), canon: { 'tests/out/_x325d-L1.json': 'a'.repeat(64) } } } };
    return Q.quickShadow({ steps: [{ key: 'L1', status: 'regen', ownStatus: 'regen', causeKinds: ['scope'], sec: 300 }] }, { steps: st, knobs: { L1: { env: { X: '1' } } }, record: rec, K, wave: 400, change: chg,
      cal: new Map(), codeOf: () => 'c'.repeat(64), physOf: () => 'a'.repeat(64), verifyOf: () => null }).count.eligible; };
  const exS = ex({ known: true, core: false, stepFns: ['x325dStep'], acceptor: [] }), exA = ex({ known: true, core: false, stepFns: [], acceptor: ['validatePreset'] }), exC = ex({ known: true, core: true, stepFns: [], acceptor: [] }),
    exU = ex({ known: false }), exN = ex(null), ex0 = ex({ known: true, core: false, stepFns: [], acceptor: [] });
  if (exS || exA || exC || exU || exN || ex0 !== 1) bad.push(`(c) 長期の名簿の段の候補: 步 ${exS}・受理器 ${exA}・S._core ${exC}・分からない ${exU}・差なし(--base なし)${exN}(各 0)/ 変わらない ${ex0}(1)`);
  cases.push(`(c) 長期の名簿(quickVerify:'long')の段 L1 に步の関数の変異: 変異の便で候補でない ${lg.filter((s) => s.introDecision === 'not-eligible').length}/${lg.length}(${lgWhy ? 'フル' : '—'} —— 1 便目で落ちる)・`
    + `同じ便の名簿外の段は候補に残る(候補 ${stepEl})/ 名簿の段の候補: 步の関数・受理器・S._core・差が分からない・--base なし → 0・変わらない → ${ex0}`);
  return { version: QUICKGATE_325D_VERSION, ok: bad.length === 0, bad, cases, K,
    table: { prod: prod.length, quickAtIntro: qa.length, lagHist: hist, maxLag: Math.max(...lags.filter((l) => l !== null)), onceQuick: onceQ.length, onceDebtMaxLag: Math.max(...onceDebt.map((s) => s.lag)) },
    sample: { every: prod.find((s) => s.introDecision === 'quick' && s.lag === K) || prod.find((s) => s.introDecision === 'quick') || prod[0], once: onceQ[0] || once[0], onceDebt: onceDebt.find((s) => s.mutKey === (onceQ[0] || once[0]).mutKey && s.introWave === (onceQ[0] || once[0]).introWave) || onceDebt[0], long: lg[0] } };
}

// ---------------------------------------------------------------------------------------------
// ② 環境の整合
// ---------------------------------------------------------------------------------------------
/** 門にする欄(node・Chromium・platform)。heap は照合して印字するが既定では門にしない。 */
export const ENV_GATE_FIELDS_325D = Object.freeze(['node', 'chromium', 'platform']);
const ENV_LABEL = { node: ' Node の版', chromium: ' Chromium の版', platform: ' platform ', heapMb: ' heap の上限(MB)' };   // 前後の空白は和文と英字の間(文の中で使う —— 端は trim)
/** heap の上限(NODE_OPTIONS の --max-old-space-size と V8 の heap_size_limit)。 */
export function heapInfo(nodeOptions, heapLimitBytes) {
  const m = /--max-old-space-size[= ](\d+)/.exec(String(nodeOptions || ''));
  return { nodeOptionsHeap: m ? Number(m[1]) : null, heapMb: Number.isFinite(heapLimitBytes) ? Math.round(heapLimitBytes / 1048576) : null };
}
/** 記録の環境(記録の頭の env —— 無い古い記録は頭の node だけ)と段ごとの Node の版。 */
export function recordEnvOf(record) {
  const e = record && record.env && typeof record.env === 'object' ? record.env : {};
  const stepNodes = [...new Set(Object.values((record && record.steps) || {}).map((s) => s && s.node).filter(Boolean))].sort();
  return { node: e.node || (record && record.node) || null, chromium: e.chromium || null, platform: e.platform || null, heapMb: Number.isFinite(e.heapMb) ? e.heapMb : null,
    nodeOptionsHeap: Number.isFinite(e.nodeOptionsHeap) ? e.nodeOptionsHeap : null, stepNodes, source: record && record.env ? 'env' : 'head' };
}
const verOk = (v) => typeof v === 'string' && v.length > 0 && !/^skipped/.test(v);
/**
 * 指紋の記録と鎖の環境の照合。chainEnv = regen-chain --env の JSON(node・platform・chromium・heapMb)。
 * @returns {{version, ok:boolean, why:string[], rows:Array<{field, record, chain, same, gating}>}}
 */
export function quickEnvCheck(record, chainEnv, o) {
  const R = recordEnvOf(record), C = chainEnv && typeof chainEnv === 'object' ? chainEnv : {};
  const rows = [], why = [];
  if (!record) why.push('指紋の記録が無い');
  if (!chainEnv) why.push('鎖の環境(env.json)が無い');
  for (const f of ENV_GATE_FIELDS_325D) {
    const a = R[f], b = C[f];
    rows.push({ field: f, record: a === undefined ? null : a, chain: b === undefined ? null : b, same: verOk(a) && verOk(b) && a === b, gating: true });
    if (!record || !chainEnv) continue;
    if (!verOk(a)) why.push('記録に' + ENV_LABEL[f] + 'が無い');
    else if (!verOk(b)) why.push('鎖の' + ENV_LABEL[f] + 'が無い' + (f === 'chromium' && C.chromiumError ? '(' + String(C.chromiumError).slice(0, 60) + ')' : typeof b === 'string' ? '(' + b + ')' : ''));
    else if (a !== b) why.push((ENV_LABEL[f] + 'が違う(記録 ' + a + ' / 鎖 ' + b + ')').trim());
  }
  if (R.stepNodes.length > 1) why.push('記録の段の Node の版が混ざる(' + R.stepNodes.join(',') + ')');
  else if (R.stepNodes.length === 1 && R.node && R.stepNodes[0] !== R.node) why.push('記録の頭と段の Node の版が違う');
  const ha = R.heapMb, hb = Number.isFinite(C.heapMb) ? C.heapMb : null, strict = !!(o && o.strictHeap);
  rows.push({ field: 'heapMb', record: ha, chain: hb, same: ha !== null && hb !== null && ha === hb, gating: strict });
  if (strict && !(ha !== null && hb !== null && ha === hb)) why.push((ENV_LABEL.heapMb + 'が違うか無い(記録 ' + ha + ' / 鎖 ' + hb + ')').trim());
  return { version: QUICKGATE_325D_VERSION, ok: why.length === 0, why, rows, source: R.source,
    note: 'node・Chromium・platform が記録と鎖で同じでなければ簡易一致の候補 0。heap は浮動小数の値に効かない(OOM の有無だけ)—— 照合して印字・既定では門にしない(strictHeap で門)' };
}
/** 環境の照合の表(PHYSICS の表 —— 版の文字列は箱で違うので表の形だけを逐語にしない)。 */
export function envCheckRows(ec) {
  const out = ['| 欄 | 記録 | 鎖(env.json) | 同じ | 門 |', '|---|---|---|---|---|'];
  for (const r of ec.rows) out.push(`| ${(ENV_LABEL[r.field] || r.field).trim()} | ${r.record === null ? '(無い)' : r.record} | ${r.chain === null ? '(無い)' : r.chain} | ${r.same ? '同じ' : '違うか無い'} | ${r.gating ? '門' : '印字だけ'} |`);
  return out.join('\n');
}

// ---------------------------------------------------------------------------------------------
// ③ 暦の債務(提案 —— 休眠)
// ---------------------------------------------------------------------------------------------
/**
 * 簡易一致で残した正本(meta.verify.mode quick)のうち、最初の quick の便(verify.quickSince —— 無ければ wave − wavesSinceFull + 1 で下から見積る)から
 * K − 1 便の後(wave − quickSince ≥ K − 1)の段 —— **regen でも reuse でも**フルへ(AN518「省いた段も K 便に 1 回はフル」)。
 * @param {{rows:Array<{key}>, verifyOf:Function, wave:number, K?:number}} o
 */
export function calendarDebt(o) {
  const K = Math.max(2, Number(o && o.K) || Q.QUICK_K_DEFAULT), W = Number(o && o.wave);
  const out = [];
  if (!Number.isFinite(W)) return out;
  for (const r of (o.rows || [])) {
    const v = o.verifyOf ? o.verifyOf({ key: r.key }) : null;
    if (!v || v.mode !== 'quick') continue;
    const since = Number.isFinite(v.quickSince) ? v.quickSince : (Number.isInteger(v.wavesSinceFull) ? W - v.wavesSinceFull : null);
    if (since === null || W - since >= K - 1) out.push({ key: r.key, quickSince: since, wave: W, why: since === null ? '最初の quick の便が分からない(保守側 —— フル)' : '最初の quick の第' + since + '便から ' + (W - since) + ' 便(≥ K − 1 = ' + (K - 1) + ')' });
  }
  return out;
}

// ---------------------------------------------------------------------------------------------
// ④ 本運用の門の関数(休眠 —— 鎖は呼ばない)
// ---------------------------------------------------------------------------------------------
/** 門の既定の数(第324便c の推奨 —— 第326便e で影の必要便数を 2 へ〔第324便・第325便の鎖の後の照合 —— 第325便d の推奨〕)。 */
export const GATE_DEFAULTS_325D = Object.freeze({ minShadowWaves: 2, minHtmlDiff: 10, maxProcNaShare: 0.1, K: 3, bigSec: 600, bigMax: 2 });
/** 第326便e: 門の既定の数の前の版(w325d-quickgate-1 —— 影の必要便数 1)。 */
export const GATE_DEFAULTS_HISTORY_326E = Object.freeze({ 'w325d-quickgate-1': Object.freeze({ minShadowWaves: 1, minHtmlDiff: 10, maxProcNaShare: 0.1, K: 3, bigSec: 600, bigMax: 2 }) });
/** 手順の欠測に数えない na の理由(器・lib が違う —— フルへ回す正しい処置・窓の環境が違う —— 窓を変えた便)。 */
export const NA_NOT_PROCEDURAL_325D = Object.freeze(['codeDiff', 'env']);
/**
 * 本運用の門(休眠)。
 * @param {{shadows?:Array, plan?:object|null, env?:object|null, promote?:boolean, mutation?:object|null, debt?:{rows:Array, supported:boolean}|null,
 *          longRoster?:string[], thresholds?:object}} o
 *   shadows = 影の照合(shadowCompare / regen-plan --shadow-compare --json)の列(古い順)・plan = regen-plan の計画(plan.quickShadow)・env = quickEnvCheck の戻り・
 *   mutation = mutationSelfTest の戻り・debt = 暦の債務の段と鎖が債務を走らせるか・longRoster = 長期の名簿の段
 * @returns {{version, dormant:true, decision:'enter'|'hold', reasons:string[], conditions:Array<{id, ok, text}>}}
 */
export function quickProductionGate(o) {
  const t = Object.assign({}, GATE_DEFAULTS_325D, (o && o.thresholds) || {});
  const sh = ((o && o.shadows) || []).filter(Boolean);
  const counted = sh.filter((s) => s.countsAsShadowWave === true);
  const last = counted.length ? counted[counted.length - 1] : null;
  const qs = o && o.plan ? o.plan.quickShadow || null : null;
  const C = [];
  const add = (id, ok, text) => C.push({ id, ok: !!ok, text });
  add('G1', counted.length >= t.minShadowWaves && sh.length > 0 && sh[sh.length - 1].countsAsShadowWave === true,
    `数える影の便 ${counted.length}(≥ ${t.minShadowWaves})・最新の影の照合が影の 1 便に数えられる ${sh.length ? String(sh[sh.length - 1].countsAsShadowWave === true) : '—(無い)'}`);
  const fsum = sh.reduce((a, s) => a + ((s.count && s.count.falseSame) || 0), 0);
  add('G2', sh.length > 0 && fsum === 0, `falseSame の和 ${fsum}(影の照合 ${sh.length} 便 —— 0 段)`);
  const hd = last && last.tally ? last.tally.comparedHtmlDiff : null;
  add('G3', Number.isFinite(hd) && hd >= t.minHtmlDiff, `最新の数える影の便の html が違う比較 ${hd === null ? '—' : hd}(≥ ${t.minHtmlDiff})`);
  let procNa = null, keys = null;
  if (last && last.tally) {
    keys = last.tally.keys;
    const W = Q.SHADOW_NA_WHY, notProc = new Set(NA_NOT_PROCEDURAL_325D.map((k) => W[k]));
    procNa = Object.entries(last.tally.naByReason || {}).filter(([k]) => !notProc.has(k)).reduce((a, [, v]) => a + v, 0);
  }
  add('G4', procNa !== null && keys > 0 && procNa <= t.maxProcNaShare * keys, `手順の欠測の na ${procNa === null ? '—' : procNa}/${keys === null ? '—' : keys} 段(≤ ${t.maxProcNaShare * 100}% —— 器・lib が違う・窓の環境が違うは数えない)`);
  const roster = new Set((o && o.longRoster) || []);
  const longElig = qs ? (qs.rows || []).filter((r) => roster.has(r.key) && r.eligible).map((r) => r.key) : null;
  add('G5', !!qs && (qs.stepChange === 'no' || longElig.length === 0), qs ? `步/受理器/S._core の差 ${qs.stepChange} —— 長期の名簿 ${roster.size} 段の候補 ${longElig.length}${qs.stepChange === 'no' ? '(差なし —— 名簿の段も候補にしてよい)' : '(0 段)'}` : '今の便の計画(quickShadow)が無い');
  const env = o && o.env;
  add('G6', !!env && env.ok === true && !!qs && !!qs.env && qs.env.ok === true, `環境の整合 ${env ? (env.ok ? '同じ' : '違う —— ' + env.why.join('・')) : '照合していない'}・計画の影の表の環境 ${qs && qs.env ? (qs.env.ok ? '同じ' : '違う') : '照合していない(w325d-quick-3 より前の計画か --no-env-check)'}`);
  add('G7', !!qs && qs.K === t.K && Q.QUICK_K_DEFAULT === t.K, `輪番の K ${qs ? qs.K : '—'}(= ${t.K}・lib の既定 ${Q.QUICK_K_DEFAULT})`);
  add('G8', Q.QUICK_BIG_SEC === t.bigSec && Q.QUICK_BIG_MAX === t.bigMax, `${t.bigSec} s 以上の段の輪番のフルは 1 便 ${Q.QUICK_BIG_MAX} 本まで(lib ${Q.QUICK_BIG_SEC} s・${Q.QUICK_BIG_MAX} 本)`);
  const promote = !!(o && o.promote) || !!(qs && qs.promote);
  add('G9', !promote, promote ? 'root 昇格の便(全段フル —— 簡易一致を使わない)' : 'root 昇格の便でない');
  const mu = o && o.mutation;
  add('G10', !!mu && mu.ok === true, mu ? `変異の影の試験 ${mu.ok ? '通る' : '落ちる —— ' + mu.bad.slice(0, 2).join(' / ')}(${mu.version})` : '変異の影の試験が無い');
  // 第326便e: 債務 0 は「将来の reuse の段を K 便以内にフルへ回す仕組みがある」ことの証明にならない —— 鎖が債務の段をフルで走らせる(supported)ことを必須にする
  const debt = (o && o.debt) || { rows: [], supported: false };
  add('G11', debt.supported === true, `暦の債務の段 ${debt.rows.length}${debt.rows.length ? '(' + debt.rows.slice(0, 4).map((d) => d.key).join(',') + ')' : ''}・鎖が債務の段をフルで走らせる ${debt.supported === true}`
    + (debt.supported === true ? '' : '(必須 —— 債務 0 でも対応が無ければ入れない・第326便e)'));
  add('G12', !!qs && !!qs.record, qs && qs.record ? `指紋の記録 ${qs.record.steps} 段(第${qs.record.wave}便)` : '計画に指紋の記録が無い');
  const failed = C.filter((c) => !c.ok);
  return { version: QUICKGATE_325D_VERSION, dormant: true, decision: failed.length ? 'hold' : 'enter',
    reasons: failed.length ? failed.map((c) => c.id + ' ' + c.text) : ['すべての門を満たす(' + C.length + ' 項)'], conditions: C,
    note: '休眠 —— 鎖も計画も呼ばない(印字だけ)。数(閾値)は GATE_DEFAULTS_325D(第324便c の推奨・影の必要便数 2 と暦の債務の対応の必須は第326便e)' };
}
/** 門の表(PHYSICS の表)。 */
export function gateRows(g) {
  const out = ['| 門 | 満たす | 中身 |', '|---|---|---|'];
  for (const c of g.conditions) out.push(`| ${c.id} | ${c.ok ? '満たす' : '**満たさない**'} | ${c.text.replace(/\|/g, '\\|')} |`);
  return out.join('\n');
}

// ---------------------------------------------------------------------------------------------
// 自己試験(器を走らせない —— QA lint.quickMutation325d・lint.quickEnv325d が呼ぶ)
// ---------------------------------------------------------------------------------------------
/**
 * 環境の整合・枝 a との継ぎ目・暦の債務・門の関数の形の自己試験。o.steps・o.knobs・o.roster があれば実物の表の長期の名簿の確かめも(⑥)。
 */
export function quickGateSelfTest(o) {
  const bad = [], cases = [];
  // ① 環境の整合
  const env = { node: 'v22.22.0', platform: 'linux/x64', chromium: '141.0.7390.37', heapMb: 4144 };
  const recNew = { version: Q.QUICK_FP_VERSION, node: 'v22.22.0', env: { node: 'v22.22.0', platform: 'linux/x64', chromium: '141.0.7390.37', heapMb: 6192 }, steps: { a: { node: 'v22.22.0' } } };
  const recOld = { version: Q.QUICK_FP_VERSION, node: 'v22.22.0', steps: { a: { node: 'v22.22.0' } } };
  const e1 = quickEnvCheck(recNew, env), e2 = quickEnvCheck(recOld, env), e3 = quickEnvCheck(recNew, Object.assign({}, env, { node: 'v24.1.0' })), e4 = quickEnvCheck(recNew, Object.assign({}, env, { chromium: 'skipped(REGEN_ENV_BROWSER=0)' }));
  const e5 = quickEnvCheck(recNew, env, { strictHeap: true }), e6 = quickEnvCheck(recNew, null), e7 = quickEnvCheck(Object.assign({}, recNew, { steps: { a: { node: 'v22.22.0' }, b: { node: 'v24.1.0' } } }), env);
  if (!e1.ok || e2.ok || e3.ok || e4.ok || e5.ok || e6.ok || e7.ok) bad.push(`① 環境の照合: 同じ ${e1.ok}・古い記録 ${e2.ok}・Node 違い ${e3.ok}・Chromium を起こさない ${e4.ok}・heap 違い(門) ${e5.ok}・env.json なし ${e6.ok}・段の Node が混ざる ${e7.ok}`);
  // quickShadow の o.envCheck —— 候補 0・ifRecorded は残る
  const st = [{ key: 'a', cmd: 'node x.mjs', outs: ['tests/out/a.json'], sec: 100, role: 'current' }];
  const H = 'a'.repeat(64);
  const rec = { version: Q.QUICK_FP_VERSION, steps: { a: { key: 'a', window: { env: { Q: '1' } }, fingerprint: 'f'.repeat(64), codeSha: 'c'.repeat(64), htmlSha: 'd'.repeat(64), canon: { 'tests/out/a.json': H } } } };
  const plan = () => ({ steps: [{ key: 'a', status: 'regen', ownStatus: 'regen', causeKinds: ['scope'], sec: 100 }] });
  const base = { steps: st, record: rec, codeOf: () => 'c'.repeat(64), physOf: () => H, knobs: { a: { env: { Q: '1' } } }, cal: new Map(), K: 3, wave: 325, change: { known: true, core: false, stepFns: [], acceptor: [] } };
  const s0 = Q.quickShadow(plan(), base), s1 = Q.quickShadow(plan(), Object.assign({}, base, { envCheck: e2 })), s2 = Q.quickShadow(plan(), Object.assign({}, base, { envCheck: e1 }));
  if (s0.count.eligible !== 1 || s1.count.eligible !== 0 || s1.count.ifRecorded !== 1 || !s1.rows[0].why.some((w) => /^環境が記録と違う/.test(w)) || s2.count.eligible !== 1 || !s1.env || s1.env.ok !== false || s0.env !== null)
    bad.push(`① quickShadow の環境: 照合なし ${s0.count.eligible}・違う ${s1.count.eligible}(ifRecorded ${s1.count.ifRecorded})・同じ ${s2.count.eligible}`);
  cases.push(`① 環境の整合(node・Chromium・platform が門・heap は印字だけ): 同じ → ${e1.ok}・古い記録(頭の node だけ)→ ${e2.ok}(${e2.why.join('・')})・Node 違い → ${e3.ok}・Chromium を起こさない → ${e4.ok}・`
    + `heap 違い(strictHeap)→ ${e5.ok}・env.json なし → ${e6.ok}・段の Node が混ざる → ${e7.ok} / quickShadow: 違えば候補 ${s1.count.eligible}(記録があれば ${s1.count.ifRecorded} —— 記録の条件)・同じなら ${s2.count.eligible}`);
  const hi = heapInfo('--use-openssl-ca --max-old-space-size=6144', 6442450944 + 52428800);
  if (hi.nodeOptionsHeap !== 6144 || hi.heapMb !== 6194 || heapInfo('--use-openssl-ca', NaN).nodeOptionsHeap !== null) bad.push('① heap の読み: ' + JSON.stringify(hi));
  // ② 枝 a との継ぎ目(知らない理由の種類は候補から外す)
  const kinds = [['scope'], ['scope', 'htmlPhys'], ['htmlPhys'], ['html'], ['scope', 'code'], [], ['prose']];
  const ro = kinds.map((k) => Q.regionOnlyKinds(k));
  const sA = Q.quickShadow({ steps: [{ key: 'a', status: 'regen', ownStatus: 'regen', causeKinds: ['scope', 'htmlPhys'], sec: 100 }] }, base);
  if (JSON.stringify(ro) !== JSON.stringify([true, false, false, false, false, false, false]) || sA.count.regionOnly !== 0 || JSON.stringify(Q.QUICK_REGION_KINDS) !== '["scope"]') bad.push('② 理由の種類: ' + JSON.stringify(ro) + '・新しい種類の行の領域だけ ' + sA.count.regionOnly);
  cases.push(`② 枝 a との継ぎ目: 領域に数える種類 ${JSON.stringify(Q.QUICK_REGION_KINDS)} だけ —— scope → 領域だけ・scope と知らない種類(htmlPhys など)・知らない種類だけ・html・code・空 → 領域だけでない(候補から外す側)`);
  // ③ 暦の債務
  const vq = (since, wsf) => ({ mode: 'quick', wavesSinceFull: wsf, quickSince: since });
  const d = calendarDebt({ rows: [{ key: 'a' }, { key: 'b' }, { key: 'c' }, { key: 'd' }], verifyOf: (x) => ({ a: vq(400, 1), b: vq(401, 1), c: { mode: 'full' }, d: { mode: 'quick', wavesSinceFull: 2 } })[x.key], wave: 402, K: 3 });
  if (d.map((z) => z.key).join(',') !== 'a,d') bad.push('③ 暦の債務: ' + d.map((z) => z.key).join(','));
  cases.push(`③ 暦の債務(K 3・第402便): 最初の quick 第400便 → 債務・第401便 → まだ・full → なし・quickSince なし(wavesSinceFull 2 から見積り)→ 債務`);
  // ④ 門の関数(入力と出力の形 —— 休眠)
  const okShadow = { countsAsShadowWave: true, count: { falseSame: 0 }, tally: { keys: 57, comparedHtmlDiff: 55, naByReason: { [Q.SHADOW_NA_WHY.noFingerprint]: 1, [Q.SHADOW_NA_WHY.codeDiff]: 1 } } };
  const qsOk = { K: 3, stepChange: 'yes', promote: false, record: { steps: 59, wave: 324 }, env: { ok: true }, rows: [{ key: 'geo3', eligible: false }, { key: 'x', eligible: true }] };
  const mu = { ok: true, bad: [], version: QUICKGATE_325D_VERSION };
  // 第326便e: 既定の入力は影 2 便・暦の債務の対応あり(門を通る形)—— 1 つずつ崩して落ちる門を確かめる
  const gateBase = { shadows: [okShadow, JSON.parse(JSON.stringify(okShadow))], plan: { quickShadow: qsOk }, env: e1, mutation: mu, longRoster: ['geo3'], debt: { rows: [], supported: true } };
  const probe = (patch) => quickProductionGate(Object.assign({}, gateBase, patch));
  const g0 = probe({});
  const g1 = probe({ plan: { quickShadow: Object.assign({}, qsOk, { env: { ok: false } }) }, env: e2 });
  const g2 = probe({ shadows: [okShadow, Object.assign({}, okShadow, { count: { falseSame: 1 } })] });
  const g3 = probe({ shadows: [okShadow, Object.assign({}, okShadow, { tally: Object.assign({}, okShadow.tally, { comparedHtmlDiff: 9 }) })] });
  const g4 = probe({ plan: { quickShadow: Object.assign({}, qsOk, { rows: [{ key: 'geo3', eligible: true }] }) } });
  const g5 = probe({ promote: true });
  const g6 = probe({ debt: { rows: [{ key: 'a' }], supported: false } });
  const g7 = probe({ shadows: [okShadow, Object.assign({}, okShadow, { tally: Object.assign({}, okShadow.tally, { naByReason: { [Q.SHADOW_NA_WHY.noFingerprint]: 6, [Q.SHADOW_NA_WHY.codeDiff]: 20 } }) })] });
  const g8 = quickProductionGate({});
  // 第326便e: 債務 0 で鎖が債務を扱えない → hold(G11)・影 1 便 → hold(G1)・影 1 便の数える便と数えない便 → hold(G1)・債務の欄が無い → hold(G11)
  const g9 = probe({ debt: { rows: [], supported: false } });
  const g10 = probe({ shadows: [okShadow] });
  const g11 = probe({ shadows: [Object.assign({}, okShadow, { countsAsShadowWave: false }), okShadow] });
  const g12 = probe({ debt: undefined });
  const failIds = (g) => g.conditions.filter((c) => !c.ok).map((c) => c.id).join(',');
  const want = [[g0, 'enter', ''], [g1, 'hold', 'G6'], [g2, 'hold', 'G2'], [g3, 'hold', 'G3'], [g4, 'hold', 'G5'], [g5, 'hold', 'G9'], [g6, 'hold', 'G11'], [g7, 'hold', 'G4'],
    [g9, 'hold', 'G11'], [g10, 'hold', 'G1'], [g11, 'hold', 'G1'], [g12, 'hold', 'G11']];
  const miss = want.filter(([g, dcs, ids]) => g.decision !== dcs || failIds(g) !== ids).map(([g, dcs, ids]) => dcs + '/' + ids + '≠' + g.decision + '/' + failIds(g));
  if (miss.length || g8.decision !== 'hold' || g8.conditions.length !== 12 || g0.dormant !== true || !Array.isArray(g0.reasons)) bad.push('④ 門の関数: ' + miss.join(' ; ') + ' / 空の入力 ' + g8.decision + '・' + g8.conditions.length);
  cases.push(`④ 門の関数(休眠 —— 出力は enter/hold と理由の列): すべて満たす → ${g0.decision}・環境 → ${g1.decision}(${failIds(g1)})・falseSame → ${failIds(g2)}・html が違う比較 9 → ${failIds(g3)}・名簿の段が候補 → ${failIds(g4)}・`
    + `root 昇格 → ${failIds(g5)}・暦の債務(鎖が走らせない)→ ${failIds(g6)}・手順の欠測 6/57 → ${failIds(g7)}(器・lib が違う 20 は数えない)・空の入力 → ${g8.decision}(門 ${g8.conditions.length} 項)・`
    + `第326便e: 債務 0 で鎖が債務を扱えない → ${g9.decision}(${failIds(g9)})・影 1 便 → ${g10.decision}(${failIds(g10)})・数える影 1 便 + 数えない 1 便 → ${g11.decision}(${failIds(g11)})・債務の欄なし → ${g12.decision}(${failIds(g12)})・影の必要便数 ${GATE_DEFAULTS_325D.minShadowWaves}`);
  // ⑤ 実物の表の長期の名簿(o.steps・o.knobs・o.roster があれば): 步の関数が変わった便で名簿の段の候補 0・変わらない便で名簿の理由で外れない
  if (o && o.steps && o.knobs && o.roster) {
    const roster = Object.keys(o.roster), by = new Map(o.steps.map((z) => [z.key, z]));
    const live = roster.filter((k) => by.has(k) && by.get(k).role !== 'history');
    const recR = { version: Q.QUICK_FP_VERSION, steps: Object.fromEntries(live.map((k) => [k, { key: k, window: { env: Object.assign({}, ((Q.stepWindow(by.get(k), o.knobs) || {}).env) || {}) }, fingerprint: 'f'.repeat(64),
      codeSha: 'c'.repeat(64), htmlSha: 'd'.repeat(64), canon: Object.fromEntries((by.get(k).outs || []).map((f) => [f, H])) }])) };
    const pr = () => ({ steps: live.map((k) => ({ key: k, status: 'regen', ownStatus: 'regen', causeKinds: ['scope'], sec: by.get(k).sec })) });
    const opt = (chg) => ({ steps: o.steps, knobs: o.knobs, record: recR, K: 3, wave: 325, change: chg, cal: new Map(), codeOf: () => 'c'.repeat(64), physOf: () => H, verifyOf: () => null });
    const a1 = Q.quickShadow(pr(), opt({ known: true, core: false, stepFns: ['dfmStep3'], acceptor: [] })), a2 = Q.quickShadow(pr(), opt({ known: true, core: false, stepFns: [], acceptor: [] }));
    const longWhy = (r) => r.why.some((w) => /quickVerify:'long'/.test(w));
    const n1 = a1.rows.filter((r) => r.eligible).length, n2 = a2.rows.filter((r) => longWhy(r)).length, nl = live.filter((k) => by.get(k).quickVerify === 'long').length;
    if (n1 !== 0 || n2 !== 0 || nl !== live.length) bad.push(`⑤ 実物の名簿: 步の関数が変わった便の候補 ${n1}(0)・変わらない便で名簿の理由 ${n2}(0)・宣言 'long' ${nl}/${live.length}`);
    cases.push(`⑤ 実物の長期の名簿 ${live.length} 段(段の宣言 quickVerify:'long' ${nl}): 步の関数が変わった便の候補 ${n1}・変わらない便で名簿の理由で外れる段 ${n2}(窓の無い段・較正の段などの別の理由は残る —— 候補 ${a2.count.eligible})`);
  }
  return { version: QUICKGATE_325D_VERSION, ok: bad.length === 0, bad, cases };
}

export default { QUICKGATE_325D_VERSION, QUICKGATE_VERSION_HISTORY, GATE_DEFAULTS_HISTORY_326E, MUT_PLAN_325D, SYN_STAGES_325D, synthRun, simulateQuickWaves, mutationWaveRows, mutationSelfTest, ENV_GATE_FIELDS_325D, heapInfo, recordEnvOf,
  quickEnvCheck, envCheckRows, calendarDebt, GATE_DEFAULTS_325D, NA_NOT_PROCEDURAL_325D, quickProductionGate, gateRows, quickGateSelfTest };
