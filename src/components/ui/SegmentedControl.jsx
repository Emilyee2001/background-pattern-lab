import { useRef } from 'react';

// 分段切換：role="tablist"，方向鍵／Home／End 移動並直接切換。
// 對應的內容區塊由使用端加上 role="tabpanel"，id 為 `${idPrefix}-panel-${value}`、aria-labelledby 為 `${idPrefix}-tab-${value}`
export function SegmentedControl({ idPrefix, label, options, value, onChange, className = '' }) {
  const tabs = useRef([]);

  function handleKeyDown(e, index) {
    const last = options.length - 1;
    const next = { ArrowRight: index + 1, ArrowLeft: index - 1, Home: 0, End: last }[e.key];
    if (next === undefined) return;
    e.preventDefault();
    const target = next < 0 ? last : next > last ? 0 : next;
    onChange(options[target].value);
    tabs.current[target]?.focus();
  }

  return (
    <div role="tablist" aria-label={label} className={`inline-flex gap-1 rounded-field bg-primary/6 p-1 ${className}`}>
      {options.map((option, i) => {
        const selected = option.value === value;
        return (
          <button
            key={option.value}
            ref={(el) => {
              tabs.current[i] = el;
            }}
            type="button"
            role="tab"
            id={`${idPrefix}-tab-${option.value}`}
            aria-selected={selected}
            aria-controls={`${idPrefix}-panel-${option.value}`}
            tabIndex={selected ? 0 : -1}
            onClick={() => onChange(option.value)}
            onKeyDown={(e) => handleKeyDown(e, i)}
            className={`h-8 rounded-lg px-3 text-xs font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent ${
              selected ? 'bg-white text-primary shadow-sm ring-1 ring-primary/8' : 'text-secondary hover:text-primary'
            }`}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
