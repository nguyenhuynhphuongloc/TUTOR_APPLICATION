/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
// components/AsyncSelect.tsx
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useEffect, useState } from "react";
import { FormControl } from "../ui/form";

interface AsyncSelectProps {
  value?: string;
  onChange: (val: string) => void;
  apiUrl?: string;
  fetchData?: () => Promise<any[]>;
  labelKey?: string;
  valueKey?: string;
  extraOptions?: { label: string; value: string }[];
  placeholder?: string;
  disabled?: boolean;
}

export function AsyncSelect({
  value,
  onChange,
  apiUrl,
  fetchData,
  labelKey = "label",
  valueKey = "value",
  extraOptions = [],
  placeholder = "Select...",
  disabled = false,
}: AsyncSelectProps) {
  const [options, setOptions] = useState<{ label: string; value: string }[]>(
    [],
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadOptions() {
      try {
        let data: any[] = [];
        if (fetchData) {
          data = await fetchData();
        } else if (apiUrl) {
          const res = await fetch(apiUrl);
          const { docs } = await res.json();
          data = docs;
        }
        const mapped = data.map((item) => ({
          label: item[labelKey],
          value: item[valueKey],
        }));
        setOptions([...mapped, ...extraOptions]);
      } catch (err) {
        throw new Error(err.message);
      } finally {
        setLoading(false);
      }
    }
    loadOptions();
  }, [apiUrl]);

  return (
    <Select
      onValueChange={onChange}
      value={value}
      disabled={disabled || loading}
    >
      <FormControl>
        <SelectTrigger className="w-full rounded-[12px]">
          <SelectValue placeholder={loading ? "Loading..." : placeholder} />
        </SelectTrigger>
      </FormControl>
      <SelectContent>
        {options.map((opt) => (
          <SelectItem key={opt.value} value={opt.value}>
            {opt.label}
          </SelectItem>
        ))}
        {options.length === 0 && (
          <p className="text-center">No options available</p>
        )}
      </SelectContent>
    </Select>
  );
}
