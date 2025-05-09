import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Home.css";
import RandomImage from "../../components/RandomImage/RandomImage";
import Ranking from "../../components/Ranking/Ranking";
import { isAuthenticated } from "../../utils/auth";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import io from "socket.io-client"; // Import Socket.io client

const Home = () => {
  const navigate = useNavigate();
  const [username, setUserName] = useState(null);
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showModeOptions, setShowModeOptions] = useState(false);
  const [selectedMode, setSelectedMode] = useState("");
  const [countdown, setCountdown] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [error, setError] = useState(null);
  const [socket, setSocket] = useState(null); // New state to hold the socket instance

  useEffect(() => {
    if (!isAuthenticated()) {
      navigate("/login");
      return;
    }

    const name = localStorage.getItem("username");
    console.log("Fetched username:", name);
    if (name) {
      setUserName(name);
    }
    const userRole = localStorage.getItem("role");
    if (name) setUserName(name);
    if (userRole) setRole(userRole);

    const token = localStorage.getItem("token");

    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        const currentTime = Date.now() / 1000;

        if (decodedToken.exp < currentTime) {
          setError("Session expired, please log in again.");
          setLoading(false);
          return;
        }

        // Fetch the initial online users when the page loads
        axios
          .get("http://localhost:3001/users/online", {
            headers: { Authorization: `Bearer ${token}` },
          })
          .then((res) => {
            console.log("Fetched online users:", res.data); // Log the full response

            const onlineList = res.data.onlineUsers;

            if (Array.isArray(onlineList)) {
              setOnlineUsers(onlineList); // Set the online users in the state
            } else {
              console.warn(
                "Expected array for onlineUsers, but got:",
                onlineList
              );
              setOnlineUsers([]); // Clear the list if not an array
            }
          })
          .catch((err) => {
            console.error("Fetch error:", err);
            setError("Unable to fetch online users.");
            setOnlineUsers([]); // Clear the online users if error occurs
          });

        // Connect to the WebSocket server for real-time updates
        const socketInstance = io("http://localhost:3001", {
          auth: {
            token: localStorage.getItem("token"),
          },
        });

        setSocket(socketInstance);

        // Listen for updates when an online user connects or disconnects
        socketInstance.on("onlineUsers", (updatedUsers) => {
          setOnlineUsers(updatedUsers);
        });
      } catch (err) {
        console.error("Token decode error:", err);
        setError("Invalid token.");
        setOnlineUsers([]);
      }
    } else {
      setError("No authentication token found.");
      setOnlineUsers([]);
    }

    setLoading(false);

    // Clean up socket connection when the component unmounts
    return () => {
      if (socket) {
        socket.disconnect();
      }
    };
  }, [navigate, username, role]);

  useEffect(() => {
    if (selectedMode !== "online") return;

    const getNextQuizTime = () => {
      const now = new Date();
      const times = [
        new Date(now.getFullYear(), now.getMonth(), now.getDate(), 17, 15, 0),
        new Date(now.getFullYear(), now.getMonth(), now.getDate(), 20, 0, 0),
      ];
      return (
        times.find((t) => t > now) || new Date(times[0].getTime() + 86400000)
      );
    };

    let nextQuiz = getNextQuizTime();

    const interval = setInterval(() => {
      const now = new Date();
      const diff = nextQuiz - now;

      if (diff <= 0 && diff > -60000) {
        setCountdown("✅ Quiz is active now!");
        clearInterval(interval);
        navigate("/quiz", { state: { mode: "online" } });
      } else if (diff <= -60000) {
        nextQuiz = getNextQuizTime();
      } else {
        const hours = String(Math.floor(diff / 3600000)).padStart(2, "0");
        const minutes = String(Math.floor((diff % 3600000) / 60000)).padStart(
          2,
          "0"
        );
        const seconds = String(Math.floor((diff % 60000) / 1000)).padStart(
          2,
          "0"
        );
        setCountdown(`⏳ Next quiz starts in: ${hours}:${minutes}:${seconds}`);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [selectedMode, navigate]);

  const handleLogout = () => {
    localStorage.clear();
    setUserName(null);
    setRole(null);
    navigate("/login");
    window.location.reload();
  };

  const startPracticeMode = () => {
    navigate("/quiz", { state: { mode: "practice" } });
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="page-wrapper">
      <div className="home-container">
        <h2 className="welcome-title">🎉 Welcome, {username}! 🎉</h2>

        <div className="online-users">
          <h3>🟢 Online Users:</h3>
          <ul>
            {error ? (
              <li>{error}</li>
            ) : onlineUsers.length === 0 ? (
              <li>No users online</li>
            ) : (
              <li>{onlineUsers.length} users online</li> // Show the number of online users
            )}
          </ul>
        </div>

        {showModeOptions ? (
          <div className="button-group">
            <button className="nav-btn" onClick={startPracticeMode}>
              🏋️ Practice Mode
            </button>
            <button
              className="nav-btn"
              onClick={() => setSelectedMode("online")}
            >
              🌐 Online Mode
            </button>
          </div>
        ) : (
          <div className="button-group">
            <button
              className="nav-btn"
              onClick={() => setShowModeOptions(true)}
            >
              🎮 Start Quiz
            </button>
            {role === "admin" && (
              <>
                <button
                  className="nav-btn"
                  onClick={() => navigate("/responses")}
                >
                  📋 View Responses
                </button>
                <button
                  className="nav-btn"
                  onClick={() => navigate("/questions")}
                >
                  ❓ Manage Questions
                </button>
              </>
            )}
          </div>
        )}

        {selectedMode === "online" && countdown && (
          <div className="countdown">
            <p>{countdown}</p>
          </div>
        )}

        <button className="logout-btn" onClick={handleLogout}>
          🚪 Logout
        </button>
      </div>

      <div className="footer">
        <RandomImage />
      </div>
    </div>
  );
};

export default Home;
