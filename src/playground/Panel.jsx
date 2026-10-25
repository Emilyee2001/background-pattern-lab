import { Button } from '../components/ui/Button.jsx';
import { GlassSurface } from '../components/ui/GlassSurface.jsx';
import { Switch } from '../components/ui/Switch.jsx';
import { CodeIcon, EyeOffIcon } from '../components/ui/icons.jsx';
import { BREAKPOINTS } from '../export/breakpoints.js';
import { getPatternControls } from '../patterns/common-controls.js';
import { baseControls } from '../patterns/_shared/index.js';
import { patterns } from '../patterns/registry.js';
import { ControlFields } from './ControlFields.jsx';
import { LevelHeader } from './LevelHeader.jsx';
import { PatternPicker } from './PatternPicker.jsx';

function Section({ title, aside, children }) {
  return (
    <section className="flex flex-col gap-4">
      <div className="flex items-center gap-3">
        <h2 className="text-[11px] font-semibold tracking-[0.14em] text-ink-muted uppercase">{title}</h2>
        <span className="h-px flex-1 bg-ink/10" />
        {aside}
      </div>
      {children}
    </section>
  );
}

export function Panel({ state, activeLevel, onHide, onExport, exportButtonRef, hideButtonRef }) {
  const { pattern, patternDraft, patternValid, patternErrors, responsive, baseDraft, baseErrors, applied, actions } =
    state;

  return (
    <GlassSurface className="flex w-full max-w-panel flex-col xl:max-h-[calc(100dvh-2rem)] xl:w-panel xl:shrink-0">
      <header className="relative flex items-center gap-3 px-5 pt-5 pb-4">
        <div className="mr-auto flex items-center gap-2">
          <h1 className="text-[15px] font-semibold tracking-tight text-ink">Background Pattern Lab</h1>
          <span className="rounded-md bg-ink/8 px-1.5 py-0.5 font-mono text-[10px] font-medium text-ink-muted">v1</span>
        </div>
        <Button ref={hideButtonRef} variant="ghost" size="icon" onClick={onHide} aria-label="隱藏 panel" title="隱藏 panel">
          <EyeOffIcon />
        </Button>
      </header>

      <div className="relative flex min-h-0 flex-1 flex-col gap-7 overflow-y-auto px-5 pt-1 pb-6">
        <Section title="Pattern" aside={<Switch label="RWD" checked={responsive.enabled} onChange={actions.toggleResponsive} />}>
          <PatternPicker patterns={patterns} selectedId={pattern.id} onSelect={actions.selectPattern} />
          {responsive.enabled && (
            <LevelHeader name="預設" range={`< ${BREAKPOINTS[0].px}px`} active={activeLevel === 'default'} />
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
        </Section>

        <Section title="底色">
          <ControlFields
            idPrefix="base"
            controls={baseControls}
            draft={baseDraft}
            applied={applied.base}
            errors={baseErrors}
            onChange={(key, value) => actions.setField('base', key, value)}
            onBlur={(key) => actions.normalizeColor('base', key)}
          />
        </Section>
      </div>

      <footer className="relative border-t border-ink/8 px-5 py-4">
        <Button ref={exportButtonRef} variant="primary" size="lg" className="w-full" onClick={onExport}>
          <CodeIcon />
          複製背景 component
        </Button>
      </footer>
    </GlassSurface>
  );
}
