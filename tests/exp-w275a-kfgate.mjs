// 第275便a(原仮定者の裁定〔第65報〕(1)): **kFrame 二値の既定契約**の 2 案を、同じ html で
// 切り替えて実測する器である。
//
// ■ 裁定(第65報 (1))
//   「kFrame の分数補正はサンプル限りで予測に使えない → **例外を除き kFrame は kF0 版の 0 か
//    DFM 版の 1 に限定する**」。例外は宣言鍵 `physics.kFrameApprox` である。
//
// ■ 何を測るか(**予想を書かず、走らせて得た数だけを載せる**)
//   ① 内蔵の kFrame の値の集合(⊆ {0,1} か)と本数。
//   ② **案A(reject)と案B(snap)の影響**を同じ入力で比べる:
//      ・`SYSTEM_PROMPT` の few-shot 全例(= AI 追加の応答の雛形)
//      ・旧セーブ形式の physics に分数 kFrame を入れたもの(= 旧セーブの互換)
//      ・宣言つき分数(`"space-mesh-effective"` / `"sample-only"`)・較正クラス・0/1・k>1・非数
//   ③ **丸めが署名を動かすか**(presetSig は丸めた後の kFrame で決まる)。
//   ④ **内蔵 128 本の presetSig が基点と 1 文字も変わらないこと**は別器(exp-w272d-sigsame)の担当。
//      この器は**内蔵の kFrame の値と署名を記録するだけ**である。
//
// ■ この器がしないこと
//   ・力学を測らない(1 步も走らせない)。・「合った」「解決した」とは書かない。
//
// 実行: PLAYWRIGHT_CORE_DIR=/opt/node22/lib/node_modules/playwright node tests/exp-w275a-kfgate.mjs
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';
import { provenanceMeta } from './lib-w272e-provenance.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const HTML = path.join(ROOT, 'beta', 'index.html');
const OUT = path.join(ROOT, 'tests', 'out', 'kfgate-w275a.json');
const CODE = ['tests/exp-w275a-kfgate.mjs', 'tests/lib-w272e-provenance.mjs'];

const PW_DIR = process.env.PLAYWRIGHT_CORE_DIR || '/home/user/dfm-simulator';
const req = createRequire(path.join(PW_DIR, 'noop.js'));
const EXE = process.env.CHROMIUM_PATH || '/opt/pw-browsers/chromium-1194/chrome-linux/chrome';
let browser;
try { browser = await req('playwright').chromium.launch(); }
catch { browser = await req('playwright-core').chromium.launch({ executablePath: EXE }); }
const page = await browser.newPage();
const pageErrors = [];
page.on('pageerror', (e) => pageErrors.push(String(e.message || e)));
await page.goto('file://' + HTML, { waitUntil: 'load' });
await page.waitForFunction(() => window.HP && HP.sim && HP.currentPreset());

