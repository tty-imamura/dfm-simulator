// 第283便b(原仮定者の裁定(第73報)④「同一天体の似た内容のサンプルを統廃合する(内容を比較して提案)」・統括の検証項目 R85):
// **同一天体の家族の差分表と統廃合の候補**の器(と、退役 7 本の棚卸し —— R84)。
//
// ■ 何をするか(Node だけ —— 対象 html の inline script を tests/lib-w279b-headless.mjs で読む。1 步も走らせない)
//   ① 家族の定義(下の FAMILIES —— 同じ天体・同じ主題の本の集まり)を宣言する。
//   ② 各家族の各本について、**受理後の実効 JSON**(`validatePreset(p).preset` —— 既定値の補完・丸め・移行の後)から
//      鍵ごとの値を機械で抜く: physics.*(geoPN・kFrame・D0・D0pull・q ほか全鍵)・bodies の m / 位置 / 速度が基準の本と同じか・
//      massCalibration(law と f)・relativeDrag・spaceMesh・qLock・目的(SAMPLE_STATUS の purpose)・門(claims の testId)・
//      sampleClass・較正の派生値(calVariantOf —— kF0 版 / DFM 版)・較正母集団か(calaudit の verdictLedger)。
//   ③ 家族の中で**値が違う鍵**を列挙し、各本に「同じ入力 / 違う入力」(基準の本と bodies が同じか)と
//      推定の列「主系列 / 比較 / 診断 / 履歴」(規則は RULES —— 推定であって裁定ではない)を付ける。
//   ④ **統廃合の候補**(残す ID・畳む ID・理由)を規則で出す。**候補であって実行ではない**(実行は原仮定者の裁定)。
//      **観測版と DFM 版を 1 ID にしない**(kF0 版と DFM 版の組は「畳まない組」として別に並べる)。
//   ⑤ 退役 7 本(familyRole:"retired")の棚卸し: 内蔵に残っていること・凍結の写し(tests/fixtures/retired-w283b.json)と
//      presetSigHash が同じこと・7 本の ID を名指しする器(tests/*.mjs・tools/*.mjs)と再生成表の段の対応。
//   ⑥ 一覧 docs/FAMILIES_v1.45.md(**生成物 —— 手で直さない**)を書く。QA docs.families が正本から作り直して 1 字ずつ照合する。
//
// ■ しないこと: 走らせない・判定しない・html を変えない・プリセットを畳まない(候補を出すだけ)。
//   「観測一致を達成した」「較正を完了した」「統合した」とは書かない。
//
// 環境変数: なし(`QA_TARGET` で対象 html を替えられる —— 既定 beta/index.html)。
// 実行: node tests/exp-w283b-families.mjs            … 正本と md を書く
//       node tests/exp-w283b-families.mjs --check    … 何も書かずに md と正本が今の html から作ったものと同じかを見る
// 読む正本: tests/out/calaudit-w249.json(較正母集団 —— 再生成表の after)・tests/fixtures/retired-w283b.json(凍結の写し)
// 正本: tests/out/families-w283b.json(来歴 w272e-1・target = beta/index.html・領域 hash REGEN_SCOPE)
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { loadHtmlHeadless } from './lib-w279b-headless.mjs';
import { provenanceMeta } from './lib-w272e-provenance.mjs';
import { FORBIDDEN as SS_FORBIDDEN } from './lib-w279a-samplestatus.mjs';
// 第281便a(AN16・R71): **この器が読む html の領域**の宣言(1 行の JSON —— lint.regenScope が読む)。
//   presets は "all"(全本を走査する)・consts は**説明文の欄(PROSE_KEYS)のうちこの器が読むもの**(絵文字・名前・familyRole)を
//   領域に入れるための式(PROSE_KEYS は領域 hash から外れるので、宣言しないと familyRole だけの変更で「再利用」になってしまう)。
import { scopeStamp as w281aScopeStamp, stableInputs as w281aStableInputs } from './lib-w281a-scope.mjs';
import { REGEN_STEPS } from './lib-w281a-regentable.mjs';
const REGEN_SCOPE = {"presets":"all","roots":["$","FAMILY_ROLES","FAMILY_VARIANT_LABEL","HP.allPresets","HP.validatePreset","RETIRED_PRESETS","SAMPLE_STATUS","calVariantOf","HP.sim","ctx","presetSigHash"],"core":false,"consts":["BUILTIN_PRESETS.map((p)=>[p.id,p.emoji||null,p.name||null,p.familyRole||null])"],"complete":true};

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
export const HARNESS_VERSION = 'w283b-families-1';
export const OUT = 'tests/out/families-w283b.json';
export const MD = 'docs/FAMILIES_v1.45.md';
export const CAL = 'tests/out/calaudit-w249.json';
export const RETIRED_FX = 'tests/fixtures/retired-w283b.json';

