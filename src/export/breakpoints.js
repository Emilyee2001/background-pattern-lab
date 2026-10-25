// @ts-check
// RWD 斷點：寬度固定為 Tailwind 預設值，mobile-first 由小到大排列

/**
 * @typedef {object} Breakpoint
 * @property {'md' | 'lg'} id
 * @property {string} minWidth  media query 用的寬度
 * @property {number} px        顯示用的像素值
 */

/** @type {Breakpoint[]} */
export const BREAKPOINTS = [
  { id: 'md', minWidth: '48rem', px: 768 },
  { id: 'lg', minWidth: '64rem', px: 1024 },
];

/** @param {string} id */
export function getBreakpoint(id) {
  const bp = BREAKPOINTS.find((b) => b.id === id);
  if (!bp) throw new Error(`Unknown breakpoint: ${id}`);
  return bp;
}

/** @param {string} id */
export const mediaQuery = (id) => `(min-width: ${getBreakpoint(id).minWidth})`;
