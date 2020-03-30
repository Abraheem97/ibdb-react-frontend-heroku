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
    lineHeight: 0,
    width: 15,
    fontSize: 5,
    fonFamily: "tahoma",
    marginTop: 5,
    marginBottom: 0,
    marginRight: 2,
    position: "absolute",
    right: 20,
    paddingLeft: 0
  };
  componentDidMount() {
    get_username(this.props.review.user_id).then(resp => {
      this.setState({ user: resp.email.substring(0, resp.email.indexOf("@")) });
    });
  }
  canDeleteReview() {
    let canDelete = false;
    if (
      Cookies.get("user_id") == this.props.review.user_id ||
      (Cookies.get("user_role") && Cookies.get("user_role") != "4")
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
        user_id: Cookies.get("user_id")
      },

      headers: { "X-User-Token": Cookies.get("user_authentication_token") }
    }).then(res => this.props.handleReviewDelete(res.data));
  };

  render() {
    return (
      <div
        className="box container"
        style={{
          borderRadius: 6,
          padding: 2,
          marginBottom: 20,
          boxShadow: "0px 3px 0px 0px rgba(0, 0, 0, 0.05)"
        }}
      >
        {this.canDeleteReview() && (
          <Button
            variant="outline-danger"
            size="sm"
            onClick={this.handleDelete}
            style={this.buttonStyles}
          >
            x
          </Button>
        )}
        <StarRatings
          rating={this.props.review.rating}
          starRatedColor="gold"
          numberOfStars={5}
          name="rating"
          starDimension="27px"
          starSpacing="5px"
          starEmptyColor="white"
        />
        {this.canEditReview && (
          <EditModal
            review={this.props.review}
            handleResponse={this.props.handleEditResponse}
          />
        )}
        {this.props.details && (
          <pre style={{ marginTop: 15 }}>{this.props.review.comment}</pre>
        )}
        {!this.props.details && (
          <p style={{ marginTop: 15 }}>{this.props.review.comment}</p>
        )}

        <p> Submitted by {this.state.user}</p>
      </div>
    );
  }
}

export default Review;

function EditModal(params) {
  const [modalIsOpen, setModalIsOpen] = useState(false);

  const [Rating, setRating] = useState(1);

  const changeRating = newRating => {
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
    lineHeight: 0,
    width: 15,
    fontSize: 5,
    fonFamily: "tahoma",
    marginTop: 5,
    marginBottom: 0,
    marginRight: 20,
    position: "absolute",
    right: 20,
    paddingLeft: 0
  };
  const handleSubmit = e => {
    e.preventDefault();
    handleClose();

    axios({
      method: "patch",
      url: `${process.env.REACT_APP_API_URL}/books/${params.review.book_id}/reviews/${params.review.id}`,

      data: {
        review: {
          user_id: Cookies.get("user_id"),
          comment: e.target.Reply.value,
          rating: Rating
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
      <Button
        variant="outline-primary"
        size="sm"
        style={buttonStyles}
        onClick={handleShow}
      ></Button>

      <Modal show={modalIsOpen} onHide={handleClose} animation={false}>
        <Modal.Header>
          <Modal.Title style={{ paddingLeft: 118 }}>
            Tell us about the book
          </Modal.Title>
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
              starEmptyColor="lightblue"
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
                  overflow: "hidden"
                }}
              >
                {params.review.comment}
              </textarea>
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