/** 家族の宣言(並びは表の並び・ref は差を測る基準の本 —— 入口〔primary〕か、較正母集団の代表)。 */
export const FAMILIES = [
  { key: 'pluto', ja: '冥王星–カロン', ref: 'plutoCharonReal',
    ids: ['plutoCharonReal', 'plutoCharonDFM', 'plutoCharonKF0Control', 'plutoCharonDiagInput', 'plutoCharonSyncZero', 'charonGeoToy3'] },
  { key: 'earthmoon', ja: '地球–月(現実との照合)', ref: 'earthMoonRealKF1',
    ids: ['earthMoonRealKF1', 'earthMoonReal', 'emAuditNewton', 'emAuditDFM', 'emAuditSolar', 'earthMoonDiagOne'] },
  { key: 'mercury', ja: '水星(現実との照合)', ref: 'mercuryRealKF1', ids: ['mercuryRealKF1', 'mercuryReal', 'mercuryGeoToy3'] },
  { key: 'saturn', ja: '土星(現実との照合)', ref: 'saturnRingRealKF1',
    ids: ['saturnRingRealKF1', 'saturnRingReal', 'saturnZonalD68', 'saturnD68Consistent', 'saturnD68ObsOrbit'] },
  { key: 'psrDoubleAB', ja: '二重パルサー J0737−3039', ref: 'psrDoubleABDFM',
    ids: ['psrDoubleABDFM', 'psrDoubleAB', 'psrDoubleABSpinCal', 'psrDoubleABPN', 'psrDoubleABCF', 'psrDoubleABGeoToy'] },
  { key: 'psrJ1757', ja: 'パルサー J1757−1854', ref: 'psrJ1757DFM', ids: ['psrJ1757DFM', 'psrJ1757PN', 'psrJ1757CF'] },
  { key: 'psrJ1946', ja: 'パルサー J1946+2052', ref: 'psrJ1946DFM', ids: ['psrJ1946DFM', 'psrJ1946PN', 'psrJ1946CF'] },
  { key: 'psrB1534', ja: 'パルサー B1534+12', ref: 'psrB1534', ids: ['psrB1534', 'psrB1534DFM', 'psrB1534CF'] },
  { key: 'gw150914', ja: '重力波 GW150914', ref: 'gw150914DFM', ids: ['gw150914DFM', 'gw150914', 'gw150914Merge4s', 'gw150914SpinDipole'] },
  { key: 'alphaCen', ja: 'ケンタウルス座 α 星 AB', ref: 'alphaCenABDFM', ids: ['alphaCenABDFM', 'alphaCenAB'] },
  { key: 'sirius', ja: 'シリウス AB', ref: 'siriusABDFM', ids: ['siriusABDFM', 'siriusAB'] },
  { key: 'galaxyMesh', ja: '銀河回転(空間メッシュ・アナロジー)', ref: 'galaxyMeshSpiral',
    ids: ['galaxyMeshSpiral', 'galaxyMeshSpiralGeoToy', 'galaxyMeshSpiralGeoToyLite', 'galaxyAnalogyBH'] },
  { key: 'galaxyrot', ja: '銀河の回転曲線 4 本', ref: 'galaxy', ids: ['galaxy', 'galaxyStd', 'galaxyGeo2', 'galaxyDB'] },
  { key: 'tuc47', ja: '球状星団 47 Tuc', ref: 'tuc47DFM', ids: ['tuc47DFM', 'tuc47'] },
  { key: 'ngc3198', ja: '渦巻銀河 NGC 3198', ref: 'ngc3198DFM', ids: ['ngc3198DFM', 'ngc3198'] },
  { key: 'shapeToy', ja: '形の玩具 6 本', ref: 'shapeToyCluster',
    ids: ['shapeToyCluster', 'shapeToyDisk', 'shapeToyArm', 'shapeToyClusterCore', 'shapeToyDiskCore', 'shapeToyArmCore'] },
  { key: 'supernova', ja: '超新星の親星', ref: 'supernovaProgDFM', ids: ['supernovaProgDFM', 'supernovaProg'] },
  { key: 'whiteDwarf', ja: '白色矮星', ref: 'whiteDwarfDFM', ids: ['whiteDwarfDFM', 'whiteDwarfBareDFM'] },
  { key: 'saturnToy', ja: '土星(天体の機構)', ref: 'saturn', ids: ['saturn', 'saturnLayered'] },
  { key: 'grcal', ja: '時計と重力(GR の較正)', ref: 'grcal', ids: ['grcal', 'grcalGps', 'grcalLight', 'grcalShapiro'] },
  { key: 'rotor', ja: 'ダークローター(退役の文脈)', ref: 'rotorSolo',
    ids: ['rotorSolo', 'massLadder', 'selfRotor', 'darkrotor', 'bhCore', 'bhCoreTilt', 'nebulaRotor', 'nebulaShell', 'nebulaBipolar', 'starSeed'] },
];

