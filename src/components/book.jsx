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
import ClipLoader from "react-spinners/ClipLoader";
import InfiniteScroll from "react-infinite-scroll-component";
import { hasReviewedBook } from "../Services/userService";

class Book extends Component {
  state = {
    book: {},
    id: {},
    comments: [],
    reviews: [],
    currentUserHasReviewedBook: {},
    imageUrl: "https://picsum.photos/250/300",
    currentIndex: 0,
    numOfComments: 2,
    loading: true,
  };

  imageStyles = {
    width: 250,
    height: 300,
    alignItems: "center",
    justifyContent: "center",
    textAlign: "center",
    margin: 5,
  };

  textCenter = {
    textAlign: "center",
  };

  fetchMoreData = () => {
    this.setState({
      currentIndex: this.state.currentIndex + this.state.numOfComments,
    });
    fetch(
      `${process.env.REACT_APP_API_URL}/comments/${this.props.match.params.id}/${this.state.currentIndex}/${this.state.numOfComments}`
    )
      .then((res) => res.json())
      .then((data) => {
        if (data.length == 0) {
          this.setState({ loading: false });
        }
        setTimeout(() => {
          this.setState({ comments: this.state.comments.concat(data) });
        }, 900);
      });
  };

  handleEditReview = (review) => {
    let reviews = this.state.reviews.filter((m) => m.id !== review.data.id);
    reviews = [review.data, ...reviews];
    this.setState({ reviews });
  };

  handleCommentSubmit = (comment) => {
    const comments = [comment, ...this.state.comments];
    this.setState({ comments });
  };

  handleReplySubmit = (reply) => {
    const comments = [reply, ...this.state.comments];
    this.setState({ comments });
  };

  handleCommentDelete = (comment) => {
    const comments = this.state.comments.filter((m) => m.id !== comment.id);

    this.setState({ comments: comments });
  };

  handleEditCommentResponse = (comment) => {
    let comments = this.state.comments.filter((m) => m.id !== comment.id);
    comments = [comment, ...comments];
    this.setState({ comments });
  };
  handleReviewSubmit = (review) => {
    const reviews = [review, ...this.state.reviews];
    this.setState({ reviews, currentUserHasReviewedBook: true });
  };
  handleReviewDelete = (review) => {
    const reviews = this.state.reviews.filter((m) => m.id !== review.id);
    this.setState({ reviews: reviews, currentUserHasReviewedBook: false });
  };
  componentDidMount() {
    Boolean(Cookies.get("isLoggedIn")) &&
      hasReviewedBook(Cookies.get("user_id"), this.props.match.params.id).then(
        (res) => {
          this.setState({ currentUserHasReviewedBook: res.data.hasReviewed });
        }
      );

    fetch(
      `${process.env.REACT_APP_API_URL}/comments/${this.props.match.params.id}/${this.state.currentIndex}/${this.state.numOfComments}`
    )
      .then((response) => response.json())
      .then((response) => {
        console.log(response);
        this.setState({ comments: response });
      });

    this.setState({ id: this.props.match.params.id });
    getBook(parseInt(this.props.match.params.id)).then((resp) => {
      this.setState({ book: resp });
    });

    getReviews(parseInt(this.props.match.params.id)).then((resp) => {
      this.setState({ reviews: resp });
    });
  }

  getReplies = async (id) => {
    let replies = [];
    const res = await fetch(`${process.env.REACT_APP_API_URL}/replies/${id}`, {
      method: "GET",
    });
    replies = await res.json();
    return replies;
  };

  handleBookDelete = () => {
    axios({
      method: "delete",
      url: `${process.env.REACT_APP_API_URL}/books/${this.state.id}`,

      headers: { "X-User-Token": Cookies.get("user_authentication_token") },
    }).then(this.props.history.push("/not-found"));
  };

