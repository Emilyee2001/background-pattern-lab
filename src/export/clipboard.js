// @ts-check

/**
 * 複製文字到剪貼簿
 * @param {string} text
 * @returns {Promise<boolean>} 是否成功
 */
export async function copyText(text) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
}
