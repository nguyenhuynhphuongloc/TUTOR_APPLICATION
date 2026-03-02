/* eslint-disable @typescript-eslint/no-unsafe-argument */
"use server";

import Link from "next/link";
import { DefaultServerCellComponentProps } from "payload";

/* eslint-disable @typescript-eslint/no-unsafe-assignment */
const CellCustomer: React.FC<DefaultServerCellComponentProps> = async (req) => {
  const { cellData, payload, collectionConfig, rowData } = req;

  const adminRoute = payload.getAdminURL();

  if (!cellData) {
    return "";
  }
  const data = (await payload.findByID({
    collection: "users",
    id: cellData,
    depth: 2,
  })) as any;

  const href = collectionConfig?.slug
    ? `${adminRoute}/collections/${collectionConfig.slug}/${encodeURIComponent(rowData.id)}`
    : "";

  const {
    lead: { firstName, lastName, email, phone },
  } = data;

  return (
    <Link href={href}>
      <div>{`${lastName} ${firstName}`}</div>
      <div>{email}</div>
      <div>{phone}</div>
    </Link>
  );
};

export default CellCustomer;
