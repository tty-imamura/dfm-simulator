// 第356便c(原仮定者の回答(2026-11-26)・統括の検証項目 R515):
// **論文 5 の構成案を、回答の後の形へ置き直す文書の lib —— 原文(言葉を変えずに引く)・訂正の鎖・主の列の表(並進の運動の寄与)・論文 5 の流れの表・
// 比べる列の表(斥力の則の族 —— 切る距離 ÷ 箱の一辺・粒を増やした箱・二次元)・伺う文の案と回答の表・三次元の熱の項のアプリの便で要るものの表と、
// QA docs.paper5ans356c の照合の関数**(純関数 —— import しない・ファイルを読まない。数は第355便g・第355便i の正本〔QA が読んで渡す〕から作る)。
// 器・正本・段は無い(文書の枝)。主の列は「回答で主に置いた列」—— 正しさの判定ではない。「引きずり」をどの項で読むかは未(〔第356便d〕の表の後に伺う)。
export const DOC_VERSION = 'w356c-paper5doc-1';

export const HEAD = '〔第356便c — ';
export const PP_HEAD = '### ⑪ 回答の後の形';
export const SRC_ANS = '原仮定者の回答(2026-11-26)';

/** 原文(言葉を変えずに —— リポジトリの第355便の統括の節〔⑧〕・PAPER_PLAN の論文 5 の節・〔第355便i〕・〔第349便〕ほかの字から写した) */
export const ORIGINAL = Object.freeze([
  Object.freeze([SRC_ANS, 'AN1145: 次点。「斥力に見えたのは引きずり」と言う流れ']),
  Object.freeze(['原仮定者の回答(2026-11-22)', 'もしも気体の圧力が粒子間の斥力なら']),
  Object.freeze(['原仮定者の指示(2026-11-21)', '主にgeoPN=2を使用。アナロジーとして、熱の三態の創発の検証結果を示す。3Dに拡張し、理想気体の状態方程式に近付ける']),
  Object.freeze(['原仮定者の回答(2026-11-22)', 'AN949: Aで進める。論文5は、geoPN=0を使用に変更する。2D版と3D版のサンプルをそれぞれ用意する']),
  Object.freeze(['原仮定者の整理(2026-11-23)', '引きずりは、相対的な座標の時間差分に由来する座標変換である。座標変換は熱を生まない。ただし、座標の変化で潮汐力が発生すると、熱や潮汐ロックが生じる。同様に、ジャイロトルクも、熱や自転を生じる経路になる']),
]);
export const READINGS = Object.freeze([
  '次点 = 〔第355便i〕の比べる列 B(並進の運動の寄与を主にする列 —— いまの斥力の形のまま、斥力の強さは、全体の冪が窓に入る倍の内)を、論文 5 の圧力の主の列に置く。流れは「斥力に見えたのは引きずり」へ進む',
  '入口の思考実験 —— 文は変えない(本節の後も入口の文のまま)',
  '「近付ける」の物差しは密度への冪と温度への冪(窓 0.9〜1.1 —— 窓の内か外かで言う)。アナロジーとして(現実の熱力学の記述ではない)',
  '論文 5 は geoPN=0・2D 版と 3D 版の本を両方 —— 主の列の数は二次元と三次元の両方で持つ',
  '器に入れる引きずりの項は熱を生まない形にする(座標変換)。「引きずり」をどの項で読むか(並進引きずり・スピンに由来する引きずり)は未',
]);
export function originalTable() {
  return ['| 出どころ | 原文 | 読み |', '|---|---|---|'].concat(ORIGINAL.map(([s, o], k) => `| ${s} | 「${o}」 | ${READINGS[k]} |`)).join('\n');
}

const f3 = (x) => (x === null || x === undefined || !Number.isFinite(x)) ? '—' : x.toFixed(3);
const inW = (x, W) => x >= W[0] && x <= W[1];

