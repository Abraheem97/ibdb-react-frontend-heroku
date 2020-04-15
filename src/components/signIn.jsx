import React, { Component } from "react";
import axios from "axios";

class SignIn extends Component {
  state = { account: { username: "", password: "" }, errors: {} };

  validateProperty = (input) => {
    if (input.name === "username") {
      if (input.value.trim() === "") return "Username is required.";
    }
    if (input.name === "password") {
      if (input.value.trim() === "") return "Password is required.";
    }
  };

  componentDidMount() {
    this.props.handleSignOut();
  }

  handleInput = (e) => {
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

    if (this.state.account.username.trim() === "")
      errors.username = "Username required.";
    if (this.state.account.password.trim() === "")
      errors.password = "Password required.";

    return Object.keys(errors).length === 0 ? null : errors;
  };
  handleSubmit = (e) => {
    e.preventDefault();
    const errors = this.validate();
    this.setState({ errors: errors || {} });
    if (errors) return;

    axios({
      method: "post",
      url: `${process.env.REACT_APP_API_URL}/v1/sessions`,
      data: {
        email: this.state.account.username,
        password: this.state.account.password,
      },
    })
      .then((res) => {
        this.refs.btn.setAttribute("disabled", "disabled");
        this.props.handleSignIn(res.data);
      })
      .catch((errors) => {
        if (errors) {
          let Myerrors = { ...this.state.errors };
          if (errors.message === "Request failed with status code 403")
            Myerrors.wrong =
              "Please confirm your registered email to access your account.";
          else Myerrors.wrong = "Invalid username or password";
          this.setState({ errors: Myerrors });
        }
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
        {this.state.errors.wrong && (
          <div className="alert alert-danger">{this.state.errors.wrong}</div>
        )}
        <h2>Login</h2>
        <br />
        <form onSubmit={this.handleSubmit}>
          <div className="form-group">
            <label htmlFor="username">Email</label>
            <input
              maxLength="40"
              autoComplete="off"
              autoFocus
              value={account.username}
              onChange={this.handleInput}
              name="username"
              id="username"
              type="text"
              className="form-control"
              style={{ background: "none" }}
            />
            {this.state.errors.username && (
              <div className="alert alert-danger">
                {this.state.errors.username}
              </div>
            )}
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              maxLength="20"
              value={account.password}
              name="password"
              onChange={this.handleInput}
              id="password"
              type="password"
              className="form-control"
              style={{ background: "none" }}
            />
            {this.state.errors.password && (
              <div className="alert alert-danger">
                {this.state.errors.password}
              </div>
            )}
          </div>
          <br />
          <button style={{ display: "block", margin: "0 auto" }} ref="btn">
            {" "}
            Login
          </button>
        </form>
      </div>
    );
  }
}

export default SignIn;
