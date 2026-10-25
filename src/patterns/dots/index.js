// @ts-check
import './dots.css';
import dotsCss from './dots.css?raw';
import { COMMON_PATTERN_DEFAULTS } from '../common-controls.js';

/** @type {import('../types').PatternDefinition} */
export const dotsPattern = {
  id: 'dots',
  name: '點點',
  componentName: 'DotsBackground',
  defaults: { gap: 24, size: 2, ...COMMON_PATTERN_DEFAULTS },
  controls: [
    { key: 'gap', label: '間距', hint: '數值越小，圖案越密', type: 'number', min: 8, max: 80, step: 1, unit: 'px' },
    { key: 'size', label: '直徑', type: 'number', min: 1, max: 24, step: 1, unit: 'px' },
  ],
  validate: (v) => (v.size >= v.gap ? { size: '直徑需小於間距' } : {}),
  toTokens: (v) => ({
    '--bpl-dots-color': v.color,
    '--bpl-dots-opacity': v.opacity / 100,
    '--bpl-dots-gap': `${v.gap}px`,
    '--bpl-dots-size': `${v.size}px`,
  }),
  css: dotsCss,
};
