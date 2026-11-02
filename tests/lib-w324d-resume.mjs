// 第324便d(決断事項 AN480・AN452・統括の検証項目 R282): **長い段の再開の型** —— 保存と検証の lib(純関数 + ファイルの原子的な保存)。
//
// ■ 何をするか(2 つを分けて実装する)
//   (a) **完了済みのジョブの再利用**(jobStore): ジョブ 1 本(走行の仕様 1 つ)の結果を、契約(入力・器・環境・版の hash)つきで 1 ファイルに保存する。
//       同じ契約なら結果の本文(子プロセスが印字した JSON の文字列そのもの)を読んで再利用し、違えば走らせる。結果の本文の sha256 も持ち、壊れた写しは使わない。
//   (b) **途中の步からの積分の再開**(writeCheckpoint / readCheckpoint): **安全な步の境界**(S.step の呼び出しの間)で、積分器の全状態(html の保存と復帰の口
//       HP.ckSnapOne —— 状態の契約 CK_ARRS・CK_SC・CK_DEEP と機能ごとの写し〔三次元の c3・慣性決定力の rd・参照模型の st・固定中心〕)・検出器の累積・
//       步の番号と窓の終わりを 1 ファイルに保存する。書き方は**一時ファイル → fsync → rename**(書きかけを正本の名で残さない)。
//       読むときは 形(magic)・頭の JSON・長さ(書きかけ・切れた)・本文の sha256(壊れた)・契約(違う入力・器・環境・版)を順に確かめ、1 つでも外れたら**拒否**する。
//   値の表現は**丸めの無い形**: 数はすべて Float64 のビット(16 桁の 16 進 —— -0・NaN・±Infinity も保つ)・型つき配列は型の名とバイト列そのもの・
//   数だけの配列はバイト列(戻すと素の Array)・undefined は印で保つ・オブジェクトの鍵は元の順。符号化できない型(関数・Map・Set・Date …)は黙って落とさずに例外。
//
// ■ 言わないこと
//   「再開できたので物理として正しい」(門は**同じ入力・同じコード・同じ環境・同じ步の列なら、止めて続けても同じビット**であることだけを見る)。
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { canonText, sha256Of } from './lib-w322d-nslockmerge.mjs';

export const RESUME_VERSION = 'w324d-resume-1';
export const MAGIC = 'DFM-W324D-RESUME-1';
export const DONE_VERSION = 'w324d-done-1';
export { canonText, sha256Of };

/* ───────── 丸めの無い符号化 ───────── */
const DV = new DataView(new ArrayBuffer(8));
/** 数 → Float64 のビット(16 進 16 桁) */
export const f64Hex = (x) => { DV.setFloat64(0, x); return DV.getBigUint64(0).toString(16).padStart(16, '0'); };
/** 1 ulp 動かす(ビットの整数に 1 を足す —— 絶対値が 1 ulp 大きい側。否定対照の「1 欄を塗る」に使う) */
export const nextUp = (x) => { DV.setFloat64(0, x); DV.setBigUint64(0, DV.getBigUint64(0) + 1n); return DV.getFloat64(0); };
/** Float64 のビット(16 進 16 桁)→ 数 */
export const hexF64 = (h) => { DV.setBigUint64(0, BigInt('0x' + h)); return DV.getFloat64(0); };
export const TYPED = Object.freeze(['Float64Array', 'Float32Array', 'Int8Array', 'Uint8Array', 'Uint8ClampedArray', 'Int16Array', 'Uint16Array', 'Int32Array', 'Uint32Array', 'BigInt64Array', 'BigUint64Array']);
const CTOR = Object.fromEntries(TYPED.map((n) => [n, globalThis[n]]));
/** 数だけの配列をバイト列にする長さの下限(短い配列は要素ごとの印 —— どちらもビットは同じ) */
export const PACK_MIN = 8;
/** 素のオブジェクトか(別の realm —— vm の文脈で動く html —— の Object も受ける: 原型が null か、原型の原型が null で原型の constructor の名が Object) */
const isPlain = (v) => { const p = Object.getPrototypeOf(v); return p === null || (Object.getPrototypeOf(p) === null && !!p.constructor && p.constructor.name === 'Object'); };
const bytesOf = (ta) => new Uint8Array(ta.buffer.slice(ta.byteOffset, ta.byteOffset + ta.byteLength));

