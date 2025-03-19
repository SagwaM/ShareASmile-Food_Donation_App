import React from "react";
import { Link } from "react-router-dom";

const TermsPage = () => {
  return (
    <div className="container mt-5">
      <h2>Terms and Conditions</h2>
      <p>Welcome to our Terms and Conditions page.</p>
      <p>By using this platform, you agree to the following terms...</p>

      <Link to="/register" className="btn btn-primary mt-3">
        Go Back to Register
      </Link>
    </div>
  );
};

export default TermsPage;
