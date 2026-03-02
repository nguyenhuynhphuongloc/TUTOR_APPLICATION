import { Payload } from "payload";

const VIOLATIONS = [
  "no_camera",
  "absent_without_permission",
  "absent_with_permission",
  "late_homework",
] as const;

export const calculateStudentViolations = async (
  payload: Payload,
  studentId: string,
): Promise<number> => {
  let page = 1;
  let hasNextPage = true;
  let totalViolations = 0;

  while (hasNextPage) {
    const result = await payload.find({
      collection: "attendanceRecords",
      limit: 100,
      page,
      depth: 0,
    });

    for (const record of result.docs) {
      const violationData = record.ViolationRecord_data as any;
      if (!violationData) continue;

      Object.values(violationData).forEach((session: any) => {
        const studentViolations = session?.students?.[studentId];
        if (!studentViolations) return;

        VIOLATIONS.forEach((v) => {
          if (studentViolations[v]) {
            totalViolations++;
          }
        });
      });
    }

    hasNextPage = result.hasNextPage;
    page++;
  }

  return totalViolations;
};

export const checkAndSendViolationWarning = async (
  payload: Payload,
  studentId: string,
) => {
  const totalViolations = await calculateStudentViolations(payload, studentId);

  if (totalViolations > 3) {
    const student = await payload.findByID({
      collection: "users",
      id: studentId,
      depth: 1,
    });

    if (!student) return;

    // Only send if status is currently 'none' or undefined
    if (student.violationStatus && student.violationStatus !== "none") {
      return;
    }

    // Update status first
    await payload.update({
      collection: "users",
      id: studentId,
      data: {
        violationStatus: "warning_1",
      },
    });

    // Send Email
    const subject = "CẢNH BÁO VI PHẠM LẦN 1 - ITTS";
    const message = `Chào ${student.username || "bạn"},\n\nChúng tôi gửi email này để cảnh báo về việc vi phạm nội quy học tập lần 1 s(Tổng số lỗi: ${totalViolations}). Vui lòng xem lại quy định và khắc phục ngay lập tức.\n\nTrân trọng,\nĐội ngũ ITTS.`;

    // Check if lead exists and is populated
    if (
      student.lead &&
      typeof student.lead !== "string" &&
      student.lead.email
    ) {
      try {
        await payload.sendEmail({
          to: student.lead.email,
          subject,
          text: message,
          html: `<p>${message.replace(/\n/g, "<br/>")}</p>`,
        });
        console.log(`Warning email sent to lead of ${student.email}`);
      } catch (error) {
        console.error(
          `Failed to send warning email to lead of ${student.email}`,
          error,
        );
      }
    }
  }
};
