// 第334便e(原仮定者の回答(2026-11-11 —— AN638)・統括の検証項目 R326): **正本 tests/out/gridfloor-w334e.json から PHYSICS〔第334便e〕の表を作る文書の lib**
// (QA docs.gridFloor334e が節の表と逐語で照合する —— 表の数は有効数字 4 桁か百分率の小数 2 桁・丸めの程度の数〔恒等式の残差〕は「< 1e-10」の形で書き、数そのものは載せない)。
export const DOC_VERSION = 'w334e-gridfloordoc-1';
const f3 = (x) => (x === null || x === undefined || !Number.isFinite(x) ? '—' : Number(x).toPrecision(4));
const lt = (x, t) => (Number.isFinite(x) && Math.abs(x) <= t ? '< ' + t.toExponential(0) : '**' + Number(x).toExponential(3) + '**');
const tf = (x) => (x === true ? '真' : x === false ? '偽' : 'null');
const pc = (x) => (x === null || x === undefined || !Number.isFinite(x) ? '—' : Math.abs(x) < 5e-5 ? '0.00%' : (100 * x).toFixed(2) + '%');
const kms = (v) => (v === null || v === undefined || !Number.isFinite(v) ? '—' : f3(v / 1e3));
const med = (a) => { const q = a.filter(Number.isFinite).slice().sort((x, y) => x - y); if (!q.length) return null; const h = q.length >> 1; return q.length % 2 ? q[h] : 0.5 * (q[h - 1] + q[h]); };
export const COMBO_LABEL = Object.freeze({ 'a2|none': 'α = 2・s_d 0(主)', 'a1|none': 'α = 1・s_d 0', 'a2|sync': 'α = 2・s_d = Ω(sync)' });
export const famLabel = (k) => { const p = k.split('|'); return p[0] === 'circ' ? '円軌道' : p[0] === 'random' ? '位相を乱す ε ' + p[1] + '・種 ' + p[2].slice(1) : p[0] === 'kin' ? '位相を揃える kin ε ' + p[1] : '位相を揃える pattern ε ' + p[1] + '・Ω_p ' + p[2]; };
const ARM_LABEL = { kin: 'kin − 円', pattern: 'pattern − 円', random: 'random(種 5 の平均)− 円' };

