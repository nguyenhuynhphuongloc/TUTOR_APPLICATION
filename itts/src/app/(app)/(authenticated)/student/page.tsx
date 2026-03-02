/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-floating-promises */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
"use client";

import CardDashboard from "@/components/card/card-dashboard";
import PageLoading from "@/components/PageLoading";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";

import { useAuth } from "@/app/(app)/_providers/Auth";
import EmblaCarousel from "@/components/carousel/Carousel";
import ProfileModal from "@/components/modal/ProfileModal";
import { Button } from "@/components/ui/button";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { LEAD_TYPE, SKILLS_OPTIONS } from "@/constants";
import { createLookupMap } from "@/lib/utils";
import type {
  BookingSchedule,
  Class,
  Course,
  Lead,
  PeriodicTestAttempt,
} from "@/payload-types";
import { useQuery } from "@tanstack/react-query";
import { format, isAfter } from "date-fns";
import type { EmblaOptionsType } from "embla-carousel";
import isEmpty from "lodash-es/isEmpty";
import { Facebook, ShieldCheck } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { stringify } from "qs-esm";
import { Fragment, useMemo, useState } from "react";

const chartConfig = {
  score: {
    label: "Score",
    color: "#E72929",
  },
} satisfies ChartConfig;

const OPTIONS: EmblaOptionsType = { align: "start" };

