import type { Block } from "payload";
import { extraFields } from "../fields/extraFields";

export const MatchingHeadingBlock: Block = {
  slug: "matchingHeading",
  fields: [
    {
      type: "text",
      name: "matchingLabel",
      defaultValue: "List of Headings",
      admin: {
        hidden: true,
      },
    },
    {
      label: "List of Headings",
      name: "options",
      type: "array",
      admin: {
        components: {
          Field: "@/payload/components/array/field.client",
        },
      },
      minRows: 1,
      maxRows: 20,
      fields: [
        {
          type: "row",
          fields: [
            {
              name: "value",
              type: "text",
              required: true,
              admin: {
                width: "20%",
              },
            },
            {
              name: "label",
              type: "text",
              required: true,
              admin: {
                width: "80%",
              },
            },
          ],
        },
      ],
    },
    {
      name: "questions",
      type: "array",
      admin: {
        components: {
          Field: "@/payload/components/array/field.client",
        },
      },
      required: true,
      minRows: 1,
      maxRows: 40,
      fields: [
        {
          type: "row",
          fields: [
            {
              label: "Question No.",
              name: "questionNumber",
              type: "number",
              required: true,
              admin: {
                width: "20%",
              },
            },
            {
              name: "correctAnswer",
              type: "text",
              required: true,
              admin: {
                width: "20%",
              },
            },
            {
              name: "question",
              type: "text",
              required: true,
              admin: {
                width: "60%",
              },
            },
          ],
        },
        {
          type: "row",
          fields: [
            {
              name: "answerLocation",
              type: "textarea",
              admin: {
                width: "50%",
              },
            },
            {
              name: "explanation",
              type: "textarea",
              admin: {
                width: "50%",
              },
            },
          ],
        },
        { ...extraFields },
      ],
    },
  ],
};
