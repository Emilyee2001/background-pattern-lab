import { useMemo } from 'react';
import { buildExportSnapshot } from '../export/build-export.js';
import { buildDefaultTokenCss, buildTokenCss } from '../export/token-css.js';
import { BackgroundPreview } from './BackgroundPreview.jsx';

// 展示區：本身就是「使用端容器」（relative + isolate），後方墊棋盤格。
// Token 以匯出相同的 Token CSS 注入，RWD 斷點直接依視窗寬度生效。
export function Stage({ applied }) {
  const snapshot = useMemo(() => buildExportSnapshot(applied), [applied]);
  const tokenCss = useMemo(() => buildDefaultTokenCss(snapshot) + buildTokenCss(snapshot), [snapshot]);

  return (
    <div className="fixed inset-0 isolate bg-checker">
      <style>{tokenCss}</style>
      <BackgroundPreview patternId={snapshot.patternId} className={`bpl-${snapshot.patternId}--${snapshot.variant}`} />
    </div>
  );
}
