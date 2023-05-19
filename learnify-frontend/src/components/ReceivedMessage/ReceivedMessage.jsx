import React from "react";

function ReceivedMessage({ user, time, message }) {
  return (
    <div className="receivedmessage">
      <div className="receivedmessage-top">
        <p className="receivedmessage-user">{user},</p>
        <p className="receivedmessage-time">{time}</p>
      </div>
      <div className="receivedmessage-content">
        <p className="receivedmessage-message">{message}</p>
      </div>
    </div>
  );
}

export default ReceivedMessage;
