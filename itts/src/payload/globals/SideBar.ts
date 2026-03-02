import type { GlobalConfig } from "payload";

import link from "@payload-fields/link";

export const SideBar: GlobalConfig = {
  slug: "side-bar",
  admin: {
    hidden: true,
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      access: {
        read: () => true,
      },
      name: "navItems",
      type: "array",
      fields: [
        link({
          appearances: false,
        }),
      ],
      maxRows: 6,
    },
  ],
};
