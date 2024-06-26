"use client";

import { UpdateView } from "@/components/Chapter/Reader/ViewAction";
import { useInterval } from "@mantine/hooks";
import { useCallback, useEffect, useRef, useState } from "react";

const MAXIUM_PAGE = 10;
const MIN_TIME = 25;

const useViewCalc = (
  chapterId: string,
  totalImages: number,
  mangaId: string
) => {
  const [seconds, setSeconds] = useState(0);
  const interval = useInterval(() => setSeconds((s) => s + 1), 1000);
  const threshold = useRef(
    totalImages > MAXIUM_PAGE ? MIN_TIME : Math.floor(totalImages * 0.7 * 3)
  );

  useEffect(() => {
    interval.start();

    return () => interval.stop();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const calcView = useCallback(() => {
    if (!interval.active || seconds < threshold.current) return;

    interval.stop();
    setTimeout(
      () =>
        UpdateView(
          chapterId,
          new Date(
            new Date().toLocaleString("en-US", { timeZone: "Asia/Ho_Chi_Minh" })
          ).getTime(),
          mangaId
        ),
      0
    );
  }, [chapterId, interval, seconds]);

  return { calcView };
};

export { useViewCalc };
