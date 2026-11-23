// 第348便d(原仮定者の指示(2026-11-22 —— 第145報の補足 1)・原仮定者の回答(2026-11-23 —— 第145報の回答 10)・統括の検証項目 R412):
//   **正本 tests/out/diskaxis-348d.json から PHYSICS〔第348便d〕の表を作る文書の lib**
//   (QA docs.diskaxis348d が節の表と逐語で照合する —— 表の数は有効数字 3 桁・丸めの残りは書かない)。原文(言葉を変えずに引く)と棚卸しの表もここに持つ。
export const DOC_VERSION = 'w348d-diskaxisdoc-1';
const fe = (x) => (x === null || x === undefined || !Number.isFinite(x) ? '—' : x === 0 ? '0' : Number(x).toExponential(2));
const f3 = (x) => (x === null || x === undefined || !Number.isFinite(x) ? '—' : Number(x).toFixed(3));
/** 比の書き方(0.01〜1000 は小数 3 桁・ほかは指数 —— −0.000 を書かない) */
const fr = (x) => (x === null || x === undefined || !Number.isFinite(x) ? '—' : x === 0 ? '0' : Math.abs(x) >= 0.01 && Math.abs(x) < 1000 ? Number(x).toFixed(3) : Number(x).toExponential(2));
const f1 = (x) => (x === null || x === undefined || !Number.isFinite(x) ? '—' : Number(x).toFixed(1));
const DIR = Object.freeze({ toward: '寄せる', away: '離す', mixed: '混ざる', none: '0' });
const COL = (c) => (c === 'h1' ? '今の式 h₁' : c === 'h0' ? '今の式 h₀' : '(' + c + ')');
const KN = (r) => (r.q === null ? '—' : String(r.q));
const KD = (r) => (r.D0 === null ? '—' : String(r.D0));
const br = (b) => (b ? `${b[0]}〜${b[1]}` : '無し');
const RING = Object.freeze({ ringD: 'D 環', ringC: 'C 環', ringB: 'B 環', ringA: 'A 環', ringF: 'F 環' });

/** 原文(言葉を変えずに引く)—— [出どころ, 原文] */
export const ORIGINAL = Object.freeze([
  Object.freeze(['原仮定者の指示(2026-11-22 —— 第145報の補足 1)', '軸引きずりは、円盤引きずりにも影響するので、様々な可能性から最適を探す']),
  Object.freeze(['原仮定者の指示(2026-11-22 —— 第145報の補足 1)', '並進引きずりは移動と回転を含み、並進引きずりの引きずられる側の部位差分による回転が軸引きずりである。軸引きずりは、源の回転の赤道面方向で強く現れるが、源が無回転で横を通り過ぎても並進引きずりと共に発生する']),
  Object.freeze(['原仮定者の回答(2026-11-23 —— 第145報の回答 10)', 'AN977: 実装は変えず、kFrameとqの引きずりは、「引きずり近似」として扱う。並進引きずりだけでなく、近距離での効きの違いも含んでいる']),
]);
/** 統括の読み(原文ごと —— [読み, 本節で数えた所]) */
export const READINGS = Object.freeze([
  Object.freeze(['候補の回転を 1 つに決め打ちせず、円盤引きずりの側の量(寄せる向き・向きが変わる高さ・経路の比・土星の環の物差し)を候補ごとに並べる', '表 3〜表 8']),
  Object.freeze(['前半は〔第347便h〕の候補の定義。後半の「源が無回転で横を通り過ぎても」の円盤の側は、通過で輪(環の粒子)の各点が枠に運ばれる量の傾きと残り', '表 9']),
  Object.freeze(['アプリの q(引きずり減衰)は引きずり近似の一部。探索では q = 0(定義どおり —— 落ちない)の列を必ず並べる', 'どの表も q 0・2・3']),
]);
export function originalTable(readings = READINGS) {
  return ['| # | 出どころ | 原文(言葉を変えずに引く) | 読み(統括の読み —— 原文と分ける) | 数えた所 |', '|---|---|---|---|---|',
    ...ORIGINAL.map(([src, o], k) => `| ${k + 1} | ${src} | 「${o}」 | ${readings[k][0]} | ${readings[k][1]} |`)].join('\n');
}

