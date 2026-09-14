# 行程頁面 — Cloudflare Workers 部署（含共享待辦狀態）

## 檔案
```
public/index.html   行程頁面本體
public/sw.js         離線快取
worker.js             發送網頁 + /api/trip-todo（待办勾选状态的共享存储）
wrangler.toml         Worker 設定，複用記帳本那個 KV namespace
```

## 部署步驟

這個專案跟記帳本一樣，需要一個 KV namespace。**好消息是不用再建一個新的**——
`wrangler.toml` 裡已經直接填好記帳本原本那個 KV 的 id
(`03be3e91f961498996bf76e3c39caced`)，同一個 KV 可以同時綁給多個 Worker，
不會互相干擾（用不同的 key 存資料）。

1. 推到你已經建好的 `trip-itinerary` repo：
   ```
   git add .
   git commit -m "add shared todo backend"
   git push
   ```
2. Cloudflare 那邊什麼都不用改——因為 KV id 已經是對的，這次不會再卡住。
   push 上去就會自動重新部署。

## 待辦清單怎麼運作
- 每個待辦項目勾選後，會跳出一個小視窗問「確認的時間/場次」，填完會自動：
  - 把對應的逐日行程項目改成「已訂 xxx」
  - 存到 KV，讓 Wendy 和 Caro 兩支手機都能看到同一份狀態
  - 沒有網路時先存本機瀏覽器，恢復連線後自動同步
- 取消勾選會把行程項目還原成原本的「建議預訂」狀態