/**
 * 値 → JSON にできる木(blobs にバイト列を積む)。
 *   数 {$f:hex}・undefined {$u:1}・型つき配列 {$t:名, b:番号, n:長さ}・数だけの配列 {$p:番号, n}・配列 {$a:[…]}・オブジェクト {$o:[[鍵, 値]…]}・文字列・真偽・null はそのまま
 */
export function encodeTree(v, blobs) {
  if (v === null || typeof v === 'string' || typeof v === 'boolean') return v;
  if (v === undefined) return { $u: 1 };
  if (typeof v === 'number') return { $f: f64Hex(v) };
  if (typeof v !== 'object') throw new Error('符号化できない型: ' + typeof v);
  if (ArrayBuffer.isView(v)) {
    const nm = v.constructor && v.constructor.name;
    if (!TYPED.includes(nm)) throw new Error('符号化できない型つき配列: ' + nm);
    blobs.push(bytesOf(v)); return { $t: nm, b: blobs.length - 1, n: v.length };
  }
  if (Array.isArray(v)) {
    if (v.length >= PACK_MIN && v.every((x) => typeof x === 'number')) { const f = Float64Array.from(v); blobs.push(new Uint8Array(f.buffer)); return { $p: blobs.length - 1, n: v.length }; }   // 新しい buffer —— 写しは 1 回
    return { $a: v.map((x) => encodeTree(x, blobs)) };
  }
  if (!isPlain(v)) throw new Error('符号化できない型: ' + (v.constructor && v.constructor.name));
  return { $o: Object.keys(v).map((k) => [k, encodeTree(v[k], blobs)]) };
}
/** 木 → 値(blobs は Uint8Array の列) */
export function decodeTree(t, blobs) {
  if (t === null || typeof t === 'string' || typeof t === 'boolean') return t;
  if (typeof t !== 'object') throw new Error('木の形が違う: ' + typeof t);
  if (t.$u === 1) return undefined;
  if (typeof t.$f === 'string') return hexF64(t.$f);
  if (typeof t.$t === 'string') {
    const C = CTOR[t.$t]; if (!C) throw new Error('型つき配列の名が違う: ' + t.$t);
    const b = blobs[t.b]; if (!b) throw new Error('バイト列が無い: ' + t.b);
    const buf = new ArrayBuffer(b.byteLength); new Uint8Array(buf).set(b);
    const a = new C(buf); if (a.length !== t.n) throw new Error('型つき配列の長さが違う: ' + t.$t); return a;
  }
  if (Number.isInteger(t.$p)) {
    const b = blobs[t.$p]; if (!b) throw new Error('バイト列が無い: ' + t.$p);
    const buf = new ArrayBuffer(b.byteLength); new Uint8Array(buf).set(b);
    const a = Array.from(new Float64Array(buf)); if (a.length !== t.n) throw new Error('数の配列の長さが違う'); return a;
  }
  if (Array.isArray(t.$a)) return t.$a.map((x) => decodeTree(x, blobs));
  if (Array.isArray(t.$o)) { const o = {}; for (const [k, x] of t.$o) o[k] = decodeTree(x, blobs); return o; }
  throw new Error('木の印が無い');
}
/** 2 つの値が全欄で同じビットか(型つき配列はバイト・数は Float64 のビット・オブジェクトは鍵の集合と順も —— unordered なら鍵の順は見ない)。差の路を max 件まで返す */
export function bitDiff(a, b, max = 20, p = '', unordered = false) {
  const out = [];
  const walk = (x, y, q) => {
    if (out.length >= max) return;
    if (typeof x === 'number' || typeof y === 'number') { if (!(typeof x === 'number' && typeof y === 'number' && f64Hex(x) === f64Hex(y))) out.push(q || '/'); return; }
    if (x === null || y === null || typeof x !== 'object' || typeof y !== 'object') { if (x !== y) out.push(q || '/'); return; }
    if (ArrayBuffer.isView(x) || ArrayBuffer.isView(y)) {
      if (!(ArrayBuffer.isView(x) && ArrayBuffer.isView(y) && x.constructor.name === y.constructor.name && x.byteLength === y.byteLength && Buffer.from(bytesOf(x)).equals(Buffer.from(bytesOf(y))))) out.push(q + '(型つき配列)');
      return;
    }
    if (Array.isArray(x) !== Array.isArray(y)) { out.push(q + '(配列と非配列)'); return; }
    if (Array.isArray(x)) { if (x.length !== y.length) { out.push(q + '(長さ ' + x.length + ' ≠ ' + y.length + ')'); return; } for (let i = 0; i < x.length; i++) walk(x[i], y[i], q + '/' + i); return; }
    const kx = Object.keys(x), ky = Object.keys(y);
    if ((unordered ? kx.slice().sort().join('\u0001') !== ky.slice().sort().join('\u0001') : kx.join('\u0001') !== ky.join('\u0001'))) { out.push(q + '(鍵 ' + kx.filter((k) => !ky.includes(k)).concat(ky.filter((k) => !kx.includes(k)).map((k) => '+' + k)).slice(0, 4).join(',') + ')'); }
    for (const k of kx) if (k in y) walk(x[k], y[k], q + '/' + k);
  };
  walk(a, b, p);
  return out;
}
/** sim の全欄(関数を除く自前の鍵)の差 —— 連続の走行と再開の走行の終わりの状態の比較(器の旗 skip の鍵は外す) */
export function simStateDiff(A, B, o = {}) {
  const skip = new Set(o.skip || []), max = o.max || 40, out = [];
  const keys = [...new Set(Object.keys(A).concat(Object.keys(B)))].filter((k) => !skip.has(k) && typeof A[k] !== 'function' && typeof B[k] !== 'function');
  for (const k of keys) {
    if (out.length >= max) break;
    for (const d of bitDiff(A[k], B[k], max - out.length, '/' + k)) out.push(d);
  }
  return { keys: keys.length, diff: out };
}

