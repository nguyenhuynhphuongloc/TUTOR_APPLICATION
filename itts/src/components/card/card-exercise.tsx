/* eslint-disable @typescript-eslint/no-floating-promises */
import { checkSessionFeedback } from "@/app/(app)/(authenticated)/student/exercise/actions";
import { createPeriodicAttempt } from "@/app/(app)/(authenticated)/student/tests/[attemptId]/actions";
import { useAuth } from "@/app/(app)/_providers/Auth";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { TIME_FORMAT_TEST_FULL_MAPPING } from "@/constants";
import { cn } from "@/lib/utils";
import type { PeriodicTest, PeriodicTestAttempt, Test } from "@/payload-types";
import { format } from "date-fns";
import { isEmpty } from "lodash-es";
import {
  ArrowRightIcon,
  BookTextIcon,
  CalendarClockIcon,
  CheckIcon,
  ClipboardListIcon,
  FileTextIcon,
  HeadphonesIcon,
  MicIcon,
  PenIcon,
  SheetIcon,
  TimerIcon,
  XIcon,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { Fragment, type JSX, useEffect, useState } from "react";
import SessionReviewModal from "../modal/SessionReviewModal";

const SKILL_MAPPING: Record<string, { icon: JSX.Element; value: string }> = {
  listening: {
    icon: <HeadphonesIcon />,
    value: "listening",
  },
  writing: {
    icon: <PenIcon />,
    value: "writing",
  },
  speaking: {
    icon: <MicIcon />,
    value: "speaking",
  },
  reading: {
    icon: <BookTextIcon />,
    value: "reading",
  },
  grammar: {
    icon: <SheetIcon />,
    value: "grammar",
  },
  vocab: {
    icon: <ClipboardListIcon />,
    value: "vocab",
  },
};

const STATUS_MAPPING: Record<string | number, { color: string; text: string }> =
  {
    not_submitted: { color: "#E72929", text: "Chưa làm bài" },
    in_progress: { color: "#E72929", text: "Chưa làm bài" },
    completed: { color: "#23BD33", text: "Đã nộp" },
    not_graded_yet: { color: "#23BD33", text: "Chưa chấm" },
    late: { color: "#FBA631", text: "Nộp trễ" },
  };

const CardExercise = ({
  data,
  attempt,
  deadline,
  classId,
  session,
  type,
}: {
  data: PeriodicTest;
  attempt?: PeriodicTestAttempt;
  deadline: Date;
  classId: string;
  session: number;
  type: string;
}): JSX.Element => {
  const { title, id, tests } = data;
  const router = useRouter();
  const { user } = useAuth();
  const [testInfo, setTestInfo] = useState<Test>();
  const [isReviewed, setIsReviewed] = useState(false);

  useEffect(() => {
    const checkReviewed = async () => {
      if (!user || !classId || !session) return;

      // Chỉ yêu cầu review cho 'homework' và 'extra_homework'
      if (!["homework", "extra_homework"].includes(type)) {
        setIsReviewed(true);
        return;
      }

      const reviewed = await checkSessionFeedback({
        userId: user.id,
        classId,
        session,
      });
      console.log("reviewed", reviewed);
      setIsReviewed(reviewed);
    };
    checkReviewed();
  }, [user, classId, session, type]);

  useEffect(() => {
    const getTestInfo = async () => {
      if (!tests?.[0]) return;
      const testId = typeof tests[0] === "string" ? tests[0] : tests[0].id;
      const res = await fetch(`/api/tests/${testId}`);
      const response = (await res.json()) as Test;
      setTestInfo(response);
    };
    getTestInfo();
  }, [tests]);

  const getStatus = () => {
    if (!attempt || attempt.status !== "completed") return "not_submitted";
    const isCompleted = attempt.status === "completed";
    const hasScore = !isEmpty(attempt.score);
    const isLate =
      attempt.completedAt && new Date(attempt.completedAt) > new Date(deadline);

    if (isLate) return "late";
    if (isCompleted && !hasScore) return "not_graded_yet";
    if (isCompleted) return "completed";
    return "not_submitted";
  };

  const status = getStatus();

  const handleDoExercise = async () => {
    const { success, data: attemptData } = await createPeriodicAttempt({
      type,
      userId: user!.id,
      testId: id,
      classId,
      session,
    });

    if (success) {
      router.replace(`/student/tests/${attemptData!.id}`);
    }
  };

  const handleCheckResult = () => {
    router.push(`/test-result?attemptId=${attempt!.id}`);
  };

  if (!testInfo) {
    return (
      <div className="h-[134px] w-full overflow-hidden rounded-2xl bg-white shadow-xl relative p-4">
        <Skeleton className="relative z-1 h-5 w-full rounded-lg overflow-hidden" />

        <Skeleton className="h-7 w-full mt-12" />
      </div>
    );
  }

  return (
    <Card className="relative px-3 pt-[12px] pb-3 bg-[rgba(168,171,178,0.1)] rounded-[12px] h-[134px]">
      <div className="flex items-center gap-2">
        <p className="font-semibold">{title}</p>
        <TooltipProvider delayDuration={100}>
          <Tooltip>
            <TooltipTrigger asChild>
              <div
                className={cn(
                  "rounded-full h-[15px] w-[15px] flex items-center justify-center",
                  status === "late"
                    ? "bg-[#FBA631]"
                    : ["completed", "not_graded_yet"].includes(status)
                      ? "bg-[#23BD33]"
                      : "bg-[#E72929]",
                )}
              >
                {["not_submitted", "in_progress"].includes(status) ? (
                  <XIcon width={10} height={10} className="text-white" />
                ) : (
                  <CheckIcon width={10} height={10} className="text-white" />
                )}
              </div>
            </TooltipTrigger>
            <TooltipContent
              className={cn(
                status === "late"
                  ? "bg-[#FBA631]"
                  : ["completed", "not_graded_yet"].includes(status)
                    ? "bg-[#23BD33]"
                    : "bg-[#E72929]",
              )}
            >
              <p>{STATUS_MAPPING[status]?.text}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
      <div className="absolute right-0 top-0 bg-white h-[42px] w-[42px] flex items-center justify-center text-[#E72929] rounded-bl-xl border-white border-4">
        {testInfo?.type && SKILL_MAPPING[testInfo.type]?.icon}
      </div>

      {deadline ? (
        <div className="flex items-center gap-2 flex-1 mt-2">
          <CalendarClockIcon
            className="text-[#6D737A]"
            width={16}
            height={16}
          />
          {format(deadline || new Date(), "dd/MM/yyyy HH:mm a")}
        </div>
      ) : (
        <p className="text-[14px] mb-[4px]">Giáo viên chưa giao hạn nộp bài</p>
      )}

      <div className="absolute bottom-3 right-3 mt-3 rounded-[10px] bg-white h-[34px] pl-3 w-[calc(100%-24px)]">
        <div className="text-[14px] font-bold text-[#6D737A] flex gap-1 h-full items-center">
          {!isEmpty(attempt?.score) ? (
            <Fragment>
              <FileTextIcon
                width={16}
                height={16}
                className="text-[#E72929] mt-[-2px]"
              />
              {(attempt!.score as any)?.score || 0}
            </Fragment>
          ) : (
            <Fragment>
              <TimerIcon width={16} height={16} className="mt-[-2px]" />
              {(testInfo?.type &&
                TIME_FORMAT_TEST_FULL_MAPPING[
                  testInfo.type as keyof typeof TIME_FORMAT_TEST_FULL_MAPPING
                ]) ||
                0}{" "}
              phút
            </Fragment>
          )}
        </div>
        {status === "not_submitted" ? (
          isReviewed ? (
            <Button
              className="absolute right-0 top-0 h-[34px] bg-[#FD4444]"
              onClick={handleDoExercise}
            >
              Làm bài
              <ArrowRightIcon width={14} height={14} />
            </Button>
          ) : (
            <SessionReviewModal
              onSubmit={async () => handleDoExercise()}
              classId={classId}
              session={session}
            >
              <Button className="absolute right-0 top-0 h-[34px] bg-[#FD4444]">
                Làm bài
                <ArrowRightIcon width={14} height={14} />
              </Button>
            </SessionReviewModal>
          )
        ) : (
          <Button
            className="absolute right-0 top-0 h-[34px] bg-[#FD4444]"
            onClick={handleCheckResult}
          >
            Xem lại bài
            <ArrowRightIcon width={14} height={14} />
          </Button>
        )}
      </div>
    </Card>
  );
};

export default CardExercise;
