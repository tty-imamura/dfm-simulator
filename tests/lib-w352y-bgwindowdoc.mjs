// 第352便y(原仮定者の整理(2026-11-24 —— 第148報)・統括の検証項目 R462):
// **正本 tests/out/bgwindow-352y.json から PHYSICS〔第352便y〕の表を作る文書の lib**
// (QA docs.bgwindow352y が節の表と逐語で照合する —— 表の数は有効数字 3 桁)。原文(言葉を変えずに引く)と読みの表もここに持つ。
export const DOC_VERSION = 'w352y-bgwindowdoc-1';
const fin = (x) => typeof x === 'number' && Number.isFinite(x);
const fe = (x) => (x === 'inf' || x === Infinity ? '上限なし' : !fin(x) ? '—' : x === 0 ? '0' : Number(x).toExponential(2));
const fl = (x, kind) => (x === null ? (kind === 'lower' ? '満たせない' : '—') : fe(x));
const tf = (x) => (x === true ? '真' : x === false ? '偽' : '—');
const DIRN = Object.freeze({ Np: '(N+)', Gm: '(G−)' });
const TSN = Object.freeze({ 0: '規則の半径', 1: '観測の半径' });
const KINDN = Object.freeze({ lower: '下限', upper: '上限', point: '固定の点', band: '固定の帯' });
const PLN = Object.freeze({ in: '窓の内', below: '窓より下', above: '窓より上', closed: '(窓が空)' });
const CONDN = Object.freeze({ i: '(i)', ii: '(ii)', iii: '(iii)', iv: '(iv)', vEa: '(v) 地球', vMa: '(v) 火星', vVe: '(v) 金星' });
const cn = (id) => (id === null ? '—' : CONDN[id] || id);
const PROVTAG = '(仮・未照合)';
const BODYN = Object.freeze({ Earth: '地球', Mars: '火星', Venus: '金星', Mercury: '水星' });
const STEPN = Object.freeze({ J2: 'J2', moi: '慣性モーメントの係数', obl: '傾き', moon: '月の道' });

/** 原文(言葉を変えずに引く) */
export const ORIGINAL = Object.freeze([
  Object.freeze(['原仮定者の整理(2026-11-24 —— 第148報)', '銀河の並進引きずりの計算が未確定なので、銀河の回転から軸引きずりの計算は出来ない。太陽系に及ぼす影響から逆算する段階']),
  Object.freeze(['原仮定者の整理(2026-11-24 —— 第148報)', '太陽系の基準軸方向に対する、太陽の自転軸の傾きも歳差運動である。そこを手掛かりに、銀河由来の背景軸引きずりを算出する']),
  Object.freeze(['原仮定者の整理(2026-11-24 —— 第148報)', '自転速度や、歳差運動の傾きは、天体の構造に左右されるので、先に銀河由来の背景軸引きずりを算出する']),
  Object.freeze(['原仮定者の回答(2026-11-24 —— 第148報)', 'AN1019: Aで進める。金星の自転の逆回転は、釣り合った状態で地球とも共鳴した結果である']),
]);
export const READINGS = Object.freeze([
  '「逆算する段階」を、1 つの値ではなく、太陽系の側の条件が置く上限と下限の窓として数える。新しい物理は足さない(前の枝の口を呼ぶ)',
  '(i) 太陽の傾きを、年齢の内に基準軸のまわりを 1 周以上した歳差と読むと下限になる。年齢の内に回っていないと読む列は下限を置かない',
  '構造のノブ(比率 f・係数の差・換算の係数 k・応答の係数)は前提の組として列に分け、窓が開く組と閉じる組を並べる(同時に当てはめない)',
  '(vi) 金星の条件が決めるのは倍率 ÷ k —— 窓の側から、金星の条件が窓に入る k の範囲を出す(共鳴の文は予想の文 —— 本節では数えない)',
]);
export function originalTable() {
  return ['| # | 出どころ | 原文(言葉を変えずに引く) | 読み(統括の読み —— 原文と分ける) |', '|---|---|---|---|']
    .concat(ORIGINAL.map(([w, o], i) => `| ${i + 1} | ${w} | 「${o}」 | ${READINGS[i]} |`)).join('\n');
}

const L4 = ['Np|0|L', 'Np|1|L', 'Gm|0|L', 'Gm|1|L'];
/** eq の列 ÷ L の列 の最大(数の在る所だけ —— 1 からの離れが最大の比) */
function eqRatio(r) {
  let w = null;
  for (const c of L4) { const a = r.u[c], b = r.u[c.replace('|L', '|eq')]; if (fin(a) && fin(b) && a > 0) { const q = b / a; if (w === null || Math.abs(q - 1) > Math.abs(w - 1)) w = q; } }
  return w === null ? '—' : w.toFixed(3);
}

