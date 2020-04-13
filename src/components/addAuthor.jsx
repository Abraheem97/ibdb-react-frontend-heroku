import React, { Component } from "react";

import axios from "axios";
import Cookies from "js-cookie";

import ClipLoader from "react-spinners/ClipLoader";

class AddAuthor extends Component {
  state = {
    author: {
      name: "",
      description: "",
      selectedFile: null,
    },
    errors: {},
    loading: false,
    newAuthor: false,
  };

  validateProperty = (input) => {
    if (input.name === "name") {
      if (input.value.trim() === "") return "Title is required.";
    }
  };
  componentWillMount() {
    if (Cookies.get("S61hskksddsai") === 4 || !Cookies.get("S61hskksddsai"))
      this.props.history.push("/not-found");
  }

  handleInput = (e) => {
    const errors = { ...this.state.errors };
    const errorMessage = this.validateProperty(e.currentTarget);
    if (errorMessage) errors[e.currentTarget.name] = errorMessage;
    else delete errors[e.currentTarget.name];

    const author = { ...this.state.author };
    author[e.currentTarget.name] = e.currentTarget.value;
    this.setState({ author, errors });
  };

  handleAuthorInput = (e) => {
    const errors = { ...this.state.errors };
    const author = { ...this.state.author };
    if (e.currentTarget.value === "") {
      errors.description = "Author name is required";
      author.description = "";
      this.setState({ author, errors });
    } else {
      delete errors.description;
      author.description = e.currentTarget.value;
      this.setState({ author, errors });
    }
  };

  validate = () => {
    const errors = {};

    const validImageTypes = ["image/gif", "image/jpeg", "image/png"];
    if (this.state.author.name.trim() === "") errors.name = "Name is required.";
    if (this.state.author.description.trim() === "")
      errors.description = "Description is required.";
    if (
      this.state.author.selectedFile &&
      this.state.author.selectedFile.size > 5079591
    )
      errors.avatar = "Image size should be less then 5MBs";
    if (
      this.state.author.selectedFile &&
      !validImageTypes.includes(this.state.author.selectedFile.type)
    )
      errors.avatar =
        "Unknown image format, please pick gif, jpeg or png images";

    return Object.keys(errors).length === 0 ? null : errors;
  };

  fileSelectHandler = (e) => {
    const author = { ...this.state.author };
    author.selectedFile = e.target.files[0];
    this.setState({ author });
  };

  handleSubmit = async (e) => {
    e.preventDefault();

    const errors = this.validate();
    this.setState({ errors: errors || {} });
    if (errors) return;
    this.setState({ loading: true });
    let file = null;

    if (this.state.author.selectedFile) {
      this.refs.btn.setAttribute("disabled", "disabled");
      const data = new FormData();
      data.append("file", this.state.author.selectedFile);
      data.append("upload_preset", "st2nr1uo");
      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${process.env.REACT_APP_CLOUDINARY_KEY}/image/upload`,
        {
          method: "POST",
          body: data,
        }
      );

      file = await res.json();
    }
    axios({
      method: "post",
      url: `${process.env.REACT_APP_API_URL}/v1/authors`,
      data: {
        name: this.state.author.name,
        description: this.state.author.description,
        user_id: Cookies.get("user_id"),
        image_url: file ? file.secure_url : "",
      },
      headers: { "X-User-Token": Cookies.get("user_authentication_token") },
    })
      .then((res) => {
        console.log(res);
        this.setState({ loading: false });
        this.props.history.push(`author/${res.data.id}`);
        window.location.reload(false);
      })
      .catch((errors) => {
        this.refs.btn.removeAttribute("disabled");
      });
  };

  render() {
    const { name, description } = this.state.author;

    return (
      <div>
        <h1>Add Author</h1>
        <br />
        <form onSubmit={this.handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Name</label>
            <input
              autoComplete="off"
              autoFocus
              value={name}
              onChange={this.handleInput}
              name="name"
              id="name"
              type="text"
              className="form-control"
              style={{ background: "none" }}
            />
            {this.state.errors.name && (
              <div className="alert alert-danger">{this.state.errors.name}</div>
            )}
          </div>
          <div className="form-group">
            <label htmlFor="author">Author description</label> <br></br>
            <textarea
              maxLength="150"
              rows="5"
              autoComplete="off"
              value={description}
              onChange={this.handleInput}
              name="description"
              id="name"
              type="text"
              className="form-control"
              style={{ background: "none", resize: "none", border: "double" }}
            />
            {this.state.errors.description && (
              <div className="alert alert-danger">
                {this.state.errors.description}
              </div>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="image">
              Add author cover <br></br>
              <input
                required
                style={{ background: "none" }}
                id="author_cover"
                type="file"
                name="image"
                onChange={this.fileSelectHandler}
              />
            </label>
            {this.state.errors.avatar && (
              <div className="alert alert-danger">
                {this.state.errors.avatar}
              </div>
            )}
          </div>
          <div
            className="sweet-loading"
            style={{ display: "flex", justifyContent: "center", margin: 10 }}
          >
            <ClipLoader
              size={50}
              color={"#123abc"}
              loading={this.state.loading}
            />
          </div>
          <button ref="btn" style={{ display: "block", margin: "0 auto" }}>
            Submit author
          </button>
        </form>
      </div>
    );
  }
}

export default AddAuthor;
