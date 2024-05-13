import MangaUploadSkeleton from "@/components/Skeleton/MangaUploadSkeleton";
import { Metadata } from "next";
import dynamic from "next/dynamic";

const MangaUpload = dynamic(() => import("@/components/Upload/Manga"), {
  ssr: false,
  loading: () => <MangaUploadSkeleton />,
});

export const metadata: Metadata = {
  title: "Thêm truyện mới",
};

const page = async () => {
  return (
    <main className="container p-1 mb-10 space-y-10">
      <section className="p-3 mx-8 rounded-md dark:bg-zinc-900/60 ">
        <MangaUpload />
      </section>
    </main>
  );
};

export default page;
