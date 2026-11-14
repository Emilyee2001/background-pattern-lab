import { useMemo } from 'react';
import { buildExportSnapshot } from '../export/build-export.js';
import { buildDefaultTokenCss, buildTokenCss } from '../export/token-css.js';
import { BackgroundPreview } from './BackgroundPreview.jsx';

// 展示區：本身就是「使用端容器」（定位 + isolate），棋盤格畫在外層的捲動容器上（見 App）。
// 放在捲動內容裡、鋪滿整個內容高度，背景才會和使用端一樣跟著捲動（或依設定固定）。
// Token 以匯出相同的 Token CSS 注入，RWD 斷點直接依視窗寬度生效。
export function Stage({ applied }) {
  const snapshot = useMemo(() => buildExportSnapshot(applied), [applied]);
  const tokenCss = useMemo(() => buildDefaultTokenCss(snapshot) + buildTokenCss(snapshot), [snapshot]);

  return (
    <div className="absolute inset-0 isolate">
      <style>{tokenCss}</style>
      <BackgroundPreview patternId={snapshot.patternId} className={`bpl-${snapshot.patternId}--${snapshot.variant}`} />
    </div>
  );
}
