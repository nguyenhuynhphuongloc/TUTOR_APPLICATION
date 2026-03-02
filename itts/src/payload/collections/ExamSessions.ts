/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import type { CollectionConfig } from "payload";

export const ExamSession: CollectionConfig = {
  slug: "exam_sessions",
  labels: { plural: "Đề Thi", singular: "Đề Thi" },
  admin: {},
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
  ],
};
