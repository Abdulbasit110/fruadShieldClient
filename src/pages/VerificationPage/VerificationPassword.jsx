import React, { useState, useEffect } from "react";
import "./verificationpassword.scss";
import { FaArrowLeft } from "react-icons/fa6";
import { MDBBtn, MDBCard, MDBContainer, MDBSpinner } from "mdb-react-ui-kit";
import { useNavigate, useLocation } from "react-router-dom";
import { authService } from "../../api/services";
import useApi from "../../hooks/useApi";
import { toast } from "react-toastify";

const VerificationPassword = () => {
  const [code, setCode] = useState(Array(6).fill(""));
  const [email, setEmail] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  // Extract email from state if available
  useEffect(() => {
    if (location.state?.email) {
      setEmail(location.state.email);
    } else {
      // If there's no email in state, check if it's in localStorage or sessionStorage
      const storedEmail =
        localStorage.getItem("resetEmail") ||
        sessionStorage.getItem("resetEmail");
      if (storedEmail) {
        setEmail(storedEmail);
      }
    }
  }, [location]);

  // Combine verification code digits
  const combinedCode = code.join("");

  // Use API hook for code verification

  // Use API hook for code verification
  const {
    loading,
    error,
    data: verificationData,
    execute: executeVerifyCode,
  } = useApi(authService.verifyCode, {
    showSuccessToast: true,
    successMessage: "Code verified successfully",
    onSuccess: (response) => {
      // Store token for reset password API if available
      if (response && response.reset_token) {
        localStorage.setItem("resetToken", response.reset_token);
        sessionStorage.setItem("resetToken", response.reset_token);
      } else {
        // If API didn't return token, try to generate a placeholder for testing
        // This is just for debugging - remove in production
        const mockToken = `mock_token_${Date.now()}`;
        console.warn(
          "No token in response, using mock token for testing:",
          mockToken
        );
        localStorage.setItem("resetToken", mockToken);
        sessionStorage.setItem("resetToken", mockToken);
      }

      // Ensure navigation includes the token
      setTimeout(() => {
        const storedToken =
          localStorage.getItem("resetToken") ||
          sessionStorage.getItem("resetToken");

        navigate("/reset-password", {
          state: {
            email,
            verificationCode: combinedCode,
            resetToken: storedToken || response?.token,
          },
        });
      }, 1000);
    },
  });

  // Validation: Check if all blocks are filled
  const isButtonDisabled = code.some((digit) => digit === "") || loading;

  // Handle input change
  const handleInputChange = (index, value) => {
    if (!/^\d$/.test(value) && value !== "") return; // Only allow single digits
    const updatedCode = [...code];
    updatedCode[index] = value;
    setCode(updatedCode);

    // Move focus to the next block if current is filled
    if (value !== "" && index < 5) {
      document.getElementById(`code-input-${index + 1}`).focus();
    }
  };

  // Handle backspace to move to the previous input
  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !code[index] && index > 0) {
      document.getElementById(`code-input-${index - 1}`).focus();
    }
  };

  const handleBack = () => {
    navigate("/forget-password");
  };

  const handleButton = async () => {
    if (code.some((digit) => digit === "")) {
      toast.error("Please enter the complete verification code");
      return;
    }

    if (!email) {
      toast.error(
        "Email address is missing. Please go back to the forget password page."
      );
      return;
    }

    try {
      // Call API to verify the code
      const verificationResponse = await executeVerifyCode({
        email: email,
        code: combinedCode,
      });

      // Directly log the response to see what the API returned

      // Store token for next step
      if (verificationResponse && verificationResponse.token) {
        localStorage.setItem("resetToken", verificationResponse.token);
        sessionStorage.setItem("resetToken", verificationResponse.token);
      } else {
        console.warn("No token found in verification response!");
      }

      // Store email for next step
      localStorage.setItem("resetEmail", email);
      sessionStorage.setItem("resetEmail", email);

      // Navigation is handled in onSuccess callback
    } catch (err) {
      // Error is already handled by useApi hook
      console.error("Verification error:", err);
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
                onClick={handleBack}
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
              Verification Code
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
              Please enter the <b>6-digit</b> verification code sent to{" "}
              <b>{email || "your Email"}</b>
            </p>

            {/* Code Input */}
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                gap: "10px",
                marginBottom: "20px",
              }}
            >
              {code.map((digit, index) => (
                <input
                  key={index}
                  id={`code-input-${index}`}
                  type="text"
                  maxLength="1"
                  value={digit}
                  onChange={(e) => handleInputChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(e, index)}
                  style={{
                    width: "40px",
                    height: "40px",
                    textAlign: "center",
                    fontSize: "18px",
                    border: "1px solid #ddd",
                    borderRadius: "8px",
                    fontWeight: "300",
                  }}
                />
              ))}
            </div>

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
                {error.message || "Verification failed. Please try again."}
              </div>
            )}

            {/* Success Message */}
            {verificationData && (
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
                Code verified successfully. Redirecting...
              </div>
            )}

            {/* Verify Button */}
            <MDBBtn
              onClick={handleButton}
              disabled={isButtonDisabled}
              style={{
                width: "26%",
                background: isButtonDisabled
                  ? "linear-gradient(90deg, #3B8BD0 0%, #2548C2 100%)"
                  : "linear-gradient(90deg, #3B8BD0 0%, #2548C2 100%)",
                color: "white",
                textTransform: "none",
                fontWeight: "500",
                borderRadius: "8px",
                padding: "10px 0",
              }}
            >
              {loading ? (
                <MDBSpinner size="sm" role="status" tag="span" />
              ) : (
                "Verify"
              )}
            </MDBBtn>
          </div>
        </MDBCard>
      </MDBContainer>
    </>
  );
};

export default VerificationPassword;
