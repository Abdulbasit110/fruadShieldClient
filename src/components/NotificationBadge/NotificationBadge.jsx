import React from "react";
import { GoDotFill } from "react-icons/go";
import { MDBBadge } from "mdb-react-ui-kit";
import "./NotificationBadge.scss";

const NotificationBadge = ({ notification, onClick }) => {
  const { status, transaction_id, sender_name, amount, confidence } =
    notification;
  const isSuspicious = status === "Suspicious";

  return (
    <div
      className={`notification-badge ${
        isSuspicious ? "suspicious" : "genuine"
      }`}
      onClick={onClick}
    >
      <div className="notification-icon">
        {isSuspicious ? (
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
      </div>
      <div className="notification-content">
        <div className="notification-header">
          <span className="transaction-id">{transaction_id}</span>
          <span className="notification-time">
            {new Date().toLocaleTimeString()}
          </span>
        </div>
        <div className="notification-body">
          <p className="sender-name">{sender_name}</p>
          <p className="amount">{amount}</p>
          {isSuspicious && (
            <p className="confidence">Confidence: {confidence}</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default NotificationBadge;
