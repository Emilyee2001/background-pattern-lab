// @ts-check
// 新增 pattern 範本（不登記在 registry）。步驟見 README「新增 pattern」。
import './example.css';
import exampleCss from './example.css?raw';
import { COMMON_PATTERN_DEFAULTS } from '../common-controls.js';

/** @type {import('../types').PatternDefinition} */
export const examplePattern = {
  // TODO: 英文 id，需與資料夾、CSS class（bpl-<id>）、token（--bpl-<id>-*）一致
  id: 'example',
  // TODO: 清單顯示名稱
  name: '範例',
  // TODO: 匯出的 component 名稱
  componentName: 'ExampleBackground',
  // 專屬欄位預設值 + 共通欄位（color、opacity）預設值
  defaults: { gap: 24, size: 2, ...COMMON_PATTERN_DEFAULTS },
  // 專屬欄位；color、opacity 由 common-controls 自動補上，不需列出
  controls: [
    { key: 'gap', label: '間距', hint: '數值越小，圖案越密', type: 'number', min: 8, max: 80, step: 1, unit: 'px' },
    { key: 'size', label: '線寬', type: 'number', min: 1, max: 24, step: 1, unit: 'px' },
  ],
  // 跨欄位規則：回傳 { 欄位 key: 錯誤訊息 }，沒有錯誤回傳 {}
  validate: (v) => (v.size >= v.gap ? { size: '線寬需小於間距' } : {}),
  // 欄位值 → CSS token；color、opacity 也要輸出
  toTokens: (v) => ({
    '--bpl-example-color': v.color,
    '--bpl-example-opacity': v.opacity / 100,
    '--bpl-example-gap': `${v.gap}px`,
    '--bpl-example-size': `${v.size}px`,
  }),
  css: exampleCss,
};
