// @ts-check
import './double-stripes.css';
import doubleStripesCss from './double-stripes.css?raw';
import { COMMON_PATTERN_DEFAULTS } from '../common-controls.js';

/** @type {import('../types').PatternDefinition} */
export const doubleStripesPattern = {
  id: 'double-stripes',
  name: '雙線條紋',
  componentName: 'DoubleStripesBackground',
  defaults: { gap: 36, thickness: 1, angle: 135, ...COMMON_PATTERN_DEFAULTS },
  previewValues: { gap: 28 },
  controls: [
    { key: 'gap', label: '週期', hint: '數值越小，圖案越密', type: 'number', min: 4, max: 160, step: 1, unit: 'px' },
    { key: 'thickness', label: '線寬', hint: '兩條線的間距等於線寬', type: 'number', min: 1, max: 16, step: 1, unit: 'px' },
    { key: 'angle', label: '角度', hint: '0 為橫條，90 為直條', type: 'number', min: 0, max: 180, step: 1, unit: 'deg' },
  ],
  validate: (v) => (v.thickness * 3 >= v.gap ? { thickness: '線寬 × 3 需小於週期' } : {}),
  toTokens: (v) => ({
    '--bpl-double-stripes-color': v.color,
    '--bpl-double-stripes-opacity': v.opacity / 100,
    '--bpl-double-stripes-gap': `${v.gap}px`,
    '--bpl-double-stripes-thickness': `${v.thickness}px`,
    '--bpl-double-stripes-angle': `${v.angle}deg`,
  }),
  css: doubleStripesCss,
};
