import React, { useState, useEffect, useRef } from "react";
import {
  MDBCard,
  MDBCardBody,
  MDBBtn,
  MDBSpinner,
  MDBIcon,
} from "mdb-react-ui-kit";
import "./details.scss";
import { LuPencilLine } from "react-icons/lu";
import {
  FaDownload,
  FaSave,
  FaTimes,
  FaRegQuestionCircle,
} from "react-icons/fa";
import { toast } from "react-toastify";
import ReactMarkdown from "react-markdown";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts";

// This component could be moved to a separate file later
const ConfusionMatrix = ({ data }) => {
  const { truePositive, falsePositive, trueNegative, falseNegative } = data;
  const total = truePositive + falsePositive + trueNegative + falseNegative;

  return (
    <div className="confusion-matrix">
      <h6 className="mb-3">Confusion Matrix</h6>
      <div className="matrix-container">
        <div className="matrix-row matrix-header">
          <div className="matrix-cell"></div>
          <div className="matrix-cell">Predicted Positive</div>
          <div className="matrix-cell">Predicted Negative</div>
        </div>
        <div className="matrix-row">
          <div className="matrix-cell">Actual Positive</div>
          <div className="matrix-cell true-positive">
            <div className="count">{truePositive}</div>
            <div className="percentage">
              ({((truePositive / total) * 100).toFixed(1)}%)
            </div>
          </div>
          <div className="matrix-cell false-negative">
            <div className="count">{falseNegative}</div>
            <div className="percentage">
              ({((falseNegative / total) * 100).toFixed(1)}%)
            </div>
          </div>
        </div>
        <div className="matrix-row">
          <div className="matrix-cell">Actual Negative</div>
          <div className="matrix-cell false-positive">
            <div className="count">{falsePositive}</div>
            <div className="percentage">
              ({((falsePositive / total) * 100).toFixed(1)}%)
            </div>
          </div>
          <div className="matrix-cell true-negative">
            <div className="count">{trueNegative}</div>
            <div className="percentage">
              ({((trueNegative / total) * 100).toFixed(1)}%)
            </div>
          </div>
        </div>
      </div>
      <div className="matrix-legend mt-3">
        <div className="legend-item">
          <div className="legend-color true-positive-bg"></div>
          <div className="legend-text">
            True Positive (TP): Correctly identified fraud
          </div>
        </div>
        <div className="legend-item">
          <div className="legend-color false-positive-bg"></div>
          <div className="legend-text">
            False Positive (FP): Incorrectly flagged as fraud
          </div>
        </div>
        <div className="legend-item">
          <div className="legend-color true-negative-bg"></div>
          <div className="legend-text">
            True Negative (TN): Correctly identified as legitimate
          </div>
        </div>
        <div className="legend-item">
          <div className="legend-color false-negative-bg"></div>
          <div className="legend-text">False Negative (FN): Missed fraud</div>
        </div>
      </div>
    </div>
  );
};

