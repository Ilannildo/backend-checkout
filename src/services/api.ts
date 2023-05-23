import axios from "axios";

if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const baseURL = process.env.FLUIDEZ_API_URL;

export const axiosClient = axios.create({
  baseURL,
});
