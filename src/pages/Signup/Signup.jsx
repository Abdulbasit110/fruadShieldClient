import React, { useState } from 'react';
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
} from 'mdb-react-ui-kit';
import { FaEye, FaEyeSlash } from "react-icons/fa";
import './signup.scss';
import { RxCross2 } from "react-icons/rx";
import { FaRegCheckCircle } from "react-icons/fa";
import Checkbox from '@mui/material/Checkbox';
import { useNavigate } from 'react-router-dom';

const Signup = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [cpassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [basicModal, setBasicModal] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);

  const navigate = useNavigate();

  const toggleOpen = () => setBasicModal(!basicModal);
  const isButtonDisabled = !name || !email || !password || !cpassword || !termsAccepted;

  const handleCreateAccount = () => {
    toggleOpen(); // Open the modal
  };

  const handleContinue = () => {
    navigate('/app/dashboard'); // Navigate to the dashboard
  };

  const handleLogin = () => {
    navigate('/'); // Navigate to the login page
  };

  return (
    <div className='signuppage'>
      <MDBContainer className="my-5">
        <MDBCard style={{ width: "60%", margin: "0px auto" }} className='signupcard'>
          <MDBRow className='g-0'>
            <MDBCol md='6'>
              <MDBCardImage src='/side_register.png' alt="login form" className='rounded-start w-100' style={{ height: "100%" }} />
            </MDBCol>
            <MDBCol md='6'>
              <MDBCardBody className='d-flex flex-column'>
                <div className="text-center">
                  <img src="/logo.png" style={{ width: '88px' }} alt="logo" />
                  <h5 className="mt-2 mb-5 pb-1">Sign Up</h5>
                </div>

                <MDBInput
                  wrapperClass='mb-4'
                  label='Name'
                  id='formControlLg'
                  type='text'
                  size="lg"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />

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

                <div className="mb-2 position-relative">
                  <MDBInput
                    label='Confirm Password'
                    type={showConfirmPassword ? 'text' : 'password'}
                    size="lg"
                    value={cpassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                  <span
                    className="position-absolute top-50 translate-middle-y end-0 me-3"
                    style={{ cursor: 'pointer' }}
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                  </span>
                </div>

                <div className='mb-3 d-flex'>
                  <Checkbox
                    size="small"
                    checked={termsAccepted}
                    onChange={(e) => setTermsAccepted(e.target.checked)}
                    style={{
                      marginTop: "-15px",
                      marginRight: "4px",
                      padding: "0px"
                    }}
                  />
                  <p style={{ fontSize: "14px" }}>I Agree to the <span className='terms'>Terms & Conditions</span></p>
                </div>

                <MDBBtn
                  className="mb-4 px-5"
                  size='lg'
                  disabled={isButtonDisabled}
                  style={{
                    background: isButtonDisabled
                      ? 'linear-gradient(90deg, #3B8BD0 0%, #2548C2 100%)'
                      : 'linear-gradient(90deg, #3B8BD0 0%, #2548C2 100%)',
                    color: '#fff',
                    borderRadius: '8px',
                    fontWeight: '600'
                  }}
                  onClick={handleCreateAccount}
                >
                  Create Account
                </MDBBtn>

                <p className="mb-5 pb-lg-2 text-center" style={{ color: '#393f81' }}>
                  Already have an account?{' '}
                  <span
                    style={{ color: '#3B8BCF', cursor: 'pointer' }}
                    onClick={handleLogin}
                  >
                    Login here
                  </span>
                </p>
              </MDBCardBody>
            </MDBCol>
          </MDBRow>
        </MDBCard>
      </MDBContainer>

      <MDBModal tabIndex='-1' open={basicModal} onClose={toggleOpen}>
        <MDBModalDialog centered>
          <MDBModalContent>
            <MDBModalBody>
              <div style={{ float: "right" }}>
                <span className='crossicon' onClick={toggleOpen}>
                  <RxCross2 style={{ marginBottom: "1px" }} />
                </span>
              </div>

              <div style={{
                display: "flex",
                justifyContent: "center",
                flexDirection: "column",
                alignItems: "center",
                gap: "0.3rem",
                marginTop: "2rem"
              }}>
                <span className='circle'>
                  <FaRegCheckCircle className='circleicon' />
                </span>

                <h3 className='mt-2' style={{ color: "black" }}>Successfully</h3>

                <h6 style={{ color: "black", fontWeight: "400" }}>You have successfully created an account</h6>

                <MDBBtn
                  className="mb-4 px-5 mt-3"
                  size='lg'
                  style={{
                    background: 'linear-gradient(90deg, #3B8BD0 0%, #2548C2 100%)',
                    color: '#fff',
                    borderRadius: '8px',
                    fontWeight: '600',
                    width: "60%"
                  }}
                  onClick={handleContinue}
                >
                  Continue
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
