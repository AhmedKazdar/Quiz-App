import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Button,
  Typography,
  Dialog,
  DialogContent,
  DialogTitle,
  LinearProgress,
  Snackbar,
} from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";
import RandomImage from "../../components/RandomImage/RandomImage";
import "./QuizGame.css";

const QuizGame = () => {
  const [questions, setQuestions] = useState([]);
  const [score, setScore] = useState(0);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [showFinalScore, setShowFinalScore] = useState(false);
  const [selected, setSelected] = useState(false);
  const [timeLeft, setTimeLeft] = useState(10);
  const [shuffledResponses, setShuffledResponses] = useState([]);
  const [selectedAnswers, setSelectedAnswers] = useState([]);
  const [error, setError] = useState("");
  const [responses, setResponses] = useState([]);
  const [ranking, setRanking] = useState([]);
  const navigate = useNavigate();
  const location = useLocation();

  const quizMode = location.state?.mode || "practice"; // 'online' or 'practice'

  // Fetch questions and responses
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [questionsRes, responsesRes] = await Promise.all([
          axios.get("http://localhost:3001/question/all"),
          axios.get("http://localhost:3001/response"),
        ]);

        const allQuestions = questionsRes.data.questions;
        const allResponses = responsesRes.data.responses;

        const filteredQuestions = allQuestions.filter((question) =>
          allResponses.some(
            (response) =>
              String(response.questionId._id) === String(question._id)
          )
        );

        let finalQuestions;
        if (quizMode === "practice") {
          finalQuestions = filteredQuestions.sort(() => Math.random() - 0.5);
        } else {
          finalQuestions = filteredQuestions; // keep order for online
        }
        setQuestions(finalQuestions);

        setResponses(allResponses);
      } catch (error) {
        console.error("Error fetching quiz data:", error);
        setError("Failed to load quiz data. Please try again.");
      }
    };

    fetchData();
  }, []);

  // Update responses when question changes
  useEffect(() => {
    if (questions.length > 0 && responses.length > 0) {
      setTimeLeft(10);
      const currentQuestion = questions[currentQuestionIndex];
      const current = responses.filter(
        (r) => String(r.questionId._id) === String(currentQuestion?._id)
      );
      setShuffledResponses(current.sort(() => Math.random() - 0.5));
      setSelected(false);
    }
  }, [currentQuestionIndex, responses, questions]);

  // Countdown timer
  useEffect(() => {
    if (timeLeft > 0 && !selected) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && !selected) {
      setSelected(true);
    }
  }, [timeLeft, selected]);

  // Handle answer selection
  const handleAnswerSelection = (response) => {
    if (selected) return;
    setSelected(true);

    const isCorrect = response.isCorrect;

    setSelectedAnswers((prev) => [
      ...prev,
      {
        questionId: response.questionId._id,
        selectedAnswerId: response._id,
      },
    ]);

    if (isCorrect) {
      setScore((prev) => prev + 1);

      if (quizMode === "online") {
        // Proceed to next question automatically after a short delay
        setTimeout(() => {
          if (currentQuestionIndex < questions.length - 1) {
            setCurrentQuestionIndex((prev) => prev + 1);
            setSelected(false);
            setTimeLeft(10);
          } else {
            handleFinishQuiz(); // Finish the quiz when it's the last question
          }
        }, 1000);
      }
    } else {
      // If wrong in online mode, show results
      if (quizMode === "online") {
        setTimeout(() => {
          handleFinishQuiz(); // Finish the quiz when it's wrong
        }, 500);
      }
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
      setSelected(false);
      setTimeLeft(10);
    }
  };

  const handleFinishQuiz = async () => {
    setShowFinalScore(true);

    // Calculate rankings locally if needed, here assuming you want the rankings based on score
    const finalScore = score;
    const userRank = ranking.findIndex((rank) => rank.userId === userId) + 1;

    console.log("Final Score:", finalScore);
    console.log("User Rank:", userRank); // You could display this in the dialog too

    // Optionally save the score locally or update ranking
    setFinalScore(finalScore);

    // Redirect after a brief delay (or immediately)
    setTimeout(() => {
      navigate("/home");
    }, 8000);
  };

  const handleRestartQuiz = () => {
    setCurrentQuestionIndex(0);
    setScore(0);
    setSelected(false);
    setSelectedAnswers([]);
    setShowFinalScore(false);
  };

  const getResultMessage = () => {
    if (score === questions.length) return "Amazing! Perfect Score!";
    if (score >= questions.length / 2) return "Good Job!";
    return "Better Luck Next Time!";
  };

  const currentQuestion = questions[currentQuestionIndex];

  return (
    <div className="quiz-page">
      <div className="quiz-container">
        <div className="quiz-content">
          {currentQuestion ? (
            <div>
              <Typography variant="h4" gutterBottom className="question-text">
                {`Question ${currentQuestionIndex + 1}: ${
                  currentQuestion.textequestion
                }`}
              </Typography>

              <LinearProgress
                variant="determinate"
                value={(timeLeft / 10) * 100}
                className="progress-bar"
              />

              <div className="responses-container">
                <Typography variant="h6" gutterBottom>
                  Choose your answer:
                </Typography>
                {shuffledResponses.map((response) => (
                  <Button
                    key={response._id}
                    variant="contained"
                    fullWidth
                    onClick={() => handleAnswerSelection(response)}
                    disabled={selected}
                    className="response-button"
                    aria-label={`Answer: ${response.text}`}
                  >
                    {response.text}
                  </Button>
                ))}
              </div>

              {quizMode === "practice" && (
                <div>
                  {currentQuestionIndex < questions.length - 1 ? (
                    <Button
                      variant="contained"
                      color="secondary"
                      onClick={handleNextQuestion}
                      disabled={!selected}
                      className="next-btn"
                    >
                      Next Question
                    </Button>
                  ) : (
                    <Button
                      variant="contained"
                      color="success"
                      onClick={handleFinishQuiz}
                      disabled={!selected}
                      className="finish-btn"
                    >
                      Finish Quiz
                    </Button>
                  )}
                </div>
              )}
            </div>
          ) : (
            <Typography variant="h6">Loading quiz...</Typography>
          )}

          <Dialog
            open={showFinalScore}
            onClose={() => setShowFinalScore(false)}
            fullWidth
            maxWidth="xs"
          >
            <DialogTitle className="dialog-title">
              🎉 Quiz Completed!
            </DialogTitle>
            <DialogContent className="dialog-content">
              <Typography variant="h5" gutterBottom>
                Your Score: {score} / {questions.length}
              </Typography>
              <Typography variant="h6">{getResultMessage()}</Typography>

              <Typography variant="h6" gutterBottom>
                Top 5 Rankings:
              </Typography>
              {ranking.length > 0 ? (
                <div>
                  {ranking.map((rank, index) => (
                    <Typography key={rank._id} variant="body1">
                      {index + 1}. {rank.userId.username}: {rank.score} points
                    </Typography>
                  ))}
                </div>
              ) : (
                <Typography variant="body1">
                  No rankings available yet.
                </Typography>
              )}

              {quizMode !== "online" && (
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleRestartQuiz}
                  className="restart-btn"
                >
                  Restart Quiz
                </Button>
              )}

              <Button
                variant="outlined"
                color="secondary"
                onClick={() => navigate("/home")}
                className="home-btn"
              >
                Go to Home Page
              </Button>
            </DialogContent>
          </Dialog>

          <Snackbar
            open={error !== ""}
            message={error}
            autoHideDuration={3000}
            onClose={() => setError("")}
          />
        </div>
      </div>

      <div className="quiz-footer">
        <RandomImage />
      </div>
    </div>
  );
};

export default QuizGame;
