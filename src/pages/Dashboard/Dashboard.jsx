import React, { useEffect, useState } from "react";
import "./dashboard.scss";
import { CiCreditCard1 } from "react-icons/ci";
import { GrGroup } from "react-icons/gr";
import { FaRegArrowAltCircleRight } from "react-icons/fa";
import { IoArrowForwardCircleOutline } from "react-icons/io5";
import { Line } from "react-chartjs-2";
import { Doughnut } from "react-chartjs-2";
import {
  MDBBadge,
  MDBTable,
  MDBTableHead,
  MDBTableBody,
  MDBSpinner,
  MDBBtn,
} from "mdb-react-ui-kit";
import { GoDotFill } from "react-icons/go";
import { FormControl, InputLabel, Select, MenuItem } from "@mui/material";
import { authService } from "../../api/services";
import { transactionService } from "../../api/services";
import { fraudService } from "../../api/services";
import { toast } from "react-toastify";

import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  LineController,
  CategoryScale,
  LinearScale,
  ArcElement,
  DoughnutController,
  Tooltip,
  Legend,
} from "chart.js";

// Register Chart.js components
ChartJS.register(
  LineElement,
  PointElement,
  LineController,
  CategoryScale,
  LinearScale,
  ArcElement,
  DoughnutController,
  Tooltip,
  Legend
);

