import { z } from "zod";

export const AuthSignInValidator = z
  .object({
    email: z.string().email({ message: "Định dạng không hợp lệ" }),
    password: z
      .string()
      .min(5, { message: "Mật khẩu tối thiểu 5 kí tự" })
      .max(64, { message: "Mật khẩu tối đa 64 kí tự" }),
  })
  .required();

export type CreateAuthSignInPayload = z.infer<typeof AuthSignInValidator>;

export const AuthSignUpValidator = z
  .object({
    email: z
      .string()
      .email({ message: "Định dạng không hợp lệ" })
      .refine(
        (mail) => mail.split("@")[1].startsWith("gmail.com"),
        "Email không hợp lệ. Chỉ nhận Gmail"
      ),
    username: z.string(),
    password: z
      .string()
      .min(5, { message: "Mật khẩu tối thiểu 5 kí tự" })
      .max(64, { message: "Mật khẩu tối đa 64 kí tự" }),
    passwordConfirm: z
      .string()
      .min(5, { message: "Mật khẩu tối thiểu 5 kí tự" })
      .max(64, { message: "Mật khẩu tối đa 64 kí tự" }),
  })
  .required()
  .refine((schema) => schema.password === schema.passwordConfirm, {
    message: "Mật khẩu không giống nhau",
    path: ["passwordConfirm"],
  });

export type CreateAuthSignUpPayload = z.infer<typeof AuthSignUpValidator>;

export const AuthVeifyValidator = z.object({
  email: z.string(),
  password: z.string(),
  iat: z.number(),
  exp: z.number(),
});

export const AuthVerifyResultEnum = z.enum([
  "OK",
  "SERVER_ERROR",
  "DUPLICATED_ERROR",
  "EXPIRED",
]);

export const AuthTwoFactorValidator = z.object({
  email: z.string(),
  password: z.string(),
  totp: z.string(),
});
export type AuthTwoFactorPayload = z.infer<typeof AuthTwoFactorValidator>;
