// 第270便a(第60報 W1・AE9): **走行の停止条件を「步数上限と必要近点数の宣言」にする純関数**。
//
// ■ 何を直すか(第257便d 以来の穴)
//   `tests/exp-w249b-calaudit.mjs` は 1 段あたりの走行長を
//       budgetSteps = **実測した步/秒** × 時間予算(既定 80 s)
//   から決めていた。つまり **走行長が計算機の速さで変わる**。重いサンプルの上限
//   (`hardCap = budgetSteps × 2`)も同じ量から作られていたので、
//   **同じコード・同じ入力でも機種が違えば近点の本数が変わり、判定が 転↔否 で動く**
//   (🌘 earthMoonRealKF1 の 26 近点は 40,000,000 步まで走れたときの数である)。
//   時間予算は**資源の話**であって精度条件ではない。数値の性質(刻み・近点数)と混ぜてはならない。
//
// ■ 新しい停止条件(**宣言**であって自動判定ではない)
//   ① **步数上限** `maxSteps` …… 系の大きさ(実行時 n)の階級ごとに宣言する。階級で足りない系は
//      **preset ごとに宣言表へ書く**(推測で埋めない —— 宣言の無い重い系は器を止める)。
//   ② **必要近点数** `needPeriastra` …… その段の測定が成立するために要る近点の本数。既定は
//      第252便b の近点窓 20。換算判定(第270便a の AD8)を持つ系は fit 窓の本数を宣言する。
//   ③ 走行長は **min(宣言した步数上限, 60 公転ぶんの步数)** で決まる。60 公転ぶんは
//      **t=0 の接触要素**(刻みと質量だけで決まる量)から作るので、**機種に依存しない**。
//   ④ 壁時計は **資源上限**にだけ残す。超えた段は `resource-limit` で **unmeasured** にし、
//      **途中までの軌道を最終判定へ流さない**(打ち切った軌道から作った値を判定に使わない)。
//
// ■ 既定値をどう決めたか(**実測して決めた**)
//   基点 f6c19b4 の走行(`tests/data-w270a-stoprule-base.json` = 当時の JSON からの機械抽出)を
//   読み、**同じ步数・同じ近点数が埋まる**ように逆算した。階級の上限 40,000,000 / 20,000,000 は
//   第249便b の `hardCap` がもともと持っていた宣言値そのもので、重い 4 系の値は基点の走行が
//   到達した步数である(`PRESET_MAX_STEPS` の各行にその由来を書いた)。
//   **これは「この步数で収束する」という主張ではない** —— 走行長の宣言であって精度条件ではない。
//
// ■ このモジュールが言わないこと
//   「停止条件を入れたので判定が確定した」「步数を宣言したので収束した」。
//   停止条件は**どこで止めるか**を機種に依らず決めるだけである。

// ---------------------------------------------------------------- 第271便a(第61報・AF3)
// ■ **停止条件を「版つきの既定規約」として恒久化する**
//   第270便a では停止条件は「この便で入れた規則」だった。本便でそれを**版つきの規約**にする ——
//   規約の中身(步数上限の階級表・preset 宣言・必要近点数・資源上限・未完走の語彙)は
//   `STOP_RULE_SPEC` に 1 か所へまとめ、**版を上げずに中身を変えられないように QA で機械固定する**
//   (`docs.stopRuleVersion`)。**全系一律の步数(668,676 步)にはしない** —— 系ごとに 60 公転ぶんの
//   步数は違うので、一律の步数は「同じ窓を見ている」ことを意味しない。
//   版の履歴:
//     ・`w270a-1`(第270便a)…… 初版。階級 40e6/20e6・preset 宣言 4 本・必要近点 20(📡 58)。
//     ・`w271a-1`(第271便a)…… **preset 宣言を 5 本へ**(❄️ plutoCharonReal を足した ——
//       AF2 の 3 段登録で dt/2・dt/4 が階級上限 40e6 に切られ、**3 段で近点の本数が揃わない**
//       ことを先に計算で確かめたうえで、60 公転ぶんの步数を宣言表に書いた)。
//   **これは「この步数で収束する」という主張ではない**(走行長の宣言であって精度条件ではない)。
//     ・`w272a-1`(第272便a・AG27)…… **照合の基点を 743ad9b へ切り直し、宣言例外を空にした**。
//       階級上限・preset 宣言表・必要近点数・資源上限は **1 つも変えていない** —— 変えたのは
//       「何と突き合わせるか」だけである。**旧基点(f6c19b4)は履歴として残す**。
export const STOP_RULE_VERSION = 'w272a-1';
export const DT_BASE = 0.016;            // アプリ既定の刻み(beta/index.html の const DT)
export const ORB_MAX_DEFAULT = 60;       // 直接法で数える上限公転数(第249便b の宣言)
export const PERI_WINDOW_DEFAULT = 20;   // 第252便b の近点窓(19 区間)

