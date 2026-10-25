import { Button } from '../components/ui/Button.jsx';
import { CodeBlock } from '../components/ui/CodeBlock.jsx';
import { Dialog } from '../components/ui/Dialog.jsx';
import { GlassSurface } from '../components/ui/GlassSurface.jsx';
import { CloseIcon } from '../components/ui/icons.jsx';

function Code({ children }) {
  return <code className="rounded bg-ink/8 px-1 py-px font-mono text-[11.5px] text-ink">{children}</code>;
}

// 複製 modal：顯示開啟當下的固定快照
export function ExportDialog({ open, onClose, exported }) {
  return (
    <Dialog open={open} onClose={onClose} labelledBy="export-title" className="max-w-3xl">
      {exported && (
        <GlassSurface className="flex max-h-[calc(100dvh-2rem)] flex-col bg-white/80">
          <header className="relative flex items-start gap-3 px-6 pt-6 pb-4">
            <div className="mr-auto">
              <h2 id="export-title" className="text-base font-semibold text-ink">
                複製背景 component
              </h2>
              <p className="mt-1 text-xs text-ink-muted">
                {exported.snapshot.patternName} · <span className="font-mono">{exported.snapshot.componentName}</span> ·
                variant <span className="font-mono">{exported.snapshot.variant}</span>
              </p>
            </div>
            <Button variant="ghost" size="icon" onClick={onClose} aria-label="關閉">
              <CloseIcon />
            </Button>
          </header>

          <div className="relative flex min-h-0 flex-col gap-6 overflow-y-auto px-6 pb-6">
            <CodeBlock id="export-jsx" title="JSX" description="Component 本體" code={exported.code.jsx} />
            <CodeBlock
              id="export-shared"
              title="共用 CSS"
              description="根元素、底色層、此 pattern 的規則與預設 token；每個專案貼一次即可"
              code={exported.code.sharedCss}
            />
            <CodeBlock id="export-tokens" title="Token CSS" description="本次設定的數值；啟用 RWD 時含斷點的 media 區塊" code={exported.code.tokenCss} />

            <section aria-labelledby="export-usage" className="rounded-field bg-white/60 p-4 ring-1 ring-ink/8">
              <h3 id="export-usage" className="text-sm font-semibold text-ink">
                使用方式
              </h3>
              <ol className="mt-2 list-decimal space-y-1.5 pl-5 text-xs leading-relaxed text-ink-muted">
                <li>
                  把共用 CSS 與 Token CSS 存成檔案並引入。使用 Tailwind 時，請在 <Code>@import "tailwindcss";</Code>{' '}
                  之後引入，或在最前面宣告 <Code>@layer theme, base, components, utilities;</Code>。
                </li>
                <li>
                  父容器設定 <Code>position: relative; isolation: isolate;</Code>（Tailwind：<Code>relative isolate</Code>）。
                </li>
                <li>
                  以 <Code>{`import ${exported.snapshot.componentName} from './${exported.snapshot.componentName}';`}</Code>{' '}
                  引入，把 <Code>{`<${exported.snapshot.componentName} />`}</Code> 放進父容器，背景會位於內容下方，內容不需另設 z-index。
                </li>
                <li>
                  背景只蓋住父容器範圍。若要整頁固定、捲動時不動，可傳入{' '}
                  <Code>{`<${exported.snapshot.componentName} className="fixed" />`}</Code>（CSS 位於{' '}
                  <Code>@layer components</Code>，Tailwind utility 會覆蓋它）。
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
              </ol>
            </section>
          </div>
        </GlassSurface>
      )}
    </Dialog>
  );
}
