import MangaImage from "@/components/Manga/components/MangaImage";
import { db } from "@/lib/db";
import dynamic from "next/dynamic";
import Link from "next/link";
import { FC } from "react";
import { Tags } from "@prisma/client";
import axiosInstance from "@/lib/axios";
import { notFound } from "next/navigation";
import { Chip } from "@nextui-org/react";
import { Metadata } from "next";

const PaginationControll = dynamic(
  () => import("@/components/PaginationControll"),
  { ssr: false }
);

interface pageProps {
  searchParams: {
    [key: string]: string | undefined;
  };
}

export const metadata: Metadata = {
  title: "Lọc thể loại",
};

const page: FC<pageProps> = async ({ searchParams }) => {
  const page = searchParams["page"] ?? "1";
  const limit = searchParams["limit"] ?? "10";
  const queryParam = searchParams["q"];
  if (!queryParam) return notFound();

  let query = typeof queryParam === "string" ? queryParam : queryParam[0];

  const allTags = await getTags();
  if (!allTags.includes(query.toUpperCase())) return notFound();

  const tagQuery = query.trim().toUpperCase().replace(/ /g, "_") as Tags;

  const [mangas, total] = await Promise.all([
    getMangasByTag(tagQuery, Number(limit), (Number(page) - 1) * Number(limit)),
    getMangasByTagCount(tagQuery),
  ]);

  return (
    <main className="container max-sm:px-2 mt-10 space-y-4">
      <h1 className="text-xl font-bold">
        Thể loại:{" "}
        <Chip
          classNames={{
            base: "bg-red-300 ",
            content: "text-white font-semibold",
          }}
        >
          {query.toUpperCase()}
        </Chip>
      </h1>

      {!!mangas.length ? (
        <ul className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 p-2 rounded-md bg-gradient-to-b from-background/40">
          {mangas.map((manga) => (
            <li key={manga.id}>
              <Link
                href={`/manga/${manga.id}`}
                className="grid grid-cols-[.6fr_1fr] rounded-md group transition-colors hover:bg-primary-foreground"
              >
                <MangaImage
                  manga={manga}
                  sizes="(max-width: 640px) 25vw, 20vw"
                  className="group-hover:scale-105 transition-transform"
                />
                <div className="space-y-0.5 min-w-0 pl-4 px-2">
                  <p className="text-2xl lg:text-3xl line-clamp-2 font-semibold">
                    {manga.title}
                  </p>
                  <p className="line-clamp-3">{manga.description}</p>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <p>Không có kết quả</p>
      )}

      <PaginationControll
        total={total[0].count}
        route={`/search/tags?q=${queryParam}`}
      />
    </main>
  );
};

export default page;

async function getTags() {
  const { data } = await axiosInstance.get("/api/tags");
  return data.data;
}

async function getMangasByTag(tag: Tags, limit: number, skip: number) {
  const mangas = await db.manga.findMany({
    where: {
      tags: {
        has: tag,
      },
    },
    take: limit,
    skip: skip,
  });

  //console.log(total);
  return mangas;
}

async function getMangasByTagCount(tag: Tags): Promise<{ count: number }[]> {
  const total = await db.manga.count({
    where: {
      tags: {
        has: tag,
      },
    },
  });

  return [{ count: total }];
}