/** 推定の列と候補の規則(文言は md にそのまま出す —— 推定であって裁定ではない)。 */
export const RULES = {
  role: [
    '履歴 = familyRole が "retired"(退役 —— 内蔵に残るが一覧に出ない)',
    '主系列 = 較正母集団(calaudit の verdictLedger)に入る本。母集団の外の家族では入口(familyRole "primary")',
    '診断 = 母集団の外で sampleClass が "principle" の本のうち、geoPN=3 か、名前・目的・役割名に「診断・対照・零・コピー」を含むもの',
    '比較 = それ以外(同じ主題の別の条件・別の模型)',
  ],
  candidate: [
    'A(同じ入力の診断): 推定「診断」の本で、bodies の質量・位置・速度が家族の「主系列」の本と同じもの → 主系列の本を残し、診断は器の中の写し(走行設定)として残して内蔵 ID は畳む候補',
    'B(同一の実効 JSON): 説明文の欄以外(physics・bodies・その他の実効の鍵)がすべて同じ 2 本 → 1 本に畳む候補',
    'C(系列の法則違い): 較正母集団の本どうしで bodies が同じ・較正の派生値も同じ・physics の法則の鍵だけ違う組 → 「1 本 + 法則の切替」に畳めるかは要裁定(候補の印だけ)',
    '畳まない組: 較正の派生値が kF0 版と DFM 版で違う組(観測版と DFM 版を 1 ID にしない)',
  ],
};

/** 説明文の欄(差の表から外す —— 実効の入力ではない)。 */
const PROSE = new Set(['id', 'name', 'emoji', 'group', 'descStruct', 'en', 'description', 'status', 'notClaim', 'obsCard',
  'failureFirst', 'parameterAudit', 'fidelity', 'familyId', 'familyRole', 'catalog', 'scaleTier', 'sampleClass', 'claims',
  'emergence', 'stdTests', 'stdTestsRef', 'calibrationForecast', 'referenceKind', 'activeParams', 'camera', 'overlays',
  'probeHud', 'conductionHud', 'validT', 'orbitObs', 'abBody', 'abQuick', 'phaseMap', 'balanceFrame', 'massLedger']);

const canon = (v) => JSON.stringify(v, (k, x) => (x && typeof x === 'object' && !Array.isArray(x))
  ? Object.fromEntries(Object.keys(x).sort().map((z) => [z, x[z]])) : x);
const same = (a, b) => canon(a) === canon(b);
const clone = (o) => JSON.parse(JSON.stringify(o));
const DIAG_RE = /診断|対照|零|コピー/;

/** bodies を「質量・位置・速度・その他」に分けて比べる(本数が違えば全部「違う」)。 */
export function bodiesDiff(A, B) {
  if (!Array.isArray(A) || !Array.isArray(B) || A.length !== B.length) return { count: false, m: false, x: false, v: false, other: false };
  const pick = (b, ks) => ks.map((k) => (b[k] === undefined ? null : b[k]));
  const MK = ['m', 'mass'], XK = ['x', 'y', 'r', 'rIn', 'rOut', 'cx', 'cy', 'a', 'e'], VK = ['vx', 'vy', 'v', 'vr', 'vt', 'aroundMass'];
  let m = true, x = true, v = true, other = true;
  for (let i = 0; i < A.length; i++) {
    if (!same(pick(A[i], MK), pick(B[i], MK))) m = false;
    if (!same(pick(A[i], XK), pick(B[i], XK))) x = false;
    if (!same(pick(A[i], VK), pick(B[i], VK))) v = false;
    const rest = (b) => Object.fromEntries(Object.keys(b).filter((k) => !MK.concat(XK, VK).includes(k)).sort().map((k) => [k, b[k]]));
    if (!same(rest(A[i]), rest(B[i]))) other = false;
  }
  return { count: true, m, x, v, other };
}

/** 本 1 つの行(受理後の実効 JSON から)。 */
export function memberRow(ctx, id) {
  const { HP, SS, FVL, calVariantOf, presetSigHash, population } = ctx;
  const p = HP.allPresets().find((q) => q.id === id);
  if (!p) return { id, missing: true };
  const v = HP.validatePreset(clone(p));
  const q = v.ok ? v.preset : clone(p);
  const ph = q.physics || {};
  const mc = (q.massCalibration && typeof q.massCalibration === 'object') ? q.massCalibration : null;
  const f = mc ? (Number.isFinite(mc.factor) ? mc.factor : Number.isFinite(mc.factorUniform) ? mc.factorUniform : Number.isFinite(mc.f) ? mc.f : null) : null;
  const st = SS[id] || null;
  const vl = FVL[id] ? FVL[id].ja : null;
  const gates = Array.isArray(p.claims) ? [...new Set(p.claims.map((c) => c.testId).filter(Boolean))].sort() : [];
  return {
    id, emoji: p.emoji || '', name: p.name, familyId: p.familyId || null, familyRole: p.familyRole || null,
    retired: p.familyRole === 'retired', sampleClass: p.sampleClass || null, catalog: p.catalog || null, group: p.group,
    calVariant: calVariantOf(p) || null, inPopulation: population.has(id), variantLabel: vl,
    geoPN: ph.geoPN, kFrame: ph.kFrame, D0: ph.D0, D0pull: ph.D0pull === undefined ? null : ph.D0pull, q: ph.q,
    qLock: q.qLock ? true : false,
    massCalibration: mc ? { law: mc.law || null, f } : null,
    relativeDrag: ph.relativeDrag ? (ph.relativeDrag.law || true) : null,
    spaceMesh: ph.spaceMesh ? (ph.spaceMesh.mode || true) : null,
    purpose: st ? st.purpose : null, gates, presetSigHash: presetSigHash(p), accepted: v.ok,
    _q: q,
  };
}