/** 第355便g の正本(Jg)・第355便i の正本(Ji)から、主の列と比べる列の数を集める(丸めない —— 字にするのは表の関数) */
export function numsOf(Jg, Ji) {
  const W = Ji.decl.window, t1 = (id) => Jg.t1.find((r) => r.col === id), bc = (id) => Ji.b.find((c) => c.col === id);
  const col = (id) => { const c = bc(id), ins = c.rows.filter((r) => r.inWin);
    return { col: id, up: c.upperMult, allIn: c.allIn, inMults: ins.map((r) => r.mult), maxRep: Math.max(...ins.map((r) => r.repOverKin)), rows: c.rows,
      outMin: c.rows.filter((r) => !r.inWin).map((r) => r.repOverKin).reduce((a, b) => Math.min(a, b), Infinity) }; };
  const rep = { K2: t1('K2-L0').aRho, A3: t1('A3-L0').aRho, B3: t1('B3-L1').aRho, C3: t1('C3-L2').aRho };
  const repN = Jg.t3.map((r) => r.aRhoN);
  const kin = { G2: t1('G2').aRho, G3: t1('G3').aRho };
  const all = ['a1', 'a2', 'a3', 'a4'].flatMap((k) => Ji[k]), S = Ji.summary;
  const N0 = Ji.decl.base.N, rho = Ji.decl.rho3, rMid = rho[1], aS = Math.pow(rMid, -1 / 3);   // 平均の粒の間隔 a★ = (体積 ÷ 粒の数)^(1/3)(中の密度)
  const side = (N, r) => Math.pow(N / r, 1 / 3);
  const fam = S.inWin.map((id) => { const r = all.find((q) => q.id === id), c = r.sp.c, a8 = Ji.a8.find((q) => q.id === id), a6 = Ji.a6.find((q) => q.id === id);
    return { id, aBox: r.aBox, aN: r.aN, aT: r.aT, c, cut: r.sp.cut,
      ratioN: [N0, 216, 512].map((N) => c * aS / side(N, rMid)),            // 中の密度で 切る距離 ÷ 箱の一辺(粒 64・216・512)
      ratioRho: rho.map((r0) => c * aS / side(N0, r0)),                      // 粒 64 の箱で振る 3 点の 切る距離 ÷ 箱の一辺
      big: a8 ? a8.big[0].aBox : null, big64: a8 ? a8.aBox64 : null, d2: a6 ? { aBox: a6.aBox, aN: a6.aN, aT: a6.aT, inWin: a6.inWin } : null }; });
  return { W, cols: { K2: col('K2-L0t'), A3: col('A3-L0t'), B3: col('B3-L1t') }, rep, repN, kin, fam, nCombos: S.nCombos, nIn: S.inWin.length, aStar: aS, N0, rho };
}

/** 主の列の表(並進の運動の寄与を主にする列 —— 〔第355便i〕の表 B の列。いまの斥力の形のまま・斥力の強さは全体の冪が窓に入る倍の内) */
export function mainTable(Jg, Ji) {
  const n = numsOf(Jg, Ji);
  const row = (c, dim, law, note) => `| ${c.col} | ${dim} | ${law} | ${c.rows.map((r) => r.mult + ': ' + f3(r.aRho) + (r.inWin ? '(内)' : '(外)')).join('・')} | ${c.up === null ? (c.allIn ? '格子の全部が内(倍 3 まで)' : '—') : '倍 ' + f3(c.up) + ' 以下'} | ${f3(c.maxRep)} | ${note} |`;
  return ['| 列(第355便g の名) | 次元 | 斥力の則 | 斥力の強さの倍: 全体の密度への冪(窓) | 窓に入る斥力の強さの倍(格子の上の線形の内挿) | 窓の内の格子の点の 斥力の分 ÷ 並進の分(中の密度)の最大 | 主の列での置き方 |', '|---|---|---|---|---|---|---|',
    row(n.cols.K2, 2, '(L0) いまの形', '主の列(二次元)'),
    row(n.cols.A3, 3, '(L0) いまの形を三次元へそのまま', '主の列(三次元)'),
    row(n.cols.B3, 3, '(L1) 立体角で薄める(表 6b の候補の則)', '比べる列(いまの形ではない)')].join('\n');
}