/* ───────── 契約(入力・器・環境・版)───────── */
/** 環境(Node・V8・platform・arch) */
export const envOf = () => ({ node: process.version, v8: process.versions.v8, platform: process.platform, arch: process.arch });
/** コードの集合の sha256(ファイルの順の [名, sha256] の並び) */
export function codeShaOf(root, files) {
  const rows = files.map((f) => [f, crypto.createHash('sha256').update(fs.readFileSync(path.join(root, f))).digest('hex')]);
  return { sha256: sha256Of(canonText(rows)), files: rows.map(([file, sha256]) => ({ file, sha256 })) };
}
/** 契約の hash(正準 JSON の sha256) */
export const contractShaOf = (c) => sha256Of(canonText(c));
/** 2 つの契約の違う欄(上の段の鍵 —— 拒否の理由) */
export function contractDiff(a, b) {
  const ks = [...new Set(Object.keys(a || {}).concat(Object.keys(b || {})))].sort();
  return ks.filter((k) => canonText((a || {})[k] === undefined ? null : a[k]) !== canonText((b || {})[k] === undefined ? null : b[k]));
}

/* ───────── 原子的な書き込み ───────── */
/** 一時ファイル → fsync → rename(→ 置き場の fsync)。書きかけを正本の名で残さない */
export function atomicWrite(file, parts) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  const tmp = file + '.tmp-' + process.pid;
  const fd = fs.openSync(tmp, 'w');
  try { for (const p of parts) { const b = typeof p === 'string' ? Buffer.from(p, 'utf8') : Buffer.from(p.buffer, p.byteOffset, p.byteLength); let off = 0; while (off < b.length) off += fs.writeSync(fd, b, off, b.length - off); } fs.fsyncSync(fd); }
  finally { fs.closeSync(fd); }
  fs.renameSync(tmp, file);
  try { const dfd = fs.openSync(path.dirname(file), 'r'); try { fs.fsyncSync(dfd); } finally { fs.closeSync(dfd); } } catch (e) { /* 置き場の fsync が出来ない fs —— rename は済み */ }
}
const pad8 = (n) => (8 - (n % 8)) % 8;

/* ───────── (b) 途中の步からの再開: checkpoint ───────── */
/**
 * checkpoint を書く。file = 置き場・contract = 契約(オブジェクト)・state = 状態(符号化する値)・info = 読み手の短い記録(步の番号など —— 符号化する)。
 * 形: 1 行目 MAGIC / 2 行目 頭の JSON({version, contract, contractSha, jsonBytes, binBytes, blobs:[{off,len}], sha256})/ 本文 = 状態の木の JSON + バイト列(8 の倍数に詰める)。
 * sha256 は本文(木の JSON とバイト列)の hash。
 * @returns {{bytes:number, sha256:string, blobs:number}}
 */
