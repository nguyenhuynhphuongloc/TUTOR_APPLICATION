import type { Block } from "payload";
import { extraFields } from "../fields/extraFields";

export const MatchingNameBlock: Block = {
  slug: "matchingName",
  fields: [
    {
      name: "options",
      type: "array",
      minRows: 1,
      maxRows: 40,
      fields: [
        {
          name: "option",
          type: "text",
          required: true,
        },
      ],
    },
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
