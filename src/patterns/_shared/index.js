// @ts-check
// 背景根元素與底色層：所有 pattern 共用
import './bpl-bg.css';
import bplBgCss from './bpl-bg.css?raw';
import { colorControl, opacityControl } from '../common-controls.js';

export const baseCss = bplBgCss;

export const baseControls = [colorControl, opacityControl];

export const BASE_DEFAULTS = { color: '#FFFFFF', opacity: 100 };

/** @param {{ color: string, opacity: number }} v */
export const baseToTokens = (v) => ({
  '--bpl-base-color': v.color,
  '--bpl-base-opacity': v.opacity / 100,
});
