// 第270便d(第60報 W4・AD1・統括の読み (B)): **層の回転源 Q を J と独立の状態にする**(法則 (a))の実測器。
//
// ■ 何を測るのか
//   〔第268便b〕は「融合の ζ 合成則は一般に回転源を保存しない」ことを 2025 組で数えた
//   (源は Q′=J′/ζ′ の形でしか表せず、ζ′>0 が sign(Q′)=sign(J′) を強いるので、
//    源の符号が J の和と違う組は**どんな有限の正の ζ′ でも表せない** = 表現の問題)。
//   本便は状態の取り方を変える: **(J, Q) を別々に保存し、合成は J′=ΣJ・Q′=ΣQ**。
//   初期化は **Q=J/ζ**(ζJ ではない —— `dfmCoreQ` が Q=J/ζ である)。
//   ζ_eff=J′/Q′ は **J′≠0 かつ同符号のときだけの診断値**で、状態の正本にしない。
//
// ■ 出す表
//   §1 反例の保存      … (10,1)+(−10,2) で J′=0・**Q′=5**(旧則の Q′=J′/ζ′=0 を並べる)
//   §2 総当たり 2025 組 … Q′ の保存 件数 /(旧則の破れ 件数の対照)・rule="role"/"add" の両方
//   §3 読戻し 3 経路   … 保存→復元(ckSnapOne/ckRestoreOne)・複製(cloneSimStateNow)・往復(bodyLayersOf→_setBodyLayers)
//   §4 6 経路の整合    … build / 編集 UI / 融合 / 保存復元 / 複製 / 粒子詰め替え(分割)で Q が落ちない
//   §5 更新則の表      … dfmLayerQUpdate の 7 モード(derive/declared/zetaConst/zetaDeclared/qConst/sum/carry)
//   §6 内蔵の洗い出し  … **融合が起きる内蔵プリセット**と、そのうち層を宣言している本(= 署名の例外候補)
//
// ■ この器がしないこと
//   ・**時間発展則を決めたとは書かない**。Q がトルク・減衰でどう動くかは `dfmLayerQUpdate` に置いた
//     **追加仮定**であり、実系検証まで暫定である(Negative Claim 42 は消さずに追記した)。
//   ・力へは接続しない(層の Q は回転場の源の**数値**であって、新しい力を足していない)。
//
// 使い方: PLAYWRIGHT_CORE_DIR=/opt/node22/lib/node_modules/playwright \
//         node tests/exp-w270d-zetaq.mjs [beta/index.html]
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const TARGET = process.argv[2] || 'beta/index.html';
const OUT = process.env.W270D_OUT || path.join(ROOT, 'tests', 'out', 'zetaq-w270d.json');
const PW_DIR = process.env.PLAYWRIGHT_CORE_DIR || '/home/user/dfm-simulator';
const req = createRequire(path.join(PW_DIR, 'noop.js'));
const EXE = process.env.CHROMIUM_PATH || '/opt/pw-browsers/chromium-1194/chrome-linux/chrome';

let browser;
try { browser = await req('playwright').chromium.launch(); }
catch { browser = await req('playwright-core').chromium.launch({ executablePath: EXE }); }
const page = await browser.newPage();
const pageErrors = [];
page.on('pageerror', (e) => pageErrors.push(String(e.message || e)));
await page.goto('file://' + path.join(ROOT, TARGET), { waitUntil: 'load' });
await page.waitForFunction(() => window.HP && HP.sim && HP.currentPreset());

