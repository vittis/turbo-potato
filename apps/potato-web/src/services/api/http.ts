import axios from "axios";

export const api = axios.create({
  // baseURL: "http://localhost:8080",
  baseURL: import.meta.env.VITE_API_URL,
});

/* api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("User-Token");

    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
); */

api.interceptors.response.use(
  function (response) {
    return response;
  },
  function (error) {
    /* console.log(error);
    if (error.message === "Request failed with status code 401") {
      return Promise.reject(error);
    }

    toast.error(
      error?.response?.data?.message ||
        error?.response?.data?.error ||
        error?.message ||
        "Something went wrong"
    ); */

    return Promise.reject(error);
  }
);
