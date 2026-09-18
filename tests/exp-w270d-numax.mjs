// 第270便d(第60報 W4・AD2+AA11・統括の読み (C)): **ν̄ の受理前上限帳簿**(`lightTrap.nuMax`)と
// **`collapseR` の有無の対照**の実測器。
//
// ■ AD2 の式(**受理前**に切る —— 供給してから削って戻す方式は採らない)
//   C = max(0, ν_max·N_γ − E_γ)・W_accept = min(W_req, E_s, C)・E_s′=E_s−W_accept・E_γ′=E_γ+W_accept
//   断られた分は **E_s に残る**(`workRejected` に累計する)。N_γ=0 では ν̄ は **null(未定義)**で、
//   平均が無い状態に上限を当てない。恒等式 **E_s+E_γ+E_esc+Q−E_in=E_s(0)** は保つ(dt 3 段で実測)。
//   **ν_max は省略時=上限なし**で、内蔵 124 本(🐮 を含む)は 1 本も宣言しない = 既定経路はビット同一。
//
// ■ 上限条件が経路で変わること(**「全経路の上限制御が完成した」とは書かない**)
//   初期状態で既に超えている・N_γ が脱出/吸収で減る・融合で E_γ と N_γ が和になる・refill が止まって
//   光子が増えない —— いずれでも ν̄>ν_max のまま滞在しうる(止めているのは**仕事の受理**だけである)。
//   外来光(井戸へ落ちてくる光)の捕獲はまだ無い。
//
// ■ AA11: `collapseR`(コア半径がこの値以下で崩壊ラッチ)は**内蔵 124 本のどれも宣言していない**。
//   診断コピー 1 本で有無の対照(発火時刻・E_esc・ν̄ の差)を出す。**未使用ならキー削除は次便**。
//
// 使い方: PLAYWRIGHT_CORE_DIR=/opt/node22/lib/node_modules/playwright \
//         node tests/exp-w270d-numax.mjs [beta/index.html]
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const TARGET = process.argv[2] || 'beta/index.html';
const OUT = process.env.W270DN_OUT || path.join(ROOT, 'tests', 'out', 'numax-w270d.json');
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
  const base = () => { const q = HP.allPresets().find((z) => z.id === 'lfbotTrap');
    return q ? JSON.parse(JSON.stringify(q)) : null; };
  // 🐮 の**診断コピー**を走らせる(本体 🐮 には nuMax も collapseR も宣言しない)
  const run = (o) => {
    const q = base(); if (!q) return { err: 'lfbotTrap が内蔵に無い' };
    const b = q.bodies[0];
    if (o.lightTrap === null) delete b.core.lightTrap;
    else if (o.lightTrap) Object.assign(b.core.lightTrap, o.lightTrap);
    const v = HP.validatePreset(q);
    if (!v.ok) return { err: (v.errors || []).join('|') };
    const S = HP.sim; S.build(v.preset);
    const dt = (o.dt === undefined) ? 0.016 : o.dt;
    const steps = (o.steps === undefined) ? 2500 : o.steps;
    let peakNu = 0, peakL = 0, fireT = null, nOverMax = 0;
    for (let k = 0; k < steps; k++) {
      S.step(dt);
      const z = HP.dfmLightTrapLedger(S);
      if (z) {
        if (z.nuBar !== null && z.nuBar > peakNu) peakNu = z.nuBar;
        if (z.Lesc > peakL) peakL = z.Lesc;
        if (fireT === null && z.collapsed > 0) fireT = z.collapseT;
        if (z.nOverCap > nOverMax) nOverMax = z.nOverCap;
      }
    }
    const z = HP.dfmLightTrapLedger(S);
    return { dt, steps, t: S.t, n: S.n,
      Eg: z.Eg, Ng: z.Ng, Es: z.Es, Eesc: z.Eesc, Q: z.Q, Ein: z.Ein, Es0: z.Es0,
      nuBar: z.nuBar, peakNu, peakL, fireT, residual: z.residual, relResidual: z.relResidual,
      residualNoEin: (z.Es + z.Eg + z.Eesc + z.Q) - z.Es0,
      nCapped: z.nCapped, nOverCap: z.nOverCap, nOverMax, workRejected: z.workRejected,
      nuMaxOf0: HP.dfmLightTrapNuMax(0, S), wxOf0: HP.dfmLightTrapWorkRejected(0, S),
      collapsed: z.collapsed, nan: S.hasNaN() };
  };

  // -------------------------------------------------------- §0 宣言の検証器(値域・未知キー・0 の明示)
  {
    const mk = (lt) => { const q = base(); Object.assign(q.bodies[0].core.lightTrap, lt);
      const v = HP.validatePreset(q);
      const c = v.preset.bodies[0].core.lightTrap || {};
      return { has: Object.prototype.hasOwnProperty.call(c, 'nuMax'), val: c.nuMax,
        warn: v.warnings.filter((w) => /nuMax/.test(w)).length }; };
    O.decl = { omitted: mk({}), zero: mk({ nuMax: 0 }), ten: mk({ nuMax: 10 }),
      neg: mk({ nuMax: -1 }), str: mk({ nuMax: 'x' }), big: mk({ nuMax: 1e30 }) };
  }

  // -------------------------------------------------------- §1 既定経路(🐮 本体は不変)
  O.plain = run({});

  // -------------------------------------------------------- §2 上限を宣言した診断コピー
  O.cap = [5, 10, 20, 100].map((nu) => Object.assign({ nuMax: nu }, run({ lightTrap: { nuMax: nu } })));

  // -------------------------------------------------------- §3 恒等式 3 段(dt / dt/2 / dt/4)
  O.cons = [[0.016, 2500], [0.008, 5000], [0.004, 10000]].map(([dt, st]) =>
    Object.assign({ dt }, run({ dt, steps: st, lightTrap: { nuMax: 5 } })));

  // -------------------------------------------------------- §4 対照④(refill:false の ν̄ 発散を上限で止める)
  O.ctrl4 = [
    Object.assign({ tag: 'refill:false(上限なし)' }, run({ lightTrap: { refill: false } })),
    Object.assign({ tag: 'refill:false + nuMax=20' }, run({ lightTrap: { refill: false, nuMax: 20 } })),
    Object.assign({ tag: 'refill:false + nuMax=100' }, run({ lightTrap: { refill: false, nuMax: 100 } })),
  ];

  // -------------------------------------------------------- §5 N_γ=0 の未定義(etaRad=0 で光子が 1 つも入らない)
  {
    const q = base(); q.physics.etaRad = 0;
    Object.assign(q.bodies[0].core.lightTrap, { nuMax: 5 });
    const v = HP.validatePreset(q); const S = HP.sim; S.build(v.preset);
    for (let k = 0; k < 400; k++) S.step(0.016);
    const z = HP.dfmLightTrapLedger(S);
    O.nZero = { Ng: z.Ng, Eg: z.Eg, nuBar: z.nuBar, Es: z.Es, Es0: z.Es0,
      workRejected: z.workRejected, nOverCap: z.nOverCap, residual: z.residual };
  }

  // -------------------------------------------------------- §6 純関数の受理則(単体)
  {
    const accept = (Wreq, Es, nuMax, N, Eg) => { const room = nuMax * N - Eg, C = (room > 0) ? room : 0;
      return Math.min(Wreq, Es, C); };
    O.unit = [
      { Wreq: 10, Es: 100, nuMax: 5, N: 4, Eg: 10, W: accept(10, 100, 5, 4, 10) },
      { Wreq: 10, Es: 100, nuMax: 5, N: 4, Eg: 20, W: accept(10, 100, 5, 4, 20) },
      { Wreq: 10, Es: 3, nuMax: 5, N: 4, Eg: 0, W: accept(10, 3, 5, 4, 0) },
      { Wreq: 10, Es: 100, nuMax: 0, N: 4, Eg: 0, W: accept(10, 100, 0, 4, 0) },
    ];
  }

  // -------------------------------------------------------- §7 AA11: collapseR の有無の対照
  {
    const rows = [];
    for (const rc of [null, 1.2, 1.0, 0.8]) {
      const o = (rc === null) ? {} : { collapseR: rc };
      const r = run({ lightTrap: o });
      rows.push({ collapseR: rc, fireT: r.fireT, Eesc: r.Eesc, nuBar: r.nuBar, peakNu: r.peakNu,
        peakL: r.peakL, Eg: r.Eg, relResidual: r.relResidual });
    }
    O.aa11 = rows;
    // 内蔵で collapseR を宣言している本(= 0 本のはず)
    let n = 0; const ids = [];
    for (const p of HP.allPresets()) {
      const s = JSON.stringify(p);
      if (/"collapseR"/.test(s)) { n++; ids.push(p.id); }
    }
    O.aa11Declared = { n, ids };
  }
  // 内蔵で nuMax を宣言している本(= 0 本のはず)
  { let n = 0; const ids = [];
    for (const p of HP.allPresets()) if (/"nuMax"/.test(JSON.stringify(p))) { n++; ids.push(p.id); }
    O.nuMaxDeclared = { n, ids, total: HP.allPresets().length }; }
  return O;
});

