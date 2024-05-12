import MangaImage from "@/components/Manga/components/MangaImage";
import MangaInfo from "@/components/Manga/components/MangaInfo";
import ChapterList from "@/components/Chapter/ChapterList";
import { TagWrapper } from "@/components/ui/Tag";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/Accordion";
import { db } from "@/lib/db";
import type { Manga } from "@prisma/client";
import type { Metadata } from "next";
import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { FC } from "react";
import axiosInstance from "@/lib/axios";
import { baseURL } from "@/utils/config";
import EditManga from "@/components/Upload/Manga/EditManga";

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
export const metadata: Metadata = {
  title: "Sửa truyện",
};

const page: FC<pageProps> = async ({ params }) => {
  const manga = await getManga(params.mangaId);
  if (!manga) return notFound();

  return (
    <main className="container p-1 mb-10 space-y-10">
      <section className="p-3 mx-8 rounded-md dark:bg-zinc-900/60 ">
        <EditManga manga={manga} />
      </section>
    </main>
  );
};

export default page;
