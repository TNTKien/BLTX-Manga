import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/Tabs";
import type { Manga } from "@prisma/client";
import { ChevronDown, List, ListTree, MessagesSquare } from "lucide-react";
import dynamic from "next/dynamic";
import { FC } from "react";
import NormalSkeleton from "../../Skeleton/NormalSkeleton";

const Normal = dynamic(() => import("./Normal"), {
  loading: () => <NormalSkeleton />,
});

interface ChapterListProps {
  manga: Pick<Manga, "id">;
}

const ChapterList: FC<ChapterListProps> = async ({ manga }) => {
  return (
    <Tabs defaultValue="normal" className="space-y-4">
      <TabsList>
        <TabsTrigger
          aria-label="manga chapters normal style"
          value="normal"
          className="w-20"
        >
          <List />
        </TabsTrigger>

        <TabsTrigger
          aria-label="manga comments"
          value="comment"
          className="w-20"
        >
          <MessagesSquare />
        </TabsTrigger>
      </TabsList>

      <TabsContent value="normal">
        <Normal mangaId={manga.id} />
      </TabsContent>

      <TabsContent
        value="comment"
        forceMount
        className='data-[state="inactive"]:hidden space-y-12'
      ></TabsContent>
    </Tabs>
  );
};

export default ChapterList;
