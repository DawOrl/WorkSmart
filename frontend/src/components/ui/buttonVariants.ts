import { cva, type VariantProps } from 'class-variance-authority';

// One button language for landing and app. Radius 8px (tighter than 10px panels),
// a 1px press, no gradients or glows: the pine fill is the only emphasis.
export const buttonVariants = cva(
  'inline-flex select-none items-center justify-center gap-2 whitespace-nowrap rounded-md font-medium transition-[background-color,border-color,color,transform] duration-150 active:translate-y-px disabled:pointer-events-none disabled:opacity-50 [&_svg]:size-4 [&_svg]:shrink-0',
  {
    variants: {
      variant: {
        primary: 'bg-primary text-primary-foreground hover:bg-[hsl(160_50%_19%)]',
        secondary: 'border border-input bg-surface text-foreground hover:border-foreground/40 hover:bg-background',
        ghost: 'text-muted-foreground hover:bg-sunken hover:text-foreground',
        danger: 'border border-destructive/30 bg-surface text-destructive hover:bg-destructive-soft',
        link: 'h-auto px-0 text-foreground underline decoration-foreground/30 underline-offset-4 hover:decoration-foreground',
      },
      size: {
        sm: 'h-9 px-3 text-sm',
        md: 'h-11 px-4 text-[0.9375rem]',
        lg: 'h-12 px-5 text-base',
        icon: 'h-11 w-11',
      },
    },
    compoundVariants: [{ variant: 'link', className: 'h-auto px-0' }],
    defaultVariants: { variant: 'primary', size: 'md' },
  },
);

export type ButtonVariantProps = VariantProps<typeof buttonVariants>;
