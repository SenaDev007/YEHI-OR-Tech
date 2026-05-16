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
      "max-w-6xl mb-20 relative",
      centered && "text-center mx-auto flex flex-col items-center",
      className
    )}>
      {tag && <Tag>{tag}</Tag>}
      <h2 className="text-white mt-8 mb-8 uppercase tracking-tighter">
        {title}
      </h2>
      {subtitle && (
        <p className="text-lg md:text-2xl text-gris leading-snug max-w-4xl">
          {subtitle}
        </p>
      )}
    </div>
  );
};

export default SectionHeader;
