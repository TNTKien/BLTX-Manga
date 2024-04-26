import { cn } from "@/lib/utils";
import type { User } from "@prisma/client";
import Image from "next/image";
import { FC } from "react";

interface UserBannerProps extends React.HTMLAttributes<HTMLImageElement> {
  priority?: boolean;
  quality?: number;
  sizes?: string;
}

const UserBanner: FC<UserBannerProps> = ({
  priority = true,
  quality = 75,
  sizes = "30vw",
  className,
  ...props
}) => {
  return (
    <div className="relative aspect-[2/0.75] md:aspect-[9/1.25]">
      <Image
        fill
        priority={priority}
        sizes={sizes}
        quality={quality}
        src={"/static/banner.png"}
        alt="User Banner"
        className={cn("object-cover rounded-md", className)}
        {...props}
      />
    </div>
  );
};

export default UserBanner;
