// 第357便g(統括の検証項目 R527・AI_SPEC §419 —— 原仮定者の報告(2026-11-26)「実在天体はgeoPN=3で取り込めるのが理想」):
//   観測レコードの道(buildAstroFromRecords → obsMakeSys)の既定を、在位の惑星の本と同じ規則の形(変種 g3k1)にした版の検査の lib。
//   runObsGeo3 —— QA behavior.obsGeo3_357g の本体(Node だけ —— 対象 html の inline script を tests/lib-w279b-headless.mjs の
//                  loadHtmlHeadless で vm に読み、アプリの本文の関数をそのまま呼ぶ。**受理の判定と自己診断はアプリの関数のまま** ——
//                  検査が見るのは、採った形・physics の鍵と値・受理器の拒否 0・自己診断・合わせた値 0・前の形の道が残っていること)。
//   題材: 仕様の例の観測レコード(アプリの obsExampleRows —— docs/AI_SPEC.md の EXAMPLE と同じ)・太陽 + 3 惑星の 21 行(下の SUN3 ——
//         数は丸めた値・出典の欄は仕様の例の形)・族の題材(合成の系 —— 値は架空・周期はケプラー則で機械算出)・相対論的連星と
//         恒星連星(paper/data/solar-observations.csv の採用レコード —— qa.mjs の経路等価の題材と同じ行の選び方)。
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { loadHtmlHeadless } from './lib-w279b-headless.mjs';

export const LIB_VERSION = 'w357g-obsgeo3-lib-1';
// 目標の形(在位の惑星の本 —— 🗺️ solarSystem16Inertial3d・太陽と惑星の 7 本 —— の宣言の字)
export const TARGET_PHYS = { geoPN: 3, kFrame: 0, lambdaPN: 0, coord: '3d', D0: 0.1, q: 3, frameWeight: 'share' };
export const TARGET_DRAG = { law: 'inertial', kernel: 'k1', rdRule: 'kappaM', pairs: 'all', history: 'positions', initMotion: 'observed' };
export const ABSENT_KEYS = ['frameReaction', 'coupleSink', 'D0pull'];
// 族の表(実測 —— 新しい形が通らない族は ③ として 'kf1' を書く。2026-11-26 の実測では ③ の族は無い)
export const FAMILY_FORM = {
  'spec-example(二体・惑星と衛星)': 'g3k1',
  'sun3-21(多衛星・中心 pinned)': 'g3k1',
  'syn-demote(多衛星・テスト粒子降格)': 'g3k1',
  'syn-freecenter(二体・自由中心)': 'g3k1',
  'syn-retro(二体・逆行公転)': 'g3k1',
  'syn-binary(恒星級の二体 —— 前の形では観測安定則)': 'g3k1',
  'csv-sirius(恒星連星・遠点整列・半径の降格 —— 二体クロージャ確認)': 'g3k1',
  'csv-psrJ0737(相対論的連星族 L−T=5)': 'g3k1',
};

