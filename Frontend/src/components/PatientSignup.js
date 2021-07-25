import React, { useRef, useState } from "react";
import { Form, Button, Card, Alert } from "react-bootstrap";
import { useAuth } from "../contexts/AuthContext";
import { Link, useHistory } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import { db } from "../firebase";
import "./styles.css";

export default function PatientSignup() {
  const emailRef = useRef();
  const passwordRef = useRef();
  const passwordConfirmRef = useRef();
  const lastNameRef = useRef();
  const [phoneNumber, setPhoneNumber] = useState("");
  const [firstName, setFirstName] = useState("");
  const { signup } = useAuth();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const history = useHistory();

  async function handleSubmit(e) {
    e.preventDefault();
    if (passwordRef.current.value !== passwordConfirmRef.current.value) {
      return setError("Passwords do not match");
    }
    try {
      setError("");
      setLoading(true);
      const user = await signup(
        emailRef.current.value,
        passwordRef.current.value
      );
      const userPatientRef = await db.collection("users").add({
        email: emailRef.current.value,
        usertype: "Patient",
      });
      const userRef = await db.collection("patients").add({
        firstname: firstName,
        lastname: lastNameRef.current.value,
        email: emailRef.current.value,
        phonenumber: phoneNumber,
        password: passwordRef.current.value,
      });
      history.push("/");
    } catch {
      setError("Failed to create an account");
    }
    setLoading(false);
  }
  const onChangeHandler = (event) => {
    const { name, value } = event.currentTarget;
    if (name === "firstName") {
      setFirstName(value);
    } else if (name === "phoneNumber") {
      setPhoneNumber(value);
    }
  };

  return (
    <div className="main-panel">
      <Form onSubmit={handleSubmit} className="signup-form">
        <h2 className="text-left mb-4 signup-header">Patient-Sign Up</h2>
        {error && <Alert variant="danger">{error}</Alert>}
        <Form.Row>
          <Form.Group id="firstName" className="form-group">
            <Form.Label>FirstName</Form.Label>
            <Form.Control
              type="text"
              name="firstName"
              value={firstName}
              onChange={(event) => onChangeHandler(event)}
              required
            />
          </Form.Group>
          <Form.Group id="lastName" className="form-group">
            <Form.Label>LastName</Form.Label>
            <Form.Control type="text" ref={lastNameRef} />
          </Form.Group>
        </Form.Row>
        <Form.Row>
          <Form.Group id="email" className="form-group">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              ref={emailRef}
              required
              placeholder="ex:- gxgg@email.com"
            />
          </Form.Group>
          <Form.Group id="phoneNumber">
            <Form.Label>PhoneNumber</Form.Label>
            <Form.Control
              type="tel"
              name="phoneNumber"
              value={phoneNumber}
              onChange={(event) => onChangeHandler(event)}
              placeholder="012-345-6789"
              pattern="[0-9]{3}-[0-9]{3}-[0-9]{4}"
            />
          </Form.Group>
        </Form.Row>
        <Form.Row>
          <Form.Group id="password">
            <Form.Label>Password</Form.Label>
            <Form.Control type="password" ref={passwordRef} required />
          </Form.Group>
          <Form.Group id="password-confirm">
            <Form.Label>Password Confirmation</Form.Label>
            <Form.Control type="password" ref={passwordConfirmRef} required />
          </Form.Group>
        </Form.Row>
        <Button disabled={loading} className="signup-style" type="submit">
          Sign Up
        </Button>
        <div className="w-100 text-center mt-2">
          Already have an account? <Link to="/login">Log In</Link>
        </div>
      </Form>
    </div>
  );
}
