import React, { Component } from "react";
import StarRatings from "react-star-ratings";
import { get_username } from "../Services/userService";

class Review extends Component {
  state = { user: "" };
  componentDidMount() {
    get_username(this.props.user_id).then(resp => {
      this.setState({ user: resp.email.substring(0, resp.email.indexOf("@")) });
    });
  }
  render() {
    const { rating, comment } = this.props;
    return (
      <div
        className="jumbotron"
        style={{ borderRadius: 6, padding: 2, marginBottom: 20 }}
      >
        <StarRatings
          rating={rating}
          starRatedColor="gold"
          numberOfStars={5}
          name="rating"
          starDimension="35px"
          starSpacing="5px"
        />
        <p>{comment}</p>
        Submitted by {this.state.user}
      </div>
    );
  }
}

export default Review;
