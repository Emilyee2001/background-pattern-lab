import { useRef, useState } from 'react';
import { buildExportSnapshot } from '../export/build-export.js';
import { reactFormat } from '../export/formats/react.js';
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

  const activeLevel = useActiveLevel(state.applied.breakpoints.map((bp) => bp.id));

  const exportButtonRef = useRef(null);

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

      {/* 展開時置中，內容超出時整頁捲動，複製按鈕永遠在最下方；
          收合時只剩標題 bar，貼齊畫面下方。收合後內容高度為 0，捲動位置自然回到頂部 */}
      <main className="fixed inset-0 overflow-y-auto">
        <div
          className={`flex min-h-full justify-center px-4 ${
            panelHidden ? 'items-end pb-[calc(1rem+env(safe-area-inset-bottom))]' : 'items-center pt-20 pb-8'
          }`}
        >
          <Panel
            state={state}
            activeLevel={activeLevel}
            collapsed={panelHidden}
            onToggleCollapsed={() => setPanelHidden((hidden) => !hidden)}
            onExport={openExport}
            exportButtonRef={exportButtonRef}
          />
        </div>
      </main>

      <ExportDialog open={exportOpen} onClose={closeExport} exported={exported} />
    </>
  );
}
