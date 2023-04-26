import axios from "axios";

const API_URL = "http://localhost:3000"; // replace with your backend URL
const token = localStorage.getItem("token");

const register = (data) => {
  return axios.post(`${API_URL}/auth/register`, data);
};

const login = (data) => {
  return axios.post(`${API_URL}/auth/login`, data);
};

const getRoles = () => {
  return axios.get(`${API_URL}/auth/roles`, {
    headers: {
      "auth-token": `${token}`,
    },
  });
};

export default {
  register,
  login,
  getRoles,
};
