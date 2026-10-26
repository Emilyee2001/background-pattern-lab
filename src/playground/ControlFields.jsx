import { ColorField } from '../components/ui/ColorField.jsx';
import { TextField } from '../components/ui/TextField.jsx';

function rangeText(control) {
  return `${control.min}–${control.max}${control.unit ? ` ${control.unit}` : ''}`;
}

// 由 controls 定義自動產生欄位；只負責顯示與回報輸入
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
          onChange: (value) => onChange(control.key, value),
          onBlur: () => onBlur(control.key),
        };

        if (control.type === 'color') {
          return <ColorField key={control.key} {...common} meta="#RRGGBB" swatch={applied[control.key]} />;
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
