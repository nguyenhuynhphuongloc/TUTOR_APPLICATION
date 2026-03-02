"use client";

import { usePayloadAPI } from "@payloadcms/ui";
import { motion } from "framer-motion";
import Image from "next/image";
import { useMemo, useState } from "react";
import { FiBookOpen, FiSearch } from "react-icons/fi";

/* ================= VIOLATIONS ================= */
const VIOLATIONS = [
  { key: "no_camera", label: "Không mở cam" },
  { key: "absent_without_permission", label: "Vắng không phép" },
  { key: "absent_with_permission", label: "Vắng có phép" },
  { key: "late_homework", label: "Không làm bài tập về nhà" },
] as const;

type ViolationKey = (typeof VIOLATIONS)[number]["key"];

type ViolationSummaryRow = {
  className: string;
  studentName: string;
  totalViolations: number;
  details: Record<ViolationKey, number>;
  studentId?: string;
  violationStatus?: string;
  studentEmail?: string;
};

export default function AllClassesViolationSummaryUI() {
  const [search, setSearch] = useState("");

  const [selectedStudents, setSelectedStudents] = useState<string[]>([]);

  const [{ data, isLoading }] = usePayloadAPI("/api/attendanceRecords", {
    initialParams: {
      limit: 200,
      depth: 12,
      locale: "vi",
    },
  });

  const attendanceRecords = data?.docs ?? [];

  // Reset selection when data refreshes
  useMemo(() => {
    setSelectedStudents([]);
  }, [data]);

  const allViolationsSummary = useMemo(() => {
    const summary: ViolationSummaryRow[] = [];
    attendanceRecords.forEach((record: any) => {
      const className = record.class?.name ?? "Lớp chưa đặt tên";
      const students = record.class?.students ?? [];
      const violationData = record.ViolationRecord_data ?? {};

      students.forEach((student: any) => {
        const studentId = student.id;
        const studentName =
          student?.lead?.fullName ||
          student?.fullName ||
          `Học viên (${studentId?.slice(0, 6)})`;

        // Add studentId and violationStatus
        const row: ViolationSummaryRow = {
          className,
          studentName,
          totalViolations: 0,
          details: Object.fromEntries(
            VIOLATIONS.map((v) => [v.key, 0]),
          ) as Record<ViolationKey, number>,
          studentId,
          violationStatus: student.violationStatus,
          studentEmail: student.email,
        };

        Object.values(violationData).forEach((session: any) => {
          const studentViolations = session?.students?.[studentId];
          if (!studentViolations) return;
          VIOLATIONS.forEach((v) => {
            if (studentViolations[v.key]) {
              row.totalViolations++;
              row.details[v.key]++;
            }
          });
        });
        summary.push(row);
      });
    });
    return summary;
  }, [attendanceRecords]);

  const filteredSummary = useMemo(() => {
    const q = search.toLowerCase();
    return allViolationsSummary.filter(
      (r) =>
        r.studentName.toLowerCase().includes(q) ||
        r.className.toLowerCase().includes(q),
    );
  }, [search, allViolationsSummary]);

  const validStudentIds = useMemo(() => {
    return filteredSummary
      .map((r) => r.studentId)
      .filter((id): id is string => !!id);
  }, [filteredSummary]);

  const selectedEmails = useMemo(() => {
    return filteredSummary
      .filter((r) => selectedStudents.includes(r.studentId || ""))
      .map((r) => r.studentEmail)
      .filter((email): email is string => !!email);
  }, [selectedStudents, filteredSummary]);

  const isAllSelected =
    validStudentIds.length > 0 &&
    selectedStudents.length === validStudentIds.length;

  const toggleSelectAll = () => {
    if (isAllSelected) {
      setSelectedStudents([]);
    } else {
      setSelectedStudents(validStudentIds);
    }
  };

  const toggleStudent = (id: string) => {
    if (!id) return;
    if (selectedStudents.includes(id)) {
      setSelectedStudents((prev) => prev.filter((s) => s !== id));
    } else {
      setSelectedStudents((prev) => [...prev, id]);
    }
  };

  if (isLoading)
    return (
      <div className="p-10 text-center text-slate-500">Đang tải dữ liệu...</div>
    );

  return (
    <div className="p-3 min-h-screen bg-slate-50">
      <div className="p-4 rounded-2xl shadow-sm border mb-4 flex justify-between items-center bg-white overflow-hidden">
        <h1 className="text-4xl font-black text-red-600">
          Hủy cam kết học viên
        </h1>

        <motion.div
          animate={{ x: ["100%", "-450%"] }}
          transition={{ duration: 5, repeat: 0 }}
        >
          <Image
            src="/hoc_vu.png"
            alt="Logo"
            width={140}
            height={30}
            priority
          />
        </motion.div>
      </div>

      <div className="flex  items-center justify-between mb-4 gap-4">
        <div className="relative flex-1 max-w-[500px] group">
          <FiSearch
            className="absolute left-4 top-1/3 -translate-y-1/2 text-slate-400 
                   group-focus-within:text-red-500 transition-colors"
          />

          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Tìm học viên hoặc lớp..."
            className="w-full pl-11 pr-4 py-2.5 border border-slate-200 rounded-xl outline-none 
                    
                   text-sm transition-all bg-white"
          />
        </div>

        <div className="flex gap-3">
          <div className="bg-red-600 px-4 py-2 rounded-xl text-white text-sm font-bold shadow">
            Tổng học sinh: {filteredSummary.length}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        <table className="w-full text-xs sm:text-sm border-collapse">
          <thead className="">
            <tr className="bg-red-600 text-white">
              <th className="py-2 px-3 text-left font-medium border-r border-red-500">
                Lớp
              </th>
              <th className="py-2 px-3 text-left font-medium border-r border-red-500">
                Học viên
              </th>

              {VIOLATIONS.map((v) => (
                <th
                  key={v.key}
                  className="py-2 px-2 text-center font-medium border-r border-red-500 last:border-r-0"
                >
                  {v.label}
                </th>
              ))}

              <th className="py-2 px-3 text-center font-medium border-r border-red-500">
                Tổng lỗi
              </th>
            </tr>
          </thead>

          <tbody className="divide-y">
            {filteredSummary.map((row, i) => (
              <tr
                key={i}
                className={`transition-colors cursor-pointer hover:bg-red-50 ${selectedStudents.includes(row.studentId || "") ? "bg-red-50" : ""}`}
              >
                <td className="py-1.5 px-3 whitespace-nowrap border-r">
                  <FiBookOpen className="inline mr-1.5 text-red-700 text-xl" />
                  {row.className}
                </td>

                <td className="py-1.5 px-3 font-semibold border-r whitespace-nowrap">
                  {row.studentName}
                </td>

                {VIOLATIONS.map((v) => (
                  <td
                    key={v.key}
                    className="py-1.5 px-2 text-center border-r last:border-r-0"
                  >
                    {row.details[v.key] || "0"}
                  </td>
                ))}
                <td className="py-1.5 px-3 text-center font-bold text-red-600 border-r">
                  {row.totalViolations}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredSummary.length === 0 && (
          <div className="p-6 text-center text-slate-400 italic">
            Không có dữ liệu phù hợp
          </div>
        )}
      </div>
    </div>
  );
}
