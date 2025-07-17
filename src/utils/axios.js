import axiosLib from "axios";
import { getToken } from "../services/TokenService";
import config from '../config';

const apiUrl = config.apiBaseUrl+ '/api';

const axios = axiosLib.create({
  baseURL: apiUrl, 
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