// ---------------------------------------------------------------- ① 步数上限の宣言
// 実行時 n の階級ごとの上限。**第249便b の `hardCap` の宣言値をそのまま引き継いだ**
// (n≤3 → 40,000,000 步 / n≤12 → 20,000,000 步)。刻みを細かくしても**この上限は動かない**
// (基点と同じ挙動 —— 上限は「1 段に許す步数」であって物理時間ではない)。
export const CLASS_MAX_STEPS = [
  { maxN: 3, maxSteps: 40000000, why: '第249便b の hardCap(n≤3)の宣言値' },
  { maxN: 12, maxSteps: 20000000, why: '第249便b の hardCap(n≤12)の宣言値' },
];
// 階級で決められない系(実行時 n>12 の多体・環)は **preset ごとに宣言する**。
// 値は基点 f6c19b4 の走行が実際に走った步数である(= 同じ近点数が埋まる)。
// **刻みに反比例して倍にする**(同じ物理時間を覆うため —— これらの系は基点では dt 段しか
// 走っていないので、dt/2・dt/4 を走らせるときに同じ窓を覆えるようにする宣言である)。
export const PRESET_MAX_STEPS = {
  solarInner: { maxSteps: 866426, scalesWithDt: true,
    why: '基点 f6c19b4 の 🌞 dt 段が走った步数(近点 9/5/3/2・20 近点窓は未充足のまま)' },
  uranusReal: { maxSteps: 1075028, scalesWithDt: true,
    why: '基点 f6c19b4 の 💠 dt 段が走った步数(近点 14/7/4/2/1)' },
  saturnRingReal: { maxSteps: 2042988, scalesWithDt: true,
    why: '基点 f6c19b4 の 💍 dt 段が走った步数(近点 63/36/3)' },
  saturnRingRealKF1: { maxSteps: 254730, scalesWithDt: true,
    why: '基点 f6c19b4 の 💿 dt 段が走った步数(近点 13/2/1)' },
  // 第271便a(AF2): ❄️ **カロンを 3 段登録する前に步数を計算した**。dt 段は 1 公転 344,908 步で、
  // 60 公転 = 20,694,498 步(階級上限 40e6 の内側)。ところが **dt/2 は 41,388,996 步・
  // dt/4 は 82,777,992 步**で、どちらも階級上限 40e6 を**超える** —— そのまま 3 段を走らせると
  // h/h2/h4 で近点の本数が 59/57/28 本になり、**3 段の fit 窓が揃わない**(AD4 の窓充足を満たさない)。
  // したがって **60 公転ぶんの步数を preset 宣言として書く**(階級上限を全系で上げるのではない)。
  // **上限を上げたのではなく、この 1 系の走行長を宣言した**という意味である。
  plutoCharonReal: { maxSteps: 20694498, scalesWithDt: true,
    why: '第271便a(AF2): ❄️ の 60 公転ぶんの步数(dt 段 1 公転 344,908 步 × 60)。'
      + 'dt/2・dt/4 は刻みに反比例して 41,388,996 / 82,777,992 步 —— '
      + '**3 段で同じ 60 公転の窓を覆うための宣言**である(階級上限 40e6 では h/4 が 29 公転で切れる)' },
};

