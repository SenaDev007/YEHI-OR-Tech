import React from "react";
import { cn } from "@/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";

const buttonVariants = cva(
  "inline-flex items-center justify-center transition-all duration-500 font-bold active:scale-95 disabled:opacity-50 disabled:pointer-events-none rounded-full px-8 py-4 text-base",
  {
    variants: {
      variant: {
        primary: "bg-or text-noir-profond hover:bg-white hover:text-noir-profond shadow-[0_0_30px_rgba(245,183,0,0.2)]",
        outline: "border border-white/20 text-white hover:bg-white hover:text-noir-profond",
        ghost: "text-white hover:bg-white/5",
        whatsapp: "bg-[#25D366] text-white hover:bg-white hover:text-[#25D366] shadow-[0_0_30px_rgba(37,211,102,0.2)]",
      },
      size: {
        default: "px-8 py-4 text-base",
        sm: "px-6 py-2.5 text-sm",
        lg: "px-12 py-6 text-xl",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "default",
    },
  }
);

interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
