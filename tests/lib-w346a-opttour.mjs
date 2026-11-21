// 第346便a(原仮定者の回答(2026-11-21 —— 第145報の回答 2)「AN931: Bで進める」・統括の検証項目 R397)
// —— **最適化が止まる本の記録 —— 純関数**(器 tests/exp-w346a-opttour.mjs が使う・QA behavior.opttour346a が場面と正本で見る)。
//
// ■ 何を数えるか: 新しい版のブラウザ(chromium 157・V8 15.7)では、同じページに sim が 2 つ在ると、関数の最適化が
//   ブラウザの出力「disabled optimization for … <SharedFunctionInfo 名>, reason: Function is too big to be optimized」で止まることがある
//   (PHYSICS〔第346便a〕①)。器は、代表の本 × 使い方 2 つ(A/B〔kFrame 0〕・2 つの sim が同じ設定で両方進む形)を、1 回ごとに
//   ブラウザを起こし直して走らせ、`--js-flags=--trace-opt --trace-deopt` の出力(DEBUG=pw:browser で Playwright の [pid][out] の行に出る)を拾う。
//   この lib は、その行から「止まった関数と理由」を数え、本と使い方の表と門を作る。
// ■ 門(DECL.gate): **記録のブラウザの V8 が 15.7 のとき**、A/B で `S._core` が止まる本 = 0。
//   2 つの sim が両方進む形(two)は数を記録するだけ(門にしない —— 直し C1 が効かない使い方: PHYSICS〔第346便a〕④)。
//   記録のブラウザが別の版のときは数を記録するだけ(門は「版が違う —— 比べない」と印字して通す)。CI の標準(153)では直す前から 0 なので、CI ではこの門は何も見ない。
// ■ しないこと: ブラウザを起こさない・ファイルを読まない・時計を読まない。1 步の ms は記録するだけ(時間は箱で揺れる —— 門にしない)。
//   「新しい版で速くなった」「止まる件を解決した」とは書かない(この版・この箱・この本・この使い方では、の表)。
export const OPTTOUR_LIB_VERSION_346A = 'w346a-opttour-lib-1';

export const DECL_346A = Object.freeze({
  presets: Object.freeze(['galaxyGeo2', 'galaxy', 'cosmicweb', 'darkrotor', 'axisBarStill', 'binary', 'selfRotor']),
  modes: Object.freeze(['ab', 'two']),
  modeNames: Object.freeze({ ab: 'A/B(kFrame 0 —— A/B 比較の既定)', two: '2 つの sim が同じ設定で両方進む形' }),
  steps: 300,          // 1 回の步の上限(1 sim あたり)
  capMs: 60000,        // 1 回の走りの時間の上限(安全のため —— 普通は步の上限 300 が先に当たる。步の数を正本の安定な欄にするため、時間では区切らない)
  dt: 0.016,
  jsFlags: '--allow-natives-syntax --trace-opt --trace-deopt',
  reasonTooBig: 'Function is too big to be optimized',
  gate: Object.freeze({ v8Prefix: '15.7.', mode: 'ab', fn: 'S._core', maxPresets: 0 }),
});

const RE_DISABLED = /disabled optimization for (?:0x[0-9a-f]+ )?<SharedFunctionInfo ([^>]*)>, reason: ([^\]]*)\]/;
const RE_ABORTED = /aborted optimizing (?:0x[0-9a-f]+ )?<JSFunction ([^ >(]*)[^>]*> \(target ([A-Z_]+)\) because: ([^-\]]*?)(?: - took|\])/;

