import React, { useState } from 'react';
import "./verificationpassword.scss";
import { FaArrowLeft } from "react-icons/fa6";
import { MDBBtn, MDBCard, MDBContainer } from 'mdb-react-ui-kit';
import { useNavigate } from 'react-router-dom';

const VerificationPassword = () => {
    const [code, setCode] = useState(Array(6).fill(''));
    const navigate = useNavigate();

    // Validation: Check if all blocks are filled
    const isButtonDisabled = code.some((digit) => digit === '');

    // Handle input change
    const handleInputChange = (index, value) => {
        if (!/^\d$/.test(value) && value !== '') return; // Only allow single digits
        const updatedCode = [...code];
        updatedCode[index] = value;
        setCode(updatedCode);

        // Move focus to the next block if current is filled
        if (value !== '' && index < 5) {
            document.getElementById(`code-input-${index + 1}`).focus();
        }
    };

    // Handle backspace to move to the previous input
    const handleKeyDown = (e, index) => {
        if (e.key === 'Backspace' && !code[index] && index > 0) {
            document.getElementById(`code-input-${index - 1}`).focus();
        }
    };

    const handleBack = () => {
        navigate('/forget-password');
    };

    const handleButton = () => {
        navigate('/reset-password');
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
                            <b>example@gmail.com</b>
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
                            Verify
                        </MDBBtn>
                    </div>
                </MDBCard>
            </MDBContainer>
        </>
    );
};

export default VerificationPassword;
