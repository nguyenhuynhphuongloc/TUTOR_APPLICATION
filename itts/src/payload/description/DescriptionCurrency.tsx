"use client";
import formatCurrency from "@/payload/utilities/formatCurrency";
import { useFormFields } from "@payloadcms/ui";

const DescriptionCurrency = ({ path }: { path: string }) => {
  const field = useFormFields(([fields]) => (fields && fields?.[path]) ?? null);
  const { value } = field ?? {};

  const formattedValue =
    value === null || value === undefined
      ? ""
      : formatCurrency(value as number);

  return <div>{formattedValue}</div>;
};
export default DescriptionCurrency;