export function tablesOf(J) {
  const T = {};
  // 表 2 条件の一覧
  T.cond = ['| 条件 | 種類 | 前の枝の口 | (N+) 規則の半径 | (N+) 観測の半径 | (G−) 規則の半径 | (G−) 観測の半径 | eq ÷ L | ″/年(L・左から最初の数) | 一周の年数(L・左から最初の数) |', '|---|---|---|---|---|---|---|---|---|---|']
    .concat(J.t1.rows.map((r) => `| ${r.id.split('|')[0] === 'fix' ? '' : '(' + r.id.split('|')[0] + ') '}${r.what}${r.provisional ? PROVTAG : ''} | ${KINDN[r.kind]} | ${r.from} | ${L4.map((c) => (r.kind === 'band' ? fe(r.uLo) + '〜' + fe(r.uHi) : fl(r.u[c], r.kind))).join(' | ')} | ${eqRatio(r)} | ${r.units ? fe(r.units.asYr) : '—'} | ${r.units ? fe(r.units.periodYr) : '—'} |`)).join('\n');
  // 表 3 窓(基準軸 L)
  T.win = ['| f | f_輪 | 背景の向き | 源の半径 | 下限(条件) | 上限(条件) | 窓 | 満たせない・食い違う条件 | (iii) Δc 1 を足すと | 倍率 1 | 共鳴の帯' + PROVTAG + ' | 金星の条件 k 1 | 金星の条件が窓に入る k |', '|---|---|---|---|---|---|---|---|---|---|---|---|---|']
    .concat(J.t2.rows.filter((r) => r.axis === 'L').map((r) => `| ${r.f} | ${r.ring === 'one' ? '1' : '= f'} | ${DIRN[r.dir]} | ${TSN[r.tSrc]} | ${fe(r.lo)}(${cn(r.loBy)}) | ${fe(r.hi)}(${cn(r.hiBy)}) | ${r.open ? '開く' : '空'} | ${r.blocked.map((b) => cn(b) + ' 満たせない').concat(r.conflicts.map(([a, b]) => cn(a) + ' > ' + cn(b))).join('・') || '—'} | ${r.with3.open ? '開く(下限 ' + fe(r.with3.lo) + ' ' + cn(r.with3.loBy) + ')' : r.with3.blocked.includes('iii') ? '(iii) 満たせない' : '空'} | ${PLN[r.u1]} | ${r.bandLo === r.bandHi ? PLN[r.bandLo] : PLN[r.bandLo] + '〜' + PLN[r.bandHi]} | ${PLN[r.venusK1]} | ${r.kWin ? fe(r.kWin[0]) + '〜' + fe(r.kWin[1]) : '—'} |`)).join('\n');
  // 表 4 f の境
  T.fcol = ['| 背景の向き | 源の半径 | 基準軸 | 窓が開く f の上限(f_輪 1) | 倍率 1 が窓の内に入る f の上限 | f_輪 = f のときの (ii) ÷ (iv) |', '|---|---|---|---|---|---|']
    .concat(J.t2.fcols.map((r) => `| ${DIRN[r.dir]} | ${TSN[r.tSrc]} | ${r.axis} | ${fe(r.fOpen)} | ${fe(r.fU1)} | ${Number(r.ratioSame).toFixed(1)} |`)).join('\n');
  // 表 5 重力の側の列の感度
  T.sens = ['| 天体 | 仮の値' + PROVTAG + ' ″/年 | 仮の値の幅 | 重力の側の列(比べる列)″/年 | 残り ″/年 | ' + ['J2', 'moi', 'obl', 'moon'].map((k) => STEPN[k] + ' ± の動き').join(' | ') + ' | 動きの和 | 残り − 動きの和 − 幅 | 0 と区別 |', '|---|---|---|---|---|---|---|---|---|---|---|---|']
    .concat(J.t3.rows.map((r) => `| ${BODYN[r.id]} | ${Number(r.ref).toPrecision(5)} | ${fin(r.sigma) ? r.sigma : '(無し)'} | ${fe(r.grav)} | ${fe(r.res)} | ${['J2', 'moi', 'obl', 'moon'].map((k) => { const s = r.steps.find((x) => x.name === k); return s ? fe(s.swing) : '—'; }).join(' | ')} | ${fe(r.swingSum)} | ${fe(r.margin)} | ${tf(r.distinct)} |`)).join('\n');
  // 表 6 離心率と (M) の歪みの平均(近点の向き 0)
  const R0 = J.t4.rows.filter((r) => r.periDeg === 0);
  T.ecc = ['| 天体 | ' + J.decl.eGrid.map((e) => 'e ' + e).join(' | ') + ' | e のべき | 平均 ÷ 位相ごと ÷ e²(e 0.206) |', '|---|' + J.decl.eGrid.map(() => '---|').join('') + '---|---|']
    .concat(R0.map((r) => `| ${BODYN[r.id]} | ${r.per.map((p) => (p.floor ? '0(床)' : fe(p.mAvgOverPhase))).join(' | ')} | ${Number(r.slope).toFixed(2)} | ${fe(r.coefE2)} |`)).join('\n');
  // 表 7 自分の e での率
  const rt = (r, c, s, k) => { const x = r.rates.find((q) => q.cand === c && q.sense === s); return fe(x[k]); };
  T.eccRate = ['| 天体 | 自分の e | (M) ÷ (S)(平均の歪み) | (T-a) の率 ÷ 比べる数: (M) | (T-a): (S) | (T-b) の率 ÷ 比べる数: (M) | (T-b): (S) | 比べる数 |', '|---|---|---|---|---|---|---|---|']
    .concat(R0.map((r) => { const p = r.per.find((q) => q.e === r.eOwn); return `| ${BODYN[r.id]} | ${r.eOwn} | ${fe(p.mOverS)} | ${rt(r, 'Ta', 'g2m', 'overRefM')} | ${rt(r, 'Ta', 'g2m', 'overRefS')} | ${rt(r, 'Tb', 'nat', 'overRefM')} | ${rt(r, 'Tb', 'nat', 'overRefS')} | ${r.id === 'Mercury' ? 'リポジトリの桁の値' : '仮の値' + PROVTAG} |`; })).join('\n');
  return T;
}

