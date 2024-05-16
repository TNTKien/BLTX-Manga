"use client";

import { buttonVariants } from "@/components/ui/Button";
import { useCustomToast } from "@/hooks/use-custom-toast";
import { usePrevious } from "@mantine/hooks";
import { useMutation } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { Bookmark, BookmarkMinus } from "lucide-react";
import { useRouter } from "next/navigation";
import { FC, useState } from "react";
import axiosInstance from "@/lib/axios";
import { toast } from "@/hooks/use-toast";

interface MangaFollowProps {
  mangaId: string;
  isFollow: boolean;
}

const MangaFollow: FC<MangaFollowProps> = ({ mangaId, isFollow }) => {
  const {
    loginToast,
    notFoundToast,
    rateLimitToast,
    serverErrorToast,
    successToast,
  } = useCustomToast();
  const router = useRouter();

  const [isFollowed, setFollowed] = useState(isFollow);
  const prevFollow = usePrevious(isFollowed);

  const form = new FormData();
  form.append("mangaId", mangaId);

  const { mutate: Toggle, isPending: isToggling } = useMutation({
    mutationKey: ["follow", mangaId],
    mutationFn: async (type: "FOLLOW" | "UNFOLLOW") => {
      if (type === "FOLLOW") {
        await axiosInstance.post(`/api/user/follow`, form);
      } else {
        await axiosInstance.post(`/api/user/unfollow`, form);
      }
    },
    onError: (err) => {
      setFollowed(prevFollow ?? false);

      if (err instanceof AxiosError) {
        if (err.response?.status === 401) return loginToast();
        if (err.response?.status === 404) return notFoundToast();
        if (err.response?.status === 429) return rateLimitToast();
      }

      return serverErrorToast();
    },
    onMutate: (type) => {
      if (type === "FOLLOW") return setFollowed(true);
      else return setFollowed(false);
    },
    onSuccess: () => {
      toast({
        title: isFollowed
          ? "Đã thêm vào danh sách theo dõi ❤️"
          : "Đã bỏ theo dõi 💔",
      });
      return router.refresh();
    },
  });

  return isFollowed ? (
    <button
      className={buttonVariants({
        className: "gap-1",
      })}
      disabled={isToggling}
      onClick={() => Toggle("UNFOLLOW")}
    >
      <BookmarkMinus /> Bỏ theo dõi
    </button>
  ) : (
    <button
      className={buttonVariants({
        className: "gap-1",
      })}
      disabled={isToggling}
      onClick={() => Toggle("FOLLOW")}
    >
      <Bookmark /> Theo dõi
    </button>
  );
};

export default MangaFollow;
