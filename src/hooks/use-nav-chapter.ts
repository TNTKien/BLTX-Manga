import type { Chapter } from "@prisma/client";
import { useRouter } from "next/navigation";
import { useCallback, useRef, useState } from "react";

export type ContinuousType = "true" | "false";

type navChapterProps = {
  prevChapter: Pick<Chapter, "id" | "title"> | null;
  nextChapter: Pick<Chapter, "id" | "title"> | null;
  mangaId: string;
};

const useNavChapter = ({
  prevChapter,
  nextChapter,
  mangaId,
}: navChapterProps) => {
  const router = useRouter();
  const savedContinuous = useRef(
    (localStorage.getItem("continuous") as ContinuousType) ?? "true"
  );
  const [isEnabled, setIsEnabled] = useState<ContinuousType>(
    savedContinuous.current
  );

  const setContinuous = useCallback((state: ContinuousType) => {
    localStorage.setItem("continuous", state);
    setIsEnabled(state);
  }, []);
  const goToPrev = useCallback(
    () =>
      isEnabled === "false"
        ? null
        : router.push(!!prevChapter ? `/chapter/${prevChapter.id}` : mangaId),
    [isEnabled, router, prevChapter, mangaId]
  );
  const goToNext = useCallback(
    () =>
      isEnabled === "false"
        ? null
        : router.push(!!nextChapter ? `/chapter/${nextChapter.id}` : mangaId),
    [isEnabled, mangaId, nextChapter, router]
  );

  return {
    isEnabled,
    setContinuous,
    goToPrev,
    goToNext,
  };
};

export { useNavChapter };