/** 論文 5 の流れの表(入口の文は変えない・「引きずり」をどの項で読むかは未) */
export function flowTable(Jg, Ji) {
  const n = numsOf(Jg, Ji), c = n.cols;
  return ['| 段 | 流れの文 | 数(第355便g・第355便i の正本) | 状態 |', '|---|---|---|---|',
    `| 1 | 入口の思考実験「${ORIGINAL[1][1]}」 | —— | 文は変えない |`,
    `| 2 | 斥力だけの圧力は、いまの形では密度の 1 乗にならない | 斥力だけ(並進なし・箱で振る)の密度への冪: 二次元 ${f3(n.rep.K2)}・三次元 ${f3(Math.min(n.rep.A3, n.rep.B3, n.rep.C3))}〜${f3(Math.max(n.rep.A3, n.rep.B3, n.rep.C3))}((L0) ${f3(n.rep.A3)}・(L1) ${f3(n.rep.B3)}・(L2) ${f3(n.rep.C3)})・粒の数で振ると ${f3(Math.min(...n.repN))}〜${f3(Math.max(...n.repN))} | 窓 0.9〜1.1 の外 |`,
    `| 3 | 並進の運動の寄与が主の列では、全体の冪は窓の内 | 斥力の強さの倍 二次元 ${f3(c.K2.up)} 以下・三次元 (L0) ${f3(c.A3.up)} 以下で窓の内(並進だけ: 二次元 ${f3(n.kin.G2)}・三次元 ${f3(n.kin.G3)})・窓の内の格子の点の 斥力の分 ÷ 並進の分 ${f3(Math.max(c.K2.maxRep, c.A3.maxRep))} 以下 | 主の列(回答の後) |`,
    `| 4 | 「斥力に見えたのは引きずり」 | —— | 「引きずり」をどの項で読むかは未(〔第356便d〕の表の後に伺う —— 器に入れる引きずりの項は熱を生まない形) |`].join('\n');
}

/** 比べる列の表(斥力の則の族 —— 窓に入った組。主の列にしない) */
export function compareTable(Jg, Ji) {
  const n = numsOf(Jg, Ji), r3 = (a) => a.map(f3).join('・');
  return ['| 組(第355便i の名) | 箱で振る冪 | 粒の数で振る冪 | 温度への冪 | 切る距離 ÷ 箱の一辺(中の密度 —— 粒 64・216・512) | 切る距離 ÷ 箱の一辺(粒 64 の箱で振る 3 点 —— 密度 ' + n.rho.join('・') + ') | 粒 216 の箱で振る冪(粒 64 → 216) | 二次元の箱(箱で振る・粒の数で振る・温度) | 置き方 |', '|---|---|---|---|---|---|---|---|---|']
    .concat(n.fam.map((r) => `| ${r.id} | ${f3(r.aBox)} | ${f3(r.aN)} | ${f3(r.aT)} | ${r3(r.ratioN)} | ${r3(r.ratioRho)} | ${r.big === null ? '未' : f3(r.big64) + ' → ' + f3(r.big) + (inW(r.big, n.W) ? '(内)' : '(外)')} | ${r.d2 === null ? '未' : f3(r.d2.aBox) + '・' + f3(r.d2.aN) + '・' + f3(r.d2.aT) + (r.d2.inWin ? '(内)' : '(外)')} | 比べる列(主の列にしない) |`)).join('\n');
}

