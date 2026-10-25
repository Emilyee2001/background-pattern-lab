import { useEffect, useRef, useState } from 'react';
import { Button } from '../components/ui/Button.jsx';
import { GlassSurface } from '../components/ui/GlassSurface.jsx';
import { EyeIcon } from '../components/ui/icons.jsx';
import { buildExportSnapshot } from '../export/build-export.js';
import { reactFormat } from '../export/formats/react.js';
import { ExportDialog } from '../playground/ExportDialog.jsx';
import { Panel } from '../playground/Panel.jsx';
import { Stage } from '../playground/Stage.jsx';
import { usePlaygroundState } from '../playground/usePlaygroundState.js';

export function App() {
  const state = usePlaygroundState();
  const [viewport, setViewport] = useState('wide');
  const [panelHidden, setPanelHidden] = useState(false);
  const [exported, setExported] = useState(null);
  const [exportOpen, setExportOpen] = useState(false);

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
      <Stage viewport={viewport} applied={state.applied} />

      {panelHidden ? (
        <GlassSurface className="fixed right-4 bottom-4 rounded-2xl p-1.5">
          <Button ref={showButtonRef} variant="ghost" onClick={() => togglePanel(false)} className="relative">
            <EyeIcon />
            顯示 panel
          </Button>
        </GlassSurface>
      ) : (
        <main className="pointer-events-none fixed inset-0 flex items-center justify-center p-4">
          <div className="pointer-events-auto flex w-full max-w-panel justify-center">
            <Panel
              state={state}
              viewport={viewport}
              onViewportChange={setViewport}
              onHide={() => togglePanel(true)}
              onExport={openExport}
              exportButtonRef={exportButtonRef}
              hideButtonRef={hideButtonRef}
            />
          </div>
        </main>
      )}

      <ExportDialog open={exportOpen} onClose={closeExport} exported={exported} />
    </>
  );
}
