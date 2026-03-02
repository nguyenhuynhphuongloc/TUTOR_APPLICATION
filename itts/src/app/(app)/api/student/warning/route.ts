import configPromise from "@payload-config";
import { NextResponse } from "next/server";
import { getPayload } from "payload";

export async function POST(req: Request) {
  try {
    const { studentIds, status } = await req.json();

    if (!studentIds || !Array.isArray(studentIds) || studentIds.length === 0) {
      return NextResponse.json(
        { success: false, error: "No students selected" },
        { status: 400 },
      );
    }

    // Initialize payload
    const payload = await getPayload({
      config: configPromise,
    });

    // Authenticate user
    const { user } = await payload.auth({
      req: req as any,
      headers: req.headers,
    });

    if (!user) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 },
      );
    }

    const results = [];

    for (const studentId of studentIds) {
      // Get student info for email
      const student = await payload.findByID({
        collection: "users",
        id: studentId,
      });

      if (!student) continue;

      // Update user status
      await payload.update({
        collection: "users",
        id: studentId,
        data: {
          violationStatus: status,
        },
      });

      // Prepare email content based on status
      let subject = "";

      let message = "";

      switch (status) {
        case "warning_1":
          subject = "CẢNH BÁO VI PHẠM LẦN 1 - ITTS";
          message = `Chào ${student.username || "bạn"},\n\nChúng tôi gửi email này để cảnh báo về việc vi phạm nội quy học tập lần 1. Vui lòng xem lại quy định và khắc phục ngay lập tức.\n\nTrân trọng,\nĐội ngũ ITTS.`;
          break;
        case "warning_2":
          subject = "CẢNH BÁO VI PHẠM LẦN 2 - ITTS";
          message = `Chào ${student.username || "bạn"},\n\nĐây là CẢNH BÁO LẦN 2 về việc vi phạm nội quy. Nếu tiếp tục vi phạm, chúng tôi sẽ buộc phải dừng hợp đồng đào tạo.\n\nTrân trọng,\nĐội ngũ ITTS.`;
          break;
        case "terminated":
          subject = "THÔNG BÁO HỦY HỢP ĐỒNG ĐÀO TẠO - ITTS";
          message = `Chào ${student.username || "bạn"},\n\nDo vi phạm nội quy nhiều lần sau khi đã được cảnh báo, chúng tôi rất tiếc phải thông báo chấm dứt hợp đồng đào tạo với bạn kể từ ngày hôm nay.\n\nTrân trọng,\nĐội ngũ ITTS.`;
          break;
      }

      console.log(subject);

      if (student.lead && typeof student.lead !== "string" && subject) {
        try {
          await payload.sendEmail({
            to: student.lead.email,
            subject,
            text: message,
            html: `<p>${message.replace(/\n/g, "<br/>")}</p>`,
          });
          results.push({ id: studentId, success: true });
        } catch (emailError) {
          console.error(`Failed to send email to ${student.email}`, emailError);
          results.push({ id: studentId, success: true, emailError: true });
        }
      } else {
        results.push({ id: studentId, success: true, noEmail: true });
      }
    }

    return NextResponse.json({ success: true, results });
  } catch (error: any) {
    console.error("Warning API Error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to update status" },
      { status: 500 },
    );
  }
}
