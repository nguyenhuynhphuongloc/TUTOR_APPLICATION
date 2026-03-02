"use client";

import { toast } from "@payloadcms/ui";
import { useCallback, useEffect, useState } from "react";

// Roles (bỏ admin vì admin luôn full quyền)
const ROLES_FOR_PERMISSION = [
  { label: "Học vụ Manager", value: "hoc_vu_manager" },
  { label: "Học vụ Executive", value: "hoc_vu_executive" },
  { label: "Academic Manager", value: "academic_manager" },
  { label: "Teacher Part-Time", value: "teacher_part_time" },
  { label: "Teacher Full-Time", value: "teacher_full_time" },
  { label: "WOW", value: "wow" },
  { label: "Sale Manager", value: "sale_manager" },
  { label: "Sale Executive", value: "sale_executive" },
  { label: "Marketing Manager", value: "marketing_manager" },
  { label: "Marketing Executive", value: "marketing_executive" },
  { label: "Designer", value: "designer" },
  { label: "SEO", value: "seo" },
  { label: "Digital Marketing", value: "digital_marketing" },
  { label: "HR Manager", value: "hr_manager" },
  { label: "HR Generalist", value: "hr_generalist" },
  { label: "Kế toán", value: "ke_toan" },
] as const;

// Collections hiển thị trong admin (không ẩn)
const VISIBLE_COLLECTIONS = [
  { label: "Khóa Học", slug: "courses" },
  { label: "Đề Thi (Placement)", slug: "placement_tests" },
  { label: "Bài Thi (Placement)", slug: "placement_attempts" },
  { label: "Media", slug: "media" },
  { label: "Học Viên", slug: "users" },
  { label: "Nhân Viên", slug: "admins" },
  { label: "Ưu Đãi", slug: "coupons" },
  { label: "Đơn Hàng", slug: "orders" },
  { label: "Leads", slug: "leads" },
  { label: "Tests", slug: "tests" },
  { label: "Lớp Học", slug: "classes" },
  { label: "Feedbacks", slug: "feedback" },
  { label: "Bộ Từ Vựng", slug: "vocabulary" },
  { label: "Cơ Sở", slug: "branches" },
  { label: "Phòng Học", slug: "rooms" },
  { label: "Band Score", slug: "band_score" },
  { label: "Từ Vựng", slug: "words" },
  { label: "Đề Thi (Periodic)", slug: "periodic_tests" },
  { label: "Bài Thi (Periodic)", slug: "periodic_test_attempts" },
  { label: "Đặt Lịch", slug: "booking_schedule" },
  { label: "Chăm sóc học viên", slug: "care" },
  { label: "Điểm Danh", slug: "attendanceRecords" },
] as const;

type PermAction = "view" | "create" | "update" | "delete";

type PermissionData = Record<
  string,
  Record<string, Record<PermAction, boolean>>
>;

const ACTION_LABELS: { key: PermAction; label: string }[] = [
  { key: "view", label: "Xem" },
  { key: "create", label: "Tạo" },
  { key: "update", label: "Sửa" },
  { key: "delete", label: "Xóa" },
];

// Khởi tạo permissions mặc định (tất cả false)
function getDefaultPermissions(): PermissionData {
  const data: PermissionData = {};
  for (const role of ROLES_FOR_PERMISSION) {
    data[role.value] = {};
    for (const col of VISIBLE_COLLECTIONS) {
      data[role.value][col.slug] = {
        view: false,
        create: false,
        update: false,
        delete: false,
      };
    }
  }
  return data;
}

