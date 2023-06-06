import React, { useEffect, useState, useContext } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import "./video.scss";
import Video from "../services/videoService";
import youtube from "../../assets/youtube.svg";
import apiService from "../services/apiService";
import pen from "../../assets/pen.svg";
import checkmark from "../../assets/checkmark.svg";
import downarrow from "../../assets/down-arrow.svg";
import trash from "../../assets/trash.svg";
import { UserContext } from "../../App";
import { motion } from "framer-motion";
import { getProfilePicture } from "../services/profilePicService";
export default function VideoPage() {
  const { videoid } = useParams();
  const [videoData, setVideoData] = useState({});
  const [showStreamerTools, setShowStreamerTools] = useState(false);
  const [videoTitle, setVideoTitle] = useState("");
  const [videoBeschrijving, setVideoBeschrijving] = useState("");
  const [videoURL, setVideoURL] = useState("");
  const [streamer, setStreamer] = useState("");

  const [streamerProfilePic, setStreamerProfilePic] = useState(null);
  const [categoryName, setCategoryName] = useState("");

  const { user } = useContext(UserContext);

  const [isEditing, setIsEditing] = useState(false);

  const navigate = useNavigate();

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const categoryLink = () => {
    navigate(`/categories/${videoData.category_id}`);
  };

  const handleUserClick = (id) => {
    navigate(`/user/${id}`);
  };

  const handleSaveClick = async () => {
    // Perform your save/update logic here
    try {
      await apiService.updateVideo(videoData.id, {
        title: videoTitle,
        description: videoBeschrijving,
        iframe: videoURL,
      });
      window.location.reload();
    } catch (error) {
      console.error(error);
    }
  };
  const handleDeleteVideo = async () => {
    try {
      await apiService.deleteVideo(videoData.id);
      navigate("/");
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    async function fetchVideo() {
      try {
        const response = await apiService.getVideoById(videoid);

        setVideoData(response.data);
        setVideoBeschrijving(response.data.description);
        setVideoTitle(response.data.title);
        setVideoURL(response.data.iframe);

        const category = await apiService.getCategoryById(
          response.data.category_id
        );
        setCategoryName(category.data.name);

        const streamer = await apiService.getUserById(response.data.user_id);
        setStreamer(streamer.data.username);
        setStreamerProfilePic(streamer.data.profile_pic);
      } catch (error) {
        console.error(error);
      }
    }
    fetchVideo();
  }, [videoid]);

  useEffect(() => {
    if (videoData && user && user.id && videoData.user_id === user.id) {
      setShowStreamerTools(true);
    }
  }, [videoData, user]);

  console.log(videoData);
  return (
    <div className="video">
      <Video url={videoData.iframe && videoData.iframe} />

      <div className="video-bottom">
        <div className="video-bottom-header">
          {!isEditing && (
            <h1 className="video-title">
              {videoData.title && videoData.title}{" "}
            </h1>
          )}
          {isEditing && (
            <div className="titelupdatediv">
              <label className="title-label-aanpassen">Titel</label>
              <input
                type="text"
                className="title-input"
                onChange={(e) => setVideoTitle(e.target.value)}
                value={videoTitle}
              ></input>
            </div>
          )}
          <div className="buttons">
            {showStreamerTools && (
              <button className="deletebtn" onClick={handleDeleteVideo}>
                <img className="trash-img" src={trash} />
              </button>
            )}
            {isEditing && (
              <button className="wijzigenbtn" onClick={handleSaveClick}>
                <img className="checkmark-img" src={checkmark} />
              </button>
            )}
            {showStreamerTools && !isEditing && (
              <button className="wijzigenbtn" onClick={handleEditClick}>
                <img className="pen-img" src={pen} />
              </button>
            )}
            <button className="redirect-link">
              <a href={videoData.iframe} target="_blank">
                <img className="ytb-icon" src={youtube} />
              </a>
            </button>
          </div>
        </div>
        {!isEditing && (
          <h3 className="stream-category" onClick={categoryLink}>
            {categoryName && categoryName}
          </h3>
        )}
        {!isEditing && (
          <div
            className="streamer-container"
            onClick={() => handleUserClick(videoData && videoData.user_id)}
          >
            <img
              src={getProfilePicture(streamerProfilePic && streamerProfilePic)}
              alt=""
              className="streamer-streamerimg"
            />
            <h2 className="streamer-streamername">{streamer && streamer}</h2>
          </div>
        )}

        {isEditing && (
          <div className="urlupdatediv">
            <label className="urllabel">URL Aanpassen</label>
            <input
              type="text"
              className="url-input "
              onChange={(e) => setVideoURL(e.target.value)}
              value={videoURL}
            ></input>
          </div>
        )}
        <h2 className="beschrijving-title">Beschrijving</h2>
        {!isEditing && (
          <p className="beschrijving">
            {videoData.description && videoData.description}
          </p>
        )}
        {isEditing && (
          <div className="beschrijvingupdatediv">
            <textarea
              type="textarea"
              className="beschrijving-input"
              onChange={(e) => setVideoBeschrijving(e.target.value)}
              value={videoBeschrijving}
            ></textarea>
          </div>
        )}
      </div>
    </div>
  );
}
