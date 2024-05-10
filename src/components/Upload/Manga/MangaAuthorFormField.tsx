"use client";

import type {
  MangaUploadPayload,
  authorInfoProps,
} from "@/lib/validators/manga";
import { useDebouncedValue } from "@mantine/hooks";
import { X } from "lucide-react";
import { FC, useEffect, useState } from "react";
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
  const [authorInput, setAuthorInput] = useState("");
  const [debouncedValue] = useDebouncedValue(authorInput, 300);
  const [authorSelected, setAuthorSelected] = useState<authorInfoProps[]>(
    existAuthors ?? []
  );
  const [authorsResult, setAuthorsResult] = useState<authorInfoProps[]>([]);

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