// ---------------------------------------------------------------- ② 必要近点数の宣言
// 既定は第252便b の近点窓(20)。**judged window が違う系はここに書く**(自動判定はしない)。
export const PRESET_NEED_PERIASTRA = {
  // 第270便a(AD8): 📡 の換算判定は**傾き fit と同じ近点集合**(58 近点・57 区間)の近点間周期で
  // 割る。したがって 58 近点が埋まらない段は**換算不能**であり、判定へ流さない。
  saturnZonalD68: { needPeriastra: 58, why: '第270便a(AD8)の換算判定の fit 窓(58 近点・57 区間)' },
};

// ---------------------------------------------------------------- ④ 壁時計(資源上限)
// **判定条件ではない**。超えた段は `resource-limit` で unmeasured にする(途中軌道を流さない)。
// 既定 900 s は基点の最長段(🌞 487.0 s)の約 1.8 倍で、**現行の走行では 1 段も超えない**
// (超えないことを器が数で記録する —— 「効いていない上限」であることを隠さない)。
export const WALL_CEILING_SEC_DEFAULT = 900;

// ---------------------------------------------------------------- 第271便a(第61報・AF3)
// **既定規約の版つき宣言**(1 か所)。QA `docs.stopRuleVersion` がこの表と実際の定数の一致、
// および文書(docs/CALIBRATION_VERDICT_v1.44.md)に同じ版が書かれていることを機械固定する。
// **中身を変えるときは版を上げる**(版を上げずに宣言を変えたら QA が落ちる)。
export const STOP_RULE_SPEC = {
  version: STOP_RULE_VERSION,
  rule: '1 段の步数 = min(**宣言した步数上限**, 60 公転ぶんの步数)。60 公転ぶんは t=0 の接触要素'
    + '(刻みと質量だけで決まる量)から作る —— **步/秒も壁時計も入らない**。',
  classMaxSteps: CLASS_MAX_STEPS,
  presetMaxSteps: PRESET_MAX_STEPS,
  presetNeedPeriastra: PRESET_NEED_PERIASTRA,
  needPeriastraDefault: PERI_WINDOW_DEFAULT,
  orbMaxDefault: ORB_MAX_DEFAULT,
  wallCeilingSec: WALL_CEILING_SEC_DEFAULT,
  wallClock: '壁時計は**資源上限だけ**である(判定条件ではない)。超えた段は `resource-limit` で '
    + '**unmeasured** にし、途中までの軌道を最終判定へ流さない。',
  unmeasuredVocabulary: ['max-steps', 'window', 'resource-limit'],
  notUniform: '**全系一律の步数(例 668,676 步)にはしない** —— 系ごとに 60 公転ぶんの步数は違うので、'
    + '一律の步数は「同じ窓を見ている」ことを意味しない。',
  history: [
    { version: 'w270a-1', wave: '第270便a(AE9)', presetMaxSteps: 4,
      note: '初版。階級 40e6(n≤3)/20e6(n≤12)・preset 宣言 4 本(🌞💠💍💿)・必要近点 20(📡 58)。' },
    { version: 'w271a-1', wave: '第271便a(AF3・AF2)', presetMaxSteps: 5,
      note: '❄️ plutoCharonReal を preset 宣言へ(3 段で同じ 60 公転の窓を覆うため)。'
        + '階級上限・必要近点の既定・資源上限は**変えていない**。' },
    { version: 'w272a-1', wave: '第272便a(AG27)', presetMaxSteps: 5,
      note: '**照合の基点を 743ad9b へ切り直し、宣言例外(BASE_REPLAY_EXCEPTIONS)を空にした**。'
        + '階級上限 40e6/20e6・preset 宣言 5 本・必要近点 20(📡 58)・資源上限 900 s は'
        + '**1 つも変えていない**。第272便aの条件つき h/8(AG1)はこの規約の'
        + '`scalesWithDt` をそのまま使う(❄️ は 20,694,498 × 8 = 165,555,984 步)—— '
        + '**階級上限を上げていない**ので、上限を超える系の h/8 は**未走行**である。' },
  ],
  says: '停止条件は**どこで止めるか**を機種に依らず決めるだけである —— '
    + '「停止条件を入れたので判定が確定した」「步数を宣言したので収束した」とは言わない。',
};

