import React from "react";
import "./landing.scss";
import landingimg from "../../assets/landing_img.png";
import { useNavigate } from "react-router-dom";

export default function Landing() {
  const navigate = useNavigate();
  const handleRedirect = (e) => {
    navigate("/main");
  };
  return (
    <div className="landing">
      <div className="landing-top">
        <div className="landing-top-left">
          <h1 className="landing-title">
            Online lessen <br></br>minder<br></br>{" "}
            <span className="saai">saai</span> maken !
          </h1>
          <p className="landing-top-description">
            Learnify biedt een nieuwe, meer interactieve en leuke manier voor
            docenten om les te geven en studenten om hun lessen te volgen !
          </p>
          <button class="landing-btn" onClick={handleRedirect}>
            Begin met kijken &#8594;
          </button>
        </div>
        <div className="landing-top-right">
          <img className="landing-image" src={landingimg} />
        </div>
      </div>
      <div className="landing-middle">
        <h1 className="landing-middle-title">
          Een interactief streaming platform gericht op onderwijs
        </h1>
      </div>
    </div>
  );
}
