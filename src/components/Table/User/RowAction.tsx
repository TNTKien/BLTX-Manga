import { buttonVariants } from "@/components/ui/Button";
import { toast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from "@nextui-org/react";
import type { User } from "@prisma/client";
import type { Row } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";
import { useRouter } from "next/navigation";
import axiosInstance from "@/lib/axios";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalFooter,
  Button,
} from "@nextui-org/react";
import { useState } from "react";

interface DataTableRowActionProps {
  row: Row<Pick<User, "id" | "email" | "username" | "role">>;
}

function DataTableRowAction({ row }: DataTableRowActionProps) {
  const user = row.original;
  const { refresh } = useRouter();
  const [isOpen1, setOpen1] = useState(false);
  const [isOpen2, setOpen2] = useState(false);

  return (
    <>
      <Dropdown>
        <DropdownTrigger>
          <button
            aria-label="row action button"
            type="button"
            className={cn(
              buttonVariants({
                variant: "destructive",
              }),
              "w-6 h-6 p-0 focus-visible:ring-transparent ring-offset-transparent"
            )}
          >
            <MoreHorizontal className="h-5 w-5" />
          </button>
        </DropdownTrigger>

        {user.role === "USER" ? (
          <DropdownMenu>
            <DropdownItem key="view" href={`/user/${user.id}`}>
              Xem thông tin
            </DropdownItem>
            <DropdownItem
              key="grant"
              onClick={(e) => {
                e.stopPropagation();
                e.preventDefault();
                setOpen1(true);
              }}
            >
              Cấp quyền Upload
            </DropdownItem>
          </DropdownMenu>
        ) : user.role === "UPLOADER" ? (
          <DropdownMenu>
            <DropdownItem key="view" href={`/user/${user.id}`}>
              Xem thông tin
            </DropdownItem>
            <DropdownItem
              key="revoke"
              onClick={(e) => {
                e.stopPropagation();
                e.preventDefault();
                setOpen2(true);
              }}
            >
              Gỡ quyền Upload
            </DropdownItem>
          </DropdownMenu>
        ) : (
          <DropdownMenu>
            <DropdownItem key="view" href={`/user/${user.id}`}>
              Xem thông tin
            </DropdownItem>
          </DropdownMenu>
        )}
      </Dropdown>

      <Modal
        isOpen={isOpen1}
        onOpenChange={(opened) => {
          setOpen1(opened);
        }}
      >
        <ModalContent>
          <ModalHeader className="flex flex-col gap-1">
            Cấp quyền Upload cho người dùng này?
          </ModalHeader>
          <ModalFooter>
            <Button
              color="danger"
              variant="light"
              onPress={() => setOpen1(false)}
            >
              Huỷ
            </Button>
            <Button
              color="primary"
              onPress={() => {
                grantUploader(user.id, user.role).then(() => {
                  refresh();
                });
                setOpen1(false);
              }}
            >
              Xác nhận
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <Modal
        isOpen={isOpen2}
        onOpenChange={(opened) => {
          setOpen2(opened);
        }}
      >
        <ModalContent>
          <ModalHeader className="flex flex-col gap-1">
            Gỡ quyền Upload của người dùng này?
          </ModalHeader>
          <ModalFooter>
            <Button
              color="danger"
              variant="light"
              onPress={() => setOpen2(false)}
            >
              Huỷ
            </Button>
            <Button
              color="primary"
              onPress={() => {
                revokeUploader(user.id, user.role).then(() => {
                  refresh();
                });
                setOpen2(false);
              }}
            >
              Xác nhận
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}

async function grantUploader(userId: string, role: string) {
  if (role === "ADMIN") {
    toast({
      title: "Không thể thực hiện hành động này",
      variant: "destructive",
    });
    return;
  }
  if (role === "UPLOADER") {
    toast({
      title: "Người này đã có quyền Upload",
      variant: "destructive",
    });
    return;
  }
  const { data, status } = await axiosInstance.put(`/api/user/grant/${userId}`);
  if (status === 200) {
    toast({
      title: "Thành công ✅",
      variant: "destructive",
    });
  } else {
    toast({
      title: "Lỗi",
      variant: "destructive",
    });
  }
}

async function revokeUploader(userId: string, role: string) {
  if (role === "ADMIN") {
    toast({
      title: "Không thể thực hiện hành động này",
      variant: "destructive",
    });
    return;
  }
  if (role === "USER") {
    toast({
      title: "Người này không có quyền Upload",
      variant: "destructive",
    });
    return;
  }
  const { data, status } = await axiosInstance.put(
    `/api/user/revoke/${userId}`
  );
  if (status === 200) {
    toast({
      title: "Thành công ✅",
      variant: "destructive",
    });
  } else {
    toast({
      title: "Lỗi",
      variant: "destructive",
    });
  }
}

export default DataTableRowAction;
