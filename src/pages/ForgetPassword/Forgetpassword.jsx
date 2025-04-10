import React, { useState } from "react";
import "./forgetpassword.scss";
import { FaArrowLeft } from "react-icons/fa6";
import { MDBBtn, MDBCard, MDBContainer, MDBSpinner } from "mdb-react-ui-kit";
import { useNavigate } from "react-router-dom";
import { authService } from "../../api/services";
import useApi from "../../hooks/useApi";
import { toast } from "react-toastify";

const Forgetpassword = () => {
  const [email, setEmail] = useState("");
  const navigate = useNavigate();

  // Use API hook for forgot password
  const {
    loading,
    error,
    data: resetRequestData,
    execute: executeForgotPassword,
  } = useApi(authService.forgotPassword, {
    showSuccessToast: true,
    successMessage: "Password reset link sent to your email",
    onSuccess: () => {
      // Navigate to verification page after a slight delay
      setTimeout(() => {
        navigate("/verification");
      }, 1500);
    },
  });

  const isButtonDisabled = !email || loading;

  const handleBack = () => {
    navigate("/");
  };

  const handleButton = async () => {
    if (!email) {
      toast.error("Please enter your email address");
      return;
    }

    // Validate email format
    if (!/\S+@\S+\.\S+/.test(email)) {
      toast.error("Please enter a valid email address");
      return;
    }

    try {
      await executeForgotPassword({ email });
      // Navigation is handled in onSuccess callback
    } catch (err) {
      // Error is already handled by useApi hook
      console.error("Forgot password error:", err);
    }
  };

  return (
    <>
      <MDBContainer className="my-5">
        <MDBCard style={{ width: "90%", margin: "0px auto" }}>
          <div
            style={{
              position: "relative",
              height: "85vh",
              overflow: "hidden",
              backgroundColor: "",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {/* Back Button */}

            <div
              style={{
                position: "absolute",
                top: "0px",
                left: "0px",
                padding: "20px 40px",
              }}
            >
              <MDBBtn
                style={{
                  boxShadow: "none",
                  background: "#ededed",
                  color: "black",
                  fontWeight: "400",
                  textTransform: "none",
                  display: "flex",
                  alignItems: "center",
                  padding: "8px 16px",
                  borderRadius: "8px",
                }}
                onClick={handleBack}
              >
                <span
                  style={{
                    marginRight: "8px",
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <FaArrowLeft />
                </span>
                <span style={{ lineHeight: "1.5" }}>Back</span>
              </MDBBtn>
            </div>

            {/* Background Images */}
            <img
              src="/logo_2.png"
              alt="Background Left"
              style={{
                position: "absolute",
                bottom: "0",
                left: "0",
                width: "290px",
              }}
            />
            <img
              src="/logo_1.png"
              alt="Background Top Right"
              style={{
                position: "absolute",
                top: "0px",
                right: "0",
                width: "175px",
              }}
            />
            <img
              src="/logo_3.png"
              alt="Background Bottom Right"
              style={{
                position: "absolute",
                bottom: "35px",
                right: "35px",
                width: "150px",
              }}
            />

            {/* Logo */}
            <img
              src="/logo.png"
              alt="Logo"
              style={{ width: "80px", marginBottom: "20px" }}
            />

            {/* Title */}
            <h2
              style={{
                fontSize: "24px",
                fontWeight: "bold",
                color: "#333",
                marginBottom: "10px",
              }}
            >
              Forgot Password
            </h2>

            {/* Subtitle */}
            <p
              style={{
                fontSize: "16px",
                color: "#666",
                marginBottom: "30px",
                textAlign: "center",
              }}
            >
              Your Registered email required for resetting your Password.
            </p>

            {/* Error Message */}
            {error && (
              <div
                style={{
                  width: "100%",
                  maxWidth: "400px",
                  padding: "10px 14px",
                  backgroundColor: "#f8d7da",
                  color: "#721c24",
                  borderRadius: "8px",
                  marginBottom: "16px",
                  textAlign: "center",
                }}
              >
                {error.message ||
                  "Failed to send reset link. Please try again."}
              </div>
            )}

            {/* Success Message */}
            {resetRequestData && (
              <div
                style={{
                  width: "100%",
                  maxWidth: "400px",
                  padding: "10px 14px",
                  backgroundColor: "#d4edda",
                  color: "#155724",
                  borderRadius: "8px",
                  marginBottom: "16px",
                  textAlign: "center",
                }}
              >
                Reset link has been sent to your email. Redirecting...
              </div>
            )}

            {/* Email Input */}
            <div
              style={{
                width: "100%",
                maxWidth: "400px",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <label
                htmlFor="email"
                style={{
                  alignSelf: "flex-start",
                  fontSize: "14px",
                  fontWeight: "500",
                  color: "#333",
                  marginBottom: "8px",
                }}
              >
                Email Address
              </label>
              <input
                type="email"
                id="email"
                placeholder="Johndoe@gmail.com"
                style={{
                  width: "100%",
                  padding: "10px 14px",
                  borderRadius: "8px",
                  border: "1px solid #ddd",
                  marginBottom: "20px",
                  fontSize: "14px",
                }}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading || resetRequestData !== null}
              />

              {/* Continue Button */}
              <MDBBtn
                onClick={handleButton}
                disabled={isButtonDisabled}
                style={{
                  width: "100%",
                  background:
                    "linear-gradient(90deg, #3B8BD0 0%, #2548C2 100%)",
                  color: "white",
                  textTransform: "none",
                  fontWeight: "500",
                  borderRadius: "8px",
                  padding: "10px 0",
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
                  "Continue"
                )}
              </MDBBtn>
            </div>
          </div>
        </MDBCard>
      </MDBContainer>
    </>
  );
};

export default Forgetpassword;
