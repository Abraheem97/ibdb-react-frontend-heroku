import React, { Component } from "react";
import { NavLink } from "react-router-dom";
import { Nav, Navbar } from "react-bootstrap";
import Cookies from "js-cookie";

class NavBar extends Component {
  states = {};

  render() {
    return (
      <React.Fragment>
        <Navbar>
          <div className="container">
            <NavLink to="/">
              <Navbar.Brand>IBDB</Navbar.Brand>
            </NavLink>
            <Navbar.Toggle />
            <Navbar.Collapse id="basic-navbar-nav">
              <Nav className="mr-auto">
                {this.props.signed_in &&
                  Cookies.get("user_role") != 4 &&
                  Cookies.get("user_role") && (
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
                {Cookies.get("user_role") == 1 && (
                  <Navbar className="nav-link disabled">SUPER ADMIN</Navbar>
                )}
                {Cookies.get("user_role") == 2 && (
                  <Navbar className="nav-link disabled">ADMIN</Navbar>
                )}
                {Cookies.get("user_role") == 3 && (
                  <Navbar className="nav-link disabled">MODERATOR</Navbar>
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
