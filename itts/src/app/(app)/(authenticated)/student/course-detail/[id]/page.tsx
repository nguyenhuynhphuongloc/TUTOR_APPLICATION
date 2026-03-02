"use client";

import { useAuth } from "@/app/(app)/_providers/Auth";
import PageLoading from "@/components/PageLoading";
import { Card } from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { dayMap } from "@/constants";
import type { Class } from "@/payload-types";
import { useQuery } from "@tanstack/react-query";
import { addHours, format } from "date-fns";
import upperFirst from "lodash-es/upperFirst";
import {
  BookOpenText,
  BookText,
  Calendar,
  ChartNoAxesColumnIncreasing,
  Clock,
  Headphones,
  House,
  MessagesSquare,
  Mic,
  Newspaper,
  NotebookText,
  NotepadText,
  Pencil,
  School,
  SquareLibrary,
} from "lucide-react";
import Image from "next/image";
import { useParams } from "next/navigation";
import { stringify } from "qs-esm";

const InfoItems = [
  {
    title: "Lịch học",
    name: "schedule",
    icon: <Calendar />,
  },
  {
    title: "Giờ học",
    name: "time",
    icon: <Clock />,
  },
  {
    title: "Phòng học",
    name: "room",
    icon: <House />,
  },
  {
    title: "Số buổi",
    name: "totalSession",
    icon: <NotebookText />,
  },
  {
    title: "Số bài tập",
    name: "totalHomework",
    icon: <BookOpenText />,
  },
  {
    title: "Level",
    name: "level",
    icon: <ChartNoAxesColumnIncreasing />,
  },
  {
    title: "Thời gian khóa học",
    name: "courseDuration",
    icon: <NotepadText />,
  },
  {
    title: "Group lớp",
    name: "link_group",
    icon: <MessagesSquare />,
  },
  {
    title: "Cơ sở",
    name: "branch",
    icon: <School />,
  },
];

const skillMapping = {
  listening: <Headphones stroke="#E72929" width={18} height={18} />,
  grammar: <BookText stroke="#E72929" width={18} height={18} />,
  writing: <Pencil stroke="#E72929" width={18} height={18} />,
  speaking: <Mic stroke="#E72929" width={18} height={18} />,
  reading: <Newspaper stroke="#E72929" width={18} height={18} />,
  vocabulary: <SquareLibrary stroke="#E72929" width={18} height={18} />,
};

const skills = [
  {
    title: "Reading",
    description:
      "Để có cơ sở xây dựng lộ trình học IELTS từ 0 đến 6.5, bạn cần phải tìm hiểu những yêu cầu để đạt được band 6.5. Sau khi đã có những yêu cầu sơ bộ, bạn sẽ tiến hành kiểm tra năng lực của bản thân rồi tiếp đến",
  },
  {
    title: "Listening",
    description:
      "Để có cơ sở xây dựng lộ trình học IELTS từ 0 đến 6.5, bạn cần phải tìm hiểu những yêu cầu để đạt được band 6.5. Sau khi đã có những yêu cầu sơ bộ, bạn sẽ tiến hành kiểm tra năng lực của bản thân rồi tiếp đến",
  },
  {
    title: "Writing",
    description:
      "Để có cơ sở xây dựng lộ trình học IELTS từ 0 đến 6.5, bạn cần phải tìm hiểu những yêu cầu để đạt được band 6.5. Sau khi đã có những yêu cầu sơ bộ, bạn sẽ tiến hành kiểm tra năng lực của bản thân rồi tiếp đến",
  },
  {
    title: "Grammar",
    description:
      "Để có cơ sở xây dựng lộ trình học IELTS từ 0 đến 6.5, bạn cần phải tìm hiểu những yêu cầu để đạt được band 6.5. Sau khi đã có những yêu cầu sơ bộ, bạn sẽ tiến hành kiểm tra năng lực của bản thân rồi tiếp đến",
  },
  {
    title: "Vocabulary",
    description:
      "Để có cơ sở xây dựng lộ trình học IELTS từ 0 đến 6.5, bạn cần phải tìm hiểu những yêu cầu để đạt được band 6.5. Sau khi đã có những yêu cầu sơ bộ, bạn sẽ tiến hành kiểm tra năng lực của bản thân rồi tiếp đến",
  },
  {
    title: "Speaking",
    description:
      "Để có cơ sở xây dựng lộ trình học IELTS từ 0 đến 6.5, bạn cần phải tìm hiểu những yêu cầu để đạt được band 6.5. Sau khi đã có những yêu cầu sơ bộ, bạn sẽ tiến hành kiểm tra năng lực của bản thân rồi tiếp đến",
  },
];

