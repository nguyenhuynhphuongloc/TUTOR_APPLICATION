"use client";

import { SESSION_FEEDBACK_OPTIONS } from "@/constants";
import type { User } from "@/payload-types";
import { useFormFields, usePayloadAPI } from "@payloadcms/ui";
import { useMemo, useState } from "react";
import type { FeedbackRecord } from "./feedback.types";
import { mapFeedbackValueToLabel } from "./feedback.utils";

export function StudentFeedbackClassView({ classId }: { classId: string }) {
  const [selectedStudentId, setSelectedStudentId] = useState<string>("");
  const [selectedSession, setSelectedSession] = useState<string>("");

  /* ===== Lấy Feedback từ Form Context (Reactive) ===== */
  const studentReviewField = useFormFields(
    ([fields]) => fields.student_review_session,
  );
  const studentReviewValue =
    (studentReviewField?.value as Record<string, any>) || {};
  /* ===== FETCH STUDENTS (Cần thiết vì docData có thể chỉ chứa Ids) ===== */
  const [{ data: classData, isLoading: loadingClass }] = usePayloadAPI(
    `/api/classes/${classId}`,
    {
      initialParams: {
        select: {
          students: {
            id: true,
            lead: { fullName: true },
          },
        },
      },
    },
  );

  const students: User[] = classData?.students ?? [];

  /* ===== Chuyển đổi Data thành mảng Records giả lập để tái sử dụng logic lọc ===== */
  const feedbackRecords: FeedbackRecord[] = useMemo(() => {
    return [
      {
        id: "current-form-data",
        class: classId,
        student_review_session: studentReviewValue,
        createdAt: new Date().toISOString(),
      } as FeedbackRecord,
    ];
  }, [studentReviewValue, classId]);

  /* ===== Lấy danh sách session có feedback ===== */
  const availableSessions = useMemo(() => {
    const sessionSet = new Set<number>();
    feedbackRecords.forEach((fb) => {
      const studentMap = fb.student_review_session || {};

      Object.values(studentMap).forEach((sessionMapOrData: any) => {
        if (!sessionMapOrData) return;

        // Định dạng cũ: session lồng trực tiếp trong studentId
        if (typeof sessionMapOrData.session === "number") {
          sessionSet.add(sessionMapOrData.session);
        } else {
          // Định dạng mới: studentId -> sessionKey -> data
          Object.values(sessionMapOrData).forEach((data: any) => {
            if (data?.session != null) {
              sessionSet.add(Number(data.session));
            }
          });
        }
      });
    });
    return Array.from(sessionSet).sort((a, b) => a - b);
  }, [feedbackRecords]);

  /* ===== Lọc feedback theo student + session ===== */
  const filteredFeedbacks = useMemo(() => {
    const results: { fb: FeedbackRecord; studentId: string; data: any }[] = [];

    feedbackRecords.forEach((fb) => {
      const studentMap = fb.student_review_session || {};

      Object.entries(studentMap).forEach(
        ([studentId, sessionMapOrData]: [string, any]) => {
          if (!sessionMapOrData) return;

          const matchStudent =
            !selectedStudentId || studentId === selectedStudentId;

          // Format Cũ: data trực tiếp dưới studentId
          if (typeof sessionMapOrData.session === "number") {
            const matchSession =
              !selectedSession ||
              String(sessionMapOrData.session) === selectedSession;
            if (matchStudent && matchSession) {
              results.push({ fb, studentId, data: sessionMapOrData });
            }
          }
          // Format Mới: studentId -> [sessionKey] -> data
          else {
            Object.entries(sessionMapOrData).forEach(
              ([sessionKey, data]: [string, any]) => {
                // Chúng ta so khớp session dựa trên sessionKey (được đặt trong actions.ts) hoặc data.session
                const currentSession =
                  data?.session != null
                    ? String(data.session)
                    : String(sessionKey);
                const matchSession =
                  !selectedSession || currentSession === selectedSession;

                if (matchStudent && matchSession) {
                  results.push({ fb, studentId, data });
                }
              },
            );
          }
        },
      );
    });

    return results;
  }, [feedbackRecords, selectedStudentId, selectedSession]);

  /* ===== Tìm tên học viên ===== */
  const getStudentNameById = (studentId: string) => {
    const found = students.find((s) => s.id === studentId);
    if (found?.lead && typeof found.lead === "object") {
      return found.lead.fullName ?? "Không rõ";
    }
    return "Không rõ";
  };

  if (loadingClass) {
    return <p className="p-4">Đang tải dữ liệu...</p>;
  }

  return (
    <div className="mt-6 border border-slate-200 rounded-md overflow-hidden">
      <div className="bg-blue-950 px-4 py-3 text-lg font-bold text-white">
        Đánh giá buổi học của học viên
      </div>

      {/* ===== FILTERS ===== */}
      <div className="flex flex-wrap gap-4 px-4 py-4 border-b bg-slate-50">
        {/* Select học viên */}
        <div className="flex flex-col gap-1 min-w-[250px]">
          <label className="text-sm font-semibold text-slate-600">
            Học viên
          </label>
          <select
            value={selectedStudentId}
            onChange={(e) => setSelectedStudentId(e.target.value)}
            className="px-3 py-2 border rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Tất cả học viên</option>
            {students.map((s) => {
              const studentName =
                s.lead && typeof s.lead === "object" ? s.lead.fullName : s.id;
              return (
                <option key={s.id} value={s.id}>
                  {studentName}
                </option>
              );
            })}
          </select>
        </div>

        {/* Select buổi học */}
        <div className="flex flex-col gap-1 min-w-[180px]">
          <label className="text-sm font-semibold text-slate-600">
            Buổi học
          </label>
          <select
            value={selectedSession}
            onChange={(e) => setSelectedSession(e.target.value)}
            className="px-3 py-2 border rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Tất cả buổi</option>
            {availableSessions.map((s) => (
              <option key={s} value={String(s)}>
                Buổi {s}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-end">
          <span className="text-sm text-slate-500">
            Tìm thấy <b className="text-red-700">{filteredFeedbacks.length}</b>{" "}
            đánh giá
          </span>
        </div>
      </div>

      {/* ===== FEEDBACK LIST ===== */}
      {filteredFeedbacks.length === 0 ? (
        <p className="p-4 text-slate-500">
          Không có đánh giá nào phù hợp. Hãy chọn học viên và buổi học.
        </p>
      ) : (
        <div className="divide-y">
          {filteredFeedbacks.map((item, idx) => {
            const { fb, studentId, data: fd } = item;
            return (
              <div
                key={`${fb.id}-${studentId}-${idx}`}
                className="p-4 space-y-2"
              >
                {/* Header */}
                <div className="flex items-center justify-between mb-3 border-b pb-2">
                  <h3 className="text-base font-bold text-slate-800">
                    {getStudentNameById(studentId)} — Buổi {fd.session ?? "N/A"}
                  </h3>
                  <span className="text-sm text-slate-400 font-mono">
                    {fb.createdAt
                      ? new Date(fb.createdAt).toLocaleDateString("vi-VN", {
                          day: "2-digit",
                          month: "2-digit",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })
                      : ""}
                  </span>
                </div>

                {/* Render All Feedback Fields */}
                <div className="space-y-1">
                  {/* Cố định thứ tự hiển thị: Overall Score -> Các câu hỏi -> Target */}

                  {/* 1. Overall Score */}
                  {fd.overall_score && (
                    <div className="flex flex-col gap-1 py-2 border-b border-slate-100">
                      <span className="font-semibold text-slate-700">
                        Overall Score của tiết học hôm nay:
                      </span>
                      <span className="text-slate-900 font-bold text-lg">
                        {fd.overall_score} / 5
                      </span>
                    </div>
                  )}

                  {/* 2. Các field trong SESSION_FEEDBACK_OPTIONS */}
                  {SESSION_FEEDBACK_OPTIONS.map((opt) => {
                    const val = fd[opt.name];
                    if (val == null || val === "") return null;
                    const displayValue = mapFeedbackValueToLabel(
                      opt.name,
                      String(val),
                    );
                    return (
                      <div
                        key={opt.name}
                        className="flex flex-col gap-1 py-2 border-b border-slate-100"
                      >
                        <span className="font-semibold text-slate-700 leading-snug">
                          {opt.title}:
                        </span>
                        <div className="pl-4 py-1 bg-slate-50/50 rounded-r-md border-l-4 border-blue-500/30">
                          <span className="text-slate-900 whitespace-pre-wrap">
                            {displayValue}
                          </span>
                        </div>
                      </div>
                    );
                  })}

                  {/* 3. Target */}
                  {fd.target && (
                    <div className="flex flex-col gap-1 py-2 border-b border-slate-100">
                      <span className="font-semibold text-slate-700">
                        Target:
                      </span>
                      <span className="text-slate-900 font-bold">
                        {fd.target}
                      </span>
                    </div>
                  )}

                  {/* 4. Hiển thị bất kỳ field nào khác còn lại (Dành cho extension sau này) */}
                  {Object.keys(fd).map((key) => {
                    if (
                      ["overall_score", "target", "session"].includes(key) ||
                      SESSION_FEEDBACK_OPTIONS.some((o) => o.name === key)
                    ) {
                      return null;
                    }
                    return (
                      <div
                        key={key}
                        className="flex flex-col gap-1 py-1 border-b border-slate-100 italic text-slate-500"
                      >
                        <span className="font-medium">{key}:</span>
                        <span>{String(fd[key])}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