/** 表 2 棚卸し(円盤引きずりの既存の診断の器 —— 軸引きずりの回転をどの式で入れているか。事実の表 —— 各 lib の冒頭の宣言と関数から) */
export const INVENTORY = Object.freeze([
  ['〔第337便i〕', 'tests/lib-w337i-rotring.mjs', '円盤引きずり(旧称)の高さの型 6 × 作用の型 5 × 引きずり半径 R_d の読み 4・土星の環の粒子と惑星の一次の率', '入れていない(源の引きずり半径 R_d と高さの型の場 —— 軸引きずりは持たない宣言)', '無し'],
  ['〔第339便a〕(physics.rotDragVert)', 'tests/lib-w339a-rotvert.mjs', 'アプリの鉛直の型(帯 abs(z) < R_eq の内で d = −λ r (s z/ρ) k̂)を第337便i の lib と点ごとに照らす', '入れていない(定数 λ と帯の型)', '無し'],
  ['〔第338便d〕', 'tests/lib-w338d-ringbook.mjs', '土星の環の帳簿(一様厚み・やり取りの収支・4 天体の潮汐の残り・5 つ目の天体・直交)', '入れていない(第337便i の場と 4 天体の強さの組)', '無し(固定の比べる列の出どころ)'],
  ['〔第340便d〕T1', 'tests/lib-w340d-gyropath.mjs', '経路「軸引きずり + 公転 + ジャイロ」を受け手の部位ごとの力で(作用 drag・corV・corS・drag90)', '2 倍角の則の型 Ω(x) = A abs(x)^(−p) h_q(s ŝ, x̂)(twistAxis —— h₁ 主・h₀ 比べる列・A 1)', '在る(gyroRow の field)'],
  ['〔第340便d〕T4・〔第342便d〕', 'tests/lib-w340d-gyropath.mjs・tests/lib-w342d-gyropathfix.mjs', '扁平の源(部位 960 点)÷ 同じ物理の位置の球の源の、場の向きの軸の傾きの比と寄せる力の比', '部位ごとの 2 倍角の則の型(h₁・h₀)と ½∇×(自転で運ぶ速度の重みつき和)(rotU)', '在る(spheroidField を gyroRow の field に)'],
  ['〔第341便d〕', 'tests/lib-w341d-oblatering.mjs', '扁平の源の区切りを細かく(61440 点・Richardson)・落ちる型・口の分け', '部位ごとの 2 倍角の則の型 h₁(h1Unit)と rotU', '関数の中(区切りの場 —— 候補の口は無い)'],
  ['〔第342便c〕', 'tests/lib-w342c-oblateapprox.mjs', '扁平の源を区切らない近似(一番近い表面の接線・弦の向きの積分)', '核 h₁(h1Kernel —— 2 倍角の則の型の q 1)', '関数の中(核が固定)'],
  ['〔第343便d〕', 'tests/lib-w343d-surfquad.mjs', '楕円体の物理の表面にだけ点を置く求積(発散定理)', '核 h₁(第341便d の h1Unit)', '関数の中(核が固定)'],
].map((r) => Object.freeze(r)));
export function inventoryTable() {
  return ['| 節 | lib | 何を数える器か | 軸引きずりの回転の入れ方(今) | 候補の場を入れる口 |', '|---|---|---|---|---|',
    ...INVENTORY.map((r) => `| ${r[0]} | \`${r[1].split('・').join('`・`')}\` | ${r[2]} | ${r[3]} | ${r[4]} |`)].join('\n');
}

