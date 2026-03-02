import { LEAD_TYPE } from "@/constants";
import type { CollectionConfig } from "payload";
import { checkRolePermission } from "../access";
import afterChangeLeads from "../hooks/afterChangeLeads";
import { convertToVietnamTime } from "../utilities/convertDate";

const STATUS_OPTIONS = [
  { label: "Chờ Gọi", value: "waiting_for_call" },
  { label: "Đã Book Test", value: "test_booked" },
  { label: "Chưa Book Test", value: "test_not_booked" },
  { label: "Tiềm Năng", value: "potential" },
  { label: "Không Tiềm Năng", value: "not_potential" },
  { label: "Đã Thanh Toán", value: "paid_case" },
  { label: "Thất Bại", value: "failed_case" },
  { label: "Consider", value: "consider" },
];

const SOURCE_OPTIONS = [
  { label: "Facebook", value: "facebook" },
  { label: "Google", value: "google" },
  { label: "Hotline", value: "hotline" },
  { label: "Walking", value: "walking" },
  { label: "Referral", value: "referral" },
  { label: "Seeding", value: "seeding" },
  { label: "School Tour", value: "school_tour" },
  { label: "Sponsorship", value: "sponsorship" },
  { label: "Re-enroll", value: "re_enroll" },
  { label: "Website", value: "from_website" },
  { label: "Khác", value: "other" },
];

