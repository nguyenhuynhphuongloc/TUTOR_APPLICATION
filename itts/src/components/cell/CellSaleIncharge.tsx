"use server";

import type { DefaultServerCellComponentProps } from "payload";

/* eslint-disable @typescript-eslint/no-unsafe-assignment */
const CellSaleIncharge: React.FC<DefaultServerCellComponentProps> = async (
  req,
) => {
  const { rowData, payload } = req;

  if (!rowData.customer) {
    return "";
  }
  const data = (await payload.findByID({
    collection: "users",
    id: rowData.customer,
    depth: 2,
  })) as any;

  const {
    lead: {
      saleInCharge: { fullName, email, phone },
    },
  } = data;

  return (
    <div>
      <div>{fullName}</div>
      <div>{email}</div>
      <div>{phone}</div>
    </div>
  );
};

export default CellSaleIncharge;
