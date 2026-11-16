// @ts-check
// 給 AI 的 prompt：固定文字在 prompt-template.md，程式碼直接沿用 React 格式的輸出
import template from './prompt-template.md?raw';
import { reactFormat } from './react.js';

/**
 * 移除 HTML 註解（只給維護者看），再把 {{key}} 換成對應的值；缺值時直接報錯，避免輸出殘留佔位符
 * @param {string} source @param {Record<string, string>} values
 */
function fill(source, values) {
  return source.replace(/<!--[\s\S]*?-->\n*/g, '').replace(/\{\{(\w+)\}\}/g, (_, key) => {
    if (!(key in values)) throw new Error(`Missing prompt value: ${key}`);
    return values[key];
  });
}

/** 會隨設定變動的說明 @param {import('../build-export').ExportSnapshot} s */
function toSummary(s) {
  const rwd = s.breakpoints.length
    ? `已啟用。預設值套用於最小尺寸，斷點 ${s.breakpoints
        .map((bp) => `${bp.id}（\`min-width: ${bp.minWidth}\`）`)
        .join('、')} 只覆寫有變動的 token。`
    : '未啟用，所有尺寸使用相同的值。';
  const attachment =
    s.attachment === 'fixed' ? '固定在畫面上，捲動時不動，但只顯示在父容器範圍內。' : '跟著內容捲動。';

  return [
    `- Pattern：${s.patternName}（\`${s.patternId}\`）`,
    `- Component：\`${s.componentName}\`，variant \`${s.variant}\``,
    `- RWD：${rwd}`,
    `- 捲動方式：${attachment}`,
  ].join('\n');
}

export const promptFormat = {
  id: 'prompt',
  label: '給 AI 的 prompt',
  /** @param {import('../build-export').ExportSnapshot} snapshot */
  toCode: (snapshot) => {
    const code = reactFormat.toCode(snapshot);
    const prompt = fill(template, {
      summary: toSummary(snapshot),
      patternId: snapshot.patternId,
      componentName: snapshot.componentName,
      jsx: code.jsx.trimEnd(),
      sharedCss: code.sharedCss.trimEnd(),
      tokenCss: code.tokenCss.trimEnd(),
    });
    return { prompt };
  },
};
