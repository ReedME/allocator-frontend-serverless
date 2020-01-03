import React, { useState, useEffect } from "react";
import { Link, withRouter } from "react-router-dom";
import { Nav, Navbar, Spinner } from "react-bootstrap";
import { Auth } from "aws-amplify";
import Routes from "./Routes";

import "./App.css";

function App(props) {
  const [isAuthenticated, userHasAuthenticated] = useState(false);
  const [isAuthenticating, setIsAuthenticating] = useState(true);

  useEffect(() => {
    onLoad();
  }, []);
  
  async function onLoad() {
    try {
      await Auth.currentSession();
      userHasAuthenticated(true);
    }
    catch(e) {
      if (e !== 'No current user') {
        alert(e);
      }
    }
  
    setIsAuthenticating(false);
  }

  async function handleLogout() {
    await Auth.signOut();
  
    userHasAuthenticated(false);
    props.history.push("/login");
  }

  return (
    <div className="App container">
{isAuthenticating 
? 
<div className="Spinner"> 
<Spinner animation="border" size="lg" variant="danger" />
<br />
<h1>Loading...</h1>
</div> 
: 
<>
      <Navbar bg="light" expand="lg">
        <Navbar.Brand>
          <Link to="/">Allocator</Link>
          </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse className="justify-content-end">
          <Nav>
            { isAuthenticated ? 
            <Nav.Link onClick={handleLogout}>Logout</Nav.Link>:
            <>
            <Nav.Link href="/signup">Sign Up</Nav.Link>
            <Nav.Link href="/login">Login</Nav.Link>
            </>
             } </Nav>
        </Navbar.Collapse>
      </Navbar>
      <Routes appProps={{ isAuthenticated, userHasAuthenticated }} />
      </>}
    </div>
                   
  );
}

export default withRouter(App);