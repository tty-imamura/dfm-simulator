// 第257便b W2「磁石連鎖の有限応答連鎖メッシュ —— 構成天体が場を外へ運ぶか」(第49報)。
//
// 原仮定者(第49報・原文は docs/PHYSICS.md 〔第257便b〕に引用):
//   「磁石をパチンコ玉に近付けると、複数のパチンコ玉を引きずる事が出来る。引きずられたパチンコ玉の
//    先端では、元々の磁石の磁界より遠くまで磁力が届いている。星団や銀河も同様に、中心天体だけで無く、
//    構成する天体も含めて空間メッシュを構成している」
//
// **測るのは診断量だけである**。連鎖メッシュは**新しいトイ仮説**であって、現行 D₀ の単位・意味から
// 自動導出されるものではない。**粒子の力へは 1 バイトも接続しない**(器の中の診断コピーだけ)。
// **観測回転曲線は 1 つも入力しない。**「外縁を予測した」「ダークマターを説明した」とは書かない。
//
// 測る量:
//   ① R_reach —— 「u が背景から w* 以上ずれる最外半径」を s=w*/V の 6 段で。
//        (i) SMBH 単体の χ(r)(現行 W の中心 1 点)/ (ii) 現行 disk/affine の u_n と χ(r) /
//        (iii) 連鎖メッシュ u_chain(r)(リング 3/5/8 × 応答時間 τ 3 段)。
//        **R_reach が (i) より外へ伸びたか**を数で書く(伸びても「外縁を予測した」とは書かない)。
//   ② 帳簿 —— E_m・Q・W_ext・残差(E_m の増分 + ΔQ − ΔW_ext)・P・L・容量の下限。
//   ③ 契約 —— 等反作用(駆動 OFF で P 保存)・L(linear は保存しない/central は保存する)の実測・
//        dt 3 段の収束次数・ρ(K)<1 の即時応答極限。
//   ④ 対照 —— bond:"linear"(ChatGPT §10 の式)対 bond:"central"(回転不変)。
//
// 診断コピー: 🎠 galaxyMeshSpiral の**中心 pinned を外し、全粒子に同じバルク速度 V を足した**宇宙
//   (第256便b の器と同じ作り)。背景は **bg:"static"(u_bg=0)**。
//
// 実行: node tests/exp-w257b-chainmesh.mjs [--reach] [--ledger] [--contract] [--static]
// 出力: tests/out/chainmesh-w257b.json(未コミット —— 数値は PHYSICS に全載)
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const TARGET = process.env.QA_TARGET || 'beta/index.html';
const INDEX = 'file://' + (path.isAbsolute(TARGET) ? TARGET : path.join(ROOT, TARGET));
const OUT = process.env.W257B_OUT || path.join(ROOT, 'tests', 'out', 'chainmesh-w257b.json');
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

const out = { target: TARGET, node: process.version, at: new Date().toISOString(), wave: '257b' };

