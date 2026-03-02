import type { CollectionConfig } from "payload";

export const Permissions: CollectionConfig = {
  slug: "permissions",
  admin: {
    defaultColumns: ["title", "updatedAt", "createdAt"],
    useAsTitle: "title",
  },
  fields: [
    {
      name: "title",
      type: "text",
      required: true,
    },
  ],
};
