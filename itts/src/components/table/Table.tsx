/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
"use client";
import type {
  Cell,
  Header,
  HeaderGroup,
  Row,
  useReactTable,
} from "@tanstack/react-table";

import { flexRender } from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { memo, type JSX } from "react";
import { DataTablePagination } from "./Pagination";

interface DataTableProps<TData> {
  beforePagination?: JSX.Element;
  afterPagination?: JSX.Element;
  pagination?: boolean;
  columnLength?: number;
  isPdfPrinting?: boolean;
  table: ReturnType<typeof useReactTable<TData>>;
}

export const DataTable = memo(function DataTable<TData>({
  beforePagination,
  afterPagination,
  table,
  pagination = true,
  columnLength,
  isPdfPrinting,
}: DataTableProps<TData>) {
  return (
    <div>
      <div className="mb-6 overflow-hidden rounded-lg border">
        <Table>
          <TableHeader className="bg-[#E72929]">
            {table.getHeaderGroups().map((headerGroup: HeaderGroup<TData>) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header: Header<TData, unknown>) => {
                  return (
                    <TableHead
                      key={header.id}
                      className="text-center"
                      style={{
                        width: `${header.getSize()}px`,
                      }}
                    >
                      <div style={{ marginTop: isPdfPrinting ? -16 : 0 }}>
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext(),
                            )}
                      </div>
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row: Row<TData>) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell: Cell<TData, unknown>) => (
                    <TableCell
                      key={cell.id}
                      className="border-r text-center last:border-r-0"
                      style={{
                        marginTop: isPdfPrinting ? -16 : 0,
                      }}
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columnLength}
                  className="h-24 text-center"
                />
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      {pagination && (
        <DataTablePagination
          afterPagination={afterPagination}
          table={table}
          beforePagination={beforePagination}
        />
      )}
    </div>
  );
});
