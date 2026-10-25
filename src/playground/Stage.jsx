import { getPattern } from '../patterns/registry.js';
import { BackgroundPreview } from './BackgroundPreview.jsx';

// 展示區：本身就是「使用端容器」（relative + isolate），後方墊棋盤格
export function Stage({ viewport, applied }) {
  const pattern = getPattern(applied.patternId);
  const narrow = viewport === 'narrow';

  return (
    <div className="fixed inset-0 flex justify-center bg-stage-neutral">
      <div
        className={`relative isolate h-full bg-checker transition-[width] duration-300 ease-out ${
          narrow ? 'w-phone max-w-full shadow-phone' : 'w-full'
        }`}
      >
        <BackgroundPreview pattern={pattern} values={applied.pattern} base={applied.base} />
      </div>
    </div>
  );
}
