import axios from "axios";

const adminApi = axios.create({
  baseURL: "http://localhost:5173/api/admin", // adjust as needed
});

export default adminApi;
