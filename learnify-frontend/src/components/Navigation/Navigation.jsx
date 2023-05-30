import React, { useContext } from "react";
import home from "../../assets/home.svg";
import compass from "../../assets/compass.svg";
import stop from "../../assets/stop.svg";
import poll from "../../assets/poll.svg";
import qanda from "../../assets/qanda.svg";
import "./navigation.scss";
import { getProfilePicture } from "../services/profilePicService";
import { useNavigate, useLocation } from "react-router-dom";

export default function Navigation() {
  const navigate = useNavigate();
  const location = useLocation();
  const isDashboardPage = location.pathname.startsWith("/dashboard");

  function handleClickMain() {
    navigate("/main");
  }

  function handleClickBladeren() {
    navigate("/bladeren");
  }

  return (
    <div className="navigation">
      {isDashboardPage ? (
        ""
      ) : (
        <div className="simple">
          <img src={home} className="icon" onClick={handleClickMain} />
          <img src={compass} className="icon" onClick={handleClickBladeren} />
        </div>
      )}
    </div>
  );
}
