import React, { Component } from "react";
import axios from "axios";
import { withRouter } from "react-router-dom";

class SignUp extends Component {
  state = {
    account: { email: "", password: "", password_confirmation: "" },
    errors: {}
  };

  componentDidMount() {
    if (this.props.signed_in) this.props.history.push("/");
  }

  validateProperty = input => {
    if (input.name === "email") {
      if (input.value.trim() === "") return "Email is required.";
    }
    if (input.name === "password") {
      if (input.value.trim() === "") return "Password is required.";
    }
    if (input.name === "password_confirmation") {
      if (input.value.trim() === "")
        return "Password confirmation is required.";
    }
  };

  handleInput = e => {
    const errors = { ...this.state.errors };
    const errorMessage = this.validateProperty(e.currentTarget);
    if (errorMessage) errors[e.currentTarget.name] = errorMessage;
    else delete errors[e.currentTarget.name];

    const account = { ...this.state.account };
    account[e.currentTarget.name] = e.currentTarget.value;
    this.setState({ account, errors });
  };

  validate = () => {
    const errors = {};

    const emailValid = this.state.account.email.match(
      /^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/i
    );

    if (this.state.account.email.trim() === "")
      errors.email = "Email required.";
    if (!emailValid)
      errors.email = "Incorrect format of Email eg: user@example.com";
    if (this.state.account.password.trim() === "")
      errors.password = "Password required.";
    if (this.state.account.password.trim() === "")
      errors.password_confirmation = "Password confirmation required.";
    return Object.keys(errors).length === 0 ? null : errors;
  };
  handleSubmit = e => {
    e.preventDefault();
    const errors = this.validate();

    this.setState({ errors: errors || {} });

    if (errors) return;

    this.refs.btn.setAttribute("disabled", "disabled");
    axios({
      method: "post",
      url: `${process.env.REACT_APP_API_URL}/users.json`,
      data: {
        user: {
          email: this.state.account.email,
          password: this.state.account.password,
          password_confirmation: this.state.account.password_confirmation
        }
      }
    }).then(res => {
      this.props.handleSignUp(res.data);
    });
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
  };

  render() {
    const { account } = this.state;
    return (
      <div>
        <h1>Sign Up</h1>
        <form onSubmit={this.handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              autoComplete="off"
              autoFocus
              value={account.email}
              onChange={this.handleInput}
              name="email"
              id="email"
              type="text"
              className="form-control"
            />
            {this.state.errors.email && (
              <div className="alert alert-danger">
                {this.state.errors.email}
              </div>
            )}
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              value={account.password}
              name="password"
              onChange={this.handleInput}
              id="password"
              type="password"
              className="form-control"
            />
            {this.state.errors.password && (
              <div className="alert alert-danger">
                {this.state.errors.password}
              </div>
            )}
          </div>
          <div className="form-group">
            <label htmlFor="password_confirmation">Password confirmation</label>
            <input
              value={account.password_confirmation}
              name="password_confirmation"
              onChange={this.handleInput}
              id="password_confirmation"
              type="password"
              className="form-control"
            />
            {this.state.errors.password_confirmation && (
              <div className="alert alert-danger">
                {this.state.errors.password_confirmation}
              </div>
            )}
          </div>
          <button ref="btn" className="btn btn-primary">
            Sign Up
          </button>{" "}
        </form>
      </div>
    );
  }
}

export default withRouter(SignUp);
