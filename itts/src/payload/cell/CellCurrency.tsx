"use client";
import formatCurrency from "@/payload/utilities/formatCurrency";

const CellCurrency = ({ cellData }: { cellData: any }) => {
  const formattedValue =
    cellData === null || cellData === undefined
      ? ""
      : formatCurrency(cellData as number);

  return <div>{formattedValue}</div>;
};
export default CellCurrency;
