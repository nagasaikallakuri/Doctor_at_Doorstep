import React, { useState } from "react";
import { Card, Button, Alert, Form } from "react-bootstrap";
import { useAuth } from "../contexts/AuthContext";
import { Link, useHistory } from "react-router-dom";
import { db } from "../firebase";
import PlacesAutocomplete, {
  geocodeByAddress,
  geocodeByPlaceId,
  getLatLng,
} from "react-places-autocomplete";
import "./styles.css";
const axios = require("axios");
const geofire = require("geofire-common");

export default function PatientDashboard() {
  const topicName = "projects/long-base-311903/topics/request_sent";
  const [error, setError] = useState("");
  const { currentUser, logout } = useAuth();
  const [requestReason, setRequesrReason] = useState("");
  const [address2, setAddress2] = useState("");
  const [address, setAddress] = useState("");
  const [coordinates, setCoordinates] = useState({ lat: null, lng: null });
  const [hashedpoint, sethashedpoint] = useState("");
  const history = useHistory();

  const handleSelect = async (value) => {
    const results = await geocodeByAddress(value);
    const ll = await getLatLng(results[0]);
    setAddress(value);
    setCoordinates(ll);
    const temphashedpoint = geofire.geohashForLocation([ll.lat, ll.lng]);
    sethashedpoint(temphashedpoint);
  };

  // function genratehunHandler() {

  //   async function generateHun() {
  //     const requestIds = [];
  //     const batch = db.batch();
  //     for (let i = 0; i < 100; i++) {
  //       var request = "request load" + i;
  //       var newRef = db.collection("requests").doc();
  //       requestIds.push(newRef);
  //       batch.set(newRef, {
  //         reason: request,
  //         lat: 33.40088667806764,
  //         lng: -111.95526214227006,
  //         userEmail: "testdummy" + i + "@gmail.com",
  //       });
  //     }
  //     await batch.commit();
  //     return requestIds;
  //   }
  //   generateHun().then((requestIds) => {

  //     for (const refDoc in requestIds) {
  //       axios.post("https://long-base-311903.uc.r.appspot.com/", {
  //         data: refDoc,
  //       });
  //     }
  //   });
  // }

  async function genratehunHandler() {
    const requestIds = [];
    const batch = db.batch();
    function generateHun() {
      for (let i = 0; i < 100; i++) {
        var request = "request load" + i;
        var newRef = db.collection("requests").doc();

        requestIds.push(newRef.id);
        console.log(newRef.id);
        batch.set(newRef, {
          reason: request,
          lat: 33.40088667806764,
          lng: -111.95526214227006,
          userEmail: "testdummy" + i + "@gmail.com",
        });
      }
    }
    generateHun();
    await batch.commit().then(() => {
      console.log("Start 5s");
      setTimeout(function () {
        console.log("waited 5s");
        for (let i = 0; i < 100; i++) {
          axios.post("https://long-base-311903.uc.r.appspot.com/", {
            data: requestIds[i],
          });
        }
      }, 5000);
    });
    setError("100 Requests Sent Successfully");
  }

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      setError("");

      const userRef = await db.collection("requests").add({
        email: currentUser.email,
        requestreason: requestReason,
        lat: coordinates.lat,
        lng: coordinates.lng,
        hash: hashedpoint,
        address: address,
        address2: address2,
      });
      const res = await axios
        .post("https://long-base-311903.uc.r.appspot.com/", {
          data: userRef.id,
        })
        .then(
          (response) => {
            console.log("Hi", response);
          },
          (error) => {
            console.log(error);
          }
        );
      history.push("/");
      setError("Request Sent Successfully");
      console.log(userRef.id);
    } catch {
      setError("Failed to Send a Request");
    }
  }

  const onChangeHandler = (event) => {
    const { name, value } = event.currentTarget;
    if (name === "requestReason") {
      setRequesrReason(value);
    } else if (name === "address2") {
      setAddress2(value);
    }
  };

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
              <strong>Hello Patient</strong> {currentUser.email}
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
            <Form onSubmit={handleSubmit} className="patient-request-form">
              <h2 className="text-left mb-4 signup-header">Request</h2>
              {error && <Alert variant="danger">{error}</Alert>}
              <Form.Row>
                <Form.Group id="email" className="form-group">
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    type="email"
                    value={currentUser.email}
                    readonly
                  />
                </Form.Group>
                <Form.Group id="requestReason">
                  <Form.Label>Request Reason</Form.Label>
                  <Form.Control
                    type="text"
                    name="requestReason"
                    value={requestReason}
                    onChange={(event) => onChangeHandler(event)}
                  />
                </Form.Group>
              </Form.Row>

              <Form.Row>
                <Form.Group id="address">
                  <Form.Label>Address</Form.Label>
                  <PlacesAutocomplete
                    value={address}
                    onChange={setAddress}
                    onSelect={handleSelect}
                  >
                    {({
                      getInputProps,
                      suggestions,
                      getSuggestionItemProps,
                      loading,
                    }) => (
                      <div>
                        <input
                          {...getInputProps({
                            placeholder: "Search Places ...",
                            className: "location-search-input",
                          })}
                        />
                        <div className="autocomplete-dropdown-container">
                          {loading && <div>Loading...</div>}
                          {suggestions.map((suggestion) => {
                            const className = suggestion.active
                              ? "suggestion-item--active"
                              : "suggestion-item";
                            // inline style for demonstration purpose
                            const style = suggestion.active
                              ? {
                                  backgroundColor: "#fafafa",
                                  cursor: "pointer",
                                }
                              : {
                                  backgroundColor: "#ffffff",
                                  cursor: "pointer",
                                };
                            return (
                              <div
                                {...getSuggestionItemProps(suggestion, {
                                  className,
                                  style,
                                })}
                              >
                                <span>{suggestion.description}</span>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </PlacesAutocomplete>
                </Form.Group>
                <Form.Group id="address2">
                  <Form.Label>Address2</Form.Label>
                  <Form.Control
                    type="text"
                    name="address2"
                    value={address2}
                    onChange={(event) => onChangeHandler(event)}
                  />
                </Form.Group>
              </Form.Row>

              <Button className="signup-style" type="submit">
                Submit Request
              </Button>
            </Form>
          </div>
          <Button type="submit" onClick={genratehunHandler}>
            HundredRequests
          </Button>
        </Card.Body>
      </Card>
    </div>
  );
}
