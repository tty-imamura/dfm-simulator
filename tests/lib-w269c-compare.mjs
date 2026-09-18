// 第269便c(第59報 W3)「**比較サンプル v1** の明示状態ライブラリ」。
//
// ■ 原仮定者の指示(第59報): 「ブラックホール連星、星団、銀河の各サンプルの完成を目指す」。
//   統括の読み (A): **「完成」は「比較サンプル v1」である** ——
//     ① 使う力学・外部モデル・転写した入力・fit 対象・未使用の検証量を明示する
//     ② 観測版と量の定義・単位・座標系・時刻系・評価窓・抽出器を固定する
//     ③ 対照走行と数値精度(h/h2/h4・N・seed)を検証し、各結果を**明示状態**で出す
//     ④ 観測量が得られないとき **0 や最後の値で補わない**
//     ⑤ 限界と否定結果を UI・文書・JSON で一致させる
//   **観測一致は別段階(「観測一致版」)であり、3 つとも現時点で未達である。**
//   **完成 = 較正 3σ ではない。** NS と同じ 2 量・同じ 3σ 器へは押し込まない。
//
// ■ 明示状態の語彙(7 語・これ以外は作らない)
//   `comparable`             … 比較の前提(定義・単位・座標系・窓・抽出器・数値精度)が揃い、
//                              数値が並んだ —— **区間判定を持たない量**の並置はここで止める。
//   `inside-interval`        … 公表**区間**の内側にある(区間の中/外だけを言う。合格とは言わない)。
//   `outside-interval`       … 公表**区間**の外側にある(不合格とも「棄却」とも言わない)。
//   `numerically-unresolved` … 量は測れるが**刻み依存が判定幅より大きい**(h/h2/h4 が収束していない)。
//   `mapping-unresolved`     … 器の量と観測量の**対応が決まっていない**(どちらの層・どちらの中心・
//                              どちらのトレーサに当てるかが未宣言)。**数値の不一致ではない。**
//   `not-measurable`         … この器ではその量を**測れない**。**値は null**(0 や最後の値で補わない)。
//   `not-applicable`         … その量が**この走行に当てはまらない**(合体していないモデルの remnant 量・
//                              独立観測量ではない派生参照値など)。
//
// ■ この器が**しないこと**(契約 —— 破ると throw する)
//   ・**非対称 90% 区間を対称 1σ に換算しない**(`lower/upper` のまま運ぶ)。
//   ・**周辺区間の AND を「同時 90% 領域」と呼ばない**(`MARGINAL_AND_NOTE` を必ず持ち回る)。
//   ・**χ² の p 値を出さない**(`pValue`・`chi2p`・`pval` という鍵を受け取ったら throw)。
//   ・**`not-measurable` の行に値を入れない**(0 補完の機械的禁止)。
//   ・**状態を手で書いた区間判定と食い違わせない**(`inside/outside-interval` は再計算して照合する)。
//
// ■ ここに無いもの(意図的に)
//   観測値(CSV が正本)・合否の閾値・力学(エンジンには触れない)。`S._core` には 1 命令も足していない。
import fs from 'node:fs';
import crypto from 'node:crypto';
// 第270便b(AE2): 観測 CSV の**ヘッダ名読み**(列位置で読まない)。
import { loadObsCsv as loadObsCsvByHeader } from './lib-w270b-obscsv.mjs';

export const STATES = ['comparable', 'inside-interval', 'outside-interval',
  'numerically-unresolved', 'mapping-unresolved', 'not-measurable', 'not-applicable'];

export const MARGINAL_AND_NOTE
  = '**周辺区間の AND を同時 90% 領域と呼ばない。** 各行は 1 量の周辺区間の内/外だけを言う。';
export const ASYMMETRIC_NOTE
  = '**非対称 90% 区間を対称 1σ に換算しない。** lower/upper と confidence をそのまま運ぶ。';
export const NO_PVALUE_NOTE
  = '**χ² の p 値は出さない。** 残差は観測誤差単位の診断表示にとどめ、'
  + '全点が区間内であることを系全体の合格と呼ばない。';

const FORBIDDEN_KEYS = ['pValue', 'pvalue', 'p_value', 'chi2p', 'chiSquaredP', 'pval'];

