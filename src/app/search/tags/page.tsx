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
    [key: string]: string | string[] | undefined;
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

  const tagQuery = getTagQuery(queryParam);

  const allTags = await getTags();
  if (!tagQuery.every((tag) => allTags.includes(tag.replace(/_/g, " "))))
    return notFound();

  const [mangas, total] = await Promise.all([
    getMangasByTag(tagQuery, Number(limit), (Number(page) - 1) * Number(limit)),
    getMangasByTagCount(tagQuery),
  ]);

  return (
    <main className="container max-sm:px-2 mt-10 space-y-4">
      <div className="flex gap-1 flex-wrap">
        <h1 className="text-xl font-bold">Thể loại: </h1>
        {tagQuery.map((tag, index) => (
          <Chip
            key={index}
            classNames={{
              base: "bg-red-300 ",
              content: "text-white font-semibold",
            }}
          >
            {tag.replace(/_/g, " ").toUpperCase()}
          </Chip>
        ))}
      </div>

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
                  <p className="text-2xl line-clamp-2 font-semibold text-ellipsis">
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

async function getMangasByTag(tag: Tags[], limit: number, skip: number) {
  const mangas = await db.manga.findMany({
    where: {
      tags: {
        hasEvery: tag,
      },
    },
    take: limit,
    skip: skip,
  });

  //console.log(total);
  return mangas;
}

async function getMangasByTagCount(tag: Tags[]): Promise<{ count: number }[]> {
  const total = await db.manga.count({
    where: {
      tags: {
        hasEvery: tag,
      },
    },
  });

  return [{ count: total }];
}

function getTagQuery(query: string | string[]) {
  let tags = [];
  if (typeof query === "string")
    tags.push(query.trim().toUpperCase().replace(/ /g, "_") as Tags);
  else
    tags = query.map(
      (tag) => tag.trim().toUpperCase().replace(/ /g, "_") as Tags
    );
  return tags as Tags[];
}
