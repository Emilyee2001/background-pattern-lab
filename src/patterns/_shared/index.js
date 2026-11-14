// @ts-check
// 背景根元素與底色層：所有 pattern 共用
import './bpl-bg.css';
import bplBgCss from './bpl-bg.css?raw';
import { colorControl, opacityControl } from '../common-controls.js';

export const baseCss = bplBgCss;

/** 底色透明度不接受 0%：要透明時改用「使用底色」開關 @type {import('../types').NumberControl} */
const baseOpacityControl = { ...opacityControl, min: 1 };

export const baseControls = [colorControl, baseOpacityControl];

export const BASE_DEFAULTS = { color: '#FFFFFF', opacity: 100 };

/**
 * 停用底色時輸出 transparent；DOM 與 CSS 規則不變，之後只改 token 就能加回底色
 * @param {{ enabled?: boolean, color: string, opacity: number }} v
 */
export const baseToTokens = (v) =>
  v.enabled === false
    ? { '--bpl-base-color': 'transparent', '--bpl-base-opacity': 1 }
    : { '--bpl-base-color': v.color, '--bpl-base-opacity': v.opacity / 100 };

/** @typedef {'scroll' | 'fixed'} Attachment */

/** 預設跟著內容捲動 @type {Attachment} */
export const ATTACHMENT_DEFAULT = 'scroll';

/** 捲動：子層鋪滿父容器；固定：子層鋪滿畫面 @param {Attachment} attachment */
export const attachmentToTokens = (attachment) => ({
  '--bpl-bg-layer-position': attachment === 'fixed' ? 'fixed' : 'absolute',
});
