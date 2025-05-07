import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import "mdb-react-ui-kit/dist/css/mdb.min.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import Register from "./pages/Register/Register";
import Login from "./pages/Login/Login";
import Home from "./pages/Home/Home";
import PrivateRoute from "./components/PrivateRoute";
import QuestionsTable from "./components/Question/Question";
import ResponsesPage from "./components/Response/ResponsesPages";
import QuizGame from "./pages/QuizGame/QuizGame";
import RandomImage from "./components/RandomImage/RandomImage";

const App = () => {
  // Check if the user is authenticated
  const isAuthenticated = localStorage.getItem("isAuthenticated");

  return (
    <Router>
      <div className="App">
        <Routes>
          {/* Redirect "/" route to login page if not authenticated */}
          <Route
            path="/"
            element={
              isAuthenticated === "true" ? (
                <Navigate to="/home" />
              ) : (
                <Navigate to="/login" />
              )
            }
          />

          {/* Register page, but prevent access if authenticated */}
          <Route
            path="/register"
            element={
              isAuthenticated === "true" ? (
                <Navigate to="/home" />
              ) : (
                <Register />
              )
            }
          />

          {/* Login page, but prevent access if authenticated */}
          <Route
            path="/login"
            element={
              isAuthenticated === "true" ? <Navigate to="/home" /> : <Login />
            }
          />

          {/* Private route for Home page */}
          <Route
            path="/home"
            element={
              <PrivateRoute>
                <Home />
              </PrivateRoute>
            }
          />

          {/* Private route for Quiz page */}
          <Route
            path="/quiz"
            element={
              <PrivateRoute>
                <QuizGame />
              </PrivateRoute>
            }
          />

          {/* Private route for Questions page */}
          <Route
            path="/questions"
            element={
              <PrivateRoute>
                <QuestionsTable />
              </PrivateRoute>
            }
          />

          {/* Private route for Responses page */}
          <Route
            path="/responses"
            element={
              <PrivateRoute>
                <ResponsesPage />
              </PrivateRoute>
            }
          />

          {/* Redirect to login if route doesn't match */}
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
