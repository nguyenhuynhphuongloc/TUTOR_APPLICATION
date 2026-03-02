import { Loader2 } from "lucide-react";

export default function Loading() {
  return (
    <div className="flex justify-center items-center h-dvh [&>svg]:stroke-[#E7EAE9]">
      <Loader2 className="animate-spin" size={32} />
    </div>
  );
}
