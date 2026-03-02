import type { CollectionConfig } from "payload";

export const PersonalVocabulary: CollectionConfig = {
  slug: "personal-vocab",
  labels: { plural: "BST cá nhân", singular: "BST cá nhân" },
  admin: {
    group: "Học Tập",
    useAsTitle: "name",
    hidden: true,
  },
  fields: [
    {
      name: "user",
      label: "Người dùng",
      type: "relationship",
      relationTo: "users",
      required: true,
    },
    {
      name: "name",
      label: "Tên bộ sưu tập",
      type: "text",
      required: true,
    },
    {
      name: "words",
      label: "Từ muốn học",
      type: "relationship",
      relationTo: "words",
      required: true,
      hasMany: true,
    },
  ],
};
