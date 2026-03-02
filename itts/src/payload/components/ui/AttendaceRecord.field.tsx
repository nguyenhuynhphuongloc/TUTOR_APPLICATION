"use client";

import SelectDownDrop from "@/payload/components/ui/SelectDropDown";
import { useForm, useFormFields, usePayloadAPI } from "@payloadcms/ui";
import { useEffect, useMemo, useState } from "react";
import { FiSearch } from "react-icons/fi";
/* eslint-disable
  @typescript-eslint/no-unsafe-assignment,
  @typescript-eslint/no-unsafe-member-access
*/

type Student = {
  id: string;
  lead?: {
    fullName?: string;
    telephone?: string;
    email?: string;
  };
};

type Session = {
  id: string;
  date?: string;
  students?: Student[];
};

const ATTENDANCE_STATUS = [
  { key: "absent", label: "Vắng" },
  { key: "leave", label: "Xin nghỉ" },
  { key: "late", label: "Muộn" },
  { key: "on_time", label: "Đúng giờ" },
] as const;

type AttendanceStatus = (typeof ATTENDANCE_STATUS)[number]["key"];

type AttendanceRecordValue = {
  [sessionId: string]: {
    [studentId: string]: {
      status: AttendanceStatus;
    };
  };
};

const VIOLATIONS = [
  { key: "no_camera", label: "Không mở cam" },
  { key: "absent_without_permission", label: "Vắng không phép" },
  { key: "absent_with_permission", label: "Vắng có phép" },
  { key: "late_homework", label: "Không làm bài tập về nhà" },
] as const;

type AttendanceTab = "attendance" | "summary" | "evaluation";

