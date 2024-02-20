import { useQuery } from "@tanstack/react-query";
import { api } from "../../api/http";
import { useEffect } from "react";
import { useUserStore } from "./useUserStore";
import { toast } from "react-toastify";

async function fetchProfile() {
  const { data } = await api.get("/api/me/profile", {
    withCredentials: true,
  });
  return data;
}

const useFetchProfile = () => {
  const setUserData = useUserStore((state) => state.setUserData);

  const removeUserData = useUserStore((state) => state.removeUserData);
  const userData = useUserStore((state) => state.userData);

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
      toast.success("Profile fetched successfully");
      setUserData(profileData.data);
    }
    if (isError) {
      if (!!userData.userId) {
        removeUserData();
        console.log("doin");
      }
    }
  }, [isSuccess, profileData, isError, removeUserData, setUserData]);

  return null;
};

export { useFetchProfile };