export function factsOf(J) {
  const F = {}, W = J.t2.rows.filter((r) => r.axis === 'L'), op = W.filter((r) => r.open), fc = J.t2.fcols;
  const rng = (xs) => { const a = fe(Math.min(...xs)), b = fe(Math.max(...xs)); return a === b ? a : a + '〜' + b; };
  F.open = `基準軸 L の 24 組のうち窓が開くのは ${op.length} 組で、どれも f ${[...new Set(op.map((r) => r.f))].join('・')}・f_輪 1 の組(下限 ${rng(op.map((r) => r.lo))}(${[...new Set(op.map((r) => cn(r.loBy)))].join('・')})・上限 ${rng(op.map((r) => r.hi))}(${[...new Set(op.map((r) => cn(r.hiBy)))].join('・')}))。`;
  F.fcol = `f_輪 1 のとき窓が開く f の上限は ${rng(fc.map((r) => r.fOpen))}・倍率 1 が窓の内に入る f の上限は ${rng(fc.map((r) => r.fU1))}。f_輪 = f のときは (ii) ÷ (iv) が ${Number(Math.min(...fc.map((r) => r.ratioSame))).toFixed(1)}〜${Number(Math.max(...fc.map((r) => r.ratioSame))).toFixed(1)} で、f に依らず窓は空。`;
  const k0 = op.filter((r) => r.tSrc === 0), k1 = op.filter((r) => r.tSrc === 1);
  F.venus = `窓が開く組で、金星の条件が窓に入る k は 規則の半径 下端 ${rng(k0.map((r) => r.kWin[0]))}・上端 ${rng(k0.map((r) => r.kWin[1]))}/観測の半径 下端 ${rng(k1.map((r) => r.kWin[0]))}・上端 ${rng(k1.map((r) => r.kWin[1]))}(倍率 1 に置く k は 規則 8.38e+11・観測 5.31e+2)。`;
  const s = J.t3.rows;
  F.sens = `重力の側の列の入力を最後の桁 ± 1・角 ± ${J.decl.pertDeg}° で振った動きの和は ${s.map((r) => BODYN[r.id] + ' ' + fe(r.swingSum)).join('・')} ″/年で、残り − 動きの和 − 幅は ${s.map((r) => BODYN[r.id] + ' ' + fe(r.margin)).join('・')} ″/年(仮・未照合)。`;
  const R0 = J.t4.rows.filter((r) => r.periDeg === 0);
  F.ecc = `(M) の歪みの 1 公転の平均は、離心率 e のある軌道で残り、e のべきは ${R0.map((r) => BODYN[r.id] + ' ' + Number(r.slope).toFixed(2)).join('・')}。自分の e での (M) ÷ (S) は ${R0.map((r) => BODYN[r.id] + ' ' + fe(r.per.find((q) => q.e === r.eOwn).mOverS)).join('・')}。`;
  return F;
}