await pg.evaluate(() => {
  const W = (window.__w257b = {});
  W.byId = (id) => HP.allPresets().find((p) => p.id === id);
  // 診断コピー: 中心 pinned を外し、全粒子へ同じバルク速度 V を足す(**エンジンには何も足さない**)
  W.build = (id, steps, V) => {
    const pd = JSON.parse(JSON.stringify(W.byId(id)));
    const v = HP.validatePreset(pd);
    if (!v.ok) throw new Error('invalid ' + id);
    const S = HP.sim; S.build(v.preset);
    for (let k = 0; k < (steps || 0); k++) S.step(0.016);
    if (V) for (let i = 0; i < S.n; i++) { S.vx[i] += V; if (S.pinned) S.pinned[i] = 0; }
    S._galSup = null;
    return S;
  };
  W.vRep = (S) => {
    let M = 0, s = 0;
    for (let i = 0; i < S.n; i++) {
      const r = Math.hypot(S.x[i], S.y[i]);
      if (!(r > 5)) continue;
      const vphi = (S.x[i] * S.vy[i] - S.y[i] * S.vx[i]) / r;
      M += S.m[i]; s += S.m[i] * Math.abs(vphi);
    }
    return M > 0 ? s / M : 0;
  };
  // 系の代表回転周期(半径 rRef の円周 / |v_φ|)—— 応答時間 τ の比を宣言するための基準
  W.tRot = (S, rRef) => {
    let M = 0, s = 0;
    for (let i = 0; i < S.n; i++) {
      const r = Math.hypot(S.x[i], S.y[i]);
      if (!(r > 0.75 * rRef && r < 1.25 * rRef)) continue;
      const vphi = (S.x[i] * S.vy[i] - S.y[i] * S.vx[i]) / r;
      M += S.m[i]; s += S.m[i] * Math.abs(vphi);
    }
    const vc = M > 0 ? s / M : 0;
    return vc > 0 ? 2 * Math.PI * rRef / vc : null;
  };
  // 「u が背景から w* 以上ずれる最外半径」。**細かい半径格子を走査して最後の越境点を返す**
  // (単調性を仮定しない)。u_bg=0 なので |u−u_bg|=|u|。
  W.reach = (fn, wStar, rMax) => {
    const N = 4000, hi = rMax || 2000;
    let last = null;
    for (let k = 1; k <= N; k++) {
      const r = hi * k / N;
      const u = fn(r);
      if (u === null) continue;
      if (u >= wStar) last = r;
    }
    return last;
  };
  // 連鎖メッシュを定常まで回す(駆動 ON)。返り値は最後の帳簿。
  W.relax = (ch, dt, steps) => {
    let last = null;
    for (let k = 0; k < steps; k++) last = HP.dfmChainMeshStep(ch, dt, {});
    return last;
  };
});

