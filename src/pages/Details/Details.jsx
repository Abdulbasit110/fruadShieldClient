import React, { useState } from "react";
import { MDBCard, MDBCardBody } from 'mdb-react-ui-kit';
import "./details.scss";
import { LuPencilLine } from "react-icons/lu";

const Details = () => {
  const [filter, setFilter] = useState("Precision");
  const [isEditing, setIsEditing] = useState(false);
  const [text, setText] = useState(
    `1. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque aliquet et massa non euismod. Nunc tincidunt, turpis et finibus volutpat, sapien nunc consequat lectus, id ultrices mauris ante non justo. Ut vehicula magna at convallis vehicula. In lacus sapien, rutrum ut interdum vel, condimentum non sem. In vel orci tristique, vestibulum metus et, consequat sapien. In pellentesque porta ipsum vel consequat. Duis volutpat magna magna, in lacinia nibh dictum sagittis. Curabitur sit amet malesuada quam. Integer accumsan metus et lorem ullamcorper, nec mollis nibh lacinia. Nullam congue, leo et fermentum pulvinar, nibh dolor laoreet quam, a cursus dolor leo vitae purus. Mauris semper vitae dui at vestibulum.\n\n
     1. Praesent venenatis viverra nunc. Praesent pellentesque, felis ut ullamcorper viverra, odio ante porttitor sapien, non facilisis augue lorem vitae felis. Nullam molestie pellentesque metus vitae imperdiet. Sed ultricies vestibulum lacus, sit amet congue ligula luctus at. Aliquam mattis convallis varius. Quisque ac ante molestie, tincidunt nulla ut, varius lectus. Pellentesque ut arcu feugiat sem malesuada fermentum vel sit amet diam. Interdum et malesuada fames ac ante ipsum primis in faucibus. Donec neque est, interdum sed dui ac, suscipit egestas ipsum. Vivamus efficitur, neque a lobortis condimentum, neque diam rutrum quam, feugiat consequat dolor diam a lacus.\n\n
     1. Etiam non diam nec sapien ornare maximus. Etiam volutpat, urna sed suscipit accumsan, libero libero maximus leo, mattis auctor libero leo quis mauris. Pellentesque ultricies erat eu ligula tempus aliquam. Integer finibus posuere mauris a laoreet. Vestibulum dictum gravida leo, in mattis nisi dictum eget. Duis laoreet tellus venenatis ipsum congue, a bibendum tellus dapibus. Nulla porttitor ex volutpat sapien porta accumsan. Mauris euismod feugiat laoreet. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae;\n\n
     1. Duis tincidunt, velit eu congue sollicitudin, ex purus pellentesque ligula, nec facilisis ipsum felis placerat odio. Maecenas vulputate feugiat turpis. Suspendisse in diam at libero semper maximus vel eget felis. Duis et risus tortor. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur id ullamcorper lectus. Ut leo neque, lacinia vel erat quis, fringilla viverra turpis. Nulla aliquet, ipsum a pulvinar maximus, libero odio imperdiet nunc, ut vestibulum urna erat ac eros. Nulla eu urna id lectus egestas aliquam non sed enim.
  `);

  const [textrecall, setTextRecall] = useState(
    `1. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque aliquet et massa non euismod. Nunc tincidunt, turpis et finibus volutpat, sapien nunc consequat lectus, id ultrices mauris ante non justo. Ut vehicula magna at convallis vehicula. In lacus sapien, rutrum ut interdum vel, condimentum non sem. In vel orci tristique, vestibulum metus et, consequat sapien. In pellentesque porta ipsum vel consequat. Duis volutpat magna magna, in lacinia nibh dictum sagittis. Curabitur sit amet malesuada quam. Integer accumsan metus et lorem ullamcorper, nec mollis nibh lacinia. Nullam congue, leo et fermentum pulvinar, nibh dolor laoreet quam, a cursus dolor leo vitae purus. Mauris semper vitae dui at vestibulum.\n\n
     1. Praesent venenatis viverra nunc. Praesent pellentesque, felis ut ullamcorper viverra, odio ante porttitor sapien, non facilisis augue lorem vitae felis. Nullam molestie pellentesque metus vitae imperdiet. Sed ultricies vestibulum lacus, sit amet congue ligula luctus at. Aliquam mattis convallis varius. Quisque ac ante molestie, tincidunt nulla ut, varius lectus. Pellentesque ut arcu feugiat sem malesuada fermentum vel sit amet diam. Interdum et malesuada fames ac ante ipsum primis in faucibus. Donec neque est, interdum sed dui ac, suscipit egestas ipsum. Vivamus efficitur, neque a lobortis condimentum, neque diam rutrum quam, feugiat consequat dolor diam a lacus.\n\n
     1. Etiam non diam nec sapien ornare maximus. Etiam volutpat, urna sed suscipit accumsan, libero libero maximus leo, mattis auctor libero leo quis mauris. Pellentesque ultricies erat eu ligula tempus aliquam. Integer finibus posuere mauris a laoreet. Vestibulum dictum gravida leo, in mattis nisi dictum eget. Duis laoreet tellus venenatis ipsum congue, a bibendum tellus dapibus. Nulla porttitor ex volutpat sapien porta accumsan. Mauris euismod feugiat laoreet. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae;\n\n
     1. Duis tincidunt, velit eu congue sollicitudin, ex purus pellentesque ligula, nec facilisis ipsum felis placerat odio. Maecenas vulputate feugiat turpis. Suspendisse in diam at libero semper maximus vel eget felis. Duis et risus tortor. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur id ullamcorper lectus. Ut leo neque, lacinia vel erat quis, fringilla viverra turpis. Nulla aliquet, ipsum a pulvinar maximus, libero odio imperdiet nunc, ut vestibulum urna erat ac eros. Nulla eu urna id lectus egestas aliquam non sed enim.
  `);
  const [confusionText, setTextConfusion] = useState(
    `1. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque aliquet et massa non euismod. Nunc tincidunt, turpis et finibus volutpat, sapien nunc consequat lectus, id ultrices mauris ante non justo. Ut vehicula magna at convallis vehicula. In lacus sapien, rutrum ut interdum vel, condimentum non sem. In vel orci tristique, vestibulum metus et, consequat sapien. In pellentesque porta ipsum vel consequat. Duis volutpat magna magna, in lacinia nibh dictum sagittis. Curabitur sit amet malesuada quam. Integer accumsan metus et lorem ullamcorper, nec mollis nibh lacinia. Nullam congue, leo et fermentum pulvinar, nibh dolor laoreet quam, a cursus dolor leo vitae purus. Mauris semper vitae dui at vestibulum.\n\n
     1. Praesent venenatis viverra nunc. Praesent pellentesque, felis ut ullamcorper viverra, odio ante porttitor sapien, non facilisis augue lorem vitae felis. Nullam molestie pellentesque metus vitae imperdiet. Sed ultricies vestibulum lacus, sit amet congue ligula luctus at. Aliquam mattis convallis varius. Quisque ac ante molestie, tincidunt nulla ut, varius lectus. Pellentesque ut arcu feugiat sem malesuada fermentum vel sit amet diam. Interdum et malesuada fames ac ante ipsum primis in faucibus. Donec neque est, interdum sed dui ac, suscipit egestas ipsum. Vivamus efficitur, neque a lobortis condimentum, neque diam rutrum quam, feugiat consequat dolor diam a lacus.\n\n
     1. Etiam non diam nec sapien ornare maximus. Etiam volutpat, urna sed suscipit accumsan, libero libero maximus leo, mattis auctor libero leo quis mauris. Pellentesque ultricies erat eu ligula tempus aliquam. Integer finibus posuere mauris a laoreet. Vestibulum dictum gravida leo, in mattis nisi dictum eget. Duis laoreet tellus venenatis ipsum congue, a bibendum tellus dapibus. Nulla porttitor ex volutpat sapien porta accumsan. Mauris euismod feugiat laoreet. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae;\n\n
     1. Duis tincidunt, velit eu congue sollicitudin, ex purus pellentesque ligula, nec facilisis ipsum felis placerat odio. Maecenas vulputate feugiat turpis. Suspendisse in diam at libero semper maximus vel eget felis. Duis et risus tortor. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur id ullamcorper lectus. Ut leo neque, lacinia vel erat quis, fringilla viverra turpis. Nulla aliquet, ipsum a pulvinar maximus, libero odio imperdiet nunc, ut vestibulum urna erat ac eros. Nulla eu urna id lectus egestas aliquam non sed enim.
  `);

  // const handleEdit = () => {
  //   setIsEditing(!isEditing);
  // };

  // const handleTextChange = (e) => {
  //   setText(e.target.value);
  // };

  const renderContent = () => {
    switch (filter) {
      case "Precision":
        return text.split("\n").map((line, index) => <p key={index}>{line}</p>);
      case "Recall":
        return textrecall.split("\n").map((line, index) => <p key={index}>{line}</p>);
        case "Confusion Matrix":
          return confusionText.split("\n").map((line, index) => <p key={index}>{line}</p>);
      default:
        return "Default Content Placeholder.";
    }
  };

  return (
    <div className="details-container">
      <div className="details-header">
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
      <h3 style={{ color: "black" }}>Algorithm Details</h3>

      <div className="buttons-container">
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
          className={`action-button ${filter === "Confusion Matrix" ? "active" : ""}`}
          onClick={() => setFilter("Confusion Matrix")}
        >
          Confusion Matrix
        </button>
      </div>

      <MDBCard className="grey-card">
        <MDBCardBody>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <h5 style={{ color: "black" }}>{filter}</h5>

            {/* onClick={handleEdit} */}
            <div className="editbox"  style={{ cursor: "pointer" }}>
              <span className="spanedit">Edit</span>
              <span
                style={{
                  margin: "5px",
                  marginBottom: "0px",
                  position: "relative",
                  top: "-1.8px",
                  fontSize: "15px",
                }}
              >
                <LuPencilLine />
              </span>
            </div>
          </div>

{/* For future - will not work */}
          {isEditing ? (
            <textarea
              value={text}
              onChange={handleTextChange}
              style={{ width: "100%", height: "200px", marginTop: "10px" }}
            />
          ) : (

            <MDBCardBody className="greycard">{renderContent()}</MDBCardBody>
          )}
        </MDBCardBody>
      </MDBCard>
    </div>
  );
};

export default Details;
