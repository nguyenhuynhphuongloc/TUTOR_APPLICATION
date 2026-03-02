"use client";

import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";

type Phase = "week3" | "week8";

type FeedbackComment = {
  studentId?: string;
  studentName?: string;
  teacherId?: string;
  teacherName?: string;
  createdAt?: string;
  comment?: string;
};

interface FeedbackHeaderData {
  studentName: string;
  studentId: string;
  className: string;
  courseName: string;
}

export default function FeedbackForm() {
  const searchParams = useSearchParams();

  const studentId = searchParams.get("student") ?? "";

  const classId = searchParams.get("classId") ?? "";

  const phase = (searchParams.get("phase") as Phase) || "week3";

  const classNameParam = searchParams.get("class") ?? "";

  const courseNameParam = searchParams.get("courseName") ?? "";

  const studentNameParam = searchParams.get("studentName") ?? "";

  const [loading, setLoading] = useState(true);

  const [header, setHeader] = useState<FeedbackHeaderData | null>(null);

  const [comments, setComments] = useState<FeedbackComment[]>([]);

  const [error, setError] = useState<string | null>(null);

  const pdfRef = useRef<HTMLDivElement>(null);

  const formatDateDDMMYYYY = (iso?: string) => {
    if (!iso) return "";

    const d = new Date(iso);

    if (Number.isNaN(d.getTime())) return "";

    const dd = String(d.getDate()).padStart(2, "0");

    const mm = String(d.getMonth() + 1).padStart(2, "0");

    const yyyy = d.getFullYear();

    return `${dd}-${mm}-${yyyy}`;
  };

  const handleDownloadPDF = async () => {
    const element = pdfRef.current;
    if (!element) return;

    try {
      // Đợi ảnh load xong
      const imgs = Array.from(element.querySelectorAll("img"));

      await Promise.all(
        imgs.map((img) =>
          img.complete
            ? Promise.resolve()
            : new Promise<void>((res) => {
                img.onload = () => res();
                img.onerror = () => res();
              }),
        ),
      );

      // scale = 1 để KHÔNG phóng to
      const canvas = await html2canvas(element, {
        scale: 1,
        useCORS: true,
        backgroundColor: "#ffffff",
        logging: false,
        scrollX: 0,
        scrollY: -window.scrollY,
        windowWidth: element.offsetWidth,
        windowHeight: element.offsetHeight,
      });

      const imgData = canvas.toDataURL("image/png");

      const pdf = new jsPDF({
        orientation: "landscape",
        unit: "mm",
        format: "a4",
      });

      // Quy đổi PX → MM (96dpi)
      const pxToMm = (px: number) => (px * 25.4) / 120;

      const imgWidthMm = pxToMm(canvas.width);

      const imgHeightMm = pxToMm(canvas.height);

      const pageWidth = pdf.internal.pageSize.getWidth();

      const pageHeight = pdf.internal.pageSize.getHeight();

      const x = (pageWidth - imgWidthMm) / 2;

      let y = 0;

      let heightLeft = imgHeightMm;

      pdf.addImage(imgData, "PNG", x, y, imgWidthMm, imgHeightMm);
      heightLeft -= pageHeight;

      while (heightLeft > 0) {
        y -= pageHeight;
        pdf.addPage();
        pdf.addImage(imgData, "PNG", x, y, imgWidthMm, imgHeightMm);
        heightLeft -= pageHeight;
      }

      const safeName = (header?.studentName ?? "feedback").replaceAll(" ", "_");
      pdf.save(`${safeName}_${phase}.pdf`);
    } catch (err) {
      console.error(err);
      alert("Không thể xuất PDF. Vui lòng thử lại.");
    }
  };

  useEffect(() => {
    const run = async () => {
      try {
        setLoading(true);
        setError(null);

        if (!studentId || !classId) {
          setError("Thiếu query params: student hoặc classId");
          setHeader(null);
          setComments([]);
          return;
        }

        const fbRes = await fetch(
          `/api/feedback?where[class][equals]=${classId}&limit=100&depth=0`,
          { credentials: "include" },
        );

        if (!fbRes.ok) throw new Error("Không lấy được dữ liệu feedback");

        const fbJson = await fbRes.json();

        const docs = fbJson?.docs ?? [];

        // merged[studentId].week3 = FeedbackComment[]
        // merged[studentId].week8 = FeedbackComment[]
        const merged: Record<
          string,
          { week3?: FeedbackComment[]; week8?: FeedbackComment[] }
        > = {};

        for (const d of docs) {
          const fd = d?.feedback_data ?? {};

          for (const sid of Object.keys(fd)) {
            merged[sid] = merged[sid] ?? {};

            const s = fd?.[sid] ?? {};
            const w3 = Array.isArray(s.week3) ? s.week3 : [];
            const w8 = Array.isArray(s.week8) ? s.week8 : [];

            merged[sid].week3 = [...(merged[sid].week3 ?? []), ...w3];
            merged[sid].week8 = [...(merged[sid].week8 ?? []), ...w8];
          }
        }

        const list = (merged?.[studentId]?.[phase] ?? []) as FeedbackComment[];

        // sort mới nhất trước
        const sorted = list
          .slice()
          .sort((a, b) => (b.createdAt ?? "").localeCompare(a.createdAt ?? ""));

        setComments(sorted);

        // header: ưu tiên lấy từ comment đầu tiên (nếu có), fallback sang query params
        const resolvedStudentName =
          sorted?.[0]?.studentName || studentNameParam || "Chưa có tên";

        setHeader({
          studentName: resolvedStudentName,
          studentId,
          className: classNameParam,
          courseName: courseNameParam,
        });
      } catch (e: any) {
        setError(e?.message || "Đã có lỗi");
        setHeader(null);
        setComments([]);
      } finally {
        setLoading(false);
      }
    };

    run();
  }, [
    studentId,
    classId,
    phase,
    classNameParam,
    courseNameParam,
    studentNameParam,
  ]);

  if (loading) return <div className="p-6">Đang tải...</div>;

  if (error) return <div className="p-6 text-red-600">{error}</div>;

  if (!header) return <div className="p-6">Không có dữ liệu</div>;

  const teacherNames = Array.from(
    new Set(comments.map((c) => c.teacherName).filter(Boolean)),
  ).join(", ");

  const latestDate = comments?.[0]?.createdAt;

  return (
    <div className="flex flex-col items-center p-2 bg-gray-100 min-h-screen">
      <div ref={pdfRef} className="w-[1000px] bg-white border border-red-900">
        <div className="p-4">
          <div className="flex justify-between items-center px-4 mb-6  border-red-900 pb-4">
            <div className="flex flex-col items-center">
              <Image
                src="/logo.svg"
                alt="TUTORS"
                width={120}
                height={40}
                className="object-contain"
                unoptimized
              />
              <div className="text-[12px] tracking-normal mt-1 font-sans text-red-700">
                YOU DESERVE BETTER
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-x-12 gap-y-4 px-4 mb-6 text-sm border border-1 p-2 border-red-700">
            <div className="flex items-center  border-gray-600">
              <span className="font-bold text-xl ">Lớp: </span>
              <span className="text-black text-xl ml-2">
                {header.className}
              </span>
            </div>

            <div className="flex items-center  border-gray-600">
              <span className="font-bold text-xl">Học sinh: </span>
              <span className="text-black text-xl ml-2">
                {header.studentName}
              </span>
            </div>

            <div className="border-gray-600 w-full flex">
              <span className="font-bold text-xl">Giáo viên: </span>
              <span className="text-black text-xl ml-2">
                {teacherNames || " "}
              </span>
            </div>
          </div>

          <div className="border border-red-900">
            <div className="bg-red-800 text-white text-center py-2 font-bold text-sm font-sans">
              ĐÁNH GIÁ VÀ NHẬN XÉT {phase === "week3" ? "TUẦN 3" : "TUẦN 8"}
            </div>

            <div className="p-4 space-y-4 text-[15px]">
              {comments.length === 0 ? (
                <div>Chưa có nhận xét</div>
              ) : (
                comments.map((c, i) => (
                  <div key={i} className="border rounded p-3 border-gray-400">
                    <div className="font-semibold">
                      giáo viên: {c.teacherName ?? "Giáo viên"}{" "}
                    </div>
                    <div className="mt-2 whitespace-pre-wrap">
                      {(c.comment ?? "").split("\n").map((line, idx) => (
                        <div key={idx} className="whitespace-pre-wrap">
                          - {line}
                        </div>
                      ))}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="mt-12 flex justify-between items-end px-10 pb-4">
            <div className="font-bold text-sm uppercase font-sans tracking-normal flex flex-col items-center ">
              Phòng học vụ
              <Image
                src="/hoc_vu.png"
                alt="Phòng học vụ"
                width={140}
                height={40}
                className="object-contain"
                unoptimized
              />
            </div>

            <div className="font-bold text-lg font-sans tracking-normal text-red-800">
              <span className="text-black">Ngày:</span>{" "}
              <span className="text-lg">{formatDateDDMMYYYY(latestDate)}</span>
            </div>
          </div>
        </div>
      </div>

      <button
        onClick={handleDownloadPDF}
        className="mt-6 px-6 py-2 bg-red-900 text-white font-bold rounded hover:bg-red-700"
      >
        Download PDF
      </button>
    </div>
  );
}