// ============================================================ ① R_reach((i)(ii)(iii) × s)
if (want('reach')) {
  out.reach = await pg.evaluate(() => {
    const W = window.__w257b;
    const S0 = W.build('galaxyMeshSpiral', 3000, 0);
    const vRep = W.vRep(S0);
    const V = vRep;                                   // 銀河の並進速度 = 円盤の代表回転速度(宣言)
    const S = W.build('galaxyMeshSpiral', 3000, V);
    // 中心天体(最大質量)を拾う
    let maxI = 0, Mtot = 0, rRim = 0;
    for (let i = 0; i < S.n; i++) { Mtot += S.m[i]; if (S.m[i] > S.m[maxI]) maxI = i;
      rRim = Math.max(rRim, Math.hypot(S.x[i], S.y[i])); }
    const mSMBH = S.m[maxI];
    const f0 = HP.dfmGalaxyMeshField(S, 1, 0, { need: 'u', bg: 'static' });
    const D0 = f0.D0, p = f0.p, eps = f0.eps;
    const tRot = W.tRot(S0, 140);
    // (i) SMBH 単体: 源は中心 1 体だけ(速度は V)。u=χ_SMBH·V
    const solo = [{ m: mSMBH, x: S.x[maxI], y: S.y[maxI], vx: V, vy: 0 }];
    const uSolo = (r) => { const f = HP.dfmGalaxyMeshField(solo, S.x[maxI] + r, S.y[maxI], { need: 'u', bg: 'static', D0, p, eps });
      return f ? Math.hypot(f.u[0], f.u[1]) : null; };
    // (ii) 現行 disk/affine(🎠 の宣言)
    const uNow = (r) => { const f = HP.dfmGalaxyMeshField(S, r, 0, { need: 'u', bg: 'static' });
      return f ? Math.hypot(f.u[0], f.u[1]) : null; };
    const sList = [0.03, 0.1, 0.3, 0.7, 0.9, 0.97];
    const res = { V, vRep, mSMBH, Mtot, rRim, D0, p, eps, tRot, n: S.n,
      decl: JSON.parse(JSON.stringify(S.overlays.galaxyField || null)), rows: [], chain: [] };
    for (const s of sList) {
      res.rows.push({ s, wStar: s * V,
        solo: W.reach(uSolo, s * V, 2000), now: W.reach(uNow, s * V, 2000) });
    }
    // 半径プロファイルも残す((i)(ii) の χ と |u|)
    res.profile = [];
    for (const r of [10, 20, 50, 100, 150, 200, 251, 300, 400]) {
      const a = HP.dfmGalaxyMeshField(solo, S.x[maxI] + r, S.y[maxI], { need: 'u', bg: 'static', D0, p, eps });
      const b = HP.dfmGalaxyMeshField(S, r, 0, { need: 'u', bg: 'static' });
      res.profile.push({ r, chiSolo: a.chi, uSolo: Math.hypot(a.u[0], a.u[1]),
        chiNow: b.chi, uNow: Math.hypot(b.u[0], b.u[1]), unNow: Math.hypot(b.un[0], b.un[1]),
        unValid: b.unValid, R_slip: b.R_slip, sUsed: b.sUsed });
    }
    // (iii) 連鎖メッシュ。**背景抵抗 γ_bg が無いと問いが立たない**(γ_bg=0 では鎖の有無に関わらず
    //   すべての節点が V へ行く = 何も抵抗していない)。同じ γ_bg のもとで
    //   **kNeighbors=0(鎖なし = 磁石だけ)と kNeighbors=1(鎖あり)** を比べるのが本便の測定である。
    //   定常状態は即時応答極限 dfmChainMeshStatic(ρ(K)<1 を確かめてから解く)で読み、
    //   代表 1 組だけ時間発展と突き合わせる。
    for (const rings of [3, 5, 8]) {
      for (const gBg of [0.1, 1, 10]) {
        for (const kN of [0, 1]) {
          const tau = 0.2 * tRot;
          const ch = HP.dfmChainMeshBuild(S, { rings, kNeighbors: kN, mu: 1, tau, zeta: 1,
            tauDrag: tau, gammaBg: gBg, bond: 'linear' });
          if (!ch) { res.chain.push({ rings, gBg, kN, err: 'build-null' }); continue; }
          const st = HP.dfmChainMeshStatic(ch);
          if (!st || !st.U) { res.chain.push({ rings, gBg, kN, rho: st ? st.rho : null,
            singular: true, reason: st ? st.reason : 'null' }); continue; }
          for (let i = 0; i < ch.n; i++) { ch.U[2 * i] = st.U[i][0]; ch.U[2 * i + 1] = st.U[i][1]; }
          const supR = ch.nodes[ch.n - 1].r;
          const uCh = (r) => { const f = HP.dfmChainMeshField(ch, r, 0, {});
            return f ? Math.hypot(f.u[0], f.u[1]) : null; };
          // **支持の外は外挿である**(半径カーネルは最外節点の U へ漸近するので、走査を
          // 1.05×supportR で打ち切る)。境界でまだ w* を超えていたら `atEdge` の印を立てる。
          const rEdge = 1.05 * supR;
          const rows = [];
          for (const s of sList) {
            const raw = W.reach(uCh, s * V, rEdge);
            const atEdge = raw !== null && raw >= rEdge * (1 - 1 / 4000);
            rows.push({ s, reach: raw, rEdge, atEdge });
          }
          const uOut = Math.hypot(st.U[ch.n - 1][0], st.U[ch.n - 1][1]) / V;
          const prof = [];
          for (const r of [10, 20, 50, 100, 150, 200, 251]) {
            const f = HP.dfmChainMeshField(ch, r, 0, {});
            prof.push({ r, u: f ? Math.hypot(f.u[0], f.u[1]) : null, nEff: f ? f.nEff : null,
              unValid: f ? f.unValid : null });
          }
          res.chain.push({ rings, gBg, kN, tau, rho: st.rho, supportR: supR,
            nodes: ch.nodes.map((nd) => ({ r: nd.r, mass: nd.mass, count: nd.count, chi: nd.chi,
              mu: nd.mu, a: nd.a, gBg: nd.gBg, Vx: nd.V[0], Vy: nd.V[1] })),
            U: st.U, UoverV: st.U.map((u) => Math.hypot(u[0], u[1]) / V), uOuterOverV: uOut, rows, prof });
        }
      }
    }
    // 代表 2 組: 即時応答極限と時間発展の突き合わせ(rings=5・γ_bg=1・鎖あり)。
    //   kScale=0(粘性だけの鎖)では静的解と一致するはず・kScale=1(弾性込み)では
    //   **長時間で剛体化へ向かう**はず —— どちらも実測して書く。
    res.dynVsStatic = [];
    for (const kScale of [0, 1]) {
      const tau = 0.2 * tRot;
      const ch = HP.dfmChainMeshBuild(S, { rings: 5, kNeighbors: 1, mu: 1, tau, zeta: 1,
        tauDrag: tau, gammaBg: 1, bond: 'linear', kScale });
      const st = HP.dfmChainMeshStatic(ch);
      const dt = 0.02 * tau;
      const marks = [1, 5, 20, 80];                     // 回転周期の倍数
      const series = [];
      let last = null, done = 0;
      for (const mk of marks) {
        const nStep = Math.round(mk * tRot / dt);
        for (let k = done; k < nStep; k++) last = HP.dfmChainMeshStep(ch, dt, {});
        done = nStep;
        series.push({ tOverTrot: mk, t: ch.t,
          UoverV: Array.from({ length: ch.n }, (_, i) => Math.hypot(ch.U[2 * i], ch.U[2 * i + 1]) / V),
          spread: (() => { let mn = Infinity, mx = 0;
            for (let i = 0; i < ch.n; i++) { const u = Math.hypot(ch.U[2 * i], ch.U[2 * i + 1]);
              mn = Math.min(mn, u); mx = Math.max(mx, u); } return mx > 0 ? mn / mx : null; })(),
          maxDevFromStatic: (() => { let d = 0;
            for (let i = 0; i < ch.n; i++) d = Math.max(d, Math.hypot(ch.U[2 * i] - st.U[i][0], ch.U[2 * i + 1] - st.U[i][1]));
            return d; })() });
      }
      res.dynVsStatic.push({ kScale, tau, dt, tEnd: ch.t, rho: st.rho, ledger: last,
        staticUoverV: st.U.map((u) => Math.hypot(u[0], u[1]) / V), series });
    }
    return res;
  });
  console.log('§REACH done');
}

