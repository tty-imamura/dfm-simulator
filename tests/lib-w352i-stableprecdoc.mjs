// 第352便i(統括の検証項目 R446): PHYSICS〔第352便i〕の表と数の文を正本から作る純関数(docs.stableprec352i が逐語で照合する)。import しない・ファイルを読まない。
export const DOC_VERSION = 'w352i-stableprecdoc-1';

/** 原文(言葉を変えずに引く —— 出どころ・原文) */
export const ORIGINAL = Object.freeze([
  Object.freeze(['原仮定者の回答(2026-11-24 —— 第148報)', 'AN1016: (乙)で進める。ただし、「釣り合う」に「安定した歳差運動」を含む']),
  Object.freeze(['原仮定者の整理(2026-11-23 —— 第146報)', '釣り合う軸の向きは、銀河由来と太陽由来の軸引きずりを重みで合成した方向。その方向と観測の向きが違う場合は、その方向を軸に歳差運動が現れる']),
  Object.freeze(['原仮定者の回答(2026-11-24 —— 第147報)', '両方の経路が有り、比率は天体の構造などに起因するので、ノブにする']),
]);
/** 読み(統括の読み —— 原文と分ける) */
export const READINGS = Object.freeze([
  '釣り合う向き = 合成のベクトルの向き。自転軸が合成の向きのまわりを、円錐の半頂角を保って回り続ける状態も「釣り合い」に含める(共通ブリーフの読み)。',
  '「その方向を軸に歳差運動が現れる」= 合成の軸のまわりの経路 ②。半頂角を保つかどうかは経路 ① の比率で替わる。',
  '比率のノブ f((R3) の 2 経路の比 —— 第351便d の (N1))は 0・0.5・1 を並べる(既定の値は置かない)。',
]);
export function originalTable() {
  const out = ['| # | 出どころ | 原文(言葉を変えずに引く) | 読み(統括の読み —— 原文と分ける) |', '|---|---|---|---|'];
  ORIGINAL.forEach(([src, t], i) => out.push(`| ${i + 1} | ${src} | 「${t}」 | ${READINGS[i]} |`));
  return out.join('\n');
}
/** 「安定した歳差運動」の読み 3 つ(固定の表) */
export const READ_TABLE = [
  '| 読み | 何を見るか | 判定の量 | 当たる列(本節) |',
  '|---|---|---|---|',
  '| (読み A) 半頂角が変わらない | 1 周あたりの半頂角の変化が 0 | 半頂角の 1 周あたりの変化 | 一定の合成の軸の f 0 の行・回る合成の軸の止まる点(中立の点を含む) |',
  '| (読み B) 乱しても戻る | 半頂角を δ だけ変えた初期値が元の円錐へ戻る | 戻りの率(正 = 戻る・0 = 中立・負 = 離れる) | 回る合成の軸の f > 0 の引き込む点 |',
  '| (読み C) 見ている時間の間は変わらない | 太陽系の年齢の間の半頂角の変化が 1% より小さい | 縮む時間(半頂角が 1/e になる時間)と年齢の比 | 一定の合成の軸の f > 0 の行(背景の大きさの列ごと) |',
].join('\n');
/** 合成の軸を動かすものの候補(固定の表) */
export const CAND_TABLE = [
  '| 候補 | 回る軸 n̂ | 傾き I | 率 g |',
  '|---|---|---|---|',
  '| (a) 局所の項が公転の位相で変わる分 | 1 周の平均の Ω̂ | 引数(離心率・公転面と太陽の赤道の角で替わる —— 本節では数えていない) | 公転の角速度(比 ρ_a = T_W ÷ 公転の周期 ÷ k₂) |',
  '| (b) 公転面が基準軸のまわりを回る分 | 基準軸(L・eq) | Ω̂ と基準軸の角((N+) では背景が基準軸の向き —— 局所の項が公転面と一緒に回ると置く) | 引数(ρ を 1e-3〜1e3) |',
  '| (c) 太陽の自転軸が基準軸のまわりを回る分 | 基準軸(L・eq) | (b) と同じ数((S) の向きが太陽の自転軸と一緒に回ると置く) | 引数(ρ を 1e-3〜1e3) |',
  '| (d) 背景の向きが動く分 | 引数 | 引数(表 2 の格子) | 引数 |',
].join('\n');

