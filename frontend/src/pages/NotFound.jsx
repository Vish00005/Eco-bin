import { Link } from "react-router-dom";
import "../styles/error.css";

export default function NotFound() {
  return (
    <div className="error-page">
      <div className="container" style={{ paddingTop: "100px", minHeight: "70vh" }}>
        <div className="error-box">
          <h1>404 - Page Not Found</h1>
          <Link to="/">Go Home</Link>
        </div>
      </div>
    </div>
  );
}
