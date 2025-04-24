import React, { useState, useEffect } from "react";
import {
  MDBTable,
  MDBTableHead,
  MDBTableBody,
  MDBInput,
  MDBCardText,
} from "mdb-react-ui-kit";
import "./insights.scss";
import Pagination from "../../components/Pagination";
import { Card, Row, Col } from "react-bootstrap";
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
import transactionService from "../../api/services/transactionService";

// Remove the static insights data, we'll use the API data instead
// const insights = Array.from({ length: 50 }, (_, index) => {
//   return {
//     srNo: index,
//     agentRecode: "39028",
//     totalTrx: "8362",
//     totalBeneficiaries: "4507",
//     totalPaidOutTrx: "8100",
//     avgTopDailyTrx: "84.8",
//     sdTop5Trx: "0.0",
//   };
// });

const Insights = () => {
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [senderFeatures, setSenderFeatures] = useState({ features: [] });
  const [selectedSenderFeature, setSelectedSenderFeature] = useState(null);
  const [loading, setLoading] = useState(false);

  // Fetch all sender features when component mounts
  useEffect(() => {
    const fetchSenderFeatures = async () => {
      setLoading(true);
      try {
        const response = await transactionService.getSenderFeatures();
        console.log("All sender features", response.features);
        if (response) {
          setSenderFeatures(response);
        }
      } catch (error) {
        console.error("Error fetching sender features:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSenderFeatures();
  }, []);

  // Function to fetch sender feature by ID
  const fetchSenderFeatureById = async (senderId) => {
    setLoading(true);
    try {
      const response = await transactionService.getSenderFeatureById(senderId);
      console.log(`Sender feature for ID ${senderId}:`, response);
      if (response) {
        setSelectedSenderFeature(response);
      }
    } catch (error) {
      console.error(`Error fetching sender feature for ID ${senderId}:`, error);
    } finally {
      setLoading(false);
    }
  };

  // Function to handle "View Details" click
  const handleViewDetails = async (transaction) => {
    setSelectedTransaction(transaction);
    // If agent code exists, fetch the specific sender feature
    if (transaction) {
      await fetchSenderFeatureById(transaction.sender_id);
    }
  };

  // Function to go back to the main table
  const handleBack = () => {
    setSelectedTransaction(null);
    setSelectedSenderFeature(null);
  };

  return (
    <div className="insights-container">
      <div className="insights-header">
        <div className="user-info">
          <div className="user-text">
            {/* <span className="user-name">John Deo</span>
            <span className="user-role">Admin</span> */}
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
          <h3 style={{ color: "black" }}>ML Algorithm Insights</h3>

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginTop: "20px",
              alignItems: "center",
            }}
          >
            <div>
              <h5 style={{ color: "black" }}>List of ML Algorithm</h5>
            </div>
            <div
              className="search-container"
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                marginBottom: "8px",
              }}
            >
              <div>
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
                    marginLife: "10px",
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
                  <th scope="col">Agent Repcode</th>
                  <th scope="col">Total Trx</th>
                  <th scope="col">Total Beneficiaries</th>
                  <th scope="col">Total Paid out Trx</th>
                  <th scope="col">Avg Top 05 Daily Trx</th>
                  <th scope="col">SD of Top 5 Trx</th>
                  <th scope="col">Actions</th>
                </tr>
              </MDBTableHead>
              <MDBTableBody>
                {senderFeatures.features.map((transaction) => (
                  <tr key={transaction.sender_id}>
                    <td>{transaction.sender_id}</td>
                    <td>{transaction["Length of Seq"]}</td>
                    <td>{transaction["Total Trx"]}</td>
                    <td>{transaction["Total Beneficiaries"]}</td>
                    <td>{transaction["Total Paid out Trx"]}</td>
                    <td>{transaction["Avg Top 05 Daily Trx"]}</td>
                    <td>{transaction["SD Trx Vol"].toFixed(2)}</td>
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
          <div
            style={{
              marginTop: "10px",
              display: "flex",
              justifyContent: "flex-end",
            }}
          >
            <Pagination />
          </div>
        </div>
      ) : (
        // Detail View
        <>
          <div className="container mt-4">
            <div className="d-flex align-items-center mb-3">
              <button
                className="btn btn-light me-2"
                style={{
                  background: "black",
                  padding: "3px",
                  height: "36px",
                }}
                onClick={handleBack}
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
                ML Algo Details
              </h5>
            </div>
            <div className="bg-light p-4 rounded">
              <h6 className="mb-4" style={{ color: "black" }}>
                ML Entity Details
              </h6>
              {/* 1st Row */}
              <Row>
                {/* 1st Col */}
                <Col sm={6} md={4} lg={3} className="mb-3">
                  <Card className="h-100 shadow-sm text-center">
                    <Card.Body>
                      <div
                        className="text-primary mb-1"
                        style={{ fontSize: "1.5rem" }}
                      >
                        <FaRegUser />
                      </div>
                      <div>
                        <h6
                          style={{
                            color: "black",
                            marginBottom: "2px !important",
                          }}
                        >
                          {selectedTransaction.sender_id}
                        </h6>
                        <p className="small mb-0">Client ID</p>
                      </div>
                    </Card.Body>
                  </Card>
                </Col>
                <Col sm={6} md={4} lg={3} className="mb-3">
                  <Card className="h-100 shadow-sm text-center">
                    <Card.Body>
                      <div
                        className="text-primary mb-1"
                        style={{ fontSize: "1.5rem" }}
                      >
                        <TbTransactionYuan />
                      </div>
                      <div>
                        <h6
                          style={{
                            color: "black",
                            marginBottom: "2px !important",
                          }}
                        >
                          {selectedTransaction["Total Trx"]}
                        </h6>
                        <p className="small mb-0">Total Transaction</p>
                      </div>
                    </Card.Body>
                  </Card>
                </Col>
                <Col sm={6} md={4} lg={3} className="mb-3">
                  <Card className="h-100 shadow-sm text-center">
                    <Card.Body>
                      <div
                        className="text-primary mb-1"
                        style={{ fontSize: "1.5rem" }}
                      >
                        <RiFlowChart />
                      </div>
                      <div>
                        <h6
                          style={{
                            color: "black",
                            marginBottom: "2px !important",
                          }}
                        >
                          {selectedTransaction["Total Beneficiaries"]}
                        </h6>
                        <p className="small mb-0">Total Beneficiaries</p>
                      </div>
                    </Card.Body>
                  </Card>
                </Col>
                <Col sm={6} md={4} lg={3} className="mb-3">
                  <Card className="h-100 shadow-sm text-center">
                    <Card.Body>
                      <div
                        className="text-primary mb-1"
                        style={{ fontSize: "1.5rem" }}
                      >
                        <CgNotes />
                      </div>
                      <div>
                        <h6
                          style={{
                            color: "black",
                            marginBottom: "2px !important",
                          }}
                        >
                          {selectedTransaction["Avg Top 05 Daily Trx"]}
                        </h6>
                        <p className="small mb-0">
                          Top 05 Transactions of the Journey{" "}
                        </p>
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
                      <div
                        className="text-primary mb-1"
                        style={{ fontSize: "1.5rem" }}
                      >
                        <AiOutlineDollarCircle />
                      </div>
                      <div>
                        <h6
                          style={{
                            color: "black",
                            marginBottom: "2px !important",
                          }}
                        >
                          {selectedTransaction["Total Paid out Trx"]}
                        </h6>
                        <p className="small mb-0">
                          Total Paid Out Transactions
                        </p>
                      </div>
                    </Card.Body>
                  </Card>
                </Col>
                <Col sm={6} md={4} lg={3} className="mb-3">
                  <Card className="h-100 shadow-sm text-center">
                    <Card.Body>
                      <div
                        className="text-primary mb-1"
                        style={{ fontSize: "1.5rem" }}
                      >
                        <RiExchangeDollarLine />
                      </div>
                      <div>
                        <h6
                          style={{
                            color: "black",
                            marginBottom: "2px !important",
                          }}
                        >
                          {selectedTransaction["Avg top Volumes"]}
                        </h6>
                        <p className="small mb-0">
                          Average of Transactional Journey
                        </p>
                      </div>
                    </Card.Body>
                  </Card>
                </Col>
                <Col sm={6} md={4} lg={3} className="mb-3">
                  <Card className="h-100 shadow-sm text-center">
                    <Card.Body>
                      <div
                        className="text-primary mb-1"
                        style={{ fontSize: "1.5rem" }}
                      >
                        <HiOutlineClipboardDocumentCheck />
                      </div>
                      <div>
                        <h6
                          style={{
                            color: "black",
                            marginBottom: "2px !important",
                          }}
                        >
                          {selectedTransaction["SD Trx Diff"].toFixed(2)}
                        </h6>
                        <p className="small mb-0">Transaction Difference</p>
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
                      <div
                        className="text-primary mb-1"
                        style={{ fontSize: "1.5rem" }}
                      >
                        <FaChartLine />
                      </div>
                      <div>
                        <h6
                          style={{
                            color: "black",
                            marginBottom: "2px !important",
                          }}
                        >
                          {selectedTransaction["Length of Seq"]}
                        </h6>
                        <p className="small mb-0">
                          Average Highest Transactional Volumes
                        </p>
                      </div>
                    </Card.Body>
                  </Card>
                </Col>
                <Col sm={6} md={4} lg={3} className="mb-3">
                  <Card className="h-100 shadow-sm text-center">
                    <Card.Body>
                      <div
                        className="text-primary mb-1"
                        style={{ fontSize: "1.5rem" }}
                      >
                        <MdOutlineLineStyle />
                      </div>
                      <div>
                        <h6
                          style={{
                            color: "black",
                            marginBottom: "2px !important",
                          }}
                        >
                          {selectedTransaction["SD Trx Vol"].toFixed(2)}
                        </h6>
                        <p className="small mb-0">
                          Volume Matrix for Fraud Score
                        </p>
                      </div>
                    </Card.Body>
                  </Card>
                </Col>
              </Row>

              {/* 4th row - last */}
              {/* <Col sm={12} md={8} lg={6} className="mb-3">
                <Card className="h-100 shadow-sm text-center">
                  <Card.Body>
                    <div
                      className="text-primary mb-1"
                      style={{ fontSize: "1.5rem" }}
                    >
                      <GrLineChart />
                    </div>
                    <div>
                      <h6
                        style={{
                          color: "black",
                          marginBottom: "2px !important",
                        }}
                      >
                        [45116.76, 33662.93, 33611.93, 33272.86, 313300...]
                      </h6>
                      <p className="small mb-0">
                        Five Highest Volume of Transaction Journey
                      </p>
                    </div>
                  </Card.Body>
                </Card>
              </Col> */}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Insights;
