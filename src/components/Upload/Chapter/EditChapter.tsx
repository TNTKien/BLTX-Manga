"use client";

import ChapterImageSkeleton from "@/components/Skeleton/ChapterImageSkeleton";
import { Button } from "@/components/ui/Button";
import { Form } from "@/components/ui/Form";
import { Progress } from "@/components/ui/Progress";
import { useCustomToast } from "@/hooks/use-custom-toast";
import { toast } from "@/hooks/use-toast";
import {
  ChapterUploadValidator,
  type ChapterUploadPayload,
} from "@/lib/validators/chapter";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { FC, useState } from "react";
import { useForm } from "react-hook-form";
import ChapterNameForm from "./ChapterNameFormField";
import { Divider } from "@nextui-org/react";
import axiosInstance from "@/lib/axios";
import type { Chapter } from "@prisma/client";
import { baseURL } from "@/utils/config";

const ChapterImageFormField = dynamic(() => import("./ChapterImageFormField"), {
  ssr: false,
  loading: () => <ChapterImageSkeleton />,
});

interface EditChapterProps {
  chapter: Pick<Chapter, "id" | "title" | "pages" | "mangaId" | "updatedAt">;
}

const EditChapter: FC<EditChapterProps> = ({ chapter }) => {
  const { loginToast, notFoundToast, serverErrorToast, successToast } =
    useCustomToast();
  const router = useRouter();
  const [uploadProgress, setUploadProgres] = useState<number | null>(null);

  const form = useForm<ChapterUploadPayload>({
    resolver: zodResolver(ChapterUploadValidator),
    defaultValues: {
      title: chapter.title,
      pages: chapter.pages.map((page) => ({
        src: `${baseURL}/${page}`,
        name: page.split("/")[page.split("/").length - 1],
      })),
    },
  });

  const { mutate: upload, isPending: isChapterUpdate } = useMutation({
    mutationFn: async (values: ChapterUploadPayload) => {
      const { pages, title } = values;

      const form = new FormData();

      for (let i = 0; i < pages.length; i++) {
        const blob = await fetch(pages[i].src).then((res) => res.blob());
        const imageType = blob.type.split("/")[1];
        const fileName = `${i}.${imageType}`;
        form.append("pages", blob, fileName);
      }

      !!title && form.append("title", title);

      await axiosInstance.put(
        `/api/chapter/${chapter.mangaId}/${chapter.id}`,
        form,
        {
          onUploadProgress(progressEvent) {
            const percentCompleted = Math.floor(
              (progressEvent.loaded * 100) / progressEvent.total!
            );
            setUploadProgres(percentCompleted);
          },
        }
      );
    },
    onError: (e) => {
      setUploadProgres(null);

      if (e instanceof AxiosError) {
        if (e.response?.status === 401) return loginToast();
        if (e.response?.status === 404) return notFoundToast();
        if (e.response?.status === 403)
          return toast({
            title: "Lỗi",
            description: "Bạn không phải chủ sở hữu của truyện này",
            variant: "destructive",
          });
      }

      return serverErrorToast();
    },
    onSuccess: () => {
      router.push(`/manage/mangas/${chapter.mangaId}/chapters`);
      router.refresh();
      setUploadProgres(null);

      return successToast();
    },
  });

  const onSubmitHandler = (values: ChapterUploadPayload) => {
    upload(values);
  };

  return (
    <>
      <h1 className="text-2xl font-semibold">SỬA CHAPTER</h1>
      <Divider className="my-4" />
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmitHandler)}
          className="space-y-6"
        >
          <ChapterNameForm form={form} />

          <ChapterImageFormField
            form={form}
            initialImages={chapter.pages.map((page) => ({
              src: `${baseURL}${page}`,
              name: page.split("/")[page.split("/").length - 1],
            }))}
            isUploading={isChapterUpdate}
          />

          {!!uploadProgress &&
            (uploadProgress >= 100 ? (
              <p className="text-center">Đang gửi đến Server...</p>
            ) : (
              <Progress value={uploadProgress} />
            ))}

          <div className="flex flex-wrap justify-end items-center gap-2">
            <Button
              type="button"
              tabIndex={0}
              variant={"destructive"}
              onClick={() => router.back()}
            >
              Quay lại
            </Button>
            <Button
              type="submit"
              tabIndex={1}
              isLoading={isChapterUpdate}
              disabled={isChapterUpdate}
            >
              Sửa
            </Button>
          </div>
        </form>
      </Form>
    </>
  );
};

export default EditChapter;
