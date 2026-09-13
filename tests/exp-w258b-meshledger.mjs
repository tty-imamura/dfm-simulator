// 第258便b W2「引きずりの仕事を帳簿へ・最小の閉鎖系 K+U+E_mesh+Q」(第50報)。
//
// 原仮定者(第49報・第50報。原文は docs/PHYSICS.md 〔第257便b〕〔第258便b〕に引用):
//   「ブラックホール以降も同様に、エネルギー収支の整合と、質量以外の観測値との一致を目指す。
//    その際に、観測した事実が無いエネルギーを許容する」「空間メッシュの実装について精査する」
//
// 第257便b ⑦-7 は「次便で定義すべき項の 1 番目は**引きずりの仕事**」と書いた。本器はそれを測る。
//
// 測る量:
//   ① **引きずりの仕事**(opt-in `physics.ledger:{dragWork:true}`)—— 🔥🎈🎻🍇🎠 の 600 步で
//      W_drag=Σ m v·Δv と ΔK_drag=Σ m(v·Δv+½|Δv|²)、帳簿の残差の**前**(residual)と**後**
//      (residualDrag = ΔE_tot−ΔW_ext−ΔK_drag)。**宣言しても 600 步の状態がビット同一**であること。
//   ② **最小の閉鎖系** K(節点)+U(重力)+E_mesh(有限容量+弾性)+Q(熱):
//      (a) 外部供給が無ければ ΔE_tot=0(dt 3 段で残差の収束次数)
//      (b) 外力を与えれば ΔE_tot=W_ext・**pinned 中心の維持仕事は厳密に 0**(力は 0 でない)
//      (c) **容量枯渇で応答が弱まる**(E₀ 3 段)・Q≥0・E_mesh≥0
//      (d) **粘性中継のときだけ限界半径が出る**(kScale 0/1 × E₀ 3 段。一般化はしない)
//
// **粒子の力へは 1 バイトも接続しない**(器の中の縮約系)。**観測回転曲線は 1 つも入力しない。**
// **「帳簿が整合した」「銀河サンプルが完成した」とは書かない。**
//
// 実行: node tests/exp-w258b-meshledger.mjs [--drag] [--closed] [--cap] [--relay]
// 出力: tests/out/meshledger-w258b.json(未コミット —— 数値は PHYSICS に全載)
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const TARGET = process.env.QA_TARGET || 'beta/index.html';
const INDEX = 'file://' + (path.isAbsolute(TARGET) ? TARGET : path.join(ROOT, TARGET));
const OUT = process.env.W258B_OUT2 || path.join(ROOT, 'tests', 'out', 'meshledger-w258b.json');
const argv = process.argv.slice(2);
const only = argv.filter((a) => a.startsWith('--')).map((a) => a.slice(2));
const want = (k) => !only.length || only.includes(k);

let browser;
try { const { chromium } = await import('playwright'); browser = await chromium.launch(); }
catch {
  const { chromium } = await import('playwright');
  browser = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH || '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
}
const pg = await browser.newPage();
const pageErrors = [];
pg.on('pageerror', (e) => pageErrors.push(String(e)));
await pg.goto(INDEX, { waitUntil: 'load' });
await pg.waitForFunction(() => window.HP && HP.sim);

const out = { target: TARGET, node: process.version, at: new Date().toISOString(), wave: '258b' };

