// 開關：role="switch"，標籤文字在左；disabled 時維持目前狀態、不能切換
export function Switch({ label, checked, disabled = false, onChange }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      disabled={disabled}
      onClick={() => onChange(!checked)}
      className="group inline-flex items-center gap-2 rounded-full text-[11px] font-semibold tracking-[0.08em] text-secondary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent disabled:cursor-not-allowed disabled:opacity-45"
    >
      {label}
      <span
        className={`relative inline-flex h-5 w-9 items-center rounded-full p-0.5 ring-1 transition-colors ${
          checked ? 'bg-accent ring-accent' : 'bg-primary/12 ring-primary/10'
        }`}
      >
        <span
          className={`size-4 rounded-full bg-white shadow-sm transition-transform ${checked ? 'translate-x-4' : ''}`}
        />
      </span>
    </button>
  );
}
