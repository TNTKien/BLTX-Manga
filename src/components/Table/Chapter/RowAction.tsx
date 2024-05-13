import { buttonVariants } from "@/components/ui/Button";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from "@nextui-org/react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
} from "@nextui-org/react";
import { useCustomToast } from "@/hooks/use-custom-toast";
import { toast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import type { Chapter } from "@prisma/client";
import type { Row } from "@tanstack/react-table";
import { Loader2, MoreHorizontal } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import axiosInstance from "@/lib/axios";

interface DataTableRowActionProps {
  row: Row<Pick<Chapter, "id" | "title" | "pages" | "mangaId" | "updatedAt">>;
}

function DataTableRowAction({ row }: DataTableRowActionProps) {
  const chapter = row.original;
  const { loginToast, notFoundToast, serverErrorToast, successToast } =
    useCustomToast();
  const { refresh } = useRouter();

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
          <DropdownItem
            key="view"
            href={`/chapter/${chapter.mangaId}/${chapter.id}`}
          >
            Xem chapter
          </DropdownItem>

          <DropdownItem
            key="edit"
            href={`/manage/mangas/${chapter.mangaId}/chapters/${chapter.id}/edit`}
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
            Xoá chapter
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
            Bạn có chắc chắn muốn xóa chapter này không?
          </ModalHeader>
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
                deleteChapter(chapter.mangaId, chapter.id).then(() => {
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

async function deleteChapter(mangaId: string, chapterId: string) {
  const { data, status } = await axiosInstance.delete(
    `/api/chapter/${mangaId}/${chapterId}`
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
