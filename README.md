使用 React Hooks 列出 Github 的 [Repositories API](https://docs.github.com/en/rest/repos/repos#list-organization-repositories)。

一打開頁面，抓取 12 筆 [Dcard](https://github.com/dcard) 公司的公開 Repository。

滾至頁面底端後，繼續加上 12 筆，直到沒有資料即停止。

# 線上 Demo
https://list-organization-repos.vercel.app/

# 安裝與啟動

1. `git clone https://github.com/ymcheung/list-organization-repos`
2. `cd list-organization-repos`
3. `npm install`
4. `npm start`

## 設定 Personal Access Token

不用設定 Authorization 的成品，請切換至 [feature/remove-authorization](https://github.com/ymcheung/list-organization-repos/tree/feature/remove-authorization) 分支。

1. `cp .env.sample .env`
2. [取得 Personal Access Token](https://github.com/settings/tokens)
3. 取代 `REACT_APP_GITHUB_PERSONAL` 的值

# 資料

## Repos Type

- All (預設): 所有 Repository
- Forks: 僅列出從它處 Fork 回來的 Repository

## Sort

- Created Time (預設): 創建 Repo 的時間
- Updated Time: Repo 更新的時間
- Pushed Time: 最近 Push 上 Github 的時間
- Full Name: 全名

## Direction

- Descend: 降冪排列
- Ascend: 升冪排列

# 細節說明

1. `fetch` 取得資料，轉為 `json` 陣列
2. 將 `json` 陣列儲存至 `useState` Hooks，取名 `repos`。

接著有兩種功能：

## Filter

3. 按 Input Radio，將 `<input>` 的 `name` 和 `value` 更新 Hooks state 變數 `form` 的資料，`form.page` 設定為 1。
4. `useEffect()` 設定 `form` 為 dependency，會開始執行 `handleFetchRepos()`。

## Infinite Scroll

3. 監聽 `scroll` 事件，捲動至頁面底端時，設定 `isFetching` 為 `true`。
4. 讓 `form.page` +1，抓取下一頁資料
5. 透過 `prevState` 組合現有和新加入的陣列。接著設定 `isFetching` 為 `false`。
6. 直到回傳的 `json` 長度為 0 時，設定 `noData` 為 `true`，不再更新 `repos`。

# 限制

- 更新 Type、Sort 與 Direction 之後，會從第 1 筆資料重新顯示。

# 還可以更好

- [ ] 監聽 `scroll` 事件使用 `throttle` 控制數量
- [x] 沒有設定 Authorization 的 `fetch`，每個 IP [每小時只能存取 60 次](https://docs.github.com/en/rest/overview/resources-in-the-rest-api#checking-your-rate-limit-status)。加上 Authorization 後，使得每小時可以 `fetch` 的次數達 5,000 次

# 輔助工具

- TypeScript
- ESLint
