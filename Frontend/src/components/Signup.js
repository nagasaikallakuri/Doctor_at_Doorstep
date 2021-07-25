import React, { useRef, useState } from "react";
import { Form, Button, Card, Alert } from "react-bootstrap";
import { Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./styles.css";

export default function Signup() {
  return (
    <div className="main-panel">
      <Form className="signup-form">
        <h2 className="text-left mb-2 signup-header">Select User Type</h2>
        <Form.Row>
          <Link className="signupbutton-style" to="/login">
            Cancel
          </Link>
          <Button className="signupbutton-style">
            <Link to="/doctor-signup" className="signup-label">
              Doctor SignUp
            </Link>
          </Button>
          <Button className="signupbutton-style">
            <Link to="/patient-signup" className="signup-label">
              Patient SignUp
            </Link>
          </Button>
        </Form.Row>
      </Form>
    </div>
  );
}
