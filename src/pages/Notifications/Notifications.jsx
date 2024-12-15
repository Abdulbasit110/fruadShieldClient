import React, { useState } from "react";
// import "./dashboard.scss";
import { CiCreditCard1 } from "react-icons/ci";
import { GrGroup } from "react-icons/gr";
import { IoArrowForwardCircleOutline } from "react-icons/io5";
import { MDBBadge, MDBBtn, MDBTable, MDBTableHead, MDBTableBody, MDBInput } from 'mdb-react-ui-kit';
import "./notification.scss"
import { GoDotFill } from "react-icons/go";
import { VscSettings } from "react-icons/vsc";
import Pagination from "../../components/Pagination";
import Form from 'react-bootstrap/Form';

const transactions = Array.from({ length: 50 }, (_, index) => {
  const isFraudulent = index % 2 === 0; // Alternate between Fraudulent and Genuine
  return {
    id: `TXN-20231026-${String(index + 1).padStart(3, "0")}`,
    senderName: `Sender Name ${index + 1}`,
    mobileNumber: `+92 303 45${(67890 + index).toString().slice(-5)}`,
    amount: `PKR ${(Math.random() * 1000000 + 100000).toFixed(2)}`,
    status: isFraudulent ? "Fraudulent" : "Genuine",
    date: new Date(2024, 1, Math.floor(Math.random() * 28) + 1).toLocaleDateString("en-GB"),
  };
});


const Notifications = () => {
  const [filter, setFilter] = useState("All");

  return (
    <div className="notification-container">
      <div className="notification-header">
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
      <h3 style={{color: "black"}}>Alerts & Notifications</h3>     

      {/* Table */}
      <div className="buttons-container">
        <button
          className={`action-button ${filter === "All" ? "active" : ""}`}
          onClick={() => setFilter("All")}
        >
          All
        </button>
        <button
          className={`action-button ${filter === "Recent" ? "active" : ""}`}
          onClick={() => setFilter("Recent")}
        >
          Recent
        </button>
      </div>

      <div className="table-container">
        <MDBTable align='middle' className="transactiontable">
          <MDBTableHead>
            <tr>
              <th scope='col'>Transaction ID</th>
              <th scope='col'>Sender Name</th>
              <th scope='col'>Mobile Number</th>
              <th scope='col'>Amount</th>
              <th scope='col'>Status</th>
              <th scope='col'>Date of High Alert</th>
            </tr>
          </MDBTableHead>
          <MDBTableBody>
            {transactions.map((transaction) => (
              <tr key={transaction.id}>
                <td>
                  <p>{transaction.id}</p>
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
      <div style={{marginTop: "10px",
    display: "flex",
    justifyContent: "flex-end"}}>
        <Pagination/>
      </div>
    </div>
  )
}

export default Notifications