const R = await page.evaluate(() => {
  const O = {};
  const zOf = (L) => { const z = Number(L.inertiaScale); return (Number.isFinite(z) && z > 0) ? z : 1; };
  const qOf = (L) => { const q = Number(L.Q); return Number.isFinite(q) ? q : (Number(L.J) || 0) / zOf(L); };
  const srcOld = (arr) => arr.reduce((a, L) => a + (Number(L.J) || 0) / zOf(L), 0);   // 旧則の読み方 J′/ζ′
  const srcNew = (arr) => arr.reduce((a, L) => a + qOf(L), 0);                         // 新則の読み方 ΣQ
  const sumJ = (arr) => arr.reduce((a, L) => a + (Number(L.J) || 0), 0);

  // ------------------------------------------------------------------ §1 反例の保存
  const CASES = [
    [10, 1, -10, 2], [10, 1, -15, 2], [10, 2, 20, 2], [10, 2, 20, 4],
    [10, 1, -10, 1], [10, 1, -5, 2], [10, 1, -20, 2], [10, 4, -10, 1],
  ];
  O.pure = CASES.map(([ja, za, jb, zb]) => {
    const A = [{ role: 'core', m: 10, r: 1, J: ja, inertiaScale: za }];
    const B = [{ role: 'core', m: 10, r: 1, J: jb, inertiaScale: zb }];
    const out = HP.dfmLayerMerge(A, B, 'role');
    const before = srcNew(A) + srcNew(B);
    return { ja, za, jb, zb, before, Jafter: sumJ(out),
      zetaAfter: out[0] ? out[0].inertiaScale : null,
      representable: out[0] ? out[0].zetaRepresentable : null,
      qNew: srcNew(out), qOld: srcOld(out),
      preserved: Object.is(srcNew(out), before), oldPreserved: Object.is(srcOld(out), before) };
  });

  // ------------------------------------------------------------------ §2 総当たり 2025 組
  const JS = [-20, -15, -10, -5, 0, 5, 10, 15, 20], ZS = [0.25, 0.5, 1, 2, 4];
  const scan = (rule) => {
    let n = 0, okNew = 0, okOld = 0, flip = 0, vanish = 0, born = 0;
    let worstAbs = 0, worstAt = null, unrep = 0;
    for (const ja of JS) for (const za of ZS) for (const jb of JS) for (const zb of ZS) {
      const A = [{ role: 'core', m: 10, r: 1, J: ja, inertiaScale: za }];
      const B = [{ role: (rule === 'add') ? 'shell' : 'core', m: 10, r: 1, J: jb, inertiaScale: zb }];
      const out = HP.dfmLayerMerge(A, B, rule);
      const before = srcNew(A) + srcNew(B), aNew = srcNew(out), aOld = srcOld(out);
      n++;
      if (Object.is(aNew, before)) okNew++;
      else { const d = Math.abs(aNew - before);
        if (d > worstAbs) { worstAbs = d; worstAt = { ja, za, jb, zb, before, after: aNew }; } }
      if (Object.is(aOld, before)) okOld++;
      else {
        if (before !== 0 && aOld !== 0 && (before > 0) !== (aOld > 0)) flip++;
        else if (before !== 0 && aOld === 0) vanish++;
        else if (before === 0 && aOld !== 0) born++;
      }
      if (out[0] && out[0].zetaRepresentable === false) unrep++;
    }
    return { rule, n, okNew, brokenNew: n - okNew, okOld, brokenOld: n - okOld,
      oldFlip: flip, oldVanish: vanish, oldBorn: born, unrepresentable: unrep,
      worstAbs, worstAt };
  };
  O.scan = [scan('role'), scan('add')];

  // ------------------------------------------------------------------ 共通のレシピ(逆回転の 2 体)
  const LA = [{ role: 'core', m: 90, r: 2, J: 10, inertiaScale: 1 }, { role: 'shell', m: 10, r: 10, J: 0 }];
  const LB = [{ role: 'core', m: 45, r: 1.5, J: -10, inertiaScale: 2 }, { role: 'shell', m: 5, r: 8, J: 0 }];
  const mkPr = () => ({
    id: 'w270dFuse', name: 'w270dFuse', emoji: '🧪', description: '独立 Q の器。',
    camera: { scale: 300 }, world: { boundary: 'none', size: 0 }, seed: 1,
    physics: { G: 1, D0: 0, kFrame: 0, q: 2, kRep: 0, muF: 0, gammaN: 0, kappaS: 0, kappaT: 1 / 60,
      cLight: 30, contactK: 0, contactCap: 0, bM: 1, etaRad: 0, pRad: 4, gravityX: 0, gravityY: 0,
      geoPN: 0, lambdaPN: 1, pnAlpha: 1.5, radiusScale: 1, softening: 0.5, timeScale: 1, spinSpin: 1e6 },
    bodies: [
      { type: 'single', m: 100, radius: 3, x: -6, y: 0, vx: 0.5, vy: 0, spin: 0, pinned: false,
        layers: JSON.parse(JSON.stringify(LA)) },
      { type: 'single', m: 50, radius: 3, x: 6, y: 0, vx: -0.5, vy: 0.2, spin: 0, pinned: false,
        layers: JSON.parse(JSON.stringify(LB)) }],
    fusion: { dFrac: 0.7 }, thermal: 'tint', overlays: {} });

  // ------------------------------------------------------------------ §3+§4 エンジンの 6 経路
  {
    const v = HP.validatePreset(mkPr());
    const S = HP.sim; S.build(v.preset);
    const path1 = { q0: HP.dfmLayerDipoleMoment(0, S), q1: HP.dfmLayerDipoleMoment(1, S),
      layQ00: HP.dfmLayerQ(0, 0, S), layQ10: HP.dfmLayerQ(1, 0, S),
      // build の導出: Q=J/ζ(ζJ=10·1 / −10·2=−20 ではない)
      expect00: 10 / 1, expect10: -10 / 2 };
    let fusedAt = -1;
    for (let k = 0; k < 600 && fusedAt < 0; k++) { S.step(0.016); if (S.n === 1) fusedAt = k + 1; }
    for (let k = fusedAt >= 0 ? fusedAt : 600; k < 600; k++) S.step(0.016);
    const fused = { n: S.n, fusedAt, q: HP.dfmLayerDipoleMoment(0, S), spinQ: HP.dfmSpinDipoleMoment(0, S),
      layers: (S.bodyLayersOf(0) || []).map((L) => ({ role: L.role, m: L.m, r: L.r, J: L.J, Q: L.Q,
        zeta: L.inertiaScale })),
      nan: [S.x[0], S.y[0], S.vx[0], S.vy[0]].filter((z) => !Number.isFinite(z)).length };
    // 保存 → 復元
    const snap = HP.ckSnapOne(S);
    const qBefore = HP.dfmLayerDipoleMoment(0, S);
    for (let k = 0; k < 30; k++) S.step(0.016);
    HP.ckRestoreOne(S, snap);
    const restored = { q: HP.dfmLayerDipoleMoment(0, S), layQ: HP.dfmLayerQ(0, 0, S),
      same: Object.is(HP.dfmLayerDipoleMoment(0, S), qBefore) };
    // 複製
    const clone = HP.cloneSimStateNow();
    const cloned = { q: HP.dfmLayerDipoleMoment(0, clone), layQ: HP.dfmLayerQ(0, 0, clone),
      same: Object.is(HP.dfmLayerDipoleMoment(0, clone), qBefore) };
    // 往復(bodyLayersOf → _setBodyLayers)
    const rt0 = S.bodyLayersOf(0);
    S._setBodyLayers(0, rt0);
    const rt = { q: HP.dfmLayerDipoleMoment(0, S), keys: rt0.map((L) => Object.keys(L).join('+')),
      same: Object.is(HP.dfmLayerDipoleMoment(0, S), qBefore) };
    O.engine = { build: path1, fused, restored, cloned, roundTrip: rt, qBefore };
  }
  // 編集 UI の 3 経路(J だけ / ζ だけ / Q 明示)
  {
    const v = HP.validatePreset(mkPr()); const S = HP.sim; S.build(v.preset);
    const rows = [];
    const read = (tag) => { const L = S.bodyLayersOf(0)[0];
      rows.push({ tag, J: L.J, Q: HP.dfmLayerQ(0, 0, S), zeta: L.inertiaScale === undefined ? 1 : L.inertiaScale,
        qKey: Object.prototype.hasOwnProperty.call(L, 'Q'), src: HP.dfmLayerDipoleMoment(0, S) }); };
    read('build');
    S.applyLayerEdit(0, 0, { J: 20 }); read('J 20(ζ 一定)');
    S.applyLayerEdit(0, 0, { inertiaScale: 4 }); read('ζ 4(宣言し直す)');
    S.applyLayerEdit(0, 0, { Q: 7 }); read('Q 7(明示)');
    S.applyLayerEdit(0, 0, { J: 40 }); read('J 40(独立 Q から ζ 一定)');
    S.applyLayerEdit(0, 0, { r: 2.5 }); read('r だけ(Q 不変)');
    O.edit = rows;
  }
  // 分割(放出片は層を持たない)と粒子詰め替え
  {
    const v = HP.validatePreset(mkPr()); const S = HP.sim; S.build(v.preset);
    const q0 = HP.dfmLayerDipoleMoment(0, S);
    // 粒子詰め替え: 融合させてから _compact が走った後の Q
    let fusedAt = -1;
    for (let k = 0; k < 600; k++) { S.step(0.016); if (S.n === 1 && fusedAt < 0) fusedAt = k + 1; }
    O.compact = { fusedAt, n: S.n, q: HP.dfmLayerDipoleMoment(0, S), layN: S.layN[0],
      layQ: [HP.dfmLayerQ(0, 0, S), HP.dfmLayerQ(0, 1, S)], q0 };
  }

  // ------------------------------------------------------------------ §5 更新則の表
  {
    const U = HP.dfmLayerQUpdate;
    O.rules = [
      { path: '読み込み(宣言に Q が無い)', mode: 'derive', r: U({ J1: 10, zeta: 2, mode: 'derive' }) },
      { path: 'Q を明示した宣言・編集', mode: 'declared', r: U({ J1: 10, Q: 0, mode: 'declared' }) },
      { path: '外部トルク・減衰・質量移動・J だけの編集', mode: 'zetaConst',
        r: U({ J0: 10, Q0: 5, J1: 20, mode: 'zetaConst' }) },
      { path: 'J₀=0 の ζ 一定(ζ が読めない)', mode: 'zetaConst',
        r: U({ J0: 0, Q0: 5, J1: 3, mode: 'zetaConst' }) },
      { path: 'ζ を宣言し直す編集', mode: 'zetaDeclared', r: U({ J1: 10, zeta: 4, mode: 'zetaDeclared' }) },
      { path: 'Q を保つ明示 variant', mode: 'qConst', r: U({ J0: 10, Q0: 5, J1: 20, mode: 'qConst' }) },
      { path: '合体・同半径圧縮・層数上限の畳み込み', mode: 'sum',
        r: U({ J0: 10, Q0: 10, J1: -10, Q1: -5, mode: 'sum' }) },
      { path: '保存/復元/複製/詰め替え/分割', mode: 'carry', r: U({ J0: 10, Q0: 5, J1: 10, mode: 'carry' }) },
    ];
    O.zetaEff = [[10, 5], [0, 5], [10, 0], [10, -5], [0, 0]].map(([j, q]) => ({ J: j, Q: q, ...HP.dfmLayerZetaEff(j, q) }));
  }

  // ------------------------------------------------------------------ §6 内蔵の洗い出し(融合が起きる本)
  {
    const rows = [];
    for (const p of HP.allPresets()) {
      HP.loadPreset(p.id, false);
      const S = HP.sim;
      const n0 = S.n;
      let layDecl = 0, layJDecl = 0;
      for (let i = 0; i < S.n; i++) if (S.layN && S.layN[i] > 0) { layDecl++;
        const b0 = i * HP.BODY_LAYER_MAX;
        for (let q = 0; q < S.layN[i]; q++) if (S.layJ[b0 + q] !== 0 || (S.layJD && S.layJD[b0 + q] !== 0)) layJDecl++; }
      const res0 = S.layMassRes || 0;
      for (let k = 0; k < 600; k++) S.step(0.016);
      let layAfter = 0;
      for (let i = 0; i < S.n; i++) if (S.layN && S.layN[i] > 0) layAfter++;
      const fused = (S.n < n0);
      if (fused || layDecl || layAfter) rows.push({ id: p.id, emoji: p.emoji, n0, n: S.n, fused,
        layersDeclared: layDecl, layersWithJ: layJDecl, layersAfter: layAfter,
        layMassRes: (S.layMassRes || 0) - res0 });
    }
    O.builtins = rows;
    O.builtinCount = HP.allPresets().length;
    O.signatureExceptions = rows.filter((r) => r.fused && r.layersDeclared > 0).map((r) => r.id);
  }
  return O;
});

