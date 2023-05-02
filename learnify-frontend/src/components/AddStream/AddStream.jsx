import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./addstream.scss";
import checksign from "../../assets/check.svg";
import apiService from "../services/apiService";

import jwt_decode from "jwt-decode";

export default function AddStream() {
  const [iframe, setIframe] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [user_id, setuser_id] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const token = localStorage.getItem("token");
      const decodedToken = jwt_decode(token);
      setuser_id(decodedToken.id);
    }
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await apiService.postStream({
        user_id,
        category_id: parseInt(category),
        title,
        description,
        iframe,
      });
      console.log(response.data);

      console.log(response);
      navigate("/main");
      // redirect to protected route
    } catch (error) {
      console.error(error);
      // display error message
      setError(error.response.data);
    }
  };
  return (
    <div className="addstream">
      <div className="addstream-header">
        <h1 className="addstream-title">Een livestream starten</h1>
        <button className="addstream-btn" type="submit" onClick={handleSubmit}>
          <img src={checksign} className="checksign" />
          Live starten
        </button>
      </div>
      <p className="addstream-description">
        Het starten van een livestream in Learnify is heel eenvoudig. Wij werken
        met een iframe-systeem, zodat uw livestreams op zoveel mogelijk
        platforms beschikbaar zijn.
      </p>

      <form
        class="addstream-form"
        //   onSubmit={handleSubmit}
      >
        {/* {error && <div>{error}</div>} */}
        <div className="addstream-field">
          <label className="addstream-form-label">iFrame</label>
          <input
            type="text"
            className="title"
            value={iframe}
            placeholder="Voer de iframe in"
            onChange={(e) => setIframe(e.target.value)}
          />
        </div>

        <div className="addstream-field">
          <label className="addstream-form-label">Livestream title</label>
          <input
            type="text"
            className="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>
        <div className="addstream-field">
          <label className="addstream-form-label">Beschrijving</label>
          <input
            type="textarea"
            className="title"
            value={description}
            placeholder=""
            onChange={(e) => setDescription(e.target.value)}
          />
          <p>Maximum 200 karakters</p>
        </div>
        <div className="addstream-field">
          <label htmlFor="role">Voor welke opleiding geeft u les ?</label>
          <select
            id="role"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="">Kies een opleiding</option>
            <option value="1">Multimedia & Creative Technologies</option>
          </select>
        </div>
      </form>
    </div>
  );
}