const G_SI = 6.674e-11;
const kepP = (a, M) => 2 * Math.PI * Math.sqrt(Math.pow(a, 3) / (G_SI * M));
// 太陽 + 3 惑星の 21 行(丸めた値 —— 出典の欄は仕様の例の形。観測の値の照合ではない)
export function sun3Records(url) {
  const r = (body, quantity, value, unit, note) => ({ body, quantity, value, unit,
    source: 'dfm-simulator QA fixture (rounded values in the form of the spec example)', url, retrieved: '2026-11-26', note: note || '' });
  const P = [['Mercury', 3.301e23, 2.4397e6, 5.791e10, 0.2056, 7.6005e6, 5.0670e6], ['Venus', 4.8673e24, 6.0518e6, 1.0821e11, 0.0068, 1.94142e7, -2.09973e7],
    ['Earth', 5.9722e24, 6.371e6, 1.49598e11, 0.0167, 3.15581e7, 86164]];
  const out = [r('Sun', 'mass', 1.989e30, 'kg'), r('Sun', 'radius', 6.957e8, 'm'), r('Sun', 'rotation_period', 2.1925e6, 's')];
  for (const [b, m, R, a, e, p, rot] of P) out.push(r(b, 'mass', m, 'kg'), r(b, 'radius', R, 'm'), r(b, 'semi_major_axis', a, 'm'),
    r(b, 'eccentricity', e, '1'), r(b, 'orbital_period', p, 's', '= ' + (p / 86400).toFixed(3) + ' d'), r(b, 'rotation_period', rot, 's', rot < 0 ? 'retrograde' : ''));
  return out;
}
function synthetic() {
  const mk = (body, quantity, value, unit) => ({ body, quantity, value, unit, source: 'QA synthetic table (fictional bodies)',
    url: 'https://example.invalid/qa/w357g-synthetic', retrieved: '2026-11', note: 'Synthetic fixture: invented round numbers for a fictional system.' });
  const two = (C, S, e, inc) => [mk(C.name, 'mass', C.m, 'kg'), mk(C.name, 'radius', C.r, 'm'), mk(C.name, 'rotation_period', C.rot, 's'),
    mk(S.name, 'mass', S.m, 'kg'), mk(S.name, 'radius', S.r, 'm'), mk(S.name, 'semi_major_axis', S.a, 'm'), mk(S.name, 'eccentricity', e || 0, '1'),
    mk(S.name, 'orbital_period', kepP(S.a, C.m + S.m), 's')].concat(inc ? [mk(S.name, 'inclination', inc, 'rad')] : []);
  const DMC = { name: 'Qa Prime', m: 5.0e23, r: 3.0e6, rot: 9.0e4 }, D1 = { name: 'Qa Prime I', m: 5.0e16, r: 8.0e3, a: 9.0e6 }, D2 = { name: 'Qa Prime II', m: 8.0e15, r: 5.0e3, a: 2.2e7 };
  const sat = (s) => [mk(s.name, 'mass', s.m, 'kg'), mk(s.name, 'radius', s.r, 'm'), mk(s.name, 'semi_major_axis', s.a, 'm'), mk(s.name, 'eccentricity', 0, '1'), mk(s.name, 'orbital_period', kepP(s.a, DMC.m), 's')];
  return {
    'syn-demote(多衛星・テスト粒子降格)': [mk(DMC.name, 'mass', DMC.m, 'kg'), mk(DMC.name, 'radius', DMC.r, 'm'), mk(DMC.name, 'rotation_period', DMC.rot, 's')].concat(sat(D1), sat(D2)),
    'syn-freecenter(二体・自由中心)': two({ name: 'Qa Sol', m: 2.0e30, r: 7.0e8, rot: 2.2e6 }, { name: 'Qa Sol b', m: 5.0e24, r: 6.0e6, a: 1.1e11 }),
    'syn-retro(二体・逆行公転)': two({ name: 'Qa Nep', m: 1.0e26, r: 2.5e7, rot: 6.0e4 }, { name: 'Qa Nep I', m: 2.0e22, r: 1.4e6, a: 3.5e8 }, 0, 2.8),
    'syn-binary(恒星級の二体 —— 前の形では観測安定則)': two({ name: 'Qa Cen A', m: 2.2e30, r: 1.2e9, rot: 2.2e6 }, { name: 'Qa Cen B', m: 1.8e30, r: 8.0e8, a: 1.0e11 }, 0.3),
  };
}
// solar-observations.csv の採用レコード(併置の取り込みの行・候補の行・periastron_advance はビルダーへ渡さない —— qa.mjs の経路等価と同じ)
function csvSystem(root, prefix) {
  const t = fs.readFileSync(path.join(root, 'paper', 'data', 'solar-observations.csv'), 'utf8').split('\n');
  const rows = t.filter((l) => l.startsWith(prefix)).map((line) => {
    const cols = []; let cur = '', inQ = false;
    for (const ch of line) { if (inQ) { if (ch === '"') inQ = false; else cur += ch; } else if (ch === '"') inQ = true; else if (ch === ',') { cols.push(cur); cur = ''; } else cur += ch; }
    cols.push(cur);
    return { body: cols[0], quantity: cols[1], value: Number(cols[2]), unit: cols[3], source: cols[4], url: cols[5], retrieved: cols[6], note: cols[7] };
  });
  const skip = (r) => /intake_row=2026-09-1[4]|intake_round=request-C-2026-09-22|intake_row=2026-09-2[23]|intake_round=confirmation-request-[78]/.test(r.note || '')
    || /_candidate$/.test(r.quantity || '') || r.quantity === 'periastron_advance';
  return rows.filter((r) => !skip(r));
}

