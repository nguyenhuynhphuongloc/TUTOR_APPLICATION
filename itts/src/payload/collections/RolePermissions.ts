import type { CollectionConfig } from "payload";
import { isAdmin } from "../access";

export const RolePermissions: CollectionConfig = {
  slug: "role_permissions",
  labels: {
    singular: "Phân Quyền",
    plural: "Phân Quyền",
  },
  access: {
    read: isAdmin,
    create: isAdmin,
    update: isAdmin,
    delete: isAdmin,
  },
  admin: {
    components: {
      views: {
        list: {
          Component: "@/components/RolePermissions/index.tsx",
        },
      },
    },
  },
  fields: [
    {
      name: "permissions",
      label: "Cấu hình quyền",
      type: "json",
      required: true,
    },
  ],
};