/** 伺う文の案と回答(当時の字を消さずに、回答で閉じたものに「回答: …」の行を継ぐ) */
export const ASKS = Object.freeze([
  Object.freeze(['表 6c(〔第355便i〕の ⑩)', '斥力の則は、どの組で進めますか', '距離の冪 1 の形 (P2) に、届く距離をなめらかに切るノブと近くの粒の数で割るノブを足した組 (P2s1/cs4/p1n3)', '並進の運動の寄与を主にする列 B(今の形のまま、斥力の強さを窓に入る倍の内に置く)', 'closed']),
  Object.freeze(['表 6b(〔第355便g〕の ⑦ (1))', '三次元の熱の項の形は、どの列で進めますか(熱の担い手)', '(ウ) 両方(ノブで切り替え・既定は (ア) スカラーの内部温度)', '(ア) だけ', 'open']),
  Object.freeze(['表 6b(〔第355便g〕の ⑦ (2))', '斥力の距離の則', '(L0) を既定 + (L1) をノブで', '(L1) を三次元の既定', 'open']),
  Object.freeze(['表 6b(〔第355便g〕の ⑦ (3))', '斥力の熱への依り方', '(積)', '(和)', 'open']),
  Object.freeze(['表 6b(〔第355便g〕の ⑦ (4))', '摩擦(並進 → 熱)', '(F-vec)', '(F-scal)', 'open']),
  Object.freeze(['表 6b(〔第355便g〕の ⑦ (5))', '温度と圧力の定義(U5-3)', '圧力 = 壁に渡る力積 ÷ 時間 ÷ 面の大きさ(二次元は長さ)・温度 = 並進の温度と内部の温度を別々に出して並べる', '温度 = 内部の温度だけ', 'open']),
]);
export const ANS_LINE = `回答: ${SRC_ANS}「${ORIGINAL[0][1]}」 —— 次点(並進の運動の寄与を主にする列 B)を主の列に置く・推奨の組は比べる列に残す`;
export function askTable() {
  const out = ['| 伺った所 | 伺う文の案(当時の字) | 当時の推奨 | 当時の次点 | 状態 |', '|---|---|---|---|---|'];
  for (const [w, q, p, s, st] of ASKS) {
    out.push(`| ${w} | ${q} | ${p} | ${s} | ${st === 'closed' ? '回答で閉じた(理想気体の則への近づけ方)' : '未(回答の対象の外 —— 本節では閉じていない)'} |`);
    if (st === 'closed') out.push(`| ↳ | ${ANS_LINE} | —— | —— | 本節の主の列 |`);
  }
  return out.join('\n');
}

/** 三次元の熱の項のアプリの便で要るもの(回答の後の形 —— 足さないものを含む) */
export const APP = Object.freeze([
  Object.freeze(['斥力の項', 'いまの形のまま(E5′ の形・熱への依り方は表 6b の問い (3) —— 未)', '斥力の則の族のノブ(形 × 距離の冪・届く距離を切る・近くの粒の数で割る)は足さない']),
  Object.freeze(['斥力の強さ', '既存の強さの鍵のまま —— 本の値を、全体の冪が窓に入る倍の内に置く(器の倍: 二次元・三次元 (L0) の上端は主の列の表)', '強さの新しいノブは足さない']),
  Object.freeze(['三次元の受理の門', '斥力の項を三次元で受ける形が要る(いまは拒否 —— 表 6b の候補の則の問い (2) は未)', '—']),
  Object.freeze(['熱の担い手・摩擦・拡散・壁・相変化の角', '表 6b の問いのまま(未)', '—']),
  Object.freeze(['「引きずり」の項', '未(どの項で読むかは〔第356便d〕の表の後に伺う —— 熱を生まない形)', 'アプリの積分へは、伺った後の便まで入れない']),
]);
export function appTable() {
  return ['| 項 | 回答の後の形 | 足さないもの |', '|---|---|---|'].concat(APP.map((r) => '| ' + r.join(' | ') + ' |')).join('\n');
}

/** 訂正の鎖(当時の文を消さずに後ろへ継ぐ) */
export const CHAIN = Object.freeze([
  Object.freeze(['1', '〔第355便g〕の ⑦ (2)', '伺う文の案「斥力の距離の則」—— 推奨 (L0) を既定 + (L1) をノブで・次点 (L1) を三次元の既定。読み「近づける道は、この器では斥力の則の側ではなく、並進の運動の寄与の側に在る」(⑤ (1))', '当時の字のまま']),
  Object.freeze(['2', '〔第355便i〕の ⑩・表 6c', '伺う文の案「斥力の則は、どの組で進めますか」—— 推奨 族の組 P2s1/cs4/p1n3・次点 並進の運動の寄与を主にする列 B', '当時の字のまま']),
  Object.freeze(['3', SRC_ANS, '「' + ORIGINAL[0][1] + '」', '次点を主の列に']),
  Object.freeze(['4', '本節(〔第356便c〕)と PAPER_PLAN の ⑪', '主の列 = 並進の運動の寄与・比べる列 = 斥力の則の族・入口の文は変えない・「引きずり」の項は未', '回答の後の形']),
]);
export function chainTable() {
  return ['| 鎖 | 段 | 字 | 状態 |', '|---|---|---|---|'].concat(CHAIN.map((r) => '| ' + r.join(' | ') + ' |')).join('\n');
}

