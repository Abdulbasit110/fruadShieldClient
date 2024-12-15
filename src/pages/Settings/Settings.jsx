import React, { useState } from "react";
import { MDBBadge, MDBBtn, MDBTable, MDBTableHead, MDBTableBody, MDBInput } from 'mdb-react-ui-kit';
import { GoDotFill } from "react-icons/go";
import Pagination from "../../components/Pagination";
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import { Card, Row, Col } from 'react-bootstrap';
import "./settings.scss"
import { FaArrowLeft } from "react-icons/fa";
import { FaArrowRight } from "react-icons/fa";

const transactions = Array.from({ length: 50 }, (_, index) => {
  const isFraudulent = index % 2 === 0; // Alternate between Fraudulent and Genuine
  return {
    id: `TXN-20231026-${String(index + 1).padStart(3, "0")}`,
    // transactionId: `TXN-20231026-${(index + 1).toString().padStart(3, "0")}`,
    senderClientId: `1234${index + 1}`,
    senderName: `Sender Name ${index + 1}`,
    mobileNumber: `+92 303 45${(67890 + index).toString().slice(-5)}`,
    amount: `PKR ${(Math.random() * 1000000 + 100000).toFixed(2)}`,
    status: isFraudulent ? "Fraudulent" : "Genuine",
    date: new Date(2024, 1, Math.floor(Math.random() * 28) + 1).toLocaleDateString("en-GB"),
  };
});

