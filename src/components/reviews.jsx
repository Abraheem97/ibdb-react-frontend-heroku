import React, { Component } from "react";
import { getReviews } from "../Services/bookService";
import Review from "./review";

class Reviews extends Component {
  state = { reviews: [] };
  componentDidMount() {
    getReviews(parseInt(this.props.match.params.id)).then(resp => {
      this.setState({ reviews: resp });
    });
  }
  handleReviewDelete = review => {
    const reviews = this.state.reviews.filter(m => m.id !== review.id);

    this.setState({ reviews });
  };
  render() {
    return (
      <div className="col" style={{ textAlign: "center" }}>
        <h1 style={{ marginBottom: 50 }}>All Reviews</h1>
        {this.state.reviews.map(review => (
          <Review
            key={review.id}
            handleReviewDelete={this.handleReviewDelete}
            review={review}
          />
        ))}
      </div>
    );
  }
}

export default Reviews;
