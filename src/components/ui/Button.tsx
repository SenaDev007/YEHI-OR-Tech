import React from "react";
import { cn } from "@/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";

const buttonVariants = cva(
  "inline-flex items-center justify-center transition-all duration-300 font-bold active:scale-95 disabled:opacity-50 disabled:pointer-events-none",
  {
    variants: {
      variant: {
        primary: "bg-or text-noir-profond hover:bg-or-light shadow-[0_0_20px_rgba(201,168,76,0.3)] clip-angular",
        outline: "border border-blanc/20 text-blanc hover:bg-white/5 hover:border-blanc/40 clip-angular",
        ghost: "text-blanc hover:bg-white/5",
        whatsapp: "bg-[#25D366] text-white hover:bg-[#128C7E] clip-angular",
      },
      size: {
        default: "px-8 py-4 text-base",
        sm: "px-4 py-2 text-sm",
        lg: "px-10 py-5 text-lg",
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
