import React from "react";
import "./landing.scss";
import landingimg from "../../assets/landing_img.png";
import search_icon from "../../assets/search.svg";
import hand from "../../assets/hand.svg";
import people from "../../assets/people.svg";
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
            <span className="saai underline">saai</span> maken !
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

        <div className="landing-middle-container">
          <div className="info-container">
            <img src={search_icon} className="info-icon" />
            <h2 className="info-title">Vind uw opleiding</h2>
            <p className="info-description">
              Learnify helpt je toekomstige studies te vinden door je alle
              beschikbare lessen voor elke opleiding in België te geven!{" "}
            </p>
          </div>
          <div className="info-container">
            <img src={hand} className="info-icon" />
            <h2 className="info-title">Een interactieve ervaring</h2>
            <p className="info-description">
              Dankzij een live chat, polls, q&a sessies en nog meer coole
              functies brengt Learnify een nieuwe en interactieve manier van
              lesgeven, waardoor online lessen veel leuker worden!
            </p>
          </div>
          <div className="info-container">
            <img src={people} className="info-icon" />
            <h2 className="info-title">Belgische opleidingen</h2>
            <p className="info-description">
              Wij bieden een manier om lessen van verschillende Belgische
              opleidingen te volgen om je studiekeuze te vergemakkelijken!
            </p>
          </div>
        </div>

        <div className="landing-bottom">
          <h1 className="bottom-title">
            De nieuwe manier om online les te geven
          </h1>
          <p className="bottom-description">
            Learnify biedt een volledig nieuw manier voor docenten om hun
            studenten les te geven. Het motiveert studenten om deel te nemen aan
            de lessen en maakt het voor hen gemakkelijker om de leerstof te
            begrijpen. <span className="orange">Op wat wacht je ?</span>
          </p>
          <button class="landing-btn" onClick={handleRedirect}>
            Schrijf je nu in !
          </button>
        </div>
      </div>
    </div>
  );
}
