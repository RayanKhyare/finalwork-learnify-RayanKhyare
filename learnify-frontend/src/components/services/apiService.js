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

const updateUser = (id, data) => {
  return axios.put(`${API_URL}/users/${id}`, data);
};

const deleteUser = (id) => {
  return axios.delete(`${API_URL}/users/${id}`);
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

const getStreamsByCategory = (id) => {
  return axios.get(`${API_URL}/streams/category/${id}`);
};

//VIDEOS
const getAllVideos = () => {
  return axios.get(`${API_URL}/videos`);
};

const getVideoById = (id) => {
  return axios.get(`${API_URL}/videos/${id}`);
};

const postVideo = (data) => {
  return axios.post(`${API_URL}/videos`, data, {
    headers: {
      "auth-token": `${token}`,
    },
  });
};

const getVideosByCategory = (id) => {
  return axios.get(`${API_URL}/videos/category/${id}`);
};

const getVideoByUserId = (id) => {
  return axios.get(`${API_URL}/videos/user/${id}`);
};

const updateVideo = (id, data) => {
  return axios.put(`${API_URL}/videos/${id}`, data);
};
const deleteVideo = (id, data) => {
  return axios.delete(`${API_URL}/videos/${id}`);
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

const deleteQuestion = (id) => {
  return axios.delete(`${API_URL}/questions/${id}`);
};

//ANSWER

const postAnswers = (data) => {
  return axios.post(`${API_URL}/answers`, data, {
    headers: {
      "auth-token": `${token}`,
    },
  });
};

const getAnswersByStreamId = (id) => {
  return axios.get(`${API_URL}/answers/question/${id}`);
};

//CATEGORIES

const getCategories = () => {
  return axios.get(`${API_URL}/categories`);
};

const getCategoryById = (id) => {
  return axios.get(`${API_URL}/categories/${id}`);
};

//VIDEOS

const getMessagesFromStream = (id) => {
  return axios.get(`${API_URL}/messages/stream/${id}`);
};

const postMessages = (data) => {
  return axios.post(`${API_URL}/messages`, data);
};

//Polls

const postPolls = (data) => {
  return axios.post(`${API_URL}/polls`, data);
};

const postVote = (data) => {
  return axios.post(`${API_URL}/polls/vote`, data);
};

const getPollsfromStream = (id) => {
  return axios.get(`${API_URL}/polls/stream/${id}`);
};

const deletePoll = (stream_id, poll_id) => {
  return axios.delete(`${API_URL}/polls/stream/${stream_id}/poll/${poll_id}`);
};

export default {
  register,
  login,
  getRoles,
  getUserById,
  updateUser,
  getAllStreams,
  getStreamById,
  postStream,
  updateStream,
  getStreamByUserId,
  deleteStreamById,
  getAllVideos,
  getVideoById,
  postVideo,
  postQuestions,
  getQuestionsByStreamId,
  deleteQuestion,
  postAnswers,
  getAnswersByStreamId,
  getCategories,
  getCategoryById,
  getStreamsByCategory,
  getVideosByCategory,
  getVideoByUserId,
  getMessagesFromStream,
  postMessages,
  postPolls,
  postVote,
  getPollsfromStream,
  deletePoll,
  deleteUser,
  updateVideo,
  deleteVideo,
};
