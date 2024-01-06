import { QueryClient } from "@tanstack/react-query";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      /* refetchOnMount: false, */
      staleTime: 5000,
      // retry: false,
    },
  },
});

export { queryClient };
