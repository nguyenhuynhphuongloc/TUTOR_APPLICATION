import CircleProgressBar from "@/components/circle-progress-bar/CircleProgressbarWithChildren";
import buildStyles from "@/components/circle-progress-bar/buildStyles";
import { cn } from "@/lib/utils";
import { ClassInfo } from "./types";

interface OverviewCardsProps {
  classInfo: ClassInfo[];
}

export const OverviewCards = ({ classInfo }: OverviewCardsProps) => {
  return (
    <div className="mt-6 flex items-center justify-center gap-4 sm:gap-10 md:gap-16 lg:gap-[88px]">
      {classInfo.map((attr) => (
        <div
          className="w-full max-w-[254px] min-w-0 flex flex-col items-center"
          key={attr.name}
        >
          <div className="w-[127px]">
            <CircleProgressBar
              value={attr.max ? (attr.value * 100) / attr.max : 0}
              styles={buildStyles({
                rotation: 1 / 2 + 1 / 6,
                trailColor: "#F8EFE2",
                pathColor: "#E72929",
              })}
            >
              <div className="text-center">
                <div
                  className={cn(
                    "mt-6 text-2xl font-bold text-[#E72929]",
                    attr.max ? "" : "text-[32px]",
                  )}
                >
                  {attr.value}
                </div>
                {attr.max > 0 && (
                  <div className="text-md mt-[-6px] text-[#151515]">
                    ({attr.max})
                  </div>
                )}
              </div>
            </CircleProgressBar>
          </div>
          <div className="text-center text-overflow">
            <p className="text-center text-[20px] font-bold mt-[-16px]">
              {attr.name}
            </p>
            <p className="text-[#A8ABB2] text-[18px]">{attr.sub}</p>
          </div>
        </div>
      ))}
    </div>
  );
};