await pg.evaluate(() => {
  const W = (window.__w258b = {});
  W.byId = (id) => HP.allPresets().find((p) => p.id === id);
  W.build = (id, steps, patch) => {
    const pd = JSON.parse(JSON.stringify(W.byId(id)));
    if (patch) patch(pd);
    const v = HP.validatePreset(pd);
    if (!v.ok) throw new Error('invalid ' + id + ' ' + JSON.stringify(v.errors || v.err));
    const S = HP.sim; S.build(v.preset);
    for (let k = 0; k < (steps || 0); k++) S.step(0.016);
    S._galSup = null;
    return S;
  };
  W.snap = (S) => { const a = [];
    for (const k of ['x', 'y', 'vx', 'vy', 'spin', 'm', 'R']) for (let i = 0; i < S.n; i++) a.push(S[k][i]);
    return a; };
  W.bitSame = (a, b) => a.length === b.length && a.every((z, i) => Object.is(z, b[i]));
  // 円盤粒子だけの一覧(pinned 中心は**重力の錨**として別に渡す)
  W.disk = (S) => { const L = [];
    for (let i = 0; i < S.n; i++) { if (S.pinned && S.pinned[i] === 1) continue;
      L.push({ m: S.m[i], x: S.x[i], y: S.y[i], vx: S.vx[i], vy: S.vy[i] }); }
    return L; };
  W.tRot = (S, rRef) => { let M = 0, s = 0;
    for (let i = 0; i < S.n; i++) { const r = Math.hypot(S.x[i], S.y[i]);
      if (!(r > rRef * 0.8) || !(r < rRef * 1.2)) continue;
      const vp = (S.x[i] * S.vy[i] - S.y[i] * S.vx[i]) / r;
      M += S.m[i]; s += S.m[i] * Math.abs(vp); }
    return M > 0 ? (2 * Math.PI * rRef) / (s / M) : 0; };
});

// ---------- ① 引きずりの仕事(opt-in)
if (want('drag')) {
  out.drag = await pg.evaluate(() => {
    const W = window.__w258b;
    const rows = [];
    for (const id of ['gas', 'pressure', 'gw150914DFM', 'tuc47', 'galaxyMeshSpiral']) {
      const pd = W.byId(id); if (!pd) continue;
      // (i) 宣言なし(基点)
      const S0 = W.build(id, 0);
      const a0 = HP.dfmToyLedger(S0, {});
      for (let k = 0; k < 600; k++) S0.step(0.016);
      const b0 = HP.dfmToyLedger(S0, { ref: a0 });
      const st0 = W.snap(S0);
      // (ii) physics.ledger:{dragWork:true} を宣言
      const S1 = W.build(id, 0, (p) => { p.physics.ledger = { dragWork: true }; });
      const a1 = HP.dfmToyLedger(S1, {});
      for (let k = 0; k < 600; k++) S1.step(0.016);
      const b1 = HP.dfmToyLedger(S1, { ref: a1 });
      const st1 = W.snap(S1);
      rows.push({ id, emoji: pd.emoji, n: S1.n,
        Etot: b1.Etot, residual: b1.residual, rel: Math.abs(b1.residual) / (Math.abs(b1.Etot) || 1),
        Wdrag: b1.Wdrag, WdragKE: b1.WdragKE, WdragSpin: b1.WdragSpin,
        dWdragKE: b1.dWdragKE, residualDrag: b1.residualDrag,
        relDrag: b1.residualDrag === null ? null : Math.abs(b1.residualDrag) / (Math.abs(b1.Etot) || 1),
        kicks: b1.dragWorkN, stop: S1.dragWorkStop,
        offWdrag: b0.Wdrag, offAcc: S0.dragWorkE, offHas: !!S0.hasDragWork,
        bitSame: W.bitSame(st0, st1), resSame: Object.is(b0.residual, b1.residual),
        sigOff: HP.validatePreset(JSON.parse(JSON.stringify(pd))).preset.physics.ledger,
        undef: b1.undefinedTerms });
    }
    return rows;
  });
  for (const r of out.drag) {
    console.log(`${r.emoji}${r.id} rel ${r.rel.toExponential(3)} -> relDrag ${r.relDrag === null ? 'n/a' : r.relDrag.toExponential(3)}`
      + ` Wdrag ${Number(r.Wdrag).toExponential(4)} dKdrag ${Number(r.dWdragKE).toExponential(4)} kicks ${r.kicks} bitSame ${r.bitSame}`);
  }
}

