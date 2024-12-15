import React, { useState } from "react";
import {
  MDBCollapse,
  MDBListGroup,
  MDBListGroupItem,
  MDBIcon,
  MDBRipple,
} from "mdb-react-ui-kit";
import { useNavigate } from "react-router-dom";
import "./sidebar.scss";
import { MdDashboardCustomize } from "react-icons/md";
import { AiOutlineTransaction } from "react-icons/ai";
import { FaClipboardList } from "react-icons/fa";
import { FaFlag } from "react-icons/fa";
import { IoLogOut } from "react-icons/io5";
import { IoSettingsSharp } from "react-icons/io5";
import { FaBell } from "react-icons/fa";
import { HiMiniUsers } from "react-icons/hi2";

export default function SideBar() {
  const [showSidebar, setShowSidebar] = useState(false);
  const navigate = useNavigate();

  const handleSidebarToggle = () => {
    setShowSidebar(!showSidebar);
  };

  return (
    <>
      {/* Toggle Button */}
      <div className="toggle-sidebar-btn" onClick={handleSidebarToggle}>
        <MDBIcon icon="bars" style={{ fontSize: "23px", marginTop: "2px" }} />
      </div>

      {/* Sidebar */}
      <div className={`sidebar ${showSidebar ? "show" : ""} d-lg-block bg-white sidebar collapse-content`}>
          {/* Logo */}
          <div className="sidebar-logo text-center" style={{ marginTop: "1.5rem" }}>
            <img src="/logo.png" style={{ width: "23%" }} />
          </div>

          {/* Navigation Links */}
          <div className="navbtns">

            <MDBListGroup flush className="mx-2 mt-4">
              <MDBRipple rippleTag="span">
                <MDBListGroupItem
                  action
                  onClick={() => navigate("/app/dashboard")}
                  className={`border-0 rounded ${window.location.pathname.includes("/dashboard") ? "active" : ""}`}
                  >
                  <MdDashboardCustomize style={{ marginRight: "0.5rem !important" }} />

                  Dashboard
                </MDBListGroupItem>
              </MDBRipple>

              <MDBRipple rippleTag="span">
                <MDBListGroupItem
                  action
                  onClick={() => navigate("/app/management")}
                  className={`border-0 rounded ${window.location.pathname.includes("/management") ? "active" : ""}`}                  >
                  <HiMiniUsers style={{ marginRight: "0.5rem !important" }} />
                  User Management
                </MDBListGroupItem>
              </MDBRipple>

              <MDBRipple rippleTag="span">
                <MDBListGroupItem
                  action
                  onClick={() => navigate("/app/transactions")}
                  className={`border-0 rounded ${window.location.pathname.includes("/transactions") ? "active" : ""}`}                  >
                  <AiOutlineTransaction style={{ marginRight: "0.5rem !important" }} />
                  Customer Transactions
                </MDBListGroupItem>
              </MDBRipple>

              <MDBRipple rippleTag="span">
                <MDBListGroupItem

                  action
                  onClick={() => navigate("/app/insights")}
                  className={`border-0 rounded ${window.location.pathname.includes("/insights") ? "active" : ""}`}
                  >
                  <FaClipboardList style={{ marginRight: "0.5rem !important" }} />
                  ML Algorithm Insights
                </MDBListGroupItem>
              </MDBRipple>

              <MDBRipple rippleTag="span">
                <MDBListGroupItem
                  action
                  onClick={() => navigate("/app/details")}
                  className={`border-0 rounded ${window.location.pathname.includes("/details") ? "active" : ""}`}
                  >
                  <FaFlag style={{ marginRight: "0.5rem !important" }} />

                  Algorithm Details
                </MDBListGroupItem>
              </MDBRipple>

              <MDBRipple rippleTag="span">
                <MDBListGroupItem
                  action
                  onClick={() => navigate("/app/notifications")}
                  className={`border-0 rounded ${window.location.pathname.includes("/notifications") ? "active" : ""}`}
                  >
                  <FaBell style={{ marginRight: "0.5rem !important" }} />

                  Alerts & Notifications
                </MDBListGroupItem>
              </MDBRipple>

              <MDBRipple rippleTag="span">
                <MDBListGroupItem
                  action
                  onClick={() => navigate("/app/settings")}
                  className={`border-0 rounded ${window.location.pathname.includes("/settings") ? "active" : ""}`}
                  >
                  <IoSettingsSharp style={{ marginRight: "0.5rem !important" }} />
                  Settings
                </MDBListGroupItem>
              </MDBRipple>
            </MDBListGroup>

            {/* Logout Button */}
            <div className="sidebar-logout mt-auto py-3 px-3">
              <MDBListGroupItem tag="a" action className=" logoutbtn" onClick={() => navigate("/")}>
                <IoLogOut style={{ marginRight: "0.5rem !important", fontSize: "22px", transform: "rotate(180deg)", marginLeft: "5px" }} />
                <span style={{ marginLeft: "-3px" }}>Logout</span>
              </MDBListGroupItem>
            </div>
          </div>
        {/* </MDBCollapse> */}
      </div>

    </>
  );
}
