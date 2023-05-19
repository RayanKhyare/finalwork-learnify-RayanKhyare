import React, { useState, useEffect, useCallback, useContext } from "react";

import { RxCross1 } from "react-icons/rx";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import jwt_decode from "jwt-decode";
import apiService from "../services/apiService";
import stockimage from "../../assets/stockimage_man.jpg";
import Video from "../services/videoService";
import ReceivedMessage from "../ReceivedMessage/ReceivedMessage";
import SentMessage from "../SentMessage/SentMessage";
import socket from "../services/socket";
import "./stream.scss";

import { UserContext } from "../../App";
export default function () {
  const { streamid } = useParams();
  const [message, setMessage] = useState("");
  const [room, setRoom] = useState("");
  const [messages, setMessages] = useState([]);
  const [streamData, setStreamData] = useState({});

  const [title, setTitle] = useState("");
  const [beschrijving, setBeschrijving] = useState("");

  const [question, setQuestion] = useState(null);
  const [remainingTime, setRemainingTime] = useState(0);
  const [answer, setAnswer] = useState(null);

  const [poll, setPoll] = useState(null);
  const [vote, setVote] = useState("");

  const [showQandAOverlay, setShowQandAOverlay] = useState(true);
  const [showPollOverlay, setShowPollOverlay] = useState(true);
  const { user } = useContext(UserContext);

  const joinRoom = useCallback(
    (room) => {
      if (room !== "") {
        socket.emit("join_room", { user: user.username, room });
      }
    },
    [user]
  );

  const sendMessage = () => {
    socket.emit("send_message", { user: user.username, message, room });
    setMessages([...messages, { message, user: user.username }]);
  };

  const sendAnswer = () => {
    console.log(answer);
    socket.emit("send_answer", {
      user,
      room,
      answer: answer,
    });
  };

  const sendVote = (vote) => {
    socket.emit("send_vote", {
      user: user.username,
      room,
      vote: vote,
    });
  };

  useEffect(() => {
    async function fetchStream() {
      try {
        const response = await apiService.getStreamById(streamid);

        setStreamData(response.data);
        setRoom(response.data.room_id);
      } catch (error) {
        console.error(error);
      }
    }
    fetchStream();
  }, [streamid]);

  useEffect(() => {
    joinRoom(room);
  }, [room, joinRoom]);

  useEffect(() => {
    socket.on("receive_message", (data) => {
      setMessages((prevMessages) => [
        ...prevMessages,
        { message: data.message, user: data.user },
      ]);
    });

    // Viewer-side
    socket.on("receive_question", (questionData) => {
      setQuestion(questionData);
      setRemainingTime(30); // Set the duration to 60 seconds
    });

    // Viewer-side
    socket.on("receive_poll", (questionData) => {
      setPoll(questionData);
      setRemainingTime(30); // Set the duration to 60 seconds
    });
  }, []);

  useEffect(() => {
    let timer;
    if (remainingTime > 0) {
      timer = setInterval(() => {
        setRemainingTime((prevTime) => prevTime - 1);
      }, 1000);
    }
    return () => {
      clearInterval(timer);
    };
  }, [remainingTime]);

  useEffect(() => {
    if (remainingTime === 0) {
      setQuestion(null);
      setPoll(null);
    }
  }, [remainingTime]);
  console.log(vote);
  return (
    <div className="stream">
      <div className="stream-left">
        {poll && (
          <div
            className="poll-overlay"
            style={{ display: showPollOverlay ? "flex" : "none" }}
          >
            <div className="poll-container">
              <div className="poll-header">
                <p
                  className="poll-cross"
                  onClick={() => setShowPollOverlay(false)}
                >
                  <RxCross1 />
                </p>
              </div>
              <h1 className="poll">Poll</h1>
              <h3 className="poll-question">{poll.pollQuestion}</h3>
              {poll.options.map((option, index) => (
                <button
                  key={index}
                  className="choice-input"
                  id={index}
                  onClick={() => {
                    setVote(option);
                    sendVote(option);
                  }}
                >
                  {option}
                </button>
              ))}
              <p class="remaining-time">
                {" "}
                Remaining Time: {remainingTime} seconds
              </p>
            </div>
          </div>
        )}
        {question && (
          <div
            className="qanda-overlay"
            style={{ display: showQandAOverlay ? "flex" : "none" }}
          >
            <div className="qanda-container">
              <div className="qanda-header">
                <p
                  className="qanda-cross"
                  onClick={() => setShowQandAOverlay(false)}
                >
                  <RxCross1 />
                </p>
              </div>
              <h1 className="qanda">Q&A</h1>
              <h3 className="qanda-question">{question.question}</h3>
              <input
                type="text"
                className="answer-input"
                onChange={(e) => {
                  setAnswer(e.target.value);
                }}
              ></input>
              <input
                type="submit"
                className="answer-sent"
                onClick={sendAnswer}
              ></input>
              <p class="remaining-time">
                Remaining Time: {remainingTime} seconds
              </p>
            </div>
          </div>
        )}

        {streamData.iframe && <Video url={streamData.iframe} />}
        <div className="stream-bottom-left">
          <h1 className="stream-title">{streamData.title}</h1>

          <div className="streamer">
            <img className="streamer-streamerimg" src={stockimage} />
            <h2 className="streamer-streamername">Rayan Khyare</h2>
          </div>
          <h3 className="stream-beschrijvingtitle">Beschrijving</h3>
          <p className="stream-beschrijving">{streamData.description}</p>
        </div>
      </div>
      <div className="chat-container">
        <div className="chat-top">
          <h2 className="livechat-title">Live chat</h2>
        </div>
        <div className="chat-bottom">
          <div className="message-container">
            {messages.length === 0 ? (
              <p className="no-messages">Nog geen berichten</p>
            ) : (
              messages.map((msg, index) => {
                if (msg.user === user.username) {
                  return (
                    <SentMessage
                      key={index}
                      user={msg.user === "" ? "Anoniem" : msg.user}
                      time={new Date().toLocaleTimeString()}
                      message={msg.message}
                    />
                  );
                } else {
                  return (
                    <ReceivedMessage
                      key={index}
                      user={msg.user}
                      time={new Date().toLocaleTimeString()}
                      message={msg.message}
                    />
                  );
                }
              })
            )}
          </div>
          <div>
            <div className="input-container">
              <input
                className="sentmessage-input"
                placeholder="Stuur een bericht"
                onChange={(e) => {
                  setMessage(e.target.value);
                }}
              />
            </div>
            <button className="sentmessage-btn" onClick={sendMessage}>
              Sturen
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