/** ブラウザの出力の行(Playwright の [pid][out] の行 —— 前置きは何でもよい)から、止まった関数(理由)と、打ち切りの回数を数える */
export function parseTrace346a(lines) {
  const disabled = {}, aborted = {};
  let outLines = 0;
  for (const raw of lines || []) {
    const l = String(raw);
    if (l.indexOf('][out]') >= 0 || l.indexOf('[out]') >= 0) outLines++;
    const d = l.match(RE_DISABLED);
    if (d) { const fn = d[1].trim() || '(無名)'; if (!(fn in disabled)) disabled[fn] = d[2].trim(); continue; }
    const a = l.match(RE_ABORTED);
    if (a) { const fn = a[1].trim() || '(無名)'; const k = fn + ' ' + a[2]; aborted[k] = (aborted[k] || 0) + 1; }
  }
  return { disabled, aborted, outLines };
}

/**
 * 走りの終わりの `%GetOptimizationStatus(HP.sim._core)` が「Sparkplug(基準の層)だけ —— 最適化の印が無い」か(V8 15.7 の bit の並び:
 * 8 = 最適化済み・16 = Maglev・32 = TurboFan・16384 = Sparkplug —— 第346便a で印の分かっている関数から測った意味。版に依る)。
 * 出力の行が拾えない回(renderer の標準出力が閉じる前に流れない)が在るので、門は「止まった行」と「状態の数」のどちらかで数える。
 */
export const coreBaselineOnly346a = (s) => Number.isFinite(s) && (s & 16384) !== 0 && (s & (8 | 16 | 32)) === 0;

/** 本 × 使い方の走り(runs)を、使い方ごとの「止まった関数 → 本」の表に畳む */
export function summarize346a(runs) {
  const out = {};
  for (const m of DECL_346A.modes) {
    const rs = (runs || []).filter((r) => r.mode === m);
    const byFn = {};
    for (const r of rs) for (const fn of Object.keys(r.disabled || {})) (byFn[fn] = byFn[fn] || []).push(r.preset);
    const byTrace = (byFn[DECL_346A.gate.fn] || []).slice(), byStatus = rs.filter((r) => coreBaselineOnly346a(r.coreStatus)).map((r) => r.preset);
    const core = rs.map((r) => r.preset).filter((p) => byTrace.includes(p) || byStatus.includes(p));
    out[m] = { n: rs.length, coreStopped: core, coreStoppedN: core.length, coreStoppedBy: { trace: byTrace, status: byStatus },
      fnStopped: Object.fromEntries(Object.keys(byFn).sort().map((k) => [k, byFn[k]])), errors: rs.filter((r) => r.error).map((r) => r.preset) };
  }
  return out;
}

/** 門: 記録のブラウザの V8 が 15.7 のときだけ、A/B で S._core が止まる本の数 ≤ 0 */
export function gate346a(summary, engine) {
  const G = DECL_346A.gate, v8 = engine && engine.v8 ? String(engine.v8) : null;
  const applies = !!v8 && v8.startsWith(G.v8Prefix);
  const s = summary && summary[G.mode];
  if (!applies) return { applies: false, pass: true, v8, note: `版が違う —— 比べない(記録の V8 ${v8 || '不明'}・門は V8 ${G.v8Prefix}x のときだけ)` };
  const n = s ? s.coreStoppedN : null;
  const errs = s ? s.errors.length : null;
  const pass = n !== null && n <= G.maxPresets && errs === 0;
  return { applies: true, pass, v8, n, note: pass ? `${G.mode} で ${G.fn} が止まる本 ${n}(上限 ${G.maxPresets})` : `${G.mode} で ${G.fn} が止まる本 ${n}(${s ? s.coreStopped.join('・') : '—'})・走りの誤り ${errs}` };
}

/** PHYSICS〔第346便a〕に逐語で載せる表(本 × 使い方 —— 止まった関数。時間は鎖の走りごとに揺れるので表に載せない) */
export function table346a(J) {
  const L = ['| 本 | ' + DECL_346A.modes.map((m) => DECL_346A.modeNames[m] + ' —— 止まった関数').join(' | ') + ' |', '|---|' + DECL_346A.modes.map(() => '---|').join('')];
  for (const p of DECL_346A.presets) {
    const cells = DECL_346A.modes.map((m) => {
      const r = (J.runs || []).find((x) => x.preset === p && x.mode === m);
      if (!r) return '—';
      if (r.error) return '走りの誤り';
      const fns = Object.keys(r.disabled || {}).sort();
      return fns.length ? fns.map((f) => '`' + f + '`').join('・') : 'なし';
    });
    L.push('| ' + p + ' | ' + cells.join(' | ') + ' |');
  }
  return L.join('\n');
}

