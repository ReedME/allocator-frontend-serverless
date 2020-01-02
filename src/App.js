import React from "react";
import { Link } from "react-router-dom";
import { Nav, Navbar } from "react-bootstrap";
import Routes from "./Routes";
import "./App.css";

function App(props) {
  return (
    <div className="App container">
      <Navbar bg="light" expand="lg">
        <Navbar.Brand>
          <Link to="/">Allocator</Link>
          </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse className="justify-content-end">
          <Nav>
            <Nav.Link href="/signup">Sign Up</Nav.Link>
            <Nav.Link href="/login">Login</Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Navbar>
      <Routes />
      
    </div>
  );
}

export default App;