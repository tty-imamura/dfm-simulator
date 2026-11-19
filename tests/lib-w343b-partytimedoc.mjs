// 第343便b(原仮定者の回答(2026-11-19 —— 第142報の回答 2)AN839・統括の検証項目 R379): **正本 tests/out/partytime-343b.json から PHYSICS〔第343便b〕の表を作る文書の lib**
// (QA docs.partytime343b が節の表と逐語で照合する —— 比は小数 6 桁か有効数字 3 桁の指数・丸めで 0 と書いた値は「0」・小さい差は「< 床」の形で、丸めの残りの数は載せない)。
export const DOC_VERSION = 'w343b-partytimedoc-1';
const fe = (x) => (x === null || x === undefined || !Number.isFinite(x) ? '—' : x === 0 ? '0' : Number(x).toExponential(2));
const f6 = (x) => (x === null || x === undefined || !Number.isFinite(x) ? '—' : x === 0 ? '0' : Math.abs(x) < 1e-6 ? '< 1e-6' : x.toFixed(6));
const f2 = (x) => (x === null || x === undefined || !Number.isFinite(x) ? '—' : x.toFixed(2));
const lt = (x, fl) => (x === 0 ? '0' : x < fl ? '< ' + fl.toExponential(0) : fe(x));
const tf = (x) => (x === true ? '真' : x === false ? '偽' : 'null');

export const DECL_NAME = Object.freeze({ i: '(i) 絶対時間 1 秒あたり(今の步)', ii: '(ii) 静止は今のまま + 速さの遅れ(× g)', iii: '(iii) 当事者時間 1 秒あたり(× N g)', N: '(N) 対照: 静止の因子だけ(× N)' });

