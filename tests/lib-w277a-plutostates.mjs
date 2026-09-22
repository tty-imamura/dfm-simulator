// 第277便a(第67報 (1)・統括の検証項目 R47): **冥王星系の状態ファイルの読取器**。
//
// ■ なぜ別ファイルなのか(`paper/data/solar-observations.csv` に入れない理由)
//   観測 CSV は「天体 × 量 × 出典」の**判定台帳**であり、`body|quantity` の**最初の行**が判定行に
//   なる(`tests/exp-w262d-solarsigma.mjs`)。同じ暦の状態ベクトルは 1 天体あたり 6 成分 × 2 元期
//   あり、これを同じ台帳に混ぜると「x 成分が判定行になる」種類の事故が起きる。したがって
//   **暦の状態は `paper/data/pluto-system-states.csv` に分ける**。sigma 列は**全行空**である
//   (Horizons の vectors / elements 出力は σ も共分散も印字しない)。
//
// ■ R47 が言う「別の量」を**数で**示すための診断(**採用値ではない**)
//   同じ冥王星系について、次の 3 つは**定義の違う 3 つの量**である:
//     (1) Buie 2012 の **two-body Keplerian sidereal period**(観測検定に使う行)
//     (2) PLU060 の **1800-2200 平均 osculating 周期**
//     (3) Horizons の **1 元期の osculating PR**(元期 A / 元期 B で違う)
//   本器の `relativeTwoBody()` は、この差が「較正の残差」ではなく**定義の差**であることを
//   数で見せるための診断である。**判定に使わない**・**採用値にしない**・**σ を作らない**。
//
// ■ `projectToOrbitPlane`(2D へ移すときの規約 — R47)
//   2D エンジンへ移すときに **z 成分を捨てない**。r と r×v から軌道面の正規直交基底 (e1,e2,e3)
//   を作り、**位置と速度を同じ回転で射影**する。面外成分(e3 方向)は**捨てずに返す**ので、
//   呼び出し側は「2D に落としたときに何を失ったか」を数で書ける。
//
// ■ この器がしないこと
//   ・値も σ も作らない(CSV に印字された数字と、そこから宣言した式の結果だけ)。
//   ・観測 CSV の判定行を 1 行も触らない。
//   ・GM を較正しない(`relativeTwoBody` の GM は**呼び出し側が宣言する入力**である)。
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { parseCsvLine, headerIndex } from './lib-w270b-obscsv.mjs';

/** 状態ファイルの必須列。 */
export const REQUIRED_COLUMNS = ['body', 'quantity', 'value', 'unit', 'epoch', 'center', 'frame',
  'ephemeris', 'source', 'url', 'retrieved', 'note', 'sigma', 'record_id'];
/** 状態成分の並び(この 6 つが 1 天体 1 元期の 1 組)。 */
export const COMPONENTS = ['state_x', 'state_y', 'state_z', 'state_vx', 'state_vy', 'state_vz'];
/** 収録している 6 体(Horizons の 999/901/902/903/904/905)。 */
export const BODIES = ['Pluto', 'Charon', 'Nix', 'Hydra', 'Kerberos', 'Styx'];
/** 収録している 2 元期。 */
export const EPOCHS = ['JD 2452600.5 TDB', 'JD 2457217.5 TDB'];
/** `record_id` の接頭辞(観測 CSV の `SOL-` と同じ生成規則・接頭辞だけが違う)。 */
export const ID_PREFIX = 'PSS';

/** `record_id` の素(`sha256(file\nbody\nquantity\nunit\nsource)` の先頭 8 桁)。 */
export function baseRecordId(file, body, quantity, unit, source) {
  const key = [path.basename(String(file || '')), String(body), String(quantity),
    String(unit), String(source)].join('\n');
  return ID_PREFIX + '-' + crypto.createHash('sha256').update(key, 'utf8').digest('hex').slice(0, 8);
}

/**
 * 状態ファイルを**ヘッダ名で**読む(列位置は 1 つも書かない)。
 * @param {string} fp 絶対パス
 */
export function loadPlutoStates(fp) {
  const out = { file: path.basename(fp), path: fp, header: null, rows: [], missing: [] };
  if (!fs.existsSync(fp)) return out;
  const lines = fs.readFileSync(fp, 'utf8').split('\n');
  const H = headerIndex(lines[0] || '');
  out.header = H;
  out.missing = REQUIRED_COLUMNS.filter((n) => !(n in H));
  const cell = (c, n) => ((n in H) && c[H[n]] !== undefined) ? c[H[n]] : '';
  for (let i = 1; i < lines.length; i++) {
    const L = lines[i];
    if (!L.trim()) continue;
    const c = parseCsvLine(L);
    const raw = String(cell(c, 'value')).trim();
    out.rows.push({
      ln: i + 1, body: cell(c, 'body'), quantity: cell(c, 'quantity'),
      rawValue: raw, value: (raw !== '' && Number.isFinite(Number(raw))) ? Number(raw) : null,
      unit: cell(c, 'unit'), epoch: cell(c, 'epoch'), center: cell(c, 'center'),
      frame: cell(c, 'frame'), ephemeris: cell(c, 'ephemeris'), source: cell(c, 'source'),
      url: cell(c, 'url'), retrieved: cell(c, 'retrieved'), note: cell(c, 'note'),
      rawSigma: String(cell(c, 'sigma')).trim(), recordId: String(cell(c, 'record_id')).trim(),
    });
  }
  return out;
}

