"use client";

import { Input } from "@/components/ui/Input";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/Table";
import { useInterval } from "@mantine/hooks";
import type {
  ColumnFiltersState,
  SortingState,
  VisibilityState,
} from "@tanstack/react-table";
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import dynamic from "next/dist/shared/lib/dynamic";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import TableDataHeader from "../TableHeader";
import TablePagination from "../TablePagination";
import { ChapterColumn, columns } from "./Column";
import clearCache from "./clearCache";

const DataToolbar = dynamic(() => import("./Toolbar"), {
  ssr: false,
  loading: () => (
    <div className="flex items-center gap-4">
      <div className="max-sm:w-28 w-32 h-10 rounded-xl animate-pulse dark:bg-zinc-900" />
      <div className="max-sm:w-24 w-32 h-10 rounded-xl animate-pulse dark:bg-zinc-900" />
    </div>
  ),
});

interface DataTableProps {
  data: ChapterColumn[];
}

function ChapterTable({ data }: DataTableProps) {
  const pathName = usePathname();
  const interval = useInterval(() => clearCache(pathName), 15000);

  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilter] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
    },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilter,
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
  });

  useEffect(() => {
    interval.start();

    return interval.stop;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div>
      <div className="flex items-center gap-2 py-4 max-sm:flex-wrap">
        <Input
          placeholder="Lọc tên chapter"
          value={
            (table.getColumn("Tên chapter")?.getFilterValue() as string) ?? ""
          }
          onChange={(e) =>
            table.getColumn("Tên chapter")?.setFilterValue(e.target.value)
          }
          className="rounded-lg bg-default-400/20 focus:bg-slate-50"
        />
        <DataToolbar />
      </div>

      <Table>
        <TableDataHeader table={table} />

        <TableBody>
          {table.getRowModel().rows.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                data-state={row.getIsSelected() && "selected"}
              >
                {row.getVisibleCells().map((cell) => {
                  if (cell.column.id !== "actions") {
                    return (
                      <TableCell key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    );
                  } else {
                    return (
                      <TableCell key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    );
                  }
                })}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length}>Không có kết quả</TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      <TablePagination table={table} />
    </div>
  );
}

export default ChapterTable;
