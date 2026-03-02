import type { Field } from "payload";

export const extraFields: Field = {
  type: "row",
  // admin: {
  //   condition: (data) => data?.test_type !== "entrance_test",
  // },
  fields: [
    {
      name: "questionTitle",
      label: "Tiêu đề câu hỏi",
      type: "text",
      admin: {
        width: "50%",
      },
    },
    {
      name: "locationParagraph",
      label: "Vị trí đoạn văn",
      type: "text",
      admin: {
        condition: (data) => {
          return data?.type === "reading";
        },
        width: "50%",
      },
    },
    {
      name: "locateTime",
      label: "Thời gian",
      type: "text",
      admin: {
        components: {
          Field: "@/components/field/TimeInputField",
        },
        condition: (data) => {
          return data?.type === "listening";
        },
        width: "50%",
      },
    },
  ],
};