/** 推定の列(RULES.role)。 */
export function roleOf(r, fam) {
  if (r.retired) return { role: '履歴', why: 'familyRole "retired"' };
  if (r.inPopulation) return { role: '主系列', why: '較正母集団' };
  const anyPop = fam.rows.some((z) => z.inPopulation);
  const text = [r.name, r.purpose || '', r.variantLabel || ''].join(' ');
  if (r.sampleClass === 'principle' && (r.geoPN === 3 || DIAG_RE.test(text)) && (anyPop || r.familyRole !== 'primary'))
    return { role: '診断', why: r.geoPN === 3 ? 'principle・geoPN=3' : 'principle・「' + (text.match(DIAG_RE) || [''])[0] + '」' };
  if (!anyPop && r.familyRole === 'primary') return { role: '主系列', why: '母集団の外の家族の入口(primary)' };
  if (!anyPop && fam.ref === r.id) return { role: '主系列', why: '母集団の外の家族の基準の本' };
  return { role: '比較', why: '上のどれでもない' };
}

/** 家族 1 つの表。 */
export function familyTable(ctx, F) {
  const rows = F.ids.map((id) => memberRow(ctx, id));
  const fam = { key: F.key, ja: F.ja, ref: F.ref, ids: F.ids, rows };
  const ref = rows.find((r) => r.id === F.ref);
  for (const r of rows) {
    if (r.missing) continue;
    const ro = roleOf(r, fam); r.roleEst = ro.role; r.roleWhy = ro.why;
    if (r.id === F.ref) { r.input = '基準'; r.vsRef = null; continue; }
    const bd = bodiesDiff(ref._q.bodies, r._q.bodies);
    const phA = ref._q.physics || {}, phB = r._q.physics || {};
    const physicsDiff = [...new Set(Object.keys(phA).concat(Object.keys(phB)))].filter((k) => !same(phA[k], phB[k])).sort();
    const topKeys = [...new Set(Object.keys(ref._q).concat(Object.keys(r._q)))].filter((k) => !PROSE.has(k) && k !== 'physics' && k !== 'bodies');
    const topDiff = topKeys.filter((k) => !same(ref._q[k], r._q[k])).sort();
    const sameInput = bd.count && bd.m && bd.x && bd.v;
    r.vsRef = { bodies: bd, physicsDiff, topDiff };
    r.input = sameInput ? '同じ入力' : '違う入力(' + ['count', 'm', 'x', 'v'].filter((k) => !bd[k]).map((k) => ({ count: '本数', m: '質量', x: '位置', v: '速度' })[k]).join('・') + ')';
  }
  // 家族の中で値が違う鍵(physics.* と実効の鍵・宣言の欄)
  const live = rows.filter((r) => !r.missing);
  const keyDiff = [];
  const phKeys = [...new Set(live.flatMap((r) => Object.keys(r._q.physics || {})))].sort();
  for (const k of phKeys) {
    const vals = Object.fromEntries(live.map((r) => [r.id, (r._q.physics || {})[k] === undefined ? null : (r._q.physics || {})[k]]));
    if (new Set(Object.values(vals).map(canon)).size > 1) keyDiff.push({ key: 'physics.' + k, values: vals });
  }
  const tk = [...new Set(live.flatMap((r) => Object.keys(r._q)))].filter((k) => !PROSE.has(k) && k !== 'physics' && k !== 'bodies').sort();
  for (const k of tk) {
    const vals = Object.fromEntries(live.map((r) => [r.id, r._q[k] === undefined ? null : r._q[k]]));
    if (new Set(Object.values(vals).map(canon)).size > 1) keyDiff.push({ key: k, values: Object.fromEntries(Object.entries(vals).map(([i, x]) => [i, x === null ? null : (typeof x === 'object' ? '(宣言あり)' : x)])) });
  }
  for (const k of ['sampleClass', 'calVariant', 'familyRole']) {
    const vals = Object.fromEntries(live.map((r) => [r.id, r[k]]));
    if (new Set(Object.values(vals).map(canon)).size > 1) keyDiff.push({ key: k, values: vals });
  }
  { const vals = Object.fromEntries(live.map((r) => [r.id, r.gates.join(',') || null]));
    if (new Set(Object.values(vals)).size > 1) keyDiff.push({ key: 'gates(testId)', values: vals }); }
  { const vals = Object.fromEntries(live.map((r) => [r.id, r.id === F.ref ? '基準' : r.input]));
    keyDiff.push({ key: 'bodies(vs 基準)', values: vals }); }
  fam.keyDiff = keyDiff;
  fam.physicsSameKeys = phKeys.length - keyDiff.filter((z) => z.key.startsWith('physics.')).length;
  // 候補
  const cand = [], keepApart = [];
  const pop = live.filter((r) => r.roleEst === '主系列' && !r.retired);
  for (const r of live) {
    if (r.retired || r.roleEst !== '診断') continue;
    const host = [ref].concat(pop).find((z) => z && z.id !== r.id && !z.retired && (() => { const b = bodiesDiff(z._q.bodies, r._q.bodies); return b.count && b.m && b.x && b.v; })());
    if (host) {
      const phA = host._q.physics || {}, phB = r._q.physics || {};
      const d = [...new Set(Object.keys(phA).concat(Object.keys(phB)))].filter((k) => !same(phA[k], phB[k])).sort();
      cand.push({ rule: 'A', keep: host.id, fold: [r.id], how: '器の中の写し(走行設定)として残し、内蔵 ID は畳む',
        reason: `bodies(質量・位置・速度)が ${host.id} と同じ・違うのは physics の ${d.join('・') || '(なし)'}` });
    }
  }
  for (let i = 0; i < live.length; i++) for (let j = i + 1; j < live.length; j++) {
    const a = live[i], b = live[j];
    if (a.retired || b.retired) continue;
    const eff = (r) => Object.fromEntries(Object.keys(r._q).filter((k) => !PROSE.has(k)).sort().map((k) => [k, r._q[k]]));
    if (same(eff(a), eff(b))) {
      const keep = (b.inPopulation && !a.inPopulation) || (b.familyRole === 'primary') ? b : a;
      cand.push({ rule: 'B', keep: keep.id, fold: [keep === a ? b.id : a.id], how: '1 本に畳む', reason: '説明文の欄以外の実効 JSON がすべて同じ' });
    }
    if (a.calVariant && b.calVariant && a.calVariant !== b.calVariant) {
      const bd = bodiesDiff(a._q.bodies, b._q.bodies);
      keepApart.push({ pair: [a.id, b.id], why: `較正の派生値 ${a.calVariant} / ${b.calVariant}(観測版と DFM 版を 1 ID にしない)`
        + (bd.count && bd.m && bd.x && bd.v ? '・bodies は同じ' : '') });
    }
    if (a.inPopulation && b.inPopulation && a.calVariant && a.calVariant === b.calVariant) {
      const bd = bodiesDiff(a._q.bodies, b._q.bodies);
      if (bd.count && bd.m && bd.x && bd.v) {
        const phA = a._q.physics || {}, phB = b._q.physics || {};
        const d = [...new Set(Object.keys(phA).concat(Object.keys(phB)))].filter((k) => !same(phA[k], phB[k])).sort();
        if (d.length) cand.push({ rule: 'C', keep: null, fold: [a.id, b.id], how: '要裁定(1 本 + 法則の切替に畳めるか)',
          reason: `同じ bodies・同じ派生値 ${a.calVariant}・違うのは physics の ${d.join('・')}` });
      }
    }
  }
  fam.candidates = cand;
  fam.keepApart = keepApart;
  fam.history = live.filter((r) => r.retired).map((r) => r.id);
  for (const r of rows) delete r._q;
  return fam;
}

