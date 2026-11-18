const VARIANTS = {
  primary:
    'bg-primary text-white shadow-button-primary hover:bg-primary/90 active:bg-primary',
  secondary:
    'bg-button-secondary-background text-primary ring-1 ring-primary/10 hover:bg-white active:bg-white/90',
  ghost: 'text-secondary hover:bg-primary/5 hover:text-primary',
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