// 1 つの html について、題材を全部通す → { cases[], why[], table[] }
export function judgeObsGeo3(htmlPath, root, opts = {}) {
  const H = loadHtmlHeadless(htmlPath);
  const ev = (c) => H.evalExpr(c);
  const why = [], cases = [], table = [];
  if (ev('typeof buildAstroFromRecords') !== 'function') return { why: ['buildAstroFromRecords が無い'], cases, table };
  const url = ev('OBS_SAMPLE_URL');
  const F = { 'spec-example(二体・惑星と衛星)': ev('JSON.parse(JSON.stringify(obsExampleRows()))'), 'sun3-21(多衛星・中心 pinned)': sun3Records(url) };
  if (!opts.only) Object.assign(F, synthetic(), {
    'csv-sirius(恒星連星・遠点整列・半径の降格 —— 二体クロージャ確認)': csvSystem(root, 'Sirius '),
    'csv-psrJ0737(相対論的連星族 L−T=5)': csvSystem(root, 'PSR J0737-3039 '),
  });
  if (F['sun3-21(多衛星・中心 pinned)'].length !== 21) why.push('題材の 21 行が ' + F['sun3-21(多衛星・中心 pinned)'].length + ' 行');
  for (const [name, recs] of Object.entries(F)) {
    if (opts.only && opts.only.indexOf(name) < 0) continue;
    H.ctx.__w357g = recs;
    const o = ev(`(function(){
      const r=buildAstroFromRecords(__w357g);
      const k=buildAstroFromRecords(__w357g,{form:"kf1"});
      const out={ok:r.ok, stage:r.stage||null, err:(r.errors||[]).slice(0,2), form:r.form||null, why:r.g3Why||null, metaForm:r.meta? r.meta.form : null,
        kOk:k.ok, kForm:k.form||null, kGeo:k.ok? k.preset.physics.geoPN : null, kKF:k.ok? k.preset.physics.kFrame : null, kStab:!!(k.ok && k.stabilized)};
      if(!r.ok) return out;
      const p=r.preset, ph=p.physics, v=validatePreset(JSON.parse(JSON.stringify(p)), XK_INTAKE_OPTS);
      out.ph={}; for(const kk of ${JSON.stringify(Object.keys(TARGET_PHYS))}) out.ph[kk]=ph[kk];
      const rd=ph.relativeDrag||{}, iq=rd.invSq||{};
      out.drag={law:rd.law, kernel:iq.kernel, rdRule:iq.rdRule, pairs:rd.pairs, history:rd.history, initMotion:rd.initMotion};
      out.gLoc=ph.gLoc? ph.gLoc.law : null;
      out.absent=${JSON.stringify(ABSENT_KEYS)}.filter(kk=>ph[kk]!==undefined);
      out.vOk=v.ok; out.vErr=(v.errors||[]).length;
      out.fitted=(p.parameterAudit && p.parameterAudit.fitted)? p.parameterAudit.fitted.length : 0;
      out.meta={sc:p.sampleClass, rk:p.referenceKind, nc:p.notClaim, fid:p.fidelity,
        ab:!!(p.abBody && p.abBody.physicsPatch && p.abBody.physicsPatch.gLoc===null && p.abBody.physicsPatch.relativeDrag && p.abBody.physicsPatch.relativeDrag.enabled===false)};
      out.z=p.bodies.every(b=>b.z===0 && b.vz===0);
      out.desc={rule:p.description.indexOf(LANG==="en"? "SAME RULE FORM AS THE IN-PLACE PLANET BOOKS" : "在位の惑星の本と同じ規則の形")>=0,
        noQ:p.description.indexOf("q_exact=")<0, rd:p.description.indexOf("R_d = Y_k m")>=0};
      out.diag={ok:r.diag.ok, worst:Math.max.apply(null, r.diag.rows.map(x=>Math.max(Math.abs(x.rel), Math.abs(x.rel0)))), n:r.diag.rows.length, closure:!!r.diag.closure};
      const run=(pp)=>{ const S=makeSim(); S.build(pp); const dt=appStepDt(S); for(let i=0;i<200;i++) S.step(dt);
        const pos=[]; for(let i=0;i<S.n;i++) pos.push([S.x[i],S.y[i],S.z? S.z[i] : 0]); return {nan:S.hasNaN(), pos}; };
      const rg=run(p); out.nan=rg.nan;
      if(k.ok){ const rk=run(k.preset);
        out.rows=r.diag.rows.map((x,i)=>({name:x.name, pObs:x.pObs, pG3:x.pEst, pK:k.diag.rows[i].pEst,
          dpos:Math.hypot(rg.pos[i+1][0]-rk.pos[i+1][0], rg.pos[i+1][1]-rk.pos[i+1][1], rg.pos[i+1][2]-rk.pos[i+1][2])})); }
      return out;
    })()`);
    const bad = [];
    const want = opts.expectForm || FAMILY_FORM[name] || 'g3k1';
    if (!o.ok) bad.push('組み立てに失敗(' + o.stage + ' ' + (o.err[0] || '').slice(0, 60) + ')');
    else {
      if (o.form !== want || o.metaForm !== want) bad.push('採った形 ' + o.form + '(期待 ' + want + ')' + (o.why ? ' —— ' + String(o.why).slice(0, 80) : ''));
      if (want === 'g3k1') {
        for (const [kk, vv] of Object.entries(TARGET_PHYS)) if (o.ph[kk] !== vv) bad.push('physics.' + kk + '=' + JSON.stringify(o.ph[kk]));
        for (const [kk, vv] of Object.entries(TARGET_DRAG)) if (o.drag[kk] !== vv) bad.push('relativeDrag の ' + kk + '=' + JSON.stringify(o.drag[kk]));
        if (o.gLoc !== 'kappaC2') bad.push('gLoc.law=' + o.gLoc);
        if (o.absent.length) bad.push('前の形の鍵が残る: ' + o.absent.join(','));
        if (o.fitted !== 0) bad.push('fitted が ' + o.fitted + ' 件');
        if (!(o.meta.sc === 'principle' && o.meta.rk === 'theory-control' && o.meta.fid === 'real' && Array.isArray(o.meta.nc) && o.meta.nc.indexOf('solar_cal') >= 0 && o.meta.nc.indexOf('inposk1_rule') >= 0 && o.meta.ab))
          bad.push('分類と対照の欄 ' + JSON.stringify(o.meta).slice(0, 120));
        if (!o.z) bad.push('初期状態が平面でない(z・v_z)');
        if (!(o.desc.rule && o.desc.noQ && o.desc.rd)) bad.push('説明の文 ' + JSON.stringify(o.desc));
      }
      if (!(o.vOk && o.vErr === 0)) bad.push('受理器の拒否 ' + o.vErr);
      if (!(o.diag.ok && o.diag.worst <= 0.01)) bad.push('自己診断 ' + o.diag.worst);
      if (o.nan) bad.push('200 步で NaN');
    }
    if (!(o.kOk && o.kGeo === (o.kStab ? 1 : 2) && o.kKF === (o.kStab ? 0 : 1))) bad.push('前の形の道(form:"kf1")が geoPN ' + o.kGeo + '・kFrame ' + o.kKF);
    why.push(...bad.map((s) => name + ': ' + s));
    cases.push(name + ' → ' + (o.form || '×') + (o.ok ? '(自己診断 ' + (o.diag.worst * 100).toFixed(4) + '%' + (o.diag.closure ? '・二体クロージャ' : '') + ')' : ''));
    if (o.rows) table.push({ name, rows: o.rows });
  }
  return { why, cases, table, errors: H.errors };
}

