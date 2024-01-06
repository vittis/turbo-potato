import { useMutation } from "@tanstack/react-query";
import { queryClient } from "../api/queryClient";
import { api } from "../api/http";

async function joinRoom(id) {
  const res = await api.post(
    `http://localhost:8080/api/rooms/${id}/join`,
    {},
    {
      withCredentials: true,
    }
  );
  return res.data;
}
async function leaveRoom(id) {
  const res = await api.post(
    `http://localhost:8080/api/rooms/${id}/leave`,
    {},
    {
      withCredentials: true,
    }
  );
  return res.data;
}

const useLobbyMutations = () => {
  const { mutate: joinMutation, isPending: joinIsPending } = useMutation({
    mutationFn: joinRoom,
    mutationKey: ["join"],
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["lobby"] });
      queryClient.invalidateQueries({ queryKey: ["user", "rooms"] });
    },
  });

  const { mutate: leaveMutation, isPending: leaveIsPending } = useMutation({
    mutationFn: leaveRoom,
    mutationKey: ["leave"],
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["lobby"] });
      queryClient.invalidateQueries({ queryKey: ["user", "rooms"] });
    },
  });

  return {
    joinRoom: joinMutation,
    leaveRoom: leaveMutation,
    isLoading: joinIsPending || leaveIsPending,
  };
};

export { useLobbyMutations };
