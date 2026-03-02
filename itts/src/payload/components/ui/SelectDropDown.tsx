"use client";

import { useEffect, useRef, useState } from "react";
import { FiChevronDown } from "react-icons/fi";

type Option = {
  label: string;
  value: any;
};

type SelectDownDropProps = {
  options: Option[];
  value?: any;
  placeholder?: string;
  onChange: (option: Option) => void;
};

const SelectDownDrop = ({
  options,
  value,
  onChange,
  placeholder = "Chọn",
}: SelectDownDropProps) => {
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find((o) => o.value === value);

  /* ===== Close when click outside ===== */
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={wrapperRef} className="relative w-[260px]">
      {/* ===== Trigger ===== */}
      <div
        onClick={() => setOpen((prev) => !prev)}
        className="
          flex items-center justify-between
          px-3 py-2
          border border-slate-300
          rounded-2xl
          bg-slate-100
          cursor-pointer
          text-sm
        "
      >
        <span className={selectedOption ? "text-black" : "text-slate-400"}>
          {selectedOption?.label ?? placeholder}
        </span>
        <FiChevronDown className="ml-2 text-lg text-slate-700" />
      </div>

      {/* ===== Dropdown ===== */}
      {open && (
        <div
          className="
            absolute z-50 mt-1 w-full
            bg-white
            border border-slate-300
            rounded-xl
            shadow-lg
            max-h-60
            overflow-auto
          "
        >
          {options.length === 0 && (
            <div className="px-3 py-2 text-sm text-slate-400">
              Không có dữ liệu
            </div>
          )}

          {options.map((option) => (
            <div
              key={option.value}
              onClick={() => {
                onChange(option);
                setOpen(false);
              }}
              className={`
                px-3 py-2
                text-sm
                cursor-pointer
                hover:bg-red-50
                ${
                  value === option.value
                    ? "bg-red-100 font-semibold text-red-700"
                    : ""
                }
              `}
            >
              {option.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SelectDownDrop;