const e3 = (x) => (x === null || x === undefined ? '—' : x === 0 ? '0' : Number(x).toExponential(2));
const f2 = (x) => (x === null || x === undefined ? '—' : Number(x).toFixed(2));
const f3 = (x) => (x === null || x === undefined ? '—' : Number(x).toFixed(3));
const pc = (x) => (x === null || x === undefined ? '—' : x === 0 ? '0' : x >= 0.995 ? (100 * x).toFixed(1) + '%' : x < 1e-3 ? e3(100 * x) + '%' : (100 * x).toFixed(2) + '%');
const BGL = { Np: '(N+)', Gm: '(G−)' };
const bgName = (bg, ax) => BGL[bg] + (ax ? ' ' + ax : '');
const SN = { g2p: '(g2+)', g2m: '(g2−)' };
const NAME = { Mercury: '水星', Venus: '金星', Earth: '地球', Mars: '火星', Jupiter: '木星', Saturn: '土星', Uranus: '天王星', Neptune: '海王星', Sun: '太陽' };
const BGCOLS = [['Np', 'L'], ['Np', 'eq'], ['Gm', null]];

export function tablesOf(J) {
  const T = {};
  const t1 = (id, bg, ax, u, sense, f) => J.t1.find((r) => r.id === id && r.bg === bg && r.axis === ax && r.u === u && r.sense === sense && r.f === f);
  // 表 1: 一定の合成の軸(f 0.5・(g2+) —— 半頂角の変化と戻りは (g2±) で同じ)
  {
    const out = ['| 受け手 | 背景の向き | 半頂角 θ (uV) ° | 1 周 T_W (uV) 年 | 半頂角 θ (u1) ° | 1 周 T_W (u1) 年 | 1 周の半頂角の変化 (uV) ° | 1 周あたりの戻り (uV) | 縮む時間 (uV) 年 | 縮む時間 (u1) 年 | 年齢の間の変化 (uV) | 年齢の間の変化 (u1) |',
      '|---|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|'];
    for (const id of J.decl.recv) for (const [bg, ax] of BGCOLS) {
      const a = t1(id, bg, ax, 'uV', 'g2p', 0.5), b = t1(id, bg, ax, 'u1', 'g2p', 0.5);
      out.push(`| ${NAME[id]} | ${bgName(bg, ax)} | ${f2(a.thDeg)} | ${e3(a.turnYr)} | ${f2(b.thDeg)} | ${e3(b.turnYr)} | ${f3(a.dThPerTurnDeg)} | ${f3(a.returnPerTurn)} | ${e3(a.tE)} | ${e3(b.tE)} | ${pc(a.ageShrinkFrac)} | ${pc(b.ageShrinkFrac)} |`);
    }
    T.t1 = out.join('\n');
  }
  // 表 1′: f と向きの読みの判定の量(地球 (N+) L・uV)
  {
    const out = ['| f | 向きの読み | k₁ | σ k₂ | 1 周の半頂角の変化 ° | 位相の 1 周あたりの進み ° | 1 周あたりの戻り | 戻りの率 (1/年) |', '|---:|---|---:|---:|---:|---:|---:|---:|'];
    for (const f of J.decl.fShow) for (const sense of J.decl.senses) {
      const r = t1('Earth', 'Np', 'L', 'uV', sense, f);
      out.push(`| ${f} | ${SN[sense]} | ${f3(kk(f).k1)} | ${f3(sense === 'g2p' ? kk(f).k2 : -kk(f).k2)} | ${f3(r.dThPerTurnDeg)} | ${f2(r.phasePerTurnDeg)} | ${f3(r.returnPerTurn)} | ${e3(r.returnRatePerYr)} |`);
    }
    T.t1f = out.join('\n');
  }
  // 表 2: 回る合成の軸の止まる点(無次元)—— f 0.5 の (g2+)・(g2−) と f 0 の (g2+)
  const RH = [-10, -1, -0.1, 0.1, 1, 10];
  for (const [key, f, sense] of [['t2p', 0.5, 'g2p'], ['t2m', 0.5, 'g2m'], ['t20', 0, 'g2p']]) {
    const out = ['| 傾き I ° | ' + RH.map((r) => 'ρ ' + r).join(' | ') + ' |', '|---:|' + RH.map(() => '---:').join('|') + '|'];
    for (const I of J.decl.IDeg) {
      const cells = RH.map((rho) => { const r = J.t2.find((x) => x.IDeg === I && x.rho === rho && x.f === f && x.sense === sense); return `${f2(r.halfDeg)} / ${f2(r.lagDeg)} / ${f3(r.returnRate)}`; });
      out.push(`| ${I} | ${cells.join(' | ')} |`);
    }
    T[key] = out.join('\n');
  }
  // 表 3: 候補 (b)(c) の傾き I と、止まる点の半頂角(f 0.5)
  {
    const RC = [-1, -0.01, 0.01, 1];
    const out = ['| 受け手 | 背景の向き | 大きさ | 傾き I ° | 今の ŝ と n̂ の角 ° | ' + RC.map((r) => '(g2+) ρ ' + r).join(' | ') + ' | ' + RC.map((r) => '(g2−) ρ ' + r).join(' | ') + ' |',
      '|---|---|---|---:|---:|' + RC.map(() => '---:').join('|') + '|' + RC.map(() => '---:').join('|') + '|'];
    for (const id of J.decl.candBodies) for (const ax of ['L', 'eq']) for (const u of J.decl.uCols) {
      const rows = J.cand.filter((r) => r.id === id && r.bg === 'Np' && r.axis === ax && r.u === u), r0 = rows[0];
      const cell = (sense, rho) => f2(rows.find((r) => r.sense === sense && r.rho === rho).halfDeg);
      out.push(`| ${NAME[id]} | (N+) ${ax} | (${u}) | ${f3(r0.IDeg)} | ${f2(r0.actHalfDeg)} | ${RC.map((x) => cell('g2p', x)).join(' | ')} | ${RC.map((x) => cell('g2m', x)).join(' | ')} |`);
    }
    T.cand = out.join('\n');
  }
  // 表 3′: (a) の比 ρ_a
  {
    const out = ['| 受け手 | 大きさ | 公転の周期 年 | 1 周 T_W 年 | 比 ρ_a | 局所の項 ÷ abs(Ω) |', '|---|---|---:|---:|---:|---:|'];
    for (const r of J.candA) out.push(`| ${NAME[r.id]} | (${r.u}) | ${f3(r.orbitYr)} | ${e3(r.turnYr)} | ${e3(r.rhoA)} | ${e3(r.locOverW)} |`);
    T.candA = out.join('\n');
  }
  // 表 4: 逆に解いた ρ(f 0 は中立の点・f 0.5 は引き込む点 —— ρ(Ω̂ との遅れ °・戻りの率 ÷ W))
  {
    const out = ['| 受け手(目標 °) | 傾き I ° | f 0 (g2+) | f 0 (g2−) | f 0.5 (g2+) | f 0.5 (g2−) |', '|---|---:|---|---|---|---|'];
    for (const id of J.decl.invBodies) for (const I of J.decl.invIDeg) {
      const c = (f, s) => { const x = J.inv.find((q) => q.id === id && q.IDeg === I && q.f === f && q.sense === s); return x.roots.length ? x.roots.map((r) => `${Number(r.rho).toPrecision(3)}(${f2(r.lagDeg)}°・${f3(r.returnRate)})`).join('・') : '根なし'; };
      const tg = J.inv.find((q) => q.id === id).targetDeg;
      out.push(`| ${NAME[id]}(${f2(tg)}) | ${I} | ${c(0, 'g2p')} | ${c(0, 'g2m')} | ${c(0.5, 'g2p')} | ${c(0.5, 'g2m')} |`);
    }
    T.inv = out.join('\n');
  }
  // 表 5: 読み A・B・C に当たる列の数
  {
    const out = ['| 読み | 数えた所 | 列の数 | 当たる列 | うち表 1 | うち表 2 |', '|---|---|---:|---:|---:|---:|'];
    for (const r of J.t4) out.push(`| ${r.reading} | ${r.what} | ${r.n} | ${r.hits} | ${r.t1} | ${r.t2} |`);
    T.t4 = out.join('\n');
  }
  // 表 6: 逆行と 90° を越える天体(f 0.5)
  {
    const out = ['| 受け手 | 背景の向き | 大きさ | 合成の軸との角 θ ° | 公転の法線との角 ° | 90° を越える | 戻りの率の符号 | 縮む時間 (α) 年 | 90° に着く時間 (β) 年 |', '|---|---|---|---:|---:|---|---:|---:|---:|'];
    for (const r of J.t5) out.push(`| ${NAME[r.id]} | ${bgName(r.bg, r.axis)} | (${r.u}) | ${f2(r.thDeg)} | ${f2(r.oblDeg)} | ${r.over90 ? '越える' : '越えない'} | ${r.returnSign > 0 ? '+' : r.returnSign < 0 ? '−' : '0'} | ${e3(r.tE)} | ${e3(r.tStar)} |`);
    T.t5 = out.join('\n');
  }
  return T;
}
/** (N1) の係数(f → k₁・k₂ —— 第351便d の r3Coeffs と同じ式を文書の lib に写す。照合は QA の behavior の側) */
function kk(f) { const h = Math.hypot(1 - f, f); return { k1: f / h, k2: (1 - f) / h }; }

