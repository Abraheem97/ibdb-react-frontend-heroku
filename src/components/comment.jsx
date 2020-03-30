import React, { Component, useState } from "react";
import TimeAgo from "react-timeago";
import Modal from "react-bootstrap/Modal";
import { get_username } from "../Services/userService";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import axios from "axios";
import Cookies from "js-cookie";
import { Jumbotron } from "react-bootstrap";
import UserAvatar from "react-user-avatar";

class Comment extends Component {
  state = {
    replyBody: "",
    user: "",
    avatar: ""
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

  componentWillMount() {
    get_username(this.props.comment.user_id).then(resp => {
      this.setState({
        user: resp.email.substring(0, resp.email.indexOf("@")),
        avatar: resp.image_url
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
      (Cookies.get("user_role") && Cookies.get("user_role") != "4")
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

    return (
      <React.Fragment>
        <h1>
          {this.state.user && (
            <UserAvatar
              size="80"
              name={this.state.user.slice(0, 2).toUpperCase()}
              src={this.state.avatar}
              style={{ display: "inline-block" }}
            />
          )}
          <h1>{this.state.user} says</h1>
        </h1>
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
        {this.canEditComment() && (
          <EditModal
            comment={comment}
            handleResponse={this.handleEditResponse}
            book_id={this.props.book_id}
          />
        )}
        {this.canDeleteComment() && (
          <Button
            size="sm"
            variant="outline-danger"
            onClick={this.handleDelete}
            style={{ marginLeft: 5 }}
          >
            Delete
          </Button>
        )}
        {this.props.parentIndex < 17 &&
          this.props.replies.map((comment, index) => (
            <div key={comment.id} style={{ paddingLeft: 40, paddingTop: 20 }}>
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
        {this.props.parentIndex >= 17 &&
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
      <Button variant="outline" size="sm" onClick={handleShow}>
        Reply
      </Button>

      <Modal show={modalIsOpen} onHide={handleClose} animation={false}>
        <Modal.Header>
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
              <button class="btn sm" type="submit">
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
          console.log(errors);
        }
      });
  };

  return (
    <React.Fragment>
      <Button variant="outline" size="sm" onClick={handleShow}>
        Edit
      </Button>

      <Modal show={modalIsOpen} onHide={handleClose} animation={false}>
        <Modal.Header>
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
              <button class="btn sm" type="submit">
                Comment
              </button>
            </Form.Group>
          </Form>
        </Modal.Body>
      </Modal>
    </React.Fragment>
  );
}
