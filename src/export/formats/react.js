// @ts-check
// React 輸出格式：JSX 只負責 class 結構，所有繪製都在 CSS
import { buildBaseDefaultTokenCss, buildPatternDefaultTokenCss, buildTokenCss } from '../token-css.js';

/** @param {import('../build-export').ExportSnapshot} s */
function toJsx(s) {
  return `export default function ${s.componentName}({ variant = '${s.variant}', className = '' }) {
  return (
    <div className={\`bpl-bg bpl-${s.patternId}--\${variant} \${className}\`.trim()} aria-hidden="true">
      <div className="bpl-bg__base" />
      <div className="bpl-${s.patternId}" />
    </div>
  );
}
`;
}

/** @param {string[]} parts */
const joinCss = (parts) => `${parts.map((css) => css.trim()).join('\n\n')}\n`;

export const reactFormat = {
  id: 'react',
  label: 'React',
  /** @param {import('../build-export').ExportSnapshot} snapshot */
  toCode: (snapshot) => ({
    jsx: toJsx(snapshot),
    // 前半為所有 BPL 背景共用的根元素與底色層，後半為此 pattern 專屬
    sharedCss: joinCss([
      snapshot.css.base,
      buildBaseDefaultTokenCss(snapshot),
      snapshot.css.pattern,
      buildPatternDefaultTokenCss(snapshot),
    ]),
    tokenCss: buildTokenCss(snapshot),
  }),
};
