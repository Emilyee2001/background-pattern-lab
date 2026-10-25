import { TextField } from './TextField.jsx';

// 色碼欄位：前方色塊顯示目前生效的顏色
export function ColorField({ swatch, ...props }) {
  return (
    <TextField
      {...props}
      maxLength={7}
      prefix={
        <span
          className="size-5 shrink-0 rounded-md shadow-[inset_0_0_0_1px_rgb(15_23_42/0.15)]"
          style={{ backgroundColor: swatch }}
          aria-hidden="true"
        />
      }
    />
  );
}
