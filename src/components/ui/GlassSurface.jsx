// 半透明玻璃表面：blur + 頂部高光 + 斜向 gloss
export function GlassSurface({ as: Tag = 'div', className = '', children, ...props }) {
  return (
    <Tag
      className={`relative rounded-panel border border-glass-border bg-glass-background shadow-glass backdrop-blur-xl backdrop-saturate-150 before:pointer-events-none before:absolute before:inset-0 before:rounded-[inherit] before:bg-[linear-gradient(135deg,rgb(255_255_255/0.55)_0%,rgb(255_255_255/0.12)_38%,transparent_60%)] ${className}`}
      {...props}
    >
      {children}
    </Tag>
  );
}
