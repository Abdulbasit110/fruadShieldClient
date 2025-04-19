import React, { useState, useEffect } from "react";
import { IoArrowForwardCircleOutline } from "react-icons/io5";
import {
  MDBBadge,
  MDBBtn,
  MDBTable,
  MDBTableHead,
  MDBTableBody,
  MDBInput,
  MDBSpinner,
} from "mdb-react-ui-kit";
import "./management.scss";
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
} from "mdb-react-ui-kit";
import { RxCross2 } from "react-icons/rx";
import { MdForwardToInbox } from "react-icons/md";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import { IoEyeOutline } from "react-icons/io5";
import { LiaUserEditSolid } from "react-icons/lia";
import { TiArrowLeft } from "react-icons/ti";
import { Card, Row, Col } from "react-bootstrap";
import { MdToggleOn } from "react-icons/md";
import { FaRegCheckCircle } from "react-icons/fa";

// Import user service
import { authService, userService } from "../../api/services";
import { toast } from "react-toastify";

// Remove mock data
// const users = Array.from({ length: 50 }, (_, index) => { ... });

const Management = () => {
  const [filter, setFilter] = useState("All");
  const [basicModal, setBasicModal] = useState(false);
  const [updateModal, setUpdateModal] = useState(false);

  // API data states
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState({
    totalUsers: 0,
    approvedUsers: 0,
    unapprovedUsers: 0,
  });

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(1);

  // Search state
  const [searchQuery, setSearchQuery] = useState("");

  // For View
  const [viewUser, setViewUser] = useState(null);
  const handleViewDetails = (user) => {
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

  // Fetch all users from API
  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await userService.getAllUsers({
        page: currentPage,
        limit: pageSize,
        search: searchQuery || undefined,
      });

      console.log("Users data:", response);

      let userData = [];
      if (Array.isArray(response)) {
        userData = response;
      } else if (response.users) {
        userData = response.users;
        // Handle pagination if available
        if (response.pagination) {
          setTotalPages(
            response.pagination.totalPages ||
              Math.ceil(response.pagination.totalItems / pageSize) ||
              1
          );
        } else if (response.total) {
          setTotalPages(Math.ceil(response.total / pageSize) || 1);
        }
      }

      setUsers(userData);

      // Calculate stats
      const approvedCount = userData.filter(
        (user) => user.is_approved === true
      ).length;
      const unapprovedCount = userData.length - approvedCount;

      setStats({
        totalUsers: userData.length,
        approvedUsers: approvedCount,
        unapprovedUsers: unapprovedCount,
      });
    } catch (error) {
      console.error("Error fetching users:", error);
      toast.error("Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  // Update user status or role
  const updateUserStatus = async (userId, userData) => {
    setLoading(true);
    try {
      const response = await userService.updateUser(userId, userData);

      console.log("User updated:", response);
      toast.success("User updated successfully");

      // Refresh the users list
      fetchUsers();

      // Close modals
      setUpdateModal(false);
      setEditUser(null);
      setViewUser(null);
    } catch (error) {
      console.error("Error updating user:", error);
      toast.error("Failed to update user");
    } finally {
      setLoading(false);
    }
  };

  // Invite new user
  const inviteUser = async (email, role) => {
    setLoading(true);
    try {
      const response = await userService.inviteUser({
        email,
        role,
      });

      console.log("User invited:", response);
      toast.success("Invitation sent successfully");

      // Close invite modal
      setBasicModal(false);

      // Refresh the users list
      fetchUsers();
    } catch (error) {
      console.error("Error inviting user:", error);
      toast.error("Failed to send invitation");
    } finally {
      setLoading(false);
    }
  };

  // Effect to fetch users on mount and when filters change
  useEffect(() => {
    fetchUsers();
  }, [currentPage, pageSize, searchQuery]);

  // Filtered users based on the button clicked
  const filteredUsers =
    filter === "All"
      ? users
      : users.filter((user) => user.role && user.role.toLowerCase() === filter);

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
      {!viewUser && !editUser && (
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
                <h2>{loading ? <MDBSpinner size="sm" /> : stats.totalUsers}</h2>
                <span>Total Users</span>
              </div>
            </div>

            {/* Box 2 */}
            <div className="stat-box">
              <div className="icon-container green">
                <PiUserCheck className="peopleicon" />
              </div>
              <div className="stat-text">
                <h2>
                  {loading ? <MDBSpinner size="sm" /> : stats.approvedUsers}
                </h2>
                <span>Approved Users</span>
              </div>
            </div>

            {/* Box 3 */}
            <div className="stat-box">
              <div className="icon-container red">
                <IoArrowForwardCircleOutline className="arrowright" />
              </div>
              <div className="stat-text">
                <h2>
                  {loading ? <MDBSpinner size="sm" /> : stats.unapprovedUsers}
                </h2>
                <span>Unapproved Users</span>
              </div>
            </div>
          </div>

          {/* Table */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginTop: "20px",
              alignItems: "center",
            }}
          >
            <div>
              <h5 style={{ color: "black" }}>List of Users</h5>
            </div>
            <div
              className="search-container"
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
              }}
            >
              <div>
                <input
                  type="text"
                  placeholder="🔍 Search"
                  className="search-input"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "8px 36px 8px 12px",
                    borderRadius: "20px",
                    border: "1px solid #ccc",
                    outline: "none",
                    fontSize: "14px",
                    marginLife: "10px",
                  }}
                />
              </div>
              <button className="action-button-invite" onClick={handleInvite}>
                <span
                  style={{
                    fontSize: "14px",
                    position: "relative",
                    top: "-1px",
                  }}
                >
                  {" "}
                  <RiUserAddLine />
                </span>
                <span style={{ marginLeft: "4px", fontWeight: "450" }}>
                  Invite User
                </span>
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
              onClick={() => setFilter("admin")}
            >
              Admin
            </button>
            <button
              className={`action-button ${filter === "User" ? "active" : ""}`}
              onClick={() => setFilter("user")}
            >
              Users
            </button>
          </div>

          <div className="table-container">
            {loading ? (
              <div className="text-center my-4">
                <MDBSpinner />
              </div>
            ) : (
              <MDBTable align="middle" className="transactiontable">
                <MDBTableHead>
                  <tr>
                    <th scope="col">ID</th>
                    <th scope="col">Username</th>
                    <th scope="col">Email Address</th>
                    {/* <th scope="col">Phone Number</th> */}
                    <th scope="col">User Role</th>
                    {/* <th scope="col">Status</th> */}
                    <th scope="col">Actions</th>
                  </tr>
                </MDBTableHead>
                <MDBTableBody>
                  {filteredUsers.length > 0 ? (
                    filteredUsers.map((user) => (
                      <tr key={user.id}>
                        <td>
                          <p>{user.id}</p>
                        </td>
                        <td>
                          <p>
                            {user.username ||
                              user.first_name + " " + user.last_name ||
                              user.UserName ||
                              "N/A"}
                          </p>
                        </td>
                        <td>
                          <p>{user.email || user.EmailAddress || "N/A"}</p>
                        </td>
                        {/* <td>
                          <p>
                            {user.phone ||
                              user.phoneNumber ||
                              user.mobileNumber ||
                              "N/A"}
                          </p>
                        </td> */}
                        <td>
                          <p>{user.role || "User"}</p>
                        </td>
                        {/* <td>
                          {user.status === "Inactive" || !user.isActive ? (
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
                        </td> */}
                        <td className="actions">
                          <div>
                            <span
                              style={{ fontSize: "1.5rem", color: "#2649C2" }}
                              onClick={() => handleViewDetails(user)}
                            >
                              <IoEyeOutline />
                            </span>
                            <span
                              style={{ fontSize: "1.5rem", color: "#2649C2" }}
                              onClick={() => handleEditDetails(user)}
                            >
                              <LiaUserEditSolid />
                            </span>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="7" className="text-center">
                        No users found
                      </td>
                    </tr>
                  )}
                </MDBTableBody>
              </MDBTable>
            )}
          </div>
          <div
            style={{
              marginTop: "10px",
              display: "flex",
              justifyContent: "flex-end",
            }}
          >
            <div className="pagination-controls d-flex justify-content-between align-items-center">
              <div className="d-flex align-items-center">
                <span className="me-2">Rows per page:</span>
                <select
                  className="form-select form-select-sm"
                  value={pageSize}
                  onChange={(e) => {
                    setPageSize(parseInt(e.target.value));
                    setCurrentPage(1);
                  }}
                  style={{ width: "70px" }}
                >
                  <option value="10">10</option>
                  <option value="25">25</option>
                  <option value="50">50</option>
                </select>
              </div>

              <div className="pagination-buttons">
                <MDBBtn
                  size="sm"
                  color="light"
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage((prev) => prev - 1)}
                >
                  Previous
                </MDBBtn>
                <span className="mx-2">
                  Page {currentPage} of {totalPages}
                </span>
                <MDBBtn
                  size="sm"
                  color="light"
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage((prev) => prev + 1)}
                >
                  Next
                </MDBBtn>
              </div>
            </div>
          </div>

          {/* Invite User Modal */}
          <MDBModal tabIndex="-1" open={basicModal} onClose={toggleOpen}>
            <MDBModalDialog centered>
              <MDBModalContent>
                <MDBModalBody>
                  <div style={{ float: "right" }}>
                    <span className="crossicon" onClick={toggleOpen}>
                      <RxCross2 style={{ marginBottom: "3px" }} />
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
                      <MdForwardToInbox className="circleicon" />
                    </span>

                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        flexDirection: "column",
                      }}
                    >
                      <h4 className="mt-2" style={{ color: "black" }}>
                        Invite User
                      </h4>
                      <h6
                        style={{
                          color: "#333333",
                          fontWeight: "400",
                          width: "85%",
                          textAlign: "center",
                        }}
                      >
                        Enter the email address of the user you'd like to
                        invite. An invitation will be sent directly to their
                        inbox.
                      </h6>
                    </div>

                    <form
                      style={{ width: "85%" }}
                      onSubmit={(e) => {
                        e.preventDefault();
                        const formData = new FormData(e.target);
                        const email = formData.get("email");
                        const role = formData.get("role");

                        if (!email) {
                          toast.error("Please enter an email address");
                          return;
                        }

                        inviteUser(email, role);
                      }}
                    >
                      <Form.Label>Role</Form.Label>
                      <Form.Select name="role" aria-label="Select role">
                        <option value="User">User</option>
                        <option value="Admin">Admin</option>
                      </Form.Select>

                      <Form.Label className="mt-3">Email Address</Form.Label>
                      <InputGroup className="mb-1">
                        <Form.Control
                          name="email"
                          placeholder="Write Email"
                          aria-label="Write Email"
                          aria-describedby="basic-addon2"
                          required
                        />
                      </InputGroup>

                      <MDBBtn
                        type="submit"
                        className="mb-4 px-5 mt-3"
                        size="md"
                        style={{
                          background:
                            "linear-gradient(90deg, #3B8BD0 0%, #2548C2 100%)",
                          color: "#fff",
                          borderRadius: "8px",
                          fontWeight: "600",
                          width: "100%",
                        }}
                        disabled={loading}
                      >
                        {loading ? <MDBSpinner size="sm" /> : "Send Invite"}
                      </MDBBtn>
                    </form>
                  </div>
                </MDBModalBody>
              </MDBModalContent>
            </MDBModalDialog>
          </MDBModal>
        </div>
      )}
      {/* View User Details */}
      {viewUser && (
        <>
          <div className="management-container">
            <div className="management-header">
              <div className="user-info">
                <div className="user-text">
                  <span className="user-name">Admin Panel</span>
                  <span className="user-role">User Management</span>
                </div>
                <img
                  src="/user.png"
                  alt="User Avatar"
                  className="user-avatar"
                />
              </div>
            </div>

            {/* View Card */}
            <div className="container mt-4">
              <div className="d-flex align-items-center mb-3">
                <button
                  className="btn btn-light me-2"
                  style={{
                    background: "black",
                    padding: "3px",
                    height: "36px",
                  }}
                  onClick={handleViewBack}
                >
                  <span
                    style={{
                      fontSize: "1.8rem",
                      position: "relative",
                      top: "-8px",
                      color: "white",
                    }}
                  >
                    <TiArrowLeft />
                  </span>
                </button>
                <h5 className="ms-1 mt-1" style={{ color: "black" }}>
                  User Details
                </h5>
              </div>
              <div className="cardview">
                <div className="cornerbg">
                  <h6 className="mb-4" style={{ color: "black" }}>
                    User Details
                  </h6>
                  <div>
                    {/* Status toggle with action buttons */}
                    {!viewUser.is_approved ? (
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "row",
                          justifyContent: "center",
                          alignItems: "center",
                          gap: "10px",
                        }}
                      >
                        <MDBBadge pill className="failbg">
                          <span>
                            <GoDotFill className="dot" />
                          </span>
                          <span className="fraudtext">Unapproved</span>
                        </MDBBadge>
                        <MDBBtn
                          size="sm"
                          color="success"
                          disabled={loading}
                          onClick={() =>
                            updateUserStatus(viewUser.id, {
                              is_approved: true,
                              role: viewUser.role,
                            })
                          }
                          style={{ padding: "6px 12px" }}
                        >
                          {loading ? <MDBSpinner size="sm" /> : "Approve User"}
                        </MDBBtn>
                      </div>
                    ) : (
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "row",
                          justifyContent: "center",
                          alignItems: "center",
                          gap: "10px",
                        }}
                      >
                        <MDBBadge pill className="successbg">
                          <span>
                            <GoDotFill className="dot" />
                          </span>
                          <span className="genuinetext">Approved</span>
                        </MDBBadge>
                        {viewUser.role !== "admin" && (
                          <MDBBtn
                            size="sm"
                            color="primary"
                            disabled={loading}
                            onClick={() =>
                              updateUserStatus(viewUser.id, {
                                is_approved: true,
                                role: "admin",
                              })
                            }
                            style={{ padding: "6px 12px" }}
                          >
                            {loading ? <MDBSpinner size="sm" /> : "Make Admin"}
                          </MDBBtn>
                        )}
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
                        <b style={{ color: "black" }}>
                          {viewUser.created_at
                            ? new Date(viewUser.created_at).toLocaleDateString()
                            : "N/A"}
                        </b>
                        <p style={{ color: "black" }}>Registration Date</p>
                      </Card.Body>
                    </div>
                  </Col>
                  <Col sm={6} md={3} lg={3} className="mb-3">
                    <div className="h-100">
                      <Card.Body>
                        <b style={{ color: "black" }}>
                          {viewUser.first_name + " " + viewUser.last_name ||
                            viewUser.name ||
                            viewUser.UserName ||
                            "N/A"}
                        </b>
                        <p style={{ color: "black" }}>Username</p>
                      </Card.Body>
                    </div>
                  </Col>
                  {/* <Col sm={6} md={4} lg={4} className="mb-3">
                    <div className="h-100">
                      <Card.Body>
                        <b style={{ color: "black" }}>
                          {viewUser.phone ||
                            viewUser.phoneNumber ||
                            viewUser.mobileNumber ||
                            "N/A"}
                        </b>
                        <p style={{ color: "black" }}>Phone Number</p>
                      </Card.Body>
                    </div>
                  </Col> */}
                </Row>

                {/* 2nd Row */}
                <Row>
                  {/* 1st Col */}
                  <Col sm={6} md={3} lg={3} className="mb-3">
                    <div className="h-100">
                      <Card.Body>
                        <b style={{ color: "black" }}>
                          {viewUser.email || viewUser.EmailAddress || "N/A"}
                        </b>
                        <p style={{ color: "black" }}>Email Address</p>
                      </Card.Body>
                    </div>
                  </Col>

                  <Col sm={6} md={9} lg={9} className="mb-3">
                    <div className="h-100">
                      <Card.Body>
                        <b style={{ color: "black" }}>
                          {viewUser.role || "User"}
                        </b>
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

      {/* Edit User Details */}
      {editUser && (
        <>
          <div className="management-container">
            <div className="management-header">
              <div className="user-info">
                <div className="user-text">
                  <span className="user-name">Admin Panel</span>
                  <span className="user-role">User Management</span>
                </div>
                <img
                  src="/user.png"
                  alt="User Avatar"
                  className="user-avatar"
                />
              </div>
            </div>

            {/* Edit User Form */}
            <div className="container mt-4">
              <div className="d-flex align-items-center mb-3">
                <button
                  className="btn btn-light me-2"
                  style={{
                    background: "black",
                    padding: "3px",
                    height: "36px",
                  }}
                  onClick={handleEditBack}
                >
                  <span
                    style={{
                      fontSize: "1.8rem",
                      position: "relative",
                      top: "-8px",
                      color: "white",
                    }}
                  >
                    <TiArrowLeft />
                  </span>
                </button>
                <h5 className="ms-1 mt-1" style={{ color: "black" }}>
                  Edit User
                </h5>
              </div>
              <div className="cardview">
                <div className="cornerbg">
                  <h6 className="mb-4" style={{ color: "black" }}>
                    User Details
                  </h6>
                  <div>
                    {/* Status indicator */}
                    {!editUser.is_approved ? (
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "row",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <MDBBadge pill className="failbg">
                          <span>
                            <GoDotFill className="dot" />
                          </span>
                          <span className="fraudtext">Unapproved</span>
                        </MDBBadge>
                      </div>
                    ) : (
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "row",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <MDBBadge pill className="successbg">
                          <span>
                            <GoDotFill className="dot" />
                          </span>
                          <span className="genuinetext">Approved</span>
                        </MDBBadge>
                      </div>
                    )}
                  </div>
                </div>

                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    const formData = new FormData(e.target);
                    const userData = {
                      username: formData.get("username") || undefined,
                      email: formData.get("email") || undefined,
                      phone: formData.get("phone") || undefined,
                      role: formData.get("role") || undefined,
                      is_approved: formData.get("is_approved") === "true",
                    };

                    // Remove undefined values
                    Object.keys(userData).forEach(
                      (key) =>
                        userData[key] === undefined && delete userData[key]
                    );

                    updateUserStatus(editUser.id, userData);
                  }}
                >
                  {/* 1st Row */}
                  <Row>
                    {/* Registration Date (readonly) */}
                    <Col sm={6} md={3} lg={3} className="mb-1">
                      <div className="h-100">
                        <Card.Body>
                          <Form.Label>Registration Date</Form.Label>
                          <InputGroup className="mb-1">
                            <Form.Control
                              style={{
                                paddingTop: "1.5rem",
                                paddingBottom: "1.5rem",
                                borderRadius: "14px",
                              }}
                              className="inputgrp"
                              readOnly
                              value={
                                editUser.createdAt
                                  ? new Date(
                                      editUser.createdAt
                                    ).toLocaleDateString()
                                  : "N/A"
                              }
                            />
                          </InputGroup>
                        </Card.Body>
                      </div>
                    </Col>
                    {/* Username */}
                    <Col sm={6} md={3} lg={3} className="mb-1">
                      <div className="h-100">
                        <Card.Body>
                          <Form.Label>Username</Form.Label>
                          <InputGroup className="mb-1">
                            <Form.Control
                              name="username"
                              style={{
                                paddingTop: "1.5rem",
                                paddingBottom: "1.5rem",
                                borderRadius: "14px",
                              }}
                              className="inputgrp"
                              defaultValue={
                                editUser.username ||
                                editUser.name ||
                                editUser.UserName ||
                                ""
                              }
                            />
                          </InputGroup>
                        </Card.Body>
                      </div>
                    </Col>
                  </Row>

                  {/* 2nd Row */}
                  <Row>
                    {/* Phone */}
                    <Col sm={6} md={3} lg={3} className="mb-1">
                      <div className="h-100">
                        <Card.Body>
                          <Form.Label className="mt-1">Phone Number</Form.Label>
                          <InputGroup className="mb-1">
                            <Form.Control
                              name="phone"
                              style={{
                                paddingTop: "1.5rem",
                                paddingBottom: "1.5rem",
                                borderRadius: "14px",
                              }}
                              className="inputgrp"
                              defaultValue={
                                editUser.phone ||
                                editUser.phoneNumber ||
                                editUser.mobileNumber ||
                                ""
                              }
                            />
                          </InputGroup>
                        </Card.Body>
                      </div>
                    </Col>
                    {/* Email */}
                    <Col sm={6} md={3} lg={3} className="mb-1">
                      <div className="h-100">
                        <Card.Body>
                          <Form.Label className="mt-1">
                            Email Address
                          </Form.Label>
                          <InputGroup className="mb-1">
                            <Form.Control
                              name="email"
                              style={{
                                paddingTop: "1.5rem",
                                paddingBottom: "1.5rem",
                                borderRadius: "14px",
                              }}
                              className="inputgrp"
                              defaultValue={
                                editUser.email || editUser.EmailAddress || ""
                              }
                            />
                          </InputGroup>
                        </Card.Body>
                      </div>
                    </Col>
                  </Row>

                  <Row>
                    {/* Role */}
                    <Col sm={6} md={3} lg={3} className="mb-1">
                      <div className="h-100">
                        <Card.Body>
                          <Form.Label>Role</Form.Label>
                          <Form.Select
                            name="role"
                            aria-label="Select role"
                            style={{
                              paddingTop: ".8rem",
                              paddingBottom: ".8rem",
                              borderRadius: "14px",
                            }}
                            defaultValue={editUser.role || "User"}
                          >
                            <option value="Admin">Admin</option>
                            <option value="User">User</option>
                          </Form.Select>
                        </Card.Body>
                      </div>
                    </Col>
                    {/* Status */}
                    <Col sm={6} md={3} lg={3} className="mb-1">
                      <div className="h-100">
                        <Card.Body>
                          <Form.Label>Status</Form.Label>
                          <Form.Select
                            name="is_approved"
                            aria-label="Select status"
                            style={{
                              paddingTop: ".8rem",
                              paddingBottom: ".8rem",
                              borderRadius: "14px",
                            }}
                            defaultValue={
                              editUser.is_approved ? "true" : "false"
                            }
                          >
                            <option value="true">Approved</option>
                            <option value="false">Unapproved</option>
                          </Form.Select>
                        </Card.Body>
                      </div>
                    </Col>
                  </Row>

                  <Row className="mt-3">
                    <Col sm={6} md={3} lg={3} className="mb-1">
                      <MDBBtn
                        type="submit"
                        style={{
                          width: "65%",
                          background:
                            "linear-gradient(90deg, #3B8BD0 0%, #2548C2 100%)",
                          color: "white",
                          textTransform: "none",
                          fontWeight: "500",
                          borderRadius: "8px",
                          padding: "12px 0",
                          fontSize: "14px",
                        }}
                        disabled={loading}
                      >
                        {loading ? <MDBSpinner size="sm" /> : "Update"}
                      </MDBBtn>
                    </Col>
                  </Row>
                </form>
              </div>
            </div>

            {/* Update Success Modal */}
            <MDBModal tabIndex="-1" open={updateModal} onClose={toggleUpdate}>
              <MDBModalDialog centered>
                <MDBModalContent>
                  <MDBModalBody>
                    <div style={{ float: "right" }}>
                      <span className="crossicon" onClick={toggleUpdate}>
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

                      <h4 className="mt-2" style={{ color: "black" }}>
                        Successfully!
                      </h4>

                      <h6 style={{ color: "black", fontWeight: "400" }}>
                        User has been updated successfully
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
                        onClick={handleEditBack}
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
  );
};

export default Management;
