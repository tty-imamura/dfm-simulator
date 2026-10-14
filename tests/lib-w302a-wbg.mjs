// 第302便a(原仮定者の裁定(第92報)AN304 ②・統括の検証項目 R186): **器の側の gain ⇔ W_bg の読み書き**(Node の器だけが読む —— html は読まない)。
// 第302便a で `physics.relativeDrag.gain` は廃止され、正準形は `Wbg`(背景慣性決定力 [M/L³])と `enabled`(OFF)になった。式は不変で、行の係数 c = 1/W_bg は
// 旧 gain と同じ量(内蔵の本は 1/Wbg が元の gain と同じ double —— 🌛 の 514182 だけ 1 ulp)。既存の器は「gain を動かす」探索・対照(gain 0)を持つので、
//   rdCoefOf(rd)       … 核の係数(凍結比較〔gain を残す宣言〕は gain・OFF と未推定は 0・それ以外は 1/Wbg —— html の relDragCoefficientOf と同じ値)
//   rdGainOf(rd)       … 宣言の gain の値(rdCoefOf を 15 桁で丸めた値 —— 旧器の `rd.gain` の「宣言の値」の読みの置き換え。旧世代の html の gain もそのまま読む)
//   rdSetGain(rd, g)   … rd を書き換えて係数 g の宣言にする(gain>0 → Wbg = wbgFromGain(g)・g 0 → {Wbg:null, enabled:false} —— 受理器の互換読込と同じ値を Wbg で書く。
//                        旧法則の凍結比較〔compose:"sum"・norm:"none"・background〕の宣言は gain のまま)
//   rdWithGain(rd, g)  … rd の写しに rdSetGain した宣言(元は書き換えない)
// を置く。互換読込は 1/Wbg が g と同じ double になる Wbg を選ぶので、器の探索の走りは旧世代とビット同一(g がそういう double を持たない値だけ最下位 1 ulp)。
// 互換読込の期限(何便で gain の読込をやめるか)は決断事項 —— やめる便でこの 3 関数を Wbg の直書きに替える。
export function rdCoefOf(rd) {
  if (!rd || typeof rd !== 'object') return undefined;
  if (rd.gain !== undefined) return rd.gain;
  if (rd.enabled === false || rd.Wbg === null || rd.Wbg === undefined) return 0;
  return 1 / rd.Wbg;
}
// 宣言の gain の値(旧の書き方)—— 凍結比較は gain・それ以外は 1/Wbg を 15 桁で丸めた値(旧 gain は 10 桁以下 —— 1/Wbg が同じ double の本は同じ値・
//   🌛 の 514182 のように 1 ulp ずれる本でも旧の宣言の値に戻る)。器が「宣言の値」を報告・換算・探索の端に使うところはこちら(核の係数は rdCoefOf)
export function rdGainOf(rd) {
  const c = rdCoefOf(rd);
  if (c === undefined || rd.gain !== undefined || c === 0) return c;
  return Number(c.toPrecision(15));
}
export function rdSetGain(rd, g) {
  if (!rd || typeof rd !== 'object') return rd;
  delete rd.Wbg; delete rd.enabled; delete rd.gain;
  const frozen = rd.compose === 'sum' || (rd.norm !== undefined && rd.norm !== null && rd.norm !== 'total') || (rd.background !== undefined && rd.background !== null);
  if (frozen || typeof g !== 'number' || !(g >= 0)) { rd.gain = g; return rd; }   // 凍結比較(と不正な値 —— 受理器に拒否させる)は gain のまま
  if (g === 0) { rd.Wbg = null; rd.enabled = false; } else rd.Wbg = wbgFromGain(g);   // 互換読込と同じ値を Wbg で直接書く(受理の警告を出さない)
  return rd;
}
export function rdWithGain(rd, g) {
  return rdSetGain(Object.assign({}, rd || {}), g);
}
// rd に鍵を重ねる(元の rd を書き換える)。patch.gain は rdSetGain で・旧法則の凍結比較(compose:"sum"・norm:"none"・background)を重ねるときは
// gain の宣言へ戻してから重ねる(受理器は Wbg と凍結比較の併用を拒否する —— 凍結比較は gain で書く)。係数は変わらない(1/Wbg の double = gain)
export function rdPatch(rd, patch) {
  if (!rd || typeof rd !== 'object' || !patch) return rd;
  const p = Object.assign({}, patch), g = p.gain;
  delete p.gain;
  const coef = (g !== undefined) ? g : rdGainOf(rd);   // 凍結比較へ戻すときは旧の宣言の値(🌛 も 514182 —— 旧世代とビット同一)
  Object.assign(rd, p);
  const frozen = rd.compose === 'sum' || (rd.norm !== undefined && rd.norm !== null && rd.norm !== 'total') || (rd.background !== undefined && rd.background !== null);
  if (g !== undefined || (frozen && rd.gain === undefined)) rdSetGain(rd, coef);
  return rd;
}
// html の relDragWbgFromGain と同じ規則(1/Wbg === g の double を近傍 ±64 ulp で探す —— 無ければ最近接の 1/g)。g 0 は null
export function wbgFromGain(g) {
  if (!(typeof g === 'number' && Number.isFinite(g) && g > 0)) return null;
  const w = 1 / g;
  if (1 / w === g) return w;
  const f = new Float64Array(1), u = new BigInt64Array(f.buffer);
  for (let k = 1; k <= 64; k++) for (const d of [k, -k]) { f[0] = w; u[0] += BigInt(d); if (f[0] > 0 && 1 / f[0] === g) return f[0]; }
  return w;
}
// 宣言 rd が旧 gain g の宣言(またはその移行 —— Wbg = wbgFromGain(g)・g 0 は OFF)か。QA が正本の gain と本の宣言を突き合わせる(世代をまたいで同じ判定)
export function rdIsGain(rd, g) {
  if (!rd || typeof rd !== 'object') return false;
  if (rd.gain !== undefined) return rd.gain === g;
  if (g === 0) return rd.enabled === false;
  return rd.enabled !== false && rd.Wbg === wbgFromGain(g);
}
// 正本の記録(gain のノブ —— 鎖で作り直す前の世代)と html の記録(第302便a の同値移行 —— Wbg のノブ・fixed の末尾に来歴 1 行・cond.sig を作り直し)が
// 同じ記録かを見る。規則は html の移行と同じ: ノブ physics.relativeDrag.gain → physics.relativeDrag.Wbg・値は wbgFromGain(gain)(0 は null —— OFF)・
// 範囲 [lo, hi] → [wbgFromGain(hi), wbgFromGain(lo>0 ? lo : MIN_POS)](MIN_POS = 0.001 —— 正本の対数格子の最小の正の gain)。cond.sig は比べない
// (html の側は今の宣言で作り直した署名 —— 器が fitCondSig で match を別に見る)。同じ形(どちらも gain か、どちらも Wbg)なら素の一致。
export const FIT_MIGRATE_MIN_POS = 0.001;
export function fitRecordSame302(htmlRec, canonRec) {
  if (JSON.stringify(htmlRec) === JSON.stringify(canonRec)) return true;
  if (!htmlRec || !canonRec || !Array.isArray(htmlRec.knobs) || !Array.isArray(canonRec.knobs)) return false;
  const k = canonRec.knobs.findIndex((z) => z && z.key === 'physics.relativeDrag.gain');
  if (k < 0 || !htmlRec.knobs[k] || htmlRec.knobs[k].key !== 'physics.relativeDrag.Wbg') return false;
  const want = JSON.parse(JSON.stringify(canonRec)), got = JSON.parse(JSON.stringify(htmlRec));
  const kn = want.knobs[k], lo = kn.range[0] > 0 ? kn.range[0] : FIT_MIGRATE_MIN_POS;
  want.knobs[k] = { key: 'physics.relativeDrag.Wbg', range: [wbgFromGain(kn.range[1]), wbgFromGain(lo)], final: kn.final === 0 ? null : wbgFromGain(kn.final) };
  const note = got.fixed && got.fixed.length ? got.fixed[got.fixed.length - 1] : '';
  if (!/第302便a/.test(note) || !/同値移行/.test(note)) return false;
  got.fixed = got.fixed.slice(0, -1);
  if (want.cond) delete want.cond.sig;
  if (got.cond) delete got.cond.sig;
  return JSON.stringify(want) === JSON.stringify(got);
}
// 宣言の relativeDrag を受理器の正準形で比べる(gain の旧宣言と Wbg の宣言が同じ係数なら同じ —— 世代をまたいだ「親の写し+ノブ」の照合)
export function rdCanonSame(HP, a, b) {
  const V = (x) => { if (!x || typeof HP.validateRelativeDrag !== 'function') return JSON.stringify(x); const v = HP.validateRelativeDrag(JSON.parse(JSON.stringify(x))); return v.ok ? JSON.stringify(v.relativeDrag) : 'ERR:' + v.err; };
  return V(a) === V(b);
}
