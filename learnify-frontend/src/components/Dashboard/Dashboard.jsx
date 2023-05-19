import React, {
  useState,
  useEffect,
  useCallback,
  useContext,
  createContext,
} from "react";

import "./dashboard.scss";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import jwt_decode from "jwt-decode";
import apiService from "../services/apiService";
import stockimage from "../../assets/stockimage_man.jpg";
import Video from "../services/videoService";
import ReceivedMessage from "../ReceivedMessage/ReceivedMessage";
import SentMessage from "../SentMessage/SentMessage";
import socket from "../services/socket";
import home from "../../assets/home.svg";
import compass from "../../assets/compass.svg";
import pollIcon from "../../assets/poll.svg";
import qandaIcon from "../../assets/qanda.svg";
import stopIcon from "../../assets/stop.svg";

import { RxCross1 } from "react-icons/rx";
import pen from "../../assets/pen.svg";
import checkmark from "../../assets/checkmark.svg";
import downarrow from "../../assets/down-arrow.svg";

import { UserContext } from "../../App";

export default function Dashboard() {
  const { streamid } = useParams();
  const [message, setMessage] = useState("");
  const [room, setRoom] = useState("");
  const [messages, setMessages] = useState([]);
  const [streamData, setStreamData] = useState({});
  const [question, setQuestion] = useState("");

  const [isEditing, setIsEditing] = useState(false);
  const [streamTitle, setStreamTitle] = useState("");
  const [description, setDescription] = useState("");

  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState([]);

  const [poll, setPoll] = useState([]);
  const [pollQuestion, setPollQuestion] = useState(null);
  const [option1, setOption1] = useState(null);
  const [option2, setOption2] = useState(null);
  const [vote, setVote] = useState([]);
  const [option1Count, setOption1Count] = useState(0);
  const [option2Count, setOption2Count] = useState(0);

  const [showQandAOverlay, setShowQandAOverlay] = useState(true);
  const [showPollOverlay, setShowPollOverlay] = useState(true);
  const [showPollContainer, setShowPollContainer] = useState(false);
  const [showQandaContainer, setShowQandaContainer] = useState(false);

  const navigate = useNavigate();
  const { user } = useContext(UserContext);

  const totalVotes = option1Count + option2Count;
  const option1Percentage =
    totalVotes === 0 ? 0 : Math.round((option1Count / totalVotes) * 100);
  const option2Percentage =
    totalVotes === 0 ? 0 : Math.round((option2Count / totalVotes) * 100);

  const handlePollIconClick = () => {
    setShowPollContainer(true);
  };

  const handleQandaIconClick = () => {
    setShowQandaContainer(true);
  };

  const handleSaveClick = async () => {
    // Perform your save/update logic here
    try {
      await apiService.updateStream(streamid, {
        title: streamTitle,
        description: description,
      });
      window.location.reload();
    } catch (error) {
      console.error(error);
    }
  };

  const handleStopStream = async () => {
    try {
      await apiService.deleteStreamById(streamid);

      window.location.reload();
    } catch (error) {
      console.error(error);
    }
  };

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleStreamTitleChange = (e) => {
    setStreamTitle(e.target.value);
  };

  const handleDescriptionChange = (e) => {
    setDescription(e.target.value);
  };

  function handleClickMain() {
    navigate("/main");
  }

  function handleClickBladeren() {
    navigate("/bladeren");
  }

  const joinRoom = useCallback(
    (room) => {
      if (room !== "") {
        socket.emit("join_room", { user: user.username, room });
      }
    },
    [user]
  );

  // Send Chat message
  const sendMessage = () => {
    socket.emit("send_message", { user: user.username, message, room });
    setMessages([...messages, { message, user: user.username }]);
  };

  // Send Poll
  const sendPoll = () => {
    socket.emit("send_poll", {
      room,
      pollQuestion,
      options: [option1, option2],
    });

    setPoll([...poll, { pollQuestion, options: [option1, option2] }]);

    setShowPollContainer(false);
  };

  // Send Q&A Question
  const sendQuestion = async () => {
    // Streamer-side
    socket.emit("send_question", {
      room,
      question,
    });

    try {
      const response = await apiService.postQuestions({
        stream: parseInt(streamid),
        question,
        time: 30,
      });
    } catch (error) {
      console.error(error);
    }

    setQuestions([...questions, { room, question }]);

    setShowQandaContainer(false);
  };

  useEffect(() => {
    async function fetchStream() {
      try {
        const response = await apiService.getStreamById(streamid);
        setStreamData(response.data);
        setRoom(response.data.room_id);
        // Check if the current user's user_id matches the user_id in the streamData

        if (!response || !response.data) {
          navigate("/main");
        }

        if (user && user.id !== response.data.user_id) {
          navigate("/main");
        }

        if (user && user.role !== 2) {
          navigate("/main");
        }
      } catch (error) {
        if (error.response && error.response.status === 404) {
          // Handle 404 error, e.g., redirect to "/not-found"
          navigate("/main");
        } else {
          // Handle other errors
          console.error(error);
        }
      }
    }
    fetchStream();
  }, [streamid, user, navigate]);

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
  }, []);

  useEffect(() => {
    socket.on("show_answers", async (data) => {
      setShowQandAOverlay(true);
      setAnswers((prevAnswers) => [
        ...prevAnswers,
        { answer: data.answer, user: data.user.username },
      ]);
    });
  }, []);

  useEffect(() => {
    const handleReceiveVote = (data) => {
      setShowPollOverlay(true);
      setVote((prevVotes) => [
        ...prevVotes,
        { vote: data.vote, user: data.user },
      ]);

      // Update option counts
      if (data.vote === option1) {
        setOption1Count((prevCount) => prevCount + 1);
      } else if (data.vote === option2) {
        setOption2Count((prevCount) => prevCount + 1);
      }
    };

    socket.on("receive_vote", handleReceiveVote);

    return () => {
      // Clean up the event listener when the component unmounts
      socket.off("receive_vote", handleReceiveVote);
    };
  }, [option1, option2]);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await apiService.getQuestionsByStreamId(streamid);
        const fetchedQuestions = response.data; // Assuming response.data is the array of objects
        console.log(response.data);
        fetchedQuestions.forEach((question) => {
          setQuestions((prevQuestions) => [...prevQuestions, question]);
        });
      } catch (error) {
        console.error(error);
      }
    };

    fetchQuestions();
  }, [streamid]);

  return (
    <div className="dashboard">
      <div className="dashboard-left">
        {streamData.iframe && <Video url={streamData.iframe} />}
        <div className="stream-bottom-left">
          <div className="streamtitle">
            {!isEditing && <h1 className="stream-title">{streamData.title}</h1>}
            {!isEditing && (
              <button className="wijzigenbtn" onClick={handleEditClick}>
                <img className="pen-img" src={pen} />
              </button>
            )}

            {isEditing && (
              <div className="titelupdatediv">
                <input
                  type="text"
                  className="title-input"
                  onChange={handleStreamTitleChange}
                ></input>
              </div>
            )}
            {isEditing && (
              <button className="wijzigenbtn" onClick={handleSaveClick}>
                <img className="checkmark-img" src={checkmark} />
              </button>
            )}
          </div>

          {isEditing && (
            <div className="beschrijvingupdatediv">
              <label className="beschrijving-label">Beschrijving</label>
              <textarea
                type="textarea"
                className="beschrijving-input"
                onChange={handleDescriptionChange}
              ></textarea>
            </div>
          )}
          {!isEditing && (
            <div className="streamer">
              <img className="streamer-streamerimg" src={stockimage} />
              <h2 className="streamer-streamername">Rayan Khyare</h2>
            </div>
          )}
          {!isEditing && (
            <h3 className="stream-beschrijvingtitle">Beschrijving</h3>
          )}
          {!isEditing && (
            <p className="stream-beschrijving">{streamData.description}</p>
          )}
        </div>

        {poll && <h1 className="resultaten-title">Resultaten</h1>}
        <div className="features-results">
          <div className="polls">
            <div className="poll-dropdown">
              <p className="polls-title">Polls</p>
              <img src={downarrow} className="downarrow" />
            </div>
            {poll.map((poll, index) => (
              <div
                className="poll-container"
                style={{ display: showPollOverlay ? "flex" : "none" }}
                key={index}
              >
                <div className="poll-header">
                  <p
                    className="poll-cross"
                    onClick={() => setShowPollOverlay(false)}
                  >
                    <RxCross1 />
                  </p>
                </div>
                <h1 className="poll-title">{poll.pollQuestion}</h1>
                <div className="options-container">
                  <div className="option-container">
                    <h1 className="option-text">{poll.options[0]}</h1>
                    <h2 className="option-percentage">{option1Percentage}%</h2>
                  </div>
                  <div className="option-container">
                    <h1 className="option-text">{poll.options[1]}</h1>
                    <h2 className="option-percentage">{option2Percentage}%</h2>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="qanda">
            <div className="qanda-dropdown">
              <p className="qanda-title">Q&A's</p>
              <img src={downarrow} className="downarrow" />
            </div>
            {questions.map((qstn, index) => (
              <div
                className="qanda-container"
                style={{ display: showQandAOverlay ? "flex" : "none" }}
                key={index}
              >
                <div className="qanda-header">
                  <p
                    className="qanda-cross"
                    onClick={() => setShowQandAOverlay(false)}
                  >
                    <RxCross1 />
                  </p>
                </div>
                <p className="qanda-question">{qstn.question}</p>
                <div className="answers-container">
                  {answers.map((answr, index) => (
                    <div className="answer" key={index}>
                      <h1 className="answer-user">{answr.user}</h1>
                      <p className="answer-text">{answr.answer}</p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* <div className="features">
       
       

        <div className="qanda-container">
          <h2 className="qanda-container-title">Q&A sessie</h2>
          <input
            type="text"
            className="qanda-vraag qanda-input"
            placeholder="Voer de vraag in"
            onChange={(e) => {
              setQuestion(e.target.value);
            }}
          />

          <input
            type="submit"
            className="qanda-sturen qanda-input"
            placeholder="Sturen"
            onClick={sendQuestion}
          />
        </div>
      </div> */}
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
                      user={msg.user}
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

      {showPollContainer && (
        <div className="pollsend-container">
          <div className="overlay"></div>
          <div className="poll-container">
            <h2 className="poll-container-title">Poll toevoegen</h2>
            <div className="inputs">
              <input
                type="text"
                className="poll-vraag poll-input"
                placeholder="Vraag"
                onChange={(e) => {
                  setPollQuestion(e.target.value);
                }}
              />
              <input
                type="text"
                className="poll-optie-1 poll-input"
                placeholder="Optie 1"
                onChange={(e) => {
                  setOption1(e.target.value);
                }}
              />
              <input
                type="text"
                className="poll-optie-2 poll-input"
                placeholder="Optie 2"
                onChange={(e) => {
                  setOption2(e.target.value);
                }}
              />
              <button
                className="poll-sturen poll-input"
                placeholder="Sturen"
                onClick={sendPoll}
              >
                Sturen
              </button>
            </div>
          </div>
        </div>
      )}

      {showQandaContainer && (
        <div className="qandasend-container">
          <div className="overlay"></div>
          <div className="qanda-container">
            <h2 className="qanda-container-title">Q&A sessie</h2>
            <input
              type="text"
              className="qanda-vraag qanda-input"
              placeholder="Voer de vraag in"
              onChange={(e) => {
                setQuestion(e.target.value);
              }}
            />

            <input
              type="submit"
              className="qanda-sturen qanda-input"
              placeholder="Sturen"
              onClick={sendQuestion}
            />
          </div>
        </div>
      )}
      <div className="streamer">
        <div className="left">
          <img src={home} className="icon" onClick={handleClickMain} />
          <img src={compass} className="icon" onClick={handleClickBladeren} />
        </div>
        <div className="right">
          <img src={pollIcon} className="icon" onClick={handlePollIconClick} />
          <img
            src={qandaIcon}
            className="icon"
            onClick={handleQandaIconClick}
          />
          <img src={stopIcon} className="icon" />
        </div>
      </div>
    </div>
  );
}
