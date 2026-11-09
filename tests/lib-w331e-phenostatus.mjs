// 第331便e(原仮定者の補足(2026-11-09)「これまでに検証対象となった様々な現象が、どの程度解決しているのかを、リスト化する」・統括の検証項目 R314):
//   現象の状況一覧 docs/PHENOMENA_STATUS.md の読み取りと照合の純関数(QA lint.phenomena331e・docs.phenomena331e が呼ぶ —— html・エンジン・正本は読むだけ)。
//   照合: (i) 各行の証拠の実在(本 ID が html に在位し SAMPLE_STATUS の状況と同じ語・正本と文書のパスが実在・本書の節の見出しが実在・QA の鍵が qa.mjs に実在)
//         (ii) 段階・仕組み・帳簿が固定の語彙の内・件数の表と要約の表が各行と同じ (iii) 段階と SAMPLE_STATUS の状況の対応が外れる行に理由の欄
//         (iv) 主な数の転記(節の本文・SAMPLE_STATUS の行・正本の値・文書)(v) 書かない語・禁句・裸の係数記号・速度の数の字列
//   壊れたときは「どの行のどの欄・どの数・どの出典か」を違反の文に書く。
export const PHENO_STATUS_VERSION_331E = 'w331e-phenostatus-1';
export const PHENO_DOC_331E = 'docs/PHENOMENA_STATUS.md';
export const STAGES_331E = ['門の内', '一部', '残差', '扱っていない'];
export const MECHS_331E = ['実装(在位)', '実装(opt-in)', '診断', '宣言(未接続)', 'なし'];
export const LEDGERS_331E = ['閉じた', '未', '該当なし'];
export const FIELDS_331E = ['段階', '仕組み', '帳簿', '物差し', '主な数', '証拠', '残っていること・次の段', '第331便の調べ', '食い違いの理由'];
export const SAMPLE_STATES_331E = ['達', '部分', '未達', '対象外'];

const cp = (a) => String.fromCodePoint(...a), rv = (t) => t.split('').reverse().join('');
// 禁句(文字で持たない —— 外部の回答系統の名前・モデル名・private の資料の名)
export const NG_WORDS_331E = [cp([0x518d, 0x73fe, 0x3057, 0x305f]), cp([0x518d, 0x73fe, 0x3057, 0x306a, 0x3044]), cp([0x5408, 0x308f, 0x305b, 0x3089, 0x308c, 0x306a, 0x3044]),
  cp([0x666e, 0x904d, 0x5b9a, 0x6570]), cp([0x79c1, 0x4fe1]), cp([0x6dfb, 0x4ed8]), cp([0x5be9, 0x67fb])]
  .concat(['TPGtahC', 'korG', 'inimeG', 'edualC', '-TPG', 'supO', 'tennoS', 'ukiaH', 'elbaF', 'NEPO_SNOISICED', 'ffodnah_pamdaor', 'etavirp-rotalumis-mfd'].map(rv));
// 書かない語(「」の中の引用は除いて数える)
export const NOT_WORDS_331E = [/フィットした/, /較正した/, /収束した/, /完全に一致/, /確認した/, /法則を確かめた/, /検証が完了した/, /説明した/, /同定した/, /一致した/, /示した/, /確かめた/,
  /解決した/, /導いた/, /予言した/, /ダークマターを説明/, /ハローが要らない/, /平坦な回転を説明/, /環の厚みを決める/, /スケールで有効と確かめた/, /G_loc で水星の近点を/, /座標則が今のエンジンと同じ/];

const trimV = (s) => String(s || '').split(' —— ')[0].trim();