const Settings = () => {
  const [displayTable, setDisplayTable] = useState(false)
  const [filter, setFilter] = useState("Thresholds");
  const [startingDate, setStartingDate] = useState("");
  const [endingDate, setEndingDate] = useState("");

  const isSubmitDisabled = !startingDate || !endingDate;

  // const filteredTransactions =
  //   filter === "Thresholds"
  //     ? transactions
  //     : transactions.filter((txn) => txn.status === filter);

  const filteredTransactions = transactions.filter((txn) => {
    const txnDate = new Date(txn.date.split("/").reverse().join("-")); // Convert DD/MM/YYYY to YYYY-MM-DD
    const startDate = new Date(startingDate);
    const endDate = new Date(endingDate);

    // Include transactions that match the filter and lie within the date range
    return (
      (filter === "Thresholds") &&
      txnDate >= startDate &&
      txnDate <= endDate
    );
  });


  const handleOpenTable = () => {
    setDisplayTable(true)
  }

  const [selectedRole, setSelectedRole] = useState("");
  const [isCheckboxChecked, setIsCheckboxChecked] = useState(false);
  const [selectedEmail, setSelectedEmail] = useState("");

  const handleRoleChange = (event) => {
    setSelectedRole(event.target.value);
  };
  const handleEmailChange = (event) => {
    setSelectedEmail(event.target.value);
  };


  const handleCheckboxChange = (event) => {
    setIsCheckboxChecked(event.target.checked);
  };

  const isSaveDisabled = !selectedRole || !isCheckboxChecked;

  return (
    <div className="settings-container">
      <div className="settings-header">
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
      <h3 style={{ color: "black" }}>Settings</h3>

      <div className="buttons-container">
        <button
          className={`action-button ${filter === "Thresholds" ? "active" : ""}`}
          onClick={() => setFilter("Thresholds")}
        >
          Thresholds
        </button>
        <button
          className={`action-button ${filter === "Privileges" ? "active" : ""}`}
          onClick={() => setFilter("Privileges")}
        >
          Privileges
        </button>
      </div>

      {filter == "Thresholds" ? (<>

        {/* View Card */}
        <div className="container mt-4">
          <div className="cardview">
            <div className="cornerbg">
              <h6 className="mb-4" style={{ color: "black" }}>Thresholds</h6>
            </div>

            <Row>
              {/* 1st Col */}
              <Col sm={6} md={3} lg={3} className="mb-1">
                <div className="h-100">
                  <Card.Body>
                    <Form.Label>Starting Date</Form.Label>
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
                        type="date"
                        value={startingDate}
                        onChange={(e) => setStartingDate(e.target.value)}
                      />
                    </InputGroup>
                  </Card.Body>
                </div>
              </Col>
              <Col sm={6} md={3} lg={3} className="mb-1">
                <div className="h-100">
                  <Card.Body>
                    <Form.Label>Ending Date</Form.Label>
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
                        type="date"
                        aria-describedby="basic-addon2"
                        value={endingDate}
                        onChange={(e) => setEndingDate(e.target.value)}
                      />
                    </InputGroup>
                  </Card.Body>
                </div>
              </Col>
            </Row>
            <Row>
              <Col sm={6} md={3} lg={3} className="mb-1">
                <div className="h-100">
                  <Card.Body>
                    <Form.Label>Spiking Duration</Form.Label>
                    <Form.Select aria-label="Default select example" style={{
                      paddingTop: ".8rem",
                      paddingBottom: ".8rem",
                      borderRadius: "14px"
                    }}>
                      <option value=""disabled>Select Spiking Duration</option> 
                      <option value="1">1</option>
                      <option value="2">2</option>
                      <option value="3">3</option>
                      <option value="4">4</option>
                      {/* <option value="2">{editUser.role == "User" : 'Admin '} Admin</option> */}
                    </Form.Select>
                  </Card.Body>
                </div>
              </Col>
              <Col sm={6} md={3} lg={3} className="mb-1">
                <div className="h-100">
                  <Card.Body>
                    <Form.Label>Average Permissible Transaction</Form.Label>
                    <InputGroup className="mb-1">
                      <Form.Control
                        style={{
                          paddingTop: "1.5rem",
                          paddingBottom: "1.5rem",
                          borderRadius: "14px"
                        }}
                        className="inputgrp"
                        placeholder="Enter Value in Integer or Float"
                        aria-label=""
                        aria-describedby="basic-addon2"
                      />
                    </InputGroup>
                  </Card.Body>
                </div>
              </Col>
            </Row>


            <Row className="mt-3">
              <Col sm={6} md={3} lg={3} className="mb-1">
                <MDBBtn
                  onClick={handleOpenTable}
                  disabled={isSubmitDisabled}
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
                  Submit
                </MDBBtn>
              </Col>
            </Row>
          </div>
        </div>
        {displayTable && <>
          {/* Table */}
          <div className="table-container mt-3">
            <MDBTable align='middle' className="transactiontable">
              <MDBTableHead>
                <tr>
                  <th scope='col'>Transaction ID</th>
                  <th scope='col'>Sender Client ID</th>
                  <th scope='col'>Sender Name</th>
                  <th scope='col'>Mobile Number</th>
                  <th scope='col'>Amount</th>
                  <th scope='col'>Status</th>
                  <th scope='col'>Date</th>
                </tr>
              </MDBTableHead>
              <MDBTableBody>
                {filteredTransactions.map((transaction) => (
                  <tr key={transaction.id}>
                    <td>
                      <p>{transaction.id}</p>
                    </td>
                    <td>
                      <p>{transaction.senderClientId}</p>
                    </td>
                    <td>
                      <p>{transaction.senderName}</p>
                    </td>
                    <td>
                      <p>{transaction.mobileNumber}</p>
                    </td>
                    <td>
                      <p>{transaction.amount}</p>
                    </td>
                    <td>
                      {transaction.status === "Fraudulent" ? (
                        <MDBBadge pill className="failbg">
                          <span>
                            <GoDotFill className="dot" />
                          </span>
                          <span className="fraudtext">Fraudulent</span>
                        </MDBBadge>
                      ) : (
                        <MDBBadge pill className="successbg">
                          <span>
                            <GoDotFill className="dot" />
                          </span>
                          <span className="genuinetext">Genuine</span>
                        </MDBBadge>
                      )}
                    </td>
                    <td>
                      <p>{transaction.date}</p>
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
        </>}
      </>)

        :

        (<>
          <div className="container mt-4">
            <div className="cardview">
              <div className="privbg">
                <h6 style={{ color: "black" }}>Permission & Privilege's</h6>
                <p className="mb-3" style={{ color: "black", fontSize: "13px", marginTop: "-9px" }}>Here’s a quick overview of essential details to get you started with the fundamentals.</p>
              </div>

              <Row>
                <Col sm={6} md={3} lg={3} className="mb-1">
                  <div className="h-100">
                    <Card.Body>
                      <Form.Label>Role</Form.Label>
                      <Form.Select aria-label="Default select example" value={selectedRole}
                onChange={handleRoleChange}>
                        <option>Select Role</option>
                        <option value="1">User</option>
                        <option value="2">Admin</option>
                      </Form.Select>
                    </Card.Body>
                  </div>
                </Col>
                <Col sm={6} md={3} lg={3} className="mb-1">
                  <div className="h-100">
                    <Card.Body>
                      <Form.Label>Email Address</Form.Label>
                      <InputGroup className="mb-1">
                        <Form.Control
                          placeholder="Enter Email"
                          aria-label="Enter Email"
                          aria-describedby="basic-addon2"
                          value={selectedEmail}
                          onChange={handleEmailChange}
                          style={{paddingTop: "1.2rem !important",
                            paddingBottom: "1.2rem !important"}}
                        />
                      </InputGroup>
                    </Card.Body>
                  </div>
                </Col>
              </Row>
              {/* Display permissions */}
              <div
                className="permission-container mt-4"
                style={{
                  
                  borderRadius: "8px",
                  padding: "16px",
                  backgroundColor: "#F6F9FF",
                }}
              >
                <table className="table priv" style={{borderColor: "transparent"}}>
                  <thead style={{background: "white"}}>
                    <tr>
                      <th style={{borderBottomLeftRadius: "14px"}}>Features</th>
                      <th style={{background: "#274EC3", borderBottomLeftRadius: "14px", borderTopLeftRadius: "14px", width: "1%"}}>
                      <FaArrowLeft style={{ color: "white", fontSize: "1rem"}}/>
                      </th>
                      <th>View</th>
                      <th>Edit</th>
                      <th>Create</th>
                      <th>Active/Deactivate</th>
                      <th>Accept/Reject</th>
                      <th style={{borderBottomRightRadius: "14px", background: "#274EC3", width: "1%"}}>
                      <FaArrowRight style={{ color: "white", fontSize: "1rem"}}/>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>Manage Users</td>
                      <td></td>
                      <td>
                        <input type="checkbox"  onChange={handleCheckboxChange}/>
                      </td>
                      <td>
                        <input type="checkbox"  onChange={handleCheckboxChange}/>
                      </td>
                      <td>
                        <input type="checkbox"  onChange={handleCheckboxChange}/>
                      </td>
                      <td>
                        <input type="checkbox"  onChange={handleCheckboxChange}/>
                      </td>
                      <td>
                        <input type="checkbox"  onChange={handleCheckboxChange}/>
                      </td>
                    </tr>
                  </tbody>
                </table>
                <MDBBtn
                      style={{
                        width: "12%",
                        background: 'linear-gradient(90deg, #3B8BD0 0%, #2548C2 100%)',
                        color: "white",
                        textTransform: "none",
                        fontWeight: "500",
                        borderRadius: "8px",
                        padding: "12px 0",
                        fontSize: "14px",
                        marginTop:"10px"
                      }}
                      disabled={isSaveDisabled}
                      >
                      Save
                </MDBBtn>
              </div>
            </div>
          </div>
        </>)}
    </div>
  )
}

export default Settings
