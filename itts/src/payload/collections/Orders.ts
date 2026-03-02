/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import type { CollectionConfig } from "payload";
import { checkRolePermission } from "../access";

export const Orders: CollectionConfig = {
  slug: "orders",
  labels: { singular: "Đơn Hàng", plural: "Đơn Hàng" },
  access: checkRolePermission("orders"),
  admin: {
    useAsTitle: "customer",
    defaultColumns: [
      "name",
      "customer",
      "courses",
      "coupon",
      "status",
      "note",
      "saleInCharge",
      "createdAt",
    ],
  },
  defaultPopulate: { courses: true, coupon: true, customer: true },
  fields: [
    {
      name: "customer",
      type: "relationship",
      relationTo: "users",
      admin: {
        components: {
          Cell: "@/payload/cell/CellCustomer",
        },
      },
    },
    {
      type: "row",
      fields: [
        {
          name: "courses",
          type: "relationship",
          relationTo: "courses",
          hasMany: true,
          admin: {
            components: {
              Field: "@/components/select/SelectCourse",
              Cell: "@/payload/cell/CellCourses",
            },
          },
        },
        {
          name: "coupon",
          type: "relationship",
          relationTo: "coupons",
          hasMany: true,
          filterOptions: () => {
            const date = new Date();
            return {
              startDate: { less_than_equal: date },
              endDate: { greater_than_equal: date },
            };
          },
        },
        {
          name: "status",
          type: "select",
          options: [
            {
              label: "Full Paid",
              value: "full",
            },
            {
              label: "Installment",
              value: "installment",
            },
          ],
        },
      ],
    },
    {
      name: "note",
      type: "textarea",
    },
    {
      name: "saleInCharge",
      type: "text",
      admin: {
        readOnly: true,
        hidden: true,
        components: {
          Cell: "@/payload/cell/CellSaleIncharge",
        },
      },
    },
  ],
};
