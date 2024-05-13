import { formatTimeToNow } from "@/lib/utils";
import Link from "next/link";
import { notFound } from "next/navigation";
import { FC } from "react";
import axiosInstance from "@/lib/axios";
import { Chapter } from "@prisma/client";

interface NormalProps {
  mangaId: string;
}

async function getChapters(mangaId: string) {
  const { data } = await axiosInstance.get(`/api/chapter/${mangaId}`);
  const chapterArrs = data.data as Chapter[];
  return chapterArrs.reverse();
}

const Normal: FC<NormalProps> = async ({ mangaId }) => {
  const chapters = await getChapters(mangaId);
  if (!chapters) return notFound();

  let latestChapter = chapters[0];

  return (
    <ul className="space-y-5">
      {chapters.map((chapter) => {
        if (
          new Date(chapter.createdAt).getTime() >
          new Date(latestChapter.createdAt).getTime()
        ) {
          latestChapter = chapter;
        }

        return (
          <li key={chapter.id} className="flex gap-2 md:gap-4">
            <Link
              href={`/chapter/${mangaId}/${chapter.id}`}
              className="block flex-1 py-1 px-1.5 rounded-md space-y-1.5 transition-colors bg-muted hover:bg-muted/70"
            >
              <div className="flex items-center gap-1.5 md:text-lg font-semibold">
                {latestChapter.id === chapter.id && (
                  <span className="shrink-0 py-0.5 px-1 md:px-1.5 mr-1 md:mr-1.5 text-sm rounded-md bg-foreground text-primary-foreground">
                    NEW
                  </span>
                )}
                <p className="line-clamp-1">
                  {!!chapter.title && ` ${chapter.title}`}
                </p>
              </div>

              <div className="flex items-center gap-4 text-sm">
                <time
                  dateTime={new Date(chapter.createdAt).toDateString()}
                  className="shrink-0"
                >
                  {formatTimeToNow(new Date(chapter.createdAt))}
                </time>
              </div>
            </Link>
          </li>
        );
      })}
    </ul>
  );
};

export default Normal;
