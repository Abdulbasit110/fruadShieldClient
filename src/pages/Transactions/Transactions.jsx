import React, { useState } from "react";
// import "./dashboard.scss";
import { CiCreditCard1 } from "react-icons/ci";
import { GrGroup } from "react-icons/gr";
import { IoArrowForwardCircleOutline } from "react-icons/io5";
import { MDBBadge, MDBBtn, MDBTable, MDBTableHead, MDBTableBody, MDBInput } from 'mdb-react-ui-kit';
import "./transaction.scss"
import { GoDotFill } from "react-icons/go";
import { VscSettings } from "react-icons/vsc";
import Pagination from "../../components/Pagination";
import Form from 'react-bootstrap/Form';

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


const Transactions = () => {
  const [filter, setFilter] = useState("All");
  const [isSideBoxOpen, setIsSideBoxOpen] = useState(false);
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  
  const isContinueDisabled = !fromDate || !toDate;

  
  const toggleSideBox = () => {
    setIsSideBoxOpen(!isSideBoxOpen);
  };



  // Filtered transactions based on the button clicked
  const filteredTransactions =
    filter === "All"
      ? transactions
      : transactions.filter((txn) => txn.status === filter);


  return (
    <div className="transactions-container">
      <div className="transactions-header">
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
      <h3 style={{color: "black"}}>Customer Transactions</h3>

      {/* Statistic Boxes */}
      <div className="statistic-boxes">
        {/* Box 1 */}
        <div className="stat-box">
          <div className="icon-container orange">
            <CiCreditCard1 className="crediticon" />
          </div>
          <div className="stat-text">
            <h2>122</h2>
            <span>Total Transaction</span>
          </div>
        </div>

        {/* Box 2 */}
        <div className="stat-box">
          <div className="icon-container green">
            <GrGroup className="peopleicon" />
          </div>
          <div className="stat-text">
            <h2>122</h2>
            <span>Total Customers</span>
          </div>
        </div>

        {/* Box 3 */}
        <div className="stat-box">
          <div className="icon-container red">
            <IoArrowForwardCircleOutline className="arrowright" />
          </div>
          <div className="stat-text">
            <h2>122</h2>
            <span>High Risk Customer</span>
          </div>
        </div>
      </div>

      {/* Table */}
      <div style={{ display: "flex", justifyContent: "space-between", marginTop: "20px", alignItems: "center" }}>
        <div>
          <h5 style={{color: "black"}}>List of Transactions</h5>
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
          <button
            className="filter-button"
            style={{
              width: "40px",
              height: "40px",
              backgroundColor: "#FFFFFF",
              border: "none",
              borderRadius: "10px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
            }}
            onClick={toggleSideBox}
          >
            <VscSettings style={{ fontSize: "2rem" }} />
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
          className={`action-button ${filter === "Genuine" ? "active" : ""}`}
          onClick={() => setFilter("Genuine")}
        >
          Genuine Transaction
        </button>
        <button
          className={`action-button ${filter === "Fraudulent" ? "active" : ""}`}
          onClick={() => setFilter("Fraudulent")}
        >
          Fraudulent Transaction
        </button>
      </div>

      <div className="table-container">
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
      <div style={{marginTop: "10px",
    display: "flex",
    justifyContent: "flex-end"}}>
        <Pagination/>
      </div>


      {isSideBoxOpen && (
        <div
          className="side-box"
          
        >
          <div>
            <Form>
      <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
        <Form.Label style={{color: "black",
    fontWeight: "500",
    marginBottom: "4px"}}>From</Form.Label>
        <Form.Control type="date" placeholder="Choose a date" value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}/>
      </Form.Group>

      <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
        <Form.Label style={{color: "black",
    fontWeight: "500",
    marginBottom: "4px"}}>To</Form.Label>
        <Form.Control type="date" placeholder="Choose a date" value={toDate}
                onChange={(e) => setToDate(e.target.value)}/>
      </Form.Group>
      </Form>
          </div>
          
          {/* <button
            onClick={toggleSideBox}
            style={{ width: "100%", padding: "10px", backgroundColor: "#007bff", color: "#fff", border: "none", borderRadius: "5px", cursor: "pointer" }}
          >
            Apply Filters
          </button> */}

          <div style={{display: "flex", gap: "8px"}}>

          <MDBBtn
                  className="mb-4 px-5 mt-3"
                  size='lg'
                  style={{
                    background: 'none',
                    color: 'black',
                    borderRadius: '8px',
                    fontWeight: '400',
                    width: "60%",
                    boxShadow: "none",
                    border: "1px solid black"
                  }}
                  onClick={toggleSideBox}
                >
                  Cancel
                </MDBBtn>

          <MDBBtn
                  className="mb-4 px-5 mt-3"
                  size='lg'
                  style={{
                    background: 'linear-gradient(90deg, #3B8BD0 0%, #2548C2 100%)',
                    color: '#fff',
                    borderRadius: '8px',
                    fontWeight: '600',
                    width: "60%",
                    display: "flex",
                    justifyContent: "center"
                  }}
                  onClick={!isContinueDisabled ? toggleSideBox : undefined}
            disabled={isContinueDisabled}
                >
                <span>Continue</span>
                </MDBBtn>
          </div>

        
        </div>
      )}
    </div>
  )
}

export default Transactions
