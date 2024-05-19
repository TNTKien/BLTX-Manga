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
  try {
    const { data } = await axiosInstance.get(
      `/api/chapter/${managId}/${chapterId}`
    );
    return data.data as Chapter;
  } catch (error) {
    return null;
  }
}

async function getChapterList(mangaId: string) {
  try {
    const { data } = await axiosInstance.get(`/api/chapter/${mangaId}`);
    return data.data as Chapter[];
  } catch (error) {
    return null;
  }
}

async function getManga(mangaId: string) {
  try {
    const { data } = await axiosInstance.get(`/api/manga/${mangaId}`);
    return data.data as Manga;
  } catch (error) {
    return null;
  }
}

const page: FC<pageProps> = async ({ params }) => {
  const manga = await getManga(params.mangaId);
  if (!manga) return notFound();

  const chapter = await getChapter(params.mangaId, params.chapterId);
  if (!chapter) return notFound();

  const chapterList = await getChapterList(params.mangaId);
  if (!chapterList) return notFound();

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

  return (
    <main className="relative h-[100dvh] bg-background space-y-3">
      <Reader
        prevChapter={!!navChapter?.prev ? navChapter.prev : null}
        nextChapter={!!navChapter?.next ? navChapter.next : null}
        chapter={chapterArgs}
        mangaTitle={manga.title}
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
  if (!manga)
    return {
      title: `Đọc truyện ${params.mangaId}`,
    };

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
