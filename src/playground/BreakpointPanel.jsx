import { Button } from '../components/ui/Button.jsx';
import { GlassSurface } from '../components/ui/GlassSurface.jsx';
import { CloseIcon, PlusIcon } from '../components/ui/icons.jsx';
import { getBreakpoint } from '../export/breakpoints.js';
import { getPatternControls } from '../patterns/common-controls.js';
import { ControlFields } from './ControlFields.jsx';
import { LevelHeader } from './LevelHeader.jsx';

// RWD 斷點的 pattern 參數組
export function BreakpointPanel({ level, state, active, removable, nextBreakpoint }) {
  const { pattern, patternDraft, patternValid, patternErrors, actions } = state;
  const bp = getBreakpoint(level);

  return (
    <GlassSurface className="flex w-full max-w-panel flex-col xl:max-h-[calc(100dvh-2rem)] xl:w-panel-sm xl:shrink-0">
      <header className="relative flex items-center gap-2 px-5 pt-5 pb-4">
        <div className="mr-auto min-w-0">
          <LevelHeader name={level} range={`≥ ${bp.px}px`} active={active} />
        </div>
        {removable && (
          <Button
            variant="ghost"
            size="icon"
            onClick={() => actions.removeBreakpoint(level)}
            aria-label={`刪除 ${level} 斷點`}
            title={`刪除 ${level} 斷點`}
          >
            <CloseIcon />
          </Button>
        )}
      </header>

      <div className="relative min-h-0 flex-1 overflow-y-auto px-5 pt-1 pb-6">
        <ControlFields
          idPrefix={`pattern-${pattern.id}-${level}`}
          controls={getPatternControls(pattern)}
          draft={patternDraft[level]}
          applied={patternValid[level]}
          errors={patternErrors[level]}
          onChange={(key, value) => actions.setField(level, key, value)}
          onBlur={(key) => actions.normalizeColor(level, key)}
        />
      </div>

      {nextBreakpoint && (
        <footer className="relative border-t border-ink/8 px-5 py-4">
          <Button className="w-full" onClick={actions.addBreakpoint}>
            <PlusIcon />
            新增 {nextBreakpoint.id} · ≥ {nextBreakpoint.px}px
          </Button>
        </footer>
      )}
    </GlassSurface>
  );
}
