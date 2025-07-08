import axios, { AxiosInstance } from "axios";

const productionUrl: string = import.meta.env.VITE_PRODUCTION_URL || "http://localhost:5000/api/v1";

axios.defaults.withCredentials = true;

export const customFetch: AxiosInstance = axios.create({
  baseURL: productionUrl,
  withCredentials: true,
});
