import { baseToTokens } from '../patterns/_shared/index.js';

// 與匯出相同的兩層 DOM；token 以 inline style 設在根元素上
export function BackgroundPreview({ pattern, values, base }) {
  const tokens = { ...baseToTokens(base), ...pattern.toTokens(values) };
  return (
    <div className="bpl-bg" style={tokens} aria-hidden="true">
      <div className="bpl-bg__base" />
      <div className={`bpl-${pattern.id}`} />
    </div>
  );
}
