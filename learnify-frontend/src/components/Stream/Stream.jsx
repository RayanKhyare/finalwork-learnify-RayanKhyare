import React, { useState, useEffect, useCallback, useContext } from "react";

import { RxCross1 } from "react-icons/rx";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import jwt_decode from "jwt-decode";
import apiService from "../services/apiService";

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

  const [canSendMessage, setCanSendMessage] = useState(true);
  const [cooldownTimer, setCooldownTimer] = useState(0);

  const [poll, setPoll] = useState(null);
  const [chosenOptionID, setChosenOptionID] = useState("");
  const [vote, setVote] = useState("");

  const [showQandAOverlay, setShowQandAOverlay] = useState(true);
  const [showPollOverlay, setShowPollOverlay] = useState(true);
  const { user } = useContext(UserContext);

  const navigate = useNavigate();

  const joinRoom = useCallback(
    (room) => {
      if (room !== "") {
        socket.emit("join_room", { username: user.username, room });
      }
    },
    [user]
  );

  // Send Chat message
  const sendMessage = async () => {
    if (canSendMessage) {
      // Your logic to send the message goes here

      const username = user.username || "Anoniem";

      socket.emit("send_message", { username: username, message, room });
      setMessages([...messages, { message, username: username }]);

      try {
        const response = await apiService.postMessages({
          username: username,
          stream_id: parseInt(streamid),
          message,
        });
      } catch (error) {
        console.error(error);
      }

      // Disable sending messages for 5 seconds
      setCanSendMessage(false);
      setCooldownTimer(5);

      setTimeout(() => {
        setCanSendMessage(true);
      }, 5000);
    }
  };

  const sendAnswer = async () => {
    const username = user.username || "Anoniem";
    try {
      socket.emit("send_answer", {
        stream_id: streamid,
        question_id: question.id,
        username: username,
        room,
        answer: answer,
      });
      const response = await apiService.postAnswers({
        stream_id: parseInt(streamid),
        question_id: parseInt(question.id),
        username: username,
        answer: answer,
      });
      setShowQandAOverlay(false);
    } catch (error) {
      console.error(error);
    }
  };

  const sendVote = async (vote, id) => {
    const username = user.username || "Anoniem";
    try {
      socket.emit("send_vote", {
        poll_id: poll.id,
        user: username,
        room,
        vote: vote,
        option_id: parseInt(id),
      });

      try {
        const response = await apiService.postVote({
          user_id: user.id,
          poll_id: poll.id,
          option_id: parseInt(id),
        });

        setShowPollOverlay(false);
      } catch (error) {
        console.error(error);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (streamData && user && user.id && streamData.user_id === user.id) {
      navigate(`/dashboard/${streamid}`);
    }
  }, [streamData, user]);

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
    let interval = null;

    if (!canSendMessage && cooldownTimer > 0) {
      interval = setInterval(() => {
        setCooldownTimer((prevTimer) => prevTimer - 1);
      }, 1000);
    }

    return () => {
      clearInterval(interval);
    };
  }, [canSendMessage, cooldownTimer]);

  useEffect(() => {
    joinRoom(room);
  }, [room, joinRoom]);

  useEffect(() => {
    socket.on("receive_message", (data) => {
      setMessages((prevMessages) => [
        ...prevMessages,
        { message: data.message, username: data.username },
      ]);
    });

    // Viewer-side
    socket.on("receive_question", (questionData) => {
      setShowQandAOverlay(true);
      setQuestion(questionData);

      setRemainingTime(30);
    });

    // Viewer-side
    socket.on("receive_poll", (questionData) => {
      setShowPollOverlay(true);
      setPoll(questionData);
      setRemainingTime(30);
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

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await apiService.getMessagesFromStream(streamid);
        const fetchedMessages = await response.data; // Assuming response.data is the array of objects
        fetchedMessages.forEach((message) => {
          setMessages((prevMessages) => [...prevMessages, message]);
        });
      } catch (error) {
        console.error(error);
      }
    };

    fetchMessages();
  }, [streamid]);

  const handleVote = async (optionId, option) => {
    try {
      await setChosenOptionID(optionId);

      setVote(option);
      await sendVote(option);
    } catch (error) {
      console.error(error);
    }
  };

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
                    setChosenOptionID(option.id);
                    setVote(option.option);
                    sendVote(option.option, option.id);
                  }}
                >
                  {option.option}
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
              <button
                type="submit"
                className="answer-sent"
                onClick={sendAnswer}
              >
                Sturen
              </button>
              <p class="remaining-time">
                Remaining Time: {remainingTime} seconds
              </p>
            </div>
          </div>
        )}

        {streamData.iframe && <Video url={streamData.iframe} />}
        <div className="stream-bottom-left">
          <h1 className="stream-title">{streamData.title}</h1>

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
                if (msg.username === user.username) {
                  return (
                    <SentMessage
                      key={index}
                      user={msg.username}
                      time={new Date().toLocaleTimeString()}
                      message={msg.message}
                    />
                  );
                } else {
                  return (
                    <ReceivedMessage
                      key={index}
                      user={msg.username}
                      time={new Date().toLocaleTimeString()}
                      message={msg.message}
                    />
                  );
                }
              })
            )}
          </div>
          <div className="inputbigcontainer">
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
              {canSendMessage ? "Sturen" : `Wachten (${cooldownTimer})`}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
