// P2(beta): PWA Service Worker — 保守的なキャッシュ戦略。
// ・ナビゲーション(index.html)= network-first(更新が即時に届く。オフライン時のみキャッシュ)
// ・静的アセット(manifest/アイコン)= cache-first
// ・スコープは登録位置基準(beta/ でもルート昇格後でもそのまま動く)
// ・API 呼び出し(api.anthropic.com 等クロスオリジン)は一切介入しない
const CACHE = "dfm-v1.27-beta.5"; // アプリ更新時はここを変えると旧キャッシュが activate で破棄される
const PRECACHE = ["./", "./index.html", "./manifest.webmanifest", "./icon-192.png", "./icon-512.png", "./icon-180.png"];

self.addEventListener("install", (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(PRECACHE)).then(() => self.skipWaiting()));
});

self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (e) => {
  const url = new URL(e.request.url);
  if (url.origin !== location.origin) return;            // クロスオリジン(API等)は素通し
  if (e.request.method !== "GET") return;
  if (e.request.mode === "navigate" || url.pathname.endsWith("/index.html")) {
    // network-first: 常に最新を取りに行き、成功したらキャッシュ更新。失敗時のみキャッシュ
    e.respondWith(
      fetch(e.request)
        .then((res) => { const cp = res.clone(); caches.open(CACHE).then((c) => c.put(e.request, cp)); return res; })
        .catch(() => caches.match(e.request).then((m) => m || caches.match("./")))
    );
    return;
  }
  // cache-first(アイコン等)
  e.respondWith(
    caches.match(e.request).then((m) => m || fetch(e.request).then((res) => {
      const cp = res.clone(); caches.open(CACHE).then((c) => c.put(e.request, cp)); return res;
    }))
  );
});
