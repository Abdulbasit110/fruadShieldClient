import React, { useState } from "react";
import { IoArrowForwardCircleOutline } from "react-icons/io5";
import { MDBBadge, MDBBtn, MDBTable, MDBTableHead, MDBTableBody, MDBInput } from 'mdb-react-ui-kit';
import "./management.scss"
import { GoDotFill } from "react-icons/go";
import Pagination from "../../components/Pagination";
import { PiUserCheck } from "react-icons/pi";
import { HiOutlineUserGroup } from "react-icons/hi2";
import { RiUserAddLine } from "react-icons/ri";
import {
  MDBModal,
  MDBModalDialog,
  MDBModalContent,
  MDBModalBody,
} from 'mdb-react-ui-kit';
import { RxCross2 } from "react-icons/rx";
import { MdForwardToInbox } from "react-icons/md";
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import { IoEyeOutline } from "react-icons/io5";
import { LiaUserEditSolid } from "react-icons/lia";
import { TiArrowLeft } from "react-icons/ti";
import { Card, Row, Col } from 'react-bootstrap';
import { MdToggleOn } from "react-icons/md";
import { FaRegCheckCircle } from "react-icons/fa";

const users = Array.from({ length: 50 }, (_, index) => {
  const isInactive = index % 2 === 0; // Alternate between Fraudulent and Genuine
  const isUser = index % 3 === 0;

  return {
    id: `${String(index + 1)}`,
    // transactionId: `TXN-20231026-${(index + 1).toString().padStart(3, "0")}`,
    UserName: `Muhammad Faisal Kundi`,
    EmailAddress: `faisal.kundi@example.com`,
    mobileNumber: `+92 303 45${(67890 + index).toString().slice(-5)}`,
    role: isUser ? "User" : "Admin",
    status: isInactive ? "Inactive" : "Active",
  };
});


