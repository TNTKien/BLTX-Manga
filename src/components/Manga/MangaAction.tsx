import type { Manga, Chapter } from "@prisma/client";
import { FC } from "react";
import ShareButton from "../ShareButton";
import Link from "next/link";
import { buttonVariants } from "../ui/Button";
import axiosInstance from "@/lib/axios";
import {
  Bookmark,
  BookmarkMinus,
  BookOpenText,
  ThumbsUp,
  Heart,
} from "lucide-react";

interface MangaActionProps {
  manga: Pick<Manga, "id" | "title">;
}

const MangaAction: FC<MangaActionProps> = async ({ manga }) => {
  const chapterId = await getLastChapterId(manga.id);

  return (
    <>
      {!!chapterId && (
        <Link
          href={`/chapter/${manga.id}/${chapterId}`}
          className={buttonVariants({
            className:
              "min-w-[9rem] md:min-w-[11.5rem] lg:min-w-[13.5rem] gap-1.5",
          })}
        >
          <BookOpenText /> Đọc truyện
        </Link>
      )}

      <ShareButton
        url={`/manga/${manga.id}`}
        title={manga.title}
        className={
          !chapterId
            ? "min-w-[8.5rem] md:min-w-[11.5rem]  lg:min-w-[13.5rem]"
            : ""
        }
      />
      <button
        className={buttonVariants({
          className: "gap-1.5",
        })}
      >
        <Bookmark />
      </button>
    </>
  );
};

export default MangaAction;

async function getLastChapterId(mangaId: string) {
  const { data } = await axiosInstance.get(`/api/chapter/${mangaId}`);
  const chapters = data.data as Chapter[] | null;

  if (!chapters || chapters?.length === 0) return null;

  return chapters.at(0)?.id;
}
