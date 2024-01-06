import { useQuery } from "@tanstack/react-query";
import { useEffect, useMemo } from "react";
import { api } from "../api/http";
import { useUserStore } from "./useUserStore";

async function fetchLobbyRooms() {
  const { data } = await api.get("http://localhost:8080/api/rooms", { withCredentials: true });
  return data;
}

async function fetchUserRooms() {
  const { data } = await api.get("http://localhost:8080/api/me/rooms", { withCredentials: true });
  return data;
}

interface LobbyData {
  allRooms: any[];
  allRoomsExceptUserRoom: any[];
  userRoom: any | undefined;
  isLoading: boolean;
}

const useLobbyQueries = (): LobbyData => {
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
  });

  console;

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
  });

  const allRooms = useMemo(() => roomsData?.rooms || [], [roomsData]);
  const userRoom = useMemo(
    () => roomsData?.rooms?.find((room) => userRoomsData?.rooms.includes(room.id)),
    [roomsData, userRoomsData]
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
    if (userRoomsIsError || userRoomsIsError) {
      console.log("Error fetching lobby rooms data");
    }
  }, [roomsIsSuccess, userRoomsIsSuccess]);

  return { allRooms, allRoomsExceptUserRoom, userRoom, isLoading };
};

export { useLobbyQueries };