// ---------- ② 最小の閉鎖系(a) 外部供給なし・dt 3 段
if (want('closed')) {
  out.closed = await pg.evaluate(() => {
    const W = window.__w258b;
    const S = W.build('galaxyMeshSpiral', 3000);
    const L = W.disk(S);
    const T = W.tRot(S, 140), tau = 0.2 * T;
    const mk = (rings, kSc) => HP.dfmChainMeshBuild(L, { rings, kNeighbors: 1, mu: 1, tau, zeta: 1,
      tauDrag: tau, gammaBg: 1, bond: 'central', kScale: kSc, center: [0, 0],
      D0: S.params.D0, p: 2, eps: S.params.softening });
    const run = (rings, kSc, dt, nst, opts) => {
      const ch = mk(rings, kSc);
      // 容量の門が効かない対照は **大きな有限値**(Infinity だと E_tot が無限になって残差が定義されない)
      const cs = HP.dfmChainMeshClosed(ch, Object.assign({ Emesh0: 1e4, G: S.params.G, centralMass: 2500,
        eps: S.params.softening }, opts || {}));
      const e0 = HP.dfmChainMeshClosedEnergy(cs);
      let last = null, qMin = Infinity, emMin = Infinity, resAbs = 0;
      let qPrev = 0;
      for (let k = 0; k < nst; k++) {
        last = HP.dfmChainMeshClosedStep(cs, dt);
        if (!last) return null;
        if (last.dQ < qMin) qMin = last.dQ;
        if (last.Emesh < emMin) emMin = last.Emesh;
        resAbs += Math.abs(last.residual);
        qPrev = last.Q;
      }
      const e1 = HP.dfmChainMeshClosedEnergy(cs);
      const Us = [];
      for (let i = 0; i < ch.n; i++) Us.push(Math.hypot(ch.U[2 * i], ch.U[2 * i + 1]));
      return { rings, kScale: kSc, dt, steps: nst, T, tau,
        K0: e0.K, U0: e0.U, Em0: e0.Emesh, Q0: e0.Q, Etot0: e0.Etot,
        K1: e1.K, U1: e1.U, Em1: e1.Emesh, Eres: cs.Eres, Eel: e1.Eelastic, Q1: e1.Q, Etot1: e1.Etot,
        Wext: cs.Wext, Wpin: cs.Wpin, Fpin: e1.Fpin,
        dEtot: e1.Etot - e0.Etot, resTot: (e1.Etot - e0.Etot) - (cs.Wext - e0.Wext),
        // 規格化は **動いた量**(K・U・Q・供給)で取る(E₀ の大きさで残差を小さく見せない)
        Escale: Math.abs(e1.K) + Math.abs(e1.U) + Math.abs(e1.Q) + Math.abs(cs.Esupplied),
        relTot: Math.abs((e1.Etot - e0.Etot) - (cs.Wext - e0.Wext))
          / (Math.abs(e1.K) + Math.abs(e1.U) + Math.abs(e1.Q) + Math.abs(cs.Esupplied) || 1),
        resAbs, dQmin: qMin, EmeshMin: emMin, capState: cs.capState,
        Esupplied: cs.Esupplied, driveOff: cs.driveOffSteps, U: Us, qTot: qPrev };
    };
    // **窓の宣言**: 中心の pinned 質量(2500)を重力に入れると節点は落ち込む(この縮約系は
    // 軌道の模型ではない —— ξ は基準配置からの変位であって公転ではない)。したがって
    // **恒等の確認は短い窓**(t=3・落下変位が最内節点の半径の 1% 未満)で dt 3 段を取り、
    // **容量と中継の長い走行は中心質量を入れない**(節点間の重力だけ)ことを宣言する。
    const base = [];
    const T0 = W.tRot(S, 140);
    const win = 3, dt0 = win / 400;
    for (const d of [dt0, dt0 / 2, dt0 / 4]) base.push(run(5, 1, d, Math.round(win / d)));
    // 収束次数(残差の総和の比)
    const ord = (a, b) => (a && b && b.resAbs > 0) ? Math.log2(a.resAbs / b.resAbs) : null;
    // (b) 外部供給: 節点 2 に一定外力
    const ch2 = mk(5, 1);
    const ext = []; for (let i = 0; i < ch2.n; i++) ext.push(i === 2 ? [3, 0] : [0, 0]);
    const withExt = run(5, 1, dt0, Math.round(win / dt0), { ext });
    // リング数 3/4/5 でも同じ恒等が立つか
    const rings = [3, 4, 5].map((r) => run(r, 1, dt0, Math.round(win / dt0)));
    // 粘性だけ(kScale=0)の対照
    const visc = run(5, 0, dt0, Math.round(win / dt0));
    return { base, order: [ord(base[0], base[1]), ord(base[1], base[2])], withExt, rings, visc,
      dt0, T0, window: win };
  });
  console.log('closed base rel', out.closed.base.map((b) => b.relTot.toExponential(2)).join(' / '),
    'order', out.closed.order.map((z) => z === null ? 'n/a' : z.toFixed(2)).join('/'));
  console.log('withExt Wext', out.closed.withExt.Wext.toExponential(5),
    'dEtot', out.closed.withExt.dEtot.toExponential(5),
    'rel', out.closed.withExt.relTot.toExponential(2),
    'Wpin', out.closed.withExt.Wpin, 'Fpin', out.closed.withExt.Fpin.map((z) => z.toExponential(3)).join(','));
}

