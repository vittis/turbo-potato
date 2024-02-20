import { useMutation } from "@tanstack/react-query";
import { api } from "../../api/http";
import { queryClient } from "../../api/queryClient";
import { useUserStore } from "./useUserStore";

async function loginMutation() {
  const { data } = await api.post("/login", {}, { withCredentials: true });
  return data;
}

async function logoutMutation() {
  const { data } = await api.post("/logout", {}, { withCredentials: true });
  return data;
}

const useAuth = () => {
  const removeUserData = useUserStore((state) => state.removeUserData);

  const { mutate: login, isPending: loginIsPending } = useMutation({
    mutationFn: loginMutation,
    mutationKey: ["login"],
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user"] });
    },
  });

  const { mutate: logout, isPending: logoutIsPending } = useMutation({
    mutationFn: logoutMutation,
    mutationKey: ["logout"],
    onSuccess: () => {
      removeUserData();
      queryClient.invalidateQueries({ queryKey: ["user"] });
    },
  });

  return { login, loginIsPending, logout, logoutIsPending };
};

export { useAuth };