const Dashboard = () => {
  const [userData, setUserData] = useState({
    name: "Loading...",
    role: "User",
    email: "",
    firstName: "",
    lastName: "",
  });

  const [dashboardStats, setDashboardStats] = useState({
    totalTransactions: 0,
    totalCustomers: 0,
    highRiskCustomers: 0,
    genuineTransactions: 0,
    fraudulentTransactions: 0,
    monthlyFraudStats: [],
  });

  const [transactions, setTransactions] = useState([]);
  const [dateRange, setDateRange] = useState({
    startDate: new Date(new Date().getFullYear() - 1, new Date().getMonth(), 1), // Default to 1 year ago
    endDate: new Date(),
  });
  const [loading, setLoading] = useState({
    stats: false,
    transactions: false,
  });

  const [lineData, setLineData] = useState({
    labels: [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ],
    datasets: [
      {
        label: "Suspicious Transactions (%)",
        data: Array(12).fill(0),
        borderColor: "rgba(255, 99, 132, 1)",
        backgroundColor: "rgba(255, 99, 132, 0.2)",
      },
    ],
  });

  const [doughnutData, setDoughnutData] = useState({
    labels: ["Genuine", "Fraudulent"],
    datasets: [
      {
        data: [0, 0],
        backgroundColor: ["#57BE96", "#CE3636"],
        hoverBackgroundColor: ["#4da683", "red"],
      },
    ],
  });

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(1);

  // Format month for display
  const formatMonthDisplay = (dateString) => {
    const date = new Date(dateString + "-01");
    return date.toLocaleDateString("en-US", { month: "long", year: "numeric" });
  };

  // Get available months for dropdown
  const getAvailableMonths = () => {
    const months = [];
    const currentDate = new Date();

    for (let i = 0; i < 12; i++) {
      const date = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth() - i,
        1
      );
      const monthString = date.toISOString().slice(0, 7);
      months.push({
        value: monthString,
        label: date.toLocaleDateString("en-US", {
          month: "long",
          year: "numeric",
        }),
      });
    }

    return months;
  };

  // Prepare line chart data from API response
  const prepareLineChartData = (monthlyStats) => {
    const labels = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    const data = Array(12).fill(0);

    console.log("Monthly stats for chart:", monthlyStats);

    // If API doesn't return monthlyFraudStats, use transactions data instead
    if (!monthlyStats || monthlyStats.length === 0) {
      // Fall back to transaction data if we have it
      if (transactions && transactions.length > 0) {
        return prepareLineChartDataFromTransactions(transactions);
      }
      return {
        labels,
        datasets: [
          {
            label: "Suspicious Transactions",
            data,
            borderColor: "rgba(255, 99, 132, 1)",
            backgroundColor: "rgba(255, 99, 132, 0.2)",
            fill: true,
            tension: 0.4,
          },
        ],
      };
    }

    // If monthlyStats is an object with month keys instead of an array
    if (!Array.isArray(monthlyStats) && typeof monthlyStats === "object") {
      Object.entries(monthlyStats).forEach(([month, value]) => {
        const monthIndex = parseInt(month) - 1; // Assuming month is 1-12
        if (monthIndex >= 0 && monthIndex < 12) {
          data[monthIndex] = value.fraudPercentage || 0;
        }
      });
    } else if (Array.isArray(monthlyStats)) {
      // Handle array format
      monthlyStats.forEach((stat) => {
        // Check if stat has a month property or a date property
        if (stat.month !== undefined) {
          // Month is directly provided as a number (1-12)
          const monthIndex = parseInt(stat.month) - 1;
          if (monthIndex >= 0 && monthIndex < 12) {
            data[monthIndex] = stat.fraudPercentage || 0;
          }
        } else if (stat.date) {
          // Extract month from date string
          const monthIndex = new Date(stat.date).getMonth();
          data[monthIndex] = stat.fraudPercentage || 0;
        }
      });
    }

    return {
      labels,
      datasets: [
        {
          label: "Suspicious Transactions",
          data,
          borderColor: "rgba(255, 99, 132, 1)",
          backgroundColor: "rgba(255, 99, 132, 0.2)",
          fill: true,
          tension: 0.4,
        },
      ],
    };
  };

  // Prepare doughnut chart data from API response
  const prepareDoughnutData = (genuine, fraudulent) => {
    return {
      labels: ["Genuine", "Fraudulent"],
      datasets: [
        {
          data: [genuine, fraudulent],
          backgroundColor: ["#57BE96", "#CE3636"],
          hoverBackgroundColor: ["#4da683", "red"],
        },
      ],
    };
  };

  // Prepare line chart data from raw transactions
  const prepareLineChartDataFromTransactions = (transactions) => {
    // Initialize monthly data (12 months, all zeros)
    const monthlyData = Array(12).fill(0);
    const monthlyCounts = Array(12).fill(0);

    // Count transactions and suspicious transactions by month
    transactions.forEach((transaction) => {
      const date = new Date(transaction.sending_date);
      const month = date.getMonth();
      monthlyCounts[month]++;
      if (transaction.sender_status_detail === "Suspicious") {
        monthlyData[month]++;
      }
    });

    // Convert to percentages
    const data = monthlyData.map((fraudCount, index) => {
      const totalCount = monthlyCounts[index];
      return totalCount > 0 ? (fraudCount / totalCount) * 100 : 0;
    });

    console.log("Generated monthly data from transactions:", data);

    return {
      labels: [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ],
      datasets: [
        {
          label: "Suspicious Transactions (%)",
          data: data,
          borderColor: "rgba(255, 99, 132, 1)",
          backgroundColor: "rgba(255, 99, 132, 0.2)",
        },
      ],
    };
  };

  useEffect(() => {
    // Get user data from localStorage
    const user = authService.getCurrentUser();

    if (user) {
      // Extract the name from email or use firstName/lastName if available
      const name =
        user.firstName && user.lastName
          ? `${user.firstName} ${user.lastName}`
          : user.email
          ? user.email.split("@")[0]
          : "User";

      setUserData({
        name: name,
        role: user.role || "User",
        email: user.email || "",
      });
    }

    // Fetch dashboard stats
    fetchDashboardStats();
  }, []);

  // Fetch dashboard statistics
  const fetchDashboardStats = async () => {
    setLoading((prev) => ({ ...prev, stats: true }));
    try {
      const stats = await transactionService.getDashboardStats();
      console.log("Dashboard stats from API:", stats);

      setDashboardStats({
        totalTransactions: stats.total_transactions || 0,
        totalCustomers:
          stats.total_customers || stats.genuine_transactions || 0,
        highRiskCustomers:
          stats.high_risk_customers || stats.suspicious_transactions || 0,
        genuineTransactions: stats.genuine_volume || 0,
        fraudulentTransactions: stats.suspicious_volume || 0,
        monthlyFraudStats: stats.monthly_stats || stats.monthlyFraudStats || [],
      });

      // For initial load only, set the line chart data from API stats
      // After this, line chart updates based on date filter
      if (stats.monthly_stats || stats.monthlyFraudStats) {
        const lineChartData = prepareLineChartData(
          stats.monthly_stats || stats.monthlyFraudStats || []
        );
        setLineData(lineChartData);
      }

      // Doughnut chart data is now set only in the useEffect
      // to prevent double rendering
    } catch (error) {
      console.error("Error fetching dashboard stats:", error);
      toast.error("Failed to load dashboard statistics");
    } finally {
      setLoading((prev) => ({ ...prev, stats: false }));
    }
  };

  // Fetch transactions by date range
  const fetchTransactionsByDate = async () => {
    setLoading((prev) => ({ ...prev, transactions: true }));
    try {
      // Format dates to YYYY-MM-DD HH:mm:ss.SSS
      const formatDate = (date) => {
        return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
          2,
          "0"
        )}-${String(date.getDate()).padStart(2, "0")} ${String(
          date.getHours()
        ).padStart(2, "0")}:${String(date.getMinutes()).padStart(
          2,
          "0"
        )}:${String(date.getSeconds()).padStart(2, "0")}.${String(
          date.getMilliseconds()
        ).padStart(3, "0")}`;
      };

      const formattedStartDate = formatDate(dateRange.startDate);
      const formattedEndDate = formatDate(dateRange.endDate);

      console.log("Fetching transactions with date range:", {
        start_date: formattedStartDate,
        end_date: formattedEndDate,
        page: currentPage,
        limit: pageSize,
      });

      const response = await transactionService.getTransactionsByDate({
        start_date: formattedStartDate,
        end_date: formattedEndDate,
        page: currentPage,
        limit: pageSize,
      });

      // Check if response is an array directly or contains a transactions property
      const transactionsData = Array.isArray(response.transactions)
        ? response.transactions
        : response.transactions || [];

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
        setTotalPages(
          Math.max(1, Math.ceil(transactionsData.length / pageSize))
        );
      }

      console.log("Setting transactions to:", transactionsData);
      setTransactions(transactionsData);

      // Update line chart with filtered data
      if (transactionsData.length > 0) {
        const lineChartData =
          prepareLineChartDataFromTransactions(transactionsData);
        setLineData(lineChartData);
      }
    } catch (error) {
      console.error("Error fetching transactions by date:", error);
      toast.error("Failed to load transactions for the selected date range");
    } finally {
      setLoading((prev) => ({ ...prev, transactions: false }));
    }
  };

  // Effect to fetch transactions when date range or page changes
  useEffect(() => {
    fetchTransactionsByDate();
  }, [dateRange, currentPage, pageSize]);

  // Handle date range change
  const handleStartDateChange = (e) => {
    setDateRange((prev) => ({
      ...prev,
      startDate: new Date(e.target.value),
    }));
    setCurrentPage(1); // Reset to first page on date change
  };

  const handleEndDateChange = (e) => {
    setDateRange((prev) => ({
      ...prev,
      endDate: new Date(e.target.value),
    }));
    setCurrentPage(1); // Reset to first page on date change
  };

  // Handle pagination
  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  // Handle page size change
  const handlePageSizeChange = (e) => {
    const newSize = parseInt(e.target.value);
    setPageSize(newSize);
    setCurrentPage(1); // Reset to first page when changing page size
  };

  // Format date for input field
  const formatDateForInput = (date) => {
    return date.toISOString().split("T")[0];
  };

  // Chart options
  const lineOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
    },
    scales: {
      y: {
        min: 0,
        max: 60,
        ticks: {
          stepSize: 10,
          callback: (value) => `${value}%`,
        },
      },
    },
  };

  const doughnutOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "bottom",
      },
    },
  };

  // Effect to set line chart data
  useEffect(() => {
    if (dashboardStats) {
      // Only set doughnut chart data here - line chart now updates with date range
      const genuineCount =
        dashboardStats.genuineTransactions ||
        dashboardStats.totalTransactions -
          dashboardStats.fraudulentTransactions;
      const doughnutData = prepareDoughnutData(
        genuineCount,
        dashboardStats.fraudulentTransactions
      );
      setDoughnutData(doughnutData);
    }
  }, [dashboardStats]);

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <div className="user-info">
          <div className="user-text">
            <span className="user-name">{userData.name}</span>
            <span className="user-role">{userData.role}</span>
          </div>
          <img
            src="/user.png" // Replace with the actual user avatar URL
            alt="User Avatar"
            className="user-avatar"
          />
        </div>
      </div>
      <h3 style={{ color: "black" }}>Dashboard</h3>

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

      {/* Fraudulent Transaction Details and Total Transactions */}
      <div className="charts-section">
        {/* Line Chart */}
        <div className="chart-container-1">
          <h4>Fraudulent Transaction Details</h4>
          {loading.stats ? (
            <div className="chart-loading">
              <MDBSpinner />
            </div>
          ) : (
            <Line
              key={JSON.stringify(lineData)}
              data={lineData}
              options={lineOptions}
            />
          )}
        </div>

        <div className="chart-container-2">
          <h4>Total Transaction</h4>
          {loading.stats ? (
            <div className="chart-loading">
              <MDBSpinner />
            </div>
          ) : (
            <Doughnut
              key={JSON.stringify(doughnutData)}
              data={doughnutData}
              options={doughnutOptions}
            />
          )}
        </div>
      </div>

      {/* Table */}
      <div className="tablebox">
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <h4>Recent Transaction Details</h4>
          <div className="date-range-picker">
            <div className="date-inputs">
              <input
                type="date"
                value={formatDateForInput(dateRange.startDate)}
                onChange={handleStartDateChange}
                className="date-input"
              />
              <span className="date-separator">to</span>
              <input
                type="date"
                value={formatDateForInput(dateRange.endDate)}
                onChange={handleEndDateChange}
                className="date-input"
              />
              <MDBBtn
                size="sm"
                onClick={fetchTransactionsByDate}
                className="refresh-btn"
              >
                Refresh
              </MDBBtn>
            </div>
          </div>
        </div>

        <div className="table-container">
          {loading.transactions ? (
            <div className="text-center my-4">
              <MDBSpinner />
            </div>
          ) : (
            <MDBTable align="middle" className="dashboardtable">
              <MDBTableHead>
                <tr>
                  <th scope="col">Transaction ID</th>
                  <th scope="col">Sender Name</th>
                  <th scope="col">Mobile Number</th>
                  <th scope="col">Amount</th>
                  <th scope="col">Date</th>
                  <th scope="col">Status</th>
                </tr>
              </MDBTableHead>
              <MDBTableBody>
                {transactions.length > 0 ? (
                  transactions.map((transaction) => (
                    <tr key={transaction.id}>
                      <td>
                        <p>{transaction.id || transaction.mtn || "N/A"}</p>
                      </td>
                      <td>
                        <p>{transaction.sender_legal_name || "N/A"}</p>
                      </td>
                      <td>
                        <p>
                          {transaction.sender_mobile ||
                            transaction.mobile ||
                            "N/A"}
                        </p>
                      </td>
                      <td>
                        <p>{transaction.total_sale || "N/A"}</p>
                      </td>
                      <td>
                        <p>
                          {transaction.sending_date
                            ? new Date(
                                transaction.sending_date
                              ).toLocaleDateString("en-GB")
                            : "N/A"}
                        </p>
                      </td>
                      <td>
                        {transaction.sender_status_detail === "Suspicious" ||
                        transaction.status?.includes("Suspicious") ? (
                          <MDBBadge pill className="failbg">
                            <span>
                              <GoDotFill className="dot" />
                            </span>
                            <span className="fraudtext">Suspicious</span>
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
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="text-center">
                      No transactions found for this period
                    </td>
                  </tr>
                )}
              </MDBTableBody>
            </MDBTable>
          )}

          {/* Pagination Controls */}
          {transactions.length > 0 && (
            <div className="pagination-controls mt-3 d-flex justify-content-between align-items-center">
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
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
