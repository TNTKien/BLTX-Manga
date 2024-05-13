"use client";

import MangaAuthorSkeleton from "@/components/Skeleton/MangaAuthorSkeleton";
import MangaCoverSkeleton from "@/components/Skeleton/MangaCoverSkeleton";
import MangaImageSkeleton from "@/components/Skeleton/MangaImageSkeleton";
import MangaTagSkeleton from "@/components/Skeleton/MangaTagSkeleton";
import { Button } from "@/components/ui/Button";
import { Form } from "@/components/ui/Form";
import { useCustomToast } from "@/hooks/use-custom-toast";
import { toast } from "@/hooks/use-toast";
import { Tags } from "@/lib/query";
import {
  MangaUploadPayload,
  MangaUploadValidator,
} from "@/lib/validators/manga";
import { Divider } from "@nextui-org/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import MangaDescForm from "./MangaDescFormField";
import MangaNameForm from "./MangaNameFormField";
import axiosInstance from "@/lib/axios";
import { Manga } from "@prisma/client";
import { FC } from "react";
import { baseURL } from "@/utils/config";

const MangaImageForm = dynamic(() => import("./MangaImageFormField"), {
  ssr: false,
  loading: () => <MangaImageSkeleton />,
});
const MangaTagForm = dynamic(() => import("./MangaTagFormField"), {
  ssr: false,
  loading: () => <MangaTagSkeleton />,
});
const MangaAuthorForm = dynamic(() => import("./MangaAuthorFormField"), {
  ssr: false,
  loading: () => <MangaAuthorSkeleton />,
});

interface EditMangaProps {
  manga: Pick<
    Manga,
    "id" | "title" | "cover" | "description" | "tags" | "author"
  >;
}
const EditManga: FC<EditMangaProps> = ({ manga }) => {
  const router = useRouter();
  const {
    notFoundToast,
    loginToast,
    serverErrorToast,
    successToast,
    verifyToast,
  } = useCustomToast();

  const form = useForm<MangaUploadPayload>({
    resolver: zodResolver(MangaUploadValidator),
    defaultValues: {
      cover: baseURL + manga.cover,
      title: manga.title,
      author: manga.author.join(", "),
      description: manga.description,
      tags: manga.tags,
    },
  });

  const { mutate: Update, isPending: isUpdatingManga } = useMutation({
    mutationFn: async (values: MangaUploadPayload) => {
      const { title, description, author, cover, tags } = values;

      const form = new FormData();

      if (cover.startsWith("blob")) {
        const blob = await fetch(cover).then((res) => res.blob());

        if (blob.size > 4 * 1000 * 1000) throw new Error("EXCEEDED_IMAGE_SIZE");

        form.append("cover", blob, "cover.jpg");
      } else {
        form.append("cover", cover.replace(baseURL, ""));
      }

      form.append("title", title);

      form.append("description", description);

      form.append("author", author);

      form.append("status", "ONGOING");

      tags.map((t) => form.append("tags", t.replace(/ /g, "_")));

      console.log(form.get("cover"));

      const { data } = await axiosInstance.put(`/api/manga/${manga.id}`, form);

      return data;
    },
    onError: (e) => {
      if (e instanceof AxiosError) {
        if (e.response?.status === 401) return loginToast();
        if (e.response?.status === 404) return notFoundToast();
        if (e.response?.status === 400) return verifyToast();
        if (e.response?.status === 403)
          return toast({
            title: "Yêu cầu quyền Upload",
            description: "Bạn cần có quyền upload để upload truyện!",
            variant: "destructive",
          });
      }

      if (e instanceof Error && e.message === "EXCEEDED_IMAGE_SIZE") {
        return toast({
          title: "Quá kích cỡ",
          description: "Chỉ nhận ảnh dưới 4MB",
          variant: "destructive",
        });
      }

      return serverErrorToast();
    },
    onSuccess: () => {
      router.push("/manage/mangas");
      router.refresh();

      return successToast();
    },
  });
  const onSubmitHandler = (values: MangaUploadPayload) => {
    const payload: MangaUploadPayload = {
      ...values,
      description: values.description ?? manga.description,
    };
    Update(payload);
  };

  return (
    <>
      <h1 className="text-2xl font-semibold">SỬA TRUYỆN</h1>
      <Divider className="my-4" />
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmitHandler)}
          className="space-y-6"
        >
          <div className="relative grid grid-cols-1 md:grid-cols-[.3fr_1fr] gap-7">
            <div className="row-span-full">
              <MangaImageForm form={form} exsistImage={manga.cover} />
            </div>
            <div className="h-full">
              <MangaNameForm form={form} />

              <MangaAuthorForm form={form} />

              <MangaTagForm
                form={form}
                existTags={manga.tags.map((t) => t.replace(/_/g, " "))}
              />

              <MangaDescForm form={form} />
            </div>
          </div>

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
              isLoading={isUpdatingManga}
              disabled={isUpdatingManga}
            >
              Sửa
            </Button>
          </div>
        </form>
      </Form>
    </>
  );
};

export default EditManga;
