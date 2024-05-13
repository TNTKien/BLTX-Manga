import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/AlertDialog";
import { buttonVariants } from "@/components/ui/Button";
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuTrigger,
// } from "@/components/ui/DropdownMenu";
import { useCustomToast } from "@/hooks/use-custom-toast";
import { toast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from "@nextui-org/react";
import type { Manga } from "@prisma/client";
import { useMutation } from "@tanstack/react-query";
import type { Row } from "@tanstack/react-table";
import axios, { AxiosError } from "axios";
import { Loader2, MoreHorizontal } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import axiosInstance from "@/lib/axios";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
} from "@nextui-org/react";
import { useState } from "react";

interface DataTableRowActionProps {
  row: Row<Pick<Manga, "id" | "title" | "updatedAt">>;
}

function DataTableRowAction({ row }: DataTableRowActionProps) {
  const manga = row.original;
  const { refresh } = useRouter();
  const { loginToast, notFoundToast, serverErrorToast, successToast } =
    useCustomToast();
  const [isOpen, setOpen] = useState(false);

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

        <DropdownMenu>
          <DropdownItem key="view" href={`/manga/${manga.id}`}>
            Xem truyện
          </DropdownItem>
          <DropdownItem
            key="chapter"
            href={`/manage/mangas/${manga.id}/chapters`}
          >
            Xem chapter
          </DropdownItem>
          <DropdownItem
            key="edit"
            href={`/manage/mangas/${manga.id}/edit`}
            showDivider
          >
            Chỉnh sửa
          </DropdownItem>
          <DropdownItem
            key="delete"
            className="text-danger"
            color="danger"
            onClick={(e) => {
              e.stopPropagation();
              e.preventDefault();
              setOpen(true);
            }}
          >
            Xoá truyện
          </DropdownItem>
        </DropdownMenu>
      </Dropdown>

      <Modal
        isOpen={isOpen}
        onOpenChange={(opened) => {
          setOpen(opened);
        }}
        isDismissable={false}
      >
        <ModalContent>
          <ModalHeader className="flex flex-col gap-1">
            Bạn có chắc chắn muốn xóa truyện này không?
          </ModalHeader>
          {/* <ModalBody>
            <p>
              <strong>{manga.title}</strong>
            </p>
          </ModalBody> */}
          <ModalFooter>
            <Button
              color="danger"
              variant="light"
              onPress={() => setOpen(false)}
            >
              Huỷ
            </Button>
            <Button
              color="primary"
              onPress={() => {
                deleteManga(manga.id).then(() => {
                  refresh();
                });
                setOpen(false);
              }}
            >
              Xoá
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}

async function deleteManga(mangaId: string) {
  const { data, status } = await axiosInstance.delete(`/api/manga/${mangaId}`);
  if (status === 204) {
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
