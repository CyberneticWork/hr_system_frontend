import axiosLib from "axios";
import { getToken } from "../services/TokenService";

const axios = axiosLib.create({
  baseURL: "http://127.0.0.1:8000/api", // Adjust as needed for your backend
  headers: {
    Accept: "application/json",
  },
});

axios.interceptors.request.use((req) => {
  const token = getToken();
  if (token !== null) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

export default axios;
