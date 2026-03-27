# RarePetFinder Backend (Mock API)

這是一個使用 **json-server** + **json-server-auth** 建立的簡易假後端（Mock Backend）。

主要用來支援前端開發，提供基本 API 與登入驗證功能。

---

## 🚀 Features 功能

* RESTful API（由 json-server 提供）
* 使用 json-server-auth 模擬登入 / 註冊
* 使用 `db.json` 作為簡易資料庫
* 支援 CORS，方便前端串接

---

## 📁 Project Structure 專案結構

```
backend/
├── db.json        # 模擬資料庫
├── server.js      # 伺服器入口
├── package.json   # 套件設定
```

---

## ⚙️ Getting Started 使用方式

### 1️⃣ 安裝套件

```bash
npm install
```

### 2️⃣ 啟動伺服器

```bash
npm start
```

### 3️⃣ 開啟 API

```
http://localhost:3001
```

---

## 🔐 Authentication 驗證

由 `json-server-auth` 提供：

* `POST /login`  👉 登入
* `POST /register` 👉 註冊

---

## 📡 Example Endpoints API 範例

* `GET /stores`
* `GET /users`
* `POST /login`

---

## 🧠 Notes 注意事項

* 這是一個 **mock backend（假後端）**，不適合正式上線
* 資料儲存在 `db.json`
* 伺服器邏輯由 `json-server` 自動處理（沒有自訂商業邏輯）

❗ 這裡的 `db.json` / `server.js` 只是 Markdown 的「code 標示」，不是直接連動檔案

---

## 🔧 Tech Stack 技術

* Node.js
* json-server
* json-server-auth
* cors

---

## 📌 Purpose 專案目的

This backend is designed to:

* Support the RarePetFinder frontend during development
 支援前端開發

* Provide a quick and simple API without building a full backend
 快速提供 API，不需建立完整後端架構

---

## 🚧 Future Improvements 未來展望

* Replace with Express + real database
* Add proper authentication (JWT)
* Add validation & business logic

⭐ **將 json-server backend 升級成 Express（API 路徑保持不變）**
