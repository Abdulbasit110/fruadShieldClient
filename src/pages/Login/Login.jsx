import React, { useState } from 'react';
import {
    MDBBtn,
    MDBContainer,
    MDBCard,
    MDBCardBody,
    MDBCardImage,
    MDBRow,
    MDBCol,
    MDBInput
} from 'mdb-react-ui-kit';
import { IoIosArrowDown } from "react-icons/io";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useNavigate } from 'react-router-dom';
import "./login.scss";

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate(); 

    const isButtonDisabled = !email || !password;

    const handleLogin = () => {
        // Add any login logic here if needed
        navigate('/app/dashboard'); // Navigate to dashboard
    };

    const handleForgotPassword = () => {
        navigate('/forget-password'); // Navigate to forgot password page
    };

    const handleRegister = () => {
        navigate('/signup'); // Navigate to signup page
    };

    return (
        <MDBContainer className="my-5 loginpage">
            <MDBCard style={{ width: "60%", margin: "70px auto" }} className='logincard'>
                <MDBRow className='g-0'>
                    <MDBCol md='6'>
                        <MDBCardImage src='/side_register.png' alt="login form" className='rounded-start w-100' style={{ height: "100%" }} />
                    </MDBCol>

                    <MDBCol md='6'>
                        <div style={{
                            display: "flex",
                            justifyContent: "flex-end",
                            margin: "10px"
                        }}>
                            <MDBBtn style={{
                                boxShadow: "none",
                                background: "#ededed",
                                color: "black",
                                fontWeight: "400",
                                textTransform: "none"
                            }}>
                                Admin Portal <span><IoIosArrowDown /></span>
                            </MDBBtn>
                        </div>

                        <MDBCardBody className='d-flex flex-column'>
                            <div className="text-center">
                                <img src="/logo.png"
                                    style={{ width: '88px' }} alt="logo" />
                                <h5 className="mt-2 mb-5 pb-1">Login</h5>
                            </div>

                            <MDBInput
                                wrapperClass='mb-4'
                                label='Email address'
                                id='formControlLg'
                                type='email'
                                size="lg"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />

                            <div className="mb-4 position-relative">
                                <MDBInput
                                    label='Password'
                                    type={showPassword ? 'text' : 'password'}
                                    size="lg"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                                <span
                                    className="position-absolute top-50 translate-middle-y end-0 me-3"
                                    style={{ cursor: 'pointer' }}
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                                </span>
                            </div>

                            <MDBBtn
                                className="mb-4 px-5"
                                size='lg'
                                disabled={isButtonDisabled}
                                onClick={handleLogin} // Add click handler for login
                                style={{
                                    background: isButtonDisabled
                                        ? 'linear-gradient(90deg, #3B8BD0 0%, #2548C2 100%)'
                                        : 'linear-gradient(90deg, #3B8BD0 0%, #2548C2 100%)',
                                    color: '#fff',
                                    borderRadius: '8px',
                                    fontWeight: '600'
                                }}
                            >
                                Login
                            </MDBBtn>

                            <a
                                style={{
                                    display: "flex",
                                    justifyContent: "flex-end",
                                    color: "#3f3f3f",
                                    marginTop: "-20px",
                                    marginBottom: "20px",
                                    fontSize: "15px"
                                }}
                                className="forgot"
                                onClick={handleForgotPassword} // Add click handler for forgot password
                                
                            >
                                Forgot password?
                            </a>

                            <p className="mb-5 pb-lg-2 text-center" style={{ color: '#393f81' }}>
                                Don't have an account? <a
                                    onClick={handleRegister} // Add click handler for register
                                    style={{ color: '#3B8BCF', cursor: 'pointer' }}
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
