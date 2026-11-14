// 第337便f(決断事項 AN709・統括の検証項目 R342 —— 道具)— **文を読む段**の調べ(QA と道具だけが import する —— 器は import しない)。
//
// ■ なぜ(第336便の影の照合の誤判定 1 件 —— pairnorm-305a)
//   器 tests/exp-w305a-pairnorm.mjs の正本は受理の理由の文(zero.gs.badDenomMsg)を写すのに、領域の宣言(REGEN_SCOPE)の consts に文の出どころ(html の受理の理由の表
//   ACCEPT_REASONS)が無かった。文の登録簿(I18N・ACCEPT_REASONS・LAWS)は閉包を辿らない停止集合なので、consts に宣言しない限り領域 hash に入らない ——
//   文だけを変えた便で段は再利用になり、正本に古い文が残る(次に作り直したとき影の照合が誤判定)。
// ■ 何をするか
//   ・pairnormTextProbe337f: html の写しで受理の理由の文だけを変え(W₀ → W_bg)、器の宣言(consts に ACCEPT_REASONS)で領域 hash が変わること・宣言から外した対照では
//     変わらないこと(元の取りこぼしの再現)・鎖の入力の契約(inputDigest の html:scope)でも変わることを引く。
//   ・textReadSurvey337f: 正本(tests/out —— meta を除く)に html の文の登録簿の文(静的な文 20 字以上・関数の文は固定の断片 20 字以上)が写っている段と、
//     その段の領域の宣言の consts を突き合わせる(同じ型の段の表 —— 直すかは段ごとに決める)。
// ■ 言わないこと: 「表に無い段は文を写していない」(20 字未満の文・組み立てた文・数を埋めた文の可変の部分は拾わない)。「表の段は全部直すべき」
//   (consts に足すと文の便のたびに走る —— 正本に写す文を安定 hash から外す案と比べて段ごとに決める)。
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

export const TEXTREAD_VERSION_337F = 'w337f-textread-1';
export const TEXT_REGS_337F = Object.freeze(['ACCEPT_REASONS', 'I18N', 'LAWS']);
/** 受理の理由の文で変異に使う行(pairnorm が写す文 —— 第336便の誤判定の文)。 */
export const PAIRNORM_REASON_KEY_337F = '"validateInertialR2/physics.relativeDrag.inertialR2.denom":';

/**
 * AN709 の回帰(I/O —— 一時ファイル): 器 pairnorm の宣言で、文だけを変えた html の写しの領域 hash と鎖の入力の契約が変わること。
 * @param {{root:string, html:string, SC:object, RT:object, tmpDir?:string}} o SC = lib-w281a-scope・RT = lib-w281a-regentable
 */