// 前の形へ戻す道(新しい形が通らない族 ③)の自己試験: 自己診断を geoPN=3 の本でだけ外す(vm の中の差し替え)→ kf1 で組み、理由を書く
export function judgeFallback(htmlPath) {
  const H = loadHtmlHeadless(htmlPath);
  const ev = (c) => H.evalExpr(c);
  H.ctx.__w357g = sun3Records(ev('OBS_SAMPLE_URL'));
  return ev(`(function(){
    const orig=astroObsSelfCheck;
    astroObsSelfCheck=function(p,t,s){ const d=orig(p,t,s); if(p.physics && p.physics.geoPN===3) return {ok:false, errors:["(自己試験)軌道を保てていません"], rows:d.rows||[], steps:d.steps}; return d; };
    try{
      const r=buildAstroFromRecords(__w357g);
      return {ok:r.ok, form:r.form, geo:r.ok? r.preset.physics.geoPN : null, kF:r.ok? r.preset.physics.kFrame : null,
        desc:r.ok && r.preset.description.indexOf("新しい形は採用しなかった")>=0, note:(r.notes||[]).some(n=>/新しい形\\(geoPN=3\\)は採用しなかった/.test(n)), why:r.g3Why||""};
    } finally { astroObsSelfCheck=orig; }
  })()`);
}

