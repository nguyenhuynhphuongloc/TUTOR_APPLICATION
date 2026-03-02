import type { CollectionConfig } from "payload";
import { checkRolePermission } from "../access";

export const Words: CollectionConfig = {
  slug: "words",
  access: checkRolePermission("words"),
  labels: { plural: "Từ Vựng", singular: "Từ Vựng" },
  admin: {
    group: "Học Tập",
    useAsTitle: "word",
  },
  fields: [
    {
      type: "row",
      fields: [
        { name: "word", label: "Từ", type: "text", required: true },
        {
          name: "pronunciation",
          label: "Phát âm",
          type: "text",
        },
        {
          name: "type",
          label: "Loại từ",
          type: "select",
          options: [
            {
              label: "Tính từ (adj)",
              value: "adj",
            },
            { label: "Danh từ (n)", value: "n" },
            { label: "Động từ (v)", value: "v" },
            { label: "Trạng từ (adv)", value: "adv" },
            { label: "Liên từ (conj)", value: "conj" },
          ],
        },
      ],
    },
    {
      type: "row",
      fields: [
        {
          name: "meaning-vn",
          label: "Ý nghĩa tiếng Việt",
          type: "text",
        },
        {
          name: "meaning-en",
          label: "Ý nghĩa tiếng Anh",
          type: "text",
          maxLength: 95,
          admin: {
            description: "Giới hạn 95 kí tự.",
          },
        },
      ],
    },
    {
      type: "row",
      fields: [
        {
          name: "example",
          label: "Ví dụ",
          type: "text",
        },
        {
          name: "level",
          label: "Độ khó",
          type: "text",
        },
      ],
    },
    {
      type: "row",
      fields: [
        {
          name: "synonyms",
          label: "Từ đồng nghĩa",
          type: "relationship",
          relationTo: "words",
          hasMany: true,
        },
        {
          name: "antonyms",
          label: "Từ trái nghĩa",
          type: "relationship",
          relationTo: "words",
          hasMany: true,
        },
      ],
    },
    {
      name: "sentence-use",
      label: "Điền chỗ trống từ vựng",
      type: "textarea",
    },
  ],
};
