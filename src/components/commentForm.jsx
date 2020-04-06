import React, { Component } from "react";
import axios from "axios";
import Cookies from "js-cookie";

class CommentForm extends Component {
  state = { body: "", errors: {}, selectedFile: null };

  handleInput = e => {
    let body = { ...this.state.body };
    body = e.currentTarget.value;
    this.setState({ body });
  };

  fileSelectHandler = e => {
    let selectedFile = { ...this.state.selectedFile };
    selectedFile = e.target.files[0];
    this.setState({ selectedFile });
  };
  validate = () => {
    const errors = {};
    const validImageTypes = ["image/gif", "image/jpeg", "image/png"];

    if (this.state.selectedFile && this.state.selectedFile.size > 2079591)
      errors.wrong = "Image size should be less then 2mb";
    if (
      this.state.selectedFile &&
      !validImageTypes.includes(this.state.selectedFile.type)
    )
      errors.wrong =
        "Unknown image format, please pick gif, jpeg or png images";
    return Object.keys(errors).length === 0 ? null : errors;
  };

  handleSubmit = async e => {
    e.preventDefault();
    const errors = this.validate();
    this.setState({ errors: errors || {} });
    if (errors) return;

    const data = new FormData();
    let file = null;
    if (this.state.selectedFile) {
      this.refs.btn.setAttribute("disabled", "disabled");

      data.append("file", this.state.selectedFile);
      data.append("upload_preset", "st2nr1uo");
      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${process.env.REACT_APP_CLOUDINARY_KEY}/image/upload`,
        {
          method: "POST",
          body: data
        }
      );
      file = await res.json();
    }

    axios({
      method: "post",
      url: `${process.env.REACT_APP_API_URL}/books/${this.props.book_id}/comments`,

      data: {
        comment: {
          user_id: Cookies.get("user_id"),
          body: this.state.body,
          image_url: file ? file.url : ""
        }
      },
      headers: { "X-User-Token": Cookies.get("user_authentication_token") }
    })
      .then(res => {
        this.refs.btn.removeAttribute("disabled");
        this.props.handleSubmit(res.data);
        this.setState({ body: "", errors: {}, selectedFile: null });
      })
      .catch(errors => {
        if (errors) {
          let Myerrors = { ...this.state.errors };

          Myerrors.wrong = "Please sign in to make a comment";

          this.setState({ errors: Myerrors });
        }
      });
  };

  render() {
    return (
      <div id="commentForm">
        <form
          onSubmit={this.handleSubmit}
          style={{ marginBottom: 20, marginTop: 0 }}
        >
          <div className="form-group">
            <input
              required
              value={this.state.body}
              onChange={this.handleInput}
              id="body"
              type="text"
              className="form-control form-control-lg"
              style={{ background: "none" }}
            />
          </div>
          {this.state.errors.wrong && (
            <div className="alert alert-primary">{this.state.errors.wrong}</div>
          )}
          <div className="form-group" style={{ padding: 0, margin: 0 }}>
            <label htmlFor="file-input">
              <i className="fas fa-images" />
              <div className="image-upload">
                {this.state.selectedFile && (
                  <p style={{ paddingBottom: 0 }}>File selected</p>
                )}
                <input
                  id="file-input"
                  type="file"
                  name="image"
                  onChange={this.fileSelectHandler}
                  style={{ background: "none" }}
                  accept="image/*"
                />
              </div>
            </label>
          </div>

          <button ref="btn">Comment</button>
        </form>
      </div>
    );
  }
}

export default CommentForm;
