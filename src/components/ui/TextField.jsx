// 文字欄位：標籤、範圍、前綴/單位、提示與錯誤訊息
export function TextField({
  id,
  label,
  meta,
  hint,
  error,
  prefix,
  unit,
  value,
  onChange,
  onBlur,
  inputMode,
  maxLength,
  disabled = false,
}) {
  const messageId = `${id}-message`;
  const message = error || hint;

  return (
    <div className={`flex min-w-0 flex-col gap-1.5 transition-opacity ${disabled ? 'opacity-45' : ''}`}>
      <div className="flex items-baseline justify-between gap-2">
        <label htmlFor={id} className="text-xs font-medium text-ink">
          {label}
        </label>
        {meta && <span className="text-[11px] tabular-nums text-ink-subtle">{meta}</span>}
      </div>
      <div
        className={`flex h-10 items-center gap-2 rounded-field bg-field px-3 ring-1 transition focus-within:ring-2 ${
          error
            ? 'ring-danger/60 focus-within:ring-danger'
            : 'ring-ink/10 focus-within:ring-accent'
        }`}
      >
        {prefix}
        <input
          id={id}
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onBlur={onBlur}
          inputMode={inputMode}
          maxLength={maxLength}
          disabled={disabled}
          spellCheck={false}
          autoComplete="off"
          aria-invalid={error ? true : undefined}
          aria-describedby={message ? messageId : undefined}
          className="min-w-0 flex-1 bg-transparent font-mono disabled:cursor-not-allowed text-sm tabular-nums text-ink outline-none placeholder:text-ink-subtle"
        />
        {unit && <span className="text-xs text-ink-subtle">{unit}</span>}
      </div>
      {message && (
        <p
          id={messageId}
          className={`text-[11px] leading-snug ${error ? 'font-medium text-danger' : 'text-ink-subtle'}`}
        >
          {message}
        </p>
      )}
    </div>
  );
}
