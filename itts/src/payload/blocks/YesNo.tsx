import type { Block } from "payload";
import { extraFields } from "../fields/extraFields";

export const YesNoBlock: Block = {
  slug: "yesNoNotGiven",
  fields: [
    {
      name: "questions",
      type: "array",
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
                { label: "Yes", value: "yes" },
                { label: "No", value: "no" },
                { label: "Not Given", value: "not_given" },
              ],
              enumName: "enum_yes_no_correct_answer",
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
