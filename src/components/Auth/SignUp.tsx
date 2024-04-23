"use client";

import Link from "next/link";
import UserSignUpForm from "./UserSignUpForm";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/Button";
import { useSearchParams } from "next/navigation";

interface SignUpProps extends React.HTMLAttributes<HTMLDivElement> {
  bypassRouteInterception?: boolean;
}

const SignUp = ({
  bypassRouteInterception = false,
  className,
  ...props
}: SignUpProps) => {
  const searchParams = useSearchParams();

  return (
    <div className={cn("container flex flex-col gap-8", className)} {...props}>
      <div className="space-y-4">
        <UserSignUpForm />

        <p className="text-center">
          Đã có tài khoản?{" "}
          {bypassRouteInterception ? (
            <a
              href="/sign-in"
              className={cn(
                buttonVariants({ variant: "link", size: "sm" }),
                "text-blue-500"
              )}
            >
              Đăng nhập ngay
            </a>
          ) : (
            <Link
              href={`/sign-in?visited=${
                parseInt(searchParams.get("visited") ?? "1") + 1
              }`}
              className={cn(
                buttonVariants({ variant: "link", size: "sm" }),
                "text-blue-500"
              )}
            >
              Đăng nhập ngay
            </Link>
          )}
        </p>
      </div>
    </div>
  );
};

export default SignUp;
