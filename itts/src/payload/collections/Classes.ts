/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable
  @typescript-eslint/no-unsafe-assignment,
  @typescript-eslint/no-unsafe-member-access,
  @typescript-eslint/no-unsafe-return
*/

import { SKILLS_OPTIONS } from "@/constants";
import type { CollectionConfig, Where } from "payload";
import { checkRolePermission, ROLES } from "../access";
import afterChangeClasses from "../hooks/afterChangeClasses";
import beforeChangeClasses from "../hooks/beforeChangeClasses";
import beforeDeleteClasses from "../hooks/beforeDeleteClasses";

export const Classes: CollectionConfig = {
  slug: "classes",
  labels: { plural: "Khai giảng lớp học", singular: "Khai giảng lớp học" },
  access: checkRolePermission("classes"),
  admin: {
    defaultColumns: [
      "name",
      "startDate",
      "branch",
      "teachers",
      "course",
      "status_class",
      "take_care",
    ],
    useAsTitle: "name",
  },
  hooks: {
    beforeChange: [beforeChangeClasses],
    afterChange: [afterChangeClasses],
    beforeDelete: [beforeDeleteClasses],
  },
  fields: [
    {
      type: "row",
      fields: [
        {
          name: "name",
          label: "Mã Lớp Học",
          type: "text",
          required: true,
        },
        {
          name: "course",
          label: "Khóa học",
          type: "relationship",
          relationTo: "courses",
        },
        {
          name: "startDate",
          label: "Ngày Khai Giảng",
          type: "date",
          required: true,
          admin: {
            date: {
              displayFormat: "dd/MM/yyyy",
            },
          },
        },
      ],
    },
    {
      name: "total_sessions",
      label: "Tổng số buổi học",
      type: "number",
      admin: { hidden: true },
      hooks: {
        beforeChange: [
          ({ siblingData }) => {
            delete siblingData.total_sessions;
          },
        ],
        afterRead: [
          ({ data }) => {
            return data?.course?.total_hours / data?.time_per_session;
          },
        ],
      },
    },
    {
      type: "row",
      fields: [
        {
          name: "days_of_week",
          label: "Ngày học trong tuần",
          type: "select",
          options: [
            { label: "Thứ 2", value: "1" },
            { label: "Thứ 3", value: "2" },
            { label: "Thứ 4", value: "3" },
            { label: "Thứ 5", value: "4" },
            { label: "Thứ 6", value: "5" },
            { label: "Thứ 7", value: "6" },
            { label: "Chủ nhật", value: "0" },
          ],
          hasMany: true,
          admin: {
            description:
              "Học vào những ngày nào trong tuần. Ví dụ: Thứ 2, Thứ 4, Thứ 6. Được chọn nhiều",
          },
        },
        {
          name: "session_time",
          label: "Thời gian học",
          type: "date",
          admin: {
            date: {
              pickerAppearance: "timeOnly",
            },
          },
        },
        {
          name: "time_per_session",
          label: "Thời gian mỗi buổi học ( tiếng )",
          type: "number",
          required: true,
        },
      ],
    },
    {
      type: "row",
      fields: [
        {
          name: "students",
          label: "Học viên",
          type: "relationship",
          relationTo: "users",
          hasMany: true,
          maxDepth: 3,
          // filterOptions: async ({ data, req: { payload } }) => {
          //   const { course } = data;
          //   if (!course) return {};
          //   const { docs } = await payload.find({
          //     collection: "orders",
          //     limit: 1000,
          //     where: {
          //       courses: { equals: course },
          //     },
          //   });
          //   console.log("🚀 ~ docs:", docs);
          //   const ids = docs.map((order: Order) => order.customer.id);
          //   const { docs: classes } = await payload.find({
          //     collection: "classes",
          //     limit: 1000,
          //     where: {
          //       course,
          //       status_class: { in: ["active", "closed"] },
          //     },
          //   });
          //   const studentStudiedIds = [
          //     ...new Set(
          //       classes.flatMap((item) =>
          //         item.students.map((student) => student.id),
          //       ),
          //     ),
          //   ];

          //   const studentAvailableIds = ids.filter(
          //     (id) => !studentStudiedIds.includes(id),
          //   );

          //   return {
          //     id: {
          //       in: studentAvailableIds,
          //     },
          //   };
          // },
        },
        {
          name: "status_class",
          label: "Trạng Thái Lớp",
          type: "select",
          options: [
            { label: "Chờ mở lớp", value: "pending" },
            { label: "Chờ duyệt", value: "approve_pending" },
            { label: "Đã mở", value: "opening" },
            { label: "Đang diễn ra", value: "active" },
            { label: "Kết thúc", value: "closed" },
          ],
        },
      ],
    },
    {
      type: "row",
      fields: [
        {
          name: "link_zoom",
          label: "Link zoom",
          type: "text",
        },
        {
          name: "branch",
          label: "Cơ sở",
          type: "relationship",
          relationTo: "branches",
        },
        {
          name: "room",
          label: "Phòng học",
          type: "relationship",
          relationTo: "rooms",
          admin: {
            condition: (data) => data?.branch,
          },
          filterOptions: async ({ data, req }): Promise<boolean | Where> => {
            if (!data?.branch) return true;

            const branchId =
              typeof data.branch === "object" ? data.branch.id : data.branch;

            const branchDoc = await req.payload.findByID({
              collection: "branches",
              id: branchId,
            });

            if (!branchDoc?.rooms?.length) {
              return false;
            }

            return {
              id: {
                in: branchDoc.rooms.map((room: any) => room.id || room),
              },
            };
          },
        },
      ],
    },

    {
      name: "teachers",
      label: "Giáo viên phụ trách",
      type: "array",
      labels: { singular: "Giáo viên", plural: "Giáo viên" },
      fields: [
        {
          type: "row",
          fields: [
            {
              name: "teacher",
              label: "Giáo viên",
              type: "relationship",
              relationTo: "admins",
              filterOptions: () => ({
                role: {
                  in: [ROLES.TEACHER_PART_TIME, ROLES.TEACHER_FULL_TIME],
                },
              }),
              admin: {
                description:
                  "Chọn giáo viên phụ trách cho lớp. Được chọn nhiều. Chỉ hiển thị giáo viên full-time và part-time",
              },
            },

            {
              name: "skill",
              label: "Kĩ năng",
              type: "select",
              hasMany: true,
              options: SKILLS_OPTIONS,
            },

            {
              name: "days_of_week",
              label: "Ngày dạy trong tuần",
              type: "select",
              options: [
                { label: "Thứ 2", value: "1" },
                { label: "Thứ 3", value: "2" },
                { label: "Thứ 4", value: "3" },
                { label: "Thứ 5", value: "4" },
                { label: "Thứ 6", value: "5" },
                { label: "Thứ 7", value: "6" },
                { label: "Chủ nhật", value: "0" },
              ],
              hasMany: true,
              admin: {
                description:
                  "Dạy vào những ngày nào trong tuần. Ví dụ: Thứ 2, Thứ 4, Thứ 6. Được chọn nhiều",
              },
            },
          ],
        },
      ],
    },

    {
      type: "array",
      name: "sessions",
      label: "Buổi học",
      labels: { singular: "Buổi học", plural: "Buổi học" },
      fields: [
        {
          type: "row",
          fields: [
            {
              name: "date",
              label: "Ngày học",
              type: "date",
              required: true,
              admin: {
                date: {
                  pickerAppearance: "dayAndTime",
                  displayFormat: "dd/MM/yyyy HH:mm",
                },
              },
            },
            {
              name: "link_recording",
              label: "Link Recording",
              type: "text",
            },
          ],
        },
        {
          type: "row",
          fields: [
            {
              name: "homework",
              label: "Bài tập về nhà",
              type: "relationship",
              hasMany: true,
              relationTo: "periodic_tests",
              filterOptions: () => ({ type: { equals: "homework" } }),
              admin: {
                width: `${100 / 3}%`,
              },
            },
            {
              name: "extra_homework",
              label: "Bài tập bổ trợ",
              type: "relationship",
              hasMany: true,
              relationTo: "periodic_tests",
              filterOptions: () => ({
                type: { equals: "extra_homework" },
              }),
              admin: {
                width: `${100 / 3}%`,
              },
            },
            {
              name: "final_test",
              label: "Bài thi cuối kỳ",
              type: "relationship",
              relationTo: "periodic_tests",
              hasMany: true,
              admin: {
                condition: (data, siblingData) => {
                  const index = data.sessions.findIndex(
                    (item: any) => item.id === siblingData.id,
                  );
                  const isFinalTerm = index === data.sessions.length - 1;
                  return isFinalTerm;
                },
              },
              filterOptions: () => ({
                type: { equals: "final_term" },
              }),
            },
            {
              name: "mid_test",
              label: "Bài thi giữa kỳ",
              type: "relationship",
              relationTo: "periodic_tests",
              hasMany: true,
              admin: {
                condition: (data, siblingData) => {
                  const index = data.sessions.findIndex(
                    (item: any) => item.id === siblingData.id,
                  );
                  const isMidTerm =
                    index === Math.floor(data.sessions.length / 2) - 1;
                  return isMidTerm;
                },
              },
              filterOptions: () => ({
                type: { equals: "mid_term" },
              }),
            },
          ],
        },
      ],
    },
    {
      type: "array",
      name: "roadmaps",
      label: "Roadmap",
      fields: [
        {
          type: "row",
          fields: [
            {
              name: "skill",
              label: "Kĩ năng",
              type: "select",
              options: SKILLS_OPTIONS,
            },
            {
              name: "content",
              label: "Nội dung",
              type: "textarea",
              required: true,
            },
          ],
        },
      ],
    },
    {
      name: "take_care",
      label: "Chăm sóc",
      type: "ui",
      admin: {
        condition: ({ user }) =>
          [ROLES.HOC_VU_MANAGER, ROLES.HOC_VU_EXECUTIVE].includes(user?.role),
        components: {
          Cell: "@/payload/cell/TakeCareButton",
        },
      },
    },
  ],
};
