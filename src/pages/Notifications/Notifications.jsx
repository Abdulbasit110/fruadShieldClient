import React, { useState, useEffect } from "react";
// import "./dashboard.scss";
import { CiCreditCard1 } from "react-icons/ci";
import { GrGroup } from "react-icons/gr";
import { IoArrowForwardCircleOutline, IoRefreshOutline } from "react-icons/io5";
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
const fallbackTransactions = Array.from({ length: 15 }, (_, index) => {
  const statusOptions = ["Fraudulent", "Suspicious"];
  const status = statusOptions[index % 2]; // Alternate between Fraudulent and Suspicious
  return {
    id: `TXN-20241026-${String(index + 1).padStart(3, "0")}`,
    transaction_id: `TXN-20241026-${String(index + 1).padStart(3, "0")}`,
    sender_name: `Sender Name ${index + 1}`,
    senderName: `Sender Name ${index + 1}`,
    mobile_number: `+92 303 45${(67890 + index).toString().slice(-5)}`,
    mobileNumber: `+92 303 45${(67890 + index).toString().slice(-5)}`,
    amount: `PKR ${(Math.random() * 1000000 + 100000).toFixed(2)}`,
    status: status,
    date: new Date(
      2024,
      4, // May (0-indexed)
      24 // Today's date
    ).toLocaleDateString("en-GB"),
    created_at: new Date(2024, 4, 24).toISOString(),
  };
});

const Notifications = () => {
  const [filter, setFilter] = useState("Fraudulent"); // Default to Fraudulent
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [notificationCount, setNotificationCount] = useState(0);
  const itemsPerPage = 10;

  useEffect(() => {
    fetchNotifications();
  }, [filter, currentPage]);
  const fetchNotifications = async (isRefresh = false) => {
    if (isRefresh) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }

    try {
      // Add pagination and filtering parameters
      const params = {
        page: currentPage,
        limit: itemsPerPage,
        hours: 24, // Default to past 24 hours
        status: filter, // Filter by status (Fraudulent or Suspicious)
      };

      const response = await userService.getNotifications(params);
      console.log("API Response:", response);

      if (response && response.notifications) {
        const notificationsData = response.notifications || [];
        setNotifications(notificationsData);
        setTotalPages(
          response.totalPages || Math.ceil(response.total / itemsPerPage) || 1
        );
        setNotificationCount(response.total || notificationsData.length);
      } else {
        // Fallback to mock data if the API response is empty or malformed
        const filteredFallback = fallbackTransactions.filter(
          (t) => t.status === filter
        );
        setNotifications(filteredFallback);
        setTotalPages(Math.ceil(filteredFallback.length / itemsPerPage));
        setNotificationCount(filteredFallback.length);
      }
      setError(null);
    } catch (err) {
      console.error("Error fetching notifications:", err);
      setError("Failed to fetch notifications. Using fallback data.");
      // Fallback to static data in case of error
      const filteredFallback = fallbackTransactions.filter(
        (t) => t.status === filter
      );
      setNotifications(filteredFallback);
      setTotalPages(Math.ceil(filteredFallback.length / itemsPerPage));
      setNotificationCount(filteredFallback.length);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    setCurrentPage(1);
    fetchNotifications(true);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <div className="notification-container">
      <div className="notification-header">
        <div className="user-info">
          <div className="user-text">
            {/* <span className="user-name">John Deo</span>
            <span className="user-role">Admin</span> */}
          </div>
          <img src="/user.png" alt="User Avatar" className="user-avatar" />
        </div>
      </div>{" "}
      <div className="insights-header">
        <h3 style={{ color: "black" }}>
          Alerts & Notifications - Past 24 Hours
        </h3>
        <div className="insights-actions">
          {notificationCount > 0 && (
            <span className="insights-count">
              {notificationCount} notifications found
            </span>
          )}
          <button
            className="refresh-button"
            onClick={handleRefresh}
            disabled={refreshing}
            title="Refresh notifications"
          >
            <IoRefreshOutline
              className={refreshing ? "refresh-spinning" : ""}
            />
          </button>
        </div>
      </div>
      {/* Buttons */}
      {/* <div className="buttons-container">
        <button
          className={`action-button ${filter === "Fraudulent" ? "active" : ""}`}
          onClick={() => {
            setFilter("Fraudulent");
            setCurrentPage(1);
          }}
        >
          Fraudulent
        </button>
        <button
          className={`action-button ${filter === "Suspicious" ? "active" : ""}`}
          onClick={() => {
            setFilter("Suspicious");
            setCurrentPage(1);
          }}
        >
          Suspicious
        </button>
      </div> */}
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
                    </td>{" "}
                    <td>
                      {notification.status === "Suspicious" ||
                      notification.status === "Fraudulent" ? (
                        <MDBBadge pill className="failbg">
                          <span>
                            <GoDotFill className="dot" />
                          </span>
                          <span className="fraudtext">
                            {notification.status}
                          </span>
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
