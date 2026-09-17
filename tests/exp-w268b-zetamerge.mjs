// 第268便b(第58報 W2・統括の読み (F)): **層融合の ζ 合成則は一般に回転源を保存しない**ことの
// 再現器。**直さない**(修正法則は次便の署名便) —— 反例が再現し続けることを数で置くだけである。
//
// ■ 何を測るのか
//   〔第265便c〕§2 は融合の ζ 合成則を「**回転場の源 Σ J/ζ を保つ**」と書いた
//   (ζ′=(J_a+J_b)/(J_a/ζ_a+J_b/ζ_b)。等しい ζ どうしはその ζ が残り、J の和か源の和が 0 で
//   定義できないときだけ ζ′=1 へ落ちる)。ところが融合後の源は **Q′=J′/ζ′** であり、
//   **ζ′>0 が要る**ので **sign(Q′)=sign(J′)** に縛られる。融合前の源 Σ J/ζ の符号が J の和の符号と
//   違う(あるいは片方だけ 0 の)ときは、**どんな有限の正の ζ′ でも表せない** —— 丸めや許容幅の
//   問題ではなく**表現の問題**である。
//
// ■ 3 つの測り方
//   ① **純関数の表**(`HP.dfmLayerMerge` をそのまま呼ぶ・用量は宣言)。
//   ② **総当たり**(J∈{−20…20 の 9 値}×ζ∈{0.25,0.5,1,2,4} の 2 層の全組 = 2025 組)で、
//      源が保たれない組を数える。**「たまに起きる」ではなく「どれだけ起きるか」を数で置く。**
//   ③ **エンジンで実際に融合させる**(〔第265便c〕の融合レシピと同型・逆回転の 2 体・600 步)。
//      純関数だけでなく合体経路でも源が消えることを確かめる。
//
// ■ この器がしないこと
//   ・合成則を**直さない**(`beta/index.html` を 1 バイトも書き換えない)。
//   ・`rule:"add"` を「解決」と呼ばない —— add でも同半径・層数上限の畳み込みで同じ zMerge が走る
//     ので、②の総当たりに **add 経由の畳み込み**も入れて数で示す。
//
// 使い方: PLAYWRIGHT_CORE_DIR=/opt/node22/lib/node_modules/playwright \
//         node tests/exp-w268b-zetamerge.mjs [beta/index.html]
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const TARGET = process.argv[2] || 'beta/index.html';
const OUT = process.env.W268B_OUT || path.join(ROOT, 'tests', 'out', 'zetamerge-w268b.json');
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
  const srcOf = (arr) => arr.reduce((a, L) => a + (Number(L.J) || 0) / zOf(L), 0);
  const sumJ = (arr) => arr.reduce((a, L) => a + (Number(L.J) || 0), 0);

  // ---------------------------------------------------------------- ① 純関数の表
  const CASES = [
    [10, 1, -10, 2], [10, 1, -15, 2], [10, 2, 20, 2], [10, 2, 20, 4],
    [10, 1, -10, 1], [10, 1, -5, 2], [10, 1, -20, 2], [10, 4, -10, 1],
  ];
  O.pure = CASES.map(([ja, za, jb, zb]) => {
    const A = [{ role: 'core', m: 10, r: 1, J: ja, inertiaScale: za }];
    const B = [{ role: 'core', m: 10, r: 1, J: jb, inertiaScale: zb }];
    const out = HP.dfmLayerMerge(A, B, 'role');
    const before = srcOf(A) + srcOf(B), after = srcOf(out);
    return { ja, za, jb, zb, before, Jafter: sumJ(out), zAfter: out[0] ? out[0].inertiaScale : null,
      after, delta: after - before, preserved: Object.is(after, before) };
  });

  // ---------------------------------------------------------------- ② 総当たり
  const JS = [-20, -15, -10, -5, 0, 5, 10, 15, 20], ZS = [0.25, 0.5, 1, 2, 4];
  const scan = (rule) => {
    let n = 0, ok = 0, signFlip = 0, vanish = 0, born = 0, other = 0;
    const worst = { rel: 0, at: null }, otherRows = [];
    for (const ja of JS) for (const za of ZS) for (const jb of JS) for (const zb of ZS) {
      // rule="add" でも**同じ半径**にすると層数の畳み込みで同じ zMerge が走る(r を揃える)
      const A = [{ role: 'core', m: 10, r: 1, J: ja, inertiaScale: za }];
      const B = [{ role: (rule === 'add') ? 'shell' : 'core', m: 10, r: 1, J: jb, inertiaScale: zb }];
      const out = HP.dfmLayerMerge(A, B, rule);
      const before = srcOf(A) + srcOf(B), after = srcOf(out);
      n++;
      if (Object.is(after, before)) { ok++; continue; }
      if (before !== 0 && after !== 0 && (before > 0) !== (after > 0)) signFlip++;
      else if (before !== 0 && after === 0) vanish++;
      else if (before === 0 && after !== 0) born++;
      else { other++; if (otherRows.length < 8) otherRows.push({ ja, za, jb, zb, before, after,
        rel: Math.abs(after / before - 1) }); }
      const rel = (before !== 0) ? Math.abs(after / before - 1) : Infinity;
      if (rel > worst.rel) { worst.rel = rel; worst.at = { ja, za, jb, zb, before, after }; }
    }
    return { rule, n, ok, broken: n - ok, signFlip, vanish, born, other, otherRows,
      worstRel: Number.isFinite(worst.rel) ? worst.rel : 'Infinity', worstAt: worst.at };
  };
  O.scan = [scan('role'), scan('add')];

  // ---------------------------------------------------------------- ③ エンジンの融合経路
  // 〔第265便c〕の融合レシピと同型。**core 層だけ逆回転・ζ が違う**・shell 層は明示ゼロ。
  const LA = [{ role: 'core', m: 90, r: 2, J: 10, inertiaScale: 1 }, { role: 'shell', m: 10, r: 10, J: 0 }];
  const LB = [{ role: 'core', m: 45, r: 1.5, J: -10, inertiaScale: 2 }, { role: 'shell', m: 5, r: 8, J: 0 }];
  const pr = {
    id: 'w268bFuse', name: 'w268bFuse', emoji: '🧪', description: 'ζ 合成則の反例の器。',
    camera: { scale: 300 }, world: { boundary: 'none', size: 0 }, seed: 1,
    physics: { G: 1, D0: 0, kFrame: 0, q: 2, kRep: 0, muF: 0, gammaN: 0, kappaS: 0, kappaT: 1 / 60,
      cLight: 30, contactK: 0, contactCap: 0, bM: 1, etaRad: 0, pRad: 4, gravityX: 0, gravityY: 0,
      geoPN: 0, lambdaPN: 1, pnAlpha: 1.5, radiusScale: 1, softening: 0.5, timeScale: 1, spinSpin: 1e6 },
    bodies: [
      { type: 'single', m: 100, radius: 3, x: -6, y: 0, vx: 0.5, vy: 0, spin: 0, pinned: false, layers: LA },
      { type: 'single', m: 50, radius: 3, x: 6, y: 0, vx: -0.5, vy: 0.2, spin: 0, pinned: false, layers: LB }],
    fusion: { dFrac: 0.7 }, thermal: 'tint', overlays: {} };
  const v = HP.validatePreset(pr);
  const S = HP.sim; S.build(v.preset);
  const q0 = HP.dfmLayerDipoleMoment(0, S), q1 = HP.dfmLayerDipoleMoment(1, S);
  let fusedAt = -1;
  for (let k = 0; k < 600; k++) { S.step(0.016); if (S.n === 1 && fusedAt < 0) fusedAt = k + 1; }
  const round = S.bodyLayersOf(0) || [];
  O.engine = { n: S.n, fusedAt, steps: 600, dt: 0.016,
    before: { qA: q0, qB: q1, sum: q0 + q1 },
    after: { q: HP.dfmLayerDipoleMoment(0, S), spinQ: HP.dfmSpinDipoleMoment(0, S),
      layers: round.map((L) => ({ role: L.role, m: L.m, r: L.r, J: L.J, zeta: L.inertiaScale })) },
    nan: [S.x[0], S.y[0], S.vx[0], S.vy[0]].filter((z) => !Number.isFinite(z)).length };
  O.engine.delta = O.engine.after.q - O.engine.before.sum;
  return O;
});

