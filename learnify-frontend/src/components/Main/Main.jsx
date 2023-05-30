import React, { useState, useEffect, useContext } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import apiService from "../services/apiService";
import Video from "../services/videoService";
import Thumbnail from "../services/thumbnailService";

import "./main.scss";
import FirstVisit from "../FirstVisitPopUp/FirstVisit";
import { UserContext } from "../../App";
import { getProfilePicture } from "../services/profilePicService";
export default function Main() {
  const [featuredStream, setFeaturedStream] = useState({});
  const [allStreams, setAllStreams] = useState([]);
  const [allVideos, setAllVideos] = useState([]);
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useContext(UserContext);

  useEffect(() => {
    async function fetchFeaturedStream() {
      try {
        const response = await apiService.getAllStreams();

        const featured_user = await apiService.getUserById(
          response.data[0].user_id
        );

        const featuredStreamWithUsername = {
          ...response.data[0],
          username: featured_user.data.username,
          profile_pic: featured_user.data.profile_pic,
        };

        setFeaturedStream(featuredStreamWithUsername);
      } catch (error) {
        console.error(error);
      }
    }

    fetchFeaturedStream();
  }, [location]);

  useEffect(() => {
    async function fetchAllStreams() {
      try {
        const response = await apiService.getAllStreams();

        const streamsWithUsernames = [];

        for (const stream of response.data) {
          const userResponse = await apiService.getUserById(stream.user_id);

          const username = userResponse.data.username || "Unknown"; // Access username or set it as 'Unknown' if not available

          const streamWithUsername = {
            ...stream,
            username: username,
            profile_pic: userResponse.data.profile_pic,
          };

          streamsWithUsernames.push(streamWithUsername);
        }

        setAllStreams(streamsWithUsernames);
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

        const videosWithUsernames = [];

        for (const video of response.data) {
          const userResponse = await apiService.getUserById(video.user_id);

          const username = userResponse.data.username || "Unknown"; // Access username or set it as 'Unknown' if not available

          const videoWithUsername = {
            ...video,
            username: username,
            profile_pic: userResponse.data.profile_pic,
          };

          videosWithUsernames.push(videoWithUsername);
        }

        setAllVideos(videosWithUsernames);
      } catch (error) {
        console.error(error);
      }
    }

    fetchAllVideos();
  }, [location]);

  const handleUrl = async (e) => {
    e.preventDefault();

    navigate(`/stream/${featuredStream.id}`);
  };

  const handleStreamClick = (id) => {
    navigate(`/stream/${id}`);
  };

  const handleVideoClick = (id) => {
    navigate(`/video/${id}`);
  };

  return (
    <div className="main">
      {Object.keys(featuredStream).length !== 0 ? (
        <div className="featuredstream-container">
          <div className="featuredstream-container-left">
            <h1 className="featuredstream-streamtitle" onClick={handleUrl}>
              {featuredStream.description && featuredStream.title}
            </h1>
            <div className="featuredstream-streamercontainer">
              <img
                className="featuredstream-streamerimg"
                src={getProfilePicture(
                  featuredStream && featuredStream.profile_pic
                )}
              />
              <h2 className="featuredstream-streamername">
                {featuredStream.username && featuredStream.username}
              </h2>
            </div>
            <p className="featuredstream-description">
              {featuredStream.description && featuredStream.description}
            </p>
          </div>
          {featuredStream.iframe && (
            <div className="featuredstream-container-right">
              <Video url={featuredStream.iframe} />
            </div>
          )}
        </div>
      ) : (
        ""
      )}

      <div className="allstreams">
        <h2 className="allstreams-title">
          <span className="blue">Alle</span> streams
        </h2>
        <div className="streamscontainer">
          {allStreams.length === 0 ? (
            <p className="no-messages">Er zijn nog geen streams beschikbaar</p>
          ) : (
            allStreams &&
            allStreams.map((stream, index) => (
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
      </div>

      <div className="allvideos">
        <h2 className="allvideos-title">
          <span className="blue">Alle</span> videos
        </h2>
        <div className="videoscontainer">
          {allVideos.length === 0 ? (
            <p className="no-messages">Er zijn nog geen videos beschikbaar</p>
          ) : (
            allVideos &&
            allVideos.map((video, index) => (
              <div
                className="videocontainer"
                key={index}
                onClick={() => handleVideoClick(video.id)}
              >
                <Thumbnail url={video.iframe} />
                <h2 className="video-title">{video.title}</h2>
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
