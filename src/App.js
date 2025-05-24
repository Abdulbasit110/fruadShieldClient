import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Signup from "./pages/Signup/Signup";
import Login from "./pages/Login/Login";
import Dashboard from "./pages/Dashboard/Dashboard";
import SideBar from "./components/Layout/SideBar";
import Transactions from "./pages/Transactions/Transactions";
import Insights from "./pages/Insights/Insights";
import Details from "./pages/Details/Details";
import Notifications from "./pages/Notifications/Notifications";
import Settings from "./pages/Settings/Settings";
import Forgetpassword from "./pages/ForgetPassword/Forgetpassword";
import VerificationPassword from "./pages/VerificationPage/VerificationPassword";
import ResetPassword from "./pages/ResetPassword/ResetPassword";
import Management from "./pages/Management/Management";
import ProtectedRoute from "./components/ProtectedRoute";
import { NotificationProvider } from "./context/NotificationContext";

function App() {
  return (
    <NotificationProvider>
      {/* Toast notifications container */}
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />

      <Routes>
        {/* Public routes */}
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="forget-password" element={<Forgetpassword />} />
        <Route path="verification" element={<VerificationPassword />} />
        <Route path="reset-password" element={<ResetPassword />} />

        {/* Protected routes */}
        <Route
          path="/app/*"
          element={
            <ProtectedRoute>
              <div className="app-container">
                <SideBar />
                <div className="main-content">
                  <Routes>
                    <Route path="dashboard" element={<Dashboard />} />
                    <Route path="transactions" element={<Transactions />} />
                    <Route path="insights" element={<Insights />} />
                    {/* <Route path="details" element={<Details />} /> */}
                    <Route path="notifications" element={<Notifications />} />
                    <Route path="settings" element={<Settings />} />
                    <Route path="management" element={<Management />} />
                    <Route
                      path="*"
                      element={<Navigate to="/app/dashboard" replace />}
                    />
                  </Routes>
                </div>
              </div>
            </ProtectedRoute>
          }
        />

        {/* Fallback route */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </NotificationProvider>
  );
}

export default App;
