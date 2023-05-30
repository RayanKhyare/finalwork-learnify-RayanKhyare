import { UserContext } from "../../App";
import React, { useContext } from "react";

// Import the profile pictures
import man from "../../assets/man.png";
import woman from "../../assets/woman.png";
import rabbit from "../../assets/rabbit.png";
import bear from "../../assets/bear.png";

// Function to get the profile picture based on profile_pic value
export function getProfilePicture(pic_id) {
  switch (pic_id) {
    case 1:
      return man;
    case 2:
      return woman;
    case 3:
      return rabbit;
    case 4:
      return bear;
    default:
      return null; // Return a default picture or handle the case as per your needs
  }
}
