import React, { Component } from "react";

class ConfirmEmail extends Component {
  render() {
    return (
      <div>
        <h1> You have successfully signed up!</h1>
        <p>
          {" "}
          An email has been send to your email address, please confirm by
          clicking on the confirmation link
        </p>
      </div>
    );
  }
}

export default ConfirmEmail;
