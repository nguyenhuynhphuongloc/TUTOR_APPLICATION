import type { CollectionConfig } from "payload";

export const Roles: CollectionConfig = {
  slug: "roles",
  admin: {
    defaultColumns: ["title", "updatedAt", "createdAt", "permissions"],
    useAsTitle: "title",
  },
  fields: [
    {
      name: "title",
      type: "text",
      required: true,
    },
    {
      name: "permissions",
      type: "relationship",
      relationTo: "permissions",
      hasMany: true,
    },
  ],
};
