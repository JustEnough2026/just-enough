食材有限 Just Enough｜正式版 V3

【上傳 GitHub Pages】
1. 解壓縮 ZIP。
2. 將解壓縮後「裡面的全部檔案與 images 資料夾」上傳到 just-enough 儲存庫最外層。
3. 勾選覆蓋同名檔案並提交（Commit changes）。
4. 等待約 1–3 分鐘，再開啟：https://justenough2026.github.io/just-enough/

【日後修改】
只要編輯 config.js：
- announcement：今日公告
- open：true 為營業，false 為店休
- price：商品價格
- soldOut：true 顯示售完並禁止加購
- stock：輸入數字顯示剩餘數量；不限制請填 null
- foodpanda / uberEats：貼上店家網址後，按鈕會自動顯示

本版沒有使用 Service Worker 快取，更新照片或價格後較不容易看到舊版本。


V3.1 圖片修正版
- 已將所有錯誤的 images/... 路徑改為根目錄圖片路徑。
- 已替換最新口水雞照片。
- 已更新快取版本為 v31。
- ZIP 解壓縮後，請將裡面的所有檔案直接覆蓋上傳到 GitHub 儲存庫根目錄。
