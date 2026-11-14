// @ts-check
import './cross.css';
import crossCss from './cross.css?raw';
import { COMMON_PATTERN_DEFAULTS } from '../common-controls.js';

/** @type {import('../types').PatternDefinition} */
export const crossPattern = {
  id: 'cross',
  name: '十字線',
  componentName: 'CrossBackground',
  // 中心點以容器大小計算：固定時以畫面為準，頁面再長，中心點也不會跑出畫面
  forcedAttachment: 'fixed',
  defaults: {
    horizontalLength: 0,
    verticalLength: 0,
    thickness: 1,
    angle: 0,
    centerX: 50,
    centerY: 50,
    ...COMMON_PATTERN_DEFAULTS,
  },
  controls: [
    { key: 'horizontalLength', label: '水平線長度', hint: '0 為無限延伸', type: 'number', min: 0, max: 2000, step: 1, unit: 'px' },
    { key: 'verticalLength', label: '垂直線長度', hint: '0 為無限延伸', type: 'number', min: 0, max: 2000, step: 1, unit: 'px' },
    { key: 'thickness', label: '線寬', type: 'number', min: 1, max: 8, step: 1, unit: 'px' },
    { key: 'angle', label: '旋轉', hint: '0 時兩條線為水平與垂直', type: 'number', min: 0, max: 180, step: 1, unit: 'deg' },
    { key: 'centerX', label: '中心點 X', hint: '0 為左緣，100 為右緣', type: 'number', min: 0, max: 100, step: 1, unit: '%' },
    { key: 'centerY', label: '中心點 Y', hint: '0 為上緣，100 為下緣', type: 'number', min: 0, max: 100, step: 1, unit: '%' },
  ],
  toTokens: (v) => ({
    '--bpl-cross-color': v.color,
    '--bpl-cross-opacity': v.opacity / 100,
    '--bpl-cross-horizontal-length': `${v.horizontalLength}px`,
    '--bpl-cross-vertical-length': `${v.verticalLength}px`,
    '--bpl-cross-thickness': `${v.thickness}px`,
    '--bpl-cross-angle': `${v.angle}deg`,
    '--bpl-cross-center-x': `${v.centerX}%`,
    '--bpl-cross-center-y': `${v.centerY}%`,
  }),
  css: crossCss,
};
