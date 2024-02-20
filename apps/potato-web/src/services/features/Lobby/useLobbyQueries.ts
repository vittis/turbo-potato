import { useQuery } from "@tanstack/react-query";
import { useEffect, useMemo } from "react";
import { api } from "../../api/http";
import { useUserStore } from "../User/useUserStore";
import { useLobbyRealtime } from "./useLobbyRealtime";
import { toast } from "react-toastify";

async function fetchLobbyRooms() {
  const { data } = await api.get("/api/rooms", { withCredentials: true });
  return data;
}

async function fetchUserRooms() {
  const { data } = await api.get("/api/me/rooms", { withCredentials: true });
  return data;
}

interface LobbyData {
  allRooms: any[];
  allRoomsExceptUserRoom: any[];
  userRoom: any | undefined;
  isLoading: boolean;
}

const useLobbyQueries = (): LobbyData => {
  useLobbyRealtime();

  const isLoggedIn = useUserStore((state) => state.isLoggedIn);

  const {
    data: roomsData,
    isLoading: roomsIsLoading,
    isRefetching: roomsIsRefetching,
    isSuccess: roomsIsSuccess,
  } = useQuery({
    queryKey: ["lobby", "rooms"],
    queryFn: fetchLobbyRooms,
    enabled: isLoggedIn,
    refetchInterval: 15000,
  });

  const {
    data: userRoomsData,
    isLoading: userRoomsIsLoading,
    isRefetching: userRoomsIsRefetching,
    isSuccess: userRoomsIsSuccess,
    isError: userRoomsIsError,
  } = useQuery({
    queryKey: ["user", "rooms"],
    queryFn: fetchUserRooms,
    enabled: isLoggedIn,
    refetchInterval: 15000,
  });

  const allRooms = useMemo(
    () =>
      roomsData?.rooms?.map((room) => ({
        ...room,
        members: room.members ? JSON.parse(room.members) : [],
      })) || [],
    [roomsData]
  );

  const userRoom = useMemo(
    () => allRooms?.find((room) => userRoomsData?.rooms.includes(room.id)),
    [allRooms, userRoomsData]
  );
  const allRoomsExceptUserRoom = useMemo(
    () => allRooms?.filter((room) => room.id !== userRoom?.id) || [],
    [allRooms, userRoom]
  );
  const isLoading = useMemo(
    () => roomsIsLoading || userRoomsIsLoading || roomsIsRefetching || userRoomsIsRefetching,
    [roomsIsLoading, userRoomsIsLoading, roomsIsRefetching, userRoomsIsRefetching]
  );

  useEffect(() => {
    if ((userRoomsIsError || userRoomsIsError) && !isLoading) {
      toast.error("Error fetching lobby rooms data");
    }
  }, [roomsIsSuccess, userRoomsIsSuccess, isLoading]);

  return { allRooms, allRoomsExceptUserRoom, userRoom, isLoading };
};

export { useLobbyQueries };
