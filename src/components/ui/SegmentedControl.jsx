// 單選切換列；options: [{ value, label, icon? }]
export function SegmentedControl({ label, value, options, onChange, className = '' }) {
  return (
    <div
      role="group"
      aria-label={label}
      className={`inline-flex rounded-lg bg-ink/6 p-0.5 ring-1 ring-ink/5 ${className}`}
    >
      {options.map((option) => {
        const selected = option.value === value;
        return (
          <button
            key={option.value}
            type="button"
            aria-pressed={selected}
            onClick={() => onChange(option.value)}
            className={`inline-flex h-7 items-center gap-1.5 rounded-md px-2.5 text-xs font-medium transition focus-visible:outline-2 focus-visible:outline-accent ${
              selected ? 'bg-white text-ink shadow-sm' : 'text-ink-muted hover:text-ink'
            }`}
          >
            {option.icon}
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
