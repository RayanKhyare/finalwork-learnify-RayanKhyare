import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import apiService from "../services/apiService";
import stockimage from "../../assets/stockimage_man.jpg";
import Video from "../services/videoService";
import Thumbnail from "../services/thumbnailService";

import "./bladeren.scss";
import Navigation from "../Navigation/Navigation";

export default function Bladeren() {
  const [activeLink, setActiveLink] = useState("livestreams");
  const [streams, setStreams] = useState([]);
  const [videos, setVideos] = useState([]);

  useEffect(() => {
    async function fetchAllStreams() {
      try {
        const response = await apiService.getAllStreams();
        console.log(response.data);

        const streamsWithUsernames = [];

        for (const stream of response.data) {
          const userResponse = await apiService.getUserById(stream.user_id);
          const username = userResponse.data.username || "Unknown"; // Access username or set it as 'Unknown' if not available

          const streamWithUsername = {
            ...stream,
            username: username,
          };

          streamsWithUsernames.push(streamWithUsername);
        }

        setStreams(streamsWithUsernames);
      } catch (error) {
        console.error(error);
      }
    }

    fetchAllStreams();
  }, [location]);

  useEffect(() => {
    async function fetchAllVideos() {
      try {
        const response = await apiService.getAllVideos();
        console.log(response.data);

        const videosWithUsernames = [];

        for (const video of response.data) {
          const userResponse = await apiService.getUserById(video.user_id);
          const username = userResponse.data.username || "Unknown"; // Access username or set it as 'Unknown' if not available

          const videoWithUsername = {
            ...video,
            username: username,
          };

          videosWithUsernames.push(videoWithUsername);
        }

        setVideos(videosWithUsernames);
      } catch (error) {
        console.error(error);
      }
    }

    fetchAllVideos();
  }, [location]);

  const handleLinkClick = (link) => {
    setActiveLink(link);
  };

  return (
    <div className="bladeren">
      <h1 className="bladeren-title">Bladeren</h1>
      <div className="bladeren-nav">
        <h2
          className={`bladeren-link  ${
            activeLink === "livestreams" ? "active" : ""
          }`}
          onClick={() => handleLinkClick("livestreams")}
        >
          Live streams
        </h2>
        <h2
          className={`bladeren-link categorieen ${
            activeLink === "categorieen" ? "active" : ""
          }`}
          onClick={() => handleLinkClick("categorieen")}
        >
          Categorieën
        </h2>
        <h2
          className={`bladeren-link videos ${
            activeLink === "videos" ? "active" : ""
          }`}
          onClick={() => handleLinkClick("videos")}
        >
          Videos
        </h2>
      </div>

      <div className="content-container">
        <div
          className={`livestreams-container ${
            activeLink === "livestreams" ? "active" : "hidden"
          }`}
        >
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
                <Thumbnail url={stream.iframe} />
                <h2 className="stream-title">{stream.title}</h2>
                <div className="streamerinfo">
                  <img src={stockimage} className="streamer-img" />
                  <h3 className="streamer-username">{stream.username}</h3>
                </div>
              </div>
            ))
          )}
        </div>
        <div
          className={`categorieen-container ${
            activeLink === "categorieen" ? "active" : "hidden"
          }`}
        >
          Categorieën
        </div>
        <div
          className={`videos-container ${
            activeLink === "videos" ? "active" : "hidden"
          }`}
        >
          {videos.length === 0 ? (
            <p className="no-messages">Er zijn nog geen streams beschikbaar</p>
          ) : (
            videos &&
            videos.map((video, index) => (
              <div
                className="streamcontainer"
                key={index}
                onClick={() => handleStreamClick(video.id)}
              >
                <Thumbnail url={video.iframe} />
                <h2 className="stream-title">{video.title}</h2>
                <div className="streamerinfo">
                  <img src={stockimage} className="streamer-img" />
                  <h3 className="streamer-username">{video.username}</h3>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
