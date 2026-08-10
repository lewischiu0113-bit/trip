# 旅遊筆記 (Trip Itinerary & Budget Manager)

一款質感現代、支援多日與多國旅遊規劃、實時雲端 Supabase 資料庫連動、多源費用記帳、行李清單與動態卡片拖曳排序的旅遊筆記 Web 應用程式。

---

## 🌟 核心特色功能

- 🗺️ **多旅程支援**：支援名古屋、釜山、沖繩、花蓮等多地點行程管理，依日期排序切換。
- 📅 **每日行程管理**：動態時間軸/網格雙檢視模式，支援卡片高畫質景點相片與大圖預覽。
- 🖐️ **手勢與單鍵卡片排序**：桌機與手機 Touch 端皆支援 **長按拖曳 (Drag & Drop)** 及 **[▲ 上移] [▼ 下移]** 一鍵重排卡片順序。
- 💰 **實時多源費用記帳**：自動將「獨立記帳項目」與「行程卡片預算」動態 Master 合併，支援狀態切換、編輯與刪除。
- 🧳 **行李與備忘清單**：按分類快速打勾與統計準備完成度進度條。
- 🎨 **CodeCat 美學與深色模式**：玻璃擬態 (Glassmorphism)、流暢微動畫與全站 RWD 自適應手機版。
- ⚡ **雲端 Supabase 連動**：100% 直連 Supabase 資料庫 (`tb_trips`, `tb_itineraries`, `tb_expenses`, `tb_packing`)。

---

## 🚀 快速開始

### 1. 安裝依賴
```bash
npm install
```

### 2. 環境變數設定 (`.env`)
```env
VITE_SUPABASE_URL=https://tumnkqggbyvjzwrffuao.supabase.co
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 3. 本地開發運行
```bash
npm run dev
```

### 4. 生產環境打包
```bash
npm run build
```
