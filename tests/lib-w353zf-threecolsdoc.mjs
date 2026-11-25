// 第353便zf(原仮定者の回答(2026-11-25 —— 第151報)「向きと幾何」・「銀河由来の背景軸引きずりの大きさ」・AN1034・AN1039・AN1045・AN1046・AN1058・統括の検証項目 R496):
// **正本 tests/out/threecols-353zf.json から PHYSICS〔第353便zf〕の表と数の文を作る文書の lib**
// (QA docs.threecols353zf が節の表と逐語で照合する —— 表の数は有効数字 3〜5 桁)。原文(言葉を変えずに引く)もここに持つ。
// ファイルを読まない・import しない。
export const DOC_VERSION = 'w353zf-threecolsdoc-1';
const fe = (x, k = 2) => (x === null || x === undefined || !Number.isFinite(x) ? '—' : x === 0 ? '0' : Number(x).toExponential(k));
const f3 = (x) => (x === null || x === undefined || !Number.isFinite(x) ? '—' : (Math.abs(x) >= 1e-2 && Math.abs(x) < 1e3 ? Number(x.toPrecision(3)).toString() : fe(x)));
const f5 = (x) => (x === null || x === undefined || !Number.isFinite(x) ? '—' : Number(x.toPrecision(5)).toString());
const esc = (s) => String(s).replace(/\|/g, '/');
const BAND = Object.freeze({ in: '入る', over: '越える', under: '届かない' });
const COLN = Object.freeze({ A: '(ア)', I: '(イ)', U: '(ウ)' });

