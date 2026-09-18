// 第271便c(第61報・統括の検証項目 R2/R4/R5・AF17): **独立 Q の保存・編集境界・ζ_eff 分類**の実測器。
//
// ■ 何を測るのか(統括の検証項目)
//   (R2) `validatePreset` / `S.applyLayerEdit` / 正準化が **Q を J の帯 ±BODY_LAYER_JCAP(1e12)で
//        切っていた**。J と独立の状態にしたのだから、融合で保存した Q(例 Q′=5×10¹⁴)が
//        **半径だけの編集**で 10¹² に縮む。あわせて `dfmLayerMerge` の `qOf` が `Number(null)=0` で
//        `Q:null` を**明示ゼロ扱い**にしていた(`dclOf` は null を未宣言と読む)—— 同じ入力で
//        「宣言ビットは立たないのに源は 0」という組み合わせが作れた。
//   (R4) `dfmLayerQUpdate` の既定 zetaConst は **J₀=0 で ζ が読めない**ので Q₀ を据え置く。
//        その結果 (J,Q)=(10,5)→J=0→J=10 の往復で Q=5 に戻らない。**戻らないこと自体は事実**で、
//        本便が変えたのは「黙って据え置く」を「明示が無ければ編集を拒否する」にした点だけである。
//        `dfmCoreQ` は状態 Q があると `omega=Q/I` を返していた(**源の率**と**機械的な角速度**の混同)。
//   (R5/AF17) ζ_eff が表せない組の**内訳**を分ける。J=Q=0 は「不定」であって「不可」ではない。
//
// ■ 出す表
//   §1 R2-clamp   … 宣言 Q=5e14 の読み込み / 融合 → 半径だけの編集 / 往復 / 正準化 / 原子的拒否
//   §2 R2-null    … `qOf` の null/未定義/明示 0 の三分と `dclOf`(宣言ビット)との整合
//   §3 R4-edit    … (10,5)→J=0→J=10 の往復(旧経路の値と新経路の拒否を並べる)
//   §4 R4-coreQ   … `dfmCoreQ` の omega(機械的 Ω=J/(ζI))と sourceRate(Q/I)の分離
//   §5 R5-class   … 2025 組の ζ_eff 分類の内訳(rule="role"/"add")と ΣQ の保存
//   §6 内蔵       … Q を宣言する内蔵プリセットの本数(= bitsame の例外候補)
//
// ■ この器がしないこと
//   ・**ζ の時間発展則を決めたとは書かない**(Negative Claim 42 は維持)。Q がトルク・減衰でどう動くかは
//     `dfmLayerQUpdate` に置いた**追加仮定**のままである。
//   ・**Q の全経路が閉じたとは書かない**。測ったのは下の 6 表の経路だけである。
//   ・力へは接続しない(層の Q は回転場の源の数値であって、新しい力を足していない)。
//
// 使い方: PLAYWRIGHT_CORE_DIR=/opt/node22/lib/node_modules/playwright \
//         node tests/exp-w271c-qsplit.mjs [beta/index.html]
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const TARGET = process.argv[2] || 'beta/index.html';
const OUT = process.env.W271C_OUT || path.join(ROOT, 'tests', 'out', 'qsplit-w271c.json');
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
  const mk = (layers) => ({ id: 'w271cQ', name: 'w271cQ', emoji: '🧪', description: '独立 Q の編集境界の器。',
    camera: { scale: 300 }, world: { boundary: 'none', size: 0 }, seed: 1,
    physics: { G: 1, D0: 0, kFrame: 0, q: 2, kRep: 0, muF: 0, gammaN: 0, kappaS: 0, kappaT: 1 / 60,
      cLight: 30, contactK: 0, contactCap: 0, bM: 1, etaRad: 0, pRad: 4, gravityX: 0, gravityY: 0,
      geoPN: 0, lambdaPN: 1, pnAlpha: 1.5, radiusScale: 1, softening: 0.5, timeScale: 1, spinSpin: 1e6 },
    bodies: [{ type: 'single', m: 10, radius: 1, x: 0, y: 0, vx: 0, vy: 0, spin: 0, pinned: true,
      layers }], overlays: {} });
  const S = HP.sim;
  const CAP = HP.BODY_LAYER_JCAP;
  // **基点 html でも同じ表が出るようにする**(旧新を 1 つの器で並べるため)。基点には
  // `LAYER_ZETA_CLASSES` も `classification` も無いので、理由からの写像で補う
  const CLASSES = HP.LAYER_ZETA_CLASSES
    || ['representable', 'undefinedBothZero', 'sourceWithoutJ', 'JWithoutSource', 'signMismatch', 'notFinite'];
  const REASON2CLASS = { bothZero: 'undefinedBothZero', JZeroQNonzero: 'sourceWithoutJ',
    QZeroJNonzero: 'JWithoutSource', signMismatch: 'signMismatch', notFinite: 'notFinite' };
  const zeff = (j, q) => { const d = HP.dfmLayerZetaEff(j, q);
    return Object.assign({}, d, { classification: d.classification
      || (d.representable ? 'representable' : (REASON2CLASS[d.reason] || String(d.reason))) }); };

  // ---------------------------------------------------------------- §1 R2: clamp をやめる
  {
    const BIG = 5e14;                                     // J の帯 ±1e12 の 500 倍
    const v = HP.validatePreset(mk([{ role: 'core', m: 10, r: 1, J: 10, Q: BIG }]));
    S.build(v.preset);
    const read = { jcap: CAP, declared: BIG, afterBuild: HP.dfmLayerQ(0, 0, S),
      src: HP.dfmLayerDipoleMoment(0, S), warnings: (v.warnings || []).length,
      layersKept: !!(S.layN && S.layN[0] > 0) };
    // 半径だけの編集(第270便d の規約では Q は不変であるべき経路)
    const e1 = S.applyLayerEdit(0, 0, { r: 2 });
    read.afterRadiusEdit = HP.dfmLayerQ(0, 0, S);
    read.radiusEditOk = !!(e1 && e1.ok);
    // role だけの編集・m だけの編集も同じ
    S.applyLayerEdit(0, 0, { m: 12 });
    read.afterMassEdit = HP.dfmLayerQ(0, 0, S);
    // 往復(bodyLayersOf → _setBodyLayers)と正準形の鍵
    const rt = S.bodyLayersOf(0);
    S._setBodyLayers(0, rt);
    read.afterRoundTrip = HP.dfmLayerQ(0, 0, S);
    read.canonQ = rt[0].Q;
    // JSON 往復(正準形 → JSON 文字列 → validatePreset → build。Σ層 m = body.m を保つ)
    const rt2 = JSON.parse(JSON.stringify(S.bodyLayersOf(0)));
    const pr2 = mk(rt2);
    pr2.bodies[0].m = rt2.reduce((a, L) => a + L.m, 0);
    const v2 = HP.validatePreset(JSON.parse(JSON.stringify(pr2)));
    S.build(v2.preset);
    read.afterJsonRoundTrip = HP.dfmLayerQ(0, 0, S);
    read.jsonWarnings = (v2.warnings || []).length;
    // 融合(純関数)で保存した独立 Q
    const A = [{ role: 'core', m: 10, r: 1, J: 10, Q: 2.5e14 }];
    const B = [{ role: 'core', m: 10, r: 1, J: -10, Q: 2.5e14 }];
    const mg = HP.dfmLayerMerge(A, B, 'role');
    read.mergedQ = mg[0].Q; read.mergedJ = mg[0].J; read.mergedRep = mg[0].zetaRepresentable;
    // 融合の結果をエンジンへ戻し、半径だけ編集する(R2 の筋書きそのもの)
    const set = S._setBodyLayers(0, [{ role: 'core', m: 10, r: 1, J: mg[0].J, Q: mg[0].Q }]);
    read.setOk = !!(set && set.ok);
    read.engineMergedQ = HP.dfmLayerQ(0, 0, S);
    S.applyLayerEdit(0, 0, { r: 3 });
    read.engineMergedAfterRadius = HP.dfmLayerQ(0, 0, S);
    // 原子的拒否(非有限の宣言・非有限の導出)
    const before = HP.dfmLayerQ(0, 0, S);
    const rej = [];
    rej.push({ what: 'cfg.Q=Infinity', r: S.applyLayerEdit(0, 0, { Q: Infinity }), q: HP.dfmLayerQ(0, 0, S) });
    rej.push({ what: 'cfg.Q=NaN', r: S.applyLayerEdit(0, 0, { Q: NaN }), q: HP.dfmLayerQ(0, 0, S) });
    // **プリセットは JSON を通る**(validatePreset は JSON.parse(JSON.stringify(obj)) で複写する)ので、
    // Infinity/NaN はそこで **null** になる = 「未宣言」として Q=J/ζ が導出される。非数値の宣言
    // (文字列など)は JSON を越えるので、そちらが拒否の経路である
    const vInf = HP.validatePreset(mk([{ role: 'core', m: 10, r: 1, J: 10, Q: Infinity }]));
    rej.push({ what: 'preset Q=Infinity(JSON で null 化)', layers: !!(vInf.preset.bodies[0].layers),
      warn: (vInf.warnings || []).filter((w) => w.indexOf('.Q ') >= 0).length,
      qAfterBuild: (() => { S.build(vInf.preset); return HP.dfmLayerQ(0, 0, S); })() });
    const vbad = HP.validatePreset(mk([{ role: 'core', m: 10, r: 1, J: 10, Q: '1e20' }]));
    rej.push({ what: 'preset Q="1e20"(非数値)', layers: !!(vbad.preset.bodies[0].layers),
      warn: (vbad.warnings || []).filter((w) => w.indexOf('.Q ') >= 0).length });
    // 導出のオーバーフロー: Q₀ が巨大・J₀ が極小の層で J を動かす(ζ 一定が Infinity を作る)
    S._setBodyLayers(0, [{ role: 'core', m: 10, r: 1, J: 1e-300, Q: 5e14 }]);
    const ov = S.applyLayerEdit(0, 0, { J: 1e12 });
    rej.push({ what: 'zetaConst overflow', r: ov, q: HP.dfmLayerQ(0, 0, S) });
    read.rejects = rej; read.qBeforeRejects = before;
    O.clamp = read;
  }

  // ---------------------------------------------------------------- §2 R2: null / 未定義 / 明示 0
  {
    const rows = [];
    const probe = (tag, L) => {
      // 相手を空にして **その層 1 枚の読み方**だけを出す(decl の和集合が混ざらない)
      const out = HP.dfmLayerMerge([L], [], 'role');
      rows.push({ tag, Q: out[0].Q, decl: out[0].decl, qBit: (out[0].decl & 8) === 8,
        zetaRepresentable: out[0].zetaRepresentable });
    };
    probe('Q 未指定(J=10・ζ=2)', { role: 'core', m: 10, r: 1, J: 10, inertiaScale: 2 });
    probe('Q:null(J=10・ζ=2)', { role: 'core', m: 10, r: 1, J: 10, inertiaScale: 2, Q: null });
    probe('Q:0 の明示(J=10・ζ=2)', { role: 'core', m: 10, r: 1, J: 10, inertiaScale: 2, Q: 0 });
    probe('Q:3 の明示(J=10・ζ=2)', { role: 'core', m: 10, r: 1, J: 10, inertiaScale: 2, Q: 3 });
    probe('J も Q も未指定', { role: 'core', m: 10, r: 1 });
    O.nullQ = rows;
  }

  // ---------------------------------------------------------------- §3 R4: J=0 をまたぐ編集
  {
    const v = HP.validatePreset(mk([{ role: 'core', m: 10, r: 1, J: 10, Q: 5 }]));
    S.build(v.preset);
    const rows = [];
    const read = (tag, r) => { const L = S.bodyLayersOf(0)[0];
      rows.push({ tag, ok: r === null ? null : !!(r && r.ok), reason: (r && r.reason) || null,
        J: L.J === undefined ? 0 : L.J, Q: HP.dfmLayerQ(0, 0, S),
        zeff: zeff(L.J === undefined ? 0 : L.J, HP.dfmLayerQ(0, 0, S)) }); };
    read('build(J=10・Q=5)', null);
    read('{J:0}', S.applyLayerEdit(0, 0, { J: 0 }));
    read('{J:10}(明示なし)', S.applyLayerEdit(0, 0, { J: 10 }));
    read('{J:10, Q:5}(Q を明示)', S.applyLayerEdit(0, 0, { J: 10, Q: 5 }));
    // ζ を明示する経路(Q=J/ζ_new を導出し直す)
    S.applyLayerEdit(0, 0, { J: 0 });
    read('{J:0} をやり直す', null);
    read('{J:10, inertiaScale:2}', S.applyLayerEdit(0, 0, { J: 10, inertiaScale: 2 }));
    O.editJ0 = rows;
    // 純関数の更新則そのもの(本便では変えていない — 事実として並べる)
    O.updateAtJ0 = HP.dfmLayerQUpdate({ J0: 0, Q0: 5, J1: 10, mode: 'zetaConst' });
  }

  // ---------------------------------------------------------------- §4 R4: dfmCoreQ の Ω と源の率
  {
    const rows = [];
    const one = (tag, o) => { const r = HP.dfmCoreQ(o);
      rows.push({ tag, Q: r.Q, source: r.source, I: r.I, omega: r.omega, sourceRate: r.sourceRate,
        mech: o.J / (r.I * (o.zeta === undefined ? 1 : o.zeta)) }); };
    one('導出(Q 未指定・J=10・ζ=2)', { Mc: 10, Rc: 1, J: 10, zeta: 2 });
    one('状態(Q=50・J=10・ζ=2)', { Mc: 10, Rc: 1, J: 10, zeta: 2, Q: 50 });
    one('状態(Q=0・J=10・ζ=2)', { Mc: 10, Rc: 1, J: 10, zeta: 2, Q: 0 });
    one('状態(Q=5・J=0・ζ=1)', { Mc: 10, Rc: 1, J: 0, zeta: 1, Q: 5 });
    O.coreQ = rows;
  }

  // ---------------------------------------------------------------- §5 R5: 2025 組の分類
  {
    const JS = [-20, -15, -10, -5, 0, 5, 10, 15, 20], ZS = [0.25, 0.5, 1, 2, 4];
    const zOf = (L) => { const z = Number(L.inertiaScale); return (Number.isFinite(z) && z > 0) ? z : 1; };
    const qOf = (L) => { if (L.Q !== undefined && L.Q !== null) { const q = Number(L.Q);
      if (Number.isFinite(q)) return q; } return (Number(L.J) || 0) / zOf(L); };
    const scan = (rule) => {
      const cls = {}; for (const k of CLASSES) cls[k] = 0;
      let n = 0, sumOk = 0, repFlag = 0;
      const sample = {};
      for (const ja of JS) for (const za of ZS) for (const jb of JS) for (const zb of ZS) {
        const A = [{ role: 'core', m: 10, r: 1, J: ja, inertiaScale: za }];
        const B = [{ role: (rule === 'add') ? 'shell' : 'core', m: 10, r: 1, J: jb, inertiaScale: zb }];
        const out = HP.dfmLayerMerge(A, B, rule);
        const before = qOf(A[0]) + qOf(B[0]);
        // "add" は半径が同じなら 1 層へ畳まれるので、**層を数えず全層の和で読む**
        const qn = out.reduce((a, L) => a + L.Q, 0);
        const Jn = out.reduce((a, L) => a + L.J, 0);
        n++;
        if (Object.is(qn, before)) sumOk++;
        const d = zeff(Jn, qn);
        cls[d.classification]++;
        if (d.representable) repFlag++;
        if (!sample[d.classification]) sample[d.classification] = { ja, za, jb, zb, J: Jn, Q: qn };
      }
      return { rule, n, sumPreserved: sumOk, sumBroken: n - sumOk, classes: cls,
        representable: repFlag, notRepresentable: n - repFlag, sample };
    };
    O.classScan = [scan('role'), scan('add')];
    // 単体の分類表(5 例)
    O.zeffTable = [[10, 5], [0, 0], [0, 5], [10, 0], [10, -5], [Infinity, 1]].map(([j, q]) => ({
      J: j, Q: q, ...zeff(j, q) }));
    O.classes = CLASSES;
    O.hasClassificationField = !!HP.dfmLayerZetaEff(10, 5).classification;
    O.hasClassList = !!HP.LAYER_ZETA_CLASSES;
  }

  // ---------------------------------------------------------------- §6 内蔵の洗い出し
  {
    const rows = [];
    for (const p of HP.allPresets()) {
      let qDecl = 0, layers = 0;
      for (const b of (p.bodies || [])) {
        if (!b || !Array.isArray(b.layers)) continue;
        layers += b.layers.length;
        for (const L of b.layers) if (L && L.Q !== undefined && L.Q !== null) qDecl++;
      }
      if (layers) rows.push({ id: p.id, emoji: p.emoji, layers, qDeclared: qDecl });
    }
    O.builtins = rows; O.builtinCount = HP.allPresets().length;
    O.builtinQDeclared = rows.filter((r) => r.qDeclared > 0).map((r) => r.id);
  }
  return O;
});

