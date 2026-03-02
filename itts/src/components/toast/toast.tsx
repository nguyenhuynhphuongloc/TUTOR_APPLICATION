import { CircleCheckIcon } from "lucide-react";
import { toast } from "sonner";

export function successToast(message: string) {
  return toast(
    <div>
      <div className="text-[16px] font-bold text-[#151515]">Notification</div>
      <div className="flex items-center gap-2 text-[14px] text-[#6D737A]">
        {message}
        <CircleCheckIcon color="#23BD33" />
      </div>
    </div>,
  );
}