/** 原文(言葉を変えずに引く) */
export const ORIGINAL = Object.freeze([
  Object.freeze(['原仮定者の回答(2026-11-25 —— 第151報)', '向きと幾何: これを採用『主の成分を太陽の自転の分・背景を太陽系の基準軸の向きに置くと、太陽の 5〜6° の傾きは円錐になり、金星で 1% まで打ち消します。』']),
  Object.freeze(['原仮定者の回答(2026-11-25 —— 第151報)', '銀河由来の背景軸引きずりの大きさ: これに注目 『銀河の公転の角速度』の『0.98 倍(銀河の回転と逆向き)』。向きと大きさは別々に合わせて良い']),
  Object.freeze(['原仮定者の回答(2026-11-25 —— 第151報)', 'AN1039: 角運動量の重み。計算が合う方式を採用する']),
  Object.freeze(['原仮定者の回答(2026-11-25 —— 第151報)', 'AN1046: C']),
  Object.freeze(['原仮定者の回答(2026-11-25 —— 第151報)', 'AN1058: 置かない']),
]);
export const READINGS = Object.freeze([
  '主の列は局所 = 源の自転の分 (S)・背景 = (N+) 太陽系の基準軸の向き。金星では局所と背景がほぼ逆向き —— 大きさが同じなら合成は背景の 1.3% まで小さくなる(向きの一致は 3 列で同じ)',
  '背景の向きは (N+) のまま、大きさに 0.98 を置く列を (ア)(イ)。大きさを金星の条件に置く列を (ウ)(比べる列として残す)',
  '「計算が合う方式」を、同じ列で物差しの 0.1〜10 倍に入る題の数で並べる(判定はしない —— 数の表)',
  'AN1046 の C = 「見ている時間の間は変わらない」。地球の傾きの変化を 1 万年・100 万年・45 億年の窓で並べる',
  'AN1058 = 背景の大きさを 1 つの値には置かない(窓のまま)。本節の 0.98 と金星の条件の大きさは列の名で、背景の大きさを置いたのではない',
]);
/** 過去の恒久の条件(表 11 の行 —— 言葉を変えずに引く) */
export const PAST = Object.freeze([
  Object.freeze(['原仮定者の指示(2026-11-05)', 'R_dはK1で固定し、観測の自転もトルクの釣り合いで進める']),
  Object.freeze(['原仮定者の補足(2026-11-14 —— 第138報の補足 2)', '金星は、太陽と銀河が釣り合っていて、さらに地球が影響を与えている']),
]);
export function originalTable() {
  return '| # | 出どころ | 原文(言葉を変えずに引く) | 読み(統括の読み —— 原文と分ける) |\n|---|---|---|---|\n'
    + ORIGINAL.map(([src, o], k) => `| ${k + 1} | ${src} | 「${o}」 | ${esc(READINGS[k])} |`).join('\n');
}
/** 表 3 の文(原文と読みを分ける —— 沿う・沿わない・読みに依る。判定ではなく文との並び) */
export const STATEMENTS = Object.freeze([
  Object.freeze({ text: 'これに注目 『銀河の公転の角速度』の『0.98 倍(銀河の回転と逆向き)』', reading: '背景の大きさに 0.98 を置く(向きは (N+))', A: '沿う', I: '沿う', U: '沿わない', why: '(ウ) の背景は 0.98 の 1.2e-12 倍' }),
  Object.freeze({ text: '金星で 1% まで打ち消します', reading: '金星で局所と背景が同じ大きさ・逆向きになり、合成が背景の 1% の桁に落ちる', A: '読みに依る', I: '沿う', U: '沿う', why: '(ア) は向きは一致(順位 1)・大きさは 1e-12 で合成 ÷ 背景 1.000 —— 文を「向きの一致」に読めば沿う・「残り」に読めば沿わない' }),
  Object.freeze({ text: '向きと大きさは別々に合わせて良い', reading: '向きは (N+)・大きさは別のノブで置く', A: '沿う', I: '沿う', U: '読みに依る', why: '(ウ) は大きさを金星の条件(向きの側の量)から置く —— 大きさだけを別の量で置く読みなら沿う' }),
  Object.freeze({ src: '原仮定者の回答(2026-11-25 —— 第151報)AN1046 の C(選んだ選択肢の文)', text: '見ている時間の間は変わらない', reading: 'AN1046 C —— 地球の傾きの変化が 1 万年の窓で 0.1° の内', A: '沿う', I: '沿う', U: '沿う', why: '1 万年で (ア) 4.2e-4°・(イ) 8.0e-4°・(ウ) 数の床(1e-13°)の下' }),
  Object.freeze({ src: '原仮定者の指示(2026-11-05)', text: 'R_dはK1で固定し、観測の自転もトルクの釣り合いで進める', reading: '引きずり半径は規則(K1)で固定し、合わせる余地は別の係数の側に置く', A: '沿う', I: '読みに依る', U: '沿う', why: '(イ) の主の呼び名(換算の係数 8.22e11 を局所の項に置く・規則の半径はそのまま)では沿う —— 規則の係数そのものを 9.374e3 倍にする読みは、引きずり半径を規則で固定する指示と衝突するので主にしない(言い換えとして表 6〜9 に置くだけ)' }),
  Object.freeze({ src: '原仮定者の補足(2026-11-14 —— 第138報の補足 2)', text: '金星は、太陽と銀河が釣り合っていて、さらに地球が影響を与えている', reading: '恒久の条件「太陽の軸引きずりと背景軸引きずりは金星で釣り合う」—— 軸引きずりの式を見直すたびに、この比を出せること', A: '読みに依る', I: '沿う', U: '沿う', why: '(ア) は向きだけ(向きの一致は金星が 1 番・大きさは局所 ÷ 背景 1.2e-12)・(イ)(ウ) は大きさで(等大の残り 0.0133)' }),
  Object.freeze({ text: '計算が合う方式を採用する', reading: '同じ列で物差しの 0.1〜10 倍に入る題の数', A: '読みに依る', I: '読みに依る', U: '読みに依る', why: '入る題の数 (ア) 0・(イ) 6・(ウ) 3(11 題中)—— 数の多さを「合う」と読むかは原仮定者の読み' }),
]);

