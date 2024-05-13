import { ZodType, z } from "zod";
import { disRegex, fbRegex, vieRegex } from "../utils";

export const authorInfo = z.array(z.string());
export type authorInfoProps = z.infer<typeof authorInfo>;

export const tagInfo = z.object({
  id: z.number(),
  name: z.string(),
  description: z.string(),
});
export type tagInfoProps = z.infer<typeof tagInfo>;

export const MangaUploadValidator = z.object({
  cover: z.string(),
  title: z
    .string()
    .min(3, { message: "Tối thiểu 3 kí tự" })
    .max(256, { message: "Tối đa 256 kí tự" })
    .refine(
      (value) => vieRegex.test(value),
      "Tên chỉ chấp nhận kí tự latin, kí tự đặc biệt phổ thông"
    ),
  description: z.string().min(3, { message: "Tối thiểu 3 kí tự" }),
  author: z.string().min(1, { message: "Tối thiểu 1 kí tự" }),
  tags: z.array(z.string()).min(1, { message: "Tối thiểu có một thể loại" }),
});
export type MangaUploadPayload = z.infer<typeof MangaUploadValidator>;
