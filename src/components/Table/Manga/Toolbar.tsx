"use client";

import type { Column, Table } from "@tanstack/react-table";
import type { MangaColumn } from "./Column";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

interface DataToolbarProps<TValue> {
  column?: Column<MangaColumn, TValue>;
  table: Table<MangaColumn>;
}

function DataToolbar<TValue>({ column, table }: DataToolbarProps<TValue>) {
  //const statusValues = column?.getFilterValue();

  return (
    <Link
      href="/manage/mangas/upload"
      className={cn(
        buttonVariants({
          variant: "default",
          size: "sm",
        }),
        "block min-w-max content-center"
      )}
    >
      Thêm truyện
    </Link>
  );
}

export default DataToolbar;
