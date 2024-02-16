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
  const { data } = await supabase.from("room_members").delete().eq("user_id", userId).select(); // todo: this silently fails, could use select() at end and check data
  const roomId = data?.[0].room_id;

  const { data: roomData } = await supabase.from("room_members").select().eq("room_id", roomId);

  if (roomData && roomData.length < 1) {
    await supabase.from("rooms").delete().eq("id", roomId);
  } else if (roomData) {
    const hasCreator = roomData.filter((member) => member.is_creator);
    if (hasCreator && hasCreator.length < 1) {
      await supabase
        .from("room_members")
        .upsert([{ user_id: roomData[0].user_id, room_id: roomId, is_creator: true }])
        .eq("room_id", roomId)
        .select()
        .order("joined_at", { ascending: true });
    }
  }
}

async function createRoom(params) {
  const { data } = await supabase
    .from("rooms")
    .insert([{ name: params.name, description: params.description, capacity: params.capacity }])
    .select();

  const roomId = data?.[0]?.id;

  await supabase
    .from("room_members")
    .insert([{ user_id: params.userId, room_id: roomId, is_creator: true }])
    .select();

  return data;
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
