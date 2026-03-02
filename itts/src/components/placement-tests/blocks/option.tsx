import { cn } from "@/lib/utils";

function Option({
  option,
  idx,
}: {
  option: string;
  correctAnswer?: boolean;
  id?: string | null;
  idx: number;
}) {
  return (
    <>
      <span
        className={cn(
          "mr-2 inline-flex h-[28px] w-[28px] font-bold",
          "items-center justify-center rounded-full border border-solid",
          "bg-[#F8F8F8] text-[12px] border-[#E7EAE9]",
          "group-data-[state=on]:bg-[#E729291A]",
          "group-data-[state=on]:border-[#E7292933]",
        )}
      >
        {String.fromCharCode(65 + idx)}
      </span>
      <span>{option}</span>
    </>
  );
}

export default Option;
