import React, { Component, useState } from "react";
import TimeAgo from "react-timeago";
import Modal from "react-bootstrap/Modal";
import { get_username } from "../Services/userService";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import axios from "axios";
import Cookies from "js-cookie";
import { Jumbotron } from "react-bootstrap";

class Comment extends Component {
  state = {
    replyBody: "",
    user: ""
  };
  handleDelete = () => {
    axios({
      method: "delete",
      url: `${process.env.REACT_APP_API_URL}/books/${this.props.comment.book_id}/comments/${this.props.comment.id}`,

      headers: { "X-User-Token": Cookies.get("user_authentication_token") }
    }).then(res => this.props.handleCommentDelete(res.data));
  };

  componentDidMount() {
    get_username(this.props.comment.user_id).then(resp => {
      this.setState({ user: resp.email.substring(0, resp.email.indexOf("@")) });
    });
  }
  handleResponse = res => {
    this.props.handleResponse(res.data);
  };

  handleCommentDelete = res => {
    this.props.handleCommentDelete(res.data);
  };

  canDeleteComment() {
    let canDelete = false;
    if (
      Cookies.get("user_id") == this.props.comment.user_id ||
      Cookies.get("user_role") != "4"
    )
      canDelete = true;
    else canDelete = false;

    return canDelete;
  }
  render() {
    let comment = this.props.comment;

    return (
      <React.Fragment>
        <h3>
          <img
            src="https://styleguide.europeana.eu/images/fpo_avatar.png"
            alt="avatar"
            style={{ height: 59, width: 59, margin: 10 }}
          />
          {this.state.user} says
        </h3>
        {comment.body}
        <p>
          <TimeAgo date={comment.created_at} />
        </p>
        {Cookies.get("isLoggedIn") && (
          <MyModal
            parent_id={comment.id}
            parent_body={comment.body}
            book_id={this.props.book_id}
            handleResponse={this.handleResponse}
          />
        )}

        {this.canDeleteComment() && (
          <Button
            variant="outline-danger"
            size="sm"
            onClick={this.handleDelete}
            style={{ marginLeft: 5 }}
          >
            Delete
          </Button>
        )}
        {this.props.replies &&
          this.props.replies.map(comment => (
            <div key={comment.id} style={{ paddingLeft: 40, paddingTop: 20 }}>
              <Comment
                handleResponse={this.props.handleResponse}
                handleCommentDelete={this.props.handleCommentDelete}
                book_id={this.props.book_id}
                comments={this.props.comments}
                comment={comment}
                replies={this.props.comments.filter(
                  reply => reply.parent_id === comment.id
                )}
              />
            </div>
          ))}
      </React.Fragment>
    );
  }
}

export default Comment;

function MyModal(params) {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const handleClose = () => {
    setModalIsOpen(false);
  };
  const handleShow = () => setModalIsOpen(true);

  // const comment_username = () => {
  //   return get_username(Cookies.get("user_id")).then(res => {
  //     const username = res.email.substring(0, res.email.indexOf("@"));
  //     return username;
  //   });
  // };

  const handleSubmit = e => {
    e.preventDefault();
    handleClose();

    axios({
      method: "post",
      url: `${process.env.REACT_APP_API_URL}/books/${params.book_id}/comments`,

      data: {
        comment: {
          parent_id: params.parent_id,
          user_id: Cookies.get("user_id"),
          body: e.target.Reply.value
        }
      },
      headers: { "X-User-Token": Cookies.get("user_authentication_token") }
    })
      .then(res => params.handleResponse(res))
      .catch(errors => {
        if (errors) {
          console.log(errors);
        }
      });
  };

  return (
    <React.Fragment>
      <Button variant="outline-primary" size="sm" onClick={handleShow}>
        Reply
      </Button>

      <Modal show={modalIsOpen} onHide={handleClose} animation={false}>
        <Modal.Header closeButton>
          <Modal.Title style={{ paddingLeft: 175 }}>Replying to</Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ textAlign: "center" }}>
          <div
            className="jumbotron"
            style={{ borderRadius: 6, padding: 2, marginBottom: 20 }}
          >
            <p style={{ marginTop: 10 }}> {params.parent_body}</p>
          </div>
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="body">
              <textarea
                autoFocus
                required
                className="form-control rounded-0"
                name="Reply"
                rows="5"
              ></textarea>
            </Form.Group>
            <Form.Group>
              <Button variant="primary" type="submit">
                Reply
              </Button>
            </Form.Group>
          </Form>
        </Modal.Body>
      </Modal>
    </React.Fragment>
  );
}
