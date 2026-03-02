import type { CollectionConfig } from "payload";
import { checkRolePermission } from "../access";

export const StudentCare: CollectionConfig = {
  slug: "care",
  labels: {
    singular: "Chăm sóc học viên",
    plural: "Chăm sóc học viên",
  },
  admin: {
    useAsTitle: "id",
    defaultColumns: ["class_ref", "class_status", "updatedAt"],
  },
  access: checkRolePermission("care"),
  hooks: {},
  fields: [
    {
      type: "row",
      fields: [
        {
          name: "class_ref",
          label: "Mã lớp",
          type: "relationship",
          relationTo: "classes",
          required: true,

          admin: {
            condition: ({ id }) => !id,
          },

          filterOptions: async ({ req }) => {
            const cares = await req.payload.find({
              collection: "care",
              limit: 1000,
              depth: 0,
            });

            const caredClassIds = cares.docs
              .map((c) => c.class_ref)
              .filter(Boolean);

            return {
              id: {
                not_in: caredClassIds,
              },
            };
          },
        },
      ],
    },
    {
      name: "class_status",
      label: "Trạng thái lớp học",
      type: "select",
      options: [
        { label: "Chờ mở lớp", value: "pending" },
        { label: "Chờ duyệt", value: "approve_pending" },
        { label: "Đã mở", value: "opening" },
        { label: "Đang diễn ra", value: "active" },
        { label: "Kết thúc", value: "closed" },
      ],
      admin: {
        readOnly: true,
        hidden: true,
      },
    },
    {
      name: "care_data",
      type: "json",
      admin: {
        hidden: true,
      },
    },
    {
      name: "careUI",
      label: "Bảng chăm sóc học viên",
      type: "ui",
      admin: {
        components: {
          Field: "@/payload/components/ui/care.field#default",
        },
        condition: (data) => !!data?.class_ref,
      },
    },
  ],
};
