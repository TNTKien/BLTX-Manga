import classes from "@/styles/mantine/dropzone.module.css";
import { Dropzone } from "@mantine/dropzone";
import "@mantine/dropzone/styles.layer.css";
import { ArrowUpFromLine, CircleOff, Loader } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import {
  Dispatch,
  SetStateAction,
  forwardRef,
  useCallback,
  useState,
} from "react";

export enum AddImageTypeEnum {
  IMAGE = "IMAGE",
  COMPRESSED = "COMPRESSED",
}

export type ImageType = {
  src: string;
  name: string;
};

interface ChapterImageInputProps {
  type: keyof typeof AddImageTypeEnum;
  setType: Dispatch<SetStateAction<keyof typeof AddImageTypeEnum>>;
  setImages: Dispatch<SetStateAction<ImageType[]>>;
}

const ChapterImageInput = forwardRef<HTMLInputElement, ChapterImageInputProps>(
  ({ type, setType, setImages }, ref) => {
    const [files, setFiles] = useState<Omit<FileList, "item">>();

    const onFileCommit = useCallback(
      (files: Omit<FileList, "item">) => {
        if (!files.length) return;

        if (type === "IMAGE") {
          let arr: ImageType[] = [];
          for (let i = 0; i < files.length; ++i) {
            const file = files[i];

            if (file.size > 4 * 1000 * 1000) {
              toast({
                title: "Có ảnh load không thành công",
                description: "Dung lượng tối đa cho mỗi ảnh là 4MB",
                variant: "destructive",
              });
              continue;
            }

            arr.push({
              name: file.name,
              src: URL.createObjectURL(file),
            });
          }

          setImages((prev) => [...prev, ...arr]);
          console.log(arr);
        }
      },
      [setImages, type]
    );

    const onImageChange = useCallback(
      (event: React.ChangeEvent<HTMLInputElement>) => {
        if (!event.target.files?.length) return;

        const files = event.target.files;
        onFileCommit(files);
        setFiles(files);
        event.target.value = "";
      },
      [onFileCommit]
    );

    return (
      <div>
        <input
          ref={ref}
          type="file"
          multiple={type === "IMAGE"}
          accept={"image/jpg,image/png,image/jpeg"}
          className="hidden"
          onChange={onImageChange}
        />

        <Dropzone.FullScreen
          active
          multiple={type === "IMAGE"}
          accept={["image/png", "image/jpeg", "image/jpg"]}
          classNames={classes}
          onDrop={(files) => {
            if (!files.length) return;

            const firstFile = files[0];

            setType("IMAGE");

            let arr: ImageType[] = [];
            for (let i = 0; i < files.length; ++i) {
              const file = files[i];

              if (file.size > 4 * 1000 * 1000) {
                toast({
                  title: "Có ảnh load không thành công",
                  description: "Dung lượng tối đa cho mỗi ảnh là 4MB",
                  variant: "destructive",
                });
                continue;
              }

              arr.push({
                name: file.name,
                src: URL.createObjectURL(file),
              });
            }

            setImages((prev) => [...prev, ...arr]);
          }}
        >
          <Dropzone.Accept>
            <div className="flex items-center gap-2 dark:text-white">
              <ArrowUpFromLine className="w-6 h-6" />
              <p>Kéo File vào khu vực này</p>
            </div>
          </Dropzone.Accept>

          <Dropzone.Reject>
            <div className="flex items-center gap-2 text-red-500">
              <CircleOff className="w-6 h-6 text-red-500" />
              <p>File không hợp lệ</p>
            </div>
          </Dropzone.Reject>

          <Dropzone.Idle>
            <div className="flex items-center gap-2 dark:text-white">
              <Loader className="w-6 h-6 animate-spin" />
              <p>Đang nhận File</p>
            </div>
          </Dropzone.Idle>
        </Dropzone.FullScreen>
      </div>
    );
  }
);
ChapterImageInput.displayName = "ChapterImageInput";

export default ChapterImageInput;
