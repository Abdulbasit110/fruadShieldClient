import React, { useState } from "react";
import {
  MDBBtn,
  MDBContainer,
  MDBCard,
  MDBCardBody,
  MDBCardImage,
  MDBRow,
  MDBCol,
  MDBInput,
  MDBSpinner,
} from "mdb-react-ui-kit";
import { IoIosArrowDown } from "react-icons/io";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { authService } from "../../api/services";
import useApi from "../../hooks/useApi";
import "./login.scss";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  // Use API hook for login with custom error handling
  const {
    loading,
    error,
    execute: executeLogin,
  } = useApi(authService.login, {
    showSuccessToast: true,
    successMessage: "Login successful!",
    onSuccess: () => {
      navigate("/app/dashboard");
    },
  });

  const isButtonDisabled = !email || !password || loading;

  const handleLogin = async () => {
    if (!email || !password) {
      toast.error("Please enter both email and password");
      return;
    }

    try {
      // Call the login API with user credentials
      await executeLogin({ email, password });
      // Navigation is handled in onSuccess callback
    } catch (err) {
      // Error is already handled by useApi hook with toast notification
      console.error("Login error:", err);
    }
  };

  const handleForgotPassword = () => {
    navigate("/forget-password");
  };

  const handleRegister = () => {
    navigate("/signup");
  };

  return (
    <MDBContainer className="my-5 loginpage">
      <MDBCard
        style={{ width: "60%", margin: "70px auto" }}
        className="logincard"
      >
        <MDBRow className="g-0">
          <MDBCol md="6">
            <MDBCardImage
              src="/side_register.png"
              alt="login form"
              className="rounded-start w-100"
              style={{ height: "100%" }}
            />
          </MDBCol>

          <MDBCol md="6">
            <MDBCardBody className="d-flex flex-column">
              <div className="text-center">
                <img src="/logo.png" style={{ width: "88px" }} alt="logo" />
                <h5 className="mt-2 mb-5 pb-1">Login</h5>
              </div>

              {error && (
                <div className="alert alert-danger mb-3">
                  {error.message ||
                    "Login failed. Please check your credentials."}
                </div>
              )}

              <MDBInput
                wrapperClass="mb-4"
                label="Email address"
                id="formControlLg"
                type="email"
                size="lg"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />

              <div className="mb-4 position-relative">
                <MDBInput
                  label="Password"
                  type={showPassword ? "text" : "password"}
                  size="lg"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === "Enter" && !isButtonDisabled) {
                      handleLogin();
                    }
                  }}
                />
                <span
                  className="position-absolute top-50 translate-middle-y end-0 me-3"
                  style={{ cursor: "pointer" }}
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </span>
              </div>

              <MDBBtn
                className="mb-4 px-5"
                size="lg"
                disabled={isButtonDisabled}
                onClick={handleLogin}
                style={{
                  background: isButtonDisabled
                    ? "linear-gradient(90deg, #3B8BD0 0%, #2548C2 100%)"
                    : "linear-gradient(90deg, #3B8BD0 0%, #2548C2 100%)",
                  color: "#fff",
                  borderRadius: "8px",
                  fontWeight: "600",
                }}
              >
                {loading ? (
                  <MDBSpinner
                    size="sm"
                    role="status"
                    tag="span"
                    className="me-2"
                  />
                ) : (
                  "Login"
                )}
              </MDBBtn>

              <a
                style={{
                  display: "flex",
                  justifyContent: "flex-end",
                  color: "#3f3f3f",
                  marginTop: "-20px",
                  marginBottom: "20px",
                  fontSize: "15px",
                  cursor: "pointer",
                }}
                className="forgot"
                onClick={handleForgotPassword}
              >
                Forgot password?
              </a>

              <p
                className="mb-5 pb-lg-2 text-center"
                style={{ color: "#393f81" }}
              >
                Don't have an account?{" "}
                <a
                  onClick={handleRegister}
                  style={{ color: "#3B8BCF", cursor: "pointer" }}
                >
                  Register here
                </a>
              </p>
            </MDBCardBody>
          </MDBCol>
        </MDBRow>
      </MDBCard>
    </MDBContainer>
  );
};

export default Login;