/**
 * 整合検査(**数を返すだけ** —— 合否の言葉は呼び出し側が書く)。
 * @returns {{ok:boolean, problems:string[], tally:object, states:object}}
 */
export function checkPlutoStates(loaded) {
  const p = [];
  const L = loaded || { rows: [], missing: ['(ファイルが無い)'] };
  if (L.missing && L.missing.length) p.push('必須列が無い: ' + L.missing.join(','));
  const states = L.rows.filter((r) => COMPONENTS.indexOf(r.quantity) >= 0);
  const nonState = L.rows.filter((r) => COMPONENTS.indexOf(r.quantity) < 0);
  // ① 72 行(6 体 × 2 元期 × 6 成分)—— 食い違いで両方を残した成分があれば 72 を超える
  const grid = new Map();
  for (const r of states) grid.set(r.body + '|' + r.epoch + '|' + r.quantity,
    (grid.get(r.body + '|' + r.epoch + '|' + r.quantity) || 0) + 1);
  let missingCells = 0, duplicatedCells = 0;
  for (const b of BODIES) for (const e of EPOCHS) for (const q of COMPONENTS) {
    const n = grid.get(b + '|' + e + '|' + q) || 0;
    if (n === 0) { missingCells++; p.push('成分が無い: ' + b + ' ' + e + ' ' + q); }
    else if (n > 1) duplicatedCells++;
  }
  // ② 単位(位置 km・速度 km/s)
  for (const r of states) {
    const want = (r.quantity.indexOf('state_v') === 0) ? 'km/s' : 'km';
    if (r.unit !== want) p.push('単位が ' + want + ' でない: ' + r.body + ' ' + r.quantity + ' = ' + r.unit);
    if (r.value === null) p.push('値が数でない: ' + r.body + ' ' + r.quantity);
  }
  // ③ sigma 列は全行空(Horizons は σ も共分散も印字しない)
  const withSigma = L.rows.filter((r) => r.rawSigma !== '');
  if (withSigma.length) p.push('sigma 列が埋まっている行がある: ' + withSigma.length + ' 行');
  // ④ record_id の一意性と生成規則
  const ids = new Map();
  for (const r of L.rows) {
    if (!/^PSS-[0-9a-f]{8}(?:-\d+)?$/.test(r.recordId)) p.push('record_id の形が違う: ' + r.recordId);
    ids.set(r.recordId, (ids.get(r.recordId) || 0) + 1);
  }
  const dupIds = [...ids.entries()].filter(([, n]) => n > 1);
  if (dupIds.length) p.push('record_id が重複: ' + dupIds.slice(0, 3).map(([k]) => k).join(','));
  // ⑤ 元期・体の語彙
  const badEpoch = L.rows.filter((r) => EPOCHS.indexOf(r.epoch) < 0 && r.epoch !== 'not applicable');
  if (badEpoch.length) p.push('語彙外の元期: ' + badEpoch.length + ' 行');
  return { ok: p.length === 0, problems: p,
    tally: { rows: L.rows.length, stateRows: states.length, otherRows: nonState.length,
      bodies: BODIES.length, epochs: EPOCHS.length, missingCells, duplicatedCells,
      distinctIds: ids.size, rowsWithSigma: withSigma.length },
    states };
}

/** 1 体 1 元期の状態を {r:[x,y,z], v:[vx,vy,vz]} で取り出す(**最初の行**を採る)。 */
export function stateOf(loaded, body, epoch) {
  const g = (q) => {
    const hit = (loaded.rows || []).find((r) => r.body === body && r.epoch === epoch && r.quantity === q);
    return hit ? hit.value : null;
  };
  const r = [g('state_x'), g('state_y'), g('state_z')];
  const v = [g('state_vx'), g('state_vy'), g('state_vz')];
  if (r.some((z) => z === null) || v.some((z) => z === null)) return null;
  return { r, v };
}

