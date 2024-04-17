// app/providers.tsx
'use client'
import { MantineProvider } from '@mantine/core';
import { NextUIProvider } from '@nextui-org/react';
import { useRouter } from 'next/navigation'

export function Providers({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  return (
    <NextUIProvider navigate={router.push}>
      <MantineProvider>{children}</MantineProvider>
    </NextUIProvider>
  )
}