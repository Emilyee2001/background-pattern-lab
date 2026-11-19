import { Button } from '../components/ui/Button.jsx';
import { Card, CardHeader } from '../components/ui/Card.jsx';
import { GlassSurface } from '../components/ui/GlassSurface.jsx';
import { Switch } from '../components/ui/Switch.jsx';
import { CodeIcon, EyeIcon, EyeOffIcon, GitHubIcon } from '../components/ui/icons.jsx';
import { version } from '../../package.json';
import { BREAKPOINTS } from '../export/breakpoints.js';
import { baseControls } from '../patterns/_shared/index.js';
import { patterns } from '../patterns/registry.js';
import { AddBreakpointCard, BreakpointCard, LevelCard } from './BreakpointCard.jsx';
import { ControlFields } from './ControlFields.jsx';
import { LevelHeader } from './LevelHeader.jsx';
import { PatternPicker } from './PatternPicker.jsx';

const REPO_URL = 'https://github.com/Emilyee2001/background-pattern-lab';

// 單欄排版，DOM 順序即由上到下的順序：Pattern → 參數（預設、斷點）→ 底色 → 捲動 → 複製按鈕
// 各尺寸的外框內距與間距相同，只有 panel 寬度與 Pattern、參數欄位的欄數隨斷點改變

export function Panel({ state, activeLevel, collapsed, onToggleCollapsed, onExport, exportButtonRef }) {
  const {
    pattern,
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

  return (
    <GlassSurface className="w-panel-sm max-w-full sm:w-panel lg:w-panel-lg">
      <header className={`relative flex items-center gap-3 px-8 pt-5 ${collapsed ? 'pb-5' : 'pb-4'}`}>
        <div className="mr-auto flex items-center gap-2 pl-1">
          <h1 className="text-[15px] font-semibold tracking-tight text-primary">Background Pattern Lab</h1>
          <span className="rounded-md border border-primary/15 bg-white/70 px-1.5 py-0.5 font-mono text-[10px] font-medium text-secondary">v{version.split('.')[0]}</span>
          <a
            href={REPO_URL}
            target="_blank"
            rel="noreferrer"
            aria-label="GitHub"
            title="GitHub"
            className="relative z-10 rounded-md p-1 text-tertiary transition-colors hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
          >
            <GitHubIcon className="size-4" />
          </a>
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

      {/* 收合時內容留在 DOM，只用 grid-rows 0fr 收起高度，之後可直接加過渡動畫 */}
      <div id="panel-content" inert={collapsed} className={`grid ${collapsed ? 'grid-rows-[0fr]' : 'grid-rows-[1fr]'}`}>
        <div className={`min-h-0 ${collapsed ? 'overflow-hidden' : ''}`}>
          <div className="relative flex flex-col gap-5 px-8 pb-8">
            <Card aria-label="Pattern">
              <PatternPicker patterns={patterns} selectedId={pattern.id} onSelect={actions.selectPattern} />
            </Card>

            <LevelCard
              level="default"
              state={state}
              label={rwd ? '預設參數' : '所有尺寸參數'}
              header={
                rwd ? (
                  <LevelHeader name="預設" range={`< ${BREAKPOINTS[0].px}px`} active={activeLevel === 'default'} />
                ) : (
                  <LevelHeader name="所有尺寸" />
                )
              }
              aside={<Switch label="RWD" checked={rwd} onChange={actions.toggleResponsive} />}
            />
            {levels.map((level, i) => (
              <BreakpointCard
                key={level}
                level={level}
                state={state}
                active={activeLevel === level}
                removable={i > 0}
              />
            ))}
            {nextBreakpoint && <AddBreakpointCard breakpoint={nextBreakpoint} onAdd={actions.addBreakpoint} />}

            <Card aria-label="底色">
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
                onChange={(values) => actions.setFields('base', values)}
                onBlur={(key) => actions.normalizeColor('base', key)}
              />
            </Card>

            <Card aria-label="捲動">
              <div className="flex flex-col gap-1.5">
                <CardHeader
                  title="捲動"
                  aside={
                    <Switch
                      label="固定背景"
                      checked={applied.attachment === 'fixed'}
                      disabled={Boolean(pattern.forcedAttachment)}
                      onChange={(fixed) => actions.setAttachment(fixed ? 'fixed' : 'scroll')}
                    />
                  }
                />
                <p className="text-[11px] leading-snug text-tertiary">
                  {pattern.forcedAttachment
                    ? '一律固定背景，無法切換。'
                    : '開啟後背景固定在畫面上，不跟著內容捲動。頁面要比畫面高、可以捲動時，才看得出差異。'}
                </p>
              </div>
            </Card>

            <Button ref={exportButtonRef} variant="primary" size="lg" className="w-full" onClick={onExport}>
              <CodeIcon />
              複製背景 component
            </Button>
          </div>
        </div>
      </div>
    </GlassSurface>
  );
}