const R = await page.evaluate(() => {
  const O = {};
  const bis = HP.allPresets().filter((p) => !String(p.id).startsWith('custom_'));
  O.builtins = bis.length;
  O.kFrameValues = [...new Set(bis.map((p) => p.physics.kFrame))].sort((a, b) => a - b);
  O.kFrameFractionIds = bis.filter((p) => p.physics.kFrame > 0 && p.physics.kFrame < 1).map((p) => p.id);
  O.calibration = bis.filter((p) => p.sampleClass === 'calibration').length;
  O.declaredIds = bis.filter((p) => p.physics.kFrameApprox !== undefined).map((p) => p.id);
  O.approxes = HP.KFRAME_APPROXES ? HP.KFRAME_APPROXES() : null;
  O.approxesCalibration = HP.KFRAME_APPROXES_CALIBRATION ? HP.KFRAME_APPROXES_CALIBRATION() : null;
  O.modeDefault = HP.kFrameUndeclaredMode ? HP.kFrameUndeclaredMode() : null;

  // ---- few-shot(SYSTEM_PROMPT の雛形 = AI 追加の応答の形)
  const shotLines = HP.SYSTEM_PROMPT.split('\n').filter((l) => l.trim().startsWith('{'));
  const shots = shotLines.map((l, i) => { try { return { i, json: JSON.parse(l) }; } catch { return { i, json: null }; } });
  O.fewShot = shots.map((z) => ({ i: z.i, name: z.json ? z.json.name : null,
    emoji: z.json ? z.json.emoji : null,
    kFrame: z.json && z.json.physics ? z.json.physics.kFrame : null }));

  const mk = (phy, cls, name) => {
    const o = { name: name || 'k', description: 'd', camera: { scale: 200 },
      world: { boundary: 'none', size: 0 }, physics: phy,
      bodies: [{ type: 'single', m: 10, x: 0, y: 0, vx: 0, vy: 0, spin: 0, pinned: false }] };
    if (cls) o.sampleClass = cls; return o;
  };
  const CASES = [
    { key: 'principle-0.5', o: mk({ kFrame: 0.5 }, 'principle') },
    { key: 'principle-0.2', o: mk({ kFrame: 0.2 }, 'principle') },
    { key: 'principle-0.7', o: mk({ kFrame: 0.7 }, 'principle') },
    { key: 'noclass-0.2', o: mk({ kFrame: 0.2 }, null) },
    { key: 'noclass-0.999', o: mk({ kFrame: 0.999 }, null) },
    { key: 'noclass-0.001', o: mk({ kFrame: 0.001 }, null) },
    { key: 'declared-sme-principle', o: mk({ kFrame: 0.5, kFrameApprox: 'space-mesh-effective' }, 'principle') },
    { key: 'declared-sampleonly-principle', o: mk({ kFrame: 0.5, kFrameApprox: 'sample-only' }, 'principle') },
    { key: 'declared-bad-principle', o: mk({ kFrame: 0.5, kFrameApprox: 'yes' }, 'principle') },
    { key: 'calib-plain-0.5', o: mk({ kFrame: 0.5 }, 'calibration') },
    { key: 'calib-sme-0.5', o: mk({ kFrame: 0.5, kFrameApprox: 'space-mesh-effective' }, 'calibration') },
    { key: 'calib-sampleonly-0.5', o: mk({ kFrame: 0.5, kFrameApprox: 'sample-only' }, 'calibration') },
    { key: 'calib-0', o: mk({ kFrame: 0 }, 'calibration') },
    { key: 'calib-1', o: mk({ kFrame: 1 }, 'calibration') },
    { key: 'principle-over-1.5', o: mk({ kFrame: 1.5 }, 'principle') },
    { key: 'principle-nonnum', o: mk({ kFrame: 'x' }, 'principle') },
    { key: 'principle-1', o: mk({ kFrame: 1 }, 'principle') },
    { key: 'principle-0', o: mk({ kFrame: 0 }, 'principle') },
  ];
  const run = (mode) => {
    HP.kFrameUndeclaredMode(mode);
    const out = {};
    for (const c of CASES) {
      const v = HP.validatePreset(JSON.parse(JSON.stringify(c.o)));
      out[c.key] = { ok: v.ok, k: v.ok ? v.preset.physics.kFrame : null,
        decl: v.ok ? (v.preset.physics.kFrameApprox === undefined ? null : v.preset.physics.kFrameApprox) : null,
        warn: v.warnings.length, kFrameWarn: v.warnings.filter((w) => String(w).indexOf('kFrame') >= 0).length,
        snapped: v.kFrameSnapped || null,
        err: v.ok ? null : ((v.errors || []).filter((e) => String(e).indexOf('kFrame') >= 0)[0] || (v.errors || [])[0] || null),
        sig: v.ok ? HP.presetSig(v.preset) : null };
    }
    out['_fewShot'] = shots.map((z) => {
      if (!z.json) return { i: z.i, parse: false };
      const v = HP.validatePreset(JSON.parse(JSON.stringify(z.json)));
      return { i: z.i, parse: true, ok: v.ok, warn: v.warnings.length,
        k: v.ok ? v.preset.physics.kFrame : null, snapped: v.kFrameSnapped || null,
        firstWarn: v.warnings[0] || null, firstErr: v.ok ? null : ((v.errors || [])[0] || null) };
    });
    const rt = [];
    for (const p of bis) {
      const v = HP.validatePreset(JSON.parse(JSON.stringify(p)));
      if (!v.ok || v.warnings.length || v.kFrameSnapped)
        rt.push({ id: p.id, ok: v.ok, warn: v.warnings.length, snapped: !!v.kFrameSnapped });
    }
    out['_builtinRevalidate'] = { checked: bis.length, problems: rt };
    return out;
  };
  O.snap = run('snap');
  O.reject = run('reject');
  HP.kFrameUndeclaredMode('snap');

  const base = mk({ kFrame: 0.5 }, 'principle');
  const vSnap = HP.validatePreset(JSON.parse(JSON.stringify(base)));
  const vDeclSme = HP.validatePreset(mk({ kFrame: 0.5, kFrameApprox: 'space-mesh-effective' }, 'principle'));
  const vDeclOnly = HP.validatePreset(mk({ kFrame: 0.5, kFrameApprox: 'sample-only' }, 'principle'));
  const v1 = HP.validatePreset(mk({ kFrame: 1 }, 'principle'));
  O.signature = {
    rawFractionSig: HP.presetSig(base),
    snappedSig: vSnap.ok ? HP.presetSig(vSnap.preset) : null,
    k1Sig: v1.ok ? HP.presetSig(v1.preset) : null,
    declaredSmeSig: vDeclSme.ok ? HP.presetSig(vDeclSme.preset) : null,
    declaredSampleOnlySig: vDeclOnly.ok ? HP.presetSig(vDeclOnly.preset) : null,
  };
  O.signature.snappedEqualsK1 = O.signature.snappedSig === O.signature.k1Sig;
  O.signature.declKeyChangesSig = O.signature.declaredSmeSig !== O.signature.rawFractionSig;
  O.signature.twoDeclsDiffer = O.signature.declaredSmeSig !== O.signature.declaredSampleOnlySig;

  // ---- stabilizePreset(AI 追加の貼付経路)の往復
  const stab = (phy, cls) => {
    try {
      const st = HP.stabilizePreset(mk(phy, cls, 'st'), {});
      return { ok: !!(st && st.ok !== false),
        k: st && st.preset && st.preset.physics ? st.preset.physics.kFrame : null,
        decl: st && st.preset && st.preset.physics ? (st.preset.physics.kFrameApprox === undefined ? null : st.preset.physics.kFrameApprox) : null,
        keys: st ? Object.keys(st) : null,
        err: st && st.errors ? st.errors.slice(0, 1) : null };
    } catch (e) { return { ok: false, err: String(e).slice(0, 160) }; }
  };
  HP.kFrameUndeclaredMode('snap');
  O.stabilizeSnap = { frac: stab({ kFrame: 0.2 }, 'principle'), decl: stab({ kFrame: 0.2, kFrameApprox: 'sample-only' }, 'principle') };
  HP.kFrameUndeclaredMode('reject');
  O.stabilizeReject = { frac: stab({ kFrame: 0.2 }, 'principle'), decl: stab({ kFrame: 0.2, kFrameApprox: 'sample-only' }, 'principle') };
  HP.kFrameUndeclaredMode('snap');

  O.builtinSig = {}; for (const p of bis) O.builtinSig[p.id] = HP.presetSigHash(p);
  return O;
});
await page.close();
await browser.close();

