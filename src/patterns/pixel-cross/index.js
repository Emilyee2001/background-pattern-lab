// @ts-check
import './pixel-cross.css';
import pixelCrossCss from './pixel-cross.css?raw';
import { createDualColorControls, DUAL_COLOR_DEFAULTS } from '../common-controls.js';

/** @type {import('../types').PatternDefinition} */
export const pixelCrossPattern = {
  id: 'pixel-cross',
  name: '格子十字',
  componentName: 'PixelCrossBackground',
  defaults: { gap: 126, size: 21, stagger: 50, ...DUAL_COLOR_DEFAULTS },
  previewValues: { gap: 32, size: 12, stagger: 0 },
  controls: [
    { key: 'gap', label: '間距', hint: '數值越小，圖案越密', type: 'number', min: 12, max: 200, step: 1, unit: 'px' },
    { key: 'size', label: '寬度', hint: '十字由 3×3 格組成，以 3px 為單位', type: 'number', min: 6, max: 60, step: 3, unit: 'px' },
    { key: 'stagger', label: '錯開', hint: '只有 0 和 50：0 為方格排列，50 為交錯排列', type: 'number', min: 0, max: 50, step: 50, unit: '%' },
  ],
  colorControls: createDualColorControls('十字', '中心'),
  validate: (v) => (v.size >= v.gap ? { size: '寬度需小於間距' } : {}),
  toTokens: (v) => ({
    '--bpl-pixel-cross-color': v.color,
    '--bpl-pixel-cross-opacity': v.opacity / 100,
    '--bpl-pixel-cross-secondary-color': v.secondaryColor,
    '--bpl-pixel-cross-secondary-opacity': v.secondaryOpacity / 100,
    '--bpl-pixel-cross-gap': `${v.gap}px`,
    '--bpl-pixel-cross-size': `${v.size}px`,
    // 錯開量以間距為單位：0～0.5
    '--bpl-pixel-cross-stagger': v.stagger / 100,
  }),
  css: pixelCrossCss,
};