// ============================================================ ② 帳簿(E_m・Q・W_ext・残差・容量)
if (want('ledger')) {
  out.ledger = await pg.evaluate(() => {
    const W = window.__w257b;
    const S0 = W.build('galaxyMeshSpiral', 3000, 0);
    const V = W.vRep(S0);
    const S = W.build('galaxyMeshSpiral', 3000, V);
    const tRot = W.tRot(S0, 140);
    const res = { V, tRot, runs: [] };
    const kinOf = (T) => { let k = 0; for (let i = 0; i < T.n; i++) k += 0.5 * T.m[i] * (T.vx[i] * T.vx[i] + T.vy[i] * T.vy[i]); return k; };
    const kin0 = kinOf(S);
    for (const cfg of [{ tag: 'linear/cap=inf', bond: 'linear', cap: Infinity },
      { tag: 'central/cap=inf', bond: 'central', cap: Infinity },
      { tag: 'linear/cap=10', bond: 'linear', cap: 10 }]) {
      const tau = 0.2 * tRot;
      const ch = HP.dfmChainMeshBuild(S, { rings: 5, kNeighbors: 1, mu: 1, tau, zeta: 1,
        tauDrag: tau, bond: cfg.bond, capacity: cfg.cap });
      const dt = 0.02 * tau;
      const e0 = HP.dfmChainMeshEnergy(ch);
      let maxRes = 0, minDQ = Infinity, last = null;
      for (let k = 0; k < 4000; k++) {
        last = HP.dfmChainMeshStep(ch, dt, {});
        maxRes = Math.max(maxRes, Math.abs(last.residual));
        minDQ = Math.min(minDQ, last.dQ);
      }
      res.runs.push({ tag: cfg.tag, bond: cfg.bond, cap: (cfg.cap === Infinity ? null : cfg.cap),
        tau, dt, steps: 4000, tEnd: ch.t,
        Em0: e0.Em, Em: last.Em, Ekin: last.Ekin, Epot: last.Epot, Q: last.Q, Qdrive: last.Qdrive,
        Wext: last.Wext, P: last.P, L: last.L, capLeft: last.capLeft, capState: last.capState,
        driveOn: last.driveOn,
        closure: (last.Em - e0.Em) + last.Q - last.Wext,      // **総和の閉じ**(0 が合格)
        maxStepResidual: maxRes, minDQ,
        particleKE: kin0, particleKEafter: kinOf(S),           // 粒子側は**触っていない**(差 0 が期待値)
      });
    }
    return res;
  });
  console.log('§LEDGER done');
}

