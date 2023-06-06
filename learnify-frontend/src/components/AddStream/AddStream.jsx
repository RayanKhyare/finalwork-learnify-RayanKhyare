import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./addstream.scss";
import checksign from "../../assets/check.svg";
import apiService from "../services/apiService";
import extractVideoId from "../services/extractVideoid";
import axios from "axios";
import { getProfilePicture } from "../services/profilePicService";
import googleApiKey from "../services/apiKey";
import jwt_decode from "jwt-decode";
import { motion } from "framer-motion";

export default function AddStream() {
  const [iframe, setIframe] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [categories, setCategories] = useState("");
  const [user_id, setuser_id] = useState("");
  const [error, setError] = useState("");

  const [selectedFile, setSelectedFile] = useState(null);
  const [fileName, setFileName] = useState("null");
  const [fileUrl, setFileUrl] = useState("");

  const [loading, setLoading] = useState(false);
  const [urlIsLoading, setUrlIsLoading] = useState(false);
  const [isUrlValid, setIsUrlValid] = useState(false);

  const navigate = useNavigate();
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const token = localStorage.getItem("token");
      const decodedToken = jwt_decode(token);
      setuser_id(decodedToken.id);
    }
  });

  const checkUrl = async (e, iframe) => {
    e.preventDefault();
    setUrlIsLoading(true);
    setTimeout(async () => {
      try {
        // Extract video ID from YouTube URL
        const videoId = extractVideoId(iframe);

        setError("");

        if (!videoId) {
          // Handle invalid URL
          setError(
            "     Invalid YouTube URL , the format should be 'https://www.youtube.com/watch?v='uw_stream_id'"
          );
          return;
        }

        const response = await axios.get(
          `https://www.googleapis.com/youtube/v3/videos?part=snippet&id=${videoId}&key=${googleApiKey.googleApiKey}`
        );

        if (response.data.items.length === 0) {
          // Handle non-existent video
          setError("YouTube video not found");
          return;
        }

        // Extract title and description from API response
        const { title, description } = response.data.items[0].snippet;

        // Update input values
        setTitle(title);
        setDescription(description);
        setUrlIsLoading(false);
        setIsUrlValid(true);
      } catch (error) {
        console.error(error);
        setError("An error occurred");
      }
    }, 1000);
  };

  function handleFileData(file, name) {
    setSelectedFile(file);
    setFileName(name);
    console.log(file, name);
  }

  const handleSubmit = async (e) => {
    const randomNumber = Math.floor(Math.random() * 10000) + 1;
    e.preventDefault();

    setLoading(true);
    try {
      const response = await apiService.postStream({
        user_id,
        category_id: parseInt(category),
        room_id: parseInt(randomNumber),
        title,
        description,
        iframe,
      });

      if (selectedFile) {
        const formData = new FormData();
        formData.append("file", selectedFile);
        formData.append("upload_preset", "learnify");

        const fileUploadResponse = await axios.post(
          "https://api.cloudinary.com/v1_1/dytevoqrc/image/upload",
          formData
        );

        console.log(fileUploadResponse);

        await apiService
          .postFile({
            stream_id: response.data.id,
            filename: fileName,
            url: fileUploadResponse.data.url,
          })
          .then(() => {
            setLoading(false);
            navigate(`/dashboard/${response.data.id}`);
          });
      } else {
        navigate(`/dashboard/${response.data.id}`);
      }
    } catch (error) {
      console.error(error);
      setError(error.response.data);
      setLoading(false);
    }
  };

  useEffect(() => {
    async function fetchAllCategories() {
      try {
        const response = await apiService.getCategories();
        console.log(response.data);

        setCategories(response.data);
      } catch (error) {
        console.error(error);
      }
    }

    fetchAllCategories();
  }, [location]);

  return (
    <div className="addstream">
      <div className="addstream-header">
        <h1 className="addstream-title">Een livestream starten</h1>
      </div>
      <p className="addstream-description">
        Het starten van een livestream in Learnify is heel eenvoudig. U hoeft
        alleen een Youtube URL in te vullen en de nodige informatie toe te
        voegen!
      </p>

      <form
        className="addstream-form"
        //   onSubmit={handleSubmit}
      >
        {error && <div className="error">{error}</div>}
        <div className="firstline">
          <div className="addstream-field">
            <label className="addstream-form-label">YouTube link</label>
            <div className="input-flex">
              <input
                type="text"
                className="input iframe"
                value={iframe}
                placeholder="Voer de YouTube link in"
                onChange={(e) => {
                  setIframe(e.target.value);
                  checkUrl(e, e.target.value);
                }}
              />
              {urlIsLoading && <div className="loader-url"></div>}

              {isUrlValid && <div className="checkmark">✅</div>}
            </div>
          </div>
        </div>
        <div className="firstline-vertical">
          <div>
            <div className="addstream-field">
              <label className="addstream-form-label">Livestream title</label>

              <input
                type="text"
                className="input"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>

            <div className="addstream-field">
              <label className="addstream-form-label" htmlFor="role">
                Voor welke opleiding geeft u les ?
              </label>
              <select
                className="input opleiding-input"
                id="role"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                <option value="">Kies een opleiding</option>
                {categories &&
                  categories
                    .sort((a, b) => a.name.localeCompare(b.name))
                    .map((category, index) => (
                      <option value={category.id} key={index}>
                        {category.name}
                      </option>
                    ))}
              </select>

              <div className="addstream-field field-input">
                <label className="addstream-form-label">
                  Extra bestanden (optioneel)
                </label>

                <input
                  type="file"
                  id="files"
                  className="custom-file-input"
                  onChange={(event) => {
                    handleFileData(
                      event.target.files[0],
                      event.target.files[0].name
                    );
                  }}
                />
              </div>
            </div>
          </div>
          <div className="addstream-field">
            <label className="addstream-form-label">Beschrijving</label>

            <textarea
              type="textarea"
              className="input textarea"
              value={description}
              placeholder=""
              onChange={(e) => setDescription(e.target.value)}
              maxLength={200}
            />
            <p className="max">Maximum 200 karakters</p>
          </div>
        </div>
        <div className="submitdiv">
          <button
            className="addstream-btn"
            type="submit"
            onClick={handleSubmit}
          >
            <img src={checksign} className="checksign" />
            Live starten
          </button>
          {loading && <div class="loader"></div>}
        </div>
      </form>
    </div>
  );
}
