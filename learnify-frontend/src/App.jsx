import "./App.scss";
import React, { useContext, useEffect, createContext, useState } from "react";
import { Route, Routes, BrowserRouter as Router } from "react-router-dom";

import socket from "./components/services/socket";
import Header from "./components/Header/Header";
import Landing from "./components/Landing/Landing";
import Main from "./components/Main/Main";
import Login from "./components/Login/Login";
import Register from "./components/Register/Register";
import AddStream from "./components/AddStream/AddStream";
import AddVideo from "./components/AddVideo/AddVideo";
import Stream from "./components/Stream/Stream";
import Dashboard from "./components/Dashboard/Dashboard";
import Bladeren from "./components/Bladeren/Bladeren";
import Navigation from "./components/Navigation/Navigation";
import VideoPage from "./components/Video/VideoPage";
import Profile from "./components/Profile/Profile";
import Categories from "./components/Categories/Categories";
import UserPage from "./components/userPage/userPage";
import ProtectedRoute from "./components/services/ProtectedRoute";
import IfLoggedRoute from "./components/services/IfLoggedRoute";
import apiService from "./components/services/apiService";

import jwt_decode from "jwt-decode";
import FirstVisit from "./components/FirstVisitPopUp/FirstVisit";

export const UserContext = createContext();
function App() {
  const [user, setUser] = useState("");
  const [firstVisit, setFirstVisit] = useState(true);
  const [showFirstVisit, setShowFirstVisit] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const decodedToken = jwt_decode(token);

      // fetch user data
      apiService
        .getUserById(decodedToken.id)
        .then((response) => {
          setUser(response.data);
        })
        .catch((error) => console.log(error));
    }

    const storedFirstVisit = localStorage.getItem("firstVisit");
    if (storedFirstVisit) {
      setFirstVisit(storedFirstVisit === "true");
    } else {
      localStorage.setItem("firstVisit", "true");
      setFirstVisit(true); // Set firstVisit to true by default
    }
  }, []);

  useEffect(() => {
    if (firstVisit) {
      document.documentElement.style.overflow = "hidden"; // Disable scrolling
    } else {
      document.documentElement.style.overflow = ""; // Enable scrolling
      localStorage.setItem("firstVisit", "false"); // Update localStorage
    }

    const delay = setTimeout(() => {
      setShowFirstVisit(firstVisit);
    }, 500); // Delay the rendering of FirstVisit component by 500 milliseconds

    return () => clearTimeout(delay);
  }, [firstVisit]);

  return (
    <UserContext.Provider value={{ user }}>
      <Router>
        {showFirstVisit && <FirstVisit />}

        <div className="App">
          <Header />
          <Routes>
            <Route path="/stream/:streamid/" element={<Stream />} />

            <Route path="/" element={<Main />} />

            <Route path="/login" element={<IfLoggedRoute />}>
              <Route path="/login" element={<Login />} />
            </Route>
            <Route path="/register" element={<IfLoggedRoute />}>
              <Route path="/register" element={<Register />} />
            </Route>

            <Route path="/main" element={<Main />} />

            <Route path="/startstream" element={<ProtectedRoute />}>
              <Route path="/startstream" element={<AddStream />} />
            </Route>

            <Route path="/addvideo" element={<ProtectedRoute />}>
              <Route path="/addvideo" element={<AddVideo />} />
            </Route>

            <Route path="/video/:videoid" element={<VideoPage />} />

            <Route path="/categories/:categoryid" element={<Categories />} />

            <Route path="/dashboard/:streamid/" element={<ProtectedRoute />}>
              <Route path="/dashboard/:streamid/" element={<Dashboard />} />
            </Route>

            <Route path="/profile/:userid/" element={<ProtectedRoute />}>
              <Route path="/profile/:userid/" element={<Profile />} />
            </Route>

            <Route path="/user/:userid/" element={<UserPage />} />
            <Route path="/bladeren" element={<Bladeren />} />
          </Routes>
        </div>
        <Navigation />
      </Router>
    </UserContext.Provider>
  );
}

export default App;
