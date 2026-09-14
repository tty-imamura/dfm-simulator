// 第263便a(第55報 W1)「geoPN=3 × 部分引きずり」の**純関数**ライブラリ。
//
// ■ ここにあるもの
//   (1) `psrDragOverlayCopy(preset, opt)` —— 🩻 系(geoPN=3 のトイ)の診断コピーに
//       **明示キー `physics.spaceMesh.toyAllowDrag:true`** を足して、**kFrame>0 のまま**走らせる形にする。
//       第259便a の入場条件 (c)「トイは kFrame=0 専用」を、**第263便a の明示キーだけで**迂回する。
//   (2) `psrGeoPN2Copy(preset, opt)`  —— 同じ f・同じ kFrame の **geoPN=2(現行経路)**の対照コピー。
//   (3) `dominanceRow(dom, f)` —— 支配度の 3 軸と f* を 1 行にまとめる整形(算術だけ)。
//
// ■ ここに無いもの(意図的に)
//   **観測値が 1 つも無い**(CSV が正本)。**合否の閾値も無い**。**力学も無い**(JSON を組む算術だけ)。
//
// ■ 診断コピーであることの宣言(数字を引用する側が外してはいけない前提)
//   ここで作る JSON は **`sampleClass:"principle"`** であり、**較正候補ではない**
//   (docs/RELEASE_NOTES_v1.44.md Negative Claim 27)。**`toyAllowDrag` は
//   `sampleClass:"calibration"` では検証器が拒否する**(第263便a)。
//   さらに **E6′ の追従キックとトイが同じ步で重なる** ——「二重計上の可能性がある構成」であって、
//   「引きずりが弱い法則」の宣言ではない。**対照(η=0)と必ず並べて読むこと。**

// D₀ の読み口を**宣言で固定する**。エンジンは `frameWeight:"pull"` のとき E6′ もトイも
// `D0pull` を先に読むので、`d0Mode:"toy"`(既定)は D0pull を消して `physics.D0` に一本化し、
// `d0Mode:"keep"` は 📻/⚡ の宣言(D0pull=3.24204e-7)をそのまま残す。**両方を表に出す。**
export function psrDragOverlayCopy(preset, opt) {
  const o = opt || {};
  const p = JSON.parse(JSON.stringify(preset));
  p.id = o.id || (preset.id + 'DragDiag');
  p.sampleClass = 'principle';
  delete p.massCalibration;
  delete p.claims;
  delete p.calibrationForecast;
  p.physics.geoPN = 3;
  p.physics.kFrame = (o.kFrame === undefined) ? 0 : o.kFrame;
  const sm = { mode: 'vertex', gravity: false, inertia: false,
    lawVersion: (o.lawVersion === undefined) ? 'local' : o.lawVersion,
    toyGain: (o.toyGain === undefined) ? 1 : o.toyGain };
  // **明示キー**: kFrame>0 のときだけ意味があるが、宣言は kFrame に依らず残す(正準形で見えるように)
  if (o.allowDrag !== false) sm.toyAllowDrag = true;
  p.physics[ 'spaceMesh' ] = sm;
  if ((o.d0Mode || 'toy') === 'toy') delete p.physics.D0pull;
  if (o.D0 !== undefined) p.physics.D0 = o.D0;
  return p;
}

// 同じ f・同じ kFrame の **geoPN=2(現行経路 — E6′ と E12 が両方効く)**の対照。
// spaceMesh の宣言は**外す**(geoPN=2 にトイの宣言は要らない = 署名に 1 文字も出さない)。
export function psrGeoPN2Copy(preset, opt) {
  const o = opt || {};
  const p = JSON.parse(JSON.stringify(preset));
  p.id = o.id || (preset.id + 'PN2Diag');
  p.sampleClass = 'principle';
  delete p.massCalibration;
  delete p.claims;
  delete p.calibrationForecast;
  delete p.physics[ 'spaceMesh' ];
  p.physics.geoPN = (o.geoPN === undefined) ? 2 : o.geoPN;
  p.physics.kFrame = (o.kFrame === undefined) ? 0 : o.kFrame;
  if ((o.d0Mode || 'toy') === 'toy') delete p.physics.D0pull;
  if (o.D0 !== undefined) p.physics.D0 = o.D0;
  return p;
}

// 支配度 3 軸 + f* の 1 行(算術だけ・判定はしない)。
export function dominanceRow(id, emoji, dom, f, note) {
  if (!dom) return { id, emoji, dom: null, f, note: note || '支配度が測れない(源が 2 体未満か m≤0)' };
  return { id, emoji, n: dom.n,
    massRatio: dom.massRatio, massFracTotal: dom.massFracTotal,
    chiTop: dom.chiTop, chiSecond: dom.chiSecond, chiBias: dom.chiBias,
    uAlign: dom.uAlign, uMagRatio: dom.uMagRatio,
    fStar: f, note: note || null };
}
