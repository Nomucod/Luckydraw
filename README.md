# HR 專業工具箱 (HR Pro Toolkit)

這是一個專為 HR 專業人士設計的網頁工具，旨在簡化名單管理、抽獎活動與自動分組的工作流程。

## 🔗 線上使用
**👉 [點此開啟工具頁面](https://你的組織名稱.github.io/你的專案名稱/)**
*(請將上方網址替換為您在 GitHub Pages 取得的正式網址)*

## 🌟 主要功能

- **名單管理**：支援從 CSV 檔案匯入或直接貼上姓名清單。
- **重複檢查**：自動偵測重複姓名，並提供一鍵清理功能。
- **範例名單**：內建模擬資料，方便快速上手。
- **幸運抽籤**：具備動態滾動效果與中獎煙火特效。
- **自動分組**：根據設定的人數自動隨機分組，支援網格與清單視圖切換。
- **報表匯出**：分組結果可一鍵下載為標準 CSV 檔案（Excel 友善格式）。

## 🛠️ 技術架構

- **Frontend**: React (ESM 導入)
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Animation**: Canvas-confetti
- **Language**: 繁體中文

## 🚀 部署說明 (GitHub Pages)

### ⚠️ 為什麼部署顯示「Cancelled」？
如果您在 GitHub 的 Actions 頁面看到 `Cancelled`，這通常不是錯誤，而是因為：
1. **連續推送 (Concurrency)**：您在短時間內連續上傳了多次檔案。GitHub 會自動取消「舊的」部署工作，只執行「最新的」那一個。這是為了節省伺服器資源。
2. **手動中斷**：部署過程中有人點擊了取消。

**解決方法**：您只需要等待最後一個部署任務（最上面那一個）完成即可。如果全部都停住了，可以到 `Actions` 頁面點擊最新的任務，並選擇 `Re-run all jobs`。

### 如何正式上線？
1. 確保所有檔案已上傳至 GitHub 儲存庫。
2. 進入 `Settings` -> `Pages`。
3. 在 `Build and deployment` -> `Source` 選擇 `Deploy from a branch`。
4. `Branch` 選擇 `main` 並點擊 `Save`。
5. 稍待片刻，您的網站將會在 `https://[組織名稱].github.io/[專案名稱]/` 上線。

## 📝 授權

此專案僅供學術與專業工作輔助使用。