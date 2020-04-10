import React, { Component } from "react";
import { NavLink } from "react-router-dom";
import { Nav, Navbar } from "react-bootstrap";
import Cookies from "js-cookie";
import UserAvatar from "react-user-avatar";

class NavBar extends Component {
  states = {};

  style = {
    display: "block",
    position: "relative",

    lineHeight: "3.5em",

    border: 0,
    fontSize: "0.8em",
    fontWeight: 900,
    letterSpacing: "0.35em",
    textTransform: "uppercase",

    backgroundImage:
      "linear-gradient(to bottom, #2b2c2e, #2b2c2e, #2b2c2e, #2b2c2e, #2b2c2e)",
  };

  invertColour = {
    color: "invert",
  };

  render() {
    const userName = Cookies.get("firstName") + " " + Cookies.get("lastName");

    return (
      <React.Fragment>
        <Navbar expand="lg" style={this.style}>
          <div className="container" style={{}}>
            <NavLink style={{ outline: "none" }} to="/">
              <Navbar.Brand style={{ color: "darkgray", fontSize: "x-large" }}>
                IBDB
              </Navbar.Brand>
            </NavLink>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse
              style={{
                backgroundImage:
                  "linear-gradient(to bottom, #2b2c2e, #2b2c2e, #2b2c2e, #2b2c2e, #2b2c2e)",
                opacity: "80%",
              }}
              id="basic-navbar-nav"
            >
              <Nav className="mr-auto">
                {this.props.signed_in &&
                  Cookies.get("S61hskksddsai") != 4 &&
                  Cookies.get("S61hskksddsai") && (
                    <NavLink
                      style={{
                        color: "aliceblue",

                        outline: "none",

                        textAlign: "center",
                      }}
                      className="nav-item nav-link"
                      to="/add_book"
                    >
                      Add Book
                    </NavLink>
                  )}
                {this.props.signed_in &&
                  Cookies.get("S61hskksddsai") != 4 &&
                  Cookies.get("S61hskksddsai") && (
                    <NavLink
                      style={{
                        color: "aliceblue",

                        outline: "none",

                        textAlign: "center",
                      }}
                      className="nav-item nav-link"
                      to="/add_author"
                    >
                      Add Author
                    </NavLink>
                  )}
              </Nav>
              <Nav className="ml-auto">
                {!this.props.signed_in && (
                  <NavLink
                    style={{
                      color: "aliceblue",

                      outline: "none",

                      textAlign: "center",
                    }}
                    className="nav-item nav-link"
                    to="/login"
                  >
                    Sign In
                  </NavLink>
                )}

                {!this.props.signed_in && (
                  <NavLink
                    style={{
                      color: "aliceblue",

                      outline: "none",

                      textAlign: "center",
                    }}
                    className="nav-item nav-link"
                    to="/signup"
                  >
                    Sign up
                  </NavLink>
                )}
                {Cookies.get("S61hskksddsai") == 1 && (
                  <Navbar
                    style={{
                      color: "#147891",

                      display: "flex",
                      justifyContent: "center",
                    }}
                    className="nav-link disabled"
                  >
                    SUPER ADMIN
                  </Navbar>
                )}
                {Cookies.get("S61hskksddsai") == 2 && (
                  <Navbar
                    style={{
                      color: "#147891",

                      display: "flex",
                      justifyContent: "center",
                    }}
                    className="nav-link disabled"
                  >
                    ADMIN
                  </Navbar>
                )}
                {Cookies.get("S61hskksddsai") == 3 && (
                  <Navbar
                    style={{
                      color: "#147891",

                      display: "flex",
                      justifyContent: "center",
                    }}
                    className="nav-link disabled"
                  >
                    MODERATOR
                  </Navbar>
                )}

                {this.props.signed_in && (
                  <NavLink
                    style={{
                      color: "indianred",

                      outline: "none",
                      textAlign: "center",
                    }}
                    className="nav-item nav-link"
                    to="/"
                    onClick={this.props.handleSignOut}
                  >
                    Sign out
                  </NavLink>
                )}
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                  }}
                >
                  {this.props.signed_in && (
                    <NavLink
                      to="/user/editProfile"
                      style={{
                        color: "aliceblue",
                        fontSize: 20,
                        textDecoration: "none",
                        outline: "none",
                      }}
                    >
                      {Cookies.get("avatar_url") && (
                        <UserAvatar
                          size="60"
                          name={userName}
                          src={Cookies.get("avatar_url")}
                          color="#008bad"
                        />
                      )}
                      {!Cookies.get("avatar_url") && (
                        <UserAvatar size="60" name={userName} color="#005a70" />
                      )}
                    </NavLink>
                  )}
                </div>
              </Nav>
            </Navbar.Collapse>
          </div>
        </Navbar>
        <div id="wrapper" style={{ textAlign: "center" }}>
          <header id="header">
            <div className="inner">
              <NavLink to="/" className="logo">
                <span className="symbol">
                  <img
                    src="https://res.cloudinary.com/dbqes9wsk/image/upload/v1585221080/defaults/logo_tkaxhj.svg"
                    alt=""
                  />
                </span>
                <span className="title">IBDB | The place for books</span>
              </NavLink>
              {/* <nav
                class="navbar navbar-expand-md"
                style={{ position: "absolute" }}
              >
                <button
                  class="navbar-toggler"
                  type="button"
                  data-toggle="collapse"
                  data-target="#collapsibleNavbar"
                  aria-controls="collapsibleNavbar"
                  aria-expanded="false"
                  aria-label="Toggle navigation"
                  style={{
                    height: 20,
                    paddingBottom: 10,
                    fontSize: 10,
                    width: 60
                  }}
                >
                  menu
                </button>

                <div
                  className="collapse navbar-collapse"
                  id="collapsibleNavbar"
                >
                  <ul className="navbar-nav">
                    <li>
                      {Cookies.get("S61hskksddsai") == 1 && (
                        <NavbarBrand className="nav-link disabled">
                          SUPER ADMIN
                        </NavbarBrand>
                      )}
                      {Cookies.get("S61hskksddsai") == 2 && (
                        <NavbarBrand className="nav-link disabled">
                          ADMIN
                        </NavbarBrand>
                      )}
                      {Cookies.get("S61hskksddsai") == 3 && (
                        <NavbarBrand className="nav-link disabled">
                          MODERATOR
                        </NavbarBrand>
                      )}
                    </li>
                    <li>
                      {this.props.signed_in &&
                        Cookies.get("S61hskksddsai") != 4 &&
                        Cookies.get("S61hskksddsai") && (
                          <NavLink className="nav-item nav-link" to="/add_book">
                            Add a book
                          </NavLink>
                        )}
                    </li>

                    <li>
                      {!this.props.signed_in && (
                        <NavLink className="nav-item nav-link" to="/login">
                          Sign In
                        </NavLink>
                      )}
                      {this.props.signed_in && (
                        <NavLink className="nav-item nav-link" to="/">
                          {this.props.user.email}
                        </NavLink>
                      )}
                    </li>
                    <li>
                      {!this.props.signed_in && (
                        <NavLink className="nav-item nav-link" to="/signup">
                          Sign up
                        </NavLink>
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
                    </li>
                  </ul>
                </div>
              </nav> */}
            </div>
          </header>
        </div>

        {/* <Navbar>
          <div className="container">
            <NavLink to="/">
              <Navbar.Brand>IBDB</Navbar.Brand>
            </NavLink>
            <Navbar.Toggle />
            <Navbar.Collapse id="basic-navbar-nav">
              <Nav className="mr-auto">
                {this.props.signed_in &&
                  Cookies.get("S61hskksddsai") != 4 &&
                  Cookies.get("S61hskksddsai") && (
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
                {Cookies.get("S61hskksddsai") == 1 && (
                  <Navbar className="nav-link disabled">SUPER ADMIN</Navbar>
                )}
                {Cookies.get("S61hskksddsai") == 2 && (
                  <Navbar className="nav-link disabled">ADMIN</Navbar>
                )}
                {Cookies.get("S61hskksddsai") == 3 && (
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
        </Navbar> rgb(26, 188, 156) */}
      </React.Fragment>
    );
  }
}

export default NavBar;
