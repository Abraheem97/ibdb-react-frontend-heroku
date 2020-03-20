import React, { Component } from "react";
import StarRatings from "react-star-ratings";
import { get_username } from "../Services/userService";
import Cookies from "js-cookie";
import Button from "react-bootstrap/Button";
import axios from "axios";

class Review extends Component {
  state = { user: "" };
  buttonStyles = {
    lineHeight: 1,
    width: 25,
    fontSize: 10,
    fonFamily: "tahoma",
    marginTop: 5,
    marginBottom: 0,
    marginRight: 2,
    position: "absolute",
    right: 20
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

  handleDelete = () => {
    axios({
      method: "delete",
      url: `${process.env.REACT_APP_API_URL}/books/${this.props.review.book_id}/reviews/${this.props.review.id}`,

      headers: { "X-User-Token": Cookies.get("user_authentication_token") }
    }).then(res => this.props.handleReviewDelete(res.data));
  };

  render() {
    return (
      <div
        className="jumbotron"
        style={{ borderRadius: 6, padding: 2, marginBottom: 20 }}
      >
        {this.canDeleteReview() && (
          <Button
            variant="outline-danger"
            size="sm"
            onClick={this.handleDelete}
            style={this.buttonStyles}
          >
            X
          </Button>
        )}
        <StarRatings
          rating={this.props.review.rating}
          starRatedColor="gold"
          numberOfStars={5}
          name="rating"
          starDimension="27px"
          starSpacing="5px"
        />
        <p style={{ marginTop: 15 }}>{this.props.review.comment}</p>
        <p> Submitted by {this.state.user}</p>
      </div>
    );
  }
}

export default Review;
