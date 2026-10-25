// @ts-check
// 顏色、透明度等共通欄位。pattern 與底色共用同一份定義。

/** @type {import('./types').ColorControl} */
export const colorControl = { key: 'color', label: '顏色', type: 'color' };

/** @type {import('./types').NumberControl} */
export const opacityControl = {
  key: 'opacity',
  label: '透明度',
  type: 'number',
  min: 0,
  max: 100,
  step: 1,
  unit: '%',
};

/** 每款 pattern 都有的共通欄位，接在 pattern 專屬欄位之後 */
export const commonPatternControls = [colorControl, opacityControl];

export const COMMON_PATTERN_DEFAULTS = { color: '#64748B', opacity: 40 };

/**
 * 取得某款 pattern 的完整欄位清單（專屬欄位 + 共通欄位）
 * @param {import('./types').PatternDefinition} pattern
 */
export function getPatternControls(pattern) {
  return [...pattern.controls, ...commonPatternControls];
}
