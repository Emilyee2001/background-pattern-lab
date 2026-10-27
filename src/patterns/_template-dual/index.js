// @ts-check
// SVG 雙色 pattern 範本（不登記在 registry）。步驟見 README「新增 pattern」。
import './example.css';
import exampleCss from './example.css?raw';
import { createDualColorControls, DUAL_COLOR_DEFAULTS } from '../common-controls.js';

/** @type {import('../types').PatternDefinition} */
export const examplePattern = {
  // TODO: 英文 id，需與資料夾、CSS class（bpl-<id>）、token（--bpl-<id>-*）一致
  id: 'example',
  // TODO: 清單顯示名稱
  name: '範例',
  // TODO: 匯出的 component 名稱
  componentName: 'ExampleBackground',
  // 專屬欄位預設值 + 雙色預設值（中性灰；color、opacity、secondaryColor、secondaryOpacity）
  defaults: { gap: 48, size: 24, ...DUAL_COLOR_DEFAULTS },
  controls: [
    { key: 'gap', label: '間距', hint: '數值越小，圖案越密', type: 'number', min: 16, max: 200, step: 1, unit: 'px' },
    { key: 'size', label: '寬度', type: 'number', min: 8, max: 120, step: 1, unit: 'px' },
  ],
  // TODO: 兩種圖形的顯示名稱，產生「<名稱>顏色」「<名稱>透明度」欄位
  colorControls: createDualColorControls('圖形 A', '圖形 B'),
  // 圖形畫在 24×24 內，寬度小於間距就不會重疊
  validate: (v) => (v.size >= v.gap ? { size: '寬度需小於間距' } : {}),
  // 欄位值 → CSS token；兩組顏色與透明度都要輸出
  toTokens: (v) => ({
    '--bpl-example-color': v.color,
    '--bpl-example-opacity': v.opacity / 100,
    '--bpl-example-secondary-color': v.secondaryColor,
    '--bpl-example-secondary-opacity': v.secondaryOpacity / 100,
    '--bpl-example-gap': `${v.gap}px`,
    '--bpl-example-size': `${v.size}px`,
  }),
  css: exampleCss,
};
