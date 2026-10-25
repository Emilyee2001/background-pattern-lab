import { useEffect, useRef, useState } from 'react';
import { Button } from '../components/ui/Button.jsx';
import { GlassSurface } from '../components/ui/GlassSurface.jsx';
import { EyeIcon } from '../components/ui/icons.jsx';
import { BREAKPOINTS } from '../export/breakpoints.js';
import { buildExportSnapshot } from '../export/build-export.js';
import { reactFormat } from '../export/formats/react.js';
import { BreakpointPanel } from '../playground/BreakpointPanel.jsx';
import { ExportDialog } from '../playground/ExportDialog.jsx';
import { Panel } from '../playground/Panel.jsx';
import { Stage } from '../playground/Stage.jsx';
import { useActiveLevel } from '../playground/useActiveLevel.js';
import { usePlaygroundState } from '../playground/usePlaygroundState.js';

export function App() {
  const state = usePlaygroundState();
  const [panelHidden, setPanelHidden] = useState(false);
  const [exported, setExported] = useState(null);
  const [exportOpen, setExportOpen] = useState(false);

  const levels = state.applied.breakpoints.map((bp) => bp.id);
  const activeLevel = useActiveLevel(levels);
  const nextBreakpoint = BREAKPOINTS.find((bp) => !levels.includes(bp.id));

  const exportButtonRef = useRef(null);
  const hideButtonRef = useRef(null);
  const showButtonRef = useRef(null);
  const panelToggled = useRef(false);

  // 隱藏／顯示 panel 後，焦點移到對應的切換按鈕
  useEffect(() => {
    if (!panelToggled.current) return;
    (panelHidden ? showButtonRef : hideButtonRef).current?.focus();
  }, [panelHidden]);

  function togglePanel(hidden) {
    panelToggled.current = true;
    setPanelHidden(hidden);
  }

  function openExport() {
    const snapshot = buildExportSnapshot(state.applied);
    setExported({ snapshot, code: reactFormat.toCode(snapshot) });
    setExportOpen(true);
  }

  function closeExport() {
    setExportOpen(false);
    exportButtonRef.current?.focus();
  }

  return (
    <>
      <Stage applied={state.applied} />

      {panelHidden ? (
        <GlassSurface className="fixed right-4 bottom-4 rounded-2xl p-1.5">
          <Button ref={showButtonRef} variant="ghost" onClick={() => togglePanel(false)} className="relative">
            <EyeIcon />
            顯示 panel
          </Button>
        </GlassSurface>
      ) : (
        // 小於 xl 時 panel 往下排、整頁捲動；xl 以上往右排，各 panel 內部捲動
        <main className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <div className="flex w-full max-w-panel flex-col items-center gap-4 xl:w-auto xl:max-w-none xl:flex-row xl:items-start">
              <Panel
                state={state}
                activeLevel={activeLevel}
                onHide={() => togglePanel(true)}
                onExport={openExport}
                exportButtonRef={exportButtonRef}
                hideButtonRef={hideButtonRef}
              />
              {levels.map((level, i) => (
                <BreakpointPanel
                  key={level}
                  level={level}
                  state={state}
                  active={activeLevel === level}
                  removable={i > 0}
                  nextBreakpoint={i === levels.length - 1 ? nextBreakpoint : undefined}
                />
              ))}
            </div>
          </div>
        </main>
      )}

      <ExportDialog open={exportOpen} onClose={closeExport} exported={exported} />
    </>
  );
}
