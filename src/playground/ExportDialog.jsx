import { useState } from 'react';
import { Button } from '../components/ui/Button.jsx';
import { CodeBlock } from '../components/ui/CodeBlock.jsx';
import { Dialog } from '../components/ui/Dialog.jsx';
import { GlassSurface } from '../components/ui/GlassSurface.jsx';
import { SegmentedControl } from '../components/ui/SegmentedControl.jsx';
import { CloseIcon } from '../components/ui/icons.jsx';

function Code({ children }) {
  return <code className="rounded bg-ink/8 px-1 py-px font-mono text-[11.5px] text-ink">{children}</code>;
}

function Usage({ id, children }) {
  return (
    <section aria-labelledby={id} className="rounded-field bg-white/60 p-4 ring-1 ring-ink/8">
      <h3 id={id} className="text-sm font-semibold text-ink">
        使用方式
      </h3>
      <ol className="mt-2 list-decimal space-y-1.5 pl-5 text-xs leading-relaxed text-ink-muted">{children}</ol>
    </section>
  );
}

// 給人看的使用方式；給 AI 的版本在 export/formats/prompt-template.md，重疊的內容修改時要一起檢查
function ComponentView({ exported }) {
  return (
    <>
      <Usage id="export-usage">
        <li>
          把共用 CSS 與 Token CSS 存成檔案，從全域 CSS 引入。兩者都是純 CSS，不需要 Tailwind。使用 Tailwind v4 時，請在{' '}
          <Code>@import "tailwindcss";</Code> 之後引入，或在最前面宣告{' '}
          <Code>@layer theme, base, components, utilities;</Code>（Tailwind v3 未經測試）。
        </li>
        <li>
          父容器設定 <Code>position: relative; isolation: isolate;</Code>（Tailwind：<Code>relative isolate</Code>）。
        </li>
        <li>
          以 <Code>{`import ${exported.snapshot.componentName} from './${exported.snapshot.componentName}';`}</Code>{' '}
          引入，把 <Code>{`<${exported.snapshot.componentName} />`}</Code> 放進父容器，背景會位於內容下方，內容不需另設 z-index。
        </li>
        <li>
          背景只蓋住父容器範圍。開啟「固定背景」時，背景固定在畫面上、捲動時不動，但一樣只顯示在父容器範圍內（由
          Token CSS 的 <Code>--bpl-bg-layer-position</Code> 控制）。祖先元素設定了 <Code>transform</Code>、
          <Code>filter</Code>、<Code>backdrop-filter</Code>、<Code>will-change</Code> 或 <Code>contain</Code>{' '}
          時，固定會失效。
        </li>
        <li>
          RWD 斷點使用 Tailwind 預設寬度（md <Code>48rem</Code> = 768px、lg <Code>64rem</Code> = 1024px），採
          mobile-first：預設值套用於最小尺寸，斷點只覆寫有變動的 token。
        </li>
        <li>
          覆寫 token：在 Token CSS 中改值、接自己的 design token（例如{' '}
          <Code>{`--bpl-${exported.snapshot.patternId}-color: var(--color-brand-200);`}</Code>），或在 Tailwind 中用{' '}
          <Code>{`className="opacity-50 [--bpl-${exported.snapshot.patternId}-opacity:0.2]"`}</Code>。
        </li>
      </Usage>

      <CodeBlock id="export-jsx" title="JSX" description="Component 本體" code={exported.code.jsx} />
      <CodeBlock
        id="export-shared"
        title="共用 CSS"
        description="根元素、底色層、此 pattern 的規則與預設 token；每個專案貼一次即可"
        code={exported.code.sharedCss}
      />
      <CodeBlock id="export-tokens" title="Token CSS" description="本次設定的數值；啟用 RWD 時含斷點的 media 區塊" code={exported.code.tokenCss} />
    </>
  );
}

function PromptView({ exported }) {
  return (
    <>
      <Usage id="export-prompt-usage">
        <li>
          複製下方整段內容，貼給你的 AI 工具（Claude Code、Cursor、Codex 等）。AI 會依照專案的結構、CSS 設定與 design
          token，把背景加進專案。
        </li>
        <li>
          貼上時在最前面補一句背景要放在哪裡，例如 <Code>背景要放在首頁的 Hero 區塊。</Code>沒有說明時，AI 會先詢問。
        </li>
        <li>
          內容較長時，也可以存成 <Code>.md</Code> 檔放進專案，再請 AI 照著該檔案執行。
        </li>
      </Usage>

      <CodeBlock
        id="export-prompt"
        title="給 AI 的 prompt"
        description="Markdown 格式，已包含 JSX、共用 CSS 與 Token CSS"
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
                <h2 id="export-title" className="text-base font-semibold text-ink">
                  複製背景
                </h2>
                <p className="mt-1 text-xs text-ink-muted">
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
