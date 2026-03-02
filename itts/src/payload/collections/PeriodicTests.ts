import type { CollectionConfig } from "payload";
import { checkRolePermission } from "../access";

export const PeriodicTests: CollectionConfig = {
  slug: "periodic_tests",
  labels: { plural: "Đề Thi", singular: "Đề Thi" },
  admin: {
    defaultColumns: ["title", "type", "description", "createdAt"],
    useAsTitle: "title",
    group: "Kiểm Tra Định Kỳ",
  },
  versions: {
    drafts: true,
    maxPerDoc: 2,
  },
  access: checkRolePermission("periodic_tests"),
  fields: [
    {
      name: "title",
      label: "Tiêu đề",
      type: "text",
      required: true,
    },
    {
      name: "description",
      label: "Mô tả",
      type: "textarea",
      required: false,
    },
    {
      name: "type",
      label: "Loại đề thi",
      type: "select",
      options: [
        { label: "Bài tập về nhà", value: "homework" },
        { label: "Bài tập bổ trợ", value: "extra_homework" },
        { label: "Mini test", value: "mini_test" },
        { label: "Kiểm tra giữa kỳ", value: "mid_term" },
        { label: "Kiểm tra cuối kỳ", value: "final_term" },
        { label: "Kho đề", value: "bank" },
        { label: "Kiểm tra đầu vào", value: "entrance_test" },
      ],
      defaultValue: "homework",
      enumName: "test_types",
      required: true,
      admin: {
        components: {
          Cell: "@/payload/cell/CellSelectTestType",
        },
      },
    },
    {
      name: "tests",
      label: "Nội dung bài thi",
      type: "relationship",
      relationTo: "tests",
      maxDepth: 2,
      hasMany: true,
      required: true,
      filterOptions: ({ data }) => {
        return {
          _status: { equals: "published" },
          test_type: { in: [data.type] },
        };
      },
      admin: {
        allowCreate: false,
      },
    },
  ],
};