export function writeCheckpoint(file, contract, state, info, note) {
  const blobs = [], tree = encodeTree({ state, info: info === undefined ? null : info }, blobs);
  const json = Buffer.from(JSON.stringify(tree), 'utf8');
  const lay = []; let off = 0;
  for (const b of blobs) { lay.push({ off, len: b.byteLength }); off += b.byteLength + pad8(b.byteLength); }
  const parts = [json], h = crypto.createHash('sha256').update(json);
  const z8 = new Uint8Array(8);
  for (const b of blobs) { parts.push(b); h.update(b); const p = pad8(b.byteLength); if (p) { const z = z8.subarray(0, p); parts.push(z); h.update(z); } }
  const sha256 = h.digest('hex');
  const head = JSON.stringify({ version: RESUME_VERSION, contract, contractSha: contractShaOf(contract), jsonBytes: json.byteLength, binBytes: off, blobs: lay, sha256, note: note === undefined ? null : note });
  atomicWrite(file, [MAGIC + '\n' + head + '\n', ...parts]);
  return { bytes: Buffer.byteLength(MAGIC + '\n' + head + '\n') + json.byteLength + off, sha256, blobs: blobs.length };
}
/**
 * checkpoint を読む(拒否の条件を順に)。expect = 今の契約(null なら契約を照合しない —— 自己試験の読みだけ)。
 * @returns {{ok:boolean, why:string|null, code:string|null, state?:any, info?:any, head?:object, diff?:string[]}}
 *   code: 'missing' | 'magic' | 'head' | 'length' | 'sha' | 'contractSelf' | 'version' | 'contract' | 'decode'
 */
export function readCheckpoint(file, expect) {
  let buf;
  try { buf = fs.readFileSync(file); } catch (e) { return { ok: false, code: 'missing', why: 'checkpoint が無い' }; }
  const n1 = buf.indexOf(10); if (n1 < 0 || buf.subarray(0, n1).toString('utf8') !== MAGIC) return { ok: false, code: 'magic', why: '形が違う(magic)' };
  const n2 = buf.indexOf(10, n1 + 1); if (n2 < 0) return { ok: false, code: 'head', why: '頭の行が切れている(書きかけ)' };
  let head; try { head = JSON.parse(buf.subarray(n1 + 1, n2).toString('utf8')); } catch (e) { return { ok: false, code: 'head', why: '頭の JSON が読めない(書きかけ・壊れた)' }; }
  const body = buf.subarray(n2 + 1);
  if (!(Number.isInteger(head.jsonBytes) && Number.isInteger(head.binBytes)) || body.length !== head.jsonBytes + head.binBytes) return { ok: false, code: 'length', why: '本文の長さが頭と違う(書きかけ・切れた —— ' + body.length + ' ≠ ' + (head.jsonBytes + head.binBytes) + ')', head };
  const sha = crypto.createHash('sha256').update(body).digest('hex');
  if (sha !== head.sha256) return { ok: false, code: 'sha', why: '本文の sha256 が頭と違う(壊れた)', head };
  if (contractShaOf(head.contract) !== head.contractSha) return { ok: false, code: 'contractSelf', why: '頭の契約の hash が契約の中身と合わない', head };
  if (head.version !== RESUME_VERSION) return { ok: false, code: 'version', why: '再開の型の版が違う(' + head.version + ' ≠ ' + RESUME_VERSION + ')', head };
  if (expect && head.contractSha !== contractShaOf(expect)) return { ok: false, code: 'contract', why: '違う契約の checkpoint(' + contractDiff(head.contract, expect).join('・') + ')', head, diff: contractDiff(head.contract, expect) };
  try {
    const json = body.subarray(0, head.jsonBytes), bin = body.subarray(head.jsonBytes);
    const blobs = head.blobs.map((z) => bin.subarray(z.off, z.off + z.len));
    const v = decodeTree(JSON.parse(json.toString('utf8')), blobs);
    return { ok: true, code: null, why: null, state: v.state, info: v.info, head };
  } catch (e) { return { ok: false, code: 'decode', why: '状態の木が読めない: ' + String(e && e.message || e).slice(0, 120), head }; }
}