/** 退役 7 本の棚卸し(内蔵・凍結の写し・名指しする器と再生成表の段)。 */
export function retiredInventory(ctx) {
  const { HP, presetSigHash, root } = ctx;
  const FX = JSON.parse(fs.readFileSync(path.join(root, RETIRED_FX), 'utf8'));
  const ids = HP.allPresets().filter((p) => p.familyRole === 'retired').map((p) => p.id);
  const presets = FX.ids.map((id) => {
    const p = HP.allPresets().find((q) => q.id === id);
    return { id, emoji: p ? p.emoji : null, inBuiltin: !!p, retired: !!(p && p.familyRole === 'retired'),
      sigBuiltin: p ? presetSigHash(p) : null, sigFixture: FX.presets[id].presetSigHash,
      sigFixtureNow: presetSigHash(FX.presets[id].raw) };
  });
  const files = fs.readdirSync(path.join(root, 'tests')).filter((f) => /\.mjs$/.test(f)).map((f) => 'tests/' + f)
    .concat(fs.readdirSync(path.join(root, 'tools')).filter((f) => /\.mjs$/.test(f)).map((f) => 'tools/' + f)).sort();
  const harnesses = [];
  for (const f of files) {
    if (f === 'tests/qa.mjs' || f === 'tests/exp-w283b-families.mjs' || f === 'tests/exp-w283b-retiredfx.mjs' || f === 'tests/lib-w281a-regentable.mjs') continue;   // 表そのもの・この便の器は数えない
    const text = fs.readFileSync(path.join(root, f), 'utf8');
    const hit = FX.ids.filter((id) => new RegExp('\\b' + id + '\\b').test(text));
    if (!hit.length) continue;
    const steps = REGEN_STEPS.filter((z) => z.cmd.indexOf(f) >= 0).map((z) => ({ key: z.key, role: z.role }));
    const usesFixture = text.indexOf('retired-w283b.json') >= 0;
    const kind = usesFixture ? 'fixture' : steps.some((z) => z.role === 'history') ? 'history'
      : steps.length ? 'current' : /^tests\/(perf|probe-)/.test(f) || /jitprobe|canvasskin/.test(f) ? 'tool' : 'not-in-table';
    harnesses.push({ file: f, ids: hit, steps, kind });
  }
  const qaText = fs.readFileSync(path.join(root, 'tests', 'qa.mjs'), 'utf8');
  const qaRefs = Object.fromEntries(FX.ids.map((id) => [id, (qaText.match(new RegExp('\\b' + id + '\\b', 'g')) || []).length]));
  return { ids, fixture: { file: RETIRED_FX, version: FX.fixtureVersion, source: FX.source, gateRemovedTests: FX.history.tests.map((t) => t.id),
    gateRemovedUnits: Object.keys(FX.history.gateRemovedUnits), gateRemovedWorkerMs: FX.history.gateRemovedWorkerMs, mechanism: FX.mechanism },
  presets, harnesses, qaRefs,
  kindCounts: harnesses.reduce((a, h) => { a[h.kind] = (a[h.kind] || 0) + 1; return a; }, {}) };
}