// ---------- ② (c) 容量 E₀ 3 段
if (want('cap')) {
  out.cap = await pg.evaluate(() => {
    const W = window.__w258b;
    const S = W.build('galaxyMeshSpiral', 3000);
    const L = W.disk(S);
    const T = W.tRot(S, 140), tau = 0.2 * T, dt = tau / 40, nst = Math.round(4 * T / dt);
    const mk = () => HP.dfmChainMeshBuild(L, { rings: 5, kNeighbors: 1, mu: 1, tau, zeta: 1,
      tauDrag: tau, gammaBg: 1, bond: 'central', kScale: 1, center: [0, 0],
      D0: S.params.D0, p: 2, eps: S.params.softening });
    // **宣言**: 長い走行では中心の pinned 質量を重力に入れない(入れると節点が落ち込む —— この
    // 縮約系は軌道の模型ではない)。重力 U は**節点間の重力**である(恒等の確認〔closed〕では
    // 中心質量を入れた短い窓で測ってある)
    const run = (E0, Gv) => {
      const ch = mk();
      const cs = HP.dfmChainMeshClosed(ch, { Emesh0: E0, G: (Gv === undefined) ? 0 : Gv, centralMass: 0,
        eps: S.params.softening });
      const e0 = HP.dfmChainMeshClosedEnergy(cs);
      let emMin = Infinity, qMin = Infinity, floorAt = null;
      for (let k = 0; k < nst; k++) {
        const r = HP.dfmChainMeshClosedStep(cs, dt);
        if (r.Emesh < emMin) emMin = r.Emesh;
        if (r.dQ < qMin) qMin = r.dQ;
        if (floorAt === null && r.capState === 'floor') floorAt = k;
      }
      const e1 = HP.dfmChainMeshClosedEnergy(cs);
      const Us = []; for (let i = 0; i < ch.n; i++) Us.push(Math.hypot(ch.U[2 * i], ch.U[2 * i + 1]));
      return { E0, G: (Gv === undefined) ? 0 : Gv, U0: e0.U, U1: e1.U,
        Etot0: e0.Etot, Etot1: e1.Etot, Wext: cs.Wext,
        res: (e1.Etot - e0.Etot) - cs.Wext, rel: Math.abs((e1.Etot - e0.Etot) - cs.Wext) / (Math.abs(e1.Etot) || 1),
        Eres: cs.Eres, Eel: e1.Eelastic, Emesh: e1.Emesh, EmeshMin: emMin, dQmin: qMin,
        Q: cs.Q, supplied: cs.Esupplied, capState: cs.capState, floorAt, driveOff: cs.driveOffSteps,
        U: Us, Uout: Us[Us.length - 1], K: e1.K, steps: nst };
    };
    // 参照(容量無限・G=0)で 1 走行ぶんの供給量を測り、E₀ の 3 段をその倍数で宣言する
    const inf = run(1e12, 0);
    const sup = inf.supplied;
    const three = [0.1, 0.5, 2].map((f) => run(sup * f, 0));
    // **否定結果**: 同じ長い窓に節点間の重力を入れると縮約が壊れる(節点が互いに落ち込み、
    // 軟化長 ε の近傍で RK4 が追随できない)—— 重力込みの恒等は短い窓でだけ立つ
    const grav = run(sup * 2, S.params.G);
    return { T, tau, dt, nst, inf, sup, three, grav };
  });
  console.log('cap supplied(inf)', out.cap.sup.toExponential(5));
  for (const r of [out.cap.inf].concat(out.cap.three).concat([out.cap.grav])) {
    console.log(' G', r.G, 'E0', (r.E0 === null ? 'inf' : Number(r.E0).toExponential(3)), 'Eres', Number(r.Eres).toExponential(3),
      'EmeshMin', Number(r.EmeshMin).toExponential(3), 'Q', r.Q.toExponential(4), 'dQmin', r.dQmin.toExponential(2),
      'cap', r.capState, 'floorAt', r.floorAt, 'Uout', r.Uout.toFixed(6), 'rel', r.rel.toExponential(2));
  }
}