export function pairnormTextProbe337f(o) {
  const bad = [], cases = [];
  const text = fs.readFileSync(path.join(o.root, 'tests', 'exp-w305a-pairnorm.mjs'), 'utf8');
  const scope = o.SC.readDeclaredScope(text);
  if (!(scope && Array.isArray(scope.consts) && scope.consts.includes('ACCEPT_REASONS'))) { bad.push('器 pairnorm の REGEN_SCOPE の consts に ACCEPT_REASONS が無い'); return { ok: false, bad, cases }; }
  const h = fs.readFileSync(o.html, 'utf8');
  const at = h.indexOf(PAIRNORM_REASON_KEY_337F);
  if (at < 0) { bad.push('受理の理由の表に ' + PAIRNORM_REASON_KEY_337F + ' が無い'); return { ok: false, bad, cases }; }
  const end = h.indexOf('\n', at), line = h.slice(at, end);
  if (line.indexOf('W₀') < 0) { bad.push('変異に使う文(W₀)が行に無い'); return { ok: false, bad, cases }; }
  const tmp = fs.mkdtempSync(path.join(o.tmpDir || os.tmpdir(), 'w337f-text-'));
  try {
    const changed = path.join(tmp, 'index.html');
    fs.writeFileSync(changed, h.slice(0, at) + line.replace('W₀', 'W_bg') + h.slice(end));
    const a = o.SC.scopeHash(o.html, scope), b = o.SC.scopeHash(changed, scope);
    if (!(a.scopeComplete && b.scopeComplete)) bad.push('領域が complete でない');
    if (a.scopeSha256 === b.scopeSha256) bad.push('文だけの変異で器の宣言の領域 hash が変わらない');
    const legacy = Object.assign({}, scope, { consts: scope.consts.filter((x) => x !== 'ACCEPT_REASONS') });
    const la = o.SC.scopeHash(o.html, legacy), lb = o.SC.scopeHash(changed, legacy);
    if (la.scopeSha256 !== lb.scopeSha256) bad.push('対照(consts から外した宣言)で領域 hash が変わった —— 元の取りこぼしを再現できない');
    cases.push(`領域 hash: 宣言 ${a.scopeSha256 === b.scopeSha256 ? '同じ' : '変わる'}・対照(ACCEPT_REASONS を外した宣言)${la.scopeSha256 === lb.scopeSha256 ? '同じ(取りこぼしの再現)' : '変わる'}`);
    // 鎖の入力の契約(正本の meta.scope を読む経路 —— html:scope:<正本>)
    fs.mkdirSync(path.join(tmp, 'r'), { recursive: true });
    fs.writeFileSync(path.join(tmp, 'r', 'out.json'), JSON.stringify({ meta: { scope, scopeComplete: true } }));
    const dg = (f) => o.RT.inputDigest(['html:scope:out.json'], { root: path.join(tmp, 'r'), html: f, staticContract: 'w337f-pairnorm-text' });
    const da = dg(o.html), db = dg(changed);
    if (!da || !db || da.contract === db.contract) bad.push('鎖の入力の契約(inputDigest の html:scope)が文の変異で変わらない');
    cases.push('鎖の入力の契約(inputDigest html:scope)' + (da && db && da.contract !== db.contract ? '変わる' : '同じ'));
  } catch (e) { bad.push('例外: ' + String(e && e.message || e).slice(0, 120)); }
  finally { try { fs.rmSync(tmp, { recursive: true, force: true }); } catch { /* 残っても害は無い */ } }
  return { ok: bad.length === 0, bad, cases };
}

/**
 * 同じ型の段の表(I/O —— 正本を読む): 正本に文の登録簿の文が写っている段と、その段の宣言の consts。
 * @param {{root:string, L:object, steps:object[]}} o L = loadHtmlHeadless(html) の戻り・steps = REGEN_STEPS
 * @returns {{version:string, rows:Array<{key:string, out:string, regs:string[], declared:string[], missing:string[], scope:string, sample:string}>}}
 */
export function textReadSurvey337f(o) {
  const needles = [];
  for (const r of TEXT_REGS_337F) {
    const leaves = o.L.evalExpr('(()=>{const out=[];const w=(x,p)=>{ if(typeof x==="string") out.push([p,x,0]); else if(typeof x==="function"){ try{ const s=x("§","§","§","§"); if(typeof s==="string") out.push([p+"()",s,1]); }catch(_){} } else if(x&&typeof x==="object") for(const k of Object.keys(x)) w(x[k],p+"/"+k); }; w(' + r + ',""); return out;})()') || [];
    for (const [p, s] of leaves) { const fr = String(s).split('§').map((z) => z.trim()).filter((z) => z.length >= 20).sort((a, b) => b.length - a.length)[0]; if (fr) needles.push([r, p, JSON.stringify(fr).slice(1, -1)]); }
  }
  const rows = [];
  for (const st of o.steps) {
    if (st.role === 'history') continue;
    for (const out of (st.outs || [])) {
      let J = null; try { J = JSON.parse(fs.readFileSync(path.join(o.root, out), 'utf8')); } catch { J = null; }
      if (!J || typeof J !== 'object') continue;
      const body = JSON.stringify(Object.assign({}, J, { meta: undefined }));
      const regs = new Set(); let sample = '';
      for (const [r, p, n] of needles) if (body.indexOf(n) >= 0) { regs.add(r); if (!sample) sample = r + p; }
      if (!regs.size) continue;
      const sc = J.meta && J.meta.scope;
      const declared = sc && Array.isArray(sc.consts) ? sc.consts.filter((c) => TEXT_REGS_337F.includes(c)) : [];
      rows.push({ key: st.key, out, regs: [...regs].sort(), declared, missing: [...regs].filter((r) => !declared.includes(r)).sort(),
        scope: sc ? (Array.isArray(sc.presets) ? 'presets ' + sc.presets.length : 'presets ' + String(sc.presets)) : 'scope なし(' + String((J.meta && J.meta.target) || '—') + ')', sample, sec: st.sec });
      break;
    }
  }
  return { version: TEXTREAD_VERSION_337F, needles: needles.length, rows };
}
