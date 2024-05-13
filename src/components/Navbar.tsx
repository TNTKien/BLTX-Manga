"use client";
import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  Link,
  Input,
  DropdownItem,
  DropdownTrigger,
  Dropdown,
  DropdownMenu,
  Avatar,
  Button,
  Image,
  AvatarIcon,
} from "@nextui-org/react";
import { Search, BookMarked } from "lucide-react";
import { usePathname } from "next/navigation";
import { useSession } from "./SessionProviders";
import axiosInstance from "@/lib/axios";
import { useRouter } from "next/navigation";

export default function NavbarComponent() {
  const pathName = usePathname();
  //console.log(/^(\/chapter\/)*/.test(pathName), pathName);
  if (/^(\/chapter\/)/g.test(pathName)) return null;

  const { user, error, loading } = useSession();
  const router = useRouter();

  return (
    <Navbar
      position="static"
      // isBlurred={false}
      className="justify-between rounded-b-md bg-transparent"
      classNames={{
        wrapper: "max-w-full",
      }}
    >
      <NavbarContent justify="start">
        <NavbarBrand className="mr-4">
          <Link href="/" color="foreground">
            <Image src="/static/logo.svg" />
            <p className="hidden sm:block font-bold text-inherit text-xl space-x-1">
              MangaDex
            </p>
          </Link>
        </NavbarBrand>
      </NavbarContent>

      <NavbarContent as="div" className="items-center" justify="end">
        <Input
          classNames={{
            base: "max-w-full sm:max-w-[15rem] h-10 w-full",
            mainWrapper: "h-full",
            input: "text-small",
            inputWrapper:
              "h-full font-normal text-default-500 bg-default-400/20 dark:bg-default-500/20",
          }}
          placeholder="Nhập từ khoá..."
          size="sm"
          startContent={<Search size={18} />}
          type="search"
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              const search = e.currentTarget.value;
              if (search) {
                router.push(`/search/manga?q=${search}`);
              }
            }
          }}
        />

        {!!user && user.role === "ADMIN" && !loading ? (
          <>
            <Dropdown placement="bottom-end">
              <DropdownTrigger>
                <Avatar
                  isBordered
                  as="button"
                  className="transition-transform"
                  size="md"
                  src="/static/user-avt.png"
                />
              </DropdownTrigger>
              <DropdownMenu aria-label="Profile Actions" variant="flat">
                <DropdownItem key="username" className="h-14 gap-2">
                  <p className="font-semibold">Xin chào, {user.username}!</p>
                </DropdownItem>
                <DropdownItem key="profile" href={`/user/${user.id}`}>
                  Trang cá nhân
                </DropdownItem>
                <DropdownItem key="manage" href="/manage/mangas">
                  Quản lý truyện
                </DropdownItem>
                <DropdownItem key="manage" href="/manage/users" showDivider>
                  Quản lý người dùng
                </DropdownItem>
                <DropdownItem
                  key="logout"
                  color="danger"
                  className="text-danger"
                  onClick={Logout}
                >
                  Đăng xuất
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </>
        ) : !!user && !loading ? (
          <>
            <Dropdown placement="bottom-end">
              <DropdownTrigger>
                <Avatar
                  isBordered
                  as="button"
                  className="transition-transform"
                  size="md"
                  src="/static/user-avt.png"
                />
              </DropdownTrigger>
              <DropdownMenu aria-label="Profile Actions" variant="flat">
                <DropdownItem key="username" className="h-14 gap-2">
                  <p className="font-semibold">Xin chào, {user.username}!</p>
                </DropdownItem>
                <DropdownItem key="profile" href={`/user/${user.id}`}>
                  Trang cá nhân
                </DropdownItem>
                <DropdownItem key="manage" href="/manage/mangas" showDivider>
                  Quản lý truyện
                </DropdownItem>
                <DropdownItem
                  key="logout"
                  color="danger"
                  className="text-danger"
                  onClick={Logout}
                >
                  Đăng xuất
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </>
        ) : (
          <>
            <Dropdown placement="bottom-end">
              <DropdownTrigger>
                <Avatar
                  icon={<AvatarIcon />}
                  isBordered
                  as="button"
                  className="transition-transform"
                  size="md"
                />
              </DropdownTrigger>
              <DropdownMenu aria-label="Profile Actions" variant="flat">
                <DropdownItem key="sign-in" href="/sign-in">
                  Đăng nhập
                </DropdownItem>
                <DropdownItem key="sign-up" href="/sign-up">
                  Đăng ký
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </>
        )}
      </NavbarContent>
    </Navbar>
  );
}

async function Logout() {
  await axiosInstance.delete("/api/auth/logout");
  window.location.reload();
}
