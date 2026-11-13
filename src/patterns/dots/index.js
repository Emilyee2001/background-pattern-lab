// @ts-check
import './dots.css';
import dotsCss from './dots.css?raw';
import { COMMON_PATTERN_DEFAULTS } from '../common-controls.js';

/** @type {import('../types').PatternDefinition} */
export const dotsPattern = {
  id: 'dots',
  name: '點點',
  componentName: 'DotsBackground',
  defaults: { gap: 32, size: 2, stagger: 0, ...COMMON_PATTERN_DEFAULTS },
  previewValues: { gap: 24 },
  controls: [
    { key: 'gap', label: '間距', hint: '數值越小，圖案越密', type: 'number', min: 8, max: 160, step: 1, unit: 'px' },
    { key: 'size', label: '直徑', type: 'number', min: 1, max: 24, step: 1, unit: 'px' },
    { key: 'stagger', label: '錯開', hint: '只有 0 和 50：0 為方格排列，50 為交錯排列', type: 'number', min: 0, max: 50, step: 50, unit: '%' },
  ],
  validate: (v) => (v.size >= v.gap ? { size: '直徑需小於間距' } : {}),
  toTokens: (v) => ({
    '--bpl-dots-color': v.color,
    '--bpl-dots-opacity': v.opacity / 100,
    '--bpl-dots-gap': `${v.gap}px`,
    '--bpl-dots-size': `${v.size}px`,
    // 錯開量以間距為單位：0～0.5
    '--bpl-dots-stagger': v.stagger / 100,
  }),
  css: dotsCss,
};
