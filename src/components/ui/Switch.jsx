// 開關：role="switch"，標籤文字在左
export function Switch({ label, checked, onChange }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className="group inline-flex items-center gap-2 rounded-full text-[11px] font-semibold tracking-[0.08em] text-ink-muted focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
    >
      {label}
      <span
        className={`relative inline-flex h-5 w-9 items-center rounded-full p-0.5 ring-1 transition-colors ${
          checked ? 'bg-accent ring-accent' : 'bg-ink/12 ring-ink/10'
        }`}
      >
        <span
          className={`size-4 rounded-full bg-white shadow-sm transition-transform ${checked ? 'translate-x-4' : ''}`}
        />
      </span>
    </button>
  );
}
