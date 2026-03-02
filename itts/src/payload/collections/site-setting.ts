// src/payload/collections/SiteSettings.ts
import type { CollectionConfig } from "payload";

const SiteSettings: CollectionConfig = {
  slug: "site-settings",
  admin: {
    useAsTitle: "siteName",
    group: "Settings",
  },
  fields: [
    {
      name: "siteName",
      type: "text",
      required: true,
      defaultValue: "Admin",
    },
  ],
};

export default SiteSettings;
