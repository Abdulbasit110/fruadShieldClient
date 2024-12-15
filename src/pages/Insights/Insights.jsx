import React, { useState } from "react";
import { MDBTable, MDBTableHead, MDBTableBody, MDBInput, MDBCardText } from 'mdb-react-ui-kit';
import "./insights.scss"
import Pagination from "../../components/Pagination";
import { Card, Row, Col } from 'react-bootstrap';
import { TiArrowLeft } from "react-icons/ti";
import { CiUser } from "react-icons/ci";
import { TbTransactionYuan } from "react-icons/tb";
import { CgNotes } from "react-icons/cg";
import { HiOutlineClipboardDocumentCheck } from "react-icons/hi2";
import { FaRegUser } from "react-icons/fa";
import { MdShowChart } from "react-icons/md";
import { FaChartLine } from "react-icons/fa6";
import { GrLineChart } from "react-icons/gr";
import { AiOutlineDollarCircle } from "react-icons/ai";
import { RiExchangeDollarLine } from "react-icons/ri";
import { MdOutlineLineStyle } from "react-icons/md";
import { RiFlowChart } from "react-icons/ri";

// const insights = Array.from({ length: 50 }, (_, index) => {
//   const isFraudulent = index % 2 === 0; // Alternate between Fraudulent and Genuine
//   return {
//     id: `TXN-20231026-${String(index + 1).padStart(3, "0")}`,
//     // transactionId: `TXN-20231026-${(index + 1).toString().padStart(3, "0")}`,
//     senderClientId: `1234${index + 1}`,
//     senderName: `Sender Name ${index + 1}`,
//     mobileNumber: `+92 303 45${(67890 + index).toString().slice(-5)}`,
//     amount: `PKR ${(Math.random() * 1000000 + 100000).toFixed(2)}`,
//     status: isFraudulent ? "Fraudulent" : "Genuine",
//     date: new Date(2024, 1, Math.floor(Math.random() * 28) + 1).toLocaleDateString("en-GB"),
//   };
// });

const insights = Array.from({ length: 50 }, (_, index) => {
  return {
    srNo: index,
    agentRecode: "39028",
    totalTrx: "8362",
    totalBeneficiaries: "4507",
    totalPaidOutTrx: "8100",
    avgTopDailyTrx: "84.8",
    sdTop5Trx: "0.0",
  };
});


