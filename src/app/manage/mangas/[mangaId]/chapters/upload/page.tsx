import ChapterUploadSkeleton from "@/components/Skeleton/ChapterUploadSkeleton";
import { getAuthSession } from "@/lib/auth";
import { db } from "@/lib/db";
import dynamic from "next/dynamic";
import { notFound, redirect } from "next/navigation";
import { FC } from "react";
import axiosInstance from "@/lib/axios";
import type { Manga } from "@prisma/client";
import { Metadata } from "next";

const ChapterUpload = dynamic(() => import("@/components/Upload/Chapter"), {
  ssr: false,
  loading: () => <ChapterUploadSkeleton />,
});

export const metadata: Metadata = {
  title: "Thêm Chapter",
};

interface pageProps {
  params: {
    mangaId: string;
  };
}

async function getManga(mangaId: string) {
  const { data } = await axiosInstance.get(`/api/manga/${mangaId}`);
  //console.log(data);
  return data.data as Manga;
}

const page: FC<pageProps> = async ({ params }) => {
  const session = await getAuthSession();
  if (!session) return redirect(`${process.env.MAIN_URL}/sign-in`);

  const manga = await getManga(params.mangaId);
  if (!manga) return notFound();

  return (
    <main className="container p-1 space-y-10 mb-10">
      <section className="p-3 mx-8 rounded-md dark:bg-zinc-900/60">
        <ChapterUpload id={manga.id} />
      </section>
    </main>
  );
};

export default page;
