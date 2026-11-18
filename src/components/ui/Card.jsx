// 玻璃 panel 內的白色內容區塊，確保任何底色下都清楚可讀
export function Card({ as: Tag = 'section', className = '', children, ...props }) {
  return (
    <Tag
      className={`relative flex flex-col gap-5 rounded-card bg-white/92 p-5 shadow-xs shadow-primary/6 ring-1 ring-primary/6 ${className}`}
      {...props}
    >
      {children}
    </Tag>
  );
}

// 區塊標題列：左側標題（可附加內容），右側操作；寬度不足時右側操作換到下一行並靠右
export function CardHeader({ title, extra, aside }) {
  return (
    <div className="flex min-h-6 flex-wrap items-center gap-2">
      {title && <h2 className="text-[11px] font-semibold tracking-[0.14em] text-secondary uppercase">{title}</h2>}
      {extra}
      {aside && <div className="ml-auto flex items-center">{aside}</div>}
    </div>
  );
}
