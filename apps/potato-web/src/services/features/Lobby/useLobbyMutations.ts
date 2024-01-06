import { useMutation } from "@tanstack/react-query";
import { queryClient } from "../../api/queryClient";
import { api } from "../../api/http";

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

async function createRoom(data) {
  const res = await api.post("http://localhost:8080/api/rooms/create", data, {
    withCredentials: true,
  });
  return res.data;
}

const useLobbyMutations = () => {
  const { mutateAsync: joinMutation, isPending: joinIsPending } = useMutation({
    mutationFn: joinRoom,
    mutationKey: ["join"],
    onSuccess: () => {
      // queryClient.invalidateQueries({ queryKey: ["user", "rooms"] });
    },
  });

  const { mutateAsync: leaveMutation, isPending: leaveIsPending } = useMutation({
    mutationFn: leaveRoom,
    mutationKey: ["leave"],
    onSuccess: () => {
      // queryClient.invalidateQueries({ queryKey: ["lobby"] });
      // queryClient.invalidateQueries({ queryKey: ["user", "rooms"] });
    },
  });

  const { mutateAsync: createMutation, isPending: createIsPending } = useMutation({
    mutationFn: createRoom,
    mutationKey: ["createRoom"],
    onSuccess: () => {
      // queryClient.invalidateQueries({ queryKey: ["lobby"] });
      // queryClient.invalidateQueries({ queryKey: ["user", "rooms"] });
    },
  });

  return {
    createRoom: createMutation,
    joinRoom: joinMutation,
    leaveRoom: leaveMutation,
    isLoading: joinIsPending || leaveIsPending || createIsPending,
  };
};

export { useLobbyMutations };
