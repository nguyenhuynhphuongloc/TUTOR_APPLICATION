"use client";
import { User } from "@/payload-types";
import { useForm, useFormFields, usePayloadAPI } from "@payloadcms/ui";
import { useEffect, useMemo, useState } from "react";

/** ================= CARE STEP ================= */
const CARE_STEP = [
  {
    id: 1,
    title: "Chờ khai giảng",
    fields: [
      { key: "friendParent", label: "Kết bạn với phụ huynh" },
      { key: "friendStudent", label: "Kết bạn học sinh" },
    ],
  },
  {
    id: 2,
    title: " Trước khai giảng",
    fields: [{ key: "shipBook", label: "Đã gửi sách" }],
  },
  {
    id: 3,
    title: "Tuần 1",
    fields: [
      { key: "askedStudent", label: "Đã hỏi thăm học viên" },
      { key: "studentSatisfied", label: "Học viên đã hài lòng" },
    ],
  },
  {
    id: 4,
    title: "Tuần 3",
    fields: [
      { key: "teacherReviewed", label: "Giáo viên đã gửi đánh giá" },
      { key: "sentToParent", label: "Học vụ đã gửi đánh giá cho phụ huynh" },
      { key: "sentToStudent", label: "Học vụ đã gửi đánh giá cho học viên" },
      { key: "askedReferral", label: "Đã xin referral từ phụ huynh" },
    ],
  },
  {
    id: 5,
    title: " Giữa kì",
    fields: [
      { key: "remindParent", label: "Học vụ đã nhắc phụ huynh" },
      { key: "studentDoneAll", label: "Học viên đã làm đủ bài" },
      { key: "remindTeacher", label: "Học vụ đã nhắc giáo viên" },
      { key: "sentMidScore", label: "Học vụ đã gửi điểm" },
      { key: "bookWowMid", label: "Học viên đã book WOW" },
    ],
  },
  {
    id: 6,
    title: "Tuần 8",
    fields: [
      { key: "sentSecondReview", label: "Gửi đánh giá lần 2" },
      { key: "warningBooking", label: "Cảnh báo book Wow <40%" },
    ],
  },
  {
    id: 7,
    title: "Cuối kì",
    fields: [
      { key: "bookWowFinal", label: "Học viên đã book WOW" },
      { key: "doneWriting", label: "Học viên đã làm writing" },
      { key: "remindParentFinal", label: "Học vụ đã nhắc phụ huynh" },
      { key: "showFinalScore", label: "Xem điểm" },
    ],
  },
];

