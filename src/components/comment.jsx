import React, { Component, useState } from "react";
import TimeAgo from "react-timeago";
import Modal from "react-bootstrap/Modal";
import { get_username } from "../Services/userService";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import axios from "axios";
import Cookies from "js-cookie";
import UserAvatar from "react-user-avatar";

class Comment extends Component {
  state = {
    replyBody: "",
    user: { firstName: "A", lastName: "A" },
    avatar: "",
    email: ""
  };

  commentImageStyles = {
    width: 120,
    height: 150
  };

  buttonStyles = {
    cursor: "pointer",
    marginLeft: 7
  };
  handleDelete = () => {
    axios({
      method: "delete",
      url: `${process.env.REACT_APP_API_URL}/books/${this.props.comment.book_id}/comments/${this.props.comment.id}`,
      data: {
        user_id: Cookies.get("user_id")
      },

      headers: { "X-User-Token": Cookies.get("user_authentication_token") }
    }).then(res => this.props.handleCommentDelete(res.data));
  };

  componentDidMount() {
    get_username(this.props.comment.user_id).then(resp => {
      this.setState({
        user: resp,
        avatar: resp.image_url,
        email: resp.email.substring(0, resp.email.indexOf("@"))
      });
    });
  }
  handleResponse = res => {
    this.props.handleResponse(res.data);
  };
  handleEditResponse = res => {
    this.props.handleEditResponse(res.data);
  };

  handleCommentDelete = res => {
    this.props.handleCommentDelete(res.data);
  };

  canDeleteComment() {
    let canDelete = false;
    if (
      Cookies.get("user_id") == this.props.comment.user_id ||
      (Cookies.get("user_role") && Cookies.get("user_role") !== "4")
    )
      canDelete = true;
    else canDelete = false;

    return canDelete;
  }

  canEditComment() {
    let canDelete = false;
    if (Cookies.get("user_id") == this.props.comment.user_id) canDelete = true;
    else canDelete = false;

    return canDelete;
  }

  getInitials = () => {
    return this.state.user;
  };

  render() {
    let comment = this.props.comment;
    let action = "";
    if (comment.parent_id) {
      action = "replies";
    } else action = "says";
    return (
      <React.Fragment>
        <h1 style={{ fontSize: 25 }}>
          {this.state.user && this.state.avatar && (
            <UserAvatar
              size="60"
              name={
                this.state.user.firstName.toUpperCase() +
                " " +
                this.state.user.lastName.toUpperCase()
              }
              src={this.state.avatar}
              style={{ display: "inline-block" }}
            />
          )}
          {this.state.user && !this.state.avatar && (
            <UserAvatar
              size="60"
              name={
                this.state.user.firstName.toUpperCase() +
                " " +
                this.state.user.lastName.toUpperCase()
              }
              style={{ display: "inline-block" }}
            />
          )}
          <br />
          {"  "} {this.state.user.firstName} {action}{" "}
        </h1>
        <div style={{ textAlign: "center" }}>
          {comment.image_url && (
            <img
              src={comment.image_url}
              style={this.commentImageStyles}
              alt="image"
            />
          )}
        </div>

        <p style={{ margin: 0, padding: 0, fontFamily: "sans-serif" }}>
          {comment.body}
        </p>
        <p>
          <TimeAgo
            date={comment.created_at}
            style={{ marginRight: 10, fontSize: 12 }}
          />
          {Cookies.get("isLoggedIn") && (
            <MyModal
              parent_id={comment.id}
              parent_body={comment.body}
              book_id={this.props.book_id}
              handleResponse={this.handleResponse}
            />
          )}
          {this.canEditComment() && (
            <EditModal
              comment={comment}
              handleResponse={this.handleEditResponse}
              book_id={this.props.book_id}
            />
          )}
          {this.canDeleteComment() && (
            <i
              style={this.buttonStyles}
              className="fas fa-trash-alt"
              onClick={() => {
                if (
                  window.confirm("Are you sure you wish to delete this item?")
                )
                  this.handleDelete();
              }}
            />
          )}
        </p>

        {this.props.parentIndex < 12 &&
          this.props.replies.map((comment, index) => (
            <div
              className="dont-break-out"
              key={comment.id}
              style={{ paddingLeft: 40, paddingTop: 20 }}
            >
              <Comment
                parentIndex={this.props.parentIndex + 1}
                handleEditResponse={this.props.handleEditResponse}
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
        {this.props.parentIndex >= 12 &&
          this.props.replies.map((comment, index) => (
            <div key={comment.id} style={{ paddingTop: 20 }}>
              <Comment
                parentIndex={this.props.parentIndex + 1}
                handleEditResponse={this.props.handleEditResponse}
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
  const buttonStyles = {
    cursor: "pointer"
  };

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
      <i
        className="fas fa-reply-all"
        onClick={handleShow}
        style={buttonStyles}
      />

      <Modal show={modalIsOpen} onHide={handleClose} animation={false}>
        <Modal.Header style={{ justifyContent: "center" }}>
          <Modal.Title>Replying to</Modal.Title>
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
                style={{ background: "none", resize: "none" }}
              ></textarea>
            </Form.Group>
            <Form.Group>
              <button className="btn sm" type="submit">
                Reply
              </button>
            </Form.Group>
          </Form>
        </Modal.Body>
      </Modal>
    </React.Fragment>
  );
}

function EditModal(params) {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const buttonStyles = {
    cursor: "pointer",
    padding: 10,
    marginLeft: 7
  };
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
      method: "patch",
      url: `${process.env.REACT_APP_API_URL}/books/${params.book_id}/comments/${params.comment.id}`,

      data: {
        comment: {
          user_id: Cookies.get("user_id"),
          body: e.target.Reply.value
        }
      },
      headers: { "X-User-Token": Cookies.get("user_authentication_token") }
    })
      .then(res => params.handleResponse(res))
      .catch(errors => {
        if (errors) {
        }
      });
  };

  return (
    <React.Fragment>
      <i
        className="fas fa-pencil-alt"
        onClick={handleShow}
        style={buttonStyles}
      />

      <Modal show={modalIsOpen} onHide={handleClose} animation={false}>
        <Modal.Header style={{ justifyContent: "center" }}>
          <Modal.Title>Edit comment</Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ textAlign: "center" }}>
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="body">
              <textarea
                autoFocus
                required
                className="form-control rounded-0"
                name="Reply"
                rows="5"
                style={{ background: "none", resize: "none" }}
                defaultValue={params.comment.body}
              ></textarea>
            </Form.Group>
            <Form.Group>
              <button className="btn sm" type="submit">
                Comment
              </button>
            </Form.Group>
          </Form>
        </Modal.Body>
      </Modal>
    </React.Fragment>
  );
}
