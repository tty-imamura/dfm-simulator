// 第279便b: 対象 html の inline script を **Node の vm で**読み込む最小の headless 器(preflight 専用)。
// DOM・Canvas・Storage は「何を呼んでも自分を返す」万能スタブで置き換え、描画・UI の副作用は捨てる。
// **物理コード(validatePreset / makeSim / sim.build / sim.step)は html の本文そのまま**を実行する
// (コピーを持たない)。目的は「全内蔵プリセットの受理・構築・1 歩」を Chromium なしで数秒で一周する
// こと(フル QA の前に落ちるものを早く落とす)であって、**ブラウザ QA の代わりではない**
// (描画・UI・タイミング・長時間の物理は見ない — `fullQaStillRequired:true`)。
import fs from 'node:fs';
import vm from 'node:vm';

// 何を読んでも・呼んでも・new しても自分(スタブ)を返す。数値/文字列への変換は 0/'' 。
export function makeUniversalStub(name = 'stub') {
  const fn = function () {};
  let proxy;
  // 添字は何番でもスタブ・length 0・反復は空(`sh[0].textContent=…` のような UI 初期化を通す)
  const list = () => new Proxy([], { get(t, k) {
    if (typeof k === 'string' && /^\d+$/.test(k)) return proxy;
    return Reflect.get(t, k);
  } });
  const handler = {
    get(t, k) {
      if (k === Symbol.toPrimitive) return (hint) => (hint === 'number' ? 0 : '');
      if (k === Symbol.iterator) return function* () {};
      if (k === 'then') return undefined;                 // thenable にしない
      if (k === 'length' || k === 'width' || k === 'height' || k === 'clientWidth' || k === 'clientHeight'
        || k === 'offsetWidth' || k === 'offsetHeight' || k === 'scrollTop' || k === 'scrollLeft'
        || k === 'devicePixelRatio' || k === 'childElementCount') return 0;
      if (k === 'toString' || k === 'valueOf') return () => '';
      if (k === 'value' || k === 'textContent' || k === 'innerHTML' || k === 'innerText'
        || k === 'className' || k === 'id' || k === 'tagName') return '';
      if (k === 'checked' || k === 'disabled' || k === 'open' || k === 'hidden') return false;
      if (k === 'children' || k === 'childNodes' || k === 'options') return list();
      if (k === 'querySelectorAll' || k === 'getElementsByClassName' || k === 'getElementsByTagName') return () => list();
      if (k === 'getBoundingClientRect') return () => ({ x: 0, y: 0, left: 0, top: 0, right: 0, bottom: 0, width: 0, height: 0 });
      if (k === 'matches') return false;
      if (k in t) return t[k];
      return proxy;
    },
    set(t, k, v) { t[k] = v; return true; },
    apply() { return proxy; },
    construct() { return proxy; },
    has() { return true; },
  };
  proxy = new Proxy(fn, handler);
  return proxy;
}

function makeStorage() {
  const m = new Map();
  return {
    getItem: (k) => (m.has(String(k)) ? m.get(String(k)) : null),
    setItem: (k, v) => { m.set(String(k), String(v)); },
    removeItem: (k) => { m.delete(String(k)); },
    clear: () => m.clear(),
    key: (i) => [...m.keys()][i] ?? null,
    get length() { return m.size; },
  };
}

// html を読み、inline script を vm コンテキストで評価する。戻り値 = { ctx, HP, errors, ms, evalExpr }
export function loadHtmlHeadless(htmlPath) {
  const t0 = Date.now();
  const html = fs.readFileSync(htmlPath, 'utf8');
  const m = html.match(/<script>([\s\S]*)<\/script>/);
  if (!m) throw new Error('inline <script> が見つからない: ' + htmlPath);
  const stub = makeUniversalStub();
  const errors = [];
  const sandbox = {
    console: { log() {}, info() {}, debug() {}, warn() {}, error: (...a) => errors.push(a.map(String).join(' ')) },
    document: stub, navigator: { language: 'ja', languages: ['ja'], userAgent: 'node-headless', serviceWorker: undefined, clipboard: stub },
    location: { href: 'file:///headless/index.html', search: '', hash: '', protocol: 'file:', hostname: '', pathname: '/headless/index.html', origin: 'null' },
    localStorage: makeStorage(), sessionStorage: makeStorage(),
    requestAnimationFrame: () => 0, cancelAnimationFrame: () => {},
    // UI の遅延処理は捨てる(物理は同期 API で駆動する)
    setTimeout: () => 0, clearTimeout: () => {}, setInterval: () => 0, clearInterval: () => {},
    queueMicrotask: (f) => queueMicrotask(f),
    matchMedia: () => ({ matches: false, addEventListener() {}, removeEventListener() {}, addListener() {}, removeListener() {} }),
    getComputedStyle: () => stub, ResizeObserver: function () { return stub; }, MutationObserver: function () { return stub; },
    IntersectionObserver: function () { return stub; },
    Image: function () { return stub; }, Blob: function () { return stub; }, URL: Object.assign(function () { return stub; }, { createObjectURL: () => '', revokeObjectURL: () => {} }),
    fetch: () => new Promise(() => {}), alert: () => {}, confirm: () => false, prompt: () => null,
    addEventListener: () => {}, removeEventListener: () => {}, dispatchEvent: () => true,
    performance: { now: () => Date.now() - t0 },
    innerWidth: 390, innerHeight: 844, devicePixelRatio: 1, screen: { width: 390, height: 844 },
    CustomEvent: function () { return stub; }, Event: function () { return stub; },
    // 組み込み(Array/Math/JSON 等)は**渡さない** — vm コンテキスト自身の intrinsic を使う
    // (ホストの Array を渡すと、スクリプト内のリテラル配列が `instanceof Array` で偽になる)
    TextEncoder, TextDecoder, crypto: globalThis.crypto,
  };
  sandbox.window = sandbox; sandbox.self = sandbox; sandbox.globalThis = sandbox;
  const ctx = vm.createContext(sandbox);
  new vm.Script(m[1], { filename: htmlPath }).runInContext(ctx);
  // evalExpr: 同じコンテキストで式を評価する(スクリプト最上位の const — DT 等 — を読むため)
  return { ctx, HP: ctx.HP || null, errors, ms: Date.now() - t0, evalExpr: (code) => vm.runInContext(code, ctx) };
}
