import React from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, Button, Paper, Typography } from "@mui/material";

const TermsPage = () => {
  return (
    <div style={{ display: "flex", justifyContent: "center", marginTop: "40px" }}>
      <Paper elevation={3} sx={{ p: 4, borderRadius: 2, maxWidth: 800 }}>
        <Card>
          <CardContent>
            <Typography variant="h4" sx={{ textAlign: "center", mb: 2 }}>
              Terms and Conditions
            </Typography>

            <Typography variant="body2" color="textSecondary" sx={{ textAlign: "center" }}>
              Last updated: March 2025
            </Typography>

            <hr />

            <Typography variant="h6" sx={{ mt: 2 }}>
              1. Introduction
            </Typography>
            <Typography variant="body1">
              Welcome to our platform! By accessing or using our services, you agree to abide by the following terms and conditions. Please read them carefully.
            </Typography>

            <Typography variant="h6" sx={{ mt: 2 }}>
              2. User Responsibilities
            </Typography>
            <Typography variant="body1">
              Users must provide accurate information when registering. Any misuse, fraud, or violation of these terms may result in account suspension.
            </Typography>

            <Typography variant="h6" sx={{ mt: 2 }}>
              3. Prohibited Activities
            </Typography>
            <ul>
              <li>Engaging in fraudulent activities</li>
              <li>Sharing false or misleading information</li>
              <li>Violating any applicable laws or regulations</li>
            </ul>

            <Typography variant="h6" sx={{ mt: 2 }}>
              4. Privacy Policy
            </Typography>
            <Typography variant="body1">
              We respect your privacy. Your data will only be used in accordance with our{" "}
              <Link to="/privacy-policy">Privacy Policy</Link>.
            </Typography>

            <Typography variant="h6" sx={{ mt: 2 }}>
              5. Modifications
            </Typography>
            <Typography variant="body1">
              We reserve the right to update these terms at any time. Continued use of the platform implies acceptance of the latest version.
            </Typography>

            <Typography variant="h6" sx={{ mt: 2 }}>
              6. Contact Us
            </Typography>
            <Typography variant="body1">
              If you have any questions regarding these terms, feel free to <Link to="/contact">contact us</Link>.
            </Typography>

            <div style={{ textAlign: "center", marginTop: "20px" }}>
              <Button variant="contained" color="primary" component={Link} to="/register">
                Back to Register
              </Button>
            </div>
          </CardContent>
        </Card>
      </Paper>
    </div>
  );
};

export default TermsPage;
