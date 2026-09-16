// 第265便c(第57報 W3): **層の明示ゼロ J=0 の宣言が失われる不具合**の再現器と、
// 直した後の**往復表**(build・編集・保存/復元〔チェックポイント〕・複製〔A/B〕・融合・粒子詰め替え)。
//
// 統括の予備測定(基点で再現するもの): m=10・r=1・spin=2・コア V2 なしの粒子に
// `layers:[{role:"core", m:10, r:1, J:0}]` と**明示的に 0 を書いて**も、
//   ・`dfmLayerDipoleMoment` が **null** を返す(= 宣言が無いと読まれる)
//   ・したがって `spinDipoleMoment` は従来殻式へ落ちて **Q=½·10·1²·2=10**
//   ・`bodyLayersOf()` の返り値から **J が消える**(正準形は 0 を出さない規約)
// になる。「値が 0」と「宣言が無い」が同じ 0 で表されているのが原因である。
//
// 直した後に期待するもの(**この器は期待値を書かず、実測値を並べるだけ**):
//   ・明示 J=0 → Q=0(層が所有者)/ 宣言なし → 従来式(不変)
//   ・6 経路の往復で宣言が残る(往復表)
//   ・Jx/Jy も同じ契約
//
// 使い方:
//   PLAYWRIGHT_CORE_DIR=/home/user/dfm-simulator node tests/exp-w265c-layerzero.mjs beta/_w265_base.html beta/index.html
// 出力: JSON(標準出力 + W265C_OUT)
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const TARGETS = process.argv.slice(2).length ? process.argv.slice(2) : ['beta/index.html'];
const PW_DIR = process.env.PLAYWRIGHT_CORE_DIR || '/home/user/dfm-simulator';
const req = createRequire(path.join(PW_DIR, 'noop.js'));
const EXE = process.env.CHROMIUM_PATH || '/opt/pw-browsers/chromium-1194/chrome-linux/chrome';

let browser;
try { browser = await req('playwright').chromium.launch(); }
catch { browser = await req('playwright-core').chromium.launch({ executablePath: EXE }); }

