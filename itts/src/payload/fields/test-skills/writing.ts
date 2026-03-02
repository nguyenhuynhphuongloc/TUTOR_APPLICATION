import type { Field } from "payload";
import { editorField } from "../editor";

const WRITING_TYPE_OPTIONS = [
  { label: "Task 1", value: "1" },
  { label: "Task 2", value: "2" },
];

export const writingField: Field = {
  type: "row",
  admin: {
    condition: (data) => {
      return data?.type === "writing";
    },
  },
  fields: [
    {
      name: "writing",
      type: "array",
      admin: { className: "w-full" },
      required: true,
      label: "Tasks",
      labels: {
        singular: "Task",
        plural: "Task",
      },
      minRows: 1,
      maxRows: 5,
      fields: [
        {
          name: "writingType",
          type: "select",
          options: WRITING_TYPE_OPTIONS,
          required: true,
        },
        editorField({
          name: "description",
          label: "Description",
          required: true,
        }),

        {
          name: "image",
          type: "upload",
          relationTo: "media",
        },
        editorField({ name: "content", label: "Content", required: true }),
        editorField({ name: "brainstorm", label: "Brainstorm" }),
        {
          name: "sample",
          type: "textarea",
        },
      ],
    },
  ],
};
