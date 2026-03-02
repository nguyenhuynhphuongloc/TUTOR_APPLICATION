/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import type { CollectionConfig } from "payload";
import { checkRolePermission } from "../access";

export const Branches: CollectionConfig = {
  slug: "branches",
  access: checkRolePermission("branches"),
  labels: { plural: "Cơ Sở", singular: "Cơ Sở" },
  admin: { group: "Cấu Hình", useAsTitle: "name" },
  fields: [
    {
      name: "name",
      type: "text",
      required: true,
    },
    {
      name: "address",
      type: "text",
      required: true,
    },
    {
      name: "phone",
      type: "text",
      required: true,
    },
    {
      name: "rooms",
      label: "Phòng học",
      type: "relationship",
      relationTo: "rooms",
      hasMany: true,
      required: true,
    },
    {
      name: "status",
      label: "Trạng thái cơ sở",
      type: "select",
      options: [
        { label: "Đang hoạt động", value: "active" },
        { label: "Ngừng sử dựng", value: "unactive" },
      ],
    },
  ],
};
