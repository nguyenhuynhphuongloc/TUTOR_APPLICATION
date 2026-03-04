import cron from "node-cron";
import { Payload } from "payload";
import { checkAndNotifyUpcomingSessions } from "./attendanceReminder";

let isSchedulerRunning = false;

/**
 * Khởi động các cron jobs cho hệ thống.
 * Được gọi từ onInit trong payload.config.ts
 */
export const startCronJobs = (payload: Payload): void => {
    if (isSchedulerRunning) {
        console.log("[Cron] Scheduler đã đang chạy, bỏ qua khởi tạo lại.");
        return;
    }

    // Chạy mỗi 30 phút
    // Window check là 35 phút để đảm bảo không bỏ sót
    cron.schedule("*/30 * * * *", async () => {
        console.log(
            `[Cron] Kiểm tra buổi học sắp tới: ${new Date().toLocaleString("vi-VN", { timeZone: "Asia/Ho_Chi_Minh" })}`,
        );
        await checkAndNotifyUpcomingSessions(payload);
    });

    isSchedulerRunning = true;
    console.log(
        "[Cron] ✅ Scheduler đã khởi động - Kiểm tra điểm danh mỗi 30 phút",
    );
};
