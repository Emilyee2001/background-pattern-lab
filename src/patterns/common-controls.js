// @ts-check
// 顏色、透明度等共通欄位。pattern 與底色共用同一份定義。

/** @type {import('./types').ColorControl} */
export const colorControl = { key: 'color', label: '顏色', type: 'color', alphaKey: 'opacity' };

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

/** 每款 pattern 都有的共通欄位，接在 pattern 專屬欄位之後；pattern 有 colorControls 時改用它 */
export const commonPatternControls = [colorControl, opacityControl];

export const COMMON_PATTERN_DEFAULTS = { color: '#64748B', opacity: 40 };

/** 雙色 pattern 的預設值：兩色都用中性灰，深淺不同以便區分 */
export const DUAL_COLOR_DEFAULTS = { ...COMMON_PATTERN_DEFAULTS, secondaryColor: '#94A3B8', secondaryOpacity: 40 };

/**
 * 雙色 pattern 的顏色欄位：主色沿用 color／opacity，副色為 secondaryColor／secondaryOpacity。
 * 參數只影響顯示名稱（例如「花朵」「葉子」），key 與 token 名稱固定。
 * @param {string} primaryName
 * @param {string} secondaryName
 * @returns {import('./types').PatternControl[]}
 */
export function createDualColorControls(primaryName, secondaryName) {
  return [
    { ...colorControl, label: `${primaryName}顏色` },
    { ...opacityControl, label: `${primaryName}透明度` },
    { key: 'secondaryColor', label: `${secondaryName}顏色`, type: 'color', alphaKey: 'secondaryOpacity' },
    { ...opacityControl, key: 'secondaryOpacity', label: `${secondaryName}透明度` },
  ];
}

/**
 * 取得某款 pattern 的完整欄位清單（專屬欄位 + 顏色欄位）
 * @param {import('./types').PatternDefinition} pattern
 */
export function getPatternControls(pattern) {
  return [...pattern.controls, ...(pattern.colorControls ?? commonPatternControls)];
}
