import "./App.css";
import Books from "./components/books";
import "bootstrap/dist/css/bootstrap.css";
import NavBar from "./components/NavBar";
import { Route, Switch, Redirect } from "react-router-dom";
import Book from "./components/book";
import Author from "./components/author";
import NotFound from "./components/not-found";
import React, { Component } from "react";
import SignIn from "./components/signIn";
import SignUp from "./components/signUp";
import ConfirmEmail from "./components/confirmEmail";
import { withRouter } from "react-router-dom";
import axios from "axios";
import Cookies from "js-cookie";
import Reviews from "./components/reviews";
import AddBook from "./components/addBook";
import AddAuthor from "./components/addAuthor";
import UserProfile from "./components/userProfile";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { toast } from "react-toastify";

// USER ROLES

// USER - 1 superadmin
// USER - 2 admin_role
// USER - 3 moderator_role
// USER - 4 USER

class App extends Component {
  state = { isLoggedIn: false, user: {}, alerts: {}, users: [] };

  handleSignIn = (user) => {
    if (!user.superadmin && !user.admin_role && !user.moderator_role)
      Cookies.set("S61hskksddsai", "4");
    if (user.moderator_role) Cookies.set("S61hskksddsai", "3");
    if (user.admin_role) Cookies.set("S61hskksddsai", "2");
    if (user.superadmin) Cookies.set("S61hskksddsai", "1");

    this.setState({ user, isLoggedIn: true, alerts: {} });
    Cookies.set("isLoggedIn", true);
    Cookies.set("user_email", user.email);
    Cookies.set("user_id", user.id);
    Cookies.set("user_authentication_token", user.authentication_token);
    if (user.image_url) Cookies.set("avatar_url", user.image_url);
    Cookies.set("firstName", user.firstName);
    Cookies.set("lastName", user.lastName);
    this.props.history.push("/");
    toast.success(
      "Welcome back " + user.firstName + "!\nYou are successfully signed in"
    );
  };

  handleSignUp = () => {
    this.props.history.push("/signed_up");
  };

  handleAlertTimeout = () => {
    let alerts = { ...this.state.alerts };
    alerts.sign_out = "";
    this.setState({ alerts: alerts });
  };

  handleSignOut = () => {
    axios({
      method: "delete",
      url: `${process.env.REACT_APP_API_URL}/v1/sessions/${this.state.user.id}`,
      data: {
        id: this.state.user.id,
      },
    })
      .then((res) => {
        toast.error("You are successfully signed out!");
        let alerts = { ...this.state.alerts };
        alerts.sign_out = "You are successfully signed out!";

        this.setState({ user: {}, isLoggedIn: false, alerts: alerts });
        setInterval(this.handleAlertTimeout, 5000);
      })
      .catch((errors) => {});
    // $.ajax({
    //   method: "POST",
    //   url: "http://localhost:3001/v1/sessions",
    //   data: {
    //     user: {
    //       email: "superadmin@ibdb.com",
    //       password: "password"
    //     }
    //   }
    // }).done(function(data) {});

    Object.keys(Cookies.get()).forEach(function (cookieName) {
      var neededAttributes = {};
      Cookies.remove(cookieName, neededAttributes);
    });
    this.props.history.push("/login");
  };

  componentDidMount() {
    let user = { ...this.state.user };
    let isLoggedIn = false;
    user.email = Cookies.get("user_email");
    user.id = Cookies.get("user_id");
    user.authentication_token = Cookies.get("user_authentication_token");
    isLoggedIn = Boolean(Cookies.get("isLoggedIn"));

    this.setState({ isLoggedIn: isLoggedIn, user: user });
  }
  render() {
    return (
      <div className="myClass">
        <NavBar
          user={this.state.user}
          handleSignOut={this.handleSignOut}
          signed_in={this.state.isLoggedIn}
        />
        <div>
          <br></br>

          <div className="container">
            <Switch>
              <Route path="/author/:id" component={Author} />
              <Route path="/books/:id/reviews" component={Reviews} />
              <Route path="/books/:id" component={Book} />
              <Route
                path="/login"
                render={() => (
                  <SignIn
                    handleSignIn={this.handleSignIn}
                    handleSignOut={this.handleSignOut}
                  />
                )}
              />
              <Route
                path="/signup"
                render={() => (
                  <SignUp
                    handleSignUp={this.handleSignUp}
                    signed_in={this.state.isLoggedIn}
                  />
                )}
              />
              <Route path="/signed_up" component={ConfirmEmail} />
              <Route path="/add_book" component={AddBook} />
              <Route path="/add_author" component={AddAuthor} />
              <Route
                path="/books"
                render={() => <Books isLoggedIn={this.state.isLoggedIn} />}
              />

              <Route
                path="/user/editProfile"
                render={() => (
                  <UserProfile handleSignOut={this.handleSignOut} />
                )}
              />

              <Route path="/users/confirmation" component={Books} />
              <Route path="/not-found" component={NotFound} />
              <Route
                path="/"
                exact
                render={() => <Books isLoggedIn={this.state.isLoggedIn} />}
              />
              <Redirect to="/not-found" />
            </Switch>
            <ToastContainer
              autoClose={5000}
              hideProgressBar
              closeButton={false}
              style={{ color: "initial" }}
            />
          </div>
        </div>
      </div>
    );
  }
}

export default withRouter(App);
