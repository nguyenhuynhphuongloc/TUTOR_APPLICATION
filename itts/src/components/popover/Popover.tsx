"use client";

import { cn } from "@/lib/utils";
import React, { useEffect, useRef } from "react";

type CustomPopoverProps = {
  trigger: React.ReactNode;
  content: React.ReactNode;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  className?: string;
};

export const CustomPopover = ({
  trigger,
  content,
  open,
  onOpenChange,
  className,
}: CustomPopoverProps) => {
  const triggerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        triggerRef.current &&
        !triggerRef.current.contains(e.target as Node) &&
        contentRef.current &&
        !contentRef.current.contains(e.target as Node)
      ) {
        onOpenChange(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative w-full">
      <div ref={triggerRef} onClick={() => onOpenChange(!open)}>
        {trigger}
      </div>
      {open && (
        <div
          ref={contentRef}
          className={cn(
            "absolute z-50 mt-2 w-full rounded-md border bg-white shadow-lg",
            className,
          )}
        >
          {content}
        </div>
      )}
    </div>
  );
};
