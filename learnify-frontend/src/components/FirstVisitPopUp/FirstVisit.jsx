import React, { useEffect, useState } from "react";
import "./firstvisit.scss";

import landingimg from "../../assets/landing_img.png";
import search from "../../assets/search.svg";
import hand from "../../assets/hand.svg";
import people from "../../assets/people.svg";
import { getProfilePicture } from "../services/profilePicService";
export default function FirstVisit() {
  const [showFirstPopup, setShowFirstPopup] = useState(true);
  const [showSecondPopup, setShowSecondPopup] = useState(false);

  const refresh = () => window.location.reload(true);
  const handleNextClick = () => {
    setShowFirstPopup(false);
    setShowSecondPopup(true);
  };
  const bodyElement = document.querySelector("body");

  const handleStartClick = () => {
    localStorage.setItem("firstVisit", "false");
    // Set the "firstVisit" value to false in the localStorage

    // Additional logic if needed

    // Hide the firstvisit component
    document.querySelector(".firstvisit").style.display = "none";
    refresh();
  };

  return (
    <div className="firstvisit">
      <div className="overlay"></div>
      {showFirstPopup && (
        <div className="firstpopup">
          <img src={landingimg} className="firstpopup-img" />
          <div className="firstpopup-margin">
            <h2 className="firstpopup-title">
              Online lessen minder <br></br>
              <span className="underline">saai</span> maken !
            </h2>
            <p className="firstpopup-text">
              Learnify biedt een nieuwe, meer interactieve en leuke manier voor
              docenten om les te geven en studenten om hun lessen te volgen !
            </p>

            <div className="firstpopup-footer">
              <div className="firstpopup-points">
                <span class="dot active"></span>
                <span class="dot"></span>
              </div>
              <button className="volgende-btn" onClick={handleNextClick}>
                Volgende
              </button>
            </div>
          </div>
        </div>
      )}

      {showSecondPopup && (
        <div className="secondpopup">
          <img src={landingimg} className="secondpopup-img" />
          <div className="secondpopup-margin">
            <div className="secondpopup-info">
              <img src={search} className="info-icon" />
              <div className="info-data">
                <h1 className="info-title">Vind uw opleiding</h1>
                <p className="info-description">
                  Learnify helpt je toekomstige studies te vinden door je alle
                  beschikbare lessen voor elke opleiding in België te geven!{" "}
                </p>
              </div>
            </div>
            <div className="secondpopup-info">
              <img src={hand} className="info-icon" />
              <div className="info-data">
                <h1 className="info-title">Een interactieve ervaring</h1>
                <p className="info-description">
                  Dankzij een live chat, polls en q&a sessies brengt Learnify
                  een nieuwe en interactieve manier van lesgeven, waardoor
                  online lessen veel leuker worden!
                </p>
              </div>
            </div>
            <div className="secondpopup-info">
              <img src={people} className="info-icon" />
              <div className="info-data">
                <h1 className="info-title">Belgische opleidingen</h1>
                <p className="info-description">
                  Wij bieden een manier om lessen van verschillende Belgische
                  opleidingen te volgen om je studiekeuze te vergemakkelijken!
                </p>
              </div>
            </div>
            <div className="secondpopup-footer">
              <div className="secondpopup-points">
                <span class="dot"></span>
                <span class="dot active"></span>
              </div>
              <button className="starten-btn" onClick={handleStartClick}>
                Starten
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