export function tablesOf(J) {
  const T = {}, S = J.pure.scenes, G = J.pure.gates, tf = (x) => (x === true ? '真' : x === false ? '偽' : '—');
  T.pure = ['| 零試験・場面 | 値 | 門 |', '|---|---|---|',
    `| ① 今の式の列(h₁・輪・r 1)と第340便d の summaryRow の差の最大/変異(h₁ と h₀ を入れ替える)の差 | ${fe(S.curMatch)}/${fe(S.curSwapDiff)} | ${tf(G.curMatch)} |`,
    `| ② 候補の回転 0 で円盤の側の寄せる力 0(輪 3 作用・球の corS)/変異(一様の ẑ)で corV | ${fe(S.zeroRot)}/${fe(S.zeroRotMut)} | ${tf(G.zeroRot)} |`,
    `| ③ q 0・D₀ 0 の組の極限(剛体の回転 u = ẑ × r): (W)・(G)・(P6)・(V) の Ω と ẑ の差・(P2) と ẑ − ê(ê·ẑ) の差・一様の Ω の輪の corS・drag90 | ${fe(S.rigidOm)}・${fe(S.rigidP2)}・${fe(S.rigidPull)} | ${tf(G.rigid)} |`,
    `| ④ 経路の比の剛体の極限(q 0・D₀ 0 —— 扁平 0.3 と球の場の相対の差) | ${fe(S.oblateRigid)} | ${tf(G.oblateRigid)} |`,
    `| ⑤ (G) の回転 = (W)(輪の寄せる力の差の最大) | ${fe(S.gEqW)} | ${tf(G.gEqW)} |`,
    `| ⑥ 変異 (W) の符号: corV の寄せる力の和 ÷ 元 | ${fe(S.wsign.flipDiff)} | ${tf(G.wsign)} |`,
    `| ⑦ 通過・D₀ = 0: 輪の相対の量(平均 + 傾き + 残り)÷ 尺度・(W) の ∫Ω dt/対照の D₀ 0.01 の傾き | ${fe(S.flyZero)}・${fe(S.flyZeroW)}/${fe(S.flyCtl)} | ${tf(G.flyZero)} |`,
    `| ⑧ 通過・小さな輪(R_r 0.1): 傾きと一次の項 ∫(Jᵀ L̂)_面 dt の相対の差/変異(J で作る) | ${fe(S.flyFirst)}/${fe(S.flyFirstMut)} | ${tf(G.flyFirst)} |`,
    `| ⑨ 入力の拒否 | ${S.rejects.filter(Boolean).length}/${S.rejects.length} | ${tf(G.rejects)} |`].join('\n');
  // (A) 輪の受け手の寄せる向き(d ごと)
  const aRow = (rows, col, q, D0, d) => { const R = rows.filter((r) => r.col === col && r.q === q && r.D0 === D0 && r.d === d), by = Object.fromEntries(R.map((r) => [r.action, r]));
    const z = R.map((r) => r.zStarPos).find((b) => b) || null;
    return `| ${COL(col)} | ${q === null ? '—' : q} | ${D0 === null ? '—' : D0} | ` + ['corV', 'corS', 'drag90'].map((a) => `${DIR[by[a].dir]}・${fr(by[a].vsH1)}`).join(' | ') + ` | ${R.filter((r) => r.zStarPos).map((r) => r.action + ' ' + br(r.zStarPos)).join('・') || '無し'} |`; };
  const aKeys = (d) => { const out = [['h1', null, null], ['h0', null, null]]; for (const c of J.decl.cands) { if (!J.A.some((r) => r.col === c && r.d === d)) continue; for (const q of J.decl.q) for (const D0 of J.decl.D0) out.push([c, q, D0]); } return out; };
  const aHead = '| 列 | q | D₀ | corV の向き・比 | corS の向き・比 | drag90 の向き・比 | 向きが変わる高さの括り(z/r・正の側) |';
  T.A10 = [aHead, '|---|---|---|---|---|---|---|', ...aKeys(10).map(([c, q, D0]) => aRow(J.A, c, q, D0, 10))].join('\n');
  T.A3 = [aHead, '|---|---|---|---|---|---|---|', ...aKeys(3).map(([c, q, D0]) => aRow(J.A, c, q, D0, 3))].join('\n');
  // (B) 経路の比(r/R_eq 2・z/r 0.1)
  const bp = J.B.filter((r) => r.rOverReq === 2 && r.zOverR === 0.1);
  const bKeys = [['h1', null, null], ['h0', null, null]]; for (const c of J.decl.B.tiltCands) for (const q of J.decl.q) for (const D0 of J.decl.D0) bKeys.push([c, q, D0]);
  bKeys.push(['V', J.decl.B.vRow.q, J.decl.B.vRow.D0]);
  T.B = ['| 列 | q | D₀ | 軸の傾きの比(扁平 0.098) | 軸の傾きの比(扁平 0.3) | 寄せる力の比 corV・corS・drag90(扁平 0.098) |', '|---|---|---|---|---|---|',
    ...bKeys.map(([c, q, D0]) => { const m = (f) => bp.find((r) => r.col === c && r.q === q && r.D0 === D0 && r.f === f), a = m(0.098), b = m(0.3);
      return `| ${COL(c)}${c === 'V' ? '(1 行)' : ''} | ${q === null ? '—' : q} | ${D0 === null ? '—' : D0} | ${fr(a && a.axisTiltRatio)} | ${fr(b && b.axisTiltRatio)} | ${a && a.path ? ['corV', 'corS', 'drag90'].map((k) => fr(a.path[k].ratio)).join('・') : '—'} |`; })].join('\n');
  // (C) 土星の環
  const cKeys = [['h1', null, null], ['h0', null, null]]; for (const c of J.decl.cands) for (const q of J.decl.q) for (const D0 of J.decl.D0) cKeys.push([c, q, D0]);
  T.C = ['| 列 | q | D₀ | 点・corV の向き(区分 5) | K = 寄せる力 ÷ (z n²)(z/r 1e-6・D〜F 環) | 点・corV の向きが変わる高さ | 輪・corS の向き・括り(z/r) | 輪・drag90 の向き・括り(z/r) |', '|---|---|---|---|---|---|---|---|',
    ...cKeys.map(([c, q, D0]) => { const R = J.C.rows.filter((r) => r.col === c && r.q === q && r.D0 === D0), dirs = [...new Set(R.map((r) => DIR[r.dir]))].join('/'), Ks = R.map((r) => r.K).filter((x) => x !== null);
      const nz = R.filter((r) => r.zStar !== null).length, rg = J.C.ring.filter((r) => r.col === c && r.q === q && r.D0 === D0);
      const ring = (a) => { const X = rg.filter((r) => r.action === a); if (!X.length) return '—(数えていない)'; const bs = X.filter((r) => r.zStarPos); return [...new Set(X.map((r) => DIR[r.dir]))].join('/') + '・' + (bs.length ? bs.length + '/' + X.length + ' 区分 ' + [...new Set(bs.map((r) => br(r.zStarPos)))].join('・') : '括り無し'); };
      return `| ${COL(c)} | ${q === null ? '—' : q} | ${D0 === null ? '—' : D0} | ${dirs} | ${Ks.length ? (Math.min(...Ks) === Math.max(...Ks) ? fe(Ks[0]) : fe(Math.min(...Ks)) + '〜' + fe(Math.max(...Ks))) : '—(A 1 の宣言 —— 桁は比べない)'} | ${nz ? nz + '/' + R.length : '無し'} | ${ring('corS')} | ${ring('drag90')} |`; })].join('\n');
  const U = J.C.units;
  T.obs = ['| 固定の比べる列(合わせない) | 値 | 出どころ |', '|---|---|---|',
    `| 環の典型の厚み | ${J.lit.thick10m} m(同じ桁 = ${f3(J.lit.sameOrder[0])}〜${J.lit.sameOrder[1]} 倍) | ${J.lit.thickSrc} |`,
    `| 帯の幅(R_eq の読み) | ${f3(U.hBandM)} m | 第338便d の hBand(器の中の値 —— 第337便i の帯の型) |`,
    `| 一様の物差し | 局所のべき ≤ ${J.lit.uniformPow} | ${J.lit.uniformSrc} |`,
    `| 物差しの時間 | ${fe(J.lit.tYardYr)} 年 | 第338便d の宣言 |`,
    `| 区分の中心 [km] | ${J.C.rows.filter((r) => r.col === 'h1').map((r) => RING[r.key] + ' ' + r.rKm).join('・')} | ${J.lit.regionsSrc} |`,
    `| 土星の単位 | 半径 ${U.R} m・時間の単位 √(R³/GM) = ${f1(U.tU)} s・源の自転 ${f3(U.sDim)} | 第338便d の srcOf(第337便i の LIT) |`].join('\n');
  // (D) 通過
  T.D = ['| D₀ | 輪の半径 R_r | 輪の傾き i [deg] | 輪の傾き(∫ の角) | 面の内の回り | 残り ÷ R_r(2 次より上) | 平均の運ばれ(法線) | 候補の傾き ÷ 輪の傾き (P2)・(P6)・(W)・(G)・(V) | 候補の面の内の回り (P2)・(W) |', '|---|---|---|---|---|---|---|---|---|',
    ...J.D.map((r) => `| ${r.D0} | ${r.Rr} | ${r.inc} | ${fe(r.tilt)} | ${fe(r.inPlane)} | ${fe(r.restOverRr)} | ${fe(r.mean)} | ${['P2', 'P6', 'W', 'G', 'V'].map((c) => fr(r.cand[c].vsRing)).join('・')} | ${fe(r.cand.P2.inPlane)}・${fe(r.cand.W.inPlane)} |`)].join('\n');
  return T;
}

