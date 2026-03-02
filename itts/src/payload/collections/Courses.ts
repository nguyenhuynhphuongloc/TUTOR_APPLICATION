import { SKILLS_OPTIONS } from "@/constants";
import type { CollectionConfig } from "payload";
import { checkRolePermission } from "../access";

export const Courses: CollectionConfig = {
  slug: "courses",
  access: checkRolePermission("courses"),
  labels: { plural: "Khóa Học", singular: "Khóa Học" },
  admin: {
    useAsTitle: "courseName",
  },
  fields: [
    {
      name: "courseName",
      label: "Tên khóa học",
      type: "text",
      required: true,
    },
    {
      name: "tuition",
      label: "Học phí",
      type: "number",
      admin: {
        components: {
          Description: "@/payload/description/DescriptionCurrency",
          Cell: "@/payload/cell/CellCurrency",
        },
      },
    },
    {
      name: "total_hours",
      label: "Tổng số giờ của Khóa học",
      type: "number",
    },
    {
      name: "skills",
      label: "Kĩ năng trong khóa học",
      type: "select",
      options: SKILLS_OPTIONS,
      hasMany: true,
    },
    {
      name: "type",
      label: "Loại",
      type: "select",
      options: [
        { label: "Online", value: "online" },
        { label: "Offline", value: "offline" },
      ],
    },
    {
      name: "thumbnail",
      label: "Ảnh thumbnail",
      type: "upload",
      relationTo: "media",
    },
  ],
};
