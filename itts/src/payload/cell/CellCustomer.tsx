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

  // cellData should now be populated thanks to defaultPopulate in Orders.ts
  // We need to handle cases where it might still be an ID (loading, error, etc) strictly typing it would be better but for now we check safely.
  const customer = cellData as any;

  if (typeof customer !== 'object' || !customer?.lead) {
    // Fallback or just return ID if not populated for some reason
    return <div>{typeof customer === 'string' ? customer : 'Unknown'}</div>
  }

  const href = collectionConfig?.slug
    ? `${adminRoute}/collections/${collectionConfig.slug}/${encodeURIComponent(rowData.id)}`
    : "";

  const {
    lead: { fullName, email, phone },
  } = customer;

  return (
    <Link href={href}>
      <div>{fullName}</div>
      <div>{email}</div>
      <div>{phone}</div>
    </Link>
  );
};

export default CellCustomer;
