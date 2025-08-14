import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ReactElement } from "react";

const createTestRenderer = async (component: ReactElement) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false, // ❌ retry off
      },
    },
  });

  const user = userEvent.setup();

  return {
    user,
    ...render(
      <QueryClientProvider client={queryClient}>
        {component}
      </QueryClientProvider>,
    ),
  };
};

export default createTestRenderer;
