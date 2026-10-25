// @ts-check
import './grid.css';
import gridCss from './grid.css?raw';
import { COMMON_PATTERN_DEFAULTS } from '../common-controls.js';

/** @type {import('../types').PatternDefinition} */
export const gridPattern = {
  id: 'grid',
  name: '網格',
  componentName: 'GridBackground',
  defaults: { gap: 32, thickness: 1, ...COMMON_PATTERN_DEFAULTS },
  controls: [
    { key: 'gap', label: '格距', hint: '數值越小，圖案越密', type: 'number', min: 8, max: 120, step: 1, unit: 'px' },
    { key: 'thickness', label: '線寬', type: 'number', min: 1, max: 8, step: 1, unit: 'px' },
  ],
  validate: (v) => (v.thickness >= v.gap ? { thickness: '線寬需小於格距' } : {}),
  toTokens: (v) => ({
    '--bpl-grid-color': v.color,
    '--bpl-grid-opacity': v.opacity / 100,
    '--bpl-grid-gap': `${v.gap}px`,
    '--bpl-grid-thickness': `${v.thickness}px`,
  }),
  css: gridCss,
};
