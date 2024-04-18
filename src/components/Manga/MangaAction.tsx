import { db } from "@/lib/db";
import type { Manga, Chapter } from "@prisma/client";
import dynamic from "next/dynamic";
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

// const MangaFollow = dynamic(
//     () => import('@/components/Manga/components/MangaFollow'),
//     {
//       ssr: false,
//       loading: () => <div className="w-[7.5rem] h-10 rounded-md bg-foreground" />,
//     }
//   );

interface MangaActionProps {
  manga: Pick<Manga, "id" | "title">;
}

const MangaAction: FC<MangaActionProps> = async ({ manga }) => {
  // const session = await getAuthSession();
  // const [isFollowing, chapterId] = await Promise.all([
  //     checkFollow(manga.id, session),
  //     getLastChapterId(manga.id, session),
  // ]);

  // const [chapterId] = await Promise.all([
  //     //checkFollow(manga.id, session),
  //     getLastChapterId(manga.id),
  // ]);

  const chapterId = await getLastChapterId(manga.id);

  return (
    <>
      {!!chapterId && (
        <Link
          href={`/chapter/${chapterId}`}
          className={buttonVariants({
            className:
              "min-w-[9rem] md:min-w-[11.5rem] lg:min-w-[13.5rem] gap-1.5",
          })}
        >
          <BookOpenText /> Đọc truyện
        </Link>
      )}
      {/* {!!session && (
                <MangaFollow
                    mangaId={manga.id}
                    isFollow={!!isFollowing}
                    hasChapter={!!chapterId}
                />
            )} */}
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

// function checkFollow(id: string, session: Session | null) {
//     if (!session) return null;

//     return db.manga.findUnique({
//         where: {
//             id,
//             followedBy: {
//                 some: {
//                     id: session.user.id,
//                 },
//             },
//         },
//         select: {
//             id: true,
//         },
//     });
// }

async function getLastChapterId(mangaId: string) {
  const { data } = await axiosInstance.get(`/api/chapter/${mangaId}`);
  const chapters = data.data as Chapter[] | null;
  //console.log(chapters);
  if (!chapters || chapters?.length === 0) return null;

  return chapters.at(0)?.id;
}

// async function getLastChapterId(mangaId: string) {
//     const firstChapterPromise = db.chapter
//         .findFirst({
//             where: {
//                 mangaId,
//             },
//             orderBy: {
//                 chapterIndex: 'asc',
//             },
//             select: {
//                 id: true,
//             },
//         })
//         .then((result) => result?.id);

//     const [firstChapterId, historyChapterId] = await Promise.all([
//         firstChapterPromise,
//         ...historyPromise,
//     ]);

//     else if (!historyChapterId) return firstChapterId;
//     else return historyChapterId;
// }
