import type { CollectionConfig } from "payload";
import { FieldAccess } from "payload";
import {
  checkRolePermission,
  DEPARTMENT_OPTIONS,
  DEPARTMENT_ROLES,
  ROLE_OPTIONS,
  ROLES,
} from "../access";

const isAdminOrHRField: FieldAccess = ({ req: { user } }) => {
  return user?.role === ROLES.ADMIN || user?.role === ROLES.HR_MANAGER;
};

export const Admins: CollectionConfig = {
  slug: "admins",
  labels: { plural: "Nhân Viên", singular: "Nhân Viên" },
  admin: {
    useAsTitle: "fullName",
    group: "Hệ thống",
  },
  auth: {
    tokenExpiration: 60 * 60 * 24 * 30,
    lockTime: 60 * 1,
    loginWithUsername: {
      allowEmailLogin: true,
      requireEmail: false,
    },
  },
  access: checkRolePermission("admins"),
  fields: [
    {
      type: "row",
      fields: [
        {
          name: "department",
          type: "select",
          required: true,
          options: DEPARTMENT_OPTIONS,
          admin: {
            width: "50%",
          },
          access: {
            update: isAdminOrHRField,
          },
        },
        {
          name: "role",
          type: "select",
          required: true,
          options: ROLE_OPTIONS,
          filterOptions: ({ data, req: { user } }) => {
            const department = data?.department;
            if (!department) return [];
            const allowedRoles = DEPARTMENT_ROLES[department] || [];
            if (department === "ceo") {
              if (user?.role === ROLES.ADMIN) {
                return ROLE_OPTIONS.filter((opt) => opt.value === ROLES.ADMIN);
              }
              return [];
            }
            return ROLE_OPTIONS.filter((opt) =>
              allowedRoles.includes(opt.value as any),
            );
          },
          admin: {
            width: "50%",
            condition: (data) => !!data?.department,
          },
          access: {
            update: isAdminOrHRField,
          },
        },
      ],
    },
    {
      type: "row",
      fields: [
        {
          name: "fullName",
          type: "text",
          required: true,
          admin: {
            width: "50%",
          },
        },
        {
          name: "phone",
          type: "text",
          required: true,
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
          name: "birthday",
          type: "date",
          admin: {
            width: "50%",
            date: {
              displayFormat: "dd/MM/yyyy",
            },
          },
        },
        {
          name: "working_date",
          label: "Ngày bắt đầu làm việc",
          type: "date",
          admin: {
            width: "50%",
            date: {
              displayFormat: "dd/MM/yyyy",
            },
          },
          access: {
            update: isAdminOrHRField,
          },
        },
      ],
    },
    {
      name: "address",
      type: "text",
    },
    {
      name: "email",
      type: "email",
      access: {
        update: isAdminOrHRField,
      },
    },
    {
      name: "username",
      type: "text",
      access: {
        update: isAdminOrHRField,
      },
    },
    {
      name: "lockUntil",
      type: "date",
      admin: {
        readOnly: true,
      },
      access: {
        update: isAdminOrHRField,
      },
    },
    {
      name: "availability",
      label: "Thời gian rảnh của WOW",
      type: "array",
      admin: {
        condition: (data) => data?.role === "wow",
      },
      fields: [
        {
          type: "row",
          fields: [
            {
              name: "start_date",
              label: "Thời gian rảnh ( bắt đầu )",
              type: "date",
              required: true,
              admin: {
                date: {
                  displayFormat: "dd/MM/yyyy HH:mm",
                  pickerAppearance: "dayAndTime",
                },
                description:
                  "Chọn ngày rảnh của WOW để học sinh có thể book. Ví dụ bắt đầu vào ngày 01/01/2025 9:00 và kết thúc vào ngày 01/01/2025 17:00. Có thể chọn nhiều khung giờ khác nhau cùng ngày nếu như ngày đó WOW rảnh vào nhiều khung giờ",
                width: "50%",
              },
            },
            {
              name: "end_date",
              label: "Thời gian rảnh ( kết thúc )",
              type: "date",
              required: true,
              admin: {
                width: "50%",
                date: {
                  displayFormat: "dd/MM/yyyy HH:mm",
                  pickerAppearance: "dayAndTime",
                },
              },
            },
          ],
        },
      ],
    },
  ],
};
