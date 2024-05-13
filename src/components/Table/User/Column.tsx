"use client";

import { DataTableColumnHeader } from "../ColumnHeader";
import type { User } from "@prisma/client";
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

export type UserColumn = Pick<User, "id" | "email" | "username" | "role">;

export const columns: ColumnDef<UserColumn>[] = [
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
    id: "Email",
    accessorKey: "email",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Email" />
    ),
  },
  {
    id: "Username",
    accessorKey: "username",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Tên người dùng" />
    ),
  },
  {
    id: "Role",
    accessorKey: "role",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Role" />
    ),
  },
  {
    id: "actions",
    cell: ({ row }) => <DataTableRowAction row={row} />,
    enableHiding: false,
  },
];
