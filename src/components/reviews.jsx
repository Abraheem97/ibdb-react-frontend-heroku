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
  render() {
    return (
      <div className="col" style={{ textAlign: "center" }}>
        <h1 style={{ marginBottom: 50 }}>All Reviews</h1>
        {this.state.reviews.map(review => (
          <Review
            user_id={review.user_id}
            key={review.id}
            rating={review.rating}
            comment={review.comment}
          />
        ))}
      </div>
    );
  }
}

export default Reviews;
