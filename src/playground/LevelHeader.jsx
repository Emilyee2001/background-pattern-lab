// Pattern 參數組的標示：level 名稱、適用寬度（可省略）、是否生效中
export function LevelHeader({ name, range, active }) {
  return (
    <div className="flex min-w-0 items-center gap-1.5">
      <span className="rounded-md bg-primary px-1.5 py-0.5 font-mono text-[11px] font-semibold text-white">{name}</span>
      {range && <span className="font-mono text-xs whitespace-nowrap tabular-nums text-secondary">{range}</span>}
      {active && (
        <span className="inline-flex items-center gap-1 rounded-full bg-success/12 px-2 py-0.5 text-[11px] font-medium whitespace-nowrap text-success">
          <span className="size-1.5 rounded-full bg-success" aria-hidden="true" />
          <span>生效中</span>
        </span>
      )}
    </div>
  );
}