// ---------------------------------------------------------------- 第272便a(第62報・AG27)
// **基点との照合で「違ってよい段」の宣言**(自動判定ではない)。
//
// 第271便aはここに 9 段を宣言していた(🩺🪀 J1946 の 8 段 = 第270便cの AD9 で導出 a が
// 動いた分、❄️ の dt/2 1 段 = AF2 の步数宣言)。どちらも**基点が f6c19b4 (AD9 の前)だったから**である。
// 例外が積み上がると「宣言の無い差を 1 段でも落とす」という照合の意味が薄れるので、
// **基点そのものを 743ad9b へ切り直した**(`tests/exp-w272a-stoprulebase.mjs`)。
// その結果、**宣言例外は 0 段である**。
//
// **差が「無かったこと」になるのではない**—— 旧基点(f6c19b4・84 段)は
// `tests/data-w270a-stoprule-base-f6c19b4.json` に残してあり、何がなぜ動いたかは
// docs/CALIBRATION_VERDICT_v1.44.md §5.17.4 と下の `history` に残る。
// h/8 の段(第272便a・AG1)は基点に無い新しい段なので、照合では **newStages** として数える
//(**差**ではない —— 基点に対応する段が無い)。
// 第282便a(原仮定者の裁定(第72報)③): ✴️💫 の DFM 版で質量補正 f を廃して f=1 に固定した(m=baseMass)。
// 質量が観測質量そのもの(+0.022% / +0.038% 分だけ軽く)になったので 1 公転の步数が僅かに伸び、
// 步数上限(60 公転ぶん)と走った步数が基点 743ad9b と違う。**近点数は同じ 60**。判定量は f=1 の宣言どおり動いた
//(較正ではない —— 質量を観測値へ戻した帰結)。基点は切り直さない(切り直しは次に基点が動く便で)。
export const BASE_REPLAY_EXCEPTIONS = [
  ...['alphaCenABDFM', 'siriusABDFM'].flatMap((id) => ['dt', 'dt/2', 'dt/4'].map((tag) => ({ id, tag, since: 'w282a',
    why: '第282便a(原仮定者の裁定(第72報)③)で f=1 に固定 —— 質量が観測値そのものになり 1 公転の步数が僅かに変わった(近点数 60 は同じ)' }))),
];
// 旧例外の履歴(**削除していない** —— 何を例外にしていたかは資産である)。
export const BASE_REPLAY_EXCEPTIONS_HISTORY = [
  { version: 'w271a-1', base: 'f6c19b4', n: 9,
    ids: ['psrJ1946DFM|dt', 'psrJ1946DFM|dt/2', 'psrJ1946DFM|dt/4',
      'psrJ1946PN|dt', 'psrJ1946PN|dt/2',
      'psrJ1946CF|dt', 'psrJ1946CF|dt/2', 'psrJ1946CF|dt/4',
      'plutoCharonReal|dt/2'],
    why: '第270便c(AD9)の採用レコード一組化で導出 a が動き、1 公転の步数が変わった'
      + '(60 公転ぶんの步数 1,040,661 → 1,040,650 步)。❄️ は第271便a(AF2)で步数上限を'
      + '階級から preset 宣言へ移した。**判定量は動いていない**。' },
];

