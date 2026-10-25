import { useEffect, useRef, useState } from 'react';
import { copyText } from '../../export/clipboard.js';
import { Button } from './Button.jsx';
import { CheckIcon, CopyIcon } from './icons.jsx';

const STATUS_LABEL = {
  idle: '複製',
  copied: '已複製',
  failed: '複製失敗，請手動選取',
};

// 唯讀程式碼區塊 + 複製按鈕
export function CodeBlock({ id, title, description, code }) {
  const [status, setStatus] = useState('idle');
  const timer = useRef(0);

  useEffect(() => () => clearTimeout(timer.current), []);

  async function handleCopy() {
    const ok = await copyText(code);
    setStatus(ok ? 'copied' : 'failed');
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setStatus('idle'), ok ? 1800 : 4000);
  }

  return (
    <section aria-labelledby={`${id}-title`} className="flex min-w-0 flex-col gap-2">
      <div className="flex items-end justify-between gap-3">
        <div className="min-w-0">
          <h3 id={`${id}-title`} className="text-sm font-semibold text-ink">
            {title}
          </h3>
          {description && <p className="mt-0.5 text-xs text-ink-subtle">{description}</p>}
        </div>
        <Button
          size="sm"
          variant={status === 'copied' ? 'primary' : 'secondary'}
          onClick={handleCopy}
          aria-live="polite"
          className={status === 'failed' ? 'text-danger' : ''}
        >
          {status === 'copied' ? <CheckIcon className="size-3.5" /> : <CopyIcon className="size-3.5" />}
          {STATUS_LABEL[status]}
        </Button>
      </div>
      <pre
        tabIndex={0}
        aria-labelledby={`${id}-title`}
        className="max-h-64 overflow-auto rounded-field bg-code p-4 font-mono text-[12.5px] leading-relaxed text-slate-100 ring-1 ring-white/10 focus-visible:outline-2 focus-visible:outline-accent"
      >
        <code>{code}</code>
      </pre>
    </section>
  );
}
