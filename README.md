# 線上 Demo
https://list-organization-repos.vercel.app/

# 安裝與啟動

1. `git clone https://github.com/ymcheung/list-oˋrganization-repos`
2. `npm install`
3. `npm run start`

# 說明

一打開頁面，列出 12 筆 [Dcard](https://github.com/dcard) 公司在 Github 放置的公開 Repository。

滾至頁面底端後，再讀取 12 筆，直到沒有資料即停止。

更新 Type、Sort 與 Direction 之後，會從第 1 筆資料重新顯示

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