export default function Home() {
  const { user } = useAuth();
  const router = useRouter();

  const [testTypeFilter, setTestTypeFilter] = useState("homework");
  const [skillFilter, setSkillFilter] = useState("reading");

  // Fetch classes
  const classesQuery = useMemo(
    () =>
      stringify(
        {
          where: {
            students: { contains: user?.id },
          },
          depth: 2,
          limit: 0,
        },
        { addQueryPrefix: true },
      ),
    [user?.id],
  );

  const { data: classesData, isLoading: isLoadingClasses } = useQuery<{
    docs: Class[];
  }>({
    queryKey: ["classes", user?.id],
    queryFn: () =>
      fetch(`/api/classes${classesQuery}`).then((res) => res.json()),
    enabled: !!user?.id,
  });

  // Fetch WOW bookings
  const bookingsQuery = useMemo(
    () =>
      stringify(
        {
          where: {
            student: { equals: user?.id },
            status: { equals: "accepted" },
          },
          limit: 0,
        },
        { addQueryPrefix: true },
      ),
    [user?.id],
  );

  const { data: bookingsData, isLoading: isLoadingBookings } = useQuery<{
    docs: BookingSchedule[];
  }>({
    queryKey: ["booking_schedule", user?.id],
    queryFn: () =>
      fetch(`/api/booking_schedule${bookingsQuery}`).then((res) => res.json()),
    enabled: !!user?.id,
  });

  // Fetch Test Attempts for chart
  const attemptsQuery = useMemo(
    () =>
      stringify(
        {
          where: {
            user: { equals: user?.id },
            status: { equals: "completed" },
          },
          depth: 3,
          sort: "completedAt",
          limit: 0,
        },
        { addQueryPrefix: true },
      ),
    [user?.id],
  );

  const { data: attemptsData, isLoading: isLoadingAttempts } = useQuery<{
    docs: PeriodicTestAttempt[];
  }>({
    queryKey: ["periodic_test_attempts", user?.id],
    queryFn: () =>
      fetch(`/api/periodic_test_attempts${attemptsQuery}`).then((res) =>
        res.json(),
      ),
    enabled: !!user?.id,
  });

  const { nextClass, nextTest } = useMemo(() => {
    if (!classesData || !classesData.docs)
      return { nextClass: null, nextTest: null };

    const now = new Date();
    let earliestClass: { date: Date; link_zoom?: string | null } | null = null;
    let earliestTest: { date: Date } | null = null;

    classesData.docs.forEach((cls) => {
      cls.sessions?.forEach((session) => {
        const sessionDate = new Date(session.date);
        if (isAfter(sessionDate, now)) {
          // Next Class
          if (!earliestClass || isAfter(earliestClass.date, sessionDate)) {
            earliestClass = { date: sessionDate, link_zoom: cls.link_zoom };
          }

          // Next Test (Homework)
          if (
            !isEmpty(session.homework) &&
            (!earliestTest || isAfter(earliestTest.date, sessionDate))
          ) {
            earliestTest = { date: sessionDate };
          }
        }
      });
    });

    return {
      nextClass: earliestClass as {
        date: Date;
        link_zoom?: string | null;
      } | null,
      nextTest: earliestTest as { date: Date } | null,
    };
  }, [classesData]);

  const nextWow = useMemo(() => {
    if (!bookingsData?.docs || bookingsData.docs.length === 0) return null;
    const now = new Date();
    const upcoming = bookingsData.docs
      .filter((b) => b.date_time && isAfter(new Date(b.date_time), now))
      .sort(
        (a, b) =>
          (new Date(a.date_time) as any) - (new Date(b.date_time) as any),
      );
    return upcoming[0] || null;
  }, [bookingsData]);

  const currentClass = useMemo(() => {
    if (!classesData?.docs || classesData.docs.length === 0) return null;
    return (
      classesData.docs.find((c) => c.status_class === "active") ||
      classesData.docs[0]
    );
  }, [classesData]);

  const homeworkIds = useMemo(() => {
    if (!currentClass || !currentClass.sessions) return [];
    const ids: string[] = [];
    currentClass.sessions.forEach((session: any) => {
      const allTests = [
        ...(session.homework || []),
        ...(session.extra_homework || []),
        ...(session.mini_test || []),
        ...(session.mid_test || []),
        ...(session.final_test || []),
      ];

      allTests.forEach((t: any) => {
        const testId = typeof t === "string" ? t : t?.id;
        if (testId) ids.push(testId);
      });
    });
    return Array.from(new Set(ids));
  }, [currentClass]);

  const chartData = useMemo(() => {
    if (!attemptsData?.docs || attemptsData.docs.length === 0) return [];

    const filtered = attemptsData.docs
      .filter((attempt) => {
        if (!attempt.completedAt || !attempt.score || !attempt.test)
          return false;

        // Filter by test type (homework, extra_homework, etc.)
        if (attempt.type !== testTypeFilter) return false;

        // Filter by current class homework
        const testId =
          typeof attempt.test === "string"
            ? attempt.test
            : (attempt.test as any).id;
        if (!homeworkIds.includes(testId)) return false;

        // Filter by skill (reading, listening, etc.)
        const periodicTest = attempt.test as any;
        if (!periodicTest || !periodicTest.tests) return false;

        const normalizedSkill =
          skillFilter === "vocabulary" ? "vocab" : skillFilter;

        return periodicTest.tests.some((t: any) => {
          const type = typeof t === "string" ? t : t.type;
          return type === normalizedSkill;
        });
      })
      .map((attempt) => {
        const scoreVal = (attempt.score as any)?.score || "0";
        return {
          date: format(new Date(attempt.completedAt as string), "dd/MM"),
          score: parseFloat(scoreVal) || 0,
          rawDate: new Date(attempt.completedAt as string),
        };
      });

    // Sort by date descending to get the most recent, take 10, then reverse back for chart
    return filtered
      .sort((a, b) => b.rawDate.getTime() - a.rawDate.getTime())
      .slice(0, 10)
      .reverse();
  }, [attemptsData, testTypeFilter, skillFilter, homeworkIds]);

  const cardItems = useMemo(() => {
    const items = [
      {
        id: "next-class",
        text: "Lớp học sắp diễn ra",
        time: nextClass
          ? format(nextClass.date, "dd/MM - HH'h'mm")
          : "Không có lịch",
        icon: "/teach.svg",
        bgColor: "#3FAFC60D",
        btnColor: "#3FAFC6",
        btnText: "Vào học",
        showButton: !!nextClass && !!nextClass.link_zoom,
        onClick: () => {
          if (nextClass?.link_zoom) {
            window.open(nextClass.link_zoom, "_blank");
          }
        },
      },
      {
        id: "next-test",
        text: "Bài test sắp diễn ra",
        time: nextTest
          ? format(nextTest.date, "dd/MM - HH'h'mm")
          : "Không có lịch",
        icon: "/document-test.svg",
        bgColor: "#FD44440D",
        btnColor: "#FD4444",
        btnText: "Làm bài",
        showButton: !!nextTest,
        onClick: () => router.push("/student/exercise"),
      },
      {
        id: "next-wow",
        text: "WOW sắp diễn ra",
        time:
          nextWow && nextWow.date_time
            ? format(new Date(nextWow.date_time), "dd/MM - HH'h'mm")
            : "Bạn chưa có lịch book WOW",
        icon: "/people.svg",
        bgColor: "#FBA6310D",
        btnColor: "#FBA631",
        btnText: "Vào học",
        showButton: !!nextWow && !!nextWow.link_zoom,
        onClick: () => {
          if (nextWow?.link_zoom) {
            window.open(nextWow.link_zoom, "_blank");
          }
        },
      },
    ];

    return items;
  }, [nextClass, nextTest, nextWow, router]);

  const TYPE_MAP = createLookupMap(LEAD_TYPE);
  const lead = (user?.lead ?? {}) as Lead;
  const { email, fullName, phone, link_facebook, target, type } = lead;

  const sidebarItems = [
    {
      title: "Facebook",
      value: link_facebook,
      icon: <Facebook stroke="#0866FF" />,
      bgColor: "#0866FF26",
    },
    {
      title: "Số điện thoại",
      value: phone,
      icon: (
        <Image
          src="/home/call-calling.svg"
          alt="phone"
          width={20}
          height={20}
        />
      ),
      bgColor: "#23BD3326",
    },
    {
      title: "Email",
      value: email,
      icon: (
        <Image
          src="/home/sms-notification.svg"
          alt="email"
          width={20}
          height={20}
        />
      ),
      bgColor: "#FBA63126",
    },
    {
      title: "Điểm đầu vào",
      value: "4.0",
      icon: (
        <Image src="/home/import.svg" alt="import" width={20} height={20} />
      ),
      bgColor: "#FD444426",
    },
    {
      title: "Cam kết đầu ra",
      value: "7.0",
      icon: (
        <Image src="/home/export.svg" alt="export" width={20} height={20} />
      ),
      bgColor: "#23BD3326",
    },
  ];
  const onClick = () => {
    return {};
  };

  const handleClickItem = (id: string) => {
    router.push(`/student/course-detail/${id}`);
  };

  if (isLoadingClasses || isLoadingBookings || isLoadingAttempts || !user) {
    return <PageLoading />;
  }

  const courses = classesData?.docs?.map((c) => c.course).filter(Boolean) || [];

  return (
    <div className="w-[calc(100%-19.1875rem)]">
      <div className="fixed right-0 top-0 h-screen w-64 w-[19.1875rem] bg-white shadow-md">
        <div className="p-6">
          <div className="flex items-center justify-between pb-6">
            <h1 className="text-2xl font-semibold">Profile</h1>
            <ProfileModal>
              <Button
                variant="outline"
                size="icon"
                className="[&_svg]:size-5 w-11 h-11 rounded-[12px]"
              >
                <Image src="/edit.svg" alt="edit" width={20} height={20} />
              </Button>
            </ProfileModal>
          </div>
          <div className="flex flex-col items-center gap-1">
            <Image
              src="/people.svg"
              alt="avatar"
              width={100}
              height={100}
              className="rounded-full border border-gray-300"
            />
            <div className="flex items-center gap-1">
              <h5 className="text-lg font-semibold">{fullName}</h5>
              <ShieldCheck fill="#3DA864" stroke="#fff" />
            </div>

            <p className="text-sm text-muted-foreground">
              {TYPE_MAP.get(type as string)}
            </p>
          </div>
        </div>
        <div className="flex w-full items-center px-6">
          <div className="h-[1px] flex-grow bg-gray-300"></div>
          <div className="mx-4 text-red-500">
            <svg
              viewBox="0 0 24 24"
              className="h-2.5 w-2.5"
              fill="currentColor"
            >
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
            </svg>
          </div>
          <div className="h-[1px] flex-grow bg-gray-300"></div>
        </div>
        <div className="p-6">
          {sidebarItems.map((item) => {
            return (
              <div
                key={item.title}
                className="mb-4 inline-flex w-full items-center gap-3"
              >
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-[0.625rem]`}
                  style={{ backgroundColor: item.bgColor }}
                >
                  {item.icon}
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-semibold text-gray-900">
                    {item.title}
                  </span>
                  <span className="text-xs text-gray-600">
                    {item.value ?? "Không có dữ liệu"}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {!isEmpty(classesData?.docs) ? (
        <Fragment>
          <div>
            <div className="flex justify-between gap-6">
              {cardItems.map((props) => (
                <CardDashboard key={props.id} {...props} />
              ))}
            </div>
          </div>

          <div className="mt-[2.5rem]">
            <Card className="w-full border-none">
              <CardHeader>
                <CardTitle className="flex justify-between text-lg">
                  <p>Biểu đồ tăng trưởng điểm số</p>
                  <div className="flex items-center gap-[0.75rem]">
                    <Select
                      value={testTypeFilter}
                      onValueChange={setTestTypeFilter}
                    >
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Chọn loại bài" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="homework">BTVN</SelectItem>
                        <SelectItem value="extra_homework">BTBT</SelectItem>
                      </SelectContent>
                    </Select>
                    <Select value={skillFilter} onValueChange={setSkillFilter}>
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Chọn kĩ năng" />
                      </SelectTrigger>
                      <SelectContent>
                        {SKILLS_OPTIONS.map((skill) => (
                          <SelectItem key={skill.value} value={skill.value}>
                            {skill.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent className="ml-[-20px] h-[12.5rem] pl-0">
                {chartData.length > 0 ? (
                  <ChartContainer
                    config={chartConfig}
                    className="max-h-[210px] w-full"
                  >
                    <AreaChart
                      accessibilityLayer
                      data={chartData}
                      margin={{ left: 12, right: 12 }}
                    >
                      <CartesianGrid vertical={false} />
                      <XAxis
                        dataKey="date"
                        tickLine={false}
                        tickMargin={10}
                        axisLine={false}
                      />
                      <YAxis tickLine={false} axisLine={false} />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Area
                        dataKey="score"
                        type="linear"
                        fill="var(--color-score)"
                        fillOpacity={0.2}
                        stroke="var(--color-score)"
                        strokeWidth={2}
                      />
                    </AreaChart>
                  </ChartContainer>
                ) : (
                  <div className="flex h-full items-center justify-center text-sm text-gray-400">
                    Không có dữ liệu điểm số cho bài tập này.
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </Fragment>
      ) : (
        <div className="relative h-[17.5rem] w-full rounded-2xl bg-white">
          <div className="absolute inset-0 z-[0] rounded-[16px] bg-gradient-to-r from-[#FFD1D1]/20 to-[#E72929]/20"></div>

          <div className="absolute z-[1] h-full w-[60%] px-6 pt-12 pt-9">
            <p className="text-lg font-bold text-[#E72929]">
              Chào mừng bạn đến với hành trình tri thức!
            </p>
            <p className="mt-2 text-sm text-[#6D737A]">
              Chúng tôi rất vui được đồng hành cùng bạn trong khóa học này. Hãy
              sẵn sàng khám phá những kiến thức mới, rèn luyện kỹ năng và mở ra
              những cơ hội tuyệt vời cho tương lai! 🚀
            </p>
            <Button className="absolute bottom-9 mt-6" size="xl">
              Xem khóa học
            </Button>
          </div>

          <div>
            <Image
              src="/home-image.svg"
              alt="rocket"
              width={320}
              height={280}
              className="absolute bottom-0 right-0 z-[2]"
            />
          </div>
        </div>
      )}

      {!isEmpty(classesData?.docs) && (
        <div className="pb-5">
          <EmblaCarousel
            title="Khóa Học Đang Sở Hữu"
            slides={courses as Course[]}
            options={OPTIONS}
            onClickItem={handleClickItem}
          />
        </div>
      )}
    </div>
  );
}