export default function CareUI() {

  const careField = useFormFields(([fields]) => fields.care_data);

  const careValue = careField?.value ?? {};

  const classField = useFormFields(([fields]) => fields.class_ref);

  const classValue = classField?.value;

  const classId = classValue;

  const { dispatchFields, setModified } = useForm();

  const [{ data, isLoading }] = usePayloadAPI(
    classValue ? `/api/classes/${classValue}` : "",
    {
      initialParams: {
        select: {
          name: true,
          course: true,
          students: {
            id: true,
            lead: { fullName: true },
          },
        },
      },
    },
  );

  const [{ data: feedbackRes, isLoading: isLoadingFeedback }] = usePayloadAPI(
    classValue
      ? `/api/feedback?where[class][equals]=${classValue}&limit=100&depth=0`
      : "",
    {
      initialParams: {
        select: {
          id: true,
          feedback_data: true,
        },
      },
    },
  );

  const feedbackDocs = feedbackRes?.docs ?? [];

  const mergedFeedbackData = useMemo(() => {
    return (feedbackDocs as any[]).reduce<Record<string, any>>((acc: Record<string, any>, fb: any) => {
      const fd = fb?.feedback_data ?? {};

      Object.keys(fd).forEach((studentId) => {
        const s = fd?.[studentId] ?? {};

        const w3 = Array.isArray(s.week3) ? s.week3 : [];
        const w8 = Array.isArray(s.week8) ? s.week8 : [];

        acc[studentId] = acc[studentId] ?? {};

        acc[studentId].week3 = [...(acc[studentId].week3 ?? []), ...w3];

        acc[studentId].week8 = [...(acc[studentId].week8 ?? []), ...w8];
      });

      return acc;
    }, {});
  }, [feedbackDocs]);

  const hasStudentFeedback = (studentId: string, phase: "week3" | "week8") => {
    const arr = mergedFeedbackData?.[studentId]?.[phase];
    return Array.isArray(arr) && arr.length > 0;
  };

  const className = data?.name;

  const courseId =
    typeof data?.course === "string"
      ? data.course
      : (data?.course as any)?.id || (data?.course as any)?.value || "";

  const [{ data: courseDoc }] = usePayloadAPI(
    courseId ? `/api/courses/${courseId}?depth=0` : "",
    {
      initialParams: {
        select: {
          id: true,
          courseName: true,
        },
      },
    },
  );

  const courseName = courseDoc?.courseName ?? "";

  const getPhaseByStep = (stepId: number): "week3" | "week8" =>
    stepId === 4 ? "week3" : "week8";

  const getStudentNameFromRow = (student: User) => {
    const lead = student?.lead;
    return (lead && typeof lead === "object" ? lead.fullName : "") || "Chưa có tên";
  };

  const feedbackUIUrl = (student: User, stepId: number) => {
    const phase = getPhaseByStep(stepId); // "week3" | "week8"
    const studentName = getStudentNameFromRow(student);

    const params = new URLSearchParams({
      student: student.id,
      class: String(className ?? ""),
      classId: String(classId ?? ""),
      phase,
      studentName,
      courseName: String(courseName ?? ""),
    });

    return `http://localhost:3000/feedbackUI?${params.toString()}`;
  };

  const students: User[] = data?.students ?? [];

  console.log("students",students)

  /* ================= SEARCH + PAGINATION ================= */
  const [search, setSearch] = useState("");

  const [page, setPage] = useState(1);

  const PAGE_SIZE = 19;

  const filteredStudents = useMemo(() => {
    return students.filter((s) => {
      const lead = s.lead;
      const fullName = (lead && typeof lead === "object" ? lead.fullName : "") || "";
      return fullName.toLowerCase().includes(search.toLowerCase());
    });
  }, [students, search]);

  const paginatedStudents = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return filteredStudents.slice(start, start + PAGE_SIZE);
  }, [filteredStudents, page]);

  useEffect(() => {
    setPage(1);
  }, [search]);

  if (isLoading) return <p className="p-4 text-slate-500">Đang tải...</p>;

  if (!students.length)
    return <p className="p-4 text-slate-500">Không có học viên</p>;


  const toggleStep = (
    checked: boolean,
    studentId: string,
    stepId: number,
    field: string,
  ) => {
    const cv = careValue as any;
    dispatchFields({
      type: "UPDATE",
      path: "care_data",
      value: {
        ...cv,
        [studentId]: {
          ...(cv?.[studentId] ?? {}),
          [stepId]: {
            ...(cv?.[studentId]?.[stepId] ?? {}),
            [field]: checked,
          },
        },
      },
    });
    setModified(true);
  };

  return (
    <div className="relative w-full border border-slate-300 bg-white mt-4">
      <div className="">
        {/* SEARCH BAR */}
        <div className="flex items-center justify-between ">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Tìm học viên..."
            className="
    w-8/12 px-2 py-2 text-2sm border border-black
    outline-none
    focus:outline-none
    focus:border-black
    mt-9
  "
          />

          <div className="text-2xl text-slate-600 mt-7">
            Tổng: <b className="text-red-700">{students.length}</b> học viên
          </div>
        </div>

        {/* TABLE */}
        <table className="w-full border-collapse border border-slate-400 text-left mt-20 ">
          <thead>
            <tr>
              <th className="sticky left-0 z-[2] bg-slate-100 border px-4 py-4 text-xs font-bold uppercase min-w-[220px] text-black">
                Học viên
              </th>

              {CARE_STEP.map((step) => (
                <th
                  key={step.id}
                  className={`border left-0 px-6 py-3 text-[12px] font-bold uppercase ${step.id === 5 || step.id === 7
                    ? "bg-slate-100 text-red-600"
                    : "bg-slate-100"
                    }`}
                >
                  {step.title}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {paginatedStudents.map((student, rowIndex) => {
              const isEvenRow = rowIndex % 2 === 0;

              const studentCare = (careValue as any)?.[student.id] ?? {};

              return (
                <tr key={student.id} className="hover:bg-slate-50">
                  <td
                    className={`sticky left-0 z-[1] border px-4 py-3 ${isEvenRow ? "bg-white" : "bg-slate-100"
                      }`}
                  >
                    <div className="font-bold">
                      {(student.lead && typeof student.lead === "object" ? student.lead.fullName : "") || "Chưa có tên"}
                    </div>
                    <div className="text-[10px] text-slate-400 font-mono">
                      ID: {student.id.slice(-6)}
                    </div>
                  </td>

                  {CARE_STEP.map((step) => (
                    <td
                      key={step.id}
                      className={`border px-3 py-3 align-top ${isEvenRow ? "bg-white" : "bg-slate-100"
                        }`}
                    >
                      <div className="flex flex-col gap-1">
                        {/* CHECKLIST */}
                        {step.fields.map((field) => {
                          const isChecked =
                            !!studentCare?.[step.id]?.[field.key];

                          return (
                            <label
                              key={field.key}
                              className={`flex items-start gap-2 rounded px-2 py-1 text-[11px] cursor-pointer transition
            ${isChecked ? "bg-blue-50 text-blue-700" : "hover:bg-slate-200"}`}
                            >
                              <input
                                type="checkbox"
                                className="mt-[2px]"
                                checked={isChecked}
                                onChange={(e) =>
                                  toggleStep(
                                    e.target.checked,
                                    student.id,
                                    step.id,
                                    field.key,
                                  )
                                }
                              />
                              <span className="leading-snug">
                                {field.label}
                              </span>
                            </label>
                          );
                        })}

                        {/* FEEDBACK – TUẦN 3 & 8 */}
                        {(step.id === 4 || step.id === 6) &&
                          (() => {
                            const phase = step.id === 4 ? "week3" : "week8";

                            const existed = hasStudentFeedback(
                              student.id,
                              phase,
                            );

                            return (
                              <div className="mt-2 rounded-md border border-red-200  p-2">
                                {existed ? (
                                  <a
                                    href={feedbackUIUrl(student, step.id)}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="inline-flex items-center justify-center rounded-md bg-red-500 px-3 py-1 text-[11px] font-semibold text-white hover:bg-red-600"
                                  >
                                    Xem đánh giá
                                  </a>
                                ) : (
                                  <span className="text-[11px] font-semibold text-red-700">
                                    Chưa có đánh giá
                                  </span>
                                )}
                              </div>
                            );
                          })()}
                      </div>
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
