import React, { useState, useEffect, useCallback, useContext } from "react";
import "./pageuser.scss";
import { useLocation, useNavigate, useParams } from "react-router-dom";
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

export default function PageUser() {
  const [streams, setStreams] = useState([]);
  const [videos, setVideos] = useState([]);
  const [user, setUser] = useState({});
  const { userid } = useParams();
  const navigate = useNavigate();

  const handleStreamClick = (id) => {
    navigate("/stream/" + id);
  };

  const handleVideoClick = (id) => {
    navigate("/video/" + id);
  };

  console.log(user);

  useEffect(() => {
    if (userid) {
      async function fetchData() {
        try {
          const user = await apiService.getUserById(userid);
          const streamResponse = await apiService.getStreamByUserId(userid);
          const videoResponse = await apiService.getVideoByUserId(userid);
          setUser(user.data);
          setStreams(streamResponse.data);
          setVideos(videoResponse.data);
        } catch (error) {
          console.error(error);
        }
      }

      fetchData();
    }
  }, [userid]);
  return (
    <div className="userpage">
      <div className="gradient">
        <div className="userinfo">
          <img
            src={getProfilePicture(user && user.profile_pic)}
            className="profilepicture"
          />
          <h2 className="username">{user && user.username}</h2>
        </div>
      </div>
      <div className="streams">
        <h2 className="streams-title">Huidige stream 🔴 : </h2>
        <div className="streamscontainer">
          {streams.length === 0 ? (
            <p className="no-messages">Er zijn nog geen streams beschikbaar</p>
          ) : (
            streams &&
            streams.map((stream, index) => (
              <div
                className="streamcontainer"
                key={index}
                onClick={() => handleStreamClick(stream.id)}
              >
                <div className="thumbnail-container">
                  <Thumbnail url={stream.iframe} />
                  <img src={liveicon} alt="Live Icon" className="live-icon" />
                </div>
                <h2 className="stream-title">{stream.title}</h2>
              </div>
            ))
          )}
        </div>
      </div>

      <div className="videos">
        <h2 className="videos-title">Video's</h2>
        <div className="videoscontainer">
          {videos.length === 0 ? (
            <p className="no-messages">Er zijn nog geen video's beschikbaar</p>
          ) : (
            videos &&
            videos.map((stream, index) => (
              <div
                className="streamcontainer"
                key={index}
                onClick={() => handleStreamClick(stream.id)}
              >
                <div className="thumbnail-container">
                  <Thumbnail url={stream.iframe} />
                </div>
                <h2 className="stream-title">{stream.title}</h2>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
