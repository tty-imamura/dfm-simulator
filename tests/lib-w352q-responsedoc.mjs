// 第352便q(原仮定者の整理(2026-11-24 —— 第148報)・原仮定者の回答(2026-11-24 —— 第147報)・統括の検証項目 R454):
// **正本 tests/out/response-352q.json から PHYSICS〔第352便q〕の表と数の文を作る文書の lib**
// (QA docs.response352q が節の表と逐語で照合する —— 表の数は有効数字 3 桁)。原文(言葉を変えずに引く)もここに持つ。
// ファイルを読まない・import しない。
export const DOC_VERSION = 'w352q-responsedoc-1';
const fin = (x) => typeof x === 'number' && Number.isFinite(x);
const fe = (x) => (!fin(x) ? '—' : x === 0 ? '0' : Number(x).toExponential(2));
const f3 = (x) => (!fin(x) ? '—' : Math.abs(x) >= 1e4 || Math.abs(x) < 1e-2 ? Number(x).toExponential(2) : Number(x).toPrecision(3));
const PJ = Object.freeze({ Mercury: '水星', Venus: '金星', Earth: '地球', Mars: '火星', Moon: '月', Sun: '太陽' });
const BN = Object.freeze({ Np: '(N+)', Gm: '(G−)' }), TN = Object.freeze({ 0: '規則', 1: '観測' }), UN = Object.freeze({ u1: '倍率 1', uV: '(uV)' });
const QN = Object.freeze({ omega: 'ω', n: 'n', R: 'R', rho: 'ρ', moi: 'C′', J2: 'J2' });
const colN = (c) => `${BN[c.bg]} ${c.axis}・${TN[c.tSrc]}・${UN[c.uCol]}`;
const powN = (p) => p.qs.map((q, j) => QN[q] + '^' + p.pows[j]).join(' ');
const ck = (c) => [c.bg, c.axis, c.tSrc, c.uCol].join('|');

/** 原文(言葉を変えずに引く) */
export const ORIGINAL = Object.freeze([
  Object.freeze(['原仮定者の整理(2026-11-24 —— 第148報)', '自転速度や、歳差運動の傾きは、天体の構造に左右されるので、先に銀河由来の背景軸引きずりを算出する']),
  Object.freeze(['原仮定者の回答(2026-11-24 —— 第147報)', 'AN1000: C2で進める。係数はノブにする']),
  Object.freeze(['原仮定者の回答(2026-11-24 —— 第147報)', 'つまり、両方の経路が有り、比率は天体の構造などに起因するので、ノブにする']),
  Object.freeze(['原仮定者の回答(2026-11-18 —— 第141報 AN790)', '天体の特性を表す係数のノブにする']),
  Object.freeze(['原仮定者の回答(2026-11-24 —— 第148報)', 'AN1026: Aで進める。未照合でも確度の高い数値で仮計算し、後追いで照合する']),
]);
export const READINGS = Object.freeze([
  '背景を先に 1 つ(全部の天体に同じ)置くと、歳差の率の天体ごとの違いは天体の応答の係数が受け持つ —— 本節はその「要る応答の係数」を天体ごとに出し、構造の量の列と並べる(並びの診断・係数の値は決めない)',
  '換算の係数 k は局所の項にだけ掛かる(既定 1 —— 本節も 1)。本節の応答の係数は、背景を含む合成の全体に掛かる受け手の側の係数(k とは別の場所 —— 統括の読みで寄せない)',
  '経路の比率 f(第351便d)は傾きの率を受け持つノブ。本節の表 3 は「歳差の率は応答の係数 × 背景・傾きの率は f」の 2 つのノブが天体ごとの観測量 2 つで閉じるかを数える',
  '天体ごとの係数の考え方。本節の要る応答の係数は、その係数が受け持つ天体どうしの違いの大きさ(構造の量のどれで書けるかは決めない)',
  '仮の値(第352便b の台帳)で仮に数える —— 本節の要る係数・比・太陽の列は全部「仮・未照合」の印つき(合否にしない)',
]);
const esc = (s) => String(s).replace(/\|/g, '/');
export function originalTable() {
  return '| # | 出どころ | 原文(言葉を変えずに引く) | 読み(統括の読み —— 原文と分ける) |\n|---|---|---|---|\n'
    + ORIGINAL.map(([src, o], k) => `| ${k + 1} | ${src} | 「${o}」 | ${esc(READINGS[k])} |`).join('\n');
}