/** 数の文(正本から) */
export function factsOf(Jg, Ji) {
  const n = numsOf(Jg, Ji), c = n.cols, F = {};
  F.main = `主の列(並進の運動の寄与)の窓に入る斥力の強さの倍は、二次元 ${f3(c.K2.up)} 以下・三次元 (L0) ${f3(c.A3.up)} 以下(格子の上の線形の内挿)。窓の内の格子の点の 斥力の分 ÷ 並進の分(中の密度)は ${f3(Math.max(c.K2.maxRep, c.A3.maxRep))} 以下(〔第355便i〕の ⑧ の (vii) の「0.36 以下」は、窓の外の行 K2-L0t の倍 1 の ${f3(c.K2.outMin)} を含む上の限り)。`;
  F.rep = `斥力だけの圧力(並進なし・箱で振る)の密度への冪は、二次元 ${f3(n.rep.K2)}・三次元 ${f3(Math.min(n.rep.A3, n.rep.B3, n.rep.C3))}〜${f3(Math.max(n.rep.A3, n.rep.B3, n.rep.C3))} —— どれも窓 0.9〜1.1 の外。`;
  F.fam = `比べる列(斥力の則の族)は、宣言した ${n.nCombos} 組のうち ${n.nIn} 組で 3 つの冪が窓の内(三次元・粒 ${n.N0})。どの組も切る距離は ${n.fam.map((r) => r.c).filter((v, k, a) => a.indexOf(v) === k).join('・')} a★(a★ = 中の密度の平均の粒の間隔 ${n.aStar.toFixed(3)})で、中の密度の箱の一辺に対して 粒 64 で ${f3(n.fam[0].ratioN[0])}・216 で ${f3(n.fam[0].ratioN[1])}・512 で ${f3(n.fam[0].ratioN[2])} 倍。`;
  const bg = n.fam.filter((r) => r.big !== null);
  F.big = `粒 216 の箱で振る冪は、${bg.map((r) => (r.cut === 'smooth' ? 'なめらかに切る組 ' : '段で切る組 ') + r.id + ' ' + f3(r.big64) + ' → ' + f3(r.big)).join('・')}(残りの組の粒 216 と、粒 512 は未)。`;
  const d2 = n.fam.filter((r) => r.d2 !== null);
  F.d2 = `同じ組を二次元の箱で振ると、${d2.map((r) => r.id + ' の粒の数で振る冪は ' + f3(r.d2.aN) + (r.d2.inWin ? '(窓の内)' : '(窓の外)')).join('・')}。`;
  return F;
}

// ---- 照合(QA docs.paper5ans356c の本体 —— 純関数)
const rv = (t) => t.split('').reverse().join(''), cp = (a) => String.fromCodePoint(...a);
/** 書かない語(引用の外 —— 本節・⑪・AI_SPEC の節・CHANGELOG の行。逆順・符号で持つ) */
export const NOT_WORDS = Object.freeze(['ためか確', 'たし示', 'たし明説', 'たし定同', '束収', 'たけ導', 'たっか分', 'たきで明説', 'たっま決', 'たっ合', 'たし決解', 'たい付近', 'たっ合り釣', 'るきで明説', 'いなきで明説', 'たし認確', 'たし致一',
  'たっなに体気想理', '達', 'たっなに則の体気想理'].map(rv));
/** 禁句(引用の中でも書かない) */
export const NG_WORDS = Object.freeze([cp([0x518d, 0x73fe]), cp([0x5408, 0x308f, 0x305b, 0x3089, 0x308c, 0x306a, 0x3044]), cp([0x666e, 0x904d, 0x5b9a, 0x6570]), cp([0x79c1, 0x4fe1]), cp([0x6dfb, 0x4ed8]), cp([0x5be9, 0x67fb]),
  cp([0x30d5, 0x30a3, 0x30c3, 0x30c8]), cp([0x8f03, 0x6b63]), cp([0x5b8c, 0x5168, 0x306b, 0x4e00, 0x81f4])].concat(['TPGtahC', 'korG', 'inimeG', 'edualC', '-TPG', 'supO', 'tennoS', 'ukiaH', 'elbaF', 'ciporhtnA',
  'NEPO_SNOISICED', 'ffodnah_pamdaor', 'etavirp-rotalumis-mfd', 'stnemhcatta'].map(rv)));