// ============================================================ ③ 契約(等反作用・L・dt 収束・静的極限)
if (want('contract')) {
  out.contract = await pg.evaluate(() => {
    const W = window.__w257b;
    const S0 = W.build('galaxyMeshSpiral', 3000, 0);
    const V = W.vRep(S0);
    const S = W.build('galaxyMeshSpiral', 3000, V);
    const tRot = W.tRot(S0, 140);
    const tau = 0.2 * tRot;
    const res = { tau, tRot };
    // --- 等反作用(駆動 OFF・初期変位を与えて自由振動)
    const freeRun = (bond) => {
      const ch = HP.dfmChainMeshBuild(S, { rings: 5, kNeighbors: 2, mu: 1, tau, zeta: 0.3, bond });
      for (let i = 0; i < ch.n; i++) { ch.xi[2 * i] = 0.7 * (i + 1); ch.xi[2 * i + 1] = -0.4 * (i - 2);
        ch.U[2 * i] = 0.03 * (i - 1); ch.U[2 * i + 1] = 0.05 * (2 - i); }
      const e0 = HP.dfmChainMeshEnergy(ch);
      const dt = 0.01 * tau;
      let last = null, maxRes = 0, minDQ = Infinity;
      for (let k = 0; k < 3000; k++) { last = HP.dfmChainMeshStep(ch, dt, { drive: false });
        maxRes = Math.max(maxRes, Math.abs(last.residual)); minDQ = Math.min(minDQ, last.dQ); }
      const e1 = HP.dfmChainMeshEnergy(ch);
      const pScale = Math.hypot(e0.P[0], e0.P[1]) || 1;
      const lScale = Math.abs(e0.L) || 1;
      return { bond, P0: e0.P, P1: e1.P, dPrel: Math.hypot(e1.P[0] - e0.P[0], e1.P[1] - e0.P[1]) / pScale,
        L0: e0.L, L1: e1.L, dLrel: Math.abs(e1.L - e0.L) / lScale,
        Em0: e0.Em, Em1: e1.Em, Q: ch.Q, Wext: ch.Wext,
        closure: (e1.Em - e0.Em) + ch.Q - ch.Wext,
        closureRel: Math.abs((e1.Em - e0.Em) + ch.Q - ch.Wext) / (Math.abs(e0.Em) || 1),
        maxStepResidual: maxRes, minDQ, t: ch.t };
    };
    res.free = [freeRun('linear'), freeRun('central')];
    // --- dt 3 段の収束(同じ終端時刻を 3 つの刻みで踏み、h/2 ごとの差の比を見る)
    const endState = (h, nStep, bond) => {
      const ch = HP.dfmChainMeshBuild(S, { rings: 5, kNeighbors: 1, mu: 1, tau, zeta: 1, tauDrag: tau, bond });
      for (let k = 0; k < nStep; k++) HP.dfmChainMeshStep(ch, h, {});
      return { xi: Array.from(ch.xi), U: Array.from(ch.U), Q: ch.Q, Wext: ch.Wext, t: ch.t };
    };
    const diff = (a, b) => { let s = 0; for (let i = 0; i < a.xi.length; i++) s = Math.max(s, Math.abs(a.xi[i] - b.xi[i]), Math.abs(a.U[i] - b.U[i])); return s; };
    res.conv = [];
    for (const bond of ['linear', 'central']) {
      const h0 = 0.02 * tau, N0 = 500;
      const A = endState(h0, N0, bond), B = endState(h0 / 2, N0 * 2, bond), C = endState(h0 / 4, N0 * 4, bond);
      const d1 = diff(A, B), d2 = diff(B, C);
      res.conv.push({ bond, h: h0, tEnd: A.t, d1, d2, ratio: d2 > 0 ? d1 / d2 : null,
        order: (d1 > 0 && d2 > 0) ? Math.log2(d1 / d2) : null });
    }
    // --- 即時応答極限 ρ(K)
    const chA = HP.dfmChainMeshBuild(S, { rings: 5, kNeighbors: 1, mu: 1, tau, zeta: 1, tauDrag: tau });
    const stA = HP.dfmChainMeshStatic(chA);
    const chB = HP.dfmChainMeshBuild(S, { rings: 5, kNeighbors: 1, mu: 1, tau, zeta: 1, tauDrag: tau, D0: Infinity });
    const stB = HP.dfmChainMeshStatic(chB);
    // 定常まで回した時間発展と静的解の突き合わせ
    const chC = HP.dfmChainMeshBuild(S, { rings: 5, kNeighbors: 1, mu: 1, tau, zeta: 1, tauDrag: tau });
    for (let k = 0; k < 20000; k++) HP.dfmChainMeshStep(chC, 0.02 * tau, {});
    const stC = HP.dfmChainMeshStatic(chC);
    let dyn = [];
    if (stC && stC.U) for (let i = 0; i < chC.n; i++)
      dyn.push({ i, r: chC.nodes[i].r, Udyn: [chC.U[2 * i], chC.U[2 * i + 1]], Ustat: stC.U[i],
        d: Math.hypot(chC.U[2 * i] - stC.U[i][0], chC.U[2 * i + 1] - stC.U[i][1]) });
    res.staticLimit = { rhoA: stA ? stA.rho : null, singA: stA ? stA.singular : null,
      rhoB: stB ? stB.rho : null, singB: stB ? stB.singular : null, reasonB: stB ? stB.reason : null,
      chiB: chB.nodes.map((nd) => nd.chi), dyn, tEnd: chC.t };
    // --- リング数で発散しないか
    res.rings = [];
    for (const rings of [1, 2, 3, 4, 5, 6, 7, 8]) {
      const ch = HP.dfmChainMeshBuild(S, { rings, kNeighbors: 1, mu: 1, tau, zeta: 1, tauDrag: tau });
      if (!ch) { res.rings.push({ rings, err: 'null' }); continue; }
      const dt = 0.02 * tau;
      let last = null;
      for (let k = 0; k < 2000; k++) last = HP.dfmChainMeshStep(ch, dt, {});
      let uMax = 0;
      for (let i = 0; i < ch.n; i++) uMax = Math.max(uMax, Math.hypot(ch.U[2 * i], ch.U[2 * i + 1]));
      res.rings.push({ rings, nodes: ch.n, uMax, Em: last.Em, Q: last.Q, Wext: last.Wext,
        closure: last.residual, finite: Number.isFinite(uMax) });
    }
    // --- 門
    const chG = HP.dfmChainMeshBuild(S, { rings: 5 });
    res.gates = {
      negDt: HP.dfmChainMeshStep(chG, -0.1, {}) === null,
      nanDt: HP.dfmChainMeshStep(chG, NaN, {}) === null,
      zeroDt: (() => { const r = HP.dfmChainMeshStep(chG, 0, {}); return !!r && r.dQ === 0; })(),
      badRings: HP.dfmChainMeshBuild(S, { rings: 9 }) === null,
      zeroRings: HP.dfmChainMeshBuild(S, { rings: 0 }) === null,
      badTau: HP.dfmChainMeshBuild(S, { rings: 3, tau: 0 }) === null,
      badMu: HP.dfmChainMeshBuild(S, { rings: 3, mu: -1 }) === null,
      badBond: HP.dfmChainMeshBuild(S, { rings: 3, bond: 'spring' }) === null,
      noSrc: HP.dfmChainMeshBuild([], {}) === null,
      badField: HP.dfmChainMeshField(chG, NaN, 0, {}) === null,
    };
    return res;
  });
  console.log('§CONTRACT done');
}