export default function AttendanceRecordFieldUI() {
  const [activeTab, setActiveTab] = useState<AttendanceTab>("attendance");

  /* ================= FORM ================= */
  const { dispatchFields, setModified } = useForm();
  const classId = useFormFields(
    ([fields]) => fields.class?.value as string | undefined,
  );

  const attendanceField = useFormFields(
    ([fields]) => fields.AttendanceRecord_data,
  );

  const attendanceValue: AttendanceRecordValue =
    (attendanceField?.value as AttendanceRecordValue) ?? {};

  const violationField = useFormFields(
    ([fields]) => fields.ViolationRecord_data,
  );

  const violationValue = (violationField?.value as any) ?? {};

  console.log({ attendanceValue });

  /* ================= FETCH CLASS ================= */
  const [{ data, isLoading }] = usePayloadAPI(
    classId ? `/api/classes/${classId}` : "",
    {
      initialParams: {
        depth: 2,
        locale: "vi",
        select: {
          students: {
            id: true,
            lead: {
              fullName: true,
              telephone: true,
              email: true,
            },
          },
          sessions: {
            id: true,
            date: true,
            students: {
              id: true,
              lead: { fullName: true },
            },
          },
        },
      },
    },
  );

  console.log(data);

  const students: Student[] = data?.students ?? [];

  const sessions: Session[] = data?.sessions ?? [];

  const markAll = (status: AttendanceStatus) => {
    const updated = { ...(attendanceValue[selectedSessionId] ?? {}) };

    filteredStudents.forEach((s) => {
      updated[s.id] = { status };
    });

    dispatchFields({
      type: "UPDATE",
      path: "AttendanceRecord_data",
      value: {
        ...attendanceValue,
        [selectedSessionId]: updated,
      },
    });
  };

  const toggleViolation = (studentId: string, violationKey: string) => {
    if (!selectedSessionId) return;

    const session = sessions.find((s) => s.id === selectedSessionId);

    const currentSession = violationValue[selectedSessionId] ?? {
      date: session?.date,
      students: {},
    };

    const studentViolations = currentSession.students?.[studentId] ?? {};

    dispatchFields({
      type: "UPDATE",
      path: "ViolationRecord_data",
      value: {
        ...violationValue,
        [selectedSessionId]: {
          date: currentSession.date,
          students: {
            ...currentSession.students,
            [studentId]: {
              ...studentViolations,
              [violationKey]: !studentViolations[violationKey],
            },
          },
        },
      },
    });

    setModified(true);
  };

  /* ================= SEARCH + PAGINATION ================= */
  const [search, setSearch] = useState("");

  const [page, setPage] = useState(1);

  const [statusFilter, setStatusFilter] = useState<AttendanceStatus | "all">(
    "all",
  );

  /* ================= SESSION ================= */
  const [selectedSessionId, setSelectedSessionId] = useState<string>("");

  const filteredStudents = useMemo(() => {
    return students.filter((student) => {
      const fullName = student.lead?.fullName ?? "";
      const matchSearch = fullName.toLowerCase().includes(search.toLowerCase());

      if (!selectedSessionId || statusFilter === "all") {
        return matchSearch;
      }

      const status = attendanceValue?.[selectedSessionId]?.[student.id]?.status;

      return matchSearch && status === statusFilter;
    });
  }, [students, search, statusFilter, selectedSessionId, attendanceValue]);

  const attendanceSummary = useMemo(() => {
    const result: Record<
      string,
      {
        fullName: string;
        absent: number;
        leave: number;
        late: number;
        on_time: number;
      }
    > = {};

    students.forEach((student) => {
      result[student.id] = {
        fullName: student.lead?.fullName ?? "Chưa có tên",
        absent: 0,
        leave: 0,
        late: 0,
        on_time: 0,
      };
    });

    sessions.forEach((session) => {
      const sessionData = attendanceValue?.[session.id];
      if (!sessionData) return;

      Object.entries(sessionData).forEach(([studentId, record]) => {
        if (result[studentId]) {
          result[studentId][record.status]++;
        }
      });
    });

    return Object.values(result);
  }, [students, sessions, attendanceValue]);

  useEffect(() => {
    setPage(1);
  }, [search]);

  /* ================= ENSURE SESSION KEY EXISTS ================= */
  useEffect(() => {
    if (!selectedSessionId) return;

    if (!attendanceValue[selectedSessionId]) {
      dispatchFields({
        type: "UPDATE",
        path: "AttendanceRecord_data",
        value: {
          ...attendanceValue,
          [selectedSessionId]: {},
        },
      });
      setModified(true);
    }
  }, [selectedSessionId]);

  const sessionOptions = useMemo(() => {
    return sessions.map((s, index) => ({
      label: s.date
        ? `Buổi ${index + 1} - ${new Date(s.date).toLocaleDateString("vi-VN")}`
        : `Buổi ${index + 1}`,
      value: s.id,
    }));
  }, [sessions]);

  const statusOptions = useMemo(() => {
    return [
      { label: "Tất cả trạng thái", value: "all" },
      ...ATTENDANCE_STATUS.map((s) => ({
        label: s.label,
        value: s.key,
      })),
    ];
  }, []);

  /* ================= HANDLER ================= */
  const setAttendance = (studentId: string, status: AttendanceStatus) => {
    if (!selectedSessionId) return;

    dispatchFields({
      type: "UPDATE",
      path: "AttendanceRecord_data",
      value: {
        ...attendanceValue,
        [selectedSessionId]: {
          ...(attendanceValue[selectedSessionId] ?? {}),
          [studentId]: { status },
        },
      },
    });

    setModified(true);
  };

  /* ================= RENDER ================= */
  return (
    <div className="border border-slate-300">
      <div className="flex items-center bg-white" />

      <div className="mb-4 flex gap-3 justify-between">
        <div className="flex gap-4">
          <button
            type="button"
            onClick={() => setActiveTab("attendance")}
            className={`
              px-4 py-2 rounded-lg text-sm font-semibold border-none cursor-pointer
              ${activeTab === "attendance"
                ? "bg-red-600 text-white"
                : "bg-slate-200 text-slate-700 hover:bg-slate-300"
              }
            `}
          >
            Điểm danh
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("summary")}
            className={`
              px-4 py-2 rounded-lg text-sm font-semibold border-none cursor-pointer
              ${activeTab === "summary"
                ? "bg-blue-600 text-white"
                : "bg-slate-200 text-slate-700 hover:bg-slate-300"
              }
            `}
          >
            Thống kê
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("evaluation")}
            className={`
              px-4 py-2 rounded-lg text-sm font-semibold border-none cursor-pointer
              ${activeTab === "evaluation"
                ? "bg-orange-500 text-white"
                : "bg-slate-200 text-slate-700 hover:bg-slate-300"
              }
            `}
          >
            Đánh giá lỗi vi phạm
          </button>
        </div>

        <div className="text-2xl text-black mr-4">
          Tổng học sinh:{" "}
          <span className="font-semibold text-red-700">
            {students.length}
          </span>
        </div>
      </div>

      {activeTab === "attendance" && (
        <div>
          <div className="mb-5 flex items-center justify-between gap-4">
            <div className="flex items-center gap-5">
              <div className=" w-[500px] flex items-center relative">
                <FiSearch className="absolute left-3 -translate-y-1/2 text-gray-500 text-base" />
                <input
                  type="text"
                  name="search"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Họ tên..."
                  className="w-[1600px] h-[29px] pl-9 text-black bg-white text-sm border border-gray-400 box-border focus:outline-none appearance-none"
                />
              </div>

              <div className="ml-8 flex gap-4">
                <SelectDownDrop
                  options={statusOptions}
                  value={statusFilter}
                  placeholder="Lọc trạng thái"
                  onChange={(option) =>
                    setStatusFilter(option.value as AttendanceStatus | "all")
                  }
                />
                <SelectDownDrop
                  options={sessionOptions}
                  value={selectedSessionId}
                  placeholder="Chọn buổi học"
                  onChange={(option) => setSelectedSessionId(option.value)}
                />
              </div>
            </div>
          </div>

          <table className="w-full border-collapse border border-slate-400 text-sm">
            <thead>
              <tr className="bg-red-600 text-white">
                <th className="border px-5 py-2">
                  <span className="bg-white text-red-600 p-1">Họ tên</span>
                </th>
                {ATTENDANCE_STATUS.map((s) => (
                  <th key={s.key} className="border px-3 py-2 text-center text-xl">
                    <div className="flex items-center justify-center gap-1">
                      <span
                        onClick={() => markAll(s.key)}
                        className="text-sm px-1 py-1 font-bold bg-white text-red-600 hover:bg-red-100 rounded-lg cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                      >
                        {s.label}
                      </span>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredStudents.map((student) => {
                const currentStatus = attendanceValue?.[selectedSessionId]?.[student.id]?.status;
                return (
                  <tr key={student.id} className="odd:bg-slate-50 even:bg-slate-50 transiton hover:bg-red-50">
                    <td className="border px-3 py-2 font-semibold">
                      {student.lead?.fullName ?? "Chưa có tên"}
                    </td>
                    {ATTENDANCE_STATUS.map((s) => (
                      <td key={s.key} className="border px-3 py-2 text-center">
                        <input
                          type="radio"
                          name={`attendance-${selectedSessionId}-${student.id}`}
                          disabled={!selectedSessionId}
                          checked={currentStatus === s.key}
                          onChange={() => setAttendance(student.id, s.key)}
                        />
                      </td>
                    ))}
                  </tr>
                );
              })}
            </tbody>
          </table>
          <div className="flex justify-end">
            <button
              disabled={!selectedSessionId}
              className="px-4 py-1 bg-red-700 text-white disabled:opacity-50 mt-5 border-none cursor-pointer"
            >
              Lưu
            </button>
          </div>
        </div>
      )}

      {activeTab === "evaluation" && (
        <div className="overflow-x-auto">
          <div className="w-600px flex items-center gap-7 mb-4">
            <div className=" w-[500px] flex items-center relative">
              <FiSearch className="absolute left-3 -translate-y-1/2 text-gray-500 text-base" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Họ tên..."
                className="w-[1600px] h-[29px] pl-9 text-black bg-white text-sm border border-gray-400"
              />
            </div>
            <SelectDownDrop
              options={sessionOptions}
              value={selectedSessionId}
              placeholder="Chọn buổi học"
              onChange={(option: any) => setSelectedSessionId(option.value)}
            />
          </div>

          <table className="w-full border-collapse border border-slate-400 text-sm">
            <thead>
              <tr className="bg-orange-500 text-white">
                <th className="border px-4 py-3 text-left">Học sinh</th>
                {VIOLATIONS.map((v) => (
                  <th key={v.key} className="border px-2 py-3 text-center">
                    {v.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredStudents.map((student) => {
                const sessionViolations = violationValue[selectedSessionId]?.students?.[student.id] ?? {};
                return (
                  <tr key={student.id} className="hover:bg-orange-50">
                    <td className="border px-4 py-2 font-medium">
                      {student.lead?.fullName}
                    </td>
                    {VIOLATIONS.map((v) => (
                      <td key={v.key} className="border px-2 py-2 text-center">
                        <input
                          type="checkbox"
                          className="w-4 h-4 cursor-pointer accent-orange-600"
                          disabled={!selectedSessionId}
                          checked={!!sessionViolations[v.key]}
                          onChange={() => toggleViolation(student.id, v.key)}
                        />
                      </td>
                    ))}
                  </tr>
                );
              })}
            </tbody>
          </table>

          <div className="flex justify-end">
            <button
              disabled={!selectedSessionId}
              className="px-4 py-1 bg-orange-500 text-white disabled:opacity-50 mt-5 border-none cursor-pointer"
            >
              Lưu
            </button>
          </div>
        </div>
      )}

      {activeTab === "summary" && (
        <>
          <h3 className="mt-12 mb-4 text-4xl font-semibold text-slate-900">
            Thống kê điểm danh
          </h3>
          <table className="w-full border border-slate-400 border-collapse">
            <thead>
              <tr className="bg-blue-900 text-white text-xl">
                <th>Họ tên</th>
                <th>Vắng</th>
                <th>Xin nghỉ</th>
                <th>Đi trễ</th>
              </tr>
            </thead>
            <tbody>
              {attendanceSummary.map((s, i) => (
                <tr key={i} className="hover:bg-blue-50">
                  <td className="font-semibold text-blue-950">{s.fullName}</td>
                  <td className="text-center text-blue-950 font-semibold p-2">
                    {s.absent}
                  </td>
                  <td className="text-center text-blue-950 font-semibold">
                    {s.leave}
                  </td>
                  <td className="text-center text-blue-950 font-semibold">
                    {s.late}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
    </div>
  );
}
