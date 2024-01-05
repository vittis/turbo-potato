import { useQuery } from "@tanstack/react-query";
import { api } from "../api/http";
import { useEffect } from "react";
import { useUserStore } from "./useUserStore";

async function fetchProfile() {
  const { data } = await api.get("http://localhost:8080/api/me/profile", {
    withCredentials: true,
  });
  return data;
}

const useFetchProfile = () => {
  const setUserData = useUserStore((state) => state.setUserData);
  const removeUserData = useUserStore((state) => state.removeUserData);

  const {
    data: profileData,
    isSuccess,
    isError,
  } = useQuery({
    queryKey: ["user", "profile"],
    queryFn: fetchProfile,
  });

  useEffect(() => {
    if (isSuccess) {
      setUserData(profileData.data);
    }
    if (isError) {
      removeUserData();
    }
  }, [isSuccess, profileData, isError, removeUserData, setUserData]);

  return null;
};

export { useFetchProfile };
