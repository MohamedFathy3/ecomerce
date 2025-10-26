import axios from "axios";
import { API_URL } from "../constants";

console.log("axios baseURL:", API_URL);

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});
