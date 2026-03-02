/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
  ToggleGroupItem,
  ToggleGroup as ToggleGroupUI,
} from "@/components/ui/toggle-group";
import { cn } from "@/lib/utils";
import type { JSX } from "react";

/**
 * A toggle group component that renders a list of toggle group items.
 *
 * @param {Object} props The component props.
 * @param {string} props.className The CSS class name for the component.
 * @param {string} props.itemCn The CSS class name for the toggle group items.
 * @param {any} props.defaultValue The default selected value.
 * @param {Array<{ label: string, value: any }>} props.data The data to render in the toggle group items.
 * @returns {JSX.Element} The component.
 */
export function ToggleGroup({
  className,
  itemCn,
  defaultValue,
  onValueChange,
  data,
}: {
  className?: string;
  itemCn?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  data: Array<{ label: string; value: string }>;
}): JSX.Element {
  return (
    <div>
      <ToggleGroupUI
        className={cn("bg-[#E7EAE9] p-1", className)}
        type="single"
        defaultValue={defaultValue}
        onValueChange={onValueChange}
      >
        {data.map((i) => (
          <ToggleGroupItem value={i.value} key={i.value} className={itemCn}>
            {i.label}
          </ToggleGroupItem>
        ))}
      </ToggleGroupUI>
    </div>
  );
}
