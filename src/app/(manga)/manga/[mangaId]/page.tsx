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
import FacebookEmbed from "@/components/FacebookEmbed";
import DiscordEmbed from "@/components/DiscordEmbed";
// const MangaSubInfo = dynamic(
//     () => import('@/components/Manga/components/MangaSubInfo'),
//     {
//       loading: () => <MangaSubInfoSkeleton />,
//     }
//   );
const MangaAction = dynamic(() => import("@/components/Manga/MangaAction"), {
  loading: () => (
    <div className="w-36 md:w-[11.5rem] lg:w-[13.5rem] h-10 rounded-md animate-pulse bg-background" />
  ),
});

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
  const manga = await getManga(params.mangaId);
  if (!manga) return notFound();

  const jsonLd = generateJsonLd(manga, params.mangaId);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <main className="container px-0 pb-4 bg-gradient-to-t from-background">
        {/* Manga cover section */}
        <section className="relative aspect-[4/2] md:aspect-[4/1] overflow-hidden">
          {!!manga.cover ? (
            <Image
              fill
              priority
              loading="eager"
              sizes="(max-width: 640px) 55vw, 95vw"
              src={`${baseURL}${manga.cover}`}
              alt={`${manga.title} Cover`}
              className="object-cover blur-sm"
            />
          ) : (
            <div className="w-full h-full bg-primary-foreground" />
          )}
          <div className="absolute inset-0 bg-gradient-to-r from-black opacity-65" />
        </section>

        {/* Manga image section */}
        <section className="-translate-y-1/2 px-2 mx-2 md:px-6 md:mx-10 grid grid-cols-[.6fr_1fr] md:grid-cols-[.3fr_1fr] lg:grid-cols-[.2fr_1fr] gap-4">
          <MangaImage priority manga={manga} className="shadow-md" />

          <div className="grid grid-rows-[1fr_.7fr] md:grid-rows-[1fr_.8fr_auto]">
            {/* <div className="max-sm:hidden" /> */}
            <div className="relative">
              <h1 className="text-white text-2xl md:text-4xl lg:text-5xl max-sm:max-h-16 max-sm:active:max-h-none max-sm:leading-6 overflow-hidden font-bold drop-shadow-xl">
                {manga.title}
              </h1>
              <h1 className="absolute bottom-5 left-0.5 text-white font-normal text-md sm:text-base sm:truncate flex-shrink-0">
                {manga.author}
              </h1>
            </div>

            <div className="flex flex-wrap items-start gap-2">
              <MangaAction manga={manga} />
            </div>

            {/* <MangaSubInfo mangaId={manga.id} /> */}
          </div>
        </section>

        {/* Action section */}
        {/* <section className="-mt-14 md:-mt-24 lg:-mt-[6.5rem] px-2 mx-1 md:px-6 md:mx-9 flex flex-wrap items-center gap-5">
                    <MangaAction manga={manga} />
                </section> */}

        {/* Info section */}
        <section className="mx-1 md:px-4 md:mx-9 -mt-20 space-y-8">
          <div className="p-3 rounded-md md:bg-primary-foreground/95 space-y-2 h-fit">
            {/* <MangaInfo manga={manga} /> */}
            <div className="flex justify-start ">
              <h1 className="font-semibold">Thể loại: </h1>
              <TagWrapper className="px-2">
                {manga.tags.map((tag, i) => (
                  <li key={i}>
                    <Link
                      href={`/advanced-search?include=${tag}`}
                      className="block p-0.5 rounded-md font-medium text-[.75rem] bg-red-300 text-primary-foreground"
                    >
                      {tag}
                    </Link>
                  </li>
                ))}
              </TagWrapper>
            </div>
            <p>
              <span className="font-semibold">Mô tả: </span>
              {manga.description}
            </p>
            <p>
              <span className="font-semibold">Lượt xem: </span>
              {manga.totalViews}
            </p>
            {/* <p>
              <span className="font-semibold">Lượt thích: </span>
              {manga.totalViews}
            </p> */}
          </div>
        </section>

        {/* <section className="mx-1 md:px-4 md:mx-9">
          <div className="p-2 md:p-4 rounded-lg bg-primary-foreground/95">
            <ChapterList manga={manga} />
          </div>
        </section> */}

        <section className="mx-1 md:px-4 md:mx-9 space-y-8">
          <div className="p-2 rounded-md md:bg-primary-foreground/95">
            <Accordion type="multiple" defaultValue={["chapter"]}>
              <AccordionItem value="chapter">
                <AccordionTrigger>
                  Danh sách chương & Bình luận
                </AccordionTrigger>
                <AccordionContent>
                  <div className="p-2 md:p-4 rounded-lg bg-primary-foreground/95">
                    <ChapterList manga={manga} />
                  </div>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="other">
                <AccordionTrigger>Cùng người đăng</AccordionTrigger>
                <AccordionContent asChild>
                  {/* <ul className="space-y-3">
                      {manga.creator.manga.map((otherManga) => (
                        <li key={otherManga.id}>
                          <Link
                            href={`/manga/${otherManga.slug}`}
                            className="grid grid-cols-[.3fr_1fr] gap-3 transition-colors rounded-md group hover:bg-zinc-800"
                          >
                            <MangaImage
                              manga={otherManga}
                              sizes="(max-width: 640px) 22vw, 10vw"
                              className="transition-transform group-hover:scale-105"
                            />

                            <div className="space-y-0.5">
                              <p className="text-lg font-semibold">
                                {otherManga.name}
                              </p>
                              <p className="line-clamp-3">
                                {otherManga.review}
                              </p>
                            </div>
                          </Link>
                        </li>
                      ))}
                    </ul> */}
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="facebook">
                <AccordionTrigger>Facebook</AccordionTrigger>
                <AccordionContent>
                  <FacebookEmbed
                    facebookLink={
                      "https://www.facebook.com/williams.taylorethan"
                    }
                  />
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="discord">
                <AccordionTrigger>Discord</AccordionTrigger>
                <AccordionContent>
                  <DiscordEmbed discordLink={"https://discord.gg/hvn"} />
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </section>

        {/* Chapter section */}
      </main>
    </>
  );
};
export default page;

function generateJsonLd(manga: Pick<Manga, "title" | "cover">, slug: string) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    mainEntityOfPage: `${process.env.NEXTAUTH_URL}/manga/${slug}`,
    headline: `${manga.title}`,
    description: `Đọc ${manga.title} | BLTX`,
    image: {
      "@type": "ImageObject",
      url: `${manga.cover}`,
      width: 1280,
      height: 960,
    },
  };
}

export async function generateMetadata({
  params,
}: pageProps): Promise<Metadata> {
  const manga = await getManga(params.mangaId);

  return {
    title: `${manga.title} - BLTX`,
    description: `Đọc Manga ${manga.title} | BLTX`,
    keywords: ["Manga", manga.title, "BLTX", "Bác Lệ Thần Xã"],
  };
}
