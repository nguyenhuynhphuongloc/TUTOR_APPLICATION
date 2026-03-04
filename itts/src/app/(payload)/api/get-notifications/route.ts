import configPromise from "@payload-config";
import { getPayload } from "payload";
import { NextRequest, NextResponse } from "next/server";

/**
 * GET /api/notifications
 * Lấy danh sách thông báo chưa đọc của giáo viên đang đăng nhập.
 * Query params:
 *   - recipientId: ID của admin (giáo viên)
 *   - limit: số lượng (mặc định 20)
 */
export async function GET(req: NextRequest) {
    try {
        const payload = await getPayload({ config: configPromise });
        const { searchParams } = new URL(req.url);
        const recipientId = searchParams.get("recipientId");
        const limit = parseInt(searchParams.get("limit") || "20", 10);

        if (!recipientId) {
            return NextResponse.json(
                { error: "recipientId is required" },
                { status: 400 },
            );
        }

        const { docs, totalDocs } = await payload.find({
            collection: "notifications" as any,
            where: {
                and: [
                    { recipient: { equals: recipientId } },
                    { is_read: { equals: false } },
                ],
            },
            sort: "-session_date",
            limit,
            depth: 1,
        });

        return NextResponse.json({
            notifications: docs,
            totalUnread: totalDocs,
        });
    } catch (error: any) {
        console.error("[Notifications API] Error:", error);
        return NextResponse.json(
            { error: error.message || "Failed to fetch notifications" },
            { status: 500 },
        );
    }
}

/**
 * PATCH /api/notifications
 * Đánh dấu thông báo đã đọc.
 * Body: { notificationId: string }
 */
export async function PATCH(req: NextRequest) {
    try {
        const payload = await getPayload({ config: configPromise });
        const { notificationId } = await req.json();

        if (!notificationId) {
            return NextResponse.json(
                { error: "notificationId is required" },
                { status: 400 },
            );
        }

        await payload.update({
            collection: "notifications" as any,
            id: notificationId,
            data: { is_read: true } as any,
        });

        return NextResponse.json({ success: true });
    } catch (error: any) {
        console.error("[Notifications API] Error:", error);
        return NextResponse.json(
            { error: error.message || "Failed to update notification" },
            { status: 500 },
        );
    }
}

/**
 * DELETE /api/get-notifications
 * Xóa thông báo đã đọc.
 * Body: { notificationId: string }
 */
export async function DELETE(req: NextRequest) {
    try {
        const payload = await getPayload({ config: configPromise });
        const { notificationId } = await req.json();

        if (!notificationId) {
            return NextResponse.json(
                { error: "notificationId is required" },
                { status: 400 },
            );
        }

        await payload.delete({
            collection: "notifications" as any,
            id: notificationId,
        });

        return NextResponse.json({ success: true });
    } catch (error: any) {
        console.error("[Notifications API] Error:", error);
        return NextResponse.json(
            { error: error.message || "Failed to delete notification" },
            { status: 500 },
        );
    }
}