// 変異の自己試験(html の字を変えて読み直す —— 21 行の題材だけ)
export const MUTANTS = [
  ['geoPN を 2 に戻す', (h) => h.replace('const phG3={G:G, D0:0.1, kFrame:0, q:3, geoPN:3,', 'const phG3={G:G, D0:0.1, kFrame:0, q:3, geoPN:2,')],
  ['relativeDrag を外す', (h) => h.replace('            relativeDrag:{law:"inertial", invSq:{kernel:"k1", rdRule:"kappaM"}, pairs:"all", history:"positions", initMotion:"observed"},\n            gLoc:{law:"kappaC2"}};', '            gLoc:{law:"kappaC2"}};')],
  ['D₀ を足す(D0pull)', (h) => h.replace('const phG3={G:G, D0:0.1,', 'const phG3={D0pull:3.24204e8/Math.pow(10, sc.M-2*sc.L), G:G, D0:0.1,')],
  ['既定の変種を kf1 に戻す', (h) => h.replace('    defVariant:"g3k1" };', '    defVariant:"kf1" };')],
  ['合わせた値を足す', (h) => h.replace('fixedConventions:gFix, fitted:[],', 'fixedConventions:gFix, fitted:["D₀=0.006"],')],
  ['分類を較正に戻す', (h) => h.replace('    gp.sampleClass="principle";', '    gp.sampleClass="calibration";')],
];
export function judgeMutants(htmlPath, root) {
  const html = fs.readFileSync(htmlPath, 'utf8');
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'w357g-mut-'));
  const out = [];
  try {
    for (const [nm, f] of MUTANTS) {
      const hm = f(html);
      if (hm === html) { out.push({ nm, same: true, hit: false }); continue; }
      const fp = path.join(tmp, 'm.html'); fs.writeFileSync(fp, hm);
      let hit = false;
      try { hit = judgeObsGeo3(fp, root, { only: ['sun3-21(多衛星・中心 pinned)'] }).why.length > 0; } catch (e) { hit = true; }
      out.push({ nm, same: false, hit });
    }
  } finally { fs.rmSync(tmp, { recursive: true, force: true }); }
  return out;
}

// QA の本体: { why[], cases[], table[] }
export function runObsGeo3(htmlPath, root) {
  const J = judgeObsGeo3(htmlPath, root);
  const why = J.why.slice(), cases = J.cases.slice();
  if (J.errors && J.errors.length) why.push('読み込みの誤り ' + String(J.errors[0]).slice(0, 80));
  const fb = judgeFallback(htmlPath);
  if (!(fb.ok && fb.form === 'kf1' && fb.geo === 2 && fb.kF === 1 && fb.desc && fb.note)) why.push('③ の道(新しい形が通らない族は kf1 のまま・理由を書く) ' + JSON.stringify(fb).slice(0, 160));
  cases.push('③ の道の自己試験: 新しい形の自己診断を外すと kf1(geoPN ' + fb.geo + '・kFrame ' + fb.kF + ')で組み、理由を説明の文と注記に');
  const M = judgeMutants(htmlPath, root);
  for (const m of M) { if (m.same) why.push('変異「' + m.nm + '」の種が無い'); else if (!m.hit) why.push('変異「' + m.nm + '」で落ちない'); }
  cases.push('変異 ' + M.length + '(' + M.map((m) => m.nm + (m.hit ? ' 落ちる' : ' ×')).join('・') + ')');
  const t3 = J.table.find((t) => /^sun3-21/.test(t.name));
  if (t3) cases.push('21 行の題材の推定の周期(新しい形 / 前の形 / 記録)と 200 步の後の位置の差: ' + t3.rows.map((r) => r.name + ' ' + r.pG3.toPrecision(7) + ' / ' + r.pK.toPrecision(7) + ' / ' + r.pObs.toPrecision(7) + '・' + r.dpos.toExponential(2)).join('・'));
  return { why, cases, table: J.table };
}
