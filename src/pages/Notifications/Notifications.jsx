import React, { useState, useEffect } from "react";
// import "./dashboard.scss";
import { CiCreditCard1 } from "react-icons/ci";
import { GrGroup } from "react-icons/gr";
import { IoArrowForwardCircleOutline } from "react-icons/io5";
import {
  MDBBadge,
  MDBBtn,
  MDBTable,
  MDBTableHead,
  MDBTableBody,
  MDBInput,
} from "mdb-react-ui-kit";
import "./notification.scss";
import { GoDotFill } from "react-icons/go";
import { VscSettings } from "react-icons/vsc";
import Pagination from "../../components/Pagination";
import Form from "react-bootstrap/Form";
import userService from "../../api/services/userService";

// Fallback data in case the API fails
const fallbackTransactions = Array.from({ length: 10 }, (_, index) => {
  const isFraudulent = index % 2 === 0; // Alternate between Fraudulent and Genuine
  return {
    id: `TXN-20231026-${String(index + 1).padStart(3, "0")}`,
    senderName: `Sender Name ${index + 1}`,
    mobileNumber: `+92 303 45${(67890 + index).toString().slice(-5)}`,
    amount: `PKR ${(Math.random() * 1000000 + 100000).toFixed(2)}`,
    status: isFraudulent ? "Fraudulent" : "Genuine",
    date: new Date(
      2024,
      1,
      Math.floor(Math.random() * 28) + 1
    ).toLocaleDateString("en-GB"),
  };
});

const Notifications = () => {
  const [filter, setFilter] = useState("All");
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    fetchNotifications();
  }, [filter, currentPage]);

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      // Add pagination and filtering parameters
      const params = {
        page: currentPage,
        limit: itemsPerPage,
        unreadOnly: filter === "Recent", // Use unreadOnly parameter for Recent filter
      };

      const response = await userService.getNotifications(params);
      console.log("API Response:", response);

      if (response) {
        setNotifications(response.notifications || []);
        setTotalPages(response.totalPages || 1);
      } else {
        // Fallback to mock data if the API response is empty or malformed
        setNotifications(fallbackTransactions);
        setTotalPages(Math.ceil(fallbackTransactions.length / itemsPerPage));
      }
      setError(null);
    } catch (err) {
      console.error("Error fetching notifications:", err);
      setError("Failed to fetch notifications. Using fallback data.");
      // Fallback to static data in case of error
      setNotifications(fallbackTransactions);
      setTotalPages(Math.ceil(fallbackTransactions.length / itemsPerPage));
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <div className="notification-container">
      <div className="notification-header">
        <div className="user-info">
          <div className="user-text">
            <span className="user-name">John Deo</span>
            <span className="user-role">Admin</span>
          </div>
          <img src="/user.png" alt="User Avatar" className="user-avatar" />
        </div>
      </div>
      <h3 style={{ color: "black" }}>Alerts & Notifications</h3>

      {/* Buttons */}
      <div className="buttons-container">
        <button
          className={`action-button ${filter === "All" ? "active" : ""}`}
          onClick={() => {
            setFilter("All");
            setCurrentPage(1);
          }}
        >
          All
        </button>
        <button
          className={`action-button ${filter === "Recent" ? "active" : ""}`}
          onClick={() => {
            setFilter("Recent");
            setCurrentPage(1);
          }}
        >
          Recent
        </button>
      </div>

      {/* Error message */}
      {error && (
        <div className="alert alert-warning" role="alert">
          {error}
        </div>
      )}

      {/* Loading indicator */}
      {loading ? (
        <div className="text-center my-4">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      ) : (
        <div className="table-container">
          <MDBTable align="middle" className="transactiontable">
            <MDBTableHead>
              <tr>
                <th scope="col">Transaction ID</th>
                <th scope="col">Sender Name</th>
                <th scope="col">Mobile Number</th>
                <th scope="col">Amount</th>
                <th scope="col">Status</th>
                <th scope="col">Date of High Alert</th>
              </tr>
            </MDBTableHead>
            <MDBTableBody>
              {notifications.length > 0 ? (
                notifications.map((notification) => (
                  <tr key={notification.id || notification._id}>
                    <td>
                      <p>{notification.transaction_id || notification.id}</p>
                    </td>
                    <td>
                      <p>
                        {notification.sender_name ||
                          "Sender Name" ||
                          notification.senderName}
                      </p>
                    </td>
                    <td>
                      <p>
                        {notification.mobile_number ||
                          "Mobile Numer" ||
                          notification.mobileNumber}
                      </p>
                    </td>
                    <td>
                      <p>{notification.amount || "Amount"}</p>
                    </td>
                    <td>
                      {notification.status === "Fraudulent" ||
                      notification.is_fraudulent ? (
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
                      <p>
                        {notification.date ||
                          new Date(
                            notification.created_at || notification.timestamp
                          ).toLocaleDateString("en-GB")}
                      </p>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="text-center py-4">
                    No notifications found
                  </td>
                </tr>
              )}
            </MDBTableBody>
          </MDBTable>
        </div>
      )}

      <div
        style={{
          marginTop: "10px",
          display: "flex",
          justifyContent: "flex-end",
        }}
      >
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      </div>
    </div>
  );
};

export default Notifications;
