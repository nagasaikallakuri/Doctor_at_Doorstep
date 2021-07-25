import React, { useRef, useState } from "react";
import { Form, Button, Card, Alert } from "react-bootstrap";
import { useAuth } from "../contexts/AuthContext";
import { Link, useHistory } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import { db } from "../firebase";
import "./styles.css";
import PlacesAutocomplete, {
  geocodeByAddress,
  geocodeByPlaceId,
  getLatLng,
} from "react-places-autocomplete";
const geofire = require("geofire-common");

export default function DoctorSignup() {
  const emailRef = useRef();
  const passwordRef = useRef();
  const passwordConfirmRef = useRef();
  const lastNameRef = useRef();
  const [phoneNumber, setPhoneNumber] = useState("");
  const [firstName, setFirstName] = useState("");
  const [address2, setAddress2] = useState("");
  const [availableFrom, setAvailableFrom] = useState("");
  const [availableTo, setAavailableTo] = useState("");
  const [upin, setUpin] = useState("");
  const [hashedpoint, sethashedpoint] = useState("");
  const { signup } = useAuth();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [address, setAddress] = useState("");
  const [coordinates, setCoordinates] = useState({ lat: null, lng: null });
  const history = useHistory();

  const handleSelect = async (value) => {
    const results = await geocodeByAddress(value);
    const ll = await getLatLng(results[0]);
    setAddress(value);
    setCoordinates(ll);
    const temphashedpoint = geofire.geohashForLocation([ll.lat, ll.lng]);
    sethashedpoint(temphashedpoint);
  };

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

      const userDoctorRef = await db.collection("users").add({
        email: emailRef.current.value,
        usertype: "Doctor",
      });

      const userRef = await db.collection("doctors").add({
        firstname: firstName,
        lastname: lastNameRef.current.value,
        email: emailRef.current.value,
        phonenumber: phoneNumber,
        password: passwordRef.current.value,
        lat: coordinates.lat,
        lng: coordinates.lng,
        hash: hashedpoint,
        upin: upin,
        address: address,
        address2: address2,
        availablefrom: availableFrom,
        availableto: availableTo,
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
    } else if (name === "address2") {
      setAddress2(value);
    } else if (name === "upin") {
      setUpin(value);
    } else if (name === "availablefrom") {
      setAvailableFrom(value);
    } else if (name === "availableto") {
      setAavailableTo(value);
    }
  };

  return (
    <div className="main-panel">
      <Form onSubmit={handleSubmit} className="signup-form">
        <h2 className="text-left mb-4 signup-header">Doctor-Sign Up</h2>
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
                        ? { backgroundColor: "#fafafa", cursor: "pointer" }
                        : { backgroundColor: "#ffffff", cursor: "pointer" };
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
        <Form.Row>
          <Form.Group id="upin">
            <Form.Label>UPIN</Form.Label>
            <Form.Control
              type="text"
              name="upin"
              value={upin}
              onChange={(event) => onChangeHandler(event)}
              maxLength="6"
            />
          </Form.Group>
          <Form.Group id="availability">
            <Form.Label>Availability</Form.Label>
            <Form.Control
              type="time"
              name="availablefrom"
              value={availableFrom}
              hour12={false}
              onChange={(event) => onChangeHandler(event)}
            />
            <Form.Control
              type="time"
              name="availableto"
              value={availableTo}
              hour12={false}
              onChange={(event) => onChangeHandler(event)}
            />
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
