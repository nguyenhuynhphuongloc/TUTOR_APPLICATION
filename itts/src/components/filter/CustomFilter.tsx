"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import type { CustomComponent } from "payload";
import React from "react";

const CustomSelectFilter: React.FC<CustomComponent> = () => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();

  const statusOptions = [
    { label: "Active", value: "active" },
    { label: "Inactive", value: "inactive" },
    { label: "Pending", value: "pending" },
  ];

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedStatus = e.target.value;
    const current = new URLSearchParams(Array.from(searchParams.entries()));

    // Add or remove status filter
    if (selectedStatus) {
      current.set("status", selectedStatus);
    } else {
      current.delete("status");
    }

    // Create query string
    const search = current.toString();
    const query = search ? `?${search}` : "";

    // Navigate to the new URL
    router.push(`${pathname}${query}`);
  };

  return (
    <div className="payload-custom-filter">
      <select
        onChange={handleStatusChange}
        value={searchParams.get("status") ?? ""}
        className="payload-select-filter"
      >
        {statusOptions.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default CustomSelectFilter;
