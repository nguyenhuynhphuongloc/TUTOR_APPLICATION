import { cn } from "@/lib/utils";
import isObject from "lodash-es/isObject";
import type { JSX } from "react";

/**
 * @param {{ data: Array<number>; onClickTab: (index: number) => void; }} props
 * @returns {JSX.Element[]}
 */
export function Tab({
  data,
  onClickTab,
  activeTab,
  name,
  size,
}: {
  data: Array<any>;
  onClickTab: (index: number) => void;
  activeTab?: number;
  name?: string;
  size: "sm" | "lg";
}): JSX.Element[] {
  return data.map((d, index) => (
    <div
      key={index}
      className={cn(
        "text-center flex items-center justify-center cursor-pointer transition-all duration-200 hover:bg-[#E72929] hover:text-white font-semibold",
        activeTab === index + 1
          ? "bg-[#E72929] text-white"
          : "bg-white  border border-[#F1F1F1] text-[#151515]",
        size === "sm"
          ? "w-8 h-8 text-[13px] rounded-[8px]"
          : "w-[101px] h-[43px] text-[16px] rounded-[16px]",
      )}
      onClick={() => onClickTab(index)}
    >
      {name
        ? isObject(d)
          ? `${name} ${index + 1}`
          : `${name} ${d}`
        : isObject(d)
          ? index + 1
          : d}
    </div>
  ));
}
