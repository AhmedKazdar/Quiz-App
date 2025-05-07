import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  MDBContainer,
  MDBRow,
  MDBCol,
  MDBInput,
  MDBBtn,
} from "mdb-react-ui-kit";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./Login.css"; // ✅ Import your CSS here

const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post("http://localhost:3001/auth/login", {
        email,
        password,
      });

      const { access_token, userId, role, username } = response.data;

      localStorage.setItem("token", access_token);
      localStorage.setItem("userId", userId);
      localStorage.setItem("role", role);
      localStorage.setItem("username", username);
      localStorage.setItem("isAuthenticated", "true");

      // Log them immediately after setting
      console.log(localStorage.getItem("token"));
      console.log(localStorage.getItem("userId"));
      console.log(localStorage.getItem("role"));
      console.log(localStorage.getItem("username"));
      console.log(localStorage.getItem("isAuthenticated"));

      setLoading(false);
      toast.success("Login successful!");

      // Use a setTimeout to allow for state update before redirect
      setTimeout(() => {
        navigate("/home");
      }, 200); // Slight delay to allow the localStorage state to be processed
    } catch (err) {
      setLoading(false);
      setError("Invalid email or password");
      toast.error("Login failed. Please check your credentials.");
    }
  };

  const handleRegisterRedirect = () => {
    navigate("/register");
  };

  return (
    <MDBContainer className="login-form-container my-5">
      <MDBRow center>
        <MDBCol md="6" className="p-4 shadow-lg form-box">
          <form onSubmit={handleLogin}>
            <h2 className="text-center mb-4 login-title">🔐 Login</h2>

            <div className="mb-4">
              <MDBInput
                label="Email"
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="mb-4">
              <MDBInput
                label="Password"
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            {error && <p className="error-text">{error}</p>}

            <MDBBtn
              block
              type="submit"
              className="login-btn"
              disabled={loading}
            >
              {loading ? "Logging in..." : "Login"}
            </MDBBtn>
          </form>

          <div className="text-center mt-4">
            <p>
              Don't have an account?{" "}
              <button className="register-btn" onClick={handleRegisterRedirect}>
                Register Now
              </button>
            </p>
          </div>
        </MDBCol>
      </MDBRow>

      <ToastContainer
        position="top-right"
        autoClose={4000}
        hideProgressBar
        newestOnTop
        closeOnClick
        pauseOnHover
        draggable
      />
    </MDBContainer>
  );
};

export default LoginForm;
