import { cn } from "@/lib/utils";
import { JSX } from "react";

/**
 * Renders a tab component with either a transparent or default style.
 *
 * @param {{ data: Array<{ value: string, name: string }>; onTabClick: (value: string) => void; activeTab: string; style?: "default" | "transparent"; valueToShow?: "name" | "value" }} props
 * @returns {JSX.Element}
 */
export function UITab({
  data,
  onTabClick,
  activeTab,
  style = "default",
  valueToShow = "name",
}: {
  data: Array<{ value: string; name: string }>;
  onTabClick: (value: string) => void;
  activeTab: string;
  style?: "default" | "transparent";
  valueToShow?: "name" | "value";
}): JSX.Element {
  return style === "transparent" ? (
    <div className="bg-[#E7EAE9] h-10 min-w-[102px] rounded-[10px] p-1 flex items-center justify-between gap-1">
      {data.map((i) => (
        <div
          key={i.value}
          className={cn(
            "h-[30px] w-[50px]  rounded-[7px] flex items-center justify-center transition-colors duration-200 cursor-pointer hover:bg-white hover:text-[#E72929]",
            activeTab === i.value ? "bg-white text-[#E72929]" : "",
          )}
          onClick={() => onTabClick(i.value)}
        >
          {i[valueToShow]}
        </div>
      ))}
    </div>
  ) : (
    <div className="w-fit bg-white flex items-center justify-between gap-1 p-[5px] border rounded-[10px]">
      {data.map((i) => (
        <div
          key={i.value}
          className={cn(
            "h-[39px] px-4 font-semibold rounded-[8px] flex items-center justify-center transition-colors duration-200 cursor-pointer hover:bg-[rgba(231,41,41,0.1)] hover:text-[#E72929] text-[#A8ABB2] whitespace-nowrap",
            activeTab === i.value
              ? "bg-[rgba(231,41,41,0.1)] text-[#E72929]"
              : "",
          )}
          onClick={() => onTabClick(i.value)}
        >
          {i[valueToShow]}
        </div>
      ))}
    </div>
  );
}