const countBy = (mode) => {
  const o = R[mode], keys = Object.keys(o).filter((k) => !k.startsWith('_'));
  return { accepted: keys.filter((k) => o[k].ok).length, rejected: keys.filter((k) => !o[k].ok).length,
    snapped: keys.filter((k) => o[k].snapped).length, cases: keys.length };
};
const out = {
  meta: Object.assign(provenanceMeta({ root: ROOT, wave: '第275便a(第65報 (1)・kFrame 二値の既定契約)',
    target: 'beta/index.html', inputs: ['beta/index.html'], code: CODE }),
  { question: '**宣言の無い 0<kFrame<1 を受理しない契約**(第65報 (1))を、案A(拒否)と案B(丸めて警告)の'
      + 'どちらで実装するか。**両案を同じ html で切り替えて測った**。',
    rule: '丸めの規則は k<0.5 → 0 / k≥0.5 → 1。較正クラスは**常に拒否**(第273便b の門を弱めない)。',
    doNotWrite: ['kFrame を較正した', 'kFrame の分数が解決した', '二値契約で観測と合った', '判定が増えた'] }),
  builtins: { n: R.builtins, kFrameValues: R.kFrameValues, kFrameFractionIds: R.kFrameFractionIds,
    calibration: R.calibration, declaredIds: R.declaredIds },
  contract: { approxes: R.approxes, approxesCalibration: R.approxesCalibration, modeDefault: R.modeDefault },
  fewShotDeclared: R.fewShot,
  snap: R.snap, reject: R.reject,
  tally: { snap: countBy('snap'), reject: countBy('reject') },
  signature: R.signature,
  stabilize: { snap: R.stabilizeSnap, reject: R.stabilizeReject },
  builtinSig: R.builtinSig,
  pageErrors,
};
fs.writeFileSync(OUT, JSON.stringify(out, null, 1));
console.log('[w275a-kfgate] 内蔵 ' + R.builtins + ' 本 / kFrame の値 ' + JSON.stringify(R.kFrameValues)
  + ' / 分数の内蔵 ' + R.kFrameFractionIds.length + ' 本 / 既定モード ' + R.modeDefault);
console.log('[w275a-kfgate] 案B(snap): 受理 ' + out.tally.snap.accepted + ' / 拒否 ' + out.tally.snap.rejected
  + ' / 丸め ' + out.tally.snap.snapped + '   案A(reject): 受理 ' + out.tally.reject.accepted
  + ' / 拒否 ' + out.tally.reject.rejected);
console.log('[w275a-kfgate] few-shot の kFrame: ' + JSON.stringify(R.fewShot.map((z) => [z.emoji, z.kFrame])));
console.log('[w275a-kfgate] few-shot snap: ' + JSON.stringify(R.snap._fewShot.map((z) => [z.i, z.ok, z.warn, z.k])));
console.log('[w275a-kfgate] few-shot reject: ' + JSON.stringify(R.reject._fewShot.map((z) => [z.i, z.ok, z.warn, z.k])));
console.log('[w275a-kfgate] 内蔵の再検証 snap: ' + JSON.stringify(R.snap._builtinRevalidate.problems)
  + ' / reject: ' + JSON.stringify(R.reject._builtinRevalidate.problems));
console.log('[w275a-kfgate] stabilize snap=' + JSON.stringify(R.stabilizeSnap) + ' reject=' + JSON.stringify(R.stabilizeReject));
console.log('[w275a-kfgate] pageErrors=' + pageErrors.length + ' → ' + OUT);
