import React from "react";

function ReceivedMessage({ user, time, message, role }) {
  return (
    <div className="receivedmessage">
      <div className="receivedmessage-top">
        <p className="receivedmessage-user">{user}</p>
        {role == "streamer" && <p className="sendmessage-streamerdot"></p>}
      </div>
      <div className="receivedmessage-content">
        <p className="receivedmessage-message">{message}</p>
      </div>
    </div>
  );
}

export default ReceivedMessage;
