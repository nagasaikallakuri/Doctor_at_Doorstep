import React, { useState } from "react";
import { Card, Button, Alert } from "react-bootstrap";
import { useAuth } from "../contexts/AuthContext";
import { Link, useHistory } from "react-router-dom";
import "./styles.css";
import { db } from "../firebase";

export default function DoctorDashboard() {
  const [error, setError] = useState("");
  const { currentUser, logout } = useAuth();
  const history = useHistory();

  async function getRequestlist() {
    let temp;
    const q = await db
      .collection("doctors")
      .where("email", "==", "test1@gmail.com");
    const p = await q.get();
    const t = await p.forEach((doc) => {
      temp = doc.data().requestids;
      console.log(temp);
      return 0;
    });
  }

  async function handleLogout() {
    setError("");
    try {
      await logout();
      history.push("/login");
    } catch {
      setError("Failed to log out");
    }
  }

  return (
    <div className="patient-main-panel">
      <Card>
        <Card.Body>
          <h2 className="text-center mb-4">Welcome</h2>
          {error && <Alert variant="danger">{error}</Alert>}
          <div>
            <div className="row-flex">
              <strong>Hello Doctor </strong> {currentUser.email}
              <Link
                to="/update-profile"
                className="patient-update-profile btn btn-primary w-100 mt-3"
              >
                Update Profile
              </Link>
              <div className="w-40 text-center mt-2">
                <Button variant="link" onClick={handleLogout}>
                  Log Out
                </Button>
              </div>
            </div>
          </div>
          <Button onClick={getRequestlist}> Show Requests</Button>
        </Card.Body>
      </Card>
    </div>
  );
}
