"use client";

import { cn } from "@/lib/utils";
import Link from "next/link";
import { buttonVariants } from "../ui/Button";
import { useSearchParams } from "next/navigation";
import UserSignInForm from "./UserSignInForm";

interface SignInProps extends React.HTMLAttributes<HTMLDivElement> {
  bypassRouteInterception?: boolean;
}

const SignIn = ({
  bypassRouteInterception = false,
  className,
  ...props
}: SignInProps) => {
  const searchParams = useSearchParams();

  return (
    <div className={cn("container flex flex-col gap-8", className)} {...props}>
      <div className="space-y-4">
        <div className="space-y-4">
          <UserSignInForm />
        </div>

        <p className="text-center">
          Chưa có tài khoản?{" "}
          {bypassRouteInterception ? (
            <a
              href="/sign-up"
              className={cn(
                buttonVariants({
                  variant: "link",
                  size: "sm",
                }),
                "dark:text-blue-400"
              )}
            >
              Đăng ký ngay
            </a>
          ) : (
            <Link
              href={`/sign-up?visited=${
                parseInt(searchParams.get("visited") ?? "1") + 1
              }`}
              className={cn(
                buttonVariants({
                  variant: "link",
                  size: "sm",
                }),
                "dark:text-blue-400"
              )}
            >
              Đăng ký ngay
            </Link>
          )}
        </p>
      </div>
    </div>
  );
};

export default SignIn;