export function factsOf(J) {
  const F = {};
  const g = (id, bg, ax, u, f) => J.t1.find((r) => r.id === id && r.bg === bg && r.axis === ax && r.u === u && r.sense === 'g2p' && r.f === f);
  const eL = g('Earth', 'Np', 'L', 'uV', 0.5), eU = g('Earth', 'Np', 'L', 'u1', 0.5);
  F.turn = `- 1 周 T_W = 2π ÷ abs(Ω): 地球・(N+) L で (uV) ${e3(eL.turnYr)} 年・(u1) ${e3(eU.turnYr)} 年。太陽系の年齢(第318便d の文献の値・未照合)${e3(J.sunAgeYr)} 年。`;
  F.shrink = `- 一定の合成の軸・f 0.5 では、1 周の間に tan(θ/2) が e^(−2π k₁) = ${e3(Math.exp(-2 * Math.PI * kk(0.5).k1))} 倍になる(地球・(N+) L・(uV) の 1 周の半頂角の変化 ${f3(eL.dThPerTurnDeg)}°)。縮む時間は (uV) ${e3(eL.tE)} 年・(u1) ${e3(eU.tE)} 年 —— 年齢の間の変化は (uV) ${pc(eL.ageShrinkFrac)}・(u1) ${pc(eU.ageShrinkFrac)}。`;
  const c = J.t4.find((r) => r.reading === 'C');
  F.readC = `- 読み C(年齢の間の変化が 1% より小さい)に当たる f > 0 の行: (uV) ${c.byU.uV.hits}/${c.byU.uV.n}・(u1) ${c.byU.u1.hits}/${c.byU.u1.n}。`;
  const t2p = (I, rho) => J.t2.find((x) => x.IDeg === I && x.rho === rho && x.f === 0.5 && x.sense === 'g2p');
  const mx10 = Math.max(...J.t2.filter((x) => x.IDeg === 10 && x.f === 0.5).map((x) => x.halfDeg));
  F.lock = `- 回る合成の軸・f 0.5 の引き込む点の n̂ との角は、格子の上で傾き I 10° のとき最大 ${f2(mx10)}°(ρ 1 で ${f2(t2p(10, 1).halfDeg)}°・ρ −1 で ${f2(t2p(10, -1).halfDeg)}°)。戻りの率 ÷ W は格子の f 0.5 の全部の行で正(最小 ${f3(Math.min(...J.t2.filter((x) => x.f === 0.5).map((x) => x.returnRate)))})。`;
  const sym = J.t2.filter((x) => x.sense === 'g2p').every((a) => { const b = J.t2.find((y) => y.sense === 'g2m' && y.IDeg === a.IDeg && y.rho === -a.rho && y.f === a.f); return b && Math.abs(a.halfDeg - b.halfDeg) < 1e-9; });
  F.sym = `- 表 2 の格子の上では、(g2−) の ρ の行の n̂ との角が、(g2+) の −ρ の行の角と同じ(${sym ? '全部の行' : '同じでない行が在る'} —— a = σ k₂ W Ω̂ − g n̂ の σ と g の符号を同時に替えると a の符号だけが替わる形)。`;
  const inv = (id, I, f, s) => J.inv.find((q) => q.id === id && q.IDeg === I && q.f === f && q.sense === s).roots.length;
  F.inv = `- 地球の傾き(geometry の値 ${f2(J.inv.find((q) => q.id === 'Earth').targetDeg)}°)が f 0.5 の引き込む点になる ρ の根の数: 傾き I 1°・5.23°・7.252°・10° では ${[1, 5.23, 7.252, 10].map((I) => inv('Earth', I, 0.5, 'g2p')).join('・')}・I 30° では ${inv('Earth', 30, 0.5, 'g2p')}・I 60° では ${inv('Earth', 60, 0.5, 'g2p')}((g2+))。f 0 の中立の点は I 1° でも根が在る(ρ が 1 の近く)。`;
  return F;
}
