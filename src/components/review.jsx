import React, { Component, useState } from "react";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import StarRatings from "react-star-ratings";
import { get_username } from "../Services/userService";
import Cookies from "js-cookie";
import Button from "react-bootstrap/Button";
import axios from "axios";

class Review extends Component {
  state = { user: "" };
  buttonStyles = {
    cursor: "pointer",
    marginTop: 5,
    marginBottom: 0,
    marginRight: 2,
    position: "absolute",
    right: 20,
    paddingLeft: 0,
  };
  componentDidMount() {
    get_username(this.props.review.user_id).then((resp) => {
      this.setState({ user: resp.email.substring(0, resp.email.indexOf("@")) });
    });
  }
  canDeleteReview() {
    let canDelete = false;
    if (
      Cookies.get("user_id") == this.props.review.user_id ||
      (Cookies.get("S61hskksddsai") && Cookies.get("S61hskksddsai") !== "4")
    )
      canDelete = true;
    else canDelete = false;

    return canDelete;
  }
  canEditReview() {
    let canDelete = false;
    if (Cookies.get("user_id") == this.props.review.user_id) canDelete = true;
    else canDelete = false;

    return canDelete;
  }
  handleDelete = () => {
    axios({
      method: "delete",
      url: `${process.env.REACT_APP_API_URL}/books/${this.props.review.book_id}/reviews/${this.props.review.id}`,
      data: {
        user_id: Cookies.get("user_id"),
      },

      headers: { "X-User-Token": Cookies.get("user_authentication_token") },
    }).then((res) => this.props.handleReviewDelete(res.data));
  };

  render() {
    return (
      <div
        className="box container"
        style={{
          borderRadius: 6,
          padding: 2,
          marginBottom: 20,
          boxShadow: "0px 3px 0px 0px rgba(0, 0, 0, 0.05)",
        }}
      >
        {this.canDeleteReview() && (
          <i
            className="fas fa-trash-alt"
            style={this.buttonStyles}
            onClick={this.handleDelete}
          ></i>
        )}
        <StarRatings
          rating={this.props.review.rating}
          starRatedColor="gold"
          numberOfStars={5}
          name="rating"
          starDimension="27px"
          starSpacing="5px"
          starEmptyColor="darkgrey"
        />
        {this.canEditReview() && (
          <EditModal
            review={this.props.review}
            handleResponse={this.props.handleEditResponse}
          />
        )}
        {this.props.details && (
          <pre style={{ marginTop: 15, fontFamily: "Source Sans Pro" }}>
            {this.props.review.comment}
          </pre>
        )}
        {!this.props.details && (
          <p style={{ marginTop: 15, fontFamily: "Source Sans Pro" }}>
            {this.props.review.comment}
          </p>
        )}

        <p style={{ fontWeight: "bold", fontSize: 14 }}>
          {" "}
          Submitted by {this.state.user}
        </p>
      </div>
    );
  }
}

export default Review;

function EditModal(params) {
  const [modalIsOpen, setModalIsOpen] = useState(false);

  const [Rating, setRating] = useState(1);

  const changeRating = (newRating) => {
    setRating(newRating);
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
  const buttonStyles = {
    cursor: "pointer",
    marginTop: 5,
    marginBottom: 0,
    marginRight: 25,
    position: "absolute",
    right: 20,
    paddingLeft: 0,
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    handleClose();

    axios({
      method: "patch",
      url: `${process.env.REACT_APP_API_URL}/books/${params.review.book_id}/reviews/${params.review.id}`,

      data: {
        review: {
          user_id: Cookies.get("user_id"),
          comment: e.target.Reply.value,
          rating: Rating,
        },
      },
      headers: { "X-User-Token": Cookies.get("user_authentication_token") },
    })
      .then((res) => params.handleResponse(res))
      .catch((errors) => {
        if (errors) {
        }
      });
  };

  return (
    <React.Fragment>
      <i
        className="fas fa-pencil-alt"
        style={buttonStyles}
        onClick={handleShow}
      />

      <Modal show={modalIsOpen} onHide={handleClose} animation={false}>
        <Modal.Header style={{ justifyContent: "center" }}>
          <Modal.Title>Tell us about the book</Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ textAlign: "center" }}>
          <div>
            <StarRatings
              rating={Rating}
              starRatedColor="gold"
              changeRating={changeRating}
              numberOfStars={5}
              name="rating"
              starDimension="35px"
              starSpacing="5px"
              starEmptyColor="darkgrey"
              starHoverColor="gold"
            />
          </div>
          <br></br>
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="body">
              <textarea
                autoFocus
                required
                className="form-control rounded-0"
                name="Reply"
                rows="7"
                maxlength="100"
                style={{
                  background: "none",
                  resize: "none",
                  overflow: "hidden",
                }}
                defaultValue={params.review.comment}
              ></textarea>
            </Form.Group>
            <Form.Group>
              <Button variant="outline" type="submit">
                Add review
              </Button>
            </Form.Group>
          </Form>
        </Modal.Body>
      </Modal>
    </React.Fragment>
  );
}
