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
} from "@nextui-org/react";
import { Search, BookMarked } from "lucide-react";
import { usePathname } from "next/navigation";
import { useSession } from "./SessionProviders";
import axiosInstance from "@/lib/axios";

export default function NavbarComponent() {
  const pathName = usePathname();
  //console.log(/^(\/chapter\/)*/.test(pathName), pathName);
  if (/^(\/chapter\/)/g.test(pathName)) return null;

  const { user, error, loading } = useSession();

  return (
    <Navbar
      position="static"
      className="justify-between rounded-b-md bg-transparent"
      classNames={{
        wrapper: "max-w-full",
      }}
    >
      <NavbarContent justify="start">
        <NavbarBrand className="mr-4">
          <Link href="/" color="foreground">
            <BookMarked />
            <p className="hidden sm:block font-bold text-inherit">BLTX</p>
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
        />

        <Dropdown placement="bottom-end">
          <DropdownTrigger>
            <Avatar
              isBordered
              as="button"
              className="transition-transform"
              size="sm"
              src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9ImN1cnJlbnRDb2xvciIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiIGNsYXNzPSJsdWNpZGUgbHVjaWRlLXVzZXItcm91bmQiPjxjaXJjbGUgY3g9IjEyIiBjeT0iOCIgcj0iNSIvPjxwYXRoIGQ9Ik0yMCAyMWE4IDggMCAwIDAtMTYgMCIvPjwvc3ZnPg=="
            />
          </DropdownTrigger>

          {!!user && !loading ? (
            <>
              <DropdownMenu aria-label="Profile Actions" variant="flat">
                <DropdownItem key="username" className="h-14 gap-2">
                  <p className="font-semibold">{user.username}</p>
                </DropdownItem>
                <DropdownItem key="profile">Trang cá nhân</DropdownItem>
                <DropdownItem key="manage" showDivider>
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
            </>
          ) : (
            <>
              <DropdownMenu aria-label="Profile Actions" variant="flat">
                <DropdownItem key="sign-in" href="/sign-in">
                  Đăng nhập
                </DropdownItem>
                <DropdownItem key="sign-up" href="/sign-up">
                  Đăng ký
                </DropdownItem>
              </DropdownMenu>
            </>
          )}
        </Dropdown>
      </NavbarContent>
    </Navbar>
  );
}

async function Logout() {
  await axiosInstance.delete("/api/auth/logout");
  window.location.reload();
}
