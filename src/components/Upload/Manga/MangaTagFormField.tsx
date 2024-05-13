import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/AlertDialog";
import { Button } from "@/components/ui/Button";
import {
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/Form";
import type { MangaUploadPayload, tagInfoProps } from "@/lib/validators/manga";
import { X } from "lucide-react";
import { FC, useEffect, useState } from "react";
import type { UseFormReturn } from "react-hook-form";
import axiosInstance from "@/lib/axios";

interface MangaTagFormProps {
  form: UseFormReturn<MangaUploadPayload>;
  existTags?: string[];
}

const MangaTagForm: FC<MangaTagFormProps> = ({ form, existTags }) => {
  const [tags, setTags] = useState<string[]>([]);
  const [open, setOpen] = useState(false);
  const [tagsSelected, setTagsSelected] = useState<string[]>([]);
  useEffect(() => {
    const fetchTags = async () => {
      const { data } = await axiosInstance.get("/api/tags");
      setTags(data.data);
    };
    fetchTags();
    if (existTags) {
      setTagsSelected(existTags);
    }
  }, []);
  return (
    <FormField
      control={form.control}
      name="tags"
      render={() => (
        <FormItem>
          <FormLabel>Thể loại</FormLabel>
          <FormMessage />
          <div className="w-full px-3 py-2 space-y-3 rounded-md border border-input text-sm bg-default-400/20">
            {!!tagsSelected.length && (
              <ul className="flex flex-wrap items-center gap-3">
                {tagsSelected.map((tag, index) => (
                  <li
                    key={index}
                    className="flex items-center gap-2 pl-3 px-1 py-0.5 rounded-md bg-muted bg-slate-100/50"
                  >
                    {tag}
                    <X
                      className="text-red-500"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();

                        const filteredTags = tagsSelected.filter(
                          (t) => t !== tag
                        );
                        setTagsSelected(filteredTags);
                        form.setValue("tags", filteredTags);
                      }}
                    />
                  </li>
                ))}
              </ul>
            )}

            <div
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setOpen(true);
              }}
              className="text-muted-foreground opacity-25"
            >
              Click để mở
            </div>
          </div>
          <AlertDialog open={open} onOpenChange={setOpen}>
            <AlertDialogContent className="max-h-[100dvh] overflow-y-auto scrollbar dark:scrollbar--dark">
              <AlertDialogHeader>
                <AlertDialogTitle>Thêm/Xoá Tag</AlertDialogTitle>
              </AlertDialogHeader>

              <div className="divide-y divide-primary/40">
                <div className="space-y-1 py-3">
                  <ul className="flex flex-wrap items-center gap-3">
                    {tags.map((childTag, index) => (
                      <li key={index}>
                        <Button
                          type="button"
                          size={"sm"}
                          variant={
                            tagsSelected.includes(childTag)
                              ? "destructive"
                              : "destructive"
                          }
                          className={
                            tagsSelected.includes(childTag)
                              ? "bg-sky-300"
                              : " bg-slate-200 hover:bg-slate-300"
                          }
                          aria-label={childTag}
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();

                            if (tagsSelected.includes(childTag)) {
                              const filteredTags = tagsSelected.filter(
                                (tag) => tag !== childTag
                              );

                              setTagsSelected(filteredTags);
                              form.setValue("tags", filteredTags);
                            } else {
                              const addedTags = [...tagsSelected, childTag];

                              setTagsSelected(addedTags);
                              form.setValue("tags", addedTags);
                            }
                          }}
                        >
                          {childTag}
                        </Button>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <AlertDialogFooter>
                <Button
                  type="button"
                  variant={"destructive"}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();

                    setTagsSelected([]);
                    form.setValue("tags", []);
                  }}
                >
                  Reset
                </Button>
                <AlertDialogAction type="button">Xong</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </FormItem>
      )}
    />
  );
};

export default MangaTagForm;