export function tablesOf(J) {
  const T = {}, S = J.pure.scenes, G = J.pure.gates;
  T.pure = ['| 場面 | 値 | 門 |', '|---|---|---|',
    `| ① 静止(x = 0)で全部の型の g が 1・宣言 (i) の因子は 1 | ${S.g0 ? 'はい' : 'いいえ'} | ${tf(G.g0)} |`,
    `| ② 宣言の因子の形((ii) = g・(iii) = N g・(N) = N)の差の最大 | ${lt(S.formMax, 1e-15)} | ${tf(G.form)} |`,
    `| ③ G_loc の因子(n_G = 0 で 1・受け手 n_G = ½ は e^(−ψ)・対称は入れ替えて同じ) | ${S.gLoc ? 'はい' : 'いいえ'} | ${tf(G.gLoc)} |`,
    `| ④ 見込みの式の値(今の在位の組 −2/3・(ii) n_G = 0 は −1/6・(iii) n_G = 0 は −1/3・対称 (i) n_G = 2 は −1/3) | ${S.closed ? 'はい' : 'いいえ'} | ${tf(G.closed)} |`,
    `| ⑤ 入力の拒否(宣言が無い・型が無い・x が負・G_loc の型が無い) | ${S.reject.n}/${S.reject.of} | ${tf(G.reject)} |`].join('\n');

  T.t1 = ['| 宣言 | 絶対時間の加速 | 当事者時間 1 秒あたりの速度の増し分 dv/dτ | 読み |', '|---|---|---|---|']
    .concat(J.t1.decls.map((d) => `| ${DECL_NAME[d.decl]} | ${d.absAccel} | ${d.perTau} | ${d.note} |`)).join('\n');
  T.app = ['| 今のアプリの所 | コード(beta の html —— 読むだけ) | 当たるもの |', '|---|---|---|']
    .concat(J.t1.app.map((a) => `| ${a.what} | ${a.code} | ${a.reads} |`)).join('\n');

  const t2 = J.t2, at = (d, n, t) => t2.rows.find((r) => r.decl === d && r.nG === n && r.type === t);
  T.t2 = ['| 宣言 | n_G | F | U1 | U2 | U3 | 見込みの式 | 見込み × 42.98(″/世紀) | 刻みを半分にした差の最大 |', '|---|---|---|---|---|---|---|---|---|']
    .concat(J.decl.decls.flatMap((d) => J.decl.nG.map((n) => { const rs = J.decl.types.map((t) => at(d, n, t));
      return `| ${DECL_NAME[d]} | ${n} | ${rs.map((r) => f6(r.overPN)).join(' | ')} | ${f6(rs[0].closed)} | ${f2(rs[0].closedArcsecCy)} | ${fe(Math.max(...rs.map((r) => r.halfDiff)))} |`; }))).join('\n')
    + `\n\n(近点の進み ÷ 弱い場の 1PN —— 正が進み。受け手の型・中心は固定の質点・場は静止・背景と軟化と引きずり無し・a = 1・μ = ${J.decl.orbit.mu}・e = ${J.decl.orbit.e}・1 周 ${J.decl.orbit.steps[1]} 刻み〔差は ${J.decl.orbit.steps[0]} 刻みとの差〕・近点 ${J.decl.orbit.nOrb} 回の差の平均。数は誇張した場の比で、見込みの式との差〔2e-4 より小さい〕は μ の二次の項。水星の 1PN は ${f2(t2.pn.arcsecCy)}″/世紀)`;
  T.t2sym = ['| 宣言 | n_G | 対称の型(U3) | 見込みの式 | 刻みを半分にした差 |', '|---|---|---|---|---|']
    .concat(t2.sym.map((r) => `| ${DECL_NAME[r.decl]} | ${r.nG} | ${f6(r.overPN)} | ${f6(r.closed)} | ${fe(r.halfDiff)} |`)).join('\n');
  T.t2rewrite = ['| n_G | 時計の型 | 絶対時間で積む | 当事者時間を独立の変数にして積む(dv/dτ = a_G/(N g)) | 差 |', '|---|---|---|---|---|']
    .concat(t2.rewrite.map((r) => `| ${r.nG} | ${r.type} | ${f6(r.absOverPN)} | ${f6(r.tauOverPN)} | ${lt(r.diff, 1e-8)} |`)).join('\n');
  T.t2diff = ['| n_G | 時計の型 | (ii) − (i) | (iii) − (ii) | (N) − (i) | 型の間の広がり (ii) | 型の間の広がり (iii) |', '|---|---|---|---|---|---|---|']
    .concat(t2.step.map((s) => { const sp = (d) => t2.spread.find((x) => x.decl === d && x.nG === s.nG).spread;
      return `| ${s.nG} | ${s.type} | ${f6(s.iiMinusI)} | ${f6(s.iiiMinusIi)} | ${f6(s.nMinusI)} | ${fe(sp('ii'))} | ${fe(sp('iii'))} |`; })).join('\n')
    + '\n\n(宣言の間の差は一次 —— どの型でも −1/6 = −0.166667 の桁。型の間の広がりは μ の二次(x⁴ の係数の違い)で、誇張した場 μ = 1e-5 の値。(i) と (N) の型の間の広がりは 1e-8 より小さい —— 型が入らない列)';

  const t3 = J.t3;
  T.t3half = ['| 列 | 近点 ÷ 1PN | 見込み |', '|---|---|---|',
    `| 受け手の型 n_G = ½・宣言 (i) | ${f6(t3.half.gLocHalf)} | ${f6(t3.half.closed)} |`,
    `| 対照 (N)・n_G = 0 | ${f6(t3.half.nOnly)} | ${f6(t3.half.closed)} |`,
    `| 差 | ${lt(t3.half.diff, 1e-8)} | 0 |`].join('\n');
  T.t3balance = ['| 宣言 | 今の在位の組と同じ一次になる n_G | 近点 ÷ 1PN(G_loc + 宣言)| 見込み | K1 の +5/3 と足した和 | 和 × 42.98(″/世紀) |', '|---|---|---|---|---|---|']
    .concat(t3.balance.map((b) => `| ${DECL_NAME[b.decl]} | ${b.nG} | ${f6(b.overPN)} | ${f6(b.closed)} | ${f6(b.withK1)} | ${f2(b.withK1ArcsecCy)} |`)).join('\n');
  T.t3added = ['| 足した列(n_G = 2 のまま) | G_loc + 宣言の近点 ÷ 1PN | 同 ″/世紀 | K1 の +5/3 と足した和 | 和 ″/世紀 |', '|---|---|---|---|---|']
    .concat(t3.added.map((a) => `| ${DECL_NAME[a.decl]} | ${f6(a.overPN)} | ${f2(a.gLocArcsecCy)} | ${f6(a.withK1)} | ${f2(a.withK1ArcsecCy)} |`)).join('\n');

  const t4 = J.t4, kn = { two: '2 体', three: '3 体' }, pn = { symmetric: '対称', receiver: '受け手' };
  T.t4 = ['| 系 | G_loc の型 | n_G | 宣言 | 時計の型 | (a) 運動量の残り ÷ Σ m 大きさ(v) | (b) エネルギーの残り ÷ 大きさ(E) | (c) 重心の漂い ÷ a |', '|---|---|---|---|---|---|---|---|']
    .concat(t4.rows.map((r) => `| ${kn[r.kind]} | ${pn[r.pair]} | ${r.nG} | ${r.decl} | ${r.type === null ? '—' : r.type} | ${lt(r.dP, 1e-12)} | ${lt(r.dE, 1e-9)} | ${lt(r.drift, 1e-12)} |`)).join('\n')
    + `\n\n(重力定数 1・c₀ = 1・2 体は質量 0.01 と 0.005・a = 1・e = 0.3、3 体は質量 0.01・0.003・0.002 —— 重心は静止・ψ は 1e-2 の桁・RK4 ${J.decl.nbody.steps} 步で ${J.decl.nbody.orbits} 周。エネルギーはニュートンの E —— G_loc の力は位置の関数の勾配ではないので、n_G = 2 の (b) は宣言 (i) でも残る)`;
  const z = t4.zero;
  T.t4zero = ['| 零試験 | 値 | 門 |', '|---|---|---|',
    `| ① 全部が静止(x = 0)のとき、宣言 (i) と (ii) の加速の差の最大(3 体 × 型 4 × n_G 2 × 対称と受け手) | ${lt(z.restMax, 1e-15)} | ${tf(J.gates.t4Zero)} |`,
    `| ② 一様な場(源なし・背景 ψ₀ = 0.3)では 3 つの宣言とも加速 0(最大) | ${z.uniMax === 0 ? '0' : fe(z.uniMax)} | ${tf(J.gates.t4Zero)} |`,
    `| ③ 一様に動く枠(場と全部の粒子が同じ u = ${J.decl.nbody.boost})の軌道 − 静止の枠の軌道を u t ずらしたもの(最大 ÷ a —— (ii)・(iii) × F・U3) | ${lt(Math.max(...z.boost.map((b) => b.maxShift)), 1e-11)} | ${tf(J.gates.t4Zero)} |`,
    `| ④ 場が加速する(u = A t・A = ${z.field.A}・力なし・T = ${z.field.T}): 慣性の速度の変化・相対の速度の変化・相対の速度を状態として積んだときの取り違え | ${z.field.dV === 0 ? '0' : fe(z.field.dV)}・${fe(z.field.dW)}・${fe(z.field.mixErr)} | ${tf(J.gates.t4Zero)} |`].join('\n');

  T.t5 = ['| 静止の ψ | N = e^(−ψ) | n_G | 宣言 | 絶対時間の加速 ÷ a_N | その場の時計で測った加速 ÷ a_N(閉じた形 a_abs ÷ N²) | 同(短い落下の数値) | 相対の差 |', '|---|---|---|---|---|---|---|---|']
    .concat(J.t5.rows.map((r) => `| ${r.psi} | ${f6(r.N)} | ${r.nG} | ${r.decl} | ${f6(r.aAbsOverN)} | ${f6(r.aTauOverN)} | ${f6(r.aTauNum)} | ${lt(r.rel, 1e-4)} |`)).join('\n')
    + '\n\n(a_N = 点の源のニュートンの加速・長さは座標のまま〔その場の物差しの読みは入れていない〕。静止から放した瞬間は dp/dτ = 0 なので、連鎖律 d²p/dt² = (dτ/dt)² d²p/dτ² + (d²τ/dt²)(dp/dτ) の第 2 項は 0。ψ = 0.5 は孤立の点の源の r_s での静止の ψ)';
  return T;
}
