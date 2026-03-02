import type { CollectionConfig } from "payload";
import { checkRolePermission } from "../access";

export const AttendanceRecord: CollectionConfig = {
  slug: "attendanceRecords",
  labels: {
    singular: "Điểm danh",
    plural: "Điểm danh",
  },
  admin: {
    defaultColumns: ["class"],
  },
  access: checkRolePermission("attendanceRecords"),
  hooks: {
    afterChange: [
      async ({ req: { payload }, doc, operation }) => {
        if (operation === "create" || operation === "update") {
          const violationData = doc.ViolationRecord_data;
          if (!violationData) return;

          const studentIds = new Set<string>();
          Object.values(violationData).forEach((session: any) => {
            if (session?.students) {
              Object.keys(session.students).forEach((id) => studentIds.add(id));
            }
          });

          // Use Promise.allSettled to not fail the hook if one fails
          const results = await Promise.allSettled(
            Array.from(studentIds).map(async (studentId) => {
              const { checkAndSendViolationWarning } = await import(
                "@/payload/utilities/studentViolation"
              );
              await checkAndSendViolationWarning(payload, studentId);
            }),
          );

          results.forEach((result) => {
            if (result.status === "rejected") {
              console.error("Error checking violation warning:", result.reason);
            }
          });
        }
        return doc;
      },
    ],
  },
  fields: [
    {
      name: "class",
      label: "Lớp học",
      type: "relationship",
      relationTo: "classes",
      hidden: false,
      admin: {
        readOnly: true,
        hidden: true,
      },
      required: true,
    },
    {
      name: "AttendanceRecord_data",
      type: "json",
      admin: {
        hidden: true,
      },
    },
    {
      name: "ViolationRecord_data",
      label: "Dữ liệu vi phạm",
      type: "json",
      admin: {
        hidden: true,
      },
    },
    {
      name: "attendance_record_ui",
      label: "Điểm danh",
      type: "ui",
      admin: {
        components: {
          Field: "@/payload/components/ui/AttendaceRecord.field#default",
        },
      },
    },
  ],
};
