"use client";

import type {
  MangaUploadPayload,
  authorInfoProps,
} from "@/lib/validators/manga";
import { FC } from "react";
import type { UseFormReturn } from "react-hook-form";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../../ui/Form";
import { Input } from "../../ui/Input";

interface MangaAuthorFormProps {
  form: UseFormReturn<MangaUploadPayload>;
  existAuthors?: authorInfoProps[];
}

const MangaAuthorForm: FC<MangaAuthorFormProps> = ({ form, existAuthors }) => {
  return (
    <FormField
      control={form.control}
      name="author"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Tác giả</FormLabel>
          <FormMessage />
          <FormControl>
            <Input
              placeholder="Tên tác giả"
              autoComplete="off"
              {...field}
              className="bg-default-400/20 focus:bg-slate-50"
            />
          </FormControl>
        </FormItem>
      )}
    />
  );
};

export default MangaAuthorForm;
