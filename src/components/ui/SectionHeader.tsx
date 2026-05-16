import React from "react";
import Tag from "./Tag";
import { cn } from "@/lib/utils";

interface SectionHeaderProps {
  tag?: string;
  title: string;
  subtitle?: string;
  centered?: boolean;
  className?: string;
}

const SectionHeader = ({
  tag,
  title,
  subtitle,
  centered,
  className
}: SectionHeaderProps) => {
  return (
    <div className={cn(
      "max-w-4xl mb-16",
      centered && "text-center mx-auto flex flex-col items-center",
      className
    )}>
      {tag && <Tag>{tag}</Tag>}
      <h2 className="text-white mb-6 leading-tight">{title}</h2>
      {subtitle && (
        <p className="text-lg md:text-xl text-gris leading-relaxed max-w-3xl">
          {subtitle}
        </p>
      )}
    </div>
  );
};

export default SectionHeader;
