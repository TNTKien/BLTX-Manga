"use server";

import { db } from "@/lib/db";
import { limiter } from "@/lib/rate-limit";
import { requestIp } from "@/lib/request-ip";
import { headers } from "next/headers";
import type { Chapter } from "@prisma/client";
import axiosInstance from "@/lib/axios";
import axios from "axios";

async function getChapter(chapterId: string, mangaId: string) {
  const { data } = await axiosInstance.get(
    `/api/chapter/${mangaId}/${chapterId}`
  );
  return data.data as Chapter;
}

async function addView(mangaId: string) {
  const { data } = await axiosInstance.post(`/api/view`, {
    mangaId: mangaId,
  });
  return data.message;
}

export async function UpdateView(
  chapterId: string,
  stime: number,
  mangaId: string
) {
  if (Math.round(Date.now() - stime) > 1000 * 60) return;

  const HeadersList = new Headers(headers());
  const ip = requestIp(HeadersList) ?? "127.0.0.1";

  try {
    await limiter.check(HeadersList, 50, ip);

    const chapter = await getChapter(chapterId, mangaId);
    await addView(chapter.mangaId);
  } catch (error) {
    return;
  }
}