function assertNoPValue(o, where) {
  if (!o || typeof o !== 'object') return;
  for (const k of Object.keys(o)) {
    if (FORBIDDEN_KEYS.indexOf(k) >= 0) throw new Error(`p 値の鍵を置けない: ${where}.${k}`);
    if (o[k] && typeof o[k] === 'object') assertNoPValue(o[k], where + '.' + k);
  }
}

// ---------------------------------------------------------------- 観測側(区間)
//   CSV の `sigma_kind=ci90` 行から作る。**中央値は「区間の代表値」であって σ ではない。**
export function interval(spec) {
  const s = spec || {};
  const lo = Number(s.lower), hi = Number(s.upper);
  if (!Number.isFinite(lo) || !Number.isFinite(hi) || !(hi > lo))
    throw new Error('区間が成立していない(lower < upper が要る): ' + JSON.stringify([s.lower, s.upper]));
  if (s.sigma !== undefined && s.sigma !== null)
    throw new Error('**非対称区間に対称 σ を同時に持たせない**(換算の入口を塞ぐ)');
  assertNoPValue(s, 'obs');
  const mid = Number.isFinite(Number(s.value)) ? Number(s.value) : null;
  return { value: mid,
    lower: lo, upper: hi, unit: String(s.unit || ''),
    confidence: Number.isFinite(Number(s.confidence)) ? Number(s.confidence) : null,
    frame: s.frame === undefined ? null : s.frame,
    source: s.source === undefined ? null : s.source,
    role: s.role === undefined ? null : s.role,
    verifiedMark: s.verifiedMark === undefined ? null : s.verifiedMark,
    // **上側と下側の幅が違う**ことを欄として残す(対称 σ へ潰す経路を作らないため)
    upperWidth: mid === null ? null : hi - mid,
    lowerWidth: mid === null ? null : mid - lo,
    asymmetric: mid === null ? null : Math.abs((hi - mid) - (mid - lo)) > 1e-12,
    note: ASYMMETRIC_NOTE + ' ' + MARGINAL_AND_NOTE };
}

// 区間の**内/外だけ**を返す(合否ではない)。値が無ければ判定しない。
export function intervalState(value, obs) {
  if (!obs || !Number.isFinite(obs.lower) || !Number.isFinite(obs.upper))
    return { state: 'mapping-unresolved', reason: '観測側に区間が無い' };
  if (!Number.isFinite(value)) return { state: 'not-measurable', reason: '器の値が得られていない' };
  const inside = value >= obs.lower && value <= obs.upper;
  return { state: inside ? 'inside-interval' : 'outside-interval',
    reason: inside ? '公表区間の内側(**合格とは言わない**)' : '公表区間の外側(**棄却とは言わない**)',
    // **区間の外へどれだけ出たか**は区間幅で測る(σ 倍ではない —— 非対称なので σ は無い)
    offsetInWidths: inside ? 0
      : (value < obs.lower ? (value - obs.lower) : (value - obs.upper)) / (obs.upper - obs.lower) };
}