await browser.close();

// ---------------------------------------------------------------- 突き合わせ
const bad = [];
const C = R.clamp;
if (!(C.afterBuild === C.declared)) bad.push(`§1 宣言 Q=${C.declared} が読み込みで ${C.afterBuild} になった(clamp が残っている)`);
if (!(C.afterRadiusEdit === C.declared)) bad.push(`§1 半径だけの編集で Q が ${C.afterRadiusEdit} へ動いた`);
if (!(C.afterMassEdit === C.declared)) bad.push(`§1 m だけの編集で Q が ${C.afterMassEdit} へ動いた`);
if (!(C.afterRoundTrip === C.declared)) bad.push('§1 往復で Q が落ちた');
if (!(C.afterJsonRoundTrip === C.declared)) bad.push('§1 JSON 往復で Q が落ちた');
if (!(C.mergedQ === 5e14 && C.mergedJ === 0)) bad.push(`§1 融合の Q′ が 5e14 でない(${C.mergedQ})`);
if (!(C.engineMergedAfterRadius === 5e14)) bad.push(`§1 融合 → 半径だけの編集で Q が ${C.engineMergedAfterRadius} へ縮んだ`);
for (const r of C.rejects) {
  if (r.what.indexOf('preset ') === 0) {
    if (r.what.indexOf('非数値') >= 0 && r.layers) bad.push('§1 非数値の Q を宣言したプリセットの layers が残った');
    continue; }
  if (r.r && r.r.ok) bad.push(`§1 ${r.what} が拒否されていない`);
  if (r.what !== 'zetaConst overflow' && r.q !== C.qBeforeRejects) bad.push(`§1 ${r.what} で値が書かれた`);
}
const N = R.nullQ;
if (!(N[0].Q === 5 && N[1].Q === 5)) bad.push(`§2 Q:null が未宣言(Q=J/ζ=5)と同じ読みになっていない(${N[1].Q})`);
if (!(N[1].qBit === false)) bad.push('§2 Q:null で宣言ビット 8 が立っている');
if (!(N[2].Q === 0 && N[2].qBit === true)) bad.push('§2 明示 0 が値として残っていない');
if (!(N[3].Q === 3 && N[3].qBit === true)) bad.push('§2 明示 3 が残っていない');
const E = R.editJ0;
if (!(E[1].Q === 0 && E[1].ok === true)) bad.push('§3 {J:0} が通っていない');
if (!(E[2].ok === false && E[2].reason === 'qAmbiguousAtJ0')) bad.push('§3 J₀=0 の非ゼロ J 編集が拒否されていない');
if (!(E[2].Q === 0 && E[2].J === 0)) bad.push('§3 拒否された編集が状態を書き換えた');
if (!(E[3].ok === true && E[3].Q === 5 && E[3].J === 10)) bad.push('§3 Q を明示した編集が通っていない');
if (!(E[5].ok === true && E[5].Q === 5)) bad.push(`§3 ζ を明示した編集が Q=J/ζ=5 にならない(${E[5].Q})`);
const Q = R.coreQ;
if (!(Q[0].omega === Q[0].sourceRate && Q[0].omega === Q[0].mech)) bad.push('§4 導出形で omega と sourceRate が食い違う');
if (!(Q[1].omega === Q[1].mech && Q[1].sourceRate === 10 && Q[1].omega === 1)) bad.push('§4 状態 Q の omega が機械的 Ω に固定されていない');
for (const s of R.classScan) {
  if (s.n !== 2025) bad.push(`§5 rule=${s.rule} の組が 2025 でない`);
  if (s.sumBroken !== 0) bad.push(`§5 rule=${s.rule} の ΣQ 保存が破れた(${s.sumBroken})`);
  const tot = Object.values(s.classes).reduce((a, b2) => a + b2, 0);
  if (tot !== 2025) bad.push(`§5 rule=${s.rule} の分類の和が 2025 でない(${tot})`);
}
if (R.builtinQDeclared.length) bad.push('§6 Q を宣言する内蔵がある: ' + R.builtinQDeclared.join(', '));
if (pageErrors.length) bad.push('pageerror: ' + pageErrors.slice(0, 2).join(' / '));