// ---- md(生成物 —— QA docs.families がこの関数で作り直して照合する)
const esc = (s) => String(s === null || s === undefined ? '—' : s).replace(/\|/g, '\\|');
const fv = (x) => (x === null || x === undefined) ? '—' : (typeof x === 'number' ? String(x) : String(x));
export const MD_FORBIDDEN = new RegExp(SS_FORBIDDEN.source + '|統合した|畳んだ|較正を完了|観測一致を達成|f=1 で合った|kF0 版が成立した|形状が安定した|腕が創発した');
export function renderMd(J) {
  const L = [];
  L.push('# 同一天体の家族の差分表と統廃合の候補(v1.45-b1・第283便b)');
  L.push('');
  L.push('> **この文書は生成物である —— 手で直さない。** 器 `tests/exp-w283b-families.mjs` が、対象 html の内蔵プリセットを受理した後の実効 JSON(`validatePreset` の後)と、正本 `' + CAL + '`(較正母集団)・凍結の写し `' + RETIRED_FX + '` から作る。QA `docs.families` が正本からこの文書を作り直して 1 字ずつ照合する。');
  L.push('> 原仮定者の裁定(第73報)④「同一天体の似た内容のサンプルを統廃合する(内容を比較して提案)」への対応(統括の検証項目 R85)。**ここに並ぶのは候補であって実行ではない** —— どの本を畳むかは原仮定者の裁定で決める。観測版と DFM 版は 1 ID にしない。');
  L.push('');
  L.push('## 読み方');
  L.push('');
  L.push('- **入力**: 家族の基準の本(表の「基準」)と比べて、bodies の本数・質量・位置・速度がすべて同じなら「同じ入力」、どれかが違えば「違う入力(違う欄)」。');
  L.push('- **推定の列**(規則による推定であって裁定ではない):');
  for (const r of J.rules.role) L.push('  - ' + r);
  L.push('- **候補の規則**:');
  for (const r of J.rules.candidate) L.push('  - ' + r);
  L.push('- **鍵ごとの差**: 家族の中で値が違う鍵だけを並べる(physics の同じ鍵の数は見出しの行に書く)。bodies は基準との比較の語。');
  L.push('');
  L.push('## 集計');
  L.push('');
  const c = J.counts;
  L.push(`- 家族 **${c.families}**・本 **${c.members}**(うち退役 ${c.retiredMembers})・推定の列: 主系列 ${c.role['主系列'] || 0}・比較 ${c.role['比較'] || 0}・診断 ${c.role['診断'] || 0}・履歴 ${c.role['履歴'] || 0}。`);
  L.push(`- 候補: 規則 A ${c.cand.A || 0}・規則 B ${c.cand.B || 0}・規則 C(要裁定)${c.cand.C || 0}・畳まない組 ${c.keepApart}。`);
  L.push('');
  L.push('| 家族 | 本数 | 基準 | 主系列 | 比較 | 診断 | 履歴 | 候補 A/B/C | 畳まない組 |');
  L.push('|---|---|---|---|---|---|---|---|---|');
  for (const F of J.families) {
    const n = (k) => F.rows.filter((r) => r.roleEst === k).length;
    const cc = (k) => F.candidates.filter((z) => z.rule === k).length;
    L.push(`| ${esc(F.ja)}(\`${F.key}\`) | ${F.rows.length} | \`${F.ref}\` | ${n('主系列')} | ${n('比較')} | ${n('診断')} | ${n('履歴')} | ${cc('A')}/${cc('B')}/${cc('C')} | ${F.keepApart.length} |`);
  }
  L.push('');
  for (const F of J.families) {
    L.push(`## ${F.ja}(\`${F.key}\`・${F.rows.length} 本)`);
    L.push('');
    L.push('| 絵文字 | ID | familyRole | 推定の列 | 入力 | 分類・派生値 | 母集団 | geoPN | kFrame | D0 | D0pull | q | f(massCalibration) | relativeDrag | spaceMesh | 目的 | 門(testId) |');
    L.push('|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|');
    for (const r of F.rows) {
      const cls = (r.sampleClass || '—') + (r.calVariant ? '・' + r.calVariant : '');
      const mc = r.massCalibration ? `${fv(r.massCalibration.f)}(${esc(r.massCalibration.law)})` : '—';
      L.push(`| ${r.emoji} | \`${r.id}\` | ${esc(r.familyRole)} | ${r.roleEst}(${esc(r.roleWhy)}) | ${esc(r.input)} | ${esc(cls)} | ${r.inPopulation ? '○' : '—'} | ${fv(r.geoPN)} | ${fv(r.kFrame)} | ${fv(r.D0)} | ${fv(r.D0pull)} | ${fv(r.q)} | ${mc} | ${esc(r.relativeDrag)} | ${esc(r.spaceMesh)} | ${esc(r.purpose)} | ${r.gates.length ? r.gates.map((g) => '`' + g + '`').join(' ') : '—'} |`);
    }
    L.push('');
    L.push(`**鍵ごとの差**(physics の同じ鍵 ${F.physicsSameKeys}):`);
    L.push('');
    for (const k of F.keyDiff) L.push(`- \`${k.key}\`: ` + Object.entries(k.values).map(([id, v]) => `${id}=${esc(typeof v === 'object' && v !== null ? JSON.stringify(v) : fv(v))}`).join(' / '));
    L.push('');
    if (F.candidates.length) {
      L.push('**統廃合の候補**(実行ではない):');
      L.push('');
      L.push('| 規則 | 残す | 畳む | どう | 理由 |');
      L.push('|---|---|---|---|---|');
      for (const z of F.candidates) L.push(`| ${z.rule} | ${z.keep ? '`' + z.keep + '`' : '—'} | ${z.fold.map((x) => '`' + x + '`').join(' ')} | ${esc(z.how)} | ${esc(z.reason)} |`);
      L.push('');
    } else { L.push('**統廃合の候補**: 規則に当たる組は無い。'); L.push(''); }
    if (F.keepApart.length) {
      L.push('**畳まない組**: ' + F.keepApart.map((z) => '`' + z.pair.join('`・`') + '`(' + esc(z.why) + ')').join(' / '));
      L.push('');
    }
    if (F.history.length) { L.push('**履歴(退役)**: ' + F.history.map((x) => '`' + x + '`').join(' ')); L.push(''); }
  }
  const R = J.retired;
  L.push(`## 退役 ${R.ids.length} 本の棚卸し(統括の検証項目 R84)`);
  L.push('');
  L.push('> 退役は**フラグ**である(`familyRole:"retired"`)。内蔵(BUILTIN_PRESETS)から消していない —— 旧セーブ・履歴の正本・過去の記録が ID で参照する。サンプル一覧に出さず、開いたときに「退役(履歴)」の 1 行を出す。物理・署名・保存 JSON は変えていない。');
  L.push('');
  L.push('| 絵文字 | ID | 内蔵に残る | 退役の印 | 署名(内蔵) | 署名(凍結の写し) |');
  L.push('|---|---|---|---|---|---|');
  for (const p of R.presets) L.push(`| ${p.emoji || ''} | \`${p.id}\` | ${p.inBuiltin ? '○' : '—'} | ${p.retired ? '○' : '—'} | ${fv(p.sigBuiltin)} | ${fv(p.sigFixture)} |`);
  L.push('');
  L.push(`- **ゲートから外した長走行**: ${R.fixture.gateRemovedUnits.map((x) => '`' + x + '`').join('・')}(保存 QA の worker の所要の和 ${(R.fixture.gateRemovedWorkerMs / 1000).toFixed(1)} s)と、その結果を読む試験 ${R.fixture.gateRemovedTests.map((x) => '`' + x + '`').join('・')}。最後の保存 QA の値は凍結の写しの history に転記した(測り直していない)。`);
  L.push('- **機構の最小試験**(ゲートに残す 1 点ずつ): ' + R.fixture.mechanism.map((m) => `${m.ja} = \`${m.testId}\`(${m.preset})`).join(' / ') + '。');
  L.push(`- **名指しする器**(tests/*.mjs・tools/*.mjs —— QA 本体を除く ${R.harnesses.length} 本): 凍結の写しを読む ${R.kindCounts.fixture || 0}・再生成表の履歴 ${R.kindCounts.history || 0}・再生成表の現行 ${R.kindCounts.current || 0}・道具 ${R.kindCounts.tool || 0}・表の外 ${R.kindCounts['not-in-table'] || 0}。QA 本体の出現数: ` + Object.entries(R.qaRefs).map(([k, v]) => `${k} ${v}`).join('・') + '。');
  L.push('');
  L.push('| 器 | 名指しする ID | 再生成表の段 | 扱い |');
  L.push('|---|---|---|---|');
  const KW = { fixture: '凍結の写しを読む', history: '履歴(再生成しない)', current: '現行の段', tool: '道具(正本を書かない)', 'not-in-table': '表の外(正本ではない)' };
  for (const h of R.harnesses) L.push(`| \`${h.file}\` | ${h.ids.join(' ')} | ${h.steps.length ? h.steps.map((z) => z.key + '(' + z.role + ')').join(' ') : '—'} | ${KW[h.kind]} |`);
  L.push('');
  return L.join('\n');
}

