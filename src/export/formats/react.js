// @ts-check
// React 輸出格式：JSX 只負責 class 結構，所有繪製都在 CSS

/** @param {import('../build-export').ExportSnapshot} s */
function toJsx(s) {
  return `export function ${s.componentName}({ variant = '${s.variant}', className = '' }) {
  return (
    <div className={\`bpl-bg bpl-${s.patternId}--\${variant} \${className}\`.trim()} aria-hidden="true">
      <div className="bpl-bg__base" />
      <div className="bpl-${s.patternId}" />
    </div>
  );
}
`;
}

/** @param {import('../build-export').ExportSnapshot} s */
function toSharedCss(s) {
  return `${s.sharedCss.map((css) => css.trim()).join('\n\n')}\n`;
}

/** @param {import('../build-export').ExportSnapshot} s */
function toTokenCss(s) {
  const lines = Object.entries(s.tokens).map(([name, value]) => `    ${name}: ${value};`);
  return `@layer components {
  .bpl-${s.patternId}--${s.variant} {
${lines.join('\n')}
  }
}
`;
}

export const reactFormat = {
  id: 'react',
  label: 'React',
  /** @param {import('../build-export').ExportSnapshot} snapshot */
  toCode: (snapshot) => ({
    jsx: toJsx(snapshot),
    sharedCss: toSharedCss(snapshot),
    tokenCss: toTokenCss(snapshot),
  }),
};
