import { Button } from '../components/ui/Button.jsx';
import { Card, CardHeader } from '../components/ui/Card.jsx';
import { GlassSurface } from '../components/ui/GlassSurface.jsx';
import { Switch } from '../components/ui/Switch.jsx';
import { CodeIcon, EyeIcon, EyeOffIcon } from '../components/ui/icons.jsx';
import { BREAKPOINTS } from '../export/breakpoints.js';
import { getPatternControls } from '../patterns/common-controls.js';
import { baseControls } from '../patterns/_shared/index.js';
import { patterns } from '../patterns/registry.js';
import { AddBreakpointCard, BreakpointCard } from './BreakpointCard.jsx';
import { ControlFields } from './ControlFields.jsx';
import { LevelHeader } from './LevelHeader.jsx';
import { PatternPicker } from './PatternPicker.jsx';

// 啟用 RWD 且 ≥ xl 時的雙欄配置。DOM 順序即小尺寸的由上到下順序：
// Pattern → 斷點 → 底色 → 複製按鈕；大尺寸時左欄 Pattern、底色，右欄斷點
// 左欄寬度 = panel 寬度扣掉外框左右內距（xl:px-8），與未啟用 RWD 時一致
const RWD_GRID = 'xl:grid xl:grid-cols-[calc(var(--container-panel)-4rem)_var(--container-panel-sm)] xl:items-start';
const PLACE = {
  pattern: 'xl:col-start-1 xl:row-start-1 xl:row-span-2',
  right: ['xl:col-start-2 xl:row-start-1', 'xl:col-start-2 xl:row-start-2 xl:row-span-2 xl:self-stretch'],
  base: 'xl:col-start-1 xl:row-start-3',
  action: 'xl:col-span-2 xl:row-start-4',
};

export function Panel({ state, activeLevel, collapsed, onToggleCollapsed, onExport, exportButtonRef }) {
  const {
    pattern,
    patternDraft,
    patternValid,
    patternErrors,
    responsive,
    baseDraft,
    baseEnabled,
    baseErrors,
    applied,
    actions,
  } = state;
  const rwd = responsive.enabled;
  const levels = applied.breakpoints.map((bp) => bp.id);
  const nextBreakpoint = rwd ? BREAKPOINTS.find((bp) => !levels.includes(bp.id)) : undefined;
  const place = (cls) => (rwd ? cls : '');

  return (
    <GlassSurface className={`w-full max-w-panel ${rwd ? 'xl:w-auto xl:max-w-none' : ''}`}>
      <header className={`relative flex items-center gap-3 px-5 pt-5 xl:px-8 ${collapsed ? 'pb-5' : 'pb-4'}`}>
        <div className="mr-auto flex items-center gap-2 pl-1">
          <h1 className="text-[15px] font-semibold tracking-tight text-ink">Background Pattern Lab</h1>
          <span className="rounded-md border border-ink/15 bg-white/70 px-1.5 py-0.5 font-mono text-[10px] font-medium text-ink-muted">v1</span>
        </div>
        {/* 收合時用 before 撐滿整條 bar，整條都能點 */}
        <Button
          variant="ghost"
          size="icon"
          onClick={onToggleCollapsed}
          aria-expanded={!collapsed}
          aria-controls="panel-content"
          aria-label={collapsed ? '顯示 panel' : '隱藏 panel'}
          title={collapsed ? '顯示 panel' : '隱藏 panel'}
          className={collapsed ? 'before:absolute before:inset-0 before:rounded-panel' : ''}
        >
          {collapsed ? <EyeIcon /> : <EyeOffIcon />}
        </Button>
      </header>

      {/* 收合時內容留在 DOM 撐住寬度（RWD 雙欄時 panel 是 w-auto），只用 grid-rows 0fr 收起高度，之後可直接加過渡動畫 */}
      <div id="panel-content" inert={collapsed} className={`grid ${collapsed ? 'grid-rows-[0fr]' : 'grid-rows-[1fr]'}`}>
        <div className={`min-h-0 ${collapsed ? 'overflow-hidden' : ''}`}>
          <div className={`relative flex flex-col gap-5 px-5 pb-5 xl:px-8 xl:pb-8 ${rwd ? RWD_GRID : ''}`}>
            <Card aria-label="Pattern" className={place(PLACE.pattern)}>
              <CardHeader
                title="Pattern"
                aside={<Switch label="RWD" checked={rwd} onChange={actions.toggleResponsive} />}
              />
              <PatternPicker patterns={patterns} selectedId={pattern.id} onSelect={actions.selectPattern} />
              {/* 與斷點卡片相同，尺寸標示放在參數區左上角 */}
              {rwd && (
                <CardHeader
                  extra={<LevelHeader name="預設" range={`< ${BREAKPOINTS[0].px}px`} active={activeLevel === 'default'} />}
                />
              )}
              <ControlFields
                idPrefix={`pattern-${pattern.id}-default`}
                controls={getPatternControls(pattern)}
                draft={patternDraft.default}
                applied={patternValid.default}
                errors={patternErrors.default}
                onChange={(key, value) => actions.setField('default', key, value)}
                onBlur={(key) => actions.normalizeColor('default', key)}
              />
            </Card>
    
            {levels.map((level, i) => (
              <BreakpointCard
                key={level}
                level={level}
                state={state}
                active={activeLevel === level}
                removable={i > 0}
                className={place(PLACE.right[i])}
              />
            ))}
            {nextBreakpoint && (
              <AddBreakpointCard
                breakpoint={nextBreakpoint}
                onAdd={actions.addBreakpoint}
                className={place(PLACE.right[levels.length])}
              />
            )}
    
            <Card aria-label="底色" className={place(PLACE.base)}>
              <CardHeader
                title="底色"
                aside={<Switch label="使用底色" checked={baseEnabled} onChange={actions.toggleBase} />}
              />
              <ControlFields
                idPrefix="base"
                controls={baseControls}
                disabled={!baseEnabled}
                draft={baseDraft}
                applied={applied.base}
                errors={baseErrors}
                onChange={(key, value) => actions.setField('base', key, value)}
                onBlur={(key) => actions.normalizeColor('base', key)}
              />
            </Card>
    
            <Button
              ref={exportButtonRef}
              variant="primary"
              size="lg"
              className={`w-full ${place(PLACE.action)}`}
              onClick={onExport}
            >
              <CodeIcon />
              複製背景 component
            </Button>
          </div>
        </div>
      </div>
    </GlassSurface>
  );
}