export default function CourseDetail() {
  const { id } = useParams();
  const { user } = useAuth();

  const stringifiedQuery = stringify(
    { where: { students: { in: user?.id }, course: { equals: id } } },
    { addQueryPrefix: true },
  );

  const { data, isLoading } = useQuery<Class>({
    queryKey: ["getClassDetailByCourseId", user?.id, id],
    queryFn: () =>
      fetch(`/api/classes${stringifiedQuery}`)
        .then((res) => res.json())
        .then((res) => res.docs?.[0]),
    refetchOnMount: "always",
    enabled: !!user?.id && !!id,
  });

  console.log("🚀 ~ CourseDetail ~ data:", data);

  const sessionTime = data?.session_time ? new Date(data.session_time) : null;

  const classInfo: Record<string, string | number> = {
    schedule: data?.days_of_week
      ? data.days_of_week.map((d) => dayMap[d]).join(" - ")
      : "Đang cập nhật",
    time:
      sessionTime && data?.time_per_session
        ? `${format(sessionTime, "HH:mm")} - ${format(addHours(sessionTime, data.time_per_session), "HH:mm")}`
        : "Đang cập nhật",
    room: data?.room?.name ?? "Đang cập nhật",
    totalSession: data?.sessions?.length ?? 0,
    totalHomework: "",
    level: "",
    courseDuration:
      data?.sessions && data.sessions.length > 0
        ? `${format(new Date(data.sessions[0].date), "dd/MM/yyyy")} - ${format(new Date(data.sessions[data.sessions.length - 1].date), "dd/MM/yyyy")}`
        : "Đang cập nhật",
    link_group: "",
    branch: data?.branch?.name ?? "Đang cập nhật",
  };
  console.log("🚀 ~ CourseDetail ~ classInfo:", classInfo);

  if (isLoading) {
    return <PageLoading />;
  }

  if (!data) {
    return (
      <div className="flex flex-col items-center justify-center p-10">
        <p className="text-lg text-gray-500">
          Không tìm thấy thông tin lớp học.
        </p>
      </div>
    );
  }

  const now = new Date();
  const nowVN = new Date(now.getTime() + 7 * 60 * 60 * 1000);
  const startDate = data.startDate ? new Date(data.startDate) : null;
  const isBeforeStart = startDate ? now < startDate : false;

  let displayStatus = {
    label: "Đang học",
    value: "",
    icon: "/home/timer.svg",
    bgColor: "bg-[#FBA6310D]",
    statusLabelColor: "text-[#6D737A]",
  };

  if (data.status_class === "opening") {
    displayStatus = {
      label: "Chưa khai giảng",
      value: data.startDate
        ? format(new Date(data.startDate), "dd/MM/yyyy")
        : "Đang cập nhật",
      icon: "/home/teacher.svg",
      bgColor: "bg-[#A8ABB20D]", // #A8ABB2 5%
      statusLabelColor: "text-[#6D737A]",
    };
  } else if (data.status_class === "active") {
    // Tính buổi học thứ mấy - Cộng thêm 7 tiếng (ICT) để đồng bộ với logic hệ thống
    const pastSessions =
      data.sessions?.filter(
        (s) => new Date(s.date).getTime() < nowVN.getTime(),
      ) || [];
    const currentSessionCount =
      pastSessions.length > 0 ? pastSessions.length : 1;
    displayStatus = {
      label: "Đang học",
      value: `${String(currentSessionCount).padStart(2, "0")} ngày`,
      icon: "/home/timer.svg",
      bgColor: "bg-[#FBA6310D]",
      statusLabelColor: "text-[#6D737A]",
    };
  } else if (data.status_class === "closed") {
    displayStatus = {
      label: "Đã hoàn thành",
      value: "Hoàn thành",
      icon: "/home/timer.svg", // Giữ icon mặc định hoặc bạn muốn đổi?
      bgColor: "bg-[#23BD330D]", // Success 5%
      statusLabelColor: "text-[#23BD33]",
    };
  }

  return (
    <div>
      <h1 className="text-2xl font-bold">Trạng thái</h1>
      <div className="mb-4 mt-5 flex gap-6">
        <div className="inline-flex w-[21.375rem] items-center gap-3 rounded-lg border border-[#E7EAE9] p-2">
          <div
            className={`flex h-[50px] w-[50px] items-center justify-center rounded-[0.625rem] ${displayStatus.bgColor}`}
          >
            <Image
              src={displayStatus.icon}
              alt="status-icon"
              width={24}
              height={24}
            />
          </div>
          <div className="flex flex-col">
            <span className={`text-xs ${displayStatus.statusLabelColor}`}>
              {displayStatus.label}
            </span>
            <span className={`text-lg font-bold`}>{displayStatus.value}</span>
          </div>
        </div>
        <div className="inline-flex w-[21.375rem] items-center gap-3 rounded-lg border border-[#E7EAE9] p-2 h-[4.125rem]">
          <div className="flex h-[50px] w-[50px] items-center justify-center rounded-[0.625rem] bg-[#3FAFC60D] text-[#E72929]">
            <Image
              src="/home/scanning.svg"
              alt="scanning"
              width={24}
              height={24}
            />
          </div>
          <div className="flex flex-col">
            <span className="text-xs text-[#6D737A]">Mã lớp</span>
            <span className="text-lg font-bold text-[#151515]">
              {data.name}
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {InfoItems.map((item) => {
          return (
            <div
              key={item.title}
              className="mb-4 inline-flex w-full items-center gap-3"
            >
              <div
                className={`flex h-10 w-10 items-center justify-center rounded-[0.625rem] bg-[#E729291A] text-[#E72929]`}
              >
                {item.icon}
              </div>
              <div className="flex flex-col">
                <span className="text-xs text-[#6D737A]">{item.title}</span>
                <span className="text-sm font-semibold text-[#151515]">
                  {classInfo[item.name]}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      <div>
        <h1 className="mt-[2.5rem] text-2xl font-bold">Giáo viên phụ trách</h1>
        <div className="card mt-[1.5rem] grid grid-cols-1 gap-6 text-sm text-[#6D737A] md:grid-cols-2 lg:grid-cols-3">
          {data?.teachers && data.teachers.length > 0 ? (
            data.teachers.map(({ teacher, skill, id: teacherId }) => {
              if (!teacher) return null;
              return (
                <div
                  key={teacherId}
                  className="mb-4 flex h-[7.125rem] gap-4 rounded-lg border border-[#E3DBD8]"
                >
                  <div className="relative flex h-full w-[50%] items-center justify-center rounded-[0.625rem] bg-[#D9D9D9] text-[#E72929]">
                    <Image
                      src="/teach.svg"
                      alt={teacherId || "teacher"}
                      className="h-10 w-10"
                      width={152}
                      height={114}
                    />
                  </div>
                  <div className="flex flex-col p-3">
                    <span>Giáo viên</span>
                    <span className="text-sm font-semibold text-[#151515]">
                      {teacher.fullName}
                    </span>
                    <span className="mt-[0.9375rem] text-xs text-[#6D737A]">
                      {skill?.map((i) => {
                        return (
                          <TooltipProvider key={i}>
                            <Tooltip delayDuration={200}>
                              <TooltipTrigger asChild>
                                <div className="mr-2 inline-block cursor-pointer rounded-lg border border-[#E7EAE9] p-2">
                                  {skillMapping[i as keyof typeof skillMapping]}
                                </div>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>{upperFirst(i)}</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        );
                      })}
                    </span>
                  </div>
                </div>
              );
            })
          ) : (
            <p className="py-4 text-sm text-gray-500">Đang cập nhật</p>
          )}
        </div>
      </div>

      <div className="mb-4">
        <h1 className="mt-[2.5rem] text-2xl font-bold">Road map</h1>
        <div className="mt-5 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 min-h-[156px]">
          {data?.roadmaps && data.roadmaps.length > 0 ? (
            data.roadmaps.map((roadmap) => (
              <Card className="card border-none px-6 py-4" key={roadmap.skill}>
                <div className="flex items-center gap-3">
                  {skillMapping[roadmap.skill as keyof typeof skillMapping]}
                  <p className="text-lg font-bold text-[#E72929]">
                    {upperFirst(roadmap.skill)}
                  </p>
                </div>
                <div>{roadmap.content}</div>
              </Card>
            ))
          ) : (
            <p className="py-4 text-sm text-gray-500">Đang cập nhật</p>
          )}
        </div>
      </div>
    </div>
  );
}
