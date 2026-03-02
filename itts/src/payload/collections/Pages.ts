import type { CollectionConfig } from "payload";

import { slugField } from "@payload-fields/slug";

export const Pages: CollectionConfig = {
  slug: "pages",
  admin: {
    defaultColumns: ["title", "slug", "updatedAt"],
    useAsTitle: "title",
    hidden: true,
  },
  fields: [
    {
      name: "title",
      type: "text",
      required: true,
    },
    ...slugField(),
  ],
  versions: {
    drafts: true,
  },
};
