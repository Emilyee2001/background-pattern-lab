import { useRef, useState } from 'react';
import { buildExportSnapshot } from '../export/build-export.js';
import { promptFormat } from '../export/formats/prompt.js';
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
    setExported({ snapshot, code: { ...reactFormat.toCode(snapshot), ...promptFormat.toCode(snapshot) } });
    setExportOpen(true);
  }

  function closeExport() {
    setExportOpen(false);
    exportButtonRef.current?.focus();
  }

  return (
    <>
      {/* 展開時置中，內容超出時整頁捲動，複製按鈕永遠在最下方；
          收合時只剩標題 bar，貼齊畫面下方。收合後內容高度為 0，捲動位置自然回到頂部。
          展示區放在捲動內容裡，鋪滿內容高度，背景跟著內容捲動。
          捲動容器的單色底是展示區的底，底色透明時透出這個顏色 */}
      <main className="fixed inset-0 overflow-y-auto bg-stage-background">
        <div
          className={`relative flex min-h-full justify-center px-4 ${
            panelHidden ? 'items-end pb-[calc(1rem+env(safe-area-inset-bottom))]' : 'items-center pt-20 pb-8'
          }`}
        >
          <Stage applied={state.applied} />
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
