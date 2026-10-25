// @ts-check
// 欄位驗證：只回報錯誤，不默默修正數值

const HEX_COLOR = /^#[0-9A-Fa-f]{6}$/;
const NUMBER_TEXT = /^-?\d+(\.\d+)?$/;

/**
 * @param {import('../patterns/types').PatternControl} control
 * @param {string} raw
 * @returns {{ value?: string | number, error?: string }}
 */
export function validateField(control, raw) {
  const text = String(raw ?? '').trim();

  if (control.type === 'color') {
    if (text === '') return { error: '請輸入色碼' };
    if (!HEX_COLOR.test(text)) return { error: '格式為 #RRGGBB' };
    return { value: text };
  }

  const unit = control.unit ? ` ${control.unit}` : '';
  if (text === '') return { error: '請輸入數值' };
  if (!NUMBER_TEXT.test(text)) return { error: '請輸入數字' };
  const n = Number(text);
  if (n < control.min || n > control.max) {
    return { error: `範圍為 ${control.min}–${control.max}${unit}` };
  }
  const steps = (n - control.min) / control.step;
  if (Math.abs(steps - Math.round(steps)) > 1e-9) {
    return { error: `需以 ${control.step}${unit} 為單位` };
  }
  return { value: n };
}

/**
 * 整組驗證。各欄位都有效時才執行跨欄位規則。
 * @param {import('../patterns/types').PatternControl[]} controls
 * @param {Record<string, string>} draft
 * @param {(values: Record<string, any>) => Record<string, string>} [crossValidate]
 * @returns {{ valid: boolean, values: Record<string, string | number>, errors: Record<string, string> }}
 */
export function validateGroup(controls, draft, crossValidate) {
  /** @type {Record<string, string | number>} */
  const values = {};
  /** @type {Record<string, string>} */
  const errors = {};

  for (const control of controls) {
    const { value, error } = validateField(control, draft[control.key]);
    if (error) errors[control.key] = error;
    else if (value !== undefined) values[control.key] = value;
  }

  if (Object.keys(errors).length === 0 && crossValidate) {
    Object.assign(errors, crossValidate(values));
  }

  return { valid: Object.keys(errors).length === 0, values, errors };
}

/** 有效色碼統一為大寫；無效則原樣保留 */
export function normalizeColor(raw) {
  const text = String(raw ?? '').trim();
  return HEX_COLOR.test(text) ? text.toUpperCase() : raw;
}

/** 數值 → 欄位字串 */
export function toDraft(values) {
  return Object.fromEntries(Object.entries(values).map(([k, v]) => [k, String(v)]));
}
