import { useMutation } from "@tanstack/react-query";
import { api } from "../../api/http";
import { toast } from "sonner";

async function joinRoom(id) {
  const res = await api.post(
    `/api/rooms/${id}/join`,
    {},
    {
      withCredentials: true,
    }
  );
  return res.data;
}
async function leaveRoom(id) {
  const res = await api.post(
    `/api/rooms/${id}/leave`,
    {},
    {
      withCredentials: true,
    }
  );
  return res.data;
}

async function createRoom(data) {
  const res = await api.post("/api/rooms/create", data, {
    withCredentials: true,
  });
  return res.data;
}

const useLobbyMutations = () => {
  const { mutateAsync: joinMutation, isPending: joinIsPending } = useMutation({
    mutationFn: joinRoom,
    mutationKey: ["join"],
    onSuccess: () => {
      toast.success("Joined room successfully");
    },
  });

  const { mutateAsync: leaveMutation, isPending: leaveIsPending } = useMutation({
    mutationFn: leaveRoom,
    mutationKey: ["leave"],
    onSuccess: () => {
      toast.success("Leaved room successfully");
    },
  });

  const { mutateAsync: createMutation, isPending: createIsPending } = useMutation({
    mutationFn: createRoom,
    mutationKey: ["createRoom"],
    onSuccess: () => {
      toast.success("Created room successfully");
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
