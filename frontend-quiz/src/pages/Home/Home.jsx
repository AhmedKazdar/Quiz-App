import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Home.css";
import RandomImage from "../../components/RandomImage/RandomImage";
import Ranking from "../../components/Ranking/Ranking";

const Home = () => {
  const navigate = useNavigate();
  const [username, setUserName] = useState(null);
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showModeOptions, setShowModeOptions] = useState(false);
  const [selectedMode, setSelectedMode] = useState("");
  const [countdown, setCountdown] = useState(null);

  // useEffect for reading localStorage on page load (including after refresh)
  useEffect(() => {
    const token = localStorage.getItem("token");
    const isAuthenticated = localStorage.getItem("isAuthenticated");
    const name = localStorage.getItem("username");
    const userRole = localStorage.getItem("role");

    // If no token or authentication flag is found, navigate to login
    if (!token || isAuthenticated !== "true") {
      navigate("/login");
    } else {
      // Set the username and role from localStorage
      if (name) setUserName(name);
      if (userRole) setRole(userRole);
    }

    setLoading(false);
  }, [navigate]);

  useEffect(() => {
    if (selectedMode === "online") {
      const getNextQuizTime = () => {
        const now = new Date();
        const scheduledTimes = [
          new Date(now.getFullYear(), now.getMonth(), now.getDate(), 13, 0, 0),
          new Date(now.getFullYear(), now.getMonth(), now.getDate(), 20, 0, 0),
        ];
        const futureTimes = scheduledTimes.map((time) =>
          time < now ? new Date(time.getTime() + 86400000) : time
        );
        return futureTimes.sort((a, b) => a - b)[0];
      };

      let currentTarget = getNextQuizTime();

      const interval = setInterval(() => {
        const now = new Date();
        const diff = currentTarget - now;

        if (diff <= 0 && diff > -60000) {
          setCountdown("✅ Quiz is active now!");
          navigate("/quiz", { state: { mode: "online" } });
          clearInterval(interval);
        } else if (diff <= -60000) {
          currentTarget = getNextQuizTime();
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
          setCountdown(
            `⏳ Next quiz starts in: ${hours}:${minutes}:${seconds}`
          );
        }
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [selectedMode, navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("isAuthenticated");
    localStorage.removeItem("username");
    localStorage.removeItem("role");
    navigate("/login");
    window.location.reload();
  };

  const startPracticeMode = () => {
    navigate("/quiz", { state: { mode: "practice" } });
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="page-wrapper">
      <div className="home-container">
        <h2 className="welcome-title">🎉 Welcome, {username || "User"}! 🎉</h2>

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
            <p> {countdown}</p>
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
