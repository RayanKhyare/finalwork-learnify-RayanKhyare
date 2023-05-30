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
import { getProfilePicture } from "../services/profilePicService";

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
  const [selectedQandAIndex, setSelectedQandAIndex] = useState(-1);
  const [selectedPollIndex, setSelectedPollIndex] = useState(-1);

  const [canSendMessage, setCanSendMessage] = useState(true);
  const [cooldownTimer, setCooldownTimer] = useState(0);

  const [visiblePolls, setVisiblePolls] = useState({});

  const [error, setError] = useState("");

  const navigate = useNavigate();
  const { user } = useContext(UserContext);

  const totalVotes = option1Count + option2Count;
  const option1Percentage =
    totalVotes === 0 ? 0 : Math.round((option1Count / totalVotes) * 100);
  const option2Percentage =
    totalVotes === 0 ? 0 : Math.round((option2Count / totalVotes) * 100);

  useEffect(() => {
    if (showPollContainer) {
      // Add "overflow: hidden" to the body element
      document.body.style.overflow = "hidden";
    } else {
      // Remove the "overflow: hidden" style from the body element
      document.body.style.overflow = "";
    }
  }, [showPollContainer]);

  useEffect(() => {
    if (showQandaContainer) {
      document.body.style.overflow = "hidden";
    } else {
      // Remove the "overflow: hidden" style from the body element
      document.body.style.overflow = "";
    }
  }, [showQandaContainer]);

  const handlePollIconClick = () => {
    setShowPollContainer(true);
  };

  const handleQandaIconClick = () => {
    setShowQandaContainer(true);
  };

  const handleDeletePoll = (pollId) => {
    setVisiblePolls((prevVisiblePolls) => ({
      ...prevVisiblePolls,
      [pollId]: false,
    }));
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
      const response = await apiService.postVideo({
        user_id: parseInt(streamData.user_id),
        category_id: parseInt(streamData.category_id),
        title: streamData.title,
        description: streamData.description,
        iframe: streamData.iframe,
      });
    } catch (error) {
      console.error(error);
    }

    try {
      await apiService.deleteStreamById(streamid);

      window.location.reload();
    } catch (error) {
      console.error(error);
    }
  };

  // const handleDeleteQuestion = async (id) => {
  //   try {
  //     await apiService.deleteQuestion(id);
  //     window.location.reload();
  //   } catch (error) {
  //     console.error(error);
  //   }
  // };
  const handleDeleteQuestion = async (id, index) => {
    try {
      await apiService.deleteQuestion(id);
      setQuestions((prevQuestions) => {
        const updatedQuestions = [...prevQuestions];
        updatedQuestions.splice(index, 1);
        return updatedQuestions;
      });
      // setShowQandAOverlay(false);
    } catch (error) {
      console.error(error);
    }
  };

  const handleDeletePolls = async (poll_id, index) => {
    try {
      await apiService.deletePoll(streamid, poll_id);
      setPoll((prevPolls) => {
        const updatedPolls = [...prevPolls];
        updatedPolls.splice(index, 1);
        return updatedPolls;
      });
      setShowPollOverlay(false);
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

  const sendPoll = async () => {
    try {
      const response = await apiService.postPolls({
        stream_id: parseInt(streamid),
        question: pollQuestion,
        options: [option1, option2],
      });

      socket.emit("send_poll", {
        id: response.data.id,
        room,
        pollQuestion,
        options: [
          { id: response.data.options[0].id, option: option1 },
          { id: response.data.options[1].id, option: option2 },
        ],
      });

      setPoll([
        ...poll,
        {
          id: response.data.id,
          pollQuestion,
          options: [
            { id: response.data.options[0].id, option: option1, count: 0 },
            { id: response.data.options[1].id, option: option2, count: 0 },
          ],
          totalVotes: 0,
        },
      ]);
      setShowPollContainer(false);
      // redirect to protected route
    } catch (error) {
      console.error(error);
      // display error message
      setError(error.response.data);
    }
  };

  const sendQuestion = async () => {
    try {
      const response = await apiService.postQuestions({
        stream: parseInt(streamid),
        question,
        time: 30,
      });

      socket.emit("send_question", {
        id: response.data.id,
        stream: parseInt(streamid),
        room,
        question,
      });
      setQuestions([...questions, { room, question, id: response.data.id }]);
      setShowQandaContainer(false);
    } catch (error) {
      console.error(error);
    }
  };

  const closeContainers = () => {
    setShowQandaContainer(false);
    setShowPollContainer(false);
  };

  useEffect(() => {
    async function fetchStream() {
      try {
        const response = await apiService.getStreamById(streamid);
        setStreamData(response.data);
        setRoom(response.data.room_id);
        setDescription(response.data.description);
        setStreamTitle(response.data.title);

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
        { message: data.message, username: data.user },
      ]);
    });
  }, []);

  useEffect(() => {
    socket.on("show_answers", async (data) => {
      setShowQandAOverlay(true);
      setAnswers((prevAnswers) => [
        ...prevAnswers,
        {
          stream_id: data.stream_id,
          question_id: data.question_id,
          answer: data.answer,
          username: data.username,
        },
      ]);
    });
  }, []);

  useEffect(() => {
    const handleReceiveVote = (data) => {
      console.log("Received vote");
      setShowPollOverlay(true);
      setVote((prevVotes) => [
        ...prevVotes,
        {
          poll_id: data.poll_id,
          user: data.user,
          vote: data.vote,
          option_id: data.option_id,
        },
      ]);

      setPoll((prevPoll) => {
        const updatedPoll = prevPoll.map((pollItem) => {
          if (pollItem.id === data.poll_id) {
            const updatedOptions = pollItem.options.map((option) => {
              if (option.id === data.option_id) {
                return {
                  ...option,
                  count: option.count + 1,
                };
              }
              return option;
            });
            return {
              ...pollItem,
              options: updatedOptions,
              totalVotes: pollItem.totalVotes + 1,
            };
          }
          return pollItem;
        });
        return updatedPoll;
      });
    };

    socket.on("receive_vote", handleReceiveVote);

    return () => {
      // Clean up the event listener when the component unmounts
      socket.off("receive_vote", handleReceiveVote);
    };
  }, []);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await apiService.getQuestionsByStreamId(streamid);
        const fetchedQuestions = response.data; // Assuming response.data is the array of objects
        fetchedQuestions.forEach((question) => {
          setQuestions((prevQuestions) => [...prevQuestions, question]);
        });
      } catch (error) {
        console.error(error);
      }
    };

    fetchQuestions();
  }, [streamid]);

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

  useEffect(() => {
    const fetchAnswers = async () => {
      try {
        const response = await apiService.getAnswersByStreamId(streamid);
        const fetchedAnswers = response.data; // Assuming response.data is the array of objects
        fetchedAnswers.forEach((answr) => {
          setAnswers((prevAnswers) => [...prevAnswers, answr]);
        });
      } catch (error) {
        console.error(error);
      }
    };

    fetchAnswers();
  }, [streamid]);

  useEffect(() => {
    const fetchPoll = async () => {
      try {
        const polls = await apiService.getPollsfromStream(streamid);
        const fetchedPolls = polls.data;
        console.log(fetchedPolls); // Assuming response.data is the array of objects

        fetchedPolls.forEach((poll) => {
          setPoll((prevAnswers) => [
            ...prevAnswers,
            {
              id: poll.id,
              pollQuestion: poll.question,
              options: [
                {
                  option: poll.options[0].option,
                  count: poll.options[0].votes.length,
                },
                {
                  option: poll.options[1].option,
                  count: poll.options[1].votes.length,
                },
              ],

              totalVotes:
                poll.options[0].votes.length + poll.options[1].votes.length,
            },
          ]);

          setOption1Count(
            (prevCount) => prevCount + poll.options[0].votes.length
          );
          setOption2Count(
            (prevCount) => prevCount + poll.options[1].votes.length
          );
        });
      } catch (error) {
        console.error(error);
      }
    };

    fetchPoll();
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
                  value={streamTitle}
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
                value={description}
              ></textarea>
            </div>
          )}

          {!isEditing && (
            <h3 className="stream-beschrijvingtitle">Beschrijving</h3>
          )}
          {!isEditing && <p className="stream-beschrijving">{description}</p>}
        </div>

        {poll && <h1 className="resultaten-title">Resultaten</h1>}
        <div className="features-results">
          <div className="polls">
            <div className="poll-dropdown">
              <p className="polls-title">Polls ({poll.length})</p>
              <img src={downarrow} className="downarrow" />
            </div>
            {poll.map((poll, index) => (
              <div
                className="poll-container"
                style={{
                  display:
                    selectedPollIndex === index && showPollOverlay
                      ? "none"
                      : "flex",
                }}
                key={index}
              >
                <div className="poll-header">
                  <p
                    className="poll-cross"
                    onClick={() => {
                      setSelectedPollIndex(index);
                      handleDeletePolls(poll.id, index);
                    }}
                  >
                    <RxCross1 />
                  </p>
                </div>
                <h1 className="poll-title">{poll.pollQuestion}</h1>
                <div className="options-container">
                  <div className="option-container">
                    <h1 className="option-text">{poll.options[0].option}</h1>
                    {/* <h2 className="option-percentage">{option1Percentage}%</h2> */}
                    <h2 className="option-percentage">
                      {poll.totalVotes === 0
                        ? 0
                        : Math.round(
                            (poll.options[0].count / poll.totalVotes) * 100
                          )}
                      %
                    </h2>
                  </div>
                  <div className="option-container">
                    <h1 className="option-text">{poll.options[1].option}</h1>
                    {/* <h2 className="option-percentage">{option2Percentage}%</h2> */}
                    <h2 className="option-percentage">
                      {poll.totalVotes === 0
                        ? 0
                        : Math.round(
                            (poll.options[1].count / poll.totalVotes) * 100
                          )}
                      %
                    </h2>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="qanda">
            <div className="qanda-dropdown">
              <p className="qanda-title">Q&A's ({questions.length})</p>
              <img src={downarrow} className="downarrow" />
            </div>
            {questions.map((qstn, index) => (
              <div
                className="qanda-container"
                style={{
                  display:
                    selectedQandAIndex === index && showPollOverlay
                      ? "none"
                      : "flex",
                }}
                key={index}
              >
                <div className="qanda-header">
                  <p
                    className="qanda-cross"
                    onClick={() => {
                      setSelectedQandAIndex(index);
                      handleDeleteQuestion(qstn.id, index);
                    }}
                  >
                    <RxCross1 />
                  </p>
                </div>
                <p className="qanda-question">{qstn.question}</p>
                <div className="answers-container">
                  {answers
                    .filter((answr) => answr.question_id === qstn.id) // Filter answers by question_id
                    .map((answr, index) => (
                      <div className="answer" key={index}>
                        <h1 className="answer-user">{answr.username}</h1>
                        <p className="answer-text">{answr.answer}</p>
                      </div>
                    ))}
                </div>
              </div>
            ))}
          </div>
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

      {showPollContainer && (
        <div className="pollsend-container">
          <div className="overlay" onClick={closeContainers}></div>
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
          <div className="overlay" onClick={closeContainers}></div>
          <div className="qanda-container">
            <h2 className="qanda-container-title">Q&A sessie</h2>
            <div className="inputs">
              <input
                type="text"
                className="qanda-vraag qanda-input"
                placeholder="Voer de vraag in"
                onChange={(e) => {
                  setQuestion(e.target.value);
                }}
              />

              <button
                className="qanda-sturen qanda-input"
                placeholder="Sturen"
                onClick={sendQuestion}
              >
                Sturen
              </button>
            </div>
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
          <img src={stopIcon} className="icon" onClick={handleStopStream} />
        </div>
      </div>
    </div>
  );
}
