import React, { Component } from "react";
import { NavLink } from "react-router-dom";
import { Nav, Navbar } from "react-bootstrap";
import Cookies from "js-cookie";

class NavBar extends Component {
  states = {};

  render() {
    return (
      <React.Fragment>
        <Navbar bg="light" expand="lg">
          <div className="container">
            <NavLink to="/">
              <Navbar.Brand>IBDB</Navbar.Brand>
            </NavLink>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
              <Nav className="mr-auto">
                {this.props.signed_in && Cookies.get("user_role") == 3 && (
                  <NavLink className="nav-item nav-link" to="/add_book">
                    Add a book
                  </NavLink>
                )}
              </Nav>
              <Nav className="ml-auto">
                {!this.props.signed_in && (
                  <NavLink className="nav-item nav-link" to="/login">
                    Sign In
                  </NavLink>
                )}

                {!this.props.signed_in && (
                  <NavLink className="nav-item nav-link" to="/signup">
                    Sign up
                  </NavLink>
                )}

                {this.props.signed_in && (
                  <Navbar>{this.props.user.email}</Navbar>
                )}
                {this.props.signed_in && (
                  <NavLink
                    className="nav-item nav-link"
                    to="/"
                    onClick={this.props.handleSignOut}
                  >
                    Sign out
                  </NavLink>
                )}
              </Nav>
            </Navbar.Collapse>
          </div>
        </Navbar>
      </React.Fragment>
    );
  }
}

export default NavBar;
