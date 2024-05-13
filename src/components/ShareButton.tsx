"use client";

import { Icons } from "@/components/Icons";
import { Button, buttonVariants } from "@/components/ui/Button";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/Dialog";
import { cn } from "@/lib/utils";
import { useClipboard } from "@mantine/hooks";
import { Check, Copy, Facebook, Share2 } from "lucide-react";
import { FacebookShareButton, TwitterShareButton } from "next-share";
import { FC } from "react";

interface PostShareButtonProps extends React.HTMLAttributes<HTMLButtonElement> {
  url: string;
  title: string;
}

const ShareButton: FC<PostShareButtonProps> = ({
  url,
  title,
  className,
  ...props
}) => {
  const clipboard = useClipboard({ timeout: 500 });

  return (
    <Dialog>
      <DialogTrigger
        className={cn(buttonVariants({ className: "gap-1.5" }), className)}
        {...props}
      >
        <Share2 /> Chia sẻ
      </DialogTrigger>
      <DialogContent>
        <DialogTitle>Chia sẻ</DialogTitle>

        <div className="space-y-6">
          <div className="flex flex-wrap justify-between lg:justify-start items-center gap-6">
            {/* Facebook */}
            <FacebookShareButton
              url={`${process.env.NEXT_PUBLIC_MAIN_URL}${url}`}
              quote={title}
              hashtag="#MangaDex"
              blankTarget
            >
              <Facebook className="w-8 h-8" />
            </FacebookShareButton>

            {/* Twitter */}
            <TwitterShareButton
              url={`${process.env.NEXT_PUBLIC_MAIN_URL}${url}`}
              title={title}
              hashtags={[`${title.split(" ").join("")}`]}
              blankTarget
            >
              <Icons.twitterX className="w-8 h-8 dark:fill-white" />
            </TwitterShareButton>
          </div>

          <div className="grid grid-cols-[1fr_.1fr] items-center gap-3">
            <p className="truncate p-2 rounded-md dark:bg-zinc-800">
              {process.env.NEXT_PUBLIC_MAIN_URL}
              {url}
            </p>
            <Button
              onClick={() =>
                clipboard.copy(`${process.env.NEXT_PUBLIC_MAIN_URL}${url}`)
              }
            >
              {clipboard.copied ? (
                <Check className="w-6 h-6" />
              ) : (
                <Copy className="w-6 h-6" />
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ShareButton;
