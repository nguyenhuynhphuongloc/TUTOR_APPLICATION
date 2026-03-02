"use client";
import { useAuth } from "@/app/(app)/_providers/Auth";
import CardTestBank from "@/components/card/card-test-bank";
import PageLoading from "@/components/PageLoading";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import type { PeriodicTest, PeriodicTestAttempt } from "@/payload-types";
import { useQuery } from "@tanstack/react-query";
import {
  BookTextIcon,
  ClipboardListIcon,
  HeadphonesIcon,
  LayoutGridIcon,
  MenuIcon,
  MicIcon,
  PenIcon,
  SheetIcon,
} from "lucide-react";
import { type JSX, useMemo, useState } from "react";

interface TabSkill {
  name: string;
  icon: JSX.Element;
  value: string;
}

const tabs: TabSkill[] = [
  { name: "All skill", icon: <LayoutGridIcon />, value: "all_skill" },
  {
    name: "Listening",
    icon: <HeadphonesIcon />,
    value: "listening",
  },
  {
    name: "Writing",
    icon: <PenIcon />,
    value: "writing",
  },
  {
    name: "Speaking",
    icon: <MicIcon />,
    value: "speaking",
  },
  {
    name: "Reading",
    icon: <BookTextIcon />,
    value: "reading",
  },
  {
    name: "Grammar",
    icon: <SheetIcon />,
    value: "grammar",
  },
  {
    name: "Vocab",
    icon: <ClipboardListIcon />,
    value: "vocab",
  },
];

const MODE: TabSkill[] = [
  {
    name: "Full",
    value: "full",
    icon: <LayoutGridIcon />,
  },
  {
    name: "Compact",
    value: "compact",
    icon: <MenuIcon />,
  },
];

