import { cn } from "@/lib/utils";
import { FC } from "react";

interface TagWrapperProps extends React.HTMLAttributes<HTMLUListElement> {}

const TagWrapper: FC<TagWrapperProps> = ({ className, children, ...props }) => (
  <ul className={cn("flex flex-wrap gap-2", className)} {...props}>
    {children}
  </ul>
);

interface TagContentProps extends React.HTMLAttributes<HTMLLIElement> {}

const TagContent: FC<TagContentProps> = ({ className, children, ...props }) => (
  <li
    className={cn(
      "p-0.5 rounded-lg text-xs md:text-sm lg:text-base font-semibold bg-primary text-primary-foreground",
      className
    )}
    {...props}
  >
    {children}
  </li>
);

export { TagWrapper, TagContent };