await browser.close();

// ---------------------------------------------------------------- 突き合わせ
const bad = [];
const c = (i) => R.pure[i];
if (!(c(0).before === 5 && c(0).Jafter === 0 && c(0).qNew === 5)) bad.push('§1 (10,1)+(−10,2) が J′=0・Q′=5 でない');
if (!(c(0).qOld === 0)) bad.push('§1 旧則の読み方(J′/ζ′)が 0 でない(対照が壊れている)');
if (!(c(1).before === 2.5 && c(1).qNew === 2.5)) bad.push('§1 (10,1)+(−15,2) の Q′ が 2.5 でない');
if (!(c(2).preserved && c(3).preserved)) bad.push('§1 同方向の 2 例が保存していない');
for (const s of R.scan) {
  if (s.n !== 2025) bad.push(`§2 rule=${s.rule} の組が 2025 でない(${s.n})`);
  if (s.okNew !== 2025) bad.push(`§2 rule=${s.rule} で Q′ の保存が 2025/2025 でない(${s.okNew})`);
  if (!(s.brokenOld > 0)) bad.push(`§2 rule=${s.rule} で旧則の破れが 0 件(対照が消えた)`);
}
if (!(R.engine.build.layQ00 === R.engine.build.expect00
  && R.engine.build.layQ10 === R.engine.build.expect10)) bad.push('§4 build の Q が J/ζ になっていない');
