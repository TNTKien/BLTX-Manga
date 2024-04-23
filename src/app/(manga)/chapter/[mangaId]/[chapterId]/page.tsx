// import { getAuthSession } from '@/lib/auth';
import { db } from "@/lib/db";
import type { Chapter, Manga } from "@prisma/client";
import dynamic from "next/dynamic";
import type { FC } from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import axiosInstance from "@/lib/axios";

const Reader = dynamic(() => import("@/components/Chapter/Reader"), {
  ssr: false,
});

interface pageProps {
  params: {
    mangaId: string;
    chapterId: string;
  };
}

async function getChapter(managId: string, chapterId: string) {
  const { data } = await axiosInstance.get(
    `/api/chapter/${managId}/${chapterId}`
  );
  return data.data as Chapter;
}

async function getChapterList(mangaId: string) {
  const { data } = await axiosInstance.get(`/api/chapter/${mangaId}`);
  return data.data as Chapter[];
}

async function getManga(mangaId: string) {
  const { data } = await axiosInstance.get(`/api/manga/${mangaId}`);
  return data.data as Manga;
}

const page: FC<pageProps> = async ({ params }) => {
  const chapter = await getChapter(params.mangaId, params.chapterId);
  if (!chapter) return notFound();

  const chapterList = await getChapterList(params.mangaId);

  const navChapter = getNavChapter(chapter.id, chapterList);

  const chapterArgs = {
    id: chapter.id,
    title: chapter.title,
    pages: chapter.pages,
    mangaId: chapter.mangaId,
    chapters: chapterList.map((chapter) => ({
      id: chapter.id,
      title: chapter.title,
      pages: chapter.pages,
      mangaId: chapter.mangaId,
    })),
  };
  //console.log(chapterArgs);
  return (
    <main className="relative h-[100dvh] bg-background space-y-3">
      <Reader
        prevChapter={!!navChapter?.prev ? navChapter.prev : null}
        nextChapter={!!navChapter?.next ? navChapter.next : null}
        chapter={chapterArgs}
      />
    </main>
  );
};

export default page;

const getNavChapter = (
  currentId: string,
  chaptersList: Pick<Chapter, "id" | "title" | "pages" | "mangaId">[]
) => {
  const index = chaptersList.findIndex((chapter) => chapter.id === currentId);
  if (index === -1) return null;

  return {
    prev: index === 0 ? null : chaptersList[index - 1],
    next: index === chaptersList.length - 1 ? null : chaptersList[index + 1],
  };
};

export async function generateMetadata({
  params,
}: pageProps): Promise<Metadata> {
  const chapter = await getChapter(params.mangaId, params.chapterId);

  if (!chapter)
    return {
      title: `Đọc truyện ${params.mangaId}`,
    };

  const manga = await getManga(params.mangaId);

  const title = `${!!chapter.title ? `${chapter.title}` : ""} - ${manga.title}`;
  const description = `Đọc truyện ${manga.title} ${chapter.title}.`;

  return {
    title: {
      absolute: title,
      default: title,
    },
    description,
    keywords: ["Chapter", "Manga", "Truyện tranh", manga.title],
    alternates: {
      canonical: `${process.env.NEXTAUTH_URL}/chapter/${params.mangaId}/${params.chapterId}`,
    },
  };
}

// const updateHistory = (mangaId: string, chapterId: string) =>
//   getAuthSession().then(async (session) => {
//     if (!session) return;

//     return await db.history.upsert({
//       where: {
//         userId_mangaId: {
//           userId: session.user.id,
//           mangaId,
//         },
//       },
//       update: {
//         chapterId,
//         createdAt: new Date(),
//       },
//       create: {
//         userId: session.user.id,
//         mangaId,
//         chapterId,
//       },
//     });
//   });

// export async function generateMetadata({
//   params,
// }: pageProps): Promise<Metadata> {
//   const chapter = await db.chapter.findUnique({
//     where: {
//       id: +params.id,
//       isPublished: true,
//     },
//     select: {
//       volume: true,
//       chapterIndex: true,
//       name: true,
//       manga: {
//         select: {
//           image: true,
//           name: true,
//         },
//       },
//     },
//   });

//   if (!chapter)
//     return {
//       title: `Đọc truyện ${params.id}`,
//     };

//   const title = `Vol. ${chapter.volume} Ch. ${chapter.chapterIndex}${
//     !!chapter.name ? ` - ${chapter.name}` : ""
//   }. Truyện ${chapter.manga.name} | Tiếp Chap ${chapter.chapterIndex + 1}`;
//   const description = `Đọc truyện ${chapter.manga.name} Chap ${chapter.chapterIndex}.`;

//   return {
//     title: {
//       absolute: title,
//       default: title,
//     },
//     description,
//     keywords: [
//       "Chapter",
//       "Manga",
//       "Truyện tranh",
//       "Moetruyen",
//       chapter.manga.name,
//     ],
//     alternates: {
//       canonical: `${process.env.NEXTAUTH_URL}/chapter/${params.id}`,
//     },
//     openGraph: {
//       url: `${process.env.NEXTAUTH_URL}/chapter/${params.id}`,
//       siteName: "Moetruyen",
//       title,
//       description,
//       locale: "vi_VN",
//       images: [
//         {
//           url: chapter.manga.image,
//           alt: `Ảnh bìa ${chapter.manga.name}`,
//         },
//       ],
//     },
//     twitter: {
//       site: "Moetruyen",
//       title,
//       description,
//       card: "summary_large_image",
//       images: [
//         {
//           url: chapter.manga.image,
//           alt: `Ảnh bìa ${chapter.manga.image}`,
//         },
//       ],
//     },
//   };
// }
