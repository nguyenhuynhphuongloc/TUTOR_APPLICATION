import { useAuth } from "@/app/(app)/_providers/Auth";
import { getLastPastIndexPlusOne } from "@/lib/utils";
import { Class, PeriodicTestAttempt } from "@/payload-types";
import { useQuery } from "@tanstack/react-query";
import { get } from "lodash-es";
import { stringify } from "qs-esm";
import { useEffect, useMemo, useState } from "react";

export const useExerciseData = () => {
  const { user } = useAuth();
  const [classes, setClasses] = useState<Class>();
  const [tab, setTab] = useState("homework");
  const [session, setSession] = useState<number>(1);
  const [homeworkAttempts, setHomeworkAttempts] = useState<
    PeriodicTestAttempt[]
  >([]);
  const [attendanceData, setAttendanceData] = useState<any>(null);

  const [isHomeworkLoading, setIsHomeworkLoading] = useState(false);
  const [isAttendanceLoading, setIsAttendanceLoading] = useState(false);

  const stringifiedQuery = useMemo(
    () =>
      stringify(
        { where: { students: { in: user?.id }, limit: 0 } },
        { addQueryPrefix: true },
      ),
    [user?.id],
  );

  const { data: classData, isLoading: isClassLoading } = useQuery<Class[]>({
    queryKey: ["getClassSession", user?.id],
    queryFn: () =>
      fetch(`/api/classes${stringifiedQuery}`)
        .then((res) => res.json())
        .then((res) => res.docs),
    enabled: !!user?.id,
    refetchOnMount: "always",
  });

  useEffect(() => {
    if (classData?.[0] && !classes) {
      setClasses(classData[0]);
    }
  }, [classData, classes]);

  useEffect(() => {
    const fetchHomeworkByClasses = async () => {
      if (!classes || !user) {
        setHomeworkAttempts([]);
        return;
      }
      setHomeworkAttempts([]); // Clear previous data before fetching new
      setIsHomeworkLoading(true);
      try {
        const midtermIds = (classes.sessions || [])
          .flatMap((session) => (session as any).mid_test ?? [])
          .map((mt: any) => mt.id);

        const finalTermIds = (classes.sessions || [])
          .flatMap((session) => (session as any).final_test ?? [])
          .map((ft: any) => ft.id);

        const homeworkIds = (classes.sessions || [])
          .flatMap((session) => session.homework ?? [])
          .map((hw: any) => hw.id);

        const extraHomeworkIds = (classes.sessions || [])
          .flatMap((session) => session.extra_homework ?? [])
          .map((ehw: any) => ehw.id);

        const allIds = [
          ...new Set([
            ...homeworkIds,
            ...midtermIds,
            ...finalTermIds,
            ...extraHomeworkIds,
          ]),
        ];

        if (allIds.length === 0) {
          setHomeworkAttempts([]);
          return;
        }

        const stringifiedQuery = stringify(
          {
            where: {
              user: { equals: user?.id },
              class: { equals: classes.id },
              test: { in: allIds },
              type: {
                in: ["homework", "extra_homework", "mid_term", "final_term"],
              },
            },
            limit: 0,
            depth: 3,
            select: {
              completedAt: true,
              status: true,
              test: true,
              id: true,
              score: true,
              type: true,
              class: true,
              session: true,
            },
          },
          { addQueryPrefix: true },
        );
        const response = await fetch(
          `/api/periodic_test_attempts${stringifiedQuery}`,
        );
        const homeworks = (await response.json()) as {
          docs: PeriodicTestAttempt[];
        };
        setHomeworkAttempts(homeworks.docs || []);
      } finally {
        setIsHomeworkLoading(false);
      }
    };
    fetchHomeworkByClasses();
  }, [classes, user]);

  useEffect(() => {
    const fetchAttendance = async () => {
      if (!classes || !user) {
        setAttendanceData(null);
        return;
      }
      setAttendanceData(null); // Clear previous data before fetching new
      setIsAttendanceLoading(true);
      try {
        const stringifiedQuery = stringify(
          {
            where: {
              class: { equals: classes.id },
            },
          },
          { addQueryPrefix: true },
        );
        const response = await fetch(
          `/api/attendanceRecords${stringifiedQuery}`,
        );
        const data = await response.json();
        if (data.docs && data.docs.length > 0) {
          setAttendanceData(data.docs[0].AttendanceRecord_data || {});
        } else {
          setAttendanceData({}); // Set to empty object instead of null to signify "loaded but empty"
        }
      } finally {
        setIsAttendanceLoading(false);
      }
    };
    fetchAttendance();
  }, [classes, user]);

  const isLoading = isClassLoading || isHomeworkLoading || isAttendanceLoading;

  const learnedSession = useMemo(
    () => getLastPastIndexPlusOne((classes?.sessions as any) || []),
    [classes?.sessions],
  );

  useEffect(() => {
    if (learnedSession) {
      setSession(learnedSession);
    }
  }, [learnedSession]);

  const sessionInfo = classes ? get(classes, `sessions[${session - 1}]`) : null;
  const exercises = useMemo(() => {
    if (!sessionInfo) return [];
    switch (tab) {
      case "homework":
        return sessionInfo.homework || [];
      case "extra_homework":
        return sessionInfo.extra_homework || [];
      case "mid_term":
        return (sessionInfo as any).mid_test || [];
      case "final_term":
        return (sessionInfo as any).final_test || [];
      default:
        return [];
    }
  }, [tab, sessionInfo]);

  const deadline = useMemo(() => {
    if (!sessionInfo?.date || !classes?.time_per_session) return new Date();
    // Using date-fns or similar is better, but following original logic
    const d = new Date(sessionInfo.date);
    d.setHours(d.getHours() + classes.time_per_session);
    d.setDate(d.getDate() + 5);
    return d;
  }, [sessionInfo, classes]);

  const classProgressInfo = useMemo(() => {
    if (!classes) return [];

    const maxHomework =
      classes.sessions
        ?.map((i) => i.homework?.length || 0)
        .reduce((a, b) => a + b, 0) || 0;
    const maxExtraHomework =
      classes.sessions
        ?.map((i) => i.extra_homework?.length || 0)
        .reduce((a, b) => a + b, 0) || 0;

    return [
      {
        name: "Course progress",
        sub: "Tiến độ khóa học",
        value: learnedSession || 0,
        max: classes.sessions?.length || 0,
      },
      {
        name: "Attendance",
        sub: "Điểm danh",
        value: attendanceData
          ? Object.values(attendanceData).filter(
              (session: any) =>
                session[user?.id as string]?.status === "on_time" ||
                session[user?.id as string]?.status === "late",
            ).length
          : 0,
        max: classes.sessions?.length || 0,
      },
      {
        name: "Homework",
        sub: "Bài tập về nhà",
        value: homeworkAttempts.filter(
          (i) => i.status === "completed" && i.type === "homework",
        ).length,
        max: maxHomework,
      },
      {
        name: "Extra Practice",
        sub: "Bài tập bổ trợ",
        value: homeworkAttempts.filter(
          (i) => i.status === "completed" && i.type === "extra_homework",
        ).length,
        max: maxExtraHomework,
      },
    ];
  }, [classes, learnedSession, homeworkAttempts, attendanceData, user?.id]);

  return {
    user,
    classData,
    classes,
    isLoading,
    tab,
    session,
    homeworkAttempts,
    learnedSession,
    sessionInfo,
    exercises,
    deadline,
    classProgressInfo,
    attendanceData,
    setClasses,
    setTab,
    setSession,
  };
};
