import type { CollectionConfig } from "payload";
import { checkRolePermission } from "../access";

export const Vocabulary: CollectionConfig = {
  slug: "vocabulary",
  access: checkRolePermission("vocabulary"),
  labels: { plural: "Bộ Từ Vựng", singular: "Bộ Từ Vựng" },
  admin: {
    group: "Học Tập",
    useAsTitle: "name",
  },
  fields: [
    {
      type: "row",
      fields: [
        {
          name: "name",
          label: "Tên bộ sưu tập",
          type: "text",
          required: true,
        },
        {
          name: "level",
          label: "Độ khó",
          type: "text",
        },
        {
          name: "thumbnail",
          label: "Ảnh thumbnail",
          type: "upload",
          relationTo: "media",
        },
      ],
    },
    {
      type: "relationship",
      name: "words",
      label: "Từ vựng",
      required: true,
      relationTo: "words",
      hasMany: true,
    },
  ],
};
