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
  Loader,
} from "lucide-react";
import { getAuthSession } from "@/lib/auth";
import { db } from "@/lib/db";
import dynamic from "next/dynamic";
import { toast } from "@/hooks/use-toast";

const MangaFollow = dynamic(
  () => import("@/components/Manga/components/MangaFollow"),
  {
    ssr: false,
    loading: () => (
      <button
        className={buttonVariants({
          className: "gap-1",
        })}
      >
        <Loader />
      </button>
    ),
  }
);

interface MangaActionProps {
  manga: Pick<Manga, "id" | "title">;
}

const MangaAction: FC<MangaActionProps> = async ({ manga }) => {
  const chapterId = await getLastChapterId(manga.id);
  const session = await getAuthSession();

  const isFollowed = session ? await checkFollow(manga.id, session.id) : false;

  return (
    <>
      {!!chapterId && (
        <Link
          href={`/chapter/${manga.id}/${chapterId}`}
          className={buttonVariants({
            className:
              "min-w-[9rem] md:min-w-[11.5rem] lg:min-w-[13.5rem] gap-1",
          })}
        >
          <BookOpenText /> Đọc truyện
        </Link>
      )}

      {!!session && <MangaFollow mangaId={manga.id} isFollow={!!isFollowed} />}

      <ShareButton url={`/manga/${manga.id}`} title={manga.title} />
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

async function checkFollow(mangaId: string, userId: string) {
  const user = await db.user.findUnique({
    where: {
      id: userId,
    },
    select: {
      followingManga: {
        where: {
          id: mangaId,
        },
      },
    },
  });

  return !!user?.followingManga.length;
}