export default function RolePermissionsClient() {
  const [permissions, setPermissions] = useState<PermissionData>(
    getDefaultPermissions,
  );
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [existingDocId, setExistingDocId] = useState<string | null>(null);

  // Load dữ liệu hiện tại
  useEffect(() => {
    const fetchPermissions = async () => {
      try {
        const res = await fetch("/api/role_permissions?limit=1");
        const data = await res.json();
        if (data.docs && data.docs.length > 0) {
          const doc = data.docs[0];
          setExistingDocId(doc.id);
          // Merge dữ liệu từ DB vào default (có thể có collection/role mới)
          setPermissions((prev) => {
            const merged = { ...prev };
            const saved = doc.permissions as PermissionData;
            if (saved) {
              for (const role of Object.keys(saved)) {
                if (!merged[role]) continue;
                for (const col of Object.keys(saved[role])) {
                  if (!merged[role][col]) continue;
                  merged[role][col] = {
                    ...merged[role][col],
                    ...saved[role][col],
                  };
                }
              }
            }
            return merged;
          });
        }
      } catch (err) {
        console.error("Lỗi tải cấu hình quyền:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchPermissions();
  }, []);

  const handleToggle = useCallback(
    (role: string, collection: string, action: PermAction) => {
      setPermissions((prev) => {
        const rolePerms = prev[role] || {};
        const colPerms = rolePerms[collection] || {
          view: false,
          create: false,
          update: false,
          delete: false,
        };
        return {
          ...prev,
          [role]: {
            ...rolePerms,
            [collection]: {
              ...colPerms,
              [action]: !colPerms[action],
            } as Record<PermAction, boolean>,
          },
        } as PermissionData;
      });
    },
    [],
  );

  const handleSave = async () => {
    setSaving(true);
    try {
      if (existingDocId) {
        await fetch(`/api/role_permissions/${existingDocId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ permissions }),
        });
      } else {
        const res = await fetch("/api/role_permissions", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ permissions }),
        });
        const data = await res.json();
        setExistingDocId(data.doc?.id);
      }
      toast.success("Đã lưu cấu hình phân quyền!");
    } catch (err) {
      console.error(err);
      toast.error("Lỗi khi lưu cấu hình!");
    } finally {
      setSaving(false);
    }
  };

  // Toggle toàn bộ column (collection)
  const handleToggleColumn = useCallback((colSlug: string) => {
    setPermissions((prev) => {
      // Check if all roles have all actions true for this column
      const allChecked = ROLES_FOR_PERMISSION.every((role) =>
        ACTION_LABELS.every((a) => prev[role.value]?.[colSlug]?.[a.key]),
      );
      const newVal = !allChecked;
      const updated = { ...prev };
      for (const role of ROLES_FOR_PERMISSION) {
        updated[role.value] = {
          ...updated[role.value],
          [colSlug]: {
            view: newVal,
            create: newVal,
            update: newVal,
            delete: newVal,
          },
        };
      }
      return updated;
    });
  }, []);

  // Toggle toàn bộ row (role)
  const handleToggleRow = useCallback((roleValue: string) => {
    setPermissions((prev) => {
      const allChecked = VISIBLE_COLLECTIONS.every((col) =>
        ACTION_LABELS.every((a) => prev[roleValue]?.[col.slug]?.[a.key]),
      );
      const newVal = !allChecked;
      const updated = { ...prev };
      const newCols: Record<string, Record<PermAction, boolean>> = {};
      for (const col of VISIBLE_COLLECTIONS) {
        newCols[col.slug] = {
          view: newVal,
          create: newVal,
          update: newVal,
          delete: newVal,
        };
      }
      updated[roleValue] = newCols;
      return updated;
    });
  }, []);

  if (loading) {
    return (
      <div style={{ padding: "40px", textAlign: "center" }}>
        <p style={{ fontSize: "16px", color: "#666" }}>
          Đang tải cấu hình phân quyền...
        </p>
      </div>
    );
  }

  return (
    <div style={{ paddingBottom: "40px" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "20px",
        }}
      >
        <h2 style={{ margin: 0, fontSize: "20px", fontWeight: 700 }}>
          Bảng phân quyền
        </h2>
        <button
          onClick={handleSave}
          disabled={saving}
          style={{
            padding: "10px 28px",
            backgroundColor: saving ? "#94a3b8" : "#2563eb",
            color: "#fff",
            border: "none",
            borderRadius: "6px",
            cursor: saving ? "not-allowed" : "pointer",
            fontWeight: 600,
            fontSize: "14px",
            transition: "background-color 0.2s",
          }}
        >
          {saving ? "Đang lưu..." : "Lưu cấu hình"}
        </button>
      </div>

      <div
        style={{
          overflow: "auto",
          border: "1px solid #e2e8f0",
          borderRadius: "8px",
          maxWidth: "100%",
          maxHeight: "calc(100vh - 200px)",
        }}
      >
        <table
          style={{
            borderCollapse: "collapse",
            minWidth: "100%",
            fontSize: "13px",
          }}
        >
          <thead>
            <tr
              style={{
                backgroundColor: "#f8fafc",
                position: "sticky",
                top: 0,
                zIndex: 4,
              }}
            >
              <th
                style={{
                  position: "sticky",
                  left: 0,
                  zIndex: 3,
                  backgroundColor: "#f1f5f9",
                  padding: "12px 16px",
                  textAlign: "left",
                  borderBottom: "2px solid #e2e8f0",
                  borderRight: "2px solid #e2e8f0",
                  minWidth: "180px",
                  fontWeight: 700,
                }}
              >
                Chức vụ
              </th>
              {VISIBLE_COLLECTIONS.map((col) => {
                const allChecked = ROLES_FOR_PERMISSION.every((role) =>
                  ACTION_LABELS.every(
                    (a) => permissions[role.value]?.[col.slug]?.[a.key],
                  ),
                );
                return (
                  <th
                    key={col.slug}
                    style={{
                      padding: "8px 12px",
                      textAlign: "center",
                      borderBottom: "2px solid #e2e8f0",
                      borderRight: "1px solid #e2e8f0",
                      minWidth: "120px",
                      fontWeight: 600,
                      whiteSpace: "nowrap",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        gap: "4px",
                      }}
                    >
                      <span>{col.label}</span>
                      <label
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "4px",
                          fontSize: "11px",
                          color: "#64748b",
                          cursor: "pointer",
                        }}
                      >
                        <input
                          type="checkbox"
                          checked={allChecked}
                          onChange={() => handleToggleColumn(col.slug)}
                          style={{ cursor: "pointer" }}
                        />
                        Tất cả
                      </label>
                    </div>
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {ROLES_FOR_PERMISSION.map((role, rowIdx) => {
              const allChecked = VISIBLE_COLLECTIONS.every((col) =>
                ACTION_LABELS.every(
                  (a) => permissions[role.value]?.[col.slug]?.[a.key],
                ),
              );
              return (
                <tr
                  key={role.value}
                  style={{
                    backgroundColor: rowIdx % 2 === 0 ? "#fff" : "#f8fafc",
                  }}
                >
                  <td
                    style={{
                      position: "sticky",
                      left: 0,
                      zIndex: 2,
                      backgroundColor: rowIdx % 2 === 0 ? "#fff" : "#f8fafc",
                      padding: "10px 16px",
                      borderBottom: "1px solid #e2e8f0",
                      borderRight: "2px solid #e2e8f0",
                      fontWeight: 600,
                      whiteSpace: "nowrap",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                      }}
                    >
                      <input
                        type="checkbox"
                        checked={allChecked}
                        onChange={() => handleToggleRow(role.value)}
                        style={{ cursor: "pointer" }}
                        title="Chọn/bỏ tất cả quyền cho role này"
                      />
                      <span>{role.label}</span>
                    </div>
                  </td>
                  {VISIBLE_COLLECTIONS.map((col) => (
                    <td
                      key={col.slug}
                      style={{
                        padding: "6px 12px",
                        borderBottom: "1px solid #e2e8f0",
                        borderRight: "1px solid #e2e8f0",
                        textAlign: "center",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          gap: "2px",
                          alignItems: "flex-start",
                        }}
                      >
                        {ACTION_LABELS.map((action) => (
                          <label
                            key={action.key}
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: "6px",
                              cursor: "pointer",
                              fontSize: "12px",
                              padding: "1px 0",
                            }}
                          >
                            <input
                              type="checkbox"
                              checked={
                                permissions[role.value]?.[col.slug]?.[
                                  action.key
                                ] ?? false
                              }
                              onChange={() =>
                                handleToggle(role.value, col.slug, action.key)
                              }
                              style={{ cursor: "pointer" }}
                            />
                            <span>{action.label}</span>
                          </label>
                        ))}
                      </div>
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
