// @ts-check
import './cloud.css';
import cloudCss from './cloud.css?raw';
import { COMMON_PATTERN_DEFAULTS } from '../common-controls.js';

/** @type {import('../types').PatternDefinition} */
export const cloudPattern = {
  id: 'cloud',
  name: '小雲朵',
  componentName: 'CloudBackground',
  defaults: { gap: 56, size: 22, ...COMMON_PATTERN_DEFAULTS },
  controls: [
    { key: 'gap', label: '間距', hint: '數值越小，圖案越密', type: 'number', min: 16, max: 200, step: 1, unit: 'px' },
    { key: 'size', label: '寬度', type: 'number', min: 8, max: 120, step: 1, unit: 'px' },
  ],
  validate: (v) => (v.size >= v.gap ? { size: '寬度需小於間距' } : {}),
  toTokens: (v) => ({
    '--bpl-cloud-color': v.color,
    '--bpl-cloud-opacity': v.opacity / 100,
    '--bpl-cloud-gap': `${v.gap}px`,
    '--bpl-cloud-size': `${v.size}px`,
  }),
  css: cloudCss,
};
