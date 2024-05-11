import { getAuthSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { notFound, redirect } from "next/navigation";
import dynamic from "next/dynamic";
import TableSkeleton from "@/components/Skeleton/TableSkeleton";
import Link from "next/link";

const MangaTable = dynamic(() => import("@/components/Table/Manga"), {
  ssr: false,
  loading: () => <TableSkeleton />,
});

const page = async () => {
  const session = await getAuthSession();
  //console.log(session);
  if (!session) return redirect(`${process.env.MAIN_URL}/sign-in`);

  const manga = await db.user
    .findUnique({
      where: {
        id: session.id,
      },
    })
    .manga({
      select: {
        id: true,
        title: true,
        updatedAt: true,
      },
    });
  if (!manga) return notFound();

  return (
    <main className="container max-sm:px-2 mb-10">
      <section className="p-2 rounded-md dark:bg-zinc-900/60">
        {!!manga.length ? (
          <MangaTable data={manga} />
        ) : (
          <p>
            Bạn chưa có manga nào. Hãy{" "}
            <a
              href="/manage/upload"
              className="text-sky-500 underline decoration-sky-500"
            >
              upload
            </a>{" "}
            một bộ ngay thôi nhé!
          </p>
        )}
      </section>
    </main>
  );
};

export default page;