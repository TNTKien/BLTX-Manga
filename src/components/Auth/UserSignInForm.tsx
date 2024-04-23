"use client";

import { useCustomToast } from "@/hooks/use-custom-toast";
import { toast } from "@/hooks/use-toast";
import {
  AuthSignInValidator,
  CreateAuthSignInPayload,
} from "@/lib/validators/auth";
import { zodResolver } from "@hookform/resolvers/zod";

import { useState } from "react";
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

const UserSignInForm = () => {
  const { serverErrorToast, successToast } = useCustomToast();
  const [isLoading, setLoading] = useState<boolean>(false);

  const form = useForm<CreateAuthSignInPayload>({
    resolver: zodResolver(AuthSignInValidator),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function submitHanlder(values: CreateAuthSignInPayload) {
    setLoading(true);

    try {
      const { email, password } = AuthSignInValidator.parse(values);

      const res = await axiosInstance.post(
        "/api/auth/login",
        {
          email,
          password,
        },
        {
          withCredentials: true,
        }
      );

      window.location.replace("/");

      return successToast();
    } catch (error) {
      if (error instanceof Error) {
        return toast({
          title: error.message,
          description: "Vui lòng thử lại sau",
          variant: "destructive",
        });
      }

      return serverErrorToast();
    } finally {
      setLoading(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(submitHanlder)} className="space-y-4">
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
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormMessage />
              <FormControl>
                <Input
                  required
                  type="password"
                  autoComplete="current-password"
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
          isLoading={isLoading}
          disabled={isLoading}
          className="w-full"
        >
          Đăng nhập
        </Button>
      </form>
    </Form>
  );
};

export default UserSignInForm;
