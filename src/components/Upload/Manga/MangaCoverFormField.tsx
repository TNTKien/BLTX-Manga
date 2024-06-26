"use client";

import ImageCropModal from "@/components/ImageCropModal";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/Form";
import { MangaUploadPayload } from "@/lib/validators/manga";
import { ImagePlus } from "lucide-react";
import Image from "next/image";
import { FC, useRef } from "react";
import { UseFormReturn } from "react-hook-form";

interface MangaCoverFormFieldProps {
  form: UseFormReturn<MangaUploadPayload>;
}

const MangaCoverFormField: FC<MangaCoverFormFieldProps> = ({ form }) => {
  const imageInputRef = useRef<HTMLInputElement>(null);
  const imageCropRef = useRef<HTMLButtonElement>(null);

  return (
    <FormField
      control={form.control}
      name="cover"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Ảnh bìa (Nếu có)</FormLabel>
          <FormMessage />
          <FormControl>
            <div className="relative aspect-[4/2] md:aspect-[4/1]">
              {field.value ? (
                <Image
                  fill
                  sizes="40vw"
                  quality={40}
                  priority
                  src={field.value}
                  alt="Preview Cover"
                  className="rounded-md border-2 object-cover hover:cursor-pointer dark:border-zinc-800"
                  onClick={(e) => {
                    e.preventDefault();

                    imageInputRef.current?.click();
                  }}
                />
              ) : (
                <div
                  role="button"
                  className="w-full h-full relative flex justify-center items-center hover:cursor-pointer rounded-md border-2 bg-background"
                  onClick={(e) => {
                    e.preventDefault();

                    imageInputRef.current?.click();
                  }}
                >
                  <ImagePlus className="w-8 h-8" />
                </div>
              )}
            </div>
          </FormControl>
          <input
            ref={imageInputRef}
            type="file"
            accept=".jpg, .jpeg, .png"
            className="hidden"
            onChange={(e) => {
              if (
                e.target.files?.length &&
                e.target.files[0].size < 4 * 1000 * 1000
              ) {
                field.onChange(URL.createObjectURL(e.target.files[0]));
                e.target.value = "";

                setTimeout(() => imageCropRef.current?.click(), 0);
              }
            }}
          />

          {!!field.value && (
            <ImageCropModal
              ref={imageCropRef}
              image={field.value}
              aspect={4 / 1}
              setImageCropped={(value) => field.onChange(value)}
            />
          )}
        </FormItem>
      )}
    />
  );
};

export default MangaCoverFormField;
