import axiosInstance from "@/lib/axios";
import { Manga } from "@prisma/client";
import MangaCardSkeleton from "@/components/Skeleton/MangaCardSkeleton";
import LeaderboardSkeletion from "@/components/Skeleton/LeaderboardSkeletion";
import { MoveRight } from 'lucide-react';
import Link from 'next/link';
import dynamic from 'next/dynamic';

async function getMangas() {
  const { data } = await axiosInstance.get("/api/manga");
  return data.data as Manga[];
}
const RandomManga = dynamic(() => import('@/components/Manga/RandomManga'), {
});

const LatestManga = dynamic(() => import('@/components/Manga/LatestManga'), {
  loading: () => <MangaCardSkeleton />,
});

const Leaderboard = dynamic(() => import('@/components/LeaderBoard'), {
  loading: () => <LeaderboardSkeletion />,
});

export default async function Home() {
  return (
    <main className="pb-4 space-y-12 md:space-y-16">

      <section className="min-w-0 h-fit md:ml-6 p-3 space-y-3 rounded-lg bg-gradient-to-b from-background/40">
        <h1 className="text-2xl font-semibold">Truyện ngẫu nhiên</h1>
        <RandomManga />
      </section>

      <div className="grid grid-cols-1 md:grid-cols-[1fr_.4fr] gap-10 md:gap-8">
        {/* Left section */}
        <section className="min-w-0 h-fit md:ml-6 p-3 space-y-12 rounded-lg bg-gradient-to-b from-background/40">
          {/* Recommendation */}

          {/* Latest */}
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <h1 className="text-2xl font-semibold">Mới cập nhật</h1>
              <Link href="/latest" className="group flex items-center gap-1.5">
                <span className="transition-all duration-300 opacity-0 translate-x-1/2 group-hover:opacity-100 group-hover:translate-x-0">
                  Xem thêm
                </span>
                <MoveRight className="w-8 h-8" />
              </Link>
            </div>
            <LatestManga />
          </div>
        </section>

        {/* Right section */}
        <section className="min-w-0 h-fit p-3 space-y-12 rounded-lg md:rounded-l-lg md:rounded-r-lg bg-gradient-to-b from-background/40">
          {/* Leaderboard */}
          <div className="space-y-3">
            <h1 className="text-2xl font-semibold">Bảng xếp hạng</h1>
            <Leaderboard />
          </div>

          {/* <div className="space-y-3">
            <h1 className="text-2xl font-semibold">Bài viết mới nhất</h1>

          </div> */}
        </section>
      </div>
    </main>
  );
}
