// 第355便h(統括の検証項目 R511・AI_SPEC §403 —— AI チャットとの対話の入口): 外の AI チャットの返答の文の検査の lib(作業中の版を写して名を付け替えた)。
// **検査の規則は 1 つも持たない** —— 対象 html の inline script を tests/lib-w279b-headless.mjs の loadHtmlHeadless で vm に読み、
// アプリの本文の関数をそのまま呼ぶ:
//   parseIntake(→ normalizeIntakeText・importCandidates・sanitizeLLMJSON)/ detectPasteShape / aiIntakeText(→ aiIntakeValue →
//   buildAstroFromRecords〔観測レコード〕・stabilizePreset〔プリセット —— validatePreset・stabSelfCheck〕)/
//   aiPasteRun(false)(画面の「検証」ボタンの道 —— 画面へ出す字を obsReportBlock・setAiStatus の差し替えで拾う)/
//   validatePreset・makeSim・appStepDt(200 步の試走)/ T("retryFixMsg")(アプリ内生成の再試行の文)。
// ブラウザに依る所(DOM)の差し替え: ① obsReportBlock・setAiStatus・obsReportClear を「字を拾う」関数へ ② document.querySelector を、
//   #aiPasteArea には貼る文・#aiKeplerFix には checked(画面の既定 = checked)を返す物へ(他は元の万能スタブ)。
import { loadHtmlHeadless } from './lib-w279b-headless.mjs';

export const LIB_VERSION = 'w355h-aichat-validate-lib-1';

export function loadApp(htmlPath) {
  const H = loadHtmlHeadless(htmlPath);
  const ctx = H.ctx;
  const origDoc = ctx.document;
  const state = { text: '', kepler: true, blocks: [], status: [] };
  ctx.__aichat355h = state;
  ctx.document = new Proxy(origDoc, {
    get(t, k) {
      if (k === 'querySelector') return (s) => {
        if (s === '#aiPasteArea') return { value: state.text };
        if (s === '#aiKeplerFix') return { checked: state.kepler };
        return origDoc.querySelector(s);
      };
      return t[k];
    },
  });
  H.evalExpr(`
    obsReportClear = function(){ __aichat355h.blocks.length = 0; };
    obsReportBlock = function(head, lines, cls){ __aichat355h.blocks.push({head:String(head), lines:Array.from(lines||[], String), cls:cls||'note'}); };
    setAiStatus = function(msg, cls){ __aichat355h.status.push({msg:String(msg), cls:cls||''}); };
    void 0;`);
  // 道の関数がそのまま在るか(在るものだけ使う —— 無ければ報告)
  const need = ['parseIntake', 'importCandidates', 'detectPasteShape', 'aiIntakeText', 'aiPasteRun', 'validatePreset', 'makeSim', 'appStepDt', 'T', 'LANG'];
  const missing = need.filter((n) => { try { return H.evalExpr(`typeof ${n}`) === 'undefined'; } catch { return true; } });
  return { H, state, missing, errors: H.errors };
}

const plain = (x) => JSON.parse(JSON.stringify(x === undefined ? null : x));

// 1 つの返答の文を検査する
export function checkText(app, text, opts = {}) {
  const { H, state } = app;
  const ev = (c) => H.evalExpr(c);
  const g = H.ctx;
  g.__wc_text = String(text);
  // ① 形の判別 —— アプリの parseIntake と detectPasteShape をそのまま
  const pr = ev('parseIntake(__wc_text)');
  const cands = ev('importCandidates(normalizeIntakeText(String(__wc_text)))').length;
  const shape = pr.ok ? ev('detectPasteShape') (pr.value) : 'parse';
  // ② 画面の「検証」ボタンの道(aiPasteRun(false))—— 中で aiIntakeText が走る。その戻り値も拾う
  state.text = String(text); state.kepler = opts.kepler !== false; state.blocks = []; state.status = [];
  ev(`(function(){ if(!globalThis.__wc_origIntake){ globalThis.__wc_origIntake = aiIntakeText;
      aiIntakeText = function(t,o){ const r = __wc_origIntake(t,o); globalThis.__wc_last = r; return r; }; } })()`);
  g.__wc_last = null;
  ev('aiPasteRun(false)');
  const r = g.__wc_last;
  const screen = { blocks: plain(state.blocks), status: plain(state.status) };
  const res = {
    shape,                       // records / preset / unknown / parse
    candidates: cands,           // importCandidates が拾った JSON の候補の数(フェンスと最上位の {…}/[…])
    parse: { ok: !!pr.ok, corrected: !!pr.corrected, fixes: plain(pr.fixes || []), error: pr.ok ? null : String(pr.error || '') },
    intake: r ? {
      ok: !!r.ok, kind: r.kind, stage: r.stage || null,
      errors: plain(r.errors || []), warnings: plain(r.warnings || []),
      changes: plain(r.changes || []), notes: plain(r.notes || []),
      diag: r.diag ? plain({ steps: r.diag.steps, n: r.diag.n, maxR: r.diag.maxR, escaped: r.diag.escaped, ok: r.diag.ok, rows: r.diag.rows ? r.diag.rows.length : undefined }) : null,
    } : null,
    screen,
    preset: (r && r.ok && r.preset) ? plain(r.preset) : null,   // 受理された設定(安定化の後 —— 試しの題の「通ったと見る条件」を機械で見るため)
    run: null,
  };
  // ③ 受理された設定を build して 200 步(アプリの validatePreset・makeSim・appStepDt —— 画面の刻み)
  if (r && r.ok && r.preset) res.run = runSteps(app, r.preset, opts.steps || 200);
  // ④ AI に返す文
  res.aiReply = aiReplyText(app, res);
  res.exit = (res.shape === 'parse' || res.shape === 'unknown') && !(r && r.ok) ? 3 : (r && r.ok ? 0 : 2);
  return res;
}

