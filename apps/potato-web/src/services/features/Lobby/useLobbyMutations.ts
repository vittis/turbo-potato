import { useMutation } from "@tanstack/react-query";
import { api } from "../../api/http";
import { toast } from "react-toastify";
import { supabase } from "@/services/supabase/supabase";
import { queryClient } from "@/services/api/queryClient";

async function joinRoom(params) {
  const { roomId, userId } = params;
  const { data } = await supabase
    .from("room_members")
    .insert([{ user_id: userId, room_id: roomId }])
    .select();

  return data;
}
async function leaveRoom(params) {
  const { userId } = params;
  await supabase.from("room_members").delete().eq("user_id", userId); // todo: this silently fails, could use select() at end and check data
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
      queryClient.invalidateQueries({ queryKey: ["supa", "rooms"] });
      toast.success("Joined room successfully");
    },
  });

  const { mutateAsync: leaveMutation, isPending: leaveIsPending } = useMutation({
    mutationFn: leaveRoom,
    mutationKey: ["leave"],
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["supa", "rooms"] });
      toast.success("Leaved room successfully");
    },
  });

  const { mutateAsync: createMutation, isPending: createIsPending } = useMutation({
    mutationFn: createRoom,
    mutationKey: ["createRoom"],
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["supa", "rooms"] });
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
