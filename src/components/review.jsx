import React, { Component } from "react";
class Review extends Component {
  render() {
    const { rating, comment } = this.props;
    return (
      <div className="jumbotron">
        <p>{rating}</p>
        <p>{comment}</p>
        Submitted by user
      </div>
    );
  }
}

export default Review;
