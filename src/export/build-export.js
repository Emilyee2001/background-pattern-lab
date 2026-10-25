// @ts-check
// 從 applied 產生固定的匯出快照，與輸出格式無關
import { baseCss, baseToTokens } from '../patterns/_shared/index.js';
import { getPattern } from '../patterns/registry.js';

/**
 * @typedef {object} ExportSnapshot
 * @property {string} patternId
 * @property {string} patternName
 * @property {string} componentName
 * @property {string} variant
 * @property {Record<string, string | number>} tokens
 * @property {string[]} sharedCss   共用規則：根元素／底色層、該 pattern 規則
 */

/**
 * @param {{ patternId: string, pattern: Record<string, any>, base: { color: string, opacity: number } }} applied
 * @returns {ExportSnapshot}
 */
export function buildExportSnapshot(applied) {
  const pattern = getPattern(applied.patternId);
  return {
    patternId: pattern.id,
    patternName: pattern.name,
    componentName: pattern.componentName,
    variant: 'default',
    tokens: { ...baseToTokens(applied.base), ...pattern.toTokens(applied.pattern) },
    sharedCss: [baseCss, pattern.css],
  };
}
