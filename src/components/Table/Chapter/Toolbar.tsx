"use client";

import { Button, buttonVariants } from "@/components/ui/Button";
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
import { cn } from "@/lib/utils";
import type { Column, Table } from "@tanstack/react-table";
import { Check } from "lucide-react";
import type { ChapterColumn } from "./Column";
import Link from "next/link";

interface DataToolbarProps<TValue> {
  column?: Column<ChapterColumn, TValue>;
  table: Table<ChapterColumn>;
}

function DataToolbar<TValue>({ column, table }: DataToolbarProps<TValue>) {
  const statusValues = column?.getFilterValue();

  return (
    <Link
      href=""
      className={cn(
        buttonVariants({
          variant: "default",
          size: "sm",
        }),
        "block min-w-max content-center"
      )}
    >
      Thêm chapter
    </Link>
  );
}

export default DataToolbar;