await browser.close();

// ---------------------------------------------------------------- 突き合わせ
const bad = [];
if (O_err(R.plain)) bad.push('§1 既定走行が失敗: ' + R.plain.err);
function O_err(x) { return x && x.err; }
if (R.decl.omitted.has) bad.push('§0 nuMax を省略したのに正準形に鍵が出た(既定経路が動く)');
if (!(R.decl.zero.has && R.decl.zero.val === 0)) bad.push('§0 nuMax:0 の明示宣言が落ちた(値と未指定を分けていない)');
if (!(R.decl.ten.val === 10)) bad.push('§0 nuMax:10 が通らない');
if (R.decl.neg.has || R.decl.str.has) bad.push('§0 負/非数値の nuMax が受理された');
if (!(R.nuMaxDeclared.n === 0)) bad.push('§0 内蔵が nuMax を宣言している: ' + R.nuMaxDeclared.ids.join(','));
for (const c of R.cap) {
  if (!(Math.abs(c.relResidual) < 1e-12)) bad.push(`§2 nuMax=${c.nuMax} の恒等式残差が大きい(${c.relResidual})`);
  if (!(c.nCapped === 1)) bad.push(`§2 nuMax=${c.nuMax} で上限を持つ粒子が 1 でない`);
  if (c.nan) bad.push(`§2 nuMax=${c.nuMax} で NaN`);
}
for (const c of R.cons) if (!(Math.abs(c.relResidual) < 1e-12))
  bad.push(`§3 dt=${c.dt} の恒等式残差が大きい(${c.relResidual})`);
