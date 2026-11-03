# background-pattern-lab

給 UI／前端開發用的 pattern 背景收集與試畫工具：選圖案、調參數與底色、即時預覽，再複製可在其他 React 專案獨立使用的 JSX component 與 CSS。

技術：Vite + React + JavaScript + Tailwind CSS v4.3.3（`@tailwindcss/vite`，UI token 在 `src/styles/app.css` 的 `@theme`）。

## 指令

```sh
npm install
npm run dev      # 開發
npm run build    # 輸出純靜態網站到 dist/
npm run lint
```

## 結構

```text
src/
├─ patterns/              # pattern 本體（CSS 是本體，與 playground UI 分離）
│  ├─ _shared/            # .bpl-bg 根元素與底色層
│  ├─ _template/          # 新增 pattern 用的範本（不登記）：CSS 漸層
│  ├─ _template-svg/      # 範本：SVG mask、單色
│  ├─ _template-dual/     # 範本：SVG mask、雙色
│  ├─ dots/ grid/ stripes/ cross/
│  ├─ common-controls.js  # 顏色、透明度共通欄位與雙色欄位
│  ├─ registry.js
│  └─ types.js            # JSDoc 型別
├─ playground/            # 狀態、驗證、Panel、展示區、複製 modal
├─ components/ui/         # 共用介面元件
├─ export/                # 匯出快照、輸出格式（formats/）、剪貼簿
├─ app/                   # 頁面組裝
└─ styles/app.css
```

## 新增 pattern

預覽與匯出共用同一份 CSS（預覽 `import`、匯出 `?raw`），所以只要改一個地方。

1. 依繪製方式選一個範本，複製為 `src/patterns/<id>/`，把 `example.css` 改名為 `<id>.css`：
   - `_template/`：用 CSS 漸層畫的幾何（點點、線條類）。
   - `_template-svg/`：用 SVG mask 畫的單色圖形，CSS 註解附交錯與不規則排列的寫法。
   - `_template-dual/`：兩種 SVG 圖形輪流、各自一個顏色。
2. 寫 `<id>.css`：包在 `@layer components` 內，class 為 `.bpl-<id>`，只使用 `--bpl-<id>-*` token，不寫死數值；刪掉範本註解。
3. 寫 `index.js`：`id`、`name`、`componentName`、`defaults`、`controls`、`validate`、`toTokens`，import CSS 與 `?raw`。`color`、`opacity` 為共通欄位，不必列在 `controls`，但 `defaults` 與 `toTokens` 要包含。雙色 pattern 改設 `colorControls: createDualColorControls(主名稱, 副名稱)`，預設值用 `DUAL_COLOR_DEFAULTS`，兩色在 CSS 中分別畫在 `::before`、`::after`。
4. 在 `src/patterns/registry.js` 登記。
5. 檢查：清單示意預覽、各欄位與跨欄位驗證、RWD 斷點、modal 輸出、貼到空白 React 專案後畫面一致。

不需要修改 Panel、Modal、匯出產生器或其他 pattern。

命名：`id`、class、token 一律英文；中文只出現在 `name`、`label`、`hint` 等顯示文字。
