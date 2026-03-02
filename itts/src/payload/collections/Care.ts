import type { CollectionConfig } from "payload";

export const StudentCare: CollectionConfig = {
  slug: "student_care",
  labels: {
    singular: "Quy trình Chăm sóc",
    plural: "Quy trình Chăm sóc",
  },
  admin: {
    useAsTitle: "class",
    defaultColumns: ["student", "class", "status", "updatedAt"],
    hidden: true,
  },
  fields: [
    {
      type: "row",
      fields: [
        {
          name: "class",
          label: "Lớp học",
          type: "relationship",
          relationTo: "classes",
          required: true,
          maxDepth: 1,
          admin: { width: "50%", readOnly: true },
        },
      ],
    },
    {
      name: "care_data",
      type: "json",
      admin: { hidden: true },
    },
    {
      name: "careUI",
      type: "ui",
      admin: {
        components: { Field: "@/payload/components/ui/care.field#default" },
      },
    },
  ],
};

export default StudentCare;
