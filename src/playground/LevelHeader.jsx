// Pattern 參數組的標頭：level 名稱、適用寬度、是否生效中
export function LevelHeader({ name, range, active }) {
  return (
    <div className="flex min-w-0 items-center gap-2">
      <span className="rounded-md bg-ink px-1.5 py-0.5 font-mono text-[11px] font-semibold text-white">{name}</span>
      <span className="font-mono text-xs tabular-nums text-ink-muted">{range}</span>
      {active && (
        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/12 px-2 py-0.5 text-[11px] font-medium text-emerald-700">
          <span className="size-1.5 rounded-full bg-emerald-500" aria-hidden="true" />
          生效中
        </span>
      )}
    </div>
  );
}
