import React, { useState, useEffect } from "react";
import "./header.scss";
import { useNavigate, useLocation } from "react-router-dom";

import streambtn from "../../assets/stream-btn.svg";
import addvideo from "../../assets/addvideo-btn.svg";

import jwt_decode from "jwt-decode";
import apiService from "../services/apiService";
import { BiLogOut } from "react-icons/bi";

export default function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userID, setUserID] = useState("");
  const [user, setUser] = useState(null);
  const TEACHER_ROLE = 2;

  const isSomePage =
    location.pathname === "/login" || location.pathname === "/register";
  function handleClickLogin() {
    navigate("/login");
  }

  function handleClickRegister() {
    navigate("/register");
  }

  function handleClickLanding() {
    navigate("/");
  }

  function handleClickMain() {
    navigate("/main");
  }

  function handleClickAddStream() {
    navigate("/startstream");
  }

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setIsLoggedIn(true);

      const token = localStorage.getItem("token");
      const decodedToken = jwt_decode(token);
      setUserID(decodedToken.id);

      // fetch user data
      apiService
        .getUserById(decodedToken.id)
        .then((response) => setUser(response.data))
        .catch((error) => console.log(error));
    } else {
      setIsLoggedIn(false);
    }
  }, [navigate]);
  console.log(user);
  return (
    <header className="header">
      <h1 className="title_logo" onClick={handleClickLanding}>
        learnify
      </h1>
      <div className="navigation">
        <div className="navigation-general">
          <ul className="navigation-ul">
            <li className="home-li" onClick={handleClickMain}>
              Home
            </li>
            <li className="bladeren-li">Bladeren</li>
          </ul>
        </div>

        {user && user.role === TEACHER_ROLE ? (
          <div className="navigation-teacher">
            <img src={addvideo} className="addvideo-btn" />
            <img
              src={streambtn}
              className="stream-btn"
              onClick={handleClickAddStream}
            />
          </div>
        ) : null}
      </div>
      {isLoggedIn ? ( // If the user is logged in, render a different component
        <div className="userdiv">
          <h1 className="username">{user && user.username}</h1>

          <BiLogOut
            className="logout-btn"
            onClick={() => {
              localStorage.removeItem("token"); // remove the JWT token from local storage
              setIsLoggedIn(false); // update the state to false
              navigate("/login");
            }}
          />
        </div>
      ) : // If the user is not logged in, render the authbuttons
      isSomePage ? null : (
        <ul>
          <li className="authbuttons">
            <button className="inloggen-btn" onClick={handleClickLogin}>
              Inloggen
            </button>
            <button className="aanmelden-btn" onClick={handleClickRegister}>
              Inschrijven
            </button>
          </li>
        </ul>
      )}
    </header>
  );
}
