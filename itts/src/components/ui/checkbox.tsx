"use client";

import * as CheckboxPrimitive from "@radix-ui/react-checkbox";
import { Check } from "lucide-react";
import * as React from "react";

import { cn } from "@/lib/utils";

const colorVariants = {
  primary:
    "border-primary data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground",
  success:
    "border-green-500 data-[state=checked]:bg-green-500 data-[state=checked]:text-white",
  danger:
    "border-red-500 data-[state=checked]:bg-red-500 data-[state=checked]:text-white",
  warning:
    "border-[#FBA631] data-[state=checked]:bg-[#FBA631] data-[state=checked]:text-white",
} as const;

type Color = keyof typeof colorVariants;

interface CheckboxProps
  extends React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root> {
  color?: Color;
}

const Checkbox = React.forwardRef<
  React.ElementRef<typeof CheckboxPrimitive.Root>,
  CheckboxProps
>(({ className, color = "primary", ...props }, ref) => (
  <CheckboxPrimitive.Root
    ref={ref}
    className={cn(
      "peer h-4 w-4 shrink-0 rounded-sm border shadow focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
      colorVariants[color],
      className,
    )}
    {...props}
  >
    <CheckboxPrimitive.Indicator className="flex items-center justify-center text-current">
      <Check className="h-4 w-4" />
    </CheckboxPrimitive.Indicator>
  </CheckboxPrimitive.Root>
));
Checkbox.displayName = CheckboxPrimitive.Root.displayName;

export { Checkbox };
