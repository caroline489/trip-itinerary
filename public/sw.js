const CACHE = 'trip-itinerary-v3';
const SHELL = [
  '/', '/index.html', '/manifest.json',
  '/icons/apple-touch-icon.png', '/icons/icon-192.png', '/icons/icon-512.png'
];

const OFFLINE_HTML = `<!DOCTYPE html><html lang="zh-Hans"><head><meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>暂时连不上</title>
<style>body{font-family:-apple-system,BlinkMacSystemFont,sans-serif;background:#F7F2E7;color:#2A2420;
display:flex;align-items:center;justify-content:center;height:100vh;margin:0;padding:20px;text-align:center;}
div{max-width:320px;} h1{font-size:18px;} p{font-size:14px;color:#6B6058;}
button{margin-top:16px;padding:10px 20px;border:none;border-radius:8px;background:#2E5750;color:#fff;font-size:14px;}</style>
</head><body><div><h1>暂时连不上服务器</h1><p>网络似乎不太稳定，稍后重新整理试试。之前打开过的内容通常还能看。</p>
<button onclick="location.reload()">重新整理</button></div></body></html>`;

self.addEventListener('install', (event) => {
  // 逐一缓存，单一资源失败不会拖垮整个安装（避免网络不稳时整批快取失败）
  event.waitUntil(
    caches.open(CACHE).then((cache) =>
      Promise.all(SHELL.map((url) => cache.add(url).catch(() => {})))
    )
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);
  if (url.pathname.startsWith('/api/')) return; // 不快取 API，离线时让它自然失败，改用 localStorage

  event.respondWith(
    caches.match(event.request).then((cached) => {
      const fetchPromise = fetch(event.request)
        .then((response) => {
          if (response && response.ok) {
            const clone = response.clone();
            caches.open(CACHE).then((c) => c.put(event.request, clone));
          }
          return response;
        })
        .catch(() => {
          if (cached) return cached;
          // 完全没有快取、网络又失败时（比如第一次打开就没信号），
          // 给个友善的离线提示，而不是浏览器原生的报错页
          if (event.request.mode === 'navigate') {
            return new Response(OFFLINE_HTML, { headers: { 'Content-Type': 'text/html; charset=utf-8' } });
          }
          return Response.error();
        });
      return cached || fetchPromise;
    })
  );
});
