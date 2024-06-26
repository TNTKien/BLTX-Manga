"use client";

import { useDirectionReader } from "@/hooks/use-direction-reader";
import { useLayoutReader } from "@/hooks/use-layout-reader";
import { useNavChapter } from "@/hooks/use-nav-chapter";
import { useHotkeys, usePrevious } from "@mantine/hooks";
import type { Chapter } from "@prisma/client";
import useEmblaCarousel from "embla-carousel-react";
import { WheelGesturesPlugin } from "embla-carousel-wheel-gestures";
import dynamic from "next/dynamic";
import { FC, useState } from "react";
import Context from "./Context";
import Viewer from "./Viewer";

const Top = dynamic(() => import("./Top"), { ssr: false });
const Bottom = dynamic(() => import("./Bottom"), { ssr: false });
const Menu = dynamic(() => import("./Menu"), { ssr: false });

interface ReaderProps {
  prevChapter: Pick<Chapter, "id" | "title" | "pages" | "mangaId"> | null;
  nextChapter: Pick<Chapter, "id" | "title" | "pages" | "mangaId"> | null;
  chapter: Pick<Chapter, "id" | "title" | "pages" | "mangaId"> & {
    chapters: Pick<Chapter, "id" | "title" | "pages" | "mangaId">[];
  };
  mangaTitle: string;
}

useEmblaCarousel.globalOptions = {
  align: "start",
};