const out = { when: new Date().toISOString(), wave: '第271便c(第61報・統括の検証項目 R2/R4/R5・AF17)',
  target: TARGET, ...R, violations: bad };
fs.mkdirSync(path.dirname(OUT), { recursive: true });
fs.writeFileSync(OUT, JSON.stringify(out, null, 1));

console.log('[w271c] 独立 Q の保存(R2)・編集境界(R4)・ζ_eff の分類(R5/AF17)');
console.log('§1 R2: Q に J の帯(±' + C.jcap + ')を掛けない');
console.log('   宣言 ' + C.declared + ' → 読み込み ' + C.afterBuild + ' / 半径だけの編集 ' + C.afterRadiusEdit
  + ' / m だけの編集 ' + C.afterMassEdit + ' / 往復 ' + C.afterRoundTrip + ' / JSON 往復 ' + C.afterJsonRoundTrip);
console.log('   融合(純関数)J′=' + C.mergedJ + '・Q′=' + C.mergedQ + '(ζ_eff 表せる=' + C.mergedRep + ')'
  + ' → エンジンへ戻す ' + C.engineMergedQ + ' → 半径だけの編集 ' + C.engineMergedAfterRadius);
for (const r of C.rejects) console.log('   拒否: ' + String(r.what).padEnd(28)
  + (r.r ? (' ok=' + r.r.ok + ' 理由=' + (r.r.reason || '—') + ' 値=' + r.q)
    : (' layers 残存=' + r.layers + ' 警告 ' + r.warn
      + (r.qAfterBuild === undefined ? '' : ' 読み込み後 Q=' + r.qAfterBuild))));