/** 純関数の場面(QA が見る) */
export function pureScenes346a() {
  const P = '2026-11-21T00:00:00.000Z pw:browser [pid=1][out] ';
  const lines = [P + '[marking 0x1 <JSFunction f (sfi = 0x2)> for optimization to MAGLEV, ConcurrencyMode::kConcurrent, reason: hot and stable]',
    P + '[aborted optimizing 0x0d0e01b1f549 <JSFunction S._core (sfi = 0xd0e01636595)> (target TURBOFAN_JS) because: Function is too big to be optimized - took 0.004, 71.346, 0.000 ms]',
    P + '[disabled optimization for 0x0d0e01636595 <SharedFunctionInfo S._core>, reason: Function is too big to be optimized]',
    P + '[disabled optimization for 0x0d0e01636599 <SharedFunctionInfo reactionPass>, reason: Function is too big to be optimized]',
    P + '[disabled optimization for 0x0d0e01636595 <SharedFunctionInfo S._core>, reason: Function is too big to be optimized]'];
  const t = parseTrace346a(lines);
  const runs = [{ preset: 'a', mode: 'ab', disabled: {} }, { preset: 'b', mode: 'ab', disabled: { 'S._core': 'x' } }, { preset: 'a', mode: 'two', disabled: { 'S._core': 'x', reactionPass: 'x' } }];
  const sSt = summarize346a([{ preset: 'c', mode: 'ab', disabled: {}, coreStatus: 16385 }, { preset: 'd', mode: 'ab', disabled: {}, coreStatus: 41 }]);
  const s = summarize346a(runs), s0 = summarize346a([{ preset: 'a', mode: 'ab', disabled: { reactionPass: 'x' } }, { preset: 'a', mode: 'two', disabled: { 'S._core': 'x' } }]);
  return { t, s, s0, sSt, g157bad: gate346a(s, { v8: '15.7.112.43' }), g157ok: gate346a(s0, { v8: '15.7.112.43' }), g153: gate346a(s, { v8: '15.3.76.4' }), gNone: gate346a(s, null),
    gErr: gate346a(summarize346a([{ preset: 'a', mode: 'ab', error: 'x', disabled: {} }]), { v8: '15.7.1' }) };
}
export function pureGates346a(P) {
  return {
    parse: JSON.stringify(Object.keys(P.t.disabled).sort()) === JSON.stringify(['S._core', 'reactionPass']) && P.t.disabled['S._core'] === DECL_346A.reasonTooBig && P.t.aborted['S._core TURBOFAN_JS'] === 1 && P.t.outLines === 5,
    summary: P.s.ab.coreStoppedN === 1 && P.s.ab.coreStopped[0] === 'b' && P.s.two.fnStopped.reactionPass[0] === 'a' && P.s.two.coreStoppedN === 1
      && P.sSt.ab.coreStoppedN === 1 && P.sSt.ab.coreStoppedBy.status[0] === 'c' && P.sSt.ab.coreStoppedBy.trace.length === 0,
    gate157: P.g157bad.applies === true && P.g157bad.pass === false && P.g157ok.applies === true && P.g157ok.pass === true,
    otherVersion: P.g153.applies === false && P.g153.pass === true && /版が違う —— 比べない/.test(P.g153.note) && P.gNone.applies === false,
    twoNotGated: P.s0.two.coreStoppedN === 1 && P.g157ok.pass === true,
    error: P.gErr.applies === true && P.gErr.pass === false,
  };
}
