import React, { useState, useContext } from "react";
import { Form, Button, Alert } from "react-bootstrap";
import {
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import { auth, db } from "../firebase/firebase";
import { setDoc, doc } from "firebase/firestore";
import { AuthContext } from "../contextApi/AuthContext";
import { FaGooglePlusG } from "react-icons/fa";

const Login = () => {
  const { login } = useContext(AuthContext);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const validate = () => {
    let formErrors = {};
    if (!formData.email) formErrors.email = "Email is required.";
    else if (!/\S+@\S+\.\S+/.test(formData.email))
      formErrors.email = "Invalid email format.";
    if (!formData.password) formErrors.password = "Password is required.";
    setErrors(formErrors);
    return Object.keys(formErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setErrors({ ...errors, [name]: "" }); // Clear the error for the field being edited
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    const { email, password } = formData;

    try {
      const response = await signInWithEmailAndPassword(auth, email, password);
      if (response?._tokenResponse) {
        login(response.user, response._tokenResponse);
        setSuccessMessage("Login successful! Redirecting...");
        setErrorMessage("");
        // Optionally, save token to local storage or context
        // localStorage.setItem("token", data.token);
        setTimeout(() => {
          // Redirect to another page (e.g., home)
          window.location.href = "/";
        }, 2000);
      } else {
        const errorData = await response.json();
        setErrorMessage(errorData.message || "Invalid email or password.");
        setSuccessMessage("");
      }
    } catch (error) {
      setErrorMessage("Unable to connect to the server. Please try again.");
      setSuccessMessage("");
    }
  };

  const handleGoogleLogin = async (e) => {
    e.preventDefault();
    try {
      const provider = new GoogleAuthProvider();
      const response = await signInWithPopup(auth, provider);
      console.log(response, ">>>>google");
      const { uid, displayName, emailVerified, photoURL, phoneNumber, email } =
        response.user;
      await setDoc(doc(db, "Users", uid), {
        email: email,
        name: displayName,
        emailVerified: emailVerified,
        phoneNumber: phoneNumber,
        photoURL: photoURL,
      });
      login(response.user, response._tokenResponse);
      setSuccessMessage("Login successful! Redirecting...");
      setErrorMessage("");
      // Optionally, save token to local storage or context
      // localStorage.setItem("token", data.token);
      setTimeout(() => {
        // Redirect to another page (e.g., home)
        window.location.href = "/";
      }, 2000);
    } catch (error) {
      setErrorMessage("Unable to connect to the server. Please try again.");
      setSuccessMessage("");
    }
  };

  return (
    <div
      className="container mt-5 border p-4 rounded shadow-sm"
      style={{ maxWidth: "500px" }}
    >
      <h2 className="text-center mb-4">Login</h2>
      {successMessage && <Alert variant="success">{successMessage}</Alert>}
      {errorMessage && <Alert variant="danger">{errorMessage}</Alert>}

      <Form onSubmit={handleLogin}>
        <Form.Group className="mb-3" controlId="formBasicEmail">
          <Form.Label>Email address</Form.Label>
          <Form.Control
            type="email"
            name="email"
            value={formData.email}
            placeholder="Enter email"
            onChange={handleInputChange}
            isInvalid={!!errors.email}
          />
          <Form.Control.Feedback type="invalid">
            {errors.email}
          </Form.Control.Feedback>
        </Form.Group>

        <Form.Group className="mb-3" controlId="formBasicPassword">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            name="password"
            value={formData.password}
            placeholder="Password"
            onChange={handleInputChange}
            isInvalid={!!errors.password}
          />
          <Form.Control.Feedback type="invalid">
            {errors.password}
          </Form.Control.Feedback>
        </Form.Group>

        <Button variant="primary" type="submit" className="w-100 mb-3">
          Login
        </Button>
        <Button
          variant="outline-danger"
          className="w-100"
          onClick={handleGoogleLogin}
        >
          <FaGooglePlusG />
        </Button>
      </Form>
    </div>
  );
};

export default Login;
