// @ts-check
// 從 applied 產生固定的匯出快照，與輸出格式無關
import { ATTACHMENT_DEFAULT, BASE_DEFAULTS, attachmentToTokens, baseCss, baseToTokens } from '../patterns/_shared/index.js';
import { getPattern } from '../patterns/registry.js';
import { getBreakpoint } from './breakpoints.js';

/**
 * @typedef {object} ExportSnapshot
 * @property {string} patternId
 * @property {string} patternName
 * @property {string} componentName
 * @property {string} variant
 * @property {import('../patterns/_shared/index.js').Attachment} attachment  捲動方式（已套用 forcedAttachment）
 * @property {Record<string, string | number>} tokens   預設（最小尺寸）的全部 token
 * @property {{ id: string, minWidth: string, tokens: Record<string, string | number> }[]} breakpoints
 *   各斷點只含與上一層不同的 token
 * @property {{ base: Record<string, string | number>, pattern: Record<string, string | number> }} defaultTokens
 *   variant 未定義時的後備：base 為捲動方式與底色（所有 pattern 共用），pattern 為該 pattern 的預設值（含 forcedAttachment）
 * @property {{ base: string, pattern: string }} css  base 為根元素與底色層（每個專案一份），pattern 為該 pattern 的規則
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
 *   base: { enabled: boolean, color: string, opacity: number },
 *   attachment: import('../patterns/_shared/index.js').Attachment,
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
    attachment: applied.attachment,
    tokens: {
      ...attachmentToTokens(applied.attachment),
      ...baseToTokens(applied.base),
      ...pattern.toTokens(applied.pattern),
    },
    breakpoints,
    defaultTokens: {
      base: { ...attachmentToTokens(ATTACHMENT_DEFAULT), ...baseToTokens(BASE_DEFAULTS) },
      pattern: {
        ...(pattern.forcedAttachment && attachmentToTokens(pattern.forcedAttachment)),
        ...pattern.toTokens(pattern.defaults),
      },
    },
    css: { base: baseCss, pattern: pattern.css },
  };
}
