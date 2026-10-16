// 第306便a(原仮定者の裁定〔第97報〕AN336・統括の検証項目 R204)—— **派生した参照値の生成器の契約の器**(Node だけ・html は読まない・エンジンは走らせない)。
//
// 観測の記録 CSV(候補の行 paper/data/pn1-ephemeris-candidates.csv・照合の記録 paper/data/pn1-primary-audit-20261015.csv)を**一時ディレクトリの写し**に置き、
// 不正な入力 7 例を作って生成器 tests/lib-w306a-an336.mjs の an336Target が**拒否する**(例外を投げる)ことを確かめる:
//   ① 値の空 ② sigma 欄の無断の記入 ③ 単位違い ④ 照合の記録の値の不一致 ⑤ 照合の旗の変更(sigma68_verified=true)⑥ 行の重複 ⑦ 行の欠落
// あわせて ⑧ 元の観測 CSV が不変(sha256 の前後)⑨ 元の CSV で水星の q⋆ = 42.978510382067476(1e-12)・6 本の参照値が作れる(天王星・海王星は A1 なし)。
// 一時ディレクトリは W306A_TMP(既定 os.tmpdir())の下に作り、終われば消す。正本は作らない(主の器 exp-w306a-an336 が同じ関数 runContract を呼んで記録する)。
//
// 実行: node tests/exp-w306a-an336contract.mjs(終了コード 0 = 全部通った)
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import * as L from './lib-w306a-an336.mjs';
export const HARNESS_VERSION = 'w306a-an336contract-1';
const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const DECL = JSON.parse(fs.readFileSync(new URL('./data-w306a-decl305.json', import.meta.url), 'utf8'));
const MER = Object.assign({ id: 'mercurySunInertial3d' }, DECL.decl.mercurySunInertial3d);
const lines = (t) => t.split('\n');
/** CSV の 1 行の欄を置き換える(cols の列名 → 値)。 */
function setCol(line, cols, k, v) { const c = L.parseCsvLine(line); c[cols.indexOf(k)] = v; return c.map((x) => (/[",]/.test(x) ? '"' + x.replace(/"/g, '') + '"' : x)).join(','); }
/** 不正な入力の 7 例(候補 txtC・照合 txtA を受けて写しを返す)。 */
export const BAD_CASES = Object.freeze([
  { key: 'emptyValue', label: '① 値の空(候補の行の value を空に)', mut: (C, A, id) => ({ C: C.map((l) => (l.includes(id) ? setCol(l, L.CANDIDATE_COLS, 'value', '') : l)), A }) },
  { key: 'sigmaWritten', label: '② sigma 欄の無断の記入(候補の行の sigma に 0.003)', mut: (C, A, id) => ({ C: C.map((l) => (l.includes(id) ? setCol(l, L.CANDIDATE_COLS, 'sigma', '0.003') : l)), A }) },
  { key: 'unit', label: '③ 単位違い(候補の行の unit を mas/yr に)', mut: (C, A, id) => ({ C: C.map((l) => (l.includes(id) ? setCol(l, L.CANDIDATE_COLS, 'unit', 'mas/yr') : l)), A }) },
  { key: 'auditValue', label: '④ 照合の記録の値の不一致(candidate_value を -0.0020 に —— 文字列で違う)', mut: (C, A, id) => ({ C, A: A.map((l) => (l.startsWith(id + ',') ? setCol(l, L.AUDIT_COLS, 'candidate_value', '-0.0020') : l)) }) },
  { key: 'auditFlag', label: '⑤ 照合の旗の変更(sigma68_verified を true に)', mut: (C, A, id) => ({ C, A: A.map((l) => (l.startsWith(id + ',') ? setCol(l, L.AUDIT_COLS, 'sigma68_verified', 'true') : l)) }) },
  { key: 'duplicate', label: '⑥ 行の重複(候補の行を 2 行に)', mut: (C, A, id) => ({ C: C.flatMap((l) => (l.includes(id) ? [l, l] : [l])), A }) },
  { key: 'missing', label: '⑦ 行の欠落(照合の記録から水星の行を除く)', mut: (C, A, id) => ({ C, A: A.filter((l) => !l.startsWith(id + ',')) }) },
]);
/** 契約の器の本体(root はリポジトリの根・tmpBase は一時ディレクトリの親)。 */
export function runContract(root = ROOT, tmpBase = process.env.W306A_TMP || os.tmpdir()) {
  const cf = path.join(root, L.CANDIDATE_FILE), af = path.join(root, L.AUDIT_FILE);
  const before = { C: L.sha256Of(cf), A: L.sha256Of(af) };
  const txtC = fs.readFileSync(cf, 'utf8'), txtA = fs.readFileSync(af, 'utf8'), id = L.MERCURY_CONTRACT.recordId;
  const tmp = fs.mkdtempSync(path.join(tmpBase, 'w306a-an336-'));
  const cases = [];
  try {
    for (const B of BAD_CASES) {
      const m = B.mut(lines(txtC), lines(txtA), id), r = path.join(tmp, B.key);
      fs.mkdirSync(path.join(r, 'paper', 'data'), { recursive: true });
      fs.writeFileSync(path.join(r, L.CANDIDATE_FILE), m.C.join('\n')); fs.writeFileSync(path.join(r, L.AUDIT_FILE), m.A.join('\n'));
      let err = null; try { L.an336Target(r, MER); } catch (e) { err = String(e && e.message || e); }
      cases.push({ key: B.key, label: B.label, rejected: err !== null && /AN336 契約/.test(err), err: err ? err.slice(0, 200) : null });
    }
  } finally { fs.rmSync(tmp, { recursive: true, force: true }); }
  const t = L.an336Target(root, MER);
  const all = L.an336Targets(root, Object.keys(DECL.decl).map((k) => Object.assign({ id: k }, DECL.decl[k])));
  const after = { C: L.sha256Of(cf), A: L.sha256Of(af) };
  const out = { version: HARNESS_VERSION, libVersion: L.LIB_VERSION, cases, rejectedAll: cases.every((c) => c.rejected), csvUnchanged: before.C === after.C && before.A === after.A, sha256: after,
    mercury: { value: t.value, expected: L.MERCURY_CONTRACT.expected, diff: t.value - L.MERCURY_CONTRACT.expected, ok: Math.abs(t.value - L.MERCURY_CONTRACT.expected) <= 1e-12 },
    books: all.map((z) => ({ id: z.id, value: z.value, pn1: z.pn1.value, recordId: z.a1 ? z.a1.recordId : null, a1: z.a1 ? z.a1.value : null, sourceWidth: z.sourceWidth })),
    tmpRemoved: !fs.existsSync(tmp) };
  out.ok = out.rejectedAll && out.csvUnchanged && out.mercury.ok && out.books.length === 7 && out.books.filter((z) => z.recordId === null).length === 2 && out.tmpRemoved;
  return out;
}
const IS_MAIN = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (IS_MAIN) {
  const r = runContract();
  for (const c of r.cases) console.log(`${c.rejected ? '拒否' : '受理(違反)'} ${c.label}${c.err ? ' —— ' + c.err : ''}`);
  console.log(`⑧ 観測 CSV 不変 ${r.csvUnchanged}・⑨ 水星 q⋆ ${r.mercury.value}(差 ${r.mercury.diff})・7 本 ${r.books.map((z) => z.value.toPrecision(7)).join(' / ')}`);
  console.log('ok ' + r.ok);
  process.exit(r.ok ? 0 : 1);
}
