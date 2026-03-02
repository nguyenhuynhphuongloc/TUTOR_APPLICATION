import type { Field } from "payload";
import { editorField } from "../editor";

const SPEAKING_TYPE_OPTIONS = [
  { label: "Part 1", value: "1" },
  { label: "Part 2", value: "2" },
  { label: "Part 3", value: "3" },
];

export const speakingField: Field = {
  name: "speaking",
  type: "array",
  admin: {
    condition: (data) => {
      return data?.type === "speaking";
    },
  },
  label: "Questions",
  labels: {
    singular: "Part",
    plural: "Part",
  },
  minRows: 1,
  maxRows: 3,
  fields: [
    {
      type: "tabs",
      tabs: [
        {
          label: "Info",
          fields: [
            {
              name: "sectionType",
              type: "select",
              options: SPEAKING_TYPE_OPTIONS,
              required: true,
            },
          ],
        },
        {
          label: "Content",
          fields: [
            {
              name: "Topics",
              type: "array",
              required: true,
              minRows: 1,
              fields: [
                {
                  name: "topic",
                  label: "Topic Name",
                  type: "text",
                  required: true,
                },
                {
                  name: "questions",
                  type: "array",
                  required: true,
                  minRows: 1,
                  fields: [
                    {
                      name: "question",
                      type: "text",
                      required: true,
                    },
                    editorField({ name: "brainstorm", label: "Brainstorm" }),
                    {
                      type: "row",
                      fields: [
                        {
                          name: "sampleBelow7",
                          label: "Sample < 7",
                          type: "textarea",
                        },
                        {
                          name: "sampleAbove7",
                          label: "Sample > 7",
                          type: "textarea",
                        },
                      ],
                    },
                    {
                      name: "vocabs",
                      label: "Từ vựng",
                      type: "relationship",
                      relationTo: "words",
                      hasMany: true,
                    },
                  ],
                },
                editorField({
                  label: "You should say",
                  name: "you_should_say",
                }),
              ],
            },
          ],
        },
      ],
    },
  ],
};