function cellOf(r, c) {
  if (r.id === 'venusRank') return `${c.v} 番(${f3(c.res)})`;
  if (/^sense/.test(r.id)) return c.v === 1 ? '同じ(仮)' : '違う(仮)';
  if (r.id === 'fMax' && c.noLimit) return '上限なし';
  if (c.v === 0) return '0(数の床)';
  const s = f3(c.v);
  return r.ruler !== null && c.band ? `${s}(${BAND[c.band]})` : s;
}
export function tablesOf(J) {
  const T = {}, t1 = J.t1, t2 = J.t2;
  { const S = J.pure.scenes, G = J.pure.gates;
    T.pure = '| 零試験・場面 | 値 | 門 |\n|---|---|---|\n' + [
      ['① 便の始めの数え直し 6 の数(λ 9.37434e3・λ³ との比 0.99731・残り 0.013259・0.013274・半径 太陽 1.6419e8・金星 401.9・地球 493.1・木星 1.567e5 m・局所 ÷ 背景)', `${fe(S.a6.lam, 5)}・${f5(S.a6.cubeAt937)}・${f5(S.a6.resid)}`, G.anchor6],
      ['② 換算の係数 8.2158e11 の 3 乗根(λ の作りの λ とは 0.09% 違う —— 金星の頭打ちの分)', fe(S.cbrt, 4), G.cbrtK],
      ['③ λ 1 の局所の和が〔第353便q〕の `localUnit`(規則の半径)と同じ(金星・水星・イオ・月)', Object.values(S.lu).every((x) => x === 0) ? '0' : '< 1e-9', G.localUnit353q],
      ['④〔第353便q〕の表 4 の規則の半径の組(環 (F1) 0.204・(F2) 0.154・公転面 6.21・イオ 0.894・月 0.377・水星 6.53・入る題 6)', `${f3(S.qt.ringAx)}・${f3(S.qt.plane)}・${S.qCount}`, G.table353q],
      ['⑤〔第353便j〕の副作用の表(水星 6.53・地球 0.377・火星 0.107)', `${f3(S.js.Mercury)}・${f3(S.js.Earth)}・${f3(S.js.Mars)}`, G.side353j],
      ['⑥ 環の輪の場の作り直し(λ 1)が〔第353便k〕の `axStd` と同じ', fe(S.ring1.mine, 4), G.ringStd353k],
      ['⑦ 公転面の輪の場の作り直し(λ 1)が〔第353便k〕の `planeStd` と同じ', fe(S.plane1.mine, 4), G.planeStd353k],
      ['⑧ (ウ) の換算の係数(金星の条件の背景で金星が等大)= 1', f5(S.kU), G.colU],
      ['⑨ 入力の拒否(k ≤ 0・NaN・列の名・題の名・λ < 1・観測の半径を越える λ)', `${S.rejects.filter(Boolean).length}/${S.rejects.length}`, G.rejects],
    ].map(([x, b, g]) => `| ${x} | ${b} | ${g ? '真' : '偽'} |`).join('\n'); }
  T.cols = '| 列 | 規則の係数の倍 λ | 背景の倍率 u(÷ ω_G) | 金星の局所の倍 | 第353便q の換算の係数(同じ u) |\n|---|---|---|---|---|\n'
    + t1.cols.map((c) => `| ${COLN[c.id]} | ${f5(c.lam)} | ${fe(c.u, 5)} | ${fe(c.gainVenus, 4)} | ${fe(c.kQ, 4)} |`).join('\n');
  T.main = '| # | 題 | 物差し(文献の値・未照合) | (ア) λ 1・u 0.98 | (イ) 換算の係数 8.22e11・u 0.98 | (ウ) λ 1・u 1.19e-12 |\n|---|---|---|---|---|---|\n'
    + t1.rows.map((r) => `| ${r.g} | ${esc(r.label)} | ${r.ruler === null ? '—' : esc(r.ruler)} | ` + r.cells.map((c) => cellOf(r, c)).join(' | ') + ' |').join('\n');
  T.count = '| 列 | 0.1〜10 倍に入る | 越える | 届かない | 物差しの無い題 | 入る題 |\n|---|---|---|---|---|---|\n'
    + t1.count.map((c) => `| ${COLN[c.col]} | ${c.inBand} | ${c.over} | ${c.under} | ${c.noRuler} | ${c.inIds.join('・') || 'なし'} |`).join('\n');
  T.recv = '| 受け手 | λ の作りの局所の倍 ÷ λ³ | λ の作り ÷ 換算の係数の作り |\n|---|---|---|\n' + t2.recv.map((r) => `| ${r.id} | ${f5(r.gainOverLam3)} | ${f5(r.lamOverK)} |`).join('\n');
  T.topics = '| 題 | 換算の係数の作りの値 | λ の作りの値 | 比 | λ の作りの数え方 |\n|---|---|---|---|---|\n' + t2.topics.map((r) => `| ${r.topic} | ${f3(r.vK)} | ${f3(r.vLam)} | ${f5(r.lamOverK)} | ${esc(r.how)} |`).join('\n');
  T.cap = '| 受け手 | 自分の重み ÷ 源の重み(λ 1) | 同(λ 9.374e3) | 頭打ちに掛かる λ の目安(比 1) |\n|---|---|---|---|\n' + t2.cap.map((r) => `| ${r.id} | ${fe(r.selfOverSrc1)} | ${fe(r.selfOverSrcLam)} | ${fe(r.lamCap)} |`).join('\n');
  T.differ = '| 動く所 | 換算の係数の作り | λ の作り | 比 | 理由 |\n|---|---|---|---|---|\n' + t2.differ.map((r) => `| ${esc(r.label)} | ${f3(r.vK)} | ${f3(r.vLam)} | ${fe(r.lamOverK)} | ${esc(r.how)} |`).join('\n');
  T.summary = '| 違い | 比べる 2 列 | 変わる量 | 変わらない量 |\n|---|---|---|---|\n'
    + `| 局所の項が効くか | (ア) と (イ) | 局所 ÷ 背景(イオ ${fe(t1.rows.find((r) => r.id === 'io').cells[0].v)} の桁 → 1)・入る題 ${t1.count[0].inBand} → ${t1.count[1].inBand} | 背景の時間の尺度(太陽の歳差の 1 周 ${fe(t1.rows.find((r) => r.id === 'periodSun').cells[0].v)} 年)・向きの一致の順位 |\n`
    + `| 時間の尺度 | (イ) と (ウ) | 歳差の 1 周(太陽 ${fe(t1.rows.find((r) => r.id === 'periodSun').cells[1].v)} → ${fe(t1.rows.find((r) => r.id === 'periodSun').cells[2].v)} 年)・率の題(環・公転面・傾き・内部熱・潮汐ロック・歳差の残り) | 比の題(金星の残り・イオの x・局所 ÷ 背景・一周の揺れの幅 ${f3(t1.rows.find((r) => r.id === 'watchTurn').cells[1].v)}°) |`;
  T.statements = '| 出どころ | 原文(言葉を変えずに引く) | 読み(原文と分ける) | (ア) | (イ) | (ウ) | 数 |\n|---|---|---|---|---|---|---|\n'
    + STATEMENTS.map((s) => `| ${s.src || '原仮定者の回答(2026-11-25 —— 第151報)'} | 「${s.text}」 | ${esc(s.reading)} | ${s.A} | ${s.I} | ${s.U} | ${esc(s.why)} |`).join('\n');
  return T;
}
export function factsOf(J) {
  const t1 = J.t1, t2 = J.t2, row = (id) => t1.rows.find((r) => r.id === id);
  return {
    lam: `0.98 で金星が等大になる規則の係数の倍は λ ${f5(t2.lam)}(換算の係数 ${fe(t2.kQ, 4)} の 3 乗根 ${f5(t2.cbrtK)} とは ${f3((t2.lam / t2.cbrtK - 1) * 100)}% 違う —— λ³ ÷ k = ${f5(t2.lam3OverK)})。`,
    count: `物差しの 0.1〜10 倍に入る題は 11 題中 (ア) ${t1.count[0].inBand}・(イ) ${t1.count[1].inBand}・(ウ) ${t1.count[2].inBand}。越える題は (イ) の ${t1.count[1].over}(地球の傾き)。`,
    venus: `金星の合成 ÷ 背景は (ア) ${f5(row('venusResid').cells[0].v)}・(イ) ${f5(row('venusResid').cells[1].v)}・(ウ) ${f5(row('venusResid').cells[2].v)}。向きの一致の順位は 3 列とも金星が 1 番。`,
    time: `地球の傾きの変化(公転の極を固定): 1 万年 (ア) ${fe(row('watch10000').cells[0].v)}°・(イ) ${fe(row('watch10000').cells[1].v)}°・(ウ) ${row('watch10000').cells[2].v === 0 ? '0(数の床)' : fe(row('watch10000').cells[2].v)}°/45 億年 (ア) ${f3(row('watch4500000000').cells[0].v)}°・(イ) ${f3(row('watch4500000000').cells[1].v)}°・(ウ) ${fe(row('watch4500000000').cells[2].v)}°。`,
    lamk: `(イ) を規則の係数の倍で書いても、局所の倍は受け手ごとに換算の係数の作りから ${f5(Math.min(...t2.recv.map((r) => r.lamOverK)))}〜${f5(Math.max(...t2.recv.map((r) => r.lamOverK)))} 倍の内。頭打ちに一番近い受け手は ${t2.capMin.id}(自分の重み ÷ 源の重み ${fe(t2.capMin.selfOverSrcLam)})。値が桁で動くのは、回答の基準の受け手(粒子の観測半径 × 構造の係数)の輪の場(比 ${fe(t2.differ[0].lamOverK)})と、慣性モーメントを規則の半径 × λ に読む潮汐ロック(比 ${fe(t2.differ[1].lamOverK)})。`,
  };
}