/** 節の文に載せる数の文(QA が節に逐語で在ることを照合する) */
export function factsOf(J) {
  const F = {}, cs = J.decl.cands, Ac = J.A.filter((r) => cs.includes(r.col));
  const cnt = (c, f) => { const R = Ac.filter((r) => r.col === c); return `${R.filter(f).length}/${R.length}`; };
  F.Adir = '輪の受け手で今の式 h₁ と向きが同じ行(候補の行 —— 作用 3 × 距離 × q × D₀): ' + cs.map((c) => `(${c}) ${cnt(c, (r) => { const b = J.A.find((x) => x.col === 'h1' && x.d === r.d && x.action === r.action); return r.dir === b.dir; })}`).join('・');
  F.Aband = '向きが変わる高さの括りが在る行: ' + cs.map((c) => `(${c}) ${cnt(c, (r) => r.zStarPos !== null)}`).join('・') + '・今の式 ' + J.A.filter((r) => !cs.includes(r.col) && r.zStarPos !== null).length + '/' + J.A.filter((r) => !cs.includes(r.col)).length;
  const q0 = Ac.filter((r) => r.q === 0 && r.D0 === 0 && r.col !== 'P2' && r.action !== 'corV');
  F.Aq0 = `q 0・D₀ 0 の (P6)・(W)・(G)・(V) の corS・drag90: 向き 0 の行 ${q0.filter((r) => r.dir === 'none').length}/${q0.length}`;
  const wv = J.A.filter((r) => r.col === 'V').map((r) => { const w = J.A.find((x) => x.col === 'W' && x.q === r.q && x.D0 === r.D0 && x.d === r.d && x.action === r.action); return w && w.pullRef ? Math.abs(r.pullRef / w.pullRef - 1) : 0; });
  F.AV = `(V) と (W) の基準の高さの寄せる力の相対の差の最大(距離 10): ${fe(Math.max(...wv))}`;
  const tr = (c) => { const X = J.B.filter((r) => r.col === c).map((r) => r.axisTiltRatio).filter((x) => x !== null); return `${f3(Math.min(...X))}〜${f3(Math.max(...X))}`; };
  F.Btilt = '軸の傾きの比の範囲(扁平 2 × 距離 3 × 高さ 2 × q × D₀): 今の式 h₁ ' + tr('h1') + '・h₀ ' + tr('h0') + '・' + ['P2', 'P6', 'W', 'G'].map((c) => `(${c}) ${tr(c)}`).join('・');
  const pr = (c, a) => { const X = J.B.filter((r) => r.col === c && r.path).map((r) => r.path[a].ratio).filter((x) => x !== null); return X.length ? `${f3(Math.min(...X))}〜${f3(Math.max(...X))}` : '—'; };
  F.Bpath = '寄せる力の比の範囲(扁平 0.098): ' + ['h1', 'P2', 'W'].map((c) => `${COL(c)} corV ${pr(c, 'corV')}・corS ${pr(c, 'corS')}・drag90 ${pr(c, 'drag90')}`).join('/');
  const cb = J.C.ring.filter((r) => r.HstarM), hs = cb.map((r) => r.HstarM[0]);
  F.C = `土星の環: 点・corV の向きが変わる高さが在る行 ${J.C.rows.filter((r) => r.zStar !== null).length}/${J.C.rows.length}・輪の受け手の括りが在る行 ${cb.length}/${J.C.ring.length}` + (hs.length ? `(厚み 2 z* の括りの下の端 ${fe(Math.min(...hs))}〜${fe(Math.max(...hs))} m —— 典型の厚み 10 m の ${fe(Math.min(...hs) / J.lit.thick10m)} 倍以上)` : '');
  const dp = J.D.filter((r) => r.D0 > 0 && r.inc > 0), rr = (c) => { const X = dp.map((r) => r.cand[c].vsRing); return `${f3(Math.min(...X))}〜${f3(Math.max(...X))}`; };
  F.D = `通過(D₀ > 0・輪の傾き > 0 の ${dp.length} 行): 候補の傾き ÷ 輪の傾き ` + ['P2', 'P6', 'W', 'G', 'V'].map((c) => `(${c}) ${rr(c)}`).join('・') + `・残り ÷ R_r の最大 ${fe(Math.max(...J.D.map((r) => r.restOverRr)))}・D₀ = 0 の行の傾きと残り 0 の数 ${J.D.filter((r) => r.D0 === 0 && r.tilt === 0 && r.rest === 0).length}/${J.D.filter((r) => r.D0 === 0).length}`;
  return F;
}