export function declaredMaxSteps({ id, n, dt = DT_BASE, dtBase = DT_BASE }) {
  const p = PRESET_MAX_STEPS[id] || null;
  if (p) {
    const scale = p.scalesWithDt ? (dtBase / dt) : 1;
    return { maxSteps: Math.round(p.maxSteps * scale), source: 'preset', why: p.why, scale };
  }
  for (const c of CLASS_MAX_STEPS) {
    if (Number.isFinite(n) && n <= c.maxN)
      return { maxSteps: c.maxSteps, source: 'class(n<=' + c.maxN + ')', why: c.why, scale: 1 };
  }
  // **推測で埋めない**: 階級にも宣言表にも無い系は、宣言を書くまで走らせない。
  throw new Error('[w270a] 步数上限が宣言されていない(id=' + id + ' / n=' + n + ')'
    + ' —— 実行時 n>' + CLASS_MAX_STEPS[CLASS_MAX_STEPS.length - 1].maxN
    + ' の系は tests/lib-w270a-stoprule.mjs の PRESET_MAX_STEPS に宣言すること(推測で埋めない)');
}

export function declaredNeedPeriastra(id) {
  const p = PRESET_NEED_PERIASTRA[id] || null;
  return p ? { needPeriastra: p.needPeriastra, why: p.why, source: 'preset' }
    : { needPeriastra: PERI_WINDOW_DEFAULT, source: 'default',
      why: '第252便b の近点窓(最初の ' + PERI_WINDOW_DEFAULT + ' 近点 = '
        + (PERI_WINDOW_DEFAULT - 1) + ' 区間)' };
}

// 1 段の停止条件を作る。**入力に「步/秒」も「秒」も入らない**(= 機種に依存しない)。
//   stepsPerOrbit … t=0 の接触要素から作った「1 公転の步数」の配列(対象ごと)
export function stopRuleFor({ id, n, dt = DT_BASE, dtBase = DT_BASE,
  stepsPerOrbit = [], orbMax = ORB_MAX_DEFAULT }) {
  const cap = declaredMaxSteps({ id, n, dt, dtBase });
  const need = declaredNeedPeriastra(id);
  const finite = (stepsPerOrbit || []).filter((s) => Number.isFinite(s) && s > 0);
  const wantSteps = finite.length ? Math.max(...finite.map((s) => s * orbMax)) : 1;
  const floorSteps = finite.length ? 5 * Math.max(...finite.filter((s) => s <= cap.maxSteps), 0) : 0;
  const maxSteps = Math.max(2000, Math.round(Math.min(cap.maxSteps, wantSteps)));
  return {
    version: STOP_RULE_VERSION,
    id, n, dt, orbMax,
    declaredMaxSteps: cap.maxSteps, maxStepsSource: cap.source, maxStepsWhy: cap.why,
    needPeriastra: need.needPeriastra, needPeriastraSource: need.source, needPeriastraWhy: need.why,
    wantSteps: Math.round(wantSteps), floorSteps: Math.round(floorSteps),
    maxSteps,
    boundBy: (maxSteps >= cap.maxSteps) ? 'declared-max-steps' : 'orbit-window',
    floorSatisfied: (floorSteps === 0) ? null : (maxSteps >= floorSteps),
    rule: '步数 = min(**宣言した步数上限**, ' + orbMax + ' 公転ぶんの步数)。'
      + '**步/秒も壁時計も入らない**(第270便a・AE9 —— 機種で走行長が変わらない)。'
      + '近点は **' + need.needPeriastra + ' 本**要る(不足は未測定であって「否」ではない)。',
  };
}

