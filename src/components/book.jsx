import React, { Component, useState } from "react";
import { Link } from "react-router-dom";
import { getBook } from "../Services/bookService";
import { getComments } from "../Services/bookService";
import { getReviews } from "../Services/bookService";
import Comment from "./comment";
import Review from "./review";
import CommentForm from "./commentForm";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import axios from "axios";
import Cookies from "js-cookie";
import StarRatings from "react-star-ratings";
import { hasReviewedBook } from "../Services/userService";

class Book extends Component {
  state = {
    book: {},
    id: {},
    comments: [],
    reviews: [],
    currentUserHasReviewedBook: {},
    imageUrl: "https://picsum.photos/250/300"
  };

  imageStyles = {
    width: 250,
    height: 300,
    alignItems: "center",
    justifyContent: "center",
    textAlign: "center",
    margin: 5
  };

  textCenter = {
    textAlign: "center"
  };

  handleCommentSubmit = comment => {
    const comments = [comment, ...this.state.comments];
    this.setState({ comments });
  };

  handleReplySubmit = reply => {
    const comments = [reply, ...this.state.comments];
    this.setState({ comments });
  };

  handleCommentDelete = comment => {
    const comments = this.state.comments.filter(m => m.id !== comment.id);

    this.setState({ comments: comments });
  };
  handleReviewSubmit = review => {
    const reviews = [review, ...this.state.reviews];
    this.setState({ reviews, currentUserHasReviewedBook: true });
  };
  componentDidMount() {
    Boolean(Cookies.get("isLoggedIn")) &&
      hasReviewedBook(Cookies.get("user_id"), this.props.match.params.id).then(
        res => {
          this.setState({ currentUserHasReviewedBook: res.data.hasReviewed });
        }
      );

    this.setState({ id: this.props.match.params.id });
    getBook(parseInt(this.props.match.params.id)).then(resp => {
      this.setState({ book: resp });
    });

    getComments(parseInt(this.props.match.params.id)).then(resp => {
      this.setState({ comments: resp });
    });

    getReviews(parseInt(this.props.match.params.id)).then(resp => {
      this.setState({ reviews: resp });
    });
  }

  openBook = () => {};
  openBook = () => {};
  render() {
    let parentComments = this.state.comments.filter(
      comment => comment.parent_id === null
    );

    return (
      <React.Fragment>
        <div className="row">
          <div className="col-sm-6 col-md-4" style={this.textCenter}>
            <div className="thumbnail thumb-box">
              <div className="caption">
                <h3>{this.state.book.title}</h3>
                <div>
                  <img
                    style={this.imageStyles}
                    src="https://damonza.com/wp-content/uploads/portfolio/nonfiction/Set%20For%20Life%202.jpg"
                    // src={`${process.env.REACT_APP_API_URL}/assets/${this.state.book.image_file_name}`}
                    alt="bookcover.jpg"
                  />
                </div>
                <Link to={`/books/${this.state.book.id}/author`}>
                  By {this.state.book.author_name}
                </Link>
                {!this.state.currentUserHasReviewedBook &&
                  Boolean(Cookies.get("isLoggedIn")) && (
                    <ReviewModal
                      handleResponse={this.handleReviewSubmit}
                      book_id={this.state.id}
                    />
                  )}
              </div>
            </div>
          </div>

          <div className="col-md-7 col-md-offset-1" style={this.textCenter}>
            <h1>Reviews</h1>
            {this.state.reviews.length === 0 && (
              <h4 style={{ margin: 20 }}>No reviews? Add one!</h4>
            )}
            {this.state.reviews.slice(0, 2).map(review => (
              <Review
                user_id={review.user_id}
                key={review.id}
                rating={review.rating}
                comment={review.comment}
              />
            ))}
            {this.state.reviews.length > 2 && (
              <Link to={`/books/${this.state.id}/reviews`}>Show more</Link>
            )}
          </div>
        </div>
        <div className="row">
          <div className="col">
            <div style={this.textCenter}>
              <h1 style={{ marginBottom: 0 }}> Comments</h1>
              <br></br>
              {Boolean(Cookies.get("isLoggedIn")) && (
                <CommentForm
                  handleSubmit={this.handleCommentSubmit}
                  book_id={this.state.id}
                />
              )}
              {!Boolean(Cookies.get("isLoggedIn")) && (
                <h4 style={{ marginBottom: 20, marginTop: 0 }}>
                  You need to <Link to="/login">login</Link> to comment
                </h4>
              )}
            </div>
            {parentComments.map(comment => (
              <div key={comment.id} className="jumbotron">
                <Comment
                  handleResponse={this.handleReplySubmit}
                  handleCommentDelete={this.handleCommentDelete}
                  book_id={this.state.id}
                  comments={this.state.comments}
                  comment={comment}
                  replies={this.state.comments.filter(
                    reply => reply.parent_id === comment.id
                  )}
                />
              </div>
            ))}
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default Book;

function ReviewModal(params) {
  const [modalIsOpen, setModalIsOpen] = useState(false);

  const [Rating, setRating] = useState(1);

  const handleClose = () => {
    setModalIsOpen(false);
  };

  const changeRating = newRating => {
    setRating(newRating);
  };
  const handleShow = () => setModalIsOpen(true);

  const handleSubmit = e => {
    e.preventDefault();
    handleClose();

    axios({
      method: "post",
      url: `${process.env.REACT_APP_API_URL}/books/${params.book_id}/reviews`,

      data: {
        review: {
          user_id: Cookies.get("user_id"),
          comment: e.target.Reply.value,
          rating: Rating
        }
      },
      headers: { "X-User-Token": Cookies.get("user_authentication_token") }
    })
      .then(res => params.handleResponse(res.data))
      .catch(errors => {
        if (errors) {
          console.log(errors);
        }
      });
  };

  return (
    <div>
      <Button size="sm" onClick={handleShow} style={{ margin: 5 }}>
        Add a review
      </Button>

      <Modal show={modalIsOpen} onHide={handleClose} animation={false}>
        <Modal.Header closeButton>
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
              ></textarea>
            </Form.Group>
            <Form.Group>
              <Button variant="primary" type="submit">
                Add review
              </Button>
            </Form.Group>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
}
