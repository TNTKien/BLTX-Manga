import { getAuthSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { notFound, redirect } from "next/navigation";
import dynamic from "next/dynamic";
import TableSkeleton from "@/components/Skeleton/TableSkeleton";
import { Metadata } from "next";

const UserTable = dynamic(() => import("@/components/Table/User"), {
  ssr: false,
  loading: () => <TableSkeleton />,
});

export const metadata: Metadata = {
  title: "Quản lý người dùng",
};

const page = async () => {
  const session = await getAuthSession();
  if (!session) return redirect(`${process.env.MAIN_URL}/sign-in`);
  if (session.role !== "ADMIN") return notFound();

  const users = await db.user.findMany({
    select: {
      id: true,
      email: true,
      username: true,
      role: true,
    },
  });

  if (!users) return notFound();

  return (
    <main className="container max-sm:px-2 mb-10">
      <section className="p-2 rounded-md dark:bg-zinc-900/60">
        {!!users.length ? <UserTable data={users} /> : <p>Trống!</p>}
      </section>
    </main>
  );
};

export default page;