// ---------------------------------------------------------------- 1 行を作る
//   {quantity, sim:{value, unit, window, extractor, stages:{h,h2,h4}, order, extrapolated},
//    obs:{...}, state, reason}
export function compareRow(spec) {
  const s = spec || {};
  if (!s.quantity) throw new Error('quantity が無い');
  if (STATES.indexOf(s.state) < 0) throw new Error('語彙外の状態: ' + s.state);
  if (typeof s.reason !== 'string' || !s.reason.trim())
    throw new Error('reason が無い(状態には必ず理由を書く): ' + s.quantity);
  const sim = s.sim || {};
  assertNoPValue(sim, 'sim'); assertNoPValue(s.obs, 'obs');
  const v = (sim.value === undefined || sim.value === null) ? null
    : (Number.isFinite(Number(sim.value)) ? Number(sim.value) : null);
  // ④ **0 や最後の値で補わない**の機械化
  if (s.state === 'not-measurable' && v !== null)
    throw new Error('`not-measurable` の行に値を置けない(0 補完の禁止): ' + s.quantity);
  const st = { h: null, h2: null, h4: null };
  for (const k of ['h', 'h2', 'h4']) {
    const z = (sim.stages || {})[k];
    st[k] = (z === undefined || z === null || !Number.isFinite(Number(z))) ? null : Number(z);
  }
  // ⑤ **状態と区間判定を食い違わせない**(手で書いた inside/outside を再計算で照合する)
  if (s.state === 'inside-interval' || s.state === 'outside-interval') {
    const chk = intervalState(v, s.obs);
    if (chk.state !== s.state)
      throw new Error(`状態が区間判定と食い違う: ${s.quantity}(書かれた ${s.state} / 実際 ${chk.state})`);
  }
  return { quantity: String(s.quantity),
    sim: { value: v, unit: String(sim.unit || ''),
      window: sim.window === undefined ? null : sim.window,
      extractor: sim.extractor === undefined ? null : sim.extractor,
      stages: st,
      order: (sim.order === undefined || sim.order === null || !Number.isFinite(Number(sim.order)))
        ? null : Number(sim.order),
      extrapolated: (sim.extrapolated === undefined || sim.extrapolated === null
        || !Number.isFinite(Number(sim.extrapolated))) ? null : Number(sim.extrapolated) },
    obs: s.obs === undefined ? null : s.obs,
    state: s.state, reason: s.reason,
    diagnostics: s.diagnostics === undefined ? null : s.diagnostics };
}

// 状態の集計(**「合格数」ではない** —— 状態ごとの本数である)
export function tallyStates(rows) {
  const t = {};
  for (const w of STATES) t[w] = 0;
  for (const r of (rows || [])) {
    if (t[r.state] === undefined) throw new Error('語彙外の状態が混ざった: ' + r.state);
    t[r.state]++;
  }
  return t;
}

// ---------------------------------------------------------------- 刻印
//   **いつ・何を読んで**この JSON が作られたかを残す(入力 CSV の SHA・コード版・宣言版)。
export function fileStamp(abs, rel) {
  try {
    const b = fs.readFileSync(abs);
    return { file: rel || abs, bytes: b.length,
      sha256: crypto.createHash('sha256').update(b).digest('hex'),
      mtime: fs.statSync(abs).mtime.toISOString() };
  } catch { return { file: rel || abs, missing: true }; }
}

export function measurementStamp(o) {
  const s = o || {};
  return { measuredAt: new Date().toISOString(),
    codeVersion: s.codeVersion === undefined ? null : s.codeVersion,
    declarationVersion: s.declarationVersion === undefined ? null : s.declarationVersion,
    inputs: Array.isArray(s.inputs) ? s.inputs : [],
    vocabulary: STATES.slice(),
    contract: [ASYMMETRIC_NOTE, MARGINAL_AND_NOTE, NO_PVALUE_NOTE,
      '**観測量が得られないときは `not-measurable`(値 null)** —— 0 や最後の値で補わない。',
      '**「完成」は比較サンプル v1 である。観測一致は別段階で、現時点で未達である。**'] };
}

// ---------------------------------------------------------------- CSV 読み(共通)
// 第270便b(第60報 W2・AE2): 分解と**ヘッダ名引き**は `tests/lib-w270b-obscsv.mjs` の 1 本を使う
// (`record_id` の列追加で壊れないため —— 読む欄は位置でなく名前で決まる)。
// 既存の輸出名 `parseCsvLine` はそのまま再輸出する(呼び側を 1 つも変えない)。
export { parseCsvLine } from './lib-w270b-obscsv.mjs';

// `note` 欄の `key=value;` を読む(CSV の 90% 区間は note の `ci90_lo=`/`ci90_hi=` に入っている)。
export function noteField(note, key) {
  const m = new RegExp('(?:^|[;\\s])' + key + '=([^;]*)').exec(String(note || ''));
  return m ? m[1].trim() : null;
}

export function loadObsCsv(fp) {
  const rows = [];
  if (!fs.existsSync(fp)) return rows;
  for (const r of loadObsCsvByHeader(fp).rows) {
    rows.push({ body: r.body, quantity: r.quantity, value: Number(r.rawValue), unit: r.unit,
      source: r.source, url: r.url, note: r.note || '', ln: r.ln,
      recordId: r.recordId || null,
      sigmaCol: (r.rawSigma !== '') ? Number(r.rawSigma) : null });
  }
  return rows;
}
