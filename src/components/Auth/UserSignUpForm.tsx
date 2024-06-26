"use client";

import { useCustomToast } from "@/hooks/use-custom-toast";
import { toast } from "@/hooks/use-toast";
import {
  AuthSignUpValidator,
  CreateAuthSignUpPayload,
} from "@/lib/validators/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { useForm } from "react-hook-form";
import { Button } from "../ui/Button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/Form";
import { Input } from "../ui/Input";
import axiosInstance from "@/lib/axios";

const UserSignUpForm = () => {
  const { serverErrorToast } = useCustomToast();
  const form = useForm<CreateAuthSignUpPayload>({
    resolver: zodResolver(AuthSignUpValidator),
    defaultValues: {
      email: "",
      username: "",
      password: "",
      passwordConfirm: "",
    },
  });

  const { mutate: signUp, isPending } = useMutation({
    mutationKey: ["auth-sign-up"],
    mutationFn: async (values: CreateAuthSignUpPayload) => {
      const signUpForm = AuthSignUpValidator.parse(values);

      await axiosInstance.post("/api/auth/register", signUpForm);
      return true;
    },
    onError: (e) => {
      if (e instanceof AxiosError) {
        if (e.response?.status === 403) {
          return toast({
            title: "Tài khoản đã tồn tại",
            description: "Vui lòng tạo tài khoản khác",
            variant: "destructive",
          });
        }
        if (e.response?.status === 418) {
          return toast({
            title: "Không thể gửi Email",
            description: "Không thể gửi Email tới cho bạn",
            variant: "destructive",
          });
        }
        if (e.response?.status === 406)
          return toast({
            title: "Email không hợp lệ",
            description: "Chỉ nhận Gmail",
            variant: "destructive",
          });
      }

      return serverErrorToast();
    },
    onSuccess: () => {
      return toast({
        title: "Thành công",
        description: "Vui lòng đăng nhập để sử dụng.",
      });
    },
  });

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit((values: CreateAuthSignUpPayload) =>
          signUp(values)
        )}
        className="space-y-4"
      >
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormMessage />
              <FormControl>
                <Input
                  autoFocus
                  required
                  type="email"
                  autoComplete="username"
                  placeholder="Email của bạn"
                  className="border-2 focus:ring-offset-2 dark:border-slate-200 focus-visible:dark:ring-slate-200"
                  {...field}
                />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tên người dùng</FormLabel>
              <FormMessage />
              <FormControl>
                <Input
                  required
                  type="username"
                  placeholder="Tên hiển thị"
                  className="border-2 focus:ring-offset-2 dark:border-slate-200 focus-visible:dark:ring-slate-200"
                  {...field}
                />
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Mật khẩu</FormLabel>
              <FormMessage />
              <FormControl>
                <Input
                  required
                  type="password"
                  autoComplete="new-password"
                  placeholder="Mật khẩu của bạn"
                  className="border-2 focus:ring-offset-2 dark:border-slate-200 focus-visible:dark:ring-slate-200"
                  {...field}
                />
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="passwordConfirm"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nhập lại mật khẩu</FormLabel>
              <FormMessage />
              <FormControl>
                <Input
                  required
                  type="password"
                  autoComplete="new-password"
                  placeholder="Mật khẩu của bạn"
                  className="border-2 focus:ring-offset-2 dark:border-slate-200 focus-visible:dark:ring-slate-200"
                  {...field}
                />
              </FormControl>
            </FormItem>
          )}
        />

        <Button
          type="submit"
          isLoading={isPending}
          disabled={isPending}
          className="w-full"
        >
          Đăng ký
        </Button>
      </form>
    </Form>
  );
};

export default UserSignUpForm;