// ── 読み取り ──
export function parsePhenoDoc331e(md) {
  const out = { rows: [], tables: { stage: null, mech: null, ledger: null }, summary: [], errors: [] };
  if (typeof md !== 'string' || !md) { out.errors.push('文書が空'); return out; }
  const L = md.split('\n');
  // 件数の表(見出し「## 段階ごとの件数」の後の 3 つの表)
  const iC = L.findIndex((l) => /^## 段階ごとの件数/.test(l)), iS = L.findIndex((l) => /^## 一覧\(要約\)/.test(l)), iR = L.findIndex((l) => /^## 各現象/.test(l));
  if (iC < 0 || iS < 0 || iR < 0 || !(iC < iS && iS < iR)) out.errors.push('節の並び(段階ごとの件数 → 一覧(要約)→ 各現象)');
  const cells = (l) => l.split('|').slice(1, -1).map((c) => c.trim());
  if (iC >= 0 && iS > iC) {
    const tbs = []; let cur = null;
    for (let i = iC + 1; i < iS; i++) {
      const l = L[i];
      if (/^\|/.test(l)) { if (!cur) { cur = { head: cells(l), rows: [] }; tbs.push(cur); } else if (!/^\|[-| ]+\|$/.test(l)) cur.rows.push(cells(l)); } else cur = null;
    }
    for (const tb of tbs) {
      const k = tb.head[0] === '段階' ? 'stage' : tb.head[0] === '仕組み' ? 'mech' : tb.head[0] === '帳簿' ? 'ledger' : null;
      if (!k) { out.errors.push('件数の表の頭 ' + tb.head[0]); continue; }
      const m = {};
      for (const r of tb.rows) m[r[0]] = { n: Number(r[1]), ids: (r[2] || '').split('・').map((s) => s.trim()).filter(Boolean) };
      out.tables[k] = m;
    }
  }
  if (iS >= 0 && iR > iS) {
    for (let i = iS + 1; i < iR; i++) { const l = L[i]; if (!/^\| P\d\d /.test(l)) continue; const c = cells(l); out.summary.push({ id: c[0], name: c[1], stage: c[2], mech: c[3], ledger: c[4], books: c[5] }); }
  }
  // 各行
  let row = null;
  for (let i = (iR >= 0 ? iR + 1 : 0); i < L.length; i++) {
    const l = L[i];
    const h = /^### (P\d\d) (.+)$/.exec(l);
    if (h) { row = { id: h[1], name: h[2].trim(), fields: {}, order: [], line: i + 1, text: '' }; out.rows.push(row); continue; }
    if (/^## /.test(l)) { row = null; continue; }
    if (!row) continue;
    row.text += l + '\n';
    const f = /^- \*\*(.+?)\*\*: (.*)$/.exec(l);
    if (f) { row.fields[f[1]] = f[2]; row.order.push(f[1]); }
  }
  for (const r of out.rows) {
    r.stage = trimV(r.fields['段階']); r.mech = trimV(r.fields['仕組み']); r.ledger = trimV(r.fields['帳簿']);
    const ev = r.fields['証拠'] || '';
    r.samples = [...ev.matchAll(/`([A-Za-z][A-Za-z0-9]*)`\((達|部分|未達|対象外)\)/g)].map((m) => ({ id: m[1], st: m[2] }));
    r.paths = [...r.text.matchAll(/`((?:tests|docs)\/[^`\s]+)`/g)].map((m) => m[1]);
    r.secs = [...r.text.matchAll(/〔第(\d+)便([a-z]*)〕/g)].map((m) => ({ ref: m[0], head: '〔第' + m[1] + '便' + m[2] + ' — ' }))
      .concat([...r.text.matchAll(/〔第(\d+)便 — 統括〕/g)].map((m) => ({ ref: m[0], head: '〔第' + m[1] + '便 — 統括' })));
    r.qaKeys = [...ev.matchAll(/`([a-z][A-Za-z0-9]*\.[A-Za-z0-9_.\-]+)`/g)].map((m) => m[1]);
    r.reason = trimV(r.fields['食い違いの理由']) === '—' ? '' : String(r.fields['食い違いの理由'] || '').trim();
  }
  return out;
}

// 段階と SAMPLE_STATUS の状況の対応(文書の「段階の語彙」の表の右の列)—— 理由の欄が要るか
export function needsReason331e(stage, samples) {
  const sts = (samples || []).map((s) => s.st);
  if (stage === '門の内') return sts.some((s) => s !== '達');
  if (stage === '残差') return sts.some((s) => s === '達');
  if (stage === '扱っていない') return sts.length > 0;
  return false;
}

// SAMPLE_STATUS の md から本の行(状況の語と行の全文)
export function sampleStatusRows331e(ssMd) {
  const m = new Map();
  for (const l of String(ssMd || '').split('\n')) {
    const r = /^\| [^|]* \| `([A-Za-z][A-Za-z0-9]*)` \| [^|]* \| [^|]* \| (達|部分|未達|対象外)・/.exec(l);
    if (r) m.set(r[1], { st: r[2], line: l });
  }
  return m;
}

// PHYSICS の節の本文(見出しの行の型 —— 行頭の〔第NNN便x — / 〔第NNN便 — 統括 —— 他の節の本文の参照には当てない)
export function physSection331e(ph, head) {
  if (typeof ph !== 'string') return '';
  const i = ph.indexOf('\n' + head);
  if (i < 0) return '';
  const re = /\n〔第\d+便[a-z]* — |\n## /g; re.lastIndex = i + 2;
  const m = re.exec(ph);
  return ph.slice(i + 1, m ? m.index : ph.length);
}

// 主な数の転記の表(各行 2〜8 項 —— text は文書の行にそのまま在る字・src の出典の本文にも同じ字〔want があればそれ〕・json は表示の桁で丸めて比べる)
const MERC = (J) => J.K.systems.mercury.byDiv['2'];
export const TRANSCRIPTS_331E = [
  { row: 'P01', text: '+71.63″/世紀', src: 'json', ref: 'tests/out/inposk1-w315c.json', val: (J) => MERC(J).DG, fixed: 2 },
  { row: 'P01', text: '−28.65″/世紀', src: 'json', ref: 'tests/out/inposk1-w315c.json', val: (J) => MERC(J).dqG, fixed: 2 },
  { row: 'P01', text: '= 42.98″/世紀', src: 'json', ref: 'tests/out/inposk1-w315c.json', val: (J) => MERC(J).q.q11 - MERC(J).q.q00, fixed: 2 },
  { row: 'P01', text: 'r_1PN 2.618e-5″/世紀(h/2)', src: 'ss', ref: 'mercurySunInertial3d' },
  { row: 'P01', text: '42.98051', src: 'phys', ref: '〔第315便c — ' },
  { row: 'P01', text: '17.514 km', src: 'phys', ref: '〔第315便c — ' },
  { row: 'P01', text: '2.907 mm', src: 'phys', ref: '〔第315便c — ' },
  { row: 'P01', text: '5.930396', src: 'phys', ref: '〔第315便c — ' },
  { row: 'P01', text: '近点移動 −6.91%', src: 'ss', ref: 'mercuryReal' },
  { row: 'P02', text: '6.965e-5″/世紀(h/2)', src: 'ss', ref: 'venusSunInertial3d' },
  { row: 'P02', text: '6.091e-6″/世紀(h/2)', src: 'ss', ref: 'marsSunInertial3d' },
  { row: 'P02', text: '7.926e-5″/世紀(h/2)', src: 'ss', ref: 'jupiterSunInertial3d' },
  { row: 'P02', text: '5.251e-6″/世紀(h/4)', src: 'ss', ref: 'saturnSunInertial3d' },
  { row: 'P02', text: '1.573e-7″/世紀(h/4)', src: 'ss', ref: 'uranusSunInertial3d' },
  { row: 'P02', text: '-6.927e-10″/世紀(h/4)', src: 'ss', ref: 'neptuneSunInertial3d' },
  { row: 'P02', text: '(4/3)η q_1PN = 7.925e-5″/世紀', src: 'phys', ref: '〔第313便d — ' },
  { row: 'P03', text: '1.7509″ が窓 ±1% 内', src: 'ss', ref: 'grcalLight' },
  { row: 'P03', text: '281.0 μs が窓 ±1% 内', src: 'ss', ref: 'grcalShapiro' },
  { row: 'P03', text: '非対称度 0.678', src: 'ss', ref: 'spinlens' },
  { row: 'P04', text: 'τ/t と解析値の差 1.1×10⁻⁵', src: 'ss', ref: 'gclock' },
  { row: 'P04', text: '正味 38.50 μs/日が窓 ±1% 内', src: 'ss', ref: 'grcalGps' },
  { row: 'P05', text: '比 1.3331(h/4・c₀ = 30)', src: 'ss', ref: 'binaryCheckEqualInertial3d' },
  { row: 'P05', text: '1 + (4/3)η = 1.33333', src: 'ss', ref: 'binaryCheckEqualInertial3d' },
  { row: 'P05', text: '比 1.2498', src: 'ss', ref: 'binaryCheckRatio3Inertial3d' },
  { row: 'P05', text: '1.25000', src: 'ss', ref: 'binaryCheckRatio3Inertial3d' },
  { row: 'P05', text: 'η = 0.22124 で +29.50%', src: 'phys', ref: '〔第322便 — 統括' },
  { row: 'P05', text: 'η = 0.24818 で +33.09%', src: 'phys', ref: '〔第322便 — 統括' },
  { row: 'P06', text: '周期 +0.00307%(1.1×10⁶σ)', src: 'ss', ref: 'psrDoubleAB' },
  { row: 'P06', text: '周期 +0.000876%(3.7×10⁵σ)', src: 'ss', ref: 'psrB1534' },
  { row: 'P06', text: '-1.770e-9 rad/公転(h/4)', src: 'ss', ref: 'psrDoubleABInertial3d' },
  { row: 'P06', text: 'B の寄与 0.57%', src: 'ss', ref: 'psrDoubleABInertial3d' },
  { row: 'P07', text: '21.49″/世紀', src: 'phys', ref: '〔第330便 — 統括' },
  { row: 'P08', text: '長窓 M4 8.8495 年・交点 18.6037 年(B1 +0.0041 —— 許容の内)', src: 'ss', ref: 'earthMoonSunInertial3d' },
  { row: 'P08', text: '8.850391', src: 'phys', ref: '〔第306便c — ' },
  { row: 'P08', text: '18.599525', src: 'phys', ref: '〔第306便c — ' },
  { row: 'P08', text: '-0.00093', src: 'phys', ref: '〔第306便c — ' },
  { row: 'P08', text: '+0.00413', src: 'phys', ref: '〔第306便c — ' },
  { row: 'P08', text: '許容の 0.19 倍', want: '| -0.00093 | 0.19 |', src: 'phys', ref: '〔第306便c — ' },
  { row: 'P08', text: '許容の 0.83 倍', want: '| +0.00413 | 0.83 |', src: 'phys', ref: '〔第306便c — ' },
  { row: 'P10', text: '周期 +0.00131%(279σ)', src: 'ss', ref: 'plutoCharonDiagInput' },
  { row: 'P10', text: 'a 19595.593 km', src: 'ss', ref: 'plutoCharonInertialFit' },
  { row: 'P11', text: 'ガニメデは V1a・V0 とも決まった・カリストは V0 が決まり V1a は窓の安定で決まらない・タイタンは決まらない(V1a は窓の安定・V0 は刻み)・トリトンは母惑星中心だけで二体の値に戻る', src: 'phys', ref: '〔第318便 — 統括' },
  { row: 'P11', text: 'この予算では永年項として決まらない', src: 'phys', ref: '〔第317便 — 統括' },
  { row: 'P12', text: 'C環内縁 20828.3 s(h/2 20824.9)・面の角 1.5e-6°・損失 0', src: 'ss', ref: 'saturnRingInertial3d' },
  { row: 'P12', text: '5.006 m', src: 'phys', ref: '〔第315便c — ' },
  { row: 'P13', text: '近点移動 −0.306%(14.6σ)', src: 'ss', ref: 'saturnZonalD68' },
  { row: 'P13', text: '差 +42.66 deg/yr のうち初速が +42.23', src: 'ss', ref: 'saturnD68Consistent' },
  { row: 'P14', text: '潮汐ロック 7/7(重み)', src: 'phys', ref: '〔第330便 — 統括' },
  { row: 'P14', text: 'ロックしない 0/7', src: 'phys', ref: '〔第330便 — 統括' },
  { row: 'P15', text: '水星・イオ・月は文献の桁の四重極(N₂)で観測の状態を保つ(N₁ は要らない)', src: 'phys', ref: '〔第329便 — 統括' },
  { row: 'P15', text: '一価でない', src: 'phys', ref: '〔第329便 — 統括' },
  { row: 'P16', text: '要る振幅 N₁ = 4.473e17 N·m —— 文献の桁の N₂ の 2.556e3 倍', src: 'phys', ref: '〔第329便 — 統括' },
  { row: 'P16', text: '熱潮汐なしの列では全部同符号', src: 'phys', ref: '〔第330便 — 統括' },
  { row: 'P16', text: '要る大きさの 1e-11 の桁', src: 'phys', ref: '〔第318便 — 統括' },
  { row: 'P17', text: '太陽 −7.404e-6・地球 −1.599e-4・火星 −1.244e-3 rad/s —— 同じ入力の定常の目標の比 0.125〜0.187 と観測の 0.972', src: 'phys', ref: '〔第330便 — 統括' },
  { row: 'P18', text: 'ロックしない 6/7(重み)', src: 'phys', ref: '〔第330便 — 統括' },
  { row: 'P18', text: '−7.404e-6', src: 'phys', ref: '〔第330便 — 統括' },
  { row: 'P18', text: '大きさに依らず向きを選ばない', src: 'phys', ref: '〔第318便 — 統括' },
  { row: 'P19', text: '76 行の全部で受け手と系の収支が < 1e-12', src: 'phys', ref: '〔第330便 — 統括' },
  { row: 'P19', text: 'τ_0 = 年齢で地球 0.27・木星 2.96・土星 1.72', src: 'phys', ref: '〔第330便 — 統括' },
  { row: 'P20', text: '25 502 年(文献の 0.9895 倍 —— 残差)', src: 'phys', ref: '〔第330便 — 統括' },
  { row: 'P20', text: '宣言の精度の 2〜3%・月とトリトンは 1 年で超える', src: 'phys', ref: '〔第330便 — 統括' },
  { row: 'P21', text: '収縮 3.02 倍で ω 8.46 倍・帳簿は閉じる', src: 'ss', ref: 'spinup' },
  { row: 'P22', text: '温度分散の比 0.647 が門 <0.75 を通過', src: 'ss', ref: 'gas' },
  { row: 'P22', text: '冷却速度比 15.8/15.1(理論 16)', src: 'ss', ref: 'coolrace' },
  { row: 'P23', text: '外縁速度比 1.266 が窓 1.15〜1.4 内', src: 'ss', ref: 'galaxyStd' },
  { row: 'P23', text: 'λ_PN=0 で外縁速度比 1.180 が窓内', src: 'ss', ref: 'galaxyGeo2' },
  { row: 'P23', text: 'η(R) = 0.103〜0.288', src: 'phys', ref: '〔第329便 — 統括' },
  { row: 'P23', text: '平坦の判定 3/12・座標変換の型 0/4', src: 'phys', ref: '〔第330便 — 統括' },
  { row: 'P23', text: 'M_drag/M_vis が 1e5〜1e9 の桁で', src: 'phys', ref: '〔第318便 — 統括' },
  { row: 'P24', text: '門 ①②③⑤⑥⑦ 通過(ピッチ角 20.58°)・④ は円盤の軸比の N 依存が ±10% 超', src: 'ss', ref: 'shapeToySpiral' },
  { row: 'P24', text: 'CR・OLR・ILR', src: 'phys', ref: '〔第330便 — 統括' },
  { row: 'P25', text: '力の純関数は検査済み・棒の形の門は無い', src: 'ss', ref: 'axisBarStill' },
  { row: 'P26', text: '束縛 93.3%・視線分散との量の対応は未確定', src: 'ss', ref: 'tuc47' },
  { row: 'P27', text: '赤方偏移が規定 a(t) と相対 1e-6 未満', src: 'ss', ref: 'boxcomoving' },
  { row: 'P27', text: '2 つの読みが解析値と 1% 内', src: 'ss', ref: 'probeH' },
  { row: 'P27', text: '追随は a でなく √a(比 0.9996)', src: 'ss', ref: 'boxexpand' },
  { row: 'P27', text: 'δ² 5.4 倍', src: 'ss', ref: 'cosmicweb' },
  { row: 'P28', text: '正対照の位相差が解析式どおり', src: 'ss', ref: 'mmPhaseToy' },
  { row: 'P28', text: 'ν_D = ν₀', src: 'phys', ref: '〔第250便b — ' },
  { row: 'P29', text: '0/2/1/16', src: 'file', ref: 'docs/CALIBRATION_ISSUES.md' },
  { row: 'P30', text: '4 回の放出と帳簿の閉じ', src: 'ss', ref: 'whiteDwarfDFM' },
  { row: 'P30', text: '1 回の放出と帳簿の閉じ', src: 'ss', ref: 'envelopeShedDFM' },
  { row: 'P31', text: '反転後の復帰と摩擦での不復帰が門を通過', src: 'ss', ref: 'echo' },
  { row: 'P32', text: '焦点は合体前の基準状態の転写・波形の照合ではない', src: 'ss', ref: 'gw150914' },
  { row: 'P32', text: '強さ η が純関数とエンジンで一致', src: 'ss', ref: 'gw150914SpinDipole' },
];

// 書かない語・禁句・裸の係数記号・速度の数の字列(文書・節・AI_SPEC・CHANGELOG の行で共通)
export function wordAudit331e(name, text, opts = {}) {
  const bad = [];
  const tx = String(text || '');
  for (const w of NG_WORDS_331E) if (tx.indexOf(w) >= 0) bad.push(name + ' に禁句(' + w.length + ' 字)');
  if (!opts.noNot) { const s = tx.replace(/「[^」]*」/g, ''); for (const re of NOT_WORDS_331E) if (re.test(s)) bad.push(name + ' に書かない語 ' + re.source); }
  const nb = tx.replace(/`[^`\n]*`/g, '');
  const k = (nb.match(new RegExp('\\u03ba(?!_D)', 'g')) || []).length;
  if (k) bad.push(name + ' に裸の係数記号 ' + k + ' 字(κ_D 以外はコードの書式で)');
  if (/\d\s*km\/s/.test(tx)) bad.push(name + ' に速度の数の字列');
  return bad;
}

const near331e = (text, v, fixed) => {
  const m = /[+\-−]?\d+(?:\.\d+)?/.exec(String(text).replace(/^=\s*/, ''));
  if (!m || !Number.isFinite(v)) return false;
  const x = Number(m[0].replace('−', '-'));
  return Math.abs(x - v) <= 0.5 * Math.pow(10, -fixed) + 1e-12;
};

// ── 照合 ──
// inp = { md, html, ssMd, ph, qaSrc, exists(rel) → bool, readText(rel) → string|null, readJson(rel) → obj|null, transcripts? }
export function checkPhenoDoc331e(inp) {
  const bad = [], cases = [];
  const P = parsePhenoDoc331e(inp.md);
  for (const e of P.errors) bad.push('① ' + e);
  const rows = P.rows;
  // ① 形
  const ids = rows.map((r) => r.id);
  const seq = ids.every((id, i) => id === 'P' + String(i + 1).padStart(2, '0'));
  if (!rows.length || !seq) bad.push('① 行の番号が P01 から連番でない: ' + ids.join(','));
  for (const r of rows) {
    const miss = FIELDS_331E.filter((f) => !(f in r.fields));
    if (miss.length) bad.push('① ' + r.id + ' に欄が無い: ' + miss.join('・'));
    else if (JSON.stringify(r.order.filter((f) => FIELDS_331E.includes(f))) !== JSON.stringify(FIELDS_331E)) bad.push('① ' + r.id + ' の欄の並び');
  }
  cases.push(`① 行 ${rows.length}(P01〜 連番 ${seq ? '真' : '偽'})・欄 ${FIELDS_331E.length}`);
  // ② 語彙
  for (const r of rows) {
    if (!STAGES_331E.includes(r.stage)) bad.push('② ' + r.id + ' の段階「' + r.stage + '」が語彙の外');
    if (!MECHS_331E.includes(r.mech)) bad.push('② ' + r.id + ' の仕組み「' + r.mech + '」が語彙の外');
    if (!LEDGERS_331E.includes(r.ledger)) bad.push('② ' + r.id + ' の帳簿「' + r.ledger + '」が語彙の外');
  }
  // ③ 件数の表と要約の表
  const tally = (k, vocab) => { const m = {}; for (const v of vocab) m[v] = rows.filter((r) => r[k] === v).map((r) => r.id); return m; };
  const tS = tally('stage', STAGES_331E), tM = tally('mech', MECHS_331E), tL = tally('ledger', LEDGERS_331E);
  const cmpTable = (nm, tb, t, withIds) => {
    if (!tb) { bad.push('③ ' + nm + 'の件数の表が無い'); return; }
    for (const [v, list] of Object.entries(t)) {
      const c = tb[v];
      if (!c) { bad.push('③ ' + nm + 'の件数の表に「' + v + '」の行が無い'); continue; }
      if (c.n !== list.length) bad.push('③ ' + nm + '「' + v + '」の件数 ' + c.n + ' ≠ 行の数 ' + list.length);
      if (withIds && JSON.stringify(c.ids) !== JSON.stringify(list)) bad.push('③ ' + nm + '「' + v + '」の番号 ' + c.ids.join('・') + ' ≠ ' + list.join('・'));
    }
    const extra = Object.keys(tb).filter((v) => !(v in t) && v !== '計');
    if (extra.length) bad.push('③ ' + nm + 'の件数の表に語彙の外の行: ' + extra.join('・'));
    if (tb['計'] && tb['計'].n !== rows.length) bad.push('③ ' + nm + 'の計 ' + tb['計'].n + ' ≠ ' + rows.length);
  };
  cmpTable('段階', P.tables.stage, tS, true); cmpTable('仕組み', P.tables.mech, tM, false); cmpTable('帳簿', P.tables.ledger, tL, false);
  if (P.tables.stage && !P.tables.stage['計']) bad.push('③ 段階の件数の表に計が無い');
  if (P.summary.length !== rows.length) bad.push('③ 要約の表の行 ' + P.summary.length + ' ≠ ' + rows.length);
  for (const r of rows) {
    const s = P.summary.find((z) => z.id === r.id);
    if (!s) { bad.push('③ 要約の表に ' + r.id + ' が無い'); continue; }
    for (const k of ['name', 'stage', 'mech', 'ledger']) if (s[k] !== r[k]) bad.push('③ ' + r.id + ' の要約の ' + k + '「' + s[k] + '」≠ 行「' + r[k] + '」');
  }
  cases.push('③ 段階 ' + STAGES_331E.map((v) => v + ' ' + tS[v].length).join('・') + ' / 仕組み ' + MECHS_331E.map((v) => v + ' ' + tM[v].length).join('・')
    + ' / 帳簿 ' + LEDGERS_331E.map((v) => v + ' ' + tL[v].length).join('・'));
  // ④ 証拠の実在
  const SS = sampleStatusRows331e(inp.ssMd);
  let nS = 0, nP = 0, nH = 0, nQ = 0;
  for (const r of rows) {
    if (!r.samples.length && !r.paths.length && !r.secs.length) bad.push('④ ' + r.id + ' の証拠が空');
    for (const s of r.samples) {
      nS++;
      if (String(inp.html || '').indexOf('id:"' + s.id + '"') < 0) bad.push('④ ' + r.id + ' の本 ' + s.id + ' が html に無い');
      const z = SS.get(s.id);
      if (!z) bad.push('④ ' + r.id + ' の本 ' + s.id + ' が SAMPLE_STATUS の掲載の行に無い');
      else if (z.st !== s.st) bad.push('④ ' + r.id + ' の本 ' + s.id + ' の状況「' + s.st + '」≠ SAMPLE_STATUS「' + z.st + '」');
    }
    for (const p of r.paths) { nP++; if (!inp.exists(p)) bad.push('④ ' + r.id + ' のパス ' + p + ' が無い'); }
    for (const h of r.secs) { nH++; if (!physSection331e(inp.ph, h.head)) bad.push('④ ' + r.id + ' の節 ' + h.ref + ' の見出しが PHYSICS に無い'); }
    for (const k of r.qaKeys) { nQ++; if (String(inp.qaSrc || '').indexOf("add('" + k + "'") < 0) bad.push('④ ' + r.id + ' の QA の鍵 ' + k + ' が qa.mjs に無い'); }
  }
  cases.push(`④ 証拠: 本 ${nS}(html に在位・SAMPLE_STATUS の状況と同じ語)・パス ${nP}・節 ${nH}(見出しの行)・QA の鍵 ${nQ}`);
  // ⑤ 段階と状況の対応
  let nNeed = 0;
  for (const r of rows) {
    const need = needsReason331e(r.stage, r.samples);
    if (need) nNeed++;
    if (need && !r.reason) bad.push('⑤ ' + r.id + '(' + r.stage + ')が引く本の状況 ' + r.samples.map((s) => s.id + ' ' + s.st).join('・') + ' に食い違いの理由が無い');
    if (!need && r.reason) bad.push('⑤ ' + r.id + ' は対応が外れていないのに食い違いの理由がある');
  }
  cases.push(`⑤ 段階と SAMPLE_STATUS の状況の対応が外れる行 ${nNeed}(全部に理由の欄)`);
  // ⑥ 主な数の転記
  const TR = inp.transcripts || TRANSCRIPTS_331E;
  const jsonCache = new Map();
  let nT = 0;
  for (const t of TR) {
    nT++;
    const r = rows.find((z) => z.id === t.row);
    if (!r) { bad.push('⑥ 転記の行 ' + t.row + ' が無い'); continue; }
    if (r.text.indexOf(t.text) < 0) bad.push('⑥ ' + t.row + ' に「' + t.text + '」が無い');
    const want = t.want || t.text;
    if (t.src === 'ss') { const z = SS.get(t.ref); if (!z || z.line.indexOf(want) < 0) bad.push('⑥ ' + t.row + ' の「' + want + '」が SAMPLE_STATUS の ' + t.ref + ' の行に無い'); }
    else if (t.src === 'phys') { const s = physSection331e(inp.ph, t.ref); if (!s || s.indexOf(want) < 0) bad.push('⑥ ' + t.row + ' の「' + want + '」が PHYSICS ' + t.ref.trim() + '〕の本文に無い'); }
    else if (t.src === 'file') { const s = inp.readText(t.ref); if (!s || s.indexOf(want) < 0) bad.push('⑥ ' + t.row + ' の「' + want + '」が ' + t.ref + ' に無い'); }
    else if (t.src === 'json') {
      if (!jsonCache.has(t.ref)) jsonCache.set(t.ref, inp.readJson(t.ref));
      const J = jsonCache.get(t.ref); let v = NaN;
      try { v = J ? t.val(J) : NaN; } catch (e) { v = NaN; }
      if (!near331e(t.text, v, t.fixed)) bad.push('⑥ ' + t.row + ' の「' + t.text + '」が正本 ' + t.ref + ' の値 ' + v + '(' + t.fixed + ' 桁)と違う');
    } else bad.push('⑥ 転記の出典の型 ' + t.src);
  }
  const perRow = rows.map((r) => TR.filter((t) => t.row === r.id).length);
  const noT = rows.filter((r, i) => !perRow[i] && trimV(r.fields['主な数']) !== '—').map((r) => r.id);
  if (noT.length) bad.push('⑥ 主な数があるのに転記の表に項が無い行: ' + noT.join(','));
  cases.push(`⑥ 主な数の転記 ${nT} 項(節 ${TR.filter((t) => t.src === 'phys').length}・SAMPLE_STATUS ${TR.filter((t) => t.src === 'ss').length}・正本 ${TR.filter((t) => t.src === 'json').length}・文書 ${TR.filter((t) => t.src === 'file').length})`);
  // ⑦ 書かない語・禁句・裸の係数記号・速度の数の字列
  const wa = wordAudit331e('文書', inp.md);
  for (const b of wa) bad.push('⑦ ' + b);
  cases.push('⑦ 書かない語・禁句・裸の係数記号・速度の数の字列 ' + wa.length);
  return { ok: bad.length === 0, bad, cases, parsed: P, tally: { stage: tS, mech: tM, ledger: tL } };
}

// ── 照合の規則の自己試験(缶詰の小さい文書と出典 —— 良い形は通り、壊した形は違反の型で落ちる)──
export function selfTest331e() {
  const md0 = [
    '# t', '## 段階ごとの件数', '| 段階 | 件数 | 現象 |', '|---|---|---|', '| 門の内 | 1 | P01 |', '| 一部 | 0 | |', '| 残差 | 1 | P02 |', '| 扱っていない | 0 | |', '| 計 | 2 | |', '',
    '| 仕組み | 件数 |', '|---|---|', '| 実装(在位) | 1 |', '| 実装(opt-in) | 0 |', '| 診断 | 1 |', '| 宣言(未接続) | 0 |', '| なし | 0 |', '',
    '| 帳簿 | 件数 |', '|---|---|', '| 閉じた | 0 |', '| 未 | 0 |', '| 該当なし | 2 |', '',
    '## 一覧(要約)', '| # | 現象 | 段階 | 仕組み | 帳簿 | 主な本 |', '|---|---|---|---|---|---|',
    '| P01 | 甲 | 門の内 | 実装(在位) | 該当なし | `aaa` |', '| P02 | 乙 | 残差 | 診断 | 該当なし | — |', '',
    '## 各現象', '### P01 甲', '- **段階**: 門の内', '- **仕組み**: 実装(在位)', '- **帳簿**: 該当なし', '- **物差し**: x', '- **主な数**: 比 1.25 が門の内',
    '- **証拠**: 本 `aaa`(達)/正本 `tests/out/x.json`/節 〔第900便a〕/QA `behavior.aaa`', '- **残っていること・次の段**: —', '- **第331便の調べ**: —', '- **食い違いの理由**: —',
    '### P02 乙', '- **段階**: 残差', '- **仕組み**: 診断', '- **帳簿**: 該当なし', '- **物差し**: y', '- **主な数**: 値 3.14 と 2.72',
    '- **証拠**: 正本 `tests/out/x.json`/節 〔第901便 — 統括〕', '- **残っていること・次の段**: —', '- **第331便の調べ**: —', '- **食い違いの理由**: —', ''].join('\n');
  const src = {
    html: 'const P=[{id:"aaa"},{id:"bbb"}];',
    ssMd: '| 🅰 | `aaa` | 甲 | 目的 | 達・比 1.25 が門の内(根拠: x) | 較正対象外 |\n| 🅱 | `bbb` | 乙 | 目的 | 部分・y | 較正対象外 |',
    ph: '前\n〔第900便a — 甲の節〕\n本文 a\n〔第901便 — 統括: 乙〕\n値 3.14 と 2.72 の記録\n## 7. 論文',
    qaSrc: "add('behavior.aaa', true, '');",
    exists: (p) => p === 'tests/out/x.json', readText: () => null, readJson: () => ({ v: 1.2501 }),
    transcripts: [{ row: 'P01', text: '比 1.25 が門の内', src: 'ss', ref: 'aaa' }, { row: 'P01', text: '1.25', src: 'json', ref: 'tests/out/x.json', val: (J) => J.v, fixed: 2 },
      { row: 'P02', text: '3.14 と 2.72', src: 'phys', ref: '〔第901便 — 統括' }],
  };
  const run = (md, over) => checkPhenoDoc331e(Object.assign({}, src, { md }, over || {}));
  const cases = [], bad = [];
  const g = run(md0);
  if (!g.ok) bad.push('良い形が落ちた: ' + g.bad.slice(0, 3).join(' / '));
  cases.push('良い形 ' + (g.ok ? '通る' : '落ちる'));
  const MUT = [
    ['段階の語彙の外', (m) => m.replace('- **段階**: 残差', '- **段階**: 解けた'), /^② P02 の段階/],
    ['件数の表の数', (m) => m.replace('| 残差 | 1 | P02 |', '| 残差 | 2 | P02 |'), /^③ 段階「残差」の件数/],
    ['要約と行の段階', (m) => m.replace('| P02 | 乙 | 残差 |', '| P02 | 乙 | 一部 |'), /^③ P02 の要約の stage/],
    ['html に無い本', (m) => m.replace('本 `aaa`(達)', '本 `zzz`(達)'), /^④ P01 の本 zzz が html に無い/],
    ['状況の語の違い', (m) => m.replace('本 `aaa`(達)', '本 `aaa`(部分)'), /^④ P01 の本 aaa の状況/],
    ['無い正本', (m) => m.replace('正本 `tests/out/x.json`/節 〔第900便a〕', '正本 `tests/out/y.json`/節 〔第900便a〕'), /^④ P01 のパス tests\/out\/y\.json/],
    ['無い節(本文の参照だけ)', (m) => m.replace('〔第900便a〕', '〔第902便b〕'), /^④ P01 の節 〔第902便b〕/],
    ['無い QA の鍵', (m) => m.replace('`behavior.aaa`', '`behavior.zzz`'), /^④ P01 の QA の鍵 behavior\.zzz/],
    ['理由の欄が要る', (m) => m.replace('- **段階**: 残差', '- **段階**: 扱っていない').replace('正本 `tests/out/x.json`/節 〔第901便 — 統括〕', '本 `bbb`(部分)/節 〔第901便 — 統括〕')
      .replace('| 残差 | 1 | P02 |', '| 残差 | 0 | |').replace('| 扱っていない | 0 | |', '| 扱っていない | 1 | P02 |').replace('| P02 | 乙 | 残差 |', '| P02 | 乙 | 扱っていない |'), /^⑤ P02/],
    ['転記の数の違い', (m) => m.replace('値 3.14 と 2.72', '値 3.15 と 2.72'), /^⑥ P02 に「3\.14 と 2\.72」が無い/],
    ['裸の係数記号', (m) => m.replace('- **物差し**: y', '- **物差し**: ' + String.fromCharCode(0x3ba) + ' の値'), /^⑦ 文書 に裸の係数記号/],
    ['書かない語', (m) => m.replace('- **物差し**: y', '- **物差し**: 機構を同定した'), /^⑦ 文書 に書かない語/],
  ];
  for (const [nm, f, re] of MUT) {
    const r = run(f(md0));
    const hit = r.bad.some((b) => re.test(b));
    if (r.ok || !hit) bad.push('変異「' + nm + '」が期待の違反で落ちない: ' + (r.bad[0] || '通った'));
    cases.push(nm + ' → ' + (hit ? '落ちる' : '落ちない'));
  }
  const rj = run(md0, { readJson: () => ({ v: 1.30 }) });
  if (rj.ok || !rj.bad.some((b) => /^⑥ P01 の「1\.25」が正本/.test(b))) bad.push('変異「正本の値の違い」が落ちない');
  cases.push('正本の値の違い → ' + (rj.ok ? '落ちない' : '落ちる'));
  const rp = run(md0, { ph: src.ph.replace('\n〔第900便a — 甲の節〕', '\n本文の参照〔第900便a — 甲の節〕の行') });
  if (rp.ok || !rp.bad.some((b) => /^④ P01 の節 〔第900便a〕/.test(b))) bad.push('変異「見出しの行でない参照だけ」が落ちない');
  cases.push('見出しの行でない参照だけ → ' + (rp.ok ? '落ちない' : '落ちる'));
  return { ok: bad.length === 0, cases, bad };
}