export function build(root, target) {
  const H = loadHtmlHeadless(path.join(root, target));
  const HP = H.HP;
  const cal = JSON.parse(fs.readFileSync(path.join(root, CAL), 'utf8'));
  const population = new Set(((cal.verdictLedger || {}).rows || []).map((r) => r.id));
  const ctx = { root, HP, SS: H.evalExpr('SAMPLE_STATUS'), FVL: H.evalExpr('FAMILY_VARIANT_LABEL'),
    calVariantOf: H.evalExpr('calVariantOf'), presetSigHash: H.evalExpr('presetSigHash'), population,
    roles: H.evalExpr('FAMILY_ROLES'), retiredSide: H.evalExpr('RETIRED_PRESETS') };
  const families = FAMILIES.map((F) => familyTable(ctx, F));
  const all = families.flatMap((F) => F.rows);
  const counts = { families: families.length, members: all.length, retiredMembers: all.filter((r) => r.retired).length,
    role: all.reduce((a, r) => { a[r.roleEst] = (a[r.roleEst] || 0) + 1; return a; }, {}),
    cand: families.flatMap((F) => F.candidates).reduce((a, z) => { a[z.rule] = (a[z.rule] || 0) + 1; return a; }, {}),
    keepApart: families.reduce((a, F) => a + F.keepApart.length, 0) };
  const roleVocab = ctx.roles ? Array.from(ctx.roles) : null;
  const badRole = HP.allPresets().filter((p) => p.familyRole !== undefined && !(roleVocab || []).includes(p.familyRole)).map((p) => p.id);
  const retired = retiredInventory(ctx);
  retired.sideTable = Object.keys(ctx.retiredSide || {}).sort();
  return { families, counts, retired, roleVocab, badRole, headlessErrors: H.errors.length };
}

