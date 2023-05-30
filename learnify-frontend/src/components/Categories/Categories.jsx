import React, { useState, useEffect, useCallback, useContext } from "react";
import "./categories.scss";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import apiService from "../services/apiService";
import Thumbnail from "../services/thumbnailService";
import rechten from "../../assets/rechten.jpeg";
import stockimage from "../../assets/stockimage_man.jpg";

import { UserContext } from "../../App";
import { getProfilePicture } from "../services/profilePicService";
export default function Categories() {
  const { categoryid } = useParams();
  const [activeLink, setActiveLink] = useState("livestreams");
  const [streams, setStreams] = useState([]);
  const [videos, setVideos] = useState([]);
  const [category, setCategory] = useState({});
  const { streamid } = useParams();

  const navigate = useNavigate();

  console.log(category);

  const handleLinkClick = (link) => {
    setActiveLink(link);
  };

  const handleStreamClick = (stream) => {
    navigate(`/stream/${stream}`);
  };

  const handleVideoClick = (video) => {
    navigate(`/video/${video}`);
  };

  useEffect(() => {
    async function fetchCategory() {
      try {
        const response = await apiService.getCategoryById(categoryid);
        setCategory(response.data);
        // Check if the current user's user_id matches the user_id in the streamData
      } catch (error) {
        // Handle other errors
        console.error(error);
      }
    }

    fetchCategory();
  }, [categoryid]);
  useEffect(() => {
    async function fetchStreams() {
      try {
        const response = await apiService.getStreamsByCategory(categoryid);
        console.log(response.data);

        const streamWithUsernames = [];

        for (const stream of response.data) {
          const userResponse = await apiService.getUserById(stream.user_id);
          const username = userResponse.data.username || "Unknown"; // Access username or set it as 'Unknown' if not available

          const streamsWithUsername = {
            ...stream,
            username: username,
            profile_pic: userResponse.data.profile_pic,
          };

          streamWithUsernames.push(streamsWithUsername);
        }

        setStreams(streamWithUsernames);
      } catch (error) {
        console.error(error);
      }
    }

    fetchStreams();
  }, [location]);

  useEffect(() => {
    async function fetchVideos() {
      try {
        const response = await apiService.getVideosByCategory(categoryid);
        console.log(response.data);

        const videoWithUsernames = [];

        for (const video of response.data) {
          const userResponse = await apiService.getUserById(video.user_id);
          const username = userResponse.data.username || "Unknown"; // Access username or set it as 'Unknown' if not available

          const videosWithUsername = {
            ...video,
            username: username,
            profile_pic: userResponse.data.profile_pic,
          };

          videoWithUsernames.push(videosWithUsername);
        }

        setVideos(videoWithUsernames);
      } catch (error) {
        console.error(error);
      }
    }

    fetchVideos();
  }, [location]);

  console.log(streams);
  return (
    <div className="categories">
      <div className="categories-header">
        <img className="categories-image" src={category.image_url} />
        {/* <img className="categories-image" src={rechten} /> */}

        <div className="categories-header-right">
          <h2 className="categories-title">{category.name}</h2>
          <p className="categories-description">{category.beschrijving}</p>
        </div>
      </div>

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
                  <img
                    src={getProfilePicture(stream && stream.profile_pic)}
                    className="streamer-img"
                  />
                  <h3 className="streamer-username">{stream.username}</h3>
                </div>
              </div>
            ))
          )}
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
                onClick={() => handleVideoClick(video.id)}
              >
                <Thumbnail url={video.iframe} />
                <h2 className="stream-title">{video.title}</h2>
                <div className="streamerinfo">
                  <img
                    src={getProfilePicture(video && video.profile_pic)}
                    className="streamer-img"
                  />
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
