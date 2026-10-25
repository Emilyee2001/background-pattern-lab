// @ts-check
import './cross.css';
import crossCss from './cross.css?raw';
import { COMMON_PATTERN_DEFAULTS } from '../common-controls.js';

/** @type {import('../types').PatternDefinition} */
export const crossPattern = {
  id: 'cross',
  name: '十字紋',
  componentName: 'CrossBackground',
  defaults: { gap: 32, length: 9, thickness: 1, ...COMMON_PATTERN_DEFAULTS },
  controls: [
    { key: 'gap', label: '間距', hint: '數值越小，圖案越密', type: 'number', min: 12, max: 120, step: 1, unit: 'px' },
    { key: 'length', label: '臂長', type: 'number', min: 3, max: 60, step: 1, unit: 'px' },
    { key: 'thickness', label: '線寬', type: 'number', min: 1, max: 8, step: 1, unit: 'px' },
  ],
  validate: (v) => {
    /** @type {Record<string, string>} */
    const errors = {};
    if (v.length > v.gap) errors.length = '臂長不可大於間距';
    if (v.thickness >= v.length) errors.thickness = '線寬需小於臂長';
    return errors;
  },
  toTokens: (v) => ({
    '--bpl-cross-color': v.color,
    '--bpl-cross-opacity': v.opacity / 100,
    '--bpl-cross-gap': `${v.gap}px`,
    '--bpl-cross-length': `${v.length}px`,
    '--bpl-cross-thickness': `${v.thickness}px`,
  }),
  css: crossCss,
};
