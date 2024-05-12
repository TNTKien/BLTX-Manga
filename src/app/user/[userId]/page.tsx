import UserAvatar from "@/components/User/UserAvatar";
import UserBanner from "@/components/User/UserBanner";
import Username from "@/components/User/Username";
import { getAuthSession } from "@/lib/auth";
import { db } from "@/lib/db";
import Link from "next/link";
import MangaImage from "@/components/Manga/components/MangaImage";
import MangaCard from "@/components/Manga/components/MangaCard";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/Accordion";
import format from "date-fns/format";
import vi from "date-fns/locale/vi";
import { Users2, Wifi } from "lucide-react";
import type { Metadata } from "next";
import dynamic from "next/dynamic";
import { notFound } from "next/navigation";
import { FC } from "react";

interface pageProps {
  params: {
    userId: string;
  };
}

export async function generateMetadata({
  params,
}: pageProps): Promise<Metadata> {
  try {
    const user = await db.user.findUnique({
      where: {
        id: params.userId,
      },
      select: {
        id: true,
        username: true,
      },
    });

    if (!user)
      return {
        title: "404 Not found",
      };

    return {
      title: {
        default: user.username ?? "Người dùng",
        absolute: user.username ?? "Người dùng",
      },
    };
  } catch (error) {
    return {
      title: "404 Not found",
    };
  }
}

const page: FC<pageProps> = async ({ params }) => {
  try {
    const session = await getAuthSession();
    const user = await db.user.findUnique({
      where: {
        id: params.userId,
      },
      select: {
        id: true,
        username: true,
        _count: {
          select: {
            manga: true,
          },
        },
        manga: {
          orderBy: {
            createdAt: "desc",
          },
        },
      },
    });

    if (!user) return notFound();
    //console.log(user.manga);

    return (
      <>
        <div className="relative">
          <UserBanner
            sizes="(max-width: 1500px) 100vw"
            className="rounded-md bg-muted"
          />

          <UserAvatar
            user={user}
            className="absolute w-24 h-24 md:w-40 md:h-40 bottom-0 left-4 translate-y-1/2 border-4 bg-muted border-primary-foreground"
          />
          {/* <Username
          user={user}
          className="text-start text-3xl font-semibold ml-48"
        /> */}
        </div>

        <div className="mt-16 lg:mt-20 p-4 rounded-md dark:bg-zinc-800">
          <Username user={user} className="text-start text-lg font-semibold" />

          <hr className="h-0.5 rounded-full dark:bg-zinc-50 my-4" />

          {/* <div className="flex flex-wrap justify-between items-center gap-2">
         

          
        </div> */}

          <hr className="h-0.5 rounded-full dark:bg-zinc-50 my-4" />

          {/* <div className="flex flex-wrap justify-between items-center gap-2">
          <dl className="flex items-center gap-1.5">
            <dt>Truyện đã đăng: </dt>
            <dd>{user._count.manga}</dd>
          </dl>
        </div>

        <hr className="h-0.5 rounded-full dark:bg-zinc-50 my-4" /> */}

          <Accordion type="multiple" defaultValue={["chapter"]}>
            <AccordionItem value="chapter">
              <AccordionTrigger>Truyện đã đăng</AccordionTrigger>
              <AccordionContent asChild>
                <ul className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {user.manga.map((m) => (
                    <MangaCard key={m.id} manga={m} />
                  ))}
                </ul>
              </AccordionContent>
            </AccordionItem>
          </Accordion>

          {/* <dl className="flex items-center gap-1.5">
          <dt>Gia nhập:</dt>
          <dd>
            <time dateTime={user.createdAt.toDateString()}>
              {format(new Date(user.createdAt), "d MMM y", { locale: vi })}
            </time>
          </dd>
        </dl> */}
        </div>
      </>
    );
  } catch (error) {
    return notFound();
  }
};

export default page;
