import type { Block } from "payload";
import { extraFields } from "../fields/extraFields";

export const ChooseTitleBlock: Block = {
  slug: "chooseTitle",
  fields: [
    {
      name: "questions",
      type: "array",
      required: true,
      minRows: 1,
      maxRows: 40,
      fields: [
        {
          type: "tabs",
          tabs: [
            {
              label: "Question",
              fields: [
                {
                  type: "row",
                  fields: [
                    {
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
                        width: "80%",
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
            {
              label: "Answer",
              fields: [
                {
                  name: "answer",
                  type: "array",
                  required: true,
                  minRows: 1,
                  maxRows: 4,
                  fields: [
                    {
                      type: "row",
                      fields: [
                        {
                          name: "answer",
                          type: "text",
                          required: true,
                          admin: {
                            width: "80%",
                          },
                        },
                        {
                          name: "correctAnswer",
                          type: "checkbox",
                          required: true,
                          admin: {
                            width: "20%",
                          },
                        },
                      ],
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    },
  ],
};