await browser.close();

// ---------------------------------------------------------------- 突き合わせ(反例が**再現している**こと)
const bad = [];
const c = (i) => R.pure[i];
if (!(c(0).before === 5 && c(0).after === 0)) bad.push('①(10,1)+(−10,2) が 5 → 0 でない');
if (!(c(1).before === 2.5 && c(1).after === -5)) bad.push('①(10,1)+(−15,2) が 2.5 → −5 でない');
if (!(c(2).preserved && c(3).preserved)) bad.push('①同方向の 2 例が一致していない(反例の対照が壊れている)');
for (const s of R.scan) {
  if (!(s.broken > 0)) bad.push(`②rule=${s.rule} で反例が 0 件(合成則が変わった → QA を書き換える)`);
  if (s.n !== 2025) bad.push(`②rule=${s.rule} の組が 2025 でない(${s.n})`);
}
if (!(R.engine.n === 1 && R.engine.fusedAt > 0)) bad.push('③エンジンで融合していない');
if (!(R.engine.before.sum === 5 && R.engine.after.q === 0)) bad.push('③融合の前後で 5 → 0 になっていない');
if (R.engine.nan) bad.push('③NaN が出ている');
if (pageErrors.length) bad.push('pageerror: ' + pageErrors.slice(0, 2).join(' / '));

