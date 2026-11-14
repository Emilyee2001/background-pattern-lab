import { useState } from 'react';
import { Button } from '../components/ui/Button.jsx';
import { CardHeader } from '../components/ui/Card.jsx';
import { ChevronDownIcon } from '../components/ui/icons.jsx';
import { BASE_DEFAULTS, attachmentToTokens, baseToTokens } from '../patterns/_shared/index.js';
import { BackgroundPreview } from './BackgroundPreview.jsx';
import { useMediaQuery } from './useMediaQuery.js';

// 每列格數，需與下方 grid 的 grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 一致
function useColumnCount() {
  const sm = useMediaQuery('(min-width: 40rem)');
  const lg = useMediaQuery('(min-width: 64rem)');
  return lg ? 6 : sm ? 4 : 2;
}

// 收合時只顯示第一列；選中的 pattern 不在第一列時，取代最後一格，確保永遠看得到
function getCollapsedPatterns(patterns, selectedId, count) {
  const firstRow = patterns.slice(0, count);
  if (firstRow.some((p) => p.id === selectedId)) return firstRow;
  return [...firstRow.slice(0, -1), patterns.find((p) => p.id === selectedId)];
}

// Pattern 清單：示意圖直接用該 pattern 的 CSS 與預設值（可由 previewValues 覆寫）繪製。超過一列時可收合
export function PatternPicker({ patterns, selectedId, onSelect }) {
  const [expanded, setExpanded] = useState(false);
  const columns = useColumnCount();
  const canCollapse = patterns.length > columns;
  const visiblePatterns = canCollapse && !expanded ? getCollapsedPatterns(patterns, selectedId, columns) : patterns;

  return (
    <>
      <CardHeader
        title="Pattern"
        aside={
          canCollapse && (
            <Button
              variant="ghost"
              size="sm"
              className="-my-1.5 -mr-1.5"
              onClick={() => setExpanded((v) => !v)}
              aria-expanded={expanded}
              aria-controls="pattern-picker"
            >
              {expanded ? '收合' : `全部 ${patterns.length} 款`}
              <ChevronDownIcon className={`size-3.5 transition-transform ${expanded ? 'rotate-180' : ''}`} />
            </Button>
          )
        }
      />
      <div id="pattern-picker" role="group" aria-label="選擇圖案" className="grid grid-cols-2 gap-2.5 sm:grid-cols-4 lg:grid-cols-6">
        {visiblePatterns.map((pattern) => {
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
                {/* 示意圖固定在格子內，不跟著設定改成 fixed */}
                <BackgroundPreview
                  patternId={pattern.id}
                  style={{
                    ...attachmentToTokens('scroll'),
                    ...baseToTokens(BASE_DEFAULTS),
                    ...pattern.toTokens({ ...pattern.defaults, ...pattern.previewValues }),
                  }}
                />
              </span>
              <span className={`text-xs ${selected ? 'font-semibold text-ink' : 'text-ink-muted group-hover:text-ink'}`}>
                {pattern.name}
              </span>
            </button>
          );
        })}
      </div>
    </>
  );
}