async function measure(target) {
  const page = await browser.newPage();
  const errs = [];
  page.on('pageerror', (e) => errs.push(String(e.message || e)));
  await page.goto('file://' + path.join(ROOT, target), { waitUntil: 'load' });
  await page.waitForFunction(() => window.HP && HP.sim && HP.currentPreset());
  const out = await page.evaluate(() => {
    const O = {};
    const mkP = (layers, spin) => ({
      id: 'w265cZero', name: 'w265cZero', emoji: '🧪',
      description: '第265便c の器(層の明示ゼロ)。E4 だけを残す。',
      camera: { scale: 300 }, world: { boundary: 'none', size: 0 }, seed: 1,
      physics: { G: 1, D0: 0, kFrame: 0, q: 2, kRep: 0, muF: 0, gammaN: 0, kappaS: 0, kappaT: 1 / 60,
        cLight: 30, contactK: 0, contactCap: 0, bM: 1, etaRad: 0, pRad: 4, gravityX: 0, gravityY: 0,
        geoPN: 0, lambdaPN: 1, pnAlpha: 1.5, radiusScale: 1, softening: 0.5, timeScale: 1,
        spinSpin: 1e6 },
      bodies: [
        Object.assign({ type: 'single', m: 10, radius: 1, x: -30, y: 0, vx: 0, vy: 0,
          spin, pinned: false }, layers ? { layers } : {}),
        { type: 'single', m: 10, radius: 1, x: 30, y: 0, vx: 0, vy: 0, spin: 3, pinned: false }],
      overlays: {},
    });
    const build = (layers, spin) => {
      const v = HP.validatePreset(mkP(layers, spin));
      const S = HP.sim; S.build(v.preset);
      return { S, warnings: v.warnings ? v.warnings.slice(0, 4) : [] };
    };
    const snap = (S, i) => ({
      Q: HP.dfmSpinDipoleMoment(i, S),
      layerQ: HP.dfmLayerDipoleMoment(i, S),
      legacy: 0.5 * S.m[i] * S.R[i] * S.R[i] * S.spin[i],
      round: S.bodyLayersOf(i),
      nLay: S.layN[i] || 0,
    });
    // ===== ① build 直後(明示 J=0 / 宣言なし / J≠0 / 面内だけ) =====
    O.build = {};
    for (const [tag, layers, spin] of [
      ['J0explicit', [{ role: 'core', m: 10, r: 1, J: 0 }], 2],
      ['undeclared', [{ role: 'core', m: 10, r: 1 }], 2],
      ['J5', [{ role: 'core', m: 10, r: 1, J: 5 }], 2],
      ['Jx0explicit', [{ role: 'core', m: 10, r: 1, Jx: 0 }], 2],
      ['Jz0Jx7', [{ role: 'core', m: 10, r: 1, J: 0, Jx: 7 }], 2],
      ['twoLayerJ0', [{ role: 'core', m: 4, r: 0.5, J: 0 }, { role: 'shell', m: 6, r: 1 }], 2],
    ]) {
      const { S, warnings } = build(layers, spin);
      O.build[tag] = Object.assign(snap(S, 0), { warnings });
    }
    // ===== ② 6 経路の往復(明示 J=0・Jx=0 を宣言した粒子) =====
    const L0 = () => [{ role: 'core', m: 10, r: 1, J: 0, Jx: 0 }];
    const hasJ = (o) => (o && o.length ? Object.prototype.hasOwnProperty.call(o[0], 'J') : null);
    const hasJx = (o) => (o && o.length ? Object.prototype.hasOwnProperty.call(o[0], 'Jx') : null);
    O.paths = {};
    // (1) build
    { const { S } = build(L0(), 2);
      O.paths.build = { Q: HP.dfmSpinDipoleMoment(0, S), layerQ: HP.dfmLayerDipoleMoment(0, S),
        declJ: hasJ(S.bodyLayersOf(0)), declJx: hasJx(S.bodyLayersOf(0)) }; }
    // (2) 編集(#beLayers の唯一の入口 applyLayerEdit — 別の欄〔r〕だけを変える)
    { const { S } = build(L0(), 2);
      const r = S.applyLayerEdit(0, 0, { r: 2 });
      O.paths.edit = { ok: r.ok, Q: HP.dfmSpinDipoleMoment(0, S), layerQ: HP.dfmLayerDipoleMoment(0, S),
        declJ: hasJ(S.bodyLayersOf(0)), declJx: hasJx(S.bodyLayersOf(0)), r: S.layR[0] };
      // 明示 J=0 を数値だけ書き換える(0 → 3 → 0)
      S.applyLayerEdit(0, 0, { J: 3 });
      const q3 = HP.dfmSpinDipoleMoment(0, S);
      S.applyLayerEdit(0, 0, { J: 0 });
      O.paths.edit.reZero = { q3, q0: HP.dfmSpinDipoleMoment(0, S), declJ: hasJ(S.bodyLayersOf(0)) };
      // 宣言なしの層を編集しても宣言が生えないこと(🧅 と同じ状態)
      const b2 = build([{ role: 'core', m: 10, r: 1 }], 2);
      b2.S.applyLayerEdit(0, 0, { r: 2 });
      O.paths.edit.undeclaredStays = { Q: HP.dfmSpinDipoleMoment(0, b2.S),
        layerQ: HP.dfmLayerDipoleMoment(0, b2.S), declJ: hasJ(b2.S.bodyLayersOf(0)),
        legacy: 0.5 * b2.S.m[0] * b2.S.R[0] * b2.S.R[0] * b2.S.spin[0] }; }
    // (3) 保存/復元(チェックポイント ⏮ = CK_ARRS の往復。**アプリの実ボタンを押す**ので
    //     基点 html でも同じ経路を踏める)
    { const { S } = build(L0(), 2);
      document.querySelector('#btnCkSave').click();
      S.applyLayerEdit(0, 0, { J: 9 });                 // 宣言を壊す方向へ動かしてから復元する
      const mid = HP.dfmSpinDipoleMoment(0, S);
      document.querySelector('#btnCkLoad').click();
      O.paths.checkpoint = { mid, Q: HP.dfmSpinDipoleMoment(0, S),
        layerQ: HP.dfmLayerDipoleMoment(0, S), declJ: hasJ(S.bodyLayersOf(0)),
        declJx: hasJx(S.bodyLayersOf(0)) }; }
    // (4) 複製(A/B の cloneSimState)
    { const { S } = build(L0(), 2);
      const srcQ = HP.dfmSpinDipoleMoment(0, S);
      const B = HP.cloneSimStateNow ? HP.cloneSimStateNow() : null;
      O.paths.clone = B
        ? { Q: HP.dfmSpinDipoleMoment(0, B), layerQ: HP.dfmLayerDipoleMoment(0, B),
            declJ: hasJ(B.bodyLayersOf(0)), declJx: hasJx(B.bodyLayersOf(0)), srcQ }
        : { unavailable: true, srcQ }; }
    // (5) 融合(dfmLayerMerge の純関数 + エンジンの融合経路)
    { const mg = HP.dfmLayerMerge(
        [{ role: 'core', m: 10, r: 1, J: 0, Jx: 0 }],
        [{ role: 'core', m: 5, r: 1 }], 'role');
      O.paths.mergePure = { out: mg, declJ: hasJ(mg) };
      const mg2 = HP.dfmLayerMerge(
        [{ role: 'core', m: 10, r: 1, J: 0 }],
        [{ role: 'shell', m: 5, r: 2, J: 0 }], 'role');
      O.paths.mergePure2 = { out: mg2 };
      // エンジンの融合経路(qa.mjs ⑤ と同じ recipe。両者とも **明示 J=0** を宣言する)
      const LA = [{ role: 'core', m: 90, r: 2, J: 0 }, { role: 'shell', m: 10, r: 10, J: 0 }];
      const LB = [{ role: 'core', m: 45, r: 1.5, J: 0 }, { role: 'shell', m: 5, r: 8, J: 0 }];
      const pr = {
        id: 'w265cFuse', name: 'w265cFuse', emoji: '🧪', description: '融合の器。',
        camera: { scale: 300 }, world: { boundary: 'none', size: 0 }, seed: 1,
        physics: { G: 1, D0: 0, kFrame: 0, q: 2, kRep: 0, muF: 0, gammaN: 0, kappaS: 0, kappaT: 1 / 60,
          cLight: 30, contactK: 0, contactCap: 0, bM: 1, etaRad: 0, pRad: 4, gravityX: 0, gravityY: 0,
          geoPN: 0, lambdaPN: 1, pnAlpha: 1.5, radiusScale: 1, softening: 0.5, timeScale: 1,
          spinSpin: 1e6 },
        bodies: [
          { type: 'single', m: 100, radius: 3, x: -6, y: 0, vx: 0.5, vy: 0, spin: 0.2, pinned: false, layers: LA },
          { type: 'single', m: 50, radius: 3, x: 6, y: 0, vx: -0.5, vy: 0.2, spin: -0.1, pinned: false, layers: LB }],
        fusion: { dFrac: 0.7 }, thermal: 'tint', overlays: {} };
      const v = HP.validatePreset(pr);
      const S = HP.sim; S.build(v.preset);
      const q0 = HP.dfmSpinDipoleMoment(0, S);
      for (let k = 0; k < 4000 && S.n > 1; k++) S.step(0.004);
      O.paths.fuseEngine = { n: S.n, before: q0, Q: HP.dfmSpinDipoleMoment(0, S),
        layerQ: HP.dfmLayerDipoleMoment(0, S), declJ: hasJ(S.bodyLayersOf(0)),
        legacy: 0.5 * S.m[0] * S.R[0] * S.R[0] * S.spin[0],
        round: S.bodyLayersOf(0), layMassRes: S.layMassRes };
    }
    // (6) 粒子詰め替え(_compact — 先頭を殺して層つき粒子を前へ詰める)
    { const v = HP.validatePreset({
        id: 'w265cPack', name: 'w265cPack', emoji: '🧪', description: '詰め替えの器。',
        camera: { scale: 300 }, world: { boundary: 'none', size: 0 }, seed: 1,
        physics: { G: 1, D0: 0, kFrame: 0, q: 2, kRep: 0, muF: 0, gammaN: 0, kappaS: 0, kappaT: 1 / 60,
          cLight: 30, contactK: 0, contactCap: 0, bM: 1, etaRad: 0, pRad: 4, gravityX: 0, gravityY: 0,
          geoPN: 0, lambdaPN: 1, pnAlpha: 1.5, radiusScale: 1, softening: 0.5, timeScale: 1 },
        bodies: [
          { type: 'single', m: 1, radius: 0.5, x: -80, y: 0, vx: 0, vy: 0, spin: 0, pinned: false },
          { type: 'single', m: 10, radius: 1, x: 30, y: 0, vx: 0, vy: 0, spin: 2, pinned: false,
            layers: [{ role: 'core', m: 10, r: 1, J: 0, Jx: 0 }] }],
        overlays: {} });
      const S = HP.sim; S.build(v.preset);
      const before = { Q: HP.dfmSpinDipoleMoment(1, S), declJ: hasJ(S.bodyLayersOf(1)) };
      const dead = new Uint8Array(S.n); dead[0] = 1;
      const into = new Int32Array(S.n).fill(-1); into[0] = 1;
      S._compact(dead, into, S.n);
      O.paths.compact = { before, n: S.n, Q: HP.dfmSpinDipoleMoment(0, S),
        layerQ: HP.dfmLayerDipoleMoment(0, S), declJ: hasJ(S.bodyLayersOf(0)),
        declJx: hasJx(S.bodyLayersOf(0)) };
    }
    // (7) _grow(分裂で配列を伸ばしたあとも宣言が残るか)
    { const { S } = build(L0(), 2);
      const q0 = HP.dfmSpinDipoleMoment(0, S);
      S._grow(S.m.length + 4);
      O.paths.grow = { before: q0, Q: HP.dfmSpinDipoleMoment(0, S),
        layerQ: HP.dfmLayerDipoleMoment(0, S), declJ: hasJ(S.bodyLayersOf(0)) };
    }
    return O;
  });
  await page.close();
  return { target, out, errs };
}

const res = [];
for (const t of TARGETS) res.push(await measure(t));
await browser.close();
const json = JSON.stringify(res, null, 1);
console.log(json);
if (process.env.W265C_OUT) fs.writeFileSync(process.env.W265C_OUT, json);