const IS_MAIN = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (IS_MAIN) {
  const CHECK = process.argv.includes('--check');
  const TARGET = process.env.QA_TARGET || 'beta/index.html';
  const t0 = Date.now();
  const B = build(ROOT, TARGET);
  const J = { meta: null, harnessVersion: HARNESS_VERSION, rules: RULES,
    ruling: '原仮定者の裁定(第73報)④: 同一天体の似た内容のサンプルを統廃合する(内容を比較して提案)・ダークローター関連の一部は廃止の方向',
    reading: '統括の検証項目 R84(退役はフラグ・BUILTIN_PRESETS から消さない)・R85(鍵ごとの差・同じ入力/違う入力・主系列/比較/診断/履歴・候補を出すだけで畳まない)',
    notClaim: ['統合した', '観測一致を達成した', '較正を完了した', '形状が安定した'],
    roleVocab: B.roleVocab, badRole: B.badRole, counts: B.counts, families: B.families, retired: B.retired,
    headlessErrors: B.headlessErrors, elapsedS: 0 };
  const md = renderMd(J);
  const bad = md.split('\n').filter((l) => MD_FORBIDDEN.test(l.replace(/[「『][^」』]*[」』]/g, '').replace(/notClaim.*$/, '')));
  if (bad.length) { console.error('一覧に禁止語: ' + bad.slice(0, 3).join(' / ')); process.exit(1); }
  if (B.badRole.length) { console.error('familyRole の語彙の外: ' + B.badRole.join(',')); process.exit(1); }
  if (CHECK) {
    const prevMd = fs.existsSync(path.join(ROOT, MD)) ? fs.readFileSync(path.join(ROOT, MD), 'utf8') : null;
    const prevJ = fs.existsSync(path.join(ROOT, OUT)) ? JSON.parse(fs.readFileSync(path.join(ROOT, OUT), 'utf8')) : null;
    const strip = (o) => { const x = clone(o); delete x.meta; delete x.elapsedS; return x; };
    const okMd = prevMd === md, okJ = !!prevJ && JSON.stringify(strip(prevJ)) === JSON.stringify(strip(J));
    console.log(JSON.stringify({ check: true, mdSame: okMd, canonSame: okJ }));
    process.exit(okMd && okJ ? 0 : 1);
  }
  fs.writeFileSync(path.join(ROOT, MD), md);
  J.elapsedS = (Date.now() - t0) / 1000;
  J.meta = Object.assign(provenanceMeta({ root: ROOT, wave: '第283便b', target: TARGET,
    code: ['tests/exp-w283b-families.mjs', 'tests/lib-w279b-headless.mjs', 'tests/lib-w272e-provenance.mjs', 'tests/lib-w279a-samplestatus.mjs',
      'tests/lib-w281a-scope.mjs', 'tests/lib-w281a-regentable.mjs'],
    inputs: [TARGET, CAL, RETIRED_FX, MD] }), { harnessVersion: HARNESS_VERSION });
  Object.assign(J.meta, w281aScopeStamp(path.join(ROOT, TARGET), REGEN_SCOPE), w281aStableInputs(ROOT, J.meta.inputs));
  fs.writeFileSync(path.join(ROOT, OUT), JSON.stringify(J, null, 1) + '\n');
  console.log(JSON.stringify({ out: OUT, md: MD, counts: B.counts, retired: { ids: B.retired.ids.length, kinds: B.retired.kindCounts },
    scopeComplete: J.meta.scopeComplete, elapsedS: J.elapsedS }));
}