if (!(R.engine.fused.n === 1 && R.engine.fused.fusedAt > 0)) bad.push('§4 エンジンで融合していない');
if (!(R.engine.fused.q === 5)) bad.push(`§4 融合後の源が 5 でない(${R.engine.fused.q})`);
if (R.engine.fused.nan) bad.push('§4 NaN が出ている');
if (!R.engine.restored.same) bad.push('§3 保存→復元で Q が落ちた');
if (!R.engine.cloned.same) bad.push('§3 複製で Q が落ちた');
if (!R.engine.roundTrip.same) bad.push('§3 往復(bodyLayersOf→_setBodyLayers)で Q が落ちた');
if (!(R.compact.q === 5)) bad.push('§4 粒子詰め替え後の源が 5 でない');
if (pageErrors.length) bad.push('pageerror: ' + pageErrors.slice(0, 2).join(' / '));

const out = { when: new Date().toISOString(), wave: '第270便d(第60報 W4・AD1・統括の読み (B))',
  target: TARGET, ...R, violations: bad };
fs.mkdirSync(path.dirname(OUT), { recursive: true });
fs.writeFileSync(OUT, JSON.stringify(out, null, 1));

console.log('[w270d/AD1] 層の回転源 Q を J と独立の状態にする(法則 (a))—— 初期化は **Q=J/ζ**');
console.log('§1 反例の保存(純関数 dfmLayerMerge・rule="role")');
console.log('   (J_a,ζ_a)+(J_b,ζ_b) | 融合前 ΣQ | J′ | ζ_eff | 表せる | **新 Q′=ΣQ** | 旧 Q′=J′/ζ′');
for (const p of R.pure) {
  console.log('   (' + p.ja + ',' + p.za + ')+(' + p.jb + ',' + p.zb + ')'.padEnd(3)
    + ' | ' + String(p.before).padStart(7) + ' | ' + String(p.Jafter).padStart(5)
    + ' | ' + String(p.zetaAfter).padStart(6) + ' | ' + String(p.representable).padStart(5)
    + ' | ' + String(p.qNew).padStart(7) + ' | ' + String(p.qOld).padStart(7)
    + (p.preserved ? '  保存' : '  **壊れる**'));
}
console.log('§2 総当たり(J 9 値 × ζ 5 値 の 2 層・全組)');
for (const s of R.scan) {
  console.log('   rule=' + s.rule.padEnd(5) + ' 組 ' + s.n + ' / **新則 Q′ の保存 ' + s.okNew + '**(破れ ' + s.brokenNew
    + ')/ 旧則 J′/ζ′ の保存 ' + s.okOld + '(破れ ' + s.brokenOld + ': 符号反転 ' + s.oldFlip
    + '・消える ' + s.oldVanish + '・湧く ' + s.oldBorn + ')/ ζ_eff が表せない ' + s.unrepresentable + ' 組');
}
console.log('§3 読戻し: 保存→復元 ' + R.engine.restored.same + '(Q=' + R.engine.restored.layQ + ')'
  + ' / 複製 ' + R.engine.cloned.same + '(Q=' + R.engine.cloned.layQ + ')'
  + ' / 往復 ' + R.engine.roundTrip.same + '(鍵 ' + JSON.stringify(R.engine.roundTrip.keys) + ')');
