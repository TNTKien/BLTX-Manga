"use client";

import { Button, buttonVariants } from "@/components/ui/Button";

import { cn } from "@/lib/utils";

import Link from "next/link";

function DataToolbar() {
  const mangaId = window.location.pathname.split("/")[3];
  return (
    <Link
      href={`/manage/mangas/${mangaId}/chapters/upload`}
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
