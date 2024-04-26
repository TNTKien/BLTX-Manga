import { Avatar, AvatarFallback } from "@/components/ui/Avatar";
import type { AvatarProps } from "@radix-ui/react-avatar";
import { User2 } from "lucide-react";
import type { User } from "next-auth";
import Image from "next/image";
import { FC } from "react";

const UserAvatar = ({ ...props }) => {
  return (
    <Avatar {...props}>
      <div className="relative aspect-square ">
        <Image
          fill
          sizes="(max-width: 640px) 15vw, 20vw"
          quality={40}
          src={"/static/user-avt.png"}
          alt="Profile picture"
          className="rounded-full"
        />
      </div>
    </Avatar>
  );
};

export default UserAvatar;
