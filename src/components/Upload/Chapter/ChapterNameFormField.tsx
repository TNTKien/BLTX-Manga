import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/Form";
import { Input } from "@/components/ui/Input";
import { ChapterUploadPayload } from "@/lib/validators/chapter";
import { FC } from "react";
import { UseFormReturn } from "react-hook-form";

interface ChapterNameFormFieldProps {
  form: UseFormReturn<ChapterUploadPayload>;
}

const ChapterNameFormField: FC<ChapterNameFormFieldProps> = ({ form }) => {
  return (
    <FormField
      control={form.control}
      name="title"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Tên chapter</FormLabel>
          <FormMessage />
          <FormControl>
            <Input
              autoComplete="off"
              placeholder="Oneshot, Chap 1, Chap 2..."
              {...field}
              className="bg-default-400/20 focus:bg-slate-50"
            />
          </FormControl>
        </FormItem>
      )}
    />
  );
};

export default ChapterNameFormField;
