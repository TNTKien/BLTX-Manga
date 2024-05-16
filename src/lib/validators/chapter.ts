import { z } from "zod";
import { zfd } from "zod-form-data";

export const ChapterUploadValidator = z.object({
  title: z
    .string()
    .min(3, { message: "Tối thiểu 3 kí tự" })
    .max(256, { message: "Tối đa 256 kí tự" }),
  pages: z
    .object({
      src: z.string(),
      // .refine(
      //   (value) =>
      //     value.startsWith("blob") ||
      //     value.startsWith(process.env.NEXT_PUBLIC_IMG_DOMAIN!),
      //   "Ảnh không hợp lệ"
      // ),
      name: z.string(),
    })
    .array()
    .refine((values) => values.length >= 1, "Tối thiểu 1 ảnh"),
});
export type ChapterUploadPayload = z.infer<typeof ChapterUploadValidator>;

export const ChapterFormUploadValidator = zfd.formData({
  pages: zfd
    .repeatableOfType(
      zfd
        .file()
        .refine((file) => file.size < 4 * 1000 * 1000, "Ảnh phải nhỏ hơn 4MB")
        .refine(
          (file) =>
            ["image/jpg", "image/png", "image/jpeg"].includes(file.type),
          "Chỉ nhận định dạng .jpg, .png, .jpeg"
        )
    )
    .refine((files) => files.length >= 1, "Tối thiểu 1 ảnh"),
  chapterName: zfd.text(
    z.string().min(3, "Tối thiểu 3 kí tự").max(125, "Tối đa 125 kí tự")
  ),
});

export const ChapterFormEditValidator = zfd.formData({
  pages: zfd
    .repeatableOfType(
      zfd
        .text()
        .refine(
          (image) =>
            image.startsWith(process.env.NEXT_PUBLIC_IMG_DOMAIN!) ||
            Number(image) >= 0,
          "Invalid Images"
        )
    )
    .refine((files) => files.length >= 1, "Tối thiểu 1 ảnh"),
  files: zfd.repeatableOfType(
    zfd
      .file()
      .refine((file) => file.size < 4 * 1000 * 1000, "Ảnh phải nhỏ hơn 4MB")
      .refine(
        (file) => ["image/jpeg", "image/jpg", "image/png"].includes(file.type),
        "Định dạng ảnh không hợp lệ"
      )
  ),
  title: zfd.text(
    z.string().min(3, "Tối thiểu 3 kí tự").max(125, "Tối đa 125 kí tự")
  ),
});
