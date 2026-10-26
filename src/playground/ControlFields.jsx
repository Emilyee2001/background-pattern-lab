import { ColorField } from '../components/ui/ColorField.jsx';
import { TextField } from '../components/ui/TextField.jsx';

function rangeText(control) {
  return `${control.min}–${control.max}${control.unit ? ` ${control.unit}` : ''}`;
}

// 由 controls 定義自動產生欄位；只負責顯示與回報輸入。onChange 回報 { 欄位 key: 原始字串 }
export function ControlFields({ idPrefix, controls, draft, applied, errors, onChange, onBlur, disabled = false }) {
  return (
    <div className="grid grid-cols-2 gap-x-4 gap-y-5">
      {controls.map((control) => {
        const id = `${idPrefix}-${control.key}`;
        const common = {
          id,
          label: control.label,
          hint: control.hint,
          error: errors[control.key],
          value: draft[control.key],
          disabled,
          onChange: (value) => onChange({ [control.key]: value }),
          onBlur: () => onBlur(control.key),
        };

        if (control.type === 'color') {
          // 調色盤以目前生效的值為準；有 alphaKey 時同時調整透明度欄位
          const alphaControl = control.alphaKey && controls.find((c) => c.key === control.alphaKey);
          return (
            <ColorField
              key={control.key}
              {...common}
              meta="#RRGGBB"
              swatch={applied[control.key]}
              alpha={alphaControl && { value: applied[alphaControl.key], min: alphaControl.min, max: alphaControl.max }}
              onPick={(color, opacity) =>
                onChange({
                  [control.key]: color,
                  ...(alphaControl && opacity !== undefined && { [alphaControl.key]: String(opacity) }),
                })
              }
            />
          );
        }
        return (
          <TextField
            key={control.key}
            {...common}
            meta={rangeText(control)}
            unit={control.unit}
            inputMode="decimal"
          />
        );
      })}
    </div>
  );
}
