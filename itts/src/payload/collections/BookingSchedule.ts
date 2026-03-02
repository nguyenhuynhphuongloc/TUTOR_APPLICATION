import { SKILLS_OPTIONS } from "@/constants";
import type { CollectionConfig } from "payload";
import { checkRolePermission } from "../access";

export const BookingSchedule: CollectionConfig = {
  slug: "booking_schedule",
  labels: { plural: "Đặt lịch", singular: "Đặt lịch" },
  admin: {
    useAsTitle: "student",
    defaultColumns: [
      "student",
      "teacher",
      "class",
      "mode",
      "date_time",
      "status",
    ],
  },
  access: checkRolePermission("booking_schedule"),
  fields: [
    {
      name: "student",
      label: "Học viên",
      type: "relationship",
      required: true,
      relationTo: "users",
    },
    {
      name: "teacher",
      label: "WOW phụ trách",
      type: "relationship",
      required: true,
      relationTo: "admins",
    },
    {
      name: "status",
      label: "Trạng Thái",
      type: "select",
      required: true,
      options: [
        { label: "Đợi duyệt", value: "pending" },
        { label: "Duyệt", value: "accepted" },
        { label: "Từ chối", value: "cancelled" },
      ],
    },
    {
      name: "reject_reason",
      label: "Lý do từ chối",
      type: "textarea",
      admin: {
        condition: (data) => data?.status === "rejected",
      },
    },
    {
      name: "skill",
      label: "Kỹ năng",
      type: "select",
      required: true,
      options: [...SKILLS_OPTIONS, { label: "Khác", value: "other" }],
    },
    {
      name: "alternative_skill",
      type: "text",
    },
    {
      name: "class",
      label: "Lớp học",
      type: "relationship",
      relationTo: "classes",
      required: true,
    },
    {
      name: "date_time",
      label: "Ngày book",
      admin: {
        date: {
          displayFormat: "dd/MM/yyyy HH:mm",
        },
      },
      type: "date",
      required: true,
    },
    {
      name: "link_zoom",
      type: "text",
      admin: {
        condition: (data) => data?.status === "accepted",
      },
    },
    {
      name: "mode",
      label: "Hình thức",
      type: "select",
      required: true,
      options: [
        { label: "Practice", value: "practice" },
        { label: "Exam", value: "exam" },
      ],
    },
  ],
};