export function tablesOf(J) {
  const T = {};
  { const S = J.pure.scenes, G = J.pure.gates, jr = S.jr;
    T.pure = '| 零試験・場面 | 値 | 門 |\n|---|---|---|\n' + [
      ['① 規則の半径の (S) + 背景は〔第352便j〕の `cellOf` と同じ Ω(8 惑星 + 月 × 背景の向き 2 × 基準軸 2 × 倍率 2 —— 相対の差)', S.vsJ === 0 ? '0' : '< 1e-12', G.sameAsJ],
      ['② 〔第352便j〕の要る倍の比((N+) L 倍率 1: 火星・金星・散らばり/(uV): 金星 (N+)・(G−))', `${jr.Np1.m.toFixed(4)}・${jr.Np1.v.toFixed(4)}・${jr.Np1.spread.toFixed(3)}/${jr.NpV.v.toFixed(2)}・${jr.GmV.v.toFixed(4)}`, G.anchorJ],
      ['③ 共通の背景の大きさを変えても比は変わらない(規則の半径・倍率 1・10・1000 —— 相対の差)', '< 1e-9', G.bgInvariant],
      ['④ 金星で大きさが同じになる倍率(規則の半径 =〔第352便d〕の `uVenus`・観測の半径)', `${S.uVr.toExponential(5)}・${S.uVo.toExponential(3)}`, G.uV],
      ['⑤ (ア) (S1) は同じ式で 1・(S2) の 1 からの外れは x² ÷ 2(x = abs(Ω⊥) ÷ ω —— 差で作らず直接に)', '(S1) 1・(S2) x² ÷ 2 と同じ', G.s1s2],
      ['⑥ 構造の量は公開の lib の数(質量・半径・慣性モーメントの係数・J2・c_R)と同じ・無い量は null(月と太陽の J2)', S.structOk ? '同じ' : '違う', G.structs],
      ['⑦ (エ) の入り方: (i) は規則の半径(a = Rd)で 1・(ii)(i) は正の有限の倍', `${S.iOne === 1 ? '1' : fe(S.iOne)}・${fe(S.eE.ii)}・${fe(S.eE.i)}`, G.entries],
      ['⑧ 走査の自己試験(作った要る係数 = 3 ω^-1 n^2 で、その組の散らばりが 1)', powN(S.scanTop), G.scan],
      ['⑨ 仮の値の行は印つき・判定の側へ渡すと例外・リポジトリだけの行(水星)は印なし', S.markOk ? '真' : '偽', G.provMark],
      ['⑩ 入力の拒否(背景の向き・基準軸・源の半径・負の倍率・比べる数の無い天体・背景の大きさの列)', `${S.rejects.filter(Boolean).length}/${S.rejects.length}`, G.rejects],
    ].map(([x, b, g]) => `| ${x} | ${b} | ${g ? '真' : '偽'} |`).join('\n'); }
  { const cE = J.cand.find((r) => r.bg === 'Np' && r.axis === 'L' && r.tSrc === 0 && r.uCol === 'u1' && r.cand === 'eii'), cI = J.cand.find((r) => r.bg === 'Np' && r.axis === 'L' && r.tSrc === 0 && r.uCol === 'u1' && r.cand === 'ei');
    const ids = ['Earth', 'Mars', 'Venus', 'Mercury', 'Moon'];
    T.struct = '| 天体 | ω [rad/s] | n [rad/s] | R [m] | ρ [kg/m³] | C′(慣性モーメントの係数) | J2 | c_R(規則の半径 ÷ 観測半径) | (エ) (ii) の倍 | (エ) (i) の倍 |\n|---|---|---|---|---|---|---|---|---|---|\n'
      + J.structs.map((s) => { const k = ids.indexOf(s.id); return `| ${PJ[s.id]} | ${fe(s.omega)} | ${fe(s.n)} | ${fe(s.R)} | ${f3(s.rho)} | ${f3(s.moi)} | ${fe(s.J2)} | ${fe(s.cR)} | ${k >= 0 ? fe(cE.x[k]) : '—'} | ${k >= 0 ? fe(cI.x[k]) : '—'} |`; }).join('\n'); }
  { const cols = J.need.filter((r) => r.id === 'Earth' && r.axis === 'L'), ids = ['Earth', 'Mars', 'Venus', 'Mercury', 'Moon'];
    const rows = cols.map((c) => { const by = (id) => J.need.find((r) => r.id === id && ck(r) === ck(c));
      return `| ${colN(c)} | ${fe(c.need)} | ` + ids.slice(1).map((id) => { const r = by(id); return r.rel === null ? '—' : f3(r.rel) + (r.cancel ? '(打)' : ''); }).join(' | ') + ` | ${f3(by('Mars').relPole)} |`; });
    T.need = '| 列(背景の向き 基準軸・源の半径・背景の大きさ) | 地球の要る係数 C(仮) | 火星 ÷ 地球(仮) | 金星 ÷ 地球(仮) | 水星 ÷ 地球(水星はリポジトリ・役割「桁」) | 月 ÷ 地球(月はリポジトリ・交点の率) | 火星 ÷ 地球(極の方位の率で測る・仮) |\n|---|---|---|---|---|---|---|\n' + rows.join('\n'); }
  { const pick = [['Np', 'L', 0, 'u1'], ['Np', 'L', 0, 'uV'], ['Gm', 'L', 0, 'uV'], ['Np', 'L', 1, 'uV']], CN = J.decl.candLabels, rows = [];
    for (const [bg, axis, tSrc, uCol] of pick) for (const k of J.decl.cands) {
      const r = J.cand.find((x) => x.bg === bg && x.axis === axis && x.tSrc === tSrc && x.uCol === uCol && x.cand === k);
      rows.push(`| ${colN(r)} | ${CN[k]} | ${f3(r.xRel[1])}・${f3(r.xRel[2])} | ${r.ratio.slice(1).map(f3).join('・')} | ${f3(r.spread3)} | ${f3(r.spread4)} | ${f3(r.spread5)} |`);
    }
    T.cand = '| 列 | 式の候補 | X ÷ X_地球(火星・金星) | C ÷ X を地球 1 で(火星・金星・水星・月) | そろう度合い 3 天体(仮) | 4 天体(+ 水星) | 5 天体(+ 月) |\n|---|---|---|---|---|---|---|\n' + rows.join('\n'); }
  T.scan = '| 列 | 天体 | 組の数 | 散らばり ≤ 1.05 | ≤ 1.2 | ≤ 2 | 量 1 つの最良 | 量 2 つの最良 | 量 3 つの最良 |\n|---|---|---|---|---|---|---|---|---|\n'
    + J.scan.map((s) => { const b = s.bestBySize, bn = (k) => (b[k] ? `${powN(b[k])}(${f3(b[k].spread)})` : '—');
      return `| ${colN(s)} | ${s.ids.map((id) => PJ[id]).join('・')} | ${s.counts.total} | ${s.counts['le1.05']} | ${s.counts['le1.2']} | ${s.counts.le2} | ${bn(1)} | ${bn(2)} | ${bn(3)} |`; }).join('\n');
  { const s = J.scan.find((x) => x.bg === 'Np' && x.axis === 'L' && x.tSrc === 0 && x.uCol === 'u1' && x.nBodies === 3);
    T.scanTop = '| 順 | 量とべき(倍率 1・地球・火星・金星 —— 仮) | 散らばり(最大 ÷ 最小) |\n|---|---|---|\n' + s.top.map((r, k) => `| ${k + 1} | ${powN(r)} | ${r.spread.toFixed(4)} |`).join('\n'); }
  T.rank = '| 列 | 天体 | f の置き方 | 背景の倍率 | 観測量 | ノブ | 階数(1e-3・1e-6) | 決まらない数 | 特異値 ÷ 最大(最小の 2 つ) |\n|---|---|---|---|---|---|---|---|---|\n'
    + J.rank.map((r) => `| ${colN(r.col)} | ${r.bodies.map((id) => PJ[id]).join('・')} | ${r.fMode === 'shared' ? '共通' : '天体ごと'} | ${r.fixU ? '宣言(ノブにしない)' : 'ノブ'} | ${r.nObs} | ${r.nKnobs} | ${r.rank.join('・')} | ${r.undetermined.join('・')} | ${r.svRel.slice(-2).map(fe).join('・')} |`).join('\n');
  { const t = J.tilt, nE = J.need.find((r) => r.id === 'Earth' && r.bg === 'Np' && r.axis === 'L' && r.tSrc === 0 && r.uCol === 'u1'), nM = J.need.find((r) => r.id === 'Mars' && r.bg === 'Np' && r.axis === 'L' && r.tSrc === 0 && r.uCol === 'u1');
    T.tilt = '| 天体・傾きの率の定義(仮) | 傾き [°] | r = 傾きの率 ÷ (sin θ × 歳差の率) | f = r ÷ (1 + r) | 要る応答の係数 C(倍率 1・(N+) L・規則) |\n|---|---|---|---|---|\n' + [
      ['地球・固定の黄道に対する傾きの率', t.earthTiltDeg, t.earthOmegaA, nE.need], ['地球・その日の黄道に対する傾きの率', t.earthTiltDeg, t.earthEpsA, nE.need], ['火星・公転面に対する傾きの率', t.marsTiltDeg, t.mars, nM.need],
    ].map(([n, th, R, c]) => `| ${n} | ${th.toFixed(3)} | ${fe(R.r)} | ${fe(R.f)} | ${fe(c)} |`).join('\n'); }
  T.sun = '| 列 | 式の候補・べきの組 | X_太陽 ÷ X_地球 | 太陽の応答の係数 C_太陽(仮) | 太陽の率(仮)″/年 | 太陽の周期(仮)[年] | 背景だけの周期(〔第352便e〕)[年] |\n|---|---|---|---|---|---|---|\n'
    + J.sun.filter((r) => r.cand !== 'a2').map((r) => `| ${colN(r)} | ${r.cand === 'scan' ? 'べきの組 ' + powN(r.pick) : esc(r.label)} | ${fe(r.xRatio)} | ${fe(r.cSun)} | ${fe(r.rateAsYr)} | ${fe(r.periodYr)} | ${fe(r.bgPeriodYr)} |`).join('\n');
  return T;
}
const rng = (xs, f) => { const v = xs.filter(fin); if (!v.length) return '—'; const a = Math.min(...v), b = Math.max(...v); return f(a) === f(b) ? f(a) : f(a) + '〜' + f(b); };
export function factsOf(J) {
  const F = {}, C = (bg, tSrc, uCol, k) => J.cand.find((r) => r.bg === bg && r.axis === 'L' && r.tSrc === tSrc && r.uCol === uCol && r.cand === k);
  { const u1 = J.need.filter((r) => r.uCol === 'u1' && r.id === 'Mars'), v1 = J.need.filter((r) => r.uCol === 'u1' && r.id === 'Venus');
    const vN = J.need.find((r) => r.id === 'Venus' && r.bg === 'Np' && r.axis === 'L' && r.tSrc === 0 && r.uCol === 'uV'), vG = J.need.find((r) => r.id === 'Venus' && r.bg === 'Gm' && r.axis === 'L' && r.tSrc === 0 && r.uCol === 'uV');
    F.need = `背景が主の大きさ(倍率 1)では、要る応答の係数の比は比べる数の比そのもので、背景の向き・基準軸・源の半径に依らない(火星 ÷ 地球 ${rng(u1.map((r) => r.rel), (x) => x.toFixed(3))}・金星 ÷ 地球 ${rng(v1.map((r) => r.rel), (x) => x.toFixed(3))})。`
      + `(uV) では局所の (S) が背景と同じ桁になり、(N+) の金星は合成が背景の ${f3(vN.overBg)} 倍まで打ち消されて、要る係数が地球の ${f3(vN.rel)} 倍になる(「背景の軸引きずりでは金星の歳差は出ない候補」の行 —— 印「打」)。(G−) では ${f3(vG.rel)} 倍。`; }
  { const c = (k) => C('Np', 0, 'u1', k);
    F.cand = `倍率 1 で、天体 3 つ(地球・火星・金星 —— 仮)の比 C ÷ X のそろう度合い(最大 ÷ 最小)は、(ア) ${f3(c('a1').spread3)}(構造を入れない列と同じ —— ω_T ÷ ω_L は (S1) で 1・(S2) で 1 からの外れが 1e-20 の桁より小さい)・`
      + `(イ) ${f3(c('i').spread3)}・(ウ) ${f3(c('u').spread3)}・(ウ′) ${f3(c('uJ').spread3)}・(エ) (ii) ${f3(c('eii').spread3)}・(i) ${f3(c('ei').spread3)}。どの候補も 3 天体で比がそろわない(最も小さい (ウ′) でも ${f3(c('uJ').spread3)} —— 火星 ${f3(c('uJ').ratio[1])}・金星 ${f3(c('uJ').ratio[2])} に対し地球が 1)。`
      + `水星(リポジトリの役割「桁」の数)を足すと、どの候補も ${rng(J.decl.cands.map((k) => c(k).spread4), f3)}。`; }
  { const s3 = J.scan.find((x) => x.bg === 'Np' && x.tSrc === 0 && x.uCol === 'u1' && x.nBodies === 3), s4 = J.scan.find((x) => x.bg === 'Np' && x.tSrc === 0 && x.uCol === 'u1' && x.nBodies === 4);
    F.scan = `べきの組の走査(量 ${s3.usable.length} つ —— ${s3.usable.map((q) => QN[q]).join('・')} —— の 1〜3 つ × 整数と半整数のべき 8 = ${s3.counts.total} 組)では、倍率 1 の天体 3 つで散らばり 1.2 以下の組が ${s3.counts['le1.2']}(1.05 以下 ${s3.counts['le1.05']})在る`
      + `(最良: 量 1 つ ${powN(s3.bestBySize[1])} ${f3(s3.bestBySize[1].spread)}・2 つ ${powN(s3.bestBySize[2])} ${f3(s3.bestBySize[2].spread)}・3 つ ${powN(s3.bestBySize[3])} ${f3(s3.bestBySize[3].spread)})—— 天体 3 つは自由度 2 なので、量 2〜3 つの組は 1 つに絞れない。`
      + `水星を足した天体 4 つでは 1.2 以下の組は ${s4.counts['le1.2']}(最良 ${powN(s4.top[0])} ${f3(s4.top[0].spread)})。`; }
  { const g = (bodies, fMode, fixU, uCol) => J.rank.find((r) => r.col.bg === 'Np' && r.col.tSrc === 0 && r.col.uCol === uCol && r.bodies.join() === bodies && r.fMode === fMode && r.fixU === fixU);
    const a = g('Earth,Mars', 'shared', false, 'u1'), b = g('Earth,Mars', 'shared', false, 'uV'), c = g('Earth,Mars', 'each', true, 'u1'), d = g('Earth,Mars,Venus', 'each', true, 'u1');
    F.rank = `背景を共通に置き、背景の倍率もノブにすると、倍率 1(背景が主)では倍率と応答の係数が同じ向きにしか効かず、地球・火星・f 共通で観測量 ${a.nObs}・ノブ ${a.nKnobs}・階数 ${a.rank[0]}(決まらない数 ${a.undetermined[0]})。`
      + `(uV) では局所の分で分かれるが、最小の特異値は最大の ${fe(b.svRel[b.svRel.length - 1])} 倍。背景の倍率を宣言(ノブにしない)にすると、f を天体ごとに置いても地球・火星は観測量 ${c.nObs}・ノブ ${c.nKnobs}・階数 ${c.rank[0]}(ちょうど閉じる —— 余りの観測量が無い)、`
      + `金星を足すと傾きの率の比べる数が無いので決まらない数 ${d.undetermined[0]}。`; }
  { const t = J.tilt;
    F.tilt = `経路の比率の感度(〔第352便b〕—— 仮・未照合): f は地球で ${fe(t.earthOmegaA.f)}(固定の黄道)・${fe(t.earthEpsA.f)}(その日の黄道)、火星で ${fe(t.mars.f)} —— 火星 ÷ 地球は ${f3(t.mars.f / t.earthOmegaA.f)}・${f3(t.mars.f / t.earthEpsA.f)}。`
      + `f を天体に共通の 1 つにすると、2 天体の傾きの率の比べる数の両方には届かない(前提 —— 基準の極 = 合成の軸・一定の場 —— は〔第352便b〕のとおり今の候補では成り立っていない)。`; }
  { const s = J.sun.filter((r) => r.bg === 'Np' && r.tSrc === 0 && r.uCol === 'u1'), a1 = s.find((r) => r.cand === 'a1'), i = s.find((r) => r.cand === 'i'), u = s.find((r) => r.cand === 'u');
    F.sun = `太陽(受け手 —— 背景だけに応答とみる)に地球の要る係数を写すと、倍率 1・(N+) L で、(ア) 太陽の率 ${fe(a1.rateAsYr)}″/年(地球の仮の率と同じ —— 一周 ${fe(a1.periodYr)} 年)・(イ) ${fe(i.rateAsYr)}″/年(${fe(i.periodYr)} 年)・(ウ) ${fe(u.rateAsYr)}″/年(${fe(u.periodYr)} 年)。`
      + `(ウ′)(エ) は太陽の J2 と入り方の数が公開の lib に無いので出さない(null)。どれも仮の写しで、太陽の歳差の率とは書かない(比べる仮の値の太陽の極の動きの上限は台帳に数が無い)。`; }
  return F;
}
