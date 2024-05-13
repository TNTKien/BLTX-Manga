"use client";

import classes from "@/styles/mantine/manga-info.module.css";
import { Spoiler } from "@mantine/core";
import "@mantine/core/styles.layer.css";
import { useMediaQuery } from "@mantine/hooks";
import type { Manga } from "@prisma/client";
import Link from "next/link";
import { FC } from "react";

interface MangaDescriptionProps {
  manga: Pick<Manga, "id" | "description" | "author">;
}

const MangaDescription: FC<MangaDescriptionProps> = ({ manga }) => {
  const isMobile = useMediaQuery("(max-width: 640px)");

  return (
    <>
      <Spoiler
        maxHeight={isMobile ? 120 : 300}
        showLabel={
          <p className="w-fit text-sm rounded-b-md px-2.5 py-0.5 bg-primary text-primary-foreground">
            Xem thêm
          </p>
        }
        hideLabel={
          <p className="w-fit text-sm rounded-b-md px-2.5 py-0.5 bg-primary text-primary-foreground">
            Lược bớt
          </p>
        }
        classNames={classes}
      ></Spoiler>

      <>
        <div className="space-y-1 mt-4">
          <p className="text-lg font-semibold">Tác giả</p>
          <ul className="flex flex-wrap items-center gap-x-4 gap-y-2.5">
            {manga.author.map((author, idx) => (
              <li key={idx}>
                <Link
                  href={`/advanced-search?author=${manga.author}`}
                  className="block py-0.5 px-2 rounded-md bg-foreground/10"
                >
                  {manga.author}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </>
    </>
  );
};

export default MangaDescription;