const Management = () => {
  const [filter, setFilter] = useState("All");
  const [basicModal, setBasicModal] = useState(false);
  const [updateModal, setUpdateModal] = useState(false);

  // For View
  const [viewUser, setViewUser] = useState(null);
  const handleViewDetails = (user) => {
    console.log("User", user)
    setViewUser(user);
  };

  const handleViewBack = () => {
    setViewUser(null);
  };


  // For Edit
  const [editUser, setEditUser] = useState(null);
  const handleEditDetails = (user) => {
    setEditUser(user);
  };

  const handleEditBack = () => {
    setEditUser(null);
  };


  // Filtered transactions based on the button clicked
  const filteredUsers =
    filter === "All"
      ? users
      : users.filter((txn) => txn.role === filter);


  const toggleOpen = () => setBasicModal(!basicModal);
  const toggleUpdate = () => setUpdateModal(!updateModal);

  const handleInvite = () => {
    toggleOpen(); // Open the modal
  };

  const handleUpdate = () => {
    toggleUpdate(); // Open the modal
  };


  return (
    <div>
      {(!viewUser && !editUser) &&
        <div className="management-container">
          <div className="management-header">
            <div className="user-info">
              <div className="user-text">
                <span className="user-name">John Deo</span>
                <span className="user-role">Admin</span>
              </div>
              <img
                src="/user.png" // Replace with the actual user avatar URL
                alt="User Avatar"
                className="user-avatar"
              />
            </div>
          </div>
          <h3 style={{ color: "black" }}>User Management</h3>

          {/* Statistic Boxes */}
          <div className="statistic-boxes">
            {/* Box 1 */}
            <div className="stat-box">
              <div className="icon-container skyblue">
                <HiOutlineUserGroup className="crediticon" />
              </div>
              <div className="stat-text">
                <h2>100</h2>
                <span>Total Users</span>
              </div>
            </div>

            {/* Box 2 */}
            <div className="stat-box">
              <div className="icon-container green">
                <PiUserCheck className="peopleicon" />
              </div>
              <div className="stat-text">
                <h2>50</h2>
                <span>Active Users</span>
              </div>
            </div>

            {/* Box 3 */}
            <div className="stat-box">
              <div className="icon-container red">
                <IoArrowForwardCircleOutline className="arrowright" />
              </div>
              <div className="stat-text">
                <h2>50</h2>
                <span>Inactive Users</span>
              </div>
            </div>
          </div>

          {/* Table */}
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: "20px", alignItems: "center" }}>
            <div>
              <h5 style={{ color: "black" }}>List of Users</h5>
            </div>
            <div
              className="search-container"
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px"
              }}
            >
              <div

              >
                <input
                  type="text"
                  placeholder="🔍 Search"
                  className="search-input"
                  style={{
                    width: "100%",
                    padding: "8px 36px 8px 12px",
                    borderRadius: "20px",
                    border: "1px solid #ccc",
                    outline: "none",
                    fontSize: "14px",
                    marginLife: "10px"
                  }}
                />

              </div>
              <button className="action-button-invite" onClick={handleInvite}>
                <span style={{ fontSize: "14px", position: "relative", top: "-1px" }}> <RiUserAddLine /></span>
                <span style={{ marginLeft: "4px", fontWeight: "450" }}>Invite User</span>

              </button>
            </div>
          </div>


          <div className="buttons-container">
            <button
              className={`action-button ${filter === "All" ? "active" : ""}`}
              onClick={() => setFilter("All")}
            >
              All
            </button>
            <button
              className={`action-button ${filter === "Admin" ? "active" : ""}`}
              onClick={() => setFilter("Admin")}
            >
              Admin
            </button>
            <button
              className={`action-button ${filter === "User" ? "active" : ""}`}
              onClick={() => setFilter("User")}
            >
              Users
            </button>
          </div>

          <div className="table-container">
            <MDBTable align='middle' className="transactiontable">
              <MDBTableHead>
                <tr>
                  <th scope='col'>ID</th>
                  <th scope='col'>Username</th>
                  <th scope='col'>Email Address</th>
                  <th scope='col'>Phone Number</th>
                  <th scope='col'>User Role</th>
                  <th scope='col'>Status</th>
                  <th scope='col'>Actions</th>
                </tr>
              </MDBTableHead>
              <MDBTableBody>
                {filteredUsers.map((user) => (
                  <tr key={user.id}>
                    <td>
                      <p>{user.id}</p>
                    </td>
                    <td>
                      <p>{user.UserName}</p>
                    </td>
                    <td>
                      <p>{user.EmailAddress}</p>
                    </td>
                    <td>
                      <p>{user.mobileNumber}</p>
                    </td>
                    <td>
                      <p>{user.role}</p>
                    </td>
                    <td>
                      {user.status === "Inactive" ? (
                        <MDBBadge pill className="failbg">
                          <span>
                            <GoDotFill className="dot" />
                          </span>
                          <span className="fraudtext">Inactive</span>
                        </MDBBadge>
                      ) : (
                        <MDBBadge pill className="successbg">
                          <span>
                            <GoDotFill className="dot" />
                          </span>
                          <span className="genuinetext">Active</span>
                        </MDBBadge>
                      )}
                    </td>
                    <td className="actions">
                      <div>
                        <span style={{ fontSize: "1.5rem", color: "#2649C2" }} onClick={() => handleViewDetails(user)}><IoEyeOutline /></span>
                        <span style={{ fontSize: "1.5rem", color: "#2649C2" }} onClick={() => handleEditDetails(user)}><LiaUserEditSolid /></span>
                      </div>
                    </td>
                  </tr>
                ))}
              </MDBTableBody>
            </MDBTable>


          </div>
          <div style={{
            marginTop: "10px",
            display: "flex",
            justifyContent: "flex-end"
          }}>
            <Pagination />
          </div>

          {/* Modal */}
          <MDBModal tabIndex='-1' open={basicModal} onClose={toggleOpen}>
            <MDBModalDialog centered>
              <MDBModalContent>
                <MDBModalBody>
                  <div style={{ float: "right" }}>
                    <span className='crossicon' onClick={toggleOpen}>
                      <RxCross2 style={{ marginBottom: "3px" }} />
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
                      <MdForwardToInbox className='circleicon' />
                    </span>

                    <div style={{ display: "flex", alignItems: "center", flexDirection: "column" }}>
                      <h4 className='mt-2' style={{ color: "black" }}>Invite User</h4>
                      <h6 style={{
                        color: "#333333",
                        fontWeight: "400",
                        width: "85%",
                        textAlign: "center"
                      }}>Enter the email address of the user you’d like to invite. An invitation will be sent directly to their inbox.</h6>
                    </div>

                    <div style={{ width: "85%" }}>
                      <Form.Label>Role</Form.Label>
                      <Form.Select aria-label="Default select example">
                        <option>Select Role</option>
                        <option value="1">User</option>
                        <option value="2">Admin</option>
                      </Form.Select>

                      <Form.Label className="mt-3">Email Address</Form.Label>
                      <InputGroup className="mb-1">
                        <Form.Control
                          placeholder="Write Email"
                          aria-label="Write Email"
                          aria-describedby="basic-addon2"
                        />
                      </InputGroup>
                    </div>
                    <MDBBtn
                      className="mb-4 px-5 mt-3"
                      size='md'
                      style={{
                        background: 'linear-gradient(90deg, #3B8BD0 0%, #2548C2 100%)',
                        color: '#fff',
                        borderRadius: '8px',
                        fontWeight: '600',
                        width: "60%"
                      }}
                      onClick={toggleOpen}
                    >
                      Send Invite
                    </MDBBtn>
                  </div>
                </MDBModalBody>
              </MDBModalContent>
            </MDBModalDialog>
          </MDBModal>
        </div>
      }
      {/* Watch View Details */}
      {viewUser && (
        <>
          <div className="management-container">
            <div className="management-header">
              <div className="user-info">
                <div className="user-text">
                  <span className="user-name">John Deo</span>
                  <span className="user-role">Admin</span>
                </div>
                <img
                  src="/user.png" // Replace with the actual user avatar URL
                  alt="User Avatar"
                  className="user-avatar"
                />
              </div>
            </div>

            {/* View Card */}
            <div className="container mt-4">
              <div className="d-flex align-items-center mb-3">
                <button className="btn btn-light me-2"
                  style={{
                    background: "black",
                    padding: "3px",
                    height: "36px"
                  }}
                  onClick={handleViewBack}
                ><span style={{ fontSize: "1.8rem", position: "relative", top: "-8px", color: "white" }}><TiArrowLeft /></span></button>
                <h5 className="ms-1 mt-1" style={{ color: "black" }}>User Details</h5>
              </div>
              <div className="cardview">

                <div className="cornerbg">
                  <h6 className="mb-4" style={{ color: "black" }}>User Details</h6>
                  <div>
                    {/* Icons */}
                    {viewUser.status === "Inactive" ? (
                      <div style={{
                        display: "flex", flexDirection: "row",
                        justifyContent: "center",
                        alignItems: "center"
                      }}>
                        <MDBBadge pill className="failbg">
                          <span>
                            <GoDotFill className="dot" />
                          </span>
                          <span className="fraudtext">Inactive</span>
                        </MDBBadge>
                        <span className="inactivetoggle">
                          <MdToggleOn />
                        </span>
                      </div>
                    ) : (
                      <div style={{
                        display: "flex", flexDirection: "row",
                        justifyContent: "center",
                        alignItems: "center"
                      }}>
                        <MDBBadge pill className="successbg">
                          <span>
                            <GoDotFill className="dot" />
                          </span>
                          <span className="genuinetext">Active</span>
                        </MDBBadge>
                        <span className="activetoggle">
                          <MdToggleOn />
                        </span>
                      </div>
                    )}

                  </div>
                </div>

                {/* 1st Row */}
                <Row>
                  {/* 1st Col */}
                  <Col sm={6} md={3} lg={3} className="mb-3">
                    <div className="h-100">
                      <Card.Body>
                        <b style={{ color: "black" }}>12-02-2024</b>
                        <p style={{ color: "black" }}>Registration Date</p>
                      </Card.Body>
                    </div>
                  </Col>
                  <Col sm={6} md={3} lg={3} className="mb-3">
                    <div className="h-100">
                      <Card.Body>
                        <b style={{ color: "black" }}>Muhammad Faisal Kundi</b>
                        <p style={{ color: "black" }}>Username</p>
                      </Card.Body>
                    </div>
                  </Col>
                  <Col sm={6} md={4} lg={4} className="mb-3">
                    <div className="h-100">
                      <Card.Body>
                        <b style={{ color: "black" }}>{viewUser.mobileNumber}</b>
                        <p style={{ color: "black" }}>Phone Number</p>
                      </Card.Body>
                    </div>
                  </Col>
                </Row>

                {/* 2nd Row */}
                <Row>
                  {/* 1st Col */}
                  <Col sm={6} md={3} lg={3} className="mb-3">
                    <div className="h-100">
                      <Card.Body>
                        <b style={{ color: "black" }}>faisal.kundi@example.com</b>
                        <p style={{ color: "black" }}>Email Address</p>
                      </Card.Body>
                    </div>
                  </Col>

                  <Col sm={6} md={9} lg={9} className="mb-3">
                    <div className="h-100">
                      <Card.Body>
                        <b style={{ color: "black" }}>{viewUser.role}</b>
                        <p style={{ color: "black" }}>Role</p>
                      </Card.Body>
                    </div>
                  </Col>
                </Row>


              </div>
            </div>
          </div>
        </>
      )}

      {/* Watch Edit Details */}
      {editUser && (
        <>
          <div className="management-container">
            <div className="management-header">
              <div className="user-info">
                <div className="user-text">
                  <span className="user-name">John Deo</span>
                  <span className="user-role">Admin</span>
                </div>
                <img
                  src="/user.png" // Replace with the actual user avatar URL
                  alt="User Avatar"
                  className="user-avatar"
                />
              </div>
            </div>

            {/* View Card */}
            <div className="container mt-4">
              <div className="d-flex align-items-center mb-3">
                <button className="btn btn-light me-2"
                  style={{
                    background: "black",
                    padding: "3px",
                    height: "36px"
                  }}
                  onClick={handleEditBack}
                ><span style={{ fontSize: "1.8rem", position: "relative", top: "-8px", color: "white" }}><TiArrowLeft /></span></button>
                <h5 className="ms-1 mt-1" style={{ color: "black" }}>User Details</h5>
              </div>
              <div className="cardview">

                <div className="cornerbg">
                  <h6 className="mb-4" style={{ color: "black" }}>User Details</h6>
                  <div>
                    {/* Icons */}
                    {editUser.status === "Inactive" ? (
                      <div style={{
                        display: "flex", flexDirection: "row",
                        justifyContent: "center",
                        alignItems: "center"
                      }}>
                        <MDBBadge pill className="failbg">
                          <span>
                            <GoDotFill className="dot" />
                          </span>
                          <span className="fraudtext">Inactive</span>
                        </MDBBadge>
                        <span className="inactivetoggle">
                          <MdToggleOn />
                        </span>
                      </div>
                    ) : (
                      <div style={{
                        display: "flex", flexDirection: "row",
                        justifyContent: "center",
                        alignItems: "center"
                      }}>
                        <MDBBadge pill className="successbg">
                          <span>
                            <GoDotFill className="dot" />
                          </span>
                          <span className="genuinetext">Active</span>
                        </MDBBadge>
                        <span className="activetoggle">
                          <MdToggleOn />
                        </span>
                      </div>
                    )}

                  </div>
                </div>

                {/* 1st Row */}
                <Row>
                  {/* 1st Col */}
                  <Col sm={6} md={3} lg={3} className="mb-1">
                    <div className="h-100">
                      <Card.Body>
                        <Form.Label>Registration Date</Form.Label>
                        <InputGroup className="mb-1">
                          <Form.Control
                            style={{
                              paddingTop: "1.5rem",
                              paddingBottom: "1.5rem",
                              borderRadius: "14px"
                            }}
                            className="inputgrp"
                            placeholder=""
                            aria-label=""
                            aria-describedby="basic-addon2"
                            value="10-02-2024"
                          />
                        </InputGroup>
                      </Card.Body>
                    </div>
                  </Col>
                  <Col sm={6} md={3} lg={3} className="mb-1">
                    <div className="h-100">
                      <Card.Body>
                        <Form.Label>Username</Form.Label>
                        <InputGroup className="mb-1">
                          <Form.Control
                            style={{
                              paddingTop: "1.5rem",
                              paddingBottom: "1.5rem",
                              borderRadius: "14px"
                            }}
                            className="inputgrp"
                            placeholder=""
                            aria-label=""
                            aria-describedby="basic-addon2"
                            value="Muhammad Faisal Kundi"
                          />
                        </InputGroup>
                      </Card.Body>
                    </div>
                  </Col>
                </Row>

                {/* 2nd Row */}
                <Row>
                  {/* 1st Col */}
                  <Col sm={6} md={3} lg={3} className="mb-1">
                    <div className="h-100">
                      <Card.Body>
                        <Form.Label className="mt-1">Phone Number</Form.Label>
                        <InputGroup className="mb-1">
                          <Form.Control
                            style={{
                              paddingTop: "1.5rem",
                              paddingBottom: "1.5rem",
                              borderRadius: "14px"
                            }}
                            className="inputgrp"
                            placeholder=""
                            aria-label=""
                            aria-describedby="basic-addon2"
                            value={editUser.mobileNumber}
                          />
                        </InputGroup>
                      </Card.Body>
                    </div>
                  </Col>
                  <Col sm={6} md={3} lg={3} className="mb-1">
                    <div className="h-100">
                      <Card.Body>
                        <Form.Label className="mt-1">Email Address</Form.Label>
                        <InputGroup className="mb-1">
                          <Form.Control
                            style={{
                              paddingTop: "1.5rem",
                              paddingBottom: "1.5rem",
                              borderRadius: "14px"
                            }}
                            className="inputgrp"
                            placeholder=""
                            aria-label=""
                            aria-describedby="basic-addon2"
                            value="faisal.kundi@example.com"
                          />
                        </InputGroup>
                      </Card.Body>
                    </div>
                  </Col>
                </Row>

                <Row>
                  {/* 1st Col */}
                  <Col sm={6} md={3} lg={3} className="mb-1">
                    <div className="h-100">
                      <Card.Body>
                        <Form.Label>Role</Form.Label>
                        <Form.Select aria-label="Default select example" style={{
                          paddingTop: ".8rem",
                          paddingBottom: ".8rem",
                          borderRadius: "14px"
                        }}>
                          {/* {editUser.role} */}
                          <option value="Admin" selected={editUser.role === "Admin"}>Admin</option>
                          <option value="User" selected={editUser.role === "User"}>
                            User
                          </option>
                        </Form.Select>


                      </Card.Body>
                    </div>
                  </Col>
                  <Col sm={6} md={3} lg={3} className="mb-1">
                    <div className="h-100">
                      <Card.Body>
                        <Form.Label>Status</Form.Label>
                        <Form.Select aria-label="Default select example" style={{
                          paddingTop: ".8rem",
                          paddingBottom: ".8rem",
                          borderRadius: "14px"
                        }}>
                           <option value="Active" selected={editUser.status === "Active"}>Active</option>
                          <option value="Inactive" selected={editUser.status === "Inactive"}>
                            Inactive
                          </option>
                        </Form.Select>
                      </Card.Body>
                    </div>
                  </Col>


                </Row>

                <Row className="mt-3">
                  <Col sm={6} md={3} lg={3} className="mb-1">
                    <MDBBtn
                      onClick={handleUpdate}
                      style={{
                        width: "65%",
                        background: 'linear-gradient(90deg, #3B8BD0 0%, #2548C2 100%)',
                        color: "white",
                        textTransform: "none",
                        fontWeight: "500",
                        borderRadius: "8px",
                        padding: "12px 0",
                        fontSize: "14px"
                      }}>
                      Update
                    </MDBBtn>
                  </Col>
                </Row>
              </div>
            </div>

            {/* Modal */}
            <MDBModal tabIndex='-1' open={updateModal} onClose={toggleUpdate}>
              <MDBModalDialog centered>
                <MDBModalContent>
                  <MDBModalBody>
                    <div style={{ float: "right" }}>
                      <span className='crossicon' onClick={toggleUpdate}>
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

                      <h4 className='mt-2' style={{ color: "black" }}>Successfully!</h4>

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
                        onClick={handleViewBack}
                      >
                        Continue
                      </MDBBtn>
                    </div>
                  </MDBModalBody>
                </MDBModalContent>
              </MDBModalDialog>
            </MDBModal>
          </div>
        </>
      )}
    </div>
  )
}

export default Management
