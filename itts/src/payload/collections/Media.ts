import type { CollectionConfig } from "payload";
import { checkRolePermission } from "../access";

export const Media: CollectionConfig = {
  slug: "media",
  labels: {
    singular: "Quản Lý Tập Tin",
    plural: "Quản Lý Tập Tin",
  },
  access: {
    ...checkRolePermission("media"),
    read: () => true,
  },
  fields: [
    {
      name: "alt",
      type: "text",
    },
  ],
  upload: true,
};
