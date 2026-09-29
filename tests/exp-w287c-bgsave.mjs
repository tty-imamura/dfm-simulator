// 第287便c(統括の検証項目 R109・第76報で閉じた AN40 の残りの残り)—— **セーブ経路の法則版の相互検査**の試験(Node だけ・正本は書かない)。
//
// 反例(第286便e まで): `loadSaveBgcAccept` は背景を受理器 validateBackgroundComplex と明示天体の突き合わせ・meshVelocity の相互検査に通すが、
// 法則版 lawVersion の経路の相互検査 `bgLawCrossCheck` を呼ばない —— プリセットとしては拒否される宣言(経路の無い法則版・較正クラス・
// centerSpin との併用)をセーブ経路では受理していた。第287便c で受理器が `bgLawCrossCheck(bgc, Object.assign({},DEFAULT_PHYSICS,ph), preset.sampleClass)`
// も呼ぶ(時間の契約の欠けもこの検査と meshVelocity の相互検査で拒否)。
//
// 事例(8 条件 + 欠落/null の 2 条件):
//   受理 … share-p1 の正しい宣言(🪁 の写し・静止一様背景)・complex-p2 の正しい宣言(🔁 に法則版の鍵)・法則版の未指定(🔁 のセーブそのまま)
//   拒否 … 経路の無い complex-p2(🪁 —— meshVelocity なし)・経路の無い share-p1(🔁 —— meshVelocity の本)・較正クラス(☄️ mercuryReal)・
//          centerSpin との併用(💮 clusterAnalogyBH)・時間微分のある背景で timeContract の欠け(🌒 の宣言から時間の契約を外す)
//   欠落(鍵なし)… 受理(present:false)/ null … 受理(present:true・backgroundComplex:null —— meshVelocity の無い本)
// 期待の拒否文は受理器をこの場で呼び直して作る(プリセットとしての拒否 = validatePreset の文に同じ文が含まれる)。
//
// 実行: node tests/exp-w287c-bgsave.mjs [html](既定 beta/index.html)。QA は behavior.loadSaveBgLaw(tests/qa.mjs)。
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
export const HARNESS_VERSION = 'w287c-bgsave-1';
const clone = (x) => JSON.parse(JSON.stringify(x));
const FR = { origin: 'barycenter', epoch: 't0(第287便c の試験)', rotation: 'none', translation: 'comoving' };

/** 受理器(HP.loadSaveBgcAccept が無い基点は大域の関数)。 */
function acceptor(HP) { return HP.loadSaveBgcAccept || globalThis.loadSaveBgcAccept || null; }

