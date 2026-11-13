// @ts-check
import './squares.css';
import squaresCss from './squares.css?raw';
import { COMMON_PATTERN_DEFAULTS } from '../common-controls.js';

/** @type {import('../types').PatternDefinition} */
export const squaresPattern = {
  id: 'squares',
  name: '方點',
  componentName: 'SquaresBackground',
  defaults: { gap: 64, size: 4, stagger: 0, ...COMMON_PATTERN_DEFAULTS },
  previewValues: { gap: 24, size: 4 },
  controls: [
    { key: 'gap', label: '間距', hint: '數值越小，圖案越密', type: 'number', min: 8, max: 160, step: 1, unit: 'px' },
    { key: 'size', label: '邊長', type: 'number', min: 1, max: 24, step: 1, unit: 'px' },
    { key: 'stagger', label: '錯開', hint: '只有 0 和 50：0 為方格排列，50 為交錯排列', type: 'number', min: 0, max: 50, step: 50, unit: '%' },
  ],
  validate: (v) => (v.size >= v.gap ? { size: '邊長需小於間距' } : {}),
  toTokens: (v) => ({
    '--bpl-squares-color': v.color,
    '--bpl-squares-opacity': v.opacity / 100,
    '--bpl-squares-gap': `${v.gap}px`,
    '--bpl-squares-size': `${v.size}px`,
    // 錯開量以間距為單位：0～0.5
    '--bpl-squares-stagger': v.stagger / 100,
  }),
  css: squaresCss,
};