if (!(R.nZero.Ng === 0 && R.nZero.nuBar === null)) bad.push('§5 N_γ=0 で ν̄ が null でない');
if (!(R.nZero.Es === R.nZero.Es0)) bad.push('§5 N_γ=0 なのに E_s が減っている(平均が無い状態で仕事をした)');
if (!(R.unit[1].W === 0)) bad.push('§6 上限を超えた状態で受理量が 0 でない');
if (!(R.unit[3].W === 0)) bad.push('§6 nuMax=0 で受理量が 0 でない');
if (!(R.aa11Declared.n === 0)) bad.push('§7 内蔵が collapseR を宣言している: ' + R.aa11Declared.ids.join(','));
if (pageErrors.length) bad.push('pageerror: ' + pageErrors.slice(0, 2).join(' / '));

const out = { when: new Date().toISOString(), wave: '第270便d(第60報 W4・AD2+AA11・統括の読み (C))',
  target: TARGET, ...R, violations: bad };
fs.mkdirSync(path.dirname(OUT), { recursive: true });
fs.writeFileSync(OUT, JSON.stringify(out, null, 1));

const f = (x, d = 6) => (x === null || x === undefined) ? String(x) : (typeof x === 'number' ? x.toFixed(d) : String(x));
const e = (x) => (x === null || x === undefined) ? String(x) : x.toExponential(3);
console.log('[w270d/AD2] ν̄ の**受理前**上限帳簿 `lightTrap.nuMax`(省略時=上限なし・内蔵 '
  + R.nuMaxDeclared.total + ' 本は 1 本も宣言しない = 既定経路は不変)');
