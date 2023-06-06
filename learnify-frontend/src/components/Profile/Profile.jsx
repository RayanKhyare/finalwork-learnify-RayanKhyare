import React, { useState, useEffect, useCallback, useContext } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./profile.scss";
import apiService from "../services/apiService";
import profilepicture from "../../assets/user.png";
import { UserContext } from "../../App";
import { getProfilePicture } from "../services/profilePicService";
import Thumbnail from "../services/thumbnailService";
import man from "../../assets/man.png";
import woman from "../../assets/woman.png";
import rabbit from "../../assets/rabbit.png";
import bear from "../../assets/bear.png";
import liveicon from "../../assets/live_icon.svg";
import { motion } from "framer-motion";
export default function Profile() {
  const { user } = useContext(UserContext);

  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [profilePicture, setProfilePicture] = useState("");
  const [error, setError] = useState("");
  const [streams, setStreams] = useState([]);
  const [activeAvatar, setActiveAvatar] = useState(1);

  const handleAvatarClick = (value) => {
    setActiveAvatar(value);
  };

  useEffect(() => {
    if (user) {
      setUsername(user.username);
      setEmail(user.email);
      setPassword(user.password);
      setProfilePicture(user.profile_pic);
      setActiveAvatar(user.profile_pic);
    }
  }, [user]);

  console.log(
    "Username : " + username,
    "Email : " + email,
    "Password : " + password
  );

  const handleStreamClick = (id) => {
    navigate("/stream/" + id);
  };

  const handleDeleteUser = async () => {
    try {
      await apiService.deleteUser(user.id);
      localStorage.removeItem("token");
      window.location.reload();
    } catch (error) {
      console.error(error);
    }
  };

  const handleVideoClick = (id) => {
    navigate("/video/" + id);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await apiService.updateUser(user.id, {
        profile_pic: parseInt(activeAvatar),
        username,
        email,
        password,
      });

      window.location.reload();
      // redirect to protected route
    } catch (error) {
      console.error(error);
      // display error message
      setError(error.response.data);
    }
  };

  useEffect(() => {
    if (user) {
      async function fetchData() {
        try {
          const streamResponse = await apiService.getStreamByUserId(user.id);
          const videoResponse = await apiService.getVideoByUserId(user.id);

          // Add 'type' property to stream items
          const streamsData = streamResponse.data.map((stream) => ({
            ...stream,
            type: "stream",
          }));

          // Add 'type' property to video items
          const videosData = videoResponse.data.map((video) => ({
            ...video,
            type: "video",
          }));

          // Combine the results into one array
          const combinedData = [...streamsData, ...videosData];

          setStreams(combinedData);
        } catch (error) {
          console.error(error);
        }
      }

      fetchData();
    }
  }, [user]);

  return (
    <div className="profile">
      <div className="gradient">
        <div className="userinfo">
          <img
            src={getProfilePicture(user && user.profile_pic)}
            className="profilepicture"
          />
          <h2 className="username">{username}</h2>
        </div>
      </div>
      <div className="middle">
        {/* <p className="accountverwijderen" onClick={handleDeleteUser}>
          Account verwijderen
        </p> */}
      </div>
      <div className="profile-main">
        <div className="main-left">
          <h2 className="aanpassen">Profielfoto aanpassen :</h2>
          <div className="avatar">
            <div className="avatar-container">
              <div>
                <img
                  src={man}
                  className={`avatar-icon ${
                    activeAvatar === "1" ? "active" : ""
                  }`}
                  value="1"
                  onClick={() => {
                    handleAvatarClick("1");
                    setProfilePicture(1);
                  }}
                />
                <img
                  src={woman}
                  className={`avatar-icon ${
                    activeAvatar === "2" ? "active" : ""
                  }`}
                  value="2"
                  onClick={() => {
                    handleAvatarClick("2");
                    setProfilePicture(2);
                  }}
                />
              </div>
              <div>
                <img
                  src={rabbit}
                  className={`avatar-icon ${
                    activeAvatar === "3" ? "active" : ""
                  }`}
                  value="3"
                  onClick={() => {
                    handleAvatarClick("3");
                    setProfilePicture(3);
                  }}
                />
                <img
                  src={bear}
                  className={`avatar-icon ${
                    activeAvatar === "4" ? "active" : ""
                  }`}
                  value="4"
                  onClick={() => {
                    handleAvatarClick("4");
                    setProfilePicture(4);
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="main-right">
          <h2 className="main-right-title">Mijn stream’s & video’s</h2>
          <div className="main-right-content">
            {streams.length === 0 ? (
              <p className="no-messages">
                U heeft geen stream of video's geplaatst
              </p>
            ) : (
              streams &&
              streams.map((video, index) => (
                <div
                  className="streamcontainer"
                  key={index}
                  onClick={() => {
                    if (video.type === "stream") {
                      handleStreamClick(video.id);
                    } else {
                      handleVideoClick(video.id);
                    }
                  }}
                >
                  <Thumbnail url={video.iframe} />
                  <h2 className="stream-title">{video.title}</h2>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="main-middle">
          {error && error.message}
          <div className="username">
            <label className="label">Username</label>
            <input
              type="text"
              className="username-input input"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            ></input>
          </div>
          <div className="email">
            <label className="label">Email</label>
            <input
              type="email"
              className="email-input input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            ></input>
          </div>
          <div className="password">
            <label className="label">Wachtwoord</label>
            <input
              type="password"
              className="password-input input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            ></input>
          </div>
          <button className="aanpassenbtn" onClick={handleSubmit}>
            Aanpassen
          </button>
          <p className="accountverwijderen" onClick={handleDeleteUser}>
            Account verwijderen
          </p>
        </div>
      </div>
    </div>
  );
}
