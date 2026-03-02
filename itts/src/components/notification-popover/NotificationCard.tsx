import { CalendarDaysIcon, ClockIcon } from "lucide-react";
import Image from "next/image";

export default function NotificationCard() {
  return (
    <div className="w-[352px] h-[108px] rounded-[16px] p-4 border border-[#E7EAE9] mt-[10px] space-y-1">
      <div className="flex items-center gap-2">
        <div className="w-2 h-2 bg-[#A11528] rounded-full"></div>
        <p className="text-[16px] font-semibold">Bài tập</p>
      </div>

      <div className="flex items-center gap-2">
        <Image src="/teacher.svg" alt="teacher" width={16} height={16} />
        <p className="text-[14px]">Bài tập về nhà buổi 3 - Reading</p>
      </div>
      <div className="flex gap-6 text-[#6D737A] text-[14px]">
        <div className="flex items-center gap-2">
          <ClockIcon width={14} height={14} />
          <p>09:00 - 09:30</p>
        </div>

        <div className="flex items-center gap-2">
          <CalendarDaysIcon width={14} height={14} />
          <p>Sun, 14/11/2024</p>
        </div>
      </div>
    </div>
  );
}
