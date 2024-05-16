import MangaImage from "../Manga/components/MangaImage";
import { db } from "@/lib/db";
import { BookmarkCheck } from "lucide-react";
import Link from "next/link";

const Likes = async () => {
  const results = await db.manga.findMany({
    take: 9,
    where: {
      totalFollowers: {
        not: 0,
      },
    },
    orderBy: {
      totalFollowers: "desc",
    },
    select: {
      id: true,
      title: true,
      cover: true,
      totalFollowers: true,
    },
  });

  return (
    <div className="space-y-3 px-1">
      {results.map((manga, idx) => (
        <Link
          key={manga.id}
          href={`/manga/${manga.id}`}
          className="grid grid-cols-[.3fr_1fr] gap-4 rounded-md group transition-colors hover:bg-background/20"
        >
          <div className="relative">
            <MangaImage sizes="15vw" manga={manga} />
            <div className="absolute top-0 left-0 p-1 pr-2 rounded-md rounded-br-full bg-leader">
              {idx + 1}
            </div>
          </div>

          <div className="space-y-1.5">
            <p className="text-lg font-semibold transition-all group-hover:text-xl">
              {manga.title}
            </p>
            <p className="flex items-center gap-1.5">
              {manga.totalFollowers} <BookmarkCheck className="w-5 h-5" />
            </p>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default Likes;