/** 頭だけを読む(表示用の note と契約 —— 本文は確かめない。再開には readCheckpoint を使う) */
export function peekCheckpoint(file) {
  try {
    const fd = fs.openSync(file, 'r'); const b = Buffer.alloc(Math.min(fs.fstatSync(fd).size, 1 << 20)); fs.readSync(fd, b, 0, b.length, 0); fs.closeSync(fd);
    const n1 = b.indexOf(10), n2 = b.indexOf(10, n1 + 1); if (n1 < 0 || n2 < 0 || b.subarray(0, n1).toString('utf8') !== MAGIC) return null;
    return JSON.parse(b.subarray(n1 + 1, n2).toString('utf8'));
  } catch (e) { return null; }
}

/* ───────── (a) 完了済みのジョブの再利用: done ───────── */
/**
 * ジョブの結果の置き場。key = ジョブの鍵(器の走行の鍵)・contract = 契約。結果は**子プロセスが印字した JSON の文字列そのもの**を持つ
 * (再利用した行と新しく走らせた行が同じ JSON.parse を通る —— 値は同じ)。
 */
export function jobStore(dir) {
  const fileOf = (key) => path.join(dir, 'done-' + sha256Of(key).slice(0, 32) + '.json');
  return {
    fileOf,
    /** @returns {{hit:boolean, why:string, text?:string}} */
    get(key, contract) {
      let J; try { J = JSON.parse(fs.readFileSync(fileOf(key), 'utf8')); } catch (e) { return { hit: false, why: '済みの記録が無い' }; }
      if (J.version !== DONE_VERSION) return { hit: false, why: '済みの記録の版が違う' };
      if (J.key !== key) return { hit: false, why: '鍵が違う' };
      if (J.contractSha !== contractShaOf(contract)) return { hit: false, why: '違う契約(' + contractDiff(J.contract, contract).join('・') + ')' };
      if (typeof J.row !== 'string' || sha256Of(J.row) !== J.rowSha256) return { hit: false, why: '結果の本文の sha256 が違う(壊れた)' };
      return { hit: true, why: '同じ契約', text: J.row };
    },
    put(key, contract, text) {
      atomicWrite(fileOf(key), [JSON.stringify({ version: DONE_VERSION, key, contract, contractSha: contractShaOf(contract), rowSha256: sha256Of(text), row: text }) + '\n']);
    } };
}

/* ───────── 検出器: 衛星の標本(第315便d の attachSatSampler と同じ式 —— 状態を外に出せる形)───────── */
const dot = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
const cross = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
const nrm = (a) => Math.hypot(a[0], a[1], a[2]);
const unit = (a) => { const n = nrm(a); return [a[0] / n, a[1] / n, a[2] / n]; };
export const SAMPLER_KEYS = Object.freeze(['t', 'k', 'thPrev', 'thAcc', 'acc', 'omPrev', 'omAcc', 'bad', 'T', 'EP', 'EQ', 'TH', 'OM', 'INC', 'EN', 'EC', 'AXS', 'AXP', 'rev']);
/**
 * 衛星の標本(tests/lib-w315d-satk1.mjs の attachSatSampler と**同じ式・同じ順**)。違いは累積(角の繰り越し・前の標本・標本の列・通過の時刻)を
 * 1 つの状態 z に持ち、state() で外へ出し、restore で戻せること。基底(P・Q・W0・xr・yr・kr と軸の初期値)は付けた時の S から作る
 * (再開では新しく組んだ S —— t = 0 の状態 —— に付けるので同じ値。restore の基底とビットで照合し、違えば例外)。
 * @param {object} S sim(三次元)・@param {{ci,oi,mu,every,pole,eccVector}} o(eccVector = 第304便e の lib の AP.eccVector)・@param {object|null} restore state() の値
 */
