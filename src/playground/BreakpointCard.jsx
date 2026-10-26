import { Button } from '../components/ui/Button.jsx';
import { Card, CardHeader } from '../components/ui/Card.jsx';
import { CloseIcon, PlusIcon } from '../components/ui/icons.jsx';
import { getBreakpoint } from '../export/breakpoints.js';
import { getPatternControls } from '../patterns/common-controls.js';
import { ControlFields } from './ControlFields.jsx';
import { LevelHeader } from './LevelHeader.jsx';

// RWD 斷點的 pattern 參數組
export function BreakpointCard({ level, state, active, removable, className = '' }) {
  const { pattern, patternDraft, patternValid, patternErrors, actions } = state;
  const bp = getBreakpoint(level);

  return (
    <Card aria-label={`${level} 斷點參數`} className={className}>
      <CardHeader
        extra={<LevelHeader name={level} range={`≥ ${bp.px}px`} active={active} />}
        aside={
          removable && (
            <Button
              variant="ghost"
              size="icon"
              className="-my-1.5 -mr-1.5"
              onClick={() => actions.removeBreakpoint(level)}
              aria-label={`刪除 ${level} 斷點`}
              title={`刪除 ${level} 斷點`}
            >
              <CloseIcon />
            </Button>
          )
        }
      />
      <ControlFields
        idPrefix={`pattern-${pattern.id}-${level}`}
        controls={getPatternControls(pattern)}
        draft={patternDraft[level]}
        applied={patternValid[level]}
        errors={patternErrors[level]}
        onChange={(key, value) => actions.setField(level, key, value)}
        onBlur={(key) => actions.normalizeColor(level, key)}
      />
    </Card>
  );
}

// 尚未加入的斷點：虛線佔位，點擊新增
export function AddBreakpointCard({ breakpoint, onAdd, className = '' }) {
  return (
    <button
      type="button"
      onClick={onAdd}
      className={`flex min-h-28 flex-col items-center justify-center gap-1.5 rounded-card border-2 border-dashed border-ink/15 bg-white/35 p-5 text-ink-muted transition hover:border-accent/50 hover:bg-white/65 hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent ${className}`}
    >
      <PlusIcon className="size-5" />
      <span className="text-sm font-medium">新增 {breakpoint.id} 斷點</span>
      <span className="font-mono text-xs tabular-nums">≥ {breakpoint.px}px</span>
    </button>
  );
}