const dropOrig = (t) => ORIGINAL.reduce((s, [, o]) => s.split(o).join(''), t);

/** PHYSICS の節(見出しの頭から次の節の見出し・「## 」の前まで) */
export function physSecOf(ph, head) {
  const i = ph.indexOf('\n' + head); if (i < 0) return '';
  const m = /\n〔第\d+便[a-z0-9]* — |\n〔第\d+便 — |\n## /g; m.lastIndex = i + 2; const z = m.exec(ph);
  return ph.slice(i + 1, z ? z.index : ph.length);
}
/** PAPER_PLAN の ⑪(見出しから次の「### 」「## 」の前まで) */
export function ppSecOf(pp) {
  const i = pp.indexOf('\n' + PP_HEAD); if (i < 0) return '';
  const m = /\n#{2,3} /g; m.lastIndex = i + 2; const z = m.exec(pp);
  return pp.slice(i + 1, z ? z.index : pp.length);
}

/**
 * 照合: ph = PHYSICS・pp = PAPER_PLAN・as = AI_SPEC・pm = post-merge・cl = CHANGELOG・Jg・Ji = 第355便g・第355便i の正本。
 * 戻り { bad: [...], cases: [...] }。
 */
export function checkPaper5(ph, pp, as, pm, cl, Jg, Ji) {
  const bad = [], cases = [];
  const sec = physSecOf(ph, HEAD), s11 = ppSecOf(pp);
  // ① 位置
  const i0 = ph.indexOf('\n' + HEAD), ii = ph.indexOf('\n〔第355便i — '), iu = ph.indexOf('\n〔第328便 — 統括'), it = ph.indexOf('\n〔第355便 — 統括');
  if (!(i0 >= 0 && ii >= 0 && ii < i0 && iu > i0)) bad.push('① PHYSICS〔第356便c〕の位置(〔第355便i〕より後・第328便の統括の節より前)');
  const p6 = pp.indexOf('\n## 6. 論文5'), p10 = pp.indexOf('\n### ⑩ 表 6c'), p11 = pp.indexOf('\n' + PP_HEAD), p7 = pp.indexOf('\n## 7. 順番の案');
  if (!(p6 >= 0 && p10 > p6 && p11 > p10 && p7 > p11)) bad.push('① PAPER_PLAN の ⑪ の位置(⑩〔表 6c〕の後・「## 7.」の前)');
  if (/第\d+報/.test(sec) || /第\d+報/.test(s11)) bad.push('① 本節か ⑪ に原仮定者の文の番号');
  cases.push('① 位置(〔第355便i〕より後・第328便の統括の節より前/⑩ の後・「## 7.」の前)・文の番号を書かない');
  // ② 原文: 本節に逐語・出どころの節に同じ字
  const tSec = physSecOf(ph, '〔第355便 — 統括');
  if (tSec.indexOf('「' + ORIGINAL[0][1] + '」') < 0) bad.push('② 原文(回答 2026-11-26)が第355便の統括の節に同じ字で無い');
  for (const [, o] of ORIGINAL.slice(1, 4)) if (pp.indexOf(o) < 0) bad.push('② 原文が PAPER_PLAN の字と違う: ' + o.slice(0, 16));
  if (ph.slice(0, i0 >= 0 ? i0 : ph.length).indexOf(ORIGINAL[4][1]) < 0) bad.push('② 原文(整理 2026-11-23)が前の節に同じ字で無い');
  for (const [, o] of ORIGINAL) if (sec.indexOf('「' + o + '」') < 0) bad.push('② 原文が本節に逐語で無い: ' + o.slice(0, 16));
  if (sec.indexOf(originalTable()) < 0) bad.push('② 表 1(原文と読み)が本節に逐語で無い');
  if (sec.indexOf(chainTable()) < 0) bad.push('② 訂正の鎖の表が本節に逐語で無い');
  if (s11.indexOf('「' + ORIGINAL[0][1] + '」') < 0 || s11.indexOf('「' + ORIGINAL[1][1] + '」') < 0) bad.push('② ⑪ に回答と入口の文が逐語で無い');
  cases.push(`② 原文 ${ORIGINAL.length}(出どころの節に同じ字)・表 1・訂正の鎖 ${CHAIN.length} 段`);
  // ③ 表(正本から)が本節と ⑪ に逐語
  if (!(Jg && Ji)) bad.push('③ 正本が読めない(第355便g・第355便i)');
  else {
    if (!(/^w355g-heat3d-\d+$/.test(Jg.version || '') && /^w355i-replaw-\d+$/.test(Ji.version || '') && Jg.ok === true && Ji.ok === true)) bad.push('③ 正本の版の名の型・ok(第355便g・第355便i)');
    const T = { main: mainTable(Jg, Ji), flow: flowTable(Jg, Ji), cmp: compareTable(Jg, Ji), ask: askTable(), app: appTable() };
    for (const [k, v] of Object.entries(T)) { if (sec.indexOf(v) < 0) bad.push('③ 表 ' + k + ' が本節に逐語で無い'); if (s11.indexOf(v) < 0) bad.push('③ 表 ' + k + ' が ⑪ に逐語で無い'); }
    const F = factsOf(Jg, Ji);
    for (const [k, v] of Object.entries(F)) if (sec.indexOf(v) < 0) bad.push('③ 数の文 ' + k + ' が本節に逐語で無い');
    if (s11.indexOf(F.main) < 0) bad.push('③ 数の文 main が ⑪ に逐語で無い');
    // 前の節の表と同じ数(第355便i の表 B・表 6c は当時の字のまま)
    if (pp.indexOf('| P2s1/cs4/p1n3 | 0.985 | 1.092 | 1.001 | 内 |') < 0) bad.push('③ 表 6c の当時の字(P2s1/cs4/p1n3 の行)が消えた');
    cases.push(`③ 表 ${Object.keys(T).length} 本(主の列・流れ・比べる列・伺う文の案と回答・アプリの便で要るもの)が本節と ⑪ に逐語・数の文 ${Object.keys(F).length} つ`);
  }
  // ④ 必須の語
  const want = ['R515', SRC_ANS, '並進の運動の寄与', '主の列', '比べる列', '斥力の則の族', '入口の思考実験', '文は変えない', '未', '〔第356便d〕', '熱を生まない', '切る距離 ÷ 箱の一辺', '粒 216', '粒 512', '窓 0.9〜1.1',
    'アナロジー', '現実の熱力学の記述ではない', '訂正の鎖', '当時の字', 'tests/out/heat3d-355g.json', 'tests/out/replaw-355i.json', 'tests/lib-w356c-paper5doc.mjs', 'docs.paper5ans356c', '書かないこと', '決断事項の候補', '推奨', '次点'];
  for (const w of want) if (sec.indexOf(w) < 0) bad.push('④ 本節に「' + w + '」が無い');
  for (const w of ['並進の運動の寄与', '主の列', '比べる列', '未', '入口の思考実験', '〔第356便c〕']) if (s11.indexOf(w) < 0) bad.push('④ ⑪ に「' + w + '」が無い');
  cases.push(`④ 必須の語 本節 ${want.length}・⑪ 6`);
  // ⑤ AI_SPEC §407・post-merge・CHANGELOG
  const a0 = as.indexOf('\n## 407. 第356便c'), a4 = as.indexOf('\n## 404. 第355便i'); let ai = '';
  if (a0 >= 0) { const z = as.indexOf('\n## ', a0 + 1); ai = as.slice(a0, z < 0 ? as.length : z); }
  if (!(a0 >= 0 && a4 >= 0 && a4 < a0 && ['R515', 'SYSTEM_PROMPT には載せない', '主の列', '比べる列', 'docs.paper5ans356c'].every((w) => ai.indexOf(w) >= 0))) bad.push('⑤ AI_SPEC §407(§404 の後・R515・SYSTEM_PROMPT・主の列・比べる列・鍵)');
  if (!(pm.indexOf('# ==== 第356便c の塊(ここから)====') > pm.indexOf('# ==== 第355便i の塊(ここまで)====') && pm.indexOf('# ==== 第355便i の塊(ここまで)====') >= 0 && /DEFAULT_WAVE_IDS="\$DEFAULT_WAVE_IDS docs\.paper5ans356c docs\.heat3d355g docs\.replaw355i"/.test(pm))) bad.push('⑤ post-merge に第356便c の塊(第355便i の塊の後)');
  const cb = cl.search(/^## v1\.48(?:-b\d+|\.0)[((]/m); let clz = '';
  if (cb >= 0) { const z = cl.indexOf('\n## ', cb + 1), seg = cl.slice(cb, z < 0 ? cl.length : z).split('\n'), k = seg.findIndex((l) => l.indexOf('**第356便c**') >= 0); clz = k >= 0 ? seg[k] : '';
    if (k >= 0 && !(k > 0 && clz.indexOf('R515') >= 0 && clz.indexOf('docs.paper5ans356c') >= 0)) bad.push('⑤ CHANGELOG の第356便c の行(見出しより後・R515・鍵)'); }
  cases.push('⑤ AI_SPEC §407・post-merge の塊・CHANGELOG(' + (clz ? '行あり' : '統合の前 —— 行なし') + ')');
  // ⑥ 書かない語・禁句
  const texts = [['PHYSICS〔第356便c〕', sec], ['PAPER_PLAN の ⑪', s11], ['AI_SPEC §407', ai]];
  if (clz) texts.push(['CHANGELOG の第356便c の行', clz]);
  for (const [nm, tx] of texts) {
    for (const w of NG_WORDS) if (tx.indexOf(w) >= 0) bad.push('⑥ ' + nm + ' に禁句(引用の中でも —— ' + w.length + ' 字)');
    const s = dropOrig(tx).replace(/「[^」]*」/g, '');
    for (const w of NOT_WORDS) if (s.indexOf(w) >= 0) bad.push('⑥ ' + nm + ' に書かない語 ' + w);
    if (/斥力が引きずりで説明/.test(dropOrig(tx))) bad.push('⑥ ' + nm + ' に書かない語 斥力が引きずりで説明');
  }
  cases.push(`⑥ 禁句 ${NG_WORDS.length}(引用の中でも)・書かない語 ${NOT_WORDS.length + 1}(引用の外)`);
  return { bad, cases };
}

/** lib の零試験(文書を持たない —— 表の組み立てと語の表) */
export function libGates(Jg, Ji) {
  const bad = [];
  if (ORIGINAL.length !== READINGS.length) bad.push('原文と読みの数');
  if (ASKS.filter((a) => a[4] === 'closed').length !== 1) bad.push('回答で閉じた問いは 1 つ(表 6c)');
  if (askTable().split('\n').length !== 2 + ASKS.length + 1) bad.push('伺う文の案の表の行の数');
  if (CHAIN.length !== 4 || CHAIN[2][1] !== SRC_ANS) bad.push('訂正の鎖の段');
  for (const w of NOT_WORDS.concat(NG_WORDS)) for (const t of [originalTable(), chainTable(), askTable(), appTable()]) if (dropOrig(t).replace(/「[^」]*」/g, '').indexOf(w) >= 0) bad.push('lib の字に書かない語 ' + w);
  if (Jg && Ji) {
    const n = numsOf(Jg, Ji);
    if (!n.fam.every((r) => Math.abs(r.ratioN[0] - r.c / Math.cbrt(n.N0)) < 1e-12 && Math.abs(r.ratioN[1] - r.c / 6) < 1e-12 && Math.abs(r.ratioN[2] - r.c / 8) < 1e-12)) bad.push('切る距離 ÷ 箱の一辺 = c ÷ 粒の数の 3 乗根(中の密度)');
    if (!(n.cols.K2.up > 0 && n.cols.A3.up > n.cols.K2.up && n.cols.B3.up === null && n.cols.B3.allIn)) bad.push('主の列の上端の倍の並び');
    for (const t of Object.values(factsOf(Jg, Ji)).concat([mainTable(Jg, Ji), flowTable(Jg, Ji), compareTable(Jg, Ji)])) {
      if (/NaN|undefined|Infinity/.test(t)) bad.push('表か数の文に読めない数');
      for (const w of NOT_WORDS) if (dropOrig(t).replace(/「[^」]*」/g, '').indexOf(w) >= 0) bad.push('表か数の文に書かない語 ' + w);
    }
  }
  return { n: 9, bad };
}
