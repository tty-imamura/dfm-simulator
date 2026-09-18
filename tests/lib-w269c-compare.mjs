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
//
// ■ 第270便e(第60報 W5)の修正 —— 統括の読み (F) の F4/F5/F6/F7。**穴を塞いだだけで、法則は足していない。**
//   **F4** `Number(null)=0`・`Number('')=0`・`Number(true)=1` が「測れていないもの」を 0 や 1 に
//     化かす経路を `finiteNumber` で塞ぐ(**数値と、空でない数値文字列だけ**を通す)。
//     比較状態(`comparable`/`inside-interval`/`outside-interval`)では**有限な測定値**と
//     **空でない明示単位**を必須にし、観測側に単位があるときは**同一の明示単位**でなければ throw する。
//     p 値の禁止は `sim` と `obs` だけでなく **row 全体(`diagnostics` を含む)**へ広げた。
//   **F6** `validateWindow` —— 判定窓 T は**正**かつ **dt の整数倍**、チェックポイントは
//     **T 以下・昇順・重複なし・dt の整数倍**。破れば throw する(短い窓を黙って受けない)。
//   **F4(CSV)** `loadObsCsv` は**ヘッダ名で読む**(列位置に依存しない —— 第270便b が `record_id` 欄を
//     足しても壊れない)。**欠損は null**(`Number('')=0` にしない)。
import fs from 'node:fs';
import crypto from 'node:crypto';
// 第270便b(AE2): 観測 CSV の**ヘッダ名読み**(列位置で読まない)。
import { loadObsCsv as loadObsCsvByHeader } from './lib-w270b-obscsv.mjs';

export const STATES = ['comparable', 'inside-interval', 'outside-interval',
  'numerically-unresolved', 'mapping-unresolved', 'not-measurable', 'not-applicable'];
// **値(比較の数)を出してよい状態**。これ以外の状態の行には `sim.value` を置かない。
export const COMPARABLE_STATES = ['comparable', 'inside-interval', 'outside-interval'];

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

// ---------------------------------------------------------------- F4) 数値の入口
//   **`Number(null)=0` / `Number('')=0` / `Number(true)=1` / `Number([])=0` を塞ぐ。**
//   通すのは **有限な数値**と、**空でない数値文字列**だけ。それ以外(null・undefined・真偽値・
//   配列・オブジェクト・空文字・数値でない文字列)は **null**(= 測れていない)を返す。
//   **「測れていない」を 0 に化かさない**ことが、この比較器の ④(0 補完の禁止)の入口である。
export function finiteNumber(v) {
  if (typeof v === 'number') return Number.isFinite(v) ? v : null;
  if (typeof v === 'string') {
    const t = v.trim();
    if (t === '') return null;
    const z = Number(t);
    return Number.isFinite(z) ? z : null;
  }
  return null;
}

// ---------------------------------------------------------------- F6) 判定窓の検査
//   **T は正・dt の整数倍**、**チェックポイントは T 以下・昇順・重複なし・dt の整数倍**。
//   破れば throw する(`--T 1` のような短い窓や、T を越えるチェックポイントを黙って受けない)。
export function validateWindow(spec) {
  const s = spec || {};
  const T = finiteNumber(s.T), dt = finiteNumber(s.dt);
  if (dt === null || !(dt > 0)) throw new Error('窓: dt が正の有限値でない: ' + String(s.dt));
  if (T === null || !(T > 0)) throw new Error('窓: T が正の有限値でない: ' + String(s.T));
  const mult = (z) => { const k = z / dt; return Math.abs(k - Math.round(k)) <= 1e-9 * Math.max(1, Math.abs(k)); };
  if (!mult(T)) throw new Error(`窓: T=${T} が dt=${dt} の整数倍でない(步数が整数にならない)`);
  const cps = Array.isArray(s.checkpoints) ? s.checkpoints.slice() : [];
  let prev = -Infinity;
  for (const c of cps) {
    const z = finiteNumber(c);
    if (z === null) throw new Error('窓: チェックポイントに有限でない値がある: ' + String(c));
    if (z < 0) throw new Error('窓: チェックポイントが負である: ' + z);
    if (z > T + 1e-12) throw new Error(`窓: チェックポイント ${z} が T=${T} を越えている`);
    if (!(z > prev)) throw new Error(`窓: チェックポイントが昇順でない/重複している(${prev} → ${z})`);
    if (!mult(z)) throw new Error(`窓: チェックポイント ${z} が dt=${dt} の整数倍でない`);
    prev = z;
  }
  return { T, dt, steps: Math.round(T / dt), checkpoints: cps.map((z) => finiteNumber(z)),
    note: '**T は正かつ dt の整数倍**・**チェックポイントは T 以下の昇順(重複なし・dt の整数倍)**。'
      + '**主判定窓を短い側へ移して成功を選ばない**(第270便e・AE4)。' };
}