// ---------- ② (d) 粘性中継 対 弾性中継(E₀ 3 段)
if (want('relay')) {
  out.relay = await pg.evaluate(() => {
    const W = window.__w258b;
    const S = W.build('galaxyMeshSpiral', 3000);
    // バルク速度 V を足した診断コピー(第257便b と同じ作り —— 「宇宙に対する銀河の移動」)
    let M = 0, s = 0;
    for (let i = 0; i < S.n; i++) { const r = Math.hypot(S.x[i], S.y[i]);
      if (!(r > 5)) continue;
      const vp = (S.x[i] * S.vy[i] - S.y[i] * S.vx[i]) / r; M += S.m[i]; s += S.m[i] * Math.abs(vp); }
    const V = s / M;
    // **第257便b ③ と同じ縮約**(中心も源に入れて W・χ を作り、全粒子に同じバルク速度 V を足す)。
    // 閉鎖系側の重力は G=0 なので二重計上にはならない
    const L = [];
    for (let i = 0; i < S.n; i++) L.push({ m: S.m[i], x: S.x[i], y: S.y[i], vx: S.vx[i] + V, vy: S.vy[i] });
    const T = W.tRot(S, 140), tau = 0.2 * T, dt = tau / 40;
    const run = (kSc, E0, rot) => {
      const ch = HP.dfmChainMeshBuild(L, { rings: 5, kNeighbors: 1, mu: 1, tau, zeta: 1,
        tauDrag: tau, gammaBg: 1, bond: 'central', kScale: kSc, center: [0, 0],
        D0: S.params.D0, p: 2, eps: S.params.softening });
      // G=0(節点間の重力は長い窓で縮約を壊す —— cap の否定結果を参照)
      const cs = HP.dfmChainMeshClosed(ch, { Emesh0: E0, G: 0, centralMass: 0, eps: S.params.softening });
      const nst = Math.round(rot * T / dt);
      for (let k = 0; k < nst; k++) HP.dfmChainMeshClosedStep(cs, dt);
      const Us = []; for (let i = 0; i < ch.n; i++) Us.push(Math.hypot(ch.U[2 * i], ch.U[2 * i + 1]) / V);
      const mn = Math.min(...Us), mx = Math.max(...Us);
      return { kScale: kSc, E0, rot, U: Us, spread: mn / mx, Eres: cs.Eres,
        capState: cs.capState, Q: cs.Q, supplied: cs.Esupplied };
    };
    const ref = run(0, 1e12, 20);
    const sup = ref.supplied;
    const rows = [];
    for (const kSc of [0, 1]) for (const f of [1e12, 2, 0.5, 0.1])
      rows.push(run(kSc, f === 1e12 ? 1e12 : sup * f, 20));
    return { V, T, tau, dt, sup, rows };
  });
  for (const r of out.relay.rows) {
    console.log('relay kScale', r.kScale, 'E0', r.E0 === null ? 'inf' : Number(r.E0).toExponential(3),
      'U/V', r.U.map((z) => z.toFixed(4)).join('/'), 'min/max', r.spread.toFixed(5), 'cap', r.capState);
  }
}

out.pageErrors = pageErrors;
await browser.close();
fs.mkdirSync(path.dirname(OUT), { recursive: true });
fs.writeFileSync(OUT, JSON.stringify(out, null, 1));
console.log('wrote', OUT);