  render() {
    let parentComments = this.state.comments.filter(
      (comment) => comment.parent_id === null
    );

    return (
      <React.Fragment>
        <div className="row">
          <div className="col" style={this.textCenter}>
            <div className="thumbnail thumb-box">
              <div className="caption">
                <h1>{this.state.book.title}</h1>
                <div>
                  <img
                    style={this.imageStyles}
                    src={this.state.book.image_url}
                    // src={`${process.env.REACT_APP_API_URL}/assets/${this.state.book.image_file_name}`}
                    alt="bookcover.jpg"
                  />
                </div>
                <Link to={`/author/${this.state.book.author_id}`}>
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
              {Cookies.get("S61hskksddsai") == 1 && (
                <Button
                  variant="outline-danger"
                  onClick={this.handleBookDelete}
                  size="sm"
                  style={{ marginLeft: 5, marginTop: 4 }}
                >
                  Delete
                </Button>
              )}
            </div>
          </div>

          <div className="col-md-7 col-md-offset-1" style={this.textCenter}>
            <h1>Reviews</h1>
            <br />
            {this.state.reviews.length === 0 && (
              <h4 style={{ margin: 20 }}>No reviews? Add one!</h4>
            )}
            {this.state.reviews.slice(0, 2).map((review) => (
              <Review
                handleEditResponse={this.handleEditReview}
                key={review.id}
                handleReviewDelete={this.handleReviewDelete}
                review={review}
                details={false}
              />
            ))}
            {this.state.reviews.length > 0 && (
              <Link to={`/books/${this.state.id}/reviews`}>Show all</Link>
            )}
          </div>
        </div>

        <div className="row">
          <div className="col">
            <div style={this.textCenter}>
              <h1 style={{ marginBottom: 0 }}> Comments</h1>

              <hr />

              <br></br>
              {Boolean(Cookies.get("isLoggedIn")) && (
                <CommentForm
                  handleSubmit={this.handleCommentSubmit}
                  book_id={this.state.id}
                />
              )}
              {!Boolean(Cookies.get("isLoggedIn")) && (
                <p style={{ marginBottom: 20, marginTop: 0 }}>
                  You need to <Link to="/login">login</Link> to comment
                </p>
              )}
            </div>
            <InfiniteScroll
              style={{ overflow: "none" }}
              dataLength={this.state.comments.length}
              next={this.fetchMoreData}
              hasMore={this.state.loading}
              loader={
                <div
                  className="sweet-loading"
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    margin: 10,
                  }}
                >
                  <ClipLoader
                    size={50}
                    color={"#123abc"}
                    loading={this.state.loading}
                  />
                </div>
              }
            >
              <div className="commentPane">
                {parentComments.map((comment, index) => (
                  <div
                    key={comment.id}
                    className="box"
                    style={{
                      borderRadius: 30,
                      border: "solid 1px",
                    }}
                  >
                    <Comment
                      handleEditResponse={this.handleEditCommentResponse}
                      handleResponse={this.handleReplySubmit}
                      handleCommentDelete={this.handleCommentDelete}
                      book_id={this.state.id}
                      comments={this.state.comments}
                      comment={comment}
                      parentIndex={0}
                    />
                  </div>
                ))}
              </div>
            </InfiniteScroll>
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

  const changeRating = (newRating) => {
    setRating(newRating);
  };
  const handleShow = () => setModalIsOpen(true);

  const handleSubmit = (e) => {
    e.preventDefault();
    handleClose();

    axios({
      method: "post",
      url: `${process.env.REACT_APP_API_URL}/books/${params.book_id}/reviews`,

      data: {
        review: {
          user_id: Cookies.get("user_id"),
          comment: e.target.Reply.value,
          rating: Rating,
        },
      },
      headers: { "X-User-Token": Cookies.get("user_authentication_token") },
    })
      .then((res) => params.handleResponse(res.data))
      .catch((errors) => {
        if (errors) {
        }
      });
  };

  return (
    <div>
      <button size="sm" onClick={handleShow} style={{ margin: 5 }}>
        Add a review
      </button>

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
              starEmptyColor="lightblue"
              starHoverColor="gold"
            />
          </div>
          <br></br>
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="body">
              <textarea
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
    </div>
  );
}
