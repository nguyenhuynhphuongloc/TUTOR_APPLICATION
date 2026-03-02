"use client";

import { Textarea } from "@/components/ui/textarea";
import type { User } from "@/payload-types";
import { useAuth, useForm, useFormFields, usePayloadAPI } from "@payloadcms/ui";
import Image from "next/image";
import { useMemo, useState } from "react";
import { StudentFeedbackClassView } from "./StudentFeedbackClassView";
import type {
  FeedbackByWeek,
  FeedbackComment,
  FeedbackFormState,
  FeedbackWeek,
} from "./feedback.types";

export default function FeedbackUI() {
  const { dispatchFields, setModified } = useForm();
  const [activeTab, setActiveTab] = useState<"teacher" | "student">("teacher");

  const classField = useFormFields(([fields]) => fields.class);
  const classId = classField?.value as string | undefined;

  const feedbackField = useFormFields(([fields]) => fields.feedback_data);
  const feedbackValue = useMemo<Record<string, FeedbackByWeek>>(() => {
    return (feedbackField?.value as Record<string, FeedbackByWeek>) ?? {};
  }, [feedbackField?.value]);

  const [currentWeek, setCurrentWeek] = useState<FeedbackWeek>("week8");
  const { user } = useAuth();

  const currentTeacherId = (user as any)?.id as string | undefined;

  const hasMyFeedback = (studentId: string, week: FeedbackWeek) => {
    if (!currentTeacherId) return false;
    const arr: FeedbackComment[] = feedbackValue?.[studentId]?.[week] ?? [];
    return arr.some(
      (c) => console.log(c.teacherId) ?? c.teacherId == currentTeacherId,
    );
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  /* ===== FETCH STUDENTS ===== */
  const [{ data, isLoading }] = usePayloadAPI(
    (classId ? `/api/classes/${classId}` : null) as any,
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

  const students: User[] = data?.students ?? [];

  /* ===== SEARCH ===== */
  const [search, setSearch] = useState("");

  const filteredStudents = useMemo(() => {
    return students.filter((s) => {
      const fullName =
        s.lead && typeof s.lead === "object" ? s.lead.fullName : "";
      return (fullName || "").toLowerCase().includes(search.toLowerCase());
    });
  }, [students, search]);

  /* ===== MODAL ===== */
  const [open, setOpen] = useState(false);
  const [currentStudent, setCurrentStudent] = useState<User | null>(null);
  const emptyForm: FeedbackFormState = { comment: "" };
  const [form, setForm] = useState<FeedbackFormState>(emptyForm);

  /* ===== OPEN MODAL ===== */
  const openModal = (student: User, week: FeedbackWeek) => {
    setCurrentStudent(student);
    setCurrentWeek(week);
    const teacherId = (user as any)?.id as string | undefined;
    const comments: FeedbackComment[] = feedbackValue[student.id]?.[week] ?? [];
    const mine = comments.find((c) => c.teacherId === teacherId);
    setForm({ comment: mine?.comment ?? "" });
    setOpen(true);
  };

  /* ===== CLOSE MODAL ===== */
  const closeModal = () => {
    setOpen(false);
    setCurrentStudent(null);
    setForm(emptyForm);
  };

  /* ===== SAVE (UPSERT BY teacherId) ===== */
  const handleSaveFeedback = () => {
    if (!currentStudent) return;

    const studentId = currentStudent.id;
    const teacherId = (user as any)?.id as string | undefined;
    const comment = form.comment.trim();

    if (!comment) {
      closeModal();
      return;
    }
    const weekComments: FeedbackComment[] =
      feedbackValue[studentId]?.[currentWeek] ?? [];

    const newItem: FeedbackComment = {
      studentId,
      teacherId,
      createdAt: new Date().toISOString(),
      comment,
    };
    const nextWeekComments = (() => {
      if (!teacherId) return [...weekComments, newItem];

      const idx = weekComments.findIndex((c) => c.teacherId === teacherId);
      if (idx >= 0) {
        const copy = [...weekComments];
        copy[idx] = { ...copy[idx], ...newItem };
        return copy;
      }
      return [...weekComments, newItem];
    })();

    dispatchFields({
      type: "UPDATE",
      path: "feedback_data",
      value: {
        ...feedbackValue,
        [studentId]: {
          ...(feedbackValue[studentId] || {}),
          [currentWeek]: nextWeekComments,
        },
      },
    });
    setModified(true);
    closeModal();
  };

  /* ===== STATES ===== */
  if (!classId) {
    return <p className="p-4 text-orange-600">Vui lòng chọn lớp học...</p>;
  }

  const commentsThisWeek: FeedbackComment[] = currentStudent
    ? (feedbackValue[currentStudent.id]?.[currentWeek] ?? [])
    : [];

  return (
    <div className="space-y-4">
      {/* TABS NAVIGATION */}
      <div className="flex border-b border-slate-200">
        <button
          type="button"
          onClick={() => setActiveTab("teacher")}
          className={`px-6 py-3 font-semibold transition-all border-b-2 cursor-pointer ${
            activeTab === "teacher"
              ? "border-blue-600 text-blue-600 bg-blue-50/30"
              : "border-transparent text-slate-500 hover:text-slate-700 hover:bg-slate-50"
          }`}
        >
          Giáo viên nhận xét
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("student")}
          className={`px-6 py-3 font-semibold transition-all border-b-2 cursor-pointer ${
            activeTab === "student"
              ? "border-blue-600 text-blue-600 bg-blue-50/30"
              : "border-transparent text-slate-500 hover:text-slate-700 hover:bg-slate-50"
          }`}
        >
          Học viên đánh giá
        </button>
      </div>

      {activeTab === "student" ? (
        <StudentFeedbackClassView classId={classId} />
      ) : (
        <div className="border border-slate-200 rounded-md overflow-hidden">
          <div className="bg-blue-950 px-4 py-3 text-lg font-bold text-white">
            Danh sách đánh giá học viên
          </div>

          <div className="flex justify-between px-2 py-4 border-b bg-slate-50">
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Tìm tên học viên..."
              className="w-8/12 px-5 py-3 border rounded-md focus:outline-none focus:ring-0"
            />
            <div className="text-2xl py-2">
              Tổng: <b className="text-red-700">{students.length}</b> học viên
            </div>
          </div>

          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-slate-200">
                <th className="border px-5 py-3 text-left">Tên học viên</th>
                <th className="border px-5 py-3 text-left">Tuần 3</th>
                <th className="border px-5 py-3 text-left">Tuần 8</th>
              </tr>
            </thead>
            <tbody>
              {filteredStudents.map((student, index) => {
                const isEven = index % 2 === 0;

                // boolean: giáo viên hiện tại đã đánh giá chưa
                const myWeek3 = hasMyFeedback(student.id, "week3");

                const myWeek8 = hasMyFeedback(student.id, "week8");

                return (
                  <tr
                    key={student.id}
                    className={isEven ? "bg-white" : "bg-slate-50"}
                  >
                    <td className="border px-4 py-3">
                      <b>
                        {student.lead && typeof student.lead === "object"
                          ? student.lead.fullName
                          : ""}
                      </b>
                    </td>

                    {/* TUẦN 3 */}
                    <td className="border px-5 py-3">
                      <span
                        onClick={() => openModal(student, "week3")}
                        className={`cursor-pointer font-bold p-1 ${
                          myWeek3
                            ? "text-blue-500 hover:underline"
                            : "bg-blue-500 text-white"
                        }`}
                      >
                        {myWeek3 ? (
                          <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-green-100 text-green-700">
                            ✓
                          </span>
                        ) : (
                          "Đánh giá"
                        )}
                      </span>
                    </td>

                    {/* TUẦN 8 */}
                    <td className="border px-4 py-3">
                      <span
                        onClick={() => openModal(student, "week8")}
                        className={`cursor-pointer font-bold p-1 ${
                          myWeek8
                            ? "text-red-500 hover:underline"
                            : "bg-red-500 text-white"
                        }`}
                      >
                        {myWeek8 ? (
                          <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-green-100 text-green-700">
                            ✓
                          </span>
                        ) : (
                          "Đánh giá"
                        )}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* ===== MODAL ===== */}
      {open && currentStudent && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 rounded-2xl">
          <div
            className="max-w-6xl w-[95%] h-[85vh] rounded-2xl mt-4 shadow-lg overflow-hidden relative bg-cover bg-center bg-no-repeat"
            style={{
              backgroundImage:
                "url('https://images.unsplash.com/photo-1478553644883-93d39578635b?q=80&w=2670&auto=format&fit=crop')",
              backgroundColor: "white",
            }}
          >
            <div className="absolute inset-0 bg-white/80 z-0"></div>

            <div className="relative z-10 w-full h-full p-6 overflow-y-auto scroll-me-12">
              <Image
                src="/logo.svg"
                alt="TUTORS"
                width={120}
                height={40}
                className="object-contain"
                unoptimized
              />

              <div className="flex items-centen justify-between mt-2 ">
                <h2 className="text-xl mb-4 ">
                  Học viên:{" "}
                  <span className="text-red-700">
                    {currentStudent.lead &&
                    typeof currentStudent.lead === "object"
                      ? currentStudent.lead.fullName
                      : ""}
                  </span>
                </h2>

                <h2 className="text-xl mb-4 ml-80">
                  Giáo viên:{" "}
                  <span className="text-red-700">{user?.fullName}</span>
                </h2>
              </div>

              <div className="mb-4">
                <label className="block mb-1 font-semibold text-slate-700 text-xl">
                  Nhận xét
                </label>

                <Textarea
                  className="border-black h-40 "
                  placeholder="Nhập nhận xét..."
                  value={form.comment}
                  onChange={(e) => setForm({ comment: e.target.value })}
                />
              </div>

              <div className="mt-6">
                {commentsThisWeek.length === 0 ? (
                  <p className="text-slate-600">Chưa có nhận xét.</p>
                ) : (
                  <div className="space-y-3">
                    {commentsThisWeek
                      .slice()
                      .sort((a, b) =>
                        (b.createdAt ?? "").localeCompare(a.createdAt ?? ""),
                      )
                      .map((c, i) => (
                        <div
                          key={i}
                          className=" rounded-lg bg-white/80 border border-1"
                        >
                          <div className="text-xl text-slate-600">
                            <b>{c.teacherName ?? "Giáo viên"}</b>{" "}
                            {c.createdAt
                              ? `- ${formatDate(new Date(c.createdAt))}`
                              : ""}
                          </div>

                          <div className="mt-2 whitespace-pre-wrap border border-slate-400 rounded-xl px-3 py-2 bg-slate-200 ">
                            {c.comment}
                          </div>
                        </div>
                      ))}
                  </div>
                )}
              </div>

              <div className="flex justify-end gap-3 mt-4">
                <button
                  onClick={closeModal}
                  className="bg-black text-white px-10 py-2 rounded-lg hover:bg-gray-800 active:bg-gray-900 transition-colors font-medium cursor-pointer border-0"
                >
                  Thoát
                </button>

                <button
                  onClick={handleSaveFeedback}
                  className="bg-red-700 text-white px-10 py-2 rounded-lg hover:bg-red-800 active:bg-red-800 transition-colors font-medium cursor-pointer border-0"
                >
                  Lưu
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
