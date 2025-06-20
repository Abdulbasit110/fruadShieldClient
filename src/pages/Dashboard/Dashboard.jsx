import React, { useEffect, useState } from "react";
import "./dashboard.scss";
import { CiCreditCard1 } from "react-icons/ci";
import { GrGroup } from "react-icons/gr";
import { IoArrowForwardCircleOutline } from "react-icons/io5";
import { FaUserCheck, FaUserTimes } from "react-icons/fa";
import { Line } from "react-chartjs-2";
import { Doughnut } from "react-chartjs-2";
import { MDBSpinner, MDBBtn } from "mdb-react-ui-kit";
import { FormControl, InputLabel, Select, MenuItem } from "@mui/material";
import { authService } from "../../api/services";
import { transactionService } from "../../api/services";
import { customerTransactionService } from "../../api/services";
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
    genuineTransactions: 0,
    genuineCustomers: 0,
    suspiciousTransactions: 0,
    suspiciousCustomers: 0,
    mixedCustomers: 0,
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
  // Pagination state (removed since we don't show table anymore)
  // const [currentPage, setCurrentPage] = useState(1);
  // const [pageSize, setPageSize] = useState(10);
  // const [totalPages, setTotalPages] = useState(1);

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
      // Use customer transaction service for live customer data stats
      const stats = await transactionService.getDashboardStats();
      console.log("Customer transaction stats from API:", stats);
      setDashboardStats({
        totalTransactions: stats.total_transactions || 0,
        totalCustomers: stats.total_customers || 0,
        genuineTransactions: stats.genuine_transactions || 0,
        genuineCustomers: stats.genuine_customers || 0,
        suspiciousTransactions: stats.suspicious_transactions || 0,
        suspiciousCustomers: stats.suspicious_customers || 0,
        mixedCustomers: stats.mixed_customers || 0,
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
  // Fetch transactions by date range (for chart data only)
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

      console.log("Fetching transactions for chart data with date range:", {
        start_date: formattedStartDate,
        end_date: formattedEndDate,
      });
      const response = await transactionService.getTransactionsByDate({
        start_date: formattedStartDate,
        end_date: formattedEndDate,
        // Remove pagination params since we need all data for charts
      });

      // Check if response is an array directly or contains a transactions property
      const transactionsData = Array.isArray(response.transactions)
        ? response.transactions
        : response.transactions || [];

      console.log(
        "Setting transactions for chart data:",
        transactionsData.length,
        "transactions"
      );
      setTransactions(transactionsData);

      // Update line chart with filtered data
      if (transactionsData.length > 0) {
        const lineChartData =
          prepareLineChartDataFromTransactions(transactionsData);
        setLineData(lineChartData);
      } else {
        // Reset chart if no data
        setLineData({
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
      }
    } catch (error) {
      console.error("Error fetching transactions by date:", error);
      toast.error("Failed to load transactions for the selected date range");
    } finally {
      setLoading((prev) => ({ ...prev, transactions: false }));
    }
  };
  // Effect to fetch transactions when date range changes (for chart data)
  useEffect(() => {
    fetchTransactionsByDate();
  }, [dateRange]);
  // Handle date range change
  const handleStartDateChange = (e) => {
    setDateRange((prev) => ({
      ...prev,
      startDate: new Date(e.target.value),
    }));
  };

  const handleEndDateChange = (e) => {
    setDateRange((prev) => ({
      ...prev,
      endDate: new Date(e.target.value),
    }));
  };
  // Removed pagination handlers since we don't show table anymore
  // const handlePageChange = (newPage) => {
  //   setCurrentPage(newPage);
  // };

  // const handlePageSizeChange = (e) => {
  //   const newSize = parseInt(e.target.value);
  //   setPageSize(newSize);
  //   setCurrentPage(1);
  // };

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
      // Set doughnut chart data using genuine and suspicious transactions
      const doughnutData = prepareDoughnutData(
        dashboardStats.genuineTransactions,
        dashboardStats.suspiciousTransactions
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
      <h3 style={{ color: "black" }}>Dashboard</h3> {/* Statistic Boxes */}
      <div className="statistic-boxes">
        {/* Box 1 - Total Transactions */}
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
            <span>Total Transactions</span>
          </div>
        </div>

        {/* Box 2 - Total Customers */}
        <div className="stat-box">
          <div className="icon-container blue">
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
            <span>Total Customers</span>
          </div>
        </div>

        {/* Box 3 - Genuine Transactions */}
        <div className="stat-box">
          <div className="icon-container green">
            <CiCreditCard1 className="crediticon" />
          </div>
          <div className="stat-text">
            <h2>
              {loading.stats ? (
                <MDBSpinner size="sm" />
              ) : (
                dashboardStats.genuineTransactions
              )}
            </h2>
            <span>Genuine Transactions</span>
          </div>
        </div>

        {/* Box 4 - Genuine Customers */}
        <div className="stat-box">
          <div className="icon-container green-light">
            <FaUserCheck className="usericon" />
          </div>
          <div className="stat-text">
            <h2>
              {loading.stats ? (
                <MDBSpinner size="sm" />
              ) : (
                dashboardStats.genuineCustomers
              )}
            </h2>
            <span>Genuine Customers</span>
          </div>
        </div>
        {/* Box 5 - Suspicious Transactions */}
        <div className="stat-box">
          <div className="icon-container red">
            <IoArrowForwardCircleOutline className="arrowright" />
          </div>
          <div className="stat-text">
            <h2>
              {loading.stats ? (
                <MDBSpinner size="sm" />
              ) : (
                dashboardStats.suspiciousTransactions
              )}
            </h2>
            <span>Suspicious Transactions</span>
          </div>
        </div>

        {/* Box 6 - Suspicious Customers */}
        <div className="stat-box">
          <div className="icon-container red-light">
            <FaUserTimes className="usericon" />
          </div>
          <div className="stat-text">
            <h2>
              {loading.stats ? (
                <MDBSpinner size="sm" />
              ) : (
                dashboardStats.suspiciousCustomers
              )}
            </h2>
            <span>Suspicious Customers</span>
          </div>
        </div>
      </div>
      {/* Date Range Filter for Charts */}
      <div className="date-filter-section">
        <div className="date-range-picker">
          <h4>Filter Data by Date Range</h4>
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
              disabled={loading.transactions}
            >
              {loading.transactions ? <MDBSpinner size="sm" /> : "Apply Filter"}
            </MDBBtn>
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
          )}{" "}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
