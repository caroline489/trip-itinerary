# 行程頁面 — 獨立部署到 Cloudflare Workers（純靜態，無需 KV）

## 檔案
```
public/index.html   行程頁面本體
public/sw.js         離線快取
wrangler.toml         Worker 設定（純靜態，不需要 KV）
```

## 部署步驟

1. 把這個資料夾整個推到一個**新的** GitHub repo（跟記帳本分開）：
   ```
   git init
   git add .
   git commit -m "trip itinerary"
   git branch -M main
   git remote add origin https://github.com/你的帳號/trip-itinerary.git
   git push -u origin main
   ```

2. Cloudflare Dashboard → Workers & Pages → Create → Workers → Import a repository →
   選這個新 repo。Cloudflare 會讀到 `wrangler.toml` 並自動部署——**這次不會問你要不要填
   KV，因為根本沒有用到**。

3. 部署完成後會拿到一個新網址，例如
   `https://trip-itinerary.你的子網域.workers.dev`，之後 push 就會自動更新。

## 之後怎麼改內容
所有行程資料都寫在 `public/index.html` 裡的 `<script>` 區塊（航班、酒店、逐日行程、待辦、
貼士）。之後有新資訊，把截圖給 Claude，Claude 改好整份 `index.html` 給你，
你貼進去存檔、`git add . && git commit -m "..." && git push` 就好。