console.log('§2 R2: `qOf` の null / 未定義 / 明示 0');
for (const r of R.nullQ) console.log('   ' + r.tag.padEnd(24) + ' → Q=' + r.Q + ' 宣言ビット=' + r.decl + '(8=Q: ' + r.qBit + ')');
console.log('§3 R4: (10,5)→J=0→J=10 の往復');
for (const r of R.editJ0) console.log('   ' + r.tag.padEnd(26) + ' ok=' + String(r.ok).padEnd(5)
  + ' 理由=' + String(r.reason || '—').padEnd(16) + ' J=' + r.J + ' Q=' + r.Q
  + ' ζ_eff=' + r.zeff.zetaEff + '(' + r.zeff.classification + ')');
console.log('   純関数 dfmLayerQUpdate({J0:0,Q0:5,J1:10}) → Q=' + R.updateAtJ0.Q + '・理由 ' + R.updateAtJ0.reason
  + '(**本便では変えていない** —— 変えたのは編集 UI が黙って据え置かない点である)');
console.log('§4 R4: dfmCoreQ の omega(機械的 Ω=J/(ζI))と sourceRate(Q/I)');
for (const r of R.coreQ) console.log('   ' + r.tag.padEnd(26) + ' Q=' + r.Q + '(' + r.source + ')'
  + ' I=' + r.I + ' omega=' + r.omega + ' sourceRate=' + r.sourceRate + ' 機械的 Ω=' + r.mech);