const AlgorithmPerformance = ({ data }) => {
  return (
    <div className="performance-charts">
      <h6 className="mb-3">Performance Metrics</h6>
      <div className="chart-grid">
        <div className="chart-container">
          <ResponsiveContainer width="100%" height={200}>
            <BarChart
              data={data}
              margin={{ top: 5, right: 20, left: 0, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis domain={[0, 100]} />
              <Tooltip
                formatter={(value) => [`${value}%`, "Value"]}
                labelFormatter={() => "Score"}
              />
              <Legend />
              <Bar dataKey="value" fill="#2548C2" name="Score (%)" />
            </BarChart>
          </ResponsiveContainer>
          <div className="chart-title">Algorithm Performance Metrics</div>
        </div>
        <div className="chart-container">
          <ResponsiveContainer width="100%" height={200}>
            <LineChart
              data={data.trendData}
              margin={{ top: 5, right: 20, left: 0, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis domain={[0, 100]} />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="precision"
                stroke="#8884d8"
                name="Precision"
              />
              <Line
                type="monotone"
                dataKey="recall"
                stroke="#82ca9d"
                name="Recall"
              />
              <Line
                type="monotone"
                dataKey="accuracy"
                stroke="#ff7300"
                name="Accuracy"
              />
            </LineChart>
          </ResponsiveContainer>
          <div className="chart-title">Performance Trend (Last 6 Months)</div>
        </div>
      </div>
    </div>
  );
};

const Details = () => {
  const [filter, setFilter] = useState("Precision");
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState("2025-04-15 14:32:05");
  const [algoVersion, setAlgoVersion] = useState("v2.3.1");

  // Reference to detect clicks outside the edit box
  const editBoxRef = useRef(null);

  const precisionContent = `
# Precision Metrics for Fraud Detection Algorithm

## Overview
Our fraud detection algorithm currently achieves a precision of **92.7%**. This means that when the system flags a transaction as fraudulent, it is correct 92.7% of the time.

## Importance of Precision
High precision is critical in fraud detection as it minimizes false positives. Each false positive results in:
- Legitimate customer transactions being declined
- Customer dissatisfaction and potential business loss
- Increased operational costs for manual reviews

## Recent Improvements
- Implemented gradient boosting models to improve feature importance weighting
- Added behavioral pattern analysis to reduce false alarms
- Enhanced the entity linking system to better identify connected fraudulent accounts

## Areas for Improvement
1. Improve precision for new customer accounts where historical data is limited
2. Reduce false positives for high-value legitimate transactions
3. Better handle seasonal variations in spending patterns

## Technical Details
The precision is calculated as:
\`\`\`
Precision = TP / (TP + FP)
\`\`\`
Where:
- TP (True Positives): 4,285 transactions
- FP (False Positives): 336 transactions

© Fraud Shield Analytics Team
  `;

  const recallContent = `
# Recall Performance Analysis

## Overview
Our fraud detection system currently achieves a recall rate of **87.3%**. This means the system successfully identifies 87.3% of all actual fraudulent transactions.

## Importance of Recall
Recall measures our ability to detect fraud when it actually occurs. A high recall rate is essential for:
- Minimizing financial losses due to undetected fraud
- Protecting the company's reputation and maintaining customer trust
- Meeting regulatory compliance requirements

## Recent Improvements
- Implemented deep learning networks to detect subtle fraud patterns
- Enhanced feature engineering for better detection of low-value test transactions
- Added real-time velocity checks across multiple transaction channels

## Areas for Improvement
1. Improve detection of sophisticated fraud schemes that evolve over time
2. Better identify first-party fraud where customer details are legitimate
3. Reduce missed detections during high transaction volume periods

## Technical Details
The recall is calculated as:
\`\`\`
Recall = TP / (TP + FN)
\`\`\`
Where:
- TP (True Positives): 4,285 transactions
- FN (False Negatives): 624 transactions

© Fraud Shield Analytics Team
  `;

  const confusionMatrixContent = `
# Confusion Matrix Analysis

## Overview
The confusion matrix provides a comprehensive view of our algorithm's performance by showing the counts of:
- True Positives: Correctly identified fraudulent transactions
- False Positives: Legitimate transactions incorrectly flagged as fraud
- True Negatives: Correctly identified legitimate transactions
- False Negatives: Fraudulent transactions that went undetected

## Key Insights
- Our algorithm correctly processes 99.2% of all legitimate transactions
- Only 0.8% of legitimate transactions are incorrectly flagged
- 87.3% of fraudulent transactions are successfully detected
- 12.7% of fraudulent transactions are missed

## Business Impact
- **Cost Savings**: Approximately $4.8M in prevented fraud losses in Q1 2025
- **Operational Efficiency**: 72% reduction in manual review workload
- **Customer Experience**: 45% decrease in false declines year-over-year

## Algorithm Tuning Considerations
The current algorithm is tuned to balance precision and recall, with a slight preference for precision to minimize customer friction. Business priorities may suggest different tuning approaches:
- **Risk-averse approach**: Increase recall at the expense of precision
- **Customer experience focus**: Increase precision at the expense of recall
- **Balanced approach**: Maintain current settings with iterative improvements

© Fraud Shield Analytics Team
  `;

  const [text, setText] = useState(precisionContent);
  const [textRecall, setTextRecall] = useState(recallContent);
  const [confusionText, setConfusionText] = useState(confusionMatrixContent);
  const [currentEditText, setCurrentEditText] = useState("");

  const [confusionMatrixData, setConfusionMatrixData] = useState({
    truePositive: 4285,
    falsePositive: 336,
    trueNegative: 41254,
    falseNegative: 624,
  });

  const [performanceData, setPerformanceData] = useState({
    metrics: [
      { name: "Precision", value: 92.7 },
      { name: "Recall", value: 87.3 },
      { name: "Accuracy", value: 97.9 },
      { name: "F1 Score", value: 89.9 },
    ],
    trendData: [
      { month: "Nov", precision: 88.2, recall: 84.5, accuracy: 96.5 },
      { month: "Dec", precision: 89.5, recall: 85.1, accuracy: 96.8 },
      { month: "Jan", precision: 90.8, recall: 85.9, accuracy: 97.2 },
      { month: "Feb", precision: 91.5, recall: 86.4, accuracy: 97.6 },
      { month: "Mar", precision: 92.1, recall: 86.8, accuracy: 97.8 },
      { month: "Apr", precision: 92.7, recall: 87.3, accuracy: 97.9 },
    ],
  });

  // Handle outside clicks to cancel editing
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        editBoxRef.current &&
        !editBoxRef.current.contains(event.target) &&
        isEditing
      ) {
        handleCancelEdit();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isEditing]);

  const handleEdit = () => {
    let contentToEdit;

    switch (filter) {
      case "Precision":
        contentToEdit = text;
        break;
      case "Recall":
        contentToEdit = textRecall;
        break;
      case "Confusion Matrix":
        contentToEdit = confusionText;
        break;
      default:
        contentToEdit = "";
    }

    setCurrentEditText(contentToEdit);
    setIsEditing(true);
  };

  const handleTextChange = (e) => {
    setCurrentEditText(e.target.value);
  };

  const handleSave = () => {
    setIsLoading(true);

    // Simulate API call to save changes
    setTimeout(() => {
      switch (filter) {
        case "Precision":
          setText(currentEditText);
          break;
        case "Recall":
          setTextRecall(currentEditText);
          break;
        case "Confusion Matrix":
          setConfusionText(currentEditText);
          break;
        default:
          break;
      }

      setIsEditing(false);
      setIsLoading(false);
      setLastUpdated(
        new Date().toISOString().replace("T", " ").substring(0, 19)
      );
      toast.success(`${filter} documentation updated successfully`);
    }, 800);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
  };

  const handleDownload = () => {
    // Create content based on current filter
    let content;
    let filename;

    switch (filter) {
      case "Precision":
        content = text;
        filename = "precision_metrics.md";
        break;
      case "Recall":
        content = textRecall;
        filename = "recall_metrics.md";
        break;
      case "Confusion Matrix":
        content = confusionText;
        filename = "confusion_matrix_analysis.md";
        break;
      default:
        content = "";
        filename = "algorithm_details.md";
    }

    // Create a blob and download it
    const blob = new Blob([content], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast.info(`${filename} downloaded`);
  };

  const renderContent = () => {
    switch (filter) {
      case "Precision":
        return (
          <>
            <div className="markdown-content">
              <ReactMarkdown>{text}</ReactMarkdown>
            </div>
            <AlgorithmPerformance
              data={{
                ...performanceData.metrics.filter(
                  (m) => m.name === "Precision" || m.name === "F1 Score"
                ),
                trendData: performanceData.trendData.map((item) => ({
                  month: item.month,
                  precision: item.precision,
                  accuracy: item.accuracy,
                })),
              }}
            />
          </>
        );
      case "Recall":
        return (
          <>
            <div className="markdown-content">
              <ReactMarkdown>{textRecall}</ReactMarkdown>
            </div>
            <AlgorithmPerformance
              data={{
                ...performanceData.metrics.filter(
                  (m) => m.name === "Recall" || m.name === "F1 Score"
                ),
                trendData: performanceData.trendData.map((item) => ({
                  month: item.month,
                  recall: item.recall,
                  accuracy: item.accuracy,
                })),
              }}
            />
          </>
        );
      case "Confusion Matrix":
        return (
          <>
            <div className="markdown-content">
              <ReactMarkdown>{confusionText}</ReactMarkdown>
            </div>
            <ConfusionMatrix data={confusionMatrixData} />
          </>
        );
      default:
        return "Default Content Placeholder.";
    }
  };

  return (
    <div className="details-container">
      <div className="details-header">
        <div className="user-info">
          <div className="user-text">
            {/* <span className="user-name">John Deo</span>
            <span className="user-role">Admin</span> */}
          </div>
          <img src="/user.png" alt="User Avatar" className="user-avatar" />
        </div>
      </div>

      <div className="d-flex justify-content-between align-items-center mb-3">
        <h3 style={{ color: "black" }}>Algorithm Details</h3>
        <div className="algorithm-meta">
          <span className="algorithm-version">Version: {algoVersion}</span>
          <span className="algorithm-updated">Last updated: {lastUpdated}</span>
        </div>
      </div>

      <div className="buttons-container mb-4">
        <button
          className={`action-button ${filter === "Precision" ? "active" : ""}`}
          onClick={() => setFilter("Precision")}
        >
          Precision
        </button>
        <button
          className={`action-button ${filter === "Recall" ? "active" : ""}`}
          onClick={() => setFilter("Recall")}
        >
          Recall
        </button>
        <button
          className={`action-button ${
            filter === "Confusion Matrix" ? "active" : ""
          }`}
          onClick={() => setFilter("Confusion Matrix")}
        >
          Confusion Matrix
        </button>
      </div>

      <MDBCard className="grey-card">
        <MDBCardBody>
          <div className="card-header-container">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h5 style={{ color: "black", margin: 0 }}>{filter}</h5>
              <div className="action-buttons">
                <button
                  className="icon-button"
                  onClick={handleDownload}
                  title="Download as Markdown"
                >
                  <FaDownload />
                </button>
                <div
                  className="editbox"
                  onClick={handleEdit}
                  style={{ cursor: "pointer" }}
                >
                  <span className="spanedit">Edit</span>
                  <span className="edit-icon">
                    <LuPencilLine />
                  </span>
                </div>
              </div>
            </div>
            <div className="metric-summary">
              {filter === "Precision" && (
                <div className="metric-value">92.7%</div>
              )}
              {filter === "Recall" && <div className="metric-value">87.3%</div>}
              {filter === "Confusion Matrix" && (
                <div className="metric-summary-stats">
                  <div className="summary-stat">
                    <span className="stat-label">Accuracy</span>
                    <span className="stat-value">97.9%</span>
                  </div>
                  <div className="summary-stat">
                    <span className="stat-label">F1 Score</span>
                    <span className="stat-value">89.9%</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {isEditing ? (
            <div className="edit-container" ref={editBoxRef}>
              <div className="edit-header">
                <h6>Editing {filter} Documentation</h6>
                <div className="markdown-hint">
                  <FaRegQuestionCircle />
                  <span>Markdown supported</span>
                </div>
              </div>
              <textarea
                value={currentEditText}
                onChange={handleTextChange}
                className="edit-textarea"
              />
              <div className="edit-actions">
                <MDBBtn
                  color="secondary"
                  size="sm"
                  onClick={handleCancelEdit}
                  disabled={isLoading}
                >
                  <FaTimes className="me-1" /> Cancel
                </MDBBtn>
                <MDBBtn
                  color="primary"
                  size="sm"
                  onClick={handleSave}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <MDBSpinner size="sm" className="me-1" /> Saving...
                    </>
                  ) : (
                    <>
                      <FaSave className="me-1" /> Save Changes
                    </>
                  )}
                </MDBBtn>
              </div>
            </div>
          ) : (
            <MDBCardBody className="content-container">
              {renderContent()}
            </MDBCardBody>
          )}
        </MDBCardBody>
      </MDBCard>
    </div>
  );
};

export default Details;
