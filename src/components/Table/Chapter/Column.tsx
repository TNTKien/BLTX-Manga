"use client";

import { DataTableColumnHeader } from "@/components/Table/ColumnHeader";
import { formatTimeToNow } from "@/lib/utils";
import { type Chapter } from "@prisma/client";
import type { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";
import dynamic from "next/dynamic";

const DataTableRowAction = dynamic(() => import("./RowAction"), {
  ssr: false,
  loading: () => (
    <div className="p-1">
      <MoreHorizontal className="w-5 h-5" />
    </div>
  ),
});

export type ChapterColumn = Pick<
  Chapter,
  "id" | "title" | "pages" | "mangaId" | "updatedAt"
>;

export const columns: ColumnDef<ChapterColumn>[] = [
  {
    id: "ID",
    accessorKey: "id",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="ID" />
    ),
    cell: ({ row }) => <div>{row.getValue("ID")}</div>,
    enableHiding: false,
  },
  {
    id: "Tên chapter",
    accessorKey: "name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Tên chapter" />
    ),
    cell: ({ row }) => {
      return <div>{row.original.title}</div>;
    },
  },
  {
    id: "Số lượng ảnh",
    accessorKey: "pages",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Số lượng ảnh" />
    ),
    cell: ({ row }) => {
      return <div>{row.original.pages.length}</div>;
    },
    enableSorting: false,
  },
  {
    id: "Cập nhật",
    accessorKey: "updatedAt",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Cập nhật" />
    ),
    cell: ({ row }) => {
      const formattedDate = formatTimeToNow(row.getValue("Cập nhật"));
      return <div>{formattedDate}</div>;
    },
  },
  {
    id: "actions",
    cell: ({ row }) => <DataTableRowAction row={row} />,
    enableHiding: false,
  },
];