// 段が終わったあとの判定。**壁時計はここでだけ効く**(資源上限)。
//   periFound … その段で検出できた近点の本数(対象ごと配列 or 数)
export function stopDecision({ stepsRun, maxSteps, periFound = [], needPeriastra = PERI_WINDOW_DEFAULT,
  wallSec = null, wallCeilingSec = WALL_CEILING_SEC_DEFAULT, boundBy = null }) {
  const arr = Array.isArray(periFound) ? periFound : [periFound];
  const nums = arr.filter((z) => Number.isFinite(z));
  const minPeri = nums.length ? Math.min(...nums) : null;
  const periastraOk = (minPeri === null) ? false : (minPeri >= needPeriastra);
  const stepsHit = Number.isFinite(stepsRun) && Number.isFinite(maxSteps) && stepsRun >= maxSteps;
  const resourceExceeded = Number.isFinite(wallSec) && Number.isFinite(wallCeilingSec)
    && wallSec > wallCeilingSec;
  // **どこで止まったか**は 2 つを分ける必要がある:
  //   ・`declared-max-steps` …… **宣言した步数上限**が走行長を切った(上限を上げれば伸びる)
  //   ・`orbit-window` …… 60 公転ぶんの窓を走り切った(上限は効いていない = 軌道そのものの性質)
  // 近点が足りない理由もこれで分かれる(前者 `max-steps` / 後者 `window`)。
  const cappedByDeclaration = stepsHit && boundBy === 'declared-max-steps';
  let unmeasuredReason = null;
  if (resourceExceeded) unmeasuredReason = 'resource-limit';
  else if (!periastraOk) unmeasuredReason = cappedByDeclaration ? 'max-steps' : 'window';
  return {
    stepsRun, maxSteps, stepsHit, minPeriastra: minPeri, needPeriastra, periastraOk,
    wallSec, wallCeilingSec, resourceExceeded, cappedByDeclaration,
    complete: !resourceExceeded && periastraOk,
    unmeasuredReason,
    stoppedBy: resourceExceeded ? 'resource-limit'
      : (cappedByDeclaration ? 'declared-max-steps'
        : (stepsHit ? 'orbit-window(走り切った)' : 'orbit-count(全対象が ' + 'orbMax 公転に達した)')),
    note: resourceExceeded
      ? '**資源上限を超えた段である**: 壁時計 ' + wallSec + ' s > ' + wallCeilingSec + ' s。'
        + '途中までの軌道を最終判定へ流さない(unmeasured/resource-limit)'
      : (periastraOk ? '近点 ' + minPeri + ' 本 ≥ 宣言 ' + needPeriastra + ' 本(測定が成立する)'
        : '近点が ' + minPeri + ' 本で宣言 ' + needPeriastra + ' 本に足りない —— '
          + (cappedByDeclaration ? '**宣言した步数上限で切れた**(max-steps: 上限を上げれば伸びる)'
            : '**步数の窓は走り切った**(window: 軌道そのものの性質であって上限のせいではない)')),
  };
}

// 機種非依存の機械確認:**同じ入力なら步/秒が何であっても同じ步数になる**。
// (第257便d までの規則 `min(max(rate×budget, floor), want, hardCap)` は rate で変わった。)
export function machineIndependenceProbe({ id, n, dt = DT_BASE, stepsPerOrbit = [],
  orbMax = ORB_MAX_DEFAULT, rates = [1e3, 1e5, 1e7] }) {
  const now = stopRuleFor({ id, n, dt, stepsPerOrbit, orbMax }).maxSteps;
  // 旧規則(第257便d)の再現 —— **比較のためだけに置く**(器はもう使わない)
  const legacy = rates.map((rate) => {
    const budget = (n > 12) ? 240 : 80;
    const budgetSteps = rate * budget;
    const finite = (stepsPerOrbit || []).filter((s) => Number.isFinite(s) && s > 0);
    const wantSteps = finite.length ? Math.max(...finite.map((s) => s * orbMax)) : 1;
    const feasible = finite.filter((s) => s <= budgetSteps);
    const floorSteps = feasible.length ? 5 * Math.max(...feasible) : 0;
    const hardCap = (n <= 3) ? 40e6 : (n <= 12) ? 20e6 : budgetSteps * 2;
    return { rate, maxSteps: Math.max(2000, Math.round(Math.min(Math.max(budgetSteps, floorSteps),
      wantSteps, hardCap))) };
  });
  return { id, declared: now, rates: legacy,
    declaredStable: true,
    legacyStable: new Set(legacy.map((z) => z.maxSteps)).size === 1,
    note: '`declared` は步/秒を入力に取らないので**定義上一定**である。`rates` は旧規則を'
      + '3 つの速さで再現したもので、**値がばらつくなら走行長が機種で変わっていた**ことを意味する。' };
}
