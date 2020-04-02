import React, { Component } from "react";
import axios from "axios";
import { withRouter } from "react-router-dom";

class SignUp extends Component {
  state = {
    account: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      password_confirmation: "",
      selectedFile: null
    },
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

  fileSelectHandler = e => {
    const account = { ...this.state.account };
    account.selectedFile = e.target.files[0];
    this.setState({ account });
  };

  validate = () => {
    const errors = {};
    const validImageTypes = ["image/gif", "image/jpeg", "image/png"];

    const emailValid = this.state.account.email.match(
      /^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/i
    );

    if (this.state.account.email.trim() === "")
      errors.email = "Email required.";
    if (this.state.account.firstName.trim() === "")
      errors.firstName = "First name required.";
    if (this.state.account.lastName.trim() === "")
      errors.lastName = "Last name required.";
    if (!emailValid)
      errors.email = "Incorrect format of Email eg: user@example.com";
    if (this.state.account.password.trim() === "")
      errors.password = "Password required.";
    if (this.state.account.password.length < 6)
      errors.password = "Minimum length 6 characters.";
    if (this.state.account.password.trim() === "")
      errors.password_confirmation = "Password confirmation required.";
    if (
      this.state.account.password !== this.state.account.password_confirmation
    )
      errors.password_confirmation = "Password doesn't match";
    if (
      this.state.account.selectedFile &&
      this.state.account.selectedFile.size > 579591
    )
      errors.avatar = "Image size should be less then 500kb";
    if (
      this.state.account.selectedFile &&
      !validImageTypes.includes(this.state.account.selectedFile.type)
    )
      errors.avatar =
        "Unknown image format, please pick gif, jpeg or png images";
    return Object.keys(errors).length === 0 ? null : errors;
  };
  handleSubmit = async e => {
    e.preventDefault();

    const errors = this.validate();

    this.setState({ errors: errors || {} });

    if (errors) return;

    this.refs.btn.setAttribute("disabled", "disabled");

    const data = new FormData();
    data.append("file", this.state.account.selectedFile);
    data.append("upload_preset", "st2nr1uo");
    const res = await fetch(
      `https://api.cloudinary.com/v1_1/${process.env.REACT_APP_CLOUDINARY_KEY}/image/upload`,
      {
        method: "POST",
        body: data
      }
    );

    const file = await res.json();

    axios({
      method: "post",
      url: `${process.env.REACT_APP_API_URL}/users.json`,
      data: {
        user: {
          firstName: this.state.account.firstName,
          lastName: this.state.account.lastName,
          email: this.state.account.email,
          password: this.state.account.password,
          password_confirmation: this.state.account.password_confirmation,
          image_url: file.url
        }
      }
    })
      .then(res => {
        console.log("res", res);
        this.props.handleSignUp(res.data);
      })
      .catch(error => {
        // console.log(error.response); // returns whole error object passed from the api call
        console.log(error.response.data.errors.email[0]); // returns the error message
        if (error.response.status === 422) {
          const errors = { ...this.state.errors };
          errors.email = "Email has already been taken";
          this.refs.btn.removeAttribute("disabled");
          this.setState({ errors });
        }
      });
    // $.ajax({ Request failed with status code 422
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
        <br />
        <form onSubmit={this.handleSubmit}>
          <div className="row">
            <div className="col">
              <div className="form-group">
                <label htmlFor="email">First Name</label>
                <input
                  maxlength="30"
                  autoComplete="off"
                  value={account.firstName}
                  onChange={this.handleInput}
                  name="firstName"
                  id="firstName"
                  type="text"
                  className="form-control"
                  style={{ background: "none", width: "100%" }}
                />
                {this.state.errors.firstName && (
                  <div className="alert alert-danger">
                    {this.state.errors.firstName}
                  </div>
                )}
              </div>
            </div>
            <div className="col">
              <div className="form-group">
                <label htmlFor="email">Last Name</label>
                <input
                  maxlength="30"
                  autoComplete="off"
                  value={account.lastName}
                  onChange={this.handleInput}
                  name="lastName"
                  id="lastName"
                  type="text"
                  className="form-control"
                  style={{ background: "none", width: "100%" }}
                />
                {this.state.errors.firstName && (
                  <div className="alert alert-danger">
                    {this.state.errors.lastName}
                  </div>
                )}
              </div>
            </div>
          </div>
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
              style={{ background: "none" }}
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
              maxlength="20"
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
          <div className="form-group">
            <label htmlFor="password_confirmation">Password confirmation</label>
            <input
              maxlength="20"
              value={account.password_confirmation}
              name="password_confirmation"
              onChange={this.handleInput}
              id="password_confirmation"
              type="password"
              className="form-control"
              style={{ background: "none" }}
            />
            {this.state.errors.password_confirmation && (
              <div className="alert alert-danger">
                {this.state.errors.password_confirmation}
              </div>
            )}
          </div>
          <div className="form-group">
            <label htmlFor="image">
              Upload avatar <br></br>
              <input
                id="user_avatar"
                type="file"
                name="image"
                onChange={this.fileSelectHandler}
                style={{ background: "none" }}
                accept="image/*"
              />
            </label>
            {this.state.errors.avatar && (
              <div className="alert alert-danger">
                {this.state.errors.avatar}
              </div>
            )}
          </div>
          <button ref="btn" style={{ display: "block", margin: "0 auto" }}>
            Sign Up
          </button>{" "}
        </form>
      </div>
    );
  }
}

export default withRouter(SignUp);
