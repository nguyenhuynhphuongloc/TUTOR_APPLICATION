import { cn } from "@/lib/utils";

function Header() {
  return (
    <div
      className={cn(
        "fixed left-0 top-0 z-10",
        "h-[80px] w-full bg-white shadow-[0px_0px_60px_0px_rgba(0,0,0,0.05)]",
      )}
    >
      <div
        className={cn(
          "mx-auto h-full max-w-[1440px]",
          "flex items-center justify-between",
        )}
      >
        <div>left</div>
        <div>center</div>
        <div>right</div>
      </div>
    </div>
  );
}

export default Header;
