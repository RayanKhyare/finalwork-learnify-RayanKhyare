import React, { useState } from "react";
import apiService from "../services/apiService";
import { useNavigate } from "react-router-dom";
import man from "../../assets/man.png";
import woman from "../../assets/woman.png";
import rabbit from "../../assets/rabbit.png";
import bear from "../../assets/bear.png";
import "./register.scss";

const Register = () => {
  const [role, setRole] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [profilepicture, setProfilePicture] = useState(1);
  const [activeAvatar, setActiveAvatar] = useState(1);

  const navigate = useNavigate();

  const handleAvatarClick = (value) => {
    setActiveAvatar(value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await apiService.register({
        role: parseInt(role),
        profile_pic: parseInt(profilepicture),
        username,
        email,
        password,
      });
      navigate("/login");
      // redirect to protected route
    } catch (error) {
      console.error(error);
      // display error message
      setError(error.response.data);
    }
  };

  const handleRedirect = (e) => {
    navigate("/login");
  };

  return (
    <div className="register">
      <div className="register-left">
        <h2 className="register-title">Aan de slag </h2>
        <div className="formandavatar">
          <form className="register-form" onSubmit={handleSubmit}>
            {error && <div className="error">{error}</div>}

            <label htmlFor="role" className="role-label">
              Ik ben een...
            </label>
            <select
              id="role"
              value={role}
              className="role"
              onChange={(e) => setRole(e.target.value)}
            >
              <option value="">Kies een role</option>
              <option value="3">Student</option>
              <option value="2">Docent</option>
            </select>

            <div className="field">
              <input
                type="text"
                value={username}
                className="username"
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Vul uw naam in"
              />
            </div>

            <input
              type="email"
              value={email}
              className="email"
              placeholder="Voer uw e-mail in"
              onChange={(e) => setEmail(e.target.value)}
            />
            <div className="field">
              <input
                type="password"
                className="password"
                placeholder="Maak een wachtwoord aan"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <p className="max">Moet minstens 8 karakters bevatten</p>
            </div>
            <button className="register-btn" type="submit">
              Account aanmaken
            </button>
          </form>

          <div className="avatar">
            <h2 className="kiesavatar">Kies een avatar</h2>
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
        <p className="alreadyaccount">
          Heb je al een account?
          <span className="inloggen" onClick={handleRedirect}>
            Inloggen
          </span>
        </p>
      </div>
    </div>
  );
};

export default Register;
