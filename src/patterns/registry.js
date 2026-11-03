// @ts-check
// 新增 pattern：import 後加入 patterns 陣列即可，順序即為清單顯示順序
import { dotsPattern } from './dots/index.js';
import { gridPattern } from './grid/index.js';
import { stripesPattern } from './stripes/index.js';
import { crossPattern } from './cross/index.js';

/** @type {import('./types').PatternDefinition[]} */
export const patterns = [dotsPattern, gridPattern, stripesPattern, crossPattern];

export const DEFAULT_PATTERN_ID = 'dots';

/** @param {string} id */
export function getPattern(id) {
  const pattern = patterns.find((p) => p.id === id);
  if (!pattern) throw new Error(`Unknown pattern: ${id}`);
  return pattern;
}
