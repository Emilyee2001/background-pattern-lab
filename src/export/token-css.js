// @ts-check
// Token CSS 產生器：預覽（Stage 的 <style>）與匯出共用同一份輸出

/** @param {Record<string, string | number>} tokens @param {string} indent */
function declarations(tokens, indent) {
  return Object.entries(tokens).map(([name, value]) => `${indent}${name}: ${value};`).join('\n');
}

/**
 * 預設 token 區塊：specificity 為 0，任何 variant 的 token 都能覆寫；
 * variant 打錯或未定義時，背景退回 pattern 預設樣式而不是整個消失
 * @param {import('./build-export').ExportSnapshot} s
 */
export function buildDefaultTokenCss(s) {
  return `@layer components {\n  :where(.bpl-bg) {\n${declarations(s.defaultTokens, '    ')}\n  }\n}\n`;
}

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
