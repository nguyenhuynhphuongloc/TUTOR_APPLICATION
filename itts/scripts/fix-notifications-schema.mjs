/**
 * Script thêm cột notifications_id vào bảng nội bộ Payload
 * Chạy: node --env-file=.env scripts/fix-notifications-schema.mjs
 */

import postgres from "postgres";

const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
  console.error("❌ DATABASE_URL không tìm thấy. Chạy: node --env-file=.env scripts/fix-notifications-schema.mjs");
  process.exit(1);
}

const sql = postgres(DATABASE_URL);

async function main() {
  console.log("🔧 Đang cập nhật database...");

  try {
    // 1. Tạo bảng notifications nếu chưa có
    await sql`
      CREATE TABLE IF NOT EXISTS notifications (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        type VARCHAR DEFAULT 'attendance_reminder',
        title VARCHAR NOT NULL,
        message TEXT NOT NULL,
        recipient_id UUID,
        class_id UUID,
        session_date TIMESTAMPTZ,
        is_read BOOLEAN DEFAULT false,
        updated_at TIMESTAMPTZ DEFAULT now() NOT NULL,
        created_at TIMESTAMPTZ DEFAULT now() NOT NULL
      )
    `;
    console.log("✅ Tạo bảng notifications");

    // 2. Thêm cột vào payload_locked_documents_rels
    await sql`
      ALTER TABLE payload_locked_documents_rels 
      ADD COLUMN IF NOT EXISTS notifications_id UUID
    `;
    console.log("✅ Thêm cột notifications_id vào payload_locked_documents_rels");

  } catch (error) {
    console.error("❌ Lỗi:", error.message || error);
  } finally {
    await sql.end();
    console.log("🏁 Xong! Hãy restart dev server.");
  }
}

main();
