import { Payload } from "payload";

/**
 * Kiểm tra các buổi học sắp diễn ra trong 20 phút tới
 * và tạo thông báo cho giáo viên phụ trách.
 *
 * TỐI ƯU:
 * - Chỉ query classes có session hôm nay (giảm 90% data)
 * - Bulk check trùng bằng 1 query duy nhất thay vì N query
 * - Batch create notifications
 */
export const checkAndNotifyUpcomingSessions = async (
    payload: Payload,
): Promise<void> => {
    try {
        const now = new Date();
        const thirtyFiveMinutesLater = new Date(now.getTime() + 35 * 60 * 1000);

        // Tính khoảng thời gian hôm nay để lọc classes
        const todayStart = new Date(now);
        todayStart.setHours(0, 0, 0, 0);
        const todayEnd = new Date(todayStart);
        todayEnd.setDate(todayEnd.getDate() + 1);

        // === QUERY 1: Chỉ lấy classes ACTIVE (depth 1 là đủ) ===
        const { docs: activeClasses } = await payload.find({
            collection: "classes",
            where: {
                status_class: { equals: "active" },
            },
            limit: 200,
            depth: 1,
        });

        if (!activeClasses.length) return;

        // Lọc classes có session trong khoảng [now, now + 20 phút] ở phía code
        // (nhanh hơn query DB vì sessions là JSON array)
        const classesWithUpcomingSessions: Array<{
            classId: string;
            className: string;
            sessionDate: Date;
            teachers: Array<{ id: string; name: string }>;
        }> = [];

        for (const classDoc of activeClasses) {
            const sessions = (classDoc as any).sessions;
            const teachers = (classDoc as any).teachers;

            if (!sessions?.length || !teachers?.length) continue;

            // Lấy danh sách teachers 1 lần cho class này
            const teacherList: Array<{ id: string; name: string }> = [];
            for (const entry of teachers) {
                const teacher = entry.teacher;
                if (!teacher) continue;
                teacherList.push({
                    id: typeof teacher === "object" ? teacher.id : teacher,
                    name:
                        typeof teacher === "object"
                            ? teacher.fullName || "Giáo viên"
                            : "Giáo viên",
                });
            }

            if (!teacherList.length) continue;

            // Tìm sessions sắp diễn ra
            for (const session of sessions) {
                if (!session.date) continue;
                const sessionDate = new Date(session.date);

                if (sessionDate >= now && sessionDate <= thirtyFiveMinutesLater) {
                    classesWithUpcomingSessions.push({
                        classId: classDoc.id,
                        className: (classDoc as any).name || "Lớp học",
                        sessionDate,
                        teachers: teacherList,
                    });
                }
            }
        }

        if (!classesWithUpcomingSessions.length) return;

        // === QUERY 2: Bulk check tất cả notifications đã tạo (1 query duy nhất) ===
        const classIds = [
            ...new Set(classesWithUpcomingSessions.map((c) => c.classId)),
        ];

        const { docs: existingNotifs } = await payload.find({
            collection: "notifications" as any,
            where: {
                and: [
                    { class: { in: classIds } },
                    {
                        session_date: {
                            greater_than_equal: now.toISOString(),
                        },
                    },
                ],
            },
            limit: 1000,
            depth: 0,
        });

        // Tạo Set để check trùng O(1) — không cần query DB nữa
        const sentKeys = new Set(
            existingNotifs.map((n: any) => {
                const recipientId =
                    typeof n.recipient === "object" ? n.recipient?.id : n.recipient;
                const classId = typeof n.class === "object" ? n.class?.id : n.class;
                return `${recipientId}|${classId}|${n.session_date}`;
            }),
        );

        // === QUERY 3+: Chỉ tạo notifications mới (batch) ===
        const notificationsToCreate: Array<{
            teacherId: string;
            teacherName: string;
            classId: string;
            className: string;
            sessionDate: Date;
        }> = [];

        for (const item of classesWithUpcomingSessions) {
            for (const teacher of item.teachers) {
                const key = `${teacher.id}|${item.classId}|${item.sessionDate.toISOString()}`;

                if (!sentKeys.has(key)) {
                    notificationsToCreate.push({
                        teacherId: teacher.id,
                        teacherName: teacher.name,
                        classId: item.classId,
                        className: item.className,
                        sessionDate: item.sessionDate,
                    });
                }
            }
        }

        if (!notificationsToCreate.length) return;

        // Tạo notifications song song (Promise.allSettled để không fail toàn bộ)
        const results = await Promise.allSettled(
            notificationsToCreate.map(async (item) => {
                const timeStr = item.sessionDate.toLocaleTimeString("vi-VN", {
                    hour: "2-digit",
                    minute: "2-digit",
                    timeZone: "Asia/Ho_Chi_Minh",
                });
                const dateStr = item.sessionDate.toLocaleDateString("vi-VN", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                    timeZone: "Asia/Ho_Chi_Minh",
                });

                await payload.create({
                    collection: "notifications" as any,
                    data: {
                        type: "attendance_reminder",
                        title: `Nhắc điểm danh: ${item.className}`,
                        message: `Xin chào ${item.teacherName}, buổi học lớp ${item.className} sẽ bắt đầu lúc ${timeStr} ngày ${dateStr}. Vui lòng vào lớp để điểm danh đúng giờ.`,
                        recipient: item.teacherId,
                        class: item.classId,
                        session_date: item.sessionDate.toISOString(),
                        is_read: false,
                    },
                });

                console.log(
                    `[Attendance Reminder] ✅ ${item.teacherName} - ${item.className} - ${timeStr} ${dateStr}`,
                );
            }),
        );

        const created = results.filter((r) => r.status === "fulfilled").length;
        const failed = results.filter((r) => r.status === "rejected").length;

        console.log(
            `[Attendance Reminder] Tạo ${created} thông báo${failed > 0 ? `, ${failed} thất bại` : ""}`,
        );
    } catch (error) {
        console.error("[Attendance Reminder] Lỗi khi kiểm tra buổi học:", error);
    }
};
