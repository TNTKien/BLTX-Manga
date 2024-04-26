import { cn } from "@/lib/utils";
import type { User } from "@prisma/client";
import { FC, HTMLAttributes } from "react";

interface UsernameProps extends HTMLAttributes<HTMLHeadElement> {
  user: Pick<User, "username">;
  className?: string;
}

const Username: FC<UsernameProps> = ({ user, className }) => {
  return (
    <p
      className={cn(
        "text-center font-medium bg-clip-text animate-rainbow",
        "text-black dark:text-white",
        className
      )}
      style={{
        backgroundImage: undefined,
        backgroundColor: undefined,
      }}
    >
      {user.username}
    </p>
  );
};

export default Username;
