import TableSkeleton from "@/components/Skeleton/TableSkeleton";
import { buttonVariants } from "@/components/ui/Button";
import { getAuthSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { cn } from "@/lib/utils";
import { ArrowLeft, UploadCloud } from "lucide-react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { FC } from "react";
import type { Manga, Chapter } from "@prisma/client";
import axiosInstance from "@/lib/axios";

const ChapterTable = dynamic(() => import("@/components/Table/Chapter"), {
  ssr: false,
  loading: () => <TableSkeleton />,
});

interface pageProps {
  params: {
    mangaId: string;
  };
}

async function getManga(mangaId: string) {
  const { data } = await axiosInstance.get(`/api/manga/${mangaId}`);
  return data.data as Manga;
}

async function getChapters(mangaId: string) {
  const { data } = await axiosInstance.get(`/api/chapter/${mangaId}`);
  return data.data as Chapter[];
}

const page: FC<pageProps> = async ({ params }) => {
  const session = await getAuthSession();
  if (!session) return redirect(`${process.env.MAIN_URL}/sign-in`);
  const manga = await getManga(params.mangaId);
  if (!manga) return notFound();

  const chapters = await getChapters(params.mangaId);

  return (
    <main className="container max-sm:px-2 mb-10">
      <section className="space-y-0.5">
        <Link
          href="/manage/mangas"
          className={cn(buttonVariants({ variant: "link" }), "px-0 space-x-2")}
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Quay lại</span>
        </Link>

        <h1 className="p-3 text-2xl font-semibold">{manga.title}</h1>
      </section>

      <section className="p-3 rounded-md dark:bg-zinc-900/60">
        {!chapters.length && (
          <div className="h-96 flex flex-col space-y-2 justify-center items-center">
            <p className="text-center">
              Bạn chưa có Chapter nào. Hãy upload Chapter ngay thôi nhé
            </p>
            <Link
              href={`/chapters/${params.mangaId}/upload`}
              className={cn(buttonVariants(), "space-x-2")}
            >
              <UploadCloud className="w-5 h-5" />
              <span>Thêm chapter</span>
            </Link>
          </div>
        )}

        {!!chapters.length && (
          <div className="flex flex-col">
            <ChapterTable data={chapters} />
          </div>
        )}
      </section>
    </main>
  );
};

export default page;
