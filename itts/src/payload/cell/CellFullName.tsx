/* eslint-disable @typescript-eslint/no-unsafe-argument */
"use server";

import Link from "next/link";
import type { DefaultServerCellComponentProps } from "payload";

/* eslint-disable @typescript-eslint/no-unsafe-assignment */
const CellCustomer: React.FC<DefaultServerCellComponentProps> = async (req) => {
  const { cellData, payload, collectionConfig, rowData } = req;

  const adminRoute = payload.getAdminURL();

  if (!cellData) {
    return "";
  }
  const href = collectionConfig?.slug
    ? `${adminRoute}/collections/${collectionConfig.slug}/${encodeURIComponent(rowData.id)}`
    : "";

  return (
    <Link href={href}>
      <div>{cellData}</div>
      <div>{rowData.phone}</div>
    </Link>
  );
};

export default CellCustomer;
