/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-floating-promises */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
"use client";

import { Input } from "@/components/ui/input";
import { Word } from "@/containers/vocabulary/Columns";
import useDebounce from "@/hooks/useDebounce";
import { cn } from "@/lib/utils";
import { stringify } from "qs-esm";
import React, { useEffect, useState } from "react";
import { CustomPopover } from "../popover/Popover";

type SearchInputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  searchFn: (query: string) => Promise<any[]>;
  renderItem: (item: any) => React.ReactNode;
  onSelect?: (item: any) => void;
  setSelectedWords: (item: Word) => void;
  selectedWordIds: string[];
};

export const SearchInput = ({
  searchFn,
  renderItem,
  setSelectedWords,
  className,
  value,
  onChange,
  selectedWordIds,
  ...props
}: SearchInputProps) => {
  const [internalValue, setInternalValue] = useState("");
  const inputValue = typeof value === "string" ? value : internalValue;
  const [debouncedValue] = useDebounce(inputValue, 300);
  const [results, setResults] = useState<any[]>([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetch = async () => {
      const trimmedValue = debouncedValue.trim();
      // const safeQuery = trimmedValue.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

      if (!trimmedValue) {
        setResults([]);
        setOpen(false);
        return;
      }

      const stringifiedQuery = stringify(
        {
          where: { word: { like: `${trimmedValue}` } },
          limit: 0,
        },
        { addQueryPrefix: true },
      );

      setLoading(true);
      try {
        const res = await searchFn(stringifiedQuery);
        const docs = res?.docs ?? (res || []);
        const filteredDocs = docs.filter(
          (item: any) =>
            !selectedWordIds.includes(item.id) &&
            item.word.toLowerCase().startsWith(trimmedValue.toLowerCase()),
        );
        setResults(filteredDocs);
      } catch (err) {
        throw new Error(err.message);
        setResults([]);
        setOpen(false);
      } finally {
        setLoading(false);
      }
    };

    fetch();
  }, [debouncedValue]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInternalValue(e.target.value);
    onChange?.(e);
  };

  /**
   * Handles the selection of an item from the search results.
   *
   * @param {Word} item - The selected word item.
   * @returns {void}
   */
  const handleSelect = (item: Word): void => {
    setInternalValue("");
    onChange?.({
      target: { value: "" },
    } as React.ChangeEvent<HTMLInputElement>);

    setSelectedWords((prevWords: Word[]): Word[] => [...prevWords, item]);
    setOpen(false);
    setResults([]);
  };

  return (
    <CustomPopover
      open={open}
      onOpenChange={setOpen}
      trigger={
        <Input
          {...props}
          value={inputValue}
          onChange={handleChange}
          className={cn("w-full h-10", className)}
        />
      }
      content={
        <div className="p-2 max-h-60 overflow-y-auto">
          {loading ? (
            <div className="text-muted-foreground text-sm">Loading...</div>
          ) : results.length > 0 ? (
            results.map((item, idx) => (
              <div
                key={idx}
                className="cursor-pointer px-2 py-1 hover:bg-muted rounded"
                onClick={() => handleSelect(item)}
              >
                {renderItem(item)}
              </div>
            ))
          ) : (
            <div className="text-muted-foreground text-sm">Không tìm thấy</div>
          )}
        </div>
      }
    />
  );
};