// ============================================================ ④ s の宣言(R_slip)と slipThreshold
if (want('static')) {
  out.slip = await pg.evaluate(() => {
    const W = window.__w257b;
    const S = W.build('galaxyMeshSpiral', 3000, 0);
    const f = HP.dfmGalaxyMeshField(S, 100, 0, { need: 'u', bg: 'static' });
    const rows = [];
    for (const s of [0, 0.25, 0.5, 0.7, 0.9, 0.95, 0.97, 0.9728]) {
      const g = HP.dfmGalaxyMeshField(S, 100, 0, { need: 'u', bg: 'static', slipThreshold: s });
      const pure = HP.dfmSlipRadius({ A: f.slipA, D0: f.D0, p: f.p, s });
      const chiAt = (g.R_slip !== null)
        ? HP.dfmGalaxyMeshField(S, g.R_slip, 0, { need: 'u', bg: 'static' }).chi : null;
      rows.push({ s, R_slip: g.R_slip, sUsed: g.sUsed, pureR: pure ? pure.R : null,
        diff: (pure && g.R_slip !== null) ? Math.abs(pure.R - g.R_slip) : null,
        chiAtR: chiAt, sMeasured: chiAt !== null ? 1 - chiAt : null });
    }
    let M = 0, rRim = 0;
    for (let i = 0; i < S.n; i++) { M += S.m[i]; rRim = Math.max(rRim, Math.hypot(S.x[i], S.y[i])); }
    return { A: f.slipA, mTotal: M, AoverM: f.slipA / M, D0: f.D0, p: f.p, rRim,
      defaultS: f.sUsed, defaultR: f.R_slip, rows,
      gates: { sOne: HP.dfmSlipRadius({ A: M, D0: 1.5, p: 2, s: 1 }) === null,
        sOver: HP.dfmSlipRadius({ A: M, D0: 1.5, p: 2, s: 1.2 }) === null,
        sNeg: HP.dfmSlipRadius({ A: M, D0: 1.5, p: 2, s: -0.1 }) === null,
        d0zero: HP.dfmSlipRadius({ A: M, D0: 0, p: 2, s: 0.9 }) === null,
        aZero: HP.dfmSlipRadius({ A: 0, D0: 1.5, p: 2, s: 0.9 }) === null,
        pZero: HP.dfmSlipRadius({ A: M, D0: 1.5, p: 0, s: 0.9 }) === null,
        nan: HP.dfmSlipRadius({ A: NaN, D0: 1.5, p: 2, s: 0.9 }) === null,
        noOpts: HP.dfmSlipRadius() === null } };
  });
  console.log('§SLIP done');
}