// ---------------------------------------------------------------- ベクトル(3D)
const sub = (a, b) => [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
const dot = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
const cross = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
const norm = (a) => Math.sqrt(dot(a, a));
const scale = (a, k) => [a[0] * k, a[1] * k, a[2] * k];
export const vec = { sub, dot, cross, norm, scale };

/**
 * **軌道面の基底へ射影する**(R47: z を捨てない)。
 *   e1 = r/|r| ・ e3 = (r×v)/|r×v| ・ e2 = e3×e1
 * 位置と速度を**同じ回転**で射影し、面外成分(e3 方向)も返す。
 * 単体(r と v が平行・どちらかが 0)のときは `degenerate:true` を返して基底を作らない。
 * @param {number[]} r 位置(3 成分)
 * @param {number[]} v 速度(3 成分)
 * @returns {{degenerate:boolean, basis:number[][], pos:number[], vel:number[],
 *            posOutOfPlane:number, velOutOfPlane:number, h:number[]}}
 */
export function projectToOrbitPlane(r, v) {
  const h = cross(r, v);
  const nr = norm(r), nh = norm(h);
  if (!(nr > 0) || !(nh > 0)) {
    return { degenerate: true, basis: null, pos: null, vel: null,
      posOutOfPlane: null, velOutOfPlane: null, h };
  }
  const e1 = scale(r, 1 / nr);
  const e3 = scale(h, 1 / nh);
  const e2 = cross(e3, e1);
  const P = (a) => [dot(a, e1), dot(a, e2), dot(a, e3)];
  const pr = P(r), pv = P(v);
  return { degenerate: false, basis: [e1, e2, e3],
    pos: [pr[0], pr[1]], vel: [pv[0], pv[1]],
    posOutOfPlane: pr[2], velOutOfPlane: pv[2], h };
}

/**
 * 複数体を**同じ 1 つの回転**(基準体の軌道面)で射影し、面外成分の最大値を返す。
 * 「z を捨てたら何を失うか」を数で出すための関数である。
 * @param {Array<{body:string, r:number[], v:number[]}>} items
 * @param {{r:number[], v:number[]}} ref 基準(通常は主天体に対する相対状態)
 */
export function projectAll(items, ref) {
  const base = projectToOrbitPlane(ref.r, ref.v);
  if (base.degenerate) return { degenerate: true, rows: [], maxOutOfPlane: null };
  const [e1, e2, e3] = base.basis;
  const rows = (items || []).map((it) => {
    const pr = [dot(it.r, e1), dot(it.r, e2), dot(it.r, e3)];
    const pv = [dot(it.v, e1), dot(it.v, e2), dot(it.v, e3)];
    return { body: it.body, pos: [pr[0], pr[1]], vel: [pv[0], pv[1]],
      posOutOfPlane: pr[2], velOutOfPlane: pv[2] };
  });
  const maxOutOfPlane = rows.reduce((a, x) => Math.max(a, Math.abs(x.posOutOfPlane)), 0);
  return { degenerate: false, basis: base.basis, rows, maxOutOfPlane };
}

/**
 * **診断**(採用値ではない): 相対状態 r=x_B−x_A・v=v_B−v_A から二体の a と周期を作る。
 *   1/a = 2/|r| − |v|²/GM ・ P = 2π√(a³/GM)
 * `GM` は**呼び出し側が宣言する入力**であり、ここで較正しない。σ は作らない。
 * @param {{r:number[],v:number[]}} A 主天体の状態
 * @param {{r:number[],v:number[]}} B 伴天体の状態
 * @param {number} GM 系の GM(km³/s²・**宣言値**)
 */
export function relativeTwoBody(A, B, GM) {
  const r = sub(B.r, A.r), v = sub(B.v, A.v);
  const nr = norm(r), nv2 = dot(v, v);
  const inv = 2 / nr - nv2 / GM;
  const a = (inv !== 0) ? 1 / inv : null;
  const P = (a !== null && a > 0) ? 2 * Math.PI * Math.sqrt((a * a * a) / GM) : null;
  const h = cross(r, v);
  const ev = scale(sub(scale(r, nv2 - GM / nr), scale(v, dot(r, v))), 1 / GM);
  return { separation: nr, speed: Math.sqrt(nv2), semiMajorAxis: a, periodSec: P,
    eccentricity: norm(ev), specificAngularMomentum: norm(h), GM,
    note: 'diagnostic only — not an adopted value, not a judgement, no sigma is produced' };
}

/**
 * **診断**: 印字された a と周期から「4π²a³/P²」を作る(GM の合計とは別の量であることを示す)。
 */
export function gmFromAP(aKm, periodSec) {
  if (!(aKm > 0) || !(periodSec > 0)) return null;
  return 4 * Math.PI * Math.PI * aKm * aKm * aKm / (periodSec * periodSec);
}

export default { REQUIRED_COLUMNS, COMPONENTS, BODIES, EPOCHS, ID_PREFIX, baseRecordId,
  loadPlutoStates, checkPlutoStates, stateOf, projectToOrbitPlane, projectAll,
  relativeTwoBody, gmFromAP, vec };
