"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { Id } from "@/convex/_generated/dataModel";
import { cn } from "@/lib/utils";
import { ChevronDown, ChevronRight, LucideIcon } from "lucide-react";
import React from "react";

interface ItemProp {
  id?: Id<"documents">;
  documentIcon?: string;
  active?: boolean;
  expanded?: boolean;
  isSearch?: boolean;
  level?: number;
  onExpand?: () => void; // Only for items that can expand
  label: string;
  onClick: () => void;
  icon: LucideIcon;
}

export default function Item({
  active,
  expanded,
  level = 0,
  onExpand, // Keep onExpand to determine if chevron should be displayed
  label,
  onClick,
  icon: Icon,
  documentIcon,
}: ItemProp) {
  const ChevronIcon = expanded ? ChevronDown : ChevronRight;

  return (
    <div
      role="button"
      onClick={onClick}
      style={{ paddingLeft: level ? `${level * 12 + 12}px` : "12px" }}
      className={cn(
        "group min-h-[27px] text-sm py-1 pr-3 w-full hover:bg-primary/5 flex items-center text-muted-foreground font-medium",
        active && "bg-primary/5 text-primary",
      )}
    >
      {/* Conditionally render Chevron for Expand/Collapse */}
      {onExpand && (
        <div
          role="button"
          className="h-full rounded-sm hover:bg-neutral-300 dark:hover:bg-neutral-600 mr-1"
          onClick={(e) => {
            e.stopPropagation(); // Prevents triggering the main click event
            onExpand?.(); // Calls expand function
          }}
        >
          <ChevronIcon className="h-4 w-4 text-muted-foreground" />
        </div>
      )}

      {documentIcon ? (
        <div className="shrink-0 mr-2 text-[18px]">{documentIcon}</div>
      ) : (
        <Icon className="shrink-0 h-[18px] mr-2 text-muted-foreground" />
      )}
      <span className="truncate">{label}</span>
    </div>
  );
}

Item.Skeleton = function ItemSkeleton({ level }: { level?: number }) {
  return (
    <div
      style={{ paddingLeft: level ? `${level * 12 + 25}px` : "12px" }}
      className="flex gap-x-2 py-[3px]"
    >
      <Skeleton className="h-4 w-4" />
      <Skeleton className="h-4 w-[30%]" />
    </div>
  );
};
