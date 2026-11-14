<!--
  給 AI 的 prompt 範本（prompt.js 以 ?raw 引入）
  - {{key}} 由 prompt.js 填入；會隨設定變動的內容只放在 {{summary}}，範本不寫條件判斷。
  - HTML 註解在輸出時會移除，只給維護者看。
  - 給人看的使用方式在 src/playground/ExportDialog.jsx；兩邊重疊的內容（父容器、引入順序、固定背景的限制）修改時要一起檢查。
-->
# 任務：在這個專案加入背景 pattern component

以下是 Background Pattern Lab（BPL）產生的背景 component 與 CSS。請把它加進目前的專案，並配合專案既有的結構、CSS 設定與 design token。

- 如果使用者沒有說明背景要放在哪個頁面或區塊，請先詢問，不要自行決定。
- 完成後用簡短的中文向使用者說明結果。

## 本次設定

{{summary}}

## 步驟

### 1. 先了解專案

動手前先確認：

- 框架與建置工具（Vite、Next.js、Astro、Vue、純 HTML…）。
- 使用 JavaScript 還是 TypeScript。
- 是否使用 Tailwind CSS，以及版本（v3 或 v4）。
- 全域 CSS 檔的位置與引入方式、components 資料夾與檔名的慣例。
- 既有的 design token：CSS custom properties（例如 `:root` 中的 `--color-*`）、Tailwind v4 的 `@theme`、Tailwind v3 的 `tailwind.config` 等。
- 專案中是否已經有 BPL 的程式碼（搜尋 `bpl-bg`），也就是之前加過其他 BPL 背景。

### 2. 不能改的部分

背景完全由 CSS 和 class 名稱繪製，下列內容請原樣保留：

- JSX 的 DOM 結構與 class 名稱：`bpl-bg`、`bpl-bg__base`、`bpl-{{patternId}}`、`bpl-{{patternId}}--<variant>`。
- 「共用 CSS」的內容：不要改寫成 Tailwind class、CSS Modules、styled-components 或 inline style，也不要刪減、合併規則。CSS Modules 會改掉 class 名稱，背景會因此失效。
- `@layer components { … }` 的包裝：它讓專案可以用 Tailwind utilities 覆寫背景（例如 `className="opacity-50"`）。Tailwind v3 的處理方式見第 4 步。
- Token 的名稱（`--bpl-*`）。

### 3. 要配合專案的部分

- **檔案位置與命名**依照專案慣例。建議 component 存成 `{{componentName}}.jsx`，CSS 存成獨立的 CSS 檔（例如 `bpl-{{patternId}}.css`）；專案習慣把 CSS 集中在少數檔案時，也可以併入既有的 CSS 檔。
- **TypeScript 專案**：改為 `.tsx`，並為 props 補上型別（`variant?: string; className?: string`）。
- **非 React 專案**（Vue、Svelte、純 HTML…）：保留相同的 DOM 結構與 class，改寫成該框架的寫法。
- **已經有 BPL 的程式碼時**：
  - 共用 CSS 中的 `.bpl-bg`、`.bpl-bg > *`、`.bpl-bg__base` 規則已存在時，不要重複加入，只加入 `.bpl-{{patternId}}` 的規則。
  - `:where(.bpl-bg)` 預設 token 區塊可以併入既有的同名區塊；值相同的 token 不必重複。
  - 已經有 `.bpl-{{patternId}}--default` 的 token 區塊時，先詢問使用者要「取代原本的設定」，還是「另存成新的 variant」。另存時，把 Token CSS 的 selector 改成 `.bpl-{{patternId}}--<新名稱>`，使用時傳入 `variant="<新名稱>"`；component 本身不必再新增一份。
- **Design token 對接**：只有專案 token 的值與 Token CSS 的值**完全相同**時（例如同一個色碼），才把該值改成 `var(--專案 token)`；其餘的值一律維持原樣，不要因為「相近」就替換。只能對接以 CSS custom property 形式存在的 token（Tailwind v4 的 `@theme` 可以用 `var(--color-*)` 取得；Tailwind v3 的 `tailwind.config` 不是 CSS 變數，不能對接）。值相近但不完全相同的 token，請在最後列出來，由使用者決定是否改接。

### 4. 引入 CSS

這些 CSS 是純 CSS，不依賴 Tailwind，從全域 CSS 引入即可（Next.js App Router 從 `app/layout` 引入）。

- **使用 Tailwind v4 時**：CSS 必須在 `@import "tailwindcss";` 之後引入，例如在主 CSS 檔的 `@import "tailwindcss";` 下一行 `@import "./bpl-{{patternId}}.css";`。如果無法控制引入順序，就在最先載入的 CSS 檔最前面宣告 `@layer theme, base, components, utilities;`。
- **使用 Tailwind v3 時**：這個情況尚未經過測試。v3 會把 `@layer components` 當成自己的指令處理，獨立的 CSS 檔裡如果沒有 `@tailwind components`，build 會報錯；可以試著把共用 CSS 與 Token CSS 放進含有 `@tailwind components` 的主 CSS 檔。請盡力處理，並在最後告訴使用者實際的做法與遇到的問題。

### 5. 放置 component

- 背景會鋪滿父容器。父容器需要設定 `position: relative; isolation: isolate;`，依專案寫法加上（Tailwind 為 `relative isolate`）。父容器原本就有 `position` 時保留原值，只補上 `isolation: isolate`。
- 把 component 放進父容器即可，背景會在內容下方，內容不需要另外設定 `z-index`。
- 固定背景（`--bpl-bg-layer-position: fixed`）時，如果父容器的祖先元素設定了 `transform`、`filter`、`backdrop-filter`、`will-change` 或 `contain`，固定效果會失效。遇到這種情況請告知使用者，不要自行移除那些屬性。
- Token CSS 中的 `@media` 區塊使用 Tailwind 預設的斷點寬度（md `48rem`、lg `64rem`）。專案自訂了斷點時，維持原值即可，並在最後提醒使用者。

### 6. 完成後

- 執行專案的 build（或 lint、型別檢查）確認沒有錯誤。
- 向使用者說明：
  - 新增與修改了哪些檔案。
  - 背景放在哪裡。
  - Design token 對接結果：改接了哪些 token，以及值相近、可考慮改接的候選。
  - 之後要調整時，修改 Token CSS 中的值即可，例如 `--bpl-{{patternId}}-opacity`。

## 程式碼

### JSX（component 本體，建議檔名 `{{componentName}}.jsx`）

```jsx
{{jsx}}
```

### 共用 CSS（根元素、底色層、此 pattern 的規則與預設 token）

```css
{{sharedCss}}
```

### Token CSS（本次設定的數值）

```css
{{tokenCss}}
```
