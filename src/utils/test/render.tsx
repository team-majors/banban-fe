import React from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ReactNode } from "react";


const createQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: { retry: false },
    },
  });

const AllTheProviders = ({ children }: { children: React.ReactNode }) => (
  <QueryClientProvider client={createQueryClient()}>
    {children}
  </QueryClientProvider>
);

export const createTestRenderer = (ui: ReactNode) => {
  const user = userEvent.setup();
  return {
    user,
    ...render(<AllTheProviders>{ui}</AllTheProviders>),
  };
};

export default createTestRenderer;
