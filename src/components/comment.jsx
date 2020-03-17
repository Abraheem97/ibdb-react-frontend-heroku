import React, { Component, useState } from "react";
import TimeAgo from "react-timeago";
import Modal from "react-bootstrap/Modal";
import { get_username } from "../Services/userService";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import axios from "axios";
import Cookies from "js-cookie";

function MyModal(params) {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const handleClose = () => {
    setModalIsOpen(false);
  };
  const handleShow = () => setModalIsOpen(true);

  const handleSubmit = e => {
    e.preventDefault();
    handleClose();

    axios({
      method: "post",
      url: `http://localhost:3001/books/${params.book_id}/comments`,

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
    <div>
      <Button variant="primary" size="sm" onClick={handleShow}>
        Reply
      </Button>

      <Modal show={modalIsOpen} onHide={handleClose} animation={false}>
        <Modal.Header closeButton>
          <Modal.Title>Replying to</Modal.Title>
        </Modal.Header>
        <Modal.Body>{params.parent_body}</Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group controlId="body">
            <Form.Control autoFocus type="text" name="Reply" required />
          </Form.Group>
          <Form.Group>
            <Button variant="primary" type="submit">
              Reply
            </Button>
          </Form.Group>
        </Form>
      </Modal>
    </div>
  );
}

class Comment extends Component {
  state = {
    replyBody: "",
    user: ""
  };

  componentDidMount() {
    get_username(this.props.comment.user_id).then(resp => {
      this.setState({ user: resp.email.substring(0, resp.email.indexOf("@")) });
    });
  }
  handleResponse = res => {
    this.props.handleResponse(res.data);
  };
  render() {
    let comment = this.props.comment;

    return (
      <React.Fragment>
        <h3>
          <img
            src="http://localhost:3001/assets/missing.png"
            alt="avatar"
            style={{ height: 59, width: 59 }}
          />
          {this.state.user} says
        </h3>
        {comment.body}
        <p>
          <TimeAgo date={comment.created_at} />
        </p>
        <MyModal
          parent_id={comment.id}
          parent_body={comment.body}
          book_id={this.props.book_id}
          handleResponse={this.handleResponse}
        />
        {this.props.replies &&
          this.props.replies.map(comment => (
            <div key={comment.id} style={{ paddingLeft: 40, paddingTop: 20 }}>
              <Comment
                handleResponse={this.props.handleResponse}
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
