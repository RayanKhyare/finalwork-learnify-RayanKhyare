import React, { useState, useEffect, useRef } from "react";
import "./header.scss";
import { useNavigate, useLocation } from "react-router-dom";

import streambtn from "../../assets/stream-btn.svg";
import addvideo from "../../assets/addvideo-btn.svg";

import man from "../../assets/man.png";
import woman from "../../assets/woman.png";
import rabbit from "../../assets/rabbit.png";
import bear from "../../assets/bear.png";

import jwt_decode from "jwt-decode";
import apiService from "../services/apiService";
import { BiLogOut } from "react-icons/bi";

import { getProfilePicture } from "../services/profilePicService";

export default function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef(null);

  const [hasStream, setHasStream] = useState(false);
  const [userStream, setUserStream] = useState({});

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

  function handleClickBladeren() {
    navigate("/bladeren");
  }

  function handleClickAddVideo() {
    navigate("/addvideo");
  }

  function handleClickProfile() {
    navigate("/profile/" + userID);
  }

  function handleClickAddStream() {
    if (hasStream == true) {
      navigate(`/dashboard/${userStream.id}`);
    } else {
      navigate("/startstream");
    }
  }

  const handleProfileClick = () => {
    setIsMenuOpen(!isMenuOpen); // Toggle the menu visibility
  };

  const handleClickOutside = (event) => {
    if (menuRef.current && !menuRef.current.contains(event.target)) {
      setIsMenuOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

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
        .then((response) => {
          setUser(response.data);
        })
        .catch((error) => console.log(error));
    } else {
      setIsLoggedIn(false);
    }
  }, [navigate]);

  useEffect(() => {
    if (user) {
      apiService
        .getStreamByUserId(user.id)
        .then((response) => {
          setUserStream(response.data[0]);
          if (response.data.length !== 0) {
            setHasStream(true);
          } else {
            setHasStream(false);
          }
        })
        .catch((error) => console.log(error));
    }
  }, [user]);

  return (
    <header className="header">
      <h1 className="title_logo" onClick={handleClickLanding}>
        learnify
      </h1>
      <div className="navigation">
        {/* <div className="navigation-general">
          <ul className="navigation-ul">
            <li className="home-li" onClick={handleClickMain}>
              Home
            </li>
            <li className="bladeren-li" onClick={handleClickBladeren}>
              Bladeren
            </li>
          </ul>
        </div> */}

        <div>
          <span></span>
        </div>

        {user && user.role === TEACHER_ROLE ? (
          <div className="navigation-teacher">
            <img
              src={addvideo}
              className="addvideo-btn"
              onClick={handleClickAddVideo}
            />
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
          {/* <h1 className="username">{user && user.username}</h1> */}
          <div className="profile-dropdown" ref={menuRef}>
            <img
              src={getProfilePicture(user && user.profile_pic)}
              className="profilepicture"
              onClick={handleProfileClick}
            />
            {isMenuOpen && (
              <div className="dropdown-menu">
                <h3 className="menu-item" onClick={handleClickProfile}>
                  Profiel
                </h3>
                <div className="logout">
                  <h3
                    className="menu-item"
                    onClick={() => {
                      localStorage.removeItem("token"); // remove the JWT token from local storage
                      setIsLoggedIn(false); // update the state to false
                      navigate("/login");
                    }}
                  >
                    Logout
                  </h3>
                </div>
              </div>
            )}
          </div>
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