export function runSteps(app, preset, steps) {
  const { H } = app; const g = H.ctx;
  g.__wc_p = JSON.parse(JSON.stringify(preset));
  return plain(H.evalExpr(`(function(){
    const v = validatePreset(__wc_p);
    if(!v.ok) return {ok:false, errors:v.errors.slice(0,6)};
    const S = makeSim(); S.build(v.preset);
    const dt = appStepDt(S);
    const ke = () => { let e=0; for(let i=0;i<S.n;i++) e += 0.5*Math.abs(S.m[i])*(S.vx[i]*S.vx[i]+S.vy[i]*S.vy[i]); return e; };
    const maxR = () => { let r=0; for(let i=0;i<S.n;i++){ const q=Math.hypot(S.x[i],S.y[i]); if(!(q<=r)) r=q; } return r; };
    const ke0 = ke(), r0 = maxR(), n0 = S.n;
    let nanAt = -1;
    for(let k=0;k<${Number(steps) | 0};k++){ S.step(dt); if(nanAt<0 && S.hasNaN()) { nanAt = k+1; break; } }
    const ke1 = ke(), r1 = maxR();
    const mag = (x) => (x>0 && isFinite(x)) ? Math.round(Math.log10(x)) : null;
    return {ok:true, steps:${Number(steps) | 0}, dt, n0, n:S.n, nan: nanAt>=0, nanAt, photons:(S.photons? S.photons.length : 0),
      kinetic0:ke0, kinetic1:ke1, kineticRatio:(ke0>0? ke1/ke0 : null), kineticMag0:mag(ke0), kineticMag1:mag(ke1), maxR0:r0, maxR1:r1};
  })()`));
}

// 「AI に返す文」(利用者がチャットへ貼る形)。拒否の理由はアプリの字のまま・直してほしいことはアプリ内生成の再試行の文 T("retryFixMsg")
//   (generatePreset が作る fail = errors を " / " で繋いで 300 字まで —— この繋ぎ方だけは generatePreset の 1 行を写した)。
export function aiReplyText(app, res) {
  const { H } = app; const g = H.ctx;
  const en = H.evalExpr('LANG') === 'en';
  const head = en ? 'App check result: ' : 'アプリの検査の結果: ';
  const it = res.intake;
  if (it && it.ok) {
    const run = res.run;
    const runTxt = run && run.ok ? (en ? `accepted (${it.kind}); ran ${run.steps} steps, ${run.n} bodies, NaN ${run.nan ? 'yes' : 'none'}` : `受理(${it.kind === 'records' ? '観測レコード' : 'プリセット'})。${run.steps} 步 試走・粒子 ${run.n}・NaN ${run.nan ? 'あり' : 'なし'}`) : (en ? `accepted (${it.kind})` : `受理(${it.kind})`);
    const ch = (it.changes || []).slice(0, 2).join(' / ');
    return head + runTxt + (ch ? (en ? '. The app changed: ' : '。アプリが直した所: ') + ch.slice(0, 240) : '') + (en ? '.' : '。');
  }
  const errs = it ? (it.errors || []) : [res.parse && res.parse.error ? res.parse.error : ''];
  const fail = errs.join(' / ').slice(0, 300);
  g.__wc_fail = fail;
  const retry = H.evalExpr('T("retryFixMsg")(__wc_fail)');
  const stage = it ? it.stage : 'parse';
  const lead = en ? `rejected (stage: ${stage}).` : `取り込めませんでした(段: ${stage})。`;
  return head + lead + '\n' + retry;
}
