import type { Block } from "payload";
import { extraFields } from "../fields/extraFields";

export const MatchingParagraphInfoBlock: Block = {
  slug: "matchingParagraphInfo",
  fields: [
    {
      label: "From A to ?",
      name: "options",
      type: "text",
      required: true,
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
              name: "question",
              type: "text",
              required: true,
              admin: {
                width: "60%",
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
          ],
        },
        {
          name: "answerLocation",
          type: "textarea",
        },
        { ...extraFields },
      ],
    },
  ],
};
