import React from "react";

function SentMessage({ user, time, message }) {
  return (
    <div className="sendmessage">
      <div className="sendmessage-top">
        <p className="sendmessage-user">{user},</p>
        <p className="sendmessage-time">{time}</p>
      </div>
      <div className="sendmessage-content">
        <p className="sendmessage-message">{message}</p>
      </div>
    </div>
  );
}

export default SentMessage;
