import React, { useState } from "react";
import { Form, Button, Alert } from "react-bootstrap";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../firebase/firebase";
import { setDoc, doc } from "firebase/firestore";
import { FaGooglePlusG } from "react-icons/fa";

const Signup = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const validate = () => {
    let formErrors = {};
    if (!formData.name) formErrors.name = "Name is required.";
    if (!formData.email) formErrors.email = "Email is required.";
    else if (!/\S+@\S+\.\S+/.test(formData.email))
      formErrors.email = "Invalid email format.";
    if (!formData.password) formErrors.password = "Password is required.";
    else if (formData.password.length < 6)
      formErrors.password = "Password must be at least 6 characters long.";

    setErrors(formErrors);
    return Object.keys(formErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setErrors({ ...errors, [name]: "" }); // Clear the error for the field being edited
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    const { email, password, name } = formData;
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      const response = auth.currentUser;
      console.log(response, ">>>>>>>");
      if (response?.uid) {
        await setDoc(doc(db, "Users", response.uid), {
          email: email,
          name: name,
          creationTime: response?.metadata.creationTime,
          emailVerified: response.emailVerified,
          phoneNumber: response.phoneNumber,
          photoURL: response.photoURL,
        });
        setSuccessMessage("Signup successful! You can now log in.");
        setErrorMessage("");
        setFormData({ name: "", email: "", password: "" }); // Reset form
      } else {
        const errorData = await response?.json();
        setErrorMessage(errorData.message || "Something went wrong.");
        setSuccessMessage("");
      }
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
      <h2 className="text-center mb-4">Signup</h2>
      {successMessage && <Alert variant="success">{successMessage}</Alert>}
      {errorMessage && <Alert variant="danger">{errorMessage}</Alert>}

      <Form onSubmit={handleSignup}>
        <Form.Group className="mb-3" controlId="formBasicName">
          <Form.Label>Full Name</Form.Label>
          <Form.Control
            type="text"
            name="name"
            value={formData.name}
            placeholder="Enter full name"
            onChange={handleInputChange}
            isInvalid={!!errors.name}
          />
          <Form.Control.Feedback type="invalid">
            {errors.name}
          </Form.Control.Feedback>
        </Form.Group>

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

        <Button variant="secondary" type="submit" className="w-100 mb-3">
          Sign Up
        </Button>

        <Button variant="outline-danger" className="w-100">
          Sign in with Google <FaGooglePlusG />
        </Button>
      </Form>
    </div>
  );
};

export default Signup;