const Insights = () => {
  const [selectedTransaction, setSelectedTransaction] = useState(null);

  // Function to handle "View Details" click
  const handleViewDetails = (transaction) => {
    setSelectedTransaction(transaction);
  };

  // Function to go back to the main table
  const handleBack = () => {
    setSelectedTransaction(null);
  };


  return (
    <div className="insights-container">
      <div className="insights-header">
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
      {!selectedTransaction && (
        <>
          <h3 style={{color:"black"}}>ML Algorithm Insights</h3>


          <div style={{ display: "flex", justifyContent: "space-between", marginTop: "20px", alignItems: "center" }}>
            <div>
              <h5 style={{color:"black"}}>List of ML Algorithm</h5>
            </div>
            <div
              className="search-container"
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                marginBottom: "8px"
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
            </div>
          </div>
        </>
      )}


      {/* Conditionally render based on selection */}
      {!selectedTransaction ? (
        // Table View
        <div>
          <div className="table-container">
            <MDBTable align="middle" className="transactiontable">
              <MDBTableHead>
                <tr>
                  <th scope="col">Sr. No</th>
                  <th scope="col">Agent Recode</th>
                  <th scope="col">Total Trx</th>
                  <th scope="col">Total Beneficiaries</th>
                  <th scope="col">Total Paid out Trx</th>
                  <th scope="col">Avg Top 05 Daily Trx</th>
                  <th scope="col">SD of Top 5 Trx</th>
                  <th scope="col">Actions</th>
                </tr>
              </MDBTableHead>
              <MDBTableBody>
                {insights.map((transaction) => (
                  <tr key={transaction.srNo}>
                    <td>{transaction.srNo}</td>
                    <td>{transaction.agentRecode}</td>
                    <td>{transaction.totalTrx}</td>
                    <td>{transaction.totalBeneficiaries}</td>
                    <td>{transaction.totalPaidOutTrx}</td>
                    <td>{transaction.avgTopDailyTrx}</td>
                    <td>{transaction.sdTop5Trx}</td>
                    <td>
                      <MDBCardText
                        className="viewtext"
                        size="sm"
                        onClick={() => handleViewDetails(transaction)}
                        style={{ color: "#4285F4" }}
                      >
                        View Details
                      </MDBCardText>
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
        </div>
      ) : (
        // Detail View
        <>
          <div className="container mt-4">
            <div className="d-flex align-items-center mb-3">
              <button className="btn btn-light me-2"
                style={{
                  background: "black",
                  padding: "3px",
                  height: "36px"
                }}
                onClick={handleBack}
              ><span style={{ fontSize: "1.8rem", position: "relative", top: "-8px", color: "white" }}><TiArrowLeft /></span></button>
              <h5 className="ms-1 mt-1" style={{ color: "black" }}>ML Algo Details</h5>
            </div>
            <div className="bg-light p-4 rounded">
              <h6 className="mb-4" style={{ color: "black" }}>ML Entity Details</h6>
              {/* 1st Row */}
              <Row>
                {/* 1st Col */}
                <Col sm={6} md={4} lg={3} className="mb-3">
                  <Card className="h-100 shadow-sm text-center">
                    <Card.Body>
                      <div className="text-primary mb-1" style={{ fontSize: '1.5rem' }}>
                        <FaRegUser />
                      </div>
                      <div>
                        <h6 style={{ color: "black",marginBottom: "2px !important" }}>{selectedTransaction.agentRecode}</h6>
                        <p className="small mb-0">Client ID</p>
                      </div>
                    </Card.Body>
                  </Card>
                </Col>
                <Col sm={6} md={4} lg={3} className="mb-3">
                  <Card className="h-100 shadow-sm text-center">
                    <Card.Body>
                      <div className="text-primary mb-1" style={{ fontSize: '1.5rem' }}>
                        <TbTransactionYuan />
                      </div>
                      <div>
                        <h6 style={{ color: "black",marginBottom: "2px !important" }}>{selectedTransaction.totalTrx}</h6>
                        <p className="small mb-0">Total Beneficiaries</p>

                      </div>
                    </Card.Body>
                  </Card>
                </Col>
                <Col sm={6} md={4} lg={3} className="mb-3">
                  <Card className="h-100 shadow-sm text-center">
                    <Card.Body>
                      <div className="text-primary mb-1" style={{ fontSize: '1.5rem' }}>
                        <RiFlowChart />
                      </div>
                      <div>
                        <h6 style={{ color: "black",marginBottom: "2px !important" }}>{selectedTransaction.totalBeneficiaries}</h6>
                        <p className="small mb-0">Total Beneficiaries</p>

                      </div>
                    </Card.Body>
                  </Card>
                </Col>
                <Col sm={6} md={4} lg={3} className="mb-3">
                  <Card className="h-100 shadow-sm text-center">
                  <Card.Body>
                      <div className="text-primary mb-1" style={{ fontSize: '1.5rem' }}>
                        <CgNotes />
                      </div>
                      <div>
                        <h6 style={{ color: "black",marginBottom: "2px !important" }}>[92, 89, 84, 80, 79]</h6>
                        <p className="small mb-0">Top 05 Transactions of the Journey </p>
                      </div>

                    </Card.Body>
                  </Card>
                </Col>
              </Row>

              {/* 2nd Row */}
              <Row>
                {/* 1st Col */}
                <Col sm={6} md={4} lg={3} className="mb-3">
                  <Card className="h-100 shadow-sm text-center">
                    <Card.Body>
                      <div className="text-primary mb-1" style={{ fontSize: '1.5rem' }}>
                        <AiOutlineDollarCircle />
                      </div>
                      <div>
                        <h6 style={{ color: "black",marginBottom: "2px !important" }}>{selectedTransaction.totalPaidOutTrx}</h6>
                        <p className="small mb-0">Total Paid Out Transactions</p>

                      </div>
                    </Card.Body>
                  </Card>
                </Col>
                <Col sm={6} md={4} lg={3} className="mb-3">
                  <Card className="h-100 shadow-sm text-center">
                  <Card.Body>
                      <div className="text-primary mb-1" style={{ fontSize: '1.5rem' }}>
                      <RiExchangeDollarLine />
                      </div>
                      <div>
                        <h6 style={{ color: "black",marginBottom: "2px !important" }}>{selectedTransaction.avgTopDailyTrx}</h6>
                        <p className="small mb-0">Average of Transactional Journey</p>
                      </div>

                    </Card.Body>
                  </Card>
                </Col>
                <Col sm={6} md={4} lg={3} className="mb-3">
                  <Card className="h-100 shadow-sm text-center">
                    <Card.Body>
                      <div className="text-primary mb-1" style={{ fontSize: '1.5rem' }}>
                        <HiOutlineClipboardDocumentCheck />
                      </div>
                      <div>
                        <h6 style={{ color: "black",marginBottom: "2px !important" }}>{selectedTransaction.sdTop5Trx}</h6>
                        <p className="small mb-0">Fraud Score</p>

                      </div>
                    </Card.Body>
                  </Card>
                </Col>
              </Row>

              {/* 3rd Row */}
              <Row>
                <Col sm={6} md={4} lg={3} className="mb-3">
                  <Card className="h-100 shadow-sm text-center">
                  <Card.Body>
                      <div className="text-primary mb-1" style={{ fontSize: '1.5rem' }}>
                        <FaChartLine />
                      </div>
                      <div>
                        <h6 style={{ color: "black",marginBottom: "2px !important" }}>35393.06</h6>
                        <p className="small mb-0">Average Highest Transactional Volumes</p>
                      </div>
                  </Card.Body>
                </Card>
              </Col>
              <Col sm={6} md={4} lg={3} className="mb-3">
                <Card className="h-100 shadow-sm text-center">
                  <Card.Body>
                  <div className="text-primary mb-1" style={{ fontSize: '1.5rem' }}>
                      <MdOutlineLineStyle />
                    </div>
                    <div>
                      <h6 style={{ color: "black",marginBottom: "2px !important" }}>48,989795</h6>
                      <p className="small mb-0">Volume Matrix for Fraud Score</p>
                    </div>
                   
                  </Card.Body>
                </Card>
              </Col>
            </Row>

            {/* 4th row - last */}
            <Col sm={12} md={8} lg={6} className="mb-3">
              <Card className="h-100 shadow-sm text-center">
              <Card.Body>
              <div className="text-primary mb-1" style={{ fontSize: '1.5rem' }}>
                    <GrLineChart />
                  </div>  
                  <div>
                    <h6 style={{ color: "black", marginBottom: "2px !important" }}>[45116.76, 33662.93, 33611.93, 33272.86, 313300...]</h6>
                    <p className="small mb-0">Five Highest Volume  of Transaction Journey</p>
                  </div>
              </Card.Body>
            </Card>
          </Col>
        </div>
    </div>
        </>
      )}
    </div>
  )
}

export default Insights
