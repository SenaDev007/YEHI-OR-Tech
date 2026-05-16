import React from "react";
import { cn } from "@/lib/utils";

interface TagProps {
  children: React.ReactNode;
  className?: string;
}

const Tag = ({ children, className }: TagProps) => {
  return (
    <div className={cn("flex items-center gap-3 mb-6", className)}>
      <div className="h-px w-8 bg-or" />
      <span className="text-[11px] font-mono font-bold text-or uppercase tracking-[0.2em]">
        {children}
      </span>
    </div>
  );
};

export default Tag;
