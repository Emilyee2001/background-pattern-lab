import { HexAlphaColorPicker, HexColorPicker } from 'react-colorful';
import { TextField } from './TextField.jsx';

/** 色碼 + 透明度（%）→ #RRGGBBAA，給調色盤顯示 */
function toHexAlpha(color, opacity) {
  return `${color}${Math.round((opacity / 100) * 255).toString(16).padStart(2, '0')}`;
}

/** 調色盤回傳 #rrggbb 或 #rrggbbaa → 大寫色碼 + 透明度（%），透明度限制在欄位範圍內 */
function fromHexAlpha(hex, { min, max }) {
  const alpha = hex.length === 9 ? parseInt(hex.slice(7), 16) / 255 : 1;
  return [hex.slice(0, 7).toUpperCase(), Math.min(max, Math.max(min, Math.round(alpha * 100)))];
}

// 色碼欄位：前方色塊顯示目前生效的顏色，點擊開啟調色盤
// 調色盤用原生 popover（顯示在最上層、點外面或 Esc 關閉），以 CSS anchor positioning 對齊色塊；
// 不支援 anchor positioning 的瀏覽器維持 popover 預設的畫面置中
export function ColorField({ id, swatch, alpha, onPick, disabled, ...props }) {
  const popoverId = `${id}-picker`;
  const anchorName = `--${id}-anchor`;

  return (
    <TextField
      {...props}
      id={id}
      disabled={disabled}
      maxLength={7}
      prefix={
        <>
          <button
            type="button"
            popoverTarget={popoverId}
            disabled={disabled}
            aria-label="開啟調色盤"
            title="開啟調色盤"
            className="size-5 shrink-0 rounded-md shadow-[inset_0_0_0_1px_rgb(15_23_42/0.15)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent disabled:cursor-not-allowed"
            style={{ backgroundColor: swatch, anchorName }}
          />
          <div
            id={popoverId}
            popover="auto"
            className="overflow-visible rounded-card border-0 bg-white p-3 text-ink shadow-glass supports-[anchor-name:--a]:inset-auto supports-[anchor-name:--a]:m-0 supports-[anchor-name:--a]:mt-2 [position-area:bottom_span-right] [position-try-fallbacks:flip-block,flip-inline]"
            style={{ positionAnchor: anchorName }}
          >
            {alpha ? (
              <HexAlphaColorPicker
                color={toHexAlpha(swatch, alpha.value)}
                onChange={(hex) => onPick(...fromHexAlpha(hex, alpha))}
              />
            ) : (
              <HexColorPicker color={swatch} onChange={(hex) => onPick(hex.toUpperCase())} />
            )}
          </div>
        </>
      }
    />
  );
}
