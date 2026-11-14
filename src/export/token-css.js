// @ts-check
// Token CSS 產生器：預覽（Stage 的 <style>）與匯出共用同一份輸出

/** @param {Record<string, string | number>} tokens @param {string} indent */
function declarations(tokens, indent) {
  return Object.entries(tokens).map(([name, value]) => `${indent}${name}: ${value};`).join('\n');
}

/**
 * 預設 token 區塊：specificity 為 0，任何 variant 的 token 都能覆寫；
 * variant 打錯或未定義時，背景退回預設樣式而不是整個消失
 * @param {string} selector @param {Record<string, string | number>} tokens
 */
function defaultBlock(selector, tokens) {
  return `@layer components {\n  ${selector} {\n${declarations(tokens, '    ')}\n  }\n}\n`;
}

/** 根元素與底色層的預設 token，所有 pattern 共用 @param {import('./build-export').ExportSnapshot} s */
export const buildBaseDefaultTokenCss = (s) => defaultBlock(':where(.bpl-bg)', s.defaultTokens.base);

/**
 * 該 pattern 的預設 token：只套用在含此 pattern 層的根元素，多款 pattern 並存時互不影響
 * @param {import('./build-export').ExportSnapshot} s
 */
export const buildPatternDefaultTokenCss = (s) =>
  defaultBlock(`:where(.bpl-bg:has(> .bpl-${s.patternId}))`, s.defaultTokens.pattern);

/** @param {import('./build-export').ExportSnapshot} s */
export function buildTokenCss(s) {
  const selector = `.bpl-${s.patternId}--${s.variant}`;
  const blocks = [`  ${selector} {\n${declarations(s.tokens, '    ')}\n  }`];

  for (const bp of s.breakpoints) {
    if (Object.keys(bp.tokens).length === 0) continue;
    blocks.push(
      `  @media (min-width: ${bp.minWidth}) { /* ${bp.id} */\n    ${selector} {\n${declarations(bp.tokens, '      ')}\n    }\n  }`,
    );
  }

  return `@layer components {\n${blocks.join('\n')}\n}\n`;
}
