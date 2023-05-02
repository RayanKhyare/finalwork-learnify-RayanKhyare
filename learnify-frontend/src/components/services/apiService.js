import axios from "axios";

const API_URL = "http://localhost:3000/api/v1"; // replace with your backend URL
const token = localStorage.getItem("token");

//LOGIN
const register = (data) => {
  return axios.post(`${API_URL}/auth/register`, data);
};

const login = (data) => {
  return axios.post(`${API_URL}/auth/login`, data);
};

const getUserById = (id) => {
  return axios.get(`${API_URL}/users/${id}`);
};

//ROLES

const getRoles = () => {
  return axios.get(`${API_URL}/auth/roles`, {
    headers: {
      "auth-token": `${token}`,
    },
  });
};

//STREAMS

const getAllStreams = () => {
  return axios.get(`${API_URL}/streams`);
};

const getStreamById = (id) => {
  return axios.get(`${API_URL}/streams/${id}`);
};

const postStream = (data) => {
  return axios.post(`${API_URL}/streams`, data, {
    headers: {
      "auth-token": `${token}`,
    },
  });
};

export default {
  register,
  login,
  getRoles,
  getUserById,
  getAllStreams,
  getStreamById,
  postStream,
};
