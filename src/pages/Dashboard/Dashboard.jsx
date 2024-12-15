import React from "react";
import "./dashboard.scss";
import { CiCreditCard1 } from "react-icons/ci";
import { GrGroup } from "react-icons/gr";
import { FaRegArrowAltCircleRight } from "react-icons/fa";
import { IoArrowForwardCircleOutline } from "react-icons/io5";
import { Line } from "react-chartjs-2";
import { Doughnut } from "react-chartjs-2";
import { MDBBadge, MDBTable, MDBTableHead, MDBTableBody } from 'mdb-react-ui-kit';
import { GoDotFill } from "react-icons/go";
import { FormControl, InputLabel, Select, MenuItem } from '@mui/material';


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

// Data for the Line Chart (Fraudulent Transaction Details)
const lineData = {
  labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
  datasets: [
    {
      label: "Fraudulent Transactions",
      data: [10, 15, 25, 35, 22, 40, 50, 30, 20, 40, 25, 10],
      borderColor: "rgba(255, 99, 132, 1)",
      backgroundColor: "rgba(255, 99, 132, 0.2)",
      fill: true,
      tension: 0.4,
    },
  ],
};

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

// Data for the Doughnut Chart (Total Transactions)
const doughnutData = {
  labels: ["Genuine", "Fraudulent"],
  datasets: [
    {
      data: [85, 15],
      backgroundColor: ["#57BE96", "#CE3636"],
      hoverBackgroundColor: ["#4da683", "red"],
    },
  ],
};

const doughnutOptions = {
  responsive: true,
  plugins: {
    legend: {
      position: "bottom",
    },
  },
};

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

const Dashboard = () => {
  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
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
      <h3 style={{color: "black"}}>Dashboard</h3>

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

      {/* Fraudulent Transaction Details and Total Transactions */}
      <div className="charts-section">
        {/* Line Chart */}
        <div className="chart-container-1">
          <h4>Fraudulent Transaction Details</h4>
          <Line key={JSON.stringify(lineData)} data={lineData} options={lineOptions} />
        </div>

        <div className="chart-container-2">
          <h4>Total Transaction</h4>
          <Doughnut key={JSON.stringify(doughnutData)} data={doughnutData} options={doughnutOptions} />
        </div>
      </div>

      {/* Table */}
      <div className="tablebox">
        <div style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center"
        }}>
          <h4>Recent Transaction Details</h4>
          <div>

            <select name="Month" id="Month" style={{padding: "5px 8px",
    fontSize: "14px"}}>
              <option value="">February 2024</option>
              <option value="saab">March</option>
              <option value="mercedes">September</option>
              <option value="audi">December</option>
            </select>
          </div>
        </div>

        <div className="table-container">
          <MDBTable align='middle' className="dashboardtable">
            <MDBTableHead>
              <tr>
                <th scope='col'>Transaction ID</th>
                <th scope='col'>Sender Name</th>
                <th scope='col'>Mobile Number</th>
                <th scope='col'>Amount</th>
                <th scope='col'>Date</th>
                <th scope='col'>Status</th>
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
                    <p>{transaction.date}</p>
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
                  
                </tr>
              ))}
            </MDBTableBody>
          </MDBTable>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;