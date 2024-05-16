import { cn } from "@/lib/utils";
import type { User } from "@prisma/client";
import { FC, HTMLAttributes } from "react";
import { Chip } from "@nextui-org/chip";

interface UsernameProps extends HTMLAttributes<HTMLHeadElement> {
  user: Pick<User, "username" | "role">;
  className?: string;
}

const Username: FC<UsernameProps> = ({ user, className }) => {
  return (
    <div className="flex flex-row gap-2">
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
        {user.username}{" "}
      </p>
      <Chip
        color={
          user.role === "ADMIN"
            ? "danger"
            : user.role === "UPLOADER"
            ? "warning"
            : "primary"
        }
        size="sm"
      >
        {user.role}
      </Chip>
    </div>
  );
};

export default Username;
