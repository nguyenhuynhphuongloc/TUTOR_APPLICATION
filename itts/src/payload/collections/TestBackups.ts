import type { CollectionConfig } from "payload";
import { isAdmin } from "../access";

export const TestBackups: CollectionConfig = {
  slug: "test_backups",
  labels: { plural: "Test Backup", singular: "Test Backup" },
  // admin: {
  //   hidden: true,
  // },
  access: {
    read: isAdmin,
  },
  fields: [
    {
      name: "placementAttempt",
      label: "Placement Attempt",
      type: "relationship",
      relationTo: "placement_attempts",
      required: false,
      // admin: {
      //   hidden: true,
      // },
    },
    {
      name: "answerSheet",
      type: "json",
      required: false,
      // admin: {
      //   hidden: true,
      // },
    },
    {
      name: "statusDetails",
      type: "json",
      required: false,
      // admin: {
      //   hidden: true,
      // },
    },
    {
      name: "type",
      label: "Loại đề thi",
      type: "select",
      options: [
        { label: "Homework", value: "homework" },
        { label: "Periodic Test", value: "periodic" },
        { label: "Placement Test", value: "placement" },
      ],
      defaultValue: "periodic",
      required: true,
    },
  ],
};
