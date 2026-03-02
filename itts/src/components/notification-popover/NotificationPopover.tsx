import { UITab } from "@/components/tab/UITab";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useState } from "react";
import NotificationCard from "./NotificationCard";

export default function NotificationPopover({ children }) {
  const [tab, setTab] = useState("all");

  const TYPE = [
    {
      name: "Tất cả",
      value: "all",
    },
    {
      name: "Bài tập",
      value: "exercise",
    },
    {
      name: "Option",
      value: "option",
    },
  ];

  const handleChangeTab = (tab: string) => {
    setTab(tab);
  };

  return (
    <Popover>
      <PopoverTrigger asChild>{children}</PopoverTrigger>
      <PopoverContent className="w-[400px] h-[504px] rounded-[20px]">
        <div className="p-2">
          <div className="flex items-center gap-2 mb-[18px]">
            <p className="text-2xl font-semibold">Thông báo</p>
            <div className="text-[11px] w-6 h-6 bg-[#E72929] text-white rounded-full flex items-center justify-center">
              17
            </div>
          </div>

          <UITab data={TYPE} activeTab={tab} onTabClick={handleChangeTab} />
          {/* <ScrollArea> */}
          <div className="overflow-y-scroll h-[370px] overflow-x-hidden">
            {Array.from({ length: 5 }).map((_, index) => (
              <NotificationCard key={index} />
            ))}
          </div>
          {/* </ScrollArea> */}
        </div>
      </PopoverContent>
    </Popover>
  );
}
