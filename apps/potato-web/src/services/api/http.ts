import axios from "axios";

export const api = axios.create({
  baseURL: "http://localhost:8080",
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
    console.log("🚀 ~ file: http.ts:27 ~ error:", error);

    return Promise.reject(error);
  }
);
