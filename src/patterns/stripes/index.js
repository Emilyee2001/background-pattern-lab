// @ts-check
import './stripes.css';
import stripesCss from './stripes.css?raw';
import { COMMON_PATTERN_DEFAULTS } from '../common-controls.js';

/** @type {import('../types').PatternDefinition} */
export const stripesPattern = {
  id: 'stripes',
  name: '條紋',
  componentName: 'StripesBackground',
  defaults: { gap: 36, thickness: 1, angle: 135, ...COMMON_PATTERN_DEFAULTS },
  previewValues: { gap: 28 },
  controls: [
    { key: 'gap', label: '週期', hint: '數值越小，圖案越密', type: 'number', min: 4, max: 160, step: 1, unit: 'px' },
    { key: 'thickness', label: '線寬', type: 'number', min: 1, max: 40, step: 1, unit: 'px' },
    { key: 'angle', label: '角度', hint: '0 為橫條，90 為直條', type: 'number', min: 0, max: 180, step: 1, unit: 'deg' },
  ],
  validate: (v) => (v.thickness >= v.gap ? { thickness: '線寬需小於週期' } : {}),
  toTokens: (v) => ({
    '--bpl-stripes-color': v.color,
    '--bpl-stripes-opacity': v.opacity / 100,
    '--bpl-stripes-gap': `${v.gap}px`,
    '--bpl-stripes-thickness': `${v.thickness}px`,
    '--bpl-stripes-angle': `${v.angle}deg`,
  }),
  css: stripesCss,
};
