import { cn } from "@/lib/utils";
import type { Manga } from "@prisma/client";
import Image from "next/image";
import { FC } from "react";
import { baseURL } from "@/utils/config";

interface MangaImageProps extends React.HTMLAttributes<HTMLImageElement> {
  manga: Pick<Manga, "cover" | "title" | "id">;
  loading?: "eager" | "lazy";
  sizes?: string;
  priority?: boolean;
}

const MangaImage: FC<MangaImageProps> = ({
  manga,
  loading,
  sizes = "30vw",
  priority = false,
  className,
  ...props
}) => {
  return (
    <div className="relative" style={{ aspectRatio: 5 / 7 }}>
      <Image
        loading={loading}
        fill
        sizes={sizes}
        priority={priority}
        quality={50}
        src={`${baseURL}${manga.cover}`}
        alt={`Ảnh bìa ${manga.title}`}
        className={cn("object-cover rounded-md", className)}
        {...props}
      />
    </div>
  );
};

export default MangaImage;
