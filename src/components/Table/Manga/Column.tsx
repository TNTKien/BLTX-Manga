"use client";

import { DataTableColumnHeader } from "../ColumnHeader";
import { formatTimeToNow } from "@/lib/utils";
import type { Manga } from "@prisma/client";
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

export type MangaColumn = Pick<Manga, "id" | "title" | "updatedAt">;

export const columns: ColumnDef<MangaColumn>[] = [
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
    id: "Tên truyện",
    accessorKey: "title",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Tên truyện" />
    ),
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
