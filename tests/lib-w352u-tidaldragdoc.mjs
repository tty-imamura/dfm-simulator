// 第352便u(原仮定者の整理(2026-11-11)・原仮定者の整理(2026-11-24 —— 第148報)・統括の検証項目 R458):
// **正本 tests/out/tidaldrag-352u.json から PHYSICS〔第352便u〕の表と数の文を作る文書の lib**
// (QA docs.tidaldrag352u が節の表と逐語で照合する —— 表の数は有効数字 3 桁)。原文(言葉を変えずに引く)もここに持つ。
// ファイルを読まない・import しない。
export const DOC_VERSION = 'w352u-tidaldragdoc-1';
const fin = (x) => typeof x === 'number' && Number.isFinite(x);
const fe = (x) => (!fin(x) ? '—' : x === 0 ? '0' : Number(x).toExponential(2));
const f3 = (x) => (!fin(x) ? '—' : Math.abs(x) >= 1e4 || Math.abs(x) < 1e-2 ? Number(x).toExponential(2) : Number(x).toPrecision(3));
const sg = (x) => (!fin(x) ? '—' : (x < 0 ? '逆回り' : '順回り'));
const PJ = Object.freeze({ Mercury: '水星', Venus: '金星', Earth: '地球', Mars: '火星', Jupiter: '木星', Saturn: '土星', Uranus: '天王星', Neptune: '海王星', Moon: '月', Sun: '太陽', EarthHi: '地球' });
const SETN = Object.freeze({ sun: '太陽', sunMoon: '太陽 + 月', earthSun: '地球 + 太陽' });
const CN = Object.freeze({ Ta: '(T-a)', Tb: '(T-b)', Tg: '(T-g)' });
const SN = Object.freeze({ g2m: '(g2−)', g2p: '(g2+)', nat: '角運動量の向き', flip: '反転' });
const pairN = (k) => { const [id, src] = k.split('|'); return `${PJ[id]} ← ${PJ[src]}`; };

/** 原文(言葉を変えずに引く) */
export const ORIGINAL = Object.freeze([
  Object.freeze(['原仮定者の整理(2026-11-11)', '軸引きずり = 並進引きずりを受ける側の部位による差分で起きる回転 —— 潮汐力の引きずり版']),
  Object.freeze(['原仮定者の整理(2026-11-24 —— 第148報)', '自転速度や、歳差運動の傾きは、天体の構造に左右されるので、先に銀河由来の背景軸引きずりを算出する']),
  Object.freeze(['原仮定者の回答(2026-11-15 —— 第138報の回答 2)', 'ジャイロトルクは、回転体の軸に対して、軸を傾ける回転の力が、直行する軸の回転の力として現れる。この直行を、物理現象と仮定する']),
]);
export const READINGS = Object.freeze([
  '受け手の部位ごとの並進引きずりの差分 = 受け手の位置での場の勾配のテンソル J。これまでの器は J の反対称の部分(回転の分 = 中心の読み (W))だけを数えてきた。対称の部分(歪みの率 E)が扁平な受け手に掛かる項を「潮汐力の引きずり版」の候補の項として数える(統括の読み)',
  '背景(一様な回転)は歪みを持たない —— 歪みの項は局所の源からだけ出る。天体の構造(扁平 J2・慣性モーメントの係数・自転の率)は、背景の後に、応答の側の量として入る(統括の読み)',
  '(T-a) の τ を「軸を傾ける回転」と読み、自転の向きに 90° ずらして歳差の向きにする(ずらす向きは (g2±) の 2 列)。(T-b) は角運動量の式(トルク ÷ (C ω))で、ずらしは式の中に入る(統括の読み —— どちらも候補)',
]);
const esc = (s) => String(s).replace(/\|/g, '/');
export function originalTable() {
  return '| # | 出どころ | 原文(言葉を変えずに引く) | 読み(統括の読み —— 原文と分ける) |\n|---|---|---|---|\n'
    + ORIGINAL.map(([src, o], k) => `| ${k + 1} | ${src} | 「${o}」 | ${esc(READINGS[k])} |`).join('\n');
}

