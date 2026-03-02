import type { CollectionConfig } from "payload";
import { checkRolePermission } from "../access";

export const Feedbacks: CollectionConfig = {
  slug: "feedback",
  labels: {
    singular: "Feedback",
    plural: "Feedback",
  },
  admin: {
    useAsTitle: "class",
    defaultColumns: ["class", "student", "teacher", "createdAt"],
  },
  access: checkRolePermission("feedback"),
  fields: [
    {
      type: "row",
      fields: [
        {
          name: "class",
          label: "Lớp học",
          type: "relationship",
          relationTo: "classes",
          required: true,
          admin: { readOnly: true },
        },
      ],
    },
    {
      name: "feedback_data",
      label: "Dữ liệu đánh giá học viên",
      type: "json",
      defaultValue: {},
      admin: {
        hidden: true,
      },
    },
    {
      name: "student_review_session",
      label: "Đánh giá buổi học",
      type: "json",
      defaultValue: {},
      admin: {
        hidden: true,
      },
    },
    {
      name: "feedbackUI",
      label: "Bảng đánh giá học viên",
      type: "ui",
      admin: {
        components: {
          Field: "@/payload/components/ui/feedback.field#default",
        },
      },
    },
  ],
};
