import { useEffect, useRef } from 'react';

// 原生 <dialog> + showModal()：背景自動 inert、Esc 關閉、焦點移入
export function Dialog({ open, onClose, labelledBy, className = '', children }) {
  const ref = useRef(null);

  useEffect(() => {
    const dialog = ref.current;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  return (
    <dialog
      ref={ref}
      aria-labelledby={labelledBy}
      onClose={onClose}
      // 點擊 backdrop 關閉
      onClick={(e) => {
        if (e.target === e.currentTarget) e.currentTarget.close();
      }}
      className={`m-auto max-h-[calc(100dvh-2rem)] w-[calc(100%-2rem)] overflow-visible bg-transparent p-0 text-ink backdrop:bg-ink/25 backdrop:backdrop-blur-[2px] ${className}`}
    >
      {children}
    </dialog>
  );
}
