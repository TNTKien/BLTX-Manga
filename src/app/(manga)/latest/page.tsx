import MangaCard from "@/components/Manga/components/MangaCard";
import PaginationControll from "@/components/PaginationControll";
import { db } from "@/lib/db";
import type { Metadata } from "next";
import { FC } from "react";

export const metadata: Metadata = {
  title: "Mới cập nhật",
  description: "Manga mới cập nhật",
  keywords: ["Mới cập nhật", "Manga"],
};

interface pageProps {
  searchParams: {
    [key: string]: string | string[] | undefined;
  };
}

const getSearchParams = ({ searchParams }: pageProps) => {
  const pageParams = searchParams["page"] ?? "1";
  const limitParams = searchParams["limit"] ?? "20";

  const page = pageParams
    ? typeof pageParams === "string"
      ? pageParams
      : pageParams[0]
    : "1";
  const limit = limitParams
    ? typeof limitParams === "string"
      ? limitParams
      : limitParams[0]
    : "10";

  return {
    page: parseInt(page),
    limit: parseInt(limit),
  };
};

const page: FC<pageProps> = async ({ searchParams }) => {
  const { page, limit } = getSearchParams({ searchParams });

  const [latestManga, totalMangas] = await db.$transaction([
    db.manga.findMany({
      take: limit,
      skip: (page - 1) * limit,
      orderBy: {
        createdAt: "desc",
      },
    }),
    db.manga.count(),
  ]);

  return (
    <main className="container max-sm:px-2 space-y-4 mt-6 p-3 pb-6 rounded-md bg-gradient-to-b from-background/50">
      <h1 className="text-2xl font-semibold">Mới cập nhật</h1>
      <ul className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {latestManga.length ? (
          latestManga.map((manga, idx) => (
            <li key={idx}>
              <MangaCard manga={manga} />
            </li>
          ))
        ) : (
          <li>Không có Manga</li>
        )}
      </ul>

      <PaginationControll total={totalMangas} route="/latest?" />
    </main>
  );
};

export default page;