export const Leads: CollectionConfig = {
  slug: "leads",
  admin: {
    defaultColumns: [
      "fullName",
      "createdAt",
      "source",
      "phone",
      "type",
      "saleInCharge",
      "branch",
      "status",
    ],
    useAsTitle: "fullName",
  },
  access: checkRolePermission("leads"),
  hooks: {
    beforeChange: [
      ({ data, context }) => {
        context.coupon = data.coupon;
        context.courses = data.courses;

        delete data.coupon;
        delete data.courses;

        return data;
      },
    ],
    afterChange: [afterChangeLeads],
  },
  fields: [
    {
      type: "row",
      fields: [
        {
          name: "title",
          type: "text",
          admin: {
            hidden: true,
          },
          hooks: {
            afterRead: [
              ({ data }) => {
                if (!data) {
                  return "[Chưa có tiêu đề]";
                }
                if (!data.fullName) {
                  return `${data?.id}`;
                }
                return `${data?.fullName}${data?.phone ? ` - ${data?.phone}` : ""}`;
              },
            ],
          },
        },
        {
          name: "fullName",
          label: "Họ và tên",
          type: "text",
          admin: {
            width: "25%",
            components: {
              Cell: "@/payload/cell/CellFullName",
            },
          },
          // hooks: {
          //   afterRead: [
          //     ({ data }) => {
          //       if (!data) {
          //         return "[Chưa có tiêu đề]";
          //       }
          //       if (!data.fullName) {
          //         return `${data?.id}`;
          //       }
          //       return `${data?.fullName}${data?.phone ? ` - ${data?.phone}` : ""}`;
          //     },
          //   ],
          // },
        },
        {
          name: "phone",
          label: "SDT",
          type: "text",
          unique: true,
          admin: {
            width: "25%",
          },
        },
        {
          name: "email",
          type: "text",
          admin: {
            width: "25%",
          },
        },
        {
          name: "gender",
          label: "Giới tính",
          type: "select",
          options: [
            { label: "Nam", value: "male" },
            { label: "Nữ", value: "female" },
          ],
          admin: {
            width: "25%",
          },
        },
      ],
    },
    {
      type: "row",
      fields: [
        {
          name: "parent name",
          label: "Tên Phụ Huynh",
          type: "text",
          admin: {
            width: "25%",
          },
        },
        {
          name: "parent phone",
          label: "SDT Phụ Huynh",
          type: "text",
          admin: {
            width: "25%",
          },
        },
        {
          name: "parent email",
          label: "Email Phụ Huynh",
          type: "text",
          admin: {
            width: "25%",
          },
        },
        {
          name: "date_of_birth",
          label: "Ngày sinh",
          type: "date",
          // defaultValue: convertToVietnamTime(new Date()),
        },
      ],
    },
    {
      type: "row",
      fields: [
        {
          name: "link_facebook",
          label: "Link Facebook",
          type: "text",
          admin: {
            width: "25%",
          },
        },
        {
          name: "address",
          label: "Địa chỉ",
          type: "text",
          admin: {
            width: "25%",
          },
        },
        {
          name: "type",
          label: "Đối tượng",
          type: "select",
          options: LEAD_TYPE,
          admin: {
            width: "25%",
          },
        },
      ],
    },
    {
      type: "row",
      fields: [
        {
          name: "target",
          type: "number",
          admin: {
            width: "25%",
          },
        },
        {
          name: "purpose",
          label: "Mục tiêu học",
          type: "text",
          admin: {
            width: "25%",
          },
        },
        {
          name: "branch",
          label: "Cơ sở kiểm tra đầu vào",
          type: "relationship",
          relationTo: "branches",
          admin: {
            width: "50%",
          },
        },
      ],
    },
    {
      type: "row",
      fields: [
        {
          name: "source",
          label: "Nguồn",
          type: "select",
          options: SOURCE_OPTIONS,
          required: true,
          admin: {
            width: "50%",
          },
        },
        {
          name: "saleInCharge",
          label: "Sale phụ trách",
          type: "relationship",
          relationTo: "admins",
          filterOptions: {
            role: {
              equals: "sale",
            },
          },
          admin: {
            width: "50%",
          },
        },
      ],
    },
    {
      type: "row",
      fields: [
        {
          name: "status",
          label: "Trạng thái Lead",
          type: "select",
          options: STATUS_OPTIONS,
          admin: {
            width: "25%",
          },
        },
        {
          name: "courses",
          label: "Khóa học Lead mua",
          type: "text",
          admin: {
            components: {
              Field: "@/components/select/SelectCourse",
            },
            disableListColumn: true,
            disableListFilter: true,
          },
        },
        {
          name: "coupon",
          label: "Mã ưu đãi",
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
          admin: {
            condition: ({ courses, status }): boolean =>
              Boolean(courses && status === "paid_case"),
            disableListColumn: true,
            disableListFilter: true,
          },
        },
      ],
    },
    {
      name: "notes",
      label: "Ghi Chú",
      type: "array",
      admin: {
        components: {
          Cell: "@/payload/cell/CellNotes",
        },
      },
      fields: [
        {
          type: "row",
          fields: [
            {
              name: "channel_interaction",
              label: "Loại kênh tương tác",
              type: "select",
              options: [
                {
                  label: "Zalo",
                  value: "zalo",
                },
                {
                  label: "Phone",
                  value: "phone",
                },
                {
                  label: "Fanpage",
                  value: "fanpage",
                },
                {
                  label: "Tổng đài",
                  value: "hotline",
                },
                {
                  label: "Chat Trực Tiếp",
                  value: "direct_message",
                },
                {
                  label: "Online",
                  value: "online",
                },
              ],
            },
            {
              name: "appointment_date",
              label: "Lịch hẹn tiếp theo",
              type: "date",
            },
            {
              name: "status",
              label: "Trạng Thái",
              type: "select",
              options: STATUS_OPTIONS,
            },
          ],
        },
        {
          name: "message",
          label: "Ghi chú",
          type: "textarea",
          admin: {
            rows: 8,
            style: {
              minWidth: 300,
              width: 400,
            },
          },
        },
        {
          name: "createdAt",
          type: "date",
          defaultValue: convertToVietnamTime(new Date()),
          admin: {
            hidden: true,
          },
        },
        {
          name: "createdBy",
          type: "relationship",
          relationTo: "admins",
          defaultValue: ({ req: { user } }) => user?.id,
          admin: {
            hidden: true,
          },
        },
      ],
    },
    {
      name: "chats",
      label: "Đoạn hội thoại",
      type: "array",
      fields: [
        {
          name: "createdBy",
          type: "relationship",
          relationTo: "admins",
          defaultValue: ({ req: { user } }) => user?.id,
          admin: {
            hidden: true,
          },
        },
        {
          name: "message",
          type: "textarea",
          admin: {
            rows: 8,
          },
        },
        {
          name: "createdAt",
          type: "date",
          defaultValue: convertToVietnamTime(new Date()),
          admin: {
            hidden: true,
          },
        },
      ],
    },
  ],
};
