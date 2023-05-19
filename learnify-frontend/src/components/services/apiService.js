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

const updateStream = (id, data) => {
  return axios.put(`${API_URL}/streams/${id}`, data);
};

const getStreamByUserId = (id) => {
  return axios.get(`${API_URL}/streams/user/${id}`);
};

const deleteStreamById = (id) => {
  return axios.delete(`${API_URL}/streams/${id}`);
};

//VIDEOS
const getAllVideos = () => {
  return axios.get(`${API_URL}/videos`);
};

const postVideo = (data) => {
  return axios.post(`${API_URL}/videos`, data, {
    headers: {
      "auth-token": `${token}`,
    },
  });
};

//QUESTIONS

const postQuestions = (data) => {
  return axios.post(`${API_URL}/questions`, data, {
    headers: {
      "auth-token": `${token}`,
    },
  });
};

const getQuestionsByStreamId = (id) => {
  return axios.get(`${API_URL}/questions/stream/${id}`);
};

//ANSWER

const postAnswers = (data) => {
  return axios.post(`${API_URL}/answers`, data, {
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
  updateStream,
  getStreamByUserId,
  deleteStreamById,
  getAllVideos,
  postVideo,
  postQuestions,
  getQuestionsByStreamId,
  postAnswers,
};
