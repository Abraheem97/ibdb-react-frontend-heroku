import React, { Component } from "react";
import axios from "axios";
import Cookies from "js-cookie";

class CommentForm extends Component {
  state = { body: "", errors: {} };

  handleInput = e => {
    let body = { ...this.state.body };
    body = e.currentTarget.value;
    this.setState({ body });
  };

  handleSubmit = e => {
    e.preventDefault();

    axios({
      method: "post",
      url: `http://localhost:3001/books/${this.props.book_id}/comments`,

      data: {
        comment: {
          book_id: this.props.book_id,

          user_id: Cookies.get("user_id"),
          body: this.state.body
        }
      }
    }).then(this.props.handleSubmit());
  };

  render() {
    console.log("commentform", this.props.book_id);
    return (
      <div id="commentForm">
        <form
          onSubmit={this.handleSubmit}
          style={{ marginBottom: 20, marginTop: 0 }}
        >
          <div className="form-group">
            <input
              autoFocus
              value={this.state.body}
              onChange={this.handleInput}
              id="body"
              type="text"
              className="form-control"
            />
          </div>
          <button ref="btn" className="btn btn-primary">
            Comment
          </button>
        </form>
      </div>
    );
  }
}

export default CommentForm;
