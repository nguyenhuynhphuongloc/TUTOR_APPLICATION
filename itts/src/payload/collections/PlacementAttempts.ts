import { PLACEMENT_ATTEMPTS_STATUS_OPTIONS } from "@/constants";
import { tz } from "@date-fns/tz";
import { addSeconds, differenceInSeconds, format } from "date-fns";
import { type CollectionConfig } from "payload";
import { checkRolePermission } from "../access";

export const PlacementAttempts: CollectionConfig = {
  slug: "placement_attempts",
  labels: { plural: "Bài Thi", singular: "Bài Thi" },
  admin: {
    group: "Kiểm Tra Đầu Vào",
    defaultColumns: [
      "createdAt",
      "user",
      "type",
      "test",
      "status",
      "score",
      "completedAt",
    ],
    preview: (doc) => {
      return `${process.env.NEXT_PUBLIC_SERVER_URL}/placement-tests/test-result?attemptId=${doc.id as string}`;
    },
  },
  access: checkRolePermission("placement_attempts"),
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
                  relationTo: "leads",
                  required: true,
                  hasMany: false,
                  maxDepth: 0,
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
                  relationTo: "placement_tests",
                  required: true,
                  hasMany: false,
                  maxDepth: 0,
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
                  label: "Loại Bài",
                  type: "text",
                  required: true,
                  admin: {
                    width: "25%",
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
                timeLeft: {
                  listening: null,
                  reading: null,
                  writing: null,
                  speaking: null,
                },
              },
              admin: {
                condition: (_, siblingData) => siblingData.type === "full",
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
              name: "answerSheetUIMini",
              type: "ui",
              admin: {
                condition: (_, siblingData) => siblingData.type === "mini",
                components: {
                  Field: "@/payload/components/ui/answer-sheet.field#default",
                },
              },
            },

            {
              name: "answerSheetUIFull",
              type: "ui",
              admin: {
                condition: (_, siblingData) => siblingData.type === "full",
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
