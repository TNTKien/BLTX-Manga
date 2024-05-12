import SignIn from "@/components/Auth/SignIn";
import { buttonVariants } from "@/components/ui/Button";
import { getAuthSession } from "@/lib/auth";
import { ChevronLeft } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Đăng nhập",
};

const Page = async () => {
  const session = await getAuthSession();
  if (session) return redirect("/");

  return (
    <main className="mx-auto md:w-3/4 lg:w-2/3 p-2 space-y-10 mt-12 my-6 rounded-md bg-primary-foreground">
      <Link
        href="/"
        className={buttonVariants({
          variant: "destructive",
          className: "max-sm:pl-2 space-x-0.5 bg-slate-200 hover:bg-slate-300",
        })}
      >
        <ChevronLeft />
        <span>Trang chủ</span>
      </Link>

      <SignIn className="max-sm:px-2" bypassRouteInterception />
    </main>
  );
};

export default Page;
