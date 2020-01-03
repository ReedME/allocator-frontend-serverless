import React, { useState } from "react";
import { Button, Form,Spinner } from "react-bootstrap";
import { Auth } from "aws-amplify";
import { useFormFields } from "../libs/hooksLib";
import { Link } from "react-router-dom";
import "./Login.css";

export default function Login(props) {
  const [isLoading, setIsLoading] = useState(false);
  const [fields, handleFieldChange] = useFormFields({
    email: "",
    password: ""
  });

  function validateForm() {
    return fields.email.length > 0 && fields.password.length > 0;
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setIsLoading(true);

  
    try {
      await Auth.signIn(fields.email, fields.password);
      props.userHasAuthenticated(true);
      props.history.push("/");
    } catch (e) {
      alert(e.message);
      setIsLoading(false);
    }
  }

  return (
    <div className="Login">
        <Form onSubmit={handleSubmit}>
  <Form.Group controlId="email" bssize="large">
    <Form.Label>Email address</Form.Label>
    <Form.Control 
        autoFocus
        onChange={handleFieldChange} 
        type="email" 
        value={fields.email}
        placeholder="Enter email" />
    <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
  </Form.Group>

  <Form.Group controlId="password" bssize="large">
    <Form.Label>Password</Form.Label>
    <Form.Control 
        onChange={handleFieldChange} 
        type="password"
        value={fields.password} 
        placeholder="Password" />
  </Form.Group>
  <Link to="/login/reset">Forgot password?</Link>
  <Button 
    variant="primary" 
    block 
    bssize="large" 
    disabled={!validateForm()} 
    type="submit"
  >
      {isLoading ? <><Spinner animation="border" size="sm"></Spinner> Loading...</> :
    <>Login</>
      }
  </Button>
</Form>
      
    </div>
  );
}