export function attachSatSamplerR(S, o, restore) {
  const ci = o.ci, oi = o.oi, mu = o.mu, every = Math.max(1, o.every | 0 || 1), kr = unit(o.pole), eccVector = o.eccVector;
  const rel = () => [S.x[oi] - S.x[ci], S.y[oi] - S.y[ci], S.z[oi] - S.z[ci]];
  const relV = () => [S.vx[oi] - S.vx[ci], S.vy[oi] - S.vy[ci], S.vz[oi] - S.vz[ci]];
  const r0 = rel(), v0 = relV(), W0 = unit(cross(r0, v0)), P = unit(r0), Q = cross(W0, P);
  const n0 = cross(kr, W0), xr = nrm(n0) > 1e-12 ? unit(n0) : unit(cross(kr, [1, 0, 0])), yr = cross(kr, xr);
  const ax = (i) => (S.sax && S.saOn && S.saOn[i]) ? [S.sax[i], S.say[i], S.saz[i]] : null;
  const a0s = ax(oi), a0p = ax(ci);
  const basis = { P, Q, W0, xr, yr, kr };
  const z = { t: 0, k: 0, thPrev: Math.atan2(dot(r0, Q), dot(r0, P)), thAcc: 0, acc: 0, omPrev: null, omAcc: 0, bad: false, T: [], EP: [], EQ: [], TH: [], OM: [], INC: [], EN: [], EC: [], AXS: [], AXP: [], rev: [] };
  z.thAcc = z.thPrev;
  if (restore) {
    const d = bitDiff({ basis, a0s, a0p }, { basis: restore.basis, a0s: restore.a0s, a0p: restore.a0p });
    if (d.length) throw new Error('標本の基底が保存と違う(' + d.slice(0, 3).join(',') + ')—— 再開を拒否');
    for (const k of SAMPLER_KEYS) { if (Array.isArray(z[k])) { z[k].length = 0; for (const x of restore.z[k]) z[k].push(x); } else z[k] = restore.z[k]; }
  }
  const ang = (a, b) => (a && b) ? Math.atan2(nrm(cross(a, b)), dot(a, b)) : null;
  const orig = S.step;
  S.step = function (dt) {
    const out = orig.apply(this, arguments);
    const t1 = z.t + dt; z.k++;
    const r = rel(), th = Math.atan2(dot(r, Q), dot(r, P));
    let d = th - z.thPrev; while (d > Math.PI) d -= 2 * Math.PI; while (d < -Math.PI) d += 2 * Math.PI;
    const pa = z.acc; z.acc += d; z.thAcc += d; z.thPrev = th;
    const nP = Math.floor(Math.abs(pa) / (2 * Math.PI)), nN = Math.floor(Math.abs(z.acc) / (2 * Math.PI));
    if (nN > nP) { const tg = Math.sign(z.acc) * nN * 2 * Math.PI, fr = (tg - pa) / (z.acc - pa); z.rev.push(z.t + fr * dt); }
    z.t = t1;
    if (z.k % every === 0) {
      const v = relV(), rn = nrm(r), e = eccVector(r, v, mu), h = cross(r, v), W = unit(h), nn = cross(kr, W), om = Math.atan2(dot(nn, yr), dot(nn, xr));
      if (z.omPrev !== null) { let dd = om - z.omPrev; while (dd > Math.PI) dd -= 2 * Math.PI; while (dd < -Math.PI) dd += 2 * Math.PI; z.omAcc += dd; } else z.omAcc = om;
      z.omPrev = om;
      const en = 0.5 * dot(v, v) - mu / rn;
      if (!(Number.isFinite(en) && en < 0 && nrm(e) < 1)) z.bad = true;
      z.T.push(z.t); z.EP.push(dot(e, P)); z.EQ.push(dot(e, Q)); z.TH.push(z.thAcc); z.OM.push(z.omAcc); z.INC.push(Math.acos(Math.max(-1, Math.min(1, dot(W, kr))))); z.EN.push(en); z.EC.push(nrm(e));
      z.AXS.push(ang(ax(oi), a0s)); z.AXP.push(ang(ax(ci), a0p));
    }
    return out;
  };
  return { basis, rev: z.rev, samples: () => ({ t: z.T, eP: z.EP, eQ: z.EQ, th: z.TH, om: z.OM, inc: z.INC, en: z.EN, ec: z.EC, axS: z.AXS, axP: z.AXP }), unbound: () => z.bad,
    detach: () => { S.step = orig; }, state: () => ({ basis, a0s, a0p, z: Object.fromEntries(SAMPLER_KEYS.map((k) => [k, z[k]])) }) };
}

/* ───────── 自己試験(器を走らせない —— QA と枝の scratch が呼ぶ)───────── */
/**
 * 符号化の往復・checkpoint の拒否の条件・done の再利用と拒否を、合成した状態で確かめる。dir = 一時の置き場(呼び手が作って消す)。
 * @returns {{ok:boolean, rows:Array<{name:string, pass:boolean, got:string}>, cases:string}}
 */