console.log('§0 宣言: 省略で鍵なし=' + !R.decl.omitted.has + ' / nuMax:0 の明示=' + R.decl.zero.val
  + ' / 10=' + R.decl.ten.val + ' / 負=' + R.decl.neg.has + '(警告 ' + R.decl.neg.warn + ')'
  + ' / 非数値=' + R.decl.str.has + ' / 1e30 は上限へ丸め=' + R.decl.big.val);
console.log('§1+§2 🐮 の診断コピー(2500 步・dt=0.016・供給源 E_s(0)=' + f(R.plain.Es0, 1) + ')');
console.log('  ν_max      | 最終 ν̄    | ピーク ν̄  | E_γ      | E_esc    | E_s 残    | 断られた仕事 | 上限超過中 | 相対残差');
const row = (tag, r) => console.log('  ' + String(tag).padEnd(10) + ' | ' + f(r.nuBar, 4).padStart(9)
  + ' | ' + f(r.peakNu, 4).padStart(9) + ' | ' + f(r.Eg, 4).padStart(8) + ' | ' + f(r.Eesc, 4).padStart(8)
  + ' | ' + f(r.Es, 4).padStart(9) + ' | ' + f(r.workRejected, 4).padStart(12)
  + ' | ' + String(r.nOverMax).padStart(9) + ' | ' + e(r.relResidual));
row('なし', R.plain);
for (const c of R.cap) row(c.nuMax, c);
console.log('§3 恒等式 3 段(nuMax=5)');
for (const c of R.cons) console.log('  dt=' + c.dt + ' 相対残差 ' + e(c.relResidual)
  + ' / 絶対 ' + e(c.residual) + ' / **E_in を落とした形** ' + e(c.residualNoEin));
console.log('§4 対照④(refill:false — 少数の光子に仕事が乗り続けて ν̄ が発散する構成)');
for (const c of R.ctrl4) console.log('  ' + c.tag.padEnd(24) + ' 最終 ν̄=' + f(c.nuBar, 3)
  + ' ピーク ν̄=' + f(c.peakNu, 3) + ' E_esc=' + f(c.Eesc, 4) + ' E_s 残=' + f(c.Es, 4)
  + ' 断られた仕事=' + f(c.workRejected, 4) + ' 残差 ' + e(c.relResidual));
console.log('§5 N_γ=0(etaRad=0): N_γ=' + R.nZero.Ng + ' ν̄=' + R.nZero.nuBar
  + ' E_s=' + f(R.nZero.Es, 4) + '(E_s(0)=' + f(R.nZero.Es0, 1) + ')断られた仕事=' + R.nZero.workRejected);
console.log('§6 受理則の単体: ' + R.unit.map((u) => `W_req=${u.Wreq},E_s=${u.Es},ν_max=${u.nuMax},N=${u.N},E_γ=${u.Eg} → W=${u.W}`).join(' / '));
console.log('[w270d/AA11] collapseR の有無の対照(内蔵の宣言 ' + R.aa11Declared.n + ' 本)');
console.log('  collapseR | 崩壊時刻 | E_esc    | 最終 ν̄  | ピーク ν̄ | ピーク L_esc');
for (const a of R.aa11) console.log('  ' + String(a.collapseR).padEnd(9) + ' | ' + f(a.fireT, 3).padStart(8)
  + ' | ' + f(a.Eesc, 4).padStart(8) + ' | ' + f(a.nuBar, 3).padStart(8) + ' | ' + f(a.peakNu, 3).padStart(8)
  + ' | ' + f(a.peakL, 3));
console.log(bad.length ? '**違反 ' + bad.length + ' 件**: ' + bad.join(' , ') : '違反 0 件');
console.log('→ ' + path.relative(ROOT, OUT));
process.exit(bad.length ? 1 : 0);
