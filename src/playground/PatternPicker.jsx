import { BASE_DEFAULTS, baseToTokens } from '../patterns/_shared/index.js';
import { BackgroundPreview } from './BackgroundPreview.jsx';

// Pattern 清單：示意圖直接用該 pattern 的 CSS 與預設值繪製
export function PatternPicker({ patterns, selectedId, onSelect }) {
  return (
    <div role="group" aria-label="選擇圖案" className="grid grid-cols-4 gap-2">
      {patterns.map((pattern) => {
        const selected = pattern.id === selectedId;
        return (
          <button
            key={pattern.id}
            type="button"
            aria-pressed={selected}
            onClick={() => onSelect(pattern.id)}
            className={`group flex flex-col gap-1.5 rounded-xl p-1.5 text-center transition focus-visible:outline-2 focus-visible:outline-accent ${
              selected ? 'bg-white/80 shadow-sm ring-2 ring-accent' : 'ring-1 ring-ink/8 hover:bg-white/50'
            }`}
          >
            <span className="relative isolate block aspect-square overflow-hidden rounded-lg ring-1 ring-ink/8">
              <BackgroundPreview
                patternId={pattern.id}
                style={{ ...baseToTokens(BASE_DEFAULTS), ...pattern.toTokens(pattern.defaults) }}
              />
            </span>
            <span className={`text-xs ${selected ? 'font-semibold text-ink' : 'text-ink-muted group-hover:text-ink'}`}>
              {pattern.name}
            </span>
          </button>
        );
      })}
    </div>
  );
}