const Reader: FC<ReaderProps> = ({
  prevChapter,
  nextChapter,
  chapter,
  mangaTitle,
}) => {
  const menuConfig = useState(false);
  const commentConfig = useState(false);
  const infoConfig = useState(false);
  const { layout, setLayout } = useLayoutReader();
  const { direction, setDirection } = useDirectionReader();
  const { isEnabled, setContinuous, goToPrev, goToNext } = useNavChapter({
    prevChapter,
    nextChapter,
    mangaId: `/manga/${chapter.mangaId}`,
  });
  const [pressedKey, setPressedKey] = useState<
    "UP" | "DOWN" | "LEFT" | "RIGHT" | null
  >(null);
  const prevPressedKey = usePrevious(pressedKey);

  const [emblaRef, embla] = useEmblaCarousel(
    {
      inViewThreshold: layout === "VERTICAL" ? 0.1 : 0.5,
      axis: layout === "VERTICAL" ? "y" : "x",
      slidesToScroll: layout === "DOUBLE" ? 2 : 1,
      direction: direction === "rtl" && layout !== "VERTICAL" ? "rtl" : "ltr",
      dragFree: layout === "VERTICAL",
    },
    [WheelGesturesPlugin()]
  );

  // Key binding
  useHotkeys([
    [
      "ctrl+shift+C",
      () => commentConfig[1]((prev) => !prev),
      { preventDefault: true },
    ],
    ["ctrl+M", () => menuConfig[1]((prev) => !prev)],
    ["ctrl+I", () => infoConfig[1]((prev) => !prev)],
    [
      "Home",
      () => {
        if (!embla) return;
        embla.scrollTo(0, true);
      },
      {
        preventDefault: true,
      },
    ],
    [
      "End",
      () => {
        if (!embla) return;
        embla.scrollTo(
          layout === "DOUBLE"
            ? Math.floor(Math.abs(embla.slideNodes().length / 2 - 1))
            : embla.slideNodes().length - 2,
          true
        );
      },
      { preventDefault: true },
    ],
    [
      "ctrl+shift+{",
      () => {
        if (layout === "SINGLE") setLayout("DOUBLE");
        else if (layout === "DOUBLE") setLayout("VERTICAL");
        else setLayout("SINGLE");
      },
    ],
    [
      "ctrl+shift+}",
      () => {
        if (direction === "ltr") setDirection("rtl");
        else setDirection("ltr");
      },
    ],
    ["ctrl+Y", () => setContinuous(isEnabled === "false" ? "true" : "false")],
    [
      "ArrowLeft",
      (e) => {
        if (layout === "VERTICAL") return goToPrev();

        if (!embla?.canScrollPrev() && prevPressedKey === "LEFT" && !e.repeat) {
          return goToPrev();
        }

        if (direction === "ltr") {
          if (embla?.canScrollPrev()) {
            embla.scrollPrev();
          } else goToPrev();
        } else {
          if (embla?.canScrollNext()) {
            embla.scrollNext();
          } else goToNext();
        }

        setPressedKey("LEFT");
      },
    ],
    [
      "ArrowRight",
      (e) => {
        if (layout === "VERTICAL") return goToNext();

        if (
          !embla?.canScrollNext() &&
          prevPressedKey === "RIGHT" &&
          !e.repeat
        ) {
          return goToNext();
        }

        if (direction === "ltr") {
          if (embla?.canScrollNext()) {
            embla.scrollNext();
          } else goToNext();
        } else {
          if (embla?.canScrollPrev()) {
            embla.scrollPrev();
          } else goToPrev();
        }

        setPressedKey("RIGHT");
      },
    ],
    [
      "ArrowUp",
      (e) => {
        if (layout !== "VERTICAL") return goToPrev();

        const engine = embla?.internalEngine();
        if (!engine) return;

        const location = engine.location.get();
        const limit = engine.limit;
        const distance = location > limit.max ? location + 50 : 50;

        if (!limit.reachedMax(location + distance)) {
          engine.animation.stop();
          engine.location.add(distance);
          engine.translate.to(location + distance);
        } else if (prevPressedKey === "UP" && !e.repeat) {
          return goToPrev();
        }

        setPressedKey("UP");
      },
    ],
    [
      "ArrowDown",
      (e) => {
        if (layout !== "VERTICAL") return goToNext();

        const engine = embla?.internalEngine();
        if (!engine) return;

        const location = engine.location.get();
        const limit = engine.limit;
        const distance = location > limit.max ? location + 50 : 50;

        if (!limit.reachedMin(location - distance)) {
          engine.animation.stop();
          engine.location.subtract(distance);
          engine.translate.to(location - distance);
        } else if (prevPressedKey === "DOWN" && !e.repeat) {
          return goToNext();
        }

        setPressedKey("DOWN");
      },
    ],
  ]);

  return (
    <Context
      menuConfig={menuConfig}
      commentConfig={commentConfig}
      infoConfig={infoConfig}
      layoutConfig={{ layout, setLayout }}
      directionConfig={{ direction, setDirection }}
      continuousConfig={{ isEnabled, setContinuous }}
    >
      <Top
        href={`/manga/${chapter.mangaId}`}
        title={`${!!chapter.title ? `${chapter.title}` : ""}`}
      />

      <section className="relative w-full h-full overflow-hidden">
        <Viewer
          emblaRef={emblaRef}
          images={chapter.pages}
          nextChapterUrl={
            !!nextChapter
              ? `/chapter/${chapter.mangaId}/${nextChapter.id}`
              : `/manga/${chapter.mangaId}`
          }
          hasNextChapter={!!nextChapter}
        />
        <Menu
          chapterId={chapter.id}
          title={`${!!mangaTitle ? `${mangaTitle}` : ""}`}
          prevChapterUrl={
            !!prevChapter
              ? `/chapter/${chapter.mangaId}/${prevChapter.id}`
              : `/manga/${chapter.mangaId}`
          }
          nextChapterUrl={
            !!nextChapter
              ? `/chapter/${chapter.mangaId}/${nextChapter.id}`
              : `/manga/${chapter.mangaId}`
          }
          chapterList={chapter.chapters}
        />
      </section>

      <Bottom
        embla={embla}
        chapterId={chapter.id}
        totalImages={chapter.pages.length}
      />
    </Context>
  );
};

export default Reader;
