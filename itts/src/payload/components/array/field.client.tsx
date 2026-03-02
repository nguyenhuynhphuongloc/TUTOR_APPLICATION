"use client";

import { ArrayField } from "@payloadcms/ui";
import type { ArrayFieldClientComponent } from "payload";

import { cn } from "@/lib/utils";
import "./styles.scss";

const CustomArrayFieldClient: ArrayFieldClientComponent = (props) => {
  return (
    <div className={cn("field-type custom-array")}>
      <ArrayField {...props} />
    </div>
  );
};

export default CustomArrayFieldClient;
