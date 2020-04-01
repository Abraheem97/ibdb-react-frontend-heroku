import React, { Component } from "react";
import { get_userDetails } from "../Services/userService";

import Cookies from "js-cookie";
import axios from "axios";

class UserProfile extends Component {
  state = {
    account: {
      email: "",
      current_password: "",
      password: "",
      password_confirmation: "",
      selectedFile: null,
      unconfirmed_email: ""
    },
    errors: {},
    avatar: "",
    alerts: ""
  };
  handleAlertTimeout = () => {
    this.setState({ alerts: "" });
  };

  componentDidMount() {
    if (this.props.signed_in) this.props.history.push("/");

    get_userDetails(
      Cookies.get("user_id"),
      Cookies.get("user_authentication_token")
    ).then(resp => {
      console.log(resp);
      let account = { ...this.state.account };
      account.email = resp.data.email;
      account.unconfirmed_email = resp.data.unconfirmed_email;
      this.setState({ account, avatar: resp.data.image_url });
    });
  }

  handleSuccessfulSubmit = resp => {
    let alerts = { ...this.state.alerts };
    alerts = "Profile has been successfully updated";
    let account = { ...this.state.account };
    account.email = Cookies.get("user_email");
    account.current_password = "";
    account.password = "";
    account.password_confirmation = "";
    account.selectedFile = null;
    account.unconfirmed_email = resp.data.unconfirmed_email;
    console.log(resp);

    this.setState({ account, alerts, avatar: resp.data.image_url });
    this.refs.btn.removeAttribute("disabled");

    setInterval(this.handleAlertTimeout, 5000);
  };
  validateProperty = input => {
    if (input.name === "email") {
      if (input.value.trim() === "") return "Email is required.";
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
    if (!emailValid)
      errors.email = "Incorrect format of Email eg: user@example.com";

    if (this.state.account.password && this.state.account.password.length < 6)
      errors.password = "Minimum length 6 characters.";
    if (this.state.account.current_password.length < 6)
      errors.current_password = "Wrong Password.";
    if (this.state.account.current_password.trim() === "")
      errors.current_password = "Password required.";

    if (
      this.state.account.password &&
      this.state.account.password.trim() === ""
    )
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
    if (
      this.state.account.email == Cookies.get("user_email") &&
      !this.state.account.password &&
      this.state.account.selectedFile == null
    )
      return;
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
      method: "patch",
      url: `${process.env.REACT_APP_API_URL}/v1/update_user/${Cookies.get(
        "user_id"
      )}`,
      data: {
        user: {
          current_password: this.state.account.current_password,
          email: this.state.account.email,
          password: this.state.account.password
            ? this.state.account.password
            : null,
          password_confirmation: this.state.account.password
            ? this.state.account.password
            : null,
          image_url: file.url
        }
      },
      headers: { ["X-User-Token"]: Cookies.get("user_authentication_token") }
    })
      .then(res => {
        if (
          this.state.account.password ||
          this.state.account.email != Cookies.get("user_email")
        ) {
          this.props.handleSignOut();
        } else this.handleSuccessfulSubmit(res);
      })
      .catch(error => {
        if (error.response) {
          if (error.response.status === 401) {
            // console.log(error.response); // returns whole error object passed from the api call
            // console.log(error.response.data.errors.email[0]); // returns the error message
            const errors = { ...this.state.errors };
            errors.current_password = "Invaliid Password";
            this.refs.btn.removeAttribute("disabled");
            this.setState({ errors });
          }
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
        {this.state.alerts && (
          <div style={{ margin: 20 }} className="alert alert-dark">
            {this.state.alerts}
          </div>
        )}
        <h1>Edit Profile</h1>

        <br />
        <form onSubmit={this.handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            {this.state.account.unconfirmed_email && (
              <p
                style={{
                  display: "inline",
                  fontSize: "small",
                  color: "indianred",
                  paddingLeft: 10
                }}
              >
                Waiting for confirmation from{" "}
                {this.state.account.unconfirmed_email}
              </p>
            )}
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
            <label htmlFor="password">Current Password</label>
            <p
              style={{
                display: "inline",
                fontSize: "small",
                color: "indianred",
                paddingLeft: 10
              }}
            >
              required
            </p>
            <input
              value={account.current_password}
              name="current_password"
              onChange={this.handleInput}
              id="current_password"
              type="password"
              className="form-control"
              style={{ background: "none" }}
            />
            {this.state.errors.current_password && (
              <div className="alert alert-danger">
                {this.state.errors.current_password}
              </div>
            )}
          </div>
          <div className="form-group">
            <label htmlFor="password">New Password</label>{" "}
            <p
              style={{
                display: "inline",
                fontSize: "small",
                color: "indianred",
                paddingLeft: 10
              }}
            >
              leave blank if you don't want to change password
            </p>
            <input
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
            <p
              style={{
                display: "inline",
                fontSize: "small",
                color: "indianred",
                paddingLeft: 10
              }}
            >
              leave blank if you don't want to change password
            </p>
            <input
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
              <img src={this.state.avatar} style={{ height: 59, width: 59 }} />
              <br />
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
            Submit
          </button>{" "}
        </form>
      </div>
    );
  }
}

export default UserProfile;
