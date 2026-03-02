import { cn } from "@/lib/utils";

export default function StarDivider({ ...props }) {
  return (
    <div className={cn("flex items-center px-6 w-full", props.className)}>
      <div className="h-[1px] flex-grow bg-[#E9E9E9]" />
      <div className="mx-4 text-red-500">
        <svg viewBox="0 0 24 24" className="h-2.5 w-2.5" fill="currentColor">
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
      </div>
      <div className="h-[1px] flex-grow bg-[#E9E9E9]" />
    </div>
  );
}