export default function QuestionBankPage() {
  const { user } = useAuth();
  const [currentTab, setCurrentTabs] = useState(tabs[0]);
  const [mode, setMode] = useState<"compact" | "full">("full");
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortOrder, setSortOrder] = useState<"latest" | "oldest">("latest");

  const { data, isLoading } = useQuery<PeriodicTest[]>({
    queryKey: ["tests"],
    queryFn: () =>
      fetch("/api/periodic_tests?where[type][equals]=bank&limit=1000")
        .then((res) => res.json())
        .then((res) => res.docs),
    refetchOnMount: "always",
    refetchOnWindowFocus: false,
  });

  const { data: attempts } = useQuery<PeriodicTestAttempt[]>({
    queryKey: ["test_attempts", user?.id],
    queryFn: () =>
      fetch(
        `/api/periodic_test_attempts?where[user][equals]=${user?.id}&where[status][equals]=completed&limit=1000`,
      )
        .then((res) => res.json())
        .then((res) => res.docs),
    enabled: !!user?.id,
  });

  const doneTestIds = useMemo(() => {
    if (!attempts) return new Set();
    return new Set(
      attempts.map((a) => (typeof a.test === "string" ? a.test : a.test.id)),
    );
  }, [attempts]);

  const filteredData = useMemo(() => {
    if (!data) return [];

    let result = [...data];

    // Filter by skill tab
    if (currentTab?.value !== "all_skill") {
      result = result.filter((item) =>
        item.tests.some((test) =>
          typeof test === "string" ? false : test.type === currentTab?.value,
        ),
      );
    }

    // Filter by search query
    if (searchQuery) {
      result = result.filter((item) =>
        item.title.toLowerCase().includes(searchQuery.toLowerCase()),
      );
    }

    // Filter by status
    if (statusFilter !== "all") {
      result = result.filter((item) => {
        const isDone = doneTestIds.has(item.id);
        return statusFilter === "done" ? isDone : !isDone;
      });
    }

    // Sort by date
    result.sort((a, b) => {
      const dateA = new Date(a.createdAt).getTime();
      const dateB = new Date(b.createdAt).getTime();
      return sortOrder === "latest" ? dateB - dateA : dateA - dateB;
    });

    return result;
  }, [
    data,
    currentTab?.value,
    searchQuery,
    statusFilter,
    sortOrder,
    doneTestIds,
  ]);

  if (isLoading) {
    return <PageLoading />;
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <p className="text-[24px] font-bold">Kho đề IELTS</p>
        <div className="bg-[#E7EAE9] h-10 min-w-[102px] rounded-[10px] p-1 flex items-center justify-between gap-1">
          {MODE.map((i: TabSkill) => (
            <div
              key={i.value}
              className={cn(
                "h-[30px] w-[50px]  rounded-[7px] flex items-center justify-center transition-colors duration-200 cursor-pointer hover:bg-white hover:text-[#E72929]",
                mode === i.value && "bg-white text-[#E72929]",
              )}
              onClick={() => setMode(i.value as "compact" | "full")}
            >
              {i.icon}
            </div>
          ))}
        </div>
      </div>

      <div className="flex items-center justify-between mt-6 gap-4 w-[900px]">
        {tabs.map((tab) => (
          <div
            key={tab.name}
            className={cn(
              "transition-colors duration-200 hover:bg-[#E729291A] hover:border-[#E72929] cursor-pointer w-[113px] h-[42px] border border-[#E7EAE9] text-[#6D737A] hover:text-[#E72929] rounded-[10px] flex items-center justify-center gap-2",
              tab.value === currentTab?.value
                ? "bg-[#E729291A] border-[#E72929] text-[#E72929]"
                : "",
            )}
            onClick={() => setCurrentTabs(tab)}
          >
            {tab.icon}
            <p className="text-center font-semibold text-[14px]">{tab.name}</p>
          </div>
        ))}
      </div>

      <div className="mt-3 flex items-center justify-center gap-3">
        <div className="w-full">
          <Input
            placeholder="Search for exam questions..."
            className="h-9"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Chọn trạng thái" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tất cả</SelectItem>
            <SelectItem value="not_done">Chưa làm</SelectItem>
            <SelectItem value="done">Đã làm</SelectItem>
          </SelectContent>
        </Select>
        <Select
          value={sortOrder}
          onValueChange={(v) => setSortOrder(v as "latest" | "oldest")}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Chọn thời gian" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="latest">Mới nhất</SelectItem>
            <SelectItem value="oldest">Cũ nhất</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div
        className={cn(
          "mt-8 ",
          mode === "full" ? "grid grid-cols-3 gap-4" : "flex flex-col gap-4",
        )}
      >
        {filteredData.length > 0 ? (
          filteredData.map((i) => (
            <CardTestBank
              mode={mode}
              key={i.id}
              data={i}
              isDone={doneTestIds.has(i.id)}
            />
          ))
        ) : (
          <div className="col-span-3 flex flex-col items-center justify-center min-h-[400px] bg-[rgba(168,171,178,0.05)] rounded-[20px] border-2 border-dashed border-[#E7EAE9] p-10 animate-in fade-in zoom-in duration-300">
            <div className="bg-white p-6 rounded-full shadow-sm mb-6">
              {currentTab?.icon ? (
                <div className="text-[#E72929] scale-[2.5]">
                  {currentTab.icon}
                </div>
              ) : (
                <LayoutGridIcon className="w-12 h-12 text-[#E72929]" />
              )}
            </div>
            <h3 className="text-[20px] font-bold text-[#151515] mb-2">
              Chưa có đề thi cho kỹ năng này
            </h3>
            <p className="text-[#6D737A] text-center max-w-[400px]">
              Hiện tại kỹ năng <strong>{currentTab?.name}</strong> chưa có đề
              thi nào trong ngân hàng câu hỏi. Vui lòng quay lại sau hoặc chọn
              kỹ năng khác.
            </p>
            <div
              className="mt-8 px-6 py-2 bg-[#E72929] text-white rounded-[10px] font-semibold cursor-pointer hover:bg-[#c62323] transition-colors"
              onClick={() => setCurrentTabs(tabs[0])}
            >
              Xem tất cả kỹ năng
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
