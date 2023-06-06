import React from "react";

function SentMessage({ user, time, message, role }) {
  return (
    <div className="sendmessage">
      <div className="sendmessage-top">
        <p className="sendmessage-user">{user}</p>
        {role == "streamer" && <p className="sendmessage-streamerdot"></p>}
      </div>
      <div className="sendmessage-content">
        <p className="sendmessage-message">{message}</p>
      </div>
    </div>
  );
}

export default SentMessage;