const out = { when: new Date().toISOString(), wave: '第268便b(第58報 W2・統括の読み (F))',
  target: TARGET, ...R, violations: bad };
fs.mkdirSync(path.dirname(OUT), { recursive: true });
fs.writeFileSync(OUT, JSON.stringify(out, null, 1));

const f = (x) => (Number.isFinite(x) ? String(x) : String(x));
console.log('[w268b] 層融合の ζ 合成則 —— **回転源は一般に保存されない**(再現器・直していない)');
console.log('  ① 純関数 dfmLayerMerge(rule="role")');
console.log('     (J_a,ζ_a) + (J_b,ζ_b) | 融合前 ΣJ/ζ | 融合後 J′ | 融合後 ζ′ | 融合後 Q′=J′/ζ′ | 保存');
for (const p of R.pure) {
  console.log('     (' + p.ja + ',' + p.za + ') + (' + p.jb + ',' + p.zb + ')'.padEnd(4)
    + ' | ' + f(p.before).padStart(8) + ' | ' + f(p.Jafter).padStart(6) + ' | '
    + f(p.zAfter).padStart(8) + ' | ' + f(p.after).padStart(8) + ' | ' + (p.preserved ? '保存' : '**壊れる**'));
}
console.log('  ② 総当たり(J 9 値 × ζ 5 値 の 2 層・全組)');
for (const s of R.scan) {
  console.log('     rule=' + s.rule.padEnd(5) + ' 組 ' + s.n + ' / 保存 ' + s.ok + ' / **壊れる ' + s.broken
    + '**(符号反転 ' + s.signFlip + ' ・源が消える ' + s.vanish + ' ・源が湧く ' + s.born
    + ' ・丸めだけ ' + s.other + ')');
  if (s.otherRows.length) console.log('       丸めだけの例: ' + s.otherRows.slice(0, 2)
    .map((r) => '(' + r.ja + ',' + r.za + ')+(' + r.jb + ',' + r.zb + ') ' + r.before + ' → ' + r.after
      + '(相対 ' + r.rel.toExponential(2) + ')').join(' / '));
}
console.log('  ③ エンジンの融合経路(逆回転の 2 体・600 步・dt=0.016)');
console.log('     融合 ' + (R.engine.fusedAt > 0 ? R.engine.fusedAt + ' 步目' : 'せず')
  + ' / 融合前 Q_A=' + R.engine.before.qA + ' + Q_B=' + R.engine.before.qB + ' = ' + R.engine.before.sum
  + ' / 融合後 Q=' + R.engine.after.q + '(差 ' + R.engine.delta + ')・NaN ' + R.engine.nan);
console.log('     融合後の層: ' + JSON.stringify(R.engine.after.layers));
console.log(bad.length ? '  **違反 ' + bad.length + ' 件**: ' + bad.join(' , ') : '  違反 0 件(反例は再現している)');
console.log('→ ' + path.relative(ROOT, OUT));
process.exit(bad.length ? 1 : 0);
