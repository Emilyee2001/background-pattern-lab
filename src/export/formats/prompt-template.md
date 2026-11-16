<!--
  給 AI 的 prompt 範本（prompt.js 以 ?raw 引入）
  - {{key}} 由 prompt.js 填入；會隨設定變動的內容只放在 {{summary}}，範本不寫條件判斷。
  - HTML 註解在輸出時會移除，只給維護者看。
  - 給人看的使用方式在 src/playground/ExportDialog.jsx；兩邊重疊的內容修改時要一起檢查。
  - 保持精簡：只寫 AI 容易做錯的事，常識性的細節不寫。
-->
# 任務：在這個專案加入網頁背景

以下是 Background Pattern Lab（BPL）產生的網頁背景 component 與 CSS。請依照專案既有的結構與慣例加入。使用者沒有說明要放在哪裡時，先詢問。

## 本次設定

{{summary}}

## 規則

**不能改**

- class 名稱、DOM 結構、CSS 規則與 `@layer components`：不要改寫成 Tailwind class、CSS Modules 或 inline style。需要額外樣式（例如 `mix-blend-mode`）時，透過 `className` 另外加規則。
- Token 名稱（`--bpl-*`）。`bpl` 本身就是前綴，專案的命名規定不必套用。

**依專案調整**

- 檔案位置、命名、CSS 的引入方式（全域 CSS 或 component 自己 import）依專案慣例；TypeScript 專案改為 `.tsx`；非 React 專案保留 class 結構改寫。
- 專案的規定（例如 `CLAUDE.md`、`AGENTS.md`）與這份說明衝突時，以專案規定為準。
- 使用 Tailwind v4 時，含 `@import "tailwindcss";` 的 CSS 必須比這些 CSS 先載入。Tailwind v3 未經測試，請盡力處理並說明做法。

**專案已經有 BPL 背景時**（搜尋 `bpl-bg`）

- 共用 CSS 的前半段（`.bpl-bg` 開頭的規則與 `:where(.bpl-bg)`）是所有 BPL 背景共用的，已經有就不用重複加入；專案規定不同區塊不能共用檔案時，可以各自保留一份，內容相同不會衝突。CSS 由 component 各自 import 的專案，把這段放在獨立的檔案，讓每個 BPL component 都 import。
- 已經有 `.bpl-{{patternId}}--default` 時，代表要更新設定：只取代 Token CSS 區塊。使用者沒有說明要更新原本的設定，還是另存成新的 variant 時，先詢問。另存時，把 Token CSS 中所有 `.bpl-{{patternId}}--default` 改成新名稱（例如 `--hero`），並傳入 `variant="hero"`。

**Design token**

- 只有值相同、用途也相符時，才把 Token CSS 的值改成 `var(--專案 token)`，並用註解保留原值，例如 `--bpl-base-color: var(--color-surface); /* BPL: #FFFFFF */`。更新設定時，原值與新值相同就保留改接。
- 專案 token 不是定義在 `:root` 時，確認背景放在定義它的元素裡面，否則讀不到。
- 其餘的值維持原樣；值相近的 token 列為候選，由使用者決定。

**放置**

- 父容器設定 `position: relative; isolation: isolate;`（原本就有 `position` 時保留，只補 `isolation`）。父容器要涵蓋整個要鋪背景的範圍；內容是置中的窄容器時，在外面包一層全寬的容器。
- 取代原有的背景時，舊檔案預設保留，使用者要求才刪除；說明新舊的差異（包括捲動或固定、疊放順序、混合模式），並列出還提到舊背景的註解或文件（只列出，不修改）。
- 固定背景時，祖先元素的 `transform`、`filter`、`backdrop-filter`、`will-change`、`contain` 會讓固定失效；遇到時告知使用者，不要自行移除。

## 完成後

- 依專案或使用者的指示驗證（例如 build）；指示不要驗證時就跳過。
- 用簡短的中文說明：改了哪些檔案、背景放在哪裡、token 對接的結果與候選。

## 程式碼

### JSX（`{{componentName}}.jsx`）

```jsx
{{jsx}}
```

### 共用 CSS

```css
{{sharedCss}}
```

### Token CSS（本次設定的數值）

```css
{{tokenCss}}
```
