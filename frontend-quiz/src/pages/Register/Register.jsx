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
import "./Register.css";

const Register = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (phoneNumber.length !== 8) {
      toast.error("Phone number must be exactly 8 digits.");
      setIsSubmitting(false);
      return;
    }

    const userData = {
      username,
      email,
      password,
      phoneNumber: `+216${phoneNumber}`,
    };

    try {
      const response = await axios.post(
        "http://localhost:3001/users/register",
        userData
      );

      const message = response?.data?.message?.toLowerCase();

      if (message?.includes("already exists")) {
        if (message.includes("username")) {
          toast.error("Username already exists.");
        } else if (message.includes("email")) {
          toast.error("Email already exists.");
        } else {
          toast.error(response.data.message);
        }
      } else if (
        response.status === 201 ||
        message?.includes("success") ||
        message?.includes("created")
      ) {
        toast.success("Registration successful!");
        setUsername("");
        setEmail("");
        setPassword("");
        setPhoneNumber("");

        setTimeout(() => {
          navigate("/login");
        }, 2000);
      } else {
        toast.error("Unexpected response from server.");
      }
    } catch (error) {
      const msg = error?.response?.data?.message;
      if (typeof msg === "string") toast.error(msg);
      else if (Array.isArray(msg)) toast.error(msg[0] || "Validation error.");
      else toast.error("Registration failed. Try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLoginRedirect = () => {
    navigate("/login");
  };

  return (
    <MDBContainer className="login-form-container my-5">
      <MDBRow center>
        <MDBCol md="6" className="p-4 shadow-lg form-box">
          <form onSubmit={handleSubmit}>
            <h2 className="text-center mb-4 login-title">📝 Register</h2>

            <div className="mb-4">
              <MDBInput
                label="Username"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>

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

            <div className="mb-4">
              <MDBInput
                label="Phone Number"
                id="phoneNumber"
                type="tel"
                value={`+216 ${phoneNumber}`}
                onChange={(e) => {
                  const digitsOnly = e.target.value.replace(/\D/g, "").slice(3); // Remove +216 prefix
                  if (digitsOnly.length <= 8) {
                    setPhoneNumber(digitsOnly);
                  }
                }}
                required
              />
            </div>

            <MDBBtn
              block
              type="submit"
              className="login-btn"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Registering..." : "Register"}
            </MDBBtn>
          </form>

          <div className="text-center mt-4">
            <p>
              Already have an account?{" "}
              <button className="register-btn" onClick={handleLoginRedirect}>
                Login here
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

export default Register;
