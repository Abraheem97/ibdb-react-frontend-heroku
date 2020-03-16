import React, { Component } from "react";
import { Link } from "react-router-dom";

import { getBook } from "../Services/bookService";

import { getComments } from "../Services/bookService";

import { getReviews } from "../Services/bookService";

import Comment from "./comment";
import Review from "./review";
import CommentForm from "./commentForm";
import Cookies from "js-cookie";

class Book extends Component {
  state = {
    book: {},
    id: {},
    comments: [],
    reviews: []
  };

  imageStyles = {
    width: 250,
    height: 300,
    alignItems: "center",
    justifyContent: "center",
    textAlign: "center"
  };

  textCenter = {
    textAlign: "center"
  };

  handleCommentSubmit = () => {
    getComments(parseInt(this.props.match.params.id)).then(resp => {
      this.setState({ comments: resp });
    });
  };
  componentDidMount() {
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
                    src={`http://localhost:3001/assets/${this.state.book.image_file_name}`}
                    alt="bookcover.jpg"
                  />
                </div>
                <Link to={`/books/${this.state.book.id}/author`}>
                  By {this.state.book.author_name}
                </Link>
              </div>
            </div>
          </div>

          <div className="col-md-7 col-md-offset-1" style={this.textCenter}>
            <h1>Reviews</h1>
            {this.state.reviews.map(review => (
              <Review
                key={review.id}
                rating={review.rating}
                comment={review.comment}
              />
            ))}
          </div>
        </div>
        <div className="row">
          <div className="col">
            <div style={this.textCenter}>
              <h1> Comments</h1>
              <br></br>
              <CommentForm
                handleSubmit={this.handleCommentSubmit}
                book_id={this.state.id}
              />
            </div>
            {parentComments.map(comment => (
              <div className="jumbotron">
                <Comment
                  comments={this.state.comments}
                  key={comment.id}
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
