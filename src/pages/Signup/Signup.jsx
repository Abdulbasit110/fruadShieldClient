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
  MDBModal,
  MDBModalDialog,
  MDBModalContent,
  MDBModalBody,
  MDBCheckbox,
  MDBSpinner,
} from "mdb-react-ui-kit";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import "./signup.scss";
import { RxCross2 } from "react-icons/rx";
import { FaRegCheckCircle } from "react-icons/fa";
import Checkbox from "@mui/material/Checkbox";
import { useNavigate } from "react-router-dom";
import { authService } from "../../api/services";
import useApi from "../../hooks/useApi";
import { toast } from "react-toastify";

const Signup = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    agreeTerms: false,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [basicModal, setBasicModal] = useState(false);

  const navigate = useNavigate();

  // Use API hook for registration
  const {
    loading,
    error,
    execute: executeRegistration,
  } = useApi(authService.register, {
    showSuccessToast: true,
    successMessage: "Registration successful! Please log in.",
    onSuccess: () => {
      // Redirect to login page after successful registration
      setTimeout(() => {
        navigate("/login");
      }, 1500);
    },
  });

  const toggleOpen = () => setBasicModal(!basicModal);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const validateForm = () => {
    if (!formData.firstName.trim()) {
      toast.error("First name is required");
      return false;
    }
    if (!formData.lastName.trim()) {
      toast.error("Last name is required");
      return false;
    }
    if (!formData.email.trim()) {
      toast.error("Email is required");
      return false;
    }
    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      toast.error("Email is invalid");
      return false;
    }
    if (!formData.password) {
      toast.error("Password is required");
      return false;
    }
    if (formData.password.length < 8) {
      toast.error("Password must be at least 8 characters");
      return false;
    }
    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match");
      return false;
    }
    if (!formData.agreeTerms) {
      toast.error("You must agree to the terms and conditions");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      // Prepare registration data
      const registrationData = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        password: formData.password,
      };

      await executeRegistration(registrationData);
    } catch (err) {
      // Error is handled by useApi hook
      console.error("Registration error:", err);
    }
  };

  const isButtonDisabled =
    loading ||
    !formData.firstName ||
    !formData.lastName ||
    !formData.email ||
    !formData.password ||
    !formData.confirmPassword ||
    !formData.agreeTerms;

  const handleBackToLogin = () => {
    navigate("/login");
  };

  return (
    <div className="signuppage">
      <MDBContainer className="my-5">
        <MDBCard style={{ width: "75%", margin: "40px auto" }}>
          <MDBRow className="g-0">
            <MDBCol md="5">
              <MDBCardImage
                src="/side_register.png"
                alt="signup form"
                className="rounded-start w-100"
                style={{ height: "100%" }}
              />
            </MDBCol>

            <MDBCol md="7">
              <MDBCardBody className="d-flex flex-column">
                <div className="text-center">
                  <img src="/logo.png" style={{ width: "88px" }} alt="logo" />
                  <h5 className="mt-2 mb-4">Create an Account</h5>
                </div>

                {error && (
                  <div className="alert alert-danger mb-3">
                    {error.message || "Registration failed. Please try again."}
                  </div>
                )}

                <form onSubmit={handleSubmit}>
                  <div className="row">
                    <div className="col-md-6 mb-4">
                      <MDBInput
                        label="First name"
                        name="firstName"
                        type="text"
                        size="lg"
                        value={formData.firstName}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="col-md-6 mb-4">
                      <MDBInput
                        label="Last name"
                        name="lastName"
                        type="text"
                        size="lg"
                        value={formData.lastName}
                        onChange={handleChange}
                      />
                    </div>
                  </div>

                  <MDBInput
                    wrapperClass="mb-4"
                    label="Email address"
                    name="email"
                    type="email"
                    size="lg"
                    value={formData.email}
                    onChange={handleChange}
                  />

                  <div className="mb-4 position-relative">
                    <MDBInput
                      label="Password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      size="lg"
                      value={formData.password}
                      onChange={handleChange}
                    />
                    <span
                      className="position-absolute top-50 translate-middle-y end-0 me-3"
                      style={{ cursor: "pointer" }}
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <FaEyeSlash /> : <FaEye />}
                    </span>
                  </div>

                  <div className="mb-4 position-relative">
                    <MDBInput
                      label="Confirm Password"
                      name="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      size="lg"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                    />
                    <span
                      className="position-absolute top-50 translate-middle-y end-0 me-3"
                      style={{ cursor: "pointer" }}
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                    >
                      {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                    </span>
                  </div>

                  <div className="mb-4">
                    <MDBCheckbox
                      name="agreeTerms"
                      id="agreeTerms"
                      label="I agree to the terms and conditions"
                      checked={formData.agreeTerms}
                      onChange={handleChange}
                    />
                  </div>

                  <MDBBtn
                    type="submit"
                    className="mb-4"
                    size="lg"
                    disabled={isButtonDisabled}
                    style={{
                      background:
                        "linear-gradient(90deg, #3B8BD0 0%, #2548C2 100%)",
                      color: "#fff",
                      borderRadius: "8px",
                      fontWeight: "600",
                      width: "100%",
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
                      "Sign Up"
                    )}
                  </MDBBtn>
                </form>

                <div className="text-center">
                  <p className="mb-0">
                    Already have an account?{" "}
                    <a
                      onClick={handleBackToLogin}
                      style={{ color: "#3B8BCF", cursor: "pointer" }}
                    >
                      Login
                    </a>
                  </p>
                </div>
              </MDBCardBody>
            </MDBCol>
          </MDBRow>
        </MDBCard>
      </MDBContainer>

      <MDBModal tabIndex="-1" open={basicModal} onClose={toggleOpen}>
        <MDBModalDialog centered>
          <MDBModalContent>
            <MDBModalBody>
              <div style={{ float: "right" }}>
                <span className="crossicon" onClick={toggleOpen}>
                  <RxCross2 style={{ marginBottom: "1px" }} />
                </span>
              </div>

              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: "0.3rem",
                  marginTop: "2rem",
                }}
              >
                <span className="circle">
                  <FaRegCheckCircle className="circleicon" />
                </span>

                <h3 className="mt-2" style={{ color: "black" }}>
                  Successfully
                </h3>

                <h6 style={{ color: "black", fontWeight: "400" }}>
                  You have successfully created an account
                </h6>

                <MDBBtn
                  className="mb-4 px-5 mt-3"
                  size="lg"
                  style={{
                    background:
                      "linear-gradient(90deg, #3B8BD0 0%, #2548C2 100%)",
                    color: "#fff",
                    borderRadius: "8px",
                    fontWeight: "600",
                    width: "60%",
                  }}
                  onClick={toggleOpen}
                >
                  Close
                </MDBBtn>
              </div>
            </MDBModalBody>
          </MDBModalContent>
        </MDBModalDialog>
      </MDBModal>
    </div>
  );
};

export default Signup;
