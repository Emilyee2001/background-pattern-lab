// @ts-check
// 從 applied 產生固定的匯出快照，與輸出格式無關
import { BASE_DEFAULTS, baseCss, baseToTokens } from '../patterns/_shared/index.js';
import { getPattern } from '../patterns/registry.js';
import { getBreakpoint } from './breakpoints.js';

/**
 * @typedef {object} ExportSnapshot
 * @property {string} patternId
 * @property {string} patternName
 * @property {string} componentName
 * @property {string} variant
 * @property {Record<string, string | number>} tokens   預設（最小尺寸）的全部 token
 * @property {{ id: string, minWidth: string, tokens: Record<string, string | number> }[]} breakpoints
 *   各斷點只含與上一層不同的 token
 * @property {Record<string, string | number>} defaultTokens  底色與 pattern 的預設值，variant 未定義時的後備
 * @property {string[]} sharedCss   共用規則：根元素／底色層、該 pattern 規則
 */

/** 只保留 next 中與 prev 不同的 token */
function diffTokens(prev, next) {
  return Object.fromEntries(Object.entries(next).filter(([name, value]) => prev[name] !== value));
}

/**
 * @param {{
 *   patternId: string,
 *   pattern: Record<string, any>,
 *   breakpoints: { id: string, values: Record<string, any> }[],
 *   base: { color: string, opacity: number },
 * }} applied
 * @returns {ExportSnapshot}
 */
export function buildExportSnapshot(applied) {
  const pattern = getPattern(applied.patternId);

  let prev = pattern.toTokens(applied.pattern);
  const breakpoints = applied.breakpoints.map(({ id, values }) => {
    const next = pattern.toTokens(values);
    const tokens = diffTokens(prev, next);
    prev = next;
    return { id, minWidth: getBreakpoint(id).minWidth, tokens };
  });

  return {
    patternId: pattern.id,
    patternName: pattern.name,
    componentName: pattern.componentName,
    variant: 'default',
    tokens: { ...baseToTokens(applied.base), ...pattern.toTokens(applied.pattern) },
    breakpoints,
    defaultTokens: { ...baseToTokens(BASE_DEFAULTS), ...pattern.toTokens(pattern.defaults) },
    sharedCss: [baseCss, pattern.css],
  };
}