export function tablesOf(J) {
  const T = {};
  { const S = J.pure.scenes, G = J.pure.gates;
    T.pure = '| 零試験・場面 | 値 | 門 |\n|---|---|---|\n' + [
      ['① 反対称の部分の軸のベクトル(1 公転の平均)=〔第351便c〕の `partRot` の中心の読み (W)(地球・火星 × (M)(S)(MS) —— 相対の差)', '< 1e-9', G.antiIsW],
      ['② 1 つの位相で、反対称の部分 =〔第348便h〕の `rot3(\'W\')`(地球・(MS))', S.rotOne === 0 ? '0' : '< 1e-12', G.antiIsRot3],
      ['③ 中心差分(自分の重みを中心の値に固めた場・歩幅 1e-4 a)= 解析の勾配のテンソル(地球 (M)・(S))', '< 1e-6', G.cdMatches],
      ['④ 一様な並進の場・剛体の回転の場では歪み 0(解析の形と中心差分)・回転の場の反対称の部分 = 角速度', '0・0・0', G.uniformZero],
      ['⑤ 球(扁平 0 —— H 0)では (T-a)(T-b)(T-g) とも 0', '0・0・0', G.sphereZero],
      ['⑥ (T-g) の太陽だけの大きさ =〔第330便a〕の `precessionSolar`(e 0 —— 地球・火星・金星・水星)', '< 1e-12', G.tgIsSolar],
      ['⑦ (ウ′) の太陽だけの物差し =〔第352便q〕の `candOf` の uJ(地球・火星・金星)', '< 1e-12', G.uJIsQ],
      ['⑧ (T-a) の (g2−) と (T-b) は同じ線の上・大きさの比 = ω ÷ η_d(η_d 1 s⁻¹)', '同じ線・比 1', G.taTbLine],
      ['⑨ 入力の拒否(成分・向き・組)', `${S.rejects.filter(Boolean).length}/${S.rejects.length}`, G.rejects],
      ['⑩ 対称のテンソルの固有の分解の自己試験', '< 1e-12', G.eig],
    ].map(([x, b, g]) => `| ${x} | ${b} | ${g ? '真' : '偽'} |`).join('\n'); }
  { const by = (pair, part) => J.strain.find((r) => r.pair === pair && r.part === part);
    T.strain = '| 組(受け手 ← 源) | 距離 a [m] | (M) 歪み 位相ごと(2 乗平均の根)″/年 | (M) 歪み 1 公転の平均 | (M) 回転 ″/年 | (S) 歪み 1 公転の平均 ″/年 | (S) 回転 ″/年 | (S) 歪み ÷ (S) 回転 | sin(源の自転軸と公転の北極) | (S) 歪み ÷ ((S) 回転 × sin) | (S) 歪みの主軸の値 ″/年 |\n|---|---|---|---|---|---|---|---|---|---|---|\n'
      + J.decl.pairs.map((k) => { const m = by(k, 'M'), s = by(k, 'S');
        return `| ${pairN(k)} | ${fe(m.a)} | ${fe(m.ePhaseRmsAsYr)} | ${m.avgOverRms < 1e-12 ? '0(位相ごとの値の 1e-12 倍より小さい)' : fe(m.eAvgAsYr)} | ${fe(m.wAvgAsYr)} | ${fe(s.eAvgAsYr)} | ${fe(s.wAvgAsYr)} | ${f3(s.eOverW)} | ${f3(s.sinTilt)} | ${f3(s.eSOverSin)} | ${s.eig.map((e) => fe(e.valAsYr)).join('・')} |`; }).join('\n'); }
  { const P = J.powers;
    T.powers = '| 量(8 惑星 ← 太陽) | 距離のべき(対数の最小二乗) |\n|---|---|\n' + [
      ['(M) 歪み 位相ごと(2 乗平均の根)', P.eRmsM], ['(M) 回転(1 公転の平均)', P.wM], ['(S) 歪み(1 公転の平均)', P.eAvgS], ['(S) 歪み ÷ sin(源の自転軸と公転の北極)', P.eAvgSOverSin], ['(S) 回転(1 公転の平均)', P.wS],
      ['比べる列: 重力の潮汐の強さ G M ÷ a³', P.tideN2]].map(([n, v]) => `| ${n} | ${v.toFixed(3)} |`).join('\n'); }
  T.aligned = '| 受け手 ← 太陽 | (S) 歪み 1 公転の平均 ″/年 | 源の自転軸を公転の北極にそろえた試しの平均 | 同じ試しの位相ごと(2 乗平均の根)″/年 |\n|---|---|---|---|\n'
    + J.aligned.map((r) => `| ${PJ[r.id]} | ${fe(r.eAvgAsYr)} | ${r.ratio < 1e-9 ? '0' : fe(r.eAlignedAsYr)} | ${fe(r.rmsAligned)} |`).join('\n');
  { const rows = J.rate.filter((r) => r.part === 'S' || r.part === '—');
    T.rate = '| 受け手(源の組) | 候補 | 向き | 方位の率 公転の北極 ″/年 | 方位の率 黄道の極 ″/年 | 傾きの率 公転の北極 ″/年 | 比べる数 ″/年 | 要る係数(比べる数 ÷ abs(方位の率)) | 回る向き(比べる数の極) |\n|---|---|---|---|---|---|---|---|---|\n'
      + rows.map((r) => `| ${PJ[r.id]}(${SETN[r.set]}) | ${CN[r.cand]} | ${SN[r.sense]} | ${fe(r.az.orb)} | ${fe(r.az.ecl)} | ${fe(r.inc.orb)} | ${f3(r.ref)}${r.kind === 'prov' ? '(仮)' : '(リポジトリ)'} | ${fe(r.need)} | ${r.retro === null ? '—' : r.retro ? '逆回り' : '順回り'} |`).join('\n'); }
  T.align = '| 候補・向き | 地球の源 | 要る係数 ÷ 地球の要る係数(火星・金星・水星) | そろう度合い 3 天体(地球・火星・金星 —— 仮) | 4 天体(+ 水星) | 回る向き(地球・火星・金星・水星) |\n|---|---|---|---|---|---|\n'
    + J.align.map((a) => `| ${CN[a.cand]} ${SN[a.sense]} | ${SETN[a.earthSet]} | ${a.rel.slice(1).map(f3).join('・')} | ${f3(a.spread3)} | ${f3(a.spread4)} | ${a.retro.map((x) => (x === null ? '—' : x ? '逆' : '順')).join('・')} |`).join('\n');
  T.uJ = '| 〔第352便q〕の列 | 地球の源 | (ウ′) の物差し X 地球 ÷ 火星 | 比 C ÷ X(地球 1 —— 火星・金星) | そろう度合い 3 天体(仮) |\n|---|---|---|---|---|\n'
    + J.uJ.map((u) => `| ${u.bg === 'Np' ? '(N+)' : '(G−)'} L・規則・${u.uCol === 'u1' ? '倍率 1' : '(uV)'} | ${SETN[u.earthSet]} | ${f3(u.X[0] / u.X[1])} | ${u.rel.slice(1).map(f3).join('・')} | ${f3(u.spread3)} |`).join('\n');
  T.size = '| 受け手(源の組) | 比べる数 ″/年 | (T-a) 単位の係数 λ̃ 1 の率 ÷ 比べる数 | (T-b) 単位の係数 η_d 1 s⁻¹ の率 ÷ 比べる数 | (T-g) 重力の側の列 ÷ 比べる数(比べる列) | 要る λ̃ | 要る η_d [s⁻¹] |\n|---|---|---|---|---|---|---|\n'
    + J.size.map((s) => `| ${PJ[s.id]}(${SETN[s.set]}) | ${f3(s.ref)}${s.kind === 'prov' ? '(仮)' : '(リポジトリ)'} | ${fe(s.taOverRef)} | ${fe(s.tbOverRef)} | ${f3(s.tgOverRef)} | ${fe(s.needLam)} | ${fe(s.needKappa)} |`).join('\n');
  { const V = J.venus;
    T.bg = '| 背景の向き・大きさ | 背景の角速度 ″/年 | 歪み ″/年 | 反対称の部分 ″/年 |\n|---|---|---|---|\n'
      + J.bg.map((b) => `| ${b.dir === 'Np' ? '(N+)' : '(G−)'}・${b.uCol === 'u1' ? '倍率 1' : '(uV)'} | ${fe(b.omAsYr)} | ${fe(b.eAsYr)} | ${fe(b.wAsYr)} |`).join('\n');
    T.venus = '| 金星の量 | 値 |\n|---|---|\n' + [
      ['(S) 歪み 1 公転の平均(太陽由来)″/年', fe(V.eAvgSAsYr)], ['(M) 歪み 位相ごと(2 乗平均の根)″/年', fe(V.eRmsMAsYr)], ['(S) 回転 ″/年', fe(V.wSAsYr)], ['J2・慣性モーメントの係数・H(リポジトリ)', `${fe(V.J2)}・${f3(V.moi)}・${fe(V.H)}`],
      ['自転の率 ω [rad/s]', fe(V.omega)], ['比べる数(仮)″/年', f3(V.ref)],
      ...V.rates.map((r) => [`${CN[r.cand]} ${SN[r.sense]} の方位の率(公転の北極)″/年・率 ÷ 比べる数`, `${fe(r.az)}・${r.cand === 'Tg' ? f3(r.overRef) : fe(r.overRef)}`])].map(([n, v]) => `| ${n} | ${v} |`).join('\n'); }
  return T;
}
export function factsOf(J) {
  const F = {}, by = (pair, part) => J.strain.find((r) => r.pair === pair && r.part === part), P = J.powers;
  { const e = by('Earth|Sun', 'M'), s = by('Earth|Sun', 'S'), rs = J.strain.filter((r) => r.part === 'S' && r.pair.endsWith('|Sun')), ratios = rs.map((r) => r.eSOverSin).filter(fin), rm = J.strain.filter((r) => r.part === 'M').map((r) => r.rmsEOverRmsW);
    F.strain = `(M)(相対の公転の分)の歪みは、位相ごとには回転の分と同じ桁(位相ごとの 2 乗平均の根の比 歪み ÷ 回転 = ${Math.min(...rm).toFixed(3) === Math.max(...rm).toFixed(3) ? Math.min(...rm).toFixed(3) : Math.min(...rm).toFixed(3) + '〜' + Math.max(...rm).toFixed(3)} —— 地球 ${fe(e.ePhaseRmsAsYr)}″/年)だが、円の道の 1 公転の平均では 0(位相ごとの値の 1e-12 倍より小さい —— 相対の速度と源への向きが直交し、歪みは 2 倍の位相で回る)。`
      + `1 公転の平均で残る歪みは (S)(源の自転の分)からだけ出る(地球 ${fe(s.eAvgAsYr)}″/年・(S) の回転の ${f3(s.eOverW)} 倍)。その大きさは源の自転軸と受け手の公転の北極の角の sin に比例し(太陽由来の 9 組で歪み ÷ (回転 × sin) = ${Math.min(...ratios).toFixed(3)}〜${Math.max(...ratios).toFixed(3)})、源の自転軸を公転の北極にそろえた試しでは 0。`
      + `主軸の値は同じ大きさの正と負と 0(跡 0 のずれの形)。距離のべきは (S) の歪み ÷ sin で ${P.eAvgSOverSin.toFixed(3)}(重力の潮汐の強さ G M ÷ a³ と同じべき)・(M) の位相ごとの歪みは ${P.eRmsM.toFixed(3)}。`; }
  { const g = (cand, sense, set) => J.align.find((a) => a.cand === cand && a.sense === sense && a.earthSet === set);
    const ta = g('Ta', 'g2m', 'sun'), tb = g('Tb', 'nat', 'sun'), t1 = g('Tg', 'nat', 'sun'), t2 = g('Tg', 'nat', 'sunMoon');
    F.align = `要る係数のそろい方(地球・火星・金星 —— 仮・未照合): (T-a) は ${f3(ta.spread3)}(火星 ${f3(ta.rel[1])}・金星 ${f3(ta.rel[2])} —— 地球を 1)・(T-b) は ${f3(tb.spread3)}(${f3(tb.rel[1])}・${f3(tb.rel[2])})。`
      + `比べる列の (T-g) は、地球の源を太陽だけにすると ${f3(t1.spread3)}、月を足すと ${f3(t2.spread3)}(${f3(t2.rel[1])}・${f3(t2.rel[2])})。水星(リポジトリの役割「桁」の数)を足すと (T-g) は ${f3(t2.spread4)}。`
      + `月を源に足しても (T-a)(T-b) は変わらない(地球 ← 月の (S) の歪みは ${fe(by('Earth|Moon', 'S').eAvgAsYr)}″/年・(M) は平均で 0)。`; }
  { const u1 = J.uJ.find((u) => u.bg === 'Np' && u.uCol === 'u1' && u.earthSet === 'sun'), u2 = J.uJ.find((u) => u.bg === 'Np' && u.uCol === 'u1' && u.earthSet === 'sunMoon'), g1 = J.uJ.find((u) => u.bg === 'Gm' && u.uCol === 'uV' && u.earthSet === 'sun'), g2 = J.uJ.find((u) => u.bg === 'Gm' && u.uCol === 'uV' && u.earthSet === 'sunMoon'), n2 = J.uJ.find((u) => u.bg === 'Np' && u.uCol === 'uV' && u.earthSet === 'sunMoon');
    F.uJ = `〔第352便q〕の (ウ′) の物差しに、地球の源として月の G M ÷ a³ を足すと(月 ÷ 太陽 = ${f3(J.moonOverSun)})、倍率 1・(N+) L のそろう度合いは ${f3(u1.spread3)} → ${f3(u2.spread3)}(火星 ${f3(u2.rel[1])}・金星 ${f3(u2.rel[2])} —— 地球を 1)。`
      + `(uV) (G−) では ${f3(g1.spread3)} → ${f3(g2.spread3)}・(uV) (N+) は金星の打ち消しのまま ${f3(n2.spread3)}。`; }
  { const s = (id, set) => J.size.find((r) => r.id === id && r.set === set), e1 = s('Earth', 'sun'), e2 = s('Earth', 'sunMoon'), m = s('Mars', 'sun'), v = s('Venus', 'sun'), me = s('Mercury', 'sun');
    F.size = `単位の係数での率 ÷ 比べる数は、(T-a)(λ̃ 1)で ${fe(Math.min(e1.taOverRef, m.taOverRef, v.taOverRef))}〜${fe(Math.max(e1.taOverRef, m.taOverRef, v.taOverRef))}・(T-b)(η_d 1 s⁻¹)で ${fe(Math.min(e1.tbOverRef, m.tbOverRef, v.tbOverRef))}〜${fe(Math.max(e1.tbOverRef, m.tbOverRef, v.tbOverRef))}(地球・火星・金星 —— 仮)。`
      + `比べる列の重力の側の潮汐のトルク (T-g)(リポジトリの数だけ)は、地球(太陽だけ)${f3(e1.tgOverRef)}・地球(太陽 + 月)${f3(e2.tgOverRef)}・火星 ${f3(m.tgOverRef)}・金星 ${f3(v.tgOverRef)} 倍(仮の比べる数に対して)・水星 ${f3(me.tgOverRef)} 倍(リポジトリの役割「桁」の数に対して)。`; }
  { const r = (id, cand, sense) => J.rate.find((x) => x.id === id && x.set === 'sun' && x.cand === cand && x.sense === sense && (x.part === 'S' || x.part === '—'));
    F.sense = `回る向き(比べる数の極 —— 地球は黄道の極・火星は公転の北極): 地球と火星で仮の値と同じ逆回りになるのは (T-a) (g2+)・(T-b) の反転・(T-g)。(T-b) の角運動量の向き(ずらしを式の中に持つ形)は、地球 ${sg(r('Earth', 'Tb', 'nat').az.ecl)}・火星 ${sg(r('Mars', 'Tb', 'nat').az.orb)}。`
      + `(S) の歪みの向きは太陽の自転軸の傾きの方位で決まり、火星の (T-a)(T-b) は極の選び方で回る向きが入れ替わる(公転の北極 ${sg(r('Mars', 'Ta', 'g2m').az.orb)}・黄道の極 ${sg(r('Mars', 'Ta', 'g2m').az.ecl)} —— (g2−))。(T-g) は 4 天体とも、公転の北極のまわりで自転と逆回り(金星は自転軸が逆向きなので公転の北極のまわりの符号が正)。`; }
  { const V = J.venus, b = J.bg;
    F.bg = `一様な背景(背景の向き 2 × 大きさ 2)の勾配のテンソルは反対称だけで、歪みは 0(反対称の部分 = 背景の角速度 —— ${fe(b[0].omAsYr)}・${fe(b[1].omAsYr)}″/年)。「潮汐力の引きずり版」の項は背景からは出ず、局所の源からだけ出る。`
      + `金星の位置の (S) の歪みは ${fe(V.eAvgSAsYr)}″/年・金星の H は ${fe(V.H)}(リポジトリの J2 ÷ 慣性モーメントの係数)—— (T-a) の率は比べる数の ${fe(V.rates.find((x) => x.cand === 'Ta').overRef)} 倍・(T-g) は ${f3(V.rates.find((x) => x.cand === 'Tg').overRef)} 倍。`; }
  return F;
}
