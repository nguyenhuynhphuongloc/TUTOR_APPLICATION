import { cn } from "@/lib/utils";
import type { JSX } from "react";

/**
 * A functional component that renders a criteria card with a name, score, and criteria.
 *
 * @param {{ name: string; score: number | null; criteria: string; index: number; isPdf: boolean }} props - The properties passed to the component.
 * @returns {JSX.Element} A div containing the criteria card.
 */
const CriteriaCard = ({
  name,
  score,
  criteria,
  index,
  isPdf,
}: {
  name: string;
  score: string | null;
  criteria: React.ReactNode;
  index: number;
  isPdf?: boolean;
}): JSX.Element => (
  <div className="w-[448px] min-h-[147px] rounded-[16px] bg-white border p-6 relative">
    <div
      className="flex items-center justify-between font-bold"
      style={{ marginBottom: isPdf ? 24 : 20 }}
    >
      <p style={{ marginTop: isPdf ? -14 : 0 }}>{name}</p>
      <div
        className={cn(
          "h-12 w-12 rounded-full flex items-center justify-center absolute top-[10px] right-[10px]",
          index % 2 === 0 ? "bg-[#C3C9F5]" : "bg-[#C9E6D6]",
        )}
      >
        <span style={{ marginTop: isPdf ? -14 : 0 }}>
          {score ? Number(score).toFixed(1) : "0.0"}
        </span>
      </div>
    </div>

    <div className="text-[#6D737A] whitespace-pre-line pr-8 text-justify ">
      {criteria}
    </div>
  </div>
);

export default CriteriaCard;
