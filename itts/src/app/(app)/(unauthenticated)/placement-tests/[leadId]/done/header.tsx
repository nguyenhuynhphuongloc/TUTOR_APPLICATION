import { cn } from "@/lib/utils";
import Image from "next/image";

export default function Header() {
  return (
    <header
      className={cn(
        "fixed left-0 top-0 z-10 h-[80px] w-full bg-white shadow-[0px_0px_60px_0px_rgba(0,0,0,0.05)]",
      )}
    >
      <div className="mx-auto flex h-full max-w-[1440px] items-center justify-between px-6 py-4">
        <div className="flex-1">
          <Image src="/logo.png" width={94} height={49} alt="logo" />
        </div>
      </div>
    </header>
  );
}
