import { MutationCache, QueryCache, QueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { toast } from "sonner";

const queryClient = new QueryClient({
  queryCache: new QueryCache({
    // @ts-expect-error
    onError: (error: AxiosError<any>) => {
      toast.error("Something went wrong", {
        description:
          error?.response?.data?.message || error?.response?.data?.error || error?.message,
      });
    },
  }),
  mutationCache: new MutationCache({
    // @ts-expect-error
    onError: (error: AxiosError<any>) => {
      console.log("aooa???");
      toast.error("Something went wrong", {
        description:
          error?.response?.data?.message || error?.response?.data?.error || error?.message,
      });
    },
  }),
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      /* refetchOnMount: false, */
      staleTime: 10000,
      // retry: false,
    },
  },
});

export { queryClient };
