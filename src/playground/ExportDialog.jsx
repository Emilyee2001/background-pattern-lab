import { useState } from 'react';
import { Button } from '../components/ui/Button.jsx';
import { CodeBlock } from '../components/ui/CodeBlock.jsx';
import { Dialog } from '../components/ui/Dialog.jsx';
import { GlassSurface } from '../components/ui/GlassSurface.jsx';
import { SegmentedControl } from '../components/ui/SegmentedControl.jsx';
import { CloseIcon } from '../components/ui/icons.jsx';

function Code({ children }) {
  return <code className="rounded bg-primary/8 px-1 py-px font-mono text-[11.5px] text-primary">{children}</code>;
}

// 說明區塊：ordered 為依序執行的步驟，否則為不分先後的注意事項
function Usage({ id, title = '使用方式', ordered = true, children }) {
  const List = ordered ? 'ol' : 'ul';
  return (
    <section aria-labelledby={id} className="rounded-field bg-white/60 p-4 ring-1 ring-primary/8">
      <h3 id={id} className="text-sm font-semibold text-primary">
        {title}
      </h3>
      <List
        className={`mt-2 space-y-1.5 pl-5 text-xs leading-relaxed text-secondary ${ordered ? 'list-decimal' : 'list-disc'}`}
      >
        {children}
      </List>
    </section>
  );
}

// 給人看的使用方式；給 AI 的版本在 export/formats/prompt-template.md，重疊的內容修改時要一起檢查
function ComponentView({ exported }) {
  const { componentName, patternId } = exported.snapshot;
  return (
    <>
      <Usage id="export-usage">
        <li>
          JSX 存成 <Code>{`${componentName}.jsx`}</Code>，共用 CSS 與 Token CSS 存成 CSS 檔並引入。使用 Tailwind v4 時，在{' '}
          <Code>@import "tailwindcss";</Code> 之後引入。
        </li>
        <li>
          父容器設定 <Code>position: relative; isolation: isolate;</Code>（Tailwind：<Code>relative isolate</Code>），放入{' '}
          <Code>{`<${componentName} />`}</Code>。
        </li>
        <li>
          之後只改樣式時，只要複製 Token CSS，取代專案中的 <Code>{`.bpl-${patternId}--default`}</Code> 區塊。
        </li>
      </Usage>

      <Usage id="export-notes" title="注意事項" ordered={false}>
        <li>
          固定背景時，祖先元素設定了 <Code>transform</Code>、<Code>filter</Code>、<Code>backdrop-filter</Code>、
          <Code>will-change</Code> 或 <Code>contain</Code> 會讓固定失效。
        </li>
        <li>
          接自己的 design token：在 Token CSS 中改值，例如 <Code>{`--bpl-${patternId}-color: var(--color-primary);`}</Code>。
        </li>
      </Usage>

      <CodeBlock id="export-jsx" title="JSX" description="Component 本體" code={exported.code.jsx} />
      <CodeBlock
        id="export-shared"
        title="共用 CSS"
        description="此 pattern 的規則；前半段為所有 BPL 背景共用，已經有就不用重複"
        code={exported.code.sharedCss}
      />
      <CodeBlock
        id="export-tokens"
        title="Token CSS"
        description="本次設定的數值；啟用 RWD 時含斷點（md 768px、lg 1024px）的 media 區塊"
        code={exported.code.tokenCss}
      />
    </>
  );
}

function PromptView({ exported }) {
  return (
    <>
      <Usage id="export-prompt-usage">
        <li>複製下方整段內容，貼給你的 AI 工具（Claude Code、Cursor、Codex 等），由 AI 依照專案的慣例加入背景。</li>
        <li>
          貼上時在最前面補一句背景要放在哪裡，例如 <Code>背景要放在首頁的 Hero 區塊。</Code>
        </li>
        <li>只改樣式時不需要整段 prompt，到「背景 component」複製 Token CSS 即可。</li>
      </Usage>

      <CodeBlock
        id="export-prompt"
        title="給 AI 的 prompt"
        description="Markdown 格式，已包含所有程式碼"
        code={exported.code.prompt}
        grow
      />
    </>
  );
}

const VIEWS = [
  { value: 'component', label: '背景 component', Content: ComponentView },
  { value: 'prompt', label: '給 AI 的 prompt', Content: PromptView },
];

// 複製 modal：顯示開啟當下的固定快照；每次開啟都從「背景 component」開始
export function ExportDialog({ open, onClose, exported }) {
  const [view, setView] = useState('component');

  function handleClose() {
    setView('component');
    onClose();
  }

  return (
    <Dialog open={open} onClose={handleClose} labelledBy="export-title" className="max-w-3xl">
      {exported && (
        <GlassSurface className="flex max-h-[calc(100dvh-2rem)] flex-col bg-white/80">
          <header className="relative flex flex-col gap-4 px-6 pt-6 pb-4">
            <div className="flex items-start gap-3">
              <div className="mr-auto">
                <h2 id="export-title" className="text-base font-semibold text-primary">
                  複製背景
                </h2>
                <p className="mt-1 text-xs text-secondary">
                  {exported.snapshot.patternName} · <span className="font-mono">{exported.snapshot.componentName}</span> ·
                  variant <span className="font-mono">{exported.snapshot.variant}</span>
                </p>
              </div>
              <Button variant="ghost" size="icon" onClick={handleClose} aria-label="關閉">
                <CloseIcon />
              </Button>
            </div>
            <SegmentedControl idPrefix="export" label="複製內容" options={VIEWS} value={view} onChange={setView} className="self-start" />
          </header>

          {/* 兩個分頁疊在同一格，未選中的用 invisible 保留高度：modal 高度固定為較高的「背景 component」，切換時不跳動；
              prompt 的程式碼區不撐高，填滿剩餘空間。
              捲動區不延伸到底部圓角：用 mb 留出下方空間、mr 讓 scroll bar 離開右緣；py-0.5 保留邊緣 ring 與 focus outline 不被裁切 */}
          <div className="mr-2 mb-6 grid min-h-0 grid-rows-[minmax(0,1fr)]">
            {VIEWS.map(({ value, Content }) => (
              <div
                key={value}
                role="tabpanel"
                id={`export-panel-${value}`}
                aria-labelledby={`export-tab-${value}`}
                className={`relative col-start-1 row-start-1 flex min-h-0 flex-col gap-6 overflow-y-auto py-0.5 pr-4 pl-6 ${
                  view === value ? '' : 'invisible'
                }`}
              >
                <Content exported={exported} />
              </div>
            ))}
          </div>
        </GlassSurface>
      )}
    </Dialog>
  );
}