console.log('§5 R5/AF17: 2025 組の ζ_eff 分類');
for (const s of R.classScan) {
  console.log('   rule=' + s.rule + ' 組 ' + s.n + ' / ΣQ 保存 ' + s.sumPreserved + '(破れ ' + s.sumBroken + ')'
    + ' / 表せる ' + s.representable + '・表せない ' + s.notRepresentable);
  for (const k of R.classes) console.log('      ' + k.padEnd(18) + ' ' + String(s.classes[k]).padStart(5)
    + (s.sample[k] ? '  例 (J,ζ)=(' + s.sample[k].ja + ',' + s.sample[k].za + ')+(' + s.sample[k].jb + ','
      + s.sample[k].zb + ') → J′=' + s.sample[k].J + '・Q′=' + s.sample[k].Q : ''));
}
console.log('   単体の分類表: ' + R.zeffTable.map((r) => '(' + r.J + ',' + r.Q + ')→' + r.classification).join(' / '));
console.log('§6 内蔵 ' + R.builtinCount + ' 本のうち層を宣言する本 ' + R.builtins.length
  + ' / **Q を宣言する本 ' + R.builtinQDeclared.length + ' 本**(= bitsame の例外候補)');
console.log(bad.length ? '**違反 ' + bad.length + ' 件**: ' + bad.join(' , ') : '違反 0 件');
console.log('→ ' + path.relative(ROOT, OUT));
process.exit(bad.length ? 1 : 0);
