import { PLACEMENT_ATTEMPTS_STATUS_OPTIONS } from "@/constants";
import { tz } from "@date-fns/tz";
import { addSeconds, differenceInSeconds, format } from "date-fns";
import { type CollectionConfig } from "payload";
import { checkRolePermission } from "../access";

export const PeriodicTestAttempts: CollectionConfig = {
  slug: "periodic_test_attempts",
  labels: { plural: "Bài Thi", singular: "Bài Thi" },
  admin: {
    group: "Kiểm Tra Định Kỳ",
    defaultColumns: [
      "createdAt",
      "user",
      "type",
      "test",
      "status",
      "score",
      "completedAt",
    ],
    useAsTitle: "user",
    preview: (doc) => {
      return `${process.env.NEXT_PUBLIC_SERVER_URL}/test-result?attemptId=${doc.id as string}`;
    },
  },
  access: checkRolePermission("periodic_test_attempts"),
  defaultSort: "-createdAt",
  fields: [
    {
      type: "tabs",
      tabs: [
        {
          label: "Thông Tin",
          fields: [
            {
              type: "row",
              fields: [
                {
                  name: "user",
                  label: "Người Làm",
                  type: "relationship",
                  relationTo: "users",
                  required: true,
                  hasMany: false,
                  maxDepth: 1,
                  admin: {
                    width: "25%",
                    allowCreate: false,
                    allowEdit: false,
                    readOnly: true,
                  },
                },
                {
                  name: "test",
                  label: "Đề Thi",
                  type: "relationship",
                  relationTo: "periodic_tests",
                  required: true,
                  hasMany: false,
                  maxDepth: 2,
                  admin: {
                    width: "25%",
                    allowCreate: false,
                    allowEdit: false,
                    readOnly: true,
                  },
                  filterOptions: () => {
                    return {
                      _status: { equals: "published" },
                    };
                  },
                },
                {
                  name: "type",
                  label: "Loại đề thi",
                  type: "select",
                  options: [
                    { label: "Bài tập về nhà", value: "homework" },
                    { label: "Bài tập bổ trợ", value: "extra_homework" },
                    { label: "Mini test", value: "mini_test" },
                    { label: "Kiểm tra giữa kỳ", value: "mid_term" },
                    { label: "Kiểm tra cuối kỳ", value: "final_term" },
                    { label: "Kho đề", value: "bank" },
                    { label: "Kiểm tra đầu vào", value: "entrance_test" },
                  ],
                  defaultValue: "homework",
                  enumName: "test_types",
                  required: true,
                  admin: {
                    components: {
                      Cell: "@/payload/cell/CellSelectTestType",
                    },
                    readOnly: true,
                  },
                },
                {
                  name: "status",
                  label: "Trạng Thái",
                  type: "select",
                  options: PLACEMENT_ATTEMPTS_STATUS_OPTIONS,
                  defaultValue: "pending",
                  required: true,
                  admin: {
                    width: "25%",
                    readOnly: true,
                  },
                },
                {
                  name: "class",
                  label: "Lớp Học",
                  type: "relationship",
                  relationTo: "classes",
                  required: false,
                  hasMany: false,
                  admin: {
                    width: "25%",
                    allowCreate: false,
                    allowEdit: false,
                    readOnly: true,
                  },
                },
                {
                  name: "session",
                  label: "Buổi Học",
                  type: "number",
                  required: false,
                  admin: {
                    width: "25%",
                    readOnly: true,
                  },
                },
              ],
            },
            {
              type: "row",
              fields: [
                {
                  name: "score",
                  label: "Band score",
                  type: "relationship",
                  relationTo: "band_score",
                  required: false,
                  admin: {
                    width: "25%",
                    sortOptions: "score",
                  },
                },
                {
                  name: "startedAt",
                  label: "Bắt Đầu",
                  type: "date",
                  admin: {
                    width: "25%",
                    readOnly: true,
                    date: {
                      displayFormat: "dd/MM/yyyy HH:mm:ss",
                    },
                  },
                },
                {
                  name: "completedAt",
                  label: "Ngày Hoàn Thành",
                  type: "date",
                  admin: {
                    width: "25%",
                    readOnly: true,
                    date: {
                      displayFormat: "dd/MM/yyyy HH:mm:ss",
                    },
                  },
                },
                {
                  name: "duration",
                  label: "Thời Gian Làm Bài",
                  type: "text",
                  admin: {
                    width: "25%",
                    readOnly: true,
                  },
                  virtual: true,
                  hooks: {
                    afterRead: [
                      ({ data }) => {
                        if (!data?.completedAt || !data?.startedAt) return "";
                        const seconds = differenceInSeconds(
                          data.completedAt as string,
                          data.startedAt as string,
                        );
                        const durationDate = addSeconds(new Date(0), seconds, {
                          in: tz("UTC"),
                        });

                        return format(durationDate, "HH:mm:ss");
                      },
                    ],
                  },
                },
              ],
            },
            {
              type: "row",
              fields: [
                {
                  name: "mode",
                  label: "Mode",
                  type: "select",
                  options: [
                    { label: "Practice", value: "practice" },
                    { label: "Simulation", value: "simulation" },
                  ],
                  admin: {
                    width: "25%",
                    readOnly: true,
                    condition: (data) => data?.type === "bank",
                  },
                },
                {
                  name: "part",
                  type: "text",
                  admin: {
                    width: "25%",
                    readOnly: true,
                    condition: (data) => data?.mode === "practice",
                  },
                },
                {
                  name: "time",
                  type: "number",
                  admin: {
                    width: "25%",
                    readOnly: true,
                    condition: (data) => data?.mode === "practice",
                  },
                },
              ],
            },
            {
              name: "statusDetails",
              type: "json",
              required: false,
              defaultValue: {
                currentSkill: 0,
                completionTimes: {
                  listening: null,
                  reading: null,
                  writing: null,
                  speaking: null,
                },
              },
              admin: {
                hidden: true,
              },
            },
          ],
        },
        {
          label: "Bài Làm",
          fields: [
            {
              name: "answerSheet",
              type: "json",
              required: false,
              admin: {
                hidden: true,
              },
            },
            {
              name: "answerSheetUIFull",
              type: "ui",
              admin: {
                components: {
                  Field:
                    "@/payload/components/ui/answer-sheet-periodic.field#default",
                },
              },
            },
          ],
        },
      ],
    },
  ],
};
