// app/providers.tsx
"use client";
import { MantineProvider } from "@mantine/core";
import { NextUIProvider } from "@nextui-org/react";
import { useRouter } from "next/navigation";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { SessionProviders } from "./SessionProviders";

const queryClient = new QueryClient();

export function Providers({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  return (
    <QueryClientProvider client={queryClient}>
      <SessionProviders>
        <NextUIProvider navigate={router.push}>
          <MantineProvider>{children}</MantineProvider>
        </NextUIProvider>
      </SessionProviders>
    </QueryClientProvider>
  );
}
