import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/Form";
import { Input } from "@/components/ui/Input";
import type { MangaUploadPayload } from "@/lib/validators/manga";
import { FC } from "react";
import { UseFormReturn } from "react-hook-form";
import { Textarea } from "@/components/ui/textarea";

interface MangaDescFormFieldProps {
  form: UseFormReturn<MangaUploadPayload>;
}

const MangaDescFormField: FC<MangaDescFormFieldProps> = ({ form }) => {
  return (
    <FormField
      control={form.control}
      name="description"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Mô tả</FormLabel>
          <FormMessage />
          <FormControl>
            <Textarea
              placeholder="Mô tả truyện"
              autoComplete="off"
              {...field}
              className="bg-default-400/20 focus:bg-slate-50 h-[8.8rem] resize-none"
              rows={5}
            />
          </FormControl>
        </FormItem>
      )}
    />
  );
};

export default MangaDescFormField;