// ============================================================ ⑤ BH 以降のトイ帳簿(dfmToyLedger)
//   🎻(BH 連星)・🍇(星団)・🎠(銀河)を 600 步(dt=0.016)回し、
//   **E_tot=K+U+E_shell+E_core+E_mesh+Q+E_escaped の残差**と**未定義の項**を表にする。
//   容量 caps を宣言して、下限に達した項に印が立つことも確かめる。
if (want('toy')) {
  out.toy = await pg.evaluate(() => {
    const W = window.__w257b;
    const rows = [];
    for (const id of ['gw150914DFM', 'tuc47', 'galaxyMeshSpiral', 'gas', 'pressure']) {
      let S;
      try { S = W.build(id, 0, 0); } catch (e) { rows.push({ id, err: String(e) }); continue; }
      const pd = HP.allPresets().find((p) => p.id === id);
      if (!pd) { rows.push({ id, err: 'no-preset' }); continue; }
      const led0 = HP.dfmToyLedger(S, {});
      if (!led0) { rows.push({ id, err: 'ledger-null' }); continue; }
      for (let k = 0; k < 600; k++) S.step(0.016);
      const caps = { Ecore: { min: 0 }, Emesh: { min: 0 }, Eshell: { min: 0 }, Q: { min: 0 } };
      const led1 = HP.dfmToyLedger(S, { ref: led0, caps });
      rows.push({ id, emoji: pd.emoji, n: S.n, t: S.t, nan: S.hasNaN(),
        before: { K: led0.K, U: led0.U, Eshell: led0.Eshell, Ecore: led0.Ecore, Emesh: led0.Emesh,
          Q: led0.Q, Eescaped: led0.Eescaped, Etot: led0.Etot, Wext: led0.Wext },
        after: { K: led1.K, U: led1.U, Eshell: led1.Eshell, Ecore: led1.Ecore, Emesh: led1.Emesh,
          Q: led1.Q, Eescaped: led1.Eescaped, Etot: led1.Etot, Wext: led1.Wext },
        dEtot: led1.dEtot, dWext: led1.dWext, residual: led1.residual,
        relResidual: (Math.abs(led1.Etot) > 0) ? Math.abs(led1.residual) / Math.abs(led1.Etot) : null,
        undefinedTerms: led1.undefinedTerms, capState: led1.capState, capFloorCount: led1.capFloorCount,
        obs: led1.obs, hidden: led1.parts.hidden, wext: led1.parts.wext,
        notes: led1.notes });
    }
    return { rows, steps: 600, dt: 0.016 };
  });
  console.log('§TOY done');
}

out.pageErrors = pageErrors;
fs.mkdirSync(path.dirname(OUT), { recursive: true });
fs.writeFileSync(OUT, JSON.stringify(out, null, 1));
console.log('written', OUT, 'pageErrors', pageErrors.length);
await browser.close();