export function resumeSelfTest(dir) {
  const rows = [], add = (name, pass, got) => rows.push({ name, pass: !!pass, got: String(got) });
  // 1 符号化の往復(ビット)
  const nan2 = (() => { const b = new Float64Array(1); new BigUint64Array(b.buffer)[0] = 0x7ff8000000000123n; return b[0]; })();
  const val = { a: 1 / 3, b: -0, c: NaN, d: Infinity, e: -Infinity, f: 5e-324, g: 2 ** 53 + 2, s: 'σ', u: undefined, n: null, t: true,
    f64: Float64Array.from([0.1, -0, 1e308]), f32: Float32Array.from([0.1, -2.5]), i32: Int32Array.from([-7, 2 ** 31 - 1]), u8: Uint8Array.from([0, 255]), u16: Uint16Array.from([65535]),
    arr: [0.1, 0.2, 0.30000000000000004, -0, 1e-300, 7, 8, 9, 10], mix: [1, null, 'x', [2, -0], { z: 1 }], obj: { '10': 1, b: 2, '2': 3, a: { deep: [1 / 7] } }, nan2 };
  const blobs = [], tree = encodeTree(val, blobs), json = JSON.stringify(tree), back = decodeTree(JSON.parse(json), blobs.map((b) => Uint8Array.from(b)));
  const d1 = bitDiff(val, back);
  add('r1 符号化の往復(-0・NaN・±Infinity・最小の非正規数・2^53+2・型つき配列 5 種・数の配列・入れ子・鍵の順)が全欄で同じビット', d1.length === 0 && Object.is(back.b, -0) && Number.isNaN(back.c) && back.arr.length === 9 && Array.isArray(back.arr), d1.join(',') || '差 0');
  const naive = JSON.parse(JSON.stringify(val));
  add('r2 対照: JSON の数の往復は -0・NaN・Infinity・型つき配列を保たない(差が出る)', bitDiff(val, naive).length > 0, bitDiff(val, naive).length + ' 欄');
  let threw = ''; try { encodeTree({ f: () => 1 }, []); } catch (e) { threw = e.message; }
  let threw2 = ''; try { encodeTree({ m: new Map() }, []); } catch (e) { threw2 = e.message; }
  add('r3 符号化できない型(関数・Map)は例外(黙って落とさない)', /符号化できない/.test(threw) && /符号化できない/.test(threw2), threw + ' / ' + threw2);
  class K { constructor() { this.a = 1; } }
  let threw3 = ''; try { encodeTree({ k: new K() }, []); } catch (e) { threw3 = e.message; }
  const nullProto = Object.assign(Object.create(null), { q: 0.5 }), bn = [], bk = decodeTree(JSON.parse(JSON.stringify(encodeTree({ z: nullProto }, bn))), bn);
  add('r4 原型 null のオブジェクトは素のオブジェクトとして往復・クラスの実体は例外', bitDiff({ z: { q: 0.5 } }, bk).length === 0 && /符号化できない/.test(threw3), threw3);
  // 2 checkpoint の拒否
  fs.mkdirSync(dir, { recursive: true });
  const C = { resumeVersion: RESUME_VERSION, harness: 'h-1', codeSha256: sha256Of('code'), targetSha256: sha256Of('html'), env: { node: 'v0', v8: '0', platform: 'linux', arch: 'x64' }, runKey: 'k1', spec: { a: 1 } };
  const st = { k: 123, sim: { x: Float64Array.from([1.5, -2.25]), n: 2 }, sampler: { T: [0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8] } };
  const f = path.join(dir, 'ck.bin');
  const w = writeCheckpoint(f, C, st, { at: 'k=123' });
  const r0 = readCheckpoint(f, C);
  add('c1 同じ契約の checkpoint を読む —— 状態が全欄で同じビット', r0.ok && bitDiff(st, r0.state).length === 0 && r0.info.at === 'k=123', r0.ok ? 'ok ' + w.bytes + ' バイト' : r0.why);
  const tmpLeft = fs.readdirSync(dir).filter((x) => /\.tmp-/.test(x));
  add('c2 原子的な保存: 一時ファイルが残らない(rename 済み)', tmpLeft.length === 0, tmpLeft.join(',') || '残り 0');
  for (const [nm, mu, code] of [['c3 違う契約(html の sha)', (c) => { c.targetSha256 = sha256Of('html2'); }, 'contract'], ['c4 違う契約(器と lib の sha)', (c) => { c.codeSha256 = sha256Of('code2'); }, 'contract'],
    ['c5 違う契約(環境の Node)', (c) => { c.env.node = 'v1'; }, 'contract'], ['c6 違う契約(走行の鍵 —— 本・刻み)', (c) => { c.runKey = 'k2'; }, 'contract']]) {
    const c2 = JSON.parse(JSON.stringify(C)); mu(c2); const r = readCheckpoint(f, c2);
    add(nm + ' は拒否', !r.ok && r.code === code && r.diff && r.diff.length === 1, r.why);
  }
  const full = fs.readFileSync(f);
  const g = (nm, bytes, code) => { const p = path.join(dir, nm); fs.writeFileSync(p, bytes); const r = readCheckpoint(p, C); return { r, pass: !r.ok && r.code === code }; };
  let z = g('cut.bin', full.subarray(0, full.length - 9), 'length'); add('c7 書きかけ(末尾 9 バイトが無い)は拒否', z.pass, z.r.why);
  z = g('cut2.bin', full.subarray(0, full.indexOf(10, full.indexOf(10) + 1) - 5), 'head'); add('c8 書きかけ(頭の行の途中で切れた)は拒否', z.pass, z.r.why);
  const flip = Buffer.from(full); flip[flip.length - 3] ^= 1; z = g('flip.bin', flip, 'sha'); add('c9 本文の 1 ビットを反転は拒否(sha256)', z.pass, z.r.why);
  const mg = Buffer.from(full); mg[0] ^= 1; z = g('magic.bin', mg, 'magic'); add('c10 形の違うファイルは拒否(magic)', z.pass, z.r.why);
  const r11 = readCheckpoint(path.join(dir, 'none.bin'), C); add('c11 無いファイルは「無い」(最初から走らせる)', !r11.ok && r11.code === 'missing', r11.why);
  // 頭の契約だけを書き換え(hash はそのまま)
  { const s = full.toString('latin1'), i1 = s.indexOf('\n'), i2 = s.indexOf('\n', i1 + 1), head = JSON.parse(full.subarray(i1 + 1, i2).toString('utf8')); head.contract.runKey = 'kX';
    const hb = Buffer.from(JSON.stringify(head), 'utf8'); z = g('self.bin', Buffer.concat([full.subarray(0, i1 + 1), hb, full.subarray(i2)]), 'contractSelf');
    add('c12 頭の契約だけを書き換えた写し(契約の hash と中身が合わない)は拒否', z.pass, z.r.why); }
  // 3 done の再利用
  const js = jobStore(path.join(dir, 'done')), key = 'main|V1a|io|div=1', text = '{"spec":{"a":1},"status":"run","x":0.1}';
  const m0 = js.get(key, C); js.put(key, C, text); const m1 = js.get(key, C);
  const c2 = JSON.parse(JSON.stringify(C)); c2.targetSha256 = sha256Of('html3'); const m2 = js.get(key, c2);
  const df = JSON.parse(fs.readFileSync(js.fileOf(key), 'utf8')); df.row = df.row.replace('0.1', '0.2'); fs.writeFileSync(js.fileOf(key), JSON.stringify(df)); const m3 = js.get(key, C);
  add('d1 done: 無い → 走らせる・同じ契約 → 再利用(本文が同じ文字列)・違う契約 → 走らせる・本文を書き換えた写し → 走らせる', !m0.hit && m1.hit && m1.text === text && !m2.hit && /違う契約/.test(m2.why) && !m3.hit && /sha256/.test(m3.why),
    [m0.why, m1.why, m2.why, m3.why].join(' / '));
  const ok = rows.every((r) => r.pass);
  return { ok, rows, cases: `再開の型の自己試験 ${rows.filter((r) => r.pass).length}/${rows.length}(符号化 4・checkpoint 12・done 1)` };
}

export default { RESUME_VERSION, MAGIC, DONE_VERSION, PACK_MIN, TYPED, SAMPLER_KEYS, f64Hex, hexF64, encodeTree, decodeTree, bitDiff, simStateDiff, envOf, codeShaOf, contractShaOf, contractDiff,
  atomicWrite, writeCheckpoint, readCheckpoint, peekCheckpoint, jobStore, attachSatSamplerR, resumeSelfTest, nextUp };
