// @ts-check
// Pattern 定義的 JSDoc 型別。此檔不輸出任何執行期程式碼。

/**
 * 一組欄位值。draft 時為字串，lastValid 時為數值（color 維持字串）。
 * @typedef {Record<string, string | number>} PatternValues
 */

/**
 * 欄位錯誤：key 為欄位 key，value 為錯誤訊息。
 * @typedef {Record<string, string>} FieldErrors
 */

/**
 * @typedef {object} NumberControl
 * @property {string} key       英文識別名，同時用於 token 名稱
 * @property {string} label     顯示名稱
 * @property {string} [hint]    欄位說明
 * @property {'number'} type
 * @property {number} min
 * @property {number} max
 * @property {number} step
 * @property {string} [unit]    顯示用單位（px、deg、%）
 */

/**
 * @typedef {object} ColorControl
 * @property {string} key
 * @property {string} label
 * @property {string} [hint]
 * @property {'color'} type
 * @property {string} [alphaKey]  同組的透明度欄位 key；設定後調色盤會顯示透明度滑桿並連動該欄位
 */

/** @typedef {NumberControl | ColorControl} PatternControl */

/**
 * @typedef {object} PatternDefinition
 * @property {string} id                 英文識別名；class 為 `bpl-<id>`，token 為 `--bpl-<id>-<key>`
 * @property {string} name               顯示名稱
 * @property {string} componentName      匯出的 React component 名稱
 * @property {Record<string, string | number>} defaults  所有欄位（含共通欄位 color、opacity）的預設值
 * @property {Record<string, string | number>} [previewValues]  只給 Pattern 清單示意圖用，覆寫 defaults 中的部分欄位
 * @property {PatternControl[]} controls 該 pattern 專屬欄位；共通欄位由 common-controls 補上
 * @property {PatternControl[]} [colorControls]  顏色欄位；省略時使用共通的 color、opacity（雙色見 createDualColorControls）
 * @property {(values: Record<string, any>) => FieldErrors} [validate]  跨欄位規則，只在各欄位本身有效時呼叫
 * @property {(values: Record<string, any>) => Record<string, string | number>} toTokens
 * @property {import('./_shared/index.js').Attachment} [forcedAttachment]  一律使用的捲動方式；設定後 panel 的開關鎖定、不能切換
 * @property {string} css                pattern CSS 原始字串（`?raw`），匯出時使用
 */

export {}