export function tablesOf(J) {
  const T = {}, S = J.pure.scenes, G = J.pure.gates, P = J.plan, B = J.bands, Rk = P.recRadiiKpc, head = Rk.map((R) => R + ' kpc').join(' | '), sep = Rk.map(() => '---').join('|');
  // 表 1 純関数の場面
  T.pure = ['| 場面 | 値 | 門 |', '|---|---|---|',
    `| ① z = 0 の受け手で第332便b の frameField(座標変換の回転)と同じ(α 1・2 × ε 0・0.1 × s_d none・sync —— ${S.sameAsFrame.n} 組)の相対の差 | ${lt(S.sameAsFrame.maxRel, 1e-10)} | ${tf(G.sameAsFrame)} |`,
    `| ② 星の点を受け手にする(自分を外す)—— frameField の値との相対の差 | ${lt(S.starReceiver.maxRel, 1e-10)} | ${tf(G.starReceiver)} |`,
    `| ③ 薄い円盤の z の偶奇: f(z) − f(−z) の最大・鉛直の成分の最大(どちらもビットで 0) | ${S.zParity.oddAbs === 0 ? '0' : lt(S.zParity.oddAbs, 1e-10)}・${S.zParity.uzAbs === 0 ? '0' : lt(S.zParity.uzAbs, 1e-10)} | ${tf(G.zParity)} |`,
    `| ④ 円盤と受け手を同じ角だけ回して円筒の成分が同じ(相対の差) | ${lt(S.rotateInvariant.maxRel, 1e-10)} | ${tf(G.rotateInvariant)} |`,
    `| ⑤ 離散化を倍にしたときの差: 一様な環の外の受け手 —— K 8 → 16 / 16 → 32 の差 ÷ 値 | ${f3(S.doubling.d1)} / ${f3(S.doubling.d2)} | ${tf(G.doubling)} |`,
    `| ⑥ 軟化: 受け手のすぐそばの 1 点の源の分の速度(ε 0 → 0.25) | ${f3(S.softening.u0)} → ${f3(S.softening.u25)} | ${tf(G.softening)} |`,
    `| ⑦ 幅と偶奇の関数(既知の列): 幅・次数・二階・一階・奇 ÷ 偶 | ${f3(S.helpers.band)}・${f3(S.helpers.order)}・${f3(S.helpers.d2)}・${f3(S.helpers.d1)}・${f3(S.helpers.oddOverEven)} | ${tf(G.helpers)} |`,
    `| ⑧ 受け手と円軌道の星の方位の隔たりの最小(間隔の割合 —— K 24・48・96 × 位相 3)・重なる宣言の対照 | ${f3(S.azGap.min)}・${f3(S.azGap.overlap)} | ${tf(G.azGap)} |`,
    `| ⑨ 厚みの散らし(sech²): 種で同じ列・中心 0・\\|z\\| の中央値 ÷ z₀(期待 artanh(1/2) = ${f3(S.thick.expect)}) | ${tf(S.thick.same)}・${f3(S.thick.center)}・${f3(S.thick.medAbsOverZ0)} | ${tf(G.thick)} |`,
    `| ⑩ 入力の拒否 | ${S.reject.n}/${S.reject.of} | ${tf(G.reject)} |`].join('\n');
  // 表 2 離散化の列の円盤の量と受け手の格子の近さ
  T.disc = ['| 離散化 (間隔 kpc × 方位) | 点の数 | 円盤の質量 [M☉] | 内の端・外の端 [kpc] | 4 kpc の受け手から源への最小の距離 [kpc](円軌道・位相 0) |', '|---|---|---|---|---|',
    ...P.disc.map((q) => { const k = q[0] + 'x' + q[1], d = J.grid.discInfo[k], md = J.grid.vals[k].circ.f0[0][0].minDistKpc; return `| ${q[0]} × ${q[1]} | ${d.n} | ${f3(d.MdiskMsun)} | ${q[0] === undefined ? '—' : d.innerEdgeKpc + '・' + d.outerEdgeKpc} | ${md ? f3(md[0]) : '—'} |`; })].join('\n');
  // 表 3 幅 9(主の組 —— 族 4 × 軟化 4 × 半径 7)
  T.band = ['| 族 | 軟化 ε [kpc] | ' + head + ' | 最大 | 細かい 4 組の幅の最大 |', '|---|---|' + sep + '|---|---|',
    ...J.mainFams.flatMap((f) => P.softKpc.map((e) => { const r = B.rows.find((x) => x.fam === f && x.combo === J.combos[0] && x.softKpc === e); return `| ${famLabel(f)} | ${e} | ${r.band9.map(pc).join(' | ')} | ${pc(r.max9)} | ${pc(r.max4)} |`; }))].join('\n');
  // 表 4 目標(主の組・族 4)
  T.target = ['| 軟化 ε [kpc] | 幅 9 の最大 | 幅 9 ≤ 1% | 細かい 4 組の幅の最大 | 幅 4 ≤ 1% |', '|---|---|---|---|---|',
    ...B.target.perSoft.map((t) => `| ${t.softKpc}${t.softKpc === P.mainSoftKpc ? '(主)' : ''} | ${pc(t.maxBand9)} | ${tf(t.reached9)} | ${pc(t.maxBand4)} | ${tf(t.reached4)} |`)].join('\n');
  // 表 5 対照の組の幅(最大・中央値・細かい 4 組の最大)
  T.bandCombo = ['| 組 | 族 | ε 0 | ε 0.05 | ε 0.1 | ε 0.25 |', '|---|---|---|---|---|---|',
    ...J.combos.flatMap((c) => J.mainFams.map((f) => `| ${COMBO_LABEL[c]} | ${famLabel(f)} | ${P.softKpc.map((e) => { const r = B.rows.find((x) => x.fam === f && x.combo === c && x.softKpc === e); return pc(r.max9) + ' / ' + pc(r.med9) + ' / ' + pc(r.max4); }).join(' | ')} |`))].join('\n');
  // 表 6 分解(主の組 —— 半径 7 の中央値)
  T.decomp = ['| 族 | 軟化 ε [kpc] | 幅 9 | 方位の数だけ(間隔 0.25) | 間隔だけ(方位 96) | 方位の位相(主の離散化) | 方位の位相(1 × 24) | 種(主の離散化) | 軟化の列(主の離散化 —— 偏り) |', '|---|---|---|---|---|---|---|---|---|',
    ...J.mainFams.flatMap((f) => P.softKpc.map((e) => { const r = B.rows.find((x) => x.fam === f && x.combo === J.combos[0] && x.softKpc === e), sd = f.startsWith('random') ? B.seed.find((s) => s.amp === 0.1 && s.combo === J.combos[0] && s.softKpc === e) : null;
      return `| ${famLabel(f)} | ${e} | ${pc(med(r.band9))} | ${pc(med(r.bandK))} | ${pc(med(r.bandDR))} | ${pc(med(r.phaseMain))} | ${pc(med(r.phaseCoarse))} | ${sd ? pc(med(sd.main)) : '—'} | ${pc(med(r.softBand))} |`; }))].join('\n');
  // 表 7 「腕あり − 円」の差と幅の比(主の離散化・位相 0)
  T.arms = ['| ε(振幅) | 組 | 軟化 ε [kpc] | 差 | ' + head + ' | 差 ÷ 幅 の最大 | 幅を超える(> 3) |', '|---|---|---|---|' + sep + '|---|---|',
    ...J.arms.rows.filter((r) => r.combo === J.combos[0] || r.softKpc === P.mainSoftKpc).flatMap((r) => r.arms.map((a) => `| ${r.amp} | ${COMBO_LABEL[r.combo]} | ${r.softKpc} | ${ARM_LABEL[a.arm]} | ${a.diff.map(pc).join(' | ')} | ${f3(a.maxRatio)} | ${a.exceed}/${a.ratio.length} |`))].join('\n');
  const allEx = J.arms.rows.reduce((s, r) => s + r.arms.reduce((t, a) => t + a.exceed, 0), 0), allN = J.arms.rows.reduce((s, r) => s + r.arms.reduce((t, a) => t + a.ratio.length, 0), 0);
  T.armsSum = `**幅を超える(差 ÷ 幅 > ${P.exceedRatio})所: 全部の組・軟化・振幅・腕で ${allEx}/${allN}**(差 ÷ 幅 の最大 ${f3(Math.max(...J.arms.rows.flatMap((r) => r.arms.map((a) => a.maxRatio))))})`;
  // 表 8 m = 2(主の離散化・位相 0・主の組・主の軟化)
  T.m2 = ['| 族 | 量 | ' + head + ' |', '|---|---|' + sep + '|',
    ...J.arms.m2.flatMap((m) => [`| ${famLabel(m.fam)} | 密度の m = 2 | ${m.densA2.map((x) => (x === null ? '—' : x < 1e-10 ? '< 1e-10' : f3(x))).join(' | ')} |`, `| ${famLabel(m.fam)} | U_φ の m = 2 ÷ \\|⟨U_φ⟩\\| | ${m.uA2.map((x) => (x < 1e-10 ? '< 1e-10' : f3(x))).join(' | ')} |`,
      `| ${famLabel(m.fam)} | 位相差 [rad] | ${m.lag.map((x) => (x === null ? '—' : f3(x))).join(' | ')} |`])].join('\n');
  // 表 9 星の点の受け手と第333便d の離散化の列
  T.star = ['| 離散化 | 20 kpc の環の星の受け手: 腕(kin − random 種 1)÷ 円 ε 0 / 0.1 / 0.25 | 5 kpc の同じ量 ε 0 | 円軌道の ⟨U_φ⟩ 20 kpc ε 0 [km s⁻¹] | 最近傍の距離 円 / kin [kpc] |', '|---|---|---|---|---|',
    ...J.star.rows.map((r) => { const e1 = P.softKpc.indexOf(0.1), e3 = P.softKpc.indexOf(0.25); return `| ${r.disc[0]} × ${r.disc[1]} | ${pc(r.armKinOverCirc[20][0])} / ${pc(r.armKinOverCirc[20][e1])} / ${pc(r.armKinOverCirc[20][e3])} | ${pc(r.armKinOverCirc[5][0])} | ${kms(r.fams.circ[20].uPhi[0])} | ${f3(r.fams.circ[20].minDistKpc)} / ${f3(r.fams['kin|0.1'][20].minDistKpc)} |`; })].join('\n');
  T.repro = ['| 第333便d の離散化 | 第333便d の腕 ÷ 円(5・10・20 kpc —— 帯は実際の半径の箱) | 本枝の案内中心の環(同じ量) | 円軌道の値の相対の差 |', '|---|---|---|---|',
    ...J.star.repro.map((r) => `| ${r.dR} × ${r.K} | ${r.arm333.map(pc).join('・')} | ${r.armMine.map(pc).join('・')} | ${lt(r.relCirc, 1e-10)} |`)].join('\n');
  T.starBand = ['| 軟化 ε [kpc] | 20 kpc の幅 9 —— 星の点の受け手 円 / random / kin | 20 kpc の幅 9 —— 格子の受け手 円 / random / kin |', '|---|---|---|',
    ...J.star.bands.map((b) => { const g = (f) => B.rows.find((x) => x.fam === f && x.combo === J.combos[0] && x.softKpc === b.softKpc).band9[Rk.indexOf(20)]; return `| ${b.softKpc} | ${pc(b.starBand.circ)} / ${pc(b.starBand.random)} / ${pc(b.starBand.kin)} | ${pc(g('circ'))} / ${pc(g('random|0.1|s1'))} / ${pc(g('kin|0.1'))} |`; })].join('\n');
  // 表 10 高さ z(主の離散化 —— 薄い円盤と厚みの対照 種 1)
  const zrow = (nm, k, x) => `| ${nm} | ${COMBO_LABEL[k.split('|').slice(1).join('|')]}・ε ${k.split('|')[0]} | ${x.RKpc} | ${kms(x.uPhi0)} | ${x.relPhi.map((q) => pc(q.even)).join(' | ')} | ${x.orders.map((o) => (o === null ? '—' : f3(o))).join('・')} | ${x.oddOverEven === 0 ? '0' : f3(x.oddOverEven)} | ${pc(x.uR0OverPhi)} | ${x.uzMaxOverPhi === 0 ? '0' : f3(x.uzMaxOverPhi)} |`;
  const zs = J.z[0].variants.thin[Object.keys(J.z[0].variants.thin)[0]][0].relPhi.map((q) => 'z = ' + q.z);
  const ZH = '| 源 | 組・軟化 | R [kpc] | ⟨U_φ⟩(z = 0) [km s⁻¹] | 偶の部分 ÷ \\|⟨U_φ⟩(0)\\| ' + zs.join(' | ') + ' | 局所の次数(隣の z の対) | 奇 ÷ 偶 の最大 | ⟨U_R⟩(0) ÷ \\|⟨U_φ⟩(0)\\| | \\|U_z\\| ÷ \\|⟨U_φ⟩(0)\\| |';
  const ZS = '|---|---|---|---|' + zs.map(() => '---').join('|') + '|---|---|---|---|';
  for (const [ti, zr] of J.z.entries()) {
    const nmD = zr.disc[0] + ' × ' + zr.disc[1], rows = [];
    const sel = ti === 0 ? [['thin', ['0|a2|none', '0.1|a2|none', '0.1|a1|none']], ['thick|s1', ['0|a2|none', '0.1|a2|none', '0.1|a1|none']]] : [['thin', ['0|a2|none', '0.1|a1|none']]];
    for (const [vn, ks] of sel) for (const k of ks) for (const x of zr.variants[vn][k]) rows.push(zrow((vn === 'thin' ? '薄い円盤' : '厚み sech² z₀ 0.3 kpc 種 1') + '(' + nmD + ')', k, x));
    T['z' + ti] = [ZH, ZS, ...rows].join('\n');
  }
  T.thick = ['| 離散化 | 組・軟化 | ' + head + ' |', '|---|---|' + sep + '|',
    ...J.z.flatMap((zr) => Object.entries(zr.thickVsThin).map(([k, v]) => `| ${zr.disc[0]} × ${zr.disc[1]} | ${COMBO_LABEL[k.split('|').slice(1).join('|')]}・ε ${k.split('|')[0]} | ${v.map((q) => pc(q.diff) + '(種の幅 ' + pc(q.seedBand) + ')').join(' | ')} |`))].join('\n');
  // 表 11 ⟨U_φ⟩ と v_obs(円軌道・主の離散化・位相 0・主の組)
  const vo = J.grid.vObsAtRec;
  T.vobs = ['| 軟化 ε [kpc] | ' + head + ' |', '|---|' + sep + '|', `| v_obs [km s⁻¹] | ${vo.map(kms).join(' | ')} |`,
    ...P.softKpc.map((e, ei) => `| ⟨U_φ⟩ ÷ v_obs —— ε ${e} | ${J.grid.vals[P.mainDisc[0] + 'x' + P.mainDisc[1]].circ.f0[ei][0].uPhi.map((u, i) => f3(u / vo[i])).join(' | ')} |`),
    ...P.softKpc.map((e, ei) => `| ⟨U_φ⟩ ÷ v_obs —— 1 × 24・ε ${e} | ${J.grid.vals['1x24'].circ.f0[ei][0].uPhi.map((u, i) => f3(u / vo[i])).join(' | ')} |`)].join('\n');
  // 表 12 門と所要
  T.gates = ['| 門 | 値 |', '|---|---|', ...Object.entries(J.gates).map(([k, v]) => `| ${k} | ${tf(v)} |`)].join('\n');
  return T;
}
