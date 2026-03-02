import { endOfDay, startOfDay } from "date-fns";
import type { CollectionConfig } from "payload";
import { checkRolePermission } from "../access";
import { convertToVietnamTime } from "../utilities/convertDate";

export const Coupons: CollectionConfig = {
  slug: "coupons",
  labels: { plural: "Ưu Đãi", singular: "Ưu Đãi" },
  access: checkRolePermission("coupons"),
  admin: {
    useAsTitle: "name",
    defaultColumns: ["name", "discount", "type", "startDate", "endDate"],
  },
  fields: [
    {
      name: "name",
      label: "Tên Ưu Đãi",
      type: "text",
      required: true,
    },
    {
      name: "discount",
      label: "Giảm giá",
      type: "number",
      required: true,
    },
    {
      name: "type",
      label: "Loại Ưu Đãi",
      type: "select",
      options: [
        { label: "Giảm tiền", value: "money" },
        { label: "Giảm phần trăm", value: "percent" },
      ],
      required: true,
      defaultValue: "percent",
    },
    {
      name: "startDate",
      label: "Ngày bắt đầu",
      type: "date",
      required: true,
      hooks: {
        beforeChange: [
          ({ value }) => {
            const date = convertToVietnamTime(value);
            return startOfDay(date);
          },
        ],
      },
      admin: {
        date: {
          displayFormat: "dd-MM-yyyy",
        },
      },
    },
    {
      name: "endDate",
      label: "Ngày kết thúc",
      type: "date",
      required: true,
      hooks: {
        beforeChange: [
          ({ value }) => {
            const date = convertToVietnamTime(value);
            return endOfDay(date);
          },
        ],
      },
      admin: {
        date: {
          displayFormat: "dd-MM-yyyy",
        },
      },
    },
  ],
};
