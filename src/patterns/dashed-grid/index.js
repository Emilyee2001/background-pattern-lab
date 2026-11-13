// @ts-check
import './dashed-grid.css';
import dashedGridCss from './dashed-grid.css?raw';
import { COMMON_PATTERN_DEFAULTS } from '../common-controls.js';

/** @type {import('../types').PatternDefinition} */
export const dashedGridPattern = {
  id: 'dashed-grid',
  name: '虛線網格',
  componentName: 'DashedGridBackground',
  defaults: { gap: 36, dashes: 8, thickness: 1, ...COMMON_PATTERN_DEFAULTS },
  previewValues: { gap: 32 },
  // 範圍讓虛線段最短 2px（格距 32 ÷ 8 段 ÷ 2），線寬也一定小於格距，所以不需要跨欄位驗證
  controls: [
    { key: 'gap', label: '格距', hint: '數值越小，圖案越密', type: 'number', min: 32, max: 160, step: 1, unit: 'px' },
    { key: 'dashes', label: '段數', hint: '每格邊長切成幾段虛線', type: 'number', min: 1, max: 8, step: 1 },
    { key: 'thickness', label: '線寬', type: 'number', min: 1, max: 4, step: 1, unit: 'px' },
  ],
  toTokens: (v) => ({
    '--bpl-dashed-grid-color': v.color,
    '--bpl-dashed-grid-opacity': v.opacity / 100,
    '--bpl-dashed-grid-gap': `${v.gap}px`,
    '--bpl-dashed-grid-dashes': v.dashes,
    '--bpl-dashed-grid-thickness': `${v.thickness}px`,
  }),
  css: dashedGridCss,
};
