// 與匯出相同的兩層 DOM；token 來自 className 對應的 CSS，或 inline style
export function BackgroundPreview({ patternId, className = '', style }) {
  return (
    <div className={`bpl-bg ${className}`.trim()} style={style} aria-hidden="true">
      <div className="bpl-bg__base" />
      <div className={`bpl-${patternId}`} />
    </div>
  );
}