console.log('§4 6 経路: build Q=' + R.engine.build.layQ00 + '/' + R.engine.build.layQ10
  + '(期待 ' + R.engine.build.expect00 + '/' + R.engine.build.expect10 + ')'
  + ' / 融合 ' + R.engine.fused.fusedAt + ' 步目で源 ' + R.engine.fused.q
  + ' / 詰め替え後 ' + R.compact.q + ' / 層 ' + JSON.stringify(R.engine.fused.layers));
console.log('§5 編集 UI の更新則');
for (const e of R.edit) console.log('   ' + e.tag.padEnd(24) + ' J=' + e.J + ' Q=' + e.Q + ' ζ=' + e.zeta
  + ' 正準形に Q 鍵=' + e.qKey + ' 源=' + e.src);
for (const r of R.rules) console.log('   [' + r.mode + '] ' + r.path + ' → J=' + r.r.J + ' Q=' + r.r.Q
  + ' ζ_eff=' + r.r.zetaEff + ' 表せる=' + r.r.representable + (r.r.reason ? ' 理由=' + r.r.reason : ''));
console.log('§6 内蔵 ' + R.builtinCount + ' 本のうち 600 步で融合する/層を宣言する本');
for (const b of R.builtins) console.log('   ' + (b.emoji || '') + ' ' + b.id.padEnd(22)
  + ' n ' + b.n0 + '→' + b.n + ' 融合=' + b.fused + ' 層宣言=' + b.layersDeclared
  + ' うち J/Q 宣言層=' + b.layersWithJ + ' 走行後の層 body=' + b.layersAfter);
console.log('   **署名の例外候補(融合かつ層宣言)**: '
  + (R.signatureExceptions.length ? R.signatureExceptions.join(', ') : '**0 本**'));
console.log(bad.length ? '**違反 ' + bad.length + ' 件**: ' + bad.join(' , ') : '違反 0 件');
console.log('→ ' + path.relative(ROOT, OUT));
process.exit(bad.length ? 1 : 0);
