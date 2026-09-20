import React from "react";
import { cn } from "@/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 rounded-full font-sans font-semibold transition-all duration-200 active:scale-[.97] disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        primary: "bg-bleu-tech text-white shadow-[0_12px_30px_rgba(11,79,211,.22)] hover:bg-bleu-electrique hover:shadow-[0_16px_36px_rgba(11,79,211,.3)]",
        gold: "bg-or-light text-noir-profond shadow-[0_12px_30px_rgba(217,154,9,.24)] hover:bg-or hover:text-white",
        outline: "border border-bleu-tech/20 bg-white text-noir-profond hover:border-bleu-tech hover:bg-bleu-soft",
        ghost: "text-bleu-tech hover:bg-bleu-soft",
        whatsapp: "bg-[#25D366] text-white shadow-[0_10px_24px_rgba(37,211,102,.2)] hover:bg-[#20bd5a]",
      },
      size: {
        default: "px-6 py-3 text-sm",
        sm: "px-4 py-2 text-xs",
        lg: "px-8 py-4 text-base",
      },
    },
    defaultVariants: { variant: "primary", size: "default" },
  }
);

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(({ className, variant, size, ...props }, ref) => (
  <button className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />
));
Button.displayName = "Button";

export { Button, buttonVariants };
