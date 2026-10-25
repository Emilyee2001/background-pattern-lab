const VARIANTS = {
  primary:
    'bg-ink text-white shadow-[0_8px_20px_-8px_rgb(15_23_42/0.6)] hover:bg-ink/90 active:bg-ink',
  secondary:
    'bg-glass-field text-ink ring-1 ring-ink/10 hover:bg-white active:bg-white/90',
  ghost: 'text-ink-muted hover:bg-ink/5 hover:text-ink',
};

const SIZES = {
  sm: 'h-8 gap-1.5 rounded-lg px-2.5 text-xs',
  md: 'h-10 gap-2 rounded-field px-3.5 text-sm',
  lg: 'h-12 gap-2 rounded-field px-5 text-sm',
  icon: 'size-8 rounded-lg',
};

export function Button({ variant = 'secondary', size = 'md', className = '', type = 'button', ...props }) {
  return (
    <button
      type={type}
      className={`inline-flex shrink-0 items-center justify-center font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent disabled:opacity-50 ${VARIANTS[variant]} ${SIZES[size]} ${className}`}
      {...props}
    />
  );
}