// ---------------------------------------------------------------- 観測側(区間)
//   CSV の `sigma_kind=ci90` 行から作る。**中央値は「区間の代表値」であって σ ではない。**
export function interval(spec) {
  const s = spec || {};
  const lo = finiteNumber(s.lower), hi = finiteNumber(s.upper);
  if (lo === null || hi === null || !(hi > lo))
    throw new Error('区間が成立していない(lower < upper が要る): ' + JSON.stringify([s.lower, s.upper]));
  if (typeof s.unit !== 'string' || !s.unit.trim())
    throw new Error('区間に**明示単位**が無い(単位なしの区間は作らない): ' + JSON.stringify(s.lower));
  if (s.sigma !== undefined && s.sigma !== null)
    throw new Error('**非対称区間に対称 σ を同時に持たせない**(換算の入口を塞ぐ)');
  assertNoPValue(s, 'obs');
  const mid = finiteNumber(s.value);
  return { value: mid,
    lower: lo, upper: hi, unit: String(s.unit).trim(),
    confidence: finiteNumber(s.confidence),
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
// 第271便d(統括の検証項目 R6): **`interval()` は逆転区間を弾くのに `intervalState()` は弾いていなかった**
//   —— 手で組んだ `{lower, upper}`(CSV の note からそのまま作った帯・外から渡された診断欄)が
//   upper ≤ lower のまま入ると、`offsetInWidths` の分母 `upper−lower` が **0 か負**になり、
//   「区間の外へどれだけ出たか」が符号ごと反転した有限値として出ていた。
//   **裁定(この便で決めた片方)**: **throw する**(`mapping-unresolved` を返さない)。
//   理由は 2 つ —— ① `mapping-unresolved` は「器の量と観測量の**対応が決まっていない**」という
//   **物理の状態**であって、**壊れた入力の受け皿ではない**(状態の集計に混ぜると、対応未宣言の件数が
//   入力ミスで水増しされる)。② `interval()` が同じ条件で throw する以上、同じ契約を
//   `intervalState()` だけ緩めると、**`interval()` を通さない経路が抜け道になる**。
export function intervalState(value, obs) {
  if (!obs || finiteNumber(obs.lower) === null || finiteNumber(obs.upper) === null)
    return { state: 'mapping-unresolved', reason: '観測側に区間が無い' };
  const lo0 = finiteNumber(obs.lower), hi0 = finiteNumber(obs.upper);
  if (!(hi0 > lo0))
    throw new Error('区間が逆転している/幅が 0 である(lower < upper が要る): '
      + JSON.stringify([obs.lower, obs.upper])
      + ' —— **壊れた区間を `mapping-unresolved` にして集計へ流さない**(第271便d・R6)');
  const v0 = finiteNumber(value);
  if (v0 === null) return { state: 'not-measurable', reason: '器の値が得られていない' };
  const inside = v0 >= obs.lower && v0 <= obs.upper;
  return { state: inside ? 'inside-interval' : 'outside-interval',
    reason: inside ? '公表区間の内側(**合格とは言わない**)' : '公表区間の外側(**棄却とは言わない**)',
    // **区間の外へどれだけ出たか**は区間幅で測る(σ 倍ではない —— 非対称なので σ は無い)
    offsetInWidths: inside ? 0
      : (v0 < obs.lower ? (v0 - obs.lower) : (v0 - obs.upper)) / (obs.upper - obs.lower) };
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
  // F4) **p 値の禁止は row 全体へ**(`diagnostics` の奥に隠しても止める)
  assertNoPValue(s, 'row');
  const v = finiteNumber(sim.value);
  // ④ **0 や最後の値で補わない**の機械化
  if (s.state === 'not-measurable' && v !== null)
    throw new Error('`not-measurable` の行に値を置けない(0 補完の禁止): ' + s.quantity);
  // F4) **比較状態は「有限な測定値」+「空でない明示単位」+「観測と同一の単位」を必須にする**
  const simUnit = (typeof sim.unit === 'string') ? sim.unit.trim() : '';
  if (COMPARABLE_STATES.indexOf(s.state) >= 0) {
    if (v === null)
      throw new Error(`状態 ${s.state} には**有限な測定値**が要る(測れていないなら別の状態): ${s.quantity}`);
    if (!simUnit)
      throw new Error(`状態 ${s.state} には**空でない明示単位**が要る(単位なしの比較は作らない): ${s.quantity}`);
    // 第271便d(統括の検証項目 R6): **観測側の入口ガード。**
    //   旧版は「**obs 単位があるときだけ**照合する」だったので、**obs が null・空・単位なしでも
    //   comparable 系の状態が通っていた**(= 何と並べたのかが JSON に無いまま「比較の前提が揃った」と
    //   書ける経路が残っていた)。比較状態は**相手が居て初めて成立する**ので、
    //   **① obs が存在すること ② obs に空でない明示単位があり sim と一致すること
    //   ③ 有限な観測値か、有効な区間(lower < upper)のどちらかを持つこと**を必須にする。
    //   **数値が合うかどうかは一切見ない**(合否ではなく「並べられる形か」だけを見る門である)。
    if (!s.obs || typeof s.obs !== 'object')
      throw new Error(`状態 ${s.state} には**観測側の行**が要る(obs が無い比較状態は作らない): ${s.quantity}`);
    const obsUnit = (typeof s.obs.unit === 'string') ? s.obs.unit.trim() : '';
    if (!obsUnit)
      throw new Error(`状態 ${s.state} の obs に**空でない明示単位**が無い`
        + `(単位なしの観測と並べない): ${s.quantity}`);
    if (obsUnit !== simUnit)
      throw new Error(`単位が一致しない(暗黙換算を作らない): ${s.quantity} —— sim "${simUnit}" / obs "${obsUnit}"`);
    const obsV = finiteNumber(s.obs.value);
    const obsLo = finiteNumber(s.obs.lower), obsHi = finiteNumber(s.obs.upper);
    const hasInterval = (obsLo !== null && obsHi !== null);
    if (hasInterval && !(obsHi > obsLo))
      throw new Error(`obs の区間が逆転している/幅が 0 である: ${s.quantity} —— `
        + JSON.stringify([s.obs.lower, s.obs.upper]));
    if (obsV === null && !hasInterval)
      throw new Error(`状態 ${s.state} の obs に**有限な観測値も有効な区間も無い**`
        + `(空欄・null・単位だけの行と並べない —— `
        + `\`Number(null)=0\` の穴は F4 で塞いだが、**そもそも相手が居ない**のはここで止める): ${s.quantity}`);
  }
  const st = { h: null, h2: null, h4: null };
  for (const k of ['h', 'h2', 'h4']) st[k] = finiteNumber((sim.stages || {})[k]);
  // ⑤ **状態と区間判定を食い違わせない**(手で書いた inside/outside を再計算で照合する)
  if (s.state === 'inside-interval' || s.state === 'outside-interval') {
    const chk = intervalState(v, s.obs);
    if (chk.state !== s.state)
      throw new Error(`状態が区間判定と食い違う: ${s.quantity}(書かれた ${s.state} / 実際 ${chk.state})`);
  }
  return { quantity: String(s.quantity),
    sim: { value: v, unit: simUnit,
      window: sim.window === undefined ? null : sim.window,
      extractor: sim.extractor === undefined ? null : sim.extractor,
      stages: st,
      order: finiteNumber(sim.order),
      extrapolated: finiteNumber(sim.extrapolated) },
    obs: s.obs === undefined ? null : s.obs,
    state: s.state, reason: s.reason,
    diagnostics: s.diagnostics === undefined ? null : s.diagnostics };
}

// ---------------------------------------------------------------- 保存行の再検証(第271便d・R6)
//   **保存 JSON の比較行を、そのまま入口ガードへ通し直す。** 器を走らせずに
//   「今のガードなら、この行は作れるのか」を機械で言えるようにする(QA `behavior.compareObsRequired`)。
//   返すのは `{ok, error}` だけで、**行を書き換えない・状態を付け替えない**。
export function recheckSavedRow(row) {
  const r = row || {};
  try {
    compareRow({ quantity: r.quantity, state: r.state, reason: r.reason,
      sim: r.sim || {}, obs: r.obs, diagnostics: r.diagnostics });
    return { ok: true, error: null };
  } catch (e) { return { ok: false, error: String((e && e.message) || e) }; }
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

// F4) **ヘッダ名で読む**(列位置に依存しない —— 第270便b がヘッダ末尾に `record_id` を足しても、
//   列を増やしても壊れない)。**欠損は null**(`Number('')=0` にしない —— `finiteNumber` が入口)。
//   返す行は `col(名前)` で生の文字列も引ける(未知の欄を落とさない)。
export function loadObsCsv(fp) {
  const rows = [];
  if (!fs.existsSync(fp)) return rows;
  // 統括の統合(第270便): 読みの正本は lib-w270b-obscsv(ヘッダ名読み・record_id)に 1 本化し、
  // 第270便e の**欠損ガード**(`finiteNumber`・空欄→null・非列挙の `col`/`header`)をその上に重ねる。
  const loaded = loadObsCsvByHeader(fp);
  for (const r of loaded.rows) {
    const str = (name) => { const z = r.cell(name); return (z === null || z === undefined || String(z).trim() === '') ? null : String(z); };
    rows.push({ body: str('body'), quantity: str('quantity'),
      value: finiteNumber(r.rawValue), unit: str('unit'),
      source: str('source'), url: str('url'), retrieved: str('retrieved'),
      note: str('note') || '', ln: r.ln,
      sigmaCol: finiteNumber(r.rawSigma),
      recordId: str('record_id'), solutionId: str('solution_id') });
    // **生の欄は非列挙**(JSON へ漏らさない)。`col('任意の欄名')` で引ける。
    Object.defineProperty(rows[rows.length - 1], 'col', { value: (name) => str(name), enumerable: false });
    Object.defineProperty(rows[rows.length - 1], 'header', { value: (loaded.header && loaded.header.names) ? loaded.header.names.slice() : (loaded.header ? Object.keys(loaded.header).filter((k) => typeof loaded.header[k] === 'number') : null), enumerable: false });
  }
  return rows;
}
