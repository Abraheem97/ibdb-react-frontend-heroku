import React, { Component } from "react";

import axios from "axios";
import Cookies from "js-cookie";
import { getAuthorNames } from "../Services/authorService";
import ClipLoader from "react-spinners/ClipLoader";

class AddBook extends Component {
  state = {
    book: {
      title: "",
      author_name: "",
      selectedFile: null,
      authorImageSelectedFile: null,
    },
    errors: {},
    authors: [],
    loading: false,
  };

  validateProperty = (input) => {
    if (input.name === "title") {
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

    const book = { ...this.state.book };
    book[e.currentTarget.name] = e.currentTarget.value;
    this.setState({ book, errors });
  };

  handleAuthorInput = (e) => {
    const errors = { ...this.state.errors };
    const book = { ...this.state.book };
    if (e.currentTarget.value === "") {
      errors.author_name = "Author name is required";
      book.author_name = "";
      this.setState({ book, errors });
    } else {
      delete errors.author_name;
      book.author_name = e.currentTarget.value;
      this.setState({ book, errors });
    }
  };

  validate = () => {
    const errors = {};
    const validImageTypes = ["image/gif", "image/jpeg", "image/png"];

    if (this.state.book.title.trim() === "")
      errors.title = "Title is required.";
    if (this.state.book.author_name.trim() === "")
      errors.author_name = "Author name is required.";
    if (
      this.state.book.selectedFile &&
      this.state.book.selectedFile.size > 5079591
    )
      errors.avatar = "Image size should be less then 5MBs";
    if (
      this.state.book.selectedFile &&
      !validImageTypes.includes(this.state.book.selectedFile.type)
    )
      errors.avatar =
        "Unknown image format, please pick gif, jpeg or png images";

    return Object.keys(errors).length === 0 ? null : errors;
  };

  fileSelectHandler = (e) => {
    const book = { ...this.state.book };
    book.selectedFile = e.target.files[0];
    this.setState({ book });
  };

  handleSubmit = async (e) => {
    e.preventDefault();

    const errors = this.validate();
    this.setState({ errors: errors || {} });
    if (errors) return;
    else {
      this.setState({ loading: true });
      let file = null;

      if (this.state.book.selectedFile) {
        this.refs.btn.setAttribute("disabled", "disabled");
        const data = new FormData();
        data.append("file", this.state.book.selectedFile);
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
        url: `${process.env.REACT_APP_API_URL}/books`,
        data: {
          title: this.state.book.title,
          author_name: this.state.book.author_name,
          user_id: Cookies.get("user_id"),
          image_url: file ? file.secure_url : "",
        },
        headers: { "X-User-Token": Cookies.get("user_authentication_token") },
      })
        .then((res) => {
          this.setState({ loading: false });
          this.props.history.push("/");
          window.location.reload(false);
          this.refs.btn.removeAttribute("disabled");
        })
        .catch((errors) => {
          this.refs.btn.removeAttribute("disabled");
        });
    }
  };

  componentDidMount() {
    getAuthorNames().then((res) => this.setState({ authors: res }));
  }

  render() {
    const { title } = this.state.book;

    return (
      <div>
        <h1>Add Book</h1>
        <br />
        <form onSubmit={this.handleSubmit}>
          <div className="form-group">
            <label htmlFor="title">Title</label>
            <input
              autoComplete="off"
              autoFocus
              value={title}
              onChange={this.handleInput}
              name="title"
              id="title"
              type="text"
              className="form-control"
              style={{ background: "none" }}
            />
            {this.state.errors.title && (
              <div className="alert alert-danger">
                {this.state.errors.title}
              </div>
            )}
          </div>
          <div className="form-group">
            <label htmlFor="author">Author name</label> <br></br>
            <select
              name="author"
              onChange={this.handleAuthorInput}
              style={{
                color: "rgba(0,0,0,0)",
                textShadow: "0 0 0 #000",
              }}
            >
              <option></option>
              {this.state.authors.map((obj) => (
                <option key={obj}>{obj}</option>
              ))}
              ;
            </select>
            {this.state.errors.author_name && (
              <div className="alert alert-danger">
                {this.state.errors.author_name}
              </div>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="image">
              Add book cover <br></br>
              <input
                required
                style={{ background: "none" }}
                id="book_cover"
                type="file"
                name="image"
                onChange={this.fileSelectHandler}
                accept="image/*"
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
            Submit book
          </button>
        </form>
      </div>
    );
  }
}

export default AddBook;
