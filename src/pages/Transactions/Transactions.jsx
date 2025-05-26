import React, { useState, useEffect } from "react";
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
  MDBSpinner,
} from "mdb-react-ui-kit";
import "./transaction.scss";
import { GoDotFill } from "react-icons/go";
import { VscSettings } from "react-icons/vsc";
import Pagination from "../../components/Pagination";
import Form from "react-bootstrap/Form";
import { customerTransactionService } from "../../api/services";
import { toast } from "react-toastify";

const Transactions = () => {
  const [filter, setFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  // Add new state variables for API integration
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState({
    stats: false,
    transactions: false,
  });
  const [dashboardStats, setDashboardStats] = useState({
    totalTransactions: 0,
    totalCustomers: 0,
    highRiskCustomers: 0,
  });

  // Date range state (matching Dashboard approach)
  const [dateRange, setDateRange] = useState({
    startDate: new Date(new Date().getFullYear() - 1, new Date().getMonth(), 1), // Default to 1 year ago
    endDate: new Date(),
  });

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(1);

  // Format date for API calls (matching Dashboard approach)
  const formatDate = (date) => {
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
      2,
      "0"
    )}-${String(date.getDate()).padStart(2, "0")} ${String(
      date.getHours()
    ).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}:${String(
      date.getSeconds()
    ).padStart(2, "0")}.${String(date.getMilliseconds()).padStart(3, "0")}`;
  };
  // Fetch dashboard stats
  const fetchDashboardStats = async () => {
    setLoading((prev) => ({ ...prev, stats: true }));
    try {
      const stats = await customerTransactionService.getDashboardStats();
      console.log("Dashboard stats from API:", stats);

      setDashboardStats({
        totalTransactions: stats.total_transactions || 0,
        totalCustomers:
          stats.total_customers || stats.genuine_transactions || 0,
        highRiskCustomers:
          stats.high_risk_customers || stats.suspicious_transactions || 0,
      });
    } catch (error) {
      console.error("Error fetching dashboard stats:", error);
      toast.error("Failed to load dashboard statistics");
    } finally {
      setLoading((prev) => ({ ...prev, stats: false }));
    }
  };
  // Fetch transactions with proper date filtering
  const fetchTransactions = async () => {
    setLoading((prev) => ({ ...prev, transactions: true }));
    try {
      // Format dates to match expected API format
      const formattedStartDate = formatDate(dateRange.startDate);
      const formattedEndDate = formatDate(dateRange.endDate);

      console.log("Fetching customer transactions with date range:", {
        start_date: formattedStartDate,
        end_date: formattedEndDate,
        page: currentPage,
        per_page: pageSize,
      });

      const response =
        await customerTransactionService.getCustomerTransactionsByDate({
          start_date: formattedStartDate,
          end_date: formattedEndDate,
          page: currentPage,
          per_page: pageSize,
        });

      processTransactionResponse(response);
    } catch (error) {
      console.error("Error fetching customer transactions by date:", error);
      toast.error(
        "Failed to load customer transactions for the selected date range"
      );
      setTransactions([]);
    } finally {
      setLoading((prev) => ({ ...prev, transactions: false }));
    }
  };

  // Process transaction response
  const processTransactionResponse = (response) => {
    // Check if response is an array directly or contains a transactions property
    const transactionsData = Array.isArray(response)
      ? response
      : response.transactions || [];

    console.log("Transactions from API:", transactionsData);

    // Handle pagination metadata if available
    if (response.pagination) {
      setTotalPages(
        response.pagination.totalPages ||
          Math.ceil(response.pagination.totalItems / pageSize) ||
          1
      );
    } else if (response.total) {
      setTotalPages(Math.ceil(response.total / pageSize) || 1);
    } else {
      // If no pagination info, estimate from current results
      setTotalPages(Math.max(1, Math.ceil(transactionsData.length / pageSize)));
    }

    setTransactions(transactionsData);
  };

  // Handle date range change
  const handleStartDateChange = (e) => {
    const newStartDate = new Date(e.target.value);
    setDateRange((prev) => ({
      ...prev,
      startDate: newStartDate,
    }));

    // Only fetch if we have both dates
    if (newStartDate && dateRange.endDate) {
      setCurrentPage(1); // Reset to first page when date changes
      // Use setTimeout to ensure state is updated before fetching
      setTimeout(() => fetchTransactions(), 0);
    }
  };

  const handleEndDateChange = (e) => {
    const newEndDate = new Date(e.target.value);
    setDateRange((prev) => ({
      ...prev,
      endDate: newEndDate,
    }));

    // Only fetch if we have both dates
    if (dateRange.startDate && newEndDate) {
      setCurrentPage(1); // Reset to first page when date changes
      // Use setTimeout to ensure state is updated before fetching
      setTimeout(() => fetchTransactions(), 0);
    }
  };

  // Handle search
  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  // Effect to fetch initial data
  useEffect(() => {
    fetchDashboardStats();
    fetchTransactions(); // Fetch transactions on initial load with default date range
  }, []);

  // Effect to fetch transactions when page or pageSize changes
  useEffect(() => {
    if (dateRange.startDate && dateRange.endDate) {
      fetchTransactions();
    }
  }, [currentPage, pageSize]);

  // Format date for input field
  const formatDateForInput = (date) => {
    return date.toISOString().split("T")[0];
  };

  // Handle pagination
  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  // Handle page size change
  const handlePageSizeChange = (e) => {
    const newSize = parseInt(e.target.value);
    setPageSize(newSize);
    setCurrentPage(1); // Reset to first page
  };

  // Filter transactions based on status and search query
  const getFilteredTransactions = () => {
    let filtered = [...transactions];

    // First apply status filter
    if (filter !== "All") {
      // Map between UI terms and API terms
      const statusMapping = {
        Genuine: "Genuine",
        Fraudulent: "Suspicious", // API uses "Suspicious" instead of "Fraudulent"
      };

      filtered = filtered.filter((txn) => {
        const statusDetail =
          txn.sender_status_detail ||
          (txn.status && txn.status.includes(statusMapping[filter]));
        return statusDetail === statusMapping[filter];
      });
    }

    // Then apply search query if not empty
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter((txn) => {
        // Search across ALL properties of the transaction
        return Object.keys(txn).some((key) => {
          const value = txn[key];
          // Check if value is a string or can be converted to a string
          if (value !== null && value !== undefined) {
            const stringValue = String(value).toLowerCase();
            return stringValue.includes(query);
          }
          return false;
        });
      });
    }

    return filtered;
  };

  const filteredTransactions = getFilteredTransactions();

  return (
    <div className="transactions-container">
      <div className="transactions-header">
        <div className="user-info">
          <div className="user-text">
            {/* <span className="user-name">John Deo</span>
            <span className="user-role">Admin</span> */}
          </div>
          <img src="/user.png" alt="User Avatar" className="user-avatar" />
        </div>
      </div>
      <h3 style={{ color: "black" }}>Customer Transactions</h3>

      {/* Statistic Boxes */}
      <div className="statistic-boxes">
        {/* Box 1 */}
        <div className="stat-box">
          <div className="icon-container orange">
            <CiCreditCard1 className="crediticon" />
          </div>
          <div className="stat-text">
            <h2>
              {loading.stats ? (
                <MDBSpinner size="sm" />
              ) : (
                dashboardStats.totalTransactions
              )}
            </h2>
            <span>Total Transaction</span>
          </div>
        </div>

        {/* Box 2 */}
        <div className="stat-box">
          <div className="icon-container green">
            <GrGroup className="peopleicon" />
          </div>
          <div className="stat-text">
            <h2>
              {loading.stats ? (
                <MDBSpinner size="sm" />
              ) : (
                dashboardStats.totalCustomers
              )}
            </h2>
            <span>Genuine Transactions</span>
          </div>
        </div>

        {/* Box 3 */}
        <div className="stat-box">
          <div className="icon-container red">
            <IoArrowForwardCircleOutline className="arrowright" />
          </div>
          <div className="stat-text">
            <h2>
              {loading.stats ? (
                <MDBSpinner size="sm" />
              ) : (
                dashboardStats.highRiskCustomers
              )}
            </h2>
            <span>High Risk Transactions</span>
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
          <h5 style={{ color: "black" }}>List of Transactions</h5>
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
              placeholder="🔍 Search across all transaction fields"
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
              value={searchQuery}
              onChange={handleSearch}
            />
          </div>
        </div>
      </div>

      {/* Date Range Picker (Similar to Dashboard) */}
      <div
        className="date-range-picker"
        style={{ marginTop: "15px", marginBottom: "15px" }}
      >
        <div
          className="date-inputs"
          style={{ display: "flex", alignItems: "center", gap: "10px" }}
        >
          <input
            type="date"
            value={formatDateForInput(dateRange.startDate)}
            onChange={handleStartDateChange}
            className="date-input"
            style={{
              padding: "8px",
              borderRadius: "5px",
              border: "1px solid #ccc",
            }}
          />
          <span className="date-separator">to</span>
          <input
            type="date"
            value={formatDateForInput(dateRange.endDate)}
            onChange={handleEndDateChange}
            className="date-input"
            style={{
              padding: "8px",
              borderRadius: "5px",
              border: "1px solid #ccc",
            }}
          />
          <MDBBtn
            size="sm"
            onClick={() => {
              setCurrentPage(1); // Reset to first page
              fetchTransactions();
            }}
            className="refresh-btn"
            style={{
              background: "linear-gradient(90deg, #3B8BD0 0%, #2548C2 100%)",
              color: "#fff",
              borderRadius: "5px",
              fontWeight: "500",
            }}
          >
            Refresh
          </MDBBtn>
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
        {loading.transactions ? (
          <div className="text-center my-4">
            <MDBSpinner />
          </div>
        ) : (
          <MDBTable align="middle" className="transactiontable">
            <MDBTableHead>
              <tr>
                <th scope="col">Transaction ID</th>
                <th scope="col">Sender Client ID</th>
                <th scope="col">Sender Name</th>
                <th scope="col">Mobile Number</th>
                <th scope="col">Amount</th>
                <th scope="col">Status</th>
                <th scope="col">Date</th>
              </tr>
            </MDBTableHead>
            <MDBTableBody>
              {filteredTransactions.length > 0 ? (
                filteredTransactions.map((transaction) => (
                  <tr
                    key={
                      transaction.id ||
                      transaction.mtn ||
                      Math.random().toString()
                    }
                  >
                    <td>
                      <p className="fw-normal mb-1">
                        {transaction.id || transaction.mtn || "N/A"}
                      </p>
                    </td>
                    <td>
                      <p className="fw-normal mb-1">
                        {transaction.sender_client_id ||
                          transaction.sender_id ||
                          "N/A"}
                      </p>
                    </td>
                    <td>
                      <p className="fw-normal mb-1">
                        {transaction.sender_legal_name ||
                          transaction.sender_name ||
                          "N/A"}
                      </p>
                    </td>
                    <td>
                      <p className="fw-normal mb-1">
                        {transaction.sender_mobile ||
                          transaction.mobile ||
                          "N/A"}
                      </p>
                    </td>
                    <td>
                      <p className="fw-normal mb-1">
                        {transaction.total_sale || transaction.amount || "N/A"}
                      </p>
                    </td>
                    <td>
                      {transaction.sender_status_detail === "Suspicious" ||
                      (transaction.status &&
                        transaction.status.includes("Suspicious")) ? (
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
                      <p className="fw-normal mb-1">
                        {transaction.sending_date
                          ? new Date(
                              transaction.sending_date
                            ).toLocaleDateString("en-GB")
                          : transaction.date
                          ? new Date(transaction.date).toLocaleDateString(
                              "en-GB"
                            )
                          : "N/A"}
                      </p>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="text-center">
                    No transactions found
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
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        {/* Page size selector */}
        <div className="d-flex align-items-center">
          <span className="me-2">Rows per page:</span>
          <select
            className="form-select form-select-sm"
            value={pageSize}
            onChange={handlePageSizeChange}
            style={{ width: "70px" }}
          >
            <option value="10">10</option>
            <option value="25">25</option>
            <option value="50">50</option>
            <option value="100">100</option>
          </select>
        </div>

        {/* Pagination controls */}
        <div className="pagination-buttons">
          <MDBBtn
            size="sm"
            color="light"
            disabled={currentPage === 1}
            onClick={() => handlePageChange(currentPage - 1)}
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
            onClick={() => handlePageChange(currentPage + 1)}
          >
            Next
          </MDBBtn>
        </div>
      </div>
    </div>
  );
};

export default Transactions;
