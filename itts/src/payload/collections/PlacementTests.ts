import type { CollectionConfig } from "payload";
import { checkRolePermission } from "../access";

export const PlacementTests: CollectionConfig = {
  slug: "placement_tests",
  labels: { plural: "Đề Thi", singular: "Đề Thi" },
  admin: {
    defaultColumns: ["title", "type", "description", "createdAt", "updatedAt"],
    useAsTitle: "title",
    group: "Kiểm Tra Đầu Vào",
  },
  trash: true,
  versions: {
    drafts: true,
    maxPerDoc: 2,
  },
  access: checkRolePermission("placement_tests"),

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
        { label: "Mini", value: "mini" },
        { label: "Full", value: "full" },
        { label: "SAT", value: "sat" },
      ],
      defaultValue: "mini",
      enumName: "placement_test_types",
      required: true,
    },
    {
      name: "tests",
      label: "Nội dung bài thi",
      type: "relationship",
      relationTo: "tests",
      maxDepth: 1,
      hasMany: true,
      required: true,
      filterOptions: () => ({
        _status: { equals: "published" },
        test_type: { equals: "entrance_test" },
      }),
      admin: {
        allowCreate: false,
      },
    },
  ],
};