export function saveCases(HP) {
  const find = (id) => HP.allPresets().find((q) => q.id === id);
  const save = (id, f) => { const p = find(id); const s = { name: 'w287c', presetId: id, physics: clone(p.physics) }; if (f) f(s.physics); return s; };
  const U = (lv) => clone(HP.BGC_LAW_UNITS[lv]);
  const static1 = (W0) => ({ background: 'declared', note: '第287便c セーブの試験(静止一様背景)', W0, A0: [0, 0], gradW: [0, 0], gradA: [0, 0, 0, 0], dWdt: 0, dAdt: [0, 0],
    sources: [{ id: 'bg:uniform-static', kind: 'field', excludedExplicit: true }], frame: clone(FR),
    lawVersion: 'share-p1', lawUnits: U('share-p1'), lawDomainR: 1e5, lawWZero: 'vacuum' });
  const withP2 = (b) => Object.assign(clone(b), { lawVersion: 'complex-p2', lawUnits: U('complex-p2'), lawDomainR: 1e6, lawWZero: 'vacuum' });
  const merc = find('mercuryGeoToy3').physics.backgroundComplex;
  const C = [
    { key: 'p1', label: 'share-p1 の正しい宣言(🪁 の写し・静止一様背景 W=D₀)', want: true, s: save('galaxyMeshSpiralGeoToy', (ph) => { ph.backgroundComplex = static1(ph.D0); }) },
    { key: 'p2', label: 'complex-p2 の正しい宣言(🔁 に法則版の鍵)', want: true, s: save('mercuryGeoToy3', (ph) => { ph.backgroundComplex = withP2(merc); }) },
    { key: 'unspecified', label: '法則版の未指定(🔁 のセーブそのまま)', want: true, s: save('mercuryGeoToy3') },
    { key: 'p2NoPath', label: '経路の無い complex-p2(🪁 —— meshVelocity なし)', want: false, s: save('galaxyMeshSpiralGeoToy', (ph) => { ph.backgroundComplex = withP2(static1(ph.D0)); }), re: /meshVelocity/ },
    { key: 'p1NoPath', label: '経路の無い share-p1(🔁 —— meshVelocity の本)', want: false, s: save('mercuryGeoToy3', (ph) => { ph.backgroundComplex = Object.assign(clone(merc), { lawVersion: 'share-p1', lawUnits: U('share-p1'), lawDomainR: 1e6, lawWZero: 'vacuum' }); }), re: /share-p1/ },
    { key: 'calibration', label: '較正クラス(☄️ mercuryReal に share-p1)', want: false, s: save('mercuryReal', (ph) => { ph.backgroundComplex = static1(1); }), re: /calibration/ },
    { key: 'centerSpin', label: 'centerSpin との併用(💮 clusterAnalogyBH に share-p1)', want: false, s: save('clusterAnalogyBH', (ph) => { ph.backgroundComplex = static1(1.5); }), re: /centerSpin/ },
    { key: 'timeMissing', label: '時間微分のある背景で timeContract の欠け(🌒 から時間の契約を外す)', want: false, s: save('charonGeoToy3', (ph) => { delete ph.backgroundComplex.timeContract; }), re: /timeContract/ },
    { key: 'missing', label: '欠落(鍵なし —— 🪁)', want: true, s: save('galaxyMeshSpiralGeoToy', (ph) => { delete ph.backgroundComplex; }), present: false },
    { key: 'null', label: 'null(明示の未宣言 —— 🪁)', want: true, s: save('galaxyMeshSpiralGeoToy', (ph) => { ph.backgroundComplex = null; }), present: true }];
  const acc = acceptor(HP);
  return C.map((c) => {
    const r = acc(clone(c.s), find(c.s.presetId));
    // プリセットとしての判定(同じ宣言を本の physics に置いて validatePreset)—— 受理/拒否がセーブ経路と揃うか
    const P = clone(find(c.s.presetId)); P.physics = clone(c.s.physics); if (P.physics.backgroundComplex === null) delete P.physics.backgroundComplex;
    const vp = HP.validatePreset(P);
    const vpErr = vp.ok ? null : (Array.isArray(vp.errors) ? vp.errors.join('\n') : String(vp.err));
    const sameAsPreset = vp.ok === r.ok && (r.ok || (vpErr || '').indexOf(String(r.err).slice(0, 40)) >= 0);
    const ok = r.ok === c.want && (!c.re || (!r.ok && c.re.test(r.err))) && (c.present === undefined || r.present === c.present) && sameAsPreset;
    return { key: c.key, label: c.label, want: c.want, got: r.ok, present: r.present, err: r.ok ? null : r.err, presetOk: vp.ok, sameAsPreset, ok };
  });
}

const IS_MAIN = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (IS_MAIN) {
  const { loadHtmlMain } = await import('./lib-w280b-emgrid.mjs');
  const { HP } = loadHtmlMain(path.resolve(ROOT, process.argv[2] || 'beta/index.html'));
  const R = saveCases(HP);
  for (const r of R) console.log(`${r.ok ? 'ok ' : 'NG '} ${r.label}: 期待 ${r.want ? '受理' : '拒否'}・セーブ経路 ${r.got ? '受理' : '拒否'}・プリセット ${r.presetOk ? '受理' : '拒否'}${r.err ? '(' + String(r.err).slice(0, 70) + ')' : ''}`);
  console.log(`${R.filter((r) => r.ok).length}/${R.length}`);
}
