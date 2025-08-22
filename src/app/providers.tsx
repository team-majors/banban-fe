"use client";

interface Props {
  children?: React.ReactNode;
}

import { ToastProvider } from "@/components/common/Toast/ToastContext";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState, type ReactNode } from 'react';
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
  
export const NextProvider = ({ children }: Props) => {
  return (
    <QueryProviders>
      <ToastProvider>{children}</ToastProvider>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryProviders>
  );
};

interface ProvidersProps {
  children: ReactNode;
}

export function QueryProviders({ children }: ProvidersProps) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000,
            gcTime: 10 * 60 * 1000,
            retry: false,
            refetchOnWindowFocus: false,
          },
          mutations: {
            retry: false,
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
}