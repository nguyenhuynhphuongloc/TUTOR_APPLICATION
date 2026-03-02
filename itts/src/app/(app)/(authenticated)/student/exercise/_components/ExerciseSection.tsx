import CardExercise from "@/components/card/card-exercise";
import { UITab } from "@/components/tab/UITab";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PeriodicTest, PeriodicTestAttempt } from "@/payload-types";
import { isEmpty } from "lodash-es";
import { CircleAlertIcon } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

interface ExerciseSectionProps {
  classId: string;
  session: number;
  tab: string;
  onTabChange: (tab: string) => void;
  exercises: any[] | null | undefined;
  homeworkAttempts: PeriodicTestAttempt[];
  deadline: Date;
  sessionInfo: any;
}

const MODE = [
  { name: "Bài tập về nhà", value: "homework" },
  { name: "Bài tập bổ trợ", value: "extra_homework" },
];

export const ExerciseSection = ({
  classId,
  session,
  tab,
  onTabChange,
  exercises,
  homeworkAttempts,
  deadline,
  sessionInfo,
}: ExerciseSectionProps) => {
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const filteredExercises = exercises?.filter((test: PeriodicTest) => {
    if (statusFilter === "all") return true;

    const attempt = homeworkAttempts.find(
      (a: PeriodicTestAttempt) =>
        (a.test as any)?.id === test.id &&
        (a.class && typeof a.class === "object" ? a.class.id : a.class) ===
          classId &&
        a.session === session &&
        a.type === tab,
    );

    const isCompleted = attempt?.status === "completed";
    const hasScore = !isEmpty(attempt?.score);
    const isLate =
      isCompleted &&
      attempt?.completedAt &&
      new Date(attempt.completedAt) > new Date(deadline);

    switch (statusFilter) {
      case "submitted":
        return isCompleted;
      case "not_graded_yet":
        return isCompleted && !hasScore;
      case "late":
        return isLate;
      case "not_submitted":
        return !isCompleted;
      default:
        return true;
    }
  });

  const tabs = [
    { name: "Bài tập về nhà", value: "homework" },
    { name: "Bài tập bổ trợ", value: "extra_homework" },
  ];

  if (!isEmpty((sessionInfo as any)?.mid_test)) {
    tabs.push({ name: "Bài thi giữa kỳ", value: "mid_term" });
  }

  if (!isEmpty((sessionInfo as any)?.final_test)) {
    tabs.push({ name: "Bài thi cuối kỳ", value: "final_term" });
  }

  const activeTabName = tabs.find((t) => t.value === tab)?.name || "Bài tập";

  return (
    <div className="mt-6">
      <UITab data={tabs} activeTab={tab} onTabClick={onTabChange} />

      <div className="mt-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Image
              src="/book-saved.svg"
              alt="book-saved"
              width={24}
              height={24}
            />
            <p className="font-semibold text-2xl">{activeTabName}</p>
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Chọn trạng thái" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả</SelectItem>
              <SelectItem value="submitted">Đã nộp</SelectItem>
              <SelectItem value="not_graded_yet">Chưa chấm</SelectItem>
              <SelectItem value="late">Nộp trễ</SelectItem>
              <SelectItem value="not_submitted">Chưa làm</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {!isEmpty(filteredExercises) ? (
          <div className="mt-6 grid grid-cols-4 gap-2 sm:gap-4 md:gap-6">
            {filteredExercises?.map((test: PeriodicTest) => {
              const attempt = homeworkAttempts.find(
                (a: PeriodicTestAttempt) =>
                  (a.test as any)?.id === test.id &&
                  (a.class && typeof a.class === "object"
                    ? a.class.id
                    : a.class) === classId &&
                  a.session === session &&
                  a.type === tab,
              );

              return (
                <CardExercise
                  key={test.id}
                  classId={classId}
                  session={session}
                  data={test}
                  attempt={attempt}
                  deadline={deadline}
                  type={tab}
                />
              );
            })}
          </div>
        ) : (
          <div className="mt-6 font-semibold flex items-center gap-2">
            <CircleAlertIcon color="#E72929" />
            <span className="text-[#E72929]">
              {statusFilter === "all"
                ? `Giáo viên chưa giao ${activeTabName.toLowerCase()} cho buổi học này`
                : `Không có ${activeTabName.toLowerCase()} nào ở trạng thái này`}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};
