"use client";

import { Button } from "@/components/ui/Button";
import {
  Command,
  CommandGroup,
  CommandItem,
  CommandList,
} from "@/components/ui/Command";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/DropdownMenu";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/Popover";
import type { Column, Table } from "@tanstack/react-table";
import { Check } from "lucide-react";
import type { MangaColumn } from "./Column";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

interface DataToolbarProps<TValue> {
  column?: Column<MangaColumn, TValue>;
  table: Table<MangaColumn>;
}

function DataToolbar<TValue>({ column, table }: DataToolbarProps<TValue>) {
  const statusValues = column?.getFilterValue();

  return (
    <Link
      href="/manage/upload"
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
