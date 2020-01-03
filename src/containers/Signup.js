import React, { useState } from "react";
import {
  Spinner,
  Form,
  Button,
  Alert
} from "react-bootstrap";
import { Auth } from 'aws-amplify';
import { useFormFields } from "../libs/hooksLib";
import "./Signup.css";

export default function Signup(props) {
  const [fields, handleFieldChange] = useFormFields({
    email: "",
    password: "",
    confirmPassword: "",
    confirmationCode: ""
  });
  const [newUser, setNewUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [formError, setFormError] = useState(null);
  const [confirmFormError, setConfirmFormError] = useState(null);
  const [showConfirm,setShowConfirm] = useState(false);
  const [show,setShow] = useState(false);
  const [codeResponse, setCodeResponse] = useState(null);
  const [codeResponseType, setCodeResponseType] = useState("");
  const [showResend,setShowResend] = useState(false);

  function validateForm() {
    return (
      fields.email.length > 0 &&
      fields.password.length > 0 &&
      fields.password === fields.confirmPassword
    );
  }

  function validateConfirmationForm() {
    return fields.confirmationCode.length > 0;
  }

  async function handleSubmit(event) {
    event.preventDefault();
  
    setIsLoading(true);
  
    try {
      const newUser = await Auth.signUp({
        username: fields.email,
        password: fields.password
      });
      setIsLoading(false);
      setNewUser(newUser);
    } catch (e) {
      
      if (e.name === 'UsernameExistsException') {
          try {
              await Auth.resendSignUp(fields.email)
              setIsLoading(false);
              setNewUser("test");
          } catch (e) {
              
              if (e.name === 'InvalidParameterException' && e.message === 'User is already confirmed.') {
                  try {
                    await Auth.signIn(fields.email, fields.password);
                    props.userHasAuthenticated(true);
                    props.history.push("/");
                }
                  catch (e) {
                    setShowConfirm(true)  ;
                    setConfirmFormError(e.message);
                    setIsLoading(false);
                            }  
                  } else {
                    setShow(true)  
                    setFormError(e.message)
                    setIsLoading(false);
                  }
              }
            }
           else { 
            setShow(true)  
            setFormError(e.message)
            setIsLoading(false);
          }

      }
    }
  
  
  async function handleConfirmationSubmit(event) {
    event.preventDefault();
  
    setIsLoading(true);
  
    try {
      await Auth.confirmSignUp(fields.email, fields.confirmationCode);
      await Auth.signIn(fields.email, fields.password);
  
      props.userHasAuthenticated(true);
      props.history.push("/");
    } catch (e) {
      
      setShowConfirm(true)  ;
      setConfirmFormError(e.message);
      setIsLoading(false);
    }
  }

  async function handleResendConfirm(event) {
            event.preventDefault()
      try {
          await Auth.resendSignUp(fields.email)
          setCodeResponse("Confirmation code resent, please allow up to 10 minutes before trying again and check your spam folders")
          setCodeResponseType("success")
          setShowResend(true)  
      } catch (e) {
          setShowResend(true)
          setCodeResponse(e.message)
          setCodeResponseType("danger")
      }
      
  }

  function renderConfirmationForm() {
    return (
      <Form onSubmit={handleConfirmationSubmit}>
        <Form.Group controlId="confirmationCode" bssize="large">
          <Form.Label>Confirmation Code</Form.Label>
          <Form.Control
            autoFocus
            type="tel"
            onChange={handleFieldChange}
            value={fields.confirmationCode}
          />
          <Form.Text muted>
              Please check your email for the code. Didn't get it?
              
              
              </Form.Text>
              {setShowResend ?
              <center>
              <Form.Text muted>
              <Button size="sm" variant="link" onClick={handleResendConfirm}> 
                Click here to resend Code
              </Button>
              </Form.Text>
              </center>
              : null}
          
        </Form.Group>
        {showConfirm ? <>
        <Alert variant="danger" onClose={() => setShowConfirm(false)} dismissible>
        <Alert.Heading>Oh snap! You got an error!</Alert.Heading>
        <p>
          {confirmFormError}
        </p>
      </Alert>
      </>: null }
      {showResend ? <>
        <Alert variant={codeResponseType} onClose={() => setShowResend(false)} dismissible>
        <p>
          {codeResponse}
        </p>
      </Alert>
      </>: null }
        <Button 
          variant="primary" 
          block 
          bssize="large" 
          disabled={!validateConfirmationForm()} 
          type="submit"
        >
      {isLoading ? <><Spinner animation="border" size="sm"></Spinner> Loading...</> :
    <>Verify</>
      }
        </Button>
      </Form>
    );
  }

  function renderForm() {
    return (
      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="email" bssize="large">
          <Form.Label>Email</Form.Label>
          <Form.Control
            autoFocus
            type="email"
            value={fields.email}
            onChange={handleFieldChange}
          />
        </Form.Group>
        <Form.Group controlId="password" bssize="large">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            value={fields.password}
            onChange={handleFieldChange}
          />
        </Form.Group>
        <Form.Group controlId="confirmPassword" bssize="large">
          <Form.Label>Confirm Password</Form.Label>
          <Form.Control
            type="password"
            onChange={handleFieldChange}
            value={fields.confirmPassword}
          />
        </Form.Group>
        {show ? <>
        <Alert variant="danger" onClose={() => setShow(false)} dismissible>
        <Alert.Heading>Oh snap! You got an error!</Alert.Heading>
        <p>
          {formError}
        </p>
      </Alert>
      </> : null }
        <Button 
          variant="primary" 
          block 
          bssize="large" 
          disabled={!validateForm()} 
          type="submit"
        >
      {isLoading ? <><Spinner animation="border" size="sm"></Spinner> Loading...</> :
    <>Sign Up</>
      }
        </Button>
      </Form>
    );
  }

  return (
    <div className="Signup">
      {newUser === null ? renderForm() : renderConfirmationForm()}
    </div>
  );
}