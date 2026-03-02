import type { CollectionConfig } from "payload";
import { checkRolePermission } from "../access";

export const Users: CollectionConfig = {
  slug: "users",
  labels: { plural: "Học Viên", singular: "Học Viên" },
  admin: {
    useAsTitle: "username",
  },
  auth: {
    loginWithUsername: true,
    tokenExpiration: 60 * 60 * 24 * 30, // 1 day
  },
  access: checkRolePermission("users"),
  defaultPopulate: { lead: true },
  fields: [
    {
      type: "row",
      fields: [
        {
          name: "role",
          type: "select",
          options: [{ label: "User", value: "user" }],
          required: true,
          defaultValue: "user",
        },
        {
          name: "lead",
          type: "relationship",
          relationTo: "leads",
          // admin: {
          //   components: {
          //     Field: "@/payload/select/SelectLead",
          //   },
          // },
          // hooks: {
          //   afterRead: [
          //     async ({ req: { payload }, value }) => {
          //       const data = await payload.findByID({
          //         collection: "leads",
          //         id: value,
          //       });
          //       return `${data?.fullName}${data?.phone ? ` - ${data?.phone}` : ""}`;
          //     },
          //   ],
          // },
        },
        {
          name: "violationStatus",
          type: "select",
          options: [
            { label: "Bình thường", value: "none" },
            { label: "Cảnh báo lần 1", value: "warning_1" },
            { label: "Cảnh báo lần 2", value: "warning_2" },
            { label: "Hủy hợp đồng", value: "terminated" },
          ],
          defaultValue: "none",
          admin: {
            position: "sidebar",
          },
        },
      ],
    },
  ],
};
