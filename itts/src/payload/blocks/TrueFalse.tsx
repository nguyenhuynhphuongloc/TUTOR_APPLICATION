import type { Block } from "payload";
import { extraFields } from "../fields/extraFields";

export const TrueFalseBlock: Block = {
  slug: "trueFalseNotGiven",
  fields: [
    {
      name: "questions",
      type: "array",
      admin: {
        components: {
          // Field: "@/payload/components/array/field.client",
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
                width: "15%",
              },
            },
            {
              name: "correctAnswer",
              type: "select",
              required: true,
              options: [
                { label: "True", value: "true" },
                { label: "False", value: "false" },
                { label: "Not Given", value: "not_given" },
              ],
              enumName: "enum_true_false_correct_answer",
              admin: {
                width: "25%",
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
