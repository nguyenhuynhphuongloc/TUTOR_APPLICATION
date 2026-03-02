import type { Block } from "payload";
import { extraFields } from "../fields/extraFields";

export const MultipleChoiceBlock: Block = {
  slug: "multipleChoice",
  fields: [
    {
      name: "questions",
      type: "array",
      required: true,
      minRows: 1,
      maxRows: 40,
      fields: [
        {
          name: "question",
          type: "text",
          required: true,
        },
        {
          name: "answer",
          type: "array",
          admin: {
            components: {
              Field: "@/payload/components/array/field.client",
            },
          },
          required: true,
          minRows: 1,
          maxRows: 10,
          defaultValue: [
            { answer: "", correctAnswer: false },
            { answer: "", correctAnswer: false },
            { answer: "", correctAnswer: false },
            { answer: "", correctAnswer: false },
          ],
          fields: [
            {
              type: "row",
              fields: [
                {
                  name: "answer",
                  type: "text",
                  required: true,
                  admin: {
                    width: "65%",
                  },
                },
                {
                  name: "correctAnswer",
                  type: "checkbox",
                  required: true,
                  admin: {
                    width: "35%",
                  },
                },
              ],
